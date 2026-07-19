plugin.id = 'github-oauth-login-02engine';
plugin.name = 'GitHub OAuth 登录';
plugin.version = '1.0.0';
plugin.description = '通过 GitHub OAuth 登录并自动将 Access Token 写入 GitHub 面板，仅支持 02engine.0pen.top。';
plugin.tags = ['github', 'oauth', 'login', 'token', '02engine'];

const WORKER_HOST = 'https://github-panel-auth.13244431027.workers.dev';
const ALLOWED_HOST = '02engine.0pen.top';

let loginWindow = null;
let checkTimer = null;
let closeCheckTimer = null;
let timeoutTimer = null;
let loginButton = null;
let logoutButton = null;
let stateLabel = null;
let mounted = false;

function isAllowedDomain() {
  return String(location.hostname || '').toLowerCase() === ALLOWED_HOST;
}

function setState(text, color = '') {
  if (!stateLabel) return;
  stateLabel.textContent = text;
  stateLabel.style.color = color || '#fff';
}

function clearLoginTimers() {
  if (checkTimer) {
    clearInterval(checkTimer);
    checkTimer = null;
  }

  if (closeCheckTimer) {
    clearInterval(closeCheckTimer);
    closeCheckTimer = null;
  }

  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
}

async function workerFetch(path, options = {}) {
  return fetch(`${WORKER_HOST}${path}`, {
    ...options,
    credentials: 'include'
  });
}

async function checkLogin() {
  try {
    const res = await workerFetch('/api/user');
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function getAccessToken() {
  const res = await workerFetch('/api/gettoken');

  if (!res.ok) {
    throw new Error(`获取 Token 失败（HTTP ${res.status}）`);
  }

  const data = await res.json();
  const token = String(data?.token || '').trim();

  if (!token) {
    throw new Error('Worker 未返回 Access Token');
  }

  return token;
}

async function startOAuthLogin(context) {
  const { core, extension } = context;

  if (!isAllowedDomain()) {
    const msg = `仅 ${ALLOWED_HOST} 可用。\n\n当前域名：${location.hostname || '未知'}`;
    alert(msg);
    setState(`仅 ${ALLOWED_HOST} 可用`, '#ff8888');
    return;
  }

  if (loginWindow && !loginWindow.closed) {
    loginWindow.focus();
    return;
  }

  clearLoginTimers();

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.textContent = '正在准备登录...';
  }

  setState('正在请求 GitHub OAuth 登录地址...', '#a8d8ff');

  loginWindow = window.open(
    'about:blank',
    'GitHubOAuthLogin',
    'width=600,height=720,left=200,top=100'
  );

  if (!loginWindow) {
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = 'GitHub OAuth 登录';
    }
    setState('登录窗口被浏览器拦截，请允许弹出窗口。', '#ff8888');
    alert('登录窗口被浏览器拦截，请允许弹出窗口后重试。');
    return;
  }

  try {
    const res = await workerFetch('/auth/login');

    if (!res.ok) {
      throw new Error(`登录地址请求失败（HTTP ${res.status}）`);
    }

    const data = await res.json();
    const oauthUrl = String(data?.url || '');

    if (!oauthUrl) {
      throw new Error('Worker 未返回 GitHub OAuth 登录 URL');
    }

    loginWindow.location.href = oauthUrl;
    setState('请在新窗口完成 GitHub 授权...', '#ffe08a');

    await new Promise((resolve, reject) => {
      let finished = false;

      const finish = (result) => {
        if (finished) return;
        finished = true;

        clearLoginTimers();

        try {
          if (loginWindow && !loginWindow.closed) {
            loginWindow.close();
          }
        } catch (e) {}

        loginWindow = null;

        if (result instanceof Error) reject(result);
        else resolve(result);
      };

      checkTimer = setInterval(async () => {
        try {
          const user = await checkLogin();
          if (user) finish(user);
        } catch (e) {}
      }, 1000);

      closeCheckTimer = setInterval(() => {
        if (!loginWindow || loginWindow.closed) {
          finish(new Error('登录窗口已关闭，未完成授权。'));
        }
      }, 500);

      timeoutTimer = setTimeout(() => {
        finish(new Error('登录超时，请重新尝试。'));
      }, 5 * 60 * 1000);
    });

    setState('授权成功，正在获取 Access Token...', '#a8d8ff');
    const token = await getAccessToken();
    core.setToken(token);

    if (typeof extension._renderActionRow === 'function') {
      extension._renderActionRow();
    }

    const user = await checkLogin();
    const username = user?.login || 'GitHub 用户';
    setState(`已登录：${username}，Token 已同步到 GitHub 面板。`, '#8fffaa');

    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = `已登录：${username}`;
    }
    if (logoutButton) logoutButton.disabled = false;

    alert(`GitHub 登录成功！\n\n用户：${username}\nAccess Token 已同步到 GitHub 面板。`);
  } catch (error) {
    console.error('[GitHub OAuth Plugin]', error);
    try {
      if (loginWindow && !loginWindow.closed) loginWindow.close();
    } catch (e) {}
    loginWindow = null;
    clearLoginTimers();

    const message = error?.message || String(error);
    setState(`登录失败：${message}`, '#ff8888');

    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = 'GitHub OAuth 登录';
    }
    alert(`GitHub OAuth 登录失败：\n${message}`);
  }
}

