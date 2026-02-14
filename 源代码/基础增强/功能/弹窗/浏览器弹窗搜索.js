class BlueSearchExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.searchContainer = null;
        this.dockContainer = null;
        this.currentEngine = 'google';
        this.isEditingDock = false;
        
        // 默认搜索引擎配置
        this.searchEngines = [
            { name: 'Google', value: 'google', color: '#4285F4' },
            { name: 'Bing', value: 'bing', color: '#008373' },
            { name: '百度', value: 'baidu', color: '#2932E1' },
            { name: 'DuckDuckGo', value: 'duckduckgo', color: '#DE5833' },
            { name: 'YouTube', value: 'youtube', color: '#FF0000' },
            { name: '自定义', value: 'custom', color: '#666666' }
        ];
        
        // 默认Dock项目
        this.dockItems = JSON.parse(localStorage.getItem('bluesearch_dock_items')) || [
            { icon: '📺', name: '哔哩哔哩', url: 'https://www.bilibili.com' },
            { icon: '🎵', name: '抖音', url: 'https://www.douyin.com' },
            { icon: '✉️', name: 'QQ邮箱', url: 'https://mail.qq.com' },
            { icon: '🎶', name: '网易云音乐', url: 'https://music.163.com' }
        ];
    }

    getInfo() {
        return {
            id: 'bluesearch',
            name: 'BlueSearch',
            blocks: [
                {
                    opcode: 'createFullscreenSearch',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '创建全屏BlueSearch 标题 [TITLE] 默认引擎 [ENGINE] 背景色 [COLOR] 模糊度 [BLUR]',
                    arguments: {
                        TITLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'BlueSearch'
                        },
                        ENGINE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'searchEngines',
                            defaultValue: 'google'
                        },
                        COLOR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'rgba(255, 255, 255, 0.15)'
                        },
                        BLUR: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '12'
                        }
                    }
                },
                {
                    opcode: 'closeSearch',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '关闭BlueSearch界面'
                }
            ],
            menus: {
                searchEngines: {
                    acceptReporters: true,
                    items: this.searchEngines.map(engine => engine.value)
                }
            }
        };
    }

    // 辅助方法：创建带有基本样式的元素
    createStyledElement(tag, styles = {}, textContent = '') {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        if (textContent) element.textContent = textContent;
        return element;
    }

    // 辅助方法：创建按钮元素
    createButton(text, styles = {}, hoverStyles = {}) {
        const button = this.createStyledElement('button', {
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: 'rgba(0, 136, 255, 0.7)',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            ...styles
        }, text);

        if (Object.keys(hoverStyles).length > 0) {
            button.onmouseover = () => Object.assign(button.style, hoverStyles);
            button.onmouseout = () => Object.assign(button.style, styles);
        }

        return button;
    }

    // 创建版权信息
    createCopyrightNotice() {
        const copyright = this.createStyledElement('div', {
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            zIndex: '10000'
        }, '©BlueStudio 2025');
        
        return copyright;
    }

    // 创建搜索主界面
    createFullscreenSearch(args) {
        this.closeSearch(); // 先关闭已有界面

        const { TITLE: title = 'BlueSearch', ENGINE: engine = 'google', COLOR: color, BLUR: blur } = args;
        this.currentEngine = engine;

        // 创建主容器
        this.searchContainer = this.createStyledElement('div', {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: '9999',
            backdropFilter: `blur(${blur}px)`,
            overflow: 'hidden'
        });

        // 创建内容区域
        const content = this.createContentArea(title, color);
        this.searchContainer.appendChild(content);

        // 创建Dock栏
        this.createDockArea();

        // 添加版权信息
        const copyright = this.createCopyrightNotice();
        this.searchContainer.appendChild(copyright);

        // 添加到文档
        document.body.appendChild(this.searchContainer);
    }

    // 创建内容区域
    createContentArea(title, color) {
        const content = this.createStyledElement('div', {
            width: 'calc(100% - 40px)',
            maxWidth: '800px',
            padding: '40px',
            borderRadius: '20px',
            backgroundColor: color,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxSizing: 'border-box',
            marginTop: '60px'
        });

        // 标题
        const titleElement = this.createStyledElement('h1', {
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '2.5rem'
        }, title);

        // 搜索引擎选择器
        const engineSelector = this.createEngineSelector();
        
        // 搜索输入框
        const searchInput = this.createSearchInput();

        content.appendChild(titleElement);
        content.appendChild(engineSelector);
        content.appendChild(searchInput);

        return content;
    }

    // 创建搜索引擎选择器
    createEngineSelector() {
        const container = this.createStyledElement('div', {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '10px',
            flexWrap: 'wrap'
        });

        this.searchEngines.forEach(engine => {
            const btn = this.createButton(engine.name, {
                backgroundColor: engine.value === this.currentEngine ? 
                    this.hexToRgba(engine.color, 0.7) : 'rgba(255, 255, 255, 0.1)'
            }, {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            });

            btn.onclick = () => {
                this.currentEngine = engine.value;
                container.querySelectorAll('button').forEach(b => {
                    const eng = this.searchEngines.find(e => e.value === b.value);
                    b.style.backgroundColor = b.value === this.currentEngine ? 
                        this.hexToRgba(eng.color, 0.7) : 'rgba(255, 255, 255, 0.1)';
                });
                
                if (engine.value === 'custom') {
                    this.promptCustomSearchUrl();
                }
            };
            
            container.appendChild(btn);
        });

        return container;
    }

    // 创建搜索输入框
    createSearchInput() {
        const container = this.createStyledElement('div', {
            position: 'relative',
            width: '100%',
            marginBottom: '15px'
        });

        const input = this.createStyledElement('input', {
            type: 'text',
            width: '100%',
            padding: '15px 50px 15px 20px',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box'
        });
        input.placeholder = '输入搜索内容...';

        const searchButton = this.createButton('🔍', {
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '30px',
            height: '30px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }, {
            backgroundColor: 'rgba(0, 136, 255, 0.9)',
            transform: 'translateY(-50%) scale(1.1)'
        });

        searchButton.onclick = () => this.performSearch(input.value, input);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchButton.click();
        });

        container.appendChild(input);
        container.appendChild(searchButton);

        return container;
    }

    // 执行搜索
    performSearch(query, inputElement) {
        if (!query) return;
        
        const searchUrl = this.getSearchUrl(this.currentEngine, query);
        if (searchUrl) {
            window.open(searchUrl, '_blank');
            if (inputElement) inputElement.value = '';
        }
    }

    // 创建Dock区域
    createDockArea() {
        this.dockContainer = this.createStyledElement('div', {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '10px 20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        });

        const editButton = this.createButton('编辑', {
            marginLeft: '20px'
        }, {
            backgroundColor: 'rgba(0, 136, 255, 0.9)'
        });

        editButton.onclick = () => this.toggleDockEditMode();

        this.dockContainer.appendChild(editButton);
        this.searchContainer.appendChild(this.dockContainer);

        // 创建Dock设置面板
        this.createDockSettingsPanel();
        
        // 更新Dock显示
        this.updateDock();
    }

    // 创建Dock设置面板
    createDockSettingsPanel() {
        this.dockSettingsPanel = this.createStyledElement('div', {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '600px',
            padding: '20px',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: '10000',
            display: 'none',
            border: '1px solid rgba(255, 255, 255, 0.3)'
        });

        const settingsTitle = this.createStyledElement('h2', {
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px'
        }, 'Dock栏设置');

        this.dockItemsContainer = this.createStyledElement('div', {
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px'
        });

        const addNewItemBtn = this.createButton('+ 添加新项目', {
            width: '100%',
            padding: '10px',
            marginBottom: '20px'
        }, {
            backgroundColor: 'rgba(0, 136, 255, 0.9)'
        });

        addNewItemBtn.onclick = () => this.addNewDockItem();

        const saveBtn = this.createButton('保存设置', {
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(76, 175, 80, 0.7)'
        }, {
            backgroundColor: 'rgba(76, 175, 80, 0.9)'
        });

        saveBtn.onclick = () => this.saveDockSettings();

        this.dockSettingsPanel.appendChild(settingsTitle);
        this.dockSettingsPanel.appendChild(this.dockItemsContainer);
        this.dockSettingsPanel.appendChild(addNewItemBtn);
        this.dockSettingsPanel.appendChild(saveBtn);
        
        this.searchContainer.appendChild(this.dockSettingsPanel);
    }

    // 更新Dock显示
    updateDock() {
        if (!this.dockContainer) return;
        
        // 保留编辑按钮
        const editButton = this.dockContainer.querySelector('button');
        this.dockContainer.innerHTML = '';
        if (editButton) this.dockContainer.appendChild(editButton);
        
        this.dockItems.forEach((item, index) => {
            const dockItem = this.createStyledElement('div', {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
            });

            const icon = this.createStyledElement('div', {
                fontSize: '24px',
                marginBottom: '5px'
            }, item.icon);

            const name = this.createStyledElement('div', {
                fontSize: '12px',
                color: 'white'
            }, item.name);

            const deleteBtn = this.createStyledElement('div', {
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 59, 48, 0.8)',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                display: this.isEditingDock ? 'flex' : 'none'
            }, '×');

            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.dockItems.splice(index, 1);
                this.updateDock();
            };

            dockItem.onmouseover = () => {
                dockItem.style.transform = 'translateY(-5px)';
                dockItem.style.opacity = '0.9';
            };
            
            dockItem.onmouseout = () => {
                dockItem.style.transform = 'translateY(0)';
                dockItem.style.opacity = '1';
            };
            
            dockItem.onclick = () => {
                if (this.isEditingDock) {
                    this.editDockItem(index);
                } else {
                    window.open(item.url, '_blank');
                }
            };

            dockItem.appendChild(icon);
            dockItem.appendChild(name);
            dockItem.appendChild(deleteBtn);
            
            this.dockContainer.insertBefore(dockItem, editButton);
        });
    }

    // 编辑Dock项目
    editDockItem(index) {
        const item = this.dockItems[index];
        const newIcon = prompt('输入新的图标(emoji):', item.icon);
        if (newIcon !== null) item.icon = newIcon;
        
        const newName = prompt('输入新的名称:', item.name);
        if (newName !== null) item.name = newName;
        
        const newUrl = prompt('输入新的URL:', item.url);
        if (newUrl !== null) item.url = newUrl;
        
        this.updateDock();
    }

    // 切换Dock编辑模式
    toggleDockEditMode() {
        this.isEditingDock = !this.isEditingDock;
        this.updateDock();
        this.showDockSettingsPanel();
    }

    // 显示/隐藏Dock设置面板
    showDockSettingsPanel() {
        if (this.isEditingDock) {
            this.dockSettingsPanel.style.display = 'block';
            this.updateDockSettingsPanel();
        } else {
            this.dockSettingsPanel.style.display = 'none';
        }
    }

    // 更新Dock设置面板内容
    updateDockSettingsPanel() {
        this.dockItemsContainer.innerHTML = '';
        
        this.dockItems.forEach((item, index) => {
            const itemContainer = this.createStyledElement('div', {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
            });

            const iconInput = this.createStyledElement('input', {
                type: 'text',
                width: '50px',
                marginRight: '10px',
                padding: '5px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
            });
            iconInput.value = item.icon;

            const nameInput = this.createStyledElement('input', {
                type: 'text',
                flex: '1',
                marginRight: '10px',
                padding: '5px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
            });
            nameInput.value = item.name;

            const urlInput = this.createStyledElement('input', {
                type: 'text',
                flex: '2',
                marginRight: '10px',
                padding: '5px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
            });
            urlInput.value = item.url;

            const deleteBtn = this.createButton('删除', {
                padding: '5px 10px',
                backgroundColor: 'rgba(255, 59, 48, 0.7)'
            }, {
                backgroundColor: 'rgba(255, 59, 48, 0.9)'
            });

            deleteBtn.onclick = () => {
                this.dockItems.splice(index, 1);
                this.updateDockSettingsPanel();
            };

            const updateItem = () => {
                this.dockItems[index] = {
                    icon: iconInput.value,
                    name: nameInput.value,
                    url: urlInput.value
                };
            };

            iconInput.addEventListener('change', updateItem);
            nameInput.addEventListener('change', updateItem);
            urlInput.addEventListener('change', updateItem);

            itemContainer.appendChild(iconInput);
            itemContainer.appendChild(nameInput);
            itemContainer.appendChild(urlInput);
            itemContainer.appendChild(deleteBtn);
            
            this.dockItemsContainer.appendChild(itemContainer);
        });
    }

    // 添加新Dock项目
    addNewDockItem() {
        this.dockItems.push({
            icon: '🔗',
            name: '新网站',
            url: 'https://'
        });
        this.updateDockSettingsPanel();
    }

    // 保存Dock设置
    saveDockSettings() {
        localStorage.setItem('bluesearch_dock_items', JSON.stringify(this.dockItems));
        this.isEditingDock = false;
        this.updateDock();
        this.dockSettingsPanel.style.display = 'none';
    }

    // 提示自定义搜索引擎URL
    promptCustomSearchUrl() {
        const customUrl = prompt("请输入自定义搜索引擎URL模板（使用{query}作为查询参数占位符）:", 
            localStorage.getItem('bluesearch_custom_url') || 'https://example.com/search?q={query}');
        if (customUrl) {
            localStorage.setItem('bluesearch_custom_url', customUrl);
        }
    }

    // 获取搜索URL
    getSearchUrl(engine, query) {
        if (!query) return null;
        
        switch (engine) {
            case 'google': return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            case 'bing': return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
            case 'baidu': return `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
            case 'duckduckgo': return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            case 'youtube': return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            case 'custom':
                const customUrl = localStorage.getItem('bluesearch_custom_url');
                return customUrl ? customUrl.replace('{query}', encodeURIComponent(query)) : null;
            default: return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    // 辅助方法：将十六进制颜色转换为RGBA
    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 关闭搜索界面
    closeSearch() {
        if (this.searchContainer) {
            document.body.removeChild(this.searchContainer);
            this.searchContainer = null;
            this.dockContainer = null;
        }
    }
}

Scratch.extensions.register(new BlueSearchExtension());