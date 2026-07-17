// ==UserScript==
// @name         ccw伪装手机号
// @version      2.0.1
// @description  在ccw伪装手机号，伪装认证状态，伪装信誉，伪装QQ……
// @match        https://*.ccw.site/*
// @author       不想上学
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==
(function () {
    "use strict";
    let identityAuthRank = "L2", // 修改认证等级
        /*
          L0代表没有手机号认证
          L1代表已经手机号认证，没有实名认证
          L2代表已经身份证认证
          为空代表自动：
            L0自动伪装成L1，可用于绕过绑定手机号直接实名认证
            L1自动伪装成L2，可用于不实名就能在扩展集市发评审
            L1自动伪装成L1，可用于更换实名绑定
        */
        phoneNumber = "12345678901"; // 要伪装的手机号
    function patch(obj, p, fn) {
        if (obj[p]) obj[p] = fn(obj[p]);
    }
    function text(number, str) {
        if (number <= 0) return "";
        return (
            str[Math.floor(Math.random() * str.length)] + text(number - 1, str)
        );
    }
    function patchResponse(json) {
        if (json.disguiseAccount) {
            console.warn("检测到开启了伪装身份，开启了伪装身份之后就不需要伪装手机号了");
            if (!GM_getValue("伪装手机号忽略伪装身份警告", false)) {
                if (confirm("检测到开启了伪装身份，开启了伪装身份之后就不需要伪装手机号了\n是否忽略（忽略后下次不会自动弹出）")) {
                    GM_setValue("伪装手机号忽略伪装身份警告", true);
                }
            }
        }
        if (!json?.body) {
            throw new Error("返回body为空");
        }
        if (!identityAuthRank) {
            identityAuthRank = {
                L0: "L1",
                L1: "L2",
                L2: "L1"
            }[json.body.identityAuthRank];
        }
        json.body.identityAuthRank = identityAuthRank;
        json.body.contactPhone = json.body.currentParent.bindPhone = json.body.accountNumber = phoneNumber
        json.body.currentParent.qqNickname &&= json.body.currentParent.qqNum &&= null;
        if (identityAuthRank == "L2") {
            json.body.fullName ??= "不想上学";
            json.body.identity ??= text(
                18,
                "0123456789"
            );
        }
        json.body.parents?.forEach(parent => {
            parent.distinctId ??= text(
                32,
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            );
            parent.phoneAddr ??= parent.telephone ??= phoneNumber;
        });
        json.body.reputationScore.rank = "EXCELLENT";
        json.body.reputationScore.score = 100;
        return json;
    }
    const XHR = XMLHttpRequest.prototype;
    patch(
        XHR,
        "open",
        _open =>
            function (method, url) {
                if (true) {
                    if (
                        url ==
                        "https://community-web.ccw.site/students/self/detail"
                    ) {
                        // alert("伪装");
                        const _send = this.send;
                        this.send = b => {
                            const _onreadystatechange = this.onreadystatechange;
                            this.onreadystatechange = () => {
                                if (this.readyState === 4) {
                                    try {
                                        const response = JSON.parse(this.response);
                                        const patchedResponse = patchResponse(response);
                                        console.log("伪装手机号已加载");
                                        console.log("修改前", this.response);
                                        console.log("修改后", patchedResponse);
                                        Object.defineProperty(this, "responseText", {
                                            get: () => JSON.stringify(patchedResponse),
                                            configurable: true
                                        });
                                        Object.defineProperty(this, "response", {
                                            get: () => JSON.stringify(patchedResponse),
                                            configurable: true
                                        });
                                    }
                                    catch (e) {
                                        console.error("伪装手机号：", "伪装失败", e);
                                    }
                                }
                                _onreadystatechange.call(this);
                            };
                            return _send.call(this, b);
                        };
                    }
                }
                return _open.call(this, ...arguments);
            }
    );
})();