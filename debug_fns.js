const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// 检查各关键函数位置
const fns = ['function openPushSettings', 'function toggleRow', 'function savePushSettings', 'function buildTodaySchedule', 'function buildTomorrowSchedule', 'function pushToday', 'function autoPushCheck', 'function updateAccountUI'];
fns.forEach(f => {
    const idx = h.indexOf(f);
    console.log(f + ': ' + idx);
});

// 检查holidays2026附近
const holIdx = h.indexOf('holidays2026');
console.log('\nholidays2026 at:', holIdx);
if (holIdx > 0) {
    console.log(h.substring(holIdx - 50, holIdx + 500));
}