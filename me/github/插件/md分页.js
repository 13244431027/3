// ============================================================
// 插件：Markdown 分页浏览器
// 在浏览目录时，把文件夹内所有 .md 文件 + 自动获取的 README
// 做成分页标签，插入到原 README 显示位置（监听 DOM，防重复）
// ============================================================

plugin.id = "md-tabs-viewer";
plugin.name = "Markdown 分页浏览器";
plugin.version = "1.0.2";
plugin.description = "将文件夹内所有 .md 文件与 README 并列为分页标签，插入到原 README 位置";
plugin.tags = ["markdown", "readme", "tabs", "ui"];

plugin.style = `
.mdtabs-box{
  margin-top:15px;
  border:1px solid rgba(255,255,255,0.12);
  border-radius:10px;
  background:rgba(255,255,255,0.04);
  overflow:hidden;
}
.mdtabs-bar{
  display:flex;
  gap:2px;
  flex-wrap:wrap;
  padding:6px 6px 0 6px;
  background:rgba(0,0,0,0.25);
  border-bottom:1px solid rgba(255,255,255,0.1);
}
.mdtabs-tab{
  border:1px solid rgba(255,255,255,0.12);
  border-bottom:none;
  background:rgba(255,255,255,0.05);
  color:#ccc;
  padding:6px 12px;
  font-size:12px;
  cursor:pointer;
  border-radius:8px 8px 0 0;
  max-width:160px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.mdtabs-tab:hover{ background:rgba(255,255,255,0.1); }
.mdtabs-tab.active{
  background:rgba(60,160,255,0.22);
  color:#fff;
  border-color:rgba(60,160,255,0.35);
}
.mdtabs-content{
  padding:12px;
  font-size:13px;
  max-height:420px;
  overflow-y:auto;
  line-height:1.5;
}
.mdtabs-loading{ opacity:0.6; font-size:12px; padding:10px; }
`;

plugin.init = (context) => {
  plugin._ctx = context;
  plugin._observer = null;
  plugin._currentBox = null;
};

plugin.onHook = (hookName, data) => {
  if (hookName !== 'dir:load') return;
  const ctx = plugin._ctx;
  if (!ctx) return;

  const ext = ctx.extension;
  const mainArea = ext.ui.mainArea;
  if (!mainArea) return;

  const items = (data && data.items) || [];
  const path = (data && data.path) || '';

  const mdFiles = items.filter(
    (it) => it.type === 'file' && it.name.toLowerCase().endsWith('.md')
  );

  const includeRepoReadme = !path;
  const hasReadmeInDir = mdFiles.some((f) => f.name.toLowerCase() === 'readme.md');

  if (mdFiles.length === 0 && !includeRepoReadme) {
    plugin._stopObserver();
    return;
  }

  // 断开旧的 observer
  plugin._stopObserver();
  plugin._currentBox = null;

  // 立即尝试一次（README 可能已经在 DOM 中，但通常不会，因为 _loadFolderReadme 是异步的）
  const tryReplace = () => {
    const original = plugin._findOriginalReadme(mainArea);
    if (original) {
      plugin._render(ctx, mainArea, mdFiles, path, includeRepoReadme, hasReadmeInDir, original);
      plugin._stopObserver();
      return true;
    }
    return false;
  };

  // 若有 readme.md 在目录中，等待原扩展异步追加
  if (hasReadmeInDir) {
    if (tryReplace()) return;

    // 用 MutationObserver 监听 mainArea，原 README 框一旦出现就立即替换
    plugin._observer = new MutationObserver(() => {
      if (tryReplace()) {
        // 已替换
      }
    });
    plugin._observer.observe(mainArea, { childList: true });

    // 兜底：3 秒后无论如何停止监听
    setTimeout(() => plugin._stopObserver(), 3000);
  } else {
    // 目录没有 readme.md，原扩展不会追加 README 框，直接渲染（追加到末尾）
    plugin._render(ctx, mainArea, mdFiles, path, includeRepoReadme, hasReadmeInDir, null);
  }
};

plugin._stopObserver = () => {
  if (plugin._observer) {
    plugin._observer.disconnect();
    plugin._observer = null;
  }
};

plugin._render = async (ctx, mainArea, mdFiles, path, includeRepoReadme, hasReadmeInDir, originalReadmeBox) => {
  const { core, utils } = ctx;
  const api = core.apiManager;
  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const branch = core.currentBranch;

  // 防止重复插入：如果当前 mainArea 已有插件框，移除旧的
  const existing = mainArea.querySelector('.mdtabs-box');
  if (existing) existing.remove();

  // 构建分页源列表
  const sources = [];

  if (includeRepoReadme && !hasReadmeInDir) {
    sources.push({ label: '📖 README (自动)', type: 'repo-readme' });
  }

  mdFiles.forEach((f) => {
    sources.push({
      label: f.name,
      type: 'file',
      url: f.url,
      name: f.name
    });
  });

  if (sources.length === 0) return;

  const box = document.createElement('div');
  box.className = 'mdtabs-box';

  const bar = document.createElement('div');
  bar.className = 'mdtabs-bar';

  const content = document.createElement('div');
  content.className = 'mdtabs-content';

  box.appendChild(bar);
  box.appendChild(content);

  // 插入位置：原 README 框位置 / 末尾
  if (originalReadmeBox && originalReadmeBox.parentNode) {
    originalReadmeBox.parentNode.insertBefore(box, originalReadmeBox);
    originalReadmeBox.remove();
  } else {
    mainArea.appendChild(box);
  }

  plugin._currentBox = box;

  // 内容缓存
  const cache = new Map();

  const loadContent = async (src) => {
    if (cache.has(src.label)) return cache.get(src.label);

    let text = '';
    try {
      if (src.type === 'repo-readme') {
        const d = await api.fetchJson(
          `https://api.github.com/repos/${owner}/${repo}/readme${branch ? '?ref=' + branch : ''}`
        );
        text = decodeURIComponent(escape(atob(d.content.replace(/\n/g, ''))));
      } else {
        const d = await api.fetchJson(src.url);
        text = decodeURIComponent(escape(atob(d.content.replace(/\n/g, ''))));
      }
    } catch (e) {
      text = `*加载失败：${e.message || e}*`;
    }

    const html = utils.parseMarkdown(text, owner, repo, branch);
    cache.set(src.label, html);
    return html;
  };

  const switchTo = async (index) => {
    Array.from(bar.children).forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });
    content.innerHTML = '<div class="mdtabs-loading">加载中...</div>';
    const html = await loadContent(sources[index]);
    content.innerHTML = html;
  };

  sources.forEach((src, index) => {
    const tab = document.createElement('button');
    tab.className = 'mdtabs-tab';
    tab.textContent = src.label;
    tab.title = src.label;
    tab.onclick = () => switchTo(index);
    bar.appendChild(tab);
  });

  let defaultIndex = 0;
  const readmeIdx = sources.findIndex(
    (s) => s.type === 'repo-readme' || s.label.toLowerCase() === 'readme.md'
  );
  if (readmeIdx >= 0) defaultIndex = readmeIdx;

  switchTo(defaultIndex);
};

plugin._findOriginalReadme = (mainArea) => {
  const children = Array.from(mainArea.children);
  for (const child of children) {
    if (child.classList && child.classList.contains('mdtabs-box')) continue;
    if (
      child.firstChild &&
      child.firstChild.textContent &&
      child.firstChild.textContent.trim() === 'README.md'
    ) {
      return child;
    }
  }
  return null;
};