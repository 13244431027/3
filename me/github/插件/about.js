// ========== 插件：仓库 About API 悬浮窗 (Issues 强化版) ==========
// 按钮：〉 展开，〈 收回
// 悬浮窗可拖动，适配移动端
// 点击条目不跳转 GitHub，而是在悬浮窗内用 GitHub API 展开显示
// 强化 Issues 面板：展示无截断的完整详情并支持【加载更多】分页

plugin.id = "plugin.repo.about.float.window.api.issues.detail";
plugin.name = "仓库 About API 悬浮窗 (Issues 强化版)";
plugin.version = "1.2.0";
plugin.author = "ChatGPT";
plugin.description = "浏览仓库时左上角显示按钮，点击弹出可拖动悬浮窗，通过 GitHub API 显示 About、Readme、License、Activity、Stars、Forks、Contributors、Languages、Releases、Deployments 以及强化后的 Issues 详细面板。";
plugin.tags = ["about", "repo", "float", "window", "api", "github", "browse", "issues"];

plugin.style = `
.ghp-float-btn {
  position: absolute;
  top: calc(env(safe-area-inset-top, 0px) + 6px);
  left: calc(env(safe-area-inset-left, 0px) + 6px);
  z-index: 30;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.45);
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, transform 0.12s;
  user-select: none;
  touch-action: manipulation;
}

.ghp-float-btn:hover {
  background: rgba(255,255,255,0.14);
}

.ghp-float-btn:active {
  transform: scale(0.96);
}

.ghp-float-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
}

.ghp-float-overlay.open {
  display: flex;
}

.ghp-float-window {
  width: 560px;
  max-width: calc(100vw - 40px);
  height: 580px;
  max-height: calc(100vh - 40px);
  background: rgba(18,18,18,0.94);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 16px;
  box-shadow: 0 16px 60px rgba(0,0,0,0.70);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #fff;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.ghp-float-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
  flex-shrink: 0;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.ghp-float-header:active {
  cursor: grabbing;
}

.ghp-float-header-title {
  font-size: 16px;
  font-weight: 800;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ghp-float-header-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ghp-float-header-close:hover {
  background: rgba(255,255,255,0.13);
}

.ghp-float-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ghp-float-desc {
  font-size: 13px;
  line-height: 1.55;
  word-break: break-word;
  margin-bottom: 8px;
}

.ghp-float-home {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #8abfff;
  word-break: break-all;
  margin-bottom: 8px;
  line-height: 1.4;
}

.ghp-float-topic {
  display: inline-block;
  background: rgba(60,160,255,0.18);
  border: 1px solid rgba(60,160,255,0.28);
  color: #9fd0ff;
  border-radius: 999px;
  padding: 3px 9px;
  margin: 2px 4px 4px 0;
  font-size: 11px;
  font-weight: 600;
}

.ghp-float-section {
  margin-top: 6px;
}

.ghp-float-section-title {
  font-size: 13px;
  font-weight: 800;
  margin: 12px 0 6px 0;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.10);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ghp-float-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 7px;
  border-radius: 8px;
  color: rgba(255,255,255,0.82);
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
}

.ghp-float-row:hover {
  background: rgba(255,255,255,0.08);
}

.ghp-float-row strong {
  color: rgba(255,255,255,0.95);
  font-weight: 800;
}

.ghp-float-row-icon {
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.ghp-float-row-main {
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.ghp-float-row-arrow {
  opacity: 0.50;
  font-size: 11px;
  margin-left: auto;
  flex-shrink: 0;
}

.ghp-float-panel {
  display: none;
  margin: 4px 0 6px 26px;
  padding: 8px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.25);
  max-height: 380px;
  overflow: auto;
  line-height: 1.45;
}

.ghp-float-panel.open {
  display: block;
}

.ghp-float-loading {
  opacity: 0.72;
  font-size: 12px;
  padding: 4px 0;
}

.ghp-float-muted {
  opacity: 0.60;
  font-size: 12px;
}

.ghp-float-pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  margin: 0;
  color: rgba(255,255,255,0.86);
}

.ghp-float-md {
  font-size: 12px;
  line-height: 1.55;
  word-break: break-word;
}

.ghp-float-md a {
  color: #8abfff;
  text-decoration: underline;
  cursor: default;
}

.ghp-float-md img {
  max-width: 100%;
  border-radius: 6px;
}

.ghp-float-md pre {
  white-space: pre-wrap;
  overflow: auto;
  background: rgba(0,0,0,0.35);
  padding: 6px;
  border-radius: 6px;
}

.ghp-float-md code {
  word-break: break-word;
}

.ghp-float-md table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.ghp-float-md th,
.ghp-float-md td {
  border: 1px solid rgba(255,255,255,0.16);
  padding: 4px;
}

.ghp-float-item {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.ghp-float-item:last-child {
  border-bottom: none;
}

.ghp-float-item-title {
  font-weight: 700;
  color: rgba(255,255,255,0.92);
  word-break: break-word;
}

.ghp-float-item-sub {
  margin-top: 2px;
  opacity: 0.62;
  font-size: 11px;
  word-break: break-word;
}

/* ================== Issues 样式强化 ================== */
.ghp-float-issue-card {
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.02);
}

.ghp-float-issue-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #ff9a9a;
  margin-bottom: 4px;
  word-break: break-all;
}

.ghp-float-issue-meta {
  font-size: 11px;
  opacity: 0.65;
  margin-bottom: 8px;
}

.ghp-float-issue-body {
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255,255,255,0.85);
  border-top: 1px dashed rgba(255,255,255,0.12);
  padding-top: 8px;
  overflow-y: auto;
  max-height: 280px; /* 防止过长 Issue 卡片过度拉伸面板，内部不截断直接滚动 */
}

.ghp-float-small-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.12s;
  user-select: none;
}

.ghp-float-small-btn:hover {
  background: rgba(255,255,255,0.15);
}

.ghp-float-small-btn-primary {
  background: rgba(60,160,255,0.22);
  border-color: rgba(60,160,255,0.28);
  color: #9fd0ff;
}

.ghp-float-small-btn-primary:hover {
  background: rgba(60,160,255,0.30);
}

.ghp-float-contrib {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 0;
}

.ghp-float-contrib img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ghp-float-contrib-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ghp-float-langbar {
  display: flex;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.12);
  margin: 6px 0 8px 0;
}

.ghp-float-langseg {
  height: 100%;
}

.ghp-float-lang-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
}

.ghp-float-lang-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.ghp-float-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ghp-float-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.86);
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .ghp-float-btn {
    width: 42px;
    height: 42px;
    font-size: 24px;
    border-radius: 12px;
  }

  .ghp-float-overlay {
    align-items: flex-start;
    justify-content: center;
    padding-top: calc(env(safe-area-inset-top, 0px) + 10px);
    box-sizing: border-box;
  }

  .ghp-float-window {
    width: calc(100vw - 16px);
    height: min(82vh, 680px);
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 20px);
    border-radius: 14px;
  }

  .ghp-float-header {
    padding: 12px;
  }

  .ghp-float-header-title {
    font-size: 15px;
  }

  .ghp-float-header-close {
    width: 36px;
    height: 36px;
    font-size: 22px;
  }

  .ghp-float-body {
    padding: 12px;
    -webkit-overflow-scrolling: touch;
  }

  .ghp-float-panel {
    max-height: 42vh;
    margin-left: 18px;
  }

  .ghp-float-row {
    padding: 8px 7px;
  }

  .ghp-float-row-icon {
    width: 17px;
  }
}
`;

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  plugin._state = {
    button: null,
    overlay: null,
    window: null,
    loaded: false,
    lastKey: "",
    loadingKey: "",
    dataCache: new Map(),
    patched: false,
    resizeBound: false,
    escBound: false,
    escHandler: null,
    issues: {
      page: 1,
      hasMore: true
    }
  };

  plugin._patchLoadDir();
  plugin._tryRenderButton();

  if (!plugin._state.resizeBound) {
    plugin._state.resizeBound = true;
    window.addEventListener("resize", () => {
      try {
        plugin._fitFloatWindow();
      } catch {}
    });
  }
};

