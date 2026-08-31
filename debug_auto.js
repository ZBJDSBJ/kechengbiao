const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// 检查autoPushCheck到updateAccountUI之间的内容
const start = h.indexOf('function autoPushCheck');
const end = h.indexOf('function updateAccountUI');
console.log('autoPushCheck start:', start);
console.log('updateAccountUI start:', end);
console.log('---Content---');
console.log(h.substring(start, end));
console.log('---End---');

// 检查updateAccountUI之后的内容
console.log('\n---After updateAccountUI---');
const afterEnd = h.indexOf('</script>', end);
console.log(h.substring(end, Math.min(afterEnd, end + 500)));