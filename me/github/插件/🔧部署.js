// ==================== Repo Packer (Deploy) Plugin ====================
// 将仓库部署为网页：GitHub Pages 管理、静态站点部署、Actions 部署

plugin.id = "repo-packer-deploy";
plugin.name = "Repo Packer - 仓库部署器";
plugin.version = "1.0.0";
plugin.description = "GitHub Pages 管理、静态站点模板部署、gh-pages 分支管理、Actions Workflow 触发与运行记录查看";
plugin.tags = ["部署", "GitHub Pages", "bug"];

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

// ==================== 初始化 ====================

plugin.init = (ctx) => {
  plugin._ctx = ctx;
  plugin._log = [];

  if (ctx.ui && ctx.ui.tabs) {
    plugin._addTabButton();
    plugin._updateTabButtonVisible();
  }
};

plugin.onHook = (hookName, data) => {
  if (hookName === "ui:ready") {
    plugin._addTabButton();
    plugin._updateTabButtonVisible();
  }

  if (hookName === "ui:show") {
    plugin._addTabButton();
    plugin._updateTabButtonVisible();
  }

  if (hookName === "mode:switch") {
    plugin._updateTabButtonVisible();
  }

  if (hookName === "dir:load") {
    plugin._updateTabButtonVisible();
  }

  if (hookName === "ui:hide") {
    plugin._updateTabButtonVisible();
  }
};

plugin._addTabButton = () => {
  const { ui, components } = plugin._ctx;
  if (!ui || !ui.tabs) return;

  let btn = document.getElementById("rpd-tab-btn");

  if (btn) {
    plugin._updateTabButtonVisible();
    return;
  }

  btn = components.createWindowButton("🚀 部署");
  btn.id = "rpd-tab-btn";
  btn.style.display = "none";
  btn.onclick = () => plugin._showDeployUI();

  ui.tabs.appendChild(btn);

  plugin._updateTabButtonVisible();
};

