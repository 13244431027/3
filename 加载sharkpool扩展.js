

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("SharkPool Gallery Loader 必须以 unsandboxed 模式运行。");
    }

    const vm = Scratch.vm;

    const EXTENSION_ID = "sharkpoolGalleryLoader";

    const REPO_OWNER = "SharkPool-SP";
    const REPO_NAME = "SharkPools-Extensions";
    const BRANCH = "main";

    const RAW_BASE =
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/${BRANCH}`;

    const API_BASE =
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

    const EXTENSION_KEYS_PATH = "Gallery Files/Extension-Keys.json";
    const EXTENSION_CODE_DIR = "extension-code";
    const EXTENSION_THUMB_DIR = "extension-thumbs";

    let galleryData = null;
    let lastOpenPanel = null;
    let currentlyLoading = new Set();
    let loadedExtensions = new Set();

    function htmlEscape(str) {
        return String(str ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function githubApiUrl(path) {
        return `${API_BASE}/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(BRANCH)}`;
    }

    function rawUrl(path) {
        return `${RAW_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
    }

    function decodeBase64Unicode(base64) {
        const binary = atob(base64.replace(/\n/g, ""));
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        return new TextDecoder("utf-8").decode(bytes);
    }

    async function fetchTextViaGitHubAPI(path) {
        const url = githubApiUrl(path);

        const res = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            },
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error(`GitHub API 请求失败：${res.status}`);
        }

        const json = await res.json();

        if (!json.content) {
            throw new Error("GitHub API 返回内容为空。");
        }

        return decodeBase64Unicode(json.content);
    }

    async function fetchTextSmart(path) {
        try {
            return await fetchTextViaGitHubAPI(path);
        } catch (apiError) {
            console.warn("[SharkPool Gallery] GitHub API 失败，回退 Raw：", apiError);

            const res = await fetch(rawUrl(path), {
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error(`Raw 请求失败：${res.status}`);
            }

            return await res.text();
        }
    }

    async function fetchJsonSmart(path) {
        const text = await fetchTextSmart(path);
        return JSON.parse(text);
    }

    function getCodeUrlByInfo(info) {
        return rawUrl(`${EXTENSION_CODE_DIR}/${info.url}`);
    }

    function getCodePathByInfo(info) {
        return `${EXTENSION_CODE_DIR}/${info.url}`;
    }

    function getThumbUrlByInfo(info) {
        return rawUrl(`${EXTENSION_THUMB_DIR}/${info.banner}`);
    }

    async function loadGalleryData(force = false) {
        if (galleryData && !force) return galleryData;

        galleryData = await fetchJsonSmart(EXTENSION_KEYS_PATH);

        if (!galleryData || !galleryData.extensions) {
            throw new Error("扩展列表格式无效。");
        }

        return galleryData;
    }

    async function loadExternalExtension(key) {
        const data = await loadGalleryData(false);
        const info = data.extensions[key];

        if (!info) {
            throw new Error(`找不到扩展：${key}`);
        }

        if (!info.url) {
            throw new Error(`扩展 ${key} 没有 url 字段。`);
        }

        const url = getCodeUrlByInfo(info);

        if (currentlyLoading.has(key)) {
            return;
        }

        currentlyLoading.add(key);

        try {
            await vm.extensionManager.loadExtensionURL(url);
            loadedExtensions.add(key);
        } finally {
            currentlyLoading.delete(key);
        }
    }

    function injectStyles() {
        if (document.getElementById("sp-gallery-loader-style")) return;

        const style = document.createElement("style");
        style.id = "sp-gallery-loader-style";
        style.textContent = `
            .spgl-overlay {
                position: fixed;
                inset: 0;
                z-index: 999999999;
                background: rgba(0, 0, 0, 0.55);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Inter, "Segoe UI", Arial, sans-serif;
                color: #eaf2ff;
            }

            .spgl-window {
                width: min(1120px, calc(100vw - 32px));
                height: min(760px, calc(100vh - 32px));
                background: #111827;
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 18px;
                box-shadow: 0 24px 80px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .spgl-header {
                padding: 14px 18px;
                background: linear-gradient(135deg, #0f172a, #1e3a8a);
                border-bottom: 1px solid rgba(255,255,255,0.12);
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .spgl-title {
                font-size: 18px;
                font-weight: 800;
                flex: 1;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .spgl-title-badge {
                font-size: 11px;
                padding: 3px 8px;
                border-radius: 999px;
                background: rgba(96, 165, 250, 0.22);
                color: #bfdbfe;
                border: 1px solid rgba(147,197,253,0.3);
            }

            .spgl-close,
            .spgl-btn {
                border: 0;
                border-radius: 10px;
                padding: 8px 12px;
                background: #2563eb;
                color: white;
                font-weight: 700;
                cursor: pointer;
                transition: 0.15s ease;
            }

            .spgl-close:hover,
            .spgl-btn:hover {
                filter: brightness(1.12);
                transform: translateY(-1px);
            }

            .spgl-close {
                background: rgba(255,255,255,0.12);
                font-size: 18px;
                padding: 6px 11px;
            }

            .spgl-toolbar {
                padding: 12px 16px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
                background: #0b1220;
            }

            .spgl-input,
            .spgl-select {
                background: #020617;
                color: #eaf2ff;
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 10px;
                padding: 9px 11px;
                outline: none;
            }

            .spgl-input {
                min-width: 240px;
                flex: 1;
            }

            .spgl-check {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                font-size: 13px;
                color: #cbd5e1;
                user-select: none;
            }

            .spgl-status {
                font-size: 12px;
                color: #93c5fd;
                min-width: 120px;
                text-align: right;
            }

            .spgl-list-wrap {
                flex: 1;
                position: relative;
                overflow-y: auto;
                background:
                    radial-gradient(circle at top left, rgba(37,99,235,0.14), transparent 320px),
                    #0f172a;
            }

            .spgl-spacer {
                position: relative;
                width: 100%;
            }

            .spgl-card {
                position: absolute;
                left: 14px;
                right: 14px;
                height: 126px;
                display: grid;
                grid-template-columns: 180px 1fr auto;
                gap: 14px;
                align-items: center;
                background: rgba(15,23,42,0.92);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                padding: 12px;
                box-sizing: border-box;
                box-shadow: 0 10px 28px rgba(0,0,0,0.22);
            }

            .spgl-thumb {
                width: 180px;
                height: 96px;
                border-radius: 12px;
                background: #020617;
                object-fit: cover;
                border: 1px solid rgba(255,255,255,0.1);
            }

            .spgl-card-title {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                font-size: 16px;
                font-weight: 800;
                margin-bottom: 5px;
            }

            .spgl-deprecated {
                color: #fecaca;
                background: rgba(239,68,68,0.16);
                border: 1px solid rgba(248,113,113,0.3);
                padding: 2px 7px;
                border-radius: 999px;
                font-size: 11px;
            }

            .spgl-desc {
                color: #cbd5e1;
                font-size: 13px;
                line-height: 1.35;
                margin-bottom: 8px;
            }

            .spgl-meta {
                color: #94a3b8;
                font-size: 12px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .spgl-tag {
                display: inline-block;
                background: rgba(59,130,246,0.15);
                color: #bfdbfe;
                border: 1px solid rgba(147,197,253,0.18);
                border-radius: 999px;
                padding: 2px 7px;
            }

            .spgl-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 116px;
            }

            .spgl-btn.secondary {
                background: #334155;
            }

            .spgl-btn.green {
                background: #16a34a;
            }

            .spgl-btn.warn {
                background: #ca8a04;
            }

            .spgl-btn.danger {
                background: #dc2626;
            }

            .spgl-btn:disabled {
                opacity: 0.55;
                cursor: not-allowed;
                transform: none;
            }

            .spgl-modal {
                position: fixed;
                inset: 0;
                z-index: 1000000000;
                background: rgba(0,0,0,0.62);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #eaf2ff;
                font-family: Inter, "Segoe UI", Arial, sans-serif;
            }

            .spgl-modal-box {
                width: min(860px, calc(100vw - 40px));
                max-height: min(760px, calc(100vh - 40px));
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background: #111827;
                border-radius: 16px;
                border: 1px solid rgba(255,255,255,0.12);
                box-shadow: 0 24px 80px rgba(0,0,0,0.55);
            }

            .spgl-modal-head {
                padding: 13px 16px;
                background: #0b1220;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .spgl-modal-title {
                flex: 1;
                font-weight: 800;
                font-size: 16px;
            }

            .spgl-modal-body {
                overflow: auto;
                padding: 16px;
            }

            .spgl-info-grid {
                display: grid;
                grid-template-columns: 140px 1fr;
                gap: 9px 14px;
                font-size: 14px;
            }

            .spgl-info-grid b {
                color: #93c5fd;
            }

            .spgl-code {
                background: #020617;
                color: #dbeafe;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.1);
                padding: 14px;
                overflow: auto;
                font-size: 12px;
                line-height: 1.5;
                max-height: 560px;
                tab-size: 4;
                white-space: pre;
            }

            .spgl-kw { color: #93c5fd; font-weight: 700; }
            .spgl-str { color: #86efac; }
            .spgl-com { color: #64748b; font-style: italic; }
            .spgl-num { color: #fbbf24; }
            .spgl-lit { color: #f0abfc; }

            @media (max-width: 780px) {
                .spgl-card {
                    grid-template-columns: 100px 1fr;
                    height: 168px;
                }

                .spgl-thumb {
                    width: 100px;
                    height: 78px;
                }

                .spgl-actions {
                    grid-column: 1 / -1;
                    flex-direction: row;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function simpleHighlightJS(code) {
        let out = htmlEscape(code);

        const placeholders = [];
        const save = html => {
            const id = `___SPGL_TOKEN_${placeholders.length}___`;
            placeholders.push([id, html]);
            return id;
        };

        out = out.replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, m => {
            return save(`<span class="spgl-com">${m}</span>`);
        });

        out = out.replace(/(`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*")/g, m => {
            return save(`<span class="spgl-str">${m}</span>`);
        });

        out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, `<span class="spgl-num">$1</span>`);

        out = out.replace(/\b(const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|await|async|import|export|from|default|extends|super|this|typeof|instanceof|in|of|yield|static|get|set)\b/g,
            `<span class="spgl-kw">$1</span>`
        );

        out = out.replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g,
            `<span class="spgl-lit">$1</span>`
        );

        for (const [id, html] of placeholders) {
            out = out.replaceAll(id, html);
        }

        return out;
    }

    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.zIndex = "1000000002";
        toast.style.right = "18px";
        toast.style.bottom = "18px";
        toast.style.maxWidth = "420px";
        toast.style.padding = "12px 14px";
        toast.style.borderRadius = "12px";
        toast.style.color = "white";
        toast.style.fontFamily = "Inter, Segoe UI, Arial, sans-serif";
        toast.style.fontWeight = "700";
        toast.style.boxShadow = "0 10px 32px rgba(0,0,0,0.35)";
        toast.style.background =
            type === "error" ? "#dc2626" :
            type === "success" ? "#16a34a" :
            "#2563eb";

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = "0.25s ease";
            toast.style.opacity = "0";
            toast.style.transform = "translateY(8px)";
            setTimeout(() => toast.remove(), 280);
        }, 2600);
    }

    function closeModal(modal) {
        if (modal) modal.remove();
    }

    function showInfoModal(key, info) {
        injectStyles();

        const modal = document.createElement("div");
        modal.className = "spgl-modal";

        const tags = Array.isArray(info.tags) ? info.tags : [];

        modal.innerHTML = `
            <div class="spgl-modal-box">
                <div class="spgl-modal-head">
                    <div class="spgl-modal-title">${htmlEscape(key)}</div>
                    <button class="spgl-close" data-close>×</button>
                </div>
                <div class="spgl-modal-body">
                    <div style="display:grid; grid-template-columns:220px 1fr; gap:16px; align-items:start;">
                        <img
                            src="${htmlEscape(getThumbUrlByInfo(info))}"
                            style="width:220px; max-width:100%; border-radius:14px; background:#020617; border:1px solid rgba(255,255,255,0.12);"
                            onerror="this.style.display='none'"
                        >
                        <div class="spgl-info-grid">
                            <b>描述</b>
                            <span>${htmlEscape(info.desc || "无")}</span>

                            <b>作者</b>
                            <span>${htmlEscape(info.creator || "未知")}</span>

                            <b>文件</b>
                            <span>${htmlEscape(info.url || "")}</span>

                            <b>图片</b>
                            <span>${htmlEscape(info.banner || "")}</span>

                            <b>标签</b>
                            <span>${tags.map(t => `<span class="spgl-tag">${htmlEscape(t)}</span>`).join(" ")}</span>

                            <b>状态</b>
                            <span>
                                ${info.isDeprecated ? `<span class="spgl-deprecated">Deprecated / 已弃用</span>` : "正常"}
                            </span>

                            <b>日期</b>
                            <span>${htmlEscape(info.date || "")}</span>
                        </div>
                    </div>

                    <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="spgl-btn green" data-load>加载扩展</button>
                        <button class="spgl-btn secondary" data-code>查看源码</button>
                        <button class="spgl-btn secondary" data-copy-url>复制 Raw URL</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector("[data-close]").onclick = () => closeModal(modal);

        modal.addEventListener("click", e => {
            if (e.target === modal) closeModal(modal);
        });

        modal.querySelector("[data-load]").onclick = async e => {
            const btn = e.currentTarget;
            btn.disabled = true;
            btn.textContent = "加载中...";

            try {
                await loadExternalExtension(key);
                btn.textContent = "已加载";
                showToast(`已加载：${key}`, "success");
            } catch (err) {
                console.error(err);
                btn.disabled = false;
                btn.textContent = "加载扩展";
                showToast(`加载失败：${err.message}`, "error");
            }
        };

        modal.querySelector("[data-code]").onclick = () => {
            showCodeModal(key, info);
        };

        modal.querySelector("[data-copy-url]").onclick = async () => {
            try {
                await navigator.clipboard.writeText(getCodeUrlByInfo(info));
                showToast("已复制扩展 Raw URL", "success");
            } catch {
                showToast(getCodeUrlByInfo(info), "info");
            }
        };
    }

    async function showCodeModal(key, info) {
        injectStyles();

        const modal = document.createElement("div");
        modal.className = "spgl-modal";

        modal.innerHTML = `
            <div class="spgl-modal-box">
                <div class="spgl-modal-head">
                    <div class="spgl-modal-title">${htmlEscape(key)} 源码</div>
                    <button class="spgl-close" data-close>×</button>
                </div>
                <div class="spgl-modal-body">
                    <div style="margin-bottom:10px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="spgl-btn secondary" data-copy>复制代码</button>
                        <button class="spgl-btn secondary" data-raw>打开 Raw</button>
                    </div>
                    <pre class="spgl-code">正在通过 GitHub API 加载源码...</pre>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const codeBox = modal.querySelector(".spgl-code");
        let rawCode = "";

        modal.querySelector("[data-close]").onclick = () => closeModal(modal);
        modal.addEventListener("click", e => {
            if (e.target === modal) closeModal(modal);
        });

        modal.querySelector("[data-copy]").onclick = async () => {
            if (!rawCode) return;
            try {
                await navigator.clipboard.writeText(rawCode);
                showToast("源码已复制", "success");
            } catch {
                showToast("复制失败", "error");
            }
        };

        modal.querySelector("[data-raw]").onclick = () => {
            window.open(getCodeUrlByInfo(info), "_blank", "noopener,noreferrer");
        };

        try {
            rawCode = await fetchTextSmart(getCodePathByInfo(info));
            codeBox.innerHTML = simpleHighlightJS(rawCode);
        } catch (err) {
            console.error(err);
            codeBox.textContent = `源码加载失败：${err.message}`;
        }
    }

    function normalize(str) {
        return String(str || "").toLowerCase();
    }

    function openPanel() {
        injectStyles();

        if (lastOpenPanel && document.body.contains(lastOpenPanel)) {
            lastOpenPanel.remove();
            lastOpenPanel = null;
        }

        const overlay = document.createElement("div");
        overlay.className = "spgl-overlay";

        overlay.innerHTML = `
            <div class="spgl-window">
                <div class="spgl-header">
                    <div class="spgl-title">
                        SharkPool Extensions
                        <span class="spgl-title-badge">GitHub Gallery Loader</span>
                    </div>
                    <button class="spgl-btn secondary" data-refresh>刷新</button>
                    <button class="spgl-close" data-close>×</button>
                </div>

                <div class="spgl-toolbar">
                    <input class="spgl-input" data-search placeholder="搜索扩展、描述、作者、标签...">
                    <select class="spgl-select" data-tag>
                        <option value="All">All</option>
                    </select>
                    <label class="spgl-check">
                        <input type="checkbox" data-hide-deprecated>
                        隐藏弃用
                    </label>
                    <div class="spgl-status" data-status>准备中...</div>
                </div>

                <div class="spgl-list-wrap" data-list>
                    <div class="spgl-spacer" data-spacer></div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        lastOpenPanel = overlay;

        const btnClose = overlay.querySelector("[data-close]");
        const btnRefresh = overlay.querySelector("[data-refresh]");
        const inputSearch = overlay.querySelector("[data-search]");
        const selectTag = overlay.querySelector("[data-tag]");
        const hideDeprecated = overlay.querySelector("[data-hide-deprecated]");
        const status = overlay.querySelector("[data-status]");
        const list = overlay.querySelector("[data-list]");
        const spacer = overlay.querySelector("[data-spacer]");

        btnClose.onclick = () => {
            overlay.remove();
            if (lastOpenPanel === overlay) lastOpenPanel = null;
        };

        overlay.addEventListener("click", e => {
            if (e.target === overlay) {
                overlay.remove();
                if (lastOpenPanel === overlay) lastOpenPanel = null;
            }
        });

        const CARD_HEIGHT = 140;
        const BUFFER = 8;

        let entries = [];
        let filtered = [];
        let rendered = new Map();

        function buildTags(data) {
            const tags = Array.isArray(data["extension-tags"])
                ? data["extension-tags"]
                : ["All"];

            selectTag.innerHTML = tags.map(tag => {
                return `<option value="${htmlEscape(tag)}">${htmlEscape(tag)}</option>`;
            }).join("");
        }

        function applyFilter() {
            const query = normalize(inputSearch.value);
            const tag = selectTag.value;
            const shouldHideDeprecated = hideDeprecated.checked;

            filtered = entries.filter(([key, info]) => {
                if (shouldHideDeprecated && info.isDeprecated) return false;

                const tags = Array.isArray(info.tags) ? info.tags : [];

                if (tag && tag !== "All" && !tags.includes(tag)) {
                    return false;
                }

                if (!query) return true;

                const haystack = normalize([
                    key,
                    info.desc,
                    info.creator,
                    info.url,
                    info.banner,
                    info.date,
                    tags.join(" ")
                ].join(" "));

                return haystack.includes(query);
            });

            spacer.style.height = `${filtered.length * CARD_HEIGHT}px`;
            status.textContent = `${filtered.length} 个扩展`;

            list.scrollTop = 0;
            clearRendered();
            renderVisible();
        }

        function clearRendered() {
            for (const el of rendered.values()) {
                el.remove();
            }
            rendered.clear();
        }

        function createCard(index, key, info) {
            const card = document.createElement("div");
            card.className = "spgl-card";
            card.style.top = `${index * CARD_HEIGHT + 8}px`;

            const tags = Array.isArray(info.tags) ? info.tags : [];

            const loaded = loadedExtensions.has(key);
            const loading = currentlyLoading.has(key);

            card.innerHTML = `
                <img class="spgl-thumb"
                    loading="lazy"
                    src="${htmlEscape(getThumbUrlByInfo(info))}"
                    onerror="this.style.opacity='0.25'; this.alt='No image';"
                >

                <div>
                    <div class="spgl-card-title">
                        <span>${htmlEscape(key)}</span>
                        ${info.isDeprecated ? `<span class="spgl-deprecated">已弃用</span>` : ""}
                    </div>

                    <div class="spgl-desc">${htmlEscape(info.desc || "无描述")}</div>

                    <div class="spgl-meta">
                        <span>作者：${htmlEscape(info.creator || "未知")}</span>
                        <span>${htmlEscape(info.date || "")}</span>
                        ${tags.slice(0, 5).map(t => `<span class="spgl-tag">${htmlEscape(t)}</span>`).join("")}
                    </div>
                </div>

                <div class="spgl-actions">
                    <button class="spgl-btn green" data-load ${loaded || loading ? "disabled" : ""}>
                        ${loaded ? "已加载" : loading ? "加载中" : "加载"}
                    </button>
                    <button class="spgl-btn secondary" data-info>信息</button>
                    <button class="spgl-btn secondary" data-code>源码</button>
                </div>
            `;

            card.querySelector("[data-load]").onclick = async e => {
                const btn = e.currentTarget;
                btn.disabled = true;
                btn.textContent = "加载中";

                try {
                    await loadExternalExtension(key);
                    btn.textContent = "已加载";
                    showToast(`已加载：${key}`, "success");
                } catch (err) {
                    console.error(err);
                    btn.disabled = false;
                    btn.textContent = "加载";
                    showToast(`加载失败：${err.message}`, "error");
                }
            };

            card.querySelector("[data-info]").onclick = () => {
                showInfoModal(key, info);
            };

            card.querySelector("[data-code]").onclick = () => {
                showCodeModal(key, info);
            };

            return card;
        }

        function renderVisible() {
            const scrollTop = list.scrollTop;
            const height = list.clientHeight;

            let start = Math.floor(scrollTop / CARD_HEIGHT) - BUFFER;
            let end = Math.ceil((scrollTop + height) / CARD_HEIGHT) + BUFFER;

            start = Math.max(0, start);
            end = Math.min(filtered.length - 1, end);

            const needed = new Set();

            for (let i = start; i <= end; i++) {
                needed.add(i);

                if (!rendered.has(i)) {
                    const [key, info] = filtered[i];
                    const card = createCard(i, key, info);
                    spacer.appendChild(card);
                    rendered.set(i, card);
                }
            }

            for (const [i, el] of rendered) {
                if (!needed.has(i)) {
                    el.remove();
                    rendered.delete(i);
                }
            }
        }

        let renderRaf = null;

        list.addEventListener("scroll", () => {
            if (renderRaf) cancelAnimationFrame(renderRaf);
            renderRaf = requestAnimationFrame(renderVisible);
        });

        inputSearch.addEventListener("input", applyFilter);
        selectTag.addEventListener("change", applyFilter);
        hideDeprecated.addEventListener("change", applyFilter);

        async function init(force = false) {
            status.textContent = "加载中...";
            clearRendered();

            try {
                const data = await loadGalleryData(force);
                buildTags(data);

                entries = Object.entries(data.extensions || {});
                entries.sort((a, b) => a[0].localeCompare(b[0]));

                applyFilter();

                status.textContent = `${filtered.length} 个扩展`;
                showToast("扩展列表加载完成", "success");
            } catch (err) {
                console.error(err);
                status.textContent = "加载失败";
                spacer.innerHTML = `
                    <div style="padding:24px; color:#fecaca;">
                        加载失败：${htmlEscape(err.message)}
                    </div>
                `;
                showToast(`加载失败：${err.message}`, "error");
            }
        }

        btnRefresh.onclick = async () => {
            btnRefresh.disabled = true;
            btnRefresh.textContent = "刷新中";

            try {
                galleryData = null;
                await init(true);
            } finally {
                btnRefresh.disabled = false;
                btnRefresh.textContent = "刷新";
            }
        };

        init(false);
    }

    class SharkPoolGalleryLoader {
        getInfo() {
            return {
                id: EXTENSION_ID,
                name: "SharkPool Loader",
                color1: "#2563eb",
                color2: "#1d4ed8",
                color3: "#1e40af",
                blocks: [
                    {
                        opcode: "openGallery",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "打开 SharkPool 扩展面板"
                    },
                    {
                        opcode: "refreshGallery",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "刷新 SharkPool 扩展列表缓存"
                    },
                    {
                        opcode: "loadByKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "加载 SharkPool 扩展 [KEY]",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Tune-Shark-V3"
                            }
                        }
                    },
                    {
                        opcode: "isLoaded",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "SharkPool 扩展 [KEY] 已加载?",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Tune-Shark-V3"
                            }
                        }
                    },
                    {
                        opcode: "extensionCount",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SharkPool 扩展数量"
                    },
                    {
                        opcode: "extensionInfo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SharkPool 扩展 [KEY] 信息 JSON",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Tune-Shark-V3"
                            }
                        }
                    },
                    {
                        opcode: "extensionRawUrl",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SharkPool 扩展 [KEY] raw URL",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Tune-Shark-V3"
                            }
                        }
                    }
                ]
            };
        }

        openGallery() {
            openPanel();
        }

        async refreshGallery() {
            galleryData = null;
            await loadGalleryData(true);
            showToast("SharkPool 扩展缓存已刷新", "success");
        }

        async loadByKey(args) {
            const key = String(args.KEY || "").trim();

            if (!key) {
                throw new Error("扩展名不能为空。");
            }

            await loadExternalExtension(key);
            showToast(`已加载：${key}`, "success");
        }

        isLoaded(args) {
            const key = String(args.KEY || "").trim();
            return loadedExtensions.has(key);
        }

        async extensionCount() {
            const data = await loadGalleryData(false);
            return Object.keys(data.extensions || {}).length;
        }

        async extensionInfo(args) {
            const key = String(args.KEY || "").trim();
            const data = await loadGalleryData(false);
            const info = data.extensions?.[key];

            if (!info) return "";

            return JSON.stringify(info);
        }

        async extensionRawUrl(args) {
            const key = String(args.KEY || "").trim();
            const data = await loadGalleryData(false);
            const info = data.extensions?.[key];

            if (!info) return "";

            return getCodeUrlByInfo(info);
        }
    }

    Scratch.extensions.register(new SharkPoolGalleryLoader());
})(Scratch);
