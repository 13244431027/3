plugin.id = "enhancement.per-file-commit";
plugin.name = "文件提交信息增强";
plugin.version = "1.2.0";

// 样式：提交信息小字显示
plugin.style = `
  .enh-file-commit-info { 
    font-size: 10px; 
    color: #aaa; 
    margin-top: 4px; 
    padding-left: 28px; 
    line-height: 1.4;
    height: 14px; /* 固定高度避免跳动 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .enh-file-commit-info img { 
    width: 12px; 
    height: 12px; 
    border-radius: 50%; 
    vertical-align: middle; 
    margin-right: 4px; 
  }
  .enh-file-commit-info.loading {
    color: #666;
    font-style: italic;
  }
  .enh-file-commit-info.error {
    color: #f88;
  }
`;

// 初始化：保存上下文
plugin.init = (context) => {
  plugin.ctx = context;
  console.log(`[${plugin.name}] 已加载`);
};

// 核心逻辑：监听目录加载事件
plugin.onHook = async (hookName, data) => {
  if (hookName !== 'dir:load') return;
  
  const { core, ui, api, utils } = plugin.ctx;
  const { items, path } = data;
  
  // 等待 VirtualScroller 渲染完成
  setTimeout(() => {
    // 定位 VirtualScroller 的 DOM 结构
    // 结构: mainArea > viewport > content > fragment > rows
    const viewport = ui.mainArea.querySelector('div[style*="overflow-y: auto"]');
    if (!viewport) {
      console.warn('[文件提交信息增强] 无法定位 VirtualScroller viewport');
      return;
    }
    
    const content = viewport.firstElementChild;
    if (!content) return;
    
    const fragment = content.firstElementChild;
    if (!fragment) return;
    
    // 遍历每个文件项的 DOM
    Array.from(fragment.children).forEach((row, index) => {
      const item = items[index];
      if (!item) return;
      
      // 避免重复注入
      if (row.querySelector('.enh-file-commit-info')) return;
      
      // 创建提交信息容器
      const commitDiv = document.createElement('div');
      commitDiv.className = 'enh-file-commit-info loading';
      commitDiv.textContent = '加载中...';
      row.appendChild(commitDiv);
      
      // 异步获取提交信息
      (async () => {
        try {
          // 获取该路径的最后提交
          const commits = await api.fetchJson(
            `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/commits?path=${encodeURIComponent(item.path)}&per_page=1`
          );
          
          if (commits.length > 0) {
            const c = commits[0];
            const date = new Date(c.commit.author.date).toLocaleDateString();
            const msg = c.commit.message.split('\n')[0];
            const shortMsg = msg.length > 35 ? msg.substring(0, 35) + '…' : msg;
            
            commitDiv.className = 'enh-file-commit-info';
            commitDiv.innerHTML = `
              <img src="${c.author?.avatar_url || ''}" style="display:${c.author ? 'inline-block' : 'none'}">
              ${c.commit.author.name} · ${date} · ${shortMsg}
            `;
          } else {
            commitDiv.className = 'enh-file-commit-info';
            commitDiv.textContent = '暂无提交记录';
          }
        } catch (e) {
          commitDiv.className = 'enh-file-commit-info error';
          commitDiv.textContent = '获取失败';
          console.warn(`[文件提交信息增强] 获取 ${item.path} 失败:`, e);
        }
      })();
    });
  }, 150); // 延迟确保 VirtualScroller 完成首次渲染
};
