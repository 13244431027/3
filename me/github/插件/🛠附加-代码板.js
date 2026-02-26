plugin.id = "proplus";
plugin.name = "代码板 ";
plugin.version = "2.0.0";

plugin.style = `
.cb-overlay{position:fixed;inset:0;z-index:100050;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.cb-card{width:min(1240px,97vw);height:min(780px,94vh);background:rgba(15,15,15,.92);border:1px solid rgba(255,255,255,.18);border-radius:12px;backdrop-filter:blur(10px);box-shadow:0 12px 40px rgba(0,0,0,.6);display:flex;flex-direction:column;color:#fff;font-family:system-ui,-apple-system,sans-serif;overflow:hidden}
.cb-top{display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid rgba(255,255,255,.12)}
.cb-title{font-weight:800;font-size:14px}
.cb-small{font-size:11px;opacity:.75}
.cb-body{flex:1;display:flex;overflow:hidden}
.cb-left{width:340px;min-width:260px;max-width:460px;border-right:1px solid rgba(255,255,255,.12);display:flex;flex-direction:column;overflow:hidden}
.cb-sec{padding:10px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.cb-tree{flex:1;overflow:auto;padding:8px}
.cb-node{padding:6px 8px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:8px}
.cb-node:hover{background:rgba(255,255,255,.06)}
.cb-node.active{background:rgba(80,160,255,.18);border:1px solid rgba(80,160,255,.25)}
.cb-node .name{font-size:12px;opacity:.96;word-break:break-all;flex:1}
.cb-node .meta{font-size:10px;opacity:.7}
.cb-indent{display:inline-block;width:12px}
.cb-right{flex:1;display:flex;flex-direction:column;overflow:hidden}
.cb-filetabs{display:flex;gap:6px;padding:8px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2)}
.cb-tab{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);cursor:pointer;display:flex;gap:8px;align-items:center;max-width:320px}
.cb-tab.active{background:rgba(255,255,255,.18)}
.cb-tab .dot{width:8px;height:8px;border-radius:50%;background:#888}
.cb-tab.dirty .dot{background:#ffcc66}
.cb-tab .tname{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cb-toolbar{display:flex;gap:8px;padding:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,.08)}
.cb-split{flex:1;display:flex;overflow:hidden}
.cb-editorwrap{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;background:#111}
.cb-editor{flex:1;min-height:0}
.cb-fallback{flex:1;width:100%;resize:none;border:none;outline:none;background:#111;color:#e6e6e6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;font-size:12.5px;line-height:1.5;padding:10px;box-sizing:border-box;tab-size:2}
.cb-side{width:46%;min-width:360px;max-width:780px;border-left:1px solid rgba(255,255,255,.12);background:#0d0d0d;display:flex;flex-direction:column;overflow:hidden}
.cb-sidetabs{display:flex;gap:6px;padding:8px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);flex-wrap:wrap}
.cb-stab{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);cursor:pointer}
.cb-stab.active{background:rgba(255,255,255,.18)}
.cb-sidebody{flex:1;overflow:auto;padding:10px}
.cb-sidebody pre{margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;font-size:12.5px}
.cb-status{padding:8px 10px;font-size:12px;opacity:.85;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;gap:10px;align-items:center}
.cb-kbd{font-family:ui-monospace,monospace;background:#222;border:1px solid #444;padding:1px 6px;border-radius:6px;font-size:11px}
.cb-diff-add{background:rgba(40,167,69,.16);border-left:3px solid rgba(40,167,69,.65);padding:2px 8px;margin:2px 0}
.cb-diff-del{background:rgba(255,80,80,.14);border-left:3px solid rgba(255,80,80,.65);padding:2px 8px;margin:2px 0;text-decoration:line-through;opacity:.9}
.cb-diff-ctx{opacity:.85;padding:2px 8px;margin:2px 0}
`;

plugin.init = (ctx) => {
  plugin._ctx = ctx;
  const { ui, components } = ctx;
  const btn = components.createWindowButton("代码板", { background: "rgba(255,255,255,0.14)" });
  btn.title = "打开代码板（CodeMirror 多文件编辑器）";
  btn.onclick = () => plugin.open();
  plugin._btn = btn;
  if (ui?.tabs) ui.tabs.appendChild(btn);
};

plugin.onHook = (hookName) => {
  const ctx = plugin._ctx;
  if (!ctx) return;
  if (hookName === "ui:ready") {
    if (ctx.ui?.tabs && plugin._btn && !plugin._btn.isConnected) ctx.ui.tabs.appendChild(plugin._btn);
  }
};

plugin._state = null;
plugin._overlay = null;
plugin._refs = null;

