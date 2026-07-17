// ==UserScript==
// @name         屏蔽协作记录
// @version      1.0.1
// @description  让协作成员看不到你的协作记录，包括任何修改作品、进入协作、退出协作通知
// @match        https://*.ccw.site/gandi*
// @author       不想上学
// @run-at       document-start
// ==/UserScript==

function patch(obj, p, fn) {
    if (obj[p]) obj[p] = fn(obj[p]);
}
function tryParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return;
    }
}
function patchData(data) {
    if (data[0] == "project") {
        data[1].author = "61039f14fffbe5461b880787";
    } else if (data[0] == "log") {
        console.log("已屏蔽", data);
        return [];
    }
    return data;
}
function patchWebSocket() {
    const WS = WebSocket.prototype;
    patch(
        WS,
        "send",
        _send =>
            function (data) {
                if (this.url.startsWith("wss://mp2.ccw.site/multiplayer/")) {
                    let json = tryParse(data);
                    if (json) {
                        data = JSON.stringify(patchData(json));
                    }
                }
                return _send.apply(this, arguments);
            }
    );
}
patchWebSocket();