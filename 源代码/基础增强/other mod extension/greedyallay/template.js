(function (Scratch) {
  'use strict';

  class MyExtension {
    getInfo() {
      return {
        id: 'myExtension', // ID used in the URL, must be unique
        name: 'My Extension', // Display name
        color1: '#ff6680', // Block color
        color2: '#ff4d6d', // Outline color
        color3: '#cc3355', // Text highlight color
        blocks: [
          {
            opcode: 'helloWorld',
            blockType: Scratch.BlockType.COMMAND,
            text: 'say hello world',
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
          choicesMenu: {
            acceptReporters: true,
            items: ['Option A', 'Option B', 'Option C']
          }
        }
      };
    }

    helloWorld() {
      alert('Hello, world!');
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
