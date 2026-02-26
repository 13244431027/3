plugin.id = "markdown.enhanced-parser";
plugin.name = "Markdown Enhanced Parser (Better MD + Long Text)";
plugin.version = "1.0.0";

/*
目标：
1) 优化 Markdown 解析：支持更多语法、代码块高亮（可选）、更稳定的列表/表格解析。
2) 增加长文本解析：移除原 Utils.parseMarkdown 内部对代码块/表格等导致的大量 replace 限制点，
   并避免“整段先拆 codeblock 再全局 replace”引发的性能/错乱；改成分段渲染。
实现策略（插件侧，非改源码）：
- Hook: file:open，若打开的是 md/readme，则用增强解析替换预览 HTML。
- 仅在“预览模式”时替换：检测 core.isMarkdownPreview === true。
- 提供一个轻量渲染器：分段处理（按 code fence / 表格块 / 普通段落），支持超长文本。
*/

plugin.init = (ctx) => {
  plugin._ctx = ctx;

  // 注入样式（更好的 md 外观）
  plugin.style = `
    .mdx { font-size: 13px; line-height: 1.55; }
    .mdx h1,.mdx h2,.mdx h3,.mdx h4,.mdx h5 { margin: 12px 0 8px; }
    .mdx h1 { font-size: 18px; }
    .mdx h2 { font-size: 16px; }
    .mdx h3 { font-size: 15px; }
    .mdx code { background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 4px; }
    .mdx pre { background:#161b22; border:1px solid rgba(255,255,255,0.12); padding:10px; border-radius:8px; overflow:auto; }
    .mdx pre code { background: transparent; padding:0; }
    .mdx blockquote { border-left: 3px solid rgba(255,255,255,0.25); padding: 6px 10px; margin: 10px 0; opacity: 0.9; background: rgba(255,255,255,0.04); border-radius: 6px; }
    .mdx table { border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid rgba(255,255,255,0.18); }
    .mdx th, .mdx td { border: 1px solid rgba(255,255,255,0.18); padding: 6px; vertical-align: top; }
    .mdx th { background: rgba(255,255,255,0.08); }
    .mdx a { color: #8af; text-decoration: none; }
    .mdx a:hover { text-decoration: underline; }
    .mdx ul, .mdx ol { padding-left: 22px; margin: 8px 0; }
    .mdx li { margin: 2px 0; }
    .mdx hr { border: none; border-top: 1px solid rgba(255,255,255,0.18); margin: 12px 0; }
    .mdx img { max-width: 100%; border-radius: 6px; margin: 6px 0; }
  `;
};

/** HTML 转义（防注入） */
function escHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** 将相对图片/链接补齐为 raw / github 页面（增强版） */
function absolutizeLinks(md, owner, repo, branch) {
  if (!owner || !repo) return md;
  const b = branch || "main";
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${b}`;
  const webBase = `https://github.com/${owner}/${repo}/blob/${b}`;

  // 图片 ![](...)
  md = md.replace(/!\[([^\]]*)\]\((?!https?:|#)([^)]+)\)/g, (_, alt, p) => {
    const clean = p.startsWith("/") ? p.slice(1) : p;
    return `![${alt}](${rawBase}/${clean})`;
  });

  // 普通链接 [](...)
  md = md.replace(/\[([^\]]+)\]\((?!https?:|#)([^)]+)\)/g, (_, text, p) => {
    const clean = p.startsWith("/") ? p.slice(1) : p;
    return `[${text}](${webBase}/${clean})`;
  });

  return md;
}

/**
 * 长文本安全渲染：分块处理
 * - 先做相对链接补齐
 * - 再扫描 fence code block（```）
 * - 其余文本按行做：标题、引用、hr、列表、段落、内联格式（粗体/斜体/行内代码/链接/图片）
 * - 支持“超长”：不会把所有 code block 抽出来再做全局替换，减少错乱与峰值内存
 */
