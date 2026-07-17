(function(){
    function getReduxStoreFromDOM() {
        const internalRoots = Array.from(document.querySelectorAll('*')).map(el => {
            const key = Object.keys(el).filter(keyName => keyName.includes('__reactContainer')).at(-1);
            return el[key];
        }).filter(key => key);

        for (const root of internalRoots) {
            const seen = new Map();
            const stores = new Set();

            const search = obj => {
                if (seen.has(obj)) {
                    return;
                }
                seen.set(obj, true);

                for (const name in obj) {
                    if (name === 'getState') {
                        const store = obj;
                        const state = store.getState();
                        if (state?.scratchGui?.vm && state.scratchPaint && state.locales) {
                            return store; // Found target store
                        }
                        stores.add(obj);
                    }

                    // eslint-disable-next-line no-prototype-builtins
                    if ((obj?.hasOwnProperty?.(name)) && (typeof obj[name] === 'object') && (obj[name] !== null)) {
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
    const vm=getReduxStoreFromDOM()?.getState()?.scratchGui?.vm;
    if(!vm) alert("èŽ·å–vmå¤±è´¥");
    const runtime=vm.runtime;
    let obj={
        getNumber(id){
            return runtime.ext_GandiEconomy.apis.getSmartContractAccountByContractId(id);
        },
        getAllcontract(){
            return runtime.ext_GandiEconomy.apis.getSmartContractList();
        },
        async count(){
            let count=0;
            for(let contract of await this.getAllcontract()){
                count+=await this.getNumber(contract.id);
            }
            return count;
        },
        async allCoins(number=Infinity){
            let count=0;
            const all=await this.getAllcontract();
            console.log("æ‰€æœ‰åˆçº¦", all);
            for(let contract of all){
                const n=Math.min(await this.getNumber(contract.id), number);
                const result=await coin(n, contract);
                console.log(result, contract, n);
                if(result=="å‘æ”¾æˆåŠŸ"){
                    count+=n;
                    number-=n;
                }
            }
            return count;
        },
        getRule(contract){
            return contract.rules.find(rule=>rule.rule.code==="award");
        },
        /*
        async aaaaa(){
            for(let contract of await this.getAllcontract()){
                for(let rule of contract.rules){
                    rule.rule.code="award";
                }
            }
        }
        */
    };
    const _execEconomyContract=runtime._primitives.GandiEconomy_execEconomyContract;
    runtime._primitives.GandiEconomy_execEconomyContract=function(args, util){
        const {code}=args.mutation.blockInfo.extra; // donateä»£è¡¨çŽ©å®¶å‘åˆçº¦æŠ•å¸ï¼Œawardä»£è¡¨åˆçº¦å‘çŽ©å®¶æŠ•å¸
        if(code=="donate") return Promise.resolve(true);
        return _execEconomyContract.call(this, args, util);
    }
    function coin(
        bucks, // é‡‘å¸æ•°é‡
        contract, // åˆçº¦
        ruleId,
    ){
        ruleId=ruleId ?? obj.getRule(contract).id;
        /*
        return runtime._primitives.GandiEconomy_execEconomyContract({
            bucks,
            mutation: {
                blockInfo: {
                    extra: {
                        code: "award", // awardä»£è¡¨åˆçº¦å‘çŽ©å®¶æŠ•å¸
                        contractId,
                    }
                }
            }
        });
        */
       return runtime.ext_GandiEconomy.apis.requestExecuteSmartContract(
           contract.id,
           ruleId,
           "award", // awardä»£è¡¨åˆçº¦å‘çŽ©å®¶æŠ•å¸
           {
               bucks,
           },
       ) 
    }
    Object.assign(obj, {coin});
    if(!runtime.ext_GandiEconomy) alert("å½“å‰ä½œå“æ²¡æœ‰ç”¨ç»æµŽåˆçº¦");
    else{
        obj.count().then(count=>alert(`å…±æœ‰${count}å¸ï¼Œæ­£åœ¨å°è¯•å–å¸`));
        obj.allCoins().then(count=>alert(`æˆåŠŸå–å‡º${count}å¸`));
    }
})();