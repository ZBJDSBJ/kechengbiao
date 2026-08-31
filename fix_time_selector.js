const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换旧的 checkbox label
const oldLabel = '<label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label>';
const newLabel = '<label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pushAuto" style="width:auto" onchange="togglePushTime()">每天自动推送今日课程</label><div id="pushTimeRow" style="display:none;margin-bottom:12px;padding-left:24px"><span style="font-size:13px;color:var(--text-light)">推送时间：</span><select id="pushHour" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:13px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div>';

if (!html.includes(oldLabel)) { console.log('Old label not found!'); process.exit(1); }
html = html.replace(oldLabel, newLabel, 1);
console.log('Label replaced with time selector');

// 2. 添加 togglePushTime 函数（在 setChannel 函数后）
const setChEnd = 'document.getElementById("chanTg").style.color=!isWx?"#fff":""}';
if (!html.includes(setChEnd)) { console.log('setChannel end not found'); process.exit(1); }
html = html.replace(setChEnd, setChEnd + 'function togglePushTime(){var cb=document.getElementById("pushAuto");var row=document.getElementById("pushTimeRow");if(cb&&row){row.style.display=cb.checked?"block":"none"}}', 1);
console.log('togglePushTime added');

// 3. 更新 openPushSettings - 恢复时间
const oldOpen = 'document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}';
const newOpen = 'document.getElementById("pushAuto").checked=cfg.auto||false;var ph=document.getElementById("pushHour");if(ph){ph.value=String(cfg.pushHour||8)}togglePushTime();document.getElementById("pushModal").classList.add("show")}';
if (!html.includes(oldOpen)) { console.log('openPushSettings end not found'); process.exit(1); }
html = html.replace(oldOpen, newOpen, 1);
console.log('openPushSettings updated');

// 4. 更新 savePushSettings - 保存时间
const oldSave = 'savePushConfig({wxKey,tgKey,auto,channel});';
const newSave = 'var pushHour=parseFloat(document.getElementById("pushHour").value)||8;savePushConfig({wxKey,tgKey,auto,channel,pushHour});';
if (!html.includes(oldSave)) { console.log('savePushSettings save not found'); process.exit(1); }
html = html.replace(oldSave, newSave, 1);
console.log('savePushSettings updated');

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