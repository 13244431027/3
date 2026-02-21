class BlockSearchExtension {
    getInfo() {
        return {
            id: 'blockSearchExtension',
            name: '搜索积木',
            blockIconURI: 'https://raw.githubusercontent.com/Mirazstudio-offical/Dash_code_cleaner_extension/refs/heads/main/extension_icon.png',
            color1: '#4B6CB7',
            color2: '#3B5AA6',
            blocks: [
                {
                    opcode: 'setKeyword',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '设置搜索关键词 [KW]',
                    arguments: {
                        KW: { type: Scratch.ArgumentType.STRING, defaultValue: '移动' }
                    }
                },
                {
                    opcode: 'setSearchMode',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '搜索模式 [MODE]',
                    arguments: {
                        MODE: { type: Scratch.ArgumentType.STRING, defaultValue: '中文名' } // 中文名 / opcode / 全部
                    }
                },
                {
                    opcode: 'searchAllTargets',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '搜索所有角色的积木并自动跳转(弹窗显示)'
                },
                {
                    opcode: 'searchCurrentTarget',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '搜索当前角色的积木并自动跳转(弹窗显示)'
                },
                {
                    opcode: 'nextResult',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '跳到下一个结果'
                },
                {
                    opcode: 'prevResult',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '跳到上一个结果'
                },
                {
                    opcode: 'jumpToIndex',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '跳转到第 [N] 个结果',
                    arguments: {
                        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                    }
                },
                {
                    opcode: 'clearHighlight',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清除高亮'
                },
                {
                    opcode: 'resultCount',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '结果数量'
                },
                {
                    opcode: 'currentIndex',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '当前结果序号(从1开始)'
                },
                {
                    opcode: 'currentResultInfo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '当前结果信息'
                }
            ]
        };
    }

    constructor() {
        this._kw = '';
        this._mode = '中文名'; // 中文名 / opcode / 全部
        this._results = [];    // { targetId, targetName, blockId, opcode, zhName, topScriptId }
        this._i = -1;

        this._highlighted = new Set();

        this._opcodeToZh = this._buildOpcodeToZhMap_TurboWarpWeb();

        this._lastPopupText = '';
    }

    /* ===================== TurboWarp / Scratch internals ===================== */

    _getBlockly() {
        const vm = Scratch.vm;
        return (vm && vm.extensionManager && vm.extensionManager._blockly) ||
            (Scratch && Scratch.gui && Scratch.gui.getBlockly && Scratch.gui.getBlockly()) ||
            null;
    }

    _getWorkspace() {
        const blockly = this._getBlockly();
        if (!blockly) return null;
        return blockly.workspace || (blockly.getMainWorkspace && blockly.getMainWorkspace()) || null;
    }

    _getVM() {
        return Scratch.vm;
    }

    _getRuntime() {
        const vm = this._getVM();
        return vm && vm.runtime;
    }

    _getTargets() {
        const rt = this._getRuntime();
        return (rt && rt.targets) || [];
    }

    _getEditingTarget() {
        const rt = this._getRuntime();
        return rt && rt.getEditingTarget && rt.getEditingTarget();
    }

    _setEditingTarget(targetId) {
        const vm = this._getVM();
        try {
            if (typeof vm.setEditingTarget === 'function') vm.setEditingTarget(targetId);
            else if (vm.runtime && typeof vm.runtime.setEditingTarget === 'function') vm.runtime.setEditingTarget(targetId);
        } catch (e) {}
    }

    _getTargetName(target) {
        if (!target) return '';
        if (target.isStage) return '舞台';
        if (typeof target.getName === 'function') return target.getName();
        return target.sprite && target.sprite.name ? target.sprite.name : (target.name || target.id || '');
    }

    _normalize(s) {
        return String(s ?? '').toLowerCase().trim();
    }

    _safeStringify(obj) {
        try { return JSON.stringify(obj); } catch (e) { return String(obj); }
    }

    /* ===================== Chinese block name mapping ===================== */

    _buildOpcodeToZhMap_TurboWarpWeb() {
        const map = Object.create(null);

        // 重要说明：
        // 1) TurboWarp 网页版的积木“中文显示名”来自 Scratch 翻译 + block definitions 文本；
        // 2) 没有稳定的公开 API 可直接把任意 opcode 转为当前语言的积木文本；
        // 3) 这里提供一个“高覆盖率”映射（常用积木），并尽量对未知 opcode 做兜底显示 opcode。
        // 你如果要“100% 全部积木中文名”，需要基于 TurboWarp GUI 的 message catalog 动态解析，
        // 不同版本会变动，稳定性较差。

        // ---- 事件 ----
        map['event_whenflagclicked'] = '当绿旗被点击';
        map['event_whenkeypressed'] = '当按下按键';
        map['event_whenthisspriteclicked'] = '当角色被点击';
        map['event_whenstageclicked'] = '当舞台被点击';
        map['event_whenbackdropswitchesto'] = '当背景换成';
        map['event_whengreaterthan'] = '当响度/计时器大于';
        map['event_whenbroadcastreceived'] = '当接收到广播';
        map['event_broadcast'] = '广播';
        map['event_broadcastandwait'] = '广播并等待';

        // ---- 运动 ----
        map['motion_movesteps'] = '移动步数';
        map['motion_turnright'] = '右转度数';
        map['motion_turnleft'] = '左转度数';
        map['motion_goto'] = '移到';
        map['motion_gotoxy'] = '移到x y';
        map['motion_glideto'] = '滑行到';
        map['motion_glidesecstoxy'] = '在秒内滑行到x y';
        map['motion_pointindirection'] = '面向方向';
        map['motion_pointtowards'] = '面向';
        map['motion_changexby'] = 'x增加';
        map['motion_setx'] = '将x设为';
        map['motion_changeyby'] = 'y增加';
        map['motion_sety'] = '将y设为';
        map['motion_ifonedgebounce'] = '碰到边缘就反弹';
        map['motion_setrotationstyle'] = '将旋转方式设为';
        map['motion_xposition'] = 'x坐标';
        map['motion_yposition'] = 'y坐标';
        map['motion_direction'] = '方向';

        // ---- 外观 ----
        map['looks_sayforsecs'] = '说秒';
        map['looks_say'] = '说';
        map['looks_thinkforsecs'] = '想秒';
        map['looks_think'] = '想';
        map['looks_switchcostumeto'] = '换成造型';
        map['looks_nextcostume'] = '下一个造型';
        map['looks_switchbackdropto'] = '换成背景';
        map['looks_switchbackdroptoandwait'] = '换成背景并等待';
        map['looks_nextbackdrop'] = '下一个背景';
        map['looks_changesizeby'] = '将大小增加';
        map['looks_setsizeto'] = '将大小设为';
        map['looks_changeeffectby'] = '将特效增加';
        map['looks_seteffectto'] = '将特效设为';
        map['looks_cleargraphiceffects'] = '清除图形特效';
        map['looks_show'] = '显示';
        map['looks_hide'] = '隐藏';
        map['looks_gotofrontback'] = '移到最前面/最后面';
        map['looks_goforwardbackwardlayers'] = '前移/后移层';
        map['looks_costumenumbername'] = '造型编号/名称';
        map['looks_backdropnumbername'] = '背景编号/名称';
        map['looks_size'] = '大小';

        // ---- 声音 ----
        map['sound_play'] = '播放声音';
        map['sound_playuntildone'] = '播放声音直到结束';
        map['sound_stopallsounds'] = '停止所有声音';
        map['sound_changeeffectby'] = '将音效增加';
        map['sound_seteffectto'] = '将音效设为';
        map['sound_cleareffects'] = '清除音效';
        map['sound_changevolumeby'] = '将音量增加';
        map['sound_setvolumeto'] = '将音量设为';
        map['sound_volume'] = '音量';

        // ---- 控制 ----
        map['control_wait'] = '等待';
        map['control_repeat'] = '重复执行';
        map['control_forever'] = '重复执行(永远)';
        map['control_if'] = '如果';
        map['control_if_else'] = '如果否则';
        map['control_wait_until'] = '等待直到';
        map['control_repeat_until'] = '重复执行直到';
        map['control_stop'] = '停止';
        map['control_start_as_clone'] = '当作为克隆体启动时';
        map['control_create_clone_of'] = '克隆';
        map['control_delete_this_clone'] = '删除此克隆体';

        // ---- 侦测 ----
        map['sensing_touchingobject'] = '碰到';
        map['sensing_touchingcolor'] = '碰到颜色';
        map['sensing_coloristouchingcolor'] = '颜色碰到颜色';
        map['sensing_distanceto'] = '到的距离';
        map['sensing_askandwait'] = '询问并等待';
        map['sensing_answer'] = '回答';
        map['sensing_keypressed'] = '按键按下?';
        map['sensing_mousedown'] = '鼠标按下?';
        map['sensing_mousex'] = '鼠标x';
        map['sensing_mousey'] = '鼠标y';
        map['sensing_setdragmode'] = '将拖动模式设为';
        map['sensing_loudness'] = '响度';
        map['sensing_timer'] = '计时器';
        map['sensing_resettimer'] = '计时器归零';
        map['sensing_of'] = '的';
        map['sensing_current'] = '当前时间';
        map['sensing_dayssince2000'] = '2000年以来的天数';
        map['sensing_username'] = '用户名';

        // ---- 运算 ----
        map['operator_add'] = '加';
        map['operator_subtract'] = '减';
        map['operator_multiply'] = '乘';
        map['operator_divide'] = '除';
        map['operator_random'] = '随机取数';
        map['operator_gt'] = '大于';
        map['operator_lt'] = '小于';
        map['operator_equals'] = '等于';
        map['operator_and'] = '与';
        map['operator_or'] = '或';
        map['operator_not'] = '非';
        map['operator_join'] = '连接';
        map['operator_letter_of'] = '第字母';
        map['operator_length'] = '长度';
        map['operator_contains'] = '包含?';
        map['operator_mod'] = '取余';
        map['operator_round'] = '四舍五入';
        map['operator_mathop'] = '数学函数';

        // ---- 变量/列表 ----
        map['data_setvariableto'] = '将变量设为';
        map['data_changevariableby'] = '将变量增加';
        map['data_showvariable'] = '显示变量';
        map['data_hidevariable'] = '隐藏变量';
        map['data_addtolist'] = '加入列表';
        map['data_deleteoflist'] = '删除列表第项';
        map['data_deletealloflist'] = '删除列表全部';
        map['data_insertatlist'] = '插入到列表';
        map['data_replaceitemoflist'] = '替换列表第项';
        map['data_itemoflist'] = '列表第项';
        map['data_itemnumoflist'] = '项号(在列表中)';
        map['data_lengthoflist'] = '列表长度';
        map['data_listcontainsitem'] = '列表包含?';
        map['data_showlist'] = '显示列表';
        map['data_hidelist'] = '隐藏列表';

        // ---- 自制积木 ----
        map['procedures_definition'] = '定义';
        map['procedures_call'] = '自制积木调用';
        map['procedures_prototype'] = '自制积木原型';

        // ---- 扩展/钢琴等：未知就兜底 opcode ----
        return map;
    }

    _getChineseBlockName(opcode) {
        const op = String(opcode || '');
        return this._opcodeToZh[op] || op;
    }

    /* ===================== Matching logic ===================== */

    _blockMatches(block, kwNorm, mode) {
        if (!block || !kwNorm) return false;

        const opcodeNorm = this._normalize(block.opcode);
        const zhNorm = this._normalize(this._getChineseBlockName(block.opcode));

        const m = this._normalize(mode);

        // 中文名：只匹配中文积木名（映射表 / 兜底 opcode）
        if (m === this._normalize('中文名')) {
            return zhNorm.includes(kwNorm);
        }

        // opcode：只匹配 opcode
        if (m === this._normalize('opcode')) {
            return opcodeNorm.includes(kwNorm);
        }

        // 全部：opcode、中文名、fields、inputs 统统匹配
        if (m === this._normalize('全部')) {
            if (opcodeNorm.includes(kwNorm)) return true;
            if (zhNorm.includes(kwNorm)) return true;

            if (block.fields) {
                for (const k of Object.keys(block.fields)) {
                    const f = block.fields[k];
                    const v = this._normalize(f && (f.value ?? f.name ?? ''));
                    if (v.includes(kwNorm)) return true;
                }
            }

            if (block.inputs) {
                const inputsStr = this._normalize(this._safeStringify(block.inputs));
                if (inputsStr.includes(kwNorm)) return true;
            }

            return false;
        }

        // 未知模式：按“全部”
        if (opcodeNorm.includes(kwNorm)) return true;
        if (zhNorm.includes(kwNorm)) return true;

        if (block.fields) {
            for (const k of Object.keys(block.fields)) {
                const f = block.fields[k];
                const v = this._normalize(f && (f.value ?? f.name ?? ''));
                if (v.includes(kwNorm)) return true;
            }
        }

        if (block.inputs) {
            const inputsStr = this._normalize(this._safeStringify(block.inputs));
            if (inputsStr.includes(kwNorm)) return true;
        }

        return false;
    }

    _getTopScriptIdForBlock(target, blockId) {
        try {
            let b = target.blocks.getBlock(blockId);
            if (!b) return blockId;
            while (b && b.parent) {
                const parent = target.blocks.getBlock(b.parent);
                if (!parent) break;
                b = parent;
            }
            return (b && b.id) ? b.id : blockId;
        } catch (e) {
            return blockId;
        }
    }

    _collectMatchesFromTarget(target, kwNorm, mode) {
        const matches = [];
        if (!target || !target.blocks) return matches;

        const targetName = this._getTargetName(target);

        // TurboWarp/Scratch VM 常见：blocks._blocks 存全部 blocks
        const all = target.blocks._blocks || null;

        if (all && typeof all === 'object') {
            for (const id of Object.keys(all)) {
                const b = target.blocks.getBlock(id);
                if (!b) continue;

                if (this._blockMatches(b, kwNorm, mode)) {
                    matches.push({
                        targetId: target.id,
                        targetName,
                        blockId: id,
                        opcode: b.opcode,
                        zhName: this._getChineseBlockName(b.opcode),
                        topScriptId: this._getTopScriptIdForBlock(target, id)
                    });
                }
            }
            return matches;
        }

        // fallback：遍历脚本链
        const visitChain = (id) => {
            while (id) {
                const b = target.blocks.getBlock(id);
                if (!b) break;

                if (this._blockMatches(b, kwNorm, mode)) {
                    matches.push({
                        targetId: target.id,
                        targetName,
                        blockId: id,
                        opcode: b.opcode,
                        zhName: this._getChineseBlockName(b.opcode),
                        topScriptId: this._getTopScriptIdForBlock(target, id)
                    });
                }
                id = b.next;
            }
        };

        const tops = target.blocks.getScripts ? target.blocks.getScripts() : [];
        for (const topId of tops) visitChain(topId);

        return matches;
    }

    /* ===================== Highlight + Focus (fixed) ===================== */

    _clearHighlightInWorkspace() {
        const workspace = this._getWorkspace();
        if (!workspace) return;

        const all = workspace.getAllBlocks ? workspace.getAllBlocks(false) : [];
        for (const b of all) {
            if (b && typeof b.setGlowStack === 'function') b.setGlowStack(false);
            if (b && typeof b.setGlow === 'function') b.setGlow(false);

            const svg = b && b.getSvgRoot && b.getSvgRoot();
            if (svg && svg.classList) svg.classList.remove('ubc-search-highlight');
        }

        if (this._highlighted && this._highlighted.clear) this._highlighted.clear();
    }

    _applyHighlight(wsBlock) {
        if (!wsBlock) return;

        try {
            if (typeof wsBlock.setGlowStack === 'function') {
                wsBlock.setGlowStack(true);
                this._highlighted.add(wsBlock.id);
                return;
            }
            if (typeof wsBlock.setGlow === 'function') {
                wsBlock.setGlow(true);
                this._highlighted.add(wsBlock.id);
                return;
            }
        } catch (e) {}

        // 兜底：class
        const svg = wsBlock.getSvgRoot && wsBlock.getSvgRoot();
        if (svg && svg.classList) {
            svg.classList.add('ubc-search-highlight');
            this._highlighted.add(wsBlock.id);
        }
    }

    _ensureHighlightStyle() {
        if (document.getElementById('ubc-search-style')) return;
        const style = document.createElement('style');
        style.id = 'ubc-search-style';
        style.textContent = `
            .ubc-search-highlight {
                filter: drop-shadow(0 0 6px rgba(255, 180, 0, 0.95));
            }
            .ubc-search-highlight .blocklyPath {
                stroke: #ffb400 !important;
                stroke-width: 3px !important;
            }
        `;
        document.head.appendChild(style);
    }

    _focusBlock(targetId, blockId, alsoHighlight = true) {
        this._ensureHighlightStyle();

        this._setEditingTarget(targetId);

        const tryFocusNow = () => {
            const workspace = this._getWorkspace();
            if (!workspace) return false;

            const wsBlock = workspace.getBlockById && workspace.getBlockById(blockId);
            if (!wsBlock) return false;

            try {
                if (typeof wsBlock.select === 'function') wsBlock.select();
                if (workspace.centerOnBlock) workspace.centerOnBlock(blockId);
            } catch (e) {}

            if (alsoHighlight) this._applyHighlight(wsBlock);
            return true;
        };

        // 先清掉当前工作区高亮，再定位高亮当前
        this._clearHighlightInWorkspace();

        if (tryFocusNow()) return true;

        // TurboWarp 网页版切换 target 后，workspace 更新可能是异步的：多次重试
        let attempts = 0;
        const maxAttempts = 15;
        const timer = setInterval(() => {
            attempts++;
            const ok = tryFocusNow();
            if (ok || attempts >= maxAttempts) clearInterval(timer);
        }, 30);

        return true;
    }

    /* ===================== Popup UI (show all results + auto jump) ===================== */

    _removePopup() {
        const old = document.getElementById('ubc-search-popup');
        if (old) old.remove();
    }

    _showResultsPopup(results, titleText) {
        this._removePopup();

        const wrap = document.createElement('div');
        wrap.id = 'ubc-search-popup';
        wrap.style.position = 'fixed';
        wrap.style.right = '16px';
        wrap.style.top = '16px';
        wrap.style.width = '420px';
        wrap.style.maxWidth = 'calc(100vw - 32px)';
        wrap.style.maxHeight = 'calc(100vh - 32px)';
        wrap.style.overflow = 'hidden';
        wrap.style.zIndex = '999999';
        wrap.style.background = 'rgba(25, 25, 30, 0.96)';
        wrap.style.color = '#fff';
        wrap.style.border = '1px solid rgba(255,255,255,0.18)';
        wrap.style.borderRadius = '10px';
        wrap.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "PingFang SC", "Microsoft YaHei", sans-serif';

        const header = document.createElement('div');
        header.style.padding = '10px 12px';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';
        header.style.borderBottom = '1px solid rgba(255,255,255,0.12)';

        const title = document.createElement('div');
        title.textContent = titleText;
        title.style.fontWeight = '700';
        title.style.flex = '1';
        title.style.fontSize = '14px';
        title.style.lineHeight = '18px';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.background = 'rgba(255,255,255,0.12)';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = '1px solid rgba(255,255,255,0.18)';
        closeBtn.style.borderRadius = '8px';
        closeBtn.style.padding = '6px 10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => this._removePopup();

        header.appendChild(title);
        header.appendChild(closeBtn);

        const controls = document.createElement('div');
        controls.style.padding = '10px 12px';
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        controls.style.borderBottom = '1px solid rgba(255,255,255,0.12)';

        const prev = document.createElement('button');
        prev.textContent = '上一个';
        prev.style.flex = '1';
        prev.style.background = 'rgba(255,255,255,0.10)';
        prev.style.color = '#fff';
        prev.style.border = '1px solid rgba(255,255,255,0.18)';
        prev.style.borderRadius = '8px';
        prev.style.padding = '8px 10px';
        prev.style.cursor = 'pointer';
        prev.onclick = () => this.prevResult();

        const next = document.createElement('button');
        next.textContent = '下一个';
        next.style.flex = '1';
        next.style.background = 'rgba(255,255,255,0.10)';
        next.style.color = '#fff';
        next.style.border = '1px solid rgba(255,255,255,0.18)';
        next.style.borderRadius = '8px';
        next.style.padding = '8px 10px';
        next.style.cursor = 'pointer';
        next.onclick = () => this.nextResult();

        const clear = document.createElement('button');
        clear.textContent = '清除高亮';
        clear.style.flex = '1';
        clear.style.background = 'rgba(255,255,255,0.10)';
        clear.style.color = '#fff';
        clear.style.border = '1px solid rgba(255,255,255,0.18)';
        clear.style.borderRadius = '8px';
        clear.style.padding = '8px 10px';
        clear.style.cursor = 'pointer';
        clear.onclick = () => this.clearHighlight();

        controls.appendChild(prev);
        controls.appendChild(next);
        controls.appendChild(clear);

        const list = document.createElement('div');
        list.style.overflow = 'auto';
        list.style.maxHeight = 'calc(100vh - 150px)';

        const table = document.createElement('div');
        table.style.display = 'flex';
        table.style.flexDirection = 'column';

        const makeRow = (r, index) => {
            const row = document.createElement('div');
            row.style.padding = '10px 12px';
            row.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
            row.style.cursor = 'pointer';
            row.style.userSelect = 'none';

            const isCurrent = (index === this._i);
            row.style.background = isCurrent ? 'rgba(255,180,0,0.18)' : 'transparent';

            const line1 = document.createElement('div');
            line1.style.display = 'flex';
            line1.style.gap = '8px';
            line1.style.alignItems = 'baseline';

            const idx = document.createElement('div');
            idx.textContent = `#${index + 1}`;
            idx.style.fontWeight = '800';
            idx.style.color = 'rgba(255,255,255,0.92)';
            idx.style.minWidth = '48px';

            const who = document.createElement('div');
            who.textContent = r.targetName || r.targetId;
            who.style.color = 'rgba(255,255,255,0.85)';
            who.style.fontWeight = '700';

            line1.appendChild(idx);
            line1.appendChild(who);

            const line2 = document.createElement('div');
            line2.style.marginTop = '6px';
            line2.style.fontSize = '13px';
            line2.style.color = 'rgba(255,255,255,0.88)';
            line2.textContent = `积木：${r.zhName}   (opcode: ${r.opcode})`;

            const line3 = document.createElement('div');
            line3.style.marginTop = '4px';
            line3.style.fontSize = '12px';
            line3.style.color = 'rgba(255,255,255,0.62)';
            line3.textContent = `blockId: ${r.blockId}`;

            row.appendChild(line1);
            row.appendChild(line2);
            row.appendChild(line3);

            row.onclick = () => {
                this._i = index;
                this._focusBlock(r.targetId, r.blockId, true);

                // 更新行高亮
                this._showResultsPopup(this._results, this._lastPopupText);
            };

            return row;
        };

        for (let i = 0; i < results.length; i++) {
            table.appendChild(makeRow(results[i], i));
        }

        list.appendChild(table);

        wrap.appendChild(header);
        wrap.appendChild(controls);
        wrap.appendChild(list);
        document.body.appendChild(wrap);
    }

    _formatPopupTitle(scopeText) {
        const kw = this._kw;
        const mode = this._mode;
        return `${scopeText}：关键词「${kw}」 | 模式「${mode}」 | 共 ${this._results.length} 个结果（点击条目自动跳转）`;
    }

    /* ===================== Blocks (API) ===================== */

    setKeyword(args) {
        this._kw = String(args.KW ?? '');
    }

    setSearchMode(args) {
        const m = String(args.MODE ?? '').trim();
        this._mode = m || '中文名';
    }

    searchAllTargets() {
        const vm = this._getVM();
        const kwNorm = this._normalize(this._kw);

        this._results = [];
        this._i = -1;

        this._removePopup();
        this._clearHighlightInWorkspace();

        if (!kwNorm) {
            alert('请先设置搜索关键词。');
            return;
        }

        const targets = this._getTargets();
        for (const t of targets) {
            this._results.push(...this._collectMatchesFromTarget(t, kwNorm, this._mode));
        }

        // 按 targetName + opcode + blockId 排序（稳定显示）
        this._results.sort((a, b) => {
            const an = (a.targetName || '').localeCompare(b.targetName || '', 'zh-Hans-CN');
            if (an !== 0) return an;
            const ao = (a.opcode || '').localeCompare(b.opcode || '');
            if (ao !== 0) return ao;
            return (a.blockId || '').localeCompare(b.blockId || '');
        });

        if (this._results.length === 0) {
            alert('未找到匹配积木。');
            return;
        }

        // 自动跳转到第一个结果
        this._i = 0;
        const r = this._results[this._i];
        this._focusBlock(r.targetId, r.blockId, true);

        // 弹窗显示全部结果（可点击跳转）
        this._lastPopupText = this._formatPopupTitle('全项目搜索');
        this._showResultsPopup(this._results, this._lastPopupText);
    }

    searchCurrentTarget() {
        const kwNorm = this._normalize(this._kw);

        this._results = [];
        this._i = -1;

        this._removePopup();
        this._clearHighlightInWorkspace();

        if (!kwNorm) {
            alert('请先设置搜索关键词。');
            return;
        }

        const t = this._getEditingTarget();
        if (!t) {
            alert('无法获取当前编辑目标。');
            return;
        }

        this._results = this._collectMatchesFromTarget(t, kwNorm, this._mode);

        this._results.sort((a, b) => {
            const ao = (a.opcode || '').localeCompare(b.opcode || '');
            if (ao !== 0) return ao;
            return (a.blockId || '').localeCompare(b.blockId || '');
        });

        if (this._results.length === 0) {
            alert('当前角色未找到匹配积木。');
            return;
        }

        // 自动跳转到第一个结果
        this._i = 0;
        const r = this._results[this._i];
        this._focusBlock(r.targetId, r.blockId, true);

        // 弹窗显示全部结果（可点击跳转）
        const scopeText = `当前目标「${this._getTargetName(t)}」搜索`;
        this._lastPopupText = this._formatPopupTitle(scopeText);
        this._showResultsPopup(this._results, this._lastPopupText);
    }

    nextResult() {
        if (!this._results || this._results.length === 0) {
            alert('没有搜索结果，请先执行搜索。');
            return;
        }

        this._i = (this._i + 1) % this._results.length;
        const r = this._results[this._i];

        this._focusBlock(r.targetId, r.blockId, true);

        if (document.getElementById('ubc-search-popup')) {
            this._showResultsPopup(this._results, this._lastPopupText);
        }
    }

    prevResult() {
        if (!this._results || this._results.length === 0) {
            alert('没有搜索结果，请先执行搜索。');
            return;
        }

        this._i = (this._i - 1 + this._results.length) % this._results.length;
        const r = this._results[this._i];

        this._focusBlock(r.targetId, r.blockId, true);

        if (document.getElementById('ubc-search-popup')) {
            this._showResultsPopup(this._results, this._lastPopupText);
        }
    }

    jumpToIndex(args) {
        if (!this._results || this._results.length === 0) {
            alert('没有搜索结果，请先执行搜索。');
            return;
        }

        let n = Number(args.N);
        if (!Number.isFinite(n)) n = 1;
        n = Math.floor(n);

        if (n < 1) n = 1;
        if (n > this._results.length) n = this._results.length;

        this._i = n - 1;
        const r = this._results[this._i];
        this._focusBlock(r.targetId, r.blockId, true);

        if (document.getElementById('ubc-search-popup')) {
            this._showResultsPopup(this._results, this._lastPopupText);
        }
    }

    clearHighlight() {
        this._clearHighlightInWorkspace();
    }

    resultCount() {
        return this._results.length;
    }

    currentIndex() {
        return this._results.length ? (this._i + 1) : 0;
    }

    currentResultInfo() {
        if (!this._results.length || this._i < 0) return '';
        const r = this._results[this._i];
        return `${this._i + 1}/${this._results.length} | ${r.targetName} | ${r.zhName} | opcode=${r.opcode} | blockId=${r.blockId}`;
    }
}

Scratch.extensions.register(new BlockSearchExtension());
