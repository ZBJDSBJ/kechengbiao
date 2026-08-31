const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换整个推送设置弹窗
const i = html.indexOf('<div class="modal auth-modal" id="pushModal">');
const j = html.indexOf('</div></div>', i) + 12;
if (i < 0 || j < 0) { console.log('Push modal not found'); process.exit(1); }

const newModal = `<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:400px"><h3>📱 消息推送设置</h3><div style="border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="font-size:14px;font-weight:600">💬 微信（Server酱）</span><label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-light)"><input type="checkbox" id="wxEnabled" style="width:auto" checked>启用</label></div><input type="text" id="pushWxKey" placeholder="粘贴 SendKey" style="margin-bottom:8px"><div style="font-size:11px;color:var(--text-light);line-height:1.5">访问 <a href="https://sct.ftqq.com/" target="_blank" style="color:var(--primary)">sct.ftqq.com</a> 扫码登录获取 SendKey</div></div><div style="border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="font-size:14px;font-weight:600">✈️ Telegram</span><label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-light)"><input type="checkbox" id="tgEnabled" style="width:auto">启用</label></div><input type="text" id="pushTgKey" placeholder="粘贴 Chat ID（纯数字）" style="margin-bottom:8px"><div style="font-size:11px;color:var(--text-light);line-height:1.5">向 <a href="https://t.me/jinhui_kechengbiao_bot" target="_blank" style="color:var(--primary)">@jinhui_kechengbiao_bot</a> 发消息后获取 Chat ID</div></div><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pushAuto" style="width:auto" onchange="togglePushTime()">每天自动推送今日课程</label><div id="pushTimeRow" style="display:none;margin-bottom:12px;padding-left:24px"><span style="font-size:13px;color:var(--text-light)">推送时间：</span><select id="pushHour" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:13px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById('pushModal').classList.remove('show')" style="width:100%;margin-top:8px">取消</button></div></div>`;

html = html.substring(0, i) + newModal + html.substring(j);
console.log('Modal replaced with multi-channel UI');

// 2. 替换 openPushSettings, setChannel, togglePushTime
const oldOpen = html.indexOf('function openPushSettings');
const oldOpenEnd = html.indexOf('function setChannel');
if (oldOpen < 0 || oldOpenEnd < 0) { console.log('openPushSettings block not found'); process.exit(1); }

const newOpenBlock = `function openPushSettings(){const cfg=getPushConfig()||{};document.getElementById("wxEnabled").checked=cfg.wx?cfg.wx.enabled:true;document.getElementById("tgEnabled").checked=cfg.tg?cfg.tg.enabled:false;document.getElementById("pushWxKey").value=(cfg.wx&&cfg.wx.key)||"";document.getElementById("pushTgKey").value=(cfg.tg&&cfg.tg.key)||"";document.getElementById("pushAuto").checked=cfg.auto||false;var ph=document.getElementById("pushHour");if(ph){ph.value=String(cfg.pushHour||8)}togglePushTime();document.getElementById("pushModal").classList.add("show")}
function togglePushTime(){var cb=document.getElementById("pushAuto");var row=document.getElementById("pushTimeRow");if(cb&&row){row.style.display=cb.checked?"block":"none"}}
`;

html = html.substring(0, oldOpen) + newOpenBlock + html.substring(oldOpenEnd);
console.log('openPushSettings + togglePushTime replaced');

// 3. 替换 savePushSettings
const oldSave = html.indexOf('function savePushSettings');
const oldSaveEnd = html.indexOf('function sendPush');
if (oldSave < 0 || oldSaveEnd < 0) { console.log('savePushSettings not found'); process.exit(1); }

const newSave = `function savePushSettings(){const wxEnabled=document.getElementById("wxEnabled").checked;const tgEnabled=document.getElementById("tgEnabled").checked;const wxKey=document.getElementById("pushWxKey").value.trim();const tgKey=document.getElementById("pushTgKey").value.trim();const auto=document.getElementById("pushAuto").checked;const pushHour=parseFloat(document.getElementById("pushHour").value)||8;if(wxEnabled&&!wxKey){showToast("请填写微信 SendKey");return}if(tgEnabled&&!tgKey){showToast("请填写 Telegram Chat ID");return}if(!wxEnabled&&!tgEnabled){showToast("请至少启用一个渠道");return}savePushConfig({wx:{enabled:wxEnabled,key:wxKey},tg:{enabled:tgEnabled,key:tgKey},auto,pushHour});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}
`;

