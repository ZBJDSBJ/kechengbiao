const DEFAULT_SCHEDULE = [
  { section: "morning", period: "第1节", time: "8:30—9:00", subjects: [
    { name: "语文", teacher: "易鑫月" }, { name: "数学", teacher: "陈丽丽" }, { name: "语文", teacher: "易鑫月" }, { name: "数学", teacher: "陈丽丽" }, { name: "语文", teacher: "易鑫月" }
  ]},
  { section: "morning", period: "第2节", time: "9:30—10:00", subjects: [
    { name: "书法（国学诵读）", teacher: "易鑫月" }, { name: "语文", teacher: "易鑫月" }, { name: "数学", teacher: "陈丽丽" }, { name: "语文", teacher: "易鑫月" }, { name: "语文", teacher: "易鑫月" }
  ]},
  { section: "morning", period: "第3节", time: "10:15—10:45", subjects: [
    { name: "科学", teacher: "张鸽" }, { name: "综合实践", teacher: "郭昀佶" }, { name: "国际理解", teacher: "肖含" }, { name: "绘本阅读", teacher: "易鑫月" }, { name: "体育与健康", teacher: "彭彪" }
  ]},
  { section: "morning", period: "第4节", time: "11:00—11:30", subjects: [
    { name: "数学", teacher: "陈丽丽" }, { name: "体育与健康", teacher: "彭彪" }, { name: "劳动", teacher: "白一辰" }, { name: "生安（心理）", teacher: "杨春花/郭昀佶" }, { name: "数学与生活", teacher: "陈丽丽" }
  ]},
  { section: "morning", period: "第5节", time: "11:45—12:15", subjects: [
    { name: "思维训练", teacher: "陈丽丽" }, { name: "音乐", teacher: "魏洋" }, { name: "体育与健康", teacher: "彭彪" }, { name: "英语", teacher: "肖含" }, { name: "道德与法治", teacher: "张雯熙" }
  ]},
  { section: "noon", period: "午休", time: "12:15—13:45", subjects: [
    { name: "午休", teacher: "" }, { name: "午休", teacher: "" }, { name: "午休", teacher: "" }, { name: "午休", teacher: "" }, { name: "午休", teacher: "" }
  ]},
  { section: "afternoon", period: "第6节", time: "14:00—14:30", subjects: [
    { name: "体育特色", teacher: "谢成超" }, { name: "道德与法治", teacher: "张雯熙" }, { name: "美术", teacher: "潘鑫" }, { name: "音乐", teacher: "魏洋" }, { name: "班队（主题活动）", teacher: "易鑫月" }
  ]},
  { section: "afternoon", period: "第7节", time: "14:45—15:15", subjects: [
    { name: "英语", teacher: "肖含" }, { name: "社团", teacher: "" }, { name: "美术", teacher: "潘鑫" }, { name: "体育与健康", teacher: "彭彪" }, { name: "科学", teacher: "张鸽" }
  ]},
  { section: "delay", period: "延时第1节", time: "15:30—16:05", subjects: [
    { name: "语文作业", teacher: "易鑫月" }, { name: "社团", teacher: "" }, { name: "数学作业", teacher: "陈丽丽" }, { name: "数学作业", teacher: "陈丽丽" }, { name: "综合素养1", teacher: "彭彪" }
  ]},
  { section: "delay", period: "延时第2节", time: "16:15—16:50", subjects: [
    { name: "数学作业", teacher: "陈丽丽" }, { name: "语文作业", teacher: "易鑫月" }, { name: "综合素养3", teacher: "郑艳红" }, { name: "语文作业", teacher: "易鑫月" }, { name: "语文作业", teacher: "易鑫月" }
  ]},
  { section: "delay", period: "延时第3节", time: "17:00—17:35", subjects: [
    { name: "综合素养4", teacher: "魏洋" }, { name: "数学作业", teacher: "陈丽丽" }, { name: "语文作业", teacher: "易鑫月" }, { name: "英语延时", teacher: "肖含" }, { name: "综合素养2", teacher: "潘鑫" }
  ]}
];

