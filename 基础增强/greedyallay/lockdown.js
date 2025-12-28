class MyExtension {
  getInfo() {
    return {
      id: 'lockdown',
      name: 'lockdown',
      color1: '#1b2330',
      blocks: [
        {
          opcode: 'ghostBranch',
          blockType: Scratch.BlockType.CONDITIONAL, // C-shaped block
          text: 'only run if [statement]',
          arguments: {
            statement: {
                type: Scratch.ArgumentType.BOOLEAN,
            }
          }
        }
      ]
    }
  }

  ghostBranch({statement}) {
    return statement;
  }
}

Scratch.extensions.register(new MyExtension());
