class UltimateBlockCleaner {
    getInfo() {
        return {
            id: 'ultimateBlockCleaner',
            name: 'Code Cleaner',
            blockIconURI: 'https://raw.githubusercontent.com/Mirazstudio-offical/Dash_code_cleaner_extension/refs/heads/main/extension_icon.png',
            color1: '#8B4513',
            color2: '#A0522D',
            blocks: [
                {
                    func: 'removeHatlessBlocks',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Delete orphaned scripts without a hat',
                },
                {
                    func: 'removeEmptyHats',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Delete orphaned hats',
                }
            ]
        };
    }

    removeHatlessBlocks() {
        if (!confirm('Are you sure that you want to delete orphaned scripts without a hat? This CANNOT be undone')) {
            return;
        }

        const runtime = Scratch.vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            while (true) {
                let blocksInThisPass = target.blocks.getScripts();
                let blockToDeleteId = null;

                for (const blockId of blocksInThisPass) {
                    const block = target.blocks.getBlock(blockId);
                    if (block && !runtime.getIsHat(block.opcode)) {
                        blockToDeleteId = blockId;
                        break;
                    }
                }

                if (blockToDeleteId) {
                    target.blocks.deleteBlock(blockToDeleteId);
                    totalRemovedCount++;
                } else {
                    break;
                }
            }
        }
        
        alert(`Done! Deleted orphaned scripts without a hat: ${totalRemovedCount}`);
    }

    removeEmptyHats() {
        if (!confirm('Are you sure that you want to delete ALL orphaned hats? This CANNOT be undone')) {
            return;
        }

        const runtime = Scratch.vm.runtime;
        const targets = runtime.targets;
        let totalRemovedCount = 0;

        for (const target of targets) {
            const topLevelBlockIds = target.blocks.getScripts();

            for (const blockId of topLevelBlockIds) {
                const block = target.blocks.getBlock(blockId);
                if (!block) continue;

                const isHat = runtime.getIsHat(block.opcode);
                const isLonely = !block.next;

                if (isHat && isLonely) {
                    target.blocks.deleteBlock(blockId);
                    totalRemovedCount++;
                }
            }
        }

        alert(`Done! Deleted orphaned hats: ${totalRemovedCount}`);
    }
}

Scratch.extensions.register(new UltimateBlockCleaner());
