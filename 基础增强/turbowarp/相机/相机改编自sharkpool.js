// 名称: 摄像机 V2 增强版
// ID: SPcamera
// 描述: 移动舞台的可见部分，包含边界控制、动画和追踪功能。
// 作者: SharkPool
// 许可证: MIT

// 版本 V.2.5.0

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed)
    throw new Error("摄像机扩展必须在非沙箱环境下运行！");

  const menuIconURI =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDQxIDQxIj48ZyBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTAgMjAuNUMwIDkuMTc4IDkuMTc4IDAgMjAuNSAwUzQxIDkuMTc4IDQxIDIwLjUgMzEuODIyIDQxIDIwLjUgNDEgMCAzMS44MjIgMCAyMC41IiBmaWxsPSIjMjg1MWM5Ii8+PHBhdGggZD0iTTIuMzc4IDIwLjVjMC0xMC4wMDkgOC4xMTMtMTguMTIyIDE4LjEyMi0xOC4xMjJTMzguNjIyIDEwLjQ5MSAzOC42MjIgMjAuNSAzMC41MDkgMzguNjIyIDIwLjUgMzguNjIyIDIuMzc4IDMwLjUwOSAyLjM3OCAyMC41IiBmaWxsPSIjNTE3YWY1Ii8+PHBhdGggZD0iTTMxLjg3MSAxNS4wMDdjLjA3My4xNDkuMTI5LjI4LjEyOS4yNDN2MTAuM2MwIC4yODMtLjIzMy41LS41LjVhLjMuMyAwIDAgMS0uMTQ2LS4wNTRsLS4wOTctLjA3NUwyNSAyMi4xNjd2Mi4yODNjMCAxLjk0Ny0xLjU5OCAzLjYtMy41IDMuNmgtOC45Yy0yLjAxNS0uMDg4LTMuNi0xLjY3My0zLjYtMy42di03LjljMC0yLjAyNCAxLjU3Ni0zLjYgMy42LTMuNmg4LjljMS45MzcgMCAzLjUgMS41OSAzLjUgMy42djIuMzJsNi4xNzItNGMuMjctLjE2Mi41NTQtLjEwNS43LjEzN3oiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+";
  const rightArrow =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIyLjY4IDEyLjJhMS42IDEuNiAwIDAgMS0xLjI3LjYzaC03LjY5YTEuNTkgMS41OSAwIDAgMS0xLjE2LTIuNThsMS4xMi0xLjQxYTQuODIgNC44MiAwIDAgMC0zLjE0LS43NyA0LjMgNC4zIDAgMCAwLTIgLjhBNC4yNSA0LjI1IDAgMCAwIDcuMiAxMC42YTUuMDYgNS4wNiAwIDAgMCAuNTQgNC42MkE1LjU4IDUuNTggMCAwIDAgMTIgMTcuNzRhMi4yNiAyLjI2IDAgMCAxLS4xNiA0LjUyQTEwLjI1IDEwLjI1IDAgMCAxIDMuNzQgMThhMTAuMTQgMTAuMTQgMCAwIDEtMS40OS05LjIyIDkuNyA5LjcgMCAwIDEgMi44My00LjE0QTkuOSA5LjkgMCAwIDEgOS42NiAyLjVhMTAuNjYgMTAuNjYgMCAwIDEgNy43MiAxLjY4bDEuMDgtMS4zNWExLjU3IDEuNTcgMCAwIDEgMS4yNC0uNiAxLjYgMS42IDAgMCAxIDEuNTQgMS4yMWwxLjcgNy4zN2ExLjU3IDEuNTcgMCAwIDEtLjI2IDEuMzkiIHN0eWxlPSJmaWxsOiMwMDA7b3BhY2l0eTouMiIvPjxwYXRoIGQ9Ik0yMS4zOCAxMS44M2gtNy42MWEuNTkuNTkgMCAwIDEtLjQzLTFsMS43NS0yLjE5YTUuOSA1LjkgMCAwIDAtNC43LTEuNTggNS4wNyA5MiAwIDAgMC00LjExIDMuMTdBNiA2IDAgMCAwIDcgMTUuNzdhNi41MSA2LjUxIDAgMCAwIDUgMi45MiAxLjMxIDEuMzEgMCAwIDEtLjA4IDIuNjIgOS4zIDkuMyAwIDAgMS03LjM1LTMuODIgOS4xNiA5LjE2IDAgMCAxLTEuNC04LjM3QTguNSA4LjUgMCAwIDEgNS43MSA1LjRhOC43NiA4Ljc2IDAgMCAxIDQuMTEtMS45MiA5LjcgOS43IDAgMCAxIDcuNzUgMi4wN2wxLjY3LTIuMWEuNTkuNTkgMCAwIDEgMSAuMjFMMjIgMTEuMDhhLjU5LjU5IDAgMCAxLS42Mi43NSIgc3R5bGU9ImZpbGw6I2ZmZiIvPjwvc3ZnPg==";
  const leftArrow =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIwLjM0IDE4LjIxYTEwLjI0IDEwLjI0IDAgMCAxLTguMSA0LjIyIDIuMjYgMi4yNiAwIDAgMS0uMTYtNC41MiA1LjU4IDUuNTggMCAwIDAgNC4yNS0yLjUzIDUuMDYgNS4wNiAwIDAgMCAuNTQtNC42MkE0LjI1IDQuMjUgMCAwIDAgMTUuNTUgOWE0LjMgNC4zIDAgMCAwLTItLjggNC44MiA0LjgyIDAgMCAwLTMuMTUuOGwxLjEyIDEuNDFBMS41OSAxLjU5IDAgMCAxIDEwLjM2IDEzSDIuNjdhMS41NiAxLjU2IDAgMCAxLTEuMjYtLjYzQTEuNTQgMS41NCAwIDAgMSAxLjEzIDExbDEuNzItNy40M0ExLjU5IDEuNTkgMCAwIDEgNC4zOCAyLjRhMS41NyAxLjU3IDAgMCAxIDEuMjQuNkw2LjcgNC4zNWExMC42NiAxMC42NiAwIDAgMSA3LjcyLTEuNjhBOS45IDkuOSAwIDAgMSAxOSA0LjgxIDkuNiA5LjYgMCAwIDEgMjEuODMgOWExMC4wOCAxMC4wOCAwIDAgMS0xLjQ5IDkuMjEiIHN0eWxlPSJmaWxsOiMwMDA7b3BhY2l0eTouMiIvPjxwYXRoIGQ9Ik0xOS41NiAxNy42NWE5LjI5IDkuMjkgMCAwIDEtNy4zNSAzLjgzIDEuMzEgMS4zMSAwIDAgMS0uMDgtMi42MiA2LjUzIDYuNTMgMCAwIDAgNS0yLjkyIDYuMDUgNi4wNSAwIDAgMCAuNjctNS41MSA1LjMgNS4zIDAgMCAwLTEuNjQtMi4xNiA1LjIgNS4yIDAgMCAwLTIuNDgtMUE1Ljg2IDUuODYgMCAwIDAgOSA4Ljg0TDEwLjc0IDExYS41OS41OSAwIDAgMS0uNDMgMUgyLjdhLjYuNiAwIDAgMS0uNi0uNzVsMS43MS03LjQyYS41OS41OSAwIDAgMSAxLS4yMWwxLjY3IDIuMWE5LjcgOS43IDAgMCAxIDcuNzUtMi4wNyA4Ljg0IDguODQgMCAwIDEgNC4xMiAxLjkyIDguNyA4LjcgMCAwIDEgMi41NCAzLjcyIDkuMTQgOS4xNCAwIDAgMS0xLjMzIDguMzYiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4=";

  const Cast = Scratch.Cast;
  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const render = vm.renderer;
  const cameraSymbol = Symbol("SPcameraData");

  // 新增数据结构
  let allCameras = {
    default: {
      xy: [0, 0],
      zoom: 1,
      dir: 0,
      bounds: {
        top: Infinity,
        bottom: -Infinity,
        left: -Infinity,
        right: Infinity
      },
      animation: null,
      tracking: {
        target: null,
        offsetX: 0,
        offsetY: 0,
        algorithm: 'nonlinear_smooth',
        active: false,
        // 新增跟踪模式属性
        mode: 'standard', // 标准跟踪模式
        // 扩展的跟踪模式配置
        orbit: {
          radius: 100,
          angle: 0,
          speed: 0.02,
          followHeight: true
        },
        path: {
          waypoints: [],
          currentWaypoint: 0,
          speed: 0.05,
          loop: false,
          followTarget: false
        },
        shake: {
          intensity: 0,
          decay: 0.9,
          active: false
        },
        parallax: {
          layers: [],
          depthFactor: 0.5
        },
        cinematic: {
          focusPoints: [],
          currentFocus: 0,
          transitionTime: 1,
          autoTransition: false,
          rhythm: 0
        },
        physics: {
          mass: 1,
          stiffness: 0.2,
          damping: 0.05,
          velocityX: 0,
          velocityY: 0
        },
        adaptive: {
          speedFactor: 0.1,
          zoomFactor: 0.05,
          rotationFactor: 0.05
        },
        bezier: {
          controlPoints: [],
          t: 0,
          speed: 0.01
        },
        // 其他原有参数保持不变
        region: {
          x: 0,
          y: 0,
          width: 200,
          height: 150,
          active: false
        },
        lagFactor: 0.1,
        predictionFactor: 0.5,
        elasticity: 0.1,
        damping: 0.05,
        velocityX: 0,
        velocityY: 0,
        smoothZone: {
          inner: 50,
          outer: 100,
          maxSpeed: 0.2
        },
        lookAheadDistance: 50,
        autoZoom: {
          enabled: false,
          minZoom: 0.5,
          maxZoom: 2.0,
          targetZoom: 1.0,
          speedFactor: 0.1
        },
        // 新增：智能跟踪
        intelligent: {
          reactionTime: 0.3,
          anticipation: 0.7,
          smoothness: 0.8
        }
      },
      binds: undefined,
    },
  };

  // 新增：目标边界限制属性
  const targetBoundRestricted = new WeakMap();
  
  // 新增：缓动函数库
  const easingFunctions = {
    linear: t => t,
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutBounce: t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    },
    easeInOutElastic: t => {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    },
    easeOutBack: t => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInOutExpo: t => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if ((t /= 0.5) < 1) return Math.pow(2, 10 * (t - 1)) / 2;
      return (2 - Math.pow(2, -10 * --t)) / 2;
    }
  };

  // 新增：动画系统
  let activeAnimations = new Map();
  let lastUpdateTime = Date.now();
  
  // 新增：存储目标历史位置（用于预测跟踪）
  const targetHistory = new WeakMap();

  // 更新动画
  function updateAnimations() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    for (const [cameraName, animation] of activeAnimations.entries()) {
      const cam = allCameras[cameraName];
      if (!cam || !animation) continue;

      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = easingFunctions[animation.easing](progress);

      if (animation.type === 'move' || animation.type === 'both') {
        cam.xy[0] = animation.startX + (animation.targetX - animation.startX) * easedProgress;
        cam.xy[1] = animation.startY + (animation.targetY - animation.startY) * easedProgress;
      }

      if (animation.type === 'zoom' || animation.type === 'both') {
        cam.zoom = animation.startZoom + (animation.targetZoom - animation.startZoom) * easedProgress;
      }

      if (animation.type === 'rotate') {
        cam.dir = animation.startDir + (animation.targetDir - animation.startDir) * easedProgress;
      }

      if (progress >= 1) {
        activeAnimations.delete(cameraName);
        cam.animation = null;
      }

      updateCamera(cameraName);
    }

    // 更新摄像机追踪
    updateCameraTracking(deltaTime);
  }

  // 新增：贝塞尔曲线计算
  function bezierCurve(points, t) {
    if (points.length === 1) return points[0];
    
    const newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const x = (1 - t) * points[i].x + t * points[i + 1].x;
      const y = (1 - t) * points[i].y + t * points[i + 1].y;
      newPoints.push({ x, y });
    }
    
    return bezierCurve(newPoints, t);
  }

  // 新增：噪声函数（用于摄像机抖动）
  function noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = x * x * x * (x * (x * 6 - 15) + 10);
    const v = y * y * y * (y * (y * 6 - 15) + 10);
    
    const a = Math.sin(X + Y * 57) * 43758.5453123;
    const b = Math.sin(X + 1 + Y * 57) * 43758.5453123;
    const c = Math.sin(X + (Y + 1) * 57) * 43758.5453123;
    const d = Math.sin(X + 1 + (Y + 1) * 57) * 43758.5453123;
    
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  }

  // 新增：更新目标历史
  function updateTargetHistory(target, x, y) {
    if (!target) return;
    
    let history = targetHistory.get(target);
    if (!history) {
      history = { positions: [], timestamps: [], maxLength: 10 };
      targetHistory.set(target, history);
    }
    
    history.positions.push({ x, y });
    history.timestamps.push(Date.now());
    
    // 保持历史记录长度
    if (history.positions.length > history.maxLength) {
      history.positions.shift();
      history.timestamps.shift();
    }
  }

  // 新增：获取目标速度
  function getTargetVelocity(target) {
    const history = targetHistory.get(target);
    if (!history || history.positions.length < 2) {
      return { vx: 0, vy: 0 };
    }
    
    const lastPos = history.positions[history.positions.length - 1];
    const prevPos = history.positions[history.positions.length - 2];
    const lastTime = history.timestamps[history.timestamps.length - 1];
    const prevTime = history.timestamps[history.timestamps.length - 2];
    
    const dt = (lastTime - prevTime) || 1;
    const vx = (lastPos.x - prevPos.x) / dt;
    const vy = (lastPos.y - prevPos.y) / dt;
    
    return { vx, vy };
  }

  // 新增：获取目标加速度
  function getTargetAcceleration(target) {
    const history = targetHistory.get(target);
    if (!history || history.positions.length < 3) {
      return { ax: 0, ay: 0 };
    }
    
    const velocities = [];
    for (let i = 1; i < history.positions.length; i++) {
      const dx = history.positions[i].x - history.positions[i-1].x;
      const dy = history.positions[i].y - history.positions[i-1].y;
      const dt = history.timestamps[i] - history.timestamps[i-1] || 1;
      velocities.push({ vx: dx/dt, vy: dy/dt });
    }
    
    if (velocities.length < 2) return { ax: 0, ay: 0 };
    
    const lastV = velocities[velocities.length - 1];
    const prevV = velocities[velocities.length - 2];
    const dt = (history.timestamps[history.timestamps.length - 1] - 
                history.timestamps[history.timestamps.length - 3]) || 1;
    
    return {
      ax: (lastV.vx - prevV.vx) / dt,
      ay: (lastV.vy - prevV.vy) / dt
    };
  }

  // 新增：更新摄像机追踪
  function updateCameraTracking(deltaTime) {
    const deltaSeconds = deltaTime / 1000;
    
    for (const [cameraName, cam] of Object.entries(allCameras)) {
      if (cam.tracking.active && cam.tracking.target) {
        const target = runtime.getSpriteTargetByName(cam.tracking.target);
        if (target) {
          // 更新目标历史
          updateTargetHistory(target, target.x, target.y);
          
          const targetX = -target.x + cam.tracking.offsetX;
          const targetY = -target.y + cam.tracking.offsetY;
          
          let newX = cam.xy[0];
          let newY = cam.xy[1];
          let newZoom = cam.zoom;
          let newDir = cam.dir;
          
          // 根据跟踪模式计算新位置
          switch (cam.tracking.mode) {
            case 'orbit':
              // 圆周跟踪
              const orbit = cam.tracking.orbit;
              orbit.angle += orbit.speed * deltaTime;
              
              const radius = orbit.radius / (cam.zoom || 1);
              const orbitX = targetX + Math.cos(orbit.angle) * radius;
              const orbitY = targetY + Math.sin(orbit.angle) * radius;
              
              if (orbit.followHeight) {
                const heightFactor = Math.abs(target.y) / 1000;
                orbit.radius = 100 + heightFactor * 50;
              }
              
              newX += (orbitX - newX) * 0.1;
              newY += (orbitY - newY) * 0.1;
              break;
              
            case 'path':
              // 路径跟踪
              const path = cam.tracking.path;
              if (path.waypoints.length > 0) {
                const current = path.waypoints[path.currentWaypoint];
                const targetPos = { x: -current.x + cam.tracking.offsetX, y: -current.y + cam.tracking.offsetY };
                
                const dx = targetPos.x - newX;
                const dy = targetPos.y - newY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < 10) {
                  path.currentWaypoint++;
                  if (path.currentWaypoint >= path.waypoints.length) {
                    if (path.loop) {
                      path.currentWaypoint = 0;
                    } else {
                      cam.tracking.active = false;
                    }
                  }
                }
                
                newX += dx * path.speed;
                newY += dy * path.speed;
              }
              break;
              
            case 'physics':
              // 物理模拟跟踪
              const physics = cam.tracking.physics;
              const dx = targetX - newX;
              const dy = targetY - newY;
              
              // 弹簧力
              const forceX = dx * physics.stiffness;
              const forceY = dy * physics.stiffness;
              
              // 加速度 = 力 / 质量
              const accelX = forceX / physics.mass;
              const accelY = forceY / physics.mass;
              
              // 更新速度
              physics.velocityX += accelX * deltaSeconds;
              physics.velocityY += accelY * deltaSeconds;
              
              // 应用阻尼
              physics.velocityX *= (1 - physics.damping);
              physics.velocityY *= (1 - physics.damping);
              
              // 更新位置
              newX += physics.velocityX;
              newY += physics.velocityY;
              break;
              
            case 'adaptive':
              // 自适应跟踪
              const adaptive = cam.tracking.adaptive;
              const velocity = getTargetVelocity(target);
              const speed = Math.sqrt(velocity.vx*velocity.vx + velocity.vy*velocity.vy);
              
              // 根据目标速度调整跟踪速度
              const adaptiveSpeed = adaptive.speedFactor * (1 + speed * 0.1);
              newX += (targetX - newX) * adaptiveSpeed;
              newY += (targetY - newY) * adaptiveSpeed;
              
              // 根据目标速度调整缩放
              if (adaptive.zoomFactor > 0) {
                const targetZoom = 1 / (1 + speed * 0.01);
                newZoom += (targetZoom - newZoom) * adaptive.zoomFactor;
              }
              
              // 根据目标方向调整旋转
              if (adaptive.rotationFactor > 0 && speed > 0.1) {
                const targetAngle = Math.atan2(velocity.vy, velocity.vx) * 180 / Math.PI;
                const angleDiff = ((targetAngle - newDir) + 180) % 360 - 180;
                newDir += angleDiff * adaptive.rotationFactor;
              }
              break;
              
            case 'bezier':
              // 贝塞尔曲线跟踪
              const bezier = cam.tracking.bezier;
              if (bezier.controlPoints.length >= 2) {
                bezier.t += bezier.speed * deltaTime / 1000;
                if (bezier.t > 1) bezier.t = 0;
                
                const point = bezierCurve(bezier.controlPoints, bezier.t);
                const bezierTargetX = -point.x + cam.tracking.offsetX;
                const bezierTargetY = -point.y + cam.tracking.offsetY;
                
                newX += (bezierTargetX - newX) * 0.1;
                newY += (bezierTargetY - newY) * 0.1;
              }
              break;
              
            case 'intelligent':
              // 智能跟踪
              const intelligent = cam.tracking.intelligent;
              const targetVel = getTargetVelocity(target);
              const targetAccel = getTargetAcceleration(target);
              
              // 预测位置
              const predictedX = targetX - targetVel.vx * intelligent.anticipation * 1000;
              const predictedY = targetY - targetVel.vy * intelligent.anticipation * 1000;
              
              // 平滑移动
              const smoothSpeed = intelligent.smoothness * 0.1;
              newX += (predictedX - newX) * smoothSpeed;
              newY += (predictedY - newY) * smoothSpeed;
              break;
              
            case 'cinematic':
              // 电影式跟踪
              const cinematic = cam.tracking.cinematic;
              if (cinematic.focusPoints.length > 0) {
                if (cinematic.autoTransition) {
                  cinematic.rhythm += deltaTime / 1000;
                  if (cinematic.rhythm > cinematic.transitionTime) {
                    cinematic.rhythm = 0;
                    cinematic.currentFocus = (cinematic.currentFocus + 1) % cinematic.focusPoints.length;
                  }
                }
                
                const focus = cinematic.focusPoints[cinematic.currentFocus];
                const focusTargetX = -focus.x + cam.tracking.offsetX;
                const focusTargetY = -focus.y + cam.tracking.offsetY;
                
                const progress = cinematic.rhythm / cinematic.transitionTime;
                const easedProgress = easingFunctions.easeInOutSine(progress);
                
                newX += (focusTargetX - newX) * easedProgress * 0.1;
                newY += (focusTargetY - newY) * easedProgress * 0.1;
              }
              break;
              
            default:
              // 原有的跟踪模式
              const targetPosX = targetX;
              const targetPosY = targetY;
              
              switch (cam.tracking.mode) {
                case 'standard':
                  switch (cam.tracking.algorithm) {
                    case 'hard':
                      newX = targetPosX;
                      newY = targetPosY;
                      break;
                    case 'nonlinear':
                      newX += (targetPosX - newX) * 0.2;
                      newY += (targetPosY - newY) * 0.2;
                      break;
                    case 'nonlinear_smooth':
                    default:
                      newX += (targetPosX - newX) * 0.1;
                      newY += (targetPosY - newY) * 0.1;
                      break;
                  }
                  break;
                  
                case 'lag':
                  const lag = cam.tracking.lagFactor || 0.1;
                  newX += (targetPosX - newX) * lag;
                  newY += (targetPosY - newY) * lag;
                  break;
                  
                case 'lock_x':
                  newX = targetPosX;
                  break;
                  
                case 'lock_y':
                  newY = targetPosY;
                  break;
                  
                case 'region':
                  if (cam.tracking.region.active) {
                    const region = cam.tracking.region;
                    const screenX = -cam.xy[0];
                    const screenY = -cam.xy[1];
                    const distX = Math.abs(target.x - screenX);
                    const distY = Math.abs(target.y - screenY);
                    
                    if (distX > region.width/2 || distY > region.height/2) {
                      newX = targetPosX;
                      newY = targetPosY;
                    }
                  } else {
                    newX = targetPosX;
                    newY = targetPosY;
                  }
                  break;
                  
                case 'predictive':
                  const velocity2 = getTargetVelocity(target);
                  const prediction = cam.tracking.predictionFactor || 0.5;
                  const predictedX2 = targetPosX - velocity2.vx * prediction * 1000;
                  const predictedY2 = targetPosY - velocity2.vy * prediction * 1000;
                  
                  newX += (predictedX2 - newX) * 0.1;
                  newY += (predictedY2 - newY) * 0.1;
                  break;
                  
                case 'elastic':
                  const elasticity = cam.tracking.elasticity || 0.1;
                  const damping = cam.tracking.damping || 0.05;
                  
                  const forceX2 = (targetPosX - newX) * elasticity;
                  const forceY2 = (targetPosY - newY) * elasticity;
                  
                  cam.tracking.velocityX += forceX2;
                  cam.tracking.velocityY += forceY2;
                  
                  cam.tracking.velocityX *= (1 - damping);
                  cam.tracking.velocityY *= (1 - damping);
                  
                  newX += cam.tracking.velocityX;
                  newY += cam.tracking.velocityY;
                  break;
                  
                case 'smooth_zone':
                  const zone = cam.tracking.smoothZone || { inner: 50, outer: 100, maxSpeed: 0.2 };
                  const screenPos = { x: -cam.xy[0], y: -cam.xy[1] };
                  const dx2 = target.x - screenPos.x;
                  const dy2 = target.y - screenPos.y;
                  const distance2 = Math.sqrt(dx2*dx2 + dy2*dy2);
                  
                  if (distance2 > zone.outer) {
                    newX = targetPosX;
                    newY = targetPosY;
                  } else if (distance2 > zone.inner) {
                    const t = (distance2 - zone.inner) / (zone.outer - zone.inner);
                    const speed2 = t * zone.maxSpeed;
                    newX += (targetPosX - newX) * speed2;
                    newY += (targetPosY - newY) * speed2;
                  }
                  break;
                  
                case 'look_ahead':
                  const lookDistance = cam.tracking.lookAheadDistance || 50;
                  const targetDir = target.direction || 0;
                  const radians = (targetDir * Math.PI) / 180;
                  const aheadX = targetPosX - Math.cos(radians) * lookDistance;
                  const aheadY = targetPosY - Math.sin(radians) * lookDistance;
                  
                  newX += (aheadX - newX) * 0.1;
                  newY += (aheadY - newY) * 0.1;
                  break;
                  
                case 'auto_zoom':
                  const autoZoom = cam.tracking.autoZoom || { 
                    enabled: true, 
                    minZoom: 0.5, 
                    maxZoom: 2.0, 
                    targetZoom: 1.0,
                    speedFactor: 0.1 
                  };
                  
                  if (autoZoom.enabled) {
                    const centerX = -cam.xy[0];
                    const centerY = -cam.xy[1];
                    const dist = Math.sqrt(
                      Math.pow(target.x - centerX, 2) + 
                      Math.pow(target.y - centerY, 2)
                    );
                    
                    const maxDist = 200;
                    const zoomFactor = 1 - (Math.min(dist, maxDist) / maxDist) * 0.5;
                    autoZoom.targetZoom = Math.max(
                      autoZoom.minZoom, 
                      Math.min(autoZoom.maxZoom, zoomFactor)
                    );
                    
                    newZoom += (autoZoom.targetZoom - newZoom) * autoZoom.speedFactor;
                  }
                  
                  newX += (targetPosX - newX) * 0.1;
                  newY += (targetPosY - newY) * 0.1;
                  break;
              }
          }
          
          // 应用摄像机抖动
          if (cam.tracking.shake.active && cam.tracking.shake.intensity > 0) {
            const time = Date.now() / 1000;
            const shakeX = noise(time * 10, 0) * 2 - 1;
            const shakeY = noise(0, time * 10) * 2 - 1;
            
            newX += shakeX * cam.tracking.shake.intensity * 10;
            newY += shakeY * cam.tracking.shake.intensity * 10;
            
            cam.tracking.shake.intensity *= cam.tracking.shake.decay;
            if (cam.tracking.shake.intensity < 0.01) {
              cam.tracking.shake.active = false;
            }
          }
          
          cam.xy[0] = newX;
          cam.xy[1] = newY;
          cam.zoom = newZoom;
          cam.dir = newDir;
          
          // 应用边界限制
          applyCameraBounds(cam);
          updateCamera(cameraName);
        }
      }
    }
  }

  // 新增：应用摄像机边界限制
  function applyCameraBounds(cam) {
    if (cam.bounds) {
      cam.xy[0] = Math.min(Math.max(cam.xy[0], -cam.bounds.right), -cam.bounds.left);
      cam.xy[1] = Math.min(Math.max(cam.xy[1], -cam.bounds.top), -cam.bounds.bottom);
    }
  }

  // 新增：获取屏幕边界
  function getScreenBounds(cameraName) {
    const cam = allCameras[cameraName];
    if (!cam) return { top: 0, bottom: 0, left: 0, right: 0 };
    
    const stageWidth = runtime.stageWidth;
    const stageHeight = runtime.stageHeight;
    const zoom = cam.zoom || 1;
    
    const visibleWidth = stageWidth / zoom;
    const visibleHeight = stageHeight / zoom;
    
    const centerX = -cam.xy[0];
    const centerY = -cam.xy[1];
    
    return {
      left: centerX - visibleWidth / 2,
      right: centerX + visibleWidth / 2,
      top: centerY - visibleHeight / 2,
      bottom: centerY + visibleHeight / 2
    };
  }

  // 新增：检查角色是否在地图外
  function isTargetOutsideBounds(target, bounds) {
    if (!bounds) return false;
    
    return (
      target.x < bounds.left ||
      target.x > bounds.right ||
      target.y < bounds.bottom ||
      target.y > bounds.top
    );
  }

  // 新增：检查角色是否碰到屏幕边缘
  function isTargetTouchingScreenEdge(target, cameraName) {
    const screenBounds = getScreenBounds(cameraName);
    const targetBounds = render.getBoundsForBubble(target.drawableID);
    
    return (
      targetBounds.left <= screenBounds.left ||
      targetBounds.right >= screenBounds.right ||
      targetBounds.top <= screenBounds.top ||
      targetBounds.bottom >= screenBounds.bottom
    );
  }

  // 启动动画循环
  function startAnimationLoop() {
    function loop() {
      updateAnimations();
      requestAnimationFrame(loop);
    }
    loop();
  }

  // 启动动画循环
  startAnimationLoop();

  // TODO 将来添加插值支持
  // 我们需要一个API来推送插值数据
  runtime.setInterpolation(false);
  runtime.runtimeOptions.fencing = false;
  render.offscreenTouching = true;

  // 自定义GUI
  function openModal(titleName, func) {
    // 在按钮上下文中，ScratchBlocks 始终存在
    ScratchBlocks.prompt(
      titleName,
      "",
      (value) => func(value),
      Scratch.translate("摄像机管理器"),
      "broadcast_msg"
    );
  }

  // 摄像机工具函数
  const radianConstant = Math.PI / 180;
  const epsilon = 1e-12;
  const applyEpsilon = (value) => (Math.abs(value) < epsilon ? 0 : value);

  function setupState(drawable) {
    drawable[cameraSymbol] = {
      name: "default",
      needsRefresh: false,
      ogXY: [0, 0],
      ogSZ: 1,
      ogDir: 0,
    };
  }

  function translatePosition(xy, invert, camData) {
    if (invert) {
      const invRads = camData.ogDir * radianConstant;
      const invSin = Math.sin(invRads),
        invCos = Math.cos(invRads);
      const scaledX = xy[0] / camData.ogSZ;
      const scaledY = xy[1] / camData.ogSZ;
      const invOffX = scaledX * invCos + scaledY * invSin;
      const invOffY = -scaledX * invSin + scaledY * invCos;
      return [
        applyEpsilon(invOffX - camData.ogXY[0]),
        applyEpsilon(invOffY - camData.ogXY[1]),
      ];
    } else {
      const rads = camData.dir * radianConstant;
      const sin = Math.sin(rads),
        cos = Math.cos(rads);
      const offX = xy[0] + camData.xy[0];
      const offY = xy[1] + camData.xy[1];
      return [
        applyEpsilon(camData.zoom * (offX * cos - offY * sin)),
        applyEpsilon(camData.zoom * (offX * sin + offY * cos)),
      ];
    }
  }

  function bindDrawable(drawable, camera) {
    if (!drawable[cameraSymbol]) setupState(drawable);
    const camSystem = drawable[cameraSymbol];
    if (camSystem.name === camera) return;

    // 反转摄像机变换
    const fixedPos = translatePosition(drawable._position, true, camSystem);
    const fixedDir = drawable._direction + camSystem.ogDir;
    const fixedScale = [
      drawable._scale[0] / camSystem.ogSZ,
      drawable._scale[1] / camSystem.ogSZ,
    ];

    drawable[cameraSymbol] = {
      name: camera,
      ogXY: [0, 0],
      ogSZ: 1,
      ogDir: 0,
    };

    const id = drawable._id;
    render.updateDrawablePosition(id, fixedPos);
    render.updateDrawableDirection(id, fixedDir);
    render.updateDrawableScale(id, fixedScale);
  }

  function updateCamera(camera) {
    for (let i = 0; i < render._drawList.length; i++) {
      const drawableId = render._drawList[i];
      const drawable = render._allDrawables[drawableId];
      if (!drawable.getVisible() || !drawable.skin) continue;
      if (!drawable[cameraSymbol]) setupState(drawable);

      const camSystem = drawable[cameraSymbol];
      if (camSystem.name === camera) {
        camSystem.needsRefresh = true;
        drawable.updatePosition(drawable._position);
        drawable.updateDirection(drawable._direction);
        drawable.updateScale(drawable._scale);
        camSystem.needsRefresh = false;
      }
    }
    runtime.requestRedraw();
  }

  // 摄像机系统补丁
  const ogPostSpriteInfo = vm.postSpriteInfo;
  vm.postSpriteInfo = function (data) {
    if (this._dragTarget && data.x !== undefined) {
      const drawable = render._allDrawables[this._dragTarget.drawableID];
      if (!drawable[cameraSymbol]) setupState(drawable);
      const camSystem = drawable[cameraSymbol];
      camSystem.needsRefresh = false;
      camSystem.ogXY = [0, 0];
    }
    ogPostSpriteInfo.call(this, data);
  };

  const ogPositionBubble = runtime.ext_scratch3_looks._positionBubble;
  runtime.ext_scratch3_looks._positionBubble = function (target) {
    // 如果摄像机超出设定的舞台大小，则扩展气泡限制为无限舞台大小
    const drawable = render._allDrawables[target.drawableID];
    if (!drawable[cameraSymbol]) setupState(drawable);
    const camSystem = allCameras[drawable[cameraSymbol].name];

    const ogNativeSize = render._nativeSize;
    if (
      Math.abs(camSystem.xy[0]) > runtime.stageWidth ||
      Math.abs(camSystem.xy[1]) > runtime.stageHeight
    ) {
      render._nativeSize = [Infinity, Infinity];
    }
    ogPositionBubble.call(this, target);
    render._nativeSize = ogNativeSize;
  };

  const ogGetBubbleBounds = render.getBoundsForBubble;
  render.getBoundsForBubble = function (drawableID) {
    const drawable = render._allDrawables[drawableID];
    if (!drawable[cameraSymbol]) setupState(drawable);
    const camSystem = drawable[cameraSymbol];

    const bounds = ogGetBubbleBounds.call(this, drawableID);
    const realTopLeft = translatePosition(
      [bounds.left, bounds.top],
      true,
      camSystem
    );
    const realBottomRight = translatePosition(
      [bounds.right, bounds.bottom],
      true,
      camSystem
    );

    bounds.top = realTopLeft[1];
    bounds.left = realTopLeft[0];
    bounds.bottom = realBottomRight[1];
    bounds.right = realBottomRight[0];
    return bounds;
  };

  const ogUpdatePosition = render.exports.Drawable.prototype.updatePosition;
  render.exports.Drawable.prototype.updatePosition = function (position) {
    if (!this[cameraSymbol]) setupState(this);
    const camSystem = this[cameraSymbol];
    const thisCam = allCameras[camSystem.name];
    let shouldEmit = false;
    if (camSystem.needsRefresh) {
      // 反转摄像机变换
      position = translatePosition(position, true, camSystem);
    }

    shouldEmit =
      camSystem.ogXY[0] !== thisCam.xy[0] ||
      camSystem.ogXY[1] !== thisCam.xy[1];
    camSystem.ogXY = [...thisCam.xy];
    position = translatePosition(position, false, thisCam);
    if (camSystem.needsRefresh) {
      if (
        this._position[0] !== position[0] ||
        this._position[1] !== position[1]
      ) {
        this._position[0] = position[0];
        this._position[1] = position[1];
      }
      if (shouldEmit) {
        render.dirty = true;
        this.setTransformDirty();
      }
    } else {
      ogUpdatePosition.call(this, position);
    }
  };

  const ogUpdateDirection = render.exports.Drawable.prototype.updateDirection;
  render.exports.Drawable.prototype.updateDirection = function (direction) {
    if (!this[cameraSymbol]) setupState(this);
    const camSystem = this[cameraSymbol];
    const thisCam = allCameras[camSystem.name];
    if (camSystem.needsRefresh) {
      // 反转摄像机变换
      direction += camSystem.ogDir;
    }

    camSystem.ogDir = thisCam.dir;
    direction -= thisCam.dir;
    ogUpdateDirection.call(this, direction);
  };

  const ogUpdateScale = render.exports.Drawable.prototype.updateScale;
  render.exports.Drawable.prototype.updateScale = function (scale) {
    if (!this[cameraSymbol]) setupState(this);
    const camSystem = this[cameraSymbol];
    const thisCam = allCameras[camSystem.name];
    let shouldEmit = false;
    if (camSystem.needsRefresh) {
      // 反转摄像机变换
      const safeOgSZ = camSystem.ogSZ !== 0 ? camSystem.ogSZ : 1e-10;
      scale[0] /= safeOgSZ;
      scale[1] /= safeOgSZ;
      shouldEmit = safeOgSZ !== thisCam.zoom;
    }

    // 避免0除以0
    camSystem.ogSZ = thisCam.zoom || 1e-10;
    const safeZoom = thisCam.zoom || 1e-10;
    scale[0] *= safeZoom;
    scale[1] *= safeZoom;
    if (scale[0] === 0) scale[0] = 1e-10 * Math.sign(safeZoom);
    if (scale[1] === 0) scale[1] = 1e-10 * Math.sign(safeZoom);

    ogUpdateScale.call(this, scale);
    if (shouldEmit) {
      this._renderer.dirty = true;
      this._rotationCenterDirty = true;
      this._skinScaleDirty = true;
      this.setTransformDirty();
    }
  };

  // 克隆体应继承父体的摄像机
  const ogInitDrawable = vm.exports.RenderedTarget.prototype.initDrawable;
  vm.exports.RenderedTarget.prototype.initDrawable = function (layerGroup) {
    ogInitDrawable.call(this, layerGroup);
    if (this.isOriginal) return;

    const parentSprite = this.sprite.clones[0]; // clone[0] 始终是原始角色
    const parentDrawable = render._allDrawables[parentSprite.drawableID];
    const name = parentDrawable[cameraSymbol]?.name ?? "default";

    const drawable = render._allDrawables[this.drawableID];
    bindDrawable(drawable, name);
  };

  // Turbowarp 扩展存储
  runtime.on("PROJECT_LOADED", () => {
    const stored = runtime.extensionStorage["SPcamera"];
    if (stored)
      stored.cams.forEach((cam) => {
        allCameras[cam] = {
          xy: [0, 0],
          zoom: 1,
          dir: 0,
          bounds: {
            top: Infinity,
            bottom: -Infinity,
            left: -Infinity,
            right: Infinity
          },
          animation: null,
          tracking: {
            target: null,
            offsetX: 0,
            offsetY: 0,
            algorithm: 'nonlinear_smooth',
            active: false,
            mode: 'standard',
            orbit: {
              radius: 100,
              angle: 0,
              speed: 0.02,
              followHeight: true
            },
            path: {
              waypoints: [],
              currentWaypoint: 0,
              speed: 0.05,
              loop: false,
              followTarget: false
            },
            shake: {
              intensity: 0,
              decay: 0.9,
              active: false
            },
            parallax: {
              layers: [],
              depthFactor: 0.5
            },
            cinematic: {
              focusPoints: [],
              currentFocus: 0,
              transitionTime: 1,
              autoTransition: false,
              rhythm: 0
            },
            physics: {
              mass: 1,
              stiffness: 0.2,
              damping: 0.05,
              velocityX: 0,
              velocityY: 0
            },
            adaptive: {
              speedFactor: 0.1,
              zoomFactor: 0.05,
              rotationFactor: 0.05
            },
            bezier: {
              controlPoints: [],
              t: 0,
              speed: 0.01
            },
            region: {
              x: 0,
              y: 0,
              width: 200,
              height: 150,
              active: false
            },
            lagFactor: 0.1,
            predictionFactor: 0.5,
            elasticity: 0.1,
            damping: 0.05,
            velocityX: 0,
            velocityY: 0,
            smoothZone: {
              inner: 50,
              outer: 100,
              maxSpeed: 0.2
            },
            lookAheadDistance: 50,
            autoZoom: {
              enabled: false,
              minZoom: 0.5,
              maxZoom: 2.0,
              targetZoom: 1.0,
              speedFactor: 0.1
            },
            intelligent: {
              reactionTime: 0.3,
              anticipation: 0.7,
              smoothness: 0.8
            }
          },
          bounds: cam === "default" ? undefined : [],
        };
      });
  });

  class SPcamera {
    getInfo() {
      return {
        id: "SPcamera",
        name: Scratch.translate("摄像机 V2 增强版"),
        color1: "#517af5",
        color2: "#3460e3",
        color3: "#2851c9",
        menuIconURI,
        blocks: [
          {
            func: "addCamera",
            blockType: Scratch.BlockType.BUTTON,
            text: Scratch.translate("添加摄像机"),
          },
          {
            func: "removeCamera",
            blockType: Scratch.BlockType.BUTTON,
            text: Scratch.translate("移除摄像机"),
          },
          "---",
          {
            opcode: "bindTarget",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将 [TARGET] 绑定到摄像机 [CAMERA]"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS" },
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          {
            opcode: "unbindTarget",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将 [TARGET] 从摄像机 [CAMERA] 解绑"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS" },
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          {
            opcode: "targetCamera",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[TARGET] 的摄像机"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "EXACT_OBJECTS",
              },
            },
          },
          "---",
          {
            opcode: "setSpaceColor",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置背景颜色为 [COLOR]"),
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR },
            },
          },
          {
            opcode: "spaceColor",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("背景颜色"),
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate("摄像机控制"),
          },
          {
            opcode: "setXY",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置 [CAMERA] 摄像机到 x: [X] y: [Y]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              X: { type: Scratch.ArgumentType.NUMBER },
              Y: { type: Scratch.ArgumentType.NUMBER },
            },
          },
          {
            opcode: "goToObject",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("移动 [CAMERA] 摄像机到 [TARGET]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "TARGETS" },
            },
          },
          "---",
          {
            opcode: "moveSteps",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("向前移动摄像机 [CAMERA] [NUM] 步"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          {
            opcode: "setX",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] x 坐标设置为 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER },
            },
          },
          {
            opcode: "changeX",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] x 坐标增加 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          {
            opcode: "setY",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] y 坐标设置为 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER },
            },
          },
          {
            opcode: "changeY",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] y 坐标增加 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          "---",
          {
            opcode: "getX",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[CAMERA] 摄像机 x"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          {
            opcode: "getY",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[CAMERA] 摄像机 y"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          "---",
          // 新增：地图边界设置
          {
            opcode: "setMapBound",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置地图 [BOUND] 边界为 [VALUE]"),
            arguments: {
              BOUND: {
                type: Scratch.ArgumentType.STRING,
                menu: "BOUND_DIRECTIONS",
                defaultValue: "top"
              },
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1000 }
            },
          },
          {
            opcode: "getMapBound",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("地图 [BOUND] 边界"),
            arguments: {
              BOUND: {
                type: Scratch.ArgumentType.STRING,
                menu: "BOUND_DIRECTIONS",
                defaultValue: "top"
              }
            },
          },
          "---",
          // 新增：屏幕边界查询
          {
            opcode: "getScreenBound",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("屏幕 [BOUND] 边界"),
            arguments: {
              BOUND: {
                type: Scratch.ArgumentType.STRING,
                menu: "BOUND_DIRECTIONS",
                defaultValue: "top"
              },
              CAMERA: {
                type: Scratch.ArgumentType.STRING,
                menu: "CAMERAS",
                defaultValue: "default"
              }
            },
          },
          // 新增：边界限制控制
          {
            opcode: "setBoundRestriction",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("使 [TARGET] [RESTRICTED] 地图边界限制"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS" },
              RESTRICTED: {
                type: Scratch.ArgumentType.STRING,
                menu: "RESTRICTION_TYPES",
                defaultValue: "restricted"
              }
            },
          },
          // 新增：边界检测
          {
            opcode: "touchingScreenEdge",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("[TARGET] 碰到屏幕边缘?"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS" },
              CAMERA: {
                type: Scratch.ArgumentType.STRING,
                menu: "CAMERAS",
                defaultValue: "default"
              }
            },
          },
          {
            opcode: "outsideMapBounds",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("[TARGET] 在地图外?"),
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS" },
              CAMERA: {
                type: Scratch.ArgumentType.STRING,
                menu: "CAMERAS",
                defaultValue: "default"
              }
            },
          },
          "---",
          {
            opcode: "setDirectionNew",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] 方向设置为 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
            },
          },
          {
            opcode: "setDirection",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置 [CAMERA] 摄像机方向为 [NUM]"),
            hideFromPalette: true, // 已弃用，为了兼容性保留
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
            },
          },
          {
            opcode: "pointCamera",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] 指向 [TARGET]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "TARGETS" },
            },
          },
          "---",
          {
            opcode: "turnCamRight",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] 顺时针旋转 [NUM] 度"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
            },
          },
          {
            opcode: "turnCamLeft",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将摄像机 [CAMERA] 逆时针旋转 [NUM] 度"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
            },
          },
          {
            opcode: "getDirectionNew",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[CAMERA] 摄像机方向"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          {
            opcode: "getDirection",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[CAMERA] 摄像机方向"),
            hideFromPalette: true, // 已弃用，为了兼容性保留
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          "---",
          {
            opcode: "setZoom",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置 [CAMERA] 摄像机缩放为 [NUM]%"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            },
          },
          {
            opcode: "changeZoom",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("将 [CAMERA] 摄像机缩放增加 [NUM]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          {
            opcode: "getZoom",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[CAMERA] 摄像机缩放"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          "---",
          // 新增：摄像机动画
          {
            opcode: "animateCamera",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("[TIME] 秒内，将摄像机 [CAMERA] 移动到 x: [X] y: [Y]，缩放: [ZOOM]%，曲线 [EASING]"),
            arguments: {
              TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              ZOOM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              EASING: { type: Scratch.ArgumentType.STRING, menu: "EASING_TYPES", defaultValue: "easeInOutQuad" }
            },
          },
          // 新增：摄像机跟踪模式
          {
            opcode: "startCameraTracking",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("摄像机 [CAMERA] 自动跟踪 [TARGET]，模式 [MODE]，位置偏移 x: [OFFSET_X] y: [OFFSET_Y]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS", defaultValue: "_myself_" },
              MODE: { type: Scratch.ArgumentType.STRING, menu: "TRACKING_MODES", defaultValue: "standard" },
              OFFSET_X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              OFFSET_Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            },
          },
          // 新增：圆周跟踪配置
          {
            opcode: "setOrbitTracking",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 圆周跟踪：半径 [RADIUS] 速度 [SPEED] 跟随高度 [FOLLOW_HEIGHT]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              RADIUS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.02 },
              FOLLOW_HEIGHT: { type: Scratch.ArgumentType.STRING, menu: "BOOLEAN_MENU", defaultValue: "启用" }
            },
          },
          // 新增：路径跟踪配置
          {
            opcode: "addPathWaypoint",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("添加路径点 [WAYPOINT] 到摄像机 [CAMERA] 路径"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              WAYPOINT: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS", defaultValue: "_myself_" }
            },
          },
          {
            opcode: "clearPathWaypoints",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("清除摄像机 [CAMERA] 路径点"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" }
            },
          },
          {
            opcode: "setPathConfig",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 路径配置：速度 [SPEED] 循环 [LOOP]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.05 },
              LOOP: { type: Scratch.ArgumentType.STRING, menu: "BOOLEAN_MENU", defaultValue: "启用" }
            },
          },
          // 新增：物理跟踪配置
          {
            opcode: "setPhysicsTracking",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 物理跟踪：质量 [MASS] 刚度 [STIFFNESS] 阻尼 [DAMPING]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              MASS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              STIFFNESS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.2 },
              DAMPING: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.05 }
            },
          },
          // 新增：自适应跟踪配置
          {
            opcode: "setAdaptiveTracking",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 自适应跟踪：速度因子 [SPEED_FACTOR] 缩放因子 [ZOOM_FACTOR] 旋转因子 [ROTATION_FACTOR]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              SPEED_FACTOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 },
              ZOOM_FACTOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.05 },
              ROTATION_FACTOR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.05 }
            },
          },
          // 新增：贝塞尔曲线跟踪
          {
            opcode: "addBezierPoint",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("添加贝塞尔点 [POINT] 到摄像机 [CAMERA] 曲线"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              POINT: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS", defaultValue: "_myself_" }
            },
          },
          {
            opcode: "setBezierSpeed",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 贝塞尔曲线速度 [SPEED]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.01 }
            },
          },
          // 新增：摄像机抖动
          {
            opcode: "shakeCamera",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("使摄像机 [CAMERA] 抖动，强度 [INTENSITY] 衰减 [DECAY]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              DECAY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.9 }
            },
          },
          // 新增：电影式跟踪
          {
            opcode: "addCinematicFocus",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("添加电影焦点 [FOCUS] 到摄像机 [CAMERA]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              FOCUS: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS", defaultValue: "_myself_" }
            },
          },
          {
            opcode: "setCinematicConfig",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 电影配置：过渡时间 [TIME] 自动切换 [AUTO]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              AUTO: { type: Scratch.ArgumentType.STRING, menu: "BOOLEAN_MENU", defaultValue: "启用" }
            },
          },
          // 新增：智能跟踪配置
          {
            opcode: "setIntelligentTracking",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("设置摄像机 [CAMERA] 智能跟踪：反应时间 [REACTION] 预测 [ANTICIPATION] 平滑度 [SMOOTHNESS]"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" },
              REACTION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.3 },
              ANTICIPATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.7 },
              SMOOTHNESS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.8 }
            },
          },
          {
            opcode: "stopCameraMotion",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("停止摄像机 [CAMERA] 运动"),
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS", defaultValue: "default" }
            },
          },
          // 新增：角色动画
          {
            opcode: "animateTarget",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("[TIME] 秒内，将 [TARGET] 移动到 x: [X] y: [Y]，缩放: [ZOOM]%，曲线 [EASING]，并等待"),
            arguments: {
              TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              TARGET: { type: Scratch.ArgumentType.STRING, menu: "OBJECTS", defaultValue: "_myself_" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              ZOOM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              EASING: { type: Scratch.ArgumentType.STRING, menu: "EASING_TYPES", defaultValue: "easeOutBounce" }
            },
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: Scratch.translate("实用工具"),
          },
          {
            opcode: "fixedMouseX",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("鼠标在摄像机 [CAMERA] 中的 x 坐标"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          {
            opcode: "fixedMouseY",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("鼠标在摄像机 [CAMERA] 中的 y 坐标"),
            disableMonitor: true,
            arguments: {
              CAMERA: { type: Scratch.ArgumentType.STRING, menu: "CAMERAS" },
            },
          },
          "---",
          {
            opcode: "renderedX",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[TARGET] 的渲染 x 位置"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "EXACT_OBJECTS",
              },
            },
          },
          {
            opcode: "renderedY",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[TARGET] 的渲染 y 位置"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "EXACT_OBJECTS",
              },
            },
          },
        ],
        menus: {
          CAMERAS: { acceptReporters: false, items: "getCameras" },
          TARGETS: { acceptReporters: true, items: "getTargets" },
          OBJECTS: { acceptReporters: true, items: "getObjects" },
          EXACT_OBJECTS: {
            acceptReporters: true,
            items: this.getObjects(false),
          },
          BINDS: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate("绑定"), value: "bind" },
              { text: Scratch.translate("解绑"), value: "unbind" },
            ],
          },
          // 新增菜单
          BOUND_DIRECTIONS: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("上"), value: "top" },
              { text: Scratch.translate("下"), value: "bottom" },
              { text: Scratch.translate("左"), value: "left" },
              { text: Scratch.translate("右"), value: "right" }
            ]
          },
          RESTRICTION_TYPES: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("受"), value: "restricted" },
              { text: Scratch.translate("不受"), value: "unrestricted" }
            ]
          },
          EASING_TYPES: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("线性"), value: "linear" },
              { text: Scratch.translate("回弹进出"), value: "easeOutBounce" },
              { text: Scratch.translate("正弦进出"), value: "easeInOutQuad" },
              { text: Scratch.translate("弹性出"), value: "easeInOutElastic" },
              { text: Scratch.translate("弹性进出"), value: "easeOutBack" },
              { text: Scratch.translate("正弦曲线"), value: "easeInOutSine" },
              { text: Scratch.translate("指数曲线"), value: "easeInOutExpo" }
            ]
          },
          TRACKING_MODES: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("标准"), value: "standard" },
              { text: Scratch.translate("延迟跟踪"), value: "lag" },
              { text: Scratch.translate("锁定X轴"), value: "lock_x" },
              { text: Scratch.translate("锁定Y轴"), value: "lock_y" },
              { text: Scratch.translate("区域跟踪"), value: "region" },
              { text: Scratch.translate("预测跟踪"), value: "predictive" },
              { text: Scratch.translate("弹性跟踪"), value: "elastic" },
              { text: Scratch.translate("平滑区域"), value: "smooth_zone" },
              { text: Scratch.translate("前瞻跟踪"), value: "look_ahead" },
              { text: Scratch.translate("自动缩放"), value: "auto_zoom" },
              { text: Scratch.translate("圆周跟踪"), value: "orbit" },
              { text: Scratch.translate("路径跟踪"), value: "path" },
              { text: Scratch.translate("物理跟踪"), value: "physics" },
              { text: Scratch.translate("自适应跟踪"), value: "adaptive" },
              { text: Scratch.translate("贝塞尔曲线"), value: "bezier" },
              { text: Scratch.translate("智能跟踪"), value: "intelligent" },
              { text: Scratch.translate("电影式跟踪"), value: "cinematic" }
            ]
          },
          BOOLEAN_MENU: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("启用"), value: "启用" },
              { text: Scratch.translate("禁用"), value: "禁用" },
              { text: Scratch.translate("是"), value: "是" },
              { text: Scratch.translate("否"), value: "否" }
            ]
          }
        },
      };
    }

    // 辅助函数
    getObjects(includeAll) {
      const objectNames = [
        { text: Scratch.translate("我自己"), value: "_myself_" },
      ];
      if (includeAll)
        objectNames.push({
          text: Scratch.translate("所有对象"),
          value: "_all_",
        });
      objectNames.push({ text: Scratch.translate("舞台"), value: "_stage_" });

      if (runtime.ext_videoSensing)
        objectNames.push({
          text: Scratch.translate("视频层"),
          value: "_video_",
        });
      if (runtime.ext_pen)
        objectNames.push({
          text: Scratch.translate("画笔层"),
          value: "_pen_",
        });

      // 自定义绘制层（例如CST的3D或Simple3D扩展）
      for (var i = 0; i < render._drawList.length; i++) {
        const drawableId = render._drawList[i];
        const drawable = render._allDrawables[drawableId];
        if (drawable.customDrawableName !== undefined) {
          objectNames.push({
            text: drawable.customDrawableName,
            value: `${drawableId}=SP-custLayer`,
          });
        }
      }

      // 角色
      const targets = runtime.targets;
      for (let i = 1; i < targets.length; i++) {
        const target = targets[i];
        if (target.isOriginal)
          objectNames.push({ text: target.getName(), value: target.getName() });
      }
      return objectNames.length > 0 ? objectNames : [""];
    }

    getTargets() {
      const targetNames = [
        { text: Scratch.translate("我自己"), value: "_myself_" },
        { text: Scratch.translate("舞台"), value: "_stage_" },
      ];
      const targets = runtime.targets;
      for (let i = 1; i < targets.length; i++) {
        const target = targets[i];
        if (target.isOriginal)
          targetNames.push({ text: target.getName(), value: target.getName() });
      }
      return targetNames.length > 0 ? targetNames : [""];
    }

    getCameras() {
      const cameraNames = Object.keys(allCameras);
      return cameraNames.map((i) => {
        if (i === "default")
          return { text: Scratch.translate("默认"), value: "default" };
        else return { text: i, value: i };
      });
    }

    refreshBlocks() {
      runtime.requestBlocksUpdate();
      runtime.extensionStorage["SPcamera"] = {
        cams: Object.keys(allCameras),
      };
    }

    addCamera() {
      openModal(Scratch.translate("新摄像机名称:"), (name) => {
        if (name) {
          allCameras[name] = {
            xy: [0, 0],
            zoom: 1,
            dir: 0,
            bounds: {
              top: Infinity,
              bottom: -Infinity,
              left: -Infinity,
              right: Infinity
            },
            animation: null,
            tracking: {
              target: null,
              offsetX: 0,
              offsetY: 0,
              algorithm: 'nonlinear_smooth',
              active: false,
              mode: 'standard',
              orbit: {
                radius: 100,
                angle: 0,
                speed: 0.02,
                followHeight: true
              },
              path: {
                waypoints: [],
                currentWaypoint: 0,
                speed: 0.05,
                loop: false,
                followTarget: false
              },
              shake: {
                intensity: 0,
                decay: 0.9,
                active: false
              },
              parallax: {
                layers: [],
                depthFactor: 0.5
              },
              cinematic: {
                focusPoints: [],
                currentFocus: 0,
                transitionTime: 1,
                autoTransition: false,
                rhythm: 0
              },
              physics: {
                mass: 1,
                stiffness: 0.2,
                damping: 0.05,
                velocityX: 0,
                velocityY: 0
              },
              adaptive: {
                speedFactor: 0.1,
                zoomFactor: 0.05,
                rotationFactor: 0.05
              },
              bezier: {
                controlPoints: [],
                t: 0,
                speed: 0.01
              },
              region: {
                x: 0,
                y: 0,
                width: 200,
                height: 150,
                active: false
              },
              lagFactor: 0.1,
              predictionFactor: 0.5,
              elasticity: 0.1,
              damping: 0.05,
              velocityX: 0,
              velocityY: 0,
              smoothZone: {
                inner: 50,
                outer: 100,
                maxSpeed: 0.2
              },
              lookAheadDistance: 50,
              autoZoom: {
                enabled: false,
                minZoom: 0.5,
                maxZoom: 2.0,
                targetZoom: 1.0,
                speedFactor: 0.1
              },
              intelligent: {
                reactionTime: 0.3,
                anticipation: 0.7,
                smoothness: 0.8
              }
            },
            binds: [],
          };
          this.refreshBlocks();
        }
      });
    }

    removeCamera() {
      openModal(Scratch.translate("移除名为的摄像机:"), (name) => {
        if (name) {
          if (name === "default") return; // 永远不要删除默认摄像机
          delete allCameras[name];
          this.refreshBlocks();
        }
      });
    }

    getTarget(name, util) {
      name = Cast.toString(name);
      if (name === "_all_") return "_all_";
      else if (name === "_stage_") return runtime.getTargetForStage();
      else if (name === "_myself_") return util.target;
      const penLayer = runtime.ext_pen?._penDrawableId;
      const videoLayer = runtime.ioDevices.video._drawable;

      if (name === "_pen_")
        return penLayer > -1 ? { drawableID: penLayer } : undefined;
      else if (name === "_video_")
        return videoLayer > -1 ? { drawableID: videoLayer } : undefined;
      else if (name.includes("=SP-custLayer")) {
        const drawableID = parseInt(name);
        if (render._allDrawables[drawableID]?.customDrawableName !== undefined)
          return {
            drawableID,
          };
      }
      return runtime.getSpriteTargetByName(name);
    }

    translateAngledMovement(xy, steps, direction) {
      const radians = direction * radianConstant;
      return [
        applyEpsilon(xy[0] + steps * Math.cos(radians)),
        applyEpsilon(xy[1] + steps * Math.sin(radians)),
      ];
    }

    // 积木函数
    
    // 原有函数保持不变
    bindTarget(args, util) {
      if (!allCameras[args.CAMERA]) return;
      const target = this.getTarget(args.TARGET, util);
      if (!target) return;
      if (target === "_all_") {
        render._allDrawables.forEach((drawable) => {
          bindDrawable(drawable, args.CAMERA);
        });
      } else {
        const drawable = render._allDrawables[target.drawableID];
        bindDrawable(drawable, args.CAMERA);
      }
    }

    unbindTarget(args, util) {
      if (!allCameras[args.CAMERA]) return;
      const target = this.getTarget(args.TARGET, util);
      if (!target) return;
      if (target === "_all_") {
        render._allDrawables.forEach((drawable) => {
          bindDrawable(drawable, "default");
        });
      } else {
        const drawable = render._allDrawables[target.drawableID];
        bindDrawable(drawable, "default");
      }
    }

    targetCamera(args, util) {
      const target = this.getTarget(args.TARGET, util);
      if (!target) return "";
      return (
        render._allDrawables[target.drawableID][cameraSymbol]?.name || "default"
      );
    }

    setSpaceColor(args) {
      const rgb = Cast.toRgbColorList(args.COLOR);
      render.setBackgroundColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
    }

    spaceColor() {
      const rgb = render._backgroundColor3b;
      let decimal = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
      if (decimal < 0) decimal += 0xffffff + 1;
      const hex = Number(decimal).toString(16);
      return `#${"000000".substr(0, 6 - hex.length)}${hex}`;
    }

    setXY(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].xy = [
        Cast.toNumber(args.X) * -1,
        Cast.toNumber(args.Y) * -1,
      ];
      applyCameraBounds(allCameras[args.CAMERA]);
      updateCamera(args.CAMERA);
    }

    moveSteps(args) {
      if (!allCameras[args.CAMERA]) return;
      const cam = allCameras[args.CAMERA];
      const steps = Cast.toNumber(args.NUM) * -1;
      cam.xy = this.translateAngledMovement(cam.xy, steps, cam.dir);
      applyCameraBounds(cam);
      updateCamera(args.CAMERA);
    }

    setX(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].xy[0] = Cast.toNumber(args.NUM) * -1;
      applyCameraBounds(allCameras[args.CAMERA]);
      updateCamera(args.CAMERA);
    }

    changeX(args) {
      if (!allCameras[args.CAMERA]) return;
      const cam = allCameras[args.CAMERA];
      const steps = Cast.toNumber(args.NUM) * -1;
      cam.xy = this.translateAngledMovement(cam.xy, steps, 0);
      applyCameraBounds(cam);
      updateCamera(args.CAMERA);
    }

    setY(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].xy[1] = Cast.toNumber(args.NUM) * -1;
      applyCameraBounds(allCameras[args.CAMERA]);
      updateCamera(args.CAMERA);
    }

    changeY(args) {
      if (!allCameras[args.CAMERA]) return;
      const cam = allCameras[args.CAMERA];
      const steps = Cast.toNumber(args.NUM) * -1;
      cam.xy = this.translateAngledMovement(cam.xy, steps, 90);
      applyCameraBounds(cam);
      updateCamera(args.CAMERA);
    }

    goToObject(args, util) {
      if (!allCameras[args.CAMERA]) return;
      const target = this.getTarget(args.TARGET, util);
      if (target) {
        allCameras[args.CAMERA].xy = [target.x * -1, target.y * -1];
        applyCameraBounds(allCameras[args.CAMERA]);
        updateCamera(args.CAMERA);
      }
    }

    getX(args) {
      if (!allCameras[args.CAMERA]) return 0;
      return allCameras[args.CAMERA].xy[0] * -1;
    }

    getY(args) {
      if (!allCameras[args.CAMERA]) return 0;
      return allCameras[args.CAMERA].xy[1] * -1;
    }

    setDirectionNew(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].dir = 90 - Cast.toNumber(args.NUM);
      updateCamera(args.CAMERA);
    }
    
    setDirection(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].dir = Cast.toNumber(args.NUM) - 90;
      updateCamera(args.CAMERA);
    }

    turnCamRight(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].dir -= Cast.toNumber(args.NUM);
      updateCamera(args.CAMERA);
    }

    turnCamLeft(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].dir += Cast.toNumber(args.NUM);
      updateCamera(args.CAMERA);
    }

    pointCamera(args, util) {
      if (!allCameras[args.CAMERA]) return;
      const target = this.getTarget(args.TARGET, util);
      if (target) {
        allCameras[args.CAMERA].dir = target.direction - 90;
        updateCamera(args.CAMERA);
      }
    }

    getDirectionNew(args) {
      if (!allCameras[args.CAMERA]) return 0;
      return 90 - allCameras[args.CAMERA].dir;
    }
    
    getDirection(args) {
      if (!allCameras[args.CAMERA]) return 0;
      return allCameras[args.CAMERA].dir + 90;
    }

    setZoom(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].zoom = Cast.toNumber(args.NUM) / 100;
      updateCamera(args.CAMERA);
    }

    changeZoom(args) {
      if (!allCameras[args.CAMERA]) return;
      allCameras[args.CAMERA].zoom += Cast.toNumber(args.NUM) / 100;
      updateCamera(args.CAMERA);
    }

    getZoom(args) {
      if (!allCameras[args.CAMERA]) return 0;
      return allCameras[args.CAMERA].zoom * 100;
    }

    fixedMouseX(args, util) {
      if (!allCameras[args.CAMERA]) return 0;
      const camData = allCameras[args.CAMERA];
      return translatePosition(
        [
          util.ioQuery("mouse", "getScratchX"),
          util.ioQuery("mouse", "getScratchY"),
        ],
        false,
        camData
      )[0];
    }

    fixedMouseY(args, util) {
      if (!allCameras[args.CAMERA]) return 0;
      const camData = allCameras[args.CAMERA];
      return translatePosition(
        [
          util.ioQuery("mouse", "getScratchX"),
          util.ioQuery("mouse", "getScratchY"),
        ],
        false,
        camData
      )[1];
    }

    renderedX(args, util) {
      const target = this.getTarget(args.TARGET, util);
      if (!target) return "";
      const drawable = render._allDrawables[target.drawableID];
      return drawable._position[0];
    }

    renderedY(args, util) {
      const target = this.getTarget(args.TARGET, util);
      if (!target) return "";
      const drawable = render._allDrawables[target.drawableID];
      return drawable._position[1];
    }

    // 新增函数

    // 一、地图边界设置与查询
    setMapBound(args) {
      const bound = Cast.toString(args.BOUND);
      const value = Cast.toNumber(args.VALUE);
      
      for (const cameraName in allCameras) {
        const cam = allCameras[cameraName];
        if (!cam.bounds) {
          cam.bounds = {
            top: Infinity,
            bottom: -Infinity,
            left: -Infinity,
            right: Infinity
          };
        }
        
        switch (bound) {
          case 'top':
            cam.bounds.top = value;
            break;
          case 'bottom':
            cam.bounds.bottom = value;
            break;
          case 'left':
            cam.bounds.left = value;
            break;
          case 'right':
            cam.bounds.right = value;
            break;
        }
        
        // 应用边界限制
        applyCameraBounds(cam);
        updateCamera(cameraName);
      }
    }

    getMapBound(args) {
      const bound = Cast.toString(args.BOUND);
      const cam = allCameras.default;
      
      if (!cam.bounds) return 0;
      
      switch (bound) {
        case 'top':
          return cam.bounds.top;
        case 'bottom':
          return cam.bounds.bottom;
        case 'left':
          return cam.bounds.left;
        case 'right':
          return cam.bounds.right;
        default:
          return 0;
      }
    }

    // 二、屏幕边界查询
    getScreenBound(args) {
      const bound = Cast.toString(args.BOUND);
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return 0;
      
      const screenBounds = getScreenBounds(cameraName);
      
      switch (bound) {
        case 'top':
          return screenBounds.top;
        case 'bottom':
          return screenBounds.bottom;
        case 'left':
          return screenBounds.left;
        case 'right':
          return screenBounds.right;
        default:
          return 0;
      }
    }

    // 三、边界限制控制
    setBoundRestriction(args, util) {
      const target = this.getTarget(args.TARGET, util);
      const restricted = Cast.toString(args.RESTRICTED) === "restricted";
      
      if (target && target !== "_all_") {
        if (target.drawableID) {
          const drawable = render._allDrawables[target.drawableID];
          if (drawable) {
            targetBoundRestricted.set(drawable, restricted);
          }
        } else {
          // 对于角色
          targetBoundRestricted.set(target, restricted);
        }
      }
    }

    // 四、边界检测
    touchingScreenEdge(args, util) {
      const target = this.getTarget(args.TARGET, util);
      const cameraName = Cast.toString(args.CAMERA) || "default";
      
      if (!target || target === "_all_") return false;
      
      return isTargetTouchingScreenEdge(target, cameraName);
    }

    outsideMapBounds(args, util) {
      const target = this.getTarget(args.TARGET, util);
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!target || target === "_all_" || !cam || !cam.bounds) return false;
      
      return isTargetOutsideBounds(target, cam.bounds);
    }

    // 五、摄像机动画
    animateCamera(args) {
      const time = Cast.toNumber(args.TIME) * 1000; // 转换为毫秒
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      // 停止当前动画
      if (activeAnimations.has(cameraName)) {
        activeAnimations.delete(cameraName);
      }
      
      // 设置新动画
      const animation = {
        type: 'both',
        startX: cam.xy[0],
        startY: cam.xy[1],
        startZoom: cam.zoom,
        startDir: cam.dir,
        targetX: Cast.toNumber(args.X) * -1,
        targetY: Cast.toNumber(args.Y) * -1,
        targetZoom: Cast.toNumber(args.ZOOM) / 100,
        targetDir: cam.dir,
        duration: time,
        startTime: Date.now(),
        easing: Cast.toString(args.EASING) || 'easeInOutQuad'
      };
      
      activeAnimations.set(cameraName, animation);
      cam.animation = animation;
    }

    // 六、摄像机追踪
    startCameraTracking(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      // 停止当前动画
      if (activeAnimations.has(cameraName)) {
        activeAnimations.delete(cameraName);
        cam.animation = null;
      }
      
      // 设置追踪
      const targetName = Cast.toString(args.TARGET);
      const target = this.getTarget(targetName, { target: runtime.targets[0] });
      
      if (target) {
        cam.tracking.mode = Cast.toString(args.MODE);
        cam.tracking.target = targetName;
        cam.tracking.offsetX = Cast.toNumber(args.OFFSET_X);
        cam.tracking.offsetY = Cast.toNumber(args.OFFSET_Y);
        cam.tracking.active = true;
        
        // 初始化跟踪参数
        if (cam.tracking.mode === 'elastic' || cam.tracking.mode === 'physics') {
          cam.tracking.velocityX = 0;
          cam.tracking.velocityY = 0;
        }
      }
    }

    // 七、圆周跟踪配置
    setOrbitTracking(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.orbit.radius = Cast.toNumber(args.RADIUS);
      cam.tracking.orbit.speed = Cast.toNumber(args.SPEED);
      cam.tracking.orbit.followHeight = Cast.toString(args.FOLLOW_HEIGHT) === "启用";
    }

    // 八、路径跟踪配置
    addPathWaypoint(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      const waypointName = Cast.toString(args.WAYPOINT);
      const waypoint = this.getTarget(waypointName, { target: runtime.targets[0] });
      
      if (!cam || !waypoint) return;
      
      cam.tracking.path.waypoints.push({
        x: waypoint.x,
        y: waypoint.y,
        name: waypointName
      });
    }

    clearPathWaypoints(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.path.waypoints = [];
      cam.tracking.path.currentWaypoint = 0;
    }

    setPathConfig(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.path.speed = Cast.toNumber(args.SPEED);
      cam.tracking.path.loop = Cast.toString(args.LOOP) === "启用";
    }

    // 九、物理跟踪配置
    setPhysicsTracking(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.physics.mass = Cast.toNumber(args.MASS);
      cam.tracking.physics.stiffness = Cast.toNumber(args.STIFFNESS);
      cam.tracking.physics.damping = Cast.toNumber(args.DAMPING);
    }

    // 十、自适应跟踪配置
    setAdaptiveTracking(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.adaptive.speedFactor = Cast.toNumber(args.SPEED_FACTOR);
      cam.tracking.adaptive.zoomFactor = Cast.toNumber(args.ZOOM_FACTOR);
      cam.tracking.adaptive.rotationFactor = Cast.toNumber(args.ROTATION_FACTOR);
    }

    // 十一、贝塞尔曲线跟踪
    addBezierPoint(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      const pointName = Cast.toString(args.POINT);
      const point = this.getTarget(pointName, { target: runtime.targets[0] });
      
      if (!cam || !point) return;
      
      cam.tracking.bezier.controlPoints.push({
        x: point.x,
        y: point.y,
        name: pointName
      });
    }

    setBezierSpeed(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.bezier.speed = Cast.toNumber(args.SPEED);
    }

    // 十二、摄像机抖动
    shakeCamera(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.shake.intensity = Cast.toNumber(args.INTENSITY) / 10;
      cam.tracking.shake.decay = Cast.toNumber(args.DECAY);
      cam.tracking.shake.active = true;
    }

    // 十三、电影式跟踪
    addCinematicFocus(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      const focusName = Cast.toString(args.FOCUS);
      const focus = this.getTarget(focusName, { target: runtime.targets[0] });
      
      if (!cam || !focus) return;
      
      cam.tracking.cinematic.focusPoints.push({
        x: focus.x,
        y: focus.y,
        name: focusName
      });
    }

    setCinematicConfig(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.cinematic.transitionTime = Cast.toNumber(args.TIME);
      cam.tracking.cinematic.autoTransition = Cast.toString(args.AUTO) === "启用";
    }

    // 十四、智能跟踪配置
    setIntelligentTracking(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      cam.tracking.intelligent.reactionTime = Cast.toNumber(args.REACTION);
      cam.tracking.intelligent.anticipation = Cast.toNumber(args.ANTICIPATION);
      cam.tracking.intelligent.smoothness = Cast.toNumber(args.SMOOTHNESS);
    }

    stopCameraMotion(args) {
      const cameraName = Cast.toString(args.CAMERA) || "default";
      const cam = allCameras[cameraName];
      
      if (!cam) return;
      
      // 停止动画
      if (activeAnimations.has(cameraName)) {
        activeAnimations.delete(cameraName);
        cam.animation = null;
      }
      
      // 停止追踪
      cam.tracking.active = false;
      cam.tracking.shake.active = false;
    }

    // 十五、角色动画
    animateTarget(args, util) {
      return new Promise((resolve) => {
        const time = Cast.toNumber(args.TIME) * 1000; // 转换为毫秒
        const targetName = Cast.toString(args.TARGET);
        const target = this.getTarget(targetName, util);
        
        if (!target) {
          resolve();
          return;
        }
        
        const startX = target.x;
        const startY = target.y;
        const startScaleX = target.size / 100;
        const startScaleY = target.size / 100;
        
        const targetX = Cast.toNumber(args.X);
        const targetY = Cast.toNumber(args.Y);
        const targetScale = Cast.toNumber(args.ZOOM) / 100;
        const easing = Cast.toString(args.EASING) || 'easeOutBounce';
        
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / time, 1);
          const easedProgress = easingFunctions[easing](progress);
          
          target.x = startX + (targetX - startX) * easedProgress;
          target.y = startY + (targetY - startY) * easedProgress;
          target.size = (startScaleX + (targetScale - startScaleX) * easedProgress) * 100;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        
        animate();
      });
    }
  }

  Scratch.extensions.register(new SPcamera());
})(Scratch);