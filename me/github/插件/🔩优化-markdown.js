// ========== 插件：Markdown 优化解析（极速请求）==========
// 功能：
// 1. Markdown 使用 marked + DOMPurify 渲染
// 2. Markdown 图片相对路径自动补全 raw.githubusercontent.com
// 3. Markdown 普通链接自动补全 github.com/.../blob/...
// 4. HTML 图片标签 <img src="assets/a.png"> 自动补全 raw 链接
// 5. HTML 跳转 <a href="docs/a.md"> 自动补全 blob 链接
// 6. 文件夹 README 自动预览修复
// 7. 表格纯灰色，无白色/斑马纹
// 8. AI 输出 Markdown 预览
// 9. 支持 highlight.js / KaTeX / Mermaid 按需加载
// 10. 优化 `行内代码` 自动换行问题，代码块横向滚动

plugin.id = "plugin.markdown.enhanced.fast";
plugin.name = "Markdown 优化解析（极速请求）";
plugin.version = "1.3.7";
plugin.author = "ChatGPT";
plugin.description = ".md / .markdown / README 预览优化，支持 Markdown 与 HTML 图片/链接自动补全，修复行内代码换行。";
plugin.tags = ["markdown优化", "推荐", "marked", "ai", "md", "markdown", "图片路径", "链接补全", "html-img", "代码不换行"];

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  plugin._state = {
    installed: false,
    installing: false,
    ok: false,
    failReason: "",

    oldParseMarkdown: null,

    oldRenderAIOutput: null,
    aiRenderHookInstalled: false,

    oldOpenFile: null,
    openFileHookInstalled: false,

    cdn: {
      ghMarkdownCss: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css",
      hlCss: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css",
      katexCss: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css",

      marked: "https://raw.githubusercontent.com/13244431027yuan/-/refs/heads/main/markdown/marked.min.js",
      dompurify: "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.1/purify.min.js",

      highlight: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js",
      katex: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js",
      katexAuto: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js",
      mermaid: "https://cdn.jsdelivr.net/npm/mermaid@10.2.4/dist/mermaid.min.js"
    },

    cache: {
      enabled: true,
      schema: "mdx-libcache-v4",
      ttlMs: 30 * 24 * 3600 * 1000,
      maxCharsPerLib: 900_000
    },

    optional: {
      hljs: { loading: false, loaded: false },
      katex: { loading: false, loaded: false },
      mermaid: { loading: false, loaded: false }
    },

    observer: null,
    enhanceScheduled: false,
    preconnectDone: false
  };

  plugin._injectPanelThemeCss();
  plugin._ensureInjectedButton();
  plugin._tryAutoInstall();
};

plugin.onHook = (hookName) => {
  if (hookName === "ui:show" || hookName === "mode:switch") {
    plugin._ensureInjectedButton();
  }
};

// ================= 按钮 =================

plugin._ensureInjectedButton = () => {
  const { ui, components, core } = plugin._ctx || {};
  if (!ui || !ui.tabs || !components) return;

  const shouldShow = !!(core && core.mode === "browse");

  let btn = ui.tabs.querySelector('[data-mdx-enhanced-btn="1"]');

  if (!btn) {
    btn = components.createWindowButton("MD极速", {
      background: "rgba(60,160,255,0.18)",
      border: "1px solid rgba(60,160,255,0.26)",
      borderRadius: "10px"
    });

    btn.dataset.mdxEnhancedBtn = "1";

    btn.onclick = async () => {
      if (!plugin._state.installed) {
        await plugin._install(false);

        alert(plugin._state.ok
          ? "Markdown 极速解析已启用。\n图片/跳转链接自动补全已启用。\nHTML <img src> 路径补全已启用。\n文件夹 README 自动预览已修复。\nAI 输出 Markdown 预览已接管。\n`行内代码` 不自动换行已优化。"
          : `启用失败（已回退）：${plugin._state.failReason || "未知原因"}`);

        return;
      }

      const act = prompt(
        "已启用：\n1) 关闭接管\n2) 清空本地库缓存\n3) 立即预加载可选库\n其它取消",
        "1"
      );

      if (act === "1") {
        plugin._uninstall();
        alert("已恢复为原解析器。");
      } else if (act === "2") {
        plugin._clearLibCache();
        alert("已清空本地库缓存。");
      } else if (act === "3") {
        plugin._preloadOptionalInIdle();
        alert("已安排空闲时预加载可选库。");
      }
    };

    ui.tabs.appendChild(btn);
  }

  btn.style.display = shouldShow ? "" : "none";
};

// ================= 安装 / 卸载 =================

plugin._tryAutoInstall = async () => {
  await plugin._install(true);
};

plugin._install = async (silent) => {
  if (plugin._state.installing) return;
  plugin._state.installing = true;

  try {
    const { utils } = plugin._ctx || {};
    if (!utils) throw new Error("上下文缺失：utils 不存在");
    if (plugin._state.installed) return;

    if (!plugin._state.oldParseMarkdown) {
      plugin._state.oldParseMarkdown = utils.parseMarkdown;
    }

    plugin._preconnect();
    await plugin._loadRequiredFast();

    plugin._injectPanelThemeCss();
    plugin._ensureObserver();
    plugin._preloadOptionalInIdle();

    utils.parseMarkdown = (text, owner, repo, branch) =>
      plugin._enhancedParseMarkdown(text, owner, repo, branch);

    plugin._installAIOutputHook();
    plugin._installOpenFileHook();

    plugin._state.installed = true;
    plugin._state.ok = true;
    plugin._state.failReason = "";
  } catch (e) {
    plugin._state.ok = false;
    plugin._state.failReason = e?.message || String(e);

    try {
      const { utils } = plugin._ctx || {};
      if (utils && plugin._state.oldParseMarkdown) {
        utils.parseMarkdown = plugin._state.oldParseMarkdown;
      }
    } catch {}

    try { plugin._uninstallAIOutputHook(); } catch {}
    try { plugin._uninstallOpenFileHook(); } catch {}

    if (!silent) console.error("[MDX Fast] install failed:", e);
  } finally {
    plugin._state.installing = false;
  }
};

