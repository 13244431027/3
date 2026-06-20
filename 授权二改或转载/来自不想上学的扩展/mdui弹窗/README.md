<div class="flex flex-row h-full overflow-scroll"><div class="style_pureViewer__psVDn"><div><div class="toastui-editor-contents" style="overflow-wrap: break-word;"><div data-nodeid="93"><h1 style="font-size:30px; color:#6b7fd5; text-shadow: 0.5px 0.5px #BAE6EFFF, 1px 1px #BAE6EFC8, 1.5px 1.5px #BAE6EF96, 2px 2px #BAE6EF50, 2.5px 2.5px #BAE6EF32;">mdui弹窗</h1>
<p style="box-shadow: rgb(0, 100, 255) 3px 0.3rem 0.5rem; padding: 15px; border: 4px solid rgb(0, 150, 255); border-radius: 14px; text-align: center;">
这是一个名为 <strong>mdui弹窗</strong> 的 Gandi 社区扩展，该扩展的主要功能是为 Gandi 编程环境增添多种类型的弹窗交互功能，使用户可以在 Gandi 项目里方便地创建和使用不同样式与用途的弹窗，例如提示弹窗(alert)、确认弹窗(confirm)、输入弹窗(prompt)、自定义html弹窗等，并且能够获取这些弹窗的返回值，支持自定义样式，增强项目的交互性和用户体验。
</p><p></p></div>
<p data-nodeid="94"><span style="font-size:25px;color:#ffff00;">使用前需要先加载<a style="color:#007bff;" href="https://www.mdui.org">mdui库</a></span></p>
<ol data-nodeid="95">
<li data-nodeid="96">
<p data-nodeid="97">点击 <strong>加载mdui</strong> 等待加载完成</p>
</li>
<li data-nodeid="98">
<p data-nodeid="99">加载完成后mdui库会保存到项目中，加载此项目时mdui会自动加载</p>
</li>
<li data-nodeid="100">
<p data-nodeid="101">加载完成后就可以使用了</p>
</li>
</ol>
<p data-nodeid="102"><span style="font-size:15px;color:#00ff10;">源码中的mdui已经加载完成，可直接使用</span><br>
<span style="font-size:25px;color:#ff5000;">注意</span><br>
移动设备在非编译模式下，点击扩展中的返回值块可能<strong>无法显示返回值</strong>（TurboWarp可以正常显示），但是返回值是存在的，只是看不到，将值赋值给变量并点击变量就能查看返回值。<br>
<span style="font-size:20px;color:#00ff10;">选择框格式</span><br>
<span style="font-size:17.5px;">以英文逗号分割</span></p>
<pre data-nodeid="103"><code>a,b,c
</code></pre>
<p data-nodeid="104">每个选项以英文分号分割，分别代表显示的文本，实际值（如果不写默认为显示的文本），选项禁用（填（true，false，0，1），仅选择框2.0可用，如果不写默认为不禁用）</p>
<pre data-nodeid="105"><code>a;a,b;1;true,c;true
</code></pre>
<p data-nodeid="106"><span style="font-size:17.5px;"><a style="color:#007bff;" href="https://assets.ccw.site/extension/SPjson">JSON</a>格式</span></p>
<pre data-nodeid="107" class="lang-json"><code data-language="json">["a","b","c"]
</code></pre>
<p data-nodeid="108">每个选项的text代表显示的文本，value代表实际值，disabled代表选项禁用</p>
<pre data-nodeid="109" class="lang-json"><code data-language="json">[{"text": "a", "value": "a"}, {"text": "b", "value": 1, disabled: true}, {"text": "c", "value":true}]
</code></pre>
<p data-nodeid="110">选择框2.0中"---"是分割线，分割线在ccw中无法正常显示，TurboWarp可以正常显示<br>
<span style="font-size:20px;color:#0082ff;">样式</span><br>
推荐样式：<br>
<img data-nodeid="168" alt="" src="https://gp0.saobby.com/i/8RlmcknFnTK4SXHM.svg"><br>
可以将积木图片拖到编辑器或从</p>
<pre data-nodeid="111" class="lang-json"><code data-language="json">{"panel":{"background":"linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.7),rgba(245,245,255,0.6))","backdropFilter":"blur(10px)"},"overlay":{"backdropFilter":"blur(3px)"}}
</code></pre>
<p data-nodeid="112">导入样式即可<br>
注意：如果设置弹窗容器的背景过滤器，选择框2.0可能会出问题<br>
<span style="font-size:20px;color:#00ff10;">提示</span><br>
可以结合mdui扩展创建html，详细内容在<strong><a style="color:#007bff;" href="https://assets.ccw.site/extension/Element">这里</a></strong></p>














</div></div></div></div>