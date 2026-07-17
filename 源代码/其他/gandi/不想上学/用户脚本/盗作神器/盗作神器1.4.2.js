// ==UserScript==
// @name         盗作神器 Pro
// @version      1.4.2
// @description  一个可以在任何社区保存作品的工具
// @match        https://scratch.mit.edu/*
// @match        https://gonfunko.github.io/scratch-gui/*
// @match        https://aerfaying.com/*
// @match        https://www.ccw.site/*
// @match        https://gitblock.cn/*
// @match        https://world.xiaomawang.com/*
// @match        https://www.cocrea.world/*
// @match        https://create.codelab.club/*
// @match        https://addon.codelab.club/*
// @match        https://www.scratch-cn.cn/*
// @match        https://40code.com/*
// @match        https://turbowarp.org/*
// @match        https://codingclip.com/*
// @match        https://editor.turbowarp.cn/*
// @match        https://0832.ink/rc/*
// @match        https://studio.penguinmod.com/*
// @match        https://codinghou.cn/*
// @match        https://s3player.hetao101.com/*
// @match        https://www.matinslab.com/scratch/*
// @author       不想上学、ZeroInk、博士
// @updateURL    https://431658.dpdns.org/scratch-project-downloader/scratch-project-downloader.user.js
// @downloadURL  https://431658.dpdns.org/scratch-project-downloader/scratch-project-downloader.user.js
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at       document-start
// ==/UserScript==

