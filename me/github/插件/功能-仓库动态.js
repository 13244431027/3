plugin.id = "ckfeed";
plugin.name = "仓库动态";
plugin.version = "1.0.0";
plugin.author = "yuan";
plugin.description = "仓库动态。";
plugin.style = `
  .fx-card { padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(0,0,0,.18); }
  .fx-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .fx-muted { opacity:.75; font-size:12px; }
  .fx-title { font-weight:800; font-size:13px; }
  .fx-pill { display:inline-block; padding:2px 6px; border-radius:999px; background:rgba(255,255,255,.08); font-size:11px; opacity:.9; }
  .fx-item { padding:10px; border-bottom:1px solid rgba(255,255,255,.08); }
  .fx-item:last-child{ border-bottom:none; }
  .fx-btnRow { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
  .fx-a { color:#8af; text-decoration:none; }
`;

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  // state
  plugin._state = {
    tab: "feed",               // feed | explorer
    feedType: "all",           // all | PushEvent | IssuesEvent | PullRequestEvent | WatchEvent | ReleaseEvent
    feedAuto: "off",
    feedTimer: null,
    feedPage: 1,

    explorerKind: "issues",    // issues | prs | releases
    explorerState: "open",     // open | closed | all  (issues/prs)
    explorerPage: 1
  };

  // 为 Browse 区域“额外插入两个入口按钮”
  // 采用 hook ui:ready 后插入（保证 ui 已存在）
};

plugin.onHook = (hookName, data) => {
  if (hookName === "ui:ready") {
    plugin._mountButtons();
  }
  if (hookName === "mode:switch") {
    // 切到 browse 时，把按钮补回去（某些情况下 UI 会被重置）
    if (data === "browse") plugin._mountButtons(true);
  }
  if (hookName === "ui:hide") {
    plugin._stopFeedAuto();
  }
};

plugin._mountButtons = (force = false) => {
  const { ui, components } = plugin._ctx;
  if (!ui || !ui.actionRow) return;

  // 防重复
  if (!force && ui.actionRow.querySelector('[data-fx="feedBtn"]')) return;

  const feedBtn = components.createWindowButton("Feed");
  feedBtn.dataset.fx = "feedBtn";
  feedBtn.onclick = () => plugin._openFeedPanel();

  const explorerBtn = components.createWindowButton("Explorer");
  explorerBtn.dataset.fx = "explorerBtn";
  explorerBtn.onclick = () => plugin._openExplorerPanel();

  // 插到 Browse 的 actionRow（有 token 才显示 actionRow 时也能用，因为 actionRow 即使无 token 也存在）
  ui.actionRow.appendChild(feedBtn);
  ui.actionRow.appendChild(explorerBtn);
};

plugin._ensureRepo = () => {
  const { core } = plugin._ctx;
  if (!core.currentOwner || !core.currentRepo) throw new Error("请先进入一个仓库（Browse -> 输入 owner/repo）");
};

plugin._renderHeader = (title) => {
  const { ui, components } = plugin._ctx;
  ui.mainArea.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.style.padding = "10px";
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.gap = "10px";

  const top = document.createElement("div");
  top.className = "fx-row fx-card";

  const t = document.createElement("div");
  t.innerHTML = `<div class="fx-title">${title}</div>`;
  t.style.flex = "1";

  const back = components.createWindowButton("返回");
  back.onclick = () => {
    // 回到当前目录列表
    const { extension, core } = plugin._ctx;
    core.viewMode = "list";
    extension.loadDir(core.currentPath || "");
  };

  top.appendChild(t);
  top.appendChild(back);
  wrap.appendChild(top);

  ui.mainArea.appendChild(wrap);
  return wrap;
};

/* -------------------- Feed -------------------- */

