const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换推送设置弹窗 - 每个渠道独立配置自动推送时间
const i = html.indexOf('<div class="modal auth-modal" id="pushModal">');
const j = html.indexOf('</div></div>', i) + 12;
if (i < 0 || j < 0) { console.log('Push modal not found'); process.exit(1); }

const newModal = `<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:400px"><h3>📱 消息推送设置</h3><div style="border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="font-size:14px;font-weight:600">💬 微信（Server酱）</span><label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-light)"><input type="checkbox" id="wxEnabled" style="width:auto" checked>启用</label></div><input type="text" id="pushWxKey" placeholder="粘贴 SendKey" style="margin-bottom:8px"><div style="font-size:11px;color:var(--text-light);line-height:1.5;margin-bottom:8px">访问 <a href="https://sct.ftqq.com/" target="_blank" style="color:var(--primary)">sct.ftqq.com</a> 扫码登录获取 SendKey</div><label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:6px"><input type="checkbox" id="wxAuto" style="width:auto" onchange="toggleRow('wxTimeRow',this.checked)">每天自动推送</label><div id="wxTimeRow" style="display:none;padding-left:24px;margin-bottom:4px"><span style="font-size:12px;color:var(--text-light)">时间：</span><select id="wxHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div></div><div style="border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="font-size:14px;font-weight:600">✈️ Telegram</span><label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-light)"><input type="checkbox" id="tgEnabled" style="width:auto">启用</label></div><input type="text" id="pushTgKey" placeholder="粘贴 Chat ID（纯数字）" style="margin-bottom:8px"><div style="font-size:11px;color:var(--text-light);line-height:1.5;margin-bottom:8px">向 <a href="https://t.me/jinhui_kechengbiao_bot" target="_blank" style="color:var(--primary)">@jinhui_kechengbiao_bot</a> 发消息后获取 Chat ID</div><label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:6px"><input type="checkbox" id="tgAuto" style="width:auto" onchange="toggleRow('tgTimeRow',this.checked)">每天自动推送</label><div id="tgTimeRow" style="display:none;padding-left:24px;margin-bottom:4px"><span style="font-size:12px;color:var(--text-light)">时间：</span><select id="tgHour" style="padding:3px 6px;border:1px solid var(--border);border-radius:6px;font-size:12px"><option value="7">7:00</option><option value="7.5">7:30</option><option value="8" selected>8:00</option></select></div></div><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById('pushModal').classList.remove('show')" style="width:100%;margin-top:8px">取消</button></div></div>`;

html = html.substring(0, i) + newModal + html.substring(j);
console.log('Modal replaced');

// 2. 替换 openPushSettings + togglePushTime
const oldOpen = html.indexOf('function openPushSettings');
const oldOpenEnd = html.indexOf('function savePushSettings');
if (oldOpen < 0 || oldOpenEnd < 0) { console.log('openPushSettings block not found'); process.exit(1); }

const newOpenBlock = `function openPushSettings(){const cfg=getPushConfig()||{};var wx=cfg.wx||{},tg=cfg.tg||{};document.getElementById("wxEnabled").checked=wx.enabled!==false;document.getElementById("tgEnabled").checked=tg.enabled===true;document.getElementById("pushWxKey").value=wx.key||"";document.getElementById("pushTgKey").value=tg.key||"";document.getElementById("wxAuto").checked=wx.auto===true;document.getElementById("tgAuto").checked=tg.auto===true;document.getElementById("wxHour").value=String(wx.pushHour||8);document.getElementById("tgHour").value=String(tg.pushHour||8);toggleRow("wxTimeRow",wx.auto===true);toggleRow("tgTimeRow",tg.auto===true);document.getElementById("pushModal").classList.add("show")}
function toggleRow(id,show){var el=document.getElementById(id);if(el){el.style.display=show?"block":"none"}}
`;

html = html.substring(0, oldOpen) + newOpenBlock + html.substring(oldOpenEnd);
console.log('openPushSettings replaced');

// 3. 替换 savePushSettings
const oldSave = html.indexOf('function savePushSettings');
const oldSaveEnd = html.indexOf('function sendOne');
if (oldSave < 0 || oldSaveEnd < 0) { console.log('savePushSettings not found'); process.exit(1); }

const newSave = `function savePushSettings(){var wxEnabled=document.getElementById("wxEnabled").checked;var tgEnabled=document.getElementById("tgEnabled").checked;var wxKey=document.getElementById("pushWxKey").value.trim();var tgKey=document.getElementById("pushTgKey").value.trim();var wxAuto=document.getElementById("wxAuto").checked;var tgAuto=document.getElementById("tgAuto").checked;var wxHour=parseFloat(document.getElementById("wxHour").value)||8;var tgHour=parseFloat(document.getElementById("tgHour").value)||8;if(wxEnabled&&!wxKey){showToast("请填写微信 SendKey");return}if(tgEnabled&&!tgKey){showToast("请填写 Telegram Chat ID");return}if(!wxEnabled&&!tgEnabled){showToast("请至少启用一个渠道");return}savePushConfig({wx:{enabled:wxEnabled,key:wxKey,auto:wxAuto,pushHour:wxHour},tg:{enabled:tgEnabled,key:tgKey,auto:tgAuto,pushHour:tgHour}});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}
`;

html = html.substring(0, oldSave) + newSave + html.substring(oldSaveEnd);
console.log('savePushSettings replaced');

// 4. 替换 autoPushCheck
const oldCheck = html.indexOf('function autoPushCheck');
const oldCheckEnd = html.indexOf('function updateAccountUI');
if (oldCheck < 0 || oldCheckEnd < 0) { console.log('autoPushCheck not found'); process.exit(1); }

const newCheck = `function autoPushCheck(){const cfg=getPushConfig();if(!cfg)return;const now=new Date();const dateKey=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();var curMin=now.getHours()*60+now.getMinutes();function checkChannel(ch,name){if(!ch||!ch.enabled||!ch.auto||!ch.key)return;var last=localStorage.getItem("kc_autopush_"+name+"_"+dateKey);if(last)return;var ph=ch.pushHour||8;var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);if(curMin>=tgtMin&&curMin<tgtMin+60){sendOne(name,ch.key,buildTodaySchedule(),"今日课程安排","✅ "+(name==="tg"?"Telegram":"微信")+"已推送");localStorage.setItem("kc_autopush_"+name+"_"+dateKey,"1")}}checkChannel(cfg.wx,"wx");checkChannel(cfg.tg,"tg")}
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