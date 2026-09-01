const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Server酱Markdown渲染中，单换行不产生视觉换行
// 方案：用\n\n双换行分隔，确保每行渲染为独立段落

// 替换 buildTodaySchedule
const oldBuild1 = h.indexOf('function buildTodaySchedule');
const oldBuild1End = h.indexOf('function buildTomorrowSchedule');
if (oldBuild1 < 0 || oldBuild1End < 0) { console.log('buildTodaySchedule not found!'); process.exit(1); }

const newBuild1 = 'function buildTodaySchedule(){const now=new Date();const day=now.getDay();const dows=["周日","周一","周二","周三","周四","周五","周六"];var L=[];L.push("📚 今日课程");L.push("📅 "+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day]);L.push("───────────────");const todayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();if(typeof holidays2026!=="undefined"){const hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){L.push("🎉 今天放假 · "+hol.name);L.push("好好休息！");return L.join("\\n\\n")}}if(day===0||day===6){L.push("📅 周末无课程");L.push("好好休息！");return L.join("\\n\\n")}var hasCourse=false;scheduleData.forEach(function(row){if(row.period==="午休"){L.push("🍽️ "+row.period+" "+row.time);return}const sub=row.subjects[day-1];if(sub){hasCourse=true;L.push("📖 "+row.period+" "+row.time+"\\n"+sub.name+(sub.teacher?" · "+sub.teacher:""))}});if(!hasCourse){L.push("📅 今天无课程")}return L.join("\\n\\n")}';

h = h.substring(0, oldBuild1) + newBuild1 + '\n' + h.substring(oldBuild1End);
console.log('buildTodaySchedule replaced');

// 替换 buildTomorrowSchedule
const oldBuild2 = h.indexOf('function buildTomorrowSchedule');
const oldBuild2End = h.indexOf('function sendOne');
if (oldBuild2 < 0 || oldBuild2End < 0) { console.log('buildTomorrowSchedule not found!'); process.exit(1); }

const newBuild2 = 'function buildTomorrowSchedule(){const tmr=new Date();tmr.setDate(tmr.getDate()+1);const day=tmr.getDay();const dows=["周日","周一","周二","周三","周四","周五","周六"];var L=[];L.push("📚 明日课程");L.push("📅 "+tmr.getFullYear()+"年"+(tmr.getMonth()+1)+"月"+tmr.getDate()+"日 "+dows[day]);L.push("───────────────");const tmrKey=tmr.getFullYear()+"-"+(tmr.getMonth()+1)+"-"+tmr.getDate();if(typeof holidays2026!=="undefined"){const hol=holidays2026[tmrKey];if(hol&&hol.type==="holiday"){L.push("🎉 明天放假 · "+hol.name);L.push("好好休息！");return L.join("\\n\\n")}}if(day===0||day===6){L.push("📅 明天周末无课程");L.push("好好休息！");return L.join("\\n\\n")}var hasCourse=false;scheduleData.forEach(function(row){if(row.period==="午休"){L.push("🍽️ "+row.period+" "+row.time);return}const sub=row.subjects[day-1];if(sub){hasCourse=true;L.push("📖 "+row.period+" "+row.time+"\\n"+sub.name+(sub.teacher?" · "+sub.teacher:""))}});if(!hasCourse){L.push("📅 明天无课程")}return L.join("\\n\\n")}';

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