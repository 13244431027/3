//原作者:星河为梦(https://www.ccw.site/student/6012ad212b59c7497d3b0081)
//改编者:deepseek R1(https://www.deepseek.com/)
//&zrxu(https://www.ccw.site/student/6598edca4b9a4844977006b7)
(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            "extensionName": "ZR多控制台",
            "createConsole": "创建控制台 名称:[NAME] 位置X:[X] Y:[Y] 宽度:[WIDTH] 高度:[HEIGHT]",
            "setBackgroundColor": "设置控制台 [CONSOLE] 背景颜色 [COLOR]",
            "setTextColor": "设置控制台 [CONSOLE] 文字颜色 [COLOR]",
            "setBorderColor": "设置控制台 [CONSOLE] 边框颜色 [COLOR]",
            "setFont": "设置控制台 [CONSOLE] 字体 [FONT_URL]",
            "printText": "控制台 [CONSOLE] 打印 [TEXT]",
            "printLine": "控制台 [CONSOLE] 打印一行 [TEXT]",
            "clearConsole": "清空控制台 [CONSOLE]",
            "getInputBox": "获取控制台 [CONSOLE] 输入框内的内容",
            "getInputValue":"获取控制台 [CONSOLE] 上次输入",
            "waitForInput": "等待并获取控制台 [CONSOLE] 输入",
            "getLastConsoleInput": "最近一次的控制台输入",
            "gotInput":"控制台 [CONSOLE] 被获取过上次输入?",
            "hideConsole": "隐藏控制台 [CONSOLE]",
            "showConsole": "显示控制台 [CONSOLE]",
            "lockConsole": "锁定控制台 [CONSOLE]",
            "unlockConsole": "解锁控制台 [CONSOLE]",
            "setLineBreakMode": "设置控制台 [CONSOLE] 超出长度文本 [MODE]",
            "scrollMode": "使用拖动条显示",
            "wrapMode": "自动换行",
            "getConsoleX": "获取控制台 [CONSOLE] 的X坐标",
            "getConsoleY": "获取控制台 [CONSOLE] 的Y坐标",
            "setConsoleTitle": "设置控制台 [CONSOLE] 标题 [TITLE]",
            "consoleExists": "控制台 [CONSOLE] 创建?",
            "consoleShows": "控制台 [CONSOLE] 显示?",
            "consoleIsLocked": "控制台 [CONSOLE] 锁定?",
            "setPrompt": "设置控制台 [CONSOLE] 提示符 [PROMPT]",
            "removeConsole": "移除控制台 [CONSOLE]",
            "listConsoles": "所有控制台列表",
            "consoleDefaultTitle": "控制台",
            "consoleDefaultFont": "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap",
            "consoleDefaultPrompt": "> "
        },
        en: {
            "extensionName": "ZRConsole",
            "createConsole": "create console named [NAME] at X:[X] Y:[Y] width:[WIDTH] height:[HEIGHT]",
            "setBackgroundColor": "set console [CONSOLE] background color [COLOR]",
            "setTextColor": "set console [CONSOLE] text color [COLOR]",
            "setBorderColor": "set console [CONSOLE] border color [COLOR]",
            "setFont": "set console [CONSOLE] font [FONT_URL]",
            "printText": "console [CONSOLE] print [TEXT]",
            "printLine": "console [CONSOLE] print line [TEXT]",
            "clearConsole": "clear console [CONSOLE]",
            "getInputBox": "get console [CONSOLE] input box",
            "getInputValue": "get console [CONSOLE] last input",
            "waitForInput": "wait and get console [CONSOLE] input",
            "getLastConsoleInput": "get last console input",
            "gotInput":"console [CONSOLE] was taken for the last input?",
            "hideConsole": "hide console [CONSOLE]",
            "showConsole": "show console [CONSOLE]",
            "lockConsole": "lock console [CONSOLE]",
            "unlockConsole": "unlock console [CONSOLE]",
            "setLineBreakMode": "set console [CONSOLE] text overflow [MODE]",
            "scrollMode": "use scrollbar",
            "wrapMode": "auto wrap",
            "getConsoleX": "get console [CONSOLE] X position",
            "getConsoleY": "get console [CONSOLE] Y position",
            "setConsoleTitle": "set console [CONSOLE] title [TITLE]",
            "consoleExists": "console [CONSOLE] created?",
            "consoleShows": "console [CONSOLE] is showing?",
            "consoleIsLocked": "console [CONSOLE] is locked?",
            "setPrompt": "set console [CONSOLE] prompt [PROMPT]",
            "removeConsole": "remove console [CONSOLE]",
            "listConsoles": "list all consoles",
            "consoleDefaultTitle": "Console",
            "consoleDefaultFont": "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap",
            "consoleDefaultPrompt": "> "
        }
    });

    class Console {
        constructor(name, x, y, width, height, runtime) {
            this.name = name;
            this.runtime = runtime;
            this.consoleElement = null;
            this.outputElement = null;
            this.inputElement = null;
            this.promptElement = null;
            this.inputHistory = [];
            this.historyIndex = -1;
            this.consoleVisible = true;
            this.isLocked = false;
            this.isDragging=false;
            this.gotInput=false;
            this.lineBreakWhenOver=true;
            this.lastInput = "";
            this.lastInputTime = 0;
            this.inputCallbacks = [];
            this.prompt = translate({id: "consoleDefaultPrompt"});
            
            this.create(x, y, width, height);
        }

        create(x, y, width, height) {
            // 确保移除任何现有实例
            this.destroy();

            this.consoleElement = document.createElement("div"); // 先创建元素
            this.consoleElement.style.display = "flex"; // 然后设置样式
            this.consoleVisible = true;
            
            // 创建控制台元素
            this.consoleElement = document.createElement("div");
            this.consoleElement.id = "ZRConsole-" + this.name;
            
            // 确保控制台在屏幕范围内
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // 修正坐标，确保控制台在屏幕内
            const safeX = Math.max(10, Math.min(x, screenWidth - width - 10));
            const safeY = Math.max(10, Math.min(y, screenHeight - height - 10));
            
            // 应用基本样式
            Object.assign(this.consoleElement.style, {
                position: "fixed",
                left: safeX + "px",
                top: safeY + "px",
                width: width + "px",
                height: height + "px",
                backgroundColor: "#000000",
                color: "#FFFFFF",
                border: "2px solid #4C97FF",
                borderRadius: "5px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                zIndex: "2147483647", // 最高可能的 z-index
                fontFamily: "monospace",
                boxSizing: "border-box",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                pointerEvents: "auto" // 确保可以交互
            });

            // 创建标题栏
            const titleBar = document.createElement("div");
            Object.assign(titleBar.style, {
                backgroundColor: "#4C97FF",
                padding: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "move",
                userSelect: "none"
            });
            
            const titleText = document.createElement("span");
            titleText.textContent = translate({id: "consoleDefaultTitle"}) + " - " + this.name;
            Object.assign(titleText.style, {
                fontWeight: "bold",
                paddingLeft: "5px"
            });
            
            const closeButton = document.createElement("button");
            closeButton.textContent = "×";
            Object.assign(closeButton.style, {
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            });
            closeButton.addEventListener("click", () => this.hide());
            
            titleBar.appendChild(titleText);
            titleBar.appendChild(closeButton);
            this.consoleElement.appendChild(titleBar);

            // 使控制台可拖动
            let isDragging = false;
            let offsetX, offsetY;

            titleBar.addEventListener("mousedown", (e) => {
                if (this.isLocked) return;
                isDragging = true;
                const rect = this.consoleElement.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                e.preventDefault();
            });

            document.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                
                // 计算新位置并确保在屏幕内
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;
                
                const maxX = window.innerWidth - this.consoleElement.offsetWidth;
                const maxY = window.innerHeight - this.consoleElement.offsetHeight;
                
                this.consoleElement.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
                this.consoleElement.style.top = Math.max(0, Math.min(newY, maxY)) + "px";
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
            });

            // 修改输出容器的创建代码
            const outputContainer = document.createElement("div");
            Object.assign(outputContainer.style, {
                flexGrow: "1",
                overflow: "auto",
                backgroundColor: "rgba(0,0,0,0.8)",
                position: "relative",
                // 添加以下样式强制显示滚动条
                scrollbarWidth: "thin",  // Firefox
                scrollbarColor: "#888 #333",  // Firefox
                msOverflowStyle: "scrollbar"  // IE/Edge
            });


            // 针对Webkit浏览器(Chrome/Safari)添加滚动条样式
            const style = document.createElement("style");
            style.textContent = `
                #ZRConsole-${this.name} ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }
                #ZRConsole-${this.name} ::-webkit-scrollbar-track {
                    background: #333;
                }
                #ZRConsole-${this.name} ::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 6px;
                    border: 3px solid #333;
                }
            `;
            document.head.appendChild(style);

            // 修改内容区域的创建代码
            this.outputElement = document.createElement("div");
            Object.assign(this.outputElement.style, {
                padding: "10px",
                whiteSpace: "pre",
                fontFamily: "monospace",
                minWidth: "100%",
                display: "inline-block",
                // 确保内容不会换行
                wordBreak: "keep-all",
                // 防止文本被截断
                overflow: "visible"
            });

            outputContainer.appendChild(this.outputElement);
            this.consoleElement.appendChild(outputContainer);

            // 创建输入区域
            const inputContainer = document.createElement("div");
            Object.assign(inputContainer.style, {
                display: "flex",
                padding: "5px",
                backgroundColor: "#333333",
                borderTop: "1px solid #555"
            });
            
            this.promptElement = document.createElement("span");
            this.promptElement.textContent = this.prompt;
            Object.assign(this.promptElement.style, {
                marginRight: "5px",
                userSelect: "none",
                whiteSpace: "nowrap"
            });
            inputContainer.appendChild(this.promptElement);
            
            this.inputElement = document.createElement("input");
            Object.assign(this.inputElement.style, {
                flexGrow: "1",
                backgroundColor: "transparent",
                border: "none",
                color: "inherit",
                fontFamily: "inherit",
                outline: "none",
                padding: "3px 5px"
            });
            
            // 处理输入提交
            this.inputElement.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const input = this.inputElement.value;
                    this.gotInput=false;
                    this.lastInput = input; // 记录最后一次输入
                    this.lastInputTime = Date.now(); // 记录当前时间戳
                    this.printLine(this.prompt + input);
                    this.inputHistory.push(input);
                    this.historyIndex = this.inputHistory.length;
                    this.inputElement.value = "";
                    
                    // 通知所有输入回调
                    const callbacks = this.inputCallbacks;
                    this.inputCallbacks = [];
                    for (const callback of callbacks) {
                        callback(input);
                    }
                } else if (e.key === "ArrowUp") {
                    // 向上浏览历史记录
                    if (this.inputHistory.length > 0 && this.historyIndex > 0) {
                        this.historyIndex--;
                        this.inputElement.value = this.inputHistory[this.historyIndex];
                    }
                } else if (e.key === "ArrowDown") {
                    // 向下浏览历史记录
                    if (this.historyIndex < this.inputHistory.length - 1) {
                        this.historyIndex++;
                        this.inputElement.value = this.inputHistory[this.historyIndex];
                    } else if (this.historyIndex === this.inputHistory.length - 1) {
                        this.historyIndex++;
                        this.inputElement.value = "";
                    }
                }
            });
            
            inputContainer.appendChild(this.inputElement);
            this.consoleElement.appendChild(inputContainer);

            // 添加到文档
            document.body.appendChild(this.consoleElement);
            
            // 聚焦输入框
            setTimeout(() => {
                if (this.inputElement) {
                    this.inputElement.focus();
                }
            }, 100);
        }

        setBackgroundColor(color) {
            if (!this.consoleElement) return;
            this.consoleElement.style.backgroundColor = color;
        }

        setTextColor(color) {
            if (!this.consoleElement) return;
            this.consoleElement.style.color = color;
            if (this.inputElement) this.inputElement.style.color = color;
        }

        setBorderColor(color) {
            if (!this.consoleElement) return;
            this.consoleElement.style.borderColor = color;
        }

        setFont(fontUrl) {
            if (!this.consoleElement) return;
            
            // 移除之前添加的字体链接（如果存在）
            const oldLink = document.querySelector(`link[data-console-font="${this.name}"]`);
            if (oldLink) {
                document.head.removeChild(oldLink);
            }

            // 创建新的字体链接元素
            const link = document.createElement("link");
            link.href = fontUrl;
            link.rel = "stylesheet";
            link.dataset.consoleFont = this.name; // 添加标识以便后续移除
            
            // 从URL提取字体名称
            let fontFamily = "monospace";
            const match = fontUrl.match(/family=([^&:]+)/);
            if (match) {
                fontFamily = match[1].replace(/\+/g, " ");
            }

            // 先设置默认字体，等字体加载完成后再更新
            this.consoleElement.style.fontFamily = "monospace";
            if (this.inputElement) this.inputElement.style.fontFamily = "monospace";
            
            // 字体加载完成后再应用新字体
            link.onload = () => {
                this.consoleElement.style.fontFamily = `"${fontFamily}", monospace`;
                if (this.inputElement) {
                    this.inputElement.style.fontFamily = `"${fontFamily}", monospace`;
                }
                if (this.outputElement) {
                    this.outputElement.style.fontFamily = `"${fontFamily}", monospace`;
                }
            };

            document.head.appendChild(link);
        }

        printText(text) {
            if (!this.outputElement) return;
            const span = document.createElement("span");
            span.textContent = text;
            span.style.whiteSpace = "pre";
            this.outputElement.appendChild(span);
            // 只保持垂直自动滚动
            this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight;
        }

        printLine(text) {
            if (!this.outputElement) return;
            const div = document.createElement("div");
            div.textContent = text;
            div.style.marginBottom = "3px";
            div.style.whiteSpace = "pre";
            this.outputElement.appendChild(div);
            // 只保持垂直自动滚动
            this.outputElement.parentElement.scrollTop = this.outputElement.scrollHeight;
        }

        clear() {
            if (!this.outputElement) return;
            this.outputElement.innerHTML = "";
        }

        getInputBoxValue() {
            if (!this.inputElement) return "";
            return this.inputElement.value;
        }

        waitForInput() {
            return new Promise(resolve => {
                this.inputCallbacks.push(resolve);
                this.gotInput=true;
            });
        }

        getLastInputData() {
            this.gotInput=true;
            return {
                console: this.name,
                input: this.lastInput,
                timestamp: this.lastInputTime
            };
        }

        hide() {
            if (!this.consoleElement || this.isLocked) return; // 锁定状态下不能隐藏
            this.consoleElement.style.display = "none";
            this.consoleVisible = false;
        }

        show() {
            if (!this.consoleElement) return;
            this.consoleElement.style.display = "flex";
            this.consoleVisible = true;
            
            // 确保在视口内
            const rect = this.consoleElement.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            if (rect.right > windowWidth) {
                this.consoleElement.style.left = (windowWidth - rect.width - 10) + "px";
            }
            if (rect.bottom > windowHeight) {
                this.consoleElement.style.top = (windowHeight - rect.height - 10) + "px";
            }
            if (rect.left < 0) {
                this.consoleElement.style.left = "10px";
            }
            if (rect.top < 0) {
                this.consoleElement.style.top = "10px";
            }
            
            // 聚焦输入框
            setTimeout(() => {
                if (this.inputElement) {
                    this.inputElement.focus();
                }
            }, 100);
        }

        lock() {
            this.isLocked = true;
            const titleBar = this.consoleElement.querySelector('div');
            if (titleBar) {
                titleBar.style.cursor = 'default'; // 改变光标样式
                // 隐藏关闭按钮
                const closeButton = titleBar.querySelector('button');
                if (closeButton) closeButton.style.display = 'none';
            }
        }

        unlock() {
            this.isLocked = false;
            const titleBar = this.consoleElement.querySelector('div');
            if (titleBar) {
                titleBar.style.cursor = 'move'; // 恢复可移动光标
                // 显示关闭按钮
                const closeButton = titleBar.querySelector('button');
                if (closeButton) closeButton.style.display = 'flex';
            }
        }

        setLineBreakMode(useScrollbar) {
            this.lineBreakWhenOver = !useScrollbar;
            if (this.outputElement) {
                if (useScrollbar) {
                    // 使用滚动条模式
                    this.outputElement.style.whiteSpace = "pre";
                    this.outputElement.style.wordBreak = "keep-all";
                    this.outputElement.style.overflowX = "auto";
                } else {
                    // 使用换行模式
                    this.outputElement.style.whiteSpace = "pre-wrap";
                    this.outputElement.style.wordBreak = "break-word";
                    this.outputElement.style.overflowX = "hidden";
                }
            }
        }

        getX() {
            if (!this.consoleElement) return 0;
            return parseInt(this.consoleElement.style.left) || 0;
        }

        getY() {
            if (!this.consoleElement) return 0;
            return parseInt(this.consoleElement.style.top) || 0;
        }

        setTitle(title) {
            if (!this.consoleElement) return;
            const titleElement = this.consoleElement.querySelector("span");
            if (titleElement) {
                titleElement.textContent = title + " - " + this.name;
            }
        }

        setPrompt(prompt) {
            this.prompt = prompt;
            if (this.promptElement) {
                this.promptElement.textContent = prompt;
            }
        }

        exists() {
            return !!this.consoleElement;
        }

        showing() {
            return this.consoleVisible;
        }

        destroy() {
            if (this.consoleElement && this.consoleElement.parentNode) {
                this.consoleElement.parentNode.removeChild(this.consoleElement);
            }
            this.consoleElement = null;
            this.outputElement = null;
            this.inputElement = null;
            this.promptElement = null;
            this.consoleVisible = false;
        }

    }



    class ZRConsole {
        constructor(runtime) {
            this.runtime = runtime;
            this.consoles = {};
            this.defaultConsoleName = "main";
        }

        getInfo() {
            return {
                id: "ZRConsole",
                name: translate({id: "extensionName"}),
                color1: "#4C97FF",
                color2: "#3373CC",
                blocks: [
                    {
                        opcode: "createConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "createConsole"}),
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            WIDTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 400
                            },
                            HEIGHT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 300
                            }
                        }
                    },
                    {
                        opcode: "setBackgroundColor",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setBackgroundColor"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: "#000000"
                            }
                        }
                    },
                    {
                        opcode: "setTextColor",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setTextColor"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: "#FFFFFF"
                            }
                        }
                    },
                    {
                        opcode: "setBorderColor",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setBorderColor"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            COLOR: {
                               type: ArgumentType.COLOR,
                                defaultValue: "#4C97FF"
                            }
                        }
                    },
                    {
                        opcode: "setFont",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setFont"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            FONT_URL: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: "consoleDefaultFont"})
                            }
                        }
                    },
                    {
                        opcode: "printText",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "printText"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello, Console!"
                            }
                        }
                    },
                    {
                        opcode: "printLine",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "printLine"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Hello, Console!"
                            }
                        }
                    },
                    {
                        opcode: "clearConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "clearConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "getInputBox",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "getInputBox"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "getInputValue",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "getInputValue"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "waitForInput",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "waitForInput"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "getLastConsoleInput",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "getLastConsoleInput"}),
                        arguments: {}
                    },
                    {
                        opcode: "gotInput",
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: "gotInput"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "hideConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "hideConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "showConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "showConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "lockConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "lockConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "unlockConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "unlockConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "setLineBreakMode",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setLineBreakMode"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: "lineBreakMode",
                                defaultValue: "scroll"
                            }
                        }
                    },
                    {
                        opcode: "getConsoleX",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "getConsoleX"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "getConsoleY",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "getConsoleY"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "setConsoleTitle",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setConsoleTitle"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: "consoleDefaultTitle"})
                            }
                        }
                    },
                    {
                        opcode: "setPrompt",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "setPrompt"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            },
                            PROMPT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: "consoleDefaultPrompt"})
                            }
                        }
                    },
                    {
                        opcode: "consoleExists",
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: "consoleExists"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "consoleShows",
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: "consoleShows"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "consoleIsLocked",
                        blockType: BlockType.BOOLEAN,
                        text: translate({id: "consoleIsLocked"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "removeConsole",
                        blockType: BlockType.COMMAND,
                        text: translate({id: "removeConsole"}),
                        arguments: {
                            CONSOLE: {
                                type: ArgumentType.STRING,
                                defaultValue: "main"
                            }
                        }
                    },
                    {
                        opcode: "listConsoles",
                        blockType: BlockType.REPORTER,
                        text: translate({id: "listConsoles"})
                    }
                ],
                menus: {
                    lineBreakMode: {
                    items:
                    [
                        {
                            text: translate({id: "scrollMode"}),
                            value: "scroll"
                        },
                        {
                            text: translate({id: "wrapMode"}),
                            value: "wrap"
                        }
                    ]
            }
        }
            };
        }


        getConsole(name) {
            if (!name) name = this.defaultConsoleName;
            return this.consoles[name];
        }

        createConsole(args) {
            const name = Cast.toString(args.NAME);
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const width = Cast.toNumber(args.WIDTH);
            const height = Cast.toNumber(args.HEIGHT);
            
            // 确保最小尺寸
            const safeWidth = Math.max(200, width);
            const safeHeight = Math.max(150, height);
            
            if (this.consoles[name]) {
                // 更新现有控制台
                this.consoles[name].destroy();
            }
            
            this.consoles[name] = new Console(name, x, y, safeWidth, safeHeight, this.runtime);
        }

        setBackgroundColor(args) {
            const name = Cast.toString(args.CONSOLE);
            const color = Cast.toString(args.COLOR);
            const console = this.getConsole(name);
            if (console) console.setBackgroundColor(color);
        }

        setTextColor(args) {
            const name = Cast.toString(args.CONSOLE);
            const color = Cast.toString(args.COLOR);
            const console = this.getConsole(name);
            if (console) console.setTextColor(color);
        }

        setBorderColor(args) {
            const name = Cast.toString(args.CONSOLE);
            const color = Cast.toString(args.COLOR);
            const console = this.getConsole(name);
            if (console) console.setBorderColor(color);
        }

        setFont(args) {
            const name = Cast.toString(args.CONSOLE);
            const fontUrl = Cast.toString(args.FONT_URL);
            const console = this.getConsole(name);
            if (console) console.setFont(fontUrl);
        }

        printText(args) {
            const name = Cast.toString(args.CONSOLE);
            const text = Cast.toString(args.TEXT);
            const console = this.getConsole(name);
            if (console) console.printText(text);
        }

        printLine(args) {
            const name = Cast.toString(args.CONSOLE);
            const text = Cast.toString(args.TEXT);
            const console = this.getConsole(name);
            if (console) console.printLine(text);
        }

        clearConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (console) console.clear();
        }

        getInputBox(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (!console) return "";
            return console.getInputBoxValue();
        }

        async waitForInput(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (!console) return "";
            return console.waitForInput();
            
        }

        getLastConsoleInput() {
            let lastInput = null;
            let latestTime = 0;

            // 遍历所有控制台，找出最近的一次输入
            for (const console of Object.values(this.consoles)) {
                if (console.lastInputTime > latestTime) {
                    console.gotInput=true;
                    latestTime = console.lastInputTime;
                    lastInput = {
                        console: console.name,
                        input: console.lastInput
                    };
                }
            }
            return lastInput ? JSON.stringify(lastInput) : "{}";
        }

        gotInput(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            return (console)?console.gotInput : "";
        }

        getInputValue(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if(!console) return "";
            console.gotInput=true;
            return console.lastInput;
        }

        hideConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (console) console.hide();
        }

        showConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (console) console.show();
        }

        lockConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (console) console.lock();
        }

        unlockConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (console) console.unlock();
        }

        setLineBreakMode(args) {
            const name = Cast.toString(args.CONSOLE);
            const mode = Cast.toString(args.MODE);
            const console = this.getConsole(name);
            if (console) {
                console.setLineBreakMode(mode === "scroll");
            }
        }

        getConsoleX(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            return console ? console.getX() : "";
        }

        getConsoleY(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            return console ? console.getY() : ""
        }

        setConsoleTitle(args) {
            const name = Cast.toString(args.CONSOLE);
            const title = Cast.toString(args.TITLE);
            const console = this.getConsole(name);
            if (console) console.setTitle(title);
        }

        setPrompt(args) {
            const name = Cast.toString(args.CONSOLE);
            const prompt = Cast.toString(args.PROMPT);
            const console = this.getConsole(name);
            if (console) console.setPrompt(prompt);
        }

        consoleExists(args) {
            const name = Cast.toString(args.CONSOLE);
            return !!this.consoles[name] && this.consoles[name].exists();
        }

        consoleShows(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            if (!console) return false;
            return console.consoleVisible;
        }

        consoleIsLocked(args) {
            const name = Cast.toString(args.CONSOLE);
            const console = this.getConsole(name);
            return console ? console.isLocked : false;
        }

        removeConsole(args) {
            const name = Cast.toString(args.CONSOLE);
            if (this.consoles[name]) {
                this.consoles[name].destroy();
                delete this.consoles[name];
            }
        }

        listConsoles() {
            return "[\""+Object.keys(this.consoles).join("\",\"").toString()+"\"]";
        }
    }

    // 注册扩展
    if (typeof Scratch !== "undefined" && typeof Scratch.extensions !== "undefined") {
        extensions.register(new ZRConsole(runtime));
    } else {
        // 用于在Scratch环境外测试
        const extension = new ZRConsole();
        window.MultiConsole = extension;
    }
}(Scratch));