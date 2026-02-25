# GitHub 面板 Pro+：自定义插件功能文档（面向扩展使用者/插件作者）

本文档基于你提供的扩展源码中 `PluginManager` 的实现，说明插件系统的能力、生命周期、可用上下文 API、Hook 机制、导入/卸载/持久化规则，并给出一个可直接使用的插件模板与示例。

---

## 1. 插件系统概览

该扩展内置一个“插件管理器”`PluginManager`，用于在运行时加载外部 JS 代码作为插件。插件通过 `new Function('context', ...)` 动态执行，因此：

- **权限极高**：插件能拿到核心对象、GitHub Token、网络请求能力、UI 操作能力（源码警告已明确）。
- **风险极大**：加载未知插件可能导致数据泄露、误删仓库内容、Token 泄露等。

插件可以：
- 注入 CSS（`plugin.style`）
- 执行初始化逻辑（`plugin.init(context)`）
- 监听扩展内部事件（Hooks：`plugin.onHook(hookName, data)`）
- 直接调用扩展内部对象方法（如 `core.apiManager.*`, `core.aiManager.*`, `ui.*` 等）
- 做 UI 扩展、自动化工作流、快捷操作等

---

## 2. 插件对象规范（必须返回 plugin）

插件代码最终需要返回一个 `plugin` 对象。插件加载器在执行时会先创建一个默认对象：

```js
const plugin = {
  id: "xxx",
  name: "Unknown Plugin",
  version: "0.0.1",
  init: () => {},
  onHook: () => {},
  style: ""
};
```

你的插件代码应当对该 `plugin` 进行赋值/覆盖，例如：

- `plugin.id`：**必填**（否则报错：`Plugin must have an ID`）
- `plugin.name`：插件名
- `plugin.version`：版本号
- `plugin.init(context)`：加载完成后调用
- `plugin.onHook(hookName, data)`：事件回调
- `plugin.style`：字符串形式 CSS，将被注入 `<style id="plugin-style-${id}">`

---

## 3. 插件上下文（context）说明

插件函数执行时会收到 `context`，结构如下（源码 `get context()`）：

```js
{
  core,        // GitHubPanelCore 实例（核心状态/AI/缓存/当前仓库等）
  ui,          // 扩展 UI 引用集合（面板、按钮、输入框、mainArea 等）
  api,         // core.apiManager（GitHub API 封装）
  utils,       // Utils 工具类
  components,  // UIComponents 组件工厂
  extension,   // GitHubPanelExtension 实例（含大量内部方法）
  manager      // PluginManager 实例（可触发 hook/卸载自己等）
}
```

### 3.1 core（GitHubPanelCore）常用字段
- `core.token`：GitHub Token（敏感）
- `core.currentOwner / currentRepo / currentBranch / currentPath`
- `core.defaultBranch`
- `core.aiProvider`：`github | siliconflow | custom`
- `core.aiManager`：AI 流式对话、翻译、仓库介绍
- `core.cacheManager`：仓库缓存（用于 AI 上下文拼接）
- `core.apiManager`：GitHub API 管理器（同 `context.api`）

### 3.2 api（APIManager）常用方法
- `api.fetchJson(url)`：GET 并自动缓存（Cache TTL 15s）
- `api.fetchBlob(owner, repo, sha)`
- `api.putFile(owner, repo, path, contentBase64, message, branch, sha?)`
- `api.deleteFile(owner, repo, path, sha, branch, message)`
- `api.mergeBranch(owner, repo, base, head, message)`
- `api.forkRepo(owner, repo)`
- `api.createPullRequest(owner, repo, title, head, base, bodyText)`
- `api.triggerWorkflow(owner, repo, workflowId, branch)`（用于 Actions workflow_dispatch）

> 注意：`putFile/deleteFile/merge/...` 会强制要求 Token，否则抛错。

