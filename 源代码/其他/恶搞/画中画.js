(function(Scratch) {
    'use strict';

    const translations = {
        zh: {
            extensionName: "Dream的画中画工具",
            createWindow: "创建画中画窗口 ID:[ID] 标题:[TITLE]",
            setContent: "设置窗口[ID]内容为[CONTENT]",
            setPosition: "设置窗口[ID]位置 X:[X] Y:[Y]",
            setSize: "设置窗口[ID]大小 宽:[W] 高:[H]",
            showWindow: "显示窗口[ID]",
            hideWindow: "隐藏窗口[ID]",
            closeWindow: "关闭窗口[ID]",
            toggleWindow: "切换窗口[ID]显示状态",
            bringToTop: "将窗口[ID]置顶",
            windowExists: "窗口[ID]是否存在",
            defaultTitle: "画中画窗口",
            defaultContent: "这是一个画中画窗口"
        },
        en: {
            extensionName: "Dream Picture in Picture",
            createWindow: "create PiP window ID:[ID] title:[TITLE]",
            setContent: "set window[ID] content to[CONTENT]",
            setPosition: "set window[ID] position X:[X] Y:[Y]",
            setSize: "set window[ID] size W:[W] H:[H]",
            showWindow: "show window[ID]",
            hideWindow: "hide window[ID]",
            closeWindow: "close window[ID]",
            toggleWindow: "toggle window[ID] visibility",
            bringToTop: "bring window[ID] to front",
            windowExists: "does window[ID] exist",
            defaultTitle: "PiP Window",
            defaultContent: "This is a picture-in-picture window"
        }
    };

    // 获取当前语言的翻译文本
    const getText = (key) => {
        const lang = Scratch.locale || 'zh';
        return translations[lang]?.[key] || translations['en'][key];
    };

    class PiPExtension {
        constructor() {
            this.windows = new Map(); // 存储所有窗口实例
            this.zIndex = 1000; // 初始层级
            this.stageElement = document.querySelector('.stage-wrapper');
        }

        getInfo() {
            return {
                id: 'DreampipExtension',
                name: getText('extensionName'),
                color1: '#6C5CE7',
                color2: '#5549B8',
                blocks: [
                    // 创建窗口
                    {
                        opcode: 'createWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('createWindow'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            },
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: getText('defaultTitle')
                            }
                        }
                    },
                    // 设置内容
                    {
                        opcode: 'setContent',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('setContent'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: getText('defaultContent')
                            }
                        }
                    },
                    // 设置位置
                    {
                        opcode: 'setPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('setPosition'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    // 设置大小
                    {
                        opcode: 'setSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('setSize'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            },
                            H: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 150
                            }
                        }
                    },
                    // 显示窗口
                    {
                        opcode: 'showWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('showWindow'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    },
                    // 隐藏窗口
                    {
                        opcode: 'hideWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('hideWindow'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    },
                    // 关闭窗口
                    {
                        opcode: 'closeWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('closeWindow'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    },
                    // 切换显示状态
                    {
                        opcode: 'toggleWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('toggleWindow'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    },
                    // 置顶窗口
                    {
                        opcode: 'bringToTop',
                        blockType: Scratch.BlockType.COMMAND,
                        text: getText('bringToTop'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    },
                    // 检查窗口是否存在
                    {
                        opcode: 'windowExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: getText('windowExists'),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'win1'
                            }
                        }
                    }
                ]
            };
        }

        // 创建画中画窗口
        createWindow(args) {
            const id = args.ID.trim();
            if (!id) return;

            // 如果窗口已存在，先关闭
            if (this.windows.has(id)) {
                this.closeWindow({ID: id});
            }

            // 创建窗口元素
            const windowEl = document.createElement('div');
            windowEl.className = 'pip-window';
            windowEl.style.cssText = `
                position: absolute;
                left: 50px;
                top: 50px;
                width: 200px;
                height: 150px;
                background: white;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                overflow: hidden;
                z-index: ${this.zIndex++};
                resize: both;
                min-width: 100px;
                min-height: 80px;
            `;

            // 创建标题栏
            const titleBar = document.createElement('div');
            titleBar.className = 'pip-title';
            titleBar.style.cssText = `
                height: 30px;
                background: #6C5CE7;
                color: white;
                padding: 0 10px;
                line-height: 30px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            `;
            titleBar.textContent = args.TITLE || getText('defaultTitle');

            // 关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.style.cssText = `
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                cursor: pointer;
            `;
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', () => this.closeWindow({ID: id}));
            titleBar.appendChild(closeBtn);

            // 内容区域
            const contentArea = document.createElement('div');
            contentArea.className = 'pip-content';
            contentArea.style.cssText = `
                height: calc(100% - 30px);
                overflow: auto;
                padding: 10px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: #333;
            `;
            contentArea.textContent = getText('defaultContent');

            // 组装窗口
            windowEl.appendChild(titleBar);
            windowEl.appendChild(contentArea);

            // 实现拖拽功能
            let isDragging = false;
            let startX, startY, offsetX, offsetY;

            titleBar.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // 只响应左键
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                offsetX = windowEl.offsetLeft;
                offsetY = windowEl.offsetTop;
                this.bringToTop({ID: id}); // 拖拽时置顶
                windowEl.style.transition = 'none'; // 取消动画使拖拽更流畅
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                windowEl.style.left = `${offsetX + dx}px`;
                windowEl.style.top = `${offsetY + dy}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    windowEl.style.transition = 'all 0.1s ease'; // 恢复动画
                }
            });

            // 添加到舞台容器（实现内嵌效果）
            (this.stageElement || document.body).appendChild(windowEl);

            // 存储窗口信息
            this.windows.set(id, {
                element: windowEl,
                titleBar: titleBar,
                contentArea: contentArea,
                isVisible: true
            });
        }

        // 设置窗口内容
        setContent(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                // 支持简单的HTML内容
                win.contentArea.innerHTML = args.CONTENT;
            }
        }

        // 设置窗口位置
        setPosition(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                win.element.style.left = `${args.X}px`;
                win.element.style.top = `${args.Y}px`;
            }
        }

        // 设置窗口大小
        setSize(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                win.element.style.width = `${Math.max(100, args.W)}px`;
                win.element.style.height = `${Math.max(80, args.H)}px`;
            }
        }

        // 显示窗口
        showWindow(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                win.element.style.display = 'block';
                win.isVisible = true;
            }
        }

        // 隐藏窗口
        hideWindow(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                win.element.style.display = 'none';
                win.isVisible = false;
            }
        }

        // 切换窗口显示状态
        toggleWindow(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                if (win.isVisible) {
                    this.hideWindow(args);
                } else {
                    this.showWindow(args);
                }
            }
        }

        // 关闭窗口
        closeWindow(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                // 移除元素
                if (win.element.parentNode) {
                    win.element.parentNode.removeChild(win.element);
                }
                // 清除引用
                this.windows.delete(args.ID);
            }
        }

        // 将窗口置顶
        bringToTop(args) {
            const win = this.windows.get(args.ID);
            if (win) {
                win.element.style.zIndex = this.zIndex++;
            }
        }

        // 检查窗口是否存在
        windowExists(args) {
            return this.windows.has(args.ID);
        }
    }

    // 注册扩展
    Scratch.extensions.register(new PiPExtension());
})(Scratch);