plugin._uninstall = () => {
  const { utils } = plugin._ctx || {};

  if (utils && plugin._state.oldParseMarkdown) {
    utils.parseMarkdown = plugin._state.oldParseMarkdown;
  }

  plugin._uninstallAIOutputHook();
  plugin._uninstallOpenFileHook();

  try {
    if (plugin._state.observer) {
      plugin._state.observer.disconnect();
      plugin._state.observer = null;
    }
  } catch {}

  plugin._state.installed = false;
  plugin._state.ok = false;
};

// ================= AI 输出 Hook =================

plugin._installAIOutputHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (plugin._state.aiRenderHookInstalled) return;
  if (typeof ext._renderAIOutput !== "function") return;

  if (!plugin._state.oldRenderAIOutput) {
    plugin._state.oldRenderAIOutput = ext._renderAIOutput;
  }

  ext._renderAIOutput = function () {
    try {
      plugin._state.oldRenderAIOutput &&
        plugin._state.oldRenderAIOutput.call(this);
    } catch {}

    const ui = this?.ui;
    const core = this?.core;
    if (!ui || !ui.aiOutputPre || !core || !core.aiManager) return;

    const pre = ui.aiOutputPre;

    const err = core.aiManager.streamError
      ? `\n\n[Error]\n${core.aiManager.streamError}\n`
      : "";

    const tail = core.aiManager.isStreaming
      ? "\n\n(Streaming...)"
      : "";

    const raw = (core.aiManager.streamBuffer || "") + err + tail;

    try {
      const utils = plugin._ctx?.utils;
      if (utils && typeof utils.parseMarkdown === "function") {
        pre.style.whiteSpace = "normal";
        pre.innerHTML = utils.parseMarkdown(
          raw,
          core.currentOwner,
          core.currentRepo,
          core.currentBranch
        ) || "";
      } else {
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = raw;
      }
    } catch {
      pre.style.whiteSpace = "pre-wrap";
      pre.textContent = raw;
    }

    try { plugin._scheduleEnhance(); } catch {}

    try {
      const wrap = pre.parentElement;
      if (wrap) wrap.scrollTop = wrap.scrollHeight;
    } catch {}
  };

  plugin._state.aiRenderHookInstalled = true;
};

plugin._uninstallAIOutputHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (!plugin._state.aiRenderHookInstalled) return;

  if (
    plugin._state.oldRenderAIOutput &&
    typeof plugin._state.oldRenderAIOutput === "function"
  ) {
    ext._renderAIOutput = plugin._state.oldRenderAIOutput;
  }

  plugin._state.aiRenderHookInstalled = false;
};

// ================= 文件打开 Hook =================

plugin._isMarkdownFile = (fileLike) => {
  const name = String(fileLike?.name || "").toLowerCase();
  if (!name) return false;
  if (name === "readme") return true;
  if (name.endsWith(".md")) return true;
  if (name.endsWith(".markdown")) return true;
  return false;
};

plugin._installOpenFileHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (plugin._state.openFileHookInstalled) return;
  if (typeof ext.openFile !== "function") return;

  if (!plugin._state.oldOpenFile) {
    plugin._state.oldOpenFile = ext.openFile;
  }

  ext.openFile = async function (file) {
    await plugin._state.oldOpenFile.call(this, file);

    if (!plugin._isMarkdownFile(file)) return;

    const refs = this?.ui?.fileViewRefs;
    const core = this?.core;
    if (!refs || !core) return;

    const pre = refs.pre;
    const textarea = refs.textarea || this?.ui?.editorTextarea;
    if (!pre) return;

    const text = String(textarea?.value || pre?.textContent || "");

    try {
      const utils = plugin._ctx?.utils;
      if (utils && typeof utils.parseMarkdown === "function") {
        pre.style.whiteSpace = "normal";
        pre.innerHTML = utils.parseMarkdown(
          text,
          core.currentOwner,
          core.currentRepo,
          core.currentBranch
        );
      } else {
        pre.style.whiteSpace = "pre-wrap";
        pre.textContent = text;
      }
    } catch {
      pre.style.whiteSpace = "pre-wrap";
      pre.textContent = text;
    }

    try {
      core.isMarkdownPreview = true;
    } catch {}

    try { plugin._scheduleEnhance(); } catch {}
  };

  plugin._state.openFileHookInstalled = true;
};

plugin._uninstallOpenFileHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (!plugin._state.openFileHookInstalled) return;

  if (
    plugin._state.oldOpenFile &&
    typeof plugin._state.oldOpenFile === "function"
  ) {
    ext.openFile = plugin._state.oldOpenFile;
  }

  plugin._state.openFileHookInstalled = false;
};

// ================= 资源加载 =================

plugin._preconnect = () => {
  if (plugin._state.preconnectDone) return;
  plugin._state.preconnectDone = true;

  const urls = [
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
    "https://raw.githubusercontent.com"
  ];

  for (const base of urls) {
    try {
      const dns = document.createElement("link");
      dns.rel = "dns-prefetch";
      dns.href = base;
      document.head.appendChild(dns);
    } catch {}

    try {
      const pc = document.createElement("link");
      pc.rel = "preconnect";
      pc.href = base;
      pc.crossOrigin = "anonymous";
      document.head.appendChild(pc);
    } catch {}
  }
};

plugin._cacheKey = (name, url) =>
  `${plugin._state.cache.schema}:${name}:${url}`;

plugin._getCachedLib = (name, url) => {
  try {
    if (!plugin._state.cache.enabled) return null;

    const raw = localStorage.getItem(plugin._cacheKey(name, url));
    if (!raw) return null;

    const obj = JSON.parse(raw);
    if (!obj || obj.v !== plugin.version) return null;

    if (obj.exp && Date.now() > obj.exp) {
      localStorage.removeItem(plugin._cacheKey(name, url));
      return null;
    }

    return typeof obj.code === "string" && obj.code ? obj.code : null;
  } catch {
    return null;
  }
};

