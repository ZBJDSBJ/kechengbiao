const { execSync } = require('child_process');
const fs = require('fs');

// 从 git 历史提取 index.html
const oldHtml = execSync('git show HEAD:index.html', { cwd: 'D:/AIWorks/kechengbiao/deploy', maxBuffer: 1024 * 1024 * 10 }).toString();

// 提取指定函数（从 function name 开始，匹配大括号）
function extractFunction(src, name) {
  const start = src.indexOf('function ' + name);
  if (start < 0) return null;
  let i = src.indexOf('{', start);
  let depth = 1;
  let inStr = null;
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
  return src.substring(start, i);
}

const needed = ['updateAccountUI', 'openAuth', 'switchAuthTab', 'submitAuth', 'closeAuth', 'toggleEdit', 'exportData', 'exportPDF', 'importData', 'editCell', 'autoPushCheck'];
const extracted = {};
needed.forEach(fn => {
  const code = extractFunction(oldHtml, fn);
  if (code) {
    extracted[fn] = code;
    console.log(fn + ': extracted, length=' + code.length);
  } else {
    console.log(fn + ': NOT FOUND in git history');
  }
});

fs.writeFileSync('D:/AIWorks/kechengbiao/deploy/extracted_functions.json', JSON.stringify(extracted, null, 2));
console.log('Saved to extracted_functions.json');