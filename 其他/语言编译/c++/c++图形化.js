(function(_Scratch) {
    const { ArgumentType, BlockType, extensions, Cast } = _Scratch;

    class DreamCppGenerator {
        constructor() {
            this.resetState();
        }

        // 重置生成状态（保留已生成的代码）
        resetState() {
            this.generatedCode = "";         // 主代码内容（累积存储）
            this.includes = new Set(["<iostream>"]);  // 头文件集合（自动去重）
            this.globalCode = "";            // 全局代码（函数定义等放在main外的内容）
            this.currentFunction = null;     // 当前正在定义的函数
            this.indentLevel = 0;            // 缩进级别
            this.functionParams = {};        // 函数参数存储
            this.usedFeatures = {            // 已使用的特性（用于自动添加头文件）
                math: false,
                string: false,
                vector: false,
                algorithm: false,
                cmath: false,
                ctime: false
            };
            // 保留代码状态（不重置已生成的代码）
            if (this.currentGeneratedCode === undefined) {
                this.currentGeneratedCode = "";  // 存储当前生成的代码
                this.initialCode = "请先生成代码";  // 初始提示文本
            }
        }

        getInfo() {
            return {
                id: 'DreamcppGenerator',
                name: 'Dream的C++代码生成器',
                color1: '#4C97FF',
                color2: '#3373CC',
                blocks: [
                    // 程序结构
                    {
                        opcode: 'whenGreenFlag',
                        blockType: BlockType.HAT,
                        text: '程序开始',
                        tooltip: '程序从这里开始执行'
                    },
                    {
                        opcode: 'startMain',
                        blockType: BlockType.COMMAND,
                        text: '开始主函数',
                        tooltip: '定义main函数，程序的主入口'
                    },
                    {
                        opcode: 'endMain',
                        blockType: BlockType.COMMAND,
                        text: '结束主函数',
                        tooltip: '结束main函数定义'
                    },
                    
                    // 输入输出
                    {
                        opcode: 'printText',
                        blockType: BlockType.COMMAND,
                        text: '打印 [TEXT]',
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: '"你好，世界！"'
                            }
                        },
                        tooltip: '向控制台输出文本'
                    },
                    {
                        opcode: 'printVar',
                        blockType: BlockType.COMMAND,
                        text: '打印变量 [VAR]',
                        arguments: {
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            }
                        },
                        tooltip: '向控制台输出变量的值'
                    },
                    {
                        opcode: 'readInput',
                        blockType: BlockType.COMMAND,
                        text: '读取输入到 [VAR]',
                        arguments: {
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            }
                        },
                        tooltip: '从控制台读取用户输入'
                    },
                    {
                        opcode: 'printFormat',
                        blockType: BlockType.COMMAND,
                        text: '格式化打印 [FORMAT] [VARS]',
                        arguments: {
                            FORMAT: {
                                type: ArgumentType.STRING,
                                defaultValue: '"x=%d, y=%.2f"'
                            },
                            VARS: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x, y'
                            }
                        },
                        tooltip: '使用printf格式化输出'
                    },
                    
                    // 变量
                    {
                        opcode: 'declareVar',
                        blockType: BlockType.COMMAND,
                        text: '声明变量 类型 [TYPE] 名称 [NAME] 值 [VALUE]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '0'
                            }
                        },
                        tooltip: '声明并初始化一个变量'
                    },
                    {
                        opcode: 'assignVar',
                        blockType: BlockType.COMMAND,
                        text: '赋值 [VAR] = [VALUE]',
                        arguments: {
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '10'
                            }
                        },
                        tooltip: '给变量赋值'
                    },
                    {
                        opcode: 'declareArray',
                        blockType: BlockType.COMMAND,
                        text: '声明数组 类型 [TYPE] 名称 [NAME] 大小 [SIZE]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'arr'
                            },
                            SIZE: {
                                type: ArgumentType.STRING,
                                defaultValue: '10'
                            }
                        },
                        tooltip: '声明一个数组'
                    },
                    
                    // 控制结构
                    {
                        opcode: 'ifBlock',
                        blockType: BlockType.CONDITIONAL,
                        text: '如果 [CONDITION]',
                        arguments: {
                            CONDITION: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x > 10'
                            }
                        },
                        tooltip: '条件判断语句'
                    },
                    {
                        opcode: 'elseIfBlock',
                        blockType: BlockType.CONDITIONAL,
                        text: '否则如果 [CONDITION]',
                        arguments: {
                            CONDITION: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x < 0'
                            }
                        },
                        tooltip: '附加条件判断'
                    },
                    {
                        opcode: 'elseBlock',
                        blockType: BlockType.CONDITIONAL,
                        text: '否则',
                        tooltip: '当所有条件都不满足时执行'
                    },
                    {
                        opcode: 'forLoop',
                        blockType: BlockType.CONDITIONAL,
                        text: '循环 从 [VAR]=[START] 到 [END] 步长 [STEP]',
                        arguments: {
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'i'
                            },
                            START: {
                                type: ArgumentType.STRING,
                                defaultValue: '0'
                            },
                            END: {
                                type: ArgumentType.STRING,
                                defaultValue: '10'
                            },
                            STEP: {
                                type: ArgumentType.STRING,
                                defaultValue: '1'
                            }
                        },
                        tooltip: 'for循环结构'
                    },
                    {
                        opcode: 'rangeBasedFor',
                        blockType: BlockType.CONDITIONAL,
                        text: '范围循环 类型 [TYPE] 变量 [VAR] 容器 [CONTAINER]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'num'
                            },
                            CONTAINER: {
                                type: ArgumentType.STRING,
                                defaultValue: 'numbers'
                            }
                        },
                        tooltip: 'C++11范围for循环'
                    },
                    {
                        opcode: 'whileLoop',
                        blockType: BlockType.CONDITIONAL,
                        text: '当 [CONDITION] 时循环',
                        arguments: {
                            CONDITION: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x < 100'
                            }
                        },
                        tooltip: 'while循环结构'
                    },
                    {
                        opcode: 'doWhileLoop',
                        blockType: BlockType.CONDITIONAL,
                        text: '执行循环直到 [CONDITION]',
                        arguments: {
                            CONDITION: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x >= 100'
                            }
                        },
                        tooltip: 'do-while循环结构'
                    },
                    {
                        opcode: 'switchCase',
                        blockType: BlockType.CONDITIONAL,
                        text: 'switch [VAR]',
                        arguments: {
                            VAR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            }
                        },
                        tooltip: 'switch-case选择结构'
                    },
                    {
                        opcode: 'caseStatement',
                        blockType: BlockType.CONDITIONAL,
                        text: 'case [VALUE]',
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '1'
                            }
                        },
                        tooltip: 'case分支'
                    },
                    {
                        opcode: 'defaultCase',
                        blockType: BlockType.CONDITIONAL,
                        text: 'default',
                        tooltip: '默认分支'
                    },
                    
                    // 数学运算
                    {
                        opcode: 'mathOperation',
                        blockType: BlockType.REPORTER,
                        text: '[OPERATION] [A] [B]',
                        arguments: {
                            OPERATION: {
                                type: ArgumentType.STRING,
                                menu: 'mathOps',
                                defaultValue: '+'
                            },
                            A: {
                                type: ArgumentType.STRING,
                                defaultValue: '5'
                            },
                            B: {
                                type: ArgumentType.STRING,
                                defaultValue: '3'
                            }
                        },
                        tooltip: '基本数学运算'
                    },
                    {
                        opcode: 'mathFunction',
                        blockType: BlockType.REPORTER,
                        text: '[FUNC]([X])',
                        arguments: {
                            FUNC: {
                                type: ArgumentType.STRING,
                                menu: 'mathFuncs',
                                defaultValue: 'sqrt'
                            },
                            X: {
                                type: ArgumentType.STRING,
                                defaultValue: '25'
                            }
                        },
                        tooltip: '数学函数计算'
                    },
                    {
                        opcode: 'randomNumber',
                        blockType: BlockType.REPORTER,
                        text: '随机数 [MIN] 到 [MAX]',
                        arguments: {
                            MIN: {
                                type: ArgumentType.NUMBER,
                                defaultValue: '1'
                            },
                            MAX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: '100'
                            }
                        },
                        tooltip: '生成指定范围的随机数'
                    },
                    
                    // 字符串处理
                    {
                        opcode: 'stringLength',
                        blockType: BlockType.REPORTER,
                        text: '[STR]的长度',
                        arguments: {
                            STR: {
                                type: ArgumentType.STRING,
                                defaultValue: '"hello"'
                            }
                        },
                        tooltip: '获取字符串长度'
                    },
                    {
                        opcode: 'stringConcat',
                        blockType: BlockType.REPORTER,
                        text: '连接字符串 [A] 和 [B]',
                        arguments: {
                            A: {
                                type: ArgumentType.STRING,
                                defaultValue: '"hello"'
                            },
                            B: {
                                type: ArgumentType.STRING,
                                defaultValue: '"world"'
                            }
                        },
                        tooltip: '连接两个字符串'
                    },
                    {
                        opcode: 'stringSubstr',
                        blockType: BlockType.REPORTER,
                        text: '子字符串 [STR] 从 [POS] 长度 [LEN]',
                        arguments: {
                            STR: {
                                type: ArgumentType.STRING,
                                defaultValue: '"hello"'
                            },
                            POS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: '1'
                            },
                            LEN: {
                                type: ArgumentType.NUMBER,
                                defaultValue: '3'
                            }
                        },
                        tooltip: '获取子字符串'
                    },
                    {
                        opcode: 'stringFind',
                        blockType: BlockType.REPORTER,
                        text: '在 [STR] 中查找 [SUB]',
                        arguments: {
                            STR: {
                                type: ArgumentType.STRING,
                                defaultValue: '"hello"'
                            },
                            SUB: {
                                type: ArgumentType.STRING,
                                defaultValue: '"ell"'
                            }
                        },
                        tooltip: '查找子字符串位置'
                    },
                    
                    // STL容器
                    {
                        opcode: 'declareVector',
                        blockType: BlockType.COMMAND,
                        text: '声明vector 类型 [TYPE] 名称 [NAME]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'v'
                            }
                        },
                        tooltip: '声明一个vector容器'
                    },
                    {
                        opcode: 'vectorPush',
                        blockType: BlockType.COMMAND,
                        text: '向 [VECTOR] 添加 [VALUE]',
                        arguments: {
                            VECTOR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'v'
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '5'
                            }
                        },
                        tooltip: '向vector末尾添加元素'
                    },
                    {
                        opcode: 'declareMap',
                        blockType: BlockType.COMMAND,
                        text: '声明map 键类型 [KEY] 值类型 [VALUE] 名称 [NAME]',
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'string'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'm'
                            }
                        },
                        tooltip: '声明一个map容器'
                    },
                    {
                        opcode: 'mapInsert',
                        blockType: BlockType.COMMAND,
                        text: '向 [MAP] 插入 [KEY] : [VALUE]',
                        arguments: {
                            MAP: {
                                type: ArgumentType.STRING,
                                defaultValue: 'm'
                            },
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: '1'
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '"one"'
                            }
                        },
                        tooltip: '向map插入键值对'
                    },
                    
                    // 排序算法
                    {
                        opcode: 'sortArray',
                        blockType: BlockType.COMMAND,
                        text: '排序数组 [ARRAY] 大小 [SIZE]',
                        arguments: {
                            ARRAY: {
                                type: ArgumentType.STRING,
                                defaultValue: 'arr'
                            },
                            SIZE: {
                                type: ArgumentType.STRING,
                                defaultValue: '10'
                            }
                        },
                        tooltip: '使用标准库排序数组'
                    },
                    {
                        opcode: 'sortVector',
                        blockType: BlockType.COMMAND,
                        text: '排序vector [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: ArgumentType.STRING,
                                defaultValue: 'v'
                            }
                        },
                        tooltip: '使用标准库排序vector'
                    },
                    {
                        opcode: 'customSort',
                        blockType: BlockType.COMMAND,
                        text: '自定义排序 [CONTAINER] 比较函数 [FUNC]',
                        arguments: {
                            CONTAINER: {
                                type: ArgumentType.STRING,
                                defaultValue: 'v'
                            },
                            FUNC: {
                                type: ArgumentType.STRING,
                                defaultValue: 'compare'
                            }
                        },
                        tooltip: '使用自定义比较函数排序'
                    },
                    
                    // 函数
                    {
                        opcode: 'defineFunc',
                        blockType: BlockType.COMMAND,
                        text: '定义函数 类型 [TYPE] 名称 [NAME]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'void'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'myFunc'
                            }
                        },
                        tooltip: '定义一个函数'
                    },
                    {
                        opcode: 'addParam',
                        blockType: BlockType.COMMAND,
                        text: '添加参数 类型 [TYPE] 名称 [NAME]',
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'varTypes',
                                defaultValue: 'int'
                            },
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'x'
                            }
                        },
                        tooltip: '向函数添加参数'
                    },
                    {
                        opcode: 'returnValue',
                        blockType: BlockType.COMMAND,
                        text: '返回 [VALUE]',
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: '0'
                            }
                        },
                        tooltip: '从函数返回值'
                    },
                    {
                        opcode: 'callFunc',
                        blockType: BlockType.COMMAND,
                        text: '调用函数 [NAME]',
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'myFunc'
                            }
                        },
                        tooltip: '调用一个函数'
                    },
                    
                    // 代码生成相关积木（核心修改部分）
                    {
                        opcode: 'getCurrentGeneratedCode',
                        blockType: BlockType.REPORTER,
                        text: '当前生成的代码',
                        tooltip: '获取最近一次生成的C++代码'
                    },
                    {
                        opcode: 'generateCode',
                        blockType: BlockType.COMMAND,
                        text: '生成C++代码并存储',
                        tooltip: '生成完整C++代码并存储到"当前生成的代码"积木'
                    },
                    {
                        opcode: 'clearGeneratedCode',
                        blockType: BlockType.COMMAND,
                        text: '清空生成的代码',
                        tooltip: '手动清空已生成的代码'
                    }
                ],
                menus: {
                    varTypes: {
                        acceptReporters: true,
                        items: [
                            'int',
                            'float',
                            'double',
                            'bool',
                            'char',
                            'string',
                            'long',
                            'long long',
                            'unsigned int',
                            'unsigned long',
                            'short',
                            'auto',
                            'vector<int>',
                            'vector<string>',
                            'map<int, string>',
                            'pair<int, int>'
                        ]
                    },
                    mathOps: {
                        acceptReporters: true,
                        items: [
                            '+',
                            '-',
                            '*',
                            '/',
                            '%',
                            '+=',
                            '-=',
                            '*=',
                            '/=',
                            '%='
                        ]
                    },
                    mathFuncs: {
                        acceptReporters: true,
                        items: [
                            'sqrt',
                            'pow',
                            'abs',
                            'fabs',
                            'sin',
                            'cos',
                            'tan',
                            'asin',
                            'acos',
                            'atan',
                            'log',
                            'log10',
                            'exp',
                            'ceil',
                            'floor',
                            'round'
                        ]
                    }
                }
            };
        }

        // 程序开始（绿旗事件）：保留已生成的代码
        whenGreenFlag() {
            // 保存当前已生成的代码和初始提示状态
            const savedCode = this.currentGeneratedCode;
            const savedInitial = this.initialCode;
            
            // 重置其他状态但保留代码
            this.resetState();
            
            // 恢复保存的代码状态
            this.currentGeneratedCode = savedCode;
            this.initialCode = savedInitial;
        }

        // 开始主函数
        startMain() {
            this._addCodeLine("int main() {");
            this.indentLevel++;
            this.currentFunction = "main";
        }

        // 结束主函数
        endMain() {
            if (this.currentFunction === "main") {
                this._addCodeLine("return 0;");
                this.indentLevel--;
                this._addCodeLine("}");
                this.currentFunction = null;
            }
        }

        // 输入输出
        printText(args) {
            this.includes.add("<iostream>");
            this._addCodeLine(`std::cout << ${args.TEXT} << std::endl;`);
        }

        printVar(args) {
            this.includes.add("<iostream>");
            this._addCodeLine(`std::cout << ${args.VAR} << std::endl;`);
        }

        readInput(args) {
            this.includes.add("<iostream>");
            this._addCodeLine(`std::cin >> ${args.VAR};`);
        }

        printFormat(args) {
            this.includes.add("<cstdio>");
            this._addCodeLine(`printf(${args.FORMAT}, ${args.VARS});`);
        }

        // 变量
        declareVar(args) {
            this._addCodeLine(`${args.TYPE} ${args.NAME} = ${args.VALUE};`);
        }

        assignVar(args) {
            this._addCodeLine(`${args.VAR} = ${args.VALUE};`);
        }

        declareArray(args) {
            this._addCodeLine(`${args.TYPE} ${args.NAME}[${args.SIZE}];`);
        }

        // 控制结构
        ifBlock(args, util) {
            this._addCodeLine(`if (${args.CONDITION}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        elseIfBlock(args, util) {
            this._addCodeLine(`else if (${args.CONDITION}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        elseBlock(args, util) {
            this._addCodeLine("else {");
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        forLoop(args, util) {
            this._addCodeLine(`for (int ${args.VAR} = ${args.START}; ${args.VAR} < ${args.END}; ${args.VAR} += ${args.STEP}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        rangeBasedFor(args, util) {
            this.includes.add("<vector>");
            this._addCodeLine(`for (${args.TYPE} ${args.VAR} : ${args.CONTAINER}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        whileLoop(args, util) {
            this._addCodeLine(`while (${args.CONDITION}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        doWhileLoop(args, util) {
            this._addCodeLine("do {");
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine(`} while (${args.CONDITION});`);
        }

        switchCase(args, util) {
            this._addCodeLine(`switch (${args.VAR}) {`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this.indentLevel--;
            this._addCodeLine("}");
        }

        caseStatement(args, util) {
            this._addCodeLine(`case ${args.VALUE}:`);
            this.indentLevel++;
            if (util.stack) util.stack();
            this._addCodeLine("break;");
            this.indentLevel--;
        }

        defaultCase(args, util) {
            this._addCodeLine("default:");
            this.indentLevel++;
            if (util.stack) util.stack();
            this._addCodeLine("break;");
            this.indentLevel--;
        }

        // 数学运算
        mathOperation(args) {
            return `(${args.A} ${args.OPERATION} ${args.B})`;
        }

        mathFunction(args) {
            this.includes.add("<cmath>");
            this.usedFeatures.cmath = true;
            return `${args.FUNC}(${args.X})`;
        }

        randomNumber(args) {
            this.includes.add("<cstdlib>");
            this.includes.add("<ctime>");
            this.usedFeatures.ctime = true;
            return `(rand() % (${args.MAX} - ${args.MIN} + 1) + ${args.MIN})`;
        }

        // 字符串处理
        stringLength(args) {
            this.includes.add("<string>");
            this.usedFeatures.string = true;
            return `${args.STR}.length()`;
        }

        stringConcat(args) {
            this.includes.add("<string>");
            this.usedFeatures.string = true;
            return `${args.A} + ${args.B}`;
        }

        stringSubstr(args) {
            this.includes.add("<string>");
            this.usedFeatures.string = true;
            return `${args.STR}.substr(${args.POS}, ${args.LEN})`;
        }

        stringFind(args) {
            this.includes.add("<string>");
            this.usedFeatures.string = true;
            return `${args.STR}.find(${args.SUB})`;
        }

        // STL容器
        declareVector(args) {
            this.includes.add("<vector>");
            this.usedFeatures.vector = true;
            this._addCodeLine(`std::vector<${args.TYPE}> ${args.NAME};`);
        }

        vectorPush(args) {
            this.includes.add("<vector>");
            this.usedFeatures.vector = true;
            this._addCodeLine(`${args.VECTOR}.push_back(${args.VALUE});`);
        }

        declareMap(args) {
            this.includes.add("<map>");
            this.usedFeatures.vector = true;
            this._addCodeLine(`std::map<${args.KEY}, ${args.VALUE}> ${args.NAME};`);
        }

        mapInsert(args) {
            this.includes.add("<map>");
            this.usedFeatures.vector = true;
            this._addCodeLine(`${args.MAP}.insert({${args.KEY}, ${args.VALUE}});`);
        }

        // 排序算法
        sortArray(args) {
            this.includes.add("<algorithm>");
            this.usedFeatures.algorithm = true;
            this._addCodeLine(`std::sort(${args.ARRAY}, ${args.ARRAY} + ${args.SIZE});`);
        }

        sortVector(args) {
            this.includes.add("<algorithm>");
            this.includes.add("<vector>");
            this.usedFeatures.algorithm = true;
            this.usedFeatures.vector = true;
            this._addCodeLine(`std::sort(${args.VECTOR}.begin(), ${args.VECTOR}.end());`);
        }

        customSort(args) {
            this.includes.add("<algorithm>");
            this.usedFeatures.algorithm = true;
            this._addCodeLine(`std::sort(${args.CONTAINER}.begin(), ${args.CONTAINER}.end(), ${args.FUNC});`);
        }

        // 函数
        defineFunc(args) {
            this._addCodeLine(`${args.TYPE} ${args.NAME}() {`);
            this.indentLevel++;
            this.currentFunction = args.NAME;
            this.functionParams[args.NAME] = [];
        }

        addParam(args) {
            if (this.currentFunction && this.currentFunction !== "main") {
                this.functionParams[this.currentFunction].push({
                    type: args.TYPE,
                    name: args.NAME
                });
                
                // 更新函数签名
                const params = this.functionParams[this.currentFunction]
                    .map(p => `${p.type} ${p.name}`)
                    .join(', ');
                
                // 找到函数定义行并更新
                const lines = this.globalCode.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes(`${this.currentFunction}()`)) {
                        lines[i] = lines[i].replace(
                            `${this.currentFunction}()`,
                            `${this.currentFunction}(${params})`
                        );
                        break;
                    }
                }
                this.globalCode = lines.join('\n');
            }
        }

        returnValue(args) {
            this._addCodeLine(`return ${args.VALUE};`);
        }

        callFunc(args) {
            this._addCodeLine(`${args.NAME}();`);
        }

        // 获取当前生成的代码（核心改进）
        getCurrentGeneratedCode() {
            // 如果从未生成过代码，返回初始提示
            if (this.currentGeneratedCode === "" && this.initialCode) {
                return this.initialCode;
            }
            // 否则返回已生成的代码（保持不变，不会被自动替换）
            return this.currentGeneratedCode;
        }

        // 生成代码并存储（仅在主动调用时更新）
        generateCode() {
            // 添加随机数种子初始化
            if (this.usedFeatures.ctime && this.generatedCode.indexOf("srand(time(0));") === -1) {
                this._addCodeAtStart("srand(time(0));");
            }

            // 拼接头文件
            let includesCode = "";
            this.includes.forEach(include => {
                includesCode += `#include ${include}\n`;
            });

            // 拼接命名空间和代码
            const usingCode = "using namespace std;\n\n";
            const fullCode = `${includesCode}\n${usingCode}${this.globalCode}\n${this.generatedCode}`;

            // 仅在生成成功时更新存储的代码，防止空代码覆盖
            if (fullCode.trim() !== "") {
                this.currentGeneratedCode = fullCode;
                // 一旦生成过代码，就不再显示初始提示
                this.initialCode = null;
            }
        }

        // 新增：手动清空代码（需要用户主动操作）
        clearGeneratedCode() {
            this.currentGeneratedCode = "";
            this.initialCode = "请先生成代码";  // 重置初始提示
        }

        _addCodeLine(line) {
            const indent = "    ".repeat(this.indentLevel);
            if (this.currentFunction) {
                this.generatedCode += indent + line + "\n";
            } else {
                this.globalCode += indent + line + "\n";
            }
        }

        _addCodeAtStart(line) {
            const lines = this.generatedCode.split('\n');
            const mainIndex = lines.findIndex(l => l.includes("int main()"));
            if (mainIndex !== -1) {
                lines.splice(mainIndex, 0, line);
                this.generatedCode = lines.join('\n');
            }
        }
    }

    extensions.register(new DreamCppGenerator());
}(Scratch));
    