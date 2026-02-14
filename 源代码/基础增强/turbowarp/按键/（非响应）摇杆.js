class ResponsiveJoystickExtension {
  constructor() {
    this.joysticks = new Map();
    this.activeTouches = new Map();
    this.uiContainer = null;
    this.allVisible = true;
    this.createUIContainer();
    this.updateViewportSize();
    
    window.addEventListener('resize', this.updateViewportSize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }
  
  updateViewportSize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.scaleFactor = Math.min(this.viewportWidth, this.viewportHeight) / 2000;
    
    // 更新所有摇杆位置
    this.joysticks.forEach((joystick, id) => {
      this.updateJoystickPositionOnResize(id);
    });
  }
  
  handleOrientationChange() {
    // 添加延迟以确保方向变化已完成
    setTimeout(() => {
      this.updateViewportSize();
    }, 300);
  }
  
  createUIContainer() {
    if (this.uiContainer) return;
    
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'responsive-joystick-container';
    this.uiContainer.style.position = 'fixed';
    this.uiContainer.style.top = '0';
    this.uiContainer.style.left = '0';
    this.uiContainer.style.width = '100vw';
    this.uiContainer.style.height = '100vh';
    this.uiContainer.style.pointerEvents = 'none';
    this.uiContainer.style.zIndex = '999999';
    this.uiContainer.style.overflow = 'visible';
    
    document.body.appendChild(this.uiContainer);
  }
  
  createJoystick(id, options) {
    if (this.joysticks.has(id)) {
      this.removeJoystick(id);
    }
    
    const defaults = {
      x: 0,
      y: 0,
      outerSize: 100,
      innerSize: 40,
      outerColor: 'rgba(0, 0, 0, 0.5)',
      innerColor: 'rgba(255, 255, 255, 0.8)',
      visible: true,
      positionType: 'absolute', // 'absolute' or 'relative'
      relativeX: 20, // percentage from left if positionType is 'relative'
      relativeY: 80,  // percentage from top if positionType is 'relative'
      outerImage: null,
      innerImage: null,
      outerImageSize: '100%',
      innerImageSize: '100%',
      outerImageOpacity: 1,
      innerImageOpacity: 1
    };
    
    const config = { ...defaults, ...options };
    
    // 解析颜色格式（支持 #ff0000,0.5 格式）
    if (config.outerColor && config.outerColor.includes(',')) {
      const [color, alpha] = config.outerColor.split(',');
      config.outerColor = this.hexToRgba(color.trim(), parseFloat(alpha.trim()));
    }
    
    if (config.innerColor && config.innerColor.includes(',')) {
      const [color, alpha] = config.innerColor.split(',');
      config.innerColor = this.hexToRgba(color.trim(), parseFloat(alpha.trim()));
    }
    
    // 计算屏幕位置
    let screenX, screenY;
    if (config.positionType === 'relative') {
      screenX = (window.innerWidth * config.relativeX / 100);
      screenY = (window.innerHeight * config.relativeY / 100);
    } else {
      screenX = (window.innerWidth / 2) + config.x;
      screenY = (window.innerHeight / 2) - config.y;
    }
    
    // 确保摇杆不会超出屏幕边界
    const maxX = window.innerWidth - config.outerSize / 2;
    const minX = config.outerSize / 2;
    const maxY = window.innerHeight - config.outerSize / 2;
    const minY = config.outerSize / 2;
    
    screenX = Math.min(Math.max(screenX, minX), maxX);
    screenY = Math.min(Math.max(screenY, minY), maxY);
    
    const outer = document.createElement('div');
    outer.id = `joystick-outer-${id}`;
    outer.style.position = 'absolute';
    outer.style.left = `${screenX}px`;
    outer.style.top = `${screenY}px`;
    outer.style.width = `${config.outerSize}px`;
    outer.style.height = `${config.outerSize}px`;
    outer.style.transform = 'translate(-50%, -50%)';
    outer.style.backgroundColor = config.outerColor;
    outer.style.borderRadius = '50%';
    outer.style.pointerEvents = this.allVisible && config.visible ? 'auto' : 'none';
    outer.style.display = this.allVisible && config.visible ? 'block' : 'none';
    outer.style.touchAction = 'none';
    outer.style.overflow = 'hidden';
    
    // 创建外圈图片元素
    const outerImg = document.createElement('img');
    outerImg.id = `joystick-outer-img-${id}`;
    outerImg.style.position = 'absolute';
    outerImg.style.left = '50%';  // 初始就居中
    outerImg.style.top = '50%';   // 初始就居中
    outerImg.style.transform = 'translate(-50%, -50%)';  // 初始就居中
    outerImg.style.width = config.outerImageSize;  // 使用配置的尺寸
    outerImg.style.height = config.outerImageSize; // 使用配置的尺寸
    outerImg.style.objectFit = 'cover';
    outerImg.style.opacity = config.outerImageOpacity;
    outerImg.style.pointerEvents = 'none';
    
    if (config.outerImage) {
      outerImg.src = config.outerImage;
      outerImg.style.display = 'block';
    } else {
      outerImg.style.display = 'none';
    }
    
    outer.appendChild(outerImg);
    
    const inner = document.createElement('div');
    inner.id = `joystick-inner-${id}`;
    inner.style.position = 'absolute';
    inner.style.left = '50%';
    inner.style.top = '50%';
    inner.style.width = `${config.innerSize}px`;
    inner.style.height = `${config.innerSize}px`;
    inner.style.transform = 'translate(-50%, -50%)';
    inner.style.backgroundColor = config.innerColor;
    inner.style.borderRadius = '50%';
    inner.style.pointerEvents = 'none';
    inner.style.zIndex = '1';
    inner.style.overflow = 'hidden';
    
    // 创建内圈图片元素
    const innerImg = document.createElement('img');
    innerImg.id = `joystick-inner-img-${id}`;
    innerImg.style.position = 'absolute';
    innerImg.style.left = '50%';  // 初始就居中
    innerImg.style.top = '50%';   // 初始就居中
    innerImg.style.transform = 'translate(-50%, -50%)';  // 初始就居中
    innerImg.style.width = config.innerImageSize;  // 使用配置的尺寸
    innerImg.style.height = config.innerImageSize; // 使用配置的尺寸
    innerImg.style.objectFit = 'cover';
    innerImg.style.opacity = config.innerImageOpacity;
    innerImg.style.pointerEvents = 'none';
    
    if (config.innerImage) {
      innerImg.src = config.innerImage;
      innerImg.style.display = 'block';
    } else {
      innerImg.style.display = 'none';
    }
    
    inner.appendChild(innerImg);
    outer.appendChild(inner);
    this.uiContainer.appendChild(outer);
    
    this.joysticks.set(id, {
      id: id,
      outer: outer,
      inner: inner,
      outerImg: outerImg,
      innerImg: innerImg,
      logicalX: config.x,
      logicalY: config.y,
      screenX: screenX,
      screenY: screenY,
      outerSize: config.outerSize,
      innerSize: config.innerSize,
      outerColor: config.outerColor,
      innerColor: config.innerColor,
      visible: config.visible,
      positionType: config.positionType,
      relativeX: config.relativeX,
      relativeY: config.relativeY,
      activeTouch: null,
      currentX: 0,
      currentY: 0,
      outerImage: config.outerImage,
      innerImage: config.innerImage,
      outerImageSize: config.outerImageSize,
      innerImageSize: config.innerImageSize,
      outerImageOpacity: config.outerImageOpacity,
      innerImageOpacity: config.innerImageOpacity
    });
    
    outer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    outer.addEventListener('mousedown', this.handleMouseDown.bind(this));
  }
  
  // 将十六进制颜色转换为RGBA
  hexToRgba(hex, alpha = 1) {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 处理3位十六进制
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  updateJoystickPositionOnResize(id) {
    const joystick = this.joysticks.get(id);
    if (!joystick) return;
    
    let screenX, screenY;
    if (joystick.positionType === 'relative') {
      screenX = (window.innerWidth * joystick.relativeX / 100);
      screenY = (window.innerHeight * joystick.relativeY / 100);
    } else {
      screenX = (window.innerWidth / 2) + joystick.logicalX;
      screenY = (window.innerHeight / 2) - joystick.logicalY;
    }
    
    // 确保摇杆不会超出屏幕边界
    const maxX = window.innerWidth - joystick.outerSize / 2;
    const minX = joystick.outerSize / 2;
    const maxY = window.innerHeight - joystick.outerSize / 2;
    const minY = joystick.outerSize / 2;
    
    screenX = Math.min(Math.max(screenX, minX), maxX);
    screenY = Math.min(Math.max(screenY, minY), maxY);
    
    joystick.screenX = screenX;
    joystick.screenY = screenY;
    
    joystick.outer.style.left = `${screenX}px`;
    joystick.outer.style.top = `${screenY}px`;
  }
  
  removeJoystick(id) {
    const joystick = this.joysticks.get(id);
    if (joystick) {
      joystick.outer.removeEventListener('touchstart', this.handleTouchStart);
      joystick.outer.removeEventListener('mousedown', this.handleMouseDown);
      
      if (joystick.outer.parentNode) {
        joystick.outer.parentNode.removeChild(joystick.outer);
      }
      
      this.joysticks.delete(id);
      
      if (joystick.activeTouch !== null) {
        this.activeTouches.delete(joystick.activeTouch);
      }
    }
  }
  
  removeAllJoysticks() {
    const ids = Array.from(this.joysticks.keys());
    for (const id of ids) {
      this.removeJoystick(id);
    }
  }
  
  setJoystickVisibility(id, visible) {
    const joystick = this.joysticks.get(id);
    if (joystick) {
      joystick.visible = visible;
      joystick.outer.style.display = this.allVisible && visible ? 'block' : 'none';
      joystick.outer.style.pointerEvents = this.allVisible && visible ? 'auto' : 'none';
    }
  }
  
  hideAllJoysticks() {
    this.allVisible = false;
    this.joysticks.forEach(joystick => {
      joystick.outer.style.display = 'none';
      joystick.outer.style.pointerEvents = 'none';
    });
  }
  
  showAllJoysticks() {
    this.allVisible = true;
    this.joysticks.forEach(joystick => {
      if (joystick.visible) {
        joystick.outer.style.display = 'block';
        joystick.outer.style.pointerEvents = 'auto';
      }
    });
  }
  
    updateJoystickAppearance(id, options) {
      const joystick = this.joysticks.get(id);
      if (!joystick) return;
    
      if (options.outerSize !== undefined) {
        joystick.outerSize = options.outerSize;
        joystick.outer.style.width = `${options.outerSize}px`;
        joystick.outer.style.height = `${options.outerSize}px`;
      }
    
      if (options.innerSize !== undefined) {
        joystick.innerSize = options.innerSize;
        joystick.inner.style.width = `${options.innerSize}px`;
        joystick.inner.style.height = `${options.innerSize}px`;
      }
    
      if (options.outerColor !== undefined) {
        // 解析颜色格式
        let outerColor = options.outerColor;
        if (outerColor.includes(',')) {
          const [color, alpha] = outerColor.split(',');
          outerColor = this.hexToRgba(color.trim(), parseFloat(alpha.trim()));
        }
        
        joystick.outerColor = outerColor;
        joystick.outer.style.backgroundColor = outerColor;
      }
    
      if (options.innerColor !== undefined) {
        // 解析颜色格式
        let innerColor = options.innerColor;
        if (innerColor.includes(',')) {
          const [color, alpha] = innerColor.split(',');
          innerColor = this.hexToRgba(color.trim(), parseFloat(alpha.trim()));
        }
        
        joystick.innerColor = innerColor;
        joystick.inner.style.backgroundColor = innerColor;
      }
    
      // 更新图片相关设置
      if (options.outerImage !== undefined) {
        joystick.outerImage = options.outerImage;
        if (options.outerImage) {
          joystick.outerImg.src = options.outerImage;
          joystick.outerImg.style.display = 'block';
        } else {
          joystick.outerImg.style.display = 'none';
        }
      }
    
      if (options.innerImage !== undefined) {
        joystick.innerImage = options.innerImage;
        if (options.innerImage) {
          joystick.innerImg.src = options.innerImage;
          joystick.innerImg.style.display = 'block';
        } else {
          joystick.innerImg.style.display = 'none';
        }
      }
    
      if (options.outerImageSize !== undefined) {
        joystick.outerImageSize = options.outerImageSize;
        // 如果是数字，添加px后缀；如果是字符串，保持原样
        const sizeValue = typeof options.outerImageSize === 'number' ? 
          `${options.outerImageSize}px` : options.outerImageSize;
        joystick.outerImg.style.width = sizeValue;
        joystick.outerImg.style.height = sizeValue;
      }
    
      if (options.innerImageSize !== undefined) {
        joystick.innerImageSize = options.innerImageSize;
        // 如果是数字，添加px后缀；如果是字符串，保持原样
        const sizeValue = typeof options.innerImageSize === 'number' ? 
          `${options.innerImageSize}px` : options.innerImageSize;
        joystick.innerImg.style.width = sizeValue;
        joystick.innerImg.style.height = sizeValue;
      }
    
      if (options.outerImageOpacity !== undefined) {
        joystick.outerImageOpacity = options.outerImageOpacity;
        joystick.outerImg.style.opacity = options.outerImageOpacity;
      }
    
      if (options.innerImageOpacity !== undefined) {
        joystick.innerImageOpacity = options.innerImageOpacity;
        joystick.innerImg.style.opacity = options.innerImageOpacity;
      }
    
      // 其余代码保持不变...
      if (options.x !== undefined || options.y !== undefined) {
        const x = options.x !== undefined ? options.x : joystick.logicalX;
        const y = options.y !== undefined ? options.y : joystick.logicalY;
        
        joystick.logicalX = x;
        joystick.logicalY = y;
        
        const screenX = (window.innerWidth / 2) + x;
        const screenY = (window.innerHeight / 2) - y;
        
        // 确保摇杆不会超出屏幕边界
        const maxX = window.innerWidth - joystick.outerSize / 2;
        const minX = joystick.outerSize / 2;
        const maxY = window.innerHeight - joystick.outerSize / 2;
        const minY = joystick.outerSize / 2;
        
        joystick.screenX = Math.min(Math.max(screenX, minX), maxX);
        joystick.screenY = Math.min(Math.max(screenY, minY), maxY);
        
        joystick.outer.style.left = `${joystick.screenX}px`;
        joystick.outer.style.top = `${joystick.screenY}px`;
      }
      
      if (options.positionType !== undefined) {
        joystick.positionType = options.positionType;
      }
      
      if (options.relativeX !== undefined) {
        joystick.relativeX = options.relativeX;
      }
      
      if (options.relativeY !== undefined) {
        joystick.relativeY = options.relativeY;
      }
      
      // 如果位置类型是相对定位，更新位置
      if (options.positionType === 'relative' || 
          (joystick.positionType === 'relative' && 
           (options.relativeX !== undefined || options.relativeY !== undefined))) {
        
        const screenX = (window.innerWidth * joystick.relativeX / 100);
        const screenY = (window.innerHeight * joystick.relativeY / 100);
        
        // 确保摇杆不会超出屏幕边界
        const maxX = window.innerWidth - joystick.outerSize / 2;
        const minX = joystick.outerSize / 2;
        const maxY = window.innerHeight - joystick.outerSize / 2;
        const minY = joystick.outerSize / 2;
        
        joystick.screenX = Math.min(Math.max(screenX, minX), maxX);
        joystick.screenY = Math.min(Math.max(screenY, minY), maxY);
        
        joystick.outer.style.left = `${joystick.screenX}px`;
        joystick.outer.style.top = `${joystick.screenY}px`;
      }
    }
  
  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const joystickId = e.currentTarget.id.replace('joystick-outer-', '');
    const joystick = this.joysticks.get(joystickId);
    
    if (!joystick || joystick.activeTouch !== null) return;
    
    joystick.activeTouch = touch.identifier;
    this.activeTouches.set(touch.identifier, joystickId);
    
    const handleTouchMove = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touch.identifier) {
          this.updateJoystickPosition(joystickId, t.clientX, t.clientY);
          break;
        }
      }
    };
    
    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touch.identifier) {
          this.resetJoystick(joystickId);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
          break;
        }
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    this.updateJoystickPosition(joystickId, touch.clientX, touch.clientY);
  }
  
  handleMouseDown(e) {
    e.preventDefault();
    const joystickId = e.currentTarget.id.replace('joystick-outer-', '');
    const joystick = this.joysticks.get(joystickId);
    
    if (!joystick || joystick.activeTouch !== null) return;
    
    joystick.activeTouch = 0;
    this.activeTouches.set(0, joystickId);
    
    const handleMouseMove = (e) => {
      this.updateJoystickPosition(joystickId, e.clientX, e.clientY);
    };
    
    const handleMouseUp = () => {
      this.resetJoystick(joystickId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    this.updateJoystickPosition(joystickId, e.clientX, e.clientY);
  }
  
  updateJoystickPosition(id, clientX, clientY) {
    const joystick = this.joysticks.get(id);
    if (!joystick || !joystick.inner) return;
    
    const rect = joystick.outer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = joystick.outerSize / 2 - joystick.innerSize / 2;
    
    let moveX = deltaX;
    let moveY = deltaY;
    
    if (distance > maxDistance) {
      moveX = (deltaX / distance) * maxDistance;
      moveY = (deltaY / distance) * maxDistance;
    }
    
    joystick.currentX = moveX / maxDistance;
    joystick.currentY = -moveY / maxDistance;
    
    joystick.inner.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
  }
  
  resetJoystick(id) {
    const joystick = this.joysticks.get(id);
    if (joystick) {
      joystick.activeTouch = null;
      joystick.currentX = 0;
      joystick.currentY = 0;
      
      joystick.inner.style.transition = 'transform 0.2s ease-out';
      joystick.inner.style.transform = 'translate(-50%, -50%)';
      
      setTimeout(() => {
        joystick.inner.style.transition = 'none';
      }, 200);
      
      this.activeTouches.forEach((value, key) => {
        if (value === id) {
          this.activeTouches.delete(key);
        }
      });
    }
  }
  
  getJoystickState(id) {
    const joystick = this.joysticks.get(id);
    if (!joystick) {
      return {
        isActive: false,
        x: 0,
        y: 0,
        angle: 0,
        distance: 0,
        initialX: 0,
        initialY: 0,
        outerSize: 0,
        innerSize: 0,
        outerColor: '',
        innerColor: '',
        screenX: 0,
        screenY: 0,
        positionType: 'absolute',
        relativeX: 0,
        relativeY: 0,
        outerImage: null,
        innerImage: null,
        outerImageSize: '100%',
        innerImageSize: '100%',
        outerImageOpacity: 1,
        innerImageOpacity: 1
      };
    }
    
    const isActive = joystick.activeTouch !== null;
    const x = joystick.currentX;
    const y = joystick.currentY;
    
    let angle = Math.atan2(-y, x) * (180 / Math.PI);
    angle = (angle + 450) % 360;
    
    const distance = Math.min(1, Math.sqrt(x * x + y * y));
    
    return {
      isActive: isActive,
      x: x,
      y: y,
      angle: angle,
      distance: distance,
      initialX: joystick.logicalX,
      initialY: joystick.logicalY,
      outerSize: joystick.outerSize,
      innerSize: joystick.innerSize,
      outerColor: joystick.outerColor,
      innerColor: joystick.innerColor,
      screenX: joystick.screenX,
      screenY: joystick.screenY,
      positionType: joystick.positionType,
      relativeX: joystick.relativeX,
      relativeY: joystick.relativeY,
      outerImage: joystick.outerImage,
      innerImage: joystick.innerImage,
      outerImageSize: joystick.outerImageSize,
      innerImageSize: joystick.innerImageSize,
      outerImageOpacity: joystick.outerImageOpacity,
      innerImageOpacity: joystick.innerImageOpacity
    };
  }
}

// 注册扩展
(function() {
  let extensionInstance = null;
  
  const extension = {
    _getJoystick: function() {
      if (!extensionInstance) {
        extensionInstance = new ResponsiveJoystickExtension();
      }
      return extensionInstance;
    },
    
    getInfo: function() {
      return {
        id: 'responsivejoystick',
        name: '自适应屏幕摇杆',
        color1: '#4CAF50',
        color2: '#388E3C',
            // 添加这3行图标配置
        blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAXFkAAFxZAStO/ZEAAAFKSURBVFiF7ZhBEoIwDEU/jgsWHpAbyM6zuMMbcEAX7nDhlCklTdM2lKr8FTOQ5pGkgQY49ONqsleYLhPv4ZnlI804BOX1Fg8bZ+CCda+wzdgSXuWgckAbTgJGyYUVgIYBNcBc2aABSB5wCzgjIeRJtJg2nLsms+nO3gWMkQLcMD6893rcWFs6tIXgjGZIItWyFCdKAgcAA+6fCyLVa0Cl6EnhQto0gjGao+hoCahYe8ly0lxNBH36X8C+u6o8X1cEidrfFFAaxdVz1kZpyBvKu9jXE8kXGNvFF6UIoFjmD8cCrKsGCX0ZoAktdY7YSfVEkKg/oCZAj9aAe6SZ8cVHsHQtiv+oM8cVUfLU3ozCGm/duANwwF4Hd0B8LpalUhMycvyRNpsB4kET5jJAyviNmgL4YDMnW0DOADN2RpjYGXTaCQVbslUdYvQGIud6k8HIQCAAAAAASUVORK5CYII=',
        menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAAJcEhZcwAAXFkAAFxZAStO/ZEAAAGASURBVFiF5Zk9bsMwDIWfiwxF0AP6BvHWC7RTc4Fu6Q1ywCDo1i61IFGkSP3ZCvq2WBb1+ZEKZHqCoOMbfqSxHrqfMXHXo4tbg1FRUPdjbzCqFfRQHejjJTl+fL9VxZ+AfPc0KEm5sPczpiwHI7D5W590fY7m54BOVvcCOAsYJw8WsIGqgE3AqDxQDfIpNdgFjsTS6jkJyAVsJiOkuEncpAZwl+uXOLbgNTmXdXArOAC44DNck8iW4kJpcO6+BGQE2Mo9K5ymrg7maHWRKgBsWXulomkexkFJ/xdwmU9N7h/LQab2uwJaXaT3+Rulu4MpyGU+seP+Caf6yG+RuR7JeREYrQYZPRagyz1j9V4ax8E/U+grwDiAgiLAXdKcWCvt4Ma1yL3hsYC17YosCbW3SnRwk1QrcICS4gCyNagxnrqLg6drAUkeVisnc3erqHFEwTxZ6jyru7UGdKD+ghIs43juBizusOb2CEt6g0DFcctfkINt9Vf1OE10qlE+Q/wCJVSTEQ1z20QAAAAASUVORK5CYII=',
        docsURI: 'https://b23.tv/hMeL22P',
        blocks: [
          {
            opcode: 'createJoystick',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建/更新摇杆 ID [id] 位置 x [x] y [y] 外圈大小 [outerSize] 内圈大小 [innerSize] 外圈颜色 [outerColor] 内圈颜色 [innerColor]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -200
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              outerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              innerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 40
              },
              outerColor: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#000000,0.5'
              },
              innerColor: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#FFFFFF,0.8'
              }
            }
          },
          {
            opcode: 'createRelativeJoystick',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建相对位置摇杆 ID [id] 水平位置 [relativeX]% 垂直位置 [relativeY]% 外圈大小 [outerSize] 内圈大小 [innerSize]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick2'
              },
              relativeX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20
              },
              relativeY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80
              },
              outerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              innerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 40
              }
            }
          },
          {
            opcode: 'setJoystickImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置摇杆 [id] [part] 图片 [image]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              part: {
                type: Scratch.ArgumentType.STRING,
                menu: 'joystickPartMenu',
                defaultValue: 'outer'
              },
              image: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'setJoystickImageSize',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置摇杆 [id] [part] 图片尺寸 [size]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              part: {
                type: Scratch.ArgumentType.STRING,
                menu: 'joystickPartMenu',
                defaultValue: 'outer'
              },
              size: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'setJoystickImageOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置摇杆 [id] [part] 图片透明度 [opacity]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              part: {
                type: Scratch.ArgumentType.STRING,
                menu: 'joystickPartMenu',
                defaultValue: 'outer'
              },
              opacity: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'removeJoystick',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除摇杆 ID [id]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'removeAllJoysticks',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除所有摇杆'
          },
          {
            opcode: 'setJoystickVisibility',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置摇杆 [id] 可见性 [visible]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              visible: {
                type: Scratch.ArgumentType.BOOLEAN,
                defaultValue: true
              }
            }
          },
          {
            opcode: 'hideAllJoysticks',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏所有摇杆'
          },
          {
            opcode: 'showAllJoysticks',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示所有摇杆'
          },
          {
            opcode: 'updateJoystickAppearance',
            blockType: Scratch.BlockType.COMMAND,
            text: '更新摇杆 [id] 外观 外圈大小 [outerSize] 内圈大小 [innerSize] 外圈颜色 [outerColor] 内圈颜色 [innerColor]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              outerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              innerSize: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 40
              },
              outerColor: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#000000,0.5'
              },
              innerColor: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#FFFFFF,0.8'
              }
            }
          },
          {
            opcode: 'updateJoystickPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: '更新摇杆 [id] 位置 类型 [positionType] X [x] Y [y] 相对X [relativeX] 相对Y [relativeY]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              },
              positionType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionTypeMenu',
                defaultValue: 'absolute'
              },
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              relativeX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20
              },
              relativeY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 80
              }
            }
          },
          {
            opcode: 'isJoystickActive',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '摇杆 [id] 正在使用？',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickX',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] X方向值',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickY',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] Y方向值',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickAngle',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] 角度',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickDistance',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] 距离',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickScreenX',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] 屏幕X坐标',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickScreenY',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] 屏幕Y坐标',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          },
          {
            opcode: 'getJoystickPositionType',
            blockType: Scratch.BlockType.REPORTER,
            text: '摇杆 [id] 位置类型',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'joystick'
              }
            }
          }
        ],
        menus: {
          positionTypeMenu: {
            items: [
              { text: '绝对位置', value: 'absolute' },
              { text: '相对位置', value: 'relative' }
            ]
          },
          joystickPartMenu: {
            items: [
              { text: '外圈', value: 'outer' },
              { text: '内圈', value: 'inner' }
            ]
          }
        }
      };
    },
    
    createJoystick: function(args) {
      this._getJoystick().createJoystick(args.id, {
        x: args.x,
        y: args.y,
        outerSize: args.outerSize,
        innerSize: args.innerSize,
        outerColor: args.outerColor,
        innerColor: args.innerColor
      });
    },
    
    createRelativeJoystick: function(args) {
      this._getJoystick().createJoystick(args.id, {
        positionType: 'relative',
        relativeX: args.relativeX,
        relativeY: args.relativeY,
        outerSize: args.outerSize,
        innerSize: args.innerSize,
        outerColor: '#000000,0.5',
        innerColor: '#FFFFFF,0.8'
      });
    },
    
    setJoystickImage: function(args) {
      const options = {};
      if (args.part === 'outer') {
        options.outerImage = args.image || null;
      } else {
        options.innerImage = args.image || null;
      }
      this._getJoystick().updateJoystickAppearance(args.id, options);
    },
    
    setJoystickImageSize: function(args) {
      const options = {};
      if (args.part === 'outer') {
        options.outerImageSize = args.size;
      } else {
        options.innerImageSize = args.size;
      }
      this._getJoystick().updateJoystickAppearance(args.id, options);
    },
    
    setJoystickImageOpacity: function(args) {
      const options = {};
      if (args.part === 'outer') {
        options.outerImageOpacity = args.opacity;  // 直接使用数字
      } else {
        options.innerImageOpacity = args.opacity;  // 直接使用数字
      }
      this._getJoystick().updateJoystickAppearance(args.id, options);
    },
    
    removeJoystick: function(args) {
      this._getJoystick().removeJoystick(args.id);
    },
    
    removeAllJoysticks: function() {
      this._getJoystick().removeAllJoysticks();
    },
    
    setJoystickVisibility: function(args) {
      this._getJoystick().setJoystickVisibility(args.id, args.visible);
    },
    
    hideAllJoysticks: function() {
      this._getJoystick().hideAllJoysticks();
    },
    
    showAllJoysticks: function() {
      this._getJoystick().showAllJoysticks();
    },
    
    updateJoystickAppearance: function(args) {
      this._getJoystick().updateJoystickAppearance(args.id, {
        outerSize: args.outerSize,
        innerSize: args.innerSize,
        outerColor: args.outerColor,
        innerColor: args.innerColor
      });
    },
    
    updateJoystickPosition: function(args) {
      this._getJoystick().updateJoystickAppearance(args.id, {
        positionType: args.positionType,
        x: args.x,
        y: args.y,
        relativeX: args.relativeX,
        relativeY: args.relativeY
      });
    },
    
    isJoystickActive: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.isActive;
    },
    
    getJoystickX: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.x;
    },
    
    getJoystickY: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.y;
    },
    
    getJoystickAngle: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.angle;
    },
    
    getJoystickDistance: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.distance;
    },
    
    getJoystickScreenX: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.screenX;
    },
    
    getJoystickScreenY: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.screenY;
    },
    
    getJoystickPositionType: function(args) {
      const state = this._getJoystick().getJoystickState(args.id);
      return state.positionType;
    }
  };
  
  Scratch.extensions.register(extension);
})();