f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

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

# 放大字体：标题32px，信息16px，课程表通过CSS放大
new_func = """function exportPDF(){showToast("正在生成PDF...");var el=document.querySelector(".schedule-wrapper");var container=document.createElement("div");var renderW=1200;container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:#fff;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";var header=document.createElement("div");header.style.cssText="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);color:#fff;padding:28px 30px;border-radius:0;text-align:center;";var h1=document.querySelector(".header h1");var infoSpans=document.querySelectorAll(".header .info span");var titleText=h1?h1.textContent:"\\u8BFE\\u7A0B\\u8868";var infoText="";for(var s=0;s<infoSpans.length;s++){infoText+=(s>0?"\\u3000\\u3000":"")+infoSpans[s].textContent.trim()}header.innerHTML='<div style="font-size:32px;font-weight:700;margin-bottom:12px;">'+titleText+'</div><div style="font-size:16px;opacity:0.92;">'+infoText+'</div>';container.appendChild(header);var clone=el.cloneNode(true);clone.style.borderRadius="0";clone.style.boxShadow="none";clone.style.margin="0";clone.style.fontSize="18px";var tds=clone.querySelectorAll("td,th");for(var t=0;t<tds.length;t++){tds[t].style.padding="14px 8px";tds[t].style.fontSize="16px"}var names=clone.querySelectorAll(".subject-name");for(var n=0;n<names.length;n++){names[n].style.fontSize="17px"}var teachers=clone.querySelectorAll(".subject-teacher");for(var tc=0;tc<teachers.length;tc++){teachers[tc].style.fontSize="13px"}var times=clone.querySelectorAll(".period-time");for(var ti=0;ti<times.length;ti++){times[ti].style.fontSize="13px"}var pnames=clone.querySelectorAll(".period-name");for(var pn=0;pn<pnames.length;pn++){pnames[pn].style.fontSize="16px"}container.appendChild(clone);document.body.appendChild(container);html2canvas(container,{scale:2,backgroundColor:"#ffffff",useCORS:true,windowWidth:renderW}).then(function(canvas){document.body.removeChild(container);var img=canvas.toDataURL("image/jpeg",0.95);var pdf=new jspdf.jsPDF("l","mm","a4");var pw=pdf.internal.pageSize.getWidth();var ph=pdf.internal.pageSize.getHeight();var margin=0;var w=pw-2*margin;var h=ph-2*margin;var iw=canvas.width;var ih=canvas.height;var cr=iw/ih;var pr=w/h;var fw,fh;if(cr>pr){fw=w;fh=w/cr}else{fh=h;fw=h*cr}pdf.addImage(img,"JPEG",(pw-fw)/2,(ph-fh)/2,fw,fh);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\\u5DF2\\u5BFC\\u51FA")}).catch(function(err){document.body.removeChild(container);showToast("\\u5BFC\\u51FA\\u5931\\u8D25:"+err.message)})}"""

html = html[:i] + new_func + html[end:]

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("exportPDF font enlarged! Size:", len(html.encode('utf-8')))