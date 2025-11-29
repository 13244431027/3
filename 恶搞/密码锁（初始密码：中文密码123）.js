(function(_Scratch) {
  const { extensions } = _Scratch;
  
  // 引入程序暂停相关功能
  const checkAssetsReady = () => {
      try {
          const vm = window.vm || _Scratch.vm;
          const assets = vm?.runtime?.storage?.assets;
          return assets && [
              ...(assets.costumes || []),
              ...(assets.sounds || [])
          ].every(a => a?.loaded);
      } catch {
          return false;
      }
  };

  // 暂停程序实现
  const pauseRuntime = (seconds) => {
      return new Promise(resolve => {
          const endTime = Date.now() + (seconds * 1000);
          const check = () => {
              if (Date.now() >= endTime) {
                  resolve();
              } else {
                  setTimeout(check, 50);
              }
          };
          check();
      });
  };

  class PasswordLock {
    getInfo() {
      return {
        id: 'bugWarning',  // 已将注册ID修改为bugWarning
        name: '密码验证3.0',
        blocks: [
          {
            opcode: 'setPassword',
            blockType: _Scratch.BlockType.COMMAND,
            text: '设置密码为 [PASSWORD]（支持中文）',
            arguments: {
              PASSWORD: {
                type: _Scratch.ArgumentType.STRING,
                defaultValue: '中文密码示例'
              }
            }
          },
          {
            opcode: 'setSecurityQuestion',
            blockType: _Scratch.BlockType.COMMAND,
            text: '设置密保问题 [QUESTION] 答案为 [ANSWER]',
            arguments: {
              QUESTION: {
                type: _Scratch.ArgumentType.STRING,
                defaultValue: '我最喜欢的颜色是？'
              },
              ANSWER: {
                type: _Scratch.ArgumentType.STRING,
                defaultValue: '蓝色'
              }
            }
          },
          {
            opcode: 'getCurrentPassword',
            blockType: _Scratch.BlockType.REPORTER,
            text: '当前密码'
          },
          {
            opcode: 'isValidated',
            blockType: _Scratch.BlockType.BOOLEAN,
            text: '已通过密码验证？'
          },
          {
            opcode: 'showLockScreen',
            blockType: _Scratch.BlockType.COMMAND,
            text: '打开密码锁界面'
          },
          // 暂停程序积木
          {
            opcode: 'pauseRuntime',
            blockType: _Scratch.BlockType.COMMAND,
            text: '暂停程序[SECONDS]秒',
            arguments: {
                SECONDS: {
                    type: _Scratch.ArgumentType.NUMBER,
                    defaultValue: 3
                }
            }
          }
        ]
      };
    }
    
    setPassword(args) {
      this.password = String(args.PASSWORD);
    }
    
    setSecurityQuestion(args) {
      this.securityQuestion = args.QUESTION;
      this.securityAnswer = args.ANSWER;
    }
    
    getCurrentPassword() {
      return this.password;
    }
    
    isValidated() {
      return this.isValidated;
    }
    
    showLockScreen() {
      if (this.isValidated) {
        this.isValidated = false;
      }
      this.createLockScreen();
    }
    
    // 暂停程序积木实现
    pauseRuntime(args) {
        return pauseRuntime(args.SECONDS);
    }
    
    constructor() {
      this.password = "中文密码123";
      this.securityQuestion = "我最喜欢的编程语言是？";
      this.securityAnswer = "JavaScript";
      this.isValidated = false;
      this.observer = null;
      this.overlay = null;
      this.backgroundClone = null;
      this.failedAttempts = 0; // 记录失败次数
      
      _Scratch.vm.runtime.once('PROJECT_LOADED', () => {
        this.createLockScreen();
      });
      
      setTimeout(() => {
        if (!this.isValidated && !this.overlay) {
          this.createLockScreen();
        }
      }, 1000);
    }

    createLockScreen() {
      if (this.overlay && document.body.contains(this.overlay)) {
        this.overlay.remove();
      }
      
      if (this.backgroundClone && document.body.contains(this.backgroundClone)) {
        this.backgroundClone.remove();
      }
      
      this.createBlurredBackground();
      
      const overlay = document.createElement('div');
      this.overlay = overlay;
      
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '2147483647',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto'
      });
      
      const container = document.createElement('div');
      container.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 10px;
        text-align: center;
        width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1;
      `;
      
      const title = document.createElement('h3');
      title.textContent = '请输入密码（支持中文）';
      title.style.marginBottom = '20px';
      
      const form = document.createElement('div');
      form.style.marginBottom = '15px';
      
      const passwordContainer = document.createElement('div');
      passwordContainer.style.position = 'relative';
      passwordContainer.style.width = '100%';
      
      const input = document.createElement('input');
      input.type = 'password';
      input.placeholder = '请输入中文或英文密码';
      input.removeAttribute('pattern');
      input.removeAttribute('onkeypress');
      input.removeAttribute('inputmode');
      input.style.cssText = `
        width: 100%;
        padding: 8px 35px 8px 8px;
        margin-bottom: 15px;
        box-sizing: border-box;
        font-family: "Microsoft YaHei", sans-serif;
      `;
      
      const toggleButton = document.createElement('button');
      toggleButton.textContent = '显示';
      toggleButton.style.cssText = `
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 2px 5px;
        font-size: 12px;
        color: #666;
      `;
      
      let passwordVisible = false;
      toggleButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        passwordVisible = !passwordVisible;
        input.type = passwordVisible ? 'text' : 'password';
        toggleButton.textContent = passwordVisible ? '隐藏' : '显示';
      };
      
      input.addEventListener('compositionstart', (e) => {});
      input.addEventListener('compositionend', (e) => {});
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.justifyContent = 'center';
      
      const verifyButton = document.createElement('button');
      verifyButton.textContent = '验证';
      verifyButton.style.padding = '8px 16px';
      
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '取消';
      cancelButton.style.padding = '8px 16px';
      
      // 密码错误时执行暂停功能
      verifyButton.onclick = async () => {
        if (String(input.value) === String(this.password)) {
          this.isValidated = true;
          this.failedAttempts = 0; // 重置失败次数
          overlay.remove();
          this.backgroundClone.remove();
        } else {
          this.failedAttempts++;
          // 失败次数越多，暂停时间越长（1秒 * 失败次数）
          const pauseSeconds = this.failedAttempts;
          alert(`密码错误，请重试（支持中文密码）\n将暂停${pauseSeconds}秒`);
          
          // 执行暂停
          await pauseRuntime(pauseSeconds);
          
          input.value = '';
          input.focus();
        }
      };
      
      cancelButton.onclick = () => {
        this.showSecurityQuestion(overlay);
      };
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          verifyButton.click();
        }
      });
      
      passwordContainer.appendChild(input);
      passwordContainer.appendChild(toggleButton);
      form.appendChild(passwordContainer);
      buttonContainer.appendChild(verifyButton);
      buttonContainer.appendChild(cancelButton);
      container.appendChild(title);
      container.appendChild(form);
      container.appendChild(buttonContainer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      input.focus();
      
      if (this.observer) {
        this.observer.disconnect();
      }
      this.observer = new MutationObserver(mutations => {
        for(const mutation of mutations) {
          for(const node of mutation.removedNodes) {
            if (node === overlay && !this.isValidated) {
              this.destroyPage();
              return;
            }
          }
        }
      });
      this.observer.observe(document.body, { childList: true });
      
      overlay.oncontextmenu = e => e.preventDefault();
    }
    
    createBlurredBackground() {
      const backgroundClone = document.createElement('div');
      this.backgroundClone = backgroundClone;
      
      Object.assign(backgroundClone.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '2147483646',
        pointerEvents: 'none',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      });
      
      document.body.appendChild(backgroundClone);
    }
    
    showSecurityQuestion(overlay) {
      overlay.innerHTML = '';
      
      const container = document.createElement('div');
      container.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 10px;
        text-align: center;
        width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1;
      `;
      
      const title = document.createElement('h3');
      title.textContent = '密保验证';
      title.style.marginBottom = '20px';
      
      const question = document.createElement('p');
      question.textContent = this.securityQuestion;
      question.style.marginBottom = '15px';
      question.style.fontWeight = 'bold';
      
      const answerInput = document.createElement('input');
      answerInput.placeholder = '请输入答案';
      answerInput.style.cssText = `
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        box-sizing: border-box;
      `;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.justifyContent = 'center';
      
      const submitButton = document.createElement('button');
      submitButton.textContent = '提交';
      submitButton.style.padding = '8px 16px';
      
      const backButton = document.createElement('button');
      backButton.textContent = '返回';
      backButton.style.padding = '8px 16px';
      
      // 密保答案错误时也执行暂停功能
      submitButton.onclick = async () => {
        if (answerInput.value === this.securityAnswer) {
          this.isValidated = true;
          this.failedAttempts = 0; // 重置失败次数
          overlay.remove();
          this.backgroundClone.remove();
        } else {
          this.failedAttempts++;
          const pauseSeconds = this.failedAttempts;
          alert(`答案错误，请重试\n将暂停${pauseSeconds}秒`);
          
          // 执行暂停
          await pauseRuntime(pauseSeconds);
          
          answerInput.value = '';
          answerInput.focus();
        }
      };
      
      backButton.onclick = () => {
        this.createLockScreen();
      };
      
      answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          submitButton.click();
        }
      });
      
      container.appendChild(title);
      container.appendChild(question);
      container.appendChild(answerInput);
      buttonContainer.appendChild(submitButton);
      buttonContainer.appendChild(backButton);
      container.appendChild(buttonContainer);
      overlay.appendChild(container);
      answerInput.focus();
    }

    destroyPage() {
      while(document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      const warning = document.createElement('div');
      warning.textContent = '非法访问！页面内容已被保护。';
      warning.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:red;background:white;padding:20px;border-radius:10px;';
      document.body.appendChild(warning);
      if(this.observer) this.observer.disconnect();
    }
  }
  extensions.register(new PasswordLock());
})(Scratch);
    