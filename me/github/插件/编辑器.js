// ============================================================
// Monaco Editor 增强插件 (v2.2.0)
// - 浏览时也显示 Monaco 编辑器，但只读禁止修改
// - 点击「修改模式」后 Monaco 变为可编辑
// - 语法高亮自动识别：文件名 / 扩展名 / 内容启发式识别
// - 未知文件可手动选择高亮语言，并记住扩展名
// - 保存时弹出 Diff 对比（隐藏未修改部分）
// 用法：在「插件」标签页粘贴本代码并加载
// ============================================================

plugin.id = "monaco-editor-enhance";
plugin.name = "Monaco 编辑器增强";
plugin.version = "2.2.0";
plugin.description = "Monaco Editor 替换原始 textarea，浏览时只读显示，编辑时可修改，支持自动语言识别、未知文件手动选择高亮、保存前 Diff 对比。";
plugin.tags = ["编辑器", "Monaco", "语法高亮", "自动识别", "手动高亮", "Diff", "只读浏览"];

plugin.style = `
.monaco-enhance-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.monaco-enhance-badge {
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 30;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(0,122,204,0.85);
  color: #fff;
  pointer-events: none;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.monaco-enhance-lang-select {
  position: absolute;
  top: 4px;
  right: 150px;
  z-index: 31;
  background: rgba(30,30,30,0.92);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 11px;
  outline: none;
  max-width: 150px;
}

.monaco-enhance-lang-select:hover {
  border-color: rgba(0,122,204,0.8);
}

.monaco-enhance-lang-select option {
  background: #1e1e1e;
  color: #fff;
}

.mdiff-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  z-index: 100600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mdiff-card {
  width: 900px;
  max-width: calc(100vw - 40px);
  height: 640px;
  max-height: calc(100vh - 40px);
  background: #1e1e1e;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #fff;
  font-family: system-ui, sans-serif;
}

.mdiff-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
}

.mdiff-title {
  font-weight: 800;
}

.mdiff-sub {
  font-size: 12px;
  opacity: 0.65;
  word-break: break-all;
}

.mdiff-spacer {
  flex: 1;
}

.mdiff-body {
  flex: 1;
  min-height: 0;
}

.mdiff-foot {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.mdiff-stat {
  font-size: 12px;
  opacity: 0.85;
}

.mdiff-add {
  color: #4caf50;
}

.mdiff-del {
  color: #f06292;
}

.mdiff-btn {
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.08);
  color: #fff;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
}

.mdiff-btn:hover {
  background: rgba(255,255,255,0.14);
}

.mdiff-btn-primary {
  background: rgba(40,167,69,0.85);
  border-color: rgba(40,167,69,0.9);
}

.mdiff-btn-primary:hover {
  background: rgba(40,167,69,0.95);
}
`;

const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs";

const MANUAL_LANG_STORAGE_KEY = "monaco_editor_enhance_manual_lang_map";

const EXT_LANG = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",

  ts: "typescript",
  tsx: "typescript",

  json: "json",
  jsonc: "json",

  html: "html",
  htm: "html",
  xhtml: "html",
  vue: "html",
  svelte: "html",

  xml: "xml",
  svg: "xml",

  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",

  py: "python",
  pyw: "python",

  c: "c",
  h: "c",

  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hh: "cpp",
  hxx: "cpp",

  cs: "csharp",
  java: "java",
  go: "go",
  rs: "rust",

  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",

  sh: "shell",
  bash: "shell",
  zsh: "shell",
  fish: "shell",

  bat: "bat",
  cmd: "bat",
  ps1: "powershell",

  yml: "yaml",
  yaml: "yaml",

  md: "markdown",
  markdown: "markdown",

  sql: "sql",
  lua: "lua",

  toml: "ini",
  ini: "ini",
  cfg: "ini",
  conf: "ini",
  env: "ini",

  dockerfile: "dockerfile",
  makefile: "makefile",

  txt: "plaintext",
  log: "plaintext"
};

