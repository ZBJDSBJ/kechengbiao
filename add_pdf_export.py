f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 在 </head> 前添加 CDN 脚本
old_head = '</style></head>'
new_head = '</style><script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script></head>'
html = html.replace(old_head, new_head, 1)
print("CDN scripts added")

# 2. 在导出按钮后添加导出PDF按钮
old_btn = '<button class="btn-sm" id="exportBtn" onclick="exportData()" style="display:none">📥 导出</button>'
new_btn = '<button class="btn-sm" id="exportBtn" onclick="exportData()" style="display:none">📥 导出JSON</button><button class="btn-sm" id="exportPdfBtn" onclick="exportPDF()" style="display:none">📄 导出PDF</button>'
html = html.replace(old_btn, new_btn)
print("PDF button added")

# 3. 在登录显示按钮的代码中添加 PDF 按钮显示/隐藏
old_show = 'exportBtn.style.display = "inline-flex";'
new_show = 'exportBtn.style.display = "inline-flex";document.getElementById("exportPdfBtn").style.display = "inline-flex";'
html = html.replace(old_show, new_show, 1)
print("Show logic updated")

old_hide = 'exportBtn.style.display = "none";'
new_hide = 'exportBtn.style.display = "none";document.getElementById("exportPdfBtn").style.display = "none";'
html = html.replace(old_hide, new_hide, 1)
print("Hide logic updated")

# 4. 在 exportData 函数后添加 exportPDF 函数
old_export = 'showToast("已导出课程表配置");}'

new_export = 'showToast("已导出课程表配置");}function exportPDF(){showToast("正在生成PDF...");const el=document.querySelector(".schedule-wrapper");const opt={scale:2,backgroundColor:"#ffffff",useCORS:true};html2canvas(el,opt).then(canvas=>{const img=canvas.toDataURL("image/jpeg",0.95);const pdf=new jspdf.jsPDF("l","mm","a4");const pw=pdf.internal.pageSize.getWidth();const ph=pdf.internal.pageSize.getHeight();const iw=canvas.width;const ih=canvas.height;let w=pw-20;let h=w*ih/iw;if(h>ph-20){h=ph-20;w=h*iw/ih}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF已导出")}).catch(err=>{showToast("导出失败:"+err.message)})}'

html = html.replace(old_export, new_export, 1)
print("exportPDF function added")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))