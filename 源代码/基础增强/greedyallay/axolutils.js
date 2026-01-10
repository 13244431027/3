(function (Scratch) {
  'use strict';

  class MyExtension {
    getInfo() {
      return {
        id: 'axolutils', // ID used in the URL, must be unique
        name: 'Axolutils', // Display name
        color1: '#ff6680', // Block color
        color2: '#ff4d6d', // Outline color
        color3: '#cc3355', // Text highlight color
        blocks: [
          {
            opcode: 'hash',
            blockType: Scratch.BlockType.REPORTER,
            text: 'hash [string]',
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
              }
            }
          },
          {
            opcode: 'compress image',
            blockType: Scratch.BlockType.REPORTER,
            text: 'hash [string]',
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'cat'
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
    hash({string}) {
      return hashString(string).then(hash => {
      return hash
      });
    }
  }
  

  Scratch.extensions.register(new MyExtension());

  async function hashString(input) {
      const encoder = new TextEncoder(); // Create a new TextEncoder instance
      const data = encoder.encode(input); // Convert the input string to a Uint8Array
      const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the data
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert byte array to hex string
      return hashHex; // Return the hash in hex format
  }

})(Scratch);


