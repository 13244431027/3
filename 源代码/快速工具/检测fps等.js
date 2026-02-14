
// stats-extension.js
(function(Scratch) {
  'use strict';

  const STYLEENUM = {
    ONE: 0,
    ALL: 1
  };

  class Stats {
    constructor() {
      this.mode = 0;
      this.showStyle = STYLEENUM.ONE;
      this.container = document.createElement('div');
      this.container.style.cssText = 'position:absolute;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000;pointer-events:auto';
      this.container.addEventListener('click', (event) => {
        if (this.showStyle === STYLEENUM.ONE) {
          event.preventDefault();
          this.showPanel(++this.mode % this.container.children.length);
        }
      }, false);

      this.beginTime = (performance || Date).now();
      this.prevTime = this.beginTime;
      this.frames = 0;

      this.fpsPanel = this.addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
      this.msPanel = this.addPanel(new Stats.Panel('MS', '#0f0', '#020'));

      if (self.performance && self.performance.memory) {
        this.memPanel = this.addPanel(new Stats.Panel('MB', '#f08', '#201'));
      }

      this.showPanel(0);
    }

    addPanel(panel) {
      if (panel && panel.dom) {
        this.container.appendChild(panel.dom);
      }
      return panel;
    }

    showPanel(id) {
      if (!this.container || !this.container.children) return;
      
      for (let i = 0; i < this.container.children.length; i++) {
        this.container.children[i].style.display = i === id ? 'block' : 'none';
      }
      this.mode = id;
    }

    setStyle(newStyle) {
      this.showStyle = newStyle;
      if (!this.container || !this.container.children) return;
      
      if (this.showStyle === STYLEENUM.ALL) {
        for (let i = 0; i < this.container.children.length; i++) {
          this.container.children[i].style.display = 'block';
        }
      } else {
        this.showPanel(0);
      }
    }

    begin() {
      this.beginTime = (performance || Date).now();
    }

    end() {
      this.frames++;

      const time = (performance || Date).now();

      if (this.msPanel) {
        this.msPanel.update(time - this.beginTime, 200);
      }

      if (time >= this.prevTime + 1000) {
        if (this.fpsPanel) {
          this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
        }

        this.prevTime = time;
        this.frames = 0;

        if (this.memPanel) {
          const memory = performance.memory;
          this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
        }
      }

      return time;
    }

    update() {
      this.beginTime = this.end();
    }

    get domElement() {
      return this.container;
    }

    setMode(id) {
      this.showPanel(id);
    }
  }

  Stats.Panel = function(name, fg, bg) {
    let min = Infinity;
    let max = 0;
    const round = Math.round;
    const PR = round(window.devicePixelRatio || 1);

    const WIDTH = 80 * PR;
    const HEIGHT = 48 * PR;
    const TEXT_X = 3 * PR;
    const TEXT_Y = 2 * PR;
    const GRAPH_X = 3 * PR;
    const GRAPH_Y = 15 * PR;
    const GRAPH_WIDTH = 74 * PR;
    const GRAPH_HEIGHT = 30 * PR;

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';

    const context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    return {
      dom: canvas,

      update: function(value, maxValue) {
        if (!this.dom) return;
        
        min = Math.min(min, value);
        max = Math.max(max, value);

        context.fillStyle = bg;
        context.globalAlpha = 1;
        context.fillRect(0, 0, WIDTH, GRAPH_Y);
        context.fillStyle = fg;
        context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

        context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
      }
    };
  };

  class StatsExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.MAXCLONES = 350;
      this.MAXTHREADS = 30;
      
      // 延迟初始化，等待运行时完全准备好
      setTimeout(() => {
        this.initializeStats();
      }, 100);
    }

    initializeStats() {
      try {
        // 检查运行时和渲染器是否可用
        if (!this.runtime || !this.runtime.renderer) {
          console.warn('Stats extension: Runtime or renderer not available');
          return;
        }

        this.stats = new Stats();
        
        // 添加自定义面板
        this.clonePanel = this.stats.addPanel(new Stats.Panel('CLONE', '#faea5c', '#a58409'));
        this.threadsPanel = this.stats.addPanel(new Stats.Panel('THREAD', '#62baf4', '#0c3e5f'));

        this.stats.showPanel(0);
        this.renderer = this.runtime.renderer;
        
        // 检查渲染器和canvas是否可用
        if (!this.renderer || !this.renderer.canvas) {
          console.warn('Stats extension: Renderer or canvas not available');
          return;
        }

        // 找到舞台容器
        const stageContainer = this.findStageContainer();
        if (stageContainer && this.stats.domElement) {
          stageContainer.appendChild(this.stats.domElement);
        } else {
          console.warn('Stats extension: Could not find stage container');
          return;
        }

        // 保存原始draw方法并重写
        if (typeof this.renderer.draw === 'function') {
          this.originalDraw = this.renderer.draw.bind(this.renderer);
          this.renderer.draw = this.draw.bind(this);
        }

        this.stats.setStyle(STYLEENUM.ONE);
        this.closeStats();
        
      } catch (error) {
        console.error('Stats extension initialization failed:', error);
      }
    }

    findStageContainer() {
      // 尝试多种方法找到舞台容器
      if (this.renderer && this.renderer.canvas && this.renderer.canvas.parentNode) {
        return this.renderer.canvas.parentNode;
      }
      
      // 在TurboWarp中，舞台通常在一个特定的容器中
      const stageContainers = [
        document.querySelector('[class*="stage-wrapper"]'),
        document.querySelector('[class*="stage"]'),
        document.querySelector('.guiRoot'),
        document.body
      ];
      
      for (const container of stageContainers) {
        if (container) return container;
      }
      
      return document.body;
    }

    getInfo() {
      return {
        id: 'nightsStats',
        name: 'Performance Monitor',
        color1: '#4D7EB4',
        color2: '#3A6391',
        color3: '#2A4A70',
        blocks: [
          {
            opcode: 'openStats',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open performance monitor'
          },
          {
            opcode: 'closeStats',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close performance monitor'
          },
          {
            opcode: 'setStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set style to [STYLE]',
            arguments: {
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'STYLE',
                defaultValue: STYLEENUM.ONE.toString()
              }
            }
          }
        ],
        menus: {
          STYLE: {
            acceptReporters: true,
            items: [
              {
                text: 'show one',
                value: STYLEENUM.ONE.toString()
              },
              {
                text: 'show all',
                value: STYLEENUM.ALL.toString()
              }
            ]
          }
        }
      };
    }

    get threadsCount() {
      return (this.runtime.threads && this.runtime.threads.length) || 0;
    }

    get cloneCount() {
      return this.runtime._cloneCounter || 0;
    }

    draw() {
      if (!this.stats) return;
      
      this.stats.begin();
      if (this.originalDraw) {
        this.originalDraw();
      }
      this.stats.end();

      if (this.clonePanel) {
        this.clonePanel.update(this.cloneCount, this.MAXCLONES);
      }
      if (this.threadsPanel) {
        this.threadsPanel.update(this.threadsCount, this.MAXTHREADS);
      }
    }

    openStats() {
      if (this.stats && this.stats.domElement) {
        this.stats.domElement.style.display = 'block';
      }
    }

    closeStats() {
      if (this.stats && this.stats.domElement) {
        this.stats.domElement.style.display = 'none';
      }
    }

    setStyle(args) {
      if (!this.stats) return;
      
      const styleValue = parseInt(args.STYLE);
      if (!isNaN(styleValue) && (styleValue === STYLEENUM.ONE || styleValue === STYLEENUM.ALL)) {
        this.stats.setStyle(styleValue);
      }
    }
  }

  // 注册扩展
  if (typeof Scratch !== 'undefined' && Scratch.extensions && Scratch.vm) {
    try {
      Scratch.extensions.register(new StatsExtension(Scratch.vm.runtime));
    } catch (error) {
      console.error('Failed to register Stats extension:', error);
    }
  } else {
    console.warn('Stats extension: Scratch environment not ready');
  }
})(typeof Scratch !== 'undefined' ? Scratch : {});
