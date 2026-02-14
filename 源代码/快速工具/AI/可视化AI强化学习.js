(function(ext) {
    // 清理函数
    ext._shutdown = function() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        if (canvas && document.body.contains(canvas)) {
            document.body.removeChild(canvas);
        }
    };
    
    // 扩展状态描述
    ext._getStatus = function() {
        return {status: 2, msg: '准备就绪'};
    };
    
    // 扩展块描述
    var descriptor = {
        blocks: [
            [' ', '初始化强化学习环境 %m.envType %m.numInputs %m.numOutputs', 'initRL', 'CartPole', '3', '10'],
            [' ', '开始训练', 'startTraining'],
            [' ', '暂停训练', 'pauseTraining'],
            [' ', '重置训练', 'resetTraining'],
            [' ', '设置变异率 %n', 'setMutationRate', 5],
            [' ', '设置学习率 %n', 'setLearningRate', 0.1],
            [' ', '设置种群大小 %n', 'setPopulationSize', 5],
            [' ', '设置隐藏层数 %n', 'setHiddenLayers', 1],
            [' ', '设置隐藏层神经元数 %n', 'setHiddenNeurons', 6],
            [' ', '设置精英保留数 %n', 'setEliteCount', 1],
            [' ', '设置选择压力 %n', 'setSelectionPressure', 3],
            [' ', '自动保存 %m.autoSaveOptions %n', 'setAutoSave', '开启', 0.8],
            [' ', '执行交叉操作', 'performCrossover'],
            [' ', '执行变异操作', 'performMutation'],
            [' ', '显示模型数据', 'showModelData'],
            ['r', '保存到本地 %s', 'saveToLocal', 'my_model'],
            ['r', '从本地加载 %s', 'loadFromLocal', 'my_model'],
            [' ', '显示可视化', 'showVisualization'],
            [' ', '隐藏可视化', 'hideVisualization'],
            [' ', '切换可视化', 'toggleVisualization'],
            [' ', '显示说明', 'showInstructions'],
            ['r', '当前适应度', 'getFitness'],
            ['r', '当前代数', 'getGeneration'],
            ['r', '最佳适应度', 'getBestFitness'],
            ['r', '平均适应度', 'getAverageFitness'],
            ['r', '网络数量', 'getNetworkCount'],
            ['r', '已保存模型数', 'getSavedModelsCount'],
            ['r', '加载结果', 'getLoadResult']
        ],
        menus: {
            envType: ['CartPole', 'MountainCar', 'Acrobot', 'LunarLander', 'Maze'],
            numInputs: ['2', '3', '4', '5', '6', '7', '8'],
            numOutputs: ['1', '2', '3', '4', '5', '6'],
            autoSaveOptions: ['开启', '关闭']
        }
    };
    
    // 扩展初始化
    ext.initRL = function(envType, numInputs, numOutputs) {
        // 保存环境类型
        currentEnvType = envType;
        
        // 初始化强化学习环境
        console.log("初始化环境: " + envType + ", 输入: " + numInputs + ", 输出: " + numOutputs);
        
        // 创建可视化画布
        createVisualizationCanvas();
        
        // 初始化神经网络和训练参数
        initNeuralNetwork(parseInt(numInputs), parseInt(numOutputs));
        
        // 启动渲染循环
        requestAnimationFrame(render);
        
        // 重置加载结果
        lastLoadResult = "未加载";
    };
    
    // 开始训练
    ext.startTraining = function() {
        console.log("开始训练");
        isTraining = true;
        lastUpdateTime = Date.now();
    };
    
    // 暂停训练
    ext.pauseTraining = function() {
        console.log("暂停训练");
        isTraining = false;
    };
    
    // 重置训练
    ext.resetTraining = function() {
        console.log("重置训练");
        generation = 0;
        bestFitness = 0;
        averageFitness = 0;
        isTraining = false;
        resetNetworks();
    };
    
    // 设置变异率
    ext.setMutationRate = function(rate) {
        console.log("设置变异率: " + rate + "%");
        mutationRate = rate / 100;
    };
    
    // 设置学习率
    ext.setLearningRate = function(rate) {
        console.log("设置学习率: " + rate);
        learningRate = rate;
    };
    
    // 设置种群大小
    ext.setPopulationSize = function(size) {
        console.log("设置种群大小: " + size);
        populationSize = Math.max(2, Math.min(50, size));
        // 重新初始化网络
        if (networks.length > 0) {
            const numInputs = networks[0].layers[0].neurons;
            const numOutputs = networks[0].layers[networks[0].layers.length - 1].neurons;
            initNeuralNetwork(numInputs, numOutputs);
        }
    };
    
    // 设置隐藏层数
    ext.setHiddenLayers = function(layers) {
        console.log("设置隐藏层数: " + layers);
        hiddenLayers = Math.max(1, Math.min(3, layers));
        // 重新初始化网络
        if (networks.length > 0) {
            const numInputs = networks[0].layers[0].neurons;
            const numOutputs = networks[0].layers[networks[0].layers.length - 1].neurons;
            initNeuralNetwork(numInputs, numOutputs);
        }
    };
    
    // 设置隐藏层神经元数
    ext.setHiddenNeurons = function(neurons) {
        console.log("设置隐藏层神经元数: " + neurons);
        hiddenNeurons = Math.max(4, Math.min(16, neurons));
        // 重新初始化网络
        if (networks.length > 0) {
            const numInputs = networks[0].layers[0].neurons;
            const numOutputs = networks[0].layers[networks[0].layers.length - 1].neurons;
            initNeuralNetwork(numInputs, numOutputs);
        }
    };
    
    // 设置精英保留数
    ext.setEliteCount = function(count) {
        console.log("设置精英保留数: " + count);
        eliteCount = Math.max(0, Math.min(5, count));
    };
    
    // 设置选择压力
    ext.setSelectionPressure = function(pressure) {
        console.log("设置选择压力: " + pressure);
        selectionPressure = Math.max(1, Math.min(10, pressure));
    };
    
    // 设置自动保存
    ext.setAutoSave = function(option, threshold) {
        autoSaveEnabled = (option === '开启');
        autoSaveThreshold = threshold / 100;
        console.log("自动保存: " + option + ", 阈值: " + autoSaveThreshold);
    };
    
    // 执行交叉操作
    ext.performCrossover = function() {
        console.log("执行交叉操作");
        performCrossover();
    };
    
    // 执行变异操作
    ext.performMutation = function() {
        console.log("执行变异操作");
        performMutation();
    };
    
    // 显示模型数据
    ext.showModelData = function() {
        if (!bestNetwork) {
            alert("没有可用的模型数据，请先训练网络");
            return;
        }
        
        const inputSize = bestNetwork.layers[0].neurons;
        const outputSize = bestNetwork.layers[bestNetwork.layers.length - 1].neurons;
        const hiddenLayersCount = bestNetwork.layers.length - 2;
        let totalWeights = 0;
        
        for (let i = 0; i < bestNetwork.weights.length; i++) {
            for (let j = 0; j < bestNetwork.weights[i].length; j++) {
                totalWeights += bestNetwork.weights[i][j].length;
            }
        }
        
        alert(
            "模型数据信息:\n\n" +
            "环境类型: " + currentEnvType + "\n" +
            "输入数量: " + inputSize + "\n" +
            "输出数量: " + outputSize + "\n" +
            "隐藏层数: " + hiddenLayersCount + "\n" +
            "每层神经元: " + hiddenNeurons + "\n" +
            "总权重数量: " + totalWeights + "\n" +
            "最佳适应度: " + bestFitness.toFixed(3) + "\n" +
            "训练代数: " + generation + "\n" +
            "变异率: " + (mutationRate * 100).toFixed(1) + "%\n" +
            "学习率: " + learningRate.toFixed(2) + "\n\n" +
            "要查看详细权重数据，请打开浏览器控制台(Console)"
        );
        
        console.log("最佳网络权重数据:", bestNetwork.weights);
    };
    
    // 保存到本地
    ext.saveToLocal = function(filename) {
        if (!bestNetwork) {
            console.log("没有可保存的网络");
            return "失败: 没有可保存的网络";
        }
        
        try {
            // 创建模型数据对象
            const modelData = {
                network: bestNetwork,
                fitness: bestFitness,
                generation: generation,
                envType: currentEnvType,
                timestamp: new Date().toISOString(),
                parameters: {
                    mutationRate: mutationRate,
                    learningRate: learningRate,
                    populationSize: populationSize,
                    hiddenLayers: hiddenLayers,
                    hiddenNeurons: hiddenNeurons,
                    eliteCount: eliteCount,
                    selectionPressure: selectionPressure
                }
            };
            
            // 保存到localStorage
            localStorage.setItem('rl_model_' + filename, JSON.stringify(modelData));
            
            // 更新保存的模型列表
            updateSavedModelsList(filename);
            
            console.log("模型已保存: " + filename);
            return "成功: 模型已保存";
        } catch (e) {
            console.error("保存模型失败:", e);
            return "失败: " + e.message;
        }
    };
    
    // 从本地加载
    ext.loadFromLocal = function(filename) {
        try {
            const savedData = localStorage.getItem('rl_model_' + filename);
            if (!savedData) {
                lastLoadResult = "失败: 未找到模型";
                return lastLoadResult;
            }
            
            const modelData = JSON.parse(savedData);
            
            // 应用模型数据
            bestNetwork = modelData.network;
            bestFitness = modelData.fitness;
            generation = modelData.generation;
            currentEnvType = modelData.envType;
            
            // 应用参数
            mutationRate = modelData.parameters.mutationRate;
            learningRate = modelData.parameters.learningRate;
            populationSize = modelData.parameters.populationSize;
            hiddenLayers = modelData.parameters.hiddenLayers;
            hiddenNeurons = modelData.parameters.hiddenNeurons;
            eliteCount = modelData.parameters.eliteCount;
            selectionPressure = modelData.parameters.selectionPressure;
            
            console.log("模型已加载: " + filename);
            lastLoadResult = "成功: 模型已加载";
            return lastLoadResult;
        } catch (e) {
            console.error("加载模型失败:", e);
            lastLoadResult = "失败: " + e.message;
            return lastLoadResult;
        }
    };
    
    // 显示可视化
    ext.showVisualization = function() {
        if (canvas) {
            canvas.style.display = 'block';
            console.log("可视化已显示");
        }
    };
    
    // 隐藏可视化
    ext.hideVisualization = function() {
        if (canvas) {
            canvas.style.display = 'none';
            console.log("可视化已隐藏");
        }
    };
    
    // 切换可视化
    ext.toggleVisualization = function() {
        if (canvas) {
            if (canvas.style.display === 'none') {
                canvas.style.display = 'block';
                console.log("可视化已显示");
            } else {
                canvas.style.display = 'none';
                console.log("可视化已隐藏");
            }
        }
    };
    
    // 显示说明
    ext.showInstructions = function() {
        alert(
            "强化学习父代交叉训练可视化扩展使用说明\n\n" +
            "1. 初始化: 使用'初始化强化学习环境'选择环境和设置网络结构\n" +
            "2. 开始训练: 使用'开始训练'启动训练过程\n" +
            "3. 参数调整: 使用各种设置积木调整训练参数\n" +
            "4. 自动保存: 设置自动保存阈值，适应度超过阈值时自动保存\n" +
            "5. 模型管理: 使用'保存到本地'和'从本地加载'管理模型\n" +
            "6. 可视化控制: 使用'显示可视化'、'隐藏可视化'和'切换可视化'控制画布显示\n" +
            "7. 监控: 使用获取积木监控训练状态\n" +
            "8. 加载结果: 使用'加载结果'获取最后一次加载操作的结果\n\n" +
            "新增功能:\n" +
            "- 自动保存: 当最佳适应度超过阈值时自动保存模型\n" +
            "- 模型数据: 查看当前模型的详细信息\n" +
            "- 本地存储: 将模型保存到浏览器本地存储\n" +
            "- 模型加载: 从本地存储加载已保存的模型\n" +
            "- 可视化控制: 控制可视化画布的显示和隐藏\n" +
            "- 加载结果: 获取模型加载操作的结果状态\n\n" +
            "使用提示:\n" +
            "1. 训练前先设置合适的自动保存阈值\n" +
            "2. 定期使用'保存到本地'保存重要模型\n" +
            "3. 使用'从本地加载'可以继续之前的训练\n" +
            "4. 使用'显示模型数据'查看模型详细信息\n" +
            "5. 使用'隐藏可视化'可以释放屏幕空间\n" +
            "6. 使用'加载结果'检查模型加载状态"
        );
    };
    
    // 获取当前适应度
    ext.getFitness = function() {
        return currentFitness;
    };
    
    // 获取当前代数
    ext.getGeneration = function() {
        return generation;
    };
    
    // 获取最佳适应度
    ext.getBestFitness = function() {
        return bestFitness;
    };
    
    // 获取平均适应度
    ext.getAverageFitness = function() {
        return averageFitness;
    };
    
    // 获取网络数量
    ext.getNetworkCount = function() {
        return networks.length;
    };
    
    // 获取已保存模型数
    ext.getSavedModelsCount = function() {
        return savedModels.length;
    };
    
    // 获取加载结果
    ext.getLoadResult = function() {
        return lastLoadResult || "未加载";
    };
    
    // 内部变量和函数
    var isTraining = false;
    var generation = 0;
    var currentFitness = 0;
    var bestFitness = 0;
    var averageFitness = 0;
    var mutationRate = 0.05;
    var learningRate = 0.1;
    var populationSize = 5;
    var hiddenLayers = 1;
    var hiddenNeurons = 6;
    var eliteCount = 1;
    var selectionPressure = 3;
    var fitnessOffset = 0.1;
    var networks = [];
    var bestNetwork = null;
    var canvas, ctx;
    var animationFrame;
    var lastUpdateTime = 0;
    var currentEnvType = 'CartPole';
    var fitnessHistory = [];
    var maxHistoryLength = 50;
    var autoSaveEnabled = false;
    var autoSaveThreshold = 0.8;
    var lastAutoSaveGeneration = 0;
    var savedModels = [];
    var lastLoadResult = "未加载";
    
    // 创建可视化画布
    function createVisualizationCanvas() {
        // 检查是否已存在画布
        if (document.getElementById('rl-visualization-canvas')) {
            canvas = document.getElementById('rl-visualization-canvas');
            ctx = canvas.getContext('2d');
            return;
        }
        
        // 创建画布
        canvas = document.createElement('canvas');
        canvas.id = 'rl-visualization-canvas';
        canvas.width = 400;
        canvas.height = 450;
        canvas.style.position = 'absolute';
        canvas.style.top = '10px';
        canvas.style.right = '10px';
        canvas.style.border = '2px solid #4cc9f0';
        canvas.style.borderRadius = '8px';
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        canvas.style.zIndex = '1000';
        canvas.style.display = 'block'; // 默认显示
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = '#f72585';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.lineHeight = '1';
        closeButton.onclick = function() {
            canvas.style.display = 'none';
        };
        
        // 添加到文档
        document.body.appendChild(canvas);
        canvas.appendChild(closeButton);
        
        // 获取上下文
        ctx = canvas.getContext('2d');
    }
    
    // 初始化神经网络
    function initNeuralNetwork(numInputs, numOutputs) {
        networks = [];
        
        // 创建初始网络种群
        for (let i = 0; i < populationSize; i++) {
            const network = {
                layers: [],
                weights: [],
                fitness: Math.random() * 0.3 + 0.1 // 初始适应度在0.1-0.4之间
            };
            
            // 添加输入层
            network.layers.push({neurons: numInputs, type: 'input'});
            
            // 添加隐藏层
            for (let j = 0; j < hiddenLayers; j++) {
                network.layers.push({neurons: hiddenNeurons, type: 'hidden'});
            }
            
            // 添加输出层
            network.layers.push({neurons: numOutputs, type: 'output'});
            
            // 生成权重
            network.weights = generateWeights(network.layers);
            
            networks.push(network);
        }
        
        // 计算统计信息
        updateFitnessStats();
        
        // 重置历史记录
        fitnessHistory = [];
        
        // 加载保存的模型列表
        loadSavedModelsList();
    }
    
    // 生成权重
    function generateWeights(layers) {
        const weights = [];
        
        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = layers[i];
            const nextLayer = layers[i + 1];
            
            const layerWeights = Array.from({length: currentLayer.neurons}, () => 
                Array.from({length: nextLayer.neurons}, () => (Math.random() * 2 - 1))
            );
            
            weights.push(layerWeights);
        }
        
        return weights;
    }
    
    // 更新适应度统计
    function updateFitnessStats() {
        if (networks.length === 0) return;
        
        // 找到最佳适应度
        const newBestFitness = Math.max(...networks.map(n => n.fitness));
        
        // 检查是否需要更新最佳网络
        if (newBestFitness > bestFitness) {
            bestFitness = newBestFitness;
            const bestNetIndex = networks.findIndex(n => n.fitness === bestFitness);
            bestNetwork = JSON.parse(JSON.stringify(networks[bestNetIndex]));
            
            // 检查是否需要自动保存
            checkAutoSave();
        }
        
        // 计算平均适应度
        const totalFitness = networks.reduce((sum, network) => sum + network.fitness, 0);
        averageFitness = totalFitness / networks.length;
        
        // 设置当前适应度为第一个网络的适应度
        currentFitness = networks[0].fitness;
        
        // 记录历史
        fitnessHistory.push(bestFitness);
        if (fitnessHistory.length > maxHistoryLength) {
            fitnessHistory.shift();
        }
    }
    
    // 检查自动保存
    function checkAutoSave() {
        if (autoSaveEnabled && bestFitness >= autoSaveThreshold && generation > lastAutoSaveGeneration + 10) {
            // 自动保存模型
            const filename = 'auto_save_' + currentEnvType + '_' + Math.round(bestFitness * 1000) + '_' + generation;
            const modelData = {
                network: bestNetwork,
                fitness: bestFitness,
                generation: generation,
                envType: currentEnvType,
                timestamp: new Date().toISOString(),
                parameters: {
                    mutationRate: mutationRate,
                    learningRate: learningRate,
                    populationSize: populationSize,
                    hiddenLayers: hiddenLayers,
                    hiddenNeurons: hiddenNeurons,
                    eliteCount: eliteCount,
                    selectionPressure: selectionPressure
                }
            };
            
            localStorage.setItem('rl_model_' + filename, JSON.stringify(modelData));
            updateSavedModelsList(filename);
            
            console.log("自动保存模型: " + filename);
            lastAutoSaveGeneration = generation;
        }
    }
    
    // 更新保存的模型列表
    function updateSavedModelsList(filename) {
        if (!savedModels.includes(filename)) {
            savedModels.push(filename);
            localStorage.setItem('rl_saved_models', JSON.stringify(savedModels));
        }
    }
    
    // 加载保存的模型列表
    function loadSavedModelsList() {
        const saved = localStorage.getItem('rl_saved_models');
        if (saved) {
            savedModels = JSON.parse(saved);
        } else {
            savedModels = [];
        }
    }
    
    // 重置网络
    function resetNetworks() {
        for (let i = 0; i < networks.length; i++) {
            networks[i].fitness = Math.random() * 0.3 + 0.1;
        }
        updateFitnessStats();
        fitnessHistory = [];
    }
    
    // 执行交叉操作
    function performCrossover() {
        if (networks.length < 2) return;
        
        // 选择父代
        const parent1 = selectParent();
        const parent2 = selectParent();
        
        // 创建子代
        const child = {
            layers: JSON.parse(JSON.stringify(parent1.layers)),
            weights: [],
            fitness: (parent1.fitness + parent2.fitness) / 2 // 初始适应度为父母平均值
        };
        
        // 交叉权重
        for (let i = 0; i < parent1.weights.length; i++) {
            const parent1Weights = parent1.weights[i];
            const parent2Weights = parent2.weights[i];
            
            const childWeights = parent1Weights.map((row, rowIndex) => 
                row.map((weight, colIndex) => 
                    Math.random() < 0.5 ? weight : parent2Weights[rowIndex][colIndex]
                )
            );
            
            child.weights.push(childWeights);
        }
        
        // 添加到网络数组
        networks.push(child);
        
        // 如果超过种群大小，移除最差的
        if (networks.length > populationSize) {
            // 按适应度排序
            networks.sort((a, b) => b.fitness - a.fitness);
            // 保留精英
            const elites = networks.slice(0, eliteCount);
            // 随机选择剩余的
            const remaining = networks.slice(eliteCount);
            remaining.sort(() => Math.random() - 0.5);
            networks = [...elites, ...remaining.slice(0, populationSize - eliteCount)];
        }
        
        // 更新统计信息
        updateFitnessStats();
        
        // 触发可视化更新
        highlightCrossover(parent1, parent2, child);
    }
    
    // 选择父代
    function selectParent() {
        // 基于适应度的选择（使用选择压力）
        const expFitness = networks.map(n => Math.pow(n.fitness + fitnessOffset, selectionPressure));
        const totalExpFitness = expFitness.reduce((sum, val) => sum + val, 0);
        let random = Math.random() * totalExpFitness;
        
        for (let i = 0; i < networks.length; i++) {
            random -= expFitness[i];
            if (random <= 0) {
                return networks[i];
            }
        }
        
        // 如果所有适应度都为0，随机选择一个
        return networks[Math.floor(Math.random() * networks.length)];
    }
    
    // 执行变异操作
    function performMutation() {
        if (networks.length === 0) return;
        
        // 选择一个网络进行变异（精英不直接变异，而是创建副本变异）
        let networkIndex;
        if (Math.random() < 0.7) {
            // 70%的概率选择非精英网络
            const nonElites = networks.slice(eliteCount);
            if (nonElites.length > 0) {
                networkIndex = eliteCount + Math.floor(Math.random() * nonElites.length);
            } else {
                networkIndex = Math.floor(Math.random() * networks.length);
            }
        } else {
            // 30%的概率选择精英网络创建副本
            const elite = networks[Math.floor(Math.random() * Math.min(eliteCount, networks.length))];
            const clone = JSON.parse(JSON.stringify(elite));
            networks.push(clone);
            networkIndex = networks.length - 1;
        }
        
        const network = networks[networkIndex];
        let mutated = false;
        
        // 变异所有权重
        for (let i = 0; i < network.weights.length; i++) {
            for (let j = 0; j < network.weights[i].length; j++) {
                for (let k = 0; k < network.weights[i][j].length; k++) {
                    if (Math.random() < mutationRate) {
                        network.weights[i][j][k] += (Math.random() * 2 - 1) * learningRate;
                        mutated = true;
                    }
                }
            }
        }
        
        // 如果发生了变异，更新适应度
        if (mutated) {
            // 基于环境类型的适应度变化
            let fitnessChange = 0;
            
            switch(currentEnvType) {
                case 'CartPole':
                    fitnessChange = (Math.random() * 0.2 - 0.1);
                    break;
                case 'MountainCar':
                    fitnessChange = (Math.random() * 0.3 - 0.15);
                    break;
                case 'Acrobot':
                    fitnessChange = (Math.random() * 0.25 - 0.125);
                    break;
                case 'LunarLander':
                    fitnessChange = (Math.random() * 0.15 - 0.075);
                    break;
                case 'Maze':
                    // 迷宫环境：较大的正向奖励和较小的负向惩罚
                    fitnessChange = Math.random() < 0.7 ? (0.1 + Math.random() * 0.2) : (-0.05 - Math.random() * 0.1);
                    break;
                default:
                    fitnessChange = (Math.random() * 0.2 - 0.1);
            }
            
            network.fitness = Math.min(1, Math.max(0.01, network.fitness + fitnessChange));
            
            // 更新统计信息
            updateFitnessStats();
            
            // 触发可视化更新
            highlightMutation(network);
        }
    }
    
    // 高亮显示交叉操作
    function highlightCrossover(parent1, parent2, child) {
        // 在实际实现中，这里会更新可视化
        console.log("交叉操作: 父代1适应度=" + parent1.fitness.toFixed(2) + 
                   ", 父代2适应度=" + parent2.fitness.toFixed(2) +
                   ", 子代适应度=" + child.fitness.toFixed(2));
    }
    
    // 高亮显示变异操作
    function highlightMutation(network) {
        // 在实际实现中，这里会更新可视化
        console.log("变异操作: 网络适应度=" + network.fitness.toFixed(2));
    }
    
    // 模拟训练过程
    function simulateTraining() {
        if (!isTraining) return;
        
        const currentTime = Date.now();
        const elapsed = currentTime - lastUpdateTime;
        
        // 每500毫秒更新一次
        if (elapsed > 500) {
            // 随机更新一些网络的适应度
            for (let i = eliteCount; i < networks.length; i++) {
                if (Math.random() < 0.3) {
                    // 基于环境类型的训练模拟
                    let fitnessChange = 0;
                    
                    switch(currentEnvType) {
                        case 'CartPole':
                            fitnessChange = 0.05 + Math.random() * 0.1;
                            break;
                        case 'MountainCar':
                            fitnessChange = 0.03 + Math.random() * 0.15;
                            break;
                        case 'Acrobot':
                            fitnessChange = 0.02 + Math.random() * 0.08;
                            break;
                        case 'LunarLander':
                            fitnessChange = Math.random() * 0.2 - 0.05;
                            break;
                        case 'Maze':
                            // 迷宫环境：70%的概率获得正向奖励，30%的概率受到惩罚
                            if (Math.random() < 0.7) {
                                fitnessChange = 0.1 + Math.random() * 0.15; // 找到路径的奖励
                            } else {
                                fitnessChange = -0.05 - Math.random() * 0.1; // 撞墙的惩罚
                            }
                            break;
                        default:
                            fitnessChange = Math.random() * 0.1;
                    }
                    
                    networks[i].fitness = Math.min(1, Math.max(0.01, networks[i].fitness + fitnessChange));
                }
            }
            
            // 更新统计信息
            updateFitnessStats();
            
            // 偶尔执行交叉和变异
            if (Math.random() < 0.2) {
                performCrossover();
            }
            if (Math.random() < 0.3) {
                performMutation();
            }
            
            generation++;
            lastUpdateTime = currentTime;
        }
    }
    
    // 渲染函数
    function render() {
        if (!ctx) {
            animationFrame = requestAnimationFrame(render);
            return;
        }
        
        // 模拟训练过程
        simulateTraining();
        
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制标题
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('强化学习训练可视化 - ' + currentEnvType, canvas.width / 2, 25);
        
        // 绘制网络信息
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('代数: ' + generation, 20, 50);
        ctx.fillText('网络数量: ' + networks.length, 20, 70);
        ctx.fillText('最佳适应度: ' + bestFitness.toFixed(2), 20, 90);
        ctx.fillText('当前适应度: ' + currentFitness.toFixed(2), 20, 110);
        ctx.fillText('平均适应度: ' + averageFitness.toFixed(2), 20, 130);
        ctx.fillText('变异率: ' + (mutationRate * 100).toFixed(1) + '%', 20, 150);
        ctx.fillText('学习率: ' + learningRate.toFixed(2), 20, 170);
        
        // 绘制参数信息
        ctx.fillText('种群大小: ' + populationSize, 200, 50);
        ctx.fillText('隐藏层: ' + hiddenLayers, 200, 70);
        ctx.fillText('隐藏神经元: ' + hiddenNeurons, 200, 90);
        ctx.fillText('精英保留: ' + eliteCount, 200, 110);
        ctx.fillText('选择压力: ' + selectionPressure, 200, 130);
        
        // 绘制自动保存状态
        ctx.fillStyle = autoSaveEnabled ? '#4CAF50' : '#F44336';
        ctx.fillText('自动保存: ' + (autoSaveEnabled ? '开启' : '关闭'), 200, 150);
        if (autoSaveEnabled) {
            ctx.fillText('阈值: ' + (autoSaveThreshold * 100).toFixed(0) + '%', 200, 170);
        }
        
        // 绘制状态指示器
        ctx.fillStyle = isTraining ? '#4CAF50' : '#F44336';
        ctx.fillText('状态: ' + (isTraining ? '训练中' : '已暂停'), 20, 190);
        
        // 绘制已保存模型数
        ctx.fillStyle = 'white';
        ctx.fillText('已保存模型: ' + savedModels.length, 20, 210);
        
        // 绘制加载结果
        ctx.fillText('加载结果: ' + lastLoadResult, 20, 230);
        
        // 绘制简单的神经网络可视化
        drawNeuralNetwork();
        
        // 如果是迷宫环境，绘制迷宫示意图
        if (currentEnvType === 'Maze') {
            drawMazePreview();
        } else {
            // 绘制适应度变化图表
            drawFitnessChart();
        }
        
        // 请求下一帧
        animationFrame = requestAnimationFrame(render);
    }
    
    // 绘制神经网络
    function drawNeuralNetwork() {
        const centerX = canvas.width / 2;
        const centerY = 280;
        
        if (networks.length === 0) return;
        
        const network = networks[0];
        const layerCount = network.layers.length;
        const maxNeurons = Math.max(...network.layers.map(l => l.neurons));
        const layerSpacing = 250 / (layerCount - 1);
        const neuronSpacing = 60 / (maxNeurons - 1);
        
        // 绘制层
        for (let i = 0; i < layerCount; i++) {
            const layer = network.layers[i];
            const x = 75 + i * layerSpacing;
            
            // 绘制神经元
            for (let j = 0; j < layer.neurons; j++) {
                const y = centerY - (layer.neurons - 1) * neuronSpacing / 2 + j * neuronSpacing;
                
                // 设置颜色基于层类型
                if (layer.type === 'input') ctx.fillStyle = '#4cc9f0';
                else if (layer.type === 'hidden') ctx.fillStyle = '#f72585';
                else ctx.fillStyle = '#4cc9f0';
                
                // 绘制神经元
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制连接（仅在第一层和第二层之间）
                if (i < layerCount - 1) {
                    const nextLayer = network.layers[i + 1];
                    
                    for (let k = 0; k < nextLayer.neurons; k++) {
                        const nextX = 75 + (i + 1) * layerSpacing;
                        const nextY = centerY - (nextLayer.neurons - 1) * neuronSpacing / 2 + k * neuronSpacing;
                        
                        // 设置线条颜色和宽度基于权重
                        const weight = network.weights[i][j][k];
                        ctx.strokeStyle = weight > 0 ? 'rgba(76, 201, 240, ' + Math.abs(weight) + ')' : 
                                                     'rgba(247, 37, 133, ' + Math.abs(weight) + ')';
                        ctx.lineWidth = Math.abs(weight) * 3;
                        
                        // 绘制连接线
                        ctx.beginPath();
                        ctx.moveTo(x + 8, y);
                        ctx.lineTo(nextX - 8, nextY);
                        ctx.stroke();
                    }
                }
            }
            
            // 绘制层标签
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(layer.type.charAt(0).toUpperCase() + layer.type.slice(1), x, centerY + 50);
        }
    }
    
    // 绘制迷宫预览
    function drawMazePreview() {
        const mazeWidth = 120;
        const mazeHeight = 120;
        const mazeX = 280;
        const mazeY = 300;
        
        // 绘制迷宫背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(mazeX, mazeY, mazeWidth, mazeHeight);
        
        // 绘制迷宫边框
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(mazeX, mazeY, mazeWidth, mazeHeight);
        
        // 绘制迷宫标题
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('迷宫预览', mazeX + mazeWidth / 2, mazeY - 5);
        
        // 绘制简单的迷宫结构（固定示例）
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        
        // 绘制墙壁
        ctx.beginPath();
        // 水平墙
        ctx.moveTo(mazeX + 20, mazeY + 30);
        ctx.lineTo(mazeX + 100, mazeY + 30);
        
        ctx.moveTo(mazeX + 20, mazeY + 60);
        ctx.lineTo(mazeX + 80, mazeY + 60);
        
        ctx.moveTo(mazeX + 40, mazeY + 90);
        ctx.lineTo(mazeX + 100, mazeY + 90);
        
        // 垂直墙
        ctx.moveTo(mazeX + 40, mazeY + 30);
        ctx.lineTo(mazeX + 40, mazeY + 60);
        
        ctx.moveTo(mazeX + 80, mazeY + 60);
        ctx.lineTo(mazeX + 80, mazeY + 90);
        
        ctx.moveTo(mazeX + 60, mazeY + 30);
        ctx.lineTo(mazeX + 60, mazeY + 60);
        
        ctx.stroke();
        
        // 绘制起点
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(mazeX + 10, mazeY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制终点
        ctx.fillStyle = '#F44336';
        ctx.beginPath();
        ctx.arc(mazeX + 110, mazeY + 110, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制智能体（位置基于适应度）
        const agentX = mazeX + 10 + (bestFitness * 100);
        const agentY = mazeY + 10 + (bestFitness * 100);
        ctx.fillStyle = '#4cc9f0';
        ctx.beginPath();
        ctx.arc(
            Math.min(mazeX + mazeWidth - 10, Math.max(mazeX + 10, agentX)),
            Math.min(mazeY + mazeHeight - 10, Math.max(mazeY + 10, agentY)),
            5, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    // 绘制适应度变化图表
    function drawFitnessChart() {
        const chartWidth = 350;
        const chartHeight = 80;
        const chartX = 25;
        const chartY = 350;
        
        if (fitnessHistory.length < 2) return;
        
        // 绘制图表背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(chartX, chartY, chartWidth, chartHeight);
        
        // 绘制图表边框
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);
        
        // 绘制标题
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('适应度变化历史', chartX + chartWidth / 2, chartY - 5);
        
        // 绘制参考线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        for (let i = 0; i <= 1; i += 0.25) {
            const y = chartY + chartHeight - i * chartHeight;
            ctx.moveTo(chartX, y);
            ctx.lineTo(chartX + chartWidth, y);
        }
        ctx.stroke();
        
        // 绘制参考值
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 1; i += 0.25) {
            const y = chartY + chartHeight - i * chartHeight;
            ctx.fillText(i.toFixed(2), chartX - 5, y + 3);
        }
        
        // 绘制适应度曲线
        ctx.strokeStyle = '#4cc9f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < fitnessHistory.length; i++) {
            const x = chartX + (i / (fitnessHistory.length - 1)) * chartWidth;
            const y = chartY + chartHeight - fitnessHistory[i] * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // 绘制当前值标记
        if (fitnessHistory.length > 0) {
            const lastX = chartX + chartWidth;
            const lastY = chartY + chartHeight - fitnessHistory[fitnessHistory.length - 1] * chartHeight;
            
            ctx.fillStyle = '#4cc9f0';
            ctx.beginPath();
            ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(fitnessHistory[fitnessHistory.length - 1].toFixed(3), lastX + 5, lastY + 3);
        }
    }
    
    // 注册扩展
    ScratchExtensions.register('强化学习可视化', descriptor, ext);
})({});