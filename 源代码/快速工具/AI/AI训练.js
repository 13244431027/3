class AITrainingExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.datasets = new Map();
    this.models = new Map();
    this.activeDataset = null;
    this.isTraining = false;
    
    // 设置默认数据集
    this.datasets.set('默认数据集', {
      inputs: [],
      outputs: []
    });
  }

  getInfo() {
    return {
      id: 'aiTraining',
      name: 'AI训练',
      color1: '#FF6B00',
      color2: '#E85D00',
      blocks: [
        {
          opcode: 'startDataCollection',
          blockType: Scratch.BlockType.HAT,
          text: '当开始收集数据',
          arguments: {}
        },
        {
          opcode: 'stopDataCollection',
          blockType: Scratch.BlockType.COMMAND,
          text: '停止收集数据',
          arguments: {}
        },
        {
          opcode: 'addDataPoint',
          blockType: Scratch.BlockType.COMMAND,
          text: '添加数据点 [输入] [输出]',
          arguments: {
            输入: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '0,0'
            },
            输出: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'clearDataset',
          blockType: Scratch.BlockType.COMMAND,
          text: '清空数据集 [数据集名称]',
          arguments: {
            数据集名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认数据集'
            }
          }
        },
        {
          opcode: 'createDataset',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建数据集 [新数据集名称]',
          arguments: {
            新数据集名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '我的数据集'
            }
          }
        },
        {
          opcode: 'trainModel',
          blockType: Scratch.BlockType.COMMAND,
          text: '训练 [模型类型] 使用数据集 [数据集名称]',
          arguments: {
            模型类型: {
              type: Scratch.ArgumentType.STRING,
              menu: 'modelTypes',
              defaultValue: '线性回归'
            },
            数据集名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认数据集'
            }
          }
        },
        {
          opcode: 'trainModelWithParams',
          blockType: Scratch.BlockType.COMMAND,
          text: '训练 [模型类型] 使用数据集 [数据集名称] 参数 [参数]',
          arguments: {
            模型类型: {
              type: Scratch.ArgumentType.STRING,
              menu: 'modelTypes',
              defaultValue: '线性回归'
            },
            数据集名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认数据集'
            },
            参数: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '学习率=0.01,迭代次数=100'
            }
          }
        },
        {
          opcode: 'whenTrainingComplete',
          blockType: Scratch.BlockType.HAT,
          text: '当训练完成时',
          arguments: {}
        },
        {
          opcode: 'predict',
          blockType: Scratch.BlockType.REPORTER,
          text: '使用模型 [模型名称] 预测 [输入]',
          arguments: {
            模型名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认模型'
            },
            输入: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '0,0'
            }
          }
        },
        {
          opcode: 'getAccuracy',
          blockType: Scratch.BlockType.REPORTER,
          text: '模型 [模型名称] 的准确度',
          arguments: {
            模型名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认模型'
            }
          }
        },
        {
          opcode: 'saveModel',
          blockType: Scratch.BlockType.COMMAND,
          text: '保存模型 [模型名称]',
          arguments: {
            模型名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认模型'
            }
          }
        },
        {
          opcode: 'loadModel',
          blockType: Scratch.BlockType.COMMAND,
          text: '加载模型 [模型名称]',
          arguments: {
            模型名称: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '默认模型'
            }
          }
        },
        {
          opcode: 'isTrainingComplete',
          blockType: Scratch.BlockType.BOOLEAN,
          text: '是否训练完成?',
          arguments: {}
        }
      ],
      menus: {
        modelTypes: {
          acceptReporters: true,
          items: ['线性回归', '决策树', '简单神经网络']
        }
      }
    };
  }

  // 开始数据收集
  startDataCollection() {
    this.activeDataset = {
      inputs: [],
      outputs: []
    };
    return true;
  }

  // 停止数据收集
  stopDataCollection(args) {
    if (this.activeDataset) {
      this.datasets.set('默认数据集', this.activeDataset);
      this.activeDataset = null;
    }
  }

  // 添加数据点
  addDataPoint(args) {
    if (!this.activeDataset) {
      // 如果没有激活的数据集，使用默认数据集
      this.activeDataset = this.datasets.get('默认数据集') || {
        inputs: [],
        outputs: []
      };
    }
    
    try {
      const input = args.输入.split(',').map(Number);
      const output = Number(args.输出);
      
      this.activeDataset.inputs.push(input);
      this.activeDataset.outputs.push(output);
    } catch (e) {
      console.error('添加数据点时出错:', e);
    }
  }

  // 清空数据集
  clearDataset(args) {
    const datasetName = args.数据集名称;
    if (this.datasets.has(datasetName)) {
      this.datasets.set(datasetName, {
        inputs: [],
        outputs: []
      });
    }
  }

  // 创建新数据集
  createDataset(args) {
    const newDatasetName = args.新数据集名称;
    if (!this.datasets.has(newDatasetName)) {
      this.datasets.set(newDatasetName, {
        inputs: [],
        outputs: []
      });
    }
  }

  // 训练模型
  trainModel(args) {
    const datasetName = args.数据集名称;
    const modelType = args.模型类型;
    const dataset = this.datasets.get(datasetName);
    
    if (!dataset || dataset.inputs.length === 0) {
      console.error('数据集不存在或为空');
      return;
    }
    
    this.isTraining = true;
    
    // 模拟训练过程（实际实现会更复杂）
    setTimeout(() => {
      switch (modelType) {
        case '线性回归':
          this.models.set('默认模型', this.trainLinearModel(dataset));
          break;
        case '决策树':
          this.models.set('默认模型', this.trainDecisionTree(dataset));
          break;
        case '简单神经网络':
          this.models.set('默认模型', this.trainNeuralNetwork(dataset));
          break;
      }
      
      this.isTraining = false;
      // 触发训练完成事件
      this.runtime.startHats('aiTraining_whenTrainingComplete');
    }, 1000);
  }

  // 带参数的训练
  trainModelWithParams(args) {
    // 实现类似trainModel，但解析参数
    this.trainModel(args);
  }

  // 训练完成事件
  whenTrainingComplete() {
    return !this.isTraining;
  }

  // 预测
  predict(args) {
    const modelName = args.模型名称;
    const model = this.models.get(modelName);
    
    if (!model) {
      console.error('模型不存在:', modelName);
      return 0;
    }
    
    try {
      const input = args.输入.split(',').map(Number);
      
      switch (model.type) {
        case 'linear':
          return this.predictLinear(model, input);
        case 'decisionTree':
          return this.predictDecisionTree(model, input);
        case 'neuralNetwork':
          return this.predictNeuralNetwork(model, input);
        default:
          return 0;
      }
    } catch (e) {
      console.error('预测时出错:', e);
      return 0;
    }
  }

  // 获取准确度
  getAccuracy(args) {
    const modelName = args.模型名称;
    const model = this.models.get(modelName);
    
    if (!model) {
      return 0;
    }
    
    return model.accuracy || 0;
  }

  // 保存模型
  saveModel(args) {
    const modelName = args.模型名称;
    const model = this.models.get(modelName);
    
    if (model) {
      // 在实际实现中，这里会将模型保存到本地存储
      console.log(`模型 ${modelName} 已保存`);
    }
  }

  // 加载模型
  loadModel(args) {
    const modelName = args.模型名称;
    // 在实际实现中，这里会从本地存储加载模型
    console.log(`尝试加载模型 ${modelName}`);
  }

  // 检查训练是否完成
  isTrainingComplete() {
    return !this.isTraining;
  }

  // ========== 模型训练和预测的具体实现 ==========
  
  // 线性回归训练
  trainLinearModel(dataset) {
    // 简化版的线性回归实现
    // 这里使用最小二乘法简单实现
    
    const inputs = dataset.inputs;
    const outputs = dataset.outputs;
    
    if (inputs.length === 0 || inputs[0].length === 0) {
      return { type: 'linear', weights: [0], bias: 0, accuracy: 0 };
    }
    
    const n = inputs.length;
    const dim = inputs[0].length;
    
    // 初始化权重和偏置
    let weights = new Array(dim).fill(0);
    let bias = 0;
    
    // 简单训练过程（实际实现应使用更复杂的算法）
    for (let i = 0; i < 100; i++) {
      let totalError = 0;
      
      for (let j = 0; j < n; j++) {
        // 预测值
        let prediction = bias;
        for (let k = 0; k < dim; k++) {
          prediction += weights[k] * inputs[j][k];
        }
        
        // 误差
        const error = prediction - outputs[j];
        totalError += error * error;
        
        // 更新权重和偏置
        const learningRate = 0.01;
        bias -= learningRate * error;
        for (let k = 0; k < dim; k++) {
          weights[k] -= learningRate * error * inputs[j][k];
        }
      }
    }
    
    // 计算准确度（简化版）
    let accuracy = 0;
    if (n > 0) {
      let correct = 0;
      for (let i = 0; i < n; i++) {
        let prediction = bias;
        for (let k = 0; k < dim; k++) {
          prediction += weights[k] * inputs[i][k];
        }
        
        if (Math.abs(prediction - outputs[i]) < 0.5) {
          correct++;
        }
      }
      accuracy = correct / n;
    }
    
    return {
      type: 'linear',
      weights: weights,
      bias: bias,
      accuracy: accuracy
    };
  }

  // 线性回归预测
  predictLinear(model, input) {
    let result = model.bias;
    for (let i = 0; i < input.length; i++) {
      result += input[i] * model.weights[i];
    }
    return result;
  }

  // 决策树训练（简化版）
  trainDecisionTree(dataset) {
    // 简化版的决策树实现
    const inputs = dataset.inputs;
    const outputs = dataset.outputs;
    
    if (inputs.length === 0) {
      return { type: 'decisionTree', rules: [], accuracy: 0 };
    }
    
    // 简单实现：找到最佳分割点
    let bestSplit = { feature: 0, value: 0, accuracy: 0 };
    const uniqueOutputs = [...new Set(outputs)];
    
    if (uniqueOutputs.length === 1) {
      return {
        type: 'decisionTree',
        rules: [{ output: uniqueOutputs[0] }],
        accuracy: 1
      };
    }
    
    // 尝试每个特征和可能的值
    for (let feature = 0; feature < inputs[0].length; feature++) {
      const values = inputs.map(item => item[feature]);
      const uniqueValues = [...new Set(values)];
      
      for (const value of uniqueValues) {
        let leftCounts = {};
        let rightCounts = {};
        
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i][feature] < value) {
            leftCounts[outputs[i]] = (leftCounts[outputs[i]] || 0) + 1;
          } else {
            rightCounts[outputs[i]] = (rightCounts[outputs[i]] || 0) + 1;
          }
        }
        
        const leftTotal = Object.values(leftCounts).reduce((a, b) => a + b, 0);
        const rightTotal = Object.values(rightCounts).reduce((a, b) => a + b, 0);
        
        const leftAccuracy = leftTotal > 0 ? Math.max(...Object.values(leftCounts)) / leftTotal : 0;
        const rightAccuracy = rightTotal > 0 ? Math.max(...Object.values(rightCounts)) / rightTotal : 0;
        
        const totalAccuracy = (leftAccuracy * leftTotal + rightAccuracy * rightTotal) / (leftTotal + rightTotal);
        
        if (totalAccuracy > bestSplit.accuracy) {
          bestSplit = {
            feature: feature,
            value: value,
            leftCounts: leftCounts,
            rightCounts: rightCounts,
            accuracy: totalAccuracy
          };
        }
      }
    }
    
    return {
      type: 'decisionTree',
      rules: [bestSplit],
      accuracy: bestSplit.accuracy
    };
  }

  // 决策树预测
  predictDecisionTree(model, input) {
    if (model.rules.length === 0) {
      return 0;
    }
    
    const rule = model.rules[0];
    if (input[rule.feature] < rule.value) {
      // 返回左边最常见的输出
      return parseInt(Object.keys(rule.leftCounts).reduce(
        (a, b) => rule.leftCounts[a] > rule.leftCounts[b] ? a : b
      ));
    } else {
      // 返回右边最常见的输出
      return parseInt(Object.keys(rule.rightCounts).reduce(
        (a, b) => rule.rightCounts[a] > rule.rightCounts[b] ? a : b
      ));
    }
  }

  // 简单神经网络训练
  trainNeuralNetwork(dataset) {
    // 简化版的神经网络实现
    // 这里只实现一个非常简单的感知机
    
    const inputs = dataset.inputs;
    const outputs = dataset.outputs;
    
    if (inputs.length === 0 || inputs[0].length === 0) {
      return { type: 'neuralNetwork', weights: [0], bias: 0, accuracy: 0 };
    }
    
    const dim = inputs[0].length;
    let weights = new Array(dim).fill(0);
    let bias = 0;
    
    // 简单训练过程
    for (let epoch = 0; epoch < 100; epoch++) {
      for (let i = 0; i < inputs.length; i++) {
        // 前向传播
        let sum = bias;
        for (let j = 0; j < dim; j++) {
          sum += weights[j] * inputs[i][j];
        }
        
        // 激活函数（简单阶跃函数）
        const prediction = sum >= 0 ? 1 : 0;
        
        // 误差
        const error = outputs[i] - prediction;
        
        // 更新权重和偏置
        const learningRate = 0.1;
        bias += learningRate * error;
        for (let j = 0; j < dim; j++) {
          weights[j] += learningRate * error * inputs[i][j];
        }
      }
    }
    
    // 计算准确度
    let correct = 0;
    for (let i = 0; i < inputs.length; i++) {
      let sum = bias;
      for (let j = 0; j < dim; j++) {
        sum += weights[j] * inputs[i][j];
      }
      const prediction = sum >= 0 ? 1 : 0;
      if (prediction === outputs[i]) {
        correct++;
      }
    }
    
    const accuracy = inputs.length > 0 ? correct / inputs.length : 0;
    
    return {
      type: 'neuralNetwork',
      weights: weights,
      bias: bias,
      accuracy: accuracy
    };
  }

  // 简单神经网络预测
  predictNeuralNetwork(model, input) {
    let sum = model.bias;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * model.weights[i];
    }
    // 使用阶跃函数
    return sum >= 0 ? 1 : 0;
  }
}

// 注册扩展
Scratch.extensions.register(new AITrainingExtension());
