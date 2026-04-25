
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 * 
 * 
 * MIT License

Copyright (c) 2019 George Michael Brower

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i((t=t||self).lil={})}(this,(function(t){"use strict";class i{constructor(t,e,s,n,l="div"){this.parent=t,this.object=e,this.property=s,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(l),this.domElement.classList.add("controller"),this.domElement.classList.add(n),this.$name=document.createElement("div"),this.$name.classList.add("name"),i.nextNameID=i.nextNameID||0,this.$name.id="lil-gui-name-"+ ++i.nextNameID,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",t=>t.stopPropagation()),this.domElement.addEventListener("keyup",t=>t.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(s)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),void 0!==this._onChange&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),void 0!==this._onFinishChange&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled||(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t)),this}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const i=this.parent.add(this.object,this.property,t);return i.name(this._name),this.destroy(),i}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,void 0!==this._listenCallbackID&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class e extends i{constructor(t,i,e){super(t,i,e,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function s(t){let i,e;return(i=t.match(/(#|0x)?([a-f0-9]{6})/i))?e=i[2]:(i=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(i[1]).toString(16).padStart(2,0)+parseInt(i[2]).toString(16).padStart(2,0)+parseInt(i[3]).toString(16).padStart(2,0):(i=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=i[1]+i[1]+i[2]+i[2]+i[3]+i[3]),!!e&&"#"+e}const n={isPrimitive:!0,match:t=>"number"==typeof t,fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},l={isPrimitive:!1,match:t=>Array.isArray(t),fromHexString(t,i,e=1){const s=n.fromHexString(t);i[0]=(s>>16&255)/255*e,i[1]=(s>>8&255)/255*e,i[2]=(255&s)/255*e},toHexString:([t,i,e],s=1)=>n.toHexString(t*(s=255/s)<<16^i*s<<8^e*s<<0)},r={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,i,e=1){const s=n.fromHexString(t);i.r=(s>>16&255)/255*e,i.g=(s>>8&255)/255*e,i.b=(255&s)/255*e},toHexString:({r:t,g:i,b:e},s=1)=>n.toHexString(t*(s=255/s)<<16^i*s<<8^e*s<<0)},o=[{isPrimitive:!0,match:t=>"string"==typeof t,fromHexString:s,toHexString:s},n,l,r];class a extends i{constructor(t,i,e,n){var l;super(t,i,e,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=(l=this.initialValue,o.find(t=>t.match(l))),this._rgbScale=n,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const t=s(this.$text.value);t&&this._setValueFromHexString(t)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const i=this._format.fromHexString(t);this.setValue(i)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class h extends i{constructor(t,i,e){super(t,i,e,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",t=>{t.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class d extends i{constructor(t,i,e,s,n,l){super(t,i,e,"number"),this._initInput(),this.min(s),this.max(n);const r=void 0!==l;this.step(r?l:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,i=!0){return this._step=t,this._stepExplicit=i,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let i=(t-this._min)/(this._max-this._min);i=Math.max(0,Math.min(i,1)),this.$fill.style.width=100*i+"%"}return this._inputFocused||(this.$input.value=void 0===this._decimals?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id);window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const t=t=>{const i=parseFloat(this.$input.value);isNaN(i)||(this._snapClampSetValue(i+t),this.$input.value=this.getValue())};let i,e,s,n,l,r=!1;const o=t=>{if(r){const s=t.clientX-i,n=t.clientY-e;Math.abs(n)>5?(t.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(s)>5&&a()}if(!r){const i=t.clientY-s;l-=i*this._step*this._arrowKeyMultiplier(t),n+l>this._max?l=this._max-n:n+l<this._min&&(l=this._min-n),this._snapClampSetValue(n+l)}s=t.clientY},a=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",o),window.removeEventListener("mouseup",a)};this.$input.addEventListener("input",()=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._stepExplicit&&(t=this._snap(t)),this.setValue(this._clamp(t)))}),this.$input.addEventListener("keydown",i=>{"Enter"===i.key&&this.$input.blur(),"ArrowUp"===i.code&&(i.preventDefault(),t(this._step*this._arrowKeyMultiplier(i))),"ArrowDown"===i.code&&(i.preventDefault(),t(this._step*this._arrowKeyMultiplier(i)*-1))}),this.$input.addEventListener("wheel",i=>{this._inputFocused&&(i.preventDefault(),t(this._step*this._normalizeMouseWheel(i)))},{passive:!1}),this.$input.addEventListener("mousedown",t=>{i=t.clientX,e=s=t.clientY,r=!0,n=this.getValue(),l=0,window.addEventListener("mousemove",o),window.addEventListener("mouseup",a)}),this.$input.addEventListener("focus",()=>{this._inputFocused=!0}),this.$input.addEventListener("blur",()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=t=>{const i=this.$slider.getBoundingClientRect();let e=(s=t,n=i.left,l=i.right,r=this._min,o=this._max,(s-n)/(l-n)*(o-r)+r);var s,n,l,r,o;this._snapClampSetValue(e)},i=i=>{t(i.clientX)},e=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",e)};let s,n,l=!1;const r=i=>{i.preventDefault(),this._setDraggingStyle(!0),t(i.touches[0].clientX),l=!1},o=i=>{if(l){const t=i.touches[0].clientX-s,e=i.touches[0].clientY-n;Math.abs(t)>Math.abs(e)?r(i):(window.removeEventListener("touchmove",o),window.removeEventListener("touchend",a))}else i.preventDefault(),t(i.touches[0].clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",o),window.removeEventListener("touchend",a)},h=this._callOnFinishChange.bind(this);let d;this.$slider.addEventListener("mousedown",s=>{this._setDraggingStyle(!0),t(s.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",e)}),this.$slider.addEventListener("touchstart",t=>{t.touches.length>1||(this._hasScrollBar?(s=t.touches[0].clientX,n=t.touches[0].clientY,l=!0):r(t),window.addEventListener("touchmove",o,{passive:!1}),window.addEventListener("touchend",a))},{passive:!1}),this.$slider.addEventListener("wheel",t=>{if(Math.abs(t.deltaX)<Math.abs(t.deltaY)&&this._hasScrollBar)return;t.preventDefault();const i=this._normalizeMouseWheel(t)*this._step;this._snapClampSetValue(this.getValue()+i),this.$input.value=this.getValue(),clearTimeout(d),d=setTimeout(h,400)},{passive:!1})}_setDraggingStyle(t,i="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle("lil-gui-"+i,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:i,deltaY:e}=t;Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(i=0,e=-t.wheelDelta/120,e*=this._stepExplicit?1:10);return i+-e}_arrowKeyMultiplier(t){let i=this._stepExplicit?1:10;return t.shiftKey?i*=10:t.altKey&&(i/=10),i}_snap(t){const i=Math.round(t/this._step)*this._step;return parseFloat(i.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return void 0!==this._min}get _hasMax(){return void 0!==this._max}}class c extends i{constructor(t,i,e,s){super(t,i,e,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(t=>{const i=document.createElement("option");i.textContent=t,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),i=this._values.indexOf(t);return this.$select.selectedIndex=i,this.$display.textContent=-1===i?t:this._names[i],this}}class u extends i{constructor(t,i,e){super(t,i,e,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",t=>{"Enter"===t.code&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}let p=!1;class g{constructor({parent:t,autoPlace:i=void 0===t,container:e,width:s,title:n="Controls",closeFolders:l=!1,injectStyles:r=!0,touchStyles:o=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",t=>{"Enter"!==t.code&&"Space"!==t.code||(t.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(n),this.parent)return this.parent.children.push(this),this.parent.folders.push(this),void this.parent.$children.appendChild(this.domElement);this.domElement.classList.add("root"),o&&this.domElement.classList.add("allow-touch-styles"),!p&&r&&(!function(t){const i=document.createElement("style");i.innerHTML=t;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(i,e):document.head.appendChild(i)}('.lil-gui{--background-color:#1f1f1f;--text-color:#ebebeb;--title-background-color:#111;--title-text-color:#ebebeb;--widget-color:#424242;--hover-color:#4f4f4f;--focus-color:#595959;--number-color:#2cc9ff;--string-color:#a2db3c;--font-size:11px;--input-font-size:11px;--font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;--font-family-mono:Menlo,Monaco,Consolas,"Droid Sans Mono",monospace;--padding:4px;--spacing:4px;--widget-height:20px;--title-height:calc(var(--widget-height) + var(--spacing)*1.25);--name-width:45%;--slider-knob-width:2px;--slider-input-width:27%;--color-input-width:27%;--slider-input-min-width:45px;--color-input-min-width:45px;--folder-indent:7px;--widget-padding:0 0 0 3px;--widget-border-radius:2px;--checkbox-size:calc(var(--widget-height)*0.75);--scrollbar-width:5px;color:var(--text-color);font-family:var(--font-family);font-size:var(--font-size);font-style:normal;font-weight:400;line-height:1;text-align:left;touch-action:manipulation;user-select:none;-webkit-user-select:none}.lil-gui,.lil-gui *{box-sizing:border-box;margin:0;padding:0}.lil-gui.root{background:var(--background-color);display:flex;flex-direction:column;width:var(--width,245px)}.lil-gui.root>.title{background:var(--title-background-color);color:var(--title-text-color)}.lil-gui.root>.children{overflow-x:hidden;overflow-y:auto}.lil-gui.root>.children::-webkit-scrollbar{background:var(--background-color);height:var(--scrollbar-width);width:var(--scrollbar-width)}.lil-gui.root>.children::-webkit-scrollbar-thumb{background:var(--focus-color);border-radius:var(--scrollbar-width)}.lil-gui.force-touch-styles,.lil-gui.force-touch-styles .lil-gui{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}.lil-gui.autoPlace{max-height:100%;position:fixed;right:15px;top:0;z-index:1001}.lil-gui .controller{align-items:center;display:flex;margin:var(--spacing) 0;padding:0 var(--padding)}.lil-gui .controller.disabled{opacity:.5}.lil-gui .controller.disabled,.lil-gui .controller.disabled *{pointer-events:none!important}.lil-gui .controller>.name{flex-shrink:0;line-height:var(--widget-height);min-width:var(--name-width);padding-right:var(--spacing);white-space:pre}.lil-gui .controller .widget{align-items:center;display:flex;min-height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.string input{color:var(--string-color)}.lil-gui .controller.boolean{cursor:pointer}.lil-gui .controller.color .display{border-radius:var(--widget-border-radius);height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.color input[type=color]{cursor:pointer;height:100%;opacity:0;width:100%}.lil-gui .controller.color input[type=text]{flex-shrink:0;font-family:var(--font-family-mono);margin-left:var(--spacing);min-width:var(--color-input-min-width);width:var(--color-input-width)}.lil-gui .controller.option select{max-width:100%;opacity:0;position:absolute;width:100%}.lil-gui .controller.option .display{background:var(--widget-color);border-radius:var(--widget-border-radius);height:var(--widget-height);line-height:var(--widget-height);max-width:100%;overflow:hidden;padding-left:.55em;padding-right:1.75em;pointer-events:none;position:relative;word-break:break-all}.lil-gui .controller.option .display.active{background:var(--focus-color)}.lil-gui .controller.option .display:after{bottom:0;content:"↕";font-family:lil-gui;padding-right:.375em;position:absolute;right:0;top:0}.lil-gui .controller.option .widget,.lil-gui .controller.option select{cursor:pointer}.lil-gui .controller.number input{color:var(--number-color)}.lil-gui .controller.number.hasSlider input{flex-shrink:0;margin-left:var(--spacing);min-width:var(--slider-input-min-width);width:var(--slider-input-width)}.lil-gui .controller.number .slider{background:var(--widget-color);border-radius:var(--widget-border-radius);cursor:ew-resize;height:var(--widget-height);overflow:hidden;padding-right:var(--slider-knob-width);touch-action:pan-y;width:100%}.lil-gui .controller.number .slider.active{background:var(--focus-color)}.lil-gui .controller.number .slider.active .fill{opacity:.95}.lil-gui .controller.number .fill{border-right:var(--slider-knob-width) solid var(--number-color);box-sizing:content-box;height:100%}.lil-gui-dragging .lil-gui{--hover-color:var(--widget-color)}.lil-gui-dragging *{cursor:ew-resize!important}.lil-gui-dragging.lil-gui-vertical *{cursor:ns-resize!important}.lil-gui .title{-webkit-tap-highlight-color:transparent;text-decoration-skip:objects;cursor:pointer;font-weight:600;height:var(--title-height);line-height:calc(var(--title-height) - 4px);outline:none;padding:0 var(--padding)}.lil-gui .title:before{content:"▾";display:inline-block;font-family:lil-gui;padding-right:2px}.lil-gui .title:active{background:var(--title-background-color);opacity:.75}.lil-gui.root>.title:focus{text-decoration:none!important}.lil-gui.closed>.title:before{content:"▸"}.lil-gui.closed>.children{opacity:0;transform:translateY(-7px)}.lil-gui.closed:not(.transition)>.children{display:none}.lil-gui.transition>.children{overflow:hidden;pointer-events:none;transition-duration:.3s;transition-property:height,opacity,transform;transition-timing-function:cubic-bezier(.2,.6,.35,1)}.lil-gui .children:empty:before{content:"Empty";display:block;font-style:italic;height:var(--widget-height);line-height:var(--widget-height);margin:var(--spacing) 0;opacity:.5;padding:0 var(--padding)}.lil-gui.root>.children>.lil-gui>.title{border-width:0;border-bottom:1px solid var(--widget-color);border-left:0 solid var(--widget-color);border-right:0 solid var(--widget-color);border-top:1px solid var(--widget-color);transition:border-color .3s}.lil-gui.root>.children>.lil-gui.closed>.title{border-bottom-color:transparent}.lil-gui+.controller{border-top:1px solid var(--widget-color);margin-top:0;padding-top:var(--spacing)}.lil-gui .lil-gui .lil-gui>.title{border:none}.lil-gui .lil-gui .lil-gui>.children{border:none;border-left:2px solid var(--widget-color);margin-left:var(--folder-indent)}.lil-gui .lil-gui .controller{border:none}.lil-gui button,.lil-gui input,.lil-gui label{-webkit-tap-highlight-color:transparent}.lil-gui input{background:var(--widget-color);border:0;border-radius:var(--widget-border-radius);color:var(--text-color);font-family:var(--font-family);font-size:var(--input-font-size);height:var(--widget-height);outline:none;width:100%}.lil-gui input:disabled{opacity:1}.lil-gui input[type=number],.lil-gui input[type=text]{-moz-appearance:textfield;padding:var(--widget-padding)}.lil-gui input[type=number]:focus,.lil-gui input[type=text]:focus{background:var(--focus-color)}.lil-gui input[type=checkbox]{appearance:none;border-radius:var(--widget-border-radius);cursor:pointer;height:var(--checkbox-size);text-align:center;width:var(--checkbox-size)}.lil-gui input[type=checkbox]:checked:before{content:"✓";font-family:lil-gui;font-size:var(--checkbox-size);line-height:var(--checkbox-size)}.lil-gui button{background:var(--widget-color);border:none;border-radius:var(--widget-border-radius);color:var(--text-color);cursor:pointer;font-family:var(--font-family);font-size:var(--font-size);height:var(--widget-height);outline:none;text-transform:none;width:100%}.lil-gui button:active{background:var(--focus-color)}@font-face{font-family:lil-gui;src:url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff")}@media (pointer:coarse){.lil-gui.allow-touch-styles,.lil-gui.allow-touch-styles .lil-gui{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}}@media (hover:hover){.lil-gui .controller.color .display:hover:before{border:1px solid #fff9;border-radius:var(--widget-border-radius);bottom:0;content:" ";display:block;left:0;position:absolute;right:0;top:0}.lil-gui .controller.option .display.focus{background:var(--focus-color)}.lil-gui .controller.number .slider:hover,.lil-gui .controller.option .widget:hover .display{background:var(--hover-color)}body:not(.lil-gui-dragging) .lil-gui .title:hover{background:var(--title-background-color);opacity:.85}.lil-gui .title:focus{text-decoration:underline var(--focus-color)}.lil-gui input:hover{background:var(--hover-color)}.lil-gui input:active{background:var(--focus-color)}.lil-gui input[type=checkbox]:focus{box-shadow:inset 0 0 0 1px var(--focus-color)}.lil-gui button:hover{background:var(--hover-color)}.lil-gui button:focus{box-shadow:inset 0 0 0 1px var(--focus-color)}}'),p=!0),e?e.appendChild(this.domElement):i&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=l}add(t,i,s,n,l){if(Object(s)===s)return new c(this,t,i,s);const r=t[i];switch(typeof r){case"number":return new d(this,t,i,s,n,l);case"boolean":return new e(this,t,i);case"string":return new u(this,t,i);case"function":return new h(this,t,i)}console.error("gui.add failed\n\tproperty:",i,"\n\tobject:",t,"\n\tvalue:",r)}addColor(t,i,e=1){return new a(this,t,i,e)}addFolder(t){const i=new g({parent:this,title:t});return this.root._closeFolders&&i.close(),i}load(t,i=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof h||i._name in t.controllers&&i.load(t.controllers[i._name])}),i&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const i={controllers:{},folders:{}};return this.controllers.forEach(t=>{if(!(t instanceof h)){if(t._name in i.controllers)throw new Error(`Cannot save GUI with duplicate property "${t._name}"`);i.controllers[t._name]=t.save()}}),t&&this.folders.forEach(t=>{if(t._title in i.folders)throw new Error(`Cannot save GUI with duplicate folder "${t._title}"`);i.folders[t._title]=t.save()}),i}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const i=this.$children.clientHeight;this.$children.style.height=i+"px",this.domElement.classList.add("transition");const e=t=>{t.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",e))};this.$children.addEventListener("transitionend",e);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(t=>t.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),void 0!==this._onChange&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),void 0!==this._onFinishChange&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),void 0!==this._onOpenClose&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(i=>{t=t.concat(i.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(i=>{t=t.concat(i.foldersRecursive())}),t}}t.BooleanController=e,t.ColorController=a,t.Controller=i,t.FunctionController=h,t.GUI=g,t.NumberController=d,t.OptionController=c,t.StringController=u,t.default=g,Object.defineProperty(t,"__esModule",{value:!0})}));


(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('设置面板核心扩展需要在非沙盒模式下运行');
  }

  class SettingsPanelCoreExtension {
    constructor() {
      this.panels = {};
      this.panelData = {};
      this.controllers = {};
      this.folders = {};
      this.propertyMeta = {};
      this.decorations = {};
      this.panelMeta = {};

      this.changedEventsMap = new Map();
      this.buttonEventsMap = new Map();

      this._mobileStyleInjected = false;
      this._viewportBound = false;
      this._boundViewportHandler = this._handleViewportChange.bind(this);

      this._pendingClamp = new Set();
      this._clampScheduled = false;

      this._styleMeta = {
        globalCssText: ''
      };

      this._initBridge();
    }

    _initBridge() {
      const self = this;

      window.SettingsPanelBridge = {
        version: '1.0.0',
        source: 'settingspanelcore',

        hasPanel(name) {
          return !!self.panels[String(name)];
        },

        getPanel(name) {
          return self.panels[String(name)] || null;
        },

        getPanelData(name) {
          return self.panelData[String(name)] || null;
        },

        getController(name, prop) {
          name = String(name);
          prop = String(prop);
          return self.controllers[name] ? self.controllers[name][prop] || null : null;
        },

        getPropertyMeta(name, prop) {
          name = String(name);
          prop = String(prop);
          return self.propertyMeta[name] ? self.propertyMeta[name][prop] || null : null;
        },

        getPanelChildrenContainer(name) {
          return self._getPanelChildrenContainer(String(name));
        },

        getPanelTitleElement(name) {
          return self._getPanelTitleElement(String(name));
        },

        ensureStructures(name) {
          self._ensureStructures(String(name));
        },

        ensureProperty(name, prop, defaultValue, meta = {}) {
          return self._initProperty(String(name), String(prop), defaultValue, meta);
        },

        setPropertyValue(name, prop, value, emitEvent = true) {
          return self._setValue(String(name), String(prop), value, { emitEvent });
        },

        getPropertyValue(name, prop) {
          name = String(name);
          prop = String(prop);
          if (!self.panelData[name]) return '';
          return self.panelData[name][prop];
        },

        emitPropertyChanged(name, prop) {
          self._queuePropertyChanged(String(name), String(prop));
        },

        emitButtonClicked(name, prop) {
          self._queueButtonClicked(String(name), String(prop));
        },

        injectElement(name, prop, el, options = {}) {
          return self._bridgeInjectElement(String(name), prop == null ? '' : String(prop), el, options);
        },

        registerController(name, prop, wrapped) {
          name = String(name);
          prop = String(prop);
          self._ensureStructures(name);
          self.controllers[name][prop] = wrapped;
          return wrapped;
        },

        unregisterController(name, prop) {
          name = String(name);
          prop = String(prop);
          if (self.controllers[name] && self.controllers[name][prop]) {
            delete self.controllers[name][prop];
          }
        },

        removeProperty(name, prop) {
          self._removePropertyInternal(String(name), String(prop));
        },

        scheduleClamp(name) {
          self._scheduleClamp(String(name));
        },

        setPanelCss(name, cssText) {
          self._setPanelCss(String(name), String(cssText || ''));
        },

        appendPanelCss(name, cssText) {
          self._appendPanelCss(String(name), String(cssText || ''));
        }
      };
    }

    getInfo() {
      return {
        id: 'settingspanelcore',
        name: '设置面板核心',
        color1: '#4C97FF',
        color2: '#3373CC',
        blocks: [
          {
            opcode: 'createPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建核心面板 [NAME] 位于 [POS]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              POS: { type: Scratch.ArgumentType.STRING, menu: 'positions', defaultValue: 'top-right' }
            }
          },
          '---',
          {
            opcode: 'addString',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加字符串 [PROP] 默认值 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' }
            }
          },
          {
            opcode: 'addNumber',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加数字 [PROP] 默认值 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'num' },
              VAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'addSlider',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加滑块 [PROP] 默认值 [VAL] 最小值 [MIN] 最大值 [MAX] 步长 [STEP]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'slider' },
              VAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              STEP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'addBoolean',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加布尔 [PROP] 默认值 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'bool' },
              VAL: { type: Scratch.ArgumentType.STRING, menu: 'booleans', defaultValue: 'true' }
            }
          },
          {
            opcode: 'addDropdown',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加选项 [PROP] 默认值 [VAL] 选项 [OPTIONS]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'option' },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              OPTIONS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"one":1,"two":2,"three":3}' }
            }
          },
          {
            opcode: 'addButton',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加按钮 [PROP]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'button' }
            }
          },
          {
            opcode: 'addColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中添加颜色 [PROP] 默认值 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'color' },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: '#ff0000' }
            }
          },
          '---',
          {
            opcode: 'createFolder',
            blockType: Scratch.BlockType.COMMAND,
            text: '在核心面板 [NAME] 中创建分组 [FOLDER]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              FOLDER: { type: Scratch.ArgumentType.STRING, defaultValue: '高级设置' }
            }
          },
          {
            opcode: 'moveToFolder',
            blockType: Scratch.BlockType.COMMAND,
            text: '移动核心面板 [NAME] 中 [PROP] 到文件夹 [FOLDER]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' },
              FOLDER: { type: Scratch.ArgumentType.STRING, defaultValue: '高级设置' }
            }
          },
          {
            opcode: 'setFolderState',
            blockType: Scratch.BlockType.COMMAND,
            text: '[STATE] 核心面板 [NAME] 的分组 [FOLDER]',
            arguments: {
              STATE: { type: Scratch.ArgumentType.STRING, menu: 'folderStates', defaultValue: 'close' },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              FOLDER: { type: Scratch.ArgumentType.STRING, defaultValue: '高级设置' }
            }
          },
          '---',
          {
            opcode: 'setPropertyValue',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核心面板 [NAME] 属性 [PROP] 的值为 [VAL]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: 'new value' }
            }
          },
          {
            opcode: 'setPropertyDisplayName',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核心面板 [NAME] 属性 [PROP] 显示名称为 [TITLE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '我的变量' }
            }
          },
          {
            opcode: 'setPanelTitle',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核心面板 [NAME] 标题为 [TITLE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '新标题' }
            }
          },
          {
            opcode: 'setPanelStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核心面板 [NAME] 样式 CSS: [CSS]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: 'width:300px;top:50px;' }
            }
          },
          {
            opcode: 'appendPanelCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '追加核心面板 [NAME] CSS [CSS]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: 'box-shadow:0 0 10px #000;' }
            }
          },
          {
            opcode: 'setGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置核心全局CSS为 [CSS]',
            arguments: {
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: '.lil-gui{border-radius:12px;}' }
            }
          },
          {
            opcode: 'appendGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '追加核心全局CSS [CSS]',
            arguments: {
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: '.lil-gui .title{color:#4C97FF;}' }
            }
          },
          {
            opcode: 'clearGlobalCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除核心全局CSS'
          },
          '---',
          {
            opcode: 'getProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: '读取核心面板 [NAME] 的属性 [PROP]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' }
            }
          },
          {
            opcode: 'whenPropertyChanged',
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: true,
            text: '当监听到核心面板 [NAME] 的属性 [PROP] 改变时',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'str' }
            }
          },
          {
            opcode: 'whenButtonClicked',
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: true,
            text: '当监听到核心面板 [NAME] 的按钮 [PROP] 被点击时',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: 'button' }
            }
          },
          '---',
          {
            opcode: 'showPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示核心面板 [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' } }
          },
          {
            opcode: 'hidePanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏核心面板 [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' } }
          },
          {
            opcode: 'destroyPanel',
            blockType: Scratch.BlockType.COMMAND,
            text: '销毁核心面板 [NAME]',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'setting' } }
          }
        ],
        menus: {
          positions: {
            acceptReporters: true,
            items: ['top-right', 'top-left', 'bottom-right', 'bottom-left']
          },
          booleans: {
            acceptReporters: true,
            items: ['true', 'false']
          },
          folderStates: {
            acceptReporters: true,
            items: [
              { text: '展开', value: 'open' },
              { text: '折叠', value: 'close' }
            ]
          }
        }
      };
    }

    async _ensureLibs() {
      if (!window.lil || !window.lil.GUI) {
        throw new Error('lil-gui 未嵌入，请先把 lil-gui 源码粘贴到文件顶部预留位置');
      }
    }

    _warn(msg) {
      console.warn('[SettingsPanelCore]', msg);
    }

    _eventKey(name, prop) {
      return `${String(name)}::${String(prop)}`;
    }

    _safeNamePart(text) {
      return String(text).replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    _panelClassName(name) {
      return `settingspanel-core-panel-${this._safeNamePart(name)}`;
    }

    _panelStyleId(name) {
      return `settingspanel-core-style-panel-${this._safeNamePart(name)}`;
    }

    _emitMapEvent(map, name, prop) {
      const key = this._eventKey(name, prop);
      map.set(key, (map.get(key) || 0) + 1);
    }

    _consumeMapEvent(map, name, prop) {
      const key = this._eventKey(name, prop);
      const count = map.get(key) || 0;
      if (count > 0) {
        if (count === 1) map.delete(key);
        else map.set(key, count - 1);
        return true;
      }
      return false;
    }

    _queuePropertyChanged(name, prop) {
      this._emitMapEvent(this.changedEventsMap, name, prop);
    }

    _queueButtonClicked(name, prop) {
      this._emitMapEvent(this.buttonEventsMap, name, prop);
    }

    _getOrCreateStyleTag(id) {
      let style = document.getElementById(id);
      if (!style) {
        style = document.createElement('style');
        style.id = id;
        document.head.appendChild(style);
      }
      return style;
    }

    _setStyleTagContent(id, cssText) {
      const style = this._getOrCreateStyleTag(id);
      style.textContent = String(cssText || '');
      return style;
    }

    _appendStyleTagContent(id, cssText) {
      const style = this._getOrCreateStyleTag(id);
      style.textContent = (style.textContent || '') + '\n' + String(cssText || '');
      return style;
    }

    _removeStyleTag(id) {
      const style = document.getElementById(id);
      if (style) style.remove();
    }

    _setPanelCss(name, cssText) {
      if (!this.panels[name]) return;
      const selector = `.${this._panelClassName(name)}`;
      this._setStyleTagContent(this._panelStyleId(name), `${selector}{${String(cssText || '')}}`);
    }

    _appendPanelCss(name, cssText) {
      if (!this.panels[name]) return;
      const selector = `.${this._panelClassName(name)}`;
      this._appendStyleTagContent(this._panelStyleId(name), `${selector}{${String(cssText || '')}}`);
    }

    _injectMobileStyle() {
      if (this._mobileStyleInjected) return;
      const style = document.createElement('style');
      style.id = 'settingspanel-core-mobile-style';
      style.textContent = `
        .lil-gui.root.settingspanel-core-mobile-adapt {
          max-width: min(92vw, 360px) !important;
          width: min(92vw, 360px) !important;
          font-size: 14px !important;
          z-index: 9999 !important;
        }
        .lil-gui.root.settingspanel-core-mobile-adapt .title {
          min-height: 38px;
          line-height: 38px;
          font-size: 14px;
          user-select: none;
          -webkit-user-select: none;
        }
        .lil-gui.root.settingspanel-core-mobile-adapt .children {
          max-height: min(65vh, 520px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .lil-gui.root.settingspanel-core-mobile-adapt input,
        .lil-gui.root.settingspanel-core-mobile-adapt select,
        .lil-gui.root.settingspanel-core-mobile-adapt textarea,
        .lil-gui.root.settingspanel-core-mobile-adapt button {
          font-size: 16px !important;
        }
      `;
      document.head.appendChild(style);
      this._mobileStyleInjected = true;
    }

    _bindViewportEvents() {
      if (this._viewportBound) return;
      window.addEventListener('resize', this._boundViewportHandler);
      window.addEventListener('orientationchange', this._boundViewportHandler);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', this._boundViewportHandler);
        window.visualViewport.addEventListener('scroll', this._boundViewportHandler);
      }
      this._viewportBound = true;
    }

    _unbindViewportEventsIfNeeded() {
      if (!this._viewportBound) return;
      if (Object.keys(this.panels).length > 0) return;
      window.removeEventListener('resize', this._boundViewportHandler);
      window.removeEventListener('orientationchange', this._boundViewportHandler);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', this._boundViewportHandler);
        window.visualViewport.removeEventListener('scroll', this._boundViewportHandler);
      }
      this._viewportBound = false;
    }

    _handleViewportChange() {
      for (const name in this.panels) this._scheduleClamp(name);
    }

    _getViewportSize() {
      if (window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height
        };
      }
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    _getViewportOffset() {
      if (window.visualViewport) {
        return {
          left: window.visualViewport.offsetLeft,
          top: window.visualViewport.offsetTop
        };
      }
      return { left: 0, top: 0 };
    }

    _scheduleClamp(name) {
      if (!this.panels[name]) return;
      this._pendingClamp.add(name);
      if (this._clampScheduled) return;
      this._clampScheduled = true;

      requestAnimationFrame(() => {
        this._pendingClamp.forEach(panelName => {
          this._clampPanelToViewport(panelName);
        });
        this._pendingClamp.clear();
        this._clampScheduled = false;
      });
    }

    _ensureStructures(name) {
      if (!this.panelData[name]) this.panelData[name] = {};
      if (!this.controllers[name]) this.controllers[name] = {};
      if (!this.folders[name]) this.folders[name] = {};
      if (!this.propertyMeta[name]) this.propertyMeta[name] = {};
      if (!this.decorations[name]) this.decorations[name] = [];
      if (!this.panelMeta[name]) {
        this.panelMeta[name] = {
          childrenContainer: null,
          titleElement: null
        };
      }
    }

    _getPanelChildrenContainer(name) {
      if (!this.panels[name]) return null;
      if (this.panelMeta[name] && this.panelMeta[name].childrenContainer) {
        return this.panelMeta[name].childrenContainer;
      }
      const el = this.panels[name].domElement.querySelector('.children') || this.panels[name].domElement;
      if (this.panelMeta[name]) this.panelMeta[name].childrenContainer = el;
      return el;
    }

    _getPanelTitleElement(name) {
      if (!this.panels[name]) return null;
      if (this.panelMeta[name] && this.panelMeta[name].titleElement) {
        return this.panelMeta[name].titleElement;
      }
      const el = this.panels[name].domElement.querySelector('.title') || this.panels[name].domElement;
      if (this.panelMeta[name]) this.panelMeta[name].titleElement = el;
      return el;
    }

    _wrapController({ type = 'custom', controller = null, domElement = null, destroy = null, updateDisplay = null, setValue = null, getValue = null, nameFn = null }) {
      return {
        type,
        controller,
        domElement,
        destroy: destroy || (() => {}),
        updateDisplay: updateDisplay || (() => {}),
        setValue: setValue || null,
        getValue: getValue || null,
        name: nameFn || null
      };
    }

    _initProperty(name, prop, defaultValue, meta = {}) {
      if (!this.panels[name]) {
        this._warn(`面板不存在: ${name}`);
        return false;
      }
      this._ensureStructures(name);

      if (this.controllers[name][prop]) {
        this._warn(`属性已存在: ${name}.${prop}`);
        return false;
      }

      this.panelData[name][prop] = defaultValue;
      this.propertyMeta[name][prop] = Object.assign({
        kind: typeof defaultValue,
        folder: null,
        visible: true,
        enabled: true,
        title: prop,
        tooltip: ''
      }, meta);

      return true;
    }

    _findContainerForProperty(name, prop) {
      const meta = this.propertyMeta[name] && this.propertyMeta[name][prop];
      if (meta && meta.folder && this.folders[name] && this.folders[name][meta.folder]) {
        const folderChildren = this.folders[name][meta.folder].domElement.querySelector('.children');
        if (folderChildren) return folderChildren;
      }
      return this._getPanelChildrenContainer(name);
    }

    _placeControllerElement(name, prop) {
      const wrapped = this.controllers[name] && this.controllers[name][prop];
      if (!wrapped || !wrapped.domElement) return;
      const container = this._findContainerForProperty(name, prop);
      if (container) container.appendChild(wrapped.domElement);
    }

    _bridgeInjectElement(name, prop, el, options = {}) {
      if (!this.panels[name]) return null;
      this._ensureStructures(name);

      const target =
        options.folder &&
        this.folders[name] &&
        this.folders[name][options.folder] &&
        this.folders[name][options.folder].domElement.querySelector('.children')
          ? this.folders[name][options.folder].domElement.querySelector('.children')
          : this._getPanelChildrenContainer(name);

      if (!target) return null;
      target.appendChild(el);

      if (options.storeAsController && prop) {
        this.controllers[name][prop] = this._wrapController({
          type: options.type || 'custom',
          domElement: el,
          destroy: () => el.remove(),
          updateDisplay: () => this.controllers[name][prop]
        });
      } else {
        this.decorations[name].push({
          domElement: el,
          destroy: () => el.remove()
        });
      }

      this._scheduleClamp(name);
      return el;
    }

    _safeDestroyController(name, prop) {
      const wrapped = this.controllers[name] && this.controllers[name][prop];
      if (!wrapped) return;

      const domElement = wrapped.domElement;
      if (domElement && domElement.parentNode) {
        try {
          domElement.parentNode.removeChild(domElement);
        } catch (e) {}
      }

      try {
        if (typeof wrapped.destroy === 'function') wrapped.destroy();
      } catch (e) {
        if (domElement && domElement.remove) {
          try { domElement.remove(); } catch (err) {}
        }
      }
    }

    _convertValueByExistingType(oldVal, newVal) {
      if (typeof oldVal === 'number') {
        const n = Number(newVal);
        if (Number.isNaN(n)) return { ok: false, value: oldVal };
        return { ok: true, value: n };
      }
      if (typeof oldVal === 'boolean') {
        if (typeof newVal === 'string') {
          const lower = newVal.trim().toLowerCase();
          if (lower === 'true' || lower === '1') return { ok: true, value: true };
          if (lower === 'false' || lower === '0') return { ok: true, value: false };
          return { ok: false, value: oldVal };
        }
        return { ok: true, value: !!newVal };
      }
      if (typeof oldVal === 'string') {
        return { ok: true, value: String(newVal) };
      }
      return { ok: true, value: newVal };
    }

    _clampPanelToViewport(name) {
      if (!this.panels[name]) return;
      const root = this.panels[name].domElement;
      if (root.style.display === 'none') return;

      const viewport = this._getViewportSize();
      const offset = this._getViewportOffset();

      const maxWidth = Math.min(360, Math.max(220, viewport.width * 0.92));
      root.style.maxWidth = maxWidth + 'px';
      root.style.width = Math.min(root.offsetWidth || maxWidth, maxWidth) + 'px';

      const rect = root.getBoundingClientRect();
      let left = rect.left;
      let top = rect.top;

      let maxLeft = offset.left + viewport.width - root.offsetWidth;
      let maxTop = offset.top + viewport.height - root.offsetHeight;

      if (maxLeft < offset.left) maxLeft = offset.left;
      if (maxTop < offset.top) maxTop = offset.top;

      if (left < offset.left) left = offset.left;
      if (top < offset.top) top = offset.top;
      if (left > maxLeft) left = maxLeft;
      if (top > maxTop) top = maxTop;

      root.style.left = left + 'px';
      root.style.top = top + 'px';
      root.style.right = 'auto';
      root.style.bottom = 'auto';
    }

    async createPanel(args) {
      await this._ensureLibs();

      const name = String(args.NAME);
      if (this.panels[name]) return;

      this._injectMobileStyle();
      this._bindViewportEvents();

      const gui = new window.lil.GUI({ title: name });
      gui.domElement.style.position = 'fixed';
      gui.domElement.style.zIndex = '9999';
      gui.domElement.style.margin = '0';
      gui.domElement.style.maxWidth = 'min(92vw, 360px)';
      gui.domElement.style.width = 'min(92vw, 360px)';
      gui.domElement.classList.add('settingspanel-core-mobile-adapt');
      gui.domElement.classList.add(this._panelClassName(name));
      gui.domElement.dataset.panelId = name;

      if (args.POS === 'top-left') {
        gui.domElement.style.top = '0px';
        gui.domElement.style.left = '0px';
      } else if (args.POS === 'top-right') {
        gui.domElement.style.top = '0px';
        gui.domElement.style.left = Math.max(0, window.innerWidth - Math.min(360, window.innerWidth * 0.92)) + 'px';
      } else if (args.POS === 'bottom-left') {
        gui.domElement.style.left = '0px';
        gui.domElement.style.top = Math.max(0, window.innerHeight - 320) + 'px';
      } else {
        gui.domElement.style.left = Math.max(0, window.innerWidth - Math.min(360, window.innerWidth * 0.92)) + 'px';
        gui.domElement.style.top = Math.max(0, window.innerHeight - 320) + 'px';
      }

      gui.domElement.style.right = 'auto';
      gui.domElement.style.bottom = 'auto';

      this.panels[name] = gui;
      this._ensureStructures(name);
      this._getPanelChildrenContainer(name);
      this._getPanelTitleElement(name);
      this._scheduleClamp(name);
    }

    _createNativeController(name, prop, config = null) {
      let controller;

      if (config && config.type === 'slider') {
        controller = this.panels[name].add(this.panelData[name], prop, config.min, config.max, config.step);
      } else if (config && config.type === 'dropdown') {
        controller = this.panels[name].add(this.panelData[name], prop, config.options);
      } else if (config && config.type === 'color') {
        controller = this.panels[name].addColor(this.panelData[name], prop);
      } else {
        controller = this.panels[name].add(this.panelData[name], prop);
      }

      controller.onChange(() => {
        this._queuePropertyChanged(name, prop);
      });

      const wrapped = this._wrapController({
        type: 'native',
        controller,
        domElement: controller.domElement,
        destroy: () => {
          try {
            controller.destroy();
          } catch (e) {
            if (controller.domElement && controller.domElement.remove) controller.domElement.remove();
          }
        },
        updateDisplay: () => {
          if (typeof controller.updateDisplay === 'function') controller.updateDisplay();
          return wrapped;
        },
        setValue: (value) => {
          this.panelData[name][prop] = value;
          if (typeof controller.updateDisplay === 'function') controller.updateDisplay();
        },
        getValue: () => this.panelData[name][prop],
        nameFn: (title) => controller.name(title)
      });

      this.controllers[name][prop] = wrapped;
      this._placeControllerElement(name, prop);
      this._scheduleClamp(name);
      return wrapped;
    }

    _addProperty(name, prop, defaultValue, config = null) {
      if (!this._initProperty(name, prop, defaultValue, {
        kind: config && config.type ? config.type : typeof defaultValue,
        ...(config || {})
      })) return;
      return this._createNativeController(name, prop, config);
    }

    async addString(args) {
      await this._ensureLibs();
      this._addProperty(String(args.NAME), String(args.PROP), String(args.VAL));
    }

    async addNumber(args) {
      await this._ensureLibs();
      this._addProperty(String(args.NAME), String(args.PROP), Number(args.VAL));
    }

    async addSlider(args) {
      await this._ensureLibs();
      this._addProperty(String(args.NAME), String(args.PROP), Number(args.VAL), {
        type: 'slider',
        min: Number(args.MIN),
        max: Number(args.MAX),
        step: Number(args.STEP)
      });
    }

    async addBoolean(args) {
      await this._ensureLibs();
      this._addProperty(String(args.NAME), String(args.PROP), String(args.VAL) === 'true');
    }

    async addDropdown(args) {
      await this._ensureLibs();

      let optionsObj;
      try {
        optionsObj = JSON.parse(String(args.OPTIONS));
      } catch (e) {
        optionsObj = { 'JSON错误': 'error' };
      }

      let defaultValue = args.VAL;
      const values = Object.values(optionsObj);
      if (!values.includes(defaultValue) && values.includes(Number(defaultValue))) {
        defaultValue = Number(defaultValue);
      }

      this._addProperty(String(args.NAME), String(args.PROP), defaultValue, {
        type: 'dropdown',
        options: optionsObj
      });
    }

    async addButton(args) {
      await this._ensureLibs();

      const name = String(args.NAME);
      const prop = String(args.PROP);
      if (!this._initProperty(name, prop, () => {}, { kind: 'button' })) return;

      this.panelData[name][prop] = () => {
        this._queueButtonClicked(name, prop);
      };

      const controller = this.panels[name].add(this.panelData[name], prop);

      const wrapped = this._wrapController({
        type: 'native',
        controller,
        domElement: controller.domElement,
        destroy: () => {
          try {
            controller.destroy();
          } catch (e) {
            if (controller.domElement && controller.domElement.remove) controller.domElement.remove();
          }
        },
        updateDisplay: () => wrapped,
        getValue: () => '',
        nameFn: (title) => controller.name(title)
      });

      this.controllers[name][prop] = wrapped;
      this._placeControllerElement(name, prop);
      this._scheduleClamp(name);
    }

    async addColor(args) {
      await this._ensureLibs();
      this._addProperty(String(args.NAME), String(args.PROP), String(args.VAL), { type: 'color' });
    }

    async createFolder(args) {
      await this._ensureLibs();

      const name = String(args.NAME);
      const folderName = String(args.FOLDER);
      if (!this.panels[name]) return;
      if (!this.folders[name]) this.folders[name] = {};
      if (this.folders[name][folderName]) return;

      this.folders[name][folderName] = this.panels[name].addFolder(folderName);
      this._scheduleClamp(name);
    }

    moveToFolder(args) {
      const name = String(args.NAME);
      const prop = String(args.PROP);
      const folderName = String(args.FOLDER);

      if (!this.panels[name] || !this.folders[name] || !this.folders[name][folderName]) return;
      const wrapped = this.controllers[name][prop];
      if (!wrapped || !wrapped.domElement) return;

      if (!this.propertyMeta[name][prop]) this.propertyMeta[name][prop] = {};
      this.propertyMeta[name][prop].folder = folderName;

      this._placeControllerElement(name, prop);
      this._scheduleClamp(name);
    }

    setFolderState(args) {
      const name = String(args.NAME);
      const folderName = String(args.FOLDER);

      if (this.folders[name] && this.folders[name][folderName]) {
        if (args.STATE === 'open') this.folders[name][folderName].open();
        else this.folders[name][folderName].close();
        this._scheduleClamp(name);
      }
    }

    _setValue(name, prop, value, { emitEvent = true } = {}) {
      if (!this.panelData[name] || !(prop in this.panelData[name])) return false;

      const current = this.panelData[name][prop];
      if (typeof current === 'function') return false;

      const converted = this._convertValueByExistingType(current, value);
      if (!converted.ok) return false;

      this.panelData[name][prop] = converted.value;

      const wrapped = this.controllers[name][prop];
      if (wrapped) {
        if (typeof wrapped.setValue === 'function') wrapped.setValue(converted.value);
        else if (typeof wrapped.updateDisplay === 'function') wrapped.updateDisplay();
      }

      if (emitEvent) this._queuePropertyChanged(name, prop);
      this._scheduleClamp(name);
      return true;
    }

    setPropertyValue(args) {
      this._setValue(String(args.NAME), String(args.PROP), args.VAL, { emitEvent: true });
    }

    setPropertyDisplayName(args) {
      const name = String(args.NAME);
      const prop = String(args.PROP);
      const wrapped = this.controllers[name] && this.controllers[name][prop];

      if (wrapped && typeof wrapped.name === 'function') {
        wrapped.name(String(args.TITLE));
        if (this.propertyMeta[name] && this.propertyMeta[name][prop]) {
          this.propertyMeta[name][prop].title = String(args.TITLE);
        }
        this._scheduleClamp(name);
      }
    }

    setPanelTitle(args) {
      const name = String(args.NAME);
      const title = String(args.TITLE);

      if (this.panels[name]) {
        const titleEl = this._getPanelTitleElement(name);
        if (titleEl) titleEl.textContent = title;
      }
    }

    setPanelStyle(args) {
      const name = String(args.NAME);
      const css = String(args.CSS || '');
      if (!this.panels[name]) return;
      this._setPanelCss(name, css);
      this._scheduleClamp(name);
    }

    appendPanelCSS(args) {
      const name = String(args.NAME);
      const css = String(args.CSS || '');
      if (!this.panels[name]) return;
      this._appendPanelCss(name, css);
      this._scheduleClamp(name);
    }

    setGlobalCSS(args) {
      const css = String(args.CSS || '');
      this._styleMeta.globalCssText = css;
      this._setStyleTagContent('settingspanel-core-style-global', css);
    }

    appendGlobalCSS(args) {
      const css = String(args.CSS || '');
      this._styleMeta.globalCssText = (this._styleMeta.globalCssText || '') + '\n' + css;
      this._setStyleTagContent('settingspanel-core-style-global', this._styleMeta.globalCssText);
    }

    clearGlobalCSS() {
      this._styleMeta.globalCssText = '';
      this._setStyleTagContent('settingspanel-core-style-global', '');
    }

    getProperty(args) {
      const name = String(args.NAME);
      const prop = String(args.PROP);

      if (this.panelData[name] && prop in this.panelData[name]) {
        const value = this.panelData[name][prop];
        if (typeof value === 'function') return '';
        if (typeof value === 'object' && value !== null) {
          try {
            return JSON.stringify(value);
          } catch (e) {
            return String(value);
          }
        }
        return value;
      }

      return '';
    }

    whenPropertyChanged(args) {
      return this._consumeMapEvent(this.changedEventsMap, args.NAME, args.PROP);
    }

    whenButtonClicked(args) {
      return this._consumeMapEvent(this.buttonEventsMap, args.NAME, args.PROP);
    }

    _removePropertyInternal(name, prop) {
      if (this.controllers[name] && this.controllers[name][prop]) {
        this._safeDestroyController(name, prop);
        delete this.controllers[name][prop];
      }

      if (this.panelData[name] && prop in this.panelData[name]) delete this.panelData[name][prop];
      if (this.propertyMeta[name] && prop in this.propertyMeta[name]) delete this.propertyMeta[name][prop];

      this.changedEventsMap.delete(this._eventKey(name, prop));
      this.buttonEventsMap.delete(this._eventKey(name, prop));

      this._scheduleClamp(name);
    }

    showPanel(args) {
      const name = String(args.NAME);
      if (this.panels[name] && this.panels[name].domElement) {
        this.panels[name].domElement.style.display = '';
        this._scheduleClamp(name);
      }
    }

    hidePanel(args) {
      const name = String(args.NAME);
      if (this.panels[name] && this.panels[name].domElement) {
        this.panels[name].domElement.style.display = 'none';
      }
    }

    destroyPanel(args) {
      const name = String(args.NAME);

      if (this.controllers[name]) {
        const props = Object.keys(this.controllers[name]);
        for (const prop of props) {
          this._safeDestroyController(name, prop);
        }
      }

      if (this.decorations[name]) {
        this.decorations[name].forEach(item => {
          if (item && typeof item.destroy === 'function') item.destroy();
        });
      }

      this._removeStyleTag(this._panelStyleId(name));

      if (this.panels[name]) {
        this.panels[name].destroy();
        delete this.panels[name];
      }

      delete this.panelData[name];
      delete this.controllers[name];
      delete this.folders[name];
      delete this.propertyMeta[name];
      delete this.decorations[name];
      delete this.panelMeta[name];

      Array.from(this.changedEventsMap.keys()).forEach(key => {
        if (key.startsWith(name + '::')) this.changedEventsMap.delete(key);
      });

      Array.from(this.buttonEventsMap.keys()).forEach(key => {
        if (key.startsWith(name + '::')) this.buttonEventsMap.delete(key);
      });

      this._unbindViewportEventsIfNeeded();
    }
  }

  Scratch.extensions.register(new SettingsPanelCoreExtension());
})(Scratch);
