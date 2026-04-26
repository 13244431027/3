// ==================== Repo Packer (Deploy) Plugin ====================
// 将仓库部署为网页：GitHub Pages 管理、静态站点部署、Actions 部署

plugin.id = "repo-packer-deploy";
plugin.name = "Repo Packer - 仓库部署器";
plugin.version = "1.0.0";

plugin.style = `
  .rpd-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); z-index: 100001;
    display: flex; justify-content: center; align-items: center;
  }
  .rpd-card {
    width: 640px; max-height: 88vh; background: #1a1a2e;
    border: 1px solid #555; border-radius: 12px;
    display: flex; flex-direction: column; padding: 20px; color: #fff;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6); overflow-y: auto;
  }
  .rpd-card h3 { margin: 0 0 14px 0; font-size: 16px; display: flex; align-items: center; gap: 8px; }
  .rpd-section {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 14px; margin-bottom: 12px;
  }
  .rpd-section-title {
    font-size: 13px; font-weight: bold; margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .rpd-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; }
  .rpd-input {
    background: rgba(0,0,0,0.4); border: 1px solid #555; color: #fff;
    padding: 6px 8px; border-radius: 4px; font-size: 12px; flex: 1;
  }
  .rpd-select {
    background: rgba(0,0,0,0.4); border: 1px solid #555; color: #fff;
    padding: 6px 8px; border-radius: 4px; font-size: 12px;
  }
  .rpd-btn {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px; color: #fff; padding: 7px 14px; cursor: pointer;
    font-size: 12px; transition: background 0.2s; white-space: nowrap;
  }
  .rpd-btn:hover { background: rgba(255,255,255,0.2); }
  .rpd-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .rpd-btn-green { background: rgba(40,167,69,0.4); }
  .rpd-btn-blue { background: rgba(60,120,255,0.3); }
  .rpd-btn-orange { background: rgba(255,165,0,0.3); }
  .rpd-btn-red { background: rgba(255,80,80,0.3); }
  .rpd-btn-purple { background: rgba(150,100,255,0.3); }
  .rpd-status {
    padding: 10px; border-radius: 6px; font-size: 12px;
    margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
  }
  .rpd-status-ok { background: rgba(40,167,69,0.15); border: 1px solid rgba(40,167,69,0.3); }
  .rpd-status-warn { background: rgba(255,165,0,0.15); border: 1px solid rgba(255,165,0,0.3); }
  .rpd-status-err { background: rgba(255,80,80,0.15); border: 1px solid rgba(255,80,80,0.3); }
  .rpd-status-none { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
  .rpd-log {
    background: #111; border: 1px solid #444; border-radius: 6px;
    padding: 10px; font-family: monospace; font-size: 11px;
    max-height: 180px; overflow-y: auto; white-space: pre-wrap;
    word-break: break-all; color: #aaa; margin-top: 8px;
  }
  .rpd-link { color: #8af; text-decoration: underline; cursor: pointer; font-size: 12px; }
  .rpd-badge {
    display: inline-block; padding: 2px 8px; border-radius: 10px;
    font-size: 11px; font-weight: bold;
  }
  .rpd-badge-green { background: #28a745; color: #fff; }
  .rpd-badge-yellow { background: #ffc107; color: #000; }
  .rpd-badge-red { background: #dc3545; color: #fff; }
  .rpd-badge-gray { background: #666; color: #fff; }
  .rpd-template-card {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 10px; margin-bottom: 8px; cursor: pointer;
    transition: background 0.2s;
  }
  .rpd-template-card:hover { background: rgba(255,255,255,0.1); }
  .rpd-template-name { font-weight: bold; font-size: 13px; }
  .rpd-template-desc { font-size: 11px; opacity: 0.7; margin-top: 4px; }
`;

plugin.init = (ctx) => {
  plugin._ctx = ctx;
  plugin._log = [];

  if (ctx.ui && ctx.ui.tabs) {
    plugin._addTabButton();
  }
};

plugin.onHook = (hookName, data) => {
  if (hookName === "ui:ready") {
    plugin._addTabButton();
  }
};

plugin._addTabButton = () => {
  const { ui, components } = plugin._ctx;
  if (!ui || !ui.tabs) return;
  if (document.getElementById("rpd-tab-btn")) return;
  const btn = components.createWindowButton("🚀 部署");
  btn.id = "rpd-tab-btn";
  btn.onclick = () => plugin._showDeployUI();
  ui.tabs.appendChild(btn);
};

// ==================== 日志 ====================

plugin._appendLog = (msg, logEl) => {
  const ts = new Date().toLocaleTimeString();
  const line = `[${ts}] ${msg}`;
  plugin._log.push(line);
  if (logEl) {
    logEl.textContent = plugin._log.join("\n");
    logEl.scrollTop = logEl.scrollHeight;
  }
};

// ==================== GitHub API 封装 ====================

plugin._apiGet = async (path) => {
  const { core } = plugin._ctx;
  const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(core.token ? { Authorization: `token ${core.token}` } : {})
    }
  });
  return res;
};

