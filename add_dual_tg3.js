const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. 替换Telegram时间选择器区域
const oldTgAuto = '<label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:6px"><input type="checkbox" id="tgAuto" style="width:auto" onchange="toggleRow(\'tgTimeRow\',this.checked)">每天自动推送</label><div id="tgTimeRow" style="display:none;padding-left:24px;margin-bottom:4px"><span style="font-size:12px;color:var(--text-light)">时间：</span><select id="tgHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option><option value="21">21:00 次日</option><option value="21.5">21:30 次日</option><option value="22">22:00 次日</option><option value="22.5">22:30 次日</option><option value="23">23:00 次日</option></select><div style="font-size:10px;color:var(--text-light);margin-top:4px;padding-left:24px">选择21:00-23:00将推送<b>次日</b>课程</div></div>';

const newTgAuto = '<label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:4px"><input type="checkbox" id="tgMorningAuto" style="width:auto" onchange="toggleRow(\'tgMorningRow\',this.checked)">☀️ 早上推送当天课程</label><div id="tgMorningRow" style="display:none;padding-left:24px;margin-bottom:6px"><span style="font-size:12px;color:var(--text-light)">时间：</span><select id="tgMorningHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div><label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:4px"><input type="checkbox" id="tgEveningAuto" style="width:auto" onchange="toggleRow(\'tgEveningRow\',this.checked)">🌙 晚上推送次日课程</label><div id="tgEveningRow" style="display:none;padding-left:24px;margin-bottom:4px"><span style="font-size:12px;color:var(--text-light)">时间：</span><select id="tgEveningHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="21">21:00</option><option value="21.5">21:30</option><option value="22" selected>22:00</option><option value="22.5">22:30</option><option value="23">23:00</option></select></div>';

if (h.indexOf(oldTgAuto) < 0) { console.log('oldTgAuto not found!'); process.exit(1); }
h = h.replace(oldTgAuto, newTgAuto);
console.log('Telegram UI replaced');

// 2. 替换 openPushSettings
const oldOpen = h.indexOf('function openPushSettings');
const oldOpenEnd = h.indexOf('function toggleRow');
if (oldOpen < 0 || oldOpenEnd < 0) { console.log('openPushSettings not found!'); process.exit(1); }

const newOpen = 'function openPushSettings(){const cfg=getPushConfig()||{};var wx=cfg.wx||{},tg=cfg.tg||{};document.getElementById("wxEnabled").checked=wx.enabled!==false;document.getElementById("tgEnabled").checked=tg.enabled===true;document.getElementById("pushWxKey").value=wx.key||"";document.getElementById("pushTgKey").value=tg.key||"";document.getElementById("wxAuto").checked=wx.auto===true;document.getElementById("wxHour").value=String(wx.pushHour||8);toggleRow("wxTimeRow",wx.auto===true);var tgMorn=tg.morningAuto===true;var tgEven=tg.eveningAuto===true;document.getElementById("tgMorningAuto").checked=tgMorn;document.getElementById("tgEveningAuto").checked=tgEven;document.getElementById("tgMorningHour").value=String(tg.morningHour||8);document.getElementById("tgEveningHour").value=String(tg.eveningHour||22);toggleRow("tgMorningRow",tgMorn);toggleRow("tgEveningRow",tgEven);document.getElementById("pushModal").classList.add("show")}';

h = h.substring(0, oldOpen) + newOpen + '\n' + h.substring(oldOpenEnd);
console.log('openPushSettings replaced');

// 3. 替换 savePushSettings
const oldSave = h.indexOf('function savePushSettings');
const oldSaveEnd = h.indexOf('function buildTodaySchedule');
if (oldSave < 0 || oldSaveEnd < 0) { console.log('savePushSettings not found!'); process.exit(1); }

