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
        return (vm && vm.extensionManager && vm.extensionManager._blockly) ||
            (Scratch && Scratch.gui && Scratch.gui.getBlockly && Scratch.gui.getBlockly()) ||
            null;
    }

    _refreshWorkspaceHard() {
        const vm = Scratch.vm;

        try {
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
                if (blockly.Events && typeof blockly.Events.fire === 'function') {
                    const ev = new blockly.Events.Ui(null, 'refresh', null, null);
                    blockly.Events.fire(ev);
                }

                if (typeof workspace.resizeContents === 'function') workspace.resizeContents();
                if (typeof workspace.render === 'function') workspace.render();
                if (typeof blockly.svgResize === 'function') blockly.svgResize(workspace);
            }
        } catch (e) {}

        try {
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

    _isBlockStillValid(target, blockId) {
        // ✅ 新增：验证块在 VM 中确实存在
        if (!target || !target.blocks) return false;
        const block = target.blocks.getBlock(blockId);
        return !!block;
    }

    _disposeBlockInWorkspace(targetId, blockId) {
        const vm = Scratch.vm;
        
        // ✅ 新增：在删除前再次验证块的有效性
        const target = vm.runtime.getTargetById(targetId);
        if (!this._isBlockStillValid(target, blockId)) {
            console.warn('块已不存在或已删除:', blockId);
            return false;
        }

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

        try {
            if (blockly.Events && typeof blockly.Events.setGroup === 'function') {
                blockly.Events.setGroup('UltimateBlockCleaner');
            }
            wsBlock.dispose(true);
            return true;
        } finally {
            if (blockly.Events && typeof blockly.Events.setGroup === 'function') {
                blockly.Events.setGroup(false);
            }
        }
    }

    _findNextHatlessBlock(target, runtime) {
        // ✅ 新增：每次调用都重新获取最新的脚本列表（避免列表过期）
        const topLevelBlockIds = target.blocks.getScripts();
        
        for (const blockId of topLevelBlockIds) {
            const block = target.blocks.getBlock(blockId);
            if (!block) continue;

            const isTopLevel = !block.parent;
            if (!isTopLevel) continue;

            const isHat = runtime.getIsHat(block.opcode);
            const isProcedureDefinition = block.opcode === 'procedures_definition';

            if (!isHat && !isProcedureDefinition) {
                return blockId;
            }
        }
        return null;
    }

    removeHatlessBlocks() {
        if (!confirm('确定要删除没有帽块的孤立脚本吗？此操作无法撤销')) {
            return;
        }

        const vm = Scratch.vm;
        const runtime = vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;
        let errorOccurred = false;

        for (const target of targets) {
            if (!target || !target.blocks) continue;

            let blockToDeleteId;
            // ✅ 改进：使用 do-while 避免频繁重新赋值 null
            while ((blockToDeleteId = this._findNextHatlessBlock(target, runtime)) !== null) {
                // ✅ 新增：二次验证确保块仍然有效
                if (!this._isBlockStillValid(target, blockToDeleteId)) {
                    console.warn('块已失效，跳过:', blockToDeleteId);
                    continue;
                }

                let deleted = false;

                try {
                    deleted = this._disposeBlockInWorkspace(target.id, blockToDeleteId);
                } catch (e) {
                    console.error('Workspace 删除失败:', blockToDeleteId, e);
                    deleted = false;
                }

                // ✅ 改进：只在 Workspace 删除失败时才尝试 VM 删除
                if (!deleted) {
                    try {
                        // ✅ 新增：再次验证块是否真的存在
                        if (this._isBlockStillValid(target, blockToDeleteId)) {
                            target.blocks.deleteBlock(blockToDeleteId);
                            deleted = true;
                        }
                    } catch (e) {
                        console.error('VM 删除失败:', blockToDeleteId, e);
                        errorOccurred = true;
                        break;
                    }
                }

                if (deleted) {
                    totalRemovedCount++;
                } else {
                    console.warn('块删除返回 false:', blockToDeleteId);
                }
            }

            if (errorOccurred) break;
        }

        this._refreshWorkspaceHard();
        alert(`完成！已删除没有帽块的孤立脚本：${totalRemovedCount}${errorOccurred ? ' (过程中遇到错误)' : ''}`);
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

            // ✅ 改进：先收集要删除的块，但要验证其有效性
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

            // ✅ 改进：删除时再次验证每个块
            for (const blockId of toDelete) {
                // ✅ 新增：验证块仍然有效
                if (!this._isBlockStillValid(target, blockId)) {
                    console.warn('块已不存在:', blockId);
                    continue;
                }

                let deleted = false;

                try {
                    deleted = this._disposeBlockInWorkspace(target.id, blockId);
                } catch (e) {
                    console.error('Workspace 删除失败:', blockId, e);
                    deleted = false;
                }

                if (!deleted) {
                    try {
                        if (this._isBlockStillValid(target, blockId)) {
                            target.blocks.deleteBlock(blockId);
                            deleted = true;
                        }
                    } catch (e) {
                        console.error('VM 删除失败:', blockId, e);
                    }
                }

                if (deleted) totalRemovedCount++;
            }
        }

        this._refreshWorkspaceHard();
        alert(`完成！已删除孤立的帽块：${totalRemovedCount}`);
    }
}

Scratch.extensions.register(new UltimateBlockCleaner());
