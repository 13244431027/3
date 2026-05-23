(function (Scratch) {
  'use strict';

  class Heap {
    constructor(score) {
      this.a = [];
      this.score = score;
    }

    get size() {
      return this.a.length;
    }

    push(v) {
      this.a.push(v);
      this._up(this.a.length - 1);
    }

    pop() {
      if (!this.a.length) return null;
      const top = this.a[0];
      const last = this.a.pop();

      if (this.a.length) {
        this.a[0] = last;
        this._down(0);
      }

      return top;
    }

    _up(i) {
      while (i > 0) {
        const p = (i - 1) >> 1;

        if (this.score(this.a[i]) < this.score(this.a[p])) {
          [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
          i = p;
        } else {
          break;
        }
      }
    }

    _down(i) {
      while (true) {
        let s = i;
        const l = i * 2 + 1;
        const r = i * 2 + 2;

        if (l < this.a.length && this.score(this.a[l]) < this.score(this.a[s])) s = l;
        if (r < this.a.length && this.score(this.a[r]) < this.score(this.a[s])) s = r;

        if (s !== i) {
          [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
          i = s;
        } else {
          break;
        }
      }
    }
  }

  class PathfindingFusion {
    constructor(runtime) {
      this.runtime = runtime;

      this.STAGE_W = 480;
      this.STAGE_H = 360;

      this.grid = null;
      this.w = 0;
      this.h = 0;

      this.sx = -1;
      this.sy = -1;
      this.ex = -1;
      this.ey = -1;

      this.diag = true;
      this.corner = false;

      this.pathGrid = [];
      this.path = [];
      this.pathStr = '';
      this.pathLen = 0;
      this.time = 0;
      this.usedAlgorithm = '';

      this.dWin = null;
      this.dCanvas = null;
      this.dCtx = null;

      this._debugMode = 'edit';
      this._debugTool = 'wall';
      this._zoomScale = 1;
      this._panX = 0;
      this._panY = 0;
      this._winX = 0;
      this._winY = 0;

      this._debugTitle = null;
      this._debugInfo = null;
      this._debugPalette = null;
      this._toolBtns = null;
      this._debugGeo = null;

      setTimeout(() => this._makeDebugWindow(), 0);
    }

    getInfo() {
      return {
        id: 'pathfindingFusion',
        name: '融合寻路',
        color1: '#4a90e2',
        blocks: [
          {
            opcode: 'createGrid',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建网格 宽 [W] 高 [H]',
            arguments: {
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 80 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 }
            }
          },
          {
            opcode: 'setStart',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置起点 X:[X] Y:[Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: -200 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 }
            }
          },
          {
            opcode: 'setEnd',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置终点 X:[X] Y:[Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: -120 }
            }
          },
          {
            opcode: 'addObst',
            blockType: Scratch.BlockType.COMMAND,
            text: '添加障碍点 X:[X] Y:[Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'remObst',
            blockType: Scratch.BlockType.COMMAND,
            text: '移除障碍点 X:[X] Y:[Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'addRectObst',
            blockType: Scratch.BlockType.COMMAND,
            text: '添加矩形障碍 X:[X] Y:[Y] 宽:[W] 高:[H]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: -50 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'clearRectObst',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除矩形障碍 X:[X] Y:[Y] 宽:[W] 高:[H]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: -50 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'placeSpriteAsObstacle',
            blockType: Scratch.BlockType.COMMAND,
            text: '放置角色 [SPRITE] 造型 [COSTUME] 于 X:[X] Y:[Y] 缩放:[SCALE]% 旋转:[ROT]° 为障碍物',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' },
              COSTUME: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SCALE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              ROT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setRules',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置对角线 [DIAG] 跨角落 [CORNER]',
            arguments: {
              DIAG: {
                type: Scratch.ArgumentType.STRING,
                menu: 'yn',
                defaultValue: '允许'
              },
              CORNER: {
                type: Scratch.ArgumentType.STRING,
                menu: 'yn',
                defaultValue: '禁止'
              }
            }
          },
          {
            opcode: 'findPath',
            blockType: Scratch.BlockType.COMMAND,
            text: '执行寻路 算法 [ALG]',
            arguments: {
              ALG: {
                type: Scratch.ArgumentType.STRING,
                menu: 'alg',
                defaultValue: '融合算法'
              }
            }
          },
          {
            opcode: 'getLen',
            blockType: Scratch.BlockType.REPORTER,
            text: '路径长度'
          },
          {
            opcode: 'getStr',
            blockType: Scratch.BlockType.REPORTER,
            text: '路径字符串'
          },
          {
            opcode: 'getPt',
            blockType: Scratch.BlockType.REPORTER,
            text: '路径第 [IDX] 个点的 [AX] 坐标',
            arguments: {
              IDX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              AX: { type: Scratch.ArgumentType.STRING, menu: 'axis', defaultValue: 'X' }
            }
          },
          {
            opcode: 'getTime',
            blockType: Scratch.BlockType.REPORTER,
            text: '寻路耗时 ms'
          },
          {
            opcode: 'getUsedAlgorithm',
            blockType: Scratch.BlockType.REPORTER,
            text: '实际使用算法'
          },
          {
            opcode: 'getObstacleList',
            blockType: Scratch.BlockType.REPORTER,
            text: '障碍物列表'
          },
          {
            opcode: 'getObstacleSVG',
            blockType: Scratch.BlockType.REPORTER,
            text: '障碍物 SVG'
          },
          {
            opcode: 'showWin',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示调试窗口'
          },
          {
            opcode: 'hideWin',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏调试窗口'
          }
        ],
        menus: {
          yn: {
            acceptReporters: false,
            items: ['允许', '禁止']
          },
          alg: {
            acceptReporters: false,
            items: ['融合算法', 'AStar', 'JPS']
          },
          axis: {
            acceptReporters: false,
            items: ['X', 'Y']
          },
          spriteMenu: {
            acceptReporters: false,
            items: 'getSpriteMenuItems'
          }
        }
      };
    }

    getSpriteMenuItems() {
      try {
        const targets = this.runtime.targets || [];
        return targets
          .filter(t => t && !t.isStage && t.sprite && t.sprite.name)
          .map(t => t.sprite.name);
      } catch (e) {
        return [];
      }
    }

    _ok(x, y) {
      return x >= 0 && y >= 0 && x < this.w && y < this.h;
    }

    _scratchToGridX(x) {
      return Math.min(
        this.w - 1,
        Math.max(0, Math.floor((x + this.STAGE_W / 2) / this.STAGE_W * this.w))
      );
    }

    _scratchToGridY(y) {
      return Math.min(
        this.h - 1,
        Math.max(0, Math.floor((this.STAGE_H / 2 - y) / this.STAGE_H * this.h))
      );
    }

    _gridToScratchX(x) {
      return -this.STAGE_W / 2 + (x + 0.5) * this.STAGE_W / this.w;
    }

    _gridToScratchY(y) {
      return this.STAGE_H / 2 - (y + 0.5) * this.STAGE_H / this.h;
    }

    createGrid(args) {
      const w = Math.max(1, Math.floor(Number(args.W)));
      const h = Math.max(1, Math.floor(Number(args.H)));

      this.w = w;
      this.h = h;
      this.grid = Array.from({ length: h }, () => Array(w).fill(0));

      this.sx = this.sy = this.ex = this.ey = -1;

      this._clearPath();

      this._zoomScale = 1;
      this._panX = 0;
      this._panY = 0;

      this._draw();
    }

    setStart(args) {
      if (!this.grid) return;

      this.sx = this._scratchToGridX(Number(args.X));
      this.sy = this._scratchToGridY(Number(args.Y));

      if (this._ok(this.sx, this.sy)) {
        this.grid[this.sy][this.sx] = 0;
      }

      this._clearPath();
      this._draw();
    }

    setEnd(args) {
      if (!this.grid) return;

      this.ex = this._scratchToGridX(Number(args.X));
      this.ey = this._scratchToGridY(Number(args.Y));

      if (this._ok(this.ex, this.ey)) {
        this.grid[this.ey][this.ex] = 0;
      }

      this._clearPath();
      this._draw();
    }

    addObst(args) {
      if (!this.grid) return;

      const x = this._scratchToGridX(Number(args.X));
      const y = this._scratchToGridY(Number(args.Y));

      if (this._ok(x, y)) {
        this.grid[y][x] = 1;

        if (x === this.sx && y === this.sy) {
          this.sx = -1;
          this.sy = -1;
        }

        if (x === this.ex && y === this.ey) {
          this.ex = -1;
          this.ey = -1;
        }
      }

      this._clearPath();
      this._draw();
    }

    remObst(args) {
      if (!this.grid) return;

      const x = this._scratchToGridX(Number(args.X));
      const y = this._scratchToGridY(Number(args.Y));

      if (this._ok(x, y)) this.grid[y][x] = 0;

      this._clearPath();
      this._draw();
    }

    addRectObst(args) {
      this._rect(args, 1);
    }

    clearRectObst(args) {
      this._rect(args, 0);
    }

    _rect(args, v) {
      if (!this.grid) return;

      const x = Number(args.X);
      const y = Number(args.Y);
      const w = Number(args.W);
      const h = Number(args.H);

      const x1 = this._scratchToGridX(x);
      const y1 = this._scratchToGridY(y);
      const x2 = this._scratchToGridX(x + w);
      const y2 = this._scratchToGridY(y - h);

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      for (let yy = minY; yy <= maxY; yy++) {
        for (let xx = minX; xx <= maxX; xx++) {
          if (this._ok(xx, yy)) {
            this.grid[yy][xx] = v;

            if (v === 1) {
              if (xx === this.sx && yy === this.sy) {
                this.sx = -1;
                this.sy = -1;
              }

              if (xx === this.ex && yy === this.ey) {
                this.ex = -1;
                this.ey = -1;
              }
            }
          }
        }
      }

      this._clearPath();
      this._draw();
    }

    async placeSpriteAsObstacle(args) {
      if (!this.grid) return;

      const spriteName = String(args.SPRITE || '');
      const costumeArg = String(args.COSTUME || '1');
      const x = Number(args.X);
      const y = Number(args.Y);
      const scale = Number(args.SCALE) / 100;
      const rot = Number(args.ROT) * Math.PI / 180;

      try {
        const target = this.runtime.getSpriteTargetByName(spriteName);
        if (!target) return;

        const costumes = target.getCostumes();
        if (!costumes || !costumes.length) return;

        let costume = costumes.find(c => c.name === costumeArg);

        if (!costume) {
          const idx = Math.max(0, Math.floor(Number(costumeArg)) - 1);
          costume = costumes[idx] || costumes[0];
        }

        const asset = costume.asset;
        if (!asset || !asset.data) return;

        const format = String(costume.dataFormat || asset.dataFormat || 'png').toLowerCase();

        const mime =
          format === 'svg'
            ? 'image/svg+xml'
            : format === 'jpg' || format === 'jpeg'
              ? 'image/jpeg'
              : 'image/png';

        const blob = new Blob([asset.data], { type: mime });
        const url = URL.createObjectURL(blob);

        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = this.STAGE_W;
        canvas.height = this.STAGE_H;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = x + this.STAGE_W / 2;
        const cy = this.STAGE_H / 2 - y;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let gy = 0; gy < this.h; gy++) {
          for (let gx = 0; gx < this.w; gx++) {
            const sx = Math.floor(this._gridToScratchX(gx) + this.STAGE_W / 2);
            const sy = Math.floor(this.STAGE_H / 2 - this._gridToScratchY(gy));

            if (sx >= 0 && sy >= 0 && sx < canvas.width && sy < canvas.height) {
              const alpha = data[(sy * canvas.width + sx) * 4 + 3];

              if (alpha > 128) {
                this.grid[gy][gx] = 1;

                if (gx === this.sx && gy === this.sy) {
                  this.sx = -1;
                  this.sy = -1;
                }

                if (gx === this.ex && gy === this.ey) {
                  this.ex = -1;
                  this.ey = -1;
                }
              }
            }
          }
        }

        URL.revokeObjectURL(url);

        this._clearPath();
        this._draw();
      } catch (e) {
        console.error('角色造型转障碍失败:', e);
      }
    }

    setRules(args) {
      this.diag = args.DIAG === '允许';
      this.corner = args.CORNER === '允许';
      this._clearPath();
      this._draw();
    }

    findPath(args) {
      if (!this.grid || this.sx < 0 || this.sy < 0 || this.ex < 0 || this.ey < 0) {
        this._clearPath();
        this._draw();
        return;
      }

      if (this.grid[this.sy][this.sx] || this.grid[this.ey][this.ex]) {
        this._clearPath();
        this._draw();
        return;
      }

      const alg = String(args.ALG || '融合算法');
      const t0 = performance.now();

      let result = [];

      if (alg === 'AStar') {
        result = this._astar();
        this.usedAlgorithm = 'AStar';
      } else if (alg === 'JPS') {
        result = this._jps();
        this.usedAlgorithm = 'JPS';
      } else {
        result = this._jps();

        if (result && result.length) {
          this.usedAlgorithm = '融合算法: JPS';
        } else {
          result = this._astar();
          this.usedAlgorithm = '融合算法: AStar回退';
        }
      }

      if (!result || !result.length) {
        this._clearPath();
      } else {
        result = this._expandPath(result);
        result = this._smoothPath(result);

        this.pathGrid = result;

        this.path = result.map(p => ({
          x: this._gridToScratchX(p.x),
          y: this._gridToScratchY(p.y)
        }));

        this.pathLen = this.path.length;
        this.pathStr = this.path.map(p => `${p.x},${p.y}`).join(';');
      }

      this.time = Math.round((performance.now() - t0) * 100) / 100;
      this._draw();
    }

    _heuristic(x1, y1, x2, y2) {
      const dx = Math.abs(x1 - x2);
      const dy = Math.abs(y1 - y2);
      return this.diag ? Math.max(dx, dy) : dx + dy;
    }

    _walk(x, y) {
      return this._ok(x, y) && !this.grid[y][x];
    }

    _neighbors(x, y) {
      const out = [];

      const dirs = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (this._walk(nx, ny)) {
          out.push({ x: nx, y: ny });
        }
      }

      if (this.diag) {
        const ds = [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1]
        ];

        for (const [dx, dy] of ds) {
          const nx = x + dx;
          const ny = y + dy;

          if (!this._walk(nx, ny)) continue;

          if (this.corner) {
            out.push({ x: nx, y: ny });
          } else if (!this.grid[y][nx] && !this.grid[ny][x]) {
            out.push({ x: nx, y: ny });
          }
        }
      }

      return out;
    }

    _astar() {
      const w = this.w;
      const total = this.w * this.h;

      const sid = this.sy * w + this.sx;
      const eid = this.ey * w + this.ex;

      const g = new Float64Array(total);
      const f = new Float64Array(total);
      const parent = new Int32Array(total);
      const closed = new Uint8Array(total);

      for (let i = 0; i < total; i++) {
        g[i] = Infinity;
        f[i] = Infinity;
        parent[i] = -1;
      }

      g[sid] = 0;
      f[sid] = this._heuristic(this.sx, this.sy, this.ex, this.ey);

      const open = new Heap(id => f[id]);
      open.push(sid);

      while (open.size) {
        const cur = open.pop();

        if (closed[cur]) continue;

        closed[cur] = 1;

        if (cur === eid) {
          return this._buildPath(parent, eid);
        }

        const x = cur % w;
        const y = Math.floor(cur / w);

        for (const n of this._neighbors(x, y)) {
          const nid = n.y * w + n.x;

          if (closed[nid]) continue;

          const cost = x !== n.x && y !== n.y ? Math.SQRT2 : 1;
          const ng = g[cur] + cost;

          if (ng < g[nid]) {
            parent[nid] = cur;
            g[nid] = ng;
            f[nid] = ng + this._heuristic(n.x, n.y, this.ex, this.ey);
            open.push(nid);
          }
        }
      }

      return [];
    }

    _jps() {
      if (!this.diag) return this._astar();

      const w = this.w;
      const total = this.w * this.h;

      const sid = this.sy * w + this.sx;
      const eid = this.ey * w + this.ex;

      const g = new Float64Array(total);
      const f = new Float64Array(total);
      const parent = new Int32Array(total);
      const closed = new Uint8Array(total);

      for (let i = 0; i < total; i++) {
        g[i] = Infinity;
        f[i] = Infinity;
        parent[i] = -1;
      }

      g[sid] = 0;
      f[sid] = this._heuristic(this.sx, this.sy, this.ex, this.ey);

      const open = new Heap(id => f[id]);
      open.push(sid);

      while (open.size) {
        const cur = open.pop();

        if (closed[cur]) continue;

        closed[cur] = 1;

        if (cur === eid) {
          return this._buildPath(parent, eid);
        }

        const cx = cur % w;
        const cy = Math.floor(cur / w);

        const dirs = this._jpsDirs(cur, parent);

        for (const d of dirs) {
          const jp = this._jump(cx, cy, d[0], d[1]);

          if (!jp) continue;

          const jid = jp.y * w + jp.x;

          if (closed[jid]) continue;

          const dist = Math.max(Math.abs(jp.x - cx), Math.abs(jp.y - cy));
          const ng = g[cur] + dist;

          if (ng < g[jid]) {
            parent[jid] = cur;
            g[jid] = ng;
            f[jid] = ng + this._heuristic(jp.x, jp.y, this.ex, this.ey);
            open.push(jid);
          }
        }
      }

      return [];
    }

    _jpsDirs(id, parent) {
      const x = id % this.w;
      const y = Math.floor(id / this.w);
      const p = parent[id];

      if (p === -1) {
        const dirs = [];

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx || dy) {
              if (this._walk(x + dx, y + dy)) {
                if (dx && dy && !this.corner) {
                  if (this._walk(x + dx, y) && this._walk(x, y + dy)) {
                    dirs.push([dx, dy]);
                  }
                } else {
                  dirs.push([dx, dy]);
                }
              }
            }
          }
        }

        return dirs;
      }

      const px = p % this.w;
      const py = Math.floor(p / this.w);

      const dx = Math.sign(x - px);
      const dy = Math.sign(y - py);

      const dirs = [];

      if (dx && dy) {
        if (this._walk(x + dx, y)) dirs.push([dx, 0]);
        if (this._walk(x, y + dy)) dirs.push([0, dy]);

        if (this._walk(x + dx, y + dy)) {
          if (this.corner || (this._walk(x + dx, y) && this._walk(x, y + dy))) {
            dirs.push([dx, dy]);
          }
        }

        if (!this._walk(x - dx, y) && this._walk(x - dx, y + dy)) dirs.push([-dx, dy]);
        if (!this._walk(x, y - dy) && this._walk(x + dx, y - dy)) dirs.push([dx, -dy]);
      } else if (dx) {
        if (this._walk(x + dx, y)) dirs.push([dx, 0]);
        if (!this._walk(x, y - 1) && this._walk(x + dx, y - 1)) dirs.push([dx, -1]);
        if (!this._walk(x, y + 1) && this._walk(x + dx, y + 1)) dirs.push([dx, 1]);
      } else if (dy) {
        if (this._walk(x, y + dy)) dirs.push([0, dy]);
        if (!this._walk(x - 1, y) && this._walk(x - 1, y + dy)) dirs.push([-1, dy]);
        if (!this._walk(x + 1, y) && this._walk(x + 1, y + dy)) dirs.push([1, dy]);
      }

      return dirs;
    }

    _jump(x, y, dx, dy) {
      while (true) {
        x += dx;
        y += dy;

        if (!this._walk(x, y)) return null;

        if (x === this.ex && y === this.ey) {
          return { x, y };
        }

        if (dx && dy) {
          if (
            (!this._walk(x - dx, y) && this._walk(x - dx, y + dy)) ||
            (!this._walk(x, y - dy) && this._walk(x + dx, y - dy))
          ) {
            return { x, y };
          }

          if (this._jump(x, y, dx, 0) || this._jump(x, y, 0, dy)) {
            return { x, y };
          }

          if (!this.corner) {
            if (!this._walk(x - dx, y) || !this._walk(x, y - dy)) {
              return null;
            }
          }
        } else if (dx) {
          if (
            (!this._walk(x, y - 1) && this._walk(x + dx, y - 1)) ||
            (!this._walk(x, y + 1) && this._walk(x + dx, y + 1))
          ) {
            return { x, y };
          }
        } else if (dy) {
          if (
            (!this._walk(x - 1, y) && this._walk(x - 1, y + dy)) ||
            (!this._walk(x + 1, y) && this._walk(x + 1, y + dy))
          ) {
            return { x, y };
          }
        }
      }
    }

    _buildPath(parent, endId) {
      const path = [];
      let cur = endId;

      while (cur !== -1) {
        path.unshift({
          x: cur % this.w,
          y: Math.floor(cur / this.w)
        });

        cur = parent[cur];
      }

      return path;
    }

    _line(x0, y0, x1, y1) {
      const out = [];

      let dx = Math.abs(x1 - x0);
      let dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      while (true) {
        out.push({ x: x0, y: y0 });

        if (x0 === x1 && y0 === y1) break;

        const e2 = err * 2;

        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }

        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }

      return out;
    }

    _expandPath(path) {
      if (!path || path.length < 2) return path || [];

      const out = [];

      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        const line = this._line(a.x, a.y, b.x, b.y);

        for (let j = 0; j < line.length - 1; j++) {
          out.push(line[j]);
        }
      }

      out.push(path[path.length - 1]);

      return out;
    }

    _canSee(a, b) {
      const line = this._line(a.x, a.y, b.x, b.y);

      for (const p of line) {
        if (!this._walk(p.x, p.y)) return false;
      }

      return true;
    }

    _smoothPath(path) {
      if (!path || path.length <= 2) return path || [];

      const out = [path[0]];
      let anchor = path[0];

      for (let i = 2; i < path.length; i++) {
        if (!this._canSee(anchor, path[i])) {
          const last = path[i - 1];
          out.push(last);
          anchor = last;
        }
      }

      out.push(path[path.length - 1]);

      return out;
    }

    _clearPath() {
      this.pathGrid = [];
      this.path = [];
      this.pathStr = '';
      this.pathLen = 0;
    }

    getLen() {
      return this.pathLen;
    }

    getStr() {
      return this.pathStr;
    }

    getPt(args) {
      const i = Math.floor(Number(args.IDX));

      if (i < 0 || i >= this.path.length) return 0;

      return args.AX === 'Y' ? this.path[i].y : this.path[i].x;
    }

    getTime() {
      return this.time;
    }

    getUsedAlgorithm() {
      return this.usedAlgorithm;
    }

    getObstacleList() {
      if (!this.grid) return '';

      const arr = [];

      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.grid[y][x]) {
            arr.push(`${this._gridToScratchX(x)},${this._gridToScratchY(y)}`);
          }
        }
      }

      return arr.join(';');
    }

    getObstacleSVG() {
      if (!this.grid) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.STAGE_W}" height="${this.STAGE_H}"></svg>`;
      }

      const cw = this.STAGE_W / this.w;
      const ch = this.STAGE_H / this.h;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.STAGE_W}" height="${this.STAGE_H}" viewBox="0 0 ${this.STAGE_W} ${this.STAGE_H}">`;
      svg += `<rect width="${this.STAGE_W}" height="${this.STAGE_H}" fill="white"/>`;

      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          if (this.grid[y][x]) {
            svg += `<rect x="${x * cw}" y="${y * ch}" width="${cw}" height="${ch}" fill="#555"/>`;
          }
        }
      }

      svg += `</svg>`;

      return svg;
    }

    showWin() {
      if (this.dWin) {
        this.dWin.style.display = 'flex';
        this._draw();
      }
    }

    hideWin() {
      if (this.dWin) {
        this.dWin.style.display = 'none';
      }
    }

    _makeDebugWindow() {
      if (this.dWin) return;

      const root = document.body || document.documentElement;
      if (!root) return;

      const wrap = document.createElement('div');

      Object.assign(wrap.style, {
        position: 'fixed',
        right: '12px',
        bottom: '12px',
        width: '420px',
        height: '540px',
        background: 'rgba(20,20,20,0.96)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px',
        zIndex: '999999',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
        fontFamily: 'monospace',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none'
      });

      const header = document.createElement('div');

      Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        cursor: 'move'
      });

      const title = document.createElement('div');
      title.textContent = '融合寻路调试窗口';
      title.style.fontSize = '12px';

      const close = document.createElement('button');
      close.textContent = 'x';

      Object.assign(close.style, {
        cursor: 'pointer',
        border: '0',
        background: 'rgba(255,255,255,0.12)',
        color: '#fff',
        borderRadius: '6px',
        width: '28px',
        height: '24px'
      });

      close.onclick = () => {
        wrap.style.display = 'none';
      };

      header.appendChild(title);
      header.appendChild(close);

      const toolbar = document.createElement('div');

      Object.assign(toolbar.style, {
        padding: '6px',
        display: 'flex',
        gap: '6px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      });

      const createBtn = (text, fn) => {
        const b = document.createElement('button');
        b.textContent = text;

        Object.assign(b.style, {
          flex: '1',
          fontSize: '11px',
          padding: '4px',
          background: '#333',
          color: '#eee',
          border: '1px solid #555',
          borderRadius: '4px',
          cursor: 'pointer'
        });

        b.onclick = fn;

        return b;
      };

      toolbar.appendChild(createBtn('刷新', () => this._draw()));

      toolbar.appendChild(createBtn('+', () => {
        this._zoomScale = Math.min(10, this._zoomScale + 0.25);
        this._draw();
      }));

      toolbar.appendChild(createBtn('-', () => {
        this._zoomScale = Math.max(0.2, this._zoomScale - 0.25);
        this._draw();
      }));

      toolbar.appendChild(createBtn('重置视图', () => {
        this._zoomScale = 1;
        this._panX = 0;
        this._panY = 0;
        this._draw();
      }));

      toolbar.appendChild(createBtn('清除路径', () => {
        this._clearPath();
        this._draw();
      }));

      toolbar.appendChild(createBtn('查看/编辑', () => {
        this._debugMode = this._debugMode === 'edit' ? 'view' : 'edit';
        this._draw();
      }));

      const palette = document.createElement('div');
      this._debugPalette = palette;

      Object.assign(palette.style, {
        padding: '6px',
        display: 'flex',
        gap: '4px',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      });

      this._toolBtns = {};

      const tools = [
        { id: 'move', label: '移动', color: '#607d8b' },
        { id: 'empty', label: '空地', color: '#1c7c3a' },
        { id: 'wall', label: '障碍', color: '#7c1c1c' },
        { id: 'start', label: '起点', color: '#2dd4ff' },
        { id: 'end', label: '终点', color: '#a78bfa' }
      ];

      const canvas = document.createElement('canvas');

      tools.forEach(t => {
        const b = document.createElement('button');
        b.textContent = t.label;

        Object.assign(b.style, {
          flex: '1',
          fontSize: '10px',
          padding: '3px 0',
          background: t.color,
          color: '#fff',
          border: '1px solid #555',
          borderRadius: '3px',
          cursor: 'pointer'
        });

        b.onclick = () => {
          this._debugTool = t.id;
          canvas.style.cursor = t.id === 'move' ? 'grab' : 'crosshair';
          this._draw();
        };

        this._toolBtns[t.id] = b;
        palette.appendChild(b);
      });

      const info = document.createElement('div');

      Object.assign(info.style, {
        padding: '6px 10px',
        fontSize: '11px',
        opacity: '0.9'
      });

      canvas.width = 390;
      canvas.height = 390;

      Object.assign(canvas.style, {
        display: 'block',
        margin: '0 auto 10px auto',
        background: '#111',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.10)',
        cursor: 'crosshair',
        touchAction: 'none'
      });

      wrap.appendChild(header);
      wrap.appendChild(toolbar);
      wrap.appendChild(palette);
      wrap.appendChild(info);
      wrap.appendChild(canvas);

      root.appendChild(wrap);

      this.dWin = wrap;
      this.dCanvas = canvas;
      this.dCtx = canvas.getContext('2d');
      this._debugTitle = title;
      this._debugInfo = info;

      let winDrag = false;
      let winLastX = 0;
      let winLastY = 0;

      const startWinDrag = (x, y) => {
        winDrag = true;
        winLastX = x;
        winLastY = y;
      };

      const moveWin = (x, y) => {
        if (!winDrag) return;

        this._winX += x - winLastX;
        this._winY += y - winLastY;

        wrap.style.transform = `translate(${this._winX}px, ${this._winY}px)`;

        winLastX = x;
        winLastY = y;
      };

      header.addEventListener('mousedown', e => {
        startWinDrag(e.clientX, e.clientY);
        e.preventDefault();
      });

      header.addEventListener('touchstart', e => {
        if (!e.touches.length) return;

        startWinDrag(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }, { passive: false });

      let isDragging = false;
      let lastX = 0;
      let lastY = 0;
      let startDist = 0;
      let startScale = 1;

      const getCanvasPos = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();

        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      canvas.addEventListener('wheel', e => {
        e.preventDefault();

        const delta = -Math.sign(e.deltaY) * 0.1;
        this._zoomScale = Math.max(0.2, Math.min(10, this._zoomScale + delta));

        this._draw();
      }, { passive: false });

      canvas.addEventListener('mousedown', e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;

        if (this._debugMode === 'view' || this._debugTool === 'move') {
          canvas.style.cursor = 'grabbing';
          return;
        }

        const p = getCanvasPos(e.clientX, e.clientY);
        this._debugPaintAt(p.x, p.y);
      });

      window.addEventListener('mousemove', e => {
        if (winDrag) {
          moveWin(e.clientX, e.clientY);
          return;
        }

        if (!isDragging) return;
        if (!this.dWin || this.dWin.style.display === 'none') return;

        if (this._debugMode === 'view' || this._debugTool === 'move') {
          this._panX += e.clientX - lastX;
          this._panY += e.clientY - lastY;

          lastX = e.clientX;
          lastY = e.clientY;

          this._draw();
          return;
        }

        const rect = canvas.getBoundingClientRect();

        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const p = getCanvasPos(e.clientX, e.clientY);
          this._debugPaintAt(p.x, p.y);
        }

        lastX = e.clientX;
        lastY = e.clientY;
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
        winDrag = false;

        if (this._debugMode === 'view' || this._debugTool === 'move') {
          canvas.style.cursor = 'grab';
        }
      });

      canvas.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
          startDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );

          startScale = this._zoomScale;
          e.preventDefault();
        } else if (e.touches.length === 1) {
          isDragging = true;

          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;

          if (this._debugMode === 'view' || this._debugTool === 'move') return;

          const p = getCanvasPos(lastX, lastY);
          this._debugPaintAt(p.x, p.y);
        }
      }, { passive: false });

      canvas.addEventListener('touchmove', e => {
        if (winDrag && e.touches.length) {
          moveWin(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
          return;
        }

        if (e.touches.length === 2) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );

          if (startDist > 0) {
            const ratio = dist / startDist;
            this._zoomScale = Math.max(0.2, Math.min(10, startScale * ratio));
            this._draw();
          }

          e.preventDefault();
        } else if (e.touches.length === 1 && isDragging) {
          const cx = e.touches[0].clientX;
          const cy = e.touches[0].clientY;

          if (this._debugMode === 'view' || this._debugTool === 'move') {
            this._panX += cx - lastX;
            this._panY += cy - lastY;
            this._draw();
          } else {
            const p = getCanvasPos(cx, cy);
            this._debugPaintAt(p.x, p.y);
          }

          lastX = cx;
          lastY = cy;

          e.preventDefault();
        }
      }, { passive: false });

      window.addEventListener('touchend', () => {
        winDrag = false;
        startDist = 0;
        isDragging = false;
      });

      this._draw();
    }

    _debugPaintAt(cx, cy) {
      if (!this.grid || !this._debugGeo) return;

      const { cell, ox, oy } = this._debugGeo;

      const gx = Math.floor((cx - ox) / cell);
      const gy = Math.floor((cy - oy) / cell);

      if (!this._ok(gx, gy)) return;

      const tool = this._debugTool;

      if (tool === 'move') return;

      if (tool === 'wall') {
        this.grid[gy][gx] = 1;

        if (gx === this.sx && gy === this.sy) {
          this.sx = -1;
          this.sy = -1;
        }

        if (gx === this.ex && gy === this.ey) {
          this.ex = -1;
          this.ey = -1;
        }
      } else if (tool === 'empty') {
        this.grid[gy][gx] = 0;
      } else if (tool === 'start') {
        this.sx = gx;
        this.sy = gy;
        this.grid[gy][gx] = 0;
      } else if (tool === 'end') {
        this.ex = gx;
        this.ey = gy;
        this.grid[gy][gx] = 0;
      }

      this._clearPath();
      this._draw();
    }

    _draw() {
      if (!this.dCanvas || !this.dCtx) return;

      const canvas = this.dCanvas;
      const ctx = this.dCtx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (this._debugTitle) {
        this._debugTitle.textContent =
          `融合寻路调试窗口 [${this._debugMode === 'edit' ? '编辑' : '查看'}]`;
      }

      if (this._debugInfo) {
        const sizeText = this.grid ? `${this.w}×${this.h}` : '未创建';
        const alg = this.usedAlgorithm || '无';

        this._debugInfo.textContent =
          `大小: ${sizeText} | 缩放: ${(this._zoomScale * 100).toFixed(0)}% | ` +
          `起点: ${this.sx},${this.sy} | 终点: ${this.ex},${this.ey} | ` +
          `路径点: ${this.pathLen} | 算法: ${alg}`;
      }

      if (this._debugPalette) {
        this._debugPalette.style.display = this._debugMode === 'edit' ? 'flex' : 'none';
      }

      if (!this.grid) {
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.fillText('请先创建网格', 10, 24);
        return;
      }

      canvas.style.cursor =
        this._debugMode === 'view' || this._debugTool === 'move'
          ? 'grab'
          : 'crosshair';

      const pad = 10;
      const gw = canvas.width - pad * 2;
      const gh = canvas.height - pad * 2;

      const baseCell = Math.min(gw / this.w, gh / this.h);
      const cell = Math.max(2, Math.floor(baseCell * this._zoomScale));

      const totalW = cell * this.w;
      const totalH = cell * this.h;

      const ox = pad + Math.floor((gw - totalW) / 2) + this._panX;
      const oy = pad + Math.floor((gh - totalH) / 2) + this._panY;

      ctx.save();

      ctx.beginPath();
      ctx.rect(pad, pad, gw, gh);
      ctx.clip();

      ctx.fillStyle = '#111';
      ctx.fillRect(pad, pad, gw, gh);

      const startX = Math.max(0, Math.floor(-ox / cell));
      const endX = Math.min(this.w, Math.ceil((canvas.width - ox) / cell));
      const startY = Math.max(0, Math.floor(-oy / cell));
      const endY = Math.min(this.h, Math.ceil((canvas.height - oy) / cell));

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const dx = ox + x * cell;
          const dy = oy + y * cell;

          ctx.fillStyle = this.grid[y][x] ? '#7c1c1c' : '#1c7c3a';

          ctx.fillRect(
            dx,
            dy,
            cell - (cell > 4 ? 1 : 0),
            cell - (cell > 4 ? 1 : 0)
          );
        }
      }

      if (cell >= 8) {
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;

        for (let x = startX; x <= endX; x++) {
          ctx.beginPath();
          ctx.moveTo(ox + x * cell, oy + startY * cell);
          ctx.lineTo(ox + x * cell, oy + endY * cell);
          ctx.stroke();
        }

        for (let y = startY; y <= endY; y++) {
          ctx.beginPath();
          ctx.moveTo(ox + startX * cell, oy + y * cell);
          ctx.lineTo(ox + endX * cell, oy + y * cell);
          ctx.stroke();
        }
      }

      if (this.pathGrid && this.pathGrid.length > 1) {
        ctx.strokeStyle = '#1e90ff';
        ctx.lineWidth = Math.max(2, cell * 0.25);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        ctx.moveTo(
          ox + this.pathGrid[0].x * cell + cell / 2,
          oy + this.pathGrid[0].y * cell + cell / 2
        );

        for (let i = 1; i < this.pathGrid.length; i++) {
          ctx.lineTo(
            ox + this.pathGrid[i].x * cell + cell / 2,
            oy + this.pathGrid[i].y * cell + cell / 2
          );
        }

        ctx.stroke();
      }

      if (this.sx >= 0 && this.sy >= 0 && this.sx < this.w && this.sy < this.h) {
        ctx.fillStyle = '#2dd4ff';
        ctx.fillRect(
          ox + this.sx * cell + cell * 0.2,
          oy + this.sy * cell + cell * 0.2,
          cell * 0.6,
          cell * 0.6
        );
      }

      if (this.ex >= 0 && this.ey >= 0 && this.ex < this.w && this.ey < this.h) {
        ctx.fillStyle = '#a78bfa';
        ctx.fillRect(
          ox + this.ex * cell + cell * 0.2,
          oy + this.ey * cell + cell * 0.2,
          cell * 0.6,
          cell * 0.6
        );
      }

      ctx.restore();

      this._debugGeo = { cell, ox, oy };

      if (this._toolBtns) {
        for (const id in this._toolBtns) {
          const btn = this._toolBtns[id];

          if (this._debugTool === id) {
            btn.style.border = '2px solid #fff';
            btn.style.opacity = '1';
          } else {
            btn.style.border = '1px solid #555';
            btn.style.opacity = '0.7';
          }
        }
      }
    }
  }

  const runtime = Scratch.vm ? Scratch.vm.runtime : Scratch.runtime;
  Scratch.extensions.register(new PathfindingFusion(runtime));
})(Scratch);
