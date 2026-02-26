plugin.id = "my.starred-repos";
plugin.name = "⚙️功能-我的标星仓库";
plugin.version = "1.3.0";
plugin.author = "yuan";
plugin.description = "GitHub 面板 Pro+ 在'我的'界面增加表星仓库并在搜索是增加一些功能。";
plugin.init = (ctx) => {
  plugin._ctx = ctx;
  plugin._starredPage = 1;

  // 缓存：我已标星的 full_name 集合，用于“搜索结果”准确显示
  plugin._starredSet = new Set();
  plugin._starredSetLoadedAt = 0;
  plugin._starredSetLoading = false;

  // 可调：缓存多久刷新一次（避免频繁请求）
  plugin._STAR_SET_TTL = 60 * 1000; // 60s
};

plugin.onHook = (hookName, data) => {
  if (hookName === "ui:ready") {
    const { ui, components } = plugin._ctx;

    const myArea = ui.myArea;
    if (!myArea) return;

    const controls = myArea.querySelector("div");
    if (!controls) return;

    const starredBtn = components.createWindowButton("我的标星仓库");
    starredBtn.style.marginLeft = "10px";
    starredBtn.onclick = async () => {
      plugin._starredPage = 1;
      await plugin._ensureStarredSetFresh(true);
      plugin._loadStarredRepos();
    };

    controls.appendChild(starredBtn);
  }

  // 搜索仓库后：修复“已标星显示未标星”
  if (hookName === "search:repos") {
    plugin._enhanceSearchRepoList(data);
  }

  // 当用户进入“我的”页时，也顺便预热一次标星集合（不强制）
  if (hookName === "mode:switch" && data === "my") {
    plugin._ensureStarredSetFresh(false).catch(() => {});
  }
};

// ---------------- 工具 ----------------

plugin._setStatus = (text, isError = false) => {
  const { ui } = plugin._ctx;
  if (!ui.statusLabel) return;
  ui.statusLabel.textContent = text;
  ui.statusLabel.style.color = isError ? "#ff8888" : "#fff";
};

plugin._assertToken = () => {
  const { core } = plugin._ctx;
  if (!core.token) throw new Error("GitHub Token 未设置");
};

plugin._fmtDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

// 拉取“我已标星仓库”的 full_name Set（分页到结束）
// 用于：搜索结果判断是否已标星（修复“显示未标星”）
plugin._ensureStarredSetFresh = async (force) => {
  const { core } = plugin._ctx;
  if (!core.token) return; // 无 token 不做

  const now = Date.now();
  if (!force && plugin._starredSet.size > 0 && now - plugin._starredSetLoadedAt < plugin._STAR_SET_TTL) return;
  if (plugin._starredSetLoading) return;

  plugin._starredSetLoading = true;
  try {
    plugin._setStatus("同步我的标星列表中...");

    plugin._starredSet.clear();
    let page = 1;
    const perPage = 100;

    while (true) {
      const arr = await core.apiManager.fetchJson(
        `https://api.github.com/user/starred?per_page=${perPage}&page=${page}`
      );
      if (!Array.isArray(arr) || arr.length === 0) break;
      for (const r of arr) {
        if (r && r.full_name) plugin._starredSet.add(r.full_name);
      }
      if (arr.length < perPage) break;
      page++;
      // 防止极端情况无限页
      if (page > 50) break;
    }

    plugin._starredSetLoadedAt = Date.now();
    plugin._setStatus(`标星列表已同步：${plugin._starredSet.size} 个`);
  } finally {
    plugin._starredSetLoading = false;
  }
};

// 取消标星（停止标星）
plugin._unstarRepo = async (owner, repo) => {
  const { core } = plugin._ctx;
  plugin._assertToken();

  const res = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/vnd.github+json",
      ...core.apiManager.headers
    }
  });

  if (res.status !== 204) {
    const t = await res.text().catch(() => "");
    throw new Error(`取消标星失败: HTTP ${res.status} ${t.slice(0, 120)}`);
  }

  plugin._starredSet.delete(`${owner}/${repo}`);
};

// 标星
plugin._starRepo = async (owner, repo) => {
  const { core } = plugin._ctx;
  plugin._assertToken();

  const res = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
    method: "PUT",
    headers: {
      "Accept": "application/vnd.github+json",
      ...core.apiManager.headers,
      "Content-Length": "0"
    }
  });

  if (res.status !== 204) {
    const t = await res.text().catch(() => "");
    throw new Error(`标星失败: HTTP ${res.status} ${t.slice(0, 120)}`);
  }

  plugin._starredSet.add(`${owner}/${repo}`);
};