### 3.3 utils（Utils）常用工具
- `Utils.btnStyle()` / `Utils.itemStyle()`：默认按钮/卡片样式对象
- `Utils.input(placeholder)`：创建输入框并带样式
- `Utils.select(options, label)`：创建 select + label 容器
- `Utils.copyToClipboard(text)`
- `Utils.download(blob, name)`
- `Utils.parseMarkdown(text, owner?, repo?, branch?)`：简易 markdown 转 HTML（含相对图片转 raw 链接）

### 3.4 components（UIComponents）
- `createPanel/createHeader/createTabs/...`
- `createWindowButton(text, style)`：快速生成按钮（内部用 Utils.btnStyle）

### 3.5 ui（UI 引用，重要）
UI 在 `_createUI()` 中创建，并把很多元素挂在 `this.ui` 上。常见有：

- `ui.panel`：面板根元素
- `ui.mainArea`：主要内容展示区域（可插入你自己的 UI）
- `ui.statusLabel`：状态栏（由 `LoadingManager` 控制）
- tab 按钮：`ui.tabSearchBtn/ui.tabBrowseBtn/...`
- browse 输入：`ui.ownerInput/ui.repoInput/ui.branchSelect/...`
- AI 区域：`ui.aiPromptInput/ui.aiStartBtn/ui.aiOutputPre/...`
- plugins 区域：`ui.pluginsArea/ui.pluginsList/...`

> 插件可以直接修改这些 DOM，或者插入新 DOM。

### 3.6 extension（GitHubPanelExtension）
这是扩展主类实例，包含大量内部方法（多为“私有”但可调用），比如：
- `extension.showPanel()/hidePanel()`
- `extension.searchRepos()/searchUsers()/searchOrgs()`
- `extension.loadDir(path)/openFile(fileItem)`
- 以及许多 `_showXXX()` 内部功能面板

> 插件可以直接调用这些方法实现快捷入口，但需留意它们可能依赖当前状态。

---

## 4. Hook（事件）机制

插件通过实现 `plugin.onHook(hookName, data)` 监听事件。

扩展内部会在若干关键时机调用：

```js
this.pluginManager.trigger(hookName, data);
```

源码中已触发的 Hook 名称包括：

### 4.1 UI 生命周期
- `ui:ready`：UI 创建完成（data 通常是 ui 对象）
- `ui:show`：面板显示
- `ui:hide`：面板隐藏

### 4.2 模式/搜索相关
- `mode:switch`：切换模式（data=mode：`search|browse|trending|my|ai|plugins`）
- `search:dir`：切换搜索方向（data=`repo|user|org`）
- `search:repos`：仓库搜索成功（data=GitHub Search API 返回 JSON）

### 4.3 浏览相关
- `dir:load`：目录加载完成（data={ path, items }）
- `file:open`：文件打开完成（data={ file, text }）

> 目前 Hook 触发点不算多，但足够实现“在某些页面插入按钮/自动行为/分析”等插件功能。

---

## 5. 插件加载、卸载与持久化

### 5.1 加载来源
插件管理页面提供三种方式：
1) 导入本地 `.js`
2) 粘贴代码加载
3) 从 GitHub URL 导入（支持 blob/tree，最终会转成 raw 链接）

### 5.2 安全确认
`loadPlugin(code, save=true)` 在 save 为 true 时会弹出 **安全警告 confirm**，用户确认后才执行插件代码。

### 5.3 持久化规则（localStorage）
存储键：`github_panel_storage`

保存内容大致为：

```json
{
  "token": "...",
  "plugins": [
    { "id": "...", "code": "...", "enabled": true }
  ]
}
```

- 插件代码会被保存到 localStorage，下次加载自动启用。
- 同时也会把 `token` 一并存储（这是扩展原有行为，插件无关，但要注意安全性）。

### 5.4 卸载
`manager.unloadPlugin(id)`：
- 删除注入的 style（如果有）
- 从内存 Map 移除
- 更新 localStorage

---

## 6. 推荐的插件编写模板

