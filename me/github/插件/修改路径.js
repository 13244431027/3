plugin.id = "save-with-rename-path";
plugin.name = "保存时修改文件名/路径";
plugin.version = "1.0.0";

plugin.style = `
.swr-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.62);
  z-index:100080;
  display:flex;
  align-items:center;
  justify-content:center;
}
.swr-card{
  width:460px;
  max-width:calc(100vw - 32px);
  background:#222;
  border:1px solid #555;
  border-radius:12px;
  color:#fff;
  padding:16px;
  display:flex;
  flex-direction:column;
  gap:10px;
  box-shadow:0 10px 40px rgba(0,0,0,0.55);
  font-family:system-ui,-apple-system,sans-serif;
}
.swr-title{
  font-weight:800;
  font-size:15px;
}
.swr-desc{
  font-size:12px;
  opacity:0.72;
  line-height:1.45;
}
.swr-label{
  font-size:11px;
  opacity:0.72;
}
.swr-input{
  width:100%;
  box-sizing:border-box;
  background:rgba(0,0,0,0.34);
  border:1px solid #555;
  color:#fff;
  border-radius:7px;
  padding:8px 9px;
  font-size:13px;
  outline:none;
}
.swr-input:focus{
  border-color:#58a6ff;
  box-shadow:0 0 0 3px rgba(88,166,255,0.14);
}
.swr-row{
  display:flex;
  gap:8px;
}
.swr-warn{
  font-size:12px;
  color:#ffd27a;
  background:rgba(255,180,60,0.10);
  border:1px solid rgba(255,180,60,0.22);
  border-radius:8px;
  padding:8px;
}
.swr-muted{
  font-size:11px;
  opacity:0.62;
  word-break:break-all;
}
`;

plugin.init = (context) => {
  const { extension } = context;

  if (extension.__swrPatched) {
    console.log("[保存时修改文件名/路径] 已经安装过补丁");
    return;
  }

  extension.__swrPatched = true;
  extension.__swrOriginalSaveFileChanges = extension._saveFileChanges;

  extension._saveFileChanges = async function(path) {
    return showSaveWithRenameDialog(context, path);
  };

  console.log("[保存时修改文件名/路径] 插件已启用");
};

