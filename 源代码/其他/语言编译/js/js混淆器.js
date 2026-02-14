const require = async (url) => {
	const body = await (Scratch.fetch??fetch)(url);
	const func = await body.text();
	new Function(func)();
	return func;
};
let buttontext=typeof JavaScriptObfuscator=='undefined'?'加载混淆器':'加载成功';
let button2text='更新混淆器';
const default_setting={'compact':!![],'controlFlowFlattening':!![],'controlFlowFlatteningThreshold':0x1,'numbersToExpressions':!![],'simplify':!![],'stringArrayShuffle':!![],'splitStrings':!![],'stringArrayThreshold':0x1};
function getsetting(args){
	let setting=new Object;
	Object.keys(args).forEach((e)=>{
		if(Object.keys(default_setting).includes(e)){
			setting[e]=(
				typeof default_setting[e]=="boolean"?
				Scratch.Cast.toBoolean(args[e]):
				clamp(Scratch.Cast.toNumber(args[e]),0,1)
			);
		}
	});
	return setting;
}
const clamp=(n, min, max) => Math.min(Math.max(n, min), max);

window.javascript_obfuscator=class {
	constructor(runtime){
		this.runtime = runtime;
		runtime.on("PROJECT_LOADED", () => {
			const storage = runtime.extensionStorage.javascriptobfuscator;
			if (storage === undefined) return;
			new Function(storage)();
			buttontext='加载成功';
			this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
		});
	}
	getInfo() {
		return {
			id: 'javascriptobfuscator',
			name: 'JavaScript混淆器',
			color1: '#bdbdbd',
			docsURI: 'https://assets.ccw.site/extension/javascriptobfuscator',
			blockIconURI: "",
			blocks:[
				{
					func: '加载',
					blockType: Scratch.BlockType.BUTTON,
					text: buttontext,
				},
				{
					func: '更新',
					blockType: Scratch.BlockType.BUTTON,
					text: button2text,
				},
				{
					func: '打开在线版',
					blockType: Scratch.BlockType.BUTTON,
					text: '打开在线版JavaScript混淆器（网页）',
				},
				{
					func: '加载',
					opcode: '加载',
					blockType: Scratch.BlockType.COMMAND,
					text: '加载混淆器',
					arguments: {},
				},
				{
					opcode: '混淆器版本',
					blockType: Scratch.BlockType.REPORTER,
				},
				{
					opcode: '混淆',
					blockType: Scratch.BlockType.REPORTER,
					text: '混淆[js]，并设置[setting]',
					arguments: {
						js: {
							type: Scratch.ArgumentType.STRING,
							defaultValue: "alert('弹窗')",
						},
						setting: {
							type: Scratch.ArgumentType.STRING,
							defaultValue: JSON.stringify(default_setting),
						},
					},
					// hideFromPalette: true,
				},
				{
					opcode: '混淆2',
					blockType: Scratch.BlockType.REPORTER,
					text: '混淆[js]，并设置'+this.gettext(),
					arguments: this.getarguments(),
				},
			],
			menus:{tf:[
				{
					text: "启用",
					value: "true"
				},
				{
					text: "禁用",
					value: "false"
				},
			]}
		};
	}
	async 加载(){
		try{
			if(buttontext=='加载混淆器'){
				buttontext='加载中';
				this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				const url='https://431658.github.io/javascript-obfuscator/index.browser.js';
				this.runtime.extensionStorage.javascriptobfuscator= await require(url);
				buttontext='加载成功';
				this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				alert("加载成功，版本： "+JavaScriptObfuscator.version);
			}
			else return "已加载";
		}catch(e){
			alert("加载失败 "+String(e));
			buttontext='加载混淆器';
			this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
		}
	}
	async 更新(){
		try{
			if(button2text=='更新混淆器'){
				button2text='更新中';
				this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				const url='https://431658.github.io/javascript-obfuscator/index.browser.js';
				this.runtime.extensionStorage.javascriptobfuscator= await require(url);
				button2text='更新混淆器';
				this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
				alert("更新成功，版本： "+JavaScriptObfuscator.version);
			}
		}catch(e){
			alert("更新失败 "+String(e));
			button2text='更新混淆器';
			this.runtime.emit("TOOLBOX_EXTENSIONS_NEED_UPDATE");
		}
	}
	打开在线版(){
		const url='https://431658.github.io/javascript-obfuscator/';
		window.open(url);
		return url;
	}
	混淆器版本(){
		if(typeof JavaScriptObfuscator=='undefined') return '';
		return JavaScriptObfuscator.version;
	}
	gettext(){
		let text=new String;
		Object.keys(default_setting).forEach((e)=>(
			text+=`${e}[${e}]`
		));
		return text;
	}
	getarguments(){
		let _arguments={
			js: {
				type: Scratch.ArgumentType.STRING,
				defaultValue: "alert('弹窗')",
			},
		};
		Object.keys(default_setting).forEach((e)=>(
			_arguments[e]=(
				typeof default_setting[e]=="boolean"?
				{type: Scratch.ArgumentType.BOOLEAN,defaultValue: default_setting[e],menu:"tf"}:
				{type: Scratch.ArgumentType.NUMBER,defaultValue: default_setting[e]}
			)
		));
		return _arguments;
	}
};

