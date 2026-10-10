(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('高级鼠标扩展必须在 unsandboxed 模式下运行');
    }

    const EXT_ID = 'advancedMouse';
    const INSTANCE_KEY = Symbol.for('scratch.extensions.advancedMouse.instance');
    const runtime = Scratch.vm.runtime;
    const canvas = runtime.renderer && runtime.renderer.canvas;
    if (!canvas) {
        throw new Error('未找到舞台 canvas');
    }

    class AdvancedMouse {
        constructor() {
            const previousInstance = runtime[INSTANCE_KEY];
            if (previousInstance && typeof previousInstance.dispose === 'function') {
                previousInstance.dispose();
            }

            this.mouseX = 0;
            this.mouseY = 0;
            this.clientX = 0;
            this.clientY = 0;
            this.movementX = 0;
            this.movementY = 0;
            this.wheelX = 0;
            this.wheelY = 0;
            this.wheelZ = 0;

            this.buttons = {};
            this.buttonDownTime = {};
            this.inside = false;
            this.preventContextMenu = false;
            this.cursorStyle = 'default';

            // 指针追踪（移动端多点触控）
            this._activePointerId = null;
            this._lastClientX = 0;
            this._lastClientY = 0;

            // 拖动相关
            this.dragging = false;
            this.dragButton = -1;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.dragCurrentX = 0;
            this.dragCurrentY = 0;
            this.dragEndX = 0;
            this.dragEndY = 0;
            this.dragStartClientX = 0;
            this.dragStartClientY = 0;
            this.dragThreshold = 4;
            this.possibleDrag = false;
            this.possibleDragButton = -1;

            this.dragSpeed = 0;
            this.dragDirection = 0;
            this.dragTotalDistance = 0;
            this.dragLastClientX = 0;
            this.dragLastClientY = 0;
            this.dragLastScratchX = 0;
            this.dragLastScratchY = 0;
            this.dragLastTime = 0;
            this.lastPointerDownClientX = null;
            this.lastPointerDownClientY = null;

            // 拖拽框选角色相关
            this.dragSelectEnabled = false;
            this.dragSelectShowBox = true;
            this.dragSelectElement = null;
            this.dragSelectedSprites = [];
            this.dragSelectStartClientX = 0;
            this.dragSelectStartClientY = 0;
            this.dragSelectCurrentClientX = 0;
            this.dragSelectCurrentClientY = 0;

            // 双击相关
            this.lastDoubleClickButton = -1;
            this.lastDoubleClickX = 0;
            this.lastDoubleClickY = 0;
            this.doubleClicked = false;
            this.doubleClickTimer = null;
            this.doubleClickMaxMove = 8;
            this.doubleClickMaxInterval = 500;
            this.lastClickTime = 0;
            this.lastClickButton = -1;
            this.lastClickClientX = 0;
            this.lastClickClientY = 0;

            // 连击相关
            this.multiClickRequired = { 0: 2, 2: 2 };
            this.multiClickCount = {};
            this.multiClickLastTime = {};
            this.multiClickLastClientX = {};
            this.multiClickLastClientY = {};
            this.multiClicked = {};
            this.multiClickTimer = {};

            // 鼠标提示相关
            this.tooltipText = '';
            this.tooltipVisible = false;
            this.tooltipElement = null;
            this.tooltipBgColor = 'rgba(0, 0, 0, 0.75)';
            this.tooltipTextColor = '#ffffff';
            this.tooltipFontSize = 14;
            this.touchTooltipTimer = null;

            // 右键选择框相关（新增）
            this.contextMenuCss = `
                position: fixed;
                z-index: 2147483647;
                min-width: 180px;
                padding: 6px 0;
                background: rgba(255,255,255,0.97);
                border: 1px solid rgba(0,0,0,0.12);
                border-radius: 6px;
                box-shadow: 0 8px 18px rgba(0,0,0,0.18);
                font: 14px "Segoe UI", sans-serif;
                color: #222;
                user-select: none;
                pointer-events: auto;
            `;
            this.contextMenuVisible = false;
            this.contextMenuElement = null;
            this.contextMenuSelected = false;
            this.contextMenuSelectedId = '';
            this.contextMenuSelectedText = '';
            this.contextMenuPlacementBounds = null;
            this.contextSubmenus = new Set();
            this._abortController = new AbortController();
            this._disposed = false;
            this._originalCanvasStyles = {
                touchAction: canvas.style.touchAction,
                userSelect: canvas.style.userSelect,
                webkitUserSelect: canvas.style.webkitUserSelect,
                webkitTouchCallout: canvas.style.webkitTouchCallout,
                webkitTapHighlightColor: canvas.style.webkitTapHighlightColor,
                cursor: canvas.style.cursor
            };
            this._originalCanvasTitle = canvas.getAttribute('title');

            this._createTooltip();
            this._createContextMenu();
            this._createDragSelectBox();
            this._bindEvents();
            runtime[INSTANCE_KEY] = this;
        }

        getInfo() {
            return {
                id: EXT_ID,
                name: '高级鼠标',
                color1: '#4C97FF',
                color2: '#3373CC',
                color3: '#255AA8',
                blocks: [
                    { opcode: 'getMouseX', blockType: Scratch.BlockType.REPORTER, text: '鼠标 X' },
                    { opcode: 'getMouseY', blockType: Scratch.BlockType.REPORTER, text: '鼠标 Y' },
                    { opcode: 'getClientX', blockType: Scratch.BlockType.REPORTER, text: '页面鼠标 X' },
                    { opcode: 'getClientY', blockType: Scratch.BlockType.REPORTER, text: '页面鼠标 Y' },
                    { opcode: 'getMovementX', blockType: Scratch.BlockType.REPORTER, text: '鼠标移动增量 X' },
                    { opcode: 'getMovementY', blockType: Scratch.BlockType.REPORTER, text: '鼠标移动增量 Y' },
                    { opcode: 'getWheelY', blockType: Scratch.BlockType.REPORTER, text: '鼠标滚轮 Y' },
                    { opcode: 'resetWheel', blockType: Scratch.BlockType.COMMAND, text: '清空滚轮增量' },

                    {
                        opcode: 'isButtonDown',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '鼠标按键 [BUTTON] 按下？',
                        arguments: {
                            BUTTON: { type: Scratch.ArgumentType.STRING, menu: 'buttonMenu', defaultValue: 'left' }
                        }
                    },

                    { opcode: 'getLeftHoldSeconds', blockType: Scratch.BlockType.REPORTER, text: '左键已按住秒数' },
                    { opcode: 'getRightHoldSeconds', blockType: Scratch.BlockType.REPORTER, text: '右键已按住秒数' },
                    {
                        opcode: 'isLeftLongPressed',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '左键长按 [SECONDS] 秒？',
                        arguments: {
                            SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: 'isRightLongPressed',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '右键长按 [SECONDS] 秒？',
                        arguments: {
                            SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },

                    { opcode: 'isDragging', blockType: Scratch.BlockType.BOOLEAN, text: '正在拖动？' },
                    { opcode: 'getDragButton', blockType: Scratch.BlockType.REPORTER, text: '拖动按键' },
                    { opcode: 'getDragStartX', blockType: Scratch.BlockType.REPORTER, text: '拖动起始 X' },
                    { opcode: 'getDragStartY', blockType: Scratch.BlockType.REPORTER, text: '拖动起始 Y' },
                    { opcode: 'getDragCurrentX', blockType: Scratch.BlockType.REPORTER, text: '拖动当前 X' },
                    { opcode: 'getDragCurrentY', blockType: Scratch.BlockType.REPORTER, text: '拖动当前 Y' },
                    { opcode: 'getDragEndX', blockType: Scratch.BlockType.REPORTER, text: '拖动终止 X' },
                    { opcode: 'getDragEndY', blockType: Scratch.BlockType.REPORTER, text: '拖动终止 Y' },
                    { opcode: 'getDragSpeed', blockType: Scratch.BlockType.REPORTER, text: '拖拽速度 舞台单位/秒' },
                    { opcode: 'getDragDirection', blockType: Scratch.BlockType.REPORTER, text: '拖拽方向 角度' },
                    { opcode: 'getDragTotalDistance', blockType: Scratch.BlockType.REPORTER, text: '拖拽总距离' },

                    {
                        opcode: 'setDragSelectEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[STATE] 拖拽框选角色',
                        arguments: {
                            STATE: { type: Scratch.ArgumentType.STRING, menu: 'onOffMenu', defaultValue: '开启' }
                        }
                    },
                    {
                        opcode: 'setDragSelectBoxVisible',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[STATE] 显示拖拽框选框',
                        arguments: {
                            STATE: { type: Scratch.ArgumentType.STRING, menu: 'onOffMenu', defaultValue: '开启' }
                        }
                    },
                    { opcode: 'getDragSelectedSpriteCount', blockType: Scratch.BlockType.REPORTER, text: '框选到的角色数量' },
                    { opcode: 'getDragSelectedSpriteNames', blockType: Scratch.BlockType.REPORTER, text: '框选到的角色名字' },
                    {
                        opcode: 'isSpriteDragSelected',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '角色 [NAME] 被框选中？',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sprite1' }
                        }
                    },
                    { opcode: 'clearDragSelectedSprites', blockType: Scratch.BlockType.COMMAND, text: '清空框选角色' },

                    {
                        opcode: 'setDoubleClickMaxMove',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置双击最大移动范围 [PIXELS] 像素',
                        arguments: {
                            PIXELS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 }
                        }
                    },
                    { opcode: 'getDoubleClickMaxMove', blockType: Scratch.BlockType.REPORTER, text: '双击最大移动范围' },
                    {
                        opcode: 'setDoubleClickMaxInterval',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置双击最大间隔 [MS] 毫秒',
                        arguments: {
                            MS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 500 }
                        }
                    },
                    { opcode: 'getDoubleClickMaxInterval', blockType: Scratch.BlockType.REPORTER, text: '双击最大间隔' },
                    { opcode: 'isDoubleClick', blockType: Scratch.BlockType.BOOLEAN, text: '鼠标双击？' },
                    { opcode: 'getLastDoubleClickButton', blockType: Scratch.BlockType.REPORTER, text: '最后双击按键' },
                    { opcode: 'getLastDoubleClickX', blockType: Scratch.BlockType.REPORTER, text: '最后双击 X' },
                    { opcode: 'getLastDoubleClickY', blockType: Scratch.BlockType.REPORTER, text: '最后双击 Y' },

                    {
                        opcode: 'setMultiClickTimes',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置鼠标 [BUTTON] 连击次数为 [TIMES]',
                        arguments: {
                            BUTTON: { type: Scratch.ArgumentType.STRING, menu: 'buttonMenu', defaultValue: 'left' },
                            TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
                        }
                    },
                    {
                        opcode: 'isMultiClick',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '鼠标 [BUTTON] 连击？',
                        arguments: {
                            BUTTON: { type: Scratch.ArgumentType.STRING, menu: 'buttonMenu', defaultValue: 'left' }
                        }
                    },

                    { opcode: 'isInsideCanvas', blockType: Scratch.BlockType.BOOLEAN, text: '鼠标在舞台内？' },
                    { opcode: 'lockPointer', blockType: Scratch.BlockType.COMMAND, text: '锁定鼠标指针' },
                    { opcode: 'unlockPointer', blockType: Scratch.BlockType.COMMAND, text: '退出鼠标指针锁定' },
                    { opcode: 'isPointerLocked', blockType: Scratch.BlockType.BOOLEAN, text: '鼠标指针已锁定？' },
                    { opcode: 'hideCursor', blockType: Scratch.BlockType.COMMAND, text: '隐藏鼠标指针' },
                    { opcode: 'showCursor', blockType: Scratch.BlockType.COMMAND, text: '显示鼠标指针' },
                    {
                        opcode: 'setCursor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置鼠标样式为 [CURSOR]',
                        arguments: {
                            CURSOR: { type: Scratch.ArgumentType.STRING, menu: 'cursorMenu', defaultValue: 'default' }
                        }
                    },
                    {
                        opcode: 'setCustomCursor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置自定义光标为 [URL]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/cursor.png' }
                        }
                    },
                    {
                        opcode: 'setPreventContextMenu',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[STATE] 阻止右键菜单',
                        arguments: {
                            STATE: { type: Scratch.ArgumentType.STRING, menu: 'onOffMenu', defaultValue: '开启' }
                        }
                    },

                    {
                        opcode: 'setMouseTooltip',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置鼠标提示为 [TEXT]',
                        arguments: {
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '这是鼠标提示' }
                        }
                    },
                    { opcode: 'getMouseTooltip', blockType: Scratch.BlockType.REPORTER, text: '鼠标提示内容' },
                    { opcode: 'clearMouseTooltip', blockType: Scratch.BlockType.COMMAND, text: '清空鼠标提示' },
                    { opcode: 'showCustomTooltip', blockType: Scratch.BlockType.COMMAND, text: '显示自定义鼠标提示' },
                    { opcode: 'hideCustomTooltip', blockType: Scratch.BlockType.COMMAND, text: '隐藏自定义鼠标提示' },
                    {
                        opcode: 'setTooltipColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置提示背景 [BG] 文字 [COLOR]',
                        arguments: {
                            BG: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' }
                        }
                    },
                    {
                        opcode: 'setTooltipSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置提示文字大小 [SIZE]',
                        arguments: {
                            SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 }
                        }
                    },

                    // ===== 新增选择框积木 =====
                    {
                        opcode: 'showContextMenu',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示选择框 [JSON]',
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"items":[{"id":"new","text":"新建","children":[{"id":"new_folder","text":"文件夹"},{"id":"new_text","text":"文本文档"}]},{"id":"view","text":"查看","children":[{"id":"view_large","text":"大图标","type":"radio","checked":true},{"id":"view_medium","text":"中等图标","type":"radio"}]}]}'
                            }
                        }
                    },
                    { opcode: 'hideContextMenu', blockType: Scratch.BlockType.COMMAND, text: '隐藏选择框' },
                    { opcode: 'isContextMenuSelected', blockType: Scratch.BlockType.BOOLEAN, text: '已选择？' },
                    { opcode: 'getSelectedContextMenuId', blockType: Scratch.BlockType.REPORTER, text: '已选择项 ID' },
                    { opcode: 'getSelectedContextMenuText', blockType: Scratch.BlockType.REPORTER, text: '已选择项文本' },
                    {
                        opcode: 'setContextMenuCss',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置选择框 css [CSS]',
                        arguments: {
                            CSS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'position:fixed; z-index:2147483647; min-width:180px; background:rgba(255,255,255,0.97); border:1px solid rgba(0,0,0,0.12); border-radius:6px; box-shadow:0 8px 18px rgba(0,0,0,0.18);'
                            }
                        }
                    }
                ],
                menus: {
                    buttonMenu: {
                        acceptReporters: true,
                        items: [
                            { text: '左键', value: 'left' },
                            { text: '中键', value: 'middle' },
                            { text: '右键', value: 'right' },
                            { text: '后退键', value: 'back' },
                            { text: '前进键', value: 'forward' }
                        ]
                    },
                    cursorMenu: {
                        acceptReporters: true,
                        items: [
                            'default', 'none', 'pointer', 'crosshair', 'move',
                            'text', 'wait', 'help', 'grab', 'grabbing',
                            'not-allowed', 'zoom-in', 'zoom-out', 'cell',
                            'copy', 'alias', 'progress'
                        ]
                    },
                    onOffMenu: {
                        acceptReporters: true,
                        items: ['开启', '关闭']
                    }
                }
            };
        }

        _bindEvents() {
            const signal = this._abortController.signal;
            const listen = (target, type, handler, options = {}) => {
                target.addEventListener(type, handler, { ...options, signal });
            };

            // ============ 移动端触摸适配 ============ 
            canvas.style.touchAction = 'none';
            canvas.style.userSelect = 'none';
            canvas.style.webkitUserSelect = 'none';
            canvas.style.webkitTouchCallout = 'none';
            canvas.style.webkitTapHighlightColor = 'transparent';

            this._activePointerId = null;
            this._lastClientX = 0;
            this._lastClientY = 0;

            const shouldHandleTouch = (e) => {
                if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return true;
                return this._activePointerId === null || e.pointerId === this._activePointerId;
            };

            listen(canvas, 'pointermove', e => {
                if (!shouldHandleTouch(e)) return;

                if (e.pointerType === 'touch' || typeof e.movementX !== 'number') {
                    if (this._lastClientX !== 0 || this._lastClientY !== 0) {
                        this.movementX = e.clientX - this._lastClientX;
                        this.movementY = e.clientY - this._lastClientY;
                    } else {
                        this.movementX = 0;
                        this.movementY = 0;
                    }
                } else {
                    this.movementX = e.movementX || 0;
                    this.movementY = e.movementY || 0;
                }

                this._lastClientX = e.clientX;
                this._lastClientY = e.clientY;

                this.clientX = e.clientX;
                this.clientY = e.clientY;
                this._updateScratchMousePosition(e.clientX, e.clientY);
                this._updateTooltipPosition(e.clientX, e.clientY);

                this.dragCurrentX = this.mouseX;
                this.dragCurrentY = this.mouseY;

                if (this.dragSelectEnabled && (this.possibleDrag || this.dragging)) {
                    this.dragSelectCurrentClientX = e.clientX;
                    this.dragSelectCurrentClientY = e.clientY;
                    this._updateDragSelectBox(e.clientX, e.clientY);
                    this._updateDragSelectedSprites();
                }

                if (this.possibleDrag || this.dragging) {
                    const now = Date.now();
                    const dx = this.mouseX - this.dragLastScratchX;
                    const dy = this.mouseY - this.dragLastScratchY;
                    const distance = Math.hypot(dx, dy);
                    const dt = now - this.dragLastTime;

                    if (dt > 0) {
                        this.dragSpeed = distance / dt * 1000;
                    }

                    if (distance > 0) {
                        this.dragDirection = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
                    }

                    if (this.dragging) {
                        this.dragTotalDistance += distance;
                    }

                    this.dragLastClientX = e.clientX;
                    this.dragLastClientY = e.clientY;
                    this.dragLastScratchX = this.mouseX;
                    this.dragLastScratchY = this.mouseY;
                    this.dragLastTime = now;
                }

                if (this.possibleDrag && !this.dragging) {
                    const dx = e.clientX - this.dragStartClientX;
                    const dy = e.clientY - this.dragStartClientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance >= this.dragThreshold) {
                        this.dragging = true;
                        this.dragButton = this.possibleDragButton;
                    }
                }
            });

            listen(canvas, 'pointerenter', e => {
                this.inside = true;
                this._lastClientX = e.clientX;
                this._lastClientY = e.clientY;

                if (this.tooltipVisible && this.tooltipElement && this.tooltipText !== '') {
                    this.tooltipElement.style.display = 'block';
                }
            });

            listen(canvas, 'pointerleave', e => {
                if (e.pointerType !== 'mouse' && this._activePointerId !== null) return;
                this.inside = false;
                if (this.tooltipElement) this.tooltipElement.style.display = 'none';
                if (this.dragSelectElement) this.dragSelectElement.style.display = 'none';
            });

            listen(canvas, 'pointerdown', e => {
                if (e.pointerType !== 'mouse') {
                    if (this._activePointerId === null) {
                        this._activePointerId = e.pointerId;
                        try {
                            if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
                        } catch (err) { /* ignore */ }
                    } else if (e.pointerId !== this._activePointerId) {
                        return;
                    }
                }

                this.clientX = e.clientX;
                this.clientY = e.clientY;
                this.lastPointerDownClientX = e.clientX;
                this.lastPointerDownClientY = e.clientY;
                this._updateScratchMousePosition(e.clientX, e.clientY);
                this._updateTooltipPosition(e.clientX, e.clientY);

                if (e.pointerType !== 'mouse' && this.tooltipVisible && this.tooltipText !== '') {
                    if (this.touchTooltipTimer) {
                        clearTimeout(this.touchTooltipTimer);
                        this.touchTooltipTimer = null;
                    }
                    if (this.tooltipElement) this.tooltipElement.style.display = 'block';
                }

                this.buttons[e.button] = true;
                this.buttonDownTime[e.button] = Date.now();

                this.possibleDrag = true;
                this.possibleDragButton = e.button;

                this.dragStartClientX = e.clientX;
                this.dragStartClientY = e.clientY;

                this.dragStartX = this.mouseX;
                this.dragStartY = this.mouseY;

                this.dragCurrentX = this.mouseX;
                this.dragCurrentY = this.mouseY;

                this.dragEndX = this.mouseX;
                this.dragEndY = this.mouseY;

                this.dragSpeed = 0;
                this.dragDirection = 0;
                this.dragTotalDistance = 0;

                this.dragLastClientX = e.clientX;
                this.dragLastClientY = e.clientY;
                this.dragLastScratchX = this.mouseX;
                this.dragLastScratchY = this.mouseY;
                this.dragLastTime = Date.now();
                this._lastClientX = e.clientX;
                this._lastClientY = e.clientY;

                if (this.dragSelectEnabled) {
                    this.dragSelectedSprites = [];
                    this.dragSelectStartClientX = e.clientX;
                    this.dragSelectStartClientY = e.clientY;
                    this.dragSelectCurrentClientX = e.clientX;
                    this.dragSelectCurrentClientY = e.clientY;
                    this._updateDragSelectBox(e.clientX, e.clientY);

                    if (this.dragSelectElement && this.dragSelectShowBox) {
                        this.dragSelectElement.style.display = 'block';
                    }
                }
            });

            listen(canvas, 'pointerup', e => {
                if (e.pointerType !== 'mouse' && e.pointerId !== this._activePointerId) {
                    return;
                }

                this.clientX = e.clientX;
                this.clientY = e.clientY;
                this._updateScratchMousePosition(e.clientX, e.clientY);
                const wasDragging = this.dragging;

                if (e.pointerType !== 'mouse' && e.pointerId === this._activePointerId) {
                    try {
                        if (canvas.releasePointerCapture) canvas.releasePointerCapture(e.pointerId);
                    } catch (err) { /* ignore */ }
                    this._activePointerId = null;
                    this.inside = false;
                    if (e.pointerType !== 'mouse' && this.tooltipVisible && this.tooltipText !== '') {
                        if (this.touchTooltipTimer) clearTimeout(this.touchTooltipTimer);
                        this.touchTooltipTimer = setTimeout(() => {
                            if (this.tooltipElement) this.tooltipElement.style.display = 'none';
                            this.touchTooltipTimer = null;
                        }, 1200);
                    } else if (this.tooltipElement) {
                        this.tooltipElement.style.display = 'none';
                    }
                }

                this.buttons[e.button] = false;
                this.buttonDownTime[e.button] = 0;

                if (this.possibleDrag || this.dragging) {
                    this.dragEndX = this.mouseX;
                    this.dragEndY = this.mouseY;
                    this.dragging = false;
                    this.possibleDrag = false;
                }

                const onCanvas = e.target === canvas || e.pointerType !== 'mouse';

                if (this.dragSelectEnabled && onCanvas) {
                    this.dragSelectCurrentClientX = e.clientX;
                    this.dragSelectCurrentClientY = e.clientY;
                    this._updateDragSelectedSprites();

                    if (this.dragSelectElement) {
                        this.dragSelectElement.style.display = 'none';
                    }
                }

                if (!wasDragging && onCanvas) {
                    this._handleCustomDoubleClick(e);
                    this._handleMultiClick(e);
                }
            });

            listen(window, 'pointercancel', e => {
                if (e.pointerType === 'mouse') return;
                if (e.pointerId !== this._activePointerId) return;

                this.buttons = {};
                this.buttonDownTime = {};
                this.dragging = false;
                this.possibleDrag = false;
                this.dragButton = -1;
                this.possibleDragButton = -1;
                this.dragSpeed = 0;
                this.dragDirection = 0;
                this.inside = false;
                this.dragSelectedSprites = [];
                this._resetClickState();

                if (this.dragSelectElement) this.dragSelectElement.style.display = 'none';
                if (this.tooltipElement) this.tooltipElement.style.display = 'none';
                if (this.touchTooltipTimer) {
                    clearTimeout(this.touchTooltipTimer);
                    this.touchTooltipTimer = null;
                }

                try {
                    if (canvas.releasePointerCapture) canvas.releasePointerCapture(e.pointerId);
                } catch (err) { /* ignore */ }

                this._activePointerId = null;
            });

            listen(window, 'blur', () => {
                this.buttons = {};
                this.buttonDownTime = {};
                this.dragging = false;
                this.possibleDrag = false;
                this.dragButton = -1;
                this.possibleDragButton = -1;
                this.dragSpeed = 0;
                this.dragDirection = 0;
                this._activePointerId = null;

                if (this.dragSelectElement) {
                    this.dragSelectElement.style.display = 'none';
                }
                if (this.tooltipElement) {
                    this.tooltipElement.style.display = 'none';
                }
                if (this.touchTooltipTimer) {
                    clearTimeout(this.touchTooltipTimer);
                    this.touchTooltipTimer = null;
                }

                this._resetClickState();
            });

            listen(canvas, 'wheel', e => {
                this.wheelX += e.deltaX;
                this.wheelY += e.deltaY;
                this.wheelZ += e.deltaZ;
            });

            listen(canvas, 'contextmenu', e => {
                if (this.preventContextMenu) {
                    e.preventDefault();
                }
            });

            listen(document, 'pointerlockchange', () => {
                if (document.pointerLockElement !== canvas) {
                    this.movementX = 0;
                    this.movementY = 0;
                }
            });

            // 点击空白处关闭选择框
            listen(document, 'pointerdown', e => {
                if (!this.contextMenuVisible) return;
                if (!this.contextMenuElement) return;

                const target = e.target;
                if (target && this._isContextMenuTarget(target)) return;

                this.hideContextMenu();
            }, { capture: true });

            listen(window, 'beforeunload', () => this.dispose());
        }

        _resetClickState() {
            this.doubleClicked = false;
            this.lastClickTime = 0;
            this.lastClickButton = -1;
            this.lastClickClientX = 0;
            this.lastClickClientY = 0;

            if (this.doubleClickTimer) {
                clearTimeout(this.doubleClickTimer);
                this.doubleClickTimer = null;
            }

            for (const button in this.multiClickTimer) {
                if (this.multiClickTimer[button]) {
                    clearTimeout(this.multiClickTimer[button]);
                }
            }

            this.multiClickCount = {};
            this.multiClickLastTime = {};
            this.multiClickLastClientX = {};
            this.multiClickLastClientY = {};
            this.multiClicked = {};
            this.multiClickTimer = {};
        }

        dispose() {
            if (this._disposed) return;
            this._disposed = true;
            this._abortController.abort();
            this._resetClickState();
            if (this.touchTooltipTimer) {
                clearTimeout(this.touchTooltipTimer);
                this.touchTooltipTimer = null;
            }
            this._clearContextSubmenus();
            if (this._activePointerId !== null && canvas.releasePointerCapture) {
                try {
                    canvas.releasePointerCapture(this._activePointerId);
                } catch (err) {
                    // Pointer capture may already have been released by the browser.
                }
            }
            this._activePointerId = null;
            this.buttons = {};
            this.buttonDownTime = {};
            if (runtime[INSTANCE_KEY] === this) {
                delete runtime[INSTANCE_KEY];
            }

            if (this.tooltipElement) this.tooltipElement.remove();
            if (this.contextMenuElement) this.contextMenuElement.remove();
            if (this.dragSelectElement) this.dragSelectElement.remove();

            for (const [property, value] of Object.entries(this._originalCanvasStyles)) {
                canvas.style[property] = value;
            }

            if (this._originalCanvasTitle === null) {
                canvas.removeAttribute('title');
            } else {
                canvas.setAttribute('title', this._originalCanvasTitle);
            }
        }

        _updateScratchMousePosition(clientX, clientY) {
            const pos = this._clientToScratch(clientX, clientY);
            this.mouseX = pos.x;
            this.mouseY = pos.y;
        }

        _clientToScratch(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();

            return {
                x: ((clientX - rect.left) / rect.width) * 480 - 240,
                y: 180 - ((clientY - rect.top) / rect.height) * 360
            };
        }

        _handleCustomDoubleClick(e) {
            const now = Date.now();
            const sameButton = e.button === this.lastClickButton;
            const timeOK = now - this.lastClickTime <= this.doubleClickMaxInterval;
            const dx = e.clientX - this.lastClickClientX;
            const dy = e.clientY - this.lastClickClientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveOK = distance <= this.doubleClickMaxMove;

            if (sameButton && timeOK && moveOK) {
                this._updateScratchMousePosition(e.clientX, e.clientY);

                this.lastDoubleClickButton = e.button;
                this.lastDoubleClickX = this.mouseX;
                this.lastDoubleClickY = this.mouseY;

                this.doubleClicked = true;

                if (this.doubleClickTimer) clearTimeout(this.doubleClickTimer);

                this.doubleClickTimer = setTimeout(() => {
                    this.doubleClicked = false;
                    this.doubleClickTimer = null;
                }, 200);

                this.lastClickTime = 0;
                this.lastClickButton = -1;
                this.lastClickClientX = 0;
                this.lastClickClientY = 0;
            } else {
                this.lastClickTime = now;
                this.lastClickButton = e.button;
                this.lastClickClientX = e.clientX;
                this.lastClickClientY = e.clientY;
            }
        }

        _handleMultiClick(e) {
            const button = e.button;
            const required = this.multiClickRequired[button] || 2;
            const now = Date.now();

            const lastTime = this.multiClickLastTime[button] || 0;
            const lastX = this.multiClickLastClientX[button] || 0;
            const lastY = this.multiClickLastClientY[button] || 0;

            const timeOK = now - lastTime <= this.doubleClickMaxInterval;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveOK = distance <= this.doubleClickMaxMove;

            if (timeOK && moveOK) {
                this.multiClickCount[button] = (this.multiClickCount[button] || 0) + 1;
            } else {
                this.multiClickCount[button] = 1;
            }

            this.multiClickLastTime[button] = now;
            this.multiClickLastClientX[button] = e.clientX;
            this.multiClickLastClientY[button] = e.clientY;

            if (this.multiClickCount[button] >= required) {
                this.multiClicked[button] = true;
                this.multiClickCount[button] = 0;

                if (this.multiClickTimer[button]) {
                    clearTimeout(this.multiClickTimer[button]);
                }

                this.multiClickTimer[button] = setTimeout(() => {
                    this.multiClicked[button] = false;
                    this.multiClickTimer[button] = null;
                }, 200);
            }
        }

        _buttonNameToNumber(name) {
            name = String(name).toLowerCase();

            if (name === 'left' || name === '左键') return 0;
            if (name === 'middle' || name === '中键') return 1;
            if (name === 'right' || name === '右键') return 2;
            if (name === 'back' || name === '后退键') return 3;
            if (name === 'forward' || name === '前进键') return 4;

            const number = Number(name);
            if (!Number.isNaN(number)) return number;

            return 0;
        }

        _buttonNumberToName(button) {
            button = Number(button);

            if (button === 0) return '左键';
            if (button === 1) return '中键';
            if (button === 2) return '右键';
            if (button === 3) return '后退键';
            if (button === 4) return '前进键';

            return String(button);
        }

        _getHoldSeconds(button) {
            if (!this.buttons[button]) return 0;
            if (!this.buttonDownTime[button]) return 0;
            return (Date.now() - this.buttonDownTime[button]) / 1000;
        }

        _toOnOffBoolean(state) {
            state = String(state);
            return (
                state === '开启' ||
                state.toLowerCase() === 'on' ||
                state.toLowerCase() === 'true' ||
                state === '1'
            );
        }

        _createTooltip() {
            const tooltip = document.createElement('div');

            tooltip.style.position = 'fixed';
            tooltip.style.left = '0px';
            tooltip.style.top = '0px';
            tooltip.style.padding = '6px 10px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.background = this.tooltipBgColor;
            tooltip.style.color = this.tooltipTextColor;
            tooltip.style.fontSize = this.tooltipFontSize + 'px';
            tooltip.style.fontFamily = 'Arial, sans-serif';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '999999';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.display = 'none';
            tooltip.style.transform = 'translate(12px, 12px)';
            tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
            tooltip.style.userSelect = 'none';
            tooltip.style.webkitUserSelect = 'none';
            tooltip.style.webkitTouchCallout = 'none';

            document.body.appendChild(tooltip);
            this.tooltipElement = tooltip;
        }

        _createContextMenu() {
            const menu = document.createElement('div');
            menu.className = 'advanced-mouse-context-menu';
            menu.style.display = 'none';
            menu.style.cssText = this.contextMenuCss + '; display: none;';
            document.body.appendChild(menu);
            this.contextMenuElement = menu;
        }

        _applyContextMenuCss() {
            if (!this.contextMenuElement) return;

            const display = this.contextMenuVisible ? 'block' : 'none';
            this.contextMenuElement.style.cssText = this.contextMenuCss + '; display: ' + display + ';';
            this.contextMenuElement.style.maxHeight = 'calc(100vh - 16px)';
            this.contextMenuElement.style.maxHeight = 'calc(100dvh - 16px)';
            this.contextMenuElement.style.overflowY = 'auto';
            this.contextMenuElement.style.webkitOverflowScrolling = 'touch';
            this.contextMenuElement.style.touchAction = 'pan-y';
            this.contextMenuElement.style.webkitUserSelect = 'none';
            this.contextMenuElement.style.webkitTouchCallout = 'none';
        }

        _clearContextSubmenus() {
            for (const submenu of this.contextSubmenus) {
                submenu.remove();
            }
            this.contextSubmenus.clear();
        }

        _isContextMenuTarget(target) {
            if (this.contextMenuElement && this.contextMenuElement.contains(target)) {
                return true;
            }

            for (const submenu of this.contextSubmenus) {
                if (submenu.contains(target)) return true;
            }

            return false;
        }

        _hideContextSubmenusFromDepth(depth) {
            for (const submenu of this.contextSubmenus) {
                if (submenu._contextMenuDepth >= depth) {
                    submenu.style.display = 'none';
                }
            }
        }

        _getContextSubmenuZIndex() {
            if (!this.contextMenuElement) return '2147483647';

            const rootZIndex = Number.parseInt(
                window.getComputedStyle(this.contextMenuElement).zIndex,
                10
            );
            if (!Number.isFinite(rootZIndex)) return '2147483647';

            // The submenu is appended after the root menu, so equal z-index still paints above it.
            return String(Math.min(2147483647, rootZIndex + 1));
        }

        _buildContextMenuItem(item, depth = 0) {
            if (!item) {
                return document.createElement('div');
            }

            if (item.type === 'separator') {
                const sep = document.createElement('div');
                sep.style.height = '1px';
                sep.style.background = 'rgba(0,0,0,0.08)';
                sep.style.margin = '6px 0';
                sep.style.width = '100%';
                return sep;
            }

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '8px';
            row.style.padding = '8px 12px';
            row.style.cursor = 'pointer';
            row.style.position = 'relative';
            row.style.whiteSpace = 'nowrap';
            row.style.fontSize = '14px';
            row.style.lineHeight = '1.2';
            row.style.color = '#222';
            row.style.touchAction = 'manipulation';
            row.style.webkitUserSelect = 'none';
            row.style.webkitTouchCallout = 'none';

            row.onmouseenter = () => {
                row.style.background = 'rgba(76, 151, 255, 0.08)';
            };
            row.onmouseleave = () => {
                row.style.background = 'transparent';
            };
            row.addEventListener('pointerdown', event => {
                if (event.pointerType !== 'mouse') {
                    row.style.background = 'rgba(76, 151, 255, 0.18)';
                }
            });
            const clearPressedStyle = () => {
                row.style.background = 'transparent';
            };
            row.addEventListener('pointerup', clearPressedStyle);
            row.addEventListener('pointercancel', clearPressedStyle);

            if (item.icon) {
                const icon = document.createElement('img');
                icon.src = item.icon;
                icon.alt = '';
                icon.style.width = '16px';
                icon.style.height = '16px';
                icon.style.flexShrink = '0';
                icon.style.objectFit = 'contain';
                row.appendChild(icon);
            }

            const label = document.createElement('span');
            label.textContent = item.text || '';
            label.style.flex = '1';
            row.appendChild(label);

            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            if (hasChildren) {
                const arrow = document.createElement('span');
                arrow.textContent = '▶';
                arrow.style.fontSize = '10px';
                arrow.style.opacity = '0.7';
                arrow.style.marginLeft = '8px';
                row.appendChild(arrow);

                const submenu = document.createElement('div');
                submenu.style.position = 'fixed';
                submenu.style.left = '0px';
                submenu.style.top = '0px';
                submenu.style.display = 'none';
                submenu.style.minWidth = '180px';
                submenu.style.padding = '6px 0';
                submenu.style.background = 'rgba(255,255,255,0.97)';
                submenu.style.border = '1px solid rgba(0,0,0,0.12)';
                submenu.style.borderRadius = '6px';
                submenu.style.boxShadow = '0 8px 18px rgba(0,0,0,0.18)';
                submenu.style.zIndex = this._getContextSubmenuZIndex();
                submenu.style.maxHeight = 'calc(100vh - 16px)';
                submenu.style.maxHeight = 'calc(100dvh - 16px)';
                submenu.style.overflowY = 'auto';
                submenu.style.webkitOverflowScrolling = 'touch';
                submenu.style.touchAction = 'pan-y';
                submenu.style.webkitUserSelect = 'none';
                submenu.style.webkitTouchCallout = 'none';
                submenu._contextMenuDepth = depth + 1;

                this.contextSubmenus.add(submenu);
                document.body.appendChild(submenu);

                item.children.forEach(child => {
                    submenu.appendChild(this._buildContextMenuItem(child, depth + 1));
                });

                row.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const showing = submenu.style.display === 'block';
                    if (showing) {
                        this._hideContextSubmenusFromDepth(submenu._contextMenuDepth);
                    } else {
                        this._hideContextSubmenusFromDepth(submenu._contextMenuDepth);
                        submenu.style.display = 'block';
                        this._positionContextSubmenu(row, submenu);
                    }
                });
            } else {
                row.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.contextMenuSelected = true;
                    this.contextMenuSelectedId = item.id || item.text || '';
                    this.contextMenuSelectedText = item.text || '';
                    this.hideContextMenu();
                });
            }

            if (item.type === 'radio') {
                const mark = document.createElement('span');
                mark.textContent = item.checked ? '●' : '○';
                mark.style.fontSize = '12px';
                mark.style.minWidth = '12px';
                mark.style.textAlign = 'center';
                mark.style.opacity = '0.9';
                row.insertBefore(mark, label);

            }

            return row;
        }

        _renderContextMenu(data) {
            if (!this.contextMenuElement) return;

            this._clearContextSubmenus();
            this.contextMenuElement.innerHTML = '';

            const items = Array.isArray(data && data.items) ? data.items : [];
            const container = document.createElement('div');

            items.forEach(item => {
                container.appendChild(this._buildContextMenuItem(item));
            });

            this.contextMenuElement.appendChild(container);
        }

        _getContextMenuBounds(anchorX, anchorY, menuWidth, menuHeight) {
            const margin = 8;
            const canvasRect = canvas.getBoundingClientRect();
            const pointerInsideStage =
                anchorX >= canvasRect.left &&
                anchorX <= canvasRect.right &&
                anchorY >= canvasRect.top &&
                anchorY <= canvasRect.bottom;

            if (
                pointerInsideStage &&
                canvasRect.width >= menuWidth + margin * 2 &&
                canvasRect.height >= menuHeight + margin * 2
            ) {
                return {
                    left: canvasRect.left,
                    top: canvasRect.top,
                    right: canvasRect.right,
                    bottom: canvasRect.bottom
                };
            }

            return {
                left: 0,
                top: 0,
                right: window.innerWidth,
                bottom: window.innerHeight
            };
        }

        _positionContextSubmenu(row, submenu) {
            let bounds = this.contextMenuPlacementBounds || {
                left: 0,
                top: 0,
                right: window.innerWidth,
                bottom: window.innerHeight
            };
            const margin = 8;
            const gap = 4;
            const rowRect = row.getBoundingClientRect();
            const submenuRect = submenu.getBoundingClientRect();
            const width = submenuRect.width;
            const height = submenuRect.height;
            if (width + margin * 2 > bounds.right - bounds.left ||
                height + margin * 2 > bounds.bottom - bounds.top) {
                bounds = {
                    left: 0,
                    top: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight
                };
            }
            const roomRight = bounds.right - rowRect.right - gap - margin;
            const roomLeft = rowRect.left - bounds.left - gap - margin;
            const openRight = roomRight >= width || roomRight >= roomLeft;

            let left = openRight
                ? rowRect.right + gap
                : rowRect.left - width - gap;
            let top = rowRect.top;

            const maxLeft = Math.max(bounds.left + margin, bounds.right - width - margin);
            const maxTop = Math.max(bounds.top + margin, bounds.bottom - height - margin);
            left = Math.min(maxLeft, Math.max(bounds.left + margin, left));
            top = Math.min(maxTop, Math.max(bounds.top + margin, top));

            submenu.style.left = `${left}px`;
            submenu.style.top = `${top}px`;
        }

        _createDragSelectBox() {
            const box = document.createElement('div');

            box.style.position = 'fixed';
            box.style.left = '0px';
            box.style.top = '0px';
            box.style.width = '0px';
            box.style.height = '0px';
            box.style.border = '1px dashed #4C97FF';
            box.style.background = 'rgba(76, 151, 255, 0.18)';
            box.style.pointerEvents = 'none';
            box.style.zIndex = '999998';
            box.style.display = 'none';
            box.style.boxSizing = 'border-box';

            document.body.appendChild(box);
            this.dragSelectElement = box;
        }

        _updateDragSelectBox(clientX, clientY) {
            if (!this.dragSelectElement) return;

            const left = Math.min(this.dragSelectStartClientX, clientX);
            const top = Math.min(this.dragSelectStartClientY, clientY);
            const width = Math.abs(clientX - this.dragSelectStartClientX);
            const height = Math.abs(clientY - this.dragSelectStartClientY);

            this.dragSelectElement.style.left = left + 'px';
            this.dragSelectElement.style.top = top + 'px';
            this.dragSelectElement.style.width = width + 'px';
            this.dragSelectElement.style.height = height + 'px';

            if (this.dragSelectEnabled && this.dragSelectShowBox && width > 2 && height > 2) {
                this.dragSelectElement.style.display = 'block';
            }
        }

        _getDragSelectScratchRect() {
            const start = this._clientToScratch(this.dragSelectStartClientX, this.dragSelectStartClientY);
            const current = this._clientToScratch(this.dragSelectCurrentClientX, this.dragSelectCurrentClientY);

            return {
                left: Math.min(start.x, current.x),
                right: Math.max(start.x, current.x),
                bottom: Math.min(start.y, current.y),
                top: Math.max(start.y, current.y)
            };
        }

        _updateDragSelectedSprites() {
            const rect = this._getDragSelectScratchRect();
            const selected = [];
            const targets = runtime.targets || [];

            for (const target of targets) {
                if (!target) continue;
                if (target.isStage) continue;
                if (!target.visible) continue;
                if (typeof target.getBounds !== 'function') continue;

                const bounds = target.getBounds();
                if (!bounds) continue;

                const spriteRect = {
                    left: Math.min(bounds.left, bounds.right),
                    right: Math.max(bounds.left, bounds.right),
                    bottom: Math.min(bounds.bottom, bounds.top),
                    top: Math.max(bounds.bottom, bounds.top)
                };

                if (this._rectsIntersect(rect, spriteRect)) {
                    let name = '';

                    if (target.sprite && target.sprite.name) {
                        name = target.sprite.name;
                    } else if (typeof target.getName === 'function') {
                        name = target.getName();
                    } else if (target.name) {
                        name = target.name;
                    }

                    if (name) selected.push(name);
                }
            }

            this.dragSelectedSprites = [...new Set(selected)];
        }

        _rectsIntersect(a, b) {
            return !(
                a.right < b.left ||
                a.left > b.right ||
                a.top < b.bottom ||
                a.bottom > b.top
            );
        }

        _updateTooltipPosition(x, y) {
            if (!this.tooltipElement) return;
            this.tooltipElement.style.left = x + 'px';
            this.tooltipElement.style.top = y + 'px';
        }

        _updateTooltipStyle() {
            if (!this.tooltipElement) return;
            this.tooltipElement.style.background = this.tooltipBgColor;
            this.tooltipElement.style.color = this.tooltipTextColor;
            this.tooltipElement.style.fontSize = this.tooltipFontSize + 'px';
        }

        // ===== 新增：显示/隐藏/查询右键选择框 =====
        showContextMenu(args) {
            let data = { items: [] };

            try {
                let raw = args && args.JSON !== undefined ? args.JSON : args;
                if (typeof raw === 'string') {
                    raw = raw.trim() === '' ? { items: [] } : JSON.parse(raw);
                }

                if (Array.isArray(raw)) {
                    data = { items: raw };
                } else if (raw && Array.isArray(raw.items)) {
                    data = raw;
                } else if (raw !== undefined && raw !== null) {
                    throw new TypeError('选择框数据必须是包含 items 数组的对象或数组');
                }
            } catch (err) {
                console.warn('[高级鼠标] 选择框 JSON 无效，已显示空菜单。', err);
                data = { items: [] };
            }

            this.contextMenuSelected = false;
            this.contextMenuSelectedId = '';
            this.contextMenuSelectedText = '';

            if (!this.contextMenuElement) {
                this._createContextMenu();
            }

            this._renderContextMenu(data);

            this.contextMenuVisible = true;
            this._applyContextMenuCss();
            this.contextMenuElement.style.display = 'block';

            const margin = 8;
            const gap = 4;
            const rect = this.contextMenuElement.getBoundingClientRect();
            const anchorX = this.lastPointerDownClientX === null
                ? this.clientX
                : this.lastPointerDownClientX;
            const anchorY = this.lastPointerDownClientY === null
                ? this.clientY
                : this.lastPointerDownClientY;
            const bounds = this._getContextMenuBounds(anchorX, anchorY, rect.width, rect.height);
            this.contextMenuPlacementBounds = bounds;

            const roomRight = bounds.right - anchorX - gap - margin;
            const roomLeft = anchorX - bounds.left - gap - margin;
            const roomBelow = bounds.bottom - anchorY - gap - margin;
            const roomAbove = anchorY - bounds.top - gap - margin;
            const openRight = roomRight >= rect.width || roomRight >= roomLeft;
            const openBelow = roomBelow >= rect.height || roomBelow >= roomAbove;

            const desiredLeft = openRight
                ? anchorX + gap
                : anchorX - rect.width - gap;
            const desiredTop = openBelow
                ? anchorY + gap
                : anchorY - rect.height - gap;
            const maxLeft = Math.max(bounds.left + margin, bounds.right - rect.width - margin);
            const maxTop = Math.max(bounds.top + margin, bounds.bottom - rect.height - margin);
            const left = Math.min(maxLeft, Math.max(bounds.left + margin, desiredLeft));
            const top = Math.min(maxTop, Math.max(bounds.top + margin, desiredTop));

            this.contextMenuElement.style.left = `${left}px`;
            this.contextMenuElement.style.top = `${top}px`;
        }

        hideContextMenu() {
            this.contextMenuVisible = false;
            if (this.contextMenuElement) {
                this.contextMenuElement.style.display = 'none';
            }
            this._hideContextSubmenusFromDepth(1);
        }

        isContextMenuSelected() {
            return this.contextMenuSelected;
        }

        getSelectedContextMenuId() {
            return this.contextMenuSelectedId;
        }

        getSelectedContextMenuText() {
            return this.contextMenuSelectedText;
        }

        setContextMenuCss(args) {
            const css = String(args && args.CSS !== undefined ? args.CSS : this.contextMenuCss);
            this.contextMenuCss = css || this.contextMenuCss;
            this._applyContextMenuCss();
        }

        // ===== 原有接口 =====
        getMouseX() { return this.mouseX; }
        getMouseY() { return this.mouseY; }
        getClientX() { return this.clientX; }
        getClientY() { return this.clientY; }
        getMovementX() { return this.movementX; }
        getMovementY() { return this.movementY; }
        getWheelY() { return this.wheelY; }

        resetWheel() {
            this.wheelX = 0;
            this.wheelY = 0;
            this.wheelZ = 0;
        }

        isButtonDown(args) {
            const button = this._buttonNameToNumber(args.BUTTON);
            return !!this.buttons[button];
        }

        getLeftHoldSeconds() { return this._getHoldSeconds(0); }
        getRightHoldSeconds() { return this._getHoldSeconds(2); }

        isLeftLongPressed(args) {
            const seconds = Number(args.SECONDS);
            const target = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
            return this._getHoldSeconds(0) >= target;
        }

        isRightLongPressed(args) {
            const seconds = Number(args.SECONDS);
            const target = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
            return this._getHoldSeconds(2) >= target;
        }

        isDragging() { return this.dragging; }
        getDragButton() { return this._buttonNumberToName(this.dragButton); }
        getDragStartX() { return this.dragStartX; }
        getDragStartY() { return this.dragStartY; }
        getDragCurrentX() { return this.dragCurrentX; }
        getDragCurrentY() { return this.dragCurrentY; }
        getDragEndX() { return this.dragEndX; }
        getDragEndY() { return this.dragEndY; }
        getDragSpeed() { return this.dragSpeed; }
        getDragDirection() { return this.dragDirection; }
        getDragTotalDistance() { return this.dragTotalDistance; }

        setDragSelectEnabled(args) {
            this.dragSelectEnabled = this._toOnOffBoolean(args.STATE);

            if (!this.dragSelectEnabled) {
                this.dragSelectedSprites = [];
                if (this.dragSelectElement) {
                    this.dragSelectElement.style.display = 'none';
                }
            }
        }

        setDragSelectBoxVisible(args) {
            this.dragSelectShowBox = this._toOnOffBoolean(args.STATE);

            if (!this.dragSelectShowBox && this.dragSelectElement) {
                this.dragSelectElement.style.display = 'none';
            }
        }

        getDragSelectedSpriteCount() {
            return this.dragSelectedSprites.length;
        }

        getDragSelectedSpriteNames() {
            return this.dragSelectedSprites.join(',');
        }

        isSpriteDragSelected(args) {
            const name = String(args.NAME);
            return this.dragSelectedSprites.includes(name);
        }

        clearDragSelectedSprites() {
            this.dragSelectedSprites = [];

            if (this.dragSelectElement) {
                this.dragSelectElement.style.display = 'none';
            }
        }

        setDoubleClickMaxMove(args) {
            const pixels = Number(args.PIXELS);
            if (Number.isFinite(pixels) && pixels >= 0) {
                this.doubleClickMaxMove = pixels;
            }
        }

        getDoubleClickMaxMove() { return this.doubleClickMaxMove; }

        setDoubleClickMaxInterval(args) {
            const ms = Number(args.MS);
            if (Number.isFinite(ms) && ms >= 0) {
                this.doubleClickMaxInterval = ms;
            }
        }

        getDoubleClickMaxInterval() { return this.doubleClickMaxInterval; }
        isDoubleClick() { return this.doubleClicked; }
        getLastDoubleClickButton() { return this._buttonNumberToName(this.lastDoubleClickButton); }
        getLastDoubleClickX() { return this.lastDoubleClickX; }
        getLastDoubleClickY() { return this.lastDoubleClickY; }

        setMultiClickTimes(args) {
            const button = this._buttonNameToNumber(args.BUTTON);
            const times = Math.floor(Number(args.TIMES));

            if (Number.isFinite(times) && times >= 2) {
                this.multiClickRequired[button] = times;
            }
        }

        isMultiClick(args) {
            const button = this._buttonNameToNumber(args.BUTTON);
            return !!this.multiClicked[button];
        }

        isInsideCanvas() { return this.inside; }

        lockPointer() {
            if (canvas.requestPointerLock) {
                try {
                    const request = canvas.requestPointerLock();
                    if (request && typeof request.catch === 'function') {
                        request.catch(err => {
                            console.warn('[高级鼠标] 无法锁定鼠标指针。', err);
                        });
                    }
                } catch (err) {
                    console.warn('[高级鼠标] 无法锁定鼠标指针。', err);
                }
            }
        }

        unlockPointer() {
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
        }

        isPointerLocked() {
            return document.pointerLockElement === canvas;
        }

        hideCursor() {
            this.cursorStyle = 'none';
            canvas.style.cursor = 'none';
        }

        showCursor() {
            this.cursorStyle = 'default';
            canvas.style.cursor = 'default';
        }

        setCursor(args) {
            const cursor = String(args.CURSOR);
            this.cursorStyle = cursor;
            canvas.style.cursor = cursor;
        }

        setCustomCursor(args) {
            let url = String(args.URL).trim();

            if (url === '') {
                canvas.style.cursor = this.cursorStyle || 'default';
                return;
            }

            url = url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            canvas.style.cursor = `url("${url}") 0 0, auto`;
        }

        setPreventContextMenu(args) {
            this.preventContextMenu = this._toOnOffBoolean(args.STATE);
        }

        setMouseTooltip(args) {
            const text = String(args.TEXT);
            this.tooltipText = text;

            if (this.tooltipVisible) {
                canvas.removeAttribute('title');
            } else {
                canvas.title = text;
            }

            if (this.tooltipElement) {
                this.tooltipElement.textContent = text;

                if (this.tooltipVisible && this.inside && text !== '') {
                    this.tooltipElement.style.display = 'block';
                }
            }
        }

        getMouseTooltip() {
            return this.tooltipText;
        }

        clearMouseTooltip() {
            this.tooltipText = '';
            canvas.removeAttribute('title');

            if (this.tooltipElement) {
                this.tooltipElement.textContent = '';
                this.tooltipElement.style.display = 'none';
            }

            this.tooltipVisible = false;
        }

        showCustomTooltip() {
            this.tooltipVisible = true;
            canvas.removeAttribute('title');

            if (this.tooltipElement && this.tooltipText !== '' && this.inside) {
                this.tooltipElement.style.display = 'block';
            }
        }

        hideCustomTooltip() {
            this.tooltipVisible = false;

            if (this.tooltipText !== '') {
                canvas.title = this.tooltipText;
            } else {
                canvas.removeAttribute('title');
            }

            if (this.tooltipElement) {
                this.tooltipElement.style.display = 'none';
            }
        }

        setTooltipColor(args) {
            this.tooltipBgColor = String(args.BG);
            this.tooltipTextColor = String(args.COLOR);
            this._updateTooltipStyle();
        }

        setTooltipSize(args) {
            const size = Number(args.SIZE);

            if (Number.isFinite(size) && size > 0) {
                this.tooltipFontSize = size;
            } else {
                this.tooltipFontSize = 14;
            }

            this._updateTooltipStyle();
        }
    }

    Scratch.extensions.register(new AdvancedMouse());
})(Scratch);
