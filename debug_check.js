const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
// 检查autoPushCheck前后是否有问题
const idx = h.indexOf('function autoPushCheck');
console.log('autoPushCheck at:', idx);
console.log('---Before---');
console.log(h.substring(idx - 200, idx));
console.log('---autoPushCheck---');
const end = h.indexOf('function updateAccountUI');
console.log(h.substring(idx, end));
console.log('---After---');
console.log(h.substring(end, end + 200));