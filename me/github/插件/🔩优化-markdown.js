
plugin.id = "markdown-render-plus";
plugin.name = "Markdown 解析增强";
plugin.version = "2.0.3";
plugin.description =
  "内置 Markdown 解析";
plugin.tags = [
  "markdown",
  "highlight",
  "github"
];

plugin.style = `
/* ===== Markdown Render Plus / Built-in Secure ===== */

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

.gp-mdp-body h1,
.gp-mdp-body h2 {
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

.gp-mdp-body h1 { font-size: 2em; }
.gp-mdp-body h2 { font-size: 1.5em; }
.gp-mdp-body h3 { font-size: 1.25em; }

.gp-mdp-body a {
  color: #58a6ff !important;
  text-decoration: none;
}

.gp-mdp-body a:hover {
  text-decoration: underline;
}

.gp-mdp-body img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 6px 0;
  background: rgba(255,255,255,0.04);
}

.gp-mdp-body video,
.gp-mdp-body audio,
.gp-mdp-body iframe {
  max-width: 100%;
  border-radius: 6px;
  margin: 8px 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid #30363d;
}

.gp-mdp-body video {
  width: 100%;
}

.gp-mdp-body iframe {
  width: 100%;
  min-height: 280px;
}

.gp-mdp-body table {
  display: block;
  width: 100%;
  overflow-x: auto;
  border-collapse: collapse !important;
  background-color: #0d1117 !important;
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
  display: block;
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

.gp-mdp-body li {
  margin: 4px 0;
}

.gp-mdp-body li input[type="checkbox"] {
  margin-right: 6px;
  vertical-align: middle;
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

.gp-mdp-body figure {
  margin: 12px 0;
}

.gp-mdp-body figcaption {
  opacity: 0.75;
  font-size: 12px;
  margin-top: 4px;
}

.gp-mdp-body mark {
  background: rgba(210, 153, 34, .35);
  color: #e6edf3;
  border-radius: 3px;
  padding: 0 3px;
}

.gp-mdp-body .gp-code-keyword { color: #ff7b72 !important; }
.gp-mdp-body .gp-code-string { color: #a5d6ff !important; }
.gp-mdp-body .gp-code-number { color: #79c0ff !important; }
.gp-mdp-body .gp-code-comment { color: #8b949e !important; font-style: italic; }
.gp-mdp-body .gp-code-function { color: #d2a8ff !important; }
.gp-mdp-body .gp-code-property { color: #7ee787 !important; }
.gp-mdp-body .gp-code-tag { color: #7ee787 !important; }
.gp-mdp-body .gp-code-attr { color: #79c0ff !important; }
.gp-mdp-body .gp-code-selector { color: #d2a8ff !important; }
.gp-mdp-body .gp-code-punctuation { color: #c9d1d9 !important; }
.gp-mdp-body .gp-code-meta { color: #ffa657 !important; }
`;

plugin.settings = {
  enableRawHtml: true,
  enableExternalImages: true,
  enableExternalMedia: false,
  enableIframes: false,
  enableDataImages: false,
  enableCodeHighlight: true,
  openLinksInNewTab: true,
  allowedIframeHosts: [
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "player.vimeo.com",
    "codesandbox.io",
    "stackblitz.com"
  ]
};

