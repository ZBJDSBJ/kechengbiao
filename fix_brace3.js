const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 修复：autoPushCheck缺少一个闭合大括号
// 找到autoPushCheck函数，在function updateAccountUI前添加 }
const oldCheck = h.indexOf('function autoPushCheck');
const oldCheckEnd = h.indexOf('function updateAccountUI');
if (oldCheck < 0 || oldCheckEnd < 0) { console.log('not found!'); process.exit(1); }

const code = h.substring(oldCheck, oldCheckEnd);
let braces = 0;
for (const c of code) {
    if (c === '{') braces++;
    if (c === '}') braces--;
}
console.log('Braces balance:', braces, '(need to add', braces, 'closing brace(s))');

// 在updateAccountUI前添加缺少的}
h = h.substring(0, oldCheckEnd) + '}\n' + h.substring(oldCheckEnd);
console.log('Added closing brace');

// 验证
const parts = h.split('<script');
let inline = '';
for (let k = 1; k < parts.length; k++) {
    const part = parts[k];
    if (part.startsWith(' src=')) continue;
    const start = part.indexOf('>') + 1;
    const end = part.indexOf('</' + 'script>');
    if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
fs.writeFileSync('_check.js', inline);

const { execSync } = require('child_process');
try {
    execSync('node --check _check.js', { stdio: 'pipe' });
    console.log('Syntax OK!');
    fs.writeFileSync('index.html', h);
    console.log('Saved! Size:', h.length);
} catch (e) {
    console.log('Syntax ERROR:', e.stderr ? e.stderr.toString().substring(0, 500) : e.message);
}