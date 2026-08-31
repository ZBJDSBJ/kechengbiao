const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换 openPushSettings - 恢复渠道
const oldOpen = 'function openPushSettings(){const cfg=getPushConfig()||{};document.getElementById("pushUid").value=cfg.uid||"";document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}';
const newOpen = 'function openPushSettings(){const cfg=getPushConfig()||{};setChannel(cfg.channel||"wx");document.getElementById("pushUid").value=cfg.uid||"";document.getElementById("pushAuto").checked=cfg.auto||false;document.getElementById("pushModal").classList.add("show")}function setChannel(ch){var isWx=ch!=="tg";document.getElementById("wxGuide").style.display=isWx?"block":"none";document.getElementById("tgGuide").style.display=isWx?"none":"block";var uid=document.getElementById("pushUid");uid.placeholder=isWx?"粘贴您的 SendKey":"粘贴您的 Chat ID（数字）";document.getElementById("chanWx").style.background=isWx?"var(--primary)":"";document.getElementById("chanWx").style.color=isWx?"#fff":"";document.getElementById("chanTg").style.background=!isWx?"var(--primary)":"";document.getElementById("chanTg").style.color=!isWx?"#fff":""}';
if (!html.includes(oldOpen)) { console.log('openPushSettings not found'); process.exit(1); }
html = html.replace(oldOpen, newOpen, 1);
console.log('openPushSettings updated');

// 2. 替换 savePushSettings - 保存渠道
const oldSave = 'function savePushSettings(){const uid=document.getElementById("pushUid").value.trim();const auto=document.getElementById("pushAuto").checked;if(!uid){showToast("请填写UID");return}savePushConfig({uid,auto});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}';
const newSave = 'function savePushSettings(){const uid=document.getElementById("pushUid").value.trim();const auto=document.getElementById("pushAuto").checked;const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";if(!uid){showToast("请填写"+(channel==="tg"?"Chat ID":"SendKey"));return}savePushConfig({uid,auto,channel});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}';
if (!html.includes(oldSave)) { console.log('savePushSettings not found'); process.exit(1); }
html = html.replace(oldSave, newSave, 1);
console.log('savePushSettings updated');

// 3. 替换 pushToday - 支持双渠道
const oldPush = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置SendKey");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("https://sctapi.ftqq.com/"+cfg.uid+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent("今日课程安排")+"&desp="+encodeURIComponent(content)}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 已推送到微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}';
const newPush = 'function sendPush(cfg,content,title,okMsg){if(cfg.channel==="tg"){fetch("/api/tg-push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:cfg.uid,text:"*"+title+"*\\n\\n"+content})}).then(r=>r.json()).then(data=>{if(data.ok){showToast(okMsg)}else{showToast("❌ "+(data.description||data.error||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}else{fetch("https://sctapi.ftqq.com/"+cfg.uid+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent(title)+"&desp="+encodeURIComponent(content)}).then(r=>r.json()).then(data=>{if(data.code===0){showToast(okMsg)}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}}function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置推送");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");sendPush(cfg,content,"今日课程安排","✅ 已推送到"+(cfg.channel==="tg"?"Telegram":"微信"))}';
if (!html.includes(oldPush)) { console.log('pushToday not found'); process.exit(1); }
html = html.replace(oldPush, newPush, 1);
console.log('pushToday updated');

// 4. 替换 testPush - 支持双渠道
const oldTest = 'function testPush(){const key=document.getElementById("pushUid").value.trim();if(!key){showToast("请先填入SendKey");return}showToast("正在发送测试消息...");fetch("https://sctapi.ftqq.com/"+key+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent("测试推送")+"&desp="+encodeURIComponent("## ✅ 测试推送\\n\\n这是一条测试消息，收到说明配置成功！")}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 网络错误，请稍后重试")})}';
const newTest = 'function testPush(){const key=document.getElementById("pushUid").value.trim();if(!key){showToast("请先填入"+(document.getElementById("tgGuide").style.display==="block"?"Chat ID":"SendKey"));return}const channel=document.getElementById("tgGuide").style.display==="block"?"tg":"wx";showToast("正在发送测试消息...");sendPush({uid:key,channel:channel},"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ 发送成功！请查看"+(channel==="tg"?"Telegram":"微信"))}';
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