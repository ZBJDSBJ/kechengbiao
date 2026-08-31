const { execSync } = require('child_process');
const fs = require('fs');

const oldHtml = execSync('git show HEAD:index.html', { cwd: 'D:/AIWorks/kechengbiao/deploy', maxBuffer: 1024 * 1024 * 10 }).toString();
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 精确提取单个函数
function extractFunction(src, name) {
  const start = src.indexOf('function ' + name);
  if (start < 0) return null;
  let i = src.indexOf('{', start);
  let depth = 1;
  let inStr = null, tplDepth = 0;
  let prev = '';
  while (depth > 0 && i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === inStr && prev !== '\\') inStr = null;
    } else {
      if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    prev = c;
    i++;
  }
  return src.substring(start, i) + '\n';
}

// 需要恢复的函数（exportData 用 git 版本，exportPDF 保留当前新版）
const needed = ['updateAccountUI', 'openAuth', 'closeAuth', 'switchAuthTab', 'submitAuth', 'logout', 'toggleEdit', 'enableInlineEdit', 'editCell', 'exportData', 'importData', 'autoPushCheck'];

let restored = '';
let failed = [];
needed.forEach(fn => {
  const code = extractFunction(oldHtml, fn);
  if (code && code.length < 20000) {
    // 校验语法
    try {
      new Function(code);
      restored += code;
      console.log(fn + ': OK (' + code.length + ' chars)');
    } catch (e) {
      failed.push(fn);
      console.log(fn + ': SYNTAX ERROR - ' + e.message);
    }
  } else {
    failed.push(fn);
    console.log(fn + ': extraction failed');
  }
});

if (failed.length) {
  console.log('FAILED:', failed.join(', '));
  process.exit(1);
}

// 插入到 function autoLogin 之前
const anchor = 'function autoLogin() {';
if (!html.includes(anchor)) {
  console.log('Anchor not found!');
  process.exit(1);
}
html = html.replace(anchor, restored + anchor, 1);

// 校验整个文件内联 JS 语法
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