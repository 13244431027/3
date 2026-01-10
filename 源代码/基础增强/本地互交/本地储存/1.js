(function(Scratch) {
  'use strict';

  class SavingExtension {
    constructor() {
      this.hidden = false;
    }

    getInfo() {
      return {
        id: 'saving',
        name: '数据存储',
        color1: '#2D89EF',
        color2: '#1E5AA8',
        blocks: [
          {
            opcode: 'createData',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建数据 [NAME] 值为 [VALUE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '示例' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '你好世界！' }
            }
          },
          {
            opcode: 'saveData',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存数据 [NAME] 为 [VALUE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '示例' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '更新后的值' }
            }
          },
          {
            opcode: 'loadData',
            blockType: Scratch.BlockType.REPORTER,
            text: '读取数据 [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '示例' }
            }
          },
          {
            opcode: 'deleteData',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除数据 [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '示例' }
            }
          },
          {
            opcode: 'dataExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '数据 [NAME] 存在吗？',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '示例' }
            }
          },
          {
            opcode: 'showAllData',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示所有数据'
          },
          {
            opcode: 'hideAllData',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏所有数据'
          },
          {
            opcode: 'listKeys',
            blockType: Scratch.BlockType.REPORTER,
            text: '列出所有数据键名'
          },
          {
            opcode: 'clearAllData',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除所有保存的数据'
          },
          "---",
          {
            opcode: 'encryptData',
            blockType: Scratch.BlockType.REPORTER,
            text: '用密钥 [KEY] 加密 [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '秘密消息' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: '密码123' }
            }
          },
          {
            opcode: 'decryptData',
            blockType: Scratch.BlockType.REPORTER,
            text: '用密钥 [KEY] 解密 [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '加密文本' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: '密码123' }
            }
          }
        ]
      };
    }

    createData(args) {
      if (!localStorage.getItem(args.NAME)) {
        localStorage.setItem(args.NAME, args.VALUE);
        console.log(`[数据存储] 创建数据 '${args.NAME}' = '${args.VALUE}'`);
      } else {
        console.warn(`[数据存储] 数据 '${args.NAME}' 已存在。`);
      }
    }

    saveData(args) {
      localStorage.setItem(args.NAME, args.VALUE);
      console.log(`[数据存储] 保存 '${args.NAME}' = '${args.VALUE}'`);
    }

    loadData(args) {
      const val = localStorage.getItem(args.NAME);
      if (val === null) return '';
      return val;
    }

    deleteData(args) {
      localStorage.removeItem(args.NAME);
      console.log(`[数据存储] 删除 '${args.NAME}'`);
    }

    dataExists(args) {
      return localStorage.getItem(args.NAME) !== null;
    }

    showAllData() {
      console.table(localStorage);
      alert('所有数据已显示在控制台中（按F12查看）。');
    }

    hideAllData() {
      console.clear();
      console.log('[数据存储] 数据已从控制台隐藏。');
    }

    listKeys() {
      return Object.keys(localStorage).join(', ');
    }

    clearAllData() {
      localStorage.clear();
      console.warn('[数据存储] 所有保存的数据已清除！');
    }

    // 🔐 加密（简单XOR + Base64）
    xorEncrypt(str, key) {
      const textToChars = (text) => text.split('').map(c => c.charCodeAt(0));
      const byteArray = textToChars(str).map((c, i) => c ^ textToChars(key)[i % key.length]);
      return btoa(String.fromCharCode(...byteArray));
    }

    xorDecrypt(encoded, key) {
      try {
        const data = atob(encoded);
        const textToChars = (text) => text.split('').map(c => c.charCodeAt(0));
        const bytes = textToChars(data).map((c, i) => c ^ textToChars(key)[i % key.length]);
        return String.fromCharCode(...bytes);
      } catch (e) {
        return '[无效或损坏的数据]';
      }
    }

    encryptData(args) {
      return this.xorEncrypt(args.TEXT, args.KEY);
    }

    decryptData(args) {
      return this.xorDecrypt(args.TEXT, args.KEY);
    }
  }

  Scratch.extensions.register(new SavingExtension());
})(Scratch);