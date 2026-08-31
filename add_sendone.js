const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 在pushToday函数前添加sendOne函数
const pushTodayIdx = h.indexOf('function pushToday');
if (pushTodayIdx < 0) { console.log('pushToday not found!'); process.exit(1); }

const sendOneFn = 'function sendOne(channel,key,content,title,successMsg){if(channel==="wx"){fetch("https://sctapi.ftqq.com/"+key+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent(title)+"&desp="+encodeURIComponent(content)}).then(function(r){return r.json()}).then(function(data){if(data&&data.code===0){showToast(successMsg)}else{showToast("❌ 微信推送失败："+(data&&data.message||"未知错误"))}}).catch(function(err){showToast("❌ 微信推送失败，请检查网络")})}else if(channel==="tg"){fetch("/api/tg-push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:key,text:content})}).then(function(r){return r.json()}).then(function(data){if(data&&data.ok){showToast(successMsg)}else{showToast("❌ Telegram推送失败："+(data&&data.description||"未知错误"))}}).catch(function(err){showToast("❌ Telegram推送失败，请检查网络")})}}';

h = h.substring(0, pushTodayIdx) + sendOneFn + '\n' + h.substring(pushTodayIdx);
console.log('Added sendOne function');

// 验证语法
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