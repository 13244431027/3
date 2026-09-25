/*!
 
 依赖与致谢

- 原项目“白猫的markdown” by 白猫 @ CCW
- [markdown-it 15.0.2](https://github.com/markdown-it/markdown-it) — MIT
- [PrismJS 1.29.0](https://prismjs.com/) — MIT
- 参考了 markdown-it-math、markdown-it-mindmap、markdown-it-footnote 等插件的实现思路

许可
markdown-it 15.0.2,PrismJS 1.29.0以及 markdown-it-math、markdown-it-mindmap、markdown-it-footnote，遵循 MIT 许可。请保留原作者及依赖库的版权信息。
原项目“白猫的markdown”已经过原作这同意[见此](https://i.ibb.co/qYnQrWKs/2026-02-01-140821.png)

 */
/*
MIT License

Copyright (c) 2026  yuan @ CCW

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
/*
扩展id大约在10400行之后，或者可以直接搜索`witcat_markdown_extensionId`变量

*/
(function (Scratch) {
  'use strict';

  // ===================== markdown-it 15.0.2 =====================
var markdownItExports = (function () {
/*! markdown-it 15.0.2 https://github.com/markdown-it/markdown-it @license MIT */
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/mdurl/lib/decode.mjs
var decodeCache = {};
function getDecodeCache(exclude) {
	let cache = decodeCache[exclude];
	if (cache) return cache;
	cache = decodeCache[exclude] = [];
	for (let i = 0; i < 128; i++) {
		const ch = String.fromCharCode(i);
		cache.push(ch);
	}
	for (let i = 0; i < exclude.length; i++) {
		const ch = exclude.charCodeAt(i);
		cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
	}
	return cache;
}
function decode$1(string, exclude) {
	if (typeof exclude !== "string") exclude = decode$1.defaultChars;
	const cache = getDecodeCache(exclude);
	return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
		let result = "";
		for (let i = 0, l = seq.length; i < l; i += 3) {
			const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
			if (b1 < 128) {
				result += cache[b1];
				continue;
			}
			if ((b1 & 224) === 192 && i + 3 < l) {
				const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
				if ((b2 & 192) === 128) {
					const chr = b1 << 6 & 1984 | b2 & 63;
					if (chr < 128) result += "  ";
					else result += String.fromCharCode(chr);
					i += 3;
					continue;
				}
			}
			if ((b1 & 240) === 224 && i + 6 < l) {
				const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
				const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
				if ((b2 & 192) === 128 && (b3 & 192) === 128) {
					const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
					if (chr < 2048 || chr >= 55296 && chr <= 57343) result += "   ";
					else result += String.fromCharCode(chr);
					i += 6;
					continue;
				}
			}
			if ((b1 & 248) === 240 && i + 9 < l) {
				const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
				const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
				const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
				if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
					let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
					if (chr < 65536 || chr > 1114111) result += "    ";
					else {
						chr -= 65536;
						result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
					}
					i += 9;
					continue;
				}
			}
			result += " ";
		}
		return result;
	});
}
decode$1.defaultChars = ";/?:@&=+$,#";
decode$1.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var encodeCache = {};
function getEncodeCache(exclude) {
	let cache = encodeCache[exclude];
	if (cache) return cache;
	cache = encodeCache[exclude] = [];
	for (let i = 0; i < 128; i++) {
		const ch = String.fromCharCode(i);
		if (/^[0-9a-z]$/i.test(ch)) cache.push(ch);
		else cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
	}
	for (let i = 0; i < exclude.length; i++) cache[exclude.charCodeAt(i)] = exclude[i];
	return cache;
}
function encode$1(string, exclude, keepEscaped) {
	if (typeof exclude !== "string") {
		keepEscaped = exclude;
		exclude = encode$1.defaultChars;
	}
	if (typeof keepEscaped === "undefined") keepEscaped = true;
	const cache = getEncodeCache(exclude);
	let result = "";
	for (let i = 0, l = string.length; i < l; i++) {
		const code = string.charCodeAt(i);
		if (keepEscaped && code === 37 && i + 2 < l) {
			if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
				result += string.slice(i, i + 3);
				i += 2;
				continue;
			}
		}
		if (code < 128) {
			result += cache[code];
			continue;
		}
		if (code >= 55296 && code <= 57343) {
			if (code >= 55296 && code <= 56319 && i + 1 < l) {
				const nextCode = string.charCodeAt(i + 1);
				if (nextCode >= 56320 && nextCode <= 57343) {
					result += encodeURIComponent(string[i] + string[i + 1]);
					i++;
					continue;
				}
			}
			result += "%EF%BF%BD";
			continue;
		}
		result += encodeURIComponent(string[i]);
	}
	return result;
}
encode$1.defaultChars = ";/?:@&=+$,-_.!~*'()#";
encode$1.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function format(url) {
	let result = "";
	result += url.protocol || "";
	result += url.slashes ? "//" : "";
	result += url.auth ? url.auth + "@" : "";
	if (url.hostname && url.hostname.indexOf(":") !== -1) result += "[" + url.hostname + "]";
	else result += url.hostname || "";
	result += url.port ? ":" + url.port : "";
	result += url.pathname || "";
	result += url.search || "";
	result += url.hash || "";
	return result;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function Url() {
	this.protocol = null;
	this.slashes = null;
	this.auth = null;
	this.port = null;
	this.hostname = null;
	this.hash = null;
	this.search = null;
	this.pathname = null;
}
var protocolPattern = /^([a-z0-9.+-]+:)/i;
var portPattern = /:[0-9]*$/;
var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
var unwise = [
	"{",
	"}",
	"|",
	"\\",
	"^",
	"`"
].concat([
	"<",
	">",
	"\"",
	"`",
	" ",
	"\r",
	"\n",
	"	"
]);
var autoEscape = ["'"].concat(unwise);
var nonHostChars = [
	"%",
	"/",
	"?",
	";",
	"#"
].concat(autoEscape);
var hostEndingChars = [
	"/",
	"?",
	"#"
];
var hostnameMaxLen = 255;
var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
var hostlessProtocol = {
	javascript: true,
	"javascript:": true
};
var slashedProtocol = {
	http: true,
	https: true,
	ftp: true,
	gopher: true,
	file: true,
	"http:": true,
	"https:": true,
	"ftp:": true,
	"gopher:": true,
	"file:": true
};
function urlParse(url, slashesDenoteHost) {
	if (url && url instanceof Url) return url;
	const u = new Url();
	u.parse(url, slashesDenoteHost);
	return u;
}
Url.prototype.parse = function(url, slashesDenoteHost) {
	let lowerProto, hec, slashes;
	let rest = url;
	rest = rest.trim();
	if (!slashesDenoteHost && url.split("#").length === 1) {
		const simplePath = simplePathPattern.exec(rest);
		if (simplePath) {
			this.pathname = simplePath[1];
			if (simplePath[2]) this.search = simplePath[2];
			return this;
		}
	}
	let proto = protocolPattern.exec(rest);
	if (proto) {
		proto = proto[0];
		lowerProto = proto.toLowerCase();
		this.protocol = proto;
		rest = rest.substr(proto.length);
	}
	if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
		slashes = rest.substr(0, 2) === "//";
		if (slashes && !(proto && hostlessProtocol[proto])) {
			rest = rest.substr(2);
			this.slashes = true;
		}
	}
	if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
		let hostEnd = -1;
		for (let i = 0; i < hostEndingChars.length; i++) {
			hec = rest.indexOf(hostEndingChars[i]);
			if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
		}
		let auth, atSign;
		if (hostEnd === -1) atSign = rest.lastIndexOf("@");
		else atSign = rest.lastIndexOf("@", hostEnd);
		if (atSign !== -1) {
			auth = rest.slice(0, atSign);
			rest = rest.slice(atSign + 1);
			this.auth = auth;
		}
		hostEnd = -1;
		for (let i = 0; i < nonHostChars.length; i++) {
			hec = rest.indexOf(nonHostChars[i]);
			if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
		}
		if (hostEnd === -1) hostEnd = rest.length;
		if (rest[hostEnd - 1] === ":") hostEnd--;
		const host = rest.slice(0, hostEnd);
		rest = rest.slice(hostEnd);
		this.parseHost(host);
		this.hostname = this.hostname || "";
		const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!ipv6Hostname) {
			const hostparts = this.hostname.split(/\./);
			for (let i = 0, l = hostparts.length; i < l; i++) {
				const part = hostparts[i];
				if (!part) continue;
				if (!part.match(hostnamePartPattern)) {
					let newpart = "";
					for (let j = 0, k = part.length; j < k; j++) if (part.charCodeAt(j) > 127) newpart += "x";
					else newpart += part[j];
					if (!newpart.match(hostnamePartPattern)) {
						const validParts = hostparts.slice(0, i);
						const notHost = hostparts.slice(i + 1);
						const bit = part.match(hostnamePartStart);
						if (bit) {
							validParts.push(bit[1]);
							notHost.unshift(bit[2]);
						}
						if (notHost.length) rest = notHost.join(".") + rest;
						this.hostname = validParts.join(".");
						break;
					}
				}
			}
		}
		if (this.hostname.length > hostnameMaxLen) this.hostname = "";
		if (ipv6Hostname) this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	}
	const hash = rest.indexOf("#");
	if (hash !== -1) {
		this.hash = rest.substr(hash);
		rest = rest.slice(0, hash);
	}
	const qm = rest.indexOf("?");
	if (qm !== -1) {
		this.search = rest.substr(qm);
		rest = rest.slice(0, qm);
	}
	if (rest) this.pathname = rest;
	if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) this.pathname = "";
	return this;
};
Url.prototype.parseHost = function(host) {
	let port = portPattern.exec(host);
	if (port) {
		port = port[0];
		if (port !== ":") this.port = port.substr(1);
		host = host.substr(0, host.length - port.length);
	}
	if (host) this.hostname = host;
};
//#endregion
//#region node_modules/mdurl/index.mjs
var mdurl_exports = /* @__PURE__ */ __exportAll({
	decode: () => decode$1,
	encode: () => encode$1,
	format: () => format,
	parse: () => urlParse
});
//#endregion
//#region node_modules/uc.micro/build/index.mjs
var build_exports = /* @__PURE__ */ __exportAll({
	Any: () => Any,
	Cc: () => Cc,
	Cf: () => Cf,
	P: () => P,
	S: () => S,
	Z: () => Z
});
var Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var Cc = /[\0-\x1F\x7F-\x9F]/;
var Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
var P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/;
var S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/;
var Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
//#endregion
//#region node_modules/entities/dist/decode-codepoint.js
var decodeMap = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
* @param codePoint Unicode code point to convert.
*/
function replaceCodePoint(codePoint) {
	var _decodeMap$get;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_decodeMap$get = decodeMap.get(codePoint)) !== null && _decodeMap$get !== void 0 ? _decodeMap$get : codePoint;
}
//#endregion
//#region node_modules/entities/dist/internal/decode-shared.js
/**
* Shared base64 decode helper for generated decode data.
* Assumes global atob is available.
* @param input Input string to encode or decode.
*/
function decodeBase64(input) {
	const binary = atob(input);
	const evenLength = binary.length & -2;
	const out = new Uint16Array(evenLength / 2);
	for (let index = 0, outIndex = 0; index < evenLength; index += 2) {
		const lo = binary.charCodeAt(index);
		const hi = binary.charCodeAt(index + 1);
		out[outIndex++] = lo | hi << 8;
	}
	return out;
}
//#endregion
//#region node_modules/entities/dist/generated/decode-data-html.js
/** Packed HTML decode trie data. */
var htmlDecodeTree = /* #__PURE__ */ decodeBase64("QR08ALkAAgH6AYsDNQR2BO0EPgXZBQEGLAbdBxMISQrvCmQLfQurDKQNLw4fD4YPpA+6D/IPAAAAAAAAAAAAAAAAKhBMEY8TmxUWF2EYLBkxGuAa3RsJHDscWR8YIC8jSCSIJcMl6ie3Ku8rEC0CLjoupS7kLgAIRU1hYmNmZ2xtbm9wcnN0dVQAWgBeAGUAaQBzAHcAfgCBAIQAhwCSAJoAoACsALMAbABpAGcAO4DGAMZAUAA7gCYAJkBjAHUAdABlADuAwQDBQHIiZXZlAAJhAAFpeW0AcgByAGMAO4DCAMJAEGRyAADgNdgE3XIAYQB2AGUAO4DAAMBA8CFoYZFj4SFjcgBhZAAAoFMqAAFncIsAjgBvAG4ABGFmAADgNdg43fAlbHlGdW5jdGlvbgCgYSBpAG4AZwA7gMUAxUAAAWNzpACoAHIAAOA12Jzc6SFnbgCgVCJpAGwAZABlADuAwwDDQG0AbAA7gMQAxEAABGFjZWZvcnN1xQDYANoA7QDxAPYA+QD8AAABY3LJAM8AayNzbGFzaAAAoBYidgHTANUAAKDnKmUAZAAAoAYjeQARZIABY3J0AOAA5QDrAGEidXNlAACgNSLuI291bGxpcwCgLCFhAJJjcgAA4DXYBd1wAGYAAOA12Dnd5SF2ZdhiYwDyAOoAbSJwZXEAAKBOIgAHSE9hY2RlZmhpbG9yc3UXARoBHwE6AVIBVQFiAWQBZgGCAakB6QHtAfIBYwB5ACdkUABZADuAqQCpQIABY3B5ACUBKAE1AfUhdGUGYWmg0iJ0KGFsRGlmZmVyZW50aWFsRAAAoEUhbCJleXMAAKAtIQACYWVpb0EBRAFKAU0B8iFvbgxhZABpAGwAO4DHAMdAcgBjAAhhbiJpbnQAAKAwIm8AdAAKYQABZG5ZAV0BaSJsbGEAuGB0I2VyRG90ALdg8gA5AWkAp2NyImNsZQAAAkRNUFRwAXQBeQF9AW8AdAAAoJkiaSJudXMAAKCWIuwhdXMAoJUiaSJtZXMAAKCXIm8AAAFjc4cBlAFrKndpc2VDb250b3VySW50ZWdyYWwAAKAyImUjQ3VybHkAAAFEUZwBpAFvJXVibGVRdW90ZQAAoB0gdSJvdGUAAKAZIAACbG5wdbABtgHNAdgBbwBuAGWgNyIAoHQqgAFnaXQAvAHBAcUB8iJ1ZW50AKBhIm4AdAAAoC8i7yV1ckludGVncmFsAKAuIgABZnLRAdMBAKACIe8iZHVjdACgECJuLnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbAAAoDMi7yFzcwCgLypjAHIAAOA12J7ccABDoNMiYQBwAACgTSKABURKU1phY2VmaW9zAAsCEgIVAhgCGwIsAjQCOQI9AnMCfwNvoEUh9CJyYWhkAKARKWMAeQACZGMAeQAFZGMAeQAPZIABZ3JzACECJQIoAuchZXIAoCEgcgAAoKEhaAB2AACg5CoAAWF5MAIzAvIhb24OYRRkbAB0oAciYQCUY3IAAOA12AfdAAFhZkECawIAAWNtRQJnAvIjaXRpY2FsAAJBREdUUAJUAl8CYwJjInV0ZQC0YG8AdAFZAloC2WJiJGxlQWN1dGUA3WJyImF2ZQBgYGkibGRlANxi7yFuZACgxCJmJWVyZW50aWFsRAAAoEYhcAR9AgAAAAAAAIECjgIAABoDZgAA4DXYO91EoagAhQKJAm8AdAAAoNwgcSJ1YWwAAKBQIuIhbGUAA0NETFJVVpkCqAK1Au8C/wIRA28AbgB0AG8AdQByAEkAbgB0AGUAZwByAGEA7ADEAW8AdAKvAgAAAACwAqhgbiNBcnJvdwAAoNMhAAFlb7kC0AJmAHQAgAFBUlQAwQLGAs0CciJyb3cAAKDQIekkZ2h0QXJyb3cAoNQhZQDlACsCbgBnAAABTFLWAugC5SFmdAABQVLcAuECciJyb3cAAKD4J+kkZ2h0QXJyb3cAoPon6SRnaHRBcnJvdwCg+SdpImdodAAAAUFU9gL7AnIicm93AACg0iFlAGUAAKCoInAAQQIGAwAAAAALA3Iicm93AACg0SFvJHduQXJyb3cAAKDVIWUlcnRpY2FsQmFyAACgJSJuAAADQUJMUlRhJAM2AzoDWgNxA3oDciJyb3cAAKGTIUJVLAMwA2EAcgAAoBMpcCNBcnJvdwAAoPUhciJldmUAEWPlIWZ00gJDAwAASwMAAFIDaSVnaHRWZWN0b3IAAKBQKWUkZVZlY3RvcgAAoF4p5SJjdG9yQqC9IWEAcgAAoFYpaSJnaHQA1AFiAwAAaQNlJGVWZWN0b3IAAKBfKeUiY3RvckKgwSFhAHIAAKBXKWUAZQBBoKQiciJyb3cAAKCnIXIAcgBvAPcAtAIAAWN0gwOHA3IA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YwAAoN8i4SFycnCgtiEAoD0pgKIqImJjZG9zACsVMBU6FT4VQRVyImNhcAAAoEgqAAFhdTQVNxVwAACgRipwAACgSipvAHQAAKCNInIAAKBFKgDgKiIA/gACYWxydksVURVuFXMVcgByAG2gtyEAoDwpeQCAAWV2dwBYFWUVaRVxAHACXxUAAAAAYxVyAGUA4wAXFXUA4wAZFWUAZQAAoM4iZSJkZ2UAAKDPImUAbgA7gKQApEBlI2Fycm93AAABbHJ7FX8V5SFmdACgtiFpImdodAAAoLchZQDkAG0VAAFjaYsVkRVvAG4AaQBuAPQAkwFuAHQAAKAxImwiY3R5AACgLSOACUFIYWJjZGVmaGlqbG9yc3R1d3oAuBW7Fb8V1RXgFegV+RUKFhUWHxZUFlcWZRbFFtsW7xb7FgUXChdyAPIAtAJhAHIAAKBlKQACZ2xyc8YVyhXOFdAV5yFlcgCgICDlIXRoAKA4IfIA9QxoAHagECAAoKMiawHZFd4VYSJyb3cAAKAPKWEA4wBfAgABYXnkFecV8iFvbg9hNGQAoUYhYW/tFfQVAAFnciEC8RVyAACgyiF0InNlcQAAoHcqgAFnbG0A/xUCFgUWO4CwALBAdABhALRjcCJ0eXYAAKCxKQABaXIOFhIW8yFodACgfykA4DXYId1hAHIAAAFschsWHRYAoMMhAKDCIYACYWVnc3YAKBauAjYWOhY+Fm0AAKHEIm9zLhY0Fm4AZABzoMQi9SFpdACgZiZhIm1tYQDdY2kAbgAAoPIiAKH3AGlvQxZRFmQAZQAAgfcAO29KFksW90BuI3RpbWVzAACgxyJuAPgAUBZjAHkAUmRjAG8CXhYAAAAAYhZyAG4AAKAeI28AcAAAoA0jgAJscHR1dwBuFnEWdRaSFp4W7CFhciRgZgAA4DXYVd0AotkCZW1wc30WhBaJFo0WcQBkoFAibwB0AACgUSJpIm51cwAAoDgi7CF1cwCgFCLxInVhcmUAoKEiYgBsAGUAYgBhAHIAdwBlAGQAZwDlANcAbgCAAWFkaAClFqoWtBZyAHIAbwD3APUMbwB3AG4AYQByAHIAbwB3APMA8xVhI3Jwb29uAAABbHK8FsAWZQBmAPQAHBZpAGcAaAD0AB4WYgHJFs8WawBhAHIAbwD3AJILbwLUFgAAAADYFnIAbgAAoB8jbwBwAACgDCOAAWNvdADhFukW7BYAAXJ55RboFgDgNdi53FVkbAAAoPYp8iFvaxFhAAFkcvMW9xZvAHQAAKDxImkA5qC/JVsSAAFhaP8WAhdyAPIANQNhAPIA1wvhIm5nbGUAoKYpAAFjaQ4XEBd5AF9k5yJyYXJyAKD/JwAJRGFjZGVmZ2xtbm9wcXJzdHV4MRc4F0YXWxcyBF4XaRd5F40XrBe0F78X2RcVGCEYLRg1GEAYAAFEbzUXgRZvAPQA+BUAAWNzPBdCF3UAdABlADuA6QDpQPQhZXIAoG4qAAJhaW95TRdQF1YXWhfyIW9uG2FyAGOgViI7gOoA6kDsIW9uAKBVIk1kbwB0ABdhAAFEcmIXZhdvAHQAAKBSIgDgNdgi3XKhmipuF3QXYQB2AGUAO4DoAOhAZKCWKm8AdAAAoJgqgKGZKmlscwCAF4UXhxfuInRlcnMAoOcjAKATIWSglSpvAHQAAKCXKoABYXBzAJMXlheiF2MAcgATYXQAeQBzogUinxcAAAAAoRdlAHQAAKAFInAAMaADIDMBqRerFwCgBCAAoAUgAAFnc7AXsRdLYXAAAKACIAABZ3C4F7sXbwBuABlhZgAA4DXYVt2AAWFscwDFF8sXzxdyAHOg1SJsAACg4yl1AHMAAKBxKmkAAKG1A2x21RfYF28AbgC1Y/VjAAJjc3V24BfoF/0XEBgAAWlv5BdWF3IAYwAAoFYiaQLuFwAAAADwF+0ADQThIW50AAFnbPUX+Rd0AHIAAKCWKuUhc3MAoJUqgAFhZWkAAxgGGAoYbABzAD1gcwB0AACgXyJ2AESgYSJEAACgeCrwImFyc2wAoOUpAAFEYRkYHRhvAHQAAKBTInIAcgAAoHEpgAFjZGkAJxgqGO0XcgAAoC8hbwD0AIwCAAFhaDEYMhi3YzuA8ADwQAABbXI5GD0YbAA7gOsA60BvAACgrCCAAWNpcABGGEgYSxhsACFgcwD0ACwEAAFlb08YVxhjAHQAYQB0AGkAbwDuABoEbgBlAG4AdABpAGEAbADlADME4Ql1GAAAgRgAAIMYiBgAAAAAoRilGAAAqhgAALsYvhjRGAAA1xgnGWwAbABpAG4AZwBkAG8AdABzAGUA8QBlF3kARGRtImFsZQAAoEAmgAFpbHIAjRiRGJ0Y7CFpZwCgA/tpApcYAAAAAJoYZwAAoAD7aQBnAACgBPsA4DXYI93sIWlnAKAB++whaWcA4GYAagCAAWFsdACvGLIYthh0AACgbSZpAGcAAKAC+24AcwAAoLElbwBmAJJh8AHCGAAAxhhmAADgNdhX3QABYWvJGMwYbADsAGsEdqDUIgCg2SphI3J0aW50AACgDSoAAWFv2hgiGQABY3PeGB8ZsQPnGP0YBRkSGRUZAAAdGbID7xjyGPQY9xj5GAAA+xg7gL0AvUAAoFMhO4C8ALxAAKBVIQCgWSEAoFshswEBGQAAAxkAoFQhAKBWIbQCCxkOGQAAAAAQGTuAvgC+QACgVyEAoFwhNQAAoFghtgEZGQAAGxkAoFohAKBdITgAAKBeIWwAAKBEIHcAbgAAoCIjYwByAADgNdi73IAIRWFiY2RlZmdpamxub3JzdHYARhlKGVoZXhlmGWkZkhmWGZkZnRmgGa0ZxhnLGc8Z4BkjGmygZyIAoIwqgAFjbXAAUBlTGVgZ9SF0ZfVhbQBhAOSgswM6FgCghipyImV2ZQAfYQABaXliGWUZcgBjAB1hM2RvAHQAIWGAoWUibHFzAMYEcBl6GfGhZSLOBAAAdhlsAGEAbgD0AN8EgKF+KmNkbACBGYQZjBljAACgqSpvAHQAb6CAKmyggioAoIQqZeDbIgD+cwAAoJQqcgAA4DXYJN3noGsirATtIWVsAKA3IWMAeQBTZIChdyJFYWoApxmpGasZAKCSKgCgpSoAoKQqAAJFYWVztBm2Gb0ZwhkAoGkicABwoIoq8iFveACgiipxoIgq8aCIKrUZaQBtAACg5yJwAGYAAOA12FjdYQB2AOUAYwIAAWNp0xnWGXIAAKAKIW0AAKFzImVs3BneGQCgjioAoJAqAIM+ADtjZGxxco0E6xn0GfgZ/BkBGgABY2nvGfEZAKCnKnIAAKB6Km8AdAAAoNci0CFhcgCglSl1ImVzdAAAoHwqgAJhZGVscwAKGvQZFhrVBCAa8AEPGgAAFBpwAHIAbwD4AFkZcgAAoHgpcQAAAWxxxAQbGmwAZQBzAPMASRlpAO0A5AQAAWVuJxouGnIjdG5lcXEAAOBpIgD+xQAsGgAFQWFiY2Vma29zeUAaQxpmGmoabRqDGocalhrCGtMacgDyAMwCAAJpbG1yShpOGlAaVBpyAHMA8ABxD2YAvWBpAGwA9AASBQABZHJYGlsaYwB5AEpkAKGUIWN3YBpkGmkAcgAAoEgpAKCtIWEAcgAAoA8h6SFyYyVhgAFhbHIAcxp7Gn8a8iF0c3WgZSZpAHQAAKBlJuwhaXAAoCYg4yFvbgCguSJyAADgNdgl3XMAAAFld4wakRphInJvdwAAoCUpYSJyb3cAAKAmKYACYW1vcHIAnxqjGqcauhq+GnIAcgAAoP8h9CFodACgOyJrAAABbHKsGrMaZSRmdGFycm93AACgqSHpJGdodGFycm93AKCqIWYAAOA12Fnd4iFhcgCgFSCAAWNsdADIGswa0BpyAADgNdi93GEAcwDoAGka8iFvaydhAAFicNca2xr1IWxsAKBDIOghZW4AoBAg4Qr2GgAA/RoAAAgbExsaGwAAIRs7GwAAAAA+G2IbmRuVG6sbAACyG80b0htjAHUAdABlADuA7QDtQAChYyBpeQEbBhtyAGMAO4DuAO5AOGQAAWN4CxsNG3kANWRjAGwAO4ChAKFAAAFmcssCFhsA4DXYJt1yAGEAdgBlADuA7ADsQIChSCFpbm8AJxsyGzYbAAFpbisbLxtuAHQAAKAMKnQAAKAtIuYhaW4AoNwpdABhAACgKSHsIWlnM2GAAWFvcABDG1sbXhuAAWNndABJG0sbWRtyACthgAFlbHAAcQVRG1UbaQBuAOUAyAVhAHIA9AByBWgAMWFmAACgtyJlAGQAtWEAoggiY2ZvdGkbbRt1G3kb4SFyZQCgBSFpAG4AdKAeImkAZQAAoN0pZABvAPQAWxsAoisiY2VscIEbhRuPG5QbYQBsAACguiIAAWdyiRuNG2UAcgDzACMQ4wCCG2EicmhrAACgFyryIW9kAKA8KgACY2dwdJ8boRukG6gbeQBRZG8AbgAvYWYAAOA12FrdYQC5Y3UAZQBzAHQAO4C/AL9AAAFjabUbuRtyAADgNdi+3G4AAKIIIkVkc3bCG8QbyBvQAwCg+SJvAHQAAKD1Inag9CIAoPMiaaBiIOwhZGUpYesB1hsAANkbYwB5AFZkbAA7gO8A70AAA2NmbW9zdeYb7hvyG/Ub+hsFHAABaXnqG+0bcgBjADVhOWRyAADgNdgn3eEhdGg3YnAAZgAA4DXYW93jAf8bAAADHHIAAOA12L/c8iFjeVhk6yFjeVRkAARhY2ZnaGpvcxUcGhwiHCYcKhwtHDAcNRzwIXBhdqC6A/BjAAFleR4cIRzkIWls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ZmdobG1vcHJzdHV3CiwNLBEsHSwnLDEsQCxLLFIsYix6LIQsjyzLLOgs7Sz/LAotcgDyAAkDYQByAACgYykAAWNyFSwbLHUAdABlADuA+gD6QPIACQ1yAOMBIywAACUseQBeZHYAZQBtYQABaXkrLDAscgBjADuA+wD7QENkgAFhYmgANyw6LD0scgDyANEO7CFhY3FhYQDyAOAOAAFpckQsSCzzIWh0AKB+KQDgNdgy3XIAYQB2AGUAO4D5APlAYQFWLF8scgAAAWxyWixcLACgvyEAoL4hbABrAACggCUAAWN0Zix2LG8CbCwAAAAAcyxyAG4AZaAcI3IAAKAcI28AcAAAoA8jcgBpAACg+CUAAWFsfiyBLGMAcgBrYTuAqACoQAABZ3CILIssbwBuAHNhZgAA4DXYZt0AA2FkaGxzdZksniynLLgsuyzFLHIAcgBvAPcACQ1vAHcAbgBhAHIAcgBvAPcA2A5hI3Jwb29uAAABbHKvLLMsZQBmAPQAWyxpAGcAaAD0AF0sdQDzAKYOaQAAocUDaGzBLMIs0mNvAG4AxWPwI2Fycm93cwCgyCGAAWNpdADRLOEs5CxvAtcsAAAAAN4scgBuAGWgHSNyAACgHSNvAHAAAKAOI24AZwBvYXIAaQAAoPklYwByAADgNdjK3IABZGlyAPMs9yz6LG8AdAAAoPAi7CFkZWlhaQBmoLUlAKC0JQABYW0DLQYtcgDyAMosbAA7gPwA/EDhIm5nbGUAoKcpgAdBQkRhY2RlZmxub3Byc3oAJy0qLTAtNC2bLZ0toS2/LcMtxy3TLdgt3C3gLfwtcgDyABADYQByAHag6CoAoOkqYQBzAOgA/gIAAW5yOC08LechcnQAoJwpgANla25wcnN0AJkpSC1NLVQtXi1iLYItYQBwAHAA4QAaHG8AdABoAGkAbgDnAKEXgAFoaXIAoSmzJFotbwBwAPQAdCVooJUh7wD4JgABaXVmLWotZwBtAOEAuygAAWJwbi14LXMjZXRuZXEAceCKIgD+AODLKgD+cyNldG5lcQBx4IsiAP4A4MwqAP4AAWhyhi2KLWUAdADhABIraSNhbmdsZQAAAWxyki2WLeUhZnQAoLIiaSJnaHQAAKCzInkAMmThIXNoAKCiIoABZWxyAKcttC24LWKiKCKuLQAAAACyLWEAcgAAoLsicQAAoFoi7CFpcACg7iIAAWJ0vC1eD2EA8gBfD3IAAOA12DPddAByAOkAlS1zAHUAAAFicM0t0C0A4IIi0iAA4IMi0iBwAGYAAOA12GfdcgBvAPAAWQt0AHIA6QCaLQABY3XkLegtcgAA4DXYy9wAAWJw7C30LW4AAAFFZXUt8S0A4IoiAP5uAAABRWV/LfktAOCLIgD+6SJnemFnAKCaKYADY2Vmb3BycwANLhAuJS4pLiMuLi40LukhcmN1YQABZGkULiEuAAFiZxguHC5hAHIAAKBfKmUAcaAnIgCgWSLlIXJwAKAYIXIAAOA12DTdcABmAADgNdho3WWgQCJhAHQA6ABqD2MAcgAA4DXYzNzjCuQRUC4AAFQuAABYLmIuAAAAAGMubS5wLnQuAAAAAIguki4AAJouJxIqEnQAcgDpAB0ScgAA4DXYNd0AAUFhWy5eLnIA8gDnAnIA8gCTB75jAAFBYWYuaS5yAPIA4AJyAPIAjAdhAPAAeh5pAHMAAKD7IoABZHB0APgReS6DLgABZmx9LoAuAOA12GnddQDzAP8RaQBtAOUABBIAAUFhiy6OLnIA8gDuAnIA8gCaBwABY3GVLgoScgAA4DXYzdwAAXB0nS6hLmwAdQDzACUScgDpACASAARhY2VmaW9zdbEuvC7ELsguzC7PLtQu2S5jAAABdXm2LrsudABlADuA/QD9QE9kAAFpecAuwy5yAGMAd2FLZG4AO4ClAKVAcgAA4DXYNt1jAHkAV2RwAGYAAOA12GrdYwByAADgNdjO3AABY23dLt8ueQBOZGwAO4D/AP9AAAVhY2RlZmhpb3N38y73Lv8uAi8MLxAvEy8YLx0vIi9jInV0ZQB6YQABYXn7Lv4u8iFvbn5hN2RvAHQAfGEAAWV0Bi8KL3QAcgDmAB8QYQC2Y3IAAOA12DfdYwB5ADZk5yJyYXJyAKDdIXAAZgAA4DXYa91jAHIAAOA12M/cAAFqbiYvKC8AoA0gagAAoAwg");
//#endregion
//#region node_modules/entities/dist/internal/bin-trie-flags.js
/**
* Bit flags & masks for the binary trie encoding used for entity decoding.
*
* Bit layout (16 bits total):
* 15..14 VALUE_LENGTH   (+1 encoding; 0 => no value)
* 13     FLAG13.        If valueLength>0: semicolon required flag (implicit ';').
*                       If valueLength==0: compact run flag.
* 12..7  BRANCH_LENGTH  Branch length (0 => single branch in 6..0 if jumpOffset==char) OR run length (when compact run)
* 6..0   JUMP_TABLE     Jump offset (jump table) OR single-branch char code OR first run char
*/
var BinTrieFlags;
(function(BinTrieFlags) {
	BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags[BinTrieFlags["FLAG13"] = 8192] = "FLAG13";
	BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
	BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
//#endregion
//#region \0@oxc-project+runtime@0.142.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.142.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.142.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.142.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region node_modules/entities/dist/decode.js
var CharCodes;
(function(CharCodes) {
	CharCodes[CharCodes["NUM"] = 35] = "NUM";
	CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
	CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
	CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
	CharCodes[CharCodes["NINE"] = 57] = "NINE";
	CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
	CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
	CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
	CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
	CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
	CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
var TO_LOWER_BIT = 32;
function isNumber(code) {
	return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
* @param code Code point to decode.
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
	EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
/**
* Decoding mode for named entities.
*/
var DecodingMode;
(function(DecodingMode) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		_defineProperty(this, "decodeTree", void 0);
		_defineProperty(this, "emitCodePoint", void 0);
		_defineProperty(this, "errors", void 0);
		_defineProperty(
			this,
			/** The current state of the decoder. */
			"state",
			EntityDecoderState.EntityStart
		);
		_defineProperty(
			this,
			/** Characters that were consumed while parsing an entity. */
			"consumed",
			1
		);
		_defineProperty(
			this,
			/**
			* The result of the entity.
			*
			* Either the result index of a numeric entity, or the codepoint of a
			* numeric entity.
			*/
			"result",
			0
		);
		_defineProperty(
			this,
			/** The current index in the decode tree. */
			"treeIndex",
			0
		);
		_defineProperty(
			this,
			/** The number of characters that were consumed in excess. */
			"excess",
			1
		);
		_defineProperty(
			this,
			/** The mode in which the decoder is operating. */
			"decodeMode",
			DecodingMode.Strict
		);
		_defineProperty(
			this,
			/** The number of characters that have been consumed in the current run. */
			"runConsumed",
			0
		);
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
	}
	/**
	* Resets the instance to make it reusable.
	* @param decodeMode Entity decoding mode to use.
	*/
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
		this.runConsumed = 0;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) {
				const digit = char <= CharCodes.NINE ? char - CharCodes.ZERO : (char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10;
				this.result = this.result * 16 + digit;
				this.consumed++;
				offset++;
			} else return this.emitNumericEntity(char, 3);
		}
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) {
				this.result = this.result * 10 + (char - CharCodes.ZERO);
				this.consumed++;
				offset++;
			} else return this.emitNumericEntity(char, 2);
		}
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		if (this.consumed <= expectedLength) {
			var _this$errors;
			(_this$errors = this.errors) === null || _this$errors === void 0 || _this$errors.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		while (offset < input.length) {
			if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
				const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
				if (this.runConsumed === 0) {
					const firstChar = current & BinTrieFlags.JUMP_TABLE;
					if (input.charCodeAt(offset) !== firstChar) return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
					offset++;
					this.excess++;
					this.runConsumed++;
				}
				while (this.runConsumed < runLength) {
					if (offset >= input.length) return -1;
					const charIndexInPacked = this.runConsumed - 1;
					const packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)];
					const expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
					if (input.charCodeAt(offset) !== expectedChar) {
						this.runConsumed = 0;
						return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
					}
					offset++;
					this.excess++;
					this.runConsumed++;
				}
				this.runConsumed = 0;
				this.treeIndex += 1 + (runLength >> 1);
				current = decodeTree[this.treeIndex];
				valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			}
			if (offset >= input.length) break;
			const char = input.charCodeAt(offset);
			if (char === CharCodes.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
			offset++;
			this.excess++;
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _this$errors2;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_this$errors2 = this.errors) === null || _this$errors2 === void 0 || _this$errors2.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	* @returns The number of characters consumed.
	*/
	end() {
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				var _this$errors3;
				(_this$errors3 = this.errors) === null || _this$errors3 === void 0 || _this$errors3.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Creates a function that decodes entities in a string.
* @param decodeTree The decode tree.
* @returns A function that decodes entities in a string.
*/
function getDecoder(decodeTree) {
	let returnValue = "";
	const decoder = new EntityDecoder(decodeTree, (data) => returnValue += String.fromCodePoint(data));
	return function decodeWithTrie(input, decodeMode) {
		let lastIndex = 0;
		let offset = 0;
		while ((offset = input.indexOf("&", offset)) >= 0) {
			returnValue += input.slice(lastIndex, offset);
			decoder.startEntity(decodeMode);
			const length = decoder.write(input, offset + 1);
			if (length < 0) {
				lastIndex = offset + decoder.end();
				break;
			}
			lastIndex = offset + length;
			offset = length === 0 ? lastIndex + 1 : lastIndex;
		}
		const result = returnValue + input.slice(lastIndex);
		returnValue = "";
		return result;
	};
}
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIndex Index immediately after the current node header.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	const packedKeySlots = branchCount + 1 >> 1;
	let lo = 0;
	let hi = branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midKey = decodeTree[nodeIndex + (mid >> 1)] >> (mid & 1) * 8 & 255;
		if (midKey < char) lo = mid + 1;
		else if (midKey > char) hi = mid - 1;
		else return decodeTree[nodeIndex + packedKeySlots + mid];
	}
	return -1;
}
var htmlDecoder = /* #__PURE__ */ getDecoder(htmlDecodeTree);
/**
* Decodes an HTML string, requiring all entities to be terminated by a semicolon.
* @param htmlString The string to decode.
* @returns The decoded string.
*/
function decodeHTMLStrict(htmlString) {
	return htmlDecoder(htmlString, DecodingMode.Strict);
}
//#endregion
//#region src/common/utils.ts
/**
* Common utility functions exposed through `md.utils` for use by plugins.
*
* @module md.utils
*/
var utils_exports = /* @__PURE__ */ __exportAll({
	arrayReplaceAt: () => arrayReplaceAt,
	asciiTrim: () => asciiTrim,
	callable: () => callable,
	escapeHtml: () => escapeHtml$1,
	escapeRE: () => escapeRE,
	fromCodePoint: () => fromCodePoint,
	isMdAsciiPunct: () => isMdAsciiPunct,
	isPunctChar: () => isPunctChar,
	isPunctCharCode: () => isPunctCharCode,
	isSpace: () => isSpace,
	isValidEntityCode: () => isValidEntityCode,
	isWhiteSpace: () => isWhiteSpace,
	lib: () => lib,
	normalizeReference: () => normalizeReference,
	unescapeAll: () => unescapeAll,
	unescapeMd: () => unescapeMd
});
function callable(cls) {
	const wrapper = function(...args) {
		return Reflect.construct(cls, args, new.target && new.target !== wrapper ? new.target : cls);
	};
	Object.defineProperty(wrapper, "name", { value: cls.name });
	Object.setPrototypeOf(wrapper, cls);
	wrapper.prototype = cls.prototype;
	return wrapper;
}
/**
* Returns a copy of a token array with the token at `pos` replaced by
* `newElements`. Used to transform token streams without modifying the
* original array.
*/
function arrayReplaceAt(src, pos, newElements) {
	return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
/** Checks whether a code point can be decoded from a numeric HTML entity. */
function isValidEntityCode(c) {
	if (c >= 55296 && c <= 57343) return false;
	if (c >= 64976 && c <= 65007) return false;
	if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
	if (c >= 0 && c <= 8) return false;
	if (c === 11) return false;
	if (c >= 14 && c <= 31) return false;
	if (c >= 127 && c <= 159) return false;
	if (c > 1114111) return false;
	return true;
}
/**
* Converts a Unicode code point to a string, like `String.fromCodePoint()`,
* but does not throw for invalid input.
*/
function fromCodePoint(c) {
	if (c > 65535) {
		c -= 65536;
		const surrogate1 = 55296 + (c >> 10);
		const surrogate2 = 56320 + (c & 1023);
		return String.fromCharCode(surrogate1, surrogate2);
	}
	return String.fromCharCode(c);
}
var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
var UNESCAPE_ALL_RE = new RegExp(`${UNESCAPE_MD_RE.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`, "gi");
var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function replaceEntityPattern(match, name) {
	if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
		const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
		if (isValidEntityCode(code)) return fromCodePoint(code);
		return match;
	}
	const decoded = decodeHTMLStrict(match);
	if (decoded !== match) return decoded;
	return match;
}
/** Decodes Markdown backslash escapes. */
function unescapeMd(str) {
	if (str.indexOf("\\") < 0) return str;
	return str.replace(UNESCAPE_MD_RE, "$1");
}
/**
* Decodes Markdown backslash escapes and HTML character references in link
* destinations, link titles, and fenced code info strings.
*/
function unescapeAll(str) {
	if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
	return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
		if (escaped) return escaped;
		return replaceEntityPattern(match, entity);
	});
}
var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function replaceUnsafeChar(ch) {
	return HTML_REPLACEMENTS[ch];
}
/** Escapes HTML special characters in a string. */
function escapeHtml$1(str) {
	if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
	return str;
}
var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
/** Escapes regular expression metacharacters in a string. */
function escapeRE(str) {
	return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
/** Checks whether a character code is an ASCII space or tab. */
function isSpace(code) {
	switch (code) {
		case 9:
		case 32: return true;
	}
	return false;
}
/**
* Checks whether a character code is whitespace recognized by Markdown.
*
* Matches the Unicode `Zs` category or `\t`, `\f`, `\v`, `\r`, `\n`.
*/
function isWhiteSpace(code) {
	if (code >= 8192 && code <= 8202) return true;
	switch (code) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return true;
	}
	return false;
}
/**
* Checks whether a character is Unicode punctuation or a symbol.
*
* Does not support astral characters.
*/
function isPunctChar(ch) {
	return P.test(ch) || S.test(ch);
}
/** Checks whether a Unicode code point is punctuation or a symbol. */
function isPunctCharCode(code) {
	return isPunctChar(fromCodePoint(code));
}
/**
* Markdown ASCII punctuation characters.
*
*     !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @,
*     [, \, ], ^, _, `, {, |, }, or ~
*
* http://spec.commonmark.org/0.15/#ascii-punctuation-character
*
* Don't confuse with Unicode punctuation. It lacks some characters in the
* ASCII range.
*/
function isMdAsciiPunct(ch) {
	switch (ch) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return true;
		default: return false;
	}
}
/** Normalizes `[reference labels]` for case-insensitive lookup. */
function normalizeReference(str) {
	str = str.trim().replace(/\s+/g, " ");
	return str.toLowerCase().toUpperCase();
}
function isAsciiTrimmable(c) {
	return c === 32 || c === 9 || c === 10 || c === 13;
}
/**
* "Light" `.trim()` for blocks (headings, paragraphs), where Unicode spaces
* should be preserved.
*/
function asciiTrim(str) {
	let start = 0;
	for (; start < str.length; start++) if (!isAsciiTrimmable(str.charCodeAt(start))) break;
	let end = str.length - 1;
	for (; end >= start; end--) if (!isAsciiTrimmable(str.charCodeAt(end))) break;
	return str.slice(start, end + 1);
}
/**
* Libraries commonly used by markdown-it and its plugins, re-exported to
* reduce duplicate dependencies in browser bundles.
*/
var lib = {
	mdurl: mdurl_exports,
	ucmicro: build_exports
};
//#endregion
//#region src/helpers/parse_link_label.ts
/** Finds the end of a link or image label (`[label]`). */
function parseLinkLabel(state, start, disableNested) {
	let level, found, marker, prevPos;
	const max = state.posMax;
	const oldPos = state.pos;
	state.pos = start + 1;
	level = 1;
	while (state.pos < max) {
		marker = state.src.charCodeAt(state.pos);
		if (marker === 93) {
			level--;
			if (level === 0) {
				found = true;
				break;
			}
		}
		prevPos = state.pos;
		state.md.inline.skipToken(state);
		if (marker === 91) {
			if (prevPos === state.pos - 1) level++;
			else if (disableNested) {
				state.pos = oldPos;
				return -1;
			}
		}
	}
	let labelEnd = -1;
	if (found) labelEnd = state.pos;
	state.pos = oldPos;
	return labelEnd;
}
//#endregion
//#region src/helpers/parse_link_destination.ts
/** Parses the destination in `[label](destination "title")`. */
function parseLinkDestination(str, start, max) {
	let code;
	let pos = start;
	const result = {
		ok: false,
		pos: 0,
		str: ""
	};
	if (str.charCodeAt(pos) === 60) {
		pos++;
		while (pos < max) {
			code = str.charCodeAt(pos);
			if (code === 10) return result;
			if (code === 60) return result;
			if (code === 62) {
				result.pos = pos + 1;
				result.str = unescapeAll(str.slice(start + 1, pos));
				result.ok = true;
				return result;
			}
			if (code === 92 && pos + 1 < max) {
				pos += 2;
				continue;
			}
			pos++;
		}
		return result;
	}
	let level = 0;
	while (pos < max) {
		code = str.charCodeAt(pos);
		if (code === 32) break;
		if (code < 32 || code === 127) break;
		if (code === 92 && pos + 1 < max) {
			if (str.charCodeAt(pos + 1) === 32) {
				pos++;
				continue;
			}
			pos += 2;
			continue;
		}
		if (code === 40) {
			level++;
			if (level > 32) return result;
		}
		if (code === 41) {
			if (level === 0) break;
			level--;
		}
		pos++;
	}
	if (start === pos) return result;
	if (level !== 0) return result;
	result.str = unescapeAll(str.slice(start, pos));
	result.pos = pos;
	result.ok = true;
	return result;
}
//#endregion
//#region src/helpers/parse_link_title.ts
/**
* Parses the optional title in `[label](destination "title")` or
* `[label]: destination "title"`.
*
* `prev_state` continues a reference title on the next source line.
*/
function parseLinkTitle(str, start, max, prev_state) {
	let code;
	let pos = start;
	const state = {
		ok: false,
		can_continue: false,
		pos: 0,
		str: "",
		marker: 0
	};
	if (prev_state) {
		state.str = prev_state.str;
		state.marker = prev_state.marker;
	} else {
		if (pos >= max) return state;
		let marker = str.charCodeAt(pos);
		if (marker !== 34 && marker !== 39 && marker !== 40) return state;
		start++;
		pos++;
		if (marker === 40) marker = 41;
		state.marker = marker;
	}
	while (pos < max) {
		code = str.charCodeAt(pos);
		if (code === state.marker) {
			state.pos = pos + 1;
			state.str += unescapeAll(str.slice(start, pos));
			state.ok = true;
			return state;
		} else if (code === 40 && state.marker === 41) return state;
		else if (code === 92 && pos + 1 < max) pos++;
		pos++;
	}
	state.can_continue = true;
	state.str += unescapeAll(str.slice(start, pos));
	return state;
}
//#endregion
//#region src/helpers/index.ts
/**
* Functions used to parse links and images, split out of parser rules because
* of their size.
*
* @module md.helpers
*/
var helpers_exports = /* @__PURE__ */ __exportAll({
	parseLinkDestination: () => parseLinkDestination,
	parseLinkLabel: () => parseLinkLabel,
	parseLinkTitle: () => parseLinkTitle
});
//#endregion
//#region src/token.ts
/**
* Represents one item in the parsed token stream, storing parsed data and
* providing helpers for managing HTML attributes.
*/
var Token = class {
	constructor(type, tag, nesting) {
		_defineProperty(
			this,
			/**
			* Source map info. Format: `[ line_begin, line_end ]`
			*/
			"map",
			null
		);
		_defineProperty(
			this,
			/**
			* nesting level, the same as `state.level`
			*/
			"level",
			0
		);
		_defineProperty(
			this,
			/**
			* An array of child nodes (inline and img tokens)
			*/
			"children",
			null
		);
		_defineProperty(
			this,
			/**
			* In a case of self-closing tag (code, html, fence, etc.),
			* it has contents of this tag.
			*/
			"content",
			""
		);
		_defineProperty(
			this,
			/**
			* '*' or '_' for emphasis, fence string for fence, etc.
			*/
			"markup",
			""
		);
		_defineProperty(
			this,
			/**
			* Additional information:
			*
			* - Info string for "fence" tokens
			* - The value "auto" for autolink "link_open" and "link_close" tokens
			* - The string value of the item marker for ordered-list "list_item_open" tokens
			*/
			"info",
			""
		);
		_defineProperty(
			this,
			/**
			* True for block-level tokens, false for inline tokens.
			* Used in renderer to calculate line breaks
			*/
			"block",
			false
		);
		_defineProperty(
			this,
			/**
			* If it's true, ignore this element when rendering. Used for tight lists
			* to hide paragraphs.
			*/
			"hidden",
			false
		);
		this.type = type;
		this.tag = tag;
		this.attrs = null;
		this.nesting = nesting;
		this.meta = null;
	}
	/**
	* Search attribute index by name.
	*/
	attrIndex(name) {
		if (!this.attrs) return -1;
		const attrs = this.attrs;
		for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
		return -1;
	}
	/**
	* Add `[ name, value ]` attribute to list. Init attrs if necessary
	*/
	attrPush(attrData) {
		if (this.attrs) this.attrs.push(attrData);
		else this.attrs = [attrData];
	}
	/**
	* Set `name` attribute to `value`. Override old value if exists.
	*/
	attrSet(name, value) {
		const idx = this.attrIndex(name);
		const attrData = [name, value];
		if (idx < 0) this.attrPush(attrData);
		else this.attrs[idx] = attrData;
	}
	/**
	* Get the value of attribute `name`, or null if it does not exist.
	*/
	attrGet(name) {
		const idx = this.attrIndex(name);
		let value = null;
		if (idx >= 0) value = this.attrs[idx][1];
		return value;
	}
	/**
	* Join value to existing attribute via space. Or create new attribute if not
	* exists. Useful to operate with token classes.
	*/
	attrJoin(name, value) {
		const idx = this.attrIndex(name);
		if (idx < 0) this.attrPush([name, value]);
		else this.attrs[idx][1] = `${this.attrs[idx][1]} ${value}`;
	}
};
//#endregion
//#region src/ruler.ts
/**
* Helper class, used by {@link MarkdownIt.core}, {@link MarkdownIt.block} and
* {@link MarkdownIt.inline} to manage sequences of functions (rules):
*
* - keep rules in defined order
* - assign the name to each rule
* - enable/disable rules
* - add/replace rules
* - allow assign rules to additional named chains (in the same)
* - cacheing lists of active rules
*
* You will not need use this class directly until write plugins. For simple
* rules control use {@link MarkdownIt.disable}, {@link MarkdownIt.enable} and
* {@link MarkdownIt.use}.
*/
var Ruler = class {
	constructor() {
		_defineProperty(
			this,
			/** @internal */
			"__rules__",
			[]
		);
		_defineProperty(
			this,
			/** @internal */
			"__cache__",
			null
		);
	}
	/** @internal */
	__find__(name) {
		for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
		return -1;
	}
	/** @internal */
	__compile__() {
		const chains = /* @__PURE__ */ new Set();
		this.__rules__.forEach((rule) => {
			if (!rule.enabled) return;
			rule.alt.forEach((altName) => {
				if (altName) chains.add(altName);
			});
		});
		this.__cache__ = Object.create(null);
		this.__cache__[""] = [];
		this.__rules__.forEach((rule) => {
			if (rule.enabled) this.__cache__[""].push(rule.fn);
		});
		chains.forEach((chain) => {
			this.__cache__[chain] = [];
			this.__rules__.forEach((rule) => {
				if (rule.enabled && rule.alt.indexOf(chain) >= 0) this.__cache__[chain].push(rule.fn);
			});
		});
	}
	/**
	* Replace rule by name with new function & options. Throws error if name not
	* found.
	*
	* @example Replace existing typographer replacement rule with new one
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* const md = new MarkdownIt()
	*
	* md.core.ruler.at('replacements', function replace(state) {
	*   //...
	* });
	* ```
	*/
	at(name, fn, options = {}) {
		const index = this.__find__(name);
		if (index === -1) throw new Error(`Parser rule not found: ${name}`);
		this.__rules__[index].fn = fn;
		this.__rules__[index].alt = options.alt || [];
		this.__cache__ = null;
	}
	/**
	* Add new rule to chain before one with given name. See also
	* {@link Ruler.after}, {@link Ruler.push}.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* const md = new MarkdownIt()
	*
	* md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
	*   //...
	* });
	* ```
	*/
	before(beforeName, ruleName, fn, options = {}) {
		const index = this.__find__(beforeName);
		if (index === -1) throw new Error(`Parser rule not found: ${beforeName}`);
		this.__rules__.splice(index, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: options.alt || []
		});
		this.__cache__ = null;
	}
	/**
	* Add new rule to chain after one with given name. See also
	* {@link Ruler.before}, {@link Ruler.push}.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* const md = new MarkdownIt()
	*
	* md.inline.ruler.after('text', 'my_rule', function replace(state) {
	*   //...
	* });
	* ```
	*/
	after(afterName, ruleName, fn, options = {}) {
		const index = this.__find__(afterName);
		if (index === -1) throw new Error(`Parser rule not found: ${afterName}`);
		this.__rules__.splice(index + 1, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: options.alt || []
		});
		this.__cache__ = null;
	}
	/**
	* Push new rule to the end of chain. See also
	* {@link Ruler.before}, {@link Ruler.after}.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* const md = new MarkdownIt()
	*
	* md.core.ruler.push('my_rule', function replace(state) {
	*   //...
	* });
	* ```
	*/
	push(ruleName, fn, options = {}) {
		this.__rules__.push({
			name: ruleName,
			enabled: true,
			fn,
			alt: options.alt || []
		});
		this.__cache__ = null;
	}
	/**
	* Enable rules with given names. If any rule name not found - throw Error.
	* Errors can be disabled by second param.
	*
	* See also {@link Ruler.disable}, {@link Ruler.enableOnly}.
	*
	* Returns list of found rule names (if no exception happened).
	*/
	enable(list, ignoreInvalid = false) {
		if (!Array.isArray(list)) list = [list];
		const result = [];
		list.forEach((name) => {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) return;
				throw new Error(`Rules manager: invalid rule name ${name}`);
			}
			this.__rules__[idx].enabled = true;
			result.push(name);
		});
		this.__cache__ = null;
		return result;
	}
	/**
	* Enable rules with given names, and disable everything else. If any rule name
	* not found - throw Error. Errors can be disabled by second param.
	*
	* See also {@link Ruler.disable}, {@link Ruler.enable}.
	*/
	enableOnly(list, ignoreInvalid = false) {
		if (!Array.isArray(list)) list = [list];
		this.__rules__.forEach((rule) => {
			rule.enabled = false;
		});
		this.enable(list, ignoreInvalid);
	}
	/**
	* Disable rules with given names. If any rule name not found - throw Error.
	* Errors can be disabled by second param.
	*
	* See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
	*
	* Returns list of found rule names (if no exception happened).
	*/
	disable(list, ignoreInvalid = false) {
		if (!Array.isArray(list)) list = [list];
		const result = [];
		list.forEach((name) => {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) return;
				throw new Error(`Rules manager: invalid rule name ${name}`);
			}
			this.__rules__[idx].enabled = false;
			result.push(name);
		});
		this.__cache__ = null;
		return result;
	}
	/**
	* Return array of active functions (rules) for given chain name. It analyzes
	* rules configuration, compiles caches if not exists and returns result.
	*
	* Default chain name is `''` (empty string). It can't be skipped. That's
	* done intentionally, to keep signature monomorphic for high speed.
	*/
	getRules(chainName) {
		if (!this.__cache__) this.__compile__();
		return this.__cache__[chainName] || [];
	}
};
//#endregion
//#region src/renderer.ts
var default_rules = {};
default_rules.code_inline = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	return `<code${slf.renderAttrs(token)}>${escapeHtml$1(token.content)}</code>`;
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	return `<pre${slf.renderAttrs(token)}><code>${escapeHtml$1(tokens[idx].content)}</code></pre>\n`;
};
default_rules.fence = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	const info = token.info ? unescapeAll(token.info).trim() : "";
	let langName = "";
	let langAttrs = "";
	if (info) {
		const arr = info.split(/(\s+)/g);
		langName = arr[0];
		langAttrs = arr.slice(2).join("");
	}
	let highlighted;
	if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml$1(token.content);
	else highlighted = escapeHtml$1(token.content);
	if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
	if (info) {
		const i = token.attrIndex("class");
		const tmpAttrs = token.attrs ? token.attrs.slice() : [];
		if (i < 0) tmpAttrs.push(["class", `${options.langPrefix}${langName}`]);
		else {
			tmpAttrs[i] = [tmpAttrs[i][0], tmpAttrs[i][1]];
			tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
		}
		const tmpToken = { attrs: tmpAttrs };
		return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>\n`;
	}
	return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
};
default_rules.image = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
	return slf.renderToken(tokens, idx, options);
};
default_rules.hardbreak = function(tokens, idx, options) {
	return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
default_rules.softbreak = function(tokens, idx, options) {
	return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
default_rules.text = function(tokens, idx) {
	return escapeHtml$1(tokens[idx].content);
};
default_rules.html_block = function(tokens, idx) {
	return tokens[idx].content;
};
default_rules.html_inline = function(tokens, idx) {
	return tokens[idx].content;
};
/**
* Generates HTML from parsed token stream. Each instance has independent
* copy of rules. Those can be rewritten with ease. Also, you can add new
* rules if you create plugin and adds new token types.
*
* Creates new renderer instance and fills {@link Renderer.rules} with defaults.
*/
var Renderer = class {
	constructor() {
		_defineProperty(
			this,
			/**
			* Contains render rules for tokens. Can be updated and extended.
			*
			* See [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts)
			* for more details and examples.
			*
			* @example Custom render rules
			* ```javascript
			* import MarkdownIt from 'markdown-it'
			* const md = new MarkdownIt()
			*
			* md.renderer.rules.strong_open  = function () { return '<b>'; };
			* md.renderer.rules.strong_close = function () { return '</b>'; };
			*
			* const result = md.renderInline(...);
			* ```
			*
			* @example Each rule is called as independent static function with fixed signature
			* ```javascript
			* function my_token_render(tokens, idx, options, env, renderer) {
			*   // ...
			*   return renderedHTML;
			* }
			* ```
			*/
			"rules",
			Object.assign({}, default_rules)
		);
	}
	/**
	* Render token attributes to string.
	*/
	renderAttrs(token) {
		let i, l, result;
		if (!token.attrs) return "";
		result = "";
		for (i = 0, l = token.attrs.length; i < l; i++) result += ` ${escapeHtml$1(token.attrs[i][0])}="${escapeHtml$1(String(token.attrs[i][1]))}"`;
		return result;
	}
	/**
	* Default token renderer. Can be overriden by custom function
	* in {@link Renderer.rules}.
	*/
	renderToken(tokens, idx, options) {
		const token = tokens[idx];
		let result = "";
		if (token.hidden) return "";
		let prev = idx - 1;
		while (prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === 0) prev--;
		if (token.block && token.nesting !== -1 && prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === -1) result += "\n";
		result += (token.nesting === -1 ? "</" : "<") + token.tag;
		result += this.renderAttrs(token);
		if (token.nesting === 0 && options.xhtmlOut) result += " /";
		let needLf = false;
		if (token.block) {
			needLf = true;
			if (token.nesting === 1) {
				let next = idx + 1;
				while (next < tokens.length && tokens[next].hidden && tokens[next].nesting === 0) next++;
				if (next < tokens.length) {
					const nextToken = tokens[next];
					if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
					else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
				}
			}
		}
		result += needLf ? ">\n" : ">";
		return result;
	}
	/**
	* The same as {@link Renderer.render}, but for single token of `inline` type.
	*/
	renderInline(tokens, options, env) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const type = tokens[i].type;
			if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
			else result += this.renderToken(tokens, i, options);
		}
		return result;
	}
	/**
	* Special kludge for image `alt` attributes to conform CommonMark spec.
	* Don't try to use it! Spec requires to show `alt` content with stripped markup,
	* instead of simple escaping.
	*/
	renderInlineAsText(tokens, options, env) {
		let result = "";
		for (let i = 0, len = tokens.length; i < len; i++) switch (tokens[i].type) {
			case "text":
			case "code_inline":
				result += tokens[i].content;
				break;
			case "image":
				result += this.renderInlineAsText(tokens[i].children, options, env);
				break;
			case "html_inline":
			case "html_block":
				result += tokens[i].content;
				break;
			case "softbreak":
			case "hardbreak": result += "\n";
		}
		return result;
	}
	/**
	* Takes token stream and generates HTML. Probably, you will never need to call
	* this method directly.
	*/
	render(tokens, options, env) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const type = tokens[i].type;
			if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
			else if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
			else result += this.renderToken(tokens, i, options);
		}
		return result;
	}
};
//#endregion
//#region src/rules_core/state_core.ts
/** Mutable state passed through the core rules chain. */
var StateCore = class {
	constructor(src, md, env) {
		_defineProperty(this, "tokens", []);
		_defineProperty(this, "inlineMode", false);
		_defineProperty(this, "Token", Token);
		this.src = src;
		this.env = env;
		this.md = md;
	}
};
//#endregion
//#region src/rules_core/normalize.ts
var UNNORMALIZED_NEWLINE_RE = /\r\n?/g;
var NULL_RE = /\0/g;
function normalize(state) {
	let str;
	str = state.src.replace(UNNORMALIZED_NEWLINE_RE, "\n");
	str = str.replace(NULL_RE, " ");
	state.src = str;
}
//#endregion
//#region src/rules_core/block.ts
function block(state) {
	let token;
	if (state.inlineMode) {
		token = new state.Token("inline", "", 0);
		token.content = state.src;
		token.map = [0, 1];
		token.children = [];
		state.tokens.push(token);
	} else state.md.block.parse(state.src, state.md, state.env, state.tokens);
}
//#endregion
//#region src/rules_core/strip_references.ts
function strip_references(state) {
	const tokens = state.tokens;
	let last = 0;
	for (let curr = 0; curr < tokens.length; curr++) {
		if (tokens[curr].type === "reference_definition") continue;
		if (curr !== last) tokens[last] = tokens[curr];
		last++;
	}
	if (tokens.length !== last) tokens.length = last;
}
//#endregion
//#region src/rules_core/inline.ts
function inline(state) {
	const tokens = state.tokens;
	for (let i = 0, l = tokens.length; i < l; i++) {
		const tok = tokens[i];
		if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
	}
}
//#endregion
//#region src/rules_core/linkify.ts
function isLinkOpen$1(str) {
	return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
	return /^<\/a\s*>/i.test(str);
}
function linkify$1(state) {
	const blockTokens = state.tokens;
	if (!state.md.options.linkify) return;
	for (let j = 0, l = blockTokens.length; j < l; j++) {
		if (blockTokens[j].type !== "inline" || !state.md.linkify.test(blockTokens[j].content)) continue;
		const tokens = blockTokens[j].children;
		const replacements = [];
		let htmlLinkLevel = 0;
		for (let i = tokens.length - 1; i >= 0; i--) {
			const currentToken = tokens[i];
			if (currentToken.type === "link_close") {
				i--;
				while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
				continue;
			}
			if (currentToken.type === "html_inline") {
				if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
				if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
			}
			if (htmlLinkLevel > 0) continue;
			if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
				const text = currentToken.content;
				let links = state.md.linkify.match(text);
				const nodes = [];
				let level = currentToken.level;
				let lastPos = 0;
				if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
				for (let ln = 0; ln < links.length; ln++) {
					const url = links[ln].url;
					const fullUrl = state.md.normalizeLink(url);
					if (!state.md.validateLink(fullUrl)) continue;
					let urlText = links[ln].text;
					if (!links[ln].schema) urlText = state.md.normalizeLinkText(`http://${urlText}`).replace(/^http:\/\//, "");
					else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText(`mailto:${urlText}`).replace(/^mailto:/, "");
					else urlText = state.md.normalizeLinkText(urlText);
					const pos = links[ln].index;
					if (pos > lastPos) {
						const token = new state.Token("text", "", 0);
						token.content = text.slice(lastPos, pos);
						token.level = level;
						nodes.push(token);
					}
					const token_o = new state.Token("link_open", "a", 1);
					token_o.attrs = [["href", fullUrl]];
					token_o.level = level++;
					token_o.markup = "linkify";
					token_o.info = "auto";
					nodes.push(token_o);
					const token_t = new state.Token("text", "", 0);
					token_t.content = urlText;
					token_t.level = level;
					nodes.push(token_t);
					const token_c = new state.Token("link_close", "a", -1);
					token_c.level = --level;
					token_c.markup = "linkify";
					token_c.info = "auto";
					nodes.push(token_c);
					lastPos = links[ln].lastIndex;
				}
				if (lastPos < text.length) {
					const token = new state.Token("text", "", 0);
					token.content = text.slice(lastPos);
					token.level = level;
					nodes.push(token);
				}
				replacements.push({
					index: i,
					nodes
				});
			}
		}
		if (replacements.length > 0) {
			let newTokensLength = tokens.length;
			for (const replacement of replacements) newTokensLength += replacement.nodes.length - 1;
			const newTokens = new Array(newTokensLength);
			let replacementIndex = 0;
			let newTokenIndex = 0;
			replacements.reverse();
			for (let i = 0; i < tokens.length; i++) {
				const replacement = replacements[replacementIndex];
				if ((replacement === null || replacement === void 0 ? void 0 : replacement.index) === i) {
					for (const node of replacement.nodes) newTokens[newTokenIndex++] = node;
					replacementIndex++;
				} else newTokens[newTokenIndex++] = tokens[i];
			}
			blockTokens[j].children = newTokens;
		}
	}
}
//#endregion
//#region src/rules_core/replacements.ts
var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
var SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
var SCOPED_ABBR = {
	c: "©",
	r: "®",
	tm: "™"
};
function replaceFn(match, name) {
	return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
	let inside_autolink = 0;
	for (let i = inlineTokens.length - 1; i >= 0; i--) {
		const token = inlineTokens[i];
		if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
		if (token.type === "link_open" && token.info === "auto") inside_autolink--;
		if (token.type === "link_close" && token.info === "auto") inside_autolink++;
	}
}
function replace_rare(inlineTokens) {
	let inside_autolink = 0;
	for (let i = inlineTokens.length - 1; i >= 0; i--) {
		const token = inlineTokens[i];
		if (token.type === "text" && !inside_autolink) {
			if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–");
		}
		if (token.type === "link_open" && token.info === "auto") inside_autolink--;
		if (token.type === "link_close" && token.info === "auto") inside_autolink++;
	}
}
function replace(state) {
	let blkIdx;
	if (!state.md.options.typographer) return;
	for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
		if (state.tokens[blkIdx].type !== "inline") continue;
		if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) replace_scoped(state.tokens[blkIdx].children);
		if (RARE_RE.test(state.tokens[blkIdx].content)) replace_rare(state.tokens[blkIdx].children);
	}
}
//#endregion
//#region src/rules_core/smartquotes.ts
var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var APOSTROPHE = "’";
var MAX_OPENERS = 1e3;
function truncateStack(stack, heads, length) {
	while (stack.length > length) {
		const item = stack.pop();
		if (item.isSingleQuote) heads.single = item.prevSameQuoteIdx;
		else heads.double = item.prevSameQuoteIdx;
	}
}
function addReplacement(replacements, tokenIdx, pos, ch) {
	if (!replacements[tokenIdx]) replacements[tokenIdx] = [];
	replacements[tokenIdx].push({
		pos,
		ch
	});
}
function applyReplacements(str, replacements) {
	let result = "";
	let lastPos = 0;
	replacements.sort((a, b) => a.pos - b.pos);
	for (let i = 0; i < replacements.length; i++) {
		const replacement = replacements[i];
		result += str.slice(lastPos, replacement.pos) + replacement.ch;
		lastPos = replacement.pos + 1;
	}
	return result + str.slice(lastPos);
}
function process_inlines(tokens, state) {
	let j;
	const stack = [];
	const heads = {
		single: -1,
		double: -1
	};
	const replacements = {};
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const thisLevel = tokens[i].level;
		for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
		truncateStack(stack, heads, j + 1);
		if (token.type !== "text") continue;
		const text = token.content;
		let pos = 0;
		const max = text.length;
		OUTER: while (pos < max) {
			QUOTE_RE.lastIndex = pos;
			const t = QUOTE_RE.exec(text);
			if (!t) break;
			let canOpen = true;
			let canClose = true;
			pos = t.index + 1;
			const isSingle = t[0] === "'";
			let lastChar = 32;
			if (t.index - 1 >= 0) lastChar = text.charCodeAt(t.index - 1);
			else for (j = i - 1; j >= 0; j--) {
				if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
				if (!tokens[j].content) continue;
				lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
				break;
			}
			let nextChar = 32;
			if (pos < max) nextChar = text.charCodeAt(pos);
			else for (j = i + 1; j < tokens.length; j++) {
				if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
				if (!tokens[j].content) continue;
				nextChar = tokens[j].content.charCodeAt(0);
				break;
			}
			const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
			const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
			const isLastWhiteSpace = isWhiteSpace(lastChar);
			const isNextWhiteSpace = isWhiteSpace(nextChar);
			if (isNextWhiteSpace) canOpen = false;
			else if (isNextPunctChar) {
				if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
			}
			if (isLastWhiteSpace) canClose = false;
			else if (isLastPunctChar) {
				if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
			}
			if (nextChar === 34 && t[0] === "\"") {
				if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
			}
			if (canOpen && canClose) {
				canOpen = isLastPunctChar;
				canClose = isNextPunctChar;
			}
			if (!canOpen && !canClose) {
				if (isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
				continue;
			}
			if (canClose) {
				j = isSingle ? heads.single : heads.double;
				if (j >= 0 && stack[j].level === thisLevel) {
					const item = stack[j];
					let openQuote;
					let closeQuote;
					if (isSingle) {
						openQuote = state.md.options.quotes[2];
						closeQuote = state.md.options.quotes[3];
					} else {
						openQuote = state.md.options.quotes[0];
						closeQuote = state.md.options.quotes[1];
					}
					addReplacement(replacements, i, t.index, closeQuote);
					addReplacement(replacements, item.tokenIdx, item.contentPos, openQuote);
					truncateStack(stack, heads, j);
					continue OUTER;
				}
			}
			if (canOpen) {
				if (stack.length >= MAX_OPENERS) return;
				stack.push({
					tokenIdx: i,
					contentPos: t.index,
					isSingleQuote: isSingle,
					level: thisLevel,
					prevSameQuoteIdx: isSingle ? heads.single : heads.double
				});
				if (isSingle) heads.single = stack.length - 1;
				else heads.double = stack.length - 1;
			} else if (canClose && isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
		}
	}
	Object.keys(replacements).forEach(function(tokenIdx) {
		const idx = Number(tokenIdx);
		tokens[idx].content = applyReplacements(tokens[idx].content, replacements[tokenIdx]);
	});
}
function smartquotes(state) {
	if (!state.md.options.typographer) return;
	for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
		if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
		process_inlines(state.tokens[blkIdx].children, state);
	}
}
//#endregion
//#region src/rules_core/text_join.ts
function join_alt(tokens) {
	let curr, last;
	const max = tokens.length;
	for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
	for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
	else {
		if (curr !== last) tokens[last] = tokens[curr];
		last++;
	}
	if (curr !== last) tokens.length = last;
}
function text_join(state) {
	let curr, last;
	const blockTokens = state.tokens;
	const l = blockTokens.length;
	for (let j = 0; j < l; j++) {
		if (blockTokens[j].type !== "inline") continue;
		const tokens = blockTokens[j].children;
		const max = tokens.length;
		for (curr = 0; curr < max; curr++) {
			if (tokens[curr].type === "text_special") tokens[curr].type = "text";
			if (tokens[curr].children) join_alt(tokens[curr].children);
		}
		for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
		else {
			if (curr !== last) tokens[last] = tokens[curr];
			last++;
		}
		if (curr !== last) tokens.length = last;
	}
}
//#endregion
//#region src/parser_core.ts
var _rules$2 = [
	["normalize", normalize],
	["block", block],
	["strip_references", strip_references],
	["inline", inline],
	["linkify", linkify$1],
	["replacements", replace],
	["smartquotes", smartquotes],
	["text_join", text_join]
];
/**
* Top-level rules executor. Glues block/inline parsers and does intermediate
* transformations.
*/
var ParserCore = class {
	constructor() {
		_defineProperty(
			this,
			/**
			* {@link Ruler} instance. Keep configuration of core rules.
			*/
			"ruler",
			new Ruler()
		);
		_defineProperty(this, "State", StateCore);
		for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
	}
	/**
	* Executes core chain rules.
	*/
	process(state) {
		const rules = this.ruler.getRules("");
		for (let i = 0, l = rules.length; i < l; i++) rules[i](state);
	}
};
//#endregion
//#region src/rules_block/state_block.ts
/** Mutable state passed to block rules while tokenizing a source document. */
var StateBlock = class {
	constructor(src, md, env, tokens) {
		_defineProperty(this, "bMarks", []);
		_defineProperty(this, "eMarks", []);
		_defineProperty(this, "tShift", []);
		_defineProperty(this, "sCount", []);
		_defineProperty(this, "bsCount", []);
		_defineProperty(this, "blkIndent", 0);
		_defineProperty(this, "line", 0);
		_defineProperty(this, "lineMax", 0);
		_defineProperty(this, "tight", false);
		_defineProperty(this, "listIndent", -1);
		_defineProperty(this, "parentType", "root");
		_defineProperty(this, "level", 0);
		_defineProperty(this, "Token", Token);
		this.src = src;
		this.md = md;
		this.env = env;
		this.tokens = tokens;
		const s = this.src;
		for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
			const ch = s.charCodeAt(pos);
			if (!indent_found) if (isSpace(ch)) {
				indent++;
				if (ch === 9) offset += 4 - offset % 4;
				else offset++;
				continue;
			} else indent_found = true;
			if (ch === 10 || pos === len - 1) {
				if (ch !== 10) pos++;
				this.bMarks.push(start);
				this.eMarks.push(pos);
				this.tShift.push(indent);
				this.sCount.push(offset);
				this.bsCount.push(0);
				indent_found = false;
				indent = 0;
				offset = 0;
				start = pos + 1;
			}
		}
		this.bMarks.push(s.length);
		this.eMarks.push(s.length);
		this.tShift.push(0);
		this.sCount.push(0);
		this.bsCount.push(0);
		this.lineMax = this.bMarks.length - 1;
	}
	push(type, tag, nesting) {
		const token = new Token(type, tag, nesting);
		token.block = true;
		if (nesting < 0) this.level--;
		token.level = this.level;
		if (nesting > 0) this.level++;
		this.tokens.push(token);
		return token;
	}
	isEmpty(line) {
		return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
	}
	skipEmptyLines(from) {
		for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
		return from;
	}
	skipSpaces(pos) {
		for (let max = this.src.length; pos < max; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
		return pos;
	}
	skipSpacesBack(pos, min) {
		if (pos <= min) return pos;
		while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
		return pos;
	}
	skipChars(pos, code) {
		for (let max = this.src.length; pos < max; pos++) if (this.src.charCodeAt(pos) !== code) break;
		return pos;
	}
	skipCharsBack(pos, code, min) {
		if (pos <= min) return pos;
		while (pos > min) if (code !== this.src.charCodeAt(--pos)) return pos + 1;
		return pos;
	}
	getLines(begin, end, indent, keepLastLF) {
		if (begin >= end) return "";
		const queue = new Array(end - begin);
		for (let i = 0, line = begin; line < end; line++, i++) {
			let lineIndent = 0;
			const lineStart = this.bMarks[line];
			let first = lineStart;
			let last;
			if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
			else last = this.eMarks[line];
			while (first < last && lineIndent < indent) {
				const ch = this.src.charCodeAt(first);
				if (isSpace(ch)) if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
				else lineIndent++;
				else if (first - lineStart < this.tShift[line]) lineIndent++;
				else break;
				first++;
			}
			if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
			else queue[i] = this.src.slice(first, last);
		}
		return queue.join("");
	}
};
//#endregion
//#region src/rules_block/table.ts
var MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state, line) {
	const pos = state.bMarks[line] + state.tShift[line];
	const max = state.eMarks[line];
	return state.src.slice(pos, max);
}
function escapedSplit(str) {
	const result = [];
	const max = str.length;
	let pos = 0;
	let ch = str.charCodeAt(pos);
	let isEscaped = false;
	let lastPos = 0;
	let current = "";
	while (pos < max) {
		if (ch === 124) if (!isEscaped) {
			result.push(current + str.substring(lastPos, pos));
			current = "";
			lastPos = pos + 1;
		} else {
			current += str.substring(lastPos, pos - 1);
			lastPos = pos;
		}
		isEscaped = ch === 92;
		pos++;
		ch = str.charCodeAt(pos);
	}
	result.push(current + str.substring(lastPos));
	return result;
}
function table(state, startLine, endLine, silent) {
	if (startLine + 2 > endLine) return false;
	let nextLine = startLine + 1;
	if (state.sCount[nextLine] < state.blkIndent) return false;
	if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
	let pos = state.bMarks[nextLine] + state.tShift[nextLine];
	if (pos >= state.eMarks[nextLine]) return false;
	const firstCh = state.src.charCodeAt(pos++);
	if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
	if (pos >= state.eMarks[nextLine]) return false;
	const secondCh = state.src.charCodeAt(pos++);
	if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
	if (firstCh === 45 && isSpace(secondCh)) return false;
	while (pos < state.eMarks[nextLine]) {
		const ch = state.src.charCodeAt(pos);
		if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
		pos++;
	}
	let lineText = getLine(state, startLine + 1);
	let columns = lineText.split("|");
	const aligns = [];
	for (let i = 0; i < columns.length; i++) {
		const t = columns[i].trim();
		if (!t) if (i === 0 || i === columns.length - 1) continue;
		else return false;
		if (!/^:?-+:?$/.test(t)) return false;
		if (t.charCodeAt(t.length - 1) === 58) aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
		else if (t.charCodeAt(0) === 58) aligns.push("left");
		else aligns.push("");
	}
	lineText = getLine(state, startLine).trim();
	if (lineText.indexOf("|") === -1) return false;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	columns = escapedSplit(lineText);
	if (columns.length && columns[0] === "") columns.shift();
	if (columns.length && columns[columns.length - 1] === "") columns.pop();
	const columnCount = columns.length;
	if (columnCount === 0 || columnCount !== aligns.length) return false;
	if (silent) return true;
	const oldParentType = state.parentType;
	state.parentType = "table";
	const terminatorRules = state.md.block.ruler.getRules("blockquote");
	const token_to = state.push("table_open", "table", 1);
	const tableLines = [startLine, 0];
	token_to.map = tableLines;
	const token_tho = state.push("thead_open", "thead", 1);
	token_tho.map = [startLine, startLine + 1];
	const token_htro = state.push("tr_open", "tr", 1);
	token_htro.map = [startLine, startLine + 1];
	for (let i = 0; i < columns.length; i++) {
		const token_ho = state.push("th_open", "th", 1);
		if (aligns[i]) token_ho.attrs = [["style", `text-align:${aligns[i]}`]];
		const token_il = state.push("inline", "", 0);
		token_il.content = columns[i].trim();
		token_il.children = [];
		state.push("th_close", "th", -1);
	}
	state.push("tr_close", "tr", -1);
	state.push("thead_close", "thead", -1);
	let tbodyLines;
	let autocompletedCells = 0;
	for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
		if (state.sCount[nextLine] < state.blkIndent) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
		lineText = getLine(state, nextLine).trim();
		if (!lineText) break;
		if (state.sCount[nextLine] - state.blkIndent >= 4) break;
		columns = escapedSplit(lineText);
		if (columns.length && columns[0] === "") columns.shift();
		if (columns.length && columns[columns.length - 1] === "") columns.pop();
		autocompletedCells += columnCount - columns.length;
		if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
		if (nextLine === startLine + 2) {
			const token_tbo = state.push("tbody_open", "tbody", 1);
			token_tbo.map = tbodyLines = [startLine + 2, 0];
		}
		const token_tro = state.push("tr_open", "tr", 1);
		token_tro.map = [nextLine, nextLine + 1];
		for (let i = 0; i < columnCount; i++) {
			const token_tdo = state.push("td_open", "td", 1);
			if (aligns[i]) token_tdo.attrs = [["style", `text-align:${aligns[i]}`]];
			const token_il = state.push("inline", "", 0);
			token_il.content = columns[i] ? columns[i].trim() : "";
			token_il.children = [];
			state.push("td_close", "td", -1);
		}
		state.push("tr_close", "tr", -1);
	}
	if (tbodyLines) {
		state.push("tbody_close", "tbody", -1);
		tbodyLines[1] = nextLine;
	}
	state.push("table_close", "table", -1);
	tableLines[1] = nextLine;
	state.parentType = oldParentType;
	state.line = nextLine;
	return true;
}
//#endregion
//#region src/rules_block/code.ts
function code(state, startLine, endLine) {
	if (state.sCount[startLine] - state.blkIndent < 4) return false;
	let nextLine = startLine + 1;
	let last = nextLine;
	while (nextLine < endLine) {
		if (state.isEmpty(nextLine)) {
			nextLine++;
			continue;
		}
		if (state.sCount[nextLine] - state.blkIndent >= 4) {
			nextLine++;
			last = nextLine;
			continue;
		}
		break;
	}
	state.line = last;
	const token = state.push("code_block", "code", 0);
	token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
	token.map = [startLine, state.line];
	return true;
}
//#endregion
//#region src/rules_block/fence.ts
function fence(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (pos + 3 > max) return false;
	const marker = state.src.charCodeAt(pos);
	if (marker !== 126 && marker !== 96) return false;
	let mem = pos;
	pos = state.skipChars(pos, marker);
	let len = pos - mem;
	if (len < 3) return false;
	const markup = state.src.slice(mem, pos);
	const params = state.src.slice(pos, max);
	if (marker === 96) {
		if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
	}
	if (silent) return true;
	let nextLine = startLine;
	let haveEndMarker = false;
	for (;;) {
		nextLine++;
		if (nextLine >= endLine) break;
		pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
		if (state.src.charCodeAt(pos) !== marker) continue;
		if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
		pos = state.skipChars(pos, marker);
		if (pos - mem < len) continue;
		pos = state.skipSpaces(pos);
		if (pos < max) continue;
		haveEndMarker = true;
		break;
	}
	len = state.sCount[startLine];
	state.line = nextLine + (haveEndMarker ? 1 : 0);
	const token = state.push("fence", "code", 0);
	token.info = params;
	token.content = state.getLines(startLine + 1, nextLine, len, true);
	token.markup = markup;
	token.map = [startLine, state.line];
	return true;
}
//#endregion
//#region src/rules_block/blockquote.ts
function blockquote(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	const oldLineMax = state.lineMax;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (state.src.charCodeAt(pos) !== 62) return false;
	if (silent) return true;
	const oldBMarks = [];
	const oldBSCount = [];
	const oldSCount = [];
	const oldTShift = [];
	const terminatorRules = state.md.block.ruler.getRules("blockquote");
	const oldParentType = state.parentType;
	state.parentType = "blockquote";
	let lastLineEmpty = false;
	let nextLine;
	for (nextLine = startLine; nextLine < endLine; nextLine++) {
		const isOutdented = state.sCount[nextLine] < state.blkIndent;
		pos = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		if (pos >= max) break;
		if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
			let initial = state.sCount[nextLine] + 1;
			let spaceAfterMarker;
			let adjustTab;
			if (state.src.charCodeAt(pos) === 32) {
				pos++;
				initial++;
				adjustTab = false;
				spaceAfterMarker = true;
			} else if (state.src.charCodeAt(pos) === 9) {
				spaceAfterMarker = true;
				if ((state.bsCount[nextLine] + initial) % 4 === 3) {
					pos++;
					initial++;
					adjustTab = false;
				} else adjustTab = true;
			} else spaceAfterMarker = false;
			let offset = initial;
			oldBMarks.push(state.bMarks[nextLine]);
			state.bMarks[nextLine] = pos;
			while (pos < max) {
				const ch = state.src.charCodeAt(pos);
				if (isSpace(ch)) if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
				else offset++;
				else break;
				pos++;
			}
			lastLineEmpty = pos >= max;
			oldBSCount.push(state.bsCount[nextLine]);
			state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
			oldSCount.push(state.sCount[nextLine]);
			state.sCount[nextLine] = offset - initial;
			oldTShift.push(state.tShift[nextLine]);
			state.tShift[nextLine] = pos - state.bMarks[nextLine];
			continue;
		}
		if (lastLineEmpty) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) {
			state.lineMax = nextLine;
			if (state.blkIndent !== 0) {
				oldBMarks.push(state.bMarks[nextLine]);
				oldBSCount.push(state.bsCount[nextLine]);
				oldTShift.push(state.tShift[nextLine]);
				oldSCount.push(state.sCount[nextLine]);
				state.sCount[nextLine] -= state.blkIndent;
			}
			break;
		}
		oldBMarks.push(state.bMarks[nextLine]);
		oldBSCount.push(state.bsCount[nextLine]);
		oldTShift.push(state.tShift[nextLine]);
		oldSCount.push(state.sCount[nextLine]);
		state.sCount[nextLine] = -1;
	}
	const oldIndent = state.blkIndent;
	state.blkIndent = 0;
	const token_o = state.push("blockquote_open", "blockquote", 1);
	token_o.markup = ">";
	const lines = [startLine, 0];
	token_o.map = lines;
	state.md.block.tokenize(state, startLine, nextLine);
	const token_c = state.push("blockquote_close", "blockquote", -1);
	token_c.markup = ">";
	state.lineMax = oldLineMax;
	state.parentType = oldParentType;
	lines[1] = state.line;
	for (let i = 0; i < oldTShift.length; i++) {
		state.bMarks[i + startLine] = oldBMarks[i];
		state.tShift[i + startLine] = oldTShift[i];
		state.sCount[i + startLine] = oldSCount[i];
		state.bsCount[i + startLine] = oldBSCount[i];
	}
	state.blkIndent = oldIndent;
	return true;
}
//#endregion
//#region src/rules_block/hr.ts
function hr(state, startLine, endLine, silent) {
	const max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	const marker = state.src.charCodeAt(pos++);
	if (marker !== 42 && marker !== 45 && marker !== 95) return false;
	let cnt = 1;
	while (pos < max) {
		const ch = state.src.charCodeAt(pos++);
		if (ch !== marker && !isSpace(ch)) return false;
		if (ch === marker) cnt++;
	}
	if (cnt < 3) return false;
	if (silent) return true;
	state.line = startLine + 1;
	const token = state.push("hr", "hr", 0);
	token.map = [startLine, state.line];
	token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
	return true;
}
//#endregion
//#region src/rules_block/list.ts
function skipBulletListMarker(state, startLine) {
	const max = state.eMarks[startLine];
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	const marker = state.src.charCodeAt(pos++);
	if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
	if (pos < max) {
		if (!isSpace(state.src.charCodeAt(pos))) return -1;
	}
	return pos;
}
function skipOrderedListMarker(state, startLine) {
	const start = state.bMarks[startLine] + state.tShift[startLine];
	const max = state.eMarks[startLine];
	let pos = start;
	if (pos + 1 >= max) return -1;
	let ch = state.src.charCodeAt(pos++);
	if (ch < 48 || ch > 57) return -1;
	for (;;) {
		if (pos >= max) return -1;
		ch = state.src.charCodeAt(pos++);
		if (ch >= 48 && ch <= 57) {
			if (pos - start >= 10) return -1;
			continue;
		}
		if (ch === 41 || ch === 46) break;
		return -1;
	}
	if (pos < max) {
		ch = state.src.charCodeAt(pos);
		if (!isSpace(ch)) return -1;
	}
	return pos;
}
function markTightParagraphs(state, idx) {
	const level = state.level + 2;
	for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
		state.tokens[i + 2].hidden = true;
		state.tokens[i].hidden = true;
		i += 2;
	}
}
function list(state, startLine, endLine, silent) {
	let max, pos, start, token;
	let nextLine = startLine;
	let tight = true;
	if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
	if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) return false;
	let isTerminatingParagraph = false;
	if (silent && state.parentType === "paragraph") {
		if (state.sCount[nextLine] >= state.blkIndent) isTerminatingParagraph = true;
	}
	let isOrdered;
	let markerValue;
	let posAfterMarker;
	if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
		isOrdered = true;
		start = state.bMarks[nextLine] + state.tShift[nextLine];
		markerValue = Number(state.src.slice(start, posAfterMarker - 1));
		if (isTerminatingParagraph && markerValue !== 1) return false;
	} else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) isOrdered = false;
	else return false;
	if (isTerminatingParagraph) {
		if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
	}
	if (silent) return true;
	const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
	const listTokIdx = state.tokens.length;
	if (isOrdered) {
		token = state.push("ordered_list_open", "ol", 1);
		if (markerValue !== 1) token.attrs = [["start", markerValue]];
	} else token = state.push("bullet_list_open", "ul", 1);
	const listLines = [nextLine, 0];
	token.map = listLines;
	token.markup = String.fromCharCode(markerCharCode);
	let prevEmptyEnd = false;
	const terminatorRules = state.md.block.ruler.getRules("list");
	const oldParentType = state.parentType;
	state.parentType = "list";
	while (nextLine < endLine) {
		pos = posAfterMarker;
		max = state.eMarks[nextLine];
		const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
		let offset = initial;
		while (pos < max) {
			const ch = state.src.charCodeAt(pos);
			if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
			else if (ch === 32) offset++;
			else break;
			pos++;
		}
		const contentStart = pos;
		let indentAfterMarker;
		if (contentStart >= max) indentAfterMarker = 1;
		else indentAfterMarker = offset - initial;
		if (indentAfterMarker > 4) indentAfterMarker = 1;
		const indent = initial + indentAfterMarker;
		token = state.push("list_item_open", "li", 1);
		token.markup = String.fromCharCode(markerCharCode);
		const itemLines = [nextLine, 0];
		token.map = itemLines;
		if (isOrdered) token.info = state.src.slice(start, posAfterMarker - 1);
		const oldTight = state.tight;
		const oldTShift = state.tShift[nextLine];
		const oldSCount = state.sCount[nextLine];
		const oldListIndent = state.listIndent;
		state.listIndent = state.blkIndent;
		state.blkIndent = indent;
		state.tight = true;
		state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
		state.sCount[nextLine] = offset;
		if (contentStart >= max && state.isEmpty(nextLine + 1)) state.line = Math.min(state.line + 2, endLine);
		else state.md.block.tokenize(state, nextLine, endLine);
		if (!state.tight || prevEmptyEnd) tight = false;
		prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
		state.blkIndent = state.listIndent;
		state.listIndent = oldListIndent;
		state.tShift[nextLine] = oldTShift;
		state.sCount[nextLine] = oldSCount;
		state.tight = oldTight;
		token = state.push("list_item_close", "li", -1);
		token.markup = String.fromCharCode(markerCharCode);
		nextLine = state.line;
		itemLines[1] = nextLine;
		if (nextLine >= endLine) break;
		if (state.sCount[nextLine] < state.blkIndent) break;
		if (state.sCount[nextLine] - state.blkIndent >= 4) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
		if (isOrdered) {
			posAfterMarker = skipOrderedListMarker(state, nextLine);
			if (posAfterMarker < 0) break;
			start = state.bMarks[nextLine] + state.tShift[nextLine];
		} else {
			posAfterMarker = skipBulletListMarker(state, nextLine);
			if (posAfterMarker < 0) break;
		}
		if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
	}
	if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
	else token = state.push("bullet_list_close", "ul", -1);
	token.markup = String.fromCharCode(markerCharCode);
	listLines[1] = nextLine;
	state.line = nextLine;
	state.parentType = oldParentType;
	if (tight) markTightParagraphs(state, listTokIdx);
	return true;
}
//#endregion
//#region src/rules_block/reference.ts
function reference(state, startLine, _endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	let nextLine = startLine + 1;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (state.src.charCodeAt(pos) !== 91) return false;
	function getNextLine(nextLine) {
		const endLine = state.lineMax;
		if (nextLine >= endLine || state.isEmpty(nextLine)) return null;
		let isContinuation = false;
		if (state.sCount[nextLine] - state.blkIndent > 3) isContinuation = true;
		if (state.sCount[nextLine] < 0) isContinuation = true;
		if (!isContinuation) {
			const terminatorRules = state.md.block.ruler.getRules("reference");
			const oldParentType = state.parentType;
			state.parentType = "reference";
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			state.parentType = oldParentType;
			if (terminate) return null;
		}
		const pos = state.bMarks[nextLine] + state.tShift[nextLine];
		const max = state.eMarks[nextLine];
		return state.src.slice(pos, max + 1);
	}
	let str = state.src.slice(pos, max + 1);
	max = str.length;
	let labelEnd = -1;
	for (pos = 1; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 91) return false;
		else if (ch === 93) {
			labelEnd = pos;
			break;
		} else if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (ch === 92) {
			pos++;
			if (pos < max && str.charCodeAt(pos) === 10) {
				const lineContent = getNextLine(nextLine);
				if (lineContent !== null) {
					str += lineContent;
					max = str.length;
					nextLine++;
				}
			}
		}
	}
	if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) return false;
	for (pos = labelEnd + 2; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (isSpace(ch)) {} else break;
	}
	const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
	if (!destRes.ok) return false;
	const href = state.md.normalizeLink(destRes.str);
	if (!state.md.validateLink(href)) return false;
	pos = destRes.pos;
	const destEndPos = pos;
	const destEndLineNo = nextLine;
	const start = pos;
	for (; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (isSpace(ch)) {} else break;
	}
	let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
	while (titleRes.can_continue) {
		const lineContent = getNextLine(nextLine);
		if (lineContent === null) break;
		str += lineContent;
		pos = max;
		max = str.length;
		nextLine++;
		titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
	}
	let title;
	if (pos < max && start !== pos && titleRes.ok) {
		title = titleRes.str;
		pos = titleRes.pos;
	} else {
		title = "";
		pos = destEndPos;
		nextLine = destEndLineNo;
	}
	while (pos < max) {
		if (!isSpace(str.charCodeAt(pos))) break;
		pos++;
	}
	if (pos < max && str.charCodeAt(pos) !== 10) {
		if (title) {
			title = "";
			pos = destEndPos;
			nextLine = destEndLineNo;
			while (pos < max) {
				if (!isSpace(str.charCodeAt(pos))) break;
				pos++;
			}
		}
	}
	if (pos < max && str.charCodeAt(pos) !== 10) return false;
	const label = normalizeReference(str.slice(1, labelEnd));
	if (!label) return false;
	/* istanbul ignore if */
	if (silent) return true;
	if (typeof state.env.references === "undefined") state.env.references = {};
	if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
		title,
		href
	};
	const token = state.push("reference_definition", "", 0);
	token.map = [startLine, nextLine];
	token.hidden = true;
	const meta = Object.create(null);
	meta.label = label;
	token.meta = meta;
	state.line = nextLine;
	return true;
}
//#endregion
//#region src/common/html_blocks.ts
var html_blocks_default = [
	"address",
	"article",
	"aside",
	"base",
	"basefont",
	"blockquote",
	"body",
	"caption",
	"center",
	"col",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"iframe",
	"legend",
	"li",
	"link",
	"main",
	"menu",
	"menuitem",
	"nav",
	"noframes",
	"ol",
	"optgroup",
	"option",
	"p",
	"param",
	"search",
	"section",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"track",
	"ul"
];
//#endregion
//#region src/common/html_re.ts
var open_tag = `<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`;
var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
var HTML_TAG_RE = new RegExp(`^(?:${open_tag}|${close_tag}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`);
var HTML_OPEN_CLOSE_TAG_RE = new RegExp(`^(?:${open_tag}|${close_tag})`);
//#endregion
//#region src/rules_block/html_block.ts
var HTML_SEQUENCES = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		true
	],
	[
		/^<!--/,
		/-->/,
		true
	],
	[
		/^<\?/,
		/\?>/,
		true
	],
	[
		/^<![A-Za-z]/,
		/>/,
		true
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		true
	],
	[
		new RegExp(`^</?(${html_blocks_default.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		true
	],
	[
		new RegExp(`${HTML_OPEN_CLOSE_TAG_RE.source}\\s*$`),
		/^$/,
		false
	]
];
function html_block(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (!state.md.options.html) return false;
	if (state.src.charCodeAt(pos) !== 60) return false;
	let lineText = state.src.slice(pos, max);
	let i = 0;
	for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
	if (i === HTML_SEQUENCES.length) return false;
	if (silent) return HTML_SEQUENCES[i][2];
	let nextLine = startLine + 1;
	const endsOnBlankLine = HTML_SEQUENCES[i][1].test("");
	if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
		if (state.sCount[nextLine] < state.blkIndent) {
			if (endsOnBlankLine || !state.isEmpty(nextLine)) break;
		}
		pos = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		lineText = state.src.slice(pos, max);
		if (HTML_SEQUENCES[i][1].test(lineText)) {
			if (lineText.length !== 0) nextLine++;
			break;
		}
	}
	state.line = nextLine;
	const token = state.push("html_block", "", 0);
	token.map = [startLine, nextLine];
	token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
	return true;
}
//#endregion
//#region src/rules_block/heading.ts
function heading(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	let ch = state.src.charCodeAt(pos);
	if (ch !== 35 || pos >= max) return false;
	let level = 1;
	ch = state.src.charCodeAt(++pos);
	while (ch === 35 && pos < max && level <= 6) {
		level++;
		ch = state.src.charCodeAt(++pos);
	}
	if (level > 6 || pos < max && !isSpace(ch)) return false;
	if (silent) return true;
	max = state.skipSpacesBack(max, pos);
	const tmp = state.skipCharsBack(max, 35, pos);
	if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
	state.line = startLine + 1;
	const token_o = state.push("heading_open", `h${level}`, 1);
	token_o.markup = "########".slice(0, level);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = asciiTrim(state.src.slice(pos, max));
	token_i.map = [startLine, state.line];
	token_i.children = [];
	const token_c = state.push("heading_close", `h${level}`, -1);
	token_c.markup = "########".slice(0, level);
	return true;
}
//#endregion
//#region src/rules_block/lheading.ts
function lheading(state, startLine, endLine) {
	const terminatorRules = state.md.block.ruler.getRules("paragraph");
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	const oldParentType = state.parentType;
	state.parentType = "paragraph";
	let level = 0;
	let marker;
	let nextLine = startLine + 1;
	for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
		if (state.sCount[nextLine] - state.blkIndent > 3) continue;
		if (state.sCount[nextLine] >= state.blkIndent) {
			let pos = state.bMarks[nextLine] + state.tShift[nextLine];
			const max = state.eMarks[nextLine];
			if (pos < max) {
				marker = state.src.charCodeAt(pos);
				if (marker === 45 || marker === 61) {
					pos = state.skipChars(pos, marker);
					pos = state.skipSpaces(pos);
					if (pos >= max) {
						level = marker === 61 ? 1 : 2;
						break;
					}
				}
			}
		}
		if (state.sCount[nextLine] < 0) continue;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
	}
	if (!level) {
		state.parentType = oldParentType;
		return false;
	}
	const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
	state.line = nextLine + 1;
	const token_o = state.push("heading_open", `h${level}`, 1);
	token_o.markup = String.fromCharCode(marker);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = content;
	token_i.map = [startLine, state.line - 1];
	token_i.children = [];
	const token_c = state.push("heading_close", `h${level}`, -1);
	token_c.markup = String.fromCharCode(marker);
	state.parentType = oldParentType;
	return true;
}
//#endregion
//#region src/rules_block/paragraph.ts
function paragraph(state, startLine, endLine) {
	const terminatorRules = state.md.block.ruler.getRules("paragraph");
	const oldParentType = state.parentType;
	let nextLine = startLine + 1;
	state.parentType = "paragraph";
	for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
		if (state.sCount[nextLine] - state.blkIndent > 3) continue;
		if (state.sCount[nextLine] < 0) continue;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
	}
	const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
	state.line = nextLine;
	const token_o = state.push("paragraph_open", "p", 1);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = content;
	token_i.map = [startLine, state.line];
	token_i.children = [];
	state.push("paragraph_close", "p", -1);
	state.parentType = oldParentType;
	return true;
}
//#endregion
//#region src/parser_block.ts
var _rules$1 = [
	[
		"table",
		table,
		["paragraph", "reference"]
	],
	["code", code],
	[
		"fence",
		fence,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		blockquote,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		hr,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		list,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", reference],
	[
		"html_block",
		html_block,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		heading,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", lheading],
	["paragraph", paragraph]
];
/**
* Block-level tokenizer.
*/
var ParserBlock = class {
	constructor() {
		_defineProperty(
			this,
			/**
			* {@link Ruler} instance. Keep configuration of block rules.
			*/
			"ruler",
			new Ruler()
		);
		_defineProperty(this, "State", StateBlock);
		for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
	}
	tokenize(state, startLine, endLine) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		let line = startLine;
		let hasEmptyLines = false;
		while (line < endLine) {
			state.line = line = state.skipEmptyLines(line);
			if (line >= endLine) break;
			if (state.sCount[line] < state.blkIndent) break;
			if (state.level >= maxNesting) {
				state.line = endLine;
				break;
			}
			const prevLine = state.line;
			let ok = false;
			for (let i = 0; i < len; i++) {
				ok = rules[i](state, line, endLine, false);
				if (ok) {
					if (prevLine >= state.line) throw new Error("block rule didn't increment state.line");
					break;
				}
			}
			if (!ok) throw new Error("none of the block rules matched");
			state.tight = !hasEmptyLines;
			if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
			line = state.line;
			if (line < endLine && state.isEmpty(line)) {
				hasEmptyLines = true;
				line++;
				state.line = line;
			}
		}
	}
	/**
	* Process input string and push block tokens into `outTokens`
	*/
	parse(src, md, env, outTokens) {
		if (!src) return;
		const state = new this.State(src, md, env, outTokens);
		this.tokenize(state, state.line, state.lineMax);
	}
};
//#endregion
//#region src/rules_inline/state_inline.ts
/** Mutable state passed to inline rules while tokenizing inline content. */
var StateInline = class {
	constructor(src, md, env, outTokens) {
		_defineProperty(this, "pos", 0);
		_defineProperty(this, "level", 0);
		_defineProperty(this, "pending", "");
		_defineProperty(this, "pendingLevel", 0);
		_defineProperty(this, "cache", {});
		_defineProperty(this, "backticks", {});
		_defineProperty(this, "backticksScanned", false);
		_defineProperty(this, "linkLevel", 0);
		_defineProperty(this, "delimiters", []);
		_defineProperty(this, "_prev_delimiters", []);
		_defineProperty(this, "Token", Token);
		this.src = src;
		this.env = env;
		this.md = md;
		this.tokens = outTokens;
		this.tokens_meta = Array(outTokens.length);
		this.posMax = this.src.length;
	}
	pushPending() {
		const token = new Token("text", "", 0);
		token.content = this.pending;
		token.level = this.pendingLevel;
		this.tokens.push(token);
		this.pending = "";
		return token;
	}
	push(type, tag, nesting) {
		if (this.pending) this.pushPending();
		const token = new Token(type, tag, nesting);
		let token_meta = void 0;
		if (nesting < 0) {
			this.level--;
			this.delimiters = this._prev_delimiters.pop();
		}
		token.level = this.level;
		if (nesting > 0) {
			this.level++;
			this._prev_delimiters.push(this.delimiters);
			this.delimiters = [];
			token_meta = { delimiters: this.delimiters };
		}
		this.pendingLevel = this.level;
		this.tokens.push(token);
		this.tokens_meta.push(token_meta);
		return token;
	}
	scanDelims(start, canSplitWord) {
		const max = this.posMax;
		const marker = this.src.charCodeAt(start);
		let lastChar;
		if (start === 0) lastChar = 32;
		else if (start === 1) {
			lastChar = this.src.charCodeAt(0);
			if ((lastChar & 63488) === 55296) lastChar = 65533;
		} else {
			lastChar = this.src.charCodeAt(start - 1);
			if ((lastChar & 64512) === 56320) {
				const highSurr = this.src.charCodeAt(start - 2);
				lastChar = (highSurr & 64512) === 55296 ? 65536 + (highSurr - 55296 << 10) + (lastChar - 56320) : 65533;
			} else if ((lastChar & 64512) === 55296) lastChar = 65533;
		}
		let pos = start;
		while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
		const count = pos - start;
		let nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
		if ((nextChar & 64512) === 55296) {
			const lowSurr = this.src.charCodeAt(pos + 1);
			nextChar = (lowSurr & 64512) === 56320 ? 65536 + (nextChar - 55296 << 10) + (lowSurr - 56320) : 65533;
		} else if ((nextChar & 64512) === 56320) nextChar = 65533;
		const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
		const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
		const isLastWhiteSpace = isWhiteSpace(lastChar);
		const isNextWhiteSpace = isWhiteSpace(nextChar);
		const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
		const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
		return {
			can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
			can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
			length: count
		};
	}
};
//#endregion
//#region src/rules_inline/text.ts
function isTerminatorChar(ch) {
	switch (ch) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return true;
		default: return false;
	}
}
function text(state, silent) {
	let pos = state.pos;
	while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) pos++;
	if (pos === state.pos) return false;
	if (!silent) state.pending += state.src.slice(state.pos, pos);
	state.pos = pos;
	return true;
}
//#endregion
//#region src/rules_inline/linkify.ts
function isAsciiAlpha(code) {
	return code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function isSchemeChar(code) {
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 45 || code === 46;
}
function linkify(state, silent) {
	if (!state.md.options.linkify) return false;
	if (state.linkLevel > 0) return false;
	const pos = state.pos;
	const max = state.posMax;
	if (pos + 3 > max) return false;
	if (state.src.charCodeAt(pos) !== 58) return false;
	if (state.src.charCodeAt(pos + 1) !== 47) return false;
	if (state.src.charCodeAt(pos + 2) !== 47) return false;
	const protoMin = pos - Math.min(10, state.pending.length, pos);
	let protoStart = pos;
	while (protoStart > protoMin && isSchemeChar(state.src.charCodeAt(protoStart - 1))) protoStart--;
	if (protoStart === pos || !isAsciiAlpha(state.src.charCodeAt(protoStart))) return false;
	const protoLength = pos - protoStart;
	const link = state.md.linkify.matchAtStart(state.src.slice(protoStart));
	if (!link) return false;
	let url = link.url;
	if (url.length <= protoLength) return false;
	let urlEnd = url.length;
	while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
	if (urlEnd !== url.length) url = url.slice(0, urlEnd);
	const fullUrl = state.md.normalizeLink(url);
	if (!state.md.validateLink(fullUrl)) return false;
	if (!silent) {
		state.pending = state.pending.slice(0, -protoLength);
		const token_o = state.push("link_open", "a", 1);
		token_o.attrs = [["href", fullUrl]];
		token_o.markup = "linkify";
		token_o.info = "auto";
		const token_t = state.push("text", "", 0);
		token_t.content = state.md.normalizeLinkText(url);
		const token_c = state.push("link_close", "a", -1);
		token_c.markup = "linkify";
		token_c.info = "auto";
	}
	state.pos += url.length - protoLength;
	return true;
}
//#endregion
//#region src/rules_inline/newline.ts
function newline(state, silent) {
	let pos = state.pos;
	if (state.src.charCodeAt(pos) !== 10) return false;
	const pmax = state.pending.length - 1;
	const max = state.posMax;
	if (!silent) if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
		let ws = pmax - 1;
		while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
		state.pending = state.pending.slice(0, ws);
		state.push("hardbreak", "br", 0);
	} else {
		state.pending = state.pending.slice(0, -1);
		state.push("softbreak", "br", 0);
	}
	else state.push("softbreak", "br", 0);
	pos++;
	while (pos < max && isSpace(state.src.charCodeAt(pos))) pos++;
	state.pos = pos;
	return true;
}
//#endregion
//#region src/rules_inline/escape.ts
var ESCAPED = [];
for (let i = 0; i < 256; i++) ESCAPED.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
	ESCAPED[ch.charCodeAt(0)] = 1;
});
function escape(state, silent) {
	let pos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(pos) !== 92) return false;
	pos++;
	if (pos >= max) return false;
	let ch1 = state.src.charCodeAt(pos);
	if (ch1 === 10) {
		if (!silent) state.push("hardbreak", "br", 0);
		pos++;
		while (pos < max) {
			ch1 = state.src.charCodeAt(pos);
			if (!isSpace(ch1)) break;
			pos++;
		}
		state.pos = pos;
		return true;
	}
	if (ch1 === 32) {
		if (!silent) {
			const token = state.push("text_special", "", 0);
			token.content = "\\";
			token.markup = "\\";
			token.info = "escape";
		}
		state.pos = pos;
		return true;
	}
	let escapedStr = state.src[pos];
	if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
		const ch2 = state.src.charCodeAt(pos + 1);
		if (ch2 >= 56320 && ch2 <= 57343) {
			escapedStr += state.src[pos + 1];
			pos++;
		}
	}
	const origStr = "\\" + escapedStr;
	if (!silent) {
		const token = state.push("text_special", "", 0);
		if (ch1 < 256 && ESCAPED[ch1] !== 0) token.content = escapedStr;
		else token.content = origStr;
		token.markup = origStr;
		token.info = "escape";
	}
	state.pos = pos + 1;
	return true;
}
//#endregion
//#region src/rules_inline/backticks.ts
function buildLastRuns(src) {
	const lastRuns = {};
	let pos = 0;
	while ((pos = src.indexOf("`", pos)) !== -1) {
		const start = pos;
		while (src.charCodeAt(++pos) === 96);
		lastRuns[pos - start] = start;
	}
	return lastRuns;
}
function backtick(state, silent) {
	var _state$backticks$open;
	const start = state.pos;
	if (state.src.charCodeAt(start) !== 96) return false;
	const max = state.posMax;
	let pos = start + 1;
	while (pos < max && state.src.charCodeAt(pos) === 96) pos++;
	const marker = state.src.slice(start, pos);
	const openerLength = marker.length;
	if (!state.backticksScanned) {
		state.backticks = buildLastRuns(state.src);
		state.backticksScanned = true;
	}
	if (((_state$backticks$open = state.backticks[openerLength]) !== null && _state$backticks$open !== void 0 ? _state$backticks$open : -1) >= pos) {
		let matchEnd = pos;
		let matchStart;
		while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1 && matchStart < max) {
			matchEnd = matchStart + 1;
			while (state.src.charCodeAt(matchEnd) === 96) matchEnd++;
			if (matchEnd > max) break;
			if (matchEnd - matchStart === openerLength) {
				if (!silent) {
					const token = state.push("code_inline", "code", 0);
					token.markup = marker;
					let content = state.src.slice(pos, matchStart).replace(/\n/g, " ");
					if (content.startsWith(" ") && content.endsWith(" ") && /[^ ]/.test(content)) content = content.slice(1, -1);
					token.content = content;
				}
				state.pos = matchEnd;
				return true;
			}
		}
	}
	if (!silent) state.pending += marker;
	state.pos = pos;
	return true;
}
//#endregion
//#region src/rules_inline/strikethrough.ts
function strikethrough_tokenize(state, silent) {
	const start = state.pos;
	const marker = state.src.charCodeAt(start);
	if (silent) return false;
	if (marker !== 126) return false;
	const scanned = state.scanDelims(state.pos, true);
	let len = scanned.length;
	const ch = String.fromCharCode(marker);
	if (len < 2) return false;
	let token;
	if (len % 2) {
		token = state.push("text", "", 0);
		token.content = ch;
		len--;
	}
	for (let i = 0; i < len; i += 2) {
		token = state.push("text", "", 0);
		token.content = ch + ch;
		state.delimiters.push({
			marker,
			length: 0,
			token: state.tokens.length - 1,
			end: -1,
			open: scanned.can_open,
			close: scanned.can_close
		});
	}
	state.pos += scanned.length;
	return true;
}
function postProcess$1(state, delimiters) {
	let token;
	const loneMarkers = [];
	const max = delimiters.length;
	for (let i = 0; i < max; i++) {
		const startDelim = delimiters[i];
		if (startDelim.marker !== 126) continue;
		if (startDelim.end === -1) continue;
		const endDelim = delimiters[startDelim.end];
		token = state.tokens[startDelim.token];
		token.type = "s_open";
		token.tag = "s";
		token.nesting = 1;
		token.markup = "~~";
		token.content = "";
		token = state.tokens[endDelim.token];
		token.type = "s_close";
		token.tag = "s";
		token.nesting = -1;
		token.markup = "~~";
		token.content = "";
		if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
	}
	while (loneMarkers.length) {
		const i = loneMarkers.pop();
		let j = i + 1;
		while (j < state.tokens.length && state.tokens[j].type === "s_close") j++;
		j--;
		if (i !== j) {
			token = state.tokens[j];
			state.tokens[j] = state.tokens[i];
			state.tokens[i] = token;
		}
	}
}
function strikethrough_postProcess(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	postProcess$1(state, state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		var _tokens_meta$curr;
		const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
		if (delimiters) postProcess$1(state, delimiters);
	}
}
var strikethrough_default = {
	tokenize: strikethrough_tokenize,
	postProcess: strikethrough_postProcess
};
//#endregion
//#region src/rules_inline/emphasis.ts
function emphasis_tokenize(state, silent) {
	const start = state.pos;
	const marker = state.src.charCodeAt(start);
	if (silent) return false;
	if (marker !== 95 && marker !== 42) return false;
	const scanned = state.scanDelims(state.pos, marker === 42);
	for (let i = 0; i < scanned.length; i++) {
		const token = state.push("text", "", 0);
		token.content = String.fromCharCode(marker);
		state.delimiters.push({
			marker,
			length: scanned.length,
			token: state.tokens.length - 1,
			end: -1,
			open: scanned.can_open,
			close: scanned.can_close
		});
	}
	state.pos += scanned.length;
	return true;
}
function postProcess(state, delimiters) {
	const max = delimiters.length;
	for (let i = max - 1; i >= 0; i--) {
		const startDelim = delimiters[i];
		if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
		if (startDelim.end === -1) continue;
		const endDelim = delimiters[startDelim.end];
		const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
		const ch = String.fromCharCode(startDelim.marker);
		const token_o = state.tokens[startDelim.token];
		token_o.type = isStrong ? "strong_open" : "em_open";
		token_o.tag = isStrong ? "strong" : "em";
		token_o.nesting = 1;
		token_o.markup = isStrong ? ch + ch : ch;
		token_o.content = "";
		const token_c = state.tokens[endDelim.token];
		token_c.type = isStrong ? "strong_close" : "em_close";
		token_c.tag = isStrong ? "strong" : "em";
		token_c.nesting = -1;
		token_c.markup = isStrong ? ch + ch : ch;
		token_c.content = "";
		if (isStrong) {
			state.tokens[delimiters[i - 1].token].content = "";
			state.tokens[delimiters[startDelim.end + 1].token].content = "";
			i--;
		}
	}
}
function emphasis_post_process(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	postProcess(state, state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		var _tokens_meta$curr;
		const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
		if (delimiters) postProcess(state, delimiters);
	}
}
var emphasis_default = {
	tokenize: emphasis_tokenize,
	postProcess: emphasis_post_process
};
//#endregion
//#region src/rules_inline/link.ts
function link(state, silent) {
	let code, label, res, ref;
	let href = "";
	let title = "";
	let start = state.pos;
	let parseReference = true;
	if (state.src.charCodeAt(state.pos) !== 91) return false;
	const oldPos = state.pos;
	const max = state.posMax;
	const labelStart = state.pos + 1;
	const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
	if (labelEnd < 0) return false;
	let pos = labelEnd + 1;
	if (pos < max && state.src.charCodeAt(pos) === 40) {
		parseReference = false;
		pos++;
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (!isSpace(code) && code !== 10) break;
		}
		if (pos >= max) return false;
		start = pos;
		res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
		if (res.ok) {
			href = state.md.normalizeLink(res.str);
			if (state.md.validateLink(href)) pos = res.pos;
			else href = "";
			start = pos;
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (!isSpace(code) && code !== 10) break;
			}
			res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
			if (pos < max && start !== pos && res.ok) {
				title = res.str;
				pos = res.pos;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
			}
		}
		if (pos >= max || state.src.charCodeAt(pos) !== 41) parseReference = true;
		pos++;
	}
	if (parseReference) {
		if (typeof state.env.references === "undefined") return false;
		if (pos < max && state.src.charCodeAt(pos) === 91) {
			start = pos + 1;
			pos = state.md.helpers.parseLinkLabel(state, pos);
			if (pos >= 0) label = state.src.slice(start, pos++);
			else pos = labelEnd + 1;
		} else pos = labelEnd + 1;
		if (!label) label = state.src.slice(labelStart, labelEnd);
		label = normalizeReference(label);
		ref = state.env.references[label];
		if (!ref) {
			state.pos = oldPos;
			return false;
		}
		href = ref.href;
		title = ref.title;
	}
	if (!silent) {
		state.pos = labelStart;
		state.posMax = labelEnd;
		const token_o = state.push("link_open", "a", 1);
		const attrs = [["href", href]];
		token_o.attrs = attrs;
		if (title) attrs.push(["title", title]);
		if (label) {
			const meta = Object.create(null);
			meta.label = label;
			token_o.meta = meta;
		}
		state.linkLevel++;
		state.md.inline.tokenize(state);
		state.linkLevel--;
		state.push("link_close", "a", -1);
	}
	state.pos = pos;
	state.posMax = max;
	return true;
}
//#endregion
//#region src/rules_inline/image.ts
function image(state, silent) {
	let code, content, label, pos, ref, res, title, start;
	let href = "";
	const oldPos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(state.pos) !== 33) return false;
	if (state.src.charCodeAt(state.pos + 1) !== 91) return false;
	const labelStart = state.pos + 2;
	const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
	if (labelEnd < 0) return false;
	pos = labelEnd + 1;
	if (pos < max && state.src.charCodeAt(pos) === 40) {
		pos++;
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (!isSpace(code) && code !== 10) break;
		}
		if (pos >= max) return false;
		start = pos;
		res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
		if (res.ok) {
			href = state.md.normalizeLink(res.str);
			if (state.md.validateLink(href)) pos = res.pos;
			else href = "";
		}
		start = pos;
		for (; pos < max; pos++) {
			code = state.src.charCodeAt(pos);
			if (!isSpace(code) && code !== 10) break;
		}
		res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
		if (pos < max && start !== pos && res.ok) {
			title = res.str;
			pos = res.pos;
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (!isSpace(code) && code !== 10) break;
			}
		} else title = "";
		if (pos >= max || state.src.charCodeAt(pos) !== 41) {
			state.pos = oldPos;
			return false;
		}
		pos++;
	} else {
		if (typeof state.env.references === "undefined") return false;
		if (pos < max && state.src.charCodeAt(pos) === 91) {
			start = pos + 1;
			pos = state.md.helpers.parseLinkLabel(state, pos);
			if (pos >= 0) label = state.src.slice(start, pos++);
			else pos = labelEnd + 1;
		} else pos = labelEnd + 1;
		if (!label) label = state.src.slice(labelStart, labelEnd);
		label = normalizeReference(label);
		ref = state.env.references[label];
		if (!ref) {
			state.pos = oldPos;
			return false;
		}
		href = ref.href;
		title = ref.title;
	}
	if (!silent) {
		content = state.src.slice(labelStart, labelEnd);
		const tokens = [];
		state.md.inline.parse(content, state.md, state.env, tokens);
		const token = state.push("image", "img", 0);
		const attrs = [["src", href], ["alt", ""]];
		token.attrs = attrs;
		token.children = tokens;
		token.content = content;
		if (title) attrs.push(["title", title]);
		if (label) {
			const meta = Object.create(null);
			meta.label = label;
			token.meta = meta;
		}
	}
	state.pos = pos;
	state.posMax = max;
	return true;
}
//#endregion
//#region src/rules_inline/autolink.ts
var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function autolink(state, silent) {
	let pos = state.pos;
	if (state.src.charCodeAt(pos) !== 60) return false;
	const start = state.pos;
	const max = state.posMax;
	for (;;) {
		if (++pos >= max) return false;
		const ch = state.src.charCodeAt(pos);
		if (ch === 60) return false;
		if (ch === 62) break;
	}
	const url = state.src.slice(start + 1, pos);
	if (AUTOLINK_RE.test(url)) {
		const fullUrl = state.md.normalizeLink(url);
		if (!state.md.validateLink(fullUrl)) return false;
		if (!silent) {
			const token_o = state.push("link_open", "a", 1);
			token_o.attrs = [["href", fullUrl]];
			token_o.markup = "autolink";
			token_o.info = "auto";
			const token_t = state.push("text", "", 0);
			token_t.content = state.md.normalizeLinkText(url);
			const token_c = state.push("link_close", "a", -1);
			token_c.markup = "autolink";
			token_c.info = "auto";
		}
		state.pos += url.length + 2;
		return true;
	}
	if (EMAIL_RE.test(url)) {
		const fullUrl = state.md.normalizeLink(`mailto:${url}`);
		if (!state.md.validateLink(fullUrl)) return false;
		if (!silent) {
			const token_o = state.push("link_open", "a", 1);
			token_o.attrs = [["href", fullUrl]];
			token_o.markup = "autolink";
			token_o.info = "auto";
			const token_t = state.push("text", "", 0);
			token_t.content = state.md.normalizeLinkText(url);
			const token_c = state.push("link_close", "a", -1);
			token_c.markup = "autolink";
			token_c.info = "auto";
		}
		state.pos += url.length + 2;
		return true;
	}
	return false;
}
//#endregion
//#region src/rules_inline/html_inline.ts
function isLinkOpen(str) {
	return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
	return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
	const lc = ch | 32;
	return lc >= 97 && lc <= 122;
}
function html_inline(state, silent) {
	if (!state.md.options.html) return false;
	const max = state.posMax;
	const pos = state.pos;
	if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
	const ch = state.src.charCodeAt(pos + 1);
	if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) return false;
	const match = state.src.slice(pos).match(HTML_TAG_RE);
	if (!match) return false;
	if (!silent) {
		const token = state.push("html_inline", "", 0);
		token.content = match[0];
		if (isLinkOpen(token.content)) state.linkLevel++;
		if (isLinkClose(token.content)) state.linkLevel--;
	}
	state.pos += match[0].length;
	return true;
}
//#endregion
//#region src/rules_inline/entity.ts
var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state, silent) {
	const pos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(pos) !== 38) return false;
	if (pos + 1 >= max) return false;
	if (state.src.charCodeAt(pos + 1) === 35) {
		const match = state.src.slice(pos).match(DIGITAL_RE);
		if (match) {
			if (!silent) {
				const code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
				const token = state.push("text_special", "", 0);
				token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
				token.markup = match[0];
				token.info = "entity";
			}
			state.pos += match[0].length;
			return true;
		}
	} else {
		const match = state.src.slice(pos).match(NAMED_RE);
		if (match) {
			const decoded = decodeHTMLStrict(match[0]);
			if (decoded !== match[0]) {
				if (!silent) {
					const token = state.push("text_special", "", 0);
					token.content = decoded;
					token.markup = match[0];
					token.info = "entity";
				}
				state.pos += match[0].length;
				return true;
			}
		}
	}
	return false;
}
//#endregion
//#region src/rules_inline/balance_pairs.ts
function processDelimiters(delimiters) {
	const openersBottom = {};
	const max = delimiters.length;
	if (!max) return;
	let headerIdx = 0;
	let lastTokenIdx = -2;
	const jumps = [];
	for (let closerIdx = 0; closerIdx < max; closerIdx++) {
		const closer = delimiters[closerIdx];
		jumps.push(0);
		if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
		lastTokenIdx = closer.token;
		closer.length = closer.length || 0;
		if (!closer.close) continue;
		if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		];
		const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
		let openerIdx = headerIdx - jumps[headerIdx] - 1;
		let newMinOpenerIdx = openerIdx;
		for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
			const opener = delimiters[openerIdx];
			if (opener.marker !== closer.marker) continue;
			if (opener.open && opener.end < 0) {
				let isOddMatch = false;
				if (opener.close || closer.open) {
					if ((opener.length + closer.length) % 3 === 0) {
						if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
					}
				}
				if (!isOddMatch) {
					const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
					jumps[closerIdx] = closerIdx - openerIdx + lastJump;
					jumps[openerIdx] = lastJump;
					closer.open = false;
					opener.end = closerIdx;
					opener.close = false;
					newMinOpenerIdx = -1;
					lastTokenIdx = -2;
					break;
				}
			}
		}
		if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
	}
}
function link_pairs(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	processDelimiters(state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		var _tokens_meta$curr;
		const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
		if (delimiters) processDelimiters(delimiters);
	}
}
//#endregion
//#region src/rules_inline/fragments_join.ts
function fragments_join(state) {
	let curr, last;
	let level = 0;
	const tokens = state.tokens;
	const max = state.tokens.length;
	for (curr = last = 0; curr < max; curr++) {
		if (tokens[curr].nesting < 0) level--;
		tokens[curr].level = level;
		if (tokens[curr].nesting > 0) level++;
		if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
		else {
			if (curr !== last) tokens[last] = tokens[curr];
			last++;
		}
	}
	if (curr !== last) tokens.length = last;
}
//#endregion
//#region src/parser_inline.ts
var _rules = [
	["text", text],
	["linkify", linkify],
	["newline", newline],
	["escape", escape],
	["backticks", backtick],
	["strikethrough", strikethrough_default.tokenize],
	["emphasis", emphasis_default.tokenize],
	["link", link],
	["image", image],
	["autolink", autolink],
	["html_inline", html_inline],
	["entity", entity]
];
var _rules2 = [
	["balance_pairs", link_pairs],
	["strikethrough", strikethrough_default.postProcess],
	["emphasis", emphasis_default.postProcess],
	["fragments_join", fragments_join]
];
/**
* Tokenizes paragraph content.
*/
var ParserInline = class {
	constructor() {
		_defineProperty(
			this,
			/**
			* {@link Ruler} instance. Keep configuration of inline rules.
			*/
			"ruler",
			new Ruler()
		);
		_defineProperty(
			this,
			/**
			* {@link Ruler} instance. Second ruler used for post-processing
			* (e.g. in emphasis-like rules).
			*/
			"ruler2",
			new Ruler()
		);
		_defineProperty(this, "State", StateInline);
		for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
		for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
	}
	skipToken(state) {
		const pos = state.pos;
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		const cache = state.cache;
		if (typeof cache[pos] !== "undefined") {
			state.pos = cache[pos];
			return;
		}
		let ok = false;
		if (state.level < maxNesting) for (let i = 0; i < len; i++) {
			state.level++;
			ok = rules[i](state, true);
			state.level--;
			if (ok) {
				if (pos >= state.pos) throw new Error("inline rule didn't increment state.pos");
				break;
			}
		}
		else state.pos = state.posMax;
		if (!ok) state.pos++;
		cache[pos] = state.pos;
	}
	tokenize(state) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const end = state.posMax;
		const maxNesting = state.md.options.maxNesting;
		while (state.pos < end) {
			const prevPos = state.pos;
			let ok = false;
			if (state.level < maxNesting) for (let i = 0; i < len; i++) {
				ok = rules[i](state, false);
				if (ok) {
					if (prevPos >= state.pos) throw new Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (ok) {
				if (state.pos >= end) break;
				continue;
			}
			state.pending += state.src[state.pos++];
		}
		if (state.pending) state.pushPending();
	}
	/**
	* Process input string and push inline tokens into `outTokens`
	*/
	parse(str, md, env, outTokens) {
		const state = new this.State(str, md, env, outTokens);
		this.tokenize(state);
		const rules = this.ruler2.getRules("");
		const len = rules.length;
		for (let i = 0; i < len; i++) rules[i](state);
	}
};
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var REBuilder = class {
	constructor(opts = {}) {
		_defineProperty(this, "src_Any", Any.source);
		_defineProperty(this, "src_Cc", Cc.source);
		_defineProperty(this, "src_Z", Z.source);
		_defineProperty(this, "src_P", P.source);
		_defineProperty(this, "src_ZPCc", [
			this.src_Z,
			this.src_P,
			this.src_Cc
		].join("|"));
		_defineProperty(this, "src_ZCc", [this.src_Z, this.src_Cc].join("|"));
		_defineProperty(this, "cache", {});
		_defineProperty(this, "opts", {
			maxLength: 1e4,
			urlAuth: false,
			schema_names: []
		});
		this.opts = {
			...this.opts,
			...opts
		};
	}
	set(opts = {}) {
		this.opts = {
			...this.opts,
			...opts
		};
		this.cache = {};
		return this;
	}
	escapeRE(str) {
		return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
	nestedPairRE(open, close, depth = 4) {
		const openRE = this.escapeRE(open);
		const closeRE = this.escapeRE(close);
		const atom = `(?:(?!${this.src_ZCc}|${openRE}|${closeRE}).)`;
		let pair = `${openRE}${atom}{0,1000}${closeRE}`;
		for (let level = 2; level <= depth; level++) pair = `${openRE}(?:${atom}|${pair}){0,1000}${closeRE}`;
		return pair;
	}
	get_text_separators() {
		var _this$cache, _this$cache$text_sepa;
		return (_this$cache$text_sepa = (_this$cache = this.cache).text_separators) !== null && _this$cache$text_sepa !== void 0 ? _this$cache$text_sepa : _this$cache.text_separators = /[><\uff5c]/;
	}
	get_pseudo_letter() {
		var _this$cache2, _this$cache2$src_pseu;
		return (_this$cache2$src_pseu = (_this$cache2 = this.cache).src_pseudo_letter) !== null && _this$cache2$src_pseu !== void 0 ? _this$cache2$src_pseu : _this$cache2.src_pseudo_letter = new RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`);
	}
	get_ipv4_addr() {
		var _this$cache3, _this$cache3$src_ip;
		return (_this$cache3$src_ip = (_this$cache3 = this.cache).src_ip4) !== null && _this$cache3$src_ip !== void 0 ? _this$cache3$src_ip : _this$cache3.src_ip4 = /* @__PURE__ */ new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])");
	}
	get_ipv6_addr() {
		var _this$cache4, _this$cache4$src_ip6_;
		const h16 = "[0-9A-Fa-f]{1,4}";
		const ls32 = `(?:(?:${h16}:${h16})|${this.get_ipv4_addr().source})`;
		return (_this$cache4$src_ip6_ = (_this$cache4 = this.cache).src_ip6_addr) !== null && _this$cache4$src_ip6_ !== void 0 ? _this$cache4$src_ip6_ : _this$cache4.src_ip6_addr = new RegExp(`(?:(?:${h16}:){6}${ls32}|::(?:${h16}:){5}${ls32}|(?:${h16})?::(?:${h16}:){4}${ls32}|(?:(?:${h16}:){0,1}${h16})?::(?:${h16}:){3}${ls32}|(?:(?:${h16}:){0,2}${h16})?::(?:${h16}:){2}${ls32}|(?:(?:${h16}:){0,3}${h16})?::${h16}:${ls32}|(?:(?:${h16}:){0,4}${h16})?::${ls32}|(?:(?:${h16}:){0,5}${h16})?::${h16}|(?:(?:${h16}:){0,6}${h16})?::)`);
	}
	get_ipv6_url_host() {
		var _this$cache5, _this$cache5$src_ip6_;
		return (_this$cache5$src_ip6_ = (_this$cache5 = this.cache).src_ip6_host) !== null && _this$cache5$src_ip6_ !== void 0 ? _this$cache5$src_ip6_ : _this$cache5.src_ip6_host = new RegExp(`\\[${this.get_ipv6_addr().source}\\]`);
	}
	get_ipv6_mail_host() {
		var _this$cache6, _this$cache6$src_ipv;
		return (_this$cache6$src_ipv = (_this$cache6 = this.cache).src_ipv6_mail_host) !== null && _this$cache6$src_ipv !== void 0 ? _this$cache6$src_ipv : _this$cache6.src_ipv6_mail_host = new RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`);
	}
	get_auth() {
		var _this$cache7, _this$cache7$src_auth;
		return (_this$cache7$src_auth = (_this$cache7 = this.cache).src_auth) !== null && _this$cache7$src_auth !== void 0 ? _this$cache7$src_auth : _this$cache7.src_auth = new RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`);
	}
	get_port() {
		var _this$cache8, _this$cache8$src_port;
		return (_this$cache8$src_port = (_this$cache8 = this.cache).src_port) !== null && _this$cache8$src_port !== void 0 ? _this$cache8$src_port : _this$cache8.src_port = /* @__PURE__ */ new RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?");
	}
	get_host_terminator() {
		var _this$cache9, _this$cache9$src_host;
		return (_this$cache9$src_host = (_this$cache9 = this.cache).src_host_terminator) !== null && _this$cache9$src_host !== void 0 ? _this$cache9$src_host : _this$cache9.src_host_terminator = new RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`);
	}
	get_path_terminator() {
		var _this$cache10, _this$cache10$src_pat;
		return (_this$cache10$src_pat = (_this$cache10 = this.cache).src_path_terminator) !== null && _this$cache10$src_pat !== void 0 ? _this$cache10$src_pat : _this$cache10.src_path_terminator = new RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`);
	}
	get_path() {
		var _this$cache11, _this$cache11$src_pat;
		return (_this$cache11$src_pat = (_this$cache11 = this.cache).src_path) !== null && _this$cache11$src_pat !== void 0 ? _this$cache11$src_pat : _this$cache11.src_path = new RegExp(`(?:[/?#](?:${this.nestedPairRE("[", "]")}|${this.nestedPairRE("(", ")")}|${this.nestedPairRE("{", "}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|` + (this.opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-{0,19})|" : "\\-{1,20}|") + `,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|` + this.get_path_extra().source + `[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`);
	}
	get_mail_name() {
		var _this$cache12, _this$cache12$src_mai;
		return (_this$cache12$src_mai = (_this$cache12 = this.cache).src_mail_name) !== null && _this$cache12$src_mai !== void 0 ? _this$cache12$src_mai : _this$cache12.src_mail_name = /* @__PURE__ */ new RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}");
	}
	get_xn() {
		var _this$cache13, _this$cache13$src_xn;
		return (_this$cache13$src_xn = (_this$cache13 = this.cache).src_xn) !== null && _this$cache13$src_xn !== void 0 ? _this$cache13$src_xn : _this$cache13.src_xn = /* @__PURE__ */ new RegExp("xn--[a-z0-9\\-]{1,59}");
	}
	get_tld() {
		if (this.cache.tld) return this.cache.tld;
		const tlds_src = [...new Set(this.opts.tlds || [])].sort().reverse().join("|");
		this.cache.tld = new RegExp(`${tlds_src || "$#none#$"}|${this.get_xn().source}`);
		return this.cache.tld;
	}
	get_domain_root() {
		var _this$cache14, _this$cache14$src_dom;
		return (_this$cache14$src_dom = (_this$cache14 = this.cache).src_domain_root) !== null && _this$cache14$src_dom !== void 0 ? _this$cache14$src_dom : _this$cache14.src_domain_root = new RegExp("(?:" + this.get_xn().source + `|${this.get_pseudo_letter().source}{1,63})`);
	}
	get_domain() {
		var _this$cache15, _this$cache15$src_dom;
		return (_this$cache15$src_dom = (_this$cache15 = this.cache).src_domain) !== null && _this$cache15$src_dom !== void 0 ? _this$cache15$src_dom : _this$cache15.src_domain = new RegExp("(?:" + this.get_xn().source + `|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`);
	}
	get_url_host_port() {
		var _this$cache16, _this$cache16$url_hos;
		return (_this$cache16$url_hos = (_this$cache16 = this.cache).url_host_port) !== null && _this$cache16$url_hos !== void 0 ? _this$cache16$url_hos : _this$cache16.url_host_port = new RegExp("(?:" + this.get_ipv6_url_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))` + this.get_port().source + this.get_host_terminator().source);
	}
	get_fuzzy_url_host_port() {
		var _this$cache17, _this$cache17$fuzzy_u;
		return (_this$cache17$fuzzy_u = (_this$cache17 = this.cache).fuzzy_url_host_port) !== null && _this$cache17$fuzzy_u !== void 0 ? _this$cache17$fuzzy_u : _this$cache17.fuzzy_url_host_port = new RegExp("(?:" + (this.opts.fuzzyIP ? this.get_ipv4_addr().source + "|" : "") + `(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))` + this.get_host_terminator().source);
	}
	get_mail_host() {
		var _this$cache18, _this$cache18$src_mai;
		return (_this$cache18$src_mai = (_this$cache18 = this.cache).src_mail_host) !== null && _this$cache18$src_mai !== void 0 ? _this$cache18$src_mai : _this$cache18.src_mail_host = new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))` + this.get_host_terminator().source);
	}
	get_fuzzy_mail_host() {
		var _this$cache19, _this$cache19$src_fuz;
		return (_this$cache19$src_fuz = (_this$cache19 = this.cache).src_fuzzy_mail_host) !== null && _this$cache19$src_fuz !== void 0 ? _this$cache19$src_fuz : _this$cache19.src_fuzzy_mail_host = new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))` + this.get_host_terminator().source);
	}
	get_path_extra() {
		var _this$cache20, _this$cache20$src_pat;
		return (_this$cache20$src_pat = (_this$cache20 = this.cache).src_path_extra) !== null && _this$cache20$src_pat !== void 0 ? _this$cache20$src_pat : _this$cache20.src_path_extra = /* @__PURE__ */ new RegExp("");
	}
	get_fuzzy_mail_host_search() {
		var _this$cache21, _this$cache21$mail_fu;
		return (_this$cache21$mail_fu = (_this$cache21 = this.cache).mail_fuzzy_host_search) !== null && _this$cache21$mail_fu !== void 0 ? _this$cache21$mail_fu : _this$cache21.mail_fuzzy_host_search = new RegExp(`@${this.get_fuzzy_mail_host().source}`, "ig");
	}
	get_fuzzy_link_search() {
		var _this$cache22, _this$cache22$link_fu;
		return (_this$cache22$link_fu = (_this$cache22 = this.cache).link_fuzzy_search) !== null && _this$cache22$link_fu !== void 0 ? _this$cache22$link_fu : _this$cache22.link_fuzzy_search = new RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${this.src_ZPCc}))(?:(?![$+<=>^\`|\uff5c])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`, "ig");
	}
	get_http_validator() {
		var _this$cache23, _this$cache23$http_va;
		return (_this$cache23$http_va = (_this$cache23 = this.cache).http_validator) !== null && _this$cache23$http_va !== void 0 ? _this$cache23$http_va : _this$cache23.http_validator = new RegExp("\\/\\/" + (this.opts.urlAuth ? this.get_auth().source : "") + this.get_url_host_port().source + this.get_path().source, "iy");
	}
	get_relative_proto_validator() {
		var _this$cache24, _this$cache24$relativ;
		return (_this$cache24$relativ = (_this$cache24 = this.cache).relative_proto_validator) !== null && _this$cache24$relativ !== void 0 ? _this$cache24$relativ : _this$cache24.relative_proto_validator = new RegExp((this.opts.urlAuth ? this.get_auth().source : "") + `(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})` + this.get_port().source + this.get_host_terminator().source + this.get_path().source, "iy");
	}
	get_mail_name_validator() {
		var _this$cache25, _this$cache25$mail_na;
		return (_this$cache25$mail_na = (_this$cache25 = this.cache).mail_name_validator) !== null && _this$cache25$mail_na !== void 0 ? _this$cache25$mail_na : _this$cache25.mail_name_validator = new RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`);
	}
	get_mailto_validator() {
		var _this$cache26, _this$cache26$mailto_;
		return (_this$cache26$mailto_ = (_this$cache26 = this.cache).mailto_validator) !== null && _this$cache26$mailto_ !== void 0 ? _this$cache26$mailto_ : _this$cache26.mailto_validator = new RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`, "iy");
	}
	get_schema_names() {
		var _this$cache27, _this$cache27$schema_;
		return (_this$cache27$schema_ = (_this$cache27 = this.cache).schema_names) !== null && _this$cache27$schema_ !== void 0 ? _this$cache27$schema_ : _this$cache27.schema_names = new RegExp((this.opts.schema_names || []).map((name) => this.escapeRE(name)).join("|"));
	}
	get_schema_search() {
		var _this$cache28, _this$cache28$schema_;
		return (_this$cache28$schema_ = (_this$cache28 = this.cache).schema_search) !== null && _this$cache28$schema_ !== void 0 ? _this$cache28$schema_ : _this$cache28.schema_search = new RegExp(`(^|(?!_)(?:[><\uff5c]|${this.src_ZPCc}))(${this.get_schema_names().source})`, "ig");
	}
	get_schema_at_start() {
		var _this$cache29, _this$cache29$schema_;
		return (_this$cache29$schema_ = (_this$cache29 = this.cache).schema_at_start) !== null && _this$cache29$schema_ !== void 0 ? _this$cache29$schema_ : _this$cache29.schema_at_start = new RegExp(`^${this.get_schema_search().source}`, "i");
	}
};
var web_schema = {
	validate: (text, pos, self) => {
		const re = self.re.get_http_validator();
		re.lastIndex = pos;
		const m = re.exec(text);
		return m ? m[0].length : 0;
	},
	normalize: (match, self) => self.normalize(match)
};
var defaultSchemas = {
	"http:": web_schema,
	"https:": web_schema,
	"ftp:": web_schema,
	"//": {
		validate: function(text, pos, self) {
			const re = self.re.get_relative_proto_validator();
			re.lastIndex = pos;
			const m = re.exec(text);
			if (m) {
				if (pos >= 3 && text[pos - 3] === ":") return 0;
				if (pos >= 3 && text[pos - 3] === "/") return 0;
				return m[0].length;
			}
			return 0;
		},
		normalize: (match, self) => self.normalize(match)
	},
	"mailto:": {
		validate: function(text, pos, self) {
			const re = self.re.get_mailto_validator();
			re.lastIndex = pos;
			const m = re.exec(text);
			return m ? m[0].length : 0;
		},
		normalize: (match, self) => self.normalize(match)
	}
};
var tlds_2ch = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw";
var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function unpackTlds() {
	const result = tlds_default.split("|");
	tlds_2ch.split("|").forEach((item) => {
		const sep = item.indexOf(":");
		const prefix = item.slice(0, sep);
		for (const suffix of item.slice(sep + 1)) result.push(prefix + suffix);
	});
	return result;
}
var defaultOptions = {
	fuzzyLink: false,
	fuzzyEmail: true,
	fuzzyIP: false,
	"---": false,
	tlds: unpackTlds(),
	urlAuth: false,
	maxLength: 1e4
};
/**
* Match result returned by {@link LinkifyIt.match} and
* {@link LinkifyIt.matchAtStart}.
*
* @category types
*/
var Match = class {
	constructor(text, schema, index, lastIndex) {
		_defineProperty(
			this,
			/** Prefix (protocol) for matched string. Empty for fuzzy links. */
			"schema",
			void 0
		);
		_defineProperty(
			this,
			/** First position of matched string. */
			"index",
			void 0
		);
		_defineProperty(
			this,
			/** Next position after matched string. */
			"lastIndex",
			void 0
		);
		_defineProperty(
			this,
			/** Matched string. */
			"raw",
			void 0
		);
		_defineProperty(
			this,
			/** Normalized text of matched string. */
			"text",
			void 0
		);
		_defineProperty(
			this,
			/** Normalized URL of matched string. */
			"url",
			void 0
		);
		const raw = text.slice(index, lastIndex);
		this.schema = schema.toLowerCase();
		this.index = index;
		this.lastIndex = lastIndex;
		this.raw = raw;
		this.text = raw;
		this.url = raw;
	}
};
/** Linkifier instance. */
var LinkifyIt = class {
	/**
	* Creates new linkifier instance.
	*
	* By default understands:
	*
	* - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
	* - "fuzzy" emails (foo@bar.com).
	*
	* See {@link LinkifyConstructorOptions} for available options.
	*
	* @param options Recognition options.
	*
	* @example
	* ```javascript
	* import { LinkifyIt } from 'linkify-it'
	*
	* const linkify = new LinkifyIt({ fuzzyLink: true })
	*
	* linkify
	*   .tlds(require('tlds'))       // Reload with full TLD list
	*   .tlds('onion', true)         // Add unofficial `.onion` domain
	*   .add('ftp:', null)           // Disable `ftp:` protocol
	*   .set({ fuzzyIP: true })      // Enable IPs in fuzzy links
	*
	* console.log(linkify.test('Site github.com!')) // true
	* console.log(linkify.match('Site github.com!'))
	* ```
	*/
	constructor(options = {}) {
		_defineProperty(this, "__opts__", void 0);
		_defineProperty(this, "__schemas__", void 0);
		_defineProperty(this, "re", void 0);
		const { rebuilder, ...linkifyOptions } = options;
		this.__opts__ = {
			...defaultOptions,
			...linkifyOptions
		};
		this.__schemas__ = { ...defaultSchemas };
		this.re = rebuilder || new REBuilder();
		this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		});
	}
	/**
	* Add new rule definition.
	*
	* `schema` is a link prefix (usually, protocol name with `:` at the end,
	* `skype:` for example). `linkify-it` makes sure that prefix is not
	* preceded with alphanumeric char and symbols. Only whitespaces and
	* punctuation allowed.
	*
	* `definition` is a rule to check tail after link prefix. To disable an
	* existing rule, pass `null`.
	*
	* @param schema Rule name (fixed pattern prefix).
	* @param definition Schema definition, or `null` to disable the rule.
	*
	* See [twitter mentions example](https://github.com/markdown-it/linkify-it/blob/master/examples/twitter.mjs).
	*/
	add(schema, definition = null) {
		if (!definition) delete this.__schemas__[schema];
		else {
			const def = {
				normalize: (match, self) => self.normalize(match),
				...definition
			};
			this.__schemas__[schema] = def;
		}
		this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		});
		return this;
	}
	/**
	* Set recognition options for links without schema.
	*
	* @param options Recognition options.
	*/
	set(options = {}) {
		this.__opts__ = {
			...this.__opts__,
			...options
		};
		this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		});
		return this;
	}
	/**
	* Searches linkifiable pattern and returns `true` on success or `false` on fail.
	*
	* @param text Text to scan.
	*/
	test(text) {
		if (!text.length) return false;
		let m, re;
		re = this.re.get_schema_search();
		re.lastIndex = 0;
		while ((m = re.exec(text)) !== null) if (this.testSchemaAt(text, m[2], re.lastIndex)) return true;
		if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
			re = this.re.get_fuzzy_link_search();
			re.lastIndex = 0;
			if (re.exec(text) !== null) return true;
		}
		if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
			if (text.indexOf("@") >= 0) {
				const mailHostRe = this.re.get_fuzzy_mail_host_search();
				const mailNameRe = this.re.get_mail_name_validator();
				mailHostRe.lastIndex = 0;
				while ((m = mailHostRe.exec(text)) !== null) {
					const name = text.slice(Math.max(0, m.index - 65), m.index);
					if (mailNameRe.test(name)) return true;
				}
			}
		}
		return false;
	}
	/**
	* Similar to {@link LinkifyIt.test} but checks only specific protocol tail exactly
	* at given position. Returns length of found pattern (0 on fail).
	*
	* @param text Text to scan.
	* @param schema Rule (schema) name.
	* @param pos Text offset to check from.
	*/
	testSchemaAt(text, schema, pos) {
		if (!this.__schemas__[schema.toLowerCase()]) return 0;
		return this.__schemas__[schema.toLowerCase()].validate(text.slice(0, pos + this.__opts__.maxLength), pos, this);
	}
	/**
	* Returns array of found link descriptions or `null` on fail. We strongly
	* recommend to use {@link LinkifyIt.test} first, for best speed.
	*
	* @param text Text to scan.
	*/
	match(text) {
		const result = [];
		const schemaRe = this.re.get_schema_search();
		let fuzzyLinkRe;
		let mailHostRe;
		let mailNameRe;
		let fuzzyLinkCandidate;
		let fuzzyEmailCandidate;
		let schemaPrefix;
		let schemaDone = false;
		let fuzzyLinkDone = false;
		let fuzzyEmailDone = false;
		let pos = 0;
		if (!text.length) return null;
		schemaRe.lastIndex = 0;
		if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
			fuzzyLinkRe = this.re.get_fuzzy_link_search();
			fuzzyLinkRe.lastIndex = 0;
		}
		if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
			mailHostRe = this.re.get_fuzzy_mail_host_search();
			mailHostRe.lastIndex = 0;
			mailNameRe = this.re.get_mail_name_validator();
		}
		for (;;) {
			const scanFrom = Math.max(pos - 1, 0);
			if (mailHostRe && mailNameRe && !fuzzyEmailDone && (!fuzzyEmailCandidate || fuzzyEmailCandidate.index < pos)) {
				if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
				for (;;) {
					const m = mailHostRe.exec(text);
					if (!m) {
						fuzzyEmailDone = true;
						fuzzyEmailCandidate = void 0;
						break;
					}
					const name = mailNameRe.exec(text.slice(Math.max(0, m.index - 65), m.index));
					if (!name) continue;
					fuzzyEmailCandidate = {
						schema: "mailto:",
						index: m.index - name[1].length,
						lastIndex: m.index + m[0].length
					};
					if (fuzzyEmailCandidate.index >= pos) break;
					if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
				}
			}
			if (fuzzyLinkRe && !fuzzyLinkDone && (!fuzzyLinkCandidate || fuzzyLinkCandidate.index < pos)) {
				if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
				for (;;) {
					const m = fuzzyLinkRe.exec(text);
					if (!m) {
						fuzzyLinkDone = true;
						fuzzyLinkCandidate = void 0;
						break;
					}
					fuzzyLinkCandidate = {
						schema: "",
						index: m.index + m[1].length,
						lastIndex: m.index + m[0].length
					};
					if (fuzzyLinkCandidate.index >= pos) break;
					if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
				}
			}
			let fuzzyCandidate = fuzzyEmailCandidate;
			if (!fuzzyCandidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < fuzzyCandidate.index || fuzzyLinkCandidate.index === fuzzyCandidate.index && fuzzyLinkCandidate.lastIndex > fuzzyCandidate.lastIndex)) fuzzyCandidate = fuzzyLinkCandidate;
			let schemaCandidate;
			if (!schemaDone) for (;;) {
				if (!schemaPrefix) {
					if (schemaRe.lastIndex < scanFrom) schemaRe.lastIndex = scanFrom;
					const m = schemaRe.exec(text);
					if (!m) {
						schemaDone = true;
						break;
					}
					schemaPrefix = {
						schema: m[2],
						index: m.index + m[1].length,
						lastIndex: m.index + m[0].length
					};
				}
				if (schemaPrefix.index < pos) {
					schemaPrefix = void 0;
					continue;
				}
				if (fuzzyCandidate && schemaPrefix.index > fuzzyCandidate.index) break;
				const prefix = schemaPrefix;
				schemaPrefix = void 0;
				const len = this.testSchemaAt(text, prefix.schema, prefix.lastIndex);
				if (len) {
					schemaCandidate = {
						schema: prefix.schema,
						index: prefix.index,
						lastIndex: prefix.lastIndex + len
					};
					break;
				}
			}
			let candidate = schemaCandidate;
			if (!candidate || fuzzyEmailCandidate && (fuzzyEmailCandidate.index < candidate.index || fuzzyEmailCandidate.index === candidate.index && fuzzyEmailCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyEmailCandidate;
			if (!candidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < candidate.index || fuzzyLinkCandidate.index === candidate.index && fuzzyLinkCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyLinkCandidate;
			if (!candidate) break;
			if (candidate === fuzzyEmailCandidate) fuzzyEmailCandidate = void 0;
			else if (candidate === fuzzyLinkCandidate) fuzzyLinkCandidate = void 0;
			const match = new Match(text, candidate.schema, candidate.index, candidate.lastIndex);
			if (match.schema) this.__schemas__[match.schema].normalize(match, this);
			else this.normalize(match);
			result.push(match);
			pos = candidate.lastIndex;
		}
		if (result.length) return result;
		return null;
	}
	/**
	* Returns fully-formed (not fuzzy) link if it starts at the beginning
	* of the string, and null otherwise.
	*
	* @param text Text to scan.
	*/
	matchAtStart(text) {
		if (!text.length) return null;
		const m = this.re.get_schema_at_start().exec(text);
		if (!m) return null;
		const len = this.testSchemaAt(text, m[2], m[0].length);
		if (!len) return null;
		const match = new Match(text, m[2], m.index + m[1].length, m.index + m[0].length + len);
		this.__schemas__[match.schema].normalize(match, this);
		return match;
	}
	/**
	* Load (or merge) new TLDs list. Those are used for fuzzy links (without
	* prefix) to avoid false positives. By default this algorithm is used:
	*
	* - hostname with any 2-letter root zones are ok.
	* - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
	*   are ok.
	* - encoded (`xn--...`) root zones are ok.
	*
	* If list is replaced, then exact match for 2-chars root zones will be checked.
	*
	* @param list List of TLDs.
	* @param keepOld Merge with current list if `true` (`false` by default).
	*/
	tlds(list, keepOld = false) {
		list = Array.isArray(list) ? list : [list];
		if (!keepOld) this.__opts__.tlds = list;
		else this.__opts__.tlds = this.__opts__.tlds.concat(list);
		this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		});
		return this;
	}
	/**
	* Default normalizer (if schema does not define its own).
	*
	* @param match Match to normalize.
	*/
	normalize(match) {
		if (!match.schema) match.url = `http://${match.url}`;
		if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = `mailto:${match.url}`;
	}
};
//#endregion
//#region node_modules/punycode.js/punycode.es6.js
/** Highest positive signed 32-bit float value */
var maxInt = 2147483647;
/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128;
var delimiter = "-";
/** Regular expressions */
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\0-\x7F]/;
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
/** Error messages */
var errors = {
	"overflow": "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
};
/** Convenience shortcuts */
var baseMinusTMin = 35;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;
/**
* A generic error utility function.
* @private
* @param {String} type The error type.
* @returns {Error} Throws a `RangeError` with the applicable error message.
*/
function error(type) {
	throw new RangeError(errors[type]);
}
/**
* A generic `Array#map` utility function.
* @private
* @param {Array} array The array to iterate over.
* @param {Function} callback The function that gets called for every array
* item.
* @returns {Array} A new array of values returned by the callback function.
*/
function map(array, callback) {
	const result = [];
	let length = array.length;
	while (length--) result[length] = callback(array[length]);
	return result;
}
/**
* A simple `Array#map`-like wrapper to work with domain name strings or email
* addresses.
* @private
* @param {String} domain The domain name or email address.
* @param {Function} callback The function that gets called for every
* character.
* @returns {String} A new string of characters returned by the callback
* function.
*/
function mapDomain(domain, callback) {
	const parts = domain.split("@");
	let result = "";
	if (parts.length > 1) {
		result = parts[0] + "@";
		domain = parts[1];
	}
	domain = domain.replace(regexSeparators, ".");
	const encoded = map(domain.split("."), callback).join(".");
	return result + encoded;
}
/**
* Creates an array containing the numeric code points of each Unicode
* character in the string. While JavaScript uses UCS-2 internally,
* this function will convert a pair of surrogate halves (each of which
* UCS-2 exposes as separate characters) into a single code point,
* matching UTF-16.
* @see `punycode.ucs2.encode`
* @see <https://mathiasbynens.be/notes/javascript-encoding>
* @memberOf punycode.ucs2
* @name decode
* @param {String} string The Unicode input string (UCS-2).
* @returns {Array} The new array of code points.
*/
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 55296 && value <= 56319 && counter < length) {
			const extra = string.charCodeAt(counter++);
			if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
			else {
				output.push(value);
				counter--;
			}
		} else output.push(value);
	}
	return output;
}
/**
* Creates a string based on an array of numeric code points.
* @see `punycode.ucs2.decode`
* @memberOf punycode.ucs2
* @name encode
* @param {Array} codePoints The array of numeric code points.
* @returns {String} The new Unicode string (UCS-2).
*/
var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
/**
* Converts a basic code point into a digit/integer.
* @see `digitToBasic()`
* @private
* @param {Number} codePoint The basic numeric code point value.
* @returns {Number} The numeric value of a basic code point (for use in
* representing integers) in the range `0` to `base - 1`, or `base` if
* the code point does not represent a value.
*/
var basicToDigit = function(codePoint) {
	if (codePoint >= 48 && codePoint < 58) return 26 + (codePoint - 48);
	if (codePoint >= 65 && codePoint < 91) return codePoint - 65;
	if (codePoint >= 97 && codePoint < 123) return codePoint - 97;
	return base;
};
/**
* Converts a digit/integer into a basic code point.
* @see `basicToDigit()`
* @private
* @param {Number} digit The numeric value of a basic code point.
* @returns {Number} The basic code point whose value (when used for
* representing integers) is `digit`, which needs to be in the range
* `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
* used; else, the lowercase form is used. The behavior is undefined
* if `flag` is non-zero and `digit` has no uppercase form.
*/
var digitToBasic = function(digit, flag) {
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
/**
* Bias adaptation function as per section 3.4 of RFC 3492.
* https://tools.ietf.org/html/rfc3492#section-3.4
* @private
*/
var adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (; delta > 455; k += base) delta = floor(delta / baseMinusTMin);
	return floor(k + 36 * delta / (delta + skew));
};
/**
* Converts a Punycode string of ASCII-only symbols to a string of Unicode
* symbols.
* @memberOf punycode
* @param {String} input The Punycode string of ASCII-only symbols.
* @returns {String} The resulting string of Unicode symbols.
*/
var decode = function(input) {
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;
	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) basic = 0;
	for (let j = 0; j < basic; ++j) {
		if (input.charCodeAt(j) >= 128) error("not-basic");
		output.push(input.charCodeAt(j));
	}
	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
		const oldi = i;
		for (let w = 1, k = base;; k += base) {
			if (index >= inputLength) error("invalid-input");
			const digit = basicToDigit(input.charCodeAt(index++));
			if (digit >= base) error("invalid-input");
			if (digit > floor((maxInt - i) / w)) error("overflow");
			i += digit * w;
			const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
			if (digit < t) break;
			const baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) error("overflow");
			w *= baseMinusT;
		}
		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);
		if (floor(i / out) > maxInt - n) error("overflow");
		n += floor(i / out);
		i %= out;
		output.splice(i++, 0, n);
	}
	return String.fromCodePoint(...output);
};
/**
* Converts a string of Unicode symbols (e.g. a domain name label) to a
* Punycode string of ASCII-only symbols.
* @memberOf punycode
* @param {String} input The string of Unicode symbols.
* @returns {String} The resulting Punycode string of ASCII-only symbols.
*/
var encode = function(input) {
	const output = [];
	input = ucs2decode(input);
	const inputLength = input.length;
	let n = initialN;
	let delta = 0;
	let bias = initialBias;
	for (const currentValue of input) if (currentValue < 128) output.push(stringFromCharCode(currentValue));
	const basicLength = output.length;
	let handledCPCount = basicLength;
	if (basicLength) output.push(delimiter);
	while (handledCPCount < inputLength) {
		let m = maxInt;
		for (const currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error("overflow");
		delta += (m - n) * handledCPCountPlusOne;
		n = m;
		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) error("overflow");
			if (currentValue === n) {
				let q = delta;
				for (let k = base;; k += base) {
					const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
					if (q < t) break;
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
					q = floor(qMinusT / baseMinusT);
				}
				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
				delta = 0;
				++handledCPCount;
			}
		}
		++delta;
		++n;
	}
	return output.join("");
};
/**
* Converts a Punycode string representing a domain name or an email address
* to Unicode. Only the Punycoded parts of the input will be converted, i.e.
* it doesn't matter if you call it on a string that has already been
* converted to Unicode.
* @memberOf punycode
* @param {String} input The Punycoded domain name or email address to
* convert to Unicode.
* @returns {String} The Unicode representation of the given Punycode
* string.
*/
var toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
	});
};
/**
* Converts a Unicode string representing a domain name or an email address to
* Punycode. Only the non-ASCII parts of the domain name will be converted,
* i.e. it doesn't matter if you call it with a domain that's already in
* ASCII.
* @memberOf punycode
* @param {String} input The domain name or email address to convert, as a
* Unicode string.
* @returns {String} The Punycode representation of the given domain name or
* email address.
*/
var toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
	});
};
/** Define the public API */
var punycode = {
	/**
	* A string representing the current Punycode.js version number.
	* @memberOf punycode
	* @type String
	*/
	"version": "2.3.1",
	/**
	* An object of methods to convert from JavaScript's internal character
	* representation (UCS-2) to Unicode code points, and back.
	* @see <https://mathiasbynens.be/notes/javascript-encoding>
	* @memberOf punycode
	* @type Object
	*/
	"ucs2": {
		"decode": ucs2decode,
		"encode": ucs2encode
	},
	"decode": decode,
	"encode": encode,
	"toASCII": toASCII,
	"toUnicode": toUnicode
};
//#endregion
//#region src/markdownit.ts
var config = {
	default: {
		options: {
			html: false,
			xhtmlOut: false,
			breaks: false,
			langPrefix: "language-",
			linkify: false,
			typographer: false,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 100
		},
		components: {
			core: {},
			block: {},
			inline: {}
		}
	},
	zero: {
		options: {
			html: false,
			xhtmlOut: false,
			breaks: false,
			langPrefix: "language-",
			linkify: false,
			typographer: false,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"strip_references",
				"inline",
				"text_join"
			] },
			block: { rules: ["paragraph"] },
			inline: {
				rules: ["text"],
				rules2: ["balance_pairs", "fragments_join"]
			}
		}
	},
	commonmark: {
		options: {
			html: true,
			xhtmlOut: true,
			breaks: false,
			langPrefix: "language-",
			linkify: false,
			typographer: false,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"strip_references",
				"inline",
				"text_join"
			] },
			block: { rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			] },
			inline: {
				rules: [
					"autolink",
					"backticks",
					"emphasis",
					"entity",
					"escape",
					"html_inline",
					"image",
					"link",
					"newline",
					"text"
				],
				rules2: [
					"balance_pairs",
					"emphasis",
					"fragments_join"
				]
			}
		}
	}
};
var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
var RECODE_HOSTNAME_FOR = [
	"http:",
	"https:",
	"mailto:"
];
/**
* Parses Markdown into tokens and renders them to HTML.
*
* @category Main
*/
var MarkdownIt$1 = class {
	/**
	* Link validation function. CommonMark allows too much in links. By default
	* we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
	* except some embedded image types.
	*
	* You can change this behaviour:
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* const md = new MarkdownIt()
	*
	* // enable everything
	* md.validateLink = function () { return true; }
	* ```
	*/
	validateLink(url) {
		const str = url.trim().toLowerCase();
		return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
	}
	/**
	* Function used to encode link url to a machine-readable format,
	* which includes url-encoding, punycode, etc.
	*/
	normalizeLink(url) {
		const parsed = urlParse(url, true);
		if (parsed.hostname) {
			if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
				parsed.hostname = punycode.toASCII(parsed.hostname);
			} catch (er) {}
		}
		if (parsed.auth) parsed.auth = encode$1(parsed.auth);
		if (parsed.hostname) parsed.hostname = encode$1(parsed.hostname);
		if (parsed.pathname) parsed.pathname = encode$1(parsed.pathname);
		if (parsed.search) parsed.search = encode$1(parsed.search);
		if (parsed.hash) parsed.hash = encode$1(parsed.hash);
		return format(parsed);
	}
	/**
	* Function used to decode link url to a human-readable format`
	*/
	normalizeLinkText(url) {
		const parsed = urlParse(url, true);
		if (parsed.hostname) {
			if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
				parsed.hostname = punycode.toUnicode(parsed.hostname);
			} catch (er) {}
		}
		return decode$1(format(parsed), decode$1.defaultChars + "%");
	}
	constructor(...args) {
		_defineProperty(
			this,
			/**
			* Instance of {@link ParserInline}. You may need it to add new rules when
			* writing plugins. For simple rules control use {@link MarkdownIt.disable}
			* and {@link MarkdownIt.enable}.
			*/
			"inline",
			new ParserInline()
		);
		_defineProperty(
			this,
			/**
			* Instance of {@link ParserBlock}. You may need it to add new rules when
			* writing plugins. For simple rules control use {@link MarkdownIt.disable}
			* and {@link MarkdownIt.enable}.
			*/
			"block",
			new ParserBlock()
		);
		_defineProperty(
			this,
			/**
			* Instance of {@link ParserCore} chain executor. You may need it to add new
			* rules when writing plugins. For simple rules control use
			* {@link MarkdownIt.disable} and {@link MarkdownIt.enable}.
			*/
			"core",
			new ParserCore()
		);
		_defineProperty(
			this,
			/**
			* Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
			* rules for new token types, generated by plugins.
			*
			* See {@link Renderer} docs and
			* [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts).
			*
			* @example
			* ```javascript
			* import MarkdownIt from 'markdown-it'
			* const md = new MarkdownIt()
			*
			* function myToken(tokens, idx, options, env, self) {
			*   //...
			*   return result;
			* };
			*
			* md.renderer.rules['my_token'] = myToken
			* ```
			*/
			"renderer",
			new Renderer()
		);
		_defineProperty(
			this,
			/**
			* [linkify-it](https://github.com/markdown-it/linkify-it) instance.
			* Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/linkify.ts)
			* rule.
			*/
			"linkify",
			new LinkifyIt()
		);
		_defineProperty(
			this,
			/**
			* Assorted utility functions, useful to write plugins. See details
			* [here](https://github.com/markdown-it/markdown-it/blob/master/src/common/utils.ts).
			*/
			"utils",
			utils_exports
		);
		_defineProperty(
			this,
			/**
			* Link components parser functions, useful to write plugins. See details
			* [here](https://github.com/markdown-it/markdown-it/blob/master/src/helpers).
			*/
			"helpers",
			Object.assign({}, helpers_exports)
		);
		const [presetNameOrOptions, options] = args;
		if (typeof presetNameOrOptions === "string") {
			this.configure(presetNameOrOptions);
			if (options) this.set(options);
		} else {
			this.configure("default");
			this.set(presetNameOrOptions || {});
		}
	}
	/**
	* Set parser options (in the same format as in constructor). Probably, you
	* will never need it, but you can change options after constructor call.
	*
	* __Note:__ To achieve the best possible performance, don't modify a
	* `markdown-it` instance options on the fly. If you need multiple configurations
	* it's best to create multiple instances and initialize each with separate
	* config.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	*
	* const md = new MarkdownIt()
	*   .set({ html: true, breaks: true })
	*   .set({ typographer: true })
	* ```
	*/
	set(options) {
		Object.assign(this.options, options);
		return this;
	}
	/**
	* Batch load of all options and compenent settings. This is internal method,
	* and you probably will not need it. But if you will - see available presets
	* and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/src/presets)
	*
	* We strongly recommend to use presets instead of direct config loads. That
	* will give better compatibility with next versions.
	*/
	configure(presets) {
		let p;
		if (typeof presets === "string") {
			const presetName = presets;
			p = config[presetName];
			if (!p) throw new Error(`Wrong 'markdown-it' preset "${presetName}", check name`);
		} else p = presets;
		if (!p) throw new Error("Wrong `markdown-it` preset, can't be empty");
		if (p.options) this.options = { ...p.options };
		const components = p.components;
		if (components) {
			var _components$inline;
			[
				"core",
				"block",
				"inline"
			].forEach((name) => {
				var _components$name;
				const rules = (_components$name = components[name]) === null || _components$name === void 0 ? void 0 : _components$name.rules;
				if (rules) this[name].ruler.enableOnly(rules);
			});
			const rules2 = (_components$inline = components.inline) === null || _components$inline === void 0 ? void 0 : _components$inline.rules2;
			if (rules2) this.inline.ruler2.enableOnly(rules2);
		}
		return this;
	}
	/**
	* Enable list or rules. It will automatically find appropriate components,
	* containing rules with given names. If rule not found, and `ignoreInvalid`
	* not set - throws exception.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	*
	* const md = new MarkdownIt()
	*   .enable(['sub', 'sup'])
	*   .disable('smartquotes')
	* ```
	*/
	enable(list, ignoreInvalid = false) {
		let result = [];
		if (!Array.isArray(list)) list = [list];
		[
			"core",
			"block",
			"inline"
		].forEach((chain) => {
			result = result.concat(this[chain].ruler.enable(list, true));
		});
		result = result.concat(this.inline.ruler2.enable(list, true));
		const missed = list.filter((name) => result.indexOf(name) < 0);
		if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${missed}`);
		return this;
	}
	/**
	* The same as {@link MarkdownIt.enable}, but turn specified rules off.
	*/
	disable(list, ignoreInvalid = false) {
		let result = [];
		if (!Array.isArray(list)) list = [list];
		[
			"core",
			"block",
			"inline"
		].forEach((chain) => {
			result = result.concat(this[chain].ruler.disable(list, true));
		});
		result = result.concat(this.inline.ruler2.disable(list, true));
		const missed = list.filter((name) => result.indexOf(name) < 0);
		if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${missed}`);
		return this;
	}
	/**
	* Load specified plugin with given params into current parser instance.
	* It's just a sugar to call `plugin(md, params)` with curring.
	*
	* @example
	* ```javascript
	* import MarkdownIt from 'markdown-it'
	* import iterator from 'markdown-it-for-inline'
	*
	* const md = new MarkdownIt()
	*   .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
	*     tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar')
	*   })
	* ```
	*/
	use(plugin, ...params) {
		plugin.apply(plugin, [this, ...params]);
		return this;
	}
	/**
	* Parse input string and return list of block tokens (special token type
	* "inline" will contain list of inline tokens). You should not call this
	* method directly, until you write custom renderer (for example, to produce
	* AST).
	*
	* `env` is used to pass data between "distributed" rules and return additional
	* metadata like reference info, needed for the renderer. It also can be used to
	* inject data in specific cases. Usually, you will be ok to pass `{}`,
	* and then pass updated object to renderer.
	*/
	parse(src, env) {
		if (typeof src !== "string") throw new Error("Input data should be a String");
		const state = new this.core.State(src, this, env);
		this.core.process(state);
		return state.tokens;
	}
	/**
	* Render markdown string into html. It does all magic for you :).
	*
	* `env` can be used to inject additional metadata (`{}` by default).
	* But you will not need it with high probability. See also comment
	* in {@link MarkdownIt.parse}.
	*/
	render(src, env = {}) {
		return this.renderer.render(this.parse(src, env), this.options, env);
	}
	/**
	* The same as {@link MarkdownIt.parse} but skip all block rules. It returns
	* the block tokens list with the single `inline` element, containing parsed
	* inline tokens in `children` property. Also updates `env` object.
	*/
	parseInline(src, env) {
		const state = new this.core.State(src, this, env);
		state.inlineMode = true;
		this.core.process(state);
		return state.tokens;
	}
	/**
	* Similar to {@link MarkdownIt.render} but for single paragraph content.
	* Result will NOT be wrapped into `<p>` tags.
	*/
	renderInline(src, env = {}) {
		return this.renderer.render(this.parseInline(src, env), this.options, env);
	}
};
_defineProperty(MarkdownIt$1, "Token", Token);
_defineProperty(MarkdownIt$1, "Ruler", Ruler);
_defineProperty(MarkdownIt$1, "Renderer", Renderer);
_defineProperty(MarkdownIt$1, "ParserCore", ParserCore);
_defineProperty(MarkdownIt$1, "StateCore", StateCore);
_defineProperty(MarkdownIt$1, "ParserBlock", ParserBlock);
_defineProperty(MarkdownIt$1, "StateBlock", StateBlock);
_defineProperty(MarkdownIt$1, "ParserInline", ParserInline);
_defineProperty(MarkdownIt$1, "StateInline", StateInline);
//#endregion
//#region src/math.ts
var DOLLAR = 36;
var BACKSLASH = 92;
var NEWLINE = 10;
/** Map LaTeX command names to a Unicode glyph and its MathML token kind. */
var SYMBOLS = {
	alpha: ["α", "mi"],
	beta: ["β", "mi"],
	gamma: ["γ", "mi"],
	delta: ["δ", "mi"],
	epsilon: ["ε", "mi"],
	varepsilon: ["ε", "mi"],
	zeta: ["ζ", "mi"],
	eta: ["η", "mi"],
	theta: ["θ", "mi"],
	vartheta: ["ϑ", "mi"],
	iota: ["ι", "mi"],
	kappa: ["κ", "mi"],
	lambda: ["λ", "mi"],
	mu: ["μ", "mi"],
	nu: ["ν", "mi"],
	xi: ["ξ", "mi"],
	omicron: ["ο", "mi"],
	pi: ["π", "mi"],
	varpi: ["ϖ", "mi"],
	rho: ["ρ", "mi"],
	varrho: ["ϱ", "mi"],
	sigma: ["σ", "mi"],
	varsigma: ["ς", "mi"],
	tau: ["τ", "mi"],
	upsilon: ["υ", "mi"],
	phi: ["φ", "mi"],
	varphi: ["φ", "mi"],
	chi: ["χ", "mi"],
	psi: ["ψ", "mi"],
	omega: ["ω", "mi"],
	Gamma: ["Γ", "mi"],
	Delta: ["Δ", "mi"],
	Theta: ["Θ", "mi"],
	Lambda: ["Λ", "mi"],
	Xi: ["Ξ", "mi"],
	Pi: ["Π", "mi"],
	Sigma: ["Σ", "mi"],
	Upsilon: ["Υ", "mi"],
	Phi: ["Φ", "mi"],
	Psi: ["Ψ", "mi"],
	Omega: ["Ω", "mi"],
	times: ["×", "mo"],
	div: ["÷", "mo"],
	cdot: ["⋅", "mo"],
	pm: ["±", "mo"],
	mp: ["∓", "mo"],
	ast: ["∗", "mo"],
	star: ["⋆", "mo"],
	circ: ["∘", "mo"],
	bullet: ["∙", "mo"],
	oplus: ["⊕", "mo"],
	ominus: ["⊖", "mo"],
	otimes: ["⊗", "mo"],
	oslash: ["⊘", "mo"],
	odot: ["⊙", "mo"],
	dagger: ["†", "mo"],
	ddagger: ["‡", "mo"],
	le: ["≤", "mo"],
	leq: ["≤", "mo"],
	ge: ["≥", "mo"],
	geq: ["≥", "mo"],
	ne: ["≠", "mo"],
	neq: ["≠", "mo"],
	equiv: ["≡", "mo"],
	approx: ["≈", "mo"],
	cong: ["≅", "mo"],
	simeq: ["≃", "mo"],
	sim: ["∼", "mo"],
	propto: ["∝", "mo"],
	ll: ["≪", "mo"],
	gg: ["≫", "mo"],
	preceq: ["⪯", "mo"],
	succeq: ["⪰", "mo"],
	sum: ["∑", "mo"],
	prod: ["∏", "mo"],
	coprod: ["∐", "mo"],
	int: ["∫", "mo"],
	iint: ["∬", "mo"],
	iiint: ["∭", "mo"],
	oint: ["∮", "mo"],
	bigcup: ["⋃", "mo"],
	bigcap: ["⋂", "mo"],
	bigoplus: ["⨁", "mo"],
	bigotimes: ["⨂", "mo"],
	rightarrow: ["→", "mo"],
	to: ["→", "mo"],
	leftarrow: ["←", "mo"],
	gets: ["←", "mo"],
	leftrightarrow: ["↔", "mo"],
	Rightarrow: ["⇒", "mo"],
	Leftarrow: ["⇐", "mo"],
	Leftrightarrow: ["⇔", "mo"],
	mapsto: ["↦", "mo"],
	longrightarrow: ["⟶", "mo"],
	hookrightarrow: ["↪", "mo"],
	uparrow: ["↑", "mo"],
	downarrow: ["↓", "mo"],
	in: ["∈", "mo"],
	notin: ["∉", "mo"],
	ni: ["∋", "mo"],
	subset: ["⊂", "mo"],
	subseteq: ["⊆", "mo"],
	supset: ["⊃", "mo"],
	supseteq: ["⊇", "mo"],
	cap: ["∩", "mo"],
	cup: ["∪", "mo"],
	setminus: ["∖", "mo"],
	emptyset: ["∅", "mi"],
	varnothing: ["∅", "mi"],
	land: ["∧", "mo"],
	wedge: ["∧", "mo"],
	lor: ["∨", "mo"],
	vee: ["∨", "mo"],
	neg: ["¬", "mo"],
	lnot: ["¬", "mo"],
	forall: ["∀", "mo"],
	exists: ["∃", "mo"],
	nexists: ["∄", "mo"],
	infty: ["∞", "mi"],
	partial: ["∂", "mi"],
	nabla: ["∇", "mi"],
	angle: ["∠", "mo"],
	perp: ["⊥", "mo"],
	parallel: ["∥", "mo"],
	therefore: ["∴", "mo"],
	because: ["∵", "mo"],
	ldots: ["…", "mo"],
	cdots: ["⋯", "mo"],
	vdots: ["⋮", "mo"],
	ddots: ["⋱", "mo"],
	prime: ["′", "mo"],
	degree: ["°", "mo"],
	aleph: ["ℵ", "mi"],
	hbar: ["ℏ", "mi"],
	ell: ["ℓ", "mi"],
	Re: ["ℜ", "mi"],
	Im: ["ℑ", "mi"],
	wp: ["℘", "mi"],
	quad: [" ", "mo"],
	qquad: ["  ", "mo"]
};
/** Function names that should render upright as a single mi node. */
var FUNCTIONS = /* @__PURE__ */ new Set([
	"sin",
	"cos",
	"tan",
	"cot",
	"sec",
	"csc",
	"arcsin",
	"arccos",
	"arctan",
	"sinh",
	"cosh",
	"tanh",
	"coth",
	"log",
	"ln",
	"lg",
	"exp",
	"lim",
	"limsup",
	"liminf",
	"max",
	"min",
	"sup",
	"inf",
	"det",
	"dim",
	"gcd",
	"ker",
	"hom",
	"arg",
	"deg",
	"bmod",
	"pmod",
	"mod"
]);
var OPERATOR_CHARS = "+-=<>()[]|/,.;:!?*";
function escapeXml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function isEscaped(src, pos) {
	let count = 0;
	for (let i = pos - 1; i >= 0 && src.charCodeAt(i) === BACKSLASH; i--) count++;
	return count % 2 === 1;
}
/** Recursive-descent parser for a practical subset of LaTeX math. */
var LatexParser = class LatexParser {
	constructor(src) {
		_defineProperty(this, "src", void 0);
		_defineProperty(this, "pos", 0);
		this.src = src.replace(/[\r\n]+/g, " ");
	}
	eof() {
		return this.pos >= this.src.length;
	}
	peek() {
		var _this$src$this$pos;
		return (_this$src$this$pos = this.src[this.pos]) !== null && _this$src$this$pos !== void 0 ? _this$src$this$pos : "";
	}
	skipSpaces() {
		while (!this.eof() && /\s/.test(this.src[this.pos])) this.pos++;
	}
	parse() {
		return this.parseSequence(false);
	}
	parseSequence(stopAtBrace) {
		let out = "";
		while (!this.eof()) {
			this.skipSpaces();
			if (this.eof()) break;
			if (stopAtBrace && this.peek() === "}") break;
			const before = this.pos;
			const base = this.parseAtom();
			if (base === null) {
				if (this.pos === before) break;
				continue;
			}
			let sub = "";
			let sup = "";
			for (;;) {
				this.skipSpaces();
				const ch = this.peek();
				if (ch === "^") {
					var _this$parseAtom;
					this.pos++;
					this.skipSpaces();
					sup = (_this$parseAtom = this.parseAtom()) !== null && _this$parseAtom !== void 0 ? _this$parseAtom : "";
				} else if (ch === "_") {
					var _this$parseAtom2;
					this.pos++;
					this.skipSpaces();
					sub = (_this$parseAtom2 = this.parseAtom()) !== null && _this$parseAtom2 !== void 0 ? _this$parseAtom2 : "";
				} else break;
			}
			if (sub && sup) out += `<msubsup>${base}${sub}${sup}</msubsup>`;
			else if (sub) out += `<msub>${base}${sub}</msub>`;
			else if (sup) out += `<msup>${base}${sup}</msup>`;
			else out += base;
		}
		return out;
	}
	parseAtom() {
		this.skipSpaces();
		if (this.eof()) return null;
		const ch = this.peek();
		if (ch === "}") return null;
		if (ch === "{") {
			this.pos++;
			const inner = this.parseSequence(true);
			if (this.peek() === "}") this.pos++;
			return `<mrow>${inner}</mrow>`;
		}
		if (ch === "\\") return this.parseCommand();
		if (OPERATOR_CHARS.includes(ch)) {
			this.pos++;
			return `<mo>${escapeXml(ch)}</mo>`;
		}
		if (/[0-9.]/.test(ch)) {
			let num = "";
			while (!this.eof() && /[0-9.]/.test(this.peek())) num += this.src[this.pos++];
			return `<mn>${escapeXml(num)}</mn>`;
		}
		if (/[A-Za-z]/.test(ch)) {
			this.pos++;
			return `<mi>${escapeXml(ch)}</mi>`;
		}
		this.pos++;
		return `<mi>${escapeXml(ch)}</mi>`;
	}
	parseRawGroup() {
		this.skipSpaces();
		if (this.peek() !== "{") {
			const atom = this.parseAtom();
			return atom ? atom.replace(/<[^>]+>/g, "") : "";
		}
		this.pos++;
		let depth = 1;
		const start = this.pos;
		while (!this.eof() && depth > 0) {
			const ch = this.src[this.pos];
			if (ch === "{") depth++;
			else if (ch === "}") depth--;
			if (depth === 0) break;
			this.pos++;
		}
		const raw = this.src.slice(start, this.pos);
		if (this.peek() === "}") this.pos++;
		return raw;
	}
	parseArg() {
		var _this$parseAtom3;
		this.skipSpaces();
		if (this.peek() === "{") {
			this.pos++;
			const inner = this.parseSequence(true);
			if (this.peek() === "}") this.pos++;
			return `<mrow>${inner}</mrow>`;
		}
		return (_this$parseAtom3 = this.parseAtom()) !== null && _this$parseAtom3 !== void 0 ? _this$parseAtom3 : "";
	}
	nextDelimiter() {
		this.skipSpaces();
		let ch = this.peek();
		if (ch === "\\") {
			this.pos++;
			ch = this.peek();
			this.pos++;
			if (ch === "{") return "{";
			if (ch === "}") return "}";
			return ch;
		}
		this.pos++;
		if (ch === ".") return "";
		return ch;
	}
	parseCommand() {
		this.pos++;
		if (this.eof()) return "<mo>\\</mo>";
		const ch = this.peek();
		if (!/[A-Za-z]/.test(ch)) {
			this.pos++;
			if (ch === "\\") return "<mspace linebreak=\"newline\"></mspace>";
			if (ch === "," || ch === ";" || ch === ":" || ch === "!" || ch === " ") return "<mspace width=\"0.2778em\"></mspace>";
			return `<mo>${escapeXml(ch)}</mo>`;
		}
		let name = "";
		while (!this.eof() && /[A-Za-z]/.test(this.peek())) name += this.src[this.pos++];
		switch (name) {
			case "frac":
			case "dfrac":
			case "tfrac": return `<mfrac>${this.parseArg()}${this.parseArg()}</mfrac>`;
			case "sqrt": {
				this.skipSpaces();
				let index = "";
				if (this.peek() === "[") {
					this.pos++;
					const start = this.pos;
					let depth = 0;
					while (!this.eof()) {
						const c = this.peek();
						if (c === "[") depth++;
						else if (c === "]") {
							if (depth === 0) break;
							depth--;
						}
						this.pos++;
					}
					index = new LatexParser(this.src.slice(start, this.pos)).parse();
					if (this.peek() === "]") this.pos++;
				}
				const body = this.parseArg();
				return index ? `<mroot>${body}${index}</mroot>` : `<msqrt>${body}</msqrt>`;
			}
			case "text":
			case "textrm":
			case "mbox":
			case "textnormal": return `<mtext>${escapeXml(this.parseRawGroup())}</mtext>`;
			case "mathbf":
			case "boldsymbol": return `<mstyle mathvariant="bold">${this.parseArg()}</mstyle>`;
			case "mathrm":
			case "textup": return `<mstyle mathvariant="normal">${this.parseArg()}</mstyle>`;
			case "mathit": return `<mstyle mathvariant="italic">${this.parseArg()}</mstyle>`;
			case "mathcal": return `<mstyle mathvariant="script">${this.parseArg()}</mstyle>`;
			case "mathbb": return `<mstyle mathvariant="double-struck">${this.parseArg()}</mstyle>`;
			case "mathfrak": return `<mstyle mathvariant="fraktur">${this.parseArg()}</mstyle>`;
			case "left":
			case "right": return `<mo stretchy="true">${escapeXml(this.nextDelimiter())}</mo>`;
			case "operatorname": return `<mi mathvariant="normal">${escapeXml(this.parseRawGroup())}</mi>`;
			case "begin": return this.parseEnvironment();
			case "end":
				this.parseRawGroup();
				return "";
			case "over": return "<mo>⁄</mo>";
		}
		if (name in SYMBOLS) {
			const [glyph, kind] = SYMBOLS[name];
			return name === "sum" || name === "prod" || name === "int" || name === "iint" || name === "iiint" || name === "oint" || name === "bigcup" || name === "bigcap" || name === "coprod" ? `<mo largeop="true">${glyph}</mo>` : `<${kind}>${glyph}</${kind}>`;
		}
		if (FUNCTIONS.has(name)) return `<mi mathvariant="normal">${escapeXml(name)}</mi>`;
		return `<mi mathvariant="normal">${escapeXml(name)}</mi>`;
	}
	parseEnvironment() {
		const env = this.parseRawGroup().trim();
		const endTag = `\\end{${env}}`;
		const contentStart = this.pos;
		const endIdx = this.src.indexOf(endTag, this.pos);
		if (endIdx < 0) return "";
		const body = this.src.slice(contentStart, endIdx);
		this.pos = endIdx + endTag.length;
		const table = `<mtable>${body.split(/\\\\/).map((row) => row.trim()).filter((row) => row.length > 0).map((row) => row.split("&").map((cell) => `<mtd>${new LatexParser(cell).parse()}</mtd>`).join("")).map((cells) => `<mtr>${cells}</mtr>`).join("")}</mtable>`;
		if (env === "pmatrix") return `<mrow><mo>(</mo>${table}<mo>)</mo></mrow>`;
		if (env === "bmatrix") return `<mrow><mo>[</mo>${table}<mo>]</mo></mrow>`;
		if (env === "vmatrix") return `<mrow><mo>|</mo>${table}<mo>|</mo></mrow>`;
		if (env === "Bmatrix") return `<mrow><mo>{</mo>${table}<mo>}</mo></mrow>`;
		if (env === "cases") return `<mrow><mo>{</mo>${table}</mrow>`;
		return table;
	}
};
/** Convert a LaTeX fragment to a MathML element. */
function latexToMathML(tex, display = false) {
	const body = new LatexParser(tex).parse();
	return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${display ? "block" : "inline"}">${body}</math>`;
}
function mathInline(state, silent) {
	const src = state.src;
	const start = state.pos;
	if (src.charCodeAt(start) !== DOLLAR) return false;
	if (isEscaped(src, start)) return false;
	let pos = start + 1;
	const display = src.charCodeAt(pos) === DOLLAR;
	if (display) pos++;
	let end = -1;
	for (let i = pos; i < state.posMax; i++) {
		const ch = src.charCodeAt(i);
		if (ch === NEWLINE && !display) break;
		if (ch === DOLLAR && !isEscaped(src, i)) {
			if (display) {
				if (src.charCodeAt(i + 1) === DOLLAR) {
					end = i;
					break;
				}
			} else if (src.charCodeAt(i + 1) !== DOLLAR) {
				end = i;
				break;
			}
		}
	}
	if (end < 0) return false;
	const content = src.slice(pos, end);
	if (!content.trim()) return false;
	if (!silent) {
		const token = state.push("math_inline", "math", 0);
		token.markup = display ? "$$" : "$";
		token.content = content;
		token.meta = { display };
	}
	state.pos = end + (display ? 2 : 1);
	return true;
}
function mathBlock(state, startLine, endLine, silent) {
	const pos = state.bMarks[startLine] + state.tShift[startLine];
	const max = state.eMarks[startLine];
	if (pos + 1 >= max) return false;
	if (state.src.charCodeAt(pos) !== DOLLAR || state.src.charCodeAt(pos + 1) !== DOLLAR) return false;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	const firstLine = state.src.slice(pos + 2, max);
	const inlineClose = firstLine.indexOf("$$");
	if (inlineClose >= 0) {
		if (silent) return true;
		const token = state.push("math_block", "math", 0);
		token.block = true;
		token.markup = "$$";
		token.content = firstLine.slice(0, inlineClose);
		token.map = [startLine, startLine + 1];
		state.line = startLine + 1;
		return true;
	}
	let content = firstLine + "\n";
	let nextLine = startLine + 1;
	let closed = false;
	for (; nextLine < endLine; nextLine++) {
		const lpos = state.bMarks[nextLine] + state.tShift[nextLine];
		const lmax = state.eMarks[nextLine];
		const line = state.src.slice(lpos, lmax);
		const close = line.indexOf("$$");
		if (close >= 0) {
			content += line.slice(0, close);
			closed = true;
			break;
		}
		content += line + "\n";
	}
	if (!closed) return false;
	if (silent) return true;
	const token = state.push("math_block", "math", 0);
	token.block = true;
	token.markup = "$$";
	token.content = content;
	token.map = [startLine, nextLine + 1];
	state.line = nextLine + 1;
	return true;
}
/** Register math rules and renderers on a MarkdownIt instance. */
function mathPlugin(md) {
	md.inline.ruler.before("escape", "math_inline", mathInline);
	md.block.ruler.before("fence", "math_block", mathBlock, { alt: [
		"paragraph",
		"reference",
		"blockquote",
		"list"
	] });
	md.renderer.rules.math_inline = (tokens, idx) => {
		const token = tokens[idx];
		const display = Boolean(token.meta && token.meta.display);
		return `<span class="math math-inline">${latexToMathML(token.content, display)}</span>`;
	};
	md.renderer.rules.math_block = (tokens, idx) => {
		const token = tokens[idx];
		return `<div class="math math-display">${latexToMathML(token.content, true)}</div>\n`;
	};
}
//#endregion
//#region src/mindmap.ts
var MINDMAP_STYLE = "<style>.mindmap ul{list-style:none;margin:0;padding-left:1.25rem;position:relative}.mindmap li{position:relative;padding:.15rem 0 .15rem 1rem}.mindmap li::before{content:\"\";position:absolute;left:0;top:.85rem;width:.75rem;border-top:1px solid #b6c2cf}.mindmap li::after{content:\"\";position:absolute;left:0;top:0;bottom:0;border-left:1px solid #b6c2cf}.mindmap li:last-child::after{height:.85rem}.mindmap>ul>li::before,.mindmap>ul>li::after{display:none}.mindmap .mindmap-node{display:inline-block;padding:.1rem .5rem;border-radius:.35rem;background:#eef3f8;color:#1f2d3d;font-size:.95em;line-height:1.4}.mindmap>ul>li>.mindmap-node{background:#2f6fed;color:#fff;font-weight:600}</style>";
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function stripMarker(text) {
	return text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "");
}
/** Parse an indented outline into a forest of nodes. */
function parseMindMap(source) {
	const roots = [];
	const stack = [];
	for (const rawLine of source.split(/\r?\n/)) {
		if (!rawLine.trim()) continue;
		const match = /^([ \t]*)(.*)$/.exec(rawLine);
		const indent = match[1].replace(/\t/g, "  ").length;
		const text = stripMarker(match[2]).trim();
		if (!text) continue;
		const node = {
			text,
			children: []
		};
		while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
		if (stack.length) stack[stack.length - 1].node.children.push(node);
		else roots.push(node);
		stack.push({
			indent,
			node
		});
	}
	return roots;
}
function renderNodes(nodes) {
	if (!nodes.length) return "";
	return `<ul>${nodes.map((node) => {
		const children = node.children.length ? renderNodes(node.children) : "";
		return `<li><span class="mindmap-node">${escapeHtml(node.text)}</span>${children}</li>`;
	}).join("")}</ul>`;
}
/** Render a mind map outline to HTML. */
function renderMindMap(source) {
	return `<div class="mindmap">${MINDMAP_STYLE}${renderNodes(parseMindMap(source))}</div>\n`;
}
function isMindMapInfo(info) {
	var _info$trim$split$0$to, _info$trim$split$;
	const first = (_info$trim$split$0$to = (_info$trim$split$ = info.trim().split(/\s+/)[0]) === null || _info$trim$split$ === void 0 ? void 0 : _info$trim$split$.toLowerCase()) !== null && _info$trim$split$0$to !== void 0 ? _info$trim$split$0$to : "";
	return first === "mindmap" || first === "mmd";
}
/** Register the mind map fence renderer on a MarkdownIt instance. */
function mindmapPlugin(md) {
	const original = md.renderer.rules.fence;
	md.renderer.rules.fence = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (isMindMapInfo(token.info)) return renderMindMap(token.content);
		if (original) return original(tokens, idx, options, env, self);
		return self.renderToken(tokens, idx, options);
	};
}
//#endregion
//#region src/footnote.ts
// markdown-it-footnote 4.0.0 (MIT) — https://github.com/markdown-it/markdown-it-footnote
function render_footnote_anchor_name(tokens, idx, options, env) {
  const n = Number(tokens[idx].meta.id + 1).toString();
  let prefix = "";
  if (typeof env.docId === "string") prefix = `-${env.docId}-`;
  return prefix + n;
}
function render_footnote_caption(tokens, idx) {
  let n = Number(tokens[idx].meta.id + 1).toString();
  if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;
  return `[${n}]`;
}
function render_footnote_ref(tokens, idx, options, env, slf) {
  const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
  let refid = id;
  if (tokens[idx].meta.subId > 0) refid += `:${tokens[idx].meta.subId}`;
  return `<sup class="footnote-ref"><a href="#fn${id}" id="fnref${refid}">${caption}</a></sup>`;
}
function render_footnote_block_open(tokens, idx, options) {
  return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') + '<section class="footnotes">\n' + '<ol class="footnotes-list">\n';
}
function render_footnote_block_close() {
  return "</ol>\n</section>\n";
}
function render_footnote_open(tokens, idx, options, env, slf) {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
  return `<li id="fn${id}" class="footnote-item">`;
}
function render_footnote_close() {
  return "</li>\n";
}
function render_footnote_anchor(tokens, idx, options, env, slf) {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
  if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
  return ` <a href="#fnref${id}" class="footnote-backref">\u21A9\uFE0E</a>`;
}
function footnotePlugin(md) {
  const parseLinkLabel = md.helpers.parseLinkLabel;
  const isSpace = md.utils.isSpace;
  md.renderer.rules.footnote_ref = render_footnote_ref;
  md.renderer.rules.footnote_block_open = render_footnote_block_open;
  md.renderer.rules.footnote_block_close = render_footnote_block_close;
  md.renderer.rules.footnote_open = render_footnote_open;
  md.renderer.rules.footnote_close = render_footnote_close;
  md.renderer.rules.footnote_anchor = render_footnote_anchor;
  md.renderer.rules.footnote_caption = render_footnote_caption;
  md.renderer.rules.footnote_anchor_name = render_footnote_anchor_name;
  function footnote_def(state, startLine, endLine, silent) {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (start + 4 > max) return false;
    if (state.src.charCodeAt(start) !== 91) return false;
    if (state.src.charCodeAt(start + 1) !== 94) return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32) return false;
      if (state.src.charCodeAt(pos) === 93) {
        break;
      }
    }
    if (pos === start + 2) return false;
    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 58) return false;
    if (silent) return true;
    pos++;
    if (!state.env.footnotes) state.env.footnotes = {};
    if (!state.env.footnotes.refs) state.env.footnotes.refs = {};
    const label = state.src.slice(start + 2, pos - 2);
    state.env.footnotes.refs[`:${label}`] = -1;
    const token_fref_o = new state.Token("footnote_reference_open", "", 1);
    token_fref_o.meta = { label };
    token_fref_o.level = state.level++;
    state.tokens.push(token_fref_o);
    const oldBMark = state.bMarks[startLine];
    const oldTShift = state.tShift[startLine];
    const oldSCount = state.sCount[startLine];
    const oldParentType = state.parentType;
    const posAfterColon = pos;
    const initial = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (isSpace(ch)) {
        if (ch === 9) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
      } else {
        break;
      }
      pos++;
    }
    state.tShift[startLine] = pos - posAfterColon;
    state.sCount[startLine] = offset - initial;
    state.bMarks[startLine] = posAfterColon;
    state.blkIndent += 4;
    state.parentType = "footnote";
    if (state.sCount[startLine] < state.blkIndent) {
      state.sCount[startLine] += state.blkIndent;
    }
    state.md.block.tokenize(state, startLine, endLine, true);
    state.parentType = oldParentType;
    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;
    const token_fref_c = new state.Token("footnote_reference_close", "", -1);
    token_fref_c.level = --state.level;
    state.tokens.push(token_fref_c);
    return true;
  }
  function footnote_inline(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 2 >= max) return false;
    if (state.src.charCodeAt(start) !== 94) return false;
    if (state.src.charCodeAt(start + 1) !== 91) return false;
    const labelStart = start + 2;
    const labelEnd = parseLinkLabel(state, start + 1);
    if (labelEnd < 0) return false;
    if (!silent) {
      if (!state.env.footnotes) state.env.footnotes = {};
      if (!state.env.footnotes.list) state.env.footnotes.list = [];
      const footnoteId = state.env.footnotes.list.length;
      const tokens = [];
      state.md.inline.parse(state.src.slice(labelStart, labelEnd), state.md, state.env, tokens);
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId };
      state.env.footnotes.list[footnoteId] = {
        content: state.src.slice(labelStart, labelEnd),
        tokens
      };
    }
    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }
  function footnote_ref(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 3 > max) return false;
    if (!state.env.footnotes || !state.env.footnotes.refs) return false;
    if (state.src.charCodeAt(start) !== 91) return false;
    if (state.src.charCodeAt(start + 1) !== 94) return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32) return false;
      if (state.src.charCodeAt(pos) === 10) return false;
      if (state.src.charCodeAt(pos) === 93) {
        break;
      }
    }
    if (pos === start + 2) return false;
    if (pos >= max) return false;
    pos++;
    const label = state.src.slice(start + 2, pos - 1);
    if (typeof state.env.footnotes.refs[`:${label}`] === "undefined") return false;
    if (!silent) {
      if (!state.env.footnotes.list) state.env.footnotes.list = [];
      let footnoteId;
      if (state.env.footnotes.refs[`:${label}`] < 0) {
        footnoteId = state.env.footnotes.list.length;
        state.env.footnotes.list[footnoteId] = { label, count: 0 };
        state.env.footnotes.refs[`:${label}`] = footnoteId;
      } else {
        footnoteId = state.env.footnotes.refs[`:${label}`];
      }
      const footnoteSubId = state.env.footnotes.list[footnoteId].count;
      state.env.footnotes.list[footnoteId].count++;
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId, subId: footnoteSubId, label };
    }
    state.pos = pos;
    state.posMax = max;
    return true;
  }
  function footnote_tail(state) {
    let tokens;
    let current;
    let currentLabel;
    let insideRef = false;
    const refTokens = {};
    if (!state.env.footnotes) {
      return;
    }
    state.tokens = state.tokens.filter(function(tok) {
      if (tok.type === "footnote_reference_open") {
        insideRef = true;
        current = [];
        currentLabel = tok.meta.label;
        return false;
      }
      if (tok.type === "footnote_reference_close") {
        insideRef = false;
        refTokens[":" + currentLabel] = current;
        return false;
      }
      if (insideRef) {
        current.push(tok);
      }
      return !insideRef;
    });
    if (!state.env.footnotes.list) {
      return;
    }
    const list = state.env.footnotes.list;
    state.tokens.push(new state.Token("footnote_block_open", "", 1));
    for (let i = 0, l = list.length; i < l; i++) {
      const token_fo = new state.Token("footnote_open", "", 1);
      token_fo.meta = { id: i, label: list[i].label };
      state.tokens.push(token_fo);
      if (list[i].tokens) {
        tokens = [];
        const token_po = new state.Token("paragraph_open", "p", 1);
        token_po.block = true;
        tokens.push(token_po);
        const token_i = new state.Token("inline", "", 0);
        token_i.children = list[i].tokens;
        token_i.content = list[i].content;
        tokens.push(token_i);
        const token_pc = new state.Token("paragraph_close", "p", -1);
        token_pc.block = true;
        tokens.push(token_pc);
      } else if (list[i].label) {
        tokens = refTokens[`:${list[i].label}`];
      }
      if (tokens) state.tokens = state.tokens.concat(tokens);
      let lastParagraph;
      if (state.tokens[state.tokens.length - 1].type === "paragraph_close") {
        lastParagraph = state.tokens.pop();
      } else {
        lastParagraph = null;
      }
      const t = list[i].count > 0 ? list[i].count : 1;
      for (let j = 0; j < t; j++) {
        const token_a = new state.Token("footnote_anchor", "", 0);
        token_a.meta = { id: i, subId: j, label: list[i].label };
        state.tokens.push(token_a);
      }
      if (lastParagraph) {
        state.tokens.push(lastParagraph);
      }
      state.tokens.push(new state.Token("footnote_close", "", -1));
    }
    state.tokens.push(new state.Token("footnote_block_close", "", -1));
  }
  md.block.ruler.before("reference", "footnote_def", footnote_def, { alt: ["paragraph", "reference"] });
  md.inline.ruler.after("image", "footnote_inline", footnote_inline);
  md.inline.ruler.after("footnote_inline", "footnote_ref", footnote_ref);
  md.core.ruler.after("inline", "footnote_tail", footnote_tail);
}
//#endregion
//#region src/single.ts
/**
* MarkdownIt with the math and mind map extensions registered by default.
*/
var MarkdownItExtended = class extends MarkdownIt$1 {
	constructor(...args) {
		super(...args);
		this.set({ html: true });
		mathPlugin(this);
		mindmapPlugin(this);
		footnotePlugin(this);
	}
};
var MarkdownIt = callable(MarkdownItExtended);
/**
* Create a MarkdownIt instance with the math and mind map extensions applied.
*/
function createMarkdownIt(options) {
	return options ? new MarkdownIt(options) : new MarkdownIt();
}
var shared = createMarkdownIt();
/**
* Convert a Markdown string to an HTML string.
*/
function markdownToHtml(src, env = {}, options) {
	return (options ? createMarkdownIt(options) : shared).render(src, env);
}
/**
* Convert a single inline fragment (no block structure) to HTML.
*/
function markdownInlineToHtml(src, env = {}, options) {
	return (options ? createMarkdownIt(options) : shared).renderInline(src, env);
}
//#endregion
return {
    MarkdownIt,
    createMarkdownIt,
    default: markdownToHtml,
    markdownToHtml,
    latexToMathML,
    markdownInlineToHtml,
    parseMindMap,
    renderMindMap
};
})();

  // ===================== PrismJS 1.29.0 =====================
var Prism = (function () {
/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+c+csharp+cpp+css-extras+glsl+ini+json+markup-templating+php+python&plugins=autolinker+inline-color+autoloader */
/// <reference lib="WebWorker"/>

var _self = (typeof window !== 'undefined')
    ? window   // if in browser
    : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
            ? self // if in worker
            : {}   // if in node js
    );

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = (function (_self) {

    // Private helper vars
    var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    var uniqueId = 0;

    // The grammar object for plaintext
    var plainTextGrammar = {};


    var _ = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: _self.Prism && _self.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
            encode: function encode(tokens) {
                if (tokens instanceof Token) {
                    return new Token(tokens.type, encode(tokens.content), tokens.alias);
                } else if (Array.isArray(tokens)) {
                    return tokens.map(encode);
                } else {
                    return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
                }
            },

            type: function (o) {
                return Object.prototype.toString.call(o).slice(8, -1);
            },

            /**
             * Returns a unique number for the given object. Later calls will still return the same number.
             *
             * @param {Object} obj
             * @returns {number}
             */
            objId: function (obj) {
                if (!obj['__id']) {
                    Object.defineProperty(obj, '__id', { value: ++uniqueId });
                }
                return obj['__id'];
            },

            /**
             * Creates a deep clone of the given object.
             *
             * The main intended use of this function is to clone language definitions.
             *
             * @param {T} o
             * @param {Record<number, any>} [visited]
             * @returns {T}
             * @template T
             */
            clone: function deepClone(o, visited) {
                visited = visited || {};

                var clone; var id;
                switch (_.util.type(o)) {
                    case 'Object':
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = /** @type {Record<string, any>} */ ({});
                        visited[id] = clone;

                        for (var key in o) {
                            if (o.hasOwnProperty(key)) {
                                clone[key] = deepClone(o[key], visited);
                            }
                        }

                        return /** @type {any} */ (clone);

                    case 'Array':
                        id = _.util.objId(o);
                        if (visited[id]) {
                            return visited[id];
                        }
                        clone = [];
                        visited[id] = clone;

                        (/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
                            clone[i] = deepClone(v, visited);
                        });

                        return /** @type {any} */ (clone);

                    default:
                        return o;
                }
            },

            /**
             * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
             *
             * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
             *
             * @param {Element} element
             * @returns {string}
             */
            getLanguage: function (element) {
                while (element) {
                    var m = lang.exec(element.className);
                    if (m) {
                        return m[1].toLowerCase();
                    }
                    element = element.parentElement;
                }
                return 'none';
            },

            setLanguage: function (element, language) {
                // remove all `language-xxxx` classes
                // (this might leave behind a leading space)
                element.className = element.className.replace(RegExp(lang, 'gi'), '');

                // add the new `language-xxxx` class
                // (using `classList` will automatically clean up spaces for us)
                element.classList.add('language-' + language);
            },

            currentScript: function () {
                if (typeof document === 'undefined') {
                    return null;
                }
                if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
                    return /** @type {any} */ (document.currentScript);
                }
                try {
                    throw new Error();
                } catch (err) {

                    var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
                    if (src) {
                        var scripts = document.getElementsByTagName('script');
                        for (var i in scripts) {
                            if (scripts[i].src == src) {
                                return scripts[i];
                            }
                        }
                    }
                    return null;
                }
            },

            isActive: function (element, className, defaultActivation) {
                var no = 'no-' + className;

                while (element) {
                    var classList = element.classList;
                    if (classList.contains(className)) {
                        return true;
                    }
                    if (classList.contains(no)) {
                        return false;
                    }
                    element = element.parentElement;
                }
                return !!defaultActivation;
            }
        },

        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
            /**
             * The grammar for plain, unformatted text.
             */
            plain: plainTextGrammar,
            plaintext: plainTextGrammar,
            text: plainTextGrammar,
            txt: plainTextGrammar,

            extend: function (id, redef) {
                var lang = _.util.clone(_.languages[id]);

                for (var key in redef) {
                    lang[key] = redef[key];
                }

                return lang;
            },

            insertBefore: function (inside, before, insert, root) {
                root = root || /** @type {any} */ (_.languages);
                var grammar = root[inside];
                /** @type {Grammar} */
                var ret = {};

                for (var token in grammar) {
                    if (grammar.hasOwnProperty(token)) {

                        if (token == before) {
                            for (var newToken in insert) {
                                if (insert.hasOwnProperty(newToken)) {
                                    ret[newToken] = insert[newToken];
                                }
                            }
                        }

                        // Do not insert token which also occur in insert. See #1525
                        if (!insert.hasOwnProperty(token)) {
                            ret[token] = grammar[token];
                        }
                    }
                }

                var old = root[inside];
                root[inside] = ret;

                // Update references in other language definitions
                _.languages.DFS(_.languages, function (key, value) {
                    if (value === old && key != inside) {
                        this[key] = ret;
                    }
                });

                return ret;
            },

            // Traverse a language definition with Depth First Search
            DFS: function DFS(o, callback, type, visited) {
                visited = visited || {};

                var objId = _.util.objId;

                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        callback.call(o, i, o[i], type || i);

                        var property = o[i];
                        var propertyType = _.util.type(property);

                        if (propertyType === 'Object' && !visited[objId(property)]) {
                            visited[objId(property)] = true;
                            DFS(property, callback, null, visited);
                        } else if (propertyType === 'Array' && !visited[objId(property)]) {
                            visited[objId(property)] = true;
                            DFS(property, callback, i, visited);
                        }
                    }
                }
            }
        },

        plugins: {},

        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function (async, callback) {
            _.highlightAllUnder(document, async, callback);
        },

        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function (container, async, callback) {
            var env = {
                callback: callback,
                container: container,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };

            _.hooks.run('before-highlightall', env);

            env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

            _.hooks.run('before-all-elements-highlight', env);

            for (var i = 0, element; (element = env.elements[i++]);) {
                _.highlightElement(element, async === true, env.callback);
            }
        },

        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function (element, async, callback) {
            // Find language
            var language = _.util.getLanguage(element);
            var grammar = _.languages[language];

            // Set language on the element, if not present
            _.util.setLanguage(element, language);

            // Set language on the parent, for styling
            var parent = element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === 'pre') {
                _.util.setLanguage(parent, language);
            }

            var code = element.textContent;

            var env = {
                element: element,
                language: language,
                grammar: grammar,
                code: code
            };

            function insertHighlightedCode(highlightedCode) {
                env.highlightedCode = highlightedCode;

                _.hooks.run('before-insert', env);

                env.element.innerHTML = env.highlightedCode;

                _.hooks.run('after-highlight', env);
                _.hooks.run('complete', env);
                callback && callback.call(env.element);
            }

            _.hooks.run('before-sanity-check', env);

            // plugins may change/add the parent/element
            parent = env.element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
                parent.setAttribute('tabindex', '0');
            }

            if (!env.code) {
                _.hooks.run('complete', env);
                callback && callback.call(env.element);
                return;
            }

            _.hooks.run('before-highlight', env);

            if (!env.grammar) {
                insertHighlightedCode(_.util.encode(env.code));
                return;
            }

            if (async && _self.Worker) {
                var worker = new Worker(_.filename);

                worker.onmessage = function (evt) {
                    insertHighlightedCode(evt.data);
                };

                worker.postMessage(JSON.stringify({
                    language: env.language,
                    code: env.code,
                    immediateClose: true
                }));
            } else {
                insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
            }
        },

        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function (text, grammar, language) {
            var env = {
                code: text,
                grammar: grammar,
                language: language
            };
            _.hooks.run('before-tokenize', env);
            if (!env.grammar) {
                throw new Error('The language "' + env.language + '" has no grammar.');
            }
            env.tokens = _.tokenize(env.code, env.grammar);
            _.hooks.run('after-tokenize', env);
            return Token.stringify(_.util.encode(env.tokens), env.language);
        },

        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function (text, grammar) {
            var rest = grammar.rest;
            if (rest) {
                for (var token in rest) {
                    grammar[token] = rest[token];
                }

                delete grammar.rest;
            }

            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text);

            matchGrammar(text, tokenList, grammar, tokenList.head, 0);

            return toArray(tokenList);
        },

        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
            all: {},

            /**
             * Adds the given callback to the list of callbacks for the given hook.
             *
             * The callback will be invoked when the hook it is registered for is run.
             * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
             *
             * One callback function can be registered to multiple hooks and the same hook multiple times.
             *
             * @param {string} name The name of the hook.
             * @param {HookCallback} callback The callback function which is given environment variables.
             * @public
             */
            add: function (name, callback) {
                var hooks = _.hooks.all;

                hooks[name] = hooks[name] || [];

                hooks[name].push(callback);
            },

            /**
             * Runs a hook invoking all registered callbacks with the given environment variables.
             *
             * Callbacks will be invoked synchronously and in the order in which they were registered.
             *
             * @param {string} name The name of the hook.
             * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
             * @public
             */
            run: function (name, env) {
                var callbacks = _.hooks.all[name];

                if (!callbacks || !callbacks.length) {
                    return;
                }

                for (var i = 0, callback; (callback = callbacks[i++]);) {
                    callback(env);
                }
            }
        },

        Token: Token
    };
    _self.Prism = _;


    // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */
    function Token(type, content, alias, matchedStr) {
        /**
         * The type of the token.
         *
         * This is usually the key of a pattern in a {@link Grammar}.
         *
         * @type {string}
         * @see GrammarToken
         * @public
         */
        this.type = type;
        /**
         * The strings or tokens contained by this token.
         *
         * This will be a token stream if the pattern matched also defined an `inside` grammar.
         *
         * @type {string | TokenStream}
         * @public
         */
        this.content = content;
        /**
         * The alias(es) of the token.
         *
         * @type {string|string[]}
         * @see GrammarToken
         * @public
         */
        this.alias = alias;
        // Copy of the full string this token was created from
        this.length = (matchedStr || '').length | 0;
    }

    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */
    Token.stringify = function stringify(o, language) {
        if (typeof o == 'string') {
            return o;
        }
        if (Array.isArray(o)) {
            var s = '';
            o.forEach(function (e) {
                s += stringify(e, language);
            });
            return s;
        }

        var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: 'span',
            classes: ['token', o.type],
            attributes: {},
            language: language
        };

        var aliases = o.alias;
        if (aliases) {
            if (Array.isArray(aliases)) {
                Array.prototype.push.apply(env.classes, aliases);
            } else {
                env.classes.push(aliases);
            }
        }

        _.hooks.run('wrap', env);

        var attributes = '';
        for (var name in env.attributes) {
            attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
        }

        return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };

    /**
     * @param {RegExp} pattern
     * @param {number} pos
     * @param {string} text
     * @param {boolean} lookbehind
     * @returns {RegExpExecArray | null}
     */
    function matchPattern(pattern, pos, text, lookbehind) {
        pattern.lastIndex = pos;
        var match = pattern.exec(text);
        if (match && lookbehind && match[1]) {
            // change the match to remove the text matched by the Prism lookbehind group
            var lookbehindLength = match[1].length;
            match.index += lookbehindLength;
            match[0] = match[0].slice(lookbehindLength);
        }
        return match;
    }

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */
    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
        for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }

            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
                if (rematch && rematch.cause == token + ',' + j) {
                    return;
                }

                var patternObj = patterns[j];
                var inside = patternObj.inside;
                var lookbehind = !!patternObj.lookbehind;
                var greedy = !!patternObj.greedy;
                var alias = patternObj.alias;

                if (greedy && !patternObj.pattern.global) {
                    // Without the global flag, lastIndex won't work
                    var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
                    patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
                }

                /** @type {RegExp} */
                var pattern = patternObj.pattern || patternObj;

                for ( // iterate the token list and keep track of the current token/string position
                    var currentNode = startNode.next, pos = startPos;
                    currentNode !== tokenList.tail;
                    pos += currentNode.value.length, currentNode = currentNode.next
                ) {

                    if (rematch && pos >= rematch.reach) {
                        break;
                    }

                    var str = currentNode.value;

                    if (tokenList.length > text.length) {
                        // Something went terribly wrong, ABORT, ABORT!
                        return;
                    }

                    if (str instanceof Token) {
                        continue;
                    }

                    var removeCount = 1; // this is the to parameter of removeBetween
                    var match;

                    if (greedy) {
                        match = matchPattern(pattern, pos, text, lookbehind);
                        if (!match || match.index >= text.length) {
                            break;
                        }

                        var from = match.index;
                        var to = match.index + match[0].length;
                        var p = pos;

                        // find the node that contains the match
                        p += currentNode.value.length;
                        while (from >= p) {
                            currentNode = currentNode.next;
                            p += currentNode.value.length;
                        }
                        // adjust pos (and p)
                        p -= currentNode.value.length;
                        pos = p;

                        // the current node is a Token, then the match starts inside another Token, which is invalid
                        if (currentNode.value instanceof Token) {
                            continue;
                        }

                        // find the last node which is affected by this match
                        for (
                            var k = currentNode;
                            k !== tokenList.tail && (p < to || typeof k.value === 'string');
                            k = k.next
                        ) {
                            removeCount++;
                            p += k.value.length;
                        }
                        removeCount--;

                        // replace with the new match
                        str = text.slice(pos, p);
                        match.index -= pos;
                    } else {
                        match = matchPattern(pattern, 0, str, lookbehind);
                        if (!match) {
                            continue;
                        }
                    }

                    // eslint-disable-next-line no-redeclare
                    var from = match.index;
                    var matchStr = match[0];
                    var before = str.slice(0, from);
                    var after = str.slice(from + matchStr.length);

                    var reach = pos + str.length;
                    if (rematch && reach > rematch.reach) {
                        rematch.reach = reach;
                    }

                    var removeFrom = currentNode.prev;

                    if (before) {
                        removeFrom = addAfter(tokenList, removeFrom, before);
                        pos += before.length;
                    }

                    removeRange(tokenList, removeFrom, removeCount);

                    var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
                    currentNode = addAfter(tokenList, removeFrom, wrapped);

                    if (after) {
                        addAfter(tokenList, currentNode, after);
                    }

                    if (removeCount > 1) {
                        // at least one Token object was removed, so we have to do some rematching
                        // this can only happen if the current pattern is greedy

                        /** @type {RematchOptions} */
                        var nestedRematch = {
                            cause: token + ',' + j,
                            reach: reach
                        };
                        matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

                        // the reach might have been extended because of the rematching
                        if (rematch && nestedRematch.reach > rematch.reach) {
                            rematch.reach = nestedRematch.reach;
                        }
                    }
                }
            }
        }
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */
    function LinkedList() {
        /** @type {LinkedListNode<T>} */
        var head = { value: null, prev: null, next: null };
        /** @type {LinkedListNode<T>} */
        var tail = { value: null, prev: head, next: null };
        head.next = tail;

        /** @type {LinkedListNode<T>} */
        this.head = head;
        /** @type {LinkedListNode<T>} */
        this.tail = tail;
        this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
        // assumes that node != list.tail && values.length >= 0
        var next = node.next;

        var newNode = { value: value, prev: node, next: next };
        node.next = newNode;
        next.prev = newNode;
        list.length++;

        return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
        var next = node.next;
        for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
        }
        node.next = next;
        next.prev = node;
        list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
        var array = [];
        var node = list.head.next;
        while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
        }
        return array;
    }


    if (!_self.document) {
        if (!_self.addEventListener) {
            // in Node.js
            return _;
        }

        if (!_.disableWorkerMessageHandler) {
            // In worker
            _self.addEventListener('message', function (evt) {
                var message = JSON.parse(evt.data);
                var lang = message.language;
                var code = message.code;
                var immediateClose = message.immediateClose;

                _self.postMessage(_.highlight(code, _.languages[lang], lang));
                if (immediateClose) {
                    _self.close();
                }
            }, false);
        }

        return _;
    }

    // Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
        _.filename = script.src;

        if (script.hasAttribute('data-manual')) {
            _.manual = true;
        }
    }

    function highlightAutomaticallyCallback() {
        if (!_.manual) {
            _.highlightAll();
        }
    }

    if (!_.manual) {
        // If the document state is "loading", then we'll use DOMContentLoaded.
        // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
        // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
        // might take longer one animation frame to execute which can create a race condition where only some plugins have
        // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
        // See https://github.com/PrismJS/prism/issues/2102
        var readyState = document.readyState;
        if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
            document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
        } else {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(highlightAutomaticallyCallback);
            } else {
                window.setTimeout(highlightAutomaticallyCallback, 16);
            }
        }
    }

    return _;

}(_self));

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
    global.Prism = Prism;
}

// some additional documentation/types

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef GrammarToken
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested grammar of this token.
 *
 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
 *
 * This can be used to make nested and even recursive language definitions.
 *
 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
 * each another.
 * @global
 * @public
 */

/**
 * @typedef Grammar
 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
 * @global
 * @public
 */

/**
 * A function which will invoked after an element was successfully highlighted.
 *
 * @callback HighlightCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 * @global
 * @public
 */

/**
 * @callback HookCallback
 * @param {Object<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @global
 * @public
 */

Prism.languages.markup = {
    'comment': {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: true
    },
    'prolog': {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: true
    },
    'doctype': {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: true,
        inside: {
            'internal-subset': {
                pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                lookbehind: true,
                greedy: true,
                inside: null // see below
            },
            'string': {
                pattern: /"[^"]*"|'[^']*'/,
                greedy: true
            },
            'punctuation': /^<!|>$|[[\]]/,
            'doctype-tag': /^DOCTYPE/i,
            'name': /[^\s<>'"]+/
        }
    },
    'cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: true
    },
    'tag': {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: true,
        inside: {
            'tag': {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {
                    'punctuation': /^<\/?/,
                    'namespace': /^[^\s>\/:]+:/
                }
            },
            'special-attr': [],
            'attr-value': {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    'punctuation': [
                        {
                            pattern: /^=/,
                            alias: 'attr-equals'
                        },
                        {
                            pattern: /^(\s*)["']|["']$/,
                            lookbehind: true
                        }
                    ]
                }
            },
            'punctuation': /\/?>/,
            'attr-name': {
                pattern: /[^\s>\/]+/,
                inside: {
                    'namespace': /^[^\s>\/:]+:/
                }
            }

        }
    },
    'entity': [
        {
            pattern: /&[\da-z]{1,8};/i,
            alias: 'named-entity'
        },
        /&#x?[\da-f]{1,8};/i
    ]
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {

    if (env.type === 'entity') {
        env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
});

Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
        var includedCdataInside = {};
        includedCdataInside['language-' + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism.languages[lang]
        };
        includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

        var inside = {
            'included-cdata': {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: includedCdataInside
            }
        };
        inside['language-' + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[lang]
        };

        var def = {};
        def[tagName] = {
            pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
            lookbehind: true,
            greedy: true,
            inside: inside
        };

        Prism.languages.insertBefore('markup', 'cdata', def);
    }
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function (attrName, lang) {
        Prism.languages.markup.tag.inside['special-attr'].push({
            pattern: RegExp(
                /(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                'i'
            ),
            lookbehind: true,
            inside: {
                'attr-name': /^[^\s=]+/,
                'attr-value': {
                    pattern: /=[\s\S]+/,
                    inside: {
                        'value': {
                            pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                            lookbehind: true,
                            alias: [lang, 'language-' + lang],
                            inside: Prism.languages[lang]
                        },
                        'punctuation': [
                            {
                                pattern: /^=/,
                                alias: 'attr-equals'
                            },
                            /"|'/
                        ]
                    }
                }
            }
        });
    }
});

Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

(function (Prism) {

    var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;

    Prism.languages.css = {
        'comment': /\/\*[\s\S]*?\*\//,
        'atrule': {
            pattern: RegExp('@[\\w-](?:' + /[^;{\s"']|\s+(?!\s)/.source + '|' + string.source + ')*?' + /(?:;|(?=\s*\{))/.source),
            inside: {
                'rule': /^@[\w-]+/,
                'selector-function-argument': {
                    pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                    lookbehind: true,
                    alias: 'selector'
                },
                'keyword': {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: true
                }
                // See rest below
            }
        },
        'url': {
            // https://drafts.csswg.org/css-values-3/#urls
            pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
            greedy: true,
            inside: {
                'function': /^url/i,
                'punctuation': /^\(|\)$/,
                'string': {
                    pattern: RegExp('^' + string.source + '$'),
                    alias: 'url'
                }
            }
        },
        'selector': {
            pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
            lookbehind: true
        },
        'string': {
            pattern: string,
            greedy: true
        },
        'property': {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: true
        },
        'important': /!important\b/i,
        'function': {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: true
        },
        'punctuation': /[(){};:,]/
    };

    Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    var markup = Prism.languages.markup;
    if (markup) {
        markup.tag.addInlined('style', 'css');
        markup.tag.addAttribute('style', 'css');
    }

}(Prism));

Prism.languages.clike = {
    'comment': [
        {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
            greedy: true
        },
        {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true
        }
    ],
    'string': {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
    },
    'class-name': {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: true,
        inside: {
            'punctuation': /[.\\]/
        }
    },
    'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    'boolean': /\b(?:false|true)\b/,
    'function': /\b\w+(?=\()/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    'punctuation': /[{}[\];(),.:]/
};

Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [
        Prism.languages.clike['class-name'],
        {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: true
        }
    ],
    'keyword': [
        {
            pattern: /((?:^|\})\s*)catch\b/,
            lookbehind: true
        },
        {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true
        },
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    'number': {
        pattern: RegExp(
            /(^|[^\w$])/.source +
            '(?:' +
            (
                // constant
                /NaN|Infinity/.source +
                '|' +
                // binary integer
                /0[bB][01]+(?:_[01]+)*n?/.source +
                '|' +
                // octal integer
                /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                '|' +
                // hexadecimal integer
                /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                '|' +
                // decimal bigint
                /\d+(?:_\d+)*n/.source +
                '|' +
                // decimal number (integer or float) but no bigint
                /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source
            ) +
            ')' +
            /(?![\w$])/.source
        ),
        lookbehind: true
    },
    'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});

Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;

Prism.languages.insertBefore('javascript', 'keyword', {
    'regex': {
        pattern: RegExp(
            // lookbehind
            // eslint-disable-next-line regexp/no-dupe-characters-character-class
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
            // Regex pattern:
            // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
            // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
            // with the only syntax, so we have to define 2 different regex patterns.
            /\//.source +
            '(?:' +
            /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
            '|' +
            // `v` flag syntax. This supports 3 levels of nested character classes.
            /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source +
            ')' +
            // lookahead
            /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
            'regex-source': {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: true,
                alias: 'language-regex',
                inside: Prism.languages.regex
            },
            'regex-delimiter': /^\/|\/$/,
            'regex-flags': /^[a-z]+$/,
        }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: 'function'
    },
    'parameter': [
        {
            pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
            lookbehind: true,
            inside: Prism.languages.javascript
        },
        {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
            lookbehind: true,
            inside: Prism.languages.javascript
        },
        {
            pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: Prism.languages.javascript
        },
        {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: Prism.languages.javascript
        }
    ],
    'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});

Prism.languages.insertBefore('javascript', 'string', {
    'hashbang': {
        pattern: /^#!.*/,
        greedy: true,
        alias: 'comment'
    },
    'template-string': {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: true,
        inside: {
            'template-punctuation': {
                pattern: /^`|`$/,
                alias: 'string'
            },
            'interpolation': {
                pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                lookbehind: true,
                inside: {
                    'interpolation-punctuation': {
                        pattern: /^\$\{|\}$/,
                        alias: 'punctuation'
                    },
                    rest: Prism.languages.javascript
                }
            },
            'string': /[\s\S]+/
        }
    },
    'string-property': {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: true,
        greedy: true,
        alias: 'property'
    }
});

Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: true,
        alias: 'property'
    },
});

if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript');

    // add attribute support for all DOM events.
    // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
    Prism.languages.markup.tag.addAttribute(
        /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
        'javascript'
    );
}

Prism.languages.js = Prism.languages.javascript;

Prism.languages.c = Prism.languages.extend('clike', {
    'comment': {
        pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: true
    },
    'string': {
        // https://en.cppreference.com/w/c/language/string_literal
        pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
        greedy: true
    },
    'class-name': {
        pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
        lookbehind: true
    },
    'keyword': /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    'function': /\b[a-z_]\w*(?=\s*\()/i,
    'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
});

Prism.languages.insertBefore('c', 'string', {
    'char': {
        // https://en.cppreference.com/w/c/language/character_constant
        pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
        greedy: true
    }
});

Prism.languages.insertBefore('c', 'string', {
    'macro': {
        // allow for multiline macro definitions
        // spaces after the # character compile fine with gcc
        pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
        lookbehind: true,
        greedy: true,
        alias: 'property',
        inside: {
            'string': [
                {
                    // highlight the path of the include statement as a string
                    pattern: /^(#\s*include\s*)<[^>]+>/,
                    lookbehind: true
                },
                Prism.languages.c['string']
            ],
            'char': Prism.languages.c['char'],
            'comment': Prism.languages.c['comment'],
            'macro-name': [
                {
                    pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
                    lookbehind: true
                },
                {
                    pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
                    lookbehind: true,
                    alias: 'function'
                }
            ],
            // highlight macro directives as keywords
            'directive': {
                pattern: /^(#\s*)[a-z]+/,
                lookbehind: true,
                alias: 'keyword'
            },
            'directive-hash': /^#/,
            'punctuation': /##|\\(?=[\r\n])/,
            'expression': {
                pattern: /\S[\s\S]*/,
                inside: Prism.languages.c
            }
        }
    }
});

Prism.languages.insertBefore('c', 'function', {
    // highlight predefined macros as constants
    'constant': /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
});

delete Prism.languages.c['boolean'];

(function (Prism) {

    /**
     * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
     *
     * Note: This is a simple text based replacement. Be careful when using backreferences!
     *
     * @param {string} pattern the given pattern.
     * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
     * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
     * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
     */
    function replace(pattern, replacements) {
        return pattern.replace(/<<(\d+)>>/g, function (m, index) {
            return '(?:' + replacements[+index] + ')';
        });
    }
    /**
     * @param {string} pattern
     * @param {string[]} replacements
     * @param {string} [flags]
     * @returns {RegExp}
     */
    function re(pattern, replacements, flags) {
        return RegExp(replace(pattern, replacements), flags || '');
    }

    /**
     * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
     *
     * @param {string} pattern
     * @param {number} depthLog2
     * @returns {string}
     */
    function nested(pattern, depthLog2) {
        for (var i = 0; i < depthLog2; i++) {
            pattern = pattern.replace(/<<self>>/g, function () { return '(?:' + pattern + ')'; });
        }
        return pattern.replace(/<<self>>/g, '[^\\s\\S]');
    }

    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
    var keywordKinds = {
        // keywords which represent a return or variable type
        type: 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
        // keywords which are used to declare a type
        typeDeclaration: 'class enum interface record struct',
        // contextual keywords
        // ("var" and "dynamic" are missing because they are used like types)
        contextual: 'add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)',
        // all other keywords
        other: 'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
    };

    // keywords
    function keywordsToPattern(words) {
        return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
    }
    var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
    var keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other));
    var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other);
    var nonContextualKeywords = keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.other);

    // types
    var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
    var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
    var name = /@?\b[A-Za-z_]\w*\b/.source;
    var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
    var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
    var array = /\[\s*(?:,\s*)*\]/.source;
    var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
    var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array]);
    var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
    var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);

    var typeInside = {
        'keyword': keywords,
        'punctuation': /[<>()?,.:[\]]/
    };

    // strings & characters
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
    var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
    var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
    var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;


    Prism.languages.csharp = Prism.languages.extend('clike', {
        'string': [
            {
                pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
                lookbehind: true,
                greedy: true
            },
            {
                pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
                lookbehind: true,
                greedy: true
            }
        ],
        'class-name': [
            {
                // Using static
                // using static System.Math;
                pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
                lookbehind: true,
                inside: typeInside
            },
            {
                // Using alias (type)
                // using Project = PC.MyCompany.Project;
                pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
                lookbehind: true,
                inside: typeInside
            },
            {
                // Using alias (alias)
                // using Project = PC.MyCompany.Project;
                pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
                lookbehind: true
            },
            {
                // Type declarations
                // class Foo<A, B>
                // interface Foo<out A, B>
                pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
                lookbehind: true,
                inside: typeInside
            },
            {
                // Single catch exception declaration
                // catch(Foo)
                // (things like catch(Foo e) is covered by variable declaration)
                pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
                lookbehind: true,
                inside: typeInside
            },
            {
                // Name of the type parameter of generic constraints
                // where Foo : class
                pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
                lookbehind: true
            },
            {
                // Casts and checks via as and is.
                // as Foo<A>, is Bar<B>
                // (things like if(a is Foo b) is covered by variable declaration)
                pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
                lookbehind: true,
                inside: typeInside
            },
            {
                // Variable, field and parameter declaration
                // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
                pattern: re(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
                inside: typeInside
            }
        ],
        'keyword': keywords,
        // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
        'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
        'operator': />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
        'punctuation': /\?\.?|::|[{}[\];(),.:]/
    });

    Prism.languages.insertBefore('csharp', 'number', {
        'range': {
            pattern: /\.\./,
            alias: 'operator'
        }
    });

    Prism.languages.insertBefore('csharp', 'punctuation', {
        'named-parameter': {
            pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
            lookbehind: true,
            alias: 'punctuation'
        }
    });

    Prism.languages.insertBefore('csharp', 'class-name', {
        'namespace': {
            // namespace Foo.Bar {}
            // using Foo.Bar;
            pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
            lookbehind: true,
            inside: {
                'punctuation': /\./
            }
        },
        'type-expression': {
            // default(Foo), typeof(Foo<Bar>), sizeof(int)
            pattern: re(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [nestedRound]),
            lookbehind: true,
            alias: 'class-name',
            inside: typeInside
        },
        'return-type': {
            // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
            // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
            // int Foo => 0; int Foo { get; set } = 0;
            pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
            inside: typeInside,
            alias: 'class-name'
        },
        'constructor-invocation': {
            // new List<Foo<Bar[]>> { }
            pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
            lookbehind: true,
            inside: typeInside,
            alias: 'class-name'
        },
        /*'explicit-implementation': {
            // int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
            pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
            inside: classNameInside,
            alias: 'class-name'
        },*/
        'generic-method': {
            // foo<Bar>()
            pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
            inside: {
                'function': re(/^<<0>>/.source, [name]),
                'generic': {
                    pattern: RegExp(generic),
                    alias: 'class-name',
                    inside: typeInside
                }
            }
        },
        'type-list': {
            // The list of types inherited or of generic constraints
            // class Foo<F> : Bar, IList<FooBar>
            // where F : Bar, IList<int>
            pattern: re(
                /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
                [typeDeclarationKeywords, genericName, name, typeExpression, keywords.source, nestedRound, /\bnew\s*\(\s*\)/.source]
            ),
            lookbehind: true,
            inside: {
                'record-arguments': {
                    pattern: re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [genericName, nestedRound]),
                    lookbehind: true,
                    greedy: true,
                    inside: Prism.languages.csharp
                },
                'keyword': keywords,
                'class-name': {
                    pattern: RegExp(typeExpression),
                    greedy: true,
                    inside: typeInside
                },
                'punctuation': /[,()]/
            }
        },
        'preprocessor': {
            pattern: /(^[\t ]*)#.*/m,
            lookbehind: true,
            alias: 'property',
            inside: {
                // highlight preprocessor directives as keywords
                'directive': {
                    pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
                    lookbehind: true,
                    alias: 'keyword'
                }
            }
        }
    });

    // attributes
    var regularStringOrCharacter = regularString + '|' + character;
    var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
    var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);

    // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
    var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
    var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);

    Prism.languages.insertBefore('csharp', 'class-name', {
        'attribute': {
            // Attributes
            // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
            pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
            lookbehind: true,
            greedy: true,
            inside: {
                'target': {
                    pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
                    alias: 'keyword'
                },
                'attribute-arguments': {
                    pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
                    inside: Prism.languages.csharp
                },
                'class-name': {
                    pattern: RegExp(identifier),
                    inside: {
                        'punctuation': /\./
                    }
                },
                'punctuation': /[:,]/
            }
        }
    });


    // string interpolation
    var formatString = /:[^}\r\n]+/.source;
    // multi line
    var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
    var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
    // single line
    var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2);
    var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);

    function createInterpolationInside(interpolation, interpolationRound) {
        return {
            'interpolation': {
                pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
                lookbehind: true,
                inside: {
                    'format-string': {
                        pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
                        lookbehind: true,
                        inside: {
                            'punctuation': /^:/
                        }
                    },
                    'punctuation': /^\{|\}$/,
                    'expression': {
                        pattern: /[\s\S]+/,
                        alias: 'language-csharp',
                        inside: Prism.languages.csharp
                    }
                }
            },
            'string': /[\s\S]+/
        };
    }

    Prism.languages.insertBefore('csharp', 'string', {
        'interpolation-string': [
            {
                pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
                lookbehind: true,
                greedy: true,
                inside: createInterpolationInside(mInterpolation, mInterpolationRound),
            },
            {
                pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
                lookbehind: true,
                greedy: true,
                inside: createInterpolationInside(sInterpolation, sInterpolationRound),
            }
        ],
        'char': {
            pattern: RegExp(character),
            greedy: true
        }
    });

    Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;

}(Prism));

(function (Prism) {

    var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
    var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function () { return keyword.source; });

    Prism.languages.cpp = Prism.languages.extend('c', {
        'class-name': [
            {
                pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source
                    .replace(/<keyword>/g, function () { return keyword.source; })),
                lookbehind: true
            },
            // This is intended to capture the class name of method implementations like:
            //   void foo::bar() const {}
            // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
            // it starts with an uppercase letter. This approximation should give decent results.
            /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
            // This will capture the class name before destructors like:
            //   Foo::~Foo() {}
            /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
            // This also intends to capture the class name of method implementations but here the class has template
            // parameters, so it can't be a namespace (until C++ adds generic namespaces).
            /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
        ],
        'keyword': keyword,
        'number': {
            pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
            greedy: true
        },
        'operator': />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
        'boolean': /\b(?:false|true)\b/
    });

    Prism.languages.insertBefore('cpp', 'string', {
        'module': {
            // https://en.cppreference.com/w/cpp/language/modules
            pattern: RegExp(
                /(\b(?:import|module)\s+)/.source +
                '(?:' +
                // header-name
                /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
                '|' +
                // module name or partition or both
                /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function () { return modName; }) +
                ')'
            ),
            lookbehind: true,
            greedy: true,
            inside: {
                'string': /^[<"][\s\S]+/,
                'operator': /:/,
                'punctuation': /\./
            }
        },
        'raw-string': {
            pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
            alias: 'string',
            greedy: true
        }
    });

    Prism.languages.insertBefore('cpp', 'keyword', {
        'generic-function': {
            pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
            inside: {
                'function': /^\w+/,
                'generic': {
                    pattern: /<[\s\S]+/,
                    alias: 'class-name',
                    inside: Prism.languages.cpp
                }
            }
        }
    });

    Prism.languages.insertBefore('cpp', 'operator', {
        'double-colon': {
            pattern: /::/,
            alias: 'punctuation'
        }
    });

    Prism.languages.insertBefore('cpp', 'class-name', {
        // the base clause is an optional list of parent classes
        // https://en.cppreference.com/w/cpp/language/class
        'base-clause': {
            pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
            lookbehind: true,
            greedy: true,
            inside: Prism.languages.extend('cpp', {})
        }
    });

    Prism.languages.insertBefore('inside', 'double-colon', {
        // All untokenized words that are not namespaces should be class names
        'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
    }, Prism.languages.cpp['base-clause']);

}(Prism));

(function (Prism) {

    var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    var selectorInside;

    Prism.languages.css.selector = {
        pattern: Prism.languages.css.selector.pattern,
        lookbehind: true,
        inside: selectorInside = {
            'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
            'pseudo-class': /:[-\w]+/,
            'class': /\.[-\w]+/,
            'id': /#[-\w]+/,
            'attribute': {
                pattern: RegExp('\\[(?:[^[\\]"\']|' + string.source + ')*\\]'),
                greedy: true,
                inside: {
                    'punctuation': /^\[|\]$/,
                    'case-sensitivity': {
                        pattern: /(\s)[si]$/i,
                        lookbehind: true,
                        alias: 'keyword'
                    },
                    'namespace': {
                        pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
                        lookbehind: true,
                        inside: {
                            'punctuation': /\|$/
                        }
                    },
                    'attr-name': {
                        pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
                        lookbehind: true
                    },
                    'attr-value': [
                        string,
                        {
                            pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
                            lookbehind: true
                        }
                    ],
                    'operator': /[|~*^$]?=/
                }
            },
            'n-th': [
                {
                    pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
                    lookbehind: true,
                    inside: {
                        'number': /[\dn]+/,
                        'operator': /[+-]/
                    }
                },
                {
                    pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
                    lookbehind: true
                }
            ],
            'combinator': />|\+|~|\|\|/,

            // the `tag` token has been existed and removed.
            // because we can't find a perfect tokenize to match it.
            // if you want to add it, please read https://github.com/PrismJS/prism/pull/2373 first.

            'punctuation': /[(),]/,
        }
    };

    Prism.languages.css['atrule'].inside['selector-function-argument'].inside = selectorInside;

    Prism.languages.insertBefore('css', 'property', {
        'variable': {
            pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
            lookbehind: true
        }
    });

    var unit = {
        pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
        lookbehind: true
    };
    // 123 -123 .123 -.123 12.3 -12.3
    var number = {
        pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
        lookbehind: true
    };

    Prism.languages.insertBefore('css', 'function', {
        'operator': {
            pattern: /(\s)[+\-*\/](?=\s)/,
            lookbehind: true
        },
        // CAREFUL!
        // Previewers and Inline color use hexcode and color.
        'hexcode': {
            pattern: /\B#[\da-f]{3,8}\b/i,
            alias: 'color'
        },
        'color': [
            {
                pattern: /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|RebeccaPurple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
                lookbehind: true
            },
            {
                pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
                inside: {
                    'unit': unit,
                    'number': number,
                    'function': /[\w-]+(?=\()/,
                    'punctuation': /[(),]/
                }
            }
        ],
        // it's important that there is no boundary assertion after the hex digits
        'entity': /\\[\da-f]{1,8}/i,
        'unit': unit,
        'number': number
    });

}(Prism));

Prism.languages.glsl = Prism.languages.extend('c', {
    'keyword': /\b(?:active|asm|atomic_uint|attribute|[ibdu]?vec[234]|bool|break|buffer|case|cast|centroid|class|coherent|common|const|continue|d?mat[234](?:x[234])?|default|discard|do|double|else|enum|extern|external|false|filter|fixed|flat|float|for|fvec[234]|goto|half|highp|hvec[234]|[iu]?sampler2DMS(?:Array)?|[iu]?sampler2DRect|[iu]?samplerBuffer|[iu]?samplerCube|[iu]?samplerCubeArray|[iu]?sampler[123]D|[iu]?sampler[12]DArray|[iu]?image2DMS(?:Array)?|[iu]?image2DRect|[iu]?imageBuffer|[iu]?imageCube|[iu]?imageCubeArray|[iu]?image[123]D|[iu]?image[12]DArray|if|in|inline|inout|input|int|interface|invariant|layout|long|lowp|mediump|namespace|noinline|noperspective|out|output|partition|patch|precise|precision|public|readonly|resource|restrict|return|sample|sampler[12]DArrayShadow|sampler[12]DShadow|sampler2DRectShadow|sampler3DRect|samplerCubeArrayShadow|samplerCubeShadow|shared|short|sizeof|smooth|static|struct|subroutine|superp|switch|template|this|true|typedef|uint|uniform|union|unsigned|using|varying|void|volatile|while|writeonly)\b/
});

Prism.languages.ini = {

    /**
     * The component mimics the behavior of the Win32 API parser.
     *
     * @see {@link https://github.com/PrismJS/prism/issues/2775#issuecomment-787477723}
     */

    'comment': {
        pattern: /(^[ \f\t\v]*)[#;][^\n\r]*/m,
        lookbehind: true
    },
    'section': {
        pattern: /(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,
        lookbehind: true,
        inside: {
            'section-name': {
                pattern: /(^\[[ \f\t\v]*)[^ \f\t\v\]]+(?:[ \f\t\v]+[^ \f\t\v\]]+)*/,
                lookbehind: true,
                alias: 'selector'
            },
            'punctuation': /\[|\]/
        }
    },
    'key': {
        pattern: /(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,
        lookbehind: true,
        alias: 'attr-name'
    },
    'value': {
        pattern: /(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,
        lookbehind: true,
        alias: 'attr-value',
        inside: {
            'inner-value': {
                pattern: /^("|').+(?=\1$)/,
                lookbehind: true
            }
        }
    },
    'punctuation': /=/
};

// https://www.json.org/json-en.html
Prism.languages.json = {
    'property': {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        lookbehind: true,
        greedy: true
    },
    'string': {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        lookbehind: true,
        greedy: true
    },
    'comment': {
        pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: true
    },
    'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    'punctuation': /[{}[\],]/,
    'operator': /:/,
    'boolean': /\b(?:false|true)\b/,
    'null': {
        pattern: /\bnull\b/,
        alias: 'keyword'
    }
};

Prism.languages.webmanifest = Prism.languages.json;

(function (Prism) {

    /**
     * Returns the placeholder for the given language id and index.
     *
     * @param {string} language
     * @param {string|number} index
     * @returns {string}
     */
    function getPlaceholder(language, index) {
        return '___' + language.toUpperCase() + index + '___';
    }

    Object.defineProperties(Prism.languages['markup-templating'] = {}, {
        buildPlaceholders: {
            /**
             * Tokenize all inline templating expressions matching `placeholderPattern`.
             *
             * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
             * `true` will be replaced.
             *
             * @param {object} env The environment of the `before-tokenize` hook.
             * @param {string} language The language id.
             * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
             * @param {(match: string) => boolean} [replaceFilter]
             */
            value: function (env, language, placeholderPattern, replaceFilter) {
                if (env.language !== language) {
                    return;
                }

                var tokenStack = env.tokenStack = [];

                env.code = env.code.replace(placeholderPattern, function (match) {
                    if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
                        return match;
                    }
                    var i = tokenStack.length;
                    var placeholder;

                    // Check for existing strings
                    while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1) {
                        ++i;
                    }

                    // Create a sparse array
                    tokenStack[i] = match;

                    return placeholder;
                });

                // Switch the grammar to markup
                env.grammar = Prism.languages.markup;
            }
        },
        tokenizePlaceholders: {
            /**
             * Replace placeholders with proper tokens after tokenizing.
             *
             * @param {object} env The environment of the `after-tokenize` hook.
             * @param {string} language The language id.
             */
            value: function (env, language) {
                if (env.language !== language || !env.tokenStack) {
                    return;
                }

                // Switch the grammar back
                env.grammar = Prism.languages[language];

                var j = 0;
                var keys = Object.keys(env.tokenStack);

                function walkTokens(tokens) {
                    for (var i = 0; i < tokens.length; i++) {
                        // all placeholders are replaced already
                        if (j >= keys.length) {
                            break;
                        }

                        var token = tokens[i];
                        if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
                            var k = keys[j];
                            var t = env.tokenStack[k];
                            var s = typeof token === 'string' ? token : token.content;
                            var placeholder = getPlaceholder(language, k);

                            var index = s.indexOf(placeholder);
                            if (index > -1) {
                                ++j;

                                var before = s.substring(0, index);
                                var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar), 'language-' + language, t);
                                var after = s.substring(index + placeholder.length);

                                var replacement = [];
                                if (before) {
                                    replacement.push.apply(replacement, walkTokens([before]));
                                }
                                replacement.push(middle);
                                if (after) {
                                    replacement.push.apply(replacement, walkTokens([after]));
                                }

                                if (typeof token === 'string') {
                                    tokens.splice.apply(tokens, [i, 1].concat(replacement));
                                } else {
                                    token.content = replacement;
                                }
                            }
                        } else if (token.content /* && typeof token.content !== 'string' */) {
                            walkTokens(token.content);
                        }
                    }

                    return tokens;
                }

                walkTokens(env.tokens);
            }
        }
    });

}(Prism));

/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 * Rewritten by Tom Pavelec
 *
 * Supports PHP 5.3 - 8.0
 */
(function (Prism) {
    var comment = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/;
    var constant = [
        {
            pattern: /\b(?:false|true)\b/i,
            alias: 'boolean'
        },
        {
            pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
            greedy: true,
            lookbehind: true,
        },
        {
            pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
            greedy: true,
            lookbehind: true,
        },
        /\b(?:null)\b/i,
        /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
    ];
    var number = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i;
    var operator = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/;
    var punctuation = /[{}\[\](),:;]/;

    Prism.languages.php = {
        'delimiter': {
            pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
            alias: 'important'
        },
        'comment': comment,
        'variable': /\$+(?:\w+\b|(?=\{))/,
        'package': {
            pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
            lookbehind: true,
            inside: {
                'punctuation': /\\/
            }
        },
        'class-name-definition': {
            pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
            lookbehind: true,
            alias: 'class-name'
        },
        'function-definition': {
            pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
            lookbehind: true,
            alias: 'function'
        },
        'keyword': [
            {
                pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
                alias: 'type-casting',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
                alias: 'type-hint',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
                alias: 'return-type',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
                alias: 'type-declaration',
                greedy: true
            },
            {
                pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
                alias: 'type-declaration',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /\b(?:parent|self|static)(?=\s*::)/i,
                alias: 'static-context',
                greedy: true
            },
            {
                // yield from
                pattern: /(\byield\s+)from\b/i,
                lookbehind: true
            },
            // `class` is always a keyword unlike other keywords
            /\bclass\b/i,
            {
                // https://www.php.net/manual/en/reserved.keywords.php
                //
                // keywords cannot be preceded by "->"
                // the complex lookbehind means `(?<!(?:->|::)\s*)`
                pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
                lookbehind: true
            }
        ],
        'argument-name': {
            pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
            lookbehind: true
        },
        'class-name': [
            {
                pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
                greedy: true
            },
            {
                pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
                alias: 'class-name-fully-qualified',
                greedy: true,
                lookbehind: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
                alias: 'class-name-fully-qualified',
                greedy: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
                alias: 'class-name-fully-qualified',
                greedy: true,
                lookbehind: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /\b[a-z_]\w*(?=\s*\$)/i,
                alias: 'type-declaration',
                greedy: true
            },
            {
                pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
                alias: ['class-name-fully-qualified', 'type-declaration'],
                greedy: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /\b[a-z_]\w*(?=\s*::)/i,
                alias: 'static-context',
                greedy: true
            },
            {
                pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
                alias: ['class-name-fully-qualified', 'static-context'],
                greedy: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
                alias: 'type-hint',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
                alias: ['class-name-fully-qualified', 'type-hint'],
                greedy: true,
                lookbehind: true,
                inside: {
                    'punctuation': /\\/
                }
            },
            {
                pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
                alias: 'return-type',
                greedy: true,
                lookbehind: true
            },
            {
                pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
                alias: ['class-name-fully-qualified', 'return-type'],
                greedy: true,
                lookbehind: true,
                inside: {
                    'punctuation': /\\/
                }
            }
        ],
        'constant': constant,
        'function': {
            pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
            lookbehind: true,
            inside: {
                'punctuation': /\\/
            }
        },
        'property': {
            pattern: /(->\s*)\w+/,
            lookbehind: true
        },
        'number': number,
        'operator': operator,
        'punctuation': punctuation
    };

    var string_interpolation = {
        pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
        lookbehind: true,
        inside: Prism.languages.php
    };

    var string = [
        {
            pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
            alias: 'nowdoc-string',
            greedy: true,
            inside: {
                'delimiter': {
                    pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                    alias: 'symbol',
                    inside: {
                        'punctuation': /^<<<'?|[';]$/
                    }
                }
            }
        },
        {
            pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
            alias: 'heredoc-string',
            greedy: true,
            inside: {
                'delimiter': {
                    pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                    alias: 'symbol',
                    inside: {
                        'punctuation': /^<<<"?|[";]$/
                    }
                },
                'interpolation': string_interpolation
            }
        },
        {
            pattern: /`(?:\\[\s\S]|[^\\`])*`/,
            alias: 'backtick-quoted-string',
            greedy: true
        },
        {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            alias: 'single-quoted-string',
            greedy: true
        },
        {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            alias: 'double-quoted-string',
            greedy: true,
            inside: {
                'interpolation': string_interpolation
            }
        }
    ];

    Prism.languages.insertBefore('php', 'variable', {
        'string': string,
        'attribute': {
            pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
            greedy: true,
            inside: {
                'attribute-content': {
                    pattern: /^(#\[)[\s\S]+(?=\]$)/,
                    lookbehind: true,
                    // inside can appear subset of php
                    inside: {
                        'comment': comment,
                        'string': string,
                        'attribute-class-name': [
                            {
                                pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                                alias: 'class-name',
                                greedy: true,
                                lookbehind: true
                            },
                            {
                                pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                                alias: [
                                    'class-name',
                                    'class-name-fully-qualified'
                                ],
                                greedy: true,
                                lookbehind: true,
                                inside: {
                                    'punctuation': /\\/
                                }
                            }
                        ],
                        'constant': constant,
                        'number': number,
                        'operator': operator,
                        'punctuation': punctuation
                    }
                },
                'delimiter': {
                    pattern: /^#\[|\]$/,
                    alias: 'punctuation'
                }
            }
        },
    });

    Prism.hooks.add('before-tokenize', function (env) {
        if (!/<\?/.test(env.code)) {
            return;
        }

        var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
        Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
    });

    Prism.hooks.add('after-tokenize', function (env) {
        Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
    });

}(Prism));

Prism.languages.python = {
    'comment': {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
        greedy: true
    },
    'string-interpolation': {
        pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: true,
        inside: {
            'interpolation': {
                // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
                pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
                lookbehind: true,
                inside: {
                    'format-spec': {
                        pattern: /(:)[^:(){}]+(?=\}$)/,
                        lookbehind: true
                    },
                    'conversion-option': {
                        pattern: /![sra](?=[:}]$)/,
                        alias: 'punctuation'
                    },
                    rest: null
                }
            },
            'string': /[\s\S]+/
        }
    },
    'triple-quoted-string': {
        pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
        greedy: true,
        alias: 'string'
    },
    'string': {
        pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: true
    },
    'function': {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: true
    },
    'class-name': {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: true
    },
    'decorator': {
        pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
        lookbehind: true,
        alias: ['annotation', 'punctuation'],
        inside: {
            'punctuation': /\./
        }
    },
    'keyword': /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    'boolean': /\b(?:False|None|True)\b/,
    'number': /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    'operator': /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    'punctuation': /[{}[\];(),.:]/
};

Prism.languages.python['string-interpolation'].inside['interpolation'].inside.rest = Prism.languages.python;

Prism.languages.py = Prism.languages.python;

(function () {

    if (typeof Prism === 'undefined') {
        return;
    }

    var url = /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&!$'()*,;@]+(?:\?[\w\-+%~/.:=?&!$'()*,;@]*)?(?:#[\w\-+%~/.:#=?&!$'()*,;@]*)?/;
    var email = /\b\S+@[\w.]+[a-z]{2}/;
    var linkMd = /\[([^\]]+)\]\(([^)]+)\)/;

    // Tokens that may contain URLs and emails
    var candidates = ['comment', 'url', 'attr-value', 'string'];

    Prism.plugins.autolinker = {
        processGrammar: function (grammar) {
            // Abort if grammar has already been processed
            if (!grammar || grammar['url-link']) {
                return;
            }
            Prism.languages.DFS(grammar, function (key, def, type) {
                if (candidates.indexOf(type) > -1 && !Array.isArray(def)) {
                    if (!def.pattern) {
                        def = this[key] = {
                            pattern: def
                        };
                    }

                    def.inside = def.inside || {};

                    if (type == 'comment') {
                        def.inside['md-link'] = linkMd;
                    }
                    if (type == 'attr-value') {
                        Prism.languages.insertBefore('inside', 'punctuation', { 'url-link': url }, def);
                    } else {
                        def.inside['url-link'] = url;
                    }

                    def.inside['email-link'] = email;
                }
            });
            grammar['url-link'] = url;
            grammar['email-link'] = email;
        }
    };

    Prism.hooks.add('before-highlight', function (env) {
        Prism.plugins.autolinker.processGrammar(env.grammar);
    });

    Prism.hooks.add('wrap', function (env) {
        if (/-link$/.test(env.type)) {
            env.tag = 'a';

            var href = env.content;

            if (env.type == 'email-link' && href.indexOf('mailto:') != 0) {
                href = 'mailto:' + href;
            } else if (env.type == 'md-link') {
                // Markdown
                var match = env.content.match(linkMd);

                href = match[2];
                env.content = match[1];
            }

            env.attributes.href = href;

            // Silently catch any error thrown by decodeURIComponent (#1186)
            try {
                env.content = decodeURIComponent(env.content);
            } catch (e) { /* noop */ }
        }
    });

}());

(function () {

    if (typeof Prism === 'undefined' || typeof document === 'undefined') {
        return;
    }

    // Copied from the markup language definition
    var HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g;

    // a regex to validate hexadecimal colors
    var HEX_COLOR = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i;

    /**
     * Parses the given hexadecimal representation and returns the parsed RGBA color.
     *
     * If the format of the given string is invalid, `undefined` will be returned.
     * Valid formats are: `RGB`, `RGBA`, `RRGGBB`, and `RRGGBBAA`.
     *
     * Hexadecimal colors are parsed because they are not fully supported by older browsers, so converting them to
     * `rgba` functions improves browser compatibility.
     *
     * @param {string} hex
     * @returns {string | undefined}
     */
    function parseHexColor(hex) {
        var match = HEX_COLOR.exec(hex);
        if (!match) {
            return undefined;
        }
        hex = match[1]; // removes the leading "#"

        // the width and number of channels
        var channelWidth = hex.length >= 6 ? 2 : 1;
        var channelCount = hex.length / channelWidth;

        // the scale used to normalize 4bit and 8bit values
        var scale = channelWidth == 1 ? 1 / 15 : 1 / 255;

        // normalized RGBA channels
        var channels = [];
        for (var i = 0; i < channelCount; i++) {
            var int = parseInt(hex.substr(i * channelWidth, channelWidth), 16);
            channels.push(int * scale);
        }
        if (channelCount == 3) {
            channels.push(1); // add alpha of 100%
        }

        // output
        var rgb = channels.slice(0, 3).map(function (x) {
            return String(Math.round(x * 255));
        }).join(',');
        var alpha = String(Number(channels[3].toFixed(3))); // easy way to round 3 decimal places

        return 'rgba(' + rgb + ',' + alpha + ')';
    }

    /**
     * Validates the given Color using the current browser's internal implementation.
     *
     * @param {string} color
     * @returns {string | undefined}
     */
    function validateColor(color) {
        var s = new Option().style;
        s.color = color;
        return s.color ? color : undefined;
    }

    /**
     * An array of function which parse a given string representation of a color.
     *
     * These parser serve as validators and as a layer of compatibility to support color formats which the browser
     * might not support natively.
     *
     * @type {((value: string) => (string|undefined))[]}
     */
    var parsers = [
        parseHexColor,
        validateColor
    ];


    Prism.hooks.add('wrap', function (env) {
        if (env.type === 'color' || env.classes.indexOf('color') >= 0) {
            var content = env.content;

            // remove all HTML tags inside
            var rawText = content.split(HTML_TAG).join('');

            var color;
            for (var i = 0, l = parsers.length; i < l && !color; i++) {
                color = parsers[i](rawText);
            }

            if (!color) {
                return;
            }

            var previewElement = '<span class="inline-color-wrapper"><span class="inline-color" style="background-color:' + color + ';"></span></span>';
            env.content = previewElement + content;
        }
    });

}());

(function () {

    if (typeof Prism === 'undefined' || typeof document === 'undefined') {
        return;
    }

    /* eslint-disable */

    /**
     * The dependencies map is built automatically with gulp.
     *
     * @type {Object<string, string | string[]>}
     */
    var lang_dependencies = /*dependencies_placeholder[*/{
        "javascript": "clike",
        "actionscript": "javascript",
        "apex": [
            "clike",
            "sql"
        ],
        "arduino": "cpp",
        "aspnet": [
            "markup",
            "csharp"
        ],
        "birb": "clike",
        "bison": "c",
        "c": "clike",
        "csharp": "clike",
        "cpp": "c",
        "cfscript": "clike",
        "chaiscript": [
            "clike",
            "cpp"
        ],
        "cilkc": "c",
        "cilkcpp": "cpp",
        "coffeescript": "javascript",
        "crystal": "ruby",
        "css-extras": "css",
        "d": "clike",
        "dart": "clike",
        "django": "markup-templating",
        "ejs": [
            "javascript",
            "markup-templating"
        ],
        "etlua": [
            "lua",
            "markup-templating"
        ],
        "erb": [
            "ruby",
            "markup-templating"
        ],
        "fsharp": "clike",
        "firestore-security-rules": "clike",
        "flow": "javascript",
        "ftl": "markup-templating",
        "gml": "clike",
        "glsl": "c",
        "go": "clike",
        "gradle": "clike",
        "groovy": "clike",
        "haml": "ruby",
        "handlebars": "markup-templating",
        "haxe": "clike",
        "hlsl": "c",
        "idris": "haskell",
        "java": "clike",
        "javadoc": [
            "markup",
            "java",
            "javadoclike"
        ],
        "jolie": "clike",
        "jsdoc": [
            "javascript",
            "javadoclike",
            "typescript"
        ],
        "js-extras": "javascript",
        "json5": "json",
        "jsonp": "json",
        "js-templates": "javascript",
        "kotlin": "clike",
        "latte": [
            "clike",
            "markup-templating",
            "php"
        ],
        "less": "css",
        "lilypond": "scheme",
        "liquid": "markup-templating",
        "markdown": "markup",
        "markup-templating": "markup",
        "mongodb": "javascript",
        "n4js": "javascript",
        "objectivec": "c",
        "opencl": "c",
        "parser": "markup",
        "php": "markup-templating",
        "phpdoc": [
            "php",
            "javadoclike"
        ],
        "php-extras": "php",
        "plsql": "sql",
        "processing": "clike",
        "protobuf": "clike",
        "pug": [
            "markup",
            "javascript"
        ],
        "purebasic": "clike",
        "purescript": "haskell",
        "qsharp": "clike",
        "qml": "javascript",
        "qore": "clike",
        "racket": "scheme",
        "cshtml": [
            "markup",
            "csharp"
        ],
        "jsx": [
            "markup",
            "javascript"
        ],
        "tsx": [
            "jsx",
            "typescript"
        ],
        "reason": "clike",
        "ruby": "clike",
        "sass": "css",
        "scss": "css",
        "scala": "java",
        "shell-session": "bash",
        "smarty": "markup-templating",
        "solidity": "clike",
        "soy": "markup-templating",
        "sparql": "turtle",
        "sqf": "clike",
        "squirrel": "clike",
        "stata": [
            "mata",
            "java",
            "python"
        ],
        "t4-cs": [
            "t4-templating",
            "csharp"
        ],
        "t4-vb": [
            "t4-templating",
            "vbnet"
        ],
        "tap": "yaml",
        "tt2": [
            "clike",
            "markup-templating"
        ],
        "textile": "markup",
        "twig": "markup-templating",
        "typescript": "javascript",
        "v": "clike",
        "vala": "clike",
        "vbnet": "basic",
        "velocity": "markup",
        "wiki": "markup",
        "xeora": "markup",
        "xml-doc": "markup",
        "xquery": "markup"
    }/*]*/;

    var lang_aliases = /*aliases_placeholder[*/{
        "html": "markup",
        "xml": "markup",
        "svg": "markup",
        "mathml": "markup",
        "ssml": "markup",
        "atom": "markup",
        "rss": "markup",
        "js": "javascript",
        "g4": "antlr4",
        "ino": "arduino",
        "arm-asm": "armasm",
        "art": "arturo",
        "adoc": "asciidoc",
        "avs": "avisynth",
        "avdl": "avro-idl",
        "gawk": "awk",
        "sh": "bash",
        "shell": "bash",
        "shortcode": "bbcode",
        "rbnf": "bnf",
        "oscript": "bsl",
        "cs": "csharp",
        "dotnet": "csharp",
        "cfc": "cfscript",
        "cilk-c": "cilkc",
        "cilk-cpp": "cilkcpp",
        "cilk": "cilkcpp",
        "coffee": "coffeescript",
        "conc": "concurnas",
        "jinja2": "django",
        "dns-zone": "dns-zone-file",
        "dockerfile": "docker",
        "gv": "dot",
        "eta": "ejs",
        "xlsx": "excel-formula",
        "xls": "excel-formula",
        "gamemakerlanguage": "gml",
        "po": "gettext",
        "gni": "gn",
        "ld": "linker-script",
        "go-mod": "go-module",
        "hbs": "handlebars",
        "mustache": "handlebars",
        "hs": "haskell",
        "idr": "idris",
        "gitignore": "ignore",
        "hgignore": "ignore",
        "npmignore": "ignore",
        "webmanifest": "json",
        "kt": "kotlin",
        "kts": "kotlin",
        "kum": "kumir",
        "tex": "latex",
        "context": "latex",
        "ly": "lilypond",
        "emacs": "lisp",
        "elisp": "lisp",
        "emacs-lisp": "lisp",
        "md": "markdown",
        "moon": "moonscript",
        "n4jsd": "n4js",
        "nani": "naniscript",
        "objc": "objectivec",
        "qasm": "openqasm",
        "objectpascal": "pascal",
        "px": "pcaxis",
        "pcode": "peoplecode",
        "plantuml": "plant-uml",
        "pq": "powerquery",
        "mscript": "powerquery",
        "pbfasm": "purebasic",
        "purs": "purescript",
        "py": "python",
        "qs": "qsharp",
        "rkt": "racket",
        "razor": "cshtml",
        "rpy": "renpy",
        "res": "rescript",
        "robot": "robotframework",
        "rb": "ruby",
        "sh-session": "shell-session",
        "shellsession": "shell-session",
        "smlnj": "sml",
        "sol": "solidity",
        "sln": "solution-file",
        "rq": "sparql",
        "sclang": "supercollider",
        "t4": "t4-cs",
        "trickle": "tremor",
        "troy": "tremor",
        "trig": "turtle",
        "ts": "typescript",
        "tsconfig": "typoscript",
        "uscript": "unrealscript",
        "uc": "unrealscript",
        "url": "uri",
        "vb": "visual-basic",
        "vba": "visual-basic",
        "webidl": "web-idl",
        "mathematica": "wolfram",
        "nb": "wolfram",
        "wl": "wolfram",
        "xeoracube": "xeora",
        "yml": "yaml"
    }/*]*/;

    /* eslint-enable */

    /**
     * @typedef LangDataItem
     * @property {{ success?: () => void, error?: () => void }[]} callbacks
     * @property {boolean} [error]
     * @property {boolean} [loading]
     */
    /** @type {Object<string, LangDataItem>} */
    var lang_data = {};

    var ignored_language = 'none';
    var languages_path = 'components/';

    var script = Prism.util.currentScript();
    if (script) {
        var autoloaderFile = /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;
        var prismFile = /(^|\/)[\w-]+\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;

        var autoloaderPath = script.getAttribute('data-autoloader-path');
        if (autoloaderPath != null) {
            // data-autoloader-path is set, so just use it
            languages_path = autoloaderPath.trim().replace(/\/?$/, '/');
        } else {
            var src = script.src;
            if (autoloaderFile.test(src)) {
                // the script is the original autoloader script in the usual Prism project structure
                languages_path = src.replace(autoloaderFile, 'components/');
            } else if (prismFile.test(src)) {
                // the script is part of a bundle like a custom prism.js from the download page
                languages_path = src.replace(prismFile, '$1components/');
            }
        }
    }

    var config = Prism.plugins.autoloader = {
        languages_path: languages_path,
        use_minified: true,
        loadLanguages: loadLanguages
    };


    /**
     * Lazily loads an external script.
     *
     * @param {string} src
     * @param {() => void} [success]
     * @param {() => void} [error]
     */
    function addScript(src, success, error) {
        var s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = function () {
            document.body.removeChild(s);
            success && success();
        };
        s.onerror = function () {
            document.body.removeChild(s);
            error && error();
        };
        document.body.appendChild(s);
    }

    /**
     * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
     *
     * @param {Element} element
     * @returns {string[]}
     */
    function getDependencies(element) {
        var deps = (element.getAttribute('data-dependencies') || '').trim();
        if (!deps) {
            var parent = element.parentElement;
            if (parent && parent.tagName.toLowerCase() === 'pre') {
                deps = (parent.getAttribute('data-dependencies') || '').trim();
            }
        }
        return deps ? deps.split(/\s*,\s*/g) : [];
    }

    /**
     * Returns whether the given language is currently loaded.
     *
     * @param {string} lang
     * @returns {boolean}
     */
    function isLoaded(lang) {
        if (lang.indexOf('!') >= 0) {
            // forced reload
            return false;
        }

        lang = lang_aliases[lang] || lang; // resolve alias

        if (lang in Prism.languages) {
            // the given language is already loaded
            return true;
        }

        // this will catch extensions like CSS extras that don't add a grammar to Prism.languages
        var data = lang_data[lang];
        return data && !data.error && data.loading === false;
    }

    /**
     * Returns the path to a grammar, using the language_path and use_minified config keys.
     *
     * @param {string} lang
     * @returns {string}
     */
    function getLanguagePath(lang) {
        return config.languages_path + 'prism-' + lang + (config.use_minified ? '.min' : '') + '.js';
    }

    /**
     * Loads all given grammars concurrently.
     *
     * @param {string[]|string} languages
     * @param {(languages: string[]) => void} [success]
     * @param {(language: string) => void} [error] This callback will be invoked on the first language to fail.
     */
    function loadLanguages(languages, success, error) {
        if (typeof languages === 'string') {
            languages = [languages];
        }

        var total = languages.length;
        var completed = 0;
        var failed = false;

        if (total === 0) {
            if (success) {
                setTimeout(success, 0);
            }
            return;
        }

        function successCallback() {
            if (failed) {
                return;
            }
            completed++;
            if (completed === total) {
                success && success(languages);
            }
        }

        languages.forEach(function (lang) {
            loadLanguage(lang, successCallback, function () {
                if (failed) {
                    return;
                }
                failed = true;
                error && error(lang);
            });
        });
    }

    /**
     * Loads a grammar with its dependencies.
     *
     * @param {string} lang
     * @param {() => void} [success]
     * @param {() => void} [error]
     */
    function loadLanguage(lang, success, error) {
        var force = lang.indexOf('!') >= 0;

        lang = lang.replace('!', '');
        lang = lang_aliases[lang] || lang;

        function load() {
            var data = lang_data[lang];
            if (!data) {
                data = lang_data[lang] = {
                    callbacks: []
                };
            }
            data.callbacks.push({
                success: success,
                error: error
            });

            if (!force && isLoaded(lang)) {
                // the language is already loaded and we aren't forced to reload
                languageCallback(lang, 'success');
            } else if (!force && data.error) {
                // the language failed to load before and we don't reload
                languageCallback(lang, 'error');
            } else if (force || !data.loading) {
                // the language isn't currently loading and/or we are forced to reload
                data.loading = true;
                data.error = false;

                addScript(getLanguagePath(lang), function () {
                    data.loading = false;
                    languageCallback(lang, 'success');

                }, function () {
                    data.loading = false;
                    data.error = true;
                    languageCallback(lang, 'error');
                });
            }
        }

        var dependencies = lang_dependencies[lang];
        if (dependencies && dependencies.length) {
            loadLanguages(dependencies, load, error);
        } else {
            load();
        }
    }

    /**
     * Runs all callbacks of the given type for the given language.
     *
     * @param {string} lang
     * @param {"success" | "error"} type
     */
    function languageCallback(lang, type) {
        if (lang_data[lang]) {
            var callbacks = lang_data[lang].callbacks;
            for (var i = 0, l = callbacks.length; i < l; i++) {
                var callback = callbacks[i][type];
                if (callback) {
                    setTimeout(callback, 0);
                }
            }
            callbacks.length = 0;
        }
    }

    Prism.hooks.add('complete', function (env) {
        var element = env.element;
        var language = env.language;
        if (!element || !language || language === ignored_language) {
            return;
        }

        var deps = getDependencies(element);
        if (/^diff-./i.test(language)) {
            // the "diff-xxxx" format is used by the Diff Highlight plugin
            deps.push('diff');
            deps.push(language.substr('diff-'.length));
        } else {
            deps.push(language);
        }

        if (!deps.every(isLoaded)) {
            // the language or some dependencies aren't loaded
            loadLanguages(deps, function () {
                Prism.highlightElement(element);
            });
        }
    });

}());
return Prism;
})();

  // ===================== icons (data URIs) =====================
var witcat_markdown_icon = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj48ZGVmcz48Y2xpcFBhdGggaWQ9Im1hc3Rlcl9zdmcwXzEwXzEiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcng9IjAiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjbWFzdGVyX3N2ZzBfMTBfMSkiPjxnPjxnPjxwYXRoIGQ9Ik05LjI4Njk3LDIuMDAwMDA5MTU1MjdDOS42ODA5NywyLjAwMDAwOTE1NTI3LDEwLjAwNjIsMi4zMTIwMTIsOS45OTk5MSwyLjY5MDAwNkw5Ljk5OTkxLDcuMzFDOS45OTk5MSw3LjY4ODAxLDkuNjgwOTcsOCw5LjI4MDcyLDhMMC43MTkxOSw4QzAuMzI1MTk0LDgsMCw3LjY4OCwwLDcuMzA0TDAsMi42ODk5OTZDMCwyLjMxMTk5MywwLjMyNTIwMywyLDAuNzE5MTksMkw5LjI4Njk3LDIuMDAwMDA5MTU1MjdaTTUuNjI4NDYsNi44MDAwMUw1LjYyODQ2LDMuMjAwMDFMNC4zNzc2OSwzLjIwMDAxTDMuNDM5NjEsNC40MDAwMUwyLjUwMTUzLDMuMjAwMDFMMS4yNTA3NiwzLjIwMDAxTDEuMjUwNzYsNi44MDAwMUwyLjUwMTUzLDYuODAwMDFMMi41MDE1Myw1LjAwMDAxTDMuNDM5NjEsNi4xNTIwMUw0LjM3NzY5LDUuMDAwMDFMNC4zNzc2OSw2LjgwMDAxTDUuNjI4NDYsNi44MDAwMVpNNy40OTgzNyw3LjEwMDAxTDkuMDY4MDksNS4wMDAwMUw4LjEzMDAxLDUuMDAwMDFMOC4xMzAwMSwzLjIwMDAxTDYuODc5MjQsMy4yMDAwMUw2Ljg3OTI0LDUuMDAwMDFMNS45NDExNiw1LjAwMDAxTDcuNDk4MzcsNy4xMDAwMVoiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';
var witcat_markdown_picture = 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzNzIiIHZpZXdCb3g9IjAgMCA2MDAgMzcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGRlc2M+Q3JlYXRlZCB3aXRoIEZhYnJpYy5qcyAzLjYuNjwvZGVzYz4KPGRlZnM+CjwvZGVmcz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAxKSI+PC9yZWN0Pgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxNi4xMiAwIDAgMTYuMTIgMjk5Ljk4IDE4NS42OSkiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDAsMCwwKTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtOCwgLTgpIiBkPSJNIDE0Ljg1IDMgYyAwLjYzIDAgMS4xNSAwLjUyIDEuMTQgMS4xNSB2IDcuNyBjIDAgMC42MyAtMC41MSAxLjE1IC0xLjE1IDEuMTUgSCAxLjE1IEMgMC41MiAxMyAwIDEyLjQ4IDAgMTEuODQgViA0LjE1IEMgMCAzLjUyIDAuNTIgMyAxLjE1IDMgWiBNIDkgMTEgViA1IEggNyBMIDUuNSA3IEwgNCA1IEggMiB2IDYgaCAyIFYgOCBsIDEuNSAxLjkyIEwgNyA4IHYgMyBaIG0gMi45OSAwLjUgTCAxNC41IDggSCAxMyBWIDUgaCAtMiB2IDMgSCA5LjUgWiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgo8L2c+Cjwvc3ZnPg==';

  // ===================== markdown adapter =====================
  var markdownToHtml = markdownItExports.default;

  // ===================== 换行积木 (moreFieldsTextarea) =====================
/**
 * 换行积木 (moreFieldsTextarea)
 *
 * 提供 TextareaInput / TextareaInputInline 两种自定义字段类型，
 * 已合并进「白猫的markdown」扩展，不再单独注册为扩展。
 * 暴露 moreFieldsTextareaCustomFieldTypes 供 WitCatMarkDown.getInfo() 使用。
 */
var moreFieldsTextareaCustomFieldTypes = (function () {
  'use strict';

  if (!Scratch.extensions || !Scratch.extensions.unsandboxed) {
    throw new Error('"白猫的markdown"扩展的换行输入框必须在非沙盒模式下运行。');
  }

  const { ArgumentType, vm } = Scratch;
  const runtime = vm.runtime;
  const hasOwn = (o, p) => Object.prototype.hasOwnProperty.call(o, p);

  const customFieldTypes = {};
  let Blockly = null;

  const _LDC = function _LightenDarkenColor(col, amt) {
    const colStr = String(col);
    const num = parseInt(colStr.replace('#', ''), 16) || 0;
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const r = clamp((num >> 16) + amt);
    const g = clamp(((num >> 8) & 0x00FF) + amt);
    const b = clamp((num & 0x0000FF) + amt);
    const newColour = (r << 16) | (g << 8) | b;
    return (colStr.charAt(0) === '#' ? '#' : '') + newColour.toString(16).padStart(6, '0');
  };

  function _setCssNattr(node, attr, value) {
    node.setAttribute(attr, String(value));
    node.style[attr] = value;
  }

  function _fixColours(doText, col1, textColour) {
    const LDA = -10;
    const self = this.sourceBlock_;
    const parent = self?.parentBlock_;
    if (!parent) return;

    const path = self?.svgPath_;
    if (!path) return;
    const argumentSvg = path?.parentNode;
    const textNode = argumentSvg.querySelector('g.blocklyEditableText text');
    const oldFirstColour = parent.colour_;

    self.colour_ = (col1 ?? _LDC(parent.colour_, LDA));
    self.colourSecondary_ = _LDC(parent.colourSecondary_, LDA);
    self.colourTertiary_ = _LDC(parent.colourTertiary_, LDA);
    self.colourQuaternary_ = _LDC(parent?.colourQuaternary_ ?? oldFirstColour, LDA);

    _setCssNattr(path, 'fill', self.colour_);
    _setCssNattr(path, 'stroke', self.colourTertiary_);
    if (doText && textNode) _setCssNattr(textNode, 'fill', textColour ?? '#FFFFFF');
  }

  const _cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
  runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo, ...args) {
    const res = _cbfsb(blockInfo, categoryInfo, ...args);
    if (hasOwn(blockInfo, 'blockShape')) res.json.outputShape = blockInfo.blockShape;
    return res;
  };

  const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
  const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
  let fi = null;

  runtime._buildCustomFieldInfo = function (fieldName, fieldInfo, extensionId, categoryInfo, ...args) {
    fi = fieldInfo;
    return bcfi(fieldName, fieldInfo, extensionId, categoryInfo, ...args);
  };

  runtime._buildCustomFieldTypeForScratchBlocks = function (fieldName, output, outputShape, categoryInfo, ...args) {
    let res = bcftfsb(fieldName, output, outputShape, categoryInfo, ...args);
    if (fi) {
      if (fi.color1) res.json.colour = fi.color1;
      if (fi.color2) res.json.colourSecondary = fi.color2;
      if (fi.color3) res.json.colourTertiary = fi.color3;
      if (fi.color4) res.json.colourQuaternary = fi.color4;
      if (hasOwn(fi, 'output')) res.json.output = fi.output;
      fi = null;
    }
    return res;
  };

  const toRegisterOnBlocklyGot = [];



  ArgumentType.TEXTAREA = 'TextareaInput';
  ArgumentType.INLINETEXTAREA = 'TextareaInputInline';

  const implementations = {
    FieldTextarea: null,
    FieldInlineTextarea: null,
  };

  customFieldTypes[ArgumentType.TEXTAREA] = {
    output: ArgumentType.STRING,
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldTextarea()
    }
  };

  customFieldTypes[ArgumentType.INLINETEXTAREA] = {
    output: ArgumentType.STRING,
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineTextarea()
    }
  };

  function tryUseScratchBlocks(_sb) {
    Blockly = _sb;
    const BlockSvg = Blockly.BlockSvg;

    const _setAttribute = SVGTextElement.prototype.setAttribute;
    SVGTextElement.prototype.setAttribute = function (attr, val, ...args) {
      if (
        String(val) === 'NaN' &&
        (attr === 'x' || attr === 'y') &&
        this.getAttribute('class') === 'blocklyText'
      ) {
        const nattr = `MoreFieldsAttrErr${attr.toUpperCase()}`;
        _setAttribute.call(
          this,
          nattr,
          `尝试在此文本节点上进行非法设置。${attr.toUpperCase()}被设置为NaN。`
        );
        return _setAttribute.call(this, attr, '0', ...args);
      }
      return _setAttribute.call(this, attr, val, ...args);
    };

    const _endBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag;
    Blockly.BlockDragger.prototype.endBlockDrag = function (...a) {
      const res = _endBlockDrag.apply(this, a);
      for (const childBlock of this.draggingBlock_.childBlocks_) {
        const inputList = childBlock.inputList;
        if (
          inputList.length === 1 &&
          inputList[0].fieldRow.length === 1 &&
          !!inputList[0].fieldRow[0]?.inlineDblRender
        ) {
          childBlock.render();
        }
      }
      return res;
    };

    while (toRegisterOnBlocklyGot.length > 0) {
      const [name, impl] = toRegisterOnBlocklyGot.shift();
      Blockly.Field.register(name, impl);
    }

    const eventsOriginallyEnabled = Blockly.Events.isEnabled();
    const workspace = Blockly.getMainWorkspace();

    Blockly.Events.disable();

    if (workspace) {
      if (vm.editingTarget) vm.emitWorkspaceUpdate();

      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(
          Blockly.Xml.workspaceToDom(flyoutWorkspace),
          flyoutWorkspace
        );
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }

    if (eventsOriginallyEnabled) Blockly.Events.enable();
  }

  if (typeof Scratch?.gui === 'object') {
    Scratch.gui.getBlockly().then((Blockly) => tryUseScratchBlocks(Blockly));
  }

  return customFieldTypes;
})();

  // ===================== extension =====================

const witcat_markdown_extensionId = 'WitCatMarkDownsyuan';//这里可以修改扩展ID
let markdownmousedown = {};
let touchEvent = {};
/**
 * 获取到的返回值
 */

/** @typedef {string|number|boolean} SCarg 来自Scratch圆形框的参数，虽然这个框可能只能输入数字，但是可以放入变量，因此有可能获得数字、布尔和文本（极端情况下还有 null 或 undefined，需要同时处理 */

class WitCatMarkDown {
  constructor(runtime) {
    window.addEventListener('mousedown', (e) => {
      markdownmousedown = e;
    });

    window.addEventListener('mousemove', (e) => {
      touchEvent = e;
    });

    if (!Scratch.extensions.unsandboxed) {
      throw new Error('WitCatMarkDown must be run unsandboxed');
    }
    this.runtime = runtime || (Scratch.vm && Scratch.vm.runtime);
    const _locale = (typeof navigator !== 'undefined' && navigator.language) || 'en';
    this._lang = String(_locale).toLowerCase().indexOf('zh') === 0 ? 'zh-cn' : 'en';

    this.resize = null;
    /**
     * Scratch 所使用的 canvas，获取不到返回 null
     * @return {HTMLcanvasElement | null}
     */
    this.canvas = () => {
      try {
        const r = this.runtime.renderer;
        if (r && r.canvas instanceof HTMLCanvasElement) return r.canvas;
        if (r && r.gl && r.gl.canvas instanceof HTMLCanvasElement) return r.gl.canvas;
        const c = document.querySelector('canvas#scratch-stage, canvas.stage, .stage-wrapper canvas');
        if (c instanceof HTMLCanvasElement) return c;
      } catch (err) {
        console.error('[WitCatMarkDown] canvas() error', err);
      }
      return null;
    };

    /**
     * 所有输入框所在的父角色，目前设为 canvas 的父角色。
     * 获取不到返回 null
     * @return {HTMLElement | null}
     */
    this.inputParent = () => {
      const canvas = this.canvas();
      if (!canvas) return null;
      try {
        const cr = canvas.getBoundingClientRect();
        let el = canvas.parentElement;
        let best = el;
        while (el && el !== document.body) {
          const r = el.getBoundingClientRect();
          if (r.width > 1 && r.height > 1) {
            best = el;
            if (Math.abs(r.width - cr.width) < 4 &&
                Math.abs(r.height - cr.height) < 4) break;
          }
          el = el.parentElement;
        }
        if (best) {
          const cs = getComputedStyle(best);
          if (cs.position === 'static') best.style.position = 'relative';
        }
        return best;
      } catch (err) {
        console.error('[WitCatMarkDown] inputParent() error', err);
        return null;
      }
    };

    /**
     * 创建滚动条
     */
    document.documentElement.style.setProperty('--witcat-markdown-scale', '1');
    if (document.getElementById('WitCatMarkDownStyles') === null) {
    const ScrollStyle = document.createElement('style');
    ScrollStyle.id = 'WitCatMarkDownStyles';
    ScrollStyle.innerText = `
      .WitCatMarkDown h1{
          font-size:2.0em;
      }
      .WitCatMarkDown h3{
          font-size:1.17em;
      }
      .WitCatMarkDown h5{
          font-size:0.83em;
      }
      .WitCatMarkDown h6{
          font-size:0.67em;
      }
      .WitCatMarkDownOut::-webkit-scrollbar{
          display: none;
      }
      .WitCatMarkDown::-webkit-scrollbar{
          display: none;
      }
      .WitCatMarkDown{
          color:black;
      }
      .WitCatMarkDown br{
        display: block;
          height: 0px;
      }
      .WitCatMarkDown{
          transform-origin: 0 0;
          transform:var(--witcat-markdown-scale);
      }
      .WitCatMarkDown ul{
          padding-inline-start: 40px;
          list-style:none;
      }
      .WitCatMarkDown ol{
          padding-inline-start: 40px;
          list-style:auto;
      }
      .WitCatMarkDown blockquote{
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 40px;
          margin-inline-end: 40px;
      }
      .WitCatMarkDownpolier{
        display: inline-block;
        white-space: nowrap;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .WitCatMarkDownpolier button{
        background-color: #00000000;
        color: #1A96E2;
        position: absolute;
        right: 0px;
        bottom: 0px;
        border-radius: 0.5em;
      }
      .WitCatMarkDownHide{
        background-color: #252525;
        color: #252525;
        text-shadow: none;
        border-radius: 0.5em;
      }
      .WitCatMarkDownHide:hover{
        color: white !important;
      }
      .WitCatMarkDowng-container {
        width: 240px;
        height: 10px;
        border-radius: 0.5em;
        background: #eee;
      }
      .WitCatMarkDowng-progress {
        width: 50%;
        height: inherit;
        border-radius: 0.5em;
        background: #0f0;
      }
      .WitCatMarkDownTable{
        border: 1px solid black;
        border-collapse: separate;
      }
      .WitCatMarkDownTable td{
        border: 1px solid black;
        padding: 8px;
      }
      .WitCatMarkDown .footnotes{
        font-size: 0.85em;
        opacity: 0.9;
      }
      .WitCatMarkDown .footnotes-sep{
        border: none;
        border-top: 1px solid #aaa;
        margin: 1em 0 0.5em;
      }
      .WitCatMarkDown .footnotes-list{
        padding-inline-start: 1.4em;
        margin: 0;
      }
      .WitCatMarkDown .footnote-item{
        margin: 0.2em 0;
      }
      .WitCatMarkDown .footnote-ref,
      .WitCatMarkDown sup{
        font-size: 0.75em;
        vertical-align: super;
        line-height: 0;
      }
      .WitCatMarkDown .footnote-ref a,
      .WitCatMarkDown .footnote-backref,
      .WitCatMarkDown a.footnote-backref{
        text-decoration: none;
      }
      .WitCatMarkDown .footnote-backref{
        margin-left: 0.25em;
      }
      .WitCatMarkDown code[class*=language-],
.WitCatMarkDown pre[class*=language-] {
    color: #000;
    background: 0 0;
    text-shadow: none;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none
}

.WitCatMarkDown code[class*=language-] ::-moz-selection,
.WitCatMarkDown code[class*=language-]::-moz-selection,
.WitCatMarkDown pre[class*=language-] ::-moz-selection,
.WitCatMarkDown pre[class*=language-]::-moz-selection {
    text-shadow: none;
    background: #b3d4fc
}

.WitCatMarkDown code[class*=language-] ::selection,
.WitCatMarkDown code[class*=language-]::selection,
.WitCatMarkDown pre[class*=language-] ::selection,
.WitCatMarkDown pre[class*=language-]::selection {
    text-shadow: none;
    background: #b3d4fc
}

@media print {

    .WitCatMarkDown code[class*=language-],
    .WitCatMarkDown pre[class*=language-] {
        text-shadow: none
    }
}

.WitCatMarkDown pre[class*=language-] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto
}

.WitCatMarkDown :not(pre)>code[class*=language-],
.WitCatMarkDown pre[class*=language-] {
    background: #00000000
}

.WitCatMarkDown :not(pre)>code[class*=language-] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal
}

.WitCatMarkDown .token.cdata,
.WitCatMarkDown .token.comment,
.WitCatMarkDown .token.doctype,
.WitCatMarkDown .token.prolog {
    color: #708090
}

.WitCatMarkDown .token.punctuation {
    color: #999
}

.WitCatMarkDown .token.namespace {
    opacity: .7
}

.WitCatMarkDown .token.boolean,
.WitCatMarkDown .token.constant,
.WitCatMarkDown .token.deleted,
.WitCatMarkDown .token.number,
.WitCatMarkDown .token.property,
.WitCatMarkDown .token.symbol,
.WitCatMarkDown .token.tag {
    color: #905
}

.WitCatMarkDown .token.attr-name,
.WitCatMarkDown .token.builtin,
.WitCatMarkDown .token.char,
.WitCatMarkDown .token.inserted,
.WitCatMarkDown .token.selector,
.WitCatMarkDown .token.string {
    color: #690
}

.WitCatMarkDown .language-css .token.string,
.WitCatMarkDown .style .token.string,
.WitCatMarkDown .token.entity,
.WitCatMarkDown .token.operator,
.WitCatMarkDown .token.url {
    color: #9a6e3a;
    background: hsla(0, 0%, 100%, .5)
}

.WitCatMarkDown .token.atrule,
.WitCatMarkDown .token.attr-value,
.WitCatMarkDown .token.keyword {
    color: #07a
}

.WitCatMarkDown .token.class-name,
.WitCatMarkDown .token.function {
    color: #dd4a68
}

.WitCatMarkDown .token.important,
.WitCatMarkDown .token.regex,
.WitCatMarkDown .token.variable {
    color: #e90
}

.WitCatMarkDown .token.bold,
.WitCatMarkDown .token.important {
    font-weight: 700
}

.WitCatMarkDown .token.italic {
    font-style: italic
}

.WitCatMarkDown .token.entity {
    cursor: help
}

.WitCatMarkDown .token a {
    color: inherit
}

.WitCatMarkDown span.inline-color-wrapper {
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=);
    background-position: center;
    background-size: 110%;
    display: inline-block;
    height: 1.333ch;
    width: 1.333ch;
    margin: 0 .333ch;
    box-sizing: border-box;
    border: 1px solid #fff;
    outline: 1px solid rgba(0, 0, 0, .5);
    overflow: hidden
}

.WitCatMarkDown span.inline-color {
    display: block;
    height: 120%;
    width: 120%
}
      `;
    document.body.appendChild(ScrollStyle);
    }

    this._l10n = {
      'zh-cn': {
        'WitCatMarkDown.name': '白猫的markdown',
        'WitCatMarkDown.docs': '📖拓展教程',
        'WitCatMarkDown.docss': '📖示例内容',
        'WitCatMarkDown.tutorial':'# 欢迎使用 Markdown 拓展\r\n\r\n这是首次使用 **Markdown 拓展** 自动生成的内容，包含 Markdown 语法和拓展介绍\r\n\r\n## 文本样式\r\n\r\n加粗|**加粗1** __加粗2__  \r\n斜体|*斜体1* _斜体2_\r\n***\r\n若你在写常规文本时，需要换行，直接换行是无法成功换行的。\r\n就像这样  \r\n需要换行的话，需要在一行末尾加上两个空格  \r\n就像这样\r\n\r\n## 引用\r\n\r\n> 白猫的markdown拓展！！！\r\n\r\n## 链接\r\n\r\n*鼠标点击*打开链接\r\n\r\n[ccw 官网](https://www.ccw.site)\r\n\r\n## 图片\r\n\r\n如下：一个图片\r\n\r\n![展示](https://m.xiguacity.cn/avatar/6173f57f48cf8f4796fc860e/dbadfc1c-3ab5-49a2-aa69-01465f3f0738.jpg?x-oss-process=image%2Fresize%2Cs_150%2Fformat%2Cwebp)\r\n\r\n*图片可拖动为文件到任意窗口使用*\r\n\r\n## 无序列表\r\n\r\n- 项目\r\n  - 项目 1\r\n    - 项目 A\r\n    - 项目 B\r\n  - 项目 2\r\n\r\n## 有序列表\r\n\r\n1. 项目 1\r\n   1. 项目 A\r\n   2. 项目 B\r\n2. 项目 2\r\n\r\n## 任务列表\r\n\r\n- [x] A 计划\r\n  - [x] A1 计划\r\n  - [ ] A2 计划\r\n- [ ] B 计划\r\n\r\n## 代码块\r\n\r\n    print(\"wit_cat!!!\")\r\n    print(\"白猫！！！\")\r\n\r\n## 分割线\r\n***\r\n没错就是这个\r\n\r\n***',
        'WitCatMarkDown.create': '创建 markdown ID[id]X[x]Y[y]宽[width]高[height]内容[text]',
        'WitCatMarkDown.delete': '删除 markdown ID[id]',
        'WitCatMarkDown.deleteall': '删除所有 markdown ',
        'WitCatMarkDown.get': ' markdown ID[id]的[type]',
        'WitCatMarkDown.set': '设置 markdown ID[id]的[type]为[text]',
        "WitCatMarkDown.sets": "设置 markdown ID[id]第[num]个[type]的样式为[text]",
        'WitCatMarkDown.settextalign': '设置 markdown ID[id]第[num]个[type]为[text]',
        'WitCatMarkDown.imgstyle': ' markdown ID[id]的第[num]张图片的宽[width]高[height]',
        'WitCatMarkDown.loadfontfamily': '从[text]加载字体名[name]',
        'WitCatMarkDown.setfontfamily': '设置 markdown ID[id]的字体为[name]',
        'WitCatBBcodes.code': '设置 markdown ID[id]第[num]个代码框的高亮为[name]',
        'WitCatMarkDown.ide': '设置 markdown ID[id]为[name]',
        'WitCatMarkDown.size': 'markdown大小自适应[type]',
        'WitCatMarkDown.type.1': 'X',
        'WitCatMarkDown.type.2': 'Y',
        'WitCatMarkDown.type.3': '宽',
        'WitCatMarkDown.type.4': '高',
        'WitCatMarkDown.type.5': '内容',
        'WitCatMarkDown.type.6': 'json',
        'WitCatMarkDown.type.7': '透视',
        'WitCatMarkDown.type.8': '内容高度',
        'WitCatMarkDown.type.9': '纵向滚动位置',
        'WitCatMarkDown.type.10': '内容宽度',
        'WitCatMarkDown.type.11': '横向滚动位置',
        'WitCatMarkDown.ide.1': '可编辑',
        'WitCatMarkDown.ide.2': '不可编辑',
        'WitCatMarkDown.types.1': '启动',
        'WitCatMarkDown.types.2': '关闭',
        'WitCatMarkDown.getwidth': '获取内容[content]的渲染[type]',
        'WitCatMarkDown.click': '上次点击的元素的[clickmenu]',
        'WitCatMarkDown.touchs': '碰到的元素的[clickmenu]',
        'WitCatMarkDown.clickmenu.1': 'markdown来源',
        'WitCatMarkDown.clickmenu.2': '类型',
        'WitCatMarkDown.clickmenu.3': '序号',
        'WitCatMarkDown.touch': '碰到markdown[id]第[number]个[type]元素?',
        'WitCatMarkDown.move': 'markdown[id]第[number]个[type]元素偏移X[x]Y[y]',
        'WitCatMarkDown.scale': 'markdown[id]第[number]个[type]元素缩放X[x]Y[y]',
        'WitCatMarkDown.rot': 'markdown[id]第[number]个[type]元素旋转[y]',
        'WitCatMarkDown.3dmove': 'markdown[id]第[number]个[type]元素3D偏移X[x]Y[y]Z[z]',
        'WitCatMarkDown.3drot': 'markdown[id]第[number]个[type]元素3D旋转X[x]Y[y]Z[z]',
        'WitCatMarkDown.setinsite': 'markdown[id]第[number]个[type]元素的[input]设为[text]',
        'WitCatMarkDown.transition': '为markdown[id]设置过渡为[s]秒的[timing]',
        'WitCatMarkDown.timing.1': '线性',
        'WitCatMarkDown.timing.2': '缓出',
        'WitCatMarkDown.timing.3': '缓入',
        'WitCatMarkDown.timing.4': '缓出入',
        'WitCatMarkDown.timing.5': '缓动',
        'WitCatMarkDown.textalign.1': '左对齐',
        'WitCatMarkDown.textalign.2': '右对齐',
        'WitCatMarkDown.setinsite.1': '阴影',
        'WitCatMarkDown.setinsite.2': '文字阴影',
        "WitCatMarkDown.setstyle.1": "文本",
        "WitCatMarkDown.setstyle.2": "粗体",
        "WitCatMarkDown.setstyle.3": "斜体",
        "WitCatMarkDown.setstyle.4": "大号",
        "WitCatMarkDown.setstyle.5": "更大号",
        "WitCatMarkDown.setstyle.6": "超大号",
        "WitCatMarkDown.setstyle.7": "链接",
        "WitCatMarkDown.setstyle.8": "代码框",
      },
      en: {
        'WitCatMarkDown.name': 'WitCat’s markdown',
        'WitCatMarkDown.docs': '📖 Tutorial',
        'WitCatMarkDown.docss': '📖Example Content',
        'WitCatMarkDown.tutorial':
          '# Welcome to the Markdown extension\r\nThis is the first automatically generated content using **Markdown extensions **, including Markdown syntax and extensions\r\n## Text style\r\n\r\nbold | **bold1** __bold2__  \r\nitalics | *italics1*  _italics2_\r\n***\r\nIf you need to wrap a line when writing regular text, you won\'t be able to wrap a line directly.\r\nJust like this  \r\nTo wrap a line, add two Spaces at the end of the line  \r\nJust like this\r\n\r\n## Reference\r\n\r\n> wit_cat\`s Mark Down!!!\r\n\r\n## Link\r\n\r\n*Left mouse click* to open the link\r\n\r\n[Cocrea](https://cocrea.world)\r\n\r\n## Picture\r\n\r\nlook! This is a picture!\r\n\r\n![show] (https://m.xiguacity.cn/avatar/6173f57f48cf8f4796fc860e/dbadfc1c-3ab5-49a2-aa69-01465f3f0738.jpg?x-oss-process=image%2Fresize%2Cs_150%2Fformat%2Cwebp)\r\n\r\n*Image can be dragged for file to any window to use*\r\n\r\n## Unordered list\r\n\r\n- Item 1\r\n    - Item A\r\n    - Item B\r\n- Item 2\r\n\r\n## Ordered list\r\n\r\n1. Item 1\r\n    1. Item A\r\n    2. Item B\r\n2. Item 2\r\n\r\n## Task list\r\n\r\n- [x] Plan A\r\n    - [x] plan A1\r\n    - [ ] Plan A2\r\n- [ ] Plan B\r\n\r\n## Code block\r\n\r\n    print(\"wit_cat!!!\" )\r\n    print(\" White Cat!!\")\r\n\r\n## Divider\r\n***\r\nYeah, that\'s it.\r\n\r\n***',
        'WitCatMarkDown.create': 'Create markdown ID[id]X[x]Y[y] width [width] height [height] content [text]',
        'WitCatMarkDown.delete': 'Delete markdown ID[id]',
        'WitCatMarkDown.deleteall': 'Delete all markdown',
        'WitCatMarkDown.get': 'ID[id]markdown`s[type]',
        'WitCatMarkDown.set': 'set markdown ID[id]`s[type] to [text]',
        "WitCatMarkDown.sets": "Set the style of markdown ID[id] and the [num] [type] to [text]",
        'WitCatMarkDown.settextalign': 'set markdown ID[id] num [num]`s[type] to [text]',
        'WitCatMarkDown.imgstyle': 'markdown ID[id] width of [num] picture [width] height [height]',
        'WitCatMarkDown.loadfontfamily': 'load[name]from url[text]',
        'WitCatMarkDown.setfontfamily': 'set markdown ID[id]`s font family[name]',
        'WitCatBBcodes.code': 'Set the [num] code box highlighted by markdown ID[id] to [name]',
        'WitCatMarkDown.ide': 'Set markdown ID[id] to [name]',
        'WitCatMarkDown.size': 'markdown size adaptive[type]',
        'WitCatMarkDown.type.1': 'X',
        'WitCatMarkDown.type.2': 'Y',
        'WitCatMarkDown.type.3': 'width',
        'WitCatMarkDown.type.4': 'height',
        'WitCatMarkDown.type.5': 'content',
        'WitCatMarkDown.type.6': 'json',
        'WitCatMarkDown.type.7': 'perspective',
        'WitCatMarkDown.type.8': 'Content height',
        'WitCatMarkDown.type.9': 'Longitudinal roll position',
        'WitCatMarkDown.type.10': 'Content width',
        'WitCatMarkDown.type.11': 'Horizontal roll position',
        'WitCatMarkDown.ide.1': 'editable',
        'WitCatMarkDown.ide.2': 'uneditable',
        'WitCatMarkDown.types.1': 'turn on',
        'WitCatMarkDown.types.2': 'turn off',
        'WitCatMarkDown.getwidth': 'get[content]`s render[type]',
        'WitCatMarkDown.click': 'Last clicked element`s[clickmenu]',
        'WitCatMarkDown.touchs': 'Touch element`s[clickmenu]',
        'WitCatMarkDown.clickmenu.1': 'markdown Source',
        'WitCatMarkDown.clickmenu.2': 'type',
        'WitCatMarkDown.clickmenu.3': 'Serial number',
        'WitCatMarkDown.touch': 'markdown[id]num[number]`s[type]element is encountered?',
        'WitCatMarkDown.move': 'markdown[id]num[number]`s[type] element offset X[x]Y[y]',
        'WitCatMarkDown.scale': 'markdown[id]num[number]`s[type] element scale X[x]Y[y]',
        'WitCatMarkDown.rot': 'markdown[id]num[number]`s[type] element rotat [y]',
        'WitCatMarkDown.3dmove': 'markdown[id]num[number]`s[type] element 3Doffset X[x]Y[y]Z[z]',
        'WitCatMarkDown.3drot': 'markdown[id]num[number]`s[type] element 3Drotat X[x]Y[y]Z[z]',
        'WitCatMarkDown.setinsite': 'Set markdown[id]num[number]`s[type] element [input] to [text]',
        'WitCatMarkDown.transition': 'Set [timing] for markdown[id] to transition to [s] seconds',
        'WitCatMarkDown.timing.1': 'linear',
        'WitCatMarkDown.timing.2': 'ease-out',
        'WitCatMarkDown.timing.3': 'ease-in',
        'WitCatMarkDown.timing.4': 'ease-in-out',
        'WitCatMarkDown.timing.5': 'ease',
        'WitCatMarkDown.textalign.1': 'Align left',
        'WitCatMarkDown.textalign.2': 'Align right',
        'WitCatMarkDown.setinsite.1': 'shadow',
        'WitCatMarkDown.setinsite.2': 'text shadow',
        "WitCatMarkDown.setstyle.1": "text",
        "WitCatMarkDown.setstyle.2": "bold",
        "WitCatMarkDown.setstyle.3": "italic",
        "WitCatMarkDown.setstyle.4": "Large size",
        "WitCatMarkDown.setstyle.5": "more large size",
        "WitCatMarkDown.setstyle.6": "supersize",
        "WitCatMarkDown.setstyle.7": "link",
        "WitCatMarkDown.setstyle.8": "Code box",
      },
    };
  }

  /**
   * 翻译
   * @param {string} id
   * @return {string}
   */
  formatMessage(id) {
    const table = this._l10n[this._lang];
    return (table && table[id]) || id;
  }

  static get customFieldTypes() {
    return moreFieldsTextareaCustomFieldTypes;
  }

  getInfo() {
    return {
      id: witcat_markdown_extensionId, // 拓展id
      name: this.formatMessage('WitCatMarkDown.name'), // 拓展名
      blockIconURI: witcat_markdown_icon,
      menuIconURI: witcat_markdown_icon,
      color1: '#1c7321',
      color2: '#114514',
      blocks: [
        {
          blockType: 'button',
          text: this.formatMessage('WitCatMarkDown.docs'),
          func: 'docs',
        },
        `---${this.formatMessage('WitCatMarkDown.name')}`,
        {
          opcode: 'create',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.create'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            x: {
              type: 'number',
              defaultValue: '0',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
            width: {
              type: 'number',
              defaultValue: '100',
            },
            height: {
              type: 'number',
              defaultValue: '100',
            },
            text: {
              type: 'string',
              defaultValue: 'wit_cat!!!',
            },
          },
        },
        {
          opcode: 'set',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.set'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            type: {
              type: 'string',
              menu: 'types',
            },
            text: {
              type: 'string',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: "sets",
          blockType: "command",
          text: this.formatMessage("WitCatMarkDown.sets"),
          arguments: {
            id: {
              type: "string",
              defaultValue: 'i',
            },
            num: {
              type: "number",
              defaultValue: '1',
            },
            type: {
              type: "string",
              menu: 'settype',
            },
            text: {
              type: "string",
              defaultValue: '{"color":"red"}',
            },
          },
        },
        {
          opcode: 'imgstyle',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.imgstyle'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            num: {
              type: 'number',
              defaultValue: '1',
            },
            width: {
              type: 'string',
              defaultValue: '100',
            },
            height: {
              type: 'string',
              defaultValue: '100',
            },
          },
        },
        {
          opcode: 'code',
          blockType: 'command',
          text: this.formatMessage('WitCatBBcodes.code'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            num: {
              type: 'number',
              defaultValue: '1',
            },
            name: {
              type: 'string',
              menu: 'code',
            },
          },
        },
        {
          opcode: 'ide',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.ide'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            num: {
              type: 'number',
              defaultValue: '1',
            },
            name: {
              type: 'string',
              menu: 'ide',
            },
          },
        },
        {
          opcode: 'size',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.size'),
          arguments: {
            type: {
              type: 'boolean',
              menu: 'typess',
            },
          },
        },
        {
          opcode: 'setfont',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.setfontfamily'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            name: {
              type: 'string',
              defaultValue: 'arial',
            },
          },
        },
        {
          opcode: 'loadfont',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.loadfontfamily'),
          arguments: {
            text: {
              type: 'string',
              defaultValue: 'url',
            },
            name: {
              type: 'string',
              defaultValue: 'arial',
            },
          },
        },
        {
          opcode: 'delete',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.delete'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
          },
        },
        {
          opcode: 'deleteall',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.deleteall'),
          arguments: {},
        },
        {
          opcode: 'get',
          blockType: 'reporter',
          text: this.formatMessage('WitCatMarkDown.get'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            type: {
              type: 'string',
              menu: 'type',
            },
          },
        },
        {
          opcode: 'getwidth',
          blockType: 'reporter',
          text: this.formatMessage('WitCatMarkDown.getwidth'),
          arguments: {
            content: {
              type: 'string',
              defaultValue: 'witcat',
            },
            type: {
              type: 'string',
              menu: 'width',
            },
          },
        },
        {
          opcode: 'click',
          blockType: 'reporter',
          text: this.formatMessage('WitCatMarkDown.click'),
          arguments: {
            clickmenu: {
              type: 'string',
              menu: 'clickmenu',
            },
          },
        },
        {
          opcode: 'touchs',
          blockType: 'reporter',
          text: this.formatMessage('WitCatMarkDown.touchs'),
          arguments: {
            clickmenu: {
              type: 'string',
              menu: 'clickmenu',
            },
          },
        },
        {
          opcode: 'touch',
          blockType: 'Boolean',
          text: this.formatMessage('WitCatMarkDown.touch'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
          },
        },
        {
          opcode: 'settextalign',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.settextalign'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            num: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'all',
            },
            text: {
              type: 'number',
              menu: 'textalign',
            },
          },
        },
        {
          opcode: 'move',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.move'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            x: {
              type: 'number',
              defaultValue: '0',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'scale',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.scale'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            x: {
              type: 'number',
              defaultValue: '0',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'rot',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.rot'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'dmove',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.3dmove'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            x: {
              type: 'number',
              defaultValue: '0',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
            z: {
              type: 'number',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'drot',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.3drot'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            x: {
              type: 'number',
              defaultValue: '0',
            },
            y: {
              type: 'number',
              defaultValue: '0',
            },
            z: {
              type: 'number',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'setinsite',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.setinsite'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            number: {
              type: 'number',
              defaultValue: '1',
            },
            type: {
              type: 'string',
              defaultValue: 'img',
            },
            input: {
              type: 'string',
              menu: 'setinsite',
            },
            text: {
              type: 'string',
              defaultValue: '0',
            },
          },
        },
        {
          opcode: 'transition',
          blockType: 'command',
          text: this.formatMessage('WitCatMarkDown.transition'),
          arguments: {
            id: {
              type: 'string',
              defaultValue: 'i',
            },
            s: {
              type: 'number',
              defaultValue: '1',
            },
            timing: {
              type: 'string',
              menu: 'timing',
            },
          },
        },
        {
          opcode: 'docss',
          blockType: 'reporter',
          text: this.formatMessage('WitCatMarkDown.docss'),
          disableMonitor: true,
          arguments: {},
        },
        
      ],
      menus: {
        type: [
          {
            text: this.formatMessage('WitCatMarkDown.type.1'),
            value: 'x',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.2'),
            value: 'y',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.3'),
            value: 'width',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.4'),
            value: 'height',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.5'),
            value: 'content',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.8'),
            value: 'ContentHeight',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.9'),
            value: 'Longitudinal',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.10'),
            value: 'ContentWidth',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.11'),
            value: 'Horizontal',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.6'),
            value: 'json',
          },
        ],
        types: [
          {
            text: this.formatMessage('WitCatMarkDown.type.1'),
            value: 'x',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.2'),
            value: 'y',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.3'),
            value: 'width',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.4'),
            value: 'height',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.5'),
            value: 'content',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.7'),
            value: 'perspective',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.9'),
            value: 'Longitudinal',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.11'),
            value: 'Horizontal',
          },
        ],
        typess: [
          {
            text: this.formatMessage('WitCatMarkDown.types.1'),
            value: 'true',
          },
          {
            text: this.formatMessage('WitCatMarkDown.types.2'),
            value: 'false',
          },
        ],
        code: [
          {
            text: 'javascript',
            value: 'language-javascript',
          },
          {
            text: 'css',
            value: 'language-css',
          },
          {
            text: 'HTML',
            value: 'language-html',
          },
          {
            text: 'python',
            value: 'language-python',
          },
        ],
        ide: [
          {
            text: this.formatMessage('WitCatMarkDown.ide.1'),
            value: 'true',
          },
          {
            text: this.formatMessage('WitCatMarkDown.ide.2'),
            value: 'false',
          },
        ],
        width: [
          {
            text: this.formatMessage('WitCatMarkDown.type.3'),
            value: 'width',
          },
          {
            text: this.formatMessage('WitCatMarkDown.type.4'),
            value: 'height',
          },
        ],
        clickmenu: [
          {
            text: this.formatMessage('WitCatMarkDown.clickmenu.1'),
            value: 'markdown',
          },
          {
            text: this.formatMessage('WitCatMarkDown.clickmenu.2'),
            value: 'type',
          },
          {
            text: this.formatMessage('WitCatMarkDown.clickmenu.3'),
            value: 'number',
          },
        ],
        timing: [
          {
            text: this.formatMessage('WitCatMarkDown.timing.1'),
            value: 'linear',
          },
          {
            text: this.formatMessage('WitCatMarkDown.timing.2'),
            value: 'ease-out',
          },
          {
            text: this.formatMessage('WitCatMarkDown.timing.3'),
            value: 'ease-in',
          },
          {
            text: this.formatMessage('WitCatMarkDown.timing.4'),
            value: 'ease-in-out',
          },
          {
            text: this.formatMessage('WitCatMarkDown.timing.5'),
            value: 'ease',
          },
        ],
        textalign: [
          {
            text: this.formatMessage('WitCatMarkDown.textalign.1'),
            value: 'left',
          },
          {
            text: this.formatMessage('WitCatMarkDown.textalign.2'),
            value: 'right',
          },
        ],
        setinsite: [
          {
            text: this.formatMessage('WitCatMarkDown.setinsite.1'),
            value: 'shadow',
          },
          {
            text: this.formatMessage('WitCatMarkDown.setinsite.2'),
            value: 'textShadow',
          },
        ],
        show: [
          {
            text: this.formatMessage('WitCatMarkDown.show.1'),
            value: 'more',
          },
          {
            text: this.formatMessage('WitCatMarkDown.show.2'),
            value: 'fold',
          },
        ],
        settype: {
          acceptReporters: true,
          items: [
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.1'),
              value: 'p'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.2'),
              value: 'strong'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.3'),
              value: 'em'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.4'),
              value: 'h3'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.5'),
              value: 'h2'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.6'),
              value: 'h1'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.7'),
              value: 'a'
            },
            {
              text: this.formatMessage('WitCatMarkDown.setstyle.8'),
              value: 'code'
            },
          ],
        },
      },
      customFieldTypes: moreFieldsTextareaCustomFieldTypes,
    };
  }

  /** 打开教程 */
  docs() {
    const a = document.createElement('a');
    a.href = 'https://www.ccw.site/post/7d129e01-e30a-4d88-92d2-320b555ed0f5';
    a.rel = 'noopener noreferrer';
    a.target = '_blank';
    a.click();
  }

  /**
   * 可换行的输入框（弹出式）
   * @param {Object} args
   * @return {string}
   */
  textarea(args) {
    return args.TEXT;
  }

  /**
   * 可换行的输入框（内联式）
   * @param {Object} args
   * @return {string}
   */
  textareaInline(args) {
    return args.TEXT;
  }

  /**
  * 设置样式
  * @param {Object} args 
  */
  sets(args) {
    if (this.canvas() === null || this.inputParent() === null) {
      return;
    }
    const search = this._getEl(args.id);
    if (search === null || !(Number(args.num) > 0)) {
      return;
    }
    const target = search.getElementsByTagName(String(args.type))[args.num - 1];
    if (target === undefined) {
      return;
    }
    let styles;
    try {
      styles = JSON.parse(args.text);
    } catch (e) {
      console.error("WitCatMarkDown", e);
      if (e.message.includes("is not valid JSON"))
        console.error("WitCatMarkDown", "请输入正确的json字符串");
      return;
    }
    if (styles === null || typeof styles !== 'object') {
      return;
    }
    for (const [prop, value] of Object.entries(styles)) {
      if (!prop || String(value).includes('url')) {
        continue;
      }
      target.style.setProperty(prop, String(value));
    }
  }

  /**
   * 限制值的范围，如果值是NaN，返回最小值
   * @param {number} x 数值
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @return {number}
   */
  _clamp(x, min, max) {
    return isNaN(x) ? min : x < min ? min : x > max ? max : x;
  }

  /**
   * 按 ID 获取 markdown 容器（.WitCatMarkDownOut）
   * @param {string} id markdown ID
   * @return {HTMLDivElement | null}
   */
  _getEl(id) {
    const el = document.getElementById(`WitCatMarkDown${id}`);
    return el instanceof HTMLDivElement ? el : null;
  }

  /**
   * 创建文本框
   * @param {Object} args
   */
  create(args) {
    if (this.canvas() === null) {
      console.error('[WitCatMarkDown] canvas 找不到，无法创建 markdown');
      return;
    }
    const parent = this.inputParent() || document.body;

    let x = Number(args.x);
    let y = Number(args.y);
    let width = Number(args.width);
    let height = Number(args.height);
    x = this._clamp(x, 0, this.runtime.stageWidth);
    y = this._clamp(y, 0, this.runtime.stageHeight);
    width = this._clamp(width, 0, this.runtime.stageWidth - x);
    height = this._clamp(height, 0, this.runtime.stageHeight - y);

    let search = this._getEl(args.id);
    if (search !== null) {
      search.parentElement && search.parentElement.removeChild(search);
      search = null;
    }
    if (search === null) {
      search = document.createElement('div');
      search.id = `WitCatMarkDown${args.id}`;
      search.className = 'WitCatMarkDownOut';
      search.style.overflow = 'auto';
      search.style.webkitUserSelect = 'text';
      search.style.userSelect = 'text';
      search.style.zIndex = '100';
      parent.appendChild(search);
    }

    const sstyle = search.style;
    sstyle.position = 'absolute';

    const canvas = this.canvas();
    const pRect = parent.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();

    const offsetX = cRect.left - pRect.left;
    const offsetY = cRect.top - pRect.top;

    const dispW = cRect.width || this.runtime.stageWidth;
    const dispH = cRect.height || this.runtime.stageHeight;

    sstyle.left = `${offsetX + (x / this.runtime.stageWidth) * dispW}px`;
    sstyle.top = `${offsetY + (y / this.runtime.stageHeight) * dispH}px`;
    sstyle.width = `${(width / this.runtime.stageWidth) * dispW}px`;
    sstyle.height = `${(height / this.runtime.stageHeight) * dispH}px`;

    search.innerHTML = `<div class='WitCatMarkDown'>${markdownToHtml(String(args.text), { docId: String(args.id) })}</div>`;
    Prism.highlightAllUnder(search);

  }

  imgstyle(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      if (search.getElementsByTagName('img').length > args.num - 1 && args.num > 0) {
        search.getElementsByTagName('img')[args.num - 1].style.width = args.width == '' ? '' : `${args.width}px`;
        search.getElementsByTagName('img')[args.num - 1].style.height = args.height == '' ? '' : `${args.height}px`;
      }
    }
  }

  /**
   * 设置markdown
   * @param {object} args
   * @param {SCarg} args.id ID
   * @param {SCarg} args.type 属性类型
   * @param {SCarg} args.text 属性值
   */
  set(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const sstyle = search.style;
      let x;
      let y;
      let width;
      let height;
      switch (args.type) {
        case 'x':
          x = this._clamp(Number(args.text), 0, this.runtime.stageWidth);
          sstyle.left = `${x}px`;
          break;
        case 'y':
          y = this._clamp(Number(args.text), 0, this.runtime.stageHeight);
          sstyle.top = `${y}px`;
          break;
        case 'width':
          x = parseFloat(sstyle.left);
          width = this._clamp(Number(args.text), 0, this.runtime.stageWidth - x);
          sstyle.width = `${Number(width)}px`;
          break;
        case 'height':
          y = parseFloat(sstyle.top);
          height = this._clamp(Number(args.text), 0, this.runtime.stageHeight - y);
          sstyle.height = `${Number(height)}px`;
          break;
        case 'content':
          search.innerHTML = `<div class='WitCatMarkDown'>${markdownToHtml(String(args.text), { docId: String(args.id) })}</div>`;
          Prism.highlightAllUnder(search);
          break;
        case 'perspective':
          search.firstChild.style.perspective = `${Number(args.text)}px`;
          break;
        case 'Longitudinal':
          search.scrollTo({ top: Number(args.text) });
          break;
        case 'Horizontal':
          search.scrollTo({ left: Number(args.text) });
          break;
        default:
          break;
      }
    }
  }

  /**
   * 设置字体
   * @param {object} args
   * @param {string} args.id ID
   * @param {string} args.name 要设置的字体
   */
  setfont(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      search.style.fontFamily = `"${args.name}"`;
    }
  }

  ide(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      search.setAttribute('contenteditable', args.name);
      search.style.outline = 'none';
    }
  }

  getwidth(args) {
    if (this.canvas() === null || this.inputParent() === null) {
      return '';
    }
    // 隐藏临时测量元素，避免闪烁；visibility:hidden 不影响布局测量
    const search = document.createElement('span');
    search.style.position = 'fixed';
    search.style.visibility = 'hidden';
    search.style.pointerEvents = 'none';
    search.className = 'WitCatMarkDown';
    search.innerHTML = `<div class='WitCatMarkDown'>${markdownToHtml(String(args.content))}</div>`;
    document.body.appendChild(search);
    const cv = this.canvas();
    const cvsw = cv.getBoundingClientRect().width;
    const cvsh = cv.getBoundingClientRect().height;
    let outw;
    switch (args.type) {
      case 'width':
        outw = search.offsetWidth;
        search.remove();
        return outw * (this.runtime.stageWidth / (cvsw * 0.748));
      case 'height':
        outw = search.offsetHeight;
        search.remove();
        return outw * (this.runtime.stageHeight / (cvsh * 0.777));
      default:
        // 未知类型时也要移除临时元素，避免泄漏
        search.remove();
        return '';
    }
  }

  size(args) {
    if (this.canvas() === null) {
      return;
    }
    if (args.type === 'true') {
      if (this.resize === null) {
        this.resize = new ResizeObserver(() => {
          const cv = this.canvas();
          if (cv === null) return;
          const scale = cv.getBoundingClientRect().width / this.runtime.stageWidth;
          document.documentElement.style.setProperty('--witcat-markdown-scale', `scale(${scale})`);
        });
        this.resize.observe(this.canvas(), { box: 'content-box' });
      }
    } else {
      if (this.resize !== null) {
        this.resize.disconnect();
        this.resize = null;
      }
    }
  }

  setinsite(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        switch (String(args.input)) {
          case "shadow":
            ele.style.boxShadow = String(args.text);
            break;
          case "textShadow":
            ele.style.textShadow = String(args.text);
            break;
          default:
            break;
        }
      }
    }
  }

  /**
   * 加载字体
   * @param {object} args
   * @param {string} args.id ID
   * @param {string} args.name 要获取的字体
   */
  loadfont(args) {
    if (String(args.text).startsWith("data:application/font-woff;")) {
      // Handle data URI directly
      const font = new FontFace(String(args.name), `url(${String(args.text)})`);
      font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
      }).catch(function(error) {
        console.error('Font loading failed:', error);
      });
    } else if (
      String(args.text).startsWith('https://m.ccw.site') ||
      String(args.text).startsWith('https://m.xiguacity') ||
      String(args.text).startsWith('https://static.xiguacity')
    ) {
      const xhr = new XMLHttpRequest(); // Define an asynchronous object
      xhr.open('GET', String(args.text), true); // Asynchronous GET method to load the font
      xhr.responseType = 'arraybuffer'; // Change the asynchronous fetch type to arraybuffer binary type
      xhr.onload = function () {
        document.fonts.add(new FontFace(String(args.name), this.response)); // Add the font object to the page
      };
      xhr.send();
    } else {
      console.warn('不允许的链接\nDisallowed links');
    }
  }

  click(args) {
    let out = '';
    if (markdownmousedown.target) {
      // getElementsByClassName 返回 HTMLCollection，没有 forEach，需要先转成数组
      const containers = Array.from(document.getElementsByClassName('WitCatMarkDown'));
      for (const e of containers) {
        if (!e.contains(markdownmousedown.target)) {
          continue;
        }
        switch (args.clickmenu) {
          case 'markdown':
            out = e.parentElement.id.split('WitCatMarkDown')[1];
            break;
          case 'type':
            out = markdownmousedown.target.tagName.toLowerCase();
            break;
          case 'number': {
            const ss = e.getElementsByTagName(markdownmousedown.target.tagName.toLowerCase());
            for (let i = 0; i < ss.length; i++) {
              if (ss[i] === markdownmousedown.target) {
                out = i + 1;
                break;
              }
            }
            break;
          }
          default:
            break;
        }
        break;
      }
    }
    return out;
  }

  touchs(args) {
    let out = '';
    if (touchEvent.target) {
      // getElementsByClassName 返回 HTMLCollection，没有 forEach，需要先转成数组
      const containers = Array.from(document.getElementsByClassName('WitCatMarkDown'));
      for (const e of containers) {
        if (!e.contains(touchEvent.target)) {
          continue;
        }
        switch (args.clickmenu) {
          case 'markdown':
            out = e.parentElement.id.split('WitCatMarkDown')[1];
            break;
          case 'type':
            out = touchEvent.target.tagName.toLowerCase();
            break;
          case 'number': {
            const ss = e.getElementsByTagName(touchEvent.target.tagName.toLowerCase());
            for (let i = 0; i < ss.length; i++) {
              if (ss[i] === touchEvent.target) {
                out = i + 1;
                break;
              }
            }
            break;
          }
          default:
            break;
        }
        break;
      }
    }
    return out;
  }

  touch(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      if (Number(args.number) > 0) {
        const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
        if (ele !== undefined) {
          return Boolean(touchEvent.target) && touchEvent.target === ele;
        }
      } else {
        // getElementsByTagName 返回 HTMLCollection，没有 some，需要先转成数组
        const ele = Array.from(search.getElementsByTagName(String(args.type)));
        return Boolean(touchEvent.target) && ele.some((e) => e === touchEvent.target);
      }
    }
    return false;
  }

  move(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        ele.style.transition = search.style.transition;
        ele.style.display = 'inline-block';
        const regex = /\btranslate\([^)]*\)/g;
        ele.style.transform = `${ele.style.transform.replace(regex, '')} translate(${args.x}px,${args.y}px)`;
      }
    }
  }

  /**
   * 设置代码框高亮
   * @param {object} args
   */
  code(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      if (search.getElementsByTagName('pre').length > args.num - 1 && args.num > 0) {
        const a = Array.from(search.getElementsByTagName('pre')[args.num - 1].children);
        a.forEach((e) => {
          e.className = args.name;
        });
        Prism.highlightAllUnder(search);
      }
    }
  }

  scale(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        ele.style.transition = search.style.transition;
        ele.style.display = 'inline-block';
        const regex = /\bscale\([^)]*\)/g;
        ele.style.transform = `${ele.style.transform.replace(regex, '')} scale(${args.x},${args.y})`;
      }
    }
  }

  rot(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        ele.style.transition = search.style.transition;
        ele.style.display = 'inline-block';
        const regex = /\brotate\([^)]*\)/g;
        ele.style.transform = `${ele.style.transform.replace(regex, '')} rotate(${args.y}deg)`;
      }
    }
  }

  dmove(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        ele.style.transition = search.style.transition;
        ele.style.display = 'inline-block';
        const regex = /\btranslate3d\([^)]*\)/g;
        ele.style.transform = `${ele.style.transform.replace(regex, '')} translate3d(${args.x}px,${args.y}px,${args.z
          }px)`;
      }
    }
  }

  drot(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      const ele = search.getElementsByTagName(String(args.type))[Number(args.number) - 1];
      if (ele !== undefined) {
        ele.style.display = 'inline-block';
        ele.style.transform = `${ele.style.transform.replace(/\brotateX\([^)]*\)/g, '')} rotateX(${args.x}deg)`;
        ele.style.transform = `${ele.style.transform.replace(/\brotateY\([^)]*\)/g, '')} rotateY(${args.y}deg)`;
        ele.style.transform = `${ele.style.transform.replace(/\brotateZ\([^)]*\)/g, '')} rotateZ(${args.z}deg)`;
      }
    }
  }

  transition(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      search.style.transition = `all ${args.s}s ${args.timing}`;
    }
  }

  settextalign(args) {
    const search = this._getEl(args.id);
    if (search !== null) {
      if (String(args.type) === 'all') {
        search.firstChild.style.float = String(args.text);
      } else {
        const ele = search.getElementsByTagName(String(args.type))[Number(args.num) - 1];
        if (ele !== undefined) {
          ele.style.float = String(args.text);
        }
      }
    }
  }

  /**
   * 获取代码返回值
   * @param {Object} args
   */
  get(args) {
    if (this.canvas() === null || this.inputParent() === null) {
      return '';
    }
    const search = this._getEl(args.id);
    if (search !== null) {
      return this._getattrib(search, args.type);
    }
    return '';
  }

  /**
   * 删除文本框
   * @param {Object} args
   * @returns
   */
  delete(args) {
    if (this.inputParent() === null) {
      return;
    }
    const search = this._getEl(args.id);
    if (search !== null) {
      this.inputParent().removeChild(search);
    }
  }

  /**
   * 删除所有文本框
   * @param {Object} args
   * @returns
   */
  deleteall() {
    if (this.inputParent() === null) {
      return;
    }
    const search = document.getElementsByClassName('WitCatMarkDown');
    for (const item of Array.from(search)) {
      if (item.parentElement) item.parentElement.remove();
    }
  }

  /**
   * 获取示例markdown
   * @returns {string}
   */
  docss() {
    return this.formatMessage('WitCatMarkDown.tutorial');
  }

  /**
   * 获取文本框的属性
   * @param {Element} element 文本框元素
   * @param {string} type 属性类型
   * @returns {number|string}
   */
  _getattrib(element, type) {
    // 用于通过类型检查，确保不出错
    if (!(element instanceof HTMLDivElement)) {
      console.warn('Input.js: 获取到的元素的类型不正确: ', element);
      return '';
    }
    switch (type) {
      case 'x':
        return parseFloat(element.style.left);
      case 'y':
        return parseFloat(element.style.top);
      case 'width':
        return parseFloat(element.style.width);
      case 'height':
        return parseFloat(element.style.height);
      case 'content':
        return element.innerText;
      case 'ContentHeight':
        return element.scrollHeight;
      case 'ContentWidth':
        return element.scrollWidth;
      case 'Longitudinal':
        return element.scrollTop;
      case 'Horizontal':
        return element.scrollLeft;
      case 'json': {
        const style = element.style;
        return JSON.stringify({
          X: parseFloat(style.left),
          Y: parseFloat(style.top),
          width: parseFloat(style.width),
          height: parseFloat(style.height),
          content: element.innerText,
        });
      }
      default:
        return '';
    }
  }
}

  Scratch.extensions.register(new WitCatMarkDown());
})(Scratch);
