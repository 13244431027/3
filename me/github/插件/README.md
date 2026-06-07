>**此文档为AI自动生成**    
>[插件API仓库](me/github/插件)    
>[免责声明](me/github/插件/免责声明.md)
# 1. 插件系统概览

GitHub 面板 Pro+ 内置了一个插件系统，由 `PluginManager` 管理。

插件本质上是一段 JavaScript 代码，会通过：

```js
new Function('context', `...插件代码...`)
```

动态执行。

插件拥有较高权限，可以访问：

- GitHub 面板核心对象
- UI 对象
- GitHub API 管理器
- 工具函数
- UI 组件工厂
- 扩展实例
- 插件管理器
- GitHub Token
- DOM
- `fetch`
- `localStorage`
- `window`
- `document`

因此插件能力很强，但风险也很高。

---

# 2. 插件加载方式

目前支持三种插件加载方式。

## 2.1 从插件集市加载

面板顶部有：

```text
插件集市
```

点击后会打开插件集市窗口。

默认配置：

```js
owner: "13244431027"
repo: "3"
branch: "main"
dir: "me/github/插件"
```

插件集市会从该 GitHub 目录中读取 `.js` 文件，并忽略 `README.md`。

加载规则：

- 只显示 `.js` 文件
- 忽略 `README.md`
- 点击“安装/加载”后调用：

```js
pluginManager.importFromGitHub(rawUrl)
```

再进入正常插件加载流程。

---

## 2.2 从 GitHub URL 导入

在“插件”标签页中可以输入 GitHub URL。

支持：

### Raw 文件

```text
https://raw.githubusercontent.com/owner/repo/branch/path/plugin.js
```

### GitHub 文件页面

```text
https://github.com/owner/repo/blob/main/path/plugin.js
```

会自动转换成 Raw URL。

### GitHub 文件夹页面

```text
https://github.com/owner/repo/tree/main/path/to/plugin-folder
```

如果路径不是 `.js` 结尾，会自动尝试加载：

```text
path/to/plugin-folder/plugin.js
```

---

## 2.3 导入本地 `.js`

在“插件”标签页点击：

```text
导入本地插件 (.js)
```

选择本地 JavaScript 文件后加载。

---

## 2.4 粘贴插件代码

在“插件”标签页可以直接粘贴插件代码，然后点击：

```text
加载粘贴的代码
```

---

# 3. 插件加载安全确认

每次手动加载插件时都会弹出安全警告：

```text
【安全警告】
将加载外部插件！
插件 API 系统已 100% 暴露内部核心权限 (Token, 网络请求, 弹窗控制等)。
继续加载未知插件可能导致数据损坏或隐私泄露。
出现问题概不负责！

确定要继续加载吗？
```

如果用户取消，则插件不会加载。

注意：从 `localStorage` 自动恢复插件时不会再次弹窗。

---

# 4. 插件基本结构

插件代码在执行前会预置一个默认对象：

```js
const plugin = {
  id: "temp-时间戳",
  name: "Unknown Plugin",
  version: "0.0.1",
  description: "",
  tags: [],
  init: () => {},
  onHook: () => {},
  style: ""
};
```

插件代码需要修改这个 `plugin` 对象，然后最终返回。

插件最基本示例：

```js
plugin.id = "hello-plugin";
plugin.name = "Hello Plugin";
plugin.version = "1.0.0";
plugin.description = "一个简单的测试插件";
plugin.tags = ["demo", "test"];

plugin.init = (context) => {
  alert("Hello Plugin 已加载！");
};

plugin.onHook = (hookName, data) => {
  console.log("收到 Hook:", hookName, data);
};
```

---

# 5. 插件元数据

插件可以声明以下元数据。

## 5.1 `plugin.id`

插件唯一 ID。

```js
plugin.id = "my-plugin";
```

要求：

- 必须存在
- 用于插件管理、卸载、样式 ID、存储
- 如果多个插件 ID 相同，后加载的会覆盖前面的 Map 记录，但旧插件副作用不一定会完全移除

---

## 5.2 `plugin.name`

插件名称。

```js
plugin.name = "我的插件";
```

显示在插件管理列表中。

---

## 5.3 `plugin.version`

插件版本。

```js
plugin.version = "1.0.0";
```

显示在插件管理列表中。

---

## 5.4 `plugin.description`

插件简介。

```js
plugin.description = "这是一个用于增强 GitHub 面板的插件";
```

用途：

- 插件管理页显示
- 插件集市搜索
- 插件集市列表展示

插件集市会通过正则提取：

```js
plugin.description = "简介";
```

注意：当前提取逻辑只支持简单字符串赋值。

支持：

```js
plugin.description = "abc";
plugin.description = 'abc';
```

不稳定或不支持：

```js
plugin.description = `abc`;
plugin.description = someVariable;
```

---

## 5.5 `plugin.tags`

插件标签。

```js
plugin.tags = ["github", "ui", "tools"];
```

用途：

- 插件管理页展示
- 插件集市搜索
- 插件集市列表显示

插件集市会通过正则提取：

```js
plugin.tags = ["tag1", "tag2"];
```

---

## 5.6 `plugin.style`

插件 CSS 样式。

```js
plugin.style = `
.my-plugin-btn {
  background: red;
}
`;
```

