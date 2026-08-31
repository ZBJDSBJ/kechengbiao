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

# 新函数：严格 A4 比例，内容排版优化
new_func = """function exportPDF(){showToast("正在生成PDF...");var el=document.querySelector(".schedule-wrapper");var container=document.createElement("div");var renderW=1200;container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:#fff;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";var header=document.createElement("div");header.style.cssText="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);color:#fff;padding:24px 30px;border-radius:0;text-align:center;";var h1=document.querySelector(".header h1");var infoSpans=document.querySelectorAll(".header .info span");var titleText=h1?h1.textContent:"\\u8BFE\\u7A0B\\u8868";var infoText="";for(var s=0;s<infoSpans.length;s++){infoText+=(s>0?"\\u3000\\u3000":"")+infoSpans[s].textContent.trim()}header.innerHTML='<div style="font-size:28px;font-weight:700;margin-bottom:10px;">'+titleText+'</div><div style="font-size:13px;opacity:0.92;">'+infoText+'</div>';container.appendChild(header);var clone=el.cloneNode(true);clone.style.borderRadius="0";clone.style.boxShadow="none";clone.style.margin="0";container.appendChild(clone);document.body.appendChild(container);html2canvas(container,{scale:2,backgroundColor:"#ffffff",useCORS:true,windowWidth:renderW}).then(function(canvas){document.body.removeChild(container);var img=canvas.toDataURL("image/jpeg",0.95);var pdf=new jspdf.jsPDF("l","mm","a4");var pw=pdf.internal.pageSize.getWidth();var ph=pdf.internal.pageSize.getHeight();var margin=0;var w=pw-2*margin;var h=ph-2*margin;var iw=canvas.width;var ih=canvas.height;var cr=iw/ih;var pr=w/h;var fw,fh;if(cr>pr){fw=w;fh=w/cr}else{fh=h;fw=h*cr}pdf.addImage(img,"JPEG",(pw-fw)/2,(ph-fh)/2,fw,fh);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\\u5DF2\\u5BFC\\u51FA")}).catch(function(err){document.body.removeChild(container);showToast("\\u5BFC\\u51FA\\u5931\\u8D25:"+err.message)})}"""

html = html[:i] + new_func + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("exportPDF updated! Size:", len(html.encode('utf-8')))