plugin._setCachedLib = (name, url, code) => {
  try {
    if (!plugin._state.cache.enabled) return false;
    if (typeof code !== "string" || !code) return false;
    if (code.length > plugin._state.cache.maxCharsPerLib) return false;

    const obj = {
      v: plugin.version,
      exp: Date.now() + plugin._state.cache.ttlMs,
      code
    };

    localStorage.setItem(plugin._cacheKey(name, url), JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

plugin._clearLibCache = () => {
  const prefix = `${plugin._state.cache.schema}:`;
  const del = [];

  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) del.push(k);
  }

  del.forEach(k => localStorage.removeItem(k));
};

plugin._injectInlineScript = (id, code) => new Promise((resolve, reject) => {
  try {
    const s = document.createElement("script");
    s.id = id;
    s.type = "text/javascript";
    s.text = code;
    document.head.appendChild(s);
    resolve();
  } catch (e) {
    reject(e);
  }
});

plugin._loadScriptSrc = (id, src) => new Promise((resolve, reject) => {
  if (document.getElementById(id)) return resolve();

  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  s.onload = resolve;
  s.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
  document.head.appendChild(s);
});

plugin._loadScriptFast = async (id, url) => {
  if (document.getElementById(id)) return;

  const cached = plugin._getCachedLib(id, url);

  if (cached) {
    try {
      await plugin._injectInlineScript(id, cached);
      return;
    } catch {
      return plugin._loadScriptSrc(id, url);
    }
  }

  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const code = await res.text();

    try {
      await plugin._injectInlineScript(id, code);
      plugin._setCachedLib(id, url, code);
      return;
    } catch {
      return plugin._loadScriptSrc(id, url);
    }
  } catch {
    return plugin._loadScriptSrc(id, url);
  }
};

plugin._loadCssOnce = (id, href) => new Promise((resolve, reject) => {
  if (!href) return resolve();
  if (document.getElementById(id)) return resolve();

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  link.onload = resolve;
  link.onerror = () => reject(new Error(`CSS 加载失败: ${href}`));
  document.head.appendChild(link);
});

plugin._loadRequiredFast = async () => {
  await plugin._loadCssOnce(
    "mdx-gh-markdown-css",
    plugin._state.cdn.ghMarkdownCss
  );

  await Promise.all([
    plugin._loadScriptFast("mdx-marked", plugin._state.cdn.marked),
    plugin._loadScriptFast("mdx-dompurify", plugin._state.cdn.dompurify)
  ]);

  if (!window.marked) throw new Error("marked 未加载");
  if (!window.DOMPurify) throw new Error("DOMPurify 未加载");
};

plugin._idle = (fn) => {
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") ric(fn, { timeout: 1500 });
  else setTimeout(fn, 0);
};

plugin._preloadOptionalInIdle = () => {
  plugin._idle(async () => {
    try { await plugin._ensureHljs(); } catch {}
    try { await plugin._ensureKatex(); } catch {}
    try { await plugin._ensureMermaid(); } catch {}
  });
};

plugin._ensureHljs = async () => {
  const st = plugin._state.optional.hljs;
  if (st.loaded || st.loading) return;

  st.loading = true;

  try {
    await plugin._loadCssOnce("mdx-hljs-css", plugin._state.cdn.hlCss);
    await plugin._loadScriptFast("mdx-hljs", plugin._state.cdn.highlight);
    st.loaded = !!window.hljs;
  } finally {
    st.loading = false;
  }
};

plugin._ensureKatex = async () => {
  const st = plugin._state.optional.katex;
  if (st.loaded || st.loading) return;

  st.loading = true;

  try {
    await plugin._loadCssOnce("mdx-katex-css", plugin._state.cdn.katexCss);
    await plugin._loadScriptFast("mdx-katex", plugin._state.cdn.katex);
    await plugin._loadScriptFast("mdx-katex-auto", plugin._state.cdn.katexAuto);

    st.loaded =
      !!window.katex &&
      typeof window.renderMathInElement === "function";
  } finally {
    st.loading = false;
  }
};

plugin._ensureMermaid = async () => {
  const st = plugin._state.optional.mermaid;
  if (st.loaded || st.loading) return;

  st.loading = true;

  try {
    await plugin._loadScriptFast("mdx-mermaid", plugin._state.cdn.mermaid);

    if (window.mermaid) {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose"
        });
      } catch {}
    }

    st.loaded =
      !!window.mermaid &&
      typeof window.mermaid.render === "function";
  } finally {
    st.loading = false;
  }
};

// ================= CSS =================

