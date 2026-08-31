f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 找到 pushToday 和 testPush 函数并替换为直接调用 Server酱
i = html.find('function pushToday(){')
j = html.find('function testPush(){')
if j < 0:
    print("Functions not found!")
    exit()

# 找到 testPush 结束位置
end = html.find('}function ', j)
if end < 0:
    end = html.find('}\nfunction ', j)
    end += 1

new_funcs = """function pushToday(){const cfg=getPushConfig();if(!cfg||!cfg.uid){showToast("请先配置SendKey");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");fetch("https://sctapi.ftqq.com/"+cfg.uid+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent("今日课程安排")+"&desp="+encodeURIComponent(content)}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 已推送到微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 推送失败，请检查网络")})}function testPush(){const key=document.getElementById("pushUid").value.trim();if(!key){showToast("请先填入SendKey");return}showToast("正在发送测试消息...");fetch("https://sctapi.ftqq.com/"+key+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent("测试推送")+"&desp="+encodeURIComponent("## ✅ 测试推送\\n\\n这是一条测试消息，收到说明配置成功！")}).then(r=>r.json()).then(data=>{if(data.code===0){showToast("✅ 发送成功！请查看微信")}else{showToast("❌ "+(data.message||data.msg||"推送失败"))}}).catch(err=>{showToast("❌ 网络错误，请稍后重试")})}"""

html = html[:i] + new_funcs + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Push functions updated to direct call! Size:", len(html.encode('utf-8')))