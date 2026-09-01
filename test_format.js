// 模拟buildTodaySchedule的输出格式
var L=[];
L.push("📚 今日课程");
L.push("📅 2026年9月1日 周一");
L.push("───────────────");
L.push("");
L.push("📖 第一节 8:00-8:40");
L.push("语文 · 张老师");
L.push("");
L.push("📖 第二节 8:50-9:30");
L.push("数学 · 李老师");
L.push("");
L.push("🍽️ 午休 11:50-13:30");
L.push("");
L.push("📖 第五节 13:30-14:10");
L.push("英语 · 王老师");

var content = L.join("  \n");
console.log("=== content ===");
console.log(content);
console.log("=== encoded ===");
console.log(encodeURIComponent(content));
console.log("=== bytes ===");
for (var i = 0; i < content.length; i++) {
    if (content[i] === '\n') console.log("  pos " + i + ": NEWLINE");
    if (content[i] === ' ' && content[i+1] === ' ') console.log("  pos " + i + ": DOUBLE SPACE");
}