plugin._openFeedPanel = async () => {
  try {
    plugin._ensureRepo();
    plugin._state.tab = "feed";
    plugin._stopFeedAuto();
    const wrap = plugin._renderHeader("Feed（仓库动态）");

    // controls
    const controls = document.createElement("div");
    controls.className = "fx-card";
    controls.style.display = "flex";
    controls.style.flexDirection = "column";
    controls.style.gap = "8px";

    const row1 = document.createElement("div");
    row1.className = "fx-row";

    const typeSelWrap = plugin._ctx.utils.select(
      ["all", "PushEvent", "IssuesEvent", "PullRequestEvent", "WatchEvent", "ReleaseEvent"],
      "类型"
    );
    plugin._ctx.utils.applySelectLabels(typeSelWrap.sel, {
      all: "全部",
      PushEvent: "Push（提交）",
      IssuesEvent: "Issues",
      PullRequestEvent: "PR",
      WatchEvent: "Star（Watch）",
      ReleaseEvent: "Release"
    });
    typeSelWrap.sel.value = plugin._state.feedType;
    typeSelWrap.sel.onchange = () => {
      plugin._state.feedType = typeSelWrap.sel.value;
      plugin._state.feedPage = 1;
      plugin._loadFeed();
    };

    const autoSelWrap = plugin._ctx.utils.select(["off", "on"], "自动刷新");
    plugin._ctx.utils.applySelectLabels(autoSelWrap.sel, { off: "关闭", on: "开启（15s）" });
    autoSelWrap.sel.value = plugin._state.feedAuto;
    autoSelWrap.sel.onchange = () => {
      plugin._state.feedAuto = autoSelWrap.sel.value;
      if (plugin._state.feedAuto === "on") plugin._startFeedAuto();
      else plugin._stopFeedAuto();
    };

    const refreshBtn = plugin._ctx.components.createWindowButton("刷新");
    refreshBtn.onclick = () => plugin._loadFeed();

    row1.appendChild(typeSelWrap.el);
    row1.appendChild(autoSelWrap.el);
    row1.appendChild(refreshBtn);

    const row2 = document.createElement("div");
    row2.className = "fx-row";
    row2.style.justifyContent = "space-between";

    const pager = document.createElement("div");
    pager.className = "fx-row";
    const prev = plugin._ctx.components.createWindowButton("< Prev");
    const next = plugin._ctx.components.createWindowButton("Next >");
    const pageLab = document.createElement("div");
    pageLab.className = "fx-muted";
    pageLab.textContent = `Page ${plugin._state.feedPage}`;
    prev.onclick = () => {
      if (plugin._state.feedPage <= 1) return;
      plugin._state.feedPage--;
      pageLab.textContent = `Page ${plugin._state.feedPage}`;
      plugin._loadFeed();
    };
    next.onclick = () => {
      plugin._state.feedPage++;
      pageLab.textContent = `Page ${plugin._state.feedPage}`;
      plugin._loadFeed();
    };
    pager.appendChild(prev);
    pager.appendChild(pageLab);
    pager.appendChild(next);

    row2.appendChild(pager);

    controls.appendChild(row1);
    controls.appendChild(row2);

    // list
    const list = document.createElement("div");
    list.className = "fx-card";
    list.style.padding = "0";
    list.dataset.fx = "feedList";
    list.innerHTML = `<div class="fx-item fx-muted">加载中...</div>`;

    wrap.appendChild(controls);
    wrap.appendChild(list);

    await plugin._loadFeed();
  } catch (e) {
    plugin._setStatusError(e);
  }
};

plugin._startFeedAuto = () => {
  plugin._stopFeedAuto();
  plugin._state.feedTimer = setInterval(() => {
    // 仅在当前 tab 是 feed 时刷新
    if (plugin._state.tab === "feed") plugin._loadFeed(true);
  }, 15000);
};

plugin._stopFeedAuto = () => {
  if (plugin._state.feedTimer) clearInterval(plugin._state.feedTimer);
  plugin._state.feedTimer = null;
};

plugin._loadFeed = async (silent = false) => {
  const { core, ui, api } = plugin._ctx;
  try {
    plugin._ensureRepo();
    if (!silent) plugin._setStatus(`加载动态...`);
    const perPage = 30;
    const url = `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/events?per_page=${perPage}&page=${plugin._state.feedPage}`;
    const events = await api.fetchJson(url);

    const list = ui.mainArea.querySelector('[data-fx="feedList"]');
    if (!list) return;
    list.innerHTML = "";

    const filtered = (plugin._state.feedType === "all")
      ? events
      : events.filter(ev => ev.type === plugin._state.feedType);

    if (!filtered.length) {
      list.innerHTML = `<div class="fx-item fx-muted">没有符合条件的动态</div>`;
      plugin._setStatus(`Feed：0 条`);
      return;
    }

    filtered.forEach(ev => {
      const item = document.createElement("div");
      item.className = "fx-item";

      const actor = ev.actor?.login || "unknown";
      const time = ev.created_at ? ev.created_at.replace("T", " ").replace("Z", "") : "";
      const type = ev.type;

      // 生成简短描述
      let msg = "";
      try {
        if (type === "PushEvent") {
          const commits = ev.payload?.commits || [];
          msg = `push ${commits.length} commits`;
        } else if (type === "IssuesEvent") {
          msg = `${ev.payload?.action} issue #${ev.payload?.issue?.number}`;
        } else if (type === "PullRequestEvent") {
          msg = `${ev.payload?.action} PR #${ev.payload?.pull_request?.number}`;
        } else if (type === "WatchEvent") {
          msg = `starred`;
        } else if (type === "ReleaseEvent") {
          msg = `${ev.payload?.action} release ${ev.payload?.release?.tag_name || ""}`.trim();
        }
      } catch {}

      item.innerHTML = `
        <div class="fx-row" style="justify-content:space-between">
          <div>
            <span class="fx-pill">${type}</span>
            <span style="margin-left:6px"><b>${actor}</b> <span class="fx-muted">${msg}</span></span>
          </div>
          <div class="fx-muted">${time}</div>
        </div>
      `;

      // 相关链接
      const btnRow = document.createElement("div");
      btnRow.className = "fx-btnRow";

      const openActor = plugin._ctx.components.createWindowButton("打开用户");
      openActor.onclick = () => window.open(`https://github.com/${actor}`, "_blank");

      const openRepo = plugin._ctx.components.createWindowButton("仓库页");
      openRepo.onclick = () => window.open(`https://github.com/${core.currentOwner}/${core.currentRepo}`, "_blank");

      btnRow.appendChild(openActor);
      btnRow.appendChild(openRepo);

      item.appendChild(btnRow);
      list.appendChild(item);
    });

    plugin._setStatus(`Feed：${filtered.length} 条（Page ${plugin._state.feedPage}）`);
  } catch (e) {
    plugin._setStatusError(e);
  }
};

