// TurboWarp 进度条扩展
class ProgressBarExtension {
    constructor() {
        this.progressBar = null;
        this.progressFill = null;
        this.progressText = null;
        this.container = null;
        this.isVisible = true;
        this.currentProgress = 0;
        
        // 默认样式配置
        this.config = {
            width: 80, // 容器宽度百分比
            height: 30, // 进度条高度px
            radius: 12, // 圆角半径px
            fillColor: '#4facfe', // 进度填充色
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景色
            position: '40px' // 距离底部距离
        };
    }
    
    getInfo() {
        return {
            id: 'progressbar',
            name: '进度条',
            blocks: [
                {
                    opcode: 'initProgressBar',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '初始化进度条'
                },
                {
                    opcode: 'setProgress',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置进度为 [progress]%',
                    arguments: {
                        progress: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'setProgressBarColor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置进度条颜色 [color]',
                    arguments: {
                        color: {
                            type: Scratch.ArgumentType.COLOR,
                            defaultValue: '#4facfe'
                        }
                    }
                },
                {
                    opcode: 'setProgressBarSize',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置进度条尺寸 宽度 [width]% 高度 [height]px',
                    arguments: {
                        width: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 80
                        },
                        height: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'setProgressBarRadius',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置进度条圆角 [radius]px',
                    arguments: {
                        radius: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 12
                        }
                    }
                },
                {
                    opcode: 'showProgressBar',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '显示进度条'
                },
                {
                    opcode: 'hideProgressBar',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '隐藏进度条'
                },{
                    opcode: 'designer',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '12345'
                }
            ]
        };
    }

	designer() {
        return this.lastResult || '12345';
   	 }
    
    initProgressBar() {
        if (this.container) return; // 防止重复创建
        
        // 创建容器
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.bottom = this.config.position;
        this.container.style.left = '50%';
        this.container.style.transform = 'translateX(-50%)';
        this.container.style.width = `${this.config.width}%`;
        this.container.style.maxWidth = '600px';
        this.container.style.backgroundColor = this.config.backgroundColor;
        this.container.style.borderRadius = `${this.config.radius}px`;
        this.container.style.padding = '15px';
        this.container.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        this.container.style.zIndex = '1000';
        this.container.style.transition = 'opacity 0.3s ease';
        
        // 创建进度条背景
        this.progressBar = document.createElement('div');
        this.progressBar.style.position = 'relative';
        this.progressBar.style.height = `${this.config.height}px`;
        this.progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        this.progressBar.style.borderRadius = `${this.config.radius}px`;
        this.progressBar.style.overflow = 'hidden';
        
        // 创建进度填充
        this.progressFill = document.createElement('div');
        this.progressFill.style.height = '100%';
        this.progressFill.style.background = `linear-gradient(to right, ${this.config.fillColor}, #00f2fe)`;
        this.progressFill.style.borderRadius = `${this.config.radius}px`;
        this.progressFill.style.width = '0%';
        this.progressFill.style.transition = 'width 0.5s ease';
        this.progressFill.style.position = 'relative';
        
        // 创建进度文本
        this.progressText = document.createElement('div');
        this.progressText.style.position = 'absolute';
        this.progressText.style.top = '0';
        this.progressText.style.left = '0';
        this.progressText.style.width = '100%';
        this.progressText.style.height = '100%';
        this.progressText.style.display = 'flex';
        this.progressText.style.alignItems = 'center';
        this.progressText.style.justifyContent = 'center';
        this.progressText.style.fontWeight = 'bold';
        this.progressText.style.fontSize = '1.1rem';
        this.progressText.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
        this.progressText.textContent = '0%';
        
        // 组装元素
        this.progressFill.appendChild(this.progressText);
        this.progressBar.appendChild(this.progressFill);
        this.container.appendChild(this.progressBar);
        
        // 添加到文档
        document.body.appendChild(this.container);
        
        // 设置初始进度
        this.setProgress({ progress: this.currentProgress });
    }
    
    setProgress(args) {
        this.currentProgress = Math.max(0, Math.min(100, args.progress));
        
        if (this.progressFill) {
            this.progressFill.style.width = `${this.currentProgress}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(this.currentProgress)}%`;
        }
    }
    
    setProgressBarColor(args) {
        this.config.fillColor = args.color;
        if (this.progressFill) {
            this.progressFill.style.background = `linear-gradient(to right, ${args.color}, #00f2fe)`;
        }
    }
    
    setProgressBarSize(args) {
        this.config.width = args.width;
        this.config.height = args.height;
        
        if (this.container) {
            this.container.style.width = `${args.width}%`;
        }
        
        if (this.progressBar) {
            this.progressBar.style.height = `${args.height}px`;
        }
    }
    
    setProgressBarRadius(args) {
        this.config.radius = args.radius;
        
        if (this.container) {
            this.container.style.borderRadius = `${args.radius}px`;
        }
        
        if (this.progressBar) {
            this.progressBar.style.borderRadius = `${args.radius}px`;
        }
        
        if (this.progressFill) {
            this.progressFill.style.borderRadius = `${args.radius}px`;
        }
    }
    
    showProgressBar() {
        this.isVisible = true;
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.opacity = '1';
        }
    }
    
    hideProgressBar() {
        this.isVisible = false;
        if (this.container) {
            this.container.style.opacity = '0';
            setTimeout(() => {
                if (!this.isVisible) {
                    this.container.style.display = 'none';
                }
            }, 300);
        }
    }
}

// 注册扩展
Scratch.extensions.register(new ProgressBarExtension());
   