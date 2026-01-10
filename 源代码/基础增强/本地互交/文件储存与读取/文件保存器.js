(function(Scratch) {
  'use strict';

  class FileSaver {
    constructor() {
      this.loadedText = '';
      this.loadedJSON = {};
      this.loadedArray = [];
      this.loadedCSV = '';
      this.loadedBinary = '';
      this.localStorageKey = 'filesaver_localstorage';
    }

    getInfo() {
      return {
        id: 'files',
        name: '文件保存器',
        color1: '#4C97FF',
        blocks: [
          // --- 文本文件 ---
          {
            opcode: 'saveFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存文本 [TEXT] 为文件 [FILENAME]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '你好世界' },
              FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello.txt' }
            }
          },
          {
            opcode: 'loadFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载文本文件'
          },
          {
            opcode: 'getLoadedText',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的文件文本'
          },

          '---',

          // --- JSON 文件 ---
          {
            opcode: 'saveJSON',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存 JSON [TEXT] 为文件 [FILENAME]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '{"name":"小明"}' },
              FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'data.json' }
            }
          },
          {
            opcode: 'loadJSONFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载 JSON 文件'
          },
          {
            opcode: 'getLoadedJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的 JSON 文本'
          },
          {
            opcode: 'getKeyFromJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载 JSON 中键 [KEY] 的值',
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
            }
          },

          '---',

          // --- 数组保存为 JSON ---
          {
            opcode: 'saveArray',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存数组 [TEXT] 为 JSON 文件 [FILENAME]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' },
              FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'array.json' }
            }
          },
          {
            opcode: 'loadArrayFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载 JSON 数组文件'
          },
          {
            opcode: 'getLoadedArray',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的数组文本'
          },
          {
            opcode: 'getArrayValue',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载数组中索引 [INDEX] 的值',
            arguments: {
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },

          '---',

          // --- CSV 文件 ---
          {
            opcode: 'saveCSV',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存 CSV [TEXT] 为文件 [FILENAME]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a,b,c\n1,2,3' },
              FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'data.csv' }
            }
          },
          {
            opcode: 'loadCSVFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载 CSV 文件'
          },
          {
            opcode: 'getLoadedCSV',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的 CSV 文本'
          },

          '---',

          // --- 二进制文件 (base64) ---
          {
            opcode: 'saveBinary',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存 base64 二进制 [TEXT] 为文件 [FILENAME]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'SGVsbG8=' },
              FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'file.bin' }
            }
          },
          {
            opcode: 'loadBinaryFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '加载二进制文件 (base64)'
          },
          {
            opcode: 'getLoadedBinary',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的二进制 base64'
          },

          '---',

          // --- 本地存储 ---
          {
            opcode: 'saveToLocalStorage',
            blockType: Scratch.BlockType.COMMAND,
            text: '保存文本 [TEXT] 到本地存储键 [KEY]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '你好世界' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mydata' }
            }
          },
          {
            opcode: 'loadFromLocalStorage',
            blockType: Scratch.BlockType.COMMAND,
            text: '从本地存储键 [KEY] 加载文本',
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mydata' }
            }
          },
          {
            opcode: 'getLoadedLocalStorage',
            blockType: Scratch.BlockType.REPORTER,
            text: '已加载的本地存储文本'
          },

          '---',

          // --- 信息标签 ---
          {
            opcode: 'info',
            blockType: Scratch.BlockType.LABEL,
            text: '(注意：必须解除沙盒限制)'
          }
        ]
      };
    }

    // 文本文件方法
    saveFile(args) {
      const blob = new Blob([args.TEXT], { type: 'text/plain' });
      this.downloadBlob(blob, args.FILENAME);
    }
    loadFile() {
      this.loadFileWithCallback('.txt', (text) => {
        this.loadedText = text;
      });
    }
    getLoadedText() {
      return this.loadedText;
    }

    // JSON 文件方法
    saveJSON(args) {
      try {
        const json = JSON.stringify(JSON.parse(args.TEXT), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadBlob(blob, args.FILENAME);
      } catch {
        alert("无效的 JSON");
      }
    }
    loadJSONFile() {
      this.loadFileWithCallback('.json', (text) => {
        try {
          this.loadedJSON = JSON.parse(text);
        } catch {
          alert("解析 JSON 失败");
          this.loadedJSON = {};
        }
      });
    }
    getLoadedJSON() {
      return JSON.stringify(this.loadedJSON);
    }
    getKeyFromJSON(args) {
      return this.loadedJSON?.[args.KEY] ?? '';
    }

    // 数组 JSON 方法
    saveArray(args) {
      try {
        const arr = JSON.parse(args.TEXT);
        if (!Array.isArray(arr)) throw new Error();
        const blob = new Blob([JSON.stringify(arr, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, args.FILENAME);
      } catch {
        alert("无效的 JSON 数组");
      }
    }
    loadArrayFile() {
      this.loadFileWithCallback('.json', (text) => {
        try {
          const arr = JSON.parse(text);
          if (Array.isArray(arr)) {
            this.loadedArray = arr;
          } else {
            alert("JSON 不是数组");
            this.loadedArray = [];
          }
        } catch {
          alert("解析 JSON 失败");
          this.loadedArray = [];
        }
      });
    }
    getLoadedArray() {
      return JSON.stringify(this.loadedArray);
    }
    getArrayValue(args) {
      const i = Math.floor(args.INDEX);
      return this.loadedArray[i] ?? '';
    }

    // CSV 方法
    saveCSV(args) {
      const blob = new Blob([args.TEXT], { type: 'text/csv' });
      this.downloadBlob(blob, args.FILENAME);
    }
    loadCSVFile() {
      this.loadFileWithCallback('.csv', (text) => {
        this.loadedCSV = text;
      });
    }
    getLoadedCSV() {
      return this.loadedCSV;
    }

    // 二进制方法 (base64)
    saveBinary(args) {
      try {
        const binaryString = atob(args.TEXT);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/octet-stream' });
        this.downloadBlob(blob, args.FILENAME);
      } catch {
        alert("无效的 base64 字符串");
      }
    }
    loadBinaryFile() {
      this.loadFileWithCallback('', (text) => {
        // 从二进制字符串转换为 base64
        const binary = text;
        let base64 = '';
        for (let i = 0; i < binary.length; i++) {
          base64 += btoa(binary.charAt(i));
        }
        this.loadedBinary = btoa(binary);
      }, true);
    }
    getLoadedBinary() {
      return this.loadedBinary;
    }

    // 本地存储方法
    saveToLocalStorage(args) {
      try {
        localStorage.setItem(args.KEY, args.TEXT);
      } catch {
        alert("本地存储保存失败");
      }
    }
    loadFromLocalStorage(args) {
      try {
        this.loadedText = localStorage.getItem(args.KEY) || '';
      } catch {
        alert("本地存储加载失败");
        this.loadedText = '';
      }
    }
    getLoadedLocalStorage() {
      return this.loadedText;
    }

    // 辅助方法
    downloadBlob(blob, filename) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    loadFileWithCallback(accept, callback, isBinary = false) {
      const input = document.createElement('input');
      input.type = 'file';
      if (accept) input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (isBinary) {
            callback(event.target.result);
          } else {
            callback(event.target.result);
          }
        };
        if (isBinary) reader.readAsBinaryString(file);
        else reader.readAsText(file);
      };
      input.click();
    }

    info() {
      // 标签块无操作
    }
  }

  Scratch.extensions.register(new FileSaver());
})(Scratch);