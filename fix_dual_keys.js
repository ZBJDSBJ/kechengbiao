const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换弹窗：两个独立输入框
const oldModal = '<input type="text" id="pushUid" placeholder="粘贴您的 SendKey" style="margin-bottom:8px"><label';
const newModal = '<input type="text" id="pushWxKey" placeholder="粘贴您的 SendKey" style="margin-bottom:8px"><input type="text" id="pushTgKey" placeholder="粘贴您的 Chat ID（数字）" style="margin-bottom:8px;display:none"><label';
if (!html.includes(oldModal)) { console.log('Modal input not found'); process.exit(1); }
html = html.replace(oldModal, newModal, 1);
console.log('Modal: dual inputs added');

// 2. 替换 setChannel - 切换显示对应输入框
const oldSetCh = 'function setChannel(ch){var isWx=ch!=="tg";document.getElementById("wxGuide").style.display=isWx?"block":"none";document.getElementById("tgGuide").style.display=isWx?"none":"block";var uid=document.getElementById("pushUid");uid.placeholder=isWx?"粘贴您的 SendKey":"粘贴您的 Chat ID（数字）";document.getElementById("chanWx").style.background=isWx?"var(--primary)":"";document.getElementById("chanWx").style.color=isWx?"#fff":"";document.getElementById("chanTg").style.background=!isWx?"var(--primary)":"";document.getElementById("chanTg").style.color=!isWx?"#fff":""}';
const newSetCh = 'function setChannel(ch){var isWx=ch!=="tg";document.getElementById("wxGuide").style.display=isWx?"block":"none";document.getElementById("tgGuide").style.display=isWx?"none":"block";document.getElementById("pushWxKey").style.display=isWx?"block":"none";document.getElementById("pushTgKey").style.display=isWx?"none":"block";document.getElementById("chanWx").style.background=isWx?"var(--primary)":"";document.getElementById("chanWx").style.color=isWx?"#fff":"";document.getElementById("chanTg").style.background=!isWx?"var(--primary)":"";document.getElementById("chanTg").style.color=!isWx?"#fff":""}';
if (!html.includes(oldSetCh)) { console.log('setChannel not found'); process.exit(1); }
html = html.replace(oldSetCh, newSetCh, 1);
console.log('setChannel updated');

// 3. 替换 openPushSettings - 恢复两个渠道的 key
const oldOpen = 'function openPushSettings(){const cfg=getPushConfig()||{};setChannel(cfg.channel||"wx");document.getElementById("pushUid").value=cfg.uid||"";document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}';
const newOpen = 'function openPushSettings(){const cfg=getPushConfig()||{};setChannel(cfg.channel||"wx");document.getElementById("pushWxKey").value=cfg.wxKey||"";document.getElementById("pushTgKey").value=cfg.tgKey||"";document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}';
if (!html.includes(oldOpen)) { console.log('openPushSettings not found'); process.exit(1); }
html = html.replace(oldOpen, newOpen, 1);
console.log('openPushSettings updated');

// 4. 替换 savePushSettings - 分别保存两个 key
const oldSave = 'function savePushSettings(){const uid=document.getElementById("pushUid").value.trim();const auto=document.getElementById("pushAuto").checked;const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";if(!uid){showToast("请填写"+(channel==="tg"?"Chat ID":"SendKey"));return}savePushConfig({uid,auto,channel});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}';
const newSave = 'function savePushSettings(){const wxKey=document.getElementById("pushWxKey").value.trim();const tgKey=document.getElementById("pushTgKey").value.trim();const auto=document.getElementById("pushAuto").checked;const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";if(channel==="tg"&&!tgKey){showToast("请填写Chat ID");return}if(channel==="wx"&&!wxKey){showToast("请填写SendKey");return}savePushConfig({wxKey,tgKey,auto,channel});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}';
if (!html.includes(oldSave)) { console.log('savePushSettings not found'); process.exit(1); }
html = html.replace(oldSave, newSave, 1);
console.log('savePushSettings updated');

// 5. 替换 pushToday - 使用对应渠道的 key
const oldPush = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置推送");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");sendPush(cfg,content,"今日课程安排","✅ 已推送到"+(cfg.channel==="tg"?"Telegram":"微信"))}';
const newPush = 'function pushToday(){const cfg=getPushConfig();if(!cfg){showToast("请先配置推送");openPushSettings();return}const key=cfg.channel==="tg"?cfg.tgKey:cfg.wxKey;if(!key){showToast("请先配置"+(cfg.channel==="tg"?"Chat ID":"SendKey"));openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");sendPush({uid:key,channel:cfg.channel},content,"今日课程安排","✅ 已推送到"+(cfg.channel==="tg"?"Telegram":"微信"))}';
if (!html.includes(oldPush)) { console.log('pushToday not found'); process.exit(1); }
html = html.replace(oldPush, newPush, 1);
console.log('pushToday updated');

// 6. 替换 testPush - 使用当前渠道的 key
const oldTest = 'function testPush(){const key=document.getElementById("pushUid").value.trim();if(!key){showToast("请先填入"+(document.getElementById("tgGuide").style.display==="block"?"Chat ID":"SendKey"));return}const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";showToast("正在发送测试消息...");sendPush({uid:key,channel:channel},"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ 发送成功！请查看"+(channel==="tg"?"Telegram":"微信"))}';
const newTest = 'function testPush(){const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";const key=channel==="tg"?document.getElementById("pushTgKey").value.trim():document.getElementById("pushWxKey").value.trim();if(!key){showToast("请先填入"+(channel==="tg"?"Chat ID":"SendKey"));return}showToast("正在发送测试消息...");sendPush({uid:key,channel:channel},"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ 发送成功！请查看"+(channel==="tg"?"Telegram":"微信"))}';
if (!html.includes(oldTest)) { console.log('testPush not found'); process.exit(1); }
html = html.replace(oldTest, newTest, 1);
console.log('testPush updated');

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