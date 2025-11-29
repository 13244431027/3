(() => {
  const vm = window.vm;
  if (!vm) return alert("未找到 TurboWarp VM。您是否在 TurboWarp 中运行此代码？");

  // ================================================================================
  // 1) 捕获原始项目状态（用于"重新加载项目"按钮）
  // ================================================================================
  let originalProjectJSON;
  try {
    originalProjectJSON = vm.toJSON();
  } catch (e) {
    if (vm.runtime && vm.runtime._hats) {
      originalProjectJSON = vm.runtime.toJSON();
    } else {
      console.warn("无法捕获项目 JSON。重新加载可能无法完美工作。");
      originalProjectJSON = null;
    }
  }

  // ================================================================================
  // 2) 构建可拖动、可滚动、可最小化的损坏器 UI
  //    (背景: #2D3D4E / #1F252C / #1A242F; 文字: #FF6A00; 按钮: #DD571C)
  // ================================================================================
  const panel = document.createElement("div");
  panel.id = "corruptorPanel";
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    width: 300px;
    max-height: 80vh;
    background: #2D3D4E;
    color: #FF6A00;
    padding: 0;
    font-family: Arial, sans-serif;
    font-size: 13px;
    border: 1px solid #444;
    border-radius: 6px;
    z-index: 99999;
    user-select: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `;

  // 头部（拖动把手）+ 最小化/关闭按钮
  const header = document.createElement("div");
  header.style.cssText = `
    cursor: grab;
    background: #1F252C;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #444;
  `;
  header.innerHTML = `
    <span style="font-size:14px; font-weight:bold; color:#FFFFFF;">
      jsRTC for Turbowarp
    </span>
    <span style="display:flex; gap:4px;">
      <button id="minimizeBtn" title="最小化" style="
        background: transparent;
        color: #DD571C;
        border: none;
        font-size: 14px;
        cursor: pointer;
        padding: 0 5px;
      ">_</button>
      <button id="closePanel" title="关闭 UI" style="
        background: transparent;
        color: #DD571C;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0 5px;
      ">✕</button>
    </span>
  `;
  panel.appendChild(header);

  // 内容区域（可滚动）
  const content = document.createElement("div");
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 6px 8px;
    background: #2D3D4E;
  `;

  // 复杂模式与简单模式的容器
  const complexContainer = document.createElement("div");
  complexContainer.id = "complexContainer";
  const simpleContainer = document.createElement("div");
  simpleContainer.id = "simpleContainer";
  simpleContainer.style.display = "none";

  // "简单模式"切换 HTML
  const simpleModeHtml = `
    <label style="
      display: block;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="simpleMode"> 简单模式
    </label>
    <div style="font-size:10px; margin-left:18px; margin-bottom:8px; color:#FF6A00;">
      勾选时，仅显示一个自动损坏滑块 + SVG 扭曲开关。
    </div>
  `;
  content.insertAdjacentHTML("beforeend", simpleModeHtml);

  // --------- 简单容器 HTML ---------
  simpleContainer.innerHTML = `
    <!-- 自动损坏 开/关 -->
    <label style="
      display: block;
      margin-top: 10px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="simpleCorruptEnable"> 自动损坏 (开/关)
    </label>
    <div style="font-size:10px; margin-left:18px; margin-bottom:6px; color:#FF6A00;">
      开启时，所有剩余的损坏类别将在每个 tick 以设定的强度运行。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 12px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="simpleRate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:12px; color:#FF6A00;">
      每 100 毫秒运行所有启用类别的几率 (%)。
    </div>

    <!-- SVG 扭曲 开/关 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="simpleSVGEnable"> SVG 扭曲
    </label>
    <div style="font-size:10px; margin-left:18px; margin-bottom:12px; color:#FF6A00;">
      如果勾选，将在下一个 tick 运行 SVG 扭曲（一次性 + 嵌入式 PNG 干扰），强度 = 简单模式的强度值。
    </div>
  `;

  // --------- 复杂容器 HTML（剩余的损坏选项） ---------
  complexContainer.innerHTML = `
    <!-- 损坏 开/关 -->
    <label style="
      display: block;
      margin-bottom: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input id="corrupt" type="checkbox"> 损坏 (开/关)
    </label>
    <div style="font-size:10px; margin-left:18px; margin-bottom:8px; color:#FF6A00;">
      勾选时，所有启用的损坏类别将每 100 毫秒运行一次。
    </div>

    <!-- 1) 爆发（块）混乱 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="burstEnable"> 爆发（块）混乱
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      随机运行来自任意角色的块（不按顺序）。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="burst" type="range" min="0" max="30" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒触发的随机块数量。
    </div>

    <!-- 2) SVG 扭曲（一次性 + 嵌入式 PNG 干扰） -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="svgOnceEnable"> 运行 SVG 扭曲（一次性）
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      扭曲矢量形状，扰乱文本，并严重干扰嵌入式 PNG（行/字节交换和复制）。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="svgIntensity" type="number" min="0" max="200" value="0" style="
        width: 60px;
        background: #1A242F;
        color: #FF6A00;
        border: 1px solid #444;
        border-radius: 3px;
        padding: 2px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每个 SVG 矢量的最大平移量（0 = 关闭，200 = 极端），外加嵌入式 PNG 字节/行交换和复制干扰。
    </div>

    <!-- 3) 控制流损坏 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="controlEnable"> 控制流损坏
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      随机中断循环，将脚本陷入无限循环，或注入等待。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="controlrate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒损坏控制流的几率 (%)。
    </div>

    <!-- 4) 视觉损坏 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="visualEnable"> 视觉损坏
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      幽灵效果、大小溢出、图层交换或造型刷屏。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="visualrate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒每个角色应用视觉故障的几率 (%)。
    </div>

    <!-- 5) 角色和克隆混乱 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="spriteEnable"> 角色和克隆混乱
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      生成/删除克隆，切换可见性，扭曲位置/大小/旋转等。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="spriterate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒每个角色应用角色混乱动作的几率 (%)。
    </div>

    <!-- 6) 块替换 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="replaceEnable"> 块替换
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      随机将任意块的操作码替换为另一个（破坏输入/字段）并运行一次。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="replacerate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒选择一个块，替换其操作码并运行的几率 (%)。
    </div>

    <!-- 7) 脚本变异 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="scriptEnable"> 脚本变异
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      脚本中途跳转、块链接和重复直到插入。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="scriptrate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒扭曲脚本流的几率 (%)。
    </div>

    <!-- 8) 资源表混乱 -->
    <label style="
      display: block;
      margin-top: 6px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      <input type="checkbox" id="assetEnable"> 资源表混乱
    </label>
    <div style="font-size:10px; margin-left:18px; color:#FF6A00;">
      在所有角色中随机重命名/交换任意造型、声音或背景的资源 ID，
      并打乱资源条目以使引用失效。
    </div>
    <label style="
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 18px;
      margin-bottom: 8px;
      background: #1A242F;
      padding: 4px 6px;
      border-radius: 4px;
      color: #FF6A00;
      font-size: 13px;
    ">
      强度&nbsp;
      <input id="assetRate" type="range" min="0" max="100" value="0" style="
        width: 180px;
        accent-color: #DD571C;
        background: #1A242F;
        border-radius: 4px;
      ">
    </label>
    <div style="font-size:10px; margin-left:36px; margin-bottom:8px; color:#FF6A00;">
      每 100 毫秒执行随机资源 ID 洗牌/重命名的几率 (%)。
    </div>

    <!-- 重新加载项目按钮 -->
    <button id="reloadProject" style="
      background: #1F252C;
      color: #FF6A00;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 8px;
      width: 100%;
      font-size: 14px;
    ">🔄 重新加载项目</button>
  `;

  content.appendChild(simpleContainer);
  content.appendChild(complexContainer);
  panel.appendChild(content);
  document.body.appendChild(panel);

  // ================================================================================
  // 3) 使面板可拖动（头部 = 把手）
  // ================================================================================
  (function makeDraggable(handleEl, dragEl) {
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    handleEl.addEventListener("mousedown", e => {
      isDragging = true;
      handleEl.style.cursor = "grabbing";
      const rect = dragEl.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      dragEl.style.left = `${newX}px`;
      dragEl.style.top = `${newY}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        handleEl.style.cursor = "grab";
      }
    });
  })(header, panel);

  // ================================================================================
  // 4) 最小化 / 恢复功能
  // ================================================================================
  const minimizeBtn = panel.querySelector("#minimizeBtn");
  let isMinimized = false;
  minimizeBtn.addEventListener("click", () => {
    if (!isMinimized) {
      content.style.display = "none";
      panel.style.height = null;
      panel.style.maxHeight = "fit-content";
      minimizeBtn.textContent = "▢";
      minimizeBtn.title = "恢复";
      isMinimized = true;
    } else {
      content.style.display = "block";
      panel.style.maxHeight = "80vh";
      minimizeBtn.textContent = "_";
      minimizeBtn.title = "最小化";
      isMinimized = false;
    }
  });

  // ================================================================================
  // 5) 简单模式切换（显示/隐藏容器）
  // ================================================================================
  const simpleModeCheckbox = panel.querySelector("#simpleMode");
  simpleModeCheckbox.addEventListener("change", () => {
    if (simpleModeCheckbox.checked) {
      complexContainer.style.display = "none";
      simpleContainer.style.display = "block";
    } else {
      simpleContainer.style.display = "none";
      complexContainer.style.display = "block";
    }
  });

  // ================================================================================
  // 6) 获取 UI 元素引用
  // ================================================================================
  const corruptToggle       = panel.querySelector("#corrupt");
  const burstEnable         = panel.querySelector("#burstEnable");
  const burstSlider         = panel.querySelector("#burst");
  const svgOnceEnable       = panel.querySelector("#svgOnceEnable");
  const svgIntensityIn      = panel.querySelector("#svgIntensity");
  const controlEnable       = panel.querySelector("#controlEnable");
  const controlSlider       = panel.querySelector("#controlrate");
  const visualEnable        = panel.querySelector("#visualEnable");
  const visualSlider        = panel.querySelector("#visualrate");
  const spriteEnable        = panel.querySelector("#spriteEnable");
  const spriteSlider        = panel.querySelector("#spriterate");
  const replaceEnable       = panel.querySelector("#replaceEnable");
  const replaceSlider       = panel.querySelector("#replacerate");
  const scriptEnable        = panel.querySelector("#scriptEnable");
  const scriptSlider        = panel.querySelector("#scriptrate");
  const assetEnable         = panel.querySelector("#assetEnable");
  const assetSlider         = panel.querySelector("#assetRate");

  const reloadBtn           = panel.querySelector("#reloadProject");
  const closePanelBtn       = panel.querySelector("#closePanel");

  // 简单模式引用
  const simpleCorruptEnable = panel.querySelector("#simpleCorruptEnable");
  const simpleRate          = panel.querySelector("#simpleRate");
  const simpleSVGEnable     = panel.querySelector("#simpleSVGEnable");

  // ================================================================================
  // 7) 损坏行为的辅助函数
  //    （除了已移除方法之外的所有方法）
  // ================================================================================

  // -- 块损坏辅助函数 --
  function getAllBlocksDeep() {
    const all = [];
    for (const target of vm.runtime.targets) {
      const blockMap = target.blocks?._blocks;
      if (!blockMap) continue;
      for (const [id, block] of Object.entries(blockMap)) {
        if (block.opcode === "event_whenflagclicked") continue;
        all.push({ target, id, block });
      }
    }
    return all;
  }
  function forceRunBlock(blockInfo) {
    try {
      vm.runtime._pushThread(blockInfo.id, blockInfo.target);
    } catch (e) { /* 抑制错误 */ }
  }

  // -- SVG 扭曲 + 嵌入式 PNG 干扰（使用 mashPNG）--
  async function mashPNG(base64, intensity) {
    return new Promise(resolve => {
      const img = new Image();
      img.src = "data:image/png;base64," + base64;
      img.onload = () => {
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data;
          const totalBytes = data.length;     // = w * h * 4

          // 1) 行交换：约 (强度/100) * (h/2) 对行
          const rowSwapCount = Math.max(1, Math.floor((intensity / 100) * (h / 2)));
          for (let i = 0; i < rowSwapCount; i++) {
            const rowA = Math.floor(Math.random() * h);
            let rowB = Math.floor(Math.random() * h);
            if (rowB === rowA) rowB = (rowB + 1) % h;
            const rowAStart = rowA * w * 4;
            const rowBStart = rowB * w * 4;
            const tempRow = new Uint8ClampedArray(w * 4);
            for (let b = 0; b < w * 4; b++) tempRow[b] = data[rowAStart + b];
            for (let b = 0; b < w * 4; b++) data[rowAStart + b] = data[rowBStart + b];
            for (let b = 0; b < w * 4; b++) data[rowBStart + b] = tempRow[b];
          }

          // 2) 字节交换：约 (强度/100) * (总字节数的 1%) 随机对交换
          const byteSwapCount = Math.max(1, Math.floor((intensity / 100) * (totalBytes * 0.01)));
          for (let i = 0; i < byteSwapCount; i++) {
            const idxA = Math.floor(Math.random() * totalBytes);
            let idxB = Math.floor(Math.random() * totalBytes);
            // 强制不同行：行 = floor(idx/(4*w))
            const rowA = Math.floor(idxA / (4 * w));
            let rowBVal = Math.floor(idxB / (4 * w));
            if (rowA === rowBVal) {
              rowBVal = (rowBVal + 1) % h;
              idxB = rowBVal * w * 4 + Math.floor(Math.random() * (w * 4));
            }
            const tmp = data[idxA];
            data[idxA] = data[idxB];
            data[idxB] = tmp;
          }

          // 3) 字节复制：约 (强度/100) * (总字节数的 0.5%) 复制到 4 个随机目标
          const byteDupCount = Math.max(1, Math.floor((intensity / 100) * (totalBytes * 0.005)));
          for (let i = 0; i < byteDupCount; i++) {
            const srcIdx = Math.floor(Math.random() * totalBytes);
            for (let c = 0; c < 4; c++) {
              const dstIdx = Math.floor(Math.random() * totalBytes);
              data[dstIdx] = data[srcIdx];
            }
          }

          ctx.putImageData(imageData, 0, 0);
          const newDataURL = canvas.toDataURL("image/png");
          const newBase64 = newDataURL.split(",")[1];
          resolve(newBase64);
        } catch (err) {
          console.warn("mashPNG 错误:", err);
          resolve(base64);
        }
      };
      img.onerror = () => {
        console.warn("mashPNG: 加载图像失败");
        resolve(base64);
      };
    });
  }
  async function distortSVGOnce(intensity) {
    for (const target of vm.runtime.targets) {
      for (const costume of target.sprite.costumes) {
        if (!costume.asset) continue;
        const format = costume.asset.dataFormat;
        if (!format.includes("svg")) continue;

        try {
          const rawText = await costume.asset.decodeText();
          const parser = new DOMParser();
          const doc = parser.parseFromString(rawText, "image/svg+xml");

          const allEls = doc.querySelectorAll("*");
          for (const el of allEls) {
            if (["path","polygon","polyline","rect","ellipse","circle"].includes(el.tagName)) {
              const tx = (Math.random() - 0.5) * intensity;
              const ty = (Math.random() - 0.5) * intensity;
              const prev = el.getAttribute("transform") || "";
              el.setAttribute("transform", `${prev} translate(${tx},${ty})`);
            }
            if (el.tagName === "text") {
              const oldTxt = el.textContent || "";
              let scrambled = "";
              for (const ch of oldTxt) {
                if (Math.random() < 0.3) scrambled += String.fromCharCode(33 + Math.floor(Math.random() * 94));
                else scrambled += ch;
              }
              el.textContent = scrambled;
              if (Math.random() < 0.5) {
                el.setAttribute("font-size", 8 + Math.random() * 60);
              }
              const dx = (Math.random() - 0.5) * intensity;
              const dy = (Math.random() - 0.5) * intensity;
              const oldX = parseFloat(el.getAttribute("x") || 0);
              const oldY = parseFloat(el.getAttribute("y") || 0);
              el.setAttribute("x", oldX + dx);
              el.setAttribute("y", oldY + dy);
            }
            if (el.tagName === "image") {
              const hrefAttr = el.getAttribute("xlink:href") || el.getAttribute("href");
              if (hrefAttr && hrefAttr.startsWith("data:image/png;base64,")) {
                const base64 = hrefAttr.split(",")[1];
                const newBase64 = await mashPNG(base64, intensity);
                const newHref = `data:image/png;base64,${newBase64}`;
                el.setAttribute("xlink:href", newHref);
                el.setAttribute("href", newHref);
              }
            }
          }

          const serializer = new XMLSerializer();
          const newSVG = serializer.serializeToString(doc);
          const newAsset = vm.runtime.storage.createAsset(
            "ImageVector",
            "svg",
            newSVG,
            null,
            true
          );
          costume.assetId = newAsset.assetId;
          costume.asset   = newAsset;
          const newSkinId = vm.renderer.createSVGSkin(newAsset.data);
          target.renderer.updateDrawableSkinId(target.drawableID, newSkinId);
          costume.skinId = newSkinId;
        } catch (err) {
          console.warn("SVG 扭曲 + 嵌入式 PNG 干扰错误:", err);
        }
      }
    }
    if (!simpleModeCheckbox.checked) {
      svgOnceEnable.checked = false;
    }
  }

  // -- 控制流损坏辅助函数 --
  function pickRandomBlockByOpcode(opcode) {
    const all = getAllBlocksDeep();
    const filtered = all.filter(b => b.block.opcode === opcode);
    if (!filtered.length) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  function corruptControlFlow(intensity) {
    if (Math.random() * 100 > intensity) return;
    const actions = ["injectWait", "forceInfiniteLoop", "randomStop"];
    const choice = actions[Math.floor(Math.random() * actions.length)];
    switch (choice) {
      case "injectWait": {
        const wb = pickRandomBlockByOpcode("control_wait");
        if (wb) {
          const prim = vm.runtime._primitives["control_wait"];
          try { prim.call(wb.target, { DURATION: Math.random() * 0.5 }); }
          catch {}
        }
        break;
      }
      case "forceInfiniteLoop": {
        let loopBlock = pickRandomBlockByOpcode("control_forever");
        if (!loopBlock) loopBlock = pickRandomBlockByOpcode("control_repeat");
        if (loopBlock) forceRunBlock(loopBlock);
        break;
      }
      case "randomStop": {
        let stopBlock = pickRandomBlockByOpcode("control_stop");
        if (!stopBlock) stopBlock = pickRandomBlockByOpcode("control_stop_all");
        if (stopBlock) forceRunBlock(stopBlock);
        break;
      }
    }
  }

  // -- 视觉损坏辅助函数 --
  function corruptVisuals(intensity) {
    for (const target of vm.runtime.targets) {
      if (target.isStage) continue;
      if (Math.random() * 100 > intensity) continue;
      const actions = ["ghostEffect", "sizeOverflow", "layerSwap", "costumeSpam"];
      const choice = actions[Math.floor(Math.random() * actions.length)];
      switch (choice) {
        case "ghostEffect": {
          const prim = vm.runtime._primitives["looks_seteffectto"];
          if (prim) {
            try { prim.call(target, { EFFECT: "ghost", VALUE: Math.random() * 100 }); }
            catch {}
          }
          break;
        }
        case "sizeOverflow": {
          const prim = vm.runtime._primitives["looks_setsizeto"];
          if (prim) {
            try {
              const val = -200 + Math.random() * 700;
              prim.call(target, { SIZE: val });
            } catch {}
          }
          break;
        }
        case "layerSwap": {
          try {
            const newLayer = Math.floor(Math.random() * 200);
            target.setLayerOrder(newLayer);
          } catch {}
          break;
        }
        case "costumeSpam": {
          const cList = target.sprite.costumes;
          if (cList.length) {
            try {
              const idx = Math.floor(Math.random() * cList.length);
              target.setCostume(idx);
            } catch {}
          }
          break;
        }
      }
    }
  }

  // -- 角色和克隆混乱辅助函数 --
  function corruptSprites(rate) {
    for (const target of vm.runtime.targets) {
      if (target.isStage) continue;
      if (Math.random() * 100 > rate) continue;
      const actions = [
        "toggleVisibility",
        "warpPosition",
        "warpScale",
        "warpRotation",
        "changeCostume",
        "shuffleLayer",
        "spawnOrDeleteClone"
      ];
      const choice = actions[Math.floor(Math.random() * actions.length)];
      switch (choice) {
        case "toggleVisibility":
          try { target.setVisible(!target.isVisible); } catch {}
          break;
        case "warpPosition":
          try {
            const dx = (Math.random() - 0.5) * 200;
            const dy = (Math.random() - 0.5) * 200;
            target.setXY(target.x + dx, target.y + dy);
          } catch {}
          break;
        case "warpScale":
          try {
            const newScale = 0.5 + Math.random();
            target.setScale(newScale);
          } catch {}
          break;
        case "warpRotation":
          try {
            const angle = Math.random() * 360;
            target.setDirection(angle);
          } catch {}
          break;
        case "changeCostume":
          try {
            const cList = target.sprite.costumes;
            if (!cList.length) break;
            const idx = Math.floor(Math.random() * cList.length);
            target.setCostume(idx);
          } catch {}
          break;
        case "shuffleLayer":
          try {
            const newLayer = Math.floor(Math.random() * 100);
            target.setLayerOrder(newLayer);
          } catch {}
          break;
        case "spawnOrDeleteClone":
          try {
            if (target.isClone) {
              target.deleteThisClone();
            } else {
              vm.runtime.instantiateTarget(
                target.cloneContext ? target.cloneContext : target
              );
            }
          } catch {}
          break;
      }
    }
  }

  // -- 块替换辅助函数 --
  const allOpcodes = Object.keys(vm.runtime._primitives);
  function replaceRandomBlock(rate) {
    if (Math.random() * 100 > rate) return;
    const allBlocks = getAllBlocksDeep();
    if (!allBlocks.length) return;
    const blockInfo = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    const { target, id, block } = blockInfo;
    let newOpcode = block.opcode;
    while (newOpcode === block.opcode) {
      newOpcode = allOpcodes[Math.floor(Math.random() * allOpcodes.length)];
    }
    block.opcode = newOpcode;
    block.inputs = {};
    block.fields = {};
    forceRunBlock(blockInfo);
  }

  // -- 脚本变异辅助函数 --
  function corruptScriptMutation(rate) {
    if (Math.random() * 100 > rate) return;

    const allBlocks = getAllBlocksDeep();
    if (!allBlocks.length) return;
    const randomBlockInfo = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    forceRunBlock(randomBlockInfo);

    const blkA = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    const blkB = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    try { blkA.block.next = blkB.id; } catch {}

    const refRepeat = pickRandomBlockByOpcode("control_repeat_until");
    if (refRepeat) {
      const target = refRepeat.target;
      const oldBlock = target.blocks._blocks[refRepeat.id];
      if (oldBlock) {
        const newId = Math.random().toString(36).substr(2, 10);
        const newBlock = {
          opcode: oldBlock.opcode,
          next: oldBlock.next,
          parent: oldBlock.parent,
          inputs: JSON.parse(JSON.stringify(oldBlock.inputs)),
          fields: JSON.parse(JSON.stringify(oldBlock.fields)),
          shadow: oldBlock.shadow,
          topLevel: oldBlock.topLevel,
        };
        target.blocks._blocks[newId] = newBlock;
        const parentId = oldBlock.parent;
        if (parentId && target.blocks._blocks[parentId]) {
          try {
            target.blocks._blocks[parentId].next = newId;
            newBlock.next = oldBlock.id;
            newBlock.parent = parentId;
            oldBlock.parent = newId;
          } catch {}
        }
      }
    }
  }

  // -- 资源表混乱辅助函数 --
  function corruptAssetTable(rate) {
    if (Math.random() * 100 > rate) return;

    // 1) 收集所有目标（包括舞台）的每个造型
    const allCostumeEntries = [];
    for (const target of vm.runtime.targets) {
      const costumes = target.sprite.costumes;
      for (let i = 0; i < costumes.length; i++) {
        allCostumeEntries.push({
          target,
          index: i,
          costume: costumes[i]
        });
      }
    }

    // 2) 打乱造型条目数组
    const shuffledCostumeEntries = allCostumeEntries.slice();
    for (let i = shuffledCostumeEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCostumeEntries[i], shuffledCostumeEntries[j]] =
        [shuffledCostumeEntries[j], shuffledCostumeEntries[i]];
    }

    // 3) 从打乱的列表中重新分配每个造型的 assetId 和 asset
    for (let i = 0; i < allCostumeEntries.length; i++) {
      const destEntry = allCostumeEntries[i];
      const srcEntry = shuffledCostumeEntries[i];
      destEntry.costume.assetId = srcEntry.costume.assetId;
      destEntry.costume.asset = srcEntry.costume.asset;
      try {
        const fmt = destEntry.costume.asset.dataFormat;
        let newSkinId;
        if (fmt.includes("svg")) {
          newSkinId = vm.renderer.createSVGSkin(destEntry.costume.asset.data);
        } else {
          newSkinId = vm.renderer.createBitmapSkin(
            destEntry.costume.asset.data,
            destEntry.costume.asset.dataFormat
          );
        }
        destEntry.target.renderer.updateDrawableSkinId(
          destEntry.target.drawableID,
          newSkinId
        );
        destEntry.costume.skinId = newSkinId;
      } catch (e) {
        console.warn("资源混乱皮肤更新错误:", e);
      }
    }

    // 4) 在舞台/背景中打乱造型名称
    const stage = vm.runtime.targets.find(t => t.isStage);
    if (stage) {
      const stageCostumes = stage.sprite.costumes;
      const names = stageCostumes.map(c => c.name);
      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
      }
      for (let i = 0; i < stageCostumes.length; i++) {
        stageCostumes[i].name = names[i];
      }
    }

    // 5) 收集所有目标的每个声音
    const allSoundEntries = [];
    for (const target of vm.runtime.targets) {
      const sounds = target.sprite.sounds;
      for (let i = 0; i < sounds.length; i++) {
        allSoundEntries.push({
          target,
          index: i,
          sound: sounds[i]
        });
      }
    }

    // 6) 打乱声音条目
    const shuffledSoundEntries = allSoundEntries.slice();
    for (let i = shuffledSoundEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSoundEntries[i], shuffledSoundEntries[j]] =
        [shuffledSoundEntries[j], shuffledSoundEntries[i]];
    }

    // 7) 从打乱的列表中重新分配每个声音的 assetId 和 asset
    for (let i = 0; i < allSoundEntries.length; i++) {
      const destEntry = allSoundEntries[i];
      const srcEntry = shuffledSoundEntries[i];
      destEntry.sound.assetId = srcEntry.sound.assetId;
      destEntry.sound.asset = srcEntry.sound.asset;
    }

    // 8) 随机化每个目标内造型数组的顺序
    for (const target of vm.runtime.targets) {
      const costumes = target.sprite.costumes;
      if (costumes.length <= 1) continue;
      for (let i = costumes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [costumes[i], costumes[j]] = [costumes[j], costumes[i]];
      }
      let newIndex = target.currentCostume ? target.currentCostume : 0;
      if (newIndex >= costumes.length) newIndex = 0;
      try {
        target.setCostume(newIndex);
      } catch {}
    }

    // 9) 随机化每个目标内声音数组的顺序
    for (const target of vm.runtime.targets) {
      const sounds = target.sprite.sounds;
      if (sounds.length <= 1) continue;
      for (let i = sounds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sounds[i], sounds[j]] = [sounds[j], sounds[i]];
      }
    }
  }

  // ================================================================================
  // 8) 主损坏循环（每 100 毫秒）
  // ================================================================================
  const masterInterval = setInterval(() => {
    // 简单模式
    if (simpleModeCheckbox.checked) {
      if (!simpleCorruptEnable.checked) return;
      const prob = parseInt(simpleRate.value);

      // 1) 爆发（块）混乱
      if (prob > 0 && burstEnable.checked) {
        const count = Math.floor((prob / 100) * 5);
        const allBlocks = getAllBlocksDeep();
        for (let i = 0; i < count; i++) {
          if (!allBlocks.length) break;
          const blk = allBlocks[Math.floor(Math.random() * allBlocks.length)];
          forceRunBlock(blk);
        }
      }
      // 2) SVG 扭曲（嵌入式 PNG 干扰）
      if (simpleSVGEnable.checked && prob > 0) distortSVGOnce(prob);
      // 3) 控制流
      if (controlEnable.checked) corruptControlFlow(prob);
      // 4) 视觉
      if (visualEnable.checked) corruptVisuals(prob);
      // 5) 角色和克隆
      if (spriteEnable.checked) corruptSprites(prob);
      // 6) 块替换
      if (replaceEnable.checked) {
        const rProb = parseInt(replaceSlider.value);
        replaceRandomBlock(rProb);
      }
      // 7) 脚本变异
      if (scriptEnable.checked) {
        const sProb = parseInt(scriptSlider.value);
        corruptScriptMutation(sProb);
      }
      // 8) 资源表混乱
      if (assetEnable.checked) {
        const aProb = parseInt(assetSlider.value);
        corruptAssetTable(aProb);
      }

    // 复杂模式
    } else {
      if (!corruptToggle.checked) return;

      // 1) 爆发（块）混乱
      if (burstEnable.checked) {
        const count = parseInt(burstSlider.value);
        const allBlocks = getAllBlocksDeep();
        for (let i = 0; i < count; i++) {
          if (!allBlocks.length) break;
          const blk = allBlocks[Math.floor(Math.random() * allBlocks.length)];
          forceRunBlock(blk);
        }
      }
      // 2) SVG 扭曲（一次性 + 嵌入式 PNG 干扰）
      if (svgOnceEnable.checked) {
        const intensity = parseInt(svgIntensityIn.value) || 0;
        if (intensity > 0) distortSVGOnce(intensity);
        svgOnceEnable.checked = false;
        svgIntensityIn.value = "0";
      }
      // 3) 控制流
      if (controlEnable.checked) {
        const cProb = parseInt(controlSlider.value);
        corruptControlFlow(cProb);
      }
      // 4) 视觉
      if (visualEnable.checked) {
        const vProb = parseInt(visualSlider.value);
        corruptVisuals(vProb);
      }
      // 5) 角色和克隆
      if (spriteEnable.checked) {
        const sProb = parseInt(spriteSlider.value);
        corruptSprites(sProb);
      }
      // 6) 块替换
      if (replaceEnable.checked) {
        const rProb = parseInt(replaceSlider.value);
        replaceRandomBlock(rProb);
      }
      // 7) 脚本变异
      if (scriptEnable.checked) {
        const sProb = parseInt(scriptSlider.value);
        corruptScriptMutation(sProb);
      }
      // 8) 资源表混乱
      if (assetEnable.checked) {
        const aProb = parseInt(assetSlider.value);
        corruptAssetTable(aProb);
      }
    }
  }, 100);

  // ================================================================================
  // 9) 关闭 UI（"✕" 按钮）
  // ================================================================================
  closePanelBtn.onclick = () => {
    clearInterval(masterInterval);
    panel.remove();
  };

  // ================================================================================
  // 10) 重新加载项目按钮
  // ================================================================================
  reloadBtn.onclick = () => {
    if (!originalProjectJSON) {
      alert("原始项目数据不可用。无法重新加载。");
      return;
    }
    try {
      vm.loadProject(originalProjectJSON);
    } catch (e) {
      console.error("重新加载项目失败:", e);
      alert("重新加载项目失败。请查看控制台了解详情。");
    }
  };
})();