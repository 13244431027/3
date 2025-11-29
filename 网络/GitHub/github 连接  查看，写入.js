/*!
 * 该扩展使用多扩展合并器
 * 合并时间: 2025/10/25 10:17:59 | 合并扩展数量: 2
 */

;/* ===== EXTENSION 1 ===== */
(function(Scratch) {
  'use strict';
  
  class GitHubExtension {
    constructor() {
      this.rawContent = '';
      this.fileInfo = '';
      this.errorMsg = '';
    }
    
    getInfo() {
      return {
        id: 'githubconnector',
        name: 'github搜索',
        color1: '#24292e',
        color2: '#0366d6',
        color3: '#f6f8fa',
        blocks: [
          {
            opcode: 'fetchGitHubFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '获取GitHub文件 [USER]/[REPO]/[FILE]',
            arguments: {
              USER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'microsoft'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'vscode'
              },
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'README.md'
              }
            }
          },
          {
            opcode: 'getFileContent',
            blockType: Scratch.BlockType.REPORTER,
            text: '文件内容'
          },
          {
            opcode: 'getFileInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '文件信息'
          },
          {
            opcode: 'getError',
            blockType: Scratch.BlockType.REPORTER,
            text: '错误信息'
          },
          {
            opcode: 'clearContent',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空内容'
          }
        ]
      };
    }
    
    async fetchGitHubFile(args) {
      try {
        const { USER, REPO, FILE } = args;
        this.fileInfo = `${USER}/${REPO}/${FILE}`;
        
        // 使用GitHub Raw Content API
        const rawUrl = `https://raw.githubusercontent.com/${USER}/${REPO}/main/${FILE}`;
        const apiUrl = `https://api.github.com/repos/${USER}/${REPO}/contents/${FILE}`;
        
        try {
          // 首先尝试使用Raw Content
          const response = await fetch(rawUrl);
          if (response.ok) {
            this.rawContent = await response.text();
            this.errorMsg = '';
          } else {
            // 如果失败，尝试使用GitHub API
            const apiResponse = await fetch(apiUrl);
            if (apiResponse.ok) {
              const data = await apiResponse.json();
              if (data.content && data.encoding === 'base64') {
                this.rawContent = atob(data.content);
                this.errorMsg = '';
              } else {
                this.errorMsg = '无法解码文件内容';
              }
            } else {
              this.errorMsg = `错误: ${apiResponse.status} - ${apiResponse.statusText}`;
            }
          }
        } catch (error) {
          this.errorMsg = `网络错误: ${error.message}`;
        }
      } catch (error) {
        this.errorMsg = `处理错误: ${error.message}`;
      }
    }
    
    getFileContent() {
      return this.rawContent || '暂无内容';
    }
    
    getFileInfo() {
      return this.fileInfo || '暂无文件信息';
    }
    
    getError() {
      return this.errorMsg || '无错误';
    }
    
    clearContent() {
      this.rawContent = '';
      this.fileInfo = '';
      this.errorMsg = '';
    }
  }
  
  Scratch.extensions.register(new GitHubExtension());
})(Scratch);


