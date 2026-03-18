plugin.id = "plugin.markdown.enhanced.fast";
plugin.name = "Markdown 优化解析（极速请求）";
plugin.version = "1.3.3";
plugin.author = "ChatGPT";
plugin.description = "marked+DOMPurify 先行（最快可用），hljs/KaTeX/Mermaid 按需/空闲加载；预连接+并行+本地缓存，显著减少请求阻塞。接管 AI 输出为 Markdown 预览；并修复 .md / .markdown 文件预览解析（不再只限 README.md）。";
plugin.tags = ["markdown优化", "推荐", "marked",  "ai", "md", "markdown"];

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  plugin._state = {
    installed: false,
    installing: false,
    ok: false,
    failReason: "",
    oldParseMarkdown: null,

    // 接管 AI 输出
    oldRenderAIOutput: null,
    aiRenderHookInstalled: false,

    // 修复：.md / .markdown 文件预览解析（接管 openFile）
    oldOpenFile: null,
    openFileHookInstalled: false,

    cdn: {
      ghMarkdownCss: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css",
      hlCss: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css",
      katexCss: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css",

      marked: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
      dompurify: "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.1/purify.min.js",

      highlight: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js",
      katex: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js",
      katexAuto: "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js",
      mermaid: "https://cdn.jsdelivr.net/npm/mermaid@10.2.4/dist/mermaid.min.js"
    },

    cache: {
      enabled: true,
      schema: "mdx-libcache-v2",
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
    themeCssInjected: false,
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

plugin._ensureInjectedButton = () => {
  const { ui, components, core } = plugin._ctx || {};
  if (!ui || !ui.tabs || !components) return;

  // 只在 browse 模式显示
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
          ? "Markdown 极速解析已启用（按需加载/缓存）。\nAI 输出 Markdown 预览已接管（若扩展支持）。\n.md/.markdown 文件预览已修复。"
          : `启用失败（已回退）：${plugin._state.failReason || "未知原因"}`);
        return;
      }
      const act = prompt("已启用：\n1) 关闭接管\n2) 清空本地库缓存\n3) 立即预加载可选库\n其它取消", "1");
      if (act === "1") { plugin._uninstall(); alert("已恢复为原解析器。"); }
      else if (act === "2") { plugin._clearLibCache(); alert("已清空本地库缓存。"); }
      else if (act === "3") { plugin._preloadOptionalInIdle(); alert("已安排空闲时预加载可选库。"); }
    };
    ui.tabs.appendChild(btn);
  }
  btn.style.display = shouldShow ? "" : "none";
};

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

    if (!plugin._state.oldParseMarkdown) plugin._state.oldParseMarkdown = utils.parseMarkdown;

    plugin._preconnect();
    await plugin._loadRequiredFast();
    plugin._ensureObserver();
    plugin._preloadOptionalInIdle();

    utils.parseMarkdown = (text, owner, repo, branch) =>
      plugin._enhancedParseMarkdown(text, owner, repo, branch);

    // 接管 AI 输出（Markdown 渲染）
    plugin._installAIOutputHook();

    // 修复：.md / .markdown 文件预览解析（不再只限 README.md）
    plugin._installOpenFileHook();

    plugin._state.installed = true;
    plugin._state.ok = true;
    plugin._state.failReason = "";
  } catch (e) {
    plugin._state.ok = false;
    plugin._state.failReason = e?.message || String(e);

    try {
      const { utils } = plugin._ctx || {};
      if (utils && plugin._state.oldParseMarkdown) utils.parseMarkdown = plugin._state.oldParseMarkdown;
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
  if (utils && plugin._state.oldParseMarkdown) utils.parseMarkdown = plugin._state.oldParseMarkdown;

  plugin._uninstallAIOutputHook();
  plugin._uninstallOpenFileHook();

  plugin._state.installed = false;
  plugin._state.ok = false;
};

plugin._installAIOutputHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (plugin._state.aiRenderHookInstalled) return;
  if (typeof ext._renderAIOutput !== "function") return;

  if (!plugin._state.oldRenderAIOutput) plugin._state.oldRenderAIOutput = ext._renderAIOutput;

  ext._renderAIOutput = function () {
    // 先调用原来的（保持原逻辑）
    try { plugin._state.oldRenderAIOutput && plugin._state.oldRenderAIOutput.call(this); } catch {}

    const ui = this?.ui;
    const core = this?.core;
    if (!ui || !ui.aiOutputPre || !core || !core.aiManager) return;

    const pre = ui.aiOutputPre;

    const err = core.aiManager.streamError ? `\n\n[Error]\n${core.aiManager.streamError}\n` : "";
    const tail = core.aiManager.isStreaming ? "\n\n(Streaming...)" : "";
    const raw = (core.aiManager.streamBuffer || "") + err + tail;

    try {
      const utils = plugin._ctx?.utils;
      if (utils && typeof utils.parseMarkdown === "function") {
        const html = utils.parseMarkdown(raw, core.currentOwner, core.currentRepo, core.currentBranch);
        pre.style.whiteSpace = "normal";
        pre.innerHTML = html || "";
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

  if (plugin._state.oldRenderAIOutput && typeof plugin._state.oldRenderAIOutput === "function") {
    ext._renderAIOutput = plugin._state.oldRenderAIOutput;
  }
  plugin._state.aiRenderHookInstalled = false;
};

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

  if (!plugin._state.oldOpenFile) plugin._state.oldOpenFile = ext.openFile;

  ext.openFile = async function (file) {
    // 先走原逻辑（让扩展创建 UI/加载内容/挂载 mdToggleBtn 等）
    await plugin._state.oldOpenFile.call(this, file);

    // 只对 .md / .markdown / README 类文件做“预览修复”
    if (!plugin._isMarkdownFile(file)) return;

    // 兼容：扩展必须存在 fileViewRefs
    const refs = this?.ui?.fileViewRefs;
    const core = this?.core;
    if (!refs || !core) return;

    // 兼容：必须有 mdView + pre（你之前修复预览时加的）
    const mdView = refs.mdView;
    const pre = refs.pre;
    if (!mdView || !pre) return;

    // 兼容：必须能取到编辑区文本（openFile 里会给 textarea.value = text）
    const textarea = refs.textarea || this?.ui?.editorTextarea;
    const text = String(textarea?.value || pre?.textContent || "");

    // 强制把预览内容用 utils.parseMarkdown 渲染（本插件接管后更强）
    try {
      const utils = plugin._ctx?.utils;
      if (utils && typeof utils.parseMarkdown === "function") {
        mdView.innerHTML = utils.parseMarkdown(text, core.currentOwner, core.currentRepo, core.currentBranch);
      } else {
        // 没有 parseMarkdown 时，退化为文本
        mdView.textContent = text;
      }
    } catch {
      mdView.textContent = text;
    }

    // 默认显示预览（保持你“修复预览”的行为）
    try {
      core.isMarkdownPreview = true;
      pre.style.display = "none";
      mdView.style.display = "block";
    } catch {}

    try { plugin._scheduleEnhance(); } catch {}
  };

  plugin._state.openFileHookInstalled = true;
};

plugin._uninstallOpenFileHook = () => {
  const ext = plugin._ctx?.extension;
  if (!ext) return;
  if (!plugin._state.openFileHookInstalled) return;

  if (plugin._state.oldOpenFile && typeof plugin._state.oldOpenFile === "function") {
    ext.openFile = plugin._state.oldOpenFile;
  }
  plugin._state.openFileHookInstalled = false;
};

plugin._preconnect = () => {
  if (plugin._state.preconnectDone) return;
  plugin._state.preconnectDone = true;

  const urls = ["https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"];
  for (const base of urls) {
    const dns = document.createElement("link");
    dns.rel = "dns-prefetch";
    dns.href = base;
    document.head.appendChild(dns);

    const pc = document.createElement("link");
    pc.rel = "preconnect";
    pc.href = base;
    pc.crossOrigin = "anonymous";
    document.head.appendChild(pc);
  }
};

plugin._cacheKey = (name, url) => `${plugin._state.cache.schema}:${name}:${url}`;

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
  } catch { return null; }
};

