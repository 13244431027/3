plugin.id = "enhancement.per-file-commit";
plugin.name = "⚙️功能-文件 & 搜索信息增强";
plugin.version = "1.3.0";
plugin.author = "yuan";
plugin.description = " GitHub 面板 Pro+ 显示文件&搜索的最后提交信息，包括提交者、日期和提交信息摘要。";
// 样式：提交信息 + 搜索结果元信息
plugin.style = `
  /* 文件提交信息（目录浏览） */
  .enh-file-commit-info { 
    font-size: 10px; 
    color: #aaa; 
    margin-top: 4px; 
    padding-left: 28px; 
    line-height: 1.4;
    height: 14px;
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

  /* 搜索结果元信息 */
  .enh-search-repo-meta {
    font-size: 10px;
    color: #aaa;
    margin: 4px 0;
    padding-left: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 16px;
    overflow: hidden;
  }
  .enh-search-repo-meta img {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .enh-search-repo-meta .meta-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// 初始化：保存上下文
plugin.init = (context) => {
  plugin.ctx = context;
  console.log(`[${plugin.name}] 已加载`);
};

// 工具函数：格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return date.toLocaleDateString();
}

// 核心逻辑：监听目录加载和搜索结果事件
plugin.onHook = async (hookName, data) => {
  const { core, ui, api } = plugin.ctx;

  // ==================== 1. 目录浏览：文件提交信息 ====================
  if (hookName === 'dir:load') {
    const { items } = data;
    
    setTimeout(() => {
      const viewport = ui.mainArea.querySelector('div[style*="overflow-y: auto"]');
      if (!viewport) return;
      
      const content = viewport.firstElementChild;
      if (!content) return;
      
      const fragment = content.firstElementChild;
      if (!fragment) return;
      
      Array.from(fragment.children).forEach((row, index) => {
        const item = items[index];
        if (!item || row.querySelector('.enh-file-commit-info')) return;
        
        const commitDiv = document.createElement('div');
        commitDiv.className = 'enh-file-commit-info loading';
        commitDiv.textContent = '加载中...';
        
        const actsContainer = row.lastElementChild;
        if (actsContainer) {
          row.insertBefore(commitDiv, actsContainer);
        } else {
          row.appendChild(commitDiv);
        }
        
        (async () => {
          try {
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
          }
        })();
      });
    }, 150);
  }

  // ==================== 2. 搜索结果：仓库元信息 ====================
  if (hookName === 'search:repos') {
    const { items } = data;
    
    setTimeout(() => {
      // 搜索结果直接渲染在 mainArea 的第一层 div 下
      const listContainer = ui.mainArea.querySelector(':scope > div');
      if (!listContainer) return;
      
      const rows = Array.from(listContainer.children);
      
      rows.forEach((row, index) => {
        const item = items[index];
        if (!item || row.querySelector('.enh-search-repo-meta')) return;
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'enh-search-repo-meta';
        
        // 格式化最后更新日期
        const updatedText = formatDate(item.updated_at);
        
        metaDiv.innerHTML = `
          <img src="${item.owner.avatar_url}" alt="${item.owner.login}">
          <span class="meta-text">${item.owner.login} · 更新于 ${updatedText}</span>
        `;
        
        // 插入到按钮容器前
        const actsContainer = row.lastElementChild;
        if (actsContainer) {
          row.insertBefore(metaDiv, actsContainer);
        } else {
          row.appendChild(metaDiv);
        }
      });
    }, 150);
  }
};