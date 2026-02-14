// 名称: 虚拟文件系统
// 作者: Mistium
// 描述: 作为扩展的内存文件系统非常强大 :sunglasses:

// 许可证: MPL-2.0
// 此源代码受Mozilla公共许可证v2.0条款约束，
// 如果未随此文件分发MPL副本，
// 您可以在 https://mozilla.org/MPL/2.0/ 获取副本

class VirtualFileSystem {
    constructor() {
        this.vfs = {};
        this.FILE_MARKER = Symbol('file');
        this._cache = new Map(); // 缓存优化
        this._normalizedPaths = new Map(); // 路径规范化缓存
    }

    _normalizePath(path) {
        if (this._normalizedPaths.has(path)) {
            return this._normalizedPaths.get(path);
        }

        if (!path || typeof path !== 'string') {
            this._normalizedPaths.set(path, []);
            return [];
        }
        
        const parts = path.replace(/^\/+|\/+$/g, '')
            .split('/')
            .filter(part => part.length > 0 && part !== '.');
        
        // 安全检查：不允许上级目录引用
        if (parts.some(part => part === '..')) {
            this._normalizedPaths.set(path, null);
            return null;
        }
        
        this._normalizedPaths.set(path, parts);
        return parts;
    }

    _clearCache() {
        this._cache.clear();
        this._normalizedPaths.clear();
    }

    _navigatePath(path, createDirs = false) {
        const cacheKey = `${path}_${createDirs}`;
        if (this._cache.has(cacheKey)) {
            return this._cache.get(cacheKey);
        }

        const parts = this._normalizePath(path);
        if (parts === null) {
            this._cache.set(cacheKey, null);
            return null;
        }
        if (parts.length === 0) {
            this._cache.set(cacheKey, this.vfs);
            return this.vfs;
        }
        
        let current = this.vfs;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (!current[part]) {
                if (!createDirs) {
                    this._cache.set(cacheKey, null);
                    return null;
                }
                current[part] = {};
            }
            
            // 如果当前是文件但路径还没结束，返回null
            if (current[part][this.FILE_MARKER] && i < parts.length - 1) {
                this._cache.set(cacheKey, null);
                return null;
            }
            
            current = current[part];
        }

        this._cache.set(cacheKey, current);
        return current;
    }

    _isFile(obj) {
        return obj && typeof obj === 'object' && obj[this.FILE_MARKER] === true;
    }

    _isDirectory(obj) {
        return obj && typeof obj === 'object' && !obj[this.FILE_MARKER];
    }

    _getEntry(path, isFile = true) {
        const cacheKey = `entry_${path}_${isFile}`;
        if (this._cache.has(cacheKey)) {
            return this._cache.get(cacheKey);
        }

        const parts = this._normalizePath(path);
        if (parts === null || parts.length === 0) {
            this._cache.set(cacheKey, null);
            return null;
        }

        const name = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        if (!dir || dir[name] === undefined) {
            this._cache.set(cacheKey, null);
            return null;
        }
        
        const entry = dir[name];
        const correctType = isFile ? this._isFile(entry) : this._isDirectory(entry);
        
        const result = correctType ? { entry, dir, name } : null;
        this._cache.set(cacheKey, result);
        return result;
    }

    _performFileOperation(path, operation, ...args) {
        const result = this._getEntry(path, true);
        if (!result) return false;
        
        operation(result, ...args);
        this._clearCache(); // 操作后清除缓存
        return true;
    }

    _transferEntry(sourcePath, destPath, isMove = false, isFile = true) {
        const parts = this._normalizePath(sourcePath);
        if (parts === null || parts.length === 0) return false;
        
        const name = parts.pop();
        const sourceDir = this._navigatePath(parts.join('/'));

        if (!sourceDir || sourceDir[name] === undefined) return false;
        
        const entry = sourceDir[name];
        const correctType = isFile ? this._isFile(entry) : this._isDirectory(entry);
        if (!correctType) return false;

        const destParts = this._normalizePath(destPath);
        if (destParts === null || destParts.length === 0) return false;

        const destName = destParts.pop();
        const destDir = this._navigatePath(destParts.join('/'), true);

        if (!destDir || destDir[destName] !== undefined) return false;

        // 优化：使用结构化克隆而不是JSON序列化（如果可用）
        if (typeof structuredClone === 'function') {
            destDir[destName] = isMove ? entry : structuredClone(entry);
        } else {
            destDir[destName] = isMove ? entry : JSON.parse(JSON.stringify(entry));
        }
        
        if (isMove) delete sourceDir[name];
        
        this._clearCache();
        return true;
    }

    _createFileEntry(content = '') {
        const now = Date.now();
        return {
            [this.FILE_MARKER]: true,
            modified: now,
            created: now,
            content: String(content)
        };
    }

    createFile({ FILE_PATH }) {
        const parts = this._normalizePath(FILE_PATH);
        if (parts === null || parts.length === 0) return false;

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'), true);

        if (!dir || dir[fileName] !== undefined) return false;

        dir[fileName] = this._createFileEntry();
        this._clearCache();
        return true;
    }

    readFile({ FILE_PATH }) {
        const result = this._getEntry(FILE_PATH, true);
        return result ? result.entry.content : '错误: 文件未找到';
    }

    getMetadata({ FILE_PATH, METADATA }) {
        const result = this._getEntry(FILE_PATH, true);
        if (!result) return "错误: 文件未找到";

        const value = result.entry[METADATA];
        return value !== undefined ? String(value) : "";
    }

    writeFile({ FILE_PATH, CONTENT }) {
        return this._performFileOperation(FILE_PATH, (result) => {
            result.entry.modified = Date.now();
            result.entry.content = String(CONTENT);
        });
    }

    appendFile({ FILE_PATH, CONTENT }) {
        return this._performFileOperation(FILE_PATH, (result) => {
            result.entry.modified = Date.now();
            result.entry.content += String(CONTENT);
        });
    }

    moveFile({ FILE_PATH, NEW_FILE_PATH }) {
        return this._transferEntry(FILE_PATH, NEW_FILE_PATH, true, true);
    }

    copyFile({ FILE_PATH, NEW_FILE_PATH }) {
        return this._transferEntry(FILE_PATH, NEW_FILE_PATH, false, true);
    }

    renameFile({ FILE_PATH, NEW_FILE_NAME }) {
        const parts = this._normalizePath(FILE_PATH);
        if (parts === null || parts.length === 0) return false;

        const newName = this._normalizePath(NEW_FILE_NAME);
        if (newName === null || newName.length !== 1) return false;
        
        const dirPath = parts.slice(0, -1).join('/');
        const newPath = dirPath ? `${dirPath}/${newName[0]}` : newName[0];
        
        return this._transferEntry(FILE_PATH, newPath, true, true);
    }

    moveDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        return this._transferEntry(DIR_PATH, NEW_DIR_PATH, true, false);
    }

    copyDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        return this._transferEntry(DIR_PATH, NEW_DIR_PATH, false, false);
    }

    deleteFile({ FILE_PATH }) {
        return this._performFileOperation(FILE_PATH, (result) => {
            delete result.dir[result.name];
        });
    }

    createDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null || parts.length === 0) return false;

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'), true);

        if (!parentDir || parentDir[dirName] !== undefined) return false;

        parentDir[dirName] = {};
        this._clearCache();
        return true;
    }

    deleteDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null || parts.length === 0) return false;

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'));

        if (!parentDir || parentDir[dirName] === undefined) return false;
        if (!this._isDirectory(parentDir[dirName])) return false;

        delete parentDir[dirName];
        this._clearCache();
        return true;
    }

    listDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null) return '错误: 无效的目录路径';

        const dir = this._navigatePath(parts.join('/'));
        if (!dir) return '错误: 目录未找到';
        if (this._isFile(dir)) return '错误: 路径是文件，不是目录';

        const entries = [];
        for (const key in dir) {
            if (key !== this.FILE_MARKER) {
                entries.push(this._isFile(dir[key]) ? key : key + '/');
            }
        }

        return JSON.stringify(entries);
    }

    getFileSize({ FILE_PATH }) {
        const result = this._getEntry(FILE_PATH, true);
        return result ? result.entry.content.length : 0;
    }

    fileExists({ FILE_PATH }) {
        return this._getEntry(FILE_PATH, true) !== null;
    }

    directoryExists({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null) return false;

        const dir = this._navigatePath(parts.join('/'));
        return dir !== null && this._isDirectory(dir);
    }

    // 统计信息功能
    getStats() {
        let fileCount = 0;
        let totalSize = 0;
        let dirCount = 0;

        const countStats = (obj, isRoot = false) => {
            if (this._isFile(obj)) {
                fileCount++;
                totalSize += obj.content.length;
            } else if (this._isDirectory(obj)) {
                if (!isRoot) dirCount++;
                for (const key in obj) {
                    if (key !== this.FILE_MARKER) {
                        countStats(obj[key]);
                    }
                }
            }
        };

        countStats(this.vfs, true);
        
        return {
            files: fileCount,
            directories: dirCount,
            totalSize: totalSize,
            memoryUsage: this._estimateMemoryUsage()
        };
    }

    _estimateMemoryUsage() {
        const jsonString = JSON.stringify(this.vfs);
        return new Blob([jsonString]).size;
    }

    getallfiles({ EXPORT }) {
        switch (EXPORT) {
            case 'json':
                return JSON.stringify(this._serializeVFS(this.vfs));
            case 'stats':
                return JSON.stringify(this.getStats());
            default:
                return '错误: 不支持的导出格式';
        }
    }

    _serializeVFS(obj) {
        if (this._isFile(obj)) {
            return { 
                __isFile: true, 
                content: obj.content,
                created: obj.created,
                modified: obj.modified
            };
        }
        
        const result = {};
        for (const key in obj) {
            if (key !== this.FILE_MARKER) {
                result[key] = this._serializeVFS(obj[key]);
            }
        }
        return result;
    }

    _deserializeVFS(obj) {
        if (obj && obj.__isFile === true) {
            return { 
                [this.FILE_MARKER]: true, 
                content: obj.content || '',
                created: obj.created || Date.now(),
                modified: obj.modified || Date.now()
            };
        }
        
        const result = {};
        for (const key in obj) {
            result[key] = this._deserializeVFS(obj[key]);
        }
        return result;
    }

    importfiles({ EXPORT, FILES }) {
        if (!FILES) return false;

        switch (EXPORT) {
            case 'json':
                try {
                    const parsed = JSON.parse(FILES);
                    this.vfs = this._deserializeVFS(parsed);
                    this._clearCache();
                    return true;
                } catch (e) {
                    console.error('JSON导入错误:', e);
                    return false;
                }
            default:
                console.error('错误: 不支持的导入格式');
                return false;
        }
    }

    clearall() {
        this.vfs = {};
        this._clearCache();
        return true;
    }

    // 批量操作
    batchOperation(operations) {
        const results = [];
        for (const op of operations) {
            try {
                let result;
                switch (op.type) {
                    case 'createFile':
                        result = this.createFile(op);
                        break;
                    case 'writeFile':
                        result = this.writeFile(op);
                        break;
                    case 'deleteFile':
                        result = this.deleteFile(op);
                        break;
                    case 'createDirectory':
                        result = this.createDirectory(op);
                        break;
                    default:
                        result = false;
                }
                results.push({ operation: op.type, success: result });
            } catch (error) {
                results.push({ operation: op.type, success: false, error: error.message });
            }
        }
        return results;
    }

    getInfo() {
        return {
            id: 'vfs',
            name: '虚拟文件系统',
            color1: '#4a90e2',
            color2: '#357abd',
            blocks: [
                {
                    opcode: 'createFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '创建文件 [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                {
                    opcode: 'readFile',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '读取文件 [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                {
                    opcode: 'writeFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '写入 [CONTENT] 到文件 [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '你好，世界！'
                        }
                    }
                },
                {
                    opcode: 'appendFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '追加 [CONTENT] 到文件 [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '更多文本！'
                        }
                    }
                },
                "---",
                {
                    opcode: 'getMetadata',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取文件 [FILE_PATH] 的 [METADATA]',
                    arguments: {
                        METADATA: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'metadataOptions',
                            defaultValue: 'modified'
                        },
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                {
                    opcode: 'getFileSize',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '文件 [FILE_PATH] 的大小',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                "---",
                {
                    opcode: 'moveFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '移动 [FILE_PATH] 到 [NEW_FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        },
                        NEW_FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录3/我的文件.txt'
                        }
                    }
                },
                {
                    opcode: 'copyFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '复制 [FILE_PATH] 到 [NEW_FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        },
                        NEW_FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的新文件.txt'
                        }
                    }
                },
                {
                    opcode: 'renameFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '重命名文件 [FILE_PATH] 为 [NEW_FILE_NAME]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        },
                        NEW_FILE_NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '新文件.txt'
                        }
                    }
                },
                {
                    opcode: 'deleteFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除文件 [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                '---',
                {
                    opcode: 'createDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '创建目录 [DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2'
                        }
                    }
                },
                {
                    opcode: 'deleteDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '删除目录 [DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2'
                        }
                    }
                },
                {
                    opcode: 'moveDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '移动目录 [DIR_PATH] 到 [NEW_DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2'
                        },
                        NEW_DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录3'
                        }
                    }
                },
                {
                    opcode: 'copyDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '复制目录 [DIR_PATH] 到 [NEW_DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2'
                        },
                        NEW_DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录3'
                        }
                    }
                },
                {
                    opcode: 'listDirectory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '列出目录 [DIR_PATH] 内容',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1'
                        }
                    }
                },
                '---',
                {
                    opcode: 'fileExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '文件 [FILE_PATH] 存在？',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2/我的文件.txt'
                        }
                    }
                },
                {
                    opcode: 'directoryExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '目录 [DIR_PATH] 存在？',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '目录1/目录2'
                        }
                    }
                },
                {
                    opcode: 'getStats',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '获取文件系统统计信息'
                },
                '---',
                {
                    opcode: 'getallfiles',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '导出所有文件为 [EXPORT]',
                    arguments: {
                        EXPORT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'exportOptions',
                            defaultValue: 'json'
                        }
                    }
                },
                {
                    opcode: 'importfiles',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '从 [EXPORT] 导入文件 [FILES]',
                    arguments: {
                        EXPORT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'exportOptions',
                            defaultValue: 'json'
                        },
                        FILES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },
                '---',
                {
                    opcode: 'clearall',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清空整个文件系统'
                }
            ],
            menus: {
                metadataOptions: [
                    { text: '修改时间', value: 'modified' },
                    { text: '创建时间', value: 'created' }
                ],
                exportOptions: [
                    { text: 'JSON', value: 'json' },
                    { text: '统计信息', value: 'stats' }
                ]
            }
        };
    }
}

Scratch.extensions.register(new VirtualFileSystem());