//Name: On-screen controls
//ID: gaOSC
//Description: Customisable multitouch controls for any game


(function (Scratch) {
  'use strict';

  const style = document.createElement('style')
  style.textContent = `
  .osc-button:active {
    filter: brightness(.8);
    backdrop-filter: blur(10px) !important;
  }
  `
  document.body.appendChild(style)

  document.addEventListener("contextmenu", e => {
  if (e.target.closest("div[id]")) { // only block for your custom buttons
    e.preventDefault();
    return false;
  }
  }, { passive: false });


  class MyExtension {
    getInfo() {
      return {
        id: 'gaOSC', // ID used in the URL, must be unique
        name: 'On-screen controls', // Display name
        color1: '#4ca880', // Block color
        color2: '#3f8f6cff', // Outline color
        color3: '#398061ff', // Text highlight color
        blocks: [
          {
            opcode: 'createButton',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create new button text/image: [TEXT] x: [X] y: [Y] scale: [SIZE] id: [ID]',
            arguments: {
                X: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Y: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 0
                },
                SIZE: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 10
                },
                TEXT: {
                    type:Scratch.ArgumentType.STRING,
                    defaultValue: "hello"
                },
                ID: {
                    type:Scratch.ArgumentType.STRING,
                    defaultValue: `1`
                }
            }
          },
          {
            opcode: 'removeButton',
            blockType: Scratch.BlockType.COMMAND,
            text: "remove button id: [ID]",
            arguments: {
                ID: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "1"
                }
            }
          },
          {
            opcode: 'removeAll',
            blockType: Scratch.BlockType.COMMAND,
            text: "remove all buttons"
          },
          {
            opcode: 'checkButton',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'button [ID] pressed?',
            arguments: {
                ID: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "1"
                }
            }
          },
          // {
          //   opcode: 'setButtonColor',
          //   blockType: Scratch.BlockType.COMMAND,
          //   text: 'set button [ID] color to: [COLOR] text: [TXTCOLOR]',
          //   arguments: {
          //     ID: {
          //       type: Scratch.ArgumentType.STRING,
          //       defaultValue: 1,
          //     },
          //     COLOR: {
          //       type: Scratch.ArgumentType.STRING,
          //       defaultValue: 1,
          //     },
          //     TXTCOLOR: {
          //       type: Scratch.ArgumentType.STRING,
          //       defaultValue: 1,
          //     },

          //   }
          // },
          {
            opcode: 'getError',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last error',
          }
        ],
      };
    }
    createButton({X, Y, SIZE, TEXT, ACTION, ID}) {
      const scale = SIZE*10
      if(!existingButtons.includes(ID)) {
        const button = document.createElement("div")
        const icon = document.createElement('img')
        button.className = 'osc-button'
        button.style = `
        background-color: green;
        padding: 20px;
        background-color: rgba(14, 14, 14, 0.21);
        border-radius: 100%;
        border-style: solid;
        border-color: rgba(14, 14, 14, 0.39);
        margin-left: ${X}px;
        margin-top: ${Y}px;
        max-width: ${scale}px;
        max-height: ${scale}px;
        backdrop-filter: blur(1px);
        aspect-ratio: 1/1;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        touch-action: none;
        transition: .06s;
        `
        icon.style.width = '100%'
        icon.style.height = '100%'
        button.style.pointerEvents = 'auto';
        let isImage = false
        if(TEXT.includes('http') || TEXT.includes('data:')) {
          icon.src = TEXT
          isImage = true
          button.appendChild(icon)
        } else {
          button.textContent = TEXT
          
      }
        button.id = ID
        existingButtons.push(ID)
        button.addEventListener("pointerdown", function() {
            pressedButtons.push(button.id)
        console.log(`pressed   ${button.id}`)
        })
        function cancel() {
          const newArray = pressedButtons.filter(item => item !== button.id)
          pressedButtons = newArray
          console.log(`unpressed ${button.id}`)
        }
        button.addEventListener("pointerup", () => {
          cancel()
        })
        button.addEventListener("pointercancel", () => {
          cancel()
        })
        Scratch.renderer.addOverlay(button, "scale")
      } else {
        error = 'this button already exists'
      }
      // button.addEventListener("contextmenu", e => e.preventDefault());
      // icon.addEventListener("contextmenu", e => e.preventDefault());
    }
    removeButton({ID}) {
      if(document.getElementById(ID)) {
        const element = document.getElementById(ID)
        const index = existingButtons.indexOf(ID)
        if(existingButtons.includes(ID)) {
        const newArray = existingButtons.filter(item => item !== ID)
        existingButtons = newArray
        } else {
          console.log("couldn't find that button")
        }
        element.remove()
      }
    }
    checkButton({ID}) {
        return pressedButtons.includes(ID)
    }
    setButtonColor({ID, COLOR, TXTCOLOR}) {
      style = document.getElementById(ID).style 
      document.getElementById(ID).style = style + `background-color: ${COLOR}; color: ${TXTCOLOR};`
    }
    getError() {
      return error
    }
    removeAll() {
        for(let i = 0; i < existingButtons.length; i++) {
          document.getElementById(existingButtons[i]).remove()
        }
        existingButtons = []
        pressedButtons = []
    }

  }
  let pressedButtons = []
  let existingButtons = []
  let error = ""

  Scratch.extensions.register(new MyExtension());
})(Scratch);
