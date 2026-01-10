(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must run in unsandboxed mode');
    }

    class BugWarningExtension {
        constructor() {
            // 创建用于显示元素的容器
            this.container = document.createElement('div');
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.pointerEvents = 'none';
            this.container.style.zIndex = '1000';
            this.container.style.display = 'none';
            document.body.appendChild(this.container);
            
            // 存储当前显示的元素和动画计时器
            this.currentElements = [];
            this.animationTimers = [];
            
            // 添加闪烁动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes flicker {
                    0% { opacity: 0.7; transform: scale(1); }
                    30% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: 0.8; transform: scale(1); }
                }
                @keyframes suddenPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        getInfo() {
            return {
                id: 'bugWarning',
                name: '恐怖BUG警告',
                color1: '#ff3333',
                color2: '#cc0000',
                blocks: [
                    {
                        opcode: 'showAllAtOnce',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '瞬间显示 [COUNT] 个随机警告和BUG',
                        arguments: {
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                                menu: null
                            }
                        }
                    },
                    {
                        opcode: 'showOneByOne',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '逐个显示 [COUNT] 个警告和BUG，最小间隔 [MIN_DELAY] 最大间隔 [MAX_DELAY] 毫秒',
                        arguments: {
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                                menu: null
                            },
                            MIN_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                                menu: null
                            },
                            MAX_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 500,
                                menu: null
                            }
                        }
                    },
                    {
                        opcode: 'addOneByOne',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '逐个增加 [COUNT] 个警告和BUG，最小间隔 [MIN_DELAY] 最大间隔 [MAX_DELAY] 毫秒',
                        arguments: {
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                                menu: null
                            },
                            MIN_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                                menu: null
                            },
                            MAX_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 500,
                                menu: null
                            }
                        }
                    },
                    {
                        opcode: 'hideAllInstantly',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '瞬间隐藏所有警告和BUG'
                    },
                    {
                        opcode: 'hideOneByOne',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '逐个隐藏警告和BUG，最小间隔 [MIN_DELAY] 最大间隔 [MAX_DELAY] 毫秒',
                        arguments: {
                            MIN_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                                menu: null
                            },
                            MAX_DELAY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 500,
                                menu: null
                            }
                        }
                    }
                ]
            };
        }

        // 清除所有动画计时器
        clearTimers() {
            this.animationTimers.forEach(timer => clearTimeout(timer));
            this.animationTimers = [];
        }

        // 创建单个警告元素
        createWarningElement() {
            // 随机选择显示⚠还是BUG！
            const isWarning = Math.random() > 0.5;
            const content = isWarning ? '⚠' : 'BUG！';
            
            // 创建元素
            const element = document.createElement('div');
            element.textContent = content;
            
            // 随机样式
            const size = 30 + Math.random() * 100; // 尺寸：30-130px
            const rotation = Math.random() * 360; // 0-360度
            // 只使用红色和黄色两种颜色
            const isRed = Math.random() > 0.5;
            const color = isRed ? 
                `rgb(255, ${50 + Math.random() * 50}, ${50 + Math.random() * 50})` : // 深红色系
                `rgb(255, ${200 + Math.random() * 55}, ${50 + Math.random() * 50})`; // 深黄/橙色系
            
            // 随机位置（确保在屏幕内）
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // 应用基础样式
            element.style.position = 'absolute';
            element.style.left = `${left}%`;
            element.style.top = `${top}%`;
            element.style.fontSize = `${size}px`;
            element.style.transform = `rotate(${rotation}deg) scale(0)`; // 初始缩放为0
            element.style.opacity = '0';
            element.style.color = color;
            element.style.fontWeight = 'bold';
            element.style.textShadow = '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,0,0,0.6)';
            element.style.animation = `flicker ${1 + Math.random() * 2}s infinite alternate`;
            
            // 随机动画持续时间（增加不可预测性）
            const animationDuration = 0.2 + Math.random() * 0.5;
            element.style.transition = `all ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
            
            return { element, rotation };
        }

        // 显示元素的动画
        animateElementIn(element, rotation) {
            // 随机延迟后显示，增加突然性
            const randomDelay = Math.random() * 100;
            
            return new Promise(resolve => {
                const timer = setTimeout(() => {
                    element.style.transform = `rotate(${rotation}deg) scale(1.3)`;
                    element.style.opacity = '0.95';
                    
                    // 稍微缩小一点，创造"弹出"效果
                    setTimeout(() => {
                        element.style.transform = `rotate(${rotation}deg) scale(1)`;
                        resolve();
                    }, 150);
                }, randomDelay);
                
                this.animationTimers.push(timer);
            });
        }

        // 隐藏元素的动画
        animateElementOut(element) {
            return new Promise(resolve => {
                // 获取当前旋转角度
                const rotation = parseFloat(element.style.transform.match(/-?\d+\.?\d*/)[0]) || 0;
                
                // 随机选择消失动画类型
                if (Math.random() > 0.5) {
                    // 缩小消失
                    element.style.transform = `rotate(${rotation}deg) scale(0)`;
                    element.style.opacity = '0';
                } else {
                    // 快速闪烁后消失
                    element.style.animation = 'none';
                    element.style.transform = `rotate(${rotation}deg) scale(1.5)`;
                    element.style.opacity = '0';
                }
                
                // 等待动画完成
                const timer = setTimeout(resolve, 300);
                this.animationTimers.push(timer);
            });
        }

        // 瞬间显示所有元素
        showAllAtOnce(args) {
            this.clearTimers();
            this.container.innerHTML = '';
            this.currentElements = [];
            this.container.style.display = 'block';
            
            const count = Math.max(1, Math.min(100, args.COUNT));
            
            // 恐怖效果：短暂的屏幕闪烁
            document.body.style.transition = 'background-color 0.1s';
            document.body.style.backgroundColor = 'black';
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 50);
            
            // 创建所有元素
            const elements = [];
            for (let i = 0; i < count; i++) {
                const { element, rotation } = this.createWarningElement();
                this.container.appendChild(element);
                elements.push({ element, rotation });
                this.currentElements.push(element);
            }
            
            // 同时显示所有元素
            elements.forEach(({ element, rotation }) => {
                this.animateElementIn(element, rotation);
            });
        }

        // 逐个显示元素
        showOneByOne(args) {
            this.clearTimers();
            this.container.innerHTML = '';
            this.currentElements = [];
            this.container.style.display = 'block';
            
            const count = Math.max(1, Math.min(100, args.COUNT));
            const minDelay = Math.max(50, Math.min(2000, args.MIN_DELAY));
            const maxDelay = Math.max(minDelay, Math.min(3000, args.MAX_DELAY));
            
            // 恐怖效果：短暂的屏幕闪烁
            document.body.style.transition = 'background-color 0.1s';
            document.body.style.backgroundColor = 'black';
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 50);
            
            // 逐个创建并显示元素
            let cumulativeDelay = 0;
            for (let i = 0; i < count; i++) {
                const { element, rotation } = this.createWarningElement();
                this.container.appendChild(element);
                this.currentElements.push(element);
                
                // 随机延迟，在min和max之间
                const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);
                cumulativeDelay += randomDelay;
                
                const timer = setTimeout(() => {
                    this.animateElementIn(element, rotation);
                    
                    // 随机让一些元素有突然放大的脉冲效果
                    if (Math.random() > 0.7) {
                        setTimeout(() => {
                            element.style.animation = 'suddenPulse 0.3s ease-out';
                            setTimeout(() => {
                                element.style.animation = `flicker ${1 + Math.random() * 2}s infinite alternate`;
                            }, 300);
                        }, 500 + Math.random() * 2000);
                    }
                }, cumulativeDelay);
                
                this.animationTimers.push(timer);
            }
        }

        // 逐个增加元素
        addOneByOne(args) {
            this.clearTimers();
            this.container.style.display = 'block';
            
            const count = Math.max(1, Math.min(100, args.COUNT));
            const minDelay = Math.max(50, Math.min(2000, args.MIN_DELAY));
            const maxDelay = Math.max(minDelay, Math.min(3000, args.MAX_DELAY));
            
            // 逐个创建并显示新元素
            let cumulativeDelay = 0;
            for (let i = 0; i < count; i++) {
                const { element, rotation } = this.createWarningElement();
                this.container.appendChild(element);
                this.currentElements.push(element);
                
                // 随机延迟，在min和max之间
                const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);
                cumulativeDelay += randomDelay;
                
                const timer = setTimeout(() => {
                    this.animateElementIn(element, rotation);
                }, cumulativeDelay);
                
                this.animationTimers.push(timer);
            }
        }

        // 瞬间隐藏所有元素
        hideAllInstantly() {
            this.clearTimers();
            
            // 恐怖效果：突然消失并伴随闪烁
            this.container.style.transition = 'opacity 0.1s';
            this.container.style.opacity = '0';
            
            const timer = setTimeout(() => {
                this.container.innerHTML = '';
                this.currentElements = [];
                this.container.style.display = 'none';
                this.container.style.opacity = '1';
                this.container.style.transition = '';
            }, 100);
            
            this.animationTimers.push(timer);
        }

        // 逐个隐藏元素
        hideOneByOne(args) {
            this.clearTimers();
            
            if (this.currentElements.length === 0) return;
            
            const minDelay = Math.max(50, Math.min(2000, args.MIN_DELAY));
            const maxDelay = Math.max(minDelay, Math.min(3000, args.MAX_DELAY));
            
            // 随机排序元素，使隐藏顺序不可预测
            const shuffledElements = [...this.currentElements].sort(() => Math.random() - 0.5);
            
            // 逐个隐藏元素
            let cumulativeDelay = 0;
            shuffledElements.forEach((element, index) => {
                // 随机延迟，在min和max之间
                const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);
                cumulativeDelay += randomDelay;
                
                const timer = setTimeout(() => {
                    this.animateElementOut(element).then(() => {
                        // 最后一个元素消失后清理
                        if (index === shuffledElements.length - 1) {
                            setTimeout(() => {
                                this.container.innerHTML = '';
                                this.currentElements = [];
                                this.container.style.display = 'none';
                            }, 300);
                        }
                    });
                }, cumulativeDelay);
                
                this.animationTimers.push(timer);
            });
        }
    }

    Scratch.extensions.register(new BugWarningExtension());
})(Scratch);
