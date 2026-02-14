/*
MIT License

Copyright (c) 2025 AskingAcake

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Marketplace Builder" Extension),
to deal in the Extension without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Extension, and to permit persons to whom the Extension is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Extension.

THE EXTENSION IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE EXTENSION OR THE USE OR OTHER DEALINGS
IN THE EXTENSION.
*/

class MarketplaceBuilder {
    constructor() {
        this.guis = {}; // id -> gui 对象
        this.searchQueries = {};
        this.lastClicked = {
            itemId: "",
            itemTitle: "",
            itemButton: ""
        };
    }

    getInfo() {
        return {
            id: "marketplacebuilder",
            name: "市场构建器",
            blocks: [
                // 核心功能
                { opcode: "createGUI", blockType: "command", text: "创建市场 [ID] 标题 [TITLE]",
                  arguments: { ID: { type: "string" }, TITLE: { type: "string", defaultValue: "市场" } } },
                { opcode: "closeGUI", blockType: "command", text: "关闭市场 [ID]", arguments: { ID: { type: "string" } } },
                { opcode: "guiExists", blockType: "Boolean", text: "市场 [ID] 存在?", arguments: { ID: { type: "string" } } },
                { opcode: "setMode", blockType: "command", text: "设置界面 [ID] 模式 [MODE]",
                  arguments: { ID: { type: "string" }, MODE: { type: "string", menu: "modes", defaultValue: "marketplace" } } },

                // 分类（动态）
                { opcode: "addCategory", blockType: "command", text: "添加分类 [CAT] 标签 [LABEL] 图标 [URL] 到市场 [ID]",
                  arguments: { CAT: { type: "string" }, LABEL: { type: "string" }, URL: { type: "string", defaultValue: "" }, ID: { type: "string" } } },
                { opcode: "renameCategory", blockType: "command", text: "重命名分类 [CAT] 为 [NEWLABEL] 在市场 [ID]",
                  arguments: { CAT: { type: "string" }, NEWLABEL: { type: "string" }, ID: { type: "string" } } },
                { opcode: "setCategoryIcon", blockType: "command", text: "设置分类 [CAT] 图标 [URL] 在市场 [ID]",
                  arguments: { CAT: { type: "string" }, URL: { type: "string" }, ID: { type: "string" } } },
                { opcode: "removeCategory", blockType: "command", text: "移除分类 [CAT] 从市场 [ID]",
                  arguments: { CAT: { type: "string" }, ID: { type: "string" } } },
                { opcode: "switchCategory", blockType: "command", text: "切换到分类 [CAT] 在市场 [ID]",
                  arguments: { CAT: { type: "string" }, ID: { type: "string" } } },
                { opcode: "currentCategory", blockType: "reporter", text: "市场 [ID] 的当前分类",
                  arguments: { ID: { type: "string" } } },
                { opcode: "onCategorySwitch", blockType: "hat", text: "当分类切换 [ID]",
                  arguments: { ID: { type: "string" } } },

                // 商品
                { opcode: "addItem", blockType: "command", text: "添加商品 [ITEM] 到市场 [ID] 分类 [CAT] 标题 [TITLE] 价格 [PRICE] 图片 [IMG] 描述 [DESC] 按钮 [BTN]",
                  arguments: {
                      ITEM: { type: "string", defaultValue: "item01" },
                      ID: { type: "string" },
                      CAT: { type: "string", defaultValue: "default" },
                      TITLE: { type: "string", defaultValue: "商品" },
                      PRICE: { type: "string", defaultValue: "100" },
                      IMG: { type: "string", defaultValue: "" },
                      DESC: { type: "string", defaultValue: "" },
                      BTN: { type: "string", defaultValue: "购买" }
                  } },
                { opcode: "deleteItem", blockType: "command", text: "删除商品 [ITEM] 从市场 [ID]",
                  arguments: { ITEM: { type: "string" }, ID: { type: "string" } } },
                { opcode: "setItemColors", blockType: "command", text: "设置商品 [ITEM] 在市场 [ID] 颜色 背景 [BG] 文字 [TEXT] 按钮 [BTN]",
                  arguments: { ITEM: { type: "string" }, ID: { type: "string" }, BG: { type: "string" }, TEXT: { type: "string" }, BTN: { type: "string" } } },
                { opcode: "onItemClick", blockType: "hat", text: "当商品点击 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "lastClickedItemId", blockType: "reporter", text: "最后点击的商品ID" },
                { opcode: "lastClickedItemTitle", blockType: "reporter", text: "最后点击的商品标题" },
                { opcode: "lastClickedItemButton", blockType: "reporter", text: "最后点击的商品按钮" },

                // 购物车
                { opcode: "addToCart", blockType: "command", text: "添加到购物车 市场 [ID] 商品 [ITEM] 数量 [Q]",
                  arguments: { ID: { type: "string" }, ITEM: { type: "string" }, Q: { type: "number", defaultValue: 1 } } },
                { opcode: "removeFromCart", blockType: "command", text: "从购物车移除 市场 [ID] 商品 [ITEM] 数量 [Q]",
                  arguments: { ID: { type: "string" }, ITEM: { type: "string" }, Q: { type: "number", defaultValue: 1 } } },
                { opcode: "clearCart", blockType: "command", text: "清空购物车 市场 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "cartCount", blockType: "reporter", text: "购物车数量 市场 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "cartTotal", blockType: "reporter", text: "购物车总价 市场 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "cartItemsJSON", blockType: "reporter", text: "购物车商品JSON 市场 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "setCurrency", blockType: "command", text: "设置货币 市场 [ID] 为 [CUR]",
                  arguments: { ID: { type: "string" }, CUR: { type: "string", defaultValue: "¥" } } },
                { opcode: "onCartChange", blockType: "hat", text: "当购物车变化 [ID]",
                  arguments: { ID: { type: "string" } } },

                // 分页
                { opcode: "setItemsPerPage", blockType: "command", text: "设置每页显示 [N] 商品 在市场 [ID] 分类 [CAT]",
                  arguments: { N: { type: "number", defaultValue: 12 }, ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "goToPage", blockType: "command", text: "跳转到第 [P] 页 在市场 [ID] 分类 [CAT]",
                  arguments: { P: { type: "number", defaultValue: 1 }, ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "nextPage", blockType: "command", text: "下一页 在市场 [ID] 分类 [CAT]",
                  arguments: { ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "prevPage", blockType: "command", text: "上一页 在市场 [ID] 分类 [CAT]",
                  arguments: { ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "currentPage", blockType: "reporter", text: "当前页码 市场 [ID] 分类 [CAT]",
                  arguments: { ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "totalPages", blockType: "reporter", text: "总页数 市场 [ID] 分类 [CAT]",
                  arguments: { ID: { type: "string" }, CAT: { type: "string" } } },
                { opcode: "onPageChange", blockType: "hat", text: "当页面变化 [ID]",
                  arguments: { ID: { type: "string" } } },

                // 搜索
                { opcode: "addSearchBar", blockType: "command", text: "添加搜索栏 到市场 [ID] 占位符 [TEXT]",
                  arguments: { ID: { type: "string" }, TEXT: { type: "string", defaultValue: "搜索..." } } },
                { opcode: "searchQuery", blockType: "reporter", text: "搜索查询 市场 [ID]",
                  arguments: { ID: { type: "string" } } },
                { opcode: "filterItems", blockType: "command", text: "过滤商品 市场 [ID] 根据文本 [TEXT]",
                  arguments: { ID: { type: "string" }, TEXT: { type: "string", defaultValue: "" } } },

                // 音效
                { opcode: "setClickSound", blockType: "command", text: "设置点击音效 市场 [ID] 链接 [URL]",
                  arguments: { ID: { type: "string" }, URL: { type: "string" } } },
                { opcode: "setButtonSound", blockType: "command", text: "设置按钮音效 市场 [ID] 链接 [URL]",
                  arguments: { ID: { type: "string" }, URL: { type: "string" } } },

                // 主题 / 位置
                { opcode: "setTheme", blockType: "command", text: "设置市场 [ID] 主题 [THEME]",
                  arguments: { ID: { type: "string" }, THEME: { type: "string", menu: "themes", defaultValue: "light" } } },
                { opcode: "setCustomColors", blockType: "command", text: "设置市场 [ID] 颜色 背景 [BG] 文字 [TEXT] 卡片 [CARD] 侧栏 [SIDEBAR]",
                  arguments: { ID: { type: "string" }, BG: { type: "string" }, TEXT: { type: "string" }, CARD: { type: "string" }, SIDEBAR: { type: "string" } } },
                { opcode: "setVisible", blockType: "command", text: "设置市场 [ID] 可见性 [V]",
                  arguments: { ID: { type: "string" }, V: { type: "boolean", defaultValue: true } } },
                { opcode: "moveGUI", blockType: "command", text: "移动市场 [ID] 到 x: [X] y: [Y]",
                  arguments: { ID: { type: "string" }, X: { type: "number", defaultValue: 50 }, Y: { type: "number", defaultValue: 50 } } },
                { opcode: "resizeGUI", blockType: "command", text: "调整市场 [ID] 大小 宽度: [W] 高度: [H]",
                  arguments: { ID: { type: "string" }, W: { type: "number", defaultValue: 800 }, H: { type: "number", defaultValue: 500 } } },

                // 设置模式
                { opcode: "addSettingToggle", blockType: "command", text: "添加设置开关 [KEY] 标签 [LABEL] 默认 [VAL] 到市场 [ID]",
                  arguments: { KEY: { type: "string" }, LABEL: { type: "string" }, VAL: { type: "boolean", defaultValue: true }, ID: { type: "string" } } },
                { opcode: "addSettingDropdown", blockType: "command", text: "添加设置下拉框 [KEY] 标签 [LABEL] 选项 [CSV] 默认 [VAL] 到市场 [ID]",
                  arguments: { KEY: { type: "string" }, LABEL: { type: "string" }, CSV: { type: "string", defaultValue: "低,中,高" }, VAL: { type: "string", defaultValue: "中" }, ID: { type: "string" } } },
                { opcode: "addSettingSlider", blockType: "command", text: "添加设置滑块 [KEY] 标签 [LABEL] 最小 [MIN] 最大 [MAX] 默认 [VAL] 到市场 [ID]",
                  arguments: { KEY: { type: "string" }, LABEL: { type: "string" }, MIN: { type: "number", defaultValue: 0 }, MAX: { type: "number", defaultValue: 100 }, VAL: { type: "number", defaultValue: 50 }, ID: { type: "string" } } },
                { opcode: "getSettingValue", blockType: "reporter", text: "设置值 [KEY] 市场 [ID]",
                  arguments: { KEY: { type: "string" }, ID: { type: "string" } } },
                { opcode: "onSettingChange", blockType: "hat", text: "当设置变化 [ID]",
                  arguments: { ID: { type: "string" } } },
            ],
            menus: {
                themes: {
                    acceptReporters: true,
                    items: ["浅色", "深色", "自定义"]
                },
                modes: {
                    acceptReporters: true,
                    items: ["市场模式", "设置模式"]
                }
            }
        };
    }

    // ----------------- 辅助函数 -----------------

    _findGUIId(guiRef) {
        for (const [id, g] of Object.entries(this.guis)) {
            if (g === guiRef) return id;
        }
        return "";
    }

    _ensureGUI(id) {
        return this.guis[id] || null;
    }

    _play(url) {
        if (!url) return;
        try {
            const a = new Audio(url);
            a.play().catch(() => {});
        } catch (e) {}
    }

    _applyTheme(gui, theme) {
        const themes = {
            "浅色": { bg: "#f5f5f7", text: "#111", card: "#ffffff", sidebar: "#ffffff" },
            "深色": { bg: "#1f1f1f", text: "#f5f5f7", card: "#2a2a2a", sidebar: "#262626" }
        };
        const colors = themes[theme] || themes["浅色"];
        this._applyColors(gui, colors);
        gui.theme = theme;
    }

    _applyColors(gui, colors) {
        gui.root.style.background = colors.bg;
        gui.root.style.color = colors.text;
        gui.header.style.background = colors.sidebar;
        gui.sidebar.style.background = colors.sidebar;
        gui.colors = colors;

        // 更新卡片文字/背景
        gui.content.querySelectorAll(".mb-card").forEach(card => {
            card.style.background = colors.card;
            card.style.color = colors.text;
        });
        // 分类按钮
        gui.sidebar.querySelectorAll("button.mb-cat").forEach(btn => {
            btn.style.color = colors.text;
        });
    }

    _createGUIRoot(id, title) {
        if (this.guis[id]) this.closeGUI({ ID: id });

        const root = document.createElement("div");
        root.style.position = "absolute";
        root.style.left = "50px";
        root.style.top = "50px";
        root.style.width = "800px";
        root.style.height = "500px";
        root.style.border = "1px solid #aaa";
        root.style.borderRadius = "8px";
        root.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
        root.style.overflow = "hidden";
        root.style.zIndex = "9999";
        root.style.fontFamily = "Arial, sans-serif";
        root.style.display = "flex";
        root.style.flexDirection = "column";

        const header = document.createElement("div");
        header.style.padding = "8px 12px";
        header.style.fontWeight = "bold";
        header.style.cursor = "move";
        header.innerText = title;
        root.appendChild(header);

        const body = document.createElement("div");
        body.style.flex = "1";
        body.style.display = "flex";
        body.style.overflow = "hidden";
        root.appendChild(body);

        const sidebar = document.createElement("div");
        sidebar.style.width = "200px";
        sidebar.style.borderRight = "1px solid #ccc";
        sidebar.style.overflowY = "auto";
        body.appendChild(sidebar);

        const main = document.createElement("div");
        main.style.flex = "1";
        main.style.position = "relative";
        main.style.display = "flex";
        main.style.flexDirection = "column";
        body.appendChild(main);

        const searchWrap = document.createElement("div");
        searchWrap.style.padding = "8px";
        searchWrap.style.borderBottom = "1px solid #ddd";
        searchWrap.style.display = "none";
        main.appendChild(searchWrap);

        const content = document.createElement("div");
        content.style.flex = "1";
        content.style.padding = "12px";
        content.style.overflowY = "auto";
        content.style.display = "grid";
        content.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
        content.style.gap = "12px";
        main.appendChild(content);

        document.body.appendChild(root);

        // 可拖动
        let dragging = false;
        let offsetX = 0, offsetY = 0;
        header.addEventListener("mousedown", e => {
            dragging = true;
            offsetX = e.clientX - root.offsetLeft;
            offsetY = e.clientY - root.offsetTop;
        });
        window.addEventListener("mousemove", e => {
            if (!dragging) return;
            root.style.left = (e.clientX - offsetX) + "px";
            root.style.top = (e.clientY - offsetY) + "px";
        });
        window.addEventListener("mouseup", () => dragging = false);

        const gui = {
            root, header, body, sidebar, searchWrap, content,
            mode: "marketplace",
            categories: {},      // catId -> { btn, listEl, label, icon, itemsPerPage, currentPage, itemIds:[], cards: Map }
            currentCategory: "",
            colors: null,
            theme: "浅色",
            clickSoundUrl: "",
            buttonSoundUrl: "",
            cart: { currency: "¥", items: {} }, // itemId -> { qty, price: number, title }
            settings: {},        // key -> value
            settingsElems: {},   // key -> <input/select/range>
        };

        this.guis[id] = gui;
        this._applyTheme(gui, "浅色");
    }

    _categoryEnsure(gui, catId) {
        if (gui.categories[catId]) return gui.categories[catId];

        const listEl = document.createElement("div");
        listEl.style.display = "none";
        listEl.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
        listEl.style.gap = "12px";

        const cat = {
            btn: null,
            listEl,
            label: catId,
            icon: "",
            itemIds: [],
            cards: new Map(),
            itemsPerPage: 12,
            currentPage: 1
        };
        gui.categories[catId] = cat;
        return cat;
    }

    _buildCategoryButton(gui, catId, label, iconUrl) {
        const btn = document.createElement("button");
        btn.className = "mb-cat";
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        btn.style.border = "none";
        btn.style.background = "transparent";
        btn.style.cursor = "pointer";
        btn.style.padding = "8px 10px";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.gap = "8px";
        btn.style.fontSize = "14px";

        if (iconUrl) {
            const img = document.createElement("img");
            img.src = iconUrl;
            img.style.width = "20px";
            img.style.height = "20px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "4px";
            btn.appendChild(img);
        }

        const span = document.createElement("span");
        span.innerText = label;
        btn.appendChild(span);

        btn.addEventListener("click", () => {
            this._play(gui.clickSoundUrl);
            const id = this._findGUIId(gui);
            this.switchCategory({ CAT: catId, ID: id });
        });

        if (gui.colors) btn.style.color = gui.colors.text;
        return btn;
    }

    _renderCategoryPage(gui, catId) {
        const cat = gui.categories[catId];
        if (!cat) return;

        const start = (cat.currentPage - 1) * cat.itemsPerPage;
        const end = start + cat.itemsPerPage;

        const ids = cat.itemIds;
        let i = 0;
        cat.cards.forEach((card, id) => {
            const show = i >= start && i < end;
            card.style.display = show ? "" : "none";
            i++;
        });

        // 触发帽子块
        const id = this._findGUIId(gui);
        Scratch.vm.runtime.startHats("marketplacebuilder_onPageChange", { ID: id });
    }

    _updateCategoryButtonStyles(gui) {
        Object.entries(gui.categories).forEach(([cId, cObj]) => {
            if (!cObj.btn) return;
            const active = (cId === gui.currentCategory);
            cObj.btn.classList.toggle("mb-cat-active", active);
            cObj.btn.style.fontWeight = active ? "bold" : "normal";
            cObj.btn.style.background = active ? "rgba(0,0,0,0.08)" : "transparent";
        });
    }

    _switchCategoryInternal(id, cat) {
        const gui = this._ensureGUI(id);
        if (!gui) return;

        if (!gui.categories[cat]) return;

        gui.currentCategory = cat;
        gui.content.innerHTML = "";
        gui.content.appendChild(gui.categories[cat].listEl);
        gui.categories[cat].listEl.style.display = "grid";
        this._updateCategoryButtonStyles(gui);
        this._renderCategoryPage(gui, cat);

        Scratch.vm.runtime.startHats("marketplacebuilder_onCategorySwitch", { ID: id });
    }

    _makeItemCard(gui, args) {
        const { ITEM, TITLE, PRICE, IMG, DESC, BTN } = args;

        const card = document.createElement("div");
        card.className = "mb-card";
        card.style.borderRadius = "8px";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        card.style.padding = "8px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "6px";
        card.style.background = gui.colors?.card || "#fff";

        const img = document.createElement("img");
        img.src = IMG || "";
        img.style.width = "100%";
        img.style.height = "120px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";
        card.appendChild(img);

        const titleEl = document.createElement("div");
        titleEl.innerText = TITLE;
        titleEl.style.fontWeight = "bold";
        card.appendChild(titleEl);

        const price = document.createElement("div");
        price.innerText = gui.cart.currency + (PRICE ?? "0");
        price.dataset.raw = PRICE;
        price.style.color = "#0a7";
        price.style.fontWeight = "bold";
        card.appendChild(price);

        const desc = document.createElement("div");
        desc.innerText = DESC || "";
        desc.style.fontSize = "12px";
        desc.style.opacity = "0.8";
        card.appendChild(desc);

        const btn = document.createElement("button");
        btn.innerText = BTN || "购买";
        btn.style.marginTop = "auto";
        btn.style.border = "none";
        btn.style.padding = "6px 8px";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "4px";
        btn.style.background = "#4c8bf5";
        btn.style.color = "#fff";
        btn.addEventListener("click", () => {
            this._play(gui.buttonSoundUrl);
            this.lastClicked.itemId = ITEM;
            this.lastClicked.itemTitle = TITLE;
            this.lastClicked.itemButton = BTN || "购买";
            Scratch.vm.runtime.startHats("marketplacebuilder_onItemClick", { ID: this._findGUIId(gui) });
        });
        card.appendChild(btn);

        return card;
    }

    _filterCurrent(gui, q) {
        const catId = gui.currentCategory;
        if (!catId) return;
        const cat = gui.categories[catId];
        if (!cat) return;
        const query = (q || "").toLowerCase();
        let i = 0;
        cat.cards.forEach((card, id) => {
            const hay = card.innerText.toLowerCase();
            card.style.display = hay.includes(query) ? "" : "none";
            i++;
        });
    }

    _fireCartChange(id) {
        Scratch.vm.runtime.startHats("marketplacebuilder_onCartChange", { ID: id });
    }

    // ----------------- 积木实现 -----------------

    createGUI(args) {
        this._createGUIRoot(args.ID, args.TITLE);
    }

    closeGUI(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.root.remove();
        delete this.guis[args.ID];
    }

    guiExists(args) {
        return !!this._ensureGUI(args.ID);
    }

    setMode(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const mode = (args.MODE || "marketplace").toLowerCase();
        gui.mode = mode.includes("市场") ? "marketplace" : "settings";

        // 清空主内容
        gui.content.innerHTML = "";
        gui.searchWrap.style.display = (gui.mode === "marketplace") ? gui.searchWrap.style.display : "none";
        gui.sidebar.style.display = (gui.mode === "marketplace") ? "block" : "none";

        if (gui.mode === "settings") {
            // 设置布局：垂直表单
            gui.content.style.display = "block";
            gui.content.style.overflowY = "auto";
        } else {
            // 返回市场网格布局
            gui.content.style.display = "grid";
            gui.content.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
            gui.content.style.gap = "12px";
            // 显示当前分类
            if (gui.currentCategory && gui.categories[gui.currentCategory]) {
                gui.content.appendChild(gui.categories[gui.currentCategory].listEl);
                gui.categories[gui.currentCategory].listEl.style.display = "grid";
            }
        }
    }

    // ---- 分类

    addCategory(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const { CAT, LABEL, URL } = args;
        if (gui.categories[CAT]) return;

        const cat = this._categoryEnsure(gui, CAT);
        cat.label = LABEL || CAT;
        cat.icon = URL || "";

        const btn = this._buildCategoryButton(gui, CAT, cat.label, cat.icon);
        cat.btn = btn;
        gui.sidebar.appendChild(btn);

        // 第一个分类 -> 选中
        if (!gui.currentCategory) {
            this._switchCategoryInternal(args.ID, CAT);
        }
    }

    renameCategory(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat) return;
        cat.label = args.NEWLABEL;
        if (cat.btn) {
            const span = cat.btn.querySelector("span");
            if (span) span.innerText = args.NEWLABEL;
        }
    }

    setCategoryIcon(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat || !cat.btn) return;
        cat.icon = args.URL;

        // 移除旧图片
        const oldImg = cat.btn.querySelector("img");
        if (oldImg) oldImg.remove();

        if (args.URL) {
            const img = document.createElement("img");
            img.src = args.URL;
            img.style.width = "20px";
            img.style.height = "20px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "4px";
            cat.btn.insertBefore(img, cat.btn.firstChild);
        }
    }

    removeCategory(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const { CAT } = args;
        const cat = gui.categories[CAT];
        if (!cat) return;

        if (cat.btn) cat.btn.remove();
        if (cat.listEl && cat.listEl.parentElement) cat.listEl.parentElement.removeChild(cat.listEl);
        delete gui.categories[CAT];

        if (gui.currentCategory === CAT) {
            const first = Object.keys(gui.categories)[0] || "";
            gui.currentCategory = "";
            if (first) this._switchCategoryInternal(args.ID, first);
        }
    }

    switchCategory(args) {
        this._switchCategoryInternal(args.ID, args.CAT);
    }

    currentCategory(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return "";
        return gui.currentCategory || "";
    }

    onCategorySwitch() { return true; }

    // ---- 商品

    addItem(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;

        const cat = this._categoryEnsure(gui, args.CAT);
        if (!cat.btn) {
            // 如果不存在则自动创建按钮
            const btn = this._buildCategoryButton(gui, args.CAT, cat.label, cat.icon);
            cat.btn = btn;
            gui.sidebar.appendChild(btn);
        }

        if (cat.cards.has(args.ITEM)) {
            // 替换现有商品
            const oldCard = cat.cards.get(args.ITEM);
            oldCard.remove();
            cat.cards.delete(args.ITEM);
            const idx = cat.itemIds.indexOf(args.ITEM);
            if (idx > -1) cat.itemIds.splice(idx, 1);
        }

        const card = this._makeItemCard(gui, args);
        card.dataset.itemId = args.ITEM;
        card.dataset.price = args.PRICE || "0";
        cat.listEl.appendChild(card);
        cat.cards.set(args.ITEM, card);
        cat.itemIds.push(args.ITEM);

        // 如果需要则附加到内容区
        if (gui.currentCategory === args.CAT && !gui.content.contains(cat.listEl)) {
            gui.content.innerHTML = "";
            gui.content.appendChild(cat.listEl);
            cat.listEl.style.display = "grid";
        }

        this._renderCategoryPage(gui, args.CAT);
    }

    deleteItem(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const catId = gui.currentCategory; // 不知道哪个分类，扫描所有
        for (const [cId, cat] of Object.entries(gui.categories)) {
            if (cat.cards.has(args.ITEM)) {
                const card = cat.cards.get(args.ITEM);
                card.remove();
                cat.cards.delete(args.ITEM);
                const i = cat.itemIds.indexOf(args.ITEM);
                if (i > -1) cat.itemIds.splice(i, 1);
                if (gui.currentCategory === cId) {
                    this._renderCategoryPage(gui, cId);
                }
                return;
            }
        }
    }

    setItemColors(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        for (const cat of Object.values(gui.categories)) {
            const card = cat.cards.get(args.ITEM);
            if (!card) continue;
            card.style.background = args.BG || card.style.background;
            card.style.color = args.TEXT || card.style.color;
            const btn = card.querySelector("button");
            if (btn && args.BTN) btn.style.background = args.BTN;
        }
    }

    onItemClick() { return true; }
    lastClickedItemId() { return this.lastClicked.itemId; }
    lastClickedItemTitle() { return this.lastClicked.itemTitle; }
    lastClickedItemButton() { return this.lastClicked.itemButton; }

    // ---- 购物车

    addToCart(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const itemId = args.ITEM;
        let price = 0;
        let title = itemId;

        // 查找商品
        for (const cat of Object.values(gui.categories)) {
            const card = cat.cards.get(itemId);
            if (card) {
                const priceEl = card.querySelector('[data-raw]');
                price = Number(priceEl ? priceEl.dataset.raw : card.dataset.price || 0);
                const t = card.querySelector("div");
                if (t) title = t.innerText || title;
                break;
            }
        }

        const qty = Math.max(1, Number(args.Q || 1));
        const it = gui.cart.items[itemId] || { qty: 0, price, title };
        it.qty += qty;
        it.price = price;
        it.title = title;
        gui.cart.items[itemId] = it;

        this._fireCartChange(args.ID);
    }

    removeFromCart(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const qty = Math.max(1, Number(args.Q || 1));
        const it = gui.cart.items[args.ITEM];
        if (!it) return;
        it.qty -= qty;
        if (it.qty <= 0) delete gui.cart.items[args.ITEM];
        this._fireCartChange(args.ID);
    }

    clearCart(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.cart.items = {};
        this._fireCartChange(args.ID);
    }

    cartCount(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return 0;
        let count = 0;
        for (const it of Object.values(gui.cart.items)) count += it.qty;
        return count;
    }

    cartTotal(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return 0;
        let total = 0;
        for (const it of Object.values(gui.cart.items)) total += it.qty * (Number(it.price) || 0);
        return total;
    }

    cartItemsJSON(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return "[]";
        try {
            return JSON.stringify(gui.cart.items);
        } catch {
            return "[]";
        }
    }

    setCurrency(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.cart.currency = args.CUR || "¥";
        // 刷新可见价格
        for (const cat of Object.values(gui.categories)) {
            cat.cards.forEach(card => {
                const priceEl = card.querySelector("div:nth-child(3)");
                if (priceEl) {
                    const raw = priceEl.dataset.raw || "0";
                    priceEl.innerText = gui.cart.currency + raw;
                }
            });
        }
    }

    onCartChange() { return true; }

    // ---- 分页

    setItemsPerPage(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat) return;
        cat.itemsPerPage = Math.max(1, Number(args.N || 12));
        cat.currentPage = 1;
        this._renderCategoryPage(gui, args.CAT);
    }

    goToPage(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat) return;

        const total = Math.max(1, Math.ceil(cat.itemIds.length / cat.itemsPerPage));
        let p = Math.max(1, Math.min(total, Number(args.P || 1)));
        cat.currentPage = p;
        this._renderCategoryPage(gui, args.CAT);
    }

    nextPage(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat) return;
        const total = Math.max(1, Math.ceil(cat.itemIds.length / cat.itemsPerPage));
        cat.currentPage = Math.min(total, cat.currentPage + 1);
        this._renderCategoryPage(gui, args.CAT);
    }

    prevPage(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const cat = gui.categories[args.CAT];
        if (!cat) return;
        cat.currentPage = Math.max(1, cat.currentPage - 1);
        this._renderCategoryPage(gui, args.CAT);
    }

    currentPage(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return 0;
        const cat = gui.categories[args.CAT];
        if (!cat) return 0;
        return cat.currentPage;
    }

    totalPages(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return 0;
        const cat = gui.categories[args.CAT];
        if (!cat) return 0;
        return Math.max(1, Math.ceil(cat.itemIds.length / cat.itemsPerPage));
    }

    onPageChange() { return true; }

    // ---- 搜索

    addSearchBar(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        if (gui.mode !== "marketplace") return;

        gui.searchWrap.innerHTML = "";
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = args.TEXT || "搜索...";
        input.style.width = "100%";
        input.style.padding = "6px 8px";
        input.style.borderRadius = "4px";
        input.style.border = "1px solid #ccc";
        gui.searchWrap.appendChild(input);
        gui.searchWrap.style.display = "block";
        gui.searchBox = input;

        input.addEventListener("input", () => {
            const q = input.value || "";
            const id = this._findGUIId(gui);
            this.searchQueries[id] = q;
            this._filterCurrent(gui, q);
        });
    }

    searchQuery(args) {
        return this.searchQueries[args.ID] || "";
    }

    filterItems(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const q = args.TEXT || "";
        this.searchQueries[args.ID] = q;
        this._filterCurrent(gui, q);
    }

    // ---- 音效

    setClickSound(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.clickSoundUrl = args.URL || "";
    }

    setButtonSound(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.buttonSoundUrl = args.URL || "";
    }

    // ---- 主题 / 位置

    setTheme(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const theme = (args.THEME || "浅色").toLowerCase();
        if (theme === "自定义") return;
        this._applyTheme(gui, theme);
    }

    setCustomColors(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        const colors = { bg: args.BG, text: args.TEXT, card: args.CARD, sidebar: args.SIDEBAR };
        this._applyColors(gui, colors);
        gui.theme = "自定义";
    }

    setVisible(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.root.style.display = args.V ? "flex" : "none";
    }

    moveGUI(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.root.style.left = args.X + "px";
        gui.root.style.top = args.Y + "px";
    }

    resizeGUI(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        gui.root.style.width = args.W + "px";
        gui.root.style.height = args.H + "px";
    }

    // ---- 设置模式积木

    _ensureSettingsLayout(gui) {
        if (gui.mode !== "settings") {
            gui.mode = "settings";
            this.setMode({ ID: this._findGUIId(gui), MODE: "设置模式" });
        }
    }

    addSettingToggle(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        this._ensureSettingsLayout(gui);

        const wrap = document.createElement("label");
        wrap.style.display = "flex";
        wrap.style.alignItems = "center";
        wrap.style.gap = "8px";
        wrap.style.margin = "6px 0";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!args.VAL;

        const span = document.createElement("span");
        span.innerText = args.LABEL || args.KEY;

        wrap.appendChild(input);
        wrap.appendChild(span);
        gui.content.appendChild(wrap);

        gui.settings[args.KEY] = input.checked;
        gui.settingsElems[args.KEY] = input;

        input.addEventListener("change", () => {
            gui.settings[args.KEY] = input.checked;
            Scratch.vm.runtime.startHats("marketplacebuilder_onSettingChange", { ID: args.ID });
        });
    }

    addSettingDropdown(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        this._ensureSettingsLayout(gui);

        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.flexDirection = "column";
        wrap.style.margin = "6px 0";

        const label = document.createElement("div");
        label.innerText = args.LABEL || args.KEY;
        label.style.marginBottom = "4px";

        const select = document.createElement("select");
        (args.CSV || "").split(",").map(s => s.trim()).forEach(opt => {
            const o = document.createElement("option");
            o.value = opt;
            o.text = opt;
            if (opt === args.VAL) o.selected = true;
            select.appendChild(o);
        });

        wrap.appendChild(label);
        wrap.appendChild(select);
        gui.content.appendChild(wrap);

        gui.settings[args.KEY] = select.value;
        gui.settingsElems[args.KEY] = select;

        select.addEventListener("change", () => {
            gui.settings[args.KEY] = select.value;
            Scratch.vm.runtime.startHats("marketplacebuilder_onSettingChange", { ID: args.ID });
        });
    }

    addSettingSlider(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return;
        this._ensureSettingsLayout(gui);

        const wrap = document.createElement("div");
        wrap.style.display = "flex";
        wrap.style.flexDirection = "column";
        wrap.style.margin = "6px 0";

        const label = document.createElement("div");
        label.innerText = args.LABEL || args.KEY;
        label.style.marginBottom = "4px";

        const input = document.createElement("input");
        input.type = "range";
        input.min = Number(args.MIN || 0);
        input.max = Number(args.MAX || 100);
        input.value = Number(args.VAL || 0);

        const valueSpan = document.createElement("span");
        valueSpan.innerText = input.value;
        valueSpan.style.marginTop = "2px";
        valueSpan.style.opacity = "0.7";
        valueSpan.style.fontSize = "12px";

        wrap.appendChild(label);
        wrap.appendChild(input);
        wrap.appendChild(valueSpan);
        gui.content.appendChild(wrap);

        gui.settings[args.KEY] = Number(input.value);
        gui.settingsElems[args.KEY] = input;

        input.addEventListener("input", () => {
            gui.settings[args.KEY] = Number(input.value);
            valueSpan.innerText = input.value;
            Scratch.vm.runtime.startHats("marketplacebuilder_onSettingChange", { ID: args.ID });
        });
    }

    getSettingValue(args) {
        const gui = this._ensureGUI(args.ID);
        if (!gui) return "";
        const val = gui.settings[args.KEY];
        return typeof val === "boolean" ? (val ? "true" : "false") : String(val ?? "");
    }

    onSettingChange() { return true; }
}

Scratch.extensions.register(new MarketplaceBuilder());