plugin._updateTabButtonVisible = () => {
  const btn = document.getElementById("rpd-tab-btn");
  if (!btn || !plugin._ctx) return;

  const { core } = plugin._ctx;

  const shouldShow =
    core.mode === "browse" &&
    !!core.currentOwner &&
    !!core.currentRepo;

  btn.style.display = shouldShow ? "inline-block" : "none";
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

  const title = document.createElement("h3");
  title.innerHTML = `🚀 仓库部署 — <span style="color:#8af">${core.currentOwner}/${core.currentRepo}</span>`;
  card.appendChild(title);

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

  const logEl = document.createElement("div");
  logEl.className = "rpd-log";
  logEl.textContent = "就绪，等待操作...";
  card.appendChild(logEl);

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

  closeBtn.onclick = () => overlay.remove();

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

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
            if (opt.value === sv) {
              sourceSelect.value = sv;
              break;
            }
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

  cnameBtn.onclick = async () => {
    const cname = cnameInput.value.trim();

    try {
      cnameBtn.disabled = true;

      if (cname) {
        plugin._appendLog(`正在设置 CNAME: ${cname}`, logEl);

        const [branch] = sourceSelect.value.split("|");
        const targetBranch = branch || core.currentBranch || core.defaultBranch;
        const cnameContent = btoa(cname + "\n");

        let sha = null;

        try {
          const existing = await plugin._apiGet(
            `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME?ref=${targetBranch}`
          );

          if (existing.ok) {
            const data = await existing.json();
            sha = data.sha;
          }
        } catch (e) {}

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
        plugin._appendLog("正在删除 CNAME...", logEl);

        const [branch] = sourceSelect.value.split("|");
        const targetBranch = branch || core.currentBranch || core.defaultBranch;

        const existing = await plugin._apiGet(
          `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME?ref=${targetBranch}`
        );

        if (existing.ok) {
          const data = await existing.json();

          await plugin._apiRequest(
            "DELETE",
            `/repos/${core.currentOwner}/${core.currentRepo}/contents/CNAME`,
            {
              message: "Remove CNAME",
              sha: data.sha,
              branch: targetBranch
            }
          );

          plugin._appendLog("CNAME 已删除", logEl);
          alert("CNAME 已删除");
        } else {
          plugin._appendLog("CNAME 文件不存在", logEl);
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
        {
          ref: "refs/heads/gh-pages",
          sha
        }
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

  createEmptyGhPagesBtn.onclick = async () => {
    try {
      createEmptyGhPagesBtn.disabled = true;
      plugin._appendLog("创建空 gh-pages 分支（含 index.html）...", logEl);

      const checkRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/branches/gh-pages`
      );

      if (checkRes.ok) {
        if (!confirm("gh-pages 分支已存在，是否直接往里面推送 index.html？")) {
          createEmptyGhPagesBtn.disabled = false;
          return;
        }

        await plugin._pushFileToGhPages(logEl);
        createEmptyGhPagesBtn.disabled = false;
        return;
      }

      plugin._appendLog("使用 Git Data API 创建孤立 gh-pages 分支...", logEl);

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
        {
          content: indexHtml,
          encoding: "utf-8"
        }
      );

      if (!blobRes.ok) throw new Error("创建 blob 失败");

      const blobData = await blobRes.json();
      plugin._appendLog(`Blob SHA: ${blobData.sha.substring(0, 7)}`, logEl);

      const treeRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/trees`,
        {
          tree: [
            {
              path: "index.html",
              mode: "100644",
              type: "blob",
              sha: blobData.sha
            }
          ]
        }
      );

      if (!treeRes.ok) throw new Error("创建 tree 失败");

      const treeData = await treeRes.json();
      plugin._appendLog(`Tree SHA: ${treeData.sha.substring(0, 7)}`, logEl);

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

      const refRes = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/git/refs`,
        {
          ref: "refs/heads/gh-pages",
          sha: commitData.sha
        }
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
                {
                  ref: branch
                }
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

          const date = run.created_at
            ? run.created_at.replace("T", " ").replace("Z", "")
            : "";

          info.innerHTML = `<b>${run.name || "Workflow"}</b> ${badge}<br>
            <span style="opacity:0.6">#${run.run_number} · ${run.head_branch} · ${date}</span>`;

          const viewBtn = document.createElement("button");
          viewBtn.className = "rpd-btn";
          viewBtn.textContent = "详情";
          viewBtn.onclick = () => plugin._showRunDetailPanel(run);

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

  refreshStatus();
};

// ==================== 辅助方法 ====================

plugin._updatePagesSource = async (branch, path, logEl) => {
  const { core } = plugin._ctx;

  plugin._appendLog(`更新 Pages 源: ${branch} ${path}`, logEl);

  const res = await plugin._apiRequest(
    "PUT",
    `/repos/${core.currentOwner}/${core.currentRepo}/pages`,
    {
      source: {
        branch,
        path
      }
    }
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

  let sha = null;

  try {
    const existing = await plugin._apiGet(
      `/repos/${core.currentOwner}/${core.currentRepo}/contents/index.html?ref=gh-pages`
    );

    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (e) {}

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

// ==================== 部署模板（多文件推送） ====================

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
      let fileContent = file.content
        .replace(/__REPO__/g, core.currentRepo)
        .replace(/__OWNER__/g, core.currentOwner)
        .replace(/__BRANCH__/g, targetBranch);

      const content = btoa(unescape(encodeURIComponent(fileContent)));

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
      } catch (e) {}

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

// ==================== Actions Run 详情面板 ====================

plugin._showRunDetailPanel = async (run) => {
  const { core } = plugin._ctx;

  const old = document.querySelector(".rpd-run-detail-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "rpd-overlay rpd-run-detail-overlay";

  const card = document.createElement("div");
  card.className = "rpd-card";
  card.style.width = "720px";

  const title = document.createElement("h3");
  title.innerHTML = `🔍 Workflow 运行详情 — <span style="color:#8af">#${run.run_number}</span>`;
  card.appendChild(title);

  const statusBox = document.createElement("div");
  statusBox.className = "rpd-status rpd-status-none";
  statusBox.textContent = "正在加载运行详情...";
  card.appendChild(statusBox);

  const infoSection = document.createElement("div");
  infoSection.className = "rpd-section";

  const infoTitle = document.createElement("div");
  infoTitle.className = "rpd-section-title";
  infoTitle.textContent = "📌 基本信息";
  infoSection.appendChild(infoTitle);

  const infoBody = document.createElement("div");
  infoBody.style.fontSize = "12px";
  infoBody.style.lineHeight = "1.8";
  infoSection.appendChild(infoBody);

  card.appendChild(infoSection);

  const jobsSection = document.createElement("div");
  jobsSection.className = "rpd-section";

  const jobsTitle = document.createElement("div");
  jobsTitle.className = "rpd-section-title";
  jobsTitle.textContent = "🧩 Jobs";
  jobsSection.appendChild(jobsTitle);

  const jobsBody = document.createElement("div");
  jobsBody.innerHTML = `<div style="font-size:12px;opacity:0.7">正在加载 Jobs...</div>`;
  jobsSection.appendChild(jobsBody);

  card.appendChild(jobsSection);

  const logSection = document.createElement("div");
  logSection.className = "rpd-section";

  const logTitle = document.createElement("div");
  logTitle.className = "rpd-section-title";
  logTitle.textContent = "📜 操作日志";
  logSection.appendChild(logTitle);

  const detailLog = document.createElement("div");
  detailLog.className = "rpd-log";
  detailLog.textContent = "就绪...";
  logSection.appendChild(detailLog);

  card.appendChild(logSection);

  const bottomRow = document.createElement("div");
  bottomRow.className = "rpd-row";
  bottomRow.style.marginTop = "10px";

  const refreshBtn = document.createElement("button");
  refreshBtn.className = "rpd-btn rpd-btn-blue";
  refreshBtn.textContent = "刷新详情";

  const copyUrlBtn = document.createElement("button");
  copyUrlBtn.className = "rpd-btn";
  copyUrlBtn.textContent = "复制 GitHub 链接";

  const rerunBtn = document.createElement("button");
  rerunBtn.className = "rpd-btn rpd-btn-orange";
  rerunBtn.textContent = "重新运行";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "rpd-btn rpd-btn-red";
  cancelBtn.textContent = "取消运行";

  const closeBtn = document.createElement("button");
  closeBtn.className = "rpd-btn rpd-btn-red";
  closeBtn.textContent = "关闭";
  closeBtn.style.marginLeft = "auto";

  bottomRow.appendChild(refreshBtn);
  bottomRow.appendChild(copyUrlBtn);
  bottomRow.appendChild(rerunBtn);
  bottomRow.appendChild(cancelBtn);
  bottomRow.appendChild(closeBtn);

  card.appendChild(bottomRow);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  closeBtn.onclick = () => overlay.remove();

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const badgeHtml = (status, conclusion) => {
    if (conclusion === "success") {
      return '<span class="rpd-badge rpd-badge-green">success</span>';
    }

    if (conclusion === "failure") {
      return '<span class="rpd-badge rpd-badge-red">failure</span>';
    }

    if (conclusion === "cancelled") {
      return '<span class="rpd-badge rpd-badge-gray">cancelled</span>';
    }

    if (status === "in_progress" || status === "queued" || status === "waiting") {
      return `<span class="rpd-badge rpd-badge-yellow">${status}</span>`;
    }

    return `<span class="rpd-badge rpd-badge-gray">${conclusion || status || "unknown"}</span>`;
  };

  const appendDetailLog = (msg) => {
    const ts = new Date().toLocaleTimeString();
    detailLog.textContent += `\n[${ts}] ${msg}`;
    detailLog.scrollTop = detailLog.scrollHeight;
  };

  const loadDetail = async () => {
    try {
      statusBox.className = "rpd-status rpd-status-none";
      statusBox.textContent = "正在加载运行详情...";

      appendDetailLog("开始加载 Workflow Run 详情");

      const detailRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}`
      );

      if (!detailRes.ok) {
        const err = await detailRes.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${detailRes.status}`);
      }

      const detail = await detailRes.json();

      const jobsRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/jobs?per_page=100`
      );

      let jobs = [];

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        jobs = jobsData.jobs || [];
      }

      const badge = badgeHtml(detail.status, detail.conclusion);

      statusBox.className =
        detail.conclusion === "success"
          ? "rpd-status rpd-status-ok"
          : detail.conclusion === "failure"
            ? "rpd-status rpd-status-err"
            : "rpd-status rpd-status-warn";

      statusBox.innerHTML = `${badge} ${detail.name || "Workflow"} #${detail.run_number}`;

      const createdAt = detail.created_at
        ? detail.created_at.replace("T", " ").replace("Z", "")
        : "-";

      const updatedAt = detail.updated_at
        ? detail.updated_at.replace("T", " ").replace("Z", "")
        : "-";

      const runStartedAt = detail.run_started_at
        ? detail.run_started_at.replace("T", " ").replace("Z", "")
        : "-";

      infoBody.innerHTML = `
        <div><b>名称：</b>${detail.name || "-"}</div>
        <div><b>运行编号：</b>#${detail.run_number}</div>
        <div><b>状态：</b>${badge}</div>
        <div><b>分支：</b>${detail.head_branch || "-"}</div>
        <div><b>事件：</b>${detail.event || "-"}</div>
        <div><b>触发者：</b>${detail.actor?.login || "-"}</div>
        <div><b>提交 SHA：</b><code>${detail.head_sha || "-"}</code></div>
        <div><b>创建时间：</b>${createdAt}</div>
        <div><b>开始时间：</b>${runStartedAt}</div>
        <div><b>更新时间：</b>${updatedAt}</div>
        <div><b>仓库：</b>${core.currentOwner}/${core.currentRepo}</div>
      `;

      jobsBody.innerHTML = "";

      if (!jobs.length) {
        jobsBody.innerHTML = `<div style="font-size:12px;opacity:0.7">暂无 Job 信息</div>`;
      } else {
        jobs.forEach(job => {
          const row = document.createElement("div");
          row.className = "rpd-row";
          row.style.padding = "8px";
          row.style.background = "rgba(255,255,255,0.03)";
          row.style.borderRadius = "6px";
          row.style.marginBottom = "6px";
          row.style.alignItems = "flex-start";

          const jobInfo = document.createElement("div");
          jobInfo.style.flex = "1";
          jobInfo.style.fontSize = "12px";
          jobInfo.style.lineHeight = "1.6";

          const jobBadge = badgeHtml(job.status, job.conclusion);

          const started = job.started_at
            ? job.started_at.replace("T", " ").replace("Z", "")
            : "-";

          const completed = job.completed_at
            ? job.completed_at.replace("T", " ").replace("Z", "")
            : "-";

          let stepsHtml = "";

          if (Array.isArray(job.steps) && job.steps.length) {
            stepsHtml = `
              <details style="margin-top:6px">
                <summary style="cursor:pointer;color:#8af">查看 Steps (${job.steps.length})</summary>
                <div style="margin-top:6px;padding-left:8px;border-left:2px solid rgba(255,255,255,0.15)">
                  ${job.steps.map(step => {
                    const stepBadge = badgeHtml(step.status, step.conclusion);
                    return `
                      <div style="margin-bottom:4px">
                        ${stepBadge}
                        <span>${step.number}. ${step.name}</span>
                      </div>
                    `;
                  }).join("")}
                </div>
              </details>
            `;
          }

          jobInfo.innerHTML = `
            <div><b>${job.name || "Job"}</b> ${jobBadge}</div>
            <div style="opacity:0.7">开始：${started}</div>
            <div style="opacity:0.7">完成：${completed}</div>
            ${stepsHtml}
          `;

          row.appendChild(jobInfo);
          jobsBody.appendChild(row);
        });
      }

      appendDetailLog(`详情加载完成，Jobs: ${jobs.length}`);
    } catch (e) {
      statusBox.className = "rpd-status rpd-status-err";
      statusBox.textContent = "加载失败：" + e.message;
      appendDetailLog("加载失败：" + e.message);
    }
  };

  refreshBtn.onclick = loadDetail;

  copyUrlBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(run.html_url || "");
      appendDetailLog("GitHub 链接已复制");
      alert("GitHub 链接已复制");
    } catch (e) {
      appendDetailLog("复制失败：" + e.message);
      alert("复制失败：" + e.message);
    }
  };

  rerunBtn.onclick = async () => {
    if (!confirm(`确定要重新运行 #${run.run_number} 吗？`)) return;

    try {
      rerunBtn.disabled = true;
      appendDetailLog(`正在重新运行 #${run.run_number}...`);

      const res = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/rerun`
      );

      if (res.status === 201) {
        appendDetailLog("重新运行已触发");
        alert("已重新触发运行！");
        await loadDetail();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      appendDetailLog("重新运行失败：" + e.message);
      alert("重新运行失败：" + e.message);
    } finally {
      rerunBtn.disabled = false;
    }
  };

  cancelBtn.onclick = async () => {
    if (!confirm(`确定要取消运行 #${run.run_number} 吗？\n只有正在运行或排队的任务才能取消。`)) return;

    try {
      cancelBtn.disabled = true;
      appendDetailLog(`正在取消运行 #${run.run_number}...`);

      const res = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/cancel`
      );

      if (res.status === 202) {
        appendDetailLog("取消请求已发送");
        alert("取消请求已发送");
        await loadDetail();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      appendDetailLog("取消失败：" + e.message);
      alert("取消失败：" + e.message);
    } finally {
      cancelBtn.disabled = false;
    }
  };

  await loadDetail();
};
// ============================================================
// Repo Packer Deploy - Actions Run Detail Enhanced Module
// 功能：
// 1. Actions Run 详情面板
// 2. Status / Total duration / Artifacts
// 3. Jobs / Steps
// 4. Artifacts 下载
// 5. Workflow YAML needs 依赖解析
// 6. 真实依赖流程图，失败时自动回退推断图
// ============================================================

// ==================== CSS 注入 ====================

plugin._injectRunDetailEnhancedCSS = () => {
  if (document.getElementById("rpd-run-detail-enhanced-css")) return;

  const style = document.createElement("style");
  style.id = "rpd-run-detail-enhanced-css";

  style.textContent = `
    .rpd-run-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      border-top: 1px solid rgba(255,255,255,0.12);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding: 12px 0;
      margin-bottom: 12px;
    }

    .rpd-run-summary-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .rpd-run-summary-label {
      font-size: 12px;
      opacity: 0.65;
    }

    .rpd-run-summary-value {
      font-size: 20px;
      font-weight: 900;
      line-height: 1.2;
    }

    .rpd-flow-wrap {
      background: #f6f8fa;
      color: #24292f;
      border: 1px solid #d0d7de;
      border-radius: 10px;
      min-height: 380px;
      overflow: auto;
      position: relative;
    }

    .rpd-flow-canvas {
      position: relative;
      min-width: 760px;
      min-height: 380px;
      transform-origin: 0 0;
      transition: transform 0.15s ease;
    }

    .rpd-flow-title {
      position: absolute;
      left: 24px;
      top: 22px;
      font-size: 22px;
      font-weight: 900;
      color: #24292f;
    }

    .rpd-flow-subtitle {
      position: absolute;
      left: 24px;
      top: 56px;
      font-size: 14px;
      color: #57606a;
    }

    .rpd-flow-source {
      position: absolute;
      left: 24px;
      top: 82px;
      font-size: 12px;
      color: #6e7781;
    }

    .rpd-flow-node {
      position: absolute;
      width: 260px;
      min-height: 58px;
      background: #fff;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(27,31,36,0.04);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      box-sizing: border-box;
      font-weight: 800;
      color: #57606a;
      z-index: 2;
    }

    .rpd-flow-node:hover {
      border-color: #0969da;
      box-shadow: 0 0 0 3px rgba(9,105,218,0.12);
    }

    .rpd-flow-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid #6e7781;
      background: #fff;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .rpd-flow-dot-success {
      background: #2da44e;
      border-color: #2da44e;
    }

    .rpd-flow-dot-failure {
      background: #cf222e;
      border-color: #cf222e;
    }

    .rpd-flow-dot-cancelled {
      background: #6e7781;
      border-color: #6e7781;
    }

    .rpd-flow-dot-running {
      background: #bf8700;
      border-color: #bf8700;
    }

    .rpd-flow-dot-queued {
      background: #fff;
      border-color: #6e7781;
    }

    .rpd-flow-node-main {
      min-width: 0;
      flex: 1;
    }

    .rpd-flow-node-name {
      font-size: 15px;
      font-weight: 900;
      color: #57606a;
      word-break: break-word;
    }

    .rpd-flow-node-meta {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 3px;
      font-weight: 500;
      color: #57606a;
    }

    .rpd-flow-svg {
      position: absolute;
      left: 0;
      top: 0;
      overflow: visible;
      z-index: 1;
      pointer-events: none;
    }

    .rpd-flow-line {
      stroke: #d0d7de;
      stroke-width: 3;
      fill: none;
    }

    .rpd-flow-line-dot {
      fill: #6e7781;
    }

    .rpd-flow-controls {
      position: sticky;
      left: calc(100% - 150px);
      bottom: 12px;
      width: max-content;
      display: flex;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      z-index: 5;
      margin-left: auto;
      margin-right: 12px;
      margin-bottom: 12px;
    }

    .rpd-flow-controls button {
      border: none;
      background: #fff;
      color: #57606a;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 18px;
      border-right: 1px solid #d0d7de;
    }

    .rpd-flow-controls button:last-child {
      border-right: none;
    }

    .rpd-flow-controls button:hover {
      background: #f3f4f6;
    }

    .rpd-artifact-row {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      margin-bottom: 6px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .rpd-artifact-info {
      flex: 1;
      min-width: 0;
      font-size: 12px;
    }

    .rpd-artifact-name {
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rpd-artifact-meta {
      opacity: 0.65;
      margin-top: 3px;
    }

    .rpd-yaml-box {
      background: rgba(0,0,0,0.22);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 8px;
      padding: 8px;
      font-size: 11px;
      color: #aaa;
      margin-top: 8px;
      white-space: pre-wrap;
      max-height: 120px;
      overflow: auto;
    }
  `;

  document.head.appendChild(style);
};

// ==================== 通用格式化 ====================

plugin._rpdFormatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "-";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = Number(bytes || 0);
  let i = 0;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

plugin._rpdParseTime = (value) => {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
};

plugin._rpdFormatDuration = (ms) => {
  if (!ms || ms < 0) return "–";

  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

plugin._rpdCalcRunDuration = (detail, jobs) => {
  let start = plugin._rpdParseTime(detail.run_started_at) || plugin._rpdParseTime(detail.created_at);
  let end = plugin._rpdParseTime(detail.updated_at);

  if (!start && Array.isArray(jobs) && jobs.length) {
    const starts = jobs
      .map(j => plugin._rpdParseTime(j.started_at))
      .filter(Boolean);

    if (starts.length) start = Math.min(...starts);
  }

  if (Array.isArray(jobs) && jobs.length) {
    const ends = jobs
      .map(j => plugin._rpdParseTime(j.completed_at))
      .filter(Boolean);

    if (ends.length) end = Math.max(...ends);
  }

  if (!start || !end) return "–";

  return plugin._rpdFormatDuration(end - start);
};

plugin._rpdStatusText = (status, conclusion) => {
  const v = conclusion || status || "unknown";
  return String(v)
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
};

plugin._rpdBadgeHtml = (status, conclusion) => {
  if (conclusion === "success") {
    return '<span class="rpd-badge rpd-badge-green">success</span>';
  }

  if (conclusion === "failure") {
    return '<span class="rpd-badge rpd-badge-red">failure</span>';
  }

  if (conclusion === "cancelled") {
    return '<span class="rpd-badge rpd-badge-gray">cancelled</span>';
  }

  if (status === "queued") {
    return '<span class="rpd-badge rpd-badge-gray">queued</span>';
  }

  if (status === "in_progress" || status === "waiting") {
    return `<span class="rpd-badge rpd-badge-yellow">${status}</span>`;
  }

  return `<span class="rpd-badge rpd-badge-gray">${conclusion || status || "unknown"}</span>`;
};

// ==================== Artifacts ====================

plugin._fetchRunArtifacts = async (runId) => {
  const { core } = plugin._ctx;

  const res = await plugin._apiGet(
    `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${runId}/artifacts?per_page=100`
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.artifacts || [];
};

plugin._downloadArtifact = async (artifact, logFn) => {
  const { core } = plugin._ctx;

  try {
    if (logFn) logFn(`开始下载 Artifact: ${artifact.name}`);

    const res = await fetch(artifact.archive_download_url, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(core.token ? { Authorization: `token ${core.token}` } : {})
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
    }

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.name || "artifact"}.zip`;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    if (logFn) logFn(`Artifact 下载完成: ${artifact.name}`);
  } catch (e) {
    if (logFn) logFn(`Artifact 下载失败: ${e.message}`);
    alert("下载失败: " + e.message);
  }
};

// ==================== Workflow YAML 获取 ====================

plugin._fetchWorkflowYamlText = async (detail, logFn) => {
  const { core } = plugin._ctx;

  try {
    if (!detail.workflow_id) {
      if (logFn) logFn("无法读取 workflow_id，跳过 YAML 解析");
      return null;
    }

    if (logFn) logFn(`读取 Workflow 信息: ${detail.workflow_id}`);

    const wfRes = await plugin._apiGet(
      `/repos/${core.currentOwner}/${core.currentRepo}/actions/workflows/${detail.workflow_id}`
    );

    if (!wfRes.ok) {
      if (logFn) logFn(`Workflow 信息读取失败: HTTP ${wfRes.status}`);
      return null;
    }

    const wf = await wfRes.json();

    if (!wf.path) {
      if (logFn) logFn("Workflow 没有 path，可能是 dynamic workflow");
      return null;
    }

    const ref =
      detail.head_sha ||
      detail.head_branch ||
      core.currentBranch ||
      core.defaultBranch ||
      "main";

    if (logFn) logFn(`读取 Workflow YAML: ${wf.path} @ ${ref}`);

    const fileRes = await plugin._apiGet(
      `/repos/${core.currentOwner}/${core.currentRepo}/contents/${encodeURIComponent(wf.path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(ref)}`
    );

    if (!fileRes.ok) {
      if (logFn) logFn(`Workflow YAML 读取失败: HTTP ${fileRes.status}`);
      return {
        path: wf.path,
        text: null,
        error: `HTTP ${fileRes.status}`
      };
    }

    const fileData = await fileRes.json();

    if (!fileData.content) {
      if (logFn) logFn("Workflow YAML content 为空");
      return {
        path: wf.path,
        text: null,
        error: "empty content"
      };
    }

    let text = "";

    try {
      text = decodeURIComponent(escape(atob(String(fileData.content).replace(/\n/g, ""))));
    } catch (e) {
      text = atob(String(fileData.content).replace(/\n/g, ""));
    }

    if (logFn) logFn(`Workflow YAML 读取成功: ${wf.path}`);

    return {
      path: wf.path,
      text,
      workflow: wf,
      error: null
    };
  } catch (e) {
    if (logFn) logFn(`Workflow YAML 读取异常: ${e.message}`);
    return null;
  }
};

// ==================== 简易 YAML jobs/needs 解析器 ====================

plugin._stripYamlQuotes = (s) => {
  return String(s || "")
    .trim()
    .replace(/^['"]/, "")
    .replace(/['"]$/, "");
};

plugin._parseNeedsValue = (raw) => {
  raw = String(raw || "").trim();

  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map(x => plugin._stripYamlQuotes(x.trim()))
      .filter(Boolean);
  }

  return [plugin._stripYamlQuotes(raw)];
};

plugin._parseWorkflowJobsFromYaml = (yamlText) => {
  const result = {
    jobs: {},
    jobOrder: []
  };

  if (!yamlText) return result;

  const lines = String(yamlText).replace(/\r/g, "").split("\n");

  let inJobs = false;
  let jobsIndent = -1;
  let currentJobId = null;
  let currentJobIndent = -1;
  let pendingNeedsJob = null;
  let pendingNeedsIndent = -1;

  const ensureJob = (id) => {
    if (!result.jobs[id]) {
      result.jobs[id] = {
        id,
        name: "",
        needs: []
      };
      result.jobOrder.push(id);
    }
    return result.jobs[id];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const noComment = rawLine.replace(/#.*$/, "");
    const trimmed = noComment.trim();

    if (!trimmed) continue;

    const indent = rawLine.match(/^ */)?.[0]?.length || 0;

    if (!inJobs) {
      if (/^jobs\s*:\s*$/.test(trimmed)) {
        inJobs = true;
        jobsIndent = indent;
      }
      continue;
    }

    if (inJobs && indent <= jobsIndent && !/^jobs\s*:\s*$/.test(trimmed)) {
      break;
    }

    if (pendingNeedsJob) {
      if (indent > pendingNeedsIndent && trimmed.startsWith("-")) {
        const dep = plugin._stripYamlQuotes(trimmed.replace(/^-+\s*/, ""));
        if (dep) {
          const job = ensureJob(pendingNeedsJob);
          if (!job.needs.includes(dep)) job.needs.push(dep);
        }
        continue;
      } else {
        pendingNeedsJob = null;
        pendingNeedsIndent = -1;
      }
    }

    if (indent === jobsIndent + 2) {
      const m = trimmed.match(/^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/);

      if (m) {
        currentJobId = m[1];
        currentJobIndent = indent;
        ensureJob(currentJobId);
        continue;
      }
    }

    if (!currentJobId) continue;

    if (indent <= currentJobIndent) {
      currentJobId = null;
      currentJobIndent = -1;
      continue;
    }

    const current = ensureJob(currentJobId);

    let nameMatch = trimmed.match(/^name\s*:\s*(.+)$/);
    if (nameMatch) {
      current.name = plugin._stripYamlQuotes(nameMatch[1]);
      continue;
    }

    let needsMatch = trimmed.match(/^needs\s*:\s*(.*)$/);
    if (needsMatch) {
      const value = needsMatch[1].trim();

      if (!value) {
        pendingNeedsJob = currentJobId;
        pendingNeedsIndent = indent;
      } else {
        current.needs = plugin._parseNeedsValue(value);
      }

      continue;
    }
  }

  return result;
};

// ==================== runtime job 和 YAML job 匹配 ====================

plugin._normalizeJobName = (s) => {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

plugin._matchRuntimeJobToYamlId = (runtimeJob, yamlJobs) => {
  const runtimeName = String(runtimeJob.name || "");
  const runtimeNorm = plugin._normalizeJobName(runtimeName);

  for (const [id, meta] of Object.entries(yamlJobs || {})) {
    if (runtimeName === id) return id;
    if (runtimeName === meta.name) return id;
  }

  for (const [id, meta] of Object.entries(yamlJobs || {})) {
    if (runtimeNorm === plugin._normalizeJobName(id)) return id;
    if (runtimeNorm === plugin._normalizeJobName(meta.name)) return id;
  }

  return runtimeName || String(runtimeJob.id || "");
};

// ==================== 构建真实依赖图模型 ====================

plugin._buildJobGraphModel = (jobs, yamlMeta) => {
  const safeJobs = Array.isArray(jobs) ? jobs.slice() : [];

  safeJobs.sort((a, b) => {
    const at = plugin._rpdParseTime(a.started_at) || 0;
    const bt = plugin._rpdParseTime(b.started_at) || 0;
    return at - bt;
  });

  const yamlJobs = yamlMeta && yamlMeta.jobs ? yamlMeta.jobs : {};
  const hasYamlJobs = Object.keys(yamlJobs).length > 0;

  const nodes = [];
  const runtimeIdToNodeId = {};
  const yamlIdToNodeId = {};

  safeJobs.forEach((job, index) => {
    const yamlId = hasYamlJobs
      ? plugin._matchRuntimeJobToYamlId(job, yamlJobs)
      : null;

    const nodeId = yamlId || String(job.id || job.name || index);

    runtimeIdToNodeId[String(job.id || index)] = nodeId;

    if (yamlId) {
      yamlIdToNodeId[yamlId] = nodeId;
    }

    nodes.push({
      id: nodeId,
      yamlId,
      job,
      name: job.name || yamlId || `Job ${index + 1}`,
      needs: []
    });
  });

  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  if (hasYamlJobs) {
    nodes.forEach(node => {
      const yid = node.yamlId;
      const ymeta = yid ? yamlJobs[yid] : null;

      if (ymeta && Array.isArray(ymeta.needs)) {
        node.needs = ymeta.needs
          .map(depYamlId => yamlIdToNodeId[depYamlId] || depYamlId)
          .filter(depNodeId => nodeMap[depNodeId]);
      }
    });
  }

  const hasAnyNeeds = nodes.some(n => n.needs && n.needs.length);

  if (!hasAnyNeeds && nodes.length > 1) {
    if (nodes.length === 2) {
      nodes[1].needs = [nodes[0].id];
    } else {
      for (let i = 1; i < nodes.length; i++) {
        nodes[i].needs = [nodes[0].id];
      }
    }

    return {
      nodes,
      source: hasYamlJobs ? "YAML 无 needs，已自动推断" : "自动推断",
      yamlAvailable: hasYamlJobs,
      hasNeeds: false
    };
  }

  return {
    nodes,
    source: hasAnyNeeds ? "Workflow YAML needs" : "无依赖",
    yamlAvailable: hasYamlJobs,
    hasNeeds: hasAnyNeeds
  };
};

// ==================== 渲染流程图 ====================

plugin._rpdFlowDotClass = (job) => {
  if (job.conclusion === "success") return "rpd-flow-dot-success";
  if (job.conclusion === "failure") return "rpd-flow-dot-failure";
  if (job.conclusion === "cancelled") return "rpd-flow-dot-cancelled";
  if (job.status === "in_progress") return "rpd-flow-dot-running";
  return "rpd-flow-dot-queued";
};

plugin._renderRunGraph = (container, detail, graphModel) => {
  plugin._injectRunDetailEnhancedCSS();

  container.innerHTML = "";

  const nodes = graphModel.nodes || [];
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  const levelMap = {};
  const visiting = new Set();

  const calcLevel = (node) => {
    if (levelMap[node.id] !== undefined) return levelMap[node.id];

    if (visiting.has(node.id)) {
      levelMap[node.id] = 0;
      return 0;
    }

    visiting.add(node.id);

    if (!node.needs || !node.needs.length) {
      levelMap[node.id] = 0;
    } else {
      const depLevels = node.needs
        .map(depId => nodeMap[depId])
        .filter(Boolean)
        .map(dep => calcLevel(dep));

      levelMap[node.id] = depLevels.length ? Math.max(...depLevels) + 1 : 0;
    }

    visiting.delete(node.id);
    return levelMap[node.id];
  };

  nodes.forEach(calcLevel);

  const levels = {};
  nodes.forEach(n => {
    const lv = levelMap[n.id] || 0;
    if (!levels[lv]) levels[lv] = [];
    levels[lv].push(n);
  });

  const levelKeys = Object.keys(levels).map(Number).sort((a, b) => a - b);

  const nodeW = 260;
  const nodeH = 74;
  const startX = 90;
  const startY = 145;
  const gapX = 330;
  const gapY = 118;

  const positions = {};

  levelKeys.forEach(lv => {
    const arr = levels[lv];
    arr.forEach((node, index) => {
      positions[node.id] = {
        x: startX + lv * gapX,
        y: startY + index * gapY
      };
    });
  });

  const maxLevel = levelKeys.length ? Math.max(...levelKeys) : 0;
  const maxRows = Math.max(1, ...Object.values(levels).map(arr => arr.length));

  const canvasW = Math.max(760, startX + (maxLevel + 1) * gapX + nodeW);
  const canvasH = Math.max(380, startY + maxRows * gapY + 120);

  const wrap = document.createElement("div");
  wrap.className = "rpd-flow-wrap";

  const canvas = document.createElement("div");
  canvas.className = "rpd-flow-canvas";
  canvas.style.width = `${canvasW}px`;
  canvas.style.minHeight = `${canvasH}px`;

  const title = document.createElement("div");
  title.className = "rpd-flow-title";
  title.textContent = detail.name || "Workflow";

  const subtitle = document.createElement("div");
  subtitle.className = "rpd-flow-subtitle";
  subtitle.textContent = `on: ${detail.event || "dynamic"}`;

  const source = document.createElement("div");
  source.className = "rpd-flow-source";
  source.textContent = `graph: ${graphModel.source || "unknown"}`;

  canvas.appendChild(title);
  canvas.appendChild(subtitle);
  canvas.appendChild(source);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "rpd-flow-svg");
  svg.setAttribute("width", String(canvasW));
  svg.setAttribute("height", String(canvasH));
  svg.setAttribute("viewBox", `0 0 ${canvasW} ${canvasH}`);

  const drawEdge = (fromId, toId) => {
    const from = positions[fromId];
    const to = positions[toId];

    if (!from || !to) return;

    const x1 = from.x + nodeW;
    const y1 = from.y + nodeH / 2;
    const x2 = to.x;
    const y2 = to.y + nodeH / 2;

    const midX = Math.max(x1 + 30, (x1 + x2) / 2);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "rpd-flow-line");
    path.setAttribute("d", `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
    svg.appendChild(path);

    const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c1.setAttribute("class", "rpd-flow-line-dot");
    c1.setAttribute("cx", String(x1));
    c1.setAttribute("cy", String(y1));
    c1.setAttribute("r", "5");
    svg.appendChild(c1);

    const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c2.setAttribute("class", "rpd-flow-line-dot");
    c2.setAttribute("cx", String(x2));
    c2.setAttribute("cy", String(y2));
    c2.setAttribute("r", "5");
    svg.appendChild(c2);
  };

  nodes.forEach(node => {
    (node.needs || []).forEach(depId => drawEdge(depId, node.id));
  });

  canvas.appendChild(svg);

  nodes.forEach(node => {
    const pos = positions[node.id];
    const job = node.job || {};

    const el = document.createElement("div");
    el.className = "rpd-flow-node";
    el.style.left = `${pos.x}px`;
    el.style.top = `${pos.y}px`;

    const duration = plugin._rpdFormatDuration(
      (plugin._rpdParseTime(job.completed_at) || Date.now()) -
      (plugin._rpdParseTime(job.started_at) || Date.now())
    );

    el.title = `Job: ${node.name}\nStatus: ${job.conclusion || job.status || "unknown"}\nNeeds: ${(node.needs || []).join(", ") || "-"}`;

    el.innerHTML = `
      <div class="rpd-flow-dot ${plugin._rpdFlowDotClass(job)}"></div>
      <div class="rpd-flow-node-main">
        <div class="rpd-flow-node-name">${node.name}</div>
        <div class="rpd-flow-node-meta">${job.conclusion || job.status || "queued"} · ${duration}</div>
      </div>
    `;

    canvas.appendChild(el);
  });

  if (!nodes.length) {
    const empty = document.createElement("div");
    empty.style.position = "absolute";
    empty.style.left = "24px";
    empty.style.top = "130px";
    empty.style.color = "#57606a";
    empty.textContent = "暂无 Job 图形数据，可能仍在排队中。";
    canvas.appendChild(empty);
  }

  let scale = 1;

  const controls = document.createElement("div");
  controls.className = "rpd-flow-controls";

  const fitBtn = document.createElement("button");
  fitBtn.textContent = "⛶";

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";

  const applyScale = () => {
    canvas.style.transform = `scale(${scale})`;
  };

  fitBtn.onclick = () => {
    scale = 1;
    applyScale();
  };

  minusBtn.onclick = () => {
    scale = Math.max(0.45, scale - 0.1);
    applyScale();
  };

  plusBtn.onclick = () => {
    scale = Math.min(1.8, scale + 0.1);
    applyScale();
  };

  controls.appendChild(fitBtn);
  controls.appendChild(minusBtn);
  controls.appendChild(plusBtn);

  wrap.appendChild(canvas);
  wrap.appendChild(controls);

  container.appendChild(wrap);
};

// ==================== Actions Run 详情面板：最终增强版 ====================

plugin._showRunDetailPanel = async (run) => {
  const { core } = plugin._ctx;

  plugin._injectRunDetailEnhancedCSS();

  const old = document.querySelector(".rpd-run-detail-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "rpd-overlay rpd-run-detail-overlay";

  const card = document.createElement("div");
  card.className = "rpd-card";
  card.style.width = "900px";
  card.style.maxHeight = "92vh";

  const title = document.createElement("h3");
  title.innerHTML = `🔍 Workflow 运行详情 — <span style="color:#8af">#${run.run_number}</span>`;
  card.appendChild(title);

  const summary = document.createElement("div");
  summary.className = "rpd-run-summary";

  const summaryStatus = document.createElement("div");
  summaryStatus.className = "rpd-run-summary-item";
  summaryStatus.innerHTML = `
    <div class="rpd-run-summary-label">Status</div>
    <div class="rpd-run-summary-value">Loading...</div>
  `;

  const summaryDuration = document.createElement("div");
  summaryDuration.className = "rpd-run-summary-item";
  summaryDuration.innerHTML = `
    <div class="rpd-run-summary-label">Total duration</div>
    <div class="rpd-run-summary-value">–</div>
  `;

  const summaryArtifacts = document.createElement("div");
  summaryArtifacts.className = "rpd-run-summary-item";
  summaryArtifacts.innerHTML = `
    <div class="rpd-run-summary-label">Artifacts</div>
    <div class="rpd-run-summary-value">–</div>
  `;

  summary.appendChild(summaryStatus);
  summary.appendChild(summaryDuration);
  summary.appendChild(summaryArtifacts);
  card.appendChild(summary);

  const statusBox = document.createElement("div");
  statusBox.className = "rpd-status rpd-status-none";
  statusBox.textContent = "正在加载运行详情...";
  card.appendChild(statusBox);

  const flowSection = document.createElement("div");
  flowSection.className = "rpd-section";

  const flowTitle = document.createElement("div");
  flowTitle.className = "rpd-section-title";
  flowTitle.textContent = "🧭 Workflow 流程图";
  flowSection.appendChild(flowTitle);

  const flowBody = document.createElement("div");
  flowBody.innerHTML = `<div style="font-size:12px;opacity:0.7">正在加载流程图...</div>`;
  flowSection.appendChild(flowBody);

  card.appendChild(flowSection);

  const infoSection = document.createElement("div");
  infoSection.className = "rpd-section";

  const infoTitle = document.createElement("div");
  infoTitle.className = "rpd-section-title";
  infoTitle.textContent = "📌 基本信息";
  infoSection.appendChild(infoTitle);

  const infoBody = document.createElement("div");
  infoBody.style.fontSize = "12px";
  infoBody.style.lineHeight = "1.8";
  infoSection.appendChild(infoBody);

  const yamlInfo = document.createElement("div");
  yamlInfo.className = "rpd-yaml-box";
  yamlInfo.textContent = "Workflow YAML: waiting...";
  infoSection.appendChild(yamlInfo);

  card.appendChild(infoSection);

  const jobsSection = document.createElement("div");
  jobsSection.className = "rpd-section";

  const jobsTitle = document.createElement("div");
  jobsTitle.className = "rpd-section-title";
  jobsTitle.textContent = "🧩 Jobs";
  jobsSection.appendChild(jobsTitle);

  const jobsBody = document.createElement("div");
  jobsBody.innerHTML = `<div style="font-size:12px;opacity:0.7">正在加载 Jobs...</div>`;
  jobsSection.appendChild(jobsBody);

  card.appendChild(jobsSection);

  const artifactSection = document.createElement("div");
  artifactSection.className = "rpd-section";

  const artifactTitle = document.createElement("div");
  artifactTitle.className = "rpd-section-title";
  artifactTitle.textContent = "📦 Artifacts";
  artifactSection.appendChild(artifactTitle);

  const artifactBody = document.createElement("div");
  artifactBody.innerHTML = `<div style="font-size:12px;opacity:0.7">正在加载 Artifacts...</div>`;
  artifactSection.appendChild(artifactBody);

  card.appendChild(artifactSection);

  const logSection = document.createElement("div");
  logSection.className = "rpd-section";

  const logTitle = document.createElement("div");
  logTitle.className = "rpd-section-title";
  logTitle.textContent = "📜 操作日志";
  logSection.appendChild(logTitle);

  const detailLog = document.createElement("div");
  detailLog.className = "rpd-log";
  detailLog.textContent = "就绪...";
  logSection.appendChild(detailLog);

  card.appendChild(logSection);

  const bottomRow = document.createElement("div");
  bottomRow.className = "rpd-row";
  bottomRow.style.marginTop = "10px";

  const refreshBtn = document.createElement("button");
  refreshBtn.className = "rpd-btn rpd-btn-blue";
  refreshBtn.textContent = "刷新详情";

  const copyUrlBtn = document.createElement("button");
  copyUrlBtn.className = "rpd-btn";
  copyUrlBtn.textContent = "复制 GitHub 链接";

  const rerunBtn = document.createElement("button");
  rerunBtn.className = "rpd-btn rpd-btn-orange";
  rerunBtn.textContent = "重新运行";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "rpd-btn rpd-btn-red";
  cancelBtn.textContent = "取消运行";

  const closeBtn = document.createElement("button");
  closeBtn.className = "rpd-btn rpd-btn-red";
  closeBtn.textContent = "关闭";
  closeBtn.style.marginLeft = "auto";

  bottomRow.appendChild(refreshBtn);
  bottomRow.appendChild(copyUrlBtn);
  bottomRow.appendChild(rerunBtn);
  bottomRow.appendChild(cancelBtn);
  bottomRow.appendChild(closeBtn);

  card.appendChild(bottomRow);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  closeBtn.onclick = () => overlay.remove();

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const appendDetailLog = (msg) => {
    const ts = new Date().toLocaleTimeString();
    detailLog.textContent += `\n[${ts}] ${msg}`;
    detailLog.scrollTop = detailLog.scrollHeight;
  };

  const renderArtifacts = (artifacts) => {
    artifactBody.innerHTML = "";

    if (!artifacts.length) {
      artifactBody.innerHTML = `<div style="font-size:12px;opacity:0.7">暂无 Artifacts</div>`;
      return;
    }

    artifacts.forEach(artifact => {
      const row = document.createElement("div");
      row.className = "rpd-artifact-row";

      const info = document.createElement("div");
      info.className = "rpd-artifact-info";

      const expired = artifact.expired ? "已过期" : "可下载";
      const expiresAt = artifact.expires_at
        ? artifact.expires_at.replace("T", " ").replace("Z", "")
        : "-";

      info.innerHTML = `
        <div class="rpd-artifact-name">📦 ${artifact.name}</div>
        <div class="rpd-artifact-meta">
          大小：${plugin._rpdFormatBytes(artifact.size_in_bytes)}
          · 状态：${expired}
          · 过期：${expiresAt}
        </div>
      `;

      const downloadBtn = document.createElement("button");
      downloadBtn.className = "rpd-btn rpd-btn-blue";
      downloadBtn.textContent = "下载";
      downloadBtn.disabled = !!artifact.expired;

      downloadBtn.onclick = async () => {
        downloadBtn.disabled = true;
        await plugin._downloadArtifact(artifact, appendDetailLog);
        downloadBtn.disabled = !!artifact.expired;
      };

      row.appendChild(info);
      row.appendChild(downloadBtn);
      artifactBody.appendChild(row);
    });
  };

  const renderJobs = (jobs) => {
    jobsBody.innerHTML = "";

    if (!jobs.length) {
      jobsBody.innerHTML = `<div style="font-size:12px;opacity:0.7">暂无 Job 信息</div>`;
      return;
    }

    jobs.forEach(job => {
      const row = document.createElement("div");
      row.className = "rpd-row";
      row.style.padding = "8px";
      row.style.background = "rgba(255,255,255,0.03)";
      row.style.borderRadius = "6px";
      row.style.marginBottom = "6px";
      row.style.alignItems = "flex-start";

      const jobInfo = document.createElement("div");
      jobInfo.style.flex = "1";
      jobInfo.style.fontSize = "12px";
      jobInfo.style.lineHeight = "1.6";

      const jobBadge = plugin._rpdBadgeHtml(job.status, job.conclusion);

      const started = job.started_at
        ? job.started_at.replace("T", " ").replace("Z", "")
        : "-";

      const completed = job.completed_at
        ? job.completed_at.replace("T", " ").replace("Z", "")
        : "-";

      const jobDuration = plugin._rpdFormatDuration(
        (plugin._rpdParseTime(job.completed_at) || Date.now()) -
        (plugin._rpdParseTime(job.started_at) || Date.now())
      );

      let stepsHtml = "";

      if (Array.isArray(job.steps) && job.steps.length) {
        stepsHtml = `
          <details style="margin-top:6px">
            <summary style="cursor:pointer;color:#8af">查看 Steps (${job.steps.length})</summary>
            <div style="margin-top:6px;padding-left:8px;border-left:2px solid rgba(255,255,255,0.15)">
              ${job.steps.map(step => {
                const stepBadge = plugin._rpdBadgeHtml(step.status, step.conclusion);
                const stepDuration = plugin._rpdFormatDuration(
                  (plugin._rpdParseTime(step.completed_at) || Date.now()) -
                  (plugin._rpdParseTime(step.started_at) || Date.now())
                );

                return `
                  <div style="margin-bottom:4px">
                    ${stepBadge}
                    <span>${step.number}. ${step.name}</span>
                    <span style="opacity:0.55"> · ${stepDuration}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </details>
        `;
      }

      jobInfo.innerHTML = `
        <div><b>${job.name || "Job"}</b> ${jobBadge}</div>
        <div style="opacity:0.7">耗时：${jobDuration}</div>
        <div style="opacity:0.7">开始：${started}</div>
        <div style="opacity:0.7">完成：${completed}</div>
        ${stepsHtml}
      `;

      row.appendChild(jobInfo);
      jobsBody.appendChild(row);
    });
  };

  const loadDetail = async () => {
    try {
      statusBox.className = "rpd-status rpd-status-none";
      statusBox.textContent = "正在加载运行详情...";

      appendDetailLog("开始加载 Workflow Run 详情");

      const detailRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}`
      );

      if (!detailRes.ok) {
        const err = await detailRes.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${detailRes.status}`);
      }

      const detail = await detailRes.json();

      const jobsRes = await plugin._apiGet(
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/jobs?per_page=100`
      );

      let jobs = [];

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        jobs = jobsData.jobs || [];
      }

      const artifacts = await plugin._fetchRunArtifacts(run.id);

      const yamlPack = await plugin._fetchWorkflowYamlText(detail, appendDetailLog);

      let yamlMeta = null;

      if (yamlPack && yamlPack.text) {
        yamlMeta = plugin._parseWorkflowJobsFromYaml(yamlPack.text);
        yamlInfo.textContent =
          `Workflow YAML: ${yamlPack.path}\n` +
          `Parsed jobs: ${Object.keys(yamlMeta.jobs || {}).length}\n` +
          `Graph source: YAML needs`;
      } else if (yamlPack && yamlPack.path) {
        yamlInfo.textContent =
          `Workflow YAML: ${yamlPack.path}\n` +
          `读取失败：${yamlPack.error || "unknown"}\n` +
          `Graph source: 自动推断`;
      } else {
        yamlInfo.textContent =
          `Workflow YAML: 不可用，可能是 GitHub Pages dynamic workflow\n` +
          `Graph source: 自动推断`;
      }

      const graphModel = plugin._buildJobGraphModel(jobs, yamlMeta);
      plugin._renderRunGraph(flowBody, detail, graphModel);

      const currentStatusText = plugin._rpdStatusText(detail.status, detail.conclusion);

      summaryStatus.querySelector(".rpd-run-summary-value").textContent = currentStatusText;
      summaryDuration.querySelector(".rpd-run-summary-value").textContent =
        plugin._rpdCalcRunDuration(detail, jobs);
      summaryArtifacts.querySelector(".rpd-run-summary-value").textContent =
        artifacts.length ? String(artifacts.length) : "–";

      const badge = plugin._rpdBadgeHtml(detail.status, detail.conclusion);

      statusBox.className =
        detail.conclusion === "success"
          ? "rpd-status rpd-status-ok"
          : detail.conclusion === "failure"
            ? "rpd-status rpd-status-err"
            : "rpd-status rpd-status-warn";

      statusBox.innerHTML = `${badge} ${detail.name || "Workflow"} #${detail.run_number}`;

      const createdAt = detail.created_at
        ? detail.created_at.replace("T", " ").replace("Z", "")
        : "-";

      const updatedAt = detail.updated_at
        ? detail.updated_at.replace("T", " ").replace("Z", "")
        : "-";

      const runStartedAt = detail.run_started_at
        ? detail.run_started_at.replace("T", " ").replace("Z", "")
        : "-";

      infoBody.innerHTML = `
        <div><b>名称：</b>${detail.name || "-"}</div>
        <div><b>运行编号：</b>#${detail.run_number}</div>
        <div><b>状态：</b>${badge}</div>
        <div><b>总耗时：</b>${plugin._rpdCalcRunDuration(detail, jobs)}</div>
        <div><b>分支：</b>${detail.head_branch || "-"}</div>
        <div><b>事件：</b>${detail.event || "-"}</div>
        <div><b>触发者：</b>${detail.actor?.login || "-"}</div>
        <div><b>提交 SHA：</b><code>${detail.head_sha || "-"}</code></div>
        <div><b>创建时间：</b>${createdAt}</div>
        <div><b>开始时间：</b>${runStartedAt}</div>
        <div><b>更新时间：</b>${updatedAt}</div>
        <div><b>仓库：</b>${core.currentOwner}/${core.currentRepo}</div>
        <div><b>图来源：</b>${graphModel.source}</div>
      `;

      renderJobs(jobs);
      renderArtifacts(artifacts);

      appendDetailLog(`详情加载完成，Jobs: ${jobs.length}，Artifacts: ${artifacts.length}，Graph: ${graphModel.source}`);
    } catch (e) {
      statusBox.className = "rpd-status rpd-status-err";
      statusBox.textContent = "加载失败：" + e.message;
      appendDetailLog("加载失败：" + e.message);
    }
  };

  refreshBtn.onclick = loadDetail;

  copyUrlBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(run.html_url || "");
      appendDetailLog("GitHub 链接已复制");
      alert("GitHub 链接已复制");
    } catch (e) {
      appendDetailLog("复制失败：" + e.message);
      alert("复制失败：" + e.message);
    }
  };

  rerunBtn.onclick = async () => {
    if (!confirm(`确定要重新运行 #${run.run_number} 吗？`)) return;

    try {
      rerunBtn.disabled = true;
      appendDetailLog(`正在重新运行 #${run.run_number}...`);

      const res = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/rerun`
      );

      if (res.status === 201) {
        appendDetailLog("重新运行已触发");
        alert("已重新触发运行！");
        await loadDetail();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      appendDetailLog("重新运行失败：" + e.message);
      alert("重新运行失败：" + e.message);
    } finally {
      rerunBtn.disabled = false;
    }
  };

  cancelBtn.onclick = async () => {
    if (!confirm(`确定要取消运行 #${run.run_number} 吗？\n只有正在运行或排队的任务才能取消。`)) return;

    try {
      cancelBtn.disabled = true;
      appendDetailLog(`正在取消运行 #${run.run_number}...`);

      const res = await plugin._apiRequest(
        "POST",
        `/repos/${core.currentOwner}/${core.currentRepo}/actions/runs/${run.id}/cancel`
      );

      if (res.status === 202) {
        appendDetailLog("取消请求已发送");
        alert("取消请求已发送");
        await loadDetail();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      appendDetailLog("取消失败：" + e.message);
      alert("取消失败：" + e.message);
    } finally {
      cancelBtn.disabled = false;
    }
  };

  await loadDetail();
};