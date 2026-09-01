const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. 替换 buildTodaySchedule - 使用美观的列表格式
const oldBuild1 = h.indexOf('function buildTodaySchedule');
const oldBuild1End = h.indexOf('function buildTomorrowSchedule');
if (oldBuild1 < 0 || oldBuild1End < 0) { console.log('buildTodaySchedule not found!'); process.exit(1); }

const newBuild1 = [
    'function buildTodaySchedule(){',
    'const now=new Date();const day=now.getDay();',
    'const dows=["周日","周一","周二","周三","周四","周五","周六"];',
    'let lines=[];',
    'lines.push("📚 今日课程");',
    'lines.push("📅 "+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day]);',
    'lines.push("─────────────");',
    'const todayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();',
    'if(typeof holidays2026!=="undefined"){const hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){lines.push("");lines.push("🎉 今天放假 · "+hol.name);lines.push("好好休息！");return lines.join("\\n")}}',
    'if(day===0||day===6){lines.push("");lines.push("📅 周末无课程");lines.push("好好休息！");return lines.join("\\n")}',
    'let hasCourse=false;',
    'scheduleData.forEach(function(row){',
    'if(row.period==="午休"){lines.push("🍽️ "+row.period+" "+row.time);return}',
    'const sub=row.subjects[day-1];',
    'if(sub){hasCourse=true;lines.push("📖 "+row.period+" "+row.time);lines.push("   "+sub.name+(sub.teacher?" · "+sub.teacher:""))}',
    '});',
    'if(!hasCourse){lines.push("");lines.push("📅 今天无课程")}',
    'return lines.join("\\n")',
    '}'
].join('');

h = h.substring(0, oldBuild1) + newBuild1 + '\n' + h.substring(oldBuild1End);
console.log('buildTodaySchedule replaced');

// 2. 替换 buildTomorrowSchedule
const oldBuild2 = h.indexOf('function buildTomorrowSchedule');
const oldBuild2End = h.indexOf('function pushToday');
if (oldBuild2 < 0 || oldBuild2End < 0) { console.log('buildTomorrowSchedule not found!'); process.exit(1); }

const newBuild2 = [
    'function buildTomorrowSchedule(){',
    'const tmr=new Date();tmr.setDate(tmr.getDate()+1);const day=tmr.getDay();',
    'const dows=["周日","周一","周二","周三","周四","周五","周六"];',
    'let lines=[];',
    'lines.push("📚 明日课程");',
    'lines.push("📅 "+tmr.getFullYear()+"年"+(tmr.getMonth()+1)+"月"+tmr.getDate()+"日 "+dows[day]);',
    'lines.push("─────────────");',
    'const tmrKey=tmr.getFullYear()+"-"+(tmr.getMonth()+1)+"-"+tmr.getDate();',
    'if(typeof holidays2026!=="undefined"){const hol=holidays2026[tmrKey];if(hol&&hol.type==="holiday"){lines.push("");lines.push("🎉 明天放假 · "+hol.name);lines.push("好好休息！");return lines.join("\\n")}}',
    'if(day===0||day===6){lines.push("");lines.push("📅 明天周末无课程");lines.push("好好休息！");return lines.join("\\n")}',
    'let hasCourse=false;',
    'scheduleData.forEach(function(row){',
    'if(row.period==="午休"){lines.push("🍽️ "+row.period+" "+row.time);return}',
    'const sub=row.subjects[day-1];',
    'if(sub){hasCourse=true;lines.push("📖 "+row.period+" "+row.time);lines.push("   "+sub.name+(sub.teacher?" · "+sub.teacher:""))}',
    '});',
    'if(!hasCourse){lines.push("");lines.push("📅 明天无课程")}',
    'return lines.join("\\n")',
    '}'
].join('');

h = h.substring(0, oldBuild2) + newBuild2 + '\n' + h.substring(oldBuild2End);
console.log('buildTomorrowSchedule replaced');

// 3. 替换 sendOne - 微信用Markdown格式发送，确保换行
const oldSend = h.indexOf('function sendOne');
const oldSendEnd = h.indexOf('function pushToday');
if (oldSend < 0 || oldSendEnd < 0) { console.log('sendOne not found!'); process.exit(1); }

const newSend = [
    'function sendOne(channel,key,content,title,successMsg){',
    'if(channel==="wx"){',
    'fetch("https://sctapi.ftqq.com/"+key+".send",{',
    'method:"POST",',
    'headers:{"Content-Type":"application/x-www-form-urlencoded"},',
    'body:"title="+encodeURIComponent(title)+"&desp="+encodeURIComponent(content)',
    '}).then(function(r){return r.json()}).then(function(data){',
    'if(data&&data.code===0){showToast(successMsg)}else{showToast("❌ 微信推送失败："+(data&&data.message||"未知错误"))}',
    '}).catch(function(err){showToast("❌ 微信推送失败，请检查网络")})',
    '}else if(channel==="tg"){',
    'fetch("/api/tg-push",{',
    'method:"POST",',
    'headers:{"Content-Type":"application/json"},',
    'body:JSON.stringify({chatId:key,text:content})',
    '}).then(function(r){return r.json()}).then(function(data){',
    'if(data&&data.ok){showToast(successMsg)}else{showToast("❌ Telegram推送失败："+(data&&data.description||"未知错误"))}',
    '}).catch(function(err){showToast("❌ Telegram推送失败，请检查网络")})',
    '}}'
].join('');

h = h.substring(0, oldSend) + newSend + '\n' + h.substring(oldSendEnd);
console.log('sendOne replaced');

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