plugin.init = function (context) {
  const { core, utils, extension } = context;
  const pluginInstance = this;

  const state = {
    context,
    core,
    utils,
    extension,

    originalParseMarkdown:
      typeof utils.parseMarkdown === "function"
        ? utils.parseMarkdown
        : null,

    originalOpenFile:
      extension && typeof extension.openFile === "function"
        ? extension.openFile
        : null,

    enhancedParseMarkdown: null,
    patchedOpenFile: null,

    currentFilePath: "",
    currentBaseDir: "",

    disposed: false
  };

  pluginInstance._mdpState = state;

  function getSettings() {
    return {
      ...plugin.settings,
      ...(pluginInstance.settings || {})
    };
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return map[char];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function normalizeSlashes(path) {
    return String(path || "")
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/");
  }

  function dirname(path) {
    const clean = normalizeSlashes(path)
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    const index = clean.lastIndexOf("/");
    return index >= 0 ? clean.slice(0, index) : "";
  }

  function normalizeDotSegments(path) {
    const raw = normalizeSlashes(path);
    const absolute = raw.startsWith("/");
    const parts = raw.split("/");
    const output = [];

    for (const part of parts) {
      if (!part || part === ".") continue;

      if (part === "..") {
        if (output.length > 0) output.pop();
        continue;
      }

      output.push(part);
    }

    return `${absolute ? "/" : ""}${output.join("/")}`;
  }

  function splitUrlSuffix(url) {
    const raw = String(url || "").trim();
    const queryIndex = raw.indexOf("?");
    const hashIndex = raw.indexOf("#");

    let cutIndex = -1;

    if (queryIndex >= 0 && hashIndex >= 0) {
      cutIndex = Math.min(queryIndex, hashIndex);
    } else if (queryIndex >= 0) {
      cutIndex = queryIndex;
    } else if (hashIndex >= 0) {
      cutIndex = hashIndex;
    }

    if (cutIndex < 0) {
      return {
        path: raw,
        suffix: ""
      };
    }

    return {
      path: raw.slice(0, cutIndex),
      suffix: raw.slice(cutIndex)
    };
  }

  function getUrlScheme(url) {
    const match = String(url || "")
      .trim()
      .match(/^([a-z][a-z0-9+.-]*):/i);

    return match ? match[1].toLowerCase() : "";
  }

  function isHashUrl(url) {
    return /^\s*#/.test(String(url || ""));
  }

  function isProtocolRelativeUrl(url) {
    return /^\s*\/\//.test(String(url || ""));
  }

  function isHttpUrl(url) {
    return /^\s*https?:\/\//i.test(String(url || ""));
  }

  function isRelativeUrl(url) {
    const value = String(url || "").trim();

    if (!value) return false;
    if (isHashUrl(value)) return true;
    if (isProtocolRelativeUrl(value)) return false;
    if (getUrlScheme(value)) return false;

    return true;
  }

  function isAllowedDataImage(url) {
    const settings = getSettings();

    if (!settings.enableDataImages) return false;

    return /^data:image\/(?:png|gif|jpe?g|webp|avif);base64,/i.test(
      String(url || "").trim()
    );
  }

  function isAllowedUrl(url, kind) {
    const value = String(url || "").trim();
    const settings = getSettings();

    if (!value || isHashUrl(value) || isRelativeUrl(value)) {
      return true;
    }

    if (isProtocolRelativeUrl(value)) {
      return kind !== "iframe";
    }

    const scheme = getUrlScheme(value);

    if (!scheme) return true;

    if (scheme === "http" || scheme === "https") {
      if (kind === "image") return settings.enableExternalImages !== false;
      if (kind === "media") return settings.enableExternalMedia === true;
      if (kind === "iframe") return settings.enableIframes === true;
      return true;
    }

    if (scheme === "mailto" || scheme === "tel") {
      return kind === "link";
    }

    if (scheme === "blob") {
      return kind === "image";
    }

    if (scheme === "data") {
      return kind === "image" && isAllowedDataImage(value);
    }

    return false;
  }

  function getCurrentContext(owner, repo, branch) {
    return {
      owner: String(owner || core?.currentOwner || "").trim(),
      repo: String(repo || core?.currentRepo || "").trim(),
      branch: String(branch || core?.currentBranch || "main").trim() || "main",
      baseDir: getBaseDir()
    };
  }

  function getBaseDir() {
    if (state.currentBaseDir) {
      return state.currentBaseDir;
    }

    if (state.currentFilePath) {
      return dirname(state.currentFilePath);
    }

    if (core?.currentPath) {
      return String(core.currentPath)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");
    }

    return "";
  }

  function setCurrentFilePath(path) {
    const safePath = normalizeSlashes(path)
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    state.currentFilePath = safePath;
    state.currentBaseDir = dirname(safePath);
  }

  function stripGitHubPathPrefix(path, owner, repo, branch) {
    let value = normalizeSlashes(path).replace(/^\/+/, "");

    const safeOwner = String(owner || "").trim();
    const safeRepo = String(repo || "").trim();
    const safeBranch = String(branch || "main").trim();

    const ownerRepoPrefix = `${safeOwner}/${safeRepo}/`;
    const lowerValue = value.toLowerCase();
    const lowerOwnerRepo = ownerRepoPrefix.toLowerCase();

    if (
      safeOwner &&
      safeRepo &&
      lowerValue.startsWith(`${lowerOwnerRepo}blob/`)
    ) {
      const rest = value.slice(`${ownerRepoPrefix}blob/`.length);
      const branchPrefix = `${safeBranch}/`;

      if (rest.startsWith(branchPrefix)) {
        return rest.slice(branchPrefix.length);
      }

      return rest;
    }

    if (
      safeOwner &&
      safeRepo &&
      lowerValue.startsWith(`${lowerOwnerRepo}raw/`)
    ) {
      const rest = value.slice(`${ownerRepoPrefix}raw/`.length);
      const branchPrefix = `${safeBranch}/`;

      if (rest.startsWith(branchPrefix)) {
        return rest.slice(branchPrefix.length);
      }

      return rest;
    }

    if (
      safeOwner &&
      safeRepo &&
      lowerValue.startsWith(lowerOwnerRepo)
    ) {
      return value.slice(ownerRepoPrefix.length);
    }

    if (lowerValue.startsWith("blob/")) {
      const rest = value.slice("blob/".length);
      const branchPrefix = `${safeBranch}/`;

      if (rest.startsWith(branchPrefix)) {
        return rest.slice(branchPrefix.length);
      }
    }

    if (lowerValue.startsWith("raw/")) {
      const rest = value.slice("raw/".length);
      const branchPrefix = `${safeBranch}/`;

      if (rest.startsWith(branchPrefix)) {
        return rest.slice(branchPrefix.length);
      }
    }

    return value;
  }

  function resolveRepoPath(input, owner, repo, branch, baseDir) {
    const value = String(input || "").trim();

    if (!value || isHashUrl(value) || !isRelativeUrl(value)) {
      return value;
    }

    const { path, suffix } = splitUrlSuffix(value);
    let result = path.replace(/^['"]|['"]$/g, "").trim();

    if (!result) return suffix;

    if (result.startsWith("/")) {
      result = result.replace(/^\/+/, "");
    } else {
      const stripped = stripGitHubPathPrefix(
        result,
        owner,
        repo,
        branch
      );

      const wasQualified = stripped !== result;

      result = wasQualified
        ? stripped
        : baseDir
          ? `${baseDir}/${result}`
          : result;
    }

    return `${normalizeDotSegments(result).replace(/^\/+/, "")}${suffix}`;
  }

  function rewriteUrl(url, kind, owner, repo, branch, baseDir) {
    const value = String(url || "").trim();

    if (!value) return "";

    if (!isAllowedUrl(value, kind)) {
      return "";
    }

    if (!isRelativeUrl(value) || isHashUrl(value)) {
      return value;
    }

    if (!owner || !repo) {
      return value;
    }

    const resolved = resolveRepoPath(
      value,
      owner,
      repo,
      branch,
      baseDir
    );

    if (!resolved) return "";

    // 修复点：对路径部分进行分段 URL 编码，保留 suffix (? 或 #) 不被错误编码
    const { path: resolvedPath, suffix } = splitUrlSuffix(resolved);
    const encodedPath = resolvedPath.split("/").map(encodeURIComponent).join("/");
    const finalPath = `${encodedPath}${suffix}`;

    const safeBranch = encodeURIComponent(branch || "main")
      .replace(/%2F/gi, "/");

    if (kind === "link") {
      return `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/blob/${safeBranch}/${finalPath}`;
    }

    return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${safeBranch}/${finalPath}`;
  }

  function parseSrcset(srcset) {
    const input = String(srcset || "").trim();

    if (!input) return [];

    const candidates = [];
    let current = "";
    let quote = "";
    let parentheses = 0;

    for (let index = 0; index < input.length; index++) {
      const char = input[index];

      if (quote) {
        current += char;

        if (char === quote && input[index - 1] !== "\\") {
          quote = "";
        }

        continue;
      }

      if (char === "'" || char === '"') {
        quote = char;
        current += char;
        continue;
      }

      if (char === "(") {
        parentheses++;
        current += char;
        continue;
      }

      if (char === ")") {
        parentheses = Math.max(0, parentheses - 1);
        current += char;
        continue;
      }

      if (char === "," && parentheses === 0) {
        if (current.trim()) {
          candidates.push(current.trim());
        }

        current = "";
        continue;
      }

      current += char;
    }

    if (current.trim()) {
      candidates.push(current.trim());
    }

    return candidates;
  }

  function rewriteSrcset(srcset, owner, repo, branch, baseDir) {
    return parseSrcset(srcset)
      .map(candidate => {
        const pieces = candidate.split(/\s+/);
        const source = pieces.shift();
        const descriptor = pieces.join(" ");

        if (!source || /^data:/i.test(source)) {
          return "";
        }

        const rewritten = rewriteUrl(
          source,
          "image",
          owner,
          repo,
          branch,
          baseDir
        );

        if (!rewritten) return "";

        return descriptor
          ? `${rewritten} ${descriptor}`
          : rewritten;
      })
      .filter(Boolean)
      .join(", ");
  }

  function isAllowedIframeHost(url) {
    const settings = getSettings();

    if (!settings.enableIframes) return false;

    try {
      const parsed = new URL(url);
      const hosts = Array.isArray(settings.allowedIframeHosts)
        ? settings.allowedIframeHosts
        : [];

      return hosts.includes(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  function sanitizeRawHtml(rawHtml, owner, repo, branch, baseDir) {
    const settings = getSettings();

    if (!settings.enableRawHtml) {
      return escapeHtml(rawHtml);
    }

    const template = document.createElement("template");
    template.innerHTML = String(rawHtml || "");

    const allowedTags = new Set([
      "a",
      "abbr",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "br",
      "caption",
      "code",
      "col",
      "colgroup",
      "dd",
      "del",
      "details",
      "div",
      "dl",
      "dt",
      "em",
      "figure",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hr",
      "i",
      "iframe",
      "img",
      "input",
      "kbd",
      "li",
      "main",
      "mark",
      "ol",
      "p",
      "picture",
      "pre",
      "s",
      "section",
      "small",
      "source",
      "span",
      "strong",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr",
      "u",
      "ul",
      "var",
      "video"
    ]);

    const allowedAttrsByTag = {
      a: new Set([
        "href",
        "title",
        "target",
        "rel",
        "id",
        "class",
        "name"
      ]),

      img: new Set([
        "src",
        "srcset",
        "sizes",
        "alt",
        "title",
        "width",
        "height",
        "loading",
        "align",
        "id",
        "class"
      ]),

      video: new Set([
        "src",
        "poster",
        "controls",
        "autoplay",
        "muted",
        "loop",
        "playsinline",
        "preload",
        "width",
        "height",
        "id",
        "class"
      ]),

      audio: new Set([
        "src",
        "controls",
        "autoplay",
        "muted",
        "loop",
        "preload",
        "id",
        "class"
      ]),

      source: new Set([
        "src",
        "srcset",
        "sizes",
        "type",
        "media"
      ]),

      iframe: new Set([
        "src",
        "width",
        "height",
        "title",
        "loading",
        "referrerpolicy",
        "sandbox",
        "allowfullscreen"
      ]),

      input: new Set([
        "type",
        "checked",
        "disabled"
      ]),

      td: new Set([
        "colspan",
        "rowspan",
        "align",
        "id",
        "class"
      ]),

      th: new Set([
        "colspan",
        "rowspan",
        "align",
        "scope",
        "id",
        "class"
      ]),

      ol: new Set([
        "start",
        "id",
        "class"
      ]),

      col: new Set([
        "span",
        "width"
      ]),

      details: new Set([
        "open",
        "id",
        "class"
      ])
    };

    const commonAttrs = new Set([
      "id",
      "class",
      "title",
      "lang",
      "role",
      "align"
    ]);

    const removeEntirely = [
      "script",
      "style",
      "link",
      "meta",
      "base",
      "object",
      "embed",
      "applet",
      "form",
      "textarea",
      "select",
      "option",
      "button",
      "svg",
      "math"
    ];

    template.content
      .querySelectorAll(removeEntirely.join(","))
      .forEach(node => node.remove());

    const elements = Array.from(
      template.content.querySelectorAll("*")
    );

    elements.forEach(element => {
      const tag = element.tagName.toLowerCase();

      if (!allowedTags.has(tag)) {
        const parent = element.parentNode;

        if (!parent) {
          element.remove();
          return;
        }

        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }

        element.remove();
        return;
      }

      if (tag === "input") {
        const type = String(
          element.getAttribute("type") || ""
        ).toLowerCase();

        if (type !== "checkbox") {
          element.remove();
          return;
        }
      }

      if (tag === "iframe" && !settings.enableIframes) {
        element.remove();
        return;
      }

      const tagAttrs = allowedAttrsByTag[tag] || new Set();

      Array.from(element.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        const allowed =
          commonAttrs.has(name) || tagAttrs.has(name);

        if (
          name.startsWith("on") ||
          name === "style" ||
          name === "srcdoc" ||
          name === "xmlns" ||
          !allowed
        ) {
          element.removeAttribute(attr.name);
        }
      });

      if (element.hasAttribute("id")) {
        const id = element.getAttribute("id") || "";

        if (/^gp-/i.test(id)) {
          element.removeAttribute("id");
        }
      }

      if (element.hasAttribute("class")) {
        const classes = String(
          element.getAttribute("class") || ""
        )
          .split(/\s+/)
          .filter(Boolean)
          .filter(className => !/^gp-/i.test(className))
          .join(" ");

        if (classes) {
          element.setAttribute("class", classes);
        } else {
          element.removeAttribute("class");
        }
      }

      if (tag === "a") {
        const href = rewriteUrl(
          element.getAttribute("href"),
          "link",
          owner,
          repo,
          branch,
          baseDir
        );

        if (href) {
          element.setAttribute("href", href);

          if (settings.openLinksInNewTab) {
            element.setAttribute("target", "_blank");
            element.setAttribute(
              "rel",
              "noopener noreferrer"
            );
          } else {
            element.removeAttribute("target");
            element.removeAttribute("rel");
          }
        } else {
          element.removeAttribute("href");
          element.removeAttribute("target");
          element.removeAttribute("rel");
        }
      }

      if (tag === "img") {
        const src = rewriteUrl(
          element.getAttribute("src"),
          "image",
          owner,
          repo,
          branch,
          baseDir
        );

        if (src) {
          element.setAttribute("src", src);
          element.setAttribute("loading", "lazy");
        } else {
          element.removeAttribute("src");
        }

        if (element.hasAttribute("srcset")) {
          const srcset = rewriteSrcset(
            element.getAttribute("srcset"),
            owner,
            repo,
            branch,
            baseDir
          );

          if (srcset) {
            element.setAttribute("srcset", srcset);
          } else {
            element.removeAttribute("srcset");
          }
        }
      }

      if (
        ["video", "audio", "source"].includes(tag) &&
        element.hasAttribute("src")
      ) {
        const src = rewriteUrl(
          element.getAttribute("src"),
          "media",
          owner,
          repo,
          branch,
          baseDir
        );

        if (src) {
          element.setAttribute("src", src);
        } else {
          element.removeAttribute("src");
        }
      }

      if (tag === "source" && element.hasAttribute("srcset")) {
        const srcset = rewriteSrcset(
          element.getAttribute("srcset"),
          owner,
          repo,
          branch,
          baseDir
        );

        if (srcset) {
          element.setAttribute("srcset", srcset);
        } else {
          element.removeAttribute("srcset");
        }
      }

      if (tag === "video" && element.hasAttribute("poster")) {
        const poster = rewriteUrl(
          element.getAttribute("poster"),
          "image",
          owner,
          repo,
          branch,
          baseDir
        );

        if (poster) {
          element.setAttribute("poster", poster);
        } else {
          element.removeAttribute("poster");
        }
      }

      if (tag === "iframe") {
        const src = rewriteUrl(
          element.getAttribute("src"),
          "iframe",
          owner,
          repo,
          branch,
          baseDir
        );

        if (!src || !isAllowedIframeHost(src)) {
          element.remove();
          return;
        }

        element.setAttribute("src", src);
        element.setAttribute("loading", "lazy");
        element.setAttribute("referrerpolicy", "no-referrer");
        element.setAttribute(
          "sandbox",
          "allow-scripts allow-presentation"
        );

        element.removeAttribute("allow");
      }
    });

    return template.innerHTML;
  }

  function wrapCodeToken(type, value) {
    return `<span class="gp-code-${type}">${escapeHtml(value)}</span>`;
  }

  function highlightPlainCodeSegment(source, language) {
    const lang = String(language || "")
      .toLowerCase()
      .replace(/^language-/, "");

    const keywordPatterns = {
      js: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|import|export|from|default|async|await|typeof|instanceof|in|of|this|super|static|true|false|null|undefined)\b/g,

      py: /\b(def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|with|lambda|yield|async|await|pass|break|continue|True|False|None|and|or|not|is)\b/g,

      sh: /\b(if|then|fi|for|in|do|done|case|esac|while|function|export|local|readonly|sudo|cd|echo|printf|grep|sed|awk|curl|git|npm|pnpm|yarn)\b/g,

      sql: /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|DATABASE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|AS|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|REFERENCES)\b/gi,

      java: /\b(public|private|protected|static|final|class|interface|extends|implements|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|throws|void|int|long|double|float|boolean|char|true|false|null|package|import)\b/g
    };

    let group = "js";

    if (["py", "python"].includes(lang)) {
      group = "py";
    } else if (["sh", "bash", "shell", "zsh", "fish"].includes(lang)) {
      group = "sh";
    } else if (
      ["sql", "mysql", "postgres", "postgresql", "sqlite"].includes(lang)
    ) {
      group = "sql";
    } else if (
      [
        "java",
        "c",
        "cpp",
        "c++",
        "cs",
        "csharp",
        "go",
        "rust",
        "php",
        "kotlin",
        "swift"
      ].includes(lang)
    ) {
      group = "java";
    }

    let html = escapeHtml(source);

    html = html.replace(
      keywordPatterns[group],
      `<span class="gp-code-keyword">$1</span>`
    );

    html = html.replace(
      /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi,
      `<span class="gp-code-number">$&</span>`
    );

    html = html.replace(
      /\b([a-zA-Z_$][\w$]*)(?=\s*\()/g,
      `<span class="gp-code-function">$1</span>`
    );

    if (group === "sh") {
      html = html.replace(
        /(\$\{?[\w@*#?$!-]+\}?)/g,
        `<span class="gp-code-property">$1</span>`
      );
    }

    return html;
  }

  function highlightHtmlCode(code) {
    const escaped = escapeHtml(code);

    return escaped.replace(
      /(&lt;\/?)([a-zA-Z][\w:-]*)([\s\S]*?)(\/?&gt;)/g,
      (_, open, tag, attrs, close) => {
        const safeAttrs = attrs.replace(
          /([\w:-]+)(\s*=\s*)(&quot;(?:\\.|[^&])*?&quot;|&#39;(?:\\.|[^&])*?&#39;|[^\s]+)/g,
          `<span class="gp-code-attr">$1</span>$2<span class="gp-code-string">$3</span>`
        );

        return (
          `<span class="gp-code-punctuation">${open}</span>` +
          `<span class="gp-code-tag">${tag}</span>` +
          safeAttrs +
          `<span class="gp-code-punctuation">${close}</span>`
        );
      }
    );
  }

  function highlightCssCode(code) {
    return String(code || "")
      .split("\n")
      .map(line => {
        const escaped = escapeHtml(line);

        if (/^\s*\/\*/.test(line) || /\*\/\s*$/.test(line)) {
          return `<span class="gp-code-comment">${escaped}</span>`;
        }

        if (/^\s*@/.test(line)) {
          return escaped.replace(
            /^(\s*@[\w-]+)/,
            `<span class="gp-code-keyword">$1</span>`
          );
        }

        if (line.includes("{")) {
          return escaped.replace(
            /^(\s*[^{}]+)(\s*\{)/,
            `<span class="gp-code-selector">$1</span>$2`
          );
        }

        return escaped.replace(
          /^(\s*)([\w-]+)(\s*:)(.*)$/,
          `$1<span class="gp-code-property">$2</span>$3$4`
        );
      })
      .join("\n");
  }

  function highlightJsonCode(code) {
    const source = String(code || "");
    const tokenPattern =
      /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/gi;

    let output = "";
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(source))) {
      output += escapeHtml(source.slice(cursor, match.index));

      const token = match[0];
      const nextText = source.slice(tokenPattern.lastIndex);
      const isProperty = /^\s*:/.test(nextText);

      if (/^"/.test(token)) {
        output += wrapCodeToken(
          isProperty ? "property" : "string",
          token
        );
      } else if (/^(true|false|null)$/i.test(token)) {
        output += wrapCodeToken("keyword", token);
      } else {
        output += wrapCodeToken("number", token);
      }

      cursor = tokenPattern.lastIndex;
    }

    output += escapeHtml(source.slice(cursor));

    return output;
  }

  function highlightCode(code, language) {
    const settings = getSettings();

    if (!settings.enableCodeHighlight) {
      return escapeHtml(code);
    }

    const lang = String(language || "")
      .toLowerCase()
      .trim()
      .replace(/^language-/, "");

    if (["html", "htm", "xml", "svg", "vue"].includes(lang)) {
      return highlightHtmlCode(code);
    }

    if (["css", "scss", "sass", "less"].includes(lang)) {
      return highlightCssCode(code);
    }

    if (["json", "jsonc"].includes(lang)) {
      return highlightJsonCode(code);
    }

    const source = String(code || "");

    const tokenPattern =
      /\/\*[\s\S]*?\*\/|\/\/[^\n]*|--[^\n]*|#[^\n]*|`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g;

    let output = "";
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(source))) {
      output += highlightPlainCodeSegment(
        source.slice(cursor, match.index),
        lang
      );

      const token = match[0];

      if (
        token.startsWith("//") ||
        token.startsWith("/*") ||
        token.startsWith("--") ||
        token.startsWith("#")
      ) {
        output += wrapCodeToken("comment", token);
      } else {
        output += wrapCodeToken("string", token);
      }

      cursor = tokenPattern.lastIndex;
    }

    output += highlightPlainCodeSegment(
      source.slice(cursor),
      lang
    );

    return output;
  }

  // ===== 修复点：行内强调解析（彻底解决相邻强调互相吞字符的 Bug）=====
  function renderPlainInline(value) {
    let html = escapeHtml(value);

    // 加粗（**）：使用 (?:[^*]|\*(?!\*))+? 确保内部绝不会匹配到连续的 **，防止跨越相邻的加粗块
    html = html.replace(
      /\*\*(?!\s)((?:[^*]|\*(?!\*))+?)(?<!\s)\*\*/g,
      `<strong>$1</strong>`
    );
    
    // 加粗（__）：同上，防止内部包含 __ 导致跨越匹配，并保留单词边界限制
    html = html.replace(
      /(^|[^\w])__(?!\s)((?:[^_]|_(?!_))+?)(?<!\s)__(?![_\w])/g,
      `$1<strong>$2</strong>`
    );

    // 删除线（~~）：同上，防止内部包含 ~~ 导致跨越匹配
    html = html.replace(
      /~~(?!\s)((?:[^~]|~(?!~))+?)(?<!\s)~~/g,
      `<del>$1</del>`
    );

    // 斜体（*）：使用零宽断言，不消费前后字符，支持相邻强调
    html = html.replace(
      /(?<![\*\w])\*(?!\s)([^\*\n]+?)(?<!\s)\*(?![\*\w])/g,
      `<em>$1</em>`
    );

    // 斜体（_）：单词内的 _ 不视为强调
    html = html.replace(
      /(?<![\w])_(?!\s)([^_\n]+?)(?<!\s)_(?![\w])/g,
      `<em>$1</em>`
    );

    return html;
  }

  function formatText(text, owner, repo, branch, baseDir) {
    const source = String(text || "");
    const tokens = [];
    const settings = getSettings();

    function saveToken(html) {
      const id = `\u0000MDP_TOKEN_${tokens.length}\u0000`;
      tokens.push(html);
      return id;
    }

    // ===== 修复点：行内 HTML 正则重构，移除脆弱的反向引用，支持属性内包含 > 的情况 =====
    const inlineHtmlPattern =
      "<[a-zA-Z][\\w:-]*\\b(?:[^>\"']|\"[^\"]*\"|'[^']*')*>[\\s\\S]*?<\\/[a-zA-Z][\\w:-]*\\s*>" +
      "|<[a-zA-Z][\\w:-]*\\b(?:[^>\"']|\"[^\"]*\"|'[^']*')*\\/?>" +
      "|<\\/[a-zA-Z][\\w:-]*\\s*>";

    const tokenPattern = new RegExp(
      "`([^`]+)`" +
        "|!\\[([^\\]]*)\\]\\(([^)\\s]+)(?:\\s+[\"'][^\"']*[\"'])?\\)" +
        "|\\[([^\\]]+)\\]\\(([^)\\s]+)(?:\\s+[\"'][^\"']*[\"'])?\\)" +
        "|(" + inlineHtmlPattern + ")",
      "g"
    );

    let output = "";
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(source))) {
      output += renderPlainInline(source.slice(cursor, match.index));

      if (match[1] != null) {
        output += saveToken(
          `<code>${escapeHtml(match[1])}</code>`
        );
      } else if (match[2] != null) {
        const src = rewriteUrl(
          match[3],
          "image",
          owner,
          repo,
          branch,
          baseDir
        );

        output += saveToken(
          src
            ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(match[2])}" loading="lazy">`
            : `<span>${escapeHtml(match[2])}</span>`
        );
      } else if (match[4] != null) {
        const href = rewriteUrl(
          match[5],
          "link",
          owner,
          repo,
          branch,
          baseDir
        );

        const label = renderPlainInline(match[4]);

        output += saveToken(
          href
            ? `<a href="${escapeAttr(href)}"${
                settings.openLinksInNewTab
                  ? ` target="_blank" rel="noopener noreferrer"`
                  : ""
              }>${label}</a>`
            : `<span>${label}</span>`
        );
      } else if (match[6] != null) {
        output += saveToken(
          sanitizeRawHtml(
            match[6],
            owner,
            repo,
            branch,
            baseDir
          )
        );
      }

      cursor = tokenPattern.lastIndex;
    }

    output += renderPlainInline(source.slice(cursor));

    tokens.forEach((html, index) => {
      output = output.replace(
        `\u0000MDP_TOKEN_${index}\u0000`,
        () => html
      );
    });

    return output;
  }

  // ===== 修复点：允许单破折号与单列表格 =====
  function isTableSeparator(line) {
    const value = String(line || "").trim();

    if (!value.includes("-")) return false;
    // 修复点：强制要求包含 |，防止将普通的水平线 (---) 误判为表格分隔符
    if (!value.includes("|")) return false;
    if (!/^[\s|:\-]+$/.test(value)) return false;

    const cells = value
      .replace(/^\||\|$/g, "")
      .split("|")
      .map(cell => cell.trim());

    if (!cells.length) return false;

    return cells.every(cell => /^:?-+:?$/.test(cell));
  }

  function splitTableRow(line) {
    const value = String(line || "")
      .trim()
      .replace(/^\||\|$/g, "");

    const cells = [];
    let current = "";
    let escaped = false;
    let code = false;

    for (let index = 0; index < value.length; index++) {
      const char = value[index];

      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        current += char;
        continue;
      }

      if (char === "`") {
        code = !code;
        current += char;
        continue;
      }

      if (char === "|" && !code) {
        cells.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    cells.push(current.trim());

    return cells.map(cell => cell.replace(/\\\|/g, "|"));
  }

  function isRawHtmlBlockStart(line) {
    return /^\s*<(details|div|section|article|table|video|audio|iframe|picture|figure|blockquote|ul|ol|dl|pre|h[1-6]|p)\b/i.test(
      String(line || "")
    );
  }

  function getHtmlBlockTagName(line) {
    const match = String(line || "").match(
      /^\s*<([a-zA-Z][\w:-]*)\b/i
    );

    return match ? match[1].toLowerCase() : "";
  }

  function parseMarkdown(text, owner, repo, branch) {
    const { baseDir } = getCurrentContext(owner, repo, branch);

    const lines = String(text || "")
      .replace(/\r\n?/g, "\n")
      .split("\n");

    const html = [];
    let index = 0;
    let paragraphLines = [];

    function flushParagraph() {
      if (!paragraphLines.length) return;

      html.push(
        `<p>${paragraphLines
          .map(line =>
            formatText(line, owner, repo, branch, baseDir)
          )
          .join("<br>")}</p>`
      );

      paragraphLines = [];
    }

    function renderList(ordered) {
      const items = [];
      const tag = ordered ? "ol" : "ul";
      const pattern = ordered
        ? /^\s*(\d+)[.)]\s+(.+)$/
        : /^\s*[-+*]\s+(.+)$/;

      let start = "";

      while (index < lines.length) {
        const match = lines[index].match(pattern);

        if (!match) break;

        const content = ordered ? match[2] : match[1];

        if (ordered && !items.length && Number(match[1]) !== 1) {
          start = ` start="${escapeAttr(match[1])}"`;
        }

        let value = content;
        let checkbox = "";

        const taskMatch = value.match(
          /^\[([ xX])\]\s+([\s\S]*)$/
        );

        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === "x";
          value = taskMatch[2];

          checkbox =
            `<input type="checkbox" disabled${
              checked ? " checked" : ""
            }> `;
        }

        items.push(
          `<li>${checkbox}${formatText(
            value,
            owner,
            repo,
            branch,
            baseDir
          )}</li>`
        );

        index++;
      }

      html.push(`<${tag}${start}>${items.join("")}</${tag}>`);
    }

    while (index < lines.length) {
      const line = lines[index];

      if (!line.trim()) {
        flushParagraph();
        index++;
        continue;
      }

      const fence = line.match(/^\s*(`{3,}|~{3,})\s*([^`]*)$/);

      if (fence) {
        flushParagraph();

        const marker = fence[1];
        const language = String(fence[2] || "")
          .trim()
          .split(/\s+/)[0];

        const codeLines = [];
        index++;

        const closePattern = new RegExp(
          `^\\s*${marker[0]}{${marker.length},}\\s*$`
        );

        while (
          index < lines.length &&
          !closePattern.test(lines[index])
        ) {
          codeLines.push(lines[index]);
          index++;
        }

        if (index < lines.length) {
          index++;
        }

        const code = codeLines.join("\n");

        html.push(
          `<pre><code${
            language
              ? ` class="language-${escapeAttr(language)}"`
              : ""
          }>${highlightCode(code, language)}</code></pre>`
        );

        continue;
      }

      // ===== 修复点：Setext 二级标题优先于 <hr> 识别 =====
      if (
        index + 1 < lines.length &&
        line.trim() &&
        !/^\s*[#>\-+*]/.test(line) &&
        /^\s*(=+|-+)\s*$/.test(lines[index + 1])
      ) {
        flushParagraph();

        const level = /^\s*=+\s*$/.test(lines[index + 1]) ? 1 : 2;

        html.push(
          `<h${level}>${formatText(
            line.trim(),
            owner,
            repo,
            branch,
            baseDir
          )}</h${level}>`
        );

        index += 2;
        continue;
      }

      if (isRawHtmlBlockStart(line)) {
        flushParagraph();

        const tagName = getHtmlBlockTagName(line);
        const rawHtmlLines = [];
        let depth = 0;
        let foundClosingTag = false;

        while (index < lines.length) {
          const currentLine = lines[index];

          // ===== 修复点：HTML 块深度统计正则重构，支持属性内包含 > 的情况 =====
          const openTags =
            currentLine.match(
              new RegExp(`<${tagName}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi")
            ) || [];

          const closeTags =
            currentLine.match(
              new RegExp(`</${tagName}\\s*>`, "gi")
            ) || [];

          const selfClosing =
            currentLine.match(
              new RegExp(`<${tagName}\\b(?:[^>"']|"[^"]*"|'[^']*')*\\/\\s*>`, "gi")
            ) || [];

          depth += openTags.length - selfClosing.length;
          depth -= closeTags.length;

          if (closeTags.length) {
            foundClosingTag = true;
          }

          rawHtmlLines.push(currentLine);
          index++;

          if (foundClosingTag && depth <= 0) {
            break;
          }

          if (
            ["img", "input", "br", "hr", "source"].includes(tagName) ||
            /\/>\s*$/.test(currentLine)
          ) {
            break;
          }
        }

        html.push(
          sanitizeRawHtml(
            rawHtmlLines.join("\n"),
            owner,
            repo,
            branch,
            baseDir
          )
        );

        continue;
      }

      const heading = line.match(
        /^(#{1,6})\s+(.+?)\s*#*\s*$/
      );

      if (heading) {
        flushParagraph();

        const level = heading[1].length;

        html.push(
          `<h${level}>${formatText(
            heading[2],
            owner,
            repo,
            branch,
            baseDir
          )}</h${level}>`
        );

        index++;
        continue;
      }

      if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
        flushParagraph();
        html.push("<hr>");
        index++;
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        flushParagraph();

        const quoteLines = [];

        while (
          index < lines.length &&
          /^\s*>\s?/.test(lines[index])
        ) {
          quoteLines.push(
            lines[index].replace(/^\s*>\s?/, "")
          );

          index++;
        }

        html.push(
          `<blockquote><p>${quoteLines
            .map(item =>
              formatText(item, owner, repo, branch, baseDir)
            )
            .join("<br>")}</p></blockquote>`
        );

        continue;
      }

      if (/^\s*[-+*]\s+/.test(line)) {
        flushParagraph();
        renderList(false);
        continue;
      }

      if (/^\s*\d+[.)]\s+/.test(line)) {
        flushParagraph();
        renderList(true);
        continue;
      }

      if (
        index + 1 < lines.length &&
        line.includes("|") &&
        isTableSeparator(lines[index + 1])
      ) {
        flushParagraph();

        const headers = splitTableRow(line);
        index += 2;

        const rows = [];

        while (
          index < lines.length &&
          lines[index].trim() &&
          lines[index].includes("|")
        ) {
          rows.push(splitTableRow(lines[index]));
          index++;
        }

        const thead = headers
          .map(cell => {
            return `<th>${formatText(
              cell,
              owner,
              repo,
              branch,
              baseDir
            )}</th>`;
          })
          .join("");

        const tbody = rows
          .map(row => {
            const cells = headers
              .map((_, cellIndex) => {
                return `<td>${formatText(
                  row[cellIndex] || "",
                  owner,
                  repo,
                  branch,
                  baseDir
                )}</td>`;
              })
              .join("");

            return `<tr>${cells}</tr>`;
          })
          .join("");

        html.push(
          `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`
        );

        continue;
      }

      paragraphLines.push(line);
      index++;
    }

    flushParagraph();

    return `
      <div class="markdown-body gp-mdp-body">
        ${html.join("\n")}
      </div>
    `;
  }

  function fallbackParse(text, owner, repo, branch) {
    if (typeof state.originalParseMarkdown === "function") {
      try {
        return state.originalParseMarkdown.call(
          utils,
          text,
          owner,
          repo,
          branch
        );
      } catch (error) {
        console.warn(
          "[MarkdownRenderPlus] 原始 Markdown 解析器调用失败：",
          error
        );
      }
    }

    return `<pre style="white-space:pre-wrap;">${escapeHtml(text)}</pre>`;
  }

  function patchOpenFile() {
    if (
      !extension ||
      !state.originalOpenFile ||
      state.patchedOpenFile
    ) {
      return;
    }

    state.patchedOpenFile = async function patchedOpenFile(file) {
      try {
        if (file?.path) {
          setCurrentFilePath(file.path);
        }
      } catch (error) {
        console.warn(
          "[MarkdownRenderPlus] 文件路径状态更新失败：",
          error
        );
      }

      return state.originalOpenFile.call(extension, file);
    };

    extension.openFile = state.patchedOpenFile;
  }

  state.enhancedParseMarkdown =
    function enhancedParseMarkdown(text, owner, repo, branch) {
      if (!text) return "";

      const safeOwner = owner || core?.currentOwner || "";
      const safeRepo = repo || core?.currentRepo || "";
      const safeBranch =
        branch || core?.currentBranch || "main";

      try {
        return parseMarkdown(
          text,
          safeOwner,
          safeRepo,
          safeBranch
        );
      } catch (error) {
        console.warn(
          "[MarkdownRenderPlus] 内置 Markdown 解析失败：",
          error
        );

        return fallbackParse(
          text,
          safeOwner,
          safeRepo,
          safeBranch
        );
      }
    };

  utils.parseMarkdown = state.enhancedParseMarkdown;

  patchOpenFile();

  console.log(
    "[MarkdownRenderPlus] 安全 Markdown 解析器已初始化。"
  );
};