加载插件时，如果 `plugin.style` 不为空，会自动创建：

```html
<style id="plugin-style-插件ID">...</style>
```

卸载插件时会删除该样式元素。

---

# 6. 插件生命周期

## 6.1 加载流程

调用：

```js
pluginManager.loadPlugin(code, id = null, save = true)
```

大致流程：

1. 如果 `save === true`，弹出安全确认
2. 使用 `new Function('context', 插件代码)` 构造插件工厂函数
3. 创建默认 `plugin` 对象
4. 执行插件代码
5. 返回 `plugin`
6. 检查 `plugin.id`
7. 如果有 `plugin.style`，注入 CSS
8. 调用：

```js
plugin.init(context)
```

9. 保存插件对象到：

```js
pluginManager.plugins
```

10. 如果 `save === true`，保存到 `localStorage`

---

## 6.2 初始化函数 `plugin.init`

定义：

```js
plugin.init = (context) => {
  // 插件初始化逻辑
};
```

加载时只调用一次。

常见用途：

- 创建按钮
- 修改 UI
- 绑定事件
- 注册额外面板
- 初始化插件状态
- 读取配置
- 调用 GitHub API

示例：

```js
plugin.init = ({ ui, components }) => {
  const btn = components.createWindowButton("我的按钮");
  btn.onclick = () => alert("点击了插件按钮");

  if (ui.tabs) {
    ui.tabs.appendChild(btn);
  }
};
```

---

## 6.3 Hook 函数 `plugin.onHook`

定义：

```js
plugin.onHook = (hookName, data) => {
  // 响应事件
};
```

扩展内部通过：

```js
pluginManager.trigger(hookName, data)
```

通知所有插件。

示例：

```js
plugin.onHook = (hookName, data) => {
  if (hookName === "file:open") {
    console.log("打开了文件:", data.file.path);
    console.log("文件内容:", data.text);
  }
};
```

---

## 6.4 卸载插件

调用：

```js
pluginManager.unloadPlugin(id)
```

卸载流程：

1. 找到插件
2. 删除插件 CSS：

```js
plugin._styleEl.remove()
```

3. 从插件 Map 中删除
4. 更新 `localStorage`

注意：当前插件系统没有标准的 `destroy` / `dispose` 生命周期。

也就是说：

- 插件自己添加的 DOM 不会自动删除
- 插件自己绑定的事件不会自动解绑
- 插件创建的定时器不会自动清除
- 插件修改过的全局状态不会自动恢复

建议插件自己实现清理逻辑，并提供按钮或 Hook 处理。

---

# 7. 插件执行上下文 `context`

插件代码执行时会收到一个 `context` 对象。

源码中：

```js
get context() {
  return {
    core: this.extension.core,
    ui: this.extension.ui,
    api: this.extension.core.apiManager,
    utils: Utils,
    components: UIComponents,
    extension: this.extension,
    manager: this
  };
}
```

插件中可以直接解构使用：

```js
plugin.init = (context) => {
  const { core, ui, api, utils, components, extension, manager } = context;
};
```

在插件代码顶层也可以直接使用这些变量，因为加载器内部写了：

```js
const { core, ui, api, utils, components, extension, manager } = context;
```

所以插件中可以直接写：

```js
plugin.init = () => {
  console.log(core.currentOwner);
};
```

---

# 8. `context.core` 核心对象

`core` 是 `GitHubPanelCore` 实例，保存扩展主要状态。

## 8.1 Token 与 AI 配置

```js
core.token
core.aiProvider
core.customAI
core.githubModel
```

### `core.token`

GitHub Token。

```js
console.log(core.token);
core.setToken("ghp_xxx");
```

注意：插件可以读取 Token，风险极高。

---

### `core.aiProvider`

当前 AI 提供商。

可选值：

```js
"github"
"custom"
```

修改：

```js
core.setAIProvider("custom");
```

---

### `core.customAI`

自定义 AI 配置：

```js
core.customAI = {
  url: "https://api.openai.com/v1/chat/completions",
  key: "",
  model: "gpt-3.5-turbo"
};
```

---

### `core.githubModel`

GitHub Models 使用的模型：

```js
core.githubModel = "gpt-4o";
core.githubModel = "gpt-4o-mini";
core.githubModel = "custom:模型名";
```

---

### `core.updateAIConfig()`

当插件修改 Token、AI Provider、模型等配置后，可调用：

```js
core.updateAIConfig();
```

它会同步更新：

```js
core.apiManager.token
core.aiManager.config
```

---

## 8.2 当前仓库状态

```js
core.currentOwner
core.currentRepo
core.currentPath
core.currentBranch
core.defaultBranch
```

示例：

```js
console.log(core.currentOwner, core.currentRepo);
```

含义：

| 字段 | 说明 |
|---|---|
| `currentOwner` | 当前仓库 Owner |
| `currentRepo` | 当前仓库名 |
| `currentPath` | 当前浏览目录路径 |
| `currentBranch` | 当前分支 |
| `defaultBranch` | 默认分支 |

---

## 8.3 当前视图状态

```js
core.viewMode
core.isEditMode
core.currentFileSha
```

### `core.viewMode`

可能值：

```js
"list"
"file"
"create"
```

### `core.isEditMode`

