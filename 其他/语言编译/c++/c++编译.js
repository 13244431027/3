(function(_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    // 动态生成默认代码
    const defaultCode = () => {
        return `#include <iostream>
using namespace std;

int main() {
  cout << "Hello from Dream Compiler!";
  return 0;
}`;
    };

    const defaultCodeWithInput = () => {
        return `#include <iostream>
using namespace std;

int main() {
  int num;
  cin >> num;
  cout << "输入的数字是: " << num;
  return 0;
}`;
    };

    // 翻译设置
    translate.setup({
        zh: {
            'extensionName': 'Dream的C++编译器',
            'executeCpp': '执行C++代码 [CODE]',
            'executeCppWithInput': '执行C++代码 [CODE] 并输入 [INPUT]',
            'getOutput': '获取C++输出',
            'getError': '获取C++错误',
            'status': '编译状态',
            'inputPlaceholder': '输入数据，用空格分隔'
        },
        en: {
            'extensionName': 'Dream C++ Compiler',
            'executeCpp': 'Execute C++ code [CODE]',
            'executeCppWithInput': 'Execute C++ code [CODE] with input [INPUT]',
            'getOutput': 'Get C++ output',
            'getError': 'Get C++ error',
            'status': 'Compilation status',
            'inputPlaceholder': 'Input data, separated by spaces'
        }
    });

    class DreamCppCompiler {
        constructor(runtime) {
            this._runtime = runtime;
            this.output = '';
            this.error = '';
            this.status = '就绪';
            this._defaultCode = defaultCode();
            this._defaultCodeWithInput = defaultCodeWithInput();
        }

        getInfo() {
            return {
                id: 'dreamcpp',
                name: translate({ id: 'extensionName' }),
                blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzZGNkY2RiIgZD0iTTkuNSAxYS41LjUgMCAwIDEgLjUuNVYxMWMuMzEtLjA0LjYzLS4wOS45NS0uMTRWMS41YS41LjUgMCAwIDEgMSAwVjExYzEuMjEtLjQ3IDIuNDctLjg2IDMuNzctMS4xVjEuNWEuNS41IDAgMCAxIDEgMFYxMGMuODIuMjMgMS42NC41NyAyLjQ0IDEuMDJ2LTEuNTNhNy40NyA3LjQ3IDAgMCAwLTEuNTgtLjQ1VjEuNWEuNS41IDAgMCAxIDEgMFY4LjI2YzEuMzQuNTYgMi42NyAxLjI1IDMuOTYgMi4wN3YtMS41M2E4LjQ3IDguNDcgMCAwIDAtMS45OS0uNjJWMS41YS41LjUgMCAwIDEgMSAwVjYuNjJhOS40NyA5LjQ3IDAgMCAwLTIuNDYtLjc4VjEuNWEuNS41IDAgMCAxIDEgMFY1LjQ0YTkuOTYgOS45NiAwIDAgMC0yLjkyLS45N1YxLjVhLjUuNSAwIDAgMSAxIDBWNC41NmMtMS45MS0uNjctMy44OS0xLTE1Ljc5LTEuMHYxLjVhMTMuOTYgMTMuOTYgMCAwIDEgMTQuNzkgMS4xVjE0LjVDMiA1LjcgMiA1LjcgMiA1LjVWNC41QzIgMi45NyAzLjQ3IDIgNSAyVjIuNWMuMzEgMCAuNjIuMDQuOTIuMTRWMS41YS41LjUgMCAwIDEgMSAwVjIuN2MuNjgtLjA1IDEuMzctLjA4IDIuMDctLjA4VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjEuNWEuNS41IDAgMCAxIDEgMFYzLjVoMS41VjIuN2MuNzYgMCAxLjQ3LjA1IDIuMTQuMTVWMS41YS41LjUgMCAwIDEgMSAwVjIuOGMxLjU1LjI1IDIuOTIgMS4xNyAzLjYzIDIuNjd2MS41M2MtMS4yMy0uNzktMi41MS0xLjQ0LTMuODMtMS45N1YxLjVhLjUuNSAwIDAgMSAxIDBWNC43OGMuODguMjcgMS43Ni42MyAyLjYxIDEuMDl2MS41M2MtMS4xNy0uNjYtMi4zOS0xLjIyLTMuNjQtMS42N1YxLjVhLjUuNSAwIDAgMSAxIDBWNi40N20xMC41IDEwLjVoLTEuNXYtMS41aDEuNXYxLjVtMC0zLjVoLTEuNXYtMS41aDEuNXYxLjVtMC0zLjVoLTEuNXYtMS41aDEuNXYxLjVtMC0zLjVoLTEuNXYtMS41aDEuNXYxLjVtMC0zLjVoLTEuNXYtMS41aDEuNXYxLjVtLTMgMTIuNWgtMS41di0xLjVoMS41djE1bTMtMy41aC0xLjV2LTEuNWgxLjV2MS41bTMtMy41aC0xLjV2LTEuNWgxLjV2MS41bTMtMy41aC0xLjV2LTEuNWgxLjV2MS41Ii8+PC9zdmc+',
                blockIconUnicode: '💻',
                blockIconColor: '#4A86E8',
                blockIconSecondaryColor: '#2A65CC',
                blocks: [
                    {
                        opcode: 'executeCpp',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'executeCpp' }),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: this._defaultCode
                            }
                        }
                    },
                    {
                        opcode: 'executeCppWithInput',
                        blockType: BlockType.COMMAND,
                        text: translate({ id: 'executeCppWithInput' }),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: this._defaultCodeWithInput
                            },
                            INPUT: {
                                type: ArgumentType.STRING,
                                defaultValue: '123'
                            }
                        }
                    },
                    {
                        opcode: 'getOutput',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getOutput' }),
                        disableMonitor: false
                    },
                    {
                        opcode: 'getError',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'getError' }),
                        disableMonitor: false
                    },
                    {
                        opcode: 'getStatus',
                        blockType: BlockType.REPORTER,
                        text: translate({ id: 'status' }),
                        disableMonitor: false
                    }
                ],
                menus: {}
            };
        }

        async executeCpp(args) {
            const code = Cast.toString(args.CODE);
            await this._executeCppCode(code, '');
        }

        async executeCppWithInput(args) {
            const code = Cast.toString(args.CODE);
            const input = Cast.toString(args.INPUT);
            await this._executeCppCode(code, input);
        }

        getOutput() {
            return this.output;
        }

        getError() {
            return this.error;
        }

        getStatus() {
            return this.status;
        }

        async _executeCppCode(code, input) {
            this.output = '';
            this.error = '';
            this.status = '编译中...';

            try {
                // 格式化输入数据
                const formattedInput = input.trim().split(/[\s,]+/).join('\n');

                // 使用Piston API执行C++代码
                const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: 'cpp',
                        version: '10.2.0',
                        files: [{ content: code }],
                        stdin: formattedInput
                    })
                });

                if (!response.ok) {
                    throw new Error(`API响应错误: ${response.status}`);
                }

                const result = await response.json();
                
                // 处理执行结果
                this.output = result.run?.stdout?.trim() || '';
                this.error = result.run?.stderr || result.compile?.stderr || '';
                
                // 设置状态
                this.status = this.error ? '编译失败' : '执行成功';
                
            } catch (err) {
                this.error = `请求失败: ${err.message}`;
                this.status = '错误';
            }
        }
    }

    // 注册扩展
    extensions.register(new DreamCppCompiler(runtime));
}(Scratch));    