/* -------------------- Explorer -------------------- */

plugin._openExplorerPanel = async () => {
  try {
    plugin._ensureRepo();
    plugin._state.tab = "explorer";
    plugin._stopFeedAuto();

    const wrap = plugin._renderHeader("Explorer（Issues / PR / Releases）");

    const controls = document.createElement("div");
    controls.className = "fx-card";
    controls.style.display = "flex";
    controls.style.flexDirection = "column";
    controls.style.gap = "8px";

    const row1 = document.createElement("div");
    row1.className = "fx-row";

    const kindSelWrap = plugin._ctx.utils.select(["issues", "prs", "releases"], "内容");
    plugin._ctx.utils.applySelectLabels(kindSelWrap.sel, {
      issues: "Issues",
      prs: "Pull Requests",
      releases: "Releases"
    });
    kindSelWrap.sel.value = plugin._state.explorerKind;
    kindSelWrap.sel.onchange = () => {
      plugin._state.explorerKind = kindSelWrap.sel.value;
      plugin._state.explorerPage = 1;
      plugin._loadExplorer();
    };

    const stateSelWrap = plugin._ctx.utils.select(["open", "closed", "all"], "状态");
    stateSelWrap.sel.value = plugin._state.explorerState;
    stateSelWrap.sel.onchange = () => {
      plugin._state.explorerState = stateSelWrap.sel.value;
      plugin._state.explorerPage = 1;
      plugin._loadExplorer();
    };

    const refreshBtn = plugin._ctx.components.createWindowButton("刷新");
    refreshBtn.onclick = () => plugin._loadExplorer();

    row1.appendChild(kindSelWrap.el);
    row1.appendChild(stateSelWrap.el);
    row1.appendChild(refreshBtn);

    const row2 = document.createElement("div");
    row2.className = "fx-row";

    const prev = plugin._ctx.components.createWindowButton("< Prev");
    const next = plugin._ctx.components.createWindowButton("Next >");
    const pageLab = document.createElement("div");
    pageLab.className = "fx-muted";
    pageLab.textContent = `Page ${plugin._state.explorerPage}`;
    prev.onclick = () => {
      if (plugin._state.explorerPage <= 1) return;
      plugin._state.explorerPage--;
      pageLab.textContent = `Page ${plugin._state.explorerPage}`;
      plugin._loadExplorer();
    };
    next.onclick = () => {
      plugin._state.explorerPage++;
      pageLab.textContent = `Page ${plugin._state.explorerPage}`;
      plugin._loadExplorer();
    };

    row2.appendChild(prev);
    row2.appendChild(pageLab);
    row2.appendChild(next);

    const list = document.createElement("div");
    list.className = "fx-card";
    list.style.padding = "0";
    list.dataset.fx = "explorerList";
    list.innerHTML = `<div class="fx-item fx-muted">加载中...</div>`;

    controls.appendChild(row1);
    controls.appendChild(row2);

    wrap.appendChild(controls);
    wrap.appendChild(list);

    await plugin._loadExplorer();
  } catch (e) {
    plugin._setStatusError(e);
  }
};

plugin._loadExplorer = async () => {
  const { core, ui, api } = plugin._ctx;
  try {
    plugin._ensureRepo();
    plugin._setStatus("加载 Explorer...");

    const perPage = 30;
    let url = "";
    const page = plugin._state.explorerPage;

    if (plugin._state.explorerKind === "issues") {
      // issues 接口会混入 PR，因此要过滤 pull_request 字段
      url = `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/issues?state=${plugin._state.explorerState}&per_page=${perPage}&page=${page}`;
      const items = await api.fetchJson(url);
      plugin._renderExplorerList(
        items.filter(it => !it.pull_request),
        "issue"
      );
    } else if (plugin._state.explorerKind === "prs") {
      url = `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/pulls?state=${plugin._state.explorerState}&per_page=${perPage}&page=${page}`;
      const items = await api.fetchJson(url);
      plugin._renderExplorerList(items, "pr");
    } else {
      url = `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/releases?per_page=${perPage}&page=${page}`;
      const items = await api.fetchJson(url);
      plugin._renderReleases(items);
    }
  } catch (e) {
    plugin._setStatusError(e);
  }
};

