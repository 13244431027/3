// Name: 样式列表
// ID: SPlistMonitors
// Description: 自定义和组织列表监视器。
// By: SharkPool

// Version 2.1.0

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("样式列表必须在非沙盒环境中运行！");

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2Mi4xNDMiIGhlaWdodD0iNjIuMTQzIiB2aWV3Qm94PSIwIDAgNjIuMTQzIDYyLjE0MyI+PHBhdGggZD0iTTAgMzEuMDcxQzAgMTMuOTExIDEzLjkxIDAgMzEuMDcxIDBjMTcuMTYgMCAzMS4wNzEgMTMuOTEgMzEuMDcxIDMxLjA3MSAwIDE3LjE2LTEzLjkxIDMxLjA3MS0zMS4wNzEgMzEuMDcxQzEzLjkxMSA2Mi4xNDIgMCA0OC4yMzIgMCAzMS4wNzEiIGZpbGw9IiNjYzQ2MDIiLz48cGF0aCBkPSJNMy41NjQgMzEuMDcxYzAtMTUuMTkyIDEyLjMxNS0yNy41MDcgMjcuNTA3LTI3LjUwN3MyNy41MDcgMTIuMzE1IDI3LjUwNyAyNy41MDctMTIuMzE1IDI3LjUwNy0yNy41MDcgMjcuNTA3UzMuNTY0IDQ2LjI2MyAzLjU2NCAzMS4wNzEiIGZpbGw9IiNmZjY2MWEiLz48cGF0aCBkPSJtNDQuMjM5IDM4LjY0NS0uMDA1LjA0N3Y0Ljc2NGMwIC41NzMtLjQ2MyAxLjA0LTEuMDM3IDEuMDQzdi4wMDFIMjYuOTFhMS4wNDMgMS4wNDMgMCAwIDEtMS4wMzctMS4wNDRoLS4wMDV2LTQuNzU0Yy0uMDAxLS4wMi0uMDA2LS4wMzctLjAwNi0uMDU2IDAtLjU3Ny40NjgtMS4wNDQgMS4wNDQtMS4wNDRoMTYuMjkxYTEuMDQzIDEuMDQzIDAgMCAxIDEuMDQyIDEuMDQzbS0yMy4yNjQtLjczOGMuMTk2LjE5Ni4zMDUuNDYxLjMwNS43Mzh2NC44MWMwIC41NzYtLjQ2NyAxLjA0My0xLjA0NCAxLjA0NGgtNC44MWExLjA0NCAxLjA0NCAwIDAgMS0xLjA0NC0xLjA0NHYtNC44MWMwLS41NzYuNDY4LTEuMDQ0IDEuMDQ0LTEuMDQ0aDQuODExYy4yNzcgMCAuNTQyLjExLjczOC4zMDZtMjMuMjY0LTEwLjc2LS4wMDUuMDQ3djQuNzY0YzAgLjU3NC0uNDYzIDEuMDQtMS4wMzcgMS4wNDN2LjAwMUgyNi45MWExLjA0MyAxLjA0MyAwIDAgMS0xLjAzNy0xLjA0NGgtLjAwNXYtNC43NTRjLS4wMDEtLjAxOS0uMDA2LS4wMzYtLjAwNi0uMDU2IDAtLjU3Ni40NjgtMS4wNDMgMS4wNDQtMS4wNDRoMTYuMjkxYTEuMDQzIDEuMDQzIDAgMCAxIDEuMDQyIDEuMDQ0bS0yMy4yNjQtLjczOGMuMTk2LjE5Ni4zMDUuNDYxLjMwNS43Mzh2NC44MWMwIC41NzctLjQ2NyAxLjA0NC0xLjA0NCAxLjA0NGgtNC44MWExLjA0NCAxLjA0NCAwIDAgMS0xLjA0NC0xLjA0NHYtNC44MWMwLS41NzYuNDY4LTEuMDQzIDEuMDQ0LTEuMDQ0aDQuODExYy4yNzcgMCAuNTQyLjExLjczOC4zMDZtNC44OTItNS45MTN2LTQuNzU1YzAtLjAyLS4wMDUtLjAzNy0uMDA1LS4wNTYgMC0uNTc2LjQ2Ny0xLjA0NCAxLjA0NC0xLjA0NGgxNi4yOTFhMS4wNDQgMS4wNDQgMCAwIDEgMS4wNDIgMS4wNDRsLS4wMDUuMDQ2djQuNzY0YzAgLjU3NC0uNDYzIDEuMDQtMS4wMzcgMS4wNDRIMjYuOTFhMS4wNDMgMS4wNDMgMCAwIDEtMS4wMzctMS4wNDN6bS00Ljg5Mi01LjU1Yy4xOTYuMTk3LjMwNS40NjIuMzA1LjczOXY0LjgxYzAgLjU3Ni0uNDY3IDEuMDQzLTEuMDQ0IDEuMDQ0aC00LjgxYTEuMDQ0IDEuMDQ0IDAgMCAxLTEuMDQ0LTEuMDQ0di00LjgxYzAtLjU3Ni40NjgtMS4wNDQgMS4wNDQtMS4wNDRoNC44MTFjLjI3NyAwIC41NDIuMTEuNzM4LjMwNiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00Ni43NjEgMzMuMDYyYy41MjEgMCAuOTQ0LjQyMy45NDQuOTQ0djEwLjQ3NkgzNy4yMjZjLS41Mi0uMDAyLS45NC0uMzM0LS45NC0uODU0bC4wMDMtNC40MzZjMC0uNTE5LjQ2NC0uOTg1Ljk4Mi0uOTg4bDQuMi4wNDR2LTQuMjM5YS45NDMuOTQzIDAgMCAxIC45NDMtLjkzN3oiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2ZmNjYxYSIgc3Ryb2tlLXdpZHRoPSI2Ii8+PHBhdGggZD0iTTQ2Ljc2MSAzMy4wNjJjLjUyMSAwIC45NDQuNDIzLjk0NC45NDR2NC4yNDJoNC4yMzlhLjk0My45NDMgMCAwIDEgLjkzNy45NDRsLjAxIDQuMzQ2YS45NDQuOTQ0IDAgMCAxLS45NDQuOTQ0aC00LjI0MnY0LjI0NWMtLjAwMi41Mi0uNDY5Ljk0LS45ODkuOTRsLTQuMjU2LS4wMDNjLS41MTkgMC0uOTg1LS40MTktLjk4OC0uOTM3di00LjI0NWgtNC4yNDZjLS41Mi0uMDAyLS45NC0uMzM0LS45NC0uODU0bC4wMDMtNC40MzZjMC0uNTE5LjQ2NC0uOTg1Ljk4Mi0uOTg4bDQuMi4wNDR2LTQuMjM5YS45NDMuOTQzIDAgMCAxIC45NDMtLjkzN3oiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const builtInFonts = [
    "Scratch", "无衬线体", "衬线体",
    "手写体", "标记笔", "花体字", "像素体"
  ];
  let listDocs;
  if (typeof scaffolding !== "undefined") {
    listDocs = {
      body : "sc-monitor-root",
      value : "sc-monitor-row-value-outer", value2 : "sc-monitor-row-value-inner",
      ind : "sc-monitor-row-index",
      head : "sc-monitor-list-label", foot : "sc-monitor-list-footer-text",
      pkg1 : "", addButton : "sc-monitor-list-add",
      grid : ".sc-monitor-rows-inner", contain : ".sc-monitor-rows-inner",
      row : "sc-monitor-row-root", span : ""
    };
  } else {
    listDocs = {
      body : "monitor_list-monitor",
      value : "monitor_list-value", value2 : "monitor_value-inner",
      ind : "monitor_list-index",
      head : "monitor_list-header", foot : "monitor_footer-length_2",
      pkg1 : `[class*="monitor_"]`, addButton : "monitor_add-button",
      grid : ".ReactVirtualized__Grid.ReactVirtualized__List", contain : ".ReactVirtualized__Grid__innerScrollContainer",
      row : "monitor_list-row", span : "span"
    };
  }
  let visualLists = {};

  class SPlistMonitors {
    constructor() {
      runtime.on("MONITORS_UPDATE", () =>{
        for (const [id, { util }] of Object.entries(visualLists)) {
          const monitor = document.querySelector(`div[data-id="${id}"][class*="monitor"]`);
          if (!monitor) delete visualLists[id];
          else {
            const monBody = typeof scaffolding !== "undefined" ? monitor : monitor.querySelector(`div[class^="${listDocs.body}"]`);
            this.stretchList({
              LIST: id, WIDTH: parseFloat(monBody.style.width),
              HEIGHT: parseFloat(monBody.style.height), SECRET: true
            }, util);
            const columns = monitor.getAttribute("SPcolumnCnt") || 1;
            if (columns > 1) this.renderList({ LIST: id, NUM: columns, SECRET: true }, util);
          }
        }
      });
    }
    getInfo() {
      return {
        id: "SPlistMonitors",
        name: "样式列表",
        color1: "#FF661A",
        color2: "#ba3e00",
        color3: "#cc4602",
        menuIconURI,
        blocks: [
          {
            opcode: "listExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "列表 [LIST] 存在吗？",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: "我的列表" },
            },
          },
          {
            opcode: "isShowing",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "列表 [LIST] 正在显示吗？",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
            },
          },
          {
            opcode: "makeList",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建名为 [LIST] 的列表 [TYPE]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: "我的列表" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "listTypes" }
            },
          },
          {
            opcode: "deleteList",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除列表 [LIST]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "setVis",
            blockType: Scratch.BlockType.COMMAND,
            text: "[VIS] 列表 [LIST]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              VIS: { type: Scratch.ArgumentType.STRING, menu: "VISIBLE" }
            },
          },
          "---",
          {
            opcode: "renderList",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 渲染为 [NUM] 列",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
            },
          },
          {
            opcode: "getColumns",
            blockType: Scratch.BlockType.REPORTER,
            text: "[LIST] 的列数",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          "---",
          {
            opcode: "stretchList",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 拉伸为宽度: [WIDTH] 高度: [HEIGHT]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 }
            },
          },
          {
            opcode: "getAtt",
            blockType: Scratch.BlockType.REPORTER,
            text: "获取 [LIST] 的 [THING]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              THING: { type: Scratch.ArgumentType.STRING, menu: "ATTS" }
            },
          },
          "---",
          {
            opcode: "chooseOption",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 中的 [THING] 设为 [ON_OFF]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              THING: { type: Scratch.ArgumentType.STRING, menu: "listUtils" },
              ON_OFF: { type: Scratch.ArgumentType.STRING, menu: "ON_OFF" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "定位" },
          {
            opcode: "setPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 的位置设置为 x: [x] y: [y]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            },
          },
          {
            opcode: "currentPos",
            blockType: Scratch.BlockType.REPORTER,
            text: "[LIST] 的当前 [POSITION]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              POSITION: { type: Scratch.ArgumentType.STRING, menu: "POSITIONS" }
            },
          },
          "---",
          {
            opcode: "setScroll",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 的滚动条位置设置为 [SCROLL]%",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              SCROLL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "格式化和效果" },
          {
            opcode: "resetAll",
            blockType: Scratch.BlockType.COMMAND,
            text: "重置对 [LIST] 的所有更改",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
            },
          },
          {
            opcode: "formatItems",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 中的项目文本对齐到 [ALIGN]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              ALIGN: { type: Scratch.ArgumentType.STRING, menu: "ALIGN" }
            },
          },
          {
            opcode: "setDisplay",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 的 [DISPLAY] 名称设置为 [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "我的更酷列表" },
              DISPLAY: { type: Scratch.ArgumentType.STRING, menu: "list_displays" },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "setColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 中第 [NUM] 个项目的颜色设置为 [COLOR]",
            arguments: {
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#0000ff" },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "setLabel",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 中第 [NUM] 个标签的名称设置为 [VALUE]",
            arguments: {
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "项目 1" },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "setFont",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 的字体设置为 [FONT]",
            arguments: {
              FONT: { type: Scratch.ArgumentType.STRING, menu: "allFonts" },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          "---",
          {
            opcode: "resetEffect",
            blockType: Scratch.BlockType.COMMAND,
            text: "重置 [LIST] 的效果",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "setEffect",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 的 [EFFECT] 设置为 [AMOUNT]",
            arguments: {
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              EFFECT: { type: Scratch.ArgumentType.STRING, menu: "EFFECTS" },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "stretchEffect",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [LIST] 缩放为 x: [x] y: [y]",
            arguments: {
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" }
            },
          },
          {
            opcode: "currentEffect",
            blockType: Scratch.BlockType.REPORTER,
            text: "[LIST] 的当前 [EFFECT]",
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, menu: "lists" },
              EFFECT: { type: Scratch.ArgumentType.STRING, menu: "ALL_EFFECTS" }
            },
          }
        ],
        menus: {
          lists: { acceptReporters: true, items: "getLists" },
          allFonts: { acceptReporters: true, items: "getFonts" },
          EFFECTS: { acceptReporters: true, items: this.getEffects(false) },
          ALL_EFFECTS: { acceptReporters: true, items: this.getEffects(true) },
          POSITIONS: ["x", "y"],
          list_displays: ["标题", "页脚"],
          listTypes: ["全局", "仅适用于此角色"],
          listUtils: ["点击事件", "文本高亮", "编号项目", "+ 和 = 按钮"],
          ON_OFF: ["开启", "关闭"],
          VISIBLE: { acceptReporters: true, items: ["显示", "隐藏"] },
          ATTS: { acceptReporters: true, items: ["宽度", "高度"] },
          ALIGN: { acceptReporters: true, items: ["左", "右", "居中"] }
        }
      }
    }

    // 辅助函数
    getLists() {
      const globalLists = Object.values(runtime.getTargetForStage().variables).filter((x) => x.type == "list");
      const localLists = Object.values(vm.editingTarget.variables).filter((x) => x.type == "list");
      const listMenu = [...new Set([...globalLists, ...localLists])];
      if (listMenu.length === 0) return [{ text: "创建一个列表", value: "创建一个列表" }];
      return listMenu.map((i) => ({ text: i.name, value: i.id }));
    }

    getFonts() {
      const customFonts = runtime.fontManager ? runtime.fontManager.getFonts().map((i) => ({ text: i.name, value: i.family })) : [];
      return [...builtInFonts, ...customFonts];
    }

    getEffects(enable) {
      return [
        "模糊", "饱和度", "对比度", "亮度",
        "色相", "不透明度", "复古", "反色", "方向",
        ...(enable ? ["缩放 x", "缩放 y"] : []),
        "倾斜 x", "倾斜 y"
      ];
    }

    getListID(idName, util) {
      const byId = util.target.lookupVariableById(idName);
      if (byId && byId.type === "list") return byId.id;
      const byName = util.target.lookupVariableByNameAndType(idName, "list");
      return byName ? byName.id : undefined;
    }

    getMonitor(id, util, returnID) {
      id = this.getListID(id, util);
      if (!id) return returnID ? {} : undefined;
      if (returnID) return { id, listMon: document.querySelector(`div[data-id="${id}"][class*="monitor"]`) };
      else return document.querySelector(`div[data-id="${id}"][class*="monitor"]`);
    }

    applyChanges(listMon, id) {
      const list = visualLists[id];
      if (list === undefined) return;
      if (list.listenerApplied === undefined) {
        list.listenerApplied = true;
        const container = listMon.querySelector(listDocs.grid);
        container.addEventListener("scroll", () => this.applyChanges(listMon, id));
      }
      const isPackaged = typeof scaffolding !== "undefined";
      const allItems = listMon.querySelectorAll(`div[class^="${listDocs.body}"] [class^="${listDocs.value}"]`);
      const newLabels = list.labels || {}, newColors = list.colors || {};
      allItems.forEach((item) => {
        const i = isPackaged ? item.parentNode.getAttribute("data-index") : item.getAttribute("dataindex");
        if (newLabels[i]) item.previousSibling.textContent = newLabels[i];
        if (isPackaged) item.style.background = newColors[i] || ""; // 标签自动重置，颜色不会
        else if (newColors[i]) item.style.background = newColors[i];
      });
    }

    genId() {
      // 用于为变量创建ID
      const soup = "!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const id = [];
      for (let i = 0; i < 20; i++) id[i] = soup.charAt(Math.random() * soup.length);
      return id.join("");
    }

    refresh() {
      // 用于刷新工具箱以显示新建/删除的列表
      if (typeof scaffolding === "undefined") {
        vm.emitWorkspaceUpdate();
        const workspace = ScratchBlocks.getMainWorkspace();
        workspace.toolboxRefreshEnabled_ = true;
        workspace.refreshToolboxSelection_();
        workspace.toolboxRefreshEnabled_ = false;
        setTimeout(() => { runtime.requestBlocksUpdate() }, 10);
      }
    }

    // 块函数
    isShowing(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return false;
      return runtime.getMonitorState().get(id)?.visible || false;
    }

    listExists(args, util) { return Scratch.Cast.toBoolean(this.getListID(args.LIST, util)) }

    makeList(args, util) {
      const listName = Scratch.Cast.toString(args.LIST);
      if (this.getListID(args.LIST, util)) return;
      if (args.TYPE === "仅适用于此角色") util.target.createVariable(this.genId(), listName, "list");
      else runtime.getTargetForStage().createVariable(this.genId(), listName, "list");
      return this.refresh();
    }

    deleteList(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return;
      runtime.getTargetForStage().deleteVariable(id)
      util.target.deleteVariable(id);
      return this.refresh();
    }

    setVis(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return;
      runtime.monitorBlocks.changeBlock({
        id, element: "checkbox", value: args.VIS === "显示"
      }, runtime);
    }

    renderList(args, util) {
      const { id, listMon } = this.getMonitor(args.LIST, util, true);
      if (!listMon) return;
      const items = util.target.lookupVariableById(id).value;
      const columnCnt = Math.min(100, Math.round(Scratch.Cast.toNumber(args.NUM)));
      listMon.setAttribute("SPcolumnCnt", columnCnt);
      let container = listMon.querySelector(`div[class^="SPstyLists-columnRender"`);
      if (container) container.parentNode.removeChild(container);
      if (items.length === 0) return;
      // 从这里开始，我们知道至少有一个项目存在。我们可以从该项目中获取类名，
      // 这样我们就不会丢失CSS属性并支持自定义样式
      let itemDiv = [], listContain = listMon.querySelector(listDocs.contain);
      if (!listContain) return; // 不应该发生，但检查以防万一
      const firstItem = listMon.querySelector(`[class^="${listDocs.row}"]`);
      const itemClasses = [firstItem.className]; // 总是4个项目
      firstItem.querySelectorAll("*").forEach(el => {itemClasses.push(el.className) });
      if (columnCnt === 1) listContain.style.display = "";
      else {
        listContain.style.display = "none";
        container = document.createElement("div");
        container.className = "SPstyLists-columnRender";
        container.style.overflow = "scroll";
        container.style.overflowX = "hidden";
        container.style.height = "100%";
        container.style.position = "relative";
        container.addEventListener("scroll", () => this.applyChanges(listMon, id));
        for (let i = 0; i < Math.ceil(items.length / columnCnt); i++) {
          const row = document.createElement("div");
          row.className = itemClasses[0];
          row.style.position = "absolute";
          row.style.width = "100%";
          row.style.height = "24px";
          row.style.top = `${i * 24}px`;
          for (let j = 0; j < columnCnt; j++) {
            const listItem = items[i * columnCnt + j];
            const item = document.createElement("div");
            item.className = itemClasses[0];
            item.setAttribute("data-index", i * columnCnt + j);
            item.style.width = `${100 / columnCnt}%`;
            item.style.left = `${(100 / columnCnt) * j}%`;
            const index = document.createElement("div");
            index.className = itemClasses[1];
            index.textContent = i * columnCnt + j + 1;
            item.appendChild(index);

            const value = document.createElement("div");
            value.className = itemClasses[2];
            value.style.background = "#ff661a";
            value.style.color = "#fff";
            value.setAttribute("dataindex", i * columnCnt + j);
            const valueInner = document.createElement("div");
            valueInner.className = itemClasses[3];
            valueInner.textContent = listItem || "";
            value.appendChild(valueInner);
            item.appendChild(value);
            if (listItem === undefined) item.style.opacity = "0"; // 使用幽灵项目保持项目分离
            row.appendChild(item);
          }
          itemDiv.push(row)
        }
        container.append(...itemDiv);
        listContain.parentNode.insertBefore(container, listContain);
        if (args.SECRET === undefined) visualLists[id] = { ...visualLists[id], util };
        this.applyChanges(listMon, id);
      }
    }

    getColumns(args, util) {
      const listMon= this.getMonitor(args.LIST, util);
      if (!listMon) return 0;
      return listMon ? listMon.getAttribute("SPcolumnCnt") || 1 : 1;
    }

    stretchList(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return;
      const width = Math.max(1, Math.min(99999, Scratch.Cast.toNumber(args.WIDTH)));
      const height = Math.max(1, Math.min(99999, Scratch.Cast.toNumber(args.HEIGHT)));
      if (args.SECRET === undefined) visualLists[id] = { ...visualLists[id], util };
      if (typeof scaffolding === "undefined") {
        // 编辑器监视器GUI无法强制视觉更新，我们需要手动完成
        const listMon = document.querySelector(`div[data-id="${id}"] [class*="monitor_list"]`);
        if (!listMon) return;
        const outerModal = listMon.querySelector(listDocs.grid);
        const innerModal = listMon.querySelector(listDocs.contain);
        listMon.style.width = `${width}px`; listMon.style.height = `${height}px`;
        outerModal.style.width = `${width}px`; outerModal.style.height = `${height}px`;
        if (innerModal) {
          innerModal.style.width = "auto";
          innerModal.style.maxWidth = `${width}px`;
        }
      }
      runtime.requestUpdateMonitor(new Map([["id", id], ["width", width], ["height", height]]));
    }

    getAtt(args, util) {
      let listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return "";
      listMon = typeof scaffolding !== "undefined" ? listMon : listMon.querySelector(`div[class^="${listDocs.body}"]`);
      return parseFloat(listMon.style[args.THING === "宽度" ? "width" : "height"]);
    }

    chooseOption(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return;
      const disable = args.ON_OFF === "关闭";
      if (args.THING === "点击事件") listMon.style.pointerEvents = disable ? "none" : "auto";
      else if (args.THING === "文本高亮") {
        const items = listMon.querySelectorAll(`div[class^="${listDocs.value2}"]`);
        items.forEach(item => {
          item.style.userSelect = disable ? "none " : "auto";
          item.style.webkitUserSelect = disable ? "none" : "auto";
        });
      } else if (args.THING === "编号项目") {
        const numberedItems = listMon.querySelectorAll(`div[class^="${listDocs.ind}"]`);
        numberedItems.forEach(item => { item.style.display = disable ? "none" : "block" });
      } else if (args.THING === "+ 和 = 按钮") {
        let button1 = listMon.querySelector(`div[class^="${listDocs.addButton}"]`);
        let button2 = typeof scaffolding !== "undefined" ? button1 : listMon.querySelector(`div[class^="monitor_resize-handle"]`);
        if (button1 === null || button2 === null) {
          const buttons = listMon.querySelectorAll(".no-drag");
          buttons.forEach(button => { button.style.display = disable ? "none" : "block" });
        } else {
          button1.style.display = disable ? "none" : "block";
          button2.style.display = disable ? "none" : "block";
        }
        let text = listMon.querySelector(`div[class^="${listDocs.foot}"]`);
        text.style.margin = "0 auto";
      }
    }

    setPosition(args, util) {
      const { id, listMon } = this.getMonitor(args.LIST, util, true);
      if (!listMon) return;
      const canvas = [runtime.stageWidth / 2, runtime.stageHeight / 2];
      const regex = /transform:([^;]+);/;

      const box = typeof scaffolding !== "undefined" ? listMon : listMon.querySelector(`div[class^="${listDocs.body}"]`);
      const sizeOffset = [parseFloat(box.style.width), parseFloat(box.style.height)];
      const x = Scratch.Cast.toNumber(args.x) + canvas[0] - (sizeOffset[0] / 2);
      const y = (Scratch.Cast.toNumber(args.y) - canvas[1] + (sizeOffset[1] / 2)) * -1;

      let styleAtt = listMon.getAttribute("style");
      const transformMatch = styleAtt.match(regex);
      if (transformMatch) {
        const newTransform = transformMatch[1].replace(/translate\([^)]+\)/, `translate(${x}px, ${y}px)`);
        listMon.setAttribute("style", styleAtt.replace(regex, `transform:${newTransform}; top: 5; left: 5;`));
        runtime.requestUpdateMonitor(new Map([["id", id], ["x", x], ["y", y]]));
      }
    }

    currentPos(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return "";
      const canvas = [runtime.stageWidth / 2, runtime.stageHeight / 2];
      const box = typeof scaffolding !== "undefined" ? listMon : listMon.querySelector(`div[class^="${listDocs.body}"]`);
      const sizeOffset = [parseFloat(box.style.width), parseFloat(box.style.height)];
      const styleAtt = listMon.getAttribute("style");
      if (styleAtt) {
        const match = styleAtt.match(/transform\s*:\s*translate\((-?\d+(?:\.\d+)?px),\s*(-?\d+(?:\.\d+)?px)\)/);
        if (match) return args.POSITION === "x" ? parseInt(match[1]) - canvas[0] + (sizeOffset[0] / 2) :
          ((parseInt(match[2]) * -1) + canvas[1]) - (sizeOffset[1] / 2);
      }
      return "";
    }

    setScroll(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return;
      let grid = document.querySelector(`div[data-id="${id}"] ${listDocs.grid}`);
      let spGrid = document.querySelector(`div[data-id="${id}"] [class^="SPstyLists-columnRender"`);
      const value = Scratch.Cast.toNumber(args.SCROLL) / 100;
      if (spGrid !== null) spGrid.scrollTop = value * (spGrid.scrollHeight - spGrid.clientHeight);
      else if (grid !== null) grid.scrollTop = value * (grid.scrollHeight - grid.clientHeight);
    }

    resetAll(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id || !this.isShowing(args, util)) return;
      const setVisible = (id, visible) => {
        runtime.monitorBlocks.changeBlock({ id: id, element: "checkbox", value: visible }, runtime);
      }
      const onVisUpdate = () => {
        runtime.once("AFTER_EXECUTE", () => { 
          setVisible(id, true);
          runtime.off("MONITORS_UPDATE", onVisUpdate);
        });
      };
      runtime.once("MONITORS_UPDATE", onVisUpdate);
      setVisible(id, false);
    }

    formatItems(args, util) {
      let listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return;
      listMon = listMon.querySelector(listDocs.contain);
      if (listMon === null) return;
      const items = Array.from(listMon.querySelectorAll(`div[class^="${listDocs.value}"]`));
      items.forEach(item => { item.style.textAlign = args.ALIGN });
    }

    setDisplay(args, util) {
      const id = this.getListID(args.LIST, util);
      if (!id) return;
      let label;
      if (args.DISPLAY === "标题") label = document.querySelector(`div[data-id="${id}"] ${listDocs.pkg1}[class^="${listDocs.head}"]`);
      else label = document.querySelector(`div[data-id="${id}"] ${listDocs.pkg1}[class^="${listDocs.foot}"] ${listDocs.span}`);
      if (label) label.textContent = args.NAME;
    }

    setColor(args, util) {
      const { id, listMon } = this.getMonitor(args.LIST, util, true);
      if (!listMon) return;
      const index = Math.max(0, Scratch.Cast.toNumber(args.NUM) - 1);
      const currentList = visualLists[id] || {};
      visualLists[id] = { ...currentList, util, colors: { ...currentList.colors, [index]: args.COLOR } };
      this.applyChanges(listMon, id);
    }

    setLabel(args, util) {
      const { id, listMon } = this.getMonitor(args.LIST, util, true);
      if (!listMon) return;
      const index = Math.max(0, Scratch.Cast.toNumber(args.NUM) - 1);
      const val = args.VALUE.replaceAll(" ", " ");
      const currentList = visualLists[id] || {};
      visualLists[id] = { ...currentList, util, labels: { ...currentList.labels, [index]: val } };
      this.applyChanges(listMon, id);
    }

    setFont(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (listMon) listMon.style.fontFamily = args.FONT;
    }

    resetEffect(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return;
      let curTransform = listMon.style.transform || "";
      const matches = curTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      let translation = matches ? `translate(${matches[1]}, ${matches[2]})` : "";
      listMon.style.transform = translation.replace(/scale\([^,]+,\s*[^)]+\)/g, "scale(1)");
      listMon.style.filter = "";
    }

    setEffect(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return;
      let curTransform = listMon.style.transform || "";
      let curFilter = listMon.style.filter || "";
      let effect = args.EFFECT, amountIn = Scratch.Cast.toNumber(args.AMOUNT);
      if (effect === "饱和度") effect = "saturate";
      else if (effect === "色相") effect = "hue-rotate";
      else if (effect === "亮度") amountIn += 100;
      else if (effect === "倾斜 x") effect = "skewX";
      else if (effect === "倾斜 y") effect = "skewY";
      else if (effect === "方向") {
        effect = "rotate";
        amountIn -= 90;
      }
      const regex = new RegExp(`${effect}\\([^)]+\\)`, "g");
      curTransform = curTransform.replace(regex, "").trim();
      curFilter = curFilter.replace(regex, "").trim();
      if (effect === "rotate" || effect.includes("skew")) {
        curTransform += ` ${effect}(${amountIn}deg)`;
        listMon.style.transform = curTransform.trim();
      } else {
        curFilter += ` ${effect}(${amountIn}${effect === "blur" ? "px" : effect === "hue-rotate" ? "deg" : "%"})`;
        listMon.style.filter = curFilter.trim();
      }
    }

    stretchEffect(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return;
      let curTransform = listMon.style.transform || "";
      const scaleTxt = `scale(${Scratch.Cast.toNumber(args.x) / 100}, ${Scratch.Cast.toNumber(args.y) / 100})`;
      listMon.style.transform = `${curTransform.replace(/scale\([^)]*\)/g, "")} ${scaleTxt}`;
    }

    currentEffect(args, util) {
      const listMon = this.getMonitor(args.LIST, util);
      if (!listMon) return "";
      const effect = Scratch.Cast.toString(args.EFFECT);
      const curTransform = listMon.style.transform || "";
      const curFilter = listMon.style.filter || "";
      const setEffect = {
        饱和度: "saturate", 色相: "hue-rotate", 方向: "rotate",
        "缩放 x": "scale", "缩放 y": "scale",
        亮度: "brightness", 不透明度: "opacity",
        "倾斜 x": "skewX", "倾斜 y": "skewY"
      }[effect] || effect;
      const defaultV = {
        饱和度: 100, 色相: 0, 方向: 90,
        "缩放 x": 100, "缩放 y": 100,
        亮度: 0, 不透明度: 100
      }[effect] || 0;

      const regex = new RegExp(`${setEffect}\\(([^)]+)\\)`);
      const transformMatch = curTransform.match(regex);
      const filterMatch = curFilter.match(regex);
      if (filterMatch || transformMatch) {
        const unitVal = (filterMatch || transformMatch)[1];
        const pureVal = parseFloat(unitVal.replace(/[^0-9.-]/g, ""));
        if (setEffect === "brightness") return pureVal - 100;
        else if (setEffect === "rotate") return pureVal + 90;
        else if (setEffect === "scale") return unitVal.split(", ")[effect.includes("x") ? 0 : 1] * 100;
        else return pureVal
      } else { return defaultV }
    }
  }

  Scratch.extensions.register(new SPlistMonitors());
})(Scratch);