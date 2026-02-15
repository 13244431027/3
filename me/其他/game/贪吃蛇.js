(function(Scratch) {
 'use strict';

 class PixelSnakeExtension {
   constructor() {
     this.initialized = false;
     this.gameRunning = false;
     this.width = 20;
     this.height = 20;
     this.snake = [];
     this.food = {x: 0, y: 0};
     this.direction = {x: 1, y: 0};
     this.nextDirection = {x: 1, y: 0};
     this.score = 0;
     this.gameOver = false;
     this.lastMoveTime = 0;
     this.moveInterval = 200;
     
     // 窗口设置
     this.windowWidth = 400;
     this.windowHeight = 400;
     this.fullscreenMode = false;
     
     // 移动端触摸支持
     this.touchStartX = 0;
     this.touchStartY = 0;
     this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
     
     // 虚拟摇杆
     this.joystickActive = false;
     this.joystickStartPos = {x: 0, y: 0};
     this.joystickCurrentPos = {x: 0, y: 0};
     this.joystickDirection = null;
     this.joystickThreshold = 15; // 触发方向的最小偏移
     this.joystickMaxDistance = 30; // 摇杆最大移动距离
   }

   getInfo() {
     return {
       id: 'pixelsnake',
       name: 'Pixel Snake',
       color1: '#4CAF50',
       color2: '#2E7D32',
       color3: '#1B5E20',
       blocks: [
         {
           opcode: 'configureAndStart',
           blockType: Scratch.BlockType.COMMAND,
           text: '配置并开始像素贪吃蛇游戏 宽度 [WIDTH] 高度 [HEIGHT] 窗口宽 [WIN_WIDTH] 窗口高 [WIN_HEIGHT] 全屏 [FULLSCREEN]',
           arguments: {
             WIDTH: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 20
             },
             HEIGHT: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 20
             },
             WIN_WIDTH: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 400
             },
             WIN_HEIGHT: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 400
             },
             FULLSCREEN: {
               type: Scratch.ArgumentType.STRING,
               menu: 'fullscreenOptions',
               defaultValue: 'window'
             }
           }
         },
         {
           opcode: 'isGameInitialized',
           blockType: Scratch.BlockType.BOOLEAN,
           text: '游戏已初始化？'
         },
         {
           opcode: 'isGameRunning',
           blockType: Scratch.BlockType.BOOLEAN,
           text: '游戏正在运行？'
         },
         {
           opcode: 'isGameOverFlag',
           blockType: Scratch.BlockType.BOOLEAN,
           text: '游戏结束？'
         },
         {
           opcode: 'getCurrentScore',
           blockType: Scratch.BlockType.REPORTER,
           text: '当前得分'
         },
         {
           opcode: 'getHeadX',
           blockType: Scratch.BlockType.REPORTER,
           text: '蛇头 X 坐标'
         },
         {
           opcode: 'getHeadY',
           blockType: Scratch.BlockType.REPORTER,
           text: '蛇头 Y 坐标'
         },
         {
           opcode: 'getFoodX',
           blockType: Scratch.BlockType.REPORTER,
           text: '食物 X 坐标'
         },
         {
           opcode: 'getFoodY',
           blockType: Scratch.BlockType.REPORTER,
           text: '食物 Y 坐标'
         },
         {
           opcode: 'checkCoordinateType',
           blockType: Scratch.BlockType.REPORTER,
           text: '检查坐标 [X] [Y] 类型',
           arguments: {
             X: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 0
             },
             Y: {
               type: Scratch.ArgumentType.NUMBER,
               defaultValue: 0
             }
           }
         }
       ],
       menus: {
         fullscreenOptions: {
           items: ['window', 'fullscreen']
         }
       }
     };
   }

   configureAndStart(args) {
     this.width = Math.max(5, Math.min(50, Math.floor(args.WIDTH)));
     this.height = Math.max(5, Math.min(50, Math.floor(args.HEIGHT)));
     
     // 设置窗口尺寸
     this.windowWidth = Math.max(200, Math.min(800, Math.floor(args.WIN_WIDTH)));
     this.windowHeight = Math.max(200, Math.min(800, Math.floor(args.WIN_HEIGHT)));
     
     // 设置全屏模式
     this.fullscreenMode = args.FULLSCREEN === 'fullscreen';
     
     const startX = Math.floor(this.width / 2);
     const startY = Math.floor(this.height / 2);
     this.snake = [{x: startX, y: startY}];
     
     this.direction = {x: 1, y: 0};
     this.nextDirection = {x: 1, y: 0};
     this.score = 0;
     this.gameOver = false;
     this.gameRunning = true;
     this.initialized = true;
     this.moveInterval = 200;
     
     this.generateFood();
     
     if (!this.gameContainer) {
       this.injectGameUI();
     }
     
     // 应用窗口设置
     this.applyWindowSettings();
     
     if (this.gameContainer) {
       this.gameContainer.style.display = 'block';
     }
     
     this.startGameLoop();
   }

   applyWindowSettings() {
     if (!this.canvas) return;
     
     // 移动端适配：自动调整大小
     if (this.isMobile || this.fullscreenMode) {
       const maxSize = Math.min(window.innerWidth, window.innerHeight) * 0.75;
       this.canvas.width = maxSize;
       this.canvas.height = maxSize;
       if (this.gameContainer) {
         this.gameContainer.style.position = 'fixed';
         this.gameContainer.style.top = '50%';
         this.gameContainer.style.left = '50%';
         this.gameContainer.style.transform = 'translate(-50%, -50%)';
         this.gameContainer.style.width = 'auto';
         this.gameContainer.style.height = 'auto';
         this.gameContainer.style.borderRadius = '10px';
       }
     } else {
       // 窗口模式 - 保持正方形
       const size = Math.min(this.windowWidth, this.windowHeight);
       this.canvas.width = size;
       this.canvas.height = size;
       if (this.gameContainer) {
         this.gameContainer.style.position = 'fixed';
         this.gameContainer.style.top = '20px';
         this.gameContainer.style.right = '20px';
         this.gameContainer.style.width = 'auto';
         this.gameContainer.style.height = 'auto';
         this.gameContainer.style.borderRadius = '10px';
       }
     }
     
     // 显示/隐藏虚拟摇杆
     if (this.joystickContainer) {
       this.joystickContainer.style.display = (this.isMobile || this.fullscreenMode) ? 'block' : 'none';
     }
   }

   injectGameUI() {
     this.gameContainer = document.createElement('div');
     this.gameContainer.style.cssText = `
       z-index: 10000;
       background: #1a1a1a;
       box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
       padding: 15px;
       display: none;
       font-family: Arial, sans-serif;
       touch-action: none;
       user-select: none;
       -webkit-user-select: none;
     `;
     
     const title = document.createElement('h3');
     title.textContent = '像素贪吃蛇';
     title.style.cssText = `
       color: #4CAF50;
       margin: 0 0 10px 0;
       text-align: center;
       font-size: 18px;
       pointer-events: none;
     `;
     
     this.canvas = document.createElement('canvas');
     this.canvas.style.cssText = `
       border: 2px solid #4CAF50;
       border-radius: 5px;
       background: #000;
       display: block;
       margin: 0 auto;
       touch-action: none;
     `;
     this.ctx = this.canvas.getContext('2d');
     
     const status = document.createElement('div');
     status.id = 'snake-status';
     status.style.cssText = `
       color: white;
       margin-top: 10px;
       text-align: center;
       font-size: 14px;
       pointer-events: none;
     `;
     
     // 虚拟摇杆（移动端）
     this.joystickContainer = document.createElement('div');
     this.joystickContainer.className = 'joystick-container';
     this.joystickContainer.style.cssText = `
       position: absolute;
       bottom: 20px;
       left: 50%;
       transform: translateX(-50%);
       width: 120px;
       height: 120px;
       display: ${this.isMobile ? 'block' : 'none'};
       pointer-events: auto;
       touch-action: none;
     `;
     
     const joystickBase = document.createElement('div');
     joystickBase.className = 'joystick-base';
     joystickBase.style.cssText = `
       width: 100%;
       height: 100%;
       background: rgba(76, 175, 80, 0.3);
       border: 2px solid #4CAF50;
       border-radius: 50%;
       position: relative;
     `;
     
     this.joystickStick = document.createElement('div');
     this.joystickStick.className = 'joystick-stick';
     this.joystickStick.style.cssText = `
       width: 40px;
       height: 40px;
       background: rgba(76, 175, 80, 0.9);
       border: 2px solid #4CAF50;
       border-radius: 50%;
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       cursor: pointer;
       touch-action: none;
       user-select: none;
       -webkit-user-select: none;
     `;
     
     joystickBase.appendChild(this.joystickStick);
     this.joystickContainer.appendChild(joystickBase);
     
     // 控制按钮容器
     const controlButtons = document.createElement('div');
     controlButtons.style.cssText = `
       position: absolute;
       top: 5px;
       right: 5px;
       display: flex;
       gap: 5px;
     `;
     
     const toggleBtn = document.createElement('button');
     toggleBtn.textContent = '□';
     toggleBtn.title = '切换全屏';
     toggleBtn.style.cssText = `
       background: rgba(255, 255, 255, 0.1);
       color: #fff;
       border: 1px solid #4CAF50;
       border-radius: 5px;
       width: 36px;
       height: 36px;
       font-size: 16px;
       cursor: pointer;
       touch-action: none;
     `;
     toggleBtn.onclick = () => {
       this.fullscreenMode = !this.fullscreenMode;
       this.applyWindowSettings();
     };
     
     const closeBtn = document.createElement('button');
     closeBtn.textContent = '×';
     closeBtn.title = '关闭游戏';
     closeBtn.style.cssText = `
       background: rgba(255, 255, 255, 0.1);
       color: #fff;
       border: 1px solid #FF5252;
       border-radius: 5px;
       width: 36px;
       height: 36px;
       font-size: 20px;
       cursor: pointer;
       touch-action: none;
     `;
     closeBtn.onclick = () => {
       this.gameContainer.style.display = 'none';
     };
     
     controlButtons.appendChild(toggleBtn);
     controlButtons.appendChild(closeBtn);
     
     this.gameContainer.appendChild(controlButtons);
     this.gameContainer.appendChild(title);
     this.gameContainer.appendChild(this.canvas);
     this.gameContainer.appendChild(status);
     this.gameContainer.appendChild(this.joystickContainer);
     document.body.appendChild(this.gameContainer);
     
     // 添加摇杆事件
     this.addJoystickEvents();
     
     // 键盘事件
     document.addEventListener('keydown', (e) => {
       if (!this.gameRunning || this.gameOver) return;
       
       switch(e.key) {
         case 'ArrowUp': this.handleDirectionInput('up'); break;
         case 'ArrowDown': this.handleDirectionInput('down'); break;
         case 'ArrowLeft': this.handleDirectionInput('left'); break;
         case 'ArrowRight': this.handleDirectionInput('right'); break;
         case 'F11':
           e.preventDefault();
           this.fullscreenMode = !this.fullscreenMode;
           this.applyWindowSettings();
           break;
       }
     });
     
     // 触摸滑动支持（画布区域）
     this.canvas.addEventListener('touchstart', (e) => {
       const touch = e.touches[0];
       this.touchStartX = touch.clientX;
       this.touchStartY = touch.clientY;
       e.preventDefault();
     }, {passive: false});
     
     this.canvas.addEventListener('touchmove', (e) => {
       e.preventDefault();
     }, {passive: false});
     
     this.canvas.addEventListener('touchend', (e) => {
       if (!this.gameRunning || this.gameOver) return;
       
       const touch = e.changedTouches[0];
       const dx = touch.clientX - this.touchStartX;
       const dy = touch.clientY - this.touchStartY;
       
       const minSwipeDistance = 30;
       
       if (Math.abs(dx) > Math.abs(dy)) {
         if (dx > minSwipeDistance) {
           this.handleDirectionInput('right');
         } else if (dx < -minSwipeDistance) {
           this.handleDirectionInput('left');
         }
       } else {
         if (dy > minSwipeDistance) {
           this.handleDirectionInput('down');
         } else if (dy < -minSwipeDistance) {
           this.handleDirectionInput('up');
         }
       }
       e.preventDefault();
     }, {passive: false});
   }
   
   addJoystickEvents() {
     const handleStart = (e) => {
       this.joystickActive = true;
       const rect = this.joystickStick.parentElement.getBoundingClientRect();
       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
       this.joystickStartPos = {x: clientX - rect.left, y: clientY - rect.top};
       e.preventDefault();
     };
     
     const handleMove = (e) => {
       if (!this.joystickActive) return;
       
       const rect = this.joystickStick.parentElement.getBoundingClientRect();
       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
       
       let deltaX = clientX - rect.left - this.joystickStartPos.x;
       let deltaY = clientY - rect.top - this.joystickStartPos.y;
       
       // 限制移动距离
       const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
       if (distance > this.joystickMaxDistance) {
         const angle = Math.atan2(deltaY, deltaX);
         deltaX = Math.cos(angle) * this.joystickMaxDistance;
         deltaY = Math.sin(angle) * this.joystickMaxDistance;
       }
       
       this.joystickCurrentPos = {x: deltaX, y: deltaY};
       this.joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
       
       // 判断方向
       if (distance > this.joystickThreshold) {
         let newDirection = null;
         if (Math.abs(deltaX) > Math.abs(deltaY)) {
           newDirection = deltaX > 0 ? 'right' : 'left';
         } else {
           newDirection = deltaY > 0 ? 'down' : 'up';
         }
         
         if (newDirection !== this.joystickDirection) {
           this.joystickDirection = newDirection;
           this.handleDirectionInput(newDirection);
         }
       }
       
       e.preventDefault();
     };
     
     const handleEnd = (e) => {
       if (!this.joystickActive) return;
       this.joystickActive = false;
       this.joystickDirection = null;
       this.joystickCurrentPos = {x: 0, y: 0};
       this.joystickStick.style.transform = 'translate(-50%, -50%)';
       e.preventDefault();
     };
     
     // 触摸事件
     this.joystickStick.addEventListener('touchstart', handleStart, {passive: false});
     this.joystickStick.addEventListener('touchmove', handleMove, {passive: false});
     this.joystickStick.addEventListener('touchend', handleEnd, {passive: false});
     
     // 鼠标事件（桌面端测试用）
     this.joystickStick.addEventListener('mousedown', handleStart);
     document.addEventListener('mousemove', handleMove);
     document.addEventListener('mouseup', handleEnd);
   }
   
   handleDirectionInput(dir) {
     switch(dir) {
       case 'up':
         if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
         break;
       case 'down':
         if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
         break;
       case 'left':
         if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
         break;
       case 'right':
         if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
         break;
     }
   }

   drawGame() {
     if (!this.canvas || !this.ctx) return;
     
     this.ctx.fillStyle = '#000';
     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
     
     if (!this.initialized) return;
     
     // 保持正方形网格
     const cellSize = Math.min(
       this.canvas.width / this.width,
       this.canvas.height / this.height
     );
     
     const offsetX = (this.canvas.width - (this.width * cellSize)) / 2;
     const offsetY = (this.canvas.height - (this.height * cellSize)) / 2;
     
     this.snake.forEach((segment, index) => {
       if (index === 0) {
         this.ctx.fillStyle = '#4CAF50';
       } else {
         this.ctx.fillStyle = '#8BC34A';
       }
       
       this.ctx.fillRect(
         offsetX + segment.x * cellSize, 
         offsetY + segment.y * cellSize, 
         cellSize, 
         cellSize
       );
     });
     
     this.ctx.fillStyle = '#FF5252';
     this.ctx.fillRect(
       offsetX + this.food.x * cellSize, 
       offsetY + this.food.y * cellSize, 
       cellSize, 
       cellSize
     );
     
     const status = document.getElementById('snake-status');
     if (status) {
       status.textContent = `得分: ${this.score} 长度: ${this.snake.length}`;
     }
   }

   startGameLoop() {
     const gameLoop = () => {
       if (this.gameRunning && !this.gameOver && this.initialized) {
         this.update();
         this.drawGame();
         requestAnimationFrame(gameLoop);
       } else if (this.initialized) {
         this.drawGame();
       }
     };
     gameLoop();
   }

   generateFood() {
     let newFood;
     let onSnake;
     
     do {
       onSnake = false;
       newFood = {
         x: Math.floor(Math.random() * this.width),
         y: Math.floor(Math.random() * this.height)
       };
       
       for (const segment of this.snake) {
         if (segment.x === newFood.x && segment.y === newFood.y) {
           onSnake = true;
           break;
         }
       }
     } while (onSnake);
     
     this.food = newFood;
   }

   update() {
     if (!this.gameRunning || this.gameOver || !this.initialized) {
       return;
     }
     
     const currentTime = Date.now();
     if (currentTime - this.lastMoveTime < this.moveInterval) {
       return;
     }
     
     this.lastMoveTime = currentTime;
     this.direction = {...this.nextDirection};
     
     const head = {...this.snake[0]};
     head.x += this.direction.x;
     head.y += this.direction.y;
     
     if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) {
       this.gameOver = true;
       return;
     }
     
     for (const segment of this.snake) {
       if (segment.x === head.x && segment.y === head.y) {
         this.gameOver = true;
         return;
       }
     }
     
     this.snake.unshift(head);
     
     if (head.x === this.food.x && head.y === this.food.y) {
       this.score += 10;
       this.generateFood();
       this.moveInterval = Math.max(50, this.moveInterval - 2);
     } else {
       this.snake.pop();
     }
   }

   isGameInitialized() {
     return this.initialized;
   }

   isGameRunning() {
     return this.gameRunning && !this.gameOver;
   }

   isGameOverFlag() {
     return this.gameOver;
   }

   getCurrentScore() {
     return this.score;
   }

   getHeadX() {
     return this.snake.length > 0 ? this.snake[0].x : -1;
   }

   getHeadY() {
     return this.snake.length > 0 ? this.snake[0].y : -1;
   }

   getFoodX() {
     return this.food.x;
   }

   getFoodY() {
     return this.food.y;
   }

   checkCoordinateType(args) {
     const x = Math.floor(args.X);
     const y = Math.floor(args.Y);
     
     if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
       return 'wall';
     }
     
     if (x === this.food.x && y === this.food.y) {
       return 'food';
     }
     
     for (const segment of this.snake) {
       if (segment.x === x && segment.y === y) {
         return 'snake';
       }
     }
     
     return 'empty';
   }
 }

 Scratch.extensions.register(new PixelSnakeExtension());
})(Scratch);
