plugin.id = "enhancement.per-file-commit";
plugin.name = "⚙️功能-文件 & 搜索信息增强";
plugin.version = "1.4.3";
plugin.author = "yuan";
plugin.description = " GitHub 面板 Pro+ 显示文件&搜索的最后提交信息，包括提交者、日期和提交信息摘要。";
plugin.tags = ["文件", "搜索", "提交信息", "增强", "虚拟滚动修复", "自动截断", "按钮重叠修复", "提交信息下移"];

// 样式：提交信息 + 搜索结果元信息
plugin.style = `
  /* 文件名容器增强：保证左侧文件名区域不会挤压或覆盖右侧按钮 */
  .enh-file-name-container {
    flex: 1 !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    gap: 2px !important;
    padding-right: 8px !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
  }

  /* 文件名文字 */
  .enh-file-title {
    display: block;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    line-height: 18px;
  }

  /* 文件提交信息（目录浏览） */
  .enh-file-commit-info { 
    display: block;
    width: 100%;
    min-width: 0;

    font-size: 10px; 
    color: #aaa; 
    line-height: 14px;
    height: 14px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    cursor: default;
    pointer-events: auto;
    box-sizing: border-box;

    /* 提交信息向下移动一点 */
    transform: translateY(3px);
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

  // 如果旧版本插件曾经注册过滚动监听或观察器，这里先清理，避免重复监听
  if (window.__enhPerFileCommitCleanup && typeof window.__enhPerFileCommitCleanup === "function") {
    try {
      window.__enhPerFileCommitCleanup();
    } catch (e) {
      console.warn(`[${plugin.name}] 清理旧监听失败:`, e);
    }
  }

  plugin._commitCache = new Map();
  plugin._currentDirItems = [];
  plugin._currentViewport = null;
  plugin._currentContent = null;
  plugin._scrollHandler = null;
  plugin._mutationObserver = null;
  plugin._injectRaf = null;

  window.__enhPerFileCommitCleanup = () => {
    try {
      if (plugin._currentViewport && plugin._scrollHandler) {
        plugin._currentViewport.removeEventListener("scroll", plugin._scrollHandler);
      }

      if (plugin._mutationObserver) {
        plugin._mutationObserver.disconnect();
      }

      if (plugin._injectRaf) {
        cancelAnimationFrame(plugin._injectRaf);
      }

      plugin._currentViewport = null;
      plugin._currentContent = null;
      plugin._scrollHandler = null;
      plugin._mutationObserver = null;
      plugin._injectRaf = null;
    } catch (e) {
      console.warn(`[${plugin.name}] cleanup error:`, e);
    }
  };

  console.log(`[${plugin.name}] 已加载`);
};

// 工具函数：格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;

  return date.toLocaleDateString();
}

// 工具函数：HTML 转义，防止提交信息里有特殊字符破坏 DOM
function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 工具函数：获取当前目录虚拟滚动 viewport
function getBrowseViewport(ui) {
  if (!ui || !ui.mainArea) return null;
  return ui.mainArea.querySelector('div[style*="overflow-y: auto"]');
}

// 工具函数：获取虚拟滚动 content
function getBrowseContent(viewport) {
  if (!viewport) return null;
  return viewport.firstElementChild || null;
}

// 工具函数：获取虚拟滚动 fragment
function getBrowseFragment(viewport) {
  const content = getBrowseContent(viewport);
  if (!content) return null;
  return content.firstElementChild || null;
}

// 工具函数：获取虚拟滚动当前起始索引
function getVirtualStartIndex(fragment) {
  if (!fragment) return 0;

  const topText = fragment.style.top || "0px";
  const top = parseInt(topText, 10) || 0;

  // 主扩展 loadDir 中 VirtualScroller 的 itemHeight 是 50
  const itemHeight = 50;

  return Math.max(0, Math.floor(top / itemHeight));
}

// 工具函数：构造提交缓存 key
function buildCommitCacheKey(core, item) {
  const owner = core.currentOwner || "";
  const repo = core.currentRepo || "";
  const branch = core.currentBranch || "";
  const path = item?.path || "";

  return `${owner}/${repo}@${branch}:${path}`;
}

// 工具函数：请求单个文件/目录的最后提交信息，带缓存
async function getCommitInfoForItem(core, api, item) {
  if (!plugin._commitCache) {
    plugin._commitCache = new Map();
  }

  const cacheKey = buildCommitCacheKey(core, item);

  if (plugin._commitCache.has(cacheKey)) {
    return plugin._commitCache.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const commits = await api.fetchJson(
        `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/commits?path=${encodeURIComponent(item.path)}&per_page=1`
      );

      if (commits.length > 0) {
        const c = commits[0];

        const authorName = c.commit?.author?.name || "未知";
        const authorDate = c.commit?.author?.date || "";
        const date = authorDate ? new Date(authorDate).toLocaleDateString() : "未知日期";

        const msg = c.commit?.message
          ? c.commit.message.split("\n")[0]
          : "无提交信息";

        const avatarUrl = c.author?.avatar_url || "";
        const hasAvatar = !!c.author;

        const fullText = `${authorName} · ${date} · ${msg}`;

        return {
          ok: true,
          className: "enh-file-commit-info",
          title: fullText,
          html: `
            <img 
              src="${escapeHtml(avatarUrl)}" 
              style="display:${hasAvatar ? "inline-block" : "none"}"
            >
            ${escapeHtml(authorName)} · ${escapeHtml(date)} · ${escapeHtml(msg)}
          `,
          text: ""
        };
      }

      return {
        ok: true,
        className: "enh-file-commit-info",
        title: "暂无提交记录",
        html: "",
        text: "暂无提交记录"
      };
    } catch (e) {
      return {
        ok: false,
        className: "enh-file-commit-info error",
        title: "获取失败",
        html: "",
        text: "获取失败"
      };
    }
  })();

  plugin._commitCache.set(cacheKey, promise);
  return promise;
}

// 工具函数：增强左侧文件名容器，避免与右侧按钮重叠
function ensureFileNameContainer(row) {
  if (!row) return null;

  const nameEl = row.firstElementChild;
  if (!nameEl) return null;

  nameEl.classList.add("enh-file-name-container");

  // 如果已经处理过，就直接返回
  if (nameEl.dataset.enhFileNameWrapped === "1") {
    return nameEl;
  }

  const originalText = nameEl.textContent || "";

  // 保留原来的点击事件，因为 onclick 绑定在 nameEl 上
  nameEl.innerHTML = "";

  const titleSpan = document.createElement("span");
  titleSpan.className = "enh-file-title";
  titleSpan.textContent = originalText;
  titleSpan.title = originalText;

  nameEl.appendChild(titleSpan);

  nameEl.dataset.enhFileNameWrapped = "1";

  return nameEl;
}

// 工具函数：把提交信息结果应用到 DOM
function applyCommitInfoToDiv(commitDiv, result) {
  if (!commitDiv || !result) return;

  commitDiv.className = result.className || "enh-file-commit-info";
  commitDiv.title = result.title || "";

  if (result.html) {
    commitDiv.innerHTML = result.html;
  } else {
    commitDiv.textContent = result.text || "";
  }
}

// 工具函数：给单行插入提交信息 DOM
function ensureCommitDivForRow(row) {
  if (!row) return null;

  const nameEl = ensureFileNameContainer(row);
  if (!nameEl) return null;

  const exists = nameEl.querySelector(".enh-file-commit-info");
  if (exists) return exists;

  const commitDiv = document.createElement("div");
  commitDiv.className = "enh-file-commit-info loading";
  commitDiv.textContent = "加载中...";

  // 防止点击提交信息时触发打开文件/进入目录
  commitDiv.onclick = (e) => {
    e.stopPropagation();
  };

  commitDiv.onmousedown = (e) => {
    e.stopPropagation();
  };

  nameEl.appendChild(commitDiv);

  return commitDiv;
}

// 核心函数：给当前可见的虚拟滚动行补充提交信息
function injectVisibleFileCommitInfo() {
  if (!plugin.ctx) return;

  const { core, ui, api } = plugin.ctx;

  if (!ui || !ui.mainArea) return;
  if (!plugin._currentDirItems || !Array.isArray(plugin._currentDirItems)) return;

  const viewport = getBrowseViewport(ui);
  if (!viewport) return;

  const fragment = getBrowseFragment(viewport);
  if (!fragment) return;

  const rows = Array.from(fragment.children);
  if (!rows.length) return;

  const startIndex = getVirtualStartIndex(fragment);

  rows.forEach((row, visibleIndex) => {
    const realIndex = startIndex + visibleIndex;
    const item = plugin._currentDirItems[realIndex];

    if (!item) return;

    const commitDiv = ensureCommitDivForRow(row);
    if (!commitDiv) return;

    // 如果该行已经绑定了相同 path，就不用重复处理
    if (commitDiv.dataset.path === item.path && commitDiv.dataset.loaded === "1") {
      return;
    }

    commitDiv.dataset.path = item.path;
    commitDiv.dataset.loaded = "0";
    commitDiv.className = "enh-file-commit-info loading";
    commitDiv.textContent = "加载中...";

    getCommitInfoForItem(core, api, item).then((result) => {
      // 虚拟滚动可能已经重建 DOM，此时这个 div 可能已经对应别的 item
      // 所以应用前必须检查 path 是否仍然一致
      if (!commitDiv || commitDiv.dataset.path !== item.path) return;

      applyCommitInfoToDiv(commitDiv, result);
      commitDiv.dataset.loaded = "1";
    });
  });
}

// 工具函数：调度注入，避免滚动时过于频繁
function scheduleInjectVisibleFileCommitInfo() {
  if (plugin._injectRaf) {
    cancelAnimationFrame(plugin._injectRaf);
  }

  plugin._injectRaf = requestAnimationFrame(() => {
    plugin._injectRaf = null;
    injectVisibleFileCommitInfo();
  });
}

// 工具函数：绑定目录虚拟滚动监听
function bindVirtualScrollFixForDir() {
  if (!plugin.ctx) return;

  const { ui } = plugin.ctx;

  const viewport = getBrowseViewport(ui);
  if (!viewport) return;

  const content = getBrowseContent(viewport);
  if (!content) return;

  // 如果之前已经绑定过旧 viewport，先解绑
  if (plugin._currentViewport && plugin._scrollHandler) {
    try {
      plugin._currentViewport.removeEventListener("scroll", plugin._scrollHandler);
    } catch (e) {
      console.warn(`[${plugin.name}] remove old scroll listener failed:`, e);
    }
  }

  if (plugin._mutationObserver) {
    try {
      plugin._mutationObserver.disconnect();
    } catch (e) {
      console.warn(`[${plugin.name}] disconnect old observer failed:`, e);
    }
  }

  plugin._currentViewport = viewport;
  plugin._currentContent = content;

  plugin._scrollHandler = () => {
    // VirtualScroller 自己也监听 scroll。
    // 它会先重建 DOM，然后这里 requestAnimationFrame 再补充提交信息。
    scheduleInjectVisibleFileCommitInfo();
  };

  viewport.addEventListener("scroll", plugin._scrollHandler);

  // 监听虚拟滚动重建 DOM。
  // 因为 VirtualScroller 会 content.innerHTML = '';
  // MutationObserver 可以在 DOM 变动后自动补充提交信息。
  plugin._mutationObserver = new MutationObserver(() => {
    scheduleInjectVisibleFileCommitInfo();
  });

  plugin._mutationObserver.observe(content, {
    childList: true,
    subtree: true
  });

  // 首次绑定后立即注入一次
  scheduleInjectVisibleFileCommitInfo();

  // 再延迟注入几次，防止主扩展渲染尚未完全结束
  setTimeout(() => {
    scheduleInjectVisibleFileCommitInfo();
  }, 100);

  setTimeout(() => {
    scheduleInjectVisibleFileCommitInfo();
  }, 250);

  setTimeout(() => {
    scheduleInjectVisibleFileCommitInfo();
  }, 500);
}

// 核心逻辑：监听目录加载和搜索结果事件
plugin.onHook = async (hookName, data) => {
  const { core, ui, api } = plugin.ctx;

  // ==================== 1. 目录浏览：文件提交信息 ====================
  if (hookName === "dir:load") {
    const { items } = data;

    plugin._currentDirItems = Array.isArray(items) ? items : [];

    // 每次加载新目录时清理旧监听，避免叠加
    if (plugin._currentViewport && plugin._scrollHandler) {
      try {
        plugin._currentViewport.removeEventListener("scroll", plugin._scrollHandler);
      } catch (e) {
        console.warn(`[${plugin.name}] remove scroll listener failed:`, e);
      }
    }

    if (plugin._mutationObserver) {
      try {
        plugin._mutationObserver.disconnect();
      } catch (e) {
        console.warn(`[${plugin.name}] disconnect observer failed:`, e);
      }
    }

    plugin._currentViewport = null;
    plugin._currentContent = null;
    plugin._scrollHandler = null;
    plugin._mutationObserver = null;

    // 原始逻辑：目录加载后等待主扩展渲染完成再处理
    setTimeout(() => {
      bindVirtualScrollFixForDir();
      injectVisibleFileCommitInfo();
    }, 150);
  }

  // ==================== 2. 搜索结果：仓库元信息 ====================
  if (hookName === "search:repos") {
    const { items } = data;

    setTimeout(() => {
      // 搜索结果直接渲染在 mainArea 的第一层 div 下
      const listContainer = ui.mainArea.querySelector(":scope > div");
      if (!listContainer) return;

      const rows = Array.from(listContainer.children);

      rows.forEach((row, index) => {
        const item = items[index];
        if (!item || row.querySelector(".enh-search-repo-meta")) return;

        const metaDiv = document.createElement("div");
        metaDiv.className = "enh-search-repo-meta";

        // 格式化最后更新日期
        const updatedText = formatDate(item.updated_at);

        const ownerLogin = item.owner?.login || "未知";
        const ownerAvatar = item.owner?.avatar_url || "";

        metaDiv.innerHTML = `
          <img src="${escapeHtml(ownerAvatar)}" alt="${escapeHtml(ownerLogin)}">
          <span class="meta-text">${escapeHtml(ownerLogin)} · 更新于 ${escapeHtml(updatedText)}</span>
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

  // ==================== 3. 面板隐藏时清理监听，防止后台继续运行 ====================
  if (hookName === "ui:hide") {
    if (window.__enhPerFileCommitCleanup && typeof window.__enhPerFileCommitCleanup === "function") {
      try {
        window.__enhPerFileCommitCleanup();
      } catch (e) {
        console.warn(`[${plugin.name}] ui:hide cleanup failed:`, e);
      }
    }
  }

  // ==================== 4. 切换模式时，如果不是浏览模式，也清理监听 ====================
  if (hookName === "mode:switch") {
    if (data !== "browse") {
      if (window.__enhPerFileCommitCleanup && typeof window.__enhPerFileCommitCleanup === "function") {
        try {
          window.__enhPerFileCommitCleanup();
        } catch (e) {
          console.warn(`[${plugin.name}] mode:switch cleanup failed:`, e);
        }
      }
    }
  }
};