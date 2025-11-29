// 由 Discord 用户 @mistium 制作
// 此扩展适用于 OriginOS :P
// 感谢使用我的扩展 :D
// 描述：连接并管理多个 WebSocket 连接
// 版本：3.2

// 许可证：MPL-2.0（Mozilla 公共许可证 2.0 版）
// 本源代码受 Mozilla 公共许可证 2.0 版条款约束，
// 若本文件未随附 MPL 许可证副本，
// 可前往 https://mozilla.org/MPL/2.0/ 获取

(function (Scratch) {
  // 发送消息到指定服务器连接
  async function sendMessage(serverID, MESSAGE) {
    const ws = serverID;
    // 若连接存在且处于“已打开”状态，则发送消息
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(MESSAGE);
    }
  }

  // Scratch 类型转换工具
  const Cast = Scratch.Cast;

  // WebSocket 服务器管理类（核心功能实现）
  class WebSocketServer {
    constructor() {
      this.runtime = Scratch.vm.runtime; // 关联 Scratch 运行时
      this.wsServers = {}; // 存储所有 WebSocket 连接（键：连接ID，值：连接实例）
      this.messageQueue = {}; // 存储各连接的消息队列（键：连接ID，值：消息数组）
      this.connectedServers = {}; // 存储各连接的在线状态（键：连接ID，值：布尔值）
      this.lastFrom = ""; // 记录最后一条消息的来源连接ID
      this.lastDisconnect = ""; // 记录最近断开的连接ID
    }

    // 向 Scratch 编辑器提供扩展信息（积木定义、外观等）
    getInfo() {
      return {
        id: 'webSocketPlus', // 扩展唯一ID
        name: 'WebSocket增强版', // 编辑器中显示的扩展名称
        color1: '#FF5722', // 积木主色调（橙色）
        blocks: [
          // 第一部分：核心连接系统（标签）
          {
            blockType: Scratch.BlockType.LABEL,
            text: "核心连接系统"
          },
          // 连接到加密WebSocket服务器（wss）
          {
            opcode: 'connectSecure',
            blockType: Scratch.BlockType.REPORTER,
            text: '连接到加密服务器 [URL] 的端口 [PORT]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'wss://echo.websocket.org' },
              PORT: { type: Scratch.ArgumentType.STRING, defaultValue: '443' }
            }
          },
          // 发送消息到指定连接
          {
            opcode: 'send',
            blockType: Scratch.BlockType.COMMAND,
            text: '向连接 [ID] 发送消息 [MESSAGE]',
            arguments: {
              MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: '你好，服务器！' },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 获取指定连接的下一条消息
          {
            opcode: 'getNextMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取连接 [ID] 的下一条消息',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 丢弃指定连接的下一条消息
          {
            opcode: 'discardNextMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: '丢弃连接 [ID] 的下一条消息',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 判断指定连接是否在线
          {
            opcode: 'isConnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '连接 [ID] 是否已连接？',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 获取所有在线的连接ID
          {
            opcode: 'getConnectedConnections',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取所有在线连接'
          },
          // 判断指定连接是否有新消息
          {
            opcode: 'hasNewMessages',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '连接 [ID] 是否有新消息？',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 获取指定连接的所有消息
          {
            opcode: 'getAllMessages',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取连接 [ID] 的所有消息',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 断开指定连接
          {
            opcode: 'disconnectFromConnection',
            blockType: Scratch.BlockType.COMMAND,
            text: '断开与连接 [ID] 的连接',
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
            }
          },
          // 断开所有连接
          {
            opcode: 'disconnectall',
            blockType: Scratch.BlockType.COMMAND,
            text: '断开所有连接'
          },
          "---", // 积木分隔线
          // 第二部分：随机工具（标签）
          {
            blockType: Scratch.BlockType.LABEL,
            text: "随机工具"
          },
          // 生成随机连接ID
          {
            opcode: 'generateRandomId',
            blockType: Scratch.BlockType.REPORTER,
            text: '生成随机ID'
          },
          "---", // 积木分隔线
          // 第三部分：Cloudlink 功能（标签，适配 Cloudlink 协议的消息格式）
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Cloudlink 功能"
          },
          // 发送握手消息（Cloudlink 协议）
          {
            opcode: 'sendHandshake',
            blockType: Scratch.BlockType.COMMAND,
            text: '在连接 [ID] 上发送握手消息',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          // 设置用户名（Cloudlink 协议）
          {
            opcode: 'setusername',
            blockType: Scratch.BlockType.COMMAND,
            text: '在连接 [ID] 上设置用户名为 [USERNAME]',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '用户名',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          // 关联房间（Cloudlink 协议，用于分组通信）
          {
            opcode: 'linkrooms',
            blockType: Scratch.BlockType.COMMAND,
            text: '在连接 [ID] 上关联房间 [ROOMS]',
            arguments: {
              ROOMS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["房间1"]',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          // 发送私信（Cloudlink 协议）
          {
            opcode: 'sendMessageCloudlink',
            blockType: Scratch.BlockType.COMMAND,
            text: '在连接 [ID] 上向 [TO] 发送消息 [MESSAGE]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你好！',
              },
              TO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '目标用户名',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          // 消息接收事件（触发型积木）
          {
            opcode: 'recievedMessage',
            blockType: Scratch.BlockType.EVENT,
            text: '当接收到消息时',
            isEdgeActivated: false,
          },
          // 获取最后一条消息的发送来源（Cloudlink 协议）
          {
            opcode: 'receivedFrom',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后一条消息来自',
          },
          // 连接断开事件（触发型积木）
          {
            opcode: 'whenDisconnected',
            blockType: Scratch.BlockType.EVENT,
            text: '当任意WebSocket连接断开时',
            isEdgeActivated: false,
          },
          // 获取最近断开的连接ID
          {
            opcode: 'lastDisconnected',
            blockType: Scratch.BlockType.REPORTER,
            text: '最近断开的连接',
          }
        ]
      };
    }

    // 生成随机ID（由字母和数字组成，长度9位）
    generateRandomId() {
      return Math.random().toString(36).substr(2, 9);
    }

    // 连接加密WebSocket服务器（核心方法，返回连接ID）
    connectSecure({ URL, PORT }) {
      return new Promise((resolve, reject) => {
        const serverId = this.generateRandomId(); // 生成当前连接的唯一ID
        URL = Cast.toString(URL); // 确保URL为字符串类型
        PORT = Cast.toString(PORT); // 确保端口为字符串类型
        
        // 自动补全协议前缀（若URL未带协议，默认添加wss://）
        let prepend = (URL.startsWith("wss://") || URL.startsWith("ws://") || URL.startsWith("https://")) ? "" : "wss://";
        const ws = new WebSocket(prepend + `${URL}:${PORT}`); // 创建WebSocket连接
        
        // 连接成功回调
        ws.onopen = () => {
          this.wsServers[serverId] = ws; // 存储连接实例
          this.connectedServers[serverId] = true; // 标记为在线
          resolve(serverId); // 返回连接ID给Scratch积木
        };
        
        // 接收消息回调
        ws.onmessage = (event) => {
          // 若当前连接的消息队列不存在，则初始化空数组
          if (!this.messageQueue[serverId]) {
            this.messageQueue[serverId] = [];
          }
          this.messageQueue[serverId].push(event.data); // 将消息加入队列
          this.runtime.startHats('webSocketPlus_recievedMessage'); // 触发“当接收到消息时”事件
          this.lastFrom = serverId; // 记录消息来源连接ID
        };
        
        // 连接错误回调
        ws.onerror = (error) => {
          console.error(`连接 ${serverId} 发生WebSocket错误：`, error);
          reject('连接错误'); // 向Scratch返回错误信息
        };
        
        // 连接关闭回调
        ws.onclose = () => {
          this.lastDisconnect = serverId; // 记录断开的连接ID
          delete this.wsServers[serverId]; // 移除连接实例
          delete this.connectedServers[serverId]; // 标记为离线
          // 若连接已离线，向Scratch返回关闭信息
          if (!this.connectedServers[serverId]) {
            reject('连接已关闭');
          }
        };
      });
    }

    // “当接收到消息时”事件积木的占位方法（仅用于触发事件，无实际逻辑）
    recievedMessage() { return ""; }

    // “当任意连接断开时”事件积木的占位方法（仅用于触发事件，无实际逻辑）
    whenDisconnected() { return ""; }

    // 获取最近断开的连接ID
    lastDisconnected() {
      return this.lastDisconnect;
    }
    
    // 获取最后一条消息的来源连接ID
    receivedFrom() {
      return this.lastFrom;
    }

    // 发送消息到指定连接
    send({ MESSAGE, ID }) {
      sendMessage(this.wsServers[Cast.toString(ID)], Cast.toString(MESSAGE));
    }

    // 获取指定连接的下一条消息（修改：返回最新一条消息，而非最早一条）
    getNextMessage({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      if (queue && queue.length > 0) {
        // 修改：返回数组最后一个元素（最近接收的消息）
        return queue[queue.length - 1];
      }
      return ''; // 若无消息，返回空字符串
    }

    // 丢弃指定连接的下一条消息（修改：丢弃最新一条消息，而非最早一条）
    discardNextMessage({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      if (queue && queue.length > 0) {
        // 修改：删除数组最后一个元素（最近接收的消息）
        queue.pop();
      }
    }

    // 判断指定连接是否在线
    isConnected({ ID }) {
      return this.connectedServers[Cast.toString(ID)] || false;
    }

    // 获取所有在线连接的ID（以JSON字符串形式返回）
    getConnectedConnections() {
      return JSON.stringify(Object.keys(this.connectedServers));
    }

    // 判断指定连接是否有未读消息
    hasNewMessages({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      return queue?.length > 0; // 可选链语法：若队列存在且长度>0，返回true
    }

    // 获取指定连接的所有消息（以JSON数组形式返回）
    getAllMessages({ ID }) {
      const queue = JSON.stringify(this.messageQueue[Cast.toString(ID)] || []);
      return queue;
    }

    // 断开指定连接（关闭连接并清理数据）
    disconnectFromConnection({ ID }) {
      const ws = this.wsServers[Cast.toString(ID)];
      if (ws) {
        ws.close(); // 关闭WebSocket连接
        delete this.wsServers[Cast.toString(ID)]; // 移除连接实例
        delete this.messageQueue[Cast.toString(ID)]; // 清空消息队列
        delete this.connectedServers[Cast.toString(ID)]; // 标记为离线
      }
    }

    // 断开所有连接（遍历所有连接并执行断开操作）
    disconnectall() {
      for (const id in this.wsServers) {
        this.disconnectFromConnection({ ID: id });
      }
    }

    // 发送握手消息（适配Cloudlink协议格式）
    sendHandshake({ ID }) {
      let msg = {
        "cmd": "handshake", // 命令类型：握手
        "val": { // 命令参数
          "language": "Scratch", // 来源语言/平台
          "version": { // 版本信息
            "editorType": "Scratch", // 编辑器类型
            "versionNumber": "0.1.3" // 版本号
          }
        },
        "listener": "handshake_cfg" // 监听标识（用于回调匹配）
      };
      // 发送JSON格式的消息
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    // 设置用户名（适配Cloudlink协议格式）
    setusername({ USERNAME, ID }) {
      let msg = {
        "cmd": "setid", // 命令类型：设置ID（用户名）
        "val": Cast.toString(USERNAME), // 用户名参数
        "listener": "username_cfg" // 监听标识
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    // 关联房间（适配Cloudlink协议格式，用于多用户分组通信）
    linkrooms({ ROOMS, ID }) {
      let msg = {
        "cmd": "link", // 命令类型：关联房间
        "val": JSON.parse(ROOMS), // 房间列表（解析JSON字符串为数组）
        "listener": "link" // 监听标识
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    // 发送私信（适配Cloudlink协议格式，定向发送给指定用户）
    sendMessageCloudlink({ ID, MESSAGE, TO }) {
      let msg = {
        "cmd": "pmsg", // 命令类型：私信（private message）
        "val": Cast.toString(MESSAGE), // 消息内容
        "id": Cast.toString(TO) // 目标用户ID（用户名）
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }
  }

  // 注册扩展到Scratch编辑器
  Scratch.extensions.register(new WebSocketServer());
})(Scratch);