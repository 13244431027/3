(function (Scratch) {
  "use strict";

  var code = "";

  class kukemcEval {
    getInfo() {
      return {
        id: "kukemcEval",
        name: "JavaScript",
        blocks: [
          {
            opcode: "blockruncode",
            blockType: Scratch.BlockType.COMMAND,
            text: "执行JS [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "var a = 111;",
              },
            },
          },
          {
            opcode: "runcode",
            blockType: Scratch.BlockType.REPORTER,
            text: "执行JS [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a;",
              },
            },
          },
          {
            opcode: "clear",
            blockType: Scratch.BlockType.COMMAND,
            text: "清空JS上下文",
          },
          {
            opcode: "getcode",
            blockType: Scratch.BlockType.REPORTER,
            text: "JS上下文",
          },
          {
            opcode: "assignVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: "将变量 [VAR] 赋值为 [VALUE]",
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "变量名",
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "值",
              },
            },
          },
          {
            opcode: "conditional",
            blockType: Scratch.BlockType.COMMAND,
            text: "如果 [CONDITION] 则执行 [CODE]",
            arguments: {
              CONDITION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "条件",
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "要执行的代码",
              },
            },
          },
          {
            opcode: "loop",
            blockType: Scratch.BlockType.COMMAND,
            text: "循环 [TIMES] 次执行 [CODE]",
            arguments: {
              TIMES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "次数",
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "要执行的代码",
              },
            },
          },
          {
            opcode: "defineFunction",
            blockType: Scratch.BlockType.COMMAND,
            text: "定义函数 [NAME] 参数 [PARAMETERS] [CODE]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "函数名",
              },
              PARAMETERS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "参数",
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "函数体",
              },
            },
          },
          {
            opcode: "callFunction",
            blockType: Scratch.BlockType.REPORTER,
            text: "调用函数 [NAME] 参数 [ARGUMENTS]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "函数名",
              },
              ARGUMENTS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "参数",
              },
            },
          },
        ],
      };
    }

    isVariableDeclarationOrAssignment(codeLine) {
      const pattern = /^\s*(let|const|var)?\s*\w+\s*=\s*.+/;
      return pattern.test(codeLine);
    }

    runcode(args) {
      if (this.isVariableDeclarationOrAssignment(args.CODE)) {
        code += args.CODE + "\n";
      } else {
        try {
          return eval(code + args.CODE);
        } catch (error) {
          return error;
        }
      }
    }

    blockruncode(args) {
      return this.runcode(args);
    }

    clear() {
      code = "";
    }

    getcode() {
      return code;
    }

    assignVariable(args) {
      const varName = args.VAR;
      const varValue = args.VALUE;
      code += `var ${varName} = ${varValue};\n`;
    }

    conditional(args) {
      const condition = args.CONDITION;
      const codeBlock = args.CODE;
      code = code + `if (${condition}) {\n${codeBlock}\n}\n`
      eval(code);
    }

    loop(args) {
      const times = args.TIMES;
      const codeBlock = args.CODE;
      code += `for (let i = 0; i < ${times}; i++) {\n${codeBlock}\n}\n`;
      eval(code);
    }

    defineFunction(args) {
      const functionName = args.NAME;
      const parameters = args.PARAMETERS;
      const codeBlock = args.CODE;
      code += `function ${functionName}(${parameters}) {\n${codeBlock}\n}\n`;
    }

    callFunction(args) {
      const functionName = args.NAME;
      const fnArguments = args.ARGUMENTS;
      return eval(code + `${functionName}(${fnArguments})`);
    }
  }

  Scratch.extensions.register(new kukemcEval());
})(Scratch);