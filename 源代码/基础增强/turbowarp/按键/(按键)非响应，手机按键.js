(function(Scratch) {
    'use strict';
    
    const canvasId = 'mobile-keys-canvas-' + Math.random().toString(36).substr(2, 9);
    
    class MobileKeysExtension {
        constructor() {
            this.keys = [];
            this.canvas = null;
            this.context = null;
            this.pressedKeys = new Set();
            this.keySize = 60;
            this.keySpacing = 15;
            this.visible = false;
            this.runtime = Scratch.vm.runtime;
            this.touchPoints = new Map();
            this.devicePixelRatio = window.devicePixelRatio || 1;
            this.isInitialized = false;
            
            // 添加拖动功能相关属性
            this.dragBarHeight = 30; // 拖动条高度
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.canvasStartX = 0;
            this.canvasStartY = 0;
            this.dragTouchId = null;
            
            // 从localStorage加载位置
            this.loadPosition();
        }
        
        // 从localStorage加载位置
        loadPosition() {
            const savedPosition = localStorage.getItem('mobileKeysPosition');
            if (savedPosition) {
                try {
                    const {x, y} = JSON.parse(savedPosition);
                    this.canvasStartX = x;
                    this.canvasStartY = y;
                } catch (e) {
                    console.warn('Failed to parse saved position', e);
                }
            }
        }
        
        // 保存位置到localStorage
        savePosition() {
            const position = {
                x: this.canvasStartX,
                y: this.canvasStartY
            };
            localStorage.setItem('mobileKeysPosition', JSON.stringify(position));
        }
        
        getInfo() {
            return {
                id: 'mobilekeys',
                name: '手机按键',
                blocks: [
                    {
                        opcode: 'addKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '将[KEY]加入备选按键',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'A'
                            }
                        }
                    },
                    {
                        opcode: 'addKeyWithResponse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '将[KEY]加入备选按键实际响应[RESPONSE]按键',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'A'
                            },
                            RESPONSE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'a'
                            }
                        }
                    },
                    {
                        opcode: 'showKeys',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示按键'
                    },
                    {
                        opcode: 'hideKeys',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '隐藏按键'
                    },
                    {
                        opcode: 'getPressedKeys',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '按下什么？'
                    },
                    {
                        opcode: 'clearKeys',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清除所有按键'
                    },
                    {
                        opcode: 'setKeySize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置按键大小为[SIZE]',
                        arguments: {
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 60
                            }
                        }
                    }
                ]
            };
        }
        
        // 初始化Canvas
        initCanvas() {
            if (this.isInitialized) return;
            
            // 确保舞台容器存在
            let container = document.querySelector('.stage-wrapper');
            if (!container) {
                // 如果找不到标准容器，尝试其他可能的位置
                container = document.querySelector('.gui');
                if (!container) {
                    container = document.body;
                    console.warn('使用body作为Canvas容器');
                }
            }
            
            // 移除可能已存在的Canvas
            const oldCanvas = document.getElementById(canvasId);
            if (oldCanvas && oldCanvas.parentNode) {
                oldCanvas.parentNode.removeChild(oldCanvas);
            }
            
            // 创建Canvas元素
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            this.canvas.style.position = 'fixed';
            this.canvas.style.zIndex = '1000';
            this.canvas.style.touchAction = 'none';
            this.canvas.style.pointerEvents = 'auto';
            this.canvas.style.borderRadius = '10px';
            this.canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            this.canvas.style.border = '1px solid rgba(0,0,0,0.1)';
            
            // 设置初始位置（从localStorage加载或默认位置）
            this.canvas.style.left = this.canvasStartX + 'px';
            this.canvas.style.top = this.canvasStartY + 'px';
            
            // 添加到容器
            container.appendChild(this.canvas);
            
            this.context = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            // 添加事件监听
            this.canvas.addEventListener('touchstart', e => this.handleTouchStart(e));
            this.canvas.addEventListener('touchend', e => this.handleTouchEnd(e));
            this.canvas.addEventListener('touchmove', e => this.handleTouchMove(e));
            this.canvas.addEventListener('touchcancel', e => this.handleTouchEnd(e));
            
            this.isInitialized = true;
        }
        
        // 调整Canvas大小
        resizeCanvas() {
            if (!this.canvas) return;
            
            // 计算Canvas尺寸
            const width = window.innerWidth * 0.8;
            const height = 150 + this.dragBarHeight;
            
            this.canvas.width = width * this.devicePixelRatio;
            this.canvas.height = height * this.devicePixelRatio;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            
            this.context.scale(this.devicePixelRatio, this.devicePixelRatio);
            
            this.renderKeys();
        }
        
        // 渲染按键
        renderKeys() {
            if (!this.context || !this.visible) return;
            
            // 清除Canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制拖动条
            this.context.fillStyle = '#4A5568';
            this.context.fillRect(0, 0, this.canvas.width / this.devicePixelRatio, this.dragBarHeight);
            
            // 绘制拖动提示
            this.context.fillStyle = 'white';
            this.context.font = '14px Arial';
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillText('拖动此处移动键盘', 
                (this.canvas.width / this.devicePixelRatio) / 2, 
                this.dragBarHeight / 2);
            
            // 如果没有按键，则不渲染
            if (this.keys.length === 0) return;
            
            // 计算按键区域的起始X坐标
            const startX = (this.canvas.width / this.devicePixelRatio - (this.keys.length * this.keySize + 
                         (this.keys.length - 1) * this.keySpacing)) / 2;
            
            // 渲染每个按键
            this.keys.forEach((key, index) => {
                const x = startX + index * (this.keySize + this.keySpacing);
                const y = this.dragBarHeight + 20;
                
                // 绘制按键背景
                const gradient = this.context.createRadialGradient(
                    x + this.keySize/2, y + this.keySize/2, 0,
                    x + this.keySize/2, y + this.keySize/2, this.keySize/2
                );
                
                if (this.pressedKeys.has(key.id)) {
                    gradient.addColorStop(0, '#4CAF50');
                    gradient.addColorStop(1, '#2E7D32');
                } else {
                    gradient.addColorStop(0, '#2196F3');
                    gradient.addColorStop(1, '#0D47A1');
                }
                
                this.context.fillStyle = gradient;
                this.context.beginPath();
                this.context.arc(x + this.keySize/2, y + this.keySize/2, this.keySize/2, 0, Math.PI * 2);
                this.context.fill();
                
                // 绘制按键边框
                this.context.strokeStyle = '#FFFFFF';
                this.context.lineWidth = 2;
                this.context.stroke();
                
                // 绘制按键文字
                this.context.fillStyle = 'white';
                this.context.font = 'bold 24px Arial';
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.fillText(key.label, x + this.keySize/2, y + this.keySize/2);
            });
        }
        
        // 处理触摸开始
        handleTouchStart(e) {
            if (!this.visible) return;
            
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            
            for (const touch of e.changedTouches) {
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // 检查是否在拖动条上
                if (y < this.dragBarHeight) {
                    this.isDragging = true;
                    this.dragStartX = touch.clientX;
                    this.dragStartY = touch.clientY;
                    this.canvasStartX = parseInt(this.canvas.style.left) || 0;
                    this.canvasStartY = parseInt(this.canvas.style.top) || 0;
                    this.dragTouchId = touch.identifier;
                    return;
                }
                
                // 处理按键触摸
                const key = this.getKeyAtPosition(x, y);
                if (key) {
                    this.pressedKeys.add(key.id);
                    this.touchPoints.set(touch.identifier, key.id);
                    
                    // 触发实际按键响应
                    if (key.responseKey) {
                        this.runtime.postIOData('keyboard', {
                            keyCode: key.responseKey.charCodeAt(0),
                            key: key.responseKey,
                            isDown: true
                        });
                    }
                    
                    this.renderKeys();
                }
            }
        }
        
        // 处理触摸结束
        handleTouchEnd(e) {
            if (!this.visible) return;
            
            e.preventDefault();
            
            for (const touch of e.changedTouches) {
                // 处理拖动结束
                if (this.isDragging && touch.identifier === this.dragTouchId) {
                    this.isDragging = false;
                    this.dragTouchId = null;
                    this.savePosition(); // 保存位置
                    return;
                }
                
                // 处理按键触摸结束
                const keyId = this.touchPoints.get(touch.identifier);
                if (keyId) {
                    this.pressedKeys.delete(keyId);
                    this.touchPoints.delete(touch.identifier);
                    
                    const key = this.keys.find(k => k.id === keyId);
                    if (key && key.responseKey) {
                        this.runtime.postIOData('keyboard', {
                            keyCode: key.responseKey.charCodeAt(0),
                            key: key.responseKey,
                            isDown: false
                        });
                    }
                }
            }
            
            this.renderKeys();
        }
        
        // 处理触摸移动
        handleTouchMove(e) {
            if (!this.visible) return;
            
            e.preventDefault();
            
            // 处理拖动
            if (this.isDragging) {
                for (const touch of e.changedTouches) {
                    if (touch.identifier === this.dragTouchId) {
                        const dx = touch.clientX - this.dragStartX;
                        const dy = touch.clientY - this.dragStartY;
                        
                        const newX = this.canvasStartX + dx;
                        const newY = this.canvasStartY + dy;
                        
                        // 完全移除位置限制，允许移出窗口
                        this.canvas.style.left = newX + 'px';
                        this.canvas.style.top = newY + 'px';
                        
                        return;
                    }
                }
            }
            
            // 处理按键触摸移动
            const rect = this.canvas.getBoundingClientRect();
            const newPressedKeys = new Set();
            
            for (const touch of e.touches) {
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                const key = this.getKeyAtPosition(x, y);
                if (key) {
                    newPressedKeys.add(key.id);
                    
                    // 如果这个触摸点之前按下了其他键，需要更新
                    const oldKeyId = this.touchPoints.get(touch.identifier);
                    if (oldKeyId && oldKeyId !== key.id) {
                        this.pressedKeys.delete(oldKeyId);
                        
                        const oldKey = this.keys.find(k => k.id === oldKeyId);
                        if (oldKey && oldKey.responseKey) {
                            this.runtime.postIOData('keyboard', {
                                keyCode: oldKey.responseKey.charCodeAt(0),
                                key: oldKey.responseKey,
                                isDown: false
                            });
                        }
                        
                        if (key.responseKey) {
                            this.runtime.postIOData('keyboard', {
                                keyCode: key.responseKey.charCodeAt(0),
                                key: key.responseKey,
                                isDown: true
                            });
                        }
                    }
                    
                    this.touchPoints.set(touch.identifier, key.id);
                }
            }
            
            // 检查哪些按键需要释放
            const toRelease = Array.from(this.pressedKeys).filter(id => !newPressedKeys.has(id));
            toRelease.forEach(id => {
                const key = this.keys.find(k => k.id === id);
                if (key && key.responseKey) {
                    this.runtime.postIOData('keyboard', {
                        keyCode: key.responseKey.charCodeAt(0),
                        key: key.responseKey,
                        isDown: false
                    });
                }
            });
            
            this.pressedKeys = newPressedKeys;
            this.renderKeys();
        }
        
        // 获取指定位置的按键
        getKeyAtPosition(x, y) {
            if (!this.canvas) return null;
            
            // 忽略拖动条区域
            if (y < this.dragBarHeight) return null;
            
            const startX = (this.canvas.width / this.devicePixelRatio - (this.keys.length * this.keySize + 
                         (this.keys.length - 1) * this.keySpacing)) / 2;
            
            for (let i = 0; i < this.keys.length; i++) {
                const keyX = startX + i * (this.keySize + this.keySpacing);
                const keyY = this.dragBarHeight + 20;
                
                const distance = Math.sqrt(
                    Math.pow(x - (keyX + this.keySize/2), 2) + 
                    Math.pow(y - (keyY + this.keySize/2), 2)
                );
                
                if (distance <= this.keySize/2) {
                    return this.keys[i];
                }
            }
            
            return null;
        }
        
        addKey(args) {
            const keyLabel = args.KEY;
            const keyId = `key-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            
            this.keys.push({
                id: keyId,
                label: keyLabel,
                responseKey: null
            });
            
            if (this.visible) {
                this.renderKeys();
            }
        }
        
        addKeyWithResponse(args) {
            const keyLabel = args.KEY;
            const responseKey = args.RESPONSE;
            const keyId = `key-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            
            this.keys.push({
                id: keyId,
                label: keyLabel,
                responseKey: responseKey
            });
            
            if (this.visible) {
                this.renderKeys();
            }
        }
        
        showKeys() {
            this.visible = true;
            this.initCanvas();
            if (this.canvas) {
                this.canvas.style.display = 'block';
            }
            this.renderKeys();
        }
        
        hideKeys() {
            this.visible = false;
            if (this.canvas) {
                this.canvas.style.display = 'none';
                
                // 释放所有按键
                const toRelease = Array.from(this.pressedKeys);
                toRelease.forEach(id => {
                    const key = this.keys.find(k => k.id === id);
                    if (key && key.responseKey) {
                        this.runtime.postIOData('keyboard', {
                            keyCode: key.responseKey.charCodeAt(0),
                            key: key.responseKey,
                            isDown: false
                        });
                    }
                });
                this.pressedKeys.clear();
                this.touchPoints.clear();
            }
        }
        
        clearKeys() {
            this.keys = [];
            this.pressedKeys.clear();
            this.touchPoints.clear();
            
            if (this.visible) {
                this.renderKeys();
            }
        }
        
        setKeySize(args) {
            const size = Math.max(30, Math.min(100, args.SIZE));
            this.keySize = size;
            
            if (this.visible) {
                this.renderKeys();
            }
        }
        
        getPressedKeys() {
            const pressedLabels = [];
            
            this.pressedKeys.forEach(id => {
                const key = this.keys.find(k => k.id === id);
                if (key) {
                    pressedLabels.push(key.label);
                }
            });
            
            return pressedLabels.join(',');
        }
    }
    
    // 注册扩展
    if (typeof Scratch !== 'undefined' && Scratch.extensions) {
        Scratch.extensions.register(new MobileKeysExtension());
    }
})(Scratch);