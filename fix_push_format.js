const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 重写 buildTodaySchedule：列表格式，每节课独立换行
const oldFn = `function buildTodaySchedule(){const now=new Date();const day=now.getDay();const dows=["周日","星期一","星期二","星期三","星期四","星期五","周六"];let md="## 📚 今日课程\\n\\n";md+="**"+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day]+"**\\n\\n";const todayKey=dateKey(now.getFullYear(),now.getMonth(),now.getDate());const hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){md+="🎉 今日放假 — "+hol.name+"，好好休息！";return md}if(day===0||day===6){md+="📋 当天无课程，好好休息！";return md}let hasCourse=false;scheduleData.forEach(row=>{if(row.period==="午休"){md+="| "+row.period+" | "+row.time+" |\\n";return}const sub=row.subjects[day-1];if(sub){hasCourse=true;md+="| **"+row.period+"** "+row.time+" | "+sub.name+(sub.teacher?"（"+sub.teacher+"）":"")+" |\\n"}});if(!hasCourse){md+="📋 当天无课程"}return md}`;

const newFn = `function buildTodaySchedule(){const now=new Date();const day=now.getDay();const dows=["周日","星期一","星期二","星期三","星期四","星期五","周六"];let md="**"+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day]+"**\\n\\n";const todayKey=dateKey(now.getFullYear(),now.getMonth(),now.getDate());const hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){md+="🎉 今日放假 — "+hol.name+"，好好休息！\\n\\n";return md}if(day===0||day===6){md+="📋 当天无课程，好好休息！\\n\\n";return md}let hasCourse=false;scheduleData.forEach(row=>{if(row.period==="午休"){md+="\\n🕐 **午休** "+row.time+"\\n\\n";return}const sub=row.subjects[day-1];if(sub){hasCourse=true;md+="📗 **"+row.period+"**　"+row.time+"\\n"+sub.name+(sub.teacher?"（"+sub.teacher+"）":"")+"\\n\\n"}});if(!hasCourse){md+="📋 当天无课程\\n\\n"}return md}`;

if (html.includes(oldFn)) {
  html = html.replace(oldFn, newFn, 1);
  console.log('buildTodaySchedule rewritten');
} else {
  console.log('buildTodaySchedule pattern not found');
  process.exit(1);
}

// 校验语法
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
  fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/index.html', html);
  console.log('Saved! Size:', html.length);
} catch (e) {
  console.log('Syntax ERROR:', e.message);
  process.exit(1);
}