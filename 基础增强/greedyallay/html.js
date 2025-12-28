(function (Scratch) {
  'use strict';


  let elements = []
  let IDs = []
  let clicked = {}
  let lastclicked = null

  const newstyle = document.createElement('style')
  newstyle.textContent = 
  `
  .clickable:hover{
  filter: brightness(1.2);
  cursor: pointer;
  transition: .1s;
  box-shadow: none;
  }
  .clickable:active{
  transform: scale(.98);
  filter: brightness(0.80);
  box-shadow: none;
  }
  `
  document.body.appendChild(newstyle)

  class MyExtension {
    getInfo() {
      return {
        id: 'html', // ID used in the URL, must be unique
        name: 'HTML', // Display name
        color1: '#72b136ff', // Block color
        color2: '#5f942eff', // Outline color
        color3: '#4f7a27ff', // Text highlight color
        blocks: [
          {
            opcode: 'create',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create element type: [TYPE] id: [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'div'
              }
              
            }
          },
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set property of id: [ID] property: [PROP] value: [VALUE]',
            color1: '#3680b1ff',
            color2: '#27638bff',
            color3: '#265a7cff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'textContent'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              },
            }
          },
          {
            opcode: 'getData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get data of property [PROP] from id [ID]',
            color1: '#3680b1ff',
            color2: '#27638bff',
            color3: '#265a7cff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              }
            }
          },
          {
            opcode: 'append',
            blockType: Scratch.BlockType.COMMAND,
            text: 'append [ID] to [TARGET]',
            color1: '#b1af36ff',
            color2: '#8b8127ff',
            color3: '#7a7c26ff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targets'
              }
            }
          },
          {
            opcode: 'remove',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove [ID]',
            color1: '#b13636ff',
            color2: '#8b2727ff',
            color3: '#7c2626ff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'removeProp',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove property of id: [ID] property: [PROP]',
            color1: '#b13636ff',
            color2: '#8b2727ff',
            color3: '#7c2626ff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              PROP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hidden'
              },
            }
          },
          // {
          //   opcode: 'run',
          //   blockType: Scratch.BlockType.COMMAND,
          //   text: 'JavaScript [CODE]',
          //   arguments: {
          //     CODE: {
          //       type: Scratch.ArgumentType.STRING,
          //       defaultValue: 'alert("Are you good bro?")'
          //     }
          //   }
          // },
          // {
          //   opcode: 'runReturn',
          //   blockType: Scratch.BlockType.REPORTER,
          //   text: 'JavaScript [CODE]',
          //   arguments: {
          //     CODE: {
          //       type: Scratch.ArgumentType.STRING,
          //       defaultValue: 'alert("Are you good bro?")'
          //     }
          //   }
          // },
          {
            blockType: Scratch.BlockType.LABEL,
            text: ''
          },
          {
            opcode: 'clickevent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add click EventListener id: [ID]',
            color1: '#b1af36ff',
            color2: '#8b8127ff',
            color3: '#7a7c26ff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'getClicked',
            blockType: Scratch.BlockType.HAT,
            text: 'when [ID] is clicked',
            color1: '#b1af36ff',
            color2: '#8b8127ff',
            color3: '#7a7c26ff',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'getHeld',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get currently clicked button',
            color1: '#b1af36ff',
            color2: '#8b8127ff',
            color3: '#7a7c26ff',
          },
          {
            opcode: 'resetClicked',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset last clicked',
            color1: '#b1af36ff',
            color2: '#8b8127ff',
            color3: '#7a7c26ff',
          },
          {
            opcode: 'makeDraggable',
            blockType: Scratch.BlockType.COMMAND,
            text: 'make [ID] [DRAG]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              DRAG: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dragmenu'
              }
            }
          },
          {
            opcode: 'addClass',
            blockType: Scratch.BlockType.REPORTER,
            text: 'add [THING] to [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              },
              THING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'things'
              }
            }
          },
          
          {
            opcode: 'hideall',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set visibility of [ID] to [VISIBILITY]',
            arguments: {
              VISIBILITY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'visibility'
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'reset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset',
            color1: '#b13636ff',
            color2: '#8b2727ff',
            color3: '#7c2626ff',
          },
          
        ],
        menus: {
          visibility: {
            acceptReporters: true,
            items: ['visible', 'hidden']
          },
          drag: {
            acceptReporters: false,
            items: ['draggable', 'not draggable']
          },
          thing: {
            acceptReporters: false,
            items: ['clickable']
          },
          targets: {
            acceptReporters: true,
            items: "getIDs"
          }
        }
      };
    }

    create({ID, TYPE}) {
      if(!IDs.includes(ID)) {
        elements.push(document.createElement(TYPE))
        IDs.push(ID)

        const element = elements[IDs.indexOf(ID)]
        element.id = ID
        element.style.pointerEvents = 'auto';
        console.log(elements)
        console.log(IDs)
      }
      
    }

    append({ID, TARGET}) {
      console.log(` how is this even possible ${TARGET}`)
      if(TARGET === 'stage') {
        Scratch.renderer.addOverlay(elements[IDs.indexOf(ID)], "scale")
      } else {
        elements[IDs.indexOf(TARGET)].appendChild(elements[IDs.indexOf(ID)])
      }
      
    }

    set({ID, PROP, VALUE}) {
      const index = IDs.indexOf(ID);
      let stuff = ""
      if (index !== -1) {
        if(typeof VALUE === 'string') {
          stuff = `"${VALUE}"`
        } else if(typeof VALUE === 'number' || typeof VALUE === 'boolean') {
          stuff = `${VALUE}`
        }
        eval(`elements[${index}].${PROP} = ${stuff}`);
      } else {
        console.warn(`"${ID}" does not exist`);
      }
    }

    removeProp({ID, PROP}) {
      const index = IDs.indexOf(ID);
      if (index !== -1) {
        elements[index].removeAttribute(PROP)
      } else {
        console.warn(`"${ID}" does not exist`);
      }
    }

    remove({ID}) {
      const index = IDs.indexOf(ID);
      if (index !== -1) {
        const element = elements[index];
        if (element) {element.remove()} ;
        elements.splice(index, 1);
        IDs.splice(index, 1);
        delete clicked[ID];
      }
    }

    getIDs() {
      let output = ['stage']
      return output.concat(IDs)
    }

    run({CODE}) {
      eval([CODE])
    }

    runReturn({CODE}) {
      return eval([CODE])
    }

    clickevent({ID}) {
      const element = elements[IDs.indexOf(ID)]
      if(element !== null) {
        element.className = 'clickable'
        element.addEventListener('pointerdown', () => {
          clicked[ID] = true
          lastclicked = ID
        })
        element.addEventListener('pointerup', () => {
          clicked[ID] = false
        })
      }
    }

    getClicked({ID}) {
      if(clicked[ID]) {
        return clicked[ID]
      } else {
        return false
      }
    }

    getHeld() {
      if(lastclicked)  {
        return(lastclicked)
      } else {
        return ""
      }
      
    }

    hideall({VISIBILITY, ID}) {
      if(ID == '') {
        const element = elements[IDs.indexOf(ID)]
        if(VISIBILITY === 'hidden') {
        element.hidden = true
        } else {
        element.hidden = false
          
        }
      } else {
      for(let i = 0; i < elements.length; i++) {
      if(VISIBILITY === 'hidden') {
        elements[i].hidden = true
      } else {
        elements[i].hidden = false
      }}}}

    reset() {
      for(let i = 0; i < elements.length; i++) {
        elements[i].remove()
      }
      clicked = {}
      elements = []
      IDs = []
      lastclicked = null
    }

    makeDraggable({ID, DRAG}) {
      const element = elements[IDs.indexOf(ID)]
      if(DRAG === 'draggable') {
        element.addEventListener('click', (e) => {
          console.log('added dragging capabilities to this specific shit')
        })
      } else {
          console.log('i hate you i mean love you')
      }
    }

    getData({ID, PROP}) {
      const element = elements[IDs.indexOf(ID)]
      return element[PROP]
    }

    resetClicked() {
      lastclicked = null
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