html = html.substring(0, oldSave) + newSave + html.substring(oldSaveEnd);
console.log('savePushSettings replaced');

// 4. 替换 sendPush + pushToday
const oldSend = html.indexOf('function sendPush');
const oldSendEnd = html.indexOf('function testPush');
if (oldSend < 0 || oldSendEnd < 0) { console.log('sendPush block not found'); process.exit(1); }

const newSendBlock = `function sendOne(channel,key,content,title,okMsg){if(channel==="tg"){return fetch("/api/tg-push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:key,text:"*"+title+"*\\n\\n"+content})}).then(r=>r.json()).then(data=>{if(data.ok){showToast(okMsg)}else{showToast("❌ TG: "+(data.description||data.error||"失败"))}}).catch(err=>{showToast("❌ TG: 网络错误")})}else{return fetch("https://sctapi.ftqq.com/"+key+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent(title)+"&desp="+encodeURIComponent(content)}).then(r=>r.json()).then(data=>{if(data.code===0){showToast(okMsg)}else{showToast("❌ 微信: "+(data.message||data.msg||"失败"))}}).catch(err=>{showToast("❌ 微信: 网络错误")})}}
function pushToday(){const cfg=getPushConfig();if(!cfg){showToast("请先配置推送");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");var sent=0;if(cfg.wx&&cfg.wx.enabled&&cfg.wx.key){sent++;sendOne("wx",cfg.wx.key,content,"今日课程安排","✅ 微信已推送")}if(cfg.tg&&cfg.tg.enabled&&cfg.tg.key){sent++;sendOne("tg",cfg.tg.key,content,"今日课程安排","✅ Telegram已推送")}if(sent===0){showToast("请先启用至少一个渠道");openPushSettings()}}
`;

html = html.substring(0, oldSend) + newSendBlock + html.substring(oldSendEnd);
console.log('sendPush + pushToday replaced');

// 5. 替换 testPush
const oldTest = html.indexOf('function testPush');
const oldTestEnd = html.indexOf('}function ', oldTest + 20);
if (oldTest < 0 || oldTestEnd < 0) { console.log('testPush not found'); process.exit(1); }

const newTest = `function testPush(){const cfg=getPushConfig()||{};var wxEnabled=document.getElementById("wxEnabled").checked;var tgEnabled=document.getElementById("tgEnabled").checked;var wxKey=document.getElementById("pushWxKey").value.trim();var tgKey=document.getElementById("pushTgKey").value.trim();var sent=0;if(wxEnabled&&wxKey){sent++;sendOne("wx",wxKey,"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ 微信测试成功")}if(tgEnabled&&tgKey){sent++;sendOne("tg",tgKey,"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ Telegram测试成功")}if(sent===0){showToast("请先填写并启用至少一个渠道")}}
`;

html = html.substring(0, oldTest) + newTest + html.substring(oldTestEnd + 1);
console.log('testPush replaced');

// 6. 替换 autoPushCheck
const oldCheck = html.indexOf('function autoPushCheck');
const oldCheckEnd = html.indexOf('function updateAccountUI');
if (oldCheck < 0 || oldCheckEnd < 0) { console.log('autoPushCheck not found'); process.exit(1); }

const newCheck = `function autoPushCheck(){const cfg=getPushConfig();if(!cfg||!cfg.auto)return;const now=new Date();const key=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();const lastKey=localStorage.getItem("kc_autopush_last")||"";if(key===lastKey)return;var ph=cfg.pushHour||8;var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);var curMin=now.getHours()*60+now.getMinutes();if(curMin>=tgtMin&&curMin<tgtMin+60){pushToday();localStorage.setItem("kc_autopush_last",key)}}
`;

html = html.substring(0, oldCheck) + newCheck + html.substring(oldCheckEnd);
console.log('autoPushCheck replaced');

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