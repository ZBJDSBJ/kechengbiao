const fs = require('fs');
const fns = JSON.parse(fs.readFileSync('D:/AIWorks/kechengbiao/deploy/extracted_functions.json', 'utf8'));

// 检查关键函数内容
for (const [name, code] of Object.entries(fns)) {
  // 检查提取的代码里包含哪些函数定义
  const defRe = /function\s+([a-zA-Z_$][\w$]*)/g;
  let m;
  const found = [];
  while ((m = defRe.exec(code))) found.push(m[1]);
  console.log(name + ' contains:', found.join(', '));
  // 检查是否有 wxpusher 引用
  if (code.includes('wxpusher') || code.includes('WXPUSHER')) console.log('  ^ contains wxpusher refs');
  if (code.includes('sctapi')) console.log('  ^ contains sctapi refs');
}