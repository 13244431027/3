// ==================== GitHub Issues Ultimate 插件 (修复版) ====================

plugin.id = "github-issues-ultimate";
plugin.name = "GitHub Issues Ultimate";
plugin.version = "2.0.1";
plugin.description = "完整 GitHub Issues 管理：搜索、排序、编辑、标签、里程碑、时间线、Reactions、模板、锁定、转移、通知等";
plugin.tags = ["issues", "github", "协作", "工单", "完整版"];

plugin.style = `
.giu-toolbar{display:flex;gap:6px;padding:8px;border-bottom:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);flex-wrap:wrap;align-items:center}
.giu-toolbar-row{display:flex;gap:6px;width:100%;flex-wrap:wrap;align-items:center}
.giu-input,.giu-select,.giu-textarea{background:rgba(0,0,0,0.35);border:1px solid #555;color:#fff;border-radius:6px;padding:6px 8px;font-size:12px;box-sizing:border-box;outline:none}
.giu-input:focus,.giu-select:focus,.giu-textarea:focus{border-color:rgba(100,170,255,0.7)}
.giu-textarea{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical}
.giu-list{padding:8px}
.giu-item{padding:10px;margin-bottom:8px;border-radius:8px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:background 0.15s}
.giu-item:hover{background:rgba(255,255,255,0.07)}
.giu-title{font-weight:700;line-height:1.4;word-break:break-word}
.giu-meta{font-size:11px;opacity:0.7;margin-top:5px}
.giu-badge{display:inline-block;font-size:10px;padding:2px 7px;border-radius:999px;margin-right:6px;vertical-align:middle}
.giu-open{background:rgba(40,167,69,0.25);border:1px solid rgba(40,167,69,0.55);color:#6fdc8c}
.giu-closed{background:rgba(160,80,255,0.25);border:1px solid rgba(160,80,255,0.55);color:#c9a0ff}
.giu-label{display:inline-block;font-size:10px;padding:2px 7px;border-radius:999px;margin:3px 4px 0 0;cursor:pointer}
.giu-card{padding:12px;margin-bottom:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1)}
.giu-comment{padding:10px;margin-bottom:8px;border-radius:8px;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);position:relative}
.giu-comment:hover .giu-comment-actions{opacity:1}
.giu-comment-actions{position:absolute;top:8px;right:8px;display:flex;gap:4px;opacity:0;transition:opacity 0.2s}
.giu-empty{padding:16px;text-align:center;opacity:0.65;border:1px dashed rgba(255,255,255,0.18);border-radius:10px;margin:10px}
.giu-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.giu-form{display:flex;flex-direction:column;gap:10px;padding:12px}
.giu-section{margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08)}
.giu-section-title{font-weight:700;margin-bottom:8px;font-size:13px}
.giu-timeline-item{padding:6px 10px;margin-bottom:4px;border-left:3px solid rgba(255,255,255,0.15);font-size:12px;opacity:0.85}
.giu-timeline-item b{color:#8af}
.giu-reactions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.giu-reaction{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:999px;font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);transition:background 0.15s}
.giu-reaction:hover{background:rgba(255,255,255,0.12)}
.giu-reaction.active{border-color:rgba(100,170,255,0.5);background:rgba(100,170,255,0.15)}
.giu-md-toolbar{display:flex;gap:4px;padding:4px;background:rgba(0,0,0,0.2);border-radius:6px 6px 0 0;border:1px solid #555;border-bottom:none}
.giu-md-toolbar button{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer}
.giu-md-toolbar button:hover{background:rgba(255,255,255,0.15)}
.giu-preview{background:rgba(0,0,0,0.25);border:1px solid #555;border-radius:0 0 6px 6px;padding:10px;min-height:60px;font-size:13px;overflow-y:auto;max-height:200px}
.giu-tag-list{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.giu-tag-rm{cursor:pointer;margin-left:4px;opacity:0.6}
.giu-tag-rm:hover{opacity:1}
.giu-pager{display:flex;align-items:center;gap:6px;font-size:12px}
.giu-pager span{opacity:0.85}
.giu-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:100010;display:flex;align-items:center;justify-content:center}
.giu-modal{background:#1a1a1a;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:16px;max-width:560px;width:90%;max-height:80vh;overflow-y:auto;color:#fff}
.giu-modal h3{margin:0 0 12px}
.giu-permission-badge{font-size:10px;padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.06);margin-left:8px}
`;

