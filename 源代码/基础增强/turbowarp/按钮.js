(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('请取消此扩展的沙箱限制以使其正常工作。');
  }
  
  class Extension {
    constructor() {
      if (typeof Scratch.vm.extensionData == "undefined") {
        console.log("未找到扩展数据");
        Scratch.vm.extensionData = {};
      }
      Scratch.vm.extensionData.EPICevents = {
        button: "_无按钮被点击_",
        buttons: []
      };
    }
    
    getInfo() {
      return {
        id: "EPICevents",
        name: "附加事件",
        color1: "#FFBF00",
        blocks: [
          {
            opcode: 'whenmouseclicked',
            text: '当鼠标在任意位置点击时',
            blockType: Scratch.BlockType.EVENT,
            isEdgeActivated: false
          },
          {
            opcode: 'whenButtonClicked',
            text: '当ID为[ID]的按钮被点击时（有缺陷）',
            blockType: Scratch.BlockType.HAT,
            isEdgeActivated: false,
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: 'buttonMenu'
              }
            }
          },
          {
            opcode: 'createButton',
            text: '创建按钮 ID:[ID] 图片:[IMG]（有缺陷）',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING
              },
              IMG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/dango.png'
              }
            }
          }
        ],
        menus: {
          buttonMenu: {
            acceptReporters: false,
            items: '_getButtonIDs'
          }
        }
      };
    }

    createButton(args) {
      const button = document.createElement('img');
      button.style.width = "2rem";
      button.style.height = "2rem";
      button.style.padding = "0.375rem";
      button.src = args.IMG;
      button.onclick = function() {
        callCustomButton(args.ID);
      }
      const buttoncontainter = document.getElementsByClassName("controls_controls-container_2xinB")[0];
      buttoncontainter.appendChild(button);
      Scratch.vm.extensionData.EPICevents.buttons.push(args.ID);
    }

    whenButtonClicked(args) {
        console.log(`ID: ${args.ID}`);
        console.log(`按钮: ${Scratch.vm.extensionData.EPICevents.button}`);
        return true;
    }

    _getButtonIDs() {
      if (Scratch.vm.extensionData.EPICevents.buttons.length == 0) {
        return ["无可用按钮"];
      } else {
        return Scratch.vm.extensionData.EPICevents.buttons || ["无可用按钮"];
      }
      return ["无可用按钮"];
    }
  }

  document.addEventListener('click', (e) => {
    Scratch.vm.runtime.startHats('EPICevents_whenmouseclicked');
  });

  function callCustomButton(id){
    Scratch.vm.extensionData.EPICevents.button = id;
    Scratch.vm.runtime.startHats('EPICevents_whenButtonClicked', {
      ID: id
    });
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