plugin._injectPanelThemeCss = () => {
  try {
    const old1 = document.getElementById("mdx-fast-panel-theme");
    if (old1) old1.remove();

    const old2 = document.getElementById("mdx-fast-panel-theme-fixed");
    if (old2) old2.remove();
  } catch {}

  const style = document.createElement("style");
  style.id = "mdx-fast-panel-theme-fixed";

  style.textContent = `
.mdx-enhanced-root {
  color: rgba(255,255,255,0.92) !important;
  background: transparent !important;
  background-color: transparent !important;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color-scheme: dark;
  --color-canvas-default: transparent !important;
  --color-canvas-subtle: #555 !important;
  --color-border-default: rgba(255,255,255,0.18) !important;
  --color-border-muted: rgba(255,255,255,0.14) !important;
  --color-fg-default: rgba(255,255,255,0.92) !important;
  --color-fg-muted: rgba(255,255,255,0.75) !important;
}

.mdx-enhanced-root,
.mdx-enhanced-root * {
  border-color: rgba(255,255,255,0.14) !important;
  box-sizing: border-box;
}

.mdx-enhanced-root a {
  color: #8af !important;
  text-decoration: none;
}

.mdx-enhanced-root a:hover {
  text-decoration: underline;
}

.mdx-enhanced-root h1,
.mdx-enhanced-root h2,
.mdx-enhanced-root h3,
.mdx-enhanced-root h4,
.mdx-enhanced-root h5,
.mdx-enhanced-root h6 {
  color: rgba(255,255,255,0.96) !important;
}

.mdx-enhanced-root h1,
.mdx-enhanced-root h2 {
  border-bottom: 1px solid rgba(255,255,255,0.14) !important;
  padding-bottom: 4px;
}

.mdx-enhanced-root blockquote {
  background: rgba(255,255,255,0.04) !important;
  background-color: rgba(255,255,255,0.04) !important;
  border-left: 4px solid rgba(255,255,255,0.22) !important;
  color: rgba(255,255,255,0.84) !important;
  padding: 8px 10px;
  border-radius: 8px;
}

.mdx-enhanced-root hr {
  border: none !important;
  border-top: 1px solid rgba(255,255,255,0.14) !important;
}

/* ================= 表格纯灰 ================= */

.mdx-enhanced-root table,
.markdown-body.mdx-enhanced-root table {
  width: 100% !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  background: #555 !important;
  background-color: #555 !important;
  background-image: none !important;
  border: 1px solid rgba(255,255,255,0.18) !important;
  border-radius: 10px !important;
  overflow: hidden !important;
}

.mdx-enhanced-root table thead,
.mdx-enhanced-root table tbody,
.mdx-enhanced-root table tr,
.mdx-enhanced-root table th,
.mdx-enhanced-root table td,
.markdown-body.mdx-enhanced-root table thead,
.markdown-body.mdx-enhanced-root table tbody,
.markdown-body.mdx-enhanced-root table tr,
.markdown-body.mdx-enhanced-root table th,
.markdown-body.mdx-enhanced-root table td {
  background: #555 !important;
  background-color: #555 !important;
  background-image: none !important;
  color: rgba(255,255,255,0.92) !important;
}

.mdx-enhanced-root table tr:nth-child(2n),
.mdx-enhanced-root table tr:nth-child(odd),
.mdx-enhanced-root table tr:nth-child(even),
.markdown-body.mdx-enhanced-root table tr:nth-child(2n),
.markdown-body.mdx-enhanced-root table tr:nth-child(odd),
.markdown-body.mdx-enhanced-root table tr:nth-child(even) {
  background: #555 !important;
  background-color: #555 !important;
  background-image: none !important;
}

.mdx-enhanced-root table th {
  font-weight: 700 !important;
}

.mdx-enhanced-root table th,
.mdx-enhanced-root table td {
  border: 1px solid rgba(255,255,255,0.18) !important;
  padding: 8px 10px !important;
  min-width: 80px;
}

/* ================= 行内代码：不自动换行 ================= */

.mdx-enhanced-root code {
  background: rgba(255,255,255,0.08) !important;
  background-color: rgba(255,255,255,0.08) !important;
  color: rgba(255,255,255,0.92) !important;
  border-radius: 6px;
  padding: 0.1em 0.35em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
}

/* 关键修复：\`行内代码\` 不换行 */
.mdx-enhanced-root :not(pre) > code {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  display: inline;
}

/* 防止 GitHub markdown CSS 或外部样式强制打断行内代码 */
.mdx-enhanced-root p code,
.mdx-enhanced-root li code,
.mdx-enhanced-root td code,
.mdx-enhanced-root th code,
.mdx-enhanced-root blockquote code,
.mdx-enhanced-root h1 code,
.mdx-enhanced-root h2 code,
.mdx-enhanced-root h3 code,
.mdx-enhanced-root h4 code,
.mdx-enhanced-root h5 code,
.mdx-enhanced-root h6 code,
.mdx-enhanced-root a code,
.mdx-enhanced-root span code {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
}

/* ================= 代码块：横向滚动，不强制换行 ================= */

.mdx-enhanced-root pre {
  background: rgba(0,0,0,0.35) !important;
  background-color: rgba(0,0,0,0.35) !important;
  border: 1px solid rgba(255,255,255,0.14) !important;
  border-radius: 10px;
  padding: 10px 12px;
  overflow-x: auto !important;
  overflow-y: auto;
  max-width: 100%;
  white-space: pre !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
}

.mdx-enhanced-root pre code {
  display: block !important;
  background: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  white-space: pre !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
  min-width: max-content;
}

.mdx-enhanced-root .hljs {
  background: transparent !important;
  background-color: transparent !important;
  color: rgba(255,255,255,0.92) !important;
  white-space: pre !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
}

/* ================= 其他 ================= */

.mdx-enhanced-root img,
.mdx-enhanced-root video {
  border-radius: 8px;
  max-width: 100%;
}

.mdx-enhanced-root .katex {
  color: rgba(255,255,255,0.92) !important;
}

.mdx-enhanced-root .mermaid {
  background: rgba(255,255,255,0.03) !important;
  background-color: rgba(255,255,255,0.03) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  border-radius: 10px;
  padding: 10px;
  overflow: auto;
}
`.trim();

  document.head.appendChild(style);
};

// ================= 仓库上下文兜底 =================

plugin._getMdxRepoContext = (owner, repo, branch) => {
  const core = plugin._ctx?.core || {};

  const finalOwner = String(
    owner ||
    core.currentOwner ||
    ""
  ).trim();

  const finalRepo = String(
    repo ||
    core.currentRepo ||
    ""
  ).trim();

  const finalBranch = String(
    branch ||
    core.currentBranch ||
    core.defaultBranch ||
    "main"
  ).trim();

  return {
    owner: finalOwner,
    repo: finalRepo,
    branch: finalBranch || "main"
  };
};

// ================= 路径工具 =================

plugin._isMdxExternalUrl = (url) => {
  const u = String(url || "").trim();
  if (!u) return true;

  if (u.startsWith("#")) return true;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return true;
  if (u.startsWith("//")) return true;

  return false;
};

