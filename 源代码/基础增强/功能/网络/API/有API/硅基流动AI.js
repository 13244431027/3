(function(Scratch) {
  'use strict';
  
  class SiliconFlowAI {
    constructor() {
      this.apiKey = '';
      this.lastResponse = '';
      this._isRequesting = false;
      this.lastError = '';
      this.reasoningContent = '';
    }
    
    getInfo() {
      return {
        id: 'siliconflowaimodels',
        name: '硅基流动AI',
        color1: '#4C6EF5',
        color2: '#3B5BDB',
        blocks: [
          {
            opcode: 'setAPIKey',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置API密钥: [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'sk-您的API密钥'
              }
            }
          },
          {
            opcode: 'askAI',
            blockType: Scratch.BlockType.COMMAND,
            text: '使用模型 [MODEL] 提问: [PROMPT]',
            arguments: {
              MODEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'models',
                defaultValue: 'deepseek-ai/DeepSeek-V3'
              },
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好，你是谁？'
              }
            }
          },
          {
            opcode: 'getResponse',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取AI回答'
          },
          {
            opcode: 'getReasoning',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取思考过程'
          },
          {
            opcode: 'getError',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取错误信息'
          },
          {
            opcode: 'isRequesting',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '正在请求中？'
          }
        ],
        menus: {
          models: {
            acceptReporters: true,
            items: [
              // DeepSeek 系列
              'deepseek-ai/DeepSeek-V3',
              'deepseek-ai/DeepSeek-V3.1',
              'deepseek-ai/DeepSeek-R1',
              'deepseek-ai/DeepSeek-Coder-V2',
              
              // Moonshot AI 系列
              'moonshotai/Kimi-K2-Instruct',
              
              // 百度系列
              'baidu/ERNIE-4.5-300B-A47B',
              
              // 腾讯系列
              'tencent/Hunyuan-A13B-Instruct',
              
              // Qwen 系列
              'qwen/qwen-2-72b-instruct',
              'qwen/qwen-2-7b-instruct',
              
              // 其他模型
              'chatglm3-6b',
              'kimi',
              
              // 新增免费模型
              'ByteDance-Seed/Seed-OSS-36B-Instruct',
              'stepfun-ai/step3',
              'Qwen/Qwen3-Coder-30B-A3B-Instruct',
              'Qwen/Qwen3-Coder-480B-A35B-Instruct',
              'Qwen/Qwen3-30B-A3B-Thinking-2507',
              'Qwen/Qwen3-30B-A3B-Instruct-2507',
              'Qwen/Qwen3-235B-A22B-Thinking-2507',
              'Qwen/Qwen3-235B-A22B-Instruct-2507',
              'zai-org/GLM-4.5-Air',
              'zai-org/GLM-4.5',
              'ascend-tribe/pangu-pro-moe',
              'MiniMaxAI/MiniMax-M1-80k',
              'Tongyi-Zhiwen/QwenLong-L1-32B',
              'Qwen/Qwen3-30B-A3B',
              'Qwen/Qwen3-32B',
              'Qwen/Qwen3-14B',
              'Qwen/Qwen3-8B',
              'Qwen/Qwen3-235B-A22B',
              'THUDM/GLM-Z1-32B-0414',
              'THUDM/GLM-4-32B-0414',
              'THUDM/GLM-Z1-Rumination-32B-0414',
              'THUDM/GLM-4-9B-0414',
              'Qwen/QwQ-32B',
              'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
              'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
              'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
              'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
              'deepseek-ai/DeepSeek-V2.5',
              'Qwen/Qwen2.5-72B-Instruct-128K',
              'Qwen/Qwen2.5-72B-Instruct',
              'Qwen/Qwen2.5-32B-Instruct',
              'Qwen/Qwen2.5-14B-Instruct',
              'Qwen/Qwen2.5-7B-Instruct',
              'Qwen/Qwen2.5-Coder-32B-Instruct',
              'Qwen/Qwen2.5-Coder-7B-Instruct',
              'Qwen/Qwen2-7B-Instruct',
              'TeleAI/TeleChat2',
              'THUDM/glm-4-9b-chat',
              'internlm/internlm2_5-7b-chat'
            ]
          }
        }
      };
    }
    
    setAPIKey(args) {
      this.apiKey = args.KEY.trim();
    }
    
    async askAI(args) {
      if (this._isRequesting) return;
      
      this._isRequesting = true;
      this.lastError = '';
      
      try {
        const model = args.MODEL;
        const prompt = args.PROMPT;
        
        if (!this.apiKey) {
          throw new Error('请先设置API密钥');
        }
        
        const response = await Scratch.fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            stream: false
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 存储回答和思考过程
        this.lastResponse = data.choices[0]?.message?.content || '未获取到回答';
        
        // 尝试获取思考过程（如果API返回）
        if (data.choices[0]?.message?.reasoning_content) {
          this.reasoningContent = data.choices[0].message.reasoning_content;
        } else {
          this.reasoningContent = '此模型未提供思考过程';
        }
        
      } catch (error) {
        console.error('AI请求错误:', error);
        this.lastError = error.message;
      } finally {
        this._isRequesting = false;
      }
    }
    
    getResponse() {
      return this.lastResponse;
    }
    
    getReasoning() {
      return this.reasoningContent || '无思考过程';
    }
    
    getError() {
      return this.lastError;
    }
    
    isRequesting() {
      return this._isRequesting;
    }
  }
  
  // Turbowarp兼容性检测
  if (typeof Scratch !== 'undefined' && typeof Scratch.extensions !== 'undefined') {
    Scratch.extensions.register(new SiliconFlowAI());
  } else {
    console.error('无法在非Turbowarp环境中加载扩展');
  }
})(Scratch);