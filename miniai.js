(function (Scratch) {
  'use strict';

  const DEFAULT_BASE = 'https://minicmp5yuan.mnz.dom.my.id';
  const MODEL = 'MiniCPM5-1B';
  const DEFAULT_PARAMS = { temperature: 0.7 };

  class MiniCPM5Stream {
    constructor() {
      this.baseUrl = DEFAULT_BASE;
      // Extension-internal buffers. Read them back with the reporter blocks.
      this.answer = '';
      this.thinking = '';
      this.thinkMode = 'auto';      // 'auto' | 'on' | 'off'
      this.context = [];            // array of { role, content, [reasoning_content] }
      this.contextNote = '空';
      this.lastPrompt = '';
      this.systemPrompt = '';
      this.params = Object.assign({}, DEFAULT_PARAMS); // arbitrary llama.cpp/OpenAI body params
      this.busy = false;
    }

    getInfo() {
      return {
        id: 'minicpm5stream',
        name: 'MiniCPM5 流式输出',
        color1: '#2f6f8c',
        color2: '#24586e',
        color3: '#1b4456',
        blocks: [
          { opcode: 'setBase', blockType: Scratch.BlockType.COMMAND, text: '设置 AI 服务地址 [BASE]',
            arguments: { BASE: { type: Scratch.ArgumentType.STRING, defaultValue: DEFAULT_BASE } } },
          { opcode: 'getBase', blockType: Scratch.BlockType.REPORTER, text: 'AI 服务地址' },
          { opcode: 'setThink', blockType: Scratch.BlockType.COMMAND, text: '设置深度思考 [MODE]',
            arguments: { MODE: { type: Scratch.ArgumentType.STRING, menu: 'THINK_MODES' } } },
          { opcode: 'getThink', blockType: Scratch.BlockType.REPORTER, text: '深度思考设置' },
          '---',
          { opcode: 'setContext', blockType: Scratch.BlockType.COMMAND, text: '设置上下文 JSON [JSON]',
            arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '[{"role":"system","content":"你是一个乐于助人的助手。"}]' } } },
          { opcode: 'clearContext', blockType: Scratch.BlockType.COMMAND, text: '清空上下文' },
          { opcode: 'getContext', blockType: Scratch.BlockType.REPORTER, text: '上下文状态' },
          '---',
          { opcode: 'setSystem', blockType: Scratch.BlockType.COMMAND, text: '设置系统提示 [SYS]',
            arguments: { SYS: { type: Scratch.ArgumentType.STRING, defaultValue: '你是一个乐于助人的助手。' } } },
          { opcode: 'setTemperature', blockType: Scratch.BlockType.COMMAND, text: '设置 temperature [T]',
            arguments: { T: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.7 } } },
          { opcode: 'setTopP', blockType: Scratch.BlockType.COMMAND, text: '设置 top_p [P]',
            arguments: { P: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.95 } } },
          { opcode: 'setTopK', blockType: Scratch.BlockType.COMMAND, text: '设置 top_k [K]',
            arguments: { K: { type: Scratch.ArgumentType.NUMBER, defaultValue: 40 } } },
          { opcode: 'setMaxTokens', blockType: Scratch.BlockType.COMMAND, text: '设置 max_tokens [N]（0=不限）',
            arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 } } },
          { opcode: 'setSeed', blockType: Scratch.BlockType.COMMAND, text: '设置 seed [SEED]（-1=随机）',
            arguments: { SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: -1 } } },
          { opcode: 'setRepeatPenalty', blockType: Scratch.BlockType.COMMAND, text: '设置重复惩罚 [PEN]',
            arguments: { PEN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.1 } } },
          { opcode: 'setParamsJSON', blockType: Scratch.BlockType.COMMAND, text: '设置参数 JSON [JSON]（覆盖其它参数）',
            arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"top_k":40,"min_p":0.05,"stop":["\\n\\n"]}' } } },
          { opcode: 'resetParams', blockType: Scratch.BlockType.COMMAND, text: '重置所有参数' },
          { opcode: 'exportParams', blockType: Scratch.BlockType.REPORTER, text: '导出参数 JSON' },
          '---',
          { opcode: 'stream', blockType: Scratch.BlockType.COMMAND, text: 'AI 流式输出：提示词 [PROMPT]',
            arguments: { PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '讲一个简短的笑话' } } },
          { opcode: 'streamDelayed', blockType: Scratch.BlockType.COMMAND, text: 'AI 流式输出：提示词 [PROMPT]，字符间隔 [DELAY] ms，[MODE]',
            arguments: {
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '讲一个简短的笑话' },
              DELAY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'MODES' },
            } },
          { opcode: 'streamWithContext', blockType: Scratch.BlockType.COMMAND, text: 'AI 流式输出：上下文 JSON [JSON]，提示词 [PROMPT]',
            arguments: {
              JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '[{"role":"user","content":"你好"}]' },
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
            } },
          '---',
          { opcode: 'complete', blockType: Scratch.BlockType.COMMAND, text: 'AI 文本补全：前文 [PROMPT]',
            arguments: { PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '从前有座山，' } } },
          { opcode: 'completeDelayed', blockType: Scratch.BlockType.COMMAND, text: 'AI 文本补全：前文 [PROMPT]，字符间隔 [DELAY] ms，[MODE]',
            arguments: {
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '从前有座山，' },
              DELAY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 },
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'MODES' },
            } },
          { opcode: 'completeContext', blockType: Scratch.BlockType.COMMAND, text: 'AI 文本补全：用上下文作前文，续写 [PROMPT]',
            arguments: { PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: '' } } },
          '---',
          { opcode: 'getOutput', blockType: Scratch.BlockType.REPORTER, text: 'AI 输出内容' },
          { opcode: 'getThinking', blockType: Scratch.BlockType.REPORTER, text: 'AI 思考内容' },
          { opcode: 'getFull', blockType: Scratch.BlockType.REPORTER, text: 'AI 完整输出（含思考）' },
          { opcode: 'exportContext', blockType: Scratch.BlockType.REPORTER, text: '导出上下文 JSON' },
          { opcode: 'exportDialog', blockType: Scratch.BlockType.REPORTER, text: '导出对话 JSON（含本轮问答）' },
          { opcode: 'getLength', blockType: Scratch.BlockType.REPORTER, text: 'AI 输出字数' },
          { opcode: 'isBusy', blockType: Scratch.BlockType.BOOLEAN, text: 'AI 正在输出？' },
          { opcode: 'clear', blockType: Scratch.BlockType.COMMAND, text: '清空 AI 输出' },
        ],
        menus: {
          MODES: {
            acceptReporters: true,
            items: [
              { text: '覆盖（先清空）', value: 'overwrite' },
              { text: '追加', value: 'append' },
            ],
          },
          THINK_MODES: {
            acceptReporters: true,
            items: [
              { text: '自动（由模型决定）', value: 'auto' },
              { text: '开启（深度思考）', value: 'on' },
              { text: '关闭（直接作答）', value: 'off' },
            ],
          },
        },
      };
    }

    /* ---- connection / thinking ---- */
    setBase(args) { const v = String(args.BASE).trim(); this.baseUrl = v === '' ? DEFAULT_BASE : v; }
    getBase() { return this.baseUrl; }
    setThink(args) { const m = String(args.MODE); this.thinkMode = (m === 'on' || m === 'off') ? m : 'auto'; }
    getThink() { return this.thinkMode; }

    /* ---- context (JSON in / out) ---- */
    _parseContext(raw) {
      const s = String(raw == null ? '' : raw).trim();
      if (s === '') return { messages: [], note: '空' };
      let data;
      try { data = JSON.parse(s); }
      catch (e) { return { messages: [], note: '错误：JSON 解析失败（' + e.message + '）' }; }
      let arr;
      if (Array.isArray(data)) arr = data;
      else if (data && typeof data === 'object' && Array.isArray(data.messages)) arr = data.messages;
      else if (data && typeof data === 'object' && data.role != null) arr = [data];
      else return { messages: [], note: '错误：应为消息数组或 {"messages":[...]}' };
      const messages = [];
      for (const m of arr) {
        if (!m || typeof m !== 'object') continue;
        const role = String(m.role == null ? 'user' : m.role);
        let content = m.content;
        if (content == null) content = '';
        else if (typeof content !== 'string') content = JSON.stringify(content);
        const out = { role, content };
        if (typeof m.reasoning_content === 'string') out.reasoning_content = m.reasoning_content;
        messages.push(out);
      }
      if (messages.length === 0) return { messages: [], note: '错误：没有有效的消息' };
      return { messages, note: messages.length + ' 条消息' };
    }
    setContext(args) {
      const r = this._parseContext(args.JSON);
      this.context = r.messages;
      this.contextNote = r.note;
      if (r.note.indexOf('错误') === 0) console.warn('MiniCPM5 上下文：' + r.note);
    }
    clearContext() { this.context = []; this.contextNote = '空'; }
    getContext() { return this.contextNote; }

    exportContext() { return JSON.stringify(this.context); }
    exportDialog() {
      // The current turn is never auto-added, so include it here for one-shot export.
      const dialog = this.context.slice();
      if (this.lastPrompt !== '') dialog.push({ role: 'user', content: this.lastPrompt });
      if (this.answer !== '' || this.thinking !== '') {
        const assistant = { role: 'assistant', content: this.answer };
        if (this.thinking !== '') assistant.reasoning_content = this.thinking;
        dialog.push(assistant);
      }
      return JSON.stringify(dialog);
    }

    /* ---- tunable parameters ---- */
    setSystem(args) { this.systemPrompt = String(args.SYS); }
    _num(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }
    setTemperature(args) { const v = this._num(args.T); if (v !== null) this.params.temperature = v; }
    setTopP(args) { const v = this._num(args.P); if (v !== null) this.params.top_p = v; }
    setTopK(args) { const v = this._num(args.K); if (v !== null) this.params.top_k = Math.round(v); }
    setMaxTokens(args) { const v = this._num(args.N); if (v !== null && v > 0) this.params.max_tokens = Math.floor(v); else delete this.params.max_tokens; }
    setSeed(args) { const v = this._num(args.SEED); if (v !== null && v >= 0) this.params.seed = Math.floor(v); else delete this.params.seed; }
    setRepeatPenalty(args) { const v = this._num(args.PEN); if (v !== null) this.params.repeat_penalty = v; }
    setParamsJSON(args) {
      const s = String(args.JSON == null ? '' : args.JSON).trim();
      if (s === '') return;
      let obj;
      try { obj = JSON.parse(s); }
      catch (e) { console.warn('MiniCPM5 参数：JSON 解析失败（' + e.message + '）'); return; }
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { console.warn('MiniCPM5 参数：应为 JSON 对象'); return; }
      this.params = Object.assign({}, this.params, obj);
    }
    resetParams() { this.params = Object.assign({}, DEFAULT_PARAMS); this.systemPrompt = ''; }
    exportParams() {
      const out = Object.assign({}, this.params);
      if (this.systemPrompt !== '') out.system = this.systemPrompt;
      if (this.thinkMode !== 'auto') out.enable_thinking = (this.thinkMode === 'on');
      return JSON.stringify(out);
    }

    /* ---- output ---- */
    getOutput() { return this.answer; }
    getThinking() { return this.thinking; }
    getFull() {
      if (this.thinking === '') return this.answer;
      return '<think>\n' + this.thinking + '\n</think>\n' + this.answer;
    }
    getLength() { return this.answer.length; }
    isBusy() { return this.busy; }
    clear() { this.answer = ''; this.thinking = ''; }

    /* ---- chat streaming ---- */
    async stream(args) { await this._stream(this.context, args.PROMPT, 0, 'overwrite'); }
    async streamDelayed(args) {
      const delay = Number(args.DELAY);
      await this._stream(this.context, args.PROMPT, Number.isFinite(delay) ? Math.max(0, delay) : 15, args.MODE);
    }
    async streamWithContext(args) {
      const r = this._parseContext(args.JSON);
      if (r.note.indexOf('错误') === 0) { this.answer = r.note; this.thinking = ''; return; }
      await this._stream(r.messages, args.PROMPT, 0, 'overwrite');
    }

    /* ---- raw text completion ---- */
    async complete(args) { await this._complete(String(args.PROMPT == null ? '' : args.PROMPT), 0, 'overwrite'); }
    async completeDelayed(args) {
      const delay = Number(args.DELAY);
      await this._complete(String(args.PROMPT == null ? '' : args.PROMPT), Number.isFinite(delay) ? Math.max(0, delay) : 15, args.MODE);
    }
    async completeContext(args) {
      let text = this._flattenContext();
      const prompt = String(args.PROMPT == null ? '' : args.PROMPT);
      if (prompt !== '') text += (text === '' ? '' : '\n') + prompt;
      await this._complete(text, 0, 'overwrite');
    }
    _flattenContext() {
      return this.context.map((m) => m.role + ': ' + m.content).join('\n');
    }

    _buildMessages(ctxMessages, text) {
      const messages = ctxMessages.slice();
      const prompt = String(text == null ? '' : text);
      if (prompt !== '') messages.push({ role: 'user', content: prompt });
      if (this.systemPrompt !== '') messages.unshift({ role: 'system', content: this.systemPrompt });
      if (messages.length === 0) messages.push({ role: 'user', content: '' });
      return messages;
    }

    _buildBody(ctxMessages, text) {
      const body = Object.assign(
        { model: MODEL, messages: this._buildMessages(ctxMessages, text), stream: true },
        this.params
      );
      if (this.thinkMode === 'on' || this.thinkMode === 'off') {
        body.chat_template_kwargs = Object.assign({}, body.chat_template_kwargs, {
          enable_thinking: this.thinkMode === 'on',
        });
      }
      return JSON.stringify(body);
    }

    async _stream(ctxMessages, text, delay, mode) {
      if (this.busy) { console.warn('MiniCPM5 流式：上一段输出尚未结束，已忽略本次调用'); return; }
      this.busy = true;
      if (mode !== 'append') { this.answer = ''; this.thinking = ''; }

      const body = this._buildBody(ctxMessages, text);
      const promptText = String(text == null ? '' : text);
      if (promptText !== '') this.lastPrompt = promptText;

      const append = this._makeAppender(delay);

      try {
        let res;
        try {
          res = await fetch(this.baseUrl.replace(/\/+$/, '') + '/chat.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body,
          });
        } catch (e) { this.answer += '请求失败：' + e.message; return; }

        if (!res.ok || !res.body) {
          const t = await res.text().catch(() => '');
          this.answer += '服务错误（HTTP ' + res.status + '）：' + t.slice(0, 200).replace(/\n/g, ' ');
          return;
        }

        await this._consume(res, async (j) => {
          const choice = j && j.choices && j.choices[0];
          const delta = choice && choice.delta;
          if (!delta) return;
          if (typeof delta.reasoning_content === 'string' && delta.reasoning_content !== '') await append('thinking', delta.reasoning_content);
          if (typeof delta.content === 'string' && delta.content !== '') await append('answer', delta.content);
        });
      } catch (e) {
        this.answer += '流式读取失败：' + e.message;
      } finally {
        this.busy = false;
      }
    }

    async _complete(promptText, delay, mode) {
      if (this.busy) { console.warn('MiniCPM5 流式：上一段输出尚未结束，已忽略本次调用'); return; }
      this.busy = true;
      if (mode !== 'append') { this.answer = ''; this.thinking = ''; }

      const body = JSON.stringify(Object.assign({ model: MODEL, prompt: promptText, stream: true }, this.params));
      const append = this._makeAppender(delay);

      try {
        let res;
        try {
          res = await fetch(this.baseUrl.replace(/\/+$/, '') + '/completion.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body,
          });
        } catch (e) { this.answer += '请求失败：' + e.message; return; }

        if (!res.ok || !res.body) {
          const t = await res.text().catch(() => '');
          this.answer += '服务错误（HTTP ' + res.status + '）：' + t.slice(0, 200).replace(/\n/g, ' ');
          return;
        }

        await this._consume(res, async (j) => {
          const choice = j && j.choices && j.choices[0];
          if (choice) {
            if (choice.delta) {
              const d = choice.delta;
              if (typeof d.reasoning_content === 'string' && d.reasoning_content !== '') await append('thinking', d.reasoning_content);
              if (typeof d.content === 'string' && d.content !== '') await append('answer', d.content);
            } else if (typeof choice.text === 'string' && choice.text !== '') {
              await append('answer', choice.text);
            }
          } else if (typeof j.content === 'string' && j.content !== '') {
            // llama.cpp native /completion stream shape: { content, stop, ... }
            await append('answer', j.content);
          }
        });
      } catch (e) {
        this.answer += '流式读取失败：' + e.message;
      } finally {
        this.busy = false;
      }
    }

    _makeAppender(delay) {
      return async (which, piece) => {
        if (piece === '') return;
        if (delay > 0) {
          for (const ch of piece) { this[which] += ch; await new Promise((r) => setTimeout(r, delay)); }
        } else {
          this[which] += piece;
        }
      };
    }

    // Shared SSE reader: dispatches each parsed `data:` JSON object to onData.
    async _consume(res, onData) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let split;
        while ((split = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, split);
          buffer = buffer.slice(split + 2);
          for (const line of block.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '' || payload === '[DONE]') continue;
            let j;
            try { j = JSON.parse(payload); } catch (e) { continue; }
            if (j && typeof j === 'object') await onData(j);
          }
        }
      }
    }
  }

  Scratch.extensions.register(new MiniCPM5Stream());
})(Scratch);