// ----------------- Open UI -----------------
plugin.open = async () => {
  const { core, utils, components } = plugin._ctx;

  if (plugin._overlay?.isConnected) {
    plugin._overlay.style.display = "flex";
    plugin._refreshRepoInfo();
    plugin._renderFileTabs();
    plugin._renderTree();
    plugin._renderSide();
    return;
  }

  plugin._state = {
    files: new Map(),  // id -> {id,path,name,text,baseText,dirty,sha,lang,from}
    order: [],
    activeId: null,

    // tree
    treeItems: [],
    treeRoot: null,
    expanded: new Set(), // expanded dir path
    treeFilter: "",

    // side tabs
    sideTab: "ai", // ai|diff|preview
    aiOut: "",
    aiStreaming: false,

    // libs
    cmReady: false,
    cmFail: null,
    diffReady: false,
    diffFail: null,

    // editor handle
    editor: null, // CodeMirror EditorView
    fallbackTextarea: null
  };

  const overlay = document.createElement("div");
  overlay.className = "cb-overlay";
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.style.display = "none"; });

  const card = document.createElement("div");
  card.className = "cb-card";

  const top = document.createElement("div");
  top.className = "cb-top";
  const title = document.createElement("div");
  title.className = "cb-title";
  title.textContent = "代码板 CodeBoard (CodeMirror)";
  const repoInfo = document.createElement("div");
  repoInfo.className = "cb-small";
  repoInfo.style.marginLeft = "8px";
  const spacer = document.createElement("div"); spacer.style.flex = "1";

  const loadCMBtn = components.createWindowButton("加载编辑器", { background: "rgba(80,160,255,0.18)" });
  loadCMBtn.onclick = async () => { await plugin._ensureCodeMirror(); };

  const close = components.createWindowButton("×", { padding: "4px 10px", background: "rgba(255,80,80,0.25)" });
  close.onclick = () => (overlay.style.display = "none");

  top.appendChild(title);
  top.appendChild(repoInfo);
  top.appendChild(spacer);
  top.appendChild(loadCMBtn);
  top.appendChild(close);

  const body = document.createElement("div");
  body.className = "cb-body";

  // Left
  const left = document.createElement("div");
  left.className = "cb-left";

  const sec1 = document.createElement("div");
  sec1.className = "cb-sec";

  const newBtn = components.createWindowButton("新建", { background: "rgba(100,200,100,0.18)" });
  newBtn.onclick = () => {
    const p = prompt("输入文件路径（相对仓库根目录或仅文件名）", "src/main.js");
    if (!p) return;
    plugin._openOrCreate({ path: p.replace(/^\/+/, ""), text: "", baseText: "", from: "manual" });
  };

  const importRepoBtn = components.createWindowButton("从路径导入", { background: "rgba(255,160,60,0.18)" });
  importRepoBtn.onclick = async () => {
    const p = prompt("输入仓库文件路径（相对根目录）", core.currentPath ? `${core.currentPath}/` : "README.md");
    if (!p) return;
    await plugin._importFromRepo(p.replace(/^\/+/, ""));
  };

  const importLocalBtn = components.createWindowButton("本地导入", { background: "rgba(200,120,255,0.18)" });
  importLocalBtn.onclick = () => plugin._importLocal();

  const refreshTreeBtn = components.createWindowButton("刷新树");
  refreshTreeBtn.onclick = () => plugin._loadRepoTree(true);

  sec1.appendChild(newBtn);
  sec1.appendChild(importRepoBtn);
  sec1.appendChild(importLocalBtn);
  sec1.appendChild(refreshTreeBtn);

  const sec2 = document.createElement("div");
  sec2.className = "cb-sec";
  sec2.style.flexWrap = "nowrap";

  const searchInp = utils.input("搜索文件/路径…");
  searchInp.style.flex = "1";
  searchInp.oninput = () => { plugin._state.treeFilter = searchInp.value.trim(); plugin._renderTree(true); };

  sec2.appendChild(searchInp);

  const tree = document.createElement("div");
  tree.className = "cb-tree";
  tree.innerHTML = `<div class="cb-small">点击“刷新树”加载仓库目录结构。</div>`;

  left.appendChild(sec1);
  left.appendChild(sec2);
  left.appendChild(tree);

  // Right
  const right = document.createElement("div");
  right.className = "cb-right";

  const fileTabs = document.createElement("div");
  fileTabs.className = "cb-filetabs";

  const toolbar = document.createElement("div");
  toolbar.className = "cb-toolbar";

  const saveBtn = components.createWindowButton("保存(上传)", { background: "#28a745" });
  saveBtn.onclick = () => plugin._saveActive(false);

  const saveAsBtn = components.createWindowButton("另存为(上传)");
  saveAsBtn.onclick = () => plugin._saveActive(true);

  const diffBtn = components.createWindowButton("Diff", { background: "rgba(255,255,255,0.10)" });
  diffBtn.onclick = async () => { plugin._state.sideTab = "diff"; await plugin._ensureDiff(); plugin._renderSide(); };

  const toAiBtn = components.createWindowButton("发送到AI", { background: "rgba(80,160,255,0.22)" });
  toAiBtn.onclick = async () => { plugin._state.sideTab = "ai"; plugin._renderSide(); await plugin._sendActiveToAI(); };

  const stopAiBtn = components.createWindowButton("停止AI");
  stopAiBtn.onclick = () => { plugin._ctx.core.aiManager.abort(); };

  const rewriteBtn = components.createWindowButton("AI选区改写", { background: "rgba(255,100,200,0.20)" });
  rewriteBtn.onclick = () => plugin._rewriteSelection();

  const dlBtn = components.createWindowButton("下载");
  dlBtn.onclick = () => plugin._downloadActive();

  const pathLab = document.createElement("div");
  pathLab.className = "cb-small";
  pathLab.style.marginLeft = "auto";
  pathLab.textContent = "未选择文件";

  toolbar.appendChild(saveBtn);
  toolbar.appendChild(saveAsBtn);
  toolbar.appendChild(diffBtn);
  toolbar.appendChild(toAiBtn);
  toolbar.appendChild(stopAiBtn);
  toolbar.appendChild(rewriteBtn);
  toolbar.appendChild(dlBtn);
  toolbar.appendChild(pathLab);

  const split = document.createElement("div");
  split.className = "cb-split";

  const editorWrap = document.createElement("div");
  editorWrap.className = "cb-editorwrap";
  const editorHost = document.createElement("div");
  editorHost.className = "cb-editor";
  editorWrap.appendChild(editorHost);

  // fallback textarea (if CM fails)
  const fallback = document.createElement("textarea");
  fallback.className = "cb-fallback";
  fallback.style.display = "none";
  fallback.placeholder = "CodeMirror 未加载，使用 textarea 编辑（仍可保存/AI/diff）";
  fallback.addEventListener("input", () => {
    const f = plugin._getActive();
    if (!f) return;
    f.text = fallback.value;
    f.dirty = (f.text !== (f.baseText ?? ""));
    plugin._renderFileTabs();
    if (plugin._state.sideTab === "diff") plugin._renderSide();
  });
  fallback.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault(); plugin._saveActive(false);
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = fallback.selectionStart, end = fallback.selectionEnd;
      const ins = "  ";
      fallback.value = fallback.value.slice(0,start) + ins + fallback.value.slice(end);
      fallback.selectionStart = fallback.selectionEnd = start + ins.length;
      fallback.dispatchEvent(new Event("input"));
    }
  });
  editorWrap.appendChild(fallback);

  const side = document.createElement("div");
  side.className = "cb-side";
  const sideTabs = document.createElement("div");
  sideTabs.className = "cb-sidetabs";
  const stPreview = document.createElement("button"); stPreview.className = "cb-stab"; stPreview.textContent = "预览";
  const stDiff = document.createElement("button"); stDiff.className = "cb-stab"; stDiff.textContent = "Diff";
  const stAI = document.createElement("button"); stAI.className = "cb-stab"; stAI.textContent = "AI输出";
  [stPreview, stDiff, stAI].forEach(b => {
    b.onclick = async () => {
      plugin._state.sideTab = (b === stPreview ? "preview" : b === stDiff ? "diff" : "ai");
      if (plugin._state.sideTab === "diff") await plugin._ensureDiff();
      plugin._renderSide();
    };
  });
  sideTabs.appendChild(stPreview);
  sideTabs.appendChild(stDiff);
  sideTabs.appendChild(stAI);

  const sideBody = document.createElement("div");
  sideBody.className = "cb-sidebody";
  sideBody.innerHTML = `<div class="cb-small">右侧用于 AI 输出 / Diff / 预览。</div>`;

  side.appendChild(sideTabs);
  side.appendChild(sideBody);

  split.appendChild(editorWrap);
  split.appendChild(side);

  const status = document.createElement("div");
  status.className = "cb-status";
  const statusL = document.createElement("div");
  statusL.innerHTML = `快捷键：<span class="cb-kbd">Ctrl/Cmd+S</span> 保存`;
  const statusR = document.createElement("div");
  statusR.className = "cb-small";
  status.appendChild(statusL);
  status.appendChild(statusR);

  right.appendChild(fileTabs);
  right.appendChild(toolbar);
  right.appendChild(split);
  right.appendChild(status);

  body.appendChild(left);
  body.appendChild(right);

  card.appendChild(top);
  card.appendChild(body);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  plugin._overlay = overlay;
  plugin._refs = {
    repoInfo, searchInp, tree,
    fileTabs, pathLab,
    editorHost, fallback,
    sideTabs: { stPreview, stDiff, stAI },
    sideBody,
    statusR
  };

  plugin._refreshRepoInfo();
  plugin._setStatus("就绪");
  await plugin._loadRepoTree(false);
  plugin._renderFileTabs();
  plugin._renderTree(false);
  plugin._renderSide();

  // 尝试自动加载 CM（失败则降级）
  plugin._ensureCodeMirror().catch(()=>{});
};