(function (self) {
    "use strict";
    const spdVersion = "1.4.1";
    const styles = `
        #spd-open {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 18px;
            color: white;
            cursor: pointer;
            border-radius: 25px;
            user-select: none;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            white-space: nowrap;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s ease;
            font-family: 'PingFang', sans-serif;
            opacity: 1;
            line-height: initial;
            touch-action: none;
        }
        #spd-open.spd-hidden {
            opacity: 0 !important;
            pointer-events: none;
        }
        #spd-open:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        #spd-open:active {
            transform: translateY(0);
        }

        #spd-toolbar {
            position: fixed;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(3px);
            border-radius: 12px;
            padding: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 140px;
            cursor: move;
            border: 1px solid rgba(255, 255, 255, 0.5);
            animation: spd-slide-in 0.2s ease;
            transition: opacity 0.3s ease;
            font-family: 'PingFang', sans-serif;
            opacity: 1;
            touch-action: none;
        }
        #spd-toolbar.spd-hidden {
            opacity: 0 !important;
            pointer-events: none;
        }
        #spd-toolbar button {
            padding: 8px 12px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.15s;
            user-select: none;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            touch-action: manipulation;
        }
        #spd-toolbar button.spd-processing {
            opacity: 0.6;
            cursor: wait;
            pointer-events: none;
        }
        #spd-toolbar button:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        #spd-toolbar button:active {
            transform: translateY(0);
        }
        #spd-toolbar .save-project { background: linear-gradient(135deg, #4caf50, #45a049); }
        #spd-toolbar .save-sprite { background: linear-gradient(135deg, #2196F3, #0b7dda); }
        #spd-toolbar .about-btn { background: linear-gradient(135deg, #9c27b0, #7b1fa2); }
        #spd-toolbar .close-btn { background: linear-gradient(135deg, #f44336, #d32f2f); }

        /* 模态框通用样式 */
        .spd-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: spd-fade-in 0.2s ease;
            font-family: 'PingFang', sans-serif;
            transition: opacity 0.2s ease;
        }
        .spd-modal-content {
            background: #14141f;
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: spd-scale-in 0.2s ease;
            border: 1px solid #808080;
        }
        .spd-modal-content h3 {
            margin: 0 0 12px 0;
            color: #aaa;
            font-size: 20px;
            font-weight: 600;
        }
        .spd-modal-content p {
            margin: 8px 0;
            color: #999;
            line-height: 1.5;
            white-space: pre-line;
        }
        .spd-modal-content hr {
            margin: 16px 0;
            border-color: #eee;
        }
        .spd-modal-content input {
            width: 100%;
            padding: 10px;
            margin: 16px 0;
            background: #1e1e2a;
            border: 1px solid #808080;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-family: 'PingFang', sans-serif;
            box-sizing: border-box;
        }
        .spd-modal-content input:focus {
            outline: none;
            border-color: #667eea;
        }
        .spd-modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 16px;
        }
        .spd-modal-btn {
            padding: 8px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.15s;
            font-family: 'PingFang', sans-serif;
        }
        .spd-modal-btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        .spd-modal-btn-secondary {
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
        }
        .spd-modal-btn-neutral {
            background: linear-gradient(135deg, #6c757d, #495057);
            color: white;
        }
        .spd-modal-btn-primary:hover, .spd-modal-btn-secondary:hover, .spd-modal-btn-neutral:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        .spd-modal-btn-primary:active, .spd-modal-btn-secondary:active, .spd-modal-btn-neutral:active {
            transform: translateY(0);
        }

        /* 作者链接样式 */
        .spd-author {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            margin: 4px;
            background: linear-gradient(135deg, #2a2a3a, #1e1e2a);
            border-radius: 20px;
            color: #9c88ff;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid rgba(156, 136, 255, 0.3);
        }
        .spd-author:hover {
            background: linear-gradient(135deg, #9c88ff, #7f5fff);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(156, 136, 255, 0.3);
            border-color: transparent;
        }
        .spd-author:active {
            transform: translateY(0);
        }
        .spd-author::before {
            content: "👤";
            font-size: 12px;
        }
        .spd-authors {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 12px 0 8px 0;
            justify-content: center;
        }

        * {
            -webkit-tap-highlight-color: transparent;
        }

        @keyframes spd-slide-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spd-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes spd-scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;

    // ==================== 工具函数 ====================

    function download(blob, name) {
        const url = URL.createObjectURL(blob);
        GM_download({ url, name });
    }

    // 检测 JSZip 是否可用
    function hasJSZip(vm) {
        try {
            return vm?.exports?.JSZip !== undefined && typeof vm.exports.JSZip === 'function';
        } catch (e) {
            return false;
        }
    }

    // 包装按钮，添加处理中状态
    function withProcessing(button, asyncFn) {
        return async (e) => {
            e?.stopPropagation();

            if (button.classList.contains("spd-processing")) {
                return;
            }

            button.classList.add("spd-processing");

            try {
                await asyncFn(button);
            } finally {
                button.classList.remove("spd-processing");
            }
        };
    }

    // 通用拖拽函数（支持鼠标和触摸）
    function makeDraggable(element, onDragStart, onDrag, onDragEnd) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        const getClientPos = (e) => {
            const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
            const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
            return { clientX, clientY };
        };

        const onPointerDown = (e) => {
            const target = e.target;
            if (target.tagName === "BUTTON") return;

            isDragging = true;
            const { clientX, clientY } = getClientPos(e);
            startX = clientX;
            startY = clientY;

            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            element.style.cursor = "grabbing";
            e.preventDefault();

            if (onDragStart) onDragStart(e);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const { clientX, clientY } = getClientPos(e);
            const dx = clientX - startX;
            const dy = clientY - startY;

            let left = startLeft + dx;
            let top = startTop + dy;

            if (onDrag) {
                const result = onDrag(left, top);
                if (result) {
                    left = result.left;
                    top = result.top;
                }
            }

            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.right = "auto";
            element.style.bottom = "auto";
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";
            if (onDragEnd) onDragEnd(e);
        };

        element.addEventListener("mousedown", onPointerDown);
        element.addEventListener("touchstart", onPointerDown, { passive: false });
        document.addEventListener("mousemove", onPointerMove);
        document.addEventListener("touchmove", onPointerMove, { passive: false });
        document.addEventListener("mouseup", onPointerUp);
        document.addEventListener("touchend", onPointerUp);

        return () => {
            element.removeEventListener("mousedown", onPointerDown);
            element.removeEventListener("touchstart", onPointerDown);
            document.removeEventListener("mousemove", onPointerMove);
            document.removeEventListener("touchmove", onPointerMove);
            document.removeEventListener("mouseup", onPointerUp);
            document.removeEventListener("touchend", onPointerUp);
        };
    }

    // ==================== VM 获取逻辑 ====================
    let vm = null, _bind = Function.prototype.bind;

    async function getVM() {
        let _vm;
        if (self.eureka) {
            _vm = self.eureka.vm;
            console.log("通过 Eureka 获取到 vm", _vm)
        }
        if (document.readyState === "complete") {
            _vm = getReduxStoreFromDOM()?.getState()?.scratchGui?.vm;
            console.log("通过 DOM 获取到 vm", _vm)
        } else {
            try {
                _vm = await trapViaBind();
                console.log("通过 Bind 获取到 vm", _vm);
            } catch {}
        }
        if (_vm) {
            return vm = _vm;
        } else {
            throw console.warn("获取 vm 失败");
        }
    }

    function trapViaBind(timeout = 15000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject("获取VM超时"), timeout);
            Function.prototype.bind = function(thisArg, ...args) {
                if (thisArg && thisArg.runtime && thisArg.greenFlag) {
                    console.log("vm", thisArg);
                    Function.prototype.bind = _bind;
                    resolve(thisArg);
                }
                return _bind.call(this, thisArg, ...args);
            };
        });
    }

    function getReduxStoreFromDOM() {
        try {
            if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                for (const root of window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots?.(1) || []) {
                    const state = findReduxStore(root);
                    if (state) return state;
                }
            }

            const elements = document.querySelectorAll("*");
            for (const el of elements) {
                try {
                    const key = Object.keys(el).find(k => k.includes("__reactContainer"));
                    if (key && el[key]) {
                        const result = searchReactTreeSafe(el[key]);
                        if (result) return result;
                    }
                } catch (e) {
                    continue;
                }
            }
        } catch (e) {
            console.warn("获取Redux Store失败", e);
        }
        return null;

        function findReduxStore(obj, seen = new Set()) {
            if (!obj || seen.has(obj)) return null;
            seen.add(obj);

            try {
                if (obj?.memoizedState?.state?.scratchGui?.vm) {
                    return obj.memoizedState.state;
                }
                if (obj?.stateNode?.state?.scratchGui?.vm) {
                    return obj.stateNode;
                }
                if (obj?.getState?.()?.scratchGui?.vm) {
                    return obj;
                }

                for (const key in obj) {
                    if (obj[key] && typeof obj[key] === "object") {
                        const result = findReduxStore(obj[key], seen);
                        if (result) return result;
                    }
                }
            } catch (e) {}
            return null;
        }

        function searchReactTreeSafe(obj, seen = new Set()) {
            if (!obj || seen.has(obj)) return null;
            seen.add(obj);

            try {
                if (obj.getState) {
                    const state = obj.getState();
                    if (state?.scratchGui?.vm && state.scratchPaint) {
                        return obj;
                    }
                }

                for (const key in obj) {
                    if (obj[key] && typeof obj[key] === "object") {
                        const result = searchReactTreeSafe(obj[key], seen);
                        if (result) return result;
                    }
                }
            } catch (e) {}
            return null;
        }
    }

    function isLoaded() {
        if (!vm?.runtime) return false;
        return !!(vm.runtime._loaded ||
            (vm.runtime.targets && vm.runtime.getTargetForStage()) ||
            vm.runtime.projectData ||
            vm.runtime._steppingInterval)
    }

    function waitLoaded() {
        return new Promise(resolve => {
            if (isLoaded()) resolve(console.log("作品已加载完成"));
            const check = setInterval(() => {
                if (isLoaded()) {
                    resolve(console.log("作品加载完成"));
                    clearInterval(check);
                }
            }, 100)
        });
    }

    // ==================== 保存功能 ====================
    async function saveProject() {
        try {
            const blob = await vm.saveProjectSb3();

            showModal({
                title: "💾 保存作品",
                message: "请输入文件名：",
                inputPlaceholder: "Project.sb3",
                defaultValue: "Project.sb3",
                onConfirm: (name) => {
                    if (name) {
                        if (!name.endsWith(".sb3")) name += ".sb3";
                        download(blob, name);
                    }
                }
            });
        } catch (e) {
            console.error("保存作品失败", e);
            showModal({
                title: "❌ 保存失败",
                message: e.message || "保存作品时发生错误",
                onConfirm: () => {}
            });
        }
    }

    async function saveSprite(el) {
        try {
            const all = [], targets = vm.runtime.targets, _t = el.textContent;
            el.textContent = `0 / ${targets.length}`;
            for (const i in targets) {
                const target = targets[i];
                !target.isStage && all.push({
                    blob: await vm.exportSprite(target.id),
                    name: `${target.getName()}.sprite3`
                });
                el.textContent = `${i} / ${targets.length}`;
            }

            const stage = vm.runtime.getTargetForStage();
            stage.isStage = false;
            all.push({
                blob: await vm.exportSprite(stage.id),
                name: `舞台.sprite3`
            });
            stage.isStage = true;

            el.textContent = _t;

            if (!hasJSZip(vm)) {
                showModal({
                    title: "⚠️ 提示",
                    message: "当前环境不支持 ZIP 压缩功能，将逐个保存文件。",
                    confirmText: "继续",
                    onConfirm: async () => {
                        for (const { blob, name } of all) download(blob, name);
                    }
                });
                return;
            }

            // 使用三按钮模态框
            showModalWithThreeButtons({
                title: "🎨 保存所有角色",
                message: "请选择保存模式：",
                button1Text: "压缩为 ZIP",
                button1Class: "spd-modal-btn-primary",
                button1Action: async () => {
                    const JSZip = vm.exports.JSZip;
                    const zip = new JSZip();
                    for (const { blob, name } of all) {
                        zip.file(name, blob);
                    }

                    showModal({
                        title: "📦 保存 ZIP 压缩包",
                        message: "请输入文件名：",
                        inputPlaceholder: "Project.zip",
                        defaultValue: "Project.zip",
                        onConfirm: async (name) => {
                            if (name) {
                                if (!name.endsWith(".zip")) name += ".zip";
                                const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
                                download(blob, name);
                            }
                        }
                    });
                },
                button2Text: "逐个保存",
                button2Class: "spd-modal-btn-secondary",
                button2Action: () => {
                    for (const { blob, name } of all) download(blob, name);
                },
                button3Text: "取消",
                button3Class: "spd-modal-btn-neutral",
                button3Action: () => {
                    // 什么都不做，只是关闭模态框
                }
            });
        } catch (e) {
            console.error("保存角色失败", e);
            showModal({
                title: "❌ 保存失败",
                message: e.message || "保存角色时发生错误",
                onConfirm: () => {}
            });
        }
    }

    // ==================== UI 创建 ====================
    let host, shadowRoot;
    let currentModal = null;

    // 标准两按钮模态框
    function showModal(options) {
        const { title, message, inputPlaceholder, onConfirm, onCancel, confirmText = "确定", cancelText = "取消" } = options;

        if (currentModal) {
            currentModal.remove();
        }

        const modal = document.createElement("div");
        modal.className = "spd-modal";

        let inputHtml = "";
        if (inputPlaceholder !== undefined) {
            inputHtml = `<input type="text" id="spd-modal-input" placeholder="${inputPlaceholder}" value="${options.defaultValue || ''}">`;
        }

        modal.innerHTML = `
            <div class="spd-modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                ${inputHtml}
                <div class="spd-modal-buttons">
                    <button class="spd-modal-btn spd-modal-btn-secondary" id="spd-modal-cancel">${cancelText}</button>
                    <button class="spd-modal-btn spd-modal-btn-primary" id="spd-modal-confirm">${confirmText}</button>
                </div>
            </div>
        `;

        shadowRoot.appendChild(modal);
        currentModal = modal;

        const closeModal = () => {
            if (!modal.isConnected) return;
            modal.style.opacity = "0";
            modal.style.pointerEvents = "none";
            setTimeout(() => {
                modal.remove();
                if (currentModal === modal) currentModal = null;
            }, 200);
        };

        const confirmBtn = modal.querySelector("#spd-modal-confirm");
        const cancelBtn = modal.querySelector("#spd-modal-cancel");
        const input = modal.querySelector("#spd-modal-input");

        if (input && options.defaultValue !== undefined) {
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        }

        confirmBtn.onclick = () => {
            const value = input ? input.value : null;
            closeModal();
            if (onConfirm) onConfirm(value);
        };

        cancelBtn.onclick = () => {
            closeModal();
            if (onCancel) onCancel();
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
                if (onCancel) onCancel();
            }
        };

        if (input) {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    confirmBtn.click();
                }
            });
        }
    }

    // 三按钮模态框
    function showModalWithThreeButtons(options) {
        const { title, message, button1Text, button1Class, button1Action, button2Text, button2Class, button2Action, button3Text, button3Class, button3Action } = options;

        if (currentModal) {
            currentModal.remove();
        }

        const modal = document.createElement("div");
        modal.className = "spd-modal";

        modal.innerHTML = `
            <div class="spd-modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="spd-modal-buttons">
                    <button class="spd-modal-btn ${button3Class}" id="spd-modal-btn3">${button3Text}</button>
                    <button class="spd-modal-btn ${button2Class}" id="spd-modal-btn2">${button2Text}</button>
                    <button class="spd-modal-btn ${button1Class}" id="spd-modal-btn1">${button1Text}</button>
                </div>
            </div>
        `;

        shadowRoot.appendChild(modal);
        currentModal = modal;

        const closeModal = () => {
            if (!modal.isConnected) return;
            modal.style.opacity = "0";
            modal.style.pointerEvents = "none";
            setTimeout(() => {
                modal.remove();
                if (currentModal === modal) currentModal = null;
            }, 200);
        };

        const btn1 = modal.querySelector("#spd-modal-btn1");
        const btn2 = modal.querySelector("#spd-modal-btn2");
        const btn3 = modal.querySelector("#spd-modal-btn3");

        btn1.onclick = () => {
            closeModal();
            if (button1Action) button1Action();
        };

        btn2.onclick = () => {
            closeModal();
            if (button2Action) button2Action();
        };

        btn3.onclick = () => {
            closeModal();
            if (button3Action) button3Action();
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
                if (button3Action) button3Action();
            }
        };
    }

    function createUI() {
        host?.remove();

        host = document.createElement("div");
        shadowRoot = host.attachShadow({ mode: "closed" });

        const styleElem = document.createElement("style");
        styleElem.textContent = styles;
        shadowRoot.appendChild(styleElem);

        function showAboutModal() {
            showModal({
                title: "🔧 盗作神器 Pro",
                message: `版本: ${spdVersion}\n\n一个可以在任何社区保存作品的工具\n\n📦 功能特性：\n• 保存完整作品文件 (.sb3)\n• 导出所有角色和舞台 (.sprite3)\n• 导出所有角色为 Zip 压缩包\n\n👥 开发者：`,
                confirmText: "打开 GitHub",
                cancelText: "关闭",
                onConfirm: () => {
                    window.open("https://github.com/431658/scratch-project-downloader", "_blank");
                },
                onCancel: () => {}
            });

            // 添加作者链接
            setTimeout(() => {
                const modalContent = shadowRoot.querySelector(".spd-modal-content");
                if (modalContent) {
                    const authorsDiv = document.createElement("div");
                    authorsDiv.className = "spd-authors";
                    authorsDiv.innerHTML = `
                        <a href="https://github.com/431658" target="_blank" class="spd-author">不想上学</a>
                        <a href="https://github.com/431658" target="_blank" class="spd-author">ZeroInk</a>
                        <span class="spd-author" style="pointer-events: none; cursor: default;">博士</span>
                    `;
                    const p = modalContent.querySelector("p");
                    if (p) {
                        p.insertAdjacentElement("afterend", authorsDiv);
                    }
                }
            }, 10);
        }

        const toolbar = document.createElement("div");
        toolbar.id = "spd-toolbar";
        toolbar.classList.add("spd-hidden");

        const saveProjectBtn = document.createElement("button");
        saveProjectBtn.textContent = "💾 保存作品";
        saveProjectBtn.className = "save-project";
        saveProjectBtn.onclick = withProcessing(saveProjectBtn, saveProject);

        const saveSpriteBtn = document.createElement("button");
        saveSpriteBtn.textContent = "🎨 保存所有角色";
        saveSpriteBtn.className = "save-sprite";
        saveSpriteBtn.onclick = withProcessing(saveSpriteBtn, saveSprite);

        const aboutBtn = document.createElement("button");
        aboutBtn.textContent = "ℹ️ 关于";
        aboutBtn.className = "about-btn";
        aboutBtn.onclick = (e) => {
            e.stopPropagation();
            showAboutModal();
        };

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "❌ 关闭";
        closeBtn.className = "close-btn";
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            toolbar.classList.add("spd-hidden");
            setTimeout(() => {
                showButtonAtPosition(openButton, e.clientX, e.clientY);
            }, 300);
        };

        toolbar.appendChild(saveProjectBtn);
        toolbar.appendChild(saveSpriteBtn);
        toolbar.appendChild(aboutBtn);
        toolbar.appendChild(closeBtn);

        // 工具栏拖拽
        const boundToolbarDrag = (left, top) => {
            const w = toolbar.offsetWidth, h = toolbar.offsetHeight;
            left = Math.max(5, Math.min(left, window.innerWidth - w - 5));
            top = Math.max(5, Math.min(top, window.innerHeight - h - 5));
            return { left, top };
        };
        makeDraggable(toolbar, null, boundToolbarDrag, null);

        const openButton = document.createElement("div");
        openButton.id = "spd-open";
        openButton.style.bottom = "20px";
        openButton.style.right = "20px";

        function getVMButton() {
            buttonState = 0;
            updateButtonState();
            getVM().then(() => {
                buttonState = 3;
                updateButtonState();
                waitLoaded().then(() => {
                    buttonState = 1;
                    updateButtonState();
                })
            }).catch((e) => {
                console.error("获取VM失败", e);
                buttonState = 2;
                updateButtonState();
            });
        }

        let buttonState = 0;
        const updateButtonState = () => {
            const states = [
                { text: "⏳ 正在获取 VM", bg: "linear-gradient(135deg, #ff9800, #f57c00)" },
                { text: "🔧 打开菜单", bg: "linear-gradient(135deg, #4682b4, #90ee90)" },
                { text: "❌ 获取 VM 失败，双击重试", bg: "linear-gradient(135deg, #f44336, #d32f2f)" },
                { text: "⏳ 等待加载完成", bg: "linear-gradient(135deg, #ff9800, #f57c00)" }
            ];
            const state = states[buttonState];
            openButton.textContent = state.text;
            openButton.style.background = state.bg;
        };

        updateButtonState();

        // 按钮拖拽
        let isDraggingBtn = false, hasMoved = false;
        let btnDragStart = { x: 0, y: 0 }, btnStartPos = { left: 0, top: 0 };

        const getClientPos = (e) => {
            const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
            const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
            return { clientX, clientY };
        };

        const onBtnPointerDown = (e) => {
            const target = e.target;
            if (target !== openButton) return;

            e.preventDefault();
            e.stopPropagation();
            isDraggingBtn = true;
            hasMoved = false;
            const { clientX, clientY } = getClientPos(e);
            btnDragStart = { x: clientX, y: clientY };
            const rect = openButton.getBoundingClientRect();
            btnStartPos = { left: rect.left, top: rect.top };
            openButton.style.cursor = "grabbing";
        };

        const onBtnPointerMove = (e) => {
            if (!isDraggingBtn) return;
            e.preventDefault();

            const { clientX, clientY } = getClientPos(e);
            const dx = clientX - btnDragStart.x;
            const dy = clientY - btnDragStart.y;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

            let left = btnStartPos.left + dx;
            let top = btnStartPos.top + dy;

            const w = openButton.offsetWidth, h = openButton.offsetHeight;
            left = Math.max(5, Math.min(left, window.innerWidth - w - 5));
            top = Math.max(5, Math.min(top, window.innerHeight - h - 5));

            openButton.style.left = left + "px";
            openButton.style.top = top + "px";
            openButton.style.right = "auto";
            openButton.style.bottom = "auto";
        };

        const onBtnPointerUp = (e) => {
            if (isDraggingBtn) {
                isDraggingBtn = false;
                openButton.style.cursor = "pointer";
                if (!hasMoved) {
                    if (buttonState === 1) {
                        openButton.classList.add("spd-hidden");
                        showToolbarAtMouse(toolbar, e.clientX ?? (e.changedTouches?.[0]?.clientX ?? 0), e.clientY ?? (e.changedTouches?.[0]?.clientY ?? 0));
                    } else if (buttonState == 2) {
                        getVMButton();
                    }
                }
                hasMoved = false;
            }
        };

        openButton.addEventListener("mousedown", onBtnPointerDown);
        openButton.addEventListener("touchstart", onBtnPointerDown, { passive: false });
        document.addEventListener("mousemove", onBtnPointerMove);
        document.addEventListener("touchmove", onBtnPointerMove, { passive: false });
        document.addEventListener("mouseup", onBtnPointerUp);
        document.addEventListener("touchend", onBtnPointerUp);

        function showToolbarAtMouse(toolbar, x, y) {
            toolbar.classList.remove("spd-hidden");
            toolbar.style.opacity = "0";

            const h = toolbar.offsetHeight, w = toolbar.offsetWidth;
            let top = y - h - 10;
            let left = x - w / 2;

            if (top < 10) top = y + 10;
            if (top + h > window.innerHeight - 10) top = window.innerHeight - h - 10;
            left = Math.max(10, Math.min(left, window.innerWidth - w - 10));

            toolbar.style.left = left + "px";
            toolbar.style.top = top + "px";
            toolbar.style.right = "auto";
            toolbar.style.bottom = "auto";

            setTimeout(() => {
                toolbar.style.opacity = "1";
            }, 10);
        }

        function showButtonAtPosition(btn, x, y) {
            const w = btn.offsetWidth, h = btn.offsetHeight;
            let left = x - w / 2;
            let top = y - h / 2;
            left = Math.max(5, Math.min(left, window.innerWidth - w - 5));
            top = Math.max(5, Math.min(top, window.innerHeight - h - 5));

            btn.style.left = left + "px";
            btn.style.top = top + "px";
            btn.style.right = "auto";
            btn.style.bottom = "auto";

            btn.classList.remove("spd-hidden");
        }

        getVMButton();

        shadowRoot.appendChild(toolbar);
        shadowRoot.appendChild(openButton);

        const inject = () => {
            if (document.body) {
                document.body.appendChild(host);
            } else {
                setTimeout(inject, 100);
            }
        };
        inject();
    }

    if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand("重新创建UI", createUI);
    createUI();
})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);