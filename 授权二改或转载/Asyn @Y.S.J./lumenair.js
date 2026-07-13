/**
 * =====================================================================
 *  LUMEN Air v1.0
 *  Gandi IDE / TurboWarp 自定义扩展（unsandboxed · 单文件）
 * ---------------------------------------------------------------------
 *  在舞台上方叠加一层 GPU 实时流体：涡度约束 + Jacobi 压力求解 +
 *  半拉格朗日平流 + 多级 Bloom 辉光，全部通过积木块驱动。
 *  31 块积木覆盖：注入 / 角色跟随 / 外力场 / 时间控制 / 双层文字 / 传感。
 *
 *  Air 为免费版本，持续维护；Pro 专业版规划中。
 *
 *  ―― 开发期变更记录（发布前内部版本号）――
 *  v2.6.1：治理大面积辉光颗粒感——Bloom 基准分辨率 192→288 并在
 *        末端追加两道平滑模糊（抹掉金字塔上采样颗粒），软化辉光
 *        阈值过渡（消除湍流中的阈值闪烁噪点），三档画质整体提升
 *        模拟/染料分辨率（减少涡流网格斑点）。
 *  v2.6：修复"平息流场"——残留压力场会在数帧内重新驱动流体，
 *        现连同压力场、风、力场一并清除，静止是真静止；新增四块
 *        面向实际作品的积木：全屏闪光（节奏打点）、流光浪潮（场景
 *        转场）、角色随流光漂移（流体推动玩法）、环境流光（一键氛围）。
 *  v2.5：固定文字层——独立于流体模拟渲染，与流体一同发光过
 *        Bloom，但任何搅动都无法撼动；与流动文字自由搭配。
 *  v2.4：文字三层辉光渲染 + 五种字体；新增"平息流场"积木与
 *        "流动惯性"参数——搅动产生的湍流可被立即或渐进平息，
 *        文字图章不再被残留漩涡撕成烟雾；鼠标搅动力度收敛。
 *  v2.3：力度/强度重新映射——同时驱动注入速度、光斑大小与亮度，
 *        0-100 全区间可感知（原实现速度被 clamp 掐死且不影响大小）；
 *        文字图章回归叠加式（重复执行辉光累积爆发后随消散减缓）。
 *  v2.2：线段 splat 着色器——光束/角色拖尾/鼠标搅动均为数学连续
 *        光带，零颗粒且光束可每帧调用；消散速度与帧率解耦（不同
 *        设备手感一致）；叠加层不再遮挡变量监视器；坐标允许越出
 *        舞台 25%（支持从屏幕外注入）。
 *  v2.0 新增：
 *   - 角色持续喷射（自动跟随角色移动产生拖尾）
 *   - 光束注入 / 流光写字（文字图章）
 *   - 全局风场、引力场/斥力场（最多 8 个）
 *   - 霓虹色域主题、暂停与模拟速度
 *   - 传感积木：读取任意点的流速与亮度（可驱动玩法）
 *
 *  透明性声明（供审核与用户查阅）：
 *   - 本扩展不发出任何网络请求
 *   - 不读取 cookie / localStorage / 账号数据
 *   - 对页面的唯一修改：在舞台画布旁创建一个 pointer-events:none 的
 *     叠加 canvas，随舞台缩放，关闭时完整移除
 *
 *  流体核心算法基于 Pavel Dobryakov 的 WebGL-Fluid-Simulation
 *  (https://github.com/PavelDoGreat/WebGL-Fluid-Simulation, MIT License)
 * =====================================================================
 */
