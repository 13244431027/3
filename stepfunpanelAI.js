// StepFun Debug Panel v3 – 适配真实流式格式（thinking + text）
(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('StepFun Panel v3 需要 Unsandboxed 模式');
  }

  class StepFunPanelV3 {
    constructor() {
      this.panel = null;
      this.lastResponse = '';
      this.lastText = '';
      this.lastThink = '';
      this.thinkBuffer = '';
      this.textBuffer = '';
    }

    getInfo() {
      return {
        id: 'stepfunpanel',
        name: 'StepFun 调试面板 ',
        color1: '#0e7490',
        color2: '#164e63',
        color3: '#164e63',
        blocks: [
          { opcode: 'showPanel',   blockType: Scratch.BlockType.COMMAND, text: '显示调试面板 v3' },
          { opcode: 'hidePanel',   blockType: Scratch.BlockType.COMMAND, text: '隐藏调试面板 v3' },
          {
            opcode: 'setApiKey',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置 API Key [KEY]',
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'sk-xxxx' } }
          },
          {
            opcode: 'setModel',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置模型 [MODEL]',
            arguments: { MODEL: { type: Scratch.ArgumentType.STRING, defaultValue: 'step-3.5-flash' } }
          },
          {
            opcode: 'ask',
            blockType: Scratch.BlockType.REPORTER,
            text: '询问 StepFun [TEXT]',
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '请用中文介绍你自己。' } }
          },
          { opcode: 'getLastText',   blockType: Scratch.BlockType.REPORTER, text: '上次回复文本' },
          { opcode: 'getLastThink',  blockType: Scratch.BlockType.REPORTER, text: '上次思考内容 think' },
          { opcode: 'getLastResponse', blockType: Scratch.BlockType.REPORTER, text: '上次完整响应 JSON' }
        ]
      };
    }

    // ---------- 面板 DOM ----------
    createPanel() {
      if (document.getElementById('sf-panel-v3')) return;
      const p = document.createElement('div');
      p.id = 'sf-panel-v3';
      Object.assign(p.style, {
        position:'fixed', right:'16px', top:'16px', width:'500px', maxHeight:'95vh',
        overflow:'auto', zIndex:'999999', background:'#0f172a', color:'#e2e8f0',
        border:'1px solid #334155', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)',
        fontFamily:'system-ui, sans-serif', fontSize:'13px', padding:'16px'
      });
      p.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:18px;font-weight:bold;">StepFun 调试 v3</span>
          <button id="sfv3-close" style="${btn('#475569')}">隐藏</button>
        </div>

        <label class="sf-label">API Key</label>
        <input id="sfv3-key" type="password" placeholder="sk-..." style="${inp()}" />

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <label class="sf-label">通道</label>
            <select id="sfv3-channel" style="${inp()}">
              <option value="normal">普通 /v1/messages</option>
              <option value="step_plan">Step Plan /step_plan/v1/messages</option>
            </select>
          </div>
          <div>
            <label class="sf-label">模型</label>
            <input id="sfv3-model" value="step-3.5-flash" style="${inp()}" />
          </div>
        </div>

        <label class="sf-label">System</label>
        <textarea id="sfv3-system" rows="2" style="${ta()}">你是阶跃星辰AI助手，擅长中文、英文及多种语言。</textarea>

        <label class="sf-label">用户消息（中文）</label>
        <textarea id="sfv3-msg" rows="3" style="${ta()}">请用中文介绍你自己。</textarea>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
          <div>
            <label class="sf-label">max_tokens</label>
            <input id="sfv3-maxtokens" type="number" value="1024" min="1" style="${inp()}" />
          </div>
          <div>
            <label class="sf-label">temperature</label>
            <input id="sfv3-temp" type="number" placeholder="可空" min="0" max="2" step="0.1" style="${inp()}" />
          </div>
          <div>
            <label class="sf-label">effort</label>
            <select id="sfv3-effort" style="${inp()}">
              <option value="">不设置</option>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
        </div>

        <label style="display:flex;align-items:center;gap:6px;margin:10px 0;">
          <input id="sfv3-stream" type="checkbox" checked />
          流式响应 (推荐，实时显示 think)
        </label>

        <div style="display:flex;gap:8px;">
          <button id="sfv3-send" style="${btn('#3b82f6')}">发送请求</button>
          <button id="sfv3-clear" style="${btn('#6b7280')}">清空输出</button>
          <button id="sfv3-copy" style="${btn('#059669')}">复制 JSON</button>
        </div>

        <div style="margin-top:10px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-weight:bold;color:#facc15;">思考内容 (think)</span>
            <span style="font-size:12px;color:#94a3b8;" id="sfv3-think-status">等待</span>
          </div>
          <pre id="sfv3-think-out" style="${pre()} background:#1e293b; color:#fde047; min-height:60px;">（thinking 将显示在这里）</pre>
        </div>

        <div style="margin-top:8px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-weight:bold;color:#22d3ee;">中文文本输出</span>
            <span style="font-size:12px;color:#94a3b8;" id="sfv3-text-status">等待</span>
          </div>
          <pre id="sfv3-text-out" style="${pre()} background:#1e293b; color:#e2e8f0; min-height:80px;">（文本将显示在这里）</pre>
        </div>

        <div style="margin-top:8px;">
          <span style="font-weight:bold;color:#94a3b8;">完整事件 JSON</span>
          <pre id="sfv3-json-out" style="${pre()} background:#0c4a6e; min-height:100px;">等待请求...</pre>
        </div>
      `;
      document.body.appendChild(p);
      this.panel = p;

      const $ = id => document.getElementById(id);
      $('sfv3-close').onclick = () => this.hidePanel();
      $('sfv3-clear').onclick = () => {
        $('sfv3-think-out').textContent = '';
        $('sfv3-text-out').textContent = '';
        $('sfv3-json-out').textContent = '';
        $('sfv3-think-status').textContent = '';
        $('sfv3-text-status').textContent = '';
      };
      $('sfv3-copy').onclick = async () => {
        const t = $('sfv3-json-out').textContent;
        try { await navigator.clipboard.writeText(t); } catch(e) { alert('复制失败'); }
      };
      $('sfv3-send').onclick = () => this.sendRequest();
      $('sfv3-channel').onchange = () => this.updateEndpoint();
    }

    showPanel() { this.createPanel(); this.panel.style.display = 'block'; }
    hidePanel() { if (this.panel) this.panel.style.display = 'none'; }
    setApiKey(args) {
      const el = document.getElementById('sfv3-key');
      if (el) el.value = args.KEY || '';
    }
    setModel(args) {
      const el = document.getElementById('sfv3-model');
      if (el) el.value = args.MODEL || '';
    }

    getEndpoint() {
      const ch = document.getElementById('sfv3-channel')?.value || 'normal';
      return ch === 'step_plan'
        ? 'https://api.stepfun.com/step_plan/v1/messages'
        : 'https://api.stepfun.com/v1/messages';
    }
    updateEndpoint() { /* optional */ }

    // ---------- 收集面板值 ----------
    collect() {
      const $ = id => document.getElementById(id);
      const key = $('sfv3-key').value.trim();
      const model = $('sfv3-model').value.trim();
      const system = $('sfv3-system').value;
      const msg = $('sfv3-msg').value;
      const maxTokens = Number($('sfv3-maxtokens').value || 1024);
      const tempRaw = $('sfv3-temp').value;
      const effort = $('sfv3-effort').value;
      const stream = $('sfv3-stream').checked;

      const body = { model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: msg }] };
      if (tempRaw) body.temperature = Number(tempRaw);
      if (effort) body.output_config = { effort };
      if (stream) body.stream = true;

      return { key, body, stream };
    }

    // ---------- 主请求 ----------
    async sendRequest() {
      const { key, body, stream } = this.collect();
      if (!key) { this.setJson('请填写 API Key'); return; }
      if (!body.model) { this.setJson('请填写模型'); return; }

      const endpoint = this.getEndpoint();
      this.setJson(`请求中...\nPOST ${endpoint}`);

      this.thinkBuffer = '';
      this.textBuffer = '';
      this.lastThink = '';
      this.lastText = '';

      this.setThink('等待 think...');
      this.setText('等待文本...');
      document.getElementById('sfv3-think-status').textContent = '接收中';
      document.getElementById('sfv3-text-status').textContent = '接收中';

      try {
        if (stream) await this.doStream(endpoint, key, body);
        else await this.doNormal(endpoint, key, body);
      } catch (err) {
        this.setJson('请求失败：' + err);
        this.setThink('错误');
        this.setText('错误');
      }

      document.getElementById('sfv3-think-status').textContent = '完成';
      document.getElementById('sfv3-text-status').textContent = '完成';
    }

    // ---------- 普通请求 ----------
    async doNormal(endpoint, key, body) {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const raw = await resp.text();
      let data;
      try { data = JSON.parse(raw); } catch { data = raw; }

      this.lastResponse = JSON.stringify(data, null, 2);

      // 提取 think & text
      let think = '';
      let text = '';

      if (typeof data === 'object' && data !== null) {
        // 方式1: reasoning_content 字段
        if (data.reasoning_content) think = data.reasoning_content;
        // 方式2: content 数组
        if (Array.isArray(data.content)) {
          for (const block of data.content) {
            if (block.type === 'thinking' || block.type === 'reasoning') {
              think += block.text || block.thinking || '';
            } else if (block.type === 'text') {
              text += block.text || '';
            }
          }
        } else if (typeof data.content === 'string') {
          text = data.content;
        }
      }

      this.lastThink = think;
      this.lastText = text;
      this.setThink(think || '（无 think）');
      this.setText(text || '（无文本）');
      this.setJson(this.lastResponse);
    }

    // ---------- 流式请求（适配真实格式） ----------
    async doStream(endpoint, key, body) {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const errText = await resp.text();
        this.setJson(`HTTP ${resp.status}\n${errText}`);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let events = [];

      // 标记当前正在处理的 content_block 类型（'thinking' 或 'text'）
      let currentBlockType = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          let eventType = '';
          let dataStr = '';

          for (const line of lines) {
            if (line.startsWith('event:')) eventType = line.slice(6).trim();
            else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
          }

          if (!dataStr) continue;

          let json;
          try { json = JSON.parse(dataStr); } catch { json = dataStr; }
          events.push({ event: eventType, data: json });

          // 处理 content_block_start
          if (json && json.type === 'content_block_start') {
            const block = json.content_block;
            if (block && block.type === 'thinking') {
              currentBlockType = 'thinking';
              // 可能携带初始 thinking 内容
              if (block.thinking) {
                this.thinkBuffer += block.thinking;
                this.setThink(this.thinkBuffer);
              }
            } else if (block && block.type === 'text') {
              currentBlockType = 'text';
              if (block.text) {
                this.textBuffer += block.text;
                this.setText(this.textBuffer);
              }
            }
          }

          // 处理 content_block_delta
          if (json && json.type === 'content_block_delta') {
            const delta = json.delta;
            if (!delta) continue;

            // thinking_delta
            if (delta.type === 'thinking_delta' && delta.thinking !== undefined) {
              this.thinkBuffer += delta.thinking;
              this.setThink(this.thinkBuffer);
            }
            // text_delta
            else if (delta.type === 'text_delta' && delta.text !== undefined) {
              this.textBuffer += delta.text;
              this.setText(this.textBuffer);
            }
            // signature_delta – 忽略
            else if (delta.type === 'signature_delta') {
              // 无需处理
            }
          }

          // 处理 content_block_stop – 重置当前块类型
          if (json && json.type === 'content_block_stop') {
            currentBlockType = null;
          }
        }
      }

      // 流结束
      this.lastThink = this.thinkBuffer;
      this.lastText = this.textBuffer;
      this.lastResponse = JSON.stringify(events, null, 2);
      this.setJson(this.lastResponse);

      if (!this.thinkBuffer) this.setThink('（未收到 thinking）');
      if (!this.textBuffer) this.setText('（未收到文本）');
    }

    // ---------- UI 辅助 ----------
    setThink(t) { const el = document.getElementById('sfv3-think-out'); if (el) el.textContent = t || ''; }
    setText(t)  { const el = document.getElementById('sfv3-text-out');  if (el) el.textContent = t || ''; }
    setJson(t)  { const el = document.getElementById('sfv3-json-out');  if (el) el.textContent = t || ''; }

    // ---------- 积木方法 ----------
    async ask(args) {
      const text = String(args.TEXT || '');
      const key = document.getElementById('sfv3-key')?.value.trim();
      const model = document.getElementById('sfv3-model')?.value.trim() || 'step-3.5-flash';
      if (!key) return '请设置 API Key';

      const body = {
        model,
        max_tokens: 1024,
        system: '你是阶跃星辰AI助手。请用中文回答。',
        messages: [{ role: 'user', content: text }]
      };

      try {
        const resp = await fetch('https://api.stepfun.com/v1/messages', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await resp.json();
        let output = '';
        if (Array.isArray(data.content)) {
          for (const b of data.content) if (b.type === 'text') output += b.text;
        } else if (typeof data.content === 'string') {
          output = data.content;
        }
        this.lastText = output;
        this.lastResponse = JSON.stringify(data);
        return output || JSON.stringify(data);
      } catch (err) {
        return '错误：' + err.message;
      }
    }

    getLastText()    { return this.lastText || ''; }
    getLastThink()   { return this.lastThink || ''; }
    getLastResponse(){ return this.lastResponse || ''; }
  }

  // 样式辅助
  function inp() { return 'width:100%;box-sizing:border-box;padding:7px 8px;border-radius:6px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;outline:none;'; }
  function ta()  { return 'width:100%;box-sizing:border-box;padding:7px 8px;border-radius:6px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;outline:none;resize:vertical;'; }
  function btn(bg) { return `background:${bg};color:white;border:none;border-radius:6px;padding:7px 10px;cursor:pointer;font-weight:bold;`; }
  function pre() { return 'background:#0f172a;color:#e2e8f0;padding:10px;border-radius:6px;border:1px solid #334155;white-space:pre-wrap;word-break:break-word;overflow:auto;margin:4px 0;'; }

  Scratch.extensions.register(new StepFunPanelV3());
})(Scratch);