plugin.onHook = (hookName, data) => {
  if (hookName === "dir:load") {
    plugin._tryRenderButton();
  }

  if (hookName === "mode:switch") {
    if (data === "browse") {
      plugin._tryRenderButton();
    } else {
      plugin._removeButton();
      plugin._closeOverlay();
    }
  }

  if (hookName === "file:open") {
    plugin._removeButton();
    plugin._closeOverlay();
  }

  if (hookName === "ui:show" || hookName === "ui:ready") {
    plugin._tryRenderButton();
  }

  if (hookName === "ui:hide") {
    plugin._removeButton();
    plugin._closeOverlay();
  }
};

// ==================== 工具函数 ====================

plugin._escape = (s) => {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

plugin._fmt = (n) => {
  n = Number(n || 0);
  if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + "b";
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
};

plugin._decodeBase64 = (b64) => {
  try {
    return decodeURIComponent(escape(atob(String(b64 || "").replace(/\n/g, ""))));
  } catch {
    try {
      return atob(String(b64 || "").replace(/\n/g, ""));
    } catch {
      return "";
    }
  }
};

plugin._timeAgo = (iso) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diff = Date.now() - t;
  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < min) return "just now";
  if (diff < hour) return `${Math.floor(diff / min)} minutes ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
  if (diff < month) return `${Math.floor(diff / day)} days ago`;
  if (diff < year) return `${Math.floor(diff / month)} months ago`;
  return `${Math.floor(diff / year)} years ago`;
};

plugin._api = async (url, fallback = undefined) => {
  const api = plugin._ctx?.api;

  try {
    if (api && typeof api.fetchJson === "function") {
      return await api.fetchJson(url);
    }

    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    if (fallback !== undefined) return fallback;
    throw e;
  }
};

plugin._repoKey = () => {
  const core = plugin._ctx?.core;
  if (!core) return "";
  return `${core.currentOwner || ""}/${core.currentRepo || ""}@${core.currentBranch || ""}`;
};

plugin._cacheKey = (type) => {
  return `${plugin._repoKey()}:${type}`;
};

plugin._getCached = (type) => {
  return plugin._state.dataCache.get(plugin._cacheKey(type));
};

plugin._setCached = (type, value) => {
  plugin._state.dataCache.set(plugin._cacheKey(type), value);
};

// ==================== Patch loadDir ====================

plugin._patchLoadDir = () => {
  const ext = plugin._ctx?.extension;
  if (!ext || plugin._state.patched) return;
  if (typeof ext.loadDir !== "function") return;

  const old = ext.loadDir;

  ext.loadDir = async function (...args) {
    const ret = await old.apply(this, args);
    try {
      plugin._tryRenderButton();
    } catch {}
    return ret;
  };

  plugin._state.patched = true;
};

// ==================== 左上角按钮 ====================

plugin._tryRenderButton = () => {
  const { core, ui } = plugin._ctx || {};
  if (!core || !ui || !ui.mainArea) return;

  if (core.mode !== "browse") {
    plugin._removeButton();
    return;
  }

  if (!core.currentOwner || !core.currentRepo) {
    plugin._removeButton();
    return;
  }

  if (core.viewMode && core.viewMode !== "list") {
    plugin._removeButton();
    return;
  }

  if (getComputedStyle(ui.mainArea).position === "static") {
    ui.mainArea.style.position = "relative";
  }

  if (plugin._state.button && ui.mainArea.contains(plugin._state.button)) return;

  plugin._removeButton();

  const btn = document.createElement("button");
  btn.className = "ghp-float-btn";
  btn.textContent = "〉";
  btn.title = "展开 About 悬浮窗";
  btn.onclick = () => {
    plugin._openOverlay();
  };

  ui.mainArea.appendChild(btn);
  plugin._state.button = btn;
};

plugin._removeButton = () => {
  if (plugin._state.button) {
    plugin._state.button.remove();
    plugin._state.button = null;
  }
};

// ==================== 悬浮窗 ====================

plugin._openOverlay = () => {
  plugin._ensureOverlay();
  plugin._state.overlay.classList.add("open");

  setTimeout(() => {
    try {
      plugin._fitFloatWindow();
    } catch {}
  }, 0);

  const key = plugin._repoKey();

  if (key !== plugin._state.lastKey) {
    plugin._state.lastKey = key;
    plugin._loadWindow();
  }
};

plugin._closeOverlay = () => {
  if (plugin._state.overlay) {
    plugin._state.overlay.classList.remove("open");
  }
};

plugin._ensureOverlay = () => {
  if (plugin._state.overlay && document.body.contains(plugin._state.overlay)) return;

  const overlay = document.createElement("div");
  overlay.className = "ghp-float-overlay";

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) plugin._closeOverlay();
  });

  overlay.addEventListener("touchstart", (e) => {
    if (e.target === overlay) plugin._closeOverlay();
  }, { passive: true });

  const win = document.createElement("div");
  win.className = "ghp-float-window";

  win.innerHTML = `
    <div class="ghp-float-header">
      <span class="ghp-float-header-title">About</span>
      <button class="ghp-float-header-close" title="收回">〈</button>
    </div>
    <div class="ghp-float-body" data-float-body>
      <div class="ghp-float-loading">正在加载...</div>
    </div>
  `;

  overlay.appendChild(win);

  const closeBtn = win.querySelector(".ghp-float-header-close");
  if (closeBtn) {
    closeBtn.onclick = () => plugin._closeOverlay();
  }

  const header = win.querySelector(".ghp-float-header");
  plugin._makeFloatDraggable(win, header);

  document.body.appendChild(overlay);

  plugin._state.overlay = overlay;
  plugin._state.window = win;

  if (!plugin._state.escBound) {
    plugin._state.escBound = true;
    plugin._state.escHandler = (e) => {
      if (e.key === "Escape") plugin._closeOverlay();
    };
    window.addEventListener("keydown", plugin._state.escHandler);
  }
};

plugin._makeFloatDraggable = (win, handle) => {
  if (!win || !handle) return;
  if (win.dataset.dragBound === "1") return;
  win.dataset.dragBound = "1";

  let dragging = false;
  let sx = 0;
  let sy = 0;
  let sl = 0;
  let st = 0;

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) return e.touches[0];
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0];
    return e;
  };

  const clamp = (n, min, max) => {
    return Math.max(min, Math.min(max, n));
  };

  const down = (e) => {
    const target = e.target;

    if (target && target.closest && target.closest("button")) return;

    const p = getPoint(e);
    const r = win.getBoundingClientRect();

    dragging = true;
    sx = p.clientX;
    sy = p.clientY;
    sl = r.left;
    st = r.top;

    win.style.position = "fixed";
    win.style.left = `${sl}px`;
    win.style.top = `${st}px`;
    win.style.margin = "0";
    win.style.transform = "none";

    handle.style.cursor = "grabbing";

    if (e.cancelable) e.preventDefault();
  };

  const move = (e) => {
    if (!dragging) return;

    const p = getPoint(e);
    const dx = p.clientX - sx;
    const dy = p.clientY - sy;

    const w = win.offsetWidth;
    const h = win.offsetHeight;

    const pad = 8;
    const maxLeft = Math.max(pad, window.innerWidth - w - pad);
    const maxTop = Math.max(pad, window.innerHeight - h - pad);

    const left = clamp(sl + dx, pad, maxLeft);
    const top = clamp(st + dy, pad, maxTop);

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;

    if (e.cancelable) e.preventDefault();
  };

  const up = () => {
    if (!dragging) return;
    dragging = false;
    handle.style.cursor = "grab";
  };

  handle.addEventListener("mousedown", down);
  handle.addEventListener("touchstart", down, { passive: false });

  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });

  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
  window.addEventListener("touchcancel", up);
};

plugin._fitFloatWindow = () => {
  const win = plugin._state.window;
  if (!win) return;

  const r = win.getBoundingClientRect();

  if (win.style.position !== "fixed") return;

  const pad = 8;
  const w = win.offsetWidth;
  const h = win.offsetHeight;

  let left = r.left;
  let top = r.top;

  left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - h - pad));

  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
};

// ==================== 加载主窗口 ====================

plugin._loadWindow = async () => {
  const body = plugin._state.window?.querySelector("[data-float-body]");
  if (!body) return;

  const { core } = plugin._ctx || {};
  if (!core) return;

  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const key = plugin._repoKey();

  plugin._state.loadingKey = key;
  body.innerHTML = `<div class="ghp-float-loading">正在加载 About...</div>`;

  try {
    const meta = await plugin._api(`https://api.github.com/repos/${owner}/${repo}`);

    if (plugin._state.loadingKey !== key) return;

    plugin._renderBody(body, meta);
    plugin._preloadCounts(body);
  } catch (e) {
    body.innerHTML = `<div style="color:#ff9a9a;">加载失败：${plugin._escape(e.message || e)}</div>`;
  }
};

