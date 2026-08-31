const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换弹窗中的自动推送开关 - 添加时间选择器
const oldLabel = '<label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label>';
const newLabel = '<label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pushAuto" style="width:auto">每天自动推送今日课程</label><div id="pushTimeRow" style="display:none;margin-bottom:12px;padding-left:24px"><span style="font-size:13px;color:var(--text-light)">推送时间：</span><select id="pushHour" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:13px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div>';
if (!html.includes(oldLabel)) { console.log('Label not found'); process.exit(1); }
html = html.replace(oldLabel, newLabel, 1);
console.log('Time selector added');

// 2. 在 setChannel 后添加 togglePushTime 函数（控制时间选择器显示）
const oldSetChEnd = 'document.getElementById("chanTg").style.color=!isWx?"#fff":""}';
const newSetChEnd = 'document.getElementById("chanTg").style.color=!isWx?"#fff":""}function togglePushTime(){var cb=document.getElementById("pushAuto");var row=document.getElementById("pushTimeRow");if(cb&&row){row.style.display=cb.checked?"block":"none"}}';
if (!html.includes(oldSetChEnd)) { console.log('setChannel end not found'); process.exit(1); }
html = html.replace(oldSetChEnd, newSetChEnd, 1);
console.log('togglePushTime added');

// 3. 给 checkbox 添加 onchange 事件
html = html.replace('<input type="checkbox" id="pushAuto" style="width:auto">', '<input type="checkbox" id="pushAuto" style="width:auto" onchange="togglePushTime()">', 1);
console.log('Checkbox onchange added');

// 4. 替换 openPushSettings - 恢复时间选择
const oldOpen = 'document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}';
const newOpen = 'document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushHour").value=String(cfg.pushHour||8);togglePushTime();document.getElementById("pushModal").classList.add("show")}';
if (!html.includes(oldOpen)) { console.log('openPushSettings end not found'); process.exit(1); }
html = html.replace(oldOpen, newOpen, 1);
console.log('openPushSettings updated');

// 5. 替换 savePushSettings - 保存时间
const oldSave = 'savePushConfig({wxKey,tgKey,auto,channel});';
const newSave = 'var pushHour=parseFloat(document.getElementById("pushHour").value)||8;savePushConfig({wxKey,tgKey,auto,channel,pushHour});';
if (!html.includes(oldSave)) { console.log('savePushSettings save not found'); process.exit(1); }
html = html.replace(oldSave, newSave, 1);
console.log('savePushSettings updated');

// 6. 替换 autoPushCheck - 根据保存的时间判断
const oldCheck = 'function autoPushCheck(){const cfg=getPushConfig();if(!cfg||!cfg.auto)return;const now=new Date();const key=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();const lastKey=localStorage.getItem("kc_autopush_last")||"";if(key===lastKey)return;if(now.getHours()>=8&&now.getHours()<9){pushToday();localStorage.setItem("kc_autopush_last",key)}}';
const newCheck = 'function autoPushCheck(){const cfg=getPushConfig();if(!cfg||!cfg.auto)return;const now=new Date();const key=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();const lastKey=localStorage.getItem("kc_autopush_last")||"";if(key===lastKey)return;var ph=cfg.pushHour||8;var h=Math.floor(ph);<8?7:8);var m=(ph%1===0)?0:30;var curMin=now.getHours()*60+now.getMinutes();var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);if(curMin>=tgtMin&&curMin<tgtMin+60){pushToday();localStorage.setItem("kc_autopush_last",key)}}';
if (!html.includes(oldCheck)) { console.log('autoPushCheck not found'); process.exit(1); }
html = html.replace(oldCheck, newCheck, 1);
console.log('autoPushCheck updated');

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