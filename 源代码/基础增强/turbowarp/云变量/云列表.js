(function(Scratch) {
  'use strict';
  
  const CLOUD_SERVER = 'wss://clouddata.turbowarp.org';
  
  class CloudListExtension {
    constructor() {
      this.connected = false;
      this.ws = null;
      this.username = null;
      this.projectId = null;
      this.roomId = ''; // 默认使用空字符串（全局房间）
      this.lists = new Map();
      this.pendingOperations = [];
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
    }
    
    getInfo() {
      return {
        id: 'cloudlist',
        name: '云列表',
        color1: '#5cd65c',
        color2: '#4dbf4d',
        color3: '#3fa63f',
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
            opcode: 'setList',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置云列表 [LISTNAME] 为 [VALUE]',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["项目1", "项目2", "项目3"]'
              }
            }
          },
          {
            opcode: 'addToList',
            blockType: Scratch.BlockType.COMMAND,
            text: '将 [VALUE] 添加到云列表 [LISTNAME]',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '新项目'
              }
            }
          },
          {
            opcode: 'removeFromList',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除云列表 [LISTNAME] 中第 [INDEX] 项',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'insertToList',
            blockType: Scratch.BlockType.COMMAND,
            text: '插入 [VALUE] 到云列表 [LISTNAME] 的第 [INDEX] 位置',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '插入的项目'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'replaceInList',
            blockType: Scratch.BlockType.COMMAND,
            text: '替换云列表 [LISTNAME] 第 [INDEX] 项为 [VALUE]',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '替换值'
              }
            }
          },
          '---',
          {
            opcode: 'getList',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表 [LISTNAME] 的所有项目',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              }
            }
          },
          {
            opcode: 'getListItem',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表 [LISTNAME] 的第 [INDEX] 项',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getListLength',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表 [LISTNAME] 的长度',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              }
            }
          },
          {
            opcode: 'listContains',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '云列表 [LISTNAME] 包含 [VALUE]?',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '项目1'
              }
            }
          },
          '---',
          {
            opcode: 'clearList',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空云列表 [LISTNAME]',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              }
            }
          },
          {
            opcode: 'deleteList',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除云列表 [LISTNAME]',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
              }
            }
          },
          {
            opcode: 'listExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '云列表 [LISTNAME] 存在?',
            arguments: {
              LISTNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '我的列表'
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
    
    // 设置云列表
    setList(args) {
      const listName = args.LISTNAME;
      let value = args.VALUE;
      
      try {
        // 尝试解析为JSON数组
        if (typeof value === 'string') {
          value = JSON.parse(value);
        }
        
        if (!Array.isArray(value)) {
          throw new Error('值必须是数组');
        }
        
        this.lists.set(listName, value);
        
        if (this.connected) {
          this._updateCloudVariable(listName);
        } else {
          this.pendingOperations.push({
            type: 'set',
            listName: listName,
            value: value
          });
        }
      } catch (error) {
        console.error('设置云列表失败:', error);
      }
    }
    
    // 添加到列表
    addToList(args) {
      const listName = args.LISTNAME;
      const value = args.VALUE;
      
      let list = this.lists.get(listName) || [];
      list.push(value);
      this.lists.set(listName, list);
      
      if (this.connected) {
        this._updateCloudVariable(listName);
      } else {
        this.pendingOperations.push({
          type: 'update',
          listName: listName,
          value: list
        });
      }
    }
    
    // 从列表中删除
    removeFromList(args) {
      const listName = args.LISTNAME;
      const index = Number(args.INDEX) - 1; // 转换为0-based索引
      
      let list = this.lists.get(listName) || [];
      if (index >= 0 && index < list.length) {
        list.splice(index, 1);
        this.lists.set(listName, list);
        
        if (this.connected) {
          this._updateCloudVariable(listName);
        } else {
          this.pendingOperations.push({
            type: 'update',
            listName: listName,
            value: list
          });
        }
      }
    }
    
    // 插入到列表
    insertToList(args) {
      const listName = args.LISTNAME;
      const value = args.VALUE;
      const index = Number(args.INDEX) - 1; // 转换为0-based索引
      
      let list = this.lists.get(listName) || [];
      if (index >= 0 && index <= list.length) {
        list.splice(index, 0, value);
        this.lists.set(listName, list);
        
        if (this.connected) {
          this._updateCloudVariable(listName);
        } else {
          this.pendingOperations.push({
            type: 'update',
            listName: listName,
            value: list
          });
        }
      }
    }
    
    // 替换列表项
    replaceInList(args) {
      const listName = args.LISTNAME;
      const index = Number(args.INDEX) - 1; // 转换为0-based索引
      const value = args.VALUE;
      
      let list = this.lists.get(listName) || [];
      if (index >= 0 && index < list.length) {
        list[index] = value;
        this.lists.set(listName, list);
        
        if (this.connected) {
          this._updateCloudVariable(listName);
        } else {
          this.pendingOperations.push({
            type: 'update',
            listName: listName,
            value: list
          });
        }
      }
    }
    
    // 获取列表
    getList(args) {
      const listName = args.LISTNAME;
      const list = this.lists.get(listName) || [];
      return JSON.stringify(list);
    }
    
    // 获取列表项
    getListItem(args) {
      const listName = args.LISTNAME;
      const index = Number(args.INDEX) - 1; // 转换为0-based索引
      
      const list = this.lists.get(listName) || [];
      if (index >= 0 && index < list.length) {
        return list[index];
      }
      return '';
    }
    
    // 获取列表长度
    getListLength(args) {
      const listName = args.LISTNAME;
      const list = this.lists.get(listName) || [];
      return list.length;
    }
    
    // 检查列表是否包含值
    listContains(args) {
      const listName = args.LISTNAME;
      const value = args.VALUE;
      
      const list = this.lists.get(listName) || [];
      return list.includes(value);
    }
    
    // 清空列表
    clearList(args) {
      const listName = args.LISTNAME;
      this.lists.set(listName, []);
      
      if (this.connected) {
        this._updateCloudVariable(listName);
      } else {
        this.pendingOperations.push({
          type: 'update',
          listName: listName,
          value: []
        });
      }
    }
    
    // 删除列表
    deleteList(args) {
      const listName = args.LISTNAME;
      this.lists.delete(listName);
      
      if (this.connected) {
        this._deleteCloudVariable(listName);
      } else {
        this.pendingOperations.push({
          type: 'delete',
          listName: listName
        });
      }
    }
    
    // 检查列表是否存在
    listExists(args) {
      const listName = args.LISTNAME;
      return this.lists.has(listName);
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
            const listName = message.name.replace('list_', '');
            
            try {
              const listValue = JSON.parse(message.value);
              if (Array.isArray(listValue)) {
                this.lists.set(listName, listValue);
              }
            } catch (error) {
              console.error('解析云列表数据失败:', error);
            }
          }
        }
      } catch (error) {
        console.error('处理云消息失败:', error);
      }
    }
    
    // 内部方法：更新云变量
    _updateCloudVariable(listName) {
      if (this.ws && this.connected) {
        const list = this.lists.get(listName) || [];
        const message = {
          method: 'set',
          name: `list_${listName}`,
          value: JSON.stringify(list)
        };
        
        // 如果设置了房间ID，添加到消息中
        if (this.roomId) {
          message.room_id = this.roomId;
        }
        
        this.ws.send(JSON.stringify(message));
      }
    }
    
    // 内部方法：删除云变量
    _deleteCloudVariable(listName) {
      if (this.ws && this.connected) {
        const message = {
          method: 'delete',
          name: `list_${listName}`
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
            this.lists.set(operation.listName, operation.value);
            this._updateCloudVariable(operation.listName);
            break;
          case 'update':
            this.lists.set(operation.listName, operation.value);
            this._updateCloudVariable(operation.listName);
            break;
          case 'delete':
            this._deleteCloudVariable(operation.listName);
            break;
        }
      }
    }
  }
  
  // 注册扩展
  Scratch.extensions.register(new CloudListExtension());
})(Scratch);