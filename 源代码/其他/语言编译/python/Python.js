(function(_Scratch) {
    const { ArgumentType, BlockType, Cast, translate, extensions, runtime } = _Scratch;

    // 动态生成默认Python代码
    const defaultPythonCode = () => {
        return `print("Hello from Dream的Python编译器!")`;
    };

    const defaultPythonCodeWithInput = () => {
        return `num = int(input())
print("输入的数字是:", num)`;
    };

    // 翻译设置
    translate.setup({
        zh: {
            'extensionName': 'Python',
            'executePython': '执行Python代码 [CODE]',
            'executePythonWithInput': '执行Python代码 [CODE] 并输入 [INPUT]',
            'getPythonOutput': '获取Python输出',
            'getPythonError': '获取Python错误',
            'pythonStatus': '运行状态',
            'inputPlaceholder': '输入数据，用换行分隔'
        },
        en: {
            'extensionName': 'Dream Python Compiler',
            'executePython': 'Execute Python code [CODE]',
            'executePythonWithInput': 'Execute Python code [CODE] with input [INPUT]',
            'getPythonOutput': 'Get Python output',
            'getPythonError': 'Get Python error',
            'pythonStatus': 'Execution status',
            'inputPlaceholder': 'Input data, separated by newlines'
        }
    });

    class DreamPythonCompiler {
        constructor(runtime) {
            this._runtime = runtime;
            this.output = '';
            this.error = '';
            this.status = '就绪';
            this._defaultPythonCode = defaultPythonCode();
            this._defaultPythonCodeWithInput = defaultPythonCodeWithInput();
        }

        getInfo() {
            return {
                id: 'Dreampy',  // 设置id为Dreampy
                name: translate({ id: 'extensionName' }),
                blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0Y3MDkzRSIgZD0iTTExIDNDNi4wMyAzIDIgNy4wMyAyIDEyVjE4YzAgNC45NyA0LjAzIDkgOSA5czkgLTQuMDMgOS05VjEyYzAgLTMuMzEtMS42NC02LjE2LTQuMjktNy43M0wxMSAzWiBNMTcgMTVIMTRWMTRIMTdWMTVNMTcgMTFIMTRWMTBIMTdWMTRNMTcgN0g3VjVIMTdWMjdNMjEgMThIMTdWMjBIMjFWMThNMjEgMTRIMTdWMTRIMjFWMTRNMjEgMTBIMTdWMTRIMjFWMTRNMjEgN0gyM1Y1IDIxIDVWN0gyMVoiLz48L3N2Zz4=',
                blockIconUnicode: '🐍',  // Python标志性图标
                blockIconColor: '#306998',  // Python官方蓝色
                blockIconSecondaryColor: '#FFD43B',  // Python官方黄色
                blocks: [
                    {
                        opcode: 'executePython',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'executePython' }),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: this._defaultPythonCode
                            }
                        }
                    },
                    {
                        opcode: 'executePythonWithInput',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'executePythonWithInput' }),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: this._defaultPythonCodeWithInput
                            },
                            INPUT: {
                                type: ArgumentType.STRING,
                                defaultValue: '123'
                            }
                        }
                    },
                    {
                        opcode: 'getPythonOutput',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getPythonOutput' }),
                        disableMonitor: false
                    },
                    {
                        opcode: 'getPythonError',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getPythonError' }),
                        disableMonitor: false
                    },
                    {
                        opcode: 'getPythonStatus',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'pythonStatus' }),
                        disableMonitor: false
                    }
                ],
                menus: {}
            };
        }

        async executePython(args) {
            const code = Cast.toString(args.CODE);
            await this._executePythonCode(code, '');
        }

        async executePythonWithInput(args) {
            const code = Cast.toString(args.CODE);
            const input = Cast.toString(args.INPUT);
            await this._executePythonCode(code, input);
        }

        getPythonOutput() {
            return this.output;
        }

        getPythonError() {
            return this.error;
        }

        getPythonStatus() {
            return this.status;
        }

        async _executePythonCode(code, input) {
            this.output = '';
            this.error = '';
            this.status = '运行中...';

            try {
                // 格式化输入数据（Python的input()按行读取）
                const formattedInput = input.trim().split(/[\s,]+/).join('\n');

                // 使用Piston API执行Python代码（支持Python 3.10版本）
                const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: 'python',  // 指定Python语言
                        version: '3.10.0',   // 使用Python 3.10版本
                        files: [{ content: code }],
                        stdin: formattedInput
                    })
                });

                if (!response.ok) {
                    throw new Error(`API响应错误: ${response.status}`);
                }

                const result = await response.json();
                
                // 处理执行结果（Python是解释型语言，没有编译阶段）
                this.output = result.run?.stdout?.trim() || '';
                this.error = result.run?.stderr || '';
                
                // 设置状态
                this.status = this.error ? '运行失败' : '执行成功';
                
            } catch (err) {
                this.error = `请求失败: ${err.message}`;
                this.status = '错误';
            }
        }
    }

    // 注册扩展
    extensions.register(new DreamPythonCompiler(runtime));
}(Scratch));