当前是否处于文件编辑模式。

### `core.currentFileSha`

当前打开文件的 SHA。

---

## 8.4 面板状态

```js
core.panelMode
core.mode
core.searchDir
```

### `core.panelMode`

可能值：

```js
"normal"
"minimized"
"fullscreen"
```

### `core.mode`

当前主标签模式：

```js
"search"
"browse"
"trending"
"my"
"ai"
"plugins"
```

### `core.searchDir`

搜索方向：

```js
"repo"
"user"
"org"
```

---

## 8.5 搜索分页状态

```js
core.repoSearchPage
core.userSearchPage
core.orgSearchPage
```

---

## 8.6 Markdown / 编辑器状态

```js
core.lastSelection
core.isMarkdownPreview
```

---

## 8.7 插件集市状态

```js
core.marketplaceState
```

结构：

```js
{
  owner: "13244431027",
  repo: "3",
  branch: "main",
  dir: "me/github/插件",
  items: [],
  lastLoadedAt: 0,
  searchKeyword: ""
}
```

插件可以修改插件集市默认源：

```js
core.marketplaceState.owner = "yourname";
core.marketplaceState.repo = "yourrepo";
core.marketplaceState.branch = "main";
core.marketplaceState.dir = "plugins";
```

---

## 8.8 缓存管理器

```js
core.cacheManager
```

类型：`CacheManager`

用于 API 缓存和 AI 仓库上下文缓存。

---

## 8.9 API 管理器

```js
core.apiManager
```

等同于 `context.api`。

---

## 8.10 AI 管理器

```js
core.aiManager
```

类型：`AIManager`

可用于流式 AI 请求。

---

# 9. `context.api` GitHub API 管理器

`api` 是 `APIManager` 实例。

## 9.1 `api.headers`

返回 GitHub 请求头。

```js
api.headers
```

如果设置了 Token：

```js
{
  Authorization: `token ${token}`
}
```

---

## 9.2 `api.fetchJson(url)`

请求 JSON API，并使用缓存。

```js
const data = await api.fetchJson("https://api.github.com/repos/owner/repo");
```

特性：

- 默认带 GitHub Accept Header
- 如果设置 Token，会自动携带
- 使用 `CacheManager.instance` 缓存
- 默认 TTL 为 15 秒

---

## 9.3 `api.fetchBlob(owner, repo, sha)`

根据 blob SHA 获取二进制内容。

```js
const blob = await api.fetchBlob("owner", "repo", "sha");
```

请求地址：

```js
https://api.github.com/repos/{owner}/{repo}/git/blobs/{sha}
```

使用：

```js
const blob = await api.fetchBlob(core.currentOwner, core.currentRepo, file.sha);
```

---

## 9.4 `api.putFile(owner, repo, path, content, message, branch, sha = null)`

创建或更新文件。

```js
await api.putFile(
  "owner",
  "repo",
  "path/file.txt",
  btoa(unescape(encodeURIComponent("文件内容"))),
  "Commit message",
  "main"
);
```

参数：

| 参数 | 说明 |
|---|---|
| `owner` | 仓库 owner |
| `repo` | 仓库名 |
| `path` | 文件路径 |
| `content` | Base64 内容 |
| `message` | Commit message |
| `branch` | 分支 |
| `sha` | 更新已有文件时需要传入旧 SHA |

创建文件时：

```js
await api.putFile(owner, repo, path, base64Content, "Create file", branch);
```

更新文件时：

```js
await api.putFile(owner, repo, path, base64Content, "Update file", branch, oldSha);
```

要求：

- 必须设置 Token

---

## 9.5 `api.deleteFile(owner, repo, path, sha, branch, message)`

删除文件。

```js
await api.deleteFile(
  "owner",
  "repo",
  "path/file.txt",
  "fileSha",
  "main",
  "Delete file"
);
```

要求：

- 必须设置 Token
- 需要文件 SHA

---

## 9.6 `api.triggerWorkflow(owner, repo, workflowId, branch)`

触发 GitHub Actions Workflow Dispatch。

```js
await api.triggerWorkflow(
  "owner",
  "repo",
  "build.yml",
  "main"
);
```

请求：

```text
POST /repos/{owner}/{repo}/actions/workflows/{workflowId}/dispatches
```

要求：

- 必须设置 Token
- Token 需要有 Actions 相关权限

---

## 9.7 `api.mergeBranch(owner, repo, base, head, message)`

合并分支。

```js
const res = await api.mergeBranch(
  "owner",
  "repo",
  "main",
  "dev",
  "Merge dev into main"
);
```

返回原始 `Response` 对象。

调用者需要判断：

```js
if (res.status === 201 || res.status === 200) {
  // 成功
} else if (res.status === 204) {
  // 已合并，无需操作
} else if (res.status === 409) {
  // 冲突
}
```

---

## 9.8 `api.forkRepo(owner, repo)`

Fork 仓库。

```js
const fork = await api.forkRepo("owner", "repo");
```

要求：

- 必须设置 Token

---

## 9.9 `api.createPullRequest(owner, repo, title, head, base, bodyText)`

创建 Pull Request。

```js
const pr = await api.createPullRequest(
  "owner",
  "repo",
  "PR 标题",
  "dev",
  "main",
  "PR 描述"
);
```