// ---------------- 功能 1：我的标星仓库（头像/名称/更新时间 + 停止标星） ----------------

plugin._loadStarredRepos = async () => {
  const { core, ui, components, utils, extension } = plugin._ctx;

  plugin._setStatus(`加载标星仓库 (第 ${plugin._starredPage} 页)...`);

  try {
    plugin._assertToken();
    ui.mainArea.innerHTML = "";

    const perPage = 30;
    const starred = await core.apiManager.fetchJson(
      `https://api.github.com/user/starred?per_page=${perPage}&page=${plugin._starredPage}&sort=updated`
    );

    const container = document.createElement("div");
    container.style.padding = "5px";

    starred.forEach((repo) => {
      const row = document.createElement("div");
      Object.assign(row.style, utils.itemStyle());
      row.style.display = "flex";
      row.style.gap = "10px";
      row.style.alignItems = "flex-start";

      // 头像
      const avatar = document.createElement("img");
      avatar.src = repo.owner?.avatar_url || "";
      Object.assign(avatar.style, {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        flexShrink: "0",
        marginTop: "2px",
        border: "1px solid rgba(255,255,255,0.2)"
      });

      // 主体
      const body = document.createElement("div");
      body.style.flex = "1";
      body.style.minWidth = "0";

      const top = document.createElement("div");
      top.style.display = "flex";
      top.style.justifyContent = "space-between";
      top.style.gap = "10px";
      top.style.alignItems = "flex-start";

      const left = document.createElement("div");
      left.style.minWidth = "0";
      left.innerHTML = `
        <div style="word-break:break-word">
          <b>${repo.full_name}</b>
          <span style="font-size:0.85em;opacity:0.75;margin-left:6px">★${repo.stargazers_count}</span>
        </div>
        <div style="font-size:11px;opacity:0.75;margin-top:2px">创建者：${repo.owner?.login || "-"}</div>
        <div style="font-size:11px;opacity:0.75">更新：${plugin._fmtDateTime(repo.updated_at)}</div>
      `;

      const acts = document.createElement("div");
      acts.style.display = "flex";
      acts.style.gap = "8px";
      acts.style.flexWrap = "wrap";
      acts.style.justifyContent = "flex-end";

      const enterBtn = components.createWindowButton("进入");
      enterBtn.onclick = () => {
        ui.ownerInput.value = repo.owner.login;
        ui.repoInput.value = repo.name;
        extension._switchMode("browse");
        extension._refreshFromInputs();
      };

      const webBtn = components.createWindowButton("网页");
      webBtn.onclick = () => window.open(repo.html_url, "_blank");

      // 停止标星（取消标星）
      const unstarBtn = components.createWindowButton("停止标星", {
        background: "rgba(255,80,80,0.22)"
      });
      unstarBtn.onclick = async () => {
        const ok = confirm(`确定停止标星？\n${repo.full_name}`);
        if (!ok) return;

        unstarBtn.disabled = true;
        unstarBtn.textContent = "处理中...";
        try {
          await plugin._unstarRepo(repo.owner.login, repo.name);
          plugin._setStatus(`已停止标星：${repo.full_name}`);

          // 从 UI 移除该条目（更直观）
          row.remove();
        } catch (e) {
          console.error(e);
          plugin._setStatus(`停止标星失败: ${e.message || String(e)}`, true);
          unstarBtn.disabled = false;
          unstarBtn.textContent = "停止标星";
        }
      };

      acts.appendChild(enterBtn);
      acts.appendChild(webBtn);
      acts.appendChild(unstarBtn);

      const desc = document.createElement("div");
      desc.textContent = repo.description || "";
      Object.assign(desc.style, {
        fontSize: "12px",
        opacity: "0.82",
        margin: "6px 0 0 0",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      });

      top.appendChild(left);
      top.appendChild(acts);

      body.appendChild(top);
      body.appendChild(desc);

      row.appendChild(avatar);
      row.appendChild(body);
      container.appendChild(row);
    });

    ui.mainArea.appendChild(container);

    // 翻页
    const pager = document.createElement("div");
    Object.assign(pager.style, {
      display: "flex",
      gap: "6px",
      justifyContent: "center",
      margin: "12px 0 6px 0",
      alignItems: "center"
    });

    const prevBtn = components.createWindowButton("< 上一页");
    prevBtn.disabled = plugin._starredPage <= 1;
    prevBtn.onclick = () => {
      if (plugin._starredPage > 1) {
        plugin._starredPage--;
        plugin._loadStarredRepos();
      }
    };

    const nextBtn = components.createWindowButton("下一页 >");
    nextBtn.disabled = starred.length < perPage;
    nextBtn.onclick = () => {
      plugin._starredPage++;
      plugin._loadStarredRepos();
    };

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `第 ${plugin._starredPage} 页`;
    pageInfo.style.fontSize = "12px";
    pageInfo.style.opacity = "0.85";

    pager.appendChild(prevBtn);
    pager.appendChild(pageInfo);
    pager.appendChild(nextBtn);
    ui.mainArea.appendChild(pager);

    plugin._setStatus(`加载了 ${starred.length} 个标星仓库 (第 ${plugin._starredPage} 页)`);
  } catch (e) {
    console.error(`[Plugin:StarredRepos] 错误:`, e);
    plugin._setStatus(`错误: ${e.message || String(e)}`, true);
  }
};

