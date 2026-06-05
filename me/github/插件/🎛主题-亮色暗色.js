// 亮色/暗色模式切换插件 
// ID: theme-switcher
// Author: yuan

// 1. 定义亮色模式的 CSS 样式
plugin.style = `
 .gh-panel-light {
   background: rgba(255, 255, 255, 0.98) !important;
   color: #24292f !important;
   border: 1px solid #d0d7de !important;
   box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
 }
 .gh-panel-light > div:first-child {
   border-bottom: 1px solid #d0d7de !important;
   background: #f6f8fa !important;
   color: #24292f !important;
 }
 .gh-panel-light button {
   background-color: #f6f8fa !important;
   color: #24292f !important;
   border: 1px solid rgba(27, 31, 35, 0.15) !important;
   box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04) !important;
 }
 .gh-panel-light button:hover {
   background-color: #f3f4f6 !important;
   border-color: rgba(27, 31, 35, 0.15) !important;
 }
 .gh-panel-light button:active {
   background-color: #ebecf0 !important;
 }
 .gh-panel-light button[style*="rgba(255, 255, 255, 0.25)"],
 .gh-panel-light button[style*="rgba(255,255,255,0.25)"] {
   background-color: #0969da !important;
   color: #ffffff !important;
   border-color: #0969da !important;
 }
 .gh-panel-light input, 
 .gh-panel-light select, 
 .gh-panel-light textarea {
   background-color: #ffffff !important;
   color: #24292f !important;
   border: 1px solid #d0d7de !important;
 }
 .gh-panel-light input::placeholder,
 .gh-panel-light textarea::placeholder {
   color: #6e7781 !important;
 }
 .gh-panel-light div[style*="rgba(255,255,255,0.02)"],
 .gh-panel-light div[style*="rgba(255, 255, 255, 0.02)"] {
   background-color: #ffffff !important;
   border-bottom: 1px solid #d0d7de !important;
   color: #24292f !important;
 }
 .gh-panel-light div[style*="rgba(255,255,255,0.02)"]:hover {
   background-color: #f6f8fa !important;
 }
 .gh-panel-light pre {
   background-color: #f6f8fa !important;
   color: #24292f !important;
   border: 1px solid #d0d7de !important;
 }
 .gh-panel-light a {
   color: #0969da !important;
 }
 .gh-panel-light ::-webkit-scrollbar-track {
   background: #f1f1f1 !important;
 }
 .gh-panel-light ::-webkit-scrollbar-thumb {
   background: #c1c1c1 !important;
 }
 .gh-panel-light ::-webkit-scrollbar-thumb:hover {
   background: #a8a8a8 !important;
 }
 .gh-panel-light div[style*="font-size: 12px"][style*="opacity: 0.9"] {
   color: #57606a !important;
 }
`;

// 2. 核心逻辑封装
const applyTheme = (context) => {
  const { ui } = context;
  if (!ui || !ui.panel || !ui.header) return;

  // 确保本地存储的偏好被读取
  const isLight = localStorage.getItem('gh_panel_theme') === 'light';

  // 创建或获取切换按钮
  let toggleBtn = ui.header.querySelector('[data-theme-switcher]');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.setAttribute('data-theme-switcher', 'true');
    toggleBtn.title = "切换亮色/暗色模式";
    Object.assign(toggleBtn.style, {
      background: 'transparent',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '0 8px',
      marginLeft: '4px',
      lineHeight: '1'
    });

    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const current = localStorage.getItem('gh_panel_theme') === 'light';
      localStorage.setItem('gh_panel_theme', current ? 'dark' : 'light');
      applyTheme(context); // 递归刷新
    };

    // 插入到标题栏控制区（通常为最后一个子元素）
    const controlsDiv = ui.header.lastElementChild;
    if (controlsDiv) {
      controlsDiv.prepend(toggleBtn);
    } else {
      ui.header.appendChild(toggleBtn);
    }
  }

  // 更新按钮图标
  toggleBtn.textContent = isLight ? '☀️' : '🌙';

  // 应用主题类
  if (isLight) {
    ui.panel.classList.add('gh-panel-light');
  } else {
    ui.panel.classList.remove('gh-panel-light');
  }

  // 强制修正状态栏颜色（避免内联样式覆盖）
  if (ui.statusLabel) {
    ui.statusLabel.style.color = isLight ? '#57606a' : '#fff';
  }

  // 同步存储（确保一致性）
  localStorage.setItem('gh_panel_theme', isLight ? 'light' : 'dark');
};

// 3. 初始化：首次应用主题并监听显示事件
plugin.init = (context) => {
  // 立即应用主题
  applyTheme(context);

  // 注册钩子：当面板重新显示时，重新注入按钮并刷新主题
  // （插件管理器会自动调用 onHook 方法）
  plugin._context = context; // 保存引用
  console.log('Theme Switcher loaded (with re-injection).');
};

// 4. 钩子处理：面板显示时重新应用
plugin.onHook = (hookName, data) => {
  if (hookName === 'ui:show' || hookName === 'ui:ready') {
    if (plugin._context) {
      applyTheme(plugin._context);
    }
  }
};

// 5. 插件元数据
plugin.id = "theme-switcher";
plugin.name = "🌗 亮色/暗色切换";
plugin.version = "1.2.0";
plugin.author = "yuan";
plugin.description = "为 GitHub 面板 Pro+ 提供亮色和暗色模式切换功能";"