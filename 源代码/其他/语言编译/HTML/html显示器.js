(function (Scratch) {
	/** &typedef {string|number|boolean} SCarg 来自Scratch圆形框的参数，虽然这个框可能只能输入数字，但是可以放入变量，因此有可能获得数字、布尔和文本（极端情况下还有 null 或 undefined，需要同时处理 */

	const { ArgumentType, BlockType, TargetType, Cast, translate, extensions } = Scratch;
	const runtime=Scratch.vm?.runtime??Scratch.runtime;
	function hijack(fn) {
		const _orig = Function.prototype.apply;
		Function.prototype.apply = function (thisArg) {
			return thisArg;
		};
		const result = fn();
		Function.prototype.apply = _orig;
		return result;
	}
	function getBlockly(vm) {
		let Blockly;
		if (vm._events["EXTENSION_ADDED"] instanceof Array) {
			for (const value of vm._events["EXTENSION_ADDED"]) {
				const v = hijack(value);
				if (v?.ScratchBlocks) {
					Blockly = v?.ScratchBlocks;
					break;
				}
			}
		} else if (vm._events["EXTENSION_ADDED"]) {
			Blockly = hijack(vm._events["EXTENSION_ADDED"])?.ScratchBlocks;
		}
		return Blockly;
	}

	class HTML {
		constructor(html) {
			this.html = html.trim();
		}

		toString() {
			let html = document.createElement("div");
			html.innerHTML = this.html;
			return html.innerText;
		}

		getHTML() {
			let html = document.createElement("div");
			html.innerHTML = this.html;
			return html;
		}
	}

	let Wrapper = class _Wrapper extends String {
		/**
		 * Construct a wrapped value.
		 * @param value Value to wrap.
		 */
		constructor(value) {
			super(value);
			this.value = value;
		}
		/**
		 * Unwraps a wrapped object.
		 * @param value Wrapped object.
		 * @returns Unwrapped object.
		 */
		static unwrap(value) {
			return value instanceof _Wrapper ? value.value : value;
		}
		/**
		 * toString method for Scratch monitors.
		 * @returns String display.
		 */
		toString() {
			return String(this.value);
		}
	};

	function show(Blockly, id, value, textAlign) {
		const workspace = Blockly.getMainWorkspace();
		const block = workspace.getBlockById(id);
		if (!block)
			return;
		Blockly.DropDownDiv.hideWithoutAnimation();
		Blockly.DropDownDiv.clearContent();
		const contentDiv = Blockly.DropDownDiv.getContentDiv(), elem = document.createElement("div");
		elem.setAttribute("class", "valueReportBox");
		elem.append(...value);
		elem.style.maxWidth = "none";
		elem.style.maxHeight = "none";
		elem.style.textAlign = textAlign;
		elem.style.userSelect = "none";
		contentDiv.appendChild(elem);
		Blockly.DropDownDiv.setColour(
			Blockly.Colours.valueReportBackground,
			Blockly.Colours.valueReportBorder
		);
		Blockly.DropDownDiv.showPositionedByBlock(
			workspace,
			block
		);
		return elem;
	}

	class customizeHtmlReport {
		constructor(runtime) {
			this.runtime = runtime;

			this.Blockly = void 0;
			this.vm = runtime.extensionManager.vm;
			this.Blockly = getBlockly(this.vm);
			if (!this.Blockly)
				this.vm.once("workspaceUpdate", () => {
					const newBlockly = getBlockly(this.vm);
					if (newBlockly && newBlockly !== this.Blockly) {
						this.Blockly = newBlockly;
					}
				});

			const _visualReport = runtime.visualReport;
			runtime.visualReport = (blockId, value) => {
				const unwrappedValue = Wrapper.unwrap(value);
				if ((unwrappedValue instanceof HTML) && this.Blockly) {
					show(
						this.Blockly,
						blockId,
						[unwrappedValue.getHTML()],
						"center"
					);
				} else {
					return _visualReport.call(runtime, blockId, value);
				}
			};
			const _requestUpdateMonitor = runtime.requestUpdateMonitor;
			const monitorMap = /* @__PURE__ */ new Map();
			if (_requestUpdateMonitor) {
				const patchMonitorValue = (element, value) => {
					const unwrappedValue = Wrapper.unwrap(value);
					const valueElement = element.querySelector('[class*="value"]');
					if (valueElement instanceof HTMLElement) {
						const internalInstance = Object.values(valueElement).find(
							(v) => typeof v === "object" && v !== null && Reflect.has(v, "stateNode")
						);
						if (unwrappedValue instanceof HTML) {
							const inspector = unwrappedValue.getHTML();
							valueElement.style.textAlign = "left";
							valueElement.style.backgroundColor = "rgb(30, 30, 30)";
							valueElement.style.color = "#eeeeee";
							while (valueElement.firstChild)
								valueElement.removeChild(valueElement.firstChild);
							valueElement.append(inspector);
						} else {
							if (internalInstance) {
								valueElement.style.textAlign = "";
								valueElement.style.backgroundColor = internalInstance.memoizedProps?.style?.background ?? "";
								valueElement.style.color = internalInstance.memoizedProps?.style?.color ?? "";
								while (valueElement.firstChild)
									valueElement.removeChild(valueElement.firstChild);
								valueElement.append(String(value));
							}
						}
					}
				};
				const getMonitorById = (id2) => {
					const elements = document.querySelectorAll(
						`[class*="monitor_monitor-container"]`
					);
					for (const element of Object.values(elements)) {
						const internalInstance = Object.values(element).find(
							(v) => typeof v === "object" && v !== null && Reflect.has(v, "children")
						);
						if (internalInstance) {
							const props = internalInstance?.children?.props;
							if (id2 === props?.id) return element;
						}
					}
					return null;
				};
				this.runtime.requestUpdateMonitor = (state) => {
					const id2 = state.get("id");
					if (typeof id2 === "string") {
						const monitorValue = state.get("value");
						const unwrappedValue = Wrapper.unwrap(monitorValue);
						const monitorMode = state.get("mode");
						const monitorVisible = state.get("visible");
						const cache = monitorMap.get(id2);
						if (typeof monitorMode === "string" && cache) {
							cache.mode = monitorMode;
							cache.value = void 0;
						} else if (monitorValue !== void 0) {
							if (unwrappedValue instanceof HTML) {
								if (!cache || cache.value !== monitorValue) {
									requestAnimationFrame(() => {
										const monitor = getMonitorById(id2);
										if (monitor) {
											patchMonitorValue(monitor, monitorValue);
										}
									});
									if (!cache) {
										monitorMap.set(id2, {
											value: monitorValue,
											mode: (() => {
												if (runtime.getMonitorState) {
													const monitorCached = runtime.getMonitorState().get(id2);
													if (monitorCached) {
														const mode = monitorCached.get("mode");
														return typeof mode === "string" ? mode : "normal";
													}
												}
												return "normal";
											})()
										});
									} else cache.value = monitorValue;
								}
								return true;
							} else {
								if (monitorMap.has(id2)) {
									const monitor = getMonitorById(id2);
									if (monitor) {
										patchMonitorValue(monitor, monitorValue);
									}
									monitorMap.delete(id2);
								}
							}
						} else if (monitorVisible !== void 0) {
							if (!monitorVisible) monitorMap.delete(id2);
						}
					}
					return _requestUpdateMonitor.call(this.runtime, state);
				};
			}
		}
		getInfo() {
			return {
				id: 'customizeHtmlReport', // 拓展id
				name: '实现自定义html返回值显示', // 拓展名
				color1: '#7F82BB',
				color2: '#7F82BB',
				color3: '#E0AA54',
				blocks: [
					{
						opcode: "html",
						blockType: BlockType.REPORTER,
						text: "显示 [html]",
						arguments: {
							html: {
								type: ArgumentType.STRING,
								defaultValue: `可以显示自定义<strong>html</strong>，比如<color style="color:#ff2e00">彩</color><color style="color:#007bff">色</color>的字，<a href="https://assets.ccw.site/extension/customizeHtmlReport" target="_blank"><color style="color:#007bff">超链接</color></a>，甚至是<button style="background-color:#007bff" onclick="alert('点击了按钮')">按钮</button>`,
							},
						},
					},
				],
			};
		}
		html({ html }) {
			return new Wrapper(new HTML(Cast.toString(html)));
		}
	}
	extensions.register(new customizeHtmlReport(runtime));
	window.tempExt = {
		Extension: customizeHtmlReport,
		info: {
			name: "实现自定义html返回值显示",
	        extensionId: 'customizeHtmlReport',
	        featured: true,
	        disabled: false,
	    },
	};
}(Scratch));