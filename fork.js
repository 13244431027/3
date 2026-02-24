const plugin = {
  id: "fork-pr-helper",
  name: "Fork PR 助手",
  version: "1.1.0",
  init: function(ctx) {
    this.ctx = ctx;
    this.forkInfo = null;
    console.log("✅ Fork PR 助手已加载");
  },
  onHook: function(hookName, data) {
    // 当加载目录时检查 fork 状态
    if (hookName === 'dir:load') this.checkFork();
    // 离开浏览模式时移除按钮
    if (hookName === 'mode:switch' && data !== 'browse') this.removeButton();
  },
  checkFork: async function() {
    const { core, ui, api } = this.ctx;
    if (core.mode !== 'browse' || !core.currentOwner || !core.currentRepo) return;
    
    try {
      const repo = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}`);
      if (!repo.fork) return this.removeButton();
      
      this.forkInfo = {
        owner: repo.parent.owner.login,
        repo: repo.parent.name,
        branch: repo.parent.default_branch
      };
      this.showButton();
    } catch(e) {
      console.warn('Fork 检查失败:', e);
    }
  },
  showButton: function() {
    const { ui } = this.ctx;
    this.removeButton();
    const btn = this.ctx.components.createWindowButton(
      `📤 合并到 ${this.forkInfo.owner}/${this.forkInfo.repo}`,
      { background: 'linear-gradient(45deg, #28a745, #20c997)', marginLeft: 'auto' }
    );
    btn.id = 'fork-pr-btn';
    btn.onclick = () => this.createPR();
    ui.actionRow.appendChild(btn);
  },
  removeButton: function() {
    const { ui } = this.ctx;
    ui.actionRow?.querySelector('#fork-pr-btn')?.remove();
  },
  createPR: async function() {
    const { core, api } = this.ctx;
    if (!this.forkInfo) return;
    
    const { owner, repo, branch } = this.forkInfo;
    const head = `${core.currentOwner}:${core.currentBranch}`;
    
    try {
      if (!confirm(`创建 PR 到 ${owner}/${repo}?\n\nHead: ${head}\nBase: ${branch}`)) return;
      LoadingManager.setMessage('创建 PR...');
      
      const commits = await api.fetchJson(`https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/commits?sha=${core.currentBranch}&per_page=1`);
      const title = prompt('PR 标题:', commits[0]?.commit.message.split('\n')[0] || 'Update');
      if (!title) return;
      
      const body = prompt('PR 描述:', `来自 ${core.currentOwner}/${core.currentRepo}:${core.currentBranch}`);
      
      const pr = await api.createPullRequest(owner, repo, title, head, branch, body || '');
      
      if (confirm(`✅ PR #${pr.number} 创建成功！\n\n跳转到 PR 页面？`)) {
        window.open(pr.html_url, '_blank');
      }
      LoadingManager.setMessage('PR 创建完成');
    } catch(err) {
      const msg = err.message || String(err);
      if (msg.includes('No commits between')) alert('⚠️ 没有差异，无法创建 PR');
      else if (msg.includes('already exists')) alert('⚠️ PR 已存在');
      else alert(`❌ 失败:\n${msg}`);
      ErrorHandler.handle(err, '创建 Fork PR');
    }
  }
};

return plugin;