把下面代码保存为 `plugin.js`，在插件管理页导入即可：

```js
plugin.id = "demo.quick-tools";
plugin.name = "Quick Tools Demo";
plugin.version = "1.0.0";

plugin.style = `
  .demoQuickBtn { margin-left: 6px; }
`;

plugin.init = ({ core, ui, components, utils, extension, manager }) => {
  // 在 UI ready 之前 init 也会执行，但一般 ui 已存在（取决于加载时机）
  // 保险做法：如果 ui.mainArea 不存在，就等 hook: ui:ready
  if (ui && ui.tabs) {
    const btn = components.createWindowButton("快捷：进入当前仓库根目录");
    btn.className = "demoQuickBtn";
    btn.onclick = () => {
      if (!core.currentOwner || !core.currentRepo) {
        alert("还未进入仓库");
        return;
      }
      extension._switchMode("browse");       // 调用内部方法（非公开）
      extension.loadDir("");                // 回到根目录
    };
    ui.tabs.appendChild(btn);
  }
};

plugin.onHook = ({}, hookName, data) => {
  // 这里写错了签名也不会报错，但建议使用正确签名：
};
```

注意：上面最后 `plugin.onHook` 的签名示例故意留了提醒——**正确签名应为：**

```js
plugin.onHook = (hookName, data) => { ... }
```

---

## 7. 示例：监听打开文件并自动送去 AI（带缓存上下文）

```js
plugin.id = "demo.auto-ai";
plugin.name = "Auto Send File To AI";
plugin.version = "1.0.0";

plugin.init = ({ core }) => {
  // 可以放一些默认设置
  core.cacheManager.clearRepoCache();
};

plugin.onHook = (hookName, data) => {
  // 注意：这里只能拿到 hookName/data。需要 context 可通过闭包在 init 里保存。
};
```

推荐写法（在 init 里闭包保存 context）：

```js
plugin.id = "demo.auto-ai";
plugin.name = "Auto Send File To AI";
plugin.version = "1.0.0";

plugin.init = (ctx) => {
  plugin._ctx = ctx;
};

plugin.onHook = async (hookName, data) => {
  const { core, extension, ui } = plugin._ctx;

  if (hookName === "file:open") {
    // 自动把打开的文件内容写入 AI 输入框（不自动发送，避免误触发额度）
    extension._switchMode("ai");
    ui.aiPromptInput.value =
      `请用代码审查视角分析该文件，并给出：问题列表、风险、可维护性建议。\n\n` +
      `== FILE: ${data.file.path} ==\n` + data.text;
  }
};
```

---

## 8. 开发注意事项与最佳实践

1. **不要默认自动执行写操作**  
   `putFile/deleteFile/merge` 等操作应二次确认，避免插件误删。

2. **尽量只读**  
   通过 `api.fetchJson` + UI 扩展实现增强功能最安全。

3. **避免阻塞 UI**  
   大量循环/递归（尤其仓库遍历）要显示状态并允许中止。

4. **Hook 要容错**  
   `onHook` 内异常会被捕获并打印，但仍可能影响用户体验，建议 try/catch。

5. **不要假设 UI 一定存在**  
   插件可能在 UI 创建前就被加载（取决于 localStorage 恢复时机、用户是否打开面板）。建议在 `ui:ready` hook 里进行 DOM 注入。

---

## 9. 当前 Hook 列表（便于查阅）

- `ui:ready`
- `ui:show`
- `ui:hide`
- `mode:switch`
- `search:dir`
- `search:repos`
- `dir:load`
- `file:open`

---
#API
下面把“插件可用的所有 API”按**实际暴露给插件的 context**完整列出（并补充其来源/用途）。注意：这不是 GitHub 官方 API 列表，而是此扩展对插件开放的内部对象与方法全集（基于你给的源码）。

---

## 0) 插件入口 API（必须遵守）

插件必须返回/修改的 `plugin` 对象字段：