// ----------------- Status / helpers -----------------
plugin._setStatus = (msg) => { if (plugin._refs?.statusR) plugin._refs.statusR.textContent = msg || ""; };

plugin._refreshRepoInfo = () => {
  const { core } = plugin._ctx;
  const el = plugin._refs?.repoInfo;
  if (!el) return;
  el.textContent = core.currentOwner && core.currentRepo
    ? `${core.currentOwner}/${core.currentRepo} @ ${core.currentBranch || core.defaultBranch || "main"}`
    : "未进入仓库（仍可本地/手动编辑）";
};

plugin._guessLang = (pathOrName) => {
  const ext = String(pathOrName||"").split(".").pop().toLowerCase();
  const map = {
    js:"javascript", jsx:"javascript",
    ts:"typescript", tsx:"typescript",
    py:"python",
    json:"json",
    html:"html", htm:"html",
    css:"css",
    md:"markdown",
    yml:"yaml", yaml:"yaml",
    c:"c", cpp:"cpp", h:"cpp",
    java:"java", go:"go", rs:"rust",
    php:"php", sh:"shell",
    txt:"plaintext"
  };
  return map[ext] || "plaintext";
};

plugin._makeId = (path) => `f:${path}:${Date.now()}:${Math.random().toString(16).slice(2)}`;

