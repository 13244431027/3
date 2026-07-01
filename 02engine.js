// Name: 02Engine Loader Fast
// ID: 02engine
// Description: 快速加载 02engine 扩展列表、图片和扩展代码，带可视化面板。
// By: 02Engine
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('02Engine Loader Fast 必须以 unsandboxed 模式运行');
  }

  const REPO = 'DDguan2010/02engine-extensions';
  const BRANCH = 'master';

  // 加速源优先，GitHub raw 兜底
  const BASES = [
    `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}`,
    `https://fastly.jsdelivr.net/gh/${REPO}@${BRANCH}`,
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}`,
  ];

  const CACHE_KEY = '02engine.extensions.cache.v2';
  const CACHE_TIME_KEY = '02engine.extensions.cache.time.v2';
  const CACHE_MAX_AGE = 1000 * 60 * 30; // 30 分钟

  const fetchFn = Scratch.fetch || fetch.bind(window);

  class O2EngineFast {
    constructor() {
      this.extensions = [];
      this.loaded = false;
      this.loading = false;
      this.lastError = '';
      this.lastLoaded = '';
      this.bestBase = BASES[0];

      this.panel = null;
      this.listEl = null;
      this.statusEl = null;
      this.searchEl = null;

      this.loadCache();
    }

    getInfo() {
      return {
        id: '02engine',
        name: '02Engine',
        color1: '#2684ff',
        color2: '#1264c8',
        color3: '#0b4388',
        blocks: [
          {
            opcode: 'openPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '打开 02engine 快速面板',
          },
          {
            opcode: 'closePanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '关闭 02engine 面板',
          },
          {
            opcode: 'loadExtensionList',
            blockType: Scratch.BlockType.COMMAND,
            text: '快速加载扩展列表',
          },
          {
            opcode: 'refreshExtensionList',
            blockType: Scratch.BlockType.COMMAND,
            text: '强制刷新扩展列表',
          },
          '---',
          {
            opcode: 'isLoaded',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '扩展列表已加载？',
          },
          {
            opcode: 'getExtensionCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '扩展数量',
          },
          {
            opcode: 'getExtensionListJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: '扩展列表 JSON',
          },
          '---',
          {
            opcode: 'getExtensionName',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个扩展名称',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'getExtensionSlug',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个扩展 slug',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'getExtensionDescription',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个扩展描述',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'getExtensionImageURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个扩展图片链接',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'getExtensionCodeURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个扩展代码链接',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          '---',
          {
            opcode: 'loadExtensionByIndex',
            blockType: Scratch.BlockType.COMMAND,
            text: '快速加载第 [INDEX] 个扩展',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'loadExtensionBySlug',
            blockType: Scratch.BlockType.COMMAND,
            text: '快速加载扩展 [SLUG]',
            arguments: {
              SLUG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'kylin',
              },
            },
          },
          '---',
          {
            opcode: 'getLastLoaded',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后加载的扩展',
          },
          {
            opcode: 'getLastError',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后错误',
          },
        ],
      };
    }

    timeoutPromise(promise, ms, message) {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(message || 'timeout')), ms)
        ),
      ]);
    }

    async fetchJSONFast(path, timeout = 4500) {
      let finalError = '';

      const tasks = BASES.map(async (base) => {
        const url = `${base}${path}`;
        const res = await this.timeoutPromise(
          fetchFn(url, { cache: 'no-cache' }),
          timeout,
          `加载超时：${url}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${url}`);
        }

        const json = await res.json();
        return { base, json };
      });

      try {
        const result = await Promise.any(tasks);
        this.bestBase = result.base;
        return result.json;
      } catch (e) {
        finalError = String(e);
      }

      throw new Error(finalError || '所有加速源均加载失败');
    }

    loadCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        const time = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

        if (!raw) return;

        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return;

        this.extensions = data;
        this.loaded = true;

        if (Date.now() - time > CACHE_MAX_AGE) {
          // 缓存过期也先显示，再后台刷新
          setTimeout(() => this.loadExtensionList(true), 0);
        }
      } catch (e) {
        console.warn('[02Engine] 读取缓存失败', e);
      }
    }

    saveCache() {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(this.extensions));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch (e) {
        console.warn('[02Engine] 写入缓存失败', e);
      }
    }

    async loadExtensionList(background = false) {
      if (this.loading) return;

      this.loading = true;
      this.lastError = '';

      if (!background) {
        this.setStatus('正在使用加速源加载 extensions.json...');
      }

      try {
        const json = await this.fetchJSONFast('/extensions.json');
        this.extensions = Array.isArray(json.extensions) ? json.extensions : [];
        this.loaded = true;
        this.saveCache();
        this.updatePanelList();
        this.preloadImages(8);
        this.setStatus(`已快速加载 ${this.extensions.length} 个扩展`);
      } catch (e) {
        this.lastError = String(e);
        this.setStatus(`加载失败：${this.lastError}`);
        console.error('[02Engine]', e);
      } finally {
        this.loading = false;
      }
    }

    async refreshExtensionList() {
      this.extensions = [];
      this.loaded = false;
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
      await this.loadExtensionList(false);
    }

    preloadImages(count = 8) {
      for (const ext of this.extensions.slice(0, count)) {
        if (!ext.image) continue;
        const img = new Image();
        img.src = this.getImageURLByExt(ext);
      }
    }

    isLoaded() {
      return this.loaded;
    }

    getExtensionCount() {
      return this.extensions.length;
    }

    getExtensionListJSON() {
      return JSON.stringify(this.extensions);
    }

    getExtensionName(args) {
      const ext = this.getExtByIndex(args.INDEX);
      return ext ? this.getName(ext) : '';
    }

    getExtensionSlug(args) {
      const ext = this.getExtByIndex(args.INDEX);
      return ext ? ext.slug || '' : '';
    }

    getExtensionDescription(args) {
      const ext = this.getExtByIndex(args.INDEX);
      return ext ? this.getDescription(ext) : '';
    }

    getExtensionImageURL(args) {
      const ext = this.getExtByIndex(args.INDEX);
      return ext ? this.getImageURLByExt(ext) : '';
    }

    getExtensionCodeURL(args) {
      const ext = this.getExtByIndex(args.INDEX);
      return ext ? this.getCodeURL(ext.slug) : '';
    }

    async loadExtensionByIndex(args) {
      const ext = this.getExtByIndex(args.INDEX);
      if (!ext) {
        this.lastError = '无效的扩展序号';
        return;
      }
      await this.loadExtensionObject(ext);
    }

    async loadExtensionBySlug(args) {
      const slug = String(args.SLUG || '').trim();
      if (!slug) return;

      const ext = this.extensions.find((e) => e.slug === slug);
      await this.loadExtensionObject(ext || { slug, id: slug, name: slug });
    }

    getLastLoaded() {
      return this.lastLoaded;
    }

    getLastError() {
      return this.lastError;
    }

    getExtByIndex(index) {
      const i = Math.round(Number(index)) - 1;
      if (i < 0 || i >= this.extensions.length) return null;
      return this.extensions[i];
    }

    getLang() {
      try {
        if (Scratch.translate && Scratch.translate.language) {
          return String(Scratch.translate.language).toLowerCase();
        }
        if (navigator.language) {
          return String(navigator.language).toLowerCase();
        }
      } catch (e) {
        // ignore
      }
      return 'zh-cn';
    }

    getName(ext) {
      const lang = this.getLang();
      const short = lang.split('-')[0];

      return (
        ext.nameTranslations?.[lang] ||
        ext.nameTranslations?.[short] ||
        ext.nameTranslations?.['zh-cn'] ||
        ext.nameTranslations?.en ||
        ext.name ||
        ext.id ||
        ext.slug ||
        ''
      );
    }

    getDescription(ext) {
      const lang = this.getLang();
      const short = lang.split('-')[0];

      return (
        ext.descriptionTranslations?.[lang] ||
        ext.descriptionTranslations?.[short] ||
        ext.descriptionTranslations?.['zh-cn'] ||
        ext.descriptionTranslations?.en ||
        ext.description ||
        ''
      );
    }

    encodePathPart(text) {
      return encodeURIComponent(String(text));
    }

    getImageURLByExt(ext) {
      if (!ext || !ext.image) return '';
      return `${this.bestBase}/image/${this.encodePathPart(ext.image)}`;
    }

    getCodeURL(slug, base = this.bestBase, dir = 'extensions') {
      return `${base}/${dir}/${this.encodePathPart(slug)}.js`;
    }

    async loadExtensionObject(ext) {
      if (!ext || !ext.slug) return;

      this.lastError = '';
      this.setStatus(`正在快速加载扩展：${this.getName(ext) || ext.slug}`);

      const slug = ext.slug;

      // 优先使用已经最快的源，再尝试其它源
      const orderedBases = [
        this.bestBase,
        ...BASES.filter((b) => b !== this.bestBase),
      ];

      // 仓库实际目录是 extensions；同时兼容用户写的 extension
      const dirs = ['extensions', 'extension'];

      let finalError = '';

      for (const base of orderedBases) {
        for (const dir of dirs) {
          const url = this.getCodeURL(slug, base, dir);

          try {
            await this.timeoutPromise(
              Scratch.vm.extensionManager.loadExtensionURL(url),
              12000,
              `加载扩展超时：${url}`
            );

            this.bestBase = base;
            this.lastLoaded = ext.id || ext.name || ext.slug;
            this.setStatus(`加载成功：${this.lastLoaded}`);
            return;
          } catch (e) {
            finalError = String(e);
            console.warn('[02Engine] 扩展加载失败，尝试备用源：', url, e);
          }
        }
      }

      this.lastError = finalError || '加载扩展失败';
      this.setStatus(`加载失败：${slug}`);
    }

    async openPanel() {
      this.createPanel();
      this.panel.style.display = 'flex';

      if (this.loaded) {
        this.updatePanelList();
        this.setStatus(`已从缓存显示 ${this.extensions.length} 个扩展`);
        this.loadExtensionList(true);
      } else {
        await this.loadExtensionList(false);
      }
    }

    closePanel() {
      if (this.panel) {
        this.panel.style.display = 'none';
      }
    }

    createPanel() {
      if (this.panel) return;

      const style = document.createElement('style');
      style.textContent = `
        .o2-panel {
          position: fixed;
          right: 18px;
          top: 68px;
          width: 430px;
          max-width: calc(100vw - 36px);
          height: 620px;
          max-height: calc(100vh - 90px);
          background: #fff;
          z-index: 999999;
          display: none;
          flex-direction: column;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 12px 38px rgba(0,0,0,.25);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          border: 1px solid rgba(0,0,0,.12);
        }

        .o2-header {
          height: 52px;
          background: linear-gradient(135deg,#2684ff,#1264c8);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          cursor: move;
          user-select: none;
        }

        .o2-title {
          font-weight: 700;
          font-size: 16px;
        }

        .o2-close {
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 8px;
          background: rgba(255,255,255,.2);
          color: white;
          font-size: 20px;
          cursor: pointer;
        }

        .o2-toolbar {
          padding: 10px;
          display: flex;
          gap: 8px;
          background: #f7f8fa;
          border-bottom: 1px solid #eee;
        }

        .o2-search {
          flex: 1;
          height: 34px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 0 10px;
          outline: none;
          font-size: 13px;
        }

        .o2-btn {
          border: none;
          border-radius: 8px;
          background: #2684ff;
          color: white;
          height: 34px;
          padding: 0 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .o2-btn:hover {
          background: #1264c8;
        }

        .o2-status {
          padding: 7px 12px;
          font-size: 12px;
          color: #666;
          background: #fff;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .o2-list {
          flex: 1;
          overflow: auto;
          padding: 10px;
          background: #f3f5f7;
        }

        .o2-card {
          display: flex;
          gap: 10px;
          background: white;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .o2-img {
          width: 58px;
          height: 58px;
          object-fit: cover;
          border-radius: 10px;
          background: #eee;
          flex-shrink: 0;
        }

        .o2-info {
          flex: 1;
          min-width: 0;
        }

        .o2-name {
          font-weight: 700;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
        }

        .o2-desc {
          font-size: 12px;
          color: #555;
          line-height: 1.35;
          height: 34px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .o2-meta {
          font-size: 11px;
          color: #888;
          margin-bottom: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .o2-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .o2-small {
          border: none;
          border-radius: 7px;
          padding: 5px 9px;
          font-size: 12px;
          cursor: pointer;
          background: #edf2f7;
          color: #333;
        }

        .o2-load {
          background: #2684ff;
          color: white;
        }

        .o2-load:hover {
          background: #1264c8;
        }

        .o2-small:hover {
          filter: brightness(.95);
        }
      `;
      document.head.appendChild(style);

      const panel = document.createElement('div');
      panel.className = 'o2-panel';
      panel.innerHTML = `
        <div class="o2-header">
          <div class="o2-title">02Engine 快速扩展面板</div>
          <button class="o2-close">×</button>
        </div>
        <div class="o2-toolbar">
          <input class="o2-search" placeholder="搜索名称、slug、描述">
          <button class="o2-btn o2-refresh">刷新</button>
        </div>
        <div class="o2-status">准备加载</div>
        <div class="o2-list"></div>
      `;

      document.body.appendChild(panel);

      this.panel = panel;
      this.listEl = panel.querySelector('.o2-list');
      this.statusEl = panel.querySelector('.o2-status');
      this.searchEl = panel.querySelector('.o2-search');

      panel.querySelector('.o2-close').onclick = () => this.closePanel();
      panel.querySelector('.o2-refresh').onclick = () =>
        this.refreshExtensionList();

      this.searchEl.oninput = () => this.updatePanelList();

      this.enableDrag(panel, panel.querySelector('.o2-header'));
    }

    setStatus(text) {
      if (this.statusEl) {
        this.statusEl.textContent = text;
      }
    }

    updatePanelList() {
      if (!this.listEl) return;

      const keyword = this.searchEl
        ? this.searchEl.value.trim().toLowerCase()
        : '';

      this.listEl.innerHTML = '';

      if (!this.loaded) {
        this.listEl.innerHTML =
          '<div style="padding:20px;text-align:center;color:#777;">尚未加载扩展列表</div>';
        return;
      }

      const list = this.extensions.filter((ext) => {
        if (!keyword) return true;

        const text = [
          ext.slug,
          ext.id,
          ext.name,
          ext.description,
          this.getName(ext),
          this.getDescription(ext),
        ]
          .join(' ')
          .toLowerCase();

        return text.includes(keyword);
      });

      if (!list.length) {
        this.listEl.innerHTML =
          '<div style="padding:20px;text-align:center;color:#777;">没有找到扩展</div>';
        return;
      }

      const frag = document.createDocumentFragment();

      for (const ext of list) {
        const card = document.createElement('div');
        card.className = 'o2-card';

        const img = document.createElement('img');
        img.className = 'o2-img';
        img.loading = 'lazy';
        img.src = this.getImageURLByExt(ext);
        img.onerror = () => {
          img.style.display = 'none';
        };

        const info = document.createElement('div');
        info.className = 'o2-info';

        const authors = Array.isArray(ext.by)
          ? ext.by.map((a) => a.name).join(', ')
          : '';

        info.innerHTML = `
          <div class="o2-name"></div>
          <div class="o2-desc"></div>
          <div class="o2-meta"></div>
          <div class="o2-actions"></div>
        `;

        info.querySelector('.o2-name').textContent = this.getName(ext);
        info.querySelector('.o2-desc').textContent = this.getDescription(ext);
        info.querySelector('.o2-meta').textContent = `slug: ${ext.slug || ''}${
          authors ? ' ｜ by: ' + authors : ''
        }`;

        const actions = info.querySelector('.o2-actions');

        const loadBtn = document.createElement('button');
        loadBtn.className = 'o2-small o2-load';
        loadBtn.textContent = '快速加载';
        loadBtn.onclick = async () => {
          loadBtn.disabled = true;
          loadBtn.textContent = '加载中...';
          await this.loadExtensionObject(ext);
          loadBtn.disabled = false;
          loadBtn.textContent = '快速加载';
        };

        const imgBtn = document.createElement('button');
        imgBtn.className = 'o2-small';
        imgBtn.textContent = '图片链接';
        imgBtn.onclick = () => {
          this.copyText(this.getImageURLByExt(ext));
          this.setStatus('已复制图片链接');
        };

        const codeBtn = document.createElement('button');
        codeBtn.className = 'o2-small';
        codeBtn.textContent = '代码链接';
        codeBtn.onclick = () => {
          this.copyText(this.getCodeURL(ext.slug));
          this.setStatus('已复制代码链接');
        };

        actions.appendChild(loadBtn);
        actions.appendChild(imgBtn);
        actions.appendChild(codeBtn);

        card.appendChild(img);
        card.appendChild(info);
        frag.appendChild(card);
      }

      this.listEl.appendChild(frag);
    }

    async copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
    }

    enableDrag(panel, handle) {
      let dragging = false;
      let sx = 0;
      let sy = 0;
      let sr = 0;
      let st = 0;

      handle.addEventListener('mousedown', (e) => {
        dragging = true;
        sx = e.clientX;
        sy = e.clientY;

        const rect = panel.getBoundingClientRect();
        sr = window.innerWidth - rect.right;
        st = rect.top;

        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;

        const dx = e.clientX - sx;
        const dy = e.clientY - sy;

        panel.style.right = Math.max(0, sr - dx) + 'px';
        panel.style.top = Math.max(0, st + dy) + 'px';
      });

      window.addEventListener('mouseup', () => {
        dragging = false;
      });
    }
  }

  Scratch.extensions.register(new O2EngineFast());
})(Scratch);
