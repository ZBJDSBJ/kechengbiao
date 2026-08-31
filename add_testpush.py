f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

old = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置UID");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,summary:"今日课程安排",uids:[cfg.uid]})}).then(r=>r.json()).then(data=>{if(data.success&&data.data&&data.data.length>0){const r=data.data[0];if(r.code===1000){showToast("✅ 已推送到微信")}else{showToast("❌ "+(r.status||r.message||"发送失败"))}}else{showToast("❌ 推送失败:"+(data.msg||data.message||data.error||"未知错误"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}'

new = 'function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置UID");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:content,summary:"今日课程安排",uids:[cfg.uid]})}).then(r=>r.json()).then(data=>{if(data.success&&data.data&&data.data.length>0){const r=data.data[0];if(r.code===1000){showToast("✅ 已推送到微信")}else{showToast("❌ "+(r.status||r.message||"发送失败"))}}else{showToast("❌ 推送失败:"+(data.msg||data.message||data.error||"未知错误"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const uid=document.getElementById("pushUid").value.trim();if(!uid){showToast("请先填入UID");return}showToast("正在发送测试消息...");fetch("/api/push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:"## ✅ 测试推送\\n\\n这是一条测试消息，如果您在微信中收到了说明配置成功！","summary":"测试推送",uids:[uid]})}).then(r=>r.json()).then(data=>{if(data.success&&data.data&&data.data.length>0){const r=data.data[0];if(r.code===1000){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(r.status||r.message||"发送失败"))}}else{showToast("❌ 失败:"+(data.msg||data.message||data.error||"未知错误"))}}).catch(err=>{showToast("❌ 网络错误")})}'

if old in html:
    html = html.replace(old, new)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(html)
    f.close()
    print("testPush added! Size:", len(html.encode('utf-8')))
else:
    print("Pattern not found!")