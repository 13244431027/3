(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        return;
    }

    class BilibiliVideoExtension {
        constructor() {
            // 基础属性
            this.videoElement = null;
            this.containerElement = null;
            this.resizeObserver = null;
            this.stageContainer = null;
            this.currentVideoData = null;
            this.currentVideoId = null;
            this.cachedVideoData = {};
            this.lockInStage = false;
            this.limit = 0;
            this.uapi = ['https://api.codetabs.com/v1/proxy/?quest='];
            this.apivideo = 0;
            this.currentBase64Video = null;

            // 核心配置
            this.BASE_WIDTH = 448;    // 基础宽度
            this.BASE_HEIGHT = 252;   // 基础高度
            this.currentScale = 1;    // 视频倍数
            this.closeButton = null;  // 关闭按钮
            this.closeButtonText = "关闭视频";  // 按钮默认文字
            this.closeButtonColor = "#FF69B4";  // 按钮默认颜色
            this.closeButtonPos = {   // 按钮位置（以屏幕中心为原点）
                x: 0,
                y: 0
            };
            this.videoPosition = {    // 视频位置（以屏幕中心为原点）
                x: 0,
                y: 0
            };
        }

        getInfo() {
            return {
                id: 'BilibiliVideoEXT',
                name: 'B站视频扩展',
                color1: '#FF69B4',
                color2: '#FFB6C1',
                blocks: [
                    {
                        text: '*关于此扩展',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        func: 'aboutThisExtensionPE',
                        text: '手机端更新信息',
                        blockType: 'button'
                    },
                    {
                        func: 'aboutThisExtensionPC',
                        text: '电脑端更新信息',
                        blockType: 'button'
                    },
                    {
                        func: 'aboutAPILICENCE',
                        text: '*使用条款',
                        blockType: 'button'
                    },
                    {
                        func: 'aboutCodetabscom',
                        text: '*api.codetabs.com',
                        blockType: 'button'
                    },
                    '---',
                    {
                        text: '*鼠标停留在按钮上可显示教程说明,',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        text: '*鼠标如果按下视频页面按下按键将控制视频而不是舞台.',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        text: '*播放b站视频',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        opcode: 'playBilibiliVideo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '播放b站视频 [VIDEO_ID]',
                        tooltip:'播放b站视频 [VIDEO_ID]\n（可以播放BV AV视频，输入格式错误会提示）\n按照“锁定屏幕在舞台上 [LOCK]”生成AV/BV视频在初始位置。',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            }
                        }
                    },
                    {
                        opcode: 'setVideoScale',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置视频倍数为 [SCALE]',
                        tooltip:'设置视频倍数为 [SCALE]\n（倍数指 视频按照等比例缩放）\n按照原大小*倍数进行缩放。',
                        arguments: {
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'setVideoPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置视频位置（中心原点）X:[X] Y:[Y]',
                        tooltip:'设置视频位置（中心原点）X:[X] Y:[Y]\n（中心原点指 x=0 y=0 这里的x y与Scratch不同。）\n移动到某个位置。',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setCloseButtonText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置关闭按钮文字为 [TEXT]',
                        tooltip:'设设置关闭按钮文字为 [TEXT]\n（按钮文字指显示视频后弹出的强制关闭按钮上面显示的字，默认为‘关闭视频’）\n设置关闭按钮上显示的文字，按钮会根据文字自动缩放。',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '关闭视频'
                            }
                        }
                    },
                    {
                        opcode: 'setCloseButtonColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置关闭按钮颜色为 [COLOR]',
                        tooltip:'设置关闭按钮颜色为 [COLOR]\n（按钮颜色指显示视频后弹出的强制关闭按钮上按钮的颜色，默认为粉色#FF69B4 提示：白色是#ffffff 黑色是#000000）\n设置关闭按钮的背景颜色。',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#FF69B4'
                            }
                        }
                    },
                    {
                        opcode: 'setCloseButtonPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置关闭按钮位置（中心原点）X:[X] Y:[Y]',
                        tooltip:'设置关闭按钮位置（中心原点）X:[X] Y:[Y]\n（中心原点指 x=0 y=0 这里的x y与Scratch不同。）\n移动到某个位置。',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'expandVideoToStage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '扩展视频至整个舞台',
                        tooltip:'扩展视频至整个舞台\n（一定会扩展至舞台，与是否设置‘锁定屏幕在舞台上 [LOCK]’无关。会直接运行‘锁定屏幕在舞台上 [true’]）\n将视频覆盖整个舞台。'
                    },
                    {
                        opcode: 'setLockInStage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '锁定屏幕在舞台上 [LOCK]',
                        tooltip:'锁定屏幕在舞台上 [LOCK]\n（锁定指边界在舞台上，不锁定指边界在屏幕中。边界指视频播放的范围限制。）\n改变视频播放的范围。',
                        arguments: {
                            LOCK: {
                                type: Scratch.ArgumentType.BOOLEAN,
                                defaultValue: false
                            }
                        }
                    },
                    {
                        opcode: 'stopVideo',
                        blockType: Scratch.BlockType.COMMAND,
                        tooltip:'停止播放\n（删除边界指播放视频所需的<div>框架）\n停止正在播放的视频并删除边界。',
                        text: '停止播放'
                    },
                    "---",
                    {
                        text: '*舞台等位置信息',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        opcode: 'getVideoPositionX',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'视频位置X\n（不是检测视频现在的位置而是上次‘设置视频位置（中心原点）X:[X] Y:[Y]’设置的位置）\n获取上次设置的视频位置X',
                        text: '视频位置X'
                    },
                    {
                        opcode: 'getVideoPositionY',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'视频位置Y\n（不是检测视频现在的位置而是上次‘设置视频位置（中心原点）X:[X] Y:[Y]’设置的位置）\n获取上次设置的视频位置Y',
                        text: '视频位置Y'
                    },
                    {
                        opcode: 'getButtonPositionX',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'关闭按钮位置X\n（不是检测关闭按钮现在的位置而是上次‘设置关闭按钮位置（中心原点）X:[X] Y:[Y]’设置的位置）\n获取上次设置的关闭按钮位置X',
                        text: '关闭按钮位置X'
                    },
                    {
                        opcode: 'getButtonPositionY',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'关闭按钮位置Y\n（不是检测关闭按钮现在的位置而是上次‘设置关闭按钮位置（中心原点）X:[X] Y:[Y]’设置的位置）\n获取上次设置的关闭按钮位置Y',
                        text: '关闭按钮位置Y'
                    },
                    "---",
                    // 舞台信息
                    {
                        opcode: 'getStageWidth',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'舞台宽度\n（辅助功能）\n获取舞台宽度',
                        text: '舞台宽度'
                    },
                    {
                        opcode: 'getStageHeight',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'舞台高度\n（辅助功能）\n获取舞台高度',
                        text: '舞台高度'
                    },
                    "---",
                    {
                        text: '*b站视频获取信息',
                        blockType: Scratch.BlockType.LABEL
                    },
                    // 当前视频信息
                    {
                        opcode: 'getCurrentVideoTitle',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'当前视频的标题\n（当前视频指的是现在<div>边界里播放的视频。）\n输出当前视频的标题tag',
                        text: '当前视频的标题'
                    },
                    {
                        opcode: 'getCurrentVideoAuthor',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'当前视频的UP主\n（当前视频指的是现在<div>边界里播放的视频。）\n输出当前视频的UP主tag',
                        text: '当前视频的UP主'
                    },
                    {
                        opcode: 'getCurrentVideoStats',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'当前视频的[STAT_TYPE]\n（当前视频指的是现在<div>边界里播放的视频。）\n输出当前视频的标题[点赞,收藏,分享,播放量,弹幕数]',
                        text: '当前视频的[STAT_TYPE]',
                        arguments: {
                            STAT_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'statType',
                                defaultValue: '点赞'
                            }
                        }
                    },
                    {
                        opcode: 'getCurrentVideoDuration',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'当前视频的时长\n（当前视频指的是现在<div>边界里播放的视频。）\n输出当前视频的时长',
                        text: '当前视频的时长'
                    },
                    {
                        opcode: 'getCurrentVideoCover',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'当前视频的封面\n（当前视频指的是现在<div>边界里播放的视频。）\n输出当前视频的封面',
                        text: '当前视频的封面'
                    },
                    "---",
                    // 指定视频信息
                    {
                        opcode: 'getVideoTitle',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'[VIDEO_ID]视频的标题\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的标题tag',
                        text: '[VIDEO_ID]视频的标题',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            }
                        }
                    },
                    {
                        opcode: 'getVideoAuthor',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'[VIDEO_ID]视频的UP主\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的UP主',
                        text: '[VIDEO_ID]视频的UP主',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            }
                        }
                    },
                    {
                        opcode: 'getVideoStats',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'[VIDEO_ID]视频的[STAT_TYPE]\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的[点赞,收藏,分享,播放量,弹幕数]',
                        text: '[VIDEO_ID]视频的[STAT_TYPE]',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            },
                            STAT_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'statType',
                                defaultValue: '点赞'
                            }
                        }
                    },
                    {
                        opcode: 'getVideoDuration',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'[VIDEO_ID]视频的时长\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的时长tag',
                        text: '[VIDEO_ID]视频的时长',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            }
                        }
                    },
                    {
                        opcode: 'getVideoCover',
                        blockType: Scratch.BlockType.REPORTER,
                        tooltip:'[VIDEO_ID]视频的封面\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的封面tag',
                        text: '[VIDEO_ID]视频的封面',
                        arguments: {
                            VIDEO_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'BV1gphczLEN2'
                            }
                        }
                    },
                    '---',
                    {
                        text: '*播放Base64视频',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        func: 'uploadVideoToBase64',
                        text: '上传视频并转换为Base64',
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        blockType: 'button'
                    },
                    {
                        func: 'pasteBase64ToPlay',
                        text: '粘贴Base64字符串播放',
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        blockType: 'button'
                    },
                    {
                        opcode: 'playVideoByBase64',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '播放Base64视频 [BASE64_STR]',
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        arguments: {
                            BASE64_STR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'data:video/mp4;base64,'
                            }
                        }
                    },
                    {
                        opcode: 'getLastBase64String',
                        blockType: Scratch.BlockType.REPORTER,
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        tooltip:'最后一次的Base64字符串\n（最后一次指刚刚播放/复制那一次，不会保存在作品中）\n输出最后一次播放/复制的base64字符串',
                        text: '最后一次的Base64字符串'
                    },
                    {
                        opcode: 'getBase64VideoName',
                        blockType: Scratch.BlockType.REPORTER,
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        tooltip:'当前Base64视频名称\n（也可以用‘当前视频的标题’）\n输出base64视频对应的文件名',
                        text: '当前Base64视频名称'
                    },
                    {
                        opcode: 'getBase64VideoSize',
                        blockType: Scratch.BlockType.REPORTER,
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        tooltip:'当前Base64视频大小(MB)\n（MB MB 不是KB）\n输出base64视频大小',
                        text: '当前Base64视频大小(MB)'
                    },
                    {
                        opcode: 'getBase64VideoType',
                        blockType: Scratch.BlockType.REPORTER,
                        color1:'#b500ff',
                        color2:'#bd1cff',
                        tooltip:'当前Base64视频格式\n（video/xxx）\n输出base64视频格式',
                        text: '当前Base64视频格式'
                    },
                    '---',
                    {
                        text: '旧版本',
                        blockType: Scratch.BlockType.LABEL
                    },
                    {
                        opcode: 'playVideoAtPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '在位置 X:[X] Y:[Y] 宽度:[WIDTH] 高度:[HEIGHT] 播放视频',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 480
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 270
                            }
                        }
                    }
                ],
                menus: {
                    statType: {
                        acceptReporters: false,
                        items: [
                            '点赞',
                            '投币',
                            '收藏',
                            '分享',
                            '播放量',
                            '弹幕数'
                        ]
                    }
                }
            }
        }
        aboutThisExtensionPE(){open('https://learn.ccw.site/article/0868b8b0-65fe-4663-b125-f001edc894c6')}
        aboutThisExtensionPC(){open('https://learn.ccw.site/article/38f5a9b0-7331-4054-b994-9c27f32a9666')}
        aboutCodetabscom(){open('https://codetabs.com/')}
        aboutAPILICENCE(){open('https://learn.ccw.site/article/5a05f4dd-4b2d-4a5b-a69b-31bd6241420a')}
        _open(url){window.open(url)}
        // 获取舞台容器
        _getStageContainer() {
            if (this.stageContainer) return this.stageContainer;
            
            // 优先使用用户提供的canvas父容器
            const canvasSmall = document.querySelector("#stage-canvas-wrapper > div > div.gandi_stage_stage_1fD7k.ccw-stage-wrapper > div:nth-child(1) > canvas");
            const canvasLarge = document.querySelector("#stage-canvas-wrapper > div > div.gandi_stage_stage_1fD7k.ccw-stage-wrapper.gandi_stage_full-screen_ZO7xi > div:nth-child(1) > canvas");
            
            if (canvasLarge) {
                this.stageContainer = canvasLarge.closest('.gandi_stage_stage_1fD7k');
            } else if (canvasSmall) {
                this.stageContainer = canvasSmall.closest('.gandi_stage_stage_1fD7k');
            }
            
            // 备选方案
            if (!this.stageContainer) {
                this.stageContainer = document.querySelector('#stage-canvas-wrapper') || 
                                    document.querySelector('[class*="stage-wrapper"]') || 
                                    document.body;
            }
            
            return this.stageContainer;
        }

        // 获取屏幕/舞台中心坐标
        _getCenterCoordinates() {
            const container = this.lockInStage ? this._getStageContainer() : window;
            const rect = this.lockInStage 
                ? container.getBoundingClientRect()
                : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
                
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        // 获取屏幕边界（用于按钮边界检查）
        _getScreenBounds() {
            return {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

        // 创建带毛玻璃效果的关闭按钮
        _createCloseButton() {
            const button = document.createElement('button');
            button.id = 'bilibili-video-close-btn';
            button.textContent = this.closeButtonText;
            
            // 计算基于中心原点的位置并应用Y轴反向处理
            const center = this._getCenterCoordinates();
            // 强制获取按钮尺寸
            button.style.visibility = 'hidden';
            document.body.appendChild(button);
            const buttonRect = button.getBoundingClientRect();
            button.style.visibility = '';
            
            // 计算位置，Y轴进行反向处理
            let x = center.x + this.closeButtonPos.x - buttonRect.width / 2;
            let y = center.y - this.closeButtonPos.y - buttonRect.height / 2; // Y轴反向处理
            
            // 应用屏幕边界检查
            const screenBounds = this._getScreenBounds();
            x = Math.max(screenBounds.left, Math.min(screenBounds.left + screenBounds.width - buttonRect.width, x));
            y = Math.max(screenBounds.top, Math.min(screenBounds.top + screenBounds.height - buttonRect.height, y));
            
            // 毛玻璃效果样式，应用自定义颜色和位置
            button.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                padding: 8px 16px;
                border: none;
                border-radius: 20px;
                background: ${this.closeButtonColor}80; /* 带透明度的颜色 */
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: white;
                font-size: 14px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                opacity: 0.8;
            `;
            
            button.addEventListener('click', () => this.stopVideo());
            return button;
        }

        // 更新按钮位置
        _updateButtonPosition() {
            if (!this.closeButton) return;
            
            const center = this._getCenterCoordinates();
            const buttonRect = this.closeButton.getBoundingClientRect();
            
            // 计算基于中心原点的位置，Y轴进行反向处理
            let x = center.x + this.closeButtonPos.x - buttonRect.width / 2;
            let y = center.y - this.closeButtonPos.y - buttonRect.height / 2; // Y轴反向处理
            
            // 应用屏幕边界检查（始终使用屏幕作为边界）
            const screenBounds = this._getScreenBounds();
            x = Math.max(screenBounds.left, Math.min(screenBounds.left + screenBounds.width - buttonRect.width, x));
            y = Math.max(screenBounds.top, Math.min(screenBounds.top + screenBounds.height - buttonRect.height, y));
            
            this.closeButton.style.left = `${x}px`;
            this.closeButton.style.top = `${y}px`;
        }

        // 设置关闭按钮文字
        setCloseButtonText(args) {
            this.closeButtonText = args.TEXT || "关闭视频";
            if (this.closeButton) {
                this.closeButton.textContent = this.closeButtonText;
                this._updateButtonPosition(); // 文字变化可能改变按钮尺寸，需要重新定位
            }
        }

        // 设置关闭按钮颜色
        setCloseButtonColor(args) {
            this.closeButtonColor = args.COLOR || "#FF69B4";
            if (this.closeButton) {
                // 更新按钮颜色，保持透明度
                this.closeButton.style.background = `${this.closeButtonColor}80`;
            }
        }

        // 设置关闭按钮位置（中心原点）
        setCloseButtonPosition(args) {
            this.closeButtonPos = {
                x: parseFloat(args.X) || 0,
                y: parseFloat(args.Y) || 0
            };
            
            this._updateButtonPosition();
        }

        // 设置视频倍数
        setVideoScale(args) {
            let scale = parseFloat(args.SCALE) || 1;
            scale = Math.max(0.1, scale); // 最小倍数限制
            
            // 锁定状态下最大倍数为1
            if (this.lockInStage) {
                scale = Math.min(scale, 1);
            }
            
            this.currentScale = scale;
            this._updateVideoLayout(); // 重新布局
        }

        // 设置视频位置（中心原点，Y>0向上）
        setVideoPosition(args) {
            this.videoPosition = {
                x: parseFloat(args.X) || 0,
                y: parseFloat(args.Y) || 0
            };
            this._updateVideoLayout();
        }

        // 获取视频位置X
        getVideoPositionX() {
            return this.videoPosition.x;
        }

        // 获取视频位置Y
        getVideoPositionY() {
            return this.videoPosition.y;
        }

        // 获取按钮位置X
        getButtonPositionX() {
            return this.closeButtonPos.x;
        }

        // 获取按钮位置Y
        getButtonPositionY() {
            return this.closeButtonPos.y;
        }

        // 扩展视频至整个舞台
        expandVideoToStage() {
            if (!this.containerElement || !this.videoElement) return;
            
            // 获取舞台尺寸
            const stage = this._getStageContainer();
            const rect = stage.getBoundingClientRect();
            
            // 计算需要的缩放倍数
            const scaleX = rect.width / this.BASE_WIDTH;
            const scaleY = rect.height / this.BASE_HEIGHT;
            this.currentScale = Math.min(scaleX, scaleY);
            
            // 锁定到舞台并居中显示
            this.lockInStage = true;
            this.videoPosition = { x: 0, y: 0 };
            this._updateVideoLayout();
        }

        // 获取舞台宽度
        getStageWidth() {
            const stage = this._getStageContainer();
            const rect = stage.getBoundingClientRect();
            return rect.width;
        }

        // 获取舞台高度
        getStageHeight() {
            const stage = this._getStageContainer();
            const rect = stage.getBoundingClientRect();
            return rect.height;
        }

        // 核心方法：更新视频布局（位置和大小）
        _updateVideoLayout() {
            if (!this.containerElement || !this.videoElement) return;
            
            // 计算实际尺寸
            const actualWidth = this.BASE_WIDTH * this.currentScale;
            const actualHeight = this.BASE_HEIGHT * this.currentScale;
            
            // 获取参考容器（舞台或窗口）和中心坐标
            const center = this._getCenterCoordinates();
            
            // 计算视频左上角坐标（基于中心原点）
            let x = center.x + this.videoPosition.x - actualWidth / 2;
            let y = center.y - this.videoPosition.y - actualHeight / 2; // Y轴反向处理
            
            // 获取容器边界
            const container = this.lockInStage ? this._getStageContainer() : window;
            const rect = this.lockInStage 
                ? container.getBoundingClientRect()
                : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
            
            // 边界检查（不超出容器）
            x = Math.max(rect.left, Math.min(rect.left + rect.width - actualWidth, x));
            y = Math.max(rect.top, Math.min(rect.top + rect.height - actualHeight, y));
            
            // 应用布局
            this.containerElement.style.width = `${actualWidth}px`;
            this.containerElement.style.height = `${actualHeight}px`;
            this.containerElement.style.left = `${x}px`;
            this.containerElement.style.top = `${y}px`;
        }

        // 创建视频容器
        _createVideoContainer() {
            const container = document.createElement('div');
            container.id = 'bilibili-video-container';
            container.style.position = 'absolute';
            container.style.zIndex = '9998';
            container.style.pointerEvents = 'none';
            container.style.overflow = 'hidden';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            return container;
        }

        // 创建B站视频iframe
        _createIframe(videoId) {
            this.limit++;
            if (this.limit > 160) {
                alert('您的请求达到上限。');
                throw new Error('您的请求达到上限。');
            }
            
            const isBV = videoId.toUpperCase().startsWith('BV');
            const embedUrl = isBV 
                ? `https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=1&page=1`
                : `https://player.bilibili.com/player.html?aid=${videoId.replace('av', '')}&autoplay=1&page=1`;
            
            const fullUrl = embedUrl +
                `&high_quality=1` +
                `&danmaku=0` +
                `&as_wide=0` +
                `&hide_title=1` +
                `&hide_fullbtn=1` +
                `&hide_bvid=1` +
                `&hide_share=1` +
                `&hide_related=1` +
                `&hide_info=1`;
            
            const iframe = document.createElement('iframe');
            iframe.src = fullUrl;
            iframe.id = 'bilibili-player-iframe';
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.pointerEvents = 'auto';
            iframe.allowFullscreen = true; // 允许全屏
            iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-presentation allow-popups-to-escape-sandbox';
            
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const style = document.createElement('style');
                    style.textContent = `
                        body, html { margin: 0; padding: 0; overflow: hidden; }
                        #bilibili-player { width: 100% !important; height: 100% !important; }
                        .bilibili-player-video-control, .bilibili-player-video-top, 
                        .bilibili-player-video-bottom, .bilibili-player-header {
                            display: none !important;
                        }
                        .bilibili-player-video-area { width: 100% !important; height: 100% !important; }
                        .bilibili-player-video video { object-fit: cover !important; }
                    `;
                    iframeDoc.head.appendChild(style);
                } catch (e) {
                    console.warn('样式优化失败:', e);
                }
            };
            
            return iframe;
        }

        // 播放B站视频
        playBilibiliVideo(args) {
            const videoId = args.VIDEO_ID.trim();
            
            // 验证视频ID格式
            const isValidBV = /^BV[a-zA-Z0-9]{10}$/i.test(videoId);
            const isValidAV = /^av\d+$/i.test(videoId);
            if (!isValidBV && !isValidAV) {
                alert('无效的视频ID（BV或av格式）');
                return;
            }
            
            // 先停止当前播放
            this.stopVideo();
            
            // 创建视频元素
            this.currentVideoId = videoId;
            this.containerElement = this._createVideoContainer();
            this.videoElement = this._createIframe(videoId);
            this.containerElement.appendChild(this.videoElement);
            
            // 创建关闭按钮
            this.closeButton = this._createCloseButton();
            document.body.appendChild(this.closeButton);
            
            // 添加到页面并初始化布局
            document.body.appendChild(this.containerElement);
            this._updateVideoLayout(); // 初始位置（中心）
            
            // 监听尺寸变化
            if (typeof ResizeObserver === 'function') {
                this.resizeObserver = new ResizeObserver(() => {
                    this._updateVideoLayout();
                    this._updateButtonPosition();
                });
                this.resizeObserver.observe(this._getStageContainer());
            }
            window.addEventListener('resize', () => {
                this._updateVideoLayout();
                this._updateButtonPosition();
            });
            
            // 加载视频信息
            (async () => {
                this.currentVideoData = await this._fetchVideoData(videoId);
            })();
        }

        // 旧版本：位置和大小控制
        playVideoAtPosition(args) {
            if (!this.containerElement || !this.videoElement) return;
            
            const x = args.X;
            const y = args.Y;
            const width = args.WIDTH;
            const height = args.HEIGHT;
            
            // 应用旧版逻辑
            this.containerElement.style.width = `${width}px`;
            this.containerElement.style.height = `${height}px`;
            this.containerElement.style.left = `${x}px`;
            this.containerElement.style.top = `${y}px`;
            
            // 更新视频位置记录
            const center = this._getCenterCoordinates();
            this.videoPosition.x = x + width / 2 - center.x;
            this.videoPosition.y = center.y - (y + height / 2);
        }

        // 停止播放
        stopVideo() {
            // 移除关闭按钮
            if (this.closeButton) {
                this.closeButton.remove();
                this.closeButton = null;
            }
            
            // 移除视频元素
            if (this.videoElement) {
                this.videoElement.remove();
                this.videoElement = null;
            }
            
            // 移除容器
            if (this.containerElement) {
                this.containerElement.remove();
                this.containerElement = null;
            }
            
            // 清理监听器
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
            window.removeEventListener('resize', () => {
                this._updateVideoLayout();
                this._updateButtonPosition();
            });
            
            // 重置状态
            this.stageContainer = null;
            this.currentVideoData = null;
            this.currentVideoId = null;
            this.currentScale = 1;
            this.videoPosition = { x: 0, y: 0 };
        }

        // 其他方法保持不变...
        async _fetchWithProxy(url, attempt = 0, lastError = null) {
            if (attempt >= this.uapi.length) {
                throw lastError || new Error('所有代理均失败');
            }
    
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.bilibili.com/'
            };
    
            const currentApiIndex = (this.apivideo + attempt) % this.uapi.length;
            const proxy = this.uapi[currentApiIndex];
            this.limit++;
            
            if (this.limit > 160) {
                alert('您的请求达到上限。');
                throw new Error('您的请求达到上限。');
            }
            
            try {
                const fullUrl = proxy + encodeURIComponent(url);
                const response = await fetch(fullUrl, { headers });
        
                if (!response.ok) {
                    throw new Error(`网络响应异常: ${response.status}`);
                }
        
                return await response.json();
            } catch (error) {
                return this._fetchWithProxy(url, attempt + 1, error);
            }
        }

        async _fetchVideoData(videoId) {
            try {
                const isBV = videoId.toUpperCase().startsWith('BV');
                const apiUrl = isBV 
                    ? `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`
                    : `https://api.bilibili.com/x/web-interface/view?aid=${videoId.replace('av', '')}`;
                
                const data = await this._fetchWithProxy(apiUrl);
                return data.code === 0 ? data.data : null;
            } catch (error) {
                console.error('获取视频数据失败:', error);
                return null;
            }
        }

        getCurrentVideoTitle() {
            return this.currentVideoData?.title || '请先播放视频';
        }

        getCurrentVideoAuthor() {
            return this.currentVideoData?.owner?.name || '未知UP主';
        }

        getCurrentVideoStats(args) {
            if (!this.currentVideoData) return '请先播放视频';
            
            const statMap = {
                '点赞': 'like',
                '投币': 'coin',
                '收藏': 'favorite',
                '分享': 'share',
                '播放量': 'view',
                '弹幕数': 'danmaku'
            };
            
            return this.currentVideoData.stat[statMap[args.STAT_TYPE]] || 0;
        }

        getCurrentVideoDuration() {
            if (!this.currentVideoData?.duration) return '未知';
            
            const mins = Math.floor(this.currentVideoData.duration / 60);
            const secs = this.currentVideoData.duration % 60;
            return `${mins}分${secs < 10 ? '0' : ''}${secs}秒`;
        }

        getCurrentVideoCover() {
            return this.currentVideoData?.pic || '';
        }

        async _getCachedVideoData(videoId) {
            if (!this.cachedVideoData[videoId]) {
                this.cachedVideoData[videoId] = await this._fetchVideoData(videoId);
            }
            return this.cachedVideoData[videoId];
        }

        async getVideoTitle(args) {
            const data = await this._getCachedVideoData(args.VIDEO_ID);
            return data?.title || '未获取到信息';
        }

        async getVideoAuthor(args) {
            const data = await this._getCachedVideoData(args.VIDEO_ID);
            return data?.owner?.name || '未知UP主';
        }

        async getVideoStats(args) {
            const data = await this._getCachedVideoData(args.VIDEO_ID);
            if (!data) return 0;
            
            const statMap = {
                '点赞': 'like',
                '投币': 'coin',
                '收藏': 'favorite',
                '分享': 'share',
                '播放量': 'view',
                '弹幕数': 'danmaku'
            };
            
            return data.stat[statMap[args.STAT_TYPE]] || 0;
        }

        async getVideoDuration(args) {
            const data = await this._getCachedVideoData(args.VIDEO_ID);
            if (!data?.duration) return '未知';
            
            const mins = Math.floor(data.duration / 60);
            const secs = data.duration % 60;
            return `${mins}分${secs < 10 ? '0' : ''}${secs}秒`;
        }

        async getVideoCover(args) {
            const data = await this._getCachedVideoData(args.VIDEO_ID);
            return data?.pic || '';
        }

        uploadVideoToBase64() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.style.display = 'none';
            document.body.appendChild(input);

            input.onchange = (e) => {
                const file = e.target.files[0];
                document.body.removeChild(input);
                if (!file) return;

                if (file.size > 50 * 1024 * 1024) {
                    alert('视频文件过大，请选择50MB以下的视频');
                    return;
                }

                const loader = this._createGlassEffectLoader();
                document.body.appendChild(loader);

                const reader = new FileReader();
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        loader.querySelector('#progressBar').style.width = `${percent}%`;
                    }
                };

                reader.onload = (event) => {
                    loader.remove();
                    const base64Str = event.target.result;
            
                    this.currentBase64Video = {
                        name: file.name,
                        type: file.type,
                        base64: base64Str,
                        size: file.size
                    };

                    this._showGlassEffectResult(base64Str, file);
                };

                reader.readAsDataURL(file);
            };
            input.click();
        }

        pasteBase64ToPlay() {
            const textarea = document.createElement('textarea');
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            textarea.placeholder = '请粘贴视频的Base64字符串（格式：data:video/mp4;base64,...）';
            textarea.style.border = 'none';
            textarea.style.padding = '10px';
            textarea.style.borderRadius = '8px';
            textarea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

            const dialog = this._createGlassEffectDialog(textarea);
            document.body.appendChild(dialog);

            dialog.querySelector('#playBtn').addEventListener('click', () => {
                const base64Str = textarea.value.trim();
                dialog.remove();
        
                if (!this._validateBase64Format(base64Str)) return;
        
                this.currentBase64Video = {
                    name: '粘贴的视频',
                    base64: base64Str
                };
                this._playBase64Video(base64Str, '粘贴的视频');
            });
        }

        playVideoByBase64(args) {
            const base64Str = args.BASE64_STR.trim();
            if (!this._validateBase64Format(base64Str)) return;
            this._playBase64Video(base64Str, '代码输入的视频');
        }

        _createGlassEffectLoader() {
            const loader = document.createElement('div');
            loader.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            
            loader.innerHTML = `
                <p style="color: #333; margin: 0 0 10px 0;">正在处理视频...</p>
                <div style="width: 300px; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px;">
                    <div id="progressBar" style="width: 0%; height: 100%; background: ${this.closeButtonColor}; border-radius: 4px; transition: width 0.3s ease;"></div>
                </div>
            `;
            return loader;
        }

        _showGlassEffectResult(base64Str, file) {
            const resultDiv = document.createElement('div');
            resultDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
    
            resultDiv.innerHTML = `
                <p style="color: #333; margin-top: 0;">视频转换成功！</p>
                <p style="color: #333; margin: 5px 0;">文件名: ${file.name}</p>
                <p style="color: #333; margin: 5px 0;">大小: ${(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                <p style="color: #333; margin: 5px 0; word-break: break-all;">Base64前缀: ${base64Str.substring(0, 50)}...</p>
                <div style="margin: 15px 0;">
                    <button id="copyBtn" style="padding: 8px 16px; background: ${this.closeButtonColor}80; color: white; border: none; border-radius: 4px; cursor: pointer;">复制Base64字符串</button>
                    <button id="playBtn" style="margin-left: 10px; padding: 8px 16px; background: rgba(76, 175, 80, 0.8); color: white; border: none; border-radius: 4px; cursor: pointer;">直接播放视频</button>
                </div>
            `;
    
            document.body.appendChild(resultDiv);
    
            resultDiv.querySelector('#copyBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(base64Str).then(() => alert('Base64字符串已复制'));
            });
    
            resultDiv.querySelector('#playBtn').addEventListener('click', () => {
                resultDiv.remove();
                this._playBase64Video(base64Str, file.name);
            });
        }

        _createGlassEffectDialog(textarea) {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
    
            dialog.innerHTML = `
                <h3 style="margin-top: 0; color: #333;">粘贴Base64字符串</h3>
                <div id="textareaContainer"></div>
                <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
                    <button id="cancelBtn" style="padding: 6px 12px; margin-right: 10px; background: rgba(200, 200, 200, 0.5); border: none; border-radius: 4px; cursor: pointer;">取消</button>
                    <button id="playBtn" style="padding: 6px 12px; background: ${this.closeButtonColor}80; color: white; border: none; border-radius: 4px; cursor: pointer;">播放</button>
                </div>
            `;
    
            dialog.querySelector('#textareaContainer').appendChild(textarea);
            dialog.querySelector('#cancelBtn').addEventListener('click', () => dialog.remove());
            return dialog;
        }

        _playBase64Video(base64Str, videoName) {
            this.stopVideo(); 
    
            const stageContainer = this._getStageContainer();
            this.containerElement = this._createVideoContainer();
            this.videoElement = this._createBase64VideoElement(base64Str);
    
            // 创建关闭按钮
            this.closeButton = this._createCloseButton();
            document.body.appendChild(this.closeButton);
    
            this.containerElement.appendChild(this.videoElement);
            document.body.appendChild(this.containerElement);
    
            // 初始化布局
            this._updateVideoLayout();
    
            // 监听尺寸变化
            if (typeof ResizeObserver === 'function') {
                this.resizeObserver = new ResizeObserver(() => {
                    this._updateVideoLayout();
                    this._updateButtonPosition();
                });
                this.resizeObserver.observe(stageContainer);
            }
            window.addEventListener('resize', () => {
                this._updateVideoLayout();
                this._updateButtonPosition();
            });
            
            // 设置视频信息
            this.currentVideoData = {
                title: videoName,
                owner: { name: '本地视频' },
                duration: '未知',
                stat: { like: 'N/A', view: '本地播放' }
            };
        }

        _createBase64VideoElement(base64Str) {
            const video = document.createElement('video');
            video.src = base64Str;
            video.autoplay = true;
            video.muted = false;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.controls = false;
            video.allowFullscreen = true;
            return video;
        }

        _validateBase64Format(base64Str) {
            if (!base64Str || !base64Str.startsWith('data:video/')) {
                alert('无效的Base64视频格式（需以data:video/开头）');
                return false;
            }
            return true;
        }

        getLastBase64String() {
            return this.currentBase64Video?.base64 || '';
        }

        getBase64VideoName() {
            return this.currentBase64Video?.name || '未播放视频';
        }

        getBase64VideoSize() {
            if (!this.currentBase64Video) return '0';
            return (this.currentBase64Video.size / (1024 * 1024)).toFixed(2);
        }

        getBase64VideoType() {
            return this.currentBase64Video?.type || '未知';
        }

        setLockInStage(args) {
            this.lockInStage = args.LOCK;
            this.setVideoScale({ SCALE: this.currentScale });
        }
    }

    Scratch.extensions.register(new BilibiliVideoExtension());
})(Scratch);
    
