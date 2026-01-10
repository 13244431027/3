(function(Scratch) {
  'use strict';

  const vm = Scratch.vm;
  let consoleTitle = "控制台";
  let consoleContent = [];
  let lastCommands = {}; // 按名称存储命令
  let container = null;
  let header = null;
  let inputBox = null;

  // 辅助函数：创建可拖拽的控制台窗口
  function createConsoleWindow() {
    if (container) return container;

    container = document.createElement("div");
    container.id = "scratch-console-container";
    container.style.position = "absolute";
    container.style.left = "50px";
    container.style.top = "50px";
    container.style.width = "400px";
    container.style.height = "200px";
    container.style.background = "#111";
    container.style.color = "#0f0";
    container.style.fontFamily = "monospace";
    container.style.fontSize = "12px";
    container.style.zIndex = "9999";
    container.style.border = "2px solid #0f0";
    container.style.borderRadius = "6px";
    container.style.overflow = "hidden";
    container.style.display = "flex";
    container.style.flexDirection = "column";

    // 标题栏（可拖拽 + 关闭按钮）
    header = document.createElement("div");
    header.style.background = "#222";
    header.style.color = "#0f0";
    header.style.padding = "4px";
    header.style.cursor = "move";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const titleSpan = document.createElement("span");
    titleSpan.id = "scratch-console-title";
    titleSpan.textContent = consoleTitle;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#f44";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "14px";
    closeBtn.onclick = () => {
      closeConsoleWindow();
    };

    header.appendChild(titleSpan);
    header.appendChild(closeBtn);

    // 主体内容区域
    const body = document.createElement("div");
    body.id = "scratch-console-body";
    body.style.flex = "1";
    body.style.overflowY = "auto";
    body.style.padding = "4px";

    // 输入框
    inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = "输入命令...";
    inputBox.style.background = "#000";
    inputBox.style.color = "#0f0";
    inputBox.style.border = "1px solid #0f0";
    inputBox.style.padding = "2px";
    inputBox.style.display = "none"; // 默认隐藏
    inputBox.onkeydown = (e) => {
      if (e.key === "Enter" && inputBox.value.trim() !== "") {
        const value = inputBox.value.trim();
        lastCommands["input"] = value;
        addLine("[输入] " + value, "#ff0");
        inputBox.value = "";
      }
    };

    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(inputBox);

    document.body.appendChild(container);

    // 设置为可拖拽
    makeDraggable(container, header);

    renderConsole();
    return container;
  }

  // 辅助函数：拖拽逻辑
  function makeDraggable(element, handle) {
    let offsetX = 0, offsetY = 0, isDown = false;

    handle.onmousedown = function(e) {
      isDown = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      document.onmousemove = dragMouse;
      document.onmouseup = closeDrag;
    };

    function dragMouse(e) {
      if (!isDown) return;
      element.style.left = (e.clientX - offsetX) + "px";
      element.style.top = (e.clientY - offsetY) + "px";
    }

    function closeDrag() {
      isDown = false;
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }

  // 关闭控制台
  function closeConsoleWindow() {
    if (container) {
      container.remove();
      container = null;
    }
  }

  // 渲染控制台
  function renderConsole() {
    if (!container) return;
    const body = container.querySelector("#scratch-console-body");
    if (body) {
      body.innerHTML = consoleContent.join("<br>");
      body.scrollTop = body.scrollHeight;
    }
    const titleSpan = container.querySelector("#scratch-console-title");
    if (titleSpan) titleSpan.textContent = consoleTitle;
  }

  // 向控制台添加一行
  function addLine(text, color = "#0f0") {
    consoleContent.push(`<span style="color:${color}">${text}</span>`);
    if (consoleContent.length > 200) consoleContent.shift();
    renderConsole();
  }

  class ConsoleExtension {
    getInfo() {
      return {
        id: 'consoleExt',
        name: '控制台',
        blocks: [
          { opcode: 'openConsole', blockType: Scratch.BlockType.COMMAND, text: '打开控制台' },
          { opcode: 'closeConsole', blockType: Scratch.BlockType.COMMAND, text: '关闭控制台' },
          { opcode: 'setTitle', blockType: Scratch.BlockType.COMMAND, text: '设置控制台标题为 [TITLE]', arguments: { TITLE: {type: Scratch.ArgumentType.STRING, defaultValue: '控制台'} } },
          { opcode: 'clearConsole', blockType: Scratch.BlockType.COMMAND, text: '清空控制台' },
          { opcode: 'resizeConsole', blockType: Scratch.BlockType.COMMAND, text: '调整大小为 宽: [W] 高: [H]', arguments: { W: {type: Scratch.ArgumentType.NUMBER, defaultValue: 400}, H: {type: Scratch.ArgumentType.NUMBER, defaultValue: 200} } },
          { opcode: 'consoleStretch', blockType: Scratch.BlockType.REPORTER, text: '控制台 [DIM] 尺寸', arguments: { DIM: {type: Scratch.ArgumentType.STRING, menu: 'dimensionMenu'} } },
          { opcode: 'setPosition', blockType: Scratch.BlockType.COMMAND, text: '设置控制台位置 X: [X] Y: [Y]', arguments: { X: {type: Scratch.ArgumentType.NUMBER, defaultValue: 50}, Y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 50} } },
          { opcode: 'getPosition', blockType: Scratch.BlockType.REPORTER, text: '控制台 [AXIS] 坐标', arguments: { AXIS: {type: Scratch.ArgumentType.STRING, menu: 'axisMenu'} } },
          { opcode: 'toggleInputBox', blockType: Scratch.BlockType.COMMAND, text: '[STATE] 命令输入框', arguments: { STATE: {type: Scratch.ArgumentType.STRING, menu: 'showHideMenu'} } },
          { opcode: 'warn', blockType: Scratch.BlockType.COMMAND, text: '警告 [MSG]', arguments: { MSG: {type: Scratch.ArgumentType.STRING, defaultValue: '警告'} } },
          { opcode: 'log', blockType: Scratch.BlockType.COMMAND, text: '日志 [MSG]', arguments: { MSG: {type: Scratch.ArgumentType.STRING, defaultValue: '你好'} } },
          { opcode: 'error', blockType: Scratch.BlockType.COMMAND, text: '错误 [MSG]', arguments: { MSG: {type: Scratch.ArgumentType.STRING, defaultValue: '错误!'} } },
          { opcode: 'info', blockType: Scratch.BlockType.COMMAND, text: '信息 [MSG]', arguments: { MSG: {type: Scratch.ArgumentType.STRING, defaultValue: '信息'} } },
          { opcode: 'sendCommand', blockType: Scratch.BlockType.COMMAND, text: '发送控制台命令 [NAME] 为 [CMD]', arguments: { NAME: {type: Scratch.ArgumentType.STRING, defaultValue: '测试'}, CMD: {type: Scratch.ArgumentType.STRING, defaultValue: '/test'} } },
          { opcode: 'didReceiveCommand', blockType: Scratch.BlockType.BOOLEAN, text: '控制台收到命令 [NAME] 了吗?', arguments: { NAME: {type: Scratch.ArgumentType.STRING, defaultValue: '测试'} } },
          { opcode: 'getCommand', blockType: Scratch.BlockType.REPORTER, text: '获取 [NAME] 命令', arguments: { NAME: {type: Scratch.ArgumentType.STRING, defaultValue: '测试'} } },
          { opcode: 'insertJS', blockType: Scratch.BlockType.COMMAND, text: '向开发者工具控制台插入 [JS]', arguments: { JS: {type: Scratch.ArgumentType.STRING, defaultValue: 'alert("你好")'} } }
        ],
        menus: {
          dimensionMenu: { items: ['宽度', '高度'] },
          axisMenu: { items: ['X', 'Y'] },
          showHideMenu: { items: ['显示', '隐藏'] }
        }
      };
    }

    openConsole() { createConsoleWindow(); }
    closeConsole() { closeConsoleWindow(); }
    setTitle(args) { consoleTitle = args.TITLE; renderConsole(); }
    clearConsole() { consoleContent = []; renderConsole(); }

    resizeConsole(args) {
      if (container) {
        container.style.width = args.W + "px";
        container.style.height = args.H + "px";
      }
    }

    consoleStretch(args) {
      if (!container) return "";
      if (args.DIM === "宽度") return container.offsetWidth;
      if (args.DIM === "高度") return container.offsetHeight;
      return "";
    }

    setPosition(args) {
      if (container) {
        container.style.left = args.X + "px";
        container.style.top = args.Y + "px";
      }
    }

    getPosition(args) {
      if (!container) return "";
      if (args.AXIS === "X") return parseInt(container.style.left) || 0;
      if (args.AXIS === "Y") return parseInt(container.style.top) || 0;
      return "";
    }

    toggleInputBox(args) {
      if (!inputBox) return;
      if (args.STATE === "显示") inputBox.style.display = "block";
      if (args.STATE === "隐藏") inputBox.style.display = "none";
    }

    warn(args) { console.warn(args.MSG); addLine("[警告] " + args.MSG, "yellow"); }
    log(args) { console.log(args.MSG); addLine("[日志] " + args.MSG, "#0f0"); }
    error(args) { console.error(args.MSG); addLine("[错误] " + args.MSG, "red"); }
    info(args) { console.info(args.MSG); addLine("[信息] " + args.MSG, "cyan"); }

    sendCommand(args) { lastCommands[args.NAME] = args.CMD; addLine("[命令] " + args.NAME + " → " + args.CMD, "#0ff"); }
    didReceiveCommand(args) { return lastCommands.hasOwnProperty(args.NAME); }
    getCommand(args) { return lastCommands[args.NAME] || ""; }

    insertJS(args) {
      try { eval(args.JS); console.log("已执行自定义JS:", args.JS); }
      catch (e) { console.error("JS错误:", e); }
    }
  }

  Scratch.extensions.register(new ConsoleExtension());
})(Scratch);