plugin.init = (ctx) => {
  const { core, api, ui, utils, components } = ctx;

  // ==================== 状态 ====================

  const state = {
    filter: "open",
    page: 1,
    perPage: 30,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    keyword: "",
    label: "",
    assignee: "",
    milestone: "",
    sort: "created",
    direction: "desc",
    searchMode: "filter",
    active: false,
    permission: null,
    labels: [],
    milestones: [],
    assignees: [],
    currentUser: null
  };

  // ==================== 工具函数 ====================

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  }

  function setStatus(msg, err = false) {
    if (ui.statusLabel) {
      ui.statusLabel.textContent = msg;
      ui.statusLabel.style.color = err ? "#ff8888" : "#fff";
    }
  }

  function repoReady() { return core.currentOwner && core.currentRepo; }
  function hasToken() { return !!core.token; }

  function needRepo() {
    if (!repoReady()) { setStatus("请先在「浏览」中进入仓库", true); return false; }
    return true;
  }

  function needToken() {
    if (!hasToken()) { alert("需要 GitHub Token"); return false; }
    return true;
  }

  function clearMain() { if (ui.mainArea) ui.mainArea.innerHTML = ""; }

  // ==================== 自定义请求（绕过缓存）====================

  function ghHeaders(extra = {}) {
    const h = { "Accept": "application/vnd.github+json", ...extra };
    if (core.token) h["Authorization"] = `token ${core.token}`;
    return h;
  }

  async function ghFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { ...ghHeaders(), "Content-Type": "application/json", ...(options.headers || {}) }
    });
    return res;
  }

  async function ghJson(url, options = {}) {
    const res = await ghFetch(url, options);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  function parseLinkHeader(header) {
    const links = { next: null, prev: null, last: null, first: null };
    if (!header) return links;
    header.split(",").forEach(part => {
      const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
      if (match) links[match[2]] = match[1];
    });
    return links;
  }

  async function ghFetchWithPagination(url) {
    const res = await ghFetch(url);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const links = parseLinkHeader(res.headers.get("Link"));
    let totalPages = state.page;
    if (links.last) {
      const m = links.last.match(/[?&]page=(\d+)/);
      if (m) totalPages = parseInt(m[1]);
    }
    return { data, links, totalPages };
  }

  // ==================== API 封装 ====================

  const issueApi = {
    async list() {
      const { currentOwner: o, currentRepo: r } = core;
      const params = new URLSearchParams();
      params.set("state", state.filter);
      params.set("per_page", String(state.perPage));
      params.set("page", String(state.page));
      params.set("sort", state.sort);
      params.set("direction", state.direction);
      if (state.label) params.set("labels", state.label);
      if (state.assignee) params.set("assignee", state.assignee);
      if (state.milestone) params.set("milestone", state.milestone);
      const url = `https://api.github.com/repos/${o}/${r}/issues?${params}`;
      const result = await ghFetchWithPagination(url);
      result.data = result.data.filter(i => !i.pull_request);
      state.totalPages = result.totalPages;
      state.hasNext = !!result.links.next;
      state.hasPrev = !!result.links.prev;
      return result.data;
    },

    async search(query) {
      const { currentOwner: o, currentRepo: r } = core;
      let q = `repo:${o}/${r} is:issue ${query}`;
      if (state.filter !== "all") q += ` is:${state.filter}`;
      const params = new URLSearchParams();
      params.set("q", q);
      params.set("per_page", String(state.perPage));
      params.set("page", String(state.page));
      if (state.sort === "comments") { params.set("sort", "comments"); }
      else if (state.sort === "updated") { params.set("sort", "updated"); }
      else { params.set("sort", "created"); }
      params.set("order", state.direction);
      const url = `https://api.github.com/search/issues?${params}`;
      const result = await ghFetchWithPagination(url);
      state.totalPages = result.totalPages;
      state.hasNext = !!result.links.next;
      state.hasPrev = !!result.links.prev;
      return result.data.items || result.data;
    },

    async get(n) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}`);
    },

    async comments(n) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/comments?per_page=100`);
    },

    async timeline(n) {
      const { currentOwner: o, currentRepo: r } = core;
      const res = await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/timeline?per_page=100`, {
        headers: { "Accept": "application/vnd.github.mockingbird-preview+json" }
      });
      if (!res.ok) return [];
      return res.json();
    },

    async create(data) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues`, {
        method: "POST", body: JSON.stringify(data)
      });
    },

    async update(n, data) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}`, {
        method: "PATCH", body: JSON.stringify(data)
      });
    },

    async addComment(n, body) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/comments`, {
        method: "POST", body: JSON.stringify({ body })
      });
    },

    async editComment(commentId, body) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/comments/${commentId}`, {
        method: "PATCH", body: JSON.stringify({ body })
      });
    },

    async deleteComment(commentId) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/comments/${commentId}`, { method: "DELETE" });
    },

    async lock(n, reason) {
      const { currentOwner: o, currentRepo: r } = core;
      const body = reason ? JSON.stringify({ lock_reason: reason }) : undefined;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/lock`, { method: "PUT", body });
    },

    async unlock(n) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/lock`, { method: "DELETE" });
    },

    async transfer(n, newOwner, newRepo) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/transfer`, {
        method: "POST",
        body: JSON.stringify({ new_owner: newOwner, new_repository: newRepo })
      });
    },

    async subscribe(n) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/subscription`, {
        method: "PUT", body: JSON.stringify({ subscribed: true })
      });
    },

    async unsubscribe(n) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/subscription`, { method: "DELETE" });
    },

    async getSubscription(n) {
      const { currentOwner: o, currentRepo: r } = core;
      try {
        return await ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/subscription`);
      } catch { return null; }
    },

    // ---- Labels ----
    async repoLabels() {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/labels?per_page=100`);
    },

    async createLabel(name, color, description) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/labels`, {
        method: "POST", body: JSON.stringify({ name, color: color.replace("#", ""), description })
      });
    },

    async updateLabel(oldName, name, color, description) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/labels/${encodeURIComponent(oldName)}`, {
        method: "PATCH", body: JSON.stringify({ new_name: name, color: color.replace("#", ""), description })
      });
    },

    async deleteLabel(name) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/labels/${encodeURIComponent(name)}`, { method: "DELETE" });
    },

    async addLabels(n, labels) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/labels`, {
        method: "POST", body: JSON.stringify({ labels })
      });
    },

    async removeLabel(n, label) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/labels/${encodeURIComponent(label)}`, { method: "DELETE" });
    },

    // ---- Assignees ----
    async repoAssignees() {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/assignees?per_page=100`);
    },

    async addAssignees(n, assignees) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/assignees`, {
        method: "POST", body: JSON.stringify({ assignees })
      });
    },

    async removeAssignees(n, assignees) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/${n}/assignees`, {
        method: "DELETE", body: JSON.stringify({ assignees })
      });
    },

    // ---- Milestones ----
    async repoMilestones() {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/milestones?per_page=100&state=all`);
    },

    // ---- Reactions ----
    async issueReactions(n) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/reactions?per_page=100`);
    },

    async commentReactions(commentId) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/comments/${commentId}/reactions?per_page=100`);
    },

    async addIssueReaction(n, content) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/${n}/reactions`, {
        method: "POST", body: JSON.stringify({ content })
      });
    },

    async addCommentReaction(commentId, content) {
      const { currentOwner: o, currentRepo: r } = core;
      return ghJson(`https://api.github.com/repos/${o}/${r}/issues/comments/${commentId}/reactions`, {
        method: "POST", body: JSON.stringify({ content })
      });
    },

    async deleteReaction(reactionId) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/reactions/${reactionId}`, { method: "DELETE" });
    },

    async deleteCommentReaction(commentId, reactionId) {
      const { currentOwner: o, currentRepo: r } = core;
      await ghFetch(`https://api.github.com/repos/${o}/${r}/issues/comments/${commentId}/reactions/${reactionId}`, { method: "DELETE" });
    },

    // ---- Permission ----
    async checkPermission() {
      const { currentOwner: o, currentRepo: r } = core;
      if (!core.token) { state.permission = "read"; return; }
      try {
        const user = await ghJson("https://api.github.com/user");
        state.currentUser = user.login;
        const perm = await ghJson(`https://api.github.com/repos/${o}/${r}/collaborators/${user.login}/permission`);
        state.permission = perm.permission || "read";
      } catch {
        state.permission = "read";
      }
    },

    // ---- Templates ----
    async getTemplates() {
      const { currentOwner: o, currentRepo: r } = core;
      const paths = [".github/ISSUE_TEMPLATE", "ISSUE_TEMPLATE", "docs/ISSUE_TEMPLATE"];
      for (const p of paths) {
        try {
          const items = await ghJson(`https://api.github.com/repos/${o}/${r}/contents/${p}`);
          if (Array.isArray(items)) {
            return items.filter(i => i.name.endsWith(".md") || i.name.endsWith(".yml") || i.name.endsWith(".yaml"));
          }
        } catch { continue; }
      }
      return [];
    },

    async getTemplateContent(path) {
      const { currentOwner: o, currentRepo: r } = core;
      const d = await ghJson(`https://api.github.com/repos/${o}/${r}/contents/${path}`);
      return atob(d.content.replace(/\n/g, ""));
    }
  };

  // ==================== Reactions 常量 ====================

  const REACTIONS_DEF = [
    { content: "+1", emoji: "👍" },
    { content: "-1", emoji: "👎" },
    { content: "laugh", emoji: "😄" },
    { content: "hooray", emoji: "🎉" },
    { content: "confused", emoji: "😕" },
    { content: "heart", emoji: "❤️" },
    { content: "rocket", emoji: "🚀" },
    { content: "eyes", emoji: "👀" }
  ];

  // ==================== UI 创建 ====================

  const tabBtn = components.createTabButton("🐛 Issues");
  ui.tabs.appendChild(tabBtn);

  const area = document.createElement("div");
  area.style.display = "none";

  // ---- 工具栏 ----
  const toolbar = document.createElement("div");
  toolbar.className = "giu-toolbar";

  // 第一行
  const row1 = document.createElement("div");
  row1.className = "giu-toolbar-row";

  const filterSel = document.createElement("select");
  filterSel.className = "giu-select";
  filterSel.innerHTML = '<option value="open">打开中</option><option value="closed">已关闭</option><option value="all">全部</option>';

  const sortSel = document.createElement("select");
  sortSel.className = "giu-select";
  sortSel.innerHTML = '<option value="created-desc">最新创建</option><option value="created-asc">最早创建</option><option value="updated-desc">最近更新</option><option value="updated-asc">最早更新</option><option value="comments-desc">评论最多</option><option value="comments-asc">评论最少</option>';

  const labelSel = document.createElement("select");
  labelSel.className = "giu-select";
  labelSel.innerHTML = '<option value="">所有标签</option>';

  const milestoneSel = document.createElement("select");
  milestoneSel.className = "giu-select";
  milestoneSel.innerHTML = '<option value="">所有里程碑</option>';

  const assigneeSel = document.createElement("select");
  assigneeSel.className = "giu-select";
  assigneeSel.innerHTML = '<option value="">所有指派人</option>';

  row1.appendChild(filterSel);
  row1.appendChild(sortSel);
  row1.appendChild(labelSel);
  row1.appendChild(milestoneSel);
  row1.appendChild(assigneeSel);

  // 第二行
  const row2 = document.createElement("div");
  row2.className = "giu-toolbar-row";

  const searchInput = document.createElement("input");
  searchInput.className = "giu-input";
  searchInput.placeholder = "搜索：标题、内容、作者、#编号... (回车搜索整个仓库)";
  searchInput.style.flex = "1";
  searchInput.style.minWidth = "200px";

  const searchBtn = makeBtn("搜索");
  const refreshBtn = makeBtn("刷新");
  const newBtn = makeBtn("+ 新建", { background: "#28a745" });
  const labelsBtn = makeBtn("🏷 管理标签");
  const perPageSel = document.createElement("select");
  perPageSel.className = "giu-select";
  perPageSel.innerHTML = '<option value="15">15/页</option><option value="30" selected>30/页</option><option value="50">50/页</option><option value="100">100/页</option>';

  const pager = document.createElement("div");
  pager.className = "giu-pager";
  const prevBtn = makeBtn("<");
  const nextBtn = makeBtn(">");
  const pageInfo = document.createElement("span");
  pageInfo.textContent = "P1";
  pager.appendChild(prevBtn);
  pager.appendChild(pageInfo);
  pager.appendChild(nextBtn);

  row2.appendChild(searchInput);
  row2.appendChild(searchBtn);
  row2.appendChild(refreshBtn);
  row2.appendChild(newBtn);
  row2.appendChild(labelsBtn);
  row2.appendChild(perPageSel);
  row2.appendChild(pager);

  toolbar.appendChild(row1);
  toolbar.appendChild(row2);
  area.appendChild(toolbar);

  ui._panelBody.insertBefore(area, ui.statusLabel);

  // ==================== 辅助 UI ====================

  function makeBtn(text, style = {}) {
    return components.createWindowButton(text, style);
  }

  function makeSBtn(text, style = {}) {
    const b = document.createElement("button");
    b.textContent = text;
    Object.assign(b.style, { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: "4px", padding: "2px 7px", fontSize: "11px", cursor: "pointer", ...style });
    return b;
  }

  function showModal(title, contentFn) {
    const overlay = document.createElement("div");
    overlay.className = "giu-overlay";
    const modal = document.createElement("div");
    modal.className = "giu-modal";
    const h = document.createElement("h3");
    h.textContent = title;
    const closeBtn = makeSBtn("✕ 关闭", { position: "absolute", top: "12px", right: "12px" });
    modal.style.position = "relative";
    closeBtn.onclick = () => document.body.removeChild(overlay);
    modal.appendChild(closeBtn);
    modal.appendChild(h);
    contentFn(modal, () => document.body.removeChild(overlay));
    overlay.appendChild(modal);
    overlay.addEventListener("mousedown", e => { if (e.target === overlay) document.body.removeChild(overlay); });
    document.body.appendChild(overlay);
    return overlay;
  }

  function createMdEditor(placeholder, height = "120px") {
    const wrap = document.createElement("div");

    const toolbar = document.createElement("div");
    toolbar.className = "giu-md-toolbar";

    const tools = [
      { label: "B", pre: "**", suf: "**" },
      { label: "I", pre: "_", suf: "_" },
      { label: "~~", pre: "~~", suf: "~~" },
      { label: "`", pre: "`", suf: "`" },
      { label: "```", pre: "\n```\n", suf: "\n```\n" },
      { label: "Link", pre: "[", suf: "](url)" },
      { label: "Img", pre: "![alt](", suf: ")" },
      { label: "H2", pre: "## ", suf: "" },
      { label: "H3", pre: "### ", suf: "" },
      { label: "List", pre: "\n- ", suf: "" },
      { label: "Task", pre: "\n- [ ] ", suf: "" },
      { label: "> ", pre: "\n> ", suf: "" }
    ];

    const textarea = document.createElement("textarea");
    textarea.className = "giu-textarea";
    textarea.placeholder = placeholder || "";
    textarea.style.width = "100%";
    textarea.style.height = height;
    textarea.style.borderRadius = "0 0 6px 6px";

    tools.forEach(t => {
      const btn = document.createElement("button");
      btn.textContent = t.label;
      btn.onclick = (e) => {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const sel = textarea.value.substring(start, end);
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        textarea.value = before + t.pre + sel + t.suf + after;
        textarea.focus();
        textarea.selectionStart = start + t.pre.length;
        textarea.selectionEnd = start + t.pre.length + sel.length;
      };
      toolbar.appendChild(btn);
    });

    // 预览按钮
    const previewBtn = document.createElement("button");
    previewBtn.textContent = "👁 预览";
    previewBtn.style.marginLeft = "auto";
    let previewing = false;
    const previewDiv = document.createElement("div");
    previewDiv.className = "giu-preview";
    previewDiv.style.display = "none";

    previewBtn.onclick = (e) => {
      e.preventDefault();
      previewing = !previewing;
      if (previewing) {
        previewDiv.style.display = "block";
        textarea.style.display = "none";
        previewDiv.innerHTML = utils.parseMarkdown(textarea.value || "_无内容_", core.currentOwner, core.currentRepo, core.currentBranch);
        previewBtn.textContent = "✏️ 编辑";
      } else {
        previewDiv.style.display = "none";
        textarea.style.display = "block";
        previewBtn.textContent = "👁 预览";
      }
    };
    toolbar.appendChild(previewBtn);

    wrap.appendChild(toolbar);
    wrap.appendChild(textarea);
    wrap.appendChild(previewDiv);

    return { wrap, textarea, previewDiv };
  }

  function renderReactions(reactions, targetType, targetId, issueNumber, container) {
    container.innerHTML = "";
    container.className = "giu-reactions";

    const grouped = {};
    REACTIONS_DEF.forEach(r => { grouped[r.content] = { emoji: r.emoji, count: 0, users: [], myReactionId: null }; });

    (reactions || []).forEach(r => {
      if (grouped[r.content]) {
        grouped[r.content].count++;
        grouped[r.content].users.push(r.user?.login || "?");
        if (state.currentUser && r.user?.login === state.currentUser) {
          grouped[r.content].myReactionId = r.id;
        }
      }
    });

    REACTIONS_DEF.forEach(r => {
      const g = grouped[r.content];
      if (g.count === 0) return; // 只显示有数量的
      const btn = document.createElement("span");
      btn.className = "giu-reaction" + (g.myReactionId ? " active" : "");
      btn.innerHTML = `${r.emoji} <span style="font-size:11px;opacity:0.85">${g.count}</span>`;
      btn.title = g.users.length ? g.users.join(", ") : "点击添加";
      btn.onclick = async () => {
        if (!hasToken()) return alert("需要 Token");
        try {
          if (g.myReactionId) {
            if (targetType === "issue") {
              await issueApi.deleteReaction(g.myReactionId);
            } else {
              await issueApi.deleteCommentReaction(targetId, g.myReactionId);
            }
          } else {
            if (targetType === "issue") {
              await issueApi.addIssueReaction(issueNumber, r.content);
            } else {
              await issueApi.addCommentReaction(targetId, r.content);
            }
          }
          const fresh = targetType === "issue"
            ? await issueApi.issueReactions(issueNumber)
            : await issueApi.commentReactions(targetId);
          renderReactions(fresh, targetType, targetId, issueNumber, container);
        } catch (e) { console.warn("Reaction error:", e); }
      };
      container.appendChild(btn);
    });

    // 添加按钮（+）
    if (hasToken()) {
      const addBtn = document.createElement("span");
      addBtn.className = "giu-reaction";
      addBtn.textContent = "+";
      addBtn.title = "添加表情";
      addBtn.onclick = (e) => {
        e.stopPropagation();
        showReactionPicker(targetType, targetId, issueNumber, container);
      };
      container.appendChild(addBtn);
    }
  }
  function showReactionPicker(targetType, targetId, issueNumber, reactionsContainer) {
    const picker = document.createElement("div");
    picker.style.cssText = "position:absolute;background:#222;border:1px solid #555;border-radius:8px;padding:6px;display:flex;gap:4px;z-index:100020;box-shadow:0 4px 12px rgba(0,0,0,0.5)";

    REACTIONS_DEF.forEach(r => {
      const btn = document.createElement("span");
      btn.style.cssText = "cursor:pointer;font-size:16px;padding:2px 4px;border-radius:4px";
      btn.textContent = r.emoji;
      btn.onmouseenter = () => btn.style.background = "rgba(255,255,255,0.1)";
      btn.onmouseleave = () => btn.style.background = "";
      btn.onclick = async (e) => {
        e.stopPropagation();
        picker.remove();
        try {
          if (targetType === "issue") {
            await issueApi.addIssueReaction(issueNumber, r.content);
          } else {
            await issueApi.addCommentReaction(targetId, r.content);
          }
          const fresh = targetType === "issue"
            ? await issueApi.issueReactions(issueNumber)
            : await issueApi.commentReactions(targetId);
          renderReactions(fresh, targetType, targetId, issueNumber, reactionsContainer);
        } catch (err) { console.warn(err); }
      };
      picker.appendChild(btn);
    });

    reactionsContainer.style.position = "relative";
    reactionsContainer.appendChild(picker);

    const closeHandler = (e) => {
      if (!picker.contains(e.target)) {
        picker.remove();
        document.removeEventListener("mousedown", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", closeHandler), 10);
  }

  // ==================== 加载元数据 ====================

  async function loadMeta() {
    if (!repoReady()) return;
    try {
      const [labels, milestones, assignees] = await Promise.all([
        issueApi.repoLabels().catch(() => []),
        issueApi.repoMilestones().catch(() => []),
        issueApi.repoAssignees().catch(() => [])
      ]);
      state.labels = labels || [];
      state.milestones = milestones || [];
      state.assignees = assignees || [];

      labelSel.innerHTML = '<option value="">所有标签</option>';
      state.labels.forEach(l => {
        const op = document.createElement("option");
        op.value = l.name;
        op.textContent = l.name;
        labelSel.appendChild(op);
      });

      milestoneSel.innerHTML = '<option value="">所有里程碑</option>';
      state.milestones.forEach(m => {
        const op = document.createElement("option");
        op.value = String(m.number);
        op.textContent = `${m.title} (${m.open_issues}/${m.open_issues + m.closed_issues})`;
        milestoneSel.appendChild(op);
      });

      assigneeSel.innerHTML = '<option value="">所有指派人</option>';
      state.assignees.forEach(a => {
        const op = document.createElement("option");
        op.value = a.login;
        op.textContent = a.login;
        assigneeSel.appendChild(op);
      });

      await issueApi.checkPermission();
    } catch (e) {
      console.warn("loadMeta error:", e);
    }
  }

  // ==================== 列表页 ====================

  async function loadList() {
    if (!needRepo()) return;

    const sortVal = sortSel.value.split("-");
    state.sort = sortVal[0];
    state.direction = sortVal[1];
    state.filter = filterSel.value;
    state.label = labelSel.value;
    state.milestone = milestoneSel.value;
    state.assignee = assigneeSel.value;
    state.perPage = parseInt(perPageSel.value);
    state.keyword = searchInput.value.trim();

    pageInfo.textContent = `P${state.page}`;
    clearMain();
    setStatus("加载中...");

    try {
      let items;
      if (state.keyword) {
        items = await issueApi.search(state.keyword);
      } else {
        items = await issueApi.list();
      }

      clearMain();

      if (!items || items.length === 0) {
        ui.mainArea.innerHTML = '<div class="giu-empty">没有匹配的 Issues</div>';
        setStatus("无结果");
        pageInfo.textContent = `P${state.page}`;
        return;
      }

      const list = document.createElement("div");
      list.className = "giu-list";

      items.forEach(issue => {
        const row = document.createElement("div");
        row.className = "giu-item";

        const badgeCls = issue.state === "open" ? "giu-open" : "giu-closed";
        const badgeText = issue.state === "open" ? "OPEN" : "CLOSED";

        const labelsHtml = (issue.labels || []).map(l => {
          const c = l.color || "666";
          return `<span class="giu-label" style="background:#${c}33;border:1px solid #${c}88;color:#${c}">${esc(l.name)}</span>`;
        }).join("");

        const milestoneHtml = issue.milestone ? `<span style="font-size:10px;opacity:0.7;margin-left:6px">📌 ${esc(issue.milestone.title)}</span>` : "";
        const lockedHtml = issue.locked ? '<span style="font-size:10px;color:#ffd700;margin-left:6px">🔒</span>' : "";
        const assigneesHtml = (issue.assignees || []).map(a => `<span style="font-size:10px;opacity:0.7">@${esc(a.login)}</span>`).join(" ");

        row.innerHTML = `
          <div class="giu-title">
            <span class="giu-badge ${badgeCls}">${badgeText}</span>
            #${issue.number} ${esc(issue.title)}${lockedHtml}${milestoneHtml}
          </div>
          <div class="giu-meta">
            ${esc(issue.user?.login || "")} · ${(issue.created_at || "").split("T")[0]} · 💬 ${issue.comments || 0}
            ${assigneesHtml ? " · " + assigneesHtml : ""}
          </div>
          <div>${labelsHtml}</div>
        `;

        row.onclick = () => showDetail(issue.number);
        list.appendChild(row);
      });

      ui.mainArea.appendChild(list);
      pageInfo.textContent = `P${state.page}/${state.totalPages || "?"}`;
      setStatus(`${items.length} 条 Issues (P${state.page})`);
    } catch (e) {
      ui.mainArea.innerHTML = `<div class="giu-empty">加载失败：${esc(e.message)}</div>`;
      setStatus("加载失败: " + e.message, true);
    }
  }

  // ==================== 详情页 ====================

  async function showDetail(number) {
    if (!needRepo()) return;
    clearMain();
    setStatus(`加载 Issue #${number}...`);

    try {
      const [issue, comments, timelineData, sub] = await Promise.all([
        issueApi.get(number),
        issueApi.comments(number),
        issueApi.timeline(number).catch(() => []),
        hasToken() ? issueApi.getSubscription(number) : null
      ]);

      const wrap = document.createElement("div");
      wrap.style.padding = "10px";

      // ==== 顶部操作栏 ====
      const topRow = document.createElement("div");
      topRow.className = "giu-row";
      topRow.style.marginBottom = "10px";

      const backBtn = makeBtn("← 返回");
      backBtn.onclick = () => loadList();

      const webBtn = makeBtn("GitHub 打开");
      webBtn.onclick = () => window.open(issue.html_url, "_blank");

      const copyBtn = makeBtn("复制链接");
      copyBtn.onclick = () => { utils.copyToClipboard(issue.html_url); setStatus("已复制"); };

      const permBadge = document.createElement("span");
      permBadge.className = "giu-permission-badge";
      permBadge.textContent = `权限: ${state.permission || "read"}`;

      topRow.appendChild(backBtn);
      topRow.appendChild(webBtn);
      topRow.appendChild(copyBtn);
      topRow.appendChild(permBadge);
      wrap.appendChild(topRow);

      // ==== 标题区 ====
      const titleCard = document.createElement("div");
      titleCard.className = "giu-card";

      const badgeCls = issue.state === "open" ? "giu-open" : "giu-closed";
      const badgeText = issue.state === "open" ? "OPEN" : "CLOSED";
      const lockedHtml = issue.locked ? '<span style="color:#ffd700;margin-left:8px">🔒 已锁定</span>' : "";

      titleCard.innerHTML = `
        <div class="giu-row" style="align-items:flex-start">
          <div style="flex:1">
            <h3 style="margin:0 0 6px"><span class="giu-badge ${badgeCls}">${badgeText}</span> #${issue.number} ${esc(issue.title)}${lockedHtml}</h3>
            <div class="giu-meta">${esc(issue.user?.login)} · 创建 ${(issue.created_at || "").split("T")[0]} · 更新 ${(issue.updated_at || "").split("T")[0]}</div>
          </div>
        </div>
      `;

      if (hasToken() && canEdit(issue)) {
        const editTitleBtn = makeSBtn("✏️ 编辑标题");
        editTitleBtn.onclick = () => editTitle(issue, () => showDetail(number));
        titleCard.querySelector(".giu-row").appendChild(editTitleBtn);
      }

      wrap.appendChild(titleCard);

      // ==== 侧边信息（标签、负责人、里程碑）====
      const sideCard = document.createElement("div");
      sideCard.className = "giu-card";
      sideCard.style.display = "flex";
      sideCard.style.gap = "16px";
      sideCard.style.flexWrap = "wrap";

      // 标签
      const labelsSection = document.createElement("div");
      labelsSection.innerHTML = `<div style="font-size:11px;opacity:0.6;margin-bottom:4px">标签</div>`;
      const labelsWrap = document.createElement("div");
      labelsWrap.className = "giu-tag-list";
      (issue.labels || []).forEach(l => {
        const span = document.createElement("span");
        span.className = "giu-label";
        span.style.background = `#${l.color || "666"}33`;
        span.style.borderColor = `#${l.color || "666"}88`;
        span.innerHTML = esc(l.name);
        if (hasToken() && canEdit(issue)) {
          const rm = document.createElement("span");
          rm.className = "giu-tag-rm";
          rm.textContent = "✕";
          rm.onclick = async (e) => {
            e.stopPropagation();
            try { await issueApi.removeLabel(number, l.name); showDetail(number); } catch (err) { alert("移除标签失败: " + err.message); }
          };
          span.appendChild(rm);
        }
        labelsWrap.appendChild(span);
      });
      if (hasToken() && canEdit(issue)) {
        const addLabelBtn = makeSBtn("+ 标签", { background: "rgba(40,167,69,0.2)" });
        addLabelBtn.onclick = () => showAddLabelModal(number);
        labelsWrap.appendChild(addLabelBtn);
      }
      labelsSection.appendChild(labelsWrap);
      sideCard.appendChild(labelsSection);

      // 负责人
      const assigneesSection = document.createElement("div");
      assigneesSection.innerHTML = `<div style="font-size:11px;opacity:0.6;margin-bottom:4px">负责人</div>`;
      const assigneesWrap = document.createElement("div");
      assigneesWrap.className = "giu-tag-list";
      (issue.assignees || []).forEach(a => {
        const span = document.createElement("span");
        span.className = "giu-label";
        span.style.background = "rgba(100,170,255,0.15)";
        span.style.borderColor = "rgba(100,170,255,0.3)";
        span.textContent = "@" + a.login;
        if (hasToken() && canEdit(issue)) {
          const rm = document.createElement("span");
          rm.className = "giu-tag-rm";
          rm.textContent = "✕";
          rm.onclick = async (e) => {
            e.stopPropagation();
            try { await issueApi.removeAssignees(number, [a.login]); showDetail(number); } catch (err) { alert("移除负责人失败: " + err.message); }
          };
          span.appendChild(rm);
        }
        assigneesWrap.appendChild(span);
      });
      if (hasToken() && canEdit(issue)) {
        const addAssigneeBtn = makeSBtn("+ 负责人", { background: "rgba(100,170,255,0.2)" });
        addAssigneeBtn.onclick = () => showAddAssigneeModal(number);
        assigneesWrap.appendChild(addAssigneeBtn);
      }
      assigneesSection.appendChild(assigneesWrap);
      sideCard.appendChild(assigneesSection);

      // 里程碑
      const milestoneSection = document.createElement("div");
      milestoneSection.innerHTML = `<div style="font-size:11px;opacity:0.6;margin-bottom:4px">里程碑</div>`;
      if (issue.milestone) {
        const mInfo = document.createElement("div");
        mInfo.style.fontSize = "12px";
        const total = issue.milestone.open_issues + issue.milestone.closed_issues;
        const progress = total > 0 ? (issue.milestone.closed_issues / total) * 100 : 0;
        mInfo.innerHTML = `📌 ${esc(issue.milestone.title)}<div style="width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,0.1);margin-top:4px"><div style="width:${progress}%;height:100%;background:#28a745;border-radius:3px"></div></div><span style="font-size:10px;opacity:0.6">${Math.round(progress)}%</span>`;
        milestoneSection.appendChild(mInfo);
      } else {
        milestoneSection.innerHTML += `<span style="font-size:12px;opacity:0.6">无</span>`;
      }
      if (hasToken() && canEdit(issue)) {
        const setMilestoneBtn = makeSBtn("设置里程碑");
        setMilestoneBtn.onclick = () => showSetMilestoneModal(number, issue.milestone);
        milestoneSection.appendChild(setMilestoneBtn);
      }
      sideCard.appendChild(milestoneSection);

      wrap.appendChild(sideCard);

      // ==== 正文 ====
      const bodyCard = document.createElement("div");
      bodyCard.className = "giu-card";

      const bodyContent = document.createElement("div");
      bodyContent.innerHTML = utils.parseMarkdown(issue.body || "_无描述_", core.currentOwner, core.currentRepo, core.currentBranch || "main");
      bodyCard.appendChild(bodyContent);

      // 编辑正文按钮
      if (hasToken() && canEdit(issue)) {
        const editBodyBtn = makeSBtn("✏️ 编辑正文", { marginTop: "8px" });
        editBodyBtn.onclick = () => editBody(issue, () => showDetail(number));
        bodyCard.appendChild(editBodyBtn);
      }

      // 正文 Reactions
      const bodyReactionsDiv = document.createElement("div");
      bodyCard.appendChild(bodyReactionsDiv);
      issueApi.issueReactions(number).then(reactions => {
        renderReactions(reactions, "issue", number, number, bodyReactionsDiv);
      }).catch(() => {});

      wrap.appendChild(bodyCard);

      // ==== 时间线 ====
      if (timelineData && timelineData.length > 0) {
        const timelineSection = document.createElement("div");
        timelineSection.className = "giu-section";
        timelineSection.innerHTML = '<div class="giu-section-title">时间线</div>';
        const relevantEvents = timelineData.filter(e =>
          ["labeled", "unlabeled", "assigned", "unassigned", "milestoned", "demilestoned",
           "renamed", "locked", "unlocked", "closed", "reopened", "referenced",
           "cross-referenced", "connected", "disconnected"].includes(e.event)
        );
        if (relevantEvents.length > 0) {
          relevantEvents.slice(0, 50).forEach(ev => {
            const item = document.createElement("div");
            item.className = "giu-timeline-item";
            item.innerHTML = renderTimelineEvent(ev);
            timelineSection.appendChild(item);
          });
          wrap.appendChild(timelineSection);
        }
      }

      // ==== 评论 ====
      const commentSection = document.createElement("div");
      commentSection.className = "giu-section";
      commentSection.innerHTML = `<div class="giu-section-title">评论 (${comments.length})</div>`;

      for (const c of comments) {
        const box = document.createElement("div");
        box.className = "giu-comment";

        const header = document.createElement("div");
        header.className = "giu-meta";
        header.style.marginBottom = "6px";
        header.textContent = `${c.user?.login || "?"} · ${(c.created_at || "").split("T")[0]}`;
        if (c.updated_at !== c.created_at) {
          header.textContent += " (已编辑)";
        }
        box.appendChild(header);

        const bodyDiv = document.createElement("div");
        bodyDiv.innerHTML = utils.parseMarkdown(c.body || "", core.currentOwner, core.currentRepo, core.currentBranch || "main");
        box.appendChild(bodyDiv);

        // 评论 Reactions
        const cReactionsDiv = document.createElement("div");
        box.appendChild(cReactionsDiv);
        issueApi.commentReactions(c.id).then(reactions => {
          renderReactions(reactions, "comment", c.id, number, cReactionsDiv);
        }).catch(() => {});

        // 评论操作按钮
        if (hasToken()) {
          const actionsDiv = document.createElement("div");
          actionsDiv.className = "giu-comment-actions";

          if (state.currentUser && (c.user?.login === state.currentUser || state.permission === "admin" || state.permission === "write")) {
            const editBtn = makeSBtn("编辑");
            editBtn.onclick = (e) => {
              e.stopPropagation();
              editComment(c, () => showDetail(number));
            };
            actionsDiv.appendChild(editBtn);

            const delBtn = makeSBtn("删除", { background: "rgba(255,80,80,0.2)" });
            delBtn.onclick = async (e) => {
              e.stopPropagation();
              if (!confirm("确定删除这条评论？")) return;
              try { await issueApi.deleteComment(c.id); showDetail(number); } catch (err) { alert("删除失败: " + err.message); }
            };
            actionsDiv.appendChild(delBtn);
          }

          box.appendChild(actionsDiv);
        }

        commentSection.appendChild(box);
      }

      wrap.appendChild(commentSection);

      // ==== 新增评论 ====
      if (hasToken() && !issue.locked) {
        const newCommentSection = document.createElement("div");
        newCommentSection.className = "giu-section";
        newCommentSection.innerHTML = '<div class="giu-section-title">发表评论</div>';

        const editor = createMdEditor("写下你的评论 (支持 Markdown)", "100px");
        newCommentSection.appendChild(editor.wrap);

        const commentBtnRow = document.createElement("div");
        commentBtnRow.className = "giu-row";
        commentBtnRow.style.marginTop = "8px";

        const submitCommentBtn = makeBtn("发表评论", { background: "#28a745" });
        submitCommentBtn.onclick = async () => {
          const body = editor.textarea.value.trim();
          if (!body) return alert("评论不能为空");
          submitCommentBtn.disabled = true;
          try {
            await issueApi.addComment(number, body);
            showDetail(number);
          } catch (e) { alert("评论失败: " + e.message); submitCommentBtn.disabled = false; }
        };
        commentBtnRow.appendChild(submitCommentBtn);
        newCommentSection.appendChild(commentBtnRow);
        wrap.appendChild(newCommentSection);
      } else if (issue.locked) {
        const lockedTip = document.createElement("div");
        lockedTip.className = "giu-empty";
        lockedTip.textContent = "🔒 此 Issue 已锁定，无法评论";
        wrap.appendChild(lockedTip);
      }

      // ==== 底部操作 ====
      if (hasToken()) {
        const actionSection = document.createElement("div");
        actionSection.className = "giu-section";
        actionSection.innerHTML = '<div class="giu-section-title">操作</div>';
        const actionRow = document.createElement("div");
        actionRow.className = "giu-row";

        // 关闭/重开
        const toggleBtn = makeBtn(
          issue.state === "open" ? "关闭 Issue" : "重新打开",
          { background: issue.state === "open" ? "rgba(160,80,255,0.3)" : "rgba(40,167,69,0.3)" }
        );
        toggleBtn.onclick = async () => {
          const next = issue.state === "open" ? "closed" : "open";
          if (!confirm(`确定要${next === "closed" ? "关闭" : "重新打开"} #${number}?`)) return;
          try { await issueApi.update(number, { state: next }); showDetail(number); } catch (e) { alert("操作失败: " + e.message); }
        };
        actionRow.appendChild(toggleBtn);

        // 锁定/解锁
        if (state.permission === "admin" || state.permission === "maintain" || state.permission === "write") {
          if (issue.locked) {
            const unlockBtn = makeBtn("🔓 解锁");
            unlockBtn.onclick = async () => {
              try { await issueApi.unlock(number); showDetail(number); } catch (e) { alert(e.message); }
            };
            actionRow.appendChild(unlockBtn);
          } else {
            const lockBtn = makeBtn("🔒 锁定");
            lockBtn.onclick = () => showLockModal(number);
            actionRow.appendChild(lockBtn);
          }
        }

        // 订阅/取消订阅
        const subBtn = makeBtn(sub?.subscribed ? "🔕 取消订阅" : "🔔 订阅");
        subBtn.onclick = async () => {
          try {
            if (sub?.subscribed) { await issueApi.unsubscribe(number); }
            else { await issueApi.subscribe(number); }
            showDetail(number);
          } catch (e) { alert(e.message); }
        };
        actionRow.appendChild(subBtn);

        // 转移
        if (state.permission === "admin" || state.permission === "write") {
          const transferBtn = makeBtn("📦 转移", { background: "rgba(255,165,0,0.2)" });
          transferBtn.onclick = () => showTransferModal(number);
          actionRow.appendChild(transferBtn);
        }

        actionSection.appendChild(actionRow);
        wrap.appendChild(actionSection);
      }

      ui.mainArea.appendChild(wrap);
      setStatus(`Issue #${number}`);
    } catch (e) {
      ui.mainArea.innerHTML = `<div class="giu-empty">加载失败：${esc(e.message)}</div>`;
      setStatus("加载失败: " + e.message, true);
    }
  }

  // ==================== 时间线渲染 ====================

  function renderTimelineEvent(ev) {
    const actor = ev.actor?.login || ev.user?.login || "?";
    switch (ev.event) {
      case "labeled": return `<b>${esc(actor)}</b> 添加了标签 <span class="giu-label" style="background:rgba(255,255,255,0.1)">${esc(ev.label?.name)}</span>`;
      case "unlabeled": return `<b>${esc(actor)}</b> 移除了标签 <span class="giu-label" style="background:rgba(255,255,255,0.1)">${esc(ev.label?.name)}</span>`;
      case "assigned": return `<b>${esc(actor)}</b> 指派了 <b>${esc(ev.assignee?.login)}</b>`;
      case "unassigned": return `<b>${esc(actor)}</b> 取消指派 <b>${esc(ev.assignee?.login)}</b>`;
      case "milestoned": return `<b>${esc(actor)}</b> 设置里程碑 📌 ${esc(ev.milestone?.title)}`;
      case "demilestoned": return `<b>${esc(actor)}</b> 移除了里程碑 📌 ${esc(ev.milestone?.title)}`;
      case "renamed": return `<b>${esc(actor)}</b> 修改标题：「${esc(ev.rename?.from)}」→「${esc(ev.rename?.to)}」`;
      case "locked": return `<b>${esc(actor)}</b> 🔒 锁定了讨论${ev.lock_reason ? ` (${esc(ev.lock_reason)})` : ""}`;
      case "unlocked": return `<b>${esc(actor)}</b> 🔓 解锁了讨论`;
      case "closed": return `<b>${esc(actor)}</b> 关闭了 Issue`;
      case "reopened": return `<b>${esc(actor)}</b> 重新打开了 Issue`;
      case "referenced": return `<b>${esc(actor)}</b> 在提交 <code>${(ev.commit_id || "").slice(0, 7)}</code> 中引用了此 Issue`;
      case "cross-referenced": {
        const src = ev.source?.issue;
        if (src) return `<b>${esc(actor)}</b> 从 ${src.pull_request ? "PR" : "Issue"} <a href="${src.html_url}" target="_blank" style="color:#8af">#${src.number}</a> 中引用了此 Issue`;
        return `<b>${esc(actor)}</b> 交叉引用`;
      }
      case "connected": return `<b>${esc(actor)}</b> 关联了 Pull Request`;
      case "disconnected": return `<b>${esc(actor)}</b> 取消了 PR 关联`;
      default: return `<b>${esc(actor)}</b> ${esc(ev.event)}`;
    }
  }

  // ==================== 权限判断 ====================

  function canEdit(issue) {
    if (state.permission === "admin" || state.permission === "write" || state.permission === "maintain") return true;
    if (state.currentUser && issue.user?.login === state.currentUser) return true;
    return false;
  }

  // ==================== 编辑标题 ====================

  function editTitle(issue, callback) {
    showModal("编辑标题", (modal, close) => {
      const inp = document.createElement("input");
      inp.className = "giu-input";
      inp.style.width = "100%";
      inp.value = issue.title;
      inp.style.marginBottom = "12px";
      modal.appendChild(inp);

      const saveBtn = makeBtn("保存", { background: "#28a745" });
      saveBtn.onclick = async () => {
        if (!inp.value.trim()) return alert("标题不能为空");
        saveBtn.disabled = true;
        try {
          await issueApi.update(issue.number, { title: inp.value.trim() });
          close();
          callback();
        } catch (e) { alert("保存失败: " + e.message); saveBtn.disabled = false; }
      };
      modal.appendChild(saveBtn);
    });
  }

  // ==================== 编辑正文 ====================

  function editBody(issue, callback) {
    showModal("编辑正文", (modal, close) => {
      const editor = createMdEditor("编辑 Issue 正文", "200px");
      editor.textarea.value = issue.body || "";
      modal.appendChild(editor.wrap);

      const saveBtn = makeBtn("保存", { background: "#28a745", marginTop: "10px" });
      saveBtn.onclick = async () => {
        saveBtn.disabled = true;
        try {
          await issueApi.update(issue.number, { body: editor.textarea.value });
          close();
          callback();
        } catch (e) { alert("保存失败: " + e.message); saveBtn.disabled = false; }
      };
      modal.appendChild(saveBtn);
    });
  }

  // ==================== 编辑评论 ====================

  function editComment(comment, callback) {
    showModal("编辑评论", (modal, close) => {
      const editor = createMdEditor("编辑评论内容", "150px");
      editor.textarea.value = comment.body || "";
      modal.appendChild(editor.wrap);

      const saveBtn = makeBtn("保存", { background: "#28a745", marginTop: "10px" });
      saveBtn.onclick = async () => {
        if (!editor.textarea.value.trim()) return alert("评论不能为空");
        saveBtn.disabled = true;
        try {
          await issueApi.editComment(comment.id, editor.textarea.value);
          close();
          callback();
        } catch (e) { alert("保存失败: " + e.message); saveBtn.disabled = false; }
      };
      modal.appendChild(saveBtn);
    });
  }

  // ==================== 添加标签 Modal ====================

  function showAddLabelModal(number) {
    showModal("添加标签", (modal, close) => {
      const tip = document.createElement("div");
      tip.style.cssText = "font-size:12px;opacity:0.7;margin-bottom:8px";
      tip.textContent = "点击标签以添加到 Issue：";
      modal.appendChild(tip);

      const listDiv = document.createElement("div");
      listDiv.className = "giu-tag-list";
      listDiv.style.maxHeight = "300px";
      listDiv.style.overflowY = "auto";

      state.labels.forEach(l => {
        const span = document.createElement("span");
        span.className = "giu-label";
        span.style.background = `#${l.color || "666"}33`;
        span.style.borderColor = `#${l.color || "666"}88`;
        span.style.cursor = "pointer";
        span.textContent = l.name;
        span.onclick = async () => {
          span.style.opacity = "0.5";
          try {
            await issueApi.addLabels(number, [l.name]);
            close();
            showDetail(number);
          } catch (e) { alert("添加标签失败: " + e.message); span.style.opacity = "1"; }
        };
        listDiv.appendChild(span);
      });

      if (state.labels.length === 0) {
        listDiv.innerHTML = '<div class="giu-empty">没有可用的标签</div>';
      }

      modal.appendChild(listDiv);
    });
  }

  // ==================== 添加负责人 Modal ====================

  function showAddAssigneeModal(number) {
    showModal("添加负责人", (modal, close) => {
      const tip = document.createElement("div");
      tip.style.cssText = "font-size:12px;opacity:0.7;margin-bottom:8px";
      tip.textContent = "点击用户以指派：";
      modal.appendChild(tip);

      const listDiv = document.createElement("div");
      listDiv.style.maxHeight = "300px";
      listDiv.style.overflowY = "auto";

      state.assignees.forEach(a => {
        const row = document.createElement("div");
        row.style.cssText = "padding:6px 8px;cursor:pointer;border-radius:6px;margin-bottom:4px;display:flex;align-items:center;gap:8px";
        row.innerHTML = `<img src="${a.avatar_url}" style="width:24px;height:24px;border-radius:50%"><span>@${esc(a.login)}</span>`;
        row.onmouseenter = () => row.style.background = "rgba(255,255,255,0.08)";
        row.onmouseleave = () => row.style.background = "";
        row.onclick = async () => {
          row.style.opacity = "0.5";
          try {
            await issueApi.addAssignees(number, [a.login]);
            close();
            showDetail(number);
          } catch (e) { alert("指派失败: " + e.message); row.style.opacity = "1"; }
        };
        listDiv.appendChild(row);
      });

      if (state.assignees.length === 0) {
        listDiv.innerHTML = '<div class="giu-empty">没有可指派的用户</div>';
      }

      modal.appendChild(listDiv);
    });
  }

  // ==================== 设置里程碑 Modal ====================

  function showSetMilestoneModal(number, currentMilestone) {
    showModal("设置里程碑", (modal, close) => {
      const tip = document.createElement("div");
      tip.style.cssText = "font-size:12px;opacity:0.7;margin-bottom:8px";
      tip.textContent = "选择里程碑：";
      modal.appendChild(tip);

      if (currentMilestone) {
        const clearBtn = makeBtn("❌ 清除里程碑", { background: "rgba(255,80,80,0.2)", marginBottom: "10px" });
        clearBtn.onclick = async () => {
          try {
            await issueApi.update(number, { milestone: null });
            close();
            showDetail(number);
          } catch (e) { alert(e.message); }
        };
        modal.appendChild(clearBtn);
      }

      const listDiv = document.createElement("div");
      listDiv.style.maxHeight = "300px";
      listDiv.style.overflowY = "auto";

      state.milestones.forEach(m => {
        const total = m.open_issues + m.closed_issues;
        const progress = total > 0 ? (m.closed_issues / total) * 100 : 0;
        const row = document.createElement("div");
        row.style.cssText = "padding:8px;cursor:pointer;border-radius:6px;margin-bottom:6px;border:1px solid rgba(255,255,255,0.1)";
        row.innerHTML = `
          <div style="font-weight:700">${esc(m.title)}</div>
          <div style="font-size:11px;opacity:0.7">${m.open_issues} open · ${m.closed_issues} closed</div>
          <div style="width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,0.1);margin-top:4px"><div style="width:${progress}%;height:100%;background:#28a745;border-radius:3px"></div></div>
        `;
        row.onmouseenter = () => row.style.background = "rgba(255,255,255,0.06)";
        row.onmouseleave = () => row.style.background = "";
        row.onclick = async () => {
          row.style.opacity = "0.5";
          try {
            await issueApi.update(number, { milestone: m.number });
            close();
            showDetail(number);
          } catch (e) { alert("设置里程碑失败: " + e.message); row.style.opacity = "1"; }
        };
        listDiv.appendChild(row);
      });

      if (state.milestones.length === 0) {
        listDiv.innerHTML = '<div class="giu-empty">没有可用的里程碑</div>';
      }

      modal.appendChild(listDiv);
    });
  }

  // ==================== 锁定 Modal ====================

  function showLockModal(number) {
    showModal("锁定讨论", (modal, close) => {
      const tip = document.createElement("div");
      tip.style.cssText = "font-size:12px;opacity:0.7;margin-bottom:10px";
      tip.textContent = "锁定后其他用户无法评论此 Issue。选择锁定原因：";
      modal.appendChild(tip);
      const reasons = [
        { value: "", text: "无特定原因" },
        { value: "off-topic", text: "偏离主题 (off-topic)" },
        { value: "too heated", text: "过于激烈 (too heated)" },
        { value: "resolved", text: "已解决 (resolved)" },
        { value: "spam", text: "垃圾信息 (spam)" }
      ];

      const sel = document.createElement("select");
      sel.className = "giu-select";
      sel.style.width = "100%";
      sel.style.marginBottom = "12px";
      reasons.forEach(r => {
        const op = document.createElement("option");
        op.value = r.value;
        op.textContent = r.text;
        sel.appendChild(op);
      });
      modal.appendChild(sel);

      const lockBtn = makeBtn("🔒 确认锁定", { background: "rgba(255,200,0,0.3)" });
      lockBtn.onclick = async () => {
        lockBtn.disabled = true;
        try {
          await issueApi.lock(number, sel.value || undefined);
          close();
          showDetail(number);
        } catch (e) { alert("锁定失败: " + e.message); lockBtn.disabled = false; }
      };
      modal.appendChild(lockBtn);
    });
  }

  // ==================== 转移 Modal ====================

  function showTransferModal(number) {
    showModal("转移 Issue", (modal, close) => {
      const tip = document.createElement("div");
      tip.style.cssText = "font-size:12px;opacity:0.7;margin-bottom:10px";
      tip.textContent = "将此 Issue 转移到同一个 owner 下的另一个仓库。";
      modal.appendChild(tip);

      const repoInput = document.createElement("input");
      repoInput.className = "giu-input";
      repoInput.style.width = "100%";
      repoInput.style.marginBottom = "12px";
      repoInput.placeholder = "目标仓库名称";
      modal.appendChild(repoInput);

      const transferBtn = makeBtn("📦 确认转移", { background: "rgba(255,165,0,0.3)" });
      transferBtn.onclick = async () => {
        const target = repoInput.value.trim();
        if (!target) return alert("请输入目标仓库名");
        if (!confirm(`确定要把 Issue #${number} 转移到 ${core.currentOwner}/${target}？`)) return;
        transferBtn.disabled = true;
        try {
          await issueApi.transfer(number, core.currentOwner, target);
          alert("转移成功！");
          close();
          loadList();
        } catch (e) { alert("转移失败: " + e.message); transferBtn.disabled = false; }
      };
      modal.appendChild(transferBtn);
    });
  }

  // ==================== 新建 Issue ====================

  async function showCreate() {
    if (!needRepo()) return;
    if (!needToken()) return;

    clearMain();
    setStatus("新建 Issue");

    const wrap = document.createElement("div");
    wrap.className = "giu-form";

    const backBtn = makeBtn("← 返回列表");
    backBtn.onclick = () => loadList();
    wrap.appendChild(backBtn);

    // --- 模板选择 ---
    const templateSection = document.createElement("div");
    templateSection.style.marginBottom = "8px";

    try {
      const templates = await issueApi.getTemplates();
      if (templates.length > 0) {
        const templateLabel = document.createElement("div");
        templateLabel.style.cssText = "font-size:11px;opacity:0.6;margin-bottom:4px";
        templateLabel.textContent = "选择模板 (可选)：";
        templateSection.appendChild(templateLabel);

        const templateRow = document.createElement("div");
        templateRow.className = "giu-row";

        templates.forEach(t => {
          const tBtn = makeSBtn(t.name.replace(/\.(md|yml|yaml)$/, ""));
          tBtn.onclick = async () => {
            try {
              setStatus("加载模板...");
              const content = await issueApi.getTemplateContent(t.path);
              const parsed = parseTemplate(content);
              if (parsed.title) titleInput.value = parsed.title;
              if (parsed.body) bodyEditor.textarea.value = parsed.body;
              if (parsed.labels && parsed.labels.length) labelsInput.value = parsed.labels.join(", ");
              if (parsed.assignees && parsed.assignees.length) assigneesInput.value = parsed.assignees.join(", ");
              setStatus("模板已加载");
            } catch (e) { alert("加载模板失败: " + e.message); }
          };
          templateRow.appendChild(tBtn);
        });

        templateSection.appendChild(templateRow);
      }
    } catch (e) { /* 无模板 */ }

    wrap.appendChild(templateSection);

    // 标题
    const titleInput = document.createElement("input");
    titleInput.className = "giu-input";
    titleInput.placeholder = "Issue 标题";
    titleInput.style.width = "100%";
    wrap.appendChild(titleInput);

    // 正文 (Markdown 编辑器)
    const bodyEditor = createMdEditor("Issue 正文 (支持 Markdown)", "180px");
    wrap.appendChild(bodyEditor.wrap);

    // 标签
    const labelsInput = document.createElement("input");
    labelsInput.className = "giu-input";
    labelsInput.placeholder = "标签 (逗号分隔)，例如 bug, enhancement";
    labelsInput.style.width = "100%";

    const labelsQuick = document.createElement("div");
    labelsQuick.className = "giu-tag-list";
    labelsQuick.style.marginTop = "4px";
    state.labels.forEach(l => {
      const span = document.createElement("span");
      span.className = "giu-label";
      span.style.background = `#${l.color || "666"}33`;
      span.style.borderColor = `#${l.color || "666"}88`;
      span.style.cursor = "pointer";
      span.textContent = l.name;
      span.onclick = () => {
        const current = labelsInput.value.split(",").map(s => s.trim()).filter(Boolean);
        if (!current.includes(l.name)) {
          current.push(l.name);
          labelsInput.value = current.join(", ");
        }
      };
      labelsQuick.appendChild(span);
    });

    wrap.appendChild(labelsInput);
    wrap.appendChild(labelsQuick);

    // 负责人
    const assigneesInput = document.createElement("input");
    assigneesInput.className = "giu-input";
    assigneesInput.placeholder = "负责人 (逗号分隔)，例如 octocat, user2";
    assigneesInput.style.width = "100%";

    const assigneesQuick = document.createElement("div");
    assigneesQuick.className = "giu-tag-list";
    assigneesQuick.style.marginTop = "4px";
    state.assignees.forEach(a => {
      const span = document.createElement("span");
      span.className = "giu-label";
      span.style.background = "rgba(100,170,255,0.15)";
      span.style.borderColor = "rgba(100,170,255,0.3)";
      span.style.cursor = "pointer";
      span.textContent = "@" + a.login;
      span.onclick = () => {
        const current = assigneesInput.value.split(",").map(s => s.trim()).filter(Boolean);
        if (!current.includes(a.login)) {
          current.push(a.login);
          assigneesInput.value = current.join(", ");
        }
      };
      assigneesQuick.appendChild(span);
    });

    wrap.appendChild(assigneesInput);
    wrap.appendChild(assigneesQuick);

    // 里程碑
    const milestoneSel2 = document.createElement("select");
    milestoneSel2.className = "giu-select";
    milestoneSel2.style.width = "100%";
    milestoneSel2.innerHTML = '<option value="">不设置里程碑</option>';
    state.milestones.forEach(m => {
      const op = document.createElement("option");
      op.value = String(m.number);
      op.textContent = m.title;
      milestoneSel2.appendChild(op);
    });
    wrap.appendChild(milestoneSel2);

    // 提交
    const submitBtn = makeBtn("创建 Issue", { background: "#28a745", marginTop: "6px" });
    submitBtn.onclick = async () => {
      const title = titleInput.value.trim();
      if (!title) return alert("请输入标题");

      const labels = labelsInput.value.split(",").map(s => s.trim()).filter(Boolean);
      const assignees = assigneesInput.value.split(",").map(s => s.trim()).filter(Boolean);
      const milestone = milestoneSel2.value ? parseInt(milestoneSel2.value) : undefined;

      submitBtn.disabled = true;
      setStatus("创建中...");

      try {
        const data = { title, body: bodyEditor.textarea.value, labels, assignees };
        if (milestone) data.milestone = milestone;
        const issue = await issueApi.create(data);
        alert(`Issue 创建成功：#${issue.number}`);
        showDetail(issue.number);
      } catch (e) {
        alert("创建失败: " + e.message);
        submitBtn.disabled = false;
        setStatus("创建失败: " + e.message, true);
      }
    };
    wrap.appendChild(submitBtn);

    ui.mainArea.appendChild(wrap);
  }

  // ==================== 模板解析 ====================

  function parseTemplate(content) {
    const result = { title: "", body: "", labels: [], assignees: [] };

    // 尝试解析 YAML frontmatter
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (fmMatch) {
      const yaml = fmMatch[1];
      result.body = fmMatch[2].trim();

      const titleMatch = yaml.match(/title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) result.title = titleMatch[1];

      const labelsMatch = yaml.match(/labels:\s*\[([^\]]*)\]/);
      if (labelsMatch) {
        result.labels = labelsMatch[1].split(",").map(s => s.trim().replace(/["']/g, "")).filter(Boolean);
      } else {
        const labelsListMatch = yaml.match(/labels:\s*\n((?:\s*-\s*.+\n?)*)/);
        if (labelsListMatch) {
          result.labels = labelsListMatch[1].split("\n").map(s => s.replace(/^\s*-\s*/, "").trim().replace(/["']/g, "")).filter(Boolean);
        }
      }

      const assigneesMatch = yaml.match(/assignees:\s*\[([^\]]*)\]/);
      if (assigneesMatch) {
        result.assignees = assigneesMatch[1].split(",").map(s => s.trim().replace(/["']/g, "")).filter(Boolean);
      } else {
        const assigneesListMatch = yaml.match(/assignees:\s*\n((?:\s*-\s*.+\n?)*)/);
        if (assigneesListMatch) {
          result.assignees = assigneesListMatch[1].split("\n").map(s => s.replace(/^\s*-\s*/, "").trim().replace(/["']/g, "")).filter(Boolean);
        }
      }
    } else {
      result.body = content;
    }

    return result;
  }

  // ==================== 管理标签页面 ====================

  function showLabelsManager() {
    if (!needRepo()) return;
    clearMain();
    setStatus("标签管理");

    const wrap = document.createElement("div");
    wrap.style.padding = "10px";

    const topRow = document.createElement("div");
    topRow.className = "giu-row";
    topRow.style.marginBottom = "12px";

    const backBtn = makeBtn("← 返回列表");
    backBtn.onclick = () => loadList();

    const createLabelBtn = makeBtn("+ 新建标签", { background: "#28a745" });
    createLabelBtn.onclick = () => showCreateLabelModal();

    topRow.appendChild(backBtn);
    topRow.appendChild(createLabelBtn);
    wrap.appendChild(topRow);

    const listDiv = document.createElement("div");

    state.labels.forEach(l => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:10px;padding:8px;border-bottom:1px solid rgba(255,255,255,0.08)";

      const colorDot = document.createElement("div");
      colorDot.style.cssText = `width:16px;height:16px;border-radius:50%;background:#${l.color || "666"}`;

      const nameDiv = document.createElement("div");
      nameDiv.style.flex = "1";
      nameDiv.innerHTML = `<div style="font-weight:700">${esc(l.name)}</div>${l.description ? `<div style="font-size:11px;opacity:0.6">${esc(l.description)}</div>` : ""}`;

      const editBtn = makeSBtn("编辑");
      editBtn.onclick = () => showEditLabelModal(l);

      const delBtn = makeSBtn("删除", { background: "rgba(255,80,80,0.2)" });
      delBtn.onclick = async () => {
        if (!confirm(`确定删除标签 "${l.name}"？此操作会从所有 Issues 上移除这个标签。`)) return;
        try {
          await issueApi.deleteLabel(l.name);
          await loadMeta();
          showLabelsManager();
        } catch (e) { alert("删除失败: " + e.message); }
      };

      row.appendChild(colorDot);
      row.appendChild(nameDiv);
      row.appendChild(editBtn);
      row.appendChild(delBtn);
      listDiv.appendChild(row);
    });

    if (state.labels.length === 0) {
      listDiv.innerHTML = '<div class="giu-empty">没有标签</div>';
    }

    wrap.appendChild(listDiv);
    ui.mainArea.appendChild(wrap);
  }

  function showCreateLabelModal() {
    showModal("新建标签", (modal, close) => {
      const nameInp = document.createElement("input");
      nameInp.className = "giu-input";
      nameInp.style.width = "100%";
      nameInp.style.marginBottom = "8px";
      nameInp.placeholder = "标签名称";

      const colorInp = document.createElement("input");
      colorInp.className = "giu-input";
      colorInp.style.width = "100%";
      colorInp.style.marginBottom = "8px";
      colorInp.placeholder = "颜色 (6位 hex，如 ff0000)";
      colorInp.value = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

      const descInp = document.createElement("input");
      descInp.className = "giu-input";
      descInp.style.width = "100%";
      descInp.style.marginBottom = "12px";
      descInp.placeholder = "描述 (可选)";

      const previewDiv = document.createElement("div");
      previewDiv.style.marginBottom = "12px";
      const updatePreview = () => {
        const c = colorInp.value.replace("#", "");
        previewDiv.innerHTML = `<span class="giu-label" style="background:#${c}33;border-color:#${c}88">${esc(nameInp.value || "预览")}</span>`;
      };
      nameInp.oninput = updatePreview;
      colorInp.oninput = updatePreview;
      updatePreview();

      const saveBtn = makeBtn("创建", { background: "#28a745" });
      saveBtn.onclick = async () => {
        if (!nameInp.value.trim()) return alert("请输入名称");
        saveBtn.disabled = true;
        try {
          await issueApi.createLabel(nameInp.value.trim(), colorInp.value.trim(), descInp.value.trim());
          await loadMeta();
          close();
          showLabelsManager();
        } catch (e) { alert("创建失败: " + e.message); saveBtn.disabled = false; }
      };

      modal.appendChild(nameInp);
      modal.appendChild(colorInp);
      modal.appendChild(descInp);
      modal.appendChild(previewDiv);
      modal.appendChild(saveBtn);
    });
  }

  function showEditLabelModal(label) {
    showModal("编辑标签", (modal, close) => {
      const nameInp = document.createElement("input");
      nameInp.className = "giu-input";
      nameInp.style.width = "100%";
      nameInp.style.marginBottom = "8px";
      nameInp.value = label.name;

      const colorInp = document.createElement("input");
      colorInp.className = "giu-input";
      colorInp.style.width = "100%";
      colorInp.style.marginBottom = "8px";
      colorInp.value = label.color || "";

      const descInp = document.createElement("input");
      descInp.className = "giu-input";
      descInp.style.width = "100%";
      descInp.style.marginBottom = "12px";
      descInp.value = label.description || "";

      const saveBtn = makeBtn("保存", { background: "#28a745" });
      saveBtn.onclick = async () => {
        if (!nameInp.value.trim()) return alert("名称不能为空");
        saveBtn.disabled = true;
        try {
          await issueApi.updateLabel(label.name, nameInp.value.trim(), colorInp.value.trim(), descInp.value.trim());
          await loadMeta();
          close();
          showLabelsManager();
        } catch (e) { alert("保存失败: " + e.message); saveBtn.disabled = false; }
      };

      modal.appendChild(nameInp);
      modal.appendChild(colorInp);
      modal.appendChild(descInp);
      modal.appendChild(saveBtn);
    });
  }

  // ==================== 事件绑定 ====================

  filterSel.onchange = () => { state.page = 1; loadList(); };
  sortSel.onchange = () => { state.page = 1; loadList(); };
  labelSel.onchange = () => { state.page = 1; loadList(); };
  milestoneSel.onchange = () => { state.page = 1; loadList(); };
  assigneeSel.onchange = () => { state.page = 1; loadList(); };
  perPageSel.onchange = () => { state.page = 1; loadList(); };

  searchBtn.onclick = () => { state.page = 1; loadList(); };
  refreshBtn.onclick = async () => { await loadMeta(); loadList(); };
  newBtn.onclick = () => showCreate();
  labelsBtn.onclick = () => showLabelsManager();

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { state.page = 1; loadList(); }
  });

  prevBtn.onclick = () => {
    if (state.page > 1) { state.page--; loadList(); }
  };
  nextBtn.onclick = () => {
    if (state.hasNext || state.page < state.totalPages) { state.page++; loadList(); }
  };

  // ==================== 标签页集成 ====================

  const nativeAreas = [ui.searchArea, ui.browseArea, ui.aiArea, ui.trendingArea, ui.myArea, ui.pluginsArea];
  const nativeTabs = [ui.tabSearchBtn, ui.tabBrowseBtn, ui.tabTrendingBtn, ui.tabMyBtn, ui.tabAIBtn, ui.tabPluginsBtn];

  function activate() {
    state.active = true;
    nativeAreas.forEach(a => { if (a) a.style.display = "none"; });
    if (ui.searchDirSelectWrap) ui.searchDirSelectWrap.style.display = "none";
    nativeTabs.forEach(t => { if (t) t.style.background = ""; });
    area.style.display = "block";
    tabBtn.style.background = "rgba(255,255,255,0.25)";
    clearMain();

    if (!needRepo()) return;
    loadMeta().then(() => loadList());
  }

  function deactivate() {
    state.active = false;
    area.style.display = "none";
    tabBtn.style.background = "";
  }

  tabBtn.onclick = activate;
  plugin._deactivate = deactivate;

  console.log("[Issues Ultimate] 插件已加载，点击「🐛 Issues」标签使用");
};

plugin.onHook = (hookName, data) => {
  if (hookName === "mode:switch" && plugin._deactivate) {
    plugin._deactivate();
  }
};
