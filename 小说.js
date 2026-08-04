// 云端书屋 · 小说阅读面板 - TurboWarp 扩展
// 默认面板 100x100，右下角可拉伸

(function (Scratch) {
    'use strict';

    if (!Scratch) return;

    const API_BASE = 'https://apione.apibyte.cn/novelsearch';

    class NovelReaderExtension {
        constructor() {
            this.container = null;
            this.initialized = false;

            this.state = {
                apiKey: localStorage.getItem('novel_api_key') || '',
                theme: localStorage.getItem('novel_theme') || 'light',
                fontSize: +(localStorage.getItem('novel_font_size') || 18),
                lineHeight: +(localStorage.getItem('novel_line_height') || 1.8),
                fontFamily: localStorage.getItem('novel_font_family') || 'sans',
                book: null,
                chapterContent: '',
                shelf: JSON.parse(localStorage.getItem('novel_shelf') || '[]'),
                history: JSON.parse(localStorage.getItem('novel_history') || '[]'),
                _searched: false,
                _returnPage: 'search'
            };
        }

        getInfo() {
            return {
                id: 'cloudbook',
                name: '📚 云端书屋',
                color1: '#5b8def',
                color2: '#3a6fd8',
                color3: '#2a5fb8',
                blocks: [{
                    opcode: 'showReader',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '显示小说阅读面板',
                    func: 'showReader'
                }]
            };
        }

        showReader() {
            if (this.initialized && this.container) {
                this.container.style.display = 'flex';
                return;
            }
            this.buildUI();
            this.initialized = true;
        }

        // ============================================================
        //  UI 构建
        // ============================================================
        buildUI() {
            if (this.container) {
                this.container.style.display = 'flex';
                return;
            }

            const container = document.createElement('div');
            container.id = 'novel-reader-container';
            // 核心样式：固定定位，初始 100x100，右下角拉伸
            container.style.cssText = `
                position: fixed;
                width: 100px;
                height: 100px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                resize: both;
                overflow: hidden;
                z-index: 999999;
                background: var(--novel-bg, #f5f7fb);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
                color: var(--novel-text, #1f2937);
                transition: background .3s, color .3s;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0,0,0,.2);
                min-width: 80px;
                min-height: 80px;
            `;

            this.injectStyles();
            container.innerHTML = this.buildHTML();
            document.body.appendChild(container);
            this.container = container;

            this.applyTheme();
            this.applyReadingStyle();
            this.bindEvents();
            this.updateShelfCount();

            const closeBtn = container.querySelector('#novel-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    container.style.display = 'none';
                });
            }

            const searchInput = container.querySelector('#novel-search-input');
            if (searchInput) setTimeout(() => searchInput.focus(), 200);

            const last = localStorage.getItem('novel_last_page');
            if (last && ['shelf', 'history', 'settings'].includes(last)) {
                this.goPage(last);
            }
        }

        injectStyles() {
            if (document.getElementById('novel-reader-styles')) return;
            const style = document.createElement('style');
            style.id = 'novel-reader-styles';
            style.textContent = `
                :root {
                    --novel-primary: #5b8def;
                    --novel-primary-dark: #3a6fd8;
                    --novel-bg: #f5f7fb;
                    --novel-bg-card: #ffffff;
                    --novel-text: #1f2937;
                    --novel-text-sub: #6b7280;
                    --novel-border: #e5e7eb;
                    --novel-shadow: 0 2px 12px rgba(0,0,0,.06);
                    --novel-shadow-lg: 0 8px 32px rgba(0,0,0,.12);
                    --novel-radius: 12px;
                    --novel-font-size: 18px;
                    --novel-line-height: 1.8;
                    --novel-font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
                }
                [data-novel-theme="sepia"] {
                    --novel-bg: #f4ecd8; --novel-bg-card: #fbf5e6; --novel-text: #3a2e1f; --novel-text-sub: #7a6b54; --novel-border: #e0d4b8;
                }
                [data-novel-theme="green"] {
                    --novel-bg: #cce8cf; --novel-bg-card: #e6f2e0; --novel-text: #2d3a2a; --novel-text-sub: #5d6b58; --novel-border: #b8d4b3;
                }
                [data-novel-theme="dark"] {
                    --novel-bg: #1a1a1f; --novel-bg-card: #24242b; --novel-text: #d6d6dc; --novel-text-sub: #9aa0a6; --novel-border: #34343c;
                }
                [data-novel-theme="black"] {
                    --novel-bg: #000000; --novel-bg-card: #0d0d0d; --novel-text: #b8b8b8; --novel-text-sub: #6a6a6a; --novel-border: #1c1c1c;
                }

                #novel-reader-container * { box-sizing: border-box; margin: 0; padding: 0; }
                #novel-reader-container .novel-navbar {
                    background: var(--novel-bg-card);
                    border-bottom: 1px solid var(--novel-border);
                    padding: 6px 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: var(--novel-shadow);
                    flex-shrink: 0;
                    flex-wrap: wrap;
                }
                #novel-reader-container .novel-navbar h1 {
                    font-size: 16px;
                    background: linear-gradient(135deg, var(--novel-primary), #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    cursor: pointer;
                    user-select: none;
                    white-space: nowrap;
                }
                #novel-reader-container .novel-nav-tabs { display: flex; gap: 2px; flex-wrap: wrap; }
                #novel-reader-container .novel-nav-tab {
                    padding: 4px 8px;
                    border: none;
                    background: transparent;
                    color: var(--novel-text-sub);
                    cursor: pointer;
                    border-radius: 6px;
                    font-size: 12px;
                    transition: all .2s;
                }
                #novel-reader-container .novel-nav-tab:hover { background: var(--novel-bg); color: var(--novel-text); }
                #novel-reader-container .novel-nav-tab.active {
                    background: var(--novel-primary);
                    color: white;
                }
                #novel-reader-container .novel-nav-right { margin-left: auto; display: flex; gap: 4px; align-items: center; }
                #novel-reader-container .novel-icon-btn {
                    width: 28px; height: 28px;
                    border: none;
                    background: var(--novel-bg);
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--novel-text);
                    transition: all .2s;
                    font-size: 14px;
                }
                #novel-reader-container .novel-icon-btn:hover { background: var(--novel-primary); color: white; }

                #novel-reader-container .novel-page {
                    display: none;
                    animation: novelFadeIn .3s;
                    padding: 8px 12px;
                    overflow-y: auto;
                    flex: 1;
                }
                #novel-reader-container .novel-page.active { display: block; }
                @keyframes novelFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

                #novel-reader-container .novel-search-box {
                    max-width: 100%;
                    margin: 8px 0 12px;
                }
                #novel-reader-container .novel-search-form {
                    display: flex;
                    gap: 6px;
                    background: var(--novel-bg-card);
                    padding: 4px;
                    border-radius: var(--novel-radius);
                    box-shadow: var(--novel-shadow);
                    flex-wrap: wrap;
                }
                #novel-reader-container .novel-search-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 6px 10px;
                    font-size: 13px;
                    color: var(--novel-text);
                    outline: none;
                    min-width: 60px;
                }
                #novel-reader-container .novel-search-source {
                    border: 1px solid var(--novel-border);
                    background: var(--novel-bg);
                    border-radius: 6px;
                    padding: 0 8px;
                    font-size: 12px;
                    color: var(--novel-text);
                    cursor: pointer;
                }
                #novel-reader-container .novel-btn {
                    padding: 6px 14px;
                    border: none;
                    border-radius: 6px;
                    background: var(--novel-primary);
                    color: white;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all .2s;
                }
                #novel-reader-container .novel-btn:hover { background: var(--novel-primary-dark); transform: translateY(-1px); }
                #novel-reader-container .novel-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
                #novel-reader-container .novel-btn-ghost {
                    background: transparent;
                    color: var(--novel-text-sub);
                    border: 1px solid var(--novel-border);
                }
                #novel-reader-container .novel-btn-ghost:hover { background: var(--novel-bg); color: var(--novel-text); }

                #novel-reader-container .novel-book-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 10px;
                }
                #novel-reader-container .novel-book-card {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    overflow: hidden;
                    box-shadow: var(--novel-shadow);
                    cursor: pointer;
                    transition: all .3s;
                    display: flex;
                    padding: 10px;
                    gap: 8px;
                }
                #novel-reader-container .novel-book-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--novel-shadow-lg);
                }
                #novel-reader-container .novel-book-cover {
                    width: 56px;
                    height: 78px;
                    object-fit: cover;
                    border-radius: 4px;
                    background: var(--novel-bg);
                    flex-shrink: 0;
                }
                #novel-reader-container .novel-book-cover-placeholder {
                    width: 56px; height: 78px;
                    background: linear-gradient(135deg, var(--novel-primary), #a78bfa);
                    border-radius: 4px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 18px; font-weight: bold;
                    flex-shrink: 0;
                }
                #novel-reader-container .novel-book-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
                #novel-reader-container .novel-book-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                #novel-reader-container .novel-book-author {
                    font-size: 12px;
                    color: var(--novel-text-sub);
                    margin-bottom: 4px;
                }
                #novel-reader-container .novel-book-abstract {
                    font-size: 12px;
                    color: var(--novel-text-sub);
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex: 1;
                }
                #novel-reader-container .novel-book-source-tag {
                    display: inline-block;
                    font-size: 10px;
                    padding: 1px 6px;
                    border-radius: 3px;
                    background: var(--novel-bg);
                    color: var(--novel-text-sub);
                    margin-top: 2px;
                    align-self: flex-start;
                }

                #novel-reader-container .novel-empty {
                    text-align: center;
                    padding: 30px 10px;
                    color: var(--novel-text-sub);
                }
                #novel-reader-container .novel-empty-icon { font-size: 36px; margin-bottom: 8px; opacity: .4; }

                #novel-reader-container .novel-detail-hero {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    padding: 14px;
                    display: flex;
                    gap: 14px;
                    box-shadow: var(--novel-shadow);
                    margin-bottom: 14px;
                    flex-wrap: wrap;
                }
                #novel-reader-container .novel-detail-cover {
                    width: 80px; height: 110px;
                    object-fit: cover;
                    border-radius: 6px;
                    box-shadow: var(--novel-shadow);
                    flex-shrink: 0;
                }
                #novel-reader-container .novel-detail-cover-placeholder {
                    width: 80px; height: 110px;
                    background: linear-gradient(135deg, var(--novel-primary), #a78bfa);
                    border-radius: 6px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 28px; font-weight: bold;
                    flex-shrink: 0;
                }
                #novel-reader-container .novel-detail-info { flex: 1; min-width: 0; }
                #novel-reader-container .novel-detail-title { font-size: 18px; margin-bottom: 4px; }
                #novel-reader-container .novel-detail-author { color: var(--novel-text-sub); margin-bottom: 8px; font-size: 12px; }
                #novel-reader-container .novel-detail-summary {
                    color: var(--novel-text-sub);
                    font-size: 13px;
                    line-height: 1.6;
                    margin-bottom: 10px;
                    white-space: pre-wrap;
                }
                #novel-reader-container .novel-detail-actions { display: flex; gap: 6px; flex-wrap: wrap; }

                #novel-reader-container .novel-chapter-list {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    box-shadow: var(--novel-shadow);
                    padding: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                }
                #novel-reader-container .novel-chapter-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all .15s;
                    font-size: 13px;
                }
                #novel-reader-container .novel-chapter-item:hover { background: var(--novel-bg); }
                #novel-reader-container .novel-chapter-item.current { background: var(--novel-primary); color: white; }

                #novel-reader-container .novel-reader-body {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    padding: 16px 14px;
                    box-shadow: var(--novel-shadow);
                    min-height: 30vh;
                    line-height: var(--novel-line-height, 1.8);
                    font-size: var(--novel-font-size, 18px);
                    font-family: var(--novel-font-family, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif);
                    transition: background .3s, color .3s;
                }
                #novel-reader-container .novel-reader-body p { margin-bottom: 0.6em; text-indent: 2em; }
                #novel-reader-container .novel-reader-loading {
                    display: flex; flex-direction: column; align-items: center;
                    padding: 20px 10px; color: var(--novel-text-sub);
                }
                #novel-reader-container .novel-spinner {
                    width: 28px; height: 28px;
                    border: 3px solid var(--novel-border);
                    border-top-color: var(--novel-primary);
                    border-radius: 50%;
                    animation: novelSpin .8s linear infinite;
                    margin-bottom: 8px;
                }
                @keyframes novelSpin { to { transform: rotate(360deg); } }

                #novel-reader-container .novel-reader-header {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    display: flex; align-items: center; gap: 8px;
                    box-shadow: var(--novel-shadow);
                }
                #novel-reader-container .novel-reader-title { flex: 1; font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                #novel-reader-container .novel-reader-progress { font-size: 11px; color: var(--novel-text-sub); }
                #novel-reader-container .novel-reader-footer {
                    display: flex; justify-content: space-between; gap: 6px;
                    margin-top: 8px;
                }
                #novel-reader-container .novel-reader-footer .novel-btn { flex: 1; font-size: 11px; padding: 4px 8px; }

                #novel-reader-container .novel-settings-panel {
                    background: var(--novel-bg-card);
                    border-radius: var(--novel-radius);
                    padding: 14px;
                    box-shadow: var(--novel-shadow);
                }
                #novel-reader-container .novel-setting-item {
                    padding: 8px 0;
                    border-bottom: 1px solid var(--novel-border);
                }
                #novel-reader-container .novel-setting-item:last-child { border-bottom: none; }
                #novel-reader-container .novel-setting-label {
                    font-size: 12px;
                    color: var(--novel-text-sub);
                    margin-bottom: 4px;
                }
                #novel-reader-container .novel-setting-control {
                    display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
                }
                #novel-reader-container .novel-chip {
                    padding: 4px 10px;
                    border: 1px solid var(--novel-border);
                    background: var(--novel-bg);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    color: var(--novel-text);
                    transition: all .2s;
                }
                #novel-reader-container .novel-chip.active {
                    background: var(--novel-primary);
                    color: white;
                    border-color: var(--novel-primary);
                }
                #novel-reader-container input[type="range"] { flex: 1; min-width: 60px; height: 4px; }
                #novel-reader-container .novel-toast {
                    position: fixed; top: 10px; left: 50%;
                    transform: translateX(-50%) translateY(-20px);
                    background: var(--novel-text);
                    color: var(--novel-bg-card);
                    padding: 6px 16px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 9999999;
                    opacity: 0;
                    transition: all .3s;
                    pointer-events: none;
                    box-shadow: var(--novel-shadow-lg);
                }
                #novel-reader-container .novel-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

                #novel-reader-container .novel-drawer-mask {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,.5);
                    z-index: 9999998;
                    opacity: 0; pointer-events: none;
                    transition: opacity .25s;
                }
                #novel-reader-container .novel-drawer-mask.open { opacity: 1; pointer-events: auto; }
                #novel-reader-container .novel-drawer {
                    position: fixed; top: 0; left: 0; bottom: 0;
                    width: 260px; max-width: 70vw;
                    background: var(--novel-bg-card);
                    z-index: 9999999;
                    transform: translateX(-100%);
                    transition: transform .25s;
                    display: flex; flex-direction: column;
                }
                #novel-reader-container .novel-drawer.open { transform: none; }
                #novel-reader-container .novel-drawer-header {
                    padding: 10px 14px;
                    border-bottom: 1px solid var(--novel-border);
                    display: flex; align-items: center; gap: 8px;
                }
                #novel-reader-container .novel-drawer-title { font-weight: 600; flex: 1; font-size: 14px; }
                #novel-reader-container .novel-drawer-body { flex: 1; overflow-y: auto; padding: 4px; }

                @media (max-width: 400px) {
                    #novel-reader-container .novel-navbar { padding: 4px 8px; }
                    #novel-reader-container .novel-nav-tabs { width: 100%; justify-content: center; }
                    #novel-reader-container .novel-search-form { flex-wrap: wrap; }
                    #novel-reader-container .novel-search-source, #novel-reader-container .novel-btn { width: 100%; }
                    #novel-reader-container .novel-detail-hero { flex-direction: column; align-items: center; text-align: center; }
                    #novel-reader-container .novel-book-card { padding: 6px; }
                    #novel-reader-container .novel-book-cover { width: 44px; height: 62px; }
                }
            `;
            document.head.appendChild(style);
        }

        buildHTML() {
            return `
                <div class="novel-navbar">
                    <h1 onclick="document.querySelector('#novel-reader-container .novel-nav-tab[data-page=\\'search\\']').click()">📚</h1>
                    <div class="novel-nav-tabs">
                        <button class="novel-nav-tab active" data-page="search" onclick="window._novelExt.goPage('search')">搜索</button>
                        <button class="novel-nav-tab" data-page="shelf" onclick="window._novelExt.goPage('shelf')">书架 <span id="novel-shelf-count" style="opacity:.6"></span></button>
                        <button class="novel-nav-tab" data-page="history" onclick="window._novelExt.goPage('history')">历史</button>
                        <button class="novel-nav-tab" data-page="settings" onclick="window._novelExt.goPage('settings')">设置</button>
                    </div>
                    <div class="novel-nav-right">
                        <button class="novel-icon-btn" onclick="window._novelExt.toggleTheme()" title="切换主题">🌓</button>
                        <button class="novel-icon-btn" id="novel-close-btn" title="关闭">✕</button>
                    </div>
                </div>

                <div class="novel-toast" id="novel-toast"></div>

                <div class="novel-page active" id="novel-page-search">
                    <div class="novel-search-box">
                        <form class="novel-search-form" onsubmit="event.preventDefault(); window._novelExt.doSearch();">
                            <input id="novel-search-input" class="novel-search-input" type="text" placeholder="输入书名…" autocomplete="off">
                            <select id="novel-search-source" class="novel-search-source">
                                <option value="all">全网</option>
                            </select>
                            <button class="novel-btn" type="submit" id="novel-search-btn">搜索</button>
                        </form>
                    </div>
                    <div id="novel-search-status" style="text-align:center;color:var(--novel-text-sub);padding:8px;font-size:12px;">输入关键词开始阅读 ✨</div>
                    <div class="novel-book-grid" id="novel-search-results"></div>
                </div>

                <div class="novel-page" id="novel-page-shelf">
                    <h2 style="margin:8px 0 10px;font-size:16px;">我的书架</h2>
                    <div class="novel-book-grid" id="novel-shelf-grid"></div>
                </div>

                <div class="novel-page" id="novel-page-history">
                    <h2 style="margin:8px 0 10px;font-size:16px;">阅读历史</h2>
                    <div id="novel-history-list"></div>
                </div>

                <div class="novel-page" id="novel-page-settings">
                    <h2 style="margin:8px 0 10px;font-size:16px;">偏好设置</h2>
                    <div class="novel-settings-panel">
                        <div class="novel-setting-item">
                            <div class="novel-setting-label">🔑 API Key</div>
                            <div class="novel-setting-control">
                                <input type="text" id="novel-api-key" placeholder="可选" style="flex:1;border:1px solid var(--novel-border);background:var(--novel-bg);border-radius:6px;padding:4px 8px;color:var(--novel-text);font-size:12px;outline:none;min-width:80px;">
                                <button class="novel-btn" onclick="window._novelExt.saveSettings()">保存</button>
                            </div>
                        </div>
                        <div class="novel-setting-item">
                            <div class="novel-setting-label">🎨 主题</div>
                            <div class="novel-setting-control" id="novel-theme-chips">
                                <span class="novel-chip" data-theme="light">白</span>
                                <span class="novel-chip" data-theme="sepia">米黄</span>
                                <span class="novel-chip" data-theme="green">绿</span>
                                <span class="novel-chip" data-theme="dark">暗</span>
                                <span class="novel-chip" data-theme="black">黑</span>
                            </div>
                        </div>
                        <div class="novel-setting-item">
                            <div class="novel-setting-label">📝 字号 <span id="novel-font-size-val">18px</span></div>
                            <div class="novel-setting-control">
                                <input type="range" id="novel-font-size" min="14" max="28" value="18" step="1" oninput="window._novelExt.updateFontSize(this.value)">
                            </div>
                        </div>
                        <div class="novel-setting-item">
                            <div class="novel-setting-label">📏 行距 <span id="novel-line-height-val">1.8</span></div>
                            <div class="novel-setting-control">
                                <input type="range" id="novel-line-height" min="1.4" max="2.4" value="1.8" step="0.1" oninput="window._novelExt.updateLineHeight(this.value)">
                            </div>
                        </div>
                        <div class="novel-setting-item">
                            <div class="novel-setting-label">🔤 字体</div>
                            <div class="novel-setting-control" id="novel-font-chips">
                                <span class="novel-chip" data-font="sans">无衬线</span>
                                <span class="novel-chip" data-font="serif">宋体</span>
                                <span class="novel-chip" data-font="kai">楷体</span>
                            </div>
                        </div>
                        <div class="novel-setting-item">
                            <button class="novel-btn novel-btn-ghost" onclick="if(confirm('确认清空所有本地数据？')){localStorage.removeItem('novel_shelf');localStorage.removeItem('novel_history');localStorage.removeItem('novel_api_key');localStorage.removeItem('novel_theme');localStorage.removeItem('novel_font_size');localStorage.removeItem('novel_line_height');localStorage.removeItem('novel_font_family');window._novelExt.state.shelf=[];window._novelExt.state.history=[];window._novelExt.renderShelf();window._novelExt.renderHistory();window._novelExt.toast('已清空');}">🗑 清空数据</button>
                        </div>
                    </div>
                </div>

                <div class="novel-page" id="novel-page-detail">
                    <div id="novel-detail-container"></div>
                </div>

                <div class="novel-page" id="novel-page-reader">
                    <div style="max-width:100%;margin:0 auto;">
                        <div class="novel-reader-header">
                            <button class="novel-icon-btn" onclick="window._novelExt.closeReader()" title="返回">←</button>
                            <div class="novel-reader-title" id="novel-reader-book-title">—</div>
                            <div class="novel-reader-progress" id="novel-reader-progress">—</div>
                            <button class="novel-icon-btn" onclick="window._novelExt.toggleToc()" title="目录">☰</button>
                        </div>
                        <div class="novel-reader-body" id="novel-reader-body">
                            <div class="novel-reader-loading"><div class="novel-spinner"></div>加载中…</div>
                        </div>
                        <div class="novel-reader-footer">
                            <button class="novel-btn novel-btn-ghost" id="novel-prev-chapter" onclick="window._novelExt.prevChapter()">← 上一章</button>
                            <button class="novel-btn novel-btn-ghost" onclick="window._novelExt.toggleToc()">目录</button>
                            <button class="novel-btn" id="novel-next-chapter" onclick="window._novelExt.nextChapter()">下一章 →</button>
                        </div>
                    </div>
                </div>

                <div class="novel-drawer-mask" id="novel-drawer-mask" onclick="window._novelExt.toggleToc()"></div>
                <aside class="novel-drawer" id="novel-toc-drawer">
                    <div class="novel-drawer-header">
                        <span class="novel-drawer-title">📜 目录</span>
                        <button class="novel-icon-btn" onclick="window._novelExt.toggleToc()">×</button>
                    </div>
                    <div class="novel-drawer-body" id="novel-toc-body"></div>
                </aside>
            `;
        }

        // ---------- 事件绑定及其他方法 ----------
        bindEvents() {
            const container = this.container;
            container.querySelectorAll('#novel-theme-chips .novel-chip').forEach(el => {
                el.addEventListener('click', () => {
                    this.state.theme = el.dataset.theme;
                    localStorage.setItem('novel_theme', this.state.theme);
                    this.applyTheme();
                });
            });
            container.querySelectorAll('#novel-font-chips .novel-chip').forEach(el => {
                el.addEventListener('click', () => {
                    this.state.fontFamily = el.dataset.font;
                    localStorage.setItem('novel_font_family', this.state.fontFamily);
                    this.applyReadingStyle();
                });
            });
            const searchInput = container.querySelector('#novel-search-input');
            if (searchInput) {
                searchInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter') this.doSearch();
                });
            }
            window._novelExt = this;
            const apiKeyInput = container.querySelector('#novel-api-key');
            if (apiKeyInput) apiKeyInput.value = this.state.apiKey;
            this.applyTheme();
            this.applyReadingStyle();
            this.updateShelfCount();

            document.addEventListener('keydown', (e) => {
                const readerPage = container.querySelector('#novel-page-reader');
                if (!readerPage || !readerPage.classList.contains('active')) return;
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (e.key === 'ArrowLeft') this.prevChapter();
                else if (e.key === 'ArrowRight') this.nextChapter();
            });
        }

        // ---------- 所有功能方法与之前相同，但需确保内部使用 this.container ----------
        toast(msg, ms = 2000) {
            const t = this.container?.querySelector('#novel-toast');
            if (!t) return;
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(t._timer);
            t._timer = setTimeout(() => t.classList.remove('show'), ms);
        }

        goPage(name) {
            const container = this.container;
            if (!container) return;
            container.querySelectorAll('.novel-page').forEach(p => p.classList.remove('active'));
            container.querySelectorAll('.novel-nav-tab').forEach(t => {
                t.classList.toggle('active', t.dataset.page === name);
            });
            const page = container.querySelector('#novel-page-' + name);
            if (page) page.classList.add('active');
            if (['shelf', 'history', 'settings', 'search'].includes(name)) {
                localStorage.setItem('novel_last_page', name);
                this.state._returnPage = name;
            }
            if (name === 'shelf') this.renderShelf();
            if (name === 'history') this.renderHistory();
            if (name === 'settings') this.renderSettings();
            if (name === 'search') {
                const inp = container.querySelector('#novel-search-input');
                if (inp) setTimeout(() => inp.focus(), 100);
            }
        }

        applyTheme() {
            const c = this.container;
            if (!c) return;
            const theme = this.state.theme;
            c.dataset.novelTheme = theme === 'light' ? '' : theme;
            c.querySelectorAll('#novel-theme-chips .novel-chip').forEach(el => {
                el.classList.toggle('active', el.dataset.theme === theme);
            });
        }

        toggleTheme() {
            const order = ['light', 'sepia', 'green', 'dark', 'black'];
            const i = order.indexOf(this.state.theme);
            this.state.theme = order[(i + 1) % order.length];
            localStorage.setItem('novel_theme', this.state.theme);
            this.applyTheme();
            this.toast('主题已切换');
        }

        applyReadingStyle() {
            const c = this.container;
            if (!c) return;
            const s = this.state;
            c.style.setProperty('--novel-font-size', s.fontSize + 'px');
            c.style.setProperty('--novel-line-height', s.lineHeight);
            const fonts = {
                sans: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
                serif: 'Georgia, "Times New Roman", "SimSun", "宋体", serif',
                kai: '"KaiTi", "STKaiti", "楷体", serif'
            };
            c.style.setProperty('--novel-font-family', fonts[s.fontFamily] || fonts.sans);
            const fontSizeInput = c.querySelector('#novel-font-size');
            const lineHeightInput = c.querySelector('#novel-line-height');
            if (fontSizeInput) fontSizeInput.value = s.fontSize;
            if (lineHeightInput) lineHeightInput.value = s.lineHeight;
            const fsVal = c.querySelector('#novel-font-size-val');
            const lhVal = c.querySelector('#novel-line-height-val');
            if (fsVal) fsVal.textContent = s.fontSize + 'px';
            if (lhVal) lhVal.textContent = s.lineHeight;
            c.querySelectorAll('#novel-font-chips .novel-chip').forEach(el => {
                el.classList.toggle('active', el.dataset.font === s.fontFamily);
            });
        }

        updateFontSize(v) {
            this.state.fontSize = +v;
            localStorage.setItem('novel_font_size', v);
            this.applyReadingStyle();
        }

        updateLineHeight(v) {
            this.state.lineHeight = +v;
            localStorage.setItem('novel_line_height', v);
            this.applyReadingStyle();
        }

        renderSettings() {
            const c = this.container;
            if (!c) return;
            const inp = c.querySelector('#novel-api-key');
            if (inp) inp.value = this.state.apiKey;
            this.applyTheme();
            this.applyReadingStyle();
        }

        saveSettings() {
            const c = this.container;
            if (!c) return;
            const inp = c.querySelector('#novel-api-key');
            if (inp) {
                this.state.apiKey = inp.value.trim();
                localStorage.setItem('novel_api_key', this.state.apiKey);
                this.toast('已保存 ✓');
            }
        }

        async apiCall(params) {
            const url = new URL(API_BASE);
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
            });
            const headers = {};
            if (this.state.apiKey) headers['X-Api-Key'] = this.state.apiKey;
            const resp = await fetch(url, { headers });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const json = await resp.json();
            if (!json || json.code !== 200) throw new Error(json.msg || '请求失败');
            return json.data;
        }

        async doSearch() {
            const c = this.container;
            if (!c) return;
            const q = c.querySelector('#novel-search-input').value.trim();
            const source = c.querySelector('#novel-search-source').value;
            if (!q) return this.toast('请输入关键词');
            const btn = c.querySelector('#novel-search-btn');
            const status = c.querySelector('#novel-search-status');
            const results = c.querySelector('#novel-search-results');
            if (!btn || !status || !results) return;
            btn.disabled = true;
            btn.textContent = '搜索中…';
            status.textContent = '正在搜索…';
            results.innerHTML = '';
            try {
                const data = await this.apiCall({ action: 'search', q, source });
                const books = data.books || [];
                status.textContent = `共找到 ${data.total} 条结果`;
                this.renderBooks(books, results, 'search');
                this.state._searched = true;
            } catch (e) {
                status.textContent = '搜索失败：' + e.message;
                this.toast('搜索失败：' + e.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '搜索';
            }
        }

        renderBooks(books, container, source) {
            if (!container) return;
            if (!books.length) {
                container.innerHTML = '<div class="novel-empty"><div class="novel-empty-icon">📭</div>暂无数据</div>';
                return;
            }
            container.innerHTML = books.map(b => {
                const cover = b.cover
                    ? `<img class="novel-book-cover" src="${this.escapeHtml(b.cover)}" onerror="this.outerHTML='<div class=\\'novel-book-cover-placeholder\\'>${this.escapeHtml((b.title||'?')[0])}</div>'">`
                    : `<div class="novel-book-cover-placeholder">${this.escapeHtml((b.title||'?')[0])}</div>`;
                const tag = b.source ? `<span class="novel-book-source-tag">${this.sourceLabel(b.source)}</span>` : '';
                const progressBadge = b._progress ? `<span style="color:var(--novel-primary);font-size:10px;margin-left:4px;">●</span>` : '';
                return `
                    <div class="novel-book-card" onclick="window._novelExt.openBook('${this.escapeHtml(b.book_id)}','${this.escapeHtml(b.source||'qq')}')">
                        ${cover}
                        <div class="novel-book-info">
                            <div class="novel-book-title">${this.escapeHtml(b.title)}${progressBadge}</div>
                            <div class="novel-book-author">${this.escapeHtml(b.author || '佚名')}</div>
                            <div class="novel-book-abstract">${this.escapeHtml(b.abstract || '暂无简介')}</div>
                            ${tag}
                        </div>
                    </div>`;
            }).join('');
        }

        sourceLabel(s) {
            return ({ qq: 'QQ阅读', xiaomi: '小米', fanqie: '番茄', dejian: '得间', qimao: '七猫' })[s] || s;
        }

        escapeHtml(s) {
            return String(s || '').replace(/[&<>"']/g, c => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[c]);
        }

        async openBook(bookId, source) {
            const c = this.container;
            if (!c) return;
            this.goPage('detail');
            const container = c.querySelector('#novel-detail-container');
            if (!container) return;
            container.innerHTML = '<div class="novel-reader-loading"><div class="novel-spinner"></div>加载书籍信息…</div>';
            try {
                const data = await this.apiCall({ action: 'detail', source, book_id: bookId });
                const shelfItem = this.state.shelf.find(s => s.book_id === String(bookId) && s.source === source);
                const resumeIndex = shelfItem ? shelfItem.chapterIndex : 0;
                this.state.book = {
                    book_id: String(bookId),
                    source,
                    title: data.title,
                    author: data.author,
                    cover: data.cover,
                    summary: data.summary,
                    chapters: data.chapters || [],
                    chapterIndex: Math.min(resumeIndex, Math.max(0, (data.chapters || []).length - 1))
                };
                this.renderDetail();
            } catch (e) {
                container.innerHTML = `<div class="novel-empty"><div class="novel-empty-icon">⚠️</div>加载失败：${this.escapeHtml(e.message)}</div>`;
            }
        }

        renderDetail() {
            const c = this.container;
            if (!c) return;
            const b = this.state.book;
            if (!b) return;
            const container = c.querySelector('#novel-detail-container');
            if (!container) return;
            const cover = b.cover
                ? `<img class="novel-detail-cover" src="${this.escapeHtml(b.cover)}" onerror="this.outerHTML='<div class=\\'novel-detail-cover-placeholder\\'>${this.escapeHtml((b.title||'?')[0])}</div>'">`
                : `<div class="novel-detail-cover-placeholder">${this.escapeHtml((b.title||'?')[0])}</div>`;
            const progress = b.chapters.length
                ? `<span style="color:var(--novel-text-sub);font-size:12px;">已读 ${Math.min(b.chapterIndex + 1, b.chapters.length)} / ${b.chapters.length} 章</span>`
                : '';
            container.innerHTML = `
                <div class="novel-detail-hero">
                    ${cover}
                    <div class="novel-detail-info">
                        <h1 class="novel-detail-title">${this.escapeHtml(b.title)}</h1>
                        <div class="novel-detail-author">👤 ${this.escapeHtml(b.author || '佚名')} · 📚 ${this.sourceLabel(b.source)}</div>
                        <div class="novel-detail-summary">${this.escapeHtml(b.summary || '暂无简介')}</div>
                        ${progress}
                        <div class="novel-detail-actions" style="margin-top:10px;">
                            <button class="novel-btn" onclick="window._novelExt.startReading()">${b.chapterIndex > 0 ? '继续阅读' : '开始阅读'}</button>
                            <button class="novel-btn novel-btn-ghost" onclick="window._novelExt.toggleShelf()">${this.isInShelf() ? '✓ 在书架' : '+ 加入书架'}</button>
                            ${b.chapters.length ? `<button class="novel-btn novel-btn-ghost" onclick="window._novelExt.openChapterByIndex(0)">目录</button>` : ''}
                        </div>
                    </div>
                </div>
                ${b.chapters.length ? `
                    <h3 style="margin:4px 0 8px;font-size:14px;">📜 目录（最近 30 章）</h3>
                    <div class="novel-chapter-list" id="novel-detail-chapters">
                        ${b.chapters.slice(0, 30).map((c, i) => `
                            <div class="novel-chapter-item ${i === b.chapterIndex ? 'current' : ''}" onclick="window._novelExt.openChapterByIndex(${i})">
                                <span>${this.escapeHtml(c.title || ('第 ' + (i+1) + ' 章'))}</span>
                            </div>`).join('')}
                        ${b.chapters.length > 30 ? `<div class="novel-chapter-item" onclick="window._novelExt.toggleToc();window._novelExt.renderToc();" style="justify-content:center;color:var(--novel-primary);">完整目录 (${b.chapters.length}章)</div>` : ''}
                    </div>` : ''}
            `;
        }

        isInShelf() {
            if (!this.state.book) return false;
            return this.state.shelf.some(s => s.book_id === this.state.book.book_id && s.source === this.state.book.source);
        }

        toggleShelf() {
            if (!this.state.book) return;
            const idx = this.state.shelf.findIndex(s => s.book_id === this.state.book.book_id && s.source === this.state.book.source);
            if (idx >= 0) {
                this.state.shelf.splice(idx, 1);
                this.toast('已移出书架');
            } else {
                this.state.shelf.push({
                    book_id: this.state.book.book_id,
                    source: this.state.book.source,
                    title: this.state.book.title,
                    author: this.state.book.author,
                    cover: this.state.book.cover,
                    abstract: this.state.book.summary,
                    chapterIndex: this.state.book.chapterIndex,
                    addedAt: Date.now()
                });
                this.toast('已加入书架 ✓');
            }
            localStorage.setItem('novel_shelf', JSON.stringify(this.state.shelf));
            this.updateShelfCount();
            this.renderDetail();
        }

        updateShelfCount() {
            const c = this.container;
            if (!c) return;
            const el = c.querySelector('#novel-shelf-count');
            if (el) el.textContent = this.state.shelf.length ? `(${this.state.shelf.length})` : '';
        }

        renderShelf() {
            const c = this.container;
            if (!c) return;
            const grid = c.querySelector('#novel-shelf-grid');
            if (!grid) return;
            if (!this.state.shelf.length) {
                grid.innerHTML = '<div class="novel-empty"><div class="novel-empty-icon">📚</div>书架空空</div>';
                return;
            }
            const sorted = [...this.state.shelf].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
            const data = sorted.map(b => ({
                title: b.title, author: b.author, cover: b.cover, abstract: b.abstract,
                book_id: b.book_id, source: b.source, _progress: true
            }));
            this.renderBooks(data, grid);
        }

        renderHistory() {
            const c = this.container;
            if (!c) return;
            const list = c.querySelector('#novel-history-list');
            if (!list) return;
            if (!this.state.history.length) {
                list.innerHTML = '<div class="novel-empty"><div class="novel-empty-icon">🕓</div>暂无历史</div>';
                return;
            }
            list.innerHTML = this.state.history.map(h => {
                const cover = h.cover
                    ? `<img class="novel-book-cover" src="${this.escapeHtml(h.cover)}" onerror="this.outerHTML='<div class=\\'novel-book-cover-placeholder\\'>${this.escapeHtml((h.title||'?')[0])}</div>'">`
                    : `<div class="novel-book-cover-placeholder">${this.escapeHtml((h.title||'?')[0])}</div>`;
                const ago = this.timeAgo(h.time);
                return `
                    <div class="novel-book-card" onclick="window._novelExt.openHistory('${this.escapeHtml(h.book_id)}','${this.escapeHtml(h.source)}',${h.chapterIndex})">
                        ${cover}
                        <div class="novel-book-info">
                            <div class="novel-book-title">${this.escapeHtml(h.title)}</div>
                            <div class="novel-book-author">${this.escapeHtml(h.author || '')} · ${this.sourceLabel(h.source)}</div>
                            <div class="novel-book-abstract" style="color:var(--novel-primary);">读到：${this.escapeHtml(h.chapterTitle || '')}</div>
                            <span class="novel-book-source-tag">${ago}</span>
                        </div>
                    </div>`;
            }).join('');
        }

        timeAgo(t) {
            const diff = Date.now() - t;
            const m = Math.floor(diff / 60000);
            if (m < 1) return '刚刚';
            if (m < 60) return m + ' 分钟前';
            const h = Math.floor(m / 60);
            if (h < 24) return h + ' 小时前';
            const d = Math.floor(h / 24);
            return d + ' 天前';
        }

        async openHistory(bookId, source, idx) {
            await this.openBook(bookId, source);
            if (typeof idx === 'number') this.openChapterByIndex(idx);
        }

        addHistory() {
            if (!this.state.book) return;
            const cur = this.state.book.chapterIndex;
            const ch = this.state.book.chapters[cur];
            this.state.history = this.state.history.filter(h => !(h.book_id === this.state.book.book_id && h.source === this.state.book.source));
            this.state.history.unshift({
                book_id: this.state.book.book_id,
                source: this.state.book.source,
                title: this.state.book.title,
                author: this.state.book.author,
                cover: this.state.book.cover,
                chapterTitle: ch?.title || '',
                chapterIndex: cur,
                time: Date.now()
            });
            this.state.history = this.state.history.slice(0, 30);
            localStorage.setItem('novel_history', JSON.stringify(this.state.history));
        }

        startReading() {
            this.openChapterByIndex(this.state.book.chapterIndex);
        }

        async openChapterByIndex(idx) {
            if (!this.state.book) return;
            idx = Math.max(0, Math.min(idx, this.state.book.chapters.length - 1));
            this.state.book.chapterIndex = idx;
            this.syncShelfProgress();
            this.goPage('reader');
            this.toggleToc(false);
            const c = this.container;
            if (!c) return;
            const titleEl = c.querySelector('#novel-reader-book-title');
            const progressEl = c.querySelector('#novel-reader-progress');
            const bodyEl = c.querySelector('#novel-reader-body');
            const prevBtn = c.querySelector('#novel-prev-chapter');
            const nextBtn = c.querySelector('#novel-next-chapter');
            if (titleEl) titleEl.textContent = this.state.book.title;
            if (progressEl) progressEl.textContent = `${idx + 1} / ${this.state.book.chapters.length}`;
            if (bodyEl) bodyEl.innerHTML = '<div class="novel-reader-loading"><div class="novel-spinner"></div>正在加载…</div>';
            if (prevBtn) prevBtn.disabled = idx <= 0;
            if (nextBtn) nextBtn.disabled = idx >= this.state.book.chapters.length - 1;
            try {
                const data = await this.apiCall({
                    action: 'content',
                    source: this.state.book.source,
                    book_id: this.state.book.book_id,
                    chapter_id: this.state.book.chapters[idx].chapter_id
                });
                this.state.chapterContent = data.content || '(空章节)';
                if (bodyEl) {
                    bodyEl.innerHTML = this.formatContent(this.state.chapterContent);
                    bodyEl.scrollTop = 0;
                }
                this.addHistory();
                this.syncShelfProgress();
            } catch (e) {
                if (bodyEl) bodyEl.innerHTML = `<div class="novel-reader-loading">⚠️ 加载失败：${this.escapeHtml(e.message)}</div>`;
            }
        }

        formatContent(text) {
            return text.split(/\r?\n/).filter(l => l.trim()).map(p => `<p>${this.escapeHtml(p)}</p>`).join('');
        }

        prevChapter() {
            if (this.state.book && this.state.book.chapterIndex > 0) {
                this.openChapterByIndex(this.state.book.chapterIndex - 1);
            }
        }

        nextChapter() {
            if (this.state.book && this.state.book.chapterIndex < this.state.book.chapters.length - 1) {
                this.openChapterByIndex(this.state.book.chapterIndex + 1);
            }
        }

        closeReader() {
            this.syncShelfProgress();
            const page = this.state._returnPage || 'search';
            this.goPage(page);
        }

        syncShelfProgress() {
            if (!this.state.book) return;
            const idx = this.state.shelf.findIndex(s => s.book_id === this.state.book.book_id && s.source === this.state.book.source);
            if (idx >= 0) {
                this.state.shelf[idx].chapterIndex = this.state.book.chapterIndex;
                this.state.shelf[idx].chapterTitle = this.state.book.chapters[this.state.book.chapterIndex]?.title || '';
                localStorage.setItem('novel_shelf', JSON.stringify(this.state.shelf));
            }
        }

        toggleToc(force) {
            const c = this.container;
            if (!c) return;
            const drawer = c.querySelector('#novel-toc-drawer');
            const mask = c.querySelector('#novel-drawer-mask');
            if (!drawer || !mask) return;
            const open = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
            drawer.classList.toggle('open', open);
            mask.classList.toggle('open', open);
            if (open) this.renderToc();
        }

        renderToc() {
            const c = this.container;
            if (!c) return;
            const body = c.querySelector('#novel-toc-body');
            if (!body) return;
            if (!this.state.book || !this.state.book.chapters) {
                body.innerHTML = '<div style="padding:16px;text-align:center;color:var(--novel-text-sub);">暂无目录</div>';
                return;
            }
            const cur = this.state.book.chapterIndex;
            const readSet = new Set();
            for (let i = 0; i < cur; i++) readSet.add(i);
            body.innerHTML = `
                <div style="padding:8px 12px;color:var(--novel-text-sub);font-size:12px;border-bottom:1px solid var(--novel-border);">
                    📖 第 ${cur + 1} 章 · ${this.escapeHtml(this.state.book.chapters[cur]?.title || '')}
                </div>
                ${this.state.book.chapters.map((c, i) => `
                    <div class="novel-chapter-item ${i === cur ? 'current' : ''}" onclick="window._novelExt.openChapterByIndex(${i});window._novelExt.toggleToc(false);">
                        <span style="opacity:.6;width:30px;flex-shrink:0;font-size:11px;">${(i+1).toString().padStart(3,' ')}</span>
                        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${this.escapeHtml(c.title || ('第 ' + (i+1) + ' 章'))}</span>
                    </div>`).join('')}
            `;
        }
    }

    Scratch.extensions.register(new NovelReaderExtension());
})(Scratch);
