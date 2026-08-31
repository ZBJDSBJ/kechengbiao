const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const parts = h.split('<script');
let inline = '';
for (let k = 1; k < parts.length; k++) {
    const part = parts[k];
    if (part.startsWith(' src=')) continue;
    const start = part.indexOf('>') + 1;
    const end = part.indexOf('</' + 'script>');
    if (start > 0 && end > start) inline += part.substring(start, end) + '\n;\n';
}
try {
    new Function(inline);
    console.log('Syntax OK');
} catch (e) {
    console.log('Syntax ERROR:', e.message);
    // 尝试找到错误位置
    const lines = inline.split('\n');
    console.log('Total lines:', lines.length);
    // 尝试逐步解析找到错误行
    for (let i = 100; i < lines.length; i += 100) {
        try {
            new Function(lines.slice(0, i).join('\n'));
        } catch (e2) {
            console.log('Error around line', i, ':', e2.message);
            // 打印附近的代码
            for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 5); j++) {
                console.log((j + 1) + ': ' + lines[j].substring(0, 200));
            }
            break;
        }
    }
}