---

# 10. `context.utils` 工具函数

`utils` 对应 `Utils` 类。

## 10.1 `utils.btnStyle()`

返回默认按钮样式对象。

```js
const btn = document.createElement("button");
Object.assign(btn.style, utils.btnStyle());
```

---

## 10.2 `utils.itemStyle()`

返回默认列表项样式。

```js
const row = document.createElement("div");
Object.assign(row.style, utils.itemStyle());
```

---

## 10.3 `utils.input(placeholder)`

创建一个带默认样式的输入框。

```js
const input = utils.input("请输入内容");
```

返回：

```js
HTMLInputElement
```

---

## 10.4 `utils.select(options, label)`

创建一个带标签的下拉框。

```js
const lang = utils.select(["js", "py"], "语言");
```

返回：

```js
{
  el: HTMLDivElement,
  sel: HTMLSelectElement
}
```

支持字符串数组：

```js
utils.select(["repo", "user", "org"], "搜索方向");
```

也支持对象数组：

```js
utils.select([
  { text: "GitHub", value: "github" },
  { text: "自定义", value: "custom" }
], "AI 提供商");
```

---

## 10.5 `utils.applySelectLabels(sel, map)`

批量修改 select 选项显示文本。

```js
utils.applySelectLabels(selectEl, {
  github: "GitHub 默认",
  custom: "自定义"
});
```

---

## 10.6 `utils.copyToClipboard(text)`

复制文本到剪贴板。

```js
await utils.copyToClipboard("hello");
```

---

## 10.7 `utils.download(blob, name)`

下载 Blob。

```js
utils.download(blob, "file.txt");
```

---

## 10.8 `utils.parseMarkdown(text, owner, repo, branch)`

将简单 Markdown 转为 HTML。

```js
const html = utils.parseMarkdown(markdownText, "owner", "repo", "main");
```

支持：

- 标题 `#`
- 加粗 `**text**`
- 斜体 `*text*`
- 链接
- 图片
- 无序列表
- 引用
- 代码块
- 表格
- GitHub 仓库内相对图片路径转 Raw URL

注意：这是简易 Markdown 解析器，不是完整 Markdown 引擎，并且直接返回 HTML，使用时要注意 XSS 风险。

---

# 11. `context.components` UI 组件

`components` 对应 `UIComponents` 类。

## 11.1 `components.createPanel()`

创建主面板样式的 `div`。

```js
const panel = components.createPanel();
```

---

## 11.2 `components.createHeader(titleText)`

创建标题栏。

```js
const { header, winCtrls } = components.createHeader("标题");
```

返回：

```js
{
  header,
  winCtrls
}
```

---

## 11.3 `components.createWindowButton(text, style = {})`

创建默认样式按钮。

```js
const btn = components.createWindowButton("按钮");
```

可传入额外样式：

```js
const btn = components.createWindowButton("危险操作", {
  background: "rgba(255,80,80,0.3)"
});
```

---

## 11.4 `components.createTabs()`

创建 tabs 容器。

```js
const tabs = components.createTabs();
```

---

## 11.5 `components.createTabButton(text, active = false)`

创建标签按钮。

```js
const btn = components.createTabButton("我的标签", true);
```

---

## 11.6 `components.createMainArea()`

创建主显示区域。

```js
const main = components.createMainArea();
```

---

## 11.7 `components.createStatusLabel()`

创建状态标签。

```js
const status = components.createStatusLabel();
```

---

## 11.8 `components.injectMarketplaceCSS()`

注入插件集市 CSS。

```js
components.injectMarketplaceCSS();
```

一般不需要插件主动调用，主 UI 创建时已调用。

---

# 12. `context.ui` UI 引用

`ui` 是扩展保存的 DOM 引用集合。

不同阶段可用字段不同，必须判断是否存在。

常用字段：

```js
ui.panel
ui.header
ui.tabs
ui.mainArea
ui.statusLabel
```

## 12.1 主面板相关

```js
ui.panel
ui.header
ui.btnMinimize
ui.btnFullscreen
ui.btnClose
ui._panelBody
```

---

## 12.2 标签按钮

```js
ui.tabSearchBtn
ui.tabBrowseBtn
ui.tabTrendingBtn
ui.tabMyBtn
ui.tabAIBtn
ui.tabPluginsBtn
```

---

## 12.3 标签区域

```js
ui.searchArea
ui.browseArea
ui.aiArea
ui.trendingArea
ui.myArea
ui.pluginsArea
```

---

## 12.4 搜索相关

```js
ui.searchDirSelectWrap
ui.searchDirSelect

ui.repoSearchInput
ui.repoLangSelect
ui.repoStarsSelect
ui.repoForksSelect
ui.repoFollowersSelect
ui.repoSizeSelect
ui.repoPerPageSelect
ui.repoSortSelect
ui.repoPrevBtn
ui.repoNextBtn
ui._repoPageLabel

ui.userSearchInput
ui.userPerPageSelect
ui.userSortSelect
ui.userPrevBtn
ui.userNextBtn
ui._userPageLabel

ui.orgSearchInput
ui.orgPerPageSelect
ui.orgSortSelect
ui.orgPrevBtn
ui.orgNextBtn
ui._orgPageLabel
```

---

## 12.5 浏览仓库相关