plugin._getActive = () => {
  const st = plugin._state;
  if (!st?.activeId) return null;
  return st.files.get(st.activeId) || null;
};

plugin._setActive = async (id) => {
  const st = plugin._state;
  st.activeId = id;
  plugin._renderFileTabs();
  await plugin._syncActiveToEditor();
  plugin._renderTree(false);
  plugin._renderSide();
};

plugin._openOrCreate = async ({ path, text, baseText, from, sha=null }) => {
  const st = plugin._state;

  if (path) {
    const exist = st.order.find(id => st.files.get(id)?.path === path);
    if (exist) return plugin._setActive(exist);
  }
  const id = plugin._makeId(path || "untitled");
  const f = {
    id,
    path: path || "",
    name: path ? path.split("/").pop() : "untitled",
    text: text || "",
    baseText: baseText ?? text ?? "",
    dirty: false,
    sha,
    lang: plugin._guessLang(path || "untitled"),
    from: from || "manual"
  };
  st.files.set(id, f);
  st.order.push(id);
  st.activeId = id;

  plugin._renderFileTabs();
  await plugin._syncActiveToEditor();
  plugin._renderTree(false);
  plugin._renderSide();
};

plugin._closeFile = async (id) => {
  const st = plugin._state;
  const f = st.files.get(id);
  if (!f) return;
  if (f.dirty && !confirm(`未保存：${f.path||f.name}\n确定关闭？`)) return;
  st.files.delete(id);
  st.order = st.order.filter(x => x !== id);
  if (st.activeId === id) st.activeId = st.order[0] || null;
  plugin._renderFileTabs();
  await plugin._syncActiveToEditor();
  plugin._renderTree(false);
  plugin._renderSide();
};

// ----------------- File tabs -----------------
plugin._renderFileTabs = () => {
  const { components } = plugin._ctx;
  const wrap = plugin._refs?.fileTabs;
  if (!wrap) return;
  wrap.innerHTML = "";

  const st = plugin._state;
  if (!st.order.length) {
    const tip = document.createElement("div");
    tip.className = "cb-small";
    tip.style.padding = "6px 10px";
    tip.textContent = "暂无打开文件：左侧新建/导入。";
    wrap.appendChild(tip);
    return;
  }

  st.order.forEach(id => {
    const f = st.files.get(id);
    if (!f) return;
    const tab = document.createElement("div");
    tab.className = "cb-tab" + (id === st.activeId ? " active" : "") + (f.dirty ? " dirty" : "");
    tab.title = f.path || f.name;
    tab.onclick = () => plugin._setActive(id);

    const dot = document.createElement("div"); dot.className = "dot";
    const name = document.createElement("div"); name.className = "tname";
    name.textContent = f.path ? f.path.split("/").pop() : f.name;

    const close = components.createWindowButton("×", { padding:"0 8px", fontSize:"12px" });
    close.onclick = (e) => { e.stopPropagation(); plugin._closeFile(id); };

    tab.appendChild(dot);
    tab.appendChild(name);
    tab.appendChild(close);
    wrap.appendChild(tab);
  });

  // path label
  const lab = plugin._refs?.pathLab;
  const f = plugin._getActive();
  if (lab) lab.textContent = f ? `路径: ${f.path || f.name}` : "未选择文件";
};

// ----------------- Tree (expand/collapse) -----------------
plugin._loadRepoTree = async (force=false) => {
  const { core, api } = plugin._ctx;
  const treeEl = plugin._refs?.tree;
  if (!treeEl) return;

  if (!core.currentOwner || !core.currentRepo) {
    plugin._state.treeItems = [];
    plugin._state.treeRoot = null;
    treeEl.innerHTML = `<div class="cb-small">未进入仓库，无法加载文件树。</div>`;
    return;
  }

  const now = Date.now();
  if (!force && plugin._state.treeItems.length && (now - (plugin._state._treeAt||0) < 15000)) {
    plugin._renderTree(false);
    return;
  }

  try {
    plugin._setStatus("加载仓库树…");
    const branch = core.currentBranch || core.defaultBranch || "main";
    const ref = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/git/ref/heads/${branch}`);
    const sha = ref?.object?.sha;
    if (!sha) throw new Error("无法获取分支 SHA");

    const tree = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/git/trees/${sha}?recursive=1`);
    const items = (tree?.tree || [])
      .filter(x => x.type === "blob" || x.type === "tree")
      .map(x => ({ path: x.path, type: x.type === "tree" ? "dir" : "file" }))
      .sort((a,b) => a.path.localeCompare(b.path));

    plugin._state.treeItems = items;
    plugin._state._treeAt = Date.now();
    plugin._state.treeRoot = plugin._buildTree(items);

    // 默认展开根
    plugin._state.expanded.add("");
    plugin._renderTree(false);
    plugin._setStatus(`树已加载: ${items.length}`);
  } catch (e) {
    treeEl.innerHTML = `<div class="cb-small">树加载失败：${e.message}</div>`;
    plugin._setStatus(`树加载失败: ${e.message}`);
  }
};

