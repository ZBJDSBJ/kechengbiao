const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 找到并替换有问题的 autoPushCheck
const i = html.indexOf('function autoPushCheck');
const j = html.indexOf('function updateAccountUI');
if (i < 0 || j < 0) { console.log('Functions not found'); process.exit(1); }

const newCheck = 'function autoPushCheck(){const cfg=getPushConfig();if(!cfg||!cfg.auto)return;const now=new Date();const key=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();const lastKey=localStorage.getItem("kc_autopush_last")||"";if(key===lastKey)return;var ph=cfg.pushHour||8;var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);var curMin=now.getHours()*60+now.getMinutes();if(curMin>=tgtMin&&curMin<tgtMin+60){pushToday();localStorage.setItem("kc_autopush_last",key)}}\n';

html = html.substring(0, i) + newCheck + html.substring(j);

// 校验语法
const parts = html.split('<script');
let inline = '';
for (let k = 1; k < parts.length; k++) {
  const part = parts[k];
  if (part.startsWith(' src=')) continue;
  const start = part.indexOf('>') + 1;
  const end = part.indexOf('</' + 'script>');
  if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
try {
  new Function(inline);
  console.log('Syntax OK');
  fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/index.html', html);
  console.log('Saved! Size:', html.length);
} catch (e) {
  console.log('Syntax ERROR:', e.message);
  process.exit(1);
}