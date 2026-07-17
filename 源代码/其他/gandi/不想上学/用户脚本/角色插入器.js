// ==UserScript==
// @name         角色插入器
// @version      1.0.0
// @description  访问别人作品时向作品里插入角色，插入后的作品不会上传，只对自己有效
// @match        https://*.ccw.site/*
// @author       不想上学
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==
function patch(e,t,r){e[t]&&(e[t]=r(e[t]))}function trapViaBind(){return new Promise((n,e)=>{trapViaBindReject=e,setTimeout(()=>e(new Error("获取VM超时")),15e3),patch(Function.prototype,"bind",r=>function(e,...t){return void 0!==e?.editingTarget&&void 0!==e?.runtime&&(Function.prototype.bind=r,n(e)),r.call(this,e,...t)})})}function getReduxStoreFromDOM(){try{if(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)for(var e of window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots?.(1)||[]){var t=function t(r,n=new Set){if(!r||n.has(r))return null;n.add(r);try{if(r?.memoizedState?.state?.scratchGui?.vm)return r.memoizedState.state;if(r?.stateNode?.state?.scratchGui?.vm)return r.stateNode;if(r?.getState?.()?.scratchGui?.vm)return r;for(var i in r)if(r[i]&&"object"==typeof r[i]){let e=t(r[i],n);if(e)return e}}catch(e){}return null}(e);if(t)return t}var r;for(r of document.querySelectorAll("*"))try{var n=Object.keys(r).find(e=>e.includes("__reactContainer"));if(n&&r[n]){var i=function t(r,n=new Set){if(!r||n.has(r))return null;n.add(r);try{if(r.getState){let e=r.getState();if(e?.scratchGui?.vm&&e.scratchPaint)return r}for(var i in r)if(r[i]&&"object"==typeof r[i]){let e=t(r[i],n);if(e)return e}}catch(e){}return null}(r[n]);if(i)return i}}catch(e){continue}}catch(e){console.warn("获取Redux Store失败",e)}return null}async function getVM(){let e=window.eureka?.vm;if(e)console.log("通过Eureka获取vm",e);else if(e=window.vm??unsafeWindow.vm)console.log("通过全局变量获取vm",e);else if("complete"===document.readyState){if(!(e=getReduxStoreFromDOM()?.getState()?.scratchGui?.vm))throw"无法从DOM获取vm";console.log("通过DOM获取vm",e)}else e=await trapViaBind(),console.log("通过Bind获取vm",e);return unsafeWindow.vm=window.vm=e}let showFilePrompt=(a="",d="sprite3")=>new Promise(r=>{let t=document.createElement("div"),n=(t.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `,t.addEventListener("click",e=>{e.target===t&&(i(),r(""))}),document.createElement("button")),e=(n.style.cssText=`
      background: white;
      padding: 24px 32px;
      border-radius: 12px;
      border: 4px dashed #888;
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      min-width: 300px;
    `,document.createElement("input")),i=(e.type="file",e.accept=a,e.style.display="none",n.innerHTML=`
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">
        选择或拖入文件
      </div>
      <div style="color: #666;">
        上传${d}文件
      </div>
    `,n.addEventListener("click",()=>e.click()),n.addEventListener("dragover",e=>{e.dataTransfer.types.includes("Files")&&(e.preventDefault(),e.dataTransfer.dropEffect="copy",n.style.borderColor="#03a9fc")}),n.addEventListener("dragleave",()=>{n.style.borderColor="#888"}),n.addEventListener("drop",e=>{var t=e.dataTransfer.files[0];t&&(e.preventDefault(),r(t))}),e.addEventListener("change",e=>{e=e.target.files[0];e&&r(e)}),t.appendChild(n),t.appendChild(e),document.body.appendChild(t),()=>{document.body.removeChild(t)}),o=e=>{"Escape"===e.key&&(i(),r(""),document.removeEventListener("keydown",o))};document.addEventListener("keydown",o)});function blobToArrayBuffer(n){return new Promise((e,t)=>{let r=new FileReader;r.onloadend=()=>e(r.result),r.onerror=t,r.readAsArrayBuffer(n)})}getVM().then(r=>{let n;function i(e,t){n=GM_registerMenuCommand(e,t,{id:n})}i("插入角色",async function e(){try{i("正在插入",()=>{});var t=await showFilePrompt(".sprite3,.sprite2,.zip");await r.addSprite(await blobToArrayBuffer(t))}catch(e){alert("插入失败："+e)}i("插入角色",e)})});