plugin.onHook = function (hookName, data) {
  const state = this._mdpState;

  if (
    hookName === "file:open" &&
    data?.file?.path &&
    state
  ) {
    try {
      const path = String(data.file.path)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/\/+$/, "");

      const index = path.lastIndexOf("/");

      state.currentFilePath = path;
      state.currentBaseDir =
        index >= 0 ? path.slice(0, index) : "";
    } catch (error) {
      console.warn(
        "[MarkdownRenderPlus] file:open Hook 路径处理失败：",
        error
      );
    }
  }

  if (
    hookName === "file:open" ||
    hookName === "mode:switch" ||
    hookName === "dir:load"
  ) {
    setTimeout(() => {
      const settings = {
        ...plugin.settings,
        ...(this.settings || {})
      };

      document
        .querySelectorAll(".gp-mdp-body a[href]")
        .forEach(link => {
          if (settings.openLinksInNewTab) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          } else {
            link.removeAttribute("target");
            link.removeAttribute("rel");
          }
        });
    }, 50);
  }
};

plugin.destroy = function () {
  const state = this._mdpState;

  if (!state || state.disposed) {
    return;
  }

  state.disposed = true;

  try {
    if (
      state.utils?.parseMarkdown ===
      state.enhancedParseMarkdown
    ) {
      state.utils.parseMarkdown =
        state.originalParseMarkdown;
    }
  } catch (error) {
    console.warn(
      "[MarkdownRenderPlus] 恢复 parseMarkdown 失败：",
      error
    );
  }

  try {
    if (
      state.extension &&
      state.originalOpenFile &&
      state.extension.openFile === state.patchedOpenFile
    ) {
      state.extension.openFile = state.originalOpenFile;
    }
  } catch (error) {
    console.warn(
      "[MarkdownRenderPlus] 恢复 openFile 失败：",
      error
    );
  }

  this._mdpState = null;

  console.log(
    "[MarkdownRenderPlus] 插件已卸载，原始方法已恢复。"
  );
};