// ---------------- 功能 2：搜索结果“已标星显示未标星”修复 + 加按钮 ----------------

plugin._enhanceSearchRepoList = async (searchData) => {
  const { core, ui, components } = plugin._ctx;

  if (!searchData || !Array.isArray(searchData.items)) return;
  if (!ui.mainArea) return;
  if (!core.token) return; // 无 token 就不显示按钮，也无法判断“是否已标星”

  try {
    await plugin._ensureStarredSetFresh(false);
  } catch {
    // 同步失败也继续：按钮仍可用，只是初始状态可能未知
  }

  // 找到所有“结果卡片”容器：粗略匹配（与扩展结构兼容）
  const cards = Array.from(ui.mainArea.children)
    .flatMap((c) => (c && c.querySelectorAll ? Array.from(c.querySelectorAll(":scope > div")) : []))
    .filter((el) => el && el.querySelectorAll);

  for (const repo of searchData.items) {
    const fullName = repo.full_name;
    const owner = repo.owner?.login;
    const name = repo.name;
    if (!fullName || !owner || !name) continue;

    // 用 full_name 在卡片文本中定位对应项（扩展本身没有 data-id）
    const row = cards.find((el) => (el.textContent || "").includes(fullName));
    if (!row) continue;
    if (row.dataset && row.dataset.starInjected === "1") continue;

    // 扩展 _createRepoItem 的按钮区是 row 的最后一个 div（acts）
    const divs = Array.from(row.querySelectorAll("div"));
    const acts = divs.reverse().find((d) => d.querySelector && d.querySelector("button"));
    if (!acts) continue;

    const isStarred = plugin._starredSet.has(fullName);

    const starBtn = components.createWindowButton(isStarred ? "★ 已标星" : "⭐ 标星", {
      background: isStarred ? "rgba(255,215,0,0.28)" : "rgba(255,215,0,0.18)",
      marginLeft: "6px"
    });

    starBtn.onclick = async (e) => {
      e.stopPropagation();
      starBtn.disabled = true;

      try {
        const nowStarred = plugin._starredSet.has(fullName);
        if (nowStarred) {
          starBtn.textContent = "取消中...";
          await plugin._unstarRepo(owner, name);
          starBtn.textContent = "⭐ 标星";
          starBtn.style.background = "rgba(255,215,0,0.18)";
          plugin._setStatus(`已取消标星：${fullName}`);
        } else {
          starBtn.textContent = "标星中...";
          await plugin._starRepo(owner, name);
          starBtn.textContent = "★ 已标星";
          starBtn.style.background = "rgba(255,215,0,0.28)";
          plugin._setStatus(`已标星：${fullName}`);
        }
      } catch (err) {
        console.error(err);
        plugin._setStatus(`标星操作失败: ${err.message || String(err)}`, true);
        // 失败后恢复显示
        const s = plugin._starredSet.has(fullName);
        starBtn.textContent = s ? "★ 已标星" : "⭐ 标星";
      } finally {
        starBtn.disabled = false;
      }
    };

    acts.appendChild(starBtn);
    row.dataset.starInjected = "1";
  }
};