function showSaveWithRenameDialog(ctx, oldPath) {
  const { core, ui, components } = ctx;

  if (!ui.editorTextarea) {
    alert("未找到编辑器");
    return;
  }

  if (!core.token) {
    alert("请先设置 GitHub Token");
    return;
  }

  if (!core.currentOwner || !core.currentRepo) {
    alert("请先进入仓库");
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "swr-overlay";
  overlay.onmousedown = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const card = document.createElement("div");
  card.className = "swr-card";

  const title = document.createElement("div");
  title.className = "swr-title";
  title.textContent = "提交修改 / 修改文件名";

  const desc = document.createElement("div");
  desc.className = "swr-desc";
  desc.textContent = "保存时可以同时修改文件路径。新路径保持不变则只更新内容；修改新路径则会创建新文件并删除旧文件。";

  const oldLabel = document.createElement("div");
  oldLabel.className = "swr-label";
  oldLabel.textContent = "原路径";

  const oldInput = document.createElement("input");
  oldInput.className = "swr-input";
  oldInput.value = oldPath;
  oldInput.disabled = true;

  const newLabel = document.createElement("div");
  newLabel.className = "swr-label";
  newLabel.textContent = "新路径 / 新文件名";

  const newInput = document.createElement("input");
  newInput.className = "swr-input";
  newInput.value = oldPath;

  const msgLabel = document.createElement("div");
  msgLabel.className = "swr-label";
  msgLabel.textContent = "提交信息";

  const msgInput = document.createElement("input");
  msgInput.className = "swr-input";
  msgInput.value = `Update ${oldPath}`;

  const warn = document.createElement("div");
  warn.className = "swr-warn";
  warn.style.display = "none";

  const muted = document.createElement("div");
  muted.className = "swr-muted";
  muted.textContent = `当前分支：${core.currentBranch || "默认分支"}`;

  const row = document.createElement("div");
  row.className = "swr-row";

  const submitBtn = components.createWindowButton("提交", {
    flex: "1",
    background: "#28a745"
  });

  const cancelBtn = components.createWindowButton("取消", {
    flex: "1"
  });

  row.appendChild(submitBtn);
  row.appendChild(cancelBtn);

  const syncMessage = () => {
    const newPath = normalizePath(newInput.value);
    if (!newPath || newPath === oldPath) {
      warn.style.display = "none";
      msgInput.value = `Update ${oldPath}`;
    } else {
      warn.style.display = "block";
      warn.textContent = `将修改路径：${oldPath}  →  ${newPath}`;
      msgInput.value = `Rename ${oldPath} -> ${newPath} and update content`;
    }
  };

  newInput.addEventListener("input", syncMessage);

  cancelBtn.onclick = () => overlay.remove();

  submitBtn.onclick = async () => {
    const newPath = normalizePath(newInput.value);
    const message = String(msgInput.value || "").trim();

    if (!newPath) {
      alert("新路径不能为空");
      return;
    }

    if (!message) {
      alert("提交信息不能为空");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "提交中...";

    try {
      await saveFileMaybeRename(ctx, oldPath, newPath, message);
      overlay.remove();
    } catch (e) {
      alert("提交失败：" + (e.message || e));
      submitBtn.disabled = false;
      submitBtn.textContent = "提交";
    }
  };

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(oldLabel);
  card.appendChild(oldInput);
  card.appendChild(newLabel);
  card.appendChild(newInput);
  card.appendChild(msgLabel);
  card.appendChild(msgInput);
  card.appendChild(warn);
  card.appendChild(muted);
  card.appendChild(row);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  newInput.focus();
  newInput.select();
}

async function saveFileMaybeRename(ctx, oldPath, newPath, message) {
  const { core, ui, api, extension } = ctx;

  const owner = core.currentOwner;
  const repo = core.currentRepo;
  const branch = core.currentBranch;
  const content = ui.editorTextarea.value;
  const encoded = btoa(unescape(encodeURIComponent(content)));

  if (oldPath === newPath) {
    await api.putFile(
      owner,
      repo,
      oldPath,
      encoded,
      message,
      branch,
      core.currentFileSha
    );

    afterSaveSamePath(ctx, oldPath, content);
    return;
  }

  const ok = confirm(
    `确认修改文件路径？\n\n` +
    `原路径：${oldPath}\n` +
    `新路径：${newPath}\n\n` +
    `这会创建新文件并删除旧文件。`
  );

  if (!ok) {
    throw new Error("用户取消");
  }

  let overwriteSha = null;

  try {
    const exists = await api.fetchJson(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodePath(newPath)}?ref=${encodeURIComponent(branch)}`
    );

    if (exists && exists.sha) {
      const overwrite = confirm(
        `目标路径已经存在：\n${newPath}\n\n是否覆盖它？`
      );

      if (!overwrite) {
        throw new Error("目标路径已存在，已取消覆盖");
      }

      overwriteSha = exists.sha;
    }
  } catch (e) {
    // 目标不存在时 GitHub 会返回 404，被 fetchJson 包装成错误。
    // 这里不用处理，继续创建即可。
  }

  await api.putFile(
    owner,
    repo,
    newPath,
    encoded,
    message,
    branch,
    overwriteSha
  );

  const oldSha = core.currentFileSha || await fetchFileSha(ctx, oldPath);

  await api.deleteFile(
    owner,
    repo,
    oldPath,
    oldSha,
    branch,
    message
  );

  core.currentFileSha = null;

  alert(
    `提交成功！\n\n` +
    `已修改路径：\n${oldPath}\n→\n${newPath}`
  );

  core.isEditMode = false;

  const newDir = dirname(newPath);
  core.currentPath = newDir;

  if (extension.loadDir) {
    await extension.loadDir(newDir);
  }
}

function afterSaveSamePath(ctx, path, content) {
  const { core, ui, extension } = ctx;

  alert("保存成功！");

  if (ui.fileViewRefs && ui.fileViewRefs.pre) {
    ui.fileViewRefs.pre.textContent = content;
  }

  if (ui.fileViewRefs && ui.fileViewRefs.textarea) {
    ui.fileViewRefs.textarea.style.display = "none";
  }

  if (ui.fileViewRefs && ui.fileViewRefs.preWrap) {
    ui.fileViewRefs.preWrap.style.display = "block";
  }

  if (ui.fileViewRefs && ui.fileViewRefs.saveBtn) {
    ui.fileViewRefs.saveBtn.style.display = "none";
  }

  if (ui.fileViewRefs && ui.fileViewRefs.editBtn) {
    ui.fileViewRefs.editBtn.textContent = "修改模式";
    ui.fileViewRefs.editBtn.style.background = "rgba(255, 165, 0, 0.3)";
  }

  core.isEditMode = false;

  if (extension.loadDir) {
    const dir = dirname(path);
    core.currentPath = dir;
  }
}

async function fetchFileSha(ctx, path) {
  const { core, api } = ctx;
  const data = await api.fetchJson(
    `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}/contents/${encodePath(path)}?ref=${encodeURIComponent(core.currentBranch)}`
  );

  if (!data || !data.sha) {
    throw new Error("无法获取旧文件 SHA");
  }

  return data.sha;
}

function normalizePath(path) {
  return String(path || "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
}

function dirname(path) {
  const arr = String(path || "").split("/");
  arr.pop();
  return arr.join("/");
}

function encodePath(path) {
  return String(path || "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}
