(function (Scratch) {
  'use strict';

  class MyExtension {
    getInfo() {
      return {
        id: 'simpleConsole', // ID used in the URL, must be unique
        name: 'Simple Console', // Display name
        color1: '#252525ff', // Block color
        color2: '#141414ff', // Outline color
        color3: '#000000ff', // Text highlight color
        blocks: [
          {
            opcode: 'insert',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add [TEXT] to console',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'yomama'
              }
            }
          },
          {
            opcode: 'clear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear console'
          },
          {
            opcode: 'setvisibility',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set console visibility to [VISIBILITY]',
            arguments: {
              VISIBILITY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'showandhide'
              }
            }
          },
          {
            opcode: 'ask',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get user input placeholder: [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          // {
          //   opcode: 'setTextSize',
          //   blockType: Scratch.BlockType.COMMAND,
          //   text: 'set text size to [SIZE]px',
          //   arguments: {
          //     SIZE: {
          //       type: Scratch.ArgumentType.NUMBER,
          //       defaultValue: 20
          //     }
          //   }
          // }
        ],
        menus: {
          showandhide: {
            acceptReporters: true,
            items: ['visible', 'hidden']
          }
        }
      };
    }

    insert({TEXT}) {
      const console = document.getElementById('console')
      const text = document.createElement('span')
      text.textContent = TEXT
      console.appendChild(text)
      console.scrollTop = console.scrollHeight;
    }

    clear() {
        document.getElementById("console").innerHTML = ''
      }

    setvisibility({ VISIBILITY }) {
        const console = document.getElementById('console')
      if(VISIBILITY == 'hidden') {
        console.style.display = 'none'
      } else {
        console.style.display = 'flex'
      }
    }
    setTextSize({SIZE}) {
        const console = document.getElementById('console')
        console.style.fontSize = SIZE
    }

    ask({TEXT}) {
      return new Promise(resolve => {
      const askbox = document.createElement('div')
      const input = document.createElement('div')
      input.contentEditable = true
      input.style = `
      min-height: 25px;
      max-height: 75px;
      overflow-y: scroll;
      outline: none;
      pointer-events: auto;
      background-color: white;
      color: black;
      border-radius: 10px;
      padding: 5px;
      `
      input.textContent = TEXT
      askbox.appendChild(input)
      askbox.className = 'askbox'
      askbox.style = `
      background-color: #00000050;
      border-color: #00000050;
      border-style: solid;
      border-width: 2px;
      width: 100%;
      backdrop-filter: blur(10px);
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
      bottom: 0;
      width: calc(100% - 25px);
      position: absolute;
      `
      askbox.addEventListener('keypress', function (e) {
        if(e.key === 'Enter') {
          const lala = input.textContent
          askbox.remove()
          resolve(lala);
        }
      })
      Scratch.renderer.addOverlay(askbox, "scale")
      input.focus()
        });
    }
  }

  

  Scratch.extensions.register(new MyExtension());

  const panel = document.createElement("div")
  panel.style = `
  width: 100%;
  background-color: #00000063;
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: scroll;
  `
  panel.style.pointerEvents = 'auto';
  panel.id = 'console'
  Scratch.renderer.addOverlay(panel, "scale")


  const style = document.createElement('style')
  style.textContent = `
  ::-webkit-scrollbar {
  display: none
  }
  `
document.body.appendChild(style)
})(Scratch);
