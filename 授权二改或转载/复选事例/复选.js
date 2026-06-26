/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

(function () {
    // ============================================================
    // 1. 获取 Blockly 核心引擎
    // ============================================================
    function getScratchBlocks(runtime) {
        return (runtime && runtime.scratchBlocks) || window.ScratchBlocks || window.Blockly;
    }

    // ============================================================
    // 2. 高清 SVG 资源池 (Base64)
    // ============================================================
    // 复选框 (Checkbox)
    const CHECKBOX_ON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIyIDIyIj4KICA8cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiByeT0iNCIgZmlsbD0iIzRDOTdGRiIgc3Ryb2tlPSIjMzM3M0NDIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDxwYXRoIGQ9Ik02IDExLjUgTDkuNSAxNSBMMTYgNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==';
    const CHECKBOX_OFF = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIyIDIyIj4KICA8cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiByeT0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjQjNCM0IzIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4=';
    
    // 单选框 (Radio)
    const RADIO_ON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIyIDIyIj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSIxMCIgZmlsbD0iIzRDOTdGRiIgc3Ryb2tlPSIjMzM3M0NDIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjQiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+';
    const RADIO_OFF = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIyIDIyIj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSIxMCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjQjNCM0IzIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4=';

    // 【关键修复】：将积木配置信息挂载至全局，避免多扩展加载时因闭包隔离导致新扩展的自定义字段失效
    window.__gandiCustomBlocksInfo = window.__gandiCustomBlocksInfo || {};
    const customBlocksInfo = window.__gandiCustomBlocksInfo;

    // ============================================================
    // 3. 构建复选框 (FieldCheckbox) 与 单选框 (FieldRadio)
    // ============================================================
    function createCustomFields(Blockly) {
        if (Blockly.FieldCheckbox && Blockly.FieldRadio) return; 

        // ------------------ 复选框实现 (ES5) ------------------
        function FieldCheckbox(state) {
            const isChecked = state === true || String(state).toLowerCase() === 'true' || state === 'TRUE';
            const src = isChecked ? CHECKBOX_ON : CHECKBOX_OFF;
            
            if (typeof Blockly.FieldImage === 'function') {
                Blockly.FieldImage.call(this, src, 22, 22, '*');
            }
            
            this.src_ = src;
            this.width_ = 22;
            this.height_ = 22;
            this.state_ = isChecked;
            this.value_ = isChecked ? 'TRUE' : 'FALSE';
            this.isRadioField_ = false;
        }

        FieldCheckbox.prototype = Object.create(Blockly.FieldImage.prototype);
        FieldCheckbox.prototype.constructor = FieldCheckbox;
        FieldCheckbox.prototype.EDITABLE = true;
        FieldCheckbox.prototype.SERIALIZABLE = true;

        // ------------------ 单选框实现 (ES5) ------------------
        function FieldRadio(state) {
            const isChecked = state === true || String(state).toLowerCase() === 'true' || state === 'TRUE';
            const src = isChecked ? RADIO_ON : RADIO_OFF;
            
            if (typeof Blockly.FieldImage === 'function') {
                Blockly.FieldImage.call(this, src, 22, 22, '*');
            }
            
            this.src_ = src;
            this.width_ = 22;
            this.height_ = 22;
            this.state_ = isChecked;
            this.value_ = isChecked ? 'TRUE' : 'FALSE';
            this.isRadioField_ = true;
        }

        FieldRadio.prototype = Object.create(Blockly.FieldImage.prototype);
        FieldRadio.prototype.constructor = FieldRadio;
        FieldRadio.prototype.EDITABLE = true;
        FieldRadio.prototype.SERIALIZABLE = true;

        // ------------------ 公共交互与初始化 ------------------
        function initField() {
            if (this.fieldGroup_) return;
            Blockly.FieldImage.prototype.init.call(this);

            if (this.imageElement_) {
                this.imageElement_.setAttribute('width', '22px');
                this.imageElement_.setAttribute('height', '22px');
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.src_);
                this.imageElement_.style.transition = 'filter 0.1s ease';
                this.imageElement_.style.cursor = 'pointer';
            }
            if (this.getSvgRoot()) this.getSvgRoot().style.cursor = 'pointer';

            if (!this._eventsBound) {
                Blockly.bindEventWithChecks_(this.getSvgRoot(), 'mousedown', this, this._onMouseDown);
                Blockly.bindEventWithChecks_(this.getSvgRoot(), 'mouseup', this, this._onMouseUp);
                Blockly.bindEventWithChecks_(this.getSvgRoot(), 'mouseout', this, this._onMouseOut);
                this._eventsBound = true;
            }

            const self = this;
            setTimeout(function() {
                if (self.sourceBlock_ && self.imageElement_) {
                    self.setValue(self.value_);
                }
            }, 10);
        }

        FieldCheckbox.prototype.init = initField;
        FieldRadio.prototype.init = initField;

        // 鼠标悬停/按下动效
        function onMouseDown(e) {
            if (this.sourceBlock_ && this.sourceBlock_.isInFlyout) return;
            e.stopPropagation(); 
            this.isPressed_ = true;
            if (this.imageElement_) this.imageElement_.style.filter = 'brightness(1.25)';
        }
        FieldCheckbox.prototype._onMouseDown = onMouseDown;
        FieldRadio.prototype._onMouseDown = onMouseDown;

        function onMouseOut(e) {
            this.isPressed_ = false;
            if (this.imageElement_) this.imageElement_.style.filter = '';
        }
        FieldCheckbox.prototype._onMouseOut = onMouseOut;
        FieldRadio.prototype._onMouseOut = onMouseOut;

        // 复选框状态切换
        FieldCheckbox.prototype._onMouseUp = function(e) {
            if (!this.isPressed_) return;
            this.isPressed_ = false;
            if (this.imageElement_) this.imageElement_.style.filter = '';

            const newValue = !this.state_;
            if (this.sourceBlock_ && Blockly.Events && Blockly.Events.isEnabled()) {
                const ChangeEvent = Blockly.Events.Change || Blockly.Events.BlockChange;
                if (ChangeEvent) {
                    Blockly.Events.fire(new ChangeEvent(this.sourceBlock_, 'field', this.name, this.state_ ? 'TRUE' : 'FALSE', newValue ? 'TRUE' : 'FALSE'));
                }
            }
            this.setValue(newValue);
        };

        // 单选框状态切换（支持积木内互斥）
        FieldRadio.prototype._onMouseUp = function(e) {
            if (!this.isPressed_) return;
            this.isPressed_ = false;
            if (this.imageElement_) this.imageElement_.style.filter = '';

            if (this.state_) return; // 单选框不可反选自身

            if (this.sourceBlock_ && Blockly.Events && Blockly.Events.isEnabled()) {
                const ChangeEvent = Blockly.Events.Change || Blockly.Events.BlockChange;
                if (ChangeEvent) {
                    Blockly.Events.fire(new ChangeEvent(this.sourceBlock_, 'field', this.name, 'FALSE', 'TRUE'));
                }
            }
            this.setValue(true);

            if (this.sourceBlock_) {
                for (let i = 0; i < this.sourceBlock_.inputList.length; i++) {
                    const input = this.sourceBlock_.inputList[i];
                    for (let j = 0; j < input.fieldRow.length; j++) {
                        const field = input.fieldRow[j];
                        if (field !== this && field.isRadioField_ && field.state_) {
                            if (Blockly.Events && Blockly.Events.isEnabled()) {
                                const ChangeEvent = Blockly.Events.Change || Blockly.Events.BlockChange;
                                if (ChangeEvent) {
                                    Blockly.Events.fire(new ChangeEvent(this.sourceBlock_, 'field', field.name, 'TRUE', 'FALSE'));
                                }
                            }
                            field.setValue(false);
                        }
                    }
                }
            }
        };

        // 数据读取
        FieldCheckbox.prototype.getValue = function() { return this.value_; };
        FieldRadio.prototype.getValue = function() { return this.value_; };

        // 数据写入（修复了由于基类 init 内部调用 setValue(src) 导致的状态二次重置问题）
        FieldCheckbox.prototype.setValue = function(newValue) {
            if (newValue === null || newValue === undefined) return;

            if (typeof newValue === 'string' && newValue.indexOf('data:image') === 0) {
                this.src_ = newValue;
                if (this.imageElement_) {
                    this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.src_);
                }
                return;
            }
            
            const isChecked = newValue === true || String(newValue).toLowerCase() === 'true' || newValue === 'TRUE';
            
            this.state_ = isChecked;
            this.value_ = isChecked ? 'TRUE' : 'FALSE';
            this.src_ = isChecked ? CHECKBOX_ON : CHECKBOX_OFF;
            if (this.imageElement_) {
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.src_);
            }
        };

        FieldRadio.prototype.setValue = function(newValue) {
            if (newValue === null || newValue === undefined) return;

            if (typeof newValue === 'string' && newValue.indexOf('data:image') === 0) {
                this.src_ = newValue;
                if (this.imageElement_) {
                    this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.src_);
                }
                return;
            }
            
            const isChecked = newValue === true || String(newValue).toLowerCase() === 'true' || newValue === 'TRUE';
            
            this.state_ = isChecked;
            this.value_ = isChecked ? 'TRUE' : 'FALSE';
            this.src_ = isChecked ? RADIO_ON : RADIO_OFF;
            if (this.imageElement_) {
                this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.src_);
            }
        };

        FieldCheckbox.fromJson = function(options) { return new FieldCheckbox(options['checked'] || options['value'] || 'TRUE'); };
        FieldRadio.fromJson = function(options) { return new FieldRadio(options['checked'] || options['value'] || 'FALSE'); };

        Blockly.FieldCheckbox = FieldCheckbox;
        Blockly.FieldRadio = FieldRadio;

        if (Blockly.Field && Blockly.Field.register) {
            Blockly.Field.register('field_checkbox', FieldCheckbox);
            Blockly.Field.register('field_radio', FieldRadio);
        } else if (Blockly.fieldRegistry && Blockly.fieldRegistry.register) {
            Blockly.fieldRegistry.register('field_checkbox', FieldCheckbox);
            Blockly.fieldRegistry.register('field_radio', FieldRadio);
        }
    }

    // ============================================================
    // 4. Proxy 无损切除引擎与 DOM 挂载
    // ============================================================
    function proxyBlocklyBlocksForCustomFields(runtime) {
        const Blockly = getScratchBlocks(runtime);
        if (!Blockly || !Blockly.Blocks) {
            setTimeout(() => proxyBlocklyBlocksForCustomFields(runtime), 50);
            return;
        }

        createCustomFields(Blockly);

        if (!window.__gandiCustomFieldsProxied) {
            Blockly.Blocks = new Proxy(Blockly.Blocks, {
                set(target, opcode, blockDefinition) {
                    if (Object.prototype.hasOwnProperty.call(customBlocksInfo, opcode)) {
                        patchBlockDefinition(Blockly, blockDefinition, customBlocksInfo[opcode]);
                    }
                    return Reflect.set(target, opcode, blockDefinition);
                },
            });
            window.__gandiCustomFieldsProxied = true;
        }
    }

    function patchBlockDefinition(Blockly, blockDefinition, argsInfo) {
        const origInit = blockDefinition.init;

        blockDefinition.init = function () {
            if (origInit) origInit.call(this);

            if (this._customFieldsPatched) return;
            this._customFieldsPatched = true;

            for (const argInfo of argsInfo) {
                const argName = argInfo.name;
                const targetInput = this.getInput(argName);

                if (targetInput) {
                    const inputIndex = this.inputList.indexOf(targetInput);
                    const savedFields = targetInput.fieldRow.slice();

                    if (targetInput.connection && targetInput.connection.targetBlock()) {
                        targetInput.connection.targetBlock().dispose();
                    }

                    this.removeInput(argName);
                    const newDummy = this.appendDummyInput(argName);

                    for (const field of savedFields) {
                        newDummy.appendField(field, field.name);
                    }

                    let customField;
                    if (argInfo.type === 'radio') {
                        customField = new Blockly.FieldRadio(argInfo.defaultValue);
                    } else {
                        customField = new Blockly.FieldCheckbox(argInfo.defaultValue);
                    }
                    customField.name = argName;
                    newDummy.appendField(customField, argName);

                    this.inputList.pop();
                    this.inputList.splice(inputIndex, 0, newDummy);
                }
            }
        };
    }

    // ============================================================
    // 5. 扩展初始化定义
    // ============================================================
    const customFieldsPatchSymbol = Symbol('customFieldsPatch');

    function initCustomFieldsBlocks(extension) {
        const runtime = (extension.runtime || Scratch.vm.runtime);
        proxyBlocklyBlocksForCustomFields(runtime);

        if (extension[customFieldsPatchSymbol]) return;
        extension[customFieldsPatchSymbol] = true;

        const origGetInfo = extension.getInfo;
        extension.getInfo = function () {
            proxyBlocklyBlocksForCustomFields(runtime);

            const info = origGetInfo.call(this);
            const { id, blocks: blocksInfo } = info;

            blocksInfo.forEach((block) => {
                if (!block.arguments) return;
                const parsedArgs = [];

                for (const [argName, argDef] of Object.entries(block.arguments)) {
                    if (argDef.type === 'checkbox' || argDef.type === 'radio') {
                        parsedArgs.push({
                            name: argName,
                            type: argDef.type, 
                            defaultValue: String(argDef.defaultValue) === 'true'
                        });

                        argDef.type = Scratch.ArgumentType.BOOLEAN;
                        delete argDef.menu;
                    }
                }

                if (parsedArgs.length > 0) {
                    const opcode = `${id}_${block.opcode}`;
                    customBlocksInfo[opcode] = parsedArgs;
                }
            });

            return info;
        };
    }

    function getBoolValue(args, argName) {
        return String(args[argName]) === 'true' || String(args[argName]) === 'TRUE';
    }

    // ============================================================
    // 6. UI 演示扩展类
    // ============================================================
    class CheckboxBlocksExtension {
        constructor() {
            initCustomFieldsBlocks(this);
        }

        getInfo() {
            return {
                id: 'checkboxBlocks',
                name: '复选框积木',
                color1: '#E65662',
                color2: '#D64652',
                blocks: [
                    {
                        opcode: 'checkboxDemo',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '复选开关 [C1]',
                        arguments: {
                            C1: { type: 'checkbox', defaultValue: true }
                        },
                    },
                    {
                        opcode: 'radioDemo',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '单选模式：选项A [R1]  选项B [R2]  选项C [R3]',
                        arguments: {
                            R1: { type: 'radio', defaultValue: true },
                            R2: { type: 'radio', defaultValue: false },
                            R3: { type: 'radio', defaultValue: false }
                        },
                    },
                    {
                        opcode: 'quadrilateralDeduction',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '当平行四边形 [C1] 对角线相等 [C2] 对角线互相垂直 时，是',
                        arguments: {
                            C1: { type: 'checkbox', defaultValue: false },
                            C2: { type: 'checkbox', defaultValue: false },
                        },
                    }
                ]
            };
        }

        checkboxDemo(args) { 
            return getBoolValue(args, 'C1') ? '已开启' : '已关闭'; 
        }
        
        radioDemo(args) {
            if (getBoolValue(args, 'R1')) return '当前选择: A';
            if (getBoolValue(args, 'R2')) return '当前选择: B';
            if (getBoolValue(args, 'R3')) return '当前选择: C';
            return '未选择';
        }

        quadrilateralDeduction(args) {
            const diagonalsEqual = getBoolValue(args, 'C1');
            const diagonalsPerpendicular = getBoolValue(args, 'C2');

            if (diagonalsEqual && diagonalsPerpendicular) {
                return '正方形';
            }
            if (diagonalsEqual) {
                return '矩形';
            }
            if (diagonalsPerpendicular) {
                return '菱形';
            }
            return '平行四边形';
        }
    }

    Scratch.extensions.register(new CheckboxBlocksExtension());
})();