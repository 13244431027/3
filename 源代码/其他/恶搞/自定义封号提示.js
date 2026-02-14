(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '封号提示系统',
            'banAlertBlock': '弹出封号提示 图标：[ICON] 标题：[TITLE] 副标题：[SUBTITLE] 开始时间：[START] 结束时间：[END] 原因：[REASON] 来源：[SOURCE] 申诉链接：[URL]',
            'banTitle': '账户异常',
            'banContent': '您的账户存在异常行为，当前已被暂停服务',
            'banFooter': '若您有异议，请尽快点击下方按钮提交申诉，我们会在7个工作日内给您答复！',
            'appealButton': '申诉账户',
            'startTime': '封号开始时间：',
            'endTime': '封号结束时间：',
            'reason': '封号原因：',
            'source': '封号来源：',
            'iconOptions': '🚫|⚠️|⛔|🛑|❌'
        },
        en: {
            'extensionName': 'Ban Alert System',
            'banAlertBlock': 'show ban alert icon:[ICON] title:[TITLE] subtitle:[SUBTITLE] start:[START] end:[END] reason:[REASON] source:[SOURCE] appeal:[URL]',
            'banTitle': 'Account Restricted',
            'banContent': 'Your account is experiencing unusual behavior and is currently suspended',
            'banFooter': 'If you have any objections, please click the button below to submit an appeal as soon as possible, and we will reply to you within 7 working days!',
            'appealButton': 'Submit Appeal',
            'startTime': 'Start Time: ',
            'endTime': 'End Time: ',
            'reason': 'Reason: ',
            'source': 'Source: ',
            'iconOptions': '🚫|⚠️|⛔|🛑|❌'
        }
    });

    class BanAlertExtension {
        getInfo() {
            return {
                id: 'banAlert',
                name: translate({ id: 'extensionName' }),
                color1: '#FF4444',
                color2: '#CC0000',
                blocks: [{
                    opcode: 'showBanAlert',
                    blockType: BlockType.COMMAND,
                    text: translate({ id: 'banAlertBlock' }),
                    arguments: {
                        ICON: {
                            type: ArgumentType.STRING,
                            menu: 'iconMenu',
                            defaultValue: '🚫'
                        },
                        TITLE: {
                            type: ArgumentType.STRING,
                            defaultValue: translate({ id: 'banTitle' })
                        },
                        SUBTITLE: {
                            type: ArgumentType.STRING,
                            defaultValue: translate({ id: 'banContent' })
                        },
                        START: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-01-01 00:00'
                        },
                        END: {
                            type: ArgumentType.STRING,
                            defaultValue: '2024-12-31 23:59'
                        },
                        REASON: {
                            type: ArgumentType.STRING,
                            defaultValue: '违反用户协议'
                        },
                        SOURCE: {
                            type: ArgumentType.STRING,
                            defaultValue: '系统自动检测'
                        },
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://example.com/appeal'
                        }
                    }
                }],
                menus: {
                    iconMenu: {
                        acceptReporters: true,
                        items: translate({ id: 'iconOptions' }).split('|').map(icon => ({
                            text: icon,
                            value: icon
                        }))
                    }
                }
            };
        }

        // 支持换行显示的文本元素创建函数
        createMultilineTextElement(content) {
            const container = document.createElement('div');
            container.style.whiteSpace = 'pre-line';
            
            // 安全地添加文本内容
            const textNode = document.createTextNode(content);
            container.appendChild(textNode);
            
            return container;
        }

        showBanAlert(args) {
            // 删除所有页面元素（保留script/style标签）
            Array.from(document.body.children).forEach(child => {
                if (!['SCRIPT', 'STYLE'].includes(child.tagName)) {
                    child.remove();
                }
            });
            
            // 移除已有弹窗
            const existing = document.getElementById('ban-alert-container');
            if (existing) existing.remove();

            // 创建遮罩层
            const container = document.createElement('div');
            container.id = 'ban-alert-container';
            container.style = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.95);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            `;

            // 主内容框
            const alertBox = document.createElement('div');
            alertBox.style = `
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                max-width: 500px;
                text-align: center;
            `;

            // 标题部分
            const titleIcon = document.createElement('div');
            titleIcon.textContent = Cast.toString(args.ICON); // 使用用户选择的图标
            titleIcon.style.fontSize = '3rem';

            // 使用支持换行的标题元素
            const titleText = document.createElement('h1');
            titleText.style = `
                color: #ff4444;
                font-size: 2rem;
                margin: 1rem 0;
            `;
            titleText.appendChild(this.createMultilineTextElement(Cast.toString(args.TITLE)));

            // 正文内容 - 使用支持换行的副标题元素
            const contentText = document.createElement('p');
            contentText.style = `
                margin: 1rem 0;
                color: #333;
                line-height: 1.5;
            `;
            contentText.appendChild(this.createMultilineTextElement(Cast.toString(args.SUBTITLE)));

            // 详细信息框
            const detailBox = document.createElement('div');
            detailBox.style = `
                border: 2px solid #ff4444;
                border-radius: 10px;
                padding: 1rem;
                margin: 1.5rem 0;
                text-align: left;
            `;

            // 修改后的详细信息行创建函数（支持换行）
            const createDetailRow = (label, value) => {
                const row = document.createElement('div');
                row.style.margin = '0.5rem 0';
                
                const labelSpan = document.createElement('strong');
                labelSpan.textContent = translate({ id: label });
                
                const valueContainer = document.createElement('span');
                valueContainer.appendChild(this.createMultilineTextElement(Cast.toString(value)));
                
                row.appendChild(labelSpan);
                row.appendChild(document.createTextNode(' '));
                row.appendChild(valueContainer);
                
                return row;
            };

            detailBox.appendChild(createDetailRow('startTime', args.START));
            detailBox.appendChild(createDetailRow('endTime', args.END));
            detailBox.appendChild(createDetailRow('reason', args.REASON));
            detailBox.appendChild(createDetailRow('source', args.SOURCE));

            // 底部提示
            const footerText = document.createElement('p');
            footerText.style.margin = '1.5rem 0 1rem';
            footerText.appendChild(this.createMultilineTextElement(translate({ id: 'banFooter' })));

            // 申诉按钮
            const appealButton = document.createElement('button');
            appealButton.textContent = translate({ id: 'appealButton' });
            appealButton.style = `
                background: #ff4444;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: opacity 0.3s;
            `;
            appealButton.onmouseenter = () => appealButton.style.opacity = '0.8';
            appealButton.onmouseleave = () => appealButton.style.opacity = '1';
            appealButton.onclick = () => window.open(Cast.toString(args.URL), '_blank');

            // 组装元素
            alertBox.appendChild(titleIcon);
            alertBox.appendChild(titleText);
            alertBox.appendChild(contentText);
            alertBox.appendChild(detailBox);
            alertBox.appendChild(footerText);
            alertBox.appendChild(appealButton);
            container.appendChild(alertBox);
            document.body.appendChild(container);
        }
    }

    extensions.register(new BanAlertExtension());
})(Scratch);