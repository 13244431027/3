// ==UserScript==
// @name         作品替换器
// @version      2.0.0
// @description  在访问作品页和编辑器时替换作品源码，替换作品只对自己有效
// @match        https://*.ccw.site/*
// @author       不想上学
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==
const v = "2.0.0";
(()=>{function L(e,r,n=1024*100){return new Promise((t,o)=>{let s=new FileReader;s.onload=function(d){try{let l=d.target.result.split(",")[1],i=[];for(let u=0;u<l.length;u+=n)i.push(l.slice(u,u+n));GM_setValue(e+"_meta",{totalChunks:i.length,size:r.size,type:r.type}),i.forEach((u,h)=>{GM_setValue(e+"_chunk_"+h,u)}),t(i.length)}catch(l){o(l)}},s.readAsDataURL(r)})}function k(e){return new Promise((r,n)=>{try{let t=GM_getValue(e+"_meta");if(!t){n(new Error("No data found"));return}let o="";for(let l=0;l<t.totalChunks;l++)o+=GM_getValue(e+"_chunk_"+l,"");let s=atob(o),d=[];for(let l=0;l<s.length;l+=512){let i=s.slice(l,l+512),u=new Array(i.length);for(let h=0;h<i.length;h++)u[h]=i.charCodeAt(h);d.push(new Uint8Array(u))}r(new Blob(d,{type:t.type}))}catch(t){n(t)}})}function S(e){try{let r=GM_getValue(e+"_meta");if(!r)return console.warn(`No data found for key: ${e}`),!1;for(let n=0;n<r.totalChunks;n++)GM_deleteValue(e+"_chunk_"+n);return GM_deleteValue(e+"_meta"),console.log(`Successfully cleared blob data for key: ${e}`),!0}catch(r){return console.error(`Failed to clear blob data for key: ${e}`,r),!1}}function x(e){return new Promise((r,n)=>{let t=new FileReader;t.onloadend=()=>{if(t.readyState===FileReader.DONE){let o=t.result,s=new Uint8Array(o);r(s)}},t.onerror=n,t.readAsArrayBuffer(e)})}var g=(e="",r="sb3")=>new Promise(n=>{let t=document.createElement("div");t.style.cssText=`
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
    `,t.addEventListener("click",i=>{i.target===t&&(d(),n(""))});let o=document.createElement("button");o.style.cssText=`
      background: white;
      padding: 24px 32px;
      border-radius: 12px;
      border: 4px dashed #888;
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      min-width: 300px;
    `;let s=document.createElement("input");s.type="file",s.accept=e,s.style.display="none",o.innerHTML=`
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">
        选择或拖入文件
      </div>
      <div style="color: #666;">
        上传${r}文件
      </div>
    `,o.addEventListener("click",()=>s.click()),o.addEventListener("dragover",i=>{i.dataTransfer.types.includes("Files")&&(i.preventDefault(),i.dataTransfer.dropEffect="copy",o.style.borderColor="#03a9fc")}),o.addEventListener("dragleave",()=>{o.style.borderColor="#888"}),o.addEventListener("drop",i=>{let u=i.dataTransfer.files[0];u&&(i.preventDefault(),d(),n(u))}),s.addEventListener("change",i=>{d();let u=i.target.files[0];u&&n(u)}),t.appendChild(o),t.appendChild(s),document.body.appendChild(t);let d=()=>{document.body.removeChild(t)},l=i=>{i.key==="Escape"&&(d(),n(null),document.removeEventListener("keydown",l))};document.addEventListener("keydown",l)});var B={getVM:!0,mode:"xhr"};var a=GM_getValue("作品替换");function w(){return GM_setValue("作品替换",a)}(!a||typeof a!="object"||a instanceof Array)&&(a=B,w());function m(e,r,n){e[r]&&(e[r]=n(e[r]))}var V=GM_getValue("作品替换_meta")&&k("作品替换"),b=()=>a.mode&&V?V:g(".sb3,.sb2,.zip");var z=XMLHttpRequest.prototype,p;async function T(e){return blob=await b(),blob?(p=URL.createObjectURL(blob),e.body.latestProjectLink=p,e.body.creationRelease&&(e.body.creationRelease.projectLink=p),e.body.requireLogin=!1,e.body.forEveryone=!0,e.body.status="PUBLISHED",e.body.isOpenSource=!0,e.body.sourceOpenLevel="PUBLIC",e.body.creationReleaseList.unshift({checked:!1,coverGifLink:null,coverLink:e.body.latestCoverLink,createdAt:Date.now(),customVersion:"已替换",description:null,extensions:[],hasCloudVariables:!1,keyboardLayout:"TOUCH",oid:e.body.oid,operatingInstruction:null,profiling:null,projectLink:p,status:"PUBLISHED",submittedAt:Date.now(),tags:[],updatedAt:Date.now(),version:"已替换",videoLink:null}),e):(console.warn("作品替换器","blob为空"),e)}var F=e=>function(r){return m(this,"onreadystatechange",n=>async function(){if(this.readyState===4)try{let t=JSON.parse(this.response),o=await T(t);console.log("作品已替换","通过拦截xhr",o),Object.defineProperty(this,"responseText",{get:()=>JSON.stringify(o),configurable:!0}),Object.defineProperty(this,"response",{get:()=>JSON.stringify(o),configurable:!0})}catch(t){console.error("作品替换：",t)}return n.apply(this,arguments)}),e.apply(this,arguments)};function P(e){m(z,"open",r=>function(n,t){return t.startsWith("https://community-web.ccw.site/creation/detail")&&m(this,"send",F),(p&&t.includes(p)||t.endsWith(".sb3"))&&(t=p,e(t)),r.apply(this,arguments)})}function C(e=15e3){return new Promise((r,n)=>{trapViaBindReject=n,setTimeout(()=>n(new Error("Timeout")),e),m(Function.prototype,"bind",t=>function(o,...s){return(o==null?void 0:o.editingTarget)!==void 0&&(o==null?void 0:o.runtime)!==void 0?(Function.prototype.bind=t,r(o),t.call(this,o,...s)):t.call(this,o,...s)})})}if(!(function(){try{return typeof arguments.callee=="function"}catch(e){return console.error(e),!1}})()){let e="作品替换器不支持当前JavaScript环境，可尝试更新 篡改猴/暴力猴 的版本（推荐使用暴力猴）";throw alert(e),e}var y,_,O,D=!1;async function E(){var r;let e=window.vm??unsafeWindow.vm??((r=window.eureka)==null?void 0:r.vm)??y??await _;if(!y)throw"vm不存在，需要开启获取vm或者安装其他获取vm脚本";return y}a.mode=="xhr"&&P(()=>D=!0);var G;a.getVM&&((y=window.vm??unsafeWindow.vm??((G=window.eureka)==null?void 0:G.vm))&&(_=Promise.resolve(y)),_=C().then(e=>y=e),a.mode=="load"&&_.then(e=>{m(e,"loadProject",r=>(O=r.bind(e),async function(n,...t){let o=await b();if(o)return console.log("作品已替换","通过拦截vm.loadProject"),r.call(e,await x(o),...t);throw new Error("用户取消了加载作品")}))}));var f=" ",R=[{text:GM_getValue("作品替换_meta")?"重新上传作品文件":"上传作品文件",fn:M},{text:a.mode=="xhr"?"[✓] 拦截xhr (当前替换模式)":`[${f}] 拦截xhr`,async fn(){a.mode=="xhr"?(a.mode="",c(1,`[${f}] 拦截xhr`,arguments.callee)):(a.mode="xhr",c(1,"[✓] 拦截xhr (当前替换模式)",arguments.callee),c(2,`[${f}] 拦截loadProject`)),w()}},{text:a.mode=="load"?"[✓] 拦截loadProject (当前替换模式)":`[${f}] 拦截loadProject`,async fn(){a.mode=="load"?(a.mode="",c(2,`[${f}] 拦截loadProject`,arguments.callee)):(a.mode="load",c(2,"[✓] 拦截loadProject (当前替换模式)",arguments.callee),c(1,`[${f}] 拦截xhr`),a.getVM||(a.getVM=!0,c(3,"[✓] 获取vm"))),w()}},{text:a.getVM?"[✓] 获取vm":`[${f}] 获取vm`,async fn(){a.getVM?(a.mode=="load"&&(a.mode="",c(2,`[${f}] 拦截loadProject`)),a.getVM=!1,c(3,`[${f}] 获取vm`,arguments.callee)):(a.getVM=!0,c(3,"[✓] 获取vm",arguments.callee)),w()}},{text:"替换作品但不刷新页面(可能会出现问题)",async fn(){c(4,"正在替换",arguments.callee);try{let e=await E(),r=await g(".sb3,.sb2,.zip");if(r){let n=await x(r);await(O??e.loadProject)(n),alert("已替换")}}catch(e){alert(e)}c(4,"替换作品但不刷新页面(可能会出现问题)",arguments.callee)}},{text:"插入角色",async fn(){c(5,"正在插入",arguments.callee);try{let e=await E(),r=await g(".sprite3,.sprite2,.zip","sprite3");if(r){let n=await x(r);await e.addSprite(n),alert("已插入")}}catch(e){alert(e)}c(5,"插入角色",arguments.callee)}}];GM_registerMenuCommand("说明",()=>alert(`作品替换器 v${v}
在访问作品页和编辑器时替换作品源码，替换作品只对自己有效
注意：每次 替换作品/修改替换的作品/修改替换模式/开关获取vm 都必须刷新页面后才生效。

作品替换模式：
- 拦截xhr：拦截网络请求响应，修改api返回作品信息中的作品url；部分情况可能无效，比如新建作品时，此时需要换成 拦截loadProject。
- 拦截loadProject：在Scratch VM调用vm.loadProject加载作品时替换加载的作品文件，如果要选择拦截这个模式需要同时打开获取VM；如果上传的作品被ccw加密过，会加载失败，此时需要换成 拦截xhr。

替换作品但不刷新页面：直接调用vm.loadProject加载作品，不稳定，可能会出现问题。
插入角色：把角色文件插入到作品里。`));for(let e of R)e.id=GM_registerMenuCommand(e.text,e.fn);function c(e,r,n){let t=R[e];if(t)return r??=t.text,n??=t.fn,t.text=r,t.fn=n,t.id=GM_registerMenuCommand(r,n,{id:t.id})}async function M(){if(GM_getValue("作品替换_meta")){S("作品替换"),c(0,"上传作品文件",M);return}let e=await g(".sb3,.sb2,.zip");return e?(await L("作品替换",e),c(0,"重新上传作品文件",M),!0):!1}})();