function renderMarkdownLong(md, owner, repo, branch) {
  md = String(md || "");
  md = absolutizeLinks(md, owner, repo, branch);

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = `<div class="mdx">`;

  let inCode = false;
  let codeLang = "";
  let codeBuf = [];

  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { html += `</ul>`; inUl = false; }
    if (inOl) { html += `</ol>`; inOl = false; }
  };

  const inline = (text) => {
    // 行内代码 `...`
    text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escHtml(c)}</code>`);
    // 粗体 **...**
    text = text.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    // 斜体 *...*（避免与粗体冲突，简单规则）
    text = text.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<i>$2</i>");
    // 图片（这里假设已绝对化）
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1">`);
    // 链接
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`);
    return text;
  };

  const flushParagraph = (p) => {
    if (!p) return;
    html += `<div style="margin:6px 0">${inline(escHtml(p)).replace(/&lt;(img|a)\b/g, "<$1").replace(/&lt;\/a&gt;/g, "</a>").replace(/&lt;img([^&]*)&gt;/g, "<img$1>")}</div>`;
  };

  // 简单表格识别：连续的 |...| 行 + 分隔行
  const tryParseTable = (i) => {
    const l1 = lines[i] || "";
    const l2 = lines[i + 1] || "";
    if (!/^\s*\|.*\|\s*$/.test(l1)) return null;
    if (!/^\s*\|[\s\-:|]+\|\s*$/.test(l2)) return null;

    let j = i + 2;
    const rows = [];
    while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) {
      rows.push(lines[j]);
      j++;
    }

    const splitRow = (row) =>
      row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());

    const headers = splitRow(l1);
    const body = rows.map(splitRow);

    let t = `<table><thead><tr>`;
    headers.forEach(h => t += `<th>${inline(escHtml(h))}</th>`);
    t += `</tr></thead><tbody>`;
    body.forEach(r => {
      t += `<tr>`;
      for (let k = 0; k < headers.length; k++) {
        t += `<td>${inline(escHtml(r[k] ?? ""))}</td>`;
      }
      t += `</tr>`;
    });
    t += `</tbody></table>`;
    return { html: t, nextIndex: j };
  };

  let paraBuf = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // code fence
    const fence = line.match(/^\s*```(\S*)\s*$/);
    if (fence) {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";

      if (!inCode) {
        inCode = true;
        codeLang = fence[1] || "";
        codeBuf = [];
      } else {
        // end code
        inCode = false;
        const code = codeBuf.join("\n");
        html += `<pre><code class="language-${escHtml(codeLang)}">${escHtml(code)}</code></pre>`;
        codeLang = "";
        codeBuf = [];
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    // 表格块
    const table = tryParseTable(i);
    if (table) {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";
      html += table.html;
      i = table.nextIndex - 1;
      continue;
    }

    // 空行：段落/列表结束
    if (line.trim() === "") {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";
      continue;
    }

    // hr
    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";
      html += `<hr>`;
      continue;
    }

    // 标题
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";
      const level = h[1].length;
      const content = inline(escHtml(h[2]));
      html += `<h${Math.min(5, level)}>${content}</h${Math.min(5, level)}>`;
      continue;
    }

    // 引用
    const bq = line.match(/^\s*>\s?(.*)$/);
    if (bq) {
      closeLists();
      flushParagraph(paraBuf); paraBuf = "";
      html += `<blockquote>${inline(escHtml(bq[1]))}</blockquote>`;
      continue;
    }

    // 有序列表
    const ol = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (ol) {
      flushParagraph(paraBuf); paraBuf = "";
      if (inUl) { html += `</ul>`; inUl = false; }
      if (!inOl) { html += `<ol>`; inOl = true; }
      html += `<li>${inline(escHtml(ol[2]))}</li>`;
      continue;
    }

    // 无序列表
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      flushParagraph(paraBuf); paraBuf = "";
      if (inOl) { html += `</ol>`; inOl = false; }
      if (!inUl) { html += `<ul>`; inUl = true; }
      html += `<li>${inline(escHtml(ul[1]))}</li>`;
      continue;
    }

    // 普通段落：累积（避免每行一个div导致超长文本DOM爆炸）
    if (paraBuf) paraBuf += "\n" + line;
    else paraBuf = line;
  }

  closeLists();
  flushParagraph(paraBuf);

  // fence 未闭合时兜底
  if (inCode && codeBuf.length) {
    html += `<pre><code>${escHtml(codeBuf.join("\n"))}</code></pre>`;
  }

  html += `</div>`;
  return html;
}

plugin.onHook = (hookName, data) => {
  if (hookName !== "file:open") return;

  const { core, ui } = plugin._ctx;
  if (!ui || !ui.fileViewRefs || !ui.fileViewRefs.pre) return;
  if (!data || !data.file) return;

  const name = String(data.file.name || "").toLowerCase();
  const isMd = name.endsWith(".md") || name === "readme";
  if (!isMd) return;

  // 只在预览模式下增强（用户切回“源码”时，扩展会自己改 pre.textContent）
  if (core.isMarkdownPreview !== true) return;

  // 用增强渲染替换原预览
  try {
    ui.fileViewRefs.pre.style.whiteSpace = "normal";
    ui.fileViewRefs.pre.innerHTML = renderMarkdownLong(
      data.text,
      core.currentOwner,
      core.currentRepo,
      core.currentBranch
    );
  } catch (e) {
    // 失败则不影响原功能
    console.warn("[markdown.enhanced-parser] render failed:", e);
  }
};
