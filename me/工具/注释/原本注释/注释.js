(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('这个扩展需要以“非沙盒（Unsandboxed）”方式加载');
  }

  const vm = Scratch.vm;
  let commentCounter = 0;

  class CommentTools {
    getInfo() {
      return {
        id: 'commenttools',
        name: '注释工具',
        color1: '#FFAB19',
        color2: '#EC9C13',
        blocks: [
          {
            opcode: 'getCommentCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TARGET] 的注释数量',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              }
            }
          },
          {
            opcode: 'getAllComments',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TARGET] 的全部注释',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              }
            }
          },
          {
            opcode: 'getCommentByIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TARGET] 的第 [INDEX] 条注释',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCommentsStartingWith',
            blockType: Scratch.BlockType.REPORTER,
            text: '读取 [TARGET] 中开头为 [PREFIX] 的注释内容',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              },
              PREFIX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '说明：'
              }
            }
          },
          {
            opcode: 'getFirstCommentStartingWith',
            blockType: Scratch.BlockType.REPORTER,
            text: '读取 [TARGET] 中第一个开头为 [PREFIX] 的注释内容',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              },
              PREFIX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '说明：'
              }
            }
          },
          '---',
          {
            opcode: 'createComment',
            blockType: Scratch.BlockType.REPORTER,
            text: '创建注释 [TEXT] x:[X] y:[Y] 宽:[W] 高:[H]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '这是一个注释'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              W: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 200
              },
              H: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 200
              }
            }
          },
          {
            opcode: 'deleteComment',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除注释 ID [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'comment_1'
              }
            }
          },
          {
            opcode: 'deleteAllComments',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除当前目标全部注释'
          }
        ],
        menus: {
          targets: {
            acceptReporters: true,
            items: 'getTargets'
          }
        }
      };
    }

    getTargets() {
      const targets = vm.runtime.targets
        .filter(t => t.isOriginal)
        .map(t => t.getName());

      if (!targets.includes('Stage')) {
        targets.unshift('Stage');
      }

      return targets;
    }

    _getProjectJSON() {
      try {
        return JSON.parse(vm.toJSON());
      } catch (e) {
        return { targets: [] };
      }
    }

    _findTarget(targetName) {
      const project = this._getProjectJSON();

      return project.targets.find(t => {
        if (t.name === targetName) return true;
        if (t.isStage && (targetName === 'Stage' || targetName === '舞台')) return true;
        return false;
      });
    }

    _getComments(targetName) {
      const target = this._findTarget(String(targetName));
      if (!target || !target.comments) return [];

      return Object.values(target.comments)
        .map(comment => String(comment.text || ''))
        .filter(text => text !== '');
    }

    _getTarget(util) {
      return vm.editingTarget || (util && util.target);
    }

    _refreshWorkspace() {
      if (typeof vm.emitWorkspaceUpdate === 'function') {
        vm.emitWorkspaceUpdate();
      }
      if (vm.runtime && typeof vm.runtime.emitProjectChanged === 'function') {
        vm.runtime.emitProjectChanged();
      }
    }

    getCommentCount(args) {
      return this._getComments(args.TARGET).length;
    }

    getAllComments(args) {
      const comments = this._getComments(args.TARGET);
      return comments.join('\n---\n');
    }

    getCommentByIndex(args) {
      const comments = this._getComments(args.TARGET);
      const index = Math.floor(Number(args.INDEX)) - 1;

      if (index < 0 || index >= comments.length) {
        return '';
      }

      return comments[index];
    }

    getCommentsStartingWith(args) {
      const targetName = String(args.TARGET);
      const prefix = String(args.PREFIX);
      const comments = this._getComments(targetName);

      const result = comments.filter(text => text.startsWith(prefix));
      return result.join('\n---\n');
    }

    getFirstCommentStartingWith(args) {
      const targetName = String(args.TARGET);
      const prefix = String(args.PREFIX);
      const comments = this._getComments(targetName);

      const found = comments.find(text => text.startsWith(prefix));
      return found || '';
    }

    createComment(args, util) {
      const target = this._getTarget(util);
      if (!target) return '';

      if (typeof target.createComment !== 'function') {
        console.warn('当前环境不支持 createComment');
        return '';
      }

      const text = Scratch.Cast.toString(args.TEXT);
      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const w = Math.max(40, Scratch.Cast.toNumber(args.W));
      const h = Math.max(20, Scratch.Cast.toNumber(args.H));

      const id = `comment_${Date.now()}_${commentCounter++}`;

      target.createComment(
        id,
        null,
        text,
        x,
        y,
        w,
        h,
        false
      );

      this._refreshWorkspace();
      return id;
    }

    deleteComment(args, util) {
      const target = this._getTarget(util);
      if (!target) return;

      const id = Scratch.Cast.toString(args.ID);

      if (typeof target.deleteComment === 'function') {
        target.deleteComment(id);
      } else if (target.comments && target.comments[id]) {
        delete target.comments[id];
      }

      this._refreshWorkspace();
    }

    deleteAllComments(args, util) {
      const target = this._getTarget(util);
      if (!target || !target.comments) return;

      const ids = Object.keys(target.comments);
      for (const id of ids) {
        if (typeof target.deleteComment === 'function') {
          target.deleteComment(id);
        } else {
          delete target.comments[id];
        }
      }

      this._refreshWorkspace();
    }
  }

  Scratch.extensions.register(new CommentTools());
})(Scratch);
