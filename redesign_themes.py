f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 找到主题 CSS 范围
start = html.find('[data-theme="green"]')
end = html.find('body{font-family', start)

old_themes = html[start:end]

new_themes = """[data-theme="green"]{--primary:#10B981;--primary-dark:#059669;--primary-light:#34D399;--bg:#F0FDF4;--morning:#ECFDF5;--noon:#FEF3C7;--afternoon:#F0FDF4;--delay:#CCFBF1;--grad-header:linear-gradient(135deg,#10B981 0%,#059669 50%,#34D399 100%);--shadow-sm:0 1px 3px rgba(16,185,129,0.05),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(16,185,129,0.08),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(16,185,129,0.1),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="green"] .row-morning .period-col{border-left-color:#10B981}
[data-theme="green"] .row-noon .period-col{border-left-color:#F59E0B}
[data-theme="green"] .row-afternoon .period-col{border-left-color:#059669}
[data-theme="green"] .row-delay .period-col{border-left-color:#06B6D4}
[data-theme="orange"]{--primary:#F97316;--primary-dark:#EA580C;--primary-light:#FB923C;--bg:#FFF7ED;--morning:#FFEDD5;--noon:#FEF3C7;--afternoon:#FFFBEB;--delay:#FEE2E2;--grad-header:linear-gradient(135deg,#F97316 0%,#EA580C 50%,#FB923C 100%);--shadow-sm:0 1px 3px rgba(249,115,22,0.05),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(249,115,22,0.08),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(249,115,22,0.1),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="orange"] .row-morning .period-col{border-left-color:#F97316}
[data-theme="orange"] .row-noon .period-col{border-left-color:#F59E0B}
[data-theme="orange"] .row-afternoon .period-col{border-left-color:#EAB308}
[data-theme="orange"] .row-delay .period-col{border-left-color:#EF4444}
[data-theme="pink"]{--primary:#EC4899;--primary-dark:#DB2777;--primary-light:#F472B6;--bg:#FDF2F8;--morning:#FCE7F3;--noon:#FEF3C7;--afternoon:#FBCFE8;--delay:#FAE8FF;--grad-header:linear-gradient(135deg,#EC4899 0%,#DB2777 50%,#F472B6 100%);--shadow-sm:0 1px 3px rgba(236,72,153,0.05),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(236,72,153,0.08),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(236,72,153,0.1),0 4px 12px rgba(0,0,0,0.04)}
[data-theme="pink"] .row-morning .period-col{border-left-color:#EC4899}
[data-theme="pink"] .row-noon .period-col{border-left-color:#F59E0B}
[data-theme="pink"] .row-afternoon .period-col{border-left-color:#F472B6}
[data-theme="pink"] .row-delay .period-col{border-left-color:#A855F7}
[data-theme="dark"]{--primary:#818CF8;--primary-dark:#6366F1;--primary-light:#A5B4FC;--bg:#0F172A;--card-bg:#1E293B;--text:#E2E8F0;--text-light:#94A3B8;--text-lighter:#64748B;--border:#334155;--border-light:#1E293B;--morning:#1E2B4D;--noon:#3D2A0E;--afternoon:#0F2E1E;--delay:#2A1B3D;--grad-header:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);--shadow-sm:0 1px 3px rgba(0,0,0,0.3);--shadow:0 4px 16px rgba(0,0,0,0.4);--shadow-lg:0 12px 36px rgba(0,0,0,0.5)}
[data-theme="dark"] .schedule td.empty{background:#0F172A;color:var(--text-lighter)}
[data-theme="dark"] .schedule .period-col{background:#141F36}
[data-theme="dark"] .schedule thead th{background:linear-gradient(135deg,#6366F1,#8B5CF6)}
[data-theme="dark"] .schedule thead th:first-child{background:linear-gradient(135deg,#4F46E5,#6366F1)}
[data-theme="dark"] .section-divider td{background:linear-gradient(90deg,transparent,#334155,transparent);color:var(--text-light)}
[data-theme="dark"] .modal-content{background:#1E293B;color:#E2E8F0}
[data-theme="dark"] .modal-content h3{color:#A5B4FC}
[data-theme="dark"] .toast{background:rgba(30,41,59,0.98)}
[data-theme="dark"] .stat-card{background:#1E293B}
[data-theme="dark"] .stat-card .num{color:#A5B4FC}
[data-theme="dark"] .calendar-day:hover{background:#334155}
[data-theme="dark"] .calendar-day.empty:hover{background:transparent}
[data-theme="dark"] .week-cell{background:#1E293B}
[data-theme="dark"] .week-cell:hover{box-shadow:0 4px 16px rgba(0,0,0,0.3)}
[data-theme="dark"] .week-cell.today{background:linear-gradient(135deg,#312E81,#4C1D95)}
[data-theme="dark"] .btn-sm{background:#334155;color:#A5B4FC;border-color:#475569}
[data-theme="dark"] .btn-sm:hover{background:#6366F1;color:#fff;border-color:#6366F1}
[data-theme="dark"] .btn.outline{color:#A5B4FC;border-color:#6366F1}
[data-theme="dark"] .toolbar{background:#1E293B}
[data-theme="dark"] .account-bar{background:#1E293B}
[data-theme="dark"] .calendar-card{background:#1E293B}
[data-theme="dark"] .schedule-wrapper{background:#1E293B}
"""

html = html[:start] + new_themes + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Themes redesigned! Size:", len(html.encode('utf-8')))