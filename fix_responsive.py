f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 替换现有的 @media 查询
old_media = '@media(max-width:768px){body{padding:10px}.header{padding:20px 22px}.header h1{font-size:22px}.header .info{font-size:12px;gap:6px 12px}.header .info span{padding:3px 8px}.schedule th,.schedule td{padding:6px 2px;font-size:11px}.subject-name{font-size:12px}.subject-teacher{font-size:10px}.period-time{font-size:10px}.schedule .period-col{width:80px}.week-cell .wk-day{font-size:18px}.week-cell{min-height:78px;padding:8px 2px}.week-cell .wk-tag{font-size:9px;padding:1px 4px}.stat-card{padding:14px}.stat-card .num{font-size:22px}}'

new_media = """@media(max-width:1024px){.header h1{font-size:24px}.header .info{font-size:13px;gap:8px 16px}.schedule th,.schedule td{padding:8px 4px;font-size:12px}.subject-name{font-size:12px}.subject-teacher{font-size:10px}.period-time{font-size:10px}.schedule .period-col{width:90px}.stat-card .num{font-size:24px}}
@media(max-width:768px){body{padding:12px}.header{padding:22px 24px}.header h1{font-size:22px}.header .info{font-size:12px;gap:6px 12px}.header .info span{padding:4px 10px}.calendar-card{padding:16px 18px}.calendar-legend{gap:10px;font-size:10px}.account-bar{padding:12px 18px}.toolbar{padding:12px 18px}.toolbar .legend{gap:10px;font-size:12px}.schedule-wrapper{overflow-x:auto;-webkit-overflow-scrolling:touch}.schedule{min-width:600px}.schedule th,.schedule td{padding:8px 4px;font-size:13px}.subject-name{font-size:13px}.subject-teacher{font-size:11px}.period-time{font-size:10px}.schedule .period-col{width:85px}.week-cell .wk-day{font-size:20px}.week-cell{min-height:82px;padding:8px 3px}.week-cell .wk-tag{font-size:9px;padding:1px 5px}.stat-card{padding:16px}.stat-card .num{font-size:24px}.stat-card .label{font-size:12px}.btn{padding:8px 14px;font-size:12px}.btn-sm{padding:6px 12px;font-size:12px}.modal-content{padding:22px;max-width:340px}}
@media(max-width:480px){body{padding:8px}.header{padding:18px 20px}.header h1{font-size:20px}.header .info{font-size:11px;gap:4px 8px}.header .info span{padding:3px 8px}.calendar-card{padding:14px 14px}.calendar-week-view{gap:4px}.week-cell{min-height:68px;padding:6px 2px}.week-cell .wk-day{font-size:16px}.week-cell .wk-day{font-size:18px}.week-cell .wk-tag{font-size:8px}.calendar-legend{gap:8px;font-size:9px}.account-bar{padding:10px 14px;gap:8px}.account-info .avatar{width:32px;height:32px;font-size:13px}.toolbar{padding:10px 14px;gap:8px}.toolbar .legend{font-size:11px;gap:8px}.schedule{min-width:520px}.schedule th,.schedule td{padding:6px 2px;font-size:12px}.subject-name{font-size:12px}.subject-teacher{font-size:10px}.period-time{font-size:9px}.schedule .period-col{width:72px}.stats{gap:8px}.stat-card{padding:12px}.stat-card .num{font-size:20px}.stat-card .label{font-size:11px}.btn{padding:7px 12px;font-size:11px}.btn-sm{padding:5px 10px;font-size:11px}.btn-toggle{padding:6px 12px;font-size:12px}.calendar-nav button{width:30px;height:30px}.modal-content{padding:18px;max-width:300px}.toast{font-size:12px;padding:10px 20px}}"""

if old_media in html:
    html = html.replace(old_media, new_media)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(html)
    f.close()
    print("Responsive CSS updated! Size:", len(html.encode('utf-8')))
else:
    print("Pattern not found!")