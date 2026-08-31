f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 替换 shareLink 函数 - 添加短链接功能
old = """function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = LZString.compressToEncodedURIComponent(json);
const url = location.origin + location.pathname + "#s=" + encoded;
if (navigator.clipboard) {
navigator.clipboard.writeText(url).then(() => showToast("分享链接已复制到剪贴板"));
} else {
const ta = document.createElement("textarea");
ta.value = url; document.body.appendChild(ta); ta.select();
document.execCommand("copy"); document.body.removeChild(ta);
showToast("分享链接已复制到剪贴板");
}
} catch(e) { showToast("生成链接失败"); }
}"""

new = """function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = LZString.compressToEncodedURIComponent(json);
const longUrl = location.origin + location.pathname + "#s=" + encoded;
showToast("正在生成短链接...");
fetch("/api/shorten", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({url: longUrl})})
.then(r => r.json())
.then(data => {
const finalUrl = data.short || longUrl;
copyToClipboard(finalUrl);
})
.catch(() => { copyToClipboard(longUrl); });
} catch(e) { showToast("生成链接失败"); }
}
function copyToClipboard(text) {
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("分享链接已复制到剪贴板"));
} else {
const ta = document.createElement("textarea");
ta.value = text; document.body.appendChild(ta); ta.select();
document.execCommand("copy"); document.body.removeChild(ta);
showToast("分享链接已复制到剪贴板");
}
}"""

if old in html:
    html = html.replace(old, new, 1)
    print("shareLink updated with short URL!")
else:
    print("shareLink pattern not found!")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))