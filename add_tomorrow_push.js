const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. 扩展Telegram时间选择器，添加晚间时段
const oldTgSelect = '<select id="tgHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select>';
const newTgSelect = '<select id="tgHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option><option value="21">21:00 次日</option><option value="21.5">21:30 次日</option><option value="22">22:00 次日</option><option value="22.5">22:30 次日</option><option value="23">23:00 次日</option></select>';

if (h.indexOf(oldTgSelect) < 0) { console.log('tgHour select not found!'); process.exit(1); }
h = h.replace(oldTgSelect, newTgSelect);
console.log('Telegram time selector extended with evening options');

// 2. 在 buildTodaySchedule 后添加 buildTomorrowSchedule 函数
const buildTodayEnd = h.indexOf('function pushToday');
if (buildTodayEnd < 0) { console.log('pushToday not found!'); process.exit(1); }

const buildTomorrowFn = `function buildTomorrowSchedule(){const tmr=new Date();tmr.setDate(tmr.getDate()+1);const day=tmr.getDay();const dows=["周日","周一","周二","周三","周四","周五","周六"];let md="## 📚 明日课程\\n\\n";md+="**"+tmr.getFullYear()+"年"+(tmr.getMonth()+1)+"月"+tmr.getDate()+"日 "+dows[day]+"**\\n\\n";const tmrKey=tmr.getFullYear()+"-"+(tmr.getMonth()+1)+"-"+tmr.getDate();if(typeof holidays2026!=="undefined"){const hol=holidays2026[tmrKey];if(hol&&hol.type==="holiday"){md+="🎉 明天放假 · "+hol.name+"，好好休息！";return md}}if(day===0||day===6){md+="📅 明天周末无课程，好好休息！";return md}let hasCourse=false;scheduleData.forEach(row=>{if(row.period==="午休"){md+="| "+row.period+" | "+row.time+" |\\n";return}const sub=row.subjects[day-1];if(sub){hasCourse=true;md+="| **"+row.period+"** "+row.time+" | "+sub.name+(sub.teacher?"（"+sub.teacher+"）":"")+" |\\n"}});if(!hasCourse){md+="📅 明天无课程"}return md}
`;

h = h.substring(0, buildTodayEnd) + buildTomorrowFn + h.substring(buildTodayEnd);
console.log('Added buildTomorrowSchedule function');

// 3. 替换 autoPushCheck 函数，支持次日推送逻辑
const oldCheck = h.indexOf('function autoPushCheck');
const oldCheckEnd = h.indexOf('function updateAccountUI');
if (oldCheck < 0 || oldCheckEnd < 0) { console.log('autoPushCheck not found!'); process.exit(1); }

const newCheck = `function autoPushCheck(){const cfg=getPushConfig();if(!cfg)return;const now=new Date();const dateKey=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();var curMin=now.getHours()*60+now.getMinutes();function checkChannel(ch,name){if(!ch||!ch.enabled||!ch.auto||!ch.key)return;var ph=ch.pushHour||8;var isNextDay=(name==="tg"&&ph>=21);var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);if(curMin>=tgtMin&&curMin<tgtMin+60){var pushKey=isNextDay?"kc_autopush_"+name+"_next_"+dateKey:"kc_autopush_"+name+"_"+dateKey;var last=localStorage.getItem(pushKey);if(last)return;var content=isNextDay?buildTomorrowSchedule():buildTodaySchedule();var title=isNextDay?"明日课程安排":"今日课程安排";var label=isNextDay?"明日":"今日";sendOne(name,ch.key,content,title,"✅ "+(name==="tg"?"Telegram":"微信")+"已推送"+label+"课程");localStorage.setItem(pushKey,"1")}}checkChannel(cfg.wx,"wx");checkChannel(cfg.tg,"tg")}
`;

h = h.substring(0, oldCheck) + newCheck + h.substring(oldCheckEnd);
console.log('autoPushCheck replaced with next-day support');

// 4. 修改 openPushSettings 中 tgHour 的默认值显示
// 当 tg.pushHour >= 21 时需要正确显示选中项，当前逻辑已用 String(tg.pushHour||8) 赋值，select会自动匹配

// 5. 在 Telegram 时间选择器后面添加提示文字
const tgTimeRowEnd = '</select></div></div><button class="btn" onclick="savePushSettings()"';
const tgHintInsert = '<div style="font-size:10px;color:var(--text-light);margin-top:4px;padding-left:24px">选择21:00-23:00将推送<b>次日</b>课程</div>';
// 找到 tgTimeRow 的结束位置
const tgSelectEnd = h.indexOf(newTgSelect) + newTgSelect.length;
const afterTgSelect = h.indexOf('</div></div>', tgSelectEnd);
h = h.substring(0, afterTgSelect) + tgHintInsert + h.substring(afterTgSelect);
console.log('Added hint text for evening push');

// 校验语法
const parts = h.split('<script');
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
    fs.writeFileSync('index.html', h);
    console.log('Saved! Size:', h.length);
} catch (e) {
    console.log('Syntax ERROR:', e.message);
    process.exit(1);
}