plugin._buildTree = (items) => {
  // root path: ""
  const root = { name: "", path: "", type:"dir", children:new Map() };
  const ensureDir = (parent, seg, fullPath) => {
    if (!parent.children.has(seg)) {
      parent.children.set(seg, { name: seg, path: fullPath, type:"dir", children:new Map() });
    }
    return parent.children.get(seg);
  };

  for (const it of items) {
    const parts = it.path.split("/");
    let cur = root;
    for (let i=0;i<parts.length;i++) {
      const seg = parts[i];
      const p = parts.slice(0,i+1).join("/");
      if (i === parts.length - 1) {
        if (it.type === "dir") {
          cur = ensureDir(cur, seg, p);
        } else {
          if (!cur.children.has(seg)) {
            cur.children.set(seg, { name: seg, path: p, type:"file" });
          }
        }
      } else {
        cur = ensureDir(cur, seg, p);
      }
    }
  }
  return root;
};

plugin._renderTree = (fromSearch) => {
  const treeEl = plugin._refs?.tree;
  const st = plugin._state;
  if (!treeEl) return;

  const root = st.treeRoot;
  if (!root) {
    treeEl.innerHTML = `<div class="cb-small">暂无树数据。</div>`;
    return;
  }

  const filter = (st.treeFilter || "").toLowerCase();

  // 搜索：自动展开命中路径的父目录
  if (fromSearch && filter) {
    const hits = st.treeItems.filter(x => x.type==="file" && x.path.toLowerCase().includes(filter)).slice(0, 200);
    hits.forEach(h => {
      const parts = h.path.split("/");
      for (let i=0;i<parts.length-1;i++) st.expanded.add(parts.slice(0,i+1).join("/"));
    });
  }

  const active = plugin._getActive();
  const activePath = active?.path || "";

  const opened = new Set();
  st.order.forEach(id => {
    const f = st.files.get(id);
    if (f?.path) opened.add(f.path);
  });

  treeEl.innerHTML = "";
  const frag = document.createDocumentFragment();

  const renderDir = (node, depth) => {
    // collect children sorted: dirs then files
    const children = Array.from(node.children.values());
    children.sort((a,b) => (a.type===b.type ? a.name.localeCompare(b.name) : (a.type==="dir" ? -1 : 1)));

    for (const ch of children) {
      // filter rule: show dir if any descendant matches; show file if match
      if (filter) {
        if (ch.type === "file") {
          if (!ch.path.toLowerCase().includes(filter)) continue;
        } else {
          // dir: if no descendant match, skip
          if (!plugin._dirHasMatch(ch, filter)) continue;
        }
      }

      const row = document.createElement("div");
      row.className = "cb-node";
      if (ch.type === "file" && ch.path === activePath) row.classList.add("active");

      // indent
      const indent = document.createElement("span");
      indent.className = "cb-indent";
      indent.style.width = `${depth * 14}px`;
      row.appendChild(indent);

      const twist = document.createElement("span");
      twist.style.width = "16px";
      twist.style.display = "inline-block";
      twist.textContent = ch.type === "dir"
        ? (st.expanded.has(ch.path) ? "▼" : "▶")
        : "•";
      twist.style.opacity = ch.type === "dir" ? "0.9" : "0.4";
      row.appendChild(twist);

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = ch.name;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = ch.type === "file" ? (opened.has(ch.path) ? "已打开" : "") : "";
      row.appendChild(name);
      row.appendChild(meta);

      if (ch.type === "dir") {
        row.onclick = () => {
          if (st.expanded.has(ch.path)) st.expanded.delete(ch.path);
          else st.expanded.add(ch.path);
          plugin._renderTree(false);
        };
      } else {
        row.onclick = () => plugin._importFromRepo(ch.path);
      }

      frag.appendChild(row);

      if (ch.type === "dir" && st.expanded.has(ch.path)) {
        renderDir(ch, depth + 1);
      }
    }
  };

  renderDir(root, 0);
  treeEl.appendChild(frag);
};

plugin._dirHasMatch = (dirNode, filterLower) => {
  // DFS shallow: stop early
  const stack = [dirNode];
  while (stack.length) {
    const n = stack.pop();
    if (!n?.children) continue;
    for (const ch of n.children.values()) {
      if (ch.type === "file") {
        if (ch.path.toLowerCase().includes(filterLower)) return true;
      } else stack.push(ch);
    }
  }
  return false;
};

// ----------------- Import/Export/Save -----------------
plugin._importLocal = () => {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.multiple = true;
  inp.onchange = async () => {
    const files = Array.from(inp.files || []);
    if (!files.length) return;
    for (const f of files) {
      const text = await f.text();
      await plugin._openOrCreate({ path: f.name, text, baseText: "", from:"local", sha:null });
      const af = plugin._getActive();
      if (af) { af.dirty = true; plugin._renderFileTabs(); }
    }
    plugin._setStatus(`本地导入: ${files.length}`);
  };
  inp.click();
};

