/* @readme
CQScFuseJS
==

这是一个 Scratch 扩展，用于实现简单的模糊搜索。基于 fusejs。
*/
!function(e){"use strict";
/* @license
   以下是 fuse.js 的 LICENSE 协议内容：
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2017 Kirollos Risk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
/** @readme
 * CQScFuse 引用了修改并重新压缩后的 fuse.basic.js （主要的改动是防止其泄露到全局）。
 * 以下是 fuse.js 的自述：
 *
 * Fuse.js v7.1.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2025 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 */const t=(()=>{function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function t(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?e(Object(n),!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):e(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,s(n.key),n)}}function i(e,t,r){return t&&u(e.prototype,t),r&&u(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function o(e,t,r){return(t=s(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e){return function(e){if(Array.isArray(e))return a(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return a(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function s(e){var t=function(e){if("object"!=typeof e||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var r=t.call(e,"string");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==typeof t?t:String(t)}function h(e){return Array.isArray?Array.isArray(e):"[object Array]"===p(e)}var l=1/0;function f(e){return"string"==typeof e}function d(e){return"number"==typeof e}function v(e){return!0===e||!1===e||function(e){return function(e){return"object"===r(e)}(e)&&null!==e}(e)&&"[object Boolean]"==p(e)}function g(e){return null!=e}function y(e){return!e.trim().length}function p(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}var A=Object.prototype.hasOwnProperty,m=function(){function e(t){var r=this;n(this,e),this._keys=[],this._keyMap={};var u=0;t.forEach(function(e){var t=S(e);r._keys.push(t),r._keyMap[t.id]=t,u+=t.weight}),this._keys.forEach(function(e){e.weight/=u})}return i(e,[{key:"get",value:function(e){return this._keyMap[e]}},{key:"keys",value:function(){return this._keys}},{key:"toJSON",value:function(){return JSON.stringify(this._keys)}}]),e}();function S(e){var t=null,r=null,n=null,u=1,i=null;if(f(e)||h(e))n=e,t=C(e),r=F(e);else{if(!A.call(e,"name"))throw new Error("Missing ".concat("name"," property in key"));var o=e.name;if(n=o,A.call(e,"weight")&&(u=e.weight)<=0)throw new Error(function(e){return"Property 'weight' in key '".concat(e,"' must be a positive integer")}(o));t=C(o),r=F(o),i=e.getFn}return{path:t,id:r,weight:u,src:n,getFn:i}}function C(e){return h(e)?e:e.split(".")}function F(e){return h(e)?e.join("."):e}var E={useExtendedSearch:!1,getFn:function(e,t){var r=[],n=!1;return function e(t,u,i){if(g(t))if(u[i]){var o=t[u[i]];if(!g(o))return;if(i===u.length-1&&(f(o)||d(o)||v(o)))r.push(function(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-l?"-0":t}(e)}(o));else if(h(o)){n=!0;for(var c=0,a=o.length;c<a;c+=1)e(o[c],u,i+1)}else u.length&&e(o,u,i+1)}else r.push(t)}(e,f(t)?t.split("."):t,0),n?r:r[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},B=t(t(t(t({},{isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:function(e,t){return e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1}}),{includeMatches:!1,findAllMatches:!1,minMatchCharLength:1}),{location:0,threshold:.6,distance:100}),E),D=/[^ ]+/g,b=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.getFn,u=void 0===r?B.getFn:r,i=t.fieldNormWeight,o=void 0===i?B.fieldNormWeight:i;n(this,e),this.norm=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3,r=new Map,n=Math.pow(10,t);return{get:function(t){var u=t.match(D).length;if(r.has(u))return r.get(u);var i=1/Math.pow(u,.5*e),o=parseFloat(Math.round(i*n)/n);return r.set(u,o),o},clear:function(){r.clear()}}}(o,3),this.getFn=u,this.isCreated=!1,this.setIndexRecords()}return i(e,[{key:"setSources",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.docs=e}},{key:"setIndexRecords",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.records=e}},{key:"setKeys",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.keys=t,this._keysMap={},t.forEach(function(t,r){e._keysMap[t.id]=r})}},{key:"create",value:function(){var e=this;!this.isCreated&&this.docs.length&&(this.isCreated=!0,f(this.docs[0])?this.docs.forEach(function(t,r){e._addString(t,r)}):this.docs.forEach(function(t,r){e._addObject(t,r)}),this.norm.clear())}},{key:"add",value:function(e){var t=this.size();f(e)?this._addString(e,t):this._addObject(e,t)}},{key:"removeAt",value:function(e){this.records.splice(e,1);for(var t=e,r=this.size();t<r;t+=1)this.records[t].i-=1}},{key:"getValueForItemAtKeyId",value:function(e,t){return e[this._keysMap[t]]}},{key:"size",value:function(){return this.records.length}},{key:"_addString",value:function(e,t){if(g(e)&&!y(e)){var r={v:e,i:t,n:this.norm.get(e)};this.records.push(r)}}},{key:"_addObject",value:function(e,t){var r=this,n={i:t,$:{}};this.keys.forEach(function(t,u){var i=t.getFn?t.getFn(e):r.getFn(e,t.path);if(g(i))if(h(i)){for(var o=[],c=[{nestedArrIndex:-1,value:i}];c.length;){var a=c.pop(),s=a.nestedArrIndex,l=a.value;if(g(l))if(f(l)&&!y(l)){var d={v:l,i:s,n:r.norm.get(l)};o.push(d)}else h(l)&&l.forEach(function(e,t){c.push({nestedArrIndex:t,value:e})})}n.$[u]=o}else if(f(i)&&!y(i)){var v={v:i,n:r.norm.get(i)};n.$[u]=v}}),this.records.push(n)}},{key:"toJSON",value:function(){return{keys:this.keys,records:this.records}}}]),e}();function k(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.getFn,u=void 0===n?B.getFn:n,i=r.fieldNormWeight,o=void 0===i?B.fieldNormWeight:i,c=new b({getFn:u,fieldNormWeight:o});return c.setKeys(e.map(S)),c.setSources(t),c.create(),c}function _(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.errors,n=void 0===r?0:r,u=t.currentLocation,i=void 0===u?0:u,o=t.expectedLocation,c=void 0===o?0:o,a=t.distance,s=void 0===a?B.distance:a,h=t.ignoreLocation,l=void 0===h?B.ignoreLocation:h,f=n/e.length;if(l)return f;var d=Math.abs(c-i);return s?f+d/s:d?1:f}var M=32;function x(e){for(var t={},r=0,n=e.length;r<n;r+=1){var u=e.charAt(r);t[u]=(t[u]||0)|1<<n-r-1}return t}var L=String.prototype.normalize?function(e){return e.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,"")}:function(e){return e},w=function(){function e(t){var r=this,u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=u.location,o=void 0===i?B.location:i,c=u.threshold,a=void 0===c?B.threshold:c,s=u.distance,h=void 0===s?B.distance:s,l=u.includeMatches,f=void 0===l?B.includeMatches:l,d=u.findAllMatches,v=void 0===d?B.findAllMatches:d,g=u.minMatchCharLength,y=void 0===g?B.minMatchCharLength:g,p=u.isCaseSensitive,A=void 0===p?B.isCaseSensitive:p,m=u.ignoreDiacritics,S=void 0===m?B.ignoreDiacritics:m,C=u.ignoreLocation,F=void 0===C?B.ignoreLocation:C;if(n(this,e),this.options={location:o,threshold:a,distance:h,includeMatches:f,findAllMatches:v,minMatchCharLength:y,isCaseSensitive:A,ignoreDiacritics:S,ignoreLocation:F},t=A?t:t.toLowerCase(),t=S?L(t):t,this.pattern=t,this.chunks=[],this.pattern.length){var E=function(e,t){r.chunks.push({pattern:e,alphabet:x(e),startIndex:t})},D=this.pattern.length;if(D>M){for(var b=0,k=D%M,_=D-k;b<_;)E(this.pattern.substr(b,M),b),b+=M;if(k){var w=D-M;E(this.pattern.substr(w),w)}}else E(this.pattern,0)}}return i(e,[{key:"searchIn",value:function(e){var t=this.options,r=t.isCaseSensitive,n=t.ignoreDiacritics,u=t.includeMatches;if(e=r?e:e.toLowerCase(),e=n?L(e):e,this.pattern===e){var i={isMatch:!0,score:0};return u&&(i.indices=[[0,e.length-1]]),i}var o=this.options,a=o.location,s=o.distance,h=o.threshold,l=o.findAllMatches,f=o.minMatchCharLength,d=o.ignoreLocation,v=[],g=0,y=!1;this.chunks.forEach(function(t){var r=t.pattern,n=t.alphabet,i=t.startIndex,o=function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},u=n.location,i=void 0===u?B.location:u,o=n.distance,c=void 0===o?B.distance:o,a=n.threshold,s=void 0===a?B.threshold:a,h=n.findAllMatches,l=void 0===h?B.findAllMatches:h,f=n.minMatchCharLength,d=void 0===f?B.minMatchCharLength:f,v=n.includeMatches,g=void 0===v?B.includeMatches:v,y=n.ignoreLocation,p=void 0===y?B.ignoreLocation:y;if(t.length>M)throw new Error("Pattern length exceeds max of ".concat(M,"."));for(var A,m=t.length,S=e.length,C=Math.max(0,Math.min(i,S)),F=s,E=C,D=d>1||g,b=D?Array(S):[];(A=e.indexOf(t,E))>-1;){var k=_(t,{currentLocation:A,expectedLocation:C,distance:c,ignoreLocation:p});if(F=Math.min(k,F),E=A+m,D)for(var x=0;x<m;)b[A+x]=1,x+=1}E=-1;for(var L=[],w=1,I=m+S,j=1<<m-1,R=0;R<m;R+=1){for(var N=0,O=I;N<O;)_(t,{errors:R,currentLocation:C+O,expectedLocation:C,distance:c,ignoreLocation:p})<=F?N=O:I=O,O=Math.floor((I-N)/2+N);I=O;var P=Math.max(1,C-O+1),z=l?S:Math.min(C+O,S)+m,T=Array(z+2);T[z+1]=(1<<R)-1;for(var $=z;$>=P;$-=1){var W=$-1,K=r[e.charAt(W)];if(D&&(b[W]=+!!K),T[$]=(T[$+1]<<1|1)&K,R&&(T[$]|=(L[$+1]|L[$])<<1|1|L[$+1]),T[$]&j&&(w=_(t,{errors:R,currentLocation:W,expectedLocation:C,distance:c,ignoreLocation:p}))<=F){if(F=w,(E=W)<=C)break;P=Math.max(1,2*C-E)}}if(_(t,{errors:R+1,currentLocation:C,expectedLocation:C,distance:c,ignoreLocation:p})>F)break;L=T}var G={isMatch:E>=0,score:Math.max(.001,w)};if(D){var V=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:B.minMatchCharLength,r=[],n=-1,u=-1,i=0,o=e.length;i<o;i+=1){var c=e[i];c&&-1===n?n=i:c||-1===n||((u=i-1)-n+1>=t&&r.push([n,u]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}(b,d);V.length?g&&(G.indices=V):G.isMatch=!1}return G}(e,r,n,{location:a+i,distance:s,threshold:h,findAllMatches:l,minMatchCharLength:f,includeMatches:u,ignoreLocation:d}),p=o.isMatch,A=o.score,m=o.indices;p&&(y=!0),g+=A,p&&m&&(v=[].concat(c(v),c(m)))});var p={isMatch:y,score:y?g/this.chunks.length:1};return y&&u&&(p.indices=v),p}}]),e}(),I=[];function j(e,t){for(var r=0,n=I.length;r<n;r+=1){var u=I[r];if(u.condition(e,t))return new u(e,t)}return new w(e,t)}function R(e,t){var r=e.matches;t.matches=[],g(r)&&r.forEach(function(e){if(g(e.indices)&&e.indices.length){var r={indices:e.indices,value:e.value};e.key&&(r.key=e.key.src),e.idx>-1&&(r.refIndex=e.idx),t.matches.push(r)}})}function N(e,t){t.score=e.score}var O=function(){function e(r){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2?arguments[2]:void 0;if(n(this,e),this.options=t(t({},B),u),this.options.useExtendedSearch)throw new Error("Extended search is not available");this._keyStore=new m(this.options.keys),this.setCollection(r,i)}return i(e,[{key:"setCollection",value:function(e,t){if(this._docs=e,t&&!(t instanceof b))throw new Error("Incorrect 'index' type");this._myIndex=t||k(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}},{key:"add",value:function(e){g(e)&&(this._docs.push(e),this._myIndex.add(e))}},{key:"remove",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return!1},t=[],r=0,n=this._docs.length;r<n;r+=1){var u=this._docs[r];e(u,r)&&(this.removeAt(r),r-=1,n-=1,t.push(u))}return t}},{key:"removeAt",value:function(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}},{key:"getIndex",value:function(){return this._myIndex}},{key:"search",value:function(e){var t=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).limit,r=void 0===t?-1:t,n=this.options,u=n.includeMatches,i=n.includeScore,o=n.shouldSort,c=n.sortFn,a=n.ignoreFieldNorm,s=f(e)?f(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return function(e,t){var r=t.ignoreFieldNorm,n=void 0===r?B.ignoreFieldNorm:r;e.forEach(function(e){var t=1;e.matches.forEach(function(e){var r=e.key,u=e.norm,i=e.score,o=r?r.weight:null;t*=Math.pow(0===i&&o?Number.EPSILON:i,(o||1)*(n?1:u))}),e.score=t})}(s,{ignoreFieldNorm:a}),o&&s.sort(c),d(r)&&r>-1&&(s=s.slice(0,r)),function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.includeMatches,u=void 0===n?B.includeMatches:n,i=r.includeScore,o=void 0===i?B.includeScore:i,c=[];return u&&c.push(R),o&&c.push(N),e.map(function(e){var r=e.idx,n={item:t[r],refIndex:r};return c.length&&c.forEach(function(t){t(e,n)}),n})}(s,this._docs,{includeMatches:u,includeScore:i})}},{key:"_searchStringList",value:function(e){var t=j(e,this.options),r=this._myIndex.records,n=[];return r.forEach(function(e){var r=e.v,u=e.i,i=e.n;if(g(r)){var o=t.searchIn(r),c=o.isMatch,a=o.score,s=o.indices;c&&n.push({item:r,idx:u,matches:[{score:a,value:r,norm:i,indices:s}]})}}),n}},{key:"_searchLogical",value:function(e){throw new Error("Logical search is not available")}},{key:"_searchObjectList",value:function(e){var t=this,r=j(e,this.options),n=this._myIndex,u=n.keys,i=n.records,o=[];return i.forEach(function(e){var n=e.$,i=e.i;if(g(n)){var a=[];u.forEach(function(e,u){a.push.apply(a,c(t._findMatches({key:e,value:n[u],searcher:r})))}),a.length&&o.push({idx:i,item:n,matches:a})}}),o}},{key:"_findMatches",value:function(e){var t=e.key,r=e.value,n=e.searcher;if(!g(r))return[];var u=[];if(h(r))r.forEach(function(e){var r=e.v,i=e.i,o=e.n;if(g(r)){var c=n.searchIn(r),a=c.isMatch,s=c.score,h=c.indices;a&&u.push({score:s,key:t,value:r,idx:i,norm:o,indices:h})}});else{var i=r.v,o=r.n,c=n.searchIn(i),a=c.isMatch,s=c.score,l=c.indices;a&&u.push({score:s,key:t,value:i,norm:o,indices:l})}return u}}]),e}();return O.version="7.1.0",O.createIndex=k,O.parseIndex=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.getFn,n=void 0===r?B.getFn:r,u=t.fieldNormWeight,i=void 0===u?B.fieldNormWeight:u,o=e.keys,c=e.records,a=new b({getFn:n,fieldNormWeight:i});return a.setKeys(o),a.setIndexRecords(c),a},O.config=B,O})();!function(e){const r="cqscfusejs",n="v0.0.0",u="模糊搜索 - fusejs for scratch",i=e.vm.runtime,o=e.Cast;i.gandi;if(!e.extensions.unsandboxed){const e=`⚠️加载扩展“${u}”时出现错误：该扩展必须在非沙盒模式下运行，但未检测到非沙盒模式。该扩展及该作品可能无法正常运行。（${r}-${n}）`;console.error(e),alert(e)}const c={"zh-cn":{cf_SExtName:"🔍模糊搜索",cf_SSearchFromList:"从列表 [listId] 中模糊搜索 [keyword]",cf_SNoListPleaseCreate:"-- 请先创建列表 --",cf_SSearchResult:"第 [index] 个模糊搜索结果的 [key]",cf_SSearchResultItem:"文本",cf_SSearchResultRefIndex:"编号",cf_SSearchResultScore:"匹配度",cf_SSearchResultLen:"模糊搜索到的结果数量",cf_SDefaultKeyword:"苹果"},en:{cf_SExtName:"🔍Fuzzy Search",cf_SSearchFromList:"fuzzy search [keyword] in list [listId]",cf_SNoListPleaseCreate:"-- please create a list first --",cf_SSearchResult:"[key] of fuzzy search result # [index]",cf_SSearchResultItem:"item",cf_SSearchResultRefIndex:"index",cf_SSearchResultScore:"match score",cf_SSearchResultLen:"length of fuzzy search results",cf_SDefaultKeyword:"apple"}};function a(t){return e.translate({id:t,default:c["zh-cn"][t]})}e.translate.setup(c);let s=[];e.extensions.register(new class{getInfo(){return{id:r,name:a("cf_SExtName"),color1:"#7a29a3",color2:"#622183",color3:"#491862",blocks:[{opcode:"cf_BSearchFromList",blockType:"command",text:a("cf_SSearchFromList"),arguments:{listId:{type:e.ArgumentType.STRING,menu:"cf_MScratchLists"},keyword:{type:e.ArgumentType.STRING,defaultValue:a("cf_SDefaultKeyword")}}},{opcode:"cf_BSearchResult",blockType:"reporter",text:a("cf_SSearchResult"),arguments:{index:{type:e.ArgumentType.NUMBER,defaultValue:1},key:{type:e.ArgumentType.STRING,menu:"cf_MSearchResultKey"}}},{opcode:"cf_BSearchResultLen",blockType:"reporter",text:a("cf_SSearchResultLen"),disableMonitor:!0}],menus:{cf_MScratchLists:{acceptReporters:!1,items:"cf_GMScratchLists"},cf_MSearchResultKey:{acceptReporters:!1,items:[{text:a("cf_SSearchResultItem"),value:"item"},{text:a("cf_SSearchResultRefIndex"),value:"index"},{text:a("cf_SSearchResultScore"),value:"score"}]}}}}cf_GMScratchLists(e){const t=[],r=e=>{"list"===e.type&&t.push({text:e.name,value:e.id})};for(const e in i.targets[0].variables)r(i.targets[0].variables[e]);if("string"==typeof e){const t=function(e){for(const t of i.targets)if(t.id===e)return t;return null}(e);if(null!==t)for(const e in t.variables)r(t.variables[e])}return 0===t.length&&t.push(a("cf_SNoListPleaseCreate")),t}cf_BSearchFromList(e,r){const n=o.toString(e.listId),u=o.toString(e.keyword),c=e=>{const r=e?.type,n=e?.value;return"list"===r&&Array.isArray(n)?new t(n.map(e=>o.toString(e)),{includeScore:!0}).search(u):null};s=c(r?.target?.lookupVariableById(n))??c(i.targets[0].lookupVariableById(n))??[]}cf_BSearchResult(e){const t=o.toNumber(e.index),r=o.toString(e.key),n=s[t-1];return"item"===r?n?.item??"":"index"===r?n?n.refIndex+1:0:"score"===r?void 0===n?-2:void 0===n.score?-1:1-n.score:""}cf_BSearchResultLen(){return s.length}}),console.log(`=== ${u} ${n} ===\n扩展已加载。\n本扩展引用了 fuse.js：\nFuse.js v7.1.0 - Lightweight fuzzy-search (http://fusejs.io)\n\nCopyright (c) 2025 Kiro Risk (http://kiro.me)\nAll Rights Reserved. Apache Software License 2.0\nhttp://www.apache.org/licenses/LICENSE-2.0\n=== ${u} ${n} ===`)}(e)}(Scratch);