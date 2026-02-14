class GridPathExtension {
    constructor() {
        this.grid = [];
        this.start = null;
        this.end = null;
        this.mustPass = [];
        this.path = '';
        this.lastError = '';
    }

    getInfo() {
        return {
            id: 'gridpathextension',
            name: '网格路径搜索',
            color1: '#4C97FF',
            color2: '#3373CC',
            blocks: [
                {
                    opcode: 'parseInput',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '解析网格输入: [INPUT]',
                    arguments: {
                        INPUT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '0000,0110,2003,0040'
                        }
                    }
                },
                {
                    opcode: 'findPath',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '计算路径',
                },
                {
                    opcode: 'getGridWidth',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '网格宽度',
                },
                {
                    opcode: 'getGridHeight',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '网格高度',
                },
                {
                    opcode: 'getCellValue',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '位置(X: [X], Y: [Y])的值',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getPathLength',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '路径长度',
                },
                {
                    opcode: 'getPathStep',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '路径第[INDEX]步',
                    arguments: {
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getLastError',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取最后错误',
                },
                {
                    opcode: 'clearGrid',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除网格',
                },
                {
                    opcode: 'setCellValue',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置位置(X: [X], Y: [Y])为[VALUE]',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                // 可以添加下拉菜单
            }
        };
    }

    parseInput(args) {
        try {
            const input = args.INPUT.trim();
            this.grid = [];
            this.start = null;
            this.end = null;
            this.mustPass = [];
            this.path = '';
            this.lastError = '';
            
            if (!input) {
                this.lastError = '请输入网格数据';
                return this.lastError;
            }
            
            const rows = input.split(',');
            let startCount = 0;
            let endCount = 0;
            
            for (let y = 0; y < rows.length; y++) {
                const row = rows[y].trim();
                if (!row) continue;
                
                const cells = [];
                for (let x = 0; x < row.length; x++) {
                    const char = row.charAt(x);
                    const num = parseInt(char);
                    
                    if (isNaN(num) || num < 0 || num > 4) {
                        this.lastError = '错误: 输入只能包含数字0-4';
                        return this.lastError;
                    }
                    
                    cells.push(num);
                    
                    // 记录特殊点
                    if (num === 2) {
                        this.start = {x, y};
                        startCount++;
                    }
                    if (num === 3) {
                        this.end = {x, y};
                        endCount++;
                    }
                    if (num === 4) {
                        this.mustPass.push({x, y});
                    }
                }
                
                this.grid.push(cells);
            }
            
            // 验证起点和终点
            if (startCount !== 1) {
                this.lastError = '错误: 网格必须包含且仅包含一个起点(2)';
                return this.lastError;
            }
            
            if (endCount !== 1) {
                this.lastError = '错误: 网格必须包含且仅包含一个终点(3)';
                return this.lastError;
            }
            
            return '网格解析成功';
        } catch (error) {
            this.lastError = '错误: ' + error.message;
            return this.lastError;
        }
    }

    findPath() {
        try {
            if (!this.grid.length) {
                this.lastError = '请先解析网格';
                return this.lastError;
            }
            
            // 如果没有必经点，直接寻路
            if (this.mustPass.length === 0) {
                this.path = this.bfs(this.start, this.end);
                return this.path || '5';
            }
            
            // 如果有必经点，需要按顺序经过所有点
            let fullPath = '';
            let current = this.start;
            
            // 先经过所有必经点
            for (const point of this.mustPass) {
                const segmentPath = this.bfs(current, point);
                if (!segmentPath) {
                    this.path = '5';
                    return '5';
                }
                fullPath += segmentPath;
                current = point;
            }
            
            // 最后到终点
            const finalPath = this.bfs(current, this.end);
            if (!finalPath) {
                this.path = '5';
                return '5';
            }
            
            this.path = fullPath + finalPath;
            return this.path;
        } catch (error) {
            this.lastError = '错误: ' + error.message;
            return this.lastError;
        }
    }

    bfs(start, end) {
        const rows = this.grid.length;
        const cols = this.grid[0].length;
        const queue = [{x: start.x, y: start.y, path: ''}];
        const visited = Array.from({length: rows}, () => Array(cols).fill(false));
        visited[start.y][start.x] = true;
        
        const directions = [
            {dx: 0, dy: -1, move: '2'}, // 上
            {dx: 0, dy: 1, move: '8'},  // 下
            {dx: -1, dy: 0, move: '4'}, // 左
            {dx: 1, dy: 0, move: '6'}   // 右
        ];
        
        while (queue.length > 0) {
            const {x, y, path} = queue.shift();
            
            if (x === end.x && y === end.y) {
                return path;
            }
            
            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && 
                    !visited[ny][nx] && this.grid[ny][nx] !== 1) {
                    visited[ny][nx] = true;
                    queue.push({x: nx, y: ny, path: path + dir.move});
                }
            }
        }
        
        return null; // 没有找到路径
    }

    getGridWidth() {
        return this.grid.length > 0 ? this.grid[0].length : 0;
    }

    getGridHeight() {
        return this.grid.length;
    }

    getCellValue(args) {
        const x = Math.floor(args.X);
        const y = Math.floor(args.Y);
        
        if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
            return this.grid[y][x];
        }
        return -1; // 无效位置
    }

    getPathLength() {
        return this.path.length;
    }

    getPathStep(args) {
        const index = Math.floor(args.INDEX) - 1;
        if (index >= 0 && index < this.path.length) {
            return this.path.charAt(index);
        }
        return '';
    }
    
    getLastError() {
        return this.lastError;
    }
    
    clearGrid() {
        this.grid = [];
        this.start = null;
        this.end = null;
        this.mustPass = [];
        this.path = '';
        this.lastError = '';
    }
    
    setCellValue(args) {
        const x = Math.floor(args.X);
        const y = Math.floor(args.Y);
        const value = Math.floor(args.VALUE);
        
        if (y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[y].length) {
            this.grid[y][x] = value;
            
            // 更新特殊点记录
            if (value === 2) {
                this.start = {x, y};
            } else if (value === 3) {
                this.end = {x, y};
            } else if (value === 4) {
                // 检查是否已经记录
                const index = this.mustPass.findIndex(p => p.x === x && p.y === y);
                if (index === -1) {
                    this.mustPass.push({x, y});
                }
            } else {
                // 如果不是特殊点，从记录中移除
                if (this.start && this.start.x === x && this.start.y === y) {
                    this.start = null;
                }
                if (this.end && this.end.x === x && this.end.y === y) {
                    this.end = null;
                }
                const index = this.mustPass.findIndex(p => p.x === x && p.y === y);
                if (index !== -1) {
                    this.mustPass.splice(index, 1);
                }
            }
        }
    }
}

