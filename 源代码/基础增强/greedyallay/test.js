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
          }
        ]
      };
    }

    helloWorld() {
      alert('Hello, world!');
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
