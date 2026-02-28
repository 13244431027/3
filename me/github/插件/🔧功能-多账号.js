plugin.id = "multi-account.switcher.floating";
plugin.name = "多账号切换器 (悬浮窗)";
plugin.version = "2.0.0";

// 样式：独立窗口 + 主面板集成按钮
plugin.style = `
  /* 悬浮窗主体 */
  #ma-floating-window {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 320px;
    height: 420px;
    z-index: 100000;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    color: #fff;
    font-family: system-ui, -apple-system, sans-serif;
    display: none;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  
  /* 悬浮窗标题栏 */
  #ma-floating-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    cursor: move;
    user-select: none;
    background: rgba(255,255,255,0.05);
  }
  
  #ma-floating-title {
    font-size: 14px;
    font-weight: 700;
  }
  
  /* 悬浮窗内容区 */
  #ma-floating-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  
  /* 账号列表项 */
  .ma-account-item {
    ${JSON.stringify(Utils.itemStyle()).replace(/"/g, '').replace(/,/g, ';')}
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px !important;
    margin-bottom: 6px !important;
  }
  .ma-account-item.current {
    background: rgba(100, 200, 100, 0.15) !important;
    border-left: 3px solid #4caf50;
  }
  
  .ma-account-info {
    flex: 1;
    font-size: 12px;
    overflow: hidden;
  }
  
  .ma-account-name {
    font-weight: 600;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .ma-account-token-preview {
    font-family: monospace;
    color: #aaa;
    font-size: 11px;
  }
  
  /* 操作按钮组 */
  .ma-account-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  
  /* 添加账号按钮 */
  #ma-add-account-btn {
    width: 100%;
    margin-top: 10px;
    background: #28a745 !important;
  }
  
  /* 主面板标题栏集成按钮 */
  #ma-main-panel-btn {
    margin-left: 8px;
    background: rgba(100, 200, 100, 0.2) !important;
    border: 1px solid rgba(100, 200, 100, 0.4) !important;
  }
  #ma-main-panel-btn:hover {
    background: rgba(100, 200, 100, 0.3) !important;
  }
  
  /* 空状态提示 */
  .ma-empty-tip {
    text-align: center;
    opacity: 0.5;
    padding: 20px;
    font-size: 12px;
  }
`;

// 存储键名
const STORAGE_KEY = 'github_panel_multi_account';
const CURRENT_KEY = 'github_panel_multi_account_current';

plugin.init = ({ core, ui, components, utils, extension }) => {
  plugin._core = core;
  plugin._ui = ui;
  plugin._components = components;
  plugin._utils = utils;
  plugin._extension = extension;

  plugin._loadAccounts();
  plugin._restoreCurrentAccount();
  plugin._createFloatingWindow();
  plugin._integrateToMainPanel();
};

plugin.onHook = (hookName, data) => {
  if (hookName === 'ui:ready') {
    // 确保主面板按钮已挂载
    setTimeout(() => plugin._integrateToMainPanel(), 100);
  }
  if (hookName === 'mode:switch') {
    plugin._updateCurrentIndicator();
  }
};

// ==================== 数据管理 ====================

plugin._loadAccounts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    plugin._data = raw ? JSON.parse(raw) : { accounts: [], current: null };
  } catch (e) {
    console.error('[MultiAccount] Load error:', e);
    plugin._data = { accounts: [], current: null };
  }
};

plugin._saveAccounts = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugin._data));
  } catch (e) {
    console.error('[MultiAccount] Save error:', e);
  }
};

plugin._restoreCurrentAccount = () => {
  const currentId = localStorage.getItem(CURRENT_KEY);
  if (currentId) {
    const acc = plugin._data.accounts.find(a => a.id === currentId);
    if (acc) plugin._switchAccount(acc.id, false);
  }
};

// ==================== 账号操作 ====================

plugin._addAccount = () => {
  const name = prompt('请输入账号名称（如：工作、个人）');
  if (!name) return;

  const token = prompt('请输入 GitHub Token (ghp_...)\n⚠️ 将以明文存储在浏览器本地');
  if (!token) return;

  const account = {
    id: Date.now().toString(),
    name: name.trim(),
    token: token.trim()
  };

  plugin._data.accounts.push(account);
  plugin._saveAccounts();
  plugin._renderAccountList();
  LoadingManager.setMessage(`账号已添加: ${account.name}`);
};

plugin._removeAccount = (id) => {
  const acc = plugin._data.accounts.find(a => a.id === id);
  if (!acc) return;

  if (!confirm(`确定删除账号 "${acc.name}" 吗？`)) return;
  if (!confirm(`⚠️ 再次确认：将永久删除该账号及 Token`)) return;

  plugin._data.accounts = plugin._data.accounts.filter(a => a.id !== id);
  
  if (plugin._data.current === id) {
    plugin._data.current = null;
    localStorage.removeItem(CURRENT_KEY);
    plugin._core.setToken('');
  }

  plugin._saveAccounts();
  plugin._renderAccountList();
  LoadingManager.setMessage(`账号已删除: ${acc.name}`);
};

plugin._switchAccount = (id, notify = true) => {
  const acc = plugin._data.accounts.find(a => a.id === id);
  if (!acc) return;

  plugin._core.setToken(acc.token);
  plugin._data.current = id;
  localStorage.setItem(CURRENT_KEY, id);
  plugin._saveAccounts();
  plugin._updateCurrentIndicator();

  if (notify) LoadingManager.setMessage(`已切换到: ${acc.name}`);
};

// ==================== UI 构建 ====================