```js
ui.ownerInput
ui.repoInput
ui.pathLabel
ui.actionRow
ui.branchSelect
ui.btnAddFolder
ui.btnDeleteFile
```

---

## 12.6 AI 相关

```js
ui.aiConfigContainer
ui.aiSystemInput
ui.aiPromptInput
ui.aiStartBtn
ui.aiStopBtn
ui.aiClearBtn
ui.aiCopyBtn
ui.aiOutputPre
ui.aiCacheBtn
ui.aiCacheReviewBtn
ui.aiCacheClearBtn
ui.aiCacheInfo
```

---

## 12.7 插件管理相关

```js
ui.pluginsList
```

---

## 12.8 文件编辑相关

打开文件后可能存在：

```js
ui.editorTextarea
ui.fileViewRefs
```

其中：

```js
ui.fileViewRefs = {
  preWrap,
  textarea,
  saveBtn,
  editBtn,
  pre
}
```

---

## 12.9 插件集市相关

```js
ui.marketplace
```

结构：

```js
{
  overlay,
  win,
  list,
  status,
  inputs: {
    owner,
    repo,
    branch,
    dir,
    search
  }
}
```

---

# 13. `context.extension` 扩展实例

`extension` 是整个 `GitHubPanelExtension` 实例。

它包含大量方法，插件可以直接调用。

常用方法：

```js
extension.showPanel()
extension.hidePanel()
extension.setToken({ TOKEN: "..." })
extension.setAIProvider({ PROVIDER: "custom" })
```

也可以调用内部方法，例如：

```js
extension._switchMode("browse")
extension.loadDir("")
extension.searchRepos()
extension.searchUsers()
extension.searchOrgs()
```

注意：以下划线开头的方法属于内部方法，插件可以访问，但未来代码变化时可能不稳定。

---

# 14. `context.manager` 插件管理器

`manager` 是 `PluginManager` 实例。

## 14.1 `manager.plugins`

插件 Map。

```js
manager.plugins.forEach((plugin, id) => {
  console.log(id, plugin.name);
});
```

---

## 14.2 `manager.loadPlugin(code, id = null, save = true)`

加载插件代码。

```js
await manager.loadPlugin(code);
```

---

## 14.3 `manager.unloadPlugin(id)`

卸载插件。

```js
manager.unloadPlugin("my-plugin");
```

---

## 14.4 `manager.trigger(hookName, data)`

主动触发 Hook。

```js
manager.trigger("custom:event", {
  hello: "world"
});
```

其他插件可监听：

```js
plugin.onHook = (hookName, data) => {
  if (hookName === "custom:event") {
    console.log(data);
  }
};
```

---

## 14.5 `manager.importFromGitHub(url)`

从 GitHub 导入插件。

```js
await manager.importFromGitHub("https://github.com/owner/repo/blob/main/plugin.js");
```

---

# 15. Hook 事件列表

源码中调用了以下 Hook。

---

## 15.1 `ui:show`

触发时机：面板显示时。

```js
plugin.onHook = (hookName) => {
  if (hookName === "ui:show") {
    console.log("面板显示");
  }
};
```

触发代码：

```js
this.pluginManager.trigger('ui:show');
```

数据：无。

---

## 15.2 `ui:hide`

触发时机：面板隐藏时。

```js
plugin.onHook = (hookName) => {
  if (hookName === "ui:hide") {
    console.log("面板隐藏");
  }
};
```

数据：无。

---

## 15.3 `ui:ready`

触发时机：主 UI 创建完成后。

```js
this.pluginManager.trigger('ui:ready', this.ui);
```

数据：`ui` 对象。

示例：

```js
plugin.onHook = (hookName, ui) => {
  if (hookName === "ui:ready") {
    console.log("UI 已创建", ui);
  }
};
```

---

## 15.4 `mode:switch`

触发时机：切换主标签模式时。

```js
this.pluginManager.trigger('mode:switch', mode);
```

数据：当前模式字符串。

可能值：

```js
"search"
"browse"
"trending"
"my"
"ai"
"plugins"
```

示例：

```js
plugin.onHook = (hookName, mode) => {
  if (hookName === "mode:switch") {
    console.log("切换到模式:", mode);
  }
};
```

---

## 15.5 `search:dir`

触发时机：搜索方向切换时。

```js
this.pluginManager.trigger('search:dir', dir);
```

数据：

```js
"repo" | "user" | "org"
```

---

## 15.6 `search:repos`

触发时机：仓库搜索完成后。

```js
this.pluginManager.trigger('search:repos', data);
```

数据：GitHub Search Repositories API 返回值。

结构大致：

```js
{
  total_count,
  incomplete_results,
  items: [...]
}
```

示例：

```js
plugin.onHook = (hookName, data) => {
  if (hookName === "search:repos") {
    console.log("搜索到仓库数量:", data.total_count);
  }
};
```

---

## 15.7 `dir:load`

触发时机：仓库目录加载完成后。

```js
this.pluginManager.trigger('dir:load', {
  path,
  items
});
```

数据：

```js
{
  path: "当前目录路径",
  items: [GitHub contents item...]
}
```

示例：

```js
plugin.onHook = (hookName, data) => {
  if (hookName === "dir:load") {
    console.log("目录:", data.path);
    console.log("文件:", data.items);
  }
};
```

