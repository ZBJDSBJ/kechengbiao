f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 替换推送设置弹窗
old_modal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 微信推送设置</h3><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">PushPlus 微信推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 访问 <a href="https://www.pushplus.plus/" target="_blank" style="color:#fff;text-decoration:underline">pushplus.plus</a> 微信扫码登录<br>② 关注公众号，复制首页的 <b>token</b><br>③ 将 token 填入下方</div></div><input type="text" id="pushUid" placeholder="粘贴您的 PushPlus token" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>'

new_modal = '<div class="modal auth-modal" id="pushModal"><div class="modal-content" style="max-width:380px"><h3>📱 微信推送设置</h3><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:16px;margin-bottom:14px;text-align:center"><div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:8px">Server酱 微信推送</div><div style="color:#fff;font-size:12px;opacity:0.9;line-height:1.6">① 访问 <a href="https://sct.ftqq.com/" target="_blank" style="color:#fff;text-decoration:underline">sct.ftqq.com</a> 微信扫码登录<br>② 复制首页的 <b>SendKey</b><br>③ 将 SendKey 填入下方</div></div><input type="text" id="pushUid" placeholder="粘贴您的 SendKey" style="margin-bottom:8px"><label style="font-size:13px;display:flex;align-items:center;gap:6px;margin-bottom:12px"><input type="checkbox" id="pushAuto" style="width:auto">每天8:00自动推送今日课程</label><button class="btn" onclick="savePushSettings()" style="width:100%">保存设置</button><button class="btn-sm" onclick="testPush()" style="width:100%;margin-top:8px">测试推送</button><button class="btn-sm" onclick="document.getElementById(\'pushModal\').classList.remove(\'show\')" style="width:100%;margin-top:8px">取消</button></div></div>'

if old_modal in html:
    html = html.replace(old_modal, new_modal)
    print("Modal replaced!")
else:
    print("Modal NOT found!")

# 2. 替换推送函数
old_func = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置token");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,title:"今日课程安排",token:cfg.uid})}).then(r=>r.json()).then(data=>{if(data.code===200){showToast("✅ 已推送到微信")}else{showToast("❌ "+(data.msg||data.message||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const token=document.getElementById("pushUid").value.trim();if(!token){showToast("请先填入token");return}showToast("正在发送测试消息...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"## ✅ 测试推送\\n\\n这是一条测试消息，收到说明配置成功！","title":"测试推送",token:token})}).then(r=>r.json()).then(data=>{if(data.code===200){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(data.msg||data.message||"推送失败"))}}).catch(err=>{showToast("❌ 网络错误")})}'

new_func = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置SendKey");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,title:"今日课程安排",key:cfg.uid})}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 已推送到微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const key=document.getElementById("pushUid").value.trim();if(!key){showToast("请先填入SendKey");return}showToast("正在发送测试消息...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"## ✅ 测试推送\\n\\n这是一条测试消息，收到说明配置成功！","title":"测试推送",key:key})}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 网络错误")})}'

if old_func in html:
    html = html.replace(old_func, new_func)
    print("Functions replaced!")
else:
    print("Functions NOT found!")

# 3. 保存
f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))