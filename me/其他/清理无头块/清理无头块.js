class UltimateBlockCleaner {
    getInfo() {
        return {
            id: 'ultimateBlockCleaner',
            name: '代码清理器',
            blockIconURI: 'https://raw.githubusercontent.com/Mirazstudio-offical/Dash_code_cleaner_extension/refs/heads/main/extension_icon.png',
            color1: '#8B4513',
            color2: '#A0522D',
            blocks: [
                {
                    func: 'removeHatlessBlocks',
                    blockType: Scratch.BlockType.BUTTON,
                    text: '删除没有帽块的孤立脚本',
                },
                {
                    func: 'removeEmptyHats',
                    blockType: Scratch.BlockType.BUTTON,
                    text: '删除孤立的帽块',
                }
            ]
        };
    }

    _getBlockly() {
        const vm = Scratch.vm;
        // TurboWarp 桌面/网页不同版本里入口可能不同，这里尽量都找
        return (vm && vm.extensionManager && vm.extensionManager._blockly) ||
            (Scratch && Scratch.gui && Scratch.gui.getBlockly && Scratch.gui.getBlockly()) ||
            null;
    }

    _refreshWorkspaceHard() {
        // 目标：让编辑器从 VM/Blocks 重新同步一次
        // TurboWarp 不同构建可能没有同名方法，所以这里做多重尝试
        const vm = Scratch.vm;

        try {
            // 尝试触发“工作区已修改”一类的刷新
            if (vm && vm.runtime && typeof vm.runtime.emit === 'function') {
                vm.runtime.emit('PROJECT_CHANGED');
                vm.runtime.emit('BLOCKS_CHANGED');
                vm.runtime.emit('targetsUpdate');
            }
        } catch (e) {}

        try {
            const blockly = this._getBlockly();
            const workspace = blockly && blockly.workspace;

            if (workspace) {
                // 触发一次 Blockly 自己的 change event，迫使 UI 重算
                if (blockly.Events && typeof blockly.Events.fire === 'function') {
                    const ev = new blockly.Events.Ui(null, 'refresh', null, null);
                    blockly.Events.fire(ev);
                }

                // 有些版本需要显式 resize 才会刷新渲染
                if (typeof workspace.resizeContents === 'function') workspace.resizeContents();
                if (typeof workspace.render === 'function') workspace.render();
                if (typeof blockly.svgResize === 'function') blockly.svgResize(workspace);
            }
        } catch (e) {}

        try {
            // 切换一下编辑目标再切回来，也能强制 GUI 重建 blocks（很多版本有效）
            const editingTarget = vm.runtime.getEditingTarget && vm.runtime.getEditingTarget();
            if (editingTarget) {
                const original = editingTarget.id;
                const targets = vm.runtime.targets || [];
                const other = targets.find(t => t && t.id && t.id !== original);
                if (other && (typeof vm.setEditingTarget === 'function' || (vm.runtime && typeof vm.runtime.setEditingTarget === 'function'))) {
                    if (typeof vm.setEditingTarget === 'function') {
                        vm.setEditingTarget(other.id);
                        vm.setEditingTarget(original);
                    } else {
                        vm.runtime.setEditingTarget(other.id);
                        vm.runtime.setEditingTarget(original);
                    }
                }
            }
        } catch (e) {}
    }

    _disposeBlockInWorkspace(targetId, blockId) {
        const vm = Scratch.vm;

        // 确保 workspace 指向当前 target，否则 getBlockById 会拿不到
        try {
            if (typeof vm.setEditingTarget === 'function') {
                vm.setEditingTarget(targetId);
            } else if (vm.runtime && typeof vm.runtime.setEditingTarget === 'function') {
                vm.runtime.setEditingTarget(targetId);
            }
        } catch (e) {}

        const blockly = this._getBlockly();
        const workspace = blockly && blockly.workspace;
        if (!workspace) return false;

        const wsBlock = workspace.getBlockById(blockId);
        if (!wsBlock) return false;

        // 关键点：用 Blockly 正规删除流程（会触发事件、同步 VM、刷新 UI）
        // dispose(true) 会连同子块一起删除
        try {
            if (blockly.Events && typeof blockly.Events.setGroup === 'function') {
                blockly.Events.setGroup('UltimateBlockCleaner');
            }
            wsBlock.dispose(true);
        } finally {
            if (blockly.Events && typeof blockly.Events.setGroup === 'function') {
                blockly.Events.setGroup(false);
            }
        }
        return true;
    }

    removeHatlessBlocks() {
        if (!confirm('确定要删除没有帽块的孤立脚本吗？此操作无法撤销')) {
            return;
        }

        const vm = Scratch.vm;
        const runtime = vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            if (!target || !target.blocks) continue;

            while (true) {
                const topLevelBlockIds = target.blocks.getScripts();
                let blockToDeleteId = null;

                for (const blockId of topLevelBlockIds) {
                    const block = target.blocks.getBlock(blockId);
                    if (!block) continue;

                    const isTopLevel = !block.parent;
                    if (!isTopLevel) continue;

                    const isHat = runtime.getIsHat(block.opcode);
                    const isProcedureDefinition = block.opcode === 'procedures_definition';

                    if (!isHat && !isProcedureDefinition) {
                        blockToDeleteId = blockId;
                        break;
                    }
                }

                if (!blockToDeleteId) break;

                // 优先：从 workspace 删除（GUI 会立刻刷新）
                // 失败再回退：直接删 blocks（可能出现你说的“失效但不刷新”）
                let deleted = false;

                try {
                    deleted = this._disposeBlockInWorkspace(target.id, blockToDeleteId);
                } catch (e) {
                    deleted = false;
                }

                if (!deleted) {
                    try {
                        target.blocks.deleteBlock(blockToDeleteId);
                        deleted = true;
                    } catch (e) {
                        console.error('删除失败：', blockToDeleteId, e);
                        break;
                    }
                }

                if (deleted) totalRemovedCount++;
            }
        }

        // 强制刷新（解决“积木失效但编辑器不刷新”）
        this._refreshWorkspaceHard();

        alert(`完成！已删除没有帽块的孤立脚本：${totalRemovedCount}`);
    }

    removeEmptyHats() {
        if (!confirm('确定要删除所有孤立的帽块吗？此操作无法撤销')) {
            return;
        }

        const vm = Scratch.vm;
        const runtime = vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            if (!target || !target.blocks) continue;

            const topLevelBlockIds = target.blocks.getScripts();
            const toDelete = [];

            for (const blockId of topLevelBlockIds) {
                const block = target.blocks.getBlock(blockId);
                if (!block) continue;

                const isTopLevel = !block.parent;
                if (!isTopLevel) continue;

                const isHat = runtime.getIsHat(block.opcode);
                const isLonely = !block.next;

                if (isHat && isLonely) {
                    toDelete.push(blockId);
                }
            }

            for (const blockId of toDelete) {
                let deleted = false;

                try {
                    deleted = this._disposeBlockInWorkspace(target.id, blockId);
                } catch (e) {
                    deleted = false;
                }

                if (!deleted) {
                    try {
                        target.blocks.deleteBlock(blockId);
                        deleted = true;
                    } catch (e) {
                        console.error('删除失败：', blockId, e);
                    }
                }

                if (deleted) totalRemovedCount++;
            }
        }

        // 强制刷新（解决“积木失效但编辑器不刷新”）
        this._refreshWorkspaceHard();

        alert(`完成！已删除孤立的帽块：${totalRemovedCount}`);
    }
}

Scratch.extensions.register(new UltimateBlockCleaner());
