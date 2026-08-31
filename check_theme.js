const fs = require('fs');
const html = fs.readFileSync('D:/AIWorks/kechengbiao/deploy/index.html', 'utf8');
console.log('themes var:', html.indexOf('var themes='));
console.log('initTheme:', html.indexOf('function initTheme'));
console.log('cycleTheme:', html.indexOf('function cycleTheme'));
console.log('updateThemeBtn:', html.indexOf('function updateThemeBtn'));
console.log('themeBtn in HTML:', html.includes('id="themeBtn"'));
console.log('initTheme call:', html.includes('initTheme();'));