---

## 15.8 `file:open`

触发时机：文件打开并读取内容后。

```js
this.pluginManager.trigger('file:open', {
  file,
  text
});
```

数据：

```js
{
  file: GitHubContentFile,
  text: "文件文本内容"
}
```

示例：

```js
plugin.onHook = (hookName, data) => {
  if (hookName === "file:open") {
    console.log("打开文件:", data.file.path);
    console.log("内容:", data.text);
  }
};
```

---

# 16. 插件集市元数据提取规则

插件集市不仅显示 `.js` 文件名，还会异步读取每个插件源码，提取：

```js
plugin.description
plugin.tags
```

提取函数：

```js
_extractPluginMetadata(code)
```

## 16.1 简介提取

正则：

```js
/plugin\.description\s*=\s*["']([^"']*)["']/
```

支持：

```js
plugin.description = "这是简介";
plugin.description = '这是简介';
```

---

## 16.2 标签提取

正则：

```js
/plugin\.tags\s*=\s*\[(.*?)\]/s
```

然后继续提取数组内字符串：

```js
/["']([^"']*)["']/g
```

支持：

```js
plugin.tags = ["工具", "AI", "GitHub"];
```

---

## 16.3 搜索规则

插件集市搜索框会搜索：

- 文件名
- `plugin.description`
- `plugin.tags`

搜索为小写匹配：

```js
name.includes(keyword)
description.includes(keyword)
tag.includes(keyword)
```

---

# 17. 插件存储机制

插件和 Token 会保存到：

```js
localStorage["github_panel_storage"]
```

结构：

```js
{
  token: "GitHub Token",
  plugins: [
    {
      id: "plugin-id",
      code: "插件源码",
      enabled: true
    }
  ]
}
```

加载扩展时会自动读取：

```js
_loadFromStorage()
```

如果插件 `enabled === true`，则自动加载：

```js
this.loadPlugin(p.code, p.id, false)
```

注意：

- 自动加载时 `save = false`
- 不会弹安全确认
- 插件源码明文保存在 localStorage
- Token 也明文保存在 localStorage

---

# 18. 编写插件的推荐模板

```js
plugin.id = "example-plugin";
plugin.name = "示例插件";
plugin.version = "1.0.0";
plugin.description = "演示 GitHub 面板 Pro+ 插件 API 的基础用法";
plugin.tags = ["示例", "文档", "UI"];

plugin.style = `
.example-plugin-box {
  padding: 8px;
  border-radius: 8px;
  background: rgba(80,160,255,0.18);
  margin: 8px;
}
`;

plugin.init = (context) => {
  const { ui, components, core } = context;

  console.log("插件初始化");
  console.log("当前 Token 是否存在:", !!core.token);

  const btn = components.createWindowButton("示例插件按钮", {
    background: "rgba(80,160,255,0.25)"
  });

  btn.onclick = () => {
    alert(`当前模式：${core.mode}`);
  };

  if (ui.tabs) {
    ui.tabs.appendChild(btn);
  }
};

plugin.onHook = (hookName, data) => {
  if (hookName === "mode:switch") {
    console.log("模式切换:", data);
  }

  if (hookName === "file:open") {
    console.log("打开文件:", data.file.path);
  }
};
```

---

# 19. 常见插件示例

## 19.1 添加一个自定义按钮到顶部标签栏

```js
plugin.id = "top-button";
plugin.name = "顶部按钮插件";
plugin.version = "1.0.0";
plugin.description = "在顶部添加一个按钮";
plugin.tags = ["UI"];

plugin.init = ({ ui, components }) => {
  const btn = components.createWindowButton("我的工具", {
    background: "rgba(255,200,80,0.25)"
  });

  btn.onclick = () => {
    alert("你好，这是插件按钮！");
  };

  ui.tabs?.appendChild(btn);
};
```

---

## 19.2 打开文件后自动统计行数

```js
plugin.id = "line-counter";
plugin.name = "代码行数统计";
plugin.version = "1.0.0";
plugin.description = "打开文件后显示文件行数";
plugin.tags = ["文件", "统计"];

plugin.onHook = (hookName, data) => {
  if (hookName !== "file:open") return;

  const lines = data.text.split("\n").length;
  alert(`文件 ${data.file.name} 共 ${lines} 行`);
};
```

---

## 19.3 在目录加载后显示 JS 文件数量

```js
plugin.id = "js-file-counter";
plugin.name = "JS 文件计数器";
plugin.version = "1.0.0";
plugin.description = "目录加载后统计 JavaScript 文件数量";
plugin.tags = ["目录", "统计"];

plugin.onHook = (hookName, data) => {
  if (hookName !== "dir:load") return;

  const count = data.items.filter(item => {
    return item.type === "file" && item.name.endsWith(".js");
  }).length;

  console.log(`当前目录 JS 文件数量：${count}`);
};
```

---

## 19.4 调用 GitHub API 获取当前仓库信息