plugin._splitMdxUrlSuffix = (url) => {
  const s = String(url || "");
  const q = s.search(/[?#]/);

  if (q < 0) return { path: s, suffix: "" };

  return {
    path: s.slice(0, q),
    suffix: s.slice(q)
  };
};

plugin._parseMdxTargetWithTitle = (rawTarget) => {
  const raw = String(rawTarget || "").trim();

  if (raw.startsWith("<") && raw.endsWith(">")) {
    return {
      url: raw.slice(1, -1).trim(),
      title: "",
      wrappedByAngle: true
    };
  }

  const m = raw.match(/^(\S+)(\s+["'][\s\S]*["'])$/);

  if (m) {
    return {
      url: m[1],
      title: m[2] || "",
      wrappedByAngle: false
    };
  }

  return {
    url: raw,
    title: "",
    wrappedByAngle: false
  };
};

plugin._buildMdxTargetWithTitle = (url, title, wrappedByAngle) => {
  const u = wrappedByAngle ? `<${url}>` : url;
  return `${u}${title || ""}`;
};

plugin._getCurrentMarkdownBaseDir = () => {
  const core = plugin._ctx?.core;

  let baseDir = String(core?.currentPath || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  if (/\.[a-zA-Z0-9]{1,16}$/.test(baseDir)) {
    baseDir = baseDir.split("/").slice(0, -1).join("/");
  }

  return baseDir;
};

plugin._normalizeRepoPath = (inputPath, owner, repo, branch, baseDir) => {
  let raw = String(inputPath || "").trim();

  if (raw.startsWith("<") && raw.endsWith(">")) {
    raw = raw.slice(1, -1).trim();
  }

  const { path, suffix } = plugin._splitMdxUrlSuffix(raw);

  let p = String(path || "")
    .replace(/\\/g, "/")
    .trim();

  if (!p) return "";

  const absoluteFromRepoRoot = p.startsWith("/");

  p = p.replace(/^\/+/, "");
  p = p.replace(/^\.\/+/, "");

  const safeOwner = String(owner || "").trim();
  const safeRepo = String(repo || "").trim();

  let parts = p.split("/").filter(Boolean);

  // owner/repo/path
  if (
    parts.length >= 3 &&
    parts[0].toLowerCase() === safeOwner.toLowerCase() &&
    parts[1].toLowerCase() === safeRepo.toLowerCase()
  ) {
    p = parts.slice(2).join("/");
  }

  parts = p.split("/").filter(Boolean);

  // owner/repo/blob/branch/path
  if (
    parts.length >= 5 &&
    parts[0].toLowerCase() === safeOwner.toLowerCase() &&
    parts[1].toLowerCase() === safeRepo.toLowerCase() &&
    /^(blob|raw|tree)$/i.test(parts[2])
  ) {
    p = parts.slice(4).join("/");
  }

  parts = p.split("/").filter(Boolean);

  // blob/branch/path
  if (
    parts.length >= 3 &&
    /^(blob|raw|tree)$/i.test(parts[0])
  ) {
    p = parts.slice(2).join("/");
  }

  parts = p.split("/").filter(Boolean);

  // refs/heads/main/path
  if (
    parts.length >= 4 &&
    parts[0] === "refs" &&
    parts[1] === "heads"
  ) {
    p = parts.slice(3).join("/");
  }

  baseDir = String(baseDir || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

  const alreadyStartsWithBase =
    baseDir &&
    (
      p === baseDir ||
      p.startsWith(baseDir + "/")
    );

  if (!absoluteFromRepoRoot && baseDir && !alreadyStartsWithBase) {
    p = `${baseDir}/${p}`;
  }

  const stack = [];

  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;

    if (seg === "..") {
      stack.pop();
    } else {
      stack.push(seg);
    }
  }

  return stack.join("/") + suffix;
};

plugin._encodeRepoPathForUrl = (repoPath) => {
  const { path, suffix } = plugin._splitMdxUrlSuffix(repoPath);

  const encodedPath = String(path || "")
    .split("/")
    .map(seg => encodeURIComponent(seg))
    .join("/");

  return encodedPath + suffix;
};

plugin._toRawGitHubUrl = (repoPath, owner, repo, branch) => {
  const b = encodeURIComponent(branch || "main");
  const p = plugin._encodeRepoPathForUrl(repoPath);
  return `https://raw.githubusercontent.com/${owner}/${repo}/${b}/${p}`;
};

plugin._toGitHubBlobUrl = (repoPath, owner, repo, branch) => {
  const b = encodeURIComponent(branch || "main");
  const p = plugin._encodeRepoPathForUrl(repoPath);
  return `https://github.com/${owner}/${repo}/blob/${b}/${p}`;
};

// ================= HTML 标签 src/href 优化 =================

plugin._rewriteSrcset = (srcset, ctx, baseDir) => {
  return String(srcset || "")
    .split(",")
    .map(part => {
      const raw = part.trim();
      if (!raw) return raw;

      const pieces = raw.split(/\s+/);
      const url = pieces.shift();

      if (!url || plugin._isMdxExternalUrl(url)) return raw;

      const repoPath = plugin._normalizeRepoPath(
        url,
        ctx.owner,
        ctx.repo,
        ctx.branch,
        baseDir
      );

      if (!repoPath) return raw;

      const finalUrl = plugin._toRawGitHubUrl(
        repoPath,
        ctx.owner,
        ctx.repo,
        ctx.branch
      );

      return [finalUrl, ...pieces].join(" ");
    })
    .join(", ");
};

plugin._rewriteHtmlRelativeAttrs = (htmlText, owner, repo, branch) => {
  if (!htmlText) return htmlText;

  const ctx = plugin._getMdxRepoContext(owner, repo, branch);
  if (!ctx.owner || !ctx.repo) return htmlText;

  const baseDir = plugin._getCurrentMarkdownBaseDir();

  const rewriteOne = (value, mode) => {
    const raw = String(value || "").trim();

    if (!raw) return raw;
    if (plugin._isMdxExternalUrl(raw)) return raw;

    const repoPath = plugin._normalizeRepoPath(
      raw,
      ctx.owner,
      ctx.repo,
      ctx.branch,
      baseDir
    );

    if (!repoPath) return raw;

    if (mode === "raw") {
      return plugin._toRawGitHubUrl(
        repoPath,
        ctx.owner,
        ctx.repo,
        ctx.branch
      );
    }

    return plugin._toGitHubBlobUrl(
      repoPath,
      ctx.owner,
      ctx.repo,
      ctx.branch
    );
  };

  let out = String(htmlText);

  // img/source/audio/video/iframe src => raw
  out = out.replace(
    /<(img|source|audio|video|iframe)\b([^>]*?)\s(src)=["']([^"']+)["']([^>]*)>/gi,
    (match, tag, before, attr, value, after) => {
      return `<${tag}${before} ${attr}="${rewriteOne(value, "raw")}"${after}>`;
    }
  );

  // img/source srcset => raw
  out = out.replace(
    /<(img|source)\b([^>]*?)\s(srcset)=["']([^"']+)["']([^>]*)>/gi,
    (match, tag, before, attr, value, after) => {
      return `<${tag}${before} ${attr}="${plugin._rewriteSrcset(value, ctx, baseDir)}"${after}>`;
    }
  );

  // video poster => raw
  out = out.replace(
    /<(video)\b([^>]*?)\s(poster)=["']([^"']+)["']([^>]*)>/gi,
    (match, tag, before, attr, value, after) => {
      return `<${tag}${before} ${attr}="${rewriteOne(value, "raw")}"${after}>`;
    }
  );

  // a href => blob
  out = out.replace(
    /<(a)\b([^>]*?)\s(href)=["']([^"']+)["']([^>]*)>/gi,
    (match, tag, before, attr, value, after) => {
      return `<${tag}${before} ${attr}="${rewriteOne(value, "blob")}"${after}>`;
    }
  );

  return out;
};

// ================= Markdown 图片/链接优化 =================

plugin._rewriteRelativeAssets = (mdText, owner, repo, branch) => {
  if (!mdText) return mdText;

  const ctx = plugin._getMdxRepoContext(owner, repo, branch);
  if (!ctx.owner || !ctx.repo) return mdText;

  let text = String(mdText || "");

  // 先处理 HTML 标签，例如：
  // <img src="assets/image.png">
  // <a href="docs/readme.md">
  text = plugin._rewriteHtmlRelativeAttrs(
    text,
    ctx.owner,
    ctx.repo,
    ctx.branch
  );

  const baseDir = plugin._getCurrentMarkdownBaseDir();

  const imageTokens = [];

  // Markdown 图片
  text = text.replace(/!\[([^\]]*)\]\(([^)\n]+)\)/g, (match, alt, rawTarget) => {
    const parsed = plugin._parseMdxTargetWithTitle(rawTarget);
    const url = parsed.url;

    if (plugin._isMdxExternalUrl(url)) {
      const token = `\uE000MDX_IMG_${imageTokens.length}\uE000`;
      imageTokens.push(match);
      return token;
    }

    const repoPath = plugin._normalizeRepoPath(
      url,
      ctx.owner,
      ctx.repo,
      ctx.branch,
      baseDir
    );

    if (!repoPath) {
      const token = `\uE000MDX_IMG_${imageTokens.length}\uE000`;
      imageTokens.push(match);
      return token;
    }

    const finalUrl = plugin._toRawGitHubUrl(
      repoPath,
      ctx.owner,
      ctx.repo,
      ctx.branch
    );

    const finalTarget = plugin._buildMdxTargetWithTitle(
      finalUrl,
      parsed.title,
      parsed.wrappedByAngle
    );

    const rewritten = `![${alt}](${finalTarget})`;

    const token = `\uE000MDX_IMG_${imageTokens.length}\uE000`;
    imageTokens.push(rewritten);
    return token;
  });

  // Markdown 普通链接
  text = text.replace(/\[([^\]]+)\]\(([^)\n]+)\)/g, (match, label, rawTarget) => {
    const parsed = plugin._parseMdxTargetWithTitle(rawTarget);
    const url = parsed.url;

    if (plugin._isMdxExternalUrl(url)) return match;

    const repoPath = plugin._normalizeRepoPath(
      url,
      ctx.owner,
      ctx.repo,
      ctx.branch,
      baseDir
    );

    if (!repoPath) return match;

    const finalUrl = plugin._toGitHubBlobUrl(
      repoPath,
      ctx.owner,
      ctx.repo,
      ctx.branch
    );

    const finalTarget = plugin._buildMdxTargetWithTitle(
      finalUrl,
      parsed.title,
      parsed.wrappedByAngle
    );

    return `[${label}](${finalTarget})`;
  });

  text = text.replace(/\uE000MDX_IMG_(\d+)\uE000/g, (_, i) => {
    return imageTokens[Number(i)] || "";
  });

  return text;
};

// ================= Markdown 解析 =================

plugin._enhancedParseMarkdown = (text, owner, repo, branch) => {
  const old = plugin._state.oldParseMarkdown;
  const ctx = plugin._getMdxRepoContext(owner, repo, branch);

  try {
    if (!window.marked || !window.DOMPurify) {
      return old
        ? old(text, ctx.owner, ctx.repo, ctx.branch)
        : String(text || "");
    }

    const md = plugin._rewriteRelativeAssets(
      String(text || ""),
      ctx.owner,
      ctx.repo,
      ctx.branch
    );

    try {
      window.marked.setOptions({
        gfm: true,
        breaks: false,
        headerIds: false,
        mangle: false
      });
    } catch {}

    const rawHtml = window.marked.parse(md);

    const clean = window.DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true }
    });

    const needMermaid =
      /```mermaid|language-mermaid|<div class="mermaid"/i.test(md) ||
      /language-mermaid/i.test(clean);

    const needKatex =
      /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\(|\\\[/.test(md);

    const needHljs =
      /```/.test(md) ||
      /<pre><code/.test(clean);

    if (needHljs) {
      plugin._ensureHljs().then(() => plugin._scheduleEnhance());
    }

    if (needKatex) {
      plugin._ensureKatex().then(() => plugin._scheduleEnhance());
    }

    if (needMermaid) {
      plugin._ensureMermaid().then(() => plugin._scheduleEnhance());
    }

    const html = `
<article class="markdown-body mdx-enhanced-root" data-mdx-enhanced="1" style="padding: 8px 2px;">
${clean}
</article>
    `.trim();

    plugin._scheduleEnhance();

    return html;
  } catch {
    try {
      return old
        ? old(text, ctx.owner, ctx.repo, ctx.branch)
        : String(text || "");
    } catch {
      return String(text || "");
    }
  }
};