- `plugin.id: string`（必填）
- `plugin.name: string`
- `plugin.version: string`
- `plugin.style: string`（可选，注入到 `<style id="plugin-style-${id}">`）
- `plugin.init(context): void`
- `plugin.onHook(hookName: string, data: any): void`

---

## 1) 插件上下文 API：`context`（PluginManager.get context）

插件工厂函数 `new Function('context', ...)` 执行时，可直接使用：

### 1.1 `context.core`（GitHubPanelCore 实例）
> 核心状态 + 子模块实例（api/ai/cache）+ 若干辅助方法

**字段（全部）**
- `core.token: string`
- `core.aiProvider: 'github' | 'siliconflow' | 'custom'`
- `core.siliconKey: string`
- `core.siliconModel: string`
- `core.siliconParams: { temperature: number, maxTokens: number }`
- `core.customAI: { url: string, key: string, model: string }`
- `core.sfTranslateEnabled: boolean`
- `core.sfTranslateModel: string`
- `core.githubModel: string`

- `core.currentOwner: string`
- `core.currentRepo: string`
- `core.currentPath: string`
- `core.currentBranch: string`
- `core.defaultBranch: string`
- `core.viewMode: string`（如 `list/file/create`）
- `core.isEditMode: boolean`
- `core.currentFileSha: string|null`

- `core.panelMode: 'normal'|'minimized'|'fullscreen'`
- `core.mode: 'search'|'browse'|'trending'|'my'|'ai'|'plugins'`
- `core.searchDir: 'repo'|'user'|'org'`

- `core.repoSearchPage: number`
- `core.userSearchPage: number`
- `core.orgSearchPage: number`

- `core._objectUrlToRevoke: string|null`
- `core._repoCacheAbort: boolean`

- `core.lastSelection: { start:number, end:number }`
- `core.isMarkdownPreview: boolean`

- `core.cacheManager: CacheManager`
- `core.apiManager: APIManager`
- `core.aiManager: AIManager`
- `core.pluginManager: PluginManager`（由扩展赋值）

**方法（全部）**
- `core.getAIConfig(): object`
- `core.updateAIConfig(): void`
- `core.setToken(token: string): void`
- `core.setAIProvider(provider: string): void`
- `core.setSiliconKey(key: string): void`
- `core.setSiliconTranslator(state: 'on'|'off', model: string): void`
- `core._revokeObjectUrl(): void`（内部用：释放预览图片 objectURL）

---

### 1.2 `context.ui`（扩展 UI 引用集合）
> UI 在 `_createUI()` 里动态挂载到 `this.ui`，字段很多；插件能直接操作 DOM。

**常见字段（源码里明确出现/赋值的）**
- `ui.panel`
- `ui.header`
- `ui.btnMinimize / ui.btnFullscreen / ui.btnClose`
- `ui.tabs`
- `ui.tabSearchBtn / ui.tabBrowseBtn / ui.tabTrendingBtn / ui.tabMyBtn / ui.tabAIBtn / ui.tabPluginsBtn`
- `ui.searchDirSelectWrap / ui.searchDirSelect`
- `ui.searchArea / ui.browseArea / ui.aiArea / ui.trendingArea / ui.myArea / ui.pluginsArea`
- `ui.statusLabel`
- `ui.mainArea`
- `ui._panelBody`

**Search 区域字段**
- `ui.repoSearchInput`
- `ui.repoLangSelect / ui.repoStarsSelect / ui.repoForksSelect / ui.repoFollowersSelect / ui.repoSizeSelect`
- `ui.repoPerPageSelect / ui.repoSortSelect`
- `ui.repoPrevBtn / ui.repoNextBtn / ui._repoPageLabel`
- `ui.userSearchInput / ui.userPerPageSelect / ui.userSortSelect`
- `ui.userPrevBtn / ui.userNextBtn / ui._userPageLabel`
- `ui.orgSearchInput / ui.orgPerPageSelect / ui.orgSortSelect`
- `ui.orgPrevBtn / ui.orgNextBtn / ui._orgPageLabel`
- `ui._repoControls / ui._userControls / ui._orgControls`

