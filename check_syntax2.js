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
// 找到 buildTodaySchedule 附近并打印其完整内容
const i = inline.indexOf('function buildTodaySchedule');
const seg = inline.substring(i, i + 1500);
console.log(seg);