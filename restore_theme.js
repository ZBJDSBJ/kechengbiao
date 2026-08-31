const fs = require('fs');
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 在 updateThemeBtn 之前插入 themes 声明、initTheme 和 cycleTheme
const anchor = 'function updateThemeBtn';
if (!html.includes(anchor)) { console.log('updateThemeBtn not found'); process.exit(1); }

const themeCode = 'var themes=["default","green","orange","pink","dark"];var themeNames=["\\u84DD\\u7D2B","\\u6E05\\u65B0\\u7EFF","\\u6696\\u9633\\u6A59","\\u6A31\\u82B1\\u7C89","\\u6697\\u591C"];function initTheme(){var t=localStorage.getItem("curriculum-theme")||"default";document.documentElement.setAttribute("data-theme",t);updateThemeBtn(t)}function cycleTheme(){var cur=document.documentElement.getAttribute("data-theme")||"default";var idx=themes.indexOf(cur);var next=themes[(idx+1)%themes.length];document.documentElement.setAttribute("data-theme",next);localStorage.setItem("curriculum-theme",next);updateThemeBtn(next)}\n';

html = html.replace(anchor, themeCode + anchor, 1);

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
  console.log('Syntax OK');
  fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/index.html', html);
  console.log('Saved! Size:', html.length);
} catch (e) {
  console.log('Syntax ERROR:', e.message);
  process.exit(1);
}