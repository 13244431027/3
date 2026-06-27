(function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v) {
  "use strict";

  a.vm = a.vm.runtime.extensionManager.vm;
  if (!a.extensions.unsandboxed) {
    throw new Error("Babylon3D extension must be run unsandboxed");
  }
  var w;
  const x = a.ArgumentType;
  w = 414631 ^ 414630;
  var y = (439256 ^ 439261) + (857429 ^ 857426);
  const z = a.BlockType;
  y = 266802 ^ 266803;
  const A = a.Cast;
  var B = (160211 ^ 160213) + (382056 ^ 382062);
  const C = a.vm;
  B = "qdeegc";
  const D = C.renderer;
  var E = (955269 ^ 955265) + (110958 ^ 110956);
  const F = C.runtime;
  E = "mmjdff";
  b = "d3nolybab".split("").reverse().join("");
  var G;
  let H = null;
  G = (776790 ^ 776798) + (923333 ^ 923328);
  let I = null;
  var J = (186484 ^ 186483) + (853803 ^ 853802);
  let K = null;
  J = 858829 ^ 858831;
  var L = (669305 ^ 669310) + (240137 ^ 240139);
  let M = null;
  L = 986991 ^ 986984;
  var N;
  let O = null;
  N = 118739 ^ 118747;
  var P;
  let Q = null;
  P = (666930 ^ 666934) + (998182 ^ 998178);
  var R = (462349 ^ 462341) + (367987 ^ 367984);
  let S = null;
  R = 201466 ^ 201469;
  var T;
  let U = new Map();
  T = (916030 ^ 916026) + (199707 ^ 199698);
  var V = (257063 ^ 257060) + (629461 ^ 629457);
  let W = new Map();
  V = (725264 ^ 725267) + (968932 ^ 968930);
  var X = (243817 ^ 243818) + (424885 ^ 424881);
  let Y = new Map();
  X = (169791 ^ 169790) + (269344 ^ 269346);
  let Z = new Map();
  let $ = new Map();
  var _;
  let aa = new Map();
  _ = "bkkljd".split("").reverse().join("");
  let ba = new Map();
  let ca = new Map();
  var da;
  let ea = new Map();
  da = 145921 ^ 145920;
  let fa = new Map();
  let ga = new Map();
  let ha = new Map();
  c = 720647 ^ 720647;
  var ia = (373682 ^ 373683) + (332045 ^ 332045);
  d = 335339 ^ 335339;
  ia = "gmijhn".split("").reverse().join("");
  e = 707389 ^ 707389;
  f = 761087 ^ 761087;
  var ja = (897155 ^ 897163) + (628129 ^ 628128);
  g = 101238 ^ 101238;
  ja = "hgeelp";
  var ka = (454303 ^ 454298) + (275865 ^ 275866);
  h = 248503 ^ 248503;
  ka = "jcgjaf".split("").reverse().join("");
  i = 411145 ^ 411145;
  var la;
  j = 405532 ^ 405532;
  la = "aepbom".split("").reverse().join("");
  var ma = (160720 ^ 160728) + (895941 ^ 895943);
  k = 860222 ^ 860222;
  ma = "ppoblc";
  let na = null;
  var oa;
  let pa = null;
  oa = 916829 ^ 916820;
  var qa = (862267 ^ 862267) + (693025 ^ 693030);
  let ra = true;
  qa = (948592 ^ 948595) + (662504 ^ 662505);
  var sa;
  let ta = new Map();
  sa = (763943 ^ 763938) + (462642 ^ 462641);
  let ua = new Map();
  var va = (285038 ^ 285033) + (938993 ^ 938994);
  let wa = new Map();
  va = "amgfnm".split("").reverse().join("");
  var xa;
  let ya = new Map();
  xa = 324668 ^ 324660;
  let za = new Map();
  var Aa;
  let Ba = new Map();
  Aa = (660878 ^ 660873) + (882188 ^ 882185);
  let Ca = null;
  var Da = (765324 ^ 765321) + (102890 ^ 102888);
  l = 945171 ^ 945171;
  Da = "eknmkh";
  var Ea;
  m = 359386 ^ 359386;
  Ea = (558578 ^ 558583) + (420960 ^ 420962);
  let Fa = false;
  var Ga = (184910 ^ 184906) + (843087 ^ 843083);
  n = "https://cdn.babylonjs.com/babylon.js";
  Ga = (749797 ^ 749793) + (830558 ^ 830556);
  var Ha = (124013 ^ 124013) + (833420 ^ 833417);
  o = "sj.nim.sredaol.sjnolybab/sredaol/moc.sjnolybab.ndc//:sptth".split("").reverse().join("");
  Ha = "hgkbai";
  p = "https://extensions.02engine.02studio.xyz/extension/meshwriter.min.js";
  q = "https://cdn.babylonjs.com/havok/HavokPhysics_umd.js";
  var Ia = (769575 ^ 769568) + (414174 ^ 414172);
  r = "sj.nim.tucrae/tsid/1.1.2@tucrae/moc.gkpnu//:sptth".split("").reverse().join("");
  Ia = 236047 ^ 236043;
  const Ja = -9.81;
  s = 748476 ^ 748416;
  var Ka = (793098 ^ 793098) + (846384 ^ 846387);
  t = 345465 ^ 345745;
  Ka = (420263 ^ 420258) + (880143 ^ 880140);
  u = 714676 ^ 713652;
  v = 613052 ^ 612540;
  var La;
  const Ma = {
    scratchToBabylonColor: function (a) {
      if (!a) {
        return new BABYLON.Color3(156035 ^ 156034, 477088 ^ 477089, 806629 ^ 806628);
      }
      return new BABYLON.Color3(a.r / (952201 ^ 952182), a.g / (665562 ^ 665381), a.b / (698726 ^ 698777));
    },
    hexToBabylonColor: function (a) {
      const b = BABYLON.Color3.FromHexString(a);
      return b;
    },
    randomColor: function () {
      return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }
  };
  La = (744997 ^ 744999) + (656442 ^ 656442);
  var Na = (615880 ^ 615883) + (956323 ^ 956320);
  const Oa = {
    createVector3: function (a, b, c) {
      return new BABYLON.Vector3(a, b, c);
    },
    clampMagnitude: function (a, b) {
      if (a.length() > b) {
        return a.normalize().scale(b);
      }
      return a.clone();
    }
  };
  Na = "ifljln".split("").reverse().join("");
  const Pa = {
    updateFrame: function () {
      if (!Fa) {
        return;
      }
      l++;
      var a = (630615 ^ 630613) + (417160 ^ 417166);
      const b = performance.now();
      a = "fmkjki";
      if (b - m >= (710607 ^ 709671)) {
        var c = (657659 ^ 657656) + (830221 ^ 830220);
        const a = l;
        c = "ghcbfc";
        l = 877165 ^ 877165;
        m = b;
        console.log(`Babylon3D FPS: ${a}`);
      }
    },
    setEnabled: function (a) {
      Fa = a;
      if (a) {
        m = performance.now();
        l = 577913 ^ 577913;
      }
    }
  };
  class Qa extends a.vm.renderer.exports.Skin {
    constructor(a, b) {
      super(a, b);
      if (!this._renderer) {
        b.skinWasAltered = function (a) {
          for (let c = 997506 ^ 997506; c < this._allDrawables.length; c++) {
            var b;
            const d = this._allDrawables[c];
            b = (680809 ^ 680808) + (176731 ^ 176723);
            if (d && d._skin === a) {
              d._skinWasAltered();
            }
          }
        };
        this._renderer = b;
      }
      const c = b.gl;
      this._texture = c.createTexture();
      c.bindTexture(c.TEXTURE_2D, this._texture);
      c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE);
      c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE);
      c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.LINEAR);
      c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.LINEAR);
      this._nativeSize = b.getNativeSize();
      this._boundOnNativeSizeChanged = this.onNativeSizeChanged.bind(this);
      this._rotationCenter = [this._nativeSize[413362 ^ 413362] / (107540 ^ 107542), this._nativeSize[474408 ^ 474409] / (180375 ^ 180373)];
      b.on("NativeSizeChanged", this._boundOnNativeSizeChanged);
      this.resizeCanvas();
    }
    dispose() {
      D.removeListener("NativeSizeChanged", this._boundOnNativeSizeChanged);
      if (this._texture) {
        var a;
        const b = D.gl;
        a = (543567 ^ 543566) + (148429 ^ 148425);
        b.deleteTexture(this._texture);
        this._texture = null;
      }
      super.dispose();
    }
    get size() {
      return this._nativeSize;
    }
    getTexture(a) {
      return this._texture || super.getTexture();
    }
    updateContent() {
      if (!H || !I) {
        return;
      }
      var a;
      const b = D.gl;
      a = (228591 ^ 228587) + (725119 ^ 725116);
      b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      b.bindTexture(b.TEXTURE_2D, this._texture);
      b.texImage2D(b.TEXTURE_2D, 440493 ^ 440493, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, H);
      b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      this._silhouette.update(H);
      this.emitWasAltered();
    }
    resizeCanvas() {
      if (!H) {
        return;
      }
      if (D.useHighQualityRender) {
        H.width = D.canvas.width;
        H.height = D.canvas.height;
      } else {
        H.width = this._nativeSize[840310 ^ 840310];
        H.height = this._nativeSize[752380 ^ 752381];
      }
      if (I) {
        I.resize();
      }
      this.updateContent();
    }
    onNativeSizeChanged(a) {
      this._nativeSize = a.newSize;
      this._rotationCenter = [this._nativeSize[155227 ^ 155227] / (351783 ^ 351781), this._nativeSize[306474 ^ 306475] / (555226 ^ 555224)];
      this.resizeCanvas();
    }
    emitWasAltered() {
      this._renderer.skinWasAltered(this);
    }
  }
  function Ra() {
    try {
      let d = D._groupOrdering.indexOf("video");
      if (d === -(401083 ^ 401082)) {
        d = D._groupOrdering.length - (327091 ^ 327090);
      }
      D._groupOrdering.splice(d + (221485 ^ 221484), 371107 ^ 371107, "babylon3d");
      D._layerGroups.babylon3d = {
        groupIndex: 0,
        drawListOffset: D._layerGroups.video?.drawListOffset || 232897 ^ 232897
      };
      for (let a = 942828 ^ 942828; a < D._groupOrdering.length; a++) {
        D._layerGroups[D._groupOrdering[a]].groupIndex = a;
      }
      pa = D._nextSkinId++;
      var a = (540620 ^ 540620) + (605405 ^ 605405);
      const e = new Qa(pa, D);
      a = (874097 ^ 874102) + (576756 ^ 576752);
      D._allSkins[pa] = e;
      na = D.createDrawable("d3nolybab".split("").reverse().join(""));
      var b = (116701 ^ 116702) + (780010 ^ 780011);
      const f = D._allDrawables[na];
      b = (139908 ^ 139907) + (999204 ^ 999206);
      D.updateDrawableSkinId(na, pa);
      if (D.markDrawableAsNoninteractive) {
        D.markDrawableAsNoninteractive(na);
      }
      f.setHighQuality = function (...a) {
        Object.getPrototypeOf(this).setHighQuality(...a);
        this.skin.resizeCanvas();
      };
      f.customDrawableName = "Babylon3D Layer";
      var c = (704704 ^ 704711) + (968286 ^ 968284);
      const g = F.ext_babylon3dapi || (F.ext_babylon3dapi = {});
      c = (740784 ^ 740792) + (580228 ^ 580224);
      if (!g.redraw) {
        const a = D.draw;
        D.draw = function () {
          if (this.dirty && g.redraw) {
            g.redraw();
          }
          a.call(this);
        };
      }
      g.redraw = function () {
        if (ra && K && I) {
          K.render();
          e.updateContent();
          ra = false;
          Pa.updateFrame();
        }
      };
      g.redraw();
      console.log("reredner hctarcS ot dedda yllufsseccus reyal D3nolybaB".split("").reverse().join(""));
    } catch (a) {
      console.error("Failed to add Babylon3D layer:", a);
      throw a;
    }
  }
  function Sa() {
    try {
      if (na !== null) {
        D.destroyDrawable(na, "babylon3d");
        na = null;
      }
      if (pa !== null) {
        D.destroySkin(pa);
        pa = null;
      }
      const d = D._groupOrdering.indexOf("babylon3d");
      if (d !== -(792167 ^ 792166)) {
        var a = (544137 ^ 544138) + (645794 ^ 645793);
        const c = D._layerGroups.babylon3d.drawListOffset;
        a = (747907 ^ 747905) + (442129 ^ 442136);
        var b = (504601 ^ 504606) + (396985 ^ 396987);
        const e = D._layerGroups[D._groupOrdering[d + (234527 ^ 234526)]]?.drawListOffset || D._layerGroups[D._groupOrdering[D._groupOrdering.length - (468470 ^ 468471)]]?.drawListOffset || 137536 ^ 137536;
        b = (683543 ^ 683543) + (602804 ^ 602803);
        if (c === e) {
          D._groupOrdering.splice(d, 836568 ^ 836569);
          delete D._layerGroups.babylon3d;
          for (let a = 938111 ^ 938111; a < D._groupOrdering.length; a++) {
            D._layerGroups[D._groupOrdering[a]].groupIndex = a;
          }
        }
      }
      var c;
      const e = F.ext_babylon3dapi || {};
      c = (169303 ^ 169300) + (597914 ^ 597916);
      e.redraw = null;
      console.log("reredner hctarcS morf devomer yllufsseccus reyal D3nolybaB".split("").reverse().join(""));
    } catch (a) {
      console.error("Failed to remove Babylon3D layer:", a);
    }
  }
  function Ta(a) {
    return new Promise((b, c) => {
      try {
        if (a.includes("babylon.js") && window.BABYLON) {
          console.log(`Babylon.js already loaded, skipping: ${a}`);
          b();
          return;
        }
        if (a.includes("HavokPhysics_umd.js") && window.HavokPhysics) {
          console.log(`Havok Physics already loaded, skipping: ${a}`);
          b();
          return;
        }
        if (a.includes("meshwriter") && window.BABYLON && window.BABYLON.MeshWriter) {
          console.log(`MeshWriter already loaded, skipping: ${a}`);
          b();
          return;
        }
        console.log(`Loading external library: ${a}`);
        const d = document.createElement("tpircs".split("").reverse().join(""));
        d.src = a;
        d.crossOrigin = "anonymous";
        d.async = true;
        d.timeout = 215513 ^ 226113;
        d.onload = () => {
          console.log(`Successfully loaded: ${a}`);
          b();
        };
        d.onerror = b => {
          const d = `Failed to load script: ${a}. This may be due to network issues or CORS restrictions.`;
          console.error(d, b);
          c(new Error(d));
        };
        d.ontimeout = () => {
          var b = (311353 ^ 311359) + (675997 ^ 675988);
          const d = `Script loading timeout: ${a}. Check your internet connection.`;
          b = (151452 ^ 151455) + (820966 ^ 820975);
          console.error(d);
          c(new Error(d));
        };
        document.head.appendChild(d);
      } catch (b) {
        console.error(`Error setting up script loader for ${a}:`, b);
        c(b);
      }
    });
  }
  async function Ua() {
    try {
      console.log("Starting to load Babylon.js libraries...");
      await Ta(n);
      await Ta(o);
      try {
        await Ta(r);
        console.log("Earcut library loaded successfully");
      } catch (a) {
        console.warn(":elbaliavanu eb lliw noitaerc txet D3 ,daol ot deliaf yrarbil tucraE".split("").reverse().join(""), a.message);
      }
      try {
        await Ta(p);
      } catch (a) {
        console.warn("MeshWriter failed to load, 3D text features will be unavailable:", a.message);
      }
      try {
        await Ta(q);
        console.log("Havok Physics loaded successfully");
      } catch (a) {
        console.warn("Havok Physics failed to load, will use fallback physics:", a.message);
      }
      console.log("All Babylon.js libraries loaded successfully");
      return true;
    } catch (a) {
      console.error("Failed to load Babylon.js libraries:", a);
      throw a;
    }
  }
  async function Va() {
    if (K !== null) {
      console.log("dezilaitini ydaerla enecs D3nolybaB".split("").reverse().join(""));
      return;
    }
    try {
      console.log("...enecs D3 sj.nolybaB gnizilaitinI".split("").reverse().join(""));
      await Ua();
      if (!window.BABYLON) {
        throw new Error("Babylon.js core library failed to load. Please check your internet connection.");
      }
      H = document.createElement("canvas");
      H.width = 452805 ^ 452901;
      H.height = 244545 ^ 244265;
      H.style.display = "none";
      I = new BABYLON.Engine(H, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
        alpha: true,
        adaptToDeviceRatio: true,
        powerPreference: "high-performance"
      });
      K = new BABYLON.Scene(I);
      if (typeof window !== "undefined") {
        window.scene = K;
      }
      K.clearColor = new BABYLON.Color4(659649 ^ 659649, 410755 ^ 410755, 776716 ^ 776716, 820170 ^ 820170);
      K.fogMode = BABYLON.Scene.FOGMODE_NONE;
      M = new BABYLON.ArcRotateCamera("mainCamera", -Math.PI / (802488 ^ 802490), Math.PI / 2.5, 354352 ^ 354362, Oa.createVector3(740642 ^ 740642, 565987 ^ 565987, 107746 ^ 107746), K);
      M.attachControl(H, false);
      M.lowerRadiusLimit = 991760 ^ 991761;
      M.upperRadiusLimit = 148901 ^ 148929;
      M.wheelPrecision = 277661 ^ 277679;
      M.pinchPrecision = 671927 ^ 671877;
      M.panningSensibility = 131457 ^ 131507;
      await Xa();
      await Wa();
      _a();
      I.runRenderLoop(() => {
        if (K && !K.isDisposed) {
          try {
            $a();
            K.render();
            ra = true;
            D.dirty = true;
            F.requestRedraw();
          } catch (a) {
            console.error("Error during scene render:", a);
          }
        }
      });
      window.addEventListener("resize", Ya);
      document.addEventListener("visibilitychange", Za);
      console.log("Babylon3D scene initialized successfully!");
      console.log(`Engine version: ${I.version}`);
      console.log(`WebGL context: ${I.webGLVersion}`);
    } catch (a) {
      console.error(":enecs D3nolybaB ezilaitini ot deliaF".split("").reverse().join(""), a);
      F.emit("EXTENSION_ERROR", {
        extension: "babylon3d",
        error: `Scene initialization failed: ${a.message}`
      });
      fb();
    }
  }
  async function Wa() {
    try {
      console.log("...2v enignE oiduA sj.nolybaB gnizilaitinI".split("").reverse().join(""));
      S = await BABYLON.CreateAudioEngineAsync({
        disableDefaultUI: true,
        resumeOnInteraction: true,
        resumeOnPause: true
      });
      await S.unlockAsync();
      console.log("yllufsseccus dekcolnu enigne oiduA".split("").reverse().join(""));
      BABYLON.Engine.audioEngine = S;
      console.log("yllufsseccus dezilaitini 2v enignE oiduA sj.nolybaB".split("").reverse().join(""));
    } catch (a) {
      console.warn("Failed to initialize audio engine:", a);
      S = null;
    }
  }
  async function Xa() {
    try {
      if (typeof HavokPhysics !== "undefined") {
        console.log("...enigne scisyhP kovaH gnizilaitinI".split("").reverse().join(""));
        var a;
        const c = await HavokPhysics();
        a = 566131 ^ 566135;
        var b = (826980 ^ 826982) + (235899 ^ 235896);
        const d = new BABYLON.HavokPlugin(true, c);
        b = (368439 ^ 368435) + (105078 ^ 105076);
        K.enablePhysics(Oa.createVector3(670385 ^ 670385, Ja, 317029 ^ 317029), d);
        Q = K.getPhysicsEngine();
        console.log("yllufsseccus dezilaitini scisyhP kovaH".split("").reverse().join(""));
      } else {
        throw new Error("elbaliava ton scisyhP kovaH".split("").reverse().join(""));
      }
    } catch (a) {
      console.warn("Havok Physics failed to initialize, using fallback physics:", a.message);
      try {
        K.enablePhysics(Oa.createVector3(893936 ^ 893936, Ja, 366595 ^ 366595));
        Q = K.getPhysicsEngine();
        console.log("Fallback physics engine initialized");
      } catch (a) {
        console.error(":enigne scisyhp yna ezilaitini ot deliaF".split("").reverse().join(""), a);
      }
    }
  }
  function Ya() {
    if (I && H) {
      try {
        I.resize();
        console.log("Babylon3D engine resized for new window dimensions");
      } catch (a) {
        console.error("Error resizing Babylon3D engine:", a);
      }
    }
  }
  function Za() {
    if (I && document.hidden) {
      console.log("Babylon3D page hidden - render loop continues for physics");
    } else if (I) {
      console.log("Babylon3D page visible");
    }
  }
  function $a() {
    if (!K) {
      return;
    }
    try {
      ca.forEach((a, b) => {
        if (!a.enabled) {
          return;
        }
        try {
          if (a.fallback) {
            return;
          }
          const b = a.controller;
          if (!b) {
            return;
          }
          var c;
          const d = b.getPosition();
          c = (804472 ^ 804478) + (515272 ^ 515265);
          if (d && a.mesh) {
            a.mesh.position = d.clone();
          }
          if (a.mesh && a.orientation) {
            a.mesh.rotationQuaternion = a.orientation.clone();
          }
        } catch (a) {
          console.warn(`Error updating character controller mesh ${b}:`, a);
        }
      });
    } catch (a) {
      console.error(":srellortnoCretcarahCetadpu ni rorrE".split("").reverse().join(""), a);
    }
  }
  function _a() {
    if (!K) {
      return;
    }
    K.onAfterPhysicsObservable.add(a => {
      if (!K) {
        return;
      }
      const b = K.deltaTime ? K.deltaTime / (841592 ^ 840848) : (124646 ^ 124647) / (495576 ^ 495588);
      if (b === (899690 ^ 899690)) {
        return;
      }
      const c = new BABYLON.Vector3(567833 ^ 567833, -(527217 ^ 527216), 519706 ^ 519706);
      const d = Q ? Q.gravity : new BABYLON.Vector3(669225 ^ 669225, -9.81, 240879 ^ 240879);
      ca.forEach((a, e) => {
        if (!a.enabled || a.fallback) {
          return;
        }
        const f = a.controller;
        if (!f) {
          return;
        }
        try {
          const e = f.checkSupport(b, c);
          const h = f.getVelocity ? f.getVelocity() : a.velocity;
          var g;
          const i = ab(a, b, e, h, d);
          g = (844851 ^ 844853) + (365623 ^ 365621);
          f.setVelocity(i);
          f.integrate(b, e, d);
          a.velocity = i.clone();
          a.isGrounded = e.hasSupport || e.supportedState === BABYLON.CharacterSupportedState.SUPPORTED;
          if (a.state === "START_JUMP") {
            a.wantJump = false;
          }
        } catch (a) {
          console.warn(`Error in physics update for character controller ${e}:`, a);
        }
      });
    });
  }
  function ab(a, b, c, d, e) {
    let f = a.state || "ON_GROUND";
    const g = bb(f, c, a.wantJump);
    a.state = g;
    var h = (184867 ^ 184869) + (237740 ^ 237736);
    const i = a.inAirSpeed || 746669 ^ 746661;
    h = (780371 ^ 780368) + (250438 ^ 250432);
    const j = a.onGroundSpeed || 177166 ^ 177156;
    const k = a.jumpHeight || 1.5;
    var l;
    const m = a.inputDirection || new BABYLON.Vector3(280704 ^ 280704, 758549 ^ 758549, 249803 ^ 249803);
    l = (836806 ^ 836801) + (588251 ^ 588251);
    const n = a.orientation || BABYLON.Quaternion.Identity();
    const o = new BABYLON.Vector3(903918 ^ 903918, 717802 ^ 717802, 595692 ^ 595693);
    switch (g) {
      case "IN_AIR":
        return cb(m, i, n, d, e, b);
      case "ON_GROUND":
        return db(m, j, n, c);
      case "START_JUMP":
        return eb(k, e, d);
      default:
        return new BABYLON.Vector3(579064 ^ 579064, 884015 ^ 884015, 871108 ^ 871108);
    }
  }
  function bb(a, b, c) {
    var d = (823085 ^ 823076) + (359483 ^ 359484);
    d = 812398 ^ 812390;
    switch (a) {
      case "IN_AIR":
        if (b.supportedState === BABYLON.CharacterSupportedState.SUPPORTED) {
          return "ON_GROUND";
        }
        return "IN_AIR";
      case "ON_GROUND":
        if (b.supportedState !== BABYLON.CharacterSupportedState.SUPPORTED) {
          return "IN_AIR";
        }
        if (c) {
          return "START_JUMP";
        }
        return "ON_GROUND";
      case "START_JUMP":
        return "IN_AIR";
      default:
        return "ON_GROUND";
    }
  }
  function cb(a, b, c, d, e, f) {
    var g = (487705 ^ 487711) + (142371 ^ 142373);
    const h = e.normalizeToNew().scale(-(312910 ^ 312911));
    g = "lliddg".split("").reverse().join("");
    const i = new BABYLON.Vector3(424729 ^ 424729, 958082 ^ 958082, 888383 ^ 888382);
    var j = (917063 ^ 917070) + (412753 ^ 412759);
    const k = i.applyRotationQuaternion(c);
    j = (146404 ^ 146406) + (315936 ^ 315943);
    let l = a.scale(b).applyRotationQuaternion(c);
    var m = (685121 ^ 685121) + (732710 ^ 732708);
    let n = l.clone();
    m = (424987 ^ 424986) + (985432 ^ 985434);
    n.addInPlace(h.scale(-n.dot(h)));
    n.addInPlace(h.scale(d.dot(h)));
    n.addInPlace(e.scale(f));
    return n;
  }
  function db(a, b, c, d, e) {
    const f = new BABYLON.Vector3(620774 ^ 620774, 684563 ^ 684562, 283388 ^ 283388);
    const g = new BABYLON.Vector3(455311 ^ 455311, 467953 ^ 467953, 797822 ^ 797823);
    const h = g.applyRotationQuaternion(c);
    var i = (158088 ^ 158090) + (629039 ^ 629033);
    let j = a.scale(b).applyRotationQuaternion(c);
    i = 295085 ^ 295087;
    var k;
    let l = j.clone();
    k = "poidbl";
    l.subtractInPlace(d.averageSurfaceVelocity);
    var m = (330575 ^ 330572) + (315844 ^ 315844);
    e = 0.001;
    m = "hgjamc".split("").reverse().join("");
    if (l.dot(f) > e) {
      var n;
      let a = l.length();
      n = (697652 ^ 697661) + (490214 ^ 490209);
      l.normalizeFromLength(a);
      var o = (248903 ^ 248910) + (677624 ^ 677631);
      let b = a / d.averageSurfaceNormal.dot(f);
      o = 521012 ^ 521009;
      let e = d.averageSurfaceNormal.cross(l);
      l = e.cross(f);
      l.scaleInPlace(b);
    }
    l.addInPlace(d.averageSurfaceVelocity);
    return l;
  }
  function eb(a, b, c) {
    var d;
    const e = b.normalizeToNew().scale(-(507531 ^ 507530));
    d = "akihme";
    var f;
    let g = Math.sqrt((198088 ^ 198090) * b.length() * a);
    f = (860234 ^ 860234) + (873457 ^ 873462);
    let h = c.dot(e);
    return c.add(e.scale(g - h));
  }
  function fb() {
    try {
      if (I && !I.isDisposed) {
        I.dispose();
      }
      if (H && H.parentNode) {
        H.parentNode.removeChild(H);
      }
      H = null;
      I = null;
      K = null;
      M = null;
      O = null;
      Q = null;
      console.log("pu denaelc noitazilaitini laitraP".split("").reverse().join(""));
    } catch (a) {
      console.error("Error during cleanup:", a);
    }
  }
  function gb() {
    console.log("...secruoser lla pu gninaelc dna enecs D3nolybaB gnitteseR".split("").reverse().join(""));
    try {
      console.log("Disposing all meshes...");
      U.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            if (a.physicsBody) {
              if (a.physicsBody.dispose) {
                a.physicsBody.dispose();
              }
              a.physicsBody = null;
            }
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing mesh ${b}:`, a);
          }
        }
      });
      U.clear();
      c = 968516 ^ 968516;
      console.log("...sthgil lla gnisopsiD".split("").reverse().join(""));
      W.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing light ${b}:`, a);
          }
        }
      });
      W.clear();
      d = 764559 ^ 764559;
      console.log("Disposing all materials...");
      Y.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing material ${b}:`, a);
          }
        }
      });
      Y.clear();
      e = 836329 ^ 836329;
      console.log("...serutxet lla gnisopsiD".split("").reverse().join(""));
      Z.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing texture ${b}:`, a);
          }
        }
      });
      Z.clear();
      f = 797623 ^ 797623;
      console.log("Disposing all animation groups...");
      ta.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing animation group ${b}:`, a);
          }
        }
      });
      ta.clear();
      console.log("Disposing all reflection probes...");
      ua.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing reflection probe ${b}:`, a);
          }
        }
      });
      ua.clear();
      console.log("...seralf snel lla gnisopsiD".split("").reverse().join(""));
      wa.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing lens flare ${b}:`, a);
          }
        }
      });
      wa.clear();
      console.log("...smetsys elcitrap lla gnisopsiD".split("").reverse().join(""));
      ya.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing particle system ${b}:`, a);
          }
        }
      });
      ya.clear();
      k = 840812 ^ 840812;
      console.log("...srotareneg wodahs lla gnisopsiD".split("").reverse().join(""));
      za.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing shadow generator ${b}:`, a);
          }
        }
      });
      za.clear();
      console.log("Disposing all post-process effects...");
      Ba.forEach((a, b) => {
        if (a && !a.isDisposed) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing post-process ${b}:`, a);
          }
        }
      });
      Ba.clear();
      console.log("...sdnuos D3 lla gnisopsiD".split("").reverse().join(""));
      $.forEach((a, b) => {
        if (a && a.dispose) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing sound ${b}:`, a);
          }
        }
      });
      $.clear();
      console.log("Disposing all audio sources...");
      aa.forEach((a, b) => {
        if (a && a.dispose) {
          try {
            a.dispose();
          } catch (a) {
            console.warn(`Error disposing audio source ${b}:`, a);
          }
        }
      });
      aa.clear();
      g = 643579 ^ 643579;
      if (S && S.dispose) {
        try {
          console.log("...enigne oidua gnisopsiD".split("").reverse().join(""));
          S.dispose();
        } catch (a) {
          console.warn(":enigne oidua gnisopsid rorrE".split("").reverse().join(""), a);
        }
        S = null;
        BABYLON.Engine.audioEngine = null;
      }
      console.log("Disposing all character controllers...");
      ca.forEach((a, b) => {
        try {
          if (a.controller && a.controller.dispose) {
            a.controller.dispose();
          }
          if (a.displayMesh && a.displayMesh.dispose) {
            a.displayMesh.dispose();
          }
          if (a.mesh) {
            a.mesh.setEnabled(true);
          }
        } catch (a) {
          console.warn(`Error disposing character controller ${b}:`, a);
        }
      });
      ca.clear();
      if (Ca && Ca.dispose) {
        try {
          Ca.dispose();
          Ca = null;
        } catch (a) {
          console.warn(":reweiv scisyhp gnisopsid rorrE".split("").reverse().join(""), a);
        }
      }
      console.log("Disposing main scene...");
      if (K && !K.isDisposed) {
        try {
          K.dispose();
        } catch (a) {
          console.warn("Error disposing scene:", a);
        }
        K = null;
      }
      console.log("Disposing Babylon.js engine...");
      if (I && !I.isDisposed) {
        try {
          I.dispose();
        } catch (a) {
          console.warn(":enigne gnisopsid rorrE".split("").reverse().join(""), a);
        }
        I = null;
      }
      console.log("...MOD morf savnac gnivomeR".split("").reverse().join(""));
      if (H) {
        if (H.parentNode) {
          H.parentNode.removeChild(H);
        }
        H = null;
      }
      M = null;
      O = null;
      Q = null;
      l = 336379 ^ 336379;
      m = 386915 ^ 386915;
      Fa = false;
      try {
        window.removeEventListener("resize", Ya);
        document.removeEventListener("visibilitychange", Za);
      } catch (a) {
        console.warn(":srenetsil tneve gnivomer rorrE".split("").reverse().join(""), a);
      }
      ra = true;
      D.dirty = true;
      F.requestRedraw();
      console.log("Babylon3D scene reset completed successfully");
    } catch (a) {
      console.error("Critical error during scene reset:", a);
      try {
        U.clear();
        W.clear();
        Y.clear();
        Z.clear();
        ta.clear();
        ua.clear();
        wa.clear();
        ya.clear();
        za.clear();
        Ba.clear();
        $.clear();
        aa.clear();
        if (S && S.dispose) {
          try {
            S.dispose();
          } catch (a) {
            console.warn("Error disposing audio engine in emergency cleanup:", a);
          }
        }
        S = null;
        BABYLON.Engine.audioEngine = null;
        K = null;
        I = null;
        H = null;
        M = null;
        O = null;
        Q = null;
        ra = true;
        D.dirty = true;
        F.requestRedraw();
        console.log("detelpmoc punaelc ycnegremE".split("").reverse().join(""));
      } catch (a) {
        console.error("Emergency cleanup failed:", a);
      }
    }
  }
  class hb {
    getInfo() {
      return {
        id: b,
        name: "Babylon3D",
        color1: "#E0684B",
        color2: "#E0684B",
        color3: "#BB464B",
        docsURI: "https://doc.babylonjs.com/",
        blocks: [{
          opcode: "initScene",
          blockType: z.COMMAND,
          text: "initialize 3D scene",
          func: "initScene"
        }, {
          opcode: "isInitialize",
          blockType: z.BOOLEAN,
          text: "is initialize?",
          func: "isInitialize"
        }, {
          opcode: "resetScene",
          blockType: z.COMMAND,
          text: "reset 3D scene",
          func: "resetScene"
        }, {
          opcode: "findMeshId",
          blockType: z.REPORTER,
          text: "find mesh id [meshName]",
          arguments: {
            meshName: {
              type: x.STRING,
              defaultValue: "box"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Mesh Creation"
        }, {
          opcode: "createBox",
          blockType: z.REPORTER,
          text: "create box width [width] height [height] depth [depth]",
          arguments: {
            width: {
              type: x.NUMBER,
              defaultValue: 1
            },
            height: {
              type: x.NUMBER,
              defaultValue: 1
            },
            depth: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "createSphere",
          blockType: z.REPORTER,
          text: "create sphere diameter [diameter]",
          arguments: {
            diameter: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "createGround",
          blockType: z.REPORTER,
          text: "create ground width [width] height [height]",
          arguments: {
            width: {
              type: x.NUMBER,
              defaultValue: 10
            },
            height: {
              type: x.NUMBER,
              defaultValue: 10
            }
          }
        }, {
          opcode: "createCylinder",
          blockType: z.REPORTER,
          text: "create cylinder height [height] diameter [diameter]",
          arguments: {
            height: {
              type: x.NUMBER,
              defaultValue: 2
            },
            diameter: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "createBoxWithId",
          blockType: z.COMMAND,
          text: "create box ID [meshId] width [width] height [height] depth [depth]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "myBox"
            },
            width: {
              type: x.NUMBER,
              defaultValue: 1
            },
            height: {
              type: x.NUMBER,
              defaultValue: 1
            },
            depth: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "createSphere",
          blockType: z.REPORTER,
          text: "create sphere diameter [diameter]",
          arguments: {
            diameter: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "createTorus",
          blockType: z.REPORTER,
          text: "create torus diameter [diameter] thickness [thickness]",
          arguments: {
            diameter: {
              type: x.NUMBER,
              defaultValue: 2
            },
            thickness: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "createPlane",
          blockType: z.REPORTER,
          text: "create plane width [width] height [height]",
          arguments: {
            width: {
              type: x.NUMBER,
              defaultValue: 4
            },
            height: {
              type: x.NUMBER,
              defaultValue: 4
            }
          }
        }, {
          opcode: "createText",
          blockType: z.REPORTER,
          text: "create text [text] scale [scale] height [height] color [color]",
          arguments: {
            text: {
              type: x.STRING,
              defaultValue: "Hello"
            },
            scale: {
              type: x.NUMBER,
              defaultValue: 1
            },
            height: {
              type: x.NUMBER,
              defaultValue: 50
            },
            color: {
              type: x.COLOR,
              defaultValue: "#1C3870"
            }
          }
        }, {
          opcode: "loadModel",
          blockType: z.REPORTER,
          text: "load model from [modelUrl]",
          arguments: {
            modelUrl: {
              type: x.STRING,
              defaultValue: "https://assets.babylonjs.com/meshes/Yeti/MayaExport/glTF/Yeti.gltf"
            }
          }
        }, {
          opcode: "loadModelFromDataURL",
          blockType: z.REPORTER,
          text: "load model from data URL [dataURL]",
          arguments: {
            dataURL: {
              type: x.STRING,
              defaultValue: "data:model/gltf-binary;base64,"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Mesh Properties"
        }, {
          opcode: "setPosition",
          blockType: z.COMMAND,
          text: "set mesh [meshId] position X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "moveMesh",
          blockType: z.COMMAND,
          text: "move mesh [meshId] X [x] Y [y] Z [z] coordinate [coordinateType]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            coordinateType: {
              type: x.STRING,
              menu: "coordinateTypes",
              defaultValue: "world"
            }
          }
        }, {
          opcode: "setRotation",
          blockType: z.COMMAND,
          text: "set mesh [meshId] rotation X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.ANGLE,
              defaultValue: 0
            },
            y: {
              type: x.ANGLE,
              defaultValue: 0
            },
            z: {
              type: x.ANGLE,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setScale",
          blockType: z.COMMAND,
          text: "set mesh [meshId] scale X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 1
            },
            y: {
              type: x.NUMBER,
              defaultValue: 1
            },
            z: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setColor",
          blockType: z.COMMAND,
          text: "set mesh [meshId] color [color]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ff0000"
            }
          }
        }, {
          opcode: "setMeshMinZ",
          blockType: z.COMMAND,
          text: "set mesh [meshId] minZ [minZ]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minZ: {
              type: x.NUMBER,
              defaultValue: 0.45
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Physics"
        }, {
          opcode: "setMeshMass",
          blockType: z.COMMAND,
          text: "set mesh [meshId] mass [mass]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            mass: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "applyImpulse",
          blockType: z.COMMAND,
          text: "apply impulse to mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 10
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setGravity",
          blockType: z.COMMAND,
          text: "set gravity [gravity]",
          arguments: {
            gravity: {
              type: x.NUMBER,
              defaultValue: -9.81
            }
          }
        }, {
          opcode: "setCollisionsEnabled",
          blockType: z.COMMAND,
          text: "set collisions enabled [enabled]",
          arguments: {
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "setMeshApplyGravity",
          blockType: z.COMMAND,
          text: "set mesh [meshId] apply gravity [enabled]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "setMeshFriction",
          blockType: z.COMMAND,
          text: "set mesh [meshId] friction [friction]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            friction: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setMeshRestitution",
          blockType: z.COMMAND,
          text: "set mesh [meshId] restitution [restitution]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            restitution: {
              type: x.NUMBER,
              defaultValue: 0.3
            }
          }
        }, {
          opcode: "setMeshPhysicsProperties",
          blockType: z.COMMAND,
          text: "set mesh [meshId] mass [mass] friction [friction] restitution [restitution]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            mass: {
              type: x.NUMBER,
              defaultValue: 1
            },
            friction: {
              type: x.NUMBER,
              defaultValue: 0.5
            },
            restitution: {
              type: x.NUMBER,
              defaultValue: 0.3
            }
          }
        }, {
          opcode: "setPhysicsMode",
          blockType: z.COMMAND,
          text: "set mesh [meshId] physics mode [mode]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            mode: {
              type: x.STRING,
              menu: "physicsModes",
              defaultValue: "dynamic"
            }
          }
        }, {
          opcode: "applyTorque",
          blockType: z.COMMAND,
          text: "apply torque to mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 10
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "applyAngularImpulse",
          blockType: z.COMMAND,
          text: "apply angular impulse to mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setMeshAngularVelocity",
          blockType: z.COMMAND,
          text: "set mesh [meshId] angular velocity X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 1
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "getMeshAngularVelocityX",
          blockType: z.REPORTER,
          text: "mesh [meshId] angular velocity X",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getMeshAngularVelocityY",
          blockType: z.REPORTER,
          text: "mesh [meshId] angular velocity Y",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getMeshAngularVelocityZ",
          blockType: z.REPORTER,
          text: "mesh [meshId] angular velocity Z",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Get Properties"
        }, {
          opcode: "getPositionX",
          blockType: z.REPORTER,
          text: "mesh [meshId] X position",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getPositionY",
          blockType: z.REPORTER,
          text: "mesh [meshId] Y position",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getPositionZ",
          blockType: z.REPORTER,
          text: "mesh [meshId] Z position",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getRotationX",
          blockType: z.REPORTER,
          text: "mesh [meshId] X rotation",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getRotationY",
          blockType: z.REPORTER,
          text: "mesh [meshId] Y rotation",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getRotationZ",
          blockType: z.REPORTER,
          text: "mesh [meshId] Z rotation",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "meshExists",
          blockType: z.BOOLEAN,
          text: "mesh [meshId] exists",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "convertCoordinates",
          blockType: z.REPORTER,
          text: "mesh [meshId] [fromSystem] X [x] Y [y] Z [z] to [toSystem]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            fromSystem: {
              type: x.STRING,
              menu: "coordinateTypes",
              defaultValue: "world"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            toSystem: {
              type: x.STRING,
              menu: "coordinateTypes",
              defaultValue: "world"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Parent-Child Relationships"
        }, {
          opcode: "setParent",
          blockType: z.COMMAND,
          text: "set mesh [meshId] parent to [parentId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            parentId: {
              type: x.STRING,
              defaultValue: ""
            }
          }
        }, {
          opcode: "setCameraParent",
          blockType: z.COMMAND,
          text: "set camera parent to [parentId]",
          arguments: {
            parentId: {
              type: x.STRING,
              defaultValue: ""
            }
          }
        }, {
          opcode: "removeParent",
          blockType: z.COMMAND,
          text: "remove parent from mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "removeCameraParent",
          blockType: z.COMMAND,
          text: "remove parent from camera"
        }, "---", {
          blockType: z.LABEL,
          text: "Mesh Visibility"
        }, {
          opcode: "showMesh",
          blockType: z.COMMAND,
          text: "show mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "hideMesh",
          blockType: z.COMMAND,
          text: "hide mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setMeshVisibility",
          blockType: z.COMMAND,
          text: "set mesh [meshId] visibility [visible]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            visible: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "isMeshVisible",
          blockType: z.BOOLEAN,
          text: "mesh [meshId] is visible",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Mesh Management"
        }, {
          opcode: "removeMesh",
          blockType: z.COMMAND,
          text: "remove mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "clearAllMeshes",
          blockType: z.COMMAND,
          text: "clear all meshes"
        }, {
          opcode: "getMeshCount",
          blockType: z.REPORTER,
          text: "mesh count"
        }, {
          opcode: "playMeshAnimation",
          blockType: z.COMMAND,
          text: "play animation for mesh [meshId] loop [loop]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            loop: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "stopMeshAnimation",
          blockType: z.COMMAND,
          text: "stop animation for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Camera"
        }, {
          opcode: "setCameraPosition",
          blockType: z.COMMAND,
          text: "set camera position X [x] Y [y] Z [z]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: -(860218 ^ 860208)
            }
          }
        }, {
          opcode: "setCameraTarget",
          blockType: z.COMMAND,
          text: "set camera target X [x] Y [y] Z [z]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setCameraType",
          blockType: z.COMMAND,
          text: "set camera type [cameraType] position X [x] Y [y] Z [z]",
          arguments: {
            cameraType: {
              type: x.STRING,
              menu: "cameraTypes",
              defaultValue: "arc rotate"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: -(544546 ^ 544552)
            }
          }
        }, {
          opcode: "setCameraFOV",
          blockType: z.COMMAND,
          text: "set camera FOV [fov]",
          arguments: {
            fov: {
              type: x.NUMBER,
              defaultValue: 45
            }
          }
        }, {
          opcode: "setCameraAttachControl",
          blockType: z.COMMAND,
          text: "set camera attach control [enabled]",
          arguments: {
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "setCameraMinZ",
          blockType: z.COMMAND,
          text: "set camera minZ [minZ]",
          arguments: {
            minZ: {
              type: x.NUMBER,
              defaultValue: 0.45
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Textures"
        }, {
          opcode: "setTexture",
          blockType: z.COMMAND,
          text: "set mesh [meshId] texture from [textureData]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            textureData: {
              type: x.STRING,
              defaultValue: "https://playground.babylonjs.com/textures/grass.jpg"
            }
          }
        }, {
          opcode: "textureFromUrl",
          blockType: z.REPORTER,
          text: "texture from URL [url]",
          arguments: {
            url: {
              type: x.STRING,
              defaultValue: "https://playground.babylonjs.com/textures/grass.jpg"
            }
          }
        }, {
          opcode: "textureFromDataURI",
          blockType: z.REPORTER,
          text: "texture from data URI [dataURI]",
          arguments: {
            dataURI: {
              type: x.STRING,
              defaultValue: "data:image/png;base64,"
            }
          }
        }, {
          opcode: "textureFromBase64",
          blockType: z.REPORTER,
          text: "texture from base64 [base64]",
          arguments: {
            base64: {
              type: x.STRING,
              defaultValue: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Materials"
        }, {
          opcode: "setMaterialProperty",
          blockType: z.COMMAND,
          text: "set mesh [meshId] material [property] to [value]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            property: {
              type: x.STRING,
              menu: "materialProperties",
              defaultValue: "roughness"
            },
            value: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setEmissiveColor",
          blockType: z.COMMAND,
          text: "set mesh [meshId] emissive color [color]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            color: {
              type: x.COLOR,
              defaultValue: "#000000"
            }
          }
        }, {
          opcode: "setSpecularColor",
          blockType: z.COMMAND,
          text: "set mesh [meshId] specular color [color]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Lighting"
        }, {
          opcode: "createPointLight",
          blockType: z.REPORTER,
          text: "create point light position X [x] Y [y] Z [z] intensity [intensity] color [color]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 5
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: 5
            },
            intensity: {
              type: x.NUMBER,
              defaultValue: 1
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            }
          }
        }, {
          opcode: "createDirectionalLight",
          blockType: z.REPORTER,
          text: "create directional light direction X [x] Y [y] Z [z] intensity [intensity] color [color]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: -(789282 ^ 789283)
            },
            y: {
              type: x.NUMBER,
              defaultValue: -(574411 ^ 574409)
            },
            z: {
              type: x.NUMBER,
              defaultValue: -(211346 ^ 211347)
            },
            intensity: {
              type: x.NUMBER,
              defaultValue: 1
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            }
          }
        }, {
          opcode: "createSpotLight",
          blockType: z.REPORTER,
          text: "create spot light position X [x] Y [y] Z [z] target X [targetX] Y [targetY] Z [targetZ] angle [angle] intensity [intensity] color [color]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            targetX: {
              type: x.NUMBER,
              defaultValue: 0
            },
            targetY: {
              type: x.NUMBER,
              defaultValue: 0
            },
            targetZ: {
              type: x.NUMBER,
              defaultValue: 0
            },
            angle: {
              type: x.NUMBER,
              defaultValue: 45
            },
            intensity: {
              type: x.NUMBER,
              defaultValue: 1
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            }
          }
        }, {
          opcode: "setAmbientLight",
          blockType: z.COMMAND,
          text: "set ambient light color [color]",
          arguments: {
            color: {
              type: x.COLOR,
              defaultValue: "#000000"
            }
          }
        }, {
          opcode: "enableShadows",
          blockType: z.COMMAND,
          text: "enable shadows for light [lightId]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "disableShadows",
          blockType: z.COMMAND,
          text: "disable shadows for light [lightId]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setShadowMapSize",
          blockType: z.COMMAND,
          text: "set shadow map size for light [lightId] to [size]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            size: {
              type: x.NUMBER,
              defaultValue: 1024
            }
          }
        }, {
          opcode: "setShadowFilterType",
          blockType: z.COMMAND,
          text: "set shadow filter for light [lightId] to [filterType]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            filterType: {
              type: x.STRING,
              menu: "shadowFilterTypes",
              defaultValue: "exponential"
            }
          }
        }, {
          opcode: "setShadowBias",
          blockType: z.COMMAND,
          text: "set shadow bias for light [lightId] to [bias]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            bias: {
              type: x.NUMBER,
              defaultValue: 0.00005
            }
          }
        }, {
          opcode: "setMeshShadowCasting",
          blockType: z.COMMAND,
          text: "set mesh [meshId] cast shadows [enabled]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "setMeshShadowReceiving",
          blockType: z.COMMAND,
          text: "set mesh [meshId] receive shadows [enabled]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "addShadowCaster",
          blockType: z.COMMAND,
          text: "add mesh [meshId] as shadow caster for light [lightId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "removeShadowCaster",
          blockType: z.COMMAND,
          text: "remove mesh [meshId] from shadow caster for light [lightId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setShadowDarkness",
          blockType: z.COMMAND,
          text: "set shadow darkness for light [lightId] to [darkness]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            darkness: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setContactHardeningShadows",
          blockType: z.COMMAND,
          text: "set contact hardening shadows for light [lightId] enabled [enabled] light size [lightSize]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            enabled: {
              type: x.BOOLEAN,
              defaultValue: false
            },
            lightSize: {
              type: x.NUMBER,
              defaultValue: 0.0075
            }
          }
        }, {
          opcode: "deleteLight",
          blockType: z.COMMAND,
          text: "delete light [lightId]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "light1"
            }
          }
        }, {
          opcode: "setMeshLightingParticipation",
          blockType: z.COMMAND,
          text: "set mesh [meshId] lighting participation [enabled]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            enabled: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "getMeshLightingParticipation",
          blockType: z.BOOLEAN,
          text: "mesh [meshId] participates in lighting?",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Particle Systems"
        }, {
          opcode: "createParticleSystem",
          blockType: z.REPORTER,
          text: "create particle system capacity [capacity]",
          arguments: {
            capacity: {
              type: x.NUMBER,
              defaultValue: 1000
            }
          }
        }, {
          opcode: "setParticleTexture",
          blockType: z.COMMAND,
          text: "set particle system [systemId] texture [textureUrl]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            textureUrl: {
              type: x.STRING,
              defaultValue: "https://www.babylonjs.com/assets/Flare.png"
            }
          }
        }, {
          opcode: "setParticleEmitter",
          blockType: z.COMMAND,
          text: "set particle system [systemId] emitter [emitterId]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            emitterId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setParticleEmitterPosition",
          blockType: z.COMMAND,
          text: "set particle system [systemId] emitter position X [x] Y [y] Z [z]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setParticleColor",
          blockType: z.COMMAND,
          text: "set particle system [systemId] color1 [color1] color2 [color2] colorDead [colorDead]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            color1: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            },
            color2: {
              type: x.COLOR,
              defaultValue: "#ffff00"
            },
            colorDead: {
              type: x.COLOR,
              defaultValue: "#000000"
            }
          }
        }, {
          opcode: "setParticleSize",
          blockType: z.COMMAND,
          text: "set particle system [systemId] size min [minSize] max [maxSize]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minSize: {
              type: x.NUMBER,
              defaultValue: 0.1
            },
            maxSize: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setParticleLifeTime",
          blockType: z.COMMAND,
          text: "set particle system [systemId] lifetime min [minLife] max [maxLife]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minLife: {
              type: x.NUMBER,
              defaultValue: 0.5
            },
            maxLife: {
              type: x.NUMBER,
              defaultValue: 3
            }
          }
        }, {
          opcode: "setParticleEmissionRate",
          blockType: z.COMMAND,
          text: "set particle system [systemId] emission rate [rate]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            rate: {
              type: x.NUMBER,
              defaultValue: 50
            }
          }
        }, {
          opcode: "setParticlePower",
          blockType: z.COMMAND,
          text: "set particle system [systemId] power min [minPower] max [maxPower]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minPower: {
              type: x.NUMBER,
              defaultValue: 1
            },
            maxPower: {
              type: x.NUMBER,
              defaultValue: 3
            }
          }
        }, {
          opcode: "setParticleGravity",
          blockType: z.COMMAND,
          text: "set particle system [systemId] gravity X [x] Y [y] Z [z]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: -9.81
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setParticleRotation",
          blockType: z.COMMAND,
          text: "set particle system [systemId] rotation min [minRotation] max [maxRotation]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minRotation: {
              type: x.NUMBER,
              defaultValue: 0
            },
            maxRotation: {
              type: x.NUMBER,
              defaultValue: 6.28
            }
          }
        }, {
          opcode: "setParticleDirection",
          blockType: z.COMMAND,
          text: "set particle system [systemId] direction min X [minX] Y [minY] Z [minZ] max X [maxX] Y [maxY] Z [maxZ]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minX: {
              type: x.NUMBER,
              defaultValue: -(169292 ^ 169293)
            },
            minY: {
              type: x.NUMBER,
              defaultValue: 1
            },
            minZ: {
              type: x.NUMBER,
              defaultValue: -(298072 ^ 298073)
            },
            maxX: {
              type: x.NUMBER,
              defaultValue: 1
            },
            maxY: {
              type: x.NUMBER,
              defaultValue: 1
            },
            maxZ: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setParticleEmitBox",
          blockType: z.COMMAND,
          text: "set particle system [systemId] emit box min X [minX] Y [minY] Z [minZ] max X [maxX] Y [maxY] Z [maxZ]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            },
            minX: {
              type: x.NUMBER,
              defaultValue: -(861477 ^ 861476)
            },
            minY: {
              type: x.NUMBER,
              defaultValue: -(766206 ^ 766207)
            },
            minZ: {
              type: x.NUMBER,
              defaultValue: -(815794 ^ 815795)
            },
            maxX: {
              type: x.NUMBER,
              defaultValue: 1
            },
            maxY: {
              type: x.NUMBER,
              defaultValue: 1
            },
            maxZ: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "startParticleSystem",
          blockType: z.COMMAND,
          text: "start particle system [systemId]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "stopParticleSystem",
          blockType: z.COMMAND,
          text: "stop particle system [systemId]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "resetParticleSystem",
          blockType: z.COMMAND,
          text: "reset particle system [systemId]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "deleteParticleSystem",
          blockType: z.COMMAND,
          text: "delete particle system [systemId]",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getParticleSystemAliveCount",
          blockType: z.REPORTER,
          text: "particle system [systemId] alive particle count",
          arguments: {
            systemId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Environment"
        }, {
          opcode: "setSkybox",
          blockType: z.COMMAND,
          text: "set skybox texture [textureUrl]",
          arguments: {
            textureUrl: {
              type: x.STRING,
              defaultValue: "https://playground.babylonjs.com/textures/TropicalSunnyDay"
            }
          }
        }, {
          opcode: "removeSkybox",
          blockType: z.COMMAND,
          text: "remove skybox"
        }, {
          opcode: "setFog",
          blockType: z.COMMAND,
          text: "set fog color [color] density [density]",
          arguments: {
            color: {
              type: x.COLOR,
              defaultValue: "#cccccc"
            },
            density: {
              type: x.NUMBER,
              defaultValue: 0.1
            }
          }
        }, {
          opcode: "removeFog",
          blockType: z.COMMAND,
          text: "remove fog"
        }, {
          opcode: "createLensFlare",
          blockType: z.COMMAND,
          text: "create lens flare on light [lightId] color [color] size [size]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            },
            size: {
              type: x.NUMBER,
              defaultValue: 100
            }
          }
        }, {
          opcode: "removeLensFlare",
          blockType: z.COMMAND,
          text: "remove lens flare from light [lightId]",
          arguments: {
            lightId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "createReflectionProbe",
          blockType: z.REPORTER,
          text: "create reflection probe refresh rate [refreshRate] resolution [resolution]",
          arguments: {
            refreshRate: {
              type: x.NUMBER,
              defaultValue: 1000
            },
            resolution: {
              type: x.NUMBER,
              defaultValue: 512
            }
          }
        }, {
          opcode: "addMeshToReflectionProbe",
          blockType: z.COMMAND,
          text: "add mesh [meshId] to reflection probe [probeId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            probeId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "removeReflectionProbe",
          blockType: z.COMMAND,
          text: "remove reflection probe [probeId]",
          arguments: {
            probeId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Animation"
        }, {
          opcode: "animateRotation",
          blockType: z.COMMAND,
          text: "animate mesh [meshId] rotation axis [axis] speed [speed] duration [duration]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            axis: {
              type: x.STRING,
              menu: "animationAxes",
              defaultValue: "Y"
            },
            speed: {
              type: x.NUMBER,
              defaultValue: 90
            },
            duration: {
              type: x.NUMBER,
              defaultValue: 2
            }
          }
        }, {
          opcode: "animatePosition",
          blockType: z.COMMAND,
          text: "animate mesh [meshId] position to X [x] Y [y] Z [z] duration [duration]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            duration: {
              type: x.NUMBER,
              defaultValue: 2
            }
          }
        }, {
          opcode: "stopAnimation",
          blockType: z.COMMAND,
          text: "stop animation for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "playSkeletalAnimation",
          blockType: z.COMMAND,
          text: "play skeletal animation [animationName] for mesh [meshId] loop [loop]",
          arguments: {
            animationName: {
              type: x.STRING,
              defaultValue: "idle"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            loop: {
              type: x.BOOLEAN,
              defaultValue: true
            }
          }
        }, {
          opcode: "stopSkeletalAnimation",
          blockType: z.COMMAND,
          text: "stop skeletal animation for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "blendSkeletalAnimation",
          blockType: z.COMMAND,
          text: "blend to animation [toAnim] from animation [fromAnim] on mesh [meshId] duration [duration]",
          arguments: {
            toAnim: {
              type: x.STRING,
              defaultValue: "run"
            },
            fromAnim: {
              type: x.STRING,
              defaultValue: "idle"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            duration: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setAnimationWeight",
          blockType: z.COMMAND,
          text: "set animation [animationName] weight [weight] on mesh [meshId]",
          arguments: {
            animationName: {
              type: x.STRING,
              defaultValue: "idle"
            },
            weight: {
              type: x.NUMBER,
              defaultValue: 1
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "crossFadeAnimations",
          blockType: z.COMMAND,
          text: "crossfade animation [fromAnim] to [toAnim] on mesh [meshId] speed [speed]",
          arguments: {
            fromAnim: {
              type: x.STRING,
              defaultValue: "idle"
            },
            toAnim: {
              type: x.STRING,
              defaultValue: "run"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            speed: {
              type: x.NUMBER,
              defaultValue: 0.01
            }
          }
        }, {
          opcode: "getAnimationWeight",
          blockType: z.REPORTER,
          text: "animation [animationName] weight on mesh [meshId]",
          arguments: {
            animationName: {
              type: x.STRING,
              defaultValue: "idle"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "isAnimationPlaying",
          blockType: z.BOOLEAN,
          text: "animation [animationName] is playing on mesh [meshId]",
          arguments: {
            animationName: {
              type: x.STRING,
              defaultValue: "idle"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getMeshAnimationNames",
          blockType: z.REPORTER,
          text: "mesh [meshId] animation names",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Ray Casting"
        }, {
          opcode: "createRay",
          blockType: z.REPORTER,
          text: "create ray from X [x] Y [y] Z [z] direction X [dirX] Y [dirY] Z [dirZ]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirX: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirY: {
              type: x.NUMBER,
              defaultValue: -(501964 ^ 501965)
            },
            dirZ: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "rayIntersectsMesh",
          blockType: z.BOOLEAN,
          text: "ray [rayId] intersects mesh [meshId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "rayMultiIntersectsMesh",
          blockType: z.BOOLEAN,
          text: "ray [rayId] multi intersects mesh [meshId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getRayHitPoint",
          blockType: z.REPORTER,
          text: "ray [rayId] hit point",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "pickWithRay",
          blockType: z.REPORTER,
          text: "pick with ray from X [x] Y [y] Z [z] direction X [dirX] Y [dirY] Z [dirZ]",
          arguments: {
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 5
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirX: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirY: {
              type: x.NUMBER,
              defaultValue: -(507352 ^ 507353)
            },
            dirZ: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "showRay",
          blockType: z.COMMAND,
          text: "show ray [rayId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "hideRay",
          blockType: z.COMMAND,
          text: "hide ray [rayId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "deleteRay",
          blockType: z.COMMAND,
          text: "delete ray [rayId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "updateRay",
          blockType: z.COMMAND,
          text: "update ray [rayId] from X [x] Y [y] Z [z] direction X [dirX] Y [dirY] Z [dirZ]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirX: {
              type: x.NUMBER,
              defaultValue: 0
            },
            dirY: {
              type: x.NUMBER,
              defaultValue: -(535282 ^ 535283)
            },
            dirZ: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "multiPickWithRay",
          blockType: z.REPORTER,
          text: "multi pick with ray [rayId]",
          arguments: {
            rayId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Bones & Skeletons"
        }, {
          opcode: "getBoneCount",
          blockType: z.REPORTER,
          text: "mesh [meshId] bone count",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getBoneName",
          blockType: z.REPORTER,
          text: "mesh [meshId] bone [index] name",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            index: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "getBoneWorldPosition",
          blockType: z.REPORTER,
          text: "mesh [meshId] bone [boneName] world position",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            }
          }
        }, {
          opcode: "getBoneLocalPosition",
          blockType: z.REPORTER,
          text: "mesh [meshId] bone [boneName] local position",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            }
          }
        }, {
          opcode: "setBonePosition",
          blockType: z.COMMAND,
          text: "set bone [boneName] of mesh [meshId] position X [x] Y [y] Z [z]",
          arguments: {
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "setBoneRotation",
          blockType: z.COMMAND,
          text: "set bone [boneName] of mesh [meshId] rotation X [x] Y [y] Z [z]",
          arguments: {
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.ANGLE,
              defaultValue: 0
            },
            y: {
              type: x.ANGLE,
              defaultValue: 0
            },
            z: {
              type: x.ANGLE,
              defaultValue: 0
            }
          }
        }, {
          opcode: "getBonePosition",
          blockType: z.REPORTER,
          text: "bone [boneName] of mesh [meshId] position",
          arguments: {
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getMeshBoneNames",
          blockType: z.REPORTER,
          text: "mesh [meshId] bone names",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Collisions"
        }, {
          opcode: "enableMeshCollisions",
          blockType: z.COMMAND,
          text: "enable mesh [meshId] collisions",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "disableMeshCollisions",
          blockType: z.COMMAND,
          text: "disable mesh [meshId] collisions",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "meshesIntersect",
          blockType: z.BOOLEAN,
          text: "mesh [meshId1] intersects mesh [meshId2]",
          arguments: {
            meshId1: {
              type: x.STRING,
              defaultValue: "1"
            },
            meshId2: {
              type: x.STRING,
              defaultValue: "2"
            }
          }
        }, {
          opcode: "setCollisionGroup",
          blockType: z.COMMAND,
          text: "set mesh [meshId] collision group to [group]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            group: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setCollisionMask",
          blockType: z.COMMAND,
          text: "set mesh [meshId] collision mask to [mask]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            mask: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, "---", {
          blockType: z.LABEL,
          text: "Ragdolls"
        }, {
          opcode: "createRagdoll",
          blockType: z.COMMAND,
          text: "create ragdoll from mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "configureRagdollPart",
          blockType: z.COMMAND,
          text: "configure ragdoll part [boneName] of mesh [meshId] mass [mass] shape [shape]",
          arguments: {
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            mass: {
              type: x.NUMBER,
              defaultValue: 1
            },
            shape: {
              type: x.STRING,
              menu: "ragdollShapes",
              defaultValue: "box"
            }
          }
        }, {
          opcode: "enableRagdollPhysics",
          blockType: z.COMMAND,
          text: "enable ragdoll physics for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "disableRagdollPhysics",
          blockType: z.COMMAND,
          text: "disable ragdoll physics for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "applyImpulseToRagdollPart",
          blockType: z.COMMAND,
          text: "apply impulse to ragdoll part [boneName] of mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            boneName: {
              type: x.STRING,
              defaultValue: "head"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 10
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Shaders"
        }, {
          opcode: "createCustomShader",
          blockType: z.REPORTER,
          text: "create custom shader vertex [vertexCode] fragment [fragmentCode]",
          arguments: {
            vertexCode: {
              type: x.STRING,
              defaultValue: `precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 worldViewProjection;
varying vec2 vUV;
void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}`
            },
            fragmentCode: {
              type: x.STRING,
              defaultValue: `precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
void main(void) {
    gl_FragColor = texture2D(textureSampler, vUV);
}`
            }
          }
        }, {
          opcode: "createPresetShader",
          blockType: z.REPORTER,
          text: "create preset shader type [presetType]",
          arguments: {
            presetType: {
              type: x.STRING,
              menu: "presetShaderTypes",
              defaultValue: "wave"
            }
          }
        }, {
          opcode: "setShaderUniform",
          blockType: z.COMMAND,
          text: "set shader [shaderId] uniform [uniformName] to [value] type [type]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            uniformName: {
              type: x.STRING,
              defaultValue: "time"
            },
            value: {
              type: x.NUMBER,
              defaultValue: 1
            },
            type: {
              type: x.STRING,
              menu: "uniformTypes",
              defaultValue: "float"
            }
          }
        }, {
          opcode: "setShaderVectorUniform",
          blockType: z.COMMAND,
          text: "set shader [shaderId] vector uniform [uniformName] X [x] Y [y] Z [z] W [w]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            uniformName: {
              type: x.STRING,
              defaultValue: "color"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 1
            },
            y: {
              type: x.NUMBER,
              defaultValue: 1
            },
            z: {
              type: x.NUMBER,
              defaultValue: 1
            },
            w: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setShaderTexture",
          blockType: z.COMMAND,
          text: "set shader [shaderId] texture [samplerName] to [textureId]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            samplerName: {
              type: x.STRING,
              defaultValue: "textureSampler"
            },
            textureId: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setShaderColorUniform",
          blockType: z.COMMAND,
          text: "set shader [shaderId] color uniform [uniformName] to [color]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            uniformName: {
              type: x.STRING,
              defaultValue: "tintColor"
            },
            color: {
              type: x.COLOR,
              defaultValue: "#ffffff"
            }
          }
        }, {
          opcode: "applyShaderToMesh",
          blockType: z.COMMAND,
          text: "apply shader [shaderId] to mesh [meshId]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            meshId: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "removeShaderFromMesh",
          blockType: z.COMMAND,
          text: "remove shader from mesh [meshId]",
          arguments: {
            meshId: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "setShaderTime",
          blockType: z.COMMAND,
          text: "set shader [shaderId] time uniform [uniformName] to current time",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            uniformName: {
              type: x.STRING,
              defaultValue: "time"
            }
          }
        }, {
          opcode: "updateShaderCode",
          blockType: z.COMMAND,
          text: "update shader [shaderId] code vertex [vertexCode] fragment [fragmentCode]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            vertexCode: {
              type: x.STRING,
              defaultValue: ""
            },
            fragmentCode: {
              type: x.STRING,
              defaultValue: ""
            }
          }
        }, {
          opcode: "getShaderUniform",
          blockType: z.REPORTER,
          text: "shader [shaderId] uniform [uniformName] value",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            },
            uniformName: {
              type: x.STRING,
              defaultValue: "time"
            }
          }
        }, {
          opcode: "deleteShader",
          blockType: z.COMMAND,
          text: "delete shader [shaderId]",
          arguments: {
            shaderId: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "clearAllShaders",
          blockType: z.COMMAND,
          text: "clear all shaders"
        }, {
          opcode: "getShaderCount",
          blockType: z.REPORTER,
          text: "shader count"
        }, "---", {
          blockType: z.LABEL,
          text: "Audio"
        }, {
          opcode: "createSound",
          blockType: z.REPORTER,
          text: "create sound from [audioSource]",
          arguments: {
            audioSource: {
              type: x.STRING,
              defaultValue: "https://playground.babylonjs.com/sounds/musket.mp3"
            }
          }
        }, {
          opcode: "createSoundFromBase64",
          blockType: z.REPORTER,
          text: "create sound from base64 [base64]",
          arguments: {
            base64: {
              type: x.STRING,
              defaultValue: ""
            }
          }
        }, {
          opcode: "playSound",
          blockType: z.COMMAND,
          text: "play sound [soundId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "stopSound",
          blockType: z.COMMAND,
          text: "stop sound [soundId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "pauseSound",
          blockType: z.COMMAND,
          text: "pause sound [soundId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "resumeSound",
          blockType: z.COMMAND,
          text: "resume sound [soundId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setSoundVolume",
          blockType: z.COMMAND,
          text: "set sound [soundId] volume [volume]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            volume: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setSoundLoop",
          blockType: z.COMMAND,
          text: "set sound [soundId] loop [loop]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            loop: {
              type: x.BOOLEAN,
              defaultValue: false
            }
          }
        }, {
          opcode: "setSoundPosition",
          blockType: z.COMMAND,
          text: "set sound [soundId] position X [x] Y [y] Z [z]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "attachSoundToMesh",
          blockType: z.COMMAND,
          text: "attach sound [soundId] to mesh [meshId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "detachSoundFromMesh",
          blockType: z.COMMAND,
          text: "detach sound [soundId] from mesh",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "setSoundDistanceModel",
          blockType: z.COMMAND,
          text: "set sound [soundId] distance model [model]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            model: {
              type: x.STRING,
              menu: "distanceModels",
              defaultValue: "inverse"
            }
          }
        }, {
          opcode: "setSoundMaxDistance",
          blockType: z.COMMAND,
          text: "set sound [soundId] max distance [maxDistance]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            maxDistance: {
              type: x.NUMBER,
              defaultValue: 100
            }
          }
        }, {
          opcode: "setSoundPlaybackRate",
          blockType: z.COMMAND,
          text: "set sound [soundId] playback rate [rate]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            },
            rate: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "isSoundPlaying",
          blockType: z.BOOLEAN,
          text: "sound [soundId] is playing",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getSoundDuration",
          blockType: z.REPORTER,
          text: "sound [soundId] duration",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "getSoundCurrentTime",
          blockType: z.REPORTER,
          text: "sound [soundId] current time",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "removeSound",
          blockType: z.COMMAND,
          text: "remove sound [soundId]",
          arguments: {
            soundId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "clearAllSounds",
          blockType: z.COMMAND,
          text: "clear all sounds"
        }, {
          opcode: "setMasterVolume",
          blockType: z.COMMAND,
          text: "set master volume [volume]",
          arguments: {
            volume: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, "---".split("").reverse().join(""), {
          blockType: z.LABEL,
          text: "Character Controller"
        }, {
          opcode: "enableCharacterController",
          blockType: z.COMMAND,
          text: "enable character controller for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "disableCharacterController",
          blockType: z.COMMAND,
          text: "disable character controller for mesh [meshId]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "moveCharacterController",
          blockType: z.COMMAND,
          text: "move character controller mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 0
            },
            z: {
              type: x.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: "rotateCharacterController",
          blockType: z.COMMAND,
          text: "rotate character controller mesh [meshId] X [x] Y [y] Z [z]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            x: {
              type: x.NUMBER,
              defaultValue: 0
            },
            y: {
              type: x.NUMBER,
              defaultValue: 45
            },
            z: {
              type: x.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: "jumpCharacterController",
          blockType: z.COMMAND,
          text: "jump character controller mesh [meshId] height [height]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            height: {
              type: x.NUMBER,
              defaultValue: 5
            }
          }
        }, {
          opcode: "setCharacterControllerHeight",
          blockType: z.COMMAND,
          text: "set character controller mesh [meshId] height [height]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            height: {
              type: x.NUMBER,
              defaultValue: 2
            }
          }
        }, {
          opcode: "setCharacterControllerRadius",
          blockType: z.COMMAND,
          text: "set character controller mesh [meshId] radius [radius]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            radius: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setCharacterControllerGravity",
          blockType: z.COMMAND,
          text: "set character controller mesh [meshId] gravity [gravity]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            gravity: {
              type: x.NUMBER,
              defaultValue: -9.81
            }
          }
        }, {
          opcode: "setCharacterControllerFriction",
          blockType: z.COMMAND,
          text: "set character controller mesh [meshId] friction [friction]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            friction: {
              type: x.NUMBER,
              defaultValue: 0.5
            }
          }
        }, {
          opcode: "setCharacterControllerRestitution",
          blockType: z.COMMAND,
          text: "set character controller mesh [meshId] restitution [restitution]",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            },
            restitution: {
              type: x.NUMBER,
              defaultValue: 0.3
            }
          }
        }, {
          opcode: "getCharacterControllerState",
          blockType: z.REPORTER,
          text: "character controller mesh [meshId] state",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, {
          opcode: "isCharacterControllerGrounded",
          blockType: z.BOOLEAN,
          text: "character controller mesh [meshId] is grounded",
          arguments: {
            meshId: {
              type: x.STRING,
              defaultValue: "1"
            }
          }
        }, "---".split("").reverse().join("")],
        menus: {
          textureSources: {
            acceptReporters: true,
            items: "textureSources"
          },
          materialProperties: {
            acceptReporters: true,
            items: "materialProperties"
          },
          cameraTypes: {
            acceptReporters: true,
            items: "cameraTypes"
          },
          animationAxes: {
            acceptReporters: true,
            items: "animationAxes"
          },
          coordinateTypes: {
            acceptReporters: true,
            items: "coordinateTypes"
          },
          physicsModes: {
            acceptReporters: true,
            items: "physicsModes"
          },
          ragdollShapes: {
            acceptReporters: true,
            items: "ragdollShapes"
          },
          distanceModels: {
            acceptReporters: true,
            items: "distanceModels"
          },
          shadowFilterTypes: {
            acceptReporters: true,
            items: "shadowFilterTypes"
          },
          uniformTypes: {
            acceptReporters: true,
            items: "uniformTypes"
          },
          presetShaderTypes: {
            acceptReporters: true,
            items: "presetShaderTypes"
          }
        }
      };
    }
    findMeshIdFromMesh(a) {
      if (!a) {
        return null;
      }
      if (a.metadata && a.metadata.id) {
        return a.metadata.id;
      }
      if (a.metadata && a.metadata.parentId) {
        return a.metadata.parentId;
      }
      if (a.parent) {
        return this.findMeshIdFromMesh(a.parent);
      }
      for (let [b, c] of U) {
        if (c === a) {
          return b;
        }
      }
      return null;
    }
    initScene() {
      Va();
    }
    isInitialize() {
      return K !== null;
    }
    findMeshId(a) {
      var b = (321633 ^ 321632) + (233582 ^ 233580);
      const c = A.toString(a.meshName);
      b = "doqoge".split("").reverse().join("");
      if (!K) {
        return "";
      }
      var d = (765480 ^ 765485) + (939320 ^ 939323);
      const e = K.meshes.find(a => a.name === c);
      d = "dohkbg".split("").reverse().join("");
      if (!e) {
        return "";
      }
      var f;
      const g = this.findMeshIdFromMesh(e);
      f = (490165 ^ 490165) + (220814 ^ 220807);
      return g || "";
    }
    resetScene() {
      gb();
    }
    createBox(a) {
      if (!K) {
        return "";
      }
      var b;
      const d = A.toNumber(a.width);
      b = (974040 ^ 974033) + (159104 ^ 159104);
      const e = A.toNumber(a.height);
      var f;
      const g = A.toNumber(a.depth);
      f = (678056 ^ 678063) + (738018 ^ 738022);
      var h = (176839 ^ 176838) + (722892 ^ 722889);
      const i = BABYLON.MeshBuilder.CreateBox(`box_${c}`, {
        width: d,
        height: e,
        depth: g
      }, K);
      h = (357093 ^ 357092) + (285104 ^ 285107);
      const j = new BABYLON.StandardMaterial(`mat_${c}`, K);
      j.diffuseColor = new BABYLON.Color3(697166 ^ 697167, 487381 ^ 487380, 701680 ^ 701681);
      i.material = j;
      var k = (260364 ^ 260362) + (240330 ^ 240323);
      const l = (++c).toString();
      k = (589974 ^ 589969) + (501943 ^ 501943);
      i.metadata = {
        id: l
      };
      U.set(l, i);
      return l;
    }
    createSphere(a) {
      if (!K) {
        return "";
      }
      var b;
      const d = A.toNumber(a.diameter);
      b = 285343 ^ 285341;
      var e;
      const f = BABYLON.MeshBuilder.CreateSphere(`sphere_${c}`, {
        diameter: d
      }, K);
      e = (207945 ^ 207947) + (131928 ^ 131934);
      const g = new BABYLON.StandardMaterial(`mat_${c}`, K);
      g.diffuseColor = new BABYLON.Color3(691558 ^ 691559, 920360 ^ 920361, 213147 ^ 213146);
      f.material = g;
      var h;
      const i = (++c).toString();
      h = 621219 ^ 621223;
      f.metadata = {
        id: i
      };
      U.set(i, f);
      return i;
    }
    createGround(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.width);
      var d;
      const e = A.toNumber(a.height);
      d = "hlggmo";
      const f = BABYLON.MeshBuilder.CreateGround(`ground_${c}`, {
        width: b,
        height: e
      }, K);
      try {
        const a = f.getBoundingInfo().boundingBox.extendSize;
        const b = new BABYLON.PhysicsShapeBox(new BABYLON.Vector3(458170 ^ 458170, 944199 ^ 944199, 249947 ^ 249947), new BABYLON.Quaternion(381991 ^ 381991, 808523 ^ 808523, 488821 ^ 488821, 687391 ^ 687390), a, K);
        const c = {
          friction: 0.5,
          restitution: 0.3
        };
        b.material = c;
        f.physicsBody = new BABYLON.PhysicsBody(f, BABYLON.PhysicsMotionType.STATIC, false, K);
        f.physicsBody.shape = b;
        f.physicsBody.setMassProperties({
          mass: 0
        });
      } catch (a) {
        console.warn(":etagerggAscisyhP ot kcab gnillaf ,IPA wen htiw scisyhp dnuorg etaerc ot deliaF".split("").reverse().join(""), a);
        f.physicsBody = new BABYLON.PhysicsAggregate(f, BABYLON.PhysicsShapeType.BOX, {
          mass: 0,
          friction: 0.5,
          restitution: 0.3
        }, K);
      }
      var g;
      const h = new BABYLON.StandardMaterial(`mat_${c}`, K);
      g = "lbqlam".split("").reverse().join("");
      h.diffuseColor = new BABYLON.Color3(304721 ^ 304720, 651046 ^ 651047, 405099 ^ 405098);
      f.material = h;
      var i = (271642 ^ 271644) + (199345 ^ 199347);
      const j = (++c).toString();
      i = (559531 ^ 559535) + (182202 ^ 182205);
      f.metadata = {
        id: j
      };
      U.set(j, f);
      return j;
    }
    createCylinder(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.height);
      const d = A.toNumber(a.diameter);
      const e = BABYLON.MeshBuilder.CreateCylinder(`cylinder_${c}`, {
        height: b,
        diameter: d
      }, K);
      const f = new BABYLON.StandardMaterial(`mat_${c}`, K);
      f.diffuseColor = new BABYLON.Color3(577823 ^ 577822, 556845 ^ 556844, 741654 ^ 741655);
      e.material = f;
      var g = (633547 ^ 633545) + (541966 ^ 541965);
      const h = (++c).toString();
      g = (992178 ^ 992177) + (726761 ^ 726766);
      e.metadata = {
        id: h
      };
      U.set(h, e);
      return h;
    }
    setPosition(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (739962 ^ 739967) + (145686 ^ 145681);
      var d;
      const e = U.get(c);
      d = "bokkdl".split("").reverse().join("");
      if (!e) {
        return;
      }
      var f;
      const g = A.toNumber(a.x);
      f = (705285 ^ 705292) + (345923 ^ 345931);
      var h;
      const i = A.toNumber(a.y);
      h = 734819 ^ 734818;
      const j = A.toNumber(a.z);
      e.position.x = g;
      e.position.y = i;
      e.position.z = j;
    }
    moveMesh(a) {
      const b = A.toString(a.meshId);
      var c = (764139 ^ 764140) + (511075 ^ 511079);
      const d = U.get(b);
      c = (348536 ^ 348528) + (367810 ^ 367815);
      if (!d) {
        return;
      }
      var e = (866434 ^ 866434) + (354107 ^ 354105);
      const f = A.toNumber(a.x);
      e = "dlqjfp";
      const g = A.toNumber(a.y);
      var h = (975006 ^ 975000) + (584142 ^ 584136);
      const i = A.toNumber(a.z);
      h = "lphgah".split("").reverse().join("");
      var j = (876389 ^ 876385) + (703268 ^ 703277);
      const k = A.toString(a.coordinateType);
      j = (444275 ^ 444278) + (320554 ^ 320554);
      switch (k) {
        case "dlrow".split("").reverse().join(""):
          d.position.x += f;
          d.position.y += g;
          d.position.z += i;
          break;
        case "local":
          var l = (529010 ^ 529019) + (348100 ^ 348100);
          const a = new BABYLON.Vector3(f, g, i);
          l = 695427 ^ 695424;
          const b = BABYLON.Vector3.TransformCoordinates(a, d.getWorldMatrix());
          var m = (996305 ^ 996310) + (790121 ^ 790122);
          const c = b.subtract(d.position);
          m = "jopofm";
          d.position.x += c.x;
          d.position.y += c.y;
          d.position.z += c.z;
          break;
        case "aremac".split("").reverse().join(""):
          if (!M) {
            return;
          }
          let e;
          if (M instanceof BABYLON.ArcRotateCamera) {
            const a = M.target.subtract(M.position).normalize();
            const b = BABYLON.Vector3.Cross(M.upVector, a).normalize();
            const c = M.upVector;
            e = a.scale(i).add(b.scale(f)).add(c.scale(g));
          } else {
            var n = (495291 ^ 495290) + (388480 ^ 388481);
            const a = M.getDirection(new BABYLON.Vector3(388091 ^ 388091, 334437 ^ 334437, 302425 ^ 302424));
            n = "gpngoj";
            var o = (404988 ^ 404991) + (590451 ^ 590449);
            const b = M.getDirection(new BABYLON.Vector3(986849 ^ 986848, 986303 ^ 986303, 618699 ^ 618699));
            o = 486974 ^ 486967;
            const c = M.getDirection(new BABYLON.Vector3(490526 ^ 490526, 648536 ^ 648537, 367373 ^ 367373));
            e = a.scale(i).add(b.scale(f)).add(c.scale(g));
          }
          d.position.x += e.x;
          d.position.y += e.y;
          d.position.z += e.z;
          break;
        default:
          d.position.x += f;
          d.position.y += g;
          d.position.z += i;
          break;
      }
    }
    setRotation(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = (556909 ^ 556904) + (131674 ^ 131676);
      if (!d) {
        return;
      }
      var e = (410950 ^ 410945) + (888066 ^ 888071);
      const f = A.toNumber(a.x) * Math.PI / (637335 ^ 637219);
      e = (628906 ^ 628898) + (893565 ^ 893557);
      const g = A.toNumber(a.y) * Math.PI / (915577 ^ 915661);
      const h = A.toNumber(a.z) * Math.PI / (773222 ^ 773330);
      d.rotation.x = f;
      d.rotation.y = g;
      d.rotation.z = h;
    }
    setScale(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (392724 ^ 392724) + (251217 ^ 251220);
      var d = (311627 ^ 311627) + (646673 ^ 646676);
      const e = U.get(c);
      d = 375353 ^ 375353;
      if (!e) {
        return;
      }
      const f = A.toNumber(a.x);
      const g = A.toNumber(a.y);
      const h = A.toNumber(a.z);
      e.scaling.set(f, g, h);
    }
    setColor(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c || !c.material) {
        return;
      }
      const d = A.toRgbColorObject(a.color);
      c.material.diffuseColor = new BABYLON.Color3(d.r / (482521 ^ 482342), d.g / (914997 ^ 915146), d.b / (690073 ^ 690022));
    }
    setMeshMinZ(a) {
      const b = A.toString(a.meshId);
      var c = (607826 ^ 607830) + (786248 ^ 786254);
      const d = U.get(b);
      c = (196390 ^ 196389) + (876145 ^ 876150);
      if (!d) {
        return;
      }
      var e = (691491 ^ 691495) + (600865 ^ 600873);
      const f = A.toNumber(a.minZ);
      e = 747422 ^ 747422;
      d.minZ = f;
    }
    setMeshMass(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = "hgliln";
      if (!d) {
        return;
      }
      const e = A.toNumber(a.mass);
      if (d.physicsBody && d.physicsBody instanceof BABYLON.PhysicsAggregate) {
        try {
          if (d.physicsBody.body) {
            d.physicsBody.body.setMassProperties({
              mass: e
            });
            console.log(`Set mass ${e} for mesh ${b} using Physics V2`);
          } else {
            const a = d.physicsBody.shapeType;
            d.physicsBody.dispose();
            d.physicsBody = new BABYLON.PhysicsAggregate(d, a, {
              mass: e
            }, K);
            console.log(`Recreated physics aggregate with mass ${e} for mesh ${b}`);
          }
        } catch (a) {
          console.warn(":2V scisyhP gnisu ssam tes ot deliaF".split("").reverse().join(""), a);
        }
      } else if (d.physicsBody) {
        try {
          d.physicsBody.setMassProperties({
            mass: e
          });
          console.log(`Set mass ${e} for mesh ${b} using PhysicsBody`);
        } catch (a) {
          console.warn(":seitreporp ssam tes ot deliaF".split("").reverse().join(""), a);
        }
      } else {
        console.warn(`Mesh ${b} has no physics body or aggregate. Enable physics first.`);
      }
    }
    applyImpulse(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = (831875 ^ 831882) + (180154 ^ 180157);
      if (!d || !d.physicsBody) {
        return;
      }
      var e = (752073 ^ 752074) + (993995 ^ 993993);
      const f = A.toNumber(a.x);
      e = (943620 ^ 943621) + (212131 ^ 212132);
      var g = (370146 ^ 370151) + (226712 ^ 226716);
      const h = A.toNumber(a.y);
      g = 673162 ^ 673154;
      const i = A.toNumber(a.z);
      try {
        d.physicsBody.applyImpulse(new BABYLON.Vector3(f, h, i), d.getAbsolutePosition());
      } catch (a) {
        if (d.physicsBody.body && d.physicsBody.body.applyImpulse) {
          d.physicsBody.body.applyImpulse(new BABYLON.Vector3(f, h, i), d.getAbsolutePosition());
        } else {
          console.warn("Failed to apply impulse:", a);
        }
      }
    }
    setGravity(a) {
      if (!K) {
        return;
      }
      const b = A.toNumber(a.gravity);
      K.gravity = new BABYLON.Vector3(305380 ^ 305380, b, 993327 ^ 993327);
      if (K.getPhysicsEngine()) {
        K.getPhysicsEngine().setGravity(new BABYLON.Vector3(453341 ^ 453341, b, 871187 ^ 871187));
      }
    }
    setCollisionsEnabled(a) {
      if (!K) {
        return;
      }
      var b = (430145 ^ 430148) + (569329 ^ 569329);
      const c = A.toBoolean(a.enabled);
      b = 347728 ^ 347729;
      K.collisionsEnabled = c;
    }
    setMeshApplyGravity(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return;
      }
      const d = A.toBoolean(a.enabled);
      c.applyGravity = d;
    }
    setMeshFriction(a) {
      const b = A.toString(a.meshId);
      var c = (221000 ^ 221005) + (287258 ^ 287260);
      const d = U.get(b);
      c = "bhpjcm";
      if (!d) {
        return;
      }
      var e = (359925 ^ 359922) + (520373 ^ 520381);
      const f = A.toNumber(a.friction);
      e = "mdqknj";
      if (d.physicsBody && d.physicsBody instanceof BABYLON.PhysicsAggregate) {
        try {
          if (d.physicsBody.shape) {
            if (!d.physicsBody.shape.material) {
              d.physicsBody.shape.material = {};
            }
            d.physicsBody.shape.material.friction = f;
            console.log(`Set friction ${f} for mesh ${b} using Physics V2`);
          }
        } catch (a) {
          console.warn(":2V scisyhP gnisu noitcirf tes ot deliaF".split("").reverse().join(""), a);
        }
      } else if (d.physicsBody) {
        try {
          if (d.physicsBody.shape) {
            if (!d.physicsBody.shape.material) {
              d.physicsBody.shape.material = {};
            }
            d.physicsBody.shape.material.friction = f;
            console.log(`Set friction ${f} for mesh ${b} using PhysicsBody`);
          }
        } catch (a) {
          console.warn("Failed to set friction:", a);
        }
      } else {
        console.warn(`Mesh ${b} has no physics body or aggregate. Enable physics first.`);
      }
    }
    setMeshRestitution(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return;
      }
      var d;
      const e = A.toNumber(a.restitution);
      d = 410269 ^ 410267;
      if (c.physicsBody && c.physicsBody instanceof BABYLON.PhysicsAggregate) {
        try {
          if (c.physicsBody.shape) {
            if (!c.physicsBody.shape.material) {
              c.physicsBody.shape.material = {};
            }
            c.physicsBody.shape.material.restitution = e;
            console.log(`Set restitution ${e} for mesh ${b} using Physics V2`);
          }
        } catch (a) {
          console.warn("Failed to set restitution using Physics V2:", a);
        }
      } else if (c.physicsBody) {
        try {
          if (c.physicsBody.shape) {
            if (!c.physicsBody.shape.material) {
              c.physicsBody.shape.material = {};
            }
            c.physicsBody.shape.material.restitution = e;
            console.log(`Set restitution ${e} for mesh ${b} using PhysicsBody`);
          }
        } catch (a) {
          console.warn(":noitutitser tes ot deliaF".split("").reverse().join(""), a);
        }
      } else {
        console.warn(`Mesh ${b} has no physics body or aggregate. Enable physics first.`);
      }
    }
    setMeshPhysicsProperties(a) {
      var b = (937213 ^ 937211) + (145856 ^ 145859);
      const c = A.toString(a.meshId);
      b = 772803 ^ 772810;
      const d = U.get(c);
      if (!d) {
        return;
      }
      var e;
      const f = A.toNumber(a.mass);
      e = "iedcni".split("").reverse().join("");
      var g;
      const h = A.toNumber(a.friction);
      g = "pcpjfn".split("").reverse().join("");
      const i = A.toNumber(a.restitution);
      if (d.physicsBody) {
        d.physicsBody.dispose();
        d.physicsBody = null;
      }
      d.physicsBody = new BABYLON.PhysicsAggregate(d, BABYLON.PhysicsShapeType.BOX, {
        mass: f,
        friction: h,
        restitution: i
      }, K);
    }
    getPositionX(a) {
      var b = (294534 ^ 294530) + (642849 ^ 642849);
      const c = A.toString(a.meshId);
      b = (987550 ^ 987543) + (230549 ^ 230548);
      const d = U.get(c);
      if (!d) {
        return 866501 ^ 866501;
      }
      return d.position.x;
    }
    getPositionY(a) {
      var b;
      const c = A.toString(a.meshId);
      b = "qnpdol".split("").reverse().join("");
      const d = U.get(c);
      if (!d) {
        return 312047 ^ 312047;
      }
      return d.position.y;
    }
    getPositionZ(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (958300 ^ 958302) + (744235 ^ 744233);
      const d = U.get(c);
      if (!d) {
        return 394933 ^ 394933;
      }
      return d.position.z;
    }
    getRotationX(a) {
      var b;
      const c = A.toString(a.meshId);
      b = "kpepfg";
      const d = U.get(c);
      if (!d) {
        return 953040 ^ 953040;
      }
      if (d.rotationQuaternion) {
        const a = d.rotationQuaternion.toEulerAngles();
        return a.x * (409359 ^ 409531) / Math.PI;
      }
      return d.rotation.x * (778422 ^ 778242) / Math.PI;
    }
    getRotationY(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (861374 ^ 861373) + (164717 ^ 164715);
      const d = U.get(c);
      if (!d) {
        return 283350 ^ 283350;
      }
      if (d.rotationQuaternion) {
        var e = (240123 ^ 240127) + (482577 ^ 482580);
        const a = d.rotationQuaternion.toEulerAngles();
        e = "cdhlab";
        return a.y * (122084 ^ 121936) / Math.PI;
      }
      return d.rotation.y * (470583 ^ 470659) / Math.PI;
    }
    getRotationZ(a) {
      var b = (265568 ^ 265571) + (208630 ^ 208627);
      const c = A.toString(a.meshId);
      b = (671024 ^ 671024) + (458459 ^ 458459);
      const d = U.get(c);
      if (!d) {
        return 380704 ^ 380704;
      }
      if (d.rotationQuaternion) {
        var e;
        const a = d.rotationQuaternion.toEulerAngles();
        e = "ngkgjc";
        return a.z * (820425 ^ 820349) / Math.PI;
      }
      return d.rotation.z * (797394 ^ 797286) / Math.PI;
    }
    convertCoordinates(a) {
      var b = (460087 ^ 460081) + (689670 ^ 689665);
      const c = A.toString(a.meshId);
      b = 717543 ^ 717541;
      var d = (679181 ^ 679180) + (567087 ^ 567082);
      const e = U.get(c);
      d = (904518 ^ 904516) + (480237 ^ 480236);
      if (!e || !M) {
        return "0,0,0".split("").reverse().join("");
      }
      const f = A.toString(a.fromSystem);
      var g = (112950 ^ 112949) + (195138 ^ 195140);
      const h = A.toString(a.toSystem);
      g = "mihecn";
      var i = (235641 ^ 235643) + (563721 ^ 563713);
      const j = A.toNumber(a.x);
      i = "ikbnkl";
      var k;
      const l = A.toNumber(a.y);
      k = "jgjpgj";
      const m = A.toNumber(a.z);
      var n;
      let o = new BABYLON.Vector3(j, l, m);
      n = (952795 ^ 952795) + (155393 ^ 155399);
      let p;
      switch (f) {
        case "dlrow".split("").reverse().join(""):
          p = o;
          break;
        case "lacol".split("").reverse().join(""):
          var q = (804865 ^ 804870) + (813715 ^ 813717);
          const a = e.getWorldMatrix();
          q = (626270 ^ 626270) + (460282 ^ 460283);
          p = BABYLON.Vector3.TransformCoordinates(o, a);
          break;
        case "camera":
          if (M instanceof BABYLON.ArcRotateCamera) {
            const a = M.target.subtract(M.position).normalize();
            const b = BABYLON.Vector3.Cross(M.upVector, a).normalize();
            var r = (843839 ^ 843836) + (372864 ^ 372867);
            const c = M.upVector;
            r = (820835 ^ 820843) + (652898 ^ 652896);
            p = M.position.add(a.scale(m).add(b.scale(j)).add(c.scale(l)));
          } else {
            const a = M.getDirection(new BABYLON.Vector3(517077 ^ 517077, 587954 ^ 587954, 725860 ^ 725861));
            const b = M.getDirection(new BABYLON.Vector3(903446 ^ 903447, 473857 ^ 473857, 926413 ^ 926413));
            const c = M.getDirection(new BABYLON.Vector3(729803 ^ 729803, 961357 ^ 961356, 741278 ^ 741278));
            p = M.position.add(a.scale(m).add(b.scale(j)).add(c.scale(l)));
          }
          break;
        default:
          p = o;
          break;
      }
      switch (h) {
        case "world":
          break;
        case "lacol".split("").reverse().join(""):
          var s = (562521 ^ 562521) + (683114 ^ 683106);
          const a = e.getWorldMatrix().invert();
          s = "pplqfc".split("").reverse().join("");
          p = BABYLON.Vector3.TransformCoordinates(p, a);
          break;
        case "aremac".split("").reverse().join(""):
          if (M instanceof BABYLON.ArcRotateCamera) {
            const a = M.target.subtract(M.position).normalize();
            const b = BABYLON.Vector3.Cross(M.upVector, a).normalize();
            var t = (184995 ^ 184999) + (459771 ^ 459763);
            const c = M.upVector;
            t = "jkljjb".split("").reverse().join("");
            var u;
            const d = p.subtract(M.position);
            u = 689823 ^ 689823;
            var v = (355148 ^ 355149) + (781779 ^ 781777);
            const e = BABYLON.Vector3.Dot(d, b);
            v = (177466 ^ 177471) + (976729 ^ 976728);
            const f = BABYLON.Vector3.Dot(d, c);
            var w = (256062 ^ 256063) + (959302 ^ 959302);
            const g = BABYLON.Vector3.Dot(d, a);
            w = (965099 ^ 965098) + (331199 ^ 331191);
            p = new BABYLON.Vector3(e, f, g);
          } else {
            const a = M.getDirection(new BABYLON.Vector3(908426 ^ 908426, 665240 ^ 665240, 443891 ^ 443890));
            var x = (519396 ^ 519394) + (311647 ^ 311647);
            const b = M.getDirection(new BABYLON.Vector3(813392 ^ 813393, 756295 ^ 756295, 157904 ^ 157904));
            x = (556280 ^ 556273) + (270523 ^ 270523);
            const c = M.getDirection(new BABYLON.Vector3(803817 ^ 803817, 176774 ^ 176775, 788430 ^ 788430));
            var y;
            const d = p.subtract(M.position);
            y = (257395 ^ 257395) + (652256 ^ 652262);
            var z = (897695 ^ 897690) + (841565 ^ 841567);
            const e = BABYLON.Vector3.Dot(d, b);
            z = (538861 ^ 538857) + (398400 ^ 398400);
            var B = (858536 ^ 858529) + (425426 ^ 425430);
            const f = BABYLON.Vector3.Dot(d, c);
            B = "dbolcg".split("").reverse().join("");
            var C = (440646 ^ 440642) + (273788 ^ 273785);
            const g = BABYLON.Vector3.Dot(d, a);
            C = "feejai";
            p = new BABYLON.Vector3(e, f, g);
          }
          break;
        default:
          break;
      }
      return `${p.x.toFixed(936220 ^ 936222)},${p.y.toFixed(840618 ^ 840616)},${p.z.toFixed(330830 ^ 330828)}`;
    }
    meshExists(a) {
      const b = A.toString(a.meshId);
      return U.has(b);
    }
    setParent(a) {
      var b;
      const c = A.toString(a.meshId);
      b = "idhomh".split("").reverse().join("");
      const d = A.toString(a.parentId);
      var e = (405073 ^ 405073) + (294817 ^ 294816);
      const f = U.get(c);
      e = 439891 ^ 439890;
      if (!f) {
        return;
      }
      if (d === "" || d === "camera") {
        if (M) {
          f.parent = M;
        }
      } else {
        const a = U.get(d);
        if (a) {
          f.parent = a;
        }
      }
    }
    setCameraParent(a) {
      var b = (822374 ^ 822374) + (698484 ^ 698480);
      const c = A.toString(a.parentId);
      b = "miqnpf".split("").reverse().join("");
      if (!M) {
        return;
      }
      if (c === "") {
        M.parent = null;
      } else {
        var d;
        const a = U.get(c);
        d = "dgkjci".split("").reverse().join("");
        if (a) {
          M.parent = a;
        }
      }
    }
    setCameraAttachControl(a) {
      if (!M || !H) {
        return;
      }
      const b = A.toBoolean(a.enabled);
      console.log("lortnochcattaaremac".split("").reverse().join(""), b);
      if (b) {
        M.attachControl(H, true);
      } else {
        M.detachControl();
      }
    }
    removeParent(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return;
      }
      c.parent = null;
    }
    removeCameraParent() {
      if (!M) {
        return;
      }
      M.parent = null;
    }
    setPhysicsMode(a) {
      const b = A.toString(a.meshId);
      var c = (385588 ^ 385589) + (852217 ^ 852219);
      const d = U.get(b);
      c = "khdqno";
      if (!d || !K) {
        return;
      }
      var e;
      const f = A.toString(a.mode);
      e = 725065 ^ 725067;
      if (d.physicsBody) {
        d.physicsBody.dispose();
        d.physicsBody = null;
      }
      switch (f) {
        case "enon".split("").reverse().join(""):
          d.physicsBody = null;
          break;
        case "dynamic":
          d.physicsBody = new BABYLON.PhysicsAggregate(d, BABYLON.PhysicsShapeType.BOX, {
            mass: 1,
            friction: 0.5,
            restitution: 0.3
          }, K);
          break;
        case "citats".split("").reverse().join(""):
          d.physicsBody = new BABYLON.PhysicsAggregate(d, BABYLON.PhysicsShapeType.BOX, {
            mass: 0,
            friction: 0.5,
            restitution: 0.3
          }, K);
          break;
      }
    }
    setSkybox(a) {
      if (!K) {
        return;
      }
      var b;
      const c = A.toString(a.textureUrl);
      b = "mhenij";
      if (K.skybox) {
        K.skybox.dispose();
      }
      const d = BABYLON.MeshBuilder.CreateBox("skyBox", {
        size: 1000
      }, K);
      const e = new BABYLON.StandardMaterial("skyBox", K);
      e.backFaceCulling = false;
      e.reflectionTexture = new BABYLON.CubeTexture(c, K);
      e.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      e.diffuseColor = new BABYLON.Color3(281302 ^ 281302, 568659 ^ 568659, 909011 ^ 909011);
      e.specularColor = new BABYLON.Color3(644955 ^ 644955, 373251 ^ 373251, 381483 ^ 381483);
      d.material = e;
      K.skybox = d;
    }
    removeSkybox() {
      if (!K || !K.skybox) {
        return;
      }
      K.skybox.dispose();
      K.skybox = null;
    }
    setFog(a) {
      if (!K) {
        return;
      }
      const b = A.toRgbColorObject(a.color);
      var c = (523796 ^ 523805) + (909368 ^ 909372);
      const d = A.toNumber(a.density);
      c = "mggffe".split("").reverse().join("");
      K.fogMode = BABYLON.Scene.FOGMODE_EXP;
      K.fogColor = new BABYLON.Color3(b.r / (354283 ^ 354068), b.g / (645862 ^ 645657), b.b / (766474 ^ 766709));
      K.fogDensity = d;
    }
    removeFog() {
      if (!K) {
        return;
      }
      K.fogMode = BABYLON.Scene.FOGMODE_NONE;
    }
    createLensFlare(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.lightId);
      const c = A.toRgbColorObject(a.color);
      const d = A.toNumber(a.size);
      var e = (415103 ^ 415100) + (875472 ^ 875479);
      const f = W.get(b) || O;
      e = 220228 ^ 220224;
      if (!f) {
        return;
      }
      if (wa.has(b)) {
        wa.get(b).dispose();
      }
      const g = new BABYLON.LensFlareSystem("lensFlareSystem_" + b, f, K);
      const h = new BABYLON.Color3(c.r / (544460 ^ 544307), c.g / (778552 ^ 778695), c.b / (167964 ^ 168163));
      const i = new BABYLON.LensFlare(d, 673597 ^ 673597, h, "https://playground.babylonjs.com/textures/lens5.png", g);
      wa.set(b, g);
    }
    removeLensFlare(a) {
      const b = A.toString(a.lightId);
      if (wa.has(b)) {
        wa.get(b).dispose();
        wa.delete(b);
      }
    }
    createReflectionProbe(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.refreshRate);
      const d = A.toNumber(a.resolution);
      const e = (++c).toString();
      var f;
      const g = new BABYLON.ReflectionProbe("reflectionProbe_" + e, d, K);
      f = (886760 ^ 886763) + (739246 ^ 739240);
      g.refreshRate = b;
      ua.set(e, g);
      return e;
    }
    addMeshToReflectionProbe(a) {
      const b = A.toString(a.meshId);
      var c = (783570 ^ 783579) + (325625 ^ 325628);
      const d = A.toString(a.probeId);
      c = (730950 ^ 730950) + (880590 ^ 880589);
      var e = (425406 ^ 425405) + (212616 ^ 212622);
      const f = U.get(b);
      e = 509699 ^ 509703;
      const g = ua.get(d);
      if (!f || !g) {
        return;
      }
      g.renderList.push(f);
    }
    removeReflectionProbe(a) {
      const b = A.toString(a.probeId);
      if (ua.has(b)) {
        ua.get(b).dispose();
        ua.delete(b);
      }
    }
    showMesh(a) {
      var b = (177366 ^ 177362) + (916171 ^ 916168);
      const c = A.toString(a.meshId);
      b = (178590 ^ 178589) + (420626 ^ 420624);
      var d = (481670 ^ 481665) + (827621 ^ 827617);
      const e = U.get(c);
      d = "jbhdgm".split("").reverse().join("");
      if (!e) {
        return;
      }
      e.setEnabled(true);
      e.visibility = 442489 ^ 442488;
    }
    hideMesh(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = "ljoile";
      if (!d) {
        return;
      }
      d.setEnabled(false);
      d.visibility = 675033 ^ 675033;
    }
    setMeshVisibility(a) {
      var b = (997812 ^ 997821) + (761808 ^ 761809);
      const c = A.toString(a.meshId);
      b = (317089 ^ 317095) + (224403 ^ 224405);
      const d = A.toBoolean(a.visible);
      var e;
      const f = U.get(c);
      e = 911009 ^ 911008;
      if (!f) {
        return;
      }
      f.setEnabled(d);
      f.visibility = d ? 993667 ^ 993666 : 900688 ^ 900688;
    }
    isMeshVisible(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return false;
      }
      return c.isEnabled() && c.visibility > (521850 ^ 521850);
    }
    removeMesh(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (271792 ^ 271798) + (146388 ^ 146391);
      var d = (231976 ^ 231976) + (711977 ^ 711983);
      const e = U.get(c);
      d = (252156 ^ 252158) + (100216 ^ 100220);
      if (!e) {
        return;
      }
      e.dispose();
      U.delete(c);
    }
    clearAllMeshes() {
      U.forEach((a, b) => {
        a.dispose();
      });
      U.clear();
      c = 491892 ^ 491892;
    }
    getMeshCount() {
      return U.size;
    }
    playMeshAnimation(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.meshId);
      const c = A.toBoolean(a.loop);
      const d = ta.get(b);
      if (d) {
        d.play(c);
      }
    }
    stopMeshAnimation(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.meshId);
      const c = ta.get(b);
      if (c) {
        c.stop();
      }
    }
    setCameraPosition(a) {
      if (!M) {
        return;
      }
      var b;
      const c = A.toNumber(a.x);
      b = "oeloid";
      var d;
      const e = A.toNumber(a.y);
      d = "iihbok";
      const f = A.toNumber(a.z);
      if (M instanceof BABYLON.ArcRotateCamera) {
        M.position.set(c, e, f);
      } else {
        M.position.set(c, e, f);
      }
    }
    setCameraTarget(a) {
      if (!M) {
        return;
      }
      const b = A.toNumber(a.x);
      const c = A.toNumber(a.y);
      var d;
      const e = A.toNumber(a.z);
      d = 558143 ^ 558139;
      M.setTarget(new BABYLON.Vector3(b, c, e));
    }
    setTexture(a, b) {
      var c;
      const d = A.toString(a.meshId);
      c = 224392 ^ 224384;
      var e;
      const f = U.get(d);
      e = (666633 ^ 666639) + (252647 ^ 252640);
      if (!f) {
        return;
      }
      const g = A.toString(a.textureData);
      var h = (705128 ^ 705129) + (704766 ^ 704762);
      let i = null;
      h = (248285 ^ 248276) + (256282 ^ 256285);
      if (g.startsWith("http://") || g.startsWith("https://")) {
        i = new BABYLON.Texture(g, K);
      } else if (g.startsWith("/egami:atad".split("").reverse().join(""))) {
        i = new BABYLON.Texture(g, K);
      } else if (g.length > (740230 ^ 740230) && !g.includes(" ")) {
        var j = (994132 ^ 994133) + (199657 ^ 199658);
        const a = `data:image/png;base64,${g}`;
        j = (906408 ^ 906410) + (275579 ^ 275581);
        i = new BABYLON.Texture(a, K);
      }
      if (i && f.material) {
        f.material.diffuseTexture = i;
      }
    }
    textureFromUrl(a, b) {
      const c = A.toString(a.url);
      b.stackFrame.currentTexture = {
        url: c
      };
      return "[texture data]";
    }
    setMaterialProperty(a) {
      var b = (190365 ^ 190364) + (123511 ^ 123518);
      const c = A.toString(a.meshId);
      b = 898597 ^ 898599;
      var d = (574190 ^ 574189) + (876622 ^ 876618);
      const e = U.get(c);
      d = (862247 ^ 862240) + (782891 ^ 782893);
      if (!e || !e.material) {
        return;
      }
      var f;
      const g = A.toString(a.property);
      f = 120621 ^ 120620;
      const h = A.toNumber(a.value);
      switch (g) {
        case "roughness":
          e.material.roughness = h;
          break;
        case "metallic":
          if (e.material.metallic !== undefined) {
            e.material.metallic = h;
          }
          break;
        case "alpha":
          e.material.alpha = h;
          break;
        case "rewoPraluceps".split("").reverse().join(""):
          e.material.specularPower = h;
          break;
        case "ytisnetnIevissime".split("").reverse().join(""):
          if (e.material.emissiveIntensity !== undefined) {
            e.material.emissiveIntensity = h;
          }
          break;
      }
    }
    setEmissiveColor(a) {
      var b = (916812 ^ 916805) + (366284 ^ 366286);
      const c = A.toString(a.meshId);
      b = "bcikmn".split("").reverse().join("");
      var d = (204153 ^ 204155) + (827428 ^ 827430);
      const e = U.get(c);
      d = (215662 ^ 215655) + (186473 ^ 186479);
      if (!e || !e.material) {
        return;
      }
      const f = A.toRgbColorObject(a.color);
      e.material.emissiveColor = new BABYLON.Color3(f.r / (184418 ^ 184477), f.g / (216507 ^ 216388), f.b / (912371 ^ 912140));
    }
    setSpecularColor(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c || !c.material) {
        return;
      }
      var d = (485567 ^ 485564) + (373710 ^ 373704);
      const e = A.toRgbColorObject(a.color);
      d = (653480 ^ 653482) + (939633 ^ 939634);
      c.material.specularColor = new BABYLON.Color3(e.r / (934437 ^ 934618), e.g / (537124 ^ 537307), e.b / (553388 ^ 553299));
    }
    createText(a) {
      if (!K) {
        return "";
      }
      const b = A.toString(a.text);
      var d;
      const e = A.toNumber(a.scale);
      d = (472912 ^ 472912) + (949378 ^ 949387);
      const f = A.toNumber(a.height);
      const g = A.toRgbColorObject(a.color);
      return new Promise(async a => {
        try {
          if (typeof earcut === "undefined") {
            console.error("Earcut library is not available. Please ensure the Earcut library is loaded.");
            a("");
            return;
          }
          var d = (591468 ^ 591460) + (978872 ^ 978877);
          const k = await fetch("nosj.ralugeR_yvaeH_iTiuHuP_ababilA/tnemhcatta/zyx.oiduts20.enigne20.snoisnetxe//:sptth".split("").reverse().join(""));
          d = 158713 ^ 158716;
          const l = await k.json();
          var h;
          const m = BABYLON.MeshBuilder.CreateText("text_" + ++c, b, l, {
            size: f * e,
            resolution: 64,
            depth: f * 0.5
          }, K);
          h = "pkiloj";
          var i = (619845 ^ 619843) + (973216 ^ 973218);
          const n = new BABYLON.StandardMaterial("textMaterial_" + c, K);
          i = "ehcmcb";
          n.diffuseColor = new BABYLON.Color3(g.r / (417646 ^ 417681), g.g / (863887 ^ 863856), g.b / (393295 ^ 393392));
          n.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
          m.material = n;
          var j;
          const o = c.toString();
          j = 952514 ^ 952517;
          U.set(o, m);
          a(o);
        } catch (b) {
          console.error("Error creating 3D text:", b);
          a("");
        }
      });
    }
    dispose() {
      gb();
      Sa();
      F.removeListener("DEDAOL_TCEJORP".split("").reverse().join(""), gb);
    }
    textureSources() {
      return ["lru".split("").reverse().join("")];
    }
    materialProperties() {
      return ["roughness", "cillatem".split("").reverse().join(""), "alpha", "specularPower", "ytisnetnIevissime".split("").reverse().join("")];
    }
    createBoxWithId(a) {
      if (!K) {
        return "";
      }
      var b;
      const c = A.toString(a.meshId).trim();
      b = (886672 ^ 886681) + (834220 ^ 834217);
      const d = A.toNumber(a.width);
      const e = A.toNumber(a.height);
      var f = (337093 ^ 337101) + (293110 ^ 293118);
      const g = A.toNumber(a.depth);
      f = (984696 ^ 984702) + (501111 ^ 501110);
      var h = (968962 ^ 968971) + (990360 ^ 990365);
      const i = BABYLON.MeshBuilder.CreateBox(`box_${c}`, {
        width: d,
        height: e,
        depth: g
      }, K);
      h = 126664 ^ 126669;
      const j = new BABYLON.StandardMaterial(`mat_${c}`, K);
      j.diffuseColor = new BABYLON.Color3(234266 ^ 234267, 178942 ^ 178943, 819552 ^ 819553);
      i.material = j;
      i.metadata = {
        id: c
      };
      U.set(c, i);
      return c;
    }
    createSphereWithId(a) {
      if (!K) {
        return "";
      }
      const b = A.toString(a.meshId).trim();
      var c;
      const d = A.toNumber(a.diameter);
      c = 850263 ^ 850263;
      const e = BABYLON.MeshBuilder.CreateSphere(`sphere_${b}`, {
        diameter: d
      }, K);
      var f = (497279 ^ 497279) + (748552 ^ 748544);
      const g = new BABYLON.StandardMaterial(`mat_${b}`, K);
      f = (421001 ^ 421007) + (331881 ^ 331883);
      g.diffuseColor = new BABYLON.Color3(279784 ^ 279785, 536638 ^ 536639, 483314 ^ 483315);
      e.material = g;
      e.metadata = {
        id: b
      };
      U.set(b, e);
      return b;
    }
    createTorus(a) {
      if (!K) {
        return "";
      }
      var b = (457868 ^ 457867) + (907741 ^ 907737);
      const d = A.toNumber(a.diameter);
      b = (903508 ^ 903509) + (123543 ^ 123538);
      var e = (155662 ^ 155657) + (277892 ^ 277894);
      const f = A.toNumber(a.thickness);
      e = (621988 ^ 621996) + (807625 ^ 807624);
      const g = BABYLON.MeshBuilder.CreateTorus(`torus_${c}`, {
        diameter: d,
        thickness: f
      }, K);
      const h = new BABYLON.StandardMaterial(`mat_${c}`, K);
      h.diffuseColor = new BABYLON.Color3(930923 ^ 930922, 392018 ^ 392019, 193087 ^ 193086);
      g.material = h;
      var i = (842171 ^ 842169) + (911704 ^ 911708);
      const j = (++c).toString();
      i = (452647 ^ 452644) + (472419 ^ 472416);
      g.metadata = {
        id: j
      };
      U.set(j, g);
      return j;
    }
    createPlane(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.width);
      var d = (860646 ^ 860647) + (844265 ^ 844269);
      const e = A.toNumber(a.height);
      d = (934956 ^ 934953) + (298201 ^ 298207);
      const f = BABYLON.MeshBuilder.CreatePlane(`plane_${c}`, {
        width: b,
        height: e
      }, K);
      f.physicsBody = new BABYLON.PhysicsAggregate(f, BABYLON.PhysicsShapeType.BOX, {
        mass: 0,
        friction: 0.5,
        restitution: 0.3
      }, K);
      var g = (859627 ^ 859619) + (292953 ^ 292956);
      const h = new BABYLON.StandardMaterial(`mat_${c}`, K);
      g = (582483 ^ 582485) + (925709 ^ 925707);
      h.diffuseColor = new BABYLON.Color3(220805 ^ 220804, 769577 ^ 769576, 766062 ^ 766063);
      f.material = h;
      const i = (++c).toString();
      f.metadata = {
        id: i
      };
      U.set(i, f);
      return i;
    }
    textureFromDataURI(a, b) {
      const c = A.toString(a.dataURI);
      b.stackFrame.currentTexture = {
        dataURL: c
      };
      return "]atad erutxet[".split("").reverse().join("");
    }
    textureFromBase64(a, b) {
      const c = A.toString(a.base64);
      var d;
      const e = `data:image/png;base64,${c}`;
      d = (354133 ^ 354132) + (371628 ^ 371631);
      b.stackFrame.currentTexture = {
        dataURL: e
      };
      return "]atad erutxet[".split("").reverse().join("");
    }
    createPointLight(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.x);
      var c;
      const e = A.toNumber(a.y);
      c = 982268 ^ 982260;
      var f;
      const g = A.toNumber(a.z);
      f = "ogdlaj".split("").reverse().join("");
      var h;
      const i = A.toNumber(a.intensity);
      h = (107568 ^ 107571) + (937834 ^ 937837);
      var j;
      const k = A.toRgbColorObject(a.color);
      j = 583519 ^ 583519;
      var l = (962383 ^ 962377) + (464287 ^ 464280);
      const m = (++d).toString();
      l = (315111 ^ 315119) + (954609 ^ 954609);
      const n = new BABYLON.PointLight(`pointlight_${m}`, new BABYLON.Vector3(b, e, g), K);
      n.intensity = i;
      n.diffuse = new BABYLON.Color3(k.r / (682869 ^ 682890), k.g / (206093 ^ 206322), k.b / (703058 ^ 703149));
      W.set(m, n);
      return m;
    }
    createDirectionalLight(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.x);
      const c = A.toNumber(a.y);
      const e = A.toNumber(a.z);
      var f = (597748 ^ 597747) + (326847 ^ 326846);
      const g = A.toNumber(a.intensity);
      f = (590180 ^ 590180) + (960803 ^ 960804);
      var h = (853777 ^ 853777) + (757517 ^ 757514);
      const i = A.toRgbColorObject(a.color);
      h = (944642 ^ 944647) + (167468 ^ 167464);
      var j;
      const k = (++d).toString();
      j = (608354 ^ 608357) + (740833 ^ 740833);
      const l = new BABYLON.DirectionalLight(`directionallight_${k}`, new BABYLON.Vector3(b, c, e), K);
      l.intensity = g;
      l.diffuse = new BABYLON.Color3(i.r / (372711 ^ 372504), i.g / (613291 ^ 613204), i.b / (323915 ^ 324020));
      W.set(k, l);
      return k;
    }
    createSpotLight(a) {
      if (!K) {
        return "";
      }
      var b;
      const c = A.toNumber(a.x);
      b = (853694 ^ 853691) + (377217 ^ 377222);
      const e = A.toNumber(a.y);
      const f = A.toNumber(a.z);
      const g = A.toNumber(a.targetX);
      const h = A.toNumber(a.targetY);
      const i = A.toNumber(a.targetZ);
      var j = (958516 ^ 958512) + (596831 ^ 596830);
      const k = A.toNumber(a.angle);
      j = 309408 ^ 309414;
      var l;
      const m = A.toNumber(a.intensity);
      l = (179116 ^ 179108) + (794057 ^ 794063);
      var n = (127533 ^ 127525) + (202685 ^ 202676);
      const o = A.toRgbColorObject(a.color);
      n = 914585 ^ 914577;
      const p = (++d).toString();
      var q = (852923 ^ 852914) + (970233 ^ 970234);
      const r = new BABYLON.SpotLight(`spotlight_${p}`, new BABYLON.Vector3(c, e, f), new BABYLON.Vector3(g, h, i), k, K);
      q = (651718 ^ 651717) + (184406 ^ 184406);
      r.intensity = m;
      r.diffuse = new BABYLON.Color3(o.r / (916021 ^ 916170), o.g / (851337 ^ 851318), o.b / (868433 ^ 868526));
      W.set(p, r);
      return p;
    }
    setAmbientLight(a) {
      if (!K) {
        return;
      }
      const b = A.toRgbColorObject(a.color);
      K.ambientColor = new BABYLON.Color3(b.r / (468553 ^ 468662), b.g / (329120 ^ 329055), b.b / (922055 ^ 921912));
    }
    enableShadows(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.lightId);
      let c = W.get(b);
      if (!c) {
        if (K.lights.length > (258147 ^ 258147)) {
          c = K.lights[951687 ^ 951687];
        } else {
          console.warn("No light found to enable shadows");
          return;
        }
      }
      const d = `shadow_${b}`;
      let e = za.get(d);
      if (!e) {
        e = new BABYLON.ShadowGenerator(987325 ^ 988349, c);
        e.useExponentialShadowMap = true;
        e.bias = 0.00005;
        za.set(d, e);
        console.log(`Created shadow generator for light ${b}`);
      }
      K.meshes.forEach(a => {
        a.receiveShadows = true;
        a.castShadows = true;
        if (a.castShadows) {
          e.addShadowCaster(a);
        }
      });
      if (c instanceof BABYLON.DirectionalLight) {
        c.shadowMinZ = 602416 ^ 602417;
        c.shadowMaxZ = 376976 ^ 377076;
        c.autoUpdateExtends = true;
      } else if (c instanceof BABYLON.SpotLight) {
        c.shadowMinZ = 359992 ^ 359993;
        c.shadowMaxZ = 629071 ^ 629035;
      } else if (c instanceof BABYLON.PointLight) {
        console.log(")pamebuc gnisu( delbane swodahs thgil tnioP".split("").reverse().join(""));
      }
    }
    disableShadows(a) {
      if (!K) {
        return;
      }
      var b;
      const c = A.toString(a.lightId);
      b = (113782 ^ 113782) + (294651 ^ 294643);
      var d = (782145 ^ 782153) + (832949 ^ 832949);
      const e = `shadow_${c}`;
      d = "pideko";
      const f = za.get(e);
      if (f) {
        f.dispose();
        za.delete(e);
        console.log(`Disabled shadows for light ${c}`);
      }
    }
    setShadowMapSize(a) {
      if (!K) {
        return;
      }
      var b;
      const c = A.toString(a.lightId);
      b = (475173 ^ 475172) + (156315 ^ 156319);
      const d = A.toNumber(a.size);
      var e = (302625 ^ 302626) + (541243 ^ 541234);
      const f = `shadow_${c}`;
      e = (423284 ^ 423281) + (382429 ^ 382431);
      const g = za.get(f);
      if (g) {
        const a = W.get(c);
        if (a) {
          g.dispose();
          const b = new BABYLON.ShadowGenerator(d, a);
          b.useExponentialShadowMap = true;
          b.bias = 0.00005;
          K.meshes.forEach(a => {
            if (a.castShadows) {
              b.addShadowCaster(a);
            }
          });
          za.set(f, b);
          console.log(`Updated shadow map size to ${d} for light ${c}`);
        }
      }
    }
    setShadowFilterType(a) {
      if (!K) {
        return;
      }
      var b;
      const c = A.toString(a.lightId);
      b = (143569 ^ 143570) + (207517 ^ 207514);
      const d = A.toString(a.filterType);
      const e = `shadow_${c}`;
      const f = za.get(e);
      if (f) {
        f.usePoissonSampling = false;
        f.useExponentialShadowMap = false;
        f.useBlurExponentialShadowMap = false;
        f.usePercentageCloserFiltering = false;
        f.useContactHardeningShadow = false;
        switch (d) {
          case "enon".split("").reverse().join(""):
            break;
          case "nossiop".split("").reverse().join(""):
            f.usePoissonSampling = true;
            break;
          case "laitnenopxe".split("").reverse().join(""):
            f.useExponentialShadowMap = true;
            break;
          case "laitnenopxErulb".split("").reverse().join(""):
            f.useBlurExponentialShadowMap = true;
            break;
          case "fcp".split("").reverse().join(""):
            f.usePercentageCloserFiltering = true;
            break;
          case "gninedraHtcatnoc".split("").reverse().join(""):
            f.useContactHardeningShadow = true;
            break;
        }
        console.log(`Set shadow filter type to ${d} for light ${c}`);
      }
    }
    setShadowBias(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.lightId);
      const c = A.toNumber(a.bias);
      const d = `shadow_${b}`;
      var e = (389643 ^ 389635) + (171459 ^ 171459);
      const f = za.get(d);
      e = 627304 ^ 627308;
      if (f) {
        f.bias = c;
        console.log(`Set shadow bias to ${c} for light ${b}`);
      }
    }
    setMeshShadowCasting(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = A.toBoolean(a.enabled);
      c = 856923 ^ 856914;
      const e = U.get(b);
      if (e) {
        e.castShadows = d;
        console.log(`Set mesh ${b} cast shadows to ${d}`);
      }
    }
    setMeshShadowReceiving(a) {
      var b = (439260 ^ 439252) + (724912 ^ 724912);
      const c = A.toString(a.meshId);
      b = 121380 ^ 121378;
      const d = A.toBoolean(a.enabled);
      var e = (510110 ^ 510107) + (405197 ^ 405199);
      const f = U.get(c);
      e = 510844 ^ 510847;
      if (f) {
        f.receiveShadows = d;
        console.log(`Set mesh ${c} receive shadows to ${d}`);
      }
    }
    addShadowCaster(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.meshId);
      var c = (420489 ^ 420493) + (117762 ^ 117761);
      const d = A.toString(a.lightId);
      c = "lojhfl";
      var e;
      const f = U.get(b);
      e = 298461 ^ 298453;
      var g;
      const h = `shadow_${d}`;
      g = "fogjip";
      const i = za.get(h);
      if (f && i) {
        i.addShadowCaster(f);
        f.castShadows = true;
        console.log(`Added mesh ${b} as shadow caster for light ${d}`);
      }
    }
    removeShadowCaster(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.meshId);
      var c;
      const d = A.toString(a.lightId);
      c = (367784 ^ 367790) + (718954 ^ 718954);
      const e = U.get(b);
      var f = (251325 ^ 251327) + (190446 ^ 190441);
      const g = `shadow_${d}`;
      f = (559446 ^ 559446) + (982321 ^ 982328);
      const h = za.get(g);
      if (e && h) {
        h.removeShadowCaster(e);
        e.castShadows = false;
        console.log(`Removed mesh ${b} from shadow caster for light ${d}`);
      }
    }
    setShadowDarkness(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.lightId);
      var c = (236828 ^ 236828) + (708395 ^ 708398);
      const d = A.toNumber(a.darkness);
      c = (638483 ^ 638482) + (262090 ^ 262091);
      const e = `shadow_${b}`;
      const f = za.get(e);
      if (f) {
        f.darkness = d;
        console.log(`Set shadow darkness to ${d} for light ${b}`);
      }
    }
    setContactHardeningShadows(a) {
      if (!K) {
        return;
      }
      const b = A.toString(a.lightId);
      var c;
      const d = A.toBoolean(a.enabled);
      c = (483909 ^ 483909) + (715798 ^ 715798);
      var e = (667136 ^ 667142) + (812190 ^ 812185);
      const f = A.toNumber(a.lightSize);
      e = "dagdjm".split("").reverse().join("");
      const g = `shadow_${b}`;
      var h = (102964 ^ 102963) + (859339 ^ 859338);
      const i = za.get(g);
      h = (255987 ^ 255987) + (584199 ^ 584198);
      if (i) {
        i.useContactHardeningShadow = d;
        if (d) {
          i.contactHardeningLightSizeUVRatio = f;
          const a = W.get(b);
          if (a) {
            a.shadowMinZ = 309513 ^ 309512;
            a.shadowMaxZ = 470001 ^ 469909;
          }
        }
        console.log(`Set contact hardening shadows to ${d} for light ${b}`);
      }
    }
    setCameraType(a) {
      if (!K) {
        return;
      }
      var b = (737374 ^ 737366) + (352354 ^ 352358);
      const c = A.toString(a.cameraType);
      b = "naocgm";
      const d = A.toNumber(a.x);
      const e = A.toNumber(a.y);
      const f = A.toNumber(a.z);
      if (M) {
        M.dispose();
      }
      if (c === "eerf".split("").reverse().join("")) {
        M = new BABYLON.FreeCamera(`camera`, new BABYLON.Vector3(d, e, f), K);
        M.attachControl(H, false);
      } else if (c === "universal") {
        M = new BABYLON.UniversalCamera(`camera`, new BABYLON.Vector3(d, e, f), K);
        M.attachControl(H, false);
      } else {
        M = new BABYLON.ArcRotateCamera("camera", -Math.PI / (435746 ^ 435744), Math.PI / 2.5, 598553 ^ 598547, new BABYLON.Vector3(d, e, f), K);
        M.attachControl(H, false);
        M.lowerRadiusLimit = 457587 ^ 457590;
        M.upperRadiusLimit = 370014 ^ 370028;
      }
    }
    setCameraFOV(a) {
      if (!M) {
        return;
      }
      var b;
      const c = A.toNumber(a.fov);
      b = 843068 ^ 843065;
      M.fov = c * Math.PI / (973135 ^ 973307);
    }
    setCameraMinZ(a) {
      if (!M) {
        return;
      }
      var b = (417976 ^ 417977) + (849876 ^ 849874);
      const c = A.toNumber(a.minZ);
      b = (354769 ^ 354774) + (317900 ^ 317902);
      M.minZ = c;
    }
    animateRotation(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = 432463 ^ 432459;
      if (!d || !K) {
        return;
      }
      const e = A.toString(a.axis);
      var f = (833122 ^ 833127) + (140262 ^ 140262);
      const g = A.toNumber(a.speed);
      f = (325394 ^ 325395) + (504043 ^ 504043);
      const h = A.toNumber(a.duration);
      K.stopAnimation(d, `rotation_${e}_${b}`);
      var i = (102502 ^ 102502) + (838478 ^ 838478);
      const j = new BABYLON.Animation(`rotation_${e}_${b}`, `rotation.${e.toLowerCase()}`, 688525 ^ 688531, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      i = (426691 ^ 426699) + (698658 ^ 698666);
      var k;
      const l = d.rotation[e.toLowerCase()];
      k = (560618 ^ 560623) + (742348 ^ 742347);
      const m = g * Math.PI / (916722 ^ 916550) * h;
      const n = [];
      n.push({
        frame: 0,
        value: l
      });
      n.push({
        frame: h * (836000 ^ 836030),
        value: l + m
      });
      j.setKeys(n);
      d.animations.push(j);
      K.beginAnimation(d, 820630 ^ 820630, h * (990918 ^ 990936), true);
    }
    stopAnimation(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (640202 ^ 640200) + (914816 ^ 914823);
      const d = U.get(c);
      if (!d) {
        return;
      }
      K.stopAnimation(d);
    }
    animatePosition(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (835103 ^ 835094) + (300357 ^ 300352);
      const d = U.get(c);
      if (!d) {
        return;
      }
      var e;
      const f = A.toNumber(a.x);
      e = (500099 ^ 500103) + (208369 ^ 208372);
      const g = A.toNumber(a.y);
      const h = A.toNumber(a.z);
      var i;
      const j = A.toNumber(a.duration);
      i = 214661 ^ 214662;
      BABYLON.Animation.CreateAndStartAnimation(`position_${c}`, d, "noitisop".split("").reverse().join(""), 253066 ^ 253076, j * (867563 ^ 867543), d.position.clone(), new BABYLON.Vector3(f, g, h), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }
    meshTypes() {
      return ["box", "sphere", "dnuorg".split("").reverse().join(""), "cylinder", "surot".split("").reverse().join(""), "plane"];
    }
    cameraTypes() {
      return ["arc rotate", "free", "lasrevinu".split("").reverse().join("")];
    }
    lightTypes() {
      return ["tniop".split("").reverse().join(""), "directional", "spot", "hemispheric"];
    }
    animationAxes() {
      return ["X", "Y", "Z"];
    }
    textureTypes() {
      return ["url", "emutsoc".split("").reverse().join(""), "datauri", "base64"];
    }
    coordinateTypes() {
      return ["dlrow".split("").reverse().join(""), "local", "aremac".split("").reverse().join("")];
    }
    physicsModes() {
      return ["none", "cimanyd".split("").reverse().join(""), "static"];
    }
    ragdollShapes() {
      return ["xob".split("").reverse().join(""), "erehps".split("").reverse().join(""), "eluspac".split("").reverse().join(""), "rednilyc".split("").reverse().join("")];
    }
    distanceModels() {
      return ["linear", "inverse", "exponential"];
    }
    shadowFilterTypes() {
      return ["none", "poisson", "laitnenopxe".split("").reverse().join(""), "blurExponential", "fcp".split("").reverse().join(""), "contactHardening"];
    }
    uniformTypes() {
      return ["taolf".split("").reverse().join(""), "int", "bool"];
    }
    presetShaderTypes() {
      return ["evaw".split("").reverse().join(""), "tneidarg".split("").reverse().join(""), "hctilg".split("").reverse().join(""), "hologram"];
    }
    createRay(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.x);
      const c = A.toNumber(a.y);
      const d = A.toNumber(a.z);
      var e = (316945 ^ 316951) + (420372 ^ 420372);
      const f = A.toNumber(a.dirX);
      e = 218157 ^ 218159;
      var g = (627875 ^ 627874) + (363820 ^ 363822);
      const i = A.toNumber(a.dirY);
      g = "fhedcp";
      const j = A.toNumber(a.dirZ);
      const k = new BABYLON.Vector3(b, c, d);
      const l = new BABYLON.Vector3(f, i, j).normalize();
      const m = new BABYLON.Ray(k, l);
      const n = (++h).toString();
      ba.set(n, m);
      return n;
    }
    rayIntersectsMesh(a) {
      const b = A.toString(a.rayId);
      var c;
      const d = A.toString(a.meshId);
      c = (917314 ^ 917317) + (793265 ^ 793270);
      var e = (122788 ^ 122786) + (644324 ^ 644320);
      const f = ba.get(b);
      e = "ckqddd";
      if (!f) {
        return false;
      }
      var g = (456952 ^ 456959) + (187353 ^ 187353);
      const h = K.pickWithRay(f);
      g = "ifinbh";
      if (!h || !h.hit || !h.pickedMesh) {
        return false;
      }
      var i;
      const j = this.findMeshIdFromMesh(h.pickedMesh);
      i = "pbqofc";
      return j === d;
    }
    rayMultiIntersectsMesh(a) {
      const b = A.toString(a.rayId);
      var c;
      const d = A.toString(a.meshId);
      c = 473184 ^ 473186;
      var e = (602992 ^ 603001) + (938910 ^ 938906);
      const f = ba.get(b);
      e = "oofnaf";
      if (!f) {
        return false;
      }
      const g = K.multiPickWithRay(f);
      if (!g || g.length === (941477 ^ 941477)) {
        return false;
      }
      for (let b of g) {
        if (b.hit && b.pickedMesh) {
          var h = (735254 ^ 735250) + (648895 ^ 648889);
          const a = this.findMeshIdFromMesh(b.pickedMesh);
          h = "jkhjjn";
          if (a === d) {
            return true;
          }
        }
      }
      return false;
    }
    getRayHitPoint(a) {
      var b;
      const c = A.toString(a.rayId);
      b = "alhpjo".split("").reverse().join("");
      var d = (163411 ^ 163409) + (504620 ^ 504619);
      const e = ba.get(c);
      d = 461690 ^ 461690;
      if (!e) {
        return "0,0,0".split("").reverse().join("");
      }
      const f = K.pickWithRay(e);
      if (f && f.hit && f.pickedPoint) {
        return `${f.pickedPoint.x.toFixed(321333 ^ 321335)},${f.pickedPoint.y.toFixed(426958 ^ 426956)},${f.pickedPoint.z.toFixed(721550 ^ 721548)}`;
      }
      return "0,0,0";
    }
    pickWithRay(a) {
      if (!K) {
        return "";
      }
      const b = A.toNumber(a.x);
      var c;
      const d = A.toNumber(a.y);
      c = 117867 ^ 117859;
      var e = (718670 ^ 718664) + (714750 ^ 714750);
      const f = A.toNumber(a.z);
      e = "dcbiqf";
      const g = A.toNumber(a.dirX);
      var h;
      const i = A.toNumber(a.dirY);
      h = (631613 ^ 631608) + (238492 ^ 238484);
      const j = A.toNumber(a.dirZ);
      var k = (587271 ^ 587269) + (627697 ^ 627701);
      const l = new BABYLON.Vector3(b, d, f);
      k = 801775 ^ 801768;
      var m;
      const n = new BABYLON.Vector3(g, i, j).normalize();
      m = (295352 ^ 295344) + (473389 ^ 473386);
      const o = new BABYLON.Ray(l, n);
      var p = (756885 ^ 756887) + (587579 ^ 587578);
      const q = K.pickWithRay(o);
      p = 994099 ^ 994097;
      if (q && q.hit && q.pickedMesh) {
        var r;
        const a = this.findMeshIdFromMesh(q.pickedMesh);
        r = "fnmjqi";
        if (a) {
          return a;
        }
        return q.pickedMesh.name || "nwonknu".split("").reverse().join("");
      }
      return "";
    }
    showRay(a) {
      var b = (257497 ^ 257503) + (140226 ^ 140228);
      const c = A.toString(a.rayId);
      b = (436730 ^ 436731) + (174297 ^ 174296);
      var d = (570069 ^ 570067) + (384790 ^ 384798);
      const e = ba.get(c);
      d = "cfiahi";
      if (!e || !K) {
        return;
      }
      let f = fa.get(c);
      if (!f) {
        f = new BABYLON.RayHelper(e, K);
        fa.set(c, f);
      }
      f.show(K);
    }
    hideRay(a) {
      const b = A.toString(a.rayId);
      const c = fa.get(b);
      if (c) {
        c.hide();
      }
    }
    deleteRay(a) {
      const b = A.toString(a.rayId);
      ba.delete(b);
      var c;
      const d = fa.get(b);
      c = 309781 ^ 309783;
      if (d) {
        d.dispose();
        fa.delete(b);
      }
    }
    updateRay(a) {
      var b;
      const c = A.toString(a.rayId);
      b = 772825 ^ 772826;
      var d = (933439 ^ 933435) + (863555 ^ 863557);
      const e = ba.get(c);
      d = "cmlklh";
      if (!e) {
        return;
      }
      const f = A.toNumber(a.x);
      var g = (260277 ^ 260278) + (774327 ^ 774325);
      const h = A.toNumber(a.y);
      g = "jllfce";
      var i = (118273 ^ 118276) + (929859 ^ 929859);
      const j = A.toNumber(a.z);
      i = 794976 ^ 794977;
      var k;
      const l = A.toNumber(a.dirX);
      k = "mhjfhn";
      const m = A.toNumber(a.dirY);
      const n = A.toNumber(a.dirZ);
      e.origin = new BABYLON.Vector3(f, h, j);
      e.direction = new BABYLON.Vector3(l, m, n).normalize();
    }
    multiPickWithRay(a) {
      var b = (758599 ^ 758597) + (170938 ^ 170936);
      const c = A.toString(a.rayId);
      b = (222982 ^ 222978) + (829991 ^ 829986);
      var d = (211598 ^ 211596) + (145094 ^ 145095);
      const e = ba.get(c);
      d = 440575 ^ 440575;
      if (!e || !K) {
        return "";
      }
      const f = K.multiPickWithRay(e);
      if (!f || f.length === (366920 ^ 366920)) {
        return "";
      }
      const g = [];
      for (let b of f) {
        if (b.hit && b.pickedMesh) {
          const a = this.findMeshIdFromMesh(b.pickedMesh);
          if (a) {
            g.push(a);
          } else {
            g.push(b.pickedMesh.name || "nwonknu".split("").reverse().join(""));
          }
        }
      }
      return g.join(",");
    }
    applyTorque(a) {
      var b = (745496 ^ 745502) + (582173 ^ 582165);
      const c = A.toString(a.meshId);
      b = (305106 ^ 305109) + (351875 ^ 351875);
      const d = U.get(c);
      if (!d || !d.physicsBody) {
        return;
      }
      var e = (298889 ^ 298889) + (566204 ^ 566205);
      const f = A.toNumber(a.x);
      e = (619735 ^ 619730) + (725229 ^ 725231);
      var g = (721769 ^ 721772) + (586211 ^ 586208);
      const h = A.toNumber(a.y);
      g = 653627 ^ 653629;
      var i = (445583 ^ 445581) + (284851 ^ 284859);
      const j = A.toNumber(a.z);
      i = 924090 ^ 924083;
      try {
        if (d.physicsBody.applyTorque) {
          d.physicsBody.applyTorque(new BABYLON.Vector3(f, h, j));
        } else if (d.physicsBody.body && d.physicsBody.body.applyTorque) {
          d.physicsBody.body.applyTorque(new BABYLON.Vector3(f, h, j));
        }
      } catch (a) {
        console.warn("Failed to apply torque:", a);
      }
    }
    applyAngularImpulse(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = (554068 ^ 554065) + (976436 ^ 976435);
      if (!d || !d.physicsBody) {
        return;
      }
      var e = (123060 ^ 123062) + (861361 ^ 861360);
      const f = A.toNumber(a.x);
      e = 984457 ^ 984463;
      const g = A.toNumber(a.y);
      const h = A.toNumber(a.z);
      try {
        if (d.physicsBody.applyAngularImpulse) {
          d.physicsBody.applyAngularImpulse(new BABYLON.Vector3(f, g, h));
        } else if (d.physicsBody.body && d.physicsBody.body.applyAngularImpulse) {
          d.physicsBody.body.applyAngularImpulse(new BABYLON.Vector3(f, g, h));
        }
      } catch (a) {
        console.warn(":eslupmi ralugna ylppa ot deliaF".split("").reverse().join(""), a);
      }
    }
    setMeshAngularVelocity(a) {
      var b = (637007 ^ 637000) + (314819 ^ 314826);
      const c = A.toString(a.meshId);
      b = "mpnbjc".split("").reverse().join("");
      const d = U.get(c);
      if (!d || !d.physicsBody) {
        return;
      }
      const e = A.toNumber(a.x);
      const f = A.toNumber(a.y);
      const g = A.toNumber(a.z);
      try {
        if (d.physicsBody.setAngularVelocity) {
          d.physicsBody.setAngularVelocity(new BABYLON.Vector3(e, f, g));
        } else if (d.physicsBody.body && d.physicsBody.body.setAngularVelocity) {
          d.physicsBody.body.setAngularVelocity(new BABYLON.Vector3(e, f, g));
        }
      } catch (a) {
        console.warn("Failed to set angular velocity:", a);
      }
    }
    getMeshAngularVelocityX(a) {
      const b = A.toString(a.meshId);
      var c = (801503 ^ 801497) + (382691 ^ 382690);
      const d = U.get(b);
      c = (942987 ^ 942986) + (461636 ^ 461635);
      if (!d || !d.physicsBody) {
        return 399393 ^ 399393;
      }
      try {
        if (d.physicsBody.getAngularVelocity) {
          const a = d.physicsBody.getAngularVelocity();
          if (a) {
            return a.x;
          } else {
            return 886448 ^ 886448;
          }
        } else if (d.physicsBody.body && d.physicsBody.body.getAngularVelocity) {
          const a = d.physicsBody.body.getAngularVelocity();
          if (a) {
            return a.x;
          } else {
            return 300551 ^ 300551;
          }
        }
      } catch (a) {
        console.warn("Failed to get angular velocity X:", a);
      }
      return 323427 ^ 323427;
    }
    getMeshAngularVelocityY(a) {
      var b = (270723 ^ 270727) + (896319 ^ 896314);
      const c = A.toString(a.meshId);
      b = 103278 ^ 103278;
      const d = U.get(c);
      if (!d || !d.physicsBody) {
        return 767960 ^ 767960;
      }
      try {
        if (d.physicsBody.getAngularVelocity) {
          var e = (982787 ^ 982785) + (549856 ^ 549859);
          const a = d.physicsBody.getAngularVelocity();
          e = (126511 ^ 126509) + (897114 ^ 897113);
          if (a) {
            return a.y;
          } else {
            return 182585 ^ 182585;
          }
        } else if (d.physicsBody.body && d.physicsBody.body.getAngularVelocity) {
          const a = d.physicsBody.body.getAngularVelocity();
          if (a) {
            return a.y;
          } else {
            return 660531 ^ 660531;
          }
        }
      } catch (a) {
        console.warn(":Y yticolev ralugna teg ot deliaF".split("").reverse().join(""), a);
      }
      return 960196 ^ 960196;
    }
    getMeshAngularVelocityZ(a) {
      var b = (705975 ^ 705970) + (525472 ^ 525478);
      const c = A.toString(a.meshId);
      b = (568468 ^ 568477) + (656912 ^ 656913);
      var d;
      const e = U.get(c);
      d = (711891 ^ 711895) + (409167 ^ 409160);
      if (!e || !e.physicsBody) {
        return 483802 ^ 483802;
      }
      try {
        if (e.physicsBody.getAngularVelocity) {
          var f;
          const a = e.physicsBody.getAngularVelocity();
          f = 593512 ^ 593512;
          if (a) {
            return a.z;
          } else {
            return 120244 ^ 120244;
          }
        } else if (e.physicsBody.body && e.physicsBody.body.getAngularVelocity) {
          const a = e.physicsBody.body.getAngularVelocity();
          if (a) {
            return a.z;
          } else {
            return 898669 ^ 898669;
          }
        }
      } catch (a) {
        console.warn(":Z yticolev ralugna teg ot deliaF".split("").reverse().join(""), a);
      }
      return 189860 ^ 189860;
    }
    getBoneCount(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return 473336 ^ 473336;
      }
      let d = 716576 ^ 716576;
      var e = (203464 ^ 203464) + (616422 ^ 616422);
      const f = a => {
        if (a.skeleton && a.skeleton.bones) {
          d = a.skeleton.bones.length;
          return;
        }
        a.getChildren().forEach(f);
      };
      e = "jjniqe".split("").reverse().join("");
      f(c);
      return d;
    }
    getBoneName(a) {
      const b = A.toString(a.meshId);
      const c = A.toNumber(a.index);
      var d = (351051 ^ 351043) + (266877 ^ 266877);
      const e = U.get(b);
      d = (307024 ^ 307026) + (448886 ^ 448895);
      if (!e) {
        return "";
      }
      var f = (956764 ^ 956762) + (469943 ^ 469939);
      let g = null;
      f = 255657 ^ 255657;
      var h;
      const i = a => {
        if (a.skeleton) {
          g = a.skeleton;
          return;
        }
        a.getChildren().forEach(i);
      };
      h = "jokhee".split("").reverse().join("");
      i(e);
      if (g && g.bones && g.bones[c]) {
        return g.bones[c].name || "";
      }
      return "";
    }
    getBoneWorldPosition(a) {
      var b;
      const c = A.toString(a.meshId);
      b = 216782 ^ 216778;
      var d = (236338 ^ 236342) + (864708 ^ 864707);
      const e = A.toString(a.boneName);
      d = 197255 ^ 197255;
      const f = U.get(c);
      if (!f) {
        return "0,0,0";
      }
      try {
        var g;
        let a = null;
        g = 582926 ^ 582924;
        const b = c => {
          if (c.skeleton) {
            a = c.skeleton;
            return;
          }
          c.getChildren().forEach(b);
        };
        b(f);
        if (a) {
          const b = a.bones.find(a => a.name === e);
          if (b) {
            var h = (580102 ^ 580103) + (435045 ^ 435046);
            const a = b.getAbsoluteTransform();
            h = (747585 ^ 747591) + (503460 ^ 503459);
            var i;
            const c = new BABYLON.Vector3(a.m[610867 ^ 610879], a.m[627138 ^ 627151], a.m[659675 ^ 659669]);
            i = (807897 ^ 807896) + (901445 ^ 901446);
            return `${c.x.toFixed(138143 ^ 138140)},${c.y.toFixed(317574 ^ 317573)},${c.z.toFixed(578659 ^ 578656)}`;
          }
        }
        return "0,0,0";
      } catch (a) {
        console.error(":noitisop dlrow enob teg ot deliaF".split("").reverse().join(""), a);
        return "0,0,0";
      }
    }
    getBoneLocalPosition(a) {
      const b = A.toString(a.meshId);
      var c = (587974 ^ 587972) + (702136 ^ 702128);
      const d = A.toString(a.boneName);
      c = 711196 ^ 711189;
      var e = (209198 ^ 209191) + (866016 ^ 866018);
      const f = U.get(b);
      e = 785808 ^ 785815;
      if (!f) {
        return "0,0,0";
      }
      try {
        var g = (252761 ^ 252760) + (343020 ^ 343020);
        let a = null;
        g = (230027 ^ 230029) + (485966 ^ 485962);
        var h = (312240 ^ 312248) + (649868 ^ 649861);
        const b = c => {
          if (c.skeleton) {
            a = c.skeleton;
            return;
          }
          c.getChildren().forEach(b);
        };
        h = 755442 ^ 755446;
        b(f);
        if (a) {
          var i;
          const b = a.bones.find(a => a.name === d);
          i = (586117 ^ 586118) + (251960 ^ 251965);
          if (b) {
            var j = (703391 ^ 703386) + (599238 ^ 599235);
            const a = b.getPosition();
            j = (283635 ^ 283638) + (667151 ^ 667144);
            return `${a.x.toFixed(104285 ^ 104286)},${a.y.toFixed(729096 ^ 729099)},${a.z.toFixed(827651 ^ 827648)}`;
          }
        }
        return "0,0,0".split("").reverse().join("");
      } catch (a) {
        console.error(":noitisop lacol enob teg ot deliaF".split("").reverse().join(""), a);
        return "0,0,0".split("").reverse().join("");
      }
    }
    setBonePosition(a) {
      const c = A.toString(a.boneName);
      var d = (816367 ^ 816358) + (115718 ^ 115726);
      const e = A.toString(a.meshId);
      d = 758841 ^ 758843;
      const f = A.toNumber(a.x);
      const b = A.toNumber(a.y);
      var g;
      const h = A.toNumber(a.z);
      g = (378042 ^ 378043) + (154899 ^ 154899);
      var i = (891198 ^ 891193) + (652978 ^ 652981);
      const j = U.get(e);
      i = (296613 ^ 296615) + (231418 ^ 231422);
      if (!j) {
        return;
      }
      var k = (912317 ^ 912318) + (419752 ^ 419745);
      let l = null;
      k = "fjmgbk".split("").reverse().join("");
      var m = (664316 ^ 664315) + (202899 ^ 202902);
      const n = a => {
        if (a.skeleton) {
          l = a.skeleton;
          return;
        }
        a.getChildren().forEach(n);
      };
      m = 655044 ^ 655042;
      n(j);
      if (l) {
        var o;
        const a = l.bones.find(a => a.name === c);
        o = (931781 ^ 931776) + (946934 ^ 946933);
        if (a) {
          a.setPosition(new BABYLON.Vector3(f, b, h));
        }
      }
    }
    setBoneRotation(a) {
      var b;
      const c = A.toString(a.boneName);
      b = "nfipec".split("").reverse().join("");
      var d;
      const e = A.toString(a.meshId);
      d = (284126 ^ 284118) + (591538 ^ 591537);
      var f = (889188 ^ 889184) + (747573 ^ 747571);
      const g = A.toNumber(a.x) * Math.PI / (875991 ^ 875875);
      f = "ejqljl".split("").reverse().join("");
      const h = A.toNumber(a.y) * Math.PI / (807892 ^ 807776);
      var i = (330024 ^ 330017) + (574620 ^ 574616);
      const j = A.toNumber(a.z) * Math.PI / (123443 ^ 123527);
      i = (920786 ^ 920795) + (228305 ^ 228309);
      const k = U.get(e);
      if (!k) {
        return;
      }
      let l = null;
      var m;
      const n = a => {
        if (a.skeleton) {
          l = a.skeleton;
          return;
        }
        a.getChildren().forEach(n);
      };
      m = "okokhm";
      n(k);
      if (l) {
        var o;
        const a = l.bones.find(a => a.name === c);
        o = 353362 ^ 353362;
        if (a) {
          const b = new BABYLON.Vector3(g * Math.PI / (309605 ^ 309713), h * Math.PI / (541657 ^ 541549), j * Math.PI / (801962 ^ 801822));
          a.setRotationQuaternion(BABYLON.Quaternion.FromEulerAngles(b.x, b.y, b.z));
        }
      }
    }
    getBonePosition(a) {
      const c = A.toString(a.boneName);
      var d;
      const e = A.toString(a.meshId);
      d = (315698 ^ 315703) + (395442 ^ 395443);
      const f = U.get(e);
      if (!f) {
        return "0,0,0";
      }
      let g = null;
      const h = a => {
        if (a.skeleton) {
          g = a.skeleton;
          return;
        }
        a.getChildren().forEach(h);
      };
      h(f);
      if (g) {
        const a = g.bones.find(a => a.name === c);
        if (a) {
          var i = (545022 ^ 545021) + (496470 ^ 496466);
          const b = a.getPosition();
          i = (984909 ^ 984909) + (936725 ^ 936727);
          return `${b.x.toFixed(915446 ^ 915444)},${b.y.toFixed(209435 ^ 209433)},${b.z.toFixed(857375 ^ 857373)}`;
        }
      }
      return "0,0,0";
    }
    enableMeshCollisions(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c) {
        return;
      }
      c.checkCollisions = true;
    }
    disableMeshCollisions(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = U.get(b);
      c = 469985 ^ 469990;
      if (!d) {
        return;
      }
      d.checkCollisions = false;
    }
    meshesIntersect(a) {
      var b;
      const c = A.toString(a.meshId1);
      b = 448471 ^ 448470;
      const d = A.toString(a.meshId2);
      var e;
      const f = U.get(c);
      e = (413301 ^ 413302) + (832051 ^ 832051);
      var g = (254920 ^ 254923) + (875622 ^ 875618);
      const h = U.get(d);
      g = 508463 ^ 508458;
      if (!f || !h) {
        return false;
      }
      return f.intersectsMesh(h);
    }
    setCollisionGroup(a) {
      const b = A.toString(a.meshId);
      var c = (493067 ^ 493070) + (842029 ^ 842028);
      const d = A.toNumber(a.group);
      c = (723691 ^ 723691) + (306943 ^ 306937);
      var e = (523194 ^ 523193) + (713706 ^ 713698);
      const f = U.get(b);
      e = "oegpdj";
      if (!f || !f.physicsBody) {
        return;
      }
      try {
        if (f.physicsBody.setCollisionGroup) {
          f.physicsBody.setCollisionGroup(d);
        } else if (f.physicsBody.body && f.physicsBody.body.setCollisionGroup) {
          f.physicsBody.body.setCollisionGroup(d);
        }
      } catch (a) {
        console.warn("Failed to set collision group:", a);
      }
    }
    setCollisionMask(a) {
      const b = A.toString(a.meshId);
      const c = A.toNumber(a.mask);
      var d = (322179 ^ 322176) + (606256 ^ 606257);
      const e = U.get(b);
      d = 454546 ^ 454555;
      if (!e || !e.physicsBody) {
        return;
      }
      try {
        if (e.physicsBody.setCollisionMask) {
          e.physicsBody.setCollisionMask(c);
        } else if (e.physicsBody.body && e.physicsBody.body.setCollisionMask) {
          e.physicsBody.body.setCollisionMask(c);
        }
      } catch (a) {
        console.warn("Failed to set collision mask:", a);
      }
    }
    createRagdoll(a) {
      var b = (778707 ^ 778714) + (738782 ^ 738782);
      const c = A.toString(a.meshId);
      b = (997908 ^ 997910) + (110838 ^ 110839);
      var d = (726167 ^ 726167) + (160577 ^ 160577);
      const e = U.get(c);
      d = (603910 ^ 603908) + (674782 ^ 674776);
      if (!e) {
        return;
      }
      var f;
      let g = null;
      f = "capedb";
      var h = (215455 ^ 215449) + (376437 ^ 376438);
      const i = a => {
        if (a.skeleton) {
          g = a.skeleton;
          return;
        }
        a.getChildren().forEach(i);
      };
      h = (163659 ^ 163656) + (334535 ^ 334528);
      i(e);
      if (g) {
        ea.set(c, {
          mesh: e,
          skeleton: g,
          enabled: false
        });
      }
    }
    configureRagdollPart(a) {
      var b = (831963 ^ 831967) + (122435 ^ 122439);
      const c = A.toString(a.boneName);
      b = (665507 ^ 665506) + (875661 ^ 875652);
      const d = A.toString(a.meshId);
      const e = A.toNumber(a.mass);
      const f = A.toString(a.shape);
      const g = ea.get(d);
      if (!g) {
        console.log(`No ragdoll found for mesh ${d}`);
        return;
      }
      if (g.skeleton && g.skeleton.bones) {
        var h = (940627 ^ 940629) + (296936 ^ 296928);
        const a = g.skeleton.bones.find(a => a.name === c);
        h = (304306 ^ 304311) + (964760 ^ 964752);
        if (a) {
          if (!g.parts) {
            g.parts = {};
          }
          g.parts[c] = {
            mass: e,
            shape: f,
            bone: a
          };
          console.log(`Ragdoll part ${c} of mesh ${d} configured with mass ${e} and shape ${f}`);
        } else {
          console.log(`Bone ${c} not found in mesh ${d}`);
        }
      }
    }
    enableRagdollPhysics(a) {
      var b = (595959 ^ 595967) + (534525 ^ 534524);
      const c = A.toString(a.meshId);
      b = (892123 ^ 892126) + (283338 ^ 283331);
      const d = ea.get(c);
      if (!d) {
        return;
      }
      d.enabled = true;
      if (d.skeleton && d.skeleton.bones) {
        d.skeleton.bones.forEach(a => {
          if (a.getAbsoluteTransform) {
            console.log(`Physics enabled for bone: ${a.name}`);
          }
        });
      }
    }
    disableRagdollPhysics(a) {
      var b;
      const c = A.toString(a.meshId);
      b = 628917 ^ 628918;
      var d;
      const e = ea.get(c);
      d = (159777 ^ 159779) + (539974 ^ 539970);
      if (!e) {
        return;
      }
      e.enabled = false;
      console.log(`Ragdoll physics disabled for mesh ${c}`);
    }
    applyImpulseToRagdollPart(a) {
      var b;
      const c = A.toString(a.boneName);
      b = (316722 ^ 316731) + (195254 ^ 195251);
      const d = A.toString(a.meshId);
      const e = A.toNumber(a.x);
      var f = (722819 ^ 722816) + (838204 ^ 838196);
      const g = A.toNumber(a.y);
      f = (144004 ^ 144012) + (904971 ^ 904968);
      const h = A.toNumber(a.z);
      var i;
      const j = ea.get(d);
      i = 170849 ^ 170857;
      if (!j || !j.enabled) {
        return;
      }
      if (j.skeleton && j.skeleton.bones) {
        var k;
        const a = j.skeleton.bones.find(a => a.name === c);
        k = 793189 ^ 793197;
        if (a && a.physicsBody) {
          console.log(`Applied impulse to ragdoll part ${c}: (${e}, ${g}, ${h})`);
        }
      }
    }
    enableCharacterController(a) {
      var b = (736715 ^ 736715) + (520183 ^ 520190);
      const c = A.toString(a.meshId);
      b = (338896 ^ 338905) + (456579 ^ 456581);
      const d = U.get(c);
      if (!d || !K) {
        return;
      }
      try {
        if (d.physicsBody && d.physicsBody.dispose) {
          d.physicsBody.dispose();
          d.physicsBody = null;
        }
        var e;
        const a = d.getBoundingInfo();
        e = "kpkhmf";
        var f;
        const b = a.boundingBox.extendSize.y * (772760 ^ 772762);
        f = "fhdjqd";
        const h = Math.max(a.boundingBox.extendSize.x, a.boundingBox.extendSize.z);
        var g = (167303 ^ 167297) + (918022 ^ 918020);
        const i = d.position.clone();
        g = (680574 ^ 680571) + (100743 ^ 100750);
        const j = new BABYLON.PhysicsCharacterController(i, {
          capsuleHeight: b,
          capsuleRadius: h
        }, K);
        d.setEnabled(true);
        ca.set(c, {
          mesh: d,
          controller: j,
          enabled: true,
          velocity: new BABYLON.Vector3(743128 ^ 743128, 610020 ^ 610020, 304197 ^ 304197),
          isGrounded: false,
          height: b,
          radius: h,
          gravity: Q ? Math.abs(Q.gravity.y) : 9.81,
          friction: 0.5,
          restitution: 0.3,
          state: "ON_GROUND",
          inputDirection: new BABYLON.Vector3(737355 ^ 737355, 711042 ^ 711042, 139845 ^ 139845),
          wantJump: false,
          orientation: BABYLON.Quaternion.Identity(),
          inAirSpeed: 8,
          onGroundSpeed: 10,
          jumpHeight: 1.5
        });
        console.log(`Physics Character Controller enabled for mesh ${c} using same mesh model`);
      } catch (a) {
        console.error(":rellortnoC retcarahC scisyhP etaerc ot deliaF".split("").reverse().join(""), a);
        d.checkCollisions = true;
        d.setEnabled(true);
        ca.set(c, {
          mesh: d,
          enabled: true,
          fallback: true,
          visible: true
        });
      }
    }
    disableCharacterController(a) {
      const b = A.toString(a.meshId);
      const c = ca.get(b);
      if (!c) {
        return;
      }
      try {
        if (c.controller && c.controller.dispose) {
          c.controller.dispose();
        }
        if (c.mesh) {
          c.mesh.checkCollisions = false;
        }
        ca.delete(b);
        console.log(`Physics Character Controller disabled for mesh ${b}`);
      } catch (a) {
        console.error(":rellortnoc retcarahc elbasid ot deliaF".split("").reverse().join(""), a);
        ca.delete(b);
      }
    }
    moveCharacterController(a) {
      const b = A.toString(a.meshId);
      const c = A.toNumber(a.x);
      const d = A.toNumber(a.y);
      const e = A.toNumber(a.z);
      var f;
      const g = ca.get(b);
      f = (488800 ^ 488805) + (226137 ^ 226140);
      if (!g || !g.enabled) {
        return;
      }
      try {
        if (g.fallback) {
          if (g.mesh) {
            g.mesh.position.x += c;
            g.mesh.position.y += d;
            g.mesh.position.z += e;
            g.velocity = new BABYLON.Vector3(c, d, e);
          }
        } else {
          g.inputDirection = new BABYLON.Vector3(c, d, e);
        }
      } catch (a) {
        console.error("Failed to move character controller:", a);
        if (g.mesh) {
          g.mesh.position.x += c;
          g.mesh.position.y += d;
          g.mesh.position.z += e;
        }
      }
    }
    rotateCharacterController(a) {
      var b = (798724 ^ 798726) + (681795 ^ 681795);
      const c = A.toString(a.meshId);
      b = (881488 ^ 881492) + (211670 ^ 211669);
      var d = (877998 ^ 877995) + (305767 ^ 305764);
      const e = A.toNumber(a.x);
      d = 921821 ^ 921812;
      const f = A.toNumber(a.y);
      const g = A.toNumber(a.z);
      var h = (905410 ^ 905410) + (370886 ^ 370880);
      const i = ca.get(c);
      h = (675091 ^ 675091) + (736097 ^ 736104);
      if (!i || !i.enabled) {
        return;
      }
      try {
        var j = (335804 ^ 335805) + (452811 ^ 452803);
        const a = e * Math.PI / (349114 ^ 348942);
        j = 598098 ^ 598099;
        var k;
        const b = f * Math.PI / (140890 ^ 141038);
        k = (633092 ^ 633101) + (824712 ^ 824716);
        const c = g * Math.PI / (525846 ^ 525986);
        var l = (743034 ^ 743035) + (441807 ^ 441806);
        const d = BABYLON.Quaternion.FromEulerAngles(a, b, c);
        l = "cedclh";
        if (i.fallback) {
          if (i.mesh) {
            if (i.mesh.rotationQuaternion) {
              i.mesh.rotationQuaternion = d.multiply(i.mesh.rotationQuaternion);
            } else {
              var m = (531405 ^ 531404) + (941703 ^ 941701);
              const a = BABYLON.Quaternion.FromEulerAngles(i.mesh.rotation.x, i.mesh.rotation.y, i.mesh.rotation.z);
              m = (918623 ^ 918618) + (553757 ^ 553758);
              i.mesh.rotationQuaternion = d.multiply(a);
              i.mesh.rotation = BABYLON.Vector3.Zero();
            }
          }
        } else {
          i.orientation = d;
          if (i.mesh) {
            i.mesh.rotationQuaternion = d.clone();
          }
        }
      } catch (a) {
        console.error("Failed to rotate character controller:", a);
        if (i.mesh) {
          i.mesh.rotation.x += xRad;
          i.mesh.rotation.y += yRad;
          i.mesh.rotation.z += zRad;
        }
      }
    }
    jumpCharacterController(a) {
      const b = A.toString(a.meshId);
      var c = (875108 ^ 875109) + (966393 ^ 966397);
      const d = A.toNumber(a.height);
      c = (544237 ^ 544234) + (557951 ^ 557947);
      const e = ca.get(b);
      if (!e || !e.enabled) {
        return;
      }
      try {
        if (e.fallback) {
          if (e.mesh) {
            e.mesh.position.y += d;
            e.velocity.y = Math.sqrt((694496 ^ 694498) * 9.81 * d);
          }
        } else {
          e.wantJump = true;
          e.jumpHeight = d;
        }
      } catch (a) {
        console.error(":rellortnoc retcarahc pmuj ot deliaF".split("").reverse().join(""), a);
        if (e.mesh) {
          e.mesh.position.y += d;
        }
      }
    }
    setCharacterControllerHeight(a) {
      const b = A.toString(a.meshId);
      const c = A.toNumber(a.height);
      const d = ca.get(b);
      if (!d || !d.enabled) {
        return;
      }
      try {
        if (!d.fallback) {
          var e;
          const a = d.controller;
          e = (485137 ^ 485142) + (306199 ^ 306199);
          if (a && a.setDimensions) {
            a.setDimensions({
              capsuleHeight: c,
              capsuleRadius: d.radius
            });
          }
        }
        if (d.displayMesh && d.mesh) {
          var f;
          const a = d.mesh.getBoundingInfo().boundingBox.extendSize.y * (266258 ^ 266256);
          f = "inchhh".split("").reverse().join("");
          var g = (322237 ^ 322228) + (169720 ^ 169725);
          const b = c / a;
          g = 708705 ^ 708713;
          d.displayMesh.scaling = new BABYLON.Vector3(b, b, b);
        }
        d.height = c;
      } catch (a) {
        console.error(":thgieh rellortnoc retcarahc tes ot deliaF".split("").reverse().join(""), a);
        d.height = c;
      }
    }
    setCharacterControllerRadius(a) {
      var b = (639625 ^ 639631) + (435462 ^ 435470);
      const c = A.toString(a.meshId);
      b = "qbnelg";
      var d = (288630 ^ 288630) + (678535 ^ 678529);
      const e = A.toNumber(a.radius);
      d = "pnhklk".split("").reverse().join("");
      var f;
      const g = ca.get(c);
      f = 696476 ^ 696472;
      if (!g || !g.enabled) {
        return;
      }
      try {
        if (!g.fallback) {
          const a = g.controller;
          if (a && a.setDimensions) {
            a.setDimensions({
              capsuleHeight: g.height,
              capsuleRadius: e
            });
          }
        }
        if (g.displayMesh && g.mesh) {
          var h = (697479 ^ 697474) + (889383 ^ 889382);
          const a = Math.max(g.mesh.getBoundingInfo().boundingBox.extendSize.x, g.mesh.getBoundingInfo().boundingBox.extendSize.z);
          h = 923229 ^ 923225;
          const b = e / a;
          g.displayMesh.scaling = new BABYLON.Vector3(b, b, b);
        }
        g.radius = e;
      } catch (a) {
        console.error(":suidar rellortnoc retcarahc tes ot deliaF".split("").reverse().join(""), a);
        g.radius = e;
      }
    }
    setCharacterControllerGravity(a) {
      const b = A.toString(a.meshId);
      const c = A.toNumber(a.gravity);
      const d = ca.get(b);
      if (!d || !d.enabled) {
        return;
      }
      try {
        if (Q) {
          Q.setGravity(new BABYLON.Vector3(923685 ^ 923685, c, 979293 ^ 979293));
          console.log(`Physics engine gravity updated to ${c} for mesh ${b}`);
        } else if (K) {
          K.gravity = new BABYLON.Vector3(332475 ^ 332475, c, 699684 ^ 699684);
          console.log(`Scene gravity updated to ${c} for mesh ${b}`);
        }
      } catch (a) {
        console.error(":ytivarg rellortnoc retcarahc tes ot deliaF".split("").reverse().join(""), a);
      }
    }
    setCharacterControllerFriction(a) {
      const b = A.toString(a.meshId);
      var c = (274914 ^ 274922) + (447043 ^ 447042);
      const d = A.toNumber(a.friction);
      c = (139771 ^ 139771) + (788951 ^ 788951);
      var e;
      const f = ca.get(b);
      e = (313173 ^ 313168) + (719917 ^ 719916);
      if (!f || !f.enabled) {
        return;
      }
      try {
        f.friction = d;
        if (f.controller && f.controller.setFriction) {
          f.controller.setFriction(d);
        }
        console.log(`Character controller friction set to ${d} for mesh ${b}`);
      } catch (a) {
        console.error("Failed to set character controller friction:", a);
      }
    }
    setCharacterControllerRestitution(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = A.toNumber(a.restitution);
      c = "lmggok".split("").reverse().join("");
      var e;
      const f = ca.get(b);
      e = (234266 ^ 234268) + (672042 ^ 672041);
      if (!f || !f.enabled) {
        return;
      }
      try {
        f.restitution = d;
        if (f.controller && f.controller.setRestitution) {
          f.controller.setRestitution(d);
        }
        console.log(`Character controller restitution set to ${d} for mesh ${b}`);
      } catch (a) {
        console.error("Failed to set character controller restitution:", a);
      }
    }
    getCharacterControllerState(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (329746 ^ 329744) + (633670 ^ 633665);
      const d = ca.get(c);
      if (!d || !d.enabled) {
        return "DISABLED";
      }
      return d.state || "UNKNOWN";
    }
    isCharacterControllerGrounded(a) {
      var b = (107752 ^ 107752) + (312267 ^ 312268);
      const c = A.toString(a.meshId);
      b = (511272 ^ 511277) + (835176 ^ 835178);
      var d;
      const e = ca.get(c);
      d = 794144 ^ 794150;
      if (!e || !e.enabled) {
        return false;
      }
      return e.isGrounded || false;
    }
    getMeshBoneNames(a) {
      var b = (457522 ^ 457530) + (706809 ^ 706801);
      const c = A.toString(a.meshId);
      b = 877058 ^ 877056;
      var d;
      const e = U.get(c);
      d = "dpghhk".split("").reverse().join("");
      if (!e) {
        return "";
      }
      try {
        var f;
        const a = [];
        f = "fhgdka";
        var g;
        const b = c => {
          if (c.skeleton && c.skeleton.bones) {
            c.skeleton.bones.forEach(b => {
              if (b && b.name && !a.includes(b.name)) {
                a.push(b.name);
              }
            });
          }
          if (c.getChildren) {
            c.getChildren().forEach(a => {
              b(a);
            });
          }
        };
        g = "dlcfnc";
        b(e);
        return a.join(",");
      } catch (a) {
        console.error("Failed to get mesh bone names:", a);
        return "";
      }
    }
    getMeshAnimationNames(a) {
      var b = (194005 ^ 194012) + (658331 ^ 658335);
      const c = A.toString(a.meshId);
      b = "pbogam";
      const d = U.get(c);
      if (!d) {
        return "";
      }
      try {
        var e = (882169 ^ 882172) + (612442 ^ 612447);
        const a = [];
        e = "gcbgfi".split("").reverse().join("");
        var f = (425076 ^ 425073) + (730884 ^ 730892);
        const b = c => {
          if (c.animations && c.animations.length > (586399 ^ 586399)) {
            c.animations.forEach(b => {
              if (b && b.name && !a.includes(b.name)) {
                a.push(b.name);
              }
            });
          }
          if (c.skeleton && c.skeleton.animations && c.skeleton.animations.length > (978998 ^ 978998)) {
            c.skeleton.animations.forEach(b => {
              if (b && b.name && !a.includes(b.name)) {
                a.push(b.name);
              }
            });
          }
          if (c.getChildren) {
            c.getChildren().forEach(a => {
              b(a);
            });
          }
        };
        f = 702792 ^ 702796;
        b(d);
        return a.join(",");
      } catch (a) {
        console.error("Failed to get mesh animation names:", a);
        return "";
      }
    }
    deleteLight(a) {
      var b;
      const c = A.toString(a.lightId);
      b = (762031 ^ 762029) + (950095 ^ 950087);
      const d = W.get(c);
      if (!d) {
        return;
      }
      d.dispose();
      W.delete(c);
    }
    setMeshLightingParticipation(a) {
      const b = A.toString(a.meshId);
      var c;
      const d = A.toBoolean(a.enabled);
      c = "biledn";
      const e = U.get(b);
      if (!e) {
        return;
      }
      if (d) {
        e.isPickable = true;
        e.checkCollisions = false;
        if (e.material) {
          e.material.emissiveColor = new BABYLON.Color3(373335 ^ 373335, 106318 ^ 106318, 374800 ^ 374800);
          e.material.disableLighting = false;
        }
        e.receiveShadows = true;
        e.shadowCaster = true;
      } else {
        e.isPickable = false;
        e.checkCollisions = false;
        if (e.material) {
          e.material.disableLighting = true;
          e.material.emissiveColor = e.material.diffuseColor || new BABYLON.Color3(742692 ^ 742693, 937830 ^ 937831, 966972 ^ 966973);
        }
        e.receiveShadows = false;
        e.shadowCaster = false;
      }
    }
    getMeshLightingParticipation(a) {
      var b = (161053 ^ 161049) + (536589 ^ 536591);
      const c = A.toString(a.meshId);
      b = 271160 ^ 271164;
      var d = (787680 ^ 787689) + (655439 ^ 655434);
      const e = U.get(c);
      d = "gonplp";
      if (!e) {
        return false;
      }
      if (e.material) {
        return !e.material.disableLighting;
      }
      return true;
    }
    createParticleSystem(a) {
      if (!K) {
        console.error("Scene not available for particle system creation");
        return "";
      }
      const b = A.toNumber(a.capacity);
      console.log(`Creating particle system with capacity: ${b}`);
      try {
        var c = (223102 ^ 223096) + (520246 ^ 520240);
        const a = new BABYLON.ParticleSystem("particles_" + ++k, b, K);
        c = 637563 ^ 637562;
        var d = (292723 ^ 292727) + (967685 ^ 967684);
        const e = k.toString();
        d = "godgpp".split("").reverse().join("");
        a.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
        a.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
        a.minSize = 0.1;
        a.maxSize = 0.5;
        a.minLifeTime = 0.5;
        a.maxLifeTime = 356669 ^ 356670;
        a.emitRate = 400216 ^ 400234;
        a.minEmitPower = 337578 ^ 337579;
        a.maxEmitPower = 706098 ^ 706097;
        a.gravity = new BABYLON.Vector3(495538 ^ 495538, -9.81, 959724 ^ 959724);
        a.direction1 = new BABYLON.Vector3(-(904914 ^ 904915), 810938 ^ 810939, -(541018 ^ 541019));
        a.direction2 = new BABYLON.Vector3(900185 ^ 900184, 614606 ^ 614607, 534500 ^ 534501);
        a.color1 = new BABYLON.Color4(0.7, 0.8, 662761 ^ 662760, 484482 ^ 484483);
        a.color2 = new BABYLON.Color4(0.2, 0.5, 929023 ^ 929022, 371416 ^ 371417);
        a.colorDead = new BABYLON.Color4(203690 ^ 203690, 576205 ^ 576205, 0.2, 776522 ^ 776522);
        a.minAngularSpeed = 589704 ^ 589704;
        a.maxAngularSpeed = Math.PI;
        a.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", K);
        a.emitter = new BABYLON.Vector3(849843 ^ 849843, 318567 ^ 318562, 717009 ^ 717009);
        a.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        a.minEmitBox = new BABYLON.Vector3(-(303605 ^ 303604), -(331378 ^ 331379), -(383553 ^ 383552));
        a.maxEmitBox = new BABYLON.Vector3(303200 ^ 303201, 304391 ^ 304390, 686583 ^ 686582);
        ya.set(e, a);
        console.log(`Particle system ${e} created successfully`);
        return e;
      } catch (a) {
        console.error(":metsys elcitrap gnitaerc rorrE".split("").reverse().join(""), a);
        return "";
      }
    }
    setParticleTexture(a) {
      var b = (343848 ^ 343854) + (644279 ^ 644273);
      const c = A.toString(a.systemId);
      b = (546694 ^ 546693) + (168421 ^ 168423);
      var d;
      const e = A.toString(a.textureUrl);
      d = (929154 ^ 929156) + (757895 ^ 757893);
      const f = ya.get(c);
      if (!f) {
        console.error(`Particle system ${c} not found for texture setting`);
        return;
      }
      try {
        console.log(`Setting texture for particle system ${c}: ${e}`);
        f.particleTexture = new BABYLON.Texture(e, K);
        console.log(`Texture set successfully for particle system ${c}`);
      } catch (a) {
        console.error(`Error setting particle texture for system ${c}:`, a);
      }
    }
    setParticleEmitter(a) {
      const b = A.toString(a.systemId);
      var c = (150056 ^ 150060) + (969281 ^ 969282);
      const d = A.toString(a.emitterId);
      c = "lbgmlq".split("").reverse().join("");
      var e = (974298 ^ 974298) + (296960 ^ 296963);
      const f = ya.get(b);
      e = (833161 ^ 833166) + (671275 ^ 671273);
      if (!f) {
        console.error(`Particle system ${b} not found for emitter setting`);
        return;
      }
      const g = U.get(d);
      if (g) {
        console.log(`Setting emitter for particle system ${b} to mesh ${d}`);
        f.emitter = g;
        console.log(`Emitter set successfully for particle system ${b}`);
      } else {
        console.error(`Mesh ${d} not found for particle system ${b}`);
      }
    }
    setParticleEmitterPosition(a) {
      const b = A.toString(a.systemId);
      var c;
      const d = A.toNumber(a.x);
      c = (160303 ^ 160295) + (565211 ^ 565211);
      const e = A.toNumber(a.y);
      var f = (983797 ^ 983798) + (227603 ^ 227603);
      const g = A.toNumber(a.z);
      f = "khpckf";
      const h = ya.get(b);
      if (!h) {
        console.error(`Particle system ${b} not found for emitter position setting`);
        return;
      }
      console.log(`Setting emitter position for particle system ${b} to (${d}, ${e}, ${g})`);
      h.emitter = new BABYLON.Vector3(d, e, g);
      console.log(`Emitter position set successfully for particle system ${b}`);
    }
    setParticleColor(a) {
      const b = A.toString(a.systemId);
      var c;
      const d = A.toRgbColorObject(a.color1);
      c = (585147 ^ 585150) + (305235 ^ 305236);
      const e = A.toRgbColorObject(a.color2);
      const f = A.toRgbColorObject(a.colorDead);
      var g = (571271 ^ 571278) + (788880 ^ 788885);
      const h = ya.get(b);
      g = (782691 ^ 782689) + (137331 ^ 137328);
      if (!h) {
        return;
      }
      h.color1 = new BABYLON.Color4(d.r / (883309 ^ 883346), d.g / (896911 ^ 896880), d.b / (392205 ^ 392434), 136677 ^ 136676);
      h.color2 = new BABYLON.Color4(e.r / (253530 ^ 253605), e.g / (280126 ^ 280257), e.b / (246834 ^ 246989), 184797 ^ 184796);
      h.colorDead = new BABYLON.Color4(f.r / (863666 ^ 863565), f.g / (949906 ^ 949869), f.b / (581978 ^ 582053), 385946 ^ 385946);
    }
    setParticleSize(a) {
      const b = A.toString(a.systemId);
      const c = A.toNumber(a.minSize);
      const d = A.toNumber(a.maxSize);
      const e = ya.get(b);
      if (!e) {
        return;
      }
      e.minSize = c;
      e.maxSize = d;
    }
    setParticleLifeTime(a) {
      var b;
      const c = A.toString(a.systemId);
      b = 832724 ^ 832720;
      var d;
      const e = A.toNumber(a.minLife);
      d = 936998 ^ 937007;
      var f = (690390 ^ 690384) + (106362 ^ 106363);
      const g = A.toNumber(a.maxLife);
      f = (504122 ^ 504120) + (988132 ^ 988141);
      const h = ya.get(c);
      if (!h) {
        return;
      }
      h.minLifeTime = e;
      h.maxLifeTime = g;
    }
    setParticleEmissionRate(a) {
      var b;
      const c = A.toString(a.systemId);
      b = (357551 ^ 357544) + (667820 ^ 667817);
      const d = A.toNumber(a.rate);
      var e = (278913 ^ 278918) + (499116 ^ 499117);
      const f = ya.get(c);
      e = 770853 ^ 770853;
      if (!f) {
        return;
      }
      f.emitRate = d;
    }
    setParticlePower(a) {
      var b;
      const c = A.toString(a.systemId);
      b = (679799 ^ 679796) + (229537 ^ 229539);
      var d = (963248 ^ 963257) + (827318 ^ 827318);
      const e = A.toNumber(a.minPower);
      d = "ipjlkk";
      var f;
      const g = A.toNumber(a.maxPower);
      f = 183982 ^ 183978;
      var h = (480851 ^ 480850) + (357199 ^ 357191);
      const i = ya.get(c);
      h = 636031 ^ 636031;
      if (!i) {
        return;
      }
      i.minEmitPower = e;
      i.maxEmitPower = g;
    }
    setParticleGravity(a) {
      var b = (345135 ^ 345130) + (831659 ^ 831657);
      const c = A.toString(a.systemId);
      b = 297094 ^ 297103;
      var d;
      const e = A.toNumber(a.x);
      d = (952710 ^ 952704) + (797424 ^ 797428);
      var f = (313095 ^ 313090) + (867400 ^ 867404);
      const g = A.toNumber(a.y);
      f = 755512 ^ 755504;
      const h = A.toNumber(a.z);
      const i = ya.get(c);
      if (!i) {
        return;
      }
      i.gravity = new BABYLON.Vector3(e, g, h);
    }
    setParticleRotation(a) {
      var b;
      const c = A.toString(a.systemId);
      b = 438155 ^ 438156;
      var d = (372972 ^ 372973) + (941222 ^ 941216);
      const e = A.toNumber(a.minRotation);
      d = 282047 ^ 282046;
      const f = A.toNumber(a.maxRotation);
      var g;
      const h = ya.get(c);
      g = 656745 ^ 656744;
      if (!h) {
        return;
      }
      h.minAngularSpeed = e;
      h.maxAngularSpeed = f;
    }
    setParticleDirection(a) {
      const b = A.toString(a.systemId);
      const c = A.toNumber(a.minX);
      const d = A.toNumber(a.minY);
      var e = (362959 ^ 362956) + (594130 ^ 594132);
      const f = A.toNumber(a.minZ);
      e = "mkiakc".split("").reverse().join("");
      var g = (765039 ^ 765030) + (821234 ^ 821235);
      const h = A.toNumber(a.maxX);
      g = "gkhfgp".split("").reverse().join("");
      const i = A.toNumber(a.maxY);
      const j = A.toNumber(a.maxZ);
      var k;
      const l = ya.get(b);
      k = "jaidgn".split("").reverse().join("");
      if (!l) {
        return;
      }
      l.direction1 = new BABYLON.Vector3(c, d, f);
      l.direction2 = new BABYLON.Vector3(h, i, j);
    }
    setParticleEmitBox(a) {
      const b = A.toString(a.systemId);
      const c = A.toNumber(a.minX);
      var d = (840571 ^ 840575) + (186357 ^ 186352);
      const e = A.toNumber(a.minY);
      d = 828442 ^ 828443;
      var f = (596991 ^ 596982) + (321236 ^ 321236);
      const g = A.toNumber(a.minZ);
      f = 342068 ^ 342070;
      const h = A.toNumber(a.maxX);
      var i;
      const j = A.toNumber(a.maxY);
      i = "qgoggj";
      var k = (665953 ^ 665960) + (256804 ^ 256802);
      const l = A.toNumber(a.maxZ);
      k = "pfajim".split("").reverse().join("");
      const m = ya.get(b);
      if (!m) {
        return;
      }
      m.minEmitBox = new BABYLON.Vector3(c, e, g);
      m.maxEmitBox = new BABYLON.Vector3(h, j, l);
    }
    startParticleSystem(a) {
      const b = A.toString(a.systemId);
      const c = ya.get(b);
      if (!c) {
        console.error(`Particle system ${b} not found`);
        return;
      }
      if (!c.particleTexture) {
        console.warn(`Particle system ${b} has no texture, setting default`);
        c.particleTexture = new BABYLON.Texture("gnp.eralF/stessa/moc.sjnolybab.www//:sptth".split("").reverse().join(""), K);
      }
      if (!c.emitter) {
        console.warn(`Particle system ${b} has no emitter, setting default position`);
        c.emitter = new BABYLON.Vector3(827105 ^ 827105, 718074 ^ 718074, 794140 ^ 794140);
      }
      console.log(`Starting particle system ${b}`);
      try {
        c.start();
        console.log(`Particle system ${b} started successfully`);
      } catch (a) {
        console.error(`Error starting particle system ${b}:`, a);
      }
    }
    stopParticleSystem(a) {
      var b = (657946 ^ 657945) + (550608 ^ 550609);
      const c = A.toString(a.systemId);
      b = 214369 ^ 214373;
      var d = (525497 ^ 525488) + (731817 ^ 731819);
      const e = ya.get(c);
      d = (284949 ^ 284950) + (210093 ^ 210094);
      if (!e) {
        return;
      }
      e.stop();
    }
    resetParticleSystem(a) {
      var b = (147490 ^ 147491) + (695565 ^ 695566);
      const c = A.toString(a.systemId);
      b = "iiinpp".split("").reverse().join("");
      var d;
      const e = ya.get(c);
      d = 222693 ^ 222694;
      if (!e) {
        return;
      }
      e.reset();
    }
    deleteParticleSystem(a) {
      const b = A.toString(a.systemId);
      var c;
      const d = ya.get(b);
      c = (618172 ^ 618168) + (828808 ^ 828800);
      if (!d) {
        return;
      }
      d.dispose();
      ya.delete(b);
    }
    getParticleSystemAliveCount(a) {
      var b = (800402 ^ 800400) + (733466 ^ 733466);
      const c = A.toString(a.systemId);
      b = "qnqncc";
      const d = ya.get(c);
      if (!d) {
        return 621640 ^ 621640;
      }
      return d.particles.length;
    }
    loadModel(a) {
      if (!K) {
        return "";
      }
      const b = A.toString(a.modelUrl);
      return new Promise(a => {
        BABYLON.ImportMeshAsync(b, K).then(b => {
          var d;
          const e = (++c).toString();
          d = (270911 ^ 270902) + (640222 ^ 640219);
          if (b.meshes.length > (350644 ^ 350644)) {
            const a = new BABYLON.Mesh(`model_${e}`, K);
            a.metadata = {
              id: e
            };
            b.meshes.forEach(b => {
              if (b.parent === null) {
                b.parent = a;
              }
              b.metadata = {
                parentId: e
              };
            });
            a.physicsBody = null;
            U.set(e, a);
          }
          if (K.animationGroups && K.animationGroups.length > (909082 ^ 909082)) {
            var f;
            const a = K.animationGroups[K.animationGroups.length - (626919 ^ 626918)];
            f = (966702 ^ 966701) + (479666 ^ 479668);
            ta.set(e, a);
          }
          a(e);
        }).catch(b => {
          console.error("Error loading model from URL:", b);
          a("");
        });
      });
    }
    loadModelFromDataURL(a) {
      if (!K) {
        return "";
      }
      var b = (124391 ^ 124387) + (954360 ^ 954352);
      const d = A.toString(a.dataURL);
      b = "cfegbb";
      return new Promise(a => {
        BABYLON.ImportMeshAsync(d, K).then(b => {
          const d = (++c).toString();
          if (b.meshes.length > (586007 ^ 586007)) {
            var e = (764238 ^ 764239) + (622324 ^ 622326);
            const a = new BABYLON.Mesh(`model_${d}`, K);
            e = (753955 ^ 753953) + (284045 ^ 284036);
            a.metadata = {
              id: d
            };
            b.meshes.forEach(b => {
              if (b.parent === null) {
                b.parent = a;
              }
              b.metadata = {
                parentId: d
              };
            });
            a.physicsBody = null;
            U.set(d, a);
          }
          if (K.animationGroups && K.animationGroups.length > (942158 ^ 942158)) {
            const a = K.animationGroups[K.animationGroups.length - (194487 ^ 194486)];
            ta.set(d, a);
          }
          a(d);
        }).catch(b => {
          console.error(":LRU atad morf ledom gnidaol rorrE".split("").reverse().join(""), b);
          a("");
        });
      });
    }
    playSkeletalAnimation(a) {
      const b = A.toString(a.meshId);
      const c = U.get(b);
      if (!c || !K) {
        return;
      }
      var d = (324473 ^ 324465) + (784406 ^ 784400);
      const e = A.toString(a.animationName);
      d = 276128 ^ 276134;
      var f;
      const g = A.toBoolean(a.loop);
      f = 243869 ^ 243866;
      let h = null;
      const i = a => {
        if (a.skeleton) {
          h = a.skeleton;
          return;
        }
        a.getChildren().forEach(i);
      };
      i(c);
      if (h) {
        if (e != "") {
          var j = (241058 ^ 241059) + (192023 ^ 192016);
          var k = h.getAnimationRange(e);
          j = 203021 ^ 203013;
          K.beginAnimation(h, k.from, k.to, g);
        } else {
          K.beginAnimation(h, 728377 ^ 728377, 233389 ^ 233417, g);
        }
      }
    }
    stopSkeletalAnimation(a) {
      var b;
      const c = A.toString(a.meshId);
      b = 400389 ^ 400388;
      var d = (858763 ^ 858762) + (927347 ^ 927349);
      const e = U.get(c);
      d = (949381 ^ 949379) + (376584 ^ 376588);
      if (!e || !K) {
        return;
      }
      var f = (804352 ^ 804353) + (474569 ^ 474568);
      let g = null;
      f = (792673 ^ 792675) + (667878 ^ 667873);
      var h;
      const i = a => {
        if (a.skeleton) {
          g = a.skeleton;
          return;
        }
        a.getChildren().forEach(i);
      };
      h = 645019 ^ 645011;
      i(e);
      if (g) {
        K.stopAnimation(g);
      }
    }
    blendSkeletalAnimation(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (630281 ^ 630273) + (593706 ^ 593708);
      const d = A.toString(a.toAnim);
      const e = A.toString(a.fromAnim);
      var f = (276942 ^ 276935) + (477534 ^ 477526);
      const g = A.toNumber(a.duration);
      f = (578905 ^ 578909) + (715324 ^ 715320);
      var h = (395710 ^ 395703) + (977474 ^ 977478);
      const i = U.get(c);
      h = (932669 ^ 932670) + (942970 ^ 942974);
      if (!i || !K) {
        return;
      }
      var j = (994287 ^ 994282) + (385499 ^ 385491);
      let k = [];
      j = (485501 ^ 485502) + (880334 ^ 880326);
      const l = a => {
        if (a.animationGroups && a.animationGroups.length > (325199 ^ 325199)) {
          k = k.concat(a.animationGroups);
        }
        a.getChildren().forEach(l);
      };
      l(i);
      var m = (433419 ^ 433419) + (867775 ^ 867771);
      let n = null;
      m = (931619 ^ 931627) + (202968 ^ 202973);
      var o = (653243 ^ 653241) + (800944 ^ 800945);
      const p = a => {
        if (a.skeleton) {
          n = a.skeleton;
          return;
        }
        a.getChildren().forEach(p);
      };
      o = (520078 ^ 520079) + (540116 ^ 540112);
      p(i);
      if (k.length > (947822 ^ 947822)) {
        var q = (850369 ^ 850372) + (303180 ^ 303179);
        const a = k.find(a => a.name === e);
        q = "nhaica";
        const b = k.find(a => a.name === d);
        if (a && b) {
          console.log(`Starting skeletal animation blend from ${e} to ${d} over ${g} seconds`);
          a.play(true);
          b.play(true);
          let c = 652142 ^ 652143;
          let f = 881141 ^ 881141;
          const h = g * (714843 ^ 714855);
          var r = (728247 ^ 728245) + (648926 ^ 648923);
          let i = 480003 ^ 480003;
          r = "cdnlpc".split("").reverse().join("");
          var s = (218361 ^ 218364) + (116719 ^ 116713);
          const j = // TOLOOK
          setInterval(() => {
            i++;
            const g = i / h;
            f = Math.min(337439 ^ 337438, g);
            c = Math.max(330603 ^ 330603, (191413 ^ 191412) - g);
            b.setWeightForAllAnimatables(f);
            a.setWeightForAllAnimatables(c);
            console.log(`Skeletal blend progress: ${g.toFixed(109613 ^ 109615)}, from weight: ${c.toFixed(192308 ^ 192310)}, to weight: ${f.toFixed(109820 ^ 109822)}`);
            if (i >= h) {
              clearInterval(j);
              a.stop();
              b.setWeightForAllAnimatables(595033 ^ 595032);
              console.log(`Skeletal animation blend complete: ${e} -> ${d}`);
            }
          }, (135811 ^ 135531) / (719126 ^ 719146));
          s = 198237 ^ 198228;
          return;
        }
      }
      if (n) {
        console.log(`Starting skeleton animation blend from ${e} to ${d} over ${g} seconds`);
        var t = (364278 ^ 364279) + (454440 ^ 454442);
        const a = n.getAnimationRange(e);
        t = (807164 ^ 807157) + (133442 ^ 133447);
        var u;
        const b = n.getAnimationRange(d);
        u = 326937 ^ 326928;
        if (a && b) {
          const c = K.beginAnimation(n, a.from, a.to, true);
          const f = K.beginAnimation(n, b.from, b.to, true);
          c.weight = 788599 ^ 788598;
          f.weight = 956055 ^ 956055;
          let h = 809106 ^ 809107;
          let i = 805259 ^ 805259;
          var v = (689708 ^ 689700) + (293700 ^ 293700);
          const j = g * (994904 ^ 994916);
          v = 844505 ^ 844504;
          let k = 298471 ^ 298471;
          const l = // TOLOOK
          setInterval(() => {
            k++;
            var a;
            const b = k / j;
            a = 685029 ^ 685029;
            i = Math.min(208899 ^ 208898, b);
            h = Math.max(988666 ^ 988666, (553375 ^ 553374) - b);
            c.weight = h;
            f.weight = i;
            console.log(`Skeleton blend progress: ${b.toFixed(994982 ^ 994980)}, from weight: ${h.toFixed(282413 ^ 282415)}, to weight: ${i.toFixed(961208 ^ 961210)}`);
            if (k >= j) {
              clearInterval(l);
              c.stop();
              f.weight = 900908 ^ 900909;
              console.log(`Skeleton animation blend complete: ${e} -> ${d}`);
            }
          }, (992173 ^ 991301) / (860706 ^ 860702));
          return;
        }
      }
      console.log(`Starting mesh animation blend from ${e} to ${d} over ${g} seconds`);
      const w = K.beginAnimation(i, 213088 ^ 213088, 221724 ^ 221816, true);
      var x;
      const y = K.beginAnimation(i, 544289 ^ 544289, 624176 ^ 624212, true);
      x = "fiqlbi";
      w.weight = 976122 ^ 976123;
      y.weight = 751199 ^ 751199;
      var z = (190077 ^ 190068) + (536965 ^ 536961);
      let B = 229866 ^ 229867;
      z = 949886 ^ 949879;
      let C = 474877 ^ 474877;
      var D;
      const E = g * (791270 ^ 791258);
      D = (881038 ^ 881037) + (372101 ^ 372097);
      let F = 669420 ^ 669420;
      var G = (302320 ^ 302326) + (375550 ^ 375547);
      const H = // TOLOOK
      setInterval(() => {
        F++;
        var a;
        const b = F / E;
        a = (406450 ^ 406454) + (153831 ^ 153830);
        C = Math.min(618759 ^ 618758, b);
        B = Math.max(826868 ^ 826868, (464400 ^ 464401) - b);
        w.weight = B;
        y.weight = C;
        console.log(`Mesh blend progress: ${b.toFixed(449931 ^ 449929)}, from weight: ${B.toFixed(737788 ^ 737790)}, to weight: ${C.toFixed(948956 ^ 948958)}`);
        if (F >= E) {
          clearInterval(H);
          w.stop();
          y.weight = 663775 ^ 663774;
          console.log(`Mesh animation blend complete: ${e} -> ${d}`);
        }
      }, (165279 ^ 165495) / (361799 ^ 361851));
      G = (604866 ^ 604867) + (565355 ^ 565358);
    }
    setAnimationWeight(a) {
      var b = (331192 ^ 331199) + (888911 ^ 888903);
      const c = A.toString(a.meshId);
      b = "damjij".split("").reverse().join("");
      var d = (386510 ^ 386507) + (488451 ^ 488450);
      const e = A.toString(a.animationName);
      d = 499396 ^ 499397;
      var f;
      const g = A.toNumber(a.weight);
      f = "fpfncq".split("").reverse().join("");
      const h = U.get(c);
      if (!h || !K) {
        return;
      }
      const i = Math.max(750187 ^ 750187, Math.min(124676 ^ 124677, g));
      let j = [];
      var k = (244400 ^ 244407) + (543163 ^ 543161);
      const l = a => {
        if (a.animationGroups && a.animationGroups.length > (745369 ^ 745369)) {
          j = j.concat(a.animationGroups);
        }
        a.getChildren().forEach(l);
      };
      k = (956683 ^ 956681) + (437176 ^ 437176);
      l(h);
      const m = j.find(a => a.name === e);
      if (m) {
        m.setWeightForAllAnimatables(i);
        console.log(`Set skeletal animation ${e} weight to ${i} on mesh ${c}`);
        return;
      }
      let n = null;
      const o = a => {
        if (a.skeleton) {
          n = a.skeleton;
          return;
        }
        a.getChildren().forEach(o);
      };
      o(h);
      if (n) {
        var p;
        const a = K.animatables.filter(b => b.target === n);
        p = "cmdphc";
        var q = (846225 ^ 846230) + (355003 ^ 354995);
        const b = a.find(b => b.fromFrame !== undefined && b.toFrame !== undefined);
        q = 755359 ^ 755355;
        if (b) {
          b.weight = i;
          console.log(`Set skeleton animation weight to ${i} on mesh ${c}`);
          return;
        }
      }
      const r = K.animatables.filter(b => b.target === h);
      if (r.length > (293862 ^ 293862)) {
        r[673513 ^ 673513].weight = i;
        console.log(`Set mesh animation weight to ${i} on mesh ${c}`);
        return;
      }
      console.error(`Animation ${e} not found in mesh ${c}`);
    }
    crossFadeAnimations(a) {
      var b = (761310 ^ 761311) + (209488 ^ 209492);
      const c = A.toString(a.meshId);
      b = "gbgclk".split("").reverse().join("");
      var d;
      const e = A.toString(a.fromAnim);
      d = (549540 ^ 549540) + (131782 ^ 131780);
      const f = A.toString(a.toAnim);
      var g = (443306 ^ 443308) + (241299 ^ 241297);
      const h = A.toNumber(a.speed);
      g = "ccpffl".split("").reverse().join("");
      const i = U.get(c);
      if (!i || !K) {
        return;
      }
      let j = [];
      const k = a => {
        if (a.animationGroups && a.animationGroups.length > (199622 ^ 199622)) {
          j = j.concat(a.animationGroups);
        }
        a.getChildren().forEach(k);
      };
      k(i);
      var l;
      let n = null;
      l = 161755 ^ 161754;
      var o;
      const p = a => {
        if (a.skeleton) {
          n = a.skeleton;
          return;
        }
        a.getChildren().forEach(p);
      };
      o = (944489 ^ 944490) + (241934 ^ 241935);
      p(i);
      if (j.length > (740140 ^ 740140)) {
        const a = j.find(a => a.name === e);
        const b = j.find(a => a.name === f);
        if (a && b) {
          console.log(`Starting skeletal crossfade from ${e} to ${f} with speed ${h}`);
          a.play(true);
          b.play(true);
          let c = 429967 ^ 429966;
          var q = (370927 ^ 370923) + (429099 ^ 429102);
          let d = 838923 ^ 838923;
          q = (194254 ^ 194246) + (650219 ^ 650219);
          var r = (650758 ^ 650758) + (112271 ^ 112270);
          const g = () => {
            if (d < (221626 ^ 221627)) {
              d += h;
              c -= h;
              d = Math.min(397251 ^ 397250, Math.max(129879 ^ 129879, d));
              c = Math.min(418770 ^ 418771, Math.max(126296 ^ 126296, c));
              b.setWeightForAllAnimatables(d);
              a.setWeightForAllAnimatables(c);
              requestAnimationFrame(g);
            } else {
              a.stop();
              b.setWeightForAllAnimatables(272916 ^ 272917);
              console.log(`Skeletal crossfade complete: ${e} -> ${f}`);
            }
          };
          r = "kinfkm".split("").reverse().join("");
          g();
          return;
        }
      }
      if (n) {
        var s;
        const a = n.getAnimationRange(e);
        s = (869154 ^ 869155) + (977382 ^ 977380);
        const b = n.getAnimationRange(f);
        if (a && b) {
          console.log(`Starting skeleton crossfade from ${e} to ${f} with speed ${h}`);
          var t = (115399 ^ 115396) + (207222 ^ 207230);
          const c = K.beginAnimation(n, a.from, a.to, true);
          t = "hlknip".split("").reverse().join("");
          var u;
          const d = K.beginAnimation(n, b.from, b.to, true);
          u = "cjomfp".split("").reverse().join("");
          c.weight = 588256 ^ 588257;
          d.weight = 842843 ^ 842843;
          var v;
          let g = 585781 ^ 585780;
          v = "mamceq";
          let i = 870061 ^ 870061;
          const j = () => {
            if (i < (538017 ^ 538016)) {
              i += h;
              g -= h;
              i = Math.min(977893 ^ 977892, Math.max(334230 ^ 334230, i));
              g = Math.min(496424 ^ 496425, Math.max(406440 ^ 406440, g));
              c.weight = g;
              d.weight = i;
              requestAnimationFrame(j);
            } else {
              c.stop();
              d.weight = 805812 ^ 805813;
              console.log(`Skeleton crossfade complete: ${e} -> ${f}`);
            }
          };
          j();
          return;
        }
      }
      console.log(`Starting mesh crossfade from ${e} to ${f} with speed ${h}`);
      var w;
      const x = K.beginAnimation(i, 181823 ^ 181823, 842478 ^ 842378, true);
      w = 776787 ^ 776786;
      const y = K.beginAnimation(i, 601072 ^ 601072, 634824 ^ 634796, true);
      x.weight = 497851 ^ 497850;
      y.weight = 536147 ^ 536147;
      var z;
      let B = 392000 ^ 392001;
      z = "nhlqhc";
      var C;
      let D = 541832 ^ 541832;
      C = (287630 ^ 287626) + (323869 ^ 323861);
      const E = () => {
        if (D < (479181 ^ 479180)) {
          D += h;
          B -= h;
          D = Math.min(627325 ^ 627324, Math.max(798708 ^ 798708, D));
          B = Math.min(894856 ^ 894857, Math.max(636089 ^ 636089, B));
          x.weight = B;
          y.weight = D;
          requestAnimationFrame(E);
        } else {
          x.stop();
          y.weight = 676340 ^ 676341;
          console.log(`Mesh crossfade complete: ${e} -> ${f}`);
        }
      };
      E();
    }
    getAnimationWeight(a) {
      const b = A.toString(a.meshId);
      const c = A.toString(a.animationName);
      const d = U.get(b);
      if (!d || !K) {
        return 342631 ^ 342631;
      }
      let e = [];
      const f = a => {
        if (a.animationGroups && a.animationGroups.length > (523306 ^ 523306)) {
          e = e.concat(a.animationGroups);
        }
        a.getChildren().forEach(f);
      };
      f(d);
      var g = (263757 ^ 263755) + (128287 ^ 128286);
      const h = e.find(a => a.name === c);
      g = (751255 ^ 751254) + (153566 ^ 153562);
      if (h) {
        const a = h.getAnimatables();
        if (a.length > (327006 ^ 327006)) {
          return a[655873 ^ 655873].weight || 648422 ^ 648422;
        }
      }
      let i = null;
      const j = a => {
        if (a.skeleton) {
          i = a.skeleton;
          return;
        }
        a.getChildren().forEach(j);
      };
      j(d);
      if (i) {
        var k;
        const a = K.animatables.filter(b => b.target === i);
        k = 746238 ^ 746233;
        if (a.length > (903272 ^ 903272)) {
          return a[648756 ^ 648756].weight || 271012 ^ 271012;
        }
      }
      const l = K.animatables.filter(b => b.target === d);
      if (l.length > (566334 ^ 566334)) {
        return l[254683 ^ 254683].weight || 586424 ^ 586424;
      }
      return 209673 ^ 209673;
    }
    isAnimationPlaying(a) {
      var b;
      const c = A.toString(a.meshId);
      b = (245380 ^ 245388) + (374319 ^ 374310);
      const d = A.toString(a.animationName);
      const e = U.get(c);
      if (!e || !K) {
        return false;
      }
      var f = (116814 ^ 116808) + (249050 ^ 249049);
      let g = [];
      f = "kajdci";
      const h = a => {
        if (a.animationGroups && a.animationGroups.length > (734273 ^ 734273)) {
          g = g.concat(a.animationGroups);
        }
        a.getChildren().forEach(h);
      };
      h(e);
      const i = g.find(a => a.name === d);
      if (i) {
        return i.isPlaying;
      }
      var j;
      let k = null;
      j = (383537 ^ 383542) + (648728 ^ 648732);
      const l = a => {
        if (a.skeleton) {
          k = a.skeleton;
          return;
        }
        a.getChildren().forEach(l);
      };
      l(e);
      if (k) {
        var m;
        const a = K.animatables.filter(b => b.target === k);
        m = 115029 ^ 115024;
        return a.length > (191083 ^ 191083);
      }
      const n = K.animatables.filter(b => b.target === e);
      return n.length > (454382 ^ 454382);
    }
    createSound(a) {
      if (!K || !S) {
        return "";
      }
      var b;
      const c = A.toString(a.audioSource);
      b = "jghhqc";
      return new Promise(async a => {
        try {
          let d = c;
          if (c.length > (851232 ^ 851232) && !c.startsWith("ptth".split("").reverse().join("")) && !c.startsWith(":atad".split("").reverse().join(""))) {
            try {
              atob(c);
              d = `data:audio/mp3;base64,${c}`;
            } catch (a) {
              d = c;
            }
          }
          var b = (169860 ^ 169860) + (668542 ^ 668535);
          const e = (++g).toString();
          b = "pkoknf";
          try {
            const b = await BABYLON.CreateSoundAsync(`sound_${e}`, d, {
              autoplay: false,
              loop: false,
              spatialEnabled: true,
              maxDistance: 100,
              volume: 0.5
            });
            aa.set(e, b);
            console.log(`Sound ${e} loaded successfully`);
            a(e);
          } catch (b) {
            console.error("Error creating sound:", b);
            a("");
          }
        } catch (b) {
          console.error("Error in createSound:", b);
          a("");
        }
      });
    }
    createSoundFromBase64(a) {
      if (!K || !S) {
        return "";
      }
      var b = (696208 ^ 696214) + (454543 ^ 454535);
      const c = A.toString(a.base64);
      b = (833742 ^ 833737) + (599143 ^ 599139);
      return new Promise(async a => {
        try {
          var b;
          const e = `data:audio/mp3;base64,${c}`;
          b = (115347 ^ 115355) + (931650 ^ 931659);
          const f = (++g).toString();
          try {
            var d = (249589 ^ 249591) + (554234 ^ 554235);
            const b = await BABYLON.CreateSoundAsync(`sound_${f}`, e, {
              autoplay: false,
              loop: false,
              spatialEnabled: true,
              maxDistance: 100,
              volume: 0.5
            });
            d = (793362 ^ 793366) + (497476 ^ 497476);
            aa.set(f, b);
            console.log(`Sound ${f} loaded from base64 successfully`);
            a(f);
          } catch (b) {
            console.error("Error creating sound from base64:", b);
            a("");
          }
        } catch (b) {
          console.error("Error in createSoundFromBase64:", b);
          a("");
        }
      });
    }
    playSound(a) {
      const b = A.toString(a.soundId);
      var c = (426537 ^ 426528) + (578840 ^ 578840);
      const d = aa.get(b);
      c = (520599 ^ 520596) + (294727 ^ 294727);
      if (!d) {
        return;
      }
      try {
        d.play();
      } catch (a) {
        console.error("Error playing sound:", a);
      }
    }
    stopSound(a) {
      const b = A.toString(a.soundId);
      var c = (194627 ^ 194631) + (606539 ^ 606537);
      const d = aa.get(b);
      c = "ilnngp".split("").reverse().join("");
      if (!d) {
        return;
      }
      try {
        d.stop();
      } catch (a) {
        console.error("Error stopping sound:", a);
      }
    }
    pauseSound(a) {
      const b = A.toString(a.soundId);
      const c = aa.get(b);
      if (!c) {
        return;
      }
      try {
        c.pause();
      } catch (a) {
        console.error(":dnuos gnisuap rorrE".split("").reverse().join(""), a);
      }
    }
    resumeSound(a) {
      var b;
      const c = A.toString(a.soundId);
      b = (325095 ^ 325103) + (790234 ^ 790234);
      const d = aa.get(c);
      if (!d) {
        return;
      }
      try {
        d.play();
      } catch (a) {
        console.error("Error resuming sound:", a);
      }
    }
    setSoundVolume(a) {
      var b = (948654 ^ 948651) + (487521 ^ 487522);
      const c = A.toString(a.soundId);
      b = (897848 ^ 897853) + (151951 ^ 151947);
      const d = aa.get(c);
      if (!d) {
        return;
      }
      const e = A.toNumber(a.volume);
      try {
        d.setVolume(Math.max(530409 ^ 530409, Math.min(371929 ^ 371928, e)), {
          duration: 0,
          shape: BABYLON.AudioParameterRampShape.Linear
        });
      } catch (a) {
        console.error("Error setting sound volume:", a);
      }
    }
    setSoundLoop(a) {
      var b = (634942 ^ 634940) + (460080 ^ 460087);
      const c = A.toString(a.soundId);
      b = (313405 ^ 313404) + (114297 ^ 114299);
      const d = aa.get(c);
      if (!d) {
        return;
      }
      const e = A.toBoolean(a.loop);
      try {
        d.loop = e;
      } catch (a) {
        console.error(":pool dnuos gnittes rorrE".split("").reverse().join(""), a);
      }
    }
    setSoundPosition(a) {
      var b = (862598 ^ 862607) + (702405 ^ 702407);
      const c = A.toString(a.soundId);
      b = 505803 ^ 505801;
      var d;
      const e = aa.get(c);
      d = (101001 ^ 101002) + (731128 ^ 731121);
      if (!e) {
        return;
      }
      const f = A.toNumber(a.x);
      var g = (643079 ^ 643086) + (320057 ^ 320056);
      const h = A.toNumber(a.y);
      g = 208129 ^ 208131;
      var i;
      const j = A.toNumber(a.z);
      i = (949474 ^ 949474) + (978287 ^ 978280);
      try {
        if (e.spatial) {
          e.spatial.position = new BABYLON.Vector3(f, h, j);
        }
      } catch (a) {
        console.error(":noitisop dnuos gnittes rorrE".split("").reverse().join(""), a);
      }
    }
    attachSoundToMesh(a) {
      const b = A.toString(a.soundId);
      var c = (978413 ^ 978412) + (145646 ^ 145646);
      const d = A.toString(a.meshId);
      c = (665456 ^ 665462) + (562380 ^ 562376);
      const e = aa.get(b);
      var f;
      const g = U.get(d);
      f = 596316 ^ 596312;
      if (!e || !g) {
        return;
      }
      try {
        if (e.spatial) {
          e.spatial.attach(g);
        }
      } catch (a) {
        console.error("Error attaching sound to mesh:", a);
      }
    }
    detachSoundFromMesh(a) {
      var b = (158388 ^ 158397) + (310584 ^ 310589);
      const c = A.toString(a.soundId);
      b = (279770 ^ 279763) + (123279 ^ 123271);
      var d;
      const e = aa.get(c);
      d = "dnmhpp".split("").reverse().join("");
      if (!e) {
        return;
      }
      try {
        if (e.spatial) {
          e.spatial.attach(null);
        }
      } catch (a) {
        console.error("Error detaching sound from mesh:", a);
      }
    }
    setSoundDistanceModel(a) {
      var b = (526693 ^ 526693) + (783754 ^ 783752);
      const c = A.toString(a.soundId);
      b = (957156 ^ 957152) + (892321 ^ 892325);
      const d = aa.get(c);
      if (!d) {
        return;
      }
      var e;
      const f = A.toString(a.model);
      e = 415334 ^ 415342;
      try {
        if (d.spatial) {
          let a;
          switch (f) {
            case "linear":
              a = BABYLON.DistanceModel.Linear;
              break;
            case "inverse":
              a = BABYLON.DistanceModel.Inverse;
              break;
            case "exponential":
              a = BABYLON.DistanceModel.Exponential;
              break;
            default:
              a = BABYLON.DistanceModel.Inverse;
          }
          d.spatial.distanceModel = a;
        }
      } catch (a) {
        console.error(":ledom ecnatsid dnuos gnittes rorrE".split("").reverse().join(""), a);
      }
    }
    setSoundMaxDistance(a) {
      var b = (712319 ^ 712310) + (631565 ^ 631560);
      const c = A.toString(a.soundId);
      b = 341767 ^ 341765;
      const d = aa.get(c);
      if (!d) {
        return;
      }
      var e = (518328 ^ 518321) + (554027 ^ 554025);
      const f = A.toNumber(a.maxDistance);
      e = (227297 ^ 227297) + (483482 ^ 483484);
      try {
        if (d.spatial) {
          d.spatial.maxDistance = f;
        }
      } catch (a) {
        console.error("Error setting sound max distance:", a);
      }
    }
    setSoundPlaybackRate(a) {
      const b = A.toString(a.soundId);
      const c = aa.get(b);
      if (!c) {
        return;
      }
      var d;
      const e = A.toNumber(a.rate);
      d = 569663 ^ 569658;
      try {
        c.playbackRate = Math.max(0.25, Math.min(508607 ^ 508603, e));
      } catch (a) {
        console.error(":etar kcabyalp dnuos gnittes rorrE".split("").reverse().join(""), a);
      }
    }
    isSoundPlaying(a) {
      const b = A.toString(a.soundId);
      const c = aa.get(b);
      if (!c) {
        return false;
      }
      try {
        return c.isPlaying;
      } catch (a) {
        console.error("Error checking if sound is playing:", a);
        return false;
      }
    }
    getSoundDuration(a) {
      const b = A.toString(a.soundId);
      var c;
      const d = aa.get(b);
      c = (321524 ^ 321522) + (196248 ^ 196248);
      if (!d) {
        return 843533 ^ 843533;
      }
      try {
        return d.duration || 497774 ^ 497774;
      } catch (a) {
        console.error("Error getting sound duration:", a);
        return 100115 ^ 100115;
      }
    }
    getSoundCurrentTime(a) {
      var b;
      const c = A.toString(a.soundId);
      b = "bjcbgb".split("").reverse().join("");
      const d = aa.get(c);
      if (!d) {
        return 855555 ^ 855555;
      }
      try {
        return d.currentTime || 254786 ^ 254786;
      } catch (a) {
        console.error("Error getting sound current time:", a);
        return 186134 ^ 186134;
      }
    }
    removeSound(a) {
      var b;
      const c = A.toString(a.soundId);
      b = "opdpda".split("").reverse().join("");
      const d = aa.get(c);
      if (!d) {
        return;
      }
      try {
        d.dispose();
        aa.delete(c);
      } catch (a) {
        console.error("Error removing sound:", a);
      }
    }
    clearAllSounds() {
      aa.forEach((a, b) => {
        try {
          a.dispose();
        } catch (a) {
          console.warn(`Error disposing sound ${b}:`, a);
        }
      });
      aa.clear();
      g = 792744 ^ 792744;
    }
    setMasterVolume(a) {
      if (!S) {
        return;
      }
      var b;
      const c = A.toNumber(a.volume);
      b = (411445 ^ 411440) + (228965 ^ 228966);
      try {
        S.setGlobalVolume(Math.max(722084 ^ 722084, Math.min(944244 ^ 944245, c)));
      } catch (a) {
        console.error("Error setting master volume:", a);
      }
    }
    createCustomShader(a) {
      if (!K) {
        return "";
      }
      const b = A.toString(a.vertexCode);
      var c;
      const d = A.toString(a.fragmentCode);
      c = 118251 ^ 118250;
      j++;
      var e;
      const f = j;
      e = (863448 ^ 863450) + (301554 ^ 301557);
      try {
        var g;
        const a = `customVertex${f}`;
        g = "ejknqg";
        const c = `customFragment${f}`;
        BABYLON.Effect.ShadersStore[a] = b;
        BABYLON.Effect.ShadersStore[c] = d;
        console.log(`Creating shader material with vertex code:`, b.substring(565178 ^ 565178, 582569 ^ 582605) + "...");
        console.log(`Creating shader material with fragment code:`, d.substring(296262 ^ 296262, 996811 ^ 996783) + "...");
        const e = new BABYLON.ShaderMaterial(`shader${f}`, K, {
          vertexSource: b,
          fragmentSource: d
        }, {
          attributes: ["position", "lamron".split("").reverse().join(""), "vu".split("").reverse().join("")],
          uniforms: ["noitcejorPweiVdlrow".split("").reverse().join(""), "dlrow".split("").reverse().join(""), "view", "noitcejorp".split("").reverse().join(""), "time"],
          samplers: ["textureSampler"]
        });
        if (!e) {
          console.error(`Failed to create shader material for shader ${f}`);
          return "";
        }
        console.log(`Shader material created, checking if it's ready...`);
        console.log(`Shader material isReady:`, e.isReady());
        console.log(`Shader material effect:`, e.getEffect());
        K.executeWhenReady(() => {
          console.log(`Shader ${f} isReady after scene ready:`, e.isReady());
          if (!e.isReady()) {
            console.error(`Shader ${f} failed to compile`);
          }
        });
        ga.set(f, e);
        ha.set(f, {
          vertexKey: a,
          fragmentKey: c,
          vertexCode: b,
          fragmentCode: d
        });
        console.log(`Custom shader ${f} created successfully`);
        console.log(`Shader material created:`, e);
        console.log(`Total shaders in storage:`, ga.size);
        return f;
      } catch (a) {
        console.error("Error creating custom shader:", a);
        return "";
      }
    }
    setShaderUniform(a) {
      var b = (563369 ^ 563372) + (614736 ^ 614741);
      const c = A.toNumber(a.shaderId);
      b = (697034 ^ 697026) + (219374 ^ 219370);
      const d = A.toString(a.uniformName);
      const e = A.toNumber(a.value);
      var f;
      const g = A.toString(a.type);
      f = (205406 ^ 205407) + (662198 ^ 662196);
      const h = ga.get(c);
      if (!h) {
        return;
      }
      try {
        switch (g) {
          case "float":
            h.setFloat(d, e);
            break;
          case "int":
            h.setInt(d, Math.floor(e));
            break;
          case "bool":
            h.setBoolean(d, e !== (245205 ^ 245205));
            break;
        }
      } catch (a) {
        console.error(`Error setting uniform ${d}:`, a);
      }
    }
    setShaderVectorUniform(a) {
      const b = A.toNumber(a.shaderId);
      const c = A.toString(a.uniformName);
      var d;
      const e = A.toNumber(a.x);
      d = (782060 ^ 782061) + (897616 ^ 897624);
      var f = (575221 ^ 575228) + (378483 ^ 378483);
      const g = A.toNumber(a.y);
      f = (209875 ^ 209879) + (736619 ^ 736623);
      const h = A.toNumber(a.z);
      const i = A.toNumber(a.w);
      const j = ga.get(b);
      if (!j) {
        return;
      }
      try {
        if (i !== (183477 ^ 183477)) {
          j.setVector4(c, new BABYLON.Vector4(e, g, h, i));
        } else if (h !== (743372 ^ 743372)) {
          j.setVector3(c, new BABYLON.Vector3(e, g, h));
        } else {
          j.setVector2(c, new BABYLON.Vector2(e, g));
        }
      } catch (a) {
        console.error(`Error setting vector uniform ${c}:`, a);
      }
    }
    setShaderTexture(a) {
      const b = A.toNumber(a.shaderId);
      var c = (468462 ^ 468463) + (371473 ^ 371477);
      const d = A.toString(a.samplerName);
      c = "pookgb".split("").reverse().join("");
      var e = (482533 ^ 482531) + (668321 ^ 668320);
      const f = A.toNumber(a.textureId);
      e = (740670 ^ 740671) + (128757 ^ 128759);
      const g = ga.get(b);
      const h = Z.get(f);
      if (!g || !h) {
        return;
      }
      try {
        g.setTexture(d, h);
      } catch (a) {
        console.error(`Error setting texture ${d}:`, a);
      }
    }
    setShaderColorUniform(a) {
      const b = A.toNumber(a.shaderId);
      const c = A.toString(a.uniformName);
      const d = A.toRgbColorObject(a.color);
      var e;
      const f = ga.get(b);
      e = 372907 ^ 372910;
      if (!f) {
        return;
      }
      try {
        const a = new BABYLON.Color3(d.r / (761491 ^ 761452), d.g / (394785 ^ 394974), d.b / (598502 ^ 598297));
        f.setColor3(c, a);
      } catch (a) {
        console.error(`Error setting color uniform ${c}:`, a);
      }
    }
    applyShaderToMesh(a) {
      var b;
      const c = A.toNumber(a.shaderId);
      b = (923767 ^ 923775) + (403916 ^ 403908);
      var d;
      const e = A.toNumber(a.meshId);
      d = (973085 ^ 973081) + (579069 ^ 579071);
      console.log(`Attempting to apply shader ${c} to mesh ${e}`);
      console.log(`Available shaders:`, Array.from(ga.keys()));
      console.log(`Available meshes:`, Array.from(U.keys()));
      console.log(`Type of meshId:`, typeof e);
      console.log(`Types of available mesh keys:`, Array.from(U.keys()).map(a => typeof a));
      const f = ga.get(c);
      const g = U.get(e);
      const h = U.get(e.toString());
      var i;
      const j = U.get(e);
      i = (391323 ^ 391322) + (209854 ^ 209852);
      if (!f) {
        console.error(`Shader ${c} not found! Available shaders:`, Array.from(ga.keys()));
        return;
      }
      var k = (939797 ^ 939804) + (392758 ^ 392758);
      const l = j || h;
      k = "doeimo".split("").reverse().join("");
      if (!l) {
        console.error(`Mesh ${e} not found! Available meshes:`, Array.from(U.keys()));
        console.error(`Tried as number:`, j, `Tried as string:`, h);
        return;
      }
      try {
        if (!f.isReady()) {
          console.log(`Shader ${c} is not ready, waiting...`);
          const a = () => {
            if (f.isReady()) {
              l.material = f;
              console.log(`Successfully applied shader ${c} to mesh ${e} (delayed)`);
              console.log(`Mesh material after assignment:`, l.material);
            } else {
              // TOLOOK
              setTimeout(a, 563952 ^ 563860);
            }
          };
          a();
        } else {
          l.material = f;
          console.log(`Successfully applied shader ${c} to mesh ${e}`);
          console.log(`Mesh material after assignment:`, l.material);
        }
      } catch (a) {
        console.error("Error applying shader to mesh:", a);
      }
    }
    removeShaderFromMesh(a) {
      var b = (389211 ^ 389203) + (234535 ^ 234528);
      const c = A.toNumber(a.meshId);
      b = 100357 ^ 100359;
      const d = U.get(c.toString());
      var e;
      const f = U.get(c);
      e = (396320 ^ 396328) + (601569 ^ 601575);
      var g;
      const h = f || d;
      g = (450759 ^ 450752) + (232027 ^ 232030);
      if (!h) {
        return;
      }
      try {
        var i;
        const a = new BABYLON.StandardMaterial(`default_${c}`, K);
        i = (896597 ^ 896594) + (917361 ^ 917366);
        a.diffuseColor = new BABYLON.Color3(219186 ^ 219187, 547374 ^ 547375, 239613 ^ 239612);
        h.material = a;
        Y.set(c, a);
        console.log(`Removed shader from mesh ${c}`);
      } catch (a) {
        console.error("Error removing shader from mesh:", a);
      }
    }
    setShaderTime(a) {
      const b = A.toNumber(a.shaderId);
      var c = (852236 ^ 852237) + (225027 ^ 225030);
      const d = A.toString(a.uniformName);
      c = (790687 ^ 790680) + (287773 ^ 287771);
      var e;
      const f = ga.get(b);
      e = (878750 ^ 878748) + (412148 ^ 412156);
      if (!f) {
        return;
      }
      try {
        const a = Date.now() / (110291 ^ 109883);
        f.setFloat(d, a);
      } catch (a) {
        console.error(`Error setting time uniform ${d}:`, a);
      }
    }
    createPresetShader(a) {
      if (!K) {
        return "";
      }
      var b = (860825 ^ 860829) + (650657 ^ 650665);
      const c = A.toString(a.presetType);
      b = "cjcppk";
      j++;
      var d = (572034 ^ 572043) + (188495 ^ 188489);
      const e = j;
      d = "fkkgjd";
      let f;
      let g;
      switch (c) {
        case "wave":
          f = `precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 worldViewProjection;
uniform float time;
varying vec2 vUV;
varying float vTime;
void main(void) {
    vec3 pos = position;
    pos.y += sin(position.x * 2.0 + time) * 0.1;
    pos.y += cos(position.z * 3.0 + time * 1.5) * 0.08;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vUV = uv;
    vTime = time;
}`;
          g = `precision highp float;
varying vec2 vUV;
varying float vTime;
uniform sampler2D textureSampler;
void main(void) {
    vec2 uv = vUV;
    uv.x += sin(vTime + uv.y * 10.0) * 0.02;
    uv.y += cos(vTime + uv.x * 8.0) * 0.02;
    vec4 color = texture2D(textureSampler, uv);
    color.rgb *= 0.8 + 0.2 * sin(vTime);
    gl_FragColor = color;
}`;
          break;
        case "tneidarg".split("").reverse().join(""):
          f = `precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 worldViewProjection;
varying vec2 vUV;
void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}`;
          g = `precision highp float;
varying vec2 vUV;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
void main(void) {
    float t = (vUV.x + vUV.y) * 0.5 + sin(time) * 0.5;
    vec3 color = mix(color1, color2, t);
    gl_FragColor = vec4(color, 1.0);
}`;
          break;
        case "hctilg".split("").reverse().join(""):
          f = `precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 worldViewProjection;
varying vec2 vUV;
void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}`;
          g = `precision highp float;
varying vec2 vUV;
uniform float time;
uniform sampler2D textureSampler;
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
void main(void) {
    vec2 uv = vUV;
    float glitch = step(0.95, random(vec2(floor(time * 10.0), floor(uv.y * 100.0))));
    uv.x += glitch * 0.1;
    vec4 color = texture2D(textureSampler, uv);
    if (glitch > 0.5) {
      color.rgb = vec3(1.0) - color.rgb;
    }
    gl_FragColor = color;
}`;
          break;
        case "margoloh".split("").reverse().join(""):
          f = `precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 worldViewProjection;
uniform float time;
varying vec2 vUV;
varying vec3 vPosition;
void main(void) {
    vec3 pos = position;
    pos.y += sin(time + pos.x * 5.0) * 0.02;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vUV = uv;
    vPosition = position;
}`;
          g = `precision highp float;
varying vec2 vUV;
varying vec3 vPosition;
uniform float time;
uniform sampler2D textureSampler;
void main(void) {
    vec2 uv = vUV;
    vec4 color = texture2D(textureSampler, uv);
    float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
    float flicker = sin(time * 15.0) * 0.1 + 0.9;
    color.rgb *= flicker;
    color.rgb += scanline;
    color.a *= 0.8;
    gl_FragColor = color;
}`;
          break;
        default:
          return "";
      }
      console.log(`Creating preset shader material with type:`, c);
      var h;
      const i = new BABYLON.ShaderMaterial(`shader${e}`, K, {
        vertexSource: f,
        fragmentSource: g
      }, {
        attributes: ["position", "lamron".split("").reverse().join(""), "vu".split("").reverse().join("")],
        uniforms: ["worldViewProjection", "dlrow".split("").reverse().join(""), "view", "projection", "emit".split("").reverse().join(""), "1roloc".split("").reverse().join(""), "2roloc".split("").reverse().join("")],
        samplers: ["textureSampler"]
      });
      h = "hbcgbc";
      if (!i) {
        console.error(`Failed to create preset shader material for shader ${e}`);
        return "";
      }
      console.log(`Preset shader material created, isReady:`, i.isReady());
      if (c === "tneidarg".split("").reverse().join("")) {
        i.setColor3("1roloc".split("").reverse().join(""), new BABYLON.Color3(0.5, 111500 ^ 111500, 292800 ^ 292801));
        i.setColor3("2roloc".split("").reverse().join(""), new BABYLON.Color3(458245 ^ 458244, 0.5, 703615 ^ 703615));
      }
      K.executeWhenReady(() => {
        console.log(`Preset shader ${e} isReady after scene ready:`, i.isReady());
        if (!i.isReady()) {
          console.error(`Preset shader ${e} failed to compile`);
        }
      });
      ga.set(e, i);
      ha.set(e, {
        vertexCode: f,
        fragmentCode: g,
        presetType: c
      });
      console.log(`Preset shader ${e} (${c}) created successfully`);
      console.log(`Preset shader material created:`, i);
      console.log(`Total shaders in storage:`, ga.size);
      return e;
    }
    updateShaderCode(a) {
      const b = A.toNumber(a.shaderId);
      var c = (408044 ^ 408037) + (516883 ^ 516881);
      const d = A.toString(a.vertexCode);
      c = (757882 ^ 757886) + (772919 ^ 772914);
      var e;
      const f = A.toString(a.fragmentCode);
      e = "nilibf";
      const g = ga.get(b);
      if (!g) {
        return;
      }
      try {
        var h = (981691 ^ 981689) + (472215 ^ 472211);
        const a = new BABYLON.ShaderMaterial(`shader${b}`, K, {
          vertexSource: d || g._options.vertexSource,
          fragmentSource: f || g._options.fragmentSource
        }, {
          attributes: ["noitisop".split("").reverse().join(""), "lamron".split("").reverse().join(""), "uv"],
          uniforms: ["worldViewProjection", "world", "view", "projection", "time", "1roloc".split("").reverse().join(""), "2roloc".split("").reverse().join("")],
          samplers: ["relpmaSerutxet".split("").reverse().join("")]
        });
        h = 227190 ^ 227198;
        g.dispose();
        ga.set(b, a);
        console.log(`Updated shader code for ${b}`);
      } catch (a) {
        console.error("Error updating shader code:", a);
      }
    }
    getShaderUniform(a) {
      const b = A.toNumber(a.shaderId);
      var c = (428118 ^ 428115) + (440364 ^ 440361);
      const d = A.toString(a.uniformName);
      c = (676581 ^ 676581) + (789684 ^ 789680);
      var e;
      const f = ga.get(b);
      e = (740052 ^ 740055) + (717749 ^ 717756);
      if (!f) {
        return 694977 ^ 694977;
      }
      try {
        return 371214 ^ 371214;
      } catch (a) {
        console.error(":eulav mrofinu gnitteg rorrE".split("").reverse().join(""), a);
        return 217798 ^ 217798;
      }
    }
    deleteShader(a) {
      const b = A.toNumber(a.shaderId);
      const c = ga.get(b);
      if (c) {
        c.dispose();
        ga.delete(b);
      }
      ha.delete(b);
      console.log(`Shader ${b} deleted`);
    }
    clearAllShaders() {
      ga.forEach((a, b) => {
        if (a && a.dispose) {
          a.dispose();
        }
      });
      ga.clear();
      ha.clear();
      j = 863755 ^ 863755;
      console.log("All shaders cleared");
    }
    getShaderCount() {
      return ga.size;
    }
  }
  var ib = (877352 ^ 877354) + (128561 ^ 128568);
  const jb = hb.prototype;
  ib = (948432 ^ 948439) + (198247 ^ 198246);
  jb.findMeshId = hb.prototype.findMeshId;
  jb.createBox = hb.prototype.createBox;
  jb.createSphere = hb.prototype.createSphere;
  jb.createGround = hb.prototype.createGround;
  jb.createCylinder = hb.prototype.createCylinder;
  jb.setPosition = hb.prototype.setPosition;
  jb.moveMesh = hb.prototype.moveMesh;
  jb.setRotation = hb.prototype.setRotation;
  jb.setScale = hb.prototype.setScale;
  jb.setColor = hb.prototype.setColor;
  jb.setMeshMass = hb.prototype.setMeshMass;
  jb.applyImpulse = hb.prototype.applyImpulse;
  jb.setGravity = hb.prototype.setGravity;
  jb.setCollisionsEnabled = hb.prototype.setCollisionsEnabled;
  jb.setMeshApplyGravity = hb.prototype.setMeshApplyGravity;
  jb.setCameraMinZ = hb.prototype.setCameraMinZ;
  jb.setMeshMinZ = hb.prototype.setMeshMinZ;
  jb.setMeshFriction = hb.prototype.setMeshFriction;
  jb.setMeshRestitution = hb.prototype.setMeshRestitution;
  jb.setMeshPhysicsProperties = hb.prototype.setMeshPhysicsProperties;
  jb.getPositionX = hb.prototype.getPositionX;
  jb.getPositionY = hb.prototype.getPositionY;
  jb.getPositionZ = hb.prototype.getPositionZ;
  jb.getRotationX = hb.prototype.getRotationX;
  jb.getRotationY = hb.prototype.getRotationY;
  jb.getRotationZ = hb.prototype.getRotationZ;
  jb.meshExists = hb.prototype.meshExists;
  jb.convertCoordinates = hb.prototype.convertCoordinates;
  jb.setParent = hb.prototype.setParent;
  jb.setCameraParent = hb.prototype.setCameraParent;
  jb.removeParent = hb.prototype.removeParent;
  jb.removeCameraParent = hb.prototype.removeCameraParent;
  jb.showMesh = hb.prototype.showMesh;
  jb.hideMesh = hb.prototype.hideMesh;
  jb.setMeshVisibility = hb.prototype.setMeshVisibility;
  jb.isMeshVisible = hb.prototype.isMeshVisible;
  jb.removeMesh = hb.prototype.removeMesh;
  jb.clearAllMeshes = hb.prototype.clearAllMeshes;
  jb.getMeshCount = hb.prototype.getMeshCount;
  jb.createBoxWithId = hb.prototype.createBoxWithId;
  jb.createSphereWithId = hb.prototype.createSphereWithId;
  jb.createTorus = hb.prototype.createTorus;
  jb.createPlane = hb.prototype.createPlane;
  jb.textureFromDataURI = hb.prototype.textureFromDataURI;
  jb.textureFromBase64 = hb.prototype.textureFromBase64;
  jb.createPointLight = hb.prototype.createPointLight;
  jb.createDirectionalLight = hb.prototype.createDirectionalLight;
  jb.createSpotLight = hb.prototype.createSpotLight;
  jb.setAmbientLight = hb.prototype.setAmbientLight;
  jb.enableShadows = hb.prototype.enableShadows;
  jb.disableShadows = hb.prototype.disableShadows;
  jb.setShadowMapSize = hb.prototype.setShadowMapSize;
  jb.setShadowFilterType = hb.prototype.setShadowFilterType;
  jb.setShadowBias = hb.prototype.setShadowBias;
  jb.setMeshShadowCasting = hb.prototype.setMeshShadowCasting;
  jb.setMeshShadowReceiving = hb.prototype.setMeshShadowReceiving;
  jb.addShadowCaster = hb.prototype.addShadowCaster;
  jb.removeShadowCaster = hb.prototype.removeShadowCaster;
  jb.setShadowDarkness = hb.prototype.setShadowDarkness;
  jb.setContactHardeningShadows = hb.prototype.setContactHardeningShadows;
  jb.shadowFilterTypes = hb.prototype.shadowFilterTypes;
  jb.deleteLight = hb.prototype.deleteLight;
  jb.setMeshLightingParticipation = hb.prototype.setMeshLightingParticipation;
  jb.getMeshLightingParticipation = hb.prototype.getMeshLightingParticipation;
  jb.createParticleSystem = hb.prototype.createParticleSystem;
  jb.setParticleTexture = hb.prototype.setParticleTexture;
  jb.setParticleEmitter = hb.prototype.setParticleEmitter;
  jb.setParticleEmitterPosition = hb.prototype.setParticleEmitterPosition;
  jb.setParticleColor = hb.prototype.setParticleColor;
  jb.setParticleSize = hb.prototype.setParticleSize;
  jb.setParticleLifeTime = hb.prototype.setParticleLifeTime;
  jb.setParticleEmissionRate = hb.prototype.setParticleEmissionRate;
  jb.setParticlePower = hb.prototype.setParticlePower;
  jb.setParticleGravity = hb.prototype.setParticleGravity;
  jb.setParticleRotation = hb.prototype.setParticleRotation;
  jb.setParticleDirection = hb.prototype.setParticleDirection;
  jb.setParticleEmitBox = hb.prototype.setParticleEmitBox;
  jb.startParticleSystem = hb.prototype.startParticleSystem;
  jb.stopParticleSystem = hb.prototype.stopParticleSystem;
  jb.resetParticleSystem = hb.prototype.resetParticleSystem;
  jb.deleteParticleSystem = hb.prototype.deleteParticleSystem;
  jb.getParticleSystemAliveCount = hb.prototype.getParticleSystemAliveCount;
  jb.setCameraType = hb.prototype.setCameraType;
  jb.setCameraFOV = hb.prototype.setCameraFOV;
  jb.setCameraAttachControl = hb.prototype.setCameraAttachControl;
  jb.setCameraMinZ = hb.prototype.setCameraMinZ;
  jb.setMeshMinZ = hb.prototype.setMeshMinZ;
  jb.animateRotation = hb.prototype.animateRotation;
  jb.stopAnimation = hb.prototype.stopAnimation;
  jb.animatePosition = hb.prototype.animatePosition;
  jb.meshTypes = hb.prototype.meshTypes;
  jb.cameraTypes = hb.prototype.cameraTypes;
  jb.lightTypes = hb.prototype.lightTypes;
  jb.animationAxes = hb.prototype.animationAxes;
  jb.textureTypes = hb.prototype.textureTypes;
  jb.coordinateTypes = hb.prototype.coordinateTypes;
  jb.physicsModes = hb.prototype.physicsModes;
  jb.ragdollShapes = hb.prototype.ragdollShapes;
  jb.createRay = hb.prototype.createRay;
  jb.rayIntersectsMesh = hb.prototype.rayIntersectsMesh;
  jb.rayMultiIntersectsMesh = hb.prototype.rayMultiIntersectsMesh;
  jb.getRayHitPoint = hb.prototype.getRayHitPoint;
  jb.pickWithRay = hb.prototype.pickWithRay;
  jb.showRay = hb.prototype.showRay;
  jb.hideRay = hb.prototype.hideRay;
  jb.deleteRay = hb.prototype.deleteRay;
  jb.updateRay = hb.prototype.updateRay;
  jb.multiPickWithRay = hb.prototype.multiPickWithRay;
  jb.applyTorque = hb.prototype.applyTorque;
  jb.applyAngularImpulse = hb.prototype.applyAngularImpulse;
  jb.setMeshAngularVelocity = hb.prototype.setMeshAngularVelocity;
  jb.getMeshAngularVelocityX = hb.prototype.getMeshAngularVelocityX;
  jb.getMeshAngularVelocityY = hb.prototype.getMeshAngularVelocityY;
  jb.getMeshAngularVelocityZ = hb.prototype.getMeshAngularVelocityZ;
  jb.getBoneCount = hb.prototype.getBoneCount;
  jb.getBoneName = hb.prototype.getBoneName;
  jb.getBoneWorldPosition = hb.prototype.getBoneWorldPosition;
  jb.getBoneLocalPosition = hb.prototype.getBoneLocalPosition;
  jb.setBonePosition = hb.prototype.setBonePosition;
  jb.setBoneRotation = hb.prototype.setBoneRotation;
  jb.getBonePosition = hb.prototype.getBonePosition;
  jb.enableMeshCollisions = hb.prototype.enableMeshCollisions;
  jb.disableMeshCollisions = hb.prototype.disableMeshCollisions;
  jb.meshesIntersect = hb.prototype.meshesIntersect;
  jb.setCollisionGroup = hb.prototype.setCollisionGroup;
  jb.setCollisionMask = hb.prototype.setCollisionMask;
  jb.createRagdoll = hb.prototype.createRagdoll;
  jb.configureRagdollPart = hb.prototype.configureRagdollPart;
  jb.enableRagdollPhysics = hb.prototype.enableRagdollPhysics;
  jb.disableRagdollPhysics = hb.prototype.disableRagdollPhysics;
  jb.applyImpulseToRagdollPart = hb.prototype.applyImpulseToRagdollPart;
  jb.enableCharacterController = hb.prototype.enableCharacterController;
  jb.disableCharacterController = hb.prototype.disableCharacterController;
  jb.moveCharacterController = hb.prototype.moveCharacterController;
  jb.rotateCharacterController = hb.prototype.rotateCharacterController;
  jb.jumpCharacterController = hb.prototype.jumpCharacterController;
  jb.setCharacterControllerHeight = hb.prototype.setCharacterControllerHeight;
  jb.setCharacterControllerRadius = hb.prototype.setCharacterControllerRadius;
  jb.setCharacterControllerGravity = hb.prototype.setCharacterControllerGravity;
  jb.setCharacterControllerFriction = hb.prototype.setCharacterControllerFriction;
  jb.setCharacterControllerRestitution = hb.prototype.setCharacterControllerRestitution;
  jb.getCharacterControllerState = hb.prototype.getCharacterControllerState;
  jb.isCharacterControllerGrounded = hb.prototype.isCharacterControllerGrounded;
  jb.getMeshBoneNames = hb.prototype.getMeshBoneNames;
  jb.getMeshAnimationNames = hb.prototype.getMeshAnimationNames;
  jb.createSound = hb.prototype.createSound;
  jb.createSoundFromBase64 = hb.prototype.createSoundFromBase64;
  jb.playSound = hb.prototype.playSound;
  jb.stopSound = hb.prototype.stopSound;
  jb.pauseSound = hb.prototype.pauseSound;
  jb.resumeSound = hb.prototype.resumeSound;
  jb.setSoundVolume = hb.prototype.setSoundVolume;
  jb.setSoundLoop = hb.prototype.setSoundLoop;
  jb.setSoundPosition = hb.prototype.setSoundPosition;
  jb.attachSoundToMesh = hb.prototype.attachSoundToMesh;
  jb.detachSoundFromMesh = hb.prototype.detachSoundFromMesh;
  jb.setSoundDistanceModel = hb.prototype.setSoundDistanceModel;
  jb.setSoundMaxDistance = hb.prototype.setSoundMaxDistance;
  jb.setSoundPlaybackRate = hb.prototype.setSoundPlaybackRate;
  jb.isSoundPlaying = hb.prototype.isSoundPlaying;
  jb.getSoundDuration = hb.prototype.getSoundDuration;
  jb.getSoundCurrentTime = hb.prototype.getSoundCurrentTime;
  jb.removeSound = hb.prototype.removeSound;
  jb.clearAllSounds = hb.prototype.clearAllSounds;
  jb.setMasterVolume = hb.prototype.setMasterVolume;
  jb.distanceModels = hb.prototype.distanceModels;
  jb.createCustomShader = hb.prototype.createCustomShader;
  jb.setShaderUniform = hb.prototype.setShaderUniform;
  jb.setShaderVectorUniform = hb.prototype.setShaderVectorUniform;
  jb.setShaderTexture = hb.prototype.setShaderTexture;
  jb.setShaderColorUniform = hb.prototype.setShaderColorUniform;
  jb.applyShaderToMesh = hb.prototype.applyShaderToMesh;
  jb.removeShaderFromMesh = hb.prototype.removeShaderFromMesh;
  jb.setShaderTime = hb.prototype.setShaderTime;
  jb.createPresetShader = hb.prototype.createPresetShader;
  jb.updateShaderCode = hb.prototype.updateShaderCode;
  jb.getShaderUniform = hb.prototype.getShaderUniform;
  jb.deleteShader = hb.prototype.deleteShader;
  jb.clearAllShaders = hb.prototype.clearAllShaders;
  jb.getShaderCount = hb.prototype.getShaderCount;
  jb.uniformTypes = hb.prototype.uniformTypes;
  jb.presetShaderTypes = hb.prototype.presetShaderTypes;
  jb.loadModel = hb.prototype.loadModel;
  jb.loadModelFromDataURL = hb.prototype.loadModelFromDataURL;
  jb.createText = hb.prototype.createText;
  jb.playMeshAnimation = hb.prototype.playMeshAnimation;
  jb.stopMeshAnimation = hb.prototype.stopMeshAnimation;
  jb.playSkeletalAnimation = hb.prototype.playSkeletalAnimation;
  jb.stopSkeletalAnimation = hb.prototype.stopSkeletalAnimation;
  jb.blendSkeletalAnimation = hb.prototype.blendSkeletalAnimation;
  jb.setAnimationWeight = hb.prototype.setAnimationWeight;
  jb.crossFadeAnimations = hb.prototype.crossFadeAnimations;
  jb.getAnimationWeight = hb.prototype.getAnimationWeight;
  jb.isAnimationPlaying = hb.prototype.isAnimationPlaying;
  jb.setPhysicsMode = hb.prototype.setPhysicsMode;
  jb.setSkybox = hb.prototype.setSkybox;
  jb.removeSkybox = hb.prototype.removeSkybox;
  jb.setFog = hb.prototype.setFog;
  jb.removeFog = hb.prototype.removeFog;
  jb.createLensFlare = hb.prototype.createLensFlare;
  jb.removeLensFlare = hb.prototype.removeLensFlare;
  jb.createReflectionProbe = hb.prototype.createReflectionProbe;
  jb.addMeshToReflectionProbe = hb.prototype.addMeshToReflectionProbe;
  jb.removeReflectionProbe = hb.prototype.removeReflectionProbe;
  Ra();
  F.on("PROJECT_LOADED", gb);
  a.extensions.register(new hb());
})(Scratch);