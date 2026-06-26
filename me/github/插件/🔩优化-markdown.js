// GitHub Panel Pro+ 插件：Markdown 解析增强
// 增强内容：marked + DOMPurify + highlight.js + 智能资源路径补全 + CDN 缓存
// 适用于 GitHubPanelExtension 的 PluginManager

plugin.id = "markdown-render-plus";
plugin.name = "Markdown 解析增强";
plugin.version = "1.2.0";
plugin.description = "使用 marked + DOMPurify + highlight.js 增强 GitHub 面板 Markdown 预览，并支持相对资源路径智能补全与 CDN 文件缓存。";
plugin.tags = ["markdown", "marked", "highlight", "preview", "github", "assets", "cache"];

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

.gp-mdp-body h1,
.gp-mdp-body h2,
.gp-mdp-body h3,
.gp-mdp-body h4,
.gp-mdp-body h5,
.gp-mdp-body h6 {
  color: #e6edf3 !important;
  border-bottom-color: #30363d !important;
  margin-top: 1em;
  margin-bottom: 0.6em;
}

.gp-mdp-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

.gp-mdp-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

.gp-mdp-body h3 {
  font-size: 1.25em;
}

.gp-mdp-body a {
  color: #58a6ff !important;
  text-decoration: none;
}

.gp-mdp-body a:hover {
  text-decoration: underline;
}

.gp-mdp-body img {
  max-width: 100%;
  border-radius: 6px;
  margin: 6px 0;
  background: rgba(255,255,255,0.04);
}

.gp-mdp-body video,
.gp-mdp-body iframe {
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

.gp-mdp-body th,
.gp-mdp-body td {
  background-color: #0d1117 !important;
  border: 1px solid #30363d !important;
  color: #e6edf3 !important;
  padding: 8px 12px !important;
}

.gp-mdp-body th {
  background-color: #161b22 !important;
  font-weight: 700;
}

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

.gp-mdp-body hr {
  border: none;
  border-top: 1px solid #30363d;
  margin: 16px 0;
}

.gp-mdp-body ul,
.gp-mdp-body ol {
  padding-left: 2em;
}

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

.gp-mdp-body summary {
  cursor: pointer;
  font-weight: 600;
}

.gp-mdp-body .hljs {
  background: transparent !important;
  color: #e6edf3 !important;
}

.gp-mdp-loading-note {
  font-size: 12px;
  opacity: 0.75;
  padding: 6px 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
}
`;

plugin.init = function (context) {
  const { core, utils, extension } = context;

  const CDN = {
    githubMarkdownCSS:
      "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css",
    highlightCSS:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css",
    marked:
      "https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js",
    dompurify:
      "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js",
    highlight:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
  };

  const CACHE_CONFIG = {
    version: "v1.2.0",
    cacheName: "gp-markdown-render-plus-cdn-v1.2.0",
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

  function now() {
    return Date.now();
  }

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

      return {
        text,
        savedAt,
        expired: savedAt ? now() - savedAt > CACHE_CONFIG.ttl : false
      };
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
        JSON.stringify({
          version: CACHE_CONFIG.version,
          savedAt: now(),
          text
        })
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
        const response = await fetch(url, {
          method: "GET",
          cache: "no-cache"
        });

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
        window.marked.setOptions({
          gfm: true,
          breaks: true
        });
      }

      state.ready = true;
      state.failed = false;

      console.log("[MarkdownRenderPlus] Markdown libraries loaded from CDN/cache.");
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
      return {
        path: raw,
        suffix: ""
      };
    }

    return {
      path: raw.slice(0, cut),
      suffix: raw.slice(cut)
    };
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

      const looksRepoQualified =
        ownerRepo && (
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
      el.setAttribute(
        "src",
        rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir)
      );
    });

    template.content.querySelectorAll("source[src], video[src], audio[src]").forEach(el => {
      el.setAttribute(
        "src",
        rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir)
      );
    });

    template.content.querySelectorAll("video[poster]").forEach(el => {
      el.setAttribute(
        "poster",
        rewriteUrl(el.getAttribute("poster"), "raw", owner, repo, branch, baseDir)
      );
    });

    template.content.querySelectorAll("iframe[src]").forEach(el => {
      el.setAttribute(
        "src",
        rewriteUrl(el.getAttribute("src"), "raw", owner, repo, branch, baseDir)
      );
    });

    template.content.querySelectorAll("[srcset]").forEach(el => {
      el.setAttribute(
        "srcset",
        rewriteSrcset(el.getAttribute("srcset"), owner, repo, branch, baseDir)
      );
    });

    template.content.querySelectorAll("a[href]").forEach(el => {
      el.setAttribute(
        "href",
        rewriteUrl(el.getAttribute("href"), "blob", owner, repo, branch, baseDir)
      );

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
        "p", "br", "hr",
        "a", "img",
        "strong", "em", "b", "i", "u", "s", "del",
        "code", "pre", "blockquote",
        "ul", "ol", "li",
        "table", "thead", "tbody", "tfoot", "tr", "th", "td",
        "div", "span", "section", "article",
        "details", "summary",
        "kbd",
        "video", "audio", "source",
        "iframe"
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "srcset",
        "poster",
        "alt",
        "title",
        "class",
        "id",
        "target",
        "rel",
        "align",
        "width",
        "height",
        "loading",
        "controls",
        "muted",
        "loop",
        "autoplay",
        "playsinline",
        "frameborder",
        "allow",
        "allowfullscreen",
        "sandbox",
        "referrerpolicy",
        "colspan",
        "rowspan"
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

  function fallbackParse(text, owner, repo, branch) {
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
            Markdown 增强解析器正在加载中，本次暂用原解析器显示。
          </div>
          ${fallback}
        `;
      }

      return fallback;
    }

    try {
      const rawHtml = window.marked.parse
        ? window.marked.parse(String(text))
        : window.marked(String(text));

      const rewrittenHtml = rewriteHtmlRelativeAssets(
        rawHtml,
        safeOwner,
        safeRepo,
        safeBranch,
        baseDir
      );

      const cleanHtml = sanitizeMarkdownHtml(rewrittenHtml);

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

  initMarkdownLibs();

  console.log("[MarkdownRenderPlus] Plugin initialized with CDN cache.");
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
