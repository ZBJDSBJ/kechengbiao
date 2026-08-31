f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

old = 'showToast("已导出课程表配置");\n}\nfunction importData'

export_pdf = 'function exportPDF(){showToast("正在生成PDF...");var el=document.querySelector(".schedule-wrapper");html2canvas(el,{scale:2,backgroundColor:"#ffffff",useCORS:true}).then(function(canvas){var img=canvas.toDataURL("image/jpeg",0.95);var pdf=new jspdf.jsPDF("l","mm","a4");var pw=pdf.internal.pageSize.getWidth();var ph=pdf.internal.pageSize.getHeight();var iw=canvas.width;var ih=canvas.height;var w=pw-20;var h=w*ih/iw;if(h>ph-20){h=ph-20;w=h*iw/ih}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF已导出")}).catch(function(err){showToast("导出失败:"+err.message)})}'

new = 'showToast("已导出课程表配置");\n}\n' + export_pdf + '\nfunction importData'

if old in html:
    html = html.replace(old, new, 1)
    f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
    f.write(html)
    f.close()
    print("exportPDF added! Size:", len(html.encode('utf-8')))
else:
    print("Pattern not found!")