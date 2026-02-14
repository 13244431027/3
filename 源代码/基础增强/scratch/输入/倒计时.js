(function(Scratch) {
  class BetterInputExtension {
    constructor() {
      this.inputs = {};
      this.timeoutId = null;
    }

    getInfo() {
      return {
        id: 'betterInput',
        name: '高级输入框',
        color1: '#6343b6',
        color2: '#d01af0',
        blocks: [
          {
            opcode: 'promptInput',
            blockType: Scratch.BlockType.REPORTER,
            text: '询问 [QUESTION] 并等待输入（超时[TIMEOUT]秒，位置[POSITION]，背景色[BGCOLOR]，文字色[TEXTCOLOR]，按钮文字[BUTTONTEXT]，按钮色[BUTTONCOLOR]）',
            arguments: {
              QUESTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你叫什么名字？'
              },
              TIMEOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
                min: 1
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionMenu'
              },
              BGCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              TEXTCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              BUTTONTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '确定'
              },
              BUTTONCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#4CAF50'
              }
            }
          },
          {
            opcode: 'numberInput',
            blockType: Scratch.BlockType.REPORTER,
            text: '询问 [QUESTION] 并等待数字输入（超时[TIMEOUT]秒，位置[POSITION]，背景色[BGCOLOR]，文字色[TEXTCOLOR]，按钮文字[BUTTONTEXT]，按钮色[BUTTONCOLOR]）',
            arguments: {
              QUESTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你多大了？'
              },
              TIMEOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
                min: 1
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionMenu'
              },
              BGCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              TEXTCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              BUTTONTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '确定'
              },
              BUTTONCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#4CAF50'
              }
            }
          },
          {
            opcode: 'passwordInput',
            blockType: Scratch.BlockType.REPORTER,
            text: '询问密码 [QUESTION]（超时[TIMEOUT]秒，位置[POSITION]，背景色[BGCOLOR]，文字色[TEXTCOLOR]，按钮文字[BUTTONTEXT]，按钮色[BUTTONCOLOR]）',
            arguments: {
              QUESTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '请输入密码：'
              },
              TIMEOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
                min: 1
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionMenu'
              },
              BGCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              TEXTCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              BUTTONTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '确定'
              },
              BUTTONCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#4CAF50'
              }
            }
          },
          {
            opcode: 'multipleChoice',
            blockType: Scratch.BlockType.REPORTER,
            text: '从 [CHOICES] 中选择（选项前缀[PREFIX_TYPE]，超时[TIMEOUT]秒，位置[POSITION]，背景色[BGCOLOR]，文字色[TEXTCOLOR]，选项色[ITEMCOLOR]，按钮文字[BUTTONTEXT]，按钮色[BUTTONCOLOR]）',
            arguments: {
              CHOICES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '选项1,选项2,选项3'
              },
              PREFIX_TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'prefixMenu'
              },
              TIMEOUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
                min: 1
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionMenu'
              },
              BGCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              TEXTCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              ITEMCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#2196F3'
              },
              BUTTONTEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '确定'
              },
              BUTTONCOLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#4CAF50'
              }
            }
          }
        ],
        menus: {
          positionMenu: {
            acceptReporters: true,
            items: [
              { text: '顶部', value: 'top' },
              { text: '中间', value: 'center' },
              { text: '底部', value: 'bottom' }
            ]
          },
          prefixMenu: {
            acceptReporters: true,
            items: [
              { text: '数字 (1,2,3...)', value: 'number' },
              { text: '字母 (a,b,c...)', value: 'letter' },
              { text: '大写字母 (A,B,C...)', value: 'upperLetter' },
              { text: '无前缀', value: 'none' }
            ]
          }
        }
      };
    }

    promptInput(args) {
      return this._handleInput(args, (question) => {
        return prompt(question);
      }, 'text');
    }

    numberInput(args) {
      return this._handleInput(args, (question) => {
        let response;
        do {
          response = prompt(question);
          if (response === null) return null;
        } while (isNaN(parseFloat(response)));
        return parseFloat(response);
      }, 'number');
    }

    passwordInput(args) {
      return this._handleInput(args, (question) => {
        return prompt(question);
      }, 'password');
    }

    multipleChoice(args) {
      return new Promise(resolve => {
        const options = this._parseOptions(args);
        const choices = args.CHOICES.split(',').map(choice => choice.trim()).filter(choice => choice !== '');
        
        if (choices.length === 0) {
          resolve('');
          return;
        }

        // 创建自定义模态框
        const modal = document.createElement('div');
        modal.style = `
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background:rgba(0,0,0,0.5);
          z-index:1000;
          display:flex;
          align-items:${options.position === 'top' ? 'flex-start' : options.position === 'bottom' ? 'flex-end' : 'center'};
          justify-content:center;
          padding:20px;
        `;
        
        const dialog = document.createElement('div');
        dialog.style = `
          background:${options.bgColor};
          padding:20px;
          border-radius:10px;
          box-shadow:0 4px 8px rgba(0,0,0,0.2);
          max-width:400px;
          width:90%;
          margin-top:${options.position === 'top' ? '20px' : options.position === 'bottom' ? '0' : 'auto'};
          margin-bottom:${options.position === 'bottom' ? '20px' : 'auto'};
        `;
        
        const message = document.createElement('p');
        message.textContent = '请选择一项：';
        message.style = `
          margin-bottom:15px;
          color:${options.textColor};
          font-weight:bold;
        `;
        
        const choicesContainer = document.createElement('div');
        choicesContainer.style = 'margin-bottom:15px;';
        
        const timerDisplay = document.createElement('div');
        timerDisplay.style = `
          color:red;
          margin-bottom:10px;
          font-weight:bold;
        `;
        
        const buttons = document.createElement('div');
        buttons.style = 'display:flex;justify-content:flex-end;gap:10px;';
        
        const okButton = document.createElement('button');
        okButton.textContent = options.buttonText || '确定';
        okButton.style = `
          padding:8px 15px;
          background:${options.buttonColor};
          color:white;
          border:none;
          border-radius:5px;
          cursor:pointer;
        `;
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style = `
          padding:8px 15px;
          background:#f44336;
          color:white;
          border:none;
          border-radius:5px;
          cursor:pointer;
        `;
        
        // 生成选项列表
        let selectedChoice = null;
        
        choices.forEach((choice, index) => {
          const choiceElement = document.createElement('div');
          choiceElement.style = `
            padding:8px;
            margin-bottom:5px;
            border-radius:4px;
            cursor:pointer;
            background:${options.bgColor};
            color:${options.itemColor || '#2196F3'};
            border:1px solid ${options.itemColor || '#2196F3'};
            transition: all 0.2s ease;
          `;
          
          let prefix = '';
          if (args.PREFIX_TYPE === 'number') {
            prefix = `${index + 1}. `;
          } else if (args.PREFIX_TYPE === 'letter') {
            prefix = `${String.fromCharCode(97 + index)}. `;
          } else if (args.PREFIX_TYPE === 'upperLetter') {
            prefix = `${String.fromCharCode(65 + index)}. `;
          }
          
          choiceElement.textContent = `${prefix}${choice}`;
          
          choiceElement.addEventListener('mouseover', () => {
            choiceElement.style.transform = 'translateX(5px)';
            choiceElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
          });
          
          choiceElement.addEventListener('mouseout', () => {
            choiceElement.style.transform = 'translateX(0)';
            choiceElement.style.boxShadow = 'none';
          });
          
          choiceElement.addEventListener('click', () => {
            // 重置所有选项样式
            choices.forEach((_, i) => {
              const el = choicesContainer.children[i];
              el.style.backgroundColor = options.bgColor;
              el.style.color = options.itemColor || '#2196F3';
              el.style.transform = 'translateX(0)';
              el.style.boxShadow = 'none';
            });
            
            // 设置当前选项样式
            choiceElement.style.backgroundColor = options.itemColor || '#2196F3';
            choiceElement.style.color = 'white';
            choiceElement.style.transform = 'translateX(5px)';
            choiceElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            
            // 保存选中的选项
            selectedChoice = choice;
          });
          
          choicesContainer.appendChild(choiceElement);
        });
        
        buttons.appendChild(okButton);
        buttons.appendChild(cancelButton);
        dialog.appendChild(timerDisplay);
        dialog.appendChild(message);
        dialog.appendChild(choicesContainer);
        dialog.appendChild(buttons);
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        let timeLeft = options.timeout;
        timerDisplay.textContent = `⏳ 剩余时间: ${timeLeft}秒`;
        
        const updateTimer = () => {
          timeLeft--;
          timerDisplay.textContent = `⏳ 剩余时间: ${timeLeft}秒`;
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            document.body.removeChild(modal);
            resolve('');
          }
        };
        
        const timer = setInterval(updateTimer, 1000);
        
        okButton.addEventListener('click', () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve(selectedChoice || '');
        });
        
        cancelButton.addEventListener('click', () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve('');
        });
      });
    }

    _parseOptions(args) {
      return {
        timeout: Math.max(1, args.TIMEOUT || 10),
        position: args.POSITION || 'center',
        bgColor: args.BGCOLOR || '#ffffff',
        textColor: args.TEXTCOLOR || '#000000',
        itemColor: args.ITEMCOLOR || '#2196F3',
        buttonText: args.BUTTONTEXT || '确定',
        buttonColor: args.BUTTONCOLOR || '#4CAF50',
        cancelButtonText: '取消',
        cancelButtonColor: '#f44336'
      };
    }

    _handleInput(args, inputCallback, inputType) {
      return new Promise(resolve => {
        const options = this._parseOptions(args);
        
        // 创建自定义模态框
        const modal = document.createElement('div');
        modal.style = `
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background:rgba(0,0,0,0.5);
          z-index:1000;
          display:flex;
          align-items:${options.position === 'top' ? 'flex-start' : options.position === 'bottom' ? 'flex-end' : 'center'};
          justify-content:center;
          padding:20px;
        `;
        
        const dialog = document.createElement('div');
        dialog.style = `
          background:${options.bgColor};
          padding:20px;
          border-radius:10px;
          box-shadow:0 4px 8px rgba(0,0,0,0.2);
          max-width:400px;
          width:90%;
          margin-top:${options.position === 'top' ? '20px' : options.position === 'bottom' ? '0' : 'auto'};
          margin-bottom:${options.position === 'bottom' ? '20px' : 'auto'};
        `;
        
        const message = document.createElement('p');
        message.textContent = args.QUESTION || '';
        message.style = `
          margin-bottom:15px;
          color:${options.textColor};
        `;
        
        const input = document.createElement('input');
        input.type = inputType === 'password' ? 'password' : inputType;
        input.style = `
          width:100%;
          padding:8px;
          margin-bottom:15px;
          box-sizing:border-box;
          border:1px solid #ccc;
          border-radius:4px;
        `;
        
        const timerDisplay = document.createElement('div');
        timerDisplay.style = `
          color:red;
          margin-bottom:10px;
          font-weight:bold;
        `;
        
        const buttons = document.createElement('div');
        buttons.style = 'display:flex;justify-content:flex-end;gap:10px;';
        
        const okButton = document.createElement('button');
        okButton.textContent = options.buttonText || '确定';
        okButton.style = `
          padding:8px 15px;
          background:${options.buttonColor};
          color:white;
          border:none;
          border-radius:5px;
          cursor:pointer;
        `;
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style = `
          padding:8px 15px;
          background:#f44336;
          color:white;
          border:none;
          border-radius:5px;
          cursor:pointer;
        `;
        
        buttons.appendChild(okButton);
        buttons.appendChild(cancelButton);
        dialog.appendChild(timerDisplay);
        dialog.appendChild(message);
        dialog.appendChild(input);
        dialog.appendChild(buttons);
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        let timeLeft = options.timeout;
        timerDisplay.textContent = `⏳ 剩余时间: ${timeLeft}秒`;
        
        const updateTimer = () => {
          timeLeft--;
          timerDisplay.textContent = `⏳ 剩余时间: ${timeLeft}秒`;
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            document.body.removeChild(modal);
            resolve('');
          }
        };
        
        const timer = setInterval(updateTimer, 1000);
        
        okButton.addEventListener('click', () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          
          if (inputType === 'number') {
            resolve(isNaN(parseFloat(input.value)) ? 0 : parseFloat(input.value));
          } else {
            resolve(input.value);
          }
        });
        
        cancelButton.addEventListener('click', () => {
          clearInterval(timer);
          document.body.removeChild(modal);
          resolve('');
        });
        
        input.focus();
      });
    }
  }

  Scratch.extensions.register(new BetterInputExtension());
})(Scratch);  