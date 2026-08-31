f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'r', encoding='utf-8')
html = f.read()
f.close()

# 1. 添加 LZString CDN 脚本（在 jsPDF 后面）
old_script = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script></head>'
new_script = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js"></script></head>'
html = html.replace(old_script, new_script)
print("LZString CDN added")

# 2. 修改 shareLink 函数 - 使用 LZString 压缩
old_share = '''function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = btoa(unescape(encodeURIComponent(json)));
const url = location.origin + location.pathname + "#s=" + encoded;'''

new_share = '''function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = LZString.compressToEncodedURIComponent(json);
const url = location.origin + location.pathname + "#s=" + encoded;'''

html = html.replace(old_share, new_share)
print("shareLink updated")

# 3. 修改 loadFromHash 函数 - 使用 LZString 解压
old_load = '''if (hash.startsWith("#s=")) {
try {
const encoded = hash.substring(3);
const json = decodeURIComponent(escape(atob(encoded)));
const data = JSON.parse(json);'''

new_load = '''if (hash.startsWith("#s=")) {
try {
const encoded = hash.substring(3);
const json = LZString.decompressFromEncodedURIComponent(encoded);
const data = JSON.parse(json);'''

html = html.replace(old_load, new_load)
print("loadFromHash updated")

f = open(r'D:\AIWorks\kechengbiao\deploy\index.html', 'w', encoding='utf-8')
f.write(html)
f.close()
print("Done! Size:", len(html.encode('utf-8')))