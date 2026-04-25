(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('设置面板DOM增强扩展需要在非沙盒模式下运行');
  }

  const LIBS = {
    MARKED: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    DOMPURIFY: 'https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js',
    KATEX_CSS: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    KATEX_JS: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    KATEX_AUTO_RENDER: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
    MERMAID: 'https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js'
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve();
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`${src} 加载失败`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`${src} 加载失败`));
      document.head.appendChild(script);
    });
  }

  function loadStyle(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  let dependenciesPromise = null;
  function preloadDependencies() {
    if (dependenciesPromise) return dependenciesPromise;

    loadStyle(LIBS.KATEX_CSS);

    dependenciesPromise = Promise.all([
      loadScript(LIBS.MARKED),
      loadScript(LIBS.DOMPURIFY),
      loadScript(LIBS.KATEX_JS).then(() => loadScript(LIBS.KATEX_AUTO_RENDER)),
      loadScript(LIBS.MERMAID)
    ]).then(() => {
      if (!window.marked) throw new Error('marked 未加载成功');
      if (!window.katex || !window.renderMathInElement) throw new Error('KaTeX 未加载成功');
      if (!window.mermaid) throw new Error('mermaid 未加载成功');
      window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    }).catch(err => {
      console.error('DOM增强扩展依赖加载异常:', err);
      throw err;
    });

    return dependenciesPromise;
  }

  preloadDependencies();

  class SettingsPanelDOMExtension {
    constructor() {
      this.markdownRegistry = {};
      this.lastClickedElement = {
        panelId: '',
        markdownId: '',
        type: '',
        index: 0
      };
      this._globalCssText = '';
    }

    getInfo() {
      return {
        id: 'settingspaneldom',
        name: '设置面板DOM增强',
        color1: '#FF8C1A',
        color2: '#DB6E00',
        blocks: [
          {
            opcode: 'addLabel',
            blockType: Scratch.BlockType.COMMAND,
            text: '向核心面板 [NAME] 添加标签 [TEXT]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '这是一个标签' }
            }
          },
          {
            opcode: 'addDivider',
            blockType: Scratch.BlockType.COMMAND,
            text: '向核心面板 [NAME] 添加分隔线',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' }
            }
          },
          {
            opcode: 'addTextarea',
            blockType: Scratch.BlockType.COMMAND,
            text: '向核心面板 [NAME] 添加多行文本 [PROP] 默认值 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'text' },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: '第一行\n第二行' }
            }
          },
          {
            opcode: 'addImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '向核心面板 [NAME] 添加图片 [PROP] 链接 [URL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'img' },
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://i.ibb.co/JjDTph2S/mmexport7a31d9e7940333a3d94aa840a9fe1131-1768702802176.gif' }
            }
          },
          {
            opcode: 'addMarkdown',
            blockType: Scratch.BlockType.COMMAND,
            text: '向核心面板 [NAME] 添加Markdown [PROP] 内容 [TEXT]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '### 公式\n$$E=mc^2$$\n支持Markdown' }
            }
          },
          {
            opcode: 'setMarkdownElementStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置 Markdown [MD] 中 [SELECTOR] 样式 CSS: [CSS]',
            arguments: {
              MD: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              SELECTOR: { type: Scratch.ArgumentType.STRING, defaultValue: 'p' },
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: 'color:red;font-size:20px;' }
            }
          },
          {
            opcode: 'setMarkdownElementOffset',
            blockType: Scratch.BlockType.COMMAND,
            text: '将 Markdown [MD] 的 [SELECTOR] 元素水平偏移X设为 [X] 和垂直偏移Y设为 [Y]',
            arguments: {
              MD: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              SELECTOR: { type: Scratch.ArgumentType.STRING, defaultValue: 'p' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setMarkdownElementRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: '将 Markdown [MD] 的 [SELECTOR] 元素旋转X设为 [RX] Y设为 [RY] Z设为 [RZ]',
            arguments: {
              MD: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              SELECTOR: { type: Scratch.ArgumentType.STRING, defaultValue: 'p' },
              RX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setMarkdownTransition',
            blockType: Scratch.BlockType.COMMAND,
            text: '为 Markdown [MD] 设置过渡为 [SECONDS] 秒的 [EASING]',
            arguments: {
              MD: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              EASING: { type: Scratch.ArgumentType.STRING, menu: 'transitionEasings', defaultValue: 'linear' }
            }
          },
          {
            opcode: 'setMarkdownMediaSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Markdown [MD] 的第 [INDEX] 个 [MEDIA] 的宽 [WIDTH] 高 [HEIGHT]',
            arguments: {
              MD: { type: Scratch.ArgumentType.STRING, defaultValue: 'md' },
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              MEDIA: { type: Scratch.ArgumentType.STRING, menu: 'markdownMediaTypes', defaultValue: 'image' },
              WIDTH: { type: Scratch.ArgumentType.STRING, defaultValue: '200px' },
              HEIGHT: { type: Scratch.ArgumentType.STRING, defaultValue: '120px' }
            }
          },
          {
            opcode: 'getLastClickedElementInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取上次点击元素的 [FIELD]',
            arguments: {
              FIELD: { type: Scratch.ArgumentType.STRING, menu: 'clickedElementFields', defaultValue: 'panelId' }
            }
          },
          '---',
          {
            opcode: 'setGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置DOM增强全局CSS为 [CSS]',
            arguments: {
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: '.sp-dom-md p{color:#4C97FF;}' }
            }
          },
          {
            opcode: 'appendGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '追加DOM增强全局CSS [CSS]',
            arguments: {
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: '.sp-dom-md img{border-radius:8px;}' }
            }
          },
          {
            opcode: 'clearGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除DOM增强全局CSS'
          }
        ],
        menus: {
          transitionEasings: {
            acceptReporters: true,
            items: [
              { text: '线性', value: 'linear' },
              { text: '加速', value: 'ease-in' },
              { text: '减速', value: 'ease-out' }
            ]
          },
          markdownMediaTypes: {
            acceptReporters: true,
            items: [
              { text: '图片', value: 'image' },
              { text: '思维导图', value: 'mindmap' }
            ]
          },
          clickedElementFields: {
            acceptReporters: true,
            items: [
              { text: '面板ID', value: 'panelId' },
              { text: '类型', value: 'type' },
              { text: '序号', value: 'index' }
            ]
          }
        }
      };
    }

    async _ensureLibs() {
      await preloadDependencies();
    }

    _bridge() {
      return window.SettingsPanelBridge || null;
    }

    _ensureBridge() {
      const bridge = this._bridge();
      if (!bridge) {
        throw new Error('请先加载 设置面板核心 扩展');
      }
      return bridge;
    }

    _safeNamePart(text) {
      return String(text).replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    _markdownClassName(panel, prop) {
      return `sp-dom-md-${this._safeNamePart(panel)}-${this._safeNamePart(prop)}`;
    }

    _markdownStyleId(panel, prop) {
      return `sp-dom-style-md-${this._safeNamePart(panel)}-${this._safeNamePart(prop)}`;
    }

    _getOrCreateStyleTag(id) {
      let style = document.getElementById(id);
      if (!style) {
        style = document.createElement('style');
        style.id = id;
        document.head.appendChild(style);
      }
      return style;
    }

    _setStyleTagContent(id, cssText) {
      const style = this._getOrCreateStyleTag(id);
      style.textContent = String(cssText || '');
      return style;
    }

    _appendStyleTagContent(id, cssText) {
      const style = this._getOrCreateStyleTag(id);
      style.textContent = (style.textContent || '') + '\n' + String(cssText || '');
      return style;
    }

    _safeMarkedParse(text) {
      const raw = window.marked.parse(String(text));

      if (window.DOMPurify) {
        return window.DOMPurify.sanitize(raw, {
          USE_PROFILES: { html: true },
          FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'meta'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
        });
      }

      const template = document.createElement('template');
      template.innerHTML = raw;

      const forbiddenTags = ['script', 'iframe', 'object', 'embed', 'link', 'style', 'meta'];
      forbiddenTags.forEach(tag => {
        template.content.querySelectorAll(tag).forEach(node => node.remove());
      });

      const all = template.content.querySelectorAll('*');
      all.forEach(node => {
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          const name = attr.name.toLowerCase();
          const value = String(attr.value || '');
          if (name.startsWith('on')) {
            node.removeAttribute(attr.name);
            return;
          }
          if ((name === 'href' || name === 'src' || name === 'srcset') && /^\s*javascript:/i.test(value)) {
            node.removeAttribute(attr.name);
          }
        });
      });

      return template.innerHTML;
    }

    _registerMarkdown(name, prop, el, renderFn) {
      this.markdownRegistry[String(prop)] = {
        panel: String(name),
        prop: String(prop),
        domElement: el,
        render: renderFn
      };
    }

    _unregisterMarkdown(name, prop) {
      prop = String(prop);
      if (this.markdownRegistry[prop] && this.markdownRegistry[prop].panel === String(name)) {
        delete this.markdownRegistry[prop];
      }
    }

    _getMarkdownEntry(id) {
      id = String(id);
      return this.markdownRegistry[id] || null;
    }

    _getMarkdownRoot(id) {
      const entry = this._getMarkdownEntry(id);
      return entry ? entry.domElement : null;
    }

    _setMarkdownScopedCss(panelName, prop, selector, cssText) {
      const baseSelector = `.${this._markdownClassName(panelName, prop)}`;
      const finalSelector = selector ? `${baseSelector} ${selector}` : baseSelector;
      this._appendStyleTagContent(this._markdownStyleId(panelName, prop), `${finalSelector}{${String(cssText || '')}}`);
    }

    _ensureMarkdownTransformDataset(el) {
      if (!el) return;
      if (el.dataset.spTranslateX === undefined) el.dataset.spTranslateX = '0';
      if (el.dataset.spTranslateY === undefined) el.dataset.spTranslateY = '0';
      if (el.dataset.spRotateX === undefined) el.dataset.spRotateX = '0';
      if (el.dataset.spRotateY === undefined) el.dataset.spRotateY = '0';
      if (el.dataset.spRotateZ === undefined) el.dataset.spRotateZ = '0';
    }

    _applyMarkdownTransform(el) {
      if (!el) return;
      this._ensureMarkdownTransformDataset(el);
      const tx = Number(el.dataset.spTranslateX || 0);
      const ty = Number(el.dataset.spTranslateY || 0);
      const rx = Number(el.dataset.spRotateX || 0);
      const ry = Number(el.dataset.spRotateY || 0);
      const rz = Number(el.dataset.spRotateZ || 0);
      el.style.transformStyle = 'preserve-3d';
      el.style.transform = `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    }

    _bindMarkdownClickTracking(name, prop, root) {
      if (!root || root.dataset.spClickBound === 'true') return;
      root.dataset.spClickBound = 'true';

      root.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        let matched = null;
        let type = '';

        matched = target.closest('img');
        if (matched && root.contains(matched)) {
          type = '图片';
          const imgs = Array.from(root.querySelectorAll('img'));
          this.lastClickedElement = {
            panelId: name,
            markdownId: prop,
            type,
            index: Math.max(0, imgs.indexOf(matched)) + 1
          };
          return;
        }

        matched = target.closest('.mermaid');
        if (matched && root.contains(matched)) {
          type = '思维导图';
          const maps = Array.from(root.querySelectorAll('.mermaid'));
          this.lastClickedElement = {
            panelId: name,
            markdownId: prop,
            type,
            index: Math.max(0, maps.indexOf(matched)) + 1
          };
          return;
        }

        matched = target.closest('p');
        if (matched && root.contains(matched)) {
          type = '段落';
          const ps = Array.from(root.querySelectorAll('p'));
          this.lastClickedElement = {
            panelId: name,
            markdownId: prop,
            type,
            index: Math.max(0, ps.indexOf(matched)) + 1
          };
          return;
        }

        matched = target.closest('h1,h2,h3,h4,h5,h6');
        if (matched && root.contains(matched)) {
          type = '标题';
          const hs = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6'));
          this.lastClickedElement = {
            panelId: name,
            markdownId: prop,
            type,
            index: Math.max(0, hs.indexOf(matched)) + 1
          };
          return;
        }

        matched = target.closest('li');
        if (matched && root.contains(matched)) {
          type = '列表项';
          const lis = Array.from(root.querySelectorAll('li'));
          this.lastClickedElement = {
            panelId: name,
            markdownId: prop,
            type,
            index: Math.max(0, lis.indexOf(matched)) + 1
          };
          return;
        }

        this.lastClickedElement = {
          panelId: name,
          markdownId: prop,
          type: (target.tagName || '').toLowerCase(),
          index: 1
        };
      });
    }

    async addLabel(args) {
      const bridge = this._ensureBridge();
      const name = String(args.NAME);
      if (!bridge.hasPanel(name)) return;

      const el = document.createElement('div');
      el.textContent = String(args.TEXT);
      el.style.padding = '4px 6px';
      el.style.color = 'var(--title-text-color, #eee)';
      el.style.fontSize = '13px';
      el.style.fontWeight = 'bold';

      bridge.injectElement(name, '', el, { storeAsController: false, type: 'label' });
      bridge.scheduleClamp(name);
    }

    async addDivider(args) {
      const bridge = this._ensureBridge();
      const name = String(args.NAME);
      if (!bridge.hasPanel(name)) return;

      const el = document.createElement('div');
      el.style.height = '1px';
      el.style.backgroundColor = 'var(--border-color, #444)';
      el.style.margin = '4px 6px';

      bridge.injectElement(name, '', el, { storeAsController: false, type: 'divider' });
      bridge.scheduleClamp(name);
    }

    async addTextarea(args) {
      const bridge = this._ensureBridge();
      const name = String(args.NAME);
      const prop = String(args.PROP);
      const defaultValue = String(args.VAL);

      if (!bridge.hasPanel(name)) return;
      if (!bridge.ensureProperty(name, prop, defaultValue, { kind: 'textarea', title: prop })) return;

      const row = document.createElement('div');
      row.className = 'controller';
      row.style.display = 'flex';
      row.style.alignItems = 'flex-start';
      row.style.gap = '8px';
      row.style.padding = '4px 6px';
      row.style.boxSizing = 'border-box';

      const label = document.createElement('div');
      label.className = 'name';
      label.textContent = prop;
      label.style.minWidth = '40%';
      label.style.color = 'var(--title-text-color, #eee)';
      label.style.fontSize = '13px';
      label.style.wordBreak = 'break-all';

      const widget = document.createElement('div');
      widget.className = 'widget';
      widget.style.flex = '1';

      const textarea = document.createElement('textarea');
      textarea.value = defaultValue;
      textarea.style.width = '100%';
      textarea.style.boxSizing = 'border-box';
      textarea.style.resize = 'vertical';
      textarea.style.minHeight = '80px';
      textarea.style.marginTop = '4px';

      textarea.addEventListener('input', () => {
        bridge.setPropertyValue(name, prop, textarea.value, false);
        bridge.emitPropertyChanged(name, prop);
      });

      widget.appendChild(textarea);
      row.appendChild(label);
      row.appendChild(widget);

      bridge.injectElement(name, prop, row, { storeAsController: false, type: 'textarea' });

      const wrapped = {
        type: 'custom',
        domElement: row,
        destroy: () => row.remove(),
        updateDisplay: () => {
          textarea.value = String(bridge.getPropertyValue(name, prop) || '');
          return wrapped;
        },
        setValue: (value) => {
          bridge.setPropertyValue(name, prop, String(value), false);
          textarea.value = String(value);
        },
        getValue: () => bridge.getPropertyValue(name, prop),
        name: (title) => {
          label.textContent = String(title);
          return wrapped;
        }
      };

      bridge.registerController(name, prop, wrapped);
      bridge.scheduleClamp(name);
    }

    async addImage(args) {
      const bridge = this._ensureBridge();
      const name = String(args.NAME);
      const prop = String(args.PROP);
      const url = String(args.URL);

      if (!bridge.hasPanel(name)) return;
      if (!bridge.ensureProperty(name, prop, url, { kind: 'image', title: prop })) return;

      const container = document.createElement('div');
      container.className = 'sp-dom-image-container';
      container.style.padding = '4px';
      container.style.textAlign = 'center';

      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '150px';
      img.style.borderRadius = '4px';
      img.style.objectFit = 'contain';

      container.appendChild(img);

      bridge.injectElement(name, prop, container, { storeAsController: false, type: 'image' });

      const wrapped = {
        type: 'custom',
        domElement: container,
        destroy: () => container.remove(),
        updateDisplay: () => {
          img.src = String(bridge.getPropertyValue(name, prop) || '');
          return wrapped;
        },
        setValue: (value) => {
          bridge.setPropertyValue(name, prop, String(value), false);
          img.src = String(value);
        },
        getValue: () => bridge.getPropertyValue(name, prop)
      };

      bridge.registerController(name, prop, wrapped);
      bridge.scheduleClamp(name);
    }

    async addMarkdown(args) {
      await this._ensureLibs();
      const bridge = this._ensureBridge();

      const name = String(args.NAME);
      const prop = String(args.PROP);
      const text = String(args.TEXT);

      if (!bridge.hasPanel(name)) return;
      if (!bridge.ensureProperty(name, prop, text, { kind: 'markdown', title: prop })) return;

      const el = document.createElement('div');
      el.style.padding = '6px';
      el.style.color = '#ccc';
      el.style.fontSize = '12px';
      el.style.lineHeight = '1.5';
      el.className = 'sp-dom-md-container';
      el.dataset.markdownId = prop;
      el.dataset.panelId = name;
      el.style.transformStyle = 'preserve-3d';
      el.classList.add(this._markdownClassName(name, prop));

      const renderContent = () => {
        el.innerHTML = this._safeMarkedParse(bridge.getPropertyValue(name, prop) || '');

        const mermaidBlocks = el.querySelectorAll('pre code.language-mermaid');
        mermaidBlocks.forEach((codeBlock) => {
          const mermaidDiv = document.createElement('div');
          mermaidDiv.className = 'mermaid';
          mermaidDiv.textContent = codeBlock.textContent || '';
          const preElement = codeBlock.parentNode;
          if (preElement && preElement.parentNode) {
            preElement.parentNode.replaceChild(mermaidDiv, preElement);
          }
        });

        if (window.renderMathInElement) {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
          });
        }

        if (window.mermaid && el.querySelectorAll('.mermaid').length > 0) {
          try {
            const nodes = el.querySelectorAll('.mermaid');
            nodes.forEach(node => node.removeAttribute('data-processed'));
            window.mermaid.init(undefined, nodes);
          } catch (e) {
            console.error('Mermaid 渲染失败:', e);
          }
        }

        this._bindMarkdownClickTracking(name, prop, el);
      };

      renderContent();

      if (!document.getElementById('sp-dom-md-base-style')) {
        const style = document.createElement('style');
        style.id = 'sp-dom-md-base-style';
        style.textContent = `
          .sp-dom-md-container a { color: #4C97FF; }
          .sp-dom-md-container p { margin-block-start: 0.5em; margin-block-end: 0.5em; transform-style: preserve-3d; }
          .sp-dom-md-container ul, .sp-dom-md-container ol { padding-inline-start: 20px; }
          .sp-dom-md-container img { max-width: 100%; border-radius: 4px; transform-style: preserve-3d; }
          .sp-dom-md-container code { background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
          .sp-dom-md-container pre code { background: none; padding: 0; }
          .sp-dom-md-container .mermaid,
          .sp-dom-md-container .mermaid svg { max-width: 100%; height: auto; transform-style: preserve-3d; }
        `;
        document.head.appendChild(style);
      }

      bridge.injectElement(name, prop, el, { storeAsController: false, type: 'markdown' });

      const wrapped = {
        type: 'custom',
        domElement: el,
        destroy: () => el.remove(),
        updateDisplay: () => {
          renderContent();
          return wrapped;
        },
        setValue: (value) => {
          bridge.setPropertyValue(name, prop, String(value), false);
          renderContent();
        },
        getValue: () => bridge.getPropertyValue(name, prop)
      };

      bridge.registerController(name, prop, wrapped);
      this._registerMarkdown(name, prop, el, renderContent);
      bridge.scheduleClamp(name);
    }

    setMarkdownContent(args) {
      const bridge = this._ensureBridge();
      const md = String(args.MD);
      const text = String(args.TEXT);
      const entry = this._getMarkdownEntry(md);
      if (!entry) return;

      bridge.setPropertyValue(entry.panel, entry.prop, text, false);
      if (entry.render) entry.render();
      bridge.emitPropertyChanged(entry.panel, entry.prop);
      bridge.scheduleClamp(entry.panel);
    }

    appendMarkdownContent(args) {
      const bridge = this._ensureBridge();
      const md = String(args.MD);
      const text = String(args.TEXT);
      const entry = this._getMarkdownEntry(md);
      if (!entry) return;

      const oldText = String(bridge.getPropertyValue(entry.panel, entry.prop) || '');
      bridge.setPropertyValue(entry.panel, entry.prop, oldText + text, false);
      if (entry.render) entry.render();
      bridge.emitPropertyChanged(entry.panel, entry.prop);
      bridge.scheduleClamp(entry.panel);
    }

    setMarkdownElementStyle(args) {
      const md = String(args.MD);
      const selector = String(args.SELECTOR || 'p');
      const css = String(args.CSS || '');
      const entry = this._getMarkdownEntry(md);
      if (!entry) return;

      this._setMarkdownScopedCss(entry.panel, entry.prop, selector, css);
    }

    setMarkdownElementOffset(args) {
      const md = String(args.MD);
      const selector = String(args.SELECTOR || 'p');
      const x = Number(args.X) || 0;
      const y = Number(args.Y) || 0;

      const root = this._getMarkdownRoot(md);
      if (!root) return;

      const nodes = root.querySelectorAll(selector);
      nodes.forEach(node => {
        this._ensureMarkdownTransformDataset(node);
        node.dataset.spTranslateX = String(x);
        node.dataset.spTranslateY = String(y);
        this._applyMarkdownTransform(node);
      });
    }

    setMarkdownElementRotation(args) {
      const md = String(args.MD);
      const selector = String(args.SELECTOR || 'p');
      const rx = Number(args.RX) || 0;
      const ry = Number(args.RY) || 0;
      const rz = Number(args.RZ) || 0;

      const root = this._getMarkdownRoot(md);
      if (!root) return;

      const nodes = root.querySelectorAll(selector);
      nodes.forEach(node => {
        this._ensureMarkdownTransformDataset(node);
        node.dataset.spRotateX = String(rx);
        node.dataset.spRotateY = String(ry);
        node.dataset.spRotateZ = String(rz);
        this._applyMarkdownTransform(node);
      });
    }

    setMarkdownTransition(args) {
      const md = String(args.MD);
      const seconds = Math.max(0, Number(args.SECONDS) || 0);
      const easing = String(args.EASING || 'linear');

      const root = this._getMarkdownRoot(md);
      if (!root) return;

      root.style.transition = `all ${seconds}s ${easing}`;
      root.querySelectorAll('*').forEach(node => {
        node.style.transition = `all ${seconds}s ${easing}`;
      });
    }

    setMarkdownMediaSize(args) {
      const md = String(args.MD);
      const index = Math.max(1, Math.floor(Number(args.INDEX) || 1));
      const media = String(args.MEDIA);
      const width = String(args.WIDTH);
      const height = String(args.HEIGHT);

      const root = this._getMarkdownRoot(md);
      if (!root) return;

      if (media === 'image') {
        const imgs = root.querySelectorAll('img');
        const target = imgs[index - 1];
        if (!target) return;
        target.style.width = width;
        target.style.height = height;
        target.style.maxWidth = 'none';
        target.style.objectFit = 'contain';
        return;
      }

      if (media === 'mindmap') {
        const maps = root.querySelectorAll('.mermaid');
        const target = maps[index - 1];
        if (!target) return;

        target.style.width = width;
        target.style.height = height;
        target.style.maxWidth = 'none';

        const svg = target.querySelector('svg');
        if (svg) {
          svg.style.width = width;
          svg.style.height = height;
          svg.style.maxWidth = 'none';
        }
      }
    }

    getLastClickedElementInfo(args) {
      const field = String(args.FIELD);
      if (field === 'panelId') return this.lastClickedElement.panelId || '';
      if (field === 'type') return this.lastClickedElement.type || '';
      if (field === 'index') return this.lastClickedElement.index || 0;
      return '';
    }

    setGlobalCSS(args) {
      const css = String(args.CSS || '');
      this._globalCssText = css;
      this._setStyleTagContent('sp-dom-style-global', css);
    }

    appendGlobalCSS(args) {
      const css = String(args.CSS || '');
      this._globalCssText = (this._globalCssText || '') + '\n' + css;
      this._setStyleTagContent('sp-dom-style-global', this._globalCssText);
    }

    clearGlobalCSS() {
      this._globalCssText = '';
      this._setStyleTagContent('sp-dom-style-global', '');
    }
  }

  Scratch.extensions.register(new SettingsPanelDOMExtension());
})(Scratch);
