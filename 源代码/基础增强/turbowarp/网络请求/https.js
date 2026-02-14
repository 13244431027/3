// 名称：Mist请求
// 作者：Mistium
// 描述：我的HTTP请求扩展，因为我需要一个更好的适用于originOS的版本

// 许可证：MPL-2.0
// 本源代码受Mozilla公共许可证v2.0条款约束，
// 若未随本文件一同分发MPL副本，
// 可在https://mozilla.org/MPL/2.0/获取

(function (Scratch) {

    const Cast = Scratch.Cast;

    class MistFetch {
        constructor() {
            this.requests = {}; // 存储请求的对象
        }

        getInfo() {
            return {
                id: 'mistfetch',
                name: 'Mist请求',
                color1: "#6fa6eb",
                blocks: [
                    {
                        opcode: 'fetchUrlWithId',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '以[method]方法请求[URL]，ID为[ID]，头部[headers]，主体[body]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            },
                            headers: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            },
                            method: {
                                menu: "METHODS"
                            },
                            body: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            }
                        }
                    },
                    {
                        opcode: 'fetchUrlWithIdReporter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '以[method]方法请求[URL]，ID为[ID]，头部[headers]，主体[body]并等待',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            },
                            headers: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            },
                            method: {
                                menu: "METHODS"
                            },
                            body: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            }
                        }
                    },
                    {
                        opcode: 'getBytesById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ID为[ID]的请求已下载字节数',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'getResponseBodyById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ID为[ID]的请求响应主体',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'getInfoById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ID为[ID]的请求的[INFO]',
                        arguments: {
                            INFO: {
                                menu: "INFO"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'getHeadersById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ID为[ID]的请求响应头部',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'isRequestCompleted',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'ID为[ID]的请求已完成？',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'deleteRequestById',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '删除ID为[ID]的请求',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'deleteAllRequests',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '删除所有请求',
                    },
                    {
                        opcode: 'cancelRequestById',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '取消ID为[ID]的请求',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'whenIdRequestCompleted',
                        blockType: Scratch.BlockType.EVENT,
                        text: '当ID为[ID]的请求完成时',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '请求1'
                            }
                        }
                    },
                    {
                        opcode: 'inProgress',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '所有进行中的请求',
                    },
                    {
                        opcode: 'all',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '完整请求对象',
                    }
                ],
                menus: {
                    METHODS: {
                        acceptReporters: true,
                        items: ["GET", "POST", "HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "PATCH", "PURGE"]
                    },
                    INFO: {
                        acceptReporters: true,
                        items: ["百分比", "状态码", "URL", "JSON数据", "方法"]
                    }
                },
            };
        }

        // 将值转换为字符串（对象则序列化为JSON）
        stringify(value) {
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return value;
        }

        // 发送带ID的请求（命令块，不等待）
        fetchUrlWithId({ URL, ID, headers, method, body }) {
            ID = Cast.toString(ID)
            URL = Cast.toString(URL)

            // 如果该ID的请求已存在，则不重复创建
            if (this.requests[ID]) {
                return '';
            }

            let parsedHeaders = {}; // 解析后的请求头部
            let parsedBody = null;  // 解析后的请求主体

            // 解析请求头部（JSON格式）
            if (headers) {
                try {
                    parsedHeaders = JSON.parse(Cast.toString(headers));
                } catch (e) {
                    return `错误：${e.message}`;
                }
            }

            // 解析请求主体（JSON格式）
            if (body) {
                try {
                    parsedBody = JSON.parse(Cast.toString(body));
                } catch (e) {
                    return `错误：${e.message}`;
                }
            }

            // 处理请求方法（默认GET）
            method = method ? Cast.toString(method).toUpperCase() : 'GET';

            // 创建请求控制器（用于取消请求）
            const controller = new AbortController();
            const signal = controller.signal;

            // 初始化请求信息
            this.requests[ID] = { 
                totalBytes: 0,       // 已下载字节数
                response: '',        // 响应内容
                status: 0,           // 状态码
                completed: false,    // 是否完成
                contentLength: 0,    // 内容总长度
                url: URL,            // 请求URL
                controller: controller // 控制器
            };

            // 构建fetch配置
            const fetchOptions = {
                method: method,
                headers: parsedHeaders,
                // GET/HEAD方法不发送主体
                body: method !== 'GET' && method !== 'HEAD' ? this.stringify(parsedBody) : null,
                signal: signal
            };

            // 发送请求
            fetch(URL, fetchOptions)
                .then(response => {
                    // 记录响应状态信息
                    this.requests[ID].status = response.status;
                    this.requests[ID].contentLength = parseInt(response.headers.get('Content-Length'), 10) || 0;
                    this.requests[ID].headers = response.headers;
                    
                    // 获取响应文本内容
                    return response.text();
                })
                .then(text => {
                    // 更新请求结果
                    this.requests[ID].response = text;
                    this.requests[ID].totalBytes = text.length;
                    this.requests[ID].completed = true;
                    // 触发完成事件
                    Scratch.vm.runtime.startHats('mistfetch_whenIdRequestCompleted', { ID: Cast.toString(ID) });
                })
                .catch(error => {
                    // 处理错误
                    if (error.name === 'AbortError') {
                        this.requests[ID].error = '请求已取消';
                    } else {
                        this.requests[ID].error = error.message;
                    }
                    this.requests[ID].completed = true;
                });
        }

        // 发送带ID的请求（ reporters块，等待结果）
        async fetchUrlWithIdReporter({ URL, ID, headers, method, body }) {
            ID = Cast.toString(ID)
            URL = Cast.toString(URL)

            // 如果请求已存在，先取消并删除
            if (this.requests[ID]) {
                this.requests[ID].controller.abort();
                delete this.requests[ID];
            }

            let parsedHeaders = {};
            let parsedBody = null;

            // 解析请求头部
            if (headers) {
                try {
                    parsedHeaders = JSON.parse(Cast.toString(headers));
                } catch (e) {
                    return `错误：${e.message}`;
                }
            }

            // 解析请求主体
            if (body) {
                try {
                    parsedBody = JSON.parse(Cast.toString(body));
                } catch (e) {
                    return `错误：${e.message}`;
                }
            }

            // 处理请求方法
            method = method ? Cast.toString(method).toUpperCase() : 'GET';

            // 创建控制器
            const controller = new AbortController();
            const signal = controller.signal;

            // 初始化请求信息
            this.requests[ID] = { 
                totalBytes: 0, 
                response: '', 
                status: 0, 
                completed: false, 
                contentLength: 0, 
                url: URL, 
                controller: controller 
            };

            // 构建fetch配置
            const fetchOptions = {
                method: method,
                headers: parsedHeaders,
                body: method !== 'GET' && method !== 'HEAD' ? this.stringify(parsedBody) : null,
                signal: signal
            };

            try {
                // 发送请求并等待结果
                const response = await fetch(URL, fetchOptions);
                this.requests[ID].status = response.status;
                this.requests[ID].contentLength = parseInt(response.headers.get('Content-Length'), 10) || 0;
                this.requests[ID].headers = response.headers;
                
                // 获取响应文本
                const text = await response.text();
                this.requests[ID].response = text;
                this.requests[ID].totalBytes = text.length;
                this.requests[ID].completed = true;
                
                // 返回结果后删除请求对象
                const tempresp = this.requests[ID].response;
                delete this.requests[ID];
                return tempresp;
            } catch (error) {
                // 处理错误
                if (error.name === 'AbortError') {
                    this.requests[ID].error = '请求已取消';
                } else {
                    this.requests[ID].error = error.message;
                }
                this.requests[ID].completed = true;
                
                const errorMsg = `错误：${error.message}`;
                delete this.requests[ID];
                return errorMsg;
            }
        }

        // 获取指定ID请求的已下载字节数
        getBytesById({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID]) {
                if (this.requests[ID].error) {
                    return `错误：${this.requests[ID].error}`;
                }
                return this.requests[ID].totalBytes;
            }
            return '';
        }

        // 获取指定ID请求的响应主体
        getResponseBodyById({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID]) {
                if (this.requests[ID].error) {
                    return `错误：${this.requests[ID].error}`;
                }
                return this.requests[ID].response;
            }
            return '';
        }

        // 检查指定ID的请求是否已完成
        isRequestCompleted({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID]) {
                return this.requests[ID].completed;
            }
            return false;
        }

        // 删除指定ID的请求
        deleteRequestById({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID]) {
                this.requests[ID].controller.abort();
                delete this.requests[ID];
            }
        }

        // 删除所有请求
        deleteAllRequests() {
            for (const ID in this.requests) {
                this.requests[ID].controller.abort();
            }
            this.requests = {};
        }

        // 取消指定ID的请求
        cancelRequestById({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID]) {
                this.requests[ID].controller.abort();
                this.requests[ID].completed = true;
            }
        }

        // 检查请求完成事件是否触发
        whenIdRequestCompleted({ ID }) {
            ID = Cast.toString(ID)

            if (this.requests[ID] && this.requests[ID].completed) {
                return true;
            }
            return false;
        }

        // 获取所有进行中的请求
        inProgress() {
            return JSON.stringify(Object.keys(this.requests));
        }

        // 获取指定ID请求的信息
        getInfoById({ INFO, ID }) {
            ID = Cast.toString(ID)

            if (!this.requests[ID]) return '';
            if (this.requests[ID].error) return `错误：${this.requests[ID].error}`;

            const request = this.requests[ID];
            switch (Cast.toString(INFO)) {
                case "百分比":
                    if (request.contentLength > 0) {
                        return (request.totalBytes / request.contentLength) * 100;
                    }
                    return 0;
                case "状态码":
                    return request.status ?? 0;
                case "URL":
                    return request.url ?? "";
                case "JSON数据":
                    return JSON.stringify(request);
                case "方法":
                    return request.method ?? "";
            }
            return '';
        }

        // 获取指定ID请求的响应头部
        getHeadersById({ ID }) {
            ID = Cast.toString(ID)

            if (!this.requests[ID]) return '';

            if (this.requests[ID].error) {
                return `错误：${this.requests[ID].error}`;
            }
            
            // 将Headers对象转换为普通对象
            const headersObj = {};
            if (this.requests[ID].headers) {
                this.requests[ID].headers.forEach((value, key) => {
                    headersObj[key] = value;
                });
            }
            return JSON.stringify(headersObj);
        }

        // 获取所有请求的完整信息
        all() {
            return JSON.stringify(this.requests);
        }
    }

    // 注册扩展
    Scratch.extensions.register(new MistFetch());
})(Scratch);