plugin._renderBody = (body, meta) => {
  const desc = meta.description
    ? `<div class="ghp-float-desc">${plugin._escape(meta.description)}</div>`
    : `<div class="ghp-float-desc ghp-float-muted">No description, website, or topics provided.</div>`;

  const homepage = meta.homepage
    ? `<div class="ghp-float-home"><span>🔗</span><span>${plugin._escape(meta.homepage)}</span></div>`
    : "";

  const topics = Array.isArray(meta.topics) && meta.topics.length
    ? `<div>${meta.topics.map(t => `<span class="ghp-float-topic">${plugin._escape(t)}</span>`).join("")}</div>`
    : "";

  body.innerHTML = `
    ${desc}
    ${homepage}
    ${topics}

    <div class="ghp-float-section">
      ${plugin._row("readme", "📖", "Readme")}
      ${plugin._row("license", "⚖️", meta.license?.name ? `View license：<strong>${plugin._escape(meta.license.name)}</strong>` : "License")}
      ${plugin._row("activity", "〽️", "Activity")}
      ${plugin._row("stars", "⭐", `<strong>${plugin._fmt(meta.stargazers_count)}</strong> stars`)}
      ${plugin._row("watchers", "👁️", `<strong>${plugin._fmt(meta.subscribers_count ?? meta.watchers_count)}</strong> watching`)}
      ${plugin._row("forks", "⑂", `<strong>${plugin._fmt(meta.forks_count)}</strong> forks`)}
      ${plugin._row("issues", "⚠️", `<strong>${plugin._fmt(meta.open_issues_count)}</strong> issues`)}
    </div>

    <div class="ghp-float-section">
      ${plugin._row("releases", "🏷️", "Releases")}
      ${plugin._row("deployments", "🚀", "Deployments")}
    </div>

    <div class="ghp-float-section">
      ${plugin._row("contributors", "👥", `Contributors <span class="ghp-float-badge" data-badge-contributors>...</span>`)}
      ${plugin._row("languages", "🧩", "Languages")}
    </div>
  `;

  plugin._bindRows(body);
  plugin._blockLinks(body);
};

