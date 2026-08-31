const fs = require('fs');
const html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');
const parts = html.split('<script');
let inline = '';
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  if (part.startsWith(' src=')) continue;
  const start = part.indexOf('>') + 1;
  const end = part.indexOf('</' + 'script>');
  if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}

// 二分法定位错误
function check(code) {
  try { new Function(code); return true; } catch (e) { return false; }
}

let lo = 0, hi = inline.length;
// 先确认全文有错
if (check(inline)) { console.log("No error?!"); process.exit(0); }

// 增量查找：按字符累积，找到第一个通过点
// 太慢，改用分块：按 1000 字符块
let lo2 = 0, hi2 = 1000;
while (true) {
  // 从头累积到 hi2 的片段；截断到最近的语句边界效果不佳，直接试完整累积
  if (hi2 >= inline.length) break;
  const seg = inline.substring(0, hi2);
  if (!check(seg)) {
    // 错误发生在前 hi2 内，缩小
    hi = hi2;
    if (hi2 - lo2 <= 1000) break;
    hi2 = lo2 + Math.ceil((hi2 - lo2) / 2);
  } else {
    lo2 = hi2;
    hi2 = Math.min(hi2 + Math.max(1000, Math.ceil((hi - hi2) / 2)), hi);
  }
}
console.log("Error region ends around char:", hi);
console.log("Context (chars", Math.max(0, hi - 300), "to", hi + 100, "):");
console.log(inline.substring(Math.max(0, hi - 300), hi + 100));