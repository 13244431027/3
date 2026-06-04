plugin.id = "repo-file-fuzzy-search-only";
plugin.name = "仓库文件模糊搜索";
plugin.version = "1.1.0";

plugin.style = `
.rfs-bar{
  display:flex;
  gap:6px;
  align-items:center;
  padding:6px 8px;
  margin:6px;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:8px;
}
.rfs-input{
  flex:1;
  background:rgba(0,0,0,0.3);
  border:1px solid #555;
  color:#fff;
  padding:5px 8px;
  border-radius:6px;
  font-size:12px;
}
.rfs-btn{
  background:rgba(120,160,255,0.25);
  border:1px solid rgba(120,160,255,0.45);
  color:#fff;
  padding:5px 9px;
  border-radius:6px;
  font-size:12px;
  cursor:pointer;
}
.rfs-btn:hover{
  background:rgba(120,160,255,0.35);
}
.rfs-count{
  font-size:11px;
  opacity:0.75;
  white-space:nowrap;
}
.rfs-results{
  margin:0 6px 8px 6px;
  max-height:280px;
  overflow-y:auto;
}
.rfs-item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  margin-bottom:6px;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:6px;
}
.rfs-item:hover{
  background:rgba(255,255,255,0.07);
}
.rfs-path{
  font-size:12px;
  word-break:break-all;
  flex:1;
}
.rfs-path b{
  color:#8af;
  background:rgba(120,160,255,0.18);
  border-radius:3px;
}
.rfs-score{
  font-size:10px;
  opacity:0.45;
  margin-left:6px;
}
.rfs-empty{
  opacity:0.65;
  font-size:12px;
  padding:10px;
}
`;

plugin.init = (context) => {
  plugin._ctx = context;
  plugin._treeCacheKey = "";
  plugin._treeCache = [];
  plugin._treeTruncated = false;
  plugin._searchTimer = null;
};

plugin.onHook = (hook, data) => {
  const ctx = plugin._ctx;
  if (!ctx) return;

  if (hook === "dir:load") {
    setTimeout(() => {
      injectSearchBar(ctx);
    }, 50);
  }
};

function injectSearchBar(ctx) {
  const { ui } = ctx;
  const main = ui.mainArea;
  if (!main) return;

  if (main.querySelector(".rfs-bar")) return;

  const bar = document.createElement("div");
  bar.className = "rfs-bar";

  const input = document.createElement("input");
  input.className = "rfs-input";
  input.placeholder = "模糊搜索仓库文件，例如：readme / src api / indx js";

  const btn = document.createElement("button");
  btn.className = "rfs-btn";
  btn.textContent = "搜索";

  const clearBtn = document.createElement("button");
  clearBtn.className = "rfs-btn";
  clearBtn.textContent = "清空";

  const count = document.createElement("div");
  count.className = "rfs-count";
  count.textContent = "";

  bar.appendChild(input);
  bar.appendChild(btn);
  bar.appendChild(clearBtn);
  bar.appendChild(count);

  main.insertBefore(bar, main.firstChild);

  const resultsBox = document.createElement("div");
  resultsBox.className = "rfs-results";
  bar.after(resultsBox);

  const doSearch = () => {
    runRepoFileSearch(ctx, input.value.trim(), resultsBox, count);
  };

  btn.onclick = doSearch;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  input.addEventListener("input", () => {
    clearTimeout(plugin._searchTimer);
    plugin._searchTimer = setTimeout(() => {
      doSearch();
    }, 280);
  });

  clearBtn.onclick = () => {
    input.value = "";
    count.textContent = "";
    resultsBox.innerHTML = "";
  };
}

