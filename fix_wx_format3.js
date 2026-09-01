const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 按用户指定格式重写推送内容
// 格式：日期 星期\n\n📗 第1节　8:30—9:00 语文（易鑫月）\n...
// Server酱Markdown渲染：每行末尾加"  "（两空格）实现硬换行

// 替换 buildTodaySchedule
const oldBuild1 = h.indexOf('function buildTodaySchedule');
const oldBuild1End = h.indexOf('function buildTomorrowSchedule');
if (oldBuild1 < 0 || oldBuild1End < 0) { console.log('buildTodaySchedule not found!'); process.exit(1); }

const newBuild1 = [
    'function buildTodaySchedule(){',
    'var now=new Date();var day=now.getDay();',
    'var dows=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];',
    'var dateStr=now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day];',
    'var todayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();',
    'if(typeof holidays2026!=="undefined"){var hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){return dateStr+"\\n\\n🎉 今天放假 · "+hol.name+"，好好休息！"}}',
    'if(day===0||day===6){return dateStr+"\\n\\n📅 周末无课程，好好休息！"}',
    'var lines=[dateStr,""];',
    'scheduleData.forEach(function(row){',
    'var sub=row.subjects[day-1];',
    'if(!sub)return;',
    'if(row.period==="午休"){lines.push("🕐 午休 "+row.time);return}',
    'var line="📗 "+row.period+"\\u3000"+row.time+" "+sub.name;',
    'if(sub.teacher)line+="\\uff08"+sub.teacher+"\\uff09";',
    'lines.push(line)',
    '});',
    'return lines.join("  \\n")',
    '}'
].join('');

h = h.substring(0, oldBuild1) + newBuild1 + '\n' + h.substring(oldBuild1End);
console.log('buildTodaySchedule replaced');

// 替换 buildTomorrowSchedule
const oldBuild2 = h.indexOf('function buildTomorrowSchedule');
const oldBuild2End = h.indexOf('function sendOne');
if (oldBuild2 < 0 || oldBuild2End < 0) { console.log('buildTomorrowSchedule not found!'); process.exit(1); }

const newBuild2 = [
    'function buildTomorrowSchedule(){',
    'var tmr=new Date();tmr.setDate(tmr.getDate()+1);var day=tmr.getDay();',
    'var dows=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];',
    'var dateStr=tmr.getFullYear()+"年"+(tmr.getMonth()+1)+"月"+tmr.getDate()+"日 "+dows[day];',
    'var tmrKey=tmr.getFullYear()+"-"+(tmr.getMonth()+1)+"-"+tmr.getDate();',
    'if(typeof holidays2026!=="undefined"){var hol=holidays2026[tmrKey];if(hol&&hol.type==="holiday"){return dateStr+"\\n\\n🎉 明天放假 · "+hol.name+"，好好休息！"}}',
    'if(day===0||day===6){return dateStr+"\\n\\n📅 明天周末无课程，好好休息！"}',
    'var lines=[dateStr,""];',
    'scheduleData.forEach(function(row){',
    'var sub=row.subjects[day-1];',
    'if(!sub)return;',
    'if(row.period==="午休"){lines.push("🕐 午休 "+row.time);return}',
    'var line="📗 "+row.period+"\\u3000"+row.time+" "+sub.name;',
    'if(sub.teacher)line+="\\uff08"+sub.teacher+"\\uff09";',
    'lines.push(line)',
    '});',
    'return lines.join("  \\n")',
    '}'
].join('');

h = h.substring(0, oldBuild2) + newBuild2 + '\n' + h.substring(oldBuild2End);
console.log('buildTomorrowSchedule replaced');

// 验证语法
const parts = h.split('<script');
let inline = '';
for (let k = 1; k < parts.length; k++) {
    const part = parts[k];
    if (part.startsWith(' src=')) continue;
    const start = part.indexOf('>') + 1;
    const end = part.indexOf('</' + 'script>');
    if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
fs.writeFileSync('_check.js', inline);

const { execSync } = require('child_process');
try {
    execSync('node --check _check.js', { stdio: 'pipe' });
    console.log('Syntax OK!');
    fs.writeFileSync('index.html', h);
    console.log('Saved! Size:', h.length);
} catch (e) {
    console.log('Syntax ERROR:', e.stderr ? e.stderr.toString().substring(0, 500) : e.message);
}