const versionNumber = "10";

const extId = 'communityPlus';
const extVer = '0.0.3';

const icon = "https://m.ccw.site/user_projects_assets/a6edfa0f6b8dda2fc126d847989c94ba.svg";
const rt = Scratch.vm.runtime;
const em = rt.extensionManager;
const vm = em.vm;
const refreshBlocks = em.refreshBlocks.bind(em);
const dyTexts = ["➕ 加载“连接社区”", "➕ 加载“连接社区增强版”", "❌ 清空所有动态生成积木", "🔁 检测更新"];
const testValue = "创造更好社区";

const CryptoJS = function(q,r){var k={},g=k.lib={},p=function(){},t=g.Base={extend:function(b){p.prototype=this;var j=new p;b&&j.mixIn(b);j.hasOwnProperty("init")||(j.init=function(){j.$super.init.apply(this,arguments)});j.init.prototype=j;j.$super=this;return j},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var j in b)b.hasOwnProperty(j)&&(this[j]=b[j]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},n=g.WordArray=t.extend({init:function(b,j){b=this.words=b||[];this.sigBytes=j!=r?j:4*b.length},toString:function(b){return(b||u).stringify(this)},concat:function(b){var j=this.words,a=b.words,l=this.sigBytes;b=b.sigBytes;this.clamp();if(l%4)for(var h=0;h<b;h++)j[l+h>>>2]|=(a[h>>>2]>>>24-8*(h%4)&255)<<24-8*((l+h)%4);else if(65535<a.length)for(h=0;h<b;h+=4)j[l+h>>>2]=a[h>>>2];else j.push.apply(j,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,j=this.sigBytes;b[j>>>2]&=4294967295<<32-8*(j%4);b.length=q.ceil(j/4)},clone:function(){var b=t.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var j=[],a=0;a<b;a+=4)j.push(4294967296*q.random()|0);return new n.init(j,b)}}),v=k.enc={},u=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var h=[],l=0;l<b;l++){var m=a[l>>>2]>>>24-8*(l%4)&255;h.push((m>>>4).toString(16));h.push((m&15).toString(16))}return h.join("")},parse:function(b){for(var a=b.length,h=[],l=0;l<a;l+=2)h[l>>>3]|=parseInt(b.substr(l,2),16)<<24-4*(l%8);return new n.init(h,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var h=[],l=0;l<b;l++)h.push(String.fromCharCode(a[l>>>2]>>>24-8*(l%4)&255));return h.join("")},parse:function(b){for(var a=b.length,h=[],l=0;l<a;l++)h[l>>>2]|=(b.charCodeAt(l)&255)<<24-8*(l%4);return new n.init(h,a)}},s=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(h){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},h=g.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=s.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,h=a.words,l=a.sigBytes,m=this.blockSize,k=l/(4*m),k=b?q.ceil(k):q.max((k|0)-this._minBufferSize,0);b=k*m;l=q.min(4*b,l);if(b){for(var g=0;g<b;g+=m)this._doProcessBlock(h,g);g=h.splice(0,b);a.sigBytes-=l}return new n.init(g,l)},clone:function(){var b=t.clone.call(this);b._data=this._data.clone();return b},_minBufferSize:0});g.Hasher=h.extend({cfg:t.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){h.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,h){return(new b.init(h)).finalize(a)}},_createHmacHelper:function(b){return function(a,h){return(new m.HMAC.init(b,h)).finalize(a)}}});var m=k.algo={};return k}(Math);(function(q){function r(a,m,b,j,g,l,k){a=a+(m&b|~m&j)+g+k;return(a<<l|a>>>32-l)+m}function k(a,m,b,j,g,l,k){a=a+(m&j|b&~j)+g+k;return(a<<l|a>>>32-l)+m}function g(a,m,b,j,g,l,k){a=a+(m^b^j)+g+k;return(a<<l|a>>>32-l)+m}function p(a,g,b,j,k,l,p){a=a+(b^(g|~j))+k+p;return(a<<l|a>>>32-l)+g}for(var t=CryptoJS,n=t.lib,v=n.WordArray,u=n.Hasher,n=t.algo,a=[],s=0;64>s;s++)a[s]=4294967296*q.abs(q.sin(s+1))|0;n=n.MD5=u.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(h,m){for(var b=0;16>b;b++){var j=m+b,n=h[j];h[j]=(n<<8|n>>>24)&16711935|(n<<24|n>>>8)&4278255360}var b=this._hash.words,j=h[m+0],n=h[m+1],l=h[m+2],q=h[m+3],t=h[m+4],s=h[m+5],u=h[m+6],v=h[m+7],w=h[m+8],x=h[m+9],y=h[m+10],z=h[m+11],A=h[m+12],B=h[m+13],C=h[m+14],D=h[m+15],c=b[0],d=b[1],e=b[2],f=b[3],c=r(c,d,e,f,j,7,a[0]),f=r(f,c,d,e,n,12,a[1]),e=r(e,f,c,d,l,17,a[2]),d=r(d,e,f,c,q,22,a[3]),c=r(c,d,e,f,t,7,a[4]),f=r(f,c,d,e,s,12,a[5]),e=r(e,f,c,d,u,17,a[6]),d=r(d,e,f,c,v,22,a[7]),c=r(c,d,e,f,w,7,a[8]),f=r(f,c,d,e,x,12,a[9]),e=r(e,f,c,d,y,17,a[10]),d=r(d,e,f,c,z,22,a[11]),c=r(c,d,e,f,A,7,a[12]),f=r(f,c,d,e,B,12,a[13]),e=r(e,f,c,d,C,17,a[14]),d=r(d,e,f,c,D,22,a[15]),c=k(c,d,e,f,n,5,a[16]),f=k(f,c,d,e,u,9,a[17]),e=k(e,f,c,d,z,14,a[18]),d=k(d,e,f,c,j,20,a[19]),c=k(c,d,e,f,s,5,a[20]),f=k(f,c,d,e,y,9,a[21]),e=k(e,f,c,d,D,14,a[22]),d=k(d,e,f,c,t,20,a[23]),c=k(c,d,e,f,x,5,a[24]),f=k(f,c,d,e,C,9,a[25]),e=k(e,f,c,d,q,14,a[26]),d=k(d,e,f,c,w,20,a[27]),c=k(c,d,e,f,B,5,a[28]),f=k(f,c,d,e,l,9,a[29]),e=k(e,f,c,d,v,14,a[30]),d=k(d,e,f,c,A,20,a[31]),c=g(c,d,e,f,s,4,a[32]),f=g(f,c,d,e,w,11,a[33]),e=g(e,f,c,d,z,16,a[34]),d=g(d,e,f,c,C,23,a[35]),c=g(c,d,e,f,n,4,a[36]),f=g(f,c,d,e,t,11,a[37]),e=g(e,f,c,d,v,16,a[38]),d=g(d,e,f,c,y,23,a[39]),c=g(c,d,e,f,B,4,a[40]),f=g(f,c,d,e,j,11,a[41]),e=g(e,f,c,d,q,16,a[42]),d=g(d,e,f,c,u,23,a[43]),c=g(c,d,e,f,x,4,a[44]),f=g(f,c,d,e,A,11,a[45]),e=g(e,f,c,d,D,16,a[46]),d=g(d,e,f,c,l,23,a[47]),c=p(c,d,e,f,j,6,a[48]),f=p(f,c,d,e,v,10,a[49]),e=p(e,f,c,d,C,15,a[50]),d=p(d,e,f,c,s,21,a[51]),c=p(c,d,e,f,A,6,a[52]),f=p(f,c,d,e,q,10,a[53]),e=p(e,f,c,d,y,15,a[54]),d=p(d,e,f,c,n,21,a[55]),c=p(c,d,e,f,w,6,a[56]),f=p(f,c,d,e,D,10,a[57]),e=p(e,f,c,d,u,15,a[58]),d=p(d,e,f,c,B,21,a[59]),c=p(c,d,e,f,t,6,a[60]),f=p(f,c,d,e,z,10,a[61]),e=p(e,f,c,d,l,15,a[62]),d=p(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,g=a.words,b=8*this._nDataBytes,j=8*a.sigBytes;g[j>>>5]|=128<<24-j%32;var k=q.floor(b/4294967296);g[(j+64>>>9<<4)+15]=(k<<8|k>>>24)&16711935|(k<<24|k>>>8)&4278255360;g[(j+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(g.length+1);this._process();a=this._hash;g=a.words;for(b=0;4>b;b++)j=g[b],g[b]=(j<<8|j>>>24)&16711935|(j<<24|j>>>8)&4278255360;return a},clone:function(){var a=u.clone.call(this);a._hash=this._hash.clone();return a}});t.MD5=u._createHelper(n);t.HmacMD5=u._createHmacHelper(n)})(Math);(function(){var q=CryptoJS,r=q.enc.Utf8;q.algo.HMAC=q.lib.Base.extend({init:function(k,g){k=this._hasher=new k.init;"string"==typeof g&&(g=r.parse(g));var p=k.blockSize,q=4*p;g.sigBytes>q&&(g=k.finalize(g));g.clamp();for(var n=this._oKey=g.clone(),v=this._iKey=g.clone(),u=n.words,a=v.words,s=0;s<p;s++)u[s]^=1549556828,a[s]^=909522486;n.sigBytes=v.sigBytes=q;this.reset()},reset:function(){var k=this._hasher;k.reset();k.update(this._iKey)},update:function(k){this._hasher.update(k);return this},finalize:function(k){var g=this._hasher;k=g.finalize(k);g.reset();return g.finalize(this._oKey.clone().concat(k))}})})();
function ccwFetch(url, body = "{}", credentials = "include") {
    return fetch(url, {
        method: 'post',
        body,
        headers: { 'content-type': 'application/json' },
        credentials,
    })
        .then(_ => _.json())
        .then(_ => _.body);
}
const secretKey = ccwFetch('https://community-web.ccw.site/health/check')
    .then(_ => {
        secretKey.done = 1;
        refreshBlocks();
        return _.map(({ traceId }) => traceId[parseInt(traceId[0], 16) + 1]).reverse().join('');
    });
function _uninst(id) {
    for (const t of rt.targets) for (const b of Object.values(t.blocks._blocks)) b.opcode?.startsWith(id + '_') && t.blocks.deleteBlock(b.id);
    em.deleteExtensionById(id);
    vm.refreshWorkspace();
}
async function abfetch(url, _body, h) {
    const body = JSON.stringify(_body);
    const timestamp = Date.now();
    const signature = CryptoJS.HmacMD5('ccw' + body + timestamp, await secretKey).toString(CryptoJS.enc.Hex);
    return fetch(url, {
        method: 'post',
        body,
        headers: {
            a: signature,
            b: timestamp,
            'content-type': 'application/json',
            ...h
        },
        credentials: 'include',
    })
        .then(_ => _.json())
        .then(_ => _.body);
}

class makeTheCommunityBetter {
    constructor() {
        if (rt.ext_community) dyTexts[0] = "✅ 已加载";
        if (rt.ext_communityEnhanced) dyTexts[1] = "✅ 已加载";
        this.getInfo = () => ({
            id: extId,
            name: '社区连接 Kontakt+',
            menuIconURI: icon,
            blockIconURI: icon,
            blocks: [
                {
                    blockType: 'label',
                    text: `v ${extVer} (${versionNumber})`,
                },
                {
                    blockType: 'button',
                    text: '📖 文档及 API 使用条款',
                    onClick: () => open("https://getgandi.com/cn/extensions/kontakt"),
                },
                {
                    blockType: 'button',
                    text: dyTexts[3],
                    func: 'checkUpdate'
                },
                {
                    blockType: 'button',
                    text: dyTexts[0],
                    onClick: () => em.loadExternalExtensionById('community').then(id => {
                        dyTexts[0] = id === "community" ? "✅ 已加载" : "❌ 加载失败";
                        refreshBlocks();
                    })
                },
                {
                    blockType: 'button',
                    text: dyTexts[1],
                    onClick: async () => {
                        dyTexts[1] = "🧐 正在获取 URL";
                        refreshBlocks();
                        let response;
                        try {
                            response = await fetch("https://431658.dpdns.org/communityEnhancedLatestURL.txt");
                        } catch {
                            try {
                                response = await fetch("https://gh.llkk.cc/https://raw.githubusercontent.com/431658/431658.github.io/refs/heads/main/communityEnhancedLatestURL.txt");
                            } catch {}
                        }
                        if (response?.ok) {
                            const url = await response.text();
                            await em.loadExtensionURL(url.trimEnd());
                            dyTexts[1] = rt.ext_communityEnhanced ? "✅ 已加载" : "❌ 加载失败";
                        } else {
                            dyTexts[1] = "❌ 加载失败";
                        }
                        refreshBlocks();
                    }
                },
                {
                    blockType: 'button',
                    text: '✋ 反馈 BUG 或建议',
                    onClick: () => open("mailto:zeroink32@outlook.com"),
                },
                {
                    blockType: 'label',
                    text: '🌄 设备信息',
                    hideFromPalette: 1,
                },
                {
                    blockType: 'label',
                    text: '🌍 网络'
                },
                {
                    opcode: 'axiosDone',
                    blockType: 'Boolean',
                    text: '初始化完成？',
                    // hideFromPalette: 1,
                },
                {
                    opcode: 'comment',
                    blockType: 'reporter',
                    allowDropAnywhere: 1,
                    text: '在 [st] OID [oid] 评论 [co] 被回复评论 ID [rid]（空则为发表评论），成功则返回评论 ID',
                    arguments: {
                        st: {
                            menu: 'st',
                        },
                        oid: {
                            type: 'string',
                            defaultValue: '692538ef86bbc77f84e3b259'
                        },
                        co: {
                            type: 'string',
                            defaultValue: testValue
                        },
                        rid: {
                            type: 'string',
                        },
                    }
                },
                {
                    opcode: 'reply',
                    text: '回复评论 ID [id] [content]',
                    blockType: 'reporter',
                    arguments: {
                        id: { type: 'string' },
                        content: {
                            type: 'string',
                            defaultValue: testValue
                        }
                    }
                },
                {
                    opcode: 'shortURL',
                    blockType: 'reporter',
                    text: '生成短链接 [url]',
                    allowDropAnywhere: 1,
                    arguments: {
                        url: {
                            type: 'string',
                            defaultValue: 'https://www.ccw.site/student/6107c5323e593a0c25f850f8'
                        },
                    }
                },
                {
                    opcode: 'userAxios',
                    blockType: 'reporter',
                    allowDropAnywhere: 1,
                    text: '[op] 用户 OID [oid]',
                    arguments: {
                        op: {
                            menu: 'userOpAxios'
                        },
                        oid: {
                            type: 'string',
                            defaultValue: '6107c5323e593a0c25f850f8'
                        },
                    }
                },
                {
                    opcode: 'deleteComment',
                    blockType: 'Boolean',
                    text: '删除评论 ID [id]',
                    arguments: {
                        id: { type: 'string' }
                    }
                },
                {
                    opcode: 'change',
                    blockType: 'Boolean',
                    text: '修改 [key] 为 [value]',
                    arguments: {
                        key: { menu: 'change' },
                        value: { type: 'string' }
                    }
                },
                {
                    opcode: 'setCD',
                    blockType: 'Boolean',
                    text: '设置云数据 作品 [oid] [u] 中的 [k] 为 [v]',
                    arguments: {
                        oid: {
                            type: 'string',
                            defaultValue: rt.ccwAPI.getProjectUUID(),
                        },
                        k: {
                            type: 'string',
                            defaultValue: 'key'
                        },
                        v: {
                            type: 'string',
                            defaultValue: 'value'
                        },
                        u: { menu: 'cdu' }
                    }
                },
                {
                    opcode: 'getCD',
                    blockType: 'reporter',
                    allowDropAnywhere: 1,
                    text: '读取云数据 作品 [oid] [u] 中的 [k]',
                    arguments: {
                        oid: {
                            type: 'string',
                            defaultValue: rt.ccwAPI.getProjectUUID(),
                        },
                        k: {
                            type: 'string',
                            defaultValue: 'key'
                        },
                        v: {
                            type: 'string',
                            defaultValue: 'value'
                        },
                        u: { menu: 'cdu' }
                    }
                },
                '---',
                {
                    opcode: 'login',
                    blockType: 'reporter',
                    text: '用 CCW ID [id] 密码 [pwd] 登录，成功则返回 token',
                    allowDropAnywhere: 1,
                    arguments: {
                        id: {
                            type: 'string',
                            defaultValue: '202989238'
                        },
                        pwd: {
                            type: 'string',
                            defaultValue: '123456'
                        },
                    }
                },
                {
                    opcode: 'search',
                    blockType: 'reporter',
                    text: '搜索 [kw] 的 [search]',
                    allowDropAnywhere: 1,
                    arguments: {
                        kw: {
                            type: 'string',
                            defaultValue: 'Chen-Jin'
                        },
                        search: {
                            menu: 'search',
                            defaultValue: 'es_student/search'
                        },
                    }
                },
                {
                    opcode: 'getCoins',
                    blockType: 'reporter',
                    text: '用户金币数',
                    disableMonitor: 1,
                    arguments: {},
                },
                {
                    opcode: 'getUserInfo',
                    blockType: 'reporter',
                    text: '用户 OID [oid] 的 [info]',
                    allowDropAnywhere: 1,
                    arguments: {
                        info: {
                            menu: 'info'
                        },
                        oid: {
                            type: 'string',
                            defaultValue: '6107c5323e593a0c25f850f8',
                        }
                    }
                },
                {
                    opcode: 'userFetch',
                    blockType: 'reporter',
                    allowDropAnywhere: 1,
                    text: '[op] 用户 OID [oid]，返回结果',
                    arguments: {
                        op: {
                            menu: 'userOpFetch'
                        },
                        oid: {
                            type: 'string',
                            defaultValue: '6107c5323e593a0c25f850f8'
                        },
                    }
                },
                {
                    blockType: 'label',
                    text: '🌠 其他积木'
                },
                {
                    opcode: "device",
                    blockType: 'reporter',
                    text: "设备类型",
                },
                {
                    opcode: 'getUserInfoFromCCWAPI',
                    blockType: 'reporter',
                    text: '用户的 [infoName]',
                    arguments: {
                        infoName: {
                            menu: 'ccwAPIInfo'
                        }
                    }
                },
                {
                    opcode: 'getLastUsedOid',
                    blockType: 'reporter',
                    text: '最近使用用户的 OID'
                },
                {
                    opcode: "loadExtension",
                    blockType: 'command',
                    text: "从扩展 ID 或 URL 加载扩展 [ext] 并等待",
                    arguments: {
                        ext: {
                            type: 'string',
                            defaultValue: 'lpp'
                        }
                    }
                },
                {
                    opcode: 'uninstExtension',
                    blockType: 'command',
                    text: '清空积木并卸载扩展 ID [id]',
                    arguments: {
                        id: {
                            type: 'string',
                            defaultValue: 'lpp'
                        }
                    }
                },
                {
                    opcode: 'abpost',
                    blockType: 'reporter',
                    text: 'AB POST URL [url] Body [body]',
                    allowDropAnywhere: 1,
                    arguments: {
                        url: { type: 'string' },
                        body: { type: 'string' }
                    }
                },
                {
                    opcode: 'jsonRead',
                    blockType: 'reporter',
                    text: '读取 JSON [json] 的 [k] 返回类型 [t]',
                    allowDropAnywhere: 1,
                    arguments: {
                        json: {
                            type: 'string',
                            defaultValue: '{"a":{"b":{"c":true}}}'
                        },
                        k: {
                            type: 'string',
                            defaultValue: 'a.b.c'
                        },
                        t: { menu: 'jsonType' }
                    }
                },
                {
                    opcode: 'toJSON',
                    blockType: 'reporter',
                    text: '[obj] 转 JSON',
                },
                "---",
                {
                    opcode: 'nop',
                    text: '仅执行 [arg]',
                    blockType: 'command',
                },
            ],
            menus: {
                st: {
                    acceptReporters: 1,
                    items: [
                        {
                            value: 'PROFILE',
                            text: '用户'
                        },
                        {
                            value: 'HASH_TAG',
                            text: '星球'
                        },
                        {
                            value: 'TEAM',
                            text: 'Game Jam 战队'
                        },
                        {
                            value: 'CREATION',
                            text: '作品'
                        },
                        {
                            value: 'POST',
                            text: '文章'
                        },
                        // {
                        //     value: 'EXTENSION',
                        //     text: '扩展'
                        // },
                    ]
                },
                search: {
                    items: [
                        // {
                        //     value: 'search/all',
                        //     text: '综合'
                        // },
                        {
                            value: 'creation/search/page',
                            text: '作品'
                        },
                        {
                            value: 'hash_tag/search/v2',
                            text: '星球'
                        },
                        {
                            value: 'es_student/search',
                            text: '用户',
                        },
                        {
                            value: 'post/search',
                            text: '文章'
                        }
                    ]
                },
                info: {
                    acceptReporters: 1,
                    items: [
                        {
                            value: 'studentNumber',
                            text: 'UID'
                        },
                        {
                            value: 'studentOid',
                            text: 'OID'
                        },
                        {
                            value: 'name',
                            text: '名称'
                        },
                        {
                            value: 'bio',
                            text: '签名'
                        },
                        {
                            value: 'commentCount',
                            text: '留言数'
                        },
                        {
                            value: '-self',
                            text: '自我介绍'
                        },
                        {
                            value: 'studentCreatedDays',
                            text: '加入天数'
                        },
                        {
                            value: '-score',
                            text: '信誉分'
                        },
                        {
                            value: '-program',
                            text: '学过编程？'
                        },
                        {
                            value: 'lastLoginAt',
                            text: '最近活跃时间戳'
                        },
                        {
                            value: 'birthday',
                            text: '生日时间戳'
                        },
                        {
                            value: 'identityAuthRank',
                            text: '认证等级'
                        },
                        {
                            value: 'hideGender',
                            text: '隐藏性别？'
                        },
                        {
                            value: 'gender',
                            text: '性别'
                        },
                        {
                            value: 'avatar',
                            text: '头像链接'
                        },
                        {
                            value: '-language',
                            text: '学过的编程语言'
                        },
                        {
                            value: '-rank',
                            text: '信誉等级'
                        }
                    ]
                },
                ccwAPIInfo: {
                    acceptReporters: 1,
                    items: [
                        {
                            value: 'oid',
                            text: 'OID'
                        },
                        {
                            value: 'userId',
                            text: 'CCW ID'
                        },
                        {
                            value: 'userName',
                            text: '名称'
                        },
                        {
                            value: 'followers',
                            text: '粉丝数'
                        },
                        {
                            value: 'following',
                            text: '关注数'
                        },
                        {
                            value: 'score',
                            text: '信誉分'
                        }
                    ]
                },
                userOpFetch: {
                    items: [
                        {
                            value: 'study-community/following/follow',
                            text: '关注'
                        },
                        {
                            value: 'study-community/following/unfollow',
                            text: '取消关注'
                        },
                    ]
                },
                userOpAxios: {
                    items: [
                        {
                            value: 'student/block_record/create',
                            text: '加入黑名单'
                        },
                        {
                            value: 'student/block_record/delete',
                            text: '移出黑名单'
                        }
                    ]
                },
                change: {
                    acceptReporters: 1,
                    items: [
                        {
                            value: 'name',
                            text: '名称'
                        },
                        {
                            value: 'bio',
                            text: '签名'
                        },
                        {
                            value: 'selfIntroduction',
                            text: '自我介绍'
                        },
                        {
                            value: 'programmingCapability',
                            text: '学过编程？'
                        },
                        {
                            value: 'birthday',
                            text: '生日时间戳'
                        },
                        {
                            value: 'hideGender',
                            text: '隐藏性别？'
                        },
                        {
                            value: 'gender',
                            text: '性别'
                        },
                        {
                            value: 'avatar',
                            text: '头像链接'
                        },
                        {
                            value: 'learnedProgrammingLanguages',
                            text: '学过的编程语言'
                        },
                        {
                            value: 'qq',
                            text: 'QQ'
                        },
                        {
                            value: 'school',
                            text: '学校',
                        },
                        {
                            value: 'fullName',
                            text: '真名'
                        }
                    ]
                },
                jsonType: {
                    items: [
                        'JSON',
                        'Object'
                    ]
                },
                cdu: {
                    items: [
                        {
                            text: '用户数据库',
                            value: 'u'
                        },
                        {
                            text: '作品数据库',
                            value: 'p'
                        }
                    ]
                }
            }
        });
        this.device = rt.ccwAPI.getDeviceType;
        this.axiosDone = () => !!secretKey.done;
        this.escapeXml = (unsafe) => unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
        this.login = async ({id, pwd}) => {
            try {
                var r = await fetch("https://sso.ccw.site/web/auth/login-by-password", {
                    method: 'post',
                    body: JSON.stringify({
                        clientCode: 'STUDY_COMMUNITY',
                        loginKey: id,
                        password: pwd,
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
            } catch(e) {
                return "";
            }
            var json = await r.json();
            if (json.body) {
                return json.body.token;
            } else {
                return "";
            }
        }
        this.nop = () => undefined;
        this.comment = async ({st, oid, co, rid}) => {
            try {
                var result = await abfetch("https://community-web.ccw.site/comment/create", {
                    content: co,
                    replyToId: rid,
                    topic: {
                        outline: 'communityTest',
                        subjectOid: oid,
                        subjectType: st,
                    }
                })
                return result.id;
            } catch(e) {
                return "";
            }
        }
        this.search = async ({kw, search}) => {
            const r = await fetch(`https://community-web.ccw.site/${search}?page=1&sortType=DESC`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    keyword: kw,
                    page: 1
                })
            });
            const result = (await r.json()).body;
            return result ?? '';
        }
        this.loadExtension = ({ext}) => em.loadExtensionURL(ext);
        this.shortURL = async ({url}) => {
            try {
                return await abfetch("https://community-web.ccw.site/short_url/create", {originUrl: url});
            } catch(e) {
                return "";
            }
        }
        this.getCoins = async () => {
            try {
                var response = await fetch("https://community-web.ccw.site/currency/account/personal", {
                    method: 'post',
                    credentials: 'include'
                });
                var json = await response.json();
                if (json.body) {
                    return json.body.internalCurrencyBalance;
                } else {
                    return "";
                }
            } catch(e) {
                return "";
            }
        }
        rt.ccwAPI.getUserInfo().then(info => this.getUserInfoFromCCWAPI = ({infoName}) => {
            if (infoName === "score") {
                return info.reputationScore.score;
            } else {
                return info[infoName];
            }
        });
        this.getLastUsedOid = () => localStorage["gandi:lastUsedUserId"];
        this.getUserInfo = async ({oid, info}) => {
            var response = await fetch("https://community-web.ccw.site/students/profile", {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    studentOid: oid
                }),
            });
            var result = await response.json();
            if (result.body) {
                switch (info) {
                    case "-self": return result.body.extraInfo.selfIntroduction;
                    case "-program": return result.body.extraInfo.programmingCapability === "true";
                    case "-score": return result.body.reputationScore.score;
                    case "-language": return result.body.extraInfo.learnedProgrammingLanguages;
                    case "-rank": return result.body.reputationScore.rank;
                    default: return result.body[info];
                }
            } else {
                return "";
            }
        }
        this.userFetch = async ({oid, op}) => {
            try {
                var response = await fetch(`https://community-web.ccw.site/${op}`, {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        followingOid: oid
                    }),
                });
                var result = await response.json();
                if (result.body) {
                    return result.body;
                } else {
                    return "";
                }
            } catch(e) {
                return "";
            }
        }
        this.userAxios = async ({oid, op}) => {
            try {
                var result = await abfetch(`https://community-web.ccw.site/${op}`, {
                    studentOid: oid,
                });
                try {
                    return result;
                } catch(e) {
                    return "";
                }
            } catch(e) {
                return "";
            }
        }
        this.checkUpdate = async () => {
            let response;
            dyTexts[3] = '🧐 正在获取 URL';
            refreshBlocks();
            try {
                response = await fetch("https://cp.zeroink.dpdns.org/latestURL");
            } catch {
                try {
                    response = await fetch("https://communityplus.pages.dev/latestURL");
                } catch {}
            }
            if (response?.ok) {
                const url = await response.text();
                const extResponse = await fetch(url);
                const extScript = await extResponse.text();
                const latestVersion = extScript.split('"')[1];
                if (+latestVersion > +versionNumber) {
                    if (confirm("已检测到新版本，是否更新？\n确认后将删除所有使用此扩展的积木")) {
                        _uninst('communityPlus');
                        em.loadExtensionURL(url);
                    } else dyTexts[3] = "❌ 放弃更新";
                } else {
                    dyTexts[3] = "✅ 已是最新";
                }
            } else {
                dyTexts[3] = "❌ 检测失败";
            }
            refreshBlocks();
            setTimeout(() => {
                dyTexts[3] = "🔁 检测更新";
                refreshBlocks();
            }, 5000);
        }
        this.makeUpdateText = url => String.fromCharCode(Math.floor(Math.random() * 26 + 65)) + btoa(url)
        this.reply = ({content, id}) => {
            try {
                return abfetch("https://community-web.ccw.site/comment/reply", {
                    content,
                    replyToId: id,
                })
                    .then(_ => JSON.stringify(_));
            } catch(e) {
                return "";
            }
        }
        this.deleteComment = ({id}) => {
            try {
                return abfetch("https://community-web.ccw.site/study-community/comment/delete", { id })
                    .then(_ => !_.msg);
            } catch(e) {
                return "";
            }
        },
        this.change = ({key, value}) => {
            const obj = {};
            obj[key] = value;
            return abfetch("https://community-web.ccw.site/students/update", obj);
        }
        this.uninstExtension = ({id}) => _uninst(id);
        this.abpost = ({url, body}) => abfetch(url, body);
        this.jsonRead = ({json, k, t}) => {
            try {
                let obj = typeof json === "object" ? json : JSON.parse(json);
                const ks = k.toString().split(".");
                for (const n of ks) obj = obj[n];
                return typeof obj === "object" && t === "JSON" ? JSON.stringify(obj) : obj;
            } catch {
                return "";
            }
        }
        this.setCD = async ({k, oid, v, u}) => {
            try {
                await abfetch("https://community-web-cloud-database.ccw.site/cloud_variable/save", u === "u"
                  ? {
                        primaryKey: oid + "-u",
                        secondaryKey: (await rt.ccwAPI.getUserInfo()).userId,
                        value: { [k]: v }
                    }
                  : {
                        primaryKey: oid,
                        secondaryKey: k,
                        value: { v }
                    }, { version: '1.1' });
                return true;
            } catch { return false; }
        }
        this.toJSON = ({obj}) => { try { return JSON.stringify(obj); } catch { return ""; }};
        this.getCD = async ({k, oid, u}) => {
            try {
                return (await abfetch("https://community-web-cloud-database.ccw.site/cloud_variable/detail/v2", u === "u"
                  ? {
                        accessKey: oid,
                        primaryKey: oid + "-u",
                        secondaryKey: (await rt.ccwAPI.getUserInfo()).userId,
                        filterKeys: [k]
                    }
                  : {
                        accessKey: oid,
                        primaryKey: oid,
                        secondaryKey: k,
                        filterKeys: []
                    }, { version: '1.1' }))[u === "u" ? k : 'v'] ?? "";
            } catch { return ""; }
        }

        if (!rt.isPlayerOnly) this.checkUpdate();
    }
}

