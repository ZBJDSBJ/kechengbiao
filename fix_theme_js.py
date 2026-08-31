f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 修复主题切换函数 - 在 shareLink 前插入
old = 'function shareLink() {\ntry {'
new = """var themes=["default","green","orange","pink","dark"];var themeNames=["\\u84DD\\u7D2B","\\u6E05\\u65B0\\u7EFF","\\u6696\\u9633\\u6A59","\\u6A31\\u82B1\\u7C89","\\u6697\\u591C"];function initTheme(){var t=localStorage.getItem("curriculum-theme")||"default";document.documentElement.setAttribute("data-theme",t);updateThemeBtn(t)}function cycleTheme(){var cur=document.documentElement.getAttribute("data-theme")||"default";var idx=themes.indexOf(cur);var next=themes[(idx+1)%themes.length];document.documentElement.setAttribute("data-theme",next);localStorage.setItem("curriculum-theme",next);updateThemeBtn(next)}function updateThemeBtn(t){var idx=themes.indexOf(t);var btn=document.getElementById("themeBtn");if(btn){btn.innerHTML="\\u{1F3A8} "+themeNames[idx>=0?idx:0]}}function shareLink() {
try {"""

if old in html:
    html = html.replace(old, new, 1)
    print("Theme JS functions added!")
else:
    print("shareLink pattern not found!")

# 2. 确保初始化时调用 initTheme
# 搜索现有的初始化代码
if 'initTheme();' not in html:
    # 在 </script> 前添加 initTheme 调用
    old_script_end = '</script>'
    # 找到最后一个 </script>
    last_script = html.rfind(old_script_end)
    if last_script > 0:
        html = html[:last_script] + 'initTheme();\n' + html[last_script:]
        print("initTheme() call added!")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))