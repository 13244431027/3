"use strict";
(function (Scratch) {
    var _a;
    const IsShowWarn = true;
    const IsShowWarnExtraInfo = true;
    function Warn(...data) {
        if (IsShowWarn) {
            if (typeof data[0] == "string") {
                data[0] = "Easy Tanim: " + data[0];
            }
            if (IsShowWarnExtraInfo) {
                console.warn(...data);
            }
            else {
                console.warn(data[0]);
            }
        }
    }
    if (!Scratch?.extensions?.unsandboxed) {
        alert(`“时间轴动画”扩展必须在非沙盒模式下运行。
Easy Tanim must run unsandboxed.`);
        throw new Error("Easy Tanim must run unsandboxed.");
    }
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const Cast = Scratch.Cast;
    const isGandi = runtime.gandi ? true : false;
    const TheExtensionID = "cqeasytanim";
    const TheExtensionVersion = "0.0.0-beta";
    const translates = {
        "zh-cn": {
            ["CQET_extName"]: "时间轴动画",
            ["CQET_bGetTanimValue"]: "动画 [tanimName] [loopMode] 第 [time] [timeUnit] 的 [tanimValueType]",
            ["CQET_bSetContext"]: "将动画语境设为 [tanimName] [loopMode] 的第 [time] [timeUnit]",
            ["CQET_bGetContextValue"]: "语境的 [tanimValueType]",
            ["CQET_bCreateSnapshot"]: "为动画 [tanimName] [loopMode] 的第 [time] [timeUnit] 创建快照",
            ["CQET_bTransitSnapshot"]: "从快照 [snapshotIndexA] 到 [snapshotIndexB] 过渡，创建 [transitT] 处的快照",
            ["CQET_bGetSnapshotValue"]: "快照 [snapshotIndex] 的 [tanimValueType]",
            ["CQET_bSetContextBySnapshot"]: "将动画语境设为快照 [snapshotIndex]",
            ["CQET_bDeleteSnapshot"]: "删除动画快照 [snapshotIndex]",
            ["CQET_bDeleteAllSnapshot"]: "删除所有动画快照",
            ["CQET_bGetTanimInfo"]: "动画 [tanimName] 的 [tanimInfoType]",
            ["CQET_bGetTanimEditorInfo"]: "动画编辑器的 [tanimEditorInfoType]",
            ["CQET_mLoopMode_loop"]: "循环播放",
            ["CQET_mLoopMode_once"]: "播放一次",
            ["CQET_mLoopMode_loopYoyo"]: "循环往复",
            ["CQET_mLoopMode_onceYoyo"]: "往复一次",
            ["CQET_mTimeUnit_second"]: "秒",
            ["CQET_mTimeUnit_frame"]: "帧",
            ["CQET_mTanimValueType_px"]: "x 坐标",
            ["CQET_mTanimValueType_py"]: "y 坐标",
            ["CQET_mTanimValueType_s"]: "大小",
            ["CQET_mTanimValueType_sx"]: "x 拉伸",
            ["CQET_mTanimValueType_sy"]: "y 拉伸",
            ["CQET_mTanimValueType_sq"]: "挤压",
            ["CQET_mTanimValueType_sqx"]: "x 挤压倍数",
            ["CQET_mTanimValueType_sqy"]: "y 挤压倍数",
            ["CQET_mTanimValueType_d"]: "方向",
            ["CQET_mTanimValueType_cos"]: "造型",
            ["CQET_mTanimInfoType_lengthSec"]: "时长",
            ["CQET_mTanimInfoType_length"]: "总帧数",
            ["CQET_mTanimInfoType_fps"]: "每秒帧数",
            ["CQET_mTanimEditorInfoType_time"]: "当前帧",
            ["CQET_mTanimEditorInfoType_anim"]: "当前动画",
            ["CQET_mTanimEditorInfoType_sprite"]: "当前角色",
            ["CQET_mTanimEditorInfoType_cosPrefix"]: "造型前缀",
            ["CQET_mTanimEditorInfoType_cosName"]: "造型名称",
            ["CQET_mTanimEditorInfoType_cosSuffix"]: "造型后缀",
            ["CQET_labelContext"]: "~ 🍬动画语境 ~",
            ["CQET_labelSnapshot"]: "~ 📷动画快照 ~",
            ["CQET_labelUtils"]: "~ 👉附加功能 ~",
            ["CQET_buttonDoc"]: "📄文档",
            ["CQET_buttonTutorial"]: "📄教程",
            ["CQET_buttonEditor"]: "✏️动画编辑器",
            ["CQET_eDefaultTitle"]: "时间轴动画编辑器",
            ["CQET_eDefaultHint"]: "- 提示栏 -",
            ["CQET_eTanimListTitle"]: "动画管理器",
            ["CQET_eLayerListTitle"]: "图层",
            ["CQET_eDefaultTanimName"]: "动画",
            ["CQET_eNewTanimNameQuestion"]: "新建动画",
            ["CQET_eNewTanimNameInFolderQuestion"]: "在文件夹“[folderName]”中新建动画",
            ["CQET_eRenameTanimQuestion"]: "重命名动画“[tanimName]”",
            ["CQET_eRenameFolderQuestion"]: "重命名文件夹“[folderName]”",
            ["CQET_eDeleteTanimQuestion"]: "时间轴动画编辑器：确定要删除动画“[tanimName]”吗？",
            ["CQET_eNewMarkQuestion"]: "新建标签",
            ["CQET_eDeleteMarkQuestion"]: "时间轴动画编辑器：确定要删除标签“[markName]”吗？",
            ["CQET_eDefaultConfirmQuestion"]: "时间轴动画编辑器：确定要执行此操作吗？",
            ["CQET_eCUIFPS"]: "[fps] 帧/秒",
            ["CQET_eKUITitle"]: "关键帧",
            ["CQET_eKUIPleaseCreateTanim"]: "- 请在右上方新建动画 -",
            ["CQET_eKUIPleaseOpenTanim"]: "- 请在上方打开动画 -",
            ["CQET_eKUINoSelect"]: "- 未选中关键帧 -",
            ["CQET_eKUIMultiSelect"]: "- 多个关键帧 -",
            ["CQET_eKUILastSelect"]: "- 最后一个关键帧 -",
            ["CQET_eKUIStringKeyframeSelect"]: "- 这个关键帧的值是字符串 -",
            ["CQET_eKUITimeSec"]: "秒：[TimeSec]",
            ["CQET_eKUITimeFrame"]: "帧：[TimeFrame]",
            ["CQET_eKUITValue"]: "值：[TValue]",
            ["CQET_eKUIInterType"]: "缓动模式：[InterType]",
            ["CQET_eKUIInterTypeListItem"]: "[InterType]",
            ["CQET_eKUIPowerN"]: "指数：[powerN]",
            ["CQET_eKUIExpN"]: "陡峭程度：[expN]",
            ["CQET_eKUIElasticM"]: "摆动次数：[elasticM]",
            ["CQET_eKUIElasticN"]: "陡峭程度：[elasticN]",
            ["CQET_eKUIBackS"]: "回弹幅度：[backS]",
            ["CQET_eKUITradExpVD"]: "每次迭代除数：[tradExpV]",
            ["CQET_eKUITradExpVM"]: "乘数：[TradExpVM]",
            ["CQET_eKUITradExpP"]: "每帧迭代次数：[tradExpP]",
            ["CQET_eKUILag2Controller"]: "第三点相对坐标：",
            ["CQET_eKUILagrangeCX"]: "帧：[lagrangeCX]",
            ["CQET_eKUILagrangeCY"]: "纵坐标：[lagrangeCY]",
            ["CQET_eKUIEaseType"]: "方向：",
            ["CQET_eKUIBezierHandleType"]: "手柄类型：",
            ["CQET_eInterTypeConstShort"]: "常数",
            ["CQET_eInterTypeConstLong"]: "常数",
            ["CQET_eInterTypeLinearShort"]: "匀速",
            ["CQET_eInterTypeLinearLong"]: "匀速（线性）",
            ["CQET_eInterTypePowerShort"]: "幂函数",
            ["CQET_eInterTypePowerLong"]: "幂函数",
            ["CQET_eInterTypeExpShort"]: "指数",
            ["CQET_eInterTypeExpLong"]: "指数函数",
            ["CQET_eInterTypeSineShort"]: "正弦",
            ["CQET_eInterTypeSineLong"]: "正弦曲线",
            ["CQET_eInterTypeCircularShort"]: "圆弧",
            ["CQET_eInterTypeCircularLong"]: "圆弧曲线",
            ["CQET_eInterTypeElasticShort"]: "弹簧",
            ["CQET_eInterTypeElasticLong"]: "弹簧",
            ["CQET_eInterTypeBackShort"]: "回弹",
            ["CQET_eInterTypeBackLong"]: "回弹",
            ["CQET_eInterTypeBounceShort"]: "弹跳",
            ["CQET_eInterTypeBounceLong"]: "弹跳",
            ["CQET_eInterTypeTradExpShort"]: "传统",
            ["CQET_eInterTypeTradExpLong"]: "传统非线性",
            ["CQET_eInterTypeLagrangeShort"]: "三点",
            ["CQET_eInterTypeLagrangeLong"]: "三点二次函数",
            ["CQET_eInterTypeBezierShort"]: "曲线",
            ["CQET_eInterTypeBezierLong"]: "贝塞尔曲线",
            ["CQET_eInputKeyframeSecQuestion"]: "更改关键帧横坐标（秒）",
            ["CQET_eInputKeyframeFrameQuestion"]: "更改关键帧横坐标（帧）",
            ["CQET_eInputKeyframeTValueQuestion"]: "更改关键帧值（数字或字符串）",
            ["CQET_eInputPowerNQuestion"]: "更改幂函数指数（≥0）",
            ["CQET_eInputExpNQuestion"]: "更改指数缓动陡峭程度（>0）",
            ["CQET_eInputElasticMQuestion"]: "更改弹簧缓动摆动次数（>0）",
            ["CQET_eInputElasticNQuestion"]: "更改弹簧缓动陡峭程度（>0）",
            ["CQET_eInputBackSQuestion"]: "更改回弹幅度（≥0）",
            ["CQET_eInputTradExpVQuestion"]: "更改每次迭代除数（>1）",
            ["CQET_eInputTradExpVMQuestion"]: "更改每次迭代乘数（>0，<1）",
            ["CQET_eInputTradExpPQuestion"]: "更改每秒迭代次数（>0）",
            ["CQET_eInputLagrangeCXSecQuestion"]: "更改控制点横坐标（秒）",
            ["CQET_eInputLagrangeCXQuestion"]: "更改控制点横坐标（帧）",
            ["CQET_eInputLagrangeCYQuestion"]: "更改控制点纵坐标",
            ["CQET_eTUINamePxPy"]: "坐标",
            ["CQET_eTUINameS"]: "大小",
            ["CQET_eTUINameSxSy"]: "拉伸",
            ["CQET_eTUINameSq"]: "挤压",
            ["CQET_eTUINameD"]: "方向",
            ["CQET_eTUINameCos"]: "造型",
            ["CQET_eTUINameCreateNewTValueType"]: "新建属性",
            ["CQET_eDefaultTValueTypeName"]: "属性",
            ["CQET_eNewTValueTypeQuestion"]: "新建属性",
            ["CQET_ePUISpriteName"]: "角色名称：[SpriteName]",
            ["CQET_ePUISpriteNameQuestion"]: "预览角色名称",
            ["CQET_ePUICostumeName0"]: "造型前缀：[CostumeName0]",
            ["CQET_ePUICostumeName0Question"]: "预览造型前缀",
            ["CQET_ePUICostumeName1"]: "造型名称：[CostumeName1]",
            ["CQET_ePUICostumeName1Question"]: "预览造型名称（此值会覆盖动画值“造型”）",
            ["CQET_ePUICostumeName2"]: "造型后缀：[CostumeName2]",
            ["CQET_ePUICostumeName2Question"]: "预览造型后缀",
            ["CQET_tanimMenuPlaceholder"]: "- 未创建动画 -",
        },
    };
    Scratch.translate.setup(translates);
    function getTranslate(id) {
        return Scratch.translate({ id: id, default: translates["zh-cn"][id] });
    }
    const InterTypeStrings = {
        ["const"]: ["CQET_eInterTypeConstShort", "CQET_eInterTypeConstLong"],
        ["linear"]: ["CQET_eInterTypeLinearShort", "CQET_eInterTypeLinearLong"],
        ["power"]: ["CQET_eInterTypePowerShort", "CQET_eInterTypePowerLong"],
        ["exp"]: ["CQET_eInterTypeExpShort", "CQET_eInterTypeExpLong"],
        ["sine"]: ["CQET_eInterTypeSineShort", "CQET_eInterTypeSineLong"],
        ["circular"]: ["CQET_eInterTypeCircularShort", "CQET_eInterTypeCircularLong"],
        ["elastic"]: ["CQET_eInterTypeElasticShort", "CQET_eInterTypeElasticLong"],
        ["back"]: ["CQET_eInterTypeBackShort", "CQET_eInterTypeBackLong"],
        ["bounce"]: ["CQET_eInterTypeBounceShort", "CQET_eInterTypeBounceLong"],
        ["tradExp"]: ["CQET_eInterTypeTradExpShort", "CQET_eInterTypeTradExpLong"],
        ["lagrange"]: ["CQET_eInterTypeLagrangeShort", "CQET_eInterTypeLagrangeLong"],
        ["bezier"]: ["CQET_eInterTypeBezierShort", "CQET_eInterTypeBezierLong"],
    };
    const InputEaseParamQuestionStrings = {
        "powerN": "CQET_eInputPowerNQuestion",
        "expN": "CQET_eInputExpNQuestion",
        "elasticM": "CQET_eInputElasticMQuestion",
        "elasticN": "CQET_eInputElasticNQuestion",
        "backS": "CQET_eInputBackSQuestion",
        "tradExpV": "CQET_eInputTradExpVQuestion",
        "tradExpP": "CQET_eInputTradExpPQuestion",
        "lagrangeCX": "CQET_eInputLagrangeCXQuestion",
        "lagrangeCY": "CQET_eInputLagrangeCYQuestion",
    };
    let { exp, pow, PI, sin, cos, atan2, sqrt, abs, max, min, log, log2, log10, sign, SQRT2 } = Math;
    function round(x, n = 0) {
        let m = 10 ** max(n, 0);
        return Math.round(x * m) / m;
    }
    function floor(x, n = 0) {
        let m = 10 ** n;
        return Math.floor(x * m) / m;
    }
    function ceil(x, n = 0) {
        let m = 10 ** n;
        return Math.ceil(x * m) / m;
    }
    function getSafeCommentID(base) {
        let ids = [];
        for (let i in runtime.targets) {
            let t = runtime.targets[i];
            for (let j in t.comments) {
                ids.push(t.comments[j].id);
            }
        }
        if (!ids.includes(base))
            return base;
        let i;
        for (i = 2; ids.includes(base + i); i++)
            continue;
        return base + i;
    }
    function clamp(x, a, b) {
        return max(a, min(x, b));
    }
    function rotateVectorToDirection(x1, y1, x2, y2) {
        let l1 = Math.sqrt(x1 * x1 + y1 * y1);
        let l2 = Math.sqrt(x2 * x2 + y2 * y2);
        return [l1 * x2 / l2, l1 * y2 / l2];
    }
    function positiveMod(x, n) {
        x = x % n;
        if (x < 0)
            x -= floor(x / n) * n;
        return x;
    }
    function sqToSqx(sq) {
        return sq > 0 ? 100 / (100 + sq) : (100 - sq) / 100;
    }
    function sqToSqy(sq) {
        return sq > 0 ? (100 + sq) / 100 : 100 / (100 - sq);
    }
    class InterpolationFunctions {
        static InterLerp(x1, y1, x2, y2, x) {
            if (x1 == x2)
                return y2;
            let t = (x - x1) / (x2 - x1);
            return this.Lerp(y1, y2, t);
        }
        ;
        static TInOut(t) {
            if (t <= 0.5) {
                return t * 2;
            }
            else {
                return (1 - t) * 2;
            }
        }
        ;
        static RInOut(t, r) {
            if (t <= 0.5) {
                return r / 2;
            }
            else {
                return 1 - r / 2;
            }
        }
        ;
        static TOutIn(t) {
            if (t <= 0.5) {
                return 1 - t * 2;
            }
            else {
                return 2 * t - 1;
            }
        }
        ;
        static ROutIn(t, r) {
            if (t <= 0.5) {
                return (1 - r) / 2;
            }
            else {
                return (1 + r) / 2;
            }
        }
        ;
        static InterEase(x1, y1, x2, y2, x, easeType, mfn) {
            if (x1 == x2)
                return y2;
            let t = (x - x1) / (x2 - x1);
            let tm = t;
            switch (easeType) {
                case "easeOut":
                    tm = 1 - t;
                    break;
                case "easeInOut":
                    tm = this.TInOut(t);
                    break;
                case "easeOutIn":
                    tm = this.TOutIn(t);
                    break;
            }
            let rm = mfn(tm);
            let r = rm;
            switch (easeType) {
                case "easeOut":
                    r = 1 - rm;
                    break;
                case "easeInOut":
                    r = this.RInOut(t, rm);
                    break;
                case "easeOutIn":
                    r = this.ROutIn(t, rm);
                    break;
            }
            return this.Lerp(y1, y2, r);
        }
    }
    _a = InterpolationFunctions;
    InterpolationFunctions.Lerp = (a, b, t) => (1 - t) * a + t * b;
    InterpolationFunctions.MapPowerIn = (t, n) => pow(t, n);
    InterpolationFunctions.MapExpIn = (t, n) => (exp(n * t) - 1) / (exp(n) - 1);
    InterpolationFunctions.MapSineIn = (t) => 1 - cos(t * PI / 2);
    InterpolationFunctions.MapCircIn = (t) => -(sqrt(1 - pow(t, 2)) - 1);
    InterpolationFunctions.MapElasticIn = (t, m, n) => ((exp(n * t) - 1) / (exp(n) - 1)) * sin(2 * PI * (m * (t - 1) + 0.25));
    InterpolationFunctions.MapBackIn = (t, s) => t * t * ((s + 1) * t - s);
    InterpolationFunctions.GetBackH = (s) => (4 * s * s * s) / (27 * (s + 1) * (s + 1));
    InterpolationFunctions.MapBounceOut = (t) => {
        if ((t) < (1 / 2.75)) {
            return (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        }
        else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        }
        else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    };
    InterpolationFunctions.InterTradExp = (x1, y1, x2, y2, x, v, p) => {
        if (x1 == x2)
            return y2;
        let a = pow(1 - 1 / v, p * (x2 - x1));
        let t = (x - x1) / (x2 - x1);
        let r = (pow(a, t) - 1) / (a - 1);
        return _a.Lerp(y1, y2, r);
    };
    InterpolationFunctions.InterLag2 = (x1, y1, x2, y2, cx, cy, x) => {
        if (x1 == x2 || x1 == cx || x2 == cx)
            return _a.InterLerp(x1, y1, x2, y2, x);
        let l1 = (y1 * (x - cx) * (x - x2)) / ((x1 - cx) * (x1 - x2));
        let l2 = (cy * (x - x1) * (x - x2)) / ((cx - x1) * (cx - x2));
        let l3 = (y2 * (x - x1) * (x - cx)) / ((x2 - x1) * (x2 - cx));
        return l1 + l2 + l3;
    };
    InterpolationFunctions.CalcBezier3 = (p1, p2, p3, p4, t) => p1 * pow(1 - t, 3) + p2 * 3 * pow(1 - t, 2) * t + p3 * 3 * (1 - t) * pow(t, 2) + p4 * pow(t, 3);
    InterpolationFunctions.InterBezier3 = (x1, y1, x2, y2, cx1, cy1, cx2, cy2, x) => {
        if (x1 == x2)
            return y2;
        cx1 = clamp(cx1, x1, x2);
        cx2 = clamp(cx2, x1, x2);
        let f = (t) => _a.CalcBezier3(x1, cx1, cx2, x2, t);
        let t = (x - x1) / (x2 - x1);
        let low = 0;
        let high = 1;
        let ft;
        for (let i = 0; i < 100; i++) {
            ft = f(t);
            if (Math.abs(ft - x) <= 1e-5) {
                break;
            }
            else if (ft > x) {
                high = t;
            }
            else {
                low = t;
            }
            t = (low + high) / 2;
        }
        return _a.CalcBezier3(y1, cy1, cy2, y2, t);
    };
    const DefaultTValues = {
        ["px"]: 0,
        ["py"]: 0,
        ["s"]: 100,
        ["sx"]: 100,
        ["sy"]: 100,
        ["sq"]: 0,
        ["sqx"]: 1,
        ["sqy"]: 1,
        ["d"]: 90,
        ["cos"]: "",
    };
    function safeTValue(tValue, tValueType) {
        let result = tValue ?? DefaultTValues[tValueType] ?? 0;
        return Number.isNaN(result) ? 0 : result;
    }
    function getSnapshotValue(snapshot, tValueType) {
        return safeTValue(snapshot[tValueType], tValueType);
    }
    class Keyframe {
        constructor(x, y, interType, params = null) {
            this.interType = interType;
            this.x = x;
            this.y = y;
            this.params = params ?? null;
        }
        static FromObject(obj) {
            try {
                let { x, y, interType, params } = obj;
                if (typeof x != "number" ||
                    (typeof y != "number" && typeof y != "string") ||
                    typeof interType != "string" ||
                    typeof params != "object") {
                    throw new Error();
                }
                ;
                return new Keyframe(x, y, interType, params);
            }
            catch (error) {
                Warn("尝试构造 Keyframe 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
        getDefaultParam(key) {
            switch (key) {
                case "easeType": return "easeIn";
                case "powerN": return 2;
                case "expN": return 6.93;
                case "elasticM": return 3.33;
                case "elasticN": return 6.93;
                case "backS": return 1.70158;
                case "tradExpV": return 3;
                case "tradExpP": return 1;
                case "lagrangeCX": return 0;
                case "lagrangeCY": return 0;
                case "bezierCX1": return 0;
                case "bezierCY1": return 0;
                case "bezierCX2": return 0;
                case "bezierCY2": return 0;
                case "bezierHandleType": return "auto";
                default: return null;
            }
        }
        getParam(key) {
            let result = this.params === null ? null : this.params[key];
            return result ?? this.getDefaultParam(key);
        }
        setParam(key, value) {
            if (!this.params)
                this.params = {};
            if (Number.isNaN(value))
                return;
            switch (key) {
                case "powerN":
                case "backS":
                    if (typeof value != "number")
                        return;
                    value = max(value, 0);
                    break;
                case "expN":
                case "elasticM":
                case "elasticN":
                case "tradExpP":
                    if (typeof value != "number")
                        return;
                    if (value <= 0)
                        value = 0.0001;
                    break;
                case "tradExpV":
                    if (typeof value != "number")
                        return;
                    if (value <= 1)
                        value = 1.0001;
                    break;
            }
            this.params[key] = value;
        }
        static Ease(x, left, right) {
            let interType = left.interType;
            let { x: x1, y: y1 } = left;
            let { x: x2, y: y2 } = right;
            if (typeof y1 == "string" || typeof y2 == "string") {
                return y1;
            }
            let easeType = left.getParam("easeType");
            let fn = InterpolationFunctions;
            switch (interType) {
                case "const":
                    return y1;
                case "linear":
                    return fn.InterLerp(x1, y1, x2, y2, x);
                case "tradExp":
                    return fn.InterTradExp(x1, y1, x2, y2, x, left.getParam("tradExpV"), left.getParam("tradExpP"));
                case "lagrange":
                    return fn.InterLag2(x1, y1, x2, y2, left.getParam("lagrangeCX") + (x1 + x2) / 2, left.getParam("lagrangeCY") + (y1 + y2) / 2, x);
                case "bezier":
                    return fn.InterBezier3(x1, y1, x2, y2, left.getParam("bezierCX1") + x1, left.getParam("bezierCY1") + y1, left.getParam("bezierCX2") + x2, left.getParam("bezierCY2") + y2, x);
                case "power":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapPowerIn(tm, left.getParam("powerN")));
                case "exp":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapExpIn(tm, left.getParam("expN")));
                case "sine":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapSineIn(tm));
                case "circular":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapCircIn(tm));
                case "elastic":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapElasticIn(tm, left.getParam("elasticM"), left.getParam("elasticN")));
                case "back":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => fn.MapBackIn(tm, left.getParam("backS")));
                case "bounce":
                    return fn.InterEase(x1, y1, x2, y2, x, easeType, tm => 1 - fn.MapBounceOut(1 - tm));
                default:
                    return y1;
            }
        }
        getCopy() {
            return Keyframe.FromObject(JSON.parse(JSON.stringify(this)));
        }
    }
    class Timeline {
        constructor(tValueType, keyframes) {
            this.tValueType = tValueType;
            this.keyframes = keyframes;
        }
        static FromObject(obj) {
            try {
                let { tValueType, keyframes } = obj;
                if (typeof tValueType != "string" ||
                    !Array.isArray(keyframes)) {
                    throw new Error();
                }
                ;
                let parsedKeyframes = keyframes.map(kf => {
                    let parsedKeyframe = Keyframe.FromObject(kf);
                    if (parsedKeyframe === null) {
                        throw new Error();
                    }
                    else {
                        return parsedKeyframe;
                    }
                });
                return new Timeline(tValueType, parsedKeyframes);
            }
            catch (error) {
                Warn("尝试构造 Timeline 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
        findLeftKeyframe(x, equals = true) {
            let left = 0;
            let right = this.keyframes.length - 1;
            let result = null;
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const keyframe = this.keyframes[mid];
                if (keyframe.x < x || (equals && keyframe.x === x)) {
                    result = keyframe;
                    left = mid + 1;
                }
                else {
                    right = mid - 1;
                }
            }
            return result;
        }
        findRightKeyframe(x, equals = true) {
            let left = 0;
            let right = this.keyframes.length - 1;
            let result = null;
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const keyframe = this.keyframes[mid];
                if (keyframe.x > x || (equals && keyframe.x === x)) {
                    result = keyframe;
                    right = mid - 1;
                }
                else {
                    left = mid + 1;
                }
            }
            return result;
        }
        findKeyframeByTime(x, r = 0.5) {
            let left = 0;
            let right = this.keyframes.length - 1;
            let startIdx = -1;
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                if (this.keyframes[mid].x >= x - r) {
                    right = mid - 1;
                }
                else {
                    left = mid + 1;
                }
            }
            startIdx = left;
            let closest = null;
            for (let i = startIdx; i < this.keyframes.length; i++) {
                const point = this.keyframes[i];
                if (point.x > x + r)
                    break;
                const distance = Math.abs(point.x - x);
                if (distance <= r) {
                    if (!closest || distance <= Math.abs(closest.x - x)) {
                        closest = point;
                    }
                }
            }
            return closest;
        }
        getTValueByFrame(x) {
            if (this.keyframes.length == 0) {
                return DefaultTValues[this.tValueType] ?? 0;
            }
            else if (this.keyframes.length == 1) {
                return this.keyframes[0].y;
            }
            let left = this.findLeftKeyframe(x);
            let right = this.findRightKeyframe(x);
            if (!left || !right) {
                return safeTValue(right?.y ?? left?.y ?? null, this.tValueType);
            }
            if (left.x == right.x) {
                return left.y;
            }
            return Keyframe.Ease(x, left, right);
        }
        rename(tValueType) {
            this.tValueType = tValueType;
        }
        sortKeyframes() {
            let indexedKeyframes = this.keyframes.map((keyframe, index) => ({ keyframe, index }));
            indexedKeyframes.sort((a, b) => a.keyframe.x - b.keyframe.x || a.index - b.index);
            this.keyframes.length = 0;
            this.keyframes.push(...indexedKeyframes.map(item => item.keyframe));
        }
    }
    class Tanim {
        constructor(name, length, fps, timelines) {
            this.name = name;
            this.length = length;
            this.fps = fps;
            this.timelines = timelines;
        }
        static FromObject(obj) {
            try {
                let { name, length, fps, timelines } = obj;
                if (typeof name != "string" ||
                    typeof length != "number" ||
                    typeof fps != "number" ||
                    !Array.isArray(timelines)) {
                    throw new Error();
                }
                ;
                let parsedTimelines = timelines.map(tl => {
                    let parsedTimeline = Timeline.FromObject(tl);
                    if (parsedTimeline === null) {
                        throw new Error();
                    }
                    else {
                        return parsedTimeline;
                    }
                });
                return new Tanim(name, length, fps, parsedTimelines);
            }
            catch (error) {
                Warn("尝试构造 Tanim 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
        rename(name, renameTanimConfig = true) {
            if (renameTanimConfig && TheTanimEditorConfigs.tanimConfigs[this.name]) {
                TheTanimEditorConfigs.tanimConfigs[name] = TheTanimEditorConfigs.tanimConfigs[this.name];
                delete TheTanimEditorConfigs.tanimConfigs[this.name];
            }
            this.name = name;
            saveData();
        }
        getTimelineByTValueType(tValueType) {
            let result = this.timelines.find(timeline => timeline.tValueType === tValueType);
            return result ?? null;
        }
        getTime(time, timeUnit, loopMode) {
            if (timeUnit === "second") {
                time *= this.fps;
            }
            switch (loopMode) {
                case "once":
                    time = clamp(time, 0, this.length);
                    break;
                case "loop-yoyo":
                    time = positiveMod(time, this.length * 2);
                    if (time > this.length)
                        time = this.length * 2 - time;
                    break;
                case "once-yoyo":
                    time = clamp(time, 0, this.length * 2);
                    if (time > this.length)
                        time = this.length * 2 - time;
                    break;
                default:
                case "loop":
                    time = positiveMod(time, this.length);
                    break;
            }
            return time;
        }
        getTValue(tValueType, time, timeUnit, loopMode) {
            if (tValueType == "sqx" || tValueType == "sqy") {
                let sq = safeTValue(this.getTValue("sq", time, timeUnit, loopMode), "sq");
                if (typeof sq == "string") {
                    return 1;
                }
                if (tValueType == "sqx") {
                    return sqToSqx(sq);
                }
                else {
                    return sqToSqy(sq);
                }
            }
            let timeline = this.getTimelineByTValueType(tValueType);
            if (!timeline)
                return null;
            time = this.getTime(time, timeUnit, loopMode);
            return timeline.getTValueByFrame(time);
        }
        getSnapshot(time, timeUnit, loopMode) {
            let snapshot = {};
            time = this.getTime(time, timeUnit, loopMode);
            for (let timeline of this.timelines) {
                let tValue = timeline.getTValueByFrame(time);
                snapshot[timeline.tValueType] = tValue;
                if (timeline.tValueType == "sq") {
                    if (typeof tValue == "string") {
                        snapshot["sqx"] = 1;
                        snapshot["sqy"] = 1;
                    }
                    else {
                        snapshot["sqx"] = sqToSqx(tValue);
                        snapshot["sqy"] = sqToSqy(tValue);
                    }
                }
            }
            return snapshot;
        }
        getSafeTValueType(tValueType) {
            let tValueTypes = this.timelines.map(timeline => timeline.tValueType).concat(DefaultTValueNames);
            while (tValueTypes.includes(tValueType) || DefaultTValues[tValueType] !== undefined) {
                tValueType = incrementSuffix(tValueType);
            }
            return tValueType;
        }
    }
    class TanimManager {
        constructor(tanims) {
            this.tanims = tanims;
            this.context = {};
            this.snapshots = [];
            this.tValueTypes = [
                "px",
                "py",
                "s",
                "sx",
                "sy",
                "sq",
                "sqx",
                "sqy",
                "d",
                "cos",
            ];
            for (let tanim of tanims) {
                for (let timeline of tanim.timelines) {
                    if (!this.tValueTypes.includes(timeline.tValueType)) {
                        this.tValueTypes.push(timeline.tValueType);
                    }
                }
            }
        }
        static FromObject(obj) {
            try {
                let { tanims } = obj;
                if (!Array.isArray(tanims)) {
                    throw new Error();
                }
                ;
                let parsedTanims = tanims.map(ta => {
                    let parsedTanim = Tanim.FromObject(ta);
                    if (parsedTanim === null) {
                        throw new Error();
                    }
                    else {
                        return parsedTanim;
                    }
                });
                return new TanimManager(parsedTanims);
            }
            catch (error) {
                Warn("尝试构造 TanimManager 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
        getTanimByName(name) {
            let result = this.tanims.find(tanim => tanim.name === name);
            return result ?? null;
        }
        getTanimsByPrefix(prefix) {
            let result = this.tanims.filter(tanim => tanim.name.startsWith(prefix));
            return result;
        }
        getContextValue(tValueType) {
            return getSnapshotValue(this.context, tValueType);
        }
        getSnapshotByIndex(index) {
            return this.snapshots[index] ?? null;
        }
        transitSnapshot(snapshotA, snapshotB, t) {
            let lerp = InterpolationFunctions.Lerp;
            let result = {};
            for (let tValueType in new Set([...Object.keys(snapshotA), ...Object.keys(snapshotB)])) {
                if (tValueType == "sqx" || tValueType == "sqy") {
                    let sqa = getSnapshotValue(snapshotA, "sq");
                    let sqb = getSnapshotValue(snapshotB, "sq");
                    if (typeof sqa == "string" || typeof sqb == "string") {
                        continue;
                    }
                    let sq = lerp(sqa, sqb, t);
                    if (tValueType == "sqx") {
                        result[tValueType] = sqToSqx(sq);
                    }
                    else {
                        result[tValueType] = sqToSqy(sq);
                    }
                }
                else {
                    let va = getSnapshotValue(snapshotA, tValueType);
                    let vb = getSnapshotValue(snapshotB, tValueType);
                    if (typeof va == "string" || typeof vb == "string") {
                        result[tValueType] = t <= 0.5 ? va : vb;
                    }
                    else {
                        result[tValueType] = lerp(va, vb, t);
                    }
                }
            }
            return result;
        }
        allocateSnapshotIndex(snapshot) {
            let index = this.snapshots.indexOf(null);
            if (index == -1) {
                index = this.snapshots.length;
            }
            this.snapshots[index] = snapshot;
            return index;
        }
        recycleSnapshotIndex(index) {
            if (this.snapshots[index])
                this.snapshots[index] = null;
        }
        recycleAllSnapshot() {
            this.snapshots.length = 0;
        }
        getSafeTanimName(name) {
            let names = this.tanims.map(tanim => tanim?.name);
            while (names.includes(name)) {
                name = incrementSuffix(name);
            }
            let dir = name.split("//");
            if (dir.pop() == "") {
                dir.push(getTranslate("CQET_eDefaultTanimName"));
                return this.getSafeTanimName(dir.join("//"));
            }
            return name;
        }
        getCopiedTanim(tanim) {
            let result = Tanim.FromObject(JSON.parse(JSON.stringify(tanim)));
            if (!result)
                return null;
            result.rename(this.getSafeTanimName(result.name), false);
            let oldTanimConfig = TheTanimEditorConfigs.tanimConfigs[tanim.name];
            if (oldTanimConfig) {
                let newTanimConfig = TanimConfig.FromObject(JSON.parse(JSON.stringify(oldTanimConfig)));
                if (newTanimConfig) {
                    TheTanimEditorConfigs.tanimConfigs[result.name] = newTanimConfig;
                }
            }
            return result;
        }
    }
    let TheTanimManager = new TanimManager([]);
    class TanimConfig {
        constructor(spriteName, costumeNames, marks) {
            this.spriteName = spriteName;
            this.costumeNames = [...costumeNames];
            this.marks = { ...marks };
        }
        static FromObject(obj) {
            try {
                let { spriteName, costumeNames, marks } = obj;
                if (typeof spriteName != "string" ||
                    !Array.isArray(costumeNames) ||
                    costumeNames.length != 3 ||
                    costumeNames.some(value => typeof value != "string") ||
                    typeof marks != "object" ||
                    marks === null) {
                    throw new Error();
                }
                ;
                let parsedMarks = {};
                for (let index in marks) {
                    let time = parseInt(index);
                    if (!Number.isNaN(time)) {
                        parsedMarks[time] = marks[index];
                    }
                }
                return new TanimConfig(spriteName, costumeNames, parsedMarks);
            }
            catch (error) {
                Warn("尝试构造 TanimEditorConfigs 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
    }
    class TanimEditorConfigs {
        constructor(options) {
            this.left = options?.left ?? 90;
            this.top = options?.top ?? 100;
            this.width = options?.width ?? 800;
            this.height = options?.height ?? 600;
            this.leftBarWidth = options?.leftBarWidth ?? 75;
            this.timelineBarHeight = options?.timelineBarHeight ?? 200;
            this.rightBarWidth = options?.rightBarWidth ?? 200;
            this.layerBarHeight = options?.layerBarHeight ?? 100;
            this.tanimConfigs = options?.tanimConfigs ?? {};
        }
        static FromObject(obj) {
            try {
                let { left, top, width, height, leftBarWidth, timelineBarHeight, rightBarWidth, layerBarHeight, tanimConfigs } = obj;
                if (typeof left != "number" ||
                    typeof top != "number" ||
                    typeof width != "number" ||
                    typeof height != "number" ||
                    typeof leftBarWidth != "number" ||
                    typeof timelineBarHeight != "number" ||
                    typeof rightBarWidth != "number" ||
                    typeof layerBarHeight != "number" ||
                    typeof tanimConfigs != "object" ||
                    tanimConfigs === null) {
                    throw new Error();
                }
                ;
                let parsedTanimConfigs = {};
                for (let index in tanimConfigs) {
                    let parsedTanimConfig = TanimConfig.FromObject(tanimConfigs[index]);
                    if (parsedTanimConfig === null) {
                        throw new Error();
                    }
                    else {
                        parsedTanimConfigs[index] = parsedTanimConfig;
                    }
                }
                return new TanimEditorConfigs({ left, top, width, height, leftBarWidth, timelineBarHeight, rightBarWidth, layerBarHeight, tanimConfigs: parsedTanimConfigs });
            }
            catch (error) {
                Warn("尝试构造 TanimEditorConfigs 对象时，捕获到错误。", obj, error);
                return null;
            }
        }
    }
    let TheTanimEditorConfigs = new TanimEditorConfigs();
    function incrementSuffix(base, defaultSuffix = " ") {
        const match = base.match(/(.*\D?)(\d+)$/);
        if (!match) {
            return base == "" ? "1" : base + defaultSuffix + "2";
        }
        const [_, prefix, numStr] = match;
        const incrementedNum = (parseInt(numStr, 10) + 1).toString();
        return prefix + incrementedNum;
    }
    function lcg(x) {
        return (1103515245 * x + 12345) % 2 ** 31;
    }
    function stringToHSL(str, saturation, lightness, alpha = 100) {
        let hue;
        if (Cast.compare(str, "true") == 0) {
            hue = 120;
        }
        else if (Cast.compare(str, "false") == 0) {
            hue = 0;
        }
        else {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
                hash |= 0;
            }
            hue = lcg(hash) % 360;
        }
        return alpha == 100 ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha}%)`;
    }
    function tValueTypeToHSL(tValueType, saturation, lightness, alpha = 100) {
        let hue;
        switch (tValueType) {
            case `${"px"}|${"py"}`:
            case "px":
                hue = 210;
                break;
            case "py":
                hue = 260;
                break;
            case "s":
                hue = 310;
                break;
            case `${"sx"}|${"sy"}`:
            case "sx":
                hue = 0;
                break;
            case "sy":
                hue = 35;
                break;
            case "sq":
                hue = 65;
                lightness -= 10;
                break;
            case "d":
                hue = 105;
                lightness -= 5;
                break;
            case "cos":
                hue = 160;
                break;
            case "__CreateNewTimeline__":
                hue = 190;
                break;
            default:
                let hash = 0;
                for (let i = 0; i < tValueType.length; i++) {
                    hash = tValueType.charCodeAt(i) + ((hash << 5) - hash);
                    hash |= 0;
                }
                hue = lcg(hash) % 360;
                break;
        }
        return alpha == 100 ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha}%)`;
    }
    let TheSavedataVarName = "__Easy_Tanim_Savedate__";
    function findVarNameComment() {
        let comments = runtime.targets[0].comments;
        for (let id in comments) {
            let txt = comments[id].text;
            if (typeof txt != "string")
                continue;
            let headIdx = txt.indexOf("!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_HEAD_DONT_EDIT_THIS!!!");
            if (headIdx >= 0) {
                return comments[id];
            }
        }
        return null;
    }
    function findSavedataVariable() {
        let variables = runtime.targets[0].variables;
        for (let id in variables) {
            let variable = variables[id];
            if (variable.name == TheSavedataVarName)
                return variable;
        }
        return null;
    }
    function getJSONSrcFromVariables() {
        let value = findSavedataVariable()?.value;
        return typeof value == "string" ? value : null;
    }
    function getSavedataFromJSONSrc(JSONSrc) {
        try {
            if (JSONSrc) {
                return {
                    obj: JSON.parse(JSONSrc),
                    src: JSONSrc,
                };
            }
            else {
                Warn("无法读取动画存储数据，已初始化动画数据。");
                return {
                    obj: {
                        tanimManager: { tanims: [] },
                    },
                    src: null,
                };
            }
        }
        catch (error) {
            Warn("尝试解析JSON存储数据时，捕获到错误。", error);
            return {
                obj: null,
                src: JSONSrc
            };
        }
    }
    function getJSONSrcFromSavedata(tanimManager, tanimEditorConfigs) {
        let JSONSrc = JSON.stringify({
            tanimManager: {
                tanims: tanimManager.tanims,
            },
            tanimEditorConfigs,
        });
        return JSONSrc;
    }
    function saveJSONSrcToVariable(JSONSrc, emitProjectChanged = true) {
        let variable = findSavedataVariable();
        if (!variable) {
            variable = runtime.createNewGlobalVariable(TheSavedataVarName);
        }
        variable.value = JSONSrc;
        if (emitProjectChanged)
            runtime.emit("PROJECT_CHANGED");
    }
    function changeSavedateVarName(varName) {
        let varNameComment = findVarNameComment();
        if (varNameComment == null) {
            runtime.targets[0].createComment(getSafeCommentID("EasyTanim_SaveDataVarName"), null, `${"!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_HEAD_DONT_EDIT_THIS!!!"}${TheSavedataVarName}${"!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_TAIL_DONT_EDIT_THIS!!!"}`, 500, 0, 200, 200, false);
            varNameComment = findVarNameComment();
        }
        TheSavedataVarName = varName;
        varNameComment.text = `此处是“时间轴动画”扩展的存储数据。可以移动、缩放或折叠此注释，但不要手动修改此注释的内容，除非你知道你在做什么。
Stored data for the Easy Tanim extension. You can move, resize, and minimize this comment, but don't edit it by hand unless you know what you are doing.
${"!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_HEAD_DONT_EDIT_THIS!!!"}${TheSavedataVarName}${"!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_TAIL_DONT_EDIT_THIS!!!"}`;
        runtime.emit("PROJECT_CHANGED");
    }
    function saveData(emitProjectChanged = true) {
        saveJSONSrcToVariable(getJSONSrcFromSavedata(TheTanimManager, TheTanimEditorConfigs), emitProjectChanged);
    }
    function autoLoadData(isAlertError) {
        let varNameComment = findVarNameComment();
        if (varNameComment !== null) {
            let txt = varNameComment.text;
            let headIdx = txt.indexOf("!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_HEAD_DONT_EDIT_THIS!!!");
            if (headIdx >= 0) {
                let tailIdx = txt.indexOf("!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_TAIL_DONT_EDIT_THIS!!!");
                if (tailIdx == -1) {
                    tailIdx = txt.length;
                }
                ;
                TheSavedataVarName = txt.substring(headIdx + "!!!CQ_EASY_TANIM_SAVE_DATA_VAR_NAME_HEAD_DONT_EDIT_THIS!!!".length, tailIdx);
            }
        }
        let JSONSrc = getJSONSrcFromVariables();
        let { obj } = getSavedataFromJSONSrc(JSONSrc);
        let parsedTanimEditorConfigs = TanimEditorConfigs.FromObject(obj?.tanimEditorConfigs);
        if (parsedTanimEditorConfigs)
            TheTanimEditorConfigs = parsedTanimEditorConfigs;
        let parsedTanimManager = TanimManager.FromObject(obj?.tanimManager);
        if (parsedTanimManager == null) {
            if (!isAlertError)
                return;
            console.log(`时间轴动画：读取动画存储数据失败，已重置动画数据。此条日志的下方备份了旧的动画数据，请妥善保管，并寻求他人的帮助。

Easy Tanim: Fail to load stored data. Data has been reset. A backup of the old data has been preserved below this log. Please keep it safe and contact others for help.

${JSONSrc}`);
            window.alert(`⚠️⚠️⚠️时间轴动画 错误⚠️⚠️⚠️
⚠️⚠️⚠️EASY TANIM ERROR⚠️⚠️⚠️

无法读取存储数据，已重置动画数据。请按 Ctrl + Shift + i 打开浏览器开发者工具以获取更多信息。

Failed to load stored data from comment. Data has been reset. Press Ctrl + Shift + i to check the browser's developer tools for more information.`);
            return;
        }
        TheTanimManager = parsedTanimManager;
    }
    runtime.on("PROJECT_LOADED", () => autoLoadData(true));
    class CUI {
        constructor(type, align, pos, size) {
            this.type = type;
            this.align = align;
            this.pos = pos;
            this.size = typeof size == "number" ? { w: size, h: size } : size ?? { w: 0, h: 0 };
        }
    }
    class KUI {
        constructor(type, x, y, size = null, options) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.size = typeof size == "number" ? { w: size, h: 20 } : size ?? { w: 0, h: 20 };
            this.interType = options.interType;
            this.paramType = options.paramType;
            this.paramValue = options.paramValue;
            this.text = options.text;
        }
    }
    const KUIInterTypeTable = [
        ["const", "linear", "bezier"],
        ["power", "exp", "sine", "circular"],
        ["elastic", "back", "bounce", "tradExp", "lagrange"],
    ];
    class PUI {
        constructor(type, x, y, { w, h }, text) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.size = { w, h };
            if (text)
                this.text = text;
        }
    }
    const DefaultTValueNames = [
        `${"px"}|${"py"}`,
        "s",
        `${"sx"}|${"sy"}`,
        "sq",
        "d",
        "cos",
    ];
    class EditCommand {
        constructor() {
            this.isNeedSaveData = true;
            this.isDone = false;
        }
        redo() {
            return this.do();
        }
        doCommand() {
            if (this.isDone)
                return;
            this.do();
            this.isDone = true;
            if (this.isNeedSaveData)
                saveData();
            return;
        }
        undoCommand() {
            if (!this.isDone)
                return;
            this.undo();
            this.isDone = false;
            if (this.isNeedSaveData)
                saveData();
            return;
        }
        redoCommand() {
            if (this.isDone)
                return;
            this.redo();
            this.isDone = true;
            if (this.isNeedSaveData)
                saveData();
            return;
        }
    }
    class AddTimelineCommand extends EditCommand {
        constructor(editor, tanim, timeline) {
            super();
            this.editor = editor;
            this.tanim = tanim;
            this.timeline = timeline;
        }
        do() {
            if (this.tanim.getTimelineByTValueType(this.timeline.tValueType)) {
                Warn("执行命令：试图向 Tanim 中加入新 Timeline 时，Tanim 中已有的同名的 Timeline，操作未执行。", this);
                return;
            }
            this.tanim.timelines.push(this.timeline);
            let tValueType = this.timeline.tValueType;
            if (DefaultTValues[tValueType] === undefined && !DefaultTValueNames.includes(tValueType)) {
                this.editor.tValueNames.push(tValueType);
            }
        }
        undo() {
            if (!this.tanim.timelines.includes(this.timeline)) {
                Warn("撤销命令：试图从 Tanim 中移除 Timeline 时，Tanim 中不包含该 Timeline，撤销未执行。", this);
                return;
            }
            let idx = this.tanim.timelines.indexOf(this.timeline);
            this.tanim.timelines.splice(idx, 1);
            let tValueType = this.timeline.tValueType;
            if (DefaultTValues[tValueType] === undefined && !DefaultTValueNames.includes(tValueType)) {
                let idx = this.editor.tValueNames.indexOf(tValueType);
                if (idx != -1)
                    this.editor.tValueNames.splice(idx, 1);
            }
        }
    }
    class RenameTimelineCommand extends EditCommand {
        constructor(editor, tanim, timeline, newTValueType) {
            super();
            this.editor = editor;
            this.tanim = tanim;
            this.timeline = timeline;
            this.oldTValueType = timeline.tValueType;
            this.newTValueType = newTValueType;
        }
        do() {
            if (this.newTValueType !== this.timeline.tValueType)
                this.timeline.rename(this.tanim.getSafeTValueType(this.newTValueType));
        }
        undo() {
            if (this.oldTValueType !== this.timeline.tValueType)
                this.timeline.rename(this.tanim.getSafeTValueType(this.oldTValueType));
        }
    }
    class RemoveTimelineCommand extends EditCommand {
        constructor(editor, tanim, timeline) {
            super();
            this.editor = editor;
            this.tanim = tanim;
            this.timeline = timeline;
        }
        do() {
            let idx = this.tanim.timelines.indexOf(this.timeline);
            if (idx == -1) {
                Warn("执行命令：试图从 Tanim 中移除 Timeline 时，Tanim 中不包含该 Timeline，操作未执行。", this);
                return;
            }
            this.tanim.timelines.splice(idx, 1);
            let tValueType = this.timeline.tValueType;
            if (DefaultTValues[tValueType] === undefined && !DefaultTValueNames.includes(tValueType)) {
                let idx = this.editor.tValueNames.indexOf(tValueType);
                if (idx != -1)
                    this.editor.tValueNames.splice(idx, 1);
            }
        }
        undo() {
            if (this.tanim.getTimelineByTValueType(this.timeline.tValueType)) {
                Warn("撤销命令：试图向 Tanim 中重新加入之前被移除的 Timeline 时，Tanim 中已有的同名的 Timeline，撤销未执行。", this);
                return;
            }
            this.tanim.timelines.push(this.timeline);
            let tValueType = this.timeline.tValueType;
            if (DefaultTValues[tValueType] === undefined && !DefaultTValueNames.includes(tValueType)) {
                this.editor.tValueNames.push(tValueType);
            }
        }
    }
    class TKPair {
        constructor(timeline, ...keyframes) {
            this.timeline = timeline;
            this.keyframes = new Set(keyframes);
        }
    }
    function toTKPairs(timelines, ...keyframes) {
        let pairs = [];
        timelines.forEach(timeline => timeline && pairs.push(new TKPair(timeline)));
        for (let keyframe of keyframes) {
            let pair = pairs.find(pair => pair.timeline.keyframes.includes(keyframe));
            if (pair) {
                pair.keyframes.add(keyframe);
            }
        }
        return pairs.filter(pair => pair.keyframes.size > 0);
    }
    class AddKeyframesCommand extends EditCommand {
        constructor(editor, tanim, ...pairs) {
            super();
            this.editor = editor;
            this.pairs = pairs;
            for (let { timeline } of pairs) {
                if (!tanim.getTimelineByTValueType(timeline.tValueType))
                    tanim.timelines.push(timeline);
            }
        }
        do() {
            for (let { timeline, keyframes } of this.pairs) {
                timeline.keyframes.push(...keyframes);
                timeline.sortKeyframes();
            }
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
        undo() {
            for (let { timeline, keyframes } of this.pairs) {
                for (let keyframe of keyframes) {
                    let idx = timeline.keyframes.indexOf(keyframe);
                    if (idx == -1) {
                        Warn("撤销命令：试图从 Timeline 中移除 Keyframe 时，Timeline 中不包含该 Keyframe，未移除该 Keyframe。", this, timeline, keyframe);
                        return;
                    }
                    timeline.keyframes.splice(idx, 1);
                    this.editor.selectedKeyframes.delete(keyframe);
                }
                timeline.sortKeyframes();
            }
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
    }
    class RemoveKeyframesCommand extends EditCommand {
        constructor(editor, ...pairs) {
            super();
            this.editor = editor;
            this.pairs = pairs;
        }
        do() {
            for (let { timeline, keyframes } of this.pairs) {
                for (let keyframe of keyframes) {
                    let idx = timeline.keyframes.indexOf(keyframe);
                    if (idx == -1) {
                        Warn("执行命令：试图从 Timeline 中移除 Keyframe 时，Timeline 中不包含该 Keyframe，未移除该 Keyframe。", this, keyframe);
                        continue;
                    }
                    timeline.keyframes.splice(idx, 1);
                    this.editor.selectedKeyframes.delete(keyframe);
                }
                timeline.sortKeyframes();
            }
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
        undo() {
            for (let { timeline, keyframes } of this.pairs) {
                timeline.keyframes.push(...keyframes);
                timeline.sortKeyframes();
            }
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
    }
    class MoveKeyframesCommand extends EditCommand {
        constructor(editor, x, y, ...pairs) {
            super();
            this.editor = editor;
            this.x = x;
            this.y = y;
            this.pairs = pairs;
        }
        move(x, y) {
            for (let { timeline, keyframes } of this.pairs) {
                for (let keyframe of keyframes) {
                    keyframe.x += x;
                    if (typeof keyframe.y == "number")
                        keyframe.y += y;
                }
                timeline.sortKeyframes();
            }
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
        do() {
            this.move(this.x, this.y);
        }
        undo() {
            this.move(-this.x, -this.y);
        }
        updateMotion(x, y) {
            x = round(x);
            if (this.isDone)
                this.move(x - this.x, y - this.y);
            this.x = x;
            this.y = y;
        }
    }
    class EditAKeyframeCommand extends EditCommand {
        constructor(editor, timeline, keyframe, newKeyframeCopy) {
            super();
            this.editor = editor;
            this.timeline = timeline;
            this.keyframe = keyframe;
            this.oldKeyframeCopy = keyframe.getCopy();
            this.newKeyframeCopy = newKeyframeCopy;
        }
        editKeyframe(target) {
            this.keyframe.interType = target.interType;
            if (this.keyframe.x != target.x) {
                this.keyframe.x = target.x;
                this.timeline.sortKeyframes();
            }
            this.keyframe.y = target.y;
            this.keyframe.params = { ...target.params };
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
        do() {
            this.editKeyframe(this.newKeyframeCopy);
        }
        undo() {
            if (!this.oldKeyframeCopy) {
                Warn("撤销命令：修改 Keyframe 时，未能深拷贝原 Keyframe ，撤销未执行。", this);
            }
            this.editKeyframe(this.oldKeyframeCopy);
        }
        update(newKeyframeCopy) {
            if (this.isDone)
                this.editKeyframe(newKeyframeCopy);
            this.newKeyframeCopy = newKeyframeCopy;
        }
    }
    class SelectKeyframesCommand extends EditCommand {
        constructor(editor, ...keyframes) {
            super();
            this.isNeedSaveData = false;
            this.editor = editor;
            this.oldKeyframesCopy = new Set(editor.selectedKeyframes);
            this.newKeyframesCopy = new Set(keyframes);
        }
        do() {
            this.editor.selectedKeyframes.clear();
            this.newKeyframesCopy.forEach(keyframe => this.editor.selectedKeyframes.add(keyframe));
            this.editor.kuiState = 0;
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
        undo() {
            this.editor.selectedKeyframes.clear();
            this.oldKeyframesCopy.forEach(keyframe => this.editor.selectedKeyframes.add(keyframe));
            this.editor.kuiState = 0;
            this.editor.updateCuis();
            this.editor.updateKuis();
        }
    }
    class EditCommandStack {
        get isCanUndo() {
            return this.commands.length > this.undoLength;
        }
        get isCanRedo() {
            return this.commands.length > 0 && this.undoLength > 0;
        }
        get top() {
            return this.commands[this.commands.length - 1 - this.undoLength];
        }
        constructor() {
            this.commands = [];
            this.undoLength = 0;
        }
        PushAndDo(...commands) {
            for (let command of commands) {
                this.push(command);
                command.doCommand();
            }
        }
        push(...commands) {
            this.commands.splice(this.commands.length - this.undoLength, this.undoLength, ...commands);
            this.undoLength = 0;
        }
        undo() {
            if (!this.isCanUndo)
                return;
            this.top?.undo();
            this.undoLength += 1;
        }
        redo() {
            if (!this.isCanRedo)
                return;
            this.undoLength -= 1;
            this.top?.redo();
        }
    }
    const TheDefaultCostumeURI = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Ni45NzM1NCIgaGVpZ2h0PSIyMy45NjQ0MSIgdmlld0JveD0iMCwwLDY2Ljk3MzU0LDIzLjk2NDQxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzA4LjAxNzgsLTE2OC4wMTc4KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjcuNSI+PHBhdGggZD0iTTM3MS4yNDEzNSwxODAuMDAwMDFsLTguMjMyMiwtOC4yMzIyIi8+PHBhdGggZD0iTTMyMC4wMDAwMSwxODAuMDAwMDFoNTEuMjQxMzMiLz48cGF0aCBkPSJNMzExLjc2NzgxLDE3MS43Njc4MWwxNi40NjQ0MSwxNi40NjQ0MSIvPjxwYXRoIGQ9Ik0zMTEuNzY3ODEsMTg4LjIzMjIybDE2LjQ2NDQxLC0xNi40NjQ0MSIvPjwvZz48ZyBzdHJva2Utd2lkdGg9IjIuNSI+PHBhdGggZD0iTTM3MS4yNDEzNSwxODAuMDAwMDFsLTguMjMyMjEsLTguMjMyMjEiIHN0cm9rZT0iIzNkZjIzZCIvPjxwYXRoIGQ9Ik0zNzEuMjQxMzUsMTgwLjAwMDAxIiBzdHJva2U9IiM0ZGZmNGQiLz48cGF0aCBkPSJNMzIwLjAwMDAxLDE4MC4wMDAwMWg1MS4yNDEzMyIgc3Ryb2tlPSIjNGQ0ZGZmIi8+PHBhdGggZD0iTTMxMS43Njc4MSwxNzEuNzY3ODFsMTYuNDY0NDEsMTYuNDY0NDEiIHN0cm9rZT0iI2ZmNGQ0ZCIvPjxwYXRoIGQ9Ik0zMTEuNzY3ODEsMTg4LjIzMjIybDE2LjQ2NDQxLC0xNi40NjQ0MSIgc3Ryb2tlPSIjZmY0ZDRkIi8+PC9nPjwvZz48L2c+PC9zdmc+`;
    const TheDefaultCostumeData = {
        rotationCenterX: 11.98219499999999,
        rotationCenterY: 11.98219499999999,
        size: [66.97354125976562, 23.96441078186035],
        bitmapResolution: 1,
        uri: TheDefaultCostumeURI,
        loadState: 1,
        img: new Image(),
    };
    TheDefaultCostumeData.img.src = TheDefaultCostumeURI;
    TheDefaultCostumeData.img.addEventListener("load", () => TheDefaultCostumeData.loadState = 2);
    class CostumeManager {
        constructor() {
            this.cache = {};
            this.update();
            runtime.on("PROJECT_LOADED", () => this.update());
            runtime.on("PROJECT_CHANGED", () => this.update());
        }
        update() {
            let newCache = {};
            let sprites = new Set();
            for (let target of runtime.targets) {
                sprites.add(target.sprite);
            }
            for (let sprite of sprites) {
                let spriteName = sprite.name;
                let costumes = sprite.costumes;
                let spriteCache = {};
                for (let costume of costumes) {
                    let costumeName = costume.name;
                    if (typeof costume.name == "string") {
                        let uri = costume.asset.encodeDataURI();
                        if (uri == this.cache?.[spriteName]?.[costumeName]?.uri) {
                            spriteCache[costumeName] = this.cache[spriteName][costumeName];
                        }
                        else {
                            let img = new Image();
                            img.src = uri;
                            let data = {
                                rotationCenterX: costume.rotationCenterX,
                                rotationCenterY: costume.rotationCenterY,
                                size: costume.size,
                                bitmapResolution: costume.bitmapResolution,
                                uri,
                                loadState: 0,
                                img,
                            };
                            spriteCache[costumeName] = data;
                        }
                    }
                }
                newCache[spriteName] = spriteCache;
            }
            this.cache = newCache;
        }
        getCostumeData(spriteName, costumeName) {
            let editingTarget, editingSpriteName;
            let spriteData = this.cache[spriteName];
            if (spriteData === undefined) {
                editingTarget = runtime.getEditingTarget();
                editingSpriteName = editingTarget?.sprite.name;
                if (editingSpriteName)
                    spriteData = this.cache[editingSpriteName];
                if (spriteData === undefined)
                    return TheDefaultCostumeData;
            }
            let costumeData = spriteData[costumeName];
            if (costumeData === undefined) {
                let target = editingTarget ?? runtime.getSpriteTargetByName(spriteName);
                let currentCostumeName = target?.getCurrentCostume().name;
                if (currentCostumeName)
                    costumeData = spriteData[currentCostumeName];
                if (costumeData === undefined)
                    return TheDefaultCostumeData;
            }
            if (costumeData?.loadState === 0) {
                costumeData.img.src = costumeData.uri;
                costumeData.loadState = 1;
                costumeData.img.addEventListener("load", () => costumeData.loadState = 2);
            }
            return costumeData;
        }
    }
    class TanimEditor {
        get playTimeSec() {
            return (Date.now() - this.playTimestamp) / 1000;
        }
        get subAxis() {
            return 1 - this.mainAxis;
        }
        ;
        get configs() {
            return TheTanimEditorConfigs;
        }
        ;
        getSpriteName(tanim) {
            if (tanim) {
                let tanimConfig = this.configs.tanimConfigs[tanim.name];
                return tanimConfig?.spriteName ?? "";
            }
            else {
                return "";
            }
        }
        setSpriteName(tanim, name) {
            if (tanim) {
                let tanimConfig = this.configs.tanimConfigs[tanim.name];
                if (tanimConfig) {
                    tanimConfig.spriteName = name;
                }
            }
        }
        getCostumeNames(tanim) {
            if (tanim) {
                let tanimConfig = this.configs.tanimConfigs[tanim.name];
                return tanimConfig?.costumeNames ?? ["", "", ""];
            }
            else {
                return ["", "", ""];
            }
        }
        getMarks(tanim) {
            if (tanim) {
                let tanimConfig = this.configs.tanimConfigs[tanim.name];
                return tanimConfig?.marks ?? {};
            }
            else {
                return {};
            }
        }
        get marks() {
            return this.getMarks(this.tanim);
        }
        get previewCameraS() {
            return 2 ** this.previewCameraSPow;
        }
        ;
        get loopMode() {
            if (this.isLoop) {
                if (this.isYoyo) {
                    return "loop-yoyo";
                }
                else {
                    return "loop";
                }
            }
            else {
                if (this.isYoyo) {
                    return "once-yoyo";
                }
                else {
                    return "once";
                }
            }
        }
        get width() {
            return this.configs.width;
        }
        ;
        set width(value) {
            this.configs.width = value;
        }
        ;
        get height() {
            return this.configs.height;
        }
        ;
        set height(value) {
            this.configs.height = value;
        }
        ;
        get top() {
            return this.configs.top;
        }
        ;
        set top(value) {
            this.configs.top = value;
        }
        ;
        get left() {
            return this.configs.left;
        }
        ;
        set left(value) {
            this.configs.left = value;
        }
        ;
        get leftBarWidth() {
            return this.configs.leftBarWidth;
        }
        ;
        set leftBarWidth(value) {
            this.configs.leftBarWidth = value;
        }
        ;
        get timelineBarHeight() {
            return this.configs.timelineBarHeight;
        }
        ;
        set timelineBarHeight(value) {
            this.configs.timelineBarHeight = value;
        }
        ;
        get rightBarWidth() {
            return this.configs.rightBarWidth;
        }
        ;
        set rightBarWidth(value) {
            this.configs.rightBarWidth = value;
        }
        ;
        get layerBarHeight() {
            return this.configs.layerBarHeight;
        }
        ;
        set layerBarHeight(value) {
            this.configs.layerBarHeight = value;
        }
        ;
        get timelineScaleX() {
            return 3 * 1.25 ** this.timelineScalePowX;
        }
        get timelineScaleY() {
            return 1.25 ** this.timelineScalePowY;
        }
        ;
        constructor() {
            this.focusTime = 0;
            this.playTimestamp = 0;
            this.isPlaying = false;
            this.tanim = null;
            this.timelines = [null, null];
            this.tValueNames = [...DefaultTValueNames];
            this.tValueName = this.tValueNames[0];
            this.mainAxis = 0;
            this.isShowHandle = true;
            this.costumeManager = new CostumeManager();
            this.previewCameraX = 0;
            this.previewCameraY = 0;
            this.previewCameraSPow = 0;
            this.isLoop = true;
            this.isYoyo = false;
            this.isShow = false;
            this.isMinimized = false;
            this.isInputing = false;
            this.canvasWidth = this.width;
            this.canvasHeight = this.height;
            this.tanimListScroll = 0;
            this.layerListScroll = 0;
            this.timelineScrollX = -10;
            this.timelineScrollY = -50;
            this.timelineScalePowX = 6;
            this.timelineScalePowY = 0;
            this.mouseClientX = -1;
            this.mouseClientY = -1;
            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseTimelineX = 0;
            this.mouseTimelineY = 0;
            this.mouseStageX = 0;
            this.mouseStageY = 0;
            this.mouseDragType = 0;
            this.mouseDragX = 0;
            this.mouseDragY = 0;
            this.mouseDragClientX = 0;
            this.mouseDragClientY = 0;
            this.mouseDragTop = 0;
            this.mouseDragLeft = 0;
            this.mouseDragWidth = 0;
            this.mouseDragHeight = 0;
            this.mouseDragIndex = -1;
            this.hoveredHandle = null;
            this.mouseDragHandle = null;
            this.cursor = "default";
            this.title = getTranslate("CQET_eDefaultTitle");
            this.hint = [getTranslate("CQET_eDefaultHint"), ""];
            this.tanimTree = [];
            this.tanimFolders = {};
            this.layerTree = [];
            this.layerFolders = {};
            this.cuis = [];
            this.kuis = [];
            this.kuiState = 0;
            this.puis = [];
            this.hover = [];
            this.hoveredKeyframes = new Set();
            this.selectedKeyframes = new Set();
            this.TUIScroll = 0;
            this.layers = [];
            this.foldedTanimFolders = new Set();
            this.foldedLayerFolders = new Set();
            this.recycleBin = [];
            this.commandStack = new EditCommandStack();
            this.root = document.createElement("div");
            let s = this.root.style;
            s.display = "none";
            s.position = "absolute";
            s.top = "0";
            s.left = "0";
            this.setPosition();
            s.zIndex = "200";
            s.padding = "4px";
            this.isMouseOnRoot = false;
            this.canvas = document.createElement("canvas");
            this.stageCanvas = document.createElement("canvas");
            this.setCanvasSize();
            s = this.canvas.style;
            s.backgroundColor = " #ffffff";
            s.borderRadius = "8px";
            s.border = "1px solid #666666";
            s.boxShadow = "0px 0px 6px 2px rgba(0, 0, 0, 0.3)";
            s.overflow = "hidden";
            this.root.appendChild(this.canvas);
            this.ctx = this.canvas.getContext("2d");
            this.stageCtx = this.stageCanvas.getContext("2d");
            if (!this.ctx || !this.stageCtx) {
                Warn("无法获取 Canvas 绘图上下文，动画编辑器将无法正常使用。");
            }
            document.body.appendChild(this.root);
            this.root.addEventListener("mouseenter", ev => this.isMouseOnRoot = true);
            this.root.addEventListener("mouseleave", ev => this.isMouseOnRoot = false);
            document.addEventListener("mousemove", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("mousedown", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("mouseup", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("dblclick", ev => this.update({ mouseEvent: ev }));
            document.addEventListener("wheel", ev => this.update({ wheelEvent: ev }));
            document.addEventListener("keydown", ev => this.update({ keyboardEvent: ev }));
            document.addEventListener("keyup", ev => this.update({ keyboardEvent: ev }));
            this.updateTanimTree();
        }
        setPosition(left = null, top = null) {
            this.root.style.transform = `translate(${(left ?? this.left) - 5 + (this.isMinimized ? this.width - this.canvasWidth : 0)}px, ${(top ?? this.top) - 5}px)`;
        }
        setCanvasSize(width, height) {
            this.canvas.width = width ?? (width = this.width);
            this.canvas.height = height ?? (height = this.height);
            this.updateStageCanvasSize();
            this.updateCuis();
            this.updateKuis();
            this.updatePuis();
        }
        updateStageCanvasSize() {
            if (!this.isMinimized) {
                this.stageCanvas.width = this.canvasWidth - this.leftBarWidth - this.rightBarWidth;
                this.stageCanvas.height = this.canvasHeight - 30 - 50 - this.timelineBarHeight - 50;
            }
        }
        toCanvasPosition(x, y) {
            return [x - this.left - scrollX - (this.isMinimized ? this.width - this.canvasWidth : 0), y - this.top - scrollY];
        }
        updateMousePosition() {
            [this.mouseX, this.mouseY] = this.toCanvasPosition(this.mouseClientX, this.mouseClientY);
            this.updateMouseTimelinePosition();
            this.updateMouseStagePosition();
        }
        stageToCanvasPosition(x, y, anchorX, anchorY) {
            anchorX ?? (anchorX = (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2);
            anchorY ?? (anchorY = (30 + this.canvasHeight - 50 - this.timelineBarHeight - 50) / 2);
            return [
                anchorX + (x - this.previewCameraX) * this.previewCameraS,
                anchorY - (y - this.previewCameraY) * this.previewCameraS
            ];
        }
        canvasToStagePosition(x, y, anchorX, anchorY) {
            anchorX ?? (anchorX = (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2);
            anchorY ?? (anchorY = (30 + this.canvasHeight - 50 - this.timelineBarHeight - 50) / 2);
            return [
                (x - anchorX) / this.previewCameraS + this.previewCameraX,
                (anchorY - y) / this.previewCameraS + this.previewCameraY
            ];
        }
        updateMouseStagePosition() {
            [this.mouseStageX, this.mouseStageY] = this.canvasToStagePosition(this.mouseX, this.mouseY);
        }
        canvasTotimelinePosition(x, y, anchorX, anchorY) {
            anchorX ?? (anchorX = this.leftBarWidth);
            anchorY ?? (anchorY = this.canvasHeight - 50 - 25);
            return [
                (x - anchorX) / this.timelineScaleX + this.timelineScrollX,
                (anchorY - y) / this.timelineScaleY + this.timelineScrollY
            ];
        }
        timelineToCanvasPosition(x, y, anchorX, anchorY) {
            anchorX ?? (anchorX = this.leftBarWidth);
            anchorY ?? (anchorY = this.canvasHeight - 50 - 25);
            return [
                (x - this.timelineScrollX) * this.timelineScaleX + anchorX,
                typeof y == "number" ? anchorY - (y - this.timelineScrollY) * this.timelineScaleY :
                    this.canvasHeight + ((-this.timelineBarHeight + 20 + 20) + (-50 - 25)) / 2
            ];
        }
        timeToScrollX(time, start, length, anchor) {
            anchor ?? (anchor = this.leftBarWidth + 25);
            start -= 60;
            length += 120;
            return (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - 25 * 2) * (time - start) / length + anchor;
        }
        scrollXToTime(x, start, length, anchor) {
            anchor ?? (anchor = this.leftBarWidth + 25);
            start -= 60;
            length += 120;
            return (x - anchor) * length / (this.canvasWidth - this.leftBarWidth - this.rightBarWidth - 25 * 2) + start;
        }
        scaleTimelineX(n) {
            n = clamp(n, -30 - this.timelineScalePowX, 30 - this.timelineScalePowX);
            if (n == 0)
                return;
            let scaleCenter = (false ? this.mouseX :
                (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2) - this.leftBarWidth;
            this.timelineScrollX += scaleCenter * (1 - 1.25 ** -n) / this.timelineScaleX;
            this.timelineScalePowX += n;
            this.updateMouseTimelinePosition();
        }
        scaleTimelineY(n) {
            n = clamp(n, -20 - this.timelineScalePowY, 40 - this.timelineScalePowY);
            if (n == 0)
                return;
            let scaleCenter = this.canvasHeight - 50 - 25 - (false ? this.mouseY : (this.canvasHeight - 50 +
                ((-this.timelineBarHeight + 20 + 20) + (-25)) / 2));
            this.timelineScrollY += scaleCenter * (1 - 1.25 ** -n) / this.timelineScaleY;
            this.timelineScalePowY += n;
            this.updateMouseTimelinePosition();
        }
        scrollTimeline(x, y) {
            this.timelineScrollX += x;
            this.timelineScrollY += y;
            this.updateMouseTimelinePosition();
        }
        getHandleInfo(timeline, keyframeIndex) {
            let keyframe = timeline.keyframes[keyframeIndex];
            let rightKeyframe = timeline.keyframes[keyframeIndex + 1];
            if (!rightKeyframe)
                return null;
            if (typeof keyframe.y == "string")
                return null;
            if (typeof rightKeyframe.y == "string")
                return null;
            if (keyframe.interType == "power" || keyframe.interType == "exp" || keyframe.interType == "tradExp") {
                let pcx = (keyframe.x + rightKeyframe.x) / 2;
                let pcy = Keyframe.Ease(pcx, keyframe, rightKeyframe);
                if (typeof pcy == "string")
                    return null;
                let [cx, cy] = this.timelineToCanvasPosition(pcx, pcy);
                return {
                    type: keyframe.interType, keyframe,
                    cx, cy,
                };
            }
            else if (keyframe.interType == "elastic") {
                let pcx = (keyframe.x + rightKeyframe.x) / 2;
                let expFn = (time) => InterpolationFunctions.InterEase(keyframe.x, keyframe.y, rightKeyframe.x, rightKeyframe.y, time, keyframe.getParam("easeType"), tm => InterpolationFunctions.MapExpIn(tm, keyframe.getParam("elasticN")));
                let pcy = expFn(pcx);
                let [cx, cy] = this.timelineToCanvasPosition(pcx, pcy);
                return {
                    type: keyframe.interType, keyframe,
                    cx, cy, expFn
                };
            }
            else if (keyframe.interType == "back") {
                let s = keyframe.getParam("backS");
                if (typeof s != "number")
                    return null;
                let x0 = (2 * s) / (3 * (s + 1));
                let y0 = (-4 * s ** 3) / (27 * (s + 1) ** 2);
                let easeType = keyframe.getParam("easeType");
                if (easeType == "easeOut" || easeType == "easeOutIn") {
                    x0 = 1 - x0;
                    y0 = 1 - y0;
                }
                if (easeType == "easeInOut" || easeType == "easeOutIn") {
                    x0 *= 0.5;
                    y0 *= 0.5;
                }
                let pcx = keyframe.x + (rightKeyframe.x - keyframe.x) * x0;
                let pcy = keyframe.y + (rightKeyframe.y - keyframe.y) * y0;
                let [cx, cy] = this.timelineToCanvasPosition(pcx, pcy);
                return {
                    type: "back", keyframe,
                    cx, cy
                };
            }
            else if (keyframe.interType == "lagrange") {
                let pcx = keyframe.getParam("lagrangeCX");
                if (typeof pcx != "number")
                    return null;
                let pcy = keyframe.getParam("lagrangeCY");
                if (typeof pcy != "number")
                    return null;
                let [cx, cy] = this.timelineToCanvasPosition((keyframe.x + rightKeyframe.x) / 2 + pcx, (keyframe.y + rightKeyframe.y) / 2 + pcy);
                return {
                    type: "lagrange", keyframe,
                    cx, cy,
                };
            }
            else if (keyframe.interType == "bezier") {
                let [x1, y1] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                let [x2, y2] = this.timelineToCanvasPosition(rightKeyframe.x, rightKeyframe.y);
                let pcx1 = keyframe.getParam("bezierCX1");
                if (typeof pcx1 != "number")
                    return null;
                let pcy1 = keyframe.getParam("bezierCY1");
                if (typeof pcy1 != "number")
                    return null;
                let pcx2 = keyframe.getParam("bezierCX2");
                if (typeof pcx2 != "number")
                    return null;
                "aligned";
                let pcy2 = keyframe.getParam("bezierCY2");
                if (typeof pcy2 != "number")
                    return null;
                let [cx1, cy1] = this.timelineToCanvasPosition(keyframe.x + pcx1, keyframe.y + pcy1);
                let [cx2, cy2] = this.timelineToCanvasPosition(rightKeyframe.x + pcx2, rightKeyframe.y + pcy2);
                let handleType = keyframe.getParam("bezierHandleType");
                let rightHandleType = rightKeyframe.getParam("bezierHandleType");
                return {
                    type: "bezier", keyframe, rightKeyframe,
                    handleType, rightHandleType,
                    x1, y1, x2, y2,
                    cx1, cy1, cx2, cy2,
                };
            }
            return null;
        }
        updateMouseTimelinePosition() {
            [this.mouseTimelineX, this.mouseTimelineY] = this.canvasTotimelinePosition(this.mouseX, this.mouseY);
        }
        trimText(prefix, txt, suffix, maxWidth) {
            if (maxWidth <= 0)
                return prefix + "" + suffix;
            let ctx = this.ctx;
            if (ctx.measureText(prefix + txt + suffix).width <= maxWidth)
                return prefix + txt + suffix;
            let low = 0;
            let high = (prefix + txt + suffix).length;
            let bestK = -1;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const trimmedText = prefix + txt.substring(0, mid) + "..." + suffix;
                const width = ctx.measureText(trimmedText).width;
                if (width <= maxWidth) {
                    bestK = mid;
                    low = mid + 1;
                }
                else {
                    high = mid - 1;
                }
            }
            return prefix + txt.substring(0, bestK) + '...' + suffix;
        }
        getTanimListButtons(item) {
            switch (item.type) {
                case 0:
                    return [7, 6, 2, 4, 3];
                case 1:
                    return [8, 6, 1, 4, 3];
                case 2:
                    return [9];
                case 3:
                    return [10, 6, 1, 4, 3];
            }
        }
        getLayerListButtons(item) {
            switch (item.type) {
                case 0:
                    return [5];
                case 1:
                    return [8, 5];
                case 2:
                    return [9];
                case 3:
                    return [10, 5];
            }
        }
        ask(message, default_, callback) {
            let startTime = Date.now();
            let answer = prompt(message ?? undefined, default_ ?? undefined);
            if (answer instanceof Promise) {
                this.isInputing = true;
                answer.then(answer => {
                    callback(answer);
                    this.isInputing = false;
                    this.playTimestamp += Date.now() - startTime;
                    this.update(null);
                });
                return true;
            }
            else {
                callback(answer);
                this.playTimestamp += Date.now() - startTime;
                return false;
            }
        }
        askAndCreateNewTanim() {
            return this.ask(getTranslate("CQET_eNewTanimNameQuestion"), TheTanimManager.getSafeTanimName(getTranslate("CQET_eDefaultTanimName")), answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(answer), 120, 60, []);
                    TheTanimManager.tanims.push(tanim);
                    this.updateTanimTree();
                    saveData();
                }
            });
        }
        askAndCreateNewTanimInFolder(dir) {
            let dirStr = dir.join("//") + "//";
            let folderName = dir.pop();
            if (folderName === undefined)
                return this.askAndCreateNewTanim();
            let defaultNameFull = TheTanimManager.getSafeTanimName(dirStr + getTranslate("CQET_eDefaultTanimName"));
            let defaultDir = defaultNameFull.split("//");
            let defaultName = defaultDir.pop();
            if (defaultName === undefined)
                return this.askAndCreateNewTanim();
            return this.ask(getTranslate("CQET_eNewTanimNameInFolderQuestion").replace("[folderName]", folderName), defaultName, answer => {
                if (answer !== null) {
                    let tanim = new Tanim(TheTanimManager.getSafeTanimName(dirStr + answer), 120, 60, []);
                    let tanims = TheTanimManager.tanims;
                    for (let i = tanims.length - 1; i >= 0; i--) {
                        if (tanims[i].name.startsWith(dirStr)) {
                            tanims.splice(i + 1, 0, tanim);
                            this.updateTanimTree();
                            saveData();
                            return;
                        }
                    }
                }
            });
        }
        askAndRenameTanim(tanim) {
            return this.ask(getTranslate("CQET_eRenameTanimQuestion").replace("[tanimName]", tanim.name), tanim.name, answer => {
                if (answer !== null) {
                    tanim.rename(answer);
                    this.updateTanimTree();
                    this.updateLayerTree();
                }
            });
        }
        askAndRenameFolder(tanims, dir) {
            let dirStr = dir.join("//");
            let folderName = dir.pop();
            if (!folderName)
                return false;
            return this.ask(getTranslate("CQET_eRenameFolderQuestion").replace("[folderName]", folderName), folderName, answer => {
                if (answer !== null) {
                    dir.push(answer);
                    let newDirStr = dir.join("//");
                    for (let tanim of tanims) {
                        tanim.rename(TheTanimManager.getSafeTanimName(tanim.name.replace(new RegExp("^" + dirStr), newDirStr)));
                    }
                    if (this.foldedTanimFolders.has(dirStr)) {
                        this.foldedTanimFolders.delete(dirStr);
                        this.foldedTanimFolders.add(newDirStr);
                    }
                    if (this.foldedLayerFolders.has(dirStr)) {
                        this.foldedLayerFolders.delete(dirStr);
                        this.foldedLayerFolders.add(newDirStr);
                    }
                    this.updateTanimTree();
                    this.updateLayerTree();
                }
            });
        }
        confirm(message) {
            let startTime = Date.now();
            let result = confirm(message ?? "");
            this.playTimestamp += Date.now() - startTime;
            return result;
        }
        updateTree(tanimTree, tanimFolders, tanims, foldedFolders) {
            tanimTree.length = 0;
            Object.keys(tanimFolders).forEach(key => delete tanimFolders[key]);
            let dir = [];
            let foldedDepth = Infinity;
            for (let i = 0; i < tanims.length; i++) {
                let nameFull = tanims[i].name;
                let thisDir = nameFull.split("//");
                let name = thisDir.pop() ?? "";
                for (let i = dir.length - 1; i >= 0; i--) {
                    if (dir[i] !== thisDir[i]) {
                        if (foldedDepth == Infinity)
                            tanimTree.push({
                                dir: [...dir],
                                text: dir[i],
                                type: 2,
                                indentation: i,
                            });
                        let folderName = dir.join("//");
                        if (foldedDepth == Infinity)
                            if (tanimFolders[folderName]) {
                                let ranges = tanimFolders[folderName].ranges;
                                ranges[ranges.length - 1].to = tanimTree.length;
                            }
                        dir.pop();
                        if (dir.length < foldedDepth)
                            foldedDepth = Infinity;
                    }
                }
                for (let i = 0; i < thisDir.length; i++) {
                    if (dir[i] !== thisDir[i]) {
                        dir.push(thisDir[i]);
                        let isFoldHead = foldedFolders.has(dir.join("//"));
                        if (foldedDepth == Infinity)
                            tanimTree.push({
                                dir: [...dir],
                                text: thisDir[i],
                                type: isFoldHead ? 3 : 1,
                                indentation: i,
                            });
                        let folderName = dir.join("//");
                        if (foldedDepth == Infinity)
                            if (tanimFolders[folderName]) {
                                tanimFolders[folderName].ranges.push({ from: tanimTree.length - 1, to: tanimTree.length });
                            }
                            else {
                                tanimFolders[folderName] = {
                                    color: stringToHSL(folderName, 50, 90),
                                    indentation: i,
                                    ranges: [{ from: tanimTree.length - 1, to: tanimTree.length }],
                                };
                            }
                        if (isFoldHead)
                            foldedDepth = min(foldedDepth, dir.length);
                    }
                }
                if (foldedDepth == Infinity)
                    tanimTree.push({
                        dir: [...dir],
                        text: name,
                        type: 0,
                        indentation: dir.length,
                        tanim: tanims[i]
                    });
            }
            for (let i = dir.length - 1; i >= 0; i--) {
                if (foldedDepth == Infinity)
                    tanimTree.push({
                        dir: [...dir],
                        text: dir[i],
                        type: 2,
                        indentation: i,
                    });
                let folderName = dir.join("//");
                if (foldedDepth == Infinity)
                    if (tanimFolders[folderName]) {
                        let ranges = tanimFolders[folderName].ranges;
                        ranges[ranges.length - 1].to = tanimTree.length;
                    }
                dir.pop();
                if (dir.length < foldedDepth)
                    foldedDepth = Infinity;
            }
        }
        updateTanimTree() {
            this.updateTree(this.tanimTree, this.tanimFolders, TheTanimManager.tanims, this.foldedTanimFolders);
        }
        updateLayerTree() {
            this.updateTree(this.layerTree, this.layerFolders, this.layers, this.foldedLayerFolders);
        }
        scrollTanimList(x, update = true) {
            this.tanimListScroll = clamp(this.tanimListScroll + x, 0, this.tanimTree.length - floor((this.canvasHeight - 30 - 24 - this.layerBarHeight - 240 - 50)
                / 24) + 1);
        }
        scrollLayerList(x) {
            this.layerListScroll = clamp(this.layerListScroll + x, 0, this.layerTree.length - floor((this.layerBarHeight - 24) / 24) + 1);
        }
        addToLayer(item, idx = 0) {
            switch (item.type) {
                case 0:
                    if (!item.tanim)
                        return;
                    if (this.layers.includes(item.tanim))
                        break;
                    this.layers.splice(idx, 0, item.tanim);
                    if (!this.tanim)
                        this.editTanim(item.tanim);
                    break;
                case 1:
                case 2:
                case 3:
                    let tanims = TheTanimManager.getTanimsByPrefix(item.dir.join("//") + "//");
                    this.layers.splice(idx, 0, ...tanims.filter(tanim => !this.layers.includes(tanim)));
                    if (!this.tanim && tanims[0])
                        this.editTanim(tanims[0]);
                    break;
            }
            this.updateLayerTree();
        }
        removeLayer(index, updateLayerTree = true) {
            if (!this.layers[index])
                return;
            if (this.tanim == this.layers[index])
                this.editTanim(null);
            this.layers.splice(index, 1);
            if (updateLayerTree)
                this.updateLayerTree();
            this.updateKuis();
        }
        removeAllLayers(updateLayerTree = true) {
            this.layers.length = 0;
            this.editTanim(null);
            if (updateLayerTree)
                this.updateLayerTree();
        }
        editTanim(tanim) {
            if (this.tanim == tanim)
                return;
            if (tanim && !this.configs.tanimConfigs[tanim.name]) {
                this.configs.tanimConfigs[tanim.name] = new TanimConfig(this.getSpriteName(this.tanim), this.getCostumeNames(this.tanim), {});
            }
            this.tanim = tanim;
            this.tValueNames = [...DefaultTValueNames];
            if (!tanim) {
                this.selectedKeyframes.clear();
                this.timelines = [null, null];
                this.isPlaying = false;
                this.updateCuis();
                return;
            }
            for (let { tValueType } of tanim.timelines) {
                if (DefaultTValues[tValueType] === undefined && !DefaultTValueNames.includes(tValueType)) {
                    this.tValueNames.push(tValueType);
                }
            }
            if (!this.tValueNames.includes(this.tValueName)) {
                this.tValueName = this.tValueNames[0];
            }
            this.editTValueName(this.tValueName);
            this.updateKuis();
        }
        editTValueName(tValueName) {
            this.selectedKeyframes.clear();
            if (!this.tanim)
                return;
            if (!this.tValueNames.includes(tValueName))
                return;
            this.tValueName = tValueName;
            if (tValueName == `${"px"}|${"py"}`) {
                this.timelines = [
                    this.tanim.getTimelineByTValueType("px") ?? new Timeline("px", []),
                    this.tanim.getTimelineByTValueType("py") ?? new Timeline("py", [])
                ];
            }
            else if (tValueName == `${"sx"}|${"sy"}`) {
                this.timelines = [
                    this.tanim.getTimelineByTValueType("sx") ?? new Timeline("sx", []),
                    this.tanim.getTimelineByTValueType("sy") ?? new Timeline("sy", [])
                ];
            }
            else {
                this.timelines = [
                    this.tanim.getTimelineByTValueType(tValueName) ?? new Timeline(tValueName, []),
                    null
                ];
            }
            this.updateCuis();
            this.updateKuis();
        }
        focus(time, autoScroll = true) {
            this.focusTime = round(time);
            let leftTime = this.canvasTotimelinePosition(this.leftBarWidth + 100, 0)[0];
            let rightTime = this.canvasTotimelinePosition(this.canvasWidth - this.rightBarWidth - 100, 0)[0];
            if (autoScroll) {
                if (this.focusTime < leftTime) {
                    this.scrollTimeline(this.focusTime - leftTime, 0);
                }
                else if (this.focusTime > rightTime) {
                    this.scrollTimeline(this.focusTime - rightTime, 0);
                }
            }
            this.updateCuis();
        }
        dropTanimToTanims(fromTreeIdx, toTreeIdx) {
            if (toTreeIdx == fromTreeIdx || toTreeIdx == fromTreeIdx + 1)
                return;
            let tanimTree = this.tanimTree;
            let tanims = TheTanimManager.tanims;
            let fromItem = tanimTree[fromTreeIdx];
            let toItem = tanimTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx;
            let toDir;
            if (!toItem) {
                if (toTreeIdx == tanimTree.length) {
                    toIdx = tanims.length;
                    toDir = [];
                }
                else {
                    return;
                }
            }
            else {
                switch (toItem.type) {
                    case 0:
                        if (!toItem.tanim)
                            return;
                        toIdx = tanims.indexOf(toItem.tanim);
                        if (toIdx == -1)
                            return;
                        toDir = toItem.tanim.name.split("//").slice(0, -1);
                        break;
                    case 1:
                    case 2:
                    case 3:
                        toIdx = -1;
                        for (let i = toTreeIdx + 1; i < tanimTree.length; i++) {
                            let item = tanimTree[i];
                            if (item.type == 0) {
                                if (!item.tanim)
                                    return;
                                toIdx = tanims.indexOf(item.tanim);
                                if (toIdx == -1)
                                    return;
                                break;
                            }
                        }
                        if (toIdx == -1)
                            toIdx = tanims.length;
                        if (toItem.type == 2) {
                            toDir = [...toItem.dir];
                        }
                        else {
                            toDir = toItem.dir.slice(0, -1);
                        }
                        break;
                    default:
                        return;
                }
            }
            let toDirStr = toDir.length == 0 ? "" : toDir.join("//") + "//";
            if (fromItem.type == 0 && fromItem.tanim) {
                let fromTanim = fromItem.tanim;
                let fromDir = fromItem.dir;
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let idx = tanims.indexOf(fromTanim);
                if (idx == -1)
                    return;
                tanims[idx] = null;
                fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
                tanims.splice(toIdx, 0, fromTanim);
            }
            else if (fromItem.type == 3) {
                let fromDir = fromItem.dir.slice(0, -1);
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join("//") + "//");
                let fromIdxs = [];
                for (let fromTanim of fromTanims) {
                    let idx = tanims.indexOf(fromTanim);
                    if (idx == -1)
                        return;
                    fromIdxs.push(idx);
                }
                for (let idx of fromIdxs) {
                    tanims[idx] = null;
                }
                for (let fromTanim of fromTanims) {
                    fromTanim.rename(TheTanimManager.getSafeTanimName(fromTanim.name.replace(new RegExp("^" + fromDirStr), toDirStr)));
                }
                tanims.splice(toIdx, 0, ...fromTanims);
            }
            else
                return;
            for (let i = tanims.length - 1; i >= 0; i--) {
                if (tanims[i] === null)
                    tanims.splice(i, 1);
            }
            this.updateTanimTree();
            saveData();
        }
        getLayerToIdx(layerTree, layers, toTreeIdx, toItem) {
            let toIdx;
            if (!toItem) {
                if (toTreeIdx == layerTree.length) {
                    return layers.length;
                }
                else {
                    return -1;
                }
            }
            else {
                switch (toItem.type) {
                    case 0:
                        if (!toItem.tanim)
                            return -1;
                        toIdx = layers.indexOf(toItem.tanim);
                        return toIdx;
                    case 1:
                    case 2:
                    case 3:
                        toIdx = -1;
                        for (let i = toTreeIdx + 1; i < layerTree.length; i++) {
                            let item = layerTree[i];
                            if (item.type == 0) {
                                if (!item.tanim)
                                    return -1;
                                toIdx = layers.indexOf(item.tanim);
                                if (toIdx == -1)
                                    return -1;
                                break;
                            }
                        }
                        if (toIdx == -1)
                            toIdx = layers.length;
                        return toIdx;
                    default:
                        return -1;
                }
            }
        }
        dropTanimToLayers(fromTreeIdx, toTreeIdx) {
            let tanimTree = this.tanimTree;
            let layerTree = this.layerTree;
            let layers = this.layers;
            let fromItem = tanimTree[fromTreeIdx];
            let toItem = layerTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
            if (toIdx == -1)
                return;
            this.addToLayer(fromItem, toIdx);
        }
        dropLayerToLayers(fromTreeIdx, toTreeIdx) {
            let layerTree = this.layerTree;
            let layers = this.layers;
            let fromItem = layerTree[fromTreeIdx];
            let toItem = layerTree[toTreeIdx];
            if (!fromItem)
                return;
            let toIdx = this.getLayerToIdx(layerTree, layers, toTreeIdx, toItem);
            if (toIdx == -1)
                return;
            if (fromItem.type == 0 && fromItem.tanim) {
                let fromTanim = fromItem.tanim;
                let idx = layers.indexOf(fromTanim);
                if (idx == -1)
                    return;
                layers[idx] = null;
                layers.splice(toIdx, 0, fromTanim);
            }
            else if (fromItem.type == 3) {
                let fromDir = fromItem.dir.slice(0, -1);
                let fromDirStr = fromDir.length == 0 ? "" : fromDir.join("//") + "//";
                let fromTanims = TheTanimManager.getTanimsByPrefix(fromItem.dir.join("//") + "//");
                for (let fromTanim of fromTanims) {
                    let idx = layers.indexOf(fromTanim);
                    if (idx == -1)
                        return;
                    layers[idx] = null;
                }
                layers.splice(toIdx, 0, ...fromTanims);
            }
            else
                return;
            for (let i = layers.length - 1; i >= 0; i--) {
                if (layers[i] === null)
                    layers.splice(i, 1);
            }
            this.updateLayerTree();
        }
        alignBezier(left, mid, right, handleType = null, main = "left") {
            let cxLeft = left?.getParam("bezierCX2");
            let cyLeft = left?.getParam("bezierCY2");
            let cxRight = mid.getParam("bezierCX1");
            let cyRight = mid.getParam("bezierCY1");
            let isHasLeftHandle = left && left.interType == "bezier" && typeof cxLeft == "number" && typeof cyLeft == "number";
            let isHasRightHandle = right && mid.interType == "bezier" && typeof cxRight == "number" && typeof cyRight == "number";
            handleType ?? (handleType = mid.getParam("bezierHandleType"));
            switch (handleType) {
                case "aligned":
                case "free":
                    if (isHasLeftHandle && left) {
                        if (cxLeft < left.x - mid.x || 0 < cxLeft) {
                            cxLeft = clamp(cxLeft, left.x - mid.x, 0);
                            left.setParam("bezierCX2", cxLeft);
                            return this.alignBezier(left, mid, right, handleType, "left");
                        }
                    }
                    if (isHasRightHandle && right) {
                        if (cxRight < 0 || right.x - mid.x < cxRight) {
                            cxRight = clamp(cxRight, 0, right.x - mid.x);
                            mid.setParam("bezierCX1", cxRight);
                            return this.alignBezier(left, mid, right, handleType, "right");
                        }
                    }
                    if (handleType == "free")
                        break;
                    if (isHasLeftHandle && isHasRightHandle && left && right) {
                        let lLeft = sqrt((cxLeft * this.timelineScaleX) ** 2 + (cyLeft * this.timelineScaleY) ** 2);
                        let lRight = sqrt((cxRight * this.timelineScaleX) ** 2 + (cyRight * this.timelineScaleY) ** 2);
                        if (main == "left") {
                            let r = -lRight / lLeft;
                            cxRight = r * cxLeft;
                            cyRight = r * cyLeft;
                        }
                        else {
                            let r = -lLeft / lRight;
                            cxLeft = r * cxRight;
                            cyLeft = r * cyRight;
                        }
                    }
                    break;
                case "vector":
                    cxLeft = 0;
                    cyLeft = 0;
                    cxRight = 0;
                    cyRight = 0;
                    break;
                case "auto":
                    if (!isHasLeftHandle && isHasRightHandle && right) {
                        cxRight = (right.x - mid.x) / 3;
                        cyRight = 0;
                        break;
                    }
                    if (isHasLeftHandle && !isHasRightHandle && left) {
                        cxLeft = (left.x - mid.x) / 3;
                        cyLeft = 0;
                        break;
                    }
                    if (!left || !right)
                        break;
                    if (typeof left.y != "number" ||
                        typeof mid.y != "number" ||
                        typeof right.y != "number")
                        break;
                    cxLeft = (left.x - mid.x) / 3;
                    cxRight = (right.x - mid.x) / 3;
                    let dx = cxRight - cxLeft;
                    if (dx == 0) {
                        cyLeft = 0;
                        cyRight = 0;
                        break;
                    }
                    if (sign(right.y - mid.y) == sign(left.y - mid.y)) {
                        cyLeft = 0;
                        cyRight = 0;
                        break;
                    }
                    let dy = (right.y - left.y) / 2;
                    if (dy == 0) {
                        cyLeft = 0;
                        cyRight = 0;
                        break;
                    }
                    let yMin = min(left.y, right.y) - mid.y;
                    let yMax = max(left.y, right.y) - mid.y;
                    let k = dy / dx;
                    cyLeft = k * cxLeft;
                    cyRight = k * cxRight;
                    if (yMin > cyLeft || cyLeft > yMax) {
                        k = clamp(cyLeft, yMin, yMax) / cxLeft;
                        cyLeft = k * cxLeft;
                        cyRight = k * cxRight;
                    }
                    if (yMin > cyRight || cyRight > yMax) {
                        k = clamp(cyRight, yMin, yMax) / cxRight;
                        cyLeft = k * cxLeft;
                        cyRight = k * cxRight;
                    }
                    break;
            }
            left?.setParam("bezierCX2", cxLeft);
            left?.setParam("bezierCY2", cyLeft);
            mid.setParam("bezierCX1", cxRight);
            mid.setParam("bezierCY1", cyRight);
        }
        alignBezierForTimeline(timeline, from = null, to = null, handleType = null, main = "left") {
            from ?? (from = 0);
            to ?? (to = timeline.keyframes.length);
            for (let i = from; i < to; i++) {
                let keyframe = timeline.keyframes[i];
                if (!keyframe)
                    continue;
                if (keyframe.interType != "bezier" && timeline.keyframes[i - 1]?.interType != "bezier")
                    continue;
                let leftKeyframe = (timeline.keyframes[i - 1] ?? null);
                let rightKeyframe = (timeline.keyframes[i + 1] ?? null);
                this.alignBezier(leftKeyframe, keyframe, rightKeyframe, handleType, main);
            }
        }
        scrollTUIBar(x) {
            this.TUIScroll = clamp(this.TUIScroll + x, 0, this.tValueNames.length + 1 - (this.canvasHeight - 30 - 50 - 30) / 60 + 2);
        }
        zoomCamera(s) {
            this.previewCameraSPow = clamp(this.previewCameraSPow + s, -5, 5);
            this.updateMouseStagePosition();
        }
        playStep() {
            if (this.isPlaying) {
                this.update(null);
                if (!this.isLoop) {
                    let timeSec = this.playTimeSec;
                    let maxLengthSec = max(...this.layers.map(layer => layer.length / layer.fps));
                    if (this.isYoyo)
                        maxLengthSec *= 2;
                    if (timeSec > maxLengthSec) {
                        this.isPlaying = false;
                        this.update(null);
                        return;
                    }
                }
                requestAnimationFrame(this.playStep.bind(this));
            }
        }
        updateCuis() {
            let width = this.canvasWidth - this.leftBarWidth - this.rightBarWidth;
            let cuis = this.cuis;
            cuis.length = 0;
            let largeSpacing = 15;
            let spacing = 5;
            let d = width / 2 - (44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 3 + 10);
            if (d < 0) {
                largeSpacing += d / 4;
                largeSpacing = max(4, largeSpacing);
                spacing += d / 12;
                spacing = max(2, spacing);
            }
            cuis.push(new CUI(8, 1, 0, 44));
            let p = 44 / 2 + largeSpacing + 30 / 2;
            cuis.push(new CUI(7, 1, -p, 30));
            cuis.push(new CUI(9, 1, p, 30));
            p += 30 + spacing;
            cuis.push(new CUI(6, 1, -p, 30));
            cuis.push(new CUI(10, 1, p, 30));
            p += 30 + spacing;
            cuis.push(new CUI(5, 1, -p, 30));
            cuis.push(new CUI(11, 1, p, 30));
            p += 30 + largeSpacing;
            if (this.getDeletePairs()) {
                cuis.push(new CUI(4, 1, -p, 30));
            }
            cuis.push(new CUI(12, 1, p, 30));
            p += 30 + spacing;
            if (this.getNewKeyframeTimeline()) {
                cuis.push(new CUI(3, 1, -p, 30));
            }
            cuis.push(new CUI(13, 1, p, 30));
            p += 30 + largeSpacing;
            if (this.timelines[1]) {
                cuis.push(new CUI(2, 1, -p, 30));
            }
            cuis.push(new CUI(14, 1, p, 30));
            let dLeft = width / 2 - (44 / 2 + 30 * 7 + spacing * 3 + largeSpacing * 5 + 10);
            if (width / 2 >= 44 / 2 + 30 * 7 + spacing * 3 + largeSpacing * 4) {
                p += 30 + largeSpacing;
                if (this.timelines[0]) {
                    cuis.push(new CUI(1, 1, -p, 30));
                }
                else {
                    dLeft = width / 2 - (44 / 2 + 30 * 6 + spacing * 3 + largeSpacing * 4 + 10);
                }
            }
            if (this.tanim) {
                if (dLeft >= 60) {
                    cuis.push(new CUI(0, 0, 10, { w: min(dLeft, 120), h: 30 }));
                }
                let dRight = width / 2 - (44 / 2 + 30 * 7 + spacing * 3 + largeSpacing * 5 + 10);
                if (dRight >= 60) {
                    cuis.push(new CUI(16, 2, -10, { w: min(dRight, 100), h: 30 }));
                }
            }
        }
        updateKuis() {
            let width = this.rightBarWidth - 2 * 6.5;
            let kuis = this.kuis;
            kuis.length = 0;
            let y = 0;
            if (!this.tanim) {
                kuis.push(new KUI(2, 0, y, { w: width, h: 24 }, {
                    text: TheTanimManager.tanims.length == 0 ? "CQET_eKUIPleaseCreateTanim" : "CQET_eKUIPleaseOpenTanim"
                }));
                return;
            }
            kuis.push(new KUI(0, 0, y, { w: width, h: 24 }, { text: "CQET_eKUITitle" }));
            y += 24 - 20;
            if (this.selectedKeyframes.size == 0) {
                y += 20;
                kuis.push(new KUI(2, 0, y, width, { text: "CQET_eKUINoSelect" }));
                return;
            }
            if (this.selectedKeyframes.size > 1) {
                y += 20;
                kuis.push(new KUI(2, 0, y, width, { text: "CQET_eKUIMultiSelect" }));
                return;
            }
            let [keyframe] = this.selectedKeyframes;
            let idx0 = this.timelines[0]?.keyframes.indexOf(keyframe) ?? -1;
            let idx1 = this.timelines[1]?.keyframes.indexOf(keyframe) ?? -1;
            y += 20;
            kuis.push(new KUI(3, 0, y, (width - 5) / 2, { text: "CQET_eKUITimeSec" }));
            kuis.push(new KUI(4, (width + 5) / 2, y, (width - 5) / 2, { text: "CQET_eKUITimeFrame" }));
            y += 20;
            kuis.push(new KUI(5, 0, y, width, { text: "CQET_eKUITValue" }));
            if (typeof keyframe.y == "string") {
                y += 20 + 5;
                kuis.push(new KUI(2, 0, y, width, { text: "CQET_eKUIStringKeyframeSelect" }));
                return;
            }
            y += 20 + 5;
            kuis.push(new KUI(6, 0, y, { w: width, h: 20 + 6 }, { interType: keyframe.interType, text: "CQET_eKUIInterType" }));
            y += 6;
            if (this.kuiState == 1) {
                let colWidth = (width - 2 * 5) / 3;
                let colStep = colWidth + 5;
                for (let row = 0; row < 5; row++) {
                    y += 20;
                    for (let col = 0; col < 3; col++) {
                        let interType = KUIInterTypeTable[col][row];
                        if (!interType)
                            continue;
                        kuis.push(new KUI(7, col * colStep, y, colWidth, { interType: interType, text: "CQET_eKUIInterTypeListItem" }));
                    }
                }
            }
            else {
                y += 3;
                switch (keyframe.interType) {
                    case "power":
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "powerN", text: "CQET_eKUIPowerN" }));
                        break;
                    case "exp":
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "expN", text: "CQET_eKUIExpN" }));
                        break;
                    case "elastic":
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "elasticM", text: "CQET_eKUIElasticM" }));
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "elasticN", text: "CQET_eKUIElasticN" }));
                        break;
                    case "back":
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "backS", text: "CQET_eKUIBackS" }));
                        break;
                    case "tradExp":
                        y += 20;
                        kuis.push(new KUI(8, 0, y, (width - 5) / 2, { paramType: "tradExpV", text: "CQET_eKUITradExpVD" }));
                        kuis.push(new KUI(9, (width + 5) / 2, y, (width - 5) / 2, { text: "CQET_eKUITradExpVM" }));
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "tradExpP", text: "CQET_eKUITradExpP" }));
                        break;
                    case "lagrange":
                        y += 20;
                        kuis.push(new KUI(1, 0, y, width, { text: "CQET_eKUILag2Controller" }));
                        y += 20;
                        kuis.push(new KUI(11, 0, y, (width - 5) / 2, { text: "CQET_eKUITimeSec" }));
                        kuis.push(new KUI(8, (width + 5) / 2, y, (width - 5) / 2, { paramType: "lagrangeCX", text: "CQET_eKUILagrangeCX" }));
                        y += 20;
                        kuis.push(new KUI(8, 0, y, width, { paramType: "lagrangeCY", text: "CQET_eKUILagrangeCY" }));
                        break;
                }
                let radioWidth = 20;
                let radioStep = radioWidth + 5;
                switch (keyframe.interType) {
                    case "power":
                    case "exp":
                    case "sine":
                    case "circular":
                    case "elastic":
                    case "back":
                    case "bounce":
                        y += 20 + 5;
                        kuis.push(new KUI(1, 0, y, width, { text: "CQET_eKUIEaseType" }));
                        y += 20;
                        kuis.push(new KUI(10, 0, y, radioWidth, { paramType: "easeType", paramValue: "easeIn" }));
                        kuis.push(new KUI(10, radioStep, y, radioWidth, { paramType: "easeType", paramValue: "easeOut" }));
                        kuis.push(new KUI(10, 2 * radioStep, y, radioWidth, { paramType: "easeType", paramValue: "easeInOut" }));
                        kuis.push(new KUI(10, 3 * radioStep, y, radioWidth, { paramType: "easeType", paramValue: "easeOutIn" }));
                        break;
                }
                if (keyframe.interType == "bezier" ||
                    this.timelines[0]?.keyframes[idx0 - 1]?.interType == "bezier" ||
                    this.timelines[1]?.keyframes[idx1 - 1]?.interType == "bezier") {
                    y += 20 + 5;
                    kuis.push(new KUI(1, 0, y, width, { text: "CQET_eKUIBezierHandleType" }));
                    y += 20;
                    kuis.push(new KUI(10, 3 * radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: "auto" }));
                    kuis.push(new KUI(10, 0, y, radioWidth, { paramType: "bezierHandleType", paramValue: "aligned" }));
                    kuis.push(new KUI(10, radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: "free" }));
                    kuis.push(new KUI(10, 2 * radioStep, y, radioWidth, { paramType: "bezierHandleType", paramValue: "vector" }));
                }
            }
        }
        updatePuis() {
            let width = this.canvasWidth - this.leftBarWidth - this.rightBarWidth - 2 * 5 - 3 * 5;
            let puis = this.puis;
            puis.length = 0;
            let x = this.leftBarWidth + 5;
            let y = 30 + 5;
            let headerWidth = min(width, 600);
            puis.push(new PUI(1, x, y, { w: 0.2 * headerWidth, h: 20 }, "CQET_ePUISpriteName"));
            x += 0.2 * headerWidth + 5;
            puis.push(new PUI(2, x, y, { w: 0.8 / 3 * headerWidth, h: 20 }, "CQET_ePUICostumeName0"));
            x += 0.8 / 3 * headerWidth + 5;
            puis.push(new PUI(3, x, y, { w: 0.8 / 3 * headerWidth, h: 20 }, "CQET_ePUICostumeName1"));
            x += 0.8 / 3 * headerWidth + 5;
            puis.push(new PUI(4, x, y, { w: 0.8 / 3 * headerWidth, h: 20 }, "CQET_ePUICostumeName2"));
            x = this.canvasWidth - this.rightBarWidth - 5 - 24;
            y = this.canvasHeight - 50 - this.timelineBarHeight - 50 - 5 - 24;
            puis.push(new PUI(6, x, y, { w: 24, h: 24 }));
            x -= 24 + 5;
            puis.push(new PUI(7, x, y, { w: 24, h: 24 }));
            x -= 24 + 5;
            puis.push(new PUI(5, x, y, { w: 24, h: 24 }));
        }
        updateHoverAndCursor(event = null) {
            this.hover = [];
            this.hoveredKeyframes.clear();
            this.hoveredHandle = null;
            this.cursor = "default";
            if ((0 < this.mouseX && this.mouseX < this.canvasWidth) && (0 < this.mouseY && this.mouseY < 30)) {
                this.cursor = "move";
                this.hover = ["header"];
                if (this.canvasWidth - 40 <= this.mouseX) {
                    this.cursor = "pointer";
                    this.hover.push("close");
                }
                else if (this.canvasWidth - 2 * 40 <= this.mouseX) {
                    this.cursor = "pointer";
                    this.hover.push("minimize");
                }
            }
            else if (!this.isMinimized) {
                if (abs(this.canvasWidth - this.mouseX) <= 4 && abs(this.canvasHeight - this.mouseY) <= 4) {
                    this.cursor = "nwse-resize";
                    this.hover = ["border", "rb"];
                }
                else if (abs(this.canvasWidth - this.mouseX) <= 4) {
                    this.cursor = "ew-resize";
                    this.hover = ["border", "r"];
                }
                else if (abs(this.canvasHeight - this.mouseY) <= 4) {
                    this.cursor = "ns-resize";
                    this.hover = ["border", "b"];
                }
                else if (abs(this.canvasWidth - this.rightBarWidth - this.mouseX) <= 3) {
                    this.cursor = "ew-resize";
                    this.hover = ["innerBorder", "r"];
                }
                else if (abs(this.leftBarWidth - this.mouseX) <= 3) {
                    this.cursor = "ew-resize";
                    this.hover = ["innerBorder", "l"];
                }
                else if (this.canvasWidth - this.rightBarWidth < this.mouseX && this.mouseX < this.canvasWidth - 4 &&
                    this.mouseY < this.canvasHeight - 50) {
                    if (abs(this.canvasHeight - 50 - 240 - this.layerBarHeight - this.mouseY) <= 3) {
                        this.cursor = "ns-resize";
                        this.hover = ["innerBorder", "layer"];
                    }
                    else if (this.canvasWidth - 24 - 20 < this.mouseX && this.mouseX < this.canvasWidth - 20 &&
                        30 < this.mouseY && this.mouseY < 30 + 24) {
                        this.cursor = "pointer";
                        this.hover = ["newTanim"];
                    }
                    else if (30 + 24 < this.mouseY &&
                        this.mouseY < this.canvasHeight - 50 - 240 - this.layerBarHeight - 5) {
                        if (this.mouseX >= this.canvasWidth - 20) {
                            this.hover = ["tanimScroll"];
                        }
                        else {
                            this.hover = ["tanimList"];
                            let treeIndex = floor((this.mouseY - (30 + 24)) / 24 + this.tanimListScroll);
                            if (0 <= treeIndex && treeIndex < this.tanimTree.length) {
                                this.cursor = "pointer";
                                this.hover.push(treeIndex);
                                let buttons = this.getTanimListButtons(this.tanimTree[treeIndex]);
                                let buttonIndex = clamp(floor((this.canvasWidth - 20 - this.mouseX) / 24), 0, buttons.length);
                                this.hover.push(buttons[buttonIndex] ?? 0);
                            }
                            else if (treeIndex >= this.tanimTree.length) {
                                this.hover.push(this.tanimTree.length);
                            }
                        }
                    }
                    else if (this.canvasHeight - 50 - 240 - this.layerBarHeight + 24 < this.mouseY &&
                        this.mouseY < this.canvasHeight - 50 - 240) {
                        if (this.mouseX >= this.canvasWidth - 20) {
                            this.hover = ["layerScroll"];
                        }
                        else {
                            this.hover = ["layerList"];
                            let treeIndex = floor((this.mouseY - (this.canvasHeight - 50 - 240 - this.layerBarHeight + 24)) / 24 + this.layerListScroll);
                            if (0 <= treeIndex && treeIndex < this.layerTree.length) {
                                this.cursor = "pointer";
                                this.hover.push(treeIndex);
                                let buttons = this.getLayerListButtons(this.layerTree[treeIndex]);
                                let buttonIndex = clamp(floor((this.canvasWidth - 20 - this.mouseX) / 24), 0, buttons.length);
                                this.hover.push(buttons[buttonIndex] ?? 0);
                            }
                            else if (treeIndex >= this.layerTree.length) {
                                this.hover.push(this.layerTree.length);
                            }
                        }
                    }
                    else if (this.canvasHeight - 50 - 240 < this.mouseY &&
                        this.mouseY < this.canvasHeight - 50) {
                        this.hover = ["keyframeBar"];
                        for (let kui of this.kuis) {
                            let { type, x, y, size: { w, h }, interType, paramType, paramValue } = kui;
                            if (type == 0 || type == 1 || type == 2)
                                continue;
                            let x1 = this.canvasWidth - this.rightBarWidth + 10 + x;
                            let x2 = x1 + w;
                            let y1 = this.canvasHeight - 50 - 240 + y;
                            let y2 = y1 + h;
                            if (x1 - 1 <= this.mouseX && this.mouseX <= x2 + 1 && y1 - 1 <= this.mouseY && this.mouseY <= y2 + 1) {
                                this.hover.push(type);
                                switch (type) {
                                    case 7:
                                        if (interType)
                                            this.hover.push(interType);
                                    case 8:
                                        if (paramType)
                                            this.hover.push(paramType);
                                    case 10:
                                        if (paramType && paramValue)
                                            this.hover.push(paramType, paramValue);
                                }
                                this.cursor = "pointer";
                                break;
                            }
                        }
                    }
                }
                else if (this.leftBarWidth < this.mouseX && this.mouseX < this.canvasWidth - this.rightBarWidth &&
                    this.mouseY < this.canvasHeight - 50) {
                    if (this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight - 50 - 8) {
                        this.hover = ["preview"];
                        for (let { type, x, y, size: { w, h } } of this.puis) {
                            if (type == 0)
                                continue;
                            if (x - 1 <= this.mouseX && this.mouseX <= x + w + 1 && y - 1 <= this.mouseY && this.mouseY <= y + h + 1) {
                                this.hover.push("pui", type);
                                this.cursor = "pointer";
                                break;
                            }
                        }
                    }
                    else if (this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight - 50) {
                        this.cursor = "ns-resize";
                        this.hover = ["innerBorder", "b"];
                    }
                    else if (this.canvasHeight - 50 - this.timelineBarHeight - 50 < this.mouseY &&
                        this.mouseY < this.canvasHeight - 50 - this.timelineBarHeight) {
                        this.hover = ["controlBar"];
                        for (let { type, align, pos, size: { w, h } } of this.cuis) {
                            let x1, x2, y1, y2;
                            switch (align) {
                                case 0:
                                    x1 = this.leftBarWidth + pos;
                                    x2 = x1 + w;
                                    break;
                                case 2:
                                    x2 = this.canvasWidth - this.rightBarWidth + pos;
                                    x1 = x2 - w;
                                    break;
                                default:
                                case 1:
                                    let x = (this.leftBarWidth + this.canvasWidth - this.rightBarWidth) / 2 + pos;
                                    x1 = x - w / 2;
                                    x2 = x + w / 2;
                                    break;
                            }
                            let y = this.canvasHeight - 50 - this.timelineBarHeight - 50 / 2;
                            y1 = y - h / 2;
                            y2 = y + h / 2;
                            if (x1 - 1 <= this.mouseX && this.mouseX <= x2 + 1 && y1 - 1 <= this.mouseY && this.mouseY <= y2 + 1) {
                                this.hover.push(type);
                                this.cursor = "pointer";
                                break;
                            }
                        }
                    }
                    else if (this.mouseY < this.canvasHeight - 50) {
                        this.hover = ["timeline"];
                        let top = this.canvasHeight - 50 - this.timelineBarHeight;
                        let bottom = this.canvasHeight - 50;
                        let left = this.leftBarWidth;
                        let right = this.canvasWidth - this.rightBarWidth;
                        if (this.mouseY < top + 20) {
                            this.hover.push("mark");
                            if (this.tanim) {
                                let endX = this.timelineToCanvasPosition(this.tanim.length, 0)[0];
                                if (abs(this.mouseX - endX) <= 4) {
                                    this.hover.push("endTime");
                                }
                            }
                        }
                        else if (this.mouseY < top + 20 + 20) {
                            this.hover.push("ruler");
                        }
                        else if (this.mouseY > bottom - 25) {
                            if (this.mouseX < left + 25) {
                                this.hover.push("scrollLeft");
                            }
                            else if (right - 25 < this.mouseX) {
                                this.hover.push("scrollRight");
                            }
                            else {
                                this.hover.push("scrollX");
                            }
                        }
                        else if (this.mouseX < left + 25 || right - 25 < this.mouseX) {
                            this.hover.push("sideRuler");
                        }
                        else {
                            this.hover.push("main");
                            let timelineHover = this.checkTimelineHover(this.mainAxis) ?? this.checkTimelineHover(this.subAxis);
                            if (!timelineHover)
                                return;
                            if (timelineHover[0] == "tValueCurve") {
                                this.hover.push(...timelineHover);
                            }
                            else if (timelineHover[0] == "handle") {
                                this.hover.push("handle");
                                this.hoveredHandle = timelineHover[1];
                            }
                            else if (timelineHover[0] == "keyframe") {
                                this.hover.push("keyframe");
                                this.hoveredKeyframes.add(timelineHover[1]);
                                this.cursor = this.selectedKeyframes.has(timelineHover[1]) && !event?.shiftKey ? "grab" : "pointer";
                            }
                        }
                    }
                }
                else if (0 < this.mouseX && this.mouseX < this.leftBarWidth &&
                    this.mouseY < this.canvasHeight - 50) {
                    if (this.canvasHeight - 50 - 30 < this.mouseY) {
                        if (this.mouseX <= 30) {
                            if (this.commandStack.isCanUndo) {
                                this.hover.push("undo");
                                this.cursor = "pointer";
                            }
                        }
                        else if (this.mouseX <= 2 * 30) {
                            if (this.commandStack.isCanRedo) {
                                this.hover.push("redo");
                                this.cursor = "pointer";
                            }
                        }
                    }
                    else {
                        this.hover.push("tValueNameBar");
                        if (!this.tanim)
                            return;
                        let idx = floor((this.mouseY - 30) / 60 + this.TUIScroll);
                        if (0 <= idx && idx <= this.tValueNames.length) {
                            this.hover.push("tui", idx);
                            this.cursor = "pointer";
                        }
                    }
                }
            }
        }
        checkTimelineHover(timelineIndex) {
            let timeline = this.timelines[timelineIndex];
            if (!timeline)
                return null;
            if (this.isShowHandle) {
                for (let i = 0; i < timeline.keyframes.length; i++) {
                    let handleInfo = this.getHandleInfo(timeline, i);
                    if (!handleInfo)
                        continue;
                    if (handleInfo.type == "power" ||
                        handleInfo.type == "exp" ||
                        handleInfo.type == "elastic" ||
                        handleInfo.type == "back" ||
                        handleInfo.type == "tradExp" ||
                        handleInfo.type == "lagrange") {
                        let { keyframe, cx, cy } = handleInfo;
                        let distance = sqrt((cx - this.mouseX) ** 2 + (cy - this.mouseY) ** 2);
                        let type;
                        switch (handleInfo.type) {
                            case "power":
                                type = "powerN";
                                break;
                            case "exp":
                                type = "expN";
                                break;
                            case "elastic":
                                type = "elastic";
                                break;
                            case "back":
                                type = "backS";
                                break;
                            case "tradExp":
                                type = "tradExpV";
                                break;
                            case "lagrange":
                                type = "lagrangeC";
                                break;
                        }
                        if (distance <= 5 + 4) {
                            return ["handle", { timeline, keyframe, keyframeIndex: i, type }];
                        }
                    }
                    else if (handleInfo.type == "bezier") {
                        let { keyframe, rightKeyframe } = handleInfo;
                        let bezierHandleType = keyframe.getParam("bezierHandleType");
                        if (bezierHandleType == "aligned" || bezierHandleType == "free") {
                            let { cx1, cy1 } = handleInfo;
                            let distance = sqrt((cx1 - this.mouseX) ** 2 + (cy1 - this.mouseY) ** 2);
                            if (distance <= 5 + 4) {
                                return ["handle", { timeline, keyframe, keyframeIndex: i, type: "bezierC1" }];
                            }
                        }
                        bezierHandleType = rightKeyframe.getParam("bezierHandleType");
                        if (bezierHandleType == "aligned" || bezierHandleType == "free") {
                            let { cx2, cy2 } = handleInfo;
                            let distance = sqrt((cx2 - this.mouseX) ** 2 + (cy2 - this.mouseY) ** 2);
                            if (distance <= 5 + 4) {
                                return ["handle", { timeline, keyframe, keyframeIndex: i, type: "bezierC2" }];
                            }
                        }
                    }
                }
            }
            let mouseTime = round(this.mouseTimelineX);
            let mouseTValue = safeTValue(timeline.getTValueByFrame(mouseTime), timeline.tValueType);
            let [curveX, curveY] = this.timelineToCanvasPosition(mouseTime, mouseTValue);
            let mostCloseKeyframe = null;
            let mostCloseDistance = Infinity;
            for (let keyframe of timeline.keyframes) {
                let [keyframeX, keyframeY] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                let distance = abs(keyframeX - this.mouseX) + abs(keyframeY - this.mouseY);
                if (distance <= min(10 + 2, mostCloseDistance)) {
                    mostCloseKeyframe = keyframe;
                    mostCloseDistance = distance;
                }
            }
            if (mostCloseKeyframe)
                return ["keyframe", mostCloseKeyframe];
            if (abs(curveX - this.mouseX) + abs(curveY - this.mouseY) <= 10 + 2) {
                return ["tValueCurve", timelineIndex];
            }
            return null;
        }
        getBoxSelectKeyframes(x1, y1, x2, y2) {
            let results = new Set();
            let keyframes = [];
            if (this.timelines[0])
                keyframes.push(...this.timelines[0].keyframes);
            if (this.timelines[1])
                keyframes.push(...this.timelines[1].keyframes);
            let bx = (x1 + x2) / 2;
            let by = (y1 + y2) / 2;
            let bw = (abs(x1 - x2) + 10) / 2 + 1;
            let bh = (abs(y1 - y2) + 10) / 2 + 1;
            for (let keyframe of keyframes) {
                let { x: kx, y: ky } = keyframe;
                let [x, y] = this.timelineToCanvasPosition(kx, ky);
                if (abs(bx - x) <= bw && (typeof y == "string" || abs(by - y) <= bh)) {
                    results.add(keyframe);
                }
            }
            return results;
        }
        doMouse(mouseState, event = null, hover = null) {
            hover ?? (hover = this.hover);
            if (hover[0] == "header") {
                if (hover[1] === undefined) {
                    if (mouseState == 2) {
                        this.mouseDragType = 1;
                        this.mouseDragTop = this.top;
                        this.mouseDragLeft = this.left;
                    }
                }
                else if (hover[1] == "close") {
                    if (mouseState == 3) {
                        this.isShow = false;
                        this.root.style.display = "none";
                        return;
                    }
                }
                else if (hover[1] == "minimize") {
                    if (mouseState == 3) {
                        this.isMinimized = !this.isMinimized;
                        if (this.isMinimized) {
                            this.canvasWidth = 240;
                            this.canvasHeight = 30;
                            this.mouseX += this.width - this.canvasWidth;
                        }
                        else {
                            this.mouseX -= this.width - this.canvasWidth;
                            this.canvasWidth = this.width;
                            this.canvasHeight = this.height;
                            this.left = clamp(this.left, 5, window.innerWidth - this.canvasWidth - 5);
                            this.top = clamp(this.top, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
                        }
                        this.setCanvasSize(this.canvasWidth, this.canvasHeight);
                        this.setPosition();
                        this.updateCuis();
                        this.updatePuis();
                        this.updateHoverAndCursor(event);
                    }
                }
            }
            else if (hover[0] == "border") {
                if (hover[1] == "rb") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 4;
                    this.mouseDragWidth = this.width;
                    this.mouseDragHeight = this.height;
                }
                else if (hover[1] == "r") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 2;
                    this.mouseDragWidth = this.width;
                }
                else if (hover[1] == "b") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 3;
                    this.mouseDragHeight = this.height;
                }
            }
            else if (hover[0] == "innerBorder") {
                if (hover[1] == "l") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 5;
                    this.mouseDragWidth = this.leftBarWidth;
                }
                else if (hover[1] == "r") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 7;
                    this.mouseDragWidth = this.rightBarWidth;
                }
                else if (hover[1] == "b") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 6;
                    this.mouseDragHeight = this.timelineBarHeight;
                }
                else if (hover[1] == "layer") {
                    if (mouseState != 2)
                        return;
                    this.mouseDragType = 8;
                    this.mouseDragHeight = this.layerBarHeight;
                }
            }
            else if (hover[0] == "newTanim") {
                if (mouseState != 3)
                    return;
                if (this.askAndCreateNewTanim())
                    return true;
                this.updateTanimTree();
            }
            else if (hover[0] == "tanimList") {
                if (hover[1] == this.tanimTree.length) {
                    if (mouseState != 8)
                        return;
                    if (this.askAndCreateNewTanim())
                        return true;
                    this.updateTanimTree();
                }
                else if (typeof hover[1] == "number") {
                    let hoverItem = this.tanimTree[hover[1]];
                    switch (hoverItem.type) {
                        case 0:
                            if (!hoverItem.tanim)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2) {
                                        this.mouseDragType = 9;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 8) {
                                        this.removeAllLayers();
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 3:
                                    if (mouseState == 3) {
                                        this.removeAllLayers();
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 4:
                                    if (mouseState == 3) {
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 2:
                                    if (mouseState == 3) {
                                        let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        let copy = TheTanimManager.getCopiedTanim(hoverItem.tanim);
                                        if (!copy)
                                            break;
                                        TheTanimManager.tanims.splice(idx + 1, 0, copy);
                                        saveData();
                                        this.updateTanimTree();
                                    }
                                    break;
                                case 6:
                                    if (mouseState == 3) {
                                        if (this.askAndRenameTanim(hoverItem.tanim))
                                            return;
                                    }
                                    break;
                                case 7:
                                    if (mouseState == 3) {
                                        if (!this.confirm(getTranslate("CQET_eDeleteTanimQuestion").replace("[tanimName]", hoverItem.tanim.name)))
                                            break;
                                        let idx = TheTanimManager.tanims.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        if (this.layers.includes(hoverItem.tanim))
                                            this.removeLayer(this.layers.indexOf(hoverItem.tanim));
                                        this.recycleBin.push(hoverItem.tanim);
                                        TheTanimManager.tanims.splice(idx, 1);
                                        saveData();
                                        this.updateTanimTree();
                                    }
                                    break;
                            }
                            break;
                        case 1:
                        case 2:
                        case 3:
                            let tanims = TheTanimManager.getTanimsByPrefix(hoverItem.dir.join("//") + "//");
                            if (tanims.length == 0)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2 &&
                                        hoverItem.type == 3) {
                                        this.mouseDragType = 9;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 8) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 3:
                                    if (mouseState == 3) {
                                        this.layers.length = 0;
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 4:
                                    if (mouseState == 3) {
                                        this.addToLayer(hoverItem);
                                    }
                                    break;
                                case 1:
                                    if (mouseState == 3) {
                                        if (this.askAndCreateNewTanimInFolder(hoverItem.dir))
                                            return true;
                                    }
                                    break;
                                case 6:
                                    if (mouseState == 3) {
                                        this.askAndRenameFolder(tanims, hoverItem.dir);
                                    }
                                    break;
                                case 8:
                                case 9:
                                    if (mouseState == 3) {
                                        this.foldedTanimFolders.add(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 10:
                                    if (mouseState == 3) {
                                        this.foldedTanimFolders.delete(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
            else if (hover[0] == "layerList") {
                if (typeof hover[1] == "number" && hover[1] < this.layerTree.length) {
                    let hoverItem = this.layerTree[hover[1]];
                    switch (hoverItem.type) {
                        case 0:
                            if (!hoverItem.tanim)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2) {
                                        this.mouseDragType = 10;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    else if (mouseState == 3) {
                                        this.editTanim(hoverItem.tanim);
                                    }
                                    break;
                                case 5:
                                    if (mouseState == 3) {
                                        let idx = this.layers.indexOf(hoverItem.tanim);
                                        if (idx == -1)
                                            break;
                                        this.removeLayer(idx);
                                    }
                                    break;
                            }
                            break;
                        case 1:
                        case 2:
                        case 3:
                            let tanims = this.layers.filter(tanim => tanim.name.startsWith(hoverItem.dir.join("//")));
                            if (tanims.length == 0)
                                break;
                            switch (hover[2]) {
                                case 0:
                                    if (mouseState == 2 &&
                                        hoverItem.type == 3) {
                                        this.mouseDragType = 10;
                                        this.mouseDragIndex = hover[1];
                                    }
                                    break;
                                case 5:
                                    if (mouseState == 3) {
                                        for (let tanim of tanims) {
                                            let idx = this.layers.indexOf(tanim);
                                            if (idx == -1)
                                                continue;
                                            this.removeLayer(idx, false);
                                        }
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 8:
                                case 9:
                                    if (mouseState == 3) {
                                        this.foldedLayerFolders.add(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                                case 10:
                                    if (mouseState == 3) {
                                        this.foldedLayerFolders.delete(hoverItem.dir.join("//"));
                                        this.updateTanimTree();
                                        this.updateLayerTree();
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
            else if (hover[0] == "keyframeBar") {
                if (hover[1] === undefined)
                    return;
                let tanim = this.tanim;
                if (!tanim)
                    return;
                if (this.selectedKeyframes.size !== 1)
                    return;
                let [keyframe] = this.selectedKeyframes;
                let timeline = this.timelines[0]?.keyframes.includes(keyframe) ? this.timelines[0] : this.timelines[1]?.keyframes.includes(keyframe) ? this.timelines[1] : null;
                if (!timeline)
                    return;
                let editor = this;
                let kuiType = hover[1];
                let keyframeIndex = timeline.keyframes.indexOf(keyframe);
                if (keyframeIndex == -1)
                    return;
                switch (kuiType) {
                    case 3:
                    case 4:
                        let editTimeQuestion = getTranslate(kuiType == 3 ? "CQET_eInputKeyframeSecQuestion" : "CQET_eInputKeyframeFrameQuestion");
                        let editTimeFPS = kuiType == 3 ? tanim.fps : 1;
                        if (mouseState == 3) {
                            if (this.ask(editTimeQuestion, `${keyframe.x / editTimeFPS}`, answer => {
                                if (!answer)
                                    return;
                                let num = parseFloat(answer);
                                if (Number.isNaN(num))
                                    return;
                                let frame = round(num * editTimeFPS);
                                if (frame === keyframe.x * editTimeFPS)
                                    return;
                                let newKeyframe = keyframe.getCopy();
                                newKeyframe.x = frame;
                                editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                            }))
                                return true;
                        }
                        break;
                    case 5:
                        if (mouseState == 3) {
                            if (this.ask(getTranslate("CQET_eInputKeyframeTValueQuestion"), `${keyframe.y}`, answer => {
                                if (!answer)
                                    return;
                                let num = parseFloat(answer);
                                let tValue = `${num}` === answer ? num : answer;
                                let newKeyframe = keyframe.getCopy();
                                newKeyframe.y = tValue;
                                editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                            }))
                                return true;
                        }
                        break;
                    case 6:
                        if (mouseState == 3) {
                            this.kuiState = this.kuiState == 0 ? 1 : 0;
                            this.updateKuis();
                        }
                        break;
                    case 7:
                        if (mouseState == 3) {
                            this.kuiState = 0;
                            let interType = hover[2];
                            let newKeyframe = new Keyframe(keyframe.x, keyframe.y, interType);
                            let easeType = keyframe.params?.["easeType"];
                            if (easeType)
                                newKeyframe.setParam("easeType", easeType);
                            let bezierHandleType = keyframe.params?.["bezierHandleType"];
                            if (bezierHandleType)
                                newKeyframe.setParam("bezierHandleType", bezierHandleType);
                            this.commandStack.PushAndDo(new EditAKeyframeCommand(this, timeline, keyframe, newKeyframe));
                        }
                        break;
                    case 8:
                        let paramType = hover[2];
                        if (mouseState == 3) {
                            if (this.ask(getTranslate(InputEaseParamQuestionStrings[paramType]), `${keyframe.getParam(paramType)}`, answer => {
                                if (!answer)
                                    return;
                                let paramValue = parseFloat(answer);
                                if (Number.isNaN(paramValue))
                                    return;
                                let newKeyframe = keyframe.getCopy();
                                newKeyframe.setParam(paramType, paramValue);
                                editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                            }))
                                return true;
                        }
                        break;
                    case 9:
                        let tradExpVM = (1 / keyframe.getParam("tradExpV"));
                        if (mouseState == 3) {
                            if (this.ask(getTranslate("CQET_eInputTradExpVMQuestion"), `${tradExpVM}`, answer => {
                                if (!answer)
                                    return;
                                let tradExpVM = parseFloat(answer);
                                if (Number.isNaN(tradExpVM) || tradExpVM == 0)
                                    return;
                                let tradExpV = 1 / tradExpVM;
                                let newKeyframe = keyframe.getCopy();
                                newKeyframe.setParam("tradExpV", tradExpV);
                                editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                            }))
                                return true;
                        }
                        break;
                    case 11:
                        if (mouseState == 3) {
                            if (this.ask(getTranslate("CQET_eInputLagrangeCXSecQuestion"), `${keyframe.x / tanim.fps}`, answer => {
                                if (!answer)
                                    return;
                                let num = parseFloat(answer);
                                if (Number.isNaN(num))
                                    return;
                                let lagrangeCX = num * tanim.fps;
                                let newKeyframe = keyframe.getCopy();
                                newKeyframe.setParam("lagrangeCX", lagrangeCX);
                                editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                            }))
                                return true;
                        }
                        break;
                    case 10:
                        let paramRadioType = hover[2];
                        let paramRadioValue = hover[3];
                        if (mouseState == 3) {
                            let newKeyframe = keyframe.getCopy();
                            newKeyframe.setParam(paramRadioType, paramRadioValue);
                            editor.commandStack.PushAndDo(new EditAKeyframeCommand(editor, timeline, keyframe, newKeyframe));
                        }
                        break;
                }
            }
            else if (hover[0] == "controlBar") {
                if (hover[1] === undefined)
                    return;
                switch (hover[1]) {
                    case 8:
                        if (!this.tanim)
                            return;
                        if (mouseState == 2) {
                            this.isPlaying = !this.isPlaying;
                            if (this.isPlaying) {
                                this.playTimestamp = Date.now();
                                requestAnimationFrame(this.playStep.bind(this));
                            }
                        }
                        break;
                    case 7:
                        if (mouseState == 2) {
                            this.focus(this.focusTime - 1);
                        }
                        break;
                    case 9:
                        if (mouseState == 2) {
                            this.focus(this.focusTime + 1);
                        }
                        break;
                    case 6:
                        if (mouseState == 2) {
                            let leftKeyframe = this.getLeftKeyframe()[0];
                            if (!leftKeyframe)
                                break;
                            this.focus(leftKeyframe.x);
                        }
                        break;
                    case 10:
                        if (mouseState == 2) {
                            let rightKeyframe = this.getRightKeyframe()[0];
                            if (!rightKeyframe)
                                break;
                            this.focus(rightKeyframe.x);
                        }
                        break;
                    case 5:
                        if (mouseState == 2) {
                            if (!this.tanim)
                                break;
                            this.focus(0);
                        }
                        break;
                    case 11:
                        if (mouseState == 2) {
                            if (!this.tanim)
                                break;
                            this.focus(this.tanim.length);
                        }
                        break;
                    case 12:
                        if (mouseState == 2) {
                            this.isLoop = !this.isLoop;
                        }
                        break;
                    case 13:
                        if (mouseState == 2) {
                            this.isYoyo = !this.isYoyo;
                        }
                        break;
                    case 2:
                        if (mouseState == 2) {
                            if (this.timelines[1]) {
                                this.mainAxis = this.mainAxis == 0 ? 1 : 0;
                            }
                        }
                        break;
                    case 1:
                        if (mouseState == 2) {
                            this.isShowHandle = !this.isShowHandle;
                        }
                        break;
                    case 3:
                        if (mouseState == 2) {
                            if (!this.tanim)
                                break;
                            let timeline = this.getNewKeyframeTimeline();
                            if (!timeline)
                                break;
                            let leftKeyframe = timeline.findLeftKeyframe(this.focusTime);
                            let keyframe = new Keyframe(this.focusTime, timeline.getTValueByFrame(this.focusTime), leftKeyframe?.interType ?? "linear");
                            let easeType = leftKeyframe?.params?.["easeType"];
                            if (easeType)
                                keyframe.setParam("easeType", easeType);
                            let bezierHandleType = leftKeyframe?.params?.["bezierHandleType"];
                            if (bezierHandleType)
                                keyframe.setParam("bezierHandleType", bezierHandleType);
                            this.commandStack.PushAndDo(new AddKeyframesCommand(this, this.tanim, new TKPair(timeline, keyframe)));
                            if (keyframe.interType == "bezier") {
                                let idx = timeline.keyframes.indexOf(keyframe);
                                this.alignBezier(timeline.keyframes[idx - 1] ?? null, keyframe, timeline.keyframes[idx + 1] ?? null, "auto");
                            }
                        }
                        break;
                    case 4:
                        if (mouseState == 2) {
                            let pairs = this.getDeletePairs();
                            if (!pairs)
                                break;
                            this.commandStack.PushAndDo(new RemoveKeyframesCommand(this, ...pairs));
                        }
                        break;
                    case 14:
                        if (!this.tanim)
                            return;
                        if (mouseState == 2) {
                            if (this.marks[this.focusTime]) {
                                if (this.confirm(getTranslate("CQET_eDeleteMarkQuestion").replace("[markName]", this.marks[this.focusTime]))) {
                                    delete this.marks[this.focusTime];
                                    saveData();
                                }
                            }
                            else {
                                if (this.ask(getTranslate("CQET_eNewMarkQuestion"), null, answer => {
                                    if (answer) {
                                        this.marks[this.focusTime] = answer;
                                        saveData();
                                    }
                                }))
                                    return true;
                            }
                        }
                        break;
                }
            }
            else if (hover[0] == "timeline") {
                if (!this.tanim)
                    return;
                let dScale = event?.altKey ? 4 : 1;
                let dScroll = 40;
                if (event?.altKey)
                    dScroll *= 4;
                if (mouseState == 6 || mouseState == 4) {
                    this.mouseDragType = 11;
                    this.mouseDragX = this.mouseX;
                    this.mouseDragY = this.mouseY;
                    return;
                }
                switch (hover[1]) {
                    case "main":
                        if (hover[2] == "tValueCurve" && this.timelines[hover[3]]) {
                            if (mouseState == 2) {
                                let timeline = this.timelines[hover[3]];
                                let time = round(this.mouseTimelineX);
                                let tValue = timeline.getTValueByFrame(time);
                                let leftKeyframe = timeline.findLeftKeyframe(time);
                                let keyframe = new Keyframe(time, tValue, leftKeyframe?.interType ?? "linear");
                                let easeType = leftKeyframe?.params?.["easeType"];
                                if (easeType)
                                    keyframe.setParam("easeType", easeType);
                                let bezierHandleType = leftKeyframe?.params?.["bezierHandleType"];
                                if (bezierHandleType)
                                    keyframe.setParam("bezierHandleType", bezierHandleType);
                                this.commandStack.PushAndDo(new AddKeyframesCommand(this, this.tanim, new TKPair(timeline, keyframe)));
                                if (keyframe.interType == "bezier") {
                                    let idx = timeline.keyframes.indexOf(keyframe);
                                    this.alignBezier(timeline.keyframes[idx - 1] ?? null, keyframe, timeline.keyframes[idx + 1] ?? null, "auto");
                                }
                                if (event?.shiftKey) {
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, keyframe));
                                }
                                else {
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this, keyframe));
                                }
                                this.focus(time, false);
                                this.mouseDragType = 13;
                                this.mouseDragX = time;
                                this.mouseDragY = this.canvasTotimelinePosition(0, this.timelineToCanvasPosition(0, tValue)[1])[1];
                                this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                            }
                            break;
                        }
                        if (hover[2] == "handle" && this.hoveredHandle) {
                            if (mouseState == 2) {
                                let { timeline, keyframe } = this.hoveredHandle;
                                this.mouseDragType = 14;
                                this.mouseDragHandle = this.hoveredHandle;
                                this.mouseDragX = this.mouseTimelineX;
                                this.mouseDragY = this.mouseTimelineY;
                                this.commandStack.PushAndDo(new EditAKeyframeCommand(this, timeline, keyframe, keyframe.getCopy()));
                            }
                        }
                        if (hover[2] == "keyframe" && this.hoveredKeyframes.size == 1) {
                            if (mouseState == 2) {
                                let [hoveredKeyframe] = this.hoveredKeyframes;
                                if (this.selectedKeyframes.has(hoveredKeyframe)) {
                                    if (event?.shiftKey) {
                                        let newSelect = new Set(this.selectedKeyframes);
                                        newSelect.delete(hoveredKeyframe);
                                        this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...newSelect));
                                    }
                                }
                                else {
                                    if (!event?.shiftKey) {
                                        this.commandStack.PushAndDo(new SelectKeyframesCommand(this, hoveredKeyframe));
                                    }
                                    else {
                                        this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, hoveredKeyframe));
                                    }
                                }
                                this.mouseDragType = 13;
                                this.mouseDragX = this.mouseTimelineX;
                                this.mouseDragY = this.mouseTimelineY;
                                this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                                break;
                            }
                        }
                        if (hover[2] === undefined) {
                            if (mouseState == 2) {
                                if (!event?.shiftKey) {
                                    this.commandStack.PushAndDo(new SelectKeyframesCommand(this));
                                }
                                this.mouseDragType = 15;
                                this.mouseDragX = this.mouseTimelineX;
                                this.mouseDragY = this.mouseTimelineY;
                            }
                        }
                        break;
                    case "mark":
                    case "ruler":
                        if (hover[2] == "endTime") {
                            this.cursor = "ew-resize";
                            if (mouseState == 2) {
                                this.mouseDragType = 16;
                            }
                        }
                        else {
                            if (mouseState == 2) {
                                this.focus(this.mouseTimelineX);
                            }
                        }
                        break;
                    case "sideRuler":
                        break;
                    case "scrollLeft":
                    case "scrollRight":
                        if (mouseState == 2) {
                            this.scrollTimeline((hover[1] == "scrollRight" ? 1 : -1) * dScroll / this.timelineScaleX, 0);
                            break;
                        }
                    case "scrollX":
                        if (mouseState == 2) {
                            let length = this.tanim.length;
                            let blockStart = this.canvasTotimelinePosition(this.leftBarWidth, 0)[0];
                            let blockEnd = this.canvasTotimelinePosition(this.canvasWidth - this.rightBarWidth, 0)[0];
                            let mouseTime = this.scrollXToTime(this.mouseX, 0, length);
                            if (mouseTime < blockStart)
                                this.scrollTimeline(mouseTime - blockStart, 0);
                            if (blockEnd < mouseTime)
                                this.scrollTimeline(mouseTime - blockEnd, 0);
                            this.mouseDragType = 12;
                            this.mouseDragX = this.mouseX;
                            break;
                        }
                }
            }
            else if (hover[0] == "tValueNameBar") {
                if (!this.tanim)
                    return;
                if (hover[1] == "tui") {
                    if (mouseState == 3) {
                        if (hover[2] == this.tValueNames.length) {
                            let editor = this;
                            if (this.ask(getTranslate("CQET_eNewTValueTypeQuestion"), this.tanim.getSafeTValueType(getTranslate("CQET_eDefaultTValueTypeName")), answer => {
                                if (answer === null)
                                    return;
                                if (!editor.tanim)
                                    return;
                                let newTValueName = editor.tanim.getSafeTValueType(answer);
                                editor.commandStack.PushAndDo(new AddTimelineCommand(editor, editor.tanim, new Timeline(newTValueName, [])));
                            }))
                                return true;
                        }
                        else {
                            let tValueName = this.tValueNames[hover[2]];
                            if (tValueName !== undefined)
                                this.editTValueName(tValueName);
                        }
                    }
                }
            }
            else if (hover[0] == "undo") {
                if (mouseState == 3)
                    this.commandStack.undo();
            }
            else if (hover[0] == "redo") {
                if (mouseState == 3)
                    this.commandStack.redo();
            }
            else if (hover[0] == "preview") {
                if (!this.tanim)
                    return;
                if (hover[1] == "pui") {
                    let editor = this;
                    let costumeNameIndex;
                    let costumeNameQuestionStrings;
                    switch (hover[2]) {
                        case 1:
                            if (mouseState == 3) {
                                if (this.ask(getTranslate("CQET_ePUISpriteNameQuestion"), this.getSpriteName(this.tanim), answer => {
                                    if (answer === null)
                                        return;
                                    editor.setSpriteName(editor.tanim, answer);
                                    saveData();
                                }))
                                    return;
                            }
                            break;
                        case 2:
                            costumeNameIndex ?? (costumeNameIndex = 0);
                            costumeNameQuestionStrings ?? (costumeNameQuestionStrings = "CQET_ePUICostumeName0Question");
                        case 3:
                            costumeNameIndex ?? (costumeNameIndex = 1);
                            costumeNameQuestionStrings ?? (costumeNameQuestionStrings = "CQET_ePUICostumeName1Question");
                        case 4:
                            costumeNameIndex ?? (costumeNameIndex = 2);
                            costumeNameQuestionStrings ?? (costumeNameQuestionStrings = "CQET_ePUICostumeName2Question");
                            let costumeNames = this.getCostumeNames(this.tanim);
                            if (mouseState == 3) {
                                if (this.ask(getTranslate(costumeNameQuestionStrings), costumeNames[costumeNameIndex], answer => {
                                    if (answer === null)
                                        return;
                                    costumeNames[costumeNameIndex] = answer;
                                    saveData();
                                }))
                                    return;
                            }
                            break;
                        case 5:
                            if (mouseState == 2) {
                                this.zoomCamera(0.5);
                            }
                            break;
                        case 6:
                            if (mouseState == 2) {
                                this.zoomCamera(-0.5);
                            }
                            break;
                        case 7:
                            if (mouseState == 2) {
                                this.previewCameraX = 0;
                                this.previewCameraY = 0;
                                this.previewCameraSPow = 0;
                            }
                            break;
                    }
                }
                else if (hover[1] === undefined) {
                    if (mouseState == 6) {
                        this.mouseDragType = 17;
                        this.mouseDragX = this.mouseX;
                        this.mouseDragY = this.mouseY;
                    }
                }
            }
        }
        doWheel(wheel, event = null, hover = null) {
            hover ?? (hover = this.hover);
            if (hover[0] == "tanimScroll") {
                if (wheel < 0) {
                    this.scrollTanimList(-5);
                }
                if (wheel > 0) {
                    this.scrollTanimList(5);
                }
            }
            else if (hover[0] == "tanimList") {
                if (wheel < 0) {
                    this.scrollTanimList(-2);
                }
                if (wheel > 0) {
                    this.scrollTanimList(2);
                }
            }
            else if (hover[0] == "layerScroll") {
                if (wheel < 0) {
                    this.scrollLayerList(-5);
                }
                if (wheel > 0) {
                    this.scrollLayerList(5);
                }
            }
            else if (hover[0] == "layerList") {
                if (wheel < 0) {
                    this.scrollLayerList(-2);
                }
                if (wheel > 0) {
                    this.scrollLayerList(2);
                }
            }
            else if (hover[0] == "timeline") {
                if (!this.tanim)
                    return;
                let dScale = event?.altKey ? 4 : 1;
                let dScroll = 40;
                if (event?.altKey)
                    dScroll *= 4;
                let isScrolledOrScaled = false;
                switch (hover[1]) {
                    case "main":
                        if (wheel != 0) {
                            if (event?.ctrlKey) {
                                if (wheel < 0) {
                                    let n = min(dScale, 30 - this.timelineScalePowX, 40 - this.timelineScalePowY);
                                    this.scaleTimelineX(n);
                                    this.scaleTimelineY(n);
                                    isScrolledOrScaled = true;
                                }
                                if (wheel > 0) {
                                    let n = max(-dScale, -30 - this.timelineScalePowX, -20 - this.timelineScalePowY);
                                    this.scaleTimelineX(n);
                                    this.scaleTimelineY(n);
                                    isScrolledOrScaled = true;
                                }
                            }
                            else if (event?.shiftKey) {
                                this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                                isScrolledOrScaled = true;
                            }
                            else {
                                this.scrollTimeline(0, -sign(wheel) * dScroll / this.timelineScaleY);
                                isScrolledOrScaled = true;
                            }
                        }
                        break;
                    case "mark":
                    case "ruler":
                        if (wheel < 0) {
                            this.scaleTimelineX(dScale);
                            isScrolledOrScaled = true;
                        }
                        if (wheel > 0) {
                            this.scaleTimelineX(-dScale);
                            isScrolledOrScaled = true;
                        }
                        break;
                    case "sideRuler":
                        if (wheel < 0) {
                            this.scaleTimelineY(dScale);
                            isScrolledOrScaled = true;
                        }
                        if (wheel > 0) {
                            this.scaleTimelineY(-dScale);
                            isScrolledOrScaled = true;
                        }
                        break;
                    case "scrollX":
                        if (wheel != 0) {
                            this.scrollTimeline(sign(wheel) * dScroll / this.timelineScaleX, 0);
                            isScrolledOrScaled = true;
                            break;
                        }
                }
                if (isScrolledOrScaled) {
                    this.updateMouseTimelinePosition();
                    this.updateHoverAndCursor(event);
                }
            }
            else if (hover[0] == "tValueNameBar") {
                if (wheel < 0) {
                    this.scrollTUIBar(-0.5);
                }
                if (wheel > 0) {
                    this.scrollTUIBar(0.5);
                }
            }
            else if (hover[0] == "preview") {
                if (!this.tanim)
                    return;
                if (wheel == 0)
                    return;
                let dScroll = 30 * sign(wheel) / this.previewCameraS;
                let dZoom = 0.25 * sign(wheel);
                if (event?.altKey) {
                    dScroll *= 4;
                    dZoom *= 4;
                }
                if (event?.ctrlKey) {
                    this.zoomCamera(-dZoom);
                }
                else if (event?.shiftKey) {
                    this.previewCameraX += dScroll;
                    this.updateMouseStagePosition();
                }
                else {
                    this.previewCameraY -= dScroll;
                    this.updateMouseStagePosition();
                }
            }
        }
        doMouseDragStop(mouseState, event = null, hover = null) {
            hover ?? (hover = this.hover);
            if (mouseState == 3 || mouseState == 5 || mouseState == 7) {
                if (this.mouseDragType == 9) {
                    if (this.hover[0] == "tanimList" && typeof this.hover[1] == "number") {
                        this.dropTanimToTanims(this.mouseDragIndex, this.hover[1]);
                    }
                    else if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                        this.dropTanimToLayers(this.mouseDragIndex, this.hover[1]);
                    }
                }
                else if (this.mouseDragType == 10) {
                    if (this.hover[0] == "layerList" && typeof this.hover[1] == "number") {
                        if (this.mouseDragIndex === this.hover[1] && this.layerTree[this.hover[1]].tanim) {
                            if (this.doMouse(mouseState, event))
                                return;
                        }
                        else {
                            this.dropLayerToLayers(this.mouseDragIndex, this.hover[1]);
                        }
                    }
                }
                else if (this.mouseDragType == 15) {
                    if (!event?.shiftKey) {
                        this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.hoveredKeyframes));
                    }
                    else {
                        this.commandStack.PushAndDo(new SelectKeyframesCommand(this, ...this.selectedKeyframes, ...this.hoveredKeyframes));
                    }
                }
                this.mouseDragType = 0;
                this.updateHoverAndCursor(event);
            }
        }
        getLeftKeyframe() {
            let f = this.timelines.map(timeline => timeline?.findLeftKeyframe(this.focusTime, false));
            if (f[0] && f[1]) {
                if (f[0].x == f[1].x)
                    return [f[this.mainAxis], this.timelines[this.mainAxis]];
                return f[0].x > f[1].x ? [f[0], this.timelines[0]] : [f[1], this.timelines[1]];
            }
            else {
                return f[0] ? [f[0], this.timelines[0]] : f[1] ? [f[1], this.timelines[1]] : [null, null];
            }
        }
        getRightKeyframe() {
            let f = this.timelines.map(timeline => timeline?.findRightKeyframe(this.focusTime, false));
            if (f[0] && f[1]) {
                if (f[0].x == f[1].x)
                    return [f[this.mainAxis], this.timelines[this.mainAxis]];
                return f[0].x < f[1].x ? [f[0], this.timelines[0]] : [f[1], this.timelines[1]];
            }
            else {
                return f[0] ? [f[0], this.timelines[0]] : f[1] ? [f[1], this.timelines[1]] : [null, null];
            }
        }
        getNewKeyframeTimeline() {
            if (this.timelines[this.mainAxis] && !this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.mainAxis];
            }
            else if (this.timelines[this.subAxis] && !this.timelines[this.subAxis].findKeyframeByTime(this.focusTime)) {
                return this.timelines[this.subAxis];
            }
            else
                return null;
        }
        getDeletePairs() {
            if (this.selectedKeyframes.size == 0) {
                if (this.timelines[this.mainAxis]) {
                    let keyframe = this.timelines[this.mainAxis].findKeyframeByTime(this.focusTime);
                    if (keyframe)
                        return toTKPairs(this.timelines, keyframe);
                }
                if (this.timelines[this.subAxis]) {
                    let keyframe = this.timelines[this.subAxis].findKeyframeByTime(this.focusTime);
                    if (keyframe)
                        return toTKPairs(this.timelines, keyframe);
                }
                return null;
            }
            else {
                return toTKPairs(this.timelines, ...this.selectedKeyframes);
            }
        }
        update(events) {
            if (this.isInputing)
                return;
            if (!this.isShow)
                return;
            if (!this.isMouseOnRoot && this.mouseDragType == 0 && !this.isPlaying)
                return;
            let { mouseEvent, wheelEvent, keyboardEvent } = events ?? {};
            if (keyboardEvent?.repeat)
                return;
            if (wheelEvent)
                wheelEvent.preventDefault();
            if (mouseEvent) {
                this.mouseClientX = mouseEvent.clientX;
                this.mouseClientY = mouseEvent.clientY;
            }
            let event = mouseEvent ?? wheelEvent ?? keyboardEvent;
            let mouseState = 1;
            if (mouseEvent) {
                switch (mouseEvent.type) {
                    case "mousemove":
                        mouseState = 1;
                        break;
                    case "mousedown":
                        switch (mouseEvent.button) {
                            case 0:
                                mouseState = 2;
                                break;
                            case 1:
                                mouseState = 6;
                                break;
                            case 2:
                                mouseState = 4;
                                break;
                        }
                        if (this.mouseDragType == 0 && mouseState != 1) {
                            this.mouseDragClientX = this.mouseClientX;
                            this.mouseDragClientY = this.mouseClientY;
                        }
                        break;
                    case "mouseup":
                        switch (mouseEvent.button) {
                            case 0:
                                mouseState = 3;
                                break;
                            case 1:
                                mouseState = 7;
                                break;
                            case 2:
                                mouseState = 5;
                                break;
                        }
                        break;
                    case "dblclick":
                        mouseState = 8;
                        break;
                    default:
                        mouseState = 1;
                        break;
                }
            }
            let ctx = this.ctx;
            if (this.isMinimized) {
                this.canvasWidth = 240;
                this.canvasHeight = 30;
            }
            else {
                this.canvasWidth = this.width;
                this.canvasHeight = this.height;
            }
            this.updateMousePosition();
            let wheel = 0;
            if (wheelEvent) {
                wheel = wheelEvent.deltaY;
            }
            let lastCursor = this.cursor;
            this.updateHoverAndCursor(event);
            this.doWheel(wheel, event);
            if (this.mouseDragType == 0) {
                if (this.doMouse(mouseState, event))
                    return;
            }
            if (this.mouseDragType !== 0)
                switch (this.mouseDragType) {
                    case 1:
                    case 11:
                    case 17:
                        this.cursor = "move";
                        break;
                    case 2:
                    case 5:
                    case 7:
                        this.cursor = "ew-resize";
                        break;
                    case 3:
                    case 6:
                    case 8:
                        this.cursor = "ns-resize";
                        break;
                    case 4:
                        this.cursor = "nwse-resize";
                        break;
                    case 9:
                    case 10:
                        if (this.hover[0] == "tanimList" || this.hover[0] == "layerList") {
                            this.cursor = "grabbing";
                        }
                        else {
                            this.cursor = "no-drop";
                        }
                        break;
                    case 13:
                    case 14:
                        this.cursor = "none";
                        break;
                    default:
                        this.cursor = "default";
                        break;
                }
            if (this.mouseDragType == 9 || this.mouseDragType == 10) {
                mouseEvent?.preventDefault();
            }
            else if (this.mouseDragType == 1) {
                mouseEvent?.preventDefault();
                this.left = clamp(this.mouseDragLeft + this.mouseClientX - this.mouseDragClientX, 5 - this.width + this.canvasWidth, window.innerWidth - this.width - 5);
                this.top = clamp(this.mouseDragTop + this.mouseClientY - this.mouseDragClientY, isGandi ? 65 : 53, window.innerHeight - this.canvasHeight - 5);
                this.setPosition();
                saveData(false);
            }
            else if (this.mouseDragType == 5) {
                mouseEvent?.preventDefault();
                this.leftBarWidth = clamp(this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX, 60, min(200, this.canvasWidth - 480 - 180));
                let d = (this.leftBarWidth + this.rightBarWidth + 480) - this.canvasWidth;
                if (d > 0) {
                    this.rightBarWidth -= d;
                }
                this.updateStageCanvasSize();
                this.updateCuis();
                this.updatePuis();
                this.updateKuis();
                saveData(false);
            }
            else if (this.mouseDragType == 7) {
                mouseEvent?.preventDefault();
                this.rightBarWidth = clamp(this.mouseDragWidth + this.mouseDragClientX - this.mouseClientX, 180, this.canvasWidth - 480 - 60);
                let d = (this.leftBarWidth + this.rightBarWidth + 480) - this.canvasWidth;
                if (d > 0) {
                    this.leftBarWidth -= d;
                }
                this.updateStageCanvasSize();
                this.updateCuis();
                this.updatePuis();
                this.updateKuis();
                saveData(false);
            }
            else if (this.mouseDragType == 6) {
                mouseEvent?.preventDefault();
                this.timelineBarHeight = clamp(this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY, 90, this.canvasHeight - 50 - 50 - 120 - 30);
                this.updateStageCanvasSize();
                this.updatePuis();
                saveData(false);
            }
            else if (this.mouseDragType == 8) {
                mouseEvent?.preventDefault();
                this.layerBarHeight = clamp(this.mouseDragHeight + this.mouseDragClientY - this.mouseClientY, 70, this.canvasHeight - 50 - 240 - 130 - 30);
                saveData(false);
            }
            else if (this.mouseDragType == 11) {
                mouseEvent?.preventDefault();
                this.scrollTimeline((this.mouseDragX - this.mouseX) / this.timelineScaleX, -(this.mouseDragY - this.mouseY) / this.timelineScaleY);
                this.mouseDragX = this.mouseX;
                this.mouseDragY = this.mouseY;
            }
            else if (this.mouseDragType == 12) {
                mouseEvent?.preventDefault();
                if (this.tanim) {
                    let fromTime = this.scrollXToTime(this.mouseDragX, 0, this.tanim.length);
                    let toTime = this.scrollXToTime(this.mouseX, 0, this.tanim.length);
                    this.scrollTimeline(toTime - fromTime, 0);
                }
                this.mouseDragX = this.mouseX;
            }
            else if (this.mouseDragType == 13) {
                mouseEvent?.preventDefault();
                if (this.tanim) {
                    let command = this.commandStack.top;
                    if (!(command instanceof MoveKeyframesCommand)) {
                        this.commandStack.PushAndDo(new MoveKeyframesCommand(this, 0, 0, ...toTKPairs(this.timelines, ...this.selectedKeyframes)));
                        command = this.commandStack.top;
                    }
                    if (command instanceof MoveKeyframesCommand) {
                        let [x, y] = this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY);
                        let dx, dy;
                        let cdx = this.mouseX - x;
                        let cdy = this.mouseY - y;
                        let snapRange = 6;
                        if (false) {
                            dx = abs(cdx) <= snapRange ? 0 : this.canvasTotimelinePosition(this.mouseX - sign(cdx) * snapRange, 0)[0] - this.mouseDragX;
                            dy = abs(cdy) <= snapRange ? 0 : this.canvasTotimelinePosition(0, this.mouseY - sign(cdy) * snapRange)[1] - this.mouseDragY;
                        }
                        else if (false) {
                            dx = this.mouseTimelineX - this.mouseDragX;
                            dy = this.mouseTimelineY - this.mouseDragY;
                        }
                        else {
                            if (max(abs(cdx), abs(cdy)) <= snapRange) {
                                dx = dy = 0;
                            }
                            else {
                                dx = this.mouseTimelineX - this.mouseDragX;
                                dy = this.mouseTimelineY - this.mouseDragY;
                            }
                        }
                        if (event?.shiftKey) {
                            if (abs(dx * this.timelineScaleX) > abs(dy * this.timelineScaleY)) {
                                dy = 0;
                            }
                            else {
                                dx = 0;
                            }
                        }
                        command.updateMotion(dx, dy);
                    }
                }
            }
            else if (this.mouseDragType == 14) {
                mouseEvent?.preventDefault();
                if (this.tanim && this.mouseDragHandle) {
                    let command = this.commandStack.top;
                    if (command instanceof EditAKeyframeCommand) {
                        let [x, y] = this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY);
                        let dx, dy;
                        let cdx = this.mouseX - x;
                        let cdy = this.mouseY - y;
                        let snapRange = 6;
                        if (false) {
                            dx = abs(cdx) <= snapRange ? 0 : this.canvasTotimelinePosition(this.mouseX - sign(cdx) * snapRange, 0)[0] - this.mouseDragX;
                            dy = abs(cdy) <= snapRange ? 0 : this.canvasTotimelinePosition(0, this.mouseY - sign(cdy) * snapRange)[1] - this.mouseDragY;
                        }
                        else if (false) {
                            dx = this.mouseTimelineX - this.mouseDragX;
                            dy = this.mouseTimelineY - this.mouseDragY;
                        }
                        else {
                            if (max(abs(cdx), abs(cdy)) <= snapRange) {
                                dx = dy = 0;
                            }
                            else {
                                dx = this.mouseTimelineX - this.mouseDragX;
                                dy = this.mouseTimelineY - this.mouseDragY;
                            }
                        }
                        if (event?.shiftKey) {
                            if (abs(dx * this.timelineScaleX) > abs(dy * this.timelineScaleY)) {
                                dy = 0;
                            }
                            else {
                                dx = 0;
                            }
                        }
                        let { oldKeyframeCopy, newKeyframeCopy } = command;
                        let { timeline, keyframeIndex, type } = this.mouseDragHandle;
                        let rightKeyframe = timeline.keyframes[keyframeIndex + 1];
                        if (rightKeyframe && typeof newKeyframeCopy.y == "number" && typeof rightKeyframe.y == "number") {
                            let dy1y2 = newKeyframeCopy.y - rightKeyframe.y;
                            let easeType = newKeyframeCopy.getParam("easeType");
                            if (easeType == "easeOut" || easeType == "easeOutIn")
                                dy1y2 *= -1;
                            if (easeType == "easeInOut" || easeType == "easeOutIn")
                                dy1y2 *= 0.5;
                            if (type == "powerN") {
                                let oldN = oldKeyframeCopy.getParam("powerN");
                                if (typeof oldN == "number") {
                                    let newN = oldN * exp(dy / dy1y2 * 2);
                                    if (abs(newN - 2) <= 0.05)
                                        newN = 2;
                                    else if (abs(newN - 0.5) <= 0.0125)
                                        newN = 0.5;
                                    newKeyframeCopy.setParam("powerN", newN);
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "expN") {
                                let oldN = oldKeyframeCopy.getParam("expN");
                                if (typeof oldN == "number") {
                                    newKeyframeCopy.setParam("expN", oldN + dy / dy1y2 * 5);
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "elastic") {
                                let oldM = oldKeyframeCopy.getParam("elasticM");
                                let oldN = oldKeyframeCopy.getParam("elasticN");
                                if (typeof oldM == "number" && typeof oldN == "number") {
                                    let dx1x2 = rightKeyframe.x - newKeyframeCopy.x;
                                    if (easeType == "easeOut" || easeType == "easeOutIn")
                                        dx1x2 *= -1;
                                    if (easeType == "easeInOut" || easeType == "easeOutIn")
                                        dx1x2 *= 0.5;
                                    newKeyframeCopy.setParam("elasticM", oldM * exp(dx / dx1x2));
                                    newKeyframeCopy.setParam("elasticN", oldN + dy / dy1y2 * 5);
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "backS") {
                                let S = oldKeyframeCopy.getParam("backS");
                                if (typeof S == "number") {
                                    newKeyframeCopy.setParam("backS", S + dy / dy1y2 * 5);
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "tradExpV") {
                                let oldV = oldKeyframeCopy.getParam("tradExpV");
                                if (typeof oldV == "number") {
                                    newKeyframeCopy.setParam("tradExpV", oldV * exp(dy / dy1y2 * 5));
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "lagrangeC") {
                                let oldCX = oldKeyframeCopy.getParam("lagrangeCX");
                                let oldCY = oldKeyframeCopy.getParam("lagrangeCY");
                                if (typeof oldCX == "number" && typeof oldCY == "number") {
                                    newKeyframeCopy.setParam("lagrangeCX", oldCX + dx);
                                    newKeyframeCopy.setParam("lagrangeCY", oldCY + dy);
                                    command.update(newKeyframeCopy);
                                }
                            }
                            else if (type == "bezierC1") {
                                let oldCX = oldKeyframeCopy.getParam("bezierCX1");
                                let oldCY = oldKeyframeCopy.getParam("bezierCY1");
                                if (typeof oldCX == "number" && typeof oldCY == "number") {
                                    newKeyframeCopy.setParam("bezierCX1", oldCX + dx);
                                    newKeyframeCopy.setParam("bezierCY1", oldCY + dy);
                                    command.update(newKeyframeCopy);
                                    this.alignBezierForTimeline(timeline, keyframeIndex, keyframeIndex + 1, null, "right");
                                }
                            }
                            else if (type == "bezierC2") {
                                let oldCX = oldKeyframeCopy.getParam("bezierCX2");
                                let oldCY = oldKeyframeCopy.getParam("bezierCY2");
                                if (typeof oldCX == "number" && typeof oldCY == "number") {
                                    newKeyframeCopy.setParam("bezierCX2", oldCX + dx);
                                    newKeyframeCopy.setParam("bezierCY2", oldCY + dy);
                                    this.alignBezierForTimeline(timeline, keyframeIndex + 1, keyframeIndex + 2, null, "left");
                                    command.update(newKeyframeCopy);
                                }
                            }
                        }
                    }
                }
            }
            else if (this.mouseDragType == 15) {
                mouseEvent?.preventDefault();
                this.hoveredKeyframes.clear();
                let boxKeyframes = this.getBoxSelectKeyframes(...this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY), this.mouseX, this.mouseY);
                boxKeyframes.forEach(keyframe => this.hoveredKeyframes.add(keyframe));
            }
            else if (this.mouseDragType == 16) {
                mouseEvent?.preventDefault();
                if (this.tanim) {
                    this.tanim.length = max(round(this.mouseTimelineX), 1);
                    saveData();
                }
            }
            else if (this.mouseDragType == 17) {
                mouseEvent?.preventDefault();
                this.previewCameraX += (this.mouseDragX - this.mouseX) / this.previewCameraS;
                this.previewCameraY += -(this.mouseDragY - this.mouseY) / this.previewCameraS;
                this.mouseDragX = this.mouseX;
                this.mouseDragY = this.mouseY;
                this.updateMouseStagePosition();
            }
            else {
                let resized = false;
                if (this.mouseDragType == 2 || this.mouseDragType == 4) {
                    mouseEvent?.preventDefault();
                    this.width = clamp(this.mouseDragWidth + this.mouseClientX - this.mouseDragClientX, 60 + 480 + 180, window.innerWidth - this.left - 5);
                    let d = (this.leftBarWidth + this.rightBarWidth + 480) - this.canvasWidth;
                    if (d > 0) {
                        let sl = this.leftBarWidth - 60;
                        let sr = this.rightBarWidth - 180;
                        if (sl >= d) {
                            this.leftBarWidth -= d;
                        }
                        else {
                            this.leftBarWidth = 60;
                            this.rightBarWidth -= d - sl;
                        }
                    }
                    resized = true;
                }
                if (this.mouseDragType == 3 || this.mouseDragType == 4) {
                    mouseEvent?.preventDefault();
                    this.height = clamp(this.mouseDragHeight + this.mouseClientY - this.mouseDragClientY, 30 + max(120 + 50 + 90, 240 + 70 + 130) + 50, window.innerHeight - this.top - 5);
                    let d = (30 + 120 + 50 + this.timelineBarHeight + 50) - this.canvasHeight;
                    if (d > 0) {
                        this.timelineBarHeight -= d;
                    }
                    d = (30 + 240 + this.layerBarHeight + 130 + 50) - this.canvasHeight;
                    if (d > 0) {
                        this.layerBarHeight -= d;
                    }
                    resized = true;
                }
                if (resized) {
                    this.setCanvasSize();
                    saveData(false);
                }
            }
            this.doMouseDragStop(mouseState, event);
            this.timelines.forEach(timeline => timeline && this.alignBezierForTimeline(timeline));
            this.scrollTanimList(0);
            this.scrollLayerList(0);
            this.scrollTUIBar(0);
            this.hint[0] = this.hover.join("-");
            if (this.mouseDragType != 1) {
                if (!this.isMinimized) {
                    this.drawTimelineBar(this.leftBarWidth, this.canvasHeight - 50 - this.timelineBarHeight, this.canvasWidth - this.rightBarWidth, this.canvasHeight - 50);
                    this.drawPreview(this.leftBarWidth, 30, this.canvasWidth - this.rightBarWidth, this.canvasHeight - 50 - this.timelineBarHeight - 50);
                    this.drawControlBar(this.leftBarWidth, this.canvasHeight - 50 - this.timelineBarHeight - 50, this.canvasWidth - this.rightBarWidth, this.canvasHeight - 50 - this.timelineBarHeight, this.mouseDragType == 0 ? 1 : 0);
                    this.drawLeftBar(0, 30, this.leftBarWidth, this.canvasHeight - 50);
                    this.drawRightBar(this.canvasWidth - this.rightBarWidth, 30, this.canvasWidth, this.canvasHeight - 50);
                    this.drawTanimList("tanimList", this.canvasWidth - this.rightBarWidth + 1, 30, this.canvasWidth, this.canvasHeight - 50 - 240 - this.layerBarHeight, [0, 9].includes(this.mouseDragType) ? 1 : 0, this.tanimListScroll);
                    this.drawTanimListButton(1, this.canvasWidth - 20 - 24 / 2, 30 + 24 / 2, 24, 24, this.hover[0] == "newTanim" && this.mouseDragType == 0 ? 1 : 0);
                    this.drawTanimList("layerList", this.canvasWidth - this.rightBarWidth + 1, this.canvasHeight - 50 - 240 - this.layerBarHeight, this.canvasWidth, this.canvasHeight - 50 - 240, [0, 9, 10].includes(this.mouseDragType) ? 1 : 0, this.layerListScroll);
                    this.drawKeyframeBar(this.canvasWidth - this.rightBarWidth + 1, this.canvasHeight - 50 - 240, this.canvasWidth, this.canvasHeight - 50);
                    this.drawHintBar(this.canvasHeight, this.canvasWidth, 50);
                }
                this.drawHeader(this.canvasWidth, 30);
                this.drawClose(this.canvasWidth - 40 / 2, 30 / 2, 40, 30, this.hover[0] == "header" && this.hover[1] == "close" && this.mouseDragType == 0 ? 1 : 0);
                this.drawMinimize(this.canvasWidth - 40 * 1.5, 30 / 2, 40, 30, this.hover[0] == "header" && this.hover[1] == "minimize" && this.mouseDragType == 0 ? 1 : 0);
            }
            if (this.cursor != lastCursor) {
                this.root.style.cursor = this.cursor;
            }
        }
        drawRoundedRect(x, y, width, height, radius) {
            let ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
        }
        drawControlBar(x1, y1, x2, y2, uiState) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #e6e6e6";
            ctx.fillRect(x1, y2, x2 - x1, y1 - y2);
            for (let cui of this.cuis) {
                this.drawCUI(x1, y1, x2, y2, cui, uiState);
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y2 - 0.5);
            ctx.lineTo(x2, y2 - 0.5);
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawCUI(x1, y1, x2, y2, cui, uiState) {
            let { type, align, pos, size } = cui;
            let x = (align == 0 ? x1 : align == 2 ? x2 : (x1 + x2) / 2) + pos;
            let y = (y1 + y2) / 2;
            let { w, h } = size;
            let radius = 4;
            let ctx = this.ctx;
            ctx.save();
            let c1 = " #666666";
            let c2 = " #e6e6e6";
            if (this.hover[0] == "controlBar" && this.hover[1] == type && uiState == 1) {
                c2 = " #cccccc";
                ctx.fillStyle = c2;
                switch (align) {
                    case 1:
                        this.drawRoundedRect(x - w / 2, y - h / 2, w, h, radius);
                        break;
                    case 0:
                        this.drawRoundedRect(x, y - h / 2, w, h, radius);
                        break;
                    case 2:
                        this.drawRoundedRect(x - w, y - h / 2, w, h, radius);
                        break;
                }
                ctx.fill();
            }
            ctx.fillStyle = c1;
            ctx.strokeStyle = c1;
            ctx.lineWidth = 3;
            ctx.beginPath();
            function doubleStroke() {
                ctx.strokeStyle = c2;
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.strokeStyle = c1;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            switch (type) {
                case 8:
                    ctx.arc(x, y, 18, 0, 2 * PI);
                    ctx.fillStyle = c1;
                    ctx.fill();
                    if (this.isPlaying) {
                        ctx.fillStyle = c2;
                        ctx.fillRect(x - 2, y - 11, -5, 22);
                        ctx.fillRect(x + 2, y - 11, 5, 22);
                    }
                    else {
                        ctx.beginPath();
                        ctx.moveTo(x + 14, y);
                        ctx.lineTo(x - 7, y - 12.1);
                        ctx.lineTo(x - 7, y + 12.1);
                        ctx.closePath();
                        ctx.fillStyle = c2;
                        ctx.fill();
                    }
                    break;
                case 7:
                    ctx.moveTo(x - 9 - 3, y);
                    ctx.lineTo(x + 9 - 3, y - 10.3);
                    ctx.lineTo(x + 9 - 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x + 9 + 1, y - 10.3);
                    ctx.lineTo(x + 9 + 1, y + 10.3);
                    ctx.stroke();
                    break;
                case 9:
                    ctx.moveTo(x + 9 + 3, y);
                    ctx.lineTo(x - 9 + 3, y - 10.3);
                    ctx.lineTo(x - 9 + 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x - 9 - 1, y - 10.3);
                    ctx.lineTo(x - 9 - 1, y + 10.3);
                    ctx.stroke();
                    break;
                case 6:
                    ctx.moveTo(x - 9 + 3, y);
                    ctx.lineTo(x + 9 + 3, y - 10.3);
                    ctx.lineTo(x + 9 + 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x - 9 - 1, y);
                    ctx.lineTo(x - 9 - 1 + 6, y + 6);
                    ctx.lineTo(x - 9 - 1 + 6 * 2, y);
                    ctx.lineTo(x - 9 - 1 + 6, y - 6);
                    ctx.closePath();
                    let [, timeline] = this.getLeftKeyframe();
                    ctx.fillStyle = timeline ? tValueTypeToHSL(timeline.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 10:
                    ctx.moveTo(x + 9 - 3, y);
                    ctx.lineTo(x - 9 - 3, y - 10.3);
                    ctx.lineTo(x - 9 - 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x + 9 + 1, y);
                    ctx.lineTo(x + 9 + 1 - 6, y + 6);
                    ctx.lineTo(x + 9 + 1 - 6 * 2, y);
                    ctx.lineTo(x + 9 + 1 - 6, y - 6);
                    ctx.closePath();
                    let [, timeline_] = this.getRightKeyframe();
                    ctx.fillStyle = timeline_ ? tValueTypeToHSL(timeline_.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 5:
                    ctx.moveTo(x - 9 + 3, y);
                    ctx.lineTo(x + 9 + 3, y - 10.3);
                    ctx.lineTo(x + 9 + 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x - 9 + 3, y - 10.3);
                    ctx.lineTo(x - 9 + 3, y + 10.3);
                    ctx.strokeStyle = c2;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x - 9, y - 10.3);
                    ctx.lineTo(x - 9, y + 10.3);
                    ctx.moveTo(x - 9 + 5, y - 10.3);
                    ctx.lineTo(x - 9 + 5, y + 10.3);
                    ctx.strokeStyle = c1;
                    ctx.stroke();
                    break;
                case 11:
                    ctx.moveTo(x + 9 - 3, y);
                    ctx.lineTo(x - 9 - 3, y - 10.3);
                    ctx.lineTo(x - 9 - 3, y + 10.3);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x + 9 - 3, y - 10.3);
                    ctx.lineTo(x + 9 - 3, y + 10.3);
                    ctx.strokeStyle = c2;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x + 9, y - 10.3);
                    ctx.lineTo(x + 9, y + 10.3);
                    ctx.moveTo(x + 9 - 5, y - 10.3);
                    ctx.lineTo(x + 9 - 5, y + 10.3);
                    ctx.strokeStyle = c1;
                    ctx.stroke();
                    break;
                case 12:
                    ctx.lineCap = "round";
                    ctx.arc(x - 4, y, 6, 0.75 * PI, 1.5 * PI);
                    ctx.lineTo(x + 4, y - 6);
                    ctx.moveTo(x + 4 - 3, y - 6 - 3);
                    ctx.lineTo(x + 4, y - 6);
                    ctx.lineTo(x + 4 - 3, y - 6 + 3);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x + 4, y, 6, -0.25 * PI, 0.5 * PI);
                    ctx.lineTo(x - 4, y + 6);
                    ctx.moveTo(x - 4 + 3, y + 6 - 3);
                    ctx.lineTo(x - 4, y + 6);
                    ctx.lineTo(x - 4 + 3, y + 6 + 3);
                    ctx.stroke();
                    if (!this.isLoop) {
                        ctx.beginPath();
                        ctx.moveTo(x - 8, y - 8);
                        ctx.lineTo(x + 8, y + 8);
                        doubleStroke();
                    }
                    break;
                case 13:
                    ctx.lineCap = "round";
                    ctx.arc(x + 7, y + 6, 3.5, 0, 2 * PI);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(x, y + 7, 3.5, 0, 2 * PI);
                    doubleStroke();
                    ctx.beginPath();
                    ctx.arc(x - 7, y + 6, 3.5, 0, 2 * PI);
                    doubleStroke();
                    ctx.fillStyle = c1;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(x, y - 10);
                    ctx.lineTo(x - 7, y + 6);
                    ctx.strokeStyle = c1;
                    ctx.stroke();
                    if (!this.isYoyo) {
                        ctx.beginPath();
                        ctx.moveTo(x - 8, y - 8);
                        ctx.lineTo(x + 8, y + 8);
                        doubleStroke();
                    }
                    break;
                case 4:
                case 3:
                    ctx.lineCap = "round";
                    ctx.moveTo(x - 7 - 2, y + 2);
                    ctx.lineTo(x - 2, y - 7 + 2);
                    ctx.lineTo(x + 7 - 2, y + 2);
                    ctx.lineTo(x - 2, y + 7 + 2);
                    ctx.closePath();
                    let timeline__;
                    if (type == 3) {
                        timeline__ = this.getNewKeyframeTimeline();
                    }
                    else {
                        let pairs = this.getDeletePairs();
                        if (pairs?.length == 1) {
                            timeline__ = pairs[0].timeline;
                        }
                    }
                    ctx.fillStyle = timeline__ ? tValueTypeToHSL(timeline__.tValueType, 70, 70) : c2;
                    ctx.fill();
                    ctx.moveTo(x + 3, y - 6);
                    ctx.lineTo(x + 9, y - 6);
                    if (type == 3) {
                        ctx.moveTo(x + 6, y - 3);
                        ctx.lineTo(x + 6, y - 9);
                    }
                    ctx.stroke();
                    break;
                case 2:
                    ctx.lineCap = "round";
                    if (this.mainAxis == 0) {
                        ctx.moveTo(x + 4, y - 9);
                        ctx.lineTo(x + 9, y - 4);
                        ctx.moveTo(x + 4, y - 4);
                        ctx.lineTo(x + 9, y - 9);
                        ctx.moveTo(x - 7, y + 10);
                        ctx.lineTo(x - 7, y - 9);
                        ctx.moveTo(x - 7 - 3, y - 9 + 3);
                        ctx.lineTo(x - 7, y - 9);
                        ctx.lineTo(x - 7 + 3, y - 9 + 3);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 8, y + 6);
                        ctx.lineTo(x + 7, y + 6);
                        ctx.moveTo(x + 7 - 3, y + 6 - 3);
                        ctx.lineTo(x + 7, y + 6);
                        ctx.lineTo(x + 7 - 3, y + 6 + 3);
                    }
                    else {
                        ctx.moveTo(x + 4, y - 9);
                        ctx.lineTo(x + 6.5, y - 6.5);
                        ctx.lineTo(x + 9, y - 9);
                        ctx.moveTo(x + 6.5, y - 6.5);
                        ctx.lineTo(x + 6.5, y - 3);
                        ctx.moveTo(x - 10, y + 7);
                        ctx.lineTo(x + 9, y + 7);
                        ctx.moveTo(x + 9 - 3, y + 7 - 3);
                        ctx.lineTo(x + 9, y + 7);
                        ctx.lineTo(x + 9 - 3, y + 7 + 3);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 6, y + 8);
                        ctx.lineTo(x - 6, y - 7);
                        ctx.moveTo(x - 6 - 3, y - 7 + 3);
                        ctx.lineTo(x - 6, y - 7);
                        ctx.lineTo(x - 6 + 3, y - 7 + 3);
                    }
                    ctx.lineWidth = 8;
                    ctx.stroke();
                    ctx.strokeStyle = this.timelines[this.mainAxis] ? tValueTypeToHSL(this.timelines[this.mainAxis].tValueType, 70, 70) : c2;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    break;
                case 1:
                    let timeline___ = this.timelines[0];
                    ctx.fillStyle = timeline___ ? tValueTypeToHSL(timeline___.tValueType, 70, 70) : c2;
                    ctx.moveTo(x - 9, y + 9);
                    ctx.lineTo(x + 9, y - 9);
                    ctx.stroke();
                    ctx.beginPath();
                    if (this.isShowHandle) {
                        ctx.arc(x - 8, y + 8, 3, 0, 2 * PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(x + 8, y - 8, 3, 0, 2 * PI);
                        ctx.fill();
                        ctx.stroke();
                        ctx.beginPath();
                    }
                    ctx.moveTo(x - 5, y);
                    ctx.lineTo(x, y - 5);
                    ctx.lineTo(x + 5, y);
                    ctx.lineTo(x, y + 5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 14:
                    ctx.lineCap = "round";
                    ctx.moveTo(x - 6, y - 9);
                    ctx.lineTo(x - 6, y + 8);
                    ctx.lineTo(x, y + 2);
                    ctx.lineTo(x + 6, y + 8);
                    ctx.lineTo(x + 6, y - 9);
                    ctx.closePath();
                    ctx.stroke();
                    if (this.marks[this.focusTime]) {
                        ctx.fill();
                    }
                    break;
                case 0:
                    ctx.font = "18px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                    ctx.textAlign = "left";
                    if (this.hover[0] == "timeline") {
                        ctx.fillText(`${round(this.mouseTimelineX)},${round(this.mouseTimelineY, min(floor(log10(this.timelineScaleY)) + 1, 4))}`, x + 2, y + h / 5, w - 4);
                    }
                    else if (this.hover[0] == "preview") {
                        let n = clamp(floor(log10(this.previewCameraS)), 0, 4);
                        ctx.fillText(`${round(this.mouseStageX, n)},${round(this.mouseStageY, n)}`, x + 2, y + h / 5, w - 4);
                    }
                    break;
                case 16:
                    if (!this.tanim)
                        break;
                    ctx.font = "18px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                    ctx.textAlign = "right";
                    ctx.fillText(getTranslate("CQET_eCUIFPS").replace("[fps]", `${this.tanim.fps}`), x - 2, y + h / 5, w - 4);
                    break;
            }
            ctx.restore();
        }
        drawTimelineBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            if (!this.tanim) {
                ctx.restore();
                return;
            }
            const tanim = this.tanim;
            ctx.fillStyle = " #e6e6e6";
            let startX = floor(this.timelineToCanvasPosition(0, 0)[0]);
            if (startX > x1)
                ctx.fillRect(x1, y1, startX - x1, y2 - y1);
            let endX = floor(this.timelineToCanvasPosition(tanim.length, 0)[0]);
            if (endX < x2)
                ctx.fillRect(x2, y1, endX - x2, y2 - y1);
            let y = this.canvasHeight;
            let step = this.timelineScaleY > 4000 ? 0.005 : this.timelineScaleY > 2000 ? 0.01 : this.timelineScaleY > 400 ? 0.05 : this.timelineScaleY > 200 ? 0.1 : this.timelineScaleY > 40 ? 0.5 :
                this.timelineScaleY > 20 ? 1 : this.timelineScaleY > 4 ? 5 : this.timelineScaleY > 2 ? 10 : this.timelineScaleY > 0.4 ? 50 : this.timelineScaleY > 0.2 ? 100 :
                    this.timelineScaleY > 0.04 ? 500 : this.timelineScaleY > 0.02 ? 1000 : 5000;
            let stepSmall = 10 ** ceil(log10(3 / this.timelineScaleY));
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = this.hover[1] == "sideRuler" ? " #333333" : " #666666";
            for (let tValue = floor(this.timelineScrollY / stepSmall) * stepSmall; y > y1; tValue += stepSmall) {
                tValue = round(round(tValue / stepSmall) * stepSmall, 8);
                [, y] = this.timelineToCanvasPosition(0, tValue);
                let m = positiveMod(tValue, step);
                if (m <= 1e-8 || m >= step - 1e-8) {
                    ctx.fillRect(x1, y, 25 / 2, 1);
                    ctx.textAlign = "left";
                    ctx.fillText(`${tValue}`, x1 + 25 / 4, y - 2, 25 + 10);
                    ctx.fillRect(x2, y, -25 / 2, 1);
                    ctx.textAlign = "right";
                    ctx.fillText(`${tValue}`, x2 - 25 / 4, y - 2, 25 + 10);
                }
                else {
                    ctx.fillRect(x1, y, 25 / 5, 1);
                    ctx.fillRect(x2, y, -25 / 5, 1);
                }
            }
            if (this.mouseDragType == 15) {
                ctx.fillStyle = " #cccccc66";
                ctx.strokeStyle = " #999999";
                ctx.lineWidth = 1;
                let [boxX, boxY] = this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY);
                boxY = clamp(boxY, y1, y2);
                let boxY2 = clamp(this.mouseY, y1, y2);
                ctx.fillRect(boxX, boxY, this.mouseX - boxX, boxY2 - boxY);
                ctx.strokeRect(floor(boxX) + 0.5, floor(boxY) + 0.5, round(this.mouseX - boxX), round(boxY2 - boxY));
            }
            if (this.hover[0] == "timeline") {
                ctx.fillStyle = " #666666";
                let x = round(this.mouseX);
                let y = round(this.mouseY);
                if (this.hover[1] == "main") {
                    ctx.fillRect(x, y1, 1, y2 - y1);
                    ctx.fillRect(x1, y, x2 - x1, 1);
                }
                if (this.mouseDragType == 13 || this.mouseDragType == 14) {
                    ctx.strokeStyle = " #666666";
                    ctx.lineWidth = 1;
                    let x = floor(this.mouseX) + 0.5;
                    let y = floor(this.mouseY) + 0.5;
                    ctx.beginPath();
                    ctx.moveTo(x - 10, y - 30);
                    ctx.lineTo(x, y - 40);
                    ctx.lineTo(x + 10, y - 30);
                    ctx.moveTo(x - 10, y + 30);
                    ctx.lineTo(x, y + 40);
                    ctx.lineTo(x + 10, y + 30);
                    ctx.moveTo(x - 30, y - 10);
                    ctx.lineTo(x - 40, y);
                    ctx.lineTo(x - 30, y + 10);
                    ctx.moveTo(x + 30, y - 10);
                    ctx.lineTo(x + 40, y);
                    ctx.lineTo(x + 30, y + 10);
                    ctx.moveTo(x, y);
                    ctx.lineTo(...this.timelineToCanvasPosition(this.mouseDragX, this.mouseDragY));
                    ctx.stroke();
                }
            }
            else if (this.hover[0] == "preview") {
            }
            ctx.fillStyle = " #666666";
            if (x1 < startX && startX < x2) {
                ctx.fillRect(startX - 1, y1, 3, y2 - y1);
            }
            if (x1 < endX && endX < x2) {
                ctx.fillRect(endX - 1, y1, 3, y2 - y1);
            }
            let playX = 0;
            if (this.isPlaying) {
                playX = round(this.timelineToCanvasPosition(this.tanim.getTime(this.playTimeSec, "second", this.loopMode), 0)[0]);
                if (x1 < playX && playX < x2) {
                    let y = y1 + 20 + 20;
                    ctx.fillStyle = " #999999";
                    ctx.fillRect(playX, y, 1, y2 - y);
                }
            }
            let focusX = round(this.timelineToCanvasPosition(this.focusTime, 0)[0]);
            if (x1 < focusX && focusX < x2) {
                let y = y1 + 20 + 20;
                ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? "px", 50, 40);
                ctx.fillRect(focusX - 1, y, 3, y2 - y);
            }
            let mouseFocusX = round(this.timelineToCanvasPosition(round(this.mouseTimelineX), 0)[0]);
            if ((this.hover[1] == "mark" || this.hover[1] == "ruler") && round(this.mouseTimelineX) !== this.focusTime) {
                if (x1 < mouseFocusX && mouseFocusX < x2) {
                    let y = y1 + 20 + 20;
                    ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? "px", 50, 70);
                    ctx.fillRect(mouseFocusX, y, 1, y2 - y);
                }
            }
            let x = 0;
            step = 1;
            let newKeyframeTimeline = null;
            let newKeyframeTime = 0;
            if (this.hover[0] == "timeline" && this.hover[1] == "main" && this.hover[2] == "tValueCurve") {
                newKeyframeTimeline = this.timelines[this.hover[3]];
                newKeyframeTime = round(this.mouseTimelineX);
            }
            else if (this.hover[0] == "controlBar" && this.hover[1] == 3) {
                newKeyframeTimeline = this.getNewKeyframeTimeline();
                newKeyframeTime = this.focusTime;
            }
            let deleteKeyframes = null;
            if (this.hover[0] == "controlBar" && this.hover[1] == 4) {
                deleteKeyframes = new Set();
                this.getDeletePairs()?.forEach(pair => pair.keyframes.forEach(keyframe => deleteKeyframes?.add(keyframe)));
            }
            let drawTValueCurve = (timeline) => {
                let tValueType = timeline.tValueType;
                ctx.beginPath();
                for (let i = -1; i < timeline.keyframes.length; i++) {
                    let keyframe = timeline.keyframes[i];
                    let rightKeyframe = timeline.keyframes[i + 1];
                    let tValue;
                    if (!keyframe) {
                        if (!rightKeyframe) {
                            let y = this.timelineToCanvasPosition(0, timeline.getTValueByFrame(0))[1];
                            ctx.moveTo(x1, y);
                            ctx.lineTo(x2, y);
                            break;
                        }
                        let [x, y] = this.timelineToCanvasPosition(rightKeyframe.x, rightKeyframe.y);
                        if (x < x1)
                            continue;
                        ctx.moveTo(x1, y);
                        ctx.lineTo(x, y);
                        continue;
                    }
                    if (!rightKeyframe) {
                        if (!keyframe)
                            break;
                        let [x, y] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                        if (x > x2)
                            break;
                        ctx.moveTo(x, y);
                        ctx.lineTo(x2, y);
                        break;
                    }
                    let [xRight, yRight] = this.timelineToCanvasPosition(rightKeyframe.x, rightKeyframe.y);
                    if (xRight < x1)
                        continue;
                    let [xLeft, yLeft] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                    if (xLeft > x2)
                        break;
                    if (keyframe.interType == "const" || typeof keyframe.y == "string" || typeof rightKeyframe.y == "string") {
                        ctx.moveTo(xLeft, yLeft);
                        ctx.lineTo(xRight, yLeft);
                        continue;
                    }
                    switch (keyframe.interType) {
                        case "linear":
                            ctx.moveTo(xLeft, yLeft);
                            ctx.lineTo(xRight, yRight);
                            break;
                        case "bezier":
                            let cx1 = keyframe.getParam("bezierCX1") + keyframe.x;
                            let cy1 = keyframe.getParam("bezierCY1") + keyframe.y;
                            let cx2 = keyframe.getParam("bezierCX2") + rightKeyframe.x;
                            let cy2 = keyframe.getParam("bezierCY2") + rightKeyframe.y;
                            let [cxLeft, cyLeft] = this.timelineToCanvasPosition(cx1, cy1);
                            let [cxRight, cyRight] = this.timelineToCanvasPosition(cx2, cy2);
                            ctx.moveTo(xLeft, yLeft);
                            ctx.bezierCurveTo(cxLeft, cyLeft, cxRight, cyRight, xRight, yRight);
                            break;
                        default:
                            ctx.moveTo(xLeft, yLeft);
                            for (let x = ceil(xLeft); x <= xRight; x++) {
                                let time = this.canvasTotimelinePosition(x, 0)[0];
                                let tValue = Keyframe.Ease(time, keyframe, rightKeyframe);
                                let y = this.timelineToCanvasPosition(0, tValue)[1];
                                if (x > x2)
                                    break;
                                ctx.lineTo(x, clamp(y, y1, y2));
                            }
                    }
                }
                ctx.lineWidth = 5;
                ctx.strokeStyle = " #ffffff";
                ctx.stroke();
                ctx.lineWidth = 3;
                let curveColor = tValueTypeToHSL(tValueType, 70, 45);
                ctx.strokeStyle = curveColor;
                ctx.stroke();
                if (this.mouseDragType == 13) {
                    let command = this.commandStack.top;
                    if (command instanceof MoveKeyframesCommand && command.isDone) {
                        for (let { keyframes } of command.pairs) {
                            for (let keyframe of keyframes) {
                                let [x, y] = this.timelineToCanvasPosition(keyframe.x - command.x, typeof keyframe.y == "number" ? keyframe.y - command.y : keyframe.y);
                                this.drawKeyframe(x, y, timeline.tValueType, "drag");
                            }
                        }
                    }
                }
                for (let keyframe of timeline.keyframes) {
                    let [x, y] = this.timelineToCanvasPosition(keyframe.x, keyframe.y);
                    if (x + 15 < x1 || y + 15 < y1 || y - 15 > y2)
                        continue;
                    if (x - 15 > x2)
                        break;
                    this.drawKeyframe(x, y, timeline.tValueType, deleteKeyframes?.has(keyframe) ? "delete" :
                        this.selectedKeyframes.has(keyframe) ? "select" :
                            this.hoveredKeyframes.has(keyframe) ? "hover" : "default");
                }
                let handleColor = tValueTypeToHSL(tValueType, 40, 70);
                let handleHoverColor = tValueTypeToHSL(tValueType, 40, 70, 50);
                let isHoveredThisTimeline = this.hoveredHandle?.timeline == timeline ||
                    (this.mouseDragType == 14 && this.mouseDragHandle?.timeline == timeline);
                let [tx1, ty1, tx2, ty2] = [x1, y1, x2, y2];
                ctx.save();
                if (this.isShowHandle)
                    for (let i = 0; i < timeline.keyframes.length; i++) {
                        let handleInfo = this.getHandleInfo(timeline, i);
                        if (!handleInfo)
                            continue;
                        let isHoveredThisKeyframe = isHoveredThisTimeline &&
                            this.hoveredHandle?.keyframe == handleInfo.keyframe ||
                            (this.mouseDragType == 14 && this.mouseDragHandle?.keyframe == handleInfo.keyframe);
                        let hoveredHandleType = (this.mouseDragType == 14 && this.mouseDragHandle?.type) || this.hoveredHandle?.type;
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        if (handleInfo.type == "power" ||
                            handleInfo.type == "exp" ||
                            handleInfo.type == "elastic" ||
                            handleInfo.type == "back" ||
                            handleInfo.type == "tradExp" ||
                            handleInfo.type == "lagrange") {
                            let { cx, cy } = handleInfo;
                            if (cx + 10 < tx1 || cx - 10 > tx2)
                                continue;
                            let type;
                            switch (handleInfo.type) {
                                case "power":
                                    type = "powerN";
                                    break;
                                case "exp":
                                    type = "expN";
                                    break;
                                case "elastic":
                                    type = "elastic";
                                    break;
                                case "back":
                                    type = "backS";
                                    break;
                                case "tradExp":
                                    type = "tradExpV";
                                    break;
                                case "lagrange":
                                    type = "lagrangeC";
                                    break;
                            }
                            this.drawKeyframeHandle(cx, cy, isHoveredThisKeyframe && hoveredHandleType == type ? "hover" : "default", handleColor, handleHoverColor);
                        }
                        else if (handleInfo.type == "bezier") {
                            let { x1, y1, x2, y2, cx1, cy1, cx2, cy2, handleType, rightHandleType } = handleInfo;
                            ctx.save();
                            ctx.beginPath();
                            if (handleType != "vector") {
                                ctx.moveTo(x1, y1);
                                ctx.lineTo(cx1, cy1);
                            }
                            if (rightHandleType != "vector") {
                                ctx.moveTo(x2, y2);
                                ctx.lineTo(cx2, cy2);
                            }
                            ctx.lineWidth = 3;
                            ctx.strokeStyle = "#ffffff";
                            ctx.stroke();
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = "#666666";
                            ctx.stroke();
                            if (cx1 + 10 > tx1 && cx1 - 10 < tx2 && cy1 + 10 > ty1 && cy1 - 10 < ty2 && handleType != "vector")
                                this.drawKeyframeHandle(cx1, cy1, isHoveredThisKeyframe && hoveredHandleType == "bezierC1" ? "hover" : "default", handleColor, handleHoverColor, handleType != "auto");
                            if (cx2 + 10 > tx1 && cx2 - 10 < tx2 && cy2 + 10 > ty1 && cy2 - 10 < ty2 && rightHandleType != "vector")
                                this.drawKeyframeHandle(cx2, cy2, isHoveredThisKeyframe && hoveredHandleType == "bezierC2" ? "hover" : "default", handleColor, handleHoverColor, rightHandleType != "auto");
                        }
                    }
                ctx.restore();
                if (this.mouseDragType == 0 && newKeyframeTimeline == timeline) {
                    let [x, y] = this.timelineToCanvasPosition(newKeyframeTime, safeTValue(timeline.getTValueByFrame(newKeyframeTime), timeline.tValueType));
                    this.drawKeyframe(x, y, timeline.tValueType, "preview");
                }
            };
            if (this.timelines[1]) {
                drawTValueCurve(this.timelines[this.subAxis]);
                drawTValueCurve(this.timelines[this.mainAxis]);
            }
            else if (this.timelines[0]) {
                drawTValueCurve(this.timelines[0]);
            }
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y1, x2 - x1, 20 + 20 - 1);
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 3;
            for (let index in this.marks) {
                let time = parseInt(index);
                if (Number.isNaN(time))
                    continue;
                let x = this.timelineToCanvasPosition(time, 0)[0];
                let y = y1 + 20 / 2;
                ctx.fillStyle = ctx.strokeStyle = stringToHSL(this.marks[index], 40, 50);
                ctx.fillRect(x, y1, 1, 20 + 20);
                ctx.strokeText(this.marks[index], x + 2, y);
                ctx.fillStyle = " #ffffff";
                ctx.fillText(this.marks[index], x + 2, y);
            }
            ctx.fillStyle = " #666666";
            ctx.fillRect(x1, y1 + 20, x2 - x1, -1);
            ctx.fillRect(x1, y1 + 20 + 20, x2 - x1, -1);
            x = 0;
            step = 2 ** max(ceil(log2(40 / (tanim.fps * this.timelineScaleX))), 0);
            ctx.fillStyle = " #666666";
            ctx.font = "12px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            for (let sec = floor(this.timelineScrollX / tanim.fps / step) * step; x < x2; sec += step) {
                [x,] = this.timelineToCanvasPosition(sec * tanim.fps, 0);
                ctx.fillRect(x, y1 + 20, 1, 20);
                ctx.fillText(`${sec}`, x + 1, y1 + 20 + 20 + 1);
            }
            if (this.timelineScaleX >= 3) {
                x = 0;
                step = this.timelineScaleX > 45 ? 1 : this.timelineScaleX > 9 ? 5 : this.timelineScaleX > 5 ? 10 : tanim.fps;
                ctx.textBaseline = "alphabetic";
                for (let frame = floor(this.timelineScrollX); x < x2; frame++) {
                    [x,] = this.timelineToCanvasPosition(frame, 0);
                    if (frame % step == 0) {
                        ctx.fillRect(x, y1 + 20 + 20, 1, -20 / 2);
                        ctx.fillText(`${frame}`, x + 1, y1 + 20 + 20 / 2 + 1);
                    }
                    else {
                        ctx.fillRect(x, y1 + 20 + 20, 1, -20 / 4);
                    }
                }
            }
            ctx.beginPath();
            ctx.fillStyle = " #666666";
            ctx.strokeStyle = " #666666";
            if (x1 < startX + 8 + 12 && startX < x2) {
                ctx.fillRect(startX - 1, y1, 3, 20 + 20);
                ctx.moveTo(startX + 0.5, y1);
                ctx.lineTo(startX + 0.5 + 8, y1);
                ctx.lineTo(startX + 0.5 + 8 + 12, y1 + 20 / 2);
                ctx.lineTo(startX + 0.5 + 8, y1 + 20);
                ctx.lineTo(startX + 0.5, y1 + 20);
            }
            if (x1 < endX && endX - 8 - 12 < x2) {
                ctx.fillRect(endX - 1, y1, 3, 20 + 20);
                ctx.moveTo(endX + 0.5, y1);
                ctx.lineTo(endX + 0.5 - 8, y1);
                ctx.lineTo(endX + 0.5 - 8 - 12, y1 + 20 / 2);
                ctx.lineTo(endX + 0.5 - 8, y1 + 20);
                ctx.lineTo(endX + 0.5, y1 + 20);
            }
            ctx.fill();
            if (this.isPlaying) {
                playX = floor(this.timelineToCanvasPosition(this.tanim.getTime(this.playTimeSec, "second", this.loopMode), 0)[0]) + 0.5;
                if (x1 < playX + 12 && playX < x2) {
                    let y = y1 + 20 + 20;
                    ctx.beginPath();
                    ctx.fillStyle = " #999999";
                    ctx.moveTo(playX, y - 14);
                    ctx.lineTo(playX + 12, y - 7);
                    ctx.lineTo(playX, y);
                    ctx.fill();
                }
            }
            focusX = floor(this.timelineToCanvasPosition(this.focusTime, 0)[0]) + 0.5;
            if (x1 < focusX + 10 && focusX - 10 < x2) {
                let y = y1 + 20 + 20;
                ctx.beginPath();
                ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? "px", 50, 40);
                ctx.moveTo(focusX - 10, y - 12);
                ctx.lineTo(focusX, y + 2);
                ctx.lineTo(focusX + 10, y - 12);
                ctx.fill();
            }
            mouseFocusX = floor(this.timelineToCanvasPosition(round(this.mouseTimelineX), 0)[0]) + 0.5;
            if ((this.hover[1] == "mark" || this.hover[1] == "ruler") && round(this.mouseTimelineX) !== this.focusTime) {
                if (x1 < mouseFocusX + 10 && mouseFocusX - 10 < x2) {
                    let y = y1 + 20 + 20;
                    ctx.beginPath();
                    ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? "px", 50, 70);
                    ctx.moveTo(mouseFocusX - 10, y - 12);
                    ctx.lineTo(mouseFocusX, y + 2);
                    ctx.lineTo(mouseFocusX + 10, y - 12);
                    ctx.fill();
                }
            }
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y2, x2 - x1, -25);
            let scrollBlockLeft = this.timeToScrollX(this.canvasTotimelinePosition(x1, 0)[0], 0, tanim.length);
            let scrollBlockRight = this.timeToScrollX(this.canvasTotimelinePosition(x2, 0)[0], 0, tanim.length);
            if (this.mouseDragType == 12) {
                ctx.fillStyle = " #b3b3b3";
            }
            else if (this.hover[1] == "scrollX") {
                ctx.fillStyle = " #bfbfbf";
            }
            else {
                ctx.fillStyle = " #cccccc";
            }
            ctx.fillRect(scrollBlockLeft, y2, scrollBlockRight - scrollBlockLeft, -25);
            let scrollStart = this.timeToScrollX(0, 0, tanim.length);
            let scrollEnd = this.timeToScrollX(tanim.length, 0, tanim.length);
            let scrollFocus = this.timeToScrollX(this.focusTime, 0, tanim.length);
            ctx.beginPath();
            ctx.moveTo(scrollStart, y2);
            ctx.lineTo(scrollStart + 8, y2 - 25 / 2);
            ctx.lineTo(scrollStart, y2 - 25);
            ctx.moveTo(scrollEnd, y2);
            ctx.lineTo(scrollEnd - 8, y2 - 25 / 2);
            ctx.lineTo(scrollEnd, y2 - 25);
            ctx.fillStyle = " #666666";
            ctx.fill();
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(round(scrollFocus) - 2, y2, 5, -25);
            ctx.fillStyle = tValueTypeToHSL(this.timelines[this.mainAxis]?.tValueType ?? this.timelines[this.subAxis]?.tValueType ?? "px", 50, 40);
            ctx.fillRect(round(scrollFocus) - 1, y2, 3, -25);
            ctx.fillStyle = (this.hover[1] == "scrollLeft" && this.mouseDragType == 0) ? " #cccccc" : " #ffffff";
            ctx.fillRect(x1, y2, 25, -25);
            ctx.fillStyle = (this.hover[1] == "scrollRight" && this.mouseDragType == 0) ? " #cccccc" : " #ffffff";
            ctx.fillRect(x2, y2, -25, -25);
            ctx.fillStyle = " #666666";
            ctx.fillRect(x1 + 25, y2, -1, -25);
            ctx.fillRect(x2 - 25, y2, 1, -25);
            ctx.beginPath();
            let tx = x1 + 25 / 2;
            let ty = y2 - 25 / 2;
            ctx.moveTo(tx + 3, ty - 6);
            ctx.lineTo(tx - 6, ty);
            ctx.lineTo(tx + 3, ty + 6);
            tx = x2 - 25 / 2;
            ctx.moveTo(tx - 3, ty - 6);
            ctx.lineTo(tx + 6, ty);
            ctx.lineTo(tx - 3, ty + 6);
            ctx.fillStyle = " #666666";
            ctx.fill();
            ctx.fillRect(x1, y2 - 25, x2 - x1, 1);
            ctx.restore();
        }
        drawPreview(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #ffffff";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            if (this.tanim) {
                let previewCenterX = (x1 + x2) / 2;
                let previewCenterY = (y1 + y2) / 2;
                let drawAxisX = (y, w) => {
                    let cy = round(this.stageToCanvasPosition(0, y, previewCenterX, previewCenterY)[1]);
                    if (y1 < cy && cy < y2) {
                        if (w) {
                            let cx1 = clamp(round(this.stageToCanvasPosition(-w, 0, previewCenterX, previewCenterY)[0]), x1, x2);
                            let cx2 = clamp(round(this.stageToCanvasPosition(w, 0, previewCenterX, previewCenterY)[0]), x1, x2);
                            ctx.fillRect(cx1, cy, cx2 - cx1, 1);
                        }
                        else {
                            ctx.fillRect(x1, cy, x2 - x1, 1);
                        }
                    }
                };
                let drawAxisY = (x, h) => {
                    let cx = round(this.stageToCanvasPosition(x, 0, previewCenterX, previewCenterY)[0]);
                    if (x1 < cx && cx < x2) {
                        if (h) {
                            let cy1 = clamp(round(this.stageToCanvasPosition(0, -h, previewCenterX, previewCenterY)[1]), y1, y2);
                            let cy2 = clamp(round(this.stageToCanvasPosition(0, h, previewCenterX, previewCenterY)[1]), y1, y2);
                            ctx.fillRect(cx, cy1, 1, cy2 - cy1);
                        }
                        else {
                            ctx.fillRect(cx, y1, 1, y2 - y1);
                        }
                    }
                };
                ctx.fillStyle = " #666666";
                drawAxisX(0);
                drawAxisY(0);
                ctx.fillStyle = " #cccccc";
                let stageWidth = (runtime.stageWidth ?? 480) / 2;
                let stageHeight = (runtime.stageHeight ?? 360) / 2;
                drawAxisX(stageHeight, stageWidth);
                drawAxisX(-stageHeight, stageWidth);
                drawAxisY(stageWidth, stageHeight);
                drawAxisY(-stageWidth, stageHeight);
                let stageCtx = this.stageCtx;
                let stageCenterX = (x2 - x1) / 2;
                let stageCenterY = (y2 - y1) / 2;
                let playTimeSec = this.playTimeSec;
                for (let i = this.layers.length - 1; i >= 0; i--) {
                    let layer = this.layers[i];
                    let snapshot = this.isPlaying ? layer.getSnapshot(playTimeSec, "second", this.loopMode) : layer.getSnapshot(this.focusTime, "frame", this.loopMode);
                    let cos = getSnapshotValue(snapshot, "cos");
                    let costumeNames = this.getCostumeNames(layer);
                    let costumeData = this.costumeManager.getCostumeData(this.getSpriteName(layer), `${costumeNames[0]}${costumeNames[1] || cos}${costumeNames[2]}`);
                    if (costumeData.loadState !== 2)
                        continue;
                    let px = getSnapshotValue(snapshot, "px");
                    let py = getSnapshotValue(snapshot, "py");
                    let s = getSnapshotValue(snapshot, "s");
                    let sx = getSnapshotValue(snapshot, "sx");
                    let sy = getSnapshotValue(snapshot, "sy");
                    let sqx = getSnapshotValue(snapshot, "sqx");
                    let sqy = getSnapshotValue(snapshot, "sqy");
                    let d = getSnapshotValue(snapshot, "d");
                    stageCtx.save();
                    stageCtx.clearRect(0, 0, x2 - x1, y2 - y1);
                    let spriteSX = s * sx / 10000 * sqx;
                    let sprietSY = s * sy / 10000 * sqy;
                    stageCtx.translate(stageCenterX + (px - this.previewCameraX) * this.previewCameraS, stageCenterY - (py - this.previewCameraY) * this.previewCameraS);
                    stageCtx.rotate((d - 90) / 180 * PI);
                    stageCtx.translate(-costumeData.rotationCenterX * spriteSX * this.previewCameraS, -costumeData.rotationCenterY * sprietSY * this.previewCameraS);
                    stageCtx.scale(this.previewCameraS * spriteSX, this.previewCameraS * sprietSY);
                    stageCtx.drawImage(costumeData.img, 0, 0);
                    ctx.drawImage(this.stageCanvas, x1, y1);
                    stageCtx.restore();
                }
                for (let pui of this.puis) {
                    let { type, x, y, size: { w, h } } = pui;
                    let centerX = x + w / 2;
                    let centerY = y + h / 2;
                    let isHover = this.hover[0] == "preview" && this.hover[1] == "pui" && this.hover[2] == type;
                    ctx.fillStyle = isHover ? " #e6e6e6" : " #ffffff99";
                    this.drawRoundedRect(x, y, w, h, 4);
                    ctx.fill();
                    if (pui.text !== undefined) {
                        let text = getTranslate(pui.text);
                        let isGhost = false;
                        switch (type) {
                            case 1:
                                text = text.replace("[SpriteName]", this.getSpriteName(this.tanim) || (isGhost = true, "-"));
                                break;
                            case 2:
                                text = text.replace("[CostumeName0]", this.getCostumeNames(this.tanim)[0] || (isGhost = true, "-"));
                                break;
                            case 3:
                                text = text.replace("[CostumeName1]", this.getCostumeNames(this.tanim)[1] || (isGhost = true, "-"));
                                break;
                            case 4:
                                text = text.replace("[CostumeName2]", this.getCostumeNames(this.tanim)[2] || (isGhost = true, "-"));
                                break;
                        }
                        ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "alphabetic";
                        ctx.fillStyle = isGhost ? " #999999" : " #666666";
                        ctx.fillText(text, x + 2, centerY + h / 5, w - 4);
                    }
                    ctx.strokeStyle = " #666666";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    switch (type) {
                        case 5:
                        case 6:
                            ctx.moveTo(centerX + 7, centerY + 7);
                            ctx.lineTo(centerX + 2, centerY + 2);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.arc(centerX - 2, centerY - 2, 6, 0, 2 * PI);
                            ctx.moveTo(centerX - 2 - 3, centerY - 2);
                            ctx.lineTo(centerX - 2 + 3, centerY - 2);
                            if (type == 5) {
                                ctx.moveTo(centerX - 2, centerY - 2 - 3);
                                ctx.lineTo(centerX - 2, centerY - 2 + 3);
                            }
                            ctx.stroke();
                            break;
                        case 7:
                            ctx.moveTo(centerX - 6, centerY - 3);
                            ctx.lineTo(centerX + 6, centerY - 3);
                            ctx.moveTo(centerX - 6, centerY + 3);
                            ctx.lineTo(centerX + 6, centerY + 3);
                            ctx.stroke();
                            break;
                    }
                }
            }
            ctx.restore();
        }
        drawKeyframe(x, y, tValueType, type = "default") {
            x = floor(x) + 0.5;
            y = floor(y) + 0.5;
            if (x + (10 + 5) < this.leftBarWidth ||
                this.canvasWidth - this.rightBarWidth < x - (10 + 5) ||
                y < this.canvasHeight - 50 - this.timelineBarHeight ||
                this.canvasHeight < y)
                return;
            let ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x - (10 - 2), y);
            ctx.lineTo(x, y - (10 - 2));
            ctx.lineTo(x + (10 - 2), y);
            ctx.lineTo(x, y + (10 - 2));
            ctx.closePath();
            if (type == "default") {
                ctx.strokeStyle = tValueTypeToHSL(tValueType, 20, 80);
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70);
                ctx.fill();
                ctx.strokeStyle = " #666666";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            else if (type == "preview") {
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 60);
                ctx.fill();
                ctx.strokeStyle = " #999999";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            else if (type == "hover") {
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 75);
                ctx.fill();
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.strokeStyle = " #666666";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            else if (type == "select") {
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 6;
                ctx.stroke();
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 75);
                ctx.fill();
                ctx.strokeStyle = " #666666";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x - (10 - 6), y);
                ctx.lineTo(x, y - (10 - 6));
                ctx.lineTo(x + (10 - 6), y);
                ctx.lineTo(x, y + (10 - 6));
                ctx.closePath();
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 40);
                ctx.fill();
            }
            else if (type == "drag") {
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 50);
                ctx.fill();
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.strokeStyle = " #b3b3b3";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            else if (type == "delete") {
                ctx.fillStyle = tValueTypeToHSL(tValueType, 40, 70, 60);
                ctx.fill();
                ctx.strokeStyle = " #ffffff";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.strokeStyle = " #999999";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.restore();
        }
        drawKeyframeHandle(x, y, state, handleColor, handleHoverColor, isDragable = true) {
            x = floor(x) + 0.5;
            y = floor(y) + 0.5;
            let ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = handleColor;
            ctx.lineWidth = 2;
            ctx.strokeStyle = " #666666";
            if (state == "default") {
                ctx.arc(x, y, 5, 0, 2 * PI);
                ctx.lineWidth = 3;
                ctx.strokeStyle = " #ffffff";
                ctx.stroke();
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = " #666666";
                ctx.stroke();
                if (!isDragable) {
                    ctx.beginPath();
                    let d = 5 / SQRT2;
                    ctx.moveTo(x - d, y - d);
                    ctx.lineTo(x + d, y + d);
                    ctx.moveTo(x - d, y + d);
                    ctx.lineTo(x + d, y - d);
                    ctx.stroke();
                }
            }
            else if (state == "hover") {
                ctx.arc(x, y, 5 + 1, 0, 2 * PI);
                ctx.fillStyle = handleHoverColor;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = " #ffffff";
                ctx.stroke();
                ctx.lineWidth = 1;
                ctx.strokeStyle = " #666666";
                ctx.stroke();
            }
            ctx.restore();
        }
        drawLeftBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            let centerX = (x1 + x2) / 2;
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            if (this.tanim)
                for (let i = 0; i <= this.tValueNames.length; i++) {
                    let tValueName = (this.tValueNames[i] ?? null);
                    let top = y1 + (i - this.TUIScroll) * 60;
                    if (top >= y2)
                        break;
                    let bottom = top + 60;
                    if (bottom <= y1)
                        continue;
                    let centerY = (top + bottom) / 2;
                    if (this.hover[0] == "tValueNameBar" && this.hover[1] == "tui" && this.tValueNames[this.hover[2]] == tValueName) {
                        ctx.fillStyle = " #cccccc";
                        ctx.fillRect(x1, top + 1, x2, bottom - top);
                    }
                    let circleY = top + 22;
                    let textY = bottom - 6;
                    ctx.beginPath();
                    ctx.arc(centerX, circleY, 16, 0, 2 * PI);
                    ctx.fillStyle = tValueTypeToHSL(tValueName ?? "__CreateNewTimeline__", 75, 55);
                    ctx.fill();
                    if (this.tValueName == tValueName) {
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = " #ffffff";
                        ctx.stroke();
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = " #666666";
                        ctx.stroke();
                    }
                    ctx.strokeStyle = " #ffffff";
                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";
                    ctx.fillStyle = " #666666";
                    ctx.beginPath();
                    switch (tValueName) {
                        case `${"px"}|${"py"}`:
                            ctx.moveTo(centerX - 6, circleY + 6);
                            ctx.lineTo(centerX + 6, circleY - 6);
                            ctx.moveTo(centerX - 1, circleY - 6);
                            ctx.lineTo(centerX + 6, circleY - 6);
                            ctx.lineTo(centerX + 6, circleY + 1);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINamePxPy"), centerX, textY, x2 - x1 - 2);
                            break;
                        case "s":
                            ctx.moveTo(centerX + 1, circleY - 7);
                            ctx.lineTo(centerX + 7, circleY - 7);
                            ctx.lineTo(centerX + 7, circleY - 1);
                            ctx.moveTo(centerX - 1, circleY + 7);
                            ctx.lineTo(centerX - 7, circleY + 7);
                            ctx.lineTo(centerX - 7, circleY + 1);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameS"), centerX, textY, x2 - x1 - 2);
                            break;
                        case `${"sx"}|${"sy"}`:
                            ctx.moveTo(centerX - 4, circleY + 4);
                            ctx.lineTo(centerX + 4, circleY - 4);
                            ctx.moveTo(centerX + 4, circleY - 9);
                            ctx.lineTo(centerX + 4, circleY - 4);
                            ctx.lineTo(centerX + 9, circleY - 4);
                            ctx.moveTo(centerX - 4, circleY + 9);
                            ctx.lineTo(centerX - 4, circleY + 4);
                            ctx.lineTo(centerX - 9, circleY + 4);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameSxSy"), centerX, textY, x2 - x1 - 2);
                            break;
                        case "sq":
                            ctx.ellipse(centerX, circleY, 9.5, 5, -0.25 * PI, 0, 2 * PI);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameSq"), centerX, textY, x2 - x1 - 2);
                            break;
                        case "d":
                            ctx.arc(centerX - 0.3, circleY, 7.5, 0.5 * PI, 0);
                            ctx.moveTo(centerX - 0.3 + 7.5 - 4, circleY - 3);
                            ctx.lineTo(centerX - 0.3 + 7.5, circleY);
                            ctx.lineTo(centerX - 0.3 + 7.5 + 3, circleY - 4);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameD"), centerX, textY, x2 - x1 - 2);
                            break;
                        case "cos":
                            ctx.moveTo(centerX - 7, circleY - 3.5);
                            ctx.lineTo(centerX + 8, circleY - 3.5);
                            ctx.moveTo(centerX + 8 - 3, circleY - 3.5 - 3);
                            ctx.lineTo(centerX + 8, circleY - 3.5);
                            ctx.lineTo(centerX + 8 - 3, circleY - 3.5 + 3);
                            ctx.moveTo(centerX + 7, circleY + 3.5);
                            ctx.lineTo(centerX - 8, circleY + 3.5);
                            ctx.moveTo(centerX - 8 + 3, circleY + 3.5 - 3);
                            ctx.lineTo(centerX - 8, circleY + 3.5);
                            ctx.lineTo(centerX - 8 + 3, circleY + 3.5 + 3);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameCos"), centerX, textY, x2 - x1 - 2);
                            break;
                        case null:
                            ctx.moveTo(centerX - 8, circleY);
                            ctx.lineTo(centerX + 8, circleY);
                            ctx.moveTo(centerX, circleY - 8);
                            ctx.lineTo(centerX, circleY + 8);
                            ctx.stroke();
                            ctx.fillText(getTranslate("CQET_eTUINameCreateNewTValueType"), centerX, textY, x2 - x1 - 2);
                            break;
                        default:
                            ctx.arc(centerX, circleY, 7, 0, 2 * PI);
                            ctx.stroke();
                            ctx.fillText(tValueName, centerX, textY, x2 - x1 - 2);
                            break;
                    }
                    ctx.fillStyle = " #666666";
                    ctx.fillRect(x1, round(bottom), x2 - x1, 1);
                }
            let undoX = x1 + 30 / 2;
            let undoY = y2 - 30 / 2;
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y2, x2 - x1, -30);
            if (this.commandStack.isCanUndo) {
                if (this.hover[0] == "undo") {
                    ctx.fillStyle = " #cccccc";
                    ctx.fillRect(x1, y2, 30, -30);
                }
                ctx.beginPath();
                ctx.moveTo(undoX - 1, undoY - 4);
                ctx.bezierCurveTo(undoX + 5, undoY - 4, undoX + 10, undoY + 1, undoX + 10, undoY + 10);
                ctx.bezierCurveTo(undoX + 8, undoY + 4, undoX + 4, undoY + 1, undoX - 1, undoY + 1);
                ctx.lineTo(undoX - 1, undoY + 6);
                ctx.lineTo(undoX - 10, undoY - 1.5);
                ctx.lineTo(undoX - 1, undoY - 9);
                ctx.lineTo(undoX - 1, undoY - 4);
                ctx.fillStyle = " #666666";
                ctx.fill();
            }
            if (this.commandStack.isCanRedo) {
                undoX += 30;
                if (this.hover[0] == "redo") {
                    ctx.fillStyle = " #cccccc";
                    ctx.fillRect(x1 + 30, y2, 30, -30);
                }
                ctx.beginPath();
                ctx.moveTo(undoX + 1, undoY - 4);
                ctx.bezierCurveTo(undoX - 5, undoY - 4, undoX - 10, undoY + 1, undoX - 10, undoY + 10);
                ctx.bezierCurveTo(undoX - 8, undoY + 4, undoX - 4, undoY + 1, undoX + 1, undoY + 1);
                ctx.lineTo(undoX + 1, undoY + 6);
                ctx.lineTo(undoX + 10, undoY - 1.5);
                ctx.lineTo(undoX + 1, undoY - 9);
                ctx.lineTo(undoX + 1, undoY - 4);
                ctx.fillStyle = " #666666";
                ctx.fill();
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            undoY = y2 - 30;
            ctx.moveTo(x1, ceil(undoY) - 0.5);
            ctx.lineTo(x2, ceil(undoY) - 0.5);
            ctx.moveTo(ceil(x2) - 0.5, y1);
            ctx.lineTo(ceil(x2) - 0.5, y2);
            ctx.stroke();
            ctx.restore();
        }
        drawRightBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1 + 0.5, y1);
            ctx.lineTo(x1 + 0.5, y2);
            ctx.stroke();
            ctx.restore();
        }
        drawTanimList(type, x1, y1, x2, y2, uiState, scroll) {
            let tanimTree = type == "tanimList" ? this.tanimTree : this.layerTree;
            let tanimFolders = type == "tanimList" ? this.tanimFolders : this.layerFolders;
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "bold " + "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.fillStyle = " #666666";
            ctx.fillText(getTranslate(type == "tanimList" ? "CQET_eTanimListTitle" : "CQET_eLayerListTitle"), x1 + 6.5, y1 + 24 / 2);
            ctx.strokeStyle = " #b3b3b3";
            for (let folderName in tanimFolders) {
                let { color, indentation, ranges } = tanimFolders[folderName];
                for (let { from, to } of ranges) {
                    let bgy1 = y1 + 24 * (from + 1 - scroll);
                    let bgy2 = y1 + 24 * (to + 1 - scroll);
                    if (bgy2 < y1 + 24)
                        continue;
                    if (bgy1 > y2)
                        continue;
                    let bgx1 = x1 + 6.5 + 12 * indentation;
                    let bgx2 = x2 - 20;
                    if (bgx2 <= bgx1)
                        continue;
                    let lbgy1 = max(bgy1, y1 + 24);
                    let lbgy2 = min(bgy2, y2);
                    ctx.fillStyle = color;
                    ctx.fillRect(floor(bgx1), lbgy1, ceil(bgx2 - bgx1), lbgy2 - lbgy1);
                    ctx.beginPath();
                    if (to - from >= 3) {
                        ctx.moveTo(floor(bgx1) + 0.5, floor(max(bgy1, y1) + 24) + 0.5);
                        ctx.lineTo(floor(bgx1) + 0.5, ceil(min(y2, bgy2 - 24)) - 0.5);
                    }
                    if (bgy1 >= y1 + 24 - 1) {
                        ctx.moveTo(floor(bgx1) + 0.5, floor(bgy1) + 0.5);
                        ctx.lineTo(floor(bgx2) + 0.5, floor(bgy1) + 0.5);
                    }
                    if (bgy2 < y2) {
                        ctx.moveTo(floor(bgx1) + 0.5, ceil(bgy2) - 0.5);
                        ctx.lineTo(floor(bgx2) + 0.5, ceil(bgy2) - 0.5);
                    }
                    ctx.stroke();
                }
            }
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.lineWidth = 1;
            for (let i = 0; i <= tanimTree.length; i++) {
                if (24 * (i - scroll) < 0)
                    continue;
                if (y1 + 24 * (i + 1 - scroll) > y2)
                    break;
                let isDragStart = this.mouseDragIndex == i && (this.mouseDragType == (type == "tanimList" ? 9 : 10));
                if (this.hover[0] == type && this.hover[1] == i && uiState == 1) {
                    if (this.mouseDragType == 9 ||
                        (type == "layerList" && this.mouseDragType == 10)) {
                        if (!isDragStart) {
                            ctx.save();
                            ctx.strokeStyle = " #666666";
                            ctx.lineWidth = 5;
                            ctx.beginPath();
                            ctx.moveTo(x1 + 6.5, y1 + 24 * (i + 1 - scroll));
                            ctx.lineTo(x2 - 20, y1 + 24 * (i + 1 - scroll));
                            ctx.stroke();
                            ctx.strokeStyle = " #ffffff";
                            ctx.lineWidth = 3;
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                    else {
                        if (tanimTree[i]) {
                            ctx.fillStyle = " #cccccc66";
                            ctx.fillRect(x1 + 6.5, y1 + 24 * (i + 1 - scroll), x2 - 20 - (x1 + 6.5), 24);
                        }
                    }
                }
                if (!tanimTree[i])
                    continue;
                if (isDragStart) {
                    ctx.fillStyle = " #cccccc66";
                    ctx.fillRect(x1 + 6.5, y1 + 24 * (i + 1 - scroll), x2 - 20 - (x1 + 6.5), 24);
                }
                if (type == "layerList" && this.layerTree[i].tanim == this.tanim) {
                    ctx.strokeStyle = " #666666";
                    ctx.strokeRect(ceil(x1) + 6.5, ceil(y1 + 24 * (i + 1 - scroll)) + 0.5, floor(x2 - 20 - x1 - 6.5), floor(24));
                }
                let buttons;
                if (this.hover[0] == type && this.hover[1] == i && this.mouseDragType == 0) {
                    buttons = (type == "tanimList" ? this.getTanimListButtons : this.getLayerListButtons)(tanimTree[i]);
                }
                else {
                    buttons = [];
                }
                for (let j = 0; j < buttons.length; j++) {
                    this.drawTanimListButton(buttons[j], x2 - 20 - 24 * (j + 0.5), y1 + 24 * (i + 1.5 - scroll), 24, 24, this.hover[0] == type && this.hover[1] == i && this.hover[2] == buttons[j] ? uiState : 0);
                }
                this.drawTanimListItemText(tanimTree[i], x1 + 6.5, y1 + 24 * (1 - scroll), i, x2 - 20 - buttons.length * 24 - (x1 + 6.5 + 12 * tanimTree[i].indentation));
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawTanimListItemText({ text: text, type, indentation }, x, y, pos, maxWidth) {
            let itemY = y + 24 * (pos + 0.5);
            this.ctx.fillStyle = " #666666";
            let trimmedText;
            switch (type) {
                case 1:
                    trimmedText = this.trimText("", text, " {", maxWidth * 1.15);
                    break;
                case 2:
                    trimmedText = this.trimText("} ", text, "", maxWidth * 1.15);
                    break;
                case 3:
                    trimmedText = this.trimText("", text, " {...}", maxWidth * 1.15);
                    break;
                default:
                case 0:
                    trimmedText = this.trimText("", text, "", maxWidth * 1.15);
                    break;
            }
            this.ctx.fillText(trimmedText, x + 12 * indentation, itemY, maxWidth);
        }
        drawTanimListButton(type, x, y, w, h, uiState, color) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
                ctx.fillStyle = " #99999966";
                ctx.fillRect(x - w / 2, y - h / 2, w, h);
            }
            ctx.strokeStyle = color ?? " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            switch (type) {
                case 1:
                    ctx.moveTo(x - 1.5, y + 5.5);
                    ctx.lineTo(x - 5.5, y + 5.5);
                    ctx.lineTo(x - 5.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 4.5, y - 3.5);
                    ctx.lineTo(x + 4.5, y - 1.5);
                    ctx.moveTo(x + 4.5, y - 2.5);
                    ctx.lineTo(x + 0.5, y - 2.5);
                    ctx.lineTo(x + 0.5, y - 6.5);
                    ctx.moveTo(x + 1.5, y + 4.5);
                    ctx.lineTo(x + 7.5, y + 4.5);
                    ctx.moveTo(x + 4.5, y + 1.5);
                    ctx.lineTo(x + 4.5, y + 7.5);
                    break;
                case 2:
                    ctx.moveTo(x - 5.5, y + 6.5);
                    ctx.lineTo(x - 5.5, y - 3.5);
                    ctx.lineTo(x + 0.5, y - 3.5);
                    ctx.lineTo(x + 2.5, y - 1.5);
                    ctx.lineTo(x + 2.5, y + 6.5);
                    ctx.lineTo(x - 5.5, y + 6.5);
                    ctx.moveTo(x - 0.5, y - 3.5);
                    ctx.lineTo(x - 0.5, y - 0.5);
                    ctx.lineTo(x + 2.5, y - 0.5);
                    ctx.moveTo(x - 1.5, y - 6.5);
                    ctx.lineTo(x - 1.5, y - 7.5);
                    ctx.lineTo(x + 4.5, y - 7.5);
                    ctx.lineTo(x + 6.5, y - 5.5);
                    ctx.lineTo(x + 6.5, y + 2.5);
                    ctx.lineTo(x + 5.5, y + 2.5);
                    ctx.moveTo(x + 3.5, y - 7.5);
                    ctx.lineTo(x + 3.5, y - 4.5);
                    ctx.lineTo(x + 6.5, y - 4.5);
                    break;
                case 3:
                case 4:
                case 5:
                    ctx.moveTo(x - 6.5, y + 6.5);
                    ctx.lineTo(x - 6.5, y + 2.5);
                    ctx.lineTo(x + 3.5, y - 7.5);
                    ctx.lineTo(x + 7.5, y - 3.5);
                    ctx.lineTo(x - 2.5, y + 6.5);
                    ctx.lineTo(x - 6.5, y + 6.5);
                    ctx.moveTo(x - 6.5, y + 3.5);
                    ctx.lineTo(x - 3.5, y + 6.5);
                    ctx.moveTo(x - 5.5, y + 1.5);
                    ctx.lineTo(x - 1.5, y + 5.5);
                    ctx.moveTo(x - 3.5, y + 3.5);
                    ctx.lineTo(x + 5.5, y - 5.5);
                    if (type == 3)
                        break;
                    ctx.moveTo(x + 2.5, y + 5.5);
                    ctx.lineTo(x + 8.5, y + 5.5);
                    if (type == 5)
                        break;
                    ctx.moveTo(x + 5.5, y + 2.5);
                    ctx.lineTo(x + 5.5, y + 8.5);
                    break;
                case 6:
                    ctx.moveTo(x - 5.5, y + 3);
                    ctx.lineTo(x - 2.5, y - 4.5);
                    ctx.lineTo(x + 0.5, y + 3);
                    ctx.moveTo(x - 4.5, y - 0.5);
                    ctx.lineTo(x - 0.5, y - 0.5);
                    ctx.moveTo(x + 3.5, y - 6.5);
                    ctx.lineTo(x + 3.5, y + 5.5);
                    ctx.moveTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 5.5, y - 6.5);
                    ctx.moveTo(x + 1.5, y + 5.5);
                    ctx.lineTo(x + 5.5, y + 5.5);
                    break;
                case 7:
                    ctx.moveTo(x - 6.5, y - 4.5);
                    ctx.lineTo(x + 6.5, y - 4.5);
                    ctx.moveTo(x - 1.5, y - 4.5);
                    ctx.lineTo(x - 1.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 6.5);
                    ctx.lineTo(x + 1.5, y - 4.5);
                    ctx.moveTo(x - 4.5, y - 2.5);
                    ctx.lineTo(x - 4.5, y + 6.5);
                    ctx.lineTo(x + 4.5, y + 6.5);
                    ctx.lineTo(x + 4.5, y - 2.5);
                    ctx.moveTo(x - 1.5, y - 1.5);
                    ctx.lineTo(x - 1.5, y + 3.5);
                    ctx.moveTo(x + 1.5, y - 1.5);
                    ctx.lineTo(x + 1.5, y + 3.5);
                    break;
                case 8:
                    ctx.moveTo(x - 5.5, y - 2.5);
                    ctx.lineTo(x, y + 3);
                    ctx.lineTo(x + 5.5, y - 2.5);
                    break;
                case 9:
                    ctx.moveTo(x - 5.5, y + 2.5);
                    ctx.lineTo(x, y - 3);
                    ctx.lineTo(x + 5.5, y + 2.5);
                    break;
                case 10:
                    ctx.moveTo(x + 2.5, y - 5.5);
                    ctx.lineTo(x - 3, y);
                    ctx.lineTo(x + 2.5, y + 5.5);
                    break;
            }
            ctx.stroke();
            ctx.restore();
        }
        drawKeyframeBar(x1, y1, x2, y2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #f2f2f2";
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            let [keyframe] = this.selectedKeyframes;
            for (let kui of this.kuis) {
                this.drawKUI(x1, y1, x2, y2, kui, keyframe);
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 0.5);
            ctx.lineTo(x2, y1 - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawKUI(x1, y1, x2, y2, kui, keyframe) {
            let { type, size } = kui;
            let x = floor(x1 + 6.5 + kui.x) + 0.5;
            let y = floor(y1 + kui.y) + 0.5;
            let w = round(size.w);
            let h = round(size.h);
            let radius = 4;
            let ctx = this.ctx;
            ctx.save();
            let c1 = " #666666";
            let c2 = " #f2f2f2";
            let isHover = this.hover[0] == "keyframeBar" && this.hover[1] == type;
            switch (type) {
                case 7:
                    isHover && (isHover = this.hover[2] == kui.interType);
                    break;
                case 8:
                    isHover && (isHover = this.hover[2] == kui.paramType);
                    break;
                case 10:
                    isHover && (isHover = this.hover[2] == kui.paramType && this.hover[3] == kui.paramValue);
                    break;
            }
            if (isHover) {
                c2 = " #cccccc";
                ctx.fillStyle = c2;
                this.drawRoundedRect(x, y, w, h, radius);
                ctx.fill();
            }
            if (type == 10 && keyframe && kui.paramValue &&
                keyframe.getParam(kui.paramType) == kui.paramValue) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = c1;
                this.drawRoundedRect(x, y, w, h, radius);
                ctx.stroke();
            }
            if (kui.text) {
                ctx.fillStyle = c1;
                ctx.textAlign = "left";
                switch (type) {
                    case 0:
                        ctx.font = "bold " + "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                        break;
                    case 2:
                        ctx.font = "italic " + "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                        ctx.fillStyle = " #999999";
                        break;
                    default:
                        ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
                        break;
                }
                let tx = x;
                let ty = y + h / 2;
                let tw = w;
                if (kui.interType !== undefined || kui.paramValue !== undefined) {
                    tx += 20;
                    tw -= 20;
                }
                let tt = getTranslate(kui.text);
                let tanim = this.tanim;
                if (keyframe && tanim)
                    switch (type) {
                        case 3:
                            tt = tt.replace("[TimeSec]", `${round(keyframe.x / tanim.fps, 4)}`);
                            break;
                        case 4:
                            tt = tt.replace("[TimeFrame]", `${round(keyframe.x, 4)}`);
                            break;
                        case 5:
                            tt = tt.replace("[TValue]", `${typeof keyframe.y == "number" ? round(keyframe.y, 4) : keyframe.y}`);
                            break;
                        case 6:
                            if (!kui.interType)
                                break;
                            tt = tt.replace("[InterType]", getTranslate(InterTypeStrings[kui.interType][1]));
                            break;
                        case 7:
                            if (!kui.interType)
                                break;
                            tt = tt.replace("[InterType]", getTranslate(InterTypeStrings[kui.interType][0]));
                            break;
                        case 8:
                            if (!kui.paramType)
                                break;
                            let param = keyframe.getParam(kui.paramType);
                            tt = tt.replace(`[${kui.paramType}]`, `${typeof param == "number" ? round(param, 4) : param}`);
                            break;
                        case 9:
                            let tradExpV = keyframe.getParam("tradExpV");
                            if (typeof tradExpV != "number")
                                break;
                            tt = tt.replace("[TradExpVM]", `${round(1 / tradExpV, 4)}`);
                            break;
                        case 11:
                            let lagrangeCX = keyframe.getParam("lagrangeCX");
                            if (typeof lagrangeCX !== "number")
                                break;
                            tt = tt.replace("[TimeSec]", `${round(lagrangeCX / tanim.fps, 4)}`);
                            break;
                    }
                ctx.fillText(tt, tx + 2, ty + h / 5, tw - 4);
            }
            if (kui.interType !== undefined) {
                this.drawKUIIcon(["interType", kui.interType], x + 20 / 2, y + h / 2, c1, c2);
            }
            else if (keyframe) {
                if (kui.paramType == "easeType" && kui.paramValue) {
                    this.drawKUIIcon(["easeType", kui.paramValue], x + h / 2, y + h / 2, c1, c2);
                }
                else if (kui.paramType == "bezierHandleType") {
                    this.drawKUIIcon(["bezierHandleType", kui.paramValue], x + h / 2, y + h / 2, c1, c2);
                }
            }
            ctx.restore();
        }
        drawKUIIcon(args, x, y, c1, c2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = c1;
            ctx.strokeStyle = c1;
            ctx.lineWidth = 1;
            x = floor(x) + 0.5;
            y = floor(y) + 0.5;
            let step = 0.1;
            ctx.beginPath();
            if (args[0] == "interType") {
                let interType = args[1];
                if (interType == "const") {
                    ctx.moveTo(x - 7, y + 6);
                    ctx.lineTo(x, y + 6);
                    ctx.lineTo(x, y - 6);
                    ctx.lineTo(x + 7, y - 6);
                    ctx.stroke();
                    this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                    this.drawKUIIconPoint(x, y - 6, c1, c2);
                }
                else if (interType == "linear") {
                    ctx.moveTo(x - 7, y + 6);
                    ctx.lineTo(x + 7, y - 6);
                    ctx.stroke();
                    this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                    this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
                }
                else if (interType == "bezier") {
                    ctx.moveTo(x - 7, y + 6);
                    ctx.lineTo(x + 5, y + 6);
                    ctx.moveTo(x + 7, y - 6);
                    ctx.lineTo(x - 5, y - 6);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x - 7, y + 6);
                    ctx.lineTo(x - 6, y + 6);
                    ctx.bezierCurveTo(x + 1, y + 6, x - 1, y - 6, x + 6, y - 6);
                    ctx.lineTo(x + 7, y - 6);
                    ctx.strokeStyle = c2;
                    ctx.lineWidth = 5;
                    ctx.stroke();
                    ctx.strokeStyle = c1;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                    this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
                    this.drawKUIIconPoint(x + 5, y + 6, c1, c1);
                    this.drawKUIIconPoint(x - 5, y - 6, c1, c1);
                }
                else if (interType == "lagrange") {
                    ctx.moveTo(x - 7, y + 6);
                    for (let x_ = x - 6; x_ <= x + 6; x_++) {
                        ctx.lineTo(x_, InterpolationFunctions.InterLag2(x - 6, y + 6, x + 6, y, x - 2, y - 3, x_));
                    }
                    ctx.lineTo(x + 7, y);
                    ctx.stroke();
                    this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                    this.drawKUIIconPoint(x + 7, y, c1, c2);
                    ctx.beginPath();
                    ctx.arc(x - 2, y - 3, 2.5, 0, 2 * PI);
                    ctx.fillStyle = c2;
                    ctx.fill();
                    this.drawKUIIconPoint(x - 2, y - 3, c1, c2);
                }
                else {
                    let x1 = x - 6;
                    let x2 = x + 6;
                    let y1 = y + 6;
                    let y2 = y - 6;
                    let fn;
                    switch (interType) {
                        case "power":
                            fn = t => t * t;
                            break;
                        case "exp":
                            fn = t => InterpolationFunctions.MapExpIn(t, 6.93);
                            break;
                        case "sine":
                            fn = InterpolationFunctions.MapSineIn;
                            break;
                        case "circular":
                            fn = InterpolationFunctions.MapCircIn;
                            break;
                        case "elastic":
                            fn = t => InterpolationFunctions.MapElasticIn(t, 2, 2.6);
                            y1 -= 3;
                            break;
                        case "back":
                            fn = t => InterpolationFunctions.MapBackIn(t, 2.6);
                            y1 -= 2;
                            break;
                        case "bounce":
                            fn = t => 1 - InterpolationFunctions.MapBounceOut(1 - t);
                            break;
                        case "tradExp":
                            fn = t => InterpolationFunctions.InterTradExp(0, 0, 1, 1, t, 2.5, 10);
                            break;
                    }
                    let w = x2 - x1;
                    let h = y2 - y1;
                    ctx.moveTo(x1 - 1, y1);
                    for (let t = 0; t <= 1; t += step) {
                        ctx.lineTo(x1 + w * t, y1 + h * fn(t));
                    }
                    ctx.lineTo(x2 + 1, y2);
                    ctx.stroke();
                    this.drawKUIIconPoint(x1 - 1, y1, c1, c2);
                    this.drawKUIIconPoint(x2 + 1, y2, c1, c2);
                }
            }
            else if (args[0] == "easeType") {
                ctx.moveTo(x - 7, y + 6);
                switch (args[1]) {
                    case "easeIn":
                        ctx.bezierCurveTo(x, y + 6, x + 7, y, x + 7, y - 6);
                        break;
                    case "easeOut":
                        ctx.bezierCurveTo(x - 7, y, x, y - 6, x + 7, y - 6);
                        break;
                    case "easeInOut":
                        ctx.bezierCurveTo(x + 1, y + 6, x - 1, y - 6, x + 7, y - 6);
                        break;
                    case "easeOutIn":
                        ctx.bezierCurveTo(x - 7, y - 1, x + 7, y + 1, x + 7, y - 6);
                        break;
                }
                ctx.stroke();
                this.drawKUIIconPoint(x - 7, y + 6, c1, c2);
                this.drawKUIIconPoint(x + 7, y - 6, c1, c2);
            }
            else if (args[0] == "bezierHandleType") {
                switch (args[1]) {
                    case "aligned":
                        let py = y - 6;
                        let cy = y - 5;
                        ctx.moveTo(x - 7, py);
                        ctx.lineTo(x + 7, py);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 7, y + 7);
                        ctx.bezierCurveTo(x - 7, y + 7, x - 5, cy, x, cy);
                        ctx.bezierCurveTo(x + 5, cy, x + 7, y + 7, x + 7, y + 7);
                        ctx.strokeStyle = c2;
                        ctx.lineWidth = 4;
                        ctx.stroke();
                        ctx.strokeStyle = c1;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        this.drawKUIIconPoint(x, py, c1, c2);
                        this.drawKUIIconPoint(x - 7, py, c1, c1);
                        this.drawKUIIconPoint(x + 7, py, c1, c1);
                        break;
                    case "auto":
                        let ax = x + 2;
                        ctx.moveTo(x - 7, y + 7);
                        ctx.bezierCurveTo(x - 7, y + 7, x - 5, y - 5, ax, y - 5);
                        ctx.bezierCurveTo(x + 6, y - 5, x + 7, y + 7, x + 7, y + 7);
                        ctx.strokeStyle = c2;
                        ctx.lineWidth = 4;
                        ctx.stroke();
                        ctx.strokeStyle = c1;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        this.drawKUIIconPoint(ax, y - 6, c1, c2);
                        break;
                    case "free":
                        let py_ = y - 6;
                        let cy_ = y - 5;
                        let hx = x + 1;
                        ctx.moveTo(hx, py_);
                        ctx.lineTo(hx, py_ + 10);
                        ctx.moveTo(x, py_);
                        ctx.lineTo(x + 7, py_);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - 7, y + 7);
                        ctx.bezierCurveTo(x - 7, y + 7, x, cy_ + 7, x, cy_);
                        ctx.bezierCurveTo(x + 5, cy_, x + 7, y + 7, x + 7, y + 7);
                        ctx.strokeStyle = c2;
                        ctx.lineWidth = 4;
                        ctx.stroke();
                        ctx.strokeStyle = c1;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        this.drawKUIIconPoint(x, py_, c1, c2);
                        this.drawKUIIconPoint(hx, py_ + 10, c1, c1);
                        this.drawKUIIconPoint(x + 7, py_, c1, c1);
                        break;
                    case "vector":
                        ctx.moveTo(x - 7, y + 7);
                        ctx.lineTo(x, y - 6);
                        ctx.lineTo(x + 7, y + 7);
                        ctx.stroke();
                        this.drawKUIIconPoint(x, y - 6, c1, c2);
                        break;
                }
            }
            ctx.restore();
        }
        drawKUIIconPoint(x, y, c1, c2) {
            let ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * PI);
            ctx.fillStyle = c2;
            ctx.fill();
            ctx.strokeStyle = c1;
            ctx.stroke();
            ctx.restore();
        }
        drawClose(x, y, w, h, uiState) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
                ctx.fillStyle = " #cccccc";
                ctx.fillRect(x - w / 2, y - h / 2, w, h);
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 5, y - 5);
            ctx.lineTo(x + 5, y + 5);
            ctx.moveTo(x + 5, y - 5);
            ctx.lineTo(x - 5, y + 5);
            ctx.stroke();
            ctx.restore();
        }
        drawMinimize(x, y, w, h, uiState) {
            let ctx = this.ctx;
            ctx.save();
            if (uiState == 1) {
                ctx.fillStyle = " #cccccc";
                ctx.fillRect(x - w / 2, y - h / 2, w, h);
            }
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 5, y - 0.5);
            ctx.lineTo(x + 5, y - 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawHeader(w, h) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #e6e6e6";
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.fillStyle = " #333333";
            ctx.fillText(this.title, 8, h / 2);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h + 0.5);
            ctx.lineTo(w, h + 0.5);
            ctx.stroke();
            ctx.restore();
        }
        drawHintBar(y, w, h) {
            let ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = " #d9d9d9";
            ctx.fillRect(0, y - h, w, h);
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "14px \"MicrosoftYaHei\", \"Microsoft YaHei\", \"\u5FAE\u8F6F\u96C5\u9ED1\", STXihei, \"\u534E\u6587\u7EC6\u9ED1\", Arial, sans-serif";
            ctx.fillStyle = " #333333";
            ctx.fillText(this.hint[0], 8, y - h / 2 - 10);
            ctx.fillText(this.hint[1], 8, y - h / 2 + 10);
            ctx.strokeStyle = " #666666";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y - h + 0.5);
            ctx.lineTo(w, y - h + 0.5);
            ctx.stroke();
            ctx.restore();
        }
    }
    let TheTanimEditor = null;
    class CQEasyTanim {
        getInfo() {
            return {
                id: TheExtensionID,
                name: getTranslate("CQET_extName"),
                color1: "#d92644",
                color2: "#ad1f36",
                color3: "#82172b",
                blocks: [
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("CQET_buttonTutorial"),
                        func: "OnClickTutorialButton",
                    },
                    {
                        blockType: Scratch.BlockType.BUTTON,
                        text: getTranslate("CQET_buttonEditor"),
                        func: "OnClickEditorButton",
                    },
                    {
                        opcode: "BGetTanimValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetTanimValue"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        opcode: "BGetTanimInfo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetTanimInfo"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            tanimInfoType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimInfoType",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelContext"),
                    },
                    {
                        opcode: "BSetContext",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bSetContext"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                        },
                    },
                    {
                        opcode: "BGetContextValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetContextValue"),
                        arguments: {
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelSnapshot"),
                    },
                    {
                        opcode: "BCreateSnapshot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bCreateSnapshot"),
                        arguments: {
                            tanimName: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimName",
                            },
                            loopMode: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MLoopMode",
                            },
                            time: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            timeUnit: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTimeUnit",
                            },
                        },
                    },
                    {
                        opcode: "BTransitSnapshot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bTransitSnapshot"),
                        arguments: {
                            snapshotIndexA: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            snapshotIndexB: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            },
                            transitT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5,
                            },
                        },
                    },
                    {
                        opcode: "BGetSnapshotValue",
                        blockType: Scratch.BlockType.REPORTER,
                        text: getTranslate("CQET_bGetSnapshotValue"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            tanimValueType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MTanimValueType",
                            },
                        },
                    },
                    {
                        opcode: "BSetContextBySnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bSetContextBySnapshot"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "BDeleteSnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bDeleteSnapshot"),
                        arguments: {
                            snapshotIndex: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "BDeleteAllSnapshot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: getTranslate("CQET_bDeleteAllSnapshot"),
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: getTranslate("CQET_labelUtils"),
                    },
                ],
                menus: {
                    ["MTanimName"]: {
                        acceptReporters: true,
                        items: "MGetTanimNames",
                    },
                    ["MLoopMode"]: {
                        acceptReporters: true,
                        items: [
                            {
                                text: getTranslate("CQET_mLoopMode_loop"),
                                value: "loop",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_once"),
                                value: "once",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_loopYoyo"),
                                value: "loop-yoyo",
                            },
                            {
                                text: getTranslate("CQET_mLoopMode_onceYoyo"),
                                value: "once-yoyo",
                            },
                        ],
                    },
                    ["MTimeUnit"]: {
                        acceptReporters: true,
                        items: [
                            {
                                text: getTranslate("CQET_mTimeUnit_second"),
                                value: "second",
                            },
                            {
                                text: getTranslate("CQET_mTimeUnit_frame"),
                                value: "frame",
                            },
                        ],
                    },
                    ["MTanimValueType"]: {
                        acceptReporters: true,
                        items: "MGetTanimValueTypes",
                    },
                    ["MTanimInfoType"]: {
                        acceptReporters: false,
                        items: [
                            {
                                text: getTranslate("CQET_mTanimInfoType_lengthSec"),
                                value: "lengthSec",
                            },
                            {
                                text: getTranslate("CQET_mTanimInfoType_length"),
                                value: "length",
                            },
                            {
                                text: getTranslate("CQET_mTanimInfoType_fps"),
                                value: "fps",
                            },
                        ],
                    },
                },
            };
        }
        OnClickTutorialButton() {
            alert("暂无教程！");
        }
        OnClickEditorButton() {
            if (!TheTanimEditor)
                TheTanimEditor = new TanimEditor();
            if (TheTanimEditor.isShow) {
                TheTanimEditor.isShow = false;
                TheTanimEditor.root.style.display = "none";
            }
            else {
                TheTanimEditor.isShow = true;
                TheTanimEditor.root.style.display = "flex";
            }
        }
        constructor() {
            runtime.on("PROJECT_LOADED", () => this.OnClickEditorButton());
        }
        MGetTanimNames() {
            let tanimNames = [];
            for (let i = 0; i < TheTanimManager.tanims.length; i++) {
                let name = TheTanimManager.tanims[i].name;
                tanimNames.push({ text: name, value: name });
            }
            if (tanimNames.length == 0)
                tanimNames.push({ text: getTranslate("CQET_tanimMenuPlaceholder"), value: "" });
            return tanimNames;
        }
        MGetTanimValueTypes() {
            let tanimValueTypes = [];
            for (let i = 0; i < TheTanimManager.tValueTypes.length; i++) {
                let tValueType = TheTanimManager.tValueTypes[i];
                let text;
                switch (tValueType) {
                    case "px":
                        text = getTranslate("CQET_mTanimValueType_px");
                        break;
                    case "py":
                        text = getTranslate("CQET_mTanimValueType_py");
                        break;
                    case "s":
                        text = getTranslate("CQET_mTanimValueType_s");
                        break;
                    case "sx":
                        text = getTranslate("CQET_mTanimValueType_sx");
                        break;
                    case "sy":
                        text = getTranslate("CQET_mTanimValueType_sy");
                        break;
                    case "sq":
                        text = getTranslate("CQET_mTanimValueType_sq");
                        break;
                    case "sqx":
                        text = getTranslate("CQET_mTanimValueType_sqx");
                        break;
                    case "sqy":
                        text = getTranslate("CQET_mTanimValueType_sqy");
                        break;
                    case "d":
                        text = getTranslate("CQET_mTanimValueType_d");
                        break;
                    case "cos":
                        text = getTranslate("CQET_mTanimValueType_cos");
                        break;
                    default:
                        text = tValueType;
                        break;
                }
                tanimValueTypes.push({ text: text, value: tValueType });
            }
            return tanimValueTypes;
        }
        ["BGetTanimValue"]({ tanimName, loopMode, time, timeUnit, tanimValueType }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            tanimValueType = Cast.toString(tanimValueType);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return safeTValue(null, tanimValueType);
            return safeTValue(tanim.getTValue(tanimValueType, time, timeUnit, loopMode), tanimValueType);
        }
        ["BGetTanimInfo"]({ tanimName, tanimInfoType }) {
            tanimName = Cast.toString(tanimName);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            tanimInfoType = Cast.toString(tanimInfoType);
            switch (tanimInfoType) {
                case "lengthSec":
                    return Cast.toNumber(tanim.length / tanim.fps);
                case "length":
                    return Cast.toNumber(tanim.length);
                case "fps":
                    return Cast.toNumber(tanim.fps);
                default:
                    return 0;
            }
        }
        ["BSetContext"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return;
            TheTanimManager.context = tanim.getSnapshot(time, timeUnit, loopMode);
        }
        ["BGetContextValue"]({ tanimValueType }) {
            tanimValueType = Cast.toString(tanimValueType);
            return TheTanimManager.getContextValue(tanimValueType);
        }
        ["BCreateSnapshot"]({ tanimName, loopMode, time, timeUnit }) {
            tanimName = Cast.toString(tanimName);
            time = Cast.toNumber(time);
            let tanim = TheTanimManager.getTanimByName(tanimName);
            if (!tanim)
                return 0;
            let snapshot = tanim.getSnapshot(time, timeUnit, loopMode);
            let index = TheTanimManager.allocateSnapshotIndex(snapshot);
            return index + 1;
        }
        ["BTransitSnapshot"]({ snapshotIndexA, snapshotIndexB, transitT }) {
            snapshotIndexA = Cast.toNumber(snapshotIndexA);
            snapshotIndexB = Cast.toNumber(snapshotIndexB);
            transitT = Cast.toNumber(transitT);
            let snapshotA = TheTanimManager.getSnapshotByIndex(snapshotIndexA - 1);
            if (snapshotA === null)
                return 0;
            let snapshotB = TheTanimManager.getSnapshotByIndex(snapshotIndexB - 1);
            if (snapshotB === null)
                return 0;
            let snapshot = TheTanimManager.transitSnapshot(snapshotA, snapshotB, clamp(transitT, 0, 1));
            let index = TheTanimManager.allocateSnapshotIndex(snapshot);
            return index + 1;
        }
        ["BGetSnapshotValue"]({ snapshotIndex, tanimValueType }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return safeTValue(null, tanimValueType);
            tanimValueType = Cast.toString(tanimValueType);
            return getSnapshotValue(snapshot, tanimValueType);
        }
        ["BSetContextBySnapshot"]({ snapshotIndex }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            let snapshot = TheTanimManager.getSnapshotByIndex(snapshotIndex - 1);
            if (snapshot === null)
                return;
            TheTanimManager.context = snapshot;
        }
        ["BDeleteSnapshot"]({ snapshotIndex }) {
            snapshotIndex = Cast.toNumber(snapshotIndex);
            TheTanimManager.recycleSnapshotIndex(snapshotIndex - 1);
        }
        ["BDeleteAllSnapshot"]() {
            TheTanimManager.recycleAllSnapshot();
        }
    }
    Scratch.extensions.register(new CQEasyTanim());
    console.log(`=== Easy Tanim ${TheExtensionVersion} ===

https://github.com/Heaveeeen/CQEasyTanim

这是一个 Scratch 扩展。本扩展能够轻松实现时间轴动画。内置动画编辑器，完美兼容 turbowarp。

作者：苍穹
感谢 arkos、白猫、simple、允某、酷可mc 等人，他们给我提供了许多帮助，在此不一一列举。（太多了列不出来）
arkos 给我提供了很多技术上的帮助，教我怎么写扩展，我爱他❤️
一些缓动函数抄自 https://blog.51cto.com/u_15057855/4403832 （从 Animator 扩展那里翻到的链接，非常感谢！）

=== Easy Tanim ${TheExtensionVersion} ===`);
})(Scratch);