plugin.id = "github-oauth-login";
plugin.name = "GitHub 登录";
plugin.version = "1.2.0";
plugin.description = "通过 OAuth 代理弹窗登录 GitHub，自动填充 Token，域名 oauth.13244431027.dpdns.org";
plugin.tags = ["认证", "OAuth登录"];

plugin.style = `
.ghlogin-btn{
  border-radius:6px;
  border:1px solid rgba(255,255,255,0.2);
  background:rgba(255,255,255,0.1);
  color:#fff; padding:6px 10px; font-size:12px; cursor:pointer;
  white-space:nowrap;
}
.ghlogin-btn:hover{ background:rgba(255,255,255,0.18); }
.ghlogin-btn.ghlogin-on{
  background:rgba(40,167,69,0.35);
  border-color:rgba(40,167,69,0.5);
}
.ghlogin-btn:disabled{ opacity:0.6; cursor:progress; }
.ghlogin-avatar{
  width:16px; height:16px; border-radius:50%;
  vertical-align:-3px; margin-right:5px;
}
`;

const PROXY = "https://oauth.13244431027.dpdns.org";
const LS_KEY = "ghlogin_session_v1";
const ORIGIN_WHITELIST = [
  "http://localhost:8000",
  "http://02engine.0pen.top", "https://02engine.0pen.top",
  "http://02engine.org", "https://02engine.org",
  "http://turbowarp.org", "https://turbowarp.org",
  "http://www.ccw.site", "https://www.ccw.site"
];

const state = { token: "", user: null, busy: false };
let btn = null, popup = null, poll = null, timer = null;


function setStatus(msg, isErr) {
  if (ui.statusLabel) {
    ui.statusLabel.textContent = msg;
    ui.statusLabel.style.color = isErr ? "#ff8888" : "#fff";
  }
  console.log("[登录]", msg);
}

function pushToken(token) {
  core.token = token;
  core.updateAIConfig();
  try { core.pluginManager && core.pluginManager._saveToStorage(); } catch (e) {}
  try { extension._renderActionRow && extension._renderActionRow(); } catch (e) {}
  try { extension._refreshAIConfigUI && extension._refreshAIConfigUI(); } catch (e) {}
}

function saveSession() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ token: state.token, user: state.user }));
  } catch (e) {}
}

function loadSession() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (d && d.token) {
      state.token = d.token;
      state.user = d.user || null;
      pushToken(d.token);
    }
  } catch (e) {}
}

function clearSession() {
  state.token = "";
  state.user = null;
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
  pushToken("");
}

async function fetchUser(token) {
  const res = await fetch("https://api.github.com/user", {
    headers: { Accept: "application/vnd.github+json", Authorization: "token " + token }
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.json();
}

async function applyToken(token) {
  state.busy = true; render();
  try {
    const user = await fetchUser(token);
    state.token = token;
    state.user = user;
    pushToken(token);
    saveSession();
    setStatus("已登录：" + user.login);
    if (ui.ownerInput && !ui.ownerInput.value) ui.ownerInput.value = user.login;
  } catch (e) {
    clearSession();
    setStatus("登录失败：" + e.message, true);
  } finally {
    state.busy = false; render();
  }
}

function stopPoll() {
  if (poll) { clearInterval(poll); poll = null; }
  if (timer) { clearTimeout(timer); timer = null; }
}

function startLogin() {
  if (!ORIGIN_WHITELIST.includes(location.origin)) {
    alert("当前站点未在代理白名单中：\n" + location.origin + "\n\n请核对白名单。或联系https://www.ccw.site/student/687f6ba9fc898317568cdc8d");
    return;
  }
  stopPoll();

  const redirectTo = location.origin + "/favicon.ico";
  const authUrl = PROXY + "/login?redirect_to=" + encodeURIComponent(redirectTo);

  popup = window.open(authUrl, "gh_oauth_login", "width=980,height=720,menubar=no,toolbar=no");
  if (!popup) {
    alert("弹窗被浏览器拦截，请允许本站弹出窗口后重试。");
    return;
  }

  state.busy = true; render();
  setStatus("等待 GitHub 授权...");

  poll = setInterval(() => {
    if (!popup || popup.closed) {
      stopPoll();
      state.busy = false; render();
      if (!state.token) setStatus("登录已取消", true);
      return;
    }
    let hash = "";
    try {
      hash = popup.location.hash || "";
    } catch (e) { return; }

    if (hash.indexOf("access_token=") !== -1) {
      const token = new URLSearchParams(hash.slice(1)).get("access_token");
      stopPoll();
      try { popup.close(); } catch (e) {}
      popup = null;
      if (token) applyToken(token);
      else { state.busy = false; render(); setStatus("未获取到 Token", true); }
    }
  }, 400);

  timer = setTimeout(() => {
    stopPoll();
    try { popup && popup.close(); } catch (e) {}
    popup = null;
    state.busy = false; render();
    setStatus("授权超时", true);
  }, 180000);
}

function doLogout() {
  if (!confirm("确定退出 GitHub 登录？\n（会清除本扩展保存的 Token）")) return;
  clearSession();
  render();
  setStatus("已退出登录");
}

function render() {
  if (!btn) return;
  btn.disabled = state.busy;
  if (state.busy) {
    btn.textContent = "登录中...";
    btn.className = "ghlogin-btn";
  } else if (state.token && state.user) {
    btn.className = "ghlogin-btn ghlogin-on";
    btn.innerHTML =
      '<img class="ghlogin-avatar" src="' + state.user.avatar_url + '">' +
      "✓ " + state.user.login;
    btn.title = "点击退出登录";
  } else {
    btn.className = "ghlogin-btn";
    btn.textContent = " 登录";
    btn.title = "通过 OAuth 授权获取 Token";
  }
}
function mount() {
  if (btn && btn.isConnected) return;
  if (!ui.tabs) return;

  btn = document.createElement("button");
  btn.className = "ghlogin-btn";
  btn.onclick = () => {
    if (state.busy) return;
    if (state.token) doLogout();
    else startLogin();
  };

  if (ui.searchDirSelectWrap && ui.searchDirSelectWrap.parentElement === ui.tabs) {
    ui.tabs.insertBefore(btn, ui.searchDirSelectWrap);
  } else {
    ui.tabs.appendChild(btn);
  }
  render();
}

plugin.init = () => {
  loadSession();
  mount();
  if (state.token && !state.user) {
    fetchUser(state.token)
      .then(u => { state.user = u; saveSession(); render(); })
      .catch(() => { clearSession(); render(); });
  }
};

plugin.onHook = (name) => {
  if (name === "ui:ready" || name === "ui:show") mount();
};

plugin.destroy = () => {
  stopPoll();
  try { popup && popup.close(); } catch (e) {}
  popup = null;
  if (btn) { btn.remove(); btn = null; }
};
