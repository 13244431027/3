(function (Scratch) {
  "use strict";

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  if (!Scratch.extensions.unsandboxed) {
    console.warn("[Excalidraw] 建议以非沙盒方式加载，沙盒环境下造型保存会失效。");
  }

  const EXCALIDRAW_VERSION = "0.17.6";
  const CDNS = ["https://unpkg.com", "https://cdn.jsdelivr.net/npm", "https://fastly.jsdelivr.net/npm"];
  const distPath = (base) => base + "/@excalidraw/excalidraw@" + EXCALIDRAW_VERSION + "/dist/";


  const LANG_MAP = {
    en: "en", "zh-cn": "zh-CN", zh: "zh-CN", "zh-hans": "zh-CN",
    "zh-tw": "zh-TW", "zh-hant": "zh-TW", "zh-hk": "zh-TW",
    ja: "ja-JP", "ja-hira": "ja-JP", ko: "ko-KR", fr: "fr-FR", de: "de-DE",
    es: "es-ES", "es-419": "es-ES", ru: "ru-RU", pt: "pt-PT", "pt-br": "pt-BR",
    it: "it-IT", nl: "nl-NL", pl: "pl-PL", tr: "tr-TR", uk: "uk-UA", vi: "vi-VN",
    id: "id-ID", th: "th-TH", hi: "hi-IN", ar: "ar-SA", he: "he-IL", cs: "cs-CZ",
    da: "da-DK", fi: "fi-FI", nb: "nb-NO", nn: "nb-NO", sv: "sv-SE", el: "el-GR",
    hu: "hu-HU", ro: "ro-RO", bg: "bg-BG", ca: "ca-ES", fa: "fa-IR",
    my: "my-MM", kab: "kab-KAB"
  };

  function detectLocale() {
    const probes = [
      () => (typeof vm.getLocale === "function" ? vm.getLocale() : ""),
      () => (runtime && typeof runtime.getLocale === "function" ? runtime.getLocale() : ""),
      () => (Scratch.translate && Scratch.translate.language) || "",
      () => (runtime && runtime._editingTargetLocale) || "",
      () => {
        const store =
          window.ReduxStore ||
          (window.vm && window.vm.ReduxStore) ||
          (window.Gandi && window.Gandi.ReduxStore) ||
          (window.__GANDI__ && window.__GANDI__.ReduxStore);
        if (!store || typeof store.getState !== "function") return "";
        const state = store.getState();
        if (!state) return "";
        const scratchGui = state.scratchGui || {};
        return (
          (state.locales && state.locales.locale) ||
          (scratchGui.locales && scratchGui.locales.locale) ||
          state.locale ||
          ""
        );
      },
      () => {
        const blockly = window.Blockly;
        const msgs = blockly && blockly.ScratchMsgs;
        return (msgs && (msgs.currentLocale_ || msgs.locale)) || "";
      },
      () => (window.Gandi && (window.Gandi.locale || window.Gandi.language)) || "",
      () => {
        try {
          return localStorage.getItem("locale") || localStorage.getItem("gandi-locale") || localStorage.getItem("ccw-locale") || "";
        } catch (e) {
          return "";
        }
      },
      () => (document.documentElement && document.documentElement.lang) || "",
      () => (typeof navigator !== "undefined" && navigator.language) || ""
    ];
    for (const probe of probes) {
      let value = "";
      try {
        value = probe() || "";
      } catch (e) {
        value = "";
      }
      if (value) return String(value).toLowerCase();
    }
    return "en";
  }

  function toLangCode(locale) {
    const key = String(locale).toLowerCase();
    if (LANG_MAP[key]) return LANG_MAP[key];
    const base = key.split(/[-_]/)[0];
    return LANG_MAP[base] || "en";
  }

  
  let uiLocale = detectLocale();
  const t = (zh, en) => (/^zh/.test(uiLocale) ? zh : en);

  let refreshQueued = false;
  function refreshBlockTexts() {
    if (refreshQueued) return;
    refreshQueued = true;
    setTimeout(() => {
      refreshQueued = false;
      try {
        if (typeof runtime.refreshBlocks === "function") runtime.refreshBlocks();
        else if (typeof vm.refreshBlocks === "function") vm.refreshBlocks();
      } catch (e) {
      }
      try {
        vm.emit("EXTENSION_ADDED", {});
      } catch (e) {}
    }, 0);
  }

  function onLocaleMaybeChanged() {
    const now = detectLocale();
    if (now === uiLocale) return false;
    uiLocale = now;
    refreshBlockTexts();
    return true;
  }


  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";

  function hrefOf(el) {
    return el.getAttribute("xlink:href") || el.getAttributeNS(XLINK_NS, "href") || el.getAttribute("href") || "";
  }

  function setHref(el, value) {
    el.setAttribute("href", value);
    try { el.setAttributeNS(XLINK_NS, "xlink:href", value); } catch (e) {}
  }

  function rasterizeToPNG(dataURL, maxSide) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width || 300;
          let h = img.naturalHeight || img.height || 300;
          const limit = maxSide || 2048;
          const k = Math.max(w, h) > limit ? limit / Math.max(w, h) : 1;
          w = Math.max(1, Math.round(w * k));
          h = Math.max(1, Math.round(h * k));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = dataURL;
    });
  }

  function fetchAsDataURL(url) {
    return fetch(url, { mode: "cors" })
      .then((r) => r.blob())
      .then((blob) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      }))
      .catch(() => null);
  }

  function flattenUses(root) {
    const symbols = {};
    root.querySelectorAll("symbol[id]").forEach((s) => { symbols[s.getAttribute("id")] = s; });
    const isRelative = (v) => !v || /%\s*$/.test(String(v));

    root.querySelectorAll("use").forEach((use) => {
      const symbol = symbols[hrefOf(use).replace(/^#/, "")];
      if (!symbol) return;
      const group = root.ownerDocument.createElementNS(SVG_NS, "g");
      const x = parseFloat(use.getAttribute("x")) || 0;
      const y = parseFloat(use.getAttribute("y")) || 0;
      const transforms = [];
      if (use.getAttribute("transform")) transforms.push(use.getAttribute("transform"));
      if (x || y) transforms.push("translate(" + x + "," + y + ")");
      if (transforms.length) group.setAttribute("transform", transforms.join(" "));
      ["opacity", "clip-path", "mask", "filter", "style"].forEach((attr) => {
        const v = use.getAttribute(attr);
        if (v) group.setAttribute(attr, v);
      });

      const w = use.getAttribute("width");
      const h = use.getAttribute("height");
      Array.from(symbol.childNodes).forEach((child) => {
        const copy = child.cloneNode(true);
        if (copy.nodeType === 1) {
          if (w && isRelative(copy.getAttribute("width"))) copy.setAttribute("width", w);
          if (h && isRelative(copy.getAttribute("height"))) copy.setAttribute("height", h);
        }
        group.appendChild(copy);
      });
      use.parentNode.replaceChild(group, use);
    });

    root.querySelectorAll("symbol").forEach((s) => s.remove());
  }

  async function inlineImages(root) {
    const images = Array.from(root.querySelectorAll("image"));
    for (const image of images) {
      let href = hrefOf(image);
      if (!href) { image.remove(); continue; }
      if (/^data:image\/svg\+xml/i.test(href)) {
        const png = await rasterizeToPNG(href, 2048);
        if (!png) { image.remove(); continue; }
        href = png;
      } else if (!/^data:/i.test(href)) {
        const inlined = await fetchAsDataURL(href);
        if (!inlined) { image.remove(); continue; }
        href = inlined;
      }
      image.removeAttribute("href");
      image.removeAttribute("xlink:href");
      setHref(image, href);
    }
  }

  async function prepareSVGForCostume(text) {
    let svg = String(text);
    try {
      const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
      const root = doc.documentElement;
      if (!root || /parsererror/i.test(root.nodeName)) return normalizeSVG(svg);
      flattenUses(root);
      await inlineImages(root);
      svg = new XMLSerializer().serializeToString(root);
    } catch (e) {
      console.warn("[Excalidraw] SVG 预处理失败，使用原始导出：", e);
    }
    return normalizeSVG(svg);
  }

  async function costumeImageForBoard(costume) {
    const asset = costume && costume.asset;
    if (!asset || typeof asset.encodeDataURI !== "function") return null;
    const dataURL = asset.encodeDataURI();
    if (String(costume.dataFormat).toLowerCase() !== "svg") {
      return { dataURL, mimeType: "image/" + costume.dataFormat };
    }
    const png = await rasterizeToPNG(dataURL, 1024);
    return png ? { dataURL: png, mimeType: "image/png" } : { dataURL, mimeType: "image/svg+xml" };
  }


  function buildPage(lang) {
    const cdns = JSON.stringify(CDNS);
    return [
      "<!DOCTYPE html><html><head><meta charset='utf-8'>",
      "<style>html,body,#root{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}",
      "#boot{font:14px sans-serif;color:#555;padding:12px;}</style>",
      "</head><body><div id='root'><div id='boot'>Loading Excalidraw...</div></div>",
      "<script>",
      "(function(){",
      "  var CDNS=" + cdns + ";",
      "  var VER=" + JSON.stringify(EXCALIDRAW_VERSION) + ";",
      "  var lang=" + JSON.stringify(lang) + ";",
      "  var api=null,ready=false,dirty=false,root=null;",
      "  function post(m){var o={__excalidraw:true};for(var k in m)o[k]=m[k];parent.postMessage(o,'*');}",
      "  function dist(b){return b+'/@excalidraw/excalidraw@'+VER+'/dist/';}",
      "  function loadCSS(i){",
      "    return new Promise(function(res){",
      "      if(i>=CDNS.length) return res(-1);",
      "      var l=document.createElement('link');l.rel='stylesheet';",
      "      l.href=dist(CDNS[i])+'excalidraw.production.min.css';",
      "      l.onload=function(){res(i);};l.onerror=function(){l.remove();loadCSS(i+1).then(res);};",
      "      document.head.appendChild(l);",
      "    });",
      "  }",
      "  function loadScript(paths,i){",
      "    return new Promise(function(res,rej){",
      "      if(i>=paths.length) return rej(new Error('load failed'));",
      "      var s=document.createElement('script');s.src=paths[i];",
      "      s.onload=function(){res(i);};",
      "      s.onerror=function(){s.remove();loadScript(paths,i+1).then(res,rej);};",
      "      document.head.appendChild(s);",
      "    });",
      "  }",
      "  function urls(suffix){return CDNS.map(function(b){return b+suffix;});}",
      "  function boot(){",
      "    window.process={env:{NODE_ENV:'production'}};",
      "    loadCSS(0)",
      "      .then(function(){return loadScript(urls('/react@18.2.0/umd/react.production.min.js'),0);})",
      "      .then(function(){return loadScript(urls('/react-dom@18.2.0/umd/react-dom.production.min.js'),0);})",
      "      .then(function(){",
      "        return new Promise(function(res,rej){",
      "          var paths=CDNS.map(function(b){return dist(b)+'excalidraw.production.min.js';});",
      "          window.EXCALIDRAW_ASSET_PATH=dist(CDNS[0]);",
      "          (function step(i){",
      "            if(i>=paths.length) return rej(new Error('excalidraw load failed'));",
      "            window.EXCALIDRAW_ASSET_PATH=dist(CDNS[i]);",
      "            var s=document.createElement('script');s.src=paths[i];",
      "            s.onload=function(){res(i);};",
      "            s.onerror=function(){s.remove();step(i+1);};",
      "            document.head.appendChild(s);",
      "          })(0);",
      "        });",
      "      })",
      "      .then(function(){",
      "        if(!window.ExcalidrawLib||!window.React||!window.ReactDOM) throw new Error('bundle missing');",
      "        root=ReactDOM.createRoot(document.getElementById('root'));",
      "        render();",
      "      })",
      "      .catch(function(err){",
      "        post({type:'error',message:'CDN load failed: '+(err&&err.message||err)});",
      "        var b=document.getElementById('boot');if(b)b.textContent='Failed to load Excalidraw.';",
      "      });",
      "  }",
      "  function render(){",
      "    var L=window.ExcalidrawLib,R=window.React;",
      "    root.render(R.createElement(L.Excalidraw,{",
      "      langCode:lang,",
      "      excalidrawAPI:function(a){api=a;if(!ready){ready=true;post({type:'ready'});}},",
      "      onChange:function(){if(!dirty){dirty=true;post({type:'changed'});}}",
      "    }));",
      "  }",
      "  function sceneJSON(){",
      "    if(!api) return '';",
      "    return window.ExcalidrawLib.serializeAsJSON(api.getSceneElements(),api.getAppState(),api.getFiles(),'local');",
      "  }",
      "  function blobToDataURL(b){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result);};r.onerror=rej;r.readAsDataURL(b);});}",
      "  function exportPNG(o){",
      "    var L=window.ExcalidrawLib,st=api.getAppState();",
      "    var app={};for(var k in st)app[k]=st[k];app.exportBackground=!!o.background;",
      "    return L.exportToBlob({elements:api.getSceneElements(),files:api.getFiles(),appState:app,",
      "      mimeType:'image/png',exportPadding:10,",
      "      getDimensions:function(w,h){var s=o.scale||2;return{width:w*s,height:h*s,scale:s};}}).then(blobToDataURL);",
      "  }",
      "  function exportSVG(o){",
      "    var L=window.ExcalidrawLib,st=api.getAppState();",
      "    var app={};for(var k in st)app[k]=st[k];app.exportBackground=!!o.background;",
      "    return L.exportToSvg({elements:api.getSceneElements(),files:api.getFiles(),appState:app,exportPadding:10})",
      "      .then(function(svg){return new XMLSerializer().serializeToString(svg);});",
      "  }",
      "  function measure(d){",
      "    return new Promise(function(res){",
      "      var img=new Image();",
      "      img.onload=function(){res({w:img.naturalWidth||img.width||300,h:img.naturalHeight||img.height||300});};",
      "      img.onerror=function(){res({w:300,h:300});};",
      "      img.src=d;",
      "    });",
      "  }",
      "  function addImage(d){",
      "    var L=window.ExcalidrawLib;",
      "    return measure(d.dataURL).then(function(dim){",
      "      var maxSide=Math.max(dim.w,dim.h),k=maxSide>600?600/maxSide:1;",
      "      var w=Math.round(dim.w*k),h=Math.round(dim.h*k);",
      "      var fileId=('scratch'+Date.now().toString(36)+Math.random().toString(36).slice(2)).slice(0,40);",
      "      api.addFiles([{id:fileId,mimeType:d.mimeType||'image/png',dataURL:d.dataURL,created:Date.now()}]);",
      "      var v=api.getAppState();",
      "      var z=(v.zoom&&v.zoom.value)||1;",
      "      var cx=(-v.scrollX)+(v.width||600)/2/z, cy=(-v.scrollY)+(v.height||400)/2/z;",
      "      var sk={type:'image',fileId:fileId,x:cx-w/2,y:cy-h/2,width:w,height:h};",
      "      var made=L.convertToExcalidrawElements?L.convertToExcalidrawElements([sk]):[sk];",
      "      api.updateScene({elements:api.getSceneElements().concat(made)});",
      "      api.scrollToContent(made,{fitToContent:true});",
      "      return '';",
      "    });",
      "  }",
      "  window.addEventListener('message',function(e){",
      "    var d=e.data;if(!d||!d.__excalidrawCmd) return;",
      "    var id=d.id,p;",
      "    try{",
      "      switch(d.cmd){",
      "        case 'ping': p=Promise.resolve(ready); break;",
      "        case 'setLang': if(d.lang&&d.lang!==lang){lang=d.lang;if(root) render();} p=Promise.resolve(lang); break;",
      "        case 'getLang': p=Promise.resolve(lang); break;",
      "        case 'getScene': p=Promise.resolve(sceneJSON()); dirty=false; break;",
      "        case 'setScene': {",
      "          var parsed=JSON.parse(d.json||'{}');",
      "          api.updateScene({elements:parsed.elements||[],appState:parsed.appState||{}});",
      "          if(parsed.files) api.addFiles(Object.keys(parsed.files).map(function(k){return parsed.files[k];}));",
      "          p=Promise.resolve(''); break;",
      "        }",
      "        case 'clear': api.resetScene(); p=Promise.resolve(''); break;",
      "        case 'zoomFit': api.scrollToContent(api.getSceneElements(),{fitToContent:true}); p=Promise.resolve(''); break;",
      "        case 'elementCount': p=Promise.resolve(api.getSceneElements().length); break;",
      "        case 'addImage': p=addImage(d); break;",
      "        case 'exportPNG': p=exportPNG(d); break;",
      "        case 'exportSVG': p=exportSVG(d); break;",
      "        default: p=Promise.resolve('');",
      "      }",
      "    }catch(err){p=Promise.reject(err);}",
      "    p.then(function(v){post({type:'result',id:id,value:v});},",
      "           function(err){post({type:'result',id:id,value:'',error:String(err&&err.message||err)});});",
      "  });",
      "  if(document.readyState==='complete') boot(); else window.addEventListener('load',boot);",
      "})();",
      "</" + "script></body></html>"
    ].join("\n");
  }


  function stageSize() {
    const w = runtime.stageWidth || (runtime.constructor && runtime.constructor.STAGE_WIDTH) || 480;
    const h = runtime.stageHeight || (runtime.constructor && runtime.constructor.STAGE_HEIGHT) || 360;
    return { w, h };
  }

  class EditorOverlay {
    constructor() {
      this.iframe = null;
      this.wrapper = null;
      this.header = null;
      this.handle = null;
      this.blobUrl = null;
      this.ready = false;
      this.pending = new Map();
      this.nextId = 1;
      this.mode = "embed";
      this.embedRect = { x: 0, y: 0, width: 440, height: 320 };
      this.floatRect = { x: 0, y: 0, width: 560, height: 420, placed: false };
      this.langMode = "auto";
      this.langCode = toLangCode(detectLocale());
      this.onMessage = this.onMessage.bind(this);
      this.layout = this.layout.bind(this);
    }

    get isOpen() {
      return !!this.iframe;
    }

    open(mode) {
      if (this.iframe) {
        if (mode && mode !== this.mode) this.setMode(mode);
        return;
      }
      if (mode) this.mode = mode;
      this.langCode = this.resolveLang();

      this.wrapper = document.createElement("div");
      this.wrapper.style.overflow = "hidden";
      this.wrapper.style.background = "#fff";
      this.wrapper.style.boxSizing = "border-box";

      this.header = document.createElement("div");
      this.header.style.cssText =
        "height:26px;line-height:26px;padding:0 8px;font:12px/26px sans-serif;color:#fff;" +
        "background:#6965db;cursor:move;user-select:none;display:none;";
      this.header.textContent = "Excalidraw";

      const closeBtn = document.createElement("span");
      closeBtn.textContent = "✕";
      closeBtn.style.cssText = "float:right;cursor:pointer;padding:0 2px;";
      closeBtn.addEventListener("click", () => this.close());
      this.header.appendChild(closeBtn);

      this.iframe = document.createElement("iframe");
      this.iframe.style.cssText = "width:100%;border:0;display:block;";
      this.iframe.setAttribute("allowtransparency", "true");
      this.loadPage(this.langCode);

      this.handle = document.createElement("div");
      this.handle.style.cssText =
        "position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;" +
        "background:linear-gradient(135deg,transparent 45%,#6965db 45%,#6965db 100%);display:none;";

      this.wrapper.appendChild(this.header);
      this.wrapper.appendChild(this.iframe);
      this.wrapper.appendChild(this.handle);

      this.bindDrag(this.header, "move");
      this.bindDrag(this.handle, "resize");
      this.attach();

      window.addEventListener("message", this.onMessage);
      window.addEventListener("resize", this.layout);
      this.langTimer = setInterval(() => this.syncLang(), 800);
      this.layout();
    }

    loadPage(lang) {
      const html = buildPage(lang);
      let usedBlob = false;
      try {
        if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
        this.blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
        this.iframe.src = this.blobUrl;
        usedBlob = true;
      } catch (e) {
        this.blobUrl = null;
      }
      if (!usedBlob) {
        this.iframe.removeAttribute("src");
        this.iframe.srcdoc = html;
        return;
      }
      this.fallbackTimer = setTimeout(() => {
        if (!this.ready && this.iframe) {
          console.warn("[Excalidraw] blob iframe 未就绪，改用 srcdoc。");
          this.iframe.removeAttribute("src");
          this.iframe.srcdoc = buildPage(this.langCode);
        }
      }, 8000);
    }

    attach() {
      const canvas = runtime.renderer && runtime.renderer.canvas;
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.mode === "float") {
        this.wrapper.style.position = "fixed";
        this.wrapper.style.zIndex = "9999";
        this.wrapper.style.borderRadius = "8px";
        this.wrapper.style.boxShadow = "0 6px 28px rgba(0,0,0,.35)";
        this.header.style.display = "";
        this.handle.style.display = "";
        document.body.appendChild(this.wrapper);
        return;
      }
      const parent = canvas && canvas.parentElement;
      if (!parent) {
        console.warn("[Excalidraw] 未找到舞台容器，改用浮动窗口。");
        this.mode = "float";
        this.attach();
        return;
      }
      this.wrapper.style.position = "absolute";
      this.wrapper.style.zIndex = "500";
      this.wrapper.style.borderRadius = "6px";
      this.wrapper.style.boxShadow = "0 2px 12px rgba(0,0,0,.35)";
      this.header.style.display = "none";
      this.handle.style.display = "none";
      parent.appendChild(this.wrapper);
      if (typeof ResizeObserver !== "undefined") {
        this.observer = new ResizeObserver(this.layout);
        this.observer.observe(canvas);
      }
    }

    setMode(mode) {
      const next = mode === "float" ? "float" : "embed";
      if (next === this.mode || !this.wrapper) {
        this.mode = next;
        return;
      }
      this.mode = next;
      this.wrapper.remove();
      this.attach();
      this.layout();
    }

    close() {
      if (!this.iframe) return;
      window.removeEventListener("message", this.onMessage);
      window.removeEventListener("resize", this.layout);
      if (this.langTimer) clearInterval(this.langTimer);
      if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.wrapper.remove();
      if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
      this.iframe = null;
      this.wrapper = null;
      this.header = null;
      this.handle = null;
      this.blobUrl = null;
      this.langTimer = null;
      this.fallbackTimer = null;
      this.ready = false;
      this.pending.forEach((entry) => entry.resolve(""));
      this.pending.clear();
    }

    setRect(rect) {
      const target = this.mode === "float" ? this.floatRect : this.embedRect;
      Object.assign(target, rect);
      if (this.mode === "float") this.floatRect.placed = true;
      this.layout();
    }

    setVisible(visible) {
      if (this.wrapper) this.wrapper.style.display = visible ? "" : "none";
    }

    layout() {
      if (!this.wrapper) return;
      if (this.mode === "float") {
        const r = this.floatRect;
        if (!r.placed) {
          r.x = Math.max(8, (window.innerWidth - r.width) / 2);
          r.y = Math.max(8, (window.innerHeight - r.height) / 2);
          r.placed = true;
        }
        this.wrapper.style.left = r.x + "px";
        this.wrapper.style.top = r.y + "px";
        this.wrapper.style.width = r.width + "px";
        this.wrapper.style.height = r.height + "px";
        this.iframe.style.height = Math.max(0, r.height - 26) + "px";
        return;
      }
      const canvas = runtime.renderer && runtime.renderer.canvas;
      if (!canvas) return;
      const { w: stageW, h: stageH } = stageSize();
      const scaleX = (canvas.clientWidth || stageW) / stageW;
      const scaleY = (canvas.clientHeight || stageH) / stageH;
      const r = this.embedRect;
      this.wrapper.style.left = (r.x + stageW / 2 - r.width / 2) * scaleX + "px";
      this.wrapper.style.top = (stageH / 2 - r.y - r.height / 2) * scaleY + "px";
      this.wrapper.style.width = r.width * scaleX + "px";
      this.wrapper.style.height = r.height * scaleY + "px";
      this.iframe.style.height = "100%";
    }

    bindDrag(element, kind) {
      element.addEventListener("pointerdown", (event) => {
        if (this.mode !== "float") return;
        event.preventDefault();
        element.setPointerCapture(event.pointerId);
        if (this.iframe) this.iframe.style.pointerEvents = "none";
        const start = { px: event.clientX, py: event.clientY };
        const base = Object.assign({}, this.floatRect);
        const move = (moveEvent) => {
          const dx = moveEvent.clientX - start.px;
          const dy = moveEvent.clientY - start.py;
          if (kind === "move") {
            this.floatRect.x = base.x + dx;
            this.floatRect.y = base.y + dy;
          } else {
            this.floatRect.width = Math.max(220, base.width + dx);
            this.floatRect.height = Math.max(160, base.height + dy);
          }
          this.layout();
        };
        const up = () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerup", up);
          element.removeEventListener("pointercancel", up);
          if (this.iframe) this.iframe.style.pointerEvents = "";
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerup", up);
        element.addEventListener("pointercancel", up);
      });
    }

    resolveLang() {
      return this.langMode === "auto" ? toLangCode(detectLocale()) : this.langMode;
    }

    setLangMode(mode) {
      this.langMode = String(mode || "auto");
      this.syncLang(true);
    }

    syncLang(force) {
      const next = this.resolveLang();
      if (!force && next === this.langCode) return;
      this.langCode = next;
      if (this.iframe) this.send("setLang", { lang: next });
    }

    onMessage(event) {
      const data = event.data;
      if (!data || !data.__excalidraw) return;
      if (this.iframe && event.source !== this.iframe.contentWindow) return;
      if (data.type === "ready") {
        this.ready = true;
        if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
        this.syncLang(true);
        return;
      }
      if (data.type === "changed") {
        try {
          runtime.startHats("excalidraw_whenChanged");
        } catch (e) {
        }
        return;
      }
      if (data.type === "error") {
        console.warn("[Excalidraw]", data.message);
        return;
      }
      if (data.type === "result") {
        const entry = this.pending.get(data.id);
        if (entry) {
          this.pending.delete(data.id);
          if (data.error) console.warn("[Excalidraw]", data.error);
          entry.resolve(data.value);
        }
      }
    }

    send(cmd, extra) {
      if (!this.iframe) return Promise.resolve("");
      const id = this.nextId++;
      const message = Object.assign({ __excalidrawCmd: true, cmd, id }, extra || {});
      return new Promise((resolve) => {
        this.pending.set(id, { resolve });
        const post = () => {
          if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage(message, "*");
          } else {
            resolve("");
          }
        };
        if (this.ready) {
          post();
        } else {
          const start = Date.now();
          const wait = () => {
            if (!this.iframe) return resolve("");
            if (this.ready) return post();
            if (Date.now() - start > 20000) return resolve("");
            setTimeout(wait, 100);
          };
          wait();
        }
        setTimeout(() => {
          if (this.pending.delete(id)) resolve("");
        }, 30000);
      });
    }
  }

  const overlay = new EditorOverlay();
  runtime.on("PROJECT_STOP_ALL", () => overlay.close());

  function handleLocaleChange() {
    const changed = onLocaleMaybeChanged();
    overlay.syncLang(changed);
  }

  if (typeof vm.on === "function") {
    ["LOCALE_CHANGED", "locale_changed", "LOCALE_UPDATED"].forEach((event) => {
      try {
        vm.on(event, handleLocaleChange);
      } catch (e) {}
    });
  }
  try {
    const store =
      window.ReduxStore ||
      (window.Gandi && window.Gandi.ReduxStore) ||
      (window.__GANDI__ && window.__GANDI__.ReduxStore);
    if (store && typeof store.subscribe === "function") store.subscribe(handleLocaleChange);
  } catch (e) {
  }
  setInterval(handleLocaleChange, 1000);


  function refreshEditorUI(target) {
    try {
      runtime.emitProjectChanged();
    } catch (e) {}
    try {
      vm.emitTargetsUpdate();
    } catch (e) {}
    try {
      if (typeof runtime.requestTargetsUpdate === "function") runtime.requestTargetsUpdate(target);
    } catch (e) {}
    try {
      vm.emit("workspaceUpdate", {});
    } catch (e) {}
    try {
      if (target && vm.runtime.requestRedraw) vm.runtime.requestRedraw();
    } catch (e) {}
  }

  function originalOf(target) {
    if (!target) return runtime.getTargetForStage();
    if (target.isOriginal) return target;
    return (target.sprite && target.sprite.clones && target.sprite.clones[0]) || target;
  }

  function uniqueCostumeName(target, name) {
    const base = String(name || "drawing").trim() || "drawing";
    const used = new Set(target.getCostumes().map((c) => c.name));
    if (!used.has(base)) return base;
    let index = 2;
    while (used.has(base + index)) index++;
    return base + index;
  }

  function cacheAsset(asset) {
    try {
      const helper = runtime.storage && runtime.storage.builtinHelper;
      if (helper && typeof helper._store === "function") {
        helper._store(asset.assetType, asset.dataFormat, asset.data, asset.assetId);
      }
    } catch (e) {}
  }

  async function installCostume(costume, target, extras) {
    const owner = originalOf(target);
    costume.name = uniqueCostumeName(owner, costume.name);
    cacheAsset(costume.asset);

    const before = owner.getCostumes().length;

    if (typeof vm.addCostume === "function") {
      try {
        await vm.addCostume(costume.md5ext, costume, owner.id);
        if (owner.getCostumes().length > before) {
          refreshEditorUI(owner);
          return true;
        }
        console.warn("[Excalidraw] vm.addCostume 未写入造型，改用手动方式。");
      } catch (e) {
        console.warn("[Excalidraw] vm.addCostume 失败，改用手动方式：", e);
      }
    }

    const renderer = runtime.renderer;
    if (!renderer) return false;
    const resolution = costume.bitmapResolution || 1;
    const cx = costume.rotationCenterX / resolution;
    const cy = costume.rotationCenterY / resolution;
    try {
      if (extras.svgText) {
        costume.skinId = renderer.createSVGSkin(extras.svgText, [cx, cy]);
      } else if (extras.bitmap) {
        costume.skinId = renderer.createBitmapSkin(extras.bitmap, resolution, [cx, cy]);
      } else {
        return false;
      }
      costume.size = renderer.getSkinSize(costume.skinId);
      owner.addCostume(costume, owner.getCostumes().length);
      refreshEditorUI(owner);
      return owner.getCostumes().length > before;
    } catch (e) {
      console.warn("[Excalidraw] 手动添加造型失败：", e);
      return false;
    }
  }

  function svgSize(svgText) {
    let width = 0;
    let height = 0;
    try {
      const root = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;
      width = parseFloat(root.getAttribute("width")) || 0;
      height = parseFloat(root.getAttribute("height")) || 0;
      if (!width || !height) {
        const box = (root.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
        if (box.length === 4) {
          width = width || box[2];
          height = height || box[3];
        }
      }
    } catch (e) {}
    return { width: width || 300, height: height || 300 };
  }

  function normalizeSVG(text) {
    let svg = String(text);
    try {
      const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
      const root = doc.documentElement;
      if (!root || /parsererror/i.test(root.nodeName)) return svg;
      if (!root.getAttribute("xmlns")) root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      if (!root.getAttribute("xmlns:xlink")) {
        root.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
      }
      const w = parseFloat(root.getAttribute("width")) || 0;
      const h = parseFloat(root.getAttribute("height")) || 0;
      const box = (root.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
      const boxOk = box.length === 4 && box.every((n) => !isNaN(n));
      const width = w || (boxOk ? box[2] : 300);
      const height = h || (boxOk ? box[3] : 300);
      root.setAttribute("width", String(width));
      root.setAttribute("height", String(height));
      if (!boxOk) root.setAttribute("viewBox", "0 0 " + width + " " + height);
      svg = new XMLSerializer().serializeToString(root);
    } catch (e) {}
    return svg;
  }

  async function addBitmapCostume(dataURL, name, target) {
    if (!/^data:image\/png/.test(String(dataURL))) return false;
    const buffer = new Uint8Array(await (await fetch(dataURL)).arrayBuffer());
    const storage = runtime.storage;
    const asset = storage.createAsset(storage.AssetType.ImageBitmap, storage.DataFormat.PNG, buffer, null, true);
    let bitmap = null;
    try {
      bitmap = await createImageBitmap(new Blob([buffer], { type: "image/png" }));
    } catch (e) {}
    const width = (bitmap && bitmap.width) || 600;
    const height = (bitmap && bitmap.height) || 400;
    return installCostume(
      {
        name: String(name || "drawing"),
        dataFormat: asset.dataFormat,
        asset,
        md5ext: asset.assetId + "." + asset.dataFormat,
        assetId: asset.assetId,
        rotationCenterX: width / 2,
        rotationCenterY: height / 2,
        bitmapResolution: 2
      },
      target,
      { bitmap }
    );
  }

  async function addVectorCostume(svgText, name, target) {
    const raw = String(svgText || "");
    if (!/<svg[\s>]/i.test(raw)) return false;
    const text = await prepareSVGForCostume(raw);  
    const storage = runtime.storage;
    const asset = storage.createAsset(
      storage.AssetType.ImageVector,
      storage.DataFormat.SVG,
      new TextEncoder().encode(text),
      null,
      true
    );
    const size = svgSize(text);
    return installCostume(
      {
        name: String(name || "drawing"),
        dataFormat: asset.dataFormat,
        asset,
        md5ext: asset.assetId + "." + asset.dataFormat,
        assetId: asset.assetId,
        rotationCenterX: size.width / 2,
        rotationCenterY: size.height / 2,
        bitmapResolution: 1
      },
      target,
      { svgText: text }
    );
  }

  function resolveTarget(name, util) {
    const text = Scratch.Cast.toString(name);
    if (text === "_myself_" || text === "自己") return util.target;
    return runtime.getSpriteTargetByName(text) || util.target;
  }

  function resolveCostume(target, selector) {
    const costumes = target.getCostumes();
    const text = Scratch.Cast.toString(selector);
    const byName = costumes.find((c) => c.name === text);
    if (byName) return byName;
    const index = Math.round(Scratch.Cast.toNumber(selector));
    if (index >= 1 && index <= costumes.length) return costumes[index - 1];
    return null;
  }


  class ExcalidrawEditor {
    getInfo() {
      const NUM = Scratch.ArgumentType.NUMBER;
      const STR = Scratch.ArgumentType.STRING;
      const hasLabel = !!Scratch.BlockType.LABEL;
      const label = (text) => (hasLabel ? { blockType: Scratch.BlockType.LABEL, text } : null);

      const blocks = [
        label(t("窗口", "Window")),
        {
          opcode: "open",
          blockType: Scratch.BlockType.COMMAND,
          text: t("打开画板 模式[MODE]", "open board mode [MODE]"),
          arguments: { MODE: { type: STR, menu: "mode", defaultValue: "embed" } }
        },
        { opcode: "close", blockType: Scratch.BlockType.COMMAND, text: t("关闭画板", "close board") },
        {
          opcode: "setMode",
          blockType: Scratch.BlockType.COMMAND,
          text: t("切换到[MODE]模式", "switch to [MODE] mode"),
          arguments: { MODE: { type: STR, menu: "mode", defaultValue: "float" } }
        },
        {
          opcode: "setVisible",
          blockType: Scratch.BlockType.COMMAND,
          text: t("[STATE]画板", "[STATE] board"),
          arguments: { STATE: { type: STR, menu: "visibility", defaultValue: "show" } }
        },
        {
          opcode: "setRect",
          blockType: Scratch.BlockType.COMMAND,
          text: t("设置画板 宽[W] 高[H] 位置 x:[X] y:[Y]", "set board width [W] height [H] at x:[X] y:[Y]"),
          arguments: {
            W: { type: NUM, defaultValue: 440 },
            H: { type: NUM, defaultValue: 320 },
            X: { type: NUM, defaultValue: 0 },
            Y: { type: NUM, defaultValue: 0 }
          }
        },
        { opcode: "isOpen", blockType: Scratch.BlockType.BOOLEAN, text: t("画板已打开?", "board is open?") },
        { opcode: "currentMode", blockType: Scratch.BlockType.REPORTER, text: t("画板模式", "board mode") },
        {
          opcode: "whenChanged",
          blockType: Scratch.BlockType.HAT,
          isEdgeActivated: false,
          text: t("当画板打开始", "when board content changes")
        },

        "---",
        label(t("语言", "Language")),
        {
          opcode: "setLang",
          blockType: Scratch.BlockType.COMMAND,
          text: t("设置画板语言为[LANG]", "set board language to [LANG]"),
          arguments: { LANG: { type: STR, menu: "languages", defaultValue: "auto" } }
        },
        { opcode: "currentLang", blockType: Scratch.BlockType.REPORTER, text: t("画板语言", "board language") },

        "---",
        label(t("画面内容", "Scene")),
        { opcode: "clear", blockType: Scratch.BlockType.COMMAND, text: t("清空画板", "clear board") },
        { opcode: "zoomFit", blockType: Scratch.BlockType.COMMAND, text: t("缩放到适合内容", "zoom to fit") },
        {
          opcode: "setScene",
          blockType: Scratch.BlockType.COMMAND,
          text: t("载入场景 JSON [JSON]", "load scene JSON [JSON]"),
          arguments: { JSON: { type: STR, defaultValue: "{}" } }
        },
        { opcode: "getScene", blockType: Scratch.BlockType.REPORTER, text: t("场景 JSON", "scene JSON") },
        { opcode: "elementCount", blockType: Scratch.BlockType.REPORTER, text: t("图形数量", "element count") },

        "---",
        label(t("导入 / 导出", "Import / Export")),
        {
          opcode: "importCostume",
          blockType: Scratch.BlockType.COMMAND,
          text: t("导入[SPRITE]的造型[COSTUME]到画板", "import costume [COSTUME] of [SPRITE] to board"),
          arguments: {
            SPRITE: { type: STR, menu: "sprites", defaultValue: "_myself_" },
            COSTUME: { type: STR, defaultValue: "1" }
          }
        },
        {
          opcode: "importDataURL",
          blockType: Scratch.BlockType.COMMAND,
          text: t("导入图片数据链接[URL]到画板", "import image data URL [URL] to board"),
          arguments: { URL: { type: STR, defaultValue: "data:image/png;base64,..." } }
        },
        {
          opcode: "toCostume",
          blockType: Scratch.BlockType.COMMAND,
          text: t("保存为[KIND]造型[NAME] 背景[BG]", "save as [KIND] costume [NAME] background [BG]"),
          arguments: {
            KIND: { type: STR, menu: "costumeKind", defaultValue: "vector" },
            NAME: { type: STR, defaultValue: t("我的画", "my drawing") },
            BG: { type: STR, menu: "background", defaultValue: "transparent" }
          }
        },
        {
          opcode: "saveToSprite",
          blockType: Scratch.BlockType.COMMAND,
          text: t("保存为[SPRITE]的[KIND]造型[NAME] 背景[BG]", "save to [SPRITE] as [KIND] costume [NAME] background [BG]"),
          arguments: {
            SPRITE: { type: STR, menu: "sprites", defaultValue: "_myself_" },
            KIND: { type: STR, menu: "costumeKind", defaultValue: "vector" },
            NAME: { type: STR, defaultValue: t("我的画", "my drawing") },
            BG: { type: STR, menu: "background", defaultValue: "transparent" }
          }
        },
        {
          opcode: "lastSaveOk",
          blockType: Scratch.BlockType.BOOLEAN,
          text: t("上次保存成功?", "last save succeeded?")
        },
        {
          opcode: "exportImage",
          blockType: Scratch.BlockType.REPORTER,
          text: t("导出[FORMAT] 背景[BG] 倍率[SCALE]", "export [FORMAT] background [BG] scale [SCALE]"),
          arguments: {
            FORMAT: { type: STR, menu: "format", defaultValue: "png" },
            BG: { type: STR, menu: "background", defaultValue: "transparent" },
            SCALE: { type: NUM, defaultValue: 2 }
          }
        }
      ].filter(Boolean);

      return {
        id: "excalidraw",
        name: t("Excalidraw 画板", "Excalidraw Board"),
        color1: "#6965db",
        color2: "#5b57d1",
        color3: "#4b47b8",
        blocks,
        menus: {
          mode: {
            acceptReporters: true,
            items: [
              { text: t("嵌入舞台", "embed in stage"), value: "embed" },
              { text: t("浮动窗口", "floating window"), value: "float" }
            ]
          },
          visibility: {
            acceptReporters: true,
            items: [
              { text: t("显示", "show"), value: "show" },
              { text: t("隐藏", "hide"), value: "hide" }
            ]
          },
          background: {
            acceptReporters: true,
            items: [
              { text: t("透明", "transparent"), value: "transparent" },
              { text: t("白色", "white"), value: "white" }
            ]
          },
          format: {
            acceptReporters: true,
            items: [
              { text: t("PNG 数据链接", "PNG data URL"), value: "png" },
              { text: t("SVG 文本", "SVG text"), value: "svg" }
            ]
          },
          costumeKind: {
            acceptReporters: true,
            items: [
              { text: t("矢量", "vector"), value: "vector" },
              { text: t("位图", "bitmap"), value: "bitmap" }
            ]
          },
          languages: {
            acceptReporters: true,
            items: [
              { text: t("自动（跟随编辑器）", "auto (follow editor)"), value: "auto" },
              { text: "简体中文", value: "zh-CN" },
              { text: "繁體中文", value: "zh-TW" },
              { text: "English", value: "en" },
              { text: "日本語", value: "ja-JP" },
              { text: "한국어", value: "ko-KR" },
              { text: "Français", value: "fr-FR" },
              { text: "Deutsch", value: "de-DE" },
              { text: "Español", value: "es-ES" },
              { text: "Русский", value: "ru-RU" },
              { text: "Português (BR)", value: "pt-BR" },
              { text: "العربية", value: "ar-SA" }
            ]
          },
          sprites: { acceptReporters: true, items: "spriteMenu" }
        }
      };
    }

    spriteMenu() {
      const items = [{ text: t("自己", "myself"), value: "_myself_" }];
      runtime.targets.forEach((target) => {
        if (target.isOriginal && !target.isStage) {
          items.push({ text: target.getName(), value: target.getName() });
        }
      });
      return items;
    }

    open(args) {
      overlay.open(Scratch.Cast.toString(args.MODE) === "float" ? "float" : "embed");
      overlay.setVisible(true);
    }
    close() {
      overlay.close();
    }
    setMode(args) {
      overlay.setMode(Scratch.Cast.toString(args.MODE));
    }
    setVisible(args) {
      overlay.setVisible(Scratch.Cast.toString(args.STATE) !== "hide");
    }
    setRect(args) {
      overlay.setRect({
        width: Math.max(120, Scratch.Cast.toNumber(args.W)),
        height: Math.max(100, Scratch.Cast.toNumber(args.H)),
        x: Scratch.Cast.toNumber(args.X),
        y: Scratch.Cast.toNumber(args.Y)
      });
    }
    isOpen() {
      return overlay.isOpen;
    }
    currentMode() {
      return overlay.mode === "float" ? t("浮动窗口", "floating window") : t("嵌入舞台", "embed in stage");
    }
    whenChanged() {
      return true;
    }

    setLang(args) {
      overlay.setLangMode(Scratch.Cast.toString(args.LANG));
    }
    currentLang() {
      return overlay.resolveLang();
    }

    clear() {
      return overlay.send("clear").then(() => {});
    }
    zoomFit() {
      return overlay.send("zoomFit").then(() => {});
    }
    setScene(args) {
      return overlay.send("setScene", { json: Scratch.Cast.toString(args.JSON) }).then(() => {});
    }
    getScene() {
      return overlay.send("getScene").then((v) => Scratch.Cast.toString(v));
    }
    elementCount() {
      return overlay.send("elementCount").then((v) => Scratch.Cast.toNumber(v));
    }

    async importCostume(args, util) {
      const target = resolveTarget(args.SPRITE, util);
      const costume = resolveCostume(target, args.COSTUME);
      if (!costume) return;
      const image = await costumeImageForBoard(costume);
      if (!image) return;
      await overlay.send("addImage", image);
    }

    async importDataURL(args) {
      let url = Scratch.Cast.toString(args.URL);
      if (!/^data:image\//.test(url)) return;
      let mimeType;
      if (/^data:image\/svg\+xml/i.test(url)) {
        const png = await rasterizeToPNG(url, 1024);
        if (png) { url = png; mimeType = "image/png"; }
      }
      if (!mimeType) {
        const semi = url.indexOf(";");
        const comma = url.indexOf(",");
        const cut = semi >= 0 && semi < comma ? semi : comma;
        mimeType = url.slice(5, cut);
      }
      await overlay.send("addImage", { dataURL: url, mimeType });
    }

    async toCostume(args, util) {
      await this._save(args, util.target, args.KIND, args.NAME, args.BG);
    }

    async saveToSprite(args, util) {
      await this._save(args, resolveTarget(args.SPRITE, util), args.KIND, args.NAME, args.BG);
    }

    async _save(args, target, kind, name, bg) {
      const background = Scratch.Cast.toString(bg) === "white";
      this._lastOk = false;
      if (!overlay.isOpen) return;
      if (Scratch.Cast.toString(kind) === "bitmap") {
        const dataURL = await overlay.send("exportPNG", { background, scale: 2 });
        if (dataURL) this._lastOk = await addBitmapCostume(dataURL, name, target);
        return;
      }
      const svg = await overlay.send("exportSVG", { background });
      if (svg) this._lastOk = await addVectorCostume(svg, name, target);
    }

    lastSaveOk() {
      return !!this._lastOk;
    }

    exportImage(args) {
      const background = Scratch.Cast.toString(args.BG) === "white";
      if (Scratch.Cast.toString(args.FORMAT) === "svg") {
        return overlay.send("exportSVG", { background }).then((v) => Scratch.Cast.toString(v));
      }
      return overlay
        .send("exportPNG", { background, scale: Math.max(0.1, Scratch.Cast.toNumber(args.SCALE)) })
        .then((v) => Scratch.Cast.toString(v));
    }
  }

  Scratch.extensions.register(new ExcalidrawEditor());
})(Scratch);
