const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// 提取内联JS
const parts = h.split('<script');
let inline = '';
for (let k = 1; k < parts.length; k++) {
    const part = parts[k];
    if (part.startsWith(' src=')) continue;
    const start = part.indexOf('>') + 1;
    const end = part.indexOf('</' + 'script>');
    if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}

// 写入临时文件用node --check
fs.writeFileSync('_check.js', inline);
console.log('Written _check.js, size:', inline.length);