(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) return;

    class BlockRestrictor {
        constructor() {
            this.active = false;
            this.id = "ultimateBlockRestrictor";
            this.selectors = [
                '.blocklyBlock',
                '.blocklyToolboxCategory',
                '.blocklyFlyout',
                '.blocklyPalette',
                '.blocklyBlockCanvas'
            ];
            this.states = new WeakMap();
            this.watcher = null;
            this.resetClass = 'safe-reset';
        }

        getInfo() {
            return {
                id: this.id,
                name: "🎭制裁仇人专业工具",
                description: "隐藏并禁用其他积木",
                icon: "🎭",
                color1: "#CC0000",
                blocks: [
                    {
                        opcode: "toggle",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "🎭制裁"
                    },
                    {
                        opcode: "reset",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "🔄重置所有"
                    }
                ]
            };
        }

        markReset() {
            const resets = document.querySelectorAll(`[data-opcode="${this.id}.reset"]`);
            resets.forEach(el => {
                const block = el.closest('.blocklyBlock');
                if (block) block.classList.add(this.resetClass);
            });
        }

        isSelf(element) {
            if (element.hasAttribute('data-extension-id') && element.getAttribute('data-extension-id') === this.id) return true;
            if (element.classList.contains(this.resetClass)) return true;
            if (element.querySelector(`.${this.resetClass}`)) return true;
            if (element.querySelector(`[data-extension-id="${this.id}"]`)) return true;
            return false;
        }

        saveState(element) {
            if (!this.states.has(element)) {
                this.states.set(element, {
                    display: element.style.display,
                    pointerEvents: element.style.pointerEvents,
                    opacity: element.style.opacity,
                    visibility: element.style.visibility
                });
            }
        }

        restoreState(element) {
            if (this.states.has(element)) {
                const s = this.states.get(element);
                element.style.display = s.display;
                element.style.pointerEvents = s.pointerEvents;
                element.style.opacity = s.opacity;
                element.style.visibility = s.visibility;
                this.states.delete(element);
            }
        }

        restrict(element) {
            if (this.isSelf(element)) return;
            this.saveState(element);
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.pointerEvents = 'none';
            element.style.opacity = '0';
        }

        processElements() {
            this.markReset();
            this.selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    if (this.active) this.restrict(el);
                    else this.restoreState(el);
                });
            });
        }

        startWatching() {
            if (this.watcher) this.watcher.disconnect();
            this.watcher = new MutationObserver(muts => {
                if (!this.active) return;
                muts.forEach(mut => {
                    mut.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            this.restrict(node);
                            node.querySelectorAll('*').forEach(child => this.restrict(child));
                        }
                    });
                });
            });
            const ws = document.querySelector('.blocklyWorkspace') || document.body;
            this.watcher.observe(ws, { childList: true, subtree: true, attributes: false });
        }

        toggle() {
            try {
                if (typeof document === 'undefined') return;
                this.active = !this.active;
                this.processElements();
                if (this.active) {
                    this.startWatching();
                    alert("你被制裁了！");
                } else {
                    if (this.watcher) {
                        this.watcher.disconnect();
                        this.watcher = null;
                    }
                    alert("你被解放了！");
                }
            } catch (e) {
                console.error("限制器错误:", e);
                alert("操作失败: " + e.message);
            }
        }

        reset() {
            try {
                this.active = false;
                this.processElements();
                if (this.watcher) {
                    this.watcher.disconnect();
                    this.watcher = null;
                }
                alert("已完全重置！");
            } catch (e) {
                console.error("重置错误:", e);
                alert("重置失败: " + e.message);
            }
        }
    }

    Scratch.extensions.register(new BlockRestrictor());
})(Scratch);
    