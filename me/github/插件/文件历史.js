plugin.id = "history-file-viewer";
plugin.name = "历史文件查看器";
plugin.version = "1.0.0";
plugin.description = "查看当前文件的历史版本，支持预览、复制、下载历史内容。";
plugin.tags = ["GitHub", "历史", "文件", "版本", "Commit"];

plugin.style = `
.hfv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(6px);
  z-index: 100800;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.hfv-window {
  width: 900px;
  max-width: calc(100vw - 32px);
  height: 680px;
  max-height: calc(100vh - 32px);
  background: rgba(20,20,20,0.96);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 14px;
  box-shadow: 0 20px 80px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hfv-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  cursor: move;
  user-select: none;
}

.hfv-title {
  font-weight: 800;
}

.hfv-subtitle {
  font-size: 12px;
  opacity: 0.7;
  word-break: break-all;
}

.hfv-spacer {
  flex: 1;
}

.hfv-btn {
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-radius: 8px;
  padding: 6px 9px;
  font-size: 12px;
  cursor: pointer;
}

.hfv-btn:hover {
  background: rgba(255,255,255,0.14);
}

.hfv-btn-primary {
  background: rgba(60,160,255,0.24);
  border-color: rgba(60,160,255,0.34);
}

.hfv-btn-danger {
  background: rgba(255,80,80,0.20);
  border-color: rgba(255,80,80,0.30);
}

.hfv-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.hfv-list {
  width: 330px;
  border-right: 1px solid rgba(255,255,255,0.12);
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
}

.hfv-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.hfv-toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
}

.hfv-code {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 12px;
  background: #111;
  color: #eee;
  font-size: 13px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.hfv-item {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 9px;
  margin-bottom: 9px;
  cursor: pointer;
}

.hfv-item:hover {
  background: rgba(255,255,255,0.08);
}

.hfv-item.active {
  border-color: rgba(60,160,255,0.65);
  background: rgba(60,160,255,0.16);
}

.hfv-msg {
  padding: 14px;
  opacity: 0.75;
  font-size: 13px;
}

.hfv-commit-msg {
  font-weight: 700;
  word-break: break-word;
}

.hfv-meta {
  margin-top: 5px;
  font-size: 11px;
  opacity: 0.7;
  word-break: break-word;
}

.hfv-hash {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: rgba(0,0,0,0.35);
  border-radius: 6px;
  padding: 1px 5px;
}
`;

