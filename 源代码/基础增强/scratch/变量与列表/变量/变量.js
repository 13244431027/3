// 名称: 变量扩展
// ID: DICandSPmonitorsPlus
// 描述: 监视器类型和变量块的扩展功能。
// 作者: SharkPool and DogeIsCut

// 版本 1.4.2

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("变量扩展必须在非沙盒环境中运行！");

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMjEiIGhlaWdodD0iMzIxIiB2aWV3Qm94PSIwLDAsMzIxLDMyMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5LjUsLTE5LjUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNOTQsMTgwYzAsLTgwLjYzMzU3IDY1LjM2NjQyLC0xNDYgMTQ2LC0xNDZjODAuNjMzNTgsMCAxNDYsNjUuMzY2NDMgMTQ2LDE0NmMwLDgwLjYzMzU4IC02NS4zNjY0MiwxNDYgLTE0NiwxNDZjLTgwLjYzMzU4LDAgLTE0NiwtNjUuMzY2NDIgLTE0NiwtMTQ2eiIgZmlsbD0iI2ZmOGMxYSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0xNjkuMDg3MzIsODQuMDM5NzRjNi4yMTQ2MSwyLjczMDg3IDkuMDQ1MDIsOS45Nzc2MyA2LjMyNjQyLDE2LjE5NzYxYy05LjQ4MDc2LDIxLjc0MDEgLTE0LjM1NDY2LDQ1LjIwODYxIC0xNC4zMTQ0NSw2OC45MjYwMmMwLDI0LjUzMDI3IDUuMTIwMjEsNDcuODI5NzMgMTQuMzI2NzYsNjguOTI2MDJjMi40NzI4OSw2LjE3MzU1IC0wLjQwNTQxLDEzLjE5NDk2IC02LjUwMDA2LDE1Ljg1NjM4Yy02LjA5NDY0LDIuNjYxNDIgLTEzLjIwMTE4LDAuMDAwMTkgLTE2LjA0ODYxLC02LjAwOTgxYy0xMC44NDQ4LC0yNC44NDQwMiAtMTYuNDI2ODYsLTUxLjY2NDc3IC0xNi4zOTQ1NCwtNzguNzcyNTljMCwtMjcuOTg4ODggNS44NDY0LC01NC42NDg0OCAxNi4zOTQ1NCwtNzguNzcyNTljMS4zMDY4OCwtMi45OTIxOSAzLjc0OTEzLC01LjM0MjQ2IDYuNzg5MjgsLTYuNTMzNThjMy4wNDAxMiwtMS4xOTExMiA2LjQyODk2LC0xLjEyNTQ2IDkuNDIwNjYsMC4xODI1NHpNMjcxLjM4MDkyLDEzMi4yMzg3MmMtMTEuMjE0NjcsMC4wMDI1MiAtMjEuODIwNDIsNS4xMDE2MiAtMjguODI1ODUsMTMuODU5MDZsLTQuMDM3MSw1LjA0NjM2bC0xLjM2NjIxLC0zLjQzMzk5Yy0zLjczNzYsLTkuMzQwOCAtMTIuNzgzMjIsLTE1LjQ2NzA3IC0yMi44NDQwNiwtMTUuNDcxNDNoLTMuOTc1NTZjLTYuNzk3NjQsMCAtMTIuMzA4MjIsNS41MTA1OCAtMTIuMzA4MjIsMTIuMzA4MjJjMCw2Ljc5NzY0IDUuNTEwNTgsMTIuMzA4MjIgMTIuMzA4MjIsMTIuMzA4MjJoMy45NzU1Nmw2LjU0Nzk3LDE2LjM2OTkybC0xMi43MzksMTUuOTM5MTRjLTIuMzM2ODUsMi45MTg3MyAtNS44NzM3NSw0LjYxNjk5IC05LjYxMjcyLDQuNjE1NTloLTAuNDgwMDJjLTYuNzk3NjQsMCAtMTIuMzA4MjIsNS41MTA1NyAtMTIuMzA4MjIsMTIuMzA4MjJjMCw2Ljc5NzY0IDUuNTEwNTcsMTIuMzA4MjIgMTIuMzA4MjIsMTIuMzA4MjJoMC40ODAwMmMxMS4yMTQ2NywtMC4wMDI1MiAyMS44MjA0MSwtNS4xMDE2MiAyOC44MjU4NSwtMTMuODU5MDZsNC4wMzcxLC01LjA0NjM2bDEuMzY2MjIsMy40MzRjMy43MzkyNiw5LjM0NDk2IDEyLjc5MTA0LDE1LjQ3MjExIDIyLjg1NjM3LDE1LjQ3MTQzaDMuOTc1NTVjNi43OTc2NCwwIDEyLjMwODIyLC01LjUxMDU4IDEyLjMwODIyLC0xMi4zMDgyMmMwLC02Ljc5NzY0IC01LjUxMDU4LC0xMi4zMDgyMiAtMTIuMzA4MjIsLTEyLjMwODIyaC0zLjk3NTU1bC02LjU0Nzk4LC0xNi4zNjk5MmwxMi43MzkwMSwtMTUuOTM5MTNjMi4zMzY4NiwtMi45MTg3MyA1Ljg3Mzc2LC00LjYxNjk4IDkuNjEyNzMsLTQuNjE1NTloMC40ODAwMWM2Ljc5NzY1LDAgMTIuMzA4MjIsLTUuNTEwNTggMTIuMzA4MjIsLTEyLjMwODIyYzAsLTYuNzk3NjQgLTUuNTEwNTcsLTEyLjMwODIyIC0xMi4zMDgyMiwtMTIuMzA4MjJoLTAuNDgwMDF6TTI5NC40NDY1MSwxMDAuMjM3MzdjLTIuNjc2MjMsLTYuMjIxMTEgMC4xNzYxNCwtMTMuNDM1NTMgNi4zODMwNiwtMTYuMTQ0NTFjNi4yMDY5MywtMi43MDg5NyAxMy40MzYyNywwLjEwNTM0IDE2LjE3NzksNi4yOTc5M2MxMC44NDkwMiwyNC44NDMxMSAxNi40MzUzLDUxLjY2MzkxIDE2LjQwNjg2LDc4Ljc3MjZjMCwyNy45ODg4OCAtNS44NDYzOSw1NC42NDg0OCAtMTYuMzk0NTQsNzguNzcyNmMtMS42Njg2Niw0LjE2NTc0IC01LjQ3MjI0LDcuMDkzMTggLTkuOTI2MzMsNy42Mzk4M2MtNC40NTQwOSwwLjU0NjY1IC04Ljg1MjcsLTEuMzc0MTQgLTExLjQ3OTE3LC01LjAxMjczYy0yLjYyNjQ3LC0zLjYzODYxIC0zLjA2NDUsLTguNDE4MjggLTEuMTQzMTUsLTEyLjQ3MzY3YzkuNDg1MzIsLTIxLjczOTA4IDE0LjM2MzQ1LC00NS4yMDc3MSAxNC4zMjY3OCwtNjguOTI2MDFjMCwtMjQuNTMwMjcgLTUuMTIwMjIsLTQ3LjgyOTc0IC0xNC4zMzkwOCwtNjguOTI2MDJ6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGcgZmlsbC1ydWxlPSJub256ZXJvIj48cGF0aCBkPSJNMjk1LjEwNTIxLDMwOC45OTEwMmMtMTAuMjYxNjgsMCAtMTguNTgwNDIsLTguMzE4NzMgLTE4LjU4MDQyLC0xOC41ODA0MXYtOTAuNDI0NjdjMCwtMTAuMjYxNjggOC4zMTg3MywtMTguNTgwNDEgMTguNTgwNDIsLTE4LjU4MDQxaDEuMjM4N2MxMC4yNjE2OCwwIDE4LjU4MDQxLDguMzE4NzMgMTguNTgwNDEsMTguNTgwNDF2OTAuNDI0NjdjMCwxMC4yNjE2OCAtOC4zMTg3MywxOC41ODA0MSAtMTguNTgwNDEsMTguNTgwNDF6IiBmaWxsPSIjZmY4YzFhIiBzdHJva2U9IiNmZjhjMWEiIHN0cm9rZS13aWR0aD0iMTIuNSIvPjxwYXRoIGQ9Ik0yMzEuOTMxODIsMjQ0LjU3ODkzYzAsLTEwLjI2MTY4IDguMzE4NzQsLTE4LjU4MDQyIDE4LjU4MDQxLC0xOC41ODA0Mmg5MC40MjQ2NmMxMC4yNjE2OCwwIDE4LjU4MDQsOC4zMTg3MyAxOC41ODA0LDE4LjU4MDQydjEuMjM4N2MwLDEwLjI2MTY5IC04LjMxODcyLDE4LjU4MDQgLTE4LjU4MDQsMTguNTgwNGgtOTAuNDI0NjZjLTEwLjI2MTY3LDAgLTE4LjU4MDQxLC04LjMxODczIC0xOC41ODA0MSwtMTguNTgwNHoiIGZpbGw9IiNmZjhjMWEiIHN0cm9rZT0iI2ZmOGMxYSIgc3Ryb2tlLXdpZHRoPSIxMi41Ii8+PHBhdGggZD0iTTIzOS44ODAxMiwyNDQuNzkwMDZjMCwtNi43NjM1MSA1LjQ4MjkxLC0xMi4yNDY0MSAxMi4yNDY0MiwtMTIuMjQ2NDFoODcuMjk5M2M2Ljc2MzUxLDAgMTIuMjQ2NDIsNS40ODI5IDEyLjI0NjQyLDEyLjI0NjQxdjAuODE2NDVjMCw2Ljc2MzUxIC01LjQ4MjkxLDEyLjI0NjQyIC0xMi4yNDY0MiwxMi4yNDY0MmgtODcuMjk5M2MtNi43NjM1MSwwIC0xMi4yNDY0MiwtNS40ODI5MiAtMTIuMjQ2NDIsLTEyLjI0NjQyeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjk2LjE4NDM5LDE4OS4zMDIxOWM2Ljc2MzUxLDAgMTIuMjQ2NDEsNS40ODI5MSAxMi4yNDY0MSwxMi4yNDY0MXY4Ny4yOTkzYzAsNi43NjM1MSAtNS40ODI5LDEyLjI0NjQyIC0xMi4yNDY0MSwxMi4yNDY0MmgtMC44MTY0NWMtNi43NjM1MSwwIC0xIIyMjQ2NDIsLTUuNDgyOTEgLTEyLjI0NjQxLC0xMi4yNDY0MmMwLDAgMCwtNDkuMjMxOTUgMCwtNjQuODY2MjdjMCwtOC44NDgxMyAwLC0yMi40MzcwNCAwLC0yMi40MzcwNGMwLC02Ljc2MzUxIDUuNDgyOTEsLTEyLjI0NjQxIDEyLjI0NjQyLC0xMi4yNDY0MXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjxwYXRoIGQ9Ik04NywxODBjMCwtODQuNDk5NTcgNjguNTAwNDMsLTE1MyAxNTMsLTE1M2M4NC40OTk1NywwIDE1Myw2OC41MDA0MyAxNTMsMTUzYzAsODQuNDk5NTcgLTY4LjUwMDQzLDE1MyAtMTUzLDE1M2MtODQuNDk5NTcsMCAtMTUzLC02OC41MDA0MyAtMTUzLC0xNTN6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2RiNmUwMCIgc3Ryb2tlLXdpZHRoPSIxNSIvPjwvZz48L2c+PC9zdmc+";

  const builtInFonts = ["无衬线", "衬线", "手写体", "马克笔", "花体", "像素", "Scratch"];
  let monitorButtons = {};
  let varUpdateListener = {};
  runtime.on("BEFORE_EXECUTE", () => { runtime.startHats("DICandSPmonitorsPlus_当按钮被按下") });
  runtime.on("MONITORS_UPDATE", () =>{
    for (const [id, { func, inp }] of Object.entries(varUpdateListener)) {
      func(inp);
      if (typeof scaffolding === "undefined") {
        // 修复可能被双击的自定义监视器
        const varMonitor = document.querySelector(`div[data-id="${id}"][class*="monitor"]`);
        if (varMonitor) {
          Array.from(varMonitor.children).forEach(child => {
            if (
              !child.className.includes("monitor_SPmonitorPlus") && !child.style.display
            ) {
              delete varUpdateListener[id];
              const custMon = varMonitor.querySelector(`div[class^="monitor_default-monitor_SPmonitorPlus"`);
              if (custMon) varMonitor.removeChild(custMon);
            }
          });
        }
      }
    }
  });

  class MonitorsPlus {
    getInfo() {
      return {
        id: "DICandSPmonitorsPlus",
        name: "变量扩展",
        color1: "#FF8C1A",
        color2: "#e67e17",
        color3: "#cc7015",
        menuIconURI,
        blocks: [
          {
            opcode: "exists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[VARIABLE] 存在吗？",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, defaultValue: "我的变量" }
            },
          },
          {
            opcode: "isShowing",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[VARIABLE] 正在显示吗？",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setVis",
            blockType: Scratch.BlockType.COMMAND,
            text: "[VIS] 变量 [VAR]",
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              VIS: { type: Scratch.ArgumentType.STRING, menu: "VISIBLE" }
            },
          },
          "---",
          {
            opcode: "setString",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 设为 [STRING]",
            arguments: {
              STRING: { type: Scratch.ArgumentType.STRING, defaultValue: 0 },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 设为 [COLOR]",
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "swapVars",
            blockType: Scratch.BlockType.COMMAND,
            text: "交换 [VAR1] 和 [VAR2]",
            arguments: {
              VAR1: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              VAR2: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "reportVal",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VARIABLE] 的值",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          "---",
          {
            opcode: "makeVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建名为 [VARIABLE] 的变量 [TYPE]",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, defaultValue: "我的变量 2" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "variableTypeCreate" }
            },
          },
          {
            opcode: "deleteVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除名为 [VARIABLE] 的变量",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, defaultValue: "我的变量 2" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "定位" },
          {
            opcode: "setPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的位置设为 x: [X] y: [Y]",
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "currentPos",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VARIABLE] 的当前 [POSITION]",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              POSITION: { type: Scratch.ArgumentType.STRING, menu: "POSITIONS" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "变量监视器" },
          {
            opcode: "setVariableToType",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 监视器类型设为 [TYPE]",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "variablesTypeMenu" }
            },
          },
          {
            opcode: "getVariableType",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VARIABLE] 的监视器类型",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "滑块" },
          {
            opcode: "setSliderMinMaxOfVaribleTo",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的滑块最小值设为 [MIN] 最大值设为 [MAX]",
            arguments: {
              MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
              MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "sliderMinMaxOfVarible",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VARIABLE] 的滑块 [MINMAX]",
            arguments: {
              MINMAX: { type: Scratch.ArgumentType.STRING, menu: "sliderMenu" },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "按钮" },
          {
            opcode: "whenButtonPressed",
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            text: "当 [VARIABLE] 按钮 [TYPE]",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "BUTTON_CLICK" }
            },
          },
          {
            opcode: "isButtonPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[VARIABLE] 按钮 [TYPE] 吗？",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "BUTTON_CLICK" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "效果" },
          {
            opcode: "setDisplay",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的显示名称设为 [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "我的更酷变量" },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setFont",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的字体设为 [FONT]",
            arguments: {
              FONT: { type: Scratch.ArgumentType.STRING, menu: "allFonts" },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setFontSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的字体大小设为 [SIZE]",
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setInpColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的 [THING] 颜色设为 [VALUE]",
            arguments: {
              VALUE: { type: Scratch.ArgumentType.COLOR },
              THING: { type: Scratch.ArgumentType.STRING, menu: "elementMenu" },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          "---",
          {
            opcode: "resetEffect",
            blockType: Scratch.BlockType.COMMAND,
            text: "重置 [VARIABLE] 的效果",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "setEffect",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [VARIABLE] 的 [EFFECT] 设为 [AMOUNT]",
            arguments: {
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              EFFECT: { type: Scratch.ArgumentType.STRING, menu: "EFFECTS" },
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" }
            },
          },
          {
            opcode: "currentEffect",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VARIABLE] 的当前 [EFFECT]",
            arguments: {
              VARIABLE: { type: Scratch.ArgumentType.STRING, menu: "variableMenu" },
              EFFECT: { type: Scratch.ArgumentType.STRING, menu: "EFFECTS" }
            },
          },
        ],
        menus: {
          variableMenu: { acceptReporters: true, items: "getVariables" },
          allFonts: { acceptReporters: true, items: "getFonts" },
          sliderMenu: ["最小值", "最大值"],
          variableTypeCreate: ["全局", "仅适用于此角色"],
          POSITIONS: ["x", "y"],
          BUTTON_CLICK: ["被点击", "被按住"],
          VISIBLE: { acceptReporters: true, items: ["显示", "隐藏"] },
          variablesTypeMenu: {
            acceptReporters: true,
            items: [
              "普通读数", "大读数", "滑块",
              "文本", "数字", "日期", "月份", "时间", 
              "复选框", "颜色", "按钮", "文件", "图像", "音频"
            ]
          },
          elementMenu: {
            acceptReporters: true,
            items: ["输入框", "边框"]
          },
          EFFECTS: {
            acceptReporters: true,
            items: [
              "模糊", "饱和度", "对比度", "亮度",
              "色相", "不透明度", "怀旧", "反色", "方向",
              "缩放 x", "缩放 y", "倾斜 x", "倾斜 y"
            ]
          },
        }
      }
    }

    // 辅助函数
    getVariables() {
      const globalVars = Object.values(runtime.getTargetForStage().variables).filter((x) => x.type == "");
      const localVars = Object.values(vm.editingTarget.variables).filter((x) => x.type == "");
      const uniqueVars = [...new Set([...globalVars, ...localVars])];
      if (uniqueVars.length === 0) return ["创建变量"];
      return uniqueVars.map((i) => (Scratch.Cast.toString(i.name)));
    }

    getFonts() {
      const customFonts = runtime.fontManager ? runtime.fontManager.getFonts().map((i) => ({text: i.name, value: i.family})) : [];
      return [ ...builtInFonts, ...customFonts ];
    }

    findVariable(varName, sprite) {
      // 支持所有变量类型（云变量、角色专用、全局）
      varName = Scratch.Cast.toString(varName);
      const cloudID = runtime.getTargetForStage().lookupVariableByNameAndType(Scratch.Cast.toString("☁ " + varName), "");
      if (cloudID) return cloudID.id;
      let varFind = "";
      for (const name of Object.getOwnPropertyNames(sprite.target.variables)) {
        varFind = sprite.target.variables[name].name;
        if (varFind === varName) return sprite.target.variables[name].id;
      }
      const ID = runtime.getTargetForStage().lookupVariableByNameAndType(varName, "");
      if (!ID) return "";
      return ID.id;
    }

    setValue(variableN, value, util) {
      const variable = util.target.lookupOrCreateVariable(variableN, variableN);
      variable.value = value;
    }

    refresh() {
      // 用于刷新工具箱以显示新建/删除的变量
      if (typeof scaffolding === "undefined") {
        vm.emitWorkspaceUpdate();
        const workspace = ScratchBlocks.getMainWorkspace();
        workspace.toolboxRefreshEnabled_ = true;
        workspace.refreshToolboxSelection_();
        workspace.toolboxRefreshEnabled_ = false;
        setTimeout(() => { runtime.requestBlocksUpdate() }, 10);
      }
    }

    generateId() {
      // 用于为变量创建ID
      const soup = "!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const id = [];
      for (let i = 0; i < 20; i++) { id[i] = soup.charAt(Math.random() * soup.length) }
      return id.join("");
    }

    resetEffects(variableId, curTransform) {
      const varMonitor = document.querySelector(`div[data-id="${variableId}"][class*="monitor"]`);
      if (!varMonitor) return;
      const matches = curTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      varMonitor.style.filter = "";
      varMonitor.style.transform = matches ? `translate(${matches[1]}, ${matches[2]})` : "";
    }

    getMonitor(variable, util) {
      const varId = this.findVariable(variable, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return "普通读数";
      const inputcheck = varMonitor.querySelector("input");
      if (inputcheck !== null) {
        if (inputcheck.type === "range") return "滑块";
        else return inputcheck.type;
      } else {
        if (varMonitor.querySelector("img")) return "图像";
        else if (varMonitor.querySelector("audio")) return "音频";
        else if (varMonitor.querySelector(`div[class^="monitor_large-value_"]`)) return "大读数";
        else return "普通读数";
      }
    }

    setMonitor(nameID, util, nameTxt, type) {
      const baseMonitors = {
        "普通读数": "default", "大读数": "large", "滑块": "slider"
      };
      const custMonitors = [
        "文本", "数字", "复选框", "颜色", "日期",
        "月份", "时间", "按钮", "文件", "图像", "音频"
      ];
      const isHexRegex = /^#([0-9A-F]{3}){1,2}$/i;
      const addVarListener = (id, inp, func) => { varUpdateListener[id] = { inp, func } }
      const buttonClick = (ID, down) => {
        if (down) monitorButtons[ID] = { varName : ID, isDown : down, timeClick : Date.now() };
        else delete monitorButtons[ID];
      }

      let varId = this.findVariable(nameID, util);
      if (!varId) return;
      const variable = util.target.lookupVariableById(varId);
      let state = runtime.getMonitorState().get(varId);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return;
      let container, input;
      // 不要更改此类名。我们想要保留CSS属性
      container = varMonitor.querySelector(`div[class^="monitor_default-monitor_SPmonitorPlus"`);
      if (container) varMonitor.removeChild(container);
      delete varUpdateListener[varId];

      if (custMonitors.indexOf(type) > -1) {
        // 检查自定义CSS是否存在
        const newStyles = document.querySelector(`style[class="shovelcss-style"]`);
        container = document.createElement("div");
        container.className = "monitor_default-monitor_SPmonitorPlus";
        container.setAttribute("style", "padding: 5px 5px 5px 5px");
        // 隐藏旧的监视器内部元素而不是删除。这可以防止编辑器崩溃
        Array.from(varMonitor.children).forEach(child => {
          child.style.display = "none";
        });

        // 监听器
        const normUpdate = (inp) => { inp.value = variable.value };
        const srcUpdate = (inp) => { inp.src = variable.value };
        const checkUpdate = (inp) => { inp.checked = Scratch.Cast.toBoolean(variable.value) };

        // 标签创建
        const label = document.createElement("div");
        label.className = "monitor_row";
        const innerLabel = document.createElement("div");
        innerLabel.className = "monitor_label";
        innerLabel.textContent = nameID;
        innerLabel.style.fontWeight = 700;
        innerLabel.style.margin = "0px 5px 0px 5px";
        innerLabel.style.color = newStyles ? "auto" : "#575E75";
        label.appendChild(innerLabel);

        if (type === "音频") {
          input = document.createElement("audio");
          input.src = variable.value;
          input.controls = true;
          addVarListener(varId, input, srcUpdate);
        } else if (type === "图像") {
          input = document.createElement("img");
          input.src = variable.value;
          addVarListener(varId, input, srcUpdate);
        } else {
          input = document.createElement("input");
          input.type = type;
          if (type === "复选框") input.checked = Scratch.Cast.toBoolean(variable.value);
          else if (type === "按钮") input.value = input.value = nameID;
          else if (type === "文件") input.value = "";
          else if (type === "颜色") {
            input.value = isHexRegex.test(variable.value) ? variable.value : "#000";
            input.style.height = "30px";
            const colorStyle = document.createElement("style");
            colorStyle.textContent = `
              input[type="color"]::-webkit-color-swatch {
                border: black solid 1px;
                margin: 2px;
                border-radius: 5px;
              }
              input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0px;
              }
              input[type="color"]::-moz-color-swatch {
                border: black solid 1px;
                margin: 2px;
                border-radius: 5px;
              }
            `;
            input.append(colorStyle);
          } else if (type === "数字") {
            input.value = Scratch.Cast.toNumber(variable.value);
            input.max = state.get("sliderMax");
            input.min = state.get("sliderMin");
          } else { input.value = variable.value }
        }
        input.id = `${type}_${varId}`;
        input.className = "no-drag"; // 模拟编辑器中的滑块行为
        if (!navigator.userAgent.includes("Chrome") && navigator.userAgent.includes("Safari") && type === "复选框") {
          // Safari HTML 错误
          input.style.margin = "10px";
          input.style.width = "auto";
          input.style.transform = "scale(2.5)";
        } else {
          input.style.marginTop = "2px";
          input.style.width = type === "复选框" ? "50%" : "100%";
          input.style.borderRadius = "5px";
          if (type !== "音频") input.style.border = "solid 1px";
        }
        if (type === "按钮") container.appendChild(input);
        else if (type === "复选框") {
          label.insertBefore(input, label.firstChild);
          container.appendChild(label);
          addVarListener(varId, input, checkUpdate);
        } else {
          input.style.minWidth = type === "音频" ? "275px" : "20px";
          container.append(label, input);
          if (type !== "文件" && type !== "音频" && type !== "图像") addVarListener(varId, input, normUpdate);
        }

        if (type !== "音频" && type !== "图像") {
          if (type === "按钮") {
            const btnClickFunc = (down) => () => buttonClick(varId, down);
            input.addEventListener("mousedown", btnClickFunc(true));
            input.addEventListener("mouseup", btnClickFunc(false));
            input.addEventListener("mouseleave", btnClickFunc(false));
          } else {
            input.addEventListener("change", (event) => {
              const inputType = event.target.id;
              if (inputType.startsWith("复选框")) variable.value = input.checked;
              else if (inputType.startsWith("文件")) {
                const file = event.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => { variable.value = reader.result };
                  reader.onerror = (e) => { console.error(e) };
                }
              } else variable.value = input.value;
            });
          }
        }
        varMonitor.appendChild(container);
      } else {
        varMonitor.firstChild.style.display = "";
        if (baseMonitors[type] === undefined) type = "普通读数";
        runtime.requestUpdateMonitor(state.set("mode", baseMonitors[type]));
      }
    }

    // 块函数
    isShowing(args, util) {
      const info = runtime.getMonitorState().get(this.findVariable(args.VARIABLE, util));
      return info ? (info.get("visible") !== undefined && info.get("visible") !== false) : false;
    }

    exists(args, util) { return Scratch.Cast.toBoolean(this.findVariable(args.VARIABLE, util)) }

    setVis(args, util) {
      const variable = util.target.lookupVariableByNameAndType(args.VAR, "");
      if (!variable) return;
      runtime.monitorBlocks.changeBlock({
        id: variable.id, element: "checkbox", value: args.VIS === "显示"
      }, runtime);
    }

    setString(args, util) { this.setValue(args.VARIABLE, args.STRING, util) }
    setColor(args, util) { this.setValue(args.VARIABLE, args.COLOR, util) }

    swapVars(args, util) {
      let var1 = Scratch.Cast.toString(args.VAR1);
      let var2 = Scratch.Cast.toString(args.VAR2);
      var1 = util.target.lookupOrCreateVariable(var1, var1);
      var2 = util.target.lookupOrCreateVariable(var2, var2);
      const temp = var1.value;
      var1.value = var2.value;
      var2.value = temp;
    }

    reportVal(args, util) {
      const variable = this.findVariable(args.VARIABLE, util);
      if (!variable) return 0;
      return util.target.lookupVariableById(variable).value;
    }

    makeVariable(args, util) {
      const name = Scratch.Cast.toString(args.VARIABLE);
      if (args.TYPE === "仅适用于此角色") util.target.lookupOrCreateVariable(this.generateId(), name, "");
      else runtime.createNewGlobalVariable(name, "");
      return this.refresh();
    }

    deleteVariable(args, util) {
      const variable = this.findVariable(args.VARIABLE, util);
      if (variable) {
        runtime.getTargetForStage().deleteVariable(variable)
        util.target.deleteVariable(variable);
        return this.refresh();
      }
    }

    setPosition(args, util) {
      const canvas = [runtime.stageWidth / 2, runtime.stageHeight / 2];
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return;
      varMonitor.setAttribute("SPposition", `[${Scratch.Cast.toNumber(args.X)}, ${Scratch.Cast.toNumber(args.Y)}]`);
      let x = Scratch.Cast.toNumber(args.X) + canvas[0] - (varMonitor.offsetWidth / 2);
      let y = (Scratch.Cast.toNumber(args.Y) - canvas[1] + (varMonitor.offsetHeight / 2)) * -1;
      x = x - (parseInt(varMonitor.style.left) || 5);
      y = y - (parseInt(varMonitor.style.top) || 5);

      let styleAtts = varMonitor.getAttribute("style");
      const transformRegex = /transform:([^;]+);/;
      const transformMatch = styleAtts.match(transformRegex);
      if (transformMatch) {
        const oldTransform = transformMatch[1];
        const newTransform = oldTransform.replace(/translate\([^)]+\)/, `translate(${x}px, ${y}px)`);
        styleAtts = styleAtts.replace(transformRegex, `transform:${newTransform};`);
        varMonitor.setAttribute("style", styleAtts);
      }
      runtime.requestUpdateMonitor(new Map([["id", varId], ["x", x], ["y", y]]));
    }

    currentPos(args, util) {
      const canvas = [runtime.stageWidth / 2, runtime.stageHeight / 2];
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return ""; // 如果不可见应该不报告任何内容
      const presetPos = varMonitor.getAttribute("SPposition");
      // 减少工作量，同时保持准确性
      if (presetPos) return JSON.parse(presetPos)[args.POSITION === "x" ? 0 : 1];
      const styleAttribute = varMonitor.getAttribute("style");
      if (!styleAttribute) return "";
      const match = styleAttribute.match(/transform\s*:\s*translate\((-?\d+(?:\.\d+)?px),\s*(-?\d+(?:\.\d+)?px)\)/);
      if (match) {
        if (args.POSITION === "x") return Math.round(parseInt(match[1]) - canvas[0] + (varMonitor.offsetWidth / 2)) + parseInt(varMonitor.style.left);
        else return Math.round(((parseInt(match[2]) * -1) + canvas[1]) - (varMonitor.offsetHeight / 2) - parseInt(varMonitor.style.top)) - 1;
      }
    }

    setSliderMinMaxOfVaribleTo(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      if (!varId) return;
      const margins = [Scratch.Cast.toNumber(args.MIN), Scratch.Cast.toNumber(args.MAX)];
      const moniType = this.getMonitor(args.VARIABLE, util);
      if (moniType === "数字") {
        const input = document.getElementById(`数字_${varId}`);
        if (input) {
          input.min = margins[0];
          input.max = margins[1];
        }
      } else {
        const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
        if (varMonitor) {
          const container = varMonitor.querySelector(`div[class^="monitor_default-monitor_SPmonitorPlus"`);
          if (container) varMonitor.removeChild(container);
          varMonitor.firstChild.style.display = "";
        }
        var state = runtime.getMonitorState().get(varId);
        if (!state) return;
        state = state.set("mode", "slider");
        runtime.requestUpdateMonitor(state);
        runtime.requestUpdateMonitor(new Map([
          ["id", varId], ["sliderMin", margins[0]], ["sliderMax", margins[1]]
        ]));
      }
    }

    sliderMinMaxOfVarible(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const info = runtime.getMonitorState().get(varId);
      if (info === undefined) return 0;
      return info.get(args.MINMAX === "最小值" ? "sliderMin" : "sliderMax");
    }

    setVariableToType(args, util) { this.setMonitor(args.VARIABLE, util, args.VARIABLE, args.TYPE) }

    getVariableType(args, util) { return this.getMonitor(args.VARIABLE, util) }

    whenButtonPressed(args, util) { return this.isButtonPressed(args, util) }

    isButtonPressed(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      if (monitorButtons[varId] !== undefined) {
        if (args.TYPE === "被按住") return true;
        else {
          const date = monitorButtons[varId].timeClick;
          const now = Date.now();
          // 忽略最后3位数字，因为事件到帽子不是瞬时的
          const con = Math.floor(date / 1000) === Math.floor(now / 1000);
          if (con) delete monitorButtons[varId];
          return con;
        }
      }
      return false;
    }

    setDisplay(args, util) {
      let varId = this.findVariable(args.VARIABLE, util);
      const varLabels = document.querySelectorAll(`div[data-id="${varId}"][class*="monitor"] [class*="label"]`);
      // 不需要xml转义，我们用textContent编辑
      if (varLabels.length > 0) {
        for (var i = 0; i < varLabels.length; i++) varLabels[i].textContent = args.NAME;
      }
      const btn = document.querySelector(`div[data-id="${varId}"][class*="monitor"] [id="按钮_${varId}"]`);
      if (btn) btn.value = args.NAME;
    }

    setFont(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (varMonitor) varMonitor.style.fontFamily = args.FONT;
    }

    setFontSize(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (varMonitor) varMonitor.style.fontSize = `${Scratch.Cast.toNumber(args.SIZE)}px`;
    }

    setInpColor(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return;
      let inputs = [
        ...varMonitor.querySelectorAll("input"), ...varMonitor.querySelectorAll("img")
      ];
      const value = Scratch.Cast.toString(args.VALUE);
      if (args.THING === "输入框") {
        varMonitor.style.accentColor = value;
        Array.from(inputs).forEach(input => { input.style.background = value });
      } else if (args.THING === "边框") {
        Array.from(inputs).forEach(input => { input.style.borderColor = value });
      }
    }

    resetEffect(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (varMonitor) this.resetEffects(varId, varMonitor.style.transform || "");
    }

    setEffect(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return;
      let EFFECT = args.EFFECT;
      let value = args.AMOUNT;
      let curTransform = varMonitor.style.transform;
      let curFilters = varMonitor.style.filter || "";
      if (EFFECT === "饱和度") EFFECT = "saturate";
      else if (EFFECT === "色相") EFFECT = "hue-rotate";
      else if (EFFECT === "方向") {
        EFFECT = "rotate";
        value = value - 90;
      } else if (EFFECT === "缩放" || EFFECT === "缩放 x" || EFFECT === "缩放 y") {
        value = value / 100;
        EFFECT = EFFECT.replace("x", "X").replace("y", "Y").replaceAll(" ", "");
      }
      else if (EFFECT === "亮度") value = value + 100;
      else if (EFFECT === "倾斜 x") EFFECT = "skewX";
      else if (EFFECT === "倾斜 y") EFFECT = "skewY";

      const regex = new RegExp(`${EFFECT}\\([^)]+\\)`, "g");
      curTransform = curTransform.replace(regex, "").trim();
      curFilters = curFilters.replace(regex, "").trim();
      if (EFFECT.includes("缩放") || EFFECT === "rotate" || EFFECT.includes("倾斜")) {
        curTransform += ` ${EFFECT}(${value}${EFFECT === "rotate" || EFFECT.includes("倾斜") ? "deg" : ""})`;
        varMonitor.style.transform = curTransform.trim();
      } else {
        curFilters += ` ${EFFECT}(${value}${EFFECT === "模糊" ? "px" : EFFECT === "hue-rotate" ? "deg" : "%"})`;
        varMonitor.style.filter = curFilters.trim();
      }
    }

    currentEffect(args, util) {
      const varId = this.findVariable(args.VARIABLE, util);
      const varMonitor = document.querySelector(`div[data-id="${varId}"][class*="monitor"]`);
      if (!varMonitor) return "";
      const curTransform = varMonitor.style.transform;
      const curFilters = varMonitor.style.filter || "";
    
      const setEffect = {
        饱和度: "saturate", 色相: "hue-rotate",
        方向: "rotate", 缩放: "scale", "缩放 x": "scaleX", "缩放 y": "scaleY",
        亮度: "brightness", 不透明度: "opacity",
        "倾斜 x": "skewX", "倾斜 y": "skewY"
      }[args.EFFECT] || args.EFFECT;
      const defaultV = {
        饱和度: 100, 色相: 0,
        方向: 90, 缩放: 100, "缩放 x": 100, "缩放 y": 100,
        亮度: 0, 不透明度: 100
      }[args.EFFECT] || 0;

      const regex = new RegExp(`${setEffect}\\(([^)]+)\\)`);
      const transformMatch = curTransform.match(regex);
      const filterMatch = curFilters.match(regex);
      if (filterMatch || transformMatch) {
        const unitValue = (filterMatch || transformMatch)[1];
        const numericValue = parseFloat(unitValue.replace(/[^0-9.-]/g, ""));
        if (setEffect === "brightness") return numericValue - 100;
        else if (setEffect === "rotate") return numericValue + 90;
        else if (setEffect.includes("scale")) return numericValue * 100;
        else return numericValue;
      } else { return defaultV }
    }
  }

  Scratch.extensions.register(new MonitorsPlus());
})(Scratch);