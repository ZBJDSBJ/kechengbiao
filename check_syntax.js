const fs = require('fs');
const html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');
// 提取所有内联 script（无 src）
const parts = html.split('<script');
let inline = '';
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  if (part.startsWith(' src=')) continue;
  const start = part.indexOf('>') + 1;
  const end = part.indexOf('</' + 'script>');
  if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
try {
  new Function(inline);
  console.log('Syntax OK');
} catch (err) {
  console.log('ERROR:', err.message);
  // 找出出错行
  const lines = inline.split('\n');
  // 用 node 逐行累积检查
  let acc = '';
  for (let i = 0; i < lines.length; i++) {
    acc += lines[i] + '\n';
    try {
      new Function(acc);
    } catch (e) {
      // 记录第一次出现该错误的行
      if (e.message === err.message) {
        console.log('First problematic around line', i + 1);
        console.log('Line content:', lines[i].substring(0, 200));
        break;
      }
    }
  }
}