async function runRepoFileSearch(ctx, query, resultsBox, count) {
  const { core, api } = ctx;

  resultsBox.innerHTML = "";

  if (!query) {
    count.textContent = "";
    return;
  }

  if (!core.currentOwner || !core.currentRepo) {
    count.textContent = "未进入仓库";
    return;
  }

  count.textContent = "加载文件树...";

  try {
    const owner = core.currentOwner;
    const repo = core.currentRepo;
    const branch = core.currentBranch || core.defaultBranch || "main";

    const cacheKey = `${owner}/${repo}@${branch}`;

    if (plugin._treeCacheKey !== cacheKey) {
      const url =
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;

      const treeData = await api.fetchJson(url);

      plugin._treeCache = (treeData.tree || [])
        .filter(item => item.type === "blob")
        .map(item => {
          const path = item.path || "";
          const name = path.split("/").pop() || path;
          return {
            path,
            name,
            sha: item.sha,
            size: item.size || 0,
            lowerPath: path.toLowerCase(),
            lowerName: name.toLowerCase()
          };
        });

      plugin._treeCacheKey = cacheKey;
      plugin._treeTruncated = !!treeData.truncated;
    }

    const results = fuzzySearchFiles(plugin._treeCache, query)
      .slice(0, 200);

    count.textContent =
      `${results.length} 个结果` +
      (plugin._treeTruncated ? "，文件树已截断" : "");

    if (results.length === 0) {
      resultsBox.innerHTML = `<div class="rfs-empty">没有找到匹配文件。</div>`;
      return;
    }

    renderResults(ctx, results, query, resultsBox);

  } catch (e) {
    count.textContent = "搜索失败";
    resultsBox.innerHTML =
      `<div class="rfs-empty">搜索失败：${escapeHtml(e.message || e)}</div>`;
  }
}

function fuzzySearchFiles(files, query) {
  const rawQuery = String(query || "").trim().toLowerCase();

  if (!rawQuery) return [];

  const keywords = rawQuery
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const scored = [];

  for (const file of files) {
    let totalScore = 0;
    let allMatched = true;
    let highlightIndexes = new Set();

    for (const key of keywords) {
      const result = scoreOneKeyword(file, key);

      if (!result.matched) {
        allMatched = false;
        break;
      }

      totalScore += result.score;

      if (result.indexes) {
        result.indexes.forEach(i => highlightIndexes.add(i));
      }
    }

    if (allMatched) {
      scored.push({
        ...file,
        score: totalScore,
        highlightIndexes: Array.from(highlightIndexes)
      });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    const an = a.path.length;
    const bn = b.path.length;
    return an - bn;
  });

  return scored;
}

function scoreOneKeyword(file, key) {
  const path = file.lowerPath;
  const name = file.lowerName;

  // 1. 文件名完全相等，最高优先
  if (name === key) {
    return {
      matched: true,
      score: 10000,
      indexes: indexesOfSubstr(file.path, file.path.length - file.name.length, key.length)
    };
  }

  // 2. 文件名开头匹配
  if (name.startsWith(key)) {
    const start = file.path.length - file.name.length;
    return {
      matched: true,
      score: 8500 - file.name.length,
      indexes: indexesOfSubstr(file.path, start, key.length)
    };
  }

  // 3. 路径中连续包含
  const pathIndex = path.indexOf(key);
  if (pathIndex >= 0) {
    const inName = name.indexOf(key) >= 0;
    return {
      matched: true,
      score: inName ? 7000 - pathIndex : 5200 - pathIndex,
      indexes: indexesOfSubstr(file.path, pathIndex, key.length)
    };
  }

  // 4. 子序列模糊匹配，例如 rme -> README.md
  const seqName = subsequenceScore(file.name, key, file.path.length - file.name.length);
  if (seqName.matched) {
    return {
      matched: true,
      score: 4300 + seqName.score,
      indexes: seqName.indexes
    };
  }

  const seqPath = subsequenceScore(file.path, key, 0);
  if (seqPath.matched) {
    return {
      matched: true,
      score: 3000 + seqPath.score,
      indexes: seqPath.indexes
    };
  }

  // 5. 简单拼写误差匹配，只对文件名做，避免太慢
  // 例如 redme 接近 readme
  if (key.length >= 4) {
    const baseName = name.replace(/\.[^.]+$/, "");
    const dist = levenshteinLimited(baseName, key, 2);

    if (dist <= 2) {
      return {
        matched: true,
        score: 2200 - dist * 350,
        indexes: []
      };
    }
  }

  return {
    matched: false,
    score: 0,
    indexes: []
  };
}