plugin._createFloatingWindow = () => {
  // 创建悬浮窗容器
  const win = document.createElement('div');
  win.id = 'ma-floating-window';
  document.body.appendChild(win);

  // 标题栏
  const header = document.createElement('div');
  header.id = 'ma-floating-header';
  
  const title = document.createElement('div');
  title.id = 'ma-floating-title';
  title.textContent = '👤 账号切换器';
  
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '6px';
  
  const minBtn = plugin._components.createWindowButton('_', { padding: '2px 8px', fontSize: '14px' });
  minBtn.onclick = () => plugin._toggleWindow();
  
  const closeBtn = plugin._components.createWindowButton('×', { padding: '2px 8px', background: 'rgba(255,80,80,0.4)' });
  closeBtn.onclick = () => plugin._hideWindow();
  
  controls.appendChild(minBtn);
  controls.appendChild(closeBtn);
  
  header.appendChild(title);
  header.appendChild(controls);
  win.appendChild(header);

  // 内容区
  const content = document.createElement('div');
  content.id = 'ma-floating-content';
  win.appendChild(content);

  // 添加账号按钮
  const addBtn = plugin._components.createWindowButton('+ 添加新账号', { background: '#28a745' });
  addBtn.id = 'ma-add-account-btn';
  addBtn.onclick = () => plugin._addAccount();
  content.appendChild(addBtn);

  // 账号列表容器
  const list = document.createElement('div');
  list.id = 'ma-account-list';
  content.appendChild(list);

  // 拖拽功能
  plugin._makeDraggable(header, win);

  plugin._window = win;
  plugin._listContainer = list;
};

plugin._makeDraggable = (handle, win) => {
  let drag = { on: false, x: 0, y: 0, left: 0, top: 0 };
  
  handle.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    drag.on = true;
    const rect = win.getBoundingClientRect();
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.left = rect.left;
    drag.top = rect.top;
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!drag.on || !plugin._window) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    win.style.left = (drag.left + dx) + 'px';
    win.style.top = (drag.top + dy) + 'px';
    win.style.right = 'auto';
    win.style.bottom = 'auto';
  });
  
  window.addEventListener('mouseup', () => drag.on = false);
};

plugin._integrateToMainPanel = () => {
  if (!plugin._ui || !plugin._ui.winCtrls) return;

  // 查找或创建主面板按钮
  let btn = document.getElementById('ma-main-panel-btn');
  if (!btn) {
    btn = plugin._components.createWindowButton('👤', { padding: '4px 8px' });
    btn.id = 'ma-main-panel-btn';
    btn.title = '快速切换账号';
    btn.onclick = () => plugin._toggleWindow();
    plugin._ui.winCtrls.appendChild(btn);
  }
};

// ==================== 窗口控制 ====================

plugin._toggleWindow = () => {
  if (!plugin._window) return;
  const isVisible = plugin._window.style.display !== 'none';
  plugin._window.style.display = isVisible ? 'none' : 'flex';
  if (!isVisible) plugin._renderAccountList();
};

plugin._hideWindow = () => {
  if (plugin._window) plugin._window.style.display = 'none';
};

// ==================== 列表渲染 ====================

plugin._renderAccountList = () => {
  if (!plugin._listContainer) return;
  
  const list = plugin._listContainer;
  list.innerHTML = '';
  
  if (plugin._data.accounts.length === 0) {
    list.innerHTML = '<div class="ma-empty-tip">暂无账号<br>点击上方按钮添加</div>';
    return;
  }

  plugin._data.accounts.forEach(acc => {
    const item = document.createElement('div');
    item.className = 'ma-account-item';
    if (acc.id === plugin._data.current) {
      item.classList.add('current');
    }

    const info = document.createElement('div');
    info.className = 'ma-account-info';
    
    const name = document.createElement('div');
    name.className = 'ma-account-name';
    name.textContent = acc.name;
    
    const tokenPreview = document.createElement('div');
    tokenPreview.className = 'ma-account-token-preview';
    tokenPreview.textContent = acc.token.substring(0, 12) + '...' + acc.token.slice(-4);
    
    info.appendChild(name);
    info.appendChild(tokenPreview);

    const actions = document.createElement('div');
    actions.className = 'ma-account-actions';
    
    const switchBtn = plugin._components.createWindowButton('切换');
    switchBtn.onclick = () => plugin._switchAccount(acc.id);
    
    const delBtn = plugin._components.createWindowButton('删除', { background: 'rgba(255,80,80,0.2)' });
    delBtn.onclick = () => plugin._removeAccount(acc.id);
    
    actions.appendChild(switchBtn);
    actions.appendChild(delBtn);

    item.appendChild(info);
    item.appendChild(actions);
    list.appendChild(item);
  });
};

plugin._updateCurrentIndicator = () => {
  // 更新列表高亮
  const items = document.querySelectorAll('#ma-account-list .ma-account-item');
  items.forEach(item => item.classList.remove('current'));
  
  const currentItem = Array.from(items).find((item, i) => 
    plugin._data.accounts[i]?.id === plugin._data.current
  );
  if (currentItem) currentItem.classList.add('current');
  
  // 更新主面板按钮状态
  const btn = document.getElementById('ma-main-panel-btn');
  const currentAcc = plugin._data.accounts.find(a => a.id === plugin._data.current);
  if (btn && currentAcc) {
    btn.title = `当前账号: ${currentAcc.name}`;
    btn.style.background = 'rgba(100, 200, 100, 0.3) !important';
  } else if (btn) {
    btn.title = '快速切换账号';
    btn.style.background = 'rgba(100, 200, 100, 0.2) !important';
  }
};