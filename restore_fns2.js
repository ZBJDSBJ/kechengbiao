const { execSync } = require('child_process');
const fs = require('fs');

const oldHtml = execSync('git show HEAD:index.html', { cwd: 'D:/AIWorks/kechengbiao/deploy', maxBuffer: 1024 * 1024 * 10 }).toString();
let html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');

// 提取 git 版本中从 autoPushCheck 到 autoLogin 的完整函数区块
const a = oldHtml.indexOf('function autoPushCheck');
const b = oldHtml.indexOf('function autoLogin');
if (a < 0 || b < 0 || b <= a) {
  console.log('Block not found in git history');
  process.exit(1);
}
const block = oldHtml.substring(a, b);
console.log('Block length:', block.length);

// 确认当前文件中没有这些函数
const fns = ['updateAccountUI', 'openAuth', 'closeAuth', 'switchAuthTab', 'submitAuth', 'logout', 'toggleEdit', 'editCell', 'exportData', 'importData', 'autoPushCheck'];
for (const f of fns) {
  if (html.includes('function ' + f)) {
    console.log('CONFLICT: current file already has ' + f);
    process.exit(1);
  }
}

// 校验 block 语法（包装在函数体中测试）
try {
  new Function(block);
  console.log('Block syntax OK');
} catch (e) {
  console.log('Block syntax ERROR:', e.message);
  process.exit(1);
}

// 插入到当前文件 autoLogin 之前
const anchor = 'function autoLogin() {';
if (!html.includes(anchor)) {
  console.log('Anchor not found!');
  process.exit(1);
}
html = html.replace(anchor, block + anchor, 1);

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