plugin._apiRequest = async (method, path, body) => {
  const { core } = plugin._ctx;
  const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      ...(core.token ? { Authorization: `token ${core.token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res;
};

// ==================== 获取 Pages 状态 ====================

plugin._fetchPagesStatus = async () => {
  const { core } = plugin._ctx;
  const res = await plugin._apiGet(`/repos/${core.currentOwner}/${core.currentRepo}/pages`);
  if (res.status === 404) return { enabled: false };
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return {
    enabled: true,
    url: data.html_url || data.url,
    status: data.status,
    cname: data.cname,
    source: data.source,
    https: data.https_enforced,
    build_type: data.build_type,
    raw: data
  };
};

// ==================== 获取最近部署 ====================

plugin._fetchDeployments = async () => {
  const { core } = plugin._ctx;
  const res = await plugin._apiGet(
    `/repos/${core.currentOwner}/${core.currentRepo}/pages/deployments`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

// ==================== 获取 Actions Workflows ====================

plugin._fetchWorkflows = async () => {
  const { core } = plugin._ctx;
  const res = await plugin._apiGet(
    `/repos/${core.currentOwner}/${core.currentRepo}/actions/workflows`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.workflows || [];
};

// ==================== 获取 Actions Runs ====================

plugin._fetchWorkflowRuns = async () => {
  const { core } = plugin._ctx;
  const res = await plugin._apiGet(
    `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs?per_page=10`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.workflow_runs || [];
};

// ==================== 主 UI ====================

plugin._showDeployUI = async () => {
  const { core } = plugin._ctx;

  if (!core.currentOwner || !core.currentRepo) {
    alert("请先进入一个仓库");
    return;
  }
  if (!core.token) {
    alert("请先设置 GitHub Token（部署操作需要写权限）");
    return;
  }

  const old = document.querySelector(".rpd-overlay");
  if (old) old.remove();
  plugin._log = [];

  const overlay = document.createElement("div");
  overlay.className = "rpd-overlay";

  const card = document.createElement("div");
  card.className = "rpd-card";

  // 标题
  const title = document.createElement("h3");
  title.innerHTML = `🚀 仓库部署 — <span style="color:#8af">${core.currentOwner}/${core.currentRepo}</span>`;
  card.appendChild(title);

  // 状态区
  const statusSection = document.createElement("div");
  statusSection.className = "rpd-section";
  const statusTitle = document.createElement("div");
  statusTitle.className = "rpd-section-title";
  statusTitle.textContent = "📊 Pages 状态";
  const statusBox = document.createElement("div");
  statusBox.className = "rpd-status rpd-status-none";
  statusBox.textContent = "正在检测...";
  statusSection.appendChild(statusTitle);
  statusSection.appendChild(statusBox);
  card.appendChild(statusSection);

  // Pages 管理区
  const pagesSection = document.createElement("div");
  pagesSection.className = "rpd-section";
  const pagesTitle = document.createElement("div");
  pagesTitle.className = "rpd-section-title";
  pagesTitle.textContent = "⚙️ GitHub Pages 管理";
  pagesSection.appendChild(pagesTitle);

  const pagesRow1 = document.createElement("div");
  pagesRow1.className = "rpd-row";

  const sourceSelect = document.createElement("select");
  sourceSelect.className = "rpd-select";
  [
    { value: "main|/", text: "main 分支 / 根目录" },
    { value: "main|/docs", text: "main 分支 / docs 目录" },
    { value: "gh-pages|/", text: "gh-pages 分支 / 根目录" },
    { value: "master|/", text: "master 分支 / 根目录" },
    { value: "master|/docs", text: "master 分支 / docs 目录" }
  ].forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.text;
    sourceSelect.appendChild(opt);
  });

  const enableBtn = document.createElement("button");
  enableBtn.className = "rpd-btn rpd-btn-green";
  enableBtn.textContent = "启用 Pages";

  const updateBtn = document.createElement("button");
  updateBtn.className = "rpd-btn rpd-btn-blue";
  updateBtn.textContent = "更新配置";

  const disableBtn = document.createElement("button");
  disableBtn.className = "rpd-btn rpd-btn-red";
  disableBtn.textContent = "关闭 Pages";

  const visitBtn = document.createElement("button");
  visitBtn.className = "rpd-btn rpd-btn-purple";
  visitBtn.textContent = "访问站点";
  visitBtn.disabled = true;

  pagesRow1.appendChild(sourceSelect);
  pagesRow1.appendChild(enableBtn);
  pagesRow1.appendChild(updateBtn);
  pagesRow1.appendChild(disableBtn);
  pagesRow1.appendChild(visitBtn);
  pagesSection.appendChild(pagesRow1);

  // CNAME
  const pagesRow2 = document.createElement("div");
  pagesRow2.className = "rpd-row";
  const cnameInput = document.createElement("input");
  cnameInput.className = "rpd-input";
  cnameInput.placeholder = "自定义域名 (可选, 如 example.com)";
  cnameInput.style.flex = "1";
  const cnameBtn = document.createElement("button");
  cnameBtn.className = "rpd-btn rpd-btn-orange";
cnameBtn.textContent = "设置 CNAME";
  pagesRow2.appendChild(cnameInput);
  pagesRow2.appendChild(cnameBtn);
  pagesSection.appendChild(pagesRow2);

  card.appendChild(pagesSection);

  // gh-pages 分支快速创建区
  const branchSection = document.createElement("div");
  branchSection.className = "rpd-section";
  const branchTitle = document.createElement("div");
  branchTitle.className = "rpd-section-title";
  branchTitle.textContent = "🌿 gh-pages 分支管理";
  branchSection.appendChild(branchTitle);

  const branchRow = document.createElement("div");
  branchRow.className = "rpd-row";

  const createGhPagesBtn = document.createElement("button");
  createGhPagesBtn.className = "rpd-btn rpd-btn-green";
  createGhPagesBtn.textContent = "创建 gh-pages 分支";

  const createEmptyGhPagesBtn = document.createElement("button");
  createEmptyGhPagesBtn.className = "rpd-btn rpd-btn-blue";
  createEmptyGhPagesBtn.textContent = "创建空 gh-pages (含 index.html)";

  const checkGhPagesBtn = document.createElement("button");
  checkGhPagesBtn.className = "rpd-btn";
  checkGhPagesBtn.textContent = "检测 gh-pages 是否存在";

  branchRow.appendChild(createGhPagesBtn);
  branchRow.appendChild(createEmptyGhPagesBtn);
  branchRow.appendChild(checkGhPagesBtn);
  branchSection.appendChild(branchRow);
  card.appendChild(branchSection);

  // 快速部署模板区
  const templateSection = document.createElement("div");
  templateSection.className = "rpd-section";
  const templateTitle = document.createElement("div");
  templateTitle.className = "rpd-section-title";
  templateTitle.textContent = "📄 快速部署模板";
  templateSection.appendChild(templateTitle);

  const templates = [
    {
      name: "空白 HTML 页面",
      desc: "创建一个最基础的 index.html 到指定分支",
      files: [
        {
          path: "index.html",
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__REPO__</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9;
           display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .container { text-align: center; padding: 40px; }
    h1 { font-size: 2.5em; margin-bottom: 16px; background: linear-gradient(135deg, #58a6ff, #3fb950);
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { font-size: 1.1em; opacity: 0.8; margin-bottom: 24px; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>__REPO__</h1>
    <p>GitHub Pages 已成功部署！</p>
    <a href="https://github.com/__OWNER__/__REPO__">返回仓库</a>
  </div>
</body>
</html>`
        }
      ]
    },
    {
      name: "静态文档站点",
      desc: "创建带导航的多页文档站点骨架",
      files: [
        {
          path: "index.html",
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__REPO__ - 文档</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
    nav { background: #161b22; padding: 12px 24px; border-bottom: 1px solid #30363d;
          display: flex; align-items: center; gap: 20px; }
    nav a { color: #58a6ff; text-decoration: none; font-size: 14px; }
    nav a:hover { text-decoration: underline; }
    nav .brand { font-weight: bold; font-size: 16px; color: #fff; }
    .main { max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { margin-bottom: 16px; }
    h2 { margin: 24px 0 12px 0; color: #58a6ff; }
    p { line-height: 1.7; margin-bottom: 12px; }
    code { background: #161b22; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #161b22; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0; }
    footer { text-align: center; padding: 40px; opacity: 0.5; font-size: 12px; }
  </style>
</head>
<body>
  <nav>
    <span class="brand">__REPO__</span>
    <a href="index.html">首页</a>
    <a href="guide.html">指南</a>
    <a href="https://github.com/__OWNER__/__REPO__">GitHub</a>
  </nav>
  <div class="main">
    <h1>欢迎使用 __REPO__</h1>
    <p>这是自动生成的文档站点。</p>
    <h2>快速开始</h2>
    <p>请编辑此页面来添加你的项目文档。</p>
    <pre><code>git clone https://github.com/__OWNER__/__REPO__.git</code></pre>
  </div>
  <footer>Powered by GitHub Pages</footer>
</body>
</html>`
        },
        {
          path: "guide.html",
          content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>指南 - __REPO__</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
    nav { background: #161b22; padding: 12px 24px; border-bottom: 1px solid #30363d;
          display: flex; align-items: center; gap: 20px; }
    nav a { color: #58a6ff; text-decoration: none; font-size: 14px; }
    nav .brand { font-weight: bold; font-size: 16px; color: #fff; }
    .main { max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { margin-bottom: 16px; }
    h2 { margin: 24px 0 12px 0; color: #58a6ff; }
    p { line-height: 1.7; margin-bottom: 12px; }
  </style>
</head>
<body>
  <nav>
    <span class="brand">__REPO__</span>
    <a href="index.html">首页</a>
    <a href="guide.html">指南</a>
  </nav>
  <div class="main">
    <h1>使用指南</h1>
    <h2>安装</h2>
    <p>在这里描述安装步骤。</p>
    <h2>配置</h2>
    <p>在这里描述配置方法。</p>
    <h2>使用</h2>
    <p>在这里描述使用方法。</p>
  </div>
</body>
</html>`
        }
      ]
    },
    {
      name: "GitHub Actions 静态部署",
      desc: "创建 .github/workflows/deploy.yml，用 Actions 自动部署到 Pages",
      files: [
        {
          path: ".github/workflows/deploy.yml",
          content: `name: Deploy to GitHub Pages

on:
  push:
    branches: [ "__BRANCH__" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`
        }
      ]
    },
    {
      name: "Jekyll 最小配置",
      desc: "创建 _config.yml + index.md，启用 Jekyll 构建",
      files: [
        {
          path: "_config.yml",
          content: `title: __REPO__
description: __REPO__ documentation site
theme: jekyll-theme-cayman
baseurl: "/__REPO__"
url: "https://__OWNER__.github.io"
`
        },
        {
          path: "index.md",
          content: `---
layout: default
title: Home
---

# __REPO__

欢迎！这是由 Jekyll 构建的 GitHub Pages 站点。

## 快速开始

\`\`\`bash
git clone https://github.com/__OWNER__/__REPO__.git
\`\`\`

## 链接

- [GitHub 仓库](https://github.com/__OWNER__/__REPO__)
`
        }
      ]
    }
  ];

  templates.forEach(tpl => {
    const tplCard = document.createElement("div");
    tplCard.className = "rpd-template-card";
    tplCard.innerHTML = `<div class="rpd-template-name">${tpl.name}</div>
      <div class="rpd-template-desc">${tpl.desc} (${tpl.files.length} 个文件)</div>`;
    tplCard.onclick = () => plugin._deployTemplate(tpl, logEl);
    templateSection.appendChild(tplCard);
  });

  card.appendChild(templateSection);

  // Actions 区
  const actionsSection = document.createElement("div");
  actionsSection.className = "rpd-section";
  const actionsTitle = document.createElement("div");
  actionsTitle.className = "rpd-section-title";
  actionsTitle.textContent = "🔄 Actions Workflows";
  actionsSection.appendChild(actionsTitle);

  const actionsRow = document.createElement("div");
  actionsRow.className = "rpd-row";

  const loadWfBtn = document.createElement("button");
  loadWfBtn.className = "rpd-btn rpd-btn-blue";
  loadWfBtn.textContent = "加载 Workflows";

  const loadRunsBtn = document.createElement("button");
  loadRunsBtn.className = "rpd-btn";
  loadRunsBtn.textContent = "最近运行记录";

  actionsRow.appendChild(loadWfBtn);
  actionsRow.appendChild(loadRunsBtn);
  actionsSection.appendChild(actionsRow);

  const actionsListDiv = document.createElement("div");
  actionsListDiv.style.marginTop = "8px";
  actionsSection.appendChild(actionsListDiv);

  card.appendChild(actionsSection);

  // 日志区
  const logEl = document.createElement("div");
  logEl.className = "rpd-log";
  logEl.textContent = "就绪，等待操作...";
  card.appendChild(logEl);

  // 底部
  const bottomRow = document.createElement("div");
  bottomRow.className = "rpd-row";
  bottomRow.style.marginTop = "10px";

  const refreshBtn = document.createElement("button");
  refreshBtn.className = "rpd-btn rpd-btn-blue";
  refreshBtn.textContent = "刷新状态";

  const closeBtn = document.createElement("button");
  closeBtn.className = "rpd-btn rpd-btn-red";
  closeBtn.textContent = "关闭";
  closeBtn.style.marginLeft = "auto";

  bottomRow.appendChild(refreshBtn);
  bottomRow.appendChild(closeBtn);
  card.appendChild(bottomRow);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // ==================== 事件绑定 ====================

  closeBtn.onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  // 刷新状态
  const refreshStatus = async () => {
    statusBox.className = "rpd-status rpd-status-none";
    statusBox.textContent = "检测中...";
    try {
      const st = await plugin._fetchPagesStatus();
      if (!st.enabled) {
        statusBox.className = "rpd-status rpd-status-warn";
        statusBox.innerHTML = `<span class="rpd-badge rpd-badge-yellow">未启用</span> GitHub Pages 尚未启用`;
        visitBtn.disabled = true;
      } else {
        const badge = st.status === "built"
          ? '<span class="rpd-badge rpd-badge-green">已部署</span>'
          : st.status === "building"
            ? '<span class="rpd-badge rpd-badge-yellow">构建中</span>'
            : `<span class="rpd-badge rpd-badge-gray">${st.status || "unknown"}</span>`;

        const sourceInfo = st.source
          ? `源: ${st.source.branch}/${st.source.path || "/"}`
          : "";
        const buildInfo = st.build_type ? ` | 构建: ${st.build_type}` : "";
        const cnameInfo = st.cname ? ` | CNAME: ${st.cname}` : "";

        statusBox.className = "rpd-status rpd-status-ok";
        statusBox.innerHTML = `${badge} <a class="rpd-link" target="_blank" href="${st.url}">${st.url}</a>
          <br><span style="font-size:11px;opacity:0.7">${sourceInfo}${buildInfo}${cnameInfo}</span>`;

        visitBtn.disabled = false;
        visitBtn.onclick = () => window.open(st.url, "_blank");

        if (st.cname) cnameInput.value = st.cname;
        if (st.source) {
          const sv = `${st.source.branch}|${st.source.path || "/"}`;
          for (const opt of sourceSelect.options) {
            if (opt.value === sv) { sourceSelect.value = sv; break; }
          }
        }
      }
      plugin._appendLog("Pages 状态检测完成", logEl);
    } catch (e) {
      statusBox.className = "rpd-status rpd-status-err";
      statusBox.textContent = "检测失败: " + e.message;
      plugin._appendLog("状态检测失败: " + e.message, logEl);
    }
  };

  refreshBtn.onclick = refreshStatus;

  // 启用 Pages
  enableBtn.onclick = async () => {
    try {
      enableBtn.disabled = true;
      const [branch, path] = sourceSelect.value.split("|");
      plugin._appendLog(`正在启用 Pages (source: ${branch} ${path})...`, logEl);

      const res = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/pages`,
        { source: { branch, path } }
      );

      if (res.status === 201 || res.status === 200) {
        plugin._appendLog("Pages 启用成功！", logEl);
        alert("GitHub Pages 已启用！可能需要几分钟才能生效。");
        await refreshStatus();
      } else if (res.status === 409) {
        plugin._appendLog("Pages 已经启用，尝试更新配置...", logEl);
        await plugin._updatePagesSource(branch, path, logEl);
        await refreshStatus();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      plugin._appendLog("启用失败: " + e.message, logEl);
      alert("启用失败: " + e.message);
    } finally {
      enableBtn.disabled = false;
    }
  };

  // 更新 Pages 配置
  updateBtn.onclick = async () => {
    try {
      updateBtn.disabled = true;
      const [branch, path] = sourceSelect.value.split("|");
      await plugin._updatePagesSource(branch, path, logEl);
      await refreshStatus();
      alert("Pages 配置已更新！");
    } catch (e) {
      plugin._appendLog("更新失败: " + e.message, logEl);
      alert("更新失败: " + e.message);
    } finally {
      updateBtn.disabled = false;
    }
  };

  // 关闭 Pages
  disableBtn.onclick = async () => {
    if (!confirm("确定要关闭 GitHub Pages 吗？站点将不再可访问。")) return;
    try {
      disableBtn.disabled = true;
      plugin._appendLog("正在关闭 Pages...", logEl);

      const res = await plugin._apiRequest(
        "DELETE",
        `/repos/${core.currentOwner}/${core.currentRepo}/pages`
      );

      if (res.status === 204 || res.ok) {
        plugin._appendLog("Pages 已关闭", logEl);
        alert("GitHub Pages 已关闭。");
        await refreshStatus();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      plugin._appendLog("关闭失败: " + e.message, logEl);
      alert("关闭失败: " + e.message);
    } finally {
      disableBtn.disabled = false;
    }
  };

  // 设置 CNAME
  cnameBtn.onclick = async () => {
    const cname = cnameInput.value.trim();
    try {
      cnameBtn.disabled = true;

      if (cname) {
        plugin._appendLog(`正在设置 CNAME: ${cname}`, logEl);
        // 通过创建/更新 CNAME 文件实现
        const [branch] = sourceSelect.value.split("|");
        const targetBranch = branch || core.currentBranch || core.defaultBranch;
        const cnameContent = btoa(cname + "\n");

        // 尝试获取已有 CNAME 文件的 sha
        let sha = null;
        try {
          const existing = await plugin._apiGet(
            `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME?ref=${targetBranch}`
          );
          if (existing.ok) {
            const data = await existing.json();
            sha = data.sha;
          }
        } catch (e) { /* 文件不存在 */ }

        const body = {
          message: `Set CNAME to ${cname}`,
          content: cnameContent,
          branch: targetBranch
        };
        if (sha) body.sha = sha;

        const res = await plugin._apiRequest(
          "PUT",
          `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME`,
          body
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }

        plugin._appendLog("CNAME 设置成功", logEl);
        alert(`CNAME 已设置为 ${cname}`);
      } else {
        // 删除 CNAME
        plugin._appendLog("正在删除 CNAME...", logEl);
        const [branch] = sourceSelect.value.split("|");
        const targetBranch = branch || core.currentBranch || core.defaultBranch;

        try {
          const existing = await plugin._apiGet(
            `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME?ref=${targetBranch}`
          );
          if (existing.ok) {
            const data = await existing.json();
            await plugin._apiRequest(
              "DELETE",
              `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME`,
              { message: "Remove CNAME", sha: data.sha, branch: targetBranch }
            );
            plugin._appendLog("CNAME 已删除", logEl);
            alert("CNAME 已删除");
          } else {
            plugin._appendLog("CNAME 文件不存在", logEl);
          }
        } catch (e) {
          throw new Error("删除 CNAME 失败: " + e.message);
        }
      }
      await refreshStatus();
    } catch (e) {
      plugin._appendLog("CNAME 操作失败: " + e.message, logEl);
      alert("操作失败: " + e.message);
    } finally {
      cnameBtn.disabled = false;
    }
  };

  // 检测 gh-pages 分支
  checkGhPagesBtn.onclick = async () => {
    try {
      checkGhPagesBtn.disabled = true;
      plugin._appendLog("检测 gh-pages 分支...", logEl);

      const res = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/branches/gh-pages`
      );

      if (res.ok) {
        const data = await res.json();
        plugin._appendLog(`gh-pages 分支存在，最新 SHA: ${data.commit.sha.substring(0, 7)}`, logEl);
        alert("gh-pages 分支存在！");
      } else if (res.status === 404) {
        plugin._appendLog("gh-pages 分支不存在", logEl);
        alert("gh-pages 分支不存在，可以点击创建。");
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      plugin._appendLog("检测失败: " + e.message, logEl);
    } finally {
      checkGhPagesBtn.disabled = false;
    }
  };

  // 基于当前分支创建 gh-pages
  createGhPagesBtn.onclick = async () => {
    try {
      createGhPagesBtn.disabled = true;
      const baseBranch = core.currentBranch || core.defaultBranch || "main";
      plugin._appendLog(`基于 ${baseBranch} 创建 gh-pages 分支...`, logEl);

      const refRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/git/ref/heads/${baseBranch}`
      );
      if (!refRes.ok) throw new Error("无法获取基础分支 ref");
      const refData = await refRes.json();
      const sha = refData.object.sha;

      const createRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/refs`,
        { ref: "refs/heads/gh-pages", sha }
      );

      if (createRes.status === 201) {
        plugin._appendLog("gh-pages 分支创建成功！", logEl);
        alert("gh-pages 分支已创建！现在可以启用 Pages 并选择 gh-pages 作为源。");
      } else if (createRes.status === 422) {
        plugin._appendLog("gh-pages 分支已存在", logEl);
        alert("gh-pages 分支已存在。");
      } else {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${createRes.status}`);
      }
    } catch (e) {
      plugin._appendLog("创建失败: " + e.message, logEl);
      alert("创建失败: " + e.message);
    } finally {
      createGhPagesBtn.disabled = false;
    }
  };

  // 创建空 gh-pages（含 index.html）
  createEmptyGhPagesBtn.onclick = async () => {
    try {
      createEmptyGhPagesBtn.disabled = true;
      plugin._appendLog("创建空 gh-pages 分支（含 index.html）...", logEl);

      // 先检查是否已存在
      const checkRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/branches/gh-pages`
      );
      if (checkRes.ok) {
        if (!confirm("gh-pages 分支已存在，是否直接往里面推送 index.html？")) {
          createEmptyGhPagesBtn.disabled = false;
          return;
        }
        // 直接推送文件
        await plugin._pushFileToGhPages(logEl);
        createEmptyGhPagesBtn.disabled = false;
        return;
      }

      // 创建孤立分支：先用 Tree API 创建空树 + commit + ref
      plugin._appendLog("使用 Git Data API 创建孤立 gh-pages 分支...", logEl);

      // 1. 创建 blob
      const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>${core.currentRepo}</title>
<style>body{font-family:system-ui;background:#0d1117;color:#c9d1d9;display:flex;justify-content:center;align-items:center;min-height:100vh}
.c{text-align:center}h1{color:#58a6ff;margin-bottom:12px}a{color:#58a6ff}</style></head>
<body><div class="c"><h1>${core.currentRepo}</h1><p>GitHub Pages 部署成功！</p>
<a href="https://github.com/${core.currentOwner}/${core.currentRepo}">返回仓库</a></div></body></html>`;

      const blobRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/blobs`,
        { content: indexHtml, encoding: "utf-8" }
      );
      if (!blobRes.ok) throw new Error("创建 blob 失败");
      const blobData = await blobRes.json();
      plugin._appendLog(`Blob SHA: ${blobData.sha.substring(0, 7)}`, logEl);

      // 2. 创建 tree
      const treeRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/trees`,
        {
          tree: [
            { path: "index.html", mode: "100644", type: "blob", sha: blobData.sha }
          ]
        }
      );
      if (!treeRes.ok) throw new Error("创建 tree 失败");
      const treeData = await treeRes.json();
      plugin._appendLog(`Tree SHA: ${treeData.sha.substring(0, 7)}`, logEl);

      // 3. 创建孤立 commit（无 parent）
      const commitRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/commits`,
        {
          message: "Initial gh-pages deployment",
          tree: treeData.sha,
          parents: []
        }
      );
      if (!commitRes.ok) throw new Error("创建 commit 失败");
      const commitData = await commitRes.json();
      plugin._appendLog(`Commit SHA: ${commitData.sha.substring(0, 7)}`, logEl);

      // 4. 创建 ref
      const refRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/refs`,
        { ref: "refs/heads/gh-pages", sha: commitData.sha }
      );
      if (!refRes.ok && refRes.status !== 422) {
        const err = await refRes.json().catch(() => ({}));
        throw new Error(err.message || "创建 ref 失败");
      }

      plugin._appendLog("空 gh-pages 分支创建成功！", logEl);
      alert("gh-pages 分支已创建并包含 index.html！\n现在可以启用 Pages 选择 gh-pages 分支。");
    } catch (e) {
      plugin._appendLog("创建失败: " + e.message, logEl);
      alert("创建失败: " + e.message);
    } finally {
      createEmptyGhPagesBtn.disabled = false;
    }
  };

  // 加载 Workflows
  loadWfBtn.onclick = async () => {
    try {
      loadWfBtn.disabled = true;
      plugin._appendLog("加载 Workflows...", logEl);
      actionsListDiv.innerHTML = "";

      const workflows = await plugin._fetchWorkflows();

      if (workflows.length === 0) {
        actionsListDiv.innerHTML = '<div style="font-size:12px;opacity:0.6;padding:8px">暂无 Workflow</div>';
        plugin._appendLog("未找到 Workflow", logEl);
      } else {
        workflows.forEach(wf => {
          const row = document.createElement("div");
          row.className = "rpd-row";
          row.style.padding = "6px";
          row.style.background = "rgba(255,255,255,0.03)";
          row.style.borderRadius = "6px";
          row.style.marginBottom = "4px";

          const info = document.createElement("div");
          info.style.flex = "1";
          info.style.fontSize = "12px";
          const stateBadge = wf.state === "active"
            ? '<span class="rpd-badge rpd-badge-green">active</span>'
            : `<span class="rpd-badge rpd-badge-gray">${wf.state}</span>`;
          info.innerHTML = `<b>${wf.name}</b> ${stateBadge}<br>
            <span style="opacity:0.6">${wf.path}</span>`;

          const triggerBtn = document.createElement("button");
          triggerBtn.className = "rpd-btn rpd-btn-orange";
          triggerBtn.textContent = "触发运行";
          triggerBtn.onclick = async () => {
            const branch = core.currentBranch || core.defaultBranch || "main";
            if (!confirm(`确定要在 ${branch} 分支上触发 ${wf.name} 吗？`)) return;
            try {
              triggerBtn.disabled = true;
              plugin._appendLog(`触发 Workflow: ${wf.name} (${branch})...`, logEl);

              const res = await plugin._apiRequest(
                "POST",
                `/repos/${core.currentOwner}/${core.currentRepo}/actions/workflows/${wf.id}/dispatches`,
                { ref: branch }
              );

              if (res.status === 204) {
                plugin._appendLog(`Workflow ${wf.name} 已触发！`, logEl);
                alert(`Workflow "${wf.name}" 已触发！请稍后查看运行记录。`);
              } else {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${res.status}`);
              }
            } catch (e) {
              plugin._appendLog("触发失败: " + e.message, logEl);
              alert("触发失败: " + e.message);
            } finally {
              triggerBtn.disabled = false;
            }
          };

          const viewBtn = document.createElement("button");
          viewBtn.className = "rpd-btn";
          viewBtn.textContent = "查看";
          viewBtn.onclick = () => window.open(wf.html_url, "_blank");

          row.appendChild(info);
          row.appendChild(triggerBtn);
          row.appendChild(viewBtn);
          actionsListDiv.appendChild(row);
        });
        plugin._appendLog(`加载了 ${workflows.length} 个 Workflow`, logEl);
      }
    } catch (e) {
      plugin._appendLog("加载 Workflows 失败: " + e.message, logEl);
    } finally {
      loadWfBtn.disabled = false;
    }
  };

  // 最近运行记录
  loadRunsBtn.onclick = async () => {
    try {
      loadRunsBtn.disabled = true;
      plugin._appendLog("加载最近运行记录...", logEl);
      actionsListDiv.innerHTML = "";

      const runs = await plugin._fetchWorkflowRuns();

      if (runs.length === 0) {
        actionsListDiv.innerHTML = '<div style="font-size:12px;opacity:0.6;padding:8px">暂无运行记录</div>';
        plugin._appendLog("未找到运行记录", logEl);
      } else {
        runs.forEach(run => {
          const row = document.createElement("div");
          row.className = "rpd-row";
          row.style.padding = "6px";
          row.style.background = "rgba(255,255,255,0.03)";
          row.style.borderRadius = "6px";
          row.style.marginBottom = "4px";

          let badge = "";
          switch (run.conclusion) {
            case "success":
              badge = '<span class="rpd-badge rpd-badge-green">success</span>';
              break;
            case "failure":
              badge = '<span class="rpd-badge rpd-badge-red">failure</span>';
              break;
            case "cancelled":
              badge = '<span class="rpd-badge rpd-badge-gray">cancelled</span>';
              break;
            default:
              if (run.status === "in_progress" || run.status === "queued") {
                badge = '<span class="rpd-badge rpd-badge-yellow">' + run.status + "</span>";
              } else {
                badge = '<span class="rpd-badge rpd-badge-gray">' + (run.conclusion || run.status || "unknown") + "</span>";
              }
          }

          const info = document.createElement("div");
          info.style.flex = "1";
          info.style.fontSize = "12px";
          const date = run.created_at ? run.created_at.replace("T", " ").replace("Z", "") : "";
          info.innerHTML = `<b>${run.name || "Workflow"}</b> ${badge}<br>
            <span style="opacity:0.6">#${run.run_number} · ${run.head_branch} · ${date}</span>`;

          const viewBtn = document.createElement("button");
          viewBtn.className = "rpd-btn";
          viewBtn.textContent = "详情";
          viewBtn.onclick = () => window.open(run.html_url, "_blank");

          const rerunBtn = document.createElement("button");
          rerunBtn.className = "rpd-btn rpd-btn-orange";
          rerunBtn.textContent = "重新运行";
          rerunBtn.onclick = async () => {
            try {
              rerunBtn.disabled = true;
              plugin._appendLog(`重新运行 #${run.run_number}...`, logEl);

              const res = await plugin._apiRequest(
                "POST",
                `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/rerun`
              );

              if (res.status === 201) {
                plugin._appendLog(`#${run.run_number} 已重新触发`, logEl);
                alert("已重新触发运行！");
              } else {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${res.status}`);
              }
            } catch (e) {
              plugin._appendLog("重新运行失败: " + e.message, logEl);
              alert("失败: " + e.message);
            } finally {
              rerunBtn.disabled = false;
            }
          };

          row.appendChild(info);
          row.appendChild(rerunBtn);
          row.appendChild(viewBtn);
          actionsListDiv.appendChild(row);
        });
        plugin._appendLog(`加载了 ${runs.length} 条运行记录`, logEl);
      }
    } catch (e) {
      plugin._appendLog("加载运行记录失败: " + e.message, logEl);
    } finally {
      loadRunsBtn.disabled = false;
    }
  };

  // 首次加载状态
  refreshStatus();
};

// ==================== 辅助方法 ====================

plugin._updatePagesSource = async (branch, path, logEl) => {
  const { core } = plugin._ctx;
  plugin._appendLog(`更新 Pages 源: ${branch} ${path}`, logEl);

  const res = await plugin._apiRequest(
    "PUT",
    `/repos/${core.currentOwner}/${core.currentRepo}/pages`,
    { source: { branch, path } }
  );

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  plugin._appendLog("Pages 源已更新", logEl);
};

plugin._pushFileToGhPages = async (logEl) => {
  const { core } = plugin._ctx;
  plugin._appendLog("向 gh-pages 推送 index.html...", logEl);

  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>${core.currentRepo}</title>
<style>body{font-family:system-ui;background:#0d1117;color:#c9d1d9;display:flex;justify-content:center;align-items:center;min-height:100vh}
.c{text-align:center}h1{color:#58a6ff;margin-bottom:12px}a{color:#58a6ff}</style></head>
<body><div class="c"><h1>${core.currentRepo}</h1><p>GitHub Pages 部署成功！</p>
<a href="https://github.com/${core.currentOwner}/${core.currentRepo}">返回仓库</a></div></body></html>`;

  const content = btoa(unescape(encodeURIComponent(indexHtml)));

  // 检查是否已有 index.html
  let sha = null;
  try {
    const existing = await plugin._apiGet(
      `/repos/${core.currentOwner}/${core.currentRepo}/contents/index.html?ref=gh-pages`
    );
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (e) { /* 不存在 */ }

  const body = {
    message: "Deploy index.html to gh-pages",
    content,
    branch: "gh-pages"
  };
  if (sha) body.sha = sha;

  const res = await plugin._apiRequest(
    "PUT",
    `/repos/${core.currentOwner}/${core.currentRepo}/contents/index.html`,
    body
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  plugin._appendLog("index.html 已推送到 gh-pages", logEl);
  alert("index.html 已部署到 gh-pages 分支！");
};

// 部署模板（多文件推送）
plugin._deployTemplate = async (tpl, logEl) => {
  const { core } = plugin._ctx;

  if (!confirm(`确定要部署模板「${tpl.name}」吗？\n将向仓库推送 ${tpl.files.length} 个文件。`)) return;

  const targetBranch = prompt(
    "部署到哪个分支？",
    core.currentBranch || core.defaultBranch || "main"
  );
  if (!targetBranch) return;

  plugin._appendLog(`开始部署模板: ${tpl.name} → ${targetBranch}`, logEl);

  let successCount = 0;
  let errorCount = 0;

  for (const file of tpl.files) {
    try {
      // 替换模板变量
      let fileContent = file.content
        .replace(/__REPO__/g, core.currentRepo)
        .replace(/__OWNER__/g, core.currentOwner)
        .replace(/__BRANCH__/g, targetBranch);

      const content = btoa(unescape(encodeURIComponent(fileContent)));

      // 检查文件是否已存在
      let sha = null;
      try {
        const existing = await plugin._apiGet(
          `/repos/${core.currentOwner}/${core.currentRepo}/contents/${file.path}?ref=${targetBranch}`
        );
        if (existing.ok) {
          const data = await existing.json();
          sha = data.sha;
          plugin._appendLog(`  更新: ${file.path} (已存在)`, logEl);
        }
      } catch (e) { /* 不存在 */ }

      if (!sha) {
        plugin._appendLog(`  创建: ${file.path}`, logEl);
      }

      const body = {
        message: `Deploy ${tpl.name}: ${file.path}`,
        content,
        branch: targetBranch
      };
      if (sha) body.sha = sha;

      const res = await plugin._apiRequest(
        "PUT",
        `/repos/${core.currentOwner}/${core.currentRepo}/contents/${file.path}`,
        body
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      successCount++;
      plugin._appendLog(`  ✓ ${file.path} 部署成功`, logEl);
    } catch (e) {
      errorCount++;
      plugin._appendLog(`  ✗ ${file.path} 失败: ${e.message}`, logEl);
    }
  }

  const summary = `模板部署完成: ${successCount} 成功, ${errorCount} 失败`;
  plugin._appendLog(summary, logEl);

  if (errorCount === 0) {
    alert(`模板「${tpl.name}」部署成功！\n共 ${successCount} 个文件已推送到 ${targetBranch} 分支。\n\n如果 Pages 已启用，站点将在几分钟内更新。`);
  } else {
    alert(`部署部分完成: ${successCount} 成功, ${errorCount} 失败。\n请查看日志了解详情。`);
  }
};
