// 模拟用户期望的格式
var scheduleData = [
  { section: "morning", period: "第1节", time: "8:30—9:00", subjects: [{name:"语文",teacher:"易鑫月"}] },
  { section: "morning", period: "第2节", time: "9:30—10:00", subjects: [{name:"书法（国学诵读）",teacher:"易鑫月"}] },
  { section: "morning", period: "第3节", time: "10:15—10:45", subjects: [{name:"科学",teacher:"张鸽"}] },
  { section: "morning", period: "第4节", time: "11:00—11:30", subjects: [{name:"数学",teacher:"陈丽丽"}] },
  { section: "morning", period: "第5节", time: "11:45—12:15", subjects: [{name:"思维训练",teacher:"陈丽丽"}] },
  { section: "noon", period: "午休", time: "12:15—13:45", subjects: [{name:"午休",teacher:""}] },
  { section: "afternoon", period: "第6节", time: "14:00—14:30", subjects: [{name:"体育特色",teacher:"谢成超"}] },
  { section: "afternoon", period: "第7节", time: "14:45—15:15", subjects: [{name:"英语",teacher:"肖含"}] },
  { section: "delay", period: "延时第1节", time: "15:30—16:05", subjects: [{name:"语文作业",teacher:"易鑫月"}] },
  { section: "delay", period: "延时第2节", time: "16:15—16:50", subjects: [{name:"数学作业",teacher:"陈丽丽"}] },
  { section: "delay", period: "延时第3节", time: "17:00—17:35", subjects: [{name:"综合素养4",teacher:"魏洋"}] },
];

var day = 1; // 周一
var dows = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
var dateStr = "2026年8月31日 " + dows[day];
var lines = [dateStr, ""];
scheduleData.forEach(function(row) {
    var sub = row.subjects[day - 1];
    if (!sub) return;
    if (row.period === "午休") { lines.push("🕐 午休 " + row.time); return; }
    var line = "📗 " + row.period + "\u3000" + row.time + " " + sub.name;
    if (sub.teacher) line += "\uff08" + sub.teacher + "\uff09";
    lines.push(line);
});
var content = lines.join("  \n");
console.log("=== content ===");
console.log(content);
console.log("");
console.log("=== encoded ===");
console.log(encodeURIComponent(content));