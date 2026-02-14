class AdvancedDetectorV2PlusExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.keyStates = {};
        this.comboBuffer = []; // 组合键缓冲区
        this.setupKeyboardListeners();
    }

    getInfo() {
        return {
            id: 'advancedDetectorV2Plus',
            name: '高级侦测扩展',
            color1: '#0000A0',
            color2: '#6699CC',
            blocks: [
                {
                    opcode: 'isKeyPressed',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '如果按下 [KEY] 键',
                    arguments: {
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'keyOptions'
                        }
                    }
                },
                {
                    opcode: 'isComboPressed',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '同时按下 [COMBO]',
                    arguments: {
                        COMBO: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'comboMenu'
                        }
                    }
                },
                {
                    opcode: 'getAllPressedKeys',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '所有按下的按键'
                }
            ],
            menus: {
                keyOptions: {
                    acceptReporters: false,
                    items: [
                        'Space', 'Enter', 'Shift', 'Control', 'Alt', 'Tab',
                        'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                        'Backspace', 'Delete', 'Home', 'End', 'PageUp', 'PageDown',
                        'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
                        'F9', 'F10', 'F11', 'F12',
                        'Pause', 'Insert', 'NumLock', 'ScrollLock',
                        'ContextMenu', 'BrowserSearch', 'BrowserHome', 'BrowserRefresh'
                    ]
                },
                comboMenu: {
                    acceptReporters: false,
                    items: [
                        'Control+Shift',
                        'Alt+F4',
                        'Ctrl+C',
                        'Ctrl+V',
                        'Shift+Delete',
                        'Win+D',
                        'Cmd+Q', // Mac专用
                        'F1+Alt',
                        'Ctrl+Shift+Esc'
                    ]
                }
            }
        };
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            this.keyStates[e.code] = true;
            this.handleCombos(e);
        });
        document.addEventListener('keyup', (e) => {
            this.keyStates[e.code] = false;
            this.comboBuffer = this.comboBuffer.filter(combo => 
                !combo.includes(e.code)
            );
        });
    }

    handleCombos(e) {
        // 组合键检测逻辑
        const activeCombos = [];
        if (e.ctrlKey) activeCombos.push('Control');
        if (e.shiftKey) activeCombos.push('Shift');
        if (e.altKey) activeCombos.push('Alt');
        if (e.metaKey) activeCombos.push('Meta'); // Win/macOS键

        // 检查预设组合键
        this.comboMenu.items.forEach(combo => {
            const parts = combo.split('+').map(part => part.trim());
            if (parts.every(part => activeCombos.includes(part))) {
                this.comboBuffer.push(combo);
            }
        });
    }

    isKeyPressed(args) {
        const key = args.KEY;
        const keyCodeMap = {
            ...this.defaultKeyCodeMap,
            'ContextMenu': 'ContextMenu',
            'BrowserSearch': 'Search',
            'BrowserHome': 'Home',
            'BrowserRefresh': 'Reload',
            'Pause': 'Pause',
            'Insert': 'Insert',
            'NumLock': 'NumLock',
            'ScrollLock': 'ScrollLock',
            'PrintScreen': 'PrintScreen',
            'Win': 'Meta' // Windows键
        };
        const actualKey = keyCodeMap[key] || key;
        return !!this.keyStates[actualKey];
    }

    isComboPressed(args) {
        const combo = args.COMBO.toLowerCase();
        return this.comboBuffer.includes(combo);
    }

    getAllPressedKeys() {
        return Object.keys(this.keyStates)
            .filter(key => this.keyStates[key])
            .map(key => this.getKeyDisplayName(key))
            .join(', ');
    }

    getKeyDisplayName(code) {
        const displayMap = {
            ...this.defaultDisplayMap,
            'ContextMenu': '菜单键',
            'BrowserSearch': '搜索键',
            'BrowserHome': '主页键',
            'BrowserRefresh': '刷新键',
            'PrintScreen': 'Print Screen',
            'ContextMenu': '菜单键',
            'Win': 'Win键',
            'Meta': 'Win/macOS键'
        };
        return displayMap[code] || code.replace('Key', '').replace('Digit', '').replace('Arrow', '');
    }

    // 保留原有代码结构
    get defaultKeyCodeMap() {
        return {
            'Space': 'Space',
            'Enter': 'Enter',
            'Shift': 'ShiftLeft',
            'Control': 'ControlLeft',
            'Alt': 'AltLeft',
            'Tab': 'Tab',
            'Esc': 'Escape',
            'ArrowUp': 'ArrowUp',
            'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft',
            'ArrowRight': 'ArrowRight',
            'Backspace': 'Backspace',
            'Delete': 'Delete',
            'Home': 'Home',
            'End': 'End',
            'PageUp': 'PageUp',
            'PageDown': 'PageDown',
            'CapsLock': 'CapsLock',
            'F1': 'F1',
            'F2': 'F2',
            'F3': 'F3',
            'F4': 'F4',
            'F5': 'F5',
            'F6': 'F6',
            'F7': 'F7',
            'F8': 'F8',
            'F9': 'F9',
            'F10': 'F10',
            'F11': 'F11',
            'F12': 'F12'
        };
    }

    get defaultDisplayMap() {
        return {
            'ShiftLeft': 'Shift',
            'ShiftRight': 'Shift',
            'ControlLeft': 'Control',
            'ControlRight': 'Control',
            'AltLeft': 'Alt',
            'AltRight': 'Alt',
            'MetaLeft': 'Meta',
            'MetaRight': 'Meta'
        };
    }
}

Scratch.extensions.register(new AdvancedDetectorV2PlusExtension());