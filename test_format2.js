// 模拟最终的content格式
var L=[];
L.push("📚 今日课程");
L.push("📅 2026年9月1日 周一");
L.push("───────────────");
L.push("📖 第一节 8:00-8:40  \n语文 · 张老师");
L.push("📖 第二节 8:50-9:30  \n数学 · 李老师");
L.push("🍽️ 午休 11:50-13:30");
L.push("📖 第五节 13:30-14:10  \n英语 · 王老师");

var content = L.join("\n\n");
console.log("=== content (raw) ===");
console.log(JSON.stringify(content));
console.log("");
console.log("=== content (display) ===");
console.log(content);
console.log("");
console.log("=== encoded body ===");
console.log("title=" + encodeURIComponent("今日课程安排") + "&desp=" + encodeURIComponent(content));