;/* ===== EXTENSION 2 ===== */
(function(Scratch) {
  'use strict';
  
  const GITHUB_API_BASE = 'https://api.github.com';
  
  class GitHubExtension {
    constructor() {
      this.token = '';
      this.username = '';
      this.repo = '';
      this.filename = '';
    }
    
    getInfo() {
      return {
        id: 'githubConnector',
        name: 'GitHub 连接器',
        color1: '#24292e',
        color2: '#0366d6',
        blocks: [
          {
            opcode: 'setCredentials',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置GitHub令牌: [TOKEN]',
            arguments: {
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ghp_your_token_here'
              }
            }
          },
          {
            opcode: 'setRepoInfo',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置仓库信息 用户: [USER] 仓库: [REPO] 文件: [FILE]',
            arguments: {
              USER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'username'
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'repository'
              },
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'data.json'
              }
            }
          },
          {
            opcode: 'writeToGitHub',
            blockType: Scratch.BlockType.COMMAND,
            text: '写入GitHub: [CONTENT] 提交信息: [MESSAGE]',
            arguments: {
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello GitHub!'
              },
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Update from TurboWarp'
              }
            }
          },
          {
            opcode: 'writeJSONToGitHub',
            blockType: Scratch.BlockType.COMMAND,
            text: '写入JSON到GitHub: [JSON] 提交信息: [MESSAGE]',
            arguments: {
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"key": "value"}'
              },
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Update JSON data'
              }
            }
          },
          {
            opcode: 'readFromGitHub',
            blockType: Scratch.BlockType.REPORTER,
            text: '从GitHub读取'
          },
          {
            opcode: 'readJSONFromGitHub',
            blockType: Scratch.BlockType.REPORTER,
            text: '从GitHub读取JSON'
          },
          '---',
          {
            opcode: 'getFileSHA',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取文件SHA'
          },
          {
            opcode: 'fileExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '文件存在吗？'
          },
          {
            opcode: 'createNewFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建新文件: [CONTENT] 提交信息: [MESSAGE]',
            arguments: {
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'New file content'
              },
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Create new file'
              }
            }
          },
          '---',
          {
            opcode: 'getRepoInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前仓库信息'
          }
        ]
      };
    }

    setCredentials(args) {
      this.token = args.TOKEN;
    }

    setRepoInfo(args) {
      this.username = args.USER;
      this.repo = args.REPO;
      this.filename = args.FILE;
    }

    async writeToGitHub(args) {
      if (!this.validateSetup()) return;
      
      try {
        const content = args.CONTENT;
        const message = args.MESSAGE;
        
        // 首先检查文件是否存在以获取SHA
        const sha = await this.getFileSHAInternal();
        
        const response = await this.makeGitHubRequest(
          `/repos/${this.username}/${this.repo}/contents/${this.filename}`,
          'PUT',
          {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            sha: sha || undefined
          }
        );
        
        if (response && response.content) {
          console.log('文件写入成功:', response.content.sha);
        }
      } catch (error) {
        console.error('写入GitHub失败:', error);
        throw new Error(`写入失败: ${error.message}`);
      }
    }

    async writeJSONToGitHub(args) {
      if (!this.validateSetup()) return;
      
      try {
        const jsonContent = args.JSON;
        const message = args.MESSAGE;
        
        // 验证JSON格式
        JSON.parse(jsonContent);
        
        const sha = await this.getFileSHAInternal();
        
        const response = await this.makeGitHubRequest(
          `/repos/${this.username}/${this.repo}/contents/${this.filename}`,
          'PUT',
          {
            message: message,
            content: btoa(unescape(encodeURIComponent(jsonContent))),
            sha: sha || undefined
          }
        );
        
        if (response && response.content) {
          console.log('JSON文件写入成功');
        }
      } catch (error) {
        console.error('写入JSON失败:', error);
        throw new Error(`JSON写入失败: ${error.message}`);
      }
    }

    async readFromGitHub() {
      if (!this.validateSetup()) return '';
      
      try {
        const response = await this.makeGitHubRequest(
          `/repos/${this.username}/${this.repo}/contents/${this.filename}`
        );
        
        if (response && response.content) {
          return decodeURIComponent(escape(atob(response.content)));
        }
        return '';
      } catch (error) {
        console.error('读取GitHub失败:', error);
        return `错误: ${error.message}`;
      }
    }

    async readJSONFromGitHub() {
      if (!this.validateSetup()) return '{}';
      
      try {
        const content = await this.readFromGitHub();
        if (content.startsWith('错误:')) {
          return '{}';
        }
        
        // 验证并返回JSON
        JSON.parse(content);
        return content;
      } catch (error) {
        console.error('读取JSON失败:', error);
        return '{}';
      }
    }

    async getFileSHA() {
      if (!this.validateSetup()) return '';
      
      try {
        const sha = await this.getFileSHAInternal();
        return sha || '文件不存在';
      } catch (error) {
        return '获取失败';
      }
    }

    async fileExists() {
      if (!this.validateSetup()) return false;
      
      try {
        const sha = await this.getFileSHAInternal();
        return !!sha;
      } catch (error) {
        return false;
      }
    }

    async createNewFile(args) {
      if (!this.validateSetup()) return;
      
      try {
        const content = args.CONTENT;
        const message = args.MESSAGE;
        
        // 检查文件是否已存在
        const exists = await this.fileExists();
        if (exists) {
          throw new Error('文件已存在，使用写入块来更新');
        }
        
        const response = await this.makeGitHubRequest(
          `/repos/${this.username}/${this.repo}/contents/${this.filename}`,
          'PUT',
          {
            message: message,
            content: btoa(unescape(encodeURIComponent(content)))
          }
        );
        
        if (response && response.content) {
          console.log('文件创建成功');
        }
      } catch (error) {
        console.error('创建文件失败:', error);
        throw new Error(`创建失败: ${error.message}`);
      }
    }

    getRepoInfo() {
      return `用户: ${this.username}, 仓库: ${this.repo}, 文件: ${this.filename}`;
    }

    // 内部方法
    async makeGitHubRequest(endpoint, method = 'GET', body = null) {
      const url = GITHUB_API_BASE + endpoint;
      const headers = {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TurboWarp-GitHub-Extension'
      };

      const options = {
        method: method,
        headers: headers
      };

      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(url, options);
        
        if (response.status === 404) {
          return null;
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('GitHub请求失败:', error);
        throw error;
      }
    }

    async getFileSHAInternal() {
      try {
        const response = await this.makeGitHubRequest(
          `/repos/${this.username}/${this.repo}/contents/${this.filename}`
        );
        return response ? response.sha : null;
      } catch (error) {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          return null;
        }
        throw error;
      }
    }

    validateSetup() {
      if (!this.token || this.token === 'ghp_your_token_here') {
        console.error('请先设置GitHub令牌');
        return false;
      }
      if (!this.username || !this.repo || !this.filename) {
        console.error('请先设置仓库信息');
        return false;
      }
      return true;
    }
  }

  Scratch.extensions.register(new GitHubExtension());
})(Scratch);

/* ====== EOF ====== */
