plugin.id = "floating-cache-auto-clear-silent";
plugin.name = "悬浮清缓存面板(静默清理+缓存开关)";
plugin.version = "4.0.0";

plugin.style = `
#fcf-panel, #fcf-ball {
  position: fixed;
  z-index: 214748300;
  user-select: none;
  touch-action: none;
}
#fcf-panel {
  display: none;
  flex-direction: column;
  background: rgba(18,18,18,0.92);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  padding: 10px 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.6);
  font-family: system-ui, -apple-system, sans-serif;
  width: 250px;
  max-width: calc(100vw - 40px);
  bottom: 20px;
  right: 20px;
  cursor: grab;
}
#fcf-panel:active { cursor: grabbing; }

#fcf-panel .fcf-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 6px;
}
#fcf-panel .fcf-handle {
  font-size: 14px;
  opacity: 0.5;
  cursor: grab;
}
#fcf-panel .fcf-title {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
}
#fcf-panel .fcf-min-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

#fcf-panel .fcf-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#fcf-panel .fcf-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
#fcf-panel .fcf-switch-label {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
#fcf-panel .fcf-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
#fcf-panel .fcf-btn {
  background: rgba(255,180,60,0.2);
  border: 1px solid rgba(255,180,60,0.4);
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 10px;
  min-height: 32px;
  transition: background 0.15s;
}
#fcf-panel .fcf-btn:hover { background: rgba(255,180,60,0.35); }

#fcf-panel .fcf-auto-input {
  background: rgba(0,0,0,0.3);
  border: 1px solid #555;
  color: #fff;
  border-radius: 6px;
  padding: 4px;
  font-size: 11px;
  width: 48px;
  text-align: center;
}
#fcf-panel .fcf-label {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
}
#fcf-panel .fcf-status {
  font-size: 10px;
  color: rgba(140,200,255,0.8);
  text-align: center;
  min-height: 14px;
  word-break: break-all;
}

/* 小球 */
#fcf-ball {
  display: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffaa3c, #cc6600);
  border: 2px solid rgba(255,255,255,0.3);
  box-shadow: 0 6px 20px rgba(200,100,0,0.4);
  color: #fff;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  cursor: grab;
  bottom: 20px;
  right: 20px;
  transition: transform 0.2s;
}
#fcf-ball:active { cursor: grabbing; transform: scale(0.92); }

@media (max-width: 768px) {
  #fcf-panel { width: 220px; padding: 8px 12px; }
  #fcf-ball { width: 56px; height: 56px; }
}
`;

