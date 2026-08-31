f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 在推送设置弹窗中添加二维码
old = '<input type="text" id="pushUid" placeholder="您的UID" style="margin-bottom:8px">'
new = '<div style="text-align:center;margin-bottom:12px"><img src="https://wxpusher.zjiecode.com/api/qrcode/ypRdWm9oT63QrLutxJuz18xoUZfK9Uo0TuMn4LoKawXtjNQHO55sVPq2N8ZaY1PE.jpg" style="width:160px;height:160px;border-radius:8px;border:1px solid var(--border)" alt="订阅二维码"><div style="font-size:12px;color:var(--text-light);margin-top:6px">👆 微信扫码订阅应用</div></div><input type="text" id="pushUid" placeholder="订阅后填入您的UID" style="margin-bottom:8px">'

if old in html:
    html = html.replace(old, new)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(html)
    f.close()
    print("Done! Size:", len(html.encode('utf-8')))
else:
    print("Pattern not found!")