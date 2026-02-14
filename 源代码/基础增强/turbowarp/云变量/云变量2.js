(function(Scratch) {
  'use strict';
  
  const CLOUD_SERVER = 'wss://clouddata.turbowarp.org';
  
  class CloudVariablesExtension {
    constructor() {
      this.connected = false;
      this.ws = null;
      this.username = null;
      this.projectId = null;
      this.roomId = '';
      this.variables = new Map();
      this.pendingOperations = [];
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.variableUpdateCallbacks = new Map();
    }
    
    getInfo() {
      return {
        id: 'cloudvariables',
        name: '云变量',
        color1: '#4c97ff',
        color2: '#3373cc',
        color3: '#265c99',
        blocks: [
          {
            opcode: 'connect',
            blockType: Scratch.BlockType.COMMAND,
            text: '连接云服务器 [SERVER]',
            arguments: {
              SERVER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: CLOUD_SERVER
              }
            }
          },
          {
            opcode: 'setRoomId',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置房间ID为 [ROOMID]',
            arguments: {
              ROOMID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'getRoomId',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前房间ID'
          },
          '---',
          {
            opcode: 'setVariable',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置云变量 [VARNAME] 为 [VALUE]',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '100'
              }
            }
          },
          {
            opcode: 'changeVariable',
            blockType: Scratch.BlockType.COMMAND,
            text: '将云变量 [VARNAME] 增加 [VALUE]',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          '---',
          {
            opcode: 'getVariable',
            blockType: Scratch.BlockType.REPORTER,
            text: '云变量 [VARNAME]',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              }
            }
          },
          {
            opcode: 'variableExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '云变量 [VARNAME] 存在?',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              }
            }
          },
          '---',
          {
            opcode: 'deleteVariable',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除云变量 [VARNAME]',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              }
            }
          },
          {
            opcode: 'onVariableChange',
            blockType: Scratch.BlockType.HAT,
            text: '当云变量 [VARNAME] 更新时',
            arguments: {
              VARNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '分数'
              }
            }
          },
          '---',
          {
            opcode: 'isConnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '已连接到云服务器?'
          }
        ]
      };
    }
    
    // 设置房间ID
    setRoomId(args) {
      this.roomId = args.ROOMID;
      // 如果已连接，重新发送设置消息以更新房间
      if (this.connected && this.username && this.projectId) {
        this._sendSet();
      }
    }
    
    // 获取当前房间ID
    getRoomId() {
      return this.roomId;
    }
    
    // 连接到云服务器
    connect(args) {
      const server = args.SERVER || CLOUD_SERVER;
      
      // 如果已经连接，先断开
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      
      try {
        this.ws = new WebSocket(server);
        
        this.ws.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('已连接到云服务器');
          
          // 发送设置用户名和项目ID的消息
          if (this.username && this.projectId) {
            this._sendSet();
          }
          
          // 执行等待中的操作
          this._processPendingOperations();
        };
        
        this.ws.onmessage = (event) => {
          this._handleMessage(event.data);
        };
        
        this.ws.onclose = () => {
          this.connected = false;
          console.log('与云服务器的连接已断开');
          
          // 尝试重新连接
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connect({SERVER: server});
            }, 1000 * this.reconnectAttempts);
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('云服务器连接错误:', error);
        };
      } catch (error) {
        console.error('创建WebSocket连接失败:', error);
      }
    }
    
    // 设置云变量
    setVariable(args) {
      const varName = args.VARNAME;
      const value = args.VALUE;
      
      this.variables.set(varName, value);
      
      if (this.connected) {
        this._updateCloudVariable(varName);
      } else {
        this.pendingOperations.push({
          type: 'set',
          varName: varName,
          value: value
        });
      }
    }
    
    // 改变云变量
    changeVariable(args) {
      const varName = args.VARNAME;
      const changeValue = Number(args.VALUE) || 0;
      
      const currentValue = Number(this.variables.get(varName) || 0);
      const newValue = currentValue + changeValue;
      
      this.variables.set(varName, newValue);
      
      if (this.connected) {
        this._updateCloudVariable(varName);
      } else {
        this.pendingOperations.push({
          type: 'set',
          varName: varName,
          value: newValue
        });
      }
    }
    
    // 获取云变量
    getVariable(args) {
      const varName = args.VARNAME;
      return this.variables.get(varName) || '';
    }
    
    // 检查云变量是否存在
    variableExists(args) {
      const varName = args.VARNAME;
      return this.variables.has(varName);
    }
    
    // 删除云变量
    deleteVariable(args) {
      const varName = args.VARNAME;
      this.variables.delete(varName);
      
      if (this.connected) {
        this._deleteCloudVariable(varName);
      } else {
        this.pendingOperations.push({
          type: 'delete',
          varName: varName
        });
      }
    }
    
    // 当云变量更新时（帽子积木）
    onVariableChange(args) {
      const varName = args.VARNAME;
      
      // 这个帽子积木需要特殊处理
      // 我们会在变量更新时通过运行时触发
      return false; // 默认不触发
    }
    
    // 检查是否已连接
    isConnected() {
      return this.connected;
    }
    
    // 内部方法：发送设置消息
    _sendSet() {
      if (this.ws && this.connected) {
        const message = {
          method: 'set',
          user: this.username,
          project_id: this.projectId.toString()
        };
        
        // 如果设置了房间ID，添加到消息中
        if (this.roomId) {
          message.room_id = this.roomId;
        }
        
        this.ws.send(JSON.stringify(message));
      }
    }
    
    // 内部方法：处理消息
    _handleMessage(data) {
      try {
        const message = JSON.parse(data);
        
        // 只处理当前房间的消息（如果没有设置房间，则处理所有消息）
        if (message.room_id === undefined || message.room_id === this.roomId) {
          if (message.method === 'set' && message.name) {
            // 处理云变量设置
            const varName = message.name;
            const value = message.value;
            
            // 更新本地变量
            this.variables.set(varName, value);
            
            // 触发变量更新回调
            if (this.variableUpdateCallbacks.has(varName)) {
              const callbacks = this.variableUpdateCallbacks.get(varName);
              for (const callback of callbacks) {
                callback();
              }
            }
          }
        }
      } catch (error) {
        console.error('处理云消息失败:', error);
      }
    }
    
    // 内部方法：更新云变量
    _updateCloudVariable(varName) {
      if (this.ws && this.connected) {
        const value = this.variables.get(varName) || '';
        const message = {
          method: 'set',
          name: varName,
          value: value
        };
        
        // 如果设置了房间ID，添加到消息中
        if (this.roomId) {
          message.room_id = this.roomId;
        }
        
        this.ws.send(JSON.stringify(message));
      }
    }
    
    // 内部方法：删除云变量
    _deleteCloudVariable(varName) {
      if (this.ws && this.connected) {
        const message = {
          method: 'delete',
          name: varName
        };
        
        // 如果设置了房间ID，添加到消息中
        if (this.roomId) {
          message.room_id = this.roomId;
        }
        
        this.ws.send(JSON.stringify(message));
      }
    }
    
    // 内部方法：处理等待中的操作
    _processPendingOperations() {
      while (this.pendingOperations.length > 0) {
        const operation = this.pendingOperations.shift();
        
        switch (operation.type) {
          case 'set':
            this.variables.set(operation.varName, operation.value);
            this._updateCloudVariable(operation.varName);
            break;
          case 'delete':
            this._deleteCloudVariable(operation.varName);
            break;
        }
      }
    }
    
    // 初始化方法（由TurboWarp调用）
    init() {
      // 获取用户名和项目ID
      this.username = Scratch.vm.runtime.ioDevices.cloud.username;
      this.projectId = Scratch.vm.runtime.ioDevices.cloud.projectId;
      
      // 注册变量更新回调
      Scratch.vm.runtime.on('RUNTIME_DISPOSED', () => {
        if (this.ws) {
          this.ws.close();
        }
      });
    }
  }
  
  // 注册扩展
  Scratch.extensions.register(new CloudVariablesExtension());
})(Scratch);