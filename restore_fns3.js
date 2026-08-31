const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 1. 在 cycleTheme 前补回 themes 声明和 initTheme 函数
if (!html.includes('function initTheme')) {
  const anchor = 'function cycleTheme(){';
  if (!html.includes(anchor)) { console.log('cycleTheme anchor missing'); process.exit(1); }
  const add = 'var themes=["default","green","orange","pink","dark"];var themeNames=["\\u84DD\\u7D2B","\\u6E05\\u65B0\\u7EFF","\\u6696\\u9633\\u6A59","\\u6A31\\u82B1\\u7C89","\\u6697\\u591C"];function initTheme(){var t=localStorage.getItem("curriculum-theme")||"default";document.documentElement.setAttribute("data-theme",t);updateThemeBtn(t)}\nfunction cycleTheme(){';
  html = html.replace(anchor, add, 1);
  console.log('initTheme restored');
}

// 2. 在 importData 函数后补回 exportPDF（新版：A4 排版+标题+主题支持）
if (!html.includes('function exportPDF')) {
  const anchor = 'function autoLogin() {';
  if (!html.includes(anchor)) { console.log('autoLogin anchor missing'); process.exit(1); }
  const exportPdf = `function exportPDF(){showToast("\\u6B63\\u5728\\u751F\\u6210PDF...");var el=document.querySelector(".schedule-wrapper");var container=document.createElement("div");var renderW=1400;var curTheme=document.documentElement.getAttribute("data-theme")||"default";var themeBg=curTheme==="dark"?"#0F172A":"#fff";container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:"+themeBg+";padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";if(curTheme!=="default"){container.setAttribute("data-theme",curTheme)}var header=document.createElement("div");header.style.cssText="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);color:#fff;padding:22px 30px;text-align:center;";var h1=document.querySelector(".header h1");var infoSpans=document.querySelectorAll(".header .info span");var titleText=h1?h1.textContent:"\\u8BFE\\u7A0B\\u8868";var infoText="";for(var s=0;s<infoSpans.length;s++){infoText+=(s>0?"\\u3000\\u3000":"")+infoSpans[s].textContent.trim()}header.innerHTML='<div style="font-size:28px;font-weight:700;margin-bottom:8px;">'+titleText+'</div><div style="font-size:14px;opacity:0.92;">'+infoText+'</div>';container.appendChild(header);var clone=el.cloneNode(true);clone.style.borderRadius="0";clone.style.boxShadow="none";clone.style.margin="0";var tds=clone.querySelectorAll("td,th");for(var t=0;t<tds.length;t++){tds[t].style.padding="10px 6px";tds[t].style.fontSize="14px"}var names=clone.querySelectorAll(".subject-name");for(var n=0;n<names.length;n++){names[n].style.fontSize="15px"}var teachers=clone.querySelectorAll(".subject-teacher");for(var tc=0;tc<teachers.length;tc++){teachers[tc].style.fontSize="12px"}var times=clone.querySelectorAll(".period-time");for(var ti=0;ti<times.length;ti++){times[ti].style.fontSize="11px"}var pnames=clone.querySelectorAll(".period-name");for(var pn=0;pn<pnames.length;pn++){pnames[pn].style.fontSize="14px"}container.appendChild(clone);document.body.appendChild(container);html2canvas(container,{scale:2,backgroundColor:themeBg,useCORS:true,windowWidth:renderW}).then(function(canvas){document.body.removeChild(container);var img=canvas.toDataURL("image/jpeg",0.95);var iw=canvas.width;var ih=canvas.height;var cr=iw/ih;var pdf;var pw,ph;if(cr>1){pdf=new jspdf.jsPDF("l","mm","a4")}else{pdf=new jspdf.jsPDF("p","mm","a4")}pw=pdf.internal.pageSize.getWidth();ph=pdf.internal.pageSize.getHeight();var availW=pw;var availH=ph;var availRatio=availW/availH;var w,h;if(cr>availRatio){w=availW;h=w/cr}else{h=availH;w=h*cr}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\\u5DF2\\u5BFC\\u51FA")}).catch(function(err){document.body.removeChild(container);showToast("\\u5BFC\\u51FA\\u5931\\u8D25:"+err.message)})}\n`;
  html = html.replace(anchor, exportPdf + anchor, 1);
  console.log('exportPDF restored');
}

// 校验语法
const parts = html.split('<script');
let inline = '';
for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  if (part.startsWith(' src=')) continue;
  const start = part.indexOf('>') + 1;
  const end = part.indexOf('</' + 'script>');
  if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
try {
  new Function(inline);
  console.log('Full syntax OK');
  fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/index.html', html);
  console.log('Saved! Size:', html.length);
} catch (e) {
  console.log('Full syntax ERROR:', e.message);
  process.exit(1);
}