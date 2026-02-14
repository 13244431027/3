(function (_Scratch) {
 const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

 translate.setup({
  zh: {
   'extensionName': '文本编辑器',
   'setEditorText': '设置编辑器 [ID] 文本为 [TEXT]',
   'getEditorText': '获取编辑器 [ID] 文本',
   'getAllLines': '获取编辑器 [ID] 的所有行',
   'showEditor': '显示文本编辑器 [ID] (标题: [TITLE] 占位文字: [PLACEHOLDER])',
   'hideEditor': '隐藏编辑器 [ID]',
   'setTheme': '设置编辑器 [ID] 主题为 [THEME]',
   'getLineCount': '获取编辑器 [ID] 行数',
   'getLineText': '获取编辑器 [ID] 第 [LINE] 行文本',
   'setEditorSize': '设置编辑器 [ID] 大小为 宽 [W] 高 [H]',
   'setEditorPosition': '设置编辑器 [ID] 位置为 X [X] Y [Y]',
   'editorText_default': '在这里输入您的文本...',
   'editorTitle_default': '我的文本编辑器',
   'editorId_default': 'editor1',
   'theme_light': '亮色',
   'theme_dark': '深色'
  },
  en: {
   'extensionName': 'Text Editor',
   'setEditorText': 'set editor [ID] text to [TEXT]',
   'getEditorText': 'get editor [ID] text',
   'getAllLines': 'get all lines from editor [ID]',
   'showEditor': 'show text editor [ID] (title: [TITLE] placeholder: [PLACEHOLDER])',
   'hideEditor': 'hide editor [ID]',
   'setTheme': 'set editor [ID] theme to [THEME]',
   'getLineCount': 'get editor [ID] line count',
   'getLineText': 'get editor [ID] line [LINE] text',
   'setEditorSize': 'set editor [ID] size width [W] height [H]',
   'setEditorPosition': 'set editor [ID] position X [X] Y [Y]',
   'editorText_default': 'Enter your text here...',
   'editorTitle_default': 'My Text Editor',
   'editorId_default': 'editor1',
   'theme_light': 'light',
   'theme_dark': 'dark'
  }
 });

 class AppleStyleTextEditor {
  constructor(runtime) {
   this._runtime = runtime;
   this.editors = new Map();
   this.createEditor('default');
   this.addGlobalStyles();
  }

  addGlobalStyles() {
   const style = document.createElement('style');
   style.textContent = `
    @keyframes fadeIn {
     from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
     to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    .apple-text-editor-container {
     transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .apple-text-editor-container.light-theme {
     background: rgba(255, 255, 255, 0.95);
     color: #333;
     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
    }
    .apple-text-editor-container.dark-theme {
     background: rgba(30, 30, 30, 0.95);
     color: #fff;
     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }
    .window-control {
     width: 14px;
     height: 14px;
     border-radius: 50%;
     transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
     cursor: pointer;
    }
    .window-control:active { transform: scale(0.9); }
    .close-control { background: #ff5f56; }
    .close-control:hover { background: #ff3b30; }
    .minimize-control { background: #ffbd2e; }
    .minimize-control:hover { background: #ffa500; }
    .maximize-control { background: #27c93f; }
    .maximize-control:hover { background: #00c300; }
    .theme-toggle {
     width: 22px;
     height: 22px;
     border-radius: 50%;
     background: rgba(0, 0, 0, 0.1);
     display: flex;
     align-items: center;
     justify-content: center;
     cursor: pointer;
     margin-left: 10px;
     transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .dark-theme .theme-toggle { background: rgba(255, 255, 255, 0.1); }
    .theme-toggle:hover { transform: rotate(30deg); }
    .theme-toggle:active { transform: scale(0.9) rotate(30deg); }
    .window-controls-container {
     display: flex;
     align-items: center;
     gap: 8px;
     padding: 0 8px;
    }
    .window-control.disabled, .theme-toggle.disabled {
     opacity: 0.5;
     cursor: not-allowed;
    }
    .window-control.disabled:hover, .theme-toggle.disabled:hover { transform: none; }
    .apple-text-editor-container.locked .window-control:not(.close-control),
    .apple-text-editor-container.locked .theme-toggle {
     opacity: 0.5;
     cursor: not-allowed;
    }
    .apple-text-editor-container.locked .title-bar { cursor: default; }
    .apple-text-editor-container.locked { resize: none; }
   `;
   document.head.appendChild(style);
  }

  createEditor(id) {
   if (this.editors.has(id)) return this.editors.get(id);
   
   const editor = {
    id, text: '', theme: 'light', isVisible: false, isMaximized: false, isMinimized: false, isLocked: false,
    element: null, titleElement: null, textArea: null, lineNumberArea: null,
    isDragging: false, dragStartX: 0, dragStartY: 0, initialX: 0, initialY: 0,
    position: { x: 0, y: 0 }, size: { width: 600, height: 450 }
   };
   
   this.createEditorElement(editor);
   this.editors.set(id, editor);
   return editor;
  }

  getEditor(id) {
   id = Cast.toString(id);
   return this.editors.has(id) ? this.editors.get(id) : this.createEditor(id);
  }

  createEditorElement(editor) {
   const editorContainer = document.createElement('div');
   editorContainer.className = `apple-text-editor-container ${editor.theme}-theme`;
   editorContainer.dataset.editorId = editor.id;
   editorContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${editor.size.width}px;
    height: ${editor.size.height}px;
    border-radius: 10px;
    z-index: 9999;
    display: none;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    resize: both;
   `;

   const titleBar = document.createElement('div');
   titleBar.className = 'title-bar';
   titleBar.style.cssText = `
    height: 40px;
    background: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-weight: 500;
    color: #333;
    cursor: move;
    user-select: none;
    justify-content: space-between;
   `;
   
   const windowControls = document.createElement('div');
   windowControls.className = 'window-controls-container';
   
   const closeButton = document.createElement('div');
   closeButton.className = 'window-control close-control';
   closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.hideEditor({ID: editor.id});
   });
   
   const minimizeButton = document.createElement('div');
   minimizeButton.className = 'window-control minimize-control';
   minimizeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (editor.isLocked) return;
    this.minimizeEditor(editor.id);
   });
   
   const maximizeButton = document.createElement('div');
   maximizeButton.className = 'window-control maximize-control';
   maximizeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (editor.isLocked) return;
    this.toggleMaximizeEditor(editor.id);
   });
   
   windowControls.appendChild(closeButton);
   windowControls.appendChild(minimizeButton);
   windowControls.appendChild(maximizeButton);
   
   const titleElement = document.createElement('div');
   titleElement.textContent = translate({ id: 'editorTitle_default' });
   titleElement.style.cssText = 'flex: 1; text-align: center; margin-left: 40px;';
   
   const themeToggle = document.createElement('div');
   themeToggle.className = 'theme-toggle';
   themeToggle.innerHTML = '🌙';
   themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (editor.isLocked) return;
    this.toggleTheme(editor.id);
   });
   
   titleBar.appendChild(windowControls);
   titleBar.appendChild(titleElement);
   titleBar.appendChild(themeToggle);
   
   const editorContent = document.createElement('div');
   editorContent.style.cssText = 'display: flex; width: 100%; height: calc(100% - 40px);';
   
   const lineNumberArea = document.createElement('div');
   lineNumberArea.style.cssText = `
    width: 40px;
    background: rgba(0, 0, 0, 0.05);
    padding: 8px 4px;
    overflow-y: hidden;
    text-align: right;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #666;
    user-select: none;
   `;
   
   const textArea = document.createElement('textarea');
   textArea.style.cssText = `
    flex: 1;
    border: none;
    padding: 8px;
    box-sizing: border-box;
    resize: none;
    background: transparent;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    outline: none;
   `;
   textArea.placeholder = translate({ id: 'editorText_default' });
   
   const updateLineNumbers = () => {
    const lines = textArea.value.split('\n');
    lineNumberArea.innerHTML = '';
    for (let i = 1; i <= lines.length; i++) {
     const lineNum = document.createElement('div');
     lineNum.textContent = i;
     lineNumberArea.appendChild(lineNum);
    }
    lineNumberArea.scrollTop = textArea.scrollTop;
   };
   
   textArea.addEventListener('input', updateLineNumbers);
   textArea.addEventListener('scroll', () => lineNumberArea.scrollTop = textArea.scrollTop);
   
   editorContent.appendChild(lineNumberArea);
   editorContent.appendChild(textArea);
   editorContainer.appendChild(titleBar);
   editorContainer.appendChild(editorContent);
   document.body.appendChild(editorContainer);
   
   titleBar.addEventListener('mousedown', (e) => {
    if (editor.isLocked || e.target.classList.contains('window-control') || e.target.classList.contains('theme-toggle')) return;
    
    editor.isDragging = true;
    editor.dragStartX = e.clientX;
    editor.dragStartY = e.clientY;
    
    const rect = editorContainer.getBoundingClientRect();
    editor.initialX = rect.left;
    editor.initialY = rect.top;
    editor.position.x = rect.left;
    editor.position.y = rect.top;
    
    editorContainer.style.transform = 'none';
    editorContainer.style.left = editor.initialX + 'px';
    editorContainer.style.top = editor.initialY + 'px';
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
   });
   
   const handleDrag = (e) => {
    if (!editor.isDragging || editor.isLocked) return;
    
    const dx = e.clientX - editor.dragStartX;
    const dy = e.clientY - editor.dragStartY;
    
    editorContainer.style.left = (editor.initialX + dx) + 'px';
    editorContainer.style.top = (editor.initialY + dy) + 'px';
    
    editor.position.x = editor.initialX + dx;
    editor.position.y = editor.initialY + dy;
   };
   
   const stopDrag = () => {
    editor.isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
   };
   
   editor.element = editorContainer;
   editor.titleElement = titleElement;
   editor.textArea = textArea;
   editor.lineNumberArea = lineNumberArea;
   editor.themeToggle = themeToggle;
   
   return editor;
  }

  minimizeEditor(editorId) {
   const editor = this.getEditor(editorId);
   if (editor.isLocked) return;
   
   if (editor.isMinimized) {
    editor.element.style.height = editor.size.height + 'px';
    editor.textArea.style.display = 'flex';
    editor.lineNumberArea.style.display = 'block';
    editor.isMinimized = false;
   } else {
    editor.element.style.height = '40px';
    editor.textArea.style.display = 'none';
    editor.lineNumberArea.style.display = 'none';
    editor.isMinimized = true;
   }
  }

  toggleMaximizeEditor(editorId) {
   const editor = this.getEditor(editorId);
   if (editor.isLocked) return;
   
   if (editor.isMaximized) {
    editor.element.style.cssText = `
     position: fixed;
     top: ${editor.position.y}px;
     left: ${editor.position.x}px;
     width: ${editor.size.width}px;
     height: ${editor.size.height}px;
     border-radius: 10px;
     z-index: 9999;
     display: block;
     overflow: hidden;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
     resize: both;
    `;
    editor.isMaximized = false;
   } else {
    editor.element.style.cssText = `
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     border-radius: 0;
     z-index: 9999;
     display: block;
     overflow: hidden;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
     resize: none;
    `;
    editor.isMaximized = true;
   }
  }

  toggleTheme(editorId) {
   const editor = this.getEditor(editorId);
   if (editor.isLocked) return;
   
   if (editor.theme === 'light') {
    this.setThemeToDark(editor);
   } else {
    this.setThemeToLight(editor);
   }
   
   editor.themeToggle.innerHTML = editor.theme === 'light' ? '🌙' : '☀️';
  }

  setThemeToDark(editor) {
   editor.theme = 'dark';
   editor.element.classList.remove('light-theme');
   editor.element.classList.add('dark-theme');
   
   editor.element.querySelector('div').style.background = 'rgba(50, 50, 50, 0.7)';
   editor.element.querySelector('div').style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
   editor.element.querySelector('div').style.color = '#fff';
   
   editor.textArea.style.background = 'transparent';
   editor.textArea.style.color = '#fff';
   
   editor.lineNumberArea.style.background = 'rgba(255, 255, 255, 0.1)';
   editor.lineNumberArea.style.color = '#888';
  }

  setThemeToLight(editor) {
   editor.theme = 'light';
   editor.element.classList.remove('dark-theme');
   editor.element.classList.add('light-theme');
   
   editor.element.querySelector('div').style.background = 'rgba(255, 255, 255, 0.7)';
   editor.element.querySelector('div').style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
   editor.element.querySelector('div').style.color = '#333';
   
   editor.textArea.style.background = 'transparent';
   editor.textArea.style.color = '#333';
   
   editor.lineNumberArea.style.background = 'rgba(0, 0, 0, 0.05)';
   editor.lineNumberArea.style.color = '#666';
  }

  setEditorSize(args) {
   const editorId = Cast.toString(args.ID);
   const width = Cast.toNumber(args.W);
   const height = Cast.toNumber(args.H);
   
   const editor = this.getEditor(editorId);
   
   editor.size.width = width;
   editor.size.height = height;
   
   if (!editor.isMaximized) {
    editor.element.style.width = width + 'px';
    editor.element.style.height = height + 'px';
   }
  }

  setEditorPosition(args) {
   const editorId = Cast.toString(args.ID);
   const x = Cast.toNumber(args.X);
   const y = Cast.toNumber(args.Y);
   
   const editor = this.getEditor(editorId);
   
   editor.position.x = x;
   editor.position.y = y;
   
   if (!editor.isMaximized) {
    editor.element.style.transform = 'none';
    editor.element.style.left = x + 'px';
    editor.element.style.top = y + 'px';
   }
  }

  lockEditor(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   
   editor.isLocked = true;
   editor.element.classList.add('locked');
   
   const controls = editor.element.querySelectorAll('.window-control:not(.close-control), .theme-toggle');
   controls.forEach(control => control.classList.add('disabled'));
   
   editor.element.querySelector('.title-bar').style.cursor = 'default';
   editor.element.style.resize = 'none';
  }

  unlockEditor(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   
   editor.isLocked = false;
   editor.element.classList.remove('locked');
   
   const controls = editor.element.querySelectorAll('.window-control, .theme-toggle');
   controls.forEach(control => control.classList.remove('disabled'));
   
   editor.element.querySelector('.title-bar').style.cursor = 'move';
   if (!editor.isMaximized) editor.element.style.resize = 'both';
  }

  getLockState(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   return editor.isLocked;
  }

  getInfo() {
   return {
    id: 'TextEditor',
    blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGZvcmVpZ25PYmplY3QgeD0iMCIgeT0iLTQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1MiI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImJhY2tkcm9wLWZpbHRlcjpibHVyKDJweCk7Y2xpcC1wYXRoOnVybCgjYmdibHVyXzBfMzZfOV9jbGlwX3BhdGgpO2hlaWdodDoxMDAlO3dpZHRoOjEwMCUiPjwvZGl2PjwvZm9yZWlnbk9iamVjdD48ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9kXzM2XzkpIiBkYXRhLWZpZ21hLWJnLWJsdXItcmFkaXVzPSI0Ij4KPHJlY3QgeD0iNCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Q5RDlEOSIgZmlsbC1vcGFjaXR5PSIwLjEiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgo8cmVjdCB4PSI0LjUiIHk9IjAuNSIgd2lkdGg9IjM5IiBoZWlnaHQ9IjM5IiByeD0iNy41IiBzdHJva2U9IndoaXRlIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KPC9nPgo8cmVjdCB4PSIxNS41IiB5PSI5LjUiIHdpZHRoPSIxNyIgaGVpZ2h0PSIyMiIgZmlsbD0iI0Q5RDlEOSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8bGluZSB4MT0iMTgiIHkxPSIxMi41IiB4Mj0iMjYiIHkyPSIxMi41IiBzdHJva2U9ImJsYWNrIi8+CjxsaW5lIHgxPSIxOCIgeTE9IjI4LjUiIHgyPSIyNiIgeTI9IjI4LjUiIHN0cm9rZT0iYmxhY2siLz4KPGxpbmUgeDE9IjE4IiB5MT0iMTYuNSIgeDI9IjI4IiB5Mj0iMTYuNSIgc3Ryb2tlPSJibGFjayIvPgo8bGluZSB4MT0iMTgiIHkxPSIyMi41IiB4Mj0iMjQiIHkyPSIyMi41IiBzdHJva2U9ImJsYWNrIi8+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMzZfOSIgeD0iMCIgeT0iLTQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI1MiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSI0Ii8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMzZfOSIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18zNl85IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8Y2xpcFBhdGggaWQ9ImJnYmx1cl8wXzM2XzlfY2xpcF9wYXRoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDQpIj48cmVjdCB4PSI0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4Ii8+CjwvY2xpcFBhdGg+PC9kZWZzPgo8L3N2Zz4K',
    menuIconURI: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gApSlBHIGNyb3BwZWQgd2l0aCBodHRwczovL2V6Z2lmLmNvbS9jcm9w/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgAnACcAwEiAAIRAQMRAf/EAB8AAAICAgMBAQEAAAAAAAAAAAQJAwoACAIGBwsBBf/EAEsQAAECBAUBBAcDBwkHBQEAAAECEQMEBSEABgcSMUEICRNRFCIzYXGBshUXMgoWGSMnUpEaJCUmN0JyofA0NkOxwdHhRUZHVFeS/8QAHQEAAQQDAQEAAAAAAAAAAAAABwACAwgBBAYJBf/EAE4RAAECAwUFAwcHCAUNAAAAAAECEQMEIQAFEjFBBgdRYXETgZEIFBUYIqHwIyQyVWKxwRclQkNEUrPRFjOClPEmNDU2RVNWY2Rzk6LS/9oADAMBAAIRAxEAPwC/uo7QT5Yh8cfun+Ixzi+zV8vqGA8KysT44/dP8cYYwQdu0uOh94f/AMPcO4BOBFxEQkKUoi25rhy1/MqBAa9xzbnHg+du0ZpzkeqRaLUapNzdWlztm5SjU+NVFSC2JTCnFwVIgwIxS26B4hiw3SYkNG++5JyE5eETsZKWizMQByiEhSyBxISDT41FvlXtfd03FLiaveflpCApWBMSZiphpUrgnEQ55C38Xtadr3RzsY6Tzur2stXnZOjIn5ah0Kh0aUTU8zZuzLPQ40WRy9lymGJBTN1CPBlpmaixZiZlKfISMrMz1RnJWVgqiYWP2Xe/u7NPaE1Xo2k+acjZ60VqOb6zL0DJOYs3zeX6xlas1ifmPR6VSatU6DNxVZYqFWiqhS1PVU4C6XFnYqJKLU4UeJLiOtD8oS1noeqkh2UZTLMzWPQKZUNYZqoSlRkY9PgRZtVPyXKyc0IEVakRo8GFEm4KIgdcKHGiJsIqhithITkxJzsnPSkZcrNyk7T5qWmIS1Q40vMSs/KzEGYhRUOqHFgRoaYsKIg70REhSLhJJ62U3SSN5bKzE/eyJyBe0UTPm6MRhdgYQPZjsjRfaEAnEHZXstR6ebwfKNva6NvpS7dmpm7pnZuCqUTNRQlMUTQjlHbHt84YhgkDAzEEl8h9VLx0qDpe/B6t5sxHxchr9bHWLta9r3R3sY6Sz2rustVnZOjIn5ah0KiUaT+1MzZuzLPQ40aRy9lyl+LATNVCNLy0zORoszMSlPp8hKzM/UZyVlIC4mOj0jti6YQaTTYc1EzTEm4VOkEzET83JuMYkb0GAqLFVE8UGKYiytallipSlFzZRrl/lButuX9WZDspymV5us/Z9KqGsM1UpSo0+PT4EWci0/JctJzSYURa0xY0GEqbgpigboUOMtIUBFUgjrZvYG9ryv6Su+8ZCdlpGJMFMzHMFaGhpxKIxFLJKgkJfMOGrSxn2230bOXPsheV6XHfN2zt8wpRC5SUTGTEJjxChNUB8WDEVYdcLHjZm3Zc7+3s09oTVii6TZpyRnrRWpZwrMGg5IzDm+coFXytWaxOzAl6VSarU6FNRV5XqFXjLhStPNTl10uJOxUSMSpwZiJAEZ6aZhKk7gn/ADD/ACtdnvw1+oIx8qyQmpmTm5SblY0aXm5Oep83LR4K1IjwJiVqEpMQI8GIkhSIsCLBRFhLT60OJDQsbSlJx9HOldtHSuXpdOhTcbNkSZRTqcJhf5tzkXfHMlAMWIVle5RiRCpSlKAClKKrghR6jeNuzFxzckrZuUnZqXmYS+2hgLj9lEhqSlPtgFQERycKiagtQW4Lcvv8G0cjeiNu7zu6Rm5SNC81jKwS5mIcRKipIhhknsyAHDUIca29E7Wva90c7GGk07q7rNVZyToyKjK0Oh0SjSf2pmfNuZJ6HGjSOXst0sRYCJuox4EtMzcWJMzMpT6fIyszP1GclZWAqJhY/Zd7+7sz9oPVei6TZoyRnnRapZvrEvQck5hzfOUCsZWrFYn5j0el0mrVWgzkU5YqFWjKhS1OVU4C6bFnYqJKJUoUaJAEdYn5QRrrl3V+U7K0plSarRkKRUtYJupSlTp0xTYK5uLIZNlpGaRCiKKI8WFBXOS6VgFUKHGWkECKpIreSM1HkZuUnZWMuXmpKcp87LR4K1Q40vMylQlpmBMQYqS8ONBiQkRISwreiIlBSxFvu7KbpZG8tlpievdE5AveKJgy8N1QzA7JxD+SIAiYyASFAn2gzCtuU3geUbe107fSt27NTN3TWzcJcqmaiYURhNCNhMZXbVMMQwSE4Wqmrgtb6qIjguQ5SbpPwtztYOWDFyCb9MaydrPteaPdjLSad1d1lqs5J0ZNQlaJQ6JRpMVPM+bsxz0ONGkcvZapXiwEzdQjQJaanIsWZmJWQkJGVmp6oTktKwFxMeYUntvaSQKVTUTkxm6JMw6bTRMRPzYnInix1SUuYqzEMVPiKiRFKWtQuVqJBLblV1vygLXrLOssl2WJTKMzXjTqPUdX5qqSlUpszTIESbjSOTJWQmkwoq1pmI8KEqdl0xAd0GFHWCR4xTgd7ObAXteV/wAld94yE9LSK5gpmY/YrQBCQFKLKIZOPCEgnLFSxm2231bN3RsfeN63DfV2zt8w5RK5SUEZKyY8QoS5RmoQyoqwgj6LGlmg9l7v7uzR2hNWKLpLmjJGetFqlnCswKBknMObpvL9XyvWKvPRxL0qlVeqUGbinK9Qq8dcKVppqUGJTIs9FhyMSpwpiLAEZ6njJKQWdKg9jzctd+Q1xyC4IDEY+VZITkzIzkpNykWLLTUnOU+blpmAsojwJmUqErMQY8GIllIiwIkJMWCsXRESFJO4A4+jDRu3To3BptMgz0zm9Uwmn01MzHXlSoRAY5lZfxY64gW8QLXuiLUlPrKUVjeDfqd4u7L0JNSStm5SdmpeYhRO2hpSuY7KJDKQCVgEjtAVFjSlC1bcJuW39jaSSvOHt3el2SM5LR4QlIysEr5xDihTpwUSTDKQMQZwQ/E75eOP3T/EYzxx+6f4jHQMk6g5W1CocpmDKVWkq1SptUREOak1L9SNCI8eWmIK0ojSk1L7gmNKzMOHGgkp3I2qQpXdgXuMBiLBiwIi4MaGuFFhkpXDWkpWlQoQpJqCDQjQ2tLKzctPS8Kak48KZl4yQuFGhLC4a0KqFJUlwQRlYtMUKUEgEO/+QJxLgOF7RPz+k4MxHbZtHF9mr5fUMB4Mi+zV8vqGA/8AX+ucKyt0/N1SiU+nTEWGQFwoUWKksTtUhJUkkkjafVDggpNuhJwkWoT8acnJqdm4q5iZmpqbmI8WISqJGjx5iLFixVKJO5S1rUpRJ3OS/VOHOaiqUilzmwncZeOD+8R4a1cW9UhwHO07iLhyEjR4w3L9Y38QtcWK1DgbhwbAkFhZy5Jy3NwkqiXrEKEkpEIJWzqAOJwO8BmtULypY0RMHZyGFKCCqZUQFKCVH2A+EEAkA0OY420W7fXZjzF2ktPstRsjR5L8/dOqpVqlRaZU5yHISWYKZXpSWl61RU1CM0tT6n4lPkJ2mRpnbJxosGNJzMeXTGRHSqHRfu7u0Bm3PtGlNScjz+nORpGqyU1mesZgnKUmanaXJzcKPNU3LsjIT89MVGfqSYapWXmSmXkZMRVTcxG2wkw4tjlcYn1nYdGYkhybuXcFg1yW3N5hlYS7JS7ADYGJuSQQm78Am3Hniw8CcjQYRgJCRDqQ+YJ1IGvh/Ok8eShTEZMdeLGCCQCWLFwdK6P9+Vp1xAgAIG1ISEpSVbtiEDw0QwpkmJshJSjcwKmJIdxjQ/t3dmjMPaNyDluJkePI/nzp/U6nUaPTanNokJLMFNrkrLQaxSBPRWl5ColdPkZumzE2EykaJBiSkxGlxGRHG8ESLfduAL+4AADge4W6+fV8CqjOokkMQSX5ZiOSbBz15HQ4ghLMCIIqPpguCQSx4sPd00zM8ZKIkNcJdUqSRq9aZ8QRU0OlbV29Gu7616zZnyjyuomSZ7TnJMhVJKZzLWa/OUsTM7S5SZhTEzT8uyMjOz0eoz1ShQ1SsCZUmDIygimbmIwTCTDXYgVEQhJ2hKUgBCEH1lJhpSlENAUR64QhKUhbOoDcb8DKWA7BAUSACNg/EDe1i4JvwC+A1xSpxuUkhR3biBYG5YFwABZx5E+WJo8yuYKe0A9kBm1bPTi1ba0vARLJUIWL2mdzUkBnr458DVq6V9ubs25g7RGRMtxclRpA51yBUqpUaNTqpMIp8nXqbW5WXg1mkpnory0lUPFkJGcpkzNFEtEiwosrMRZdMWHGSr7R/sB675qzvSZXUHJk9p7kuSqcnM5jq9dm6YmZnabKTcOPM07L0hITs7MVCdqMKGZWXmFJgyUsmIqajR2hJhrsFRI5LFJcl32kNtPXaxawuCEggk24AaoqUksEgtYhPV3H/wDJALpILMCCweeDNRYUNUNATgcsW/e4ZZAMLQR5WDFiJiKcqDZEZpLg658Gb32JVESAyU7UIAhw0Ag7YSEphwkhTOTDhhKN5bxCkrUHIGNIe252dK92gckZdiZLjSZzpkOpVOoUinVKZhSEpXaZWpWXgValpnojwJKoeJIyM1TY0ztlYsWFElJiLLJiw4o3MXHueWcuSq3IJsS7AcPw7Au+BlxVWsPwcJu1iLlR5N/w2ALFi7xoUYSwtJ9oEMWBxMSa9dW0FpIoEVKkKxYSAAHcDoDnQZNwNkEaSdg/W/NGdqTKZ/yfO5AybJ1GUmcxVauzVLRNTVMlJqHHmZCgSklOTsxPzlRRDVKwJgiDJyyYq5qNFAhohxH5rWEeqjchKUgJS+7YlCUphpKjdRhoSlIUWJKdxS5IA6loTuAA4IsGLcgqYEtZg4uEg3JOBokV1FlXDk3Hv4Hw5DP7hiWNMKjYcaUkAMAwZ/DofdwNoYMNEuCEFTku71DBqNSpT1c1azJu7/r07CndRKWZmJ6Buy1Pw5ZZKoSJyIipy0aYQkEhEWPLwIMOIzeImChwVJGGwQV74YLnzu4cnrxexPJPxLYTp2BogVmLUB1kJ9FywSSHG7xavYBiNvLgOE3YAvhw8pu8BB6bQCOLMC7MerA3D2IBBtT3eWhMPa68glKUhRhrZICXKkByQNSeNcrenm4WLEi7tLjVFWpakpjJBUXISmKpg50GljYXtE/P6TgzAcL2ifn9JwZjgbGS0cX2avl9QwH/AK/8/LBkX2avl9QwHhWVvM9R0j7InS4YS0di/BMFYDB3HA87mwsxRjMRrqHUKiWd/wDiqdupN3IZkggAnnDztRbUudAIB9HjJYsWJgxAHCmFyLkgbbgOQDhD0WOfEWTcJVFFyFJU0RQuSASXBJfzYc4O25lib2Szv2J5Uc55ZtS1O/KpJCNmiWIxTbaGvZ5ULu1XOlOFp1xm2gEXHBAfpYgtw7WLAm9jcNcVjZTs5CuGuA495ccdPdgdcVybgXLEgizXZ+S4YbmsG8ypcHay7ddR7PuoEnpzlnIVJzVUUUCm1+tVLMFbq1NkICK0uaNPkJCVo0P0mPMQoMr487MzUdMBPjw4MvCiLESIk+w4S4isMNLk6P0+KZcK2plFmUQk4lnCnLUlzwbg/wCGdmOrisoMoksUmzgOxDNb1U2HKgH87hRIxBLOXPVRsD+EMAXf/NuQ10kL71jUIsoaNaem/XNOeLtbpFTYnyN345xF+lU1Ccn7m9PATY/1ozw9ndz4xPXr7/fjbF3zVD2YL6YgKHWrFqueQPA20jeMs4GMsGcnxyoQC5o4rm4s7Bca/Nh1PmbkAPYMx4HJ9xwKuO/BZySSGIc2+BL+VgLXL4Sse9Rz8RfR3T4H9785s7m5DBz44JYsOGIDG2IT3pmoFv2P6fbeLZmzqwbk+1sQTwVOw6C+Hpu+ZA/q2oCXI06D38Q9amzTeMuHGMMeKas/UZ5d1bOlXGH79ySR1/FfnkgkqdrsSPPAaotiX62JuDcOQwLMHbgdC1sJiPei6gKIfSDT42POZc7jmwAPjckl02YMXsGMf6UPPtyNIcg7msU5lzsQCLM3jcuQTw5AbkgISUwAAEUzLnV8vA56VzY2Z55AH6XSjcGetM27jZzCom25Id3CQUlRHPrJd2YhnZ/IkEpGXFs4UBZiNzOCCGJuDYMwLl/JwE3K7z7PpcfdHkAEkB/zkzrZj+JjFBv7iWAFyLiH9JvnxRIGkeQnU1hmPOaRwzgGMoN1uOru4GM+Zx6MjRy9G5e/77MM9CqAtnamvXTj/KtnFxIjOXPAAN2O48cAe4XLHgnjAa45Ie5CVBgXVckqSA4YN63PJDi+PKtHtTpXWLTTK2o0nTI9Hh5ilJsxaZHjomlU+fplSnKTUpaHMpTDTNS6J6SjmWmPDgrjSyoK4kGHFK0j0RayOVjgEjjcG4FyR72NmN7MYxCKVEKzD06PmPh+Ya0uJKmILuARzBq465+BYWYr3fpfMeoSipkmTyu4FwXi1exB4BZybjzH4jhyMmGgIF3IBIJch/mS3QXYMwZmwmfu91b8yajgFgJTKj+q5CfFrJazJZ02NiQTyC+HMSQaXS9rJNyS7joCHe7kk+4l2xUPeeP8r7wqDSEKOP0AdRzHH8LenHk/13Y3GSakzH8ZXx3WOhe0T8/pODMBwvaJ+f0nBmB7Y02ji+zV8vqGA8GRfZq+X1DAeFZW8y1GINJnElJ/2SMbkkJJgxALm24/iKUlQBL8nCDJiMTEWCkABax1H/EiG7vwbgMluqi74flqM/2VOEgMJWP1SbCFFIIY2Ab1nukG7hgK/UeITEWC49eIrn92MtRL2HUgsC7sxcDB63L19LCj/JaZ5+/NulqceVYpkbNCrAzWoavZ9OWZ0tKuMX3AkkFTEAi1hf5i4DG4ucLl7VvYdqPaB1BldRMtagUrKlRXl+n0KtU7MFGq1TkpgUdU0KfP02Yo6zMS8ZctNKl52WmoK4ERUCFHgRYa1RYa2ERIrFklNyzh+Wsx5U544HIbAkSKQo3AIJcWPW4Dkgg/E3c8l8WAhqMJQWgsoUHBuJGpOpplalsVKYqcKgCl3ANau79eNeNkuq7rXUJKVNrBp4QCWJy3ncbgD0eC6Pgoi4AcDEf6LrUEc6wafbhZjlnO5ACrlj4QZm+bOSGIw5tUQfhYBn4fc44bjkguSCXcc8CrjDopISDZJI67gADzuBuOoIII5xsGbmdYhBdz7Iy7wT1ZteNNXzKB+7keL8OdculTSyaz3X2fg23WDT8pPJGWc7Fy7Bh4QIa55DBk3bHA92Fn5I/tgyCCzucuZ1ADFjbwg/DWv19+HFqigk3excXsH49Ujjkl3ADucDLjMXf/ALizu9rOXZhZma4KE3MUGM6VOrkZBg/i2bVNIzKwQwwZa8a97ijWTwrux8/JKgdX8hcixy3nR7EszpISr+BuxtgdXdmZ7Sog6u5DL3cZczp+G9yNgYuGsA7u4F8ODXFcOFBL9LC77iT5El/i/XnAhiAFiprklQ9ZV7j1XF/N/PoMSedTAJZfJlPxGndqM3NaWaZWAc0BhXXhnzyy6nWyg1d2jnsH+1rIhULADLmcmDgk+t4Sr8XsCCLg2xw/Rq56BG7VnIrM9suZyPVmvDRdxYFQcdQS+G7LihJFwQ5d79CLEFzcO4Cvgz4FiRQXCj8GF3IsGdrdD+LrzbD/ADqMzYgzMzCg1+7pU2YYED9FDaZCo73I406W850d06lNHtM8p6cyVSi1dGXJWbExVY8D0dU/UKnUZur1KYRLhUUS0qqeno6ZOWUuKqBKohw4kWIsrUfQYkUkctch/VIYluSBybHz6Nd4IsVkkkuyg7lz6rEn1ibgN8nAHLjqjsNyiGLcgFrluGIBYOeGLkPzrqJUSSxJNevLj8V4vJAA4JDADTTXrXwysybu7YhVmXUk7juTKZRJ4LAxq0k8WZgw6gkEMFAF0kkpQl0dHAIu7ukXI/CDc3Ac9ecJS7uWKVZl1NB9b+aZOLKcJAVFrRUBtY2AsliLMSfw4dbJuJeGCSW6ku5UAov0fowsGLdcVA3nv/S68Hy+Tb/xo/Fx3W9PPJ8JO7G4ydTMUbL5Zf4NY2F7RPz/AORwZgOF7RPz+k4MwPbG20cX2avl9QwH8MGRfZq+X1DAeFZW8x1HSTSJ4Ap/2aMbguCmEssq49UKUWuLFg3IrzRoyt63J/HFBFgWMWIR8HuLlulnGLDeo5H2TPAkK/m0Z7gG0JZBdNwVOz7rbXLFNq6szFPirKVXC4rfve0WS3m3F7gBnZsHvcox9LliGMHPUHFmO7iLU08q4+zs2ADnNVblDNBq3xnbmuLy4IBYJL24dyxIBIPucj5YXv2pO23N6DZ8lNP8vZCpubKhDoNOrdYqNdrNTpknLpq6pkyEhIwKPD9Jjx0QZYzE3MTEVMEeNCgwISlCLETvuqILh2sSFOXJcWBvwGDMNpIAIscL27UfYvqOu+fpPP8AlzPNJyvProUhQ6xIZgpNVqMpHNI9ITITdPj0hS48Ba4EwZeblpmCqCpcCFMQYqFqjQzYSWTCUs9sPZA8S/3a/dW1KZhUTCRBIxumvDN35deY6a8HvQs8Fn0fyJ0sM05yIs3mQSfeQT73fEMTvPs8LJI0fyIm6SwzXnOxu7OVAA7uLP1ezCDuzs+gAnVnIJLOWy9nVhfgPAa/IJCQxYJs+If0aefh/wDLGQDZ/wDd/OwctwHlwX8nYfvW53vmBYFJY6EEjSpFfHq9tEmdappriqKcC/iaMOtjT3nWeCSfugyIxdmzRnFw4v1u5JdyXBI6WiPeZZ1LPpHkUG5b85s4M3l1PFj0e/WwZ7tfPyedVcgswuKFnI8jkp8Av/3Nh0xGe7cz6m6tVcgjn/0DOQcFr7jA4clnSOoSABiUmSyo4arkg0Apy5F9dLNxTY1FCzVJcN7jxHPlY1XeYZ1UGOkeR7G39Z83KYC1i4fizgEgjriI95XnQv8AslyR1Fsy5uJYggE3f1X8y4ZwAMBnu4M+AkK1SyGW5agZw2nqB7AFym7WsR84v0cme03+9LIfDFqDnHi9vYgnqA1rlLg2OPmdcjpro1R7vh2bimjmR3g9KNyf787GK7yXOpSN2k+SeDY5kzgAVcDcEkOOpBIB5tiI95DnNan+6jJIuAf6y5tDuSm4LhrnaS9+t7iRO7pz0kN96ORGJdSVULOAIYlreCoOBuLOT8A5A47vDO4I/abkcB3UBQM4KuGZLKgI5J6qS3qsXvjIEmQ7aseOQ40p1cvZhVMDUe9n4GpZ9PxysyfSbUyS1Y04yxqFJU6NSYeYJWZVEpceKiZiyM/T5+apdTloc0mHDTNy8OckoxlpjwoS40uuHEiQ4aytA71EmXBAUVB1eqR5Ox4d7kkEWsygGGPLNJshS2k+nGWdP5OoRaqnL0vOCPU48MS6p6oVKfmqtUpmFLb1+jSqpycjolJdUSKuBKiChcSJEClHvK45L3V/euXAA3OR7wRyAwPmSL6WBOJ80vQOaj4ZjnnaUrUAMRrQkAvn+7358A4s0Hu3FBWZNTywLSeTTuJJYGYroSzORYG/4gTc4drJAiWhg9AG4HQOCzuxe4Z7Hzwj/u0VbsxapklJaTyYASl/xRq6CwDB+pJHqlIZvVOHgyaVeAhRsNqRtAsLAAuAzkfxYm5xT3eiG2vvEf8Ab/hot6h+T0Sd11xEsSTMcv1yq65jKx0L2ifn9JwZgOF7RPz+k4MwPLG60cX2avl9QwH8n/1z8uf++DIvs1fL6hgRw3F/Nzb5YVlbzPUQj7LnCxCvRpgM5VYQYh3A3AZnIZSfJhiuDMRf1kUFRT+umPWCrn9dEBBIDXDPaxcMBcWPNRX+ypwMq8tMAJSCdw8BQ2sl/wAdgxfi6TxitbMxGXFO4k+LHDWBI8aIXPmSGcDlrF3wftygCje+haC564jk+dG9/SmPlYk4dmQHDKmqvm6YZZuVOvdaaJGAJIIIYf4i4a5vew93PkCA1xWcO4Fveej7S1zyQff54gMVRLHi3mSD8AwHxs13wvntD9t2c0c1JqGneXsg03MsxQpGmRq1VK5WarTYXptXp8tVYEtTYFLgqVEgy8jNypjzUxEHiTURcKDCTDglcSwiISlKwoS5wg00HPXWtOdqVLWiGHUWc9Xc8Bq7552YKqL+LdcWBvucH8IIIIHQPf4jjAy4zH93m7tt6PbkEtwQASQ5HKjVd5RnBQY6R5LBHBGac2XBueYbK8iz9Cz8Qq7yTOCiQdJsmgBgr+tWa7O5BAEMg3Te5+APMwlY2WAvp7mYvUnnzzNtdUzDJACzUZcc6e8ZcrNrXGJLkg25DFy4seGJdy9/Ms+BYkUOHIbcHDdE8DcQQync3N+eBhTSu8fziSydJcm+smzZozWslupCktYlzx8WOI1d49nEsfumyWklzbNGauSC5coZ3IHBF+CQDheaxv3finL4Y8nYY8IFsT5PkGfqdDnrQ9zYVRQkOq7+sQVBI8m+F3AYuHNucCxY4HQP/dPICQX4a4Zg4YWfnCoVd4vm5x+ynKCmf/3TmmwJHI8NibB/fZziBXeJ5uUC2lWUASX/AN6M0l7OC4S9m6EOATbDxJxWBIFTkC/DOobrytGY4fP3ig8a+73WavGmAVEOkgFQCwfKwtyAbEMXDkEkEJIC4p4SXUkOCVMRd7OXUok/4nu/mrNfeF5uLn7rMoDhyMz5oLKa21KkMQCQb+QdzfEP6QfNi2/ZdlFJBItmXNFi5IJcEXDW62PIw/zeKKAAVrwPflw6NaNUUMw7y6dacf8ADxs0VUU3c9WLkgjl7Hpdi/X33wMuKQ/xJYWaxsH6M/ubHnGmGoUrqhkHLme5OQj0yFXZaYK6bMRUx1yU5T52Ypk/LJmEJQJmDDnJSMZeP4cJUWWMJa4cNZKB3WJGN0kgJcsDzyH2+9nD9B0xEQQSDmPv6/H8oysM7mrFtT3Poe5qa2ah3ZS9+Y9VBcH0PJVzZSQqPXg4YAOdz8Gzu6bB5cp7BH4uAL/4QbdGv0wizuwCFZk1XAcfzTI7OXYiNmAuGci4cizuBe+HqSY/UQyry6Ah7G9htF7M7WFucU53o/643l0g/wANNvUryeDi3W3Ccv6+hzHyqrGQvaJ+f0nBmA4XtE/P6TgzA8scLRxfZqf3f8x8cC+r0f5sxwVF9mr5fUMB4VlbzPUV/sqdO4gCVjuCyWIgrNiALq4HAuHxWdmI4K44Y+3mCVKBT/xoiCBwS4YXcEBwb3sw6il6VNJYECXmHB5YwYhLOzuSS92faGZjWLjxfXWpwf18wWsT/tKwSDdwpjYFupfFgdyIL3xkzQSHOrqejVoOnfQ0t8rQlKdmWzUqa0NGEMZ5dzWmiR+nIJJboxcDkuLHklwQznnC8+0N2LavrDqTUdRMt55o1Di1ySpUKr0zMFLq84iHO0inS1JgTFOmKOIqjLzMhKS5jwJqEFwZmHFXBixYUXbB35WvqRy5cJI2uLpIYlyerOS9ucDLigEAvuZJLq4ATdmU4BABCfIMbgvYJC1QziSWOT8RT8Rak0QJUPbD1cAcXcO9GbMZUysphfdzZ+SAPvPyEQmzmiZwABP+GWIc3YEgjo+ID3defUuPvNyE4sHoucAkhQ6ASxc8XKuXfyDY40zyAAxAZVibAF3fqevVsARI7Bix2ncAkAXNj7nLOxceZs2NlMxGIcqFeXjrr8cLa/ZwwSyddQH6UJp99XFlSRO7wz2Nv7TcjvZ/6GzeA3F90mWD23bXADesTiJfd7Z5QWGpORCeCn7Ize6epsmT4AJJLXuScNRix2L7uU7SeCOAWLluGbzuwLYFXFAdiPcQ6XBbpZRZh8D7mdxmIxAGIMPsuc61d62jMNCeL9NPd3140qbK0V3fOd0G+pORuvFGzcXY9AZQh3PPny44jX3f2dwf7SMj3SQf6HzaNpuW2+huHHBFveS+GjKis5DB+SeD1sD16szdBzgRcVjbaxYkAuryYg3DgFTkHoAbHC84jaqFPst41r3/AI2jUEgkmlXAHLTnz+HWCrsCZ1FhqPklruTSc2AuCGsZT1Xd3di19psYT2Cc6If9ouSiAz7aTmoksoMQFSiR8DuA6OAThna4zBQCh6wuGs4Fhx6rMxYm2A4kV7gi7ksOLAWBsCWFiG/i+HIjxuIIdqgU9/fwcm0ZZ6AjhXn45fBt0jSzI0vphp/l3I0vUIlVTQ5eb8aoRISYBm56pT8zUqjGgy4iRDLy5m5uMJWAYkRcOXRCTEiKWVnHdlxSLGzPz1S7nzPT3dB1fAy4x5LDbdlG9iTdrdLtcfFsCRYwO7aobVbiQos4DsAQASQTYhi7sOmG4aqKqlR4ZdM27srNJYP/AIffrlZsfddLSrMurQYhPoeRgbMT+uzAUlyoMAQSBy4YAscPdkm9Hh2U3W452gj3Pcva1+vKGO6viE5k1dfaoCSyIkcuy42YkpcO11uSAASW6kgvmlH8CG9/VBBPIYMR0/5DqSA+Kbb0w22V5MdIQ8ISf529T/J1L7rLhPHtzw/WF/fY+Ft3pbc9+Wbg4KwHC9on5/ScGYHVjlaOL7NXy+oYD+ODIvs1fL6hgPCsreZ6ipC6XOBwGlo4JKrt4C22t1CtrEgDcDtJF8Veo0ZosYrUwEeYcEJQQfHiAAi4BKnAAF+SOgtS5qp/p0nGhAbjEhqSLOoFQUEgAJZQcA7SGLMGD4RBqh2VK3DzHU6hlacgwJOem5qbVT5yVjrhyi4sZcRaJKPL7yZdSypUOFGRuhEmGiIpDbS7uq2nuq4Zifg3pHEuiZRDMKKpJKApBqkkOxL0pUtasvlF7v8AaTbKRuaZ2dlPP4shEjJjSyVJTEwxgkBacTOxSNRbStcdiCAALkOHDObdApruSATtYeq7AxI4JPQ8hQtdgQocsCALEnk9L42HidmfUIOlUxS2sPYVEgqIcKUUpY+qSWsQ5BHTA0Tswagl/wCd05Q8zK1IcdR6jnyJPmLtg4p3h7Hk+1e8Hn7K2Ltl7P2u7Pg1RPyG7z/+GJtyf34ZfLTGKsT4i2ucaOSzeqSD72Pl0+Hw8iScBKjEA+tcg9WDklzYm4HUlyOQGxsersvagF0+lU1yWChL1Lm5U48O4SDcg2sGV0gV2XNQrpE3SypLEAS1SUlTsxbwgeD1YJLXucO/KLseGAviBkD9GJSo+zz76M72YrcZvPo2zM2KCgXDDDj9PKtONLa2rijkMQXJBUQA4YM/B94dm4DYEUtrEtcFz1DAsUsblmIO34dDsorss6gm3plNHBf0eplI3ACx2uSS4YDgA3u0ETssagnifo4bbuaWqgv13fqzcEgFjfoouSUd42x4YemIDkCmGJq2Xs8+VbRq3Gb0dNl5wl2BxQyGdn+m/dzHG2tK4m0ncS7ksNpYq4Jc/hDuW2sPngaJG9UkFjYA8nrdrPe7+QCSrGzC+ytqEWeeo7lJLCWqd3LAg7FWPqghnHDcHAq+ynqIben0cEliFS1WSeTdvDKAQQ1rAgHhhhyN4uxyiMV8wAODLdwASPo0zozk8LRK3Fb0jnsvNkA6KhNp9vQ8++ttaFxgST+ECx4Lm4YJ+BuxsSLhwSDEjMGJcupL2NyS1m5HzIZN7NjZ9fZP1DLtUqPYl2laqbl/cDc+XxLO5FX2S9RTYVGjFnJ/mdVN72PqukWtZvNrnEn5R9jgzXxAbSi+XBHPOmh1s07id6dG2WnMw4xQq/8Avo9OvcdX1xgSwAFmYjlyXBKrkNa/BY8sSGuOmxsztw20DkE3DFgARY3PNjtGrsk6isT9qUZjtJCZSrMXdnHhE3YA7kg7gzuHH7C7IGo0aIEmrUVCVKQCoyVVOwH1fWRtQLAlk7gFfvBtxR3k7HAE+mIJA+yvl9nn7rRp3C701ED+i02HIDlcIAZV+m2vLTiLbgd1RuXmTWFTvD9DyGkkDkmLmMKAUCASE3LOQSzMoEPwlGMvDuCdoch/IWYsQ3va7/ErO7CGhMrpJRMxywjrnapU5mkzlWqUSCISpqMmHNQ4EGEhG9MKSk070S8HxVr3xYsWKtUSIohm0FOyElPuBLgggkAsXSCSOCzAm4frVjbm+Za/dpbwvCTJVLRFpTCWQRiShCU4q8cNvRjc/sveOyGwNyXJeqQiel4S1x4YL9mqKsrwEihKQoAkUdxYiF7RPz+k4MwHC9on5/ScGY5CxPtHF9mr5fUMB4Mi+zV8vqGA8KysHUYggSE5MqQYno8tMRxCBSkRDCl4sXZuV6qNxRsdTBO4q6Y0S0S1N0+7SmmOV9VtNalKV+h5lp8ONMy1PiJnKhl6sIUYNWy3XpSXSubpdYok6mNJzknPQJeOdgmEIVAjQ1q3nrIJpFUSkElVOnwAHckyccBmcvfoHx81OXms3ZYqFXiZRzbnHJkednp4VBeUc05jyrFnfBqE4mCKicuVOlxJxUJJ2wVTJjGE5SjYLYEG9HegjdrGueLMSRnZW8VTEKIlKghaFQggpUCQR+kaHuIsVt2m7WLvFTfMGWnUyc1dqJaLDUtBXDWmKYqVBSQpJBGEEEPwYO9voIHIpN/s2eLnlNPnQOrEH0Y7SQ3S5YkqIJxArIpIO2mThJ27d1OnOjAAASwYEkbncEfi6v8AP+Oe9anY62612cn9rup/Uhm/ra3q8sbqFgpg2P38/NagCPvr1rCgAp/vf1QsS46ZsF2JsXLl3LPgZ+tLcND6Fmy7O8eHq32H1fQtYl+rDtB9eyX92jf/AH7xTwtf8VkRjemzgbzps4xIYAP6M3BZ+GJvcYhVkNiVCmTwADgimzrguAbCXbcxB5ZgSbgYoEnPetHA1r1qLksFav6nfhsXSo5uIc3dJUS1iwdsOfda2Kvvr1r3n93V/U9IfytmvpyGIdiAHUML1pLhFTcs0Q4A+XhgHL7AZ8gA555G2PVh2gp+e5PM/s8TT+3z56Na/irIqkpIFLngfMU6cBsALky7mwF+Sw9+I1ZFUPw0uf23ACqfOnaHuw9G6Dgmx/u2viggM+a0gMda9ay5S+3V7U64vZSfztCTuuzhwSXLgYz8/NZxxrVrWLMCNXtT3UUgBlEZsAYjkqDl3a5JwPKkuKr3NM6/tCOWTIZ+8jKzvVhv5w99yYGbmXi1f+09K6A1ztfpORFEMKXPEAOGps8rcS6iABK2YNccGzdRAcibWemVB3Ln7Mny7tcAyxLEhyWAa55xQcGfNaQSPvr1qsokNq5qcRt4IvmxiGu/IA/C5SMck551ndROtetSgQ/9rmqBLAEbwfzsDByOWJckgOAMDypbhp+ZJkh9Y6OX2QQBo2XdZx8mG/XP57lCBU/N4gIqATnXp1YC198ZEWllfZU+CCNgFOnfOxCRKsljz5u/GIVZEiMAKTP8bSRTZ0BhZ3Ms73ueS7lRe1CY581nA9bWnWpwAbauamFSbPcHNaiSmwcWIBDcHHE571mcH76daXN2+9zU4ouef96yLNdm6C4OF60txsHuWZOg+cIbPiE+NNe+zR5MN+GpvuUJDfs8SmR4u4HDiRnW19VWRYg/DTKgLjcBTJ1yxuCPRn2j8RF3WHBL4/E5JXCv9lz4Z1FSqbPIAF1DaVSzAJAckuCbFmJxQrOe9ZmH7ataSpBLvq7qaQlgHJAzY4uzEBwCbghxIjO2sMV4cbWLWONCiOhcKNqvqPFhxUkHfDiwoualIWhaXSpMRKkqTZQU5dq/KmuMJVhuSZxBIwgx0CrBv0RQ6jJqWkT5MN9KUAb7lmJAPzeI9WehNdaNxD5Wvv8AZ31hyDmrWHWDRvKtSk63mDSzLOn9ZztMUyclpySoVUzfUM1QJHLM5GlokSGK9KyNCVUanJgmLToU/JQJsQpmKqEjdUDy6Yq7fk61PVJZj7WCglR8akaOqiR1lUQxoxnc+RIq40ZT+LHWYhiRVqKoilK3rKiXNoosWYAN5P5e/wD6fxOD5sBtMva/ZeQv+JBEBU+Y6xBH6tKYy0IBJqo4EpL87AbbjZtGyW0t4XAiMY/o8wYaopDY1qgQoiyA5YYlkAPp3nnC9on5/ScGYDhe0T8/pODMdnbkrcVp3JKXZ2/yIOIPAP7w/gcE4zCsrCKl3SQpQY2P8bC7i5YFwR5g8Yrj9qHuIp7PeqGZM99n3VHK+TcvZvrM9mCfyJnijVeYk8uVSpzEScqULLVYoKlzMajTE5GizMrTKjJmJTfFXLwp6NLpgQ4NkPGY5Ha7YfZ3beThSO0MiJuFAidrBUFKhxYS9ShaCFBxQh2LBwWDdRsrtltDsZOxJ/Z6fXIx40PsozJREhxUAukRIcRKkKwkkpJDpcsQCQalP8n87SQDHWnRMgdRTM+khgGLei2+R99nfHAfk/PaSAb769FbDn7Lz8+4NtIeVe13cHoxZ8W2cZgbernuxH+zJrIgNPTAZ9fp/DDmCQvWC3oOT6chOdfMJPRv+Ty77VKf5P12kixOtWihe7imZ9BFyf8A6zEKFmIIY3Tzj9H5P32kP7utWifu/ovPjAtdgJZuvzs4YAYtq4zGfVz3Y/Vc1TL57HYdBibpwpws71g96H13BrmPMJNv4Xw5tUpP5P12kP8A9p0UtuIP2Zn3khuBKmwHmAxAN8YfyfvtI7QPvp0VO3g/ZWfOOLASrE3DuACA4IIGLa2MwvVz3YuT6KmKgD/PI7aaY9W99l6we9Cn58hU/wCgk+IP+65e82qVfyfvtIPbWrRRL2IFMz4AWa7ejEva+3zNhxjj/J+u0jYDWnRTdd1fZeff8/5r7z7w+La+Mxj1ct2H1VM6O07HyH9vr42x6we9D67g/wBwlOWfyVcvfapSfyfvtJHjWrRRThi9Lz2GAIPqn0WxUxD8Meosc/k/faQFxrToqoXb+i89sfe3o3PuAIHT3W1sZjPq57sG/wBFTOb1nY5yb7WXL+Vc+sHvQ+u4P9wlH8ey8eNqk6/yfrtJEJ/bRonYAKP2Xn0k9bASpJ9YBwVBJZyGGJoP5P32jTGh+NrZotDgFcNMWJBpGe4kZMLcgLXChqhQ0xIiUb/DhriQ0rUQgrSklWLaWMxkeTpuxBB9FTBYuHnZhno7ssUpl3O1mHygN55BHpuEBXKRlAQ7ZHsuT20W7CXYcyZ2IdLp/JlCrUfN2bs11SFX8/Z4nJKFTI1eqcCURIyElIUyBFmE0vL9FlErgUqnLmpuMmJHnZ2ampianIqk7weAf3h/A4Ia4Pl/1x+4MVz3RIXFd0rdV2QEy0jJwxCgQU5IQHPUkkkknM1sJbzvOevifmbzvKYXNTs5FVGmI8RsUSIrMlgABoEgAJACUgAACBEIpUFOCz/5gjE+MxmPp20Lf//Z',
    color1: '#007AFF',
    color2: '#005BB8',
    name: translate({ id: 'extensionName' }),
    
    blocks: [
     {
      opcode: 'setEditorText',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'setEditorText' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       TEXT: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorText_default' }) }
      }
     },
     {
      opcode: 'getEditorText',
      blockType: BlockType.REPORTER,
      text: translate({ id: 'getEditorText' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) }
      }
     },
     {
      opcode: 'getAllLines',
      blockType: BlockType.REPORTER,
      text: translate({ id: 'getAllLines' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) }
      }
     },
     {
      opcode: 'showEditor',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'showEditor' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       TITLE: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorTitle_default' }) },
       PLACEHOLDER: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorText_default' }) }
      }
     },
     {
      opcode: 'hideEditor',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'hideEditor' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) }
      }
     },
     {
      opcode: 'setTheme',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'setTheme' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       THEME: { type: ArgumentType.STRING, menu: 'themeMenu', defaultValue: 'light' }
      }
     },
     {
      opcode: 'getLineCount',
      blockType: BlockType.REPORTER,
      text: translate({ id: 'getLineCount' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) }
      }
     },
     {
      opcode: 'getLineText',
      blockType: BlockType.REPORTER,
      text: translate({ id: 'getLineText' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       LINE: { type: ArgumentType.NUMBER, defaultValue: 1 }
      }
     },
     {
      opcode: 'setEditorSize',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'setEditorSize' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       W: { type: ArgumentType.NUMBER, defaultValue: 600 },
       H: { type: ArgumentType.NUMBER, defaultValue: 450 }
      }
     },
     {
      opcode: 'setEditorPosition',
      blockType: BlockType.COMMAND,
      text: translate({ id: 'setEditorPosition' }),
      arguments: {
       ID: { type: ArgumentType.STRING, defaultValue: translate({ id: 'editorId_default' }) },
       X: { type: ArgumentType.NUMBER, defaultValue: 100 },
       Y: { type: ArgumentType.NUMBER, defaultValue: 100 }
      }
     }
    ],
    menus: {
     themeMenu: {
      items: [
       { text: translate({ id: 'theme_light' }), value: 'light' },
       { text: translate({ id: 'theme_dark' }), value: 'dark' }
      ]
     }
    }
   };
  }

  setEditorText(args) {
   const editorId = Cast.toString(args.ID);
   const text = Cast.toString(args.TEXT);
   const editor = this.getEditor(editorId);
   
   editor.textArea.value = text;
   
   const lines = text.split('\n');
   editor.lineNumberArea.innerHTML = '';
   
   for (let i = 1; i <= lines.length; i++) {
    const lineNum = document.createElement('div');
    lineNum.textContent = i;
    editor.lineNumberArea.appendChild(lineNum);
   }
  }

  getEditorText(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   return editor.textArea.value;
  }

  getAllLines(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   const lines = editor.textArea.value.split('\n');
   
   let result = "";
   for (let i = 0; i < lines.length; i++) {
    result += `第${i + 1}行: ${lines[i]}\n`;
   }
   
   return result;
  }

  showEditor(args) {
   const editorId = Cast.toString(args.ID);
   const title = Cast.toString(args.TITLE);
   const placeholder = Cast.toString(args.PLACEHOLDER);
   
   const editor = this.getEditor(editorId);
   
   editor.titleElement.textContent = title;
   editor.textArea.placeholder = placeholder;
   
   if (editor.isMinimized) {
    editor.element.style.height = editor.size.height + 'px';
    editor.textArea.style.display = 'flex';
    editor.lineNumberArea.style.display = 'block';
    editor.isMinimized = false;
   }
   
   editor.element.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${editor.size.width}px;
    height: ${editor.size.height}px;
    border-radius: 10px;
    z-index: 9999;
    display: block;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    resize: both;
   `;
   
   editor.isVisible = true;
   
   setTimeout(() => editor.textArea.focus(), 100);
   
   return editor;
  }

  hideEditor(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   
   editor.element.style.display = 'none';
   editor.isVisible = false;
  }

  setTheme(args) {
   const editorId = Cast.toString(args.ID);
   const theme = Cast.toString(args.THEME);
   
   const editor = this.getEditor(editorId);
   
   if (theme === 'dark') {
    this.setThemeToDark(editor);
   } else {
    this.setThemeToLight(editor);
   }
   
   editor.themeToggle.innerHTML = editor.theme === 'light' ? '🌙' : '☀️';
  }

  getLineCount(args) {
   const editorId = Cast.toString(args.ID);
   const editor = this.getEditor(editorId);
   return editor.textArea.value.split('\n').length;
  }

  getLineText(args) {
   const editorId = Cast.toString(args.ID);
   const lineNum = Cast.toNumber(args.LINE);
   const editor = this.getEditor(editorId);
   
   const lines = editor.textArea.value.split('\n');
   if (lineNum < 1 || lineNum > lines.length) return '';
   
   return lines[lineNum - 1];
  }
 }

 extensions.register(new AppleStyleTextEditor(runtime));
}(Scratch));