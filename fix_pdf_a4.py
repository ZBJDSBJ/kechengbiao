f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 找到当前的 exportPDF 函数并替换
i = html.find('function exportPDF(){')
if i < 0:
    print("exportPDF not found!")
    exit()

j = html.find('}function importData', i)
if j < 0:
    j = html.find('}\nfunction importData', i)
    end = j + 1
else:
    end = j + 1

old_func = html[i:end]

# 新函数：A4 横向，内容占满页面，保持比例，小边距
new_func = """function exportPDF(){showToast("正在生成PDF...");var el=document.querySelector(".schedule-wrapper");var container=document.createElement("div");container.style.cssText="position:absolute;left:-9999px;top:0;width:1400px;background:#fff;padding:30px;box-sizing:border-box;";var header=document.createElement("div");header.style.cssText="text-align:center;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #E2E8F0;";var h1=document.querySelector(".header h1");var infoSpans=document.querySelectorAll(".header .info span");var titleText=h1?h1.textContent:"\\u8BFE\\u7A0B\\u8868";var infoText="";for(var s=0;s<infoSpans.length;s++){infoText+=(s>0?"  \\u3000|\\u3000  ":"")+infoSpans[s].textContent.trim()}header.innerHTML='<div style="font-size:28px;font-weight:700;color:#6366F1;margin-bottom:10px;">'+titleText+'</div><div style="font-size:14px;color:#64748B;line-height:1.8;">'+infoText+'</div>';container.appendChild(header);var clone=el.cloneNode(true);container.appendChild(clone);document.body.appendChild(container);html2canvas(container,{scale:2,backgroundColor:"#ffffff",useCORS:true}).then(function(canvas){document.body.removeChild(container);var img=canvas.toDataURL("image/jpeg",0.95);var pdf=new jspdf.jsPDF("l","mm","a4");var pw=pdf.internal.pageSize.getWidth();var ph=pdf.internal.pageSize.getHeight();var margin=5;var availW=pw-2*margin;var availH=ph-2*margin;var iw=canvas.width;var ih=canvas.height;var ratio=iw/ih;var availRatio=availW/availH;var w,h;if(ratio>availRatio){w=availW;h=w/ratio}else{h=availH;w=h*ratio}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\\u5DF2\\u5BFC\\u51FA")}).catch(function(err){document.body.removeChild(container);showToast("\\u5BFC\\u51FA\\u5931\\u8D25:"+err.message)})}"""

html = html[:i] + new_func + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("exportPDF updated for A4! Size:", len(html.encode('utf-8')))