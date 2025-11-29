// 名称: 动画
// ID: SPanimations
// 描述: 为你的角色播放动画
// 作者: SharkPool
// 许可证: MIT

// 版本 V.2.0.02

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("动画扩展必须在非沙盒环境中运行");

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const render = vm.renderer;
  const specialID = `SPspecialID${Math.random()}`;
  const playTypes = {
    "正常播放": 1,
    "反向播放": 2,
    "循环正常": 3,
    "循环反向": 4
  };

  let allAnimations = {};

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjcuNTEiIGhlaWdodD0iMTI3LjUxIiB2aWV3Qm94PSIwIDAgMTI3LjUxIDEyNy41MSI+PHBhdGggZD0iTTAgNjMuNzU1QzAgMjguNTQ1IDI4LjU0NCAwIDYzLjc1NSAwczYzLjc1NSAyOC41NDQgNjMuNzU1IDYzLjc1NS0yOC41NDQgNjMuNzU1LTYzLjc1NSA2My43NTVTMCA5OC45NjYgMCA2My43NTUiIGZpbGw9IiM0NDQiLz48cGF0aCBkPSJNNS44NzUgNjMuNzU1YzAtMzEuOTY3IDI1LjkxMy01Ny44OCA1Ny44OC01Ny44OHM1Ny44OCAyNS45MTMgNTcuODggNTcuODgtMjUuOTEzIDU3Ljg4LTU3Ljg4IDU3Ljg4LTU3Ljg4LTI1LjkxMy01Ny44OC01Ny44OCIgZmlsbD0iIzdhN2E3YSIvPjxwYXRoIGQ9Ik0yMy42OTUgOTAuNTNjLTUuNjEzLTguMTI1LTMuNTc2LTE5LjI2MiA0LjU0OC0yNC44NzVzMTkuMjYyLTMuNTc2IDI0Ljg3NSA0LjU0OSAzLjU3NiAxOS4yNjEtNC41NDkgMjQuODc0LTE5LjI2MSAzLjU3Ni0yNC44NzQtNC41NDh6IiBmaWxsPSIjODk4OTg5IiBzdHJva2U9IiM3YTdhN2EiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBhdGggZD0iTTI4LjExIDgwLjM0NGMtNi4zMy05LjE2NC00LjAzNC0yMS43MjUgNS4xMy0yOC4wNTZzMjEuNzI1LTQuMDMzIDI4LjA1NiA1LjEzIDQuMDMzIDIxLjcyNS01LjEzIDI4LjA1Ni0yMS43MjUgNC4wMzQtMjguMDU2LTUuMTN6IiBmaWxsPSIjOWQ5ZDlkIiBzdHJva2U9IiM3YTdhN2EiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBhdGggZD0iTTM2LjE0NSA3My4zMjhjLTcuNDE2LTEwLjczNi00LjcyNS0yNS40NSA2LjAxLTMyLjg2NnMyNS40NS00LjcyNiAzMi44NjYgNi4wMWM3LjQxNiAxMC43MzUgNC43MjUgMjUuNDUtNi4wMSAzMi44NjVzLTI1LjQ1IDQuNzI2LTMyLjg2Ni02LjAxeiIgZmlsbD0iI2FlYWVhZSIgc3Ryb2tlPSIjN2E3YTdhIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwYXRoIGQ9Ik00Ny4zMTEgNjkuNTMxYy04LjAzNC0xMS42My01LjEyLTI3LjU3IDYuNTEtMzUuNjA1czI3LjU3LTUuMTE5IDM1LjYwNSA2LjUxYzguMDM0IDExLjYzIDUuMTIgMjcuNTcxLTYuNTEgMzUuNjA1LTExLjYzIDguMDM1LTI3LjU3MSA1LjEyLTM1LjYwNS02LjUxeiIgZmlsbD0iI2JhYmFiYSIgc3Ryb2tlPSIjN2E3YTdhIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwYXRoIGQ9Ik01NS43MTggNzMuMzc1Yy04LjgyOS0xMi43OC01LjYyNi0zMC4yOTggNy4xNTQtMzkuMTI2IDEyLjc4LTguODI5IDMwLjI5OC01LjYyNiAzOS4xMjYgNy4xNTQgOC44MjkgMTIuNzggNS42MjYgMzAuMjk3LTcuMTU0IDM5LjEyNnMtMzAuMjk3IDUuNjI2LTM5LjEyNi03LjE1NCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==";
  const blockIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NS4zMzIiIGhlaWdodD0iODUuMzMyIiB2aWV3Qm94PSIwIDAgODUuMzMyIDg1LjMzMiI+PHBhdGggZD0iTTU0Ljk3IDI1LjM2MmE1IDUgMCAwIDEgNSA1djQwLjQ2YTUgNSAwIDAgMS01IDVIMTQuNTFhNSA1IDAgMCAxLTUtNXYtNDAuNDZhNSA1IDAgMCAxIDUtNXoiIGZpbGw9IiM5MjkyOTIiLz48cGF0aCBkPSJNNjIuODk2IDE3LjQzNmE1IDUgMCAwIDEgNSA1djQwLjQ2YTUgNSAwIDAgMS01IDVoLTQwLjQ2YTUgNSAwIDAgMS01LTV2LTQwLjQ2YTUgNSAwIDAgMSA1LTV6IiBmaWxsPSJzaWx2ZXIiLz48cGF0aCBkPSJNNzAuODIxIDkuNTExYTUgNSAwIDAgMSA1IDV2NDAuNDZhNSA1IDAgMCAxLTUgNWgtNDAuNDZhNSA1IDAgMCAxLTUtNXYtNDAuNDZhNSA1IDAgMCAxIDUtNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

  const playIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NS4zMzIiIGhlaWdodD0iODUuMzMyIiB2aWV3Qm94PSIwIDAgODUuMzMyIDg1LjMzMiI+PHBhdGggZD0ibTI3LjQzMSAxNi4yMjcgMzguMzA4IDIyLjExOGM0LjUyMiAyLjYxIDQuNTgyIDYuMDczLjE0MyA4LjYzNmwtMzcuNzc1IDIxLjgxYy0yLjc2NCAxLjU5Ni01LjYwNi43My01LjYwNi0zLjE5N1YyMC40MTljMC0zLjQyNyAyLjQ1NS01LjYyIDQuOTMtNC4xOTIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
  const keyIconURI =
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NS4zMzIiIGhlaWdodD0iODUuMzMyIiB2aWV3Qm94PSIwIDAgODUuMzMyIDg1LjMzMiI+PHBhdGggZD0iTTguNzE4IDI1LjIzYzAtNi45MyA1LjYxOS0xMi41NDkgMTIuNTUtMTIuNTQ5IDYuOTMgMCAxMi41NDggNS42MTggMTIuNTQ4IDEyLjU0OXMtNS42MTggMTIuNTQ5LTEyLjU0OSAxMi41NDlTOC43MTggMzIuMTYgOC43MTggMjUuMjI5bTMyLjIzMSAyOS41ODljMC05Ljg0OCA3Ljk4NC0xNy44MzIgMTcuODMyLTE3LjgzMnMxNy44MzMgNy45ODQgMTcuODMzIDE3LjgzMmMwIDkuODUtNy45ODQgMTcuODMzLTE3LjgzMyAxNy44MzNzLTE3LjgzMi03Ljk4NC0xNy44MzItMTcuODMzIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTIzLjgwNyAyNi45ODUgMzAuMzgxIDI1LjYyNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==";

  function doForEachAnimation(func) {
    const targets = Object.values(allAnimations);
    for (let i = 0; i < targets.length; i++) {
      const targetCache = targets[i];
      const targAnims = Object.values(targetCache);
      for (let j = 0; j < targAnims.length; j++) func(targAnims[j]);
    }
  }

  class SPanimations {
    constructor() {
      runtime.on("PROJECT_STOP_ALL", () => {
        doForEachAnimation((anim) => { anim.playing = false });
      });
      runtime.on("PROJECT_START", () => {
        doForEachAnimation((anim) => { anim.playing = false });
      });
      runtime.on("AFTER_EXECUTE", () => {
        if (runtime.ioDevices.clock._paused) return;
        doForEachAnimation((anim) => {
          if (anim.playing) {
            const isReverse = anim.playType === 2 || anim.playType === 4;
            anim.timer += 0.01;
            if (anim.timer > anim.buffer) {
              anim.buffer += anim.fps / 1000;
              if (isReverse) anim.currentFrame--;
              else anim.currentFrame++;

              // 判断这一帧是否是关键帧/造型
              const thisFrame = anim.frames[anim.currentFrame] ?? "";
              if (thisFrame.startsWith(specialID)) {
                const keyframe = anim.specialFrames[thisFrame];
                if (keyframe.type === "pause") anim.buffer += keyframe.secs;
                else this.keyframeUpdate(keyframe, anim, true);
              } else if (thisFrame) {
                const index = anim.target.getCostumeIndexByName(thisFrame);
                if (index > -1) anim.target.setCostume(index);
                else console.warn(`动画 -- 无效的造型 (${thisFrame})`);
              }
            }
            // 完成任何未完成的关键帧
            anim.keyBuffers.forEach((key) => { this.keyframeUpdate(key, anim, false) });

            const frameCnt = anim.frames.length;
            const frameCheck = isReverse ? anim.currentFrame <= 1 : anim.currentFrame >= frameCnt - 1;
            if (frameCheck && anim.keyBuffers.length === 0) {
              this.resetAnimPlayer(anim);
              if (isReverse) anim.currentFrame = frameCnt;
              if (anim.playType < 3) anim.playing = false;
            }
          }
        });
      });
    }
    getInfo() {
      return {
        id: "SPanimations",
        name: "动画",
        color1: "#7a7a7a",
        color2: "#444444",
        color3: "#232323",
        menuIconURI,
        blockIconURI,
        blocks: [
          {
            opcode: "createAnimation",
            blockType: Scratch.BlockType.COMMAND,
            text: "创建名为 [NAME] 的新动画",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "removeAnimation",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除名为 [NAME] 的动画",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "removeAll",
            blockType: Scratch.BlockType.COMMAND,
            text: "删除所有动画"
          },
          {
            opcode: "isExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "动画 [NAME] 存在吗？",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "allAnimationsX",
            blockType: Scratch.BlockType.REPORTER,
            text: "所有 [TYPE] 动画",
            arguments: {
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "pullTypes" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "帧" },
          {
            opcode: "addFrame",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [COSTUME] 添加到 [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              COSTUME: { type: Scratch.ArgumentType.COSTUME }
            },
          },
          {
            opcode: "removeFrame",
            blockType: Scratch.BlockType.COMMAND,
            text: "从 [NAME] 中移除 [COSTUME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              COSTUME: { type: Scratch.ArgumentType.COSTUME }
            },
          },
          {
            opcode: "addAllFrames",
            blockType: Scratch.BlockType.COMMAND,
            text: "将造型从 [COS1] 到 [COS2] 添加到 [NAME]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              COS1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              COS2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            },
          },
          {
            opcode: "removeAllFrames",
            blockType: Scratch.BlockType.COMMAND,
            text: "从 [NAME] 中移除帧 [COS1] 到 [COS2]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              COS1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              COS2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            },
          },
          "---",
          {
            opcode: "addPause",
            blockType: Scratch.BlockType.COMMAND,
            text: "向 [NAME] 添加 [SECOND] 秒暂停，ID 为 [ID]",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              SECOND: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "暂停1" }
            },
          },
          {
            opcode: "removePause",
            blockType: Scratch.BlockType.COMMAND,
            text: "从 [NAME] 中移除 ID 为 [ID] 的暂停帧",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "暂停1" }
            },
          },
          "---",
          {
            opcode: "numFrames",
            blockType: Scratch.BlockType.REPORTER,
            text: "[NAME] 中的帧数",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "frameNames",
            blockType: Scratch.BlockType.REPORTER,
            text: "[NAME] 中的所有帧",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "frameName",
            blockType: Scratch.BlockType.REPORTER,
            text: "[NAME] 中的第 [FRAME] 帧",
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              FRAME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "播放" },
          {
            opcode: "setFPS",
            blockType: Scratch.BlockType.COMMAND,
            text: "将 [NAME] 的 FPS 设置为 [FPS]",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              FPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 }
            },
          },
          {
            opcode: "playBack",
            blockType: Scratch.BlockType.COMMAND,
            text: "播放动画 [NAME] [TYPE]",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "playBack" }
            },
          },
          {
            opcode: "playBackWait",
            blockType: Scratch.BlockType.COMMAND,
            text: "播放动画 [NAME] [TYPE] 直到完成",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "playBack" }
            },
          },
          {
            opcode: "stopAnimation",
            blockType: Scratch.BlockType.COMMAND,
            text: "停止动画 [NAME]",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          "---",
          {
            opcode: "currentFPS",
            blockType: Scratch.BlockType.REPORTER,
            text: "[NAME] 的 FPS",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "isPlaying",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[NAME] 正在播放吗？",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          {
            opcode: "currentFrame",
            blockType: Scratch.BlockType.REPORTER,
            text: "[NAME] 的当前帧",
            blockIconURI: playIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" }
            },
          },
          { blockType: Scratch.BlockType.LABEL, text: "关键帧" },
          {
            opcode: "addPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "向 [NAME] 添加位置关键帧，ID 为 [ID]，起始 x [x] y [y] 结束 x [x2] y [y2]",
            blockIconURI: keyIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "关键帧1" },
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              x2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            },
          },
          {
            opcode: "addDirection",
            blockType: Scratch.BlockType.COMMAND,
            text: "向 [NAME] 添加方向关键帧，ID 为 [ID]，起始 [DIR1] 结束 [DIR2]",
            blockIconURI: keyIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "关键帧1" },
              DIR1: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
              DIR2: { type: Scratch.ArgumentType.ANGLE, defaultValue: 0 }
            },
          },
          {
            opcode: "addScale",
            blockType: Scratch.BlockType.COMMAND,
            text: "向 [NAME] 添加缩放关键帧，ID 为 [ID]，起始 [scale]% 结束 [scale2]%",
            blockIconURI: keyIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "关键帧1" },
              scale: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              scale2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 150 }
            },
          },
          {
            opcode: "addStretch",
            blockType: Scratch.BlockType.COMMAND,
            text: "向 [NAME] 添加拉伸关键帧，ID 为 [ID]，起始宽度 [x] 高度 [y] 结束宽度 [x2] 高度 [y2]",
            blockIconURI: keyIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "关键帧1" },
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              x2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            },
          },
          "---",
          {
            opcode: "deleteKeyframe",
            blockType: Scratch.BlockType.COMMAND,
            text: "从 [NAME] 中移除 ID 为 [ID] 的关键帧",
            blockIconURI: keyIconURI,
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "动画-1" },
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "关键帧1" }
            },
          },
        ],
        menus: {
          playBack: Object.keys(playTypes),
          pullTypes: { acceptReporters: true, items: ["已存在的", "正在播放的"] }
        }
      };
    }

    // 辅助函数
    getAnim(name, util, forAll) {
      if (forAll) {
        let animSearch = undefined;
        doForEachAnimation((anim) => {
          if (anim.name === name) animSearch = anim;
        });
        return animSearch;
      }
      const target = util.target;
      let anim = allAnimations[target.id]?.[name];
      if (anim) return anim;
      else if (!target.isOriginal) {
        anim = allAnimations[target.sprite.clones[0].id]?.[name];
        if (anim) {
          if (allAnimations[target.id] === undefined) allAnimations[target.id] = {};
          const cloneCopy = { ...anim };
          cloneCopy.target = target;
 
          allAnimations[target.id][name] = cloneCopy;
          return cloneCopy;
        }
      }
      return this.createAnimation({ NAME: name, SECRET: true }, util);
    }

    resetAnimPlayer(anim) {
      anim.buffer = anim.fps / 1000;
      anim.timer = 0;
      anim.currentFrame = -1;
    }

    keyframeUpdate(data, anim, init) {
      const target = anim.target;
      let { type, start, end, x1, x2, y1, y2 } = data;
      if (data.startStamp === undefined) data.startStamp = Date.now();
      const elapsedTime = Date.now() - data.startStamp;
      const progress = Math.min(elapsedTime / (anim.fps * 20), 1);
      let delta1, delta2;
      switch (type) {
        case "pos":
          delta1 = x2 - x1;
          delta2 = y2 - y1;
          target.setXY(x1 + delta1 * progress, y1 + delta2 * progress);
          break;
        case "dir":
          delta1 = end - start;
          target.setDirection(start + delta1 * progress);
          break;
        case "size":
          delta1 = end - start;
          target.setSize(start + delta1 * progress);
          break;
        case "stretch":
          delta1 = x2 - x1;
          delta2 = y2 - y1;
          render._allDrawables[target.drawableID].updateScale([
            x1 + delta1 * progress, y1 + delta2 * progress
          ]);
          break;
      }
      if (progress === 1) {
        delete data.startStamp;
        anim.keyBuffers.splice(anim.keyBuffers.indexOf(data), 1);
      } else if (init) anim.keyBuffers.push(data);
    }

    // 块函数
    createAnimation(args, util) {
      const name = Scratch.Cast.toString(args.NAME);
      const id = util.target.id;
      if (allAnimations[id] === undefined) allAnimations[id] = {};
      const obj = {
        name, buffer: 0, timer: 0,
        playing: false, playType: 0,
        fps: 10, target: util.target,
        frames: [], specialFrames: {},
        keyBuffers: [], currentFrame: -1
      };
      allAnimations[id][name] = obj;
      if (args.SECRET) return obj;
    }

    removeAnimation(args, util) {
      const name = Scratch.Cast.toString(args.NAME);
      if (this.isExists(args, util)) delete allAnimations[util.target.id][name];
    }

    removeAll() { allAnimations = {} }

    isExists(args, util) {
      return Scratch.Cast.toBoolean(this.getAnim(args.NAME, "", true));
    }

    addFrame(args, util) {
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(Scratch.Cast.toString(args.COSTUME));
    }

    removeFrame(args, util) {
      const anim = this.getAnim(args.NAME, util);
      const ind = anim.frames.indexOf(Scratch.Cast.toString(args.COSTUME));
      if (ind > -1) anim.frames.splice(ind, 1);
    }

    addAllFrames(args, util) {
      const costumes = util.target.getCostumes();
      const start = Math.min(costumes.length, Math.max(1, Math.round(Scratch.Cast.toNumber(args.COS1))));
      const end = Math.min(costumes.length, Math.max(start, Math.round(Scratch.Cast.toNumber(args.COS2))));
      const anim = this.getAnim(args.NAME, util);
      for (let i = start - 1; i < end; i++) anim.frames.push(costumes[i].name);
    }

    removeAllFrames(args, util) {
      const costumes = util.target.getCostumes();
      const start = Math.min(costumes.length, Math.max(1, Math.round(Scratch.Cast.toNumber(args.COS1))));
      const end = Math.min(costumes.length, Math.max(start, Math.round(Scratch.Cast.toNumber(args.COS2))));
      const anim = this.getAnim(args.NAME, util);
      anim.frames.splice(start - 1, end - (start - 1));
    }

    addPause(args, util) {
      const id = `${specialID}pause-${Scratch.Cast.toString(args.ID)}`;
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(id);
      anim.specialFrames[id] = {
        type: "pause",
        secs: Scratch.Cast.toNumber(args.SECOND)
      };
    }

    removePause(args, util) {
      this.deleteKeyframe(args, util); // 工作方式相同
    }

    numFrames(args) {
      const anim = this.getAnim(args.NAME, "", true);
      return anim ? anim.frames.length : 0;
    }

    frameNames(args) {
      const anim = this.getAnim(args.NAME, "", true);
      if (!anim) return "[]";
      const rawFrames = structuredClone(anim.frames);
      rawFrames.forEach((frame, i) => { rawFrames[i] = frame.replace(specialID, "") });
      return anim ? JSON.stringify(rawFrames) : "[]";
    }

    frameName(args) {
      const anim = this.getAnim(args.NAME, "", true);
      const ind = Scratch.Cast.toNumber(args.FRAME) - 1;
      return anim ? anim.frames[ind].replace(specialID, "") ?? "" : "";
    }

    allAnimationsX(args) {
      let array = [];
      if (args.TYPE === "已存在的") doForEachAnimation((anim) => { array.push(anim.name) });
      else {
        doForEachAnimation((anim) => {
          if (anim.playing) array.push(anim.name);
        });
      }
      return JSON.stringify(array);
    }

    setFPS(args, util) {
      const anim = this.getAnim(args.NAME, util);
      anim.fps = Scratch.Cast.toNumber(args.FPS);
    }

    playBack(args, util) {
      const anim = this.getAnim(args.NAME, util);
      this.resetAnimPlayer(anim);
      anim.playType = playTypes[args.TYPE] ?? 1;
      if (anim.playType === 2 || anim.playType === 4) anim.currentFrame = anim.frames.length;
      anim.playing = true;
    }

    playBackWait(args, util) {
      const anim = this.getAnim(args.NAME, util);
      if (util.stackFrame.executed === undefined) {
        this.resetAnimPlayer(anim);
        anim.playType = playTypes[args.TYPE] ?? 1;
        if (anim.playType === 2 || anim.playType === 4) anim.currentFrame = anim.frames.length;
        anim.playing = true;
        util.stackFrame.executed = true;
        util.yield();
      } else if (anim.playing) util.yield();
    }

    stopAnimation(args, util) {
      const anim = this.getAnim(args.NAME, util);
      anim.playing = false;
    }

    currentFPS(args) {
      const anim = this.getAnim(args.NAME, "", true);
      return anim ? anim.fps : "";
    }

    isPlaying(args) {
      const anim = this.getAnim(args.NAME, "", true);
      return anim ? anim.playing : false;
    }

    currentFrame(args) {
      const anim = this.getAnim(args.NAME, "", true);
      return anim ? anim.currentFrame + 2 : 0; // + 2 因为我们从 -1 开始而不是 0
    }

    addPosition(args, util) {
      const id = `${specialID}pos-${Scratch.Cast.toString(args.ID)}`;
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(id);
      anim.specialFrames[id] = {
        type: "pos",
        x1: Scratch.Cast.toNumber(args.x), x2: Scratch.Cast.toNumber(args.x2),
        y1: Scratch.Cast.toNumber(args.y), y2: Scratch.Cast.toNumber(args.y2)
      };
    }

    addDirection(args, util) {
      const id = `${specialID}dir-${Scratch.Cast.toString(args.ID)}`;
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(id);
      anim.specialFrames[id] = {
        type: "dir",
        start: Scratch.Cast.toNumber(args.DIR1),
        end: Scratch.Cast.toNumber(args.DIR2)
      };
    }

    addScale(args, util) {
      const id = `${specialID}size-${Scratch.Cast.toString(args.ID)}`;
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(id);
      anim.specialFrames[id] = {
        type: "size",
        start: Scratch.Cast.toNumber(args.scale),
        end: Scratch.Cast.toNumber(args.scale2)
      };
    }

    addStretch(args, util) {
      const id = `${specialID}stretch-${Scratch.Cast.toString(args.ID)}`;
      const anim = this.getAnim(args.NAME, util);
      anim.frames.push(id);
      anim.specialFrames[id] = {
        type: "stretch",
        x1: Scratch.Cast.toNumber(args.x), x2: Scratch.Cast.toNumber(args.x2),
        y1: Scratch.Cast.toNumber(args.y), y2: Scratch.Cast.toNumber(args.y2)
      };
    }

    deleteKeyframe(args, util) {
      const id = Scratch.Cast.toString(args.ID);
      const anim = this.getAnim(args.NAME, util);
      const specialFrames = anim.frames.filter((frame) => { return frame.startsWith(specialID) });
      const frame = specialFrames.find((frame) => { return frame.endsWith(id) });
      if (frame !== undefined) {
        anim.frames.splice(anim.frames.indexOf(frame), 1);
        delete anim.specialFrames[frame];
      }
    }
  }

  Scratch.extensions.register(new SPanimations());
})(Scratch);