// ================= 后处理增强 =================

plugin._scheduleEnhance = () => {
  if (plugin._state.enhanceScheduled) return;

  plugin._state.enhanceScheduled = true;

  Promise.resolve().then(() => {
    plugin._state.enhanceScheduled = false;
    plugin._enhanceAll();
  });
};

plugin._ensureObserver = () => {
  if (plugin._state.observer) return;

  const obs = new MutationObserver(() => {
    plugin._scheduleEnhance();
  });

  obs.observe(document.body, {
    childList: true,
    subtree: true
  });

  plugin._state.observer = obs;
};

plugin._enhanceAll = async () => {
  const roots = Array.from(
    document.querySelectorAll(".mdx-enhanced-root[data-mdx-enhanced='1']")
  );

  for (const root of roots) {
    if (root.dataset._mdxDone === "1") continue;

    root.dataset._mdxDone = "1";

    try {
      await plugin._enhanceOne(root);
    } catch {
      root.dataset._mdxDone = "0";
    }
  }
};

plugin._enhanceOne = async (root) => {
  if (window.hljs) {
    root.querySelectorAll("pre code").forEach((b) => {
      try {
        window.hljs.highlightElement(b);
      } catch {}
    });
  }

  if (typeof window.renderMathInElement === "function") {
    try {
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    } catch {}
  }

  if (window.mermaid && typeof window.mermaid.render === "function") {
    await plugin._renderMermaidIn(root);
  }
};