const SPECIAL_NAME_LANG = {
  "dockerfile": "dockerfile",
  "docker-compose.yml": "yaml",
  "docker-compose.yaml": "yaml",
  "makefile": "makefile",
  "cmakelists.txt": "cmake",

  ".gitignore": "ignore",
  ".dockerignore": "ignore",
  ".npmignore": "ignore",

  ".env": "ini",
  ".env.local": "ini",
  ".env.development": "ini",
  ".env.production": "ini",
  ".npmrc": "ini",
  ".yarnrc": "ini",

  "package.json": "json",
  "package-lock.json": "json",
  "tsconfig.json": "json",
  "jsconfig.json": "json",
  "composer.json": "json",

  "cargo.toml": "ini",
  "pyproject.toml": "ini"
};

const LANGUAGE_OPTIONS = [
  ["plaintext", "Plain Text"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["json", "JSON"],
  ["html", "HTML"],
  ["xml", "XML"],
  ["css", "CSS"],
  ["scss", "SCSS"],
  ["less", "Less"],
  ["markdown", "Markdown"],
  ["python", "Python"],
  ["c", "C"],
  ["cpp", "C++"],
  ["csharp", "C#"],
  ["java", "Java"],
  ["go", "Go"],
  ["rust", "Rust"],
  ["php", "PHP"],
  ["ruby", "Ruby"],
  ["swift", "Swift"],
  ["kotlin", "Kotlin"],
  ["shell", "Shell"],
  ["bat", "Batch"],
  ["powershell", "PowerShell"],
  ["yaml", "YAML"],
  ["sql", "SQL"],
  ["lua", "Lua"],
  ["ini", "INI / TOML / ENV"],
  ["dockerfile", "Dockerfile"],
  ["makefile", "Makefile"],
  ["cmake", "CMake"],
  ["ignore", "Ignore"]
];

let monacoLoadPromise = null;

function loadMonaco() {
  if (window.monaco) return Promise.resolve(window.monaco);
  if (monacoLoadPromise) return monacoLoadPromise;

  monacoLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MONACO_CDN}/loader.js`;

    script.onload = () => {
      window.require.config({
        paths: {
          vs: MONACO_CDN
        }
      });

      window.MonacoEnvironment = {
        getWorkerUrl: function () {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = { baseUrl: '${MONACO_CDN}/' };
            importScripts('${MONACO_CDN}/base/worker/workerMain.js');
          `)}`;
        }
      };

      window.require(["vs/editor/editor.main"], () => resolve(window.monaco));
    };

    script.onerror = () => reject(new Error("Monaco CDN 加载失败"));
    document.head.appendChild(script);
  });

  return monacoLoadPromise;
}

function getManualLangMap() {
  try {
    return JSON.parse(localStorage.getItem(MANUAL_LANG_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveManualLangMap(map) {
  try {
    localStorage.setItem(MANUAL_LANG_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function getExt(name) {
  const lower = String(name || "").toLowerCase();
  if (!lower.includes(".")) return "";
  return lower.split(".").pop() || "";
}

function getLangKeyByFileName(name) {
  const lower = String(name || "").toLowerCase();
  const ext = getExt(lower);

  if (ext) return `ext:${ext}`;
  return `file:${lower}`;
}

function getManualLang(name) {
  const map = getManualLangMap();
  return map[getLangKeyByFileName(name)] || "";
}

function setManualLang(name, lang) {
  const map = getManualLangMap();
  map[getLangKeyByFileName(name)] = lang;
  saveManualLangMap(map);
}

function langFromName(name) {
  const lower = String(name || "").toLowerCase();

  if (SPECIAL_NAME_LANG[lower]) {
    return SPECIAL_NAME_LANG[lower];
  }

  const ext = getExt(lower);

  if (EXT_LANG[ext]) {
    return EXT_LANG[ext];
  }

  return "plaintext";
}

function detectLangFromContent(text) {
  const src = String(text || "");
  const trimmed = src.trim();

  if (!trimmed) return "plaintext";

  const firstLine = trimmed.split(/\r?\n/, 1)[0] || "";

  // Shebang
  if (/^#!.*\b(node|deno)\b/.test(firstLine)) return "javascript";
  if (/^#!.*\bpython[0-9.]*\b/.test(firstLine)) return "python";
  if (/^#!.*\b(bash|sh|zsh|fish)\b/.test(firstLine)) return "shell";
  if (/^#!.*\bruby\b/.test(firstLine)) return "ruby";
  if (/^#!.*\bphp\b/.test(firstLine)) return "php";

  // JSON
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {}
  }

  // HTML
  if (
    /^<!doctype html/i.test(trimmed) ||
    /<html[\s>]/i.test(trimmed) ||
    /<body[\s>]/i.test(trimmed) ||
    /<script[\s>]/i.test(trimmed)
  ) {
    return "html";
  }

  // XML
  if (/^<\?xml/i.test(trimmed)) return "xml";

  // Markdown
  if (
    /^#{1,6}\s+/m.test(trimmed) ||
    /^\s*[-*+]\s+/m.test(trimmed) ||
    /\[[^\]]+\]\([^)]+\)/.test(trimmed)
  ) {
    return "markdown";
  }

  // CSS
  if (
    /[.#]?[a-zA-Z0-9_-]+\s*\{[\s\S]*?:[\s\S]*?;[\s\S]*?\}/.test(trimmed) &&
    !/function\s+\w+\s*\(/.test(trimmed)
  ) {
    return "css";
  }

  // SQL
  if (/^\s*(select|insert|update|delete|create|alter|drop)\s+/i.test(trimmed)) {
    return "sql";
  }

  // Python
  if (
    /^\s*def\s+\w+\s*\(/m.test(trimmed) ||
    /^\s*class\s+\w+[:\(]/m.test(trimmed) ||
    /^\s*import\s+\w+/m.test(trimmed) ||
    /^\s*from\s+\w+\s+import\s+/m.test(trimmed)
  ) {
    return "python";
  }

  // JavaScript / TypeScript
  if (
    /\bfunction\s+\w+\s*\(/.test(trimmed) ||
    /\bconst\s+\w+\s*=/.test(trimmed) ||
    /\blet\s+\w+\s*=/.test(trimmed) ||
    /\bvar\s+\w+\s*=/.test(trimmed) ||
    /\bexport\s+(default\s+)?/.test(trimmed) ||
    /\bimport\s+.*\s+from\s+["']/.test(trimmed)
  ) {
    if (
      /\binterface\s+\w+/.test(trimmed) ||
      /:\s*(string|number|boolean|any|unknown|void)\b/.test(trimmed)
    ) {
      return "typescript";
    }
    return "javascript";
  }

  // C / C++
  if (
    /#include\s*<[^>]+>/.test(trimmed) ||
    /\bint\s+main\s*\(/.test(trimmed)
  ) {
    if (/\bstd::/.test(trimmed) || /#include\s*<iostream>/.test(trimmed)) {
      return "cpp";
    }
    return "c";
  }

  // Java
  if (/\bpublic\s+class\s+\w+/.test(trimmed)) return "java";

  // Go
  if (/^\s*package\s+\w+/m.test(trimmed) && /\bfunc\s+\w+\s*\(/.test(trimmed)) {
    return "go";
  }

  // Rust
  if (/\bfn\s+main\s*\(/.test(trimmed) || /\blet\s+mut\s+/.test(trimmed)) {
    return "rust";
  }

  // PHP
  if (/^<\?php/.test(trimmed)) return "php";

  // YAML
  if (
    /^[a-zA-Z0-9_-]+:\s*.+$/m.test(trimmed) &&
    !/[{};]/.test(trimmed.slice(0, 500))
  ) {
    return "yaml";
  }

  return "plaintext";
}

function detectLanguage(name, text) {
  // 1. 用户手动设置优先
  const manual = getManualLang(name);
  if (manual) return manual;

  // 2. 文件名 / 扩展名判断
  const byName = langFromName(name);
  if (byName !== "plaintext") return byName;

  // 3. 内容启发式判断
  return detectLangFromContent(text);
}

function updateBadgeText(editor, badge, fallbackLang) {
  if (!badge) return;

  const editing = !!plugin._ctx?.extension?.core?.isEditMode;
  const lang = editor?.getModel?.()?.getLanguageId?.() || fallbackLang || "plaintext";

  badge.textContent = editing ? `${lang} · 编辑` : `${lang} · 只读`;
  badge.style.background = editing ? "rgba(40,167,69,0.85)" : "rgba(0,122,204,0.85)";
}

function createLanguageSelector(monaco, editor, fileName, initialLang, badge) {
  const select = document.createElement("select");
  select.className = "monaco-enhance-lang-select";
  select.title = "手动选择语法高亮，选择后会记住该扩展名";

  LANGUAGE_OPTIONS.forEach(([value, label]) => {
    const op = document.createElement("option");
    op.value = value;
    op.textContent = label;
    select.appendChild(op);
  });

  const hasOption = LANGUAGE_OPTIONS.some(([value]) => value === initialLang);
  select.value = hasOption ? initialLang : "plaintext";

  updateBadgeText(editor, badge, select.value);

  select.onchange = () => {
    const lang = select.value;

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, lang);
    }

    setManualLang(fileName, lang);
    updateBadgeText(editor, badge, lang);

    console.log(`[Monaco] 手动设置语言: ${fileName} -> ${lang}`);
  };

  return select;
}

// 简单行级 diff 统计（用于显示 +/-）
function diffStats(oldText, newText) {
  const o = oldText.split("\n");
  const n = newText.split("\n");

  const oSet = new Map();
  o.forEach(l => oSet.set(l, (oSet.get(l) || 0) + 1));

  let added = 0;
  n.forEach(l => {
    if (oSet.get(l) > 0) oSet.set(l, oSet.get(l) - 1);
    else added++;
  });

  const nSet = new Map();
  n.forEach(l => nSet.set(l, (nSet.get(l) || 0) + 1));

  let removed = 0;
  o.forEach(l => {
    if (nSet.get(l) > 0) nSet.set(l, nSet.get(l) - 1);
    else removed++;
  });

  return {
    added,
    removed
  };
}

let activeEditor = null;
let activeContainer = null;
let activePreWrap = null;
let activeTextarea = null;
let originalText = "";
let currentFile = null;
let saveBtnHooked = null;

function disposeActive() {
  if (activeEditor) {
    try {
      activeEditor.dispose();
    } catch (e) {}
    activeEditor = null;
  }

  if (activeContainer) {
    if (activeContainer._observer) {
      activeContainer._observer.disconnect();
    }

    if (activeContainer.parentElement) {
      activeContainer.remove();
    }
  }

  // 尽量恢复宿主原始显示，避免切换文件/模式后残留隐藏状态
  if (activePreWrap) {
    try {
      activePreWrap.style.display = "";
    } catch (e) {}
  }

  if (activeTextarea) {
    try {
      activeTextarea.style.display = "none";
    } catch (e) {}
  }

  activeContainer = null;
  activePreWrap = null;
  activeTextarea = null;
  saveBtnHooked = null;
  currentFile = null;
}

// 展示 Diff，返回 Promise<boolean>（true = 确认提交）
function showDiffDialog(monaco, oldText, newText, fileName) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "mdiff-overlay";

    const card = document.createElement("div");
    card.className = "mdiff-card";

    const stats = diffStats(oldText, newText);

    const head = document.createElement("div");
    head.className = "mdiff-head";
    head.innerHTML = `
      <div class="mdiff-title">提交确认 · Diff</div>
      <div class="mdiff-sub">${fileName}</div>
      <div class="mdiff-spacer"></div>
      <div class="mdiff-stat">
        <span class="mdiff-add">+${stats.added}</span>
        &nbsp;
        <span class="mdiff-del">-${stats.removed}</span>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "mdiff-body";

    const foot = document.createElement("div");
    foot.className = "mdiff-foot";

    const hint = document.createElement("div");
    hint.className = "mdiff-stat";
    hint.style.flex = "1";
    hint.textContent = "已折叠未修改区域，仅显示变更上下文。";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "mdiff-btn";
    cancelBtn.textContent = "取消";

    const okBtn = document.createElement("button");
    okBtn.className = "mdiff-btn mdiff-btn-primary";
    okBtn.textContent = "确认提交";

    foot.appendChild(hint);
    foot.appendChild(cancelBtn);
    foot.appendChild(okBtn);

    card.appendChild(head);
    card.appendChild(body);
    card.appendChild(foot);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const lang = detectLanguage(fileName, newText);

    const diffEditor = monaco.editor.createDiffEditor(body, {
      theme: "vs-dark",
      automaticLayout: true,
      readOnly: true,
      renderSideBySide: true,
      fontSize: 13,
      hideUnchangedRegions: {
        enabled: true,
        contextLineCount: 3,
        minimumLineCount: 3,
        revealLineCount: 20
      },
      minimap: {
        enabled: false
      }
    });

    const originalModel = monaco.editor.createModel(oldText, lang);
    const modifiedModel = monaco.editor.createModel(newText, lang);

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });

    const cleanup = (result) => {
      try {
        diffEditor.dispose();
      } catch (e) {}

      try {
        originalModel.dispose();
        modifiedModel.dispose();
      } catch (e) {}

      if (overlay.parentElement) {
        overlay.remove();
      }

      resolve(result);
    };

    cancelBtn.onclick = () => cleanup(false);
    okBtn.onclick = () => cleanup(true);

    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
}

