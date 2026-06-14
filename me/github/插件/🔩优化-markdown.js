// GitHub Panel Pro+ 插件：Markdown 解析增强
// 从 ExtFind Markdown 渲染逻辑移植
// 适用于 GitHubPanelExtension 的 PluginManager

plugin.id = "markdown-render-plus";
plugin.name = "Markdown 解析增强";
plugin.version = "1.0.0";
plugin.description = "使用 marked + DOMPurify + highlight.js 增强 GitHub 面板的 Markdown 预览解析能力。";
plugin.tags = ["markdown", "marked", "highlight", "preview", "github"];

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

.gp-mdp-body table {
  background-color: #0d1117 !important;
  border-collapse: collapse !important;
  width: 100% !important;
  border: 1px solid #30363d !important;
  margin: 12px 0;
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
  const { utils } = context;

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

  const state = {
    ready: false,
    loading: false,
    failed: false,
    originalParseMarkdown: utils.parseMarkdown
  };

  function loadCSS(href) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = () => reject(new Error(`CSS 加载失败: ${href}`));
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function initMarkdownLibs() {
    if (state.ready || state.loading) return;

    state.loading = true;

    try {
      await loadCSS(CDN.githubMarkdownCSS);
      await loadCSS(CDN.highlightCSS);

      await Promise.all([
        loadScript(CDN.marked),
        loadScript(CDN.dompurify),
        loadScript(CDN.highlight)
      ]);

      if (window.marked && typeof window.marked.setOptions === "function") {
        window.marked.setOptions({
          gfm: true,
          breaks: true,
          headerIds: false,
          mangle: false
        });
      }

      state.ready = true;
      state.failed = false;

      console.log("[MarkdownRenderPlus] Markdown libraries loaded.");
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

  function isExternalUrl(url) {
    return /^(https?:)?\/\//i.test(url) ||
      /^data:/i.test(url) ||
      /^mailto:/i.test(url) ||
      /^tel:/i.test(url) ||
      /^#/i.test(url);
  }

  function normalizePath(path) {
    return String(path || "")
      .replace(/^\.?\//, "")
      .replace(/^\/+/, "");
  }

  function rewriteRelativeAssets(text, owner, repo, branch) {
    if (!text || !owner || !repo) return text;

    const safeBranch = branch || "main";

    const rawBase =
      `https://raw.githubusercontent.com/${owner}/${repo}/${safeBranch}`;

    const blobBase =
      `https://github.com/${owner}/${repo}/blob/${safeBranch}`;

    // 图片：![alt](relative/path.png)
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, alt, url) => {
        const clean = String(url || "").trim();

        if (!clean || isExternalUrl(clean)) {
          return match;
        }

        return `![${alt}](${rawBase}/${normalizePath(clean)})`;
      }
    );

    // 链接：[text](relative/file.md)
    text = text.replace(
      /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
      (match, label, url) => {
        const clean = String(url || "").trim();

        if (!clean || isExternalUrl(clean)) {
          return match;
        }

        return `[${label}](${blobBase}/${normalizePath(clean)})`;
      }
    );

    return text;
  }

  function sanitizeMarkdownHtml(rawHtml) {
    if (!window.DOMPurify) return rawHtml;

    return window.DOMPurify.sanitize(String(rawHtml), {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr",
        "a", "img",
        "strong", "em", "b", "i", "u", "s",
        "code", "pre", "blockquote",
        "ul", "ol", "li",
        "table", "thead", "tbody", "tr", "th", "td",
        "div", "span", "section", "article",
        "details", "summary",
        "kbd"
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "title",
        "class",
        "id",
        "target",
        "rel",
        "align"
      ],
      ADD_ATTR: ["target", "rel"]
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

  utils.parseMarkdown = function enhancedParseMarkdown(text, owner, repo, branch) {
    if (!text) return "";

    // 首次使用时异步加载库
    if (!state.ready && !state.loading && !state.failed) {
      initMarkdownLibs().then(() => {
        // 库加载完成后不主动重绘，用户重新打开/切换预览即可看到增强效果
      });
    }

    // 库未准备好时回退原解析器
    if (!state.ready || !window.marked || !window.DOMPurify) {
      const fallback = fallbackParse(text, owner, repo, branch);

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
      const processed = rewriteRelativeAssets(
        String(text),
        owner,
        repo,
        branch
      );

      const rawHtml = window.marked.parse
        ? window.marked.parse(processed)
        : window.marked(processed);

      const cleanHtml = sanitizeMarkdownHtml(rawHtml);

      highlightLater();

      return `
        <div class="markdown-body gp-mdp-body">
          ${cleanHtml}
        </div>
      `;
    } catch (error) {
      console.warn("[MarkdownRenderPlus] parse failed:", error);
      return fallbackParse(text, owner, repo, branch);
    }
  };

  // 预加载
  initMarkdownLibs();

  console.log("[MarkdownRenderPlus] Plugin initialized.");
};

plugin.onHook = function (hookName, data) {
  // 打开文件或切换模式后尝试补一次高亮
  if (
    hookName === "file:open" ||
    hookName === "mode:switch" ||
    hookName === "dir:load"
  ) {
    setTimeout(() => {
      if (!window.hljs) return;

      document.querySelectorAll(".gp-mdp-body pre code").forEach(block => {
        if (block.dataset.gpMdpHighlighted === "1") return;

        try {
          window.hljs.highlightElement(block);
          block.dataset.gpMdpHighlighted = "1";
        } catch {}
      });

      document.querySelectorAll(".gp-mdp-body a[href]").forEach(a => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      });
    }, 80);
  }
};