plugin._renderMermaidIn = async (root) => {
  const blocks = Array.from(
    root.querySelectorAll(
      "pre code.language-mermaid, code.language-mermaid, div.mermaid"
    )
  );

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.dataset && block.dataset._mdMermaidDone === "1") continue;
    if (block.dataset) block.dataset._mdMermaidDone = "1";

    const code = (block.textContent || "").trim();
    if (!code) continue;

    try {
      const id = `mdx-mermaid-${Date.now()}-${Math.random().toString(16).slice(2)}-${i}`;
      const out = await window.mermaid.render(id, code);

      const container = document.createElement("div");
      container.className = "mermaid";
      container.innerHTML = out.svg;

      (block.closest("pre") || block).replaceWith(container);
    } catch {}
  }
};
// ============================================================
// ========== Markdown 优化解析：右侧标题树目录补丁 ==========
// 版本建议：1.3.8
// 功能：
// 1. 自动生成 h1~h6 标题树
// 2. h6 折叠到 h5，h5 折叠到 h4，以此类推
// 3. 点击目录项平滑滚动到标题
// 4. 超过 10 个标题时目录独立滚动
// 5. 右侧目录可最小化
// 6. 支持 Markdown 文件 / README / AI 输出 Markdown
// ============================================================

plugin.version = "1.3.8";
plugin.description = ".md / .markdown / README 预览优化，支持图片/链接补全、AI Markdown 预览、标题树目录。";

plugin._mdxTocPatchInstalled = false;

plugin._oldInitForToc = plugin.init;

plugin.init = (ctx) => {
  if (typeof plugin._oldInitForToc === "function") {
    plugin._oldInitForToc(ctx);
  }

  plugin._installHeadingTocPatch();
};

plugin._installHeadingTocPatch = () => {
  if (plugin._mdxTocPatchInstalled) return;
  plugin._mdxTocPatchInstalled = true;

  plugin._injectHeadingTocCss();

  const oldEnhanceOne = plugin._enhanceOne;

  plugin._enhanceOne = async function (root) {
    try {
      plugin._buildHeadingToc(root);
    } catch (e) {
      console.warn("[MDX TOC] build failed:", e);
    }

    if (typeof oldEnhanceOne === "function") {
      return await oldEnhanceOne.call(plugin, root);
    }
  };
};

// ================= 目录 CSS =================

plugin._injectHeadingTocCss = () => {
  try {
    const old = document.getElementById("mdx-heading-toc-css");
    if (old) old.remove();
  } catch {}

  const style = document.createElement("style");
  style.id = "mdx-heading-toc-css";

  style.textContent = `
/* ================= 右侧标题树目录 ================= */

.mdx-enhanced-root.mdx-has-toc {
  position: relative;
}

.mdx-toc-panel {
  float: right;
  width: 230px;
  max-width: 42%;
  margin: 0 0 12px 16px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(0,0,0,0.30);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  color: rgba(255,255,255,0.9);
  font-size: 12px;
  line-height: 1.35;
  overflow: hidden;
  z-index: 2;
}

.mdx-toc-panel.mdx-toc-sticky {
  position: sticky;
  top: 8px;
}

.mdx-toc-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 9px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  user-select: none;
}

.mdx-toc-title {
  font-weight: 800;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mdx-toc-count {
  opacity: 0.62;
  font-size: 11px;
}

.mdx-toc-min-btn {
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-radius: 7px;
  padding: 1px 6px;
  cursor: pointer;
  font-size: 12px;
}

.mdx-toc-min-btn:hover {
  background: rgba(255,255,255,0.16);
}

.mdx-toc-body {
  padding: 7px 6px 8px 6px;
}

.mdx-toc-panel.mdx-toc-scroll .mdx-toc-body {
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
}

.mdx-toc-panel.mdx-toc-minimized {
  width: 118px;
}

.mdx-toc-panel.mdx-toc-minimized .mdx-toc-body,
.mdx-toc-panel.mdx-toc-minimized .mdx-toc-count {
  display: none;
}

.mdx-toc-tree,
.mdx-toc-tree ul {
  list-style: none !important;
  margin: 0 !important;
  padding-left: 0 !important;
}

.mdx-toc-tree ul {
  padding-left: 12px !important;
  border-left: 1px dashed rgba(255,255,255,0.12);
  margin-left: 6px !important;
}

.mdx-toc-node {
  margin: 2px 0;
}

.mdx-toc-row {
  display: flex;
  align-items: center;
  gap: 3px;
  min-height: 22px;
  border-radius: 7px;
  padding: 2px 4px;
}

.mdx-toc-row:hover {
  background: rgba(255,255,255,0.08);
}

.mdx-toc-toggle {
  width: 14px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  opacity: 0.75;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 10px;
  transition: transform 0.15s ease;
}

.mdx-toc-toggle.mdx-toc-empty {
  opacity: 0.18;
  cursor: default;
}

.mdx-toc-link {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  color: rgba(255,255,255,0.86) !important;
  text-decoration: none !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mdx-toc-link:hover {
  color: #9cf !important;
}

.mdx-toc-node.mdx-toc-collapsed > ul {
  display: none !important;
}

.mdx-toc-node.mdx-toc-collapsed > .mdx-toc-row > .mdx-toc-toggle {
  transform: rotate(-90deg);
}

.mdx-toc-level-1 > .mdx-toc-row .mdx-toc-link {
  font-weight: 800;
}

.mdx-toc-level-2 > .mdx-toc-row .mdx-toc-link {
  font-weight: 700;
}

.mdx-toc-level-3 > .mdx-toc-row .mdx-toc-link {
  opacity: 0.92;
}

.mdx-toc-level-4 > .mdx-toc-row .mdx-toc-link,
.mdx-toc-level-5 > .mdx-toc-row .mdx-toc-link,
.mdx-toc-level-6 > .mdx-toc-row .mdx-toc-link {
  opacity: 0.82;
}

@media (max-width: 760px) {
  .mdx-toc-panel {
    float: none;
    width: auto;
    max-width: 100%;
    margin: 0 0 12px 0;
    position: relative !important;
    top: auto !important;
  }
}
`.trim();

  document.head.appendChild(style);
};