```js
plugin.id = "repo-info";
plugin.name = "仓库信息插件";
plugin.version = "1.0.0";
plugin.description = "读取当前仓库基本信息";
plugin.tags = ["GitHub", "API"];

plugin.init = ({ ui, components, core, api }) => {
  const btn = components.createWindowButton("仓库信息");

  btn.onclick = async () => {
    if (!core.currentOwner || !core.currentRepo) {
      alert("请先进入一个仓库");
      return;
    }

    const repo = await api.fetchJson(
      `https://api.github.com/repos/${core.currentOwner}/${core.currentRepo}`
    );

    alert(`仓库：${repo.full_name}\nStars：${repo.stargazers_count}`);
  };

  ui.tabs?.appendChild(btn);
};
```

---

## 19.5 创建一个文件

```js
plugin.id = "create-file-demo";
plugin.name = "创建文件示例";
plugin.version = "1.0.0";
plugin.description = "演示通过插件创建 GitHub 文件";
plugin.tags = ["GitHub", "写入"];

plugin.init = ({ ui, components, core, api }) => {
  const btn = components.createWindowButton("创建 demo.txt", {
    background: "rgba(40,167,69,0.4)"
  });

  btn.onclick = async () => {
    if (!core.token) {
      alert("请先设置 GitHub Token");
      return;
    }

    if (!core.currentOwner || !core.currentRepo) {
      alert("请先进入仓库");
      return;
    }

    const text = "Created by plugin";
    const base64 = btoa(unescape(encodeURIComponent(text)));

    await api.putFile(
      core.currentOwner,
      core.currentRepo,
      "demo.txt",
      base64,
      "Create demo.txt via plugin",
      core.currentBranch || core.defaultBranch
    );

    alert("创建成功");
  };

  ui.tabs?.appendChild(btn);
};
```

---

## 19.6 监听搜索结果并追加提示

```js
plugin.id = "search-hint";
plugin.name = "搜索提示插件";
plugin.version = "1.0.0";
plugin.description = "搜索仓库后在状态栏显示提示";
plugin.tags = ["搜索"];

plugin.onHook = (hookName, data) => {
  if (hookName === "search:repos") {
    LoadingManager.setMessage(`插件提示：本次搜索返回 ${data.items.length} 个仓库`);
  }
};
```

注意：`LoadingManager` 是全局类，插件可直接访问，但不在 `context` 中显式提供。

---

# 20. 可访问但未放入 context 的全局类

因为插件在同一作用域环境中执行，理论上可以访问源码中的全局类：

```js
Utils
ErrorHandler
LoadingManager
CacheManager
APIManager
AIManager
VirtualScroller
UIComponents
PluginManager
GitHubPanelCore
GitHubPanelExtension
```

但推荐优先使用 `context` 提供的：

```js
utils
components
api
core
manager
extension
ui
```

因为这些是官方插件上下文的一部分。

---

# 21. 插件与 AI 功能

插件可以调用 `core.aiManager`。

## 21.1 终止 AI 输出

```js
core.aiManager.abort();
```

---

## 21.2 流式请求

```js
await core.aiManager.stream([
  {
    role: "user",
    content: "你好"
  }
], (chunk) => {
  console.log("AI chunk:", chunk);
});
```

要求：

- 如果 `core.aiProvider === "github"`，需要 GitHub Token
- 如果 `core.aiProvider === "custom"`，需要配置 `customAI.url`、`customAI.key`、`customAI.model`

---

# 22. 插件与仓库缓存

插件可访问：

```js
core.cacheManager
```

## 22.1 普通 API 缓存

```js
core.cacheManager.get(key)
core.cacheManager.set(key, data)
```

默认 TTL：

```js
15000ms
```

---

## 22.2 AI 仓库文本缓存

相关字段：

```js
core.cacheManager.repoTextCache
core.cacheManager.repoCacheSelection
core.cacheManager.repoCacheMeta
```

清空：

```js
core.cacheManager.clearRepoCache();
```

构建上下文：

```js
const ctx = core.cacheManager.buildContext(120000);
```

返回格式大致：

```text
== FILE: path/to/file.js ==
文件内容
```

---

# 23. 插件卸载注意事项

当前卸载只做两件事：

```js
if (p._styleEl) p._styleEl.remove();
this.plugins.delete(id);
```

不会自动清理：

- 插件插入的按钮
- 插件创建的弹窗
- 插件绑定的事件
- 插件启动的定时器
- 插件修改的原型
- 插件发起中的网络请求

建议插件设计时保存清理函数。

例如：

```js
plugin.id = "clean-demo";
plugin.name = "可清理插件";
plugin.version = "1.0.0";

let btn = null;
let timer = null;

plugin.init = ({ ui, components }) => {
  btn = components.createWindowButton("临时按钮");
  ui.tabs?.appendChild(btn);

  timer = setInterval(() => {
    console.log("running");
  }, 1000);

  plugin.cleanup = () => {
    btn?.remove();
    clearInterval(timer);
  };
};

