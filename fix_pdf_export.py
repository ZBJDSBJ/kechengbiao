f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

old = 'showToast("已导出课程表配置");}\nfunction importData'

new = 'showToast("已导出课程表配置");}\nfunction exportPDF(){showToast("正在生成PDF...");const el=document.querySelector(".schedule-wrapper");html2canvas(el,{scale:2,backgroundColor:"#ffffff",useCORS:true}).then(function(canvas){const img=canvas.toDataURL("image/jpeg",0.95);const pdf=new jspdf.jsPDF("l","mm","a4");const pw=pdf.internal.pageSize.getWidth();const ph=pdf.internal.pageSize.getHeight();const iw=canvas.width;const ih=canvas.height;let w=pw-20;let h=w*ih/iw;if(h>ph-20){h=ph-20;w=h*iw/ih}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF已导出")}).catch(function(err){showToast("导出失败:"+err.message)})}\nfunction importData'

if old in html:
    html = html.replace(old, new, 1)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(html)
    f.close()
    print("exportPDF added! Size:", len(html.encode('utf-8')))
else:
    print("Pattern not found! Trying alternative...")
    # 尝试不同的换行符
    old2 = 'showToast("已导出课程表配置");}function importData'
    new2 = 'showToast("已导出课程表配置");}function exportPDF(){showToast("正在生成PDF...");const el=document.querySelector(".schedule-wrapper");html2canvas(el,{scale:2,backgroundColor:"#ffffff",useCORS:true}).then(function(canvas){const img=canvas.toDataURL("image/jpeg",0.95);const pdf=new jspdf.jsPDF("l","mm","a4");const pw=pdf.internal.pageSize.getWidth();const ph=pdf.internal.pageSize.getHeight();const iw=canvas.width;const ih=canvas.height;let w=pw-20;let h=w*ih/iw;if(h>ph-20){h=ph-20;w=h*iw/ih}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF已导出")}).catch(function(err){showToast("导出失败:"+err.message)})}function importData'
    if old2 in html:
        html = html.replace(old2, new2, 1)
        f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
        f.write(html)
        f.close()
        print("exportPDF added (alt)! Size:", len(html.encode('utf-8')))
    else:
        print("Both patterns not found!")