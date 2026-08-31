const fs = require('fs');
const html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');
console.log('pushTimeRow:', html.includes('pushTimeRow'));
console.log('pushHour:', html.includes('pushHour'));
console.log('togglePushTime:', html.includes('togglePushTime'));
console.log('7:00 option:', html.includes('>7:00<'));
console.log('old label:', html.includes('每天8:00自动推送'));