window.tempExt = {
  Extension: makeTheCommunityBetter,
  info: {
    name: '连接 社区+ v' + extVer,
    description: '更便捷的共创世界扩展语句及 APIs',
    extensionId: extId,
    iconURL: 'https://static.xiguacity.cn/h1t86b7fg6c7k36wnt0cb30m/static/assets/cover.0cb318c0.jpg',
    insetIconURL: icon,
    collaboratorList: [
      {
          collaborator: 'ZeroInk',
          collaboratorURL: 'mailto:zeroink32@outlook.com',
      },
    ],
    doc: 'https://getgandi.com/cn/extensions/kontakt',
  }
}

const _open = XMLHttpRequest.prototype.open;
if (!rt.isPlayerOnly) XMLHttpRequest.prototype.open = function(m, u, a) {
    if (u === "https://bfs-web.ccw.site/extensions/communityPlus") Object.defineProperty(this, "responseText", {
        get: () => JSON.stringify({
            body: {
                name: "连接社区+",
                publisher: { nickname: "ZeroInk" },
                publisherId: 1,
                stats: {
                    reviewCount: 0,
                    reviewTags: [
                        {
                            count: 100,
                            tag: "安全"
                        },
                    ]
                },
                versions: [
                    {
                        assetUri: em._customExtensionInfo.communityPlus.url,
                        version: extVer,
                    },
                ]
            },
            code: "200",
            msg: null,
            status: 200
        }),
        configurable: true,
    });
    return _open.call(this, m, u, a);
}