plugin._importFromRepo = async (path) => {
  const { core, api } = plugin._ctx;
  try {
    if (!core.currentOwner || !core.currentRepo) throw new Error("请先进入一个仓库（Browse）");
    const branch = core.currentBranch || core.defaultBranch || "main";
    plugin._setStatus(`导入: ${path}`);
    const meta = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/contents/${path}?ref=${branch}`);
    if (!meta?.content) throw new Error("不是可读取文件（或太大/无权限）");
    const text = decodeURIComponent(escape(atob(String(meta.content).replace(/\n/g,""))));
    await plugin._openOrCreate({ path, text, baseText: text, from:"repo", sha: meta.sha });
    plugin._setStatus(`已导入: ${path}`);
  } catch (e) {
    alert(`导入失败: ${e.message}`);
    plugin._setStatus(`导入失败: ${e.message}`);
  }
};

plugin._downloadActive = () => {
  const { utils } = plugin._ctx;
  const f = plugin._getActive();
  if (!f) return alert("未选择文件");
  const blob = new Blob([f.text || ""], { type:"text/plain;charset=utf-8" });
  utils.download(blob, (f.path ? f.path.split("/").pop() : f.name || "code.txt"));
};

plugin._saveActive = async (forceAskPath) => {
  const { core, api } = plugin._ctx;
  const f = plugin._getActive();
  if (!f) return alert("未选择文件");
  try {
    if (!core.token) throw new Error("需要 GitHub Token 才能保存");
    if (!core.currentOwner || !core.currentRepo) throw new Error("请先进入仓库");
    const branch = core.currentBranch || core.defaultBranch || "main";

    let path = (f.path || "").trim();
    if (forceAskPath || !path) {
      path = prompt("保存到仓库路径（相对根目录）", path || "src/newfile.js");
      if (!path) return;
      path = path.replace(/^\/+/, "");
    }

    const msg = prompt("Commit Message", `Update ${path} via CodeBoard`);
    if (!msg) return;

    plugin._setStatus(`上传: ${path}`);
    const b64 = btoa(unescape(encodeURIComponent(f.text || "")));

    let sha = null;
    if (!forceAskPath && f.sha && path === f.path) sha = f.sha;
    if (!sha) {
      try {
        const exists = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/contents/${path}?ref=${branch}`);
        if (exists?.sha) sha = exists.sha;
      } catch {}
    }

    const res = await api.putFile(core.currentOwner, core.currentRepo, path, b64, msg, branch, sha);

    // update local state
    f.path = path;
    f.name = path.split("/").pop();
    f.lang = plugin._guessLang(path);
    f.sha = res?.content?.sha || f.sha;
    f.from = "repo";
    f.baseText = f.text;   // reset diff base
    f.dirty = false;

    plugin._renderFileTabs();
    plugin._renderTree(false);
    plugin._renderSide();
    plugin._setStatus(`已保存: ${path}`);
    alert("保存成功");
  } catch (e) {
    alert(`保存失败: ${e.message}`);
    plugin._setStatus(`保存失败: ${e.message}`);
  }
};

// ----------------- AI (side output) -----------------
plugin._sendActiveToAI = async () => {
  const { core } = plugin._ctx;
  const f = plugin._getActive();
  if (!f) return alert("未选择文件");
  try {
    plugin._state.aiOut = "";
    plugin._state.aiStreaming = true;
    plugin._renderSide();
    plugin._setStatus("AI 生成中…");

    const prompt =
      `请对以下文件进行代码审查并给出可直接执行的修改建议：\n\n` +
      `== FILE: ${f.path || f.name} ==\n` +
      (f.text || "");

    await core.aiManager.stream([{ role:"user", content: prompt }], (chunk) => {
      plugin._state.aiOut += chunk;
      plugin._renderSide(true);
    });

    plugin._setStatus("AI 完成");
  } catch (e) {
    if (e.name === "AbortError") plugin._setStatus("AI 已停止");
    else {
      plugin._setStatus(`AI 错误: ${e.message}`);
      alert(`AI 错误: ${e.message}`);
    }
  } finally {
    plugin._state.aiStreaming = false;
    plugin._renderSide();
  }
};

