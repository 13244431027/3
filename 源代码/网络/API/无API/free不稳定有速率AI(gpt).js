(function() {
    'use strict';
    
    const MODEL_LIST = [
        'openai', 'openai-large', 'qwen-coder', 'llama', 'llamascout', 
        'mistral', 'unity', 'midijourney', 'rtist', 'searchgpt',
        'evil', 'deepseek-reasoning', 'deepseek-reasoning-large', 'phi',
        'llama-vision', 'hormoz', 'deepseek', 'openai-audio'
    ];

    const RECOMMENDED_MODELS = MODEL_LIST.slice(0, 6);
    const STATE = {
        IDLE: 'idle',
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
    };

    class AIChatExtension {
        constructor() {
            this.resetState();
            this.contextEnabled = false;
            this.contextLimit = 3;
            this.conversationHistory = [];
            this.extensionDescription = '欢迎使用本扩展，本扩展由cy_studio制作，@秋辰_Autumnstar。本扩展还存在一些问题，欢迎向我反馈。建议使用前6个模型，错误概率较低。';
        }
        
        getInfo() {
            const info = {
                id: 'aiChat',
                name: 'AI 对话 (cy_studio)',
                color1: '#4C97FF',
                color2: '#3373CC',
                blocks: [
                    {
                        opcode: 'setAIPrompt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置AI角色为 [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你是一个乐于助人的AI助手'
                            }
                        }
                    },
                    {
                        opcode: 'selectModel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '选择AI模型 [MODEL]',
                        arguments: {
                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MODEL_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'setContextEnabled',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置上下文对话 [ENABLED]',
                        arguments: {
                            ENABLED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TOGGLE_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'setContextLimit',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置上下文记忆轮数 [LIMIT]',
                        arguments: {
                            LIMIT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '3'
                            }
                        }
                    },
                    {
                        opcode: 'clearConversationHistory',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清空对话历史'
                    },
                    {
                        opcode: 'askAI',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '向AI提问 [QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你好'
                            }
                        }
                    },
                    {
                        opcode: 'clearCurrentResponse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '清除当前AI回复'
                    },
                    {
                        opcode: 'getResponse',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'AI回复内容'
                    },
                    {
                        opcode: 'isLoading',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '正在加载中?'
                    },
                    {
                        opcode: 'getLastError',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取最后错误信息'
                    },
                    {
                        opcode: 'resetAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '重置所有设置和对话'
                    },
                    {
                        opcode: 'getContextStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '上下文状态'
                    },
                    {
                        opcode: 'getConversationCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当前对话轮数'
                    },
                    {
                        opcode: 'getModelStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当前模型状态'
                    }
                ],
                menus: {
                    MODEL_MENU: {
                        items: MODEL_LIST.map(model => ({
                            text: `${model}${RECOMMENDED_MODELS.includes(model) ? ' (推荐)' : ''}`,
                            value: model
                        }))
                    },
                    TOGGLE_MENU: {
                        items: [
                            { text: '开启', value: 'true' },
                            { text: '关闭', value: 'false' }
                        ]
                    }
                }
            };

            info.description = this.extensionDescription;
            info.showStatusButton = true;
            
            return info;
        }
        
        resetState() {
            this.promptPrefix = '';
            this.selectedModel = 'openai';
            this.lastResponse = '';
            this.lastError = null;
            this.state = STATE.IDLE;
            this.requestAbortController = null;
        }
        
        setAIPrompt(args) {
            this.promptPrefix = String(args.PROMPT || '').trim();
        }
        
        selectModel(args) {
            const model = String(args.MODEL || 'openai');
            this.selectedModel = MODEL_LIST.includes(model) ? model : 'openai';
        }
        
        setContextEnabled(args) {
            this.contextEnabled = args.ENABLED === 'true';
            if (!this.contextEnabled) {
                this.clearConversationHistory();
            }
        }
        
        setContextLimit(args) {
            const limit = Math.max(1, parseInt(args.LIMIT) || 3);
            this.contextLimit = limit;
            this._trimConversationHistory();
        }
        
        clearConversationHistory() {
            this.conversationHistory = [];
        }
        
        askAI(args) {
            if (this.state === STATE.LOADING && this.requestAbortController) {
                this.requestAbortController.abort();
            }
            
            const question = String(args.QUESTION || '').trim();
            if (!question) {
                this.lastError = '问题不能为空';
                this.state = STATE.ERROR;
                return;
            }
            
            if (!RECOMMENDED_MODELS.includes(this.selectedModel)) {
                console.warn(`使用非推荐模型: ${this.selectedModel}`);
            }
            
            this._sendRequest(question);
        }
        
        clearCurrentResponse() {
            this.lastResponse = '';
            this.lastError = null;
            this.state = STATE.IDLE;
        }
        
        getResponse() {
            return this.state === STATE.SUCCESS ? this.lastResponse : '';
        }
        
        getLastError() {
            return this.lastError || '无错误';
        }
        
        isLoading() {
            return this.state === STATE.LOADING;
        }
        
        resetAll() {
            this.resetState();
            this.contextEnabled = false;
            this.contextLimit = 3;
            this.clearConversationHistory();
        }
        
        getContextStatus() {
            return `上下文: ${this.contextEnabled ? '开启' : '关闭'} | 记忆: ${this.contextLimit}轮 | 当前: ${this.conversationHistory.length}轮`;
        }
        
        getConversationCount() {
            return this.conversationHistory.length;
        }
        
        getModelStatus() {
            const isRecommended = RECOMMENDED_MODELS.includes(this.selectedModel);
            return `模型: ${this.selectedModel}${isRecommended ? ' (推荐)' : ' (非推荐)'}`;
        }
        
        async _sendRequest(question) {
            this.state = STATE.LOADING;
            this.lastError = null;
            this.requestAbortController = new AbortController();
            
            try {
                let fullPrompt = this.promptPrefix ? `${this.promptPrefix}\n` : '';
                
                if (this.contextEnabled && this.conversationHistory.length > 0) {
                    fullPrompt += "对话上下文:\n";
                    this.conversationHistory.forEach(item => {
                        fullPrompt += `你: ${item.question}\nAI: ${item.response}\n`;
                    });
                    fullPrompt += "\n新问题:\n";
                }
                
                fullPrompt += question;
                
                const randomNum = Math.floor(Math.random() * 20) - 10;
                const encodedPrompt = encodeURIComponent(fullPrompt);
                const url = new URL(`https://text.pollinations.ai/${encodedPrompt}`);
                url.searchParams.set('model', this.selectedModel);
                url.searchParams.set('send', randomNum);
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('请求超时 (10秒)')), 10000));
                
                const fetchPromise = fetch(url.toString(), {
                    signal: this.requestAbortController.signal,
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'text/plain'
                    }
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                
                if (!response.ok) {
                    throw new Error(`请求失败: ${response.status}`);
                }
                
                const data = await response.text();
                
                if (this.contextEnabled) {
                    this.conversationHistory.push({
                        question: question,
                        response: data
                    });
                    this._trimConversationHistory();
                }
                
                this.lastResponse = data;
                this.state = STATE.SUCCESS;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('AI请求错误:', error);
                    this.lastError = error.message;
                    this.state = STATE.ERROR;
                }
            } finally {
                this.requestAbortController = null;
            }
        }
        
        _trimConversationHistory() {
            if (this.conversationHistory.length > this.contextLimit) {
                this.conversationHistory = this.conversationHistory.slice(
                    -this.contextLimit
                );
            }
        }
    }
    
    if (typeof Scratch !== 'undefined' && Scratch.extensions) {
        try {
            const extension = new AIChatExtension();
            Scratch.extensions.register(extension);
            console.log('%c' + extension.extensionDescription, 'color: #4C97FF; font-weight: bold');
            console.log('%c推荐模型: ' + RECOMMENDED_MODELS.join(', '), 'color: #4C97FF');
        } catch (error) {
            console.error('扩展注册失败:', error);
        }
    } else {
        console.error('Scratch环境未找到，扩展无法注册');
    }
})();