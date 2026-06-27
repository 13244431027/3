

plugin.id = "markdown-render-plus";
plugin.name = "Markdown 解析增强";
plugin.version = "1.4.1";
plugin.description = "使用 marked + DOMPurify + highlight.js 增强 GitHub 面板 Markdown 预览，支持相对路径智能补全、CDN 缓存、手动缓存悬浮窗，并强制覆盖原生解析器。";
plugin.tags = ["markdown", "marked", "highlight", "preview", "github", "assets", "cache", "override"];

plugin.style = `
/* ===== Markdown Render Plus ===== */
.gp-mdp-body {
  color-scheme: dark !important;
  background: transparent !important;
  color: #e6edf3 !important;
  font-size: 14px;
  line-height: 1.65;
  word-break: break-word;
}
.gp-mdp-body h1, .gp-mdp-body h2, .gp-mdp-body h3,
.gp-mdp-body h4, .gp-mdp-body h5, .gp-mdp-body h6 {
  color: #e6edf3 !important;
  border-bottom-color: #30363d !important;
  margin-top: 1em;
  margin-bottom: 0.6em;
}
.gp-mdp-body h1 { font-size: 2em; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; }
.gp-mdp-body h2 { font-size: 1.5em; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; }
.gp-mdp-body h3 { font-size: 1.25em; }
.gp-mdp-body a { color: #58a6ff !important; text-decoration: none; }
.gp-mdp-body a:hover { text-decoration: underline; }
.gp-mdp-body img {
  max-width: 100%;
  border-radius: 6px;
  margin: 6px 0;
  background: rgba(255,255,255,0.04);
}
.gp-mdp-body video, .gp-mdp-body iframe {
  max-width: 100%;
  border-radius: 6px;
  margin: 8px 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid #30363d;
}
.gp-mdp-body table {
  background-color: #0d1117 !important;
  border-collapse: collapse !important;
  width: 100% !important;
  border: 1px solid #30363d !important;
  margin: 12px 0;
  display: block;
  overflow-x: auto;
}
.gp-mdp-body th, .gp-mdp-body td {
  background-color: #0d1117 !important;
  border: 1px solid #30363d !important;
  color: #e6edf3 !important;
  padding: 8px 12px !important;
}
.gp-mdp-body th { background-color: #161b22 !important; font-weight: 700; }
.gp-mdp-body pre {
  background-color: #0d1117 !important;
  border: 1px solid #30363d !important;
  border-radius: 8px !important;
  padding: 12px !important;
  overflow-x: auto !important;
  margin: 12px 0;
}
.gp-mdp-body pre code {
  background-color: transparent !important;
  color: #e6edf3 !important;
  font-size: 13px !important;
  white-space: pre !important;
  padding: 0 !important;
}
.gp-mdp-body code:not(pre code) {
  background-color: rgba(110,118,129,.4) !important;
  color: #f0883e !important;
  padding: .2em .4em !important;
  border-radius: 4px !important;
}
.gp-mdp-body blockquote {
  border-left: 4px solid #3fb950 !important;
  background-color: rgba(63,185,80,.08) !important;
  color: #c9d1d9 !important;
  padding: 8px 12px;
  margin: 12px 0;
}
.gp-mdp-body hr { border: none; border-top: 1px solid #30363d; margin: 16px 0; }
.gp-mdp-body ul, .gp-mdp-body ol { padding-left: 2em; }
.gp-mdp-body kbd {
  display: inline-block;
  padding: 2px 6px;
  font: 11px ui-monospace, SFMono-Regular, Consolas, monospace;
  line-height: 1.4;
  color: #e6edf3;
  vertical-align: middle;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-bottom-color: #6e7681;
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 #6e7681;
}
.gp-mdp-body details {
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.03);
  margin: 10px 0;
}
.gp-mdp-body summary { cursor: pointer; font-weight: 600; }
.gp-mdp-body .hljs { background: transparent !important; color: #e6edf3 !important; }

.gp-mdp-loading-note {
  font-size: 12px;
  opacity: 0.75;
  padding: 6px 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
}

/* ===== 手动缓存悬浮窗 ===== */
.gp-mdp-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 2147483000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #30363d;
  background: #161b22;
  color: #e6edf3;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s ease, background .15s ease;
}
.gp-mdp-fab:hover { background: #21262d; transform: scale(1.06); }
.gp-mdp-panel {
  position: fixed;
  right: 18px;
  bottom: 72px;
  z-index: 2147483001;
  width: 380px;
  max-width: calc(100vw - 36px);
  max-height: calc(100vh - 110px);
  overflow: auto;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  color: #e6edf3;
  font-size: 13px;
  display: none;
  flex-direction: column;
}
.gp-mdp-panel.gp-mdp-open { display: flex; }
.gp-mdp-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #30363d;
  font-weight: 600;
}
.gp-mdp-panel-close {
  cursor: pointer;
  border: none;
  background: transparent;
  color: #8b949e;
  font-size: 18px;
  line-height: 1;
}
.gp-mdp-panel-close:hover { color: #e6edf3; }
.gp-mdp-panel-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gp-mdp-field { display: flex; flex-direction: column; gap: 4px; }
.gp-mdp-field label { font-size: 12px; color: #8b949e; }
.gp-mdp-field input {
  width: 100%;
  box-sizing: border-box;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #e6edf3;
  padding: 7px 9px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.gp-mdp-field input:focus { outline: none; border-color: #58a6ff; }
.gp-mdp-hint { font-size: 11px; color: #6e7681; line-height: 1.5; word-break: break-all; }
.gp-mdp-hint code { color: #58a6ff; }
.gp-mdp-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
.gp-mdp-btn {
  flex: 1;
  min-width: 90px;
  cursor: pointer;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #e6edf3;
}
.gp-mdp-btn:hover { background: #30363d; }
.gp-mdp-btn.gp-mdp-primary { background: #238636; border-color: #2ea043; }
.gp-mdp-btn.gp-mdp-primary:hover { background: #2ea043; }
.gp-mdp-btn.gp-mdp-danger { background: #b62324; border-color: #da3633; }
.gp-mdp-btn.gp-mdp-danger:hover { background: #da3633; }
.gp-mdp-status { font-size: 12px; min-height: 16px; color: #8b949e; }
.gp-mdp-status.gp-mdp-ok { color: #3fb950; }
.gp-mdp-status.gp-mdp-err { color: #f85149; }
.gp-mdp-cache-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid #30363d;
  padding-top: 10px;
}
.gp-mdp-cache-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 6px 8px;
}
.gp-mdp-cache-item .gp-mdp-cache-name { font-size: 11px; word-break: break-all; flex: 1; }
.gp-mdp-cache-item .gp-mdp-cache-meta { font-size: 10px; color: #6e7681; }
`;