plugin.onHook = (hookName) => {
  if (hookName === "ui:hide") {
    // 可选：面板隐藏时做一些暂停操作
  }
};
```

不过当前 `PluginManager.unloadPlugin` 不会自动调用 `plugin.cleanup()`。

如果希望支持，可以修改卸载逻辑：

```js
unloadPlugin(id) {
  const p = this.plugins.get(id);
  if (!p) return;
  if (typeof p.cleanup === "function") {
    try { p.cleanup(); } catch (e) { console.error(e); }
  }
  if (p._styleEl) p._styleEl.remove();
  this.plugins.delete(id);
  this._saveToStorage();
}
```

---

# 24. 插件安全风险

插件权限非常高。

插件可以：

- 读取 GitHub Token
- 删除仓库文件
- 删除仓库
- 创建仓库
- 修改仓库内容
- 发送 Token 到第三方服务器
- 修改页面 DOM
- 读取剪贴板相关权限
- 访问 localStorage
- 自动加载其他插件
- 修改扩展核心逻辑
- 调用任意 `fetch`
- 伪造 UI
- 劫持按钮事件

因此：

1. 不要加载未知插件
2. 不要加载混淆插件
3. 不要加载来源不可信的插件
4. 插件集市仓库需要严格管理
5. Token 建议使用最小权限
6. 使用前最好检查插件源码
7. 私有仓库 Token 更要谨慎
8. 建议增加插件沙箱机制

---

# 25. 插件开发建议

## 25.1 推荐使用唯一 ID

```js
plugin.id = "author.plugin-name";
```

例如：

```js
plugin.id = "alice.repo-helper";
```

---

## 25.2 不要直接覆盖核心方法

不推荐：

```js
extension.loadDir = () => {};
```

如果必须 patch，建议保留原函数：

```js
const oldLoadDir = extension.loadDir.bind(extension);

extension.loadDir = async function(path) {
  console.log("加载目录前:", path);
  return oldLoadDir(path);
};
```

---

## 25.3 DOM 操作前判断 UI 是否存在

```js
if (ui.tabs) {
  ui.tabs.appendChild(btn);
}
```

---

## 25.4 写操作前检查 Token 和仓库状态

```js
if (!core.token) {
  alert("请先设置 Token");
  return;
}

if (!core.currentOwner || !core.currentRepo) {
  alert("请先进入仓库");
  return;
}
```

---

## 25.5 避免频繁调用 GitHub API

GitHub API 有频率限制。

建议：

- 使用 `api.fetchJson`
- 复用缓存
- 避免在 Hook 中大量请求
- 对用户输入加防抖

---

# 26. 当前插件 API 的不足(危险之处)
**在加载未知插件时注意一下几点**

1. 有没有权限过高
2. 有没有权限声明机制
3. 有没有插件签名校验问题
4. 有没有自动更新机制
5. 有没有卸载生命周期
6. 插件存储和 Token 都是 localStorage 明文内容
7. 插件集市元数据提取只支持简单正则



---

# 27. 完整插件模板

```js
plugin.id = "author.full-template";
plugin.name = "完整模板插件";
plugin.version = "1.0.0";
plugin.description = "展示 GitHub 面板 Pro+ 插件完整结构";
plugin.tags = ["模板", "完整", "示例"];

plugin.style = `
.full-template-card {
  padding: 10px;
  margin: 8px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
}
`;

let button = null;

plugin.init = (context) => {
  const {
    core,
    ui,
    api,
    utils,
    components,
    extension,
    manager
  } = context;

  button = components.createWindowButton("完整模板", {
    background: "rgba(120,160,255,0.25)"
  });

  button.onclick = async () => {
    const info = [
      `当前模式: ${core.mode}`,
      `当前仓库: ${core.currentOwner || "-"} / ${core.currentRepo || "-"}`,
      `当前分支: ${core.currentBranch || "-"}`,
      `Token: ${core.token ? "已设置" : "未设置"}`
    ].join("\n");

    alert(info);
  };

  if (ui.tabs) {
    ui.tabs.appendChild(button);
  }

  console.log(`${plugin.name} 已初始化`);
};

plugin.onHook = (hookName, data) => {
  switch (hookName) {
    case "ui:show":
      console.log("面板显示");
      break;

    case "ui:hide":
      console.log("面板隐藏");
      break;

    case "ui:ready":
      console.log("UI 就绪", data);
      break;

    case "mode:switch":
      console.log("模式切换:", data);
      break;

    case "search:dir":
      console.log("搜索方向:", data);
      break;

    case "search:repos":
      console.log("仓库搜索完成:", data.total_count);
      break;

    case "dir:load":
      console.log("目录加载:", data.path, data.items.length);
      break;

    case "file:open":
      console.log("文件打开:", data.file.path, data.text.length);
      break;
  }
};

// 当前系统不会自动调用 cleanup，除非你修改 PluginManager.unloadPlugin
plugin.cleanup = () => {
  button?.remove();
  button = null;
};
```

---

# 28. 总结

GitHub 面板 Pro+ 的插件 API 特点是：

- 简单
- 直接
- 权限极高
- 可深度控制扩展
- 支持 UI 扩展
- 支持 GitHub API 操作
- 支持 Hook 监听
- 支持插件集市
- 支持本地、粘贴、GitHub 导入
- 支持插件样式注入
- 支持 localStorage 持久化

但它不是沙箱插件系统，而是“完全信任式插件系统”。

因此最重要的原则是：

```text
只加载你信任、你能读懂、来源可靠的插件。
```

开发插件时建议：

- 明确 `plugin.id`
- 写清 `description` 和 `tags`
- 尽量不修改核心对象
- 写操作前二次确认
- 不读取或外传 Token
- 避免破坏主 UI
- 提供清理逻辑
- 避免无限循环和高频请求