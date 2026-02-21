(function (Scratch) {
 'use strict';

 /**
  * 融合版：芸雁书城 + YYDJTC内容搜索(融合)
  * 功能完整版：包含搜索、目录解析、内容解析、统一内容接口
  * 新增：可拖动的内置弹窗面板，集成搜索、阅读小说、听书、看漫画、看短剧功能
  * 修复：内容大小超出底框问题，添加滚动条和高度限制
  * 所有原有代码完整保留，未做任何删减或简化
  */

 class YYDJTCAllInOneExtension {
   constructor(runtime) {
     this.runtime = runtime;

     // 原有实例数据存储
     this._instanceData = {
       searchKey: '',
       searchType: '3',
       offset: 0,
       lastResult: null,
       contentCache: [],
       currentTabType: '3',
       currentTabName: ''
     };

     // 原有目录解析缓存
     this._catalogData = {
       lastCatalogRaw: null,
       lastCatalogString: '',
       flatChapters: [],
       volumes: [],
       volumeNameList: [],
       allItemIds: [],
       lastParseError: ''
     };

     // 原有内容详细解析缓存
     this._contentDetailData = {
       lastMode: '',
       lastJsonString: '',
       lastJsonObj: null,
       lastParseError: '',
       novel: {
         content_raw: '', content_text: '', spans: [],
         pgc_voice_raw: '', pgc_voice_json: null, pgc_voice_json_string: ''
       },
       audio: { url: '' },
       comic: { images_raw: '', img_urls: [] },
       drama: { expire_time: '', video_id: '', video_url: '' }
     };

     // 新增：UI面板相关状态
     this._panelState = {
       isVisible: false,
       currentBookId: '',
       currentChapters: [],
       selectedChapterIndex: -1,
       currentTab: 'search'
     };

     // 创建UI面板
     this._createPanel();
   }

   static get EXTENSION_ID() {
     return 'yydjtcAllInOne';
   }
   static get BASE_URL() {
     return 'https://bk.yydjtc.cn';
   }

   static get SEARCH_TYPES() {
     return [
       { text: '小说', value: '3' },
       { text: '听书', value: '2' },
       { text: '漫画', value: '8' },
       { text: '短剧', value: '11' }
     ];
   }

   static get CONTENT_TYPE_MAP() {
     return { '2': '听书', '3': '小说', '8': '漫画', '11': '短剧' };
   }

   static get COMMON_FIELDS() {
     return [
       { text: '标题', value: 'title' },
       { text: '内容ID', value: 'id' },
       { text: '简介', value: 'intro' },
       { text: '播放量', value: 'play_count' },
       { text: '播放量文本', value: 'play_count_text' },
       { text: '评分', value: 'score' },
       { text: '分类', value: 'category' },
       { text: '标签', value: 'tags' },
       { text: '封面URL', value: 'cover_url' },
       { text: '连载状态', value: 'status' },
       { text: '自定义字段', value: 'custom' }
     ];
   }

   static get TYPE_SPECIFIC_FIELDS() {
     return {
       '2': [
         { text: '章节数', value: 'chapter_count' },
         { text: '收听量', value: 'listen_count' },
         { text: '主播', value: 'author' },
         { text: '音频封面', value: 'audio_cover' }
       ],
       '3': [
         { text: '作者', value: 'author' },
         { text: '字数', value: 'word_count' },
         { text: '书籍ID', value: 'book_id' }
       ],
       '11': [
         { text: '集数', value: 'episode_count' },
         { text: '时长(秒)', value: 'duration' },
         { text: '演员', value: 'actors' },
         { text: '版权', value: 'copyright' }
       ]
     };
   }

   // 创建UI面板
   _createPanel() {
     if (document.getElementById('yydjtc-panel')) return;

     const panel = document.createElement('div');
     panel.id = 'yydjtc-panel';
     panel.className = 'yydjtc-panel';
     panel.style.display = 'none';

     panel.innerHTML = `
       <div class="panel-header">
         <span class="panel-title">芸雁书城</span>
         <button class="panel-close">×</button>
       </div>
       <div class="panel-tabs">
         <button class="tab active" data-tab="search">搜索</button>
         <button class="tab" data-tab="novel">小说</button>
         <button class="tab" data-tab="audio">听书</button>
         <button class="tab" data-tab="comic">漫画</button>
         <button class="tab" data-tab="drama">短剧</button>
       </div>
       <div class="panel-content">
         <div class="tab-content active" data-content="search">
           <div class="search-controls">
             <input type="text" class="search-input" placeholder="输入关键词...">
             <select class="search-type">
               <option value="小说">小说</option>
               <option value="听书">听书</option>
               <option value="漫画">漫画</option>
               <option value="短剧">短剧</option>
             </select>
             <button class="search-btn">搜索</button>
           </div>
           <div class="search-results"></div>
         </div>
         
         <div class="tab-content" data-content="novel">
           <div class="chapter-controls">
             <select class="chapter-select novel-chapters"></select>
             <button class="load-chapter-btn" data-type="novel">加载章节</button>
           </div>
           <div class="content-area novel-"></div>
         </div>content
         
         <div class="tab-content" data-content="audio">
           <div class="chapter-controls">
             <select class="chapter-select audio-chapters"></select>
             <button class="load-chapter-btn" data-type="audio">加载音频</button>
           </div>
           <audio controls class="media-player audio-player"></audio>
         </div>
         
         <div class="tab-content" data-content="comic">
           <div class="chapter-controls">
             <select class="chapter-select comic-chapters"></select>
             <button class="load-chapter-btn" data-type="comic">加载漫画</button>
           </div>
           <div class="content-area comic-images"></div>
         </div>
         
         <div class="tab-content" data-content="drama">
           <div class="chapter-controls">
             <select class="chapter-select drama-chapters"></select>
             <button class="load-chapter-btn" data-type="drama">加载短剧</button>
           </div>
           <video controls class="media-player drama-player"></video>
         </div>
       </div>
     `;

     document.body.appendChild(panel);

     // 添加样式 - 修复内容溢出问题
     const style = document.createElement('style');
     style.textContent = `
       .yydjtc-panel {
         position: fixed;
         top: 50px;
         right: 50px;
         width: 600px;
         height: 700px;
         background: rgba(255, 255, 255, 0.95);
         backdrop-filter: blur(10px);
         border: 1px solid rgba(0, 0, 0, 0.1);
         border-radius: 12px;
         box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
         z-index: 10000;
         display: flex;
         flex-direction: column;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
       }
       .panel-header {
         padding: 16px;
         border-bottom: 1px solid #e0e0e0;
         display: flex;
         justify-content: space-between;
         align-items: center;
         cursor: move;
         background: #4CAF50;
         color: white;
         border-radius: 12px 12px 0 0;
       }
       .panel-title {
         font-size: 18px;
         font-weight: 600;
       }
       .panel-close {
         background: none;
         border: none;
         color: white;
         font-size: 24px;
         cursor: pointer;
         padding: 0;
         width: 30px;
         height: 30px;
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius: 50%;
         transition: background 0.2s;
       }
       .panel-close:hover {
         background: rgba(255, 255, 255, 0.2);
       }
       .panel-tabs {
         display: flex;
         background: #f5f5f5;
         border-bottom: 1px solid #e0e0e0;
       }
       .tab {
         flex: 1;
         padding: 12px;
         border: none;
         background: none;
         cursor: pointer;
         font-size: 14px;
         transition: all 0.2s;
         border-bottom: 3px solid transparent;
       }
       .tab:hover {
         background: #e8f5e9;
       }
       .tab.active {
         background: white;
         border-bottom-color: #4CAF50;
         font-weight: 600;
       }
       .panel-content {
         flex: 1;
         overflow: hidden;
         display: flex;
         flex-direction: column;
       }
       .tab-content {
         display: none;
         flex-direction: column;
         flex: 1;
         overflow-y: auto;
         max-height: 600px;
       }
       .tab-content.active {
         display: flex;
       }
       .search-controls, .chapter-controls {
         padding: 16px;
         border-bottom: 1px solid #e0e0e0;
         display: flex;
         gap: 8px;
         align-items: center;
         flex-shrink: 0;
       }
       .search-input, .chapter-select {
         flex: 1;
         padding: 8px 12px;
         border: 1px solid #ddd;
         border-radius: 6px;
         font-size: 14px;
       }
       .search-type {
         padding: 8px 12px;
         border: 1px solid #ddd;
         border-radius: 6px;
         font-size: 14px;
         background: white;
       }
       .search-btn, .load-chapter-btn {
         padding: 8px 16px;
         background: #4CAF50;
         color: white;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         font-size: 14px;
         transition: background 0.2s;
       }
       .search-btn:hover, .load-chapter-btn:hover {
         background: #45a049;
       }
       .search-results {
         flex: 1;
         overflow-y: auto;
         padding: 16px;
         max-height: 550px;
       }
       .content-area {
         flex: 1;
         overflow-y: auto;
         padding: 16px;
       }
       .result-item {
         padding: 12px;
         border: 1px solid #e0e0e0;
         border-radius: 8px;
         margin-bottom: 12px;
         cursor: pointer;
         transition: all 0.2s;
       }
       .result-item:hover {
         background: #f5f5f5;
         border-color: #4CAF50;
       }
       .result-title {
         font-weight: 600;
         margin-bottom: 4px;
       }
       .result-info {
         font-size: 12px;
         color: #666;
       }
       .media-player {
         width: 100%;
         margin-top: 16px;
       }
       .comic-images {
         display: flex;
         flex-direction: column;
         gap: 16px;
         max-height: 500px;
         overflow-y: auto;
       }
       .comic-images img {
         max-width: 100%;
         border-radius: 8px;
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
       }
       .novel-content {
         line-height: 1.8;
         font-size: 16px;
         white-space: pre-wrap;
         max-height: 400px;
         overflow-y: auto;
       }
       .loading {
         text-align: center;
         padding: 20px;
         color: #666;
       }
       .error {
         color: #f44336;
         padding: 16px;
         background: #ffebee;
         border-radius: 8px;
         margin: 16px;
       }
     `;
     document.head.appendChild(style);

     // 绑定事件
     this._bindPanelEvents();
   }

   _bindPanelEvents() {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     // 关闭按钮
     panel.querySelector('.panel-close').addEventListener('click', () => {
       panel.style.display = 'none';
       this._panelState.isVisible = false;
     });

     // 拖拽功能
     const header = panel.querySelector('.panel-header');
     let isDragging = false;
     let startX, startY, initialX, initialY;

     header.addEventListener('mousedown', (e) => {
       if (e.target === header || e.target.classList.contains('panel-title')) {
         isDragging = true;
         startX = e.clientX;
         startY = e.clientY;
         initialX = panel.offsetLeft;
         initialY = panel.offsetTop;
         e.preventDefault();
       }
     });

     document.addEventListener('mousemove', (e) => {
       if (!isDragging) return;
       const deltaX = e.clientX - startX;
       const deltaY = e.clientY - startY;
       panel.style.right = 'auto';
       panel.style.left = (initialX + deltaX) + 'px';
       panel.style.top = (initialY + deltaY) + 'px';
     });

     document.addEventListener('mouseup', () => {
       isDragging = false;
     });

     // 标签切换
     panel.querySelectorAll('.tab').forEach(tab => {
       tab.addEventListener('click', () => {
         const tabName = tab.dataset.tab;
         this._switchTab(tabName);
       });
     });

     // 搜索功能
     const searchBtn = panel.querySelector('.search-btn');
     searchBtn.addEventListener('click', () => this._performSearch());

     const searchInput = panel.querySelector('.search-input');
     searchInput.addEventListener('keypress', (e) => {
       if (e.key === 'Enter') this._performSearch();
     });

     // 章节加载按钮
     panel.querySelectorAll('.load-chapter-btn').forEach(btn => {
       btn.addEventListener('click', (e) => {
         const type = e.target.dataset.type;
         this._loadChapterContent(type);
       });
     });
   }

   _switchTab(tabName) {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     panel.querySelectorAll('.tab').forEach(tab => {
       tab.classList.toggle('active', tab.dataset.tab === tabName);
     });

     panel.querySelectorAll('.tab-content').forEach(content => {
       content.classList.toggle('active', content.dataset.content === tabName);
     });

     this._panelState.currentTab = tabName;

     if (['novel', 'audio', 'comic', 'drama'].includes(tabName)) {
       this._refreshChapters();
     }
   }

   _performSearch() {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const keyword = panel.querySelector('.search-input').value.trim();
     const searchTypeText = panel.querySelector('.search-type').value;

     if (!keyword) {
       this._showSearchError('请输入搜索关键词');
       return;
     }

     const searchTypeMap = { '小说': '3', '听书': '2', '漫画': '8', '短剧': '11' };
     const searchType = searchTypeMap[searchTypeText] || '3';
     const resultsContainer = panel.querySelector('.search-results');
     resultsContainer.innerHTML = '<div class="loading">搜索中...</div>';

     this.setSearchKey({ KEY: keyword });
     this.setSearchType({ TYPE: searchType });

     this.doSearch().then(resultJson => {
       const result = JSON.parse(resultJson);
       if (result.error) {
         this._showSearchError('搜索失败: ' + result.error);
         return;
       }
       this._displaySearchResults(result);
     }).catch(err => {
       this._showSearchError('搜索出错: ' + err.message);
     });
   }

   _displaySearchResults(result) {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const resultsContainer = panel.querySelector('.search-results');
     resultsContainer.innerHTML = '';

     const items = this._extractContent(result, this._instanceData.searchType);
     if (!items || items.length === 0) {
       resultsContainer.innerHTML = '<div class="error">未找到相关内容</div>';
       return;
     }

     items.forEach((item, index) => {
       const resultItem = document.createElement('div');
       resultItem.className = 'result-item';
       resultItem.innerHTML = `
         <div class="result-title">${item.title || '无标题'}</div>
         <div class="result-info">
           <div>类型: ${YYDJTCAllInOneExtension.CONTENT_TYPE_MAP[item._type] || '未知'}</div>
           <div>ID: ${item.id || '无ID'}</div>
           ${item.author ? `<div>作者: ${item.author}</div>` : ''}
           ${item.intro ? `<div>简介: ${item.intro.substring(0, 100)}...</div>` : ''}
         </div>
       `;

       resultItem.addEventListener('click', () => {
         this._panelState.currentBookId = item.id;
         this._fetchBookCatalog(item.id);
       });

       resultsContainer.appendChild(resultItem);
     });
   }

   _showSearchError(message) {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const resultsContainer = panel.querySelector('.search-results');
     resultsContainer.innerHTML = `<div class="error">${message}</div>`;
   }

   _fetchBookCatalog(bookId) {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     this._panelState.currentBookId = bookId;
     panel.querySelectorAll('.chapter-select').forEach(select => {
       select.innerHTML = '<option>加载中...</option>';
     });

     this.getBookCatalog({ BOOK_ID: bookId }).then(catalogJson => {
       const catalog = JSON.parse(catalogJson);
       if (catalog.error) {
         this._showSearchError('加载目录失败: ' + catalog.error);
         return;
       }

       this.parseCatalogFromJson({ JSON: catalogJson });
       const parseError = this.catalogGetParseError();

       if (parseError) {
         this._showSearchError('解析目录失败: ' + parseError);
         return;
       }

       this._panelState.currentChapters = this._catalogData.flatChapters;
       this._refreshChapters();
       this._switchTab('novel');
     }).catch(err => {
       this._showSearchError('加载目录出错: ' + err.message);
     });
   }

   _refreshChapters() {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const chapters = this._panelState.currentChapters;
     if (!chapters || chapters.length === 0) return;

     const selects = panel.querySelectorAll('.chapter-select');
     selects.forEach(select => {
       select.innerHTML = '';
       chapters.forEach((ch, i) => {
         const option = document.createElement('option');
         option.value = i;
         option.textContent = `${ch.title || '章节'} (第${ch.realChapterOrder || i + 1}章)`;
         select.appendChild(option);
       });
     });
   }

   _loadChapterContent(type) {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const chapterSelect = panel.querySelector(`.${type}-chapters`);
     const selectedIndex = chapterSelect?.value;

     if (selectedIndex === undefined || selectedIndex === '' || !this._panelState.currentChapters[selectedIndex]) {
       alert('请选择有效章节');
       return;
     }

     const chapter = this._panelState.currentChapters[selectedIndex];
     const itemId = chapter.itemId;

     if (!itemId) {
       alert('该章节没有itemId');
       return;
     }

     const typeMap = { 'novel': '小说', 'audio': '听书', 'comic': '漫画', 'drama': '短剧' };
     const tab = typeMap[type];

     const showLoading = () => {
       if (type === 'novel') {
         panel.querySelector('.novel-content').innerHTML = '<div class="loading">加载中...</div>';
       } else if (type === 'comic') {
         panel.querySelector('.comic-images').innerHTML = '<div class="loading">加载中...</div>';
       }
     };

     showLoading();

     this.getUnifiedContent({
       TAB: tab,
       ITEM_ID: itemId,
       TONE_ID: type === 'audio' ? '0' : '',
       ASYNC: type === 'comic' ? '1' : '',
       SHOW_HTML: type === 'comic' ? '0' : ''
     }).then(contentJson => {
       const content = JSON.parse(contentJson);
       if (content.error) throw new Error(content.error);

       this.parseContentDetailFromJson({ MODE: tab, JSON: contentJson });

       if (type === 'novel') {
         const text = this.getContentDetailField({ MODE: tab, FIELD: 'novel.content_text' });
         panel.querySelector('.novel-content').innerHTML = `<div class="novel-content">${text}</div>`;
       } else if (type === 'audio') {
         const url = this.getContentDetailField({ MODE: tab, FIELD: 'audio.url' });
         const audioPlayer = panel.querySelector('.audio-player');
         audioPlayer.src = url;
       } else if (type === 'comic') {
         const imagesContainer = panel.querySelector('.comic-images');
         imagesContainer.innerHTML = '';
         const imgUrlsJson = this.getContentDetailField({ MODE: tab, FIELD: 'comic.img_urls_json' });
         try {
           const urls = JSON.parse(imgUrlsJson);
           urls.forEach(url => {
             const img = document.createElement('img');
             img.src = url;
             imagesContainer.appendChild(img);
           });
         } catch (e) {
           imagesContainer.innerHTML = '<div class="error">加载图片失败</div>';
         }
       } else if (type === 'drama') {
         const url = this.getContentDetailField({ MODE: tab, FIELD: 'drama.video_url' });
         const videoPlayer = panel.querySelector('.drama-player');
         videoPlayer.src = url;
       }
     }).catch(err => {
       const errorMsg = `加载${tab}内容失败: ${err.message}`;
       if (type === 'novel') {
         panel.querySelector('.novel-content').innerHTML = `<div class="error">${errorMsg}</div>`;
       } else if (type === 'comic') {
         panel.querySelector('.comic-images').innerHTML = `<div class="error">${errorMsg}</div>`;
       } else {
         alert(errorMsg);
       }
     });
   }

   getInfo() {
     if (!document.getElementById('yydjtc-panel')) {
       this._createPanel();
     }

     return {
       id: YYDJTCAllInOneExtension.EXTENSION_ID,
       name: '芸雁书城 + YYDJTC内容搜索(融合)',
       color1: '#4CAF50',
       color2: '#45a049',
       blocks: [
         {
           opcode: 'togglePanel',
           blockType: Scratch.BlockType.COMMAND,
           text: '切换面板显示状态'
         },

         {
           opcode: 'getBookDetail',
           blockType: Scratch.BlockType.REPORTER,
           text: '获取书籍详情 [BOOK_ID]',
           arguments: { BOOK_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '12345' } }
         },
         {
           opcode: 'getBookCatalog',
           blockType: Scratch.BlockType.REPORTER,
           text: '获取书籍目录 [BOOK_ID]',
           arguments: { BOOK_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '12345' } }
         },

         '---',

         {
           opcode: 'getUnifiedContent',
           blockType: Scratch.BlockType.REPORTER,
           text: '获取模式为 [TAB] 的章节内容 item_id为 [ITEM_ID] 听书tone_id为 [TONE_ID] 漫画async为 [ASYNC] show_html为 [SHOW_HTML]',
           arguments: {
             TAB: { type: Scratch.ArgumentType.STRING, menu: 'contentTabMenu', defaultValue: '小说' },
             ITEM_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '7295592952154328116' },
             TONE_ID: { type: Scratch.ArgumentType.STRING, defaultValue: '0' },
             ASYNC: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
             SHOW_HTML: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
           }
         },

         '---',

         {
           opcode: 'parseContentDetailFromJson',
           blockType: Scratch.BlockType.COMMAND,
           text: '内容详细解析 模式为 [MODE] json [JSON]',
           arguments: {
             MODE: { type: Scratch.ArgumentType.STRING, menu: 'contentTabMenu', defaultValue: '小说' },
             JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"code":200,"data":{"content":""}}' }
           }
         },
         {
           opcode: 'getContentDetailField',
           blockType: Scratch.BlockType.REPORTER,
           text: '内容详细解析 模式为 [MODE] json的 [FIELD]',
           arguments: {
             MODE: { type: Scratch.ArgumentType.STRING, menu: 'contentTabMenu', defaultValue: '小说' },
             FIELD: { type: Scratch.ArgumentType.STRING, menu: 'contentDetailFieldMenu' }
           },
           disableMonitor: true
         },

         '---',

         {
           opcode: 'parseCatalogFromJson',
           blockType: Scratch.BlockType.COMMAND,
           text: '解析目录JSON [JSON]',
           arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"code":200,"data":{}}' } }
         },
         { opcode: 'catalogChapterCount', blockType: Scratch.BlockType.REPORTER, text: '目录章节总数', disableMonitor: true },
         { opcode: 'catalogVolumeCount', blockType: Scratch.BlockType.REPORTER, text: '目录卷总数', disableMonitor: true },
         {
           opcode: 'catalogGetChapterField',
           blockType: Scratch.BlockType.REPORTER,
           text: '目录第 [INDEX] 章的 [FIELD]',
           arguments: {
             INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
             FIELD: { type: Scratch.ArgumentType.STRING, menu: 'catalogChapterFieldMenu' }
           }
         },
         {
           opcode: 'catalogGetVolumeName',
           blockType: Scratch.BlockType.REPORTER,
           text: '目录第 [VINDEX] 卷名称',
           arguments: { VINDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } },
           disableMonitor: true
         },
         {
           opcode: 'catalogGetAllItemId',
           blockType: Scratch.BlockType.REPORTER,
           text: 'allItemIds 第 [INDEX] 项',
           arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } },
           disableMonitor: true
         },
         { opcode: 'catalogGetParseError', blockType: Scratch.BlockType.REPORTER, text: '目录解析错误', disableMonitor: true },
         { opcode: 'catalogGetRaw', blockType: Scratch.BlockType.REPORTER, text: '目录原始JSON(字符串)', disableMonitor: true },

         '---',

         {
           opcode: 'setSearchKey',
           blockType: Scratch.BlockType.COMMAND,
           text: '设置搜索关键词为 [KEY]',
           arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: '十日终焉' } }
         },
         {
           opcode: 'setSearchType',
           blockType: Scratch.BlockType.COMMAND,
           text: '设置搜索类型为 [TYPE]',
           arguments: { TYPE: { type: Scratch.ArgumentType.STRING, menu: 'searchTypeMenu' } }
         },
         {
           opcode: 'setOffset',
           blockType: Scratch.BlockType.COMMAND,
           text: '设置分页偏移量为 [OFFSET]',
           arguments: { OFFSET: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } }
         },

         '---',

         { opcode: 'doSearch', blockType: Scratch.BlockType.REPORTER, text: '执行搜索', disableMonitor: true },
         { opcode: 'getContentCount', blockType: Scratch.BlockType.REPORTER, text: '搜索结果总数', disableMonitor: true },
         { opcode: 'getContentType', blockType: Scratch.BlockType.REPORTER, text: '当前内容类型', disableMonitor: true },

         {
           opcode: 'getContentField',
           blockType: Scratch.BlockType.REPORTER,
           text: '第 [INDEX] 项的 [FIELD]',
           arguments: {
             INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
             FIELD: { type: Scratch.ArgumentType.STRING, menu: 'dynamicFieldMenu' }
           }
         },
         {
           opcode: 'getContentCustomField',
           blockType: Scratch.BlockType.REPORTER,
           text: '第 [INDEX] 项的自定义字段 [FIELD]',
           arguments: {
             INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
             FIELD: { type: Scratch.ArgumentType.STRING, defaultValue: 'title' }
           }
         },
         {
           opcode: 'getContentDetails',
           blockType: Scratch.BlockType.REPORTER,
           text: '获取第 [INDEX] 项的完整信息',
           arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
         },

         '---',

         { opcode: 'clearCache', blockType: Scratch.BlockType.COMMAND, text: '清除搜索缓存' }
       ],
       menus: {
         searchTypeMenu: { acceptReporters: true, items: YYDJTCAllInOneExtension.SEARCH_TYPES },
         dynamicFieldMenu: { acceptReporters: false, items: 'getDynamicFields' },

         catalogChapterFieldMenu: {
           acceptReporters: true,
           items: [
             { text: 'itemId', value: 'itemId' },
             { text: '标题', value: 'title' },
             { text: '卷名', value: 'volume_name' },
             { text: '章节序号(字符串)', value: 'realChapterOrder' },
             { text: '解锁状态', value: 'isChapterLock' },
             { text: 'needPay', value: 'needPay' },
             { text: 'firstPassTime', value: 'firstPassTime' },
             { text: 'isPaidPublication', value: 'isPaidPublication' },
             { text: 'isPaidStory', value: 'isPaidStory' },
             { text: '完整对象', value: '_raw' }
           ]
         },

         contentTabMenu: {
           acceptReporters: true,
           items: [
             { text: '小说', value: '小说' },
             { text: '听书', value: '听书' },
             { text: '短剧', value: '短剧' },
             { text: '漫画', value: '漫画' }
           ]
         },

         contentDetailFieldMenu: {
           acceptReporters: true,
           items: [
             { text: '解析错误', value: 'error' },
             { text: '原始JSON', value: 'raw_json' },
             { text: 'code', value: 'code' },
             { text: 'message', value: 'message' },
             { text: 'elapsed_ms', value: 'elapsed_ms' },
             { text: '小说content原文', value: 'novel.content_raw' },
             { text: '小说纯文本', value: 'novel.content_text' },
             { text: '小说span数量', value: 'novel.span_count' },
             { text: '小说spans(JSON)', value: 'novel.spans_json' },
             { text: '小说PGC_VOICE原文', value: 'novel.pgc_voice_raw' },
             { text: '小说PGC_VOICE(JSON)', value: 'novel.pgc_voice_json' },
             { text: '听书音频URL', value: 'audio.url' },
             { text: '漫画images原文', value: 'comic.images_raw' },
             { text: '漫画图片数量', value: 'comic.img_count' },
             { text: '漫画图片URL列表(JSON)', value: 'comic.img_urls_json' },
             { text: '短剧video_url', value: 'drama.video_url' },
             { text: '短剧video_id', value: 'drama.video_id' },
             { text: '短剧expire_time', value: 'drama.expire_time' }
           ]
         }
       }
     };
   }

   // 切换面板显示
   togglePanel() {
     const panel = document.getElementById('yydjtc-panel');
     if (!panel) return;

     const isVisible = panel.style.display !== 'none';
     panel.style.display = isVisible ? 'none' : 'block';
     this._panelState.isVisible = !isVisible;

     if (!isVisible) {
       panel.style.right = '50px';
       panel.style.left = 'auto';
       panel.style.top = '50px';
     }
   }

   // 原有方法：内容详细解析相关
   _resetContentDetailCache() {
     this._contentDetailData.lastMode = '';
     this._contentDetailData.lastJsonString = '';
     this._contentDetailData.lastJsonObj = null;
     this._contentDetailData.lastParseError = '';

     this._contentDetailData.novel = {
       content_raw: '', content_text: '', spans: [],
       pgc_voice_raw: '', pgc_voice_json: null, pgc_voice_json_string: ''
     };
     this._contentDetailData.audio = { url: '' };
     this._contentDetailData.comic = { images_raw: '', img_urls: [] };
     this._contentDetailData.drama = { expire_time: '', video_id: '', video_url: '' };
   }

   _htmlEntityDecode(str) {
     return (str || '').replace(/&#34;/g, '"').replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'").replace(/&apos;/g, "'")
       .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
   }

   _stripNovelSpansToText(html) {
     let s = (html || '');
     s = s.replace(/<span\b[^>]*>/g, '');
     s = s.replace(/<\/span>/g, '');
     return s;
   }

   _extractNovelSpans(html) {
     const spans = [];
     const s = (html || '');
     const re = /<span\b[^>]*start_time\s*=\s*"([^"]+)"[^>]*>([\s\S]*?)<\/span>/g;
     let m;
     while ((m = re.exec(s)) !== null) {
       spans.push({ start_time: m[1], text: m[2] });
     }
     return spans;
   }

   _extractPgcVoiceFromNovelContent(html) {
     const s = (html || '');
     const re = /\{!--\s*PGC_VOICE:\s*(\{[\s\S]*?\})\s*--\}/;
     const m = s.match(re);
     if (!m) return { raw: '', json: null, jsonString: '' };
     const rawMaybeEntities = m[1] || '';
     const decoded = this._htmlEntityDecode(rawMaybeEntities);
     let parsed = null;
     try { parsed = JSON.parse(decoded); } catch (e) { parsed = null; }
     return { raw: rawMaybeEntities, json: parsed, jsonString: parsed ? JSON.stringify(parsed) : '' };
   }

   _extractComicImgUrls(imagesHtml) {
     const urls = [];
     const s = (imagesHtml || '');
     const re = /<img\b[^>]*src\s*=\s*"([^"]+)"[^>]*\/?>/g;
     let m;
     while ((m = re.exec(s)) !== null) urls.push(m[1]);
     return urls;
   }

   parseContentDetailFromJson(args) {
     const mode = (args.MODE ?? '').toString();
     const jsonText = (args.JSON ?? '').toString();

     this._resetContentDetailCache();
     this._contentDetailData.lastMode = mode;
     this._contentDetailData.lastJsonString = jsonText;

     if (!jsonText.trim()) {
       this._contentDetailData.lastParseError = '内容JSON为空';
       return;
     }

     let obj;
     try { obj = JSON.parse(jsonText); } catch (e) {
       this._contentDetailData.lastParseError = 'JSON解析失败: ' + e.message;
       return;
     }
     this._contentDetailData.lastJsonObj = obj;

     try {
       const data = obj.data || {};
       if (mode === '小说') {
         const content = (data.content ?? '').toString();
         this._contentDetailData.novel.content_raw = content;
         const pgc = this._extractPgcVoiceFromNovelContent(content);
         this._contentDetailData.novel.pgc_voice_raw = pgc.raw;
         this._contentDetailData.novel.pgc_voice_json = pgc.json;
         this._contentDetailData.novel.pgc_voice_json_string = pgc.jsonString;
         const spans = this._extractNovelSpans(content);
         this._contentDetailData.novel.spans = spans;
         let withoutPgc = content.replace(/\{!--\s*PGC_VOICE:[\s\S]*?--\}\s*\n?/g, '');
         const text = this._stripNovelSpansToText(withoutPgc);
         this._contentDetailData.novel.content_text = text;
       } else if (mode === '听书') {
         const url = (data.content ?? data.url ?? '').toString();
         this._contentDetailData.audio.url = url;
       } else if (mode === '漫画') {
         const images = (data.images ?? '').toString();
         this._contentDetailData.comic.images_raw = images;
         this._contentDetailData.comic.img_urls = this._extractComicImgUrls(images);
       } else if (mode === '短剧') {
         this._contentDetailData.drama.expire_time = (data.expire_time ?? '').toString();
         this._contentDetailData.drama.video_id = (data.video_id ?? '').toString();
         this._contentDetailData.drama.video_url = (data.video_url ?? '').toString();
       } else {
         this._contentDetailData.lastParseError = '未知模式: ' + mode;
         return;
       }
       this._contentDetailData.lastParseError = '';
     } catch (e) {
       this._contentDetailData.lastParseError = '内容解析失败: ' + e.message;
     }
   }

   getContentDetailField(args) {
     const mode = (args.MODE ?? '').toString();
     const field = (args.FIELD ?? '').toString();

     if (field === 'error') return (this._contentDetailData.lastParseError || '').toString();
     if (field === 'raw_json') return (this._contentDetailData.lastJsonString || '').toString();

     const obj = this._contentDetailData.lastJsonObj || {};
     if (field === 'code') return (obj.code ?? '').toString();
     if (field === 'message') return (obj.message ?? '').toString();
     if (field === 'elapsed_ms') return (obj.elapsed_ms ?? '').toString();

     if (field === 'novel.content_raw') return (this._contentDetailData.novel.content_raw || '').toString();
     if (field === 'novel.content_text') return (this._contentDetailData.novel.content_text || '').toString();
     if (field === 'novel.span_count') return (this._contentDetailData.novel.spans.length || 0).toString();
     if (field === 'novel.spans_json') return JSON.stringify(this._contentDetailData.novel.spans || []);
     if (field === 'novel.pgc_voice_raw') return (this._contentDetailData.novel.pgc_voice_raw || '').toString();
     if (field === 'novel.pgc_voice_json') {
       if (this._contentDetailData.novel.pgc_voice_json) return JSON.stringify(this._contentDetailData.novel.pgc_voice_json);
       return '';
     }

     if (field === 'audio.url') return (this._contentDetailData.audio.url || '').toString();

     if (field === 'comic.images_raw') return (this._contentDetailData.comic.images_raw || '').toString();
     if (field === 'comic.img_count') return (this._contentDetailData.comic.img_urls.length || 0).toString();
     if (field === 'comic.img_urls_json') return JSON.stringify(this._contentDetailData.comic.img_urls || []);

     if (field === 'drama.video_url') return (this._contentDetailData.drama.video_url || '').toString();
     if (field === 'drama.video_id') return (this._contentDetailData.drama.video_id || '').toString();
     if (field === 'drama.expire_time') return (this._contentDetailData.drama.expire_time || '').toString();

     try {
       let value = obj;
       const parts = field.split('.');
       for (const p of parts) {
         if (value === null || value === undefined) return '';
         value = value[p];
       }
       if (value !== null && typeof value === 'object') return JSON.stringify(value);
       return value?.toString() || '';
     } catch (e) {
       return '';
     }
   }

   // 原有方法：统一内容获取
   getUnifiedContent(args) {
     const tab = (args.TAB ?? '').toString();
     const item_id = (args.ITEM_ID ?? '').toString();
     const tone_id = (args.TONE_ID ?? '').toString();
     const asyncMode = (args.ASYNC ?? '').toString();
     const show_html = (args.SHOW_HTML ?? '').toString();

     if (!tab) return JSON.stringify({ error: 'tab不能为空' });
     if (!item_id) return JSON.stringify({ error: 'item_id不能为空' });

     const params = new URLSearchParams();
     params.set('tab', tab);
     params.set('item_id', item_id);

     if (tab === '听书') { if (tone_id !== '') params.set('tone_id', tone_id); }
     if (tab === '漫画') { if (asyncMode !== '') params.set('async', asyncMode); if (show_html !== '') params.set('show_html', show_html); }

     const url = `${YYDJTCAllInOneExtension.BASE_URL}/api/content?${params.toString()}`;

     return fetch(url)
       .then((response) => {
         if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
         return response.json();
       })
       .then((data) => JSON.stringify(data))
       .catch((error) => {
         console.error('获取内容失败:', error);
         return JSON.stringify({ error: '获取内容失败: ' + error.message });
       });
   }

   // 原有方法：书籍详情/目录获取
   getBookDetail(args) {
     const book_id = args.BOOK_ID;
     if (!book_id) return JSON.stringify({ error: '书籍ID不能为空' });

     const url = `https://bk.yydjtc.cn/api/detail?book_id=${encodeURIComponent(book_id)}`;
     return fetch(url)
       .then((response) => {
         if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
         return response.json();
       })
       .then((data) => JSON.stringify(data))
       .catch((error) => {
         console.error('获取详情失败:', error);
         return JSON.stringify({ error: '获取详情失败: ' + error.message });
       });
   }

   getBookCatalog(args) {
     const book_id = args.BOOK_ID;
     if (!book_id) return JSON.stringify({ error: '书籍ID不能为空' });

     const url = `https://bk.yydjtc.cn/api/book?book_id=${encodeURIComponent(book_id)}`;
     return fetch(url)
       .then((response) => {
         if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
         return response.json();
       })
       .then((data) => JSON.stringify(data))
       .catch((error) => {
         console.error('获取目录失败:', error);
         return JSON.stringify({ error: '获取目录失败: ' + error.message });
       });
   }

   // 原有方法：目录解析
   _resetCatalogCache() {
     this._catalogData.lastCatalogRaw = null;
     this._catalogData.lastCatalogString = '';
     this._catalogData.flatChapters = [];
     this._catalogData.volumes = [];
     this._catalogData.volumeNameList = [];
     this._catalogData.allItemIds = [];
     this._catalogData.lastParseError = '';
   }

   parseCatalogFromJson(args) {
     const jsonText = args.JSON?.toString() || '';
     this._resetCatalogCache();
     this._catalogData.lastCatalogString = jsonText;

     if (!jsonText.trim()) {
       this._catalogData.lastParseError = '目录JSON为空';
       return;
     }

     let obj;
     try { obj = JSON.parse(jsonText); } catch (e) {
       this._catalogData.lastParseError = 'JSON解析失败: ' + e.message;
       return;
     }
     this._catalogData.lastCatalogRaw = obj;

     try {
       const d1 = obj && obj.data ? obj.data : null;
       const d2 = d1 && d1.data ? d1.data : null;

       if (!d2) { this._catalogData.lastParseError = '未找到 data.data 节点'; return; }

       const allItemIds = Array.isArray(d2.allItemIds) ? d2.allItemIds : [];
       const volumeNameList = Array.isArray(d2.volumeNameList) ? d2.volumeNameList : [];
       const chapterListWithVolume = Array.isArray(d2.chapterListWithVolume) ? d2.chapterListWithVolume : [];

       this._catalogData.allItemIds = allItemIds;
       this._catalogData.volumeNameList = volumeNameList;

       const volumes = [];
       const flat = [];

       for (let vi = 0; vi < chapterListWithVolume.length; vi++) {
         const chapterArr = chapterListWithVolume[vi];
         if (!Array.isArray(chapterArr)) continue;

         let volumeName = volumeNameList[vi] || '';
         if (!volumeName && chapterArr.length > 0 && chapterArr[0] && chapterArr[0].volume_name) {
           volumeName = chapterArr[0].volume_name;
         }

         const volumeObj = { index: vi + 1, volume_name: volumeName, chapters: [] };

         for (let ci = 0; ci < chapterArr.length; ci++) {
           const ch = chapterArr[ci];
           if (!ch || typeof ch !== 'object') continue;

           const normalized = {
             _raw: ch,
             volume_index: vi + 1,
             chapter_index_in_volume: ci + 1,
             volume_name: ch.volume_name || volumeName || '',
             itemId: ch.itemId || '',
             title: ch.title || '',
             realChapterOrder: ch.realChapterOrder || '',
             isChapterLock: !!ch.isChapterLock,
             needPay: typeof ch.needPay === 'number' ? ch.needPay : (ch.needPay ? Number(ch.needPay) : 0),
             firstPassTime: ch.firstPassTime || '',
             isPaidPublication: !!ch.isPaidPublication,
             isPaidStory: !!ch.isPaidStory
           };

           volumeObj.chapters.push(normalized);
           flat.push(normalized);
         }

         volumes.push(volumeObj);
       }

       this._catalogData.volumes = volumes;
       this._catalogData.flatChapters = flat;
       this._catalogData.lastParseError = '';
     } catch (e) {
       this._catalogData.lastParseError = '目录结构解析失败: ' + e.message;
     }
   }

   catalogChapterCount() {
     return (this._catalogData.flatChapters.length || 0).toString();
   }
   catalogVolumeCount() {
     return (this._catalogData.volumes.length || 0).toString();
   }
   catalogGetChapterField(args) {
     const index = Number(args.INDEX);
     if (isNaN(index) || index < 1 || index > this._catalogData.flatChapters.length) return '';
     const item = this._catalogData.flatChapters[index - 1];
     if (!item) return '';
     const field = args.FIELD?.toString() || '';
     if (!field) return '';
     if (field === '_raw') return JSON.stringify(item._raw || item);
     const value = item[field];
     if (value !== null && typeof value === 'object') return JSON.stringify(value);
     return value?.toString() || '';
   }
   catalogGetVolumeName(args) {
     const vindex = Number(args.VINDEX);
     if (isNaN(vindex) || vindex < 1 || vindex > this._catalogData.volumes.length) return '';
     return (this._catalogData.volumes[vindex - 1]?.volume_name || '').toString();
   }
   catalogGetAllItemId(args) {
     const index = Number(args.INDEX);
     if (isNaN(index) || index < 1 || index > this._catalogData.allItemIds.length) return '';
     return (this._catalogData.allItemIds[index - 1] || '').toString();
   }
   catalogGetParseError() {
     return (this._catalogData.lastParseError || '').toString();
   }
   catalogGetRaw() {
     return (this._catalogData.lastCatalogString || '').toString();
   }

   // 原有方法：YYDJTC内容搜索相关
   getDynamicFields() {
     const data = this._getData();
     const searchType = data.searchType || '3';
     const common = YYDJTCAllInOneExtension.COMMON_FIELDS;
     const specific = YYDJTCAllInOneExtension.TYPE_SPECIFIC_FIELDS[searchType] || [];

     const allFields = [...specific];
     common.forEach((field) => {
       if (!specific.some((f) => f.value === field.value)) allFields.push(field);
     });
     return allFields;
   }

   setSearchKey(args) {
     const data = this._getData();
     data.searchKey = args.KEY?.toString().trim() || '';
   }
   setSearchType(args) {
     const data = this._getData();
     data.searchType = args.TYPE?.toString() || '3';
   }
   setOffset(args) {
     const data = this._getData();
     const offset = Number(args.OFFSET);
     data.offset = isNaN(offset) ? 0 : Math.max(0, Math.floor(offset));
   }

   async doSearch() {
     const data = this._getData();
     if (!data.searchKey) return JSON.stringify({ error: '搜索关键词不能为空' });

     try {
       const params = new URLSearchParams({
         key: data.searchKey,
         tab_type: data.searchType,
         offset: data.offset.toString()
       });

       const url = `${YYDJTCAllInOneExtension.BASE_URL}/api/search?${params.toString()}`;
       console.log('[YYDJTC Search] 请求:', url);

       const response = await fetch(url, {
         method: 'GET',
         headers: { Accept: 'application/json', 'User-Agent': 'TurboWarp Extension/1.0' }
       });

       if (!response.ok) return JSON.stringify({ error: `HTTP ${response.status}: ${response.statusText}` });

       const result = await response.json();
       data.lastResult = result;
       data.currentTabType = data.searchType;
       data.contentCache = this._extractContent(result, data.searchType);

       console.log('[YYDJTC Search] 成功，获取到', data.contentCache.length, '条结果');
       return JSON.stringify(result);
     } catch (error) {
       console.error('[YYDJTC Search] 错误:', error);
       return JSON.stringify({ error: `请求失败: ${error.message}` });
     }
   }

   getContentCount() {
     return this._getData().contentCache.length.toString();
   }
   getContentType() {
     const data = this._getData();
     return YYDJTCAllInOneExtension.CONTENT_TYPE_MAP[data.currentTabType] || '未知';
   }
   getContentField(args) {
     const data = this._getData();
     const items = data.contentCache;
     const index = Number(args.INDEX);
     if (isNaN(index) || index < 1 || index > items.length) return '';
     const item = items[index - 1];
     if (!item) return '';
     const field = args.FIELD;
     let value = item[field];
     if (field === 'creation_status' && item.creation_status !== undefined) {
       return item.creation_status === '0' ? '已完结' : '连载中';
     }
     if (value !== null && typeof value === 'object') return JSON.stringify(value);
     return value?.toString() || '';
   }
   getContentCustomField(args) {
     const data = this._getData();
     const items = data.contentCache;
     const index = Number(args.INDEX);
     if (isNaN(index) || index < 1 || index > items.length) return '';
     const item = items[index - 1];
     if (!item) return '';
     const field = args.FIELD?.toString() || '';
     if (!field) return '';
     let value = item._raw;
     const fieldParts = field.split('.');
     for (const part of fieldParts) {
       if (value === null || value === undefined) return '';
       value = value[part];
     }
     if (value !== null && typeof value === 'object') return JSON.stringify(value);
     return value?.toString() || '';
   }
   getContentDetails(args) {
     const data = this._getData();
     const items = data.contentCache;
     const index = Number(args.INDEX);
     if (isNaN(index) || index < 1 || index > items.length) return '[]';
     const item = items[index - 1];
     return item ? JSON.stringify(item._raw || item) : '[]';
   }

   clearCache() {
     const data = this._getData();
     data.lastResult = null;
     data.contentCache = [];
     data.currentTabType = '3';
     data.currentTabName = '';
     console.log('[YYDJTC Search] 缓存已清除');
   }

   _getData() {
     return this._instanceData;
   }

   _extractContent(result, searchType) {
     if (!result) return [];
     try {
       const tabType = parseInt(searchType);
       if (result.data && Array.isArray(result.data.search_tabs)) {
         const targetTab = result.data.search_tabs.find((tab) => tab.tab_type === tabType);
         if (targetTab && Array.isArray(targetTab.data)) {
           this._getData().currentTabName = targetTab.title || '';
           return targetTab.data
             .filter((item) => {
               if (tabType === 11) return item.video_data && Array.isArray(item.video_data) && item.video_data.length > 0;
               return item.book_data && Array.isArray(item.book_data) && item.book_data.length > 0;
             })
             .map((item) => {
               const rawData = tabType === 11 ? item.video_data[0] : item.book_data[0];
               return this._normalizeData(rawData, tabType, item);
             });
         }
       }
       return [];
     } catch (error) {
       console.error('[YYDJTC Search] 提取内容失败:', error);
       return [];
     }
   }

   _normalizeData(rawData, tabType, item) {
     const searchType = tabType.toString();
     const normalized = {
       _raw: rawData,
       _type: searchType,
       _cell_id: item.cell_id,
       _search_result_id: item.search_result_id,
       _show_type: item.show_type
     };

     normalized.id = rawData.series_id || rawData.book_id || rawData.book_id || '';
     normalized.score = rawData.score || '';
     normalized.category = rawData.category || '';
     normalized.tags = rawData.tags || '';
     normalized.status =
       rawData.creation_status === '0'
         ? '已完结'
         : rawData.series_status === 1
           ? '连载中'
           : '连载中';

     if (searchType === '11') {
       normalized.title = rawData.title || '';
       normalized.intro = rawData.series_intro || rawData.video_detail?.series_intro || '';
       normalized.play_count = rawData.play_cnt || rawData.video_detail?.series_play_cnt || 0;
       normalized.play_count_text = rawData.rec_text || `${normalized.play_count}次播放`;
       normalized.cover_url = rawData.cover || rawData.video_detail?.series_cover || '';
       normalized.episode_count = rawData.episode_cnt || rawData.video_detail?.episode_cnt || 0;
       normalized.duration = rawData.duration || 0;
       normalized.copyright = rawData.copyright || '';
       normalized.actors = rawData.video_detail?.celebrities
         ? rawData.video_detail.celebrities.map((c) => c.nickname).join(', ')
         : '';
     } else if (searchType === '2') {
       normalized.title = rawData.book_name || '';
       normalized.intro = rawData.book_abstract_v2 || rawData.abstract || '';
       normalized.play_count = rawData.listen_count || 0;
       normalized.play_count_text = rawData.read_cnt_text || `${normalized.play_count}`;
       normalized.cover_url = rawData.cover || rawData.thumb_url || '';
       normalized.author = rawData.author || '';
       normalized.chapter_count = rawData.chapter_number || rawData.serial_count || 0;
       normalized.listen_count = rawData.listen_count || 0;
       normalized.audio_cover = rawData.audio_thumb_uri || '';
     } else {
       normalized.title = rawData.book_name || '';
       normalized.intro = rawData.book_abstract_v2 || rawData.abstract || '';
       normalized.play_count = rawData.read_count || 0;
       normalized.play_count_text = rawData.read_cnt_text || `${normalized.play_count}`;
       normalized.cover_url = rawData.thumb_url || '';
       normalized.author = rawData.author || '';
       normalized.word_count = rawData.word_number || 0;
       normalized.book_id = rawData.book_id || '';
       normalized.creation_status = rawData.creation_status || '';
     }

     return normalized;
   }
 }

 Scratch.extensions.register(new YYDJTCAllInOneExtension());
})(Scratch);