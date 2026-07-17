// ==UserScript==
// @name            ccw修改登录信息
// @namespace       change-login-extra
// @version         1.0.1
// @description     在ccw登录时修改设备和浏览器
// @author          不想上学
// @match           https://*.ccw.site/*
// @downloadURL     https://ccwtools.431658.dpdns.org/User-Script/files/ccw-change-login-extra.user.js
// @grant           unsafeWindow
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @run-at          document-start
// ==/UserScript==
function patch(obj, p, fn) {
    if (obj[p]) obj[p] = fn(obj[p]);
}
function patchBody(body) {
    let extra = GM_getValue("ccw-change-login-extra");
    if (extra) {
        let json = JSON.parse(body);
        json.extra = JSON.stringify(extra);
        return JSON.stringify(json);
    }
    return body;
}
const XHR = unsafeWindow.XMLHttpRequest.prototype;
patch(
    XHR,
    "open",
    _open =>
        function (method, url) {
            if (
                url ==
                "https://sso.ccw.site/web/auth/login-by-password" ||
                url ==
                "https://sso.ccw.site/web/auth/v3/login/by_phone"
            ) {
                patch(
                    this,
                    "send",
                    _send =>
                        function (body) {
                            try {
                                body = patchBody(body);
                            } catch (e) {
                                console.error(e);
                            }
                            return _send.apply(this, arguments);
                        }
                );

            }
            return _open.apply(this, arguments);
        }
);
patch(
    unsafeWindow,
    "fetch",
    _fetch =>
        function (url, options) {
            if (
                url == "https://sso.ccw.site/web/auth/login-by-password" ||
                url == "https://sso.ccw.site/web/auth/v3/login/by_phone"
            ) {
                try {
                    options.body = patchBody(options.body);
                } catch (e) {
                    console.error(e);
                }
            }
            return _fetch(url, options);
        }
);
function createUI() {
    // 已存在 UI 则不再重复创建
    if (document.getElementById("ccw-login-extra-ui")) return;

    const old = GM_getValue("ccw-change-login-extra");
    const enabled = !!old;
    const data = old || { device: "", browser: "" };

    const wrapper = document.createElement("div");
    wrapper.id = "ccw-login-extra-ui";
    wrapper.style.cssText = `
        position:fixed;
        top:0;left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.45);
        z-index:999999;
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto;
    `;

    wrapper.innerHTML = `
        <div style="
            width:320px;
            background:#fff;
            border-radius:8px;
            padding:16px;
            box-shadow:0 8px 30px rgba(0,0,0,.2);
        ">
            <h3 style="margin:0 0 12px;">修改登录信息</h3>

            <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <input type="checkbox" id="enable" ${enabled ? "checked" : ""}>
                启用修改
            </label>

            <div id="form" style="${enabled ? "" : "opacity:.5;pointer-events:none;"}">
                <div style="margin-bottom:10px;">
                    <div style="font-size:13px;margin-bottom:4px;">设备</div>
                    <input id="device" style="width:100%;box-sizing:border-box;padding:6px;"
                           value="${data.device}">
                </div>
                <div style="margin-bottom:14px;">
                    <div style="font-size:13px;margin-bottom:4px;">浏览器</div>
                    <input id="browser" style="width:100%;box-sizing:border-box;padding:6px;"
                           value="${data.browser}">
                </div>
            </div>

            <div style="text-align:right;">
                <button id="cancel" style="margin-right:8px;">取消</button>
                <button id="save">保存</button>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    const enable = wrapper.querySelector("#enable");
    const form = wrapper.querySelector("#form");

    enable.onchange = () => {
        form.style.opacity = enable.checked ? "1" : ".5";
        form.style.pointerEvents = enable.checked ? "auto" : "none";
    };

    wrapper.querySelector("#cancel").onclick = () => wrapper.remove();

    wrapper.querySelector("#save").onclick = () => {
        if (!enable.checked) {
            GM_deleteValue("ccw-change-login-extra");
        } else {
            const value = {
                device: wrapper.querySelector("#device").value.trim(),
                browser: wrapper.querySelector("#browser").value.trim()
            };
            GM_setValue("ccw-change-login-extra", value);
        }
        wrapper.remove();
    };
}

GM_registerMenuCommand("修改登录信息", createUI);
