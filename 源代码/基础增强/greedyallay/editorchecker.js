(function (Scratch) {
  'use strict';

      
  class MyExtension {
    getInfo() {
      return {
        id: 'editorDetector', // ID used in the URL, must be unique
        name: 'Editor Detector', // Display name
        color1: '#FFBF00', // Block color
        color2: '#e0a800ff', // Outline color
        color3: '#ca9800ff', // Text highlight color
        blocks: [
          {
            opcode: 'editorOpened',
            blockType: Scratch.BlockType.HAT,
            text: 'when editor is opened',
            isEdgeActivated: false,
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

    editorOpened() {
      return true
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
