(function (Scratch) {
  'use strict';

      
  class MyExtension {
    getInfo() {
      return {
        id: 'customStyle', // ID used in the URL, must be unique
        name: 'Custom Styles', // Display name
        color1: '#4c2ae4ff', // Block color
        color2: '#3d20beff', // Outline color
        color3: '#280e9bff', // Text highlight color
        blocks: [
          {
            opcode: 'setStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [ELEMENTS][ATTRIBUTE] [STYLE] to [VALUE]',
            arguments: {
                ELEMENTS: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'elements'
                },
                STYLE: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'style'
                },
                VALUE: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "#FF6666"
                },
                ATTRIBUTE: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "",
                    menu: 'attribute'
                }
            }
          },
          {
            opcode: 'addType',
            blockType: Scratch.BlockType.BUTTON,
            text: '',
          },
        ],
        menus: {
          elements: {
            acceptReporters: true,
            items: ['*', 'body', 'text', 'div', 'span']
          },
          style: {
            acceptReporters: true,
            items: ['background-color', 'color', 'padding', 'margin', 'font-family', 'font-size', 'DANGER ZONE', 'transform: scale', 'transform: translateX', 'transform: translateY', 'transform: translateZ']
          },
          attribute: {
            acceptReporters: true,
            items: ['', ':hover', ':active']
          }
        }
      };
    }

    setStyle({ELEMENTS, STYLE, VALUE, ATTRIBUTE}) {
        let selector = "*"
        if(ELEMENTS !== "*") {
            selector + ":" + ELEMENTS
        }
        if(STYLE.includes("transform")) {
        style.textContent = `
        ${ELEMENTS}${ATTRIBUTE} {
        ${STYLE}(${VALUE}) !important;
        }
        `
        } else {
        style.textContent = `
        ${ELEMENTS}${ATTRIBUTE} {
        ${STYLE}: ${VALUE} !important;
        }
        `
        }
        document.head.appendChild(style)
        console.log(style)
    }

    repeatText({ TEXT, TIMES }) {
      return TEXT.repeat(Number(TIMES));
    }

    menuBlock({ CHOICE }) {
      return `You chose: ${CHOICE}`;
    }
  }
const style = document.createElement("style")


  Scratch.extensions.register(new MyExtension());
})(Scratch);