plugin._row = (type, icon, labelHtml) => {
  return `
    <div class="ghp-float-row" data-float-row="${type}">
      <span class="ghp-float-row-icon">${icon}</span>
      <span class="ghp-float-row-main">${labelHtml}</span>
      <span class="ghp-float-row-arrow">展开</span>
    </div>
    <div class="ghp-float-panel" data-float-panel="${type}">
      <div class="ghp-float-loading">等待展开...</div>
    </div>
  `;
};

plugin._bindRows = (body) => {
  body.querySelectorAll("[data-float-row]").forEach((row) => {
    if (row.dataset.bound === "1") return;
    row.dataset.bound = "1";

    row.onclick = async () => {
      const type = row.dataset.floatRow;
      const box = body.querySelector(`[data-float-panel="${type}"]`);
      if (!box) return;

      const open = box.classList.contains("open");

      if (open) {
        box.classList.remove("open");
        const arr = row.querySelector(".ghp-float-row-arrow");
        if (arr) arr.textContent = "展开";
        return;
      }

      box.classList.add("open");

      const arr = row.querySelector(".ghp-float-row-arrow");
      if (arr) arr.textContent = "收起";

      if (box.dataset.loaded === "1") return;

      box.innerHTML = `<div class="ghp-float-loading">正在通过 API 加载...</div>`;

      try {
        await plugin._loadPanel(type, box);
        box.dataset.loaded = "1";
        plugin._blockLinks(body);
      } catch (e) {
        box.innerHTML = `<div style="color:#ff9a9a;">加载失败：${plugin._escape(e.message || e)}</div>`;
      }
    };
  });
};

plugin._blockLinks = (body) => {
  body.querySelectorAll("a").forEach((a) => {
    if (a.dataset.noJump === "1") return;
    a.dataset.noJump = "1";

    a.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const href = a.getAttribute("href") || "";
      const box = a.closest(".ghp-float-panel");

      if (box && href) {
        const note = document.createElement("div");
        note.className = "ghp-float-muted";
        note.style.marginTop = "4px";
        note.textContent = "链接已拦截，不跳转：" + href;
        box.appendChild(note);
      }

      return false;
    };
  });
};

// ==================== API 面板加载 ====================

plugin._loadPanel = async (type, box) => {
  const core = plugin._ctx?.core;
  if (!core) return;

  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const branch = core.currentBranch || core.defaultBranch || "main";

  // Issues 采用动态分页渲染逻辑，避免直接覆盖常规静态缓存
  if (type === "issues") {
    await plugin._loadIssuesPanel(box, false);
    return;
  }

  const cached = plugin._getCached(type);
  if (cached) {
    box.innerHTML = cached;
    return;
  }

  let html = "";

  if (type === "readme") {
    const d = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/readme`);
    const text = plugin._decodeBase64(d.content);
    html = plugin._renderMd(text, owner, repo, branch);
  }

  else if (type === "license") {
    const d = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/license`, null);

    if (!d || !d.content) {
      html = `<div class="ghp-float-muted">No license found.</div>`;
    } else {
      const text = plugin._decodeBase64(d.content);
      html = `<pre class="ghp-float-pre">${plugin._escape(text.slice(0, 9000))}${text.length > 9000 ? "\n\n[已截断]" : ""}</pre>`;
    }
  }

  else if (type === "activity") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/events?per_page=12`, []);

    if (!Array.isArray(list) || !list.length) {
      html = `<div class="ghp-float-muted">No recent activity.</div>`;
    } else {
      html = list.map(e => `
        <div class="ghp-float-item">
          <div class="ghp-float-item-title">${plugin._escape(e.type || "Event")}</div>
          <div class="ghp-float-item-sub">
            ${plugin._escape(e.actor?.login || "")}
            ${e.created_at ? " · " + plugin._escape(plugin._timeAgo(e.created_at)) : ""}
          </div>
        </div>
      `).join("");
    }
  }

  else if (type === "stars") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=10`, []);
    html = plugin._renderUsers(list, "No stargazers.");
  }

  else if (type === "watchers") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/subscribers?per_page=10`, []);
    html = plugin._renderUsers(list, "No watchers.");
  }

  else if (type === "forks") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/forks?per_page=10&sort=newest`, []);

    if (!Array.isArray(list) || !list.length) {
      html = `<div class="ghp-float-muted">No forks.</div>`;
    } else {
      html = list.map(f => `
        <div class="ghp-float-item">
          <div class="ghp-float-item-title">${plugin._escape(f.full_name || f.name)}</div>
          <div class="ghp-float-item-sub">
            by ${plugin._escape(f.owner?.login || "")}
            ${f.created_at ? " · " + plugin._escape(plugin._timeAgo(f.created_at)) : ""}
          </div>
        </div>
      `).join("");
    }
  }

  else if (type === "releases") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=8`, []);

    if (!Array.isArray(list) || !list.length) {
      html = `<div class="ghp-float-muted">No releases published.</div>`;
    } else {
      html = list.map(r => `
        <div class="ghp-float-item">
          <div class="ghp-float-item-title">${plugin._escape(r.name || r.tag_name || "Release")}</div>
          <div class="ghp-float-item-sub">
            ${plugin._escape(r.tag_name || "")}
            ${r.published_at ? " · " + plugin._escape(plugin._timeAgo(r.published_at)) : ""}
          </div>
        </div>
      `).join("");
    }
  }

  else if (type === "deployments") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/deployments?per_page=20`, []);

    if (!Array.isArray(list) || !list.length) {
      html = `<div class="ghp-float-muted">No deployments.</div>`;
    } else {
      html = list.map(d => `
        <div class="ghp-float-item">
          <div class="ghp-float-item-title">${plugin._escape(d.environment || "deployment")}</div>
          <div class="ghp-float-item-sub">
            ${plugin._escape(d.task || "")}
            ${d.created_at ? " · " + plugin._escape(plugin._timeAgo(d.created_at)) : ""}
          </div>
        </div>
      `).join("");
    }
  }

  else if (type === "contributors") {
    const list = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=12`, []);
    html = plugin._renderContributors(list);
  }

  else if (type === "languages") {
    const langs = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/languages`, {});
    html = plugin._renderLanguages(langs);
  }

  else {
    html = `<div class="ghp-float-muted">Unknown panel.</div>`;
  }

  plugin._setCached(type, html);
  box.innerHTML = html;
};

