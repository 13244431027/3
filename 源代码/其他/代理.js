(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('CORS代理必须在非沙盒环境下运行');
    }

    var proxy = 'corsproxy';

    // 提供2个备选代理，以防某个服务不可用
    const corsproxy = 'https://corsproxy.io/?';
    const allorigins = 'https://api.allorigins.win/raw?url=';

    class nkcorsproxy {
        getInfo() {
            return {
                id: 'nkcorsproxy',
                name: 'CORS代理',
                color1: '#376661',
                color2: '#3b6766',
                blocks: [
                    {
                        opcode: 'addcors',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '为 [URL] 添加CORS代理',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'fetchcors',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取 [URL] (CORS代理)',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setcors',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '将代理服务更改为 [PROXY]',
                        arguments: {
                            PROXY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'PROXIES',
                                defaultValue: proxy
                            }
                        }
                    },
                ],
                menus: {
                    PROXIES: {
                        acceptreporters: true,
                        items: ['corsproxy', 'allorigins']
                    }
                }
            };
        }

        addcors(args) {
            if (proxy === 'allorigins') {
                return allorigins + args.URL;
            }
            return corsproxy + encodeURIComponent(args.URL);
        }

        async fetchcors(args) {
            if (proxy === 'allorigins') {
                return await Scratch.fetch(allorigins + args.URL)
                    .then(r => r.text())
                    .catch(() => '');
            }
            return await Scratch.fetch(corsproxy + encodeURIComponent(args.URL))
                .then(r => r.text())
                .catch(() => '');
        }

        setcors(args) {
            proxy = args.PROXY;
        }
    }

    Scratch.extensions.register(new nkcorsproxy());
})(Scratch);