plugin._setCachedLib = (name, url, code) => {
  try {
    if (!plugin._state.cache.enabled) return false;
    if (typeof code !== "string" || !code) return false;
    if (code.length > plugin._state.cache.maxCharsPerLib) return false;
    const obj = { v: plugin.version, exp: Date.now() + plugin._state.cache.ttlMs, code };
    localStorage.setItem(plugin._cacheKey(name, url), JSON.stringify(obj));
    return true;
  } catch { return false; }
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
  } catch (e) { reject(e); }
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
    try { await plugin._injectInlineScript(id, cached); return; }
    catch { return plugin._loadScriptSrc(id, url); }
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
  await plugin._loadCssOnce("mdx-gh-markdown-css", plugin._state.cdn.ghMarkdownCss);
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
  } finally { st.loading = false; }
};

plugin._ensureKatex = async () => {
  const st = plugin._state.optional.katex;
  if (st.loaded || st.loading) return;
  st.loading = true;
  try {
    await plugin._loadCssOnce("mdx-katex-css", plugin._state.cdn.katexCss);
    await plugin._loadScriptFast("mdx-katex", plugin._state.cdn.katex);
    await plugin._loadScriptFast("mdx-katex-auto", plugin._state.cdn.katexAuto);
    st.loaded = !!window.katex && typeof window.renderMathInElement === "function";
  } finally { st.loading = false; }
};

