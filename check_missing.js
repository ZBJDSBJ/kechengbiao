const fs = require('fs');
const html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 提取内联 JS
const parts = html.split('<script');
let inline = '';
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  if (part.startsWith(' src=')) continue;
  const start = part.indexOf('>') + 1;
  const end = part.indexOf('</' + 'script>');
  if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}

// 收集所有函数定义
const defined = new Set();
const defRe = /function\s+([a-zA-Z_$][\w$]*)\s*\(/g;
let m;
while ((m = defRe.exec(inline))) defined.add(m[1]);

// 收集所有被调用的函数（onclick + JS 内调用）
const called = new Set();
const html1 = html; // 全文搜索 onclick
const onclickRe = /(?:onclick|onchange|oninput)="([a-zA-Z_$][\w$]*)\(/g;
while ((m = onclickRe.exec(html1))) called.add(m[1]);
const callRe = /(?<![.\w$])([a-zA-Z_$][\w$]*)\s*\(/g;
while ((m = callRe.exec(inline))) {
  const name = m[1];
  if (!['if','for','while','switch','catch','function','return','fetch','alert','setTimeout','setInterval','parseInt','parseFloat','encodeURIComponent','decodeURIComponent','String','Number','Array','Object','JSON','Date','Math','Boolean','Promise','Function','console','require','new','typeof','try'].includes(name)) {
    called.add(name);
  }
}

// 找出被调用但未定义的
const missing = [];
called.forEach(name => {
  if (!defined.has(name)) missing.push(name);
});
console.log('Missing functions:', missing.filter(n => !n.startsWith('on')).join(', ') || 'none');
console.log('All defined:', [...defined].sort().join(', '));