/* uploadOrInputTextDark.js —— 深色文本助手
   功能：上传/输入文本 + 自绘文件选择 + 手动输入可自定义标题/字符限制
   2025 清爽版（完整源码，直接可用） */

(function (Scratch, global) {
  const iconURI =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiBzdHJva2U9IiM2MDYwNjAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik03IDhoMTBNNyAxMmg0IiBzdHJva2U9IiM2MDYwNjAiIHN0cm9rZS13aWR0aD0iMS40IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=';

  /* ===== 通用 DOM 工具 ===== */
  const createEl = (tag, props = {}, ...children) => {
    const el = document.createElement(tag);
    Object.assign(el, props);
    children.forEach(c =>
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
    );
    return el;
  };
  const removeEl = (el) => el && el.remove();

  /* ===== 自绘文件选择器（拖放 / 粘贴 / 手动选）===== */
  function showFilePicker(onDone) {
    const overlay = createEl('div', {
      style: `position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;animation:fadeIn .25s ease;`
    });
    const dialog = createEl('div', {
      style: `background:rgba(40,40,40,.85);backdrop-filter:saturate(180%) blur(20px);border:1px solid rgba(255,255,255,.12);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.5);width:min(420px,90vw);padding:24px;display:flex;flex-direction:column;gap:16px;animation:zoomIn .25s ease;`
    });
    const title = createEl('div', {
      style: `font-size:16px;font-weight:600;color:#f5f5f5;text-align:center;`
    }, '拖入或粘贴文本文件');
    const dropArea = createEl('div', {
      style: `flex:1;border:2px dashed rgba(255,255,255,.3);border-radius:8px;padding:40px 20px;text-align:center;color:#c0c0c0;font-size:14px;transition:border-color .2s;white-space:pre-line;`
    }, '将文件拖至此处\n或按 Ctrl+V 粘贴文件内容');
    const footer = createEl('div', {
      style: `display:flex;justify-content:flex-end;gap:12px;`
    });
    const cancelBtn = createEl('button', {
      style: `padding:6px 18px;border:none;border-radius:6px;background:rgba(255,255,255,.1);color:#fff;font-size:14px;cursor:pointer;`,
      onclick: close
    }, '取消');

    footer.appendChild(cancelBtn);
    dialog.append(title, dropArea, footer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const hiddenInput = createEl('input', {
      type: 'file',
      accept: '.txt,.md,.json,.csv,.xml,.html,.htm,.js',
      style: 'display:none'
    });
    hiddenInput.onchange = (e) => handleFiles(e.target.files);
    document.body.appendChild(hiddenInput);

    const style = createEl('style', {}, `
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes fadeOut{from{opacity:1}to{opacity:0}}
      @keyframes zoomIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes zoomOut{from{transform:scale(1);opacity:1}to{transform:scale(.9);opacity:0}}
    `);
    document.head.appendChild(style);

    function close() {
      dialog.style.animation = 'zoomOut .2s ease forwards';
      overlay.style.animation = 'fadeOut .2s ease forwards';
      setTimeout(() => {
        removeEl(overlay);
        removeEl(style);
        removeEl(hiddenInput);
      }, 200);
    }

    function handleFiles(files) {
      if (!files || !files[0]) return;
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        onDone(ev.target.result);
        close();
      };
      reader.readAsText(file);
    }

    dropArea.ondragover = (e) => {
      e.preventDefault();
      dropArea.style.borderColor = '#0a84ff';
    };
    dropArea.ondragleave = () => dropArea.style.borderColor = 'rgba(255,255,255,.3)';
    dropArea.ondrop = (e) => {
      e.preventDefault();
      dropArea.style.borderColor = 'rgba(255,255,255,.3)';
      handleFiles(e.dataTransfer.files);
    };

    overlay.onpaste = (e) => {
      const files = e.clipboardData.files;
      if (files && files.length) {
        handleFiles(files);
        return;
      }
      const text = e.clipboardData.getData('text');
      if (text) {
        onDone(text);
        close();
      }
    };

    dropArea.onclick = () => hiddenInput.click();
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

    const esc = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', esc);
      }
    };
    document.addEventListener('keydown', esc);
  }

  /* ===== 可定制标题 & 字符限制的手动输入框 ===== */
  function showBeautifyInput(title = '请输入文本', defaultValue = '', maxLen = 0) {
    return new Promise((resolve) => {
      const overlay = createEl('div', {
        style: `position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;animation:fadeIn .25s ease;`
      });
      const dialog = createEl('div', {
        style: `background:rgba(40,40,40,.85);backdrop-filter:saturate(180%) blur(20px);border:1px solid rgba(255,255,255,.12);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.5);width:min(420px,90vw);max-height:70vh;display:flex;flex-direction:column;overflow:hidden;animation:zoomIn .25s ease;`
      });
      const header = createEl('div', {
        style: `padding:14px 20px;font-size:16px;font-weight:600;color:#f5f5f5;border-bottom:1px solid rgba(255,255,255,.08);`
      }, title);
      const textarea = createEl('textarea', {
        value: defaultValue,
        placeholder: '支持多行粘贴…',
        style: `flex:1;border:none;background:transparent;padding:14px 20px;color:#e0e0e0;font-size:15px;resize:none;outline:none;min-height:120px;`
      });
      const footer = createEl('div', {
        style: `padding:12px 20px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;`
      });
      const countTip = createEl('span', {
        style: `font-size:12px;color:#aaa;`
      }, '');
      const btnWrap = createEl('div', { style: `display:flex;gap:12px;` });
      const okBtn = createEl('button', {
        style: `padding:6px 18px;border:none;border-radius:6px;background:#0a84ff;color:#fff;font-size:14px;cursor:pointer;`,
        onclick: () => {
          resolve(textarea.value);
          close();
        }
      }, '确认');
      const cancelBtn = createEl('button', {
        style: `padding:6px 18px;border:none;border-radius:6px;background:rgba(255,255,255,.1);color:#fff;font-size:14px;cursor:pointer;`,
        onclick: () => {
          resolve(null);
          close();
        }
      }, '取消');

      btnWrap.append(cancelBtn, okBtn);
      footer.append(countTip, btnWrap);
      dialog.append(header, textarea, footer);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const style = createEl('style', {}, `
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        @keyframes zoomIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes zoomOut{from{transform:scale(1);opacity:1}to{transform:scale(.9);opacity:0}}
      `);
      document.head.appendChild(style);

      function updateCount() {
        const len = textarea.value.length;
        if (maxLen > 0) {
          countTip.textContent = `${len} / ${maxLen}`;
          countTip.style.color = len > maxLen ? '#ff2f2f' : '#aaa';
          okBtn.disabled = len > maxLen;
          okBtn.style.opacity = len > maxLen ? '0.5' : '1';
        } else {
          countTip.textContent = `字符：${len}`;
        }
      }
      textarea.addEventListener('input', updateCount);
      updateCount();
      setTimeout(() => textarea.focus(), 100);

      function close() {
        dialog.style.animation = 'zoomOut .2s ease forwards';
        overlay.style.animation = 'fadeOut .2s ease forwards';
        setTimeout(() => {
          removeEl(overlay);
          removeEl(style);
        }, 200);
      }

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          resolve(null);
          close();
        }
      });
      const esc = (e) => {
        if (e.key === 'Escape') {
          resolve(null);
          close();
          document.removeEventListener('keydown', esc);
        }
      };
      document.addEventListener('keydown', esc);
    });
  }

  /* ===== 扩展主体 ===== */
  class TextHelperDark {
    constructor() {
      this._text = '';
      this._maxLen = 0; // 0 表示无限制
    }

    getInfo() {
      return {
        id: 'textHelperDark',
        name: '文本助手',
        menuIconURI: iconURI,
        blockIconURI: iconURI,
        color1: '#2c2c2c',
        color2: '#1e1e1e',
        color3: '#505050',
        blocks: [
          { opcode: 'uploadText', blockType: Scratch.BlockType.COMMAND, text: '上传文本文件' },
          {
            opcode: 'inputText',
            blockType: Scratch.BlockType.COMMAND,
            text: '手动输入文本 标题：[title]',
            arguments: {
              title: { type: Scratch.ArgumentType.STRING, defaultValue: '请输入文本' }
            }
          },
          {
            opcode: 'setCharLimit',
            blockType: Scratch.BlockType.COMMAND,
            text: '限制输入字符 [max]',
            arguments: {
              max: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'removeCharLimit',
            blockType: Scratch.BlockType.COMMAND,
            text: '取消字符限制'
          },
          { opcode: 'getText', blockType: Scratch.BlockType.REPORTER, text: '获取文本' },
          { opcode: 'hasText', blockType: Scratch.BlockType.BOOLEAN, text: '已获取文本？' },
          { opcode: 'charCount', blockType: Scratch.BlockType.REPORTER, text: '字符数' }
        ]
      };
    }

    uploadText() {
      showFilePicker((content) => this._finish(content));
    }

    async inputText(args) {
      const title = args.title || '请输入文本';
      const value = await showBeautifyInput(title, '', this._maxLen);
      if (value !== null) this._finish(value);
    }

    setCharLimit(args) {
      const max = Number(args.max);
      this._maxLen = max > 0 ? max : 0;
    }

    removeCharLimit() {
      this._maxLen = 0;
    }

    getText() { return this._text; }
    hasText() { return this._text !== ''; }
    charCount() { return this._text.length; }

    _finish(val) {
      this._text = val;
      Scratch.vm.runtime.startHats('event_whenbroadcastreceived', {
        BROADCAST_OPTION: '文本助手_已获取'
      });
    }
  }

  Scratch.extensions.register(new TextHelperDark());
})(Scratch, window);