plugin._renderExplorerList = (items, kind) => {
  const { ui, core, components } = plugin._ctx;
  const list = ui.mainArea.querySelector('[data-fx="explorerList"]');
  if (!list) return;

  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<div class="fx-item fx-muted">空</div>`;
    plugin._setStatus("Explorer：空");
    return;
  }

  items.forEach(it => {
    const item = document.createElement("div");
    item.className = "fx-item";

    const num = it.number;
    const title = it.title || "";
    const user = it.user?.login || "unknown";
    const created = (it.created_at || "").split("T")[0];
    const updated = (it.updated_at || "").split("T")[0];
    const state = it.state;

    item.innerHTML = `
      <div class="fx-row" style="justify-content:space-between">
        <div>
          <span class="fx-pill">${kind.toUpperCase()} #${num}</span>
          <span style="margin-left:6px"><b>${title}</b></span>
        </div>
        <div class="fx-muted">${state}</div>
      </div>
      <div class="fx-muted" style="margin-top:4px">
        by <b>${user}</b> · created ${created} · updated ${updated}
      </div>
    `;

    const btnRow = document.createElement("div");
    btnRow.className = "fx-btnRow";

    const openWeb = components.createWindowButton("打开网页");
    openWeb.onclick = () => window.open(it.html_url, "_blank");

    const openUser = components.createWindowButton("用户");
    openUser.onclick = () => window.open(`https://github.com/${user}`, "_blank");

    const openRepo = components.createWindowButton("仓库");
    openRepo.onclick = () => window.open(`https://github.com/${core.currentOwner}/${core.currentRepo}`, "_blank");

    btnRow.appendChild(openWeb);
    btnRow.appendChild(openUser);
    btnRow.appendChild(openRepo);

    item.appendChild(btnRow);
    list.appendChild(item);
  });

  plugin._setStatus(`Explorer：${items.length} 条`);
};

plugin._renderReleases = (items) => {
  const { ui, components } = plugin._ctx;
  const list = ui.mainArea.querySelector('[data-fx="explorerList"]');
  if (!list) return;

  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<div class="fx-item fx-muted">没有 Release</div>`;
    plugin._setStatus("Releases：空");
    return;
  }

  items.forEach(r => {
    const item = document.createElement("div");
    item.className = "fx-item";

    const tag = r.tag_name || "";
    const name = r.name || "";
    const author = r.author?.login || "unknown";
    const created = (r.created_at || "").split("T")[0];
    const published = (r.published_at || "").split("T")[0];

    item.innerHTML = `
      <div class="fx-row" style="justify-content:space-between">
        <div>
          <span class="fx-pill">TAG ${tag}</span>
          <span style="margin-left:6px"><b>${name}</b></span>
        </div>
        <div class="fx-muted">published ${published || "-"}</div>
      </div>
      <div class="fx-muted" style="margin-top:4px">
        by <b>${author}</b> · created ${created}
      </div>
    `;

    const btnRow = document.createElement("div");
    btnRow.className = "fx-btnRow";

    const openWeb = components.createWindowButton("打开网页");
    openWeb.onclick = () => window.open(r.html_url, "_blank");

    btnRow.appendChild(openWeb);

    // assets
    if (Array.isArray(r.assets) && r.assets.length) {
      const assetBtn = components.createWindowButton(`Assets(${r.assets.length})`);
      assetBtn.onclick = () => {
        const urls = r.assets.map(a => `${a.name}: ${a.browser_download_url}`).join("\n");
        plugin._ctx.utils.copyToClipboard(urls);
        alert("Assets 下载链接已复制到剪贴板");
      };
      btnRow.appendChild(assetBtn);
    }

    item.appendChild(btnRow);
    list.appendChild(item);
  });

  plugin._setStatus(`Releases：${items.length} 条`);
};

/* -------------------- Status helpers -------------------- */

plugin._setStatus = (msg) => {
  const { ui } = plugin._ctx;
  if (!ui || !ui.statusLabel) return;
  ui.statusLabel.textContent = msg;
  ui.statusLabel.style.color = "#fff";
};

plugin._setStatusError = (e) => {
  const { ui } = plugin._ctx;
  const msg = e?.message || String(e);
  console.error("[Feed&Explorer]", e);
  if (ui && ui.statusLabel) {
    ui.statusLabel.textContent = `错误: ${msg}`;
    ui.statusLabel.style.color = "#ff8888";
  }
};
