plugin.id = "fork.merge-to-upstream";
plugin.name = "Fork: Merge To Upstream Button";
plugin.version = "1.0.0";

plugin.init = (ctx) => {
  plugin._ctx = ctx;
  plugin._btn = null;
  plugin._lastRepoKey = "";
};

plugin.onHook = async (hookName, data) => {
  if (hookName !== "dir:load") return;

  const { core, api, ui, components } = plugin._ctx;
  if (!core.currentOwner || !core.currentRepo) return;
  if (!ui || !ui.browseArea) return;

  const repoKey = `${core.currentOwner}/${core.currentRepo}@${core.currentBranch}`;
  // 避免同一仓库目录刷新时反复请求/重复插按钮
  if (plugin._lastRepoKey === repoKey && plugin._btn) return;
  plugin._lastRepoKey = repoKey;

  // 若之前有按钮，先清理（切换仓库时）
  if (plugin._btn) {
    try { plugin._btn.remove(); } catch {}
    plugin._btn = null;
  }

  // 获取仓库 meta，判断是否 fork
  let meta;
  try {
    meta = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}`);
  } catch {
    return;
  }

  if (!meta || !meta.fork || !meta.parent || !meta.parent.full_name) return;

  const upstreamFullName = meta.parent.full_name; // e.g. owner/repo
  const btn = components.createWindowButton(`合并到仓库: ${upstreamFullName}`, {
    background: "rgba(255,165,0,0.22)",
    border: "1px solid rgba(255,165,0,0.35)"
  });

  btn.onclick = () => {
    // 打开“对上游发起 PR”的 compare 页面（从 fork 的当前分支 -> upstream 默认分支）
    const head = `${core.currentOwner}:${core.currentBranch || meta.default_branch}`;
    const base = meta.parent.default_branch || "main";
    const url = `https://github.com/${upstreamFullName}/compare/${base}...${encodeURIComponent(head)}?expand=1`;
    window.open(url, "_blank");
  };

  // 插入到分支那一行（browseArea 的第二个 div：bcBranch）
  // browseArea 结构：bc1(owner/repo) -> bcBranch(branch/btns) -> bc2(path工具栏) -> bc3(其他) -> actionRow
  const bcBranch = ui.branchSelect ? ui.branchSelect.parentElement : null;
  if (bcBranch) {
    bcBranch.appendChild(btn);
    plugin._btn = btn;
  }
};