const HOLIDAYS_2026 = {
  "2026-01-01": { name: "元旦", type: "holiday" },
  "2026-02-17": { name: "除夕", type: "holiday" },
  "2026-02-18": { name: "春节", type: "holiday" },
  "2026-02-19": { name: "初二", type: "holiday" },
  "2026-02-20": { name: "初三", type: "holiday" },
  "2026-02-21": { name: "初四", type: "holiday" },
  "2026-02-22": { name: "初五", type: "holiday" },
  "2026-02-23": { name: "初六", type: "holiday" },
  "2026-02-14": { name: "调休", type: "workday" },
  "2026-02-15": { name: "调休", type: "workday" },
  "2026-04-04": { name: "清明", type: "holiday" },
  "2026-04-05": { name: "清明", type: "holiday" },
  "2026-04-06": { name: "清明", type: "holiday" },
  "2026-04-26": { name: "调休", type: "workday" },
  "2026-05-01": { name: "劳动节", type: "holiday" },
  "2026-05-02": { name: "劳动节", type: "holiday" },
  "2026-05-03": { name: "劳动节", type: "holiday" },
  "2026-05-04": { name: "劳动节", type: "holiday" },
  "2026-05-05": { name: "劳动节", type: "holiday" },
  "2026-06-19": { name: "端午", type: "holiday" },
  "2026-06-20": { name: "端午", type: "holiday" },
  "2026-06-21": { name: "端午", type: "holiday" },
  "2026-09-25": { name: "中秋", type: "holiday" },
  "2026-09-26": { name: "中秋", type: "holiday" },
  "2026-09-27": { name: "调休", type: "workday" },
  "2026-10-01": { name: "国庆", type: "holiday" },
  "2026-10-02": { name: "国庆", type: "holiday" },
  "2026-10-03": { name: "国庆", type: "holiday" },
  "2026-10-04": { name: "国庆", type: "holiday" },
  "2026-10-05": { name: "国庆", type: "holiday" },
  "2026-10-06": { name: "国庆", type: "holiday" },
  "2026-10-07": { name: "国庆", type: "holiday" },
  "2026-10-08": { name: "国庆", type: "holiday" },
  "2026-10-10": { name: "调休", type: "workday" }
};

async function kv(...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("KV_NOT_CONFIGURED");
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(args)
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  return d.result;
}

function dateKey(y, m, d) {
  return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
}

const COURSE_ITEMS_MAP = {
  "体育与健康": "运动鞋、运动服",
  "书法（国学诵读）": "书法用品",
  "科学": "科学材料袋",
  "劳动": "劳动工具",
  "综合实践": "实践材料",
  "绘本阅读": "绘本"
};

function buildItemsText(schedule, day, customItems, prefix) {
  const items = {};
  schedule.forEach(function(row) {
    if (row.period === "午休") return;
    const subj = row.subjects[day - 1];
    if (subj && subj.name && COURSE_ITEMS_MAP[subj.name]) {
      items[subj.name] = COURSE_ITEMS_MAP[subj.name];
    }
  });
  if (customItems && customItems[day] && customItems[day].trim()) {
    items["自定义"] = customItems[day].trim();
  }
  const keys = Object.keys(items);
  if (keys.length === 0) return "";
  let text = "\n\n" + prefix + "：";
  keys.forEach(function(k, i) {
    if (i > 0) text += "；";
    text += k + "→" + items[k];
  });
  return text;
}

