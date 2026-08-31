f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 替换推送设置弹窗
old_modal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 微信推送设置</h3><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:13px;font-weight:600;margin-bottom:10px">第1步：微信扫码订阅应用</div><img src="https://wxpusher.zjiecode.com/api/qrcode/ypRdWm9oT63QrLutxJuz18xoUZfK9Uo0TuMn4LoKawXtjNQHO55sVPq2N8ZaY1PE.jpg" style="width:180px;height:180px;border-radius:8px;background:#fff;padding:4px" alt="订阅二维码"><div style="color:#fff;font-size:11px;margin-top:8px;opacity:0.9">↑ 打开微信扫一扫，关注并订阅</div></div><div style="background:#fff3cd;border:1px solid #ffeaa7;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#856404">⚠️ 必须扫描上方二维码订阅应用，仅关注公众号<b>无法</b>接收推送！</div><div style="font-size:13px;color:var(--text-light);margin-bottom:6px">第2步：填入您的 UID</div><div style="font-size:11px;color:var(--text-light);margin-bottom:8px">扫码订阅后，在 <a href="https://wxpusher.zjiecode.com/" target="_blank" style="color:var(--primary)">WxPusher官网</a> → 用户管理中查看 UID</div><input type="text" id="pushUid" placeholder="例如：UID_xxxxxxxx" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>'

new_modal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 微信推送设置</h3><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">PushPlus 微信推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 访问 <a href="https://www.pushplus.plus/" target="_blank" style="color:#fff;text-decoration:underline">pushplus.plus</a> 微信扫码登录<br>② 关注公众号，复制首页的 <b>token</b><br>③ 将 token 填入下方</div></div><input type="text" id="pushUid" placeholder="粘贴您的 PushPlus token" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>'

if old_modal in html:
    html = html.replace(old_modal, new_modal)
    print("Modal replaced!")
else:
    print("Modal NOT found!")

# 2. 替换推送按钮文字（如果有 WxPusher 字样）
html = html.replace('📱 WxPusher推送', '📱 微信推送')
html = html.replace('WxPusher推送', '微信推送')

# 3. 替换 pushToday 和 testPush 函数
old_func = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置UID");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,summary:"今日课程安排",uids:[cfg.uid]})}).then(r=>r.json()).then(data=>{if(data.success&&data.data&&data.data.length>0){const r=data.data[0];if(r.code===1000){showToast("✅ 已推送到微信")}else{showToast("❌ "+(r.status||r.message||"发送失败"))}}else{showToast("❌ 推送失败:"+(data.msg||data.message||data.error||"未知错误"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const uid=document.getElementById("pushUid").value.trim();if(!uid){showToast("请先填入UID");return}showToast("正在发送测试消息...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"## ✅ 测试推送\\n\\n这是一条测试消息，如果您在微信中收到了说明配置成功！","summary":"测试推送",uids:[uid]})}).then(r=>r.json()).then(data=>{if(data.success&&data.data&&data.data.length>0){const r=data.data[0];if(r.code===1000){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(r.status||r.message||"发送失败"))}}else{showToast("❌ 失败:"+(data.msg||data.message||data.error||"未知错误"))}}).catch(err=>{showToast("❌ 网络错误")})}'

new_func = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置token");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,title:"今日课程安排",token:cfg.uid})}).then(r=>r.json()).then(data=>{if(data.code===200){showToast("✅ 已推送到微信")}else{showToast("❌ "+(data.msg||data.message||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const token=document.getElementById("pushUid").value.trim();if(!token){showToast("请先填入token");return}showToast("正在发送测试消息...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"## ✅ 测试推送\\n\\n这是一条测试消息，收到说明配置成功！","title":"测试推送",token:token})}).then(r=>r.json()).then(data=>{if(data.code===200){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(data.msg||data.message||"推送失败"))}}).catch(err=>{showToast("❌ 网络错误")})}'

if old_func in html:
    html = html.replace(old_func, new_func)
    print("Functions replaced!")
else:
    print("Functions NOT found!")

# 4. 保存
f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))