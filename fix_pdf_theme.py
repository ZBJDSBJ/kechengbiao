f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 在 exportPDF 中，创建容器后添加主题属性
old = 'container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:#fff;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',\'Microsoft YaHei\',sans-serif;";'

new = 'var curTheme=document.documentElement.getAttribute("data-theme")||"default";var themeBg=curTheme==="dark"?"#0F172A":"#fff";container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:"+themeBg+";padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',\'Microsoft YaHei\',sans-serif;";if(curTheme!=="default"){container.setAttribute("data-theme",curTheme)}'

if old in html:
    html = html.replace(old, new, 1)
    print("Theme applied to PDF export!")
else:
    print("Pattern not found!")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))