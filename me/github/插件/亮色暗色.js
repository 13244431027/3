// 亮色/暗色模式切换插件
// ID: theme-switcher
// Author: AI Assistant

// 1. 定义亮色模式的 CSS 样式
// 我们使用 !important 来强制覆盖面板原本的内联样式
plugin.style = `
  /* 主面板背景和文字 */
  .gh-panel-light {
    background: rgba(255, 255, 255, 0.98) !important;
    color: #24292f !important;
    border: 1px solid #d0d7de !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
  }

  /* 标题栏 */
  .gh-panel-light > div:first-child {
    border-bottom: 1px solid #d0d7de !important;
    background: #f6f8fa !important;
    color: #24292f !important;
  }

  /* 按钮样式 (仿 GitHub Light) */
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

  /* 标签页按钮激活状态 */
  .gh-panel-light button[style*="rgba(255, 255, 255, 0.25)"],
  .gh-panel-light button[style*="rgba(255,255,255,0.25)"] {
    background-color: #0969da !important;
    color: #ffffff !important;
    border-color: #0969da !important;
  }

  /* 输入框、下拉框、文本域 */
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

  /* 列表项 (覆盖 Utils.itemStyle) */
  .gh-panel-light div[style*="rgba(255,255,255,0.02)"],
  .gh-panel-light div[style*="rgba(255, 255, 255, 0.02)"] {
    background-color: #ffffff !important;
    border-bottom: 1px solid #d0d7de !important;
    color: #24292f !important;
  }
  .gh-panel-light div[style*="rgba(255,255,255,0.02)"]:hover {
    background-color: #f6f8fa !important;
  }

  /* 代码块/Pre */
  .gh-panel-light pre {
    background-color: #f6f8fa !important;
    color: #24292f !important;
    border: 1px solid #d0d7de !important;
  }
  
  /* 链接 */
  .gh-panel-light a {
    color: #0969da !important;
  }

  /* 滚动条美化 (Light) */
  .gh-panel-light ::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
  }
  .gh-panel-light ::-webkit-scrollbar-thumb {
    background: #c1c1c1 !important;
  }
  .gh-panel-light ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8 !important;
  }
  
  /* 状态栏文字颜色 */
  .gh-panel-light div[style*="font-size: 12px"][style*="opacity: 0.9"] {
    color: #57606a !important;
  }
`;

// 2. 插件初始化逻辑
plugin.init = (context) => {
  const { ui } = context;
  
  // 检查 UI 是否已就绪
  if (!ui || !ui.panel || !ui.header) {
    console.error('Theme Switcher: UI not ready');
    return;
  }

  // 读取保存的设置，默认为 dark
  let isLight = localStorage.getItem('gh_panel_theme') === 'light';
  
  // 创建切换按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  toggleBtn.title = "切换亮色/暗色模式";
  
  // 按钮样式 (内联样式，确保在暗色模式下也能看清)
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

  // 切换逻辑
  const updateTheme = () => {
    if (isLight) {
      ui.panel.classList.add('gh-panel-light');
      toggleBtn.textContent = '☀️';
      // 强制修改一些可能被内联样式锁死的元素颜色
      if (ui.statusLabel) ui.statusLabel.style.color = '#57606a';
    } else {
      ui.panel.classList.remove('gh-panel-light');
      toggleBtn.textContent = '🌙';
      if (ui.statusLabel) ui.statusLabel.style.color = '#fff';
    }
    localStorage.setItem('gh_panel_theme', isLight ? 'light' : 'dark');
  };

  toggleBtn.onclick = (e) => {
    // 防止拖拽窗口
    e.stopPropagation();
    e.preventDefault();
    
    isLight = !isLight;
    updateTheme();
  };

  // 将按钮插入到标题栏的控制区 (最小化按钮之前)
  // ui.header 是标题栏 flex 容器
  // ui.header.lastChild 是包含最小化/关闭按钮的 div
  const controlsDiv = ui.header.lastElementChild;
  if (controlsDiv) {
    controlsDiv.prepend(toggleBtn);
  } else {
    ui.header.appendChild(toggleBtn);
  }

  // 初始化应用主题
  updateTheme();
  
  console.log('Theme Switcher loaded.');
};

// 3. 插件元数据
plugin.id = "theme-switcher";
plugin.name = "🌗 亮色/暗色切换";
plugin.version = "1.1.0";
