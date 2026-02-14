class AIExtension {
    constructor() {
        this.conversationHistory = [];
        this.apiUrl = "https://api.siliconflow.cn/v1/chat/completions";
        this.apiKey = "sk-dkfljmqzdwmxglfyxpdtmnsbsphilsrxgndpsazpkwqnkqyr";
        this.model = "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B";
        this.maxHistoryLength = 5;
        this.isTruncationEnabled = true;
        
        // 智能体相关设置
        this.agents = {
            "AI助手": {
                id: "assistant_001",
                name: "AI助手",
                personality: "专业、友好、乐于助人",
                temperature: 0.7,
                systemPrompt: "你是一个友好的AI助手，请用中文回答用户的问题。",
                conversationHistory: [],
                type: "individual"
            }
        };
        this.activeAgent = "AI助手";
        this.nextAgentId = 2;
        
        // 群聊相关设置
        this.groups = {
            "群聊": {
                id: "group_001",
                name: "群聊",
                members: ["AI助手"],
                conversationHistory: [],
                activeMembers: [],
                systemPrompt: "这是一个AI群聊，多个AI助手将一起讨论问题。",
                maxResponses: 3
            }
        };
        this.activeGroup = "群聊";
        this.nextGroupId = 2;
    }

    getInfo() {
        return {
            id: 'newaiTool',
            name: 'AI智能体工具',
            description: '多智能体AI对话和群聊工具',
            blocks: [
                // 智能体配置区块
                {
                    opcode: 'prompt',
                    blockType: Scratch.BlockType.LABEL,
                    text: '=== 智能体管理 ==='
                },
                {
                    opcode: 'addNewAgent',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '添加新智能体ID [ID] 名叫 [NAME]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'ID'
                        },
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '小智'
                        }
                    }
                },
                {
                    opcode: 'deleteAgent',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除智能体 [AGENT]',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'deleteAllAgents',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除所有智能体'
                },
                {
                    opcode: 'setAgentPersonality',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置智能体 [AGENT] 性格为 [PERSONALITY]',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        },
                        PERSONALITY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '专业、友好'
                        }
                    }
                },
                {
                    opcode: 'setSystemPrompt',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置智能体 [AGENT] 系统提示词 [PROMPT]',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        },
                        PROMPT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '你是一个AI助手'
                        }
                    }
                },
                {
                    opcode: 'setTemperature',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置智能体 [AGENT] 温度参数 [VALUE]',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0.7
                        }
                    }
                },
                {
                    opcode: 'saveAgentProfile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '保存智能体 [AGENT] 配置',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'loadAgentProfile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '加载智能体配置 [PROFILE]',
                    arguments: {
                        PROFILE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'agentMenu',
                            defaultValue: '助手'
                        }
                    }
                },
                {
                    opcode: 'getAgentCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '智能体数量'
                },
                {
                    opcode: 'getAgentList',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '智能体列表'
                },
                {
                    opcode: 'getAgentInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取智能体 [AGENT] 信息',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                
                // 群聊配置区块
                {
                    opcode: 'prompt2',
                    blockType: Scratch.BlockType.LABEL,
                    text: '=== 群聊管理 ==='
                },
                {
                    opcode: 'createGroup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '创建群聊 [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                {
                    opcode: 'deleteGroup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除群聊 [GROUP]',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                {
                    opcode: 'deleteAllGroups',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除所有群聊'
                },
                {
                    opcode: 'addAgentToGroup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '给群聊 [GROUP] 添加智能体 [AGENT]',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        },
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'removeAgentFromGroup',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '从群聊 [GROUP] 移除智能体 [AGENT]',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        },
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'getGroupMembers',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取群聊 [GROUP] 成员',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                {
                    opcode: 'getGroupCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '群聊数量'
                },
                {
                    opcode: 'getGroupList',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '群聊列表'
                },
                
                // 对话功能区块
                {
                    opcode: 'prompt3',
                    blockType: Scratch.BlockType.LABEL,
                    text: '=== 对话功能 ==='
                },
                {
                    opcode: 'sendToAI',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '向 [AGENT] 发送 [TEXT]',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        },
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '你好！'
                        }
                    }
                },
                {
                    opcode: 'sendToGroup',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '向群聊 [GROUP] 发送 [TEXT]',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        },
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '大家好！'
                        }
                    }
                },
                {
                    opcode: 'askAgentInGroup',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '在群聊 [GROUP] 中单独让智能体 [AGENT] 发话 [TEXT]',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        },
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        },
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '请发表你的看法'
                        }
                    }
                },
                
                // 历史管理区块
                {
                    opcode: 'prompt4',
                    blockType: Scratch.BlockType.LABEL,
                    text: '=== 历史管理 ==='
                },
                {
                    opcode: 'setMaxHistoryLength',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置最大上下文长度 [LENGTH] 轮',
                    arguments: {
                        LENGTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'toggleHistoryTruncation',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '切换历史截断 [STATE]',
                    arguments: {
                        STATE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'truncationMenu',
                            defaultValue: '启用'
                        }
                    }
                },
                {
                    opcode: 'clearAgentHistory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除智能体 [AGENT] 的历史',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'clearGroupHistory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除群聊 [GROUP] 的历史',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                {
                    opcode: 'clearAllHistory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除所有历史'
                },
                {
                    opcode: 'getAllHistory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取智能体 [AGENT] 的所有历史',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'getAllGroupHistory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取群聊 [GROUP] 的所有历史',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                
                // 信息查询区块
                {
                    opcode: 'prompt5',
                    blockType: Scratch.BlockType.LABEL,
                    text: '=== 信息查询 ==='
                },
                {
                    opcode: 'getHistoryCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '智能体 [AGENT] 的历史数量',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'getGroupHistoryCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '群聊 [GROUP] 的历史数量',
                    arguments: {
                        GROUP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '群聊'
                        }
                    }
                },
                {
                    opcode: 'getAgentConfig',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '智能体 [AGENT] 的配置',
                    arguments: {
                        AGENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'AI助手'
                        }
                    }
                },
                {
                    opcode: 'showAPIInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '显示API配置信息'
                }
            ],
            menus: {
                truncationMenu: ['启用', '禁用'],
                agentMenu: ['助手', '老师', '朋友', '专家']
            }
        };
    }

    async sendToAI(args) {
        const userInput = args.TEXT;
        const agentName = args.AGENT || 'AI助手';
        
        // 检查智能体是否存在
        if (!this.agents[agentName]) {
            return `错误：智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        this.activeAgent = agentName;
        
        // 获取或初始化智能体的对话历史
        if (!agent.conversationHistory) {
            agent.conversationHistory = [];
        }
        
        // 添加系统提示词到对话历史（如果是新的对话）
        if (agent.conversationHistory.length === 0 || 
            agent.conversationHistory[0].role !== "system") {
            const fullPrompt = `${agent.systemPrompt}\n智能体名称：${agent.name}\n性格特点：${agent.personality}`;
            agent.conversationHistory.unshift({"role": "system", "content": fullPrompt});
        }
        
        // 添加用户输入到对话历史
        agent.conversationHistory.push({"role": "user", "content": userInput});
        
        // 如果启用历史截断，限制对话历史长度
        if (this.isTruncationEnabled && agent.conversationHistory.length > this.maxHistoryLength * 2 + 1) {
            agent.conversationHistory = [
                agent.conversationHistory[0], // 保留系统提示
                ...agent.conversationHistory.slice(-this.maxHistoryLength * 2)
            ];
        }
        
        try {
            const requestBody = {
                "model": this.model,
                "messages": agent.conversationHistory,
                "temperature": agent.temperature
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.choices && result.choices.length > 0) {
                const aiResponse = result.choices[0].message.content;
                
                // 添加AI回复到对话历史
                agent.conversationHistory.push({"role": "assistant", "content": aiResponse});
                
                return `[${agent.name}] ${aiResponse}`;
            } else {
                return `[${agent.name}] 未收到AI的有效回答`;
            }
        } catch (error) {
            console.error("发送请求到AI时出错:", error);
            return `[${agent.name}] 出错了: ${error.message}`;
        }
    }

    async sendToGroup(args) {
        const userInput = args.TEXT;
        const groupName = args.GROUP || '群聊';
        
        // 检查群聊是否存在
        if (!this.groups[groupName]) {
            return `错误：群聊 "${groupName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        this.activeGroup = groupName;
        
        // 检查群聊是否有成员
        if (!group.members || group.members.length === 0) {
            return `群聊 "${groupName}" 没有成员，请先添加智能体`;
        }
        
        // 获取或初始化群聊的对话历史
        if (!group.conversationHistory) {
            group.conversationHistory = [];
        }
        
        // 添加系统提示词到对话历史（如果是新的对话）
        if (group.conversationHistory.length === 0 || 
            group.conversationHistory[0].role !== "system") {
            const memberNames = group.members.map(memberName => {
                const agent = this.agents[memberName];
                return agent ? `${agent.name}(${agent.personality})` : memberName;
            }).join('、');
            
            const fullPrompt = `${group.systemPrompt}\n群聊名称：${group.name}\n成员列表：${memberNames}\n请各位AI助手依次发言，每个人用【名字】开头。`;
            group.conversationHistory.unshift({"role": "system", "content": fullPrompt});
        }
        
        // 添加用户输入到群聊历史
        group.conversationHistory.push({"role": "user", "content": `[用户] ${userInput}`});
        
        // 收集所有智能体的回复
        let allResponses = `=== 群聊：${group.name} ===\n用户提问：${userInput}\n\n`;
        let responseCount = 0;
        
        // 限制每个智能体的最大回复数
        const maxResponses = Math.min(group.maxResponses || 3, group.members.length);
        
        // 随机选择要回复的智能体
        const availableMembers = [...group.members];
        const selectedMembers = [];
        
        for (let i = 0; i < maxResponses && availableMembers.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableMembers.length);
            selectedMembers.push(availableMembers[randomIndex]);
            availableMembers.splice(randomIndex, 1);
        }
        
        // 让选中的智能体依次回复
        for (const memberName of selectedMembers) {
            const agent = this.agents[memberName];
            if (!agent) continue;
            
            try {
                // 为每个智能体创建独立的对话上下文
                const agentMessages = [
                    {"role": "system", "content": `你正在参加一个群聊讨论。你是${agent.name}，性格特点：${agent.personality}。请用【${agent.name}】开头来回答问题，保持简洁。`},
                    ...group.conversationHistory.slice(1) // 跳过系统提示，包含用户消息
                ];
                
                const requestBody = {
                    "model": this.model,
                    "messages": agentMessages,
                    "temperature": agent.temperature || 0.7
                };

                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP错误! 状态码: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.choices && result.choices.length > 0) {
                    const aiResponse = result.choices[0].message.content;
                    
                    // 确保回复以智能体名字开头
                    const formattedResponse = aiResponse.startsWith(`【${agent.name}】`) ? 
                        aiResponse : `【${agent.name}】${aiResponse}`;
                    
                    // 添加到群聊历史
                    group.conversationHistory.push({"role": "assistant", "content": formattedResponse});
                    
                    // 添加到回复汇总
                    allResponses += `${formattedResponse}\n\n`;
                    responseCount++;
                }
            } catch (error) {
                console.error(`智能体 ${agent.name} 回复时出错:`, error);
                const errorMsg = `【${agent.name}】抱歉，我暂时无法回答这个问题。`;
                group.conversationHistory.push({"role": "assistant", "content": errorMsg});
                allResponses += `${errorMsg}\n\n`;
                responseCount++;
            }
            
            // 短暂延迟，避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // 如果启用历史截断，限制群聊历史长度
        if (this.isTruncationEnabled && group.conversationHistory.length > this.maxHistoryLength * 3 + 1) {
            group.conversationHistory = [
                group.conversationHistory[0], // 保留系统提示
                ...group.conversationHistory.slice(-this.maxHistoryLength * 3)
            ];
        }
        
        if (responseCount === 0) {
            return "群聊中没有智能体能够回复";
        }
        
        return allResponses;
    }

    async askAgentInGroup(args) {
        const groupName = args.GROUP || '群聊';
        const agentName = args.AGENT || 'AI助手';
        const userInput = args.TEXT || '请发表你的看法';
        
        // 检查群聊是否存在
        if (!this.groups[groupName]) {
            return `错误：群聊 "${groupName}" 不存在`;
        }
        
        // 检查智能体是否存在
        if (!this.agents[agentName]) {
            return `错误：智能体 "${agentName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        const agent = this.agents[agentName];
        this.activeGroup = groupName;
        this.activeAgent = agentName;
        
        // 检查智能体是否在群聊中
        if (!group.members.includes(agentName)) {
            return `智能体 "${agentName}" 不在群聊 "${groupName}" 中`;
        }
        
        // 获取或初始化群聊的对话历史
        if (!group.conversationHistory) {
            group.conversationHistory = [];
        }
        
        // 添加系统提示词到对话历史（如果是新的对话）
        if (group.conversationHistory.length === 0 || 
            group.conversationHistory[0].role !== "system") {
            const memberNames = group.members.map(memberName => {
                const ag = this.agents[memberName];
                return ag ? `${ag.name}(${ag.personality})` : memberName;
            }).join('、');
            
            const fullPrompt = `${group.systemPrompt}\n群聊名称：${group.name}\n成员列表：${memberNames}\n请各位AI助手依次发言，每个人用【名字】开头。`;
            group.conversationHistory.unshift({"role": "system", "content": fullPrompt});
        }
        
        // 添加特殊的用户输入到群聊历史 - 指定某个智能体发言
        const specialPrompt = `[用户指定${agent.name}发言] ${userInput}`;
        group.conversationHistory.push({"role": "user", "content": specialPrompt});
        
        try {
            // 为指定的智能体创建特殊的对话上下文
            const agentMessages = [
                {"role": "system", "content": `你正在参加一个群聊讨论，用户特别指定让你发言。你是${agent.name}，性格特点：${agent.personality}。请用【${agent.name}】开头来回答问题。`},
                ...group.conversationHistory.slice(1, -1), // 跳过系统提示，包含之前的对话历史
                {"role": "user", "content": userInput} // 最后是当前的问题
            ];
            
            const requestBody = {
                "model": this.model,
                "messages": agentMessages,
                "temperature": agent.temperature || 0.7
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.choices && result.choices.length > 0) {
                const aiResponse = result.choices[0].message.content;
                
                // 确保回复以智能体名字开头
                const formattedResponse = aiResponse.startsWith(`【${agent.name}】`) ? 
                    aiResponse : `【${agent.name}】${aiResponse}`;
                
                // 添加到群聊历史
                group.conversationHistory.push({"role": "assistant", "content": formattedResponse});
                
                // 如果启用历史截断，限制群聊历史长度
                if (this.isTruncationEnabled && group.conversationHistory.length > this.maxHistoryLength * 3 + 1) {
                    group.conversationHistory = [
                        group.conversationHistory[0], // 保留系统提示
                        ...group.conversationHistory.slice(-this.maxHistoryLength * 3)
                    ];
                }
                
                return `=== 在群聊"${group.name}"中指定${agent.name}发言 ===\n用户要求：${userInput}\n\n${formattedResponse}`;
            } else {
                return `在群聊"${group.name}"中，${agent.name}未收到有效回答`;
            }
        } catch (error) {
            console.error(`在群聊中指定智能体发言时出错:`, error);
            return `在群聊"${group.name}"中指定${agent.name}发言时出错: ${error.message}`;
        }
    }

    // 智能体管理方法
    addNewAgent(args) {
        const agentId = args.ID || `agent_${this.nextAgentId}`;
        const agentName = args.NAME || `智能体${this.nextAgentId}`;
        
        // 检查ID是否已存在
        const existingById = Object.values(this.agents).find(agent => agent.id === agentId);
        if (existingById) {
            return `ID "${agentId}" 已被使用，请使用其他ID`;
        }
        
        // 检查名称是否已存在
        if (this.agents[agentName]) {
            return `智能体名称 "${agentName}" 已存在`;
        }
        
        // 添加新智能体
        this.agents[agentName] = {
            id: agentId,
            name: agentName,
            personality: "专业、友好、乐于助人",
            temperature: 0.7,
            systemPrompt: `你是一个名为${agentName}的AI助手，请用中文回答用户的问题。`,
            conversationHistory: [],
            type: "individual"
        };
        
        this.nextAgentId++;
        return `已添加智能体：${agentName} (ID: ${agentId})`;
    }

    deleteAgent(args) {
        const agentName = args.AGENT || 'AI助手';
        
        // 检查智能体是否存在
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        // 检查是否是默认智能体
        if (agentName === 'AI助手') {
            return `不能删除默认智能体 "AI助手"`;
        }
        
        // 检查是否是当前活动智能体
        const isActiveAgent = this.activeAgent === agentName;
        
        // 从所有群聊中移除该智能体
        Object.values(this.groups).forEach(group => {
            if (group.members && group.members.includes(agentName)) {
                const index = group.members.indexOf(agentName);
                if (index !== -1) {
                    group.members.splice(index, 1);
                }
            }
        });
        
        // 删除智能体
        const deletedAgent = this.agents[agentName];
        delete this.agents[agentName];
        
        // 如果删除的是当前活动智能体，切换回默认智能体
        if (isActiveAgent) {
            this.activeAgent = 'AI助手';
        }
        
        // 尝试从本地存储中删除保存的配置
        try {
            localStorage.removeItem(`agent_${deletedAgent.id}`);
        } catch (e) {
            // 忽略本地存储错误
        }
        
        return `已删除智能体：${agentName} (ID: ${deletedAgent.id})${isActiveAgent ? '，已切换回默认智能体' : ''}`;
    }

    deleteAllAgents() {
        // 备份默认智能体
        const defaultAgent = this.agents['AI助手'];
        
        // 删除所有非默认智能体
        const agentNames = Object.keys(this.agents);
        let deletedCount = 0;
        
        for (const agentName of agentNames) {
            if (agentName !== 'AI助手') {
                const agent = this.agents[agentName];
                
                // 从所有群聊中移除该智能体
                Object.values(this.groups).forEach(group => {
                    if (group.members && group.members.includes(agentName)) {
                        const index = group.members.indexOf(agentName);
                        if (index !== -1) {
                            group.members.splice(index, 1);
                        }
                    }
                });
                
                // 尝试从本地存储中删除保存的配置
                try {
                    localStorage.removeItem(`agent_${agent.id}`);
                } catch (e) {
                    // 忽略本地存储错误
                }
                
                delete this.agents[agentName];
                deletedCount++;
            }
        }
        
        // 重置活动智能体为默认智能体
        this.activeAgent = 'AI助手';
        
        // 重置下一个ID
        this.nextAgentId = 2;
        
        if (deletedCount === 0) {
            return "没有可删除的智能体（只能删除非默认智能体）";
        } else {
            return `已删除所有${deletedCount}个非默认智能体，保留默认智能体"AI助手"`;
        }
    }

    // 群聊管理方法
    createGroup(args) {
        const groupName = args.NAME || `群聊${this.nextGroupId}`;
        
        // 检查群聊名称是否已存在
        if (this.groups[groupName]) {
            return `群聊名称 "${groupName}" 已存在`;
        }
        
        // 创建新群聊
        this.groups[groupName] = {
            id: `group_${this.nextGroupId}`,
            name: groupName,
            members: [],
            conversationHistory: [],
            activeMembers: [],
            systemPrompt: `这是一个名为"${groupName}"的AI群聊，多个AI助手将一起讨论问题。`,
            maxResponses: 3
        };
        
        this.nextGroupId++;
        return `已创建群聊：${groupName} (ID: group_${this.nextGroupId - 1})`;
    }

    deleteGroup(args) {
        const groupName = args.GROUP || '群聊';
        
        // 检查群聊是否存在
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        // 检查是否是默认群聊
        if (groupName === '群聊') {
            return `不能删除默认群聊 "群聊"`;
        }
        
        // 检查是否是当前活动群聊
        const isActiveGroup = this.activeGroup === groupName;
        
        // 删除群聊
        const deletedGroup = this.groups[groupName];
        delete this.groups[groupName];
        
        // 如果删除的是当前活动群聊，切换回默认群聊
        if (isActiveGroup) {
            this.activeGroup = '群聊';
        }
        
        // 尝试从本地存储中删除保存的配置
        try {
            localStorage.removeItem(`group_${deletedGroup.id}`);
        } catch (e) {
            // 忽略本地存储错误
        }
        
        return `已删除群聊：${groupName} (ID: ${deletedGroup.id})${isActiveGroup ? '，已切换回默认群聊' : ''}`;
    }

    deleteAllGroups() {
        // 备份默认群聊
        const defaultGroup = this.groups['群聊'];
        
        // 删除所有非默认群聊
        const groupNames = Object.keys(this.groups);
        let deletedCount = 0;
        
        for (const groupName of groupNames) {
            if (groupName !== '群聊') {
                const group = this.groups[groupName];
                
                // 尝试从本地存储中删除保存的配置
                try {
                    localStorage.removeItem(`group_${group.id}`);
                } catch (e) {
                    // 忽略本地存储错误
                }
                
                delete this.groups[groupName];
                deletedCount++;
            }
        }
        
        // 重置活动群聊为默认群聊
        this.activeGroup = '群聊';
        
        // 重置下一个ID
        this.nextGroupId = 2;
        
        if (deletedCount === 0) {
            return "没有可删除的群聊（只能删除非默认群聊）";
        } else {
            return `已删除所有${deletedCount}个非默认群聊，保留默认群聊"群聊"`;
        }
    }

    addAgentToGroup(args) {
        const groupName = args.GROUP || '群聊';
        const agentName = args.AGENT || 'AI助手';
        
        // 检查群聊是否存在
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        // 检查智能体是否存在
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        
        // 检查智能体是否已在群聊中
        if (group.members.includes(agentName)) {
            return `智能体 "${agentName}" 已在群聊 "${groupName}" 中`;
        }
        
        // 添加智能体到群聊
        group.members.push(agentName);
        
        return `已将智能体 "${agentName}" 添加到群聊 "${groupName}"，当前成员数：${group.members.length}`;
    }

    removeAgentFromGroup(args) {
        const groupName = args.GROUP || '群聊';
        const agentName = args.AGENT || 'AI助手';
        
        // 检查群聊是否存在
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        
        // 检查智能体是否在群聊中
        if (!group.members.includes(agentName)) {
            return `智能体 "${agentName}" 不在群聊 "${groupName}" 中`;
        }
        
        // 从群聊中移除智能体
        const index = group.members.indexOf(agentName);
        group.members.splice(index, 1);
        
        return `已从群聊 "${groupName}" 中移除智能体 "${agentName}"，剩余成员数：${group.members.length}`;
    }

    getGroupMembers(args) {
        const groupName = args.GROUP || '群聊';
        
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        
        if (!group.members || group.members.length === 0) {
            return `群聊 "${groupName}" 暂无成员`;
        }
        
        let membersText = `群聊 "${groupName}" 成员列表（共${group.members.length}位）：\n`;
        group.members.forEach((memberName, index) => {
            const agent = this.agents[memberName];
            if (agent) {
                membersText += `${index + 1}. ${agent.name} (ID: ${agent.id}) - ${agent.personality}\n`;
            } else {
                membersText += `${index + 1}. ${memberName} (智能体不存在)\n`;
            }
        });
        
        return membersText;
    }

    getGroupCount() {
        return Object.keys(this.groups).length;
    }

    getGroupList() {
        const groupNames = Object.keys(this.groups);
        if (groupNames.length === 0) {
            return "暂无群聊";
        }
        
        let listText = `群聊列表（共${groupNames.length}个）：\n`;
        groupNames.forEach((name, index) => {
            const group = this.groups[name];
            const isDefault = name === '群聊' ? ' (默认)' : '';
            const isActive = this.activeGroup === name ? ' ✓' : '';
            listText += `${index + 1}. ${group.name} (ID: ${group.id}) - ${group.members.length} 位成员${isDefault}${isActive}\n`;
        });
        
        return listText;
    }

    // 其他方法保持不变...
    setAgentPersonality(args) {
        const agentName = args.AGENT || 'AI助手';
        const personality = args.PERSONALITY;
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        this.agents[agentName].personality = personality;
        
        // 更新系统提示词中的性格描述
        const agent = this.agents[agentName];
        if (agent.conversationHistory && agent.conversationHistory.length > 0 && 
            agent.conversationHistory[0].role === "system") {
            const systemContent = agent.conversationHistory[0].content;
            const lines = systemContent.split('\n');
            if (lines.length >= 3) {
                lines[2] = `性格特点：${personality}`;
                agent.conversationHistory[0].content = lines.join('\n');
            }
        }
        
        return `智能体 "${agentName}" 性格已设置为：${personality}`;
    }

    setSystemPrompt(args) {
        const agentName = args.AGENT || 'AI助手';
        const prompt = args.PROMPT;
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        this.agents[agentName].systemPrompt = prompt;
        return `智能体 "${agentName}" 系统提示词已更新`;
    }

    setTemperature(args) {
        const agentName = args.AGENT || 'AI助手';
        const temp = parseFloat(args.VALUE);
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        if (temp >= 0 && temp <= 2) {
            this.agents[agentName].temperature = temp;
            return `智能体 "${agentName}" 温度参数已设置为：${temp}`;
        } else {
            return "温度参数必须在0-2之间";
        }
    }

    saveAgentProfile(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        const profile = {
            id: agent.id,
            name: agent.name,
            personality: agent.personality,
            temperature: agent.temperature,
            systemPrompt: agent.systemPrompt,
            maxHistoryLength: this.maxHistoryLength,
            truncationEnabled: this.isTruncationEnabled
        };
        
        try {
            localStorage.setItem(`agent_${agent.id}`, JSON.stringify(profile));
            return `智能体 "${agentName}" 配置已保存`;
        } catch (e) {
            return "保存失败，请检查浏览器设置";
        }
    }

    loadAgentProfile(args) {
        const profileName = args.PROFILE;
        const profileMap = {
            '助手': {id: 'assistant', name: 'AI助手', personality: '专业、友好', temp: 0.7},
            '老师': {id: 'teacher', name: 'AI老师', personality: '耐心、严谨', temp: 0.5},
            '朋友': {id: 'friend', name: 'AI朋友', personality: '亲切、幽默', temp: 0.8},
            '专家': {id: 'expert', name: 'AI专家', personality: '专业、精确', temp: 0.3}
        };
        
        const config = profileMap[profileName] || profileMap['助手'];
        const agentName = config.name;
        
        // 添加或更新智能体
        this.agents[agentName] = {
            id: config.id,
            name: config.name,
            personality: config.personality,
            temperature: config.temp,
            systemPrompt: `你是一个${config.name}，${config.personality}，请用中文与用户交流。`,
            conversationHistory: [],
            type: "individual"
        };
        
        return `已加载智能体配置：${agentName}`;
    }

    getAgentCount() {
        return Object.keys(this.agents).length;
    }

    getAgentList() {
        const agentNames = Object.keys(this.agents);
        if (agentNames.length === 0) {
            return "暂无智能体";
        }
        
        let listText = `智能体列表（共${agentNames.length}个）：\n`;
        agentNames.forEach((name, index) => {
            const agent = this.agents[name];
            const isDefault = name === 'AI助手' ? ' (默认)' : '';
            const isActive = this.activeAgent === name ? ' ✓' : '';
            listText += `${index + 1}. ${agent.name} (ID: ${agent.id})${isDefault}${isActive}\n`;
        });
        
        return listText;
    }

    getAgentInfo(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        const historyCount = agent.conversationHistory ? 
            agent.conversationHistory.filter(msg => msg.role === "user").length : 0;
        const isDefault = agentName === 'AI助手';
        
        // 检查智能体在哪些群聊中
        const groupMemberships = [];
        Object.values(this.groups).forEach(group => {
            if (group.members && group.members.includes(agentName)) {
                groupMemberships.push(group.name);
            }
        });
        
        return `智能体信息：
名称: ${agent.name}
ID: ${agent.id}
类型: ${isDefault ? '默认智能体' : '用户创建'}
性格: ${agent.personality}
温度参数: ${agent.temperature}
系统提示: ${agent.systemPrompt.substring(0, 50)}${agent.systemPrompt.length > 50 ? '...' : ''}
对话历史: ${historyCount} 轮
状态: ${this.activeAgent === agentName ? '当前活动' : '就绪'}
所属群聊: ${groupMemberships.length > 0 ? groupMemberships.join('、') : '无'}`;
    }

    getAgentConfig(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        const historyCount = agent.conversationHistory ? 
            Math.floor(agent.conversationHistory.filter(msg => msg.role === "user").length) : 0;
        const isDefault = agentName === 'AI助手';
        
        return `智能体 "${agentName}" 配置：
名称: ${agent.name}
ID: ${agent.id}
类型: ${isDefault ? '默认智能体' : '用户创建'}
性格: ${agent.personality}
温度: ${agent.temperature}
系统提示词长度: ${agent.systemPrompt.length} 字符
对话轮数: ${historyCount}
上下文长度: ${this.maxHistoryLength} 轮
历史截断: ${this.isTruncationEnabled ? '启用' : '禁用'}`;
    }

    // 历史管理方法
    setMaxHistoryLength(args) {
        const newLength = Math.floor(Number(args.LENGTH));
        
        if (newLength >= 1 && newLength <= 50) {
            this.maxHistoryLength = newLength;
            
            // 更新所有智能体的历史长度
            Object.values(this.agents).forEach(agent => {
                if (agent.conversationHistory && this.isTruncationEnabled && 
                    agent.conversationHistory.length > this.maxHistoryLength * 2 + 1) {
                    agent.conversationHistory = [
                        agent.conversationHistory[0], // 保留系统提示
                        ...agent.conversationHistory.slice(-this.maxHistoryLength * 2)
                    ];
                }
            });
            
            // 更新所有群聊的历史长度
            Object.values(this.groups).forEach(group => {
                if (group.conversationHistory && this.isTruncationEnabled && 
                    group.conversationHistory.length > this.maxHistoryLength * 3 + 1) {
                    group.conversationHistory = [
                        group.conversationHistory[0], // 保留系统提示
                        ...group.conversationHistory.slice(-this.maxHistoryLength * 3)
                    ];
                }
            });
            
            return `已设置最大上下文长度为 ${newLength} 轮`;
        } else {
            return "长度必须在1-50之间";
        }
    }

    toggleHistoryTruncation(args) {
        const newState = args.STATE === '启用';
        this.isTruncationEnabled = newState;
        
        // 如果重新启用截断，更新所有历史
        if (newState) {
            // 更新智能体历史
            Object.values(this.agents).forEach(agent => {
                if (agent.conversationHistory && 
                    agent.conversationHistory.length > this.maxHistoryLength * 2 + 1) {
                    agent.conversationHistory = [
                        agent.conversationHistory[0], // 保留系统提示
                        ...agent.conversationHistory.slice(-this.maxHistoryLength * 2)
                    ];
                }
            });
            
            // 更新群聊历史
            Object.values(this.groups).forEach(group => {
                if (group.conversationHistory && 
                    group.conversationHistory.length > this.maxHistoryLength * 3 + 1) {
                    group.conversationHistory = [
                        group.conversationHistory[0], // 保留系统提示
                        ...group.conversationHistory.slice(-this.maxHistoryLength * 3)
                    ];
                }
            });
        }
        
        return `历史截断已${newState ? '启用' : '禁用'}`;
    }

    clearAgentHistory(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        this.agents[agentName].conversationHistory = [];
        return `智能体 "${agentName}" 的历史已清除`;
    }

    clearGroupHistory(args) {
        const groupName = args.GROUP || '群聊';
        
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        this.groups[groupName].conversationHistory = [];
        return `群聊 "${groupName}" 的历史已清除`;
    }

    clearAllHistory() {
        // 清除所有智能体历史
        Object.values(this.agents).forEach(agent => {
            agent.conversationHistory = [];
        });
        
        // 清除所有群聊历史
        Object.values(this.groups).forEach(group => {
            group.conversationHistory = [];
        });
        
        return "所有智能体和群聊历史已清除";
    }

    getAllHistory(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        
        if (!agent.conversationHistory || agent.conversationHistory.length === 0) {
            return `智能体 "${agentName}" 的对话历史为空`;
        }
        
        let historyText = `=== ${agent.name} 的对话历史 ===\n`;
        historyText += `智能体ID：${agent.id}\n`;
        
        let conversationCount = 0;
        
        for (let i = 0; i < agent.conversationHistory.length; i++) {
            const msg = agent.conversationHistory[i];
            
            if (msg.role === "system") {
                historyText += `[系统] ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n\n`;
            } else if (msg.role === "user") {
                conversationCount++;
                historyText += `[第${conversationCount}轮] 用户：${msg.content}\n`;
            } else if (msg.role === "assistant") {
                historyText += `       ${agent.name}：${msg.content}\n\n`;
            }
        }
        
        return historyText;
    }

    getAllGroupHistory(args) {
        const groupName = args.GROUP || '群聊';
        
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        
        if (!group.conversationHistory || group.conversationHistory.length === 0) {
            return `群聊 "${groupName}" 的对话历史为空`;
        }
        
        let historyText = `=== 群聊：${group.name} 的对话历史 ===\n`;
        historyText += `群聊ID：${group.id}\n`;
        historyText += `成员数：${group.members.length}\n\n`;
        
        let conversationCount = 0;
        
        for (let i = 0; i < group.conversationHistory.length; i++) {
            const msg = group.conversationHistory[i];
            
            if (msg.role === "system") {
                historyText += `[系统] ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}\n\n`;
            } else if (msg.role === "user") {
                // 检查是否是特殊指定的发言
                if (msg.content.startsWith('[用户指定') && msg.content.includes('发言]')) {
                    const agentNameStart = msg.content.indexOf('指定') + 2;
                    const agentNameEnd = msg.content.indexOf('发言]');
                    const agentName = msg.content.substring(agentNameStart, agentNameEnd);
                    const question = msg.content.substring(agentNameEnd + 5);
                    conversationCount++;
                    historyText += `[第${conversationCount}轮] 用户指定${agentName}发言：${question}\n`;
                } else {
                    conversationCount++;
                    historyText += `[第${conversationCount}轮] ${msg.content}\n`;
                }
            } else if (msg.role === "assistant") {
                historyText += `       ${msg.content}\n\n`;
            }
        }
        
        return historyText;
    }

    getHistoryCount(args) {
        const agentName = args.AGENT || 'AI助手';
        
        if (!this.agents[agentName]) {
            return `智能体 "${agentName}" 不存在`;
        }
        
        const agent = this.agents[agentName];
        if (!agent.conversationHistory) {
            return 0;
        }
        
        const userMessages = agent.conversationHistory.filter(msg => msg.role === "user").length;
        return userMessages;
    }

    getGroupHistoryCount(args) {
        const groupName = args.GROUP || '群聊';
        
        if (!this.groups[groupName]) {
            return `群聊 "${groupName}" 不存在`;
        }
        
        const group = this.groups[groupName];
        if (!group.conversationHistory) {
            return 0;
        }
        
        const userMessages = group.conversationHistory.filter(msg => msg.role === "user").length;
        return userMessages;
    }

    showAPIInfo() {
        return `API配置信息：
URL: ${this.apiUrl}
模型: ${this.model}
密钥: ${this.apiKey.substring(0, 8)}...${this.apiKey.substring(this.apiKey.length - 4)}
智能体数量: ${this.getAgentCount()}
群聊数量: ${this.getGroupCount()}
活动智能体: ${this.activeAgent}
活动群聊: ${this.activeGroup}`;
    }
}

Scratch.extensions.register(new AIExtension());
