(function () {
  'use strict';

  class TurboGPTUIBlocks {
    constructor(runtime) {
      this.runtime = runtime;

      this.buttons = new Map();       // id -> element
      this.clickFlag = false;         // 是否发生过一次点击事件
      this.lastClickedId = '';        // 最近一次点击的按钮ID
    }

    getInfo() {
      return {
        id: 'turbogptui', // 仅小写字母数字，避免 Invalid extension id
        name: 'TurboGPT UI',
        color1: '#ff4c4c',
        color2: '#ff3333',
        blocks: [
          {
            opcode: 'injectButton',
            blockType: Scratch.BlockType.COMMAND,
            text: '注入按钮id为 [ID] 提示文字为 [TEXT]',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myBtn' },
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Click Me' }
            }
          },
          {
            opcode: 'whenButtonClicked',
            blockType: Scratch.BlockType.HAT,
            text: '当按钮Id为 [ID] 被点击',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'myBtn' }
            },
            isEdgeActivated: true
          }
        ]
      };
    }

    injectButton(args) {
      const ID = String(args.ID);
      const TEXT = String(args.TEXT);

      if (this.buttons.has(ID)) return;

      // 找一个工具栏锚点（你也可以换成你项目里稳定的选择器）
      const anchor =
        document.querySelector('[class*="menu-bar_feedback-link"]') ||
        document.querySelector('[class*="menu-bar_menu-bar-item"]');

      if (!anchor || !anchor.parentNode) {
        console.error('TurboGPT UI: 找不到工具栏锚点，无法注入按钮');
        return;
      }

      const btn = document.createElement('button');
      btn.id = ID;
      btn.className = anchor.className;
      btn.textContent = TEXT;

      const s = getComputedStyle(anchor);
      btn.style.cssText = `
        width:${s.width};height:${s.height};
        background:#fff;color:#ff4c4c;border:none;
        margin-left:10px;border-radius:5px;cursor:pointer;
      `;

      btn.addEventListener('click', () => {
        this.lastClickedId = ID;
        this.clickFlag = true;

        // 唤醒所有该hat的线程；具体匹配在hat里做
        this.runtime.startHats('turbogptui_whenButtonClicked');
      });

      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
      this.buttons.set(ID, btn);
    }

    // Hat：每次被 runtime.startHats 唤醒或轮询时会检查，返回true则启动脚本
    whenButtonClicked(args) {
      const wantId = String(args.ID);

      if (this.clickFlag && this.lastClickedId === wantId) {
        // 消费这次点击（避免同一次点击触发多次）
        this.clickFlag = false;
        this.lastClickedId = '';
        return true;
      }
      return false;
    }
  }

  Scratch.extensions.register(new TurboGPTUIBlocks());
})();