// ================= 标题树逻辑 =================

plugin._slugForHeading = (text, index) => {
  const base = String(text || "")
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`~!@#$%^&*()+=[\]{};:'",.<>/?\\|]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `mdx-heading-${base || "section"}-${index}`;
};

plugin._collectHeadings = (root) => {
  const all = Array.from(
    root.querySelectorAll("h1,h2,h3,h4,h5,h6")
  );

  return all
    .filter(h => {
      if (!h) return false;
      if (h.closest(".mdx-toc-panel")) return false;

      const text = String(h.textContent || "").trim();
      return !!text;
    })
    .map((h, i) => {
      const level = Number(h.tagName.slice(1)) || 1;

      if (!h.id) {
        h.id = plugin._slugForHeading(h.textContent, i);
      }

      try {
        h.style.scrollMarginTop = "14px";
      } catch {}

      return {
        el: h,
        id: h.id,
        text: String(h.textContent || "").trim(),
        level
      };
    });
};

plugin._buildHeadingTree = (headings) => {
  const root = {
    level: 0,
    children: []
  };

  const stack = [root];

  for (const h of headings) {
    const node = {
      ...h,
      children: []
    };

    while (
      stack.length > 1 &&
      stack[stack.length - 1].level >= node.level
    ) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
};

plugin._buildHeadingToc = (root) => {
  if (!root) return;

  try {
    if (!root.classList || !root.classList.contains("mdx-enhanced-root")) {
      return;
    }
  } catch {
    return;
  }

  if (root.dataset._mdxTocDone === "1") return;

  const headings = plugin._collectHeadings(root);

  if (!headings || headings.length < 2) {
    root.dataset._mdxTocDone = "1";
    return;
  }

  root.dataset._mdxTocDone = "1";
  root.classList.add("mdx-has-toc");

  try {
    const old = root.querySelector(":scope > .mdx-toc-panel");
    if (old) old.remove();
  } catch {}

  const tree = plugin._buildHeadingTree(headings);

  const panel = document.createElement("aside");
  panel.className = "mdx-toc-panel mdx-toc-sticky";

  if (headings.length > 10) {
    panel.classList.add("mdx-toc-scroll");
  }

  const head = document.createElement("div");
  head.className = "mdx-toc-head";

  const title = document.createElement("div");
  title.className = "mdx-toc-title";
  title.textContent = "目录";

  const count = document.createElement("div");
  count.className = "mdx-toc-count";
  count.textContent = `${headings.length}`;

  const minBtn = document.createElement("button");
  minBtn.className = "mdx-toc-min-btn";
  minBtn.type = "button";
  minBtn.textContent = "−";

  minBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const minimized = panel.classList.toggle("mdx-toc-minimized");
    minBtn.textContent = minimized ? "+" : "−";
  };

  head.appendChild(title);
  head.appendChild(count);
  head.appendChild(minBtn);

  const body = document.createElement("div");
  body.className = "mdx-toc-body";

  const ul = document.createElement("ul");
  ul.className = "mdx-toc-tree";

  plugin._renderHeadingNodes(tree, ul);

  body.appendChild(ul);
  panel.appendChild(head);
  panel.appendChild(body);

  root.insertBefore(panel, root.firstChild);
};

plugin._renderHeadingNodes = (nodes, parentUl) => {
  for (const node of nodes) {
    const li = document.createElement("li");
    li.className = `mdx-toc-node mdx-toc-level-${node.level}`;

    const row = document.createElement("div");
    row.className = "mdx-toc-row";

    const toggle = document.createElement("span");
    toggle.className = "mdx-toc-toggle";
    toggle.textContent = "▾";

    const link = document.createElement("a");
    link.className = "mdx-toc-link";
    link.href = `#${node.id}`;
    link.title = node.text;
    link.textContent = node.text;

    link.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        node.el.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } catch {
        try {
          location.hash = node.id;
        } catch {}
      }
    };

    row.appendChild(toggle);
    row.appendChild(link);
    li.appendChild(row);

    if (node.children && node.children.length) {
      const childUl = document.createElement("ul");

      toggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle("mdx-toc-collapsed");
      };

      plugin._renderHeadingNodes(node.children, childUl);
      li.appendChild(childUl);
    } else {
      toggle.classList.add("mdx-toc-empty");
      toggle.textContent = "•";

      toggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
    }

    parentUl.appendChild(li);
  }
};