**Browse 区域字段**
- `ui.ownerInput / ui.repoInput`
- `ui.pathLabel`
- `ui.actionRow`
- `ui.branchSelect`
- `ui.btnAddFolder / ui.btnDeleteFile`

**AI 区域字段**
- `ui.aiConfigContainer`
- `ui.aiSystemInput`
- `ui.aiPromptInput`
- `ui.aiStartBtn / ui.aiStopBtn / ui.aiClearBtn / ui.aiCopyBtn`
- `ui.aiOutputPre`
- `ui.aiCacheBtn / ui.aiCacheReviewBtn / ui.aiCacheClearBtn`
- `ui.aiCacheInfo`

**Plugins 区域字段**
- `ui.pluginsList`

**编辑器/右键 AI 改写相关（打开文件后才出现）**
- `ui.editorTextarea`
- `ui.fileViewRefs`（含 `preWrap/textarea/saveBtn/editBtn/pre/transPanel/transContent`）
- `ui.contextMenu`
- `ui.aiRewritePanel`

> 由于这些字段是运行时按流程创建的，插件使用前应判空。

---

### 1.3 `context.api`（APIManager 实例）
等同于 `context.core.apiManager`。

**字段/属性**
- `api.token: string`
- `api.headers: object`（getter，按 token 生成 Authorization）

**方法（全部）**
- `api.fetchJson(url: string): Promise<any>`
- `api.fetchBlob(owner: string, repo: string, sha: string): Promise<Blob>`
- `api.putFile(owner, repo, path, contentBase64, message, branch, sha?=null): Promise<any>`
- `api.deleteFile(owner, repo, path, sha, branch, message): Promise<void>`
- `api.triggerWorkflow(owner, repo, workflowId, branch): Promise<void>`
- `api.mergeBranch(owner, repo, base, head, message): Promise<Response>`
- `api.forkRepo(owner, repo): Promise<any>`
- `api.createPullRequest(owner, repo, title, head, base, bodyText): Promise<any>`

---

### 1.4 `context.utils`（Utils 工具类）
**静态方法（全部）**
- `Utils.btnStyle(): object`
- `Utils.itemStyle(): object`
- `Utils.input(placeholder: string): HTMLInputElement`
- `Utils.select(options: Array<string|{value,text}>, label: string): { el:HTMLElement, sel:HTMLSelectElement }`
- `Utils.applySelectLabels(sel: HTMLSelectElement, map: Record<string,string>): void`
- `Utils.copyToClipboard(text: string): Promise<void>`
- `Utils.download(blob: Blob, name: string): void`
- `Utils.parseMarkdown(text: string, owner?:string, repo?:string, branch?:string): string`（返回 HTML 字符串）

---

### 1.5 `context.components`（UIComponents 组件工厂）
**静态方法（全部）**
- `UIComponents.createPanel(): HTMLDivElement`
- `UIComponents.createHeader(titleText: string): { header:HTMLElement, winCtrls:HTMLElement }`
- `UIComponents.createWindowButton(text: string, style: object = {}): HTMLButtonElement`
- `UIComponents.createTabs(): HTMLDivElement`
- `UIComponents.createTabButton(text: string, active=false): HTMLButtonElement`
- `UIComponents.createMainArea(): HTMLDivElement`
- `UIComponents.createStatusLabel(): HTMLDivElement`

---

### 1.6 `context.extension`（GitHubPanelExtension 实例）
> 插件可直接调用扩展的“公开 opcode 方法”和大量内部方法（下划线开头也能调用，因为 JS 不阻止访问）。

**公开方法（getInfo blocks 对应）**
- `extension.showPanel(): void`
- `extension.hidePanel(): void`
- `extension.setToken(args): void`
- `extension.setAIProvider(args): void`
- `extension.setSiliconKey(args): void`
- `extension.setSiliconTranslator(args): void`

