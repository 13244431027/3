// ==UserScript==
// @name         02engine 清除独立积木
// @namespace    https://github.com/13244431027
// @version      1.2.0
// @description  右键工作区：一键清除孤立积木（没有帽块的孤立脚本 + 孤立的帽块）
// @author
// @match        https://02engine.0pen.top/index.html*
// @match        https://*02engine.0pen.top/index.html*
// @run-at       document-idle
// @grant        none
// ==/UserScript==


(function () {
  "use strict";

  // ---------- 工具：从 React fiber 树里找 VM ----------
  function findVM() {
    const candidates = [
      window.vm,
      window.scaffolding && window.scaffolding.vm,
    ].filter(Boolean);
    for (const c of candidates) {
      if (c && c.runtime && typeof c.runtime.getIsHat === "function") return c;
    }

    const looksLikeVM = (o) =>
      o &&
      o.runtime &&
      Array.isArray(o.runtime.targets) &&
      typeof o.runtime.getIsHat === "function";

    const nodes = document.querySelectorAll(
      "[class*='stage'], [class*='blocks'], .injectionDiv, #app, body"
    );

    for (const node of nodes) {
      const key = Object.keys(node).find(
        (k) =>
          k.startsWith("__reactFiber$") ||
          k.startsWith("__reactInternalInstance$")
      );
      if (!key) continue;

      let fiber = node[key];
      let depth = 0;
      while (fiber && depth < 100) {
        const bags = [fiber.memoizedProps, fiber.memoizedState, fiber.stateNode];
        for (const bag of bags) {
          if (!bag) continue;
          if (looksLikeVM(bag.vm)) return bag.vm;
          if (looksLikeVM(bag)) return bag;
          for (const v of Object.values(bag)) {
            if (looksLikeVM(v)) return v;
            if (v && looksLikeVM(v.vm)) return v.vm;
          }
        }
        fiber = fiber.return;
        depth++;
      }
    }
    return null;
  }

  function getBlockly() {
    if (window.Blockly && typeof window.Blockly.getMainWorkspace === "function") {
      return window.Blockly;
    }
    return null;
  }

  // ---------- 核心删除逻辑 ----------
  function isBlockStillValid(target, blockId) {
    if (!target || !target.blocks) return false;
    return !!target.blocks.getBlock(blockId);
  }

  function disposeBlockInWorkspace(vm, targetId, blockId) {
    const target = vm.runtime.getTargetById(targetId);
    if (!isBlockStillValid(target, blockId)) return false;

    try {
      if (typeof vm.setEditingTarget === "function") vm.setEditingTarget(targetId);
      else if (vm.runtime && typeof vm.runtime.setEditingTarget === "function")
        vm.runtime.setEditingTarget(targetId);
    } catch (e) {}

    const Blockly = getBlockly();
    const workspace = Blockly && Blockly.getMainWorkspace();
    if (!workspace) return false;

    const wsBlock = workspace.getBlockById(blockId);
    if (!wsBlock) return false;

    try {
      if (Blockly.Events && typeof Blockly.Events.setGroup === "function") {
        Blockly.Events.setGroup("twBlockCleaner");
      }
      wsBlock.dispose(true);
      return true;
    } finally {
      if (Blockly.Events && typeof Blockly.Events.setGroup === "function") {
        Blockly.Events.setGroup(false);
      }
    }
  }

  function removeBlock(vm, target, blockId) {
    if (!isBlockStillValid(target, blockId)) return false;
    let deleted = false;
    try {
      deleted = disposeBlockInWorkspace(vm, target.id, blockId);
    } catch (e) {
      console.error("Workspace 删除失败:", blockId, e);
    }
    if (!deleted && isBlockStillValid(target, blockId)) {
      try {
        target.blocks.deleteBlock(blockId);
        deleted = true;
      } catch (e) {
        console.error("VM 删除失败:", blockId, e);
      }
    }
    return deleted;
  }

  function refreshWorkspace() {
    try {
      const Blockly = getBlockly();
      const workspace = Blockly && Blockly.getMainWorkspace();
      if (workspace) {
        if (typeof workspace.resizeContents === "function") workspace.resizeContents();
        if (typeof Blockly.svgResize === "function") Blockly.svgResize(workspace);
      }
    } catch (e) {}
  }

  function findNextHatlessBlock(target, runtime) {
    for (const blockId of target.blocks.getScripts()) {
      const block = target.blocks.getBlock(blockId);
      if (!block || block.parent) continue;
      const isHat = runtime.getIsHat(block.opcode);
      const isProcDef = block.opcode === "procedures_definition";
      if (!isHat && !isProcDef) return blockId;
    }
    return null;
  }

  // ---------- 一键清除：孤立脚本 + 孤立帽块 ----------
  function removeAllOrphans(vm) {
    const runtime = vm.runtime;
    let hatlessCount = 0;
    let emptyHatCount = 0;

    // 1. 删除没有帽块的孤立脚本
    for (const target of runtime.targets) {
      if (!target || !target.blocks) continue;
      let blockId;
      while ((blockId = findNextHatlessBlock(target, runtime)) !== null) {
        if (removeBlock(vm, target, blockId)) hatlessCount++;
        else break; // 防死循环
      }
    }

    // 2. 删除孤立的帽块（无后续积木）
    for (const target of runtime.targets) {
      if (!target || !target.blocks) continue;
      const toDelete = [];
      for (const blockId of target.blocks.getScripts()) {
        const block = target.blocks.getBlock(blockId);
        if (!block || block.parent) continue;
        if (runtime.getIsHat(block.opcode) && !block.next) toDelete.push(blockId);
      }
      for (const blockId of toDelete) {
        if (removeBlock(vm, target, blockId)) emptyHatCount++;
      }
    }

    refreshWorkspace();
    alert(
      `完成！\n已删除没有帽块的孤立脚本：${hatlessCount}\n已删除孤立的帽块：${emptyHatCount}`
    );
  }

  // ---------- 注入右键菜单 ----------
  function addMenuItem(menu, text, onClick) {
    const sample = menu.querySelector(
      ".blocklyContextMenuOption, .goog-menuitem"
    );
    const item = sample
      ? sample.cloneNode(false)
      : document.createElement("div");

    if (!sample) {
      item.style.cssText =
        "padding:6px 14px;cursor:pointer;font-size:14px;color:#000;";
    }
    item.className = sample ? sample.className : "";
    item.textContent = text;

    item.classList.remove(
      "blocklyContextMenuOptionDisabled",
      "goog-menuitem-disabled"
    );
    item.style.opacity = "1";
    item.style.cursor = "pointer";

    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const B = getBlockly();
      try {
        if (B && B.ContextMenu && typeof B.ContextMenu.hide === "function") {
          B.ContextMenu.hide();
        }
      } catch (err) {}
      menu.remove();
      onClick();
    });

    menu.appendChild(item);
  }

  function setupContextMenu(vm) {
    document.addEventListener(
      "contextmenu",
      (e) => {
        const inWorkspace = e.target.closest(
          ".injectionDiv, .blocklyWorkspace, [class*='blocks']"
        );
        const onBlock = e.target.closest(".blocklyDraggable, .blocklyPath");
        if (!inWorkspace || onBlock) return;

        let tries = 0;
        const wait = setInterval(() => {
          tries++;
          const menu = document.querySelector(".blocklyContextMenu");
          if (menu) {
            clearInterval(wait);
            if (menu.dataset.twCleanerInjected) return;
            menu.dataset.twCleanerInjected = "1";

            addMenuItem(menu, "清除孤立积木", () => {
              if (confirm("确定要清除所有孤立积木吗？此操作无法撤销"))
                removeAllOrphans(vm);
            });
          } else if (tries > 20) {
            clearInterval(wait);
          }
        }, 20);
      },
      true
    );
    console.log("[02清除独立积木] 右键菜单已挂载");
  }

  // ---------- 等待环境就绪 ----------
  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    const vm = findVM();
    const Blockly = getBlockly();
    if (vm && Blockly) {
      clearInterval(timer);
      setupContextMenu(vm);
      console.log("[02清除独立积木] 已加载");
    } else if (tries > 60) {
      clearInterval(timer);
      console.warn("[02清除独立积木] 未能找到 VM 或 Blockly，已停止重试");
    }
  }, 1000);
})();