async function logout(context) {
  const { core, extension } = context;

  if (!isAllowedDomain()) {
    alert(`仅 ${ALLOWED_HOST} 可用。\n\n当前域名：${location.hostname || '未知'}`);
    setState(`仅 ${ALLOWED_HOST} 可用`, '#ff8888');
    if (logoutButton) logoutButton.disabled = true;
    return;
  }

  const confirmed = confirm(
    '确定要退出 GitHub 登录吗？\n\n' +
    '这将清除 OAuth 登录状态，并移除 GitHub 面板中保存的 Token。'
  );
  if (!confirmed) return;

  if (logoutButton) {
    logoutButton.disabled = true;
    logoutButton.textContent = '退出中...';
  }
  setState('正在退出 GitHub 登录...', '#ffe08a');

  try {
    const res = await workerFetch('/auth/logout', { method: 'POST' });
    if (!res.ok) throw new Error(`退出请求失败（HTTP ${res.status}）`);

    core.setToken('');
    if (typeof extension._renderActionRow === 'function') {
      extension._renderActionRow();
    }

    setState('已退出 GitHub 登录，面板 Token 已清除。', '#8fffaa');
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = 'GitHub OAuth 登录';
    }
    if (logoutButton) logoutButton.disabled = true;

    alert('已退出 GitHub 登录。\nGitHub 面板中的 Access Token 已清除。');
  } catch (error) {
    console.error('[GitHub OAuth Plugin] logout error:', error);
    const message = error?.message || String(error);
    setState(`退出失败：${message}`, '#ff8888');
    alert(`退出登录失败：\n${message}`);
  } finally {
    if (logoutButton) {
      logoutButton.disabled = false;
      logoutButton.textContent = '退出登录';
    }
  }
}

async function refreshLoginState(context) {
  const { core } = context;

  if (!isAllowedDomain()) {
    setState(`仅 ${ALLOWED_HOST} 可用`, '#ff8888');
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = 'GitHub OAuth 登录';
    }
    if (logoutButton) logoutButton.disabled = true;
    return;
  }

  setState('检查 GitHub 登录状态...', '#a8d8ff');
  const user = await checkLogin();

  if (!user) {
    setState('未登录 GitHub。', '#ffe08a');
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = 'GitHub OAuth 登录';
    }
    if (logoutButton) logoutButton.disabled = true;
    return;
  }

  const username = user.login || 'GitHub 用户';
  if (core.token) {
    setState(`Worker 已登录：${username}；GitHub 面板 Token 已存在。`, '#8fffaa');
  } else {
    setState(`Worker 已登录：${username}；可点击按钮同步 Token。`, '#ffe08a');
  }

  if (loginButton) {
    loginButton.disabled = false;
    loginButton.textContent = `同步 Token（${username}）`;
  }
  if (logoutButton) logoutButton.disabled = false;
}

function mount(context) {
  const { ui, components } = context;
  if (mounted || !ui || !ui.tabs) return;
  mounted = true;

  loginButton = components.createWindowButton('GitHub OAuth 登录', {
    background: 'rgba(9,105,218,0.35)',
    border: '1px solid rgba(80,160,255,0.50)',
    borderRadius: '8px'
  });
  loginButton.onclick = () => startOAuthLogin(context);

  logoutButton = components.createWindowButton('退出登录', {
    background: 'rgba(255,80,80,0.22)',
    border: '1px solid rgba(255,100,100,0.38)',
    borderRadius: '8px'
  });
  logoutButton.onclick = () => logout(context);
  logoutButton.disabled = true;

  stateLabel = document.createElement('div');
  stateLabel.style.fontSize = '11px';
  stateLabel.style.opacity = '0.85';
  stateLabel.style.marginLeft = '4px';
  stateLabel.style.maxWidth = '220px';
  stateLabel.style.whiteSpace = 'nowrap';
  stateLabel.style.overflow = 'hidden';
  stateLabel.style.textOverflow = 'ellipsis';

  ui.tabs.appendChild(loginButton);
  ui.tabs.appendChild(logoutButton);
  ui.tabs.appendChild(stateLabel);

  refreshLoginState(context);
}

plugin.init = (context) => {
  mount(context);
};

plugin.onHook = (hookName, data) => {
  if (hookName === 'ui:ready') {
    mount({
      core: manager.extension.core,
      ui: data,
      api: manager.extension.core.apiManager,
      utils,
      components,
      extension: manager.extension,
      manager
    });
  }
  if (hookName === 'ui:show' && mounted) {
    refreshLoginState({
      core: manager.extension.core,
      ui: manager.extension.ui,
      api: manager.extension.core.apiManager,
      utils,
      components,
      extension: manager.extension,
      manager
    });
  }
};

plugin.dispose = () => {
  clearLoginTimers();
  try {
    if (loginWindow && !loginWindow.closed) loginWindow.close();
  } catch (e) {}

  if (loginButton) loginButton.remove();
  if (logoutButton) logoutButton.remove();
  if (stateLabel) stateLabel.remove();

  loginButton = null;
  logoutButton = null;
  stateLabel = null;
  loginWindow = null;
  mounted = false;
};