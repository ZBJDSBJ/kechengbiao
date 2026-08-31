const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 替换推送设置弹窗：添加渠道选择（Server酱 / Telegram）
const oldModal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 微信推送设置</h3><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">Server酱 微信推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 访问 <a href="https://sct.ftqq.com/" target="_blank" style="color:#fff;text-decoration:underline">sct.ftqq.com</a> 微信扫码登录<br>② 复制首页的 <b>SendKey</b><br>③ 将 SendKey 填入下方</div></div><input type="text" id="pushUid" placeholder="粘贴您的 SendKey" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>';

if (!html.includes(oldModal)) {
  console.log('Modal pattern not found! Searching current modal...');
  const i = html.indexOf('<div class="modal auth-modal" id="pushModal"');
  const j = html.indexOf('</div></div>', i) + 12;
  console.log('Found modal at', i, 'to', j);
  console.log(html.substring(i, i + 400));
  process.exit(1);
}

const newModal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 消息推送设置</h3><div style="display:flex;gap:8px;margin-bottom:14px"><button class="btn-sm" id="chanWx" onclick="setChannel(\'wx\')" style="flex:1">💬 微信</button><button class="btn-sm" id="chanTg" onclick="setChannel(\'tg\')" style="flex:1">✈️ Telegram</button></div><div id="wxGuide" style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">Server酱 微信推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 访问 <a href="https://sct.ftqq.com/" target="_blank" style="color:#fff;text-decoration:underline">sct.ftqq.com</a> 微信扫码登录<br>② 复制首页的 <b>SendKey</b><br>③ 将 SendKey 填入下方</div></div><div id="tgGuide" style="display:none;background:linear-gradient(135deg,#229ED9,#1E7EB8);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">Telegram 推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 在 Telegram 关注本应用的 Bot<br>② 向 Bot 发送任意消息<br>③ 获取你的 Chat ID 填入下方</div></div><input type="text" id="pushUid" placeholder="粘贴您的 SendKey" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>';

html = html.replace(oldModal, newModal, 1);
console.log('Modal updated with channel selector');

fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/index.html', html);
console.log('Saved! Size:', html.length);