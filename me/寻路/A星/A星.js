(function (Scratch) {
  "use strict";

  const EXT_ID = "astarPathfindingTW";

  const clampInt = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? (n | 0) : def;
  };
  const toKey = (x, y) => `${x},${y}`;
  const manhattan = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

  // --- 高效优先队列 ---
  class MinHeap {
    constructor() { this.a = []; }
    size() { return this.a.length; }
    clear() { this.a.length = 0; }
    push(item) {
      const a = this.a;
      a.push(item);
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (a[p].f <= a[i].f) break;
        const t = a[p]; a[p] = a[i]; a[i] = t;
        i = p;
      }
    }
    pop() {
      const a = this.a;
      if (!a.length) return null;
      const top = a[0];
      const last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        const len = a.length;
        while (true) {
          const l = i * 2 + 1;
          const r = l + 1;
          let m = i;
          if (l < len && a[l].f < a[m].f) m = l;
          if (r < len && a[r].f < a[m].f) m = r;
          if (m === i) break;
          const t = a[m]; a[m] = a[i]; a[i] = t;
          i = m;
        }
      }
      return top;
    }
  }

  // --- 寻路核心引擎 (支持 A* 和 BFS) ---
  class PathEngine {
    constructor(getWalkable, W, H) {
      this.getWalkable = getWalkable;
      this.W = W;
      this.H = H;
      this.size = W * H;

      // 共享内存池，减少 GC
      this.closed = new Uint8Array(this.size);
      this.g = new Int32Array(this.size);
      this.parent = new Int32Array(this.size);
      this.visitedStamp = new Int32Array(this.size);
      this.currStamp = 0;
      
      this.open = new MinHeap();
      
      // 状态记录
      this.active = false;
      this.done = false;
      this.found = false;
      this.pathRes = "";
      this.expanded = 0;
      this.progressText = "0%";
    }

    _idx(x, y) { return y * this.W + x; }
    _inBounds(x, y) { return x >= 0 && y >= 0 && x < this.W && y < this.H; }

    _newRun() {
      this.currStamp++;
      if (this.currStamp >= 0x7FFFFFFF) {
        this.currStamp = 1;
        this.visitedStamp.fill(0);
      }
      this.open.clear();
      this.active = true;
      this.done = false;
      this.found = false;
      this.pathRes = "";
      this.expanded = 0;
    }

    // A* 单段寻路 (Start -> Target)
    initAStar(sx, sy, tx, ty) {
      this._newRun();
      
      if (!this._inBounds(sx, sy) || !this._inBounds(tx, ty) || 
          !this.getWalkable(sx, sy) || !this.getWalkable(tx, ty)) {
        this.done = true; return;
      }
      if (sx === tx && sy === ty) {
        this.done = true; this.found = true; return;
      }

      const sIdx = this._idx(sx, sy);
      this.visitedStamp[sIdx] = this.currStamp;
      this.g[sIdx] = 0;
      this.parent[sIdx] = -1;
      this.open.push({ f: manhattan(sx, sy, tx, ty), i: sIdx, x: sx, y: sy });
      
      this.tx = tx; this.ty = ty;
    }

    // BFS 泛洪 (Start -> All Reached)
    runBFSOnlyDist(sx, sy, targetIndicesSet) {
      this._newRun();
      if (!this._inBounds(sx, sy) || !this.getWalkable(sx, sy)) return new Map();

      const q = [this._idx(sx, sy)];
      const dists = new Map();
      const sIdx = this._idx(sx, sy);
      
      this.visitedStamp[sIdx] = this.currStamp;
      this.g[sIdx] = 0;
      
      if (targetIndicesSet.has(sIdx)) dists.set(sIdx, 0);

      let head = 0;
      let targetsFound = 0;
      const targetCount = targetIndicesSet.size;

      while(head < q.length) {
        const u = q[head++];
        const d = this.g[u];
        
        const cx = u % this.W;
        const cy = (u / this.W) | 0;

        const neighbors = [];
        if (cy > 0) neighbors.push(u - this.W);
        if (cy < this.H - 1) neighbors.push(u + this.W);
        if (cx > 0) neighbors.push(u - 1);
        if (cx < this.W - 1) neighbors.push(u + 1);

        for (const v of neighbors) {
          if (this.visitedStamp[v] === this.currStamp) continue;
          if (!this.getWalkable(v % this.W, (v / this.W)|0)) continue;

          this.visitedStamp[v] = this.currStamp;
          this.g[v] = d + 1;
          q.push(v);

          if (targetIndicesSet.has(v)) {
            dists.set(v, d + 1);
            targetsFound++;
          }
        }
        
        if (targetsFound === targetCount) break; 
      }
      return dists;
    }

    stepAStar(iterBudget) {
      if (!this.active || this.done) return;
      
      const W = this.W;
      const tx = this.tx, ty = this.ty;
      let iters = iterBudget;
      
      const dxs = [0, 0, -1, 1];
      const dys = [-1, 1, 0, 0];

      while (iters-- > 0) {
        const node = this.open.pop();
        if (!node) {
          this.done = true; this.found = false; this.progressText = "100%";
          return;
        }

        if (this.visitedStamp[node.i] === this.currStamp && this.g[node.i] < (node.f - manhattan(node.x, node.y, tx, ty))) {
           continue; 
        }
        
        const u = node.i;
        const ux = node.x;
        const uy = node.y;

        if (ux === tx && uy === ty) {
          this.done = true; this.found = true; this.progressText = "100%";
          this.pathRes = this._reconstruct(u);
          return;
        }

        this.expanded++;
        const baseG = this.g[u];

        for (let k = 0; k < 4; k++) {
          const nx = ux + dxs[k];
          const ny = uy + dys[k];

          if (nx < 0 || ny < 0 || nx >= W || ny >= this.H) continue;
          if (!this.getWalkable(nx, ny)) continue;
          
          const v = ny * W + nx;
          const newG = baseG + 1;

          if (this.visitedStamp[v] !== this.currStamp || newG < this.g[v]) {
            this.visitedStamp[v] = this.currStamp;
            this.g[v] = newG;
            this.parent[v] = u;
            const f = newG + manhattan(nx, ny, tx, ty);
            this.open.push({ f, i: v, x: nx, y: ny });
          }
        }
      }
      
      const ratio = this.expanded / (this.expanded + this.open.size() + 1);
      this.progressText = `${(ratio * 100).toFixed(0)}%`;
    }

    _reconstruct(endIdx) {
      let cur = endIdx;
      const res = [];
      const W = this.W;
      while (true) {
        const p = this.parent[cur];
        if (p === -1) break;
        
        const cx = cur % W;
        const cy = (cur / W) | 0;
        const px = p % W;
        const py = (p / W) | 0;

        if      (cx === px && cy === py - 1) res.push("w");
        else if (cx === px && cy === py + 1) res.push("s");
        else if (cx === px - 1 && cy === py) res.push("a");
        else if (cx === px + 1 && cy === py) res.push("d");
        
        cur = p;
      }
      return res.reverse().join("");
    }
  }

  // --- 扩展主逻辑 ---
  class Extension {
    constructor() {
      this.maps = new Map();
      this._activeMapName = "";
    }

    _getOrCreateMap(nameRaw) {
      const name = String(nameRaw ?? "").trim() || "default";
      let st = this.maps.get(name);
      if (!st) {
        st = {
          name,
          W: 0, H: 0, grid: "",
          sx: 0, sy: 0,
          tx: 0, ty: 0,
          waypoints: new Map(),
          
          kThreshold: 12,
          _sliceMs: 500,
          algo: "balanced", 
          pathAlgo: "astar",

          _progress: "0%",
          _cachedKey: "",
          _cachedRoute: "",
          _cachedRoutePos: 0,
          
          _engine: null,
          _plan: null,
          _planKey: "",

          // 2-Opt 参数
          twoOptEnabled: true,
          twoOptMaxPasses: 4,
          twoOptNeighborhood: 0, 

          // 缩放与视图控制
          _zoomScale: 1.0,
          _panX: 0,
          _panY: 0,

          list: [],
          
          _debugEl: null,
          _debugCanvas: null,
          _debugMode: "view",
          _debugTool: "wall",
          _debugPalette: null
        };
        this.maps.set(name, st);
      }
      return st;
    }

    _useMap(name) {
      const st = this._getOrCreateMap(name);
      this._activeMapName = st.name;
      return st;
    }

    _getActiveMap() {
      return this._getOrCreateMap(this._activeMapName || "default");
    }

    _getWalkable(st, x, y) {
      const i = y * st.W + x;
      return st.grid.charCodeAt(i) === 48; // '0'
    }

    _invalidateCache(st) {
      st._cachedKey = "";
      st._cachedRoute = "";
      st._cachedRoutePos = 0;
      st._plan = null;
      st._progress = "0%";
      st._planKey = "";
    }

    _buildKey(st) {
      const wps = Array.from(st.waypoints.values())
        .sort((a, b) => (a.y - b.y) || (a.x - b.x))
        .map(p => `${p.x},${p.y}`)
        .join(";");
      return `${st.W}x${st.H}|${st.grid}|S${st.sx},${st.sy}|T${st.tx},${st.ty}|K${st.kThreshold}|P${wps}|SL${st._sliceMs}|ALG${st.algo}|PATH${st.pathAlgo}|2OPT${st.twoOptEnabled ? 1 : 0}|2OPTP${st.twoOptMaxPasses}|2OPTN${st.twoOptNeighborhood}`;
    }

    _ensureEngine(st) {
      if (!st._engine || st._engine.W !== st.W || st._engine.H !== st.H) {
        st._engine = new PathEngine((x, y) => this._getWalkable(st, x, y), st.W, st.H);
      }
      return st._engine;
    }

    _validateMap(st) {
      return st.W > 0 && st.H > 0 && st.grid.length === st.W * st.H;
    }

    // ---------------- 2-Opt 优化（算法层） ----------------
    _twoOptImproveOrder(order, distFn, maxPasses = 4, neighborhood = 0) {
      if (!order || order.length < 4) return order;

      const n = order.length;
      const edgeCost = (a, b) => distFn(a, b);

      const trySwap = (i, k) => {
        const A = order[i - 1], B = order[i], C = order[k], D = order[k + 1];
        const ab = edgeCost(A, B);
        const cd = edgeCost(C, D);
        const ac = edgeCost(A, C);
        const bd = edgeCost(B, D);

        if (ab === -1 || cd === -1 || ac === -1 || bd === -1) return false;

        if (ac + bd < ab + cd) {
          for (let l = i, r = k; l < r; l++, r--) {
            const t = order[l]; order[l] = order[r]; order[r] = t;
          }
          return true;
        }
        return false;
      };

      for (let pass = 0; pass < maxPasses; pass++) {
        let improved = false;
        for (let i = 1; i <= n - 3; i++) {
          const kStart = i + 1;
          const kEnd = n - 2;

          if (neighborhood > 0) {
            const kkEnd = Math.min(kEnd, i + neighborhood);
            for (let k = kStart; k <= kkEnd; k++) {
              if (trySwap(i, k)) improved = true;
            }
          } else {
            for (let k = kStart; k <= kEnd; k++) {
              if (trySwap(i, k)) improved = true;
            }
          }
        }
        if (!improved) break;
      }
      return order;
    }

    _initPlanIfNeeded(st) {
      if (st._plan) return;
      if (!this._validateMap(st)) {
        st._plan = { done: true, ok: false, route: "" };
        return;
      }

      const wps = Array.from(st.waypoints.values());
      const k = wps.length;
      
      let mode = "greedy"; 
      if (st.algo === "accurate") {
        mode = "exact";
      } else if (st.algo === "balanced") {
        mode = (k <= st.kThreshold) ? "exact" : "greedy";
      } else {
        mode = "greedy"; 
      }

      const nodes = [{x: st.sx, y: st.sy}, ...wps, {x: st.tx, y: st.ty}];
      const nNodes = nodes.length;

      st._plan = {
        mode,
        done: false,
        ok: false,
        route: "",
        nodes,
        nNodes,
        
        gPhase: "toWP",
        gCurIdx: 0,
        gRemaining: wps.map((_, i) => i + 1),
        gBuiltRoute: [],
        gSegActive: false,
        
        eStage: "bfs",
        eBfsIdx: 0,
        eDist: new Int32Array(nNodes * nNodes).fill(-1),
        eDp: null,
        ePrev: null,
        eOrder: null,
        eBuildIdx: 0
      };
    }

    _planStep(st, iterBudget) {
      this._initPlanIfNeeded(st);
      const ps = st._plan;
      if (ps.done) return;
      
      const eng = this._ensureEngine(st);

      if (ps.mode === "greedy") {
        if (!ps.gSegActive) {
          let targetNodeIdx = -1;
          
          if (ps.gPhase === "toWP") {
            if (ps.gRemaining.length === 0) {
              ps.gPhase = "toTarget";
              targetNodeIdx = ps.nNodes - 1; 
            } else {
              const cur = ps.nodes[ps.gCurIdx];
              let bestDist = Infinity;
              let bestArrIdx = -1;
              
              for(let i=0; i<ps.gRemaining.length; i++) {
                const nodeIdx = ps.gRemaining[i];
                const node = ps.nodes[nodeIdx];
                const d = manhattan(cur.x, cur.y, node.x, node.y);
                if (d < bestDist) { bestDist = d; bestArrIdx = i; }
              }
              
              targetNodeIdx = ps.gRemaining[bestArrIdx];
              ps.gRemaining.splice(bestArrIdx, 1);
            }
          } else {
            ps.done = true; ps.ok = true; 
            ps.route = ps.gBuiltRoute.join("");
            st._progress = "100%";
            return;
          }

          const fromNode = ps.nodes[ps.gCurIdx];
          const toNode = ps.nodes[targetNodeIdx];
          
          eng.initAStar(fromNode.x, fromNode.y, toNode.x, toNode.y);
          ps.gSegActive = true;
          ps.gCurTargetIdx = targetNodeIdx;
        }

        eng.stepAStar(iterBudget);
        st._progress = `快速 ${eng.progressText}`;

        if (eng.done) {
          ps.gSegActive = false;
          if (!eng.found) {
            ps.done = true; ps.ok = false; ps.route = "";
            st._progress = "100%";
            return;
          }
          ps.gBuiltRoute.push(eng.pathRes);
          ps.gCurIdx = ps.gCurTargetIdx;
        }
        return;
      }

      if (ps.mode === "exact") {
        if (ps.eStage === "bfs") {
          const i = ps.eBfsIdx;
          if (i >= ps.nNodes) {
            ps.eStage = "dp";
            return;
          }

          const targets = new Set();
          for(let j=0; j<ps.nNodes; j++) {
            if (i !== j) targets.add(eng._idx(ps.nodes[j].x, ps.nodes[j].y));
          }
          
          const startNode = ps.nodes[i];
          const distMap = eng.runBFSOnlyDist(startNode.x, startNode.y, targets);

          for(let j=0; j<ps.nNodes; j++) {
            if (i === j) {
              ps.eDist[i * ps.nNodes + j] = 0;
            } else {
              const tidx = eng._idx(ps.nodes[j].x, ps.nodes[j].y);
              const d = distMap.get(tidx);
              ps.eDist[i * ps.nNodes + j] = (d !== undefined) ? d : -1;
            }
          }

          ps.eBfsIdx++;
          const pct = (ps.eBfsIdx / ps.nNodes) * 40;
          st._progress = `预处理 ${pct.toFixed(0)}%`;
          return;
        }

        if (ps.eStage === "dp") {
          const k = ps.nNodes - 2;
          
          if (k === 0) {
            if (ps.eDist[0 * ps.nNodes + 1] === -1) {
              ps.done = true; ps.ok = false;
            } else {
              ps.eOrder = [0, 1];
              ps.eStage = "build";
            }
            return;
          }

          const fullMask = (1 << k) - 1;
          const numStates = 1 << k;
          
          if (!ps.eDp) {
            ps.eDp = new Int32Array(numStates * k).fill(1e9);
            ps.ePrev = new Int32Array(numStates * k).fill(-1);
            
            for (let i = 0; i < k; i++) {
              const dist = ps.eDist[0 * ps.nNodes + (i + 1)];
              if (dist !== -1) {
                ps.eDp[(1 << i) * k + i] = dist;
              }
            }
            ps.dpMask = 1;
          }

          const INF = 1e9;
          let transitions = iterBudget * 10;

          while(transitions-- > 0 && ps.dpMask <= fullMask) {
            const mask = ps.dpMask;
            
            for (let last = 0; last < k; last++) {
              if (!((mask >> last) & 1)) continue; 
              
              const currentCost = ps.eDp[mask * k + last];
              if (currentCost >= INF) continue;

              for (let next = 0; next < k; next++) {
                if ((mask >> next) & 1) continue; 
                
                const d = ps.eDist[(last + 1) * ps.nNodes + (next + 1)];
                if (d === -1) continue;

                const nextMask = mask | (1 << next);
                const nextCost = currentCost + d;
                const idx = nextMask * k + next;
                
                if (nextCost < ps.eDp[idx]) {
                  ps.eDp[idx] = nextCost;
                  ps.ePrev[idx] = last;
                }
              }
            }
            ps.dpMask++;
          }

          const dpPct = 40 + (ps.dpMask / fullMask) * 20; 
          st._progress = `规划 ${dpPct.toFixed(0)}%`;

          if (ps.dpMask > fullMask) {
            let bestCost = INF;
            let bestLast = -1;
            
            for (let last = 0; last < k; last++) {
              const c = ps.eDp[fullMask * k + last];
              if (c >= INF) continue;
              const dToT = ps.eDist[(last + 1) * ps.nNodes + (k + 1)];
              if (dToT === -1) continue;
              
              if (c + dToT < bestCost) {
                bestCost = c + dToT;
                bestLast = last;
              }
            }

            if (bestLast === -1) {
              ps.done = true; ps.ok = false; return;
            }

            const order = [];
            let curr = bestLast;
            let mask = fullMask;
            while(curr !== -1) {
              order.push(curr + 1);
              const prev = ps.ePrev[mask * k + curr];
              mask = mask ^ (1 << curr);
              curr = prev;
            }
            order.reverse();
            ps.eOrder = [0, ...order, k + 1];

            if (st.twoOptEnabled && ps.eDist) {
              const nNodes = ps.nNodes;
              const distFn = (a, b) => {
                return ps.eDist[a * nNodes + b];
              };
              ps.eOrder = this._twoOptImproveOrder(
                ps.eOrder,
                distFn,
                Math.max(0, clampInt(st.twoOptMaxPasses, 4)),
                Math.max(0, clampInt(st.twoOptNeighborhood, 0))
              );
            }

            ps.eDp = null; ps.ePrev = null; ps.eDist = null;
            
            ps.eStage = "build";
            ps.gBuiltRoute = [];
          }
          return;
        }

        if (ps.eStage === "build") {
          if (!ps.gSegActive) {
            if (ps.eBuildIdx >= ps.eOrder.length - 1) {
              ps.done = true; ps.ok = true; 
              ps.route = ps.gBuiltRoute.join("");
              st._progress = "100%";
              return;
            }

            const uIdx = ps.eOrder[ps.eBuildIdx];
            const vIdx = ps.eOrder[ps.eBuildIdx + 1];
            const u = ps.nodes[uIdx];
            const v = ps.nodes[vIdx];
            
            eng.initAStar(u.x, u.y, v.x, v.y);
            ps.gSegActive = true;
          }

          eng.stepAStar(iterBudget);
          const segPct = 60 + (ps.eBuildIdx / (ps.eOrder.length-1)) * 40;
          st._progress = `构建 ${segPct.toFixed(0)}%`;

          if (eng.done) {
            if (!eng.found) {
              ps.done = true; ps.ok = false;
              return;
            }
            ps.gBuiltRoute.push(eng.pathRes);
            ps.gSegActive = false;
            ps.eBuildIdx++;
          }
          return;
        }
      }
    }

    setMap(args) {
      const st = this._useMap(args.name);
      st.H = clampInt(args.L, 0);
      st.W = clampInt(args.W, 0);
      st.grid = String(args.C ?? "");
      st.waypoints.clear();
      st.list = [];
      st._zoomScale = 1.0;
      st._panX = 0;
      st._panY = 0;
      this._invalidateCache(st);
      if (st._debugEl) this._updateDebugView(st);
    }

    setStart(args) {
      const st = this._useMap(args.name);
      st.sx = clampInt(args.X, 0);
      st.sy = clampInt(args.Y, 0);
      this._invalidateCache(st);
      if (st._debugEl) this._updateDebugView(st);
    }

    setTarget(args) {
      const st = this._useMap(args.name);
      st.tx = clampInt(args.X, 0);
      st.ty = clampInt(args.Y, 0);
      this._invalidateCache(st);
      if (st._debugEl) this._updateDebugView(st);
    }

    addWaypoint(args) {
      const st = this._useMap(args.name);
      const x = clampInt(args.X, 0);
      const y = clampInt(args.Y, 0);
      st.waypoints.set(toKey(x, y), { x, y });
      this._invalidateCache(st);
      if (st._debugEl) this._updateDebugView(st);
    }

    delWaypoint(args) {
      const st = this._useMap(args.name);
      const x = clampInt(args.X, 0);
      const y = clampInt(args.Y, 0);
      st.waypoints.delete(toKey(x, y));
      this._invalidateCache(st);
      if (st._debugEl) this._updateDebugView(st);
    }

    setK(args) {
      const st = this._getActiveMap();
      st.kThreshold = Math.max(0, clampInt(args.K, 12));
      this._invalidateCache(st);
    }

    setSliceMs(args) {
      const st = this._getActiveMap();
      st._sliceMs = Math.max(1, clampInt(args.MS, 500));
      this._invalidateCache(st);
    }

    setAlgo(args) {
      const st = this._useMap(args.name);
      const val = args.ALG;
      if (val === "accurate" || val === "fast" || val === "balanced") {
        st.algo = val;
      } else {
        st.algo = "balanced";
      }
      this._invalidateCache(st);
    }

    setPathAlgo(args) {
      const st = this._useMap(args.name);
      const val = args.PATH_ALG;
      if (val === "astar") {
        st.pathAlgo = val;
      } else {
        st.pathAlgo = "astar";
      }
      this._invalidateCache(st);
    }

    calcPath() {
      const st = this._getActiveMap();
      const key = this._buildKey(st);
      
      if (st._cachedKey === key && st._cachedRoute) {
        st._progress = "100%";
        return st._cachedRoute;
      }

      st._plan = null;
      this._initPlanIfNeeded(st);

      const start = Date.now();
      const maxMs = 2500;

      while (!st._plan.done) {
        if (Date.now() - start > maxMs) break; 
        this._planStep(st, 5000);
      }

      if (!st._plan.done) return "-1"; 
      if (!st._plan.ok) return "-1";

      st._cachedKey = key;
      st._cachedRoute = st._plan.route;
      st._cachedRoutePos = 0;
      return st._cachedRoute;
    }

    calcOneStep() {
      const st = this._getActiveMap();
      const key = this._buildKey(st);

      if (st._cachedKey === key && st._cachedRoute) {
        if (st._cachedRoutePos >= st._cachedRoute.length) return "-1";
        return st._cachedRoute.charAt(st._cachedRoutePos++);
      }

      if (!st._plan || st._planKey !== key) {
        st._planKey = key;
        st._plan = null;
        this._initPlanIfNeeded(st);
      }

      if (st._plan.done) {
         if (st._plan.ok) {
            st._cachedKey = key;
            st._cachedRoute = st._plan.route;
            st._cachedRoutePos = 0;
            return st._cachedRoute.length > 0 ? st._cachedRoute.charAt(st._cachedRoutePos++) : "-1";
         } else {
            return "-1";
         }
      }

      const deadline = Date.now() + st._sliceMs;
      while (Date.now() < deadline && !st._plan.done) {
        this._planStep(st, 2000);
      }
      
      if (!st._plan.done) return "none"; 
      if (!st._plan.ok) return "-1";

      st._cachedKey = key;
      st._cachedRoute = st._plan.route;
      st._cachedRoutePos = 0;
      return st._cachedRoute.length > 0 ? st._cachedRoute.charAt(st._cachedRoutePos++) : "-1";
    }

    mapModel() {
      const st = this._getActiveMap();
      if (!this._validateMap(st)) return "-1";
      const a = st.grid.split("");
      const put = (x, y, ch) => {
        if (x < 0 || y < 0 || x >= st.W || y >= st.H) return;
        a[y * st.W + x] = ch;
      };
      for (const p of st.waypoints.values()) put(p.x, p.y, "5");
      put(st.sx, st.sy, "3");
      put(st.tx, st.ty, "4");

      let out = "";
      for (let y = 0; y < st.H; y++) {
        out += a.slice(y * st.W, (y + 1) * st.W).join("");
        if (y !== st.H - 1) out += "\n";
      }
      return out;
    }

    progress() {
      const st = this._getActiveMap();
      return String(st._progress ?? "0%");
    }

    findMap(args) {
      const st = this._useMap(args.name);
      this.calcPath();
      st._progress = "100%";
    }

    findMapFillList(args) {
      const st = this._useMap(args.name);
      const route = this.calcPath();
      st.list = [];
      if (route === "-1") {
        st.list.push("-1");
      } else {
        for (let i = 0; i < route.length; i++) st.list.push(route.charAt(i));
        if (st.list.length === 0) st.list.push("-1"); 
      }
    }

    listCount() {
      const st = this._getActiveMap();
      return st.list.length;
    }

    listItem(args) {
      const st = this._getActiveMap();
      const i = clampInt(args.I, 1) - 1;
      if (i < 0 || i >= st.list.length) return "";
      return String(st.list[i]);
    }

    _updateDebugView(st) {
        if (!st._debugEl) return;
        
        st._debugTitle.textContent = `地图: ${st.name} [${st._debugMode === 'edit' ? '编辑' : '查看'}]`;
        st._debugInfo.textContent = `缩放: ${(st._zoomScale * 100).toFixed(0)}% | 算法: ${st.pathAlgo}`;

        if (st._debugPalette) {
            st._debugPalette.style.display = (st._debugMode === 'edit') ? 'flex' : 'none';
        }

        const canvas = st._debugCanvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!this._validateMap(st)) {
            ctx.fillStyle = "#fff"; ctx.fillText("无效地图", 10, 20); return;
        }

        const pad = 10;
        const gw = canvas.width - pad * 2;
        const gh = canvas.height - pad * 2;
        
        // 计算缩放后的单元格大小和偏移
        const baseCell = Math.min(gw / st.W, gh / st.H);
        const cell = Math.max(2, Math.floor(baseCell * st._zoomScale));
        
        // 计算居中位置 + 平移量
        const totalW = cell * st.W;
        const totalH = cell * st.H;
        const ox = pad + Math.floor((gw - totalW) / 2) + st._panX;
        const oy = pad + Math.floor((gh - totalH) / 2) + st._panY;

        // 裁剪区域，防止绘制到外部
        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, pad, gw, gh);
        ctx.clip();

        for(let y=0; y<st.H; y++) {
            for(let x=0; x<st.W; x++) {
                // 简单的视口剔除优化
                const dx = ox + x * cell;
                const dy = oy + y * cell;
                if (dx + cell < 0 || dy + cell < 0 || dx > canvas.width || dy > canvas.height) continue;

                ctx.fillStyle = this._getWalkable(st, x, y) ? "#1c7c3a" : "#7c1c1c";
                ctx.fillRect(dx, dy, cell - (cell > 4 ? 1 : 0), cell - (cell > 4 ? 1 : 0));
            }
        }
        
        ctx.fillStyle = "#ff9f1a";
        for(const p of st.waypoints.values()) {
            const cx = ox + p.x*cell + cell/2;
            const cy = oy + p.y*cell + cell/2;
            if (cx < -cell || cy < -cell || cx > canvas.width+cell || cy > canvas.height+cell) continue;
            ctx.beginPath();
            ctx.arc(cx, cy, cell*0.3, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.fillStyle = "#2dd4ff";
        if (ox + st.sx*cell < canvas.width && oy + st.sy*cell < canvas.height) {
             ctx.fillRect(ox + st.sx*cell + cell*0.2, oy + st.sy*cell + cell*0.2, cell*0.6, cell*0.6);
        }
        ctx.fillStyle = "#a78bfa";
        if (ox + st.tx*cell < canvas.width && oy + st.ty*cell < canvas.height) {
             ctx.fillRect(ox + st.tx*cell + cell*0.2, oy + st.ty*cell + cell*0.2, cell*0.6, cell*0.6);
        }

        let route = st._cachedRoute;
        if (!route && st._plan && st._plan.done && st._plan.ok) route = st._plan.route;

        if (route && route !== "-1") {
            ctx.strokeStyle = "#1e90ff";
            ctx.lineWidth = Math.max(1, cell*0.2);
            ctx.lineCap = "round";
            ctx.beginPath();
            let cx = st.sx, cy = st.sy;
            ctx.moveTo(ox + cx*cell + cell/2, oy + cy*cell + cell/2);
            for(let i=0; i<route.length; i++) {
                const c = route.charAt(i);
                if (c==='w') cy--;
                else if (c==='s') cy++;
                else if (c==='a') cx--;
                else if (c==='d') cx++;
                ctx.lineTo(ox + cx*cell + cell/2, oy + cy*cell + cell/2);
            }
            ctx.stroke();
        }

        ctx.restore();

        st._debugGeo = { cell, ox, oy };
        
        if (st._toolBtns) {
            for (const id in st._toolBtns) {
                const btn = st._toolBtns[id];
                if (st._debugTool === id) {
                    btn.style.border = "2px solid #fff";
                    btn.style.opacity = "1";
                } else {
                    btn.style.border = "1px solid #555";
                    btn.style.opacity = "0.7";
                }
            }
        }
    }

    drawMap(args) {
      const st = this._useMap(args.name);
      const mode = args.MODE; 
      st._debugMode = mode;
      
      if(!st._debugTool) st._debugTool = 'wall';

      const root = document.body || document.documentElement;
      if (!root) return;

      if (!st._debugEl) {
        const wrap = document.createElement("div");
        Object.assign(wrap.style, {
          position: "fixed", right: "12px", bottom: "12px",
          width: "380px", height: "500px", background: "rgba(20,20,20,0.96)",
          color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px", zIndex: "999999",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          fontFamily: "monospace", userSelect: "none", display: "flex", flexDirection: "column",
          touchAction: "none" // 防止浏览器默认缩放
        });

        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.12)"
        });

        const title = document.createElement("div");
        title.style.fontSize = "12px";
        
        const close = document.createElement("button");
        close.textContent = "x";
        Object.assign(close.style, {
            cursor: "pointer", border: "0", background: "rgba(255,255,255,0.12)",
            color: "#fff", borderRadius: "6px", width: "28px", height: "24px"
        });
        close.onclick = () => { wrap.style.display = "none"; };
        
        header.appendChild(title);
        header.appendChild(close);

        const toolbar = document.createElement("div");
        Object.assign(toolbar.style, {
            padding: "6px", display: "flex", gap: "6px", borderBottom: "1px solid rgba(255,255,255,0.08)"
        });
        
        const createBtn = (lbl, fn) => {
            const b = document.createElement("button");
            b.innerText = lbl;
            Object.assign(b.style, {
                flex: "1", fontSize: "11px", padding: "4px", background: "#333", color: "#eee",
                border: "1px solid #555", borderRadius: "4px", cursor: "pointer"
            });
            b.onclick = fn;
            return b;
        };

        toolbar.appendChild(createBtn("运行", () => {
            this._invalidateCache(st);
            this.calcPath(); 
            this._updateDebugView(st);
        }));
        
        toolbar.appendChild(createBtn("重置视图", () => {
            st._zoomScale = 1.0;
            st._panX = 0;
            st._panY = 0;
            this._updateDebugView(st);
        }));
        
        toolbar.appendChild(createBtn("清除路径", () => {
            this._invalidateCache(st);
            this._updateDebugView(st);
        }));

        const palette = document.createElement("div");
        st._debugPalette = palette;
        Object.assign(palette.style, {
            padding: "6px", display: "none", gap: "4px", justifyContent: "space-between",
            background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.08)"
        });

        st._toolBtns = {};
        const tools = [
            { id: 'empty', label: '空地', color: '#1c7c3a' },
            { id: 'wall', label: '障碍', color: '#7c1c1c' },
            { id: 'start', label: '起点', color: '#2dd4ff' },
            { id: 'target', label: '终点', color: '#a78bfa' },
            { id: 'waypoint', label: '必经', color: '#ff9f1a' }
        ];

        tools.forEach(t => {
            const b = document.createElement("button");
            b.innerText = t.label;
            Object.assign(b.style, {
                flex: "1", fontSize: "10px", padding: "3px 0", background: t.color, color: "#fff",
                border: "1px solid #555", borderRadius: "3px", cursor: "pointer"
            });
            b.onclick = () => {
                st._debugTool = t.id;
                this._updateDebugView(st);
            };
            st._toolBtns[t.id] = b;
            palette.appendChild(b);
        });

        const info = document.createElement("div");
        Object.assign(info.style, { padding: "6px 10px", fontSize: "11px", opacity: "0.9" });

        const canvas = document.createElement("canvas");
        canvas.width = 360;
        canvas.height = 340;
        Object.assign(canvas.style, {
            display: "block", margin: "0 auto 10px auto", background: "#111",
            borderRadius: "8px", border: "1px solid rgba(255,255,255,0.10)", cursor: "crosshair",
            touchAction: "none"
        });

        // --- 交互逻辑 (鼠标 + 触摸) ---
        const getCanvasPos = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const paintCell = (cx, cy) => {
            if (st._debugMode !== "edit") return;
            if (!st._debugGeo) return;
            
            const { cell, ox, oy } = st._debugGeo;
            const gx = Math.floor((cx - ox) / cell);
            const gy = Math.floor((cy - oy) / cell);

            if (gx >= 0 && gx < st.W && gy >= 0 && gy < st.H) {
                const idx = gy * st.W + gx;
                const arr = st.grid.split("");
                const tool = st._debugTool;
                
                const setChar = (ch) => { arr[idx] = ch; st.grid = arr.join(""); };

                if (tool === 'empty') { setChar('0'); st.waypoints.delete(toKey(gx, gy)); }
                else if (tool === 'wall') { setChar('1'); st.waypoints.delete(toKey(gx, gy)); }
                else if (tool === 'start') { st.sx = gx; st.sy = gy; setChar('0'); st.waypoints.delete(toKey(gx, gy)); }
                else if (tool === 'target') { st.tx = gx; st.ty = gy; setChar('0'); st.waypoints.delete(toKey(gx, gy)); }
                else if (tool === 'waypoint') { setChar('0'); st.waypoints.set(toKey(gx, gy), {x:gx, y:gy}); }

                this._invalidateCache(st);
                this._updateDebugView(st);
            }
        };

        // 鼠标缩放
        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY) * 0.1;
            const oldScale = st._zoomScale;
            let newScale = oldScale + delta;
            newScale = Math.max(0.2, Math.min(10, newScale));
            st._zoomScale = newScale;
            this._updateDebugView(st);
        }, { passive: false });

        // 统一处理拖拽和触摸
        let isDragging = false;
        let lastX = 0, lastY = 0;
        let startDist = 0;
        let startScale = 1;

        // 鼠标事件
        canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            if (st._debugMode === "edit") {
                const p = getCanvasPos(e.clientX, e.clientY);
                paintCell(p.x, p.y);
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            if (!st._debugEl || st._debugEl.style.display === "none") return;
            
            if (st._debugMode === "view") {
                // 平移
                st._panX += e.clientX - lastX;
                st._panY += e.clientY - lastY;
                lastX = e.clientX;
                lastY = e.clientY;
                this._updateDebugView(st);
            } else {
                // 编辑模式下的绘制
                // 只有在 Canvas 范围内才绘制
                const rect = canvas.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    const p = getCanvasPos(e.clientX, e.clientY);
                    paintCell(p.x, p.y);
                }
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        window.addEventListener("mouseup", () => { isDragging = false; });

        // 触摸事件 (支持双指缩放)
        canvas.addEventListener("touchstart", (e) => {
            if (e.touches.length === 2) {
                // 双指开始
                startDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                startScale = st._zoomScale;
                e.preventDefault();
            } else if (e.touches.length === 1) {
                // 单指开始
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                if (st._debugMode === "edit") {
                    const p = getCanvasPos(lastX, lastY);
                    paintCell(p.x, p.y);
                }
            }
        }, { passive: false });

        canvas.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2) {
                // 双指缩放
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                if (startDist > 0) {
                    const ratio = dist / startDist;
                    let newScale = startScale * ratio;
                    newScale = Math.max(0.2, Math.min(10, newScale));
                    st._zoomScale = newScale;
                    this._updateDebugView(st);
                }
                e.preventDefault();
            } else if (e.touches.length === 1 && isDragging) {
                // 单指移动
                const cx = e.touches[0].clientX;
                const cy = e.touches[0].clientY;
                
                if (st._debugMode === "view") {
                    st._panX += cx - lastX;
                    st._panY += cy - lastY;
                    this._updateDebugView(st);
                } else {
                    const p = getCanvasPos(cx, cy);
                    paintCell(p.x, p.y);
                }
                lastX = cx;
                lastY = cy;
                e.preventDefault(); // 防止页面滚动
            }
        }, { passive: false });

        canvas.addEventListener("touchend", (e) => {
            if (e.touches.length < 2) startDist = 0;
            if (e.touches.length === 0) isDragging = false;
        });

        wrap.appendChild(header);
        wrap.appendChild(toolbar);
        wrap.appendChild(palette);
        wrap.appendChild(info);
        wrap.appendChild(canvas);
        root.appendChild(wrap);

        st._debugEl = wrap;
        st._debugCanvas = canvas;
        st._debugTitle = title;
        st._debugInfo = info;
      }
      
      st._debugEl.style.display = "block";
      this._updateDebugView(st);
    }

    getInfo() {
      return {
        id: EXT_ID,
        name: "A*寻路",
        color1: "#4B8BBE",
        color2: "#306998",
        menus: {
          ALG_MENU: {
            acceptReporters: true,
            items: [
              { text: "平衡", value: "balanced" },
              { text: "准确", value: "accurate" },
              { text: "迅速", value: "fast" }
            ]
          },
          PATH_ALG_MENU: {
            acceptReporters: true,
            items: [
              { text: "A*算法", value: "astar" }
            ]
          },
          EDIT_MENU: {
            acceptReporters: true,
            items: [
              { text: "可编辑", value: "edit" },
              { text: "仅查看", value: "view" }
            ]
          }
        },
        blocks: [
          {
            opcode: "setMap",
            blockType: Scratch.BlockType.COMMAND,
            text: "建图 地图名为[name]长 [L] 宽 [W] 内容 [C]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              L: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              C: { type: Scratch.ArgumentType.STRING, defaultValue: "0000000000".repeat(10) }
            }
          },
          {
            opcode: "setStart",
            blockType: Scratch.BlockType.COMMAND,
            text: "起始 地图名为[name]的x [X] y [Y]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: "setTarget",
            blockType: Scratch.BlockType.COMMAND,
            text: "终止 地图名为[name]的x [X] y [Y]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 9 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 9 }
            }
          },
          {
            opcode: "addWaypoint",
            blockType: Scratch.BlockType.COMMAND,
            text: "添加必经点地图名为[name]的 x [X] y [Y]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: "delWaypoint",
            blockType: Scratch.BlockType.COMMAND,
            text: "删去必经点地图名为[name] x [X] y [Y]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: "drawMap",
            blockType: Scratch.BlockType.COMMAND,
            text: "画出地图地图名为[name]的示意图 [MODE]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              MODE: { type: Scratch.ArgumentType.STRING, menu: "EDIT_MENU", defaultValue: "edit" }
            }
          },
          {
            opcode: "setAlgo",
            blockType: Scratch.BlockType.COMMAND,
            text: "寻路地图名为[name]规划算法[ALG]",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
              ALG: { type: Scratch.ArgumentType.STRING, menu: "ALG_MENU", defaultValue: "balanced" }
            }
          },
          {
                  opcode: "setPathAlgo",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "寻路地图名为[name]路径算法[PATH_ALG]",
                  arguments: {
                        name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" },
                        PATH_ALG: { type: Scratch.ArgumentType.STRING, menu: "PATH_ALG_MENU", defaultValue: "astar" }
                    }
           },

          {
            opcode: "findMap",
            blockType: Scratch.BlockType.COMMAND,
            text: "*寻路地图名为[name]*",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" }
            }
          },
          {
            opcode: "findMapFillList",
            blockType: Scratch.BlockType.COMMAND,
            text: "寻路地图名为[name]并且把结果填充到内置列表中",
            arguments: {
              name: { type: Scratch.ArgumentType.STRING, defaultValue: "map1" }
            }
          },
          {
            opcode: "listCount",
            blockType: Scratch.BlockType.REPORTER,
            text: "内置列表的项目数"
          },
          {
            opcode: "listItem",
            blockType: Scratch.BlockType.REPORTER,
            text: "内置列表的([I])项",
            arguments: {
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          "---",
          { opcode: "setK", blockType: Scratch.BlockType.COMMAND, text: "设定精确k值为 [K]", arguments: { K: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 } } },
          { opcode: "setSliceMs", blockType: Scratch.BlockType.COMMAND, text: "设定一步计算时间片ms为 [MS]", arguments: { MS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 500 } } },
          "---",
          { opcode: "calcPath", blockType: Scratch.BlockType.REPORTER, text: "计算路程" },
          { opcode: "calcOneStep", blockType: Scratch.BlockType.REPORTER, text: "计算一步最优解" },
          { opcode: "mapModel", blockType: Scratch.BlockType.REPORTER, text: "建图模型" },
          { opcode: "progress", blockType: Scratch.BlockType.REPORTER, text: "估计进度" }
        ]
      };
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