(function (Scratch) {
  'use strict';

  if (!Scratch || !Scratch.extensions) return;
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('LUMEN Air 需要以非沙盒（unsandboxed）方式加载');
  }

  /* ================= 画质档位 ================= */
  const QUALITY = {
    '流畅': { sim: 112, dye: 400, bloomIter: 5 },
    '均衡': { sim: 144, dye: 576, bloomIter: 6 },
    '高清': { sim: 176, dye: 768, bloomIter: 7 },
  };

  /* ================= 霓虹色域主题 ================= */
  const THEMES = {
    '霓虹': [0.50, 0.58, 0.72, 0.83, 0.90, 0.33],
    '极光': [0.36, 0.42, 0.48, 0.52, 0.78],
    '熔岩': [0.99, 0.04, 0.07, 0.10, 0.13, 0.93],
    '寒冰': [0.52, 0.55, 0.58, 0.61, 0.64],
    '彩虹': null, // 全色域
  };
  let currentZones = THEMES['霓虹'];

  const MAX_FIELDS = 8;

  /* ================= 工具函数 ================= */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, Number(v) || 0)); }

  function hexToRgb01(c) {
    if (typeof c === 'number') c = '#' + (c >>> 0).toString(16).padStart(6, '0');
    const m = /^#?([0-9a-fA-F]{6})/.exec(String(c));
    if (!m) return { r: 0.4, g: 1, b: 1 };
    const n = parseInt(m[1], 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  }

  function hsv(h, s, v) {
    const i = Math.floor(h * 6), f = h * 6 - i;
    const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: return { r: v, g: t, b: p };
      case 1: return { r: q, g: v, b: p };
      case 2: return { r: p, g: v, b: t };
      case 3: return { r: p, g: q, b: v };
      case 4: return { r: t, g: p, b: v };
      default: return { r: v, g: p, b: q };
    }
  }

  let hueBase = Math.random();
  function neonColor() {
    hueBase = (hueBase + 0.07 + Math.random() * 0.1) % 1;
    let h;
    if (currentZones) {
      const zone = currentZones[Math.floor(Math.random() * currentZones.length)];
      h = (zone + (Math.random() - 0.5) * 0.06 + 1) % 1;
    } else {
      h = hueBase;
    }
    return hsv(h, 0.95, 1.0);
  }

  /* =====================================================================
     FluidEngine —— 独立的 WebGL 流体渲染器
     只依赖传入的 canvas，不触碰页面其它任何东西
  ===================================================================== */
  class FluidEngine {
    constructor(canvas, quality) {
      this.canvas = canvas;
      this.q = quality;
      this.ready = false;
      this.cfg = {
        densityDissipation: 0.988,
        velocityDissipation: 0.995,
        pressure: 0.82,
        pressureIter: 20,
        curl: 34,
        splatRadius: 0.3,
        bloomThreshold: 0.5,
        bloomKnee: 0.85,
        bloomIntensity: 0.75,
      };
      // 外力状态（由积木层写入）
      this.wind = { x: 0, y: 0 };
      this.fields = []; // {x, y, s}  s>0 斥力, s<0 引力
      this._fieldData = new Float32Array(MAX_FIELDS * 3);
      this._readDirty = true;
      this._readPixels = null;
      this._initGL();
      this._buildShaders();
      this._buildBlit();
    }

    _initGL() {
      const params = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      let gl = this.canvas.getContext('webgl2', params);
      this.isGL2 = !!gl;
      if (!gl) gl = this.canvas.getContext('webgl', params) || this.canvas.getContext('experimental-webgl', params);
      if (!gl) throw new Error('LUMEN: 当前环境不支持 WebGL');
      this.gl = gl;

      let halfFloat;
      if (this.isGL2) {
        gl.getExtension('EXT_color_buffer_float');
        // WebGL2 中 16F 纹理的线性过滤是核心功能，无需扩展
        this.supportLinear = true;
        this.blendMax = gl.MAX;
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        this.supportLinear = !!gl.getExtension('OES_texture_half_float_linear');
        const bm = gl.getExtension('EXT_blend_minmax');
        this.blendMax = bm ? bm.MAX_EXT : null;
      }
      this.halfFloatType = this.isGL2 ? gl.HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);

      const renderable = (internal, format, type) => {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.deleteFramebuffer(fbo); gl.deleteTexture(tex);
        return ok;
      };
      const getFormat = (internal, format, type) => {
        if (!renderable(internal, format, type)) {
          if (this.isGL2) {
            if (internal === gl.R16F) return getFormat(gl.RG16F, gl.RG, type);
            if (internal === gl.RG16F) return getFormat(gl.RGBA16F, gl.RGBA, type);
          }
          return null;
        }
        return { internalFormat: internal, format };
      };

      if (this.isGL2) {
        this.fmtRGBA = getFormat(gl.RGBA16F, gl.RGBA, this.halfFloatType);
        this.fmtRG = getFormat(gl.RG16F, gl.RG, this.halfFloatType);
        this.fmtR = getFormat(gl.R16F, gl.RED, this.halfFloatType);
      } else {
        this.fmtRGBA = getFormat(gl.RGBA, gl.RGBA, this.halfFloatType);
        this.fmtRG = this.fmtRGBA;
        this.fmtR = this.fmtRGBA;
      }
      if (!this.fmtRGBA) throw new Error('LUMEN: 找不到可渲染的浮点纹理格式');
    }

    _compile(type, src) {
      const gl = this.gl;
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error('LUMEN 着色器编译失败: ' + gl.getShaderInfoLog(s));
      }
      return s;
    }

    _program(vs, fsSrc) {
      const gl = this.gl;
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, this._compile(gl.FRAGMENT_SHADER, fsSrc));
      gl.bindAttribLocation(p, 0, 'aPosition');
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error('LUMEN 着色器链接失败: ' + gl.getProgramInfoLog(p));
      }
      const uniforms = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        let name = gl.getActiveUniform(p, i).name;
        const loc = gl.getUniformLocation(p, name);
        if (name.endsWith('[0]')) name = name.slice(0, -3); // uniform 数组
        uniforms[name] = loc;
      }
      return { p, uniforms, bind: () => gl.useProgram(p) };
    }

    _buildShaders() {
      const gl = this.gl;
      const baseVS = this._compile(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform vec2 texelSize;
        void main(){
          vUv = aPosition*0.5+0.5;
          vL = vUv - vec2(texelSize.x,0.0);
          vR = vUv + vec2(texelSize.x,0.0);
          vT = vUv + vec2(0.0,texelSize.y);
          vB = vUv - vec2(0.0,texelSize.y);
          gl_Position = vec4(aPosition,0.0,1.0);
        }`);

      this.pClear = this._program(baseVS, `
        precision mediump float; varying vec2 vUv;
        uniform sampler2D uTexture; uniform float value;
        void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`);

      this.pFill = this._program(baseVS, `
        precision mediump float; varying vec2 vUv;
        uniform sampler2D uTexture; uniform vec3 color;
        void main(){ gl_FragColor = vec4(texture2D(uTexture, vUv).rgb + color, 1.0); }`);

      this.pSplat = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio, radius;
        uniform vec2 point; uniform vec3 color;
        void main(){
          vec2 p = vUv - point; p.x *= aspectRatio;
          vec3 splat = exp(-dot(p,p)/radius) * color;
          gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
        }`);

      // 线段 splat：到线段的距离场高斯衰减，一次 pass 画出连续光带（零颗粒）
      this.pLineSplat = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio, radius;
        uniform vec2 pA, pB; uniform vec3 color;
        void main(){
          vec2 pa = vUv - pA;
          vec2 ba = pB - pA;
          pa.x *= aspectRatio; ba.x *= aspectRatio;
          float h = clamp(dot(pa,ba)/max(dot(ba,ba), 1e-9), 0.0, 1.0);
          vec2 d = pa - ba*h;
          vec3 splat = exp(-dot(d,d)/radius) * color;
          gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
        }`);

      this.pAdvection = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uVelocity, uSource;
        uniform vec2 texelSize, dyeTexelSize;
        uniform float dt, dissipation;
        ${this.supportLinear ? '' : `
        vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize){
          vec2 st = uv/tsize - 0.5;
          vec2 iuv = floor(st), fuv = fract(st);
          vec4 a = texture2D(sam,(iuv+vec2(0.5,0.5))*tsize);
          vec4 b = texture2D(sam,(iuv+vec2(1.5,0.5))*tsize);
          vec4 c = texture2D(sam,(iuv+vec2(0.5,1.5))*tsize);
          vec4 d = texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);
          return mix(mix(a,b,fuv.x), mix(c,d,fuv.x), fuv.y);
        }`}
        void main(){
          ${this.supportLinear
            ? `vec2 coord = vUv - dt*texture2D(uVelocity, vUv).xy*texelSize;
               vec4 result = texture2D(uSource, coord);`
            : `vec2 coord = vUv - dt*bilerp(uVelocity, vUv, texelSize).xy*texelSize;
               vec4 result = bilerp(uSource, coord, dyeTexelSize);`}
          gl_FragColor = dissipation * result;
        }`);

      // 外力场：全局风 + 最多 8 个点力场（s>0 排斥，s<0 吸引）
      this.pForces = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform vec2 uWind;
        uniform float uAspect, dt;
        uniform int uFieldCount;
        uniform vec3 uFields[${MAX_FIELDS}];
        void main(){
          vec2 f = uWind;
          for(int i=0;i<${MAX_FIELDS};i++){
            if(i>=uFieldCount) break;
            vec2 d = vUv - uFields[i].xy;
            d.x *= uAspect;
            float dist = max(length(d), 0.05);
            f += (d/dist) * uFields[i].z / (dist*dist*40.0 + 1.0);
          }
          vec2 vel = texture2D(uVelocity, vUv).xy + f*dt;
          vel = clamp(vel, -2200.0, 2200.0);
          gl_FragColor = vec4(vel, 0.0, 1.0);
        }`);

      this.pDivergence = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uVelocity;
        void main(){
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if(vL.x < 0.0) L = -C.x;
          if(vR.x > 1.0) R = -C.x;
          if(vT.y > 1.0) T = -C.y;
          if(vB.y < 0.0) B = -C.y;
          gl_FragColor = vec4(0.5*(R-L+T-B), 0.0, 0.0, 1.0);
        }`);

      this.pCurl = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uVelocity;
        void main(){
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          gl_FragColor = vec4(R-L-T+B, 0.0, 0.0, 1.0);
        }`);

      this.pVorticity = this._program(baseVS, `
        precision highp float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uVelocity, uCurl;
        uniform float curl, dt;
        void main(){
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
          force /= length(force)+0.0001;
          force *= curl*C; force.y *= -1.0;
          vec2 vel = texture2D(uVelocity, vUv).xy + force*dt;
          vel = clamp(vel, -2200.0, 2200.0);
          gl_FragColor = vec4(vel, 0.0, 1.0);
        }`);

      this.pPressure = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uPressure, uDivergence;
        void main(){
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float div = texture2D(uDivergence, vUv).x;
          gl_FragColor = vec4((L+R+B+T-div)*0.25, 0.0, 0.0, 1.0);
        }`);

      this.pGradient = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uPressure, uVelocity;
        void main(){
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R-L, T-B);
          gl_FragColor = vec4(vel, 0.0, 1.0);
        }`);

      // 文字/图章：把一张纹理的亮度作为遮罩，叠加进染料场
      // 重复执行会亮度累积触发强辉光，随后随消散减缓——这是特性
      this.pStamp = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uTarget, uStamp;
        uniform vec2 center, halfSize;
        uniform vec3 color;
        void main(){
          vec3 base = texture2D(uTarget, vUv).rgb;
          vec3 add = vec3(0.0);
          vec2 local = (vUv - center) / halfSize * 0.5 + 0.5;
          if(local.x >= 0.0 && local.x <= 1.0 && local.y >= 0.0 && local.y <= 1.0){
            add = color * texture2D(uStamp, vec2(local.x, 1.0-local.y)).r;
          }
          gl_FragColor = vec4(base + add, 1.0);
        }`);

      // 固定文字层：不经过流体模拟，直接加性绘制到独立 FBO
      this.pStampDraw = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uStamp;
        uniform vec2 center, halfSize;
        uniform vec3 color;
        void main(){
          vec2 local = (vUv - center) / halfSize * 0.5 + 0.5;
          float a = 0.0;
          if(local.x >= 0.0 && local.x <= 1.0 && local.y >= 0.0 && local.y <= 1.0)
            a = texture2D(uStamp, vec2(local.x, 1.0-local.y)).r;
          gl_FragColor = vec4(color * a, 1.0);
        }`);

      // 传感回读：rg=速度(编码), b=亮度（含固定文字层）
      this.pEncode = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uVelocity, uDye, uSolid;
        void main(){
          vec2 v = texture2D(uVelocity, vUv).xy;
          vec3 d = texture2D(uDye, vUv).rgb + texture2D(uSolid, vUv).rgb;
          vec2 e = clamp(v/1200.0*0.5+0.5, 0.0, 1.0);
          float br = clamp(max(d.r, max(d.g, d.b)), 0.0, 1.0);
          gl_FragColor = vec4(e, br, 1.0);
        }`);

      this.pBloomPre = this._program(baseVS, `
        precision mediump float; varying vec2 vUv;
        uniform sampler2D uTexture, uSolid;
        uniform vec3 curve; uniform float threshold;
        void main(){
          vec3 c = texture2D(uTexture, vUv).rgb + texture2D(uSolid, vUv).rgb;
          float br = max(c.r, max(c.g, c.b));
          float rq = clamp(br - curve.x, 0.0, curve.y);
          rq = curve.z * rq * rq;
          c *= max(rq, br - threshold) / max(br, 0.0001);
          gl_FragColor = vec4(c, 0.0);
        }`);

      this.pBloomBlur = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uTexture;
        void main(){
          vec4 sum = texture2D(uTexture,vL) + texture2D(uTexture,vR)
                   + texture2D(uTexture,vT) + texture2D(uTexture,vB);
          gl_FragColor = sum*0.25;
        }`);

      this.pBloomFinal = this._program(baseVS, `
        precision mediump float;
        varying vec2 vUv, vL, vR, vT, vB;
        uniform sampler2D uTexture; uniform float intensity;
        void main(){
          vec4 sum = texture2D(uTexture,vL) + texture2D(uTexture,vR)
                   + texture2D(uTexture,vT) + texture2D(uTexture,vB);
          gl_FragColor = sum*0.25*intensity;
        }`);

      this.pDisplay = this._program(baseVS, `
        precision highp float; varying vec2 vUv;
        uniform sampler2D uTexture, uBloom, uSolid;
        void main(){
          vec3 c = texture2D(uTexture, vUv).rgb + texture2D(uSolid, vUv).rgb;
          float lum = dot(c, vec3(0.299,0.587,0.114));
          c += c * smoothstep(0.3, 1.1, lum) * 0.4;
          vec3 bloom = pow(texture2D(uBloom, vUv).rgb, vec3(0.9));
          c += bloom;
          float noise = fract(sin(dot(vUv, vec2(12.9898,78.233)))*43758.5453);
          c += (noise-0.5)/512.0;
          gl_FragColor = vec4(c, 1.0);
        }`);
    }

    _buildBlit() {
      const gl = this.gl;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 3, 3, -1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      this.blit = (target) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
    }

    _createFBO(w, h, internal, format, type, filter) {
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture: tex, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach: (id) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; },
      };
    }

    _createDoubleFBO(w, h, i, f, t, filter) {
      let a = this._createFBO(w, h, i, f, t, filter);
      let b = this._createFBO(w, h, i, f, t, filter);
      return {
        width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return a; }, get write() { return b; },
        swap() { const tmp = a; a = b; b = tmp; },
      };
    }

    _getRes(base) {
      const gl = this.gl;
      const bw = Math.max(1, gl.drawingBufferWidth), bh = Math.max(1, gl.drawingBufferHeight);
      const aspect = bw / bh;
      const min = Math.round(base), max = Math.round(base * (aspect < 1 ? 1 / aspect : aspect));
      return bw > bh ? { w: max, h: min } : { w: min, h: max };
    }

    /** 外部每帧调用；尺寸变化时重建帧缓冲。w/h 过小时保持未就绪状态 */
    resizeIfNeeded(w, h) {
      if (w < 8 || h < 8) return;
      if (this.canvas.width === w && this.canvas.height === h && this.ready) return;
      this.canvas.width = w;
      this.canvas.height = h;
      this._initFramebuffers();
      this.ready = true;
    }

    _initFramebuffers() {
      const gl = this.gl, t = this.halfFloatType;
      const filter = this.supportLinear ? gl.LINEAR : gl.NEAREST;
      const sim = this._getRes(this.q.sim), d = this._getRes(this.q.dye);
      this.dye = this._createDoubleFBO(d.w, d.h, this.fmtRGBA.internalFormat, this.fmtRGBA.format, t, filter);
      this.velocity = this._createDoubleFBO(sim.w, sim.h, this.fmtRG.internalFormat, this.fmtRG.format, t, filter);
      this.divergence = this._createFBO(sim.w, sim.h, this.fmtR.internalFormat, this.fmtR.format, t, gl.NEAREST);
      this.curlFBO = this._createFBO(sim.w, sim.h, this.fmtR.internalFormat, this.fmtR.format, t, gl.NEAREST);
      this.pressure = this._createDoubleFBO(sim.w, sim.h, this.fmtR.internalFormat, this.fmtR.format, t, gl.NEAREST);

      const br = this._getRes(288);
      this.bloomFBO = this._createFBO(br.w, br.h, this.fmtRGBA.internalFormat, this.fmtRGBA.format, t, filter);
      this.bloomTemp = this._createFBO(br.w, br.h, this.fmtRGBA.internalFormat, this.fmtRGBA.format, t, filter);
      this.bloomChain = [];
      for (let i = 0; i < this.q.bloomIter; i++) {
        const w = br.w >> (i + 1), h = br.h >> (i + 1);
        if (w < 2 || h < 2) break;
        this.bloomChain.push(this._createFBO(w, h, this.fmtRGBA.internalFormat, this.fmtRGBA.format, t, filter));
      }

      // 固定文字层：独立于流体模拟，仅在内容变化时重绘
      this.solidFBO = this._createFBO(d.w, d.h, this.fmtRGBA.internalFormat, this.fmtRGBA.format, t, filter);
      this.solidDirty = true;

      // 传感回读缓冲（RGBA8，低分辨率）
      const rr = this._getRes(64);
      this.readFBO = this._createFBO(rr.w, rr.h, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gl.NEAREST);
      this._readPixels = new Uint8Array(rr.w * rr.h * 4);
      this._readDirty = true;
    }

    clear() {
      if (this.ready) this._initFramebuffers();
    }

    /** 速度场与压力场归零：画面保留，流动立即彻底静止。
        必须连压力一起清——残留压力梯度会在数帧内重新驱动流体 */
    calmVelocity() {
      if (!this.ready) return;
      const gl = this.gl;
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocity.read.fbo);
      gl.viewport(0, 0, this.velocity.width, this.velocity.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.velocity.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pressure.read.fbo);
      gl.viewport(0, 0, this.pressure.width, this.pressure.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pressure.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this._readDirty = true;
    }

    /** 全屏均匀加色（节奏打点/闪光） */
    fillDye(color) {
      if (!this.ready) return;
      const gl = this.gl, p = this.pFill;
      gl.disable(gl.BLEND);
      p.bind();
      gl.uniform1i(p.uniforms.uTexture, this.dye.read.attach(0));
      gl.uniform3f(p.uniforms.color, color.r, color.g, color.b);
      this.blit(this.dye.write); this.dye.swap();
      this._readDirty = true;
    }

    /** x/y 为 0..1 归一化坐标（y 向上），dx/dy 为速度，color 为 0..1 RGB */
    splat(x, y, dx, dy, color, radiusScale) {
      if (!this.ready) return;
      const gl = this.gl, p = this.pSplat;
      p.bind();
      gl.uniform1i(p.uniforms.uTarget, this.velocity.read.attach(0));
      gl.uniform1f(p.uniforms.aspectRatio, this.canvas.width / Math.max(1, this.canvas.height));
      gl.uniform2f(p.uniforms.point, x, y);
      gl.uniform3f(p.uniforms.color, dx, dy, 0);
      gl.uniform1f(p.uniforms.radius, (this.cfg.splatRadius / 100) * (radiusScale || 1));
      this.blit(this.velocity.write); this.velocity.swap();

      gl.uniform1i(p.uniforms.uTarget, this.dye.read.attach(0));
      gl.uniform3f(p.uniforms.color, color.r, color.g, color.b);
      this.blit(this.dye.write); this.dye.swap();
      this._readDirty = true;
    }

    /** 沿线段 (ax,ay)-(bx,by) 注入连续光带；dx/dy 为整段速度，2 次 blit 完成 */
    lineSplat(ax, ay, bx, by, dx, dy, color, radiusScale) {
      if (!this.ready) return;
      const gl = this.gl, p = this.pLineSplat;
      p.bind();
      gl.uniform1i(p.uniforms.uTarget, this.velocity.read.attach(0));
      gl.uniform1f(p.uniforms.aspectRatio, this.canvas.width / Math.max(1, this.canvas.height));
      gl.uniform2f(p.uniforms.pA, ax, ay);
      gl.uniform2f(p.uniforms.pB, bx, by);
      gl.uniform3f(p.uniforms.color, dx, dy, 0);
      gl.uniform1f(p.uniforms.radius, (this.cfg.splatRadius / 100) * (radiusScale || 1));
      this.blit(this.velocity.write); this.velocity.swap();

      gl.uniform1i(p.uniforms.uTarget, this.dye.read.attach(0));
      gl.uniform3f(p.uniforms.color, color.r, color.g, color.b);
      this.blit(this.dye.write); this.dye.swap();
      this._readDirty = true;
    }

    /** 把 2D 画布上传为图章纹理（调用方负责 deleteStampTexture） */
    createStampTexture(srcCanvas) {
      const gl = this.gl;
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
      return tex;
    }

    deleteStampTexture(tex) {
      try { this.gl.deleteTexture(tex); } catch (e) { /* 上下文可能已丢失 */ }
    }

    /** 重绘固定文字层：仅在增删时调用，静止时零开销 */
    renderSolid(stamps) {
      if (!this.ready) return;
      const gl = this.gl, p = this.pStampDraw;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.solidFBO.fbo);
      gl.viewport(0, 0, this.solidFBO.width, this.solidFBO.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (stamps.length) {
        p.bind();
        gl.blendFunc(gl.ONE, gl.ONE);
        // max 混合：文字交叠处取最亮值，叠多少层都不会爆白
        if (this.blendMax != null) gl.blendEquation(this.blendMax);
        gl.enable(gl.BLEND);
        for (const s of stamps) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, s.tex);
          gl.uniform1i(p.uniforms.uStamp, 0);
          gl.uniform2f(p.uniforms.center, s.cx, s.cy);
          gl.uniform2f(p.uniforms.halfSize, Math.max(s.halfW, 0.001), Math.max(s.halfH, 0.001));
          gl.uniform3f(p.uniforms.color, s.color.r, s.color.g, s.color.b);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        gl.disable(gl.BLEND);
        if (this.blendMax != null) gl.blendEquation(gl.FUNC_ADD); // 恢复，Bloom 依赖加法混合
      }
      this.solidDirty = false;
      this._readDirty = true;
    }

    /** 用 2D 画布内容作为遮罩，把颜色叠加印进染料场（用于流动文字） */
    stampCanvas(srcCanvas, cx, cy, halfW, halfH, color) {
      if (!this.ready) return;
      const gl = this.gl;
      gl.disable(gl.BLEND);
      const tex = this.createStampTexture(srcCanvas);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex);

      const p = this.pStamp;
      p.bind();
      gl.uniform1i(p.uniforms.uTarget, this.dye.read.attach(0));
      gl.uniform1i(p.uniforms.uStamp, 1);
      gl.uniform2f(p.uniforms.center, cx, cy);
      gl.uniform2f(p.uniforms.halfSize, Math.max(halfW, 0.001), Math.max(halfH, 0.001));
      gl.uniform3f(p.uniforms.color, color.r, color.g, color.b);
      this.blit(this.dye.write); this.dye.swap();
      gl.deleteTexture(tex);
      this._readDirty = true;
    }

    step(dt) {
      if (!this.ready) return;
      const gl = this.gl, cfg = this.cfg;
      // 耗散按 dt 指数补偿：60/120Hz 设备上消散手感一致
      const velDis = Math.pow(cfg.velocityDissipation, dt * 60);
      const dyeDis = Math.pow(cfg.densityDissipation, dt * 60);
      gl.disable(gl.BLEND);

      this.pCurl.bind();
      gl.uniform2f(this.pCurl.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(this.pCurl.uniforms.uVelocity, this.velocity.read.attach(0));
      this.blit(this.curlFBO);

      this.pVorticity.bind();
      gl.uniform2f(this.pVorticity.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(this.pVorticity.uniforms.uVelocity, this.velocity.read.attach(0));
      gl.uniform1i(this.pVorticity.uniforms.uCurl, this.curlFBO.attach(1));
      gl.uniform1f(this.pVorticity.uniforms.curl, cfg.curl);
      gl.uniform1f(this.pVorticity.uniforms.dt, dt);
      this.blit(this.velocity.write); this.velocity.swap();

      // 外力（风 + 点力场）；没有外力时跳过整个 pass
      const fc = Math.min(this.fields.length, MAX_FIELDS);
      if (fc > 0 || this.wind.x !== 0 || this.wind.y !== 0) {
        for (let i = 0; i < fc; i++) {
          const f = this.fields[i];
          this._fieldData[i * 3] = f.x;
          this._fieldData[i * 3 + 1] = f.y;
          this._fieldData[i * 3 + 2] = f.s;
        }
        const p = this.pForces;
        p.bind();
        gl.uniform2f(p.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
        gl.uniform1i(p.uniforms.uVelocity, this.velocity.read.attach(0));
        gl.uniform2f(p.uniforms.uWind, this.wind.x, this.wind.y);
        gl.uniform1f(p.uniforms.uAspect, this.canvas.width / Math.max(1, this.canvas.height));
        gl.uniform1f(p.uniforms.dt, dt);
        gl.uniform1i(p.uniforms.uFieldCount, fc);
        gl.uniform3fv(p.uniforms.uFields, this._fieldData);
        this.blit(this.velocity.write); this.velocity.swap();
      }

      this.pDivergence.bind();
      gl.uniform2f(this.pDivergence.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(this.pDivergence.uniforms.uVelocity, this.velocity.read.attach(0));
      this.blit(this.divergence);

      this.pClear.bind();
      gl.uniform1i(this.pClear.uniforms.uTexture, this.pressure.read.attach(0));
      gl.uniform1f(this.pClear.uniforms.value, cfg.pressure);
      this.blit(this.pressure.write); this.pressure.swap();

      this.pPressure.bind();
      gl.uniform2f(this.pPressure.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(this.pPressure.uniforms.uDivergence, this.divergence.attach(0));
      for (let i = 0; i < cfg.pressureIter; i++) {
        gl.uniform1i(this.pPressure.uniforms.uPressure, this.pressure.read.attach(1));
        this.blit(this.pressure.write); this.pressure.swap();
      }

      this.pGradient.bind();
      gl.uniform2f(this.pGradient.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(this.pGradient.uniforms.uPressure, this.pressure.read.attach(0));
      gl.uniform1i(this.pGradient.uniforms.uVelocity, this.velocity.read.attach(1));
      this.blit(this.velocity.write); this.velocity.swap();

      const adv = this.pAdvection;
      adv.bind();
      gl.uniform2f(adv.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      if (!this.supportLinear) gl.uniform2f(adv.uniforms.dyeTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
      gl.uniform1i(adv.uniforms.uVelocity, this.velocity.read.attach(0));
      gl.uniform1i(adv.uniforms.uSource, this.velocity.read.attach(0));
      gl.uniform1f(adv.uniforms.dt, dt);
      gl.uniform1f(adv.uniforms.dissipation, velDis);
      this.blit(this.velocity.write); this.velocity.swap();

      if (!this.supportLinear) gl.uniform2f(adv.uniforms.dyeTexelSize, this.dye.texelSizeX, this.dye.texelSizeY);
      gl.uniform1i(adv.uniforms.uVelocity, this.velocity.read.attach(0));
      gl.uniform1i(adv.uniforms.uSource, this.dye.read.attach(1));
      gl.uniform1f(adv.uniforms.dissipation, dyeDis);
      this.blit(this.dye.write); this.dye.swap();
      this._readDirty = true;
    }

    /** 惰性回读传感数据；每帧最多一次 readPixels */
    _refreshRead() {
      if (!this.ready || !this._readDirty) return;
      const gl = this.gl, p = this.pEncode;
      p.bind();
      gl.uniform1i(p.uniforms.uVelocity, this.velocity.read.attach(0));
      gl.uniform1i(p.uniforms.uDye, this.dye.read.attach(1));
      gl.uniform1i(p.uniforms.uSolid, this.solidFBO.attach(2));
      this.blit(this.readFBO);
      gl.readPixels(0, 0, this.readFBO.width, this.readFBO.height, gl.RGBA, gl.UNSIGNED_BYTE, this._readPixels);
      this._readDirty = false;
    }

    /** 返回 {vx, vy, brightness}，vx/vy 为模拟速度单位，brightness 0..1 */
    sample(nx, ny) {
      if (!this.ready) return { vx: 0, vy: 0, brightness: 0 };
      this._refreshRead();
      const w = this.readFBO.width, h = this.readFBO.height;
      const px = Math.min(w - 1, Math.max(0, Math.floor(nx * w)));
      const py = Math.min(h - 1, Math.max(0, Math.floor(ny * h)));
      const i = (py * w + px) * 4;
      return {
        vx: (this._readPixels[i] / 255 - 0.5) * 2 * 1200,
        vy: (this._readPixels[i + 1] / 255 - 0.5) * 2 * 1200,
        brightness: this._readPixels[i + 2] / 255,
      };
    }

    _applyBloom() {
      const gl = this.gl, cfg = this.cfg;
      if (this.bloomChain.length < 2) return;
      gl.disable(gl.BLEND);

      this.pBloomPre.bind();
      const knee = cfg.bloomThreshold * cfg.bloomKnee + 0.0001;
      gl.uniform3f(this.pBloomPre.uniforms.curve, cfg.bloomThreshold - knee, knee * 2, 0.25 / knee);
      gl.uniform1f(this.pBloomPre.uniforms.threshold, cfg.bloomThreshold);
      gl.uniform1i(this.pBloomPre.uniforms.uTexture, this.dye.read.attach(0));
      gl.uniform1i(this.pBloomPre.uniforms.uSolid, this.solidFBO.attach(1));
      this.blit(this.bloomFBO);
      let last = this.bloomFBO;

      this.pBloomBlur.bind();
      for (let i = 0; i < this.bloomChain.length; i++) {
        const dest = this.bloomChain[i];
        gl.uniform2f(this.pBloomBlur.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(this.pBloomBlur.uniforms.uTexture, last.attach(0));
        this.blit(dest); last = dest;
      }

      gl.blendFunc(gl.ONE, gl.ONE);
      gl.enable(gl.BLEND);
      for (let i = this.bloomChain.length - 2; i >= 0; i--) {
        const base = this.bloomChain[i];
        gl.uniform2f(this.pBloomBlur.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(this.pBloomBlur.uniforms.uTexture, last.attach(0));
        this.blit(base); last = base;
      }
      gl.disable(gl.BLEND);

      this.pBloomFinal.bind();
      gl.uniform2f(this.pBloomFinal.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(this.pBloomFinal.uniforms.uTexture, last.attach(0));
      gl.uniform1f(this.pBloomFinal.uniforms.intensity, cfg.bloomIntensity);
      this.blit(this.bloomFBO);

      // 末端两道平滑：抹掉金字塔上采样在大面积辉光上留下的颗粒/菱形纹
      this.pBloomBlur.bind();
      gl.uniform2f(this.pBloomBlur.uniforms.texelSize, this.bloomFBO.texelSizeX, this.bloomFBO.texelSizeY);
      gl.uniform1i(this.pBloomBlur.uniforms.uTexture, this.bloomFBO.attach(0));
      this.blit(this.bloomTemp);
      gl.uniform1i(this.pBloomBlur.uniforms.uTexture, this.bloomTemp.attach(0));
      this.blit(this.bloomFBO);
    }

    render() {
      if (!this.ready) return;
      const gl = this.gl;
      this._applyBloom();
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.pDisplay.bind();
      gl.uniform1i(this.pDisplay.uniforms.uTexture, this.dye.read.attach(0));
      gl.uniform1i(this.pDisplay.uniforms.uBloom, this.bloomFBO.attach(1));
      gl.uniform1i(this.pDisplay.uniforms.uSolid, this.solidFBO.attach(2));
      this.blit(null);
    }

    destroy() {
      const lc = this.gl.getExtension('WEBGL_lose_context');
      if (lc) lc.loseContext();
    }
  }

  /* =====================================================================
     LumenExtension —— 积木层
  ===================================================================== */
  class LumenExtension {
    constructor() {
      this.engine = null;
      this.overlay = null;
      this.rafId = 0;
      this.lastT = 0;
      this.stir = false;
      this._stirLast = null;
      this.simRunning = true;
      this.simSpeed = 1;
      this.emitters = new Map(); // target.id -> {target, color, power, last}
      this.solidStamps = []; // 固定文字 {tex, cx, cy, halfW, halfH, color}
      this.waves = []; // 转场浪潮 {d, color, t0, dur}
      this.ambient = { on: false, power: 50 }; // 环境流光
      this._lastAmbient = 0;
      this._ambientCount = 0;
      this._textCanvas = null;
      this._hookedStop = false;
      this._onPointerMove = this._onPointerMove.bind(this);
      this._loop = this._loop.bind(this);
    }

    getInfo() {
      return {
        id: 'lumenair',
        name: 'LUMEN Air',
        menuIconURI: 'data:image/png;base64,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',
        blockIconURI: 'data:image/png;base64,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',
        color1: '#4dd8e6',
        color2: '#2fb3c4',
        blocks: [
          {
            opcode: 'enableLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: '开启流光层 画质 [QUALITY]',
            arguments: {
              QUALITY: { type: Scratch.ArgumentType.STRING, menu: 'QUALITY', defaultValue: '均衡' },
            },
          },
          { opcode: 'disableLayer', blockType: Scratch.BlockType.COMMAND, text: '关闭流光层' },
          { opcode: 'clearLayer', blockType: Scratch.BlockType.COMMAND, text: '清空流光' },
          { opcode: 'calmFlow', blockType: Scratch.BlockType.COMMAND, text: '平息流场 (画面保留 流动静止)' },
          {
            opcode: 'setSimState',
            blockType: Scratch.BlockType.COMMAND,
            text: '模拟 [RUNSTATE]',
            arguments: {
              RUNSTATE: { type: Scratch.ArgumentType.STRING, menu: 'RUNSTATE', defaultValue: '继续' },
            },
          },
          '---',
          {
            opcode: 'splatAt',
            blockType: Scratch.BlockType.COMMAND,
            text: '在 x [X] y [Y] 朝方向 [DIR] 注入颜色 [COLOR] 力度 [POWER]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              DIR: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#66ffff' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 },
            },
          },
          {
            opcode: 'splatRandom',
            blockType: Scratch.BlockType.COMMAND,
            text: '在 x [X] y [Y] 注入随机霓虹 力度 [POWER]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 },
            },
          },
          {
            opcode: 'burstAt',
            blockType: Scratch.BlockType.COMMAND,
            text: '在 x [X] y [Y] 引爆冲击环 强度 [POWER]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          {
            opcode: 'beam',
            blockType: Scratch.BlockType.COMMAND,
            text: '从 x [X1] y [Y1] 到 x [X2] y [Y2] 拉一道流光 颜色 [COLOR] 力度 [POWER]',
            arguments: {
              X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: -150 },
              Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 },
              Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#c17bff' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 40 },
            },
          },
          {
            opcode: 'stampText',
            blockType: Scratch.BlockType.COMMAND,
            text: '用流光写下 [TEXT] 在 x [X] y [Y] 字号 [SIZE] 颜色 [COLOR] 字体 [FONT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'LUMEN' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#66ffff' },
              FONT: { type: Scratch.ArgumentType.STRING, menu: 'FONT', defaultValue: '黑体' },
            },
          },
          {
            opcode: 'stampSolid',
            blockType: Scratch.BlockType.COMMAND,
            text: '写下固定文字 [TEXT] 在 x [X] y [Y] 字号 [SIZE] 颜色 [COLOR] 字体 [FONT] (不被搅动)',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'LUMEN' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffd27b' },
              FONT: { type: Scratch.ArgumentType.STRING, menu: 'FONT', defaultValue: '黑体' },
            },
          },
          { opcode: 'clearSolid', blockType: Scratch.BlockType.COMMAND, text: '擦除所有固定文字' },
          '---',
          {
            opcode: 'flashAll',
            blockType: Scratch.BlockType.COMMAND,
            text: '全屏闪光 颜色 [COLOR] 强度 [POWER]',
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#66ffff' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 40 },
            },
          },
          {
            opcode: 'wave',
            blockType: Scratch.BlockType.COMMAND,
            text: '流光浪潮 从 [EDGE] 扫过 颜色 [COLOR] 用时 [DUR] 秒',
            arguments: {
              EDGE: { type: Scratch.ArgumentType.STRING, menu: 'EDGE', defaultValue: '左' },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#66ffff' },
              DUR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.2 },
            },
          },
          {
            opcode: 'driftSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: '让此角色随流光漂移 灵敏度 [SENS]',
            arguments: {
              SENS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          {
            opcode: 'setAmbient',
            blockType: Scratch.BlockType.COMMAND,
            text: '环境流光 [SWITCH] 活跃度 [POWER]',
            arguments: {
              SWITCH: { type: Scratch.ArgumentType.STRING, menu: 'SWITCH', defaultValue: '开启' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          '---',
          {
            opcode: 'emitStart',
            blockType: Scratch.BlockType.COMMAND,
            text: '让此角色持续喷射 颜色 [COLOR] 力度 [POWER]',
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#66ffff' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 25 },
            },
          },
          { opcode: 'emitStop', blockType: Scratch.BlockType.COMMAND, text: '让此角色停止喷射' },
          { opcode: 'emitStopAll', blockType: Scratch.BlockType.COMMAND, text: '停止所有角色喷射' },
          '---',
          {
            opcode: 'setWind',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置风 方向 [DIR] 强度 [POWER]',
            arguments: {
              DIR: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 },
            },
          },
          { opcode: 'clearWind', blockType: Scratch.BlockType.COMMAND, text: '关闭风' },
          {
            opcode: 'addField',
            blockType: Scratch.BlockType.COMMAND,
            text: '在 x [X] y [Y] 放置 [FTYPE] 强度 [POWER]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              FTYPE: { type: Scratch.ArgumentType.STRING, menu: 'FTYPE', defaultValue: '引力场' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          { opcode: 'clearFields', blockType: Scratch.BlockType.COMMAND, text: '清除所有力场' },
          '---',
          {
            opcode: 'setStir',
            blockType: Scratch.BlockType.COMMAND,
            text: '鼠标搅动 [SWITCH]',
            arguments: {
              SWITCH: { type: Scratch.ArgumentType.STRING, menu: 'SWITCH', defaultValue: '开启' },
            },
          },
          {
            opcode: 'setTheme',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置霓虹色域 [THEME]',
            arguments: {
              THEME: { type: Scratch.ArgumentType.STRING, menu: 'THEME', defaultValue: '霓虹' },
            },
          },
          {
            opcode: 'setParam',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置 [PARAM] 为 [VALUE] (0-100)',
            arguments: {
              PARAM: { type: Scratch.ArgumentType.STRING, menu: 'PARAM', defaultValue: '辉光强度' },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          {
            opcode: 'setBlend',
            blockType: Scratch.BlockType.COMMAND,
            text: '图层混合模式设为 [BLEND]',
            arguments: {
              BLEND: { type: Scratch.ArgumentType.STRING, menu: 'BLEND', defaultValue: '发光叠加' },
            },
          },
          '---',
          {
            opcode: 'getVelX',
            blockType: Scratch.BlockType.REPORTER,
            text: '流速x 于 x [X] y [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: 'getVelY',
            blockType: Scratch.BlockType.REPORTER,
            text: '流速y 于 x [X] y [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: 'getBrightness',
            blockType: Scratch.BlockType.REPORTER,
            text: '流光亮度 于 x [X] y [Y] (0-100)',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          { opcode: 'isOn', blockType: Scratch.BlockType.BOOLEAN, text: '流光层已开启?' },
        ],
        menus: {
          QUALITY: { acceptReporters: true, items: Object.keys(QUALITY) },
          SWITCH: { acceptReporters: true, items: ['开启', '关闭'] },
          RUNSTATE: { acceptReporters: true, items: ['继续', '暂停'] },
          FTYPE: { acceptReporters: true, items: ['引力场', '斥力场'] },
          EDGE: { acceptReporters: true, items: ['左', '右', '上', '下'] },
          FONT: { acceptReporters: true, items: ['黑体', '圆体', '衬线', '楷体', '等宽'] },
          THEME: { acceptReporters: true, items: Object.keys(THEMES) },
          PARAM: { acceptReporters: true, items: ['消散速度', '漩涡强度', '流动惯性', '辉光强度', '注入半径', '模拟速度', '图层不透明度'] },
          BLEND: { acceptReporters: true, items: ['发光叠加', '不透明覆盖'] },
        },
      };
    }

    /* ---------- 舞台与叠加层 ---------- */
    _stageCanvas() {
      try {
        const vm = Scratch.vm;
        return (vm && vm.runtime && vm.runtime.renderer && vm.runtime.renderer.canvas) || null;
      } catch (e) { return null; }
    }

    _syncOverlay() {
      const stage = this._stageCanvas();
      const o = this.overlay;
      if (!stage || !o || !this.engine) return;
      if (stage.parentElement &&
          (o.parentElement !== stage.parentElement || o.previousElementSibling !== stage)) {
        if (stage.insertAdjacentElement) stage.insertAdjacentElement('afterend', o);
        else stage.parentElement.appendChild(o);
      }
      const w = stage.clientWidth, h = stage.clientHeight;
      o.style.left = stage.offsetLeft + 'px';
      o.style.top = stage.offsetTop + 'px';
      o.style.width = w + 'px';
      o.style.height = h + 'px';
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.engine.resizeIfNeeded(Math.floor(w * dpr), Math.floor(h * dpr));
    }

    /* ---------- 角色喷射 ---------- */
    _updateEmitters(dt) {
      if (!this.engine || this.emitters.size === 0) return;
      let targets = null;
      try { targets = Scratch.vm.runtime.targets; } catch (e) { /* 测试环境 */ }
      for (const [id, em] of this.emitters) {
        const t = em.target;
        // 角色被删除时自动清理
        if (Array.isArray(targets) && targets.indexOf(t) === -1) { this.emitters.delete(id); continue; }
        const p = this._toNorm(t.x, t.y);
        const last = em.last || p;
        em.last = p;
        // 速度取自角色位移，静止时给一点上升的余温
        let dx = (p.x - last.x) * 60 / Math.max(dt, 1 / 240) * em.power * 0.4;
        let dy = (p.y - last.y) * 60 / Math.max(dt, 1 / 240) * em.power * 0.4;
        const speed = Math.hypot(dx, dy);
        const cap = em.power * 20;
        if (speed > cap) { dx = dx / speed * cap; dy = dy / speed * cap; }
        if (speed < 1) { dy = em.power * 5; }
        // 上一帧位置到当前位置的连续光带：快速移动也不会出现断点拖尾
        // 力度同时决定拖尾亮度与粗细
        const eg = 0.05 + em.power / 100 * 0.28;
        this.engine.lineSplat(last.x, last.y, p.x, p.y, dx, dy,
          { r: em.color.r * eg, g: em.color.g * eg, b: em.color.b * eg },
          0.35 + em.power / 100 * 1.1);
      }
    }

    /* ---------- 主循环 ---------- */
    _loop(now) {
      if (!this.engine) return;
      const rawDt = Math.min((now - (this.lastT || now)) / 1000, 1 / 30);
      this.lastT = now;
      this._syncOverlay();
      // 尺寸变化重建帧缓冲后，固定文字层需要重绘
      if (this.engine.ready && this.engine.solidDirty) this.engine.renderSolid(this.solidStamps);
      const dt = rawDt * this.simSpeed;
      if (this.simRunning && dt > 0) {
        this._updateAmbient(now);
        this._updateWaves(now);
        this._updateEmitters(dt);
        this.engine.step(dt);
      }
      this.engine.render();
      this.rafId = requestAnimationFrame(this._loop);
    }

    /* ---------- 坐标转换：Scratch 坐标 → 归一化（y 向上） ----------
       允许越出舞台 25%，支持从屏幕外发射光束/注入 */
    _toNorm(x, y) {
      return {
        x: clamp((Number(x) + 240) / 480, -0.25, 1.25),
        y: clamp((Number(y) + 180) / 360, -0.25, 1.25),
      };
    }

    /* ---------- 鼠标搅动 ---------- */
    _onPointerMove(e) {
      if (!this.stir || !this.engine || !this.overlay) return;
      const rect = this.overlay.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1 - (e.clientY - rect.top) / rect.height;
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) { this._stirLast = null; return; }
      const last = this._stirLast;
      this._stirLast = { x: nx, y: ny };
      if (!last) return;
      // 力度收敛：搅动是点缀，不该把整个流场搅成持续湍流
      const dx = (nx - last.x) * 5500, dy = (ny - last.y) * 5500;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      const c = neonColor();
      // 连续光带：鼠标甩得再快也不断线
      this.engine.lineSplat(last.x, last.y, nx, ny, dx, dy,
        { r: c.r * 0.18, g: c.g * 0.18, b: c.b * 0.18 }, 0.6);
    }

    /* ---------- 红色停止按钮：清理动态状态，保留图层 ---------- */
    _hookStopAll() {
      if (this._hookedStop) return;
      try {
        Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
          this.emitters.clear();
          this.stir = false;
          this._stirLast = null;
          this.waves.length = 0;
          this.ambient.on = false;
          if (this.engine) {
            this.engine.wind.x = 0; this.engine.wind.y = 0;
            this.engine.fields.length = 0;
          }
        });
        this._hookedStop = true;
      } catch (e) { /* 测试环境无事件系统 */ }
    }

    /* ================= 积木实现 ================= */
    enableLayer(args) {
      const q = QUALITY[args.QUALITY] || QUALITY['均衡'];
      // 保留已登记的角色喷射：绿旗同时触发多个脚本时顺序不定，
      // "让此角色持续喷射"可能先于"开启流光层"执行，不能被重置抹掉
      const keepEmitters = new Map(this.emitters);
      this.disableLayer();
      for (const em of keepEmitters.values()) em.last = null;
      this.emitters = keepEmitters;
      const stage = this._stageCanvas();
      if (!stage) {
        console.warn('LUMEN: 找不到舞台画布，流光层未开启');
        return;
      }
      const o = document.createElement('canvas');
      o.className = 'lumen-overlay';
      // 不设 z-index：紧跟舞台画布之后插入，天然位于舞台之上、
      // 变量监视器/询问框等后续兄弟节点之下
      o.style.cssText =
        'position:absolute;pointer-events:none;mix-blend-mode:screen;';
      if (stage.insertAdjacentElement) stage.insertAdjacentElement('afterend', o);
      else (stage.parentElement || document.body).appendChild(o);
      this.overlay = o;
      try {
        this.engine = new FluidEngine(o, q);
      } catch (e) {
        console.error('LUMEN: 初始化失败', e);
        o.remove();
        this.overlay = null;
        this.engine = null;
        return;
      }
      window.addEventListener('pointermove', this._onPointerMove);
      this._hookStopAll();
      this.lastT = 0;
      this.simRunning = true;
      this._syncOverlay();
      this.rafId = requestAnimationFrame(this._loop);
    }

    disableLayer() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      window.removeEventListener('pointermove', this._onPointerMove);
      if (this.engine) {
        for (const s of this.solidStamps) this.engine.deleteStampTexture(s.tex);
        this.engine.destroy();
        this.engine = null;
      }
      this.solidStamps.length = 0;
      if (this.overlay) { this.overlay.remove(); this.overlay = null; }
      this._stirLast = null;
      this.emitters.clear();
    }

    clearLayer() {
      if (this.engine) this.engine.clear();
    }

    calmFlow() {
      if (!this.engine) return;
      // 彻底静止 = 速度+压力归零，并撤掉持续外力（风/力场），否则下一帧又动起来
      this.engine.calmVelocity();
      this.engine.wind.x = 0;
      this.engine.wind.y = 0;
      this.engine.fields.length = 0;
    }

    flashAll(args) {
      if (!this.engine) return;
      const g = clamp(args.POWER, 0, 100) / 100 * 0.6;
      const c = hexToRgb01(args.COLOR);
      this.engine.fillDye({ r: c.r * g, g: c.g * g, b: c.b * g });
    }

    wave(args) {
      if (!this.engine) return;
      const dirMap = { '左': { x: 1, y: 0 }, '右': { x: -1, y: 0 }, '上': { x: 0, y: -1 }, '下': { x: 0, y: 1 } };
      this.waves.push({
        d: dirMap[args.EDGE] || dirMap['左'],
        color: hexToRgb01(args.COLOR),
        t0: performance.now(),
        dur: clamp(args.DUR, 0.2, 10) * 1000,
      });
    }

    _updateWaves(now) {
      if (!this.engine || !this.engine.ready || this.waves.length === 0) return;
      for (let i = this.waves.length - 1; i >= 0; i--) {
        const w = this.waves[i];
        const u = (now - w.t0) / w.dur;
        if (u >= 1) { this.waves.splice(i, 1); continue; }
        const pos = -0.15 + u * 1.3; // 从舞台外扫入再扫出
        let ax, ay, bx, by;
        if (w.d.x !== 0) { const x = w.d.x > 0 ? pos : 1 - pos; ax = x; bx = x; ay = -0.1; by = 1.1; }
        else { const y = w.d.y > 0 ? pos : 1 - pos; ax = -0.1; bx = 1.1; ay = y; by = y; }
        // 双层波前：锐利亮芯在前（低速度，不被自己推糊），柔和光晕拖后（承担推力）
        const lag = 0.035;
        const ox = -w.d.x * lag, oy = -w.d.y * lag;
        const gGlow = 0.16;
        this.engine.lineSplat(ax + ox, ay + oy, bx + ox, by + oy,
          w.d.x * 900, w.d.y * 900,
          { r: w.color.r * gGlow, g: w.color.g * gGlow, b: w.color.b * gGlow }, 0.9);
        this.engine.lineSplat(ax, ay, bx, by,
          w.d.x * 220, w.d.y * 220,
          { r: w.color.r * 0.55 + 0.25, g: w.color.g * 0.55 + 0.25, b: w.color.b * 0.55 + 0.25 }, 0.22);
      }
    }

    /** 流体推动角色：放进重复执行里，角色就会被流场带着走 */
    driftSprite(args, util) {
      if (!this.engine || !util || !util.target || util.target.isStage) return;
      const t = util.target;
      const p = this._toNorm(t.x, t.y);
      const v = this.engine.sample(
        Math.max(0, Math.min(1, p.x)), Math.max(0, Math.min(1, p.y)));
      const k = clamp(args.SENS, 0, 100) / 100 * 0.12;
      const nx = t.x + v.vx / 55 * k, ny = t.y + v.vy / 55 * k;
      if (typeof t.setXY === 'function') t.setXY(nx, ny);
      else { t.x = nx; t.y = ny; }
    }

    setAmbient(args) {
      this.ambient.on = args.SWITCH === '开启';
      this.ambient.power = clamp(args.POWER, 0, 100);
    }

    _updateAmbient(now) {
      if (!this.ambient.on || !this.engine || !this.engine.ready) return;
      const interval = 2400 - this.ambient.power * 20; // 活跃度 100 → 每 400ms 一次
      if (now - this._lastAmbient < interval) return;
      this._lastAmbient = now;
      this._ambientCount++;
      this.splatRandom({
        X: Math.random() * 440 - 220,
        Y: Math.random() * 300 - 150,
        POWER: 12 + this.ambient.power * 0.3 + Math.random() * 15,
      });
    }

    setSimState(args) {
      this.simRunning = args.RUNSTATE !== '暂停';
    }

    /* 力度 0-100 同时驱动三个维度：注入速度、光斑大小、染料亮度。
       速度上限 2200 与着色器 clamp 对齐，保证全区间可感知。 */
    splatAt(args) {
      if (!this.engine) return;
      const p = this._toNorm(args.X, args.Y);
      const power = clamp(args.POWER, 0, 100);
      const vel = power * 22;
      const rad = (Number(args.DIR) || 0) * Math.PI / 180;
      // Scratch 方向：0=上，90=右，顺时针
      const dx = Math.sin(rad) * vel, dy = Math.cos(rad) * vel;
      const c = hexToRgb01(args.COLOR);
      const g = 0.12 + power / 100 * 0.55;
      this.engine.splat(p.x, p.y, dx, dy,
        { r: c.r * g, g: c.g * g, b: c.b * g }, 0.5 + power / 100 * 1.7);
    }

    splatRandom(args) {
      if (!this.engine) return;
      const p = this._toNorm(args.X, args.Y);
      const power = clamp(args.POWER, 0, 100);
      const vel = power * 22;
      const a = Math.random() * Math.PI * 2;
      const c = neonColor();
      const g = 0.10 + power / 100 * 0.5;
      this.engine.splat(p.x, p.y, Math.cos(a) * vel, Math.sin(a) * vel,
        { r: c.r * g, g: c.g * g, b: c.b * g }, 0.5 + power / 100 * 1.7);
    }

    burstAt(args) {
      if (!this.engine) return;
      const p = this._toNorm(args.X, args.Y);
      const power = clamp(args.POWER, 0, 100);
      const force = power * 20;
      const g = 0.10 + power / 100 * 0.30;
      const radScale = 0.8 + power / 100 * 2.0;
      const count = 14;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const c = neonColor();
        this.engine.splat(p.x, p.y, Math.cos(a) * force, Math.sin(a) * force,
          { r: c.r * g, g: c.g * g, b: c.b * g }, radScale);
      }
    }

    beam(args) {
      if (!this.engine) return;
      const a = this._toNorm(args.X1, args.Y1);
      const b = this._toNorm(args.X2, args.Y2);
      const power = clamp(args.POWER, 0, 100);
      const vel = power * 16;
      const c = hexToRgb01(args.COLOR);
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const g = 0.12 + power / 100 * 0.5;
      // 单次 pass 的连续距离场光带：零颗粒，开销恒定，可每帧调用
      this.engine.lineSplat(a.x, a.y, b.x, b.y,
        dx / len * vel, dy / len * vel,
        { r: c.r * g, g: c.g * g, b: c.b * g }, 0.3 + power / 100 * 0.9);
    }

    _renderTextCanvas(text, fontKey) {
      const FONTS = {
        '黑体': 'bold {S} "Microsoft YaHei","PingFang SC",sans-serif',
        '圆体': 'bold {S} "幼圆","YouYuan","Yuanti SC","Microsoft YaHei",sans-serif',
        '衬线': 'bold {S} Georgia,"Times New Roman","SimSun","宋体",serif',
        '楷体': 'bold {S} "楷体","KaiTi","STKaiti","cursive",serif',
        '等宽': 'bold {S} Consolas,"Courier New",monospace',
      };
      if (!this._textCanvas) this._textCanvas = document.createElement('canvas');
      const tc = this._textCanvas;
      const g = tc.getContext('2d');
      const fontPx = 96;
      const font = (FONTS[fontKey] || FONTS['黑体']).replace('{S}', fontPx + 'px');
      const pad = Math.round(fontPx * 0.4); // 给辉光光晕留边
      try { g.letterSpacing = '0.06em'; } catch (e) { /* 旧内核忽略 */ }
      g.font = font;
      const metrics = g.measureText(text);
      const tw = Math.max(4, Math.ceil(metrics.width) + pad * 2);
      const th = fontPx + pad * 2;
      tc.width = tw; tc.height = th;
      const g2 = tc.getContext('2d');
      g2.fillStyle = '#000';
      g2.fillRect(0, 0, tw, th);
      try { g2.letterSpacing = '0.06em'; } catch (e) { /* 旧内核忽略 */ }
      g2.font = font;
      g2.textBaseline = 'middle';
      g2.textAlign = 'center';
      // 三层描绘：宽光晕 → 紧光晕 → 亮核，印进流体后是柔和的发光体
      g2.shadowColor = 'rgba(255,255,255,0.85)';
      g2.shadowBlur = fontPx * 0.22;
      g2.fillStyle = 'rgba(255,255,255,0.55)';
      g2.fillText(text, tw / 2, th / 2);
      g2.shadowBlur = fontPx * 0.08;
      g2.fillStyle = '#fff';
      g2.fillText(text, tw / 2, th / 2);
      g2.shadowBlur = 0;
      g2.fillText(text, tw / 2, th / 2);
      return { tc, tw, th, fontPx };
    }

    stampText(args) {
      if (!this.engine || !this.engine.ready) return;
      const text = String(args.TEXT);
      if (!text) return;
      const sizeScr = clamp(args.SIZE, 4, 200); // Scratch 单位下的字高
      const { tc, tw, th, fontPx } = this._renderTextCanvas(text, args.FONT);

      const p = this._toNorm(args.X, args.Y);
      // 字高 sizeScr 个 Scratch 单位 → 归一化半高；宽度按纹理纵横比与舞台纵横比(4:3)换算
      const halfH = (sizeScr / 360) * (th / fontPx) * 0.5;
      const halfW = halfH * (tw / th) / (480 / 360);
      const c = hexToRgb01(args.COLOR);
      // 叠加式：重复执行会亮度累积、辉光爆发，随消散减缓
      this.engine.stampCanvas(tc, p.x, p.y, halfW, halfH,
        { r: c.r * 0.55, g: c.g * 0.55, b: c.b * 0.55 });
    }

    /** 固定文字：独立图层，不进流体模拟，任何搅动都不受影响 */
    stampSolid(args) {
      if (!this.engine) return;
      const text = String(args.TEXT);
      if (!text) return;
      const sizeScr = clamp(args.SIZE, 4, 200);
      const { tc, tw, th, fontPx } = this._renderTextCanvas(text, args.FONT);
      const p = this._toNorm(args.X, args.Y);
      const halfH = (sizeScr / 360) * (th / fontPx) * 0.5;
      const halfW = halfH * (tw / th) / (480 / 360);
      const c = hexToRgb01(args.COLOR);
      const entry = {
        tex: this.engine.createStampTexture(tc),
        cx: p.x, cy: p.y, halfW, halfH,
        color: { r: c.r * 0.6, g: c.g * 0.6, b: c.b * 0.6 },
      };
      // 同一位置重印 = 替换旧文字：重复执行不叠亮，更新文字（如分数）天然可行
      const i = this.solidStamps.findIndex(
        s => Math.abs(s.cx - p.x) < 1e-4 && Math.abs(s.cy - p.y) < 1e-4);
      if (i >= 0) {
        this.engine.deleteStampTexture(this.solidStamps[i].tex);
        this.solidStamps[i] = entry;
      } else {
        this.solidStamps.push(entry);
      }
      if (this.engine.ready) this.engine.renderSolid(this.solidStamps);
    }

    clearSolid() {
      if (this.engine) {
        for (const s of this.solidStamps) this.engine.deleteStampTexture(s.tex);
      }
      this.solidStamps.length = 0;
      if (this.engine && this.engine.ready) this.engine.renderSolid(this.solidStamps);
    }

    emitStart(args, util) {
      if (!util || !util.target || util.target.isStage) return;
      const t = util.target;
      this.emitters.set(t.id, {
        target: t,
        color: hexToRgb01(args.COLOR),
        power: clamp(args.POWER, 1, 100),
        last: null,
      });
    }

    emitStop(args, util) {
      if (!util || !util.target) return;
      this.emitters.delete(util.target.id);
    }

    emitStopAll() {
      this.emitters.clear();
    }

    setWind(args) {
      if (!this.engine) return;
      const power = clamp(args.POWER, 0, 100) * 8;
      const rad = (Number(args.DIR) || 0) * Math.PI / 180;
      this.engine.wind.x = Math.sin(rad) * power;
      this.engine.wind.y = Math.cos(rad) * power;
    }

    clearWind() {
      if (!this.engine) return;
      this.engine.wind.x = 0;
      this.engine.wind.y = 0;
    }

    addField(args) {
      if (!this.engine) return;
      if (this.engine.fields.length >= MAX_FIELDS) this.engine.fields.shift();
      const p = this._toNorm(args.X, args.Y);
      const s = clamp(args.POWER, 0, 100) * 12 * (args.FTYPE === '引力场' ? -1 : 1);
      this.engine.fields.push({ x: p.x, y: p.y, s });
    }

    clearFields() {
      if (!this.engine) return;
      this.engine.fields.length = 0;
    }

    setStir(args) {
      this.stir = args.SWITCH === '开启';
      if (!this.stir) this._stirLast = null;
    }

    setTheme(args) {
      currentZones = THEMES.hasOwnProperty(args.THEME) ? THEMES[args.THEME] : THEMES['霓虹'];
    }

    setParam(args) {
      const v = clamp(args.VALUE, 0, 100);
      if (args.PARAM === '图层不透明度') {
        if (this.overlay) this.overlay.style.opacity = String(v / 100);
        return;
      }
      if (args.PARAM === '模拟速度') {
        this.simSpeed = v / 50; // 50 = 正常速度，100 = 两倍
        return;
      }
      if (!this.engine) return;
      const cfg = this.engine.cfg;
      switch (args.PARAM) {
        case '消散速度': cfg.densityDissipation = 1 - 0.0004 - v * 0.0012; break; // 0→几乎不消散, 100→快速消散
        case '漩涡强度': cfg.curl = v; break;
        // 0→流动很快停下（文字稳定），100→漩涡长时间自持（默认≈96）
        case '流动惯性': cfg.velocityDissipation = 0.90 + v / 100 * 0.099; break;
        case '辉光强度': cfg.bloomIntensity = v / 100 * 1.5; break;
        case '注入半径': cfg.splatRadius = 0.05 + v / 100 * 0.95; break;
      }
    }

    setBlend(args) {
      if (!this.overlay) return;
      this.overlay.style.mixBlendMode = args.BLEND === '不透明覆盖' ? 'normal' : 'screen';
    }

    getVelX(args) {
      if (!this.engine) return 0;
      const p = this._toNorm(args.X, args.Y);
      return Math.round(this.engine.sample(p.x, p.y).vx / 55 * 10) / 10; // 与"力度"同一量纲
    }

    getVelY(args) {
      if (!this.engine) return 0;
      const p = this._toNorm(args.X, args.Y);
      return Math.round(this.engine.sample(p.x, p.y).vy / 55 * 10) / 10;
    }

    getBrightness(args) {
      if (!this.engine) return 0;
      const p = this._toNorm(args.X, args.Y);
      return Math.round(this.engine.sample(p.x, p.y).brightness * 100);
    }

    isOn() {
      return !!this.engine;
    }
  }

  Scratch.extensions.register(new LumenExtension());
})(Scratch);
