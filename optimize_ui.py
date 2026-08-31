f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

css_start = html.find('<style>') + 7
css_end = html.find('</style>')

new_css = """*{margin:0;padding:0;box-sizing:border-box}
:root{
--primary:#6366F1;--primary-dark:#4F46E5;--primary-light:#818CF8;
--accent:#F59E0B;--accent-light:#FCD34D;
--bg:#EEF1F6;--card-bg:#FFFFFF;--text:#1E293B;--text-light:#64748B;--text-lighter:#94A3B8;
--border:#E2E8F0;--border-light:#F1F5F9;
--morning:#EFF6FF;--noon:#FEF3C7;--afternoon:#ECFDF5;--delay:#F5F3FF;--current:#F59E0B;
--shadow-sm:0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.02);--shadow:0 4px 16px rgba(0,0,0,0.06),0 1px 4px rgba(0,0,0,0.04);--shadow-lg:0 12px 36px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.04);
--radius:14px;--radius-lg:20px;
--grad-header:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);
}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:20px;line-height:1.6}
.container{max-width:1200px;margin:0 auto;animation:fadeUp 0.5s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.header{background:var(--grad-header);color:white;padding:32px 40px;border-radius:var(--radius-lg);margin-bottom:20px;box-shadow:0 12px 40px rgba(99,102,241,0.3);position:relative;overflow:hidden}
.header::before{content:"";position:absolute;top:-60%;right:-15%;width:320px;height:320px;background:radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%);border-radius:50%}
.header::after{content:"";position:absolute;bottom:-40%;left:-10%;width:200px;height:200px;background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%);border-radius:50%}
.header h1{font-size:28px;margin-bottom:12px;letter-spacing:1px;font-weight:700;position:relative;display:flex;align-items:center;gap:8px}
.header .info{font-size:13.5px;opacity:0.92;display:flex;flex-wrap:wrap;gap:10px 20px;position:relative}
.header .info span{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);padding:4px 12px;border-radius:20px;backdrop-filter:blur(4px)}
.calendar-card{background:var(--card-bg);border-radius:var(--radius-lg);padding:20px 24px;margin-bottom:20px;box-shadow:var(--shadow);border:1px solid var(--border-light)}
.calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px}
.calendar-title{font-size:17px;font-weight:700;color:var(--text)}
.calendar-controls{display:flex;align-items:center;gap:8px}
.calendar-nav{display:flex;gap:6px}
.calendar-nav button{background:var(--border-light);border:none;width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:17px;color:var(--primary);transition:all 0.2s;display:inline-flex;align-items:center;justify-content:center}
.calendar-nav button:hover{background:var(--primary);color:white;transform:scale(1.08)}
.btn-toggle{background:var(--primary);color:white;border:none;padding:8px 18px;border-radius:10px;cursor:pointer;font-size:13px;transition:all 0.2s;font-weight:600;box-shadow:0 2px 8px rgba(99,102,241,0.3)}
.btn-toggle:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.4)}
.calendar-week-view{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
.week-cell{border-radius:var(--radius);padding:12px 4px;text-align:center;cursor:pointer;transition:all 0.25s;border:2px solid transparent;background:var(--border-light);display:flex;flex-direction:column;align-items:center;gap:4px;min-height:92px}
.week-cell:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.week-cell .wk-dow{font-size:11px;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.week-cell .wk-day{font-size:22px;font-weight:700;color:var(--text);line-height:1}
.week-cell .wk-tag{font-size:10px;padding:2px 8px;border-radius:6px;line-height:1.4;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.week-cell.today{border-color:var(--primary);background:linear-gradient(135deg,#EEF2FF,#F5F3FF)}
.week-cell.today .wk-day{color:var(--primary)}
.week-cell.holiday{background:#FEF2F2}
.week-cell.holiday .wk-day{color:#DC2626}
.week-cell.holiday .wk-tag{background:#DC2626;color:white}
.week-cell.workday{background:#FEFCE8}
.week-cell.workday .wk-day{color:#CA8A04}
.week-cell.workday .wk-tag{background:#CA8A04;color:white}
.week-cell.schoolevent{background:#ECFDF5}
.week-cell.schoolevent .wk-day{color:#059669}
.week-cell.schoolevent .wk-tag{background:#10B981;color:white}
.week-cell.festival{background:#EFF6FF}
.week-cell.festival .wk-day{color:#2563EB}
.week-cell.festival .wk-tag{background:#3B82F6;color:white}
.week-cell.weekend:not(.holiday):not(.workday):not(.schoolevent):not(.festival) .wk-dow{color:#EF4444}
.week-cell.weekend:not(.holiday):not(.workday):not(.schoolevent):not(.festival) .wk-day{color:#EF4444}
.week-cell.other-month{opacity:0.4}
.calendar-month-view{display:none}
.calendar-month-view.active{display:block}
.calendar-week-view.hidden{display:none}
.calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.calendar-week{text-align:center;font-size:12px;font-weight:600;color:var(--text-lighter);padding:4px 0}
.calendar-week.weekend{color:#EF4444}
.calendar-day{text-align:center;padding:6px 2px;font-size:13px;border-radius:10px;cursor:pointer;position:relative;transition:all 0.15s;min-height:38px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.calendar-day:hover{background:var(--border-light);transform:scale(1.05)}
.calendar-day.empty{cursor:default}
.calendar-day.empty:hover{background:transparent;transform:none}
.calendar-day .day-num{font-weight:500}
.calendar-day .day-tag{font-size:9px;margin-top:1px;line-height:1;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.calendar-day.today{background:var(--primary);color:white;box-shadow:0 2px 8px rgba(99,102,241,0.3)}
.calendar-day.today .day-num{font-weight:700}
.calendar-day.holiday{background:#FEF2F2;color:#DC2626}
.calendar-day.holiday .day-tag{color:#DC2626;font-weight:600}
.calendar-day.workday{background:#FEFCE8;color:#CA8A04}
.calendar-day.workday .day-tag{color:#CA8A04}
.calendar-day.schoolevent{background:#ECFDF5;color:#059669}
.calendar-day.schoolevent .day-tag{color:#059669;font-weight:600}
.calendar-day.festival{background:#EFF6FF;color:#2563EB}
.calendar-day.festival .day-tag{color:#2563EB;font-weight:600}
.calendar-day.weekend:not(.holiday):not(.workday):not(.schoolevent):not(.festival){color:#EF4444}
.calendar-day.today.holiday{background:linear-gradient(135deg,var(--primary),#DC2626)}
.calendar-legend{display:flex;justify-content:center;gap:16px;margin-top:14px;font-size:11px;color:var(--text-light);flex-wrap:wrap}
.calendar-legend .lg{display:inline-flex;align-items:center;gap:4px}
.calendar-legend .dot{width:10px;height:10px;border-radius:3px;display:inline-block}
.account-bar{display:flex;align-items:center;justify-content:space-between;background:var(--card-bg);padding:14px 24px;border-radius:var(--radius);margin-bottom:16px;box-shadow:var(--shadow-sm);border:1px solid var(--border-light);flex-wrap:wrap;gap:10px}
.account-info{display:flex;align-items:center;gap:10px;font-size:14px}
.account-info .avatar{width:38px;height:38px;border-radius:50%;background:var(--grad-header);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;box-shadow:0 2px 8px rgba(99,102,241,0.3)}
.account-info .username{font-weight:600;color:var(--text)}
.account-info .guest{color:var(--text-light)}
.account-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn-sm{background:var(--border-light);color:var(--primary);border:1px solid var(--border);padding:7px 14px;border-radius:10px;cursor:pointer;font-size:13px;transition:all 0.2s;font-weight:500}
.btn-sm:hover{background:var(--primary);color:white;border-color:var(--primary);transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.2)}
.btn-sm.danger{color:#EF4444}
.btn-sm.danger:hover{background:#EF4444;color:white;border-color:#EF4444;box-shadow:0 4px 12px rgba(239,68,68,0.2)}
.btn-sm.success{color:#10B981}
.btn-sm.success:hover{background:#10B981;color:white;border-color:#10B981;box-shadow:0 4px 12px rgba(16,185,129,0.2)}
.auth-modal{display:none}
.auth-modal.show{display:flex}
.auth-modal .modal-content{max-width:360px;animation:slideDown 0.3s ease}
.auth-modal input{width:100%;padding:11px 16px;border:1px solid var(--border);border-radius:10px;font-size:14px;margin-bottom:12px;box-sizing:border-box;transition:all 0.2s}
.auth-modal input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
.auth-tabs{display:flex;gap:0;margin-bottom:16px}
.auth-tab{flex:1;padding:10px;text-align:center;cursor:pointer;border-bottom:2px solid var(--border);font-size:14px;color:var(--text-light);transition:all 0.2s;font-weight:500}
.auth-tab.active{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}
.edit-badge{display:inline-block;background:var(--accent);color:white;padding:2px 8px;border-radius:4px;font-size:11px;margin-left:8px;animation:pulse 2s infinite}
.schedule td.subject.editing{cursor:text}
.schedule td.subject.editing:hover{transform:none}
.inline-edit{width:100%;border:1px solid var(--primary);border-radius:6px;padding:3px 6px;font-size:12px;text-align:center;margin:1px 0;box-sizing:border-box}
.inline-edit:focus{outline:none;border-color:var(--primary-dark);box-shadow:0 0 0 2px rgba(99,102,241,0.1)}
.holiday-banner{display:none;background:linear-gradient(135deg,#DC2626,#EF4444);color:white;padding:14px 24px;border-radius:var(--radius);margin-bottom:16px;text-align:center;font-size:15px;font-weight:600;letter-spacing:0.5px;box-shadow:0 4px 20px rgba(220,38,38,0.3);animation:pulse 2s infinite}
.holiday-banner.show{display:block}
.toolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;background:var(--card-bg);padding:14px 24px;border-radius:var(--radius);box-shadow:var(--shadow-sm);border:1px solid var(--border-light)}
.toolbar .legend{display:flex;gap:14px;flex-wrap:wrap;font-size:13px}
.legend-item{display:inline-flex;align-items:center;gap:6px}
.legend-dot{width:12px;height:12px;border-radius:4px;display:inline-block}
.toolbar .actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn{background:var(--primary);color:white;border:none;padding:9px 20px;border-radius:10px;cursor:pointer;font-size:13px;transition:all 0.2s;font-weight:600;box-shadow:0 2px 8px rgba(99,102,241,0.25)}
.btn:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 16px rgba(99,102,241,0.35)}
.btn.outline{background:transparent;color:var(--primary);border:1.5px solid var(--primary);box-shadow:none}
.btn.outline:hover{background:var(--primary);color:white;box-shadow:0 4px 12px rgba(99,102,241,0.2)}
.schedule-wrapper{background:var(--card-bg);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);border:1px solid var(--border-light)}
.schedule{width:100%;border-collapse:collapse;table-layout:fixed}
.schedule th,.schedule td{border:1px solid var(--border-light);padding:10px 6px;text-align:center;vertical-align:middle;font-size:13px}
.schedule thead th{background:var(--grad-header);color:white;font-weight:600;padding:16px 6px;font-size:14px;letter-spacing:1px;position:sticky;top:0;z-index:10}
.schedule thead th:first-child{background:linear-gradient(135deg,#4F46E5,#6366F1)}
.schedule .period-col{background:#FAFBFC;width:110px;font-weight:600}
.period-name{font-size:13px;color:var(--text);margin-bottom:4px}
.period-time{font-size:11px;color:var(--text-lighter);font-weight:normal;display:block;margin-top:2px}
.schedule td.subject{transition:all 0.2s;cursor:pointer}
.schedule td.subject:hover{transform:scale(1.04);z-index:5;box-shadow:var(--shadow)}
.subject-name{font-weight:600;font-size:13px;margin-bottom:4px}
.subject-teacher{font-size:11px;color:var(--text-light)}
.row-morning td.subject{background:var(--morning)}
.row-noon td.subject{background:var(--noon)}
.row-afternoon td.subject{background:var(--afternoon)}
.row-delay td.subject{background:var(--delay)}
.row-morning .period-col{border-left:4px solid #6366F1}
.row-noon .period-col{border-left:4px solid #F59E0B}
.row-afternoon .period-col{border-left:4px solid #10B981}
.row-delay .period-col{border-left:4px solid #8B5CF6}
.schedule td.current{background:linear-gradient(135deg,#F59E0B,#D97706)!important;color:white!important;animation:pulse 2s infinite;box-shadow:0 0 16px rgba(245,158,11,0.4)}
.schedule td.current .subject-teacher{color:rgba(255,255,255,0.9)!important}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.5)}50%{box-shadow:0 0 0 10px rgba(245,158,11,0)}}
.schedule td.empty{background:#FAFBFC;color:var(--text-lighter)}
.section-divider td{background:linear-gradient(90deg,transparent,var(--border),transparent);padding:4px;font-size:12px;color:var(--text-light);letter-spacing:2px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:20px}
.stat-card{background:var(--card-bg);padding:20px;border-radius:var(--radius);box-shadow:var(--shadow-sm);border:1px solid var(--border-light);text-align:center;transition:all 0.25s;position:relative;overflow:hidden}
.stat-card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--grad-header);opacity:0;transition:opacity 0.25s}
.stat-card:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.stat-card:hover::before{opacity:1}
.stat-card .num{font-size:28px;font-weight:700;color:var(--primary)}
.stat-card .label{font-size:13px;color:var(--text-light);margin-top:4px}
.modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.5);backdrop-filter:blur(6px);z-index:100;align-items:center;justify-content:center}
.modal.show{display:flex;animation:fadeIn 0.2s ease}
.modal-content{background:white;padding:28px;border-radius:var(--radius-lg);max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.2);animation:slideDown 0.3s ease}
.modal-content h3{margin-bottom:14px;color:var(--primary);font-size:18px}
.modal-content p{margin-bottom:8px;color:var(--text)}
.modal-content .close{margin-top:16px;width:100%}
.toast{position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-100px);background:rgba(30,41,59,0.95);backdrop-filter:blur(8px);color:white;padding:12px 28px;border-radius:12px;font-size:14px;z-index:200;opacity:0;transition:all 0.3s ease;box-shadow:0 8px 32px rgba(0,0,0,0.2);pointer-events:none;white-space:nowrap;font-weight:500}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
@media(max-width:768px){body{padding:10px}.header{padding:20px 22px}.header h1{font-size:22px}.header .info{font-size:12px;gap:6px 12px}.header .info span{padding:3px 8px}.schedule th,.schedule td{padding:6px 2px;font-size:11px}.subject-name{font-size:12px}.subject-teacher{font-size:10px}.period-time{font-size:10px}.schedule .period-col{width:80px}.week-cell .wk-day{font-size:18px}.week-cell{min-height:78px;padding:8px 2px}.week-cell .wk-tag{font-size:9px;padding:1px 4px}.stat-card{padding:14px}.stat-card .num{font-size:22px}}"""

html = html[:css_start] + new_css + html[css_end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("CSS optimized! Size:", len(html.encode('utf-8')))