plugin.init = function(context) {
  const { core, ui, utils, components } = context;

  plugin._currentFile = null;
  plugin._currentText = "";
  plugin._currentCommit = null;

  plugin.decodeBase64Utf8 = function(base64) {
    base64 = String(base64 || "").replace(/\n/g, "");
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
      try {
        return decodeURIComponent(escape(atob(base64)));
      } catch {
        return "";
      }
    }
  };

  plugin.downloadText = function(text, name) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    utils.download(blob, name);
  };

  plugin.addHistoryButton = function(file) {
    if (!ui.mainArea || !file) return;

    setTimeout(() => {
      if (!ui.mainArea || ui.mainArea.querySelector("#hfv-open-history-btn")) return;

      const buttons = Array.from(ui.mainArea.querySelectorAll("button"));
      let bar = null;

      const backBtn = buttons.find(b => b.textContent && b.textContent.includes("返回"));
      if (backBtn && backBtn.parentElement) {
        bar = backBtn.parentElement;
      }

      if (!bar) {
        bar = document.createElement("div");
        bar.style.display = "flex";
        bar.style.gap = "8px";
        bar.style.padding = "8px";
        bar.style.borderBottom = "1px solid rgba(255,255,255,0.15)";
        ui.mainArea.prepend(bar);
      }

      const btn = components.createWindowButton("历史版本", {
        background: "rgba(60,160,255,0.25)",
        border: "1px solid rgba(60,160,255,0.35)"
      });
      btn.id = "hfv-open-history-btn";
      btn.onclick = () => plugin.openHistoryWindow(file);

      bar.appendChild(btn);
    }, 200);
  };

  plugin.openHistoryWindow = async function(file) {
    if (!file || !file.path) {
      alert("未找到当前文件信息");
      return;
    }

    const owner = core.currentOwner;
    const repo = core.currentRepo;
    const branch = core.currentBranch || core.defaultBranch || "main";

    if (!owner || !repo) {
      alert("请先进入一个仓库");
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "hfv-overlay";

    const win = document.createElement("div");
    win.className = "hfv-window";

    const titlebar = document.createElement("div");
    titlebar.className = "hfv-titlebar";

    const titleWrap = document.createElement("div");
    titleWrap.innerHTML = `
      <div class="hfv-title">历史文件查看器</div>
      <div class="hfv-subtitle">${owner}/${repo} @ ${branch}<br>${file.path}</div>
    `;

    const spacer = document.createElement("div");
    spacer.className = "hfv-spacer";

    const refreshBtn = document.createElement("button");
    refreshBtn.className = "hfv-btn hfv-btn-primary";
    refreshBtn.textContent = "刷新";

    const closeBtn = document.createElement("button");
    closeBtn.className = "hfv-btn hfv-btn-danger";
    closeBtn.textContent = "关闭";
    closeBtn.onclick = () => overlay.remove();

    titlebar.appendChild(titleWrap);
    titlebar.appendChild(spacer);
    titlebar.appendChild(refreshBtn);
    titlebar.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "hfv-body";

    const list = document.createElement("div");
    list.className = "hfv-list";
    list.innerHTML = `<div class="hfv-msg">正在加载提交历史...</div>`;

    const viewer = document.createElement("div");
    viewer.className = "hfv-viewer";

    const toolbar = document.createElement("div");
    toolbar.className = "hfv-toolbar";

    const copyBtn = document.createElement("button");
    copyBtn.className = "hfv-btn";
    copyBtn.textContent = "复制内容";
    copyBtn.disabled = true;

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "hfv-btn";
    downloadBtn.textContent = "下载此版本";
    downloadBtn.disabled = true;

    const openCommitBtn = document.createElement("button");
    openCommitBtn.className = "hfv-btn";
    openCommitBtn.textContent = "打开 Commit";
    openCommitBtn.disabled = true;

    const restoreHint = document.createElement("span");
    restoreHint.style.fontSize = "12px";
    restoreHint.style.opacity = "0.65";
    restoreHint.style.alignSelf = "center";
    restoreHint.textContent = "提示：这里只查看历史版本，不会修改仓库。";

    toolbar.appendChild(copyBtn);
    toolbar.appendChild(downloadBtn);
    toolbar.appendChild(openCommitBtn);
    toolbar.appendChild(restoreHint);

    const code = document.createElement("pre");
    code.className = "hfv-code";
    code.textContent = "请选择左侧某个历史版本。";

    viewer.appendChild(toolbar);
    viewer.appendChild(code);

    body.appendChild(list);
    body.appendChild(viewer);

    win.appendChild(titlebar);
    win.appendChild(body);
    overlay.appendChild(win);
    document.body.appendChild(overlay);

    overlay.addEventListener("mousedown", e => {
      if (e.target === overlay) overlay.remove();
    });

    plugin.makeDraggable(titlebar, win);

    const loadCommits = async () => {
      list.innerHTML = `<div class="hfv-msg">正在加载提交历史...</div>`;
      code.textContent = "请选择左侧某个历史版本。";
      copyBtn.disabled = true;
      downloadBtn.disabled = true;
      openCommitBtn.disabled = true;
      plugin._currentText = "";
      plugin._currentCommit = null;

      try {
        const url =
          `https://api.github.com/repos/${owner}/${repo}/commits` +
          `?path=${encodeURIComponent(file.path)}` +
          `&sha=${encodeURIComponent(branch)}` +
          `&per_page=50`;

        const commits = await core.apiManager.fetchJson(url);

        if (!Array.isArray(commits) || commits.length === 0) {
          list.innerHTML = `<div class="hfv-msg">没有找到该文件的历史提交。</div>`;
          return;
        }

        list.innerHTML = "";

        commits.forEach((commit, index) => {
          const item = document.createElement("div");
          item.className = "hfv-item";

          const msg = commit.commit?.message?.split("\n")[0] || "(无提交信息)";
          const author = commit.commit?.author?.name || commit.author?.login || "Unknown";
          const date = commit.commit?.author?.date
            ? commit.commit.author.date.replace("T", " ").replace("Z", "")
            : "";

          item.innerHTML = `
            <div class="hfv-commit-msg">${msg}</div>
            <div class="hfv-meta">
              ${author}<br>
              ${date}<br>
              <span class="hfv-hash">${commit.sha.substring(0, 7)}</span>
            </div>
          `;

          item.onclick = async () => {
            Array.from(list.querySelectorAll(".hfv-item")).forEach(el => el.classList.remove("active"));
            item.classList.add("active");

            code.textContent = "正在读取该历史版本文件内容...";
            copyBtn.disabled = true;
            downloadBtn.disabled = true;
            openCommitBtn.disabled = true;
            plugin._currentText = "";
            plugin._currentCommit = commit;

            try {
              const contentUrl =
                `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}` +
                `?ref=${encodeURIComponent(commit.sha)}`;

              const data = await core.apiManager.fetchJson(contentUrl);

              if (!data || !data.content) {
                throw new Error("该提交中无法读取文件内容，可能文件不存在或太大。");
              }

              const text = plugin.decodeBase64Utf8(data.content);
              plugin._currentText = text;

              code.textContent = text || "[空文件]";

              copyBtn.disabled = false;
              downloadBtn.disabled = false;
              openCommitBtn.disabled = false;
            } catch (e) {
              code.textContent = "读取历史版本失败：\n" + (e.message || e);
            }
          };

          list.appendChild(item);

          if (index === 0) {
            setTimeout(() => item.click(), 100);
          }
        });
      } catch (e) {
        list.innerHTML = `
          <div class="hfv-msg">
            加载失败：${String(e.message || e).replace(/</g, "&lt;")}
            <br><br>
            可能原因：
            <br>1. GitHub API 频率限制
            <br>2. 仓库或分支不存在
            <br>3. 当前 Token 权限不足
          </div>
        `;
      }
    };

    copyBtn.onclick = () => {
      if (!plugin._currentText) return;
      utils.copyToClipboard(plugin._currentText);
      alert("历史版本内容已复制");
    };

    downloadBtn.onclick = () => {
      if (!plugin._currentText) return;
      const sha = plugin._currentCommit?.sha?.substring(0, 7) || "history";
      const name = `${file.name || "file"}.${sha}.txt`;
      plugin.downloadText(plugin._currentText, name);
    };

    openCommitBtn.onclick = () => {
      if (!plugin._currentCommit) return;
      window.open(`https://github.com/${owner}/${repo}/commit/${plugin._currentCommit.sha}`, "_blank");
    };

    refreshBtn.onclick = loadCommits;

    await loadCommits();
  };

  plugin.makeDraggable = function(handle, win) {
    let dragging = false;
    let sx = 0;
    let sy = 0;
    let sl = 0;
    let st = 0;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    handle.addEventListener("mousedown", e => {
      const tag = e.target?.tagName?.toLowerCase?.();
      if (["button", "input", "textarea", "select", "a"].includes(tag)) return;

      dragging = true;
      const rect = win.getBoundingClientRect();

      sx = e.clientX;
      sy = e.clientY;
      sl = rect.left;
      st = rect.top;

      win.style.position = "fixed";
      win.style.left = sl + "px";
      win.style.top = st + "px";
      win.style.margin = "0";
    });

    window.addEventListener("mousemove", e => {
      if (!dragging) return;

      const dx = e.clientX - sx;
      const dy = e.clientY - sy;

      const left = clamp(sl + dx, 8, window.innerWidth - win.offsetWidth - 8);
      const top = clamp(st + dy, 8, window.innerHeight - win.offsetHeight - 8);

      win.style.left = left + "px";
      win.style.top = top + "px";
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });
  };
};

plugin.onHook = function(hookName, data) {
  if (hookName === "file:open") {
    plugin._currentFile = data.file;
    plugin.addHistoryButton(data.file);
  }
};
