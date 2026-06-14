// ExtFind 扩展
//如果不觉得是AI的话，那就是真的
//鬼知道我调试多久
(function (Scratch) {
  'use strict';

  const API_BASE = 'https://extfindbackend.0pen.top/api';
  const BASE_URL = 'https://extfindbackend.0pen.top';

  class ExtFindUnified {
    constructor() {
      this.extensions = [];
      this.activeTab = 'store';

      this.storeSort = 'latest';
      this.storePage = 1;
      this.storePageSize = 10;
      this.storeTotal = 0;
      this.storeTotalPages = 1;
      this.storeHasRealTotal = false;
      this.storeHasNext = false;

      this.loaderData = null;
      this.pendingLoaderId = '';
      this.currentLoaderId = '';

      this.mdReady = false;
      this.codeRenderJobId = 0;

      this.injectStyles();
      this.initMarkdown();
      this.createUI();
    }

    injectStyles() {
      if (document.getElementById('extfind-unified-styles')) return;

      const style = document.createElement('style');
      style.id = 'extfind-unified-styles';
      style.textContent = `
        .extfind-panel{
          position:fixed;
          inset:10px;
          z-index:2147483647;
          display:none;
          background:rgba(13,17,23,.98);
          color:#e6edf3;
          border-radius:16px;
          border:1px solid rgba(255,255,255,.1);
          box-shadow:0 8px 32px rgba(0,0,0,.45);
          backdrop-filter:blur(4px);
          font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          overflow:hidden;
        }

        .extfind-header{
          height:56px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:0 16px;
          border-bottom:1px solid #30363d;
          background:#161b22;
          box-sizing:border-box;
        }

        .extfind-title{
          font-size:18px;
          font-weight:800;
          white-space:nowrap;
        }

        .extfind-tabs{
          display:flex;
          gap:8px;
        }

        .extfind-tab{
          border:1px solid #30363d;
          background:#21262d;
          color:#c9d1d9;
          padding:6px 13px;
          border-radius:999px;
          cursor:pointer;
          font-weight:700;
          font-family:inherit;
          font-size:14px;
        }

        .extfind-tab.active{
          background:#238636;
          color:white;
          border-color:#2ea043;
        }

        .extfind-close{
          border:0;
          background:#da3633;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          cursor:pointer;
          font-size:16px;
          flex-shrink:0;
        }

        .extfind-content{
          height:calc(100% - 56px);
          overflow:auto;
          padding:18px;
          box-sizing:border-box;
        }

        .extfind-card{
          background:rgba(22,27,34,.8);
          border:1px solid #30363d;
          border-radius:12px;
          padding:14px;
          cursor:pointer;
          transition:.2s;
        }

        .extfind-card:hover{
          border-color:#58a6ff;
          background:rgba(33,38,45,.9);
        }

        .extfind-button{
          background:#21262d;
          color:#c9d1d9;
          border:1px solid #30363d;
          padding:7px 12px;
          border-radius:8px;
          cursor:pointer;
          font-weight:700;
          font-size:13px;
          font-family:inherit;
          line-height:1.2;
        }

        .extfind-button:hover{
          background:#30363d;
        }

        .extfind-button:disabled{
          opacity:.45;
          cursor:not-allowed;
        }

        .extfind-button.primary{
          background:#238636;
          border-color:#2ea043;
          color:white;
        }

        .extfind-input,
        .extfind-select{
          box-sizing:border-box;
          background:#0d1117;
          color:#e6edf3;
          border:1px solid #30363d;
          border-radius:8px;
          padding:7px 9px;
          font:inherit;
          font-size:13px;
          outline:none;
        }

        .extfind-input:focus,
        .extfind-select:focus{
          border-color:#58a6ff;
          box-shadow:0 0 0 2px rgba(88,166,255,.18);
        }

        .extfind-toolbar{
          max-width:900px;
          margin:0 auto 12px auto;
          padding:10px;
          background:#161b22;
          border:1px solid #30363d;
          border-radius:12px;
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          justify-content:center;
          gap:7px;
        }

        .extfind-toolbar label,
        .extfind-toolbar span{
          color:#8b949e;
          font-size:12px;
        }

        .extfind-sort-select{width:105px;}
        .extfind-size-select{width:64px;}
        .extfind-page-input{width:56px;text-align:center;}

        .extfind-loader-box{
          max-width:720px;
          margin:0 auto;
          background:#161b22;
          border:1px solid #30363d;
          border-radius:16px;
          padding:18px;
        }

        .extfind-status{
          margin-top:12px;
          color:#8b949e;
          font-size:13px;
          min-height:20px;
        }

        .extfind-loader-card{
          margin-top:16px;
          border:1px solid #30363d;
          border-radius:12px;
          padding:14px;
          background:#0d1117;
          display:none;
        }

        .extfind-badge{
          display:inline-block;
          padding:2px 6px;
          border-radius:999px;
          font-size:11px;
          font-weight:700;
          background:rgba(63,185,80,.15);
          color:#3fb950;
          border:1px solid rgba(63,185,80,.35);
          margin-left:6px;
        }

        .extfind-file-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:8px;
          padding:8px 10px;
          border:1px solid #30363d;
          border-radius:8px;
          background:#0d1117;
          margin-top:8px;
        }

        .extfind-file-name{
          color:#e6edf3;
          font-size:13px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }

        .extfind-file-meta{
          color:#8b949e;
          font-size:11px;
          margin-left:6px;
        }

        .extfind-code-overlay{
          position:absolute;
          left:0;
          right:0;
          top:56px;
          bottom:0;
          z-index:30;
          background:rgba(13,17,23,.99);
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }

        .extfind-code-header{
          flex-shrink:0;
          padding:10px 14px;
          border-bottom:1px solid #30363d;
          background:#161b22;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }

        .extfind-code-title{
          font-weight:800;
          color:#e6edf3;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size:14px;
        }

        .extfind-code-actions{
          display:flex;
          gap:7px;
          flex-shrink:0;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        .extfind-code-body{
          flex:1;
          overflow:auto;
          background:#0d1117;
          padding:14px;
        }

        .extfind-code-body pre{
          margin:0;
          background:#0d1117!important;
          color:#e6edf3;
          font-size:12px;
          line-height:1.5;
          font-family:"SF Mono","Monaco","Inconsolata","Fira Code",monospace;
          white-space:pre;
        }

        .extfind-code-body code{
          background:transparent!important;
          color:#e6edf3;
        }

        .extfind-code-progress{
          padding:8px 10px;
          margin-bottom:10px;
          border:1px solid #30363d;
          border-radius:8px;
          background:#161b22;
          color:#8b949e;
          font-size:12px;
          line-height:1.4;
        }

        .extfind-code-large-tip{
          color:#f0b7b5;
          border-color:rgba(248,81,73,.35);
          background:rgba(248,81,73,.08);
        }

        .extfind-code-perf{
          padding:8px 10px;
          margin-bottom:10px;
          border:1px solid #30363d;
          border-radius:8px;
          background:#161b22;
          color:#8b949e;
          font-size:12px;
          line-height:1.5;
        }

        .extfind-code-perf strong{
          color:#e6edf3;
        }

        .extfind-code-perf.good{
          border-color:rgba(63,185,80,.35);
          background:rgba(63,185,80,.08);
        }

        .extfind-code-perf.warn{
          border-color:rgba(210,153,34,.4);
          background:rgba(210,153,34,.08);
        }

        .extfind-code-perf.danger{
          border-color:rgba(248,81,73,.4);
          background:rgba(248,81,73,.08);
          color:#f0b7b5;
        }

        .markdown-body{
          color-scheme:dark!important;
          background:transparent!important;
          color:#e6edf3!important;
        }

        .markdown-body table{
          background-color:#0d1117!important;
          border-collapse:collapse!important;
          width:100%!important;
          border:1px solid #30363d!important;
        }

        .markdown-body th,
        .markdown-body td{
          background-color:#0d1117!important;
          border:1px solid #30363d!important;
          color:#e6edf3!important;
          padding:8px 12px!important;
        }

        .markdown-body th{
          background-color:#161b22!important;
        }

        .markdown-body pre{
          background-color:#0d1117!important;
          border:1px solid #30363d!important;
          border-radius:8px!important;
          padding:12px!important;
          overflow-x:auto!important;
        }

        .markdown-body pre code{
          background-color:transparent!important;
          color:#e6edf3!important;
          font-size:13px!important;
          white-space:pre!important;
        }

        .markdown-body code:not(pre code){
          background-color:rgba(110,118,129,.4)!important;
          color:#f0883e!important;
          padding:.2em .4em!important;
          border-radius:4px!important;
        }

        .markdown-body .hljs{
          background:transparent!important;
          color:#e6edf3!important;
        }

        .markdown-body a{
          color:#58a6ff!important;
        }

        .markdown-body blockquote{
          border-left-color:#3fb950!important;
          background-color:rgba(63,185,80,.1)!important;
          color:#e6edf3!important;
        }

        @media (max-width:640px){
          .extfind-header{padding:0 10px;}
          .extfind-title{font-size:15px;}
          .extfind-tab{padding:5px 9px;font-size:12px;}
          .extfind-content{padding:12px;}
          .extfind-toolbar{justify-content:flex-start;}
          .extfind-button{font-size:12px;padding:6px 9px;}
          .extfind-code-header{align-items:flex-start;flex-direction:column;}
        }
      `;

      document.head.appendChild(style);
    }

    async initMarkdown() {
      try {
        await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css');
        await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');

        await Promise.all([
          this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js'),
          this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js'),
          this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js')
        ]);

        if (window.marked?.setOptions) {
          window.marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: false,
            mangle: false
          });
        }

        this.mdReady = true;
      } catch (error) {
        console.warn('[ExtFind] Markdown/Highlight 加载失败:', error);
        this.mdReady = false;
      }
    }

    loadCSS(href) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve();

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`CSS 加载失败: ${href}`));
        document.head.appendChild(link);
      });
    }

    loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
        document.head.appendChild(script);
      });
    }

    escapeHtml(value) {
      if (value === null || value === undefined) return '';

      return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char]));
    }

    escapeAttr(value) {
      return this.escapeHtml(value);
    }

    renderMarkdown(text) {
      if (!text) return '';

      if (!this.mdReady || !window.marked || !window.DOMPurify) {
        return `<pre style="white-space:pre-wrap;">${this.escapeHtml(text)}</pre>`;
      }

      try {
        const raw = window.marked.parse ? window.marked.parse(text) : window.marked(text);

        const clean = window.DOMPurify.sanitize(String(raw), {
          ALLOWED_TAGS: [
            'h1','h2','h3','h4','h5','h6',
            'p','br','hr','a','img',
            'strong','em','b','i','u',
            'code','pre','blockquote',
            'ul','ol','li',
            'table','thead','tbody','tr','th','td',
            'div','span','section','article'
          ],
          ALLOWED_ATTR: [
            'href','src','alt','title','class','id','target','rel'
          ]
        });

        setTimeout(() => {
          if (window.hljs) {
            document.querySelectorAll('.markdown-body pre code').forEach(block => {
              try {
                window.hljs.highlightElement(block);
              } catch {}
            });
          }
        }, 50);

        return `
          <div class="markdown-body" style="background:transparent;color:#e6edf3;font-size:14px;line-height:1.6;">
            ${clean}
          </div>
        `;
      } catch {
        return `<pre style="white-space:pre-wrap;">${this.escapeHtml(text)}</pre>`;
      }
    }

    createUI() {
      this.container = document.createElement('div');
      this.container.className = 'extfind-panel';

      this.container.innerHTML = `
        <div class="extfind-header">
          <div class="extfind-title">ExtFind</div>

          <div class="extfind-tabs">
            <button class="extfind-tab active" data-tab="store">扩展商店</button>
            <button class="extfind-tab" data-tab="loader">加载扩展</button>
          </div>

          <button class="extfind-close" title="关闭">✖</button>
        </div>

        <div class="extfind-content"></div>
      `;

      this.contentArea = this.container.querySelector('.extfind-content');

      this.container.querySelector('.extfind-close').addEventListener('click', () => {
        this.hideUI();
      });

      this.container.querySelectorAll('.extfind-tab').forEach(button => {
        button.addEventListener('click', () => {
          this.switchTab(button.dataset.tab);
        });
      });

      this.contentArea.addEventListener('click', async event => {
        const codeButton = event.target.closest('[data-extfind-view-code]');
        if (codeButton) {
          event.stopPropagation();

          await this.openCodeViewer(
            codeButton.dataset.extfindViewCode,
            codeButton.dataset.fileName || '扩展文件'
          );

          return;
        }

        const detailCard = event.target.closest('[data-extfind-detail]');
        if (detailCard) {
          await this.showDetail(detailCard.dataset.extfindDetail);
          return;
        }

        if (event.target.closest('[data-extfind-back]')) {
          await this.renderList(true);
          return;
        }

        if (event.target.closest('[data-extfind-refresh]')) {
          await this.refreshStore();
          return;
        }

        const prev = event.target.closest('[data-extfind-prev-page]');
        if (prev && !prev.disabled) {
          await this.changeStorePage(this.storePage - 1);
          return;
        }

        const next = event.target.closest('[data-extfind-next-page]');
        if (next && !next.disabled) {
          await this.changeStorePage(this.storePage + 1);
          return;
        }

        if (event.target.closest('[data-extfind-jump-page]')) {
          const input = this.contentArea.querySelector('#extfind-page-input');
          await this.changeStorePage(Number(input?.value || 1));
        }
      });

      this.contentArea.addEventListener('change', async event => {
        if (event.target?.id === 'extfind-sort-select') {
          this.storeSort = event.target.value === 'likes' ? 'likes' : 'latest';
          this.storePage = 1;
          this.extensions = [];
          await this.renderList(true);
          return;
        }

        if (event.target?.id === 'extfind-pagesize-select') {
          const size = Number(event.target.value);
          this.storePageSize = [10, 20, 50].includes(size) ? size : 10;
          this.storePage = 1;
          this.extensions = [];
          await this.renderList(true);
        }
      });

      this.contentArea.addEventListener('keydown', async event => {
        if (event.target?.id === 'extfind-page-input' && event.key === 'Enter') {
          await this.changeStorePage(Number(event.target.value || 1));
        }
      });

      document.body.appendChild(this.container);
    }

    showUI(tab = this.activeTab) {
      this.container.style.display = 'block';
      this.switchTab(tab);
    }

    hideUI() {
      this.container.style.display = 'none';
    }

    switchTab(tab) {
      this.activeTab = tab;

      this.container.querySelectorAll('.extfind-tab').forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tab);
      });

      if (tab === 'store') {
        this.renderList();
      } else {
        this.renderLoader();
      }
    }

    openLoaderWithId(extensionId) {
      this.pendingLoaderId = String(extensionId || '').trim();
      this.showUI('loader');
    }

    async renderList(forceReload = false) {
      if (forceReload || !this.extensions.length) {
        await this.loadExtensions();
      }

      const canPrev = this.storePage > 1;
      const canNext = this.storeHasRealTotal
        ? this.storePage < this.storeTotalPages
        : this.storeHasNext;

      const totalInfo = this.storeHasRealTotal
        ? `共 ${this.storeTotal} 个 · ${this.storePage}/${this.storeTotalPages} 页`
        : `第 ${this.storePage} 页 · ${this.extensions.length} 个`;

      let html = `
        <div style="text-align:center;margin-bottom:14px;">
          <h1 style="font-size:26px;margin:0 0 6px 0;">ExtFind 扩展商店</h1>
          <p style="color:#8b949e;margin:0;font-size:13px;">发现并浏览 ExtFind 上的扩展</p>
        </div>

        <div class="extfind-toolbar">
          <label>排序</label>
          <select id="extfind-sort-select" class="extfind-select extfind-sort-select">
            <option value="latest" ${this.storeSort === 'latest' ? 'selected' : ''}>最近创建</option>
            <option value="likes" ${this.storeSort === 'likes' ? 'selected' : ''}>最多点赞</option>
          </select>

          <label>每页</label>
          <select id="extfind-pagesize-select" class="extfind-select extfind-size-select">
            <option value="10" ${this.storePageSize === 10 ? 'selected' : ''}>10</option>
            <option value="20" ${this.storePageSize === 20 ? 'selected' : ''}>20</option>
            <option value="50" ${this.storePageSize === 50 ? 'selected' : ''}>50</option>
          </select>

          <button class="extfind-button" data-extfind-refresh>刷新</button>
        </div>

        <div class="extfind-toolbar">
          <button class="extfind-button" data-extfind-prev-page ${canPrev ? '' : 'disabled'}>上一页</button>

          <span>第</span>
          <input id="extfind-page-input" class="extfind-input extfind-page-input" type="number" min="1" value="${this.storePage}">
          <span>页</span>

          <button class="extfind-button" data-extfind-jump-page>跳转</button>
          <button class="extfind-button" data-extfind-next-page ${canNext ? '' : 'disabled'}>下一页</button>

          <span>${totalInfo}</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:14px;">
      `;

      if (!this.extensions.length) {
        html += `
          <div style="text-align:center;padding:36px;color:#8b949e;background:#161b22;border:1px solid #30363d;border-radius:12px;">
            当前页面没有扩展
          </div>
        `;
      }

      for (const ext of this.extensions) {
        const coverUrl = ext.coverUrl ? BASE_URL + ext.coverUrl : null;

        html += `
          <div class="extfind-card" data-extfind-detail="${this.escapeAttr(ext.extensionId)}">
            <div style="display:flex;gap:14px;">
              <div style="flex-shrink:0;width:116px;height:58px;background:#161b22;border-radius:8px;overflow:hidden;border:1px solid #30363d;">
                ${
                  coverUrl
                    ? `<img src="${this.escapeAttr(coverUrl)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:30px;color:#58a6ff;\\'>📦</div>'">`
                    : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:30px;color:#58a6ff;">📦</div>`
                }
              </div>

              <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                  <h3 style="margin:0;font-size:17px;color:#e6edf3;">${this.escapeHtml(ext.name)}</h3>

                  <div style="display:flex;gap:10px;font-size:12px;">
                    <span style="color:#f0883e;">点赞 ${ext.likeCount || 0}</span>
                    <span style="color:#8b949e;">下载 ${ext.downloadCount || 0}</span>
                  </div>
                </div>

                <div style="color:#8b949e;font-size:12px;margin:4px 0;">
                  作者 ${this.escapeHtml(ext.author?.displayName || 'Unknown')}
                </div>

                <div style="color:#e6edf3;font-size:13px;line-height:1.4;margin-top:5px;">
                  ${this.escapeHtml(ext.summary || '暂无简介')}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      html += `
        </div>

        <div class="extfind-toolbar" style="margin-top:14px;">
          <button class="extfind-button" data-extfind-prev-page ${canPrev ? '' : 'disabled'}>上一页</button>
          <span>${totalInfo}</span>
          <button class="extfind-button" data-extfind-next-page ${canNext ? '' : 'disabled'}>下一页</button>
        </div>
      `;

      this.contentArea.innerHTML = html;
    }

    async loadExtensions() {
      try {
        const url =
          `${API_BASE}/extensions?q=&sort=${encodeURIComponent(this.storeSort)}` +
          `&page=${encodeURIComponent(this.storePage)}` +
          `&pageSize=${encodeURIComponent(this.storePageSize)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        this.extensions = Array.isArray(data.items) ? data.items : [];

        const totalValue =
          data.total ??
          data.totalCount ??
          data.count ??
          data.pagination?.total ??
          data.meta?.total;

        const total = Number(totalValue);

        this.storeHasRealTotal = Number.isFinite(total) && total > 0;
        this.storeTotal = this.storeHasRealTotal ? total : 0;

        if (this.storeHasRealTotal) {
          this.storeTotalPages = Math.max(1, Math.ceil(this.storeTotal / this.storePageSize));
          this.storeHasNext = this.storePage < this.storeTotalPages;
        } else {
          this.storeTotalPages = Math.max(1, this.storePage);
          this.storeHasNext = this.extensions.length >= this.storePageSize;
        }
      } catch (error) {
        console.error('加载扩展列表失败:', error);

        this.extensions = [];
        this.storeTotal = 0;
        this.storeTotalPages = 1;
        this.storeHasRealTotal = false;
        this.storeHasNext = false;

        this.contentArea.innerHTML = `
          <div style="text-align:center;padding:40px;">
            <h2>❌ 加载失败</h2>
            <p>请检查网络连接或稍后重试</p>
          </div>
        `;
      }
    }

    async changeStorePage(page) {
      let target = Number(page);

      if (!Number.isFinite(target) || target < 1) target = 1;

      if (this.storeHasRealTotal && target > this.storeTotalPages) {
        target = this.storeTotalPages;
      }

      if (target === this.storePage && this.extensions.length) return;

      this.storePage = target;
      this.extensions = [];
      await this.renderList(true);
    }

    async refreshStore() {
      this.extensions = [];
      await this.renderList(true);
    }

    async showDetail(extensionId) {
      try {
        const response = await fetch(`${API_BASE}/extensions/${encodeURIComponent(extensionId)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const ext = await response.json();
        const coverUrl = ext.coverUrl ? BASE_URL + ext.coverUrl : null;
        const renderedDesc = this.renderMarkdown(ext.descriptionMarkdown || '暂无描述');

        let versionsHtml = '';

        if (Array.isArray(ext.versions) && ext.versions.length > 0) {
          versionsHtml = `
            <div style="margin:18px 0;padding:14px;background:rgba(22,27,34,.6);border-radius:12px;">
              <h3 style="margin:0 0 10px 0;font-size:16px;">📋 可用版本 / 代码文件</h3>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
          `;

          for (const version of ext.versions) {
            const files = Array.isArray(version.files) ? version.files : [];
            let filesHtml = '';

            if (files.length) {
              filesHtml += `
                <div style="margin-top:10px;">
                  <div style="font-size:12px;color:#8b949e;margin-bottom:6px;">文件</div>
              `;

              for (const file of files) {
                const fileName = file.displayName || file.originalName || '文件';

                filesHtml += `
                  <div class="extfind-file-row">
                    <div style="min-width:0;">
                      <span class="extfind-file-name">${this.escapeHtml(fileName)}</span>
                      ${file.isPrimary ? '<span class="extfind-badge">主文件</span>' : ''}
                      ${
                        file.originalName && file.originalName !== fileName
                          ? `<span class="extfind-file-meta">${this.escapeHtml(file.originalName)}</span>`
                          : ''
                      }
                    </div>

                    <button
                      class="extfind-button"
                      data-extfind-view-code="${this.escapeAttr(file.id)}"
                      data-file-name="${this.escapeAttr(fileName)}"
                    >
                      查看代码
                    </button>
                  </div>
                `;
              }

              filesHtml += `</div>`;
            } else {
              filesHtml = `
                <div style="margin-top:10px;color:#8b949e;font-size:12px;">
                  此版本没有可浏览的文件
                </div>
              `;
            }

            versionsHtml += `
              <div style="border:1px solid #30363d;border-radius:10px;padding:12px 14px;background:#161b22;min-width:240px;flex:1;">
                <div>
                  <strong>v${this.escapeHtml(version.version)}</strong>
                  ${version.isLatest ? '<span class="extfind-badge">最新</span>' : ''}
                </div>

                <div style="font-size:11px;color:#8b949e;margin-top:4px;">
                  日期 ${version.createdAt ? new Date(version.createdAt).toLocaleDateString() : '-'}
                </div>

                ${filesHtml}
              </div>
            `;
          }

          versionsHtml += `</div></div>`;
        }

        this.contentArea.innerHTML = `
          <div style="max-width:900px;margin:0 auto;">
            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
              <button class="extfind-button" data-extfind-back>← 返回列表</button>
              <button class="extfind-button primary" data-extfind-load-id="${this.escapeAttr(ext.extensionId)}">加载扩展</button>
            </div>

            <div style="background:#161b22;border-radius:16px;overflow:hidden;border:1px solid #30363d;margin-bottom:20px;">
              <div style="position:relative;width:100%;padding-bottom:50%;background:#0d1117;">
                ${
                  coverUrl
                    ? `<img src="${this.escapeAttr(coverUrl)}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px;color:#58a6ff;\\'>📦</div>'">`
                    : `<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px;color:#58a6ff;">📦</div>`
                }
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <h1 style="font-size:27px;margin:0 0 8px 0;">${this.escapeHtml(ext.name)}</h1>

              <div style="display:flex;gap:16px;color:#8b949e;font-size:13px;flex-wrap:wrap;">
                <span>作者 ${this.escapeHtml(ext.author?.displayName || 'Unknown')}</span>
                <span>点赞 ${ext.likeCount || 0}</span>
                <span>下载 ${ext.downloadCount || 0}</span>
                <span>更新 ${ext.publishedAt ? new Date(ext.publishedAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>

            <div style="margin:20px 0;padding:18px;background:#0d1117;border-radius:12px;border:1px solid #30363d;">
              ${renderedDesc}
            </div>

            ${versionsHtml}
          </div>
        `;

        const loadButton = this.contentArea.querySelector('[data-extfind-load-id]');
        loadButton?.addEventListener('click', () => {
          this.openLoaderWithId(ext.extensionId);
        });
      } catch (error) {
        console.error('加载扩展详情失败:', error);

        this.contentArea.innerHTML = `
          <div style="text-align:center;padding:40px;">
            <h2>❌ 加载失败</h2>
            <p>无法获取扩展详情</p>
            <button class="extfind-button" data-extfind-back>返回列表</button>
          </div>
        `;
      }
    }

    async openCodeViewer(fileId, fileName = '扩展文件') {
      if (!fileId) return;

      const old = this.container.querySelector('.extfind-code-overlay');
      if (old) old.remove();

      this.codeRenderJobId++;
      const jobId = this.codeRenderJobId;

      const rawUrl = `${API_BASE}/files/${encodeURIComponent(fileId)}/load.js`;

      const overlay = document.createElement('div');
      overlay.className = 'extfind-code-overlay';

      overlay.innerHTML = `
        <div class="extfind-code-header">
          <div class="extfind-code-title">正在加载代码：${this.escapeHtml(fileName)}</div>

          <div class="extfind-code-actions">
            <button class="extfind-button" data-extfind-open-raw>原始文件</button>
            <button class="extfind-button" data-extfind-enable-highlight disabled>开启高亮</button>
            <button class="extfind-button" data-extfind-copy-code disabled>复制代码</button>
            <button class="extfind-button" data-extfind-close-code>关闭</button>
          </div>
        </div>

        <div class="extfind-code-body">
          <div class="extfind-code-progress">准备加载...</div>
          <div class="extfind-code-perf">性能信息等待加载...</div>
          <pre><code class="language-javascript"></code></pre>
        </div>
      `;

      this.container.appendChild(overlay);

      const titleEl = overlay.querySelector('.extfind-code-title');
      const progressEl = overlay.querySelector('.extfind-code-progress');
      const perfEl = overlay.querySelector('.extfind-code-perf');
      const codeEl = overlay.querySelector('code');

      const copyButton = overlay.querySelector('[data-extfind-copy-code]');
      const closeButton = overlay.querySelector('[data-extfind-close-code]');
      const rawButton = overlay.querySelector('[data-extfind-open-raw]');
      const highlightButton = overlay.querySelector('[data-extfind-enable-highlight]');

      let sourceCode = '';
      let closed = false;
      let loadedBytes = 0;
      let highlighted = false;

      const autoHighlightLimit = 20 * 1024;

      const isCurrentJob = () => {
        return !closed && this.codeRenderJobId === jobId && overlay.isConnected;
      };

      closeButton.addEventListener('click', () => {
        closed = true;
        this.codeRenderJobId++;
        overlay.remove();
      });

      rawButton.addEventListener('click', () => {
        window.open(rawUrl, '_blank');
      });

      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(sourceCode);
          copyButton.textContent = '已复制';

          setTimeout(() => {
            if (copyButton.isConnected) copyButton.textContent = '复制代码';
          }, 1000);
        } catch {
          copyButton.textContent = '复制失败';

          setTimeout(() => {
            if (copyButton.isConnected) copyButton.textContent = '复制代码';
          }, 1000);
        }
      });

      highlightButton.addEventListener('click', async () => {
        if (!sourceCode || highlighted || !isCurrentJob()) return;

        const lineCount = this.countLinesFast(sourceCode);
        const size = sourceCode.length;
        const isLarge = size > autoHighlightLimit;

        if (isLarge) {
          const ok = confirm(
            `当前代码大小为 ${this.formatBytes(size)}，超过 20KB。\n\n` +
            `语法高亮会占用较高 CPU，并创建大量 DOM 节点，可能导致短暂卡顿。\n\n` +
            `是否仍然开启高亮？`
          );

          if (!ok) return;
        }

        highlightButton.disabled = true;
        highlightButton.textContent = '高亮中...';
        progressEl.textContent = `正在执行语法高亮，CPU 占用可能升高...`;

        await this.nextFrame();

        if (!isCurrentJob()) return;

        try {
          const start = performance.now();

          if (window.hljs) {
            window.hljs.highlightElement(codeEl);
          } else {
            throw new Error('highlight.js 未加载');
          }

          const cost = performance.now() - start;

          highlighted = true;
          highlightButton.textContent = '已高亮';

          progressEl.textContent =
            `高亮完成：耗时 ${cost.toFixed(0)}ms · ${this.formatBytes(size)} · ${lineCount} 行`;

          this.updateCodePerfInfo(perfEl, {
            codeSize: size,
            lineCount,
            highlighted: true,
            highlightCost: cost,
            autoHighlightLimit
          });
        } catch (error) {
          console.error('高亮失败:', error);

          highlightButton.disabled = false;
          highlightButton.textContent = '重新高亮';

          progressEl.classList.add('extfind-code-large-tip');
          progressEl.textContent = `高亮失败：${error.message || '未知错误'}`;
        }
      });

      try {
        const response = await fetch(rawUrl);

        if (!response.ok) {
          throw new Error(`代码加载失败：${response.status}`);
        }

        const contentLength = Number(response.headers.get('content-length') || 0);
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

        if (contentLength > autoHighlightLimit) {
          progressEl.classList.add('extfind-code-large-tip');
          progressEl.textContent =
            `文件超过 20KB，已自动关闭高亮。大小约：${this.formatBytes(contentLength)}。可手动点击“开启高亮”。`;
        } else {
          progressEl.textContent = contentLength
            ? `正在加载：0 / ${this.formatBytes(contentLength)}`
            : '正在加载...';
        }

        this.updateCodePerfInfo(perfEl, {
          codeSize: contentLength,
          lineCount: 0,
          highlighted: false,
          loading: true,
          autoHighlightLimit
        });

        if (response.body && response.body.getReader) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          let pendingText = '';
          let lastUpdateTime = 0;

          while (true) {
            if (!isCurrentJob()) {
              try {
                await reader.cancel();
              } catch {}
              return;
            }

            const { done, value } = await reader.read();

            if (done) {
              const finalText = decoder.decode();
              if (finalText) {
                sourceCode += finalText;
                pendingText += finalText;
              }
              break;
            }

            loadedBytes += value.byteLength;

            const text = decoder.decode(value, { stream: true });
            sourceCode += text;
            pendingText += text;

            const now = Date.now();

            if (pendingText.length >= 32 * 1024 || now - lastUpdateTime > 30) {
              const chunk = pendingText;
              pendingText = '';
              lastUpdateTime = now;

              await this.appendCodeChunkAsync(codeEl, chunk, isCurrentJob);

              if (!isCurrentJob()) return;

              progressEl.textContent = contentLength
                ? `正在加载：${this.formatBytes(loadedBytes)} / ${this.formatBytes(contentLength)}`
                : `正在加载：${this.formatBytes(loadedBytes)}`;
            }
          }

          if (pendingText) {
            await this.appendCodeChunkAsync(codeEl, pendingText, isCurrentJob);
          }
        } else {
          sourceCode = await response.text();
          loadedBytes = sourceCode.length;

          if (!isCurrentJob()) return;

          await this.renderCodeAsync(codeEl, sourceCode, {
            chunkSize: isMobile ? 8 * 1024 : 24 * 1024,
            isCurrentJob,
            onProgress: rendered => {
              progressEl.textContent =
                `正在渲染：${this.formatBytes(rendered)} / ${this.formatBytes(sourceCode.length)}`;
            }
          });
        }

        if (!isCurrentJob()) return;

        copyButton.disabled = false;
        highlightButton.disabled = false;

        const lineCount = this.countLinesFast(sourceCode);
        const codeSize = sourceCode.length;

        titleEl.textContent =
          `代码浏览：${fileName} · ${this.formatBytes(codeSize)} · ${lineCount} 行`;

        const canAutoHighlight =
          codeSize <= autoHighlightLimit &&
          lineCount <= 1200 &&
          window.hljs;

        if (canAutoHighlight) {
          progressEl.textContent =
            `加载完成：${this.formatBytes(codeSize)} · 未超过 20KB，正在自动高亮...`;

          highlightButton.textContent = '开启高亮';

          await this.nextFrame();

          if (isCurrentJob() && !highlighted) {
            try {
              const start = performance.now();

              window.hljs.highlightElement(codeEl);

              const cost = performance.now() - start;

              highlighted = true;
              highlightButton.disabled = true;
              highlightButton.textContent = '已高亮';

              progressEl.textContent =
                `加载完成：${this.formatBytes(codeSize)} · 已自动高亮 · 耗时 ${cost.toFixed(0)}ms`;

              this.updateCodePerfInfo(perfEl, {
                codeSize,
                lineCount,
                highlighted: true,
                highlightCost: cost,
                autoHighlightLimit
              });
            } catch {
              highlighted = false;
              highlightButton.disabled = false;
              highlightButton.textContent = '开启高亮';

              progressEl.textContent =
                `加载完成：${this.formatBytes(codeSize)} · 自动高亮失败，可手动重试`;

              this.updateCodePerfInfo(perfEl, {
                codeSize,
                lineCount,
                highlighted: false,
                autoHighlightLimit
              });
            }
          }
        } else {
          progressEl.classList.add('extfind-code-large-tip');
          progressEl.textContent =
            `加载完成：${this.formatBytes(codeSize)} · ${lineCount} 行 · 已关闭高亮，避免 CPU 占用过高`;

          highlightButton.textContent = '开启高亮';

          this.updateCodePerfInfo(perfEl, {
            codeSize,
            lineCount,
            highlighted: false,
            autoHighlightLimit
          });
        }
      } catch (error) {
        console.error('代码浏览失败:', error);

        if (!isCurrentJob()) return;

        titleEl.textContent = `代码浏览失败：${fileName}`;
        progressEl.classList.add('extfind-code-large-tip');
        progressEl.textContent = error.message || '代码加载失败';
        perfEl.className = 'extfind-code-perf danger';
        perfEl.innerHTML = `性能信息不可用`;
        codeEl.textContent = '';
        copyButton.disabled = true;
        highlightButton.disabled = true;
      }
    }

    nextFrame() {
      return new Promise(resolve => {
        requestAnimationFrame(() => resolve());
      });
    }

    nextIdle(timeout = 50) {
      return new Promise(resolve => {
        if (window.requestIdleCallback) {
          requestIdleCallback(() => resolve(), { timeout });
        } else {
          setTimeout(resolve, 0);
        }
      });
    }

    async appendCodeChunkAsync(codeEl, text, isCurrentJob) {
      if (!text || !isCurrentJob()) return;

      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const chunkSize = isMobile ? 8 * 1024 : 24 * 1024;

      for (let i = 0; i < text.length; i += chunkSize) {
        if (!isCurrentJob()) return;

        const part = text.slice(i, i + chunkSize);
        codeEl.appendChild(document.createTextNode(part));

        await this.nextIdle(30);
      }
    }

    async renderCodeAsync(codeEl, sourceCode, options = {}) {
      const chunkSize = options.chunkSize || 24 * 1024;
      const isCurrentJob = options.isCurrentJob || (() => true);
      const onProgress = options.onProgress || (() => {});

      codeEl.textContent = '';

      let rendered = 0;

      for (let i = 0; i < sourceCode.length; i += chunkSize) {
        if (!isCurrentJob()) return;

        const chunk = sourceCode.slice(i, i + chunkSize);
        codeEl.appendChild(document.createTextNode(chunk));

        rendered += chunk.length;
        onProgress(rendered);

        await this.nextIdle(30);
      }
    }

    countLinesFast(text) {
      if (!text) return 0;

      let count = 1;

      for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) === 10) count++;
      }

      return count;
    }

    formatBytes(bytes) {
      const n = Number(bytes) || 0;

      if (n < 1024) return `${n} B`;
      if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
      return `${(n / 1024 / 1024).toFixed(2)} MB`;
    }

    getDevicePerfInfo(codeSize = 0, lineCount = 0, highlighted = false, highlightCost = 0, autoHighlightLimit = 20 * 1024) {
      const cpuThreads = navigator.hardwareConcurrency || '未知';
      const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '未知';
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      let cpuLevel = '低';
      let levelClass = 'good';

      if (codeSize > autoHighlightLimit || lineCount > 1200) {
        cpuLevel = '中';
        levelClass = 'warn';
      }

      if (codeSize > 100 * 1024 || lineCount > 3000) {
        cpuLevel = '高';
        levelClass = 'danger';
      }

      if (highlighted && highlightCost > 300) {
        cpuLevel = '高';
        levelClass = 'danger';
      }

      const renderMode = highlighted
        ? 'DOM + highlight.js 语法高亮'
        : 'DOM 异步分片纯文本渲染';

      const gpuInfo =
        'CPU计算关我GPU啥事';

      const highlightPolicy =
        codeSize > autoHighlightLimit
          ? '超过 20KB，自动高亮关闭(不关就卡死e)，如果需要可手动开启'
          : '未超过 20KB，自动高亮';

      return {
        cpuThreads,
        memory,
        isMobile,
        cpuLevel,
        levelClass,
        renderMode,
        gpuInfo,
        highlightPolicy
      };
    }

    updateCodePerfInfo(perfEl, options = {}) {
      if (!perfEl) return;

      const codeSize = Number(options.codeSize || 0);
      const lineCount = Number(options.lineCount || 0);
      const highlighted = Boolean(options.highlighted);
      const highlightCost = Number(options.highlightCost || 0);
      const autoHighlightLimit = Number(options.autoHighlightLimit || 20 * 1024);
      const loading = Boolean(options.loading);

      const info = this.getDevicePerfInfo(
        codeSize,
        lineCount,
        highlighted,
        highlightCost,
        autoHighlightLimit
      );

      perfEl.className = `extfind-code-perf ${info.levelClass}`;

      perfEl.innerHTML = `
        <div><strong>性能模式：</strong>${loading ? '加载中' : info.renderMode}</div>
        <div><strong>代码大小：</strong>${codeSize ? this.formatBytes(codeSize) : '未知'}，<strong>行数：</strong>${lineCount || '计算中'}</div>
        <div><strong>CPU：</strong>${info.cpuThreads} 线程，预计占用：${info.cpuLevel}</div>
        <div><strong>内存：</strong>${info.memory}，设备：${info.isMobile ? '移动端' : '桌面端/平板'}</div>
        <div><strong>GPU：</strong>${info.gpuInfo}</div>
        <div><strong>高亮策略：</strong>${info.highlightPolicy}</div>
        ${
          highlighted
            ? `<div><strong>高亮耗时：</strong>${highlightCost.toFixed(0)}ms</div>`
            : ''
        }
      `;
    }

    renderLoader() {
      this.contentArea.innerHTML = `
        <div class="extfind-loader-box">
          <h1 style="margin:0 0 8px 0;">ExtFind 扩展加载器</h1>

          <p style="margin:0 0 16px 0;color:#8b949e;line-height:1.5;font-size:13px;">
            从商店点击“加载扩展”会自动填入 ID 并获取信息。也可以手动输入 ID 后直接点击加载。
          </p>

          <input id="extfind-loader-id" class="extfind-input" style="width:100%;" type="text" placeholder="输入扩展 ID，回车自动获取，或直接点击加载" autocomplete="off">

          <div id="extfind-loader-card" class="extfind-loader-card">
            <h3 id="extfind-loader-name" style="margin:0 0 8px 0;"></h3>
            <p id="extfind-loader-summary" style="margin:0 0 14px 0;color:#8b949e;"></p>

            <label style="display:block;margin-bottom:6px;color:#8b949e;">版本</label>
            <select id="extfind-version-select" class="extfind-select" style="width:100%;"></select>

            <label style="display:block;margin:14px 0 6px 0;color:#8b949e;">文件</label>
            <select id="extfind-file-select" class="extfind-select" style="width:100%;"></select>

            <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
              <button id="extfind-load-selected" class="extfind-button primary">加载扩展</button>
              <button id="extfind-clear-loader" class="extfind-button">清空</button>
            </div>
          </div>

          <div id="extfind-loader-status" class="extfind-status">请输入扩展 ID。</div>
        </div>
      `;

      this.loaderInput = this.contentArea.querySelector('#extfind-loader-id');
      this.loaderStatus = this.contentArea.querySelector('#extfind-loader-status');
      this.loaderCard = this.contentArea.querySelector('#extfind-loader-card');
      this.loaderName = this.contentArea.querySelector('#extfind-loader-name');
      this.loaderSummary = this.contentArea.querySelector('#extfind-loader-summary');
      this.versionSelect = this.contentArea.querySelector('#extfind-version-select');
      this.fileSelect = this.contentArea.querySelector('#extfind-file-select');

      this.contentArea.querySelector('#extfind-load-selected').addEventListener('click', () => {
        this.loadSelectedExtension().catch(error => {
          this.setLoaderStatus(error.message || '加载失败。');
        });
      });

      this.contentArea.querySelector('#extfind-clear-loader').addEventListener('click', () => {
        this.loaderInput.value = '';
        this.loaderData = null;
        this.pendingLoaderId = '';
        this.currentLoaderId = '';
        this.loaderCard.style.display = 'none';
        this.setLoaderStatus('请输入扩展 ID。');
        this.loaderInput.focus();
      });

      this.versionSelect.addEventListener('change', () => this.renderLoaderFiles());

      this.loaderInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          this.fetchLoaderInfo().catch(error => {
            this.setLoaderStatus(error.message || '获取失败。');
          });
        }
      });

      this.loaderInput.addEventListener('change', () => {
        const value = this.sanitizeId(this.loaderInput.value);
        if (!value) return;

        this.fetchLoaderInfo().catch(error => {
          this.setLoaderStatus(error.message || '获取失败。');
        });
      });

      this.loaderInput.focus();

      if (this.pendingLoaderId) {
        const id = this.pendingLoaderId;
        this.pendingLoaderId = '';
        this.loaderInput.value = id;

        setTimeout(() => {
          if (this.loaderInput && this.loaderInput.value === id) {
            this.fetchLoaderInfo().catch(error => {
              this.setLoaderStatus(error.message || '获取失败。');
            });
          }
        }, 0);
      }
    }

    setLoaderStatus(message) {
      if (this.loaderStatus) this.loaderStatus.textContent = message;
    }

    sanitizeId(value) {
      return String(value || '').trim();
    }

    pickLatest(versions) {
      return versions.find(version => version.isLatest) || versions[0];
    }

    pickPrimaryFile(version) {
      return version?.files?.find(file => file.isPrimary) || version?.files?.[0];
    }

    getLoaderVersions() {
      return Array.isArray(this.loaderData?.versions) ? this.loaderData.versions : [];
    }

    getSelectedLoaderVersion() {
      const versions = this.getLoaderVersions();
      return versions.find(version => version.id === this.versionSelect.value) || this.pickLatest(versions);
    }

    renderLoaderFiles() {
      const version = this.getSelectedLoaderVersion();
      const files = Array.isArray(version?.files) ? version.files : [];

      this.fileSelect.innerHTML = '';

      for (const file of files) {
        const option = document.createElement('option');
        option.value = file.id;
        option.textContent = `${file.displayName || file.originalName || '文件'}${file.isPrimary ? ' 主文件' : ''}`;
        this.fileSelect.appendChild(option);
      }

      const primary = this.pickPrimaryFile(version);
      if (primary) this.fileSelect.value = primary.id;
    }

    async fetchLoaderInfo() {
      const extensionId = this.sanitizeId(this.loaderInput.value);

      if (!extensionId) {
        this.setLoaderStatus('扩展 ID 不能为空。');
        this.loaderInput.focus();
        return;
      }

      this.currentLoaderId = extensionId;
      this.loaderData = null;
      this.setLoaderStatus('正在获取扩展信息...');

      const response = await fetch(`${API_BASE}/extensions/${encodeURIComponent(extensionId)}`);

      if (!response.ok) {
        throw new Error(response.status === 404 ? '扩展不存在或未发布。' : `获取失败：${response.status}`);
      }

      this.loaderData = await response.json();

      if (this.loaderData?.extensionId) {
        this.currentLoaderId = this.loaderData.extensionId;
        this.loaderInput.value = this.loaderData.extensionId;
      }

      const versions = this.getLoaderVersions();

      this.versionSelect.innerHTML = '';

      for (const version of versions) {
        const option = document.createElement('option');
        option.value = version.id;
        option.textContent = `${version.version}${version.isLatest ? ' 最新' : ''}`;
        this.versionSelect.appendChild(option);
      }

      const latest = this.pickLatest(versions);
      if (latest) this.versionSelect.value = latest.id;

      this.renderLoaderFiles();

      this.loaderName.textContent = this.loaderData.name || extensionId;
      this.loaderSummary.textContent = this.loaderData.summary || '暂无简介';
      this.loaderCard.style.display = 'block';

      this.setLoaderStatus(
        versions.length
          ? '已获取扩展信息。请选择版本和文件，然后点击加载扩展。'
          : '这个扩展没有可用版本。'
      );
    }

    async fetchExtensionSource(url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`文件下载失败：${response.status}`);
      return response.text();
    }

    toDataURL(code, sourceURL) {
      const source = `${code}\n//# sourceURL=${sourceURL}`;
      const bytes = new TextEncoder().encode(source);
      let binary = '';

      bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
      });

      return `data:application/javascript;base64,${btoa(binary)}`;
    }

    async loadUnsandboxedExtensionURL(extensionManager, dataURL) {
      const securityManager = extensionManager.securityManager;
      const originalGetSandboxMode = securityManager?.getSandboxMode;

      if (securityManager && typeof originalGetSandboxMode === 'function') {
        securityManager.getSandboxMode = url => {
          if (url === dataURL) return 'unsandboxed';
          return originalGetSandboxMode.call(securityManager, url);
        };
      }

      try {
        return await extensionManager.loadExtensionURL(dataURL);
      } finally {
        if (securityManager && typeof originalGetSandboxMode === 'function') {
          securityManager.getSandboxMode = originalGetSandboxMode;
        }
      }
    }

    async loadExtensionUrl(url, extensionId) {
      const extensionManager = Scratch.vm?.extensionManager;

      if (!Scratch.extensions.unsandboxed) {
        throw new Error('加载 ExtFind 扩展需要在 unsandboxed 模式下运行。');
      }

      if (extensionId && extensionManager?.isExtensionLoaded?.(extensionId)) {
        this.setLoaderStatus('这个扩展已经加载过了。');
        return;
      }

      const code = await this.fetchExtensionSource(url);

      if (extensionManager?.loadExtensionURL) {
        return this.loadUnsandboxedExtensionURL(
          extensionManager,
          this.toDataURL(code, url)
        );
      }

      throw new Error('无法访问 Scratch VM 扩展加载器。');
    }

    async loadSelectedExtension() {
      let inputId = this.sanitizeId(this.loaderInput.value);

      if (!inputId && this.loaderData?.extensionId) {
        inputId = this.loaderData.extensionId;
        this.loaderInput.value = inputId;
        this.currentLoaderId = inputId;
      }

      if (!inputId) {
        this.setLoaderStatus('扩展 ID 不能为空。');
        this.loaderInput.focus();
        return;
      }

      if (!this.loaderData || this.currentLoaderId !== inputId) {
        await this.fetchLoaderInfo();
      }

      if (!this.loaderData) return;

      const version = this.getSelectedLoaderVersion();
      if (!version) throw new Error('没有可加载的版本。');

      const files = Array.isArray(version.files) ? version.files : [];
      const file = files.find(item => item.id === this.fileSelect.value) || this.pickPrimaryFile(version);

      if (!file) throw new Error(`版本 ${version.version} 没有文件。`);

      this.setLoaderStatus(
        `正在加载 ${this.loaderData.name} ${version.version} / ${file.displayName || file.originalName || '文件'}...`
      );

      await this.loadExtensionUrl(
        `${API_BASE}/files/${encodeURIComponent(file.id)}/load.js`,
        this.loaderData.extensionId
      );

      this.setLoaderStatus(
        `已加载 ${this.loaderData.name} ${version.version} / ${file.displayName || file.originalName || '文件'}`
      );
    }

    // ========== 新增积木实现 ==========
    // 刷新商店列表（异步，不等待结果）
    refreshStoreList() {
      this.refreshStore().catch(e => console.warn('[ExtFind] 刷新失败:', e));
    }

    // 获取扩展名称列表（换行分隔）
    getExtensionNamesList() {
      return this.extensions.map(ext => ext.name || '').join('\n');
    }

    // 获取扩展作者列表（换行分隔）
    getExtensionAuthorsList() {
      return this.extensions.map(ext => ext.author?.displayName || '').join('\n');
    }

    // 获取扩展点赞数列表（换行分隔）
    getExtensionLikesList() {
      return this.extensions.map(ext => String(ext.likeCount || 0)).join('\n');
    }

    // 获取指定索引的扩展的版本数量
    getExtensionVersionCount(args) {
      const index = Math.max(0, Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1));
      const ext = this.extensions[index];
      if (!ext) return 0;
      return Array.isArray(ext.versions) ? ext.versions.length : 0;
    }

    // 获取指定索引的扩展的文件总数（所有版本文件数之和）
    getExtensionTotalFilesCount(args) {
      const index = Math.max(0, Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1));
      const ext = this.extensions[index];
      if (!ext) return 0;
      const versions = Array.isArray(ext.versions) ? ext.versions : [];
      let total = 0;
      for (const v of versions) {
        if (Array.isArray(v.files)) total += v.files.length;
      }
      return total;
    }

    // 获取扩展的完整 JSON 字符串（整个 ext 对象）
    getExtensionJSON(args) {
      const index = Math.max(0, Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1));
      const ext = this.extensions[index];
      if (!ext) return '{}';
      try {
        return JSON.stringify(ext);
      } catch {
        return '{}';
      }
    }

    // 获取整个当前页扩展列表的 JSON 数组字符串
    getAllExtensionsJSON() {
      try {
        return JSON.stringify(this.extensions);
      } catch {
        return '[]';
      }
    }

    getInfo() {
      return {
        id: 'extfindUnified',
        name: 'ExtFind',
        color1: '#00baad',
        color2: '#00998f',
        color3: '#006d66',
        blocks: [
          {
            opcode: 'openPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '打开 ExtFind 面板'
          }
        ]
      };
    }

    openPanel() {
      this.showUI('store');
    }

    openStore() {
      this.showUI('store');
    }

    openLoader() {
      this.showUI('loader');
    }

    getExtensionCount() {
      return this.extensions.length;
    }

    getCurrentPage() {
      return this.storePage;
    }

    getPageSize() {
      return this.storePageSize;
    }

    getStoreSort() {
      return this.storeSort === 'likes' ? '最多点赞' : '最近创建';
    }

    getExtensionName(args) {
      if (!this.extensions.length) return '';

      const index = Math.max(
        0,
        Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1)
      );

      return this.extensions[index]?.name || '';
    }

    getExtensionAuthor(args) {
      if (!this.extensions.length) return '';

      const index = Math.max(
        0,
        Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1)
      );

      return this.extensions[index]?.author?.displayName || '';
    }

    getExtensionLikes(args) {
      if (!this.extensions.length) return 0;

      const index = Math.max(
        0,
        Math.min(this.extensions.length - 1, Number(args.INDEX || 1) - 1)
      );

      return this.extensions[index]?.likeCount || 0;
    }
  }

  Scratch.extensions.register(new ExtFindUnified());
})(Scratch);
