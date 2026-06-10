
(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("GitHubPanel 插件缓存清理器必须以 unsandboxed 模式运行");
  }

  class GitHubPanelCacheCleaner {
    constructor() {
      this.storageKey = "github_panel_storage";
      this.markdownCachePrefixes = [
        "mdx-libcache-v4:",
        "mdx-libcache-v3:",
        "mdx-libcache-v2:",
        "mdx-libcache:"
      ];
    }

    getInfo() {
      return {
        id: "githubpanelcachecleaner",
        name: "GitHubPanel缓存清理器",
        color1: "#d9534f",
        color2: "#c9302c",
        color3: "#ac2925",
        blocks: [
          {
            opcode: "clearPluginsOnly",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除 GitHubPanel 插件缓存代码"
          },
          {
            opcode: "clearMarkdownLibCache",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除 Markdown 插件库缓存"
          },
          {
            opcode: "clearAllPluginRelatedCache",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除 GitHubPanel 插件相关全部缓存"
          },
          {
            opcode: "clearAllGitHubPanelStorage",
            blockType: Scratch.BlockType.COMMAND,
            text: "清空 GitHubPanel 全部存储 包括 Token"
          },
          {
            opcode: "getPluginCacheInfo",
            blockType: Scratch.BlockType.REPORTER,
            text: "GitHubPanel 插件缓存信息"
          },
          {
            opcode: "hasPluginCache",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "存在 GitHubPanel 插件缓存?"
          }
        ]
      };
    }

    _safeParse(json, fallback) {
      try {
        return JSON.parse(json);
      } catch {
        return fallback;
      }
    }

    _getStorageObject() {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      const data = this._safeParse(raw, null);
      if (!data || typeof data !== "object") return null;

      return data;
    }

    _setStorageObject(data) {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    _removeKeysByPrefix(prefixes) {
      const removed = [];

      try {
        const keys = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          if (prefixes.some(prefix => key.startsWith(prefix))) {
            keys.push(key);
          }
        }

        for (const key of keys) {
          localStorage.removeItem(key);
          removed.push(key);
        }
      } catch {}

      return removed;
    }

    _removePluginStyleElements() {
      try {
        document
          .querySelectorAll("style[id^='plugin-style-']")
          .forEach(el => el.remove());
      } catch {}
    }

    _removeMarkdownInjectedElements() {
      try {
        const ids = [
          "mdx-fast-panel-theme",
          "mdx-fast-panel-theme-fixed",
          "mdx-heading-toc-css",
          "mdx-inline-code-nowrap-final-css",
          "mdx-inline-code-gray-bg-final-css",
          "mdx-gh-markdown-css",
          "mdx-hljs-css",
          "mdx-katex-css",
          "mdx-marked",
          "mdx-dompurify",
          "mdx-hljs",
          "mdx-katex",
          "mdx-katex-auto",
          "mdx-mermaid"
        ];

        for (const id of ids) {
          const el = document.getElementById(id);
          if (el) el.remove();
        }
      } catch {}
    }

    clearPluginsOnly() {
      const data = this._getStorageObject();

      if (!data) {
        alert("未找到 GitHubPanel 存储。");
        return;
      }

      const count = Array.isArray(data.plugins) ? data.plugins.length : 0;

      data.plugins = [];

      this._setStorageObject(data);

      this._removePluginStyleElements();

      alert(
        `已删除 GitHubPanel 插件缓存代码。\n` +
        `删除插件数量：${count}\n\n` +
        `注意：已经运行中的插件可能仍在当前页面生效，请刷新页面或重新打开项目。`
      );
    }

    clearMarkdownLibCache() {
      const removed = this._removeKeysByPrefix(this.markdownCachePrefixes);

      this._removeMarkdownInjectedElements();

      alert(
        `已删除 Markdown 插件库缓存。\n` +
        `删除缓存项数量：${removed.length}\n\n` +
        `注意：如果 Markdown 插件仍在运行，刷新后会重新下载依赖库。`
      );
    }

    clearAllPluginRelatedCache() {
      const data = this._getStorageObject();

      let pluginCount = 0;

      if (data) {
        pluginCount = Array.isArray(data.plugins) ? data.plugins.length : 0;
        data.plugins = [];
        this._setStorageObject(data);
      }

      const mdRemoved = this._removeKeysByPrefix(this.markdownCachePrefixes);

      this._removePluginStyleElements();
      this._removeMarkdownInjectedElements();

      alert(
        `已删除 GitHubPanel 插件相关全部缓存。\n\n` +
        `插件缓存代码数量：${pluginCount}\n` +
        `Markdown 库缓存项：${mdRemoved.length}\n\n` +
        `建议刷新页面或重新打开项目。`
      );
    }

    clearAllGitHubPanelStorage() {
      const ok1 = confirm(
        "警告：这会清空 GitHubPanel 全部存储。\n\n" +
        "包括：\n" +
        "1. GitHub Token\n" +
        "2. 已安装插件代码\n" +
        "3. 插件列表\n" +
        "4. 其他 GitHubPanel 本地配置\n\n" +
        "确定继续？"
      );

      if (!ok1) return;

      const ok2 = confirm(
        "再次确认：清空后不可恢复。\n\n" +
        "真的要删除 GitHubPanel 全部存储吗？"
      );

      if (!ok2) return;

      localStorage.removeItem(this.storageKey);

      const mdRemoved = this._removeKeysByPrefix(this.markdownCachePrefixes);

      this._removePluginStyleElements();
      this._removeMarkdownInjectedElements();

      alert(
        `已清空 GitHubPanel 全部存储。\n\n` +
        `Markdown 库缓存项：${mdRemoved.length}\n\n` +
        `请刷新页面或重新打开项目。`
      );
    }

    getPluginCacheInfo() {
      const data = this._getStorageObject();

      if (!data) {
        return "未找到 github_panel_storage";
      }

      const plugins = Array.isArray(data.plugins) ? data.plugins : [];
      const tokenState = data.token ? "Token: 已保存" : "Token: 未保存";

      let mdCacheCount = 0;
      let mdCacheSize = 0;

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          if (this.markdownCachePrefixes.some(prefix => key.startsWith(prefix))) {
            mdCacheCount++;
            const value = localStorage.getItem(key) || "";
            mdCacheSize += value.length;
          }
        }
      } catch {}

      const pluginNames = plugins.map(p => {
        const id = p && p.id ? p.id : "unknown";
        const codeSize = p && p.code ? String(p.code).length : 0;
        return `${id}(${codeSize}字符)`;
      });

      return [
        tokenState,
        `插件数量: ${plugins.length}`,
        `Markdown库缓存: ${mdCacheCount}项/${mdCacheSize}字符`,
        `插件: ${pluginNames.join(", ") || "无"}`
      ].join(" | ");
    }

    hasPluginCache() {
      const data = this._getStorageObject();
      if (!data) return false;

      const plugins = Array.isArray(data.plugins) ? data.plugins : [];
      if (plugins.length > 0) return true;

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          if (this.markdownCachePrefixes.some(prefix => key.startsWith(prefix))) {
            return true;
          }
        }
      } catch {}

      return false;
    }
  }

  Scratch.extensions.register(new GitHubPanelCacheCleaner());
})(Scratch);