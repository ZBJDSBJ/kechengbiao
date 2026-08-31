f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 在 :root 后添加主题变量定义
old_root_end = '--grad-header:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);\n}'

new_themes = """--grad-header:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);
}
[data-theme="green"]{--primary:#10B981;--primary-dark:#059669;--primary-light:#34D399;--bg:#F0FDF4;--morning:#F0FDF4;--noon:#FEF3C7;--afternoon:#ECFDF5;--delay:#F5F3FF;--grad-header:linear-gradient(135deg,#10B981 0%,#059669 50%,#34D399 100%);--shadow-sm:0 1px 3px rgba(16,185,129,0.04),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(16,185,129,0.06),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(16,185,129,0.08),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="orange"]{--primary:#F97316;--primary-dark:#EA580C;--primary-light:#FB923C;--bg:#FFF7ED;--morning:#FFF7ED;--noon:#FEF3C7;--afternoon:#FFFBEB;--delay:#FFF7ED;--grad-header:linear-gradient(135deg,#F97316 0%,#EA580C 50%,#FB923C 100%);--shadow-sm:0 1px 3px rgba(249,115,22,0.04),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(249,115,22,0.06),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(249,115,22,0.08),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="pink"]{--primary:#EC4899;--primary-dark:#DB2777;--primary-light:#F472B6;--bg:#FDF2F8;--morning:#FDF2F8;--noon:#FEF3C7;--afternoon:#FCE7F3;--delay:#FDF2F8;--grad-header:linear-gradient(135deg,#EC4899 0%,#DB2777 50%,#F472B6 100%);--shadow-sm:0 1px 3px rgba(236,72,153,0.04),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(236,72,153,0.06),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(236,72,153,0.08),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="dark"]{--primary:#818CF8;--primary-dark:#6366F1;--primary-light:#A5B4FC;--bg:#0F172A;--card-bg:#1E293B;--text:#E2E8F0;--text-light:#94A3B8;--text-lighter:#64748B;--border:#334155;--border-light:#1E293B;--morning:#1E293B;--noon:#422006;--afternoon:#1E293B;--delay:#1E293B;--grad-header:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);--shadow-sm:0 1px 3px rgba(0,0,0,0.2);--shadow:0 4px 16px rgba(0,0,0,0.3);--shadow-lg:0 12px 36px rgba(0,0,0,0.4)}
[data-theme="dark"] .schedule td.empty{background:#0F172A;color:var(--text-lighter)}
[data-theme="dark"] .schedule .period-col{background:#0F172A}
[data-theme="dark"] .modal-content{background:#1E293B;color:#E2E8F0}
[data-theme="dark"] .toast{background:rgba(30,41,59,0.98)}"""

html = html.replace(old_root_end, new_themes, 1)
print("Theme CSS added")

# 2. 在工具栏添加主题切换按钮（在推送设置按钮前面添加）
old_push_btn = '<button class="btn-sm" onclick="pushToday()">📱 推送今日课</button>'
new_push_btn = '<button class="btn-sm" onclick="cycleTheme()" id="themeBtn">🎨 主题</button><button class="btn-sm" onclick="pushToday()">📱 推送今日课</button>'
html = html.replace(old_push_btn, new_push_btn, 1)
print("Theme button added")

# 3. 添加主题切换 JS 函数（在 shareLink 函数前添加）
old_share = 'function shareLink(){'
new_share = 'var themes=["default","green","orange","pink","dark"];var themeNames=["蓝紫","清新绿","暖阳橙","樱花粉","暗夜"];function initTheme(){var t=localStorage.getItem("curriculum-theme")||"default";document.documentElement.setAttribute("data-theme",t);updateThemeBtn(t)}function cycleTheme(){var cur=document.documentElement.getAttribute("data-theme")||"default";var idx=themes.indexOf(cur);var next=themes[(idx+1)%themes.length];document.documentElement.setAttribute("data-theme",next);localStorage.setItem("curriculum-theme",next);updateThemeBtn(next)}function updateThemeBtn(t){var idx=themes.indexOf(t);var btn=document.getElementById("themeBtn");if(btn){btn.innerHTML="🎨 "+themeNames[idx>=0?idx:0]}}function shareLink(){'
html = html.replace(old_share, new_share, 1)
print("Theme JS added")

# 4. 在页面加载时初始化主题（在 DOMContentLoaded 或 init 调用处添加）
# 找到初始化代码
old_init = 'buildCalendar();'
new_init = 'initTheme();buildCalendar();'
if old_init in html:
    html = html.replace(old_init, new_init, 1)
    print("Theme init added")
else:
    # 尝试其他位置
    old_init2 = 'buildSchedule();'
    new_init2 = 'initTheme();buildSchedule();'
    if old_init2 in html:
        html = html.replace(old_init2, new_init2, 1)
        print("Theme init added (alt)")
    else:
        print("Init location not found, trying another...")
        # 直接在 initTheme 函数定义后调用
        old_def = 'function updateThemeBtn(t){var idx=themes.indexOf(t);var btn=document.getElementById("themeBtn");if(btn){btn.innerHTML="🎨 "+themeNames[idx>=0?idx:0]}}'
        new_def = 'function updateThemeBtn(t){var idx=themes.indexOf(t);var btn=document.getElementById("themeBtn");if(btn){btn.innerHTML="🎨 "+themeNames[idx>=0?idx:0]}}initTheme();'
        html = html.replace(old_def, new_def, 1)
        print("Theme init added (inline)")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))