function subsequenceScore(text, query, globalOffset) {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();

  let ti = 0;
  let qi = 0;
  const indexes = [];
  let score = 0;
  let lastIndex = -1;
  let consecutive = 0;

  while (ti < lower.length && qi < q.length) {
    if (lower[ti] === q[qi]) {
      indexes.push(globalOffset + ti);

      // 连续匹配加分
      if (lastIndex >= 0 && ti === lastIndex + 1) {
        consecutive++;
        score += 35 + consecutive * 5;
      } else {
        consecutive = 0;
        score += 15;
      }

      // 单词边界加分：/, -, _, ., 大写前
      const prev = text[ti - 1];
      if (
        ti === 0 ||
        prev === "/" ||
        prev === "-" ||
        prev === "_" ||
        prev === "." ||
        prev === " "
      ) {
        score += 25;
      }

      lastIndex = ti;
      qi++;
    }

    ti++;
  }

  if (qi !== q.length) {
    return {
      matched: false,
      score: 0,
      indexes: []
    };
  }

  // 匹配跨度越短越好
  const span = indexes[indexes.length - 1] - indexes[0] + 1;
  score += Math.max(0, 120 - span);

  // 越靠前越好
  score += Math.max(0, 80 - indexes[0]);

  return {
    matched: true,
    score,
    indexes
  };
}

function indexesOfSubstr(text, start, len) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(start + i);
  }
  return arr;
}

function renderResults(ctx, results, query, resultsBox) {
  resultsBox.innerHTML = "";

  results.forEach(item => {
    const row = document.createElement("div");
    row.className = "rfs-item";

    const pathEl = document.createElement("div");
    pathEl.className = "rfs-path";
    pathEl.innerHTML = highlightByIndexes(item.path, item.highlightIndexes);

    const scoreEl = document.createElement("span");
    scoreEl.className = "rfs-score";
    scoreEl.textContent = `score:${Math.round(item.score)}`;
    pathEl.appendChild(scoreEl);

    const openBtn = ctx.components.createWindowButton("打开");
    openBtn.onclick = () => {
      openFileByPath(ctx, item.path);
    };

    row.appendChild(pathEl);
    row.appendChild(openBtn);
    resultsBox.appendChild(row);
  });
}

async function openFileByPath(ctx, path) {
  const { core, api, extension } = ctx;

  try {
    const owner = core.currentOwner;
    const repo = core.currentRepo;
    const branch = core.currentBranch || core.defaultBranch || "main";

    const safePath = encodeURIComponent(path).replace(/%2F/g, "/");

    const meta = await api.fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/contents/${safePath}?ref=${encodeURIComponent(branch)}`
    );

    if (Array.isArray(meta)) {
      alert("这是目录，不是文件");
      return;
    }

    extension.openFile(meta);

  } catch (e) {
    alert("打开文件失败：" + (e.message || e));
  }
}

function highlightByIndexes(text, indexes) {
  const set = new Set(indexes || []);
  let html = "";

  for (let i = 0; i < text.length; i++) {
    const ch = escapeHtml(text[i]);

    if (set.has(i)) {
      html += `<b>${ch}</b>`;
    } else {
      html += ch;
    }
  }

  return html;
}

function levenshteinLimited(a, b, limit) {
  a = String(a || "");
  b = String(b || "");

  if (Math.abs(a.length - b.length) > limit) {
    return limit + 1;
  }

  const prev = [];
  const curr = [];

  for (let j = 0; j <= b.length; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );

      if (curr[j] < rowMin) rowMin = curr[j];
    }

    if (rowMin > limit) {
      return limit + 1;
    }

    for (let j = 0; j <= b.length; j++) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}