function _0x44fe(){var _0x570e9f=['225996DfcNIw','obfuscate','prototype','1859540YVcbxB','2169084yNzNWz','setting','cHwvz','ASyLm','ixHrf','wsqkL','FzcqI','parse','混淆2','lfQEm','undefined','1342320TGwXfu','混淆发生错误\x20','487558CIqpum','GEZBR','zIwfL','mqtfH','pJXDJ','4840840kWAzVD','FoUCq','3FDKlqF','CxpYY','760108leYSad','self','javascript','混淆器未加载','_obfuscato'];_0x44fe=function(){return _0x570e9f;};return _0x44fe();}var _0x7ef307=_0x2737;function _0x2737(_0x1d6dd5,_0x585a0e){var _0x45bcca=_0x44fe();return _0x2737=function(_0x10abf3,_0x889152){_0x10abf3=_0x10abf3-(-0xb*-0x31f+0x1*0x21b4+-0x429b);var _0x1ea70e=_0x45bcca[_0x10abf3];return _0x1ea70e;},_0x2737(_0x1d6dd5,_0x585a0e);}(function(_0x3acc01,_0x4c90ea){var _0x17f4da=_0x2737,_0x29813f=_0x3acc01();while(!![]){try{var _0x1d2dae=parseInt(_0x17f4da(0x17e))/(0x112f+0xb15+-0x1c43*0x1)+parseInt(_0x17f4da(0x170))/(0x2*0xef9+-0x6*-0x12b+-0x24f2)+-parseInt(_0x17f4da(0x177))/(-0x7*-0x283+-0xb*0x19f+-0x1*-0x43)*(-parseInt(_0x17f4da(0x179))/(-0x590*0x1+-0x1435+0x19c9*0x1))+parseInt(_0x17f4da(0x181))/(-0x58d+-0x68d*0x1+0xc1f)+-parseInt(_0x17f4da(0x182))/(-0x1*-0x1d79+0x228a+-0x3ffd*0x1)+parseInt(_0x17f4da(0x16e))/(-0xd1+0x2429*-0x1+0x1*0x2501)+-parseInt(_0x17f4da(0x175))/(-0x7a*0x3b+0x268b+-0xa65);if(_0x1d2dae===_0x4c90ea)break;else _0x29813f['push'](_0x29813f['shift']());}catch(_0x1990b4){_0x29813f['push'](_0x29813f['shift']());}}}(_0x44fe,-0x3a499+0x2*-0x13d8d+0xe*0xb7a5),window[_0x7ef307(0x17a)][_0x7ef307(0x17b)+_0x7ef307(0x17d)+'r'][_0x7ef307(0x180)]['混淆']=_0x492ce4=>{var _0x368ad8=_0x7ef307,_0x2d857c={'mqtfH':function(_0x162437,_0x538673){return _0x162437==_0x538673;},'CxpYY':_0x368ad8(0x18c),'wsqkL':_0x368ad8(0x17c),'pJXDJ':function(_0x499504,_0x2ace12){return _0x499504(_0x2ace12);},'zIwfL':function(_0x12aa89,_0xd6d44c){return _0x12aa89+_0xd6d44c;},'ASyLm':_0x368ad8(0x16f)};if(_0x2d857c[_0x368ad8(0x173)](typeof JavaScriptObfuscator,_0x2d857c[_0x368ad8(0x178)]))return _0x2d857c[_0x368ad8(0x187)];try{return JavaScriptObfuscator[_0x368ad8(0x17f)](_0x2d857c[_0x368ad8(0x174)](String,_0x492ce4['js']),JSON[_0x368ad8(0x189)](_0x492ce4[_0x368ad8(0x183)]));}catch(_0x4120a8){return _0x2d857c[_0x368ad8(0x172)](_0x2d857c[_0x368ad8(0x185)],_0x2d857c[_0x368ad8(0x174)](String,_0x4120a8));}},window[_0x7ef307(0x17a)][_0x7ef307(0x17b)+_0x7ef307(0x17d)+'r'][_0x7ef307(0x180)][_0x7ef307(0x18a)]=_0x5b4da8=>{var _0x457e30=_0x7ef307,_0x4ebfba={'ixHrf':function(_0x1d66d5,_0x26d18c){return _0x1d66d5==_0x26d18c;},'GEZBR':_0x457e30(0x18c),'FzcqI':_0x457e30(0x17c),'FoUCq':function(_0x294007,_0x5833aa){return _0x294007(_0x5833aa);},'cHwvz':function(_0x36e84f,_0x41e4f5){return _0x36e84f+_0x41e4f5;},'lfQEm':_0x457e30(0x16f)};if(_0x4ebfba[_0x457e30(0x186)](typeof JavaScriptObfuscator,_0x4ebfba[_0x457e30(0x171)]))return _0x4ebfba[_0x457e30(0x188)];try{return JavaScriptObfuscator[_0x457e30(0x17f)](_0x4ebfba[_0x457e30(0x176)](String,_0x5b4da8['js']),_0x4ebfba[_0x457e30(0x176)](getsetting,_0x5b4da8));}catch(_0x4d0179){return _0x4ebfba[_0x457e30(0x184)](_0x4ebfba[_0x457e30(0x18b)],_0x4ebfba[_0x457e30(0x176)](String,_0x4d0179));}});

if(Scratch?.vm?.runtime)Scratch.extensions.register(new javascript_obfuscator(Scratch.vm.runtime));
else window.tempExt = {
	Extension: javascript_obfuscator,
	info: {
		name: "JavaScript混淆器",
        extensionId: 'javascriptobfuscator',
        featured: true,
        disabled: false,
    },
};