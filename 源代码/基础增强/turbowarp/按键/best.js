// virtual-buttons-extension-enhanced.js
class VirtualButtons {
  constructor() {
    this.buttons = new Map();
    this.pressedButtons = new Set();
    this.container = null;
    this.initialized = false;
    this.framePressedButtons = new Set();
    this.activeTouchIds = new Map();
    this.defaultStyles = {
      width: 120,
      height: 60,
      fontSize: 16,
      minWidth: 80,
      minHeight: 40,
      padding: '12px 24px',
      borderRadius: '12px',
      primaryColor: '#4D7EB4',
      secondaryColor: '#3A6391',
      pressedColor: '#2A4A70',
      textColor: '#FFFFFF',
      shadow: '0 6px 12px rgba(0,0,0,0.3)',
      pressedShadow: '0 3px 6px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease'
    };
  }

  getInfo() {
    return {
      id: 'virtualButtons',
      name: '虚拟按键增强版',
      color1: '#4D7EB4',
      color2: '#3A6391',
      blocks: [
        {
          opcode: 'createButton',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建按键 ID:[ID] 文字:[TEXT] 位置x:[X] y:[Y]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '按键' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
          }
        },
        {
          opcode: 'createButtonWithSize',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建按键 ID:[ID] 文字:[TEXT] 位置x:[X] y:[Y] 宽度:[WIDTH] 高度:[HEIGHT]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button2' },
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '大按键' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 250 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 },
            HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 80 }
          }
        },
        {
          opcode: 'setButtonSize',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置ID:[ID] 尺寸 宽:[WIDTH] 高:[HEIGHT]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 },
            HEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 }
          }
        },
        {
          opcode: 'setButtonFontSize',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置ID:[ID] 字体大小:[SIZE]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 }
          }
        },
        {
          opcode: 'setButtonColors',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置ID:[ID] 颜色 正常:[NORMAL] 按下:[PRESSED] 文字:[TEXT_COLOR]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            NORMAL: { 
              type: Scratch.ArgumentType.STRING, 
              defaultValue: '#4D7EB4',
              menu: 'colorMenu'
            },
            PRESSED: { 
              type: Scratch.ArgumentType.STRING, 
              defaultValue: '#3A6391',
              menu: 'colorMenu'
            },
            TEXT_COLOR: { 
              type: Scratch.ArgumentType.STRING, 
              defaultValue: '#FFFFFF',
              menu: 'colorMenu'
            }
          }
        },
        {
          opcode: 'setButtonBorderRadius',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置ID:[ID] 圆角:[RADIUS]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            RADIUS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
          }
        },
        {
          opcode: 'moveButton',
          blockType: Scratch.BlockType.COMMAND,
          text: '移动ID:[ID] 到x:[X] y:[Y]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 }
          }
        },
        {
          opcode: 'changeText',
          blockType: Scratch.BlockType.COMMAND,
          text: '设置ID:[ID] 文字:[TEXT]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' },
            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '新文字' }
          }
        },
        {
          opcode: 'showButton',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示ID:[ID]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'hideButton',
          blockType: Scratch.BlockType.COMMAND,
          text: '隐藏ID:[ID]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'deleteButton',
          blockType: Scratch.BlockType.COMMAND,
          text: '删除ID:[ID]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'showAll',
          blockType: Scratch.BlockType.COMMAND,
          text: '显示所有按键'
        },
        {
          opcode: 'hideAll',
          blockType: Scratch.BlockType.COMMAND,
          text: '隐藏所有按键'
        },
        {
          opcode: 'resetAllButtonStyles',
          blockType: Scratch.BlockType.COMMAND,
          text: '重置所有按键样式'
        },
        '---',
        {
          opcode: 'getPressedButtons',
          blockType: Scratch.BlockType.REPORTER,
          text: '被按下的按键ID',
          disableMonitor: true
        },
        {
          opcode: 'isPressed',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'ID:[ID] 被按下?',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'waitUntilPressed',
          blockType: Scratch.BlockType.COMMAND,
          text: '等待直到ID:[ID] 被按下',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        '---',
        {
          opcode: 'getButtonX',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 的X位置',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'getButtonY',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 的Y位置',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'getButtonWidth',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 的宽度',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'getButtonHeight',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 的高度',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'getButtonText',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 显示的文字',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        },
        {
          opcode: 'getButtonFontSize',
          blockType: Scratch.BlockType.REPORTER,
          text: 'ID:[ID] 字体大小',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'button1' }
          }
        }
      ],
      menus: {
        colorMenu: {
          acceptReporters: true,
          items: [
            '#4D7EB4',
            '#3A6391',
            '#FF6B6B',
            '#4ECDC4',
            '#FFD166',
            '#06D6A0',
            '#118AB2',
            '#073B4C',
            '#EF476F',
            '#FFFFFF',
            '#000000'
          ]
        }
      }
    };
  }

  initialize(runtime) {
    this.runtime = runtime;
    setTimeout(() => this.initContainer(), 100);
    
    runtime.on('BEFORE_EXECUTE', () => {
      this.framePressedButtons = new Set(this.pressedButtons);
    });
    
    this.addGlobalEventListeners();
  }

  addGlobalEventListeners() {
    document.addEventListener('touchend', () => this.handleGlobalTouchEnd(), { passive: true });
    document.addEventListener('touchcancel', () => this.handleGlobalTouchEnd(), { passive: true });
    document.addEventListener('mouseup', (e) => this.handleGlobalMouseUp(e), { passive: true });
    document.addEventListener('mouseleave', () => this.clearAllPressedStates(), { passive: true });
  }

  handleGlobalTouchEnd() {
    this.clearAllPressedStates();
  }

  handleGlobalMouseUp(e) {
    if (!e.target.closest('.virtual-button')) {
      this.clearAllPressedStates();
    }
  }

  clearAllPressedStates() {
    for (const [id, buttonData] of this.buttons) {
      if (buttonData && buttonData.element) {
        this.resetButtonStyle(id);
      }
    }
    this.pressedButtons.clear();
    this.activeTouchIds.clear();
  }

  initContainer() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.id = 'virtual-buttons-enhanced-container';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    
    const stageContainer = this.findStageContainer();
    if (stageContainer) {
      stageContainer.style.position = 'relative';
      stageContainer.appendChild(this.container);
      this.initialized = true;
    } else {
      document.body.appendChild(this.container);
      this.initialized = true;
    }
  }

  findStageContainer() {
    const selectors = [
      '.stage-wrapper', '.gui_stage', '.stage',
      '[class*="stage"]', '[class*="Stage"]',
      '.guiRoot', '#app', '#scratch-stage'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    
    const canvas = document.querySelector('canvas');
    return canvas ? canvas.parentElement : document.body;
  }

  createButton(args) {
    if (!this.initialized) this.initContainer();
    
    const id = String(args.ID);
    const text = String(args.TEXT);
    const x = Number(args.X);
    const y = Number(args.Y);
    
    if (this.buttons.has(id)) {
      this.deleteButton({ ID: id });
    }
    
    const buttonData = {
      id,
      text,
      x,
      y,
      width: this.defaultStyles.width,
      height: this.defaultStyles.height,
      fontSize: this.defaultStyles.fontSize,
      borderRadius: this.defaultStyles.borderRadius,
      normalColor: this.defaultStyles.primaryColor,
      pressedColor: this.defaultStyles.pressedColor,
      textColor: this.defaultStyles.textColor,
      visible: true
    };
    
    const button = this.createButtonElement(buttonData);
    this.setupButtonEvents(id, button);
    
    if (this.container) {
      this.container.appendChild(button);
    }
    
    buttonData.element = button;
    this.buttons.set(id, buttonData);
    
    return id;
  }

  createButtonWithSize(args) {
    if (!this.initialized) this.initContainer();
    
    const id = String(args.ID);
    const text = String(args.TEXT);
    const x = Number(args.X);
    const y = Number(args.Y);
    const width = Math.max(Number(args.WIDTH), this.defaultStyles.minWidth);
    const height = Math.max(Number(args.HEIGHT), this.defaultStyles.minHeight);
    
    if (this.buttons.has(id)) {
      this.deleteButton({ ID: id });
    }
    
    const buttonData = {
      id,
      text,
      x,
      y,
      width,
      height,
      fontSize: this.calculateFontSize(width, height),
      borderRadius: this.defaultStyles.borderRadius,
      normalColor: this.defaultStyles.primaryColor,
      pressedColor: this.defaultStyles.pressedColor,
      textColor: this.defaultStyles.textColor,
      visible: true
    };
    
    const button = this.createButtonElement(buttonData);
    this.setupButtonEvents(id, button);
    
    if (this.container) {
      this.container.appendChild(button);
    }
    
    buttonData.element = button;
    this.buttons.set(id, buttonData);
    
    return id;
  }

  calculateFontSize(width, height) {
    const minSize = Math.min(width, height);
    return Math.max(12, Math.floor(minSize * 0.2));
  }

  createButtonElement(data) {
    const button = document.createElement('div');
    button.id = `vb-${data.id}`;
    button.className = 'virtual-button';
    button.textContent = data.text;
    button.setAttribute('data-button-id', data.id);
    
    this.updateButtonStyle(data.id);
    
    return button;
  }

  updateButtonStyle(id) {
    const buttonData = this.buttons.get(id);
    if (!buttonData || !buttonData.element) return;
    
    const element = buttonData.element;
    const fontSize = buttonData.fontSize || this.defaultStyles.fontSize;
    
    element.style.cssText = `
      position: absolute;
      left: ${buttonData.x}px;
      top: ${buttonData.y}px;
      width: ${buttonData.width}px;
      height: ${buttonData.height}px;
      background: linear-gradient(145deg, ${buttonData.normalColor}, ${this.darkenColor(buttonData.normalColor, 20)});
      border: 2px solid ${this.darkenColor(buttonData.normalColor, 30)};
      border-radius: ${buttonData.borderRadius}px;
      color: ${buttonData.textColor};
      font-size: ${fontSize}px;
      font-weight: bold;
      display: ${buttonData.visible ? 'flex' : 'none'};
      align-items: center;
      justify-content: center;
      padding: ${this.defaultStyles.padding};
      cursor: pointer;
      box-shadow: ${this.defaultStyles.shadow};
      transition: ${this.defaultStyles.transition};
      pointer-events: auto;
      user-select: none;
      touch-action: manipulation;
      z-index: 10000;
      box-sizing: border-box;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
  }

  darkenColor(color, percent) {
    let r, g, b;
    
    if (color.startsWith('#')) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    } else {
      return color;
    }
    
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  setupButtonEvents(id, button) {
    const handlePress = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      button.style.transform = 'scale(0.95)';
      button.style.boxShadow = this.defaultStyles.pressedShadow;
      button.style.background = `linear-gradient(145deg, ${this.darkenColor(this.buttons.get(id).normalColor, 30)}, ${this.darkenColor(this.buttons.get(id).normalColor, 40)})`;
      
      this.pressedButtons.add(id);
      
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          this.activeTouchIds.set(touch.identifier, id);
        }
      }
      
      if (this.runtime && this.runtime.startHats) {
        this.runtime.startHats('virtualButtons_buttonPressed');
      }
    };
    
    const handleRelease = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.resetButtonStyle(id);
      
      if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          this.activeTouchIds.delete(touch.identifier);
        }
      }
      
      this.pressedButtons.delete(id);
    };
    
    // 鼠标事件
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', (e) => {
      if (e.buttons & 1) {
        handleRelease(e);
      }
    });
    
    // 触摸事件
    button.addEventListener('touchstart', handlePress, { passive: false });
    button.addEventListener('touchend', handleRelease, { passive: false });
    button.addEventListener('touchcancel', handleRelease, { passive: false });
    
    // 防止拖拽
    button.addEventListener('dragstart', (e) => e.preventDefault());
    
    // 保存事件处理器以便后续移除
    if (!this.buttons.has(id)) {
      this.buttons.set(id, {});
    }
    const buttonData = this.buttons.get(id);
    buttonData.eventHandlers = { handlePress, handleRelease };
  }

  resetButtonStyle(id) {
    const buttonData = this.buttons.get(id);
    if (!buttonData || !buttonData.element) return;
    
    const element = buttonData.element;
    element.style.transform = '';
    element.style.boxShadow = this.defaultStyles.shadow;
    element.style.background = `linear-gradient(145deg, ${buttonData.normalColor}, ${this.darkenColor(buttonData.normalColor, 20)})`;
  }

  // 新增的尺寸相关方法
  setButtonSize(args) {
    const id = String(args.ID);
    const width = Math.max(Number(args.WIDTH), this.defaultStyles.minWidth);
    const height = Math.max(Number(args.HEIGHT), this.defaultStyles.minHeight);
    
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.width = width;
      buttonData.height = height;
      this.updateButtonStyle(id);
    }
  }

  setButtonFontSize(args) {
    const id = String(args.ID);
    const fontSize = Math.max(Number(args.SIZE), 8);
    
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.fontSize = fontSize;
      this.updateButtonStyle(id);
    }
  }

  setButtonColors(args) {
    const id = String(args.ID);
    const normalColor = String(args.NORMAL);
    const pressedColor = String(args.PRESSED);
    const textColor = String(args.TEXT_COLOR);
    
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.normalColor = normalColor;
      buttonData.pressedColor = pressedColor;
      buttonData.textColor = textColor;
      this.updateButtonStyle(id);
    }
  }

  setButtonBorderRadius(args) {
    const id = String(args.ID);
    const borderRadius = Math.max(Number(args.RADIUS), 0);
    
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.borderRadius = borderRadius;
      this.updateButtonStyle(id);
    }
  }

  // 原有方法更新
  moveButton(args) {
    const id = String(args.ID);
    const x = Number(args.X);
    const y = Number(args.Y);
    
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.x = x;
      buttonData.y = y;
      this.updateButtonStyle(id);
    }
  }

  changeText(args) {
    const id = String(args.ID);
    const text = String(args.TEXT);
    
    const buttonData = this.buttons.get(id);
    if (buttonData && buttonData.element) {
      buttonData.text = text;
      buttonData.element.textContent = text;
    }
  }

  showButton(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.visible = true;
      this.updateButtonStyle(id);
    }
  }

  hideButton(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    if (buttonData) {
      buttonData.visible = false;
      this.updateButtonStyle(id);
    }
  }

  deleteButton(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    
    if (buttonData) {
      if (buttonData.element) {
        // 移除事件监听器
        if (buttonData.eventHandlers) {
          buttonData.element.removeEventListener('mousedown', buttonData.eventHandlers.handlePress);
          buttonData.element.removeEventListener('mouseup', buttonData.eventHandlers.handleRelease);
          buttonData.element.removeEventListener('touchstart', buttonData.eventHandlers.handlePress);
          buttonData.element.removeEventListener('touchend', buttonData.eventHandlers.handleRelease);
          buttonData.element.removeEventListener('touchcancel', buttonData.eventHandlers.handleRelease);
        }
        buttonData.element.remove();
      }
      
      this.buttons.delete(id);
      this.pressedButtons.delete(id);
      
      for (const [touchId, btnId] of this.activeTouchIds) {
        if (btnId === id) {
          this.activeTouchIds.delete(touchId);
        }
      }
    }
  }

  showAll() {
    for (const [id, buttonData] of this.buttons) {
      buttonData.visible = true;
      this.updateButtonStyle(id);
    }
  }

  hideAll() {
    for (const [id, buttonData] of this.buttons) {
      buttonData.visible = false;
      this.updateButtonStyle(id);
    }
  }

  resetAllButtonStyles() {
    for (const [id, buttonData] of this.buttons) {
      buttonData.width = this.defaultStyles.width;
      buttonData.height = this.defaultStyles.height;
      buttonData.fontSize = this.defaultStyles.fontSize;
      buttonData.borderRadius = this.defaultStyles.borderRadius;
      buttonData.normalColor = this.defaultStyles.primaryColor;
      buttonData.pressedColor = this.defaultStyles.pressedColor;
      buttonData.textColor = this.defaultStyles.textColor;
      this.updateButtonStyle(id);
    }
  }

  // 新增的获取尺寸方法
  getButtonWidth(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    return buttonData ? buttonData.width : 0;
  }

  getButtonHeight(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    return buttonData ? buttonData.height : 0;
  }

  getButtonFontSize(args) {
    const id = String(args.ID);
    const buttonData = this.buttons.get(id);
    return buttonData ? buttonData.fontSize : this.defaultStyles.fontSize;
  }

  // 原有的其他方法
  getPressedButtons() {
    return Array.from(this.pressedButtons).join(',');
  }

  isPressed(args) {
    const id = String(args.ID);
    return this.pressedButtons.has(id);
  }

  waitUntilPressed(args) {
    const id = String(args.ID);
    return new Promise((resolve) => {
      const check = () => {
        if (this.pressedButtons.has(id)) {
          resolve();
        } else {
          setTimeout(check, 16);
        }
      };
      check();
    });
  }

  getButtonX(arg) {
    cont id = String(arg.ID);
    cont buttonData = thi.button.get(id);
    return buttonData ? buttonData.x : 0;
  }

  getButtonY(arg) {
    cont id = String(arg.ID);
    cont buttonData = thi.button.get(id);
    return buttonData ? buttonData.y : 0;
  }

  getButtonText(arg) {
    cont id = String(arg.ID);
    cont buttonData = thi.button.get(id);
    return buttonData ? buttonData.text : '';
  }
}

// 注册扩展
if (typeof Scratch !== 'undefined' && Scratch.extenion) {
  try {
    cont extenion = new VirtualButton();
    
    extenion.getDebugInfo = function() {
      return {
        buttonCount: thi.button.ize,
        preedButton: Array.from(thi.preedButton),
        activeTouchId: Array.from(thi.activeTouchId.entrie()),
        defaultStyle: thi.defaultStyle
      };
    };
    
    Scratch.extenion.regiter(extenion);
    conole.log('虚拟按键增强版注册成功');
    
    if (typeof window !== 'undefined') {
      window.virtualButton = extenion;
    }
    
  } catch (error) {
    conole.error('虚拟按键增强版注册失败:', error);
  }
}

// 提供备用加载函数
if (typeof window !== 'undefined') {
  window.loadVirtualButton = function() {
    if (typeof Scratch !== 'undefined' && Scratch.extenion) {
      try {
        cont extenion = new VirtualButton();
        Scratch.extenion.regiter(extenion);
        conole.log('虚拟按键增强版已手动加载');
        return extenion;
      } catch (error) {
        conole.error('手动加载失败:', error);
      }
    }
    return null;
  };
}
