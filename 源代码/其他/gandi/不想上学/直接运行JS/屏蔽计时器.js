window.blockList = ["event_whengreaterthan"];
(async function () {
    function patch(obj, p, fn) {
        if (obj[p]) obj[p] = fn(obj[p]);
    }

    async function getVM() {
        if (document.readyState == "complete") {
            const vm = getReduxStoreFromDOM()?.getState()?.scratchGui?.vm;
            if (!vm) throw "鏃犳硶浠嶥OM鑾峰彇vm";
            return vm;
        } else {
            return await trapViaBind();
        }
    }
    function trapViaBind() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Timeout")), 15000);
            patch(Function.prototype, "bind", _bind => {
                return function (self2, ...args) {
                    if (
                        typeof self2 === "object" &&
                        self2 !== null &&
                        Object.prototype.hasOwnProperty.call(
                            self2,
                            "editingTarget"
                        ) &&
                        Object.prototype.hasOwnProperty.call(self2, "runtime")
                    ) {
                        Function.prototype.bind = _bind;
                        resolve(self2);
                        return _bind.call(this, self2, ...args);
                    }
                    return _bind.call(this, self2, ...args);
                };
            });
        });
    }
    function getReduxStoreFromDOM() {
        const internalRoots = Array.from(document.querySelectorAll("*"))
            .map(el => {
                const key = Object.keys(el)
                    .filter(keyName => keyName.includes("__reactContainer"))
                    .at(-1);
                return el[key];
            })
            .filter(key => key);

        for (const root of internalRoots) {
            const seen = new Map();
            const stores = new Set();

            const search = obj => {
                if (seen.has(obj)) {
                    return;
                }
                seen.set(obj, true);

                for (const name in obj) {
                    if (name === "getState") {
                        const store = obj;
                        const state = store.getState();
                        if (
                            state?.scratchGui?.vm &&
                            state.scratchPaint &&
                            state.locales
                        ) {
                            return store; // Found target store
                        }
                        stores.add(obj);
                    }

                    // eslint-disable-next-line no-prototype-builtins
                    if (
                        obj?.hasOwnProperty?.(name) &&
                        typeof obj[name] === "object" &&
                        obj[name] !== null
                    ) {
                        const result = search(obj[name]);
                        if (result) return result; // Propagate found store
                    }
                }
            };
            const result = search(root);
            if (result) return result;
        }
        return null;
    }
    const vm = await getVM(),
        runtime = vm.runtime;
    patch(
        runtime,
        "startHats",
        _startHats =>
            function (name) {
                if (blockList === true) return;
                else if (Array.isArray(blockList)) {
                    if (blockList.includes(name)) return;
                } else if (typeof blockList == "string") {
                    if (blockList == name) return;
                }
                return _startHats.apply(this, arguments);
            }
    );
})();