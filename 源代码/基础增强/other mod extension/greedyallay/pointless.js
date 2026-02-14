(function (Scratch) {
  'use strict';


  async function getMyIP() {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip; // e.g., "123.45.67.89"
    } catch (err) {
      console.error('Could not get IP:', err);
      return '0.0.0.0';
    }
  }

  // Example usage
  getMyIP().then(ip => {
    const [A, B, C, D] = ip.split('.');
    console.log('Default IP parts:', A, B, C, D);
  });

  class MyExtension {
    getInfo() {
      return {
        id: 'pointless', // ID used in the URL, must be unique
        name: 'Pointless Extension', // Display name
        color1: '#ff6680', // Block color
        color2: '#ff4d6d', // Outline color
        color3: '#cc3355', // Text highlight color
        blocks: [
          {
            opcode: 'ip',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ip [A].[B].[C].[D]',
            arguments: {
              A: {
                TYPE: Scratch.ArgumentType.NUMBER,
                menu: 'ip'
              },
              B: {
                TYPE: Scratch.ArgumentType.NUMBER,
                menu: 'ip'
              },
              C: {
                TYPE: Scratch.ArgumentType.NUMBER,
                menu: 'ip'
              },
              D: {
                TYPE: Scratch.ArgumentType.NUMBER,
                menu: 'ip'
              },
            }
          },
          {
            opcode: 'repeatText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'repeat [TEXT] [TIMES] times',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi'
              },
              TIMES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
          {
            opcode: 'menuBlock',
            blockType: Scratch.BlockType.REPORTER,
            text: 'selected [CHOICE]',
            arguments: {
              CHOICE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'choicesMenu'
              }
            }
          }
        ],
        menus: {
          ip: {
            acceptReporters: true,
            items: 'generateIPmenu'
          }
        }
      };
    }

    ip({A, B, C, D}) {
      return(`${A}.${B}.${C}.${D}`)
    }

    generateIPmenu() {
      let lala = []
      for(let i = 0; i < 256; i++) {
        lala[i] = String(i)
      }
      return lala
    }

    


    repeatText({ TEXT, TIMES }) {
      return TEXT.repeat(Number(TIMES));
    }

    menuBlock({ CHOICE }) {
      return `You chose: ${CHOICE}`;
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
