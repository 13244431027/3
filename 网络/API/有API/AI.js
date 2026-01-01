(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('请取消此扩展的沙箱限制以使其正常工作。');
  }

  class AIExtension {
    constructor() {
      // API配置 - 基础密钥（可被用户自定义密钥覆盖）
      this.apiUrl = "https://api.siliconflow.cn/v1/chat/completions";
      this.defaultApiKey = "sk-dkfljmqzdwmxglfyxpdtmnsbsphilsrxgndpsazpkwqnkqyr";
      this.currentApiKey = this.defaultApiKey; // 当前使用的密钥
      this.userApiKey = ""; // 用户自定义密钥
      
      // 新增：模型水印功能
      this.showModelWatermark = true; // 是否显示模型水印
      this.watermarkStyle = "color: #6c757d; font-size: 0.8em; font-style: italic; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #dee2e6;";
      this.watermarkPrefix = "由"; // 水印前缀
      this.watermarkSuffix = "生成"; // 水印后缀
      
      // ImgBB API配置
      this.imgbbApiKey = "b5dbb07296d9d258e17b901f9171ef67";
      this.imgbbApiUrl = "https://api.imgbb.com/1/upload";
      
      // 当前使用的模型
      this.currentModel = "deepseek-ai/DeepSeek-R1"; // 默认模型
      
      // 推理模型列表（支持thinking_budget参数）
      this.reasoningModels = [
        "deepseek-ai/DeepSeek-R1",
        "Qwen/Qwen3-Next-80B-A3B-Thinking",
        "Qwen/Qwen3-Next-80B-A3B-Instruct",
        "Qwen/Qwen3-VL-235B-A22B-Thinking",
        "moonshotai/Kimi-K2-Thinking",
        "moonshotai/Kimi-Dev-72B",
        "THUDM/GLM-Z1-Rumination-32B-0414",
        "Qwen/Qwen3-30B-A3B-Thinking-2507",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"
      ];
      
      // 可用的模型列表
      this.availableModels = [
        // 原有模型
        "deepseek-ai/DeepSeek-R1",
        "Qwen/Qwen2.5-72B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct-128K",
        "Qwen/Qwen2-VL-72B-Instruct",
        "Qwen/QVQ-72B-Preview",
        "Qwen/Qwen2.5-VL-72B-Instruct",
        "tencent/Hunyuan-A13B-Instruct",
        "inclusionAI/Ling-flash-2.0",
        "inclusionAI/Ring-flash-2.0",
        "Qwen/Qwen3-Next-80B-A3B-Thinking",
        "Qwen/Qwen3-Next-80B-A3B-Instruct",
        "MiniMaxAI/MiniMax-M2",
        "zai-org/GLM-4.6",
        "Qwen/Qwen3-VL-235B-A22B-Thinking",
        "zai-org/GLM-4.5V",
        "zai-org/GLM-4.5-Air",
        "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        "moonshotai/Kimi-Dev-72B",
        "MiniMaxAI/MiniMax-M1-80k",
        "zai-org/GLM-4.5",
        "internlm/internlm2_5-7b-chat",
        "baidu/ERNIE-4.5-300B-A47B",
        "tencent/Hunyuan-MT-7B",
        "moonshotai/Kimi-K2-Thinking",
        "deepseek-ai/DeepSeek-V3.2",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        
        // 新增模型
        "ByteDance-Seed/Seed-OSS-36B-Instruct",
        "THUDM/GLM-4-9B-0414",
        "THUDM/GLM-4.1V-9B-Thinking",
        "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
        "THUDM/GLM-Z1-9B-0414",
        "Qwen/Qwen2.5-7B-Instruct",
        "Qwen/Qwen2.5-Coder-7B-Instruct",
        "Qwen/Qwen2-7B-Instruct",
        "Qwen/Qwen3-8B",
        "THUDM/GLM-Z1-Rumination-32B-0414",
        "Qwen/Qwen2.5-14B-Instruct",
        "Qwen/Qwen2.5-32B-Instruct",
        "deepseek-ai/deepseek-vl2",
        "Qwen/Qwen2.5-Coder-32B-Instruct",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        "Qwen/Qwen2.5-VL-32B-Instruct",
        "THUDM/GLM-4-32B-0414",
        "THUDM/GLM-Z1-32B-0414",
        "Qwen/Qwen3-14B",
        "Qwen/Qwen3-30B-A3B",
        "Qwen/Qwen3-30B-A3B-Instruct-2507",
        "Qwen/Qwen3-30B-A3B-Thinking-2507",
        "Qwen/Qwen3-Coder-30B-A3B-Instruct",
        
        // 新增的DeepSeek-OCR模型
        "deepseek-ai/DeepSeek-OCR"
      ];
      
      // 按类别组织模型
      this.modelCategories = {
        "旗舰推理模型": [
          "deepseek-ai/DeepSeek-R1",
          "Qwen/Qwen3-VL-235B-A22B-Thinking",
          "MiniMaxAI/MiniMax-M2",
          "baidu/ERNIE-4.5-300B-A47B",
          "zai-org/GLM-4.6"
        ],
        "大参数模型(30B+)": [
          "Qwen/Qwen2.5-72B-Instruct",
          "Qwen/Qwen2.5-72B-Instruct-128K",
          "Qwen/QVQ-72B-Preview",
          "tencent/Hunyuan-A13B-Instruct",
          "ByteDance-Seed/Seed-OSS-36B-Instruct",
          "THUDM/GLM-Z1-Rumination-32B-0414",
          "Qwen/Qwen2.5-32B-Instruct",
          "Qwen/Qwen2.5-Coder-32B-Instruct",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
          "THUDM/GLM-4-32B-0414",
          "THUDM/GLM-Z1-32B-0414",
          "Qwen/Qwen3-30B-A3B",
          "Qwen/Qwen3-30B-A3B-Instruct-2507",
          "Qwen/Qwen3-30B-A3B-Thinking-2507",
          "Qwen/Qwen3-Coder-30B-A3B-Instruct",
          "moonshotai/Kimi-Dev-72B"
        ],
        "中参数模型(10B-30B)": [
          "Qwen/Qwen2.5-14B-Instruct",
          "Qwen/Qwen3-14B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
          "Qwen/Qwen2.5-VL-32B-Instruct"
        ],
        "小参数模型(<10B)": [
          "Qwen/Qwen2.5-7B-Instruct",
          "Qwen/Qwen2.5-Coder-7B-Instruct",
          "Qwen/Qwen2-7B-Instruct",
          "Qwen/Qwen3-8B",
          "internlm/internlm2_5-7b-chat",
          "tencent/Hunyuan-MT-7B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
          "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
          "THUDM/GLM-4-9B-0414",
          "THUDM/GLM-Z1-9B-0414",
          "zai-org/GLM-4.5-Air"
        ],
        "多模态模型": [
          "Qwen/Qwen2-VL-72B-Instruct",
          "Qwen/Qwen2.5-VL-72B-Instruct",
          "deepseek-ai/deepseek-vl2",
          "Qwen/Qwen2.5-VL-32B-Instruct",
          "Qwen/Qwen3-VL-235B-A22B-Thinking",
          "deepseek-ai/DeepSeek-OCR"
        ],
        "思维链/推理模型": [
          "deepseek-ai/DeepSeek-R1",
          "baidu/ERNIE-4.5-300B-A47B",
          "zai-org/GLM-4.6",
          "moonshotai/Kimi-K2-Thinking",
          "THUDM/GLM-Z1-Rumination-32B-0414",
          "Qwen/Qwen3-30B-A3B-Thinking-2507",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
          "THUDM/GLM-4.1V-9B-Thinking"
        ],
        "代码专用模型": [
          "Qwen/Qwen3-Coder-480B-A35B-Instruct",
          "Qwen/Qwen2.5-Coder-7B-Instruct",
          "Qwen/Qwen2.5-Coder-32B-Instruct",
          "Qwen/Qwen3-Coder-30B-A3B-Instruct"
        ],
        "快速推理模型": [
          "inclusionAI/Ling-flash-2.0",
          "inclusionAI/Ring-flash-2.0",
          "zai-org/GLM-4.5-Air",
          "MiniMaxAI/MiniMax-M1-80k"
        ],
        "标准对话模型": [
          "zai-org/GLM-4.5",
          "deepseek-ai/DeepSeek-V3.2",
          "Qwen/Qwen2.5-7B-Instruct",
          "Qwen/Qwen2-7B-Instruct"
        ]
      };
      
      // 多模态模型列表
      this.multimodalModels = [
        "Qwen/Qwen2-VL-72B-Instruct",
        "Qwen/Qwen2.5-VL-72B-Instruct",
        "deepseek-ai/deepseek-vl2",
        "Qwen/Qwen2.5-VL-32B-Instruct",
        "Qwen/Qwen3-VL-235B-A22B-Thinking",
        "deepseek-ai/DeepSeek-OCR"
      ];
      
      // 模型介绍数据库（简化版）
      this.modelDescriptions = {
        "deepseek-ai/DeepSeek-V3.2": "DeepSeek-V3.2 是一款兼具高计算效率与卓越推理和 Agent 性能的模型...",
        "deepseek-ai/DeepSeek-R1": "DeepSeek-R1 是深度求索开发的强化学习推理模型，专门优化了数学、代码和逻辑推理能力，支持思维链推理。",
        "Qwen/Qwen2.5-72B-Instruct": "Qwen2.5-72B 是阿里通义千问系列的最新大模型，在代码、数学、推理等多个领域表现优异，支持128K上下文。",
        // 其他模型的简化描述...
      };
      
      // 计算总模型数量
      this.totalModels = this.availableModels.length;
      
      // 搜索相关变量
      this.searchQuery = '';
      this.filteredModels = [...this.availableModels];
      this.searchActive = false;
      
      // 图片相关变量
      this.currentImages = [];
      this.imageUploading = false;
      this.lastImageUploadResponse = null;
      this.maxImages = 4;
      
      // 基础参数设置
      this.temperature = 0.7;
      this.maxTokens = 1000;
      this.topP = 0.9;
      this.frequencyPenalty = 0.0;
      this.thinkingBudget = 1024;
      
      // 高级设置参数
      this.showReasoningContent = true;
      this.enableReasoning = true;
      this.customSystemPrompt = "你是一个友好、专业的AI助手。请用中文回答用户的问题，并根据问题类型提供详细、准确的回答。";
      this.maxHistoryLength = 10;
      this.enableStreaming = true;
      this.autoFormatMarkdown = true;
      this.autoFormatCode = true;
      
      // 对话历史
      this.conversationHistory = [];
      
      // UI元素引用
      this.panel = null;
      this.isPanelVisible = false;
      this.isStreaming = false;
      this.currentStreamController = null;
      this.isAdvancedSettingsVisible = false;
      
      // 后台回复状态管理
      this.pendingResponse = {
        isPending: false,
        fullResponse: '',
        fullReasoningResponse: '',
        currentDisplayed: '',
        currentReasoningDisplayed: '',
        model: '',
        messageId: null,
        bubble: null,
        messageDiv: null,
        streamReader: null,
        controller: null,
        startTime: null,
        isComplete: false
      };
      
      // 初始化UI
      this.initUI();
    }

    initUI() {
      // 创建控制按钮
      this.createControlButton();
      
      // 创建对话面板
      this.createPanel();
      
      // 添加全局样式
      this.addStyles();
      
      // 添加后台处理监听器
      this.setupBackgroundHandling();
    }

    setupBackgroundHandling() {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.pendingResponse.isPending) {
          this.resumePendingResponse();
        }
      });
    }

    resumePendingResponse() {
      if (!this.pendingResponse.isPending || this.pendingResponse.isComplete) {
        return;
      }
      
      if (this.isPanelVisible && this.pendingResponse.bubble) {
        this.updatePendingResponseDisplay();
      }
    }

    updatePendingResponseDisplay() {
      if (!this.pendingResponse.bubble || !this.pendingResponse.messageDiv) {
        return;
      }
      
      if (!document.body.contains(this.pendingResponse.messageDiv)) {
        this.messagesDiv.appendChild(this.pendingResponse.messageDiv);
      }
      
      if (this.showReasoningContent && this.pendingResponse.currentReasoningDisplayed) {
        this.updateMessage(
          this.pendingResponse.bubble, 
          this.pendingResponse.currentDisplayed, 
          this.pendingResponse.currentReasoningDisplayed
        );
      } else {
        this.updateMessage(this.pendingResponse.bubble, this.pendingResponse.currentDisplayed);
      }
      
      this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
      
      if (this.pendingResponse.isComplete) {
        this.finalizePendingResponse();
      }
    }

    finalizePendingResponse() {
      if (this.pendingResponse.isPending && this.pendingResponse.isComplete) {
        this.conversationHistory.push({ 
          role: 'assistant', 
          content: this.pendingResponse.fullResponse,
          ...(this.pendingResponse.fullReasoningResponse && { 
            reasoning_content: this.pendingResponse.fullReasoningResponse 
          })
        });
        
        this.pendingResponse.isPending = false;
        this.pendingResponse.streamReader = null;
        this.pendingResponse.controller = null;
        
        this.clearCurrentImages();
        
        if (this.isPanelVisible) {
          this.stopStreaming();
        }
      }
    }

    createControlButton() {
      const controlPanel = document.querySelector('[class*="controls-container"]') || 
                          document.querySelector('.controls_controls-container_2xinB');
      
      if (!controlPanel) {
        console.warn("找不到控制面板容器，将在1秒后重试");
        setTimeout(() => this.createControlButton(), 1000);
        return;
      }

      this.aiButton = document.createElement('button');
      this.aiButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          <path d="M12 8v8" stroke-width="3"></path>
          <path d="M8 12h8" stroke-width="3"></path>
        </svg>
      `;
      this.aiButton.title = `打开AI对话面板 - 支持${this.totalModels}个模型`;
      this.aiButton.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
      `;
      
      const badge = document.createElement('span');
      badge.textContent = this.totalModels.toString();
      badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff4757;
        color: white;
        font-size: 10px;
        font-weight: bold;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      
      const responseIndicator = document.createElement('span');
      responseIndicator.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #28a745;
        display: none;
        box-shadow: 0 0 8px rgba(40, 167, 69, 0.8);
        animation: pulse 1.5s infinite;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
      
      this.aiButton.appendChild(badge);
      this.aiButton.appendChild(responseIndicator);
      
      this.checkResponseStatusInterval = setInterval(() => {
        responseIndicator.style.display = this.pendingResponse.isPending && !this.isPanelVisible ? 'block' : 'none';
      }, 1000);
      
      this.aiButton.onmouseover = () => {
        this.aiButton.style.transform = 'scale(1.1)';
        this.aiButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
      };
      
      this.aiButton.onmouseout = () => {
        this.aiButton.style.transform = 'scale(1)';
        this.aiButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      };
      
      this.aiButton.onclick = () => {
        this.togglePanel();
      };

      controlPanel.appendChild(this.aiButton);
    }

    // 新增：添加模型水印到回复内容
    addModelWatermark(content, modelId = null) {
      if (!this.showModelWatermark) {
        return content;
      }
      
      const modelName = this.getModelDisplayName(modelId || this.currentModel);
      const watermarkHtml = `
        <div style="${this.watermarkStyle}">
          ${this.watermarkPrefix} <strong>${modelName}</strong> ${this.watermarkSuffix}
        </div>
      `;
      
      // 如果内容已经是HTML格式，直接添加水印
      if (content.includes('<') && content.includes('>')) {
        return content + watermarkHtml;
      }
      
      // 如果内容是纯文本，先包裹在div中
      return `<div>${content}</div>${watermarkHtml}`;
    }

    createPanel() {
      this.overlay = document.createElement('div');
      this.overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
        backdrop-filter: blur(2px);
      `;
      this.overlay.onclick = () => this.hidePanel();
      document.body.appendChild(this.overlay);

      this.panel = document.createElement('div');
      this.panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 850px;
        max-width: 95vw;
        height: 900px;
        max-height: 90vh;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        display: none;
      `;

      // 面板头部
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 16px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      const title = document.createElement('h3');
      title.textContent = `🤖 AI智能助手 - ${this.totalModels}个模型`;
      title.style.margin = '0';
      title.style.fontSize = '18px';
      
      this.responseStatusIndicator = document.createElement('span');
      this.responseStatusIndicator.textContent = '';
      this.responseStatusIndicator.style.cssText = `
        font-size: 12px;
        margin-left: 10px;
        opacity: 0.8;
        display: none;
      `;
      title.appendChild(this.responseStatusIndicator);
      
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
      `;
      closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      };
      closeBtn.onmouseout = () => {
        closeBtn.style.background = 'none';
      };
      closeBtn.onclick = () => this.hidePanel();
      
      header.appendChild(title);
      header.appendChild(closeBtn);

      // 控制区域
      const controls = document.createElement('div');
      controls.style.cssText = `
        padding: 15px 20px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      `;

      // 搜索框
      const searchContainer = document.createElement('div');
      searchContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 5px;
        flex: 1;
        min-width: 200px;
        max-width: 300px;
        position: relative;
      `;
      
      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.placeholder = '搜索模型...';
      this.searchInput.style.cssText = `
        flex: 1;
        padding: 8px 30px 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 14px;
        background: white;
      `;
      this.searchInput.oninput = () => {
        this.searchQuery = this.searchInput.value.trim().toLowerCase();
        this.searchModels();
      };
      
      const searchIcon = document.createElement('span');
      searchIcon.innerHTML = '🔍';
      searchIcon.style.cssText = `
        position: absolute;
        right: 10px;
        font-size: 14px;
        color: #6c757d;
        pointer-events: none;
      `;
      
      this.clearSearchBtn = document.createElement('button');
      this.clearSearchBtn.innerHTML = '×';
      this.clearSearchBtn.title = '清除搜索';
      this.clearSearchBtn.style.cssText = `
        position: absolute;
        right: 8px;
        background: none;
        border: none;
        color: #6c757d;
        font-size: 16px;
        cursor: pointer;
        display: none;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
      `;
      this.clearSearchBtn.onmouseover = () => {
        this.clearSearchBtn.style.background = '#e9ecef';
      };
      this.clearSearchBtn.onmouseout = () => {
        this.clearSearchBtn.style.background = 'none';
      };
      this.clearSearchBtn.onclick = () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearchBtn.style.display = 'none';
        this.searchModels();
      };
      
      searchContainer.appendChild(this.searchInput);
      searchContainer.appendChild(searchIcon);
      searchContainer.appendChild(this.clearSearchBtn);

      // 模型选择
      const modelLabel = document.createElement('span');
      modelLabel.textContent = '模型:';
      modelLabel.style.fontSize = '14px';
      modelLabel.style.color = '#495057';
      modelLabel.style.fontWeight = 'bold';
      
      this.modelSelect = document.createElement('select');
      this.populateModelSelect();
      
      this.modelSelect.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        background: white;
        font-size: 14px;
        min-width: 240px;
        max-width: 270px;
      `;
      this.modelSelect.onchange = (e) => {
        this.currentModel = e.target.value;
        this.updateImageUploadButtonVisibility();
        this.updateReasoningVisibility();
        this.updateModelDescription();
      };

      // 图片上传按钮
      this.imageUploadBtn = document.createElement('button');
      this.imageUploadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      `;
      this.imageUploadBtn.title = `上传图片（最多${this.maxImages}张，多模态模型支持，可直接发送图片）`;
      this.imageUploadBtn.style.cssText = `
        padding: 8px 12px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
        display: none;
        align-items: center;
        gap: 5px;
      `;
      this.imageUploadBtn.onmouseover = () => {
        this.imageUploadBtn.style.background = '#ff5252';
      };
      this.imageUploadBtn.onmouseout = () => {
        this.imageUploadBtn.style.background = '#ff6b6b';
      };
      this.imageUploadBtn.onclick = () => {
        this.uploadImages();
      };

      // 温度设置
      const tempLabel = document.createElement('span');
      tempLabel.textContent = '温度:';
      tempLabel.style.fontSize = '14px';
      tempLabel.style.color = '#495057';
      tempLabel.style.marginLeft = '10px';
      tempLabel.style.fontWeight = 'bold';
      
      this.tempInput = document.createElement('input');
      this.tempInput.type = 'range';
      this.tempInput.min = '0';
      this.tempInput.max = '2';
      this.tempInput.step = '0.1';
      this.tempInput.value = this.temperature;
      this.tempInput.style.cssText = `
        width: 80px;
        margin: 0 4px;
      `;
      this.tempInput.oninput = (e) => {
        this.temperature = parseFloat(e.target.value);
        this.tempValueDisplay.textContent = this.temperature.toFixed(1);
      };

      this.tempValueDisplay = document.createElement('span');
      this.tempValueDisplay.textContent = this.temperature.toFixed(1);
      this.tempValueDisplay.style.cssText = `
        font-size: 14px;
        color: #495057;
        min-width: 30px;
      `;

      // 高级设置按钮
      this.advancedSettingsBtn = document.createElement('button');
      this.advancedSettingsBtn.textContent = '高级设置';
      this.advancedSettingsBtn.style.cssText = `
        padding: 8px 16px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
        margin-left: auto;
      `;
      this.advancedSettingsBtn.onmouseover = () => {
        this.advancedSettingsBtn.style.background = '#218838';
      };
      this.advancedSettingsBtn.onmouseout = () => {
        this.advancedSettingsBtn.style.background = '#28a745';
      };
      this.advancedSettingsBtn.onclick = () => {
        this.toggleAdvancedSettings();
      };

      // 清空历史按钮
      const clearBtn = document.createElement('button');
      clearBtn.textContent = '清空历史';
      clearBtn.style.cssText = `
        padding: 8px 16px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      `;
      clearBtn.onmouseover = () => {
        clearBtn.style.background = '#545b62';
      };
      clearBtn.onmouseout = () => {
        clearBtn.style.background = '#6c757d';
      };
      clearBtn.onclick = () => {
        if (this.pendingResponse.controller) {
          this.pendingResponse.controller.abort();
        }
        this.conversationHistory = [];
        this.messagesDiv.innerHTML = '';
        this.addMessage('system', '对话历史已清空');
        this.pendingResponse.isPending = false;
      };

      controls.appendChild(searchContainer);
      controls.appendChild(modelLabel);
      controls.appendChild(this.modelSelect);
      controls.appendChild(this.imageUploadBtn);
      controls.appendChild(tempLabel);
      controls.appendChild(this.tempInput);
      controls.appendChild(this.tempValueDisplay);
      controls.appendChild(this.advancedSettingsBtn);
      controls.appendChild(clearBtn);

      // 模型介绍区域
      this.modelDescriptionContainer = document.createElement('div');
      this.modelDescriptionContainer.style.cssText = `
        padding: 10px 20px;
        background: #e6f7ff;
        border-bottom: 1px solid #b3e0ff;
        display: flex;
        flex-direction: column;
        gap: 5px;
        max-height: 120px;
        overflow: hidden;
        transition: max-height 0.3s ease;
      `;

      const descriptionHeader = document.createElement('div');
      descriptionHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      `;

      const descriptionTitle = document.createElement('span');
      descriptionTitle.textContent = '📚 模型介绍';
      descriptionTitle.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        color: #0066cc;
      `;

      this.descriptionToggleBtn = document.createElement('button');
      this.descriptionToggleBtn.innerHTML = '▼';
      this.descriptionToggleBtn.style.cssText = `
        background: none;
        border: none;
        color: #0066cc;
        font-size: 12px;
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 4px;
        transition: all 0.3s;
      `;
      this.descriptionToggleBtn.onmouseover = () => {
        this.descriptionToggleBtn.style.background = '#e6f7ff';
      };
      this.descriptionToggleBtn.onmouseout = () => {
        this.descriptionToggleBtn.style.background = 'none';
      };
      this.descriptionToggleBtn.onclick = () => {
        this.toggleModelDescription();
      };

      descriptionHeader.appendChild(descriptionTitle);
      descriptionHeader.appendChild(this.descriptionToggleBtn);

      this.modelDescriptionText = document.createElement('div');
      this.modelDescriptionText.style.cssText = `
        font-size: 12px;
        color: #333;
        line-height: 1.5;
        overflow-y: auto;
        max-height: 80px;
        padding-right: 5px;
      `;
      this.modelDescriptionText.innerHTML = '<span style="color: #666;">选择模型查看介绍...</span>';

      this.modelDescriptionContainer.appendChild(descriptionHeader);
      this.modelDescriptionContainer.appendChild(this.modelDescriptionText);

      // 图片预览区域
      this.imagePreviewContainer = document.createElement('div');
      this.imagePreviewContainer.style.cssText = `
        padding: 10px 20px;
        background: #f0f9ff;
        border-bottom: 1px solid #cce7ff;
        display: none;
        flex-direction: column;
        gap: 10px;
      `;

      this.imageCountDisplay = document.createElement('div');
      this.imageCountDisplay.style.cssText = `
        font-size: 12px;
        color: #495057;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
      `;

      this.imagesGrid = document.createElement('div');
      this.imagesGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
        padding: 5px;
      `;

      this.imagePreviewContainer.appendChild(this.imageCountDisplay);
      this.imagePreviewContainer.appendChild(this.imagesGrid);

      // 搜索结果显示
      this.searchResultDiv = document.createElement('div');
      this.searchResultDiv.style.cssText = `
        padding: 8px 20px;
        background: #e9ecef;
        border-bottom: 1px solid #ced4da;
        font-size: 13px;
        color: #495057;
        display: none;
      `;

      // 高级设置面板
      this.advancedSettingsPanel = document.createElement('div');
      this.advancedSettingsPanel.style.cssText = `
        padding: 20px;
        background: #f8f9fa;
        border-bottom: 1px solid #ced4da;
        display: none;
        flex-direction: column;
        gap: 15px;
        max-height: 400px;
        overflow-y: auto;
      `;

      const advancedSettingsHeader = document.createElement('div');
      advancedSettingsHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      `;
      
      const advancedSettingsTitle = document.createElement('h4');
      advancedSettingsTitle.textContent = '⚙️ 高级设置';
      advancedSettingsTitle.style.cssText = `
        margin: 0;
        color: #495057;
        font-size: 16px;
      `;
      
      const advancedSettingsCloseBtn = document.createElement('button');
      advancedSettingsCloseBtn.innerHTML = '×';
      advancedSettingsCloseBtn.style.cssText = `
        background: none;
        border: none;
        color: #6c757d;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
      `;
      advancedSettingsCloseBtn.onmouseover = () => {
        advancedSettingsCloseBtn.style.background = '#e9ecef';
      };
      advancedSettingsCloseBtn.onmouseout = () => {
        advancedSettingsCloseBtn.style.background = 'none';
      };
      advancedSettingsCloseBtn.onclick = () => {
        this.toggleAdvancedSettings();
      };
      
      advancedSettingsHeader.appendChild(advancedSettingsTitle);
      advancedSettingsHeader.appendChild(advancedSettingsCloseBtn);
      this.advancedSettingsPanel.appendChild(advancedSettingsHeader);

      const settingsColumns = document.createElement('div');
      settingsColumns.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      `;

      // 左列：模型参数
      const leftColumn = document.createElement('div');
      leftColumn.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

      // 最大token数
      const maxTokensRow = document.createElement('div');
      maxTokensRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const maxTokensLabel = document.createElement('label');
      maxTokensLabel.textContent = '最大长度:';
      maxTokensLabel.style.fontSize = '14px';
      maxTokensLabel.style.color = '#495057';
      maxTokensLabel.style.minWidth = '100px';
      
      this.maxTokensInput = document.createElement('input');
      this.maxTokensInput.type = 'number';
      this.maxTokensInput.min = '1';
      this.maxTokensInput.max = '8192';
      this.maxTokensInput.step = '100';
      this.maxTokensInput.value = this.maxTokens;
      this.maxTokensInput.style.cssText = `
        flex: 1;
        padding: 6px 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        background: white;
      `;
      this.maxTokensInput.oninput = (e) => {
        let value = parseInt(e.target.value);
        if (value < 1) value = 1;
        if (value > 8192) value = 8192;
        this.maxTokens = value;
      };

      const maxTokensInfo = document.createElement('span');
      maxTokensInfo.textContent = 'tokens';
      maxTokensInfo.style.fontSize = '12px';
      maxTokensInfo.style.color = '#6c757d';

      maxTokensRow.appendChild(maxTokensLabel);
      maxTokensRow.appendChild(this.maxTokensInput);
      maxTokensRow.appendChild(maxTokensInfo);

      // top_p设置
      const topPRow = document.createElement('div');
      topPRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const topPLabel = document.createElement('label');
      topPLabel.textContent = '核采样(top_p):';
      topPLabel.style.fontSize = '14px';
      topPLabel.style.color = '#495057';
      topPLabel.style.minWidth = '100px';
      
      this.topPInput = document.createElement('input');
      this.topPInput.type = 'range';
      this.topPInput.min = '0';
      this.topPInput.max = '1';
      this.topPInput.step = '0.05';
      this.topPInput.value = this.topP;
      this.topPInput.style.cssText = `
        flex: 1;
        margin: 0 4px;
      `;
      this.topPInput.oninput = (e) => {
        this.topP = parseFloat(e.target.value);
        this.topPValueDisplay.textContent = this.topP.toFixed(2);
      };

      this.topPValueDisplay = document.createElement('span');
      this.topPValueDisplay.textContent = this.topP.toFixed(2);
      this.topPValueDisplay.style.cssText = `
        font-size: 14px;
        color: #495057;
        min-width: 35px;
        text-align: right;
      `;

      topPRow.appendChild(topPLabel);
      topPRow.appendChild(this.topPInput);
      topPRow.appendChild(this.topPValueDisplay);

      // 频率惩罚
      const freqPenaltyRow = document.createElement('div');
      freqPenaltyRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const freqPenaltyLabel = document.createElement('label');
      freqPenaltyLabel.textContent = '频率惩罚:';
      freqPenaltyLabel.style.fontSize = '14px';
      freqPenaltyLabel.style.color = '#495057';
      freqPenaltyLabel.style.minWidth = '100px';
      
      this.freqPenaltyInput = document.createElement('input');
      this.freqPenaltyInput.type = 'range';
      this.freqPenaltyInput.min = '-2';
      this.freqPenaltyInput.max = '2';
      this.freqPenaltyInput.step = '0.1';
      this.freqPenaltyInput.value = this.frequencyPenalty;
      this.freqPenaltyInput.style.cssText = `
        flex: 1;
        margin: 0 4px;
      `;
      this.freqPenaltyInput.oninput = (e) => {
        this.frequencyPenalty = parseFloat(e.target.value);
        this.freqPenaltyValueDisplay.textContent = this.frequencyPenalty.toFixed(1);
      };

      this.freqPenaltyValueDisplay = document.createElement('span');
      this.freqPenaltyValueDisplay.textContent = this.frequencyPenalty.toFixed(1);
      this.freqPenaltyValueDisplay.style.cssText = `
        font-size: 14px;
        color: '#495057';
        min-width: 35px;
        text-align: right;
      `;

      freqPenaltyRow.appendChild(freqPenaltyLabel);
      freqPenaltyRow.appendChild(this.freqPenaltyInput);
      freqPenaltyRow.appendChild(this.freqPenaltyValueDisplay);

      // 思维链长度
      const thinkingBudgetRow = document.createElement('div');
      thinkingBudgetRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const thinkingBudgetLabel = document.createElement('label');
      thinkingBudgetLabel.textContent = '思维链长度:';
      thinkingBudgetLabel.style.fontSize = '14px';
      thinkingBudgetLabel.style.color = '#495057';
      thinkingBudgetLabel.style.minWidth = '100px';
      
      this.thinkingBudgetInput = document.createElement('input');
      this.thinkingBudgetInput.type = 'number';
      this.thinkingBudgetInput.min = '0';
      this.thinkingBudgetInput.max = '4096';
      this.thinkingBudgetInput.step = '128';
      this.thinkingBudgetInput.value = this.thinkingBudget;
      this.thinkingBudgetInput.style.cssText = `
        flex: 1;
        padding: 6px 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        background: white;
      `;
      this.thinkingBudgetInput.oninput = (e) => {
        let value = parseInt(e.target.value);
        if (value < 0) value = 0;
        if (value > 4096) value = 4096;
        this.thinkingBudget = value;
      };

      const thinkingBudgetInfo = document.createElement('span');
      thinkingBudgetInfo.textContent = 'tokens';
      thinkingBudgetInfo.style.fontSize = '12px';
      thinkingBudgetInfo.style.color = '#6c757d';

      thinkingBudgetRow.appendChild(thinkingBudgetLabel);
      thinkingBudgetRow.appendChild(this.thinkingBudgetInput);
      thinkingBudgetRow.appendChild(thinkingBudgetInfo);

      // 右列：功能设置
      const rightColumn = document.createElement('div');
      rightColumn.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

      // 启用思维链
      const enableReasoningRow = document.createElement('div');
      enableReasoningRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const enableReasoningLabel = document.createElement('label');
      enableReasoningLabel.textContent = '启用思维链:';
      enableReasoningLabel.style.fontSize = '14px';
      enableReasoningLabel.style.color = '#495057';
      enableReasoningLabel.style.minWidth = '100px';
      
      this.enableReasoningCheckbox = document.createElement('input');
      this.enableReasoningCheckbox.type = 'checkbox';
      this.enableReasoningCheckbox.checked = this.enableReasoning;
      this.enableReasoningCheckbox.onchange = (e) => {
        this.enableReasoning = e.target.checked;
        this.updateReasoningControls();
      };
      this.enableReasoningCheckbox.style.cssText = `
        width: 18px;
        height: 18px;
        cursor: pointer;
      `;

      const enableReasoningInfo = document.createElement('span');
      enableReasoningInfo.textContent = '（仅支持推理模型）';
      enableReasoningInfo.style.fontSize = '12px';
      enableReasoningInfo.style.color = '#6c757d';

      enableReasoningRow.appendChild(enableReasoningLabel);
      enableReasoningRow.appendChild(this.enableReasoningCheckbox);
      enableReasoningRow.appendChild(enableReasoningInfo);

      // 显示思维链选项
      const showReasoningRow = document.createElement('div');
      showReasoningRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const showReasoningLabel = document.createElement('label');
      showReasoningLabel.textContent = '显示思维链:';
      showReasoningLabel.style.fontSize = '14px';
      showReasoningLabel.style.color = '#495057';
      showReasoningLabel.style.minWidth = '100px';
      
      this.showReasoningCheckbox = document.createElement('input');
      this.showReasoningCheckbox.type = 'checkbox';
      this.showReasoningCheckbox.checked = this.showReasoningContent;
      this.showReasoningCheckbox.onchange = (e) => {
        this.showReasoningContent = e.target.checked;
      };
      this.showReasoningCheckbox.style.cssText = `
        width: 18px;
        height: 18px;
        cursor: pointer;
      `;

      const showReasoningInfo = document.createElement('span');
      showReasoningInfo.textContent = '（浅色标记推理过程）';
      showReasoningInfo.style.fontSize = '12px';
      showReasoningInfo.style.color = '#6c757d';

      showReasoningRow.appendChild(showReasoningLabel);
      showReasoningRow.appendChild(this.showReasoningCheckbox);
      showReasoningRow.appendChild(showReasoningInfo);

      // 流式输出开关
      const streamingRow = document.createElement('div');
      streamingRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const streamingLabel = document.createElement('label');
      streamingLabel.textContent = '流式输出:';
      streamingLabel.style.fontSize = '14px';
      streamingLabel.style.color = '#495057';
      streamingLabel.style.minWidth = '100px';
      
      this.streamingCheckbox = document.createElement('input');
      this.streamingCheckbox.type = 'checkbox';
      this.streamingCheckbox.checked = this.enableStreaming;
      this.streamingCheckbox.onchange = (e) => {
        this.enableStreaming = e.target.checked;
      };
      this.streamingCheckbox.style.cssText = `
        width: 18px;
        height: 18px;
        cursor: pointer;
      `;

      const streamingInfo = document.createElement('span');
      streamingInfo.textContent = '（实时显示回复）';
      streamingInfo.style.fontSize = '12px';
      streamingInfo.style.color = '#6c757d';

      streamingRow.appendChild(streamingLabel);
      streamingRow.appendChild(this.streamingCheckbox);
      streamingRow.appendChild(streamingInfo);

      // 上下文长度
      const contextLengthRow = document.createElement('div');
      contextLengthRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const contextLengthLabel = document.createElement('label');
      contextLengthLabel.textContent = '上下文长度:';
      contextLengthLabel.style.fontSize = '14px';
      contextLengthLabel.style.color = '#495057';
      contextLengthLabel.style.minWidth = '100px';
      
      this.contextLengthInput = document.createElement('input');
      this.contextLengthInput.type = 'number';
      this.contextLengthInput.min = '1';
      this.contextLengthInput.max = '50';
      this.contextLengthInput.step = '1';
      this.contextLengthInput.value = this.maxHistoryLength;
      this.contextLengthInput.style.cssText = `
        flex: 1;
        padding: 6px 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        background: white;
      `;
      this.contextLengthInput.oninput = (e) => {
        let value = parseInt(e.target.value);
        if (value < 1) value = 1;
        if (value > 50) value = 50;
        this.maxHistoryLength = value;
      };

      const contextLengthInfo = document.createElement('span');
      contextLengthInfo.textContent = '条消息';
      contextLengthInfo.style.fontSize = '12px';
      contextLengthInfo.style.color = '#6c757d';

      contextLengthRow.appendChild(contextLengthLabel);
      contextLengthRow.appendChild(this.contextLengthInput);
      contextLengthRow.appendChild(contextLengthInfo);

      // 格式化选项
      const formattingRow = document.createElement('div');
      formattingRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
      
      const formattingLabel = document.createElement('label');
      formattingLabel.textContent = '格式化:';
      formattingLabel.style.fontSize = '14px';
      formattingLabel.style.color = '#495057';
      formattingLabel.style.minWidth = '100px';
      
      const formattingOptions = document.createElement('div');
      formattingOptions.style.cssText = 'display: flex; gap: 15px;';
      
      // Markdown格式化
      const markdownOption = document.createElement('div');
      markdownOption.style.cssText = 'display: flex; align-items: center; gap: 5px;';
      
      this.markdownCheckbox = document.createElement('input');
      this.markdownCheckbox.type = 'checkbox';
      this.markdownCheckbox.id = 'markdown-formatting';
      this.markdownCheckbox.checked = this.autoFormatMarkdown;
      this.markdownCheckbox.onchange = (e) => {
        this.autoFormatMarkdown = e.target.checked;
      };
      this.markdownCheckbox.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
      `;
      
      const markdownLabel = document.createElement('label');
      markdownLabel.htmlFor = 'markdown-formatting';
      markdownLabel.textContent = 'Markdown';
      markdownLabel.style.cssText = 'font-size: 12px; color: #495057; cursor: pointer;';
      
      markdownOption.appendChild(this.markdownCheckbox);
      markdownOption.appendChild(markdownLabel);
      
      // 代码格式化
      const codeOption = document.createElement('div');
      codeOption.style.cssText = 'display: flex; align-items: center; gap: 5px;';
      
      this.codeCheckbox = document.createElement('input');
      this.codeCheckbox.type = 'checkbox';
      this.codeCheckbox.id = 'code-formatting';
      this.codeCheckbox.checked = this.autoFormatCode;
      this.codeCheckbox.onchange = (e) => {
        this.autoFormatCode = e.target.checked;
      };
      this.codeCheckbox.style.cssText = `
        width: 16px;
        height: 16px;
        cursor: pointer;
      `;
      
      const codeLabel = document.createElement('label');
      codeLabel.htmlFor = 'code-formatting';
      codeLabel.textContent = '代码';
      codeLabel.style.cssText = 'font-size: 12px; color: #495057; cursor: pointer;';
      
      codeOption.appendChild(this.codeCheckbox);
      codeOption.appendChild(codeLabel);
      
      formattingOptions.appendChild(markdownOption);
      formattingOptions.appendChild(codeOption);
      
      formattingRow.appendChild(formattingLabel);
      formattingRow.appendChild(formattingOptions);

      // 组装左列
      leftColumn.appendChild(maxTokensRow);
      leftColumn.appendChild(topPRow);
      leftColumn.appendChild(freqPenaltyRow);
      leftColumn.appendChild(thinkingBudgetRow);

      // 组装右列
      rightColumn.appendChild(enableReasoningRow);
      rightColumn.appendChild(showReasoningRow);
      rightColumn.appendChild(streamingRow);
      rightColumn.appendChild(contextLengthRow);
      rightColumn.appendChild(formattingRow);

      settingsColumns.appendChild(leftColumn);
      settingsColumns.appendChild(rightColumn);
      this.advancedSettingsPanel.appendChild(settingsColumns);

      // 系统提示词设置
      const systemPromptContainer = document.createElement('div');
      systemPromptContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
      
      const systemPromptLabel = document.createElement('label');
      systemPromptLabel.textContent = '系统提示词:';
      systemPromptLabel.style.cssText = 'font-size: 14px; color: #495057; font-weight: bold;';
      
      this.systemPromptTextarea = document.createElement('textarea');
      this.systemPromptTextarea.value = this.customSystemPrompt;
      this.systemPromptTextarea.placeholder = '输入系统提示词...';
      this.systemPromptTextarea.style.cssText = `
        width: 100%;
        height: 80px;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 13px;
        font-family: inherit;
        resize: vertical;
        line-height: 1.4;
      `;
      this.systemPromptTextarea.oninput = (e) => {
        this.customSystemPrompt = e.target.value;
      };
      
      const systemPromptInfo = document.createElement('div');
      systemPromptInfo.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
      
      const systemPromptHint = document.createElement('span');
      systemPromptHint.textContent = '定义AI的行为和回复风格';
      systemPromptHint.style.cssText = 'font-size: 12px; color: #6c757d;';
      
      const resetSystemPromptBtn = document.createElement('button');
      resetSystemPromptBtn.textContent = '恢复默认';
      resetSystemPromptBtn.style.cssText = `
        padding: 4px 10px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.3s;
      `;
      resetSystemPromptBtn.onmouseover = () => {
        resetSystemPromptBtn.style.background = '#545b62';
      };
      resetSystemPromptBtn.onmouseout = () => {
        resetSystemPromptBtn.style.background = '#6c757d';
      };
      resetSystemPromptBtn.onclick = () => {
        const defaultPrompt = "你是一个友好、专业的AI助手。请用中文回答用户的问题，并根据问题类型提供详细、准确的回答。";
        this.customSystemPrompt = defaultPrompt;
        this.systemPromptTextarea.value = defaultPrompt;
      };
      
      systemPromptInfo.appendChild(systemPromptHint);
      systemPromptInfo.appendChild(resetSystemPromptBtn);
      
      systemPromptContainer.appendChild(systemPromptLabel);
      systemPromptContainer.appendChild(this.systemPromptTextarea);
      systemPromptContainer.appendChild(systemPromptInfo);
      
      this.advancedSettingsPanel.appendChild(systemPromptContainer);

      // 消息容器
      this.messagesDiv = document.createElement('div');
      this.messagesDiv.style.cssText = `
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #fafafa;
      `;

      // 输入区域
      const inputContainer = document.createElement('div');
      inputContainer.style.cssText = `
        padding: 15px 20px;
        background: white;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
      `;

      this.inputField = document.createElement('textarea');
      this.inputField.placeholder = '输入问题或直接发送图片... (Shift+Enter换行，Enter发送)';
      this.inputField.style.cssText = `
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ced4da;
        border-radius: 8px;
        resize: none;
        font-size: 14px;
        font-family: inherit;
        min-height: 44px;
        max-height: 100px;
        line-height: 1.5;
      `;
      
      this.inputField.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      };

      this.inputField.oninput = () => {
        this.inputField.style.height = 'auto';
        this.inputField.style.height = Math.min(this.inputField.scrollHeight, 100) + 'px';
      };

      this.sendButton = document.createElement('button');
      this.sendButton.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
        </svg>
      `;
      this.sendButton.style.cssText = `
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      `;
      this.sendButton.onmouseover = () => {
        this.sendButton.style.transform = 'translateY(-2px)';
        this.sendButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
      };
      this.sendButton.onmouseout = () => {
        this.sendButton.style.transform = 'translateY(0)';
        this.sendButton.style.boxShadow = 'none';
      };
      this.sendButton.onclick = () => this.sendMessage();
      this.sendButton.disabled = false;

      // 停止按钮
      this.stopButton = document.createElement('button');
      this.stopButton.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12"/>
        </svg>
      `;
      this.stopButton.style.cssText = `
        padding: 12px 20px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        display: none;
      `;
      this.stopButton.onmouseover = () => {
        this.stopButton.style.background = '#c82333';
      };
      this.stopButton.onmouseout = () => {
        this.stopButton.style.background = '#dc3545';
      };
      this.stopButton.onclick = () => {
        if (this.pendingResponse.controller) {
          this.pendingResponse.controller.abort();
          this.pendingResponse.isPending = false;
          this.addMessage('system', '对话已停止');
          this.stopStreaming();
        }
      };

      inputContainer.appendChild(this.inputField);
      inputContainer.appendChild(this.sendButton);
      inputContainer.appendChild(this.stopButton);

      // 组装面板
      this.panel.appendChild(header);
      this.panel.appendChild(controls);
      this.panel.appendChild(this.modelDescriptionContainer);
      this.panel.appendChild(this.imagePreviewContainer);
      this.panel.appendChild(this.searchResultDiv);
      this.panel.appendChild(this.advancedSettingsPanel);
      this.panel.appendChild(this.messagesDiv);
      this.panel.appendChild(inputContainer);

      document.body.appendChild(this.panel);

      // 添加欢迎消息（带水印）
      const welcomeMessage = `你好！我是AI助手，支持${this.totalModels}个模型，包括文本、多模态等类型。当前使用 ${this.getModelDisplayName(this.currentModel)}。请问有什么可以帮助您的吗？`;
      this.addMessage('assistant', this.addModelWatermark(welcomeMessage, this.currentModel));
      
      this.updateModelDescription();
      this.updateReasoningControls();
    }

    updateReasoningControls() {
      const isReasoningModel = this.reasoningModels.includes(this.currentModel);
      
      const controls = [
        this.thinkingBudgetInput,
        this.enableReasoningCheckbox,
        this.showReasoningCheckbox
      ];
      
      controls.forEach(control => {
        if (control) {
          control.disabled = !isReasoningModel;
          control.style.opacity = isReasoningModel ? '1' : '0.5';
        }
      });
      
      if (this.enableReasoningCheckbox) {
        this.enableReasoningCheckbox.title = isReasoningModel ? 
          '启用思维链推理' : '当前模型不支持思维链';
      }
      
      if (this.showReasoningCheckbox) {
        this.showReasoningCheckbox.title = isReasoningModel ? 
          '显示思维链内容' : '当前模型不支持思维链';
      }
      
      if (this.thinkingBudgetInput) {
        this.thinkingBudgetInput.title = isReasoningModel ? 
          '设置思维链预算' : '当前模型不支持思维链';
      }
    }

    toggleModelDescription() {
      if (this.modelDescriptionContainer.style.maxHeight === '120px' || !this.modelDescriptionContainer.style.maxHeight) {
        this.modelDescriptionContainer.style.maxHeight = '30px';
        this.modelDescriptionText.style.display = 'none';
        this.descriptionToggleBtn.innerHTML = '▶';
      } else {
        this.modelDescriptionContainer.style.maxHeight = '120px';
        this.modelDescriptionText.style.display = 'block';
        this.descriptionToggleBtn.innerHTML = '▼';
      }
    }

    updateModelDescription() {
      const modelId = this.currentModel;
      const modelName = this.getModelDisplayName(modelId);
      
      let description = this.modelDescriptions[modelId];
      
      if (!description) {
        const category = this.getModelCategory(modelId);
        const isReasoning = this.reasoningModels.includes(modelId);
        const isMultimodal = this.multimodalModels.includes(modelId);
        
        description = `${modelName} 是一个`;
        
        if (category) {
          description += ` ${category}，`;
        }
        
        if (isReasoning) {
          description += '支持思维链推理，';
        }
        
        if (isMultimodal) {
          description += '支持多模态输入（图片等），';
        }
        
        description += '在各种AI任务上表现良好。';
      }
      
      this.modelDescriptionText.innerHTML = `
        <div style="margin-bottom: 5px; font-weight: bold; color: #0066cc;">${modelName}</div>
        <div>${description}</div>
      `;
      
      this.modelDescriptionContainer.style.maxHeight = '120px';
      this.modelDescriptionText.style.display = 'block';
      this.descriptionToggleBtn.innerHTML = '▼';
    }

    getModelCategory(modelId) {
      for (const [category, models] of Object.entries(this.modelCategories)) {
        if (models.includes(modelId)) {
          return category;
        }
      }
      return null;
    }

    populateModelSelect(filteredModels = null) {
      this.modelSelect.innerHTML = '';
      
      const modelsToShow = filteredModels || this.availableModels;
      
      if (modelsToShow.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '未找到匹配的模型';
        option.disabled = true;
        this.modelSelect.appendChild(option);
        return;
      }
      
      const modelGroups = {};
      
      for (const [category, models] of Object.entries(this.modelCategories)) {
        const filteredCategoryModels = models.filter(model => 
          modelsToShow.includes(model)
        );
        
        if (filteredCategoryModels.length > 0) {
          modelGroups[category] = filteredCategoryModels;
        }
      }
      
      if (Object.keys(modelGroups).length === 0) {
        modelsToShow.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          const modelName = model.split('/').pop();
          option.textContent = modelName;
          if (model === this.currentModel) option.selected = true;
          this.modelSelect.appendChild(option);
        });
        return;
      }
      
      for (const [category, models] of Object.entries(modelGroups)) {
        const group = document.createElement('optgroup');
        group.label = `▸ ${category} (${models.length})`;
        
        models.forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          const modelName = model.split('/').pop();
          option.textContent = modelName;
          if (model === this.currentModel) option.selected = true;
          group.appendChild(option);
        });
        
        this.modelSelect.appendChild(group);
      }
    }

    searchModels() {
      const query = this.searchQuery.toLowerCase();
      
      if (query.length > 0) {
        this.clearSearchBtn.style.display = 'flex';
        this.searchActive = true;
      } else {
        this.clearSearchBtn.style.display = 'none';
        this.searchActive = false;
        this.searchResultDiv.style.display = 'none';
        this.populateModelSelect();
        return;
      }
      
      this.filteredModels = this.availableModels.filter(model => {
        const modelName = model.toLowerCase();
        const displayName = this.getModelDisplayName(model).toLowerCase();
        
        return modelName.includes(query) || displayName.includes(query);
      });
      
      if (query.length > 0) {
        this.searchResultDiv.textContent = `找到 ${this.filteredModels.length} 个匹配模型`;
        this.searchResultDiv.style.display = 'block';
      } else {
        this.searchResultDiv.style.display = 'none';
      }
      
      this.populateModelSelect(this.filteredModels);
      
      if (!this.filteredModels.includes(this.currentModel) && this.filteredModels.length > 0) {
        this.currentModel = this.filteredModels[0];
        this.updateImageUploadButtonVisibility();
        this.updateReasoningVisibility();
        this.updateModelDescription();
      }
    }

    updateImageUploadButtonVisibility() {
      const isMultimodal = this.multimodalModels.includes(this.currentModel);
      
      if (isMultimodal) {
        this.imageUploadBtn.style.display = 'flex';
        this.imageUploadBtn.title = `上传图片（最多${this.maxImages}张，多模态模型支持，可直接发送图片）`;
      } else {
        this.imageUploadBtn.style.display = 'none';
        this.clearCurrentImages();
      }
    }

    updateReasoningVisibility() {
      const isReasoningModel = this.reasoningModels.includes(this.currentModel);
      
      if (this.thinkingBudgetInput) {
        this.thinkingBudgetInput.disabled = !isReasoningModel;
        this.thinkingBudgetInput.style.opacity = isReasoningModel ? '1' : '0.5';
        this.thinkingBudgetInput.title = isReasoningModel ? 
          '设置思维链预算' : '当前模型不支持思维链';
      }
      
      if (this.showReasoningCheckbox) {
        this.showReasoningCheckbox.disabled = !isReasoningModel;
        this.showReasoningCheckbox.style.opacity = isReasoningModel ? '1' : '0.5';
        this.showReasoningCheckbox.title = isReasoningModel ? 
          '显示思维链内容' : '当前模型不支持思维链';
      }
      
      if (this.enableReasoningCheckbox) {
        this.enableReasoningCheckbox.disabled = !isReasoningModel;
        this.enableReasoningCheckbox.style.opacity = isReasoningModel ? '1' : '0.5';
      }
      
      this.updateReasoningControls();
    }

    isImageType(type) {
      return type && type.startsWith("image/");
    }

    async uploadImageToImgBB(blob, name = 'uploaded_image') {
      if (this.imageUploading) {
        throw new Error("正在上传中，请稍候");
      }
      
      this.imageUploading = true;
      try {
        const formData = new FormData();
        formData.append("image", blob);
        formData.append("key", this.imgbbApiKey);
        formData.append("expiration", "15552000");
        formData.append("name", name);

        const response = await fetch(this.imgbbApiUrl, {
          method: "POST",
          body: formData
        });
        
        const data = await response.json();
        if (data.success) {
          this.lastImageUploadResponse = data.data;
          return data.data;
        } else {
          throw new Error(data.error?.message || "上传失败");
        }
      } catch (error) {
        console.error("图片上传错误:", error);
        throw error;
      } finally {
        this.imageUploading = false;
      }
    }

    updateImagePreview() {
      this.imagesGrid.innerHTML = '';
      
      this.imageCountDisplay.innerHTML = `
        <span>📷 已上传图片 (${this.currentImages.length}/${this.maxImages})</span>
        ${this.currentImages.length > 0 ? 
          `<button style="margin-left: auto; padding: 2px 8px; font-size: 11px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;" id="clearAllImages">清空所有</button>` : 
          ''}
      `;
      
      const clearAllBtn = document.getElementById('clearAllImages');
      if (clearAllBtn) {
        clearAllBtn.onclick = () => {
          this.clearCurrentImages();
        };
      }
      
      this.currentImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          position: relative;
        `;
        
        const img = document.createElement('img');
        img.src = image.thumbUrl;
        img.style.cssText = `
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 4px;
          margin-bottom: 5px;
        `;
        
        const fileName = document.createElement('div');
        fileName.textContent = image.name.length > 12 ? image.name.substring(0, 10) + '...' : image.name;
        fileName.style.cssText = `
          font-size: 11px;
          color: #495057;
          text-align: center;
          margin-bottom: 3px;
        `;
        
        const fileInfo = document.createElement('div');
        fileInfo.textContent = `${(image.size / 1024).toFixed(1)} KB`;
        fileInfo.style.cssText = `
          font-size: 10px;
          color: #6c757d;
        `;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '移除这张图片';
        deleteBtn.style.cssText = `
          position: absolute;
          top: 5px;
          right: 5px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s;
        `;
        deleteBtn.onmouseover = () => {
          deleteBtn.style.background = '#c82333';
        };
        deleteBtn.onmouseout = () => {
          deleteBtn.style.background = '#dc3545';
        };
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          this.removeImage(index);
        };
        
        imageItem.appendChild(img);
        imageItem.appendChild(fileName);
        imageItem.appendChild(fileInfo);
        imageItem.appendChild(deleteBtn);
        
        this.imagesGrid.appendChild(imageItem);
      });
      
      if (this.currentImages.length > 0) {
        this.imagePreviewContainer.style.display = 'flex';
      } else {
        this.imagePreviewContainer.style.display = 'none';
      }
    }

    async uploadImages() {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.style.display = "none";
        document.body.appendChild(input);

        input.onchange = async (e) => {
          const files = Array.from(e.target.files);
          
          if (files.length === 0) {
            this.addMessage('system', '未选择文件');
            document.body.removeChild(input);
            resolve();
            return;
          }
          
          const remainingSlots = this.maxImages - this.currentImages.length;
          if (files.length > remainingSlots) {
            this.addMessage('system', `最多只能上传${this.maxImages}张图片，当前已上传${this.currentImages.length}张`);
            document.body.removeChild(input);
            resolve();
            return;
          }
          
          const invalidFiles = files.filter(file => !this.isImageType(file.type));
          if (invalidFiles.length > 0) {
            this.addMessage('system', `有${invalidFiles.length}个文件不是图片格式，已跳过`);
            files.splice(files.indexOf(invalidFiles[0]), invalidFiles.length);
          }
          
          const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
          if (oversizedFiles.length > 0) {
            this.addMessage('system', `有${oversizedFiles.length}个图片太大（最大10MB），已跳过`);
            files.splice(files.indexOf(oversizedFiles[0]), oversizedFiles.length);
          }
          
          if (files.length === 0) {
            this.addMessage('system', '没有有效的图片文件');
            document.body.removeChild(input);
            resolve();
            return;
          }

          try {
            this.imagePreviewContainer.style.display = 'flex';
            this.imagesGrid.innerHTML = '';
            this.imageCountDisplay.innerHTML = `<span>📷 上传中... ${files.length}张图片</span>`;
            
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              
              this.imageCountDisplay.innerHTML = `<span>📷 上传中... ${i+1}/${files.length} (${file.name})</span>`;
              
              try {
                const data = await this.uploadImageToImgBB(file, file.name);
                
                this.currentImages.push({
                  url: data.url,
                  displayUrl: data.display_url,
                  thumbUrl: data.thumb.url,
                  deleteUrl: data.delete_url,
                  name: file.name,
                  size: file.size,
                  width: data.width,
                  height: data.height,
                  index: this.currentImages.length
                });
              } catch (error) {
                console.error(`图片上传失败: ${file.name}`, error);
                this.addMessage('system', `图片 ${file.name} 上传失败: ${error.message}`);
              }
            }
            
            this.updateImagePreview();
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message user';
            messageDiv.style.cssText = 'margin-bottom: 16px; max-width: 85%; margin-left: auto; animation: fadeIn 0.3s ease;';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.style.cssText = 'padding: 12px 16px; border-radius: 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-bottom-right-radius: 4px;';
            
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;';
            
            this.currentImages.slice(-files.length).forEach(image => {
              const imageItem = document.createElement('div');
              imageItem.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
              
              const messageImage = document.createElement('img');
              messageImage.src = image.thumbUrl;
              messageImage.style.cssText = 'width: 60px; height: 60px; object-fit: contain; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3);';
              
              const imageInfo = document.createElement('div');
              imageInfo.style.cssText = 'font-size: 10px; margin-top: 2px; text-align: center; max-width: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
              imageInfo.textContent = image.name;
              
              imageItem.appendChild(messageImage);
              imageItem.appendChild(imageInfo);
              imageContainer.appendChild(imageItem);
            });
            
            const text = document.createElement('div');
            text.textContent = `（已上传${files.length}张图片，点击发送按钮或按Enter键直接发送）`;
            text.style.cssText = 'font-size: 13px; opacity: 0.9; margin-top: 8px;';
            
            bubble.appendChild(imageContainer);
            bubble.appendChild(text);
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.style.cssText = 'font-size: 11px; color: #adb5bd; margin-top: 4px; text-align: right;';
            const now = new Date();
            timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            messageDiv.appendChild(bubble);
            messageDiv.appendChild(timeDiv);
            
            this.messagesDiv.appendChild(messageDiv);
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
            
          } catch (error) {
            console.error("上传失败:", error);
            this.addMessage('system', '上传失败: ' + error.message);
          } finally {
            document.body.removeChild(input);
            resolve();
          }
        };

        input.click();
        
        setTimeout(() => {
          if (document.body.contains(input)) {
            document.body.removeChild(input);
            if (!this.imageUploading) {
              resolve();
            }
          }
        }, 60000);
      });
    }

    removeImage(index) {
      if (index >= 0 && index < this.currentImages.length) {
        const removedImage = this.currentImages[index];
        this.currentImages.splice(index, 1);
        
        this.currentImages.forEach((img, i) => {
          img.index = i;
        });
        
        this.updateImagePreview();
        this.addMessage('system', `已移除图片: ${removedImage.name}`);
      }
    }

    clearCurrentImages() {
      if (this.currentImages.length > 0) {
        this.currentImages = [];
        this.updateImagePreview();
        this.addMessage('system', '已移除所有图片');
      }
    }

    getModelDisplayName(modelId) {
      return modelId.split('/').pop();
    }

    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .ai-message {
          margin-bottom: 16px;
          max-width: 85%;
          animation: fadeIn 0.3s ease;
        }
        
        .ai-message.user {
          margin-left: auto;
        }
        
        .ai-message.assistant {
          margin-right: auto;
        }
        
        .ai-message.system {
          margin: 0 auto;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
        
        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          line-height: 1.5;
        }
        
        .user .message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .assistant .message-bubble {
          background: #f1f3f5;
          color: #212529;
          border-bottom-left-radius: 4px;
        }
        
        .message-time {
          font-size: 11px;
          color: #adb5bd;
          margin-top: 4px;
          margin-left: 8px;
          margin-right: 8px;
        }
        
        .user .message-time {
          text-align: right;
        }
        
        .assistant .message-time {
          text-align: left;
        }
        
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6c757d;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* 思维链样式 */
        .reasoning-content {
          color: #6c757d;
          font-style: italic;
          border-left: 3px solid #adb5bd;
          padding-left: 10px;
          margin-bottom: 10px;
          background: rgba(248, 249, 250, 0.5);
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.9em;
          line-height: 1.4;
        }
        
        .final-content {
          color: #212529;
        }
        
        /* 模型水印样式 */
        .model-watermark {
          color: #6c757d;
          font-size: 0.8em;
          font-style: italic;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #dee2e6;
        }
        
        .model-watermark strong {
          color: #495057;
          font-weight: bold;
        }
        
        /* 滚动条样式 */
        .ai-panel-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .ai-panel-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .ai-panel-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .ai-panel-messages::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* 温度滑块样式 */
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, #4CAF50, #FF9800, #F44336);
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        /* 高级设置面板动画 */
        .advanced-settings-panel {
          transition: all 0.3s ease;
        }
        
        /* 模型下拉框样式 */
        select optgroup {
          font-weight: bold;
          color: #495057;
          background: #f8f9fa;
          padding: 5px;
        }
        
        /* 格式化内容样式 */
        .formatted-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .formatted-content h1,
        .formatted-content h2,
        .formatted-content h3,
        .formatted-content h4 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: bold;
        }
        
        .formatted-content h1 { font-size: 1.5em; }
        .formatted-content h2 { font-size: 1.3em; }
        .formatted-content h3 { font-size: 1.1em; }
        
        .formatted-content p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        
        .formatted-content ul,
        .formatted-content ol {
          margin-bottom: 1em;
          padding-left: 2em;
        }
        
        .formatted-content li {
          margin-bottom: 0.5em;
        }
        
        .formatted-content blockquote {
          border-left: 3px solid #ccc;
          padding-left: 1em;
          margin: 1em 0;
          color: #666;
        }
        
        .formatted-content code {
          background-color: #f1f3f5;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
        }
        
        .formatted-content pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 1em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .formatted-content pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .formatted-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .formatted-content th,
        .formatted-content td {
          border: 1px solid #dee2e6;
          padding: 0.75em;
          text-align: left;
        }
        
        .formatted-content th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
      
      this.messagesDiv.className = 'ai-panel-messages';
      this.advancedSettingsPanel.className = 'advanced-settings-panel';
      this.imagePreviewContainer.className = 'image-preview-container';
      this.modelDescriptionContainer.className = 'model-description-container';
      this.modelDescriptionText.className = 'model-description-text';
      this.imagesGrid.id = 'imagesGrid';
    }

    toggleAdvancedSettings() {
      this.isAdvancedSettingsVisible = !this.isAdvancedSettingsVisible;
      if (this.isAdvancedSettingsVisible) {
        this.advancedSettingsPanel.style.display = 'flex';
        this.advancedSettingsBtn.textContent = '隐藏设置';
      } else {
        this.advancedSettingsPanel.style.display = 'none';
        this.advancedSettingsBtn.textContent = '高级设置';
      }
    }

    togglePanel() {
      if (this.isPanelVisible) {
        this.hidePanel();
      } else {
        this.showPanel();
      }
    }

    showPanel() {
      this.isPanelVisible = true;
      this.overlay.style.display = 'block';
      this.panel.style.display = 'flex';
      
      this.updateImageUploadButtonVisibility();
      this.updateReasoningVisibility();
      this.updateImagePreview();
      this.updateModelDescription();
      
      if (this.pendingResponse.isPending) {
        this.responseStatusIndicator.textContent = '后台响应中...';
        this.responseStatusIndicator.style.display = 'inline';
        this.responseStatusIndicator.classList.add('response-status');
        
        this.updatePendingResponseDisplay();
        
        if (!this.pendingResponse.isComplete) {
          this.startStreaming();
        }
      } else {
        this.responseStatusIndicator.style.display = 'none';
        this.responseStatusIndicator.classList.remove('response-status');
      }
      
      setTimeout(() => {
        this.searchInput.focus();
      }, 100);
    }

    hidePanel() {
      this.isPanelVisible = false;
      this.overlay.style.display = 'none';
      this.panel.style.display = 'none';
      
      this.searchInput.value = '';
      this.searchQuery = '';
      this.clearSearchBtn.style.display = 'none';
      this.searchResultDiv.style.display = 'none';
      this.searchActive = false;
      this.populateModelSelect();
      
      if (this.pendingResponse.isPending) {
        this.responseStatusIndicator.style.display = 'none';
      }
    }

    addMessage(role, content, isStreaming = false, reasoningContent = '') {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ai-message ${role}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      
      if (role === 'assistant' && reasoningContent && this.showReasoningContent) {
        const reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning-content';
        reasoningDiv.textContent = reasoningContent;
        bubble.appendChild(reasoningDiv);
        
        const finalDiv = document.createElement('div');
        finalDiv.className = 'final-content';
        
        if (isStreaming) {
          const typingDiv = document.createElement('div');
          typingDiv.className = 'typing-indicator';
          typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          `;
          finalDiv.appendChild(typingDiv);
        } else {
          if (this.autoFormatMarkdown || this.autoFormatCode) {
            finalDiv.className += ' formatted-content';
          }
          finalDiv.innerHTML = this.formatContent(content);
        }
        
        bubble.appendChild(finalDiv);
      } else {
        if (isStreaming) {
          const typingDiv = document.createElement('div');
          typingDiv.className = 'typing-indicator';
          typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          `;
          bubble.appendChild(typingDiv);
        } else {
          if (role === 'assistant' && (this.autoFormatMarkdown || this.autoFormatCode)) {
            bubble.className += ' formatted-content';
          }
          
          if (role === 'assistant' && (this.autoFormatMarkdown || this.autoFormatCode)) {
            bubble.innerHTML = this.formatContent(content);
          } else {
            bubble.textContent = content;
          }
        }
      }
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      const now = new Date();
      timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      messageDiv.appendChild(bubble);
      messageDiv.appendChild(timeDiv);
      
      if (this.isPanelVisible) {
        this.messagesDiv.appendChild(messageDiv);
      }
      
      if (this.messagesDiv) {
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
      }
      
      return { messageDiv, bubble };
    }

    formatContent(content) {
      if (!content) return '';
      
      let formatted = content;
      
      if (this.autoFormatMarkdown) {
        formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          if (this.autoFormatCode) {
            return `<pre><code class="language-${lang || 'text'}">${this.escapeHtml(code.trim())}</code></pre>`;
          }
          return match;
        });
        
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        formatted = formatted.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
        
        formatted = formatted.replace(/^\s*[-*+] (.*$)/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
          return `<ul>${match}</ul>`;
        });
        
        formatted = formatted.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
          return `<ol>${match}</ol>`;
        });
        
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;">');
        
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        if (!formatted.startsWith('<h') && !formatted.startsWith('<ul') && 
            !formatted.startsWith('<ol') && !formatted.startsWith('<blockquote') &&
            !formatted.startsWith('<pre') && !formatted.startsWith('<img')) {
          formatted = '<p>' + formatted + '</p>';
        }
      }
      
      if (this.autoFormatCode) {
        formatted = formatted.replace(/<pre><code class="language-(\w+)">/g, (match, lang) => {
          return `<pre><code class="language-${lang}">`;
        });
      }
      
      return formatted;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    updateMessage(bubble, newContent, newReasoningContent = '') {
      let reasoningDiv = bubble.querySelector('.reasoning-content');
      let finalDiv = bubble.querySelector('.final-content');
      
      if (reasoningDiv && finalDiv) {
        if (newReasoningContent) {
          reasoningDiv.textContent = newReasoningContent;
        }
        
        if (this.autoFormatMarkdown || this.autoFormatCode) {
          finalDiv.className = 'final-content formatted-content';
          finalDiv.innerHTML = this.formatContent(newContent);
        } else {
          finalDiv.textContent = newContent;
        }
      } else if (newReasoningContent && this.showReasoningContent) {
        bubble.innerHTML = '';
        
        const reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning-content';
        reasoningDiv.textContent = newReasoningContent;
        bubble.appendChild(reasoningDiv);
        
        const finalDiv = document.createElement('div');
        finalDiv.className = 'final-content';
        
        if (this.autoFormatMarkdown || this.autoFormatCode) {
          finalDiv.className += ' formatted-content';
          finalDiv.innerHTML = this.formatContent(newContent);
        } else {
          finalDiv.textContent = newContent;
        }
        
        bubble.appendChild(finalDiv);
      } else {
        if (bubble.classList.contains('formatted-content')) {
          bubble.innerHTML = this.formatContent(newContent);
        } else {
          bubble.textContent = newContent;
        }
      }
      
      if (this.messagesDiv) {
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
      }
    }

    startStreaming() {
      this.isStreaming = true;
      this.sendButton.disabled = true;
      this.stopButton.style.display = 'flex';
      this.inputField.disabled = true;
      this.imageUploadBtn.disabled = true;
    }

    stopStreaming() {
      this.isStreaming = false;
      this.sendButton.disabled = false;
      this.stopButton.style.display = 'none';
      this.inputField.disabled = false;
      this.imageUploadBtn.disabled = false;
      
      if (this.pendingResponse.isPending && !this.pendingResponse.isComplete) {
        this.responseStatusIndicator.textContent = '后台响应中...';
        this.responseStatusIndicator.style.display = 'inline';
      } else {
        this.responseStatusIndicator.style.display = 'none';
      }
      
      if (this.isPanelVisible) {
        setTimeout(() => {
          this.inputField.focus();
        }, 100);
      }
    }

    async sendMessage() {
      const userInput = this.inputField.value.trim();
      
      const isMultimodal = this.multimodalModels.includes(this.currentModel);
      
      if (!isMultimodal && !userInput) {
        return;
      }
      
      if (!userInput && this.currentImages.length === 0) {
        return;
      }
      
      if (this.isStreaming && this.pendingResponse.isPending && !this.pendingResponse.isComplete) {
        this.addMessage('system', '请等待当前回复完成后再发送新消息');
        return;
      }
      
      this.inputField.value = '';
      this.inputField.style.height = 'auto';
      
      const messageContent = [];
      
      if (this.currentImages.length > 0) {
        this.currentImages.forEach(image => {
          messageContent.push({
            type: "image_url",
            image_url: {
              url: image.displayUrl,
              detail: "auto"
            }
          });
        });
      }
      
      if (userInput) {
        messageContent.push({
          type: "text",
          text: userInput
        });
      }
      
      this.conversationHistory.push({ 
        role: 'user', 
        content: messageContent
      });
      
      if (this.conversationHistory.length > this.maxHistoryLength * 2) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
      }
      
      if (this.currentImages.length > 0) {
        let displayText = userInput;
        if (!displayText && this.currentImages.length === 1) {
          displayText = "[图片分析]";
        } else if (!displayText && this.currentImages.length > 1) {
          displayText = `[${this.currentImages.length}张图片分析]`;
        }
        this.addImageMessage('user', displayText);
      } else {
        this.addMessage('user', userInput);
      }
      
      const isReasoningModel = this.reasoningModels.includes(this.currentModel);
      
      const { messageDiv, bubble } = this.addMessage('assistant', '', true);
      
      this.pendingResponse = {
        isPending: true,
        fullResponse: '',
        fullReasoningResponse: '',
        currentDisplayed: '',
        currentReasoningDisplayed: '',
        model: this.currentModel,
        messageId: Date.now(),
        bubble: bubble,
        messageDiv: messageDiv,
        streamReader: null,
        controller: null,
        startTime: Date.now(),
        isComplete: false
      };
      
      if (this.isPanelVisible && this.enableStreaming) {
        this.startStreaming();
      }
      
      try {
        let systemPrompt = this.customSystemPrompt;
        
        if (!systemPrompt.includes(this.getModelDisplayName(this.currentModel))) {
          systemPrompt = `${systemPrompt}\n\n当前使用模型：${this.getModelDisplayName(this.currentModel)}。`;
        }
        
        if (this.currentModel.includes('Coder') || this.currentModel.includes('Code')) {
          systemPrompt += " 你特别擅长编程和代码相关的问题，可以提供详细的代码示例和解释。";
        }
        
        if (this.currentImages.length > 0 && this.multimodalModels.includes(this.currentModel)) {
          if (userInput) {
            systemPrompt += " 用户上传了图片，请仔细分析图片内容并结合用户的问题给出详细的回答。";
          } else {
            if (this.currentImages.length === 1) {
              systemPrompt += " 用户上传了一张图片，请仔细分析图片内容，提供详细的描述和相关信息。";
            } else {
              systemPrompt += ` 用户上传了${this.currentImages.length}张图片，请仔细分析这些图片内容，进行对比分析，提供详细的描述和相关信息。`;
            }
          }
        }
        
        // 使用当前有效的API密钥
        const effectiveApiKey = this.userApiKey || this.currentApiKey;
        
        const requestBody = {
          model: this.currentModel,
          messages: [
            { 
              role: 'system', 
              content: systemPrompt
            },
            ...this.conversationHistory
          ],
          stream: this.enableStreaming,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          top_p: this.topP,
          frequency_penalty: this.frequencyPenalty
        };
        
        if (isReasoningModel && this.enableReasoning) {
          requestBody.extra_body = {
            thinking_budget: this.thinkingBudget
          };
        }
        
        const controller = new AbortController();
        this.pendingResponse.controller = controller;
        
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveApiKey}`
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        if (this.enableStreaming) {
          await this.handleStreamingResponse(response, bubble, isReasoningModel);
        } else {
          await this.handleNonStreamingResponse(response, bubble, isReasoningModel);
        }
        
      } catch (error) {
        console.error('AI请求错误:', error);
        this.pendingResponse.isComplete = true;
        this.pendingResponse.fullResponse = `抱歉，出现错误: ${error.message}`;
        this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
        
        if (this.isPanelVisible) {
          this.updateMessage(bubble, this.pendingResponse.fullResponse);
          this.addMessage('system', `请求错误: ${error.message}`);
        }
        
        this.finalizePendingResponse();
        
        if (this.isPanelVisible) {
          this.stopStreaming();
        }
      }
    }

    async handleStreamingResponse(response, bubble, isReasoningModel) {
      const reader = response.body.getReader();
      this.pendingResponse.streamReader = reader;
      const decoder = new TextDecoder();
      
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              this.pendingResponse.isComplete = true;
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6);
                
                if (data === '[DONE]') {
                  this.pendingResponse.isComplete = true;
                  break;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0].delta) {
                    const delta = parsed.choices[0].delta;
                    
                    if (delta.reasoning_content) {
                      this.pendingResponse.fullReasoningResponse += delta.reasoning_content;
                      this.pendingResponse.currentReasoningDisplayed = this.pendingResponse.fullReasoningResponse;
                    }
                    
                    if (delta.content) {
                      this.pendingResponse.fullResponse += delta.content;
                      this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
                    }
                    
                    if (this.isPanelVisible) {
                      if (isReasoningModel && this.showReasoningContent) {
                        this.updateMessage(bubble, this.pendingResponse.currentDisplayed, this.pendingResponse.currentReasoningDisplayed);
                      } else {
                        this.updateMessage(bubble, this.pendingResponse.currentDisplayed);
                      }
                    }
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
            
            if (this.pendingResponse.isComplete) {
              break;
            }
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('请求被取消');
            this.pendingResponse.isComplete = true;
            this.pendingResponse.fullResponse += '\n\n[回复被中断]';
            this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
            
            if (this.isPanelVisible) {
              this.updateMessage(bubble, this.pendingResponse.currentDisplayed, this.pendingResponse.currentReasoningDisplayed);
              this.addMessage('system', '对话��消');
            }
          } else {
            console.error('流式处理错误:', error);
            this.pendingResponse.isComplete = true;
            this.pendingResponse.fullResponse += `\n\n[错误: ${error.message}]`;
            this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
            
            if (this.isPanelVisible) {
              this.updateMessage(bubble, this.pendingResponse.currentDisplayed, this.pendingResponse.currentReasoningDisplayed);
              this.addMessage('system', `抱歉，出现错误: ${error.message}`);
            }
          }
        } finally {
          // 在最终化前添加模型水印
          if (this.pendingResponse.fullResponse && this.showModelWatermark) {
            this.pendingResponse.fullResponse = this.addModelWatermark(
              this.pendingResponse.fullResponse, 
              this.pendingResponse.model
            );
            this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
          }
          
          this.finalizePendingResponse();
          
          if (this.isPanelVisible && this.pendingResponse.bubble) {
            this.updatePendingResponseDisplay();
            this.stopStreaming();
          }
        }
      };
      
      processStream();
    }

    async handleNonStreamingResponse(response, bubble, isReasoningModel) {
      try {
        const result = await response.json();
        
        if (result.choices && result.choices.length > 0) {
          let aiResponse = result.choices[0].message.content;
          const reasoningContent = result.choices[0].message.reasoning_content || '';
          
          // 添加模型水印
          if (this.showModelWatermark) {
            aiResponse = this.addModelWatermark(aiResponse, this.currentModel);
          }
          
          this.pendingResponse.fullResponse = aiResponse;
          this.pendingResponse.fullReasoningResponse = reasoningContent;
          this.pendingResponse.currentDisplayed = aiResponse;
          this.pendingResponse.currentReasoningDisplayed = reasoningContent;
          this.pendingResponse.isComplete = true;
          
          if (this.isPanelVisible) {
            if (isReasoningModel && this.showReasoningContent) {
              this.updateMessage(bubble, aiResponse, reasoningContent);
            } else {
              this.updateMessage(bubble, aiResponse);
            }
          }
        } else {
          throw new Error('未收到AI的有效回答');
        }
      } catch (error) {
        console.error('解析响应错误:', error);
        this.pendingResponse.isComplete = true;
        this.pendingResponse.fullResponse = `抱歉，出现错误: ${error.message}`;
        this.pendingResponse.currentDisplayed = this.pendingResponse.fullResponse;
        
        if (this.isPanelVisible) {
          this.updateMessage(bubble, this.pendingResponse.fullResponse);
          this.addMessage('system', `请求错误: ${error.message}`);
        }
      } finally {
        this.finalizePendingResponse();
        
        if (this.isPanelVisible) {
          this.stopStreaming();
        }
      }
    }

    addImageMessage(role, text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ai-message ${role}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      
      if (this.currentImages.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;';
        
        const recentImages = this.currentImages.slice(-this.currentImages.length);
        recentImages.forEach(image => {
          const imageItem = document.createElement('div');
          imageItem.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
          
          const messageImage = document.createElement('img');
          messageImage.src = image.thumbUrl;
          messageImage.style.cssText = 'width: 60px; height: 60px; object-fit: contain; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3);';
          
          const imageInfo = document.createElement('div');
          imageInfo.style.cssText = 'font-size: 10px; margin-top: 2px; text-align: center; max-width: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
          imageInfo.textContent = image.name;
          
          imageItem.appendChild(messageImage);
          imageItem.appendChild(imageInfo);
          imageContainer.appendChild(imageItem);
        });
        
        bubble.appendChild(imageContainer);
      }
      
      if (text) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        bubble.appendChild(textElement);
      }
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      const now = new Date();
      timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      messageDiv.appendChild(bubble);
      messageDiv.appendChild(timeDiv);
      
      if (this.isPanelVisible) {
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
      }
      
      return { messageDiv, bubble };
    }

    getInfo() {
      const modelMenuItems = this.availableModels.map(model => {
        const modelName = this.getModelDisplayName(model);
        return { text: modelName, value: model };
      });

      return {
        id: 'aiAssistantPanel',
        name: 'AI对话面板',
        description: `在Scratch中添加AI对话面板，支持${this.totalModels}个模型和流式输出`,
        color1: '#667eea',
        color2: '#764ba2',
        blocks: [
          {
            opcode: 'showAIPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示AI对话面板'
          },
          {
            opcode: 'hideAIPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏AI对话面板'
          },
          {
            opcode: 'sendAIMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: '向AI发送消息 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好'
              }
            }
          },
          // ========== 新增：自定义API密钥积木 ==========
          {
            opcode: 'setCustomApiKey',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置自定义API密钥 [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'sk-your-api-key-here'
              }
            }
          },
          {
            opcode: 'clearCustomApiKey',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除自定义API密钥'
          },
          {
            opcode: 'getApiKeyStatus',
            blockType: Scratch.BlockType.REPORTER,
            text: 'API密钥状态'
          },
          // ========== 新增：模型水印控制积木 ==========
          {
            opcode: 'setModelWatermark',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示模型水印 [SHOW]',
            arguments: {
              SHOW: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getModelWatermark',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否显示模型水印'
          },
          {
            opcode: 'setWatermarkPrefix',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置水印前缀 [PREFIX]',
            arguments: {
              PREFIX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '由'
              }
            }
          },
          {
            opcode: 'setWatermarkSuffix',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置水印后缀 [SUFFIX]',
            arguments: {
              SUFFIX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '生成'
              }
            }
          },
          {
            opcode: 'getCurrentModel',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前AI模型'
          },
          {
            opcode: 'setModel',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置AI模型 [MODEL]',
            arguments: {
              MODEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'modelMenu'
              }
            }
          },
          {
            opcode: 'setTemperature',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置温度 [TEMPERATURE]',
            arguments: {
              TEMPERATURE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.7
              }
            }
          },
          {
            opcode: 'getTemperature',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前温度'
          },
          {
            opcode: 'setMaxTokens',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置最大长度 [MAXTOKENS]',
            arguments: {
              MAXTOKENS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'getMaxTokens',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前最大长度'
          },
          {
            opcode: 'setTopP',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核采样 [TOP_P]',
            arguments: {
              TOP_P: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.9
              }
            }
          },
          {
            opcode: 'getTopP',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前核采样'
          },
          {
            opcode: 'setFrequencyPenalty',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置频率惩罚 [PENALTY]',
            arguments: {
              PENALTY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.0
              }
            }
          },
          {
            opcode: 'getFrequencyPenalty',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前频率惩罚'
          },
          {
            opcode: 'setThinkingBudget',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置思维链长度 [BUDGET]',
            arguments: {
              BUDGET: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1024
              }
            }
          },
          {
            opcode: 'getThinkingBudget',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前思维链长度'
          },
          {
            opcode: 'setShowReasoning',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示思维链内容 [SHOW]',
            arguments: {
              SHOW: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getShowReasoning',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否显示思维链'
          },
          {
            opcode: 'setEnableReasoning',
            blockType: Scratch.BlockType.COMMAND,
            text: '启用思维链 [ENABLE]',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getEnableReasoning',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否启用思维链'
          },
          {
            opcode: 'setSystemPrompt',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置系统提示词 [PROMPT]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你是一个友好、专业的AI助手。请用中文回答用户的问题，并根据问题类型提供详细、准确的回答。'
              }
            }
          },
          {
            opcode: 'getSystemPrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前系统提示词'
          },
          {
            opcode: 'setMaxHistoryLength',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置上下文长度 [LENGTH]',
            arguments: {
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'getMaxHistoryLength',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前上下文长度'
          },
          {
            opcode: 'setEnableStreaming',
            blockType: Scratch.BlockType.COMMAND,
            text: '启用流式输出 [ENABLE]',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getEnableStreaming',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否启用流式输出'
          },
          {
            opcode: 'setAutoFormatMarkdown',
            blockType: Scratch.BlockType.COMMAND,
            text: '自动格式化Markdown [ENABLE]',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getAutoFormatMarkdown',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否自动格式化Markdown'
          },
          {
            opcode: 'setAutoFormatCode',
            blockType: Scratch.BlockType.COMMAND,
            text: '自动格式化代码 [ENABLE]',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'booleanMenu'
              }
            }
          },
          {
            opcode: 'getAutoFormatCode',
            blockType: Scratch.BlockType.REPORTER,
            text: '是否自动格式化代码'
          },
          {
            opcode: 'clearHistory',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空对话历史'
          },
          {
            opcode: 'getHistoryCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '对话历史数量'
          },
          {
            opcode: 'getModelCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '可用模型数量'
          },
          {
            opcode: 'isReasoningModel',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '当前模型支持思维链?'
          },
          {
            opcode: 'getImageCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前图片数量'
          },
          {
            opcode: 'clearImages',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除所有图片'
          },
          {
            opcode: 'isMultimodalModel',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '当前是多模态模型?'
          },
          {
            opcode: 'isResponsePending',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '有未完成的AI回复?'
          },
          {
            opcode: 'getPendingResponseLength',
            blockType: Scratch.BlockType.REPORTER,
            text: '未完成回复的长度'
          }
        ],
        menus: {
          modelMenu: {
            acceptReporters: false,
            items: modelMenuItems
          },
          booleanMenu: {
            acceptReporters: false,
            items: [
              { text: '是', value: 'true' },
              { text: '否', value: 'false' }
            ]
          }
        }
      };
    }

    // ========== 新增：API密钥管理方法 ==========
    setCustomApiKey(args) {
      const key = args.KEY.trim();
      
      if (!key) {
        this.userApiKey = '';
        this.currentApiKey = this.defaultApiKey;
        return '已清除自定义API密钥，使用默认密钥';
      }
      
      if (!key.startsWith('sk-')) {
        return 'API密钥格式错误，应以"sk-"开头';
      }
      
      this.userApiKey = key;
      this.currentApiKey = key;
      
      // 安全地显示部分密钥用于确认
      const maskedKey = key.substring(0, 8) + '...' + key.substring(key.length - 4);
      return `自定义API密钥已设置: ${maskedKey}`;
    }

    clearCustomApiKey() {
      this.userApiKey = '';
      this.currentApiKey = this.defaultApiKey;
      return '已清除自定义API密钥，恢复使用默认密钥';
    }

    getApiKeyStatus() {
      if (this.userApiKey) {
        const maskedKey = this.userApiKey.substring(0, 8) + '...' + this.userApiKey.substring(this.userApiKey.length - 4);
        return `使用自定义密钥: ${maskedKey}`;
      } else {
        const maskedKey = this.defaultApiKey.substring(0, 8) + '...' + this.defaultApiKey.substring(this.defaultApiKey.length - 4);
        return `使用默认密钥: ${maskedKey}`;
      }
    }

    // ========== 新增：模型水印控制方法 ==========
    setModelWatermark(args) {
      const show = args.SHOW === 'true';
      this.showModelWatermark = show;
      return `模型水印已${show ? '开启' : '关闭'}`;
    }

    getModelWatermark() {
      return this.showModelWatermark;
    }

    setWatermarkPrefix(args) {
      const prefix = args.PREFIX.trim();
      if (prefix) {
        this.watermarkPrefix = prefix;
        return `水印前缀已设置为: ${prefix}`;
      }
      return '水印前缀不能为空';
    }

    setWatermarkSuffix(args) {
      const suffix = args.SUFFIX.trim();
      if (suffix) {
        this.watermarkSuffix = suffix;
        return `水印后缀已设置为: ${suffix}`;
      }
      return '水印后缀不能为空';
    }

    // ========== 原有积木方法 ==========
    showAIPanel() {
      this.showPanel();
      return '';
    }

    hideAIPanel() {
      this.hidePanel();
      return '';
    }

    async sendAIMessage(args) {
      const message = args.MESSAGE;
      
      if (!message.trim()) return '请输入消息';
      
      this.conversationHistory.push({ role: 'user', content: message });
      
      try {
        let systemPrompt = this.customSystemPrompt;
        if (!systemPrompt.includes(this.getModelDisplayName(this.currentModel))) {
          systemPrompt = `${systemPrompt}\n\n当前使用模型：${this.getModelDisplayName(this.currentModel)}。`;
        }
        
        // 使用当前有效的API密钥
        const effectiveApiKey = this.userApiKey || this.currentApiKey;
        
        const requestBody = {
          model: this.currentModel,
          messages: [
            { 
              role: 'system', 
              content: systemPrompt
            },
            ...this.conversationHistory.slice(-this.maxHistoryLength * 2)
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          top_p: this.topP,
          frequency_penalty: this.frequencyPenalty
        };
        
        const isReasoningModel = this.reasoningModels.includes(this.currentModel);
        
        if (isReasoningModel && this.enableReasoning) {
          requestBody.extra_body = {
            thinking_budget: this.thinkingBudget
          };
        }
        
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveApiKey}`
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.choices && result.choices.length > 0) {
          let aiResponse = result.choices[0].message.content;
          const reasoningContent = result.choices[0].message.reasoning_content || '';
          
          // 添加模型水印
          if (this.showModelWatermark) {
            aiResponse = this.addModelWatermark(aiResponse, this.currentModel);
          }
          
          this.conversationHistory.push({ 
            role: 'assistant', 
            content: aiResponse,
            ...(reasoningContent && { reasoning_content: reasoningContent })
          });
          
          if (reasoningContent && this.showReasoningContent) {
            return `[思维链] ${reasoningContent}\n\n[回答] ${aiResponse}`;
          } else {
            return aiResponse;
          }
        } else {
          return '未收到AI的有效回答';
        }
      } catch (error) {
        console.error('AI请求错误:', error);
        return `出错了: ${error.message}`;
      }
    }

    setModel(args) {
      const model = args.MODEL;
      if (this.availableModels.includes(model)) {
        this.currentModel = model;
        if (this.modelSelect) {
          this.modelSelect.value = model;
          this.updateImageUploadButtonVisibility();
          this.updateReasoningVisibility();
          this.updateModelDescription();
        }
        return `模型已切换为: ${this.getModelDisplayName(model)}`;
      }
      return '无效的模型';
    }

    getCurrentModel() {
      return this.getModelDisplayName(this.currentModel);
    }

    setTemperature(args) {
      let temperature = parseFloat(args.TEMPERATURE);
      
      if (isNaN(temperature)) {
        return '温度必须是数字';
      }
      
      if (temperature < 0) {
        temperature = 0;
      } else if (temperature > 2) {
        temperature = 2;
      }
      
      this.temperature = temperature;
      
      if (this.tempInput) {
        this.tempInput.value = temperature;
        this.tempValueDisplay.textContent = temperature.toFixed(1);
      }
      
      return `温度已设置为: ${temperature.toFixed(1)}`;
    }

    getTemperature() {
      return this.temperature;
    }

    setMaxTokens(args) {
      let maxTokens = parseInt(args.MAXTOKENS);
      
      if (isNaN(maxTokens)) {
        return '最大长度必须是数字';
      }
      
      if (maxTokens < 1) {
        maxTokens = 1;
      } else if (maxTokens > 8192) {
        maxTokens = 8192;
      }
      
      this.maxTokens = maxTokens;
      
      if (this.maxTokensInput) {
        this.maxTokensInput.value = maxTokens;
      }
      
      return `最大长度已设置为: ${maxTokens}`;
    }

    getMaxTokens() {
      return this.maxTokens;
    }

    setTopP(args) {
      let topP = parseFloat(args.TOP_P);
      
      if (isNaN(topP)) {
        return '核采样必须是数字';
      }
      
      if (topP < 0) {
        topP = 0;
      } else if (topP > 1) {
        topP = 1;
      }
      
      this.topP = topP;
      
      if (this.topPInput) {
        this.topPInput.value = topP;
        this.topPValueDisplay.textContent = topP.toFixed(2);
      }
      
      return `核采样已设置为: ${topP.toFixed(2)}`;
    }

    getTopP() {
      return this.topP;
    }

    setFrequencyPenalty(args) {
      let penalty = parseFloat(args.PENALTY);
      
      if (isNaN(penalty)) {
        return '频率惩罚必须是数字';
      }
      
      if (penalty < -2) {
        penalty = -2;
      } else if (penalty > 2) {
        penalty = 2;
      }
      
      this.frequencyPenalty = penalty;
      
      if (this.freqPenaltyInput) {
        this.freqPenaltyInput.value = penalty;
        this.freqPenaltyValueDisplay.textContent = penalty.toFixed(1);
      }
      
      return `频率惩罚已设置为: ${penalty.toFixed(1)}`;
    }

    getFrequencyPenalty() {
      return this.frequencyPenalty;
    }

    setThinkingBudget(args) {
      let budget = parseInt(args.BUDGET);
      
      if (isNaN(budget)) {
        return '思维链长度必须是数字';
      }
      
      if (budget < 0) {
        budget = 0;
      } else if (budget > 4096) {
        budget = 4096;
      }
      
      this.thinkingBudget = budget;
      
      if (this.thinkingBudgetInput) {
        this.thinkingBudgetInput.value = budget;
      }
      
      return `思维链长度已设置为: ${budget}`;
    }

    getThinkingBudget() {
      return this.thinkingBudget;
    }

    setShowReasoning(args) {
      const show = args.SHOW === 'true';
      this.showReasoningContent = show;
      
      if (this.showReasoningCheckbox) {
        this.showReasoningCheckbox.checked = show;
      }
      
      return `思维链显示已${show ? '开启' : '关闭'}`;
    }

    getShowReasoning() {
      return this.showReasoningContent;
    }

    setEnableReasoning(args) {
      const enable = args.ENABLE === 'true';
      this.enableReasoning = enable;
      
      if (this.enableReasoningCheckbox) {
        this.enableReasoningCheckbox.checked = enable;
      }
      
      return `思维链启用已${enable ? '开启' : '关闭'}`;
    }

    getEnableReasoning() {
      return this.enableReasoning;
    }

    setSystemPrompt(args) {
      const prompt = args.PROMPT;
      this.customSystemPrompt = prompt;
      
      if (this.systemPromptTextarea) {
        this.systemPromptTextarea.value = prompt;
      }
      
      return '系统提示词已更新';
    }

    getSystemPrompt() {
      return this.customSystemPrompt;
    }

    setMaxHistoryLength(args) {
      let length = parseInt(args.LENGTH);
      
      if (isNaN(length)) {
        return '上下文长度必须是数字';
      }
      
      if (length < 1) {
        length = 1;
      } else if (length > 50) {
        length = 50;
      }
      
      this.maxHistoryLength = length;
      
      if (this.contextLengthInput) {
        this.contextLengthInput.value = length;
      }
      
      return `上下文长度已设置为: ${length}条消息`;
    }

    getMaxHistoryLength() {
      return this.maxHistoryLength;
    }

    setEnableStreaming(args) {
      const enable = args.ENABLE === 'true';
      this.enableStreaming = enable;
      
      if (this.streamingCheckbox) {
        this.streamingCheckbox.checked = enable;
      }
      
      return `流式输出已${enable ? '开启' : '关闭'}`;
    }

    getEnableStreaming() {
      return this.enableStreaming;
    }

    setAutoFormatMarkdown(args) {
      const enable = args.ENABLE === 'true';
      this.autoFormatMarkdown = enable;
      
      if (this.markdownCheckbox) {
        this.markdownCheckbox.checked = enable;
      }
      
      return `Markdown格式化已${enable ? '开启' : '关闭'}`;
    }

    getAutoFormatMarkdown() {
      return this.autoFormatMarkdown;
    }

    setAutoFormatCode(args) {
      const enable = args.ENABLE === 'true';
      this.autoFormatCode = enable;
      
      if (this.codeCheckbox) {
        this.codeCheckbox.checked = enable;
      }
      
      return `代码格式化已${enable ? '开启' : '关闭'}`;
    }

    getAutoFormatCode() {
      return this.autoFormatCode;
    }

    clearHistory() {
      if (this.pendingResponse.controller) {
        this.pendingResponse.controller.abort();
      }
      this.pendingResponse.isPending = false;
      this.conversationHistory = [];
      if (this.messagesDiv) {
        this.messagesDiv.innerHTML = '';
        this.addMessage('system', '对话历史已清空');
      }
      return '对话历史已清空';
    }

    getHistoryCount() {
      return Math.floor(this.conversationHistory.length / 2);
    }

    getModelCount() {
      return this.availableModels.length;
    }

    isReasoningModel() {
      return this.reasoningModels.includes(this.currentModel);
    }

    getImageCount() {
      return this.currentImages.length;
    }

    clearImages() {
      this.clearCurrentImages();
      return '已清除所有图片';
    }

    isMultimodalModel() {
      return this.multimodalModels.includes(this.currentModel);
    }

    isResponsePending() {
      return this.pendingResponse.isPending && !this.pendingResponse.isComplete;
    }

    getPendingResponseLength() {
      if (this.pendingResponse.isPending) {
        return this.pendingResponse.fullResponse.length;
      }
      return 0;
    }
  }

  // 注册扩展
  Scratch.extensions.register(new AIExtension());
})(Scratch);