plugin.init = function (context) {
  const { core, utils, extension } = context;

  // 强制覆盖原生解析器：即使库加载失败，也绝不回退到原始解析
  const FORCE_OVERRIDE = true;

  const CDN = {
    githubMarkdownCSS: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css",
    highlightCSS: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css",
    marked: "https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js",
    dompurify: "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js",
    highlight: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
  };

  const CACHE_CONFIG = {
    version: "v1.4.1",
    cacheName: "gp-markdown-render-plus-cdn-v1.4.1",
    localPrefix: "gp-mdp-cdn-cache:",
    ttl: 1000 * 60 * 60 * 24 * 14
  };

  const state = {
    ready: false,
    loading: false,
    failed: false,
    originalParseMarkdown: utils.parseMarkdown,
    currentFilePath: "",
    currentBaseDir: "",
    patchedOpenFile: false,
    assetPromises: new Map()
  };

  // ===== 待渲染队列（修复异步加载时机问题）=====
  const pendingRenders = new Map();
  let renderCounter = 0;

  function now() { return Date.now(); }

  function cacheKey(url) {
    return `${CACHE_CONFIG.localPrefix}${CACHE_CONFIG.version}:${url}`;
  }

  async function readFromCacheStorage(url) {
    if (!window.caches) return null;
    try {
      const cache = await caches.open(CACHE_CONFIG.cacheName);
      const response = await cache.match(url);
      if (!response) return null;
      const savedAt = Number(response.headers.get("x-gp-mdp-cache-time") || "0");
      const text = await response.text();
      if (!text) return null;
      return { text, savedAt, expired: savedAt ? now() - savedAt > CACHE_CONFIG.ttl : false };
    } catch {
      return null;
    }
  }

  async function writeToCacheStorage(url, text, contentType) {
    if (!window.caches || !text) return false;
    try {
      const cache = await caches.open(CACHE_CONFIG.cacheName);
      const response = new Response(text, {
        status: 200,
        headers: {
          "content-type": contentType || "text/plain; charset=utf-8",
          "x-gp-mdp-cache-time": String(now()),
          "x-gp-mdp-cache-version": CACHE_CONFIG.version
        }
      });
      await cache.put(url, response);
      return true;
    } catch {
      return false;
    }
  }

  function readFromLocalStorage(url) {
    try {
      const raw = localStorage.getItem(cacheKey(url));
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.text) return null;
      return {
        text: data.text,
        savedAt: data.savedAt || 0,
        expired: data.savedAt ? now() - data.savedAt > CACHE_CONFIG.ttl : false
      };
    } catch {
      return null;
    }
  }

  function writeToLocalStorage(url, text) {
    try {
      localStorage.setItem(
        cacheKey(url),
        JSON.stringify({ version: CACHE_CONFIG.version, savedAt: now(), text })
      );
      return true;
    } catch {
      return false;
    }
  }

  async function readCachedText(url) {
    const cacheStorageData = await readFromCacheStorage(url);
    if (cacheStorageData) return cacheStorageData;
    return readFromLocalStorage(url);
  }

  async function writeCachedText(url, text, contentType) {
    const ok = await writeToCacheStorage(url, text, contentType);
    writeToLocalStorage(url, text);
    return ok;
  }

  async function fetchTextWithCache(url, contentType) {
    if (state.assetPromises.has(url)) {
      return state.assetPromises.get(url);
    }
    const promise = (async () => {
      const cached = await readCachedText(url);
      if (cached && !cached.expired) {
        console.log("[MarkdownRenderPlus] CDN cache hit:", url);
        return cached.text;
      }
      try {
        const response = await fetch(url, { method: "GET", cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
          throw new Error("empty response");
        }
        await writeCachedText(url, text, contentType);
        console.log("[MarkdownRenderPlus] CDN fetched and cached:", url);
        return text;
      } catch (error) {
        if (cached && cached.text) {
          console.warn("[MarkdownRenderPlus] CDN fetch failed, using stale cache:", url, error);
          return cached.text;
        }
        throw error;
      }
    })();
    state.assetPromises.set(url, promise);
    try {
      return await promise;
    } finally {
      state.assetPromises.delete(url);
    }
  }

  function injectStyleText(id, cssText) {
    const old = document.querySelector(`style[data-gp-mdp-cdn="${id}"]`);
    if (old) return;
    const style = document.createElement("style");
    style.setAttribute("data-gp-mdp-cdn", id);
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  function injectScriptText(id, jsText, sourceUrl) {
    if (document.querySelector(`script[data-gp-mdp-cdn="${id}"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.setAttribute("data-gp-mdp-cdn", id);
    script.textContent = `${jsText}\n//# sourceURL=${sourceUrl}`;
    document.head.appendChild(script);
  }

  async function loadCSSCached(id, href) {
    const text = await fetchTextWithCache(href, "text/css; charset=utf-8");
    injectStyleText(id, text);
  }

  async function loadScriptCached(id, src) {
    const text = await fetchTextWithCache(src, "application/javascript; charset=utf-8");
    injectScriptText(id, text, src);
  }

  plugin.clearCdnCache = async function () {
    try {
      if (window.caches) {
        await caches.delete(CACHE_CONFIG.cacheName);
      }
    } catch {}
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_CONFIG.localPrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
    console.log("[MarkdownRenderPlus] CDN cache cleared.");
  };

  // 手动缓存：根据 URL 推断资源类型并缓存（不一定立即注入）
  async function manualCacheUrl(url) {
    const clean = String(url || "").trim();
    if (!clean || !/^https?:\/\//i.test(clean)) {
      throw new Error("请输入合法的 http(s) 文件地址");
    }
    const isCss = /\.css(\?|#|$)/i.test(clean);
    const contentType = isCss
      ? "text/css; charset=utf-8"
      : "application/javascript; charset=utf-8";
    const response = await fetch(clean, { method: "GET", cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`下载失败 HTTP ${response.status}`);
    }
    const text = await response.text();
    if (!text) {
      throw new Error("文件内容为空");
    }
    await writeCachedText(clean, text, contentType);
    return { url: clean, size: text.length, isCss };
  }

  function listLocalCache() {
    const items = [];
    try {
      const prefix = `${CACHE_CONFIG.localPrefix}${CACHE_CONFIG.version}:`;
      Object.keys(localStorage).forEach(key => {
        if (!key.startsWith(prefix)) return;
        const url = key.slice(prefix.length);
        let savedAt = 0;
        let size = 0;
        try {
          const data = JSON.parse(localStorage.getItem(key));
          savedAt = data.savedAt || 0;
          size = data.text ? data.text.length : 0;
        } catch {}
        items.push({ url, savedAt, size });
      });
    } catch {}
    return items.sort((a, b) => b.savedAt - a.savedAt);
  }

  async function removeCachedUrl(url) {
    try {
      localStorage.removeItem(cacheKey(url));
    } catch {}
    try {
      if (window.caches) {
        const cache = await caches.open(CACHE_CONFIG.cacheName);
        await cache.delete(url);
      }
    } catch {}
  }

  function formatTime(ts) {
    if (!ts) return "未知时间";
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return "未知时间";
    }
  }

  function formatSize(bytes) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  // ===== 悬浮窗 UI =====
  let panelEls = null;

  function setStatus(text, type) {
    if (!panelEls) return;
    panelEls.status.textContent = text || "";
    panelEls.status.classList.remove("gp-mdp-ok", "gp-mdp-err");
    if (type === "ok") panelEls.status.classList.add("gp-mdp-ok");
    if (type === "err") panelEls.status.classList.add("gp-mdp-err");
  }

  function renderCacheList() {
    if (!panelEls) return;
    const items = listLocalCache();
    const list = panelEls.cacheList;
    list.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "gp-mdp-hint";
      empty.textContent = "暂无已缓存文件。";
      list.appendChild(empty);
      return;
    }
    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "gp-mdp-cache-item";
      const left = document.createElement("div");
      left.style.flex = "1";
      const name = document.createElement("div");
      name.className = "gp-mdp-cache-name";
      name.textContent = item.url;
      name.title = item.url;
      const meta = document.createElement("div");
      meta.className = "gp-mdp-cache-meta";
      meta.textContent = `${formatSize(item.size)} · ${formatTime(item.savedAt)}`;
      left.appendChild(name);
      left.appendChild(meta);
      const del = document.createElement("button");
      del.className = "gp-mdp-btn gp-mdp-danger";
      del.style.flex = "0 0 auto";
      del.style.minWidth = "auto";
      del.textContent = "删除";
      del.addEventListener("click", async () => {
        await removeCachedUrl(item.url);
        renderCacheList();
        setStatus("已删除该缓存。", "ok");
      });
      row.appendChild(left);
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  function buildPanel() {
    if (document.querySelector(".gp-mdp-fab")) return;
    const fab = document.createElement("button");
    fab.className = "gp-mdp-fab";
    fab.type = "button";
    fab.title = "Markdown 缓存管理";
    fab.textContent = "⬇";

    const panel = document.createElement("div");
    panel.className = "gp-mdp-panel";
    panel.innerHTML = `
      <div class="gp-mdp-panel-header">
        <span>Markdown 资源缓存</span>
        <button class="gp-mdp-panel-close" type="button" title="关闭">×</button>
      </div>
      <div class="gp-mdp-panel-body">
        <div class="gp-mdp-field">
          <label for="gp-mdp-url-input">文件地址（CSS / JS）</label>
          <input id="gp-mdp-url-input" type="text" placeholder="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css" />
          <div class="gp-mdp-hint">
            请从如下地址获取并填写文件，例如：<br>
            <code>https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css</code>
          </div>
        </div>
        <div class="gp-mdp-btn-row">
          <button class="gp-mdp-btn gp-mdp-primary" data-action="cache" type="button">下载并缓存</button>
          <button class="gp-mdp-btn" data-action="reload" type="button">重新加载库</button>
        </div>
        <div class="gp-mdp-btn-row">
          <button class="gp-mdp-btn gp-mdp-danger" data-action="clear" type="button">清空全部缓存</button>
        </div>
        <div class="gp-mdp-status"></div>
        <div class="gp-mdp-cache-list"></div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    panelEls = {
      fab,
      panel,
      input: panel.querySelector("#gp-mdp-url-input"),
      status: panel.querySelector(".gp-mdp-status"),
      cacheList: panel.querySelector(".gp-mdp-cache-list")
    };

    function togglePanel(open) {
      const willOpen = open === undefined ? !panel.classList.contains("gp-mdp-open") : open;
      panel.classList.toggle("gp-mdp-open", willOpen);
      if (willOpen) {
        renderCacheList();
        setStatus("", "");
      }
    }

    fab.addEventListener("click", () => togglePanel());
    panel.querySelector(".gp-mdp-panel-close").addEventListener("click", () => togglePanel(false));
    panelEls.input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        panel.querySelector('[data-action="cache"]').click();
      }
    });

    panel.querySelector('[data-action="cache"]').addEventListener("click", async () => {
      const url = panelEls.input.value;
      setStatus("正在下载并缓存…", "");
      try {
        const result = await manualCacheUrl(url);
        setStatus(`已缓存 ${result.isCss ? "CSS" : "JS"} 文件（${formatSize(result.size)}）。`, "ok");
        panelEls.input.value = "";
        renderCacheList();
      } catch (error) {
        setStatus(`缓存失败：${error.message || error}`, "err");
      }
    });

    panel.querySelector('[data-action="reload"]').addEventListener("click", async () => {
      setStatus("正在重新加载 Markdown 库…", "");
      state.ready = false;
      state.failed = false;
      try {
        await initMarkdownLibs();
        setStatus(
          state.ready ? "Markdown 库已重新加载。" : "重新加载失败，请检查缓存或网络。",
          state.ready ? "ok" : "err"
        );
        renderCacheList();
      } catch (error) {
        setStatus(`重新加载失败：${error.message || error}`, "err");
      }
    });

    panel.querySelector('[data-action="clear"]').addEventListener("click", async () => {
      await plugin.clearCdnCache();
      renderCacheList();
      setStatus("已清空全部缓存。", "ok");
    });
  }

  function ensurePanel() {
    if (document.body) {
      buildPanel();
    } else {
      document.addEventListener("DOMContentLoaded", buildPanel, { once: true });
    }
  }

  // ===== Markdown 库加载与解析增强 =====
  async function initMarkdownLibs() {
    if (state.ready || state.loading) return;
    state.loading = true;
    try {
      await Promise.all([
        loadCSSCached("github-markdown-css", CDN.githubMarkdownCSS),
        loadCSSCached("highlight-css", CDN.highlightCSS)
      ]);
      await Promise.all([
        loadScriptCached("marked", CDN.marked),
        loadScriptCached("dompurify", CDN.dompurify),
        loadScriptCached("highlight", CDN.highlight)
      ]);
      if (window.marked && typeof window.marked.setOptions === "function") {
        window.marked.setOptions({ gfm: true, breaks: true });
      }
      state.ready = true;
      state.failed = false;
      console.log("[MarkdownRenderPlus] Markdown libraries loaded from CDN/cache.");
      // 库就绪后补渲染已显示的 fallback 内容
      reRenderPending();
    } catch (error) {
      state.ready = false;
      state.failed = true;
      console.warn("[MarkdownRenderPlus] Markdown libraries load failed:", error);
    } finally {
      state.loading = false;
    }
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function dirname(path) {
    const clean = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
    const i = clean.lastIndexOf("/");
    return i >= 0 ? clean.slice(0, i) : "";
  }

  function splitUrlSuffix(url) {
    const raw = String(url || "").trim();
    const hashIndex = raw.indexOf("#");
    const queryIndex = raw.indexOf("?");
    let cut = -1;
    if (queryIndex >= 0 && hashIndex >= 0) {
      cut = Math.min(queryIndex, hashIndex);
    } else if (queryIndex >= 0) {
      cut = queryIndex;
    } else if (hashIndex >= 0) {
      cut = hashIndex;
    }
    if (cut < 0) {
      return { path: raw, suffix: "" };
    }
    return { path: raw.slice(0, cut), suffix: raw.slice(cut) };
  }

  function isExternalUrl(url) {
    const clean = String(url || "").trim();
    return /^(https?:)?\/\//i.test(clean) ||
      /^data:/i.test(clean) ||
      /^blob:/i.test(clean) ||
      /^mailto:/i.test(clean) ||
      /^tel:/i.test(clean) ||
      /^javascript:/i.test(clean) ||
      /^#/i.test(clean);
  }

  function normalizeSlashes(path) {
    return String(path || "")
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/");
  }

  function normalizeDotSegments(path) {
    const absolute = String(path || "").startsWith("/");
    const parts = normalizeSlashes(path).split("/");
    const out = [];
    for (const part of parts) {
      if (!part || part === ".") continue;
      if (part === "..") {
        if (out.length > 0) {
          out.pop();
        }
        continue;
      }
      out.push(part);
    }
    return (absolute ? "/" : "") + out.join("/");
  }

  function stripKnownPrefix(path, owner, repo, branch) {
    let p = normalizeSlashes(path).replace(/^\/+/, "");
    const safeOwner = String(owner || "");
    const safeRepo = String(repo || "");
    const safeBranch = String(branch || "main");
    const lower = p.toLowerCase();
    const ownerRepo = `${safeOwner}/${safeRepo}`.toLowerCase();

    if (ownerRepo && lower.startsWith(ownerRepo + "/blob/")) {
      const rest = p.slice(`${safeOwner}/${safeRepo}/blob/`.length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (ownerRepo && lower.startsWith(ownerRepo + "/raw/")) {
      const rest = p.slice(`${safeOwner}/${safeRepo}/raw/`.length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (ownerRepo && lower.startsWith(ownerRepo + "/")) {
      return p.slice(`${safeOwner}/${safeRepo}/`.length);
    }
    if (lower.startsWith("blob/")) {
      const rest = p.slice("blob/".length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (lower.startsWith("raw/")) {
      const rest = p.slice("raw/".length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (lower.startsWith("refs/heads/")) {
      const rest = p.slice("refs/heads/".length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (lower.startsWith("refs/tags/")) {
      const rest = p.slice("refs/tags/".length);
      const parts = rest.split("/");
      parts.shift();
      return parts.join("/");
    }
    if (safeBranch && lower.startsWith(safeBranch.toLowerCase() + "/")) {
      return p.slice(safeBranch.length + 1);
    }
    return p;
  }

  function resolveRepoPath(input, owner, repo, branch, baseDir) {
    const value = String(input || "").trim();
    if (!value || isExternalUrl(value)) {
      return value;
    }
    const parts = splitUrlSuffix(value);
    let p = decodeURI(parts.path).trim();
    p = p.replace(/^['"]|['"]$/g, "");

    if (p.startsWith("/")) {
      p = p.replace(/^\/+/, "");
    } else {
      p = stripKnownPrefix(p, owner, repo, branch);
      const lower = String(value).toLowerCase();
      const ownerRepo = `${owner}/${repo}`.toLowerCase();
      const looksRepoQualified = ownerRepo && (
        lower.startsWith(ownerRepo + "/") ||
        lower.startsWith("blob/") ||
        lower.startsWith("raw/") ||
        lower.startsWith("refs/heads/") ||
        lower.startsWith("refs/tags/") ||
        lower.startsWith(String(branch || "main").toLowerCase() + "/")
      );
      if (!looksRepoQualified) {
        p = baseDir ? `${baseDir}/${p}` : p;
      }
    }
    p = normalizeDotSegments(p).replace(/^\/+/, "");
    return p + parts.suffix;
  }

  function makeRawUrl(path, owner, repo, branch) {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch || "main"}/${path}`;
  }

  function makeBlobUrl(path, owner, repo, branch) {
    return `https://github.com/${owner}/${repo}/blob/${branch || "main"}/${path}`;
  }

  function rewriteUrl(url, kind, owner, repo, branch, baseDir) {
    const clean = String(url || "").trim();
    if (!clean || isExternalUrl(clean)) {
      return url;
    }
    if (!owner || !repo) {
      return url;
    }
    const path = resolveRepoPath(clean, owner, repo, branch, baseDir);
    if (!path || isExternalUrl(path)) {
      return url;
    }
    if (kind === "blob") {
      return makeBlobUrl(path, owner, repo, branch);
    }
    return makeRawUrl(path, owner, repo, branch);
  }

  function rewriteSrcset(srcset, owner, repo, branch, baseDir) {
    if (!srcset || !owner || !repo) return srcset;
    return String(srcset)
      .split(",")
      .map(part => {
        const trimmed = part.trim();
        if (!trimmed) return trimmed;
        const pieces = trimmed.split(/\s+/);
        const url = pieces.shift();
        const suffix = pieces.length ? " " + pieces.join(" ") : "";
        return rewriteUrl(url, "raw", owner, repo, branch, baseDir) + suffix;
      })
      .join(", ");
  }

  function getBaseDir() {
    if (state.currentBaseDir) {
      return state.currentBaseDir;
    }
    if (state.currentFilePath) {
      return dirname(state.currentFilePath);
    }
    if (core && core.currentPath) {
      return String(core.currentPath || "").replace(/^\/+|\/+$/g, "");
    }
    return "";
  }

  function rewriteHtmlRelativeAssets(rawHtml, owner, repo, branch, baseDir) {
    if (!rawHtml || !owner || !repo) return rawHtml;
    const template = document.createElement("template");
    template.innerHTML = String(rawHtml);

    template.content.querySelectorAll("img[src]").forEach(el => {
      el.setAttribute("src", rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir));
    });
    template.content.querySelectorAll("source[src], video[src], audio[src]").forEach(el => {
      el.setAttribute("src", rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir));
    });
    template.content.querySelectorAll("video[poster]").forEach(el => {
      el.setAttribute("poster", rewriteUrl(el.getAttribute("poster"), "raw", owner, repo, branch, baseDir));
    });
    template.content.querySelectorAll("iframe[src]").forEach(el => {
      el.setAttribute("src", rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir));
    });
    template.content.querySelectorAll("[srcset]").forEach(el => {
      el.setAttribute("srcset", rewriteSrcset(el.getAttribute("srcset"), owner, repo, branch, baseDir));
    });
    template.content.querySelectorAll("a[href]").forEach(el => {
      el.setAttribute("href", rewriteUrl(el.getAttribute("href"), "blob", owner, repo, branch, baseDir));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    return template.innerHTML;
  }

  function sanitizeMarkdownHtml(rawHtml) {
    if (!window.DOMPurify) return rawHtml;
    return window.DOMPurify.sanitize(String(rawHtml), {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr", "a", "img",
        "strong", "em", "b", "i", "u", "s", "del",
        "code", "pre", "blockquote",
        "ul", "ol", "li",
        "table", "thead", "tbody", "tfoot", "tr", "th", "td",
        "div", "span", "section", "article",
        "details", "summary", "kbd",
        "video", "audio", "source", "iframe"
      ],
      ALLOWED_ATTR: [
        "href", "src", "srcset", "poster", "alt", "title", "class", "id",
        "target", "rel", "align", "width", "height", "loading",
        "controls", "muted", "loop", "autoplay", "playsinline",
        "frameborder", "allow", "allowfullscreen", "sandbox",
        "referrerpolicy", "colspan", "rowspan"
      ],
      ADD_ATTR: ["target", "rel"],
      ALLOW_DATA_ATTR: false
    });
  }

  function postProcessLinks(container) {
    if (!container) return;
    container.querySelectorAll("a[href]").forEach(a => {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  function highlightLater() {
    setTimeout(() => {
      if (!window.hljs) return;
      document.querySelectorAll(".gp-mdp-body pre code").forEach(block => {
        if (block.dataset.gpMdpHighlighted === "1") return;
        try {
          window.hljs.highlightElement(block);
          block.dataset.gpMdpHighlighted = "1";
        } catch {}
      });
      document.querySelectorAll(".gp-mdp-body").forEach(postProcessLinks);
    }, 50);
  }

  // 用 marked 把文本渲染成最终 HTML（库就绪时使用）
  function renderWithMarked(text, owner, repo, branch, baseDir) {
    const rawHtml = window.marked.parse
      ? window.marked.parse(String(text))
      : window.marked(String(text));
    const rewrittenHtml = rewriteHtmlRelativeAssets(rawHtml, owner, repo, branch, baseDir);
    return sanitizeMarkdownHtml(rewrittenHtml);
  }

  // 库异步加载完成后，把所有 fallback 占位内容替换成真正渲染结果
  function reRenderPending() {
    if (!state.ready || !window.marked || !window.DOMPurify) return;
    document.querySelectorAll("[data-gp-mdp-pending]").forEach(el => {
      const id = el.getAttribute("data-gp-mdp-pending");
      const ctx = pendingRenders.get(id);
      if (!ctx) {
        el.removeAttribute("data-gp-mdp-pending");
        return;
      }
      try {
        const clean = renderWithMarked(ctx.text, ctx.owner, ctx.repo, ctx.branch, ctx.baseDir);
        el.classList.add("markdown-body");
        el.removeAttribute("data-gp-mdp-pending");
        el.innerHTML = clean;
        pendingRenders.delete(id);
      } catch (e) {
        console.warn("[MarkdownRenderPlus] re-render failed:", e);
      }
    });
    // 同时移除可能残留的加载提示
    document.querySelectorAll(".gp-mdp-loading-note").forEach(n => n.remove());
    highlightLater();
  }

  // 备用解析：强制覆盖时显示纯文本，并记录待库就绪后补渲染
  function fallbackParse(text, owner, repo, branch) {
    if (FORCE_OVERRIDE) {
      // 强制覆盖模式：先显示纯文本占位，记录上下文，待库加载完成后补渲染
      const id = "gp-mdp-pending-" + (++renderCounter);
      pendingRenders.set(id, {
        text: String(text),
        owner,
        repo,
        branch,
        baseDir: getBaseDir()
      });
      return `<div class="gp-mdp-body" data-gp-mdp-pending="${id}"><pre style="white-space:pre-wrap;">${escapeHtml(text)}</pre></div>`;
    }
    // 非强制模式：若有原始解析器则回退
    if (typeof state.originalParseMarkdown === "function") {
      return state.originalParseMarkdown(text, owner, repo, branch);
    }
    return `<pre style="white-space:pre-wrap;">${escapeHtml(text)}</pre>`;
  }

  function patchOpenFileForBaseDir() {
    if (!extension || state.patchedOpenFile || typeof extension.openFile !== "function") {
      return;
    }
    const originalOpenFile = extension.openFile.bind(extension);
    extension.openFile = async function patchedOpenFile(file) {
      try {
        if (file && file.path) {
          state.currentFilePath = String(file.path || "");
          state.currentBaseDir = dirname(state.currentFilePath);
        }
      } catch {}
      return originalOpenFile(file);
    };
    state.patchedOpenFile = true;
  }

  patchOpenFileForBaseDir();

  utils.parseMarkdown = function enhancedParseMarkdown(text, owner, repo, branch) {
    if (!text) return "";

    const safeOwner = owner || (core && core.currentOwner) || "";
    const safeRepo = repo || (core && core.currentRepo) || "";
    const safeBranch = branch || (core && core.currentBranch) || "main";
    const baseDir = getBaseDir();

    if (!state.ready && !state.loading && !state.failed) {
      initMarkdownLibs();
    }

    if (!state.ready || !window.marked || !window.DOMPurify) {
      const fallback = fallbackParse(text, safeOwner, safeRepo, safeBranch);
      if (state.loading) {
        return `
          <div class="gp-mdp-loading-note">
            Markdown 增强解析器正在加载中，加载完成后将自动渲染（强制覆盖模式）。
          </div>
          ${fallback}
        `;
      }
      return fallback;
    }

    try {
      const cleanHtml = renderWithMarked(text, safeOwner, safeRepo, safeBranch, baseDir);
      highlightLater();
      return `
        <div class="markdown-body gp-mdp-body">
          ${cleanHtml}
        </div>
      `;
    } catch (error) {
      console.warn("[MarkdownRenderPlus] parse failed:", error);
      return fallbackParse(text, safeOwner, safeRepo, safeBranch);
    }
  };

  // 暴露给悬浮窗按钮调用
  plugin.openCachePanel = function () {
    ensurePanel();
    const panel = document.querySelector(".gp-mdp-panel");
    if (panel) panel.classList.add("gp-mdp-open");
  };

  ensurePanel();
  initMarkdownLibs();

  console.log("[MarkdownRenderPlus] Plugin initialized with CDN cache + manual cache panel + force override + re-render.");
};

plugin.onHook = function (hookName, data) {
  if (hookName === "file:open" && data && data.file && data.file.path) {
    try {
      const path = String(data.file.path || "");
      const i = path.lastIndexOf("/");
      this._lastFilePath = path;
      this._lastBaseDir = i >= 0 ? path.slice(0, i) : "";
    } catch {}
  }

  if (
    hookName === "file:open" ||
    hookName === "mode:switch" ||
    hookName === "dir:load"
  ) {
    setTimeout(() => {
      if (window.hljs) {
        document.querySelectorAll(".gp-mdp-body pre code").forEach(block => {
          if (block.dataset.gpMdpHighlighted === "1") return;
          try {
            window.hljs.highlightElement(block);
            block.dataset.gpMdpHighlighted = "1";
          } catch {}
        });
      }
      document.querySelectorAll(".gp-mdp-body a[href]").forEach(a => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      });
    }, 80);
  }
};
