(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('高级鼠标扩展必须在 unsandboxed 模式下运行');
    }

    const EXT_ID = 'advancedMouse';
    const runtime = Scratch.vm.runtime;
    const canvas = runtime.renderer.canvas;

    class AdvancedMouse {
        constructor() {
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

            // 触摸相关
            this.touchActive = false;
            this.touchIdentifier = null;
            this.touchStartClientX = 0;
            this.touchStartClientY = 0;
            this.touchLastClientX = 0;
            this.touchLastClientY = 0;
            this.touchMovementX = 0;
            this.touchMovementY = 0;

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

            // 拖拽速度 / 方向 / 总距离
            this.dragSpeed = 0;
            this.dragDirection = 0;
            this.dragTotalDistance = 0;
            this.dragLastClientX = 0;
            this.dragLastClientY = 0;
            this.dragLastTime = 0;

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

            this._createTooltip();
            this._createDragSelectBox();
            this._bindEvents();
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
                    { opcode: 'getDragSpeed', blockType: Scratch.BlockType.REPORTER, text: '拖拽速度 像素/秒' },
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
                    { opcode: 'getLastDoubleClickButton', blockType: Scratch.BlockType.REPORTER, text: '最近双击按键' },
                    { opcode: 'getLastDoubleClickX', blockType: Scratch.BlockType.REPORTER, text: '最近双击 X' },
                    { opcode: 'getLastDoubleClickY', blockType: Scratch.BlockType.REPORTER, text: '最近双击 Y' },

                    {
                        opcode: 'setMultiClickTimes',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置连击 [BUTTON] [TIMES] 次',
                        arguments: {
                            BUTTON: { type: Scratch.ArgumentType.STRING, menu: 'buttonMenu', defaultValue: 'left' },
                            TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
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
            // 鼠标事件
            canvas.addEventListener('mousemove', e => {
                this.clientX = e.clientX;
                this.clientY = e.clientY;
                this.movementX = e.movementX || 0;
                this.movementY = e.movementY || 0;

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
                    const dx = e.clientX - this.dragLastClientX;
                    const dy = e.clientY - this.dragLastClientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const dt = now - this.dragLastTime;

                    if (dt > 0) {
                        this.dragSpeed = distance / dt * 1000;
                    }

                    if (distance > 0) {
                        let angle = Math.atan2(-dy, dx) * 180 / Math.PI;
                        if (angle < 0) angle += 360;
                        this.dragDirection = angle;
                    }

                    if (this.dragging) {
                        this.dragTotalDistance += distance;
                    }

                    this.dragLastClientX = e.clientX;
                    this.dragLastClientY = e.clientY;
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

            canvas.addEventListener('mouseenter', () => {
                this.inside = true;
                if (this.tooltipVisible && this.tooltipElement && this.tooltipText !== '') {
                    this.tooltipElement.style.display = 'block';
                }
            });

            canvas.addEventListener('mouseleave', () => {
                this.inside = false;
                if (this.tooltipElement) this.tooltipElement.style.display = 'none';
                if (this.dragSelectElement) this.dragSelectElement.style.display = 'none';
            });

            canvas.addEventListener('mousedown', e => {
                this._updateScratchMousePosition(e.clientX, e.clientY);

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
                this.dragLastTime = Date.now();

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

            window.addEventListener('mousedown', e => {
                this.buttons[e.button] = true;
                if (!this.buttonDownTime[e.button]) {
                    this.buttonDownTime[e.button] = Date.now();
                }
            });

            window.addEventListener('mouseup', e => {
                this.buttons[e.button] = false;
                delete this.buttonDownTime[e.button];

                this._updateScratchMousePosition(e.clientX, e.clientY);

                let endedDrag = false;

                if (this.dragging && e.button === this.dragButton) {
                    this.dragging = false;
                    this.possibleDrag = false;
                    endedDrag = true;

                    this.dragEndX = this.mouseX;
                    this.dragEndY = this.mouseY;
                }

                if (e.button === this.possibleDragButton) {
                    this.possibleDrag = false;
                    this.possibleDragButton = -1;
                }

                if (this.dragSelectEnabled && e.target === canvas) {
                    this.dragSelectCurrentClientX = e.clientX;
                    this.dragSelectCurrentClientY = e.clientY;
                    this._updateDragSelectedSprites();

                    if (this.dragSelectElement) {
                        this.dragSelectElement.style.display = 'none';
                    }
                }

                if (!endedDrag && e.target === canvas) {
                    this._handleCustomDoubleClick(e);
                    this._handleMultiClick(e);
                }
            });

            window.addEventListener('blur', () => {
                this.buttons = {};
                this.buttonDownTime = {};
                this.dragging = false;
                this.possibleDrag = false;
                this.dragButton = -1;
                this.possibleDragButton = -1;
                this.dragSpeed = 0;
                this.dragDirection = 0;
                this.touchActive = false;
                this.touchIdentifier = null;

                if (this.dragSelectElement) {
                    this.dragSelectElement.style.display = 'none';
                }

                this.doubleClicked = false;
                if (this.doubleClickTimer) {
                    clearTimeout(this.doubleClickTimer);
                    this.doubleClickTimer = null;
                }

                this.multiClickCount = {};
                this.multiClickLastTime = {};
                this.multiClickLastClientX = {};
                this.multiClickLastClientY = {};
                this.multiClicked = {};

                for (const button in this.multiClickTimer) {
                    if (this.multiClickTimer[button]) {
                        clearTimeout(this.multiClickTimer[button]);
                    }
                }

                this.multiClickTimer = {};
            });

            canvas.addEventListener('wheel', e => {
                this.wheelX += e.deltaX;
                this.wheelY += e.deltaY;
                this.wheelZ += e.deltaZ;

                if (this.preventContextMenu) {
                    e.preventDefault();
                }
            }, { passive: false });

            canvas.addEventListener('contextmenu', e => {
                if (this.preventContextMenu) {
                    e.preventDefault();
                }
            });

            document.addEventListener('pointerlockchange', () => {
                if (document.pointerLockElement !== canvas) {
                    this.movementX = 0;
                    this.movementY = 0;
                }
            });

            // 触摸事件 - 移动端适配
            canvas.addEventListener('touchstart', e => {
                e.preventDefault();
                const touch = e.touches[0];
                if (!touch) return;

                this.touchActive = true;
                this.touchIdentifier = touch.identifier;
                this.touchStartClientX = touch.clientX;
                this.touchStartClientY = touch.clientY;
                this.touchLastClientX = touch.clientX;
                this.touchLastClientY = touch.clientY;
                this.touchMovementX = 0;
                this.touchMovementY = 0;

                this.clientX = touch.clientX;
                this.clientY = touch.clientY;
                this.movementX = 0;
                this.movementY = 0;

                this._updateScratchMousePosition(touch.clientX, touch.clientY);
                this._updateTooltipPosition(touch.clientX, touch.clientY);

                // 触摸视为左键按下
                this.possibleDrag = true;
                this.possibleDragButton = 0;

                this.dragStartClientX = touch.clientX;
                this.dragStartClientY = touch.clientY;
                this.dragStartX = this.mouseX;
                this.dragStartY = this.mouseY;
                this.dragCurrentX = this.mouseX;
                this.dragCurrentY = this.mouseY;
                this.dragEndX = this.mouseX;
                this.dragEndY = this.mouseY;
                this.dragSpeed = 0;
                this.dragDirection = 0;
                this.dragTotalDistance = 0;
                this.dragLastClientX = touch.clientX;
                this.dragLastClientY = touch.clientY;
                this.dragLastTime = Date.now();

                this.buttons[0] = true;
                if (!this.buttonDownTime[0]) {
                    this.buttonDownTime[0] = Date.now();
                }

                if (this.dragSelectEnabled) {
                    this.dragSelectedSprites = [];
                    this.dragSelectStartClientX = touch.clientX;
                    this.dragSelectStartClientY = touch.clientY;
                    this.dragSelectCurrentClientX = touch.clientX;
                    this.dragSelectCurrentClientY = touch.clientY;
                    this._updateDragSelectBox(touch.clientX, touch.clientY);

                    if (this.dragSelectElement && this.dragSelectShowBox) {
                        this.dragSelectElement.style.display = 'block';
                    }
                }
            });

            canvas.addEventListener('touchmove', e => {
                e.preventDefault();

                let touch = null;
                if (this.touchIdentifier !== null) {
                    for (let i = 0; i < e.touches.length; i++) {
                        if (e.touches[i].identifier === this.touchIdentifier) {
                            touch = e.touches[i];
                            break;
                        }
                    }
                }
                if (!touch && e.touches.length > 0) {
                    touch = e.touches[0];
                    this.touchIdentifier = touch.identifier;
                }
                if (!touch) return;

                const dx = touch.clientX - this.touchLastClientX;
                const dy = touch.clientY - this.touchLastClientY;
                this.touchMovementX = dx;
                this.touchMovementY = dy;
                this.movementX = dx;
                this.movementY = dy;

                this.clientX = touch.clientX;
                this.clientY = touch.clientY;

                this._updateScratchMousePosition(touch.clientX, touch.clientY);
                this._updateTooltipPosition(touch.clientX, touch.clientY);

                this.dragCurrentX = this.mouseX;
                this.dragCurrentY = this.mouseY;

                if (this.dragSelectEnabled && (this.possibleDrag || this.dragging)) {
                    this.dragSelectCurrentClientX = touch.clientX;
                    this.dragSelectCurrentClientY = touch.clientY;
                    this._updateDragSelectBox(touch.clientX, touch.clientY);
                    this._updateDragSelectedSprites();
                }

                if (this.possibleDrag || this.dragging) {
                    const now = Date.now();
                    const distanceDx = touch.clientX - this.dragLastClientX;
                    const distanceDy = touch.clientY - this.dragLastClientY;
                    const distance = Math.sqrt(distanceDx * distanceDx + distanceDy * distanceDy);
                    const dt = now - this.dragLastTime;

                    if (dt > 0) {
                        this.dragSpeed = distance / dt * 1000;
                    }

                    if (distance > 0) {
                        let angle = Math.atan2(-distanceDy, distanceDx) * 180 / Math.PI;
                        if (angle < 0) angle += 360;
                        this.dragDirection = angle;
                    }

                    if (this.dragging) {
                        this.dragTotalDistance += distance;
                    }

                    this.dragLastClientX = touch.clientX;
                    this.dragLastClientY = touch.clientY;
                    this.dragLastTime = now;
                }

                if (this.possibleDrag && !this.dragging) {
                    const distanceX = touch.clientX - this.dragStartClientX;
                    const distanceY = touch.clientY - this.dragStartClientY;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                    if (distance >= this.dragThreshold) {
                        this.dragging = true;
                        this.dragButton = this.possibleDragButton;
                    }
                }

                this.touchLastClientX = touch.clientX;
                this.touchLastClientY = touch.clientY;
            });

            canvas.addEventListener('touchend', e => {
                e.preventDefault();

                let endClientX = this.touchLastClientX;
                let endClientY = this.touchLastClientY;

                if (e.changedTouches.length > 0) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === this.touchIdentifier) {
                            endClientX = e.changedTouches[i].clientX;
                            endClientY = e.changedTouches[i].clientY;
                            break;
                        }
                    }
                }

                this._updateScratchMousePosition(endClientX, endClientY);

                let endedDrag = false;

                if (this.dragging) {
                    this.dragging = false;
                    this.possibleDrag = false;
                    endedDrag = true;
                    this.dragEndX = this.mouseX;
                    this.dragEndY = this.mouseY;
                }

                this.possibleDrag = false;
                this.possibleDragButton = -1;

                if (this.dragSelectEnabled) {
                    this.dragSelectCurrentClientX = endClientX;
                    this.dragSelectCurrentClientY = endClientY;
                    this._updateDragSelectedSprites();

                    if (this.dragSelectElement) {
                        this.dragSelectElement.style.display = 'none';
                    }
                }

                if (!endedDrag) {
                    // 模拟点击事件用于双击/连击检测
                    const mockEvent = {
                        button: 0,
                        clientX: endClientX,
                        clientY: endClientY,
                        target: canvas
                    };
                    this._handleCustomDoubleClick(mockEvent);
                    this._handleMultiClick(mockEvent);
                }

                this.buttons[0] = false;
                delete this.buttonDownTime[0];

                this.touchActive = false;
                this.touchIdentifier = null;
                this.touchMovementX = 0;
                this.touchMovementY = 0;
            });

            canvas.addEventListener('touchcancel', e => {
                e.preventDefault();

                this.dragging = false;
                this.possibleDrag = false;
                this.possibleDragButton = -1;
                this.touchActive = false;
                this.touchIdentifier = null;
                this.touchMovementX = 0;
                this.touchMovementY = 0;
                this.buttons[0] = false;
                delete this.buttonDownTime[0];

                if (this.dragSelectElement) {
                    this.dragSelectElement.style.display = 'none';
                }
            });
        }

        _updateScratchMousePosition(clientX, clientY) {
            const pos = this._clientToScratch(clientX, clientY);
            this.mouseX = pos.x;
            this.mouseY = pos.y;
        }

        _clientToScratch(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) {
                return { x: 0, y: 0 };
            }

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

            document.body.appendChild(tooltip);
            this.tooltipElement = tooltip;
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
                canvas.requestPointerLock();
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

            url = url.replace(/"/g, '\\"');
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
