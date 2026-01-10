(function (_Scratch) {
    const {ArgumentType, BlockType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '柏林噪声地形生成器',
            'randomSeed': '生成随机种子',
            'setSeed': '设置种子 [SEED]',
            'setBasicParameters': '设置基本参数 地图宽度:[WIDTH] 地图高度:[HEIGHT] 精度:[PRECISION] 幅度:[AMPLITUDE] 层数:[OCTAVES]',
            'setAdvancedParameters': '设置高级参数 持久度:[PERSISTENCE] 频率:[LACUNARITY] 偏移X:[OFFSET_X] 偏移Y:[OFFSET_Y] 缩放:[SCALE]',
            'generate': '生成地形',
            'getHeightValue': '获取高度值 X:[X] Y:[Y]',
            'getFullJSON': '获取完整JSON',
            'drawMap': '绘制地形图 海平面:[SEA_LEVEL] 雪线:[SNOW_LINE]',
            'addTerrainFeature': '添加地形特征 [NAME] 最小高度:[MIN_H] 最大高度:[MAX_H] 密度:[DENSITY] 角色索引:[SPRITE_INDEX] 造型编号:[COSTUME_NUM]',
            'removeTerrainFeature': '移除地形特征 [NAME]',
            'editTerrainFeature': '编辑地形特征 [NAME] 最小高度:[MIN_H] 最大高度:[MAX_H] 密度:[DENSITY] 角色索引:[SPRITE_INDEX] 造型编号:[COSTUME_NUM]',
            'clearTerrainFeatures': '清除所有地形特征',
            'setGenerationMode': '设置生成模式 [MODE]',
            'getTerrainFeatureList': '获取地形特征列表',
            'getSpriteList': '获取角色列表',
            'setSeed.SEED_default': '123456',
            'setBasicParameters.WIDTH_default': '480',
            'setBasicParameters.HEIGHT_default': '360',
            'setBasicParameters.PRECISION_default': '10',
            'setBasicParameters.AMPLITUDE_default': '1.0',
            'setBasicParameters.OCTAVES_default': '3',
            'setAdvancedParameters.PERSISTENCE_default': '0.5',
            'setAdvancedParameters.LACUNARITY_default': '2.0',
            'setAdvancedParameters.OFFSET_X_default': '0',
            'setAdvancedParameters.OFFSET_Y_default': '0',
            'setAdvancedParameters.SCALE_default': '1.0',
            'getHeightValue.X_default': '0',
            'getHeightValue.Y_default': '0',
            'drawMap.SEA_LEVEL_default': '0.3',
            'drawMap.SNOW_LINE_default': '0.7',
            'addTerrainFeature.NAME_default': '松树',
            'addTerrainFeature.MIN_H_default': '0.5',
            'addTerrainFeature.MAX_H_default': '0.8',
            'addTerrainFeature.DENSITY_default': '0.1',
            'addTerrainFeature.SPRITE_INDEX_default': '1',
            'addTerrainFeature.COSTUME_NUM_default': '1',
            'removeTerrainFeature.NAME_default': '松树',
            'editTerrainFeature.NAME_default': '松树',
            'editTerrainFeature.MIN_H_default': '0.5',
            'editTerrainFeature.MAX_H_default': '0.8',
            'editTerrainFeature.DENSITY_default': '0.1',
            'editTerrainFeature.SPRITE_INDEX_default': '1',
            'editTerrainFeature.COSTUME_NUM_default': '1',
            'setGenerationMode.MODE_default': '俯视'
        }
    });

    // 柏林噪声生成器类
    class PerlinNoiseGenerator {
        constructor() {
            this.seed = null;
            this.width = 480;
            this.height = 360;
            this.precision = 10;
            this.amplitude = 1.0;
            this.octaves = 3;
            this.persistence = 0.5;
            this.lacunarity = 2.0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scale = 1.0;
            this.heightMap = [];
            this.gradients = [];
            this._random = null;
            this.generationMode = "俯视"; // 默认为俯视模式
        }

        // 设置生成模式
        setGenerationMode(mode) {
            this.generationMode = mode;
        }

        // 设置随机种子
        setSeed(seed) {
            this.seed = seed.toString();
            this._random = this._createRandom(this.seed);
        }

        // 创建简单的伪随机数生成器
        _createRandom(seed) {
            let value = 0;
            for (let i = 0; i < seed.length; i++) {
                value += seed.charCodeAt(i);
                value %= 2147483647;
            }
            
            return function() {
                value = (value * 16807) % 2147483647;
                return (value - 1) / 2147483646;
            };
        }

        // 生成随机种子
        randomSeed() {
            const seed = Math.floor(Math.random() * 999999999).toString();
            this.setSeed(seed);
            return seed;
        }

        // 设置基本参数
        setBasicParameters(width, height, precision, amplitude, octaves) {
            this.width = Math.max(1, width);
            this.height = Math.max(1, height);
            this.precision = Math.max(1, precision);
            this.amplitude = amplitude;
            this.octaves = Math.max(1, octaves);
        }

        // 设置高级参数
        setAdvancedParameters(persistence, lacunarity, offsetX, offsetY, scale) {
            this.persistence = persistence;
            this.lacunarity = lacunarity;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.scale = scale;
        }

        // 平滑插值函数
        interpolate(a, b, t) {
            // 使用平滑插值函数 (6t^5 - 15t^4 + 10t^3)
            t = t * t * t * (t * (t * 6 - 15) + 10);
            return a + t * (b - a);
        }

        // 计算梯度向量和距离向量的点积
        dotGridGradient(ix, iy, x, y) {
            // 确保不越界
            ix = ix % this.gradients.length;
            iy = iy % this.gradients[0].length;
            
            // 计算距离向量
            const dx = x - ix;
            const dy = y - iy;
            
            // 返回点积
            return dx * this.gradients[iy][ix][0] + dy * this.gradients[iy][ix][1];
        }

        // 生成高度图
        generate() {
            if (this.generationMode === "俯视") {
                return this.generateTopDown();
            } else {
                return this.generateSideView();
            }
        }

        // 生成高度图（俯视模式）
        generateTopDown() {
            // 初始化梯度网格
            const gridSize = Math.max(this.width, this.height) / this.precision + 1;
            this.gradients = [];
            
            // 生成梯度向量
            for (let i = 0; i < gridSize; i++) {
                const row = [];
                for (let j = 0; j < gridSize; j++) {
                    // 使用自定义随机数生成器
                    const angle = (this._random ? this._random() : Math.random()) * 2 * Math.PI;
                    row.push([Math.cos(angle), Math.sin(angle)]);
                }
                this.gradients.push(row);
            }
            
            // 生成高度图数据
            this.heightMap = [];
            const mapWidth = this.width;
            const mapHeight = this.height;
            
            // 应用偏移和缩放
            const offsetX = this.offsetX;
            const offsetY = this.offsetY;
            const scale = this.scale;
            
            for (let y = 0; y < mapHeight; y++) {
                const row = [];
                for (let x = 0; x < mapWidth; x++) {
                    // 应用偏移和缩放
                    const sampleX = (x / this.precision + offsetX) * scale;
                    const sampleY = (y / this.precision + offsetY) * scale;
                    
                    // 计算每个点的高度值
                    let value = 0;
                    let frequency = 1;
                    let amplitude = 1;
                    let maxValue = 0; // 用于归一化
                    
                    for (let octave = 0; octave < this.octaves; octave++) {
                        // 计算当前octave的位置
                        const xPos = sampleX * frequency;
                        const yPos = sampleY * frequency;
                        
                        // 确定所在网格单元
                        const x0 = Math.floor(xPos);
                        const y0 = Math.floor(yPos);
                        const x1 = x0 + 1;
                        const y1 = y0 + 1;
                        
                        // 计算相对位置
                        const sx = xPos - x0;
                        const sy = yPos - y0;
                        
                        // 计算四个顶点的梯度贡献
                        const n0 = this.dotGridGradient(x0, y0, xPos, yPos);
                        const n1 = this.dotGridGradient(x1, y0, xPos, yPos);
                        const ix0 = this.interpolate(n0, n1, sx);
                        
                        const n2 = this.dotGridGradient(x0, y1, xPos, yPos);
                        const n3 = this.dotGridGradient(x1, y1, xPos, yPos);
                        const ix1 = this.interpolate(n2, n3, sx);
                        
                        // 叠加当前octave的贡献
                        value += this.interpolate(ix0, ix1, sy) * amplitude;
                        maxValue += amplitude;
                        
                        // 更新频率和振幅
                        frequency *= this.lacunarity;
                        amplitude *= this.persistence;
                    }
                    
                    // 归一化值到[-1, 1]范围
                    value = value / maxValue;
                    
                    // 应用全局幅度
                    value *= this.amplitude;
                    
                    row.push(value);
                }
                this.heightMap.push(row);
            }
            
            return this.heightMap;
        }

        // 生成高度图（横版模式）
        generateSideView() {
            // 初始化梯度网格
            const gridSize = Math.max(this.width, this.height) / this.precision + 1;
            this.gradients = [];
            
            // 生成梯度向量
            for (let i = 0; i < gridSize; i++) {
                const row = [];
                for (let j = 0; j < gridSize; j++) {
                    // 使用自定义随机数生成器
                    const angle = (this._random ? this._random() : Math.random()) * 2 * Math.PI;
                    row.push([Math.cos(angle), Math.sin(angle)]);
                }
                this.gradients.push(row);
            }
            
            // 生成高度图数据 - 横版模式只需要一行
            this.heightMap = [[]];
            const mapWidth = this.width;
            
            // 应用偏移和缩放
            const offsetX = this.offsetX;
            const offsetY = this.offsetY;
            const scale = this.scale;
            
            for (let x = 0; x < mapWidth; x++) {
                // 应用偏移和缩放
                const sampleX = (x / this.precision + offsetX) * scale;
                const sampleY = offsetY * scale; // 横版模式只使用一个Y值
                
                // 计算每个点的高度值
                let value = 0;
                let frequency = 1;
                let amplitude = 1;
                let maxValue = 0; // 用于归一化
                
                for (let octave = 0; octave < this.octaves; octave++) {
                    // 计算当前octave的位置
                    const xPos = sampleX * frequency;
                    const yPos = sampleY * frequency;
                    
                    // 确定所在网格单元
                    const x0 = Math.floor(xPos);
                    const y0 = Math.floor(yPos);
                    const x1 = x0 + 1;
                    const y1 = y0 + 1;
                    
                    // 计算相对位置
                    const sx = xPos - x0;
                    const sy = yPos - y0;
                    
                    // 计算四个顶点的梯度贡献
                    const n0 = this.dotGridGradient(x0, y0, xPos, yPos);
                    const n1 = this.dotGridGradient(x1, y0, xPos, yPos);
                    const ix0 = this.interpolate(n0, n1, sx);
                    
                    const n2 = this.dotGridGradient(x0, y1, xPos, yPos);
                    const n3 = this.dotGridGradient(x1, y1, xPos, yPos);
                    const ix1 = this.interpolate(n2, n3, sx);
                    
                    // 叠加当前octave的贡献
                    value += this.interpolate(ix0, ix1, sy) * amplitude;
                    maxValue += amplitude;
                    
                    // 更新频率和振幅
                    frequency *= this.lacunarity;
                    amplitude *= this.persistence;
                }
                
                // 归一化值到[-1, 1]范围
                value = value / maxValue;
                
                // 应用全局幅度
                value *= this.amplitude;
                
                this.heightMap[0].push(value);
            }
            
            return this.heightMap;
        }

        // 获取高度值
        getHeightValue(x, y) {
            if (!this.heightMap.length) return 0;
            
            // 根据生成模式调整坐标
            if (this.generationMode === "横版") {
                // 横版模式只有一行，y坐标被忽略
                x = Math.max(0, Math.min(x, this.heightMap[0].length - 1));
                return this.heightMap[0][x];
            } else {
                // 俯视模式需要x和y坐标
                x = Math.max(0, Math.min(x, this.heightMap[0].length - 1));
                y = Math.max(0, Math.min(y, this.heightMap.length - 1));
                return this.heightMap[y][x];
            }
        }

        // 获取完整JSON
        getFullJSON() {
            if (!this.heightMap.length) return '{"高度图数据": []}';
            
            // 将二维数据转换为一维列表
            const flatData = [];
            for (let i = 0; i < this.heightMap.length; i++) {
                for (let j = 0; j < this.heightMap[i].length; j++) {
                    const index = i * this.heightMap[i].length + j + 1;
                    flatData.push({[index]: this.heightMap[i][j].toFixed(6)});
                }
            }
            
            return JSON.stringify({"高度图数据": flatData});
        }
    }

    // 地形特征类
    class TerrainFeature {
        constructor(name, minHeight, maxHeight, density, spriteIndex, costumeNum) {
            this.name = name;
            this.minHeight = minHeight;
            this.maxHeight = maxHeight;
            this.density = density;
            this.spriteIndex = spriteIndex;
            this.costumeNum = costumeNum;
            this.clones = [];
        }
        
        shouldPlace(heightValue, randomValue) {
            return heightValue >= this.minHeight && 
                   heightValue <= this.maxHeight && 
                   randomValue < this.density;
        }
        
        // 创建克隆体
        createClone(x, y) {
            const cloneId = this.clones.length;
            this.clones.push({x, y, id: cloneId});
            return cloneId;
        }
        
        // 清除所有克隆体
        clearClones() {
            this.clones = [];
        }
    }

    // Scratch扩展类
    class PerlinNoiseExtension {
        constructor(runtime) {
            this.runtime = runtime;
            this.perlin = new PerlinNoiseGenerator();
            this.terrainFeatures = new Map();
            this.terrainFeatureList = [];
            
            // 初始化随机种子
            this.perlin.randomSeed();
        }

        getInfo() {
            return {
                id: 'perlinNoise',
                name: translate({id: 'extensionName'}),
                color1: '#5cd65c',  // 浅绿色
                color2: '#47a447',  // 浅绿色
                blocks: [
                    {
                        opcode: 'randomSeed',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'randomSeed'})
                    },
                    {
                        opcode: 'setSeed',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setSeed'}),
                        arguments: {
                            SEED: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setSeed.SEED_default'})
                            }
                        }
                    },
                    {
                        opcode: 'setBasicParameters',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setBasicParameters'}),
                        arguments: {
                            WIDTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setBasicParameters.WIDTH_default'})
                            },
                            HEIGHT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setBasicParameters.HEIGHT_default'})
                            },
                            PRECISION: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setBasicParameters.PRECISION_default'})
                            },
                            AMPLITUDE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setBasicParameters.AMPLITUDE_default'})
                            },
                            OCTAVES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setBasicParameters.OCTAVES_default'})
                            }
                        }
                    },
                    {
                        opcode: 'setAdvancedParameters',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setAdvancedParameters'}),
                        arguments: {
                            PERSISTENCE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setAdvancedParameters.PERSISTENCE_default'})
                            },
                            LACUNARITY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setAdvancedParameters.LACUNARITY_default'})
                            },
                            OFFSET_X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setAdvancedParameters.OFFSET_X_default'})
                            },
                            OFFSET_Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setAdvancedParameters.OFFSET_Y_default'})
                            },
                            SCALE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'setAdvancedParameters.SCALE_default'})
                            }
                        }
                    },
                    {
                        opcode: 'setGenerationMode',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'setGenerationMode'}),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'generationModeMenu',
                                defaultValue: translate({id: 'setGenerationMode.MODE_default'})
                            }
                        }
                    },
                    {
                        opcode: 'generate',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'generate'})
                    },
                    {
                        opcode: 'getHeightValue',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getHeightValue'}),
                        arguments: {
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'getHeightValue.X_default'})
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'getHeightValue.Y_default'})
                            }
                        }
                    },
                    {
                        opcode: 'getFullJSON',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getFullJSON'})
                    },
                    {
                        opcode: 'drawMap',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'drawMap'}),
                        arguments: {
                            SEA_LEVEL: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'drawMap.SEA_LEVEL_default'})
                            },
                            SNOW_LINE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'drawMap.SNOW_LINE_default'})
                            }
                        }
                    },
                    {
                        opcode: 'addTerrainFeature',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'addTerrainFeature'}),
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: translate({id: 'addTerrainFeature.NAME_default'})
                            },
                            MIN_H: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'addTerrainFeature.MIN_H_default'})
                            },
                            MAX_H: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'addTerrainFeature.MAX_H_default'})
                            },
                            DENSITY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'addTerrainFeature.DENSITY_default'})
                            },
                            SPRITE_INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'addTerrainFeature.SPRITE_INDEX_default'})
                            },
                            COSTUME_NUM: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'addTerrainFeature.COSTUME_NUM_default'})
                            }
                        }
                    },
                    {
                        opcode: 'removeTerrainFeature',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'removeTerrainFeature'}),
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                menu: 'terrainFeatureMenu',
                                defaultValue: translate({id: 'removeTerrainFeature.NAME_default'})
                            }
                        }
                    },
                    {
                        opcode: 'editTerrainFeature',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'editTerrainFeature'}),
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                menu: 'terrainFeatureMenu',
                                defaultValue: translate({id: 'editTerrainFeature.NAME_default'})
                            },
                            MIN_H: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'editTerrainFeature.MIN_H_default'})
                            },
                            MAX_H: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'editTerrainFeature.MAX_H_default'})
                            },
                            DENSITY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'editTerrainFeature.DENSITY_default'})
                            },
                            SPRITE_INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'editTerrainFeature.SPRITE_INDEX_default'})
                            },
                            COSTUME_NUM: {
                                type: ArgumentType.NUMBER,
                                defaultValue: translate({id: 'editTerrainFeature.COSTUME_NUM_default'})
                            }
                        }
                    },
                    {
                        opcode: 'clearTerrainFeatures',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'clearTerrainFeatures'})
                    },
                    {
                        opcode: 'getTerrainFeatureList',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getTerrainFeatureList'})
                    },
                    {
                        opcode: 'getSpriteList',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getSpriteList'})
                    }
                ],
                menus: {
                    generationModeMenu: {
                        items: ['俯视', '横版']
                    },
                    terrainFeatureMenu: {
                        items: this._getTerrainFeatureMenuItems.bind(this)
                    }
                }
            };
        }

        // 获取地形特征菜单项
        _getTerrainFeatureMenuItems() {
            this.terrainFeatureList = Array.from(this.terrainFeatures.keys());
            return this.terrainFeatureList.length > 0 ? this.terrainFeatureList : ['无地形特征'];
        }

        // 获取角色列表
        getSpriteList() {
            try {
                const spriteNames = [];
                const targets = this.runtime.targets;
                
                // 跳过舞台，只获取角色
                for (let i = 0; i < targets.length; i++) {
                    const target = targets[i];
                    if (!target.isStage) {
                        spriteNames.push(`${i}: ${target.sprite.name}`);
                    }
                }
                
                return spriteNames.join(', ');
            } catch (e) {
                console.error('获取角色列表失败:', e);
                return '无法获取角色列表';
            }
        }

        randomSeed() {
            return this.perlin.randomSeed();
        }

        setSeed(args) {
            this.perlin.setSeed(Cast.toString(args.SEED));
        }

        setBasicParameters(args) {
            this.perlin.setBasicParameters(
                Cast.toNumber(args.WIDTH),
                Cast.toNumber(args.HEIGHT),
                Cast.toNumber(args.PRECISION),
                Cast.toNumber(args.AMPLITUDE),
                Cast.toNumber(args.OCTAVES)
            );
        }

        setAdvancedParameters(args) {
            this.perlin.setAdvancedParameters(
                Cast.toNumber(args.PERSISTENCE),
                Cast.toNumber(args.LACUNARITY),
                Cast.toNumber(args.OFFSET_X),
                Cast.toNumber(args.OFFSET_Y),
                Cast.toNumber(args.SCALE)
            );
        }

        setGenerationMode(args) {
            this.perlin.setGenerationMode(Cast.toString(args.MODE));
        }

        generate() {
            this.perlin.generate();
        }

        getHeightValue(args) {
            return this.perlin.getHeightValue(
                Cast.toNumber(args.X),
                Cast.toNumber(args.Y)
            );
        }

        getFullJSON() {
            return this.perlin.getFullJSON();
        }

        addTerrainFeature(args) {
            const name = Cast.toString(args.NAME);
            const minHeight = Cast.toNumber(args.MIN_H);
            const maxHeight = Cast.toNumber(args.MAX_H);
            const density = Cast.toNumber(args.DENSITY);
            const spriteIndex = Cast.toNumber(args.SPRITE_INDEX);
            const costumeNum = Cast.toNumber(args.COSTUME_NUM);
            
            // 检查是否已存在同名地形特征
            if (this.terrainFeatures.has(name)) {
                console.warn(`地形特征"${name}"已存在，将被替换。`);
            }
            
            this.terrainFeatures.set(name, new TerrainFeature(name, minHeight, maxHeight, density, spriteIndex, costumeNum));
            
            // 更新菜单
            this.terrainFeatureList = Array.from(this.terrainFeatures.keys());
        }

        removeTerrainFeature(args) {
            const name = Cast.toString(args.NAME);
            
            if (this.terrainFeatures.has(name)) {
                this.terrainFeatures.delete(name);
                console.log(`地形特征"${name}"已移除。`);
                
                // 更新菜单
                this.terrainFeatureList = Array.from(this.terrainFeatures.keys());
            } else {
                console.warn(`地形特征"${name}"不存在。`);
            }
        }

        editTerrainFeature(args) {
            const name = Cast.toString(args.NAME);
            const minHeight = Cast.toNumber(args.MIN_H);
            const maxHeight = Cast.toNumber(args.MAX_H);
            const density = Cast.toNumber(args.DENSITY);
            const spriteIndex = Cast.toNumber(args.SPRITE_INDEX);
            const costumeNum = Cast.toNumber(args.COSTUME_NUM);
            
            if (this.terrainFeatures.has(name)) {
                const feature = this.terrainFeatures.get(name);
                feature.minHeight = minHeight;
                feature.maxHeight = maxHeight;
                feature.density = density;
                feature.spriteIndex = spriteIndex;
                feature.costumeNum = costumeNum;
                console.log(`地形特征"${name}"已更新。`);
            } else {
                console.warn(`地形特征"${name}"不存在，将创建新特征。`);
                this.terrainFeatures.set(name, new TerrainFeature(name, minHeight, maxHeight, density, spriteIndex, costumeNum));
                
                // 更新菜单
                this.terrainFeatureList = Array.from(this.terrainFeatures.keys());
            }
        }

        clearTerrainFeatures() {
            this.terrainFeatures.clear();
            this.terrainFeatureList = [];
            console.log("所有地形特征已清除。");
        }

        getTerrainFeatureList() {
            return JSON.stringify(Array.from(this.terrainFeatures.keys()));
        }

        drawMap(args) {
            const seaLevel = Cast.toNumber(args.SEA_LEVEL);
            const snowLine = Cast.toNumber(args.SNOW_LINE);
            const heightMap = this.perlin.heightMap;
            const generationMode = this.perlin.generationMode;
            
            if (!heightMap || !heightMap.length) {
                console.warn("没有高度图数据可用。请先生成地形。");
                return;
            }
            
            // 获取当前角色
            const target = this.runtime.getEditingTarget();
            if (!target) {
                console.warn("没有找到角色。");
                return;
            }
            
            // 保存原始状态
            const originalX = target.x;
            const originalY = target.y;
            const originalSize = target.penSize;
            const originalColor = target.penColor;
            const originalDown = target.penDown;
            const originalCostume = target.currentCostume;
            const originalVisible = target.visible;
            
            // 清除所有地形特征的克隆体
            for (const feature of this.terrainFeatures.values()) {
                feature.clearClones();
            }
            
            // 设置画笔属性
            target.penSize = 1;
            target.penDown = false;
            target.visible = false; // 隐藏角色，只显示绘制的内容
            
            // 绘制地形
            if (generationMode === "俯视") {
                // 俯视模式：绘制二维高度图
                for (let y = 0; y < heightMap.length; y++) {
                    for (let x = 0; x < heightMap[y].length; x++) {
                        const value = heightMap[y][x];
                        
                        // 根据高度值选择颜色
                        let color;
                        if (value < seaLevel) {
                            // 深海 - 深蓝色
                            color = 0x000080; // RGB: 0,0,128
                        } else if (value < seaLevel + 0.1) {
                            // 浅海 - 蓝色
                            color = 0x0000FF; // RGB: 0,0,255
                        } else if (value < seaLevel + 0.2) {
                            // 沙滩 - 黄色
                            color = 0xFFFF00; // RGB: 255,255,0
                        } else if (value < seaLevel + 0.4) {
                            // 草地 - 绿色
                            color = 0x008000; // RGB: 0,128,0
                        } else if (value < snowLine) {
                            // 山地 - 棕色
                            color = 0x8B4513; // RGB: 139,69,19
                        } else {
                            // 雪山 - 白色
                            color = 0xFFFFFF; // RGB: 255,255,255
                        }
                        
                        // 设置画笔颜色
                        target.penColor = color;
                        
                        // 计算坐标
                        const drawX = x - this.perlin.width / 2;
                        const drawY = this.perlin.height / 2 - y;
                        
                        // 移动到位置并绘制点
                        target.setXY(drawX, drawY);
                        target.penDown = true;
                        target.penDown = false;
                        
                        // 检查是否需要放置地形特征
                        for (const feature of this.terrainFeatures.values()) {
                            const randomValue = Math.random();
                            if (feature.shouldPlace(value, randomValue)) {
                                // 获取对应的角色
                                const spriteIndex = feature.spriteIndex;
                                const costumeNum = feature.costumeNum;
                                
                                // 获取目标角色
                                let featureSprite = null;
                                let spriteCount = 0;
                                
                                for (const t of this.runtime.targets) {
                                    if (!t.isStage) {
                                        if (spriteCount === spriteIndex) {
                                            featureSprite = t;
                                            break;
                                        }
                                        spriteCount++;
                                    }
                                }
                                
                                if (featureSprite) {
                                    // 保存原始状态
                                    const originalSpriteX = featureSprite.x;
                                    const originalSpriteY = featureSprite.y;
                                    const originalSpriteCostume = featureSprite.currentCostume;
                                    const originalSpriteVisible = featureSprite.visible;
                                    
                                    // 设置精灵位置
                                    featureSprite.setXY(drawX, drawY);
                                    
                                    // 设置造型
                                    featureSprite.setCostume(costumeNum - 1); // Scratch造型编号从0开始
                                    
                                    // 显示精灵
                                    featureSprite.visible = true;
                                    
                                    // 创建克隆体
                                    feature.createClone(drawX, drawY);
                                    
                                    // 恢复原始状态
                                    featureSprite.setXY(originalSpriteX, originalSpriteY);
                                    featureSprite.setCostume(originalSpriteCostume);
                                    featureSprite.visible = originalSpriteVisible;
                                    
                                    break; // 一个位置只放置一个特征
                                }
                            }
                        }
                    }
                }
            } else {
                // 横版模式：绘制一维高度图
                const row = heightMap[0];
                const verticalScale = 100; // 垂直缩放因子
                const baseY = 0; // 基准Y坐标
                
                for (let x = 0; x < row.length; x++) {
                    const value = row[x];
                    
                    // 根据高度值选择颜色
                    let color;
                    if (value < seaLevel) {
                        // 深海 - 深蓝色
                        color = 0x000080; // RGB: 0,0,128
                    } else if (value < seaLevel + 0.1) {
                        // 浅海 - 蓝色
                        color = 0x0000FF; // RGB: 0,0,255
                    } else if (value < seaLevel + 0.2) {
                        // 沙滩 - 黄色
                        color = 0xFFFF00; // RGB: 255,255,0
                    } else if (value < seaLevel + 0.4) {
                        // 草地 - 绿色
                        color = 0x008000; // RGB: 0,128,0
                    } else if (value < snowLine) {
                        // 山地 - 棕色
                        color = 0x8B4513; // RGB: 139,69,19
                    } else {
                        // 雪山 - 白色
                        color = 0xFFFFFF; // RGB: 255,255,255
                    }
                    
                    // 设置画笔颜色
                    target.penColor = color;
                    
                    // 计算坐标
                    const drawX = x - this.perlin.width / 2;
                    const drawY = baseY + value * verticalScale;
                    
                    // 移动到位置并绘制点
                    target.setXY(drawX, drawY);
                    target.penDown = true;
                    target.penDown = false;
                    
                    // 检查是否需要放置地形特征
                    for (const feature of this.terrainFeatures.values()) {
                        const randomValue = Math.random();
                        if (feature.shouldPlace(value, randomValue)) {
                            // 获取对应的角色
                            const spriteIndex = feature.spriteIndex;
                            const costumeNum = feature.costumeNum;
                            
                            // 获取目标角色
                            let featureSprite = null;
                            let spriteCount = 0;
                            
                            for (const t of this.runtime.targets) {
                                if (!t.isStage) {
                                    if (spriteCount === spriteIndex) {
                                        featureSprite = t;
                                        break;
                                    }
                                    spriteCount++;
                                }
                            }
                            
                            if (featureSprite) {
                                // 保存原始状态
                                const originalSpriteX = featureSprite.x;
                                const originalSpriteY = featureSprite.y;
                                const originalSpriteCostume = featureSprite.currentCostume;
                                const originalSpriteVisible = featureSprite.visible;
                                
                                // 设置精灵位置
                                featureSprite.setXY(drawX, drawY);
                                
                                // 设置造型
                                featureSprite.setCostume(costumeNum - 1); // Scratch造型编号从0开始
                                
                                // 显示精灵
                                featureSprite.visible = true;
                                
                                // 创建克隆体
                                feature.createClone(drawX, drawY);
                                
                                // 恢复原始状态
                                featureSprite.setXY(originalSpriteX, originalSpriteY);
                                featureSprite.setCostume(originalSpriteCostume);
                                featureSprite.visible = originalSpriteVisible;
                                
                                break; // 一个位置只放置一个特征
                            }
                        }
                    }
                }
            }
            
            // 恢复原始状态
            target.setXY(originalX, originalY);
            target.penSize = originalSize;
            target.penColor = originalColor;
            target.penDown = originalDown;
            target.setCostume(originalCostume);
            target.visible = originalVisible;
            
            // 触发重绘
            this.runtime.requestRedraw();
        }
    }

    extensions.register(new PerlinNoiseExtension(runtime));
}(Scratch));