plugin._rewriteSelection = async () => {
  const { core } = plugin._ctx;
  const f = plugin._getActive();
  if (!f) return alert("未选择文件");

  const requirement = prompt("输入改写要求", "重构并提升可读性，保持功能不变");
  if (!requirement) return;

  // get selection from CodeMirror if ready, else from textarea
  let sel = null, from = 0, to = 0;
  if (plugin._state.editor) {
    const state = plugin._state.editor.state;
    sel = state.sliceDoc(state.selection.main.from, state.selection.main.to);
    from = state.selection.main.from; to = state.selection.main.to;
  } else if (plugin._state.fallbackTextarea) {
    const ta = plugin._state.fallbackTextarea;
    from = ta.selectionStart; to = ta.selectionEnd;
    sel = (f.text || "").slice(from, to);
  }
  if (!sel || from === to) return alert("请先选中要改写的区域");

  const prompt =
    `Rewrite the following code based on the requirement.\n\n` +
    `Code:\n${sel}\n\nRequirement:\n${requirement}\n\nOutput ONLY the rewritten code.`;

  try {
    plugin._setStatus("AI 改写中…");
    let out = "";
    await core.aiManager.stream([{ role:"user", content: prompt }], (chunk) => { out += chunk; });

    let clean = out.replace(/^```[\w-]*\n/, "").replace(/\n```$/, "");

    // apply replace
    if (plugin._state.editor) {
      const { editor } = plugin._state;
      editor.dispatch({ changes: { from, to, insert: clean } });
    } else {
      const ta = plugin._state.fallbackTextarea;
      const before = (f.text || "").slice(0, from);
      const after = (f.text || "").slice(to);
      f.text = before + clean + after;
      ta.value = f.text;
    }

    plugin._setStatus("AI 改写完成（未上传）");
  } catch (e) {
    if (e.name === "AbortError") plugin._setStatus("AI 已停止");
    else { plugin._setStatus(`AI 错误: ${e.message}`); alert(`AI 错误: ${e.message}`); }
  }
};

// ----------------- Side render (AI/Diff/Preview) -----------------
plugin._renderSide = (softScroll=false) => {
  const st = plugin._state;
  const { sideTabs, sideBody } = plugin._refs || {};
  if (!sideBody || !sideTabs) return;

  const active = plugin._getActive();

  sideTabs.stPreview.classList.toggle("active", st.sideTab === "preview");
  sideTabs.stDiff.classList.toggle("active", st.sideTab === "diff");
  sideTabs.stAI.classList.toggle("active", st.sideTab === "ai");

  if (st.sideTab === "ai") {
    sideBody.innerHTML =
      `<div class="cb-small" style="margin-bottom:8px;">AI 输出 ${st.aiStreaming ? "(Streaming…)" : ""}</div>` +
      `<pre>${escapeHtml(st.aiOut || "(空)")}</pre>`;
    if (!softScroll) sideBody.scrollTop = sideBody.scrollHeight;
    return;
  }

  if (!active) {
    sideBody.innerHTML = `<div class="cb-small">未选择文件。</div>`;
    return;
  }

  if (st.sideTab === "preview") {
    sideBody.innerHTML =
      `<div class="cb-small" style="margin-bottom:8px;">预览（编辑器已高亮，此处为纯文本预览）</div>` +
      `<pre>${escapeHtml(active.text || "")}</pre>`;
    return;
  }

  // diff
  if (st.sideTab === "diff") {
    if (!st.diffReady || !window.Diff) {
      sideBody.innerHTML = `<div class="cb-small">Diff 库未就绪：${escapeHtml(st.diffFail || "加载中/失败")}</div>`;
      return;
    }
    const base = active.baseText ?? "";
    const cur = active.text ?? "";
    const parts = window.Diff.diffLines(base, cur);
    const html = parts.map(p => {
      const cls = p.added ? "cb-diff-add" : p.removed ? "cb-diff-del" : "cb-diff-ctx";
      const prefix = p.added ? "+ " : p.removed ? "- " : "  ";
      // 逐行渲染
      const lines = String(p.value || "").split("\n");
      return lines.map((ln, i) => {
        if (i === lines.length - 1 && ln === "") return "";
        return `<div class="${cls}">${escapeHtml(prefix + ln)}</div>`;
      }).join("");
    }).join("");
    sideBody.innerHTML = `<div class="cb-small" style="margin-bottom:8px;">Diff：base(导入/上次保存) vs 当前</div>` + html;
    return;
  }
};

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ----------------- CodeMirror Integration -----------------
plugin._ensureCodeMirror = async () => {
  const st = plugin._state;
  const { editorHost, fallback } = plugin._refs || {};
  if (!editorHost || !fallback) return false;
  if (st.editor) return true;
  if (st.cmReady) return true;

  try {
    plugin._setStatus("加载 CodeMirror 6…");
    const CM = await plugin._loadCMModules();
    st.cmReady = true;

    // create editor
    const active = plugin._getActive();
    const initialText = active?.text || "";

    // destroy existing content
    editorHost.innerHTML = "";
    fallback.style.display = "none";

    const { EditorView } = CM;
    const view = new EditorView({
      doc: initialText,
      extensions: CM.extensions(plugin),
      parent: editorHost
    });

    st.editor = view;

    // sync back to file on every change
    // We use updateListener from extensions()
    plugin._setStatus("CodeMirror 已就绪");
    await plugin._syncActiveToEditor(); // ensure right doc
    return true;
  } catch (e) {
    st.cmFail = e.message;
    plugin._setStatus(`CodeMirror 加载失败，降级 textarea：${e.message}`);
    // fallback
    fallback.style.display = "block";
    st.fallbackTextarea = fallback;
    await plugin._syncActiveToEditor();
    return false;
  }
};

plugin._syncActiveToEditor = async () => {
  const st = plugin._state;
  const f = plugin._getActive();
  const { fallback, pathLab } = plugin._refs || {};
  if (pathLab) pathLab.textContent = f ? `路径: ${f.path || f.name}` : "未选择文件";

  const text = f?.text || "";

  if (st.editor) {
    const cur = st.editor.state.doc.toString();
    if (cur !== text) {
      st.editor.dispatch({ changes: { from: 0, to: cur.length, insert: text } });
    }
    return;
  }

  // fallback
  if (fallback) {
    fallback.style.display = "block";
    st.fallbackTextarea = fallback;
    if (fallback.value !== text) fallback.value = text;
  }
};

