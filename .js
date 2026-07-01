(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('桌宠小猫Pro需要非沙盒模式运行');
  }

  const runtime = Scratch.vm.runtime;

  class CatPainter {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 180;
      this.canvas.height = 180;
      this.ctx = this.canvas.getContext('2d');
    }

    draw(cat) {
      const ctx = this.ctx;
      const t = cat.frame;
      const state = cat.state;

      ctx.clearRect(0, 0, 180, 180);
      ctx.save();

      if (cat.facing === 'left') {
        ctx.translate(180, 0);
        ctx.scale(-1, 1);
      }

      const breathe = Math.sin(t * 0.08) * 2;
      const walkBob =
        state === 'walk' || state === 'patrol' || state === 'chase'
          ? Math.abs(Math.sin(t * 0.22)) * 5
          : 0;
      const happyBob =
        state === 'happy' || state === 'cute'
          ? Math.abs(Math.sin(t * 0.3)) * 8
          : 0;
      const sleepDrop = state === 'sleep' ? 6 : 0;

      const cx = 90;
      const cy = 106 + breathe - walkBob - happyBob + sleepDrop;

      this.shadow(ctx, cx, 152, state);
      this.tail(ctx, cx, cy, t, state);
      this.body(ctx, cx, cy, t, state);
      this.feet(ctx, cx, cy, t, state);
      this.head(ctx, cx, cy - 44, t, state);
      this.face(ctx, cx, cy - 44, t, state, cat);
      this.effects(ctx, cx, cy, t, state, cat);

      ctx.restore();
    }

    shadow(ctx, x, y, state) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.beginPath();
      ctx.ellipse(x, y, state === 'jump' ? 44 : 68, state === 'jump' ? 7 : 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    tail(ctx, x, y, t, state) {
      const wag =
        state === 'happy' || state === 'cute'
          ? Math.sin(t * 0.35) * 20
          : state === 'walk' || state === 'patrol' || state === 'chase'
          ? Math.sin(t * 0.25) * 15
          : state === 'sleep'
          ? Math.sin(t * 0.05) * 3
          : Math.sin(t * 0.1) * 7;

      ctx.save();
      const g = ctx.createLinearGradient(x + 25, y, x + 70, y - 65);
      g.addColorStop(0, '#f28b25');
      g.addColorStop(1, '#ffd27c');

      ctx.strokeStyle = g;
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x + 30, y + 9);
      ctx.bezierCurveTo(
        x + 65 + wag,
        y - 5,
        x + 66 + wag,
        y - 52,
        x + 38 + wag,
        y - 60
      );
      ctx.stroke();

      ctx.strokeStyle = 'rgba(130,60,20,0.22)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 42 + wag, y - 55);
      ctx.lineTo(x + 53 + wag, y - 48);
      ctx.stroke();
      ctx.restore();
    }

    body(ctx, x, y, t, state) {
      ctx.save();

      const g = ctx.createRadialGradient(x - 12, y - 18, 8, x, y, 55);
      g.addColorStop(0, '#ffe19a');
      g.addColorStop(0.55, '#ffae45');
      g.addColorStop(1, '#e48622');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y + 8, 44, state === 'sleep' ? 31 : 39, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,246,220,0.75)';
      ctx.beginPath();
      ctx.ellipse(x - 3, y + 17, 25, 21, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(120,60,20,0.18)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x - 28, y - 7, 10, -0.6, 0.8);
      ctx.arc(x + 28, y - 7, 10, 2.35, 3.8);
      ctx.stroke();

      ctx.restore();
    }

    feet(ctx, x, y, t, state) {
      ctx.save();
      const step =
        state === 'walk' || state === 'patrol' || state === 'chase'
          ? Math.sin(t * 0.25) * 4
          : 0;

      ctx.fillStyle = '#f49232';
      ctx.beginPath();
      ctx.ellipse(x - 24 + step, y + 42, 13, 8, -0.1, 0, Math.PI * 2);
      ctx.ellipse(x + 24 - step, y + 42, 13, 8, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(100,45,10,0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 29 + step, y + 42);
      ctx.lineTo(x - 29 + step, y + 46);
      ctx.moveTo(x - 24 + step, y + 42);
      ctx.lineTo(x - 24 + step, y + 47);
      ctx.moveTo(x + 19 - step, y + 42);
      ctx.lineTo(x + 19 - step, y + 47);
      ctx.moveTo(x + 25 - step, y + 42);
      ctx.lineTo(x + 25 - step, y + 47);
      ctx.stroke();

      ctx.restore();
    }

    head(ctx, x, y, t, state) {
      ctx.save();

      const tilt =
        state === 'cute'
          ? Math.sin(t * 0.12) * 0.08
          : state === 'wash'
          ? Math.sin(t * 0.25) * 0.12
          : 0;

      ctx.translate(x, y);
      ctx.rotate(tilt);

      const g = ctx.createRadialGradient(-12, -12, 8, 0, 0, 45);
      g.addColorStop(0, '#ffe6a8');
      g.addColorStop(0.6, '#ffb24d');
      g.addColorStop(1, '#ea8a24');

      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(-35, -14);
      ctx.lineTo(-22, -49);
      ctx.lineTo(-6, -19);
      ctx.closePath();
      ctx.moveTo(35, -14);
      ctx.lineTo(22, -49);
      ctx.lineTo(6, -19);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ff90b3';
      ctx.beginPath();
      ctx.moveTo(-29, -18);
      ctx.lineTo(-22, -38);
      ctx.lineTo(-12, -20);
      ctx.closePath();
      ctx.moveTo(29, -18);
      ctx.lineTo(22, -38);
      ctx.lineTo(12, -20);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 39, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(130,70,20,0.28)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-13, -28);
      ctx.lineTo(-7, -17);
      ctx.moveTo(0, -31);
      ctx.lineTo(0, -17);
      ctx.moveTo(13, -28);
      ctx.lineTo(7, -17);
      ctx.stroke();

      ctx.restore();
    }

    face(ctx, x, y, t, state, cat) {
      ctx.save();
      ctx.translate(x, y);

      const blink = state !== 'sleep' && t % 160 > 148;
      const happy = state === 'happy' || state === 'cute';
      const hungry = state === 'hungry';
      const sleep = state === 'sleep';

      if (sleep) {
        ctx.strokeStyle = '#4a2a13';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-21, -3);
        ctx.quadraticCurveTo(-14, 3, -7, -3);
        ctx.moveTo(7, -3);
        ctx.quadraticCurveTo(14, 3, 21, -3);
        ctx.stroke();
      } else if (happy) {
        ctx.strokeStyle = '#4a2a13';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-23, -5);
        ctx.quadraticCurveTo(-15, -12, -7, -5);
        ctx.moveTo(7, -5);
        ctx.quadraticCurveTo(15, -12, 23, -5);
        ctx.stroke();
      } else if (blink) {
        ctx.strokeStyle = '#4a2a13';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-22, -5);
        ctx.lineTo(-8, -5);
        ctx.moveTo(8, -5);
        ctx.lineTo(22, -5);
        ctx.stroke();
      } else {
        this.eye(ctx, -15, -6);
        this.eye(ctx, 15, -6);
      }

      if (happy || cat.affection > 65) {
        ctx.fillStyle = 'rgba(255,105,140,0.35)';
        ctx.beginPath();
        ctx.ellipse(-27, 8, 8, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(27, 8, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#e95f83';
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.lineTo(-5, 8);
      ctx.lineTo(5, 8);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#4a2a13';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();

      if (hungry) {
        ctx.arc(0, 15, 5, 0, Math.PI * 2);
      } else if (happy) {
        ctx.moveTo(0, 8);
        ctx.lineTo(0, 12);
        ctx.quadraticCurveTo(-8, 20, -15, 10);
        ctx.moveTo(0, 12);
        ctx.quadraticCurveTo(8, 20, 15, 10);
      } else {
        ctx.moveTo(0, 8);
        ctx.lineTo(0, 12);
        ctx.quadraticCurveTo(-5, 16, -10, 12);
        ctx.moveTo(0, 12);
        ctx.quadraticCurveTo(5, 16, 10, 12);
      }

      ctx.stroke();

      ctx.strokeStyle = 'rgba(70,35,15,0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-36, 2);
      ctx.moveTo(-10, 13);
      ctx.lineTo(-37, 14);
      ctx.moveTo(10, 8);
      ctx.lineTo(36, 2);
      ctx.moveTo(10, 13);
      ctx.lineTo(37, 14);
      ctx.stroke();

      ctx.restore();
    }

    eye(ctx, x, y) {
      ctx.save();
      ctx.fillStyle = '#2d1c10';
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#5ee7ff';
      ctx.beginPath();
      ctx.ellipse(x + 1, y + 1, 3.5, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 2, y - 3, 2, 0, Math.PI * 2);
      ctx.arc(x + 2, y, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    effects(ctx, x, y, t, state, cat) {
      ctx.save();

      if (state === 'sleep') {
        ctx.fillStyle = '#5a7dff';
        ctx.font = 'bold 18px sans-serif';
        const up = (t % 80) * 0.35;
        ctx.fillText('Z', x + 38, y - 68 - up);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('z', x + 55, y - 55 - up * 0.7);
      }

      if (state === 'happy' || state === 'cute') {
        for (let i = 0; i < 3; i++) {
          const hx = x + 35 + i * 12;
          const hy = y - 80 - ((t + i * 20) % 70) * 0.45;
          ctx.fillStyle = `rgba(255,80,130,${1 - ((t + i * 20) % 70) / 90})`;
          this.heart(ctx, hx, hy, 5 + i);
        }
      }

      if (state === 'hungry') {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#ff9f32';
        ctx.lineWidth = 2;
        this.roundRect(ctx, x + 25, y - 88, 72, 28, 10, true, true);
        ctx.fillStyle = '#4a2a13';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('想吃积木', x + 32, y - 70);
      }

      if (state === 'wash') {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x - 35, y - 35, 7 + Math.sin(t * 0.3) * 2, 0, Math.PI * 2);
        ctx.arc(x - 48, y - 50, 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (cat.fullness < 10 && !cat.vanished) {
        ctx.fillStyle = 'rgba(255,60,60,0.9)';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('!', x - 5, y - 92);
      }

      ctx.restore();
    }

    heart(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s);
      ctx.bezierCurveTo(x - s * 2, y - s, x - s * 3, y + s, x, y + s * 3);
      ctx.bezierCurveTo(x + s * 3, y + s, x + s * 2, y - s, x, y + s);
      ctx.fill();
    }

    roundRect(ctx, x, y, w, h, r, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }
  }

  class DesktopCatPro {
    constructor() {
      this.painter = new CatPainter();
      this.el = null;
      this.bubble = null;

      this.x = 120;
      this.y = 120;
      this.targetX = 120;
      this.targetY = 120;

      this.state = 'idle';
      this.facing = 'right';
      this.frame = 0;

      this.fullness = 75;
      this.hunger = 25;
      this.energy = 85;
      this.mood = 70;
      this.affection = 30;
      this.boredom = 10;

      this.lastBlockFood = 0;
      this.blockFeedEnabled = true;
      this.vanished = false;

      this.dragging = false;
      this.dragOffX = 0;
      this.dragOffY = 0;

      this.mouseX = 0;
      this.mouseY = 0;

      this.aiCooldown = 0;
      this.actionTime = 0;
      this.stealCooldown = 0;
      this.petCooldown = 0;

      this.autoAI = true;
      this.chaseMouse = false;

      this.lastClicked = false;
      this.lastPetted = false;
      this.lastFed = false;

      this.loop = this.loop.bind(this);
    }

    create() {
      if (this.el) return;

      if (this.vanished) {
        this.vanished = false;
        this.fullness = 60;
        this.hunger = 40;
        this.energy = 75;
        this.mood = 65;
        this.boredom = 10;
        this.state = 'idle';
      }

      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${this.x}px;
        top: ${this.y}px;
        width: 180px;
        height: 180px;
        z-index: 999999;
        cursor: grab;
        user-select: none;
        pointer-events: auto;
        filter: drop-shadow(0 8px 16px rgba(0,0,0,0.18));
      `;

      this.painter.canvas.style.width = '180px';
      this.painter.canvas.style.height = '180px';
      el.appendChild(this.painter.canvas);
      document.body.appendChild(el);
      this.el = el;

      el.addEventListener('mousedown', e => {
        this.dragging = true;
        this.state = 'jump';
        this.dragOffX = e.clientX - this.x;
        this.dragOffY = e.clientY - this.y;
        el.style.cursor = 'grabbing';
        e.preventDefault();
      });

      el.addEventListener('click', () => {
        if (!this.dragging) this.click();
      });

      window.addEventListener('mousemove', e => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        if (this.dragging) {
          this.x = e.clientX - this.dragOffX;
          this.y = e.clientY - this.dragOffY;
          this.clamp();
          this.updatePos();
          return;
        }

        if (!this.el) return;

        const r = this.el.getBoundingClientRect();
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;

        if (inside) this.pet();
      });

      window.addEventListener('mouseup', e => {
        if (
          this.blockFeedEnabled &&
          this.el &&
          !this.dragging &&
          this.isPointInsideCat(e.clientX, e.clientY)
        ) {
          const ate = this.tryEatBlockAt(e.clientX, e.clientY, 'fed');
          if (ate) return;
        }

        if (!this.dragging) return;

        this.dragging = false;
        this.state = 'idle';
        this.actionTime = 30;
        if (this.el) this.el.style.cursor = 'grab';
      });

      requestAnimationFrame(this.loop);
    }

    destroy() {
      if (this.el) this.el.remove();
      if (this.bubble) this.bubble.remove();
      this.el = null;
      this.bubble = null;
    }

    loop() {
      if (!this.el) return;

      this.frame++;

      if (this.petCooldown > 0) this.petCooldown--;

      this.updateNeeds();

      if (!this.dragging && !this.vanished) {
        if (this.autoAI) this.decisionTree();
        this.moveLogic();
      }

      this.painter.draw(this);
      this.updateBubblePos();

      requestAnimationFrame(this.loop);
    }

    updateNeeds() {
      if (this.vanished) return;
      if (this.frame % 20 !== 0) return;

      let decay = 0.16;

      if (this.state === 'sleep') decay = 0.08;
      if (this.state === 'walk' || this.state === 'patrol' || this.state === 'chase') decay = 0.24;
      if (this.state === 'happy' || this.state === 'cute') decay = 0.2;

      this.fullness -= decay;
      this.hunger = Math.max(0, Math.min(100, 100 - this.fullness));

      this.boredom = Math.min(100, this.boredom + 0.12);

      if (this.state === 'sleep') {
        this.energy = Math.min(100, this.energy + 0.45);
      } else {
        this.energy = Math.max(0, this.energy - 0.08);
      }

      if (this.fullness < 25) this.mood = Math.max(0, this.mood - 0.18);
      if (this.fullness < 10) {
        this.mood = Math.max(0, this.mood - 0.32);
        this.energy = Math.max(0, this.energy - 0.15);
      }

      if (this.boredom > 75) this.mood = Math.max(0, this.mood - 0.12);
      if (this.energy < 25) this.mood = Math.max(0, this.mood - 0.1);

      if (this.fullness < 0) {
        this.vanish();
      }
    }

    decisionTree() {
      if (this.actionTime > 0) {
        this.actionTime--;
        return;
      }

      this.aiCooldown--;
      if (this.aiCooldown > 0) return;

      if (this.chaseMouse && this.energy > 15) {
        this.setState('chase', 80);
        this.targetX = this.mouseX - 90;
        this.targetY = this.mouseY - 90;
        this.aiCooldown = 8;
        return;
      }

      if (this.fullness < 10) {
        this.setState('hungry', 90);

        if (this.stealCooldown <= 0) {
          const stolen = this.stealLooseBlock();

          if (stolen) {
            this.say('太饿了，抢一块！');
            this.stealCooldown = 180;
          } else {
            this.say('饿到想吃积木……');
            this.stealCooldown = 100;
          }
        } else {
          this.stealCooldown--;
        }

        this.aiCooldown = 20;
        return;
      }

      if (this.fullness < 25) {
        this.say('喵……拖积木给我吃');
        this.setState('hungry', 110);
        this.aiCooldown = 80;
        return;
      }

      if (this.energy < 18) {
        this.say('困困……');
        this.setState('sleep', 260);
        this.aiCooldown = 120;
        return;
      }

      if (this.mood < 35 && this.affection > 35) {
        this.say('摸摸我嘛');
        this.setState('cute', 100);
        this.aiCooldown = 90;
        return;
      }

      if (this.boredom > 65 && this.energy > 35) {
        this.randomTarget();
        this.setState('patrol', 180);
        this.aiCooldown = 60;
        return;
      }

      const r = Math.random();

      if (r < 0.22) {
        this.setState('idle', 120);
      } else if (r < 0.38) {
        this.setState('wash', 120);
      } else if (r < 0.52) {
        this.say('喵~');
        this.setState('cute', 90);
      } else if (r < 0.72 && this.energy > 30) {
        this.randomTarget();
        this.setState('patrol', 150);
      } else if (r < 0.85) {
        this.setState('stretch', 90);
      } else {
        this.setState('sleep', 180);
      }

      this.aiCooldown = 80;
    }

    setState(state, time) {
      this.state = state;
      this.actionTime = Math.floor(time || 60);

      if (state === 'cute' || state === 'happy') {
        this.mood = Math.min(100, this.mood + 3);
      }

      if (state === 'patrol' || state === 'chase') {
        this.boredom = Math.max(0, this.boredom - 8);
      }
    }

    moveLogic() {
      if (
        this.state !== 'walk' &&
        this.state !== 'patrol' &&
        this.state !== 'chase'
      ) {
        return;
      }

      if (this.state === 'chase') {
        this.targetX = this.mouseX - 90;
        this.targetY = this.mouseY - 90;
      }

      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 3) {
        if (this.state !== 'chase') {
          this.state = 'idle';
          this.actionTime = 60;
        }
        return;
      }

      const speed =
        this.state === 'chase'
          ? 3.2
          : this.state === 'patrol'
          ? 1.6
          : 2.2;

      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed * 0.4;

      this.facing = dx >= 0 ? 'right' : 'left';

      this.clamp();
      this.updatePos();
    }

    randomTarget() {
      this.targetX = Math.random() * Math.max(1, window.innerWidth - 180);
      this.targetY = Math.random() * Math.max(1, window.innerHeight - 200);
    }

    click() {
      this.lastClicked = true;
      this.affection = Math.min(100, this.affection + 3);
      this.mood = Math.min(100, this.mood + 6);
      this.boredom = Math.max(0, this.boredom - 10);
      this.setState('happy', 90);
      this.say('喵呜！');
      runtime.startHats('desktopcatpro_whenClicked');
    }

    pet() {
      if (this.petCooldown > 0) return;

      this.petCooldown = 35;
      this.lastPetted = true;
      this.affection = Math.min(100, this.affection + 2);
      this.mood = Math.min(100, this.mood + 4);
      this.boredom = Math.max(0, this.boredom - 7);
      this.setState('cute', 70);
      runtime.startHats('desktopcatpro_whenPetted');
    }

    feed() {
      this.lastFed = true;

      this.fullness = Math.min(120, this.fullness + 35);
      this.hunger = Math.max(0, Math.min(100, 100 - this.fullness));

      this.mood = Math.min(100, this.mood + 12);
      this.affection = Math.min(100, this.affection + 6);
      this.energy = Math.min(100, this.energy + 6);

      this.setState('happy', 100);
      this.say('好吃！喵~');

      runtime.startHats('desktopcatpro_whenFed');
    }

    isPointInsideCat(x, y) {
      if (!this.el) return false;
      const r = this.el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    tryEatBlockAt(x, y, reason) {
      const block = this.findBlocklyBlockAtPoint(x, y) || this.findSelectedBlocklyBlock();

      if (!block) return false;
      if (!this.canEatBlock(block)) return false;

      const nutrition = this.getBlockNutrition(block);
      const name = this.getBlockName(block);

      const ok = this.disposeBlock(block);
      if (!ok) return false;

      this.eatBlockFood(nutrition, name, reason || 'fed');
      return true;
    }

    findBlocklyBlockAtPoint(x, y) {
      const ScratchBlocks = window.ScratchBlocks || window.Blockly;
      if (!ScratchBlocks) return null;

      const workspace =
        ScratchBlocks.getMainWorkspace?.() ||
        ScratchBlocks.mainWorkspace ||
        null;

      if (!workspace) return null;

      const els = document.elementsFromPoint(x, y);

      for (const el of els) {
        const node = el.closest?.('[data-id]');
        if (!node) continue;

        const id = node.getAttribute('data-id');
        if (!id) continue;

        const block = workspace.getBlockById?.(id);
        if (block) return block;
      }

      return null;
    }

    findSelectedBlocklyBlock() {
      const ScratchBlocks = window.ScratchBlocks || window.Blockly;
      if (!ScratchBlocks) return null;

      const workspace =
        ScratchBlocks.getMainWorkspace?.() ||
        ScratchBlocks.mainWorkspace ||
        null;

      if (!workspace) return null;

      const selected = ScratchBlocks.selected || ScratchBlocks.getSelected?.();
      if (selected && selected.id && workspace.getBlockById) {
        const b = workspace.getBlockById(selected.id);
        if (b) return b;
      }

      const selectedNode =
        document.querySelector('.blocklySelected[data-id]') ||
        document.querySelector('.blocklyDragging [data-id]') ||
        document.querySelector('[data-id].blocklySelected');

      if (selectedNode) {
        const id = selectedNode.getAttribute('data-id');
        const b = workspace.getBlockById?.(id);
        if (b) return b;
      }

      return null;
    }

    canEatBlock(block) {
      if (!block) return false;
      if (block.isShadow && block.isShadow()) return false;
      if (!block.workspace) return false;

      const type = block.type || '';

      if (type.includes('procedures_definition')) return false;

      return true;
    }

    getBlockNutrition(block) {
      let w = 80;
      let h = 30;

      try {
        const size = block.getHeightWidth?.();
        if (size) {
          w = size.width || w;
          h = size.height || h;
        }
      } catch (e) {}

      try {
        const root = block.getSvgRoot?.();
        const rect = root?.getBoundingClientRect?.();
        if (rect && rect.width && rect.height) {
          w = rect.width;
          h = rect.height;
        }
      } catch (e) {}

      let descendants = 1;
      try {
        descendants = block.getDescendants?.(false)?.length || 1;
      } catch (e) {}

      let nutrition = Math.round((w * h) / 1800);
      nutrition += Math.min(30, descendants * 2);

      const type = block.type || '';

      if (
        type.includes('control') ||
        type.includes('repeat') ||
        type.includes('forever') ||
        type.includes('if')
      ) {
        nutrition += 8;
      }

      nutrition = Math.max(4, Math.min(70, nutrition));
      return nutrition;
    }

    getBlockName(block) {
      try {
        const text = block.toString?.();
        if (text) return String(text).slice(0, 20);
      } catch (e) {}

      return block.type || '积木';
    }

    disposeBlock(block) {
      try {
        if (block.previousConnection && block.previousConnection.targetConnection) {
          block.previousConnection.disconnect();
        }

        if (block.outputConnection && block.outputConnection.targetConnection) {
          block.outputConnection.disconnect();
        }

        block.dispose(false, true);
        return true;
      } catch (e) {
        console.warn('[桌宠小猫] 吃积木失败:', e);
        return false;
      }
    }

    eatBlockFood(nutrition, blockName, reason) {
      this.lastBlockFood = nutrition;
      this.lastFed = true;

      this.fullness = Math.min(120, this.fullness + nutrition);
      this.hunger = Math.max(0, Math.min(100, 100 - this.fullness));

      this.mood = Math.min(100, this.mood + Math.round(nutrition * 0.35));
      this.energy = Math.min(100, this.energy + Math.round(nutrition * 0.12));
      this.affection = Math.min(100, this.affection + (reason === 'fed' ? 4 : 1));
      this.boredom = Math.max(0, this.boredom - 12);

      this.setState('happy', 90);

      if (reason === 'stolen') {
        this.say(`抢到积木 +${nutrition}`);
      } else {
        this.say(`吃掉积木 +${nutrition}`);
      }

      runtime.startHats('desktopcatpro_whenFed');
    }

    stealLooseBlock() {
      if (!this.blockFeedEnabled) return false;

      const ScratchBlocks = window.ScratchBlocks || window.Blockly;
      if (!ScratchBlocks) return false;

      const workspace =
        ScratchBlocks.getMainWorkspace?.() ||
        ScratchBlocks.mainWorkspace ||
        null;

      if (!workspace) return false;

      let blocks = [];

      try {
        blocks = workspace.getTopBlocks?.(false) || [];
      } catch (e) {
        return false;
      }

      blocks = blocks.filter(b => {
        if (!this.canEatBlock(b)) return false;

        const type = b.type || '';

        if (type.includes('event_when')) return false;
        if (type.includes('procedures_definition')) return false;

        return true;
      });

      if (blocks.length === 0) return false;

      const cx = this.x + 90;
      const cy = this.y + 90;

      let best = null;
      let bestDist = Infinity;

      for (const b of blocks) {
        const p = this.getBlockScreenCenter(b);
        if (!p) continue;

        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d < bestDist) {
          bestDist = d;
          best = b;
        }
      }

      if (!best) {
        best = blocks[Math.floor(Math.random() * blocks.length)];
      }

      const nutrition = this.getBlockNutrition(best);
      const name = this.getBlockName(best);

      const ok = this.disposeBlock(best);
      if (!ok) return false;

      this.eatBlockFood(nutrition, name, 'stolen');
      return true;
    }

    getBlockScreenCenter(block) {
      try {
        const root = block.getSvgRoot?.();
        const rect = root?.getBoundingClientRect?.();

        if (rect && rect.width && rect.height) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      } catch (e) {}

      return null;
    }

    vanish() {
      if (this.vanished) return;

      this.vanished = true;
      this.state = 'sleep';
      this.say('饿晕了……');

      if (this.el) {
        this.el.style.transition = 'transform .8s ease, opacity .8s ease, filter .8s ease';
        this.el.style.transform = 'scale(0.2) rotate(25deg)';
        this.el.style.opacity = '0';
        this.el.style.filter = 'blur(4px)';
      }

      setTimeout(() => {
        this.destroy();
      }, 850);
    }

    say(text) {
      if (!this.el) return;

      if (this.bubble) this.bubble.remove();

      const b = document.createElement('div');
      b.textContent = text;
      b.style.cssText = `
        position: fixed;
        z-index: 1000000;
        max-width: 190px;
        padding: 8px 12px;
        background: rgba(255,255,255,0.96);
        border: 2px solid #ffb24d;
        border-radius: 14px;
        color: #3d2a18;
        font: bold 14px sans-serif;
        box-shadow: 0 6px 18px rgba(0,0,0,0.18);
        pointer-events: none;
      `;

      document.body.appendChild(b);
      this.bubble = b;
      this.updateBubblePos();

      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = setTimeout(() => {
        if (this.bubble) this.bubble.remove();
        this.bubble = null;
      }, 2300);
    }

    updateBubblePos() {
      if (!this.bubble) return;
      this.bubble.style.left = `${this.x + 108}px`;
      this.bubble.style.top = `${this.y + 8}px`;
    }

    clamp() {
      this.x = Math.max(0, Math.min(window.innerWidth - 180, this.x));
      this.y = Math.max(0, Math.min(window.innerHeight - 180, this.y));
    }

    updatePos() {
      if (!this.el) return;
      this.el.style.left = `${this.x}px`;
      this.el.style.top = `${this.y}px`;
    }
  }

  const cat = new DesktopCatPro();

  class DesktopCatProExtension {
    getInfo() {
      return {
        id: 'desktopcatpro',
        name: '桌宠小猫Pro',
        color1: '#ffb24d',
        color2: '#f08a24',
        color3: '#8a4b14',
        blocks: [
          {
            opcode: 'show',
            blockType: Scratch.BlockType.COMMAND,
            text: '召唤桌宠小猫'
          },
          {
            opcode: 'hide',
            blockType: Scratch.BlockType.COMMAND,
            text: '收起桌宠小猫'
          },
          '---',
          {
            opcode: 'say',
            blockType: Scratch.BlockType.COMMAND,
            text: '小猫说 [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '喵~'
              }
            }
          },
          {
            opcode: 'feed',
            blockType: Scratch.BlockType.COMMAND,
            text: '投喂小猫'
          },
          {
            opcode: 'setBlockFeed',
            blockType: Scratch.BlockType.COMMAND,
            text: '积木喂食 [ON]',
            arguments: {
              ON: {
                type: Scratch.ArgumentType.STRING,
                menu: 'switch',
                defaultValue: 'on'
              }
            }
          },
          {
            opcode: 'setAction',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置小猫行为 [ACTION]',
            arguments: {
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'actions',
                defaultValue: 'idle'
              }
            }
          },
          {
            opcode: 'goTo',
            blockType: Scratch.BlockType.COMMAND,
            text: '让小猫走到 x [X] y [Y]',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 300
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 120
              }
            }
          },
          {
            opcode: 'setAI',
            blockType: Scratch.BlockType.COMMAND,
            text: '自动决策 AI [ON]',
            arguments: {
              ON: {
                type: Scratch.ArgumentType.STRING,
                menu: 'switch',
                defaultValue: 'on'
              }
            }
          },
          {
            opcode: 'setChaseMouse',
            blockType: Scratch.BlockType.COMMAND,
            text: '追鼠标模式 [ON]',
            arguments: {
              ON: {
                type: Scratch.ArgumentType.STRING,
                menu: 'switch',
                defaultValue: 'off'
              }
            }
          },
          '---',
          {
            opcode: 'whenClicked',
            blockType: Scratch.BlockType.EVENT,
            text: '当小猫被点击'
          },
          {
            opcode: 'whenPetted',
            blockType: Scratch.BlockType.EVENT,
            text: '当小猫被抚摸'
          },
          {
            opcode: 'whenFed',
            blockType: Scratch.BlockType.EVENT,
            text: '当小猫被投喂'
          },
          '---',
          {
            opcode: 'getState',
            blockType: Scratch.BlockType.REPORTER,
            text: '小猫状态'
          },
          {
            opcode: 'getFullness',
            blockType: Scratch.BlockType.REPORTER,
            text: '饱腹度'
          },
          {
            opcode: 'getHunger',
            blockType: Scratch.BlockType.REPORTER,
            text: '饥饿值'
          },
          {
            opcode: 'getLastBlockFood',
            blockType: Scratch.BlockType.REPORTER,
            text: '上次吃掉积木营养'
          },
          {
            opcode: 'getEnergy',
            blockType: Scratch.BlockType.REPORTER,
            text: '精力值'
          },
          {
            opcode: 'getMood',
            blockType: Scratch.BlockType.REPORTER,
            text: '心情值'
          },
          {
            opcode: 'getAffection',
            blockType: Scratch.BlockType.REPORTER,
            text: '亲密度'
          },
          {
            opcode: 'getBoredom',
            blockType: Scratch.BlockType.REPORTER,
            text: '无聊值'
          },
          {
            opcode: 'getX',
            blockType: Scratch.BlockType.REPORTER,
            text: '小猫 x'
          },
          {
            opcode: 'getY',
            blockType: Scratch.BlockType.REPORTER,
            text: '小猫 y'
          },
          {
            opcode: 'isVanished',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '小猫已消失?'
          }
        ],
        menus: {
          actions: {
            acceptReporters: true,
            items: [
              { text: '发呆', value: 'idle' },
              { text: '走路', value: 'walk' },
              { text: '巡视', value: 'patrol' },
              { text: '睡觉', value: 'sleep' },
              { text: '开心', value: 'happy' },
              { text: '撒娇', value: 'cute' },
              { text: '饿了', value: 'hungry' },
              { text: '洗脸', value: 'wash' },
              { text: '伸懒腰', value: 'stretch' },
              { text: '追鼠标', value: 'chase' }
            ]
          },
          switch: {
            acceptReporters: true,
            items: [
              { text: '开', value: 'on' },
              { text: '关', value: 'off' }
            ]
          }
        }
      };
    }

    show() {
      cat.create();
    }

    hide() {
      cat.destroy();
    }

    say(args) {
      cat.say(String(args.TEXT));
    }

    feed() {
      cat.feed();
    }

    setBlockFeed(args) {
      cat.blockFeedEnabled = String(args.ON) === 'on';
    }

    setAction(args) {
      cat.setState(String(args.ACTION), 180);
    }

    goTo(args) {
      cat.targetX = Number(args.X);
      cat.targetY = Number(args.Y);
      cat.state = 'walk';
      cat.actionTime = 200;
      cat.clamp();
    }

    setAI(args) {
      cat.autoAI = String(args.ON) === 'on';
    }

    setChaseMouse(args) {
      cat.chaseMouse = String(args.ON) === 'on';
      if (cat.chaseMouse) {
        cat.state = 'chase';
      }
    }

    whenClicked() {
      return false;
    }

    whenPetted() {
      return false;
    }

    whenFed() {
      return false;
    }

    getState() {
      return cat.state;
    }

    getFullness() {
      return Math.round(cat.fullness);
    }

    getHunger() {
      return Math.round(Math.max(0, Math.min(100, 100 - cat.fullness)));
    }

    getLastBlockFood() {
      return Math.round(cat.lastBlockFood);
    }

    getEnergy() {
      return Math.round(cat.energy);
    }

    getMood() {
      return Math.round(cat.mood);
    }

    getAffection() {
      return Math.round(cat.affection);
    }

    getBoredom() {
      return Math.round(cat.boredom);
    }

    getX() {
      return Math.round(cat.x);
    }

    getY() {
      return Math.round(cat.y);
    }

    isVanished() {
      return !!cat.vanished;
    }
  }

  Scratch.extensions.register(new DesktopCatProExtension());
})(Scratch);
