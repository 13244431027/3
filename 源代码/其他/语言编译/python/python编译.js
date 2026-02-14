(function (_Scratch) {
    const { ArgumentType, BlockType, extensions, runtime } = _Scratch;

    // 全局消息管理器实例
    let notificationManager = null;

    class NotificationManager {
        constructor() {
            this.container = null;
            this.notifications = [];
            this.initContainer();
        }

        initContainer() {
            // 检查容器是否已存在
            if (document.getElementById('PopupPORContainer')) {
                this.container = document.getElementById('PopupPORContainer');
                return;
            }

            // 创建容器
            this.container = document.createElement('div');
            this.container.id = 'PopupPORContainer';
            this.container.style.position = 'fixed';
            this.container.style.bottom = '20px';
            this.container.style.right = '20px';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column-reverse';
            this.container.style.alignItems = 'flex-end';
            this.container.style.gap = '10px';
            this.container.style.zIndex = '9999';
            this.container.style.pointerEvents = 'none';

            document.body.appendChild(this.container);
        }

        showNotification(options) {
            const notification = new Notification(options);
            this.notifications.push(notification);
            
            // 添加到容器底部
            this.container.appendChild(notification.element);
            
            // 显示动画
            setTimeout(() => {
                notification.show();
            }, 10);
            
            // 自动移除（如果设置了持续时间）
            if (options.duration > 0) {
                setTimeout(() => {
                    this.removeNotification(notification);
                }, options.duration * 1000);
            }
            
            return notification;
        }

        removeNotification(notification) {
            const index = this.notifications.indexOf(notification);
            if (index === -1) return;
            
            notification.hide(() => {
                if (notification.element.parentNode === this.container) {
                    this.container.removeChild(notification.element);
                }
                this.notifications.splice(index, 1);
            });
        }

        clearAll() {
            // 复制数组以避免在迭代时修改它
            const notifications = [...this.notifications];
            notifications.forEach(notification => {
                this.removeNotification(notification);
            });
        }
    }

    // 单个通知组件
    class Notification {
        constructor(options) {
            this.options = options;
            this.element = this.createElement();
        }

        createElement() {
            const element = document.createElement('div');
            element.className = 'PopupPOR-notification';
            
            // 基础样式
            this.applyBaseStyle(element);
            
            // 应用效果样式
            this.applyEffectStyle(element);
            
            // 添加内容
            this.addContent(element);
            
            // 点击关闭
            element.addEventListener('click', () => {
                this.hide();
            });
            
            return element;
        }

        applyBaseStyle(element) {
            // 基础样式设置
            element.style.minWidth = '200px';
            element.style.maxWidth = '300px';
            element.style.padding = '12px 16px';
            element.style.borderRadius = '8px';
            element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            element.style.marginBottom = '0';
            element.style.opacity = '0';
            element.style.transform = 'translateX(100px)';
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.pointerEvents = 'auto';
            element.style.cursor = 'pointer';
            element.style.overflow = 'hidden';
            
            // 自定义样式（如果有）
            if (this.options.bgColor) {
                element.style.backgroundColor = this.options.bgColor;
            }
            
            if (this.options.textColor) {
                element.style.color = this.options.textColor;
            }
        }

        applyEffectStyle(element) {
            // 如果没有自定义颜色，应用预设效果
            if (!this.options.bgColor) {
                switch(this.options.effect) {
                    case 'acrylic':
                        element.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                        element.style.backdropFilter = 'blur(10px)';
                        element.style.webkitBackdropFilter = 'blur(10px)';
                        element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                        element.style.color = this.options.textColor || '#000';
                        break;
                    case 'mica':
                        element.style.background = 'rgba(255, 255, 255, 0.5)';
                        element.style.backdropFilter = 'blur(20px) contrast(0.8) brightness(1.1)';
                        element.style.webkitBackdropFilter = 'blur(20px) contrast(0.8) brightness(1.1)';
                        element.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        element.style.color = this.options.textColor || '#000';
                        break;
                    case 'transparent':
                        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        element.style.color = this.options.textColor || '#fff';
                        element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        break;
                    case 'none':
                    default:
                        // 使用默认样式，无特殊效果
                        element.style.backgroundColor = this.options.bgColor || '#fff';
                        element.style.color = this.options.textColor || '#333';
                        element.style.border = '1px solid #e0e0e0';
                        break;
                }
            }
        }

        addContent(element) {
            // 处理消息内容
            const content = document.createElement('div');
            
            // 处理多行文本
            if (this.options.message.includes('\n') || this.options.maxLines > 1) {
                content.style.whiteSpace = 'pre-wrap';
                content.style.wordWrap = 'break-word';
                content.style.maxHeight = (this.options.maxLines * 1.4) + 'em';
                content.style.overflow = 'hidden';
                content.style.display = '-webkit-box';
                content.style.webkitLineClamp = this.options.maxLines;
                content.style.webkitBoxOrient = 'vertical';
            } else {
                content.style.whiteSpace = 'nowrap';
                content.style.overflow = 'hidden';
                content.style.textOverflow = 'ellipsis';
            }
            
            content.textContent = this.options.message;
            element.appendChild(content);
        }

        show() {
            requestAnimationFrame(() => {
                this.element.style.opacity = '1';
                this.element.style.transform = 'translateX(0)';
            });
        }

        hide(callback) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                if (callback) callback();
            }, 300);
        }
    }

    class PopupPOR {
        constructor(runtime) {
            this.runtime = runtime;
        }

        getInfo() {
            return {
                id: 'PopupPOR',
                name: '弹窗通知',
                color1: '#FF6680',
                color2: '#FF3355',
                blocks: [
                    {
                        opcode: 'show',
                        blockType: BlockType.COMMAND,
                        text: '显示弹窗 [MESSAGE]',
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: '你好!'
                            }
                        }
                    },
                    {
                        opcode: 'showWithOptions',
                        blockType: BlockType.COMMAND,
                        text: '显示弹窗 [MESSAGE] 效果 [EFFECT] 停留 [DURATION] 秒',
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: '你好!'
                            },
                            EFFECT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'none',
                                menu: 'effectMenu'
                            },
                            DURATION: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },
                    {
                        opcode: 'showAdvanced',
                        blockType: BlockType.COMMAND,
                        text: '显示高级弹窗 [MESSAGE] 效果 [EFFECT] 背景色 [BGCOLOR] 文字色 [TEXTCOLOR] 停留 [DURATION] 秒 最大行数 [MAXLINES]',
                        arguments: {
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: '你好!'
                            },
                            EFFECT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'none',
                                menu: 'effectMenu'
                            },
                            BGCOLOR: {
                                type: ArgumentType.STRING,
                                defaultValue: ''
                            },
                            TEXTCOLOR: {
                                type: ArgumentType.STRING,
                                defaultValue: ''
                            },
                            DURATION: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 5
                            },
                            MAXLINES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'clearAll',
                        blockType: BlockType.COMMAND,
                        text: '清除所有弹窗'
                    }
                ],
                menus: {
                    effectMenu: {
                        items: [
                            {
                                text: '亚克力',
                                value: 'acrylic'
                            },
                            {
                                text: '云母',
                                value: 'mica'
                            },
                            {
                                text: '透明',
                                value: 'transparent'
                            },
                            {
                                text: '无',
                                value: 'none'
                            }
                        ]
                    }
                }
            };
        }

        show(args) {
            this.showNotification({
                message: args.MESSAGE,
                duration: 5,
                effect: 'none',
                maxLines: 1
            });
        }

        showWithOptions(args) {
            this.showNotification({
                message: args.MESSAGE,
                duration: args.DURATION,
                effect: args.EFFECT,
                maxLines: 1
            });
        }

        showAdvanced(args) {
            this.showNotification({
                message: args.MESSAGE,
                duration: args.DURATION,
                effect: args.EFFECT,
                bgColor: args.BGCOLOR,
                textColor: args.TEXTCOLOR,
                maxLines: args.MAXLINES
            });
        }

        showNotification(options) {
            // 在非浏览器环境中忽略
            if (typeof document === 'undefined') return;
            
            // 延迟初始化管理器
            if (!notificationManager) {
                notificationManager = new NotificationManager();
            }
            
            notificationManager.showNotification(options);
        }

        clearAll() {
            if (typeof document === 'undefined') return;
            
            if (notificationManager) {
                notificationManager.clearAll();
            }
        }
    }

    // 注册扩展
    extensions.register(new PopupPOR(runtime));
}(Scratch));