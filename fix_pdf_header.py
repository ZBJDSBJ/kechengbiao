f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 找到当前的 exportPDF 函数并替换
i = html.find('function exportPDF(){')
if i < 0:
    print("exportPDF not found!")
    exit()

# 找到函数结束位置（下一个 function）
j = html.find('}function importData', i)
if j < 0:
    j = html.find('}\nfunction importData', i)
    end = j + 1
else:
    end = j + 1

old_func = html[i:end]
print("Old function length:", len(old_func))

new_func = 'function exportPDF(){showToast("正在生成PDF...");var el=document.querySelector(".schedule-wrapper");html2canvas(el,{scale:2,backgroundColor:"#ffffff",useCORS:true}).then(function(canvas){var img=canvas.toDataURL("image/jpeg",0.95);var pdf=new jspdf.jsPDF("l","mm","a4");var pw=pdf.internal.pageSize.getWidth();var ph=pdf.internal.pageSize.getHeight();pdf.setFontSize(22);pdf.setTextColor(99,102,241);pdf.text("\\uF0D7 \\u8BFE\\u7A0B\\u8868",pw/2,18,{align:"center"});pdf.setFontSize(11);pdf.setTextColor(100,116,139);pdf.text("2026-2027\\u5B66\\u5E74\\u7B2C\\u4E00\\u5B66\\u671F  \\u2502  \\u9526\\u6649\\u5C0F\\u5B66\\u91D1\\u878D\\u57CE\\u5206\\u6821  \\u2502  \\u4E00\\u5E74\\u7EA714\\u73ED  \\u2502  \\u73ED\\u4E3B\\u4EFB\\uFF1A\\u6613\\u946B\\u6708",pw/2,26,{align:"center"});pdf.setDrawColor(226,232,240);pdf.line(15,30,pw-15,30);var iw=canvas.width;var ih=canvas.height;var w=pw-20;var h=w*ih/iw;var sy=35;if(h>ph-sy-10){h=ph-sy-10;w=h*iw/ih}pdf.addImage(img,"JPEG",(pw-w)/2,sy,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\\u5DF2\\u5BFC\\u51FA")}).catch(function(err){showToast("\\u5BFC\\u51FA\\u5931\\u8D25:"+err.message)})}'

html = html[:i] + new_func + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("exportPDF updated! Size:", len(html.encode('utf-8')))