plugin._ctx = null;

plugin.init = (ctx) => {
  plugin._ctx = ctx;
  loadMonaco().catch(e => console.warn("[Monaco] 预加载失败:", e));
};

plugin.onHook = async (hookName, data) => {
  const ext = plugin._ctx.extension;

  if (hookName === "file:open") {
    disposeActive();

    const refs = ext.ui.fileViewRefs;
    if (!refs || !refs.textarea) return;

    const file = data.file;
    const text = data.text;

    currentFile = file;
    originalText = text;

    const extName = getExt(file.name);

    // 图片等二进制文件不启用 Monaco
    if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"].includes(extName)) {
      return;
    }

    const textarea = refs.textarea;
    const parent = textarea.parentElement;
    if (!parent) return;

    let monaco;
    try {
      monaco = await loadMonaco();
    } catch (e) {
      console.warn("[Monaco] 加载失败，保留原生编辑器:", e);
      return;
    }

    // 隐藏原始 textarea，作为数据桥
    textarea.style.display = "none";
    textarea.dataset.monacoHidden = "1";

    activeTextarea = textarea;
    activePreWrap = refs.preWrap || null;

    // 浏览时也由 Monaco 替代原 pre 预览
    if (activePreWrap) {
      activePreWrap.style.display = "none";
    }

    // 创建 Monaco 容器
    const container = document.createElement("div");
    container.className = "monaco-enhance-container";

    // 关键：浏览时也显示 Monaco
    container.style.display = "block";

    const badge = document.createElement("div");
    badge.className = "monaco-enhance-badge";
    badge.textContent = "Monaco";
    container.appendChild(badge);

    parent.appendChild(container);
    activeContainer = container;

    const detectedLang = detectLanguage(file.name, text);

    const editor = monaco.editor.create(container, {
      value: text,
      language: detectedLang,
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 13,
      minimap: {
        enabled: true
      },
      scrollBeyondLastLine: false,
      tabSize: 2,
      wordWrap: "on",
      folding: true,
      formatOnPaste: true,
      formatOnType: false,

      // 关键：默认浏览状态只读
      readOnly: !ext.core.isEditMode,
      domReadOnly: !ext.core.isEditMode
    });

    activeEditor = editor;

    // 语言手动选择器
    const langSelector = createLanguageSelector(monaco, editor, file.name, detectedLang, badge);
    container.appendChild(langSelector);

    // 实时同步到 textarea，复用宿主保存逻辑
    editor.onDidChangeModelContent(() => {
      textarea.value = editor.getValue();
    });

    // 浏览/编辑模式联动：
    // - 浏览时显示 Monaco，但只读
    // - 修改模式时 Monaco 可编辑
    // - 始终隐藏宿主 pre 和 textarea，避免重复显示
    const syncEditorMode = () => {
      const editing = !!ext.core.isEditMode;

      // Monaco 始终显示
      container.style.display = "block";

      // 隐藏宿主源码/预览区域
      if (refs.preWrap) {
        refs.preWrap.style.display = "none";
      }

      // textarea 只作为数据桥，不显示
      textarea.style.display = "none";

      // 浏览状态只读，编辑状态可写
      editor.updateOptions({
        readOnly: !editing,
        domReadOnly: !editing
      });

      // 进入编辑模式时，同步 textarea 中的最新内容
      if (editing) {
        if (editor.getValue() !== textarea.value) {
          editor.setValue(textarea.value);
        }
      }

      updateBadgeText(editor, badge, detectedLang);

      setTimeout(() => editor.layout(), 50);
    };

    // 监听宿主 _toggleEditMode 对 textarea.style 的修改
    const observer = new MutationObserver(() => {
      syncEditorMode();
    });

    observer.observe(textarea, {
      attributes: true,
      attributeFilter: ["style"]
    });

    container._observer = observer;

    // 初始化时立即同步一次：浏览状态也显示 Monaco
    syncEditorMode();

    // Ctrl / Cmd + S 触发保存
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // 只有修改模式下才允许保存
      if (
        ext.core.isEditMode &&
        refs.saveBtn &&
        refs.saveBtn.style.display !== "none"
      ) {
        refs.saveBtn.click();
      }
    });

    // ===== 拦截保存按钮：先展示 Diff，确认后才走原逻辑 =====
    const saveBtn = refs.saveBtn;

    if (saveBtn && saveBtnHooked !== saveBtn) {
      saveBtnHooked = saveBtn;

      saveBtn.addEventListener("click", async function diffGate(e) {
        // 已通过 diff 确认的二次点击直接放行
        if (saveBtn._diffConfirmed) {
          saveBtn._diffConfirmed = false;
          return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();

        // 非编辑模式不允许提交
        if (!ext.core.isEditMode) {
          alert("当前是只读浏览模式，请先点击「修改模式」再保存。");
          return;
        }

        const newText = editor.getValue();

        if (newText === originalText) {
          alert("内容无变更，无需提交。");
          return;
        }

        let mon;
        try {
          mon = await loadMonaco();
        } catch {
          return;
        }

        const confirmed = await showDiffDialog(mon, originalText, newText, currentFile.name);
        if (!confirmed) return;

        // 同步最新内容到 textarea，标记放行，触发原保存
        textarea.value = newText;
        saveBtn._diffConfirmed = true;
        saveBtn.click();

        // 提交成功后更新基准
        originalText = newText;
      }, true);
    }
  }

  if (
    hookName === "dir:load" ||
    hookName === "mode:switch" ||
    hookName === "ui:hide"
  ) {
    disposeActive();
  }
};