plugin._ensureMermaid = async () => {
  const st = plugin._state.optional.mermaid;
  if (st.loaded || st.loading) return;
  st.loading = true;
  try {
    await plugin._loadScriptFast("mdx-mermaid", plugin._state.cdn.mermaid);
    if (window.mermaid) {
      try { window.mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose" }); } catch {}
    }
    st.loaded = !!window.mermaid && typeof window.mermaid.render === "function";
  } finally { st.loading = false; }
};

plugin._injectPanelThemeCss = () => {
  if (plugin._state.themeCssInjected) return;
  plugin._state.themeCssInjected = true;

  const id = "mdx-fast-panel-theme";
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
.mdx-enhanced-root{color:rgba(255,255,255,0.92)!important;background:transparent!important;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.6;}
.mdx-enhanced-root,.mdx-enhanced-root *{border-color:rgba(255,255,255,0.14)!important;}
.mdx-enhanced-root a{color:#8af!important;text-decoration:none;}
.mdx-enhanced-root a:hover{text-decoration:underline;}
.mdx-enhanced-root h1,.mdx-enhanced-root h2,.mdx-enhanced-root h3,.mdx-enhanced-root h4,.mdx-enhanced-root h5,.mdx-enhanced-root h6{color:rgba(255,255,255,0.96)!important;}
.mdx-enhanced-root h1,.mdx-enhanced-root h2{border-bottom:1px solid rgba(255,255,255,0.14)!important;padding-bottom:4px;}
.mdx-enhanced-root blockquote{background:rgba(255,255,255,0.04)!important;border-left:4px solid rgba(255,255,255,0.22)!important;color:rgba(255,255,255,0.84)!important;padding:8px 10px;border-radius:8px;}
.mdx-enhanced-root hr{border:none!important;border-top:1px solid rgba(255,255,255,0.14)!important;}
.mdx-enhanced-root table{border-collapse:collapse!important;width:100%!important;background:rgba(0,0,0,0.18)!important;border:1px solid rgba(255,255,255,0.14)!important;border-radius:10px;overflow:hidden;}
.mdx-enhanced-root thead{background:rgba(255,255,255,0.08)!important;}
.mdx-enhanced-root th,.mdx-enhanced-root td{border:1px solid rgba(255,255,255,0.14)!important;padding:6px 8px!important;color:rgba(255,255,255,0.90)!important;}
.mdx-enhanced-root tbody tr:nth-child(2n){background:rgba(255,255,255,0.03)!important;}
.mdx-enhanced-root code{background:rgba(255,255,255,0.08)!important;color:rgba(255,255,255,0.92)!important;border-radius:6px;padding:0.1em 0.35em;}
.mdx-enhanced-root pre{background:rgba(0,0,0,0.35)!important;border:1px solid rgba(255,255,255,0.14)!important;border-radius:10px;padding:10px 12px;overflow:auto;}
.mdx-enhanced-root pre code{background:transparent!important;padding:0!important;}
.mdx-enhanced-root .hljs{background:transparent!important;color:rgba(255,255,255,0.92)!important;}
.mdx-enhanced-root img{border-radius:8px;max-width:100%;}
.mdx-enhanced-root .katex{color:rgba(255,255,255,0.92)!important;}
.mdx-enhanced-root .mermaid{background:rgba(255,255,255,0.03)!important;border:1px solid rgba(255,255,255,0.12)!important;border-radius:10px;padding:10px;overflow:auto;}
`.trim();
  document.head.appendChild(style);
};

plugin._rewriteRelativeAssets = (mdText, owner, repo, branch) => {
  if (!mdText || !owner || !repo) return mdText;
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch || "main"}`;
  return mdText.replace(/!\[([^\]]*)\]\((?!https?:|#|data:)([^)]+)\)/g, (m, alt, path) => {
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `![${alt}](${rawBase}/${clean})`;
  });
};

plugin._enhancedParseMarkdown = (text, owner, repo, branch) => {
  const old = plugin._state.oldParseMarkdown;

  try {
    if (!window.marked || !window.DOMPurify) {
      return old ? old(text, owner, repo, branch) : String(text || "");
    }

    const md = plugin._rewriteRelativeAssets(String(text || ""), owner, repo, branch);

    try { window.marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false }); } catch {}
    const rawHtml = window.marked.parse(md);
    const clean = window.DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });

    const needMermaid = /```mermaid|language-mermaid|<div class="mermaid"/i.test(md) || /language-mermaid/i.test(clean);
    const needKatex = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\(|\\\[/.test(md);
    const needHljs = /```/.test(md) || /<pre><code/.test(clean);

    if (needHljs) plugin._ensureHljs().then(() => plugin._scheduleEnhance());
    if (needKatex) plugin._ensureKatex().then(() => plugin._scheduleEnhance());
    if (needMermaid) plugin._ensureMermaid().then(() => plugin._scheduleEnhance());

    const html = `
      <article class="markdown-body mdx-enhanced-root" data-mdx-enhanced="1" style="padding: 8px 2px;">
        ${clean}
      </article>
    `;

    plugin._scheduleEnhance();
    return html;
  } catch {
    try { return old ? old(text, owner, repo, branch) : String(text || ""); }
    catch { return String(text || ""); }
  }
};

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
  const obs = new MutationObserver(() => plugin._scheduleEnhance());
  obs.observe(document.body, { childList: true, subtree: true });
  plugin._state.observer = obs;
};

plugin._enhanceAll = async () => {
  const roots = Array.from(document.querySelectorAll(".mdx-enhanced-root[data-mdx-enhanced='1']"));
  for (const root of roots) {
    if (root.dataset._mdxDone === "1") continue;
    root.dataset._mdxDone = "1";
    try { await plugin._enhanceOne(root); }
    catch { root.dataset._mdxDone = "0"; }
  }
};

plugin._enhanceOne = async (root) => {
  if (window.hljs) {
    root.querySelectorAll("pre code").forEach((b) => {
      try { window.hljs.highlightElement(b); } catch {}
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
  const blocks = Array.from(root.querySelectorAll("pre code.language-mermaid, code.language-mermaid, div.mermaid"));
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