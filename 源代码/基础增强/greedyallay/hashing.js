(function (Scratch) {
  'use strict';
  
  async function hashString(input) {
    const encoder = new TextEncoder(); // Create a new TextEncoder instance
    const data = encoder.encode(input); // Convert the input string to a Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Hash the data
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert byte array to hex string
    return hashHex; // Return the hash in hex format
}

  class MyExtension {
    getInfo() {
      return {
        id: 'gahash', // ID used in the URL, must be unique
        name: 'Simple Hash', // Display name
        color1: '#9c3f54ff', // Block color
        color2: '#644a4fff', // Outline color
        color3: '#271b1eff', // Text highlight color
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
          }
        ],
      };
    }

    hash({string}) {
      return hashString(string).then(hash => {
      return hash
      });
    }

  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