// ==================== 使用说明 ====================
/*
网格路径搜索扩展使用说明

1. 扩展功能：
   - 解析网格输入并寻找从起点到终点的最短路径
   - 支持障碍物、必经点等复杂路径规划
   - 提供网格操作和路径分析功能

2. 网格表示：
   - 0: 可走路径
   - 1: 障碍物（不可走）
   - 2: 起点
   - 3: 终点
   - 4: 必经点

3. 路径表示：
   - 2: 上移
   - 8: 下移
   - 4: 左移
   - 6: 右移
   - 5: 无法到达

4. 积木说明：
   - 解析网格输入: 输入网格字符串，用逗号分隔行
     示例: "0000,0110,2003,0040"
   - 计算路径: 计算并返回路径字符串
   - 网格宽度/高度: 获取当前网格的尺寸
   - 位置(X,Y)的值: 获取指定位置的网格值
   - 路径长度: 获取路径的步数
   - 路径第N步: 获取路径中指定位置的移动方向
   - 获取最后错误: 获取最后一次操作的错误信息
   - 清除网格: 重置所有网格数据
   - 设置位置(X,Y)的值: 修改指定位置的网格值

5. 使用示例：
   - 首先使用"解析网格输入"积木设置网格
   - 然后使用"计算路径"积木获取路径
   - 可以使用其他积木分析网格和路径

6. 注意事项：
   - 网格必须有且仅有一个起点(2)和一个终点(3)
   - 路径计算使用广度优先搜索(BFS)算法
   - 如果存在必经点，会按顺序经过所有必经点再到终点
*/

// 注册扩展
Scratch.extensions.register(new GridPathExtension());