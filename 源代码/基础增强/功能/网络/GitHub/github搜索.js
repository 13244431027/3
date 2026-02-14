(function(Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("GitHub扩展必须在非沙盒模式下运行");
  }

  class GitHubExtension {
    constructor() {
      this.authToken = '';
      this.searchResults = [];           // 仓库搜索结果
      this.repoContents = [];           // 仓库内容结果
      this.codeSearchResults = [];      // 代码搜索结果
      this.currentRepo = '';
      this.currentPage = 1;
      this.totalPages = 1;
      this.lastError = null;
    }
    
    getInfo() {
      return {
        id: 'githubExtension',
        name: 'GitHub 扩展',
        color1: '#24292e',
        color2: '#2f363d',
        color3: '#1b1f23',
        
        blocks: [
          // === 认证设置 ===
          {
            opcode: 'setAuthToken',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置认证令牌为 [TOKEN]',
            arguments: {
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          
          "---",
          // === 仓库搜索功能 ===
          {
            opcode: 'searchRepositories',
            blockType: Scratch.BlockType.REPORTER,
            text: '搜索GitHub仓库 [QUERY]',
            arguments: {
              QUERY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'scratch'
              }
            }
          },
          {
            opcode: 'getRepoName',
            blockType: Scratch.BlockType.REPORTER,
            text: '从仓库结果获取名称 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getRepoStars',
            blockType: Scratch.BlockType.REPORTER,
            text: '从仓库结果获取星标数 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getRepoURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '从仓库结果获取链接 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getRepoDescription',
            blockType: Scratch.BlockType.REPORTER,
            text: '从仓库结果获取描述 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getRepoResultCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '仓库搜索结果数量'
          },
          
          "---",
          // === 代码搜索功能 ===
          {
            opcode: 'searchInRepo',
            blockType: Scratch.BlockType.REPORTER,
            text: '在仓库 [OWNER]/[REPO] 中搜索 [QUERY] [TYPE]',
            arguments: {
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              },
              QUERY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'extension'
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'searchType'
              }
            }
          },
          {
            opcode: 'getSearchResultCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '代码搜索结果数量'
          },
          {
            opcode: 'getSearchResultAt',
            blockType: Scratch.BlockType.REPORTER,
            text: '第 [INDEX] 个代码结果的 [PROPERTY]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'resultProperties'
              }
            }
          },
          
          "---",
          // === 仓库内容浏览 ===
          {
            opcode: 'getRepositoryInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取仓库 [INFO] 对于 [OWNER]/[REPO]',
            arguments: {
              INFO: {
                type: Scratch.ArgumentType.STRING,
                menu: 'repositoryInfo'
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              }
            }
          },
          {
            opcode: 'getRepoContents',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取仓库内容 [OWNER]/[REPO] 路径 [PATH]',
            arguments: {
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              },
              PATH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'getContentName',
            blockType: Scratch.BlockType.REPORTER,
            text: '从内容获取名称 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getContentType',
            blockType: Scratch.BlockType.REPORTER,
            text: '从内容获取类型 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getContentPath',
            blockType: Scratch.BlockType.REPORTER,
            text: '从内容获取路径 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getContentSize',
            blockType: Scratch.BlockType.REPORTER,
            text: '从内容获取大小 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getContentDownloadURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '从内容获取下载链接 [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getContentsCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '内容数量'
          },
          {
            opcode: 'getFileContent',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取文件 [PATH] 从 [OWNER]/[REPO] 分支 [BRANCH]',
            arguments: {
              PATH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'README.md'
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              },
              BRANCH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main'
              }
            }
          },
          {
            opcode: 'getReadme',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取仓库 [OWNER]/[REPO] 的 README',
            arguments: {
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              }
            }
          },
          
          "---",
          // === 文件操作（需要认证）===
          {
            opcode: 'createFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建文件 [PATH] 在 [OWNER]/[REPO] 内容 [CONTENT] (需令牌)',
            arguments: {
              PATH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'newfile.txt'
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '文件内容'
              }
            }
          },
          {
            opcode: 'updateFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '更新文件 [PATH] 在 [OWNER]/[REPO] 内容 [CONTENT] (需令牌)',
            arguments: {
              PATH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '新内容'
              }
            }
          },
          {
            opcode: 'deleteFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除文件 [PATH] 从 [OWNER]/[REPO] (需令牌)',
            arguments: {
              PATH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          
          "---",
          // === Issue操作 ===
          {
            opcode: 'getIssues',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取问题列表从 [OWNER]/[REPO]',
            arguments: {
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              }
            }
          },
          {
            opcode: 'createIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建问题在 [OWNER]/[REPO] 标题 [TITLE] 内容 [BODY] (需令牌)',
            arguments: {
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              TITLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '问题标题'
              },
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '问题描述'
              }
            }
          },
          {
            opcode: 'updateIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: '更新问题 [ISSUE] 在 [OWNER]/[REPO] 标题 [TITLE] 内容 [BODY] (需令牌)',
            arguments: {
              ISSUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              TITLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '新标题'
              },
              BODY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '新内容'
              }
            }
          },
          {
            opcode: 'deleteIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除问题 [ISSUE] 从 [OWNER]/[REPO] (需令牌)',
            arguments: {
              ISSUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1'
              },
              OWNER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          
          "---",
          // === 分页和工具 ===
          {
            opcode: 'nextPage',
            blockType: Scratch.BlockType.COMMAND,
            text: '下一页'
          },
          {
            opcode: 'previousPage',
            blockType: Scratch.BlockType.COMMAND,
            text: '上一页'
          },
          {
            opcode: 'getCurrentPage',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前页码'
          },
          {
            opcode: 'getTotalPages',
            blockType: Scratch.BlockType.REPORTER,
            text: '总页数'
          },
          {
            opcode: 'clearResults',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空所有结果'
          },
          {
            opcode: 'getLastError',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后错误信息'
          }
        ],
        
        menus: {
          searchType: {
            acceptReporters: true,
            items: [
              { text: '代码', value: 'code' },
              { text: '提交', value: 'commits' },
              { text: '问题', value: 'issues' }
            ]
          },
          resultProperties: {
            acceptReporters: true,
            items: [
              { text: '名称', value: 'name' },
              { text: '路径', value: 'path' },
              { text: 'URL', value: 'html_url' },
              { text: '仓库', value: 'repository' },
              { text: '描述', value: 'description' }
            ]
          },
          repositoryInfo: {
            acceptReporters: true,
            items: [
              { text: '名称', value: 'name' },
              { text: '描述', value: 'description' },
              { text: '所有者', value: 'owner' },
              { text: '星标数', value: 'stars' },
              { text: '观察者', value: 'watchers' },
              { text: '复刻数', value: 'forks' },
              { text: '头像URL', value: 'image' },
              { text: '语言', value: 'language' },
              { text: '创建时间', value: 'created_at' },
              { text: '更新时间', value: 'updated_at' }
            ]
          }
        }
      };
    }

    // === 认证功能 ===
    setAuthToken(args) {
      this.authToken = args.TOKEN;
    }

    // === 仓库搜索功能 ===
    async searchRepositories(args) {
      try {
        const query = encodeURIComponent(args.QUERY);
        const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=30`;
        
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TurboWarp-GitHub-Extension'
        };
        
        if (this.authToken) {
          headers['Authorization'] = `token ${this.authToken}`;
        }
        
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        this.searchResults = data.items || [];
        this.lastError = null;
        
        return `找到 ${this.searchResults.length} 个仓库`;
      } catch (error) {
        this.lastError = error.message;
        console.error('GitHub搜索错误:', error);
        return '搜索失败';
      }
    }
    
    getRepoName(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.searchResults.length - 1));
      if (this.searchResults[index]) {
        return this.searchResults[index].name || '未知';
      }
      return '无结果';
    }
    
    getRepoStars(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.searchResults.length - 1));
      if (this.searchResults[index]) {
        return this.searchResults[index].stargazers_count || 0;
      }
      return 0;
    }
    
    getRepoURL(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.searchResults.length - 1));
      if (this.searchResults[index]) {
        return this.searchResults[index].html_url || '';
      }
      return '';
    }
    
    getRepoDescription(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.searchResults.length - 1));
      if (this.searchResults[index]) {
        return this.searchResults[index].description || '无描述';
      }
      return '无结果';
    }
    
    getRepoResultCount() {
      return this.searchResults.length;
    }

    // === 代码搜索功能 ===
    async searchInRepo(args) {
      const owner = args.OWNER;
      const repo = args.REPO;
      const query = args.QUERY;
      const type = args.TYPE;
      
      this.currentRepo = `${owner}/${repo}`;
      this.currentPage = 1;
      
      try {
        let url = '';
        let headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TurboWarp-GitHub-Extension'
        };
        
        if (this.authToken) {
          headers['Authorization'] = `token ${this.authToken}`;
        }
        
        switch (type) {
          case 'code':
            url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}&page=${this.currentPage}&per_page=10`;
            break;
          case 'commits':
            url = `https://api.github.com/search/commits?q=${encodeURIComponent(query)}+repo:${owner}/${repo}&page=${this.currentPage}&per_page=10`;
            headers['Accept'] = 'application/vnd.github.cloak-preview';
            break;
          case 'issues':
            url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+repo:${owner}/${repo}&page=${this.currentPage}&per_page=10`;
            break;
          default:
            this.lastError = '未知的搜索类型';
            return '错误: 未知的搜索类型';
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('API速率限制，请稍后再试或使用GitHub令牌');
          } else if (response.status === 404) {
            throw new Error('仓库不存在或无访问权限');
          } else {
            throw new Error(`GitHub API错误: ${response.status}`);
          }
        }
        
        const data = await response.json();
        this.codeSearchResults = data.items || [];
        this.lastError = null;
        
        // 计算总页数 (GitHub API 最多返回1000个结果)
        const totalCount = data.total_count > 1000 ? 1000 : data.total_count;
        this.totalPages = Math.ceil(totalCount / 10);
        
        return `在 ${this.currentRepo} 中找到 ${data.total_count} 个结果`;
      } catch (error) {
        this.lastError = error.message;
        return `搜索失败: ${error.message}`;
      }
    }

    getSearchResultCount() {
      return this.codeSearchResults.length;
    }

    getSearchResultAt(args) {
      const index = Math.max(1, Math.min(args.INDEX, this.codeSearchResults.length)) - 1;
      const property = args.PROPERTY;
      
      if (this.codeSearchResults.length === 0) {
        return '无搜索结果';
      }
      
      const result = this.codeSearchResults[index];
      
      switch (property) {
        case 'name':
          return result.name || result.title || '未知名称';
        case 'path':
          return result.path || '无路径';
        case 'html_url':
          return result.html_url || '无URL';
        case 'repository':
          return result.repository ? result.repository.full_name : '未知仓库';
        case 'description':
          return result.description || '无描述';
        default:
          return '未知属性';
      }
    }

    // === 仓库内容浏览 ===
    async getRepositoryInfo(args) {
      const infoType = args.INFO;
      const owner = args.OWNER;
      const repo = args.REPO;
      
      const url = `https://api.github.com/repos/${owner}/${repo}`;
      try {
        let response;
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TurboWarp-GitHub-Extension'
        };
        
        if (this.authToken) {
          headers['Authorization'] = `token ${this.authToken}`;
        }
        
        response = await fetch(url, { headers });
        
        if (!response.ok) {
          throw new Error('获取仓库信息失败');
        }
        
        const data = await response.json();
        this.lastError = null;
        
        switch (infoType) {
          case 'name':
            return data.name;
          case 'description':
            return data.description || '无描述';
          case 'owner':
            return data.owner.login;
          case 'stars':
            return data.stargazers_count;
          case 'watchers':
            return data.watchers_count;
          case 'forks':
            return data.forks_count;
          case 'image':
            return data.owner.avatar_url;
          case 'language':
            return data.language || '未知';
          case 'created_at':
            return data.created_at ? new Date(data.created_at).toLocaleDateString() : '未知';
          case 'updated_at':
            return data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '未知';
          default:
            throw new Error('无效的仓库信息选项');
        }
      } catch (error) {
        this.lastError = error.message;
        return null;
      }
    }

    async getRepoContents(args) {
      try {
        const owner = encodeURIComponent(args.OWNER);
        const repo = encodeURIComponent(args.REPO);
        const path = encodeURIComponent(args.PATH);
        
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TurboWarp-GitHub-Extension'
        };
        
        if (this.authToken) {
          headers['Authorization'] = `token ${this.authToken}`;
        }
        
        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        this.repoContents = Array.isArray(data) ? data : [data];
        this.currentRepo = `${owner}/${repo}`;
        this.lastError = null;
        
        return `找到 ${this.repoContents.length} 个内容项`;
      } catch (error) {
        this.lastError = error.message;
        console.error('获取仓库内容错误:', error);
        return '获取内容失败';
      }
    }
    
    getContentName(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.repoContents.length - 1));
      if (this.repoContents[index]) {
        return this.repoContents[index].name || '未知';
      }
      return '无内容';
    }
    
    getContentType(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.repoContents.length - 1));
      if (this.repoContents[index]) {
        return this.repoContents[index].type || '未知';
      }
      return '无内容';
    }
    
    getContentPath(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.repoContents.length - 1));
      if (this.repoContents[index]) {
        return this.repoContents[index].path || '';
      }
      return '';
    }
    
    getContentSize(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.repoContents.length - 1));
      if (this.repoContents[index]) {
        return this.repoContents[index].size || 0;
      }
      return 0;
    }
    
    getContentDownloadURL(args) {
      const index = Math.max(0, Math.min(args.INDEX - 1, this.repoContents.length - 1));
      if (this.repoContents[index]) {
        return this.repoContents[index].download_url || '';
      }
      return '';
    }
    
    getContentsCount() {
      return this.repoContents.length;
    }

    async getFileContent(args) {
      const filePath = args.PATH;
      const owner = args.OWNER;
      const repo = args.REPO;
      const branch = args.BRANCH;
      
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('获取文件数据失败');
        }
        
        const content = await response.text();
        this.lastError = null;
        return content.length > 500 ? content.substring(0, 500) + '...' : content;
      } catch (error) {
        this.lastError = error.message;
        return "";
      }
    }

    async getReadme(args) {
      const owner = args.OWNER;
      const repo = args.REPO;
      
      return await this.fetchReadme(owner, repo);
    }

    async fetchReadme(owner, repo) {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
        let headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TurboWarp-GitHub-Extension'
        };
        
        if (this.authToken) {
          headers['Authorization'] = `token ${this.authToken}`;
        }
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
          throw new Error(`获取README失败: ${response.status}`);
        }
        
        const data = await response.json();
        const content = atob(data.content);
        this.lastError = null;
        return content.length > 500 ? content.substring(0, 500) + '...' : content;
      } catch (error) {
        this.lastError = error.message;
        return `获取README失败: ${error.message}`;
      }
    }

    // === 文件操作功能 ===
    async createFile(args) {
      const filePath = args.PATH;
      const owner = args.OWNER;
      const repo = args.REPO;
      const content = args.CONTENT;
      
      if (!this.authToken) {
        this.lastError = '创建文件需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const body = {
        message: '通过TurboWarp扩展创建文件',
        content: btoa(unescape(encodeURIComponent(content))),
        owner: owner,
        repo: repo
      };
      
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error('创建文件失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    async updateFile(args) {
      const filePath = args.PATH;
      const owner = args.OWNER;
      const repo = args.REPO;
      const content = args.CONTENT;
      
      if (!this.authToken) {
        this.lastError = '更新文件需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      
      try {
        // 首先获取文件的SHA
        const getResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        
        if (!getResponse.ok) {
          throw new Error('获取文件数据失败');
        }
        
        const fileData = await getResponse.json();
        const sha = fileData.sha;
        
        // 然后更新文件
        const body = {
          message: '通过TurboWarp扩展更新文件',
          content: btoa(unescape(encodeURIComponent(content))),
          sha: sha,
          owner: owner,
          repo: repo
        };
        
        const updateResponse = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!updateResponse.ok) {
          throw new Error('更新文件失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    async deleteFile(args) {
      const filePath = args.PATH;
      const owner = args.OWNER;
      const repo = args.REPO;
      
      if (!this.authToken) {
        this.lastError = '删除文件需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      
      try {
        // 首先获取文件的SHA
        const getResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        
        if (!getResponse.ok) {
          throw new Error('获取文件数据失败');
        }
        
        const fileData = await getResponse.json();
        const sha = fileData.sha;
        
        // 然后删除文件
        const body = {
          message: '通过TurboWarp扩展删除文件',
          sha: sha
        };
        
        const deleteResponse = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!deleteResponse.ok) {
          throw new Error('删除文件失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    // === Issue操作功能 ===
    async getIssues(args) {
      const owner = args.OWNER;
      const repo = args.REPO;
      
      const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('获取问题列表失败');
        }
        
        const data = await response.json();
        this.lastError = null;
        return JSON.stringify(data);
      } catch (error) {
        this.lastError = error.message;
        return null;
      }
    }

    async createIssue(args) {
      const owner = args.OWNER;
      const repo = args.REPO;
      const title = args.TITLE;
      const body = args.BODY;
      
      if (!this.authToken) {
        this.lastError = '创建问题需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
      const requestBody = {
        title: title,
        body: body
      };
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error('创建问题失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    async updateIssue(args) {
      const issueNumber = args.ISSUE;
      const owner = args.OWNER;
      const repo = args.REPO;
      const title = args.TITLE;
      const body = args.BODY;
      
      if (!this.authToken) {
        this.lastError = '更新问题需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
      const requestBody = {
        title: title,
        body: body
      };
      
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error('更新问题失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    async deleteIssue(args) {
      const issueNumber = args.ISSUE;
      const owner = args.OWNER;
      const repo = args.REPO;
      
      if (!this.authToken) {
        this.lastError = '删除问题需要认证令牌';
        return false;
      }
      
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
      
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('删除问题失败');
        }
        
        this.lastError = null;
        return true;
      } catch (error) {
        this.lastError = error.message;
        return false;
      }
    }

    // === 分页和工具功能 ===
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
    
    getCurrentPage() {
      return this.currentPage;
    }
    
    getTotalPages() {
      return this.totalPages;
    }

    clearResults() {
      this.searchResults = [];
      this.repoContents = [];
      this.codeSearchResults = [];
      this.currentRepo = '';
      this.currentPage = 1;
      this.totalPages = 1;
      this.lastError = null;
    }

    getLastError() {
      return this.lastError || '无错误';
    }
  }
  
  // 注册扩展
  Scratch.extensions.register(new GitHubExtension());
})(Scratch);