// Load CM modules via ESM CDN (jsdelivr)
plugin._loadCMModules = async () => {
  if (plugin._cm) return plugin._cm;

  const base = "https://cdn.jsdelivr.net/npm/";
  const mod = async (p) => import(base + p);

  const [
    view, state, commands, lang, highlight, keymap, search, lint
  ] = await Promise.all([
    mod("@codemirror/view@6.26.3/+esm"),
    mod("@codemirror/state@6.4.1/+esm"),
    mod("@codemirror/commands@6.5.0/+esm"),
    mod("@codemirror/language@6.10.1/+esm"),
    mod("@codemirror/highlight@0.19.8/+esm"),
    mod("@codemirror/keymap@6.4.2/+esm"),
    mod("@codemirror/search@6.5.6/+esm"),
    mod("@codemirror/lint@6.5.0/+esm")
  ]);

  // languages (optional; load common set)
  const [
    js, html, css, json, python, markdown, yaml
  ] = await Promise.all([
    mod("@codemirror/lang-javascript@6.2.2/+esm"),
    mod("@codemirror/lang-html@6.4.8/+esm"),
    mod("@codemirror/lang-css@6.2.1/+esm"),
    mod("@codemirror/lang-json@6.0.1/+esm"),
    mod("@codemirror/lang-python@6.1.6/+esm"),
    mod("@codemirror/lang-markdown@6.2.5/+esm"),
    mod("@codemirror/lang-yaml@6.1.0/+esm")
  ]);

  const { EditorView } = view;
  const { EditorState } = state;

  const languageFor = (langName) => {
    switch (langName) {
      case "javascript": case "typescript": return js.javascript({ typescript: langName === "typescript" });
      case "html": return html.html();
      case "css": return css.css();
      case "json": return json.json();
      case "python": return python.python();
      case "markdown": return markdown.markdown();
      case "yaml": return yaml.yaml();
      default: return null;
    }
  };

  // build extensions factory
  const extensions = (pluginRef) => {
    const st = pluginRef._state;
    const updateListener = EditorView.updateListener.of((v) => {
      if (!v.docChanged) return;
      const f = pluginRef._getActive();
      if (!f) return;
      const txt = v.state.doc.toString();
      f.text = txt;
      f.dirty = (txt !== (f.baseText ?? ""));
      pluginRef._renderFileTabs();
      if (st.sideTab === "diff") pluginRef._renderSide(true);
    });

    const baseExt = [
      EditorView.lineWrapping,
      keymap.keymap.of([
        // Save shortcut
        { key: "Mod-s", preventDefault: true, run: () => { pluginRef._saveActive(false); return true; } },
        ...commands.defaultKeymap
      ]),
      updateListener,
      search.searchKeymap ? keymap.keymap.of(search.searchKeymap) : [],
      EditorView.theme({
        "&": { color: "#e6e6e6", backgroundColor: "#111" },
        ".cm-content": { caretColor: "#fff" },
        ".cm-gutters": { backgroundColor: "#0f0f0f", color: "#777", border: "none" }
      }, { dark: true })
    ];

    // language compartment to switch per file
    const langComp = new state.Compartment();
    st._langComp = langComp;

    const f = pluginRef._getActive();
    const langExt = languageFor(f?.lang || "plaintext");
    return [
      langComp.of(langExt ? langExt : []),
      ...baseExt
    ];
  };

  plugin._cm = {
    EditorView, EditorState, state, view,
    languageFor,
    extensions
  };
  return plugin._cm;
};

plugin._applyLanguageToEditor = () => {
  const st = plugin._state;
  const f = plugin._getActive();
  if (!st.editor || !st._langComp || !plugin._cm) return;
  const langExt = plugin._cm.languageFor(f?.lang || "plaintext");
  st.editor.dispatch({
    effects: st._langComp.reconfigure(langExt ? langExt : [])
  });
};

// hook: when active changed, set language
const _oldSetActive = plugin._setActive;
plugin._setActive = async (id) => {
  await _oldSetActive(id);
  plugin._applyLanguageToEditor();
};

// ----------------- Diff library -----------------
plugin._ensureDiff = async () => {
  const st = plugin._state;
  if (st.diffReady) return true;
  try {
    plugin._setStatus("加载 Diff 库…");
    await loadScriptOnce("https://cdn.jsdelivr.net/npm/diff@5.2.0/dist/diff.min.js", "cb-diff-lib");
    if (!window.Diff) throw new Error("Diff 全局对象未找到");
    st.diffReady = true;
    plugin._setStatus("Diff 库已就绪");
    return true;
  } catch (e) {
    st.diffFail = e.message;
    st.diffReady = false;
    plugin._setStatus(`Diff 加载失败：${e.message}`);
    return false;
  }

  function loadScriptOnce(src, id) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("script load failed: " + src));
      document.head.appendChild(s);
    });
  }
};