plugin.init = function (context) {
  const { core, extension, manager } = context;

  // ====== 默认配置 ======
  const STORAGE_KEY = "fcf_silent_config";
  let config = { 
    cacheEnabled: true,       // 是否启用核心缓存
    autoClearEnabled: false,   // 是否启用自动静默清理
    interval: 10               // 清理间隔(秒)
  };
  
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (typeof saved.cacheEnabled === "boolean") config.cacheEnabled = saved.cacheEnabled;
    if (typeof saved.autoClearEnabled === "boolean") config.autoClearEnabled = saved.autoClearEnabled;
    if (saved.interval && saved.interval >= 3) config.interval = saved.interval;
  } catch (e) {}

  let timer = null;
  let minimized = (navigator.maxTouchPoints > 1 || window.innerWidth <= 768); // 移动端默认最小化

  // ====== 核心劫持：动态控制缓存读取 ======
  let originalCacheGet = null;
  if (core.cacheManager) {
    originalCacheGet = core.cacheManager.get;
    // 拦截 get 方法。如果禁用了缓存，直接返回 null，强制网络请求
    core.cacheManager.get = function (key) {
      if (!config.cacheEnabled) {
        return null; 
      }
      return originalCacheGet.call(this, key);
    };
  }

  // ====== 创建主面板 ======
  const panel = document.createElement("div");
  panel.id = "fcf-panel";

  // 头部
  const header = document.createElement("div");
  header.className = "fcf-header";
  const handle = document.createElement("span");
  handle.className = "fcf-handle";
  handle.textContent = "⠿";
  const title = document.createElement("span");
  title.className = "fcf-title";
  title.textContent = "缓存管理器";
  const minBtn = document.createElement("button");
  minBtn.className = "fcf-min-btn";
  minBtn.textContent = "−";
  header.appendChild(handle);
  header.appendChild(title);
  header.appendChild(minBtn);

  // 主体
  const body = document.createElement("div");
  body.className = "fcf-body";

  // 第一行：是否启动缓存开关
  const row1 = document.createElement("div");
  row1.className = "fcf-row";
  const cacheLabel = document.createElement("label");
  cacheLabel.className = "fcf-switch-label";
  const cacheCheckbox = document.createElement("input");
  cacheCheckbox.type = "checkbox";
  cacheCheckbox.className = "fcf-checkbox";
  cacheCheckbox.checked = config.cacheEnabled;
  cacheLabel.appendChild(cacheCheckbox);
  cacheLabel.appendChild(document.createTextNode(" 启动缓存 (保留15s数据)"));
  const clearBtn = document.createElement("button");
  clearBtn.className = "fcf-btn";
  clearBtn.textContent = "手动清理";
  row1.appendChild(cacheLabel);
  row1.appendChild(clearBtn);

  // 第二行：自动静默清理开关 + 秒数输入
  const row2 = document.createElement("div");
  row2.className = "fcf-row";
  const autoLabel = document.createElement("label");
  autoLabel.className = "fcf-switch-label";
  const autoCheckbox = document.createElement("input");
  autoCheckbox.type = "checkbox";
  autoCheckbox.className = "fcf-checkbox";
  autoCheckbox.checked = config.autoClearEnabled;
  autoLabel.appendChild(autoCheckbox);
  autoLabel.appendChild(document.createTextNode(" 自动静默清缓存"));

  const inputWrap = document.createElement("div");
  inputWrap.style.display = "flex";
  inputWrap.style.alignItems = "center";
  inputWrap.style.gap = "4px";
  const intervalInput = document.createElement("input");
  intervalInput.className = "fcf-auto-input";
  intervalInput.type = "number";
  intervalInput.min = "3";
  intervalInput.max = "300";
  intervalInput.value = config.interval;
  const labelSec = document.createElement("span");
  labelSec.className = "fcf-label";
  labelSec.textContent = "秒";
  inputWrap.appendChild(intervalInput);
  inputWrap.appendChild(labelSec);

  row2.appendChild(autoLabel);
  row2.appendChild(inputWrap);

  // 状态显示
  const statusDiv = document.createElement("div");
  statusDiv.className = "fcf-status";
  statusDiv.textContent = "就绪";

  body.appendChild(row1);
  body.appendChild(row2);
  body.appendChild(statusDiv);
  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  // ====== 创建小球 ======
  const ball = document.createElement("div");
  ball.id = "fcf-ball";
  ball.textContent = "🧹";
  ball.title = "展开面板";
  document.body.appendChild(ball);

  // ====== 拖动逻辑 ======
  function makeDraggable(el, ignoreFn) {
    let dragging = false, moved = false, sx, sy, ix, iy;
    function clampPos(x, y, w, h) {
      const maxX = window.innerWidth - w - 8;
      const maxY = window.innerHeight - h - 8;
      return { x: Math.max(8, Math.min(x, maxX)), y: Math.max(8, Math.min(y, maxY)) };
    }
    const down = (e) => {
      if (ignoreFn && ignoreFn(e)) return;
      dragging = true; moved = false;
      const r = el.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; ix = r.left; iy = r.top;
      el.style.left = `${ix}px`; el.style.top = `${iy}px`;
      el.style.bottom = "auto"; el.style.right = "auto";
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      const w = el.offsetWidth, h = el.offsetHeight;
      const { x, y } = clampPos(ix + dx, iy + dy, w, h);
      el.style.left = `${x}px`; el.style.top = `${y}px`;
    };
    const up = () => {
      dragging = false;
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointerdown", down);
    return { wasMoved: () => moved, cleanup: () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    }};
  }

  const dragPanel = makeDraggable(panel, (e) => e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.tagName === "LABEL");
  const dragBall = makeDraggable(ball);

  // ====== 展开/折叠 ======
  function showPanel() { minimized = false; panel.style.display = "flex"; ball.style.display = "none"; }
  function showBall() { minimized = true; panel.style.display = "none"; ball.style.display = "flex"; }
  minBtn.onclick = (e) => { e.stopPropagation(); showBall(); };
  ball.addEventListener("click", () => { if (!dragBall.wasMoved()) showPanel(); });

  // ====== 清缓存逻辑 ======
  function performClearCache() {
    if (core.cacheManager && core.cacheManager.cache) {
      core.cacheManager.cache.clear();
    }
    if (core.cacheManager && core.cacheManager.clearRepoCache) {
      core.cacheManager.clearRepoCache();
    }
    if (core._revokeObjectUrl) {
      core._revokeObjectUrl();
    }
    // 刷新AI缓存状态
    if (typeof extension._renderAICacheInfo === "function") {
      try { extension._renderAICacheInfo(); } catch (e) {}
    }
  }

  function saveConfig() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch (e) {}
  }

  // ====== 开关逻辑 ======

  // 1. 手动清理
  clearBtn.onclick = () => {
    performClearCache();
    statusDiv.textContent = `🧹 已手动清空当前缓存`;
  };

  // 2. 是否启动缓存
  cacheCheckbox.onchange = () => {
    config.cacheEnabled = cacheCheckbox.checked;
    saveConfig();
    statusDiv.textContent = config.cacheEnabled ? "💡 缓存已启用" : "⚠️ 缓存已关闭（请求将实时同步）";
  };

  // 3. 自动静默清缓存
  function startAutoClear() {
    stopAutoClear();
    timer = setInterval(() => {
      performClearCache();
      const timeStr = new Date().toLocaleTimeString();
      statusDiv.textContent = `⏱️ [${timeStr}] 已后台自动清空缓存`;
    }, config.interval * 1000);
  }

  function stopAutoClear() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  autoCheckbox.onchange = () => {
    config.autoClearEnabled = autoCheckbox.checked;
    saveConfig();
    if (config.autoClearEnabled) {
      startAutoClear();
      statusDiv.textContent = "▶ 自动静默清理已开启";
    } else {
      stopAutoClear();
      statusDiv.textContent = "⏸ 自动静默清理已停止";
    }
  };

  intervalInput.onchange = () => {
    let val = parseInt(intervalInput.value, 10);
    if (isNaN(val) || val < 3) val = 3;
    if (val > 300) val = 300;
    intervalInput.value = val;
    config.interval = val;
    saveConfig();
    if (config.autoClearEnabled) {
      startAutoClear();
    }
  };

  // 初始化计时器
  if (config.autoClearEnabled) {
    startAutoClear();
  }

  // ====== 面板可见性管理 ======
  function shouldShow() {
    return core.mode === "browse" && core.currentOwner && core.currentRepo;
  }
  function updateVisibility() {
    const show = shouldShow();
    if (show) {
      if (minimized) showBall();
      else showPanel();
    } else {
      panel.style.display = "none";
      ball.style.display = "none";
    }
  }

  plugin.onHook = (hookName) => {
    if (["mode:switch","dir:load","ui:show"].includes(hookName)) updateVisibility();
  };
  setTimeout(updateVisibility, 150);

  // ====== 卸载清理 ======
  plugin._cleanup = function () {
    stopAutoClear();
    dragPanel.cleanup();
    dragBall.cleanup();
    // 恢复对原始核心缓存器方法的劫持
    if (originalCacheGet && core.cacheManager) {
      core.cacheManager.get = originalCacheGet;
    }
    if (panel.parentNode) panel.parentNode.removeChild(panel);
    if (ball.parentNode) ball.parentNode.removeChild(ball);
  };

  // 挂载卸载补丁
  if (manager && manager.unloadPlugin && !manager._fcfSilentPatched) {
    manager._fcfSilentPatched = true;
    const oldFn = manager.unloadPlugin.bind(manager);
    manager.unloadPlugin = function (id) {
      const p = this.plugins.get && this.plugins.get(id);
      if (p && p._cleanup) try { p._cleanup(); } catch (e) {}
      return oldFn(id);
    };
  }
};
