const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
// 查看pushToday和testPush函数
const fns = ['function pushToday', 'function testPush'];
fns.forEach(f => {
    const i = h.indexOf(f);
    if (i < 0) { console.log(f + ': NOT FOUND'); return; }
    // 找到下一个function定义
    const j = h.indexOf('function ', i + f.length);
    console.log('---' + f + '---');
    console.log(h.substring(i, j));
    console.log('');
});