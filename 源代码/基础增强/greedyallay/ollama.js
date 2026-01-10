(function (Scratch) {
  'use strict';

  class MyExtension {
    getInfo() {
      return {
        id: 'ollamaAI', // ID used in the URL, must be unique
        name: 'Ollama AI', // Display name
        color1: '#d1d1d1ff', // Block color
        color2: '#b6b6b6ff', // Outline color
        color3: '#1d1d1dff', // Text highlight color
        blocks: [
          {
            opcode: 'ask',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ask [QUESTION]',
            arguments: {
                QUESTION: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "why are bananas not straight"
                }
            }
          },
          {
            opcode: 'setSystem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set system message to [MESSAGE]',
            arguments: {
                MESSAGE: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "talk with a strong italian accent"
                }
            }
          },
          {
            opcode: 'model',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set model to [CHOICE]',
            arguments: {
              CHOICE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'models',
                defaultValue: "gemma3"
              }
            }
          },
          {
            opcode: 'setIP',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set ollama server address to [ADDRESS]',
            arguments: {
                ADDRESS: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "http://localhost:11434/api/generate"
                }
            }
          },
          // {
          //   opcode: 'addModel',
          //   blockType: Scratch.BlockType.COMMAND,
          //   text: 'add model to list [MODEL]',
          //   arguments: {
          //       MODEL: {
          //           type: Scratch.ArgumentType.STRING,
          //           defaultValue: "test"
          //       }
          //   }
          // },
          {
            opcode: 'getModel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current model'
          },
          {
            opcode: 'lastResponse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last response'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Note:'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Before using, please set up Ollama or'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'connect to a (paid) online API.'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Local installation instructions are below'
          },
          {
            opcode: 'documentation',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Ollama Documentation'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'WARNING: unless you connect to an'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'API or enable port forwarding, this will'
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'NOT work for others!'
          },
        ],
        menus: {
          models: {
            acceptReporters: true,
            items: list,
          }
        }
      };
    }

    async ask({ QUESTION }){
        console.log(QUESTION)
        const response = await sendRequest(QUESTION)
        return response
    }

    model({ CHOICE }) {
      model = CHOICE
      console.log(`Model: ${CHOICE}`)
    }
    getModel() {
      return model
    }
    setSystem({MESSAGE}) {
      system = MESSAGE
      console.log(`System message set to ${MESSAGE} yayy`)
    }
    setIP({ADDRESS}) {
      URL = ADDRESS
      console.log(`I hope the adress is now set to ${ADDRESS}`)
    }
    addModel({MODEL}) {
      list.push(MODEL)
      console.log(list)
    }
    documentation() {
      window.open("https://github.com/ollama/ollama/blob/main/README.md")
    }
    lastResponse() {
      return lastResponse
    }
  }

  // ollama duckery :D

    let system = "please keep your response short. You cannot use formatting."
    let URL = "http://localhost:11434/api/generate"
    let model = "gemma3"
    let list = [
      "gemma3:1b",
      "gemma3",
      "gemma3:12b",
      "gemma3:27b",
      "qwq",
      "deepseek-r1",
      "deepseek-r1:671b",
      "llama4:scout",
      "llama4:maverick",
      "llama3.3",
      "llama3.2",
      "llama3.2:1b",
      "llama3.2-vision",
      "llama3.2-vision:90b",
      "llama3.1",
      "llama3.1:405b",
      "phi4",
      "phi4-mini",
      "mistral",
      "moondream",
      "neural-chat",
      "starling-lm",
      "codellama",
      "llama2-uncensored",
      "llava",
      "granite3.3",
    ]
    let lastResponse = ""

    async function sendRequest(prompt) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt: `${prompt} (${system})`,
        stream: false,
      })
    });

    if (!response.ok) {
      throw new Error("err " + response.status);
    }

    const responsejson = await response.json();
    lastResponse = responsejson.response
    console.log("Actually got something back!", responsejson);
    return responsejson.response; // <-- return the actual text you want
  } catch (error) {
    console.error(error);
    return `(Error ${error.message}) - This is most likely caused by you changing the Ollama ip or Ollama isn't running yet. You might also still need to download the model!`;
  }
}

const style = document.createElement('style');
style.textContent = `
g[data-category="Ollama AI"] text[class="blocklyText"] {
    stroke: ;
    fill: #1c1c1c !important;

}
`;
document.head.appendChild(style);


  Scratch.extensions.register(new MyExtension());
})(Scratch);