// ==================== issues 强化加载面板 (支持加载更多) ====================

plugin._loadIssuesPanel = async (box, append = false) => {
  const core = plugin._ctx?.core;
  if (!core) return;

  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const branch = core.currentBranch || core.defaultBranch || "main";

  if (!append) {
    plugin._state.issues = {
      page: 1,
      hasMore: true
    };
    box.innerHTML = `<div class="ghp-float-loading">正在获取 Issues 数据...</div>`;
  }

  const page = plugin._state.issues.page;
  const perPage = 15; // 设置单页拉取量，保证过滤 PR 后仍有足够数量
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=${perPage}&page=${page}`;

  try {
    const list = await plugin._api(url, []);
    if (!Array.isArray(list)) {
      throw new Error("返回的数据格式不正确");
    }

    // 过滤 Pull Requests (GitHub API 的 issues 接口默认包含 PR，PR 含有 pull_request 属性)
    const issues = list.filter(i => !i.pull_request);

    if (append) {
      // 移除旧的【加载更多】容器
      const oldLoader = box.querySelector(".ghp-float-loadmore-container");
      if (oldLoader) oldLoader.remove();
    } else {
      box.innerHTML = "";
    }

    if (issues.length === 0 && page === 1) {
      box.innerHTML = `<div class="ghp-float-muted">暂无开放的 Issues。</div>`;
      return;
    }

    const listContainer = box.querySelector(".ghp-float-issues-container") || document.createElement("div");
    if (!append) {
      listContainer.className = "ghp-float-issues-container";
      box.appendChild(listContainer);
    }

    issues.forEach(i => {
      const card = document.createElement("div");
      card.className = "ghp-float-issue-card";

      const bodyHtml = i.body
        ? plugin._renderMd(i.body, owner, repo, branch)
        : `<div class="ghp-float-muted">（该 Issue 无描述内容）</div>`;

      card.innerHTML = `
        <div class="ghp-float-issue-title">#${i.number} ${plugin._escape(i.title)}</div>
        <div class="ghp-float-issue-meta">
          由 <strong>${plugin._escape(i.user?.login || "unknown")}</strong> 创建于 ${plugin._escape(plugin._timeAgo(i.created_at))}
          ${i.comments ? ` · 💬 ${i.comments} 个评论` : ""}
        </div>
        <div class="ghp-float-issue-body">${bodyHtml}</div>
      `;
      listContainer.appendChild(card);
    });

    // 若本次返回的全部条目（含被过滤的PR）小于单页上限，说明后续已无数据
    if (list.length < perPage) {
      plugin._state.issues.hasMore = false;
    }

    if (plugin._state.issues.hasMore) {
      const loadMoreDiv = document.createElement("div");
      loadMoreDiv.className = "ghp-float-loadmore-container";
      loadMoreDiv.style.textAlign = "center";
      loadMoreDiv.style.padding = "10px 0";

      const btn = document.createElement("button");
      btn.className = "ghp-float-small-btn ghp-float-small-btn-primary";
      btn.style.width = "80%";
      btn.textContent = "加载更多 Issue...";
      btn.onclick = async () => {
        btn.disabled = true;
        btn.textContent = "加载中...";
        plugin._state.issues.page++;
        await plugin._loadIssuesPanel(box, true);
      };

      loadMoreDiv.appendChild(btn);
      box.appendChild(loadMoreDiv);
    } else if (page > 1) {
      const tip = document.createElement("div");
      tip.className = "ghp-float-loadmore-container ghp-float-muted";
      tip.style.textAlign = "center";
      tip.style.padding = "10px 0";
      tip.textContent = "— 已加载全部开放的 Issues —";
      box.appendChild(tip);
    }
  } catch (e) {
    if (append) {
      const err = document.createElement("div");
      err.style.color = "#ff9a9a";
      err.style.fontSize = "12px";
      err.style.textAlign = "center";
      err.style.padding = "6px";
      err.textContent = `加载更多失败：${e.message || e}`;
      box.appendChild(err);
    } else {
      box.innerHTML = `<div style="color:#ff9a9a;">加载失败：${plugin._escape(e.message || e)}</div>`;
    }
  }
};

// ==================== Markdown / 用户 / 语言渲染 ====================

plugin._renderMd = (text, owner, repo, branch) => {
  const utils = plugin._ctx?.utils;

  if (utils && typeof utils.parseMarkdown === "function") {
    try {
      return `<div class="ghp-float-md">${utils.parseMarkdown(text, owner, repo, branch)}</div>`;
    } catch {}
  }

  return `<pre class="ghp-float-pre">${plugin._escape(text)}</pre>`;
};

plugin._renderUsers = (list, emptyText) => {
  if (!Array.isArray(list) || !list.length) {
    return `<div class="ghp-float-muted">${plugin._escape(emptyText)}</div>`;
  }

  return list.map(u => `
    <div class="ghp-float-contrib">
      <img src="${plugin._escape(u.avatar_url || "")}" alt="">
      <div class="ghp-float-contrib-name">
        <strong>${plugin._escape(u.login || "")}</strong>
      </div>
    </div>
  `).join("");
};

plugin._renderContributors = (list) => {
  if (!Array.isArray(list) || !list.length) {
    return `<div class="ghp-float-muted">No contributors.</div>`;
  }

  return list.map(c => `
    <div class="ghp-float-contrib">
      <img src="${plugin._escape(c.avatar_url || "")}" alt="">
      <div class="ghp-float-contrib-name">
        <strong>${plugin._escape(c.login || "")}</strong>
        <span class="ghp-float-muted"> ${plugin._fmt(c.contributions)} commits</span>
      </div>
    </div>
  `).join("");
};

plugin._langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  GLSL: "#5686a5",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
  SCSS: "#c6538c",
  Less: "#1d365d",
  Lua: "#000080",
  Perl: "#0298c3",
  R: "#198CE7",
  MATLAB: "#e16737",
  Haskell: "#5e5086",
  Clojure: "#db5855",
  Elixir: "#6e4a7e",
  Erlang: "#B83998",
  ObjectiveC: "#438eff",
  "Objective-C": "#438eff",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Makefile: "#427819",
  Batchfile: "#C1F12E",
  PowerShell: "#012456"
};

plugin._colorForLang = (name) => {
  if (plugin._langColors[name]) return plugin._langColors[name];

  let h = 0;
  for (let i = 0; i < String(name || "").length; i++) {
    h = (h * 31 + String(name).charCodeAt(i)) % 360;
  }

  return `hsl(${h}, 65%, 55%)`;
};

plugin._renderLanguages = (langs) => {
  const entries = Object.entries(langs || {}).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + Number(v || 0), 0);

  if (!entries.length || !total) {
    return `<div class="ghp-float-muted">No language data.</div>`;
  }

  const bar = entries.map(([name, bytes]) => {
    const pct = (Number(bytes || 0) / total) * 100;
    const color = plugin._colorForLang(name);
    return `<div class="ghp-float-langseg" style="width:${pct}%;background:${color};"></div>`;
  }).join("");

  const rows = entries.map(([name, bytes]) => {
    const pct = (Number(bytes || 0) / total) * 100;
    const color = plugin._colorForLang(name);

    return `
      <div class="ghp-float-lang-item">
        <span class="ghp-float-dot" style="background:${color};"></span>
        <strong>${plugin._escape(name)}</strong>
        <span class="ghp-float-muted">${pct.toFixed(1)}%</span>
      </div>
    `;
  }).join("");

  return `
    <div class="ghp-float-langbar">${bar}</div>
    <div class="ghp-float-lang-list">${rows}</div>
  `;
};

// ==================== 预加载贡献者数量 ====================

plugin._preloadCounts = async (body) => {
  const core = plugin._ctx?.core;
  if (!core || !body) return;

  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const key = plugin._repoKey();

  try {
    const contributors = await plugin._api(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=30`, []);

    if (plugin._repoKey() !== key) return;

    const badge = body.querySelector("[data-badge-contributors]");

    if (badge) {
      badge.textContent = Array.isArray(contributors) ? plugin._fmt(contributors.length) : "0";
    }
  } catch {}
};