**主要业务方法（非下划线但属于内部能力）**
- `extension.searchRepos(): Promise<void>`
- `extension.searchUsers(): Promise<void>`
- `extension.searchOrgs(): Promise<void>`
- `extension.loadDir(path: string): Promise<void>`
- `extension.openFile(fileItem: any): Promise<void>`

**内部方法（源码定义的全部，均可被插件调用）**
_UI/模式/状态_
- `_createUI()`
- `_bindEvents()`
- `_switchMode(mode)`
- `_switchSearchDir(dir)`
- `_toggleMinimize()`
- `_toggleFullscreen()`
- `_applyPanelMode()`
- `_renderActionRow()`

_插件页_
- `_createPluginsArea()`
- `_refreshPluginsList()`

_搜索 UI 构建_
- `_createSearchArea()`
- `_createRepoItem(item)`

_Browse UI 构建_
- `_createBrowseArea()`
- `_refreshFromInputs()`
- `_loadBranches()`
- `_goBack()`

_AI UI 构建与功能_
- `_createAIArea()`
- `_refreshAIConfigUI()`
- `_renderAIOutput()`
- `_renderAICacheInfo()`
- `_startAIStream(prompt)`
- `_startAIStreamWithSystem(system, prompt)`
- `_cacheWholeRepoForAI()`
- `_showCacheReviewUI()`

_Trending/My/Repo 管理_
- `_createTrendingArea()`
- `_createMyArea()`
- `_loadTrending(period)`
- `_loadMyRepos()`
- `_showCreateRepoUI()`
- `_createRepo(data)`
- `_deleteRepoSequence(fullName)`

_仓库功能：PR/分支/历史/贡献/活动_
- `_showRepoHistory()`
- `_showPullRequests()`
- `_showCreateBranchUI()`
- `_showMergeUI()`
- `_showCreatePRUI()`
- `_handleForkRepo()`
- `_showRepoContributors()`
- `_showRepoActivity()`

_文件/目录操作_
- `_loadFolderReadme(url)`
- `_showAddFolderUI()`
- `_showDeleteFileUI()`
- `_deleteFileWithDoubleConfirm(path)`
- `_deleteFile(path, message)`
- `_showCreateUI()`
- `_showUploadUI()`
- `_toggleEditMode(path)`
- `_saveFileChanges(path)`
- `_downloadRepoZip()`

_用户/组织详情_
- `_showUserDetails(login)`
- `_showOrgDetails(login)`
- `_showProfile(login, isOrg)`
- `_fetchReadme(owner, repo)`

_可视化/编辑器增强_
- `_generateFileHeatmap(path)`
- `_handleEditorContextMenu(e)`
- `_showAIRewritePanel()`

---

### 1.7 `context.manager`（PluginManager 实例）
**字段**
- `manager.plugins: Map<string, plugin>`
- `manager.hooks: Map`（当前源码未实用，但存在）
- `manager.extension: GitHubPanelExtension`

**方法（全部）**
- `manager.loadPlugin(code: string, id?: string|null, save=true): Promise<plugin>`
- `manager.unloadPlugin(id: string): void`
- `manager.trigger(hookName: string, data?: any): void`
- `manager.importFromGitHub(url: string): Promise<void>`

（以及内部方法，通常不建议插件调用）
- `manager._loadFromStorage()`
- `manager._saveToStorage()`

---

## 2) 其它“全局可用”但非 context 的能力（因为插件是任意 JS）
由于插件代码通过 `new Function(...)` 执行，默认仍可访问浏览器全局对象与 Web API，例如：
- `fetch`, `localStorage`, `document`, `window`
- `navigator.clipboard`
- `URL.createObjectURL`, `Blob`, `TextDecoder` 等

这部分不属于扩展定义的 API，但插件天然可用。

---

