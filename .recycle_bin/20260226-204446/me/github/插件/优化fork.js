
plugin.id = "ghpanel.fork-merge-pr";
plugin.name = "Fork: 合并回原仓库(PR)";
plugin.version = "1.0.0";

plugin.style = `
  .forkMergeBtn { background: rgba(120,200,120,0.22) !important; border-color: rgba(120,200,120,0.35) !important; }
  .forkMergeBtn[disabled] { opacity: 0.55; cursor: not-allowed; }
`;

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  // 延迟到 UI ready 再挂按钮更稳
  const tryMount = () => {
    const { ui, components } = plugin._ctx;
    if (!ui || !ui.tabs) return false;

    if (plugin._btn) return true;

    const btn = components.createWindowButton("合并仓库: (未检测)", {});
    btn.classList.add("forkMergeBtn");
    btn.style.display = "none";
    btn.onclick = () => plugin._onClick().catch(err => {
      console.error(err);
      alert("操作失败: " + (err.message || String(err)));
    });

    ui.tabs.appendChild(btn);
    plugin._btn = btn;
    return true;
  };

  tryMount();
};

plugin.onHook = async (hookName, data) => {
  const ctx = plugin._ctx;
  if (!ctx) return;

  // UI 创建后再确保按钮存在
  if (hookName === "ui:ready") {
    plugin.init(ctx);
    return;
  }

  // 在进入 browse / 或刷新目录时尝试检测 fork 状态
  if (hookName === "mode:switch" && data === "browse") {
    await plugin._refreshForkStatus().catch(() => {});
  }
  if (hookName === "dir:load") {
    await plugin._refreshForkStatus().catch(() => {});
  }
};

plugin._refreshForkStatus = async () => {
  const { core, api } = plugin._ctx;
  if (!plugin._btn) return;

  // 未进入仓库则隐藏
  if (!core.currentOwner || !core.currentRepo) {
    plugin._btn.style.display = "none";
    return;
  }

  // 拉 repo meta（fork / parent 信息）
  const repo = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}`);

  if (!repo.fork || !repo.parent) {
    plugin._btn.style.display = "none";
    plugin._repoMeta = null;
    return;
  }

  plugin._repoMeta = repo; // 含 parent
  const upstreamFull = repo.parent.full_name; // owner/repo
  plugin._btn.textContent = `合并仓库: ${upstreamFull}`;
  plugin._btn.style.display = "inline-block";
};

plugin._onClick = async () => {
  const { core, api } = plugin._ctx;

  if (!core.token) {
    alert("需要先在扩展里设置 GitHub Token");
    return;
  }

  if (!plugin._repoMeta) {
    await plugin._refreshForkStatus();
  }
  const repo = plugin._repoMeta;
  if (!repo || !repo.fork || !repo.parent) {
    alert("当前仓库不是 fork，无法合并回上游");
    return;
  }

  const upstream = repo.parent; // 上游仓库对象（含 owner/login, name, default_branch）
  const upstreamOwner = upstream.owner.login;
  const upstreamRepo = upstream.name;
  const base = upstream.default_branch || "main";

  const headOwner = repo.owner.login; // 当前 fork 拥有者
  const headBranch = core.currentBranch || repo.default_branch || "main";
  const head = `${headOwner}:${headBranch}`;

  const title = `Merge ${repo.full_name}@${headBranch} into ${upstream.full_name}`;
  const body =
    `Created via GitHub Panel Pro+ plugin.\n\n` +
    `Source (fork): ${repo.full_name}\n` +
    `Head: ${head}\n` +
    `Base (upstream): ${upstream.full_name}:${base}\n`;

  const ok = confirm(
    `将对上游仓库创建 PR：\n\n` +
    `Upstream: ${upstream.full_name}\n` +
    `Base: ${base}\n` +
    `Head: ${head}\n\n` +
    `继续吗？`
  );
  if (!ok) return;

  plugin._btn.disabled = true;
  const oldText = plugin._btn.textContent;
  plugin._btn.textContent = "创建 PR 中...";

  try {
    const pr = await api.createPullRequest(upstreamOwner, upstreamRepo, title, head, base, body);
    alert(`PR 创建成功：#${pr.number}\n${pr.html_url}`);
    window.open(pr.html_url, "_blank");
  } catch (e) {
    // 常见：422 已存在相同 head->base 的 PR；或无权限
    throw e;
  } finally {
    plugin._btn.disabled = false;
    plugin._btn.textContent = oldText;
  }
};