function buildSchedule(schedule, targetDate, customItems) {
  const day = targetDate.getDay();
  const dows = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dateStr = targetDate.getFullYear() + "年" + (targetDate.getMonth() + 1) + "月" + targetDate.getDate() + "日 " + dows[day];
  const dk = dateKey(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const hol = HOLIDAYS_2026[dk];
  if (hol && hol.type === "holiday") {
    return dateStr + "\n\n🎉 " + (day === new Date().getDay() ? "今天" : "明天") + "放假 · " + hol.name + "，好好休息！";
  }
  const isWorkday = hol && hol.type === "workday";
  if (!isWorkday && (day === 0 || day === 6)) {
    return dateStr + "\n\n📅 " + (day === 0 || day === 6 ? "周末" : "") + "无课程，好好休息！";
  }
  const lines = [dateStr, ""];
  schedule.forEach(function(row) {
    const sub = row.subjects[day - 1];
    if (!sub) return;
    if (row.period === "午休") {
      lines.push("🕐 午休 " + row.time);
      return;
    }
    let line = "📗 " + row.period + "\u3000" + row.time + " " + sub.name;
    if (sub.teacher) line += "\uff08" + sub.teacher + "\uff09";
    lines.push(line);
  });
  const isToday = day === new Date().getDay();
  const itemsPrefix = isToday ? "🎒 今日需带物品" : "🎒 明日需带物品";
  return lines.join("  \n") + buildItemsText(schedule, day, customItems, itemsPrefix);
}

module.exports = async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret = (req.query && req.query.secret) || (req.headers && req.headers["x-cron-secret"]);
    if (cronSecret && providedSecret !== cronSecret) {
      return res.status(403).json({ ok: false, error: "未授权" });
    }

    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) {
      return res.status(200).json({ ok: false, error: "TG_BOT_TOKEN未配置" });
    }

    const now = new Date();
    const currentDateKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const pushType = req.query && req.query.type;

    let cursor = "0";
    const allKeys = [];
    do {
      const result = await kv("SCAN", cursor, "MATCH", "push:*", "COUNT", "100");
      cursor = result[0];
      allKeys.push(...result[1]);
    } while (cursor !== "0");

    const results = [];
    for (const key of allKeys) {
      try {
        const val = await kv("GET", key);
        if (!val) continue;
        const cfg = JSON.parse(val);
        if (!cfg || !cfg.tg || !cfg.tg.enabled || !cfg.tg.key) continue;

        const username = key.replace("push:", "");
        const scheduleKey = "schedule:" + username.toLowerCase();
        let schedule = DEFAULT_SCHEDULE;
        try {
          const savedSchedule = await kv("GET", scheduleKey);
          if (savedSchedule) {
            const parsed = JSON.parse(savedSchedule);
            if (Array.isArray(parsed)) schedule = parsed;
          }
        } catch(e) {}

        let customItems = null;
        try {
          const itemsKey = "items:" + username.toLowerCase();
          const savedItems = await kv("GET", itemsKey);
          if (savedItems) customItems = JSON.parse(savedItems);
        } catch(e) {}

        const doMorning = cfg.tg.morningAuto && (pushType === "morning" || pushType === "all");
        const doEvening = cfg.tg.eveningAuto && (!pushType || pushType === "evening" || pushType === "all");

        if (doMorning) {
          const sentKey = "cron_sent:tg_morn:" + username + ":" + currentDateKey;
          const alreadySent = await kv("GET", sentKey);
          if (!alreadySent) {
            const content = buildSchedule(schedule, now, customItems);
            const tgRes = await fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: cfg.tg.key, text: content })
            });
            const tgData = await tgRes.json();
            await kv("SET", sentKey, "1");
            await kv("EXPIRE", sentKey, 86400);
            results.push({ user: username, type: "morning", ok: tgData.ok, error: tgData.description });
          }
        }

        if (doEvening) {
          const sentKey = "cron_sent:tg_even:" + username + ":" + currentDateKey;
          const alreadySent = await kv("GET", sentKey);
          if (!alreadySent) {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const content = buildSchedule(schedule, tomorrow, customItems);
            const tgRes = await fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: cfg.tg.key, text: content })
            });
            const tgData = await tgRes.json();
            await kv("SET", sentKey, "1");
            await kv("EXPIRE", sentKey, 86400);
            results.push({ user: username, type: "evening", ok: tgData.ok, error: tgData.description });
          }
        }
      } catch(err) {
        results.push({ key: key, error: err.message });
      }
    }

    return res.status(200).json({ ok: true, time: now.toISOString(), processed: allKeys.length, results: results });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};