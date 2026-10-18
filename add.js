// PluginSystem TurboWarp extension.
//
// 插件系统：在项目中开放「插件插槽」（C 型块），用户上传插件 sb3 后，
// 扩展会把插件 sb3 中「当插件 [ID] 被加载」帽子块下的代码复制进对应 ID 的插槽，
// 从而在不修改原项目积木的前提下扩展项目行为。
//
// 该扩展必须运行在无沙盒（unsandboxed）模式下，因为它需要直接读写 Scratch VM 的积木。
/* eslint-env browser */
/* global Scratch */
(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('插件系统扩展必须以无沙盒（unsandboxed）模式运行');
    }

    const EXTENSION_ID = 'pluginSystem';
    const SLOT_OPCODE = `${EXTENSION_ID}_pluginSlot`;
    const WHEN_LOADED_OPCODE = `${EXTENSION_ID}_whenPluginLoaded`;
    const WHEN_ANY_LOADED_OPCODE = `${EXTENSION_ID}_whenAnyPluginLoaded`;

    // 与 scratch-vm/src/serialization/sb3.js 中 CORE_EXTENSIONS 保持一致
    const CORE_EXTENSION_IDS = new Set([
        'argument',
        'colour',
        'control',
        'data',
        'event',
        'looks',
        'math',
        'motion',
        'operator',
        'procedures',
        'sensing',
        'sound'
    ]);

    const INPUT_SAME_BLOCK_SHADOW = 1;
    const INPUT_BLOCK_NO_SHADOW = 2;
    const INPUT_DIFF_BLOCK_SHADOW = 3;

    const MATH_NUM_PRIMITIVE = 4;
    const POSITIVE_NUM_PRIMITIVE = 5;
    const WHOLE_NUM_PRIMITIVE = 6;
    const INTEGER_NUM_PRIMITIVE = 7;
    const ANGLE_NUM_PRIMITIVE = 8;
    const COLOR_PICKER_PRIMITIVE = 9;
    const TEXT_PRIMITIVE = 10;
    const BROADCAST_PRIMITIVE = 11;
    const VAR_PRIMITIVE = 12;
    const LIST_PRIMITIVE = 13;

    const PRIMITIVE_INFO = {
        [MATH_NUM_PRIMITIVE]: ['math_number', 'NUM'],
        [POSITIVE_NUM_PRIMITIVE]: ['math_positive_number', 'NUM'],
        [WHOLE_NUM_PRIMITIVE]: ['math_whole_number', 'NUM'],
        [INTEGER_NUM_PRIMITIVE]: ['math_integer', 'NUM'],
        [ANGLE_NUM_PRIMITIVE]: ['math_angle', 'NUM'],
        [COLOR_PICKER_PRIMITIVE]: ['colour_picker', 'COLOUR'],
        [TEXT_PRIMITIVE]: ['text', 'TEXT']
    };

    const logger = typeof console === 'undefined' ? {log () {}, warn () {}} : console;

    // ---------------------------------------------------------------------
    // 基础工具
    // ---------------------------------------------------------------------

    const uid = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 20; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const toStringValue = value => {
        if (typeof value === 'undefined' || value === null) return '';
        return String(value);
    };

    const normalizeId = value => toStringValue(value)
        .trim()
        .toLowerCase();

    const cloneBlock = block => JSON.parse(JSON.stringify(block));

    const setSubstack = (blocks, slotBlockId, firstChildId) => {
        const slot = blocks.getBlock(slotBlockId);
        if (!slot) return;
        if (!slot.inputs) slot.inputs = {};
        if (firstChildId) {
            slot.inputs.SUBSTACK = {
                name: 'SUBSTACK',
                block: firstChildId,
                shadow: null
            };
        } else if (slot.inputs.SUBSTACK) {
            delete slot.inputs.SUBSTACK;
        }
    };

    const collectChainIds = (blocks, firstId) => {
        const ids = [];
        const visited = new Set();
        let id = firstId;
        while (id && !visited.has(id)) {
            visited.add(id);
            const block = blocks[id];
            if (!block) break;
            ids.push(id);
            id = block.next;
        }
        return ids;
    };

    const getInputLiteral = (blocks, block, inputName) => {
        if (!block || !block.inputs) return null;
        const input = block.inputs[inputName];
        if (!input) return null;
        const candidates = [input.shadow, input.block];
        for (const blockId of candidates) {
            if (!blockId) continue;
            const child = blocks[blockId];
            if (!child || !child.fields) continue;
            if (child.fields.TEXT) return child.fields.TEXT.value;
        }
        return null;
    };

    const getOpcodeExtensionId = opcode => {
        if (typeof opcode !== 'string') return null;
        const index = opcode.indexOf('_');
        if (index <= 0) return null;
        const prefix = opcode.substring(0, index).replace(/[^\w-]/g, '-');
        if (CORE_EXTENSION_IDS.has(prefix)) return null;
        return prefix;
    };

    // ---------------------------------------------------------------------
    // ZIP / sb3 读取（只依赖浏览器原生 DecompressionStream，不引入外部库）
    // ---------------------------------------------------------------------

    const EOCD_SIGNATURE = 0x06054b50;
    const CENTRAL_SIGNATURE = 0x02014b50;
    const LOCAL_SIGNATURE = 0x04034b50;

    const inflateRaw = async bytes => {
        if (typeof DecompressionStream === 'undefined') {
            throw new Error('当前浏览器不支持 DecompressionStream，无法读取 sb3 压缩包');
        }
        const stream = new Blob([bytes]).stream()
            .pipeThrough(new DecompressionStream('deflate-raw'));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    };

    const openZip = buffer => {
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        let eocdOffset = -1;
        const lowerBound = Math.max(0, bytes.length - 0xffff - 22);
        for (let i = bytes.length - 22; i >= lowerBound; i--) {
            if (view.getUint32(i, true) === EOCD_SIGNATURE) {
                eocdOffset = i;
                break;
            }
        }
        if (eocdOffset < 0) {
            throw new Error('不是有效的 sb3 / zip 文件');
        }
        const entryCount = view.getUint16(eocdOffset + 10, true);
        let pointer = view.getUint32(eocdOffset + 16, true);
        const entries = new Map();
        for (let i = 0; i < entryCount; i++) {
            if (pointer + 46 > bytes.length || view.getUint32(pointer, true) !== CENTRAL_SIGNATURE) {
                throw new Error('zip 目录数据损坏');
            }
            const method = view.getUint16(pointer + 10, true);
            const compressedSize = view.getUint32(pointer + 20, true);
            const nameLength = view.getUint16(pointer + 28, true);
            const extraLength = view.getUint16(pointer + 30, true);
            const commentLength = view.getUint16(pointer + 32, true);
            const localOffset = view.getUint32(pointer + 42, true);
            const name = new TextDecoder().decode(
                bytes.subarray(pointer + 46, pointer + 46 + nameLength)
            );
            entries.set(name, {method, compressedSize, localOffset});
            pointer += 46 + nameLength + extraLength + commentLength;
        }
        const readEntry = name => {
            const entry = entries.get(name);
            if (!entry) return null;
            const local = entry.localOffset;
            if (local + 30 > bytes.length || view.getUint32(local, true) !== LOCAL_SIGNATURE) {
                throw new Error('zip 数据损坏');
            }
            const nameLength = view.getUint16(local + 26, true);
            const extraLength = view.getUint16(local + 28, true);
            const start = local + 30 + nameLength + extraLength;
            const raw = bytes.subarray(start, start + entry.compressedSize);
            if (entry.method === 0) return raw;
            if (entry.method === 8) return inflateRaw(raw);
            throw new Error(`不支持的 zip 压缩方式：${entry.method}`);
        };
        return {entries, readEntry};
    };

    const looksLikeJson = bytes => {
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            if (byte === 0x20 || byte === 0x09 || byte === 0x0a || byte === 0x0d) continue;
            return byte === 0x7b; // '{'
        }
        return false;
    };

    const parseProjectBuffer = async buffer => {
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        if (looksLikeJson(bytes)) {
            return JSON.parse(new TextDecoder().decode(bytes));
        }
        const zip = openZip(bytes);
        const entry = await zip.readEntry('project.json');
        if (!entry) {
            throw new Error('sb3 文件中缺少 project.json');
        }
        return JSON.parse(new TextDecoder().decode(entry));
    };

    const encodeUTF8Base64 = text => {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const decodeBase64 = text => {
        let data = toStringValue(text).trim();
        const commaIndex = data.indexOf(',');
        if (data.indexOf('data:') === 0 && commaIndex !== -1) {
            data = data.slice(commaIndex + 1);
        }
        data = data.replace(/\s+/g, '');
        if (!/^[A-Za-z0-9+/=_-]+$/.test(data)) return null;
        try {
            const binary = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        } catch (error) {
            return null;
        }
    };

    const fetchArrayBuffer = async url => {
        const fetcher = typeof Scratch.fetch === 'function' ? Scratch.fetch :
            (typeof fetch === 'function' ? fetch : null);
        if (!fetcher) {
            throw new Error('当前环境不支持网络请求');
        }
        const response = await fetcher(url);
        if (!response || !response.ok) {
            const status = response ? response.status : '未知';
            throw new Error(`下载插件失败：HTTP ${status}`);
        }
        return response.arrayBuffer();
    };

    // ---------------------------------------------------------------------
    // sb3 积木反序列化（展开压缩的原始输入/字段）
    // ---------------------------------------------------------------------

    const makePrimitiveBlock = (description, parentId, isShadow) => {
        const type = description[0];
        const block = {
            id: uid(),
            opcode: null,
            next: null,
            parent: parentId || null,
            shadow: Boolean(isShadow),
            topLevel: false,
            inputs: {},
            fields: {}
        };
        if (Object.prototype.hasOwnProperty.call(PRIMITIVE_INFO, type)) {
            const info = PRIMITIVE_INFO[type];
            block.opcode = info[0];
            block.fields[info[1]] = {
                name: info[1],
                value: description[1]
            };
            return block;
        }
        if (type === BROADCAST_PRIMITIVE) {
            block.opcode = 'event_broadcast_menu';
            block.fields.BROADCAST_OPTION = {
                name: 'BROADCAST_OPTION',
                value: description[1],
                id: description[2],
                variableType: 'broadcast_msg'
            };
            return block;
        }
        if (type === VAR_PRIMITIVE) {
            block.opcode = 'data_variable';
            block.fields.VARIABLE = {
                name: 'VARIABLE',
                value: description[1],
                id: description[2],
                variableType: ''
            };
            return block;
        }
        if (type === LIST_PRIMITIVE) {
            block.opcode = 'data_listcontents';
            block.fields.LIST = {
                name: 'LIST',
                value: description[1],
                id: description[2],
                variableType: 'list'
            };
            return block;
        }
        return null;
    };

    const expandInputDescriptor = (description, parentId, isShadow, blocks) => {
        if (!Array.isArray(description)) {
            return typeof description === 'string' ? description : null;
        }
        const block = makePrimitiveBlock(description, parentId, isShadow);
        if (!block) return null;
        blocks[block.id] = block;
        return block.id;
    };

    const expandInputs = (inputs, parentId, blocks) => {
        const result = {};
        const names = Object.keys(inputs || {});
        for (const name of names) {
            const description = inputs[name];
            if (!Array.isArray(description)) {
                if (description) result[name] = description;
                continue;
            }
            const kind = description[0];
            let block = null;
            let shadow = null;
            if (kind === INPUT_SAME_BLOCK_SHADOW) {
                block = shadow = expandInputDescriptor(description[1], parentId, true, blocks);
            } else if (kind === INPUT_BLOCK_NO_SHADOW) {
                block = expandInputDescriptor(description[1], parentId, false, blocks);
            } else if (kind === INPUT_DIFF_BLOCK_SHADOW) {
                block = expandInputDescriptor(description[1], parentId, false, blocks);
                shadow = expandInputDescriptor(description[2], parentId, true, blocks);
            }
            result[name] = {name, block, shadow};
        }
        return result;
    };

    const expandFields = fields => {
        const result = {};
        const names = Object.keys(fields || {});
        for (const name of names) {
            const description = fields[name];
            if (!Array.isArray(description)) {
                if (description) result[name] = description;
                continue;
            }
            const field = {name, value: description[0]};
            if (description.length > 1) field.id = description[1];
            if (name === 'VARIABLE') {
                field.variableType = '';
            } else if (name === 'LIST') {
                field.variableType = 'list';
            } else if (name === 'BROADCAST_OPTION') {
                field.variableType = 'broadcast_msg';
            }
            result[name] = field;
        }
        return result;
    };

    const deserializeBlocksMap = rawBlocks => {
        const blocks = {};
        const ids = Object.keys(rawBlocks || {});
        for (const id of ids) {
            const raw = rawBlocks[id];
            if (Array.isArray(raw)) continue;
            const block = {
                id,
                opcode: raw.opcode,
                next: raw.next || null,
                parent: raw.parent || null,
                shadow: Boolean(raw.shadow),
                topLevel: Boolean(raw.topLevel),
                fields: expandFields(raw.fields),
                inputs: {}
            };
            if (raw.mutation) block.mutation = JSON.parse(JSON.stringify(raw.mutation));
            block.inputs = expandInputs(raw.inputs, id, blocks);
            blocks[id] = block;
        }
        return blocks;
    };

    // ---------------------------------------------------------------------
    // 插件系统实现
    // ---------------------------------------------------------------------

    class PluginSystemExtension {
        constructor () {
            this._units = new Map(); // unitKey -> unit
            this._unitOrder = []; // 加载顺序的 unitKey 列表
            this._slotDefaults = new Map(); // "targetId/slotBlockId" -> 默认代码积木数组
            this._slotSources = new Map(); // "targetId/slotBlockId" -> 当前来源插件 unitKey
            this._appliedBlocks = new Map(); // "targetId/slotBlockId" -> 已插入的积木 id 数组
        }

        get vm () {
            return Scratch.vm;
        }

        get runtime () {
            const vm = Scratch.vm;
            return vm && vm.runtime;
        }

        // -----------------------------------------------------------------
        // 积木定义
        // -----------------------------------------------------------------

        getInfo () {
            return {
                id: EXTENSION_ID,
                name: '插件系统',
                color1: '#8b5cf6',
                color2: '#7c3aed',
                color3: '#6d28d9',
                blocks: [
                    {
                        blockType: Scratch.BlockType.CONDITIONAL,
                        opcode: 'pluginSlot',
                        text: ['插件插槽 [ID]', '默认代码'],
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'pluginSlot'
                    },
                    {
                        blockType: Scratch.BlockType.HAT,
                        opcode: 'whenPluginLoaded',
                        text: '当插件 [ID] 被加载',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'whenPluginLoaded'
                    },
                    {
                        blockType: Scratch.BlockType.HAT,
                        opcode: 'whenAnyPluginLoaded',
                        text: '当任意插件被加载',
                        isEdgeActivated: false,
                        func: 'whenAnyPluginLoaded'
                    },
                    '---扩展预加载',
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'preloadExtensionURL',
                        text: '加载扩展URL [URL]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://extensions.turbowarp.org/Box.js'
                            }
                        },
                        func: 'preloadExtensionURL'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'preloadExtensionSource',
                        text: '加载扩展源代码 [SOURCE]',
                        arguments: {
                            SOURCE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '(function (Scratch) { /* 扩展源代码 */ })(Scratch);'
                            }
                        },
                        func: 'preloadExtensionSource'
                    },
                    '---加载 / 卸载',
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'loadPluginFromFile',
                        text: '从文件加载插件',
                        func: 'loadPluginFromFile'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'loadPluginFromURL',
                        text: '从网址 [URL] 加载插件',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://example.com/plugin.sb3'
                            }
                        },
                        func: 'loadPluginFromURL'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'loadPluginFromText',
                        text: '从文本 [TEXT] 加载插件',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"targets": []}'
                            }
                        },
                        func: 'loadPluginFromText'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'unloadPlugin',
                        text: '卸载插件 [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'unloadPlugin'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'unloadAllPlugins',
                        text: '卸载所有插件',
                        func: 'unloadAllPlugins'
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'reapplyPlugins',
                        text: '重新应用所有插件',
                        func: 'reapplyPlugins'
                    },
                    '---查询',
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        opcode: 'pluginLoaded',
                        text: '插件 [ID] 已加载？',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'pluginLoaded'
                    },
                    {
                        blockType: Scratch.BlockType.BOOLEAN,
                        opcode: 'slotHasPlugin',
                        text: '插槽 [ID] 有插件代码？',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'slotHasPlugin'
                    },
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        opcode: 'pluginCount',
                        text: '已加载插件数量',
                        func: 'pluginCount'
                    },
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        opcode: 'pluginList',
                        text: '已加载插件列表（换行分隔）',
                        func: 'pluginList'
                    },
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        opcode: 'pluginInfo',
                        text: '插件 [ID] 的 [TYPE]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'INFO_TYPE',
                                defaultValue: 'name'
                            }
                        },
                        func: 'pluginInfo'
                    },
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        opcode: 'slotSource',
                        text: '插槽 [ID] 当前来源（返回 plugin 或 default）',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myPlugin'
                            }
                        },
                        func: 'slotSource'
                    }
                ],
                menus: {
                    INFO_TYPE: {
                        acceptReporters: true,
                        items: [
                            {text: '名称', value: 'name'},
                            {text: '作者', value: 'author'},
                            {text: '版本', value: 'version'},
                            {text: '描述', value: 'description'}
                        ]
                    }
                }
            };
        }

        // -----------------------------------------------------------------
        // 核心积木
        // -----------------------------------------------------------------

        pluginSlot (args, util) {
            util.startBranch(1, false);
        }

        whenPluginLoaded () {
            // 帽子块本体不需要执行逻辑，由扩展在插件加载时启动。
        }

        whenAnyPluginLoaded () {
            // 同上。
        }

        // -----------------------------------------------------------------
        // 扩展预加载
        // -----------------------------------------------------------------

        async preloadExtensionURL (args) {
            const url = toStringValue(args.URL).trim();
            if (!url) return;
            try {
                await this._loadCustomExtension(url);
                this._notify(`已加载扩展：${url}`, false);
            } catch (error) {
                this._notify(`加载扩展失败：${error && error.message ? error.message : error}`, true);
                logger.warn('[插件系统] 加载扩展失败', error);
            }
        }

        async preloadExtensionSource (args) {
            const source = toStringValue(args.SOURCE);
            if (!source.trim()) return;
            try {
                const dataURL = `data:text/javascript;base64,${encodeUTF8Base64(source)}`;
                await this._loadCustomExtension(dataURL);
                this._notify('已加载扩展源代码', false);
            } catch (error) {
                this._notify(`加载扩展失败：${error && error.message ? error.message : error}`, true);
                logger.warn('[插件系统] 加载扩展源代码失败', error);
            }
        }

        async _loadCustomExtension (url) {
            const manager = this.vm && this.vm.extensionManager;
            if (!manager || typeof manager.loadExtensionURL !== 'function') {
                throw new Error('当前环境不支持加载自定义扩展');
            }
            await manager.loadExtensionURL(url);
            // 扩展就绪后让所有目标重新编译，插件插入的积木才能正常执行
            const runtime = this.runtime;
            if (runtime && typeof runtime.removeCompiledProjectDataForTarget === 'function') {
                for (const target of runtime.targets || []) {
                    try {
                        runtime.removeCompiledProjectDataForTarget(target);
                    } catch (error) {
                        // ignore
                    }
                }
            }
            this._refreshEditor();
        }

        // -----------------------------------------------------------------
        // 加载 / 卸载
        // -----------------------------------------------------------------

        loadPluginFromFile (args, util) {
            return new Promise(resolve => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.sb3,.json,application/zip,application/json';
                input.style.display = 'none';
                let settled = false;
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    try {
                        input.remove();
                    } catch (error) {
                        // ignore
                    }
                    resolve();
                };
                input.addEventListener('change', async () => {
                    const file = input.files && input.files[0];
                    if (!file) {
                        finish();
                        return;
                    }
                    try {
                        const buffer = await file.arrayBuffer();
                        const projectJSON = await parseProjectBuffer(buffer);
                        const applied = await this._loadPlugin(
                            projectJSON,
                            file.name,
                            util && util.thread
                        );
                        this._notify(`已加载插件：${applied.join('、')}`, false);
                    } catch (error) {
                        this._notify(`加载插件失败：${error && error.message ? error.message : error}`, true);
                        logger.warn('[插件系统] 加载插件失败', error);
                    }
                    finish();
                });
                input.addEventListener('cancel', finish);
                document.body.appendChild(input);
                try {
                    input.click();
                } catch (error) {
                    finish();
                }
            });
        }

        async loadPluginFromURL (args, util) {
            const url = toStringValue(args.URL).trim();
            if (!url) return;
            try {
                const buffer = await fetchArrayBuffer(url);
                const projectJSON = await parseProjectBuffer(buffer);
                const fileName = url.split('/').pop() || 'plugin.sb3';
                const applied = await this._loadPlugin(projectJSON, fileName, util && util.thread);
                this._notify(`已加载插件：${applied.join('、')}`, false);
            } catch (error) {
                this._notify(`加载插件失败：${error && error.message ? error.message : error}`, true);
                logger.warn('[插件系统] 加载插件失败', error);
            }
        }

        async loadPluginFromText (args, util) {
            const text = toStringValue(args.TEXT).trim();
            if (!text) return;
            try {
                let projectJSON = null;
                if (text.charAt(0) === '{') {
                    projectJSON = JSON.parse(text);
                } else {
                    const bytes = decodeBase64(text);
                    if (!bytes) {
                        throw new Error('文本既不是 project.json，也不是 base64 编码的 sb3');
                    }
                    projectJSON = await parseProjectBuffer(bytes);
                }
                const applied = await this._loadPlugin(projectJSON, 'text', util && util.thread);
                this._notify(`已加载插件：${applied.join('、')}`, false);
            } catch (error) {
                this._notify(`加载插件失败：${error && error.message ? error.message : error}`, true);
                logger.warn('[插件系统] 加载插件失败', error);
            }
        }

        unloadPlugin (args, util) {
            const key = normalizeId(args.ID);
            if (!key) return;
            const unloaded = this._unloadUnit(key, util && util.thread);
            if (unloaded) {
                this._notify(`已卸载插件：${toStringValue(args.ID)}`, false);
            } else {
                this._notify(`没有找到插件：${toStringValue(args.ID)}`, true);
            }
        }

        unloadAllPlugins (args, util) {
            const keys = this._unitOrder.slice();
            for (const key of keys) {
                this._unloadUnit(key, util && util.thread);
            }
            this._notify('已卸载所有插件', false);
        }

        reapplyPlugins (args, util) {
            this._reapplyAll(util && util.thread);
            this._notify('已重新应用所有插件', false);
        }

        // -----------------------------------------------------------------
        // 查询
        // -----------------------------------------------------------------

        pluginLoaded (args) {
            return this._units.has(normalizeId(args.ID));
        }

        slotHasPlugin (args) {
            const wanted = normalizeId(args.ID);
            if (!wanted) return false;
            const slots = this._findSlots();
            for (const slot of slots) {
                if (normalizeId(slot.slotId) !== wanted) continue;
                const key = `${slot.target.id}/${slot.blockId}`;
                if (this._slotSources.get(key)) return true;
            }
            return false;
        }

        pluginCount () {
            return this._units.size;
        }

        pluginList () {
            const ids = [];
            for (const key of this._unitOrder) {
                const unit = this._units.get(key);
                if (unit) ids.push(unit.id);
            }
            return ids.join('\n');
        }

        pluginInfo (args) {
            const unit = this._units.get(normalizeId(args.ID));
            if (!unit) return '';
            const type = toStringValue(args.TYPE) || 'name';
            const value = unit.meta && Object.prototype.hasOwnProperty.call(unit.meta, type) ?
                unit.meta[type] : '';
            return toStringValue(value);
        }

        slotSource (args) {
            return this.slotHasPlugin(args) ? 'plugin' : 'default';
        }

        // -----------------------------------------------------------------
        // 插件加载
        // -----------------------------------------------------------------

        async _loadPlugin (projectJSON, sourceName, keepThread) {
            if (!projectJSON || typeof projectJSON !== 'object' || !Array.isArray(projectJSON.targets)) {
                throw new Error('插件数据无效：缺少 targets 字段');
            }
            const targets = projectJSON.targets;
            const stage = targets.filter(target => target && target.isStage)[0] || targets[0] || {};
            const rawMeta = projectJSON.plugin && typeof projectJSON.plugin === 'object' ?
                projectJSON.plugin : {};
            const fileMeta = {
                name: toStringValue(rawMeta.name).trim() ||
                    toStringValue(stage.name).trim() ||
                    toStringValue(sourceName).replace(/\.(sb3|json)$/i, '')
                        .trim() ||
                    '未命名插件',
                author: toStringValue(rawMeta.author).trim(),
                version: toStringValue(rawMeta.version).trim(),
                description: toStringValue(rawMeta.description).trim()
            };

            const allUnits = this._extractUnits(projectJSON, fileMeta);
            if (!allUnits.length) {
                throw new Error('插件中没有找到带 ID 的「当插件 [ID] 被加载」帽子块');
            }

            const openSlotIds = new Set();
            for (const slot of this._findSlots()) {
                const slotId = normalizeId(slot.slotId);
                if (slotId) openSlotIds.add(slotId);
            }

            // 只保留与当前项目已开放插槽匹配的 ID，其余部分整体省略
            const units = [];
            const seen = new Set();
            for (const unit of allUnits) {
                if (seen.has(unit.key)) continue;
                if (!openSlotIds.has(unit.key)) continue;
                seen.add(unit.key);
                units.push(unit);
            }
            if (!units.length) {
                throw new Error('插件中没有与当前项目开放插槽匹配的 ID');
            }

            await this._loadPluginExtensions(projectJSON, units);

            const variableInfo = this._collectPluginVariables(projectJSON);
            const usedVariableIds = new Set();
            for (const unit of units) {
                for (const block of this._collectUnitBlocks(unit)) {
                    const fields = block.fields || {};
                    for (const fieldName of Object.keys(fields)) {
                        const field = fields[fieldName];
                        if (!field || !field.id) continue;
                        if (fieldName !== 'VARIABLE' && fieldName !== 'LIST' &&
                            fieldName !== 'BROADCAST_OPTION') continue;
                        usedVariableIds.add(field.id);
                    }
                }
            }
            for (const pluginVariableId of Array.from(variableInfo.keys())) {
                if (!usedVariableIds.has(pluginVariableId)) variableInfo.delete(pluginVariableId);
            }
            const variableRemap = this._buildVariableRemap(variableInfo);
            for (const unit of units) {
                unit.variableRemap = variableRemap;
            }

            // 同一个 ID 的插件重复加载时先卸载旧版本
            for (const unit of units) {
                if (this._units.has(unit.key)) {
                    this._unloadUnit(unit.key, keepThread);
                }
            }

            for (const unit of units) {
                this._units.set(unit.key, unit);
                this._unitOrder.push(unit.key);
                this._applyUnit(unit, keepThread);
            }

            for (const unit of units) {
                this._startHats(WHEN_LOADED_OPCODE, unit.id, keepThread);
            }
            this._startHats(WHEN_ANY_LOADED_OPCODE, null, keepThread);
            this._refreshEditor();

            return units.map(unit => unit.id);
        }

        _extractUnits (projectJSON, fileMeta) {
            const units = [];
            for (const target of projectJSON.targets) {
                if (!target) continue;
                const blocks = deserializeBlocksMap(target.blocks || {});
                const blockIds = Object.keys(blocks);
                for (const blockId of blockIds) {
                    const block = blocks[blockId];
                    if (!block || block.opcode !== WHEN_LOADED_OPCODE) continue;
                    const unitId = toStringValue(getInputLiteral(blocks, block, 'ID')).trim();
                    if (!unitId) continue;
                    const chainFirst = block.inputs && block.inputs.SUBSTACK ?
                        block.inputs.SUBSTACK.block : (block.next || null);
                    const chain = collectChainIds(blocks, chainFirst)
                        .map(id => blocks[id])
                        .filter(Boolean);
                    units.push({
                        id: unitId,
                        key: normalizeId(unitId),
                        chain,
                        sourceBlocks: blocks,
                        meta: fileMeta,
                        variableRemap: null
                    });
                }
            }
            return units;
        }

        // 返回该单元中会被克隆进插槽的全部源码积木（帽子链 + 链上所有被引用的
        // 输入/reporter 积木），与 _clonePluginChain 的克隆范围保持一致，确保
        // 以输入方式引用的变量、列表、广播和自定义扩展块也被纳入扫描。
        _collectUnitBlocks (unit) {
            const result = new Set();
            const sourceBlocks = unit.sourceBlocks;
            if (!sourceBlocks) return result;
            const queue = (unit.chain || []).slice();
            for (let i = 0; i < queue.length; i++) {
                const source = queue[i];
                if (!source || result.has(source)) continue;
                result.add(source);
                const inputs = source.inputs || {};
                for (const inputName of Object.keys(inputs)) {
                    const input = inputs[inputName];
                    for (const ref of [input.block, input.shadow]) {
                        if (typeof ref === 'string' && sourceBlocks[ref]) {
                            queue.push(sourceBlocks[ref]);
                        }
                    }
                }
                if (typeof source.next === 'string' && sourceBlocks[source.next]) {
                    queue.push(sourceBlocks[source.next]);
                }
            }
            return result;
        }

        async _loadPluginExtensions (projectJSON, units) {
            const manager = this.vm && this.vm.extensionManager;
            if (!manager) return;
            const extensionIds = new Set();
            for (const unit of units) {
                for (const block of this._collectUnitBlocks(unit)) {
                    const extensionId = getOpcodeExtensionId(block.opcode);
                    if (extensionId) extensionIds.add(extensionId);
                }
            }
            const extensionURLs = projectJSON.extensionURLs || {};
            for (const extensionId of extensionIds) {
                if (!extensionId || extensionId === EXTENSION_ID) continue;
                if (typeof manager.isExtensionLoaded === 'function' &&
                    manager.isExtensionLoaded(extensionId)) continue;
                try {
                    if (typeof manager.isBuiltinExtension === 'function' &&
                        manager.isBuiltinExtension(extensionId)) {
                        if (typeof manager.loadExtensionIdSync === 'function') {
                            manager.loadExtensionIdSync(extensionId);
                        }
                    } else if (typeof extensionURLs[extensionId] === 'string') {
                        await manager.loadExtensionURL(extensionURLs[extensionId]);
                    }
                } catch (error) {
                    logger.warn(`[插件系统] 无法自动加载插件依赖的扩展 ${extensionId}`, error);
                }
            }
        }

        _collectPluginVariables (projectJSON) {
            const info = new Map();
            for (const target of projectJSON.targets || []) {
                if (!target) continue;
                const variables = target.variables || {};
                for (const variableId of Object.keys(variables)) {
                    const description = variables[variableId];
                    const name = Array.isArray(description) ?
                        description[0] : (description && description.name);
                    if (typeof name !== 'string') continue;
                    info.set(variableId, {
                        name,
                        type: '',
                        isCloud: Array.isArray(description) && description[2] === true
                    });
                }
                const lists = target.lists || {};
                for (const listId of Object.keys(lists)) {
                    const description = lists[listId];
                    const name = Array.isArray(description) ?
                        description[0] : (description && description.name);
                    if (typeof name !== 'string') continue;
                    info.set(listId, {name, type: 'list'});
                }
                if (target.isStage && target.broadcasts) {
                    for (const broadcastId of Object.keys(target.broadcasts)) {
                        const name = target.broadcasts[broadcastId];
                        if (typeof name === 'string') {
                            info.set(broadcastId, {name, type: 'broadcast_msg'});
                        }
                    }
                }
            }
            return info;
        }

        _buildVariableRemap (variableInfo) {
            const remap = new Map();
            const stage = this.runtime && this.runtime.getTargetForStage();
            if (!stage || !variableInfo.size) return remap;
            const existing = new Map();
            for (const id of Object.keys(stage.variables || {})) {
                const variable = stage.variables[id];
                if (!variable) continue;
                existing.set(`${variable.type}\u0000${variable.name}`, variable);
            }
            for (const [pluginVariableId, info] of variableInfo.entries()) {
                const lookupKey = `${info.type}\u0000${info.name}`;
                let variable = existing.get(lookupKey);
                if (!variable) {
                    const newId = uid();
                    try {
                        stage.createVariable(newId, info.name, info.type);
                        variable = stage.variables[newId];
                        if (variable) existing.set(lookupKey, variable);
                    } catch (error) {
                        variable = null;
                    }
                }
                if (variable) {
                    remap.set(pluginVariableId, {id: variable.id, name: variable.name});
                }
            }
            return remap;
        }

        // -----------------------------------------------------------------
        // 插槽替换
        // -----------------------------------------------------------------

        _findSlots () {
            const slots = [];
            const runtime = this.runtime;
            if (!runtime) return slots;
            for (const target of runtime.targets || []) {
                if (!target || !target.isOriginal || !target.blocks) continue;
                const blocks = target.blocks._blocks || {};
                for (const blockId of Object.keys(blocks)) {
                    const block = blocks[blockId];
                    if (!block || block.opcode !== SLOT_OPCODE) continue;
                    slots.push({
                        target,
                        blockId,
                        slotId: toStringValue(getInputLiteral(blocks, block, 'ID')).trim()
                    });
                }
            }
            return slots;
        }

        _snapshotChain (target, slotBlockId) {
            const blocks = target.blocks;
            const slot = blocks.getBlock(slotBlockId);
            const firstId = slot && slot.inputs && slot.inputs.SUBSTACK ?
                slot.inputs.SUBSTACK.block : null;
            const chainIds = collectChainIds(blocks._blocks, firstId);
            return chainIds.map(id => cloneBlock(blocks._blocks[id]));
        }

        _removeChain (blocks, firstId) {
            if (!firstId) return [];
            const chainIds = collectChainIds(blocks._blocks, firstId);
            for (const id of chainIds) {
                delete blocks._blocks[id];
            }
            return chainIds;
        }

        _removeAppliedBlocks (blocks, slotBlockId, key) {
            const appliedIds = this._appliedBlocks.get(key) || [];
            for (const id of appliedIds) {
                delete blocks._blocks[id];
            }
            this._appliedBlocks.delete(key);
            this._slotSources.delete(key);
            setSubstack(blocks, slotBlockId, null);
            return appliedIds;
        }

        _clonePluginChain (unit) {
            const chain = unit.chain || [];
            if (!chain.length) return {copies: [], headId: null};
            const sourceBlocks = unit.sourceBlocks;
            const idMap = new Map();
            const queue = chain.slice();
            const copies = [];
            while (queue.length) {
                const source = queue.shift();
                if (!source || idMap.has(source.id)) continue;
                const copy = cloneBlock(source);
                copy.id = uid();
                copy.topLevel = false;
                if (copy.inputList) delete copy.inputList;
                idMap.set(source.id, copy.id);
                copies.push(copy);
                const inputs = source.inputs || {};
                for (const inputName of Object.keys(inputs)) {
                    const input = inputs[inputName];
                    const references = [input.block, input.shadow];
                    for (const reference of references) {
                        if (typeof reference === 'string' && sourceBlocks[reference] &&
                            !idMap.has(reference)) {
                            queue.push(sourceBlocks[reference]);
                        }
                    }
                }
                if (typeof source.next === 'string' && sourceBlocks[source.next] &&
                    !idMap.has(source.next)) {
                    queue.push(sourceBlocks[source.next]);
                }
            }
            for (const copy of copies) {
                const inputs = copy.inputs || {};
                for (const inputName of Object.keys(inputs)) {
                    const input = inputs[inputName];
                    if (typeof input.block === 'string' || input.block === null) {
                        input.block = input.block ? (idMap.get(input.block) || null) : null;
                    }
                    if (typeof input.shadow === 'string' || input.shadow === null) {
                        input.shadow = input.shadow ? (idMap.get(input.shadow) || null) : null;
                    }
                }
                if (copy.next) copy.next = idMap.get(copy.next) || null;
                if (copy.parent) copy.parent = idMap.get(copy.parent) || null;
                this._remapFields(copy.fields, unit.variableRemap);
            }
            const headId = idMap.get(chain[0].id) || null;
            return {copies, headId};
        }

        _remapFields (fields, variableRemap) {
            if (!fields || !variableRemap) return;
            for (const fieldName of Object.keys(fields)) {
                const field = fields[fieldName];
                if (!field || !field.id) continue;
                if (fieldName !== 'VARIABLE' && fieldName !== 'LIST' &&
                    fieldName !== 'BROADCAST_OPTION') continue;
                const mapped = variableRemap.get(field.id);
                if (mapped) {
                    field.id = mapped.id;
                    field.value = mapped.name;
                }
            }
        }

        _applyUnit (unit, keepThread) {
            const affected = new Map();
            const addAffected = (target, ids) => {
                if (!target) return;
                let set = affected.get(target);
                if (!set) {
                    set = new Set();
                    affected.set(target, set);
                }
                for (const id of ids || []) set.add(id);
            };
            const slots = this._findSlots();
            for (const slot of slots) {
                if (normalizeId(slot.slotId) !== unit.key) continue;
                const target = slot.target;
                const blocks = target.blocks;
                const slotBlockId = slot.blockId;
                const slotBlock = blocks.getBlock(slotBlockId);
                if (!slotBlock) continue;
                const key = `${target.id}/${slotBlockId}`;

                // 若该插槽此前已被其它插件占用，先移除旧代码
                if (this._slotSources.has(key)) {
                    addAffected(target, this._removeAppliedBlocks(blocks, slotBlockId, key));
                }

                // 第一次替换前保存默认代码，供卸载时还原
                if (!this._slotDefaults.has(key)) {
                    this._slotDefaults.set(key, this._snapshotChain(target, slotBlockId));
                }

                // 移除当前默认代码
                const currentFirst = slotBlock.inputs && slotBlock.inputs.SUBSTACK ?
                    slotBlock.inputs.SUBSTACK.block : null;
                addAffected(target, this._removeChain(blocks, currentFirst));

                // 插入插件代码
                const cloneResult = this._clonePluginChain(unit);
                for (const copy of cloneResult.copies) {
                    blocks._blocks[copy.id] = copy;
                }
                if (cloneResult.headId) {
                    const head = blocks._blocks[cloneResult.headId];
                    if (head) head.parent = slotBlockId;
                }
                setSubstack(blocks, slotBlockId, cloneResult.headId);
                this._appliedBlocks.set(key, cloneResult.copies.map(block => block.id));
                this._slotSources.set(key, unit.key);

                addAffected(target, [slotBlockId]);
                addAffected(target, cloneResult.copies.map(block => block.id));
            }
            this._invalidateTargets(affected, keepThread);
        }

        _restoreSlot (target, slotBlockId, key) {
            const blocks = target.blocks;
            // 快照只使用一次：还原后立刻清除，避免把用户随后删除的默认代码复活
            const snapshot = this._slotDefaults.get(key);
            this._slotDefaults.delete(key);
            const slotBlock = blocks.getBlock(slotBlockId);
            this._removeAppliedBlocks(blocks, slotBlockId, key);
            if (!slotBlock || !snapshot || !snapshot.length) return;
            for (const block of snapshot) {
                blocks._blocks[block.id] = cloneBlock(block);
            }
            const head = blocks._blocks[snapshot[0].id];
            if (head) head.parent = slotBlockId;
            setSubstack(blocks, slotBlockId, snapshot[0].id);
        }

        _unloadUnit (unitKey, keepThread) {
            if (!this._units.has(unitKey)) return false;
            const affected = new Map();
            const addAffected = (target, ids) => {
                if (!target) return;
                let set = affected.get(target);
                if (!set) {
                    set = new Set();
                    affected.set(target, set);
                }
                for (const id of ids || []) set.add(id);
            };
            const slotKeys = Array.from(this._slotSources.keys());
            for (const slotKey of slotKeys) {
                if (this._slotSources.get(slotKey) !== unitKey) continue;
                const separator = slotKey.indexOf('/');
                const targetId = slotKey.slice(0, separator);
                const slotBlockId = slotKey.slice(separator + 1);
                const target = this.runtime.getTargetById(targetId);
                const appliedIds = (this._appliedBlocks.get(slotKey) || []).slice();
                if (!target) {
                    this._slotSources.delete(slotKey);
                    this._appliedBlocks.delete(slotKey);
                    continue;
                }
                this._restoreSlot(target, slotBlockId, slotKey);
                addAffected(target, appliedIds);
                addAffected(target, [slotBlockId]);
            }
            this._units.delete(unitKey);
            this._unitOrder = this._unitOrder.filter(key => key !== unitKey);
            this._invalidateTargets(affected, keepThread);
            return true;
        }

        _reapplyAll (keepThread) {
            const affected = new Map();
            const addAffected = (target, ids) => {
                if (!target) return;
                let set = affected.get(target);
                if (!set) {
                    set = new Set();
                    affected.set(target, set);
                }
                for (const id of ids || []) set.add(id);
            };
            // 先把所有被插件占用的插槽还原成默认代码
            const slotKeys = Array.from(this._slotSources.keys());
            for (const slotKey of slotKeys) {
                if (!this._slotSources.get(slotKey)) continue;
                const separator = slotKey.indexOf('/');
                const targetId = slotKey.slice(0, separator);
                const slotBlockId = slotKey.slice(separator + 1);
                const target = this.runtime.getTargetById(targetId);
                const appliedIds = (this._appliedBlocks.get(slotKey) || []).slice();
                if (!target) {
                    this._slotSources.delete(slotKey);
                    this._appliedBlocks.delete(slotKey);
                    continue;
                }
                this._restoreSlot(target, slotBlockId, slotKey);
                addAffected(target, appliedIds);
                addAffected(target, [slotBlockId]);
            }
            this._invalidateTargets(affected, keepThread);
            // 再按加载顺序重新应用，同时覆盖新增的插槽
            for (const key of this._unitOrder.slice()) {
                const unit = this._units.get(key);
                if (unit) this._applyUnit(unit, keepThread);
            }
            this._refreshEditor();
        }

        // -----------------------------------------------------------------
        // 缓存失效 / 线程处理 / 帽子块触发 / 提示
        // -----------------------------------------------------------------

        _invalidateTargets (affected, keepThread) {
            const runtime = this.runtime;
            if (!runtime) return;
            for (const [target, blockIds] of affected.entries()) {
                try {
                    target.blocks.resetCache();
                } catch (error) {
                    // ignore
                }
                try {
                    target.blocks.emitProjectChanged();
                } catch (error) {
                    // ignore
                }
                if (typeof runtime.removeCompiledProjectDataForTarget === 'function') {
                    // 编译缓存按 target 记录，克隆体与角色共享积木容器，需要一并失效
                    for (const otherTarget of runtime.targets || []) {
                        if (!otherTarget || otherTarget.blocks !== target.blocks) continue;
                        try {
                            runtime.removeCompiledProjectDataForTarget(otherTarget);
                        } catch (error) {
                            // ignore
                        }
                    }
                }
                const threads = runtime.threads || [];
                for (const thread of threads) {
                    if (!thread || thread === keepThread) continue;
                    // 克隆体与原角色共享同一个 Blocks 容器，这里统一按容器判断
                    if (!thread.target || thread.target.blocks !== target.blocks) continue;
                    const stack = thread.stack || [];
                    let inside = false;
                    for (const blockId of stack) {
                        if (blockIds.has(blockId)) {
                            inside = true;
                            break;
                        }
                    }
                    if (!inside && thread.topBlock && blockIds.has(thread.topBlock)) {
                        inside = true;
                    }
                    if (inside && typeof runtime._stopThread === 'function') {
                        try {
                            runtime._stopThread(thread);
                        } catch (error) {
                            // ignore
                        }
                    }
                }
            }
            this._refreshEditor();
        }

        _startHats (opcode, id, keepThread) {
            const runtime = this.runtime;
            const started = [];
            if (!runtime) return started;
            const wantId = id === null || typeof id === 'undefined' ? null : normalizeId(id);
            for (const target of runtime.targets || []) {
                if (!target || !target.blocks || typeof target.blocks.getScripts !== 'function') {
                    continue;
                }
                const blocks = target.blocks;
                const scripts = blocks.getScripts();
                for (const topBlockId of scripts) {
                    const block = blocks.getBlock(topBlockId);
                    if (!block || block.opcode !== opcode) continue;
                    if (wantId !== null) {
                        const literal = getInputLiteral(blocks._blocks, block, 'ID');
                        if (literal === null || normalizeId(literal) !== wantId) continue;
                    }
                    const running = (runtime.threads || []).find(thread =>
                        thread && !thread.isKilled && thread.target === target &&
                        thread.topBlock === topBlockId && thread.status !== 4
                    );
                    if (running) {
                        // 当前加载线程本身就在这个帽子块里，避免重复启动
                        if (running === keepThread) continue;
                        if (typeof runtime._stopThread === 'function') {
                            try {
                                runtime._stopThread(running);
                            } catch (error) {
                                // ignore
                            }
                        }
                    }
                    try {
                        started.push(runtime._pushThread(topBlockId, target));
                    } catch (error) {
                        logger.warn('[插件系统] 启动帽子块失败', error);
                    }
                }
            }
            return started;
        }

        _refreshEditor () {
            const runtime = this.runtime;
            if (!runtime) return;
            if (typeof runtime.requestBlocksUpdate === 'function') {
                runtime.requestBlocksUpdate();
            }
        }

        _notify (message, isError) {
            if (isError) {
                logger.warn(`[插件系统] ${message}`);
            } else {
                logger.log(`[插件系统] ${message}`);
            }
            if (typeof document === 'undefined' || !document.body) return;
            const toast = document.createElement('div');
            toast.textContent = `[插件系统] ${message}`;
            toast.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);' +
                'z-index:2147483647;max-width:min(560px,90vw);padding:10px 16px;border-radius:10px;' +
                'font:13px/1.5 sans-serif;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);' +
                'white-space:pre-wrap;pointer-events:none;' +
                `background:${isError ? 'rgba(190,30,45,.95)' : 'rgba(35,120,90,.95)'};`;
            document.body.appendChild(toast);
            setTimeout(() => {
                try {
                    toast.remove();
                } catch (error) {
                    // ignore
                }
            }, isError ? 6000 : 3000);
        }
    }

    Scratch.extensions.register(new PluginSystemExtension());
}(Scratch));