const newSave = 'function savePushSettings(){var wxEnabled=document.getElementById("wxEnabled").checked;var tgEnabled=document.getElementById("tgEnabled").checked;var wxKey=document.getElementById("pushWxKey").value.trim();var tgKey=document.getElementById("pushTgKey").value.trim();var wxAuto=document.getElementById("wxAuto").checked;var wxHour=parseFloat(document.getElementById("wxHour").value)||8;var tgMornAuto=document.getElementById("tgMorningAuto").checked;var tgEvenAuto=document.getElementById("tgEveningAuto").checked;var tgMornHour=parseFloat(document.getElementById("tgMorningHour").value)||8;var tgEvenHour=parseFloat(document.getElementById("tgEveningHour").value)||22;if(wxEnabled&&!wxKey){showToast("请填写微信 SendKey");return}if(tgEnabled&&!tgKey){showToast("请填写 Telegram Chat ID");return}if(!wxEnabled&&!tgEnabled){showToast("请至少启用一个渠道");return}savePushConfig({wx:{enabled:wxEnabled,key:wxKey,auto:wxAuto,pushHour:wxHour},tg:{enabled:tgEnabled,key:tgKey,morningAuto:tgMornAuto,eveningAuto:tgEvenAuto,morningHour:tgMornHour,eveningHour:tgEvenHour}});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}';

h = h.substring(0, oldSave) + newSave + '\n' + h.substring(oldSaveEnd);
console.log('savePushSettings replaced');

// 4. 替换 autoPushCheck
const oldCheck = h.indexOf('function autoPushCheck');
const oldCheckEnd = h.indexOf('function updateAccountUI');
if (oldCheck < 0 || oldCheckEnd < 0) { console.log('autoPushCheck not found!'); process.exit(1); }

const newCheck = 'function autoPushCheck(){const cfg=getPushConfig();if(!cfg)return;const now=new Date();const dateKey=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();var curMin=now.getHours()*60+now.getMinutes();function doPush(name,key,content,title,successMsg,storageKey){var last=localStorage.getItem(storageKey);if(last)return;sendOne(name,key,content,title,successMsg);localStorage.setItem(storageKey,"1")}if(cfg.wx&&cfg.wx.enabled&&cfg.wx.auto&&cfg.wx.key){var ph=cfg.wx.pushHour||8;var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);if(curMin>=tgtMin&&curMin<tgtMin+60){doPush("wx",cfg.wx.key,buildTodaySchedule(),"今日课程安排","✅ 微信已推送今日课程","kc_autopush_wx_"+dateKey)}}if(cfg.tg&&cfg.tg.enabled&&cfg.tg.key){if(cfg.tg.morningAuto){var mh=cfg.tg.morningHour||8;var mTgt=Math.floor(mh)*60+(mh%1===0?0:30);if(curMin>=mTgt&&curMin<mTgt+60){doPush("tg",cfg.tg.key,buildTodaySchedule(),"今日课程安排","✅ Telegram已推送今日课程","kc_autopush_tg_morn_"+dateKey)}}if(cfg.tg.eveningAuto){var eh=cfg.tg.eveningHour||22;var eTgt=Math.floor(eh)*60+(eh%1===0?0:30);if(curMin>=eTgt&&curMin<eTgt+60){doPush("tg",cfg.tg.key,buildTomorrowSchedule(),"明日课程安排","✅ Telegram已推送明日课程","kc_autopush_tg_even_"+dateKey)}}}';

h = h.substring(0, oldCheck) + newCheck + '\n' + h.substring(oldCheckEnd);
console.log('autoPushCheck replaced');

// 用 node --check 验证语法
const { execSync } = require('child_process');
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
try {
    execSync('node --check _check.js', { stdio: 'pipe' });
    console.log('Syntax OK (node --check)');
    fs.writeFileSync('index.html', h);
    console.log('Saved! Size:', h.length);
} catch (e) {
    console.log('Syntax ERROR:', e.stderr ? e.stderr.toString() : e.message);
    process.exit(1);
}