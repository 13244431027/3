class myextend {
    constructor() {
        this.extensionId = "Blue3SZhushi";
        this.searchDialogId = "Blue3SZhushi-comment-search-dialog";
        this.styleId = "Blue3SZhushi-comment-search-style";
    }

    getInfo() {
        return {
            id: this.extensionId,
            name: "注释",
            color1: "#828282",
            color2: "#6b6b6b",
            color3: "#505050",
            blocks: [
                {
                    blockType: Scratch.BlockType.BUTTON,
                    text: "搜索项目注释",
                    func: "openCommentSearch"
                },
                "---",
                {
                    opcode: "command_z1",
                    color1: "#f31717",
                    color3: "#f22525",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "⚠️ // [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "这段代码是屎山代码，千万别乱改！"
                        }
                    }
                },
                {
                    opcode: "command_z2",
                    color1: "#eff216",
                    color3: "#dce014",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "⚠ // [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "这段代码难以维护，但需要改，请仔细阅读更改"
                        }
                    }
                },
                {
                    opcode: "command_z3",
                    color1: "#8c23ee",
                    color3: "#8121db",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "// [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "你来写这段代码，我要搞其他的"
                        }
                    }
                },
                {
                    opcode: "command_z4",
                    color1: "#828282",
                    color3: "#505050",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "// [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "普通文本"
                        }
                    }
                },
                {
                    opcode: "command_z5",
                    color1: "#158dea",
                    color3: "#137ed0",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "// [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "普通文本2"
                        }
                    }
                },
                {
                    opcode: "command_z6",
                    color1: "#15e830",
                    color3: "#18cf30",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "// [temp]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "普通文本3"
                        }
                    }
                },
                "---",
                {
                    opcode: "reporter_z1",
                    color1: "#828282",
                    color3: "#505050",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "[temp] // [temp2]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "返回值"
                        },
                        temp2: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "注释文本"
                        }
                    }
                },
                {
                    opcode: "reporter_z3",
                    color1: "#828282",
                    color3: "#505050",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "[temp] // [temp2]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.BOOLEAN
                        },
                        temp2: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "注释文本"
                        }
                    }
                },
                {
                    opcode: "reporter_z2",
                    color1: "#eff216",
                    color3: "#dce014",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "[temp] // [temp2]",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "2"
                        },
                        temp2: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "这个值可能会频繁更改"
                        }
                    }
                },
                "---",
                {
                    opcode: "conditional_z1",
                    color1: "#f31717",
                    color3: "#f22525",
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: "废稿 [temp]（不执行内部块）",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "---"
                        }
                    }
                },
                {
                    opcode: "conditional_z2",
                    color1: "#15e830",
                    color3: "#18cf30",
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: "// [temp]（执行内部块）",
                    arguments: {
                        temp: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "有新替代方案了，这段可能要删，但现在需要保留"
                        }
                    }
                }
            ]
        };
    }

    reporter_z1(args) {
        return args.temp;
    }

    reporter_z2(args) {
        return args.temp;
    }

    reporter_z3(args) {
        return args.temp;
    }

    conditional_z1() {
        return false;
    }

    conditional_z2() {
        return true;
    }

    getVM() {
        return window.vm || window.Scratch?.vm || null;
    }

    getWorkspace() {
        const Blockly = window.Blockly;
        if (!Blockly) {
            return null;
        }

        let workspace = Blockly.getMainWorkspace?.() || null;

        // flyout / mutator 的工作区要回到它的宿主主工作区
        while (workspace && workspace.isFlyout && workspace.targetWorkspace) {
            workspace = workspace.targetWorkspace;
        }

        if (workspace && workspace.isMutator && workspace.options?.parentWorkspace) {
            workspace = workspace.options.parentWorkspace;
        }

        return workspace;
    }

    getCommentBlocks() {
        const vm = this.getVM();
        if (!vm?.runtime?.targets) {
            return [];
        }

        const commentOpcodes = new Set([
            "command_z1",
            "command_z2",
            "command_z3",
            "command_z4",
            "command_z5",
            "command_z6",
            "reporter_z1",
            "reporter_z2",
            "reporter_z3",
            "conditional_z1",
            "conditional_z2"
        ]);

        const results = [];

        for (const target of vm.runtime.targets) {
            if (!target || target.isOriginal === false) {
                continue;
            }

            const blocks = target.blocks?._blocks || {};

            for (const blockId in blocks) {
                const block = blocks[blockId];
                if (!block?.opcode) {
                    continue;
                }

                const prefix = `${this.extensionId}_`;
                if (!block.opcode.startsWith(prefix)) {
                    continue;
                }

                const type = block.opcode.slice(prefix.length);
                if (!commentOpcodes.has(type)) {
                    continue;
                }

                const values = this.getCommentValues(block, blocks, type);
                results.push({
                    blockId,
                    targetId: target.id,
                    targetName: target.isStage ? "舞台" : target.getName(),
                    type,
                    text: values.text,
                    preview: values.preview
                });
            }
        }

        return results;
    }

    getCommentValues(block, blocks, type) {
        const first = this.getInputValue(block, blocks, "temp");
        const second = this.getInputValue(block, blocks, "temp2");

        if (type === "reporter_z1" || type === "reporter_z2" || type === "reporter_z3") {
            return {
                text: `${first} ${second}`.trim(),
                preview: `${first} // ${second}`
            };
        }

        if (type === "conditional_z1") {
            return {
                text: first,
                preview: `废稿：${first}`
            };
        }

        if (type === "conditional_z2") {
            return {
                text: first,
                preview: `注释：${first}`
            };
        }

        return {
            text: first,
            preview: first
        };
    }

    getInputValue(block, blocks, inputName) {
        const input = block.inputs?.[inputName];
        if (!input) {
            return "";
        }

        const childId = input.block || input.shadow;
        if (!childId || !blocks[childId]) {
            return "";
        }

        const child = blocks[childId];
        const fields = child.fields || {};
        const field = Object.values(fields)[0];

        if (field && Object.prototype.hasOwnProperty.call(field, "value")) {
            return String(field.value);
        }

        return "[积木输入]";
    }

    fuzzyScore(text, keyword) {
        const source = String(text).toLowerCase();
        const query = String(keyword).trim().toLowerCase();

        if (!query) {
            return 1;
        }

        const directIndex = source.indexOf(query);
        if (directIndex !== -1) {
            return 10000 - directIndex;
        }

        let position = 0;
        let score = 0;

        for (const character of query) {
            const nextIndex = source.indexOf(character, position);
            if (nextIndex === -1) {
                return -1;
            }

            score += 100 - (nextIndex - position);
            position = nextIndex + 1;
        }

        return score;
    }

    ensureSearchStyle() {
        if (document.getElementById(this.styleId)) {
            return;
        }

        const style = document.createElement("style");
        style.id = this.styleId;
        style.textContent = `
            #${this.searchDialogId} {
                position: fixed;
                z-index: 2147483647;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.45);
                font-family: "Microsoft YaHei", Arial, sans-serif;
            }

            #${this.searchDialogId} .comment-search-panel {
                width: min(680px, calc(100vw - 32px));
                max-height: min(720px, calc(100vh - 32px));
                display: flex;
                flex-direction: column;
                overflow: hidden;
                background: #ffffff;
                color: #222222;
                border-radius: 8px;
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
            }

            #${this.searchDialogId} .comment-search-header {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                border-bottom: 1px solid #dedede;
            }

            #${this.searchDialogId} .comment-search-title {
                flex: 0 0 auto;
                font-size: 17px;
                font-weight: bold;
            }

            #${this.searchDialogId} .comment-search-input {
                min-width: 0;
                flex: 1;
                height: 34px;
                padding: 0 10px;
                color: #222222;
                border: 1px solid #b9b9b9;
                border-radius: 4px;
                outline: none;
                font-size: 14px;
            }

            #${this.searchDialogId} .comment-search-input:focus {
                border-color: #158dea;
                box-shadow: 0 0 0 2px rgba(21, 141, 234, 0.18);
            }

            #${this.searchDialogId} .comment-search-close,
            #${this.searchDialogId} .comment-search-page {
                border: 0;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            #${this.searchDialogId} .comment-search-close {
                width: 32px;
                height: 32px;
                background: #eeeeee;
                color: #444444;
                font-size: 22px;
                line-height: 28px;
            }

            #${this.searchDialogId} .comment-search-close:hover,
            #${this.searchDialogId} .comment-search-page:hover:not(:disabled) {
                background: #d8d8d8;
            }

            #${this.searchDialogId} .comment-search-info {
                padding: 10px 16px;
                color: #666666;
                border-bottom: 1px solid #ededed;
                font-size: 13px;
            }

            #${this.searchDialogId} .comment-search-list {
                min-height: 100px;
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            #${this.searchDialogId} .comment-search-result {
                display: block;
                width: 100%;
                margin: 0 0 6px;
                padding: 11px 12px;
                overflow: hidden;
                color: #222222;
                background: #f7f7f7;
                border: 1px solid #e2e2e2;
                border-radius: 5px;
                cursor: pointer;
                text-align: left;
            }

            #${this.searchDialogId} .comment-search-result:hover {
                background: #e8f4fd;
                border-color: #158dea;
            }

            #${this.searchDialogId} .comment-search-result-main {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                font-weight: bold;
            }

            #${this.searchDialogId} .comment-search-result-target {
                margin-top: 5px;
                color: #777777;
                font-size: 12px;
            }

            #${this.searchDialogId} .comment-search-empty {
                padding: 36px 16px;
                color: #777777;
                text-align: center;
            }

            #${this.searchDialogId} .comment-search-footer {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid #dedede;
            }

            #${this.searchDialogId} .comment-search-page {
                min-width: 70px;
                height: 30px;
                padding: 0 10px;
                background: #eeeeee;
                color: #333333;
            }

            #${this.searchDialogId} .comment-search-page:disabled {
                opacity: 0.45;
                cursor: default;
            }

            #${this.searchDialogId} .comment-search-page-number {
                min-width: 78px;
                color: #555555;
                text-align: center;
                font-size: 13px;
            }
        `;

        document.head.appendChild(style);
    }

    openCommentSearch() {
        document.getElementById(this.searchDialogId)?.remove();
        this.ensureSearchStyle();

        const dialog = document.createElement("div");
        dialog.id = this.searchDialogId;
        dialog.innerHTML = `
            <div class="comment-search-panel" role="dialog" aria-modal="true">
                <div class="comment-search-header">
                    <div class="comment-search-title">搜索项目注释</div>
                    <input class="comment-search-input" type="text" placeholder="输入关键词进行模糊搜索">
                    <button class="comment-search-close" title="关闭">×</button>
                </div>
                <div class="comment-search-info"></div>
                <div class="comment-search-list"></div>
                <div class="comment-search-footer">
                    <button class="comment-search-page comment-search-prev">上一页</button>
                    <span class="comment-search-page-number"></span>
                    <button class="comment-search-page comment-search-next">下一页</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        const input = dialog.querySelector(".comment-search-input");
        const info = dialog.querySelector(".comment-search-info");
        const list = dialog.querySelector(".comment-search-list");
        const previousButton = dialog.querySelector(".comment-search-prev");
        const nextButton = dialog.querySelector(".comment-search-next");
        const pageNumber = dialog.querySelector(".comment-search-page-number");

        const allResults = this.getCommentBlocks();
        const pageSize = 10;
        let currentPage = 1;
        let filteredResults = allResults.slice();

        const render = () => {
            const keyword = input.value.trim();
            filteredResults = allResults
                .map(result => ({
                    ...result,
                    score: this.fuzzyScore(
                        `${result.text} ${result.preview} ${result.targetName}`,
                        keyword
                    )
                }))
                .filter(result => result.score >= 0)
                .sort((a, b) => b.score - a.score);

            const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
            currentPage = Math.min(currentPage, totalPages);

            const start = (currentPage - 1) * pageSize;
            const pageResults = filteredResults.slice(start, start + pageSize);

            info.textContent = keyword
                ? `找到 ${filteredResults.length} 条匹配的注释`
                : `项目中共有 ${allResults.length} 条注释`;

            list.innerHTML = "";

            if (pageResults.length === 0) {
                list.innerHTML = `<div class="comment-search-empty">没有找到匹配的注释</div>`;
            }

            for (const result of pageResults) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "comment-search-result";

                const main = document.createElement("div");
                main.className = "comment-search-result-main";
                main.textContent = result.preview || "空注释";

                const target = document.createElement("div");
                target.className = "comment-search-result-target";
                target.textContent = `角色：${result.targetName}`;

                button.append(main, target);
                button.addEventListener("click", () => this.jumpToComment(result));
                list.appendChild(button);
            }

            previousButton.disabled = currentPage <= 1;
            nextButton.disabled = currentPage >= totalPages;
            pageNumber.textContent = `${currentPage} / ${totalPages}`;
        };

        input.addEventListener("input", () => {
            currentPage = 1;
            render();
        });

        previousButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                render();
            }
        });

        nextButton.addEventListener("click", () => {
            const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
            if (currentPage < totalPages) {
                currentPage++;
                render();
            }
        });

        dialog.querySelector(".comment-search-close").addEventListener("click", () => {
            dialog.remove();
        });

        dialog.addEventListener("click", event => {
            if (event.target === dialog) {
                dialog.remove();
            }
        });

        window.addEventListener("keydown", function closeWithEscape(event) {
            if (event.key === "Escape" && document.getElementById(this.searchDialogId)) {
                dialog.remove();
                window.removeEventListener("keydown", closeWithEscape);
            }
        }.bind(this));

        render();
        input.focus();
    }

    jumpToComment(result) {
        const vm = this.getVM();
        if (!vm) {
            return;
        }

        document.getElementById(this.searchDialogId)?.remove();

        const needSwitch = vm.editingTarget?.id !== result.targetId;

        if (needSwitch && typeof vm.setEditingTarget === "function") {
            vm.setEditingTarget(result.targetId);
            // 立即刷新一次，避免等待 redux 的下一帧
            vm.emitWorkspaceUpdate?.();
        }

        const deadline = Date.now() + 4000;

        const tryFocus = () => {
            const workspace = this.getWorkspace();
            const block = workspace?.getBlockById?.(result.blockId);

            // 目标未切换完成，或积木还没被渲染出来，继续等
            if (!workspace || !block || vm.editingTarget?.id !== result.targetId) {
                if (Date.now() < deadline) {
                    requestAnimationFrame(tryFocus);
                }
                return;
            }

            // 展开所有折叠的父级，否则积木没有可见坐标
            let parent = block.getParent?.();
            while (parent) {
                if (parent.isCollapsed?.()) {
                    parent.setCollapsed(false);
                }
                parent = parent.getParent?.();
            }

            // 再等一帧，让工作区重建后的布局稳定下来
            requestAnimationFrame(() => {
                const target = this.getWorkspace()?.getBlockById?.(result.blockId);
                if (!target) {
                    return;
                }

                const ws = target.workspace;

                if (typeof ws.centerOnBlock === "function") {
                    ws.centerOnBlock(result.blockId);
                } else {
                    this.scrollBlockIntoView(ws, target);
                }

                target.select?.();
                ws.glowBlock?.(result.blockId, true);
                setTimeout(() => ws.glowBlock?.(result.blockId, false), 1600);
            });
        };

        requestAnimationFrame(tryFocus);
    }

    scrollBlockIntoView(workspace, block) {
        const metrics = workspace.getMetrics?.();
        const position = block.getRelativeToSurfaceXY?.();
        if (!metrics || !position) {
            return;
        }

        const scale = workspace.scale || 1;
        const x = position.x * scale - metrics.viewWidth / 2;
        const y = position.y * scale - metrics.viewHeight / 2;

        workspace.scrollbar?.set(x, y);
    }
}

Scratch.extensions.register(new myextend());
