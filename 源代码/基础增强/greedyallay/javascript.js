(function (Scratch) {
  'use strict';

  

  class MyExtension {
    getInfo() {
      return {
        id: 'simpleJS', // ID used in the URL, must be unique
        name: 'Simple JS', // Display name
        color1: '#ff2e2e', // Block color
        color2: '#bb0000ff', // Outline color
        color3: '#b90000ff', // Text highlight color
        blocks: [
          {
            opcode: 'eval',
            blockType: Scratch.BlockType.REPORTER,
            text: 'eval([COMMAND])',
            arguments: {
                COMMAND: {
                    type:Scratch.ArgumentType.STRING,
                    defaultValue: ""
                }
            }
          },
          {
            opcode: 'run',
            blockType: Scratch.BlockType.COMMAND,
            text: 'void [RUN]',
            arguments: {
                RUN: {
                    type:Scratch.ArgumentType.STRING,
                    defaultValue: ""
                }
            }
          },
          {
            opcode: 'constVar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'initialize [TYPE] [NAME] = [VALUE]',
            arguments: {
                TYPE: {
                    type:Scratch.ArgumentType.STRING,
                    menu: 'varInitMenu'
                },
                NAME: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: 'foo'
                },
                VALUE: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: 'bar'
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: 'varTypes'
                }
            }
          },
          {
            opcode: 'getVar',
            blockType: Scratch.BlockType.REPORTER,
            text: 'variable [VARIABLE]',
            arguments: {
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'foo'
              },
            }
          },
          {
            opcode: 'console',
            blockType: Scratch.BlockType.REPORTER,
            text: 'console.[ACTION]([ARGS])',
            arguments: {
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'consoleMenu'
              },
              ARGS: {
                type:Scratch.ArgumentType.STRING,
                defaultValue: "pink cats"
              }
            }
          },
          {
            opcode: 'alert',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ACTION]([ARGS])',
            arguments: {
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'alertMenu'
              },
              ARGS: {
                type:Scratch.ArgumentType.STRING,
                defaultValue: "pink cats"
              }
            }
          },
          {
            opcode: 'function',
            blockType: Scratch.BlockType.COMMAND,
            text: 'function [NAME]([ARGS]) {',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "myFunction"
              },
              ARGS: {
                type:Scratch.ArgumentType.STRING,
                defaultValue: "arg1, arg2"
              },
              SUBSTACK: {
              type: Scratch.ArgumentType.SUBSTACK
            }
            },
          },
          {
            opcode: 'functionStart',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run [NAME]([ARGS]) {',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "myFunction"
              },
              ARGS: {
                type:Scratch.ArgumentType.STRING,
                defaultValue: "arg1, arg2"
              }
            },
          },
          {
            opcode: 'createArray',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create array [NAME]([ARGS]) {',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "myFunction"
              },
              ARGS: {
                type:Scratch.ArgumentType.STRING,
                defaultValue: "arg1, arg2"
              }
            },
          }
        ],
        menus: {
          consoleMenu: {
            acceptReporters: true,
            items: ['log', 'warn', 'error']
          },
          varInitMenu: {
            acceptReporters: true,
            items: ['var', 'let', 'const']
          },
          alertMenu: {
            acceptReporters: true,
            items: ['alert', 'confirm', 'prompt']
          },
          varTypes: {
            acceptReporters: true,
            items: ['string', 'boolean', 'bigint', 'array', 'json', 'undefined', 'null', 'symbol', 'object']
          }
        }
      };
    }

    constVar({TYPE, NAME, VALUE, TYPE}) {
      let newval = ""
      if(TYPE == "string") {
        newval = "''"
      } else if(TYPE == "boolean") {
        newval = "false"

      } else if(TYPE == "bigint") {
        newval = "0"
        
      } else if(TYPE == "array") {
        newval = "[]"
        
      } else if(TYPE == "json") {
        newval = "{}"
        
      } else if(TYPE == "undefined") {
        newval = ""
        
      } else if(TYPE == "null") {
        newval = "''"
        
      } else if(TYPE == "symbol") {
        newval = "''"
        
      } else if(TYPE == "object") {
        newval = "''"
        
      }
        window.eval(`${TYPE} ${NAME} = "${VALUE}"`)
        console.log(`${TYPE} ${NAME} = "${VALUE}"`)

    }
    getVar({VARIABLE}) {
        return window[VARIABLE]
    }

    console({ACTION, ARGS}) {
      window.eval(`console.${ACTION}("${ARGS}")`)
    }

    alert({ACTION, ARGS}) {
      return eval(`${ACTION}("${ARGS}")`)
    }
    eval({COMMAND}) {
      return eval(`"${COMMAND}"`)
    }
    run() {
    }
    functionStart({NAME, ARGS}) {
      return util 
    }
    function({NAME,ARGS, SUBSTACK}, util) {
    window.eval(`function ${NAME}(${ARGS}) {
        }`)
      return util.startBranch(SUBSTACK)
    }
  }

const testvar = "gay pron"
  Scratch.extensions.register(new MyExtension());
})(Scratch);
