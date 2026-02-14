// 名称: 网格系统
// ID: SPgrids
// 描述: 在网格上放置角色。
// 作者: SharkPool <https://github.com/SharkPool-SP>

// 版本 V.1.0.0

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("网格系统必须在非沙盒环境中运行！");

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  let myGrids = [];

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyODUiIGhlaWdodD0iMjg1IiB2aWV3Qm94PSIwLDAsMjg1LDI4NSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyLjUsLTM3LjUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTEyLjUsMTgwYzAsLTc4LjcwMDU4IDYzLjc5OTQyLC0xNDIuNSAxNDIuNSwtMTQyLjVjNzguNzAwNTgsMCAxNDIuNSw2My43OTk0MiAxNDIuNSwxNDIuNWMwLDc4LjcwMDU4IC02My43OTk0MiwxNDIuNSAtMTQyLjUsMTQyLjVjLTc4LjcwMDU4LDAgLTE0Mi41LC02My43OTk0MiAtMTQyLjUsLTE0Mi41eiIgZmlsbD0iIzgxMDgwMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI2LjUsMTgwYzAsLTcwLjk2ODU5IDU3LjUzMTQxLC0xMjguNSAxMjguNSwtMTI4LjVjNzAuOTY4NTksMCAxMjguNSw1Ny41MzE0MSAxMjguNSwxMjguNWMwLDcwLjk2ODU5IC01Ny41MzE0MSwxMjguNSAtMTI4LjUsMTI4LjVjLTcwLjk2ODU5LDAgLTEyOC41LC01Ny41MzE0MSAtMTI4LjUsLTEyOC41eiIgZmlsbD0iI2M2MGIwMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTgyLjYyNSwyNTIuMzc1di0xNDQuNzVoMTQ0Ljc1djE0NC43NXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjYuMTI1LDIwNC4xMjVoLTE0MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xNzkuMTI1LDEwOXYxNDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTMwLjg3NSwxMDl2MTQyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTg0LDE1NS44NzVoMTQyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTEzOC43NSwxOTYuMjV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTEzOC43NSwyNDQuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTEzOC43NSwxNDcuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTkwLjI1LDE0Ny43NXAtMzIuNWgzMi41djMyLjV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTg2Ljc1LDE0Ny43NXAtMzIuNWgzMi41djMyLjV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPg==";

  const blockIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOTIuMTkyMTkiIGhlaWdodD0iMTkyLjE5MjE5IiB2aWV3Qm94PSIwLDAsMTkyLjE5MjE5LDE5Mi4xOTIxOSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0My45MDM5LC04My45MDM4OSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMTQzLjkwMzksMjc2LjA5NjA5di0xOTIuMTkyMTloMTkyLjE5MjE5djE5Mi4xOTIxOXoiIGZpbGw9IiNjNjBiMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xNjcuNjI1LDI1Mi4zNzV2LTE0NC43NWgxNDQuNzV2MTQ0Ljc1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTMxMS4xMjUsMjA0LjEyNWgtMTQxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI2NC4xMjUsMjUxdi0xNDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjE1Ljg3NSwyNTF2LTE0MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xNjksMjA0LjEyNWgxNDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTY5LDE1NS44NzVoMTQyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIyMy43NSwxOTYuMjV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyMy43NSwyNDQuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyMy43NSwxNDcuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTE3NS4yNSwxNDcuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI3MS43NSwxNDcuNzV2LTMyLjVoMzIuNXYzMi41eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PC9nPjwvZz48L3N2Zz4=";

  class SPgrids {
    getInfo() {
      return {
        id: "SPgrids",
        name: "网格系统",
        menuIconURI,
        blockIconURI,
        color1: "#c60b00",
        color2: "#b30a02",
        color3: "#810801",
        blocks: [
          {
            opcode: "createGrid",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建名为 [NAME] 的新网格",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
            },
          },
          {
            opcode: "deleteGrid",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除名为 [NAME] 的网格",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
            },
          },
          {
            opcode: "deleteGrids",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除所有网格",
          },
          {
            opcode: "gridExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "名为 [NAME] 的网格存在？",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
            },
          },

          "---",

          {
            opcode: "setGrid",
            blockType: Scratch.BlockType.COMMAND,
            text: "设置网格 [NAME] 的格子大小为 [WIDTH] × [HEIGHT]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30,
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30,
              },
            },
          },
          {
            opcode: "gridData",
            blockType: Scratch.BlockType.REPORTER,
            text: "网格 [NAME] 的 [ATTRIBUTE]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
              ATTRIBUTE: {
                type: Scratch.ArgumentType.STRING,
                menu: "attributes",
                defaultValue: "width",
              },
            },
          },

          "---",

          {
            opcode: "placeOnGrid",
            blockType: Scratch.BlockType.COMMAND,
            text: "[FIT] [SPRITE] 到网格 [NAME] 的坐标 x [X] y [Y]",
            arguments: {
              FIT: {
                type: Scratch.ArgumentType.STRING,
                menu: "FitType",
                defaultValue: "放置",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS",
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "placeOnAxisGrid",
            blockType: Scratch.BlockType.COMMAND,
            text: "[FIT] [SPRITE] 到网格 [NAME] 的 [AXIS] 轴位置 [POS]",
            arguments: {
              FIT: {
                type: Scratch.ArgumentType.STRING,
                menu: "FitType",
                defaultValue: "放置",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: "TARGETS",
              },
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: "axis",
                defaultValue: "x",
              },
              POS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "offsetCenter",
            blockType: Scratch.BlockType.REPORTER,
            text: "网格 [NAME] 的中心偏移 [ATTRIBUTE]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "网格1",
              },
              ATTRIBUTE: {
                type: Scratch.ArgumentType.STRING,
                menu: "attributes",
                defaultValue: "width",
              },
            },
          },
        ],
        menus: {
          TARGETS: {
            acceptReporters: true,
            items: "_getTargets",
          },
          attributes: ["宽度", "高度"],
          FitType: ["放置", "适应", "适应并居中"],
          axis: ["x", "y"]
        },
      };
    }

    createGrid(args) {
      myGrids.push({
        [args.NAME]: {
          name: args.NAME,
          width: 30,
          height: 30,
        }
      });
    }

    deleteGrid(args) {
      const indexToRemove = myGrids.findIndex((grid) => Object.keys(grid)[0] === args.NAME);
      if (indexToRemove !== -1) {
        myGrids.splice(indexToRemove, 1);
      }
    }

    deleteGrids(args) {
      myGrids = [];
    }

    setGrid(args) {
      if (args.WIDTH === 0) {
        args.WIDTH = 1;
      }
      if (args.HEIGHT === 0) {
        args.HEIGHT = 1;
      }
      const grid = myGrids.find((grid) => grid[args.NAME]);
      if (!grid) {
        this.createGrid(args);
      }
      if (grid) {
        grid[args.NAME].width = Scratch.Cast.toNumber(args.WIDTH);
        grid[args.NAME].height = Scratch.Cast.toNumber(args.HEIGHT);
      }
    }

    gridExists(args) {
      const grid = myGrids.find((grid) => grid[args.NAME]);
      return Boolean(grid);
    }

    gridData(args) {
      const grid = myGrids.find((grid) => grid[args.NAME]);
      if (grid) {
        const attributeMap = {
          "宽度": "width",
          "高度": "height"
        };
        const actualAttribute = attributeMap[args.ATTRIBUTE] || args.ATTRIBUTE;
        return grid[args.NAME][actualAttribute];
      } else {
        return "网格不存在！";
      }
    }

    placeOnGrid(args, util) {
      this.placeGrid(args, util, false);
    }

    placeOnAxisGrid(args, util) {
      this.placeGrid(args, util, true);
    }

    placeGrid(args, util, axis) {
      const grid = myGrids.find((grid) => grid[args.NAME]);
      if (!grid) {
        this.createGrid(args);
      }
      let target;
      if (grid) {
        let translateX = grid[args.NAME].width;
        let translateY = grid[args.NAME].height;
        if (args.SPRITE === "这个角色") {
          target = util.target;
        } else {
          target = runtime.getSpriteTargetByName(args.SPRITE);
          if (!target) {
            return;
          }
        }

        if (axis) {
          translateX = Math.round(args.POS / translateX) * translateX;
          translateY = Math.round(args.POS / translateY) * translateY;
          if (args.AXIS === "x") {
            target.setXY(translateX, target.y);
          } else {
            target.setXY(target.x, translateY);
          }
        } else {
          translateX = Math.round(args.X / translateX) * translateX;
          translateY = Math.round(args.Y / translateY) * translateY;
          target.setXY(translateX, translateY);
        }

        const fitTypeMap = {
          "放置": "place",
          "适应": "fit",
          "适应并居中": "fit and center"
        };
        const actualFitType = fitTypeMap[args.FIT] || args.FIT;

        if (actualFitType.includes("fit")) {
          const CCostume = target.sprite.costumes_[target.currentCostume];
          const gridWidth = grid[args.NAME].width;
          const gridHeight = grid[args.NAME].height;
          const spriteWidth = CCostume.size[0];
          const spriteHeight = CCostume.size[1];
          const tileSize = Math.min(gridWidth, gridHeight);
          let newSize;

          if (spriteWidth >= spriteHeight) {
            newSize = Math.min(tileSize, (tileSize * spriteHeight) / spriteWidth);
          } else {
            newSize = Math.min((tileSize * spriteWidth) / spriteHeight, tileSize);
          }
          if (100 > (spriteWidth + spriteHeight) / 2) {
            newSize = newSize * (100 / ((spriteWidth + spriteHeight) / 2));
          }
          target.setSize(newSize);
          if (actualFitType === "fit and center") {
            if (axis) {
              if (args.AXIS === "x") {
                target.setXY(target.x + (grid[args.NAME].width / 2), target.y);
              } else {
                target.setXY(target.x, target.y + (grid[args.NAME].height / 2));
              }
            } else {
              target.setXY(target.x + (grid[args.NAME].width / 2), target.y + (grid[args.NAME].height / 2));
            }
          }
        }
      }
    }

    offsetCenter(args) {
      const grid = myGrids.find((grid) => grid[args.NAME]);
      if (grid) {
        const attributeMap = {
          "宽度": "width",
          "高度": "height"
        };
        const actualAttribute = attributeMap[args.ATTRIBUTE] || args.ATTRIBUTE;
        return grid[args.NAME][actualAttribute] / 2;
      } else {
        return "网格不存在！";
      }
    }

    _getTargets() {
      const spriteNames = [];
      spriteNames.push("这个角色");
      const targets = runtime.targets;

      for (let index = 1; index < targets.length; index++) {
        const target = targets[index];
        if (target.isOriginal) {
          spriteNames.push(target.getName());
        }
      }
      if (spriteNames.length > 0) {
        return spriteNames;
      } else {
        return [""];
      }
    }
  }

  Scratch.extensions.register(new SPgrids());
})(Scratch);