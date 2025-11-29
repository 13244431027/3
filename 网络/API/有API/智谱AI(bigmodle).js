(function(Scratch) {
    'use strict';

    class ZhipuAIExtension {
        constructor() {
            this.apiKey = '';
            this.model = 'glm-4';
            this.temperature = 0.7;
            this.maxTokens = 1024;
            this.conversationHistory = [];
            this.lastResponse = '';
            this.isStreaming = false;
            this.streamBuffer = '';
            this.responseCache = new Map();
            this.customPrompt = '';
            this.streamAbortController = null;
            this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        }

        getInfo() {
            return {
                id: 'zhipuaiextension',
                name: '智谱AI',
                color1: '#3B82F6',
                color2: '#2563EB',
                color3: '#1D4ED8',
                blocks: [
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置API密钥: [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'setModel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置模型: [MODEL]',
                        arguments: {
                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'models'
                            }
                        }
                    },
                    {
                        opcode: 'setTemperature',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置温度: [TEMP]',
                        arguments: {
                            TEMP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.7
                            }
                        }
                    },
                    {
                        opcode: 'setMaxTokens',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置最大token数: [TOKENS]',
                        arguments: {
                            TOKENS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1024
                            }
                        }
                    },
                    {
                        opcode: 'setCustomPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置系统提示: [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你是一个乐于助人的助手'
                            }
                        }
                    },
                    {
                        opcode: 'askQuestion',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '提问: [QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你好吗？'
                            }
                        }
                    },
                    {
                        opcode: 'askQuestionStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '流式提问: [QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你好吗？'
                            }
                        }
                    },
                    {
                        opcode: 'getStreamedResponse',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取流式响应'
                    },
                    {
                        opcode: 'isStreamingNow',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '正在流式响应？'
                    },
                    {
                        opcode: 'getLastResponse',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取最后响应'
                    },
                    {
                        opcode: 'clearHistory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清除对话历史'
                    },
                    {
                        opcode: 'addToHistory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '添加对话: 角色[ROLE] 内容[CONTENT]',
                        arguments: {
                            ROLE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'roles'
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '内容'
                            }
                        }
                    },
                    {
                        opcode: 'getHistoryLength',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '对话历史长度'
                    },
                    {
                        opcode: 'getHistoryItem',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取对话历史项 [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'cacheResponse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '缓存响应: 键[KEY] 值[VALUE]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'value'
                            }
                        }
                    },
                    {
                        opcode: 'getCachedResponse',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取缓存响应: [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            }
                        }
                    },
                    {
                        opcode: 'clearCache',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清除所有缓存'
                    },
                    {
                        opcode: 'simulateThinking',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '模拟思考 [SECONDS] 秒',
                        arguments: {
                            SECONDS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        opcode: 'createJsonRequest',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '创建JSON请求: 问题[QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你好'
                            }
                        }
                    },
                    {
                        opcode: 'parseJsonResponse',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '解析JSON响应: [JSON]',
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"choices":[{"message":{"content":"你好！"}}]}'
                            }
                        }
                    }
                ],
                menus: {
                    roles: {
                        acceptReporters: true,
                        items: ['system', 'user', 'assistant']
                    },
                    models: {
                        acceptReporters: true,
                        items: ['glm-4', 'glm-4v', 'glm-3-turbo', 'characterglm', 'embedding-2']
                    }
                }
            };
        }

        setApiKey(args) {
            this.apiKey = args.KEY;
        }

        setModel(args) {
            this.model = args.MODEL;
        }

        setTemperature(args) {
            this.temperature = Math.max(0, Math.min(1, Number(args.TEMP)));
        }

        setMaxTokens(args) {
            this.maxTokens = Math.max(1, Math.min(4096, Number(args.TOKENS)));
        }

        setCustomPrompt(args) {
            this.customPrompt = args.PROMPT;
        }

        clearHistory() {
            this.conversationHistory = [];
            if (this.customPrompt) {
                this.conversationHistory.push({
                    role: 'system',
                    content: this.customPrompt
                });
            }
        }

        addToHistory(args) {
            const role = args.ROLE;
            const content = args.CONTENT;
            
            if (['system', 'user', 'assistant'].includes(role)) {
                this.conversationHistory.push({ role, content });
            }
        }

        getHistoryLength() {
            return this.conversationHistory.length;
        }

        getHistoryItem(args) {
            const index = Math.max(1, Math.min(this.conversationHistory.length, Number(args.INDEX))) - 1;
            const item = this.conversationHistory[index];
            return `${item.role}: ${item.content}`;
        }

        cacheResponse(args) {
            this.responseCache.set(args.KEY, args.VALUE);
        }

        getCachedResponse(args) {
            return this.responseCache.get(args.KEY) || '';
        }

        clearCache() {
            this.responseCache.clear();
        }

        isStreamingNow() {
            return this.isStreaming;
        }

        getStreamedResponse() {
            return this.streamBuffer;
        }

        getLastResponse() {
            return this.lastResponse;
        }

        simulateThinking(args) {
            const seconds = Math.max(0.1, Math.min(10, Number(args.SECONDS)));
            const start = Date.now();
            while (Date.now() - start < seconds * 1000) {
                // 阻塞主线程模拟思考
            }
        }

        createJsonRequest(args) {
            const question = args.QUESTION;
            const requestData = {
                model: this.model,
                messages: [
                    ...this.conversationHistory,
                    { role: 'user', content: question }
                ],
                temperature: this.temperature,
                max_tokens: this.maxTokens
            };
            return JSON.stringify(requestData);
        }

        parseJsonResponse(args) {
            try {
                const jsonData = JSON.parse(args.JSON);
                return jsonData.choices[0].message.content;
            } catch (e) {
                return '解析JSON出错';
            }
        }

        async askQuestion(args) {
            const question = args.QUESTION;
            
            if (!this.apiKey) {
                return '错误：请先设置API密钥';
            }
            
            // 检查缓存
            if (this.responseCache.has(question)) {
                this.lastResponse = this.responseCache.get(question);
                return this.lastResponse;
            }
            
            // 添加到对话历史
            this.conversationHistory.push({
                role: 'user',
                content: question
            });
            
            try {
                const response = await this._sendApiRequest();
                const answer = response.choices[0].message.content;
                
                // 添加到对话历史
                this.conversationHistory.push({
                    role: 'assistant',
                    content: answer
                });
                
                this.lastResponse = answer;
                return answer;
            } catch (error) {
                return `错误：${error.message}`;
            }
        }

        askQuestionStream(args) {
            const question = args.QUESTION;
            
            if (!this.apiKey) {
                this.lastResponse = '错误：请先设置API密钥';
                return;
            }
            
            if (this.isStreaming) {
                this._abortStream();
            }
            
            // 添加到对话历史
            this.conversationHistory.push({
                role: 'user',
                content: question
            });
            
            this.isStreaming = true;
            this.streamBuffer = '';
            this.streamAbortController = new AbortController();
            
            this._streamApiRequest()
                .then(() => {
                    this.isStreaming = false;
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: this.streamBuffer
                    });
                    this.lastResponse = this.streamBuffer;
                })
                .catch(error => {
                    this.isStreaming = false;
                    this.streamBuffer = `错误：${error.message}`;
                });
        }

        _abortStream() {
            if (this.streamAbortController) {
                this.streamAbortController.abort();
            }
            this.isStreaming = false;
        }

        async _sendApiRequest() {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: this.conversationHistory,
                    temperature: this.temperature,
                    max_tokens: this.maxTokens
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
            }
            
            return response.json();
        }

        async _streamApiRequest() {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: this.conversationHistory,
                    temperature: this.temperature,
                    max_tokens: this.maxTokens,
                    stream: true
                }),
                signal: this.streamAbortController.signal
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const token = json.choices[0].delta.content;
                            if (token) {
                                this.streamBuffer += token;
                                // 触发更新事件
                                if (Scratch.vm && Scratch.vm.runtime) {
                                    Scratch.vm.runtime.startHats('zhipuaiextension_whenStreamUpdate');
                                }
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }
        }
    }

    // 注册扩展
    Scratch.extensions.register(new ZhipuAIExtension());
})(Scratch);