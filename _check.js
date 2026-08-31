const holidays2026 = {
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
const schoolEvents2026 = {
"2026-08-29": { name: "报名", type: "schoolevent" },
"2026-08-30": { name: "适应学习", type: "schoolevent" },
"2026-09-01": { name: "开学", type: "schoolevent" }
};
const festivals2026 = {
"2026-01-01": { name: "元旦", type: "festival" },
"2026-02-14": { name: "情人节", type: "festival" },
"2026-03-05": { name: "学雷锋日", type: "festival" },
"2026-03-08": { name: "妇女节", type: "festival" },
"2026-03-12": { name: "植树节", type: "festival" },
"2026-03-15": { name: "消费者权益日", type: "festival" },
"2026-04-01": { name: "愚人节", type: "festival" },
"2026-04-23": { name: "读书日", type: "festival" },
"2026-05-04": { name: "青年节", type: "festival" },
"2026-05-10": { name: "母亲节", type: "festival" },
"2026-05-12": { name: "护士节", type: "festival" },
"2026-06-01": { name: "儿童节", type: "festival" },
"2026-06-21": { name: "父亲节", type: "festival" },
"2026-07-01": { name: "建党节", type: "festival" },
"2026-08-01": { name: "建军节", type: "festival" },
"2026-09-03": { name: "抗战胜利日", type: "festival" },
"2026-09-10": { name: "教师节", type: "festival" },
"2026-10-19": { name: "重阳节", type: "festival" },
"2026-10-31": { name: "万圣节", type: "festival" },
"2026-11-26": { name: "感恩节", type: "festival" },
"2026-12-24": { name: "平安夜", type: "festival" },
"2026-12-25": { name: "圣诞节", type: "festival" }
};
let calDate = new Date();
let weekRef = new Date();
const today = new Date();
let viewMode = "week";
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function dateKey(y, m, d) { return `${y}-${pad(m+1)}-${pad(d)}`; }
function sameDay(a, b) { return a.toDateString() === b.toDateString(); }
function getWeekStart(d) {
const s = new Date(d);
s.setHours(0,0,0,0);
s.setDate(s.getDate() - s.getDay());
return s;
}
function getWeekNumber(d) {
const start = new Date(d.getFullYear(), 0, 1);
const diff = (d - start) / 86400000 + start.getDay() + 1;
return Math.ceil(diff / 7);
}
function getDayInfo(date) {
const y = date.getFullYear();
const m = date.getMonth();
const d = date.getDate();
const dow = date.getDay();
const key = dateKey(y, m, d);
const hol = holidays2026[key];
const evt = schoolEvents2026[key];
const fest = festivals2026[key];
const mark = evt || hol || fest;
return { y, m, d, dow, key, hol, evt, fest, mark, isToday: sameDay(date, today) };
}
function renderWeekView() {
const start = getWeekStart(weekRef);
const container = document.getElementById("weekView");
container.innerHTML = "";
const dows = ["周日","周一","周二","周三","周四","周五","周六"];
const monthNames = start.getMonth() === (new Date(start.getTime()+6*86400000)).getMonth()
? `${start.getFullYear()}年${start.getMonth()+1}月`
: `${start.getFullYear()}年${start.getMonth()+1}月–${(new Date(start.getTime()+6*86400000)).getMonth()+1}月`;
document.getElementById("calTitle").textContent = `${monthNames} · 第${getWeekNumber(start)}周`;
for (let i = 0; i < 7; i++) {
const date = new Date(start.getTime() + i * 86400000);
const info = getDayInfo(date);
const cell = document.createElement("div");
cell.className = "week-cell";
if (info.dow === 0 || info.dow === 6) cell.classList.add("weekend");
if (info.mark) cell.classList.add(info.mark.type);
if (info.isToday) cell.classList.add("today");
let html = `<div class="wk-dow">${dows[i]}</div><div class="wk-day">${info.d}</div>`;
if (info.mark) html += `<div class="wk-tag">${info.mark.name}</div>`;
cell.innerHTML = html;
cell.title = `${info.y}年${info.m+1}月${info.d}日 ${info.mark ? info.mark.name : ""}`;
container.appendChild(cell);
}
}
function renderMonthView() {
const year = calDate.getFullYear();
const month = calDate.getMonth();
document.getElementById("calTitle").textContent = `${year}年${month+1}月`;
const grid = document.getElementById("calendarGrid");
grid.innerHTML = "";
const weeks = ["日","一","二","三","四","五","六"];
weeks.forEach((w, i) => {
const el = document.createElement("div");
el.className = "calendar-week" + (i === 0 || i === 6 ? " weekend" : "");
el.textContent = w;
grid.appendChild(el);
});
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();
for (let i = 0; i < firstDay; i++) {
const el = document.createElement("div");
el.className = "calendar-day empty";
grid.appendChild(el);
}
for (let d = 1; d <= daysInMonth; d++) {
const el = document.createElement("div");
el.className = "calendar-day";
const date = new Date(year, month, d);
const info = getDayInfo(date);
if (info.dow === 0 || info.dow === 6) el.classList.add("weekend");
if (info.mark) el.classList.add(info.mark.type);
if (info.isToday) el.classList.add("today");
let html = `<span class="day-num">${d}</span>`;
if (info.mark) html += `<span class="day-tag">${info.mark.name}</span>`;
el.innerHTML = html;
el.title = info.mark ? `${year}年${month+1}月${d}日 ${info.mark.name}` : `${year}年${month+1}月${d}日`;
grid.appendChild(el);
}
}
function renderCalendar() {
if (viewMode === "week") {
renderWeekView();
} else {
renderMonthView();
}
}
function toggleView() {
viewMode = viewMode === "week" ? "month" : "week";
const btn = document.getElementById("toggleViewBtn");
const wv = document.getElementById("weekView");
const mv = document.getElementById("monthView");
if (viewMode === "month") {
calDate = new Date(weekRef);
btn.textContent = "收起为周 ▴";
wv.classList.add("hidden");
mv.classList.add("active");
} else {
btn.textContent = "展开当月 ▾";
wv.classList.remove("hidden");
mv.classList.remove("active");
}
renderCalendar();
}
function changePrev() {
if (viewMode === "week") {
weekRef.setDate(weekRef.getDate() - 7);
} else {
calDate.setMonth(calDate.getMonth() - 1);
}
renderCalendar();
}
function changeNext() {
if (viewMode === "week") {
weekRef.setDate(weekRef.getDate() + 7);
} else {
calDate.setMonth(calDate.getMonth() + 1);
}
renderCalendar();
}
function goToday() {
weekRef = new Date();
calDate = new Date();
renderCalendar();
}
renderCalendar();
let currentUser = null;
let editMode = false;
let authMode = "login";
function simpleHash(str) {
let h = 0;
for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
return String(h);
}
function getUsers() {
try { return JSON.parse(localStorage.getItem("kc_users") || "{}"); } catch(e) { return {}; }
}
function saveUsers(u) { localStorage.setItem("kc_users", JSON.stringify(u)); }
function getUserData(username) {
try { return JSON.parse(localStorage.getItem("kc_data_" + username) || "null"); } catch(e) { return null; }
}
function saveUserData(username, data) { localStorage.setItem("kc_data_" + username, JSON.stringify(data)); }

function getPushConfig(){try{return JSON.parse(localStorage.getItem("kc_push")||"null")}catch(e){return null}}
function savePushConfig(cfg){localStorage.setItem("kc_push",JSON.stringify(cfg))}
function openPushSettings(){const cfg=getPushConfig()||{};var wx=cfg.wx||{},tg=cfg.tg||{};document.getElementById("wxEnabled").checked=wx.enabled!==false;document.getElementById("tgEnabled").checked=tg.enabled===true;document.getElementById("pushWxKey").value=wx.key||"";document.getElementById("pushTgKey").value=tg.key||"";document.getElementById("wxAuto").checked=wx.auto===true;document.getElementById("wxHour").value=String(wx.pushHour||8);toggleRow("wxTimeRow",wx.auto===true);var tgMorn=tg.morningAuto===true;var tgEven=tg.eveningAuto===true;document.getElementById("tgMorningAuto").checked=tgMorn;document.getElementById("tgEveningAuto").checked=tgEven;document.getElementById("tgMorningHour").value=String(tg.morningHour||8);document.getElementById("tgEveningHour").value=String(tg.eveningHour||22);toggleRow("tgMorningRow",tgMorn);toggleRow("tgEveningRow",tgEven);document.getElementById("pushModal").classList.add("show")}
function toggleRow(id,show){var el=document.getElementById(id);if(el){el.style.display=show?"block":"none"}}
function savePushSettings(){var wxEnabled=document.getElementById("wxEnabled").checked;var tgEnabled=document.getElementById("tgEnabled").checked;var wxKey=document.getElementById("pushWxKey").value.trim();var tgKey=document.getElementById("pushTgKey").value.trim();var wxAuto=document.getElementById("wxAuto").checked;var wxHour=parseFloat(document.getElementById("wxHour").value)||8;var tgMornAuto=document.getElementById("tgMorningAuto").checked;var tgEvenAuto=document.getElementById("tgEveningAuto").checked;var tgMornHour=parseFloat(document.getElementById("tgMorningHour").value)||8;var tgEvenHour=parseFloat(document.getElementById("tgEveningHour").value)||22;if(wxEnabled&&!wxKey){showToast("请填写微信 SendKey");return}if(tgEnabled&&!tgKey){showToast("请填写 Telegram Chat ID");return}if(!wxEnabled&&!tgEnabled){showToast("请至少启用一个渠道");return}savePushConfig({wx:{enabled:wxEnabled,key:wxKey,auto:wxAuto,pushHour:wxHour},tg:{enabled:tgEnabled,key:tgKey,morningAuto:tgMornAuto,eveningAuto:tgEvenAuto,morningHour:tgMornHour,eveningHour:tgEvenHour}});document.getElementById("pushModal").classList.remove("show");showToast("推送设置已保存")}
function buildTodaySchedule(){const now=new Date();const day=now.getDay();const dows=["周日","周一","周二","周三","周四","周五","周六"];let md="## 📚 今日课程\n\n";md+="**"+now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 "+dows[day]+"**\n\n";const todayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();if(typeof holidays2026!=="undefined"){const hol=holidays2026[todayKey];if(hol&&hol.type==="holiday"){md+="🎉 今天放假 · "+hol.name+"，好好休息！";return md}}if(day===0||day===6){md+="📅 周末无课程，好好休息！";return md}let hasCourse=false;scheduleData.forEach(row=>{if(row.period==="午休"){md+="| "+row.period+" | "+row.time+" |\n";return}const sub=row.subjects[day-1];if(sub){hasCourse=true;md+="| **"+row.period+"** "+row.time+" | "+sub.name+(sub.teacher?"（"+sub.teacher+"）":"")+" |\n"}});if(!hasCourse){md+="📅 今天无课程"}return md}
function buildTomorrowSchedule(){const tmr=new Date();tmr.setDate(tmr.getDate()+1);const day=tmr.getDay();const dows=["周日","周一","周二","周三","周四","周五","周六"];let md="## 📚 明日课程\n\n";md+="**"+tmr.getFullYear()+"年"+(tmr.getMonth()+1)+"月"+tmr.getDate()+"日 "+dows[day]+"**\n\n";const tmrKey=tmr.getFullYear()+"-"+(tmr.getMonth()+1)+"-"+tmr.getDate();if(typeof holidays2026!=="undefined"){const hol=holidays2026[tmrKey];if(hol&&hol.type==="holiday"){md+="🎉 明天放假 · "+hol.name+"，好好休息！";return md}}if(day===0||day===6){md+="📅 明天周末无课程，好好休息！";return md}let hasCourse=false;scheduleData.forEach(row=>{if(row.period==="午休"){md+="| "+row.period+" | "+row.time+" |\n";return}const sub=row.subjects[day-1];if(sub){hasCourse=true;md+="| **"+row.period+"** "+row.time+" | "+sub.name+(sub.teacher?"（"+sub.teacher+"）":"")+" |\n"}});if(!hasCourse){md+="📅 明天无课程"}return md}
function sendOne(channel,key,content,title,successMsg){if(channel==="wx"){fetch("https://sctapi.ftqq.com/"+key+".send",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"title="+encodeURIComponent(title)+"&desp="+encodeURIComponent(content)}).then(function(r){return r.json()}).then(function(data){if(data&&data.code===0){showToast(successMsg)}else{showToast("❌ 微信推送失败："+(data&&data.message||"未知错误"))}}).catch(function(err){showToast("❌ 微信推送失败，请检查网络")})}else if(channel==="tg"){fetch("/api/tg-push",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:key,text:content})}).then(function(r){return r.json()}).then(function(data){if(data&&data.ok){showToast(successMsg)}else{showToast("❌ Telegram推送失败："+(data&&data.description||"未知错误"))}}).catch(function(err){showToast("❌ Telegram推送失败，请检查网络")})}}
function pushToday(){const cfg=getPushConfig();if(!cfg){showToast("请先配置推送");openPushSettings();return}const content=buildTodaySchedule();showToast("正在推送...");var sent=0;if(cfg.wx&&cfg.wx.enabled&&cfg.wx.key){sent++;sendOne("wx",cfg.wx.key,content,"今日课程安排","✅ 微信已推送")}if(cfg.tg&&cfg.tg.enabled&&cfg.tg.key){sent++;sendOne("tg",cfg.tg.key,content,"今日课程安排","✅ Telegram已推送")}if(sent===0){showToast("请先启用至少一个渠道");openPushSettings()}}
function testPush(){const cfg=getPushConfig()||{};var wxEnabled=document.getElementById("wxEnabled").checked;var tgEnabled=document.getElementById("tgEnabled").checked;var wxKey=document.getElementById("pushWxKey").value.trim();var tgKey=document.getElementById("pushTgKey").value.trim();var sent=0;if(wxEnabled&&wxKey){sent++;sendOne("wx",wxKey,"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ 微信测试成功")}if(tgEnabled&&tgKey){sent++;sendOne("tg",tgKey,"这是一条测试消息，收到说明配置成功！","✅ 测试推送","✅ Telegram测试成功")}if(sent===0){showToast("请先填写并启用至少一个渠道")}}
var themes=["default","green","orange","pink","dark"];var themeNames=["\u84DD\u7D2B","\u6E05\u65B0\u7EFF","\u6696\u9633\u6A59","\u6A31\u82B1\u7C89","\u6697\u591C"];function initTheme(){var t=localStorage.getItem("curriculum-theme")||"default";document.documentElement.setAttribute("data-theme",t);updateThemeBtn(t)}function cycleTheme(){var cur=document.documentElement.getAttribute("data-theme")||"default";var idx=themes.indexOf(cur);var next=themes[(idx+1)%themes.length];document.documentElement.setAttribute("data-theme",next);localStorage.setItem("curriculum-theme",next);updateThemeBtn(next)}
function updateThemeBtn(t){var idx=themes.indexOf(t);var btn=document.getElementById("themeBtn");if(btn){btn.innerHTML="\u{1F3A8} "+themeNames[idx>=0?idx:0]}}function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = LZString.compressToEncodedURIComponent(json);
const longUrl = location.origin + location.pathname + "#s=" + encoded;
showToast("正在生成短链接...");
fetch("/api/shorten", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({url: longUrl})})
.then(r => r.json())
.then(data => {
const finalUrl = data.short || longUrl;
copyToClipboard(finalUrl);
})
.catch(() => { copyToClipboard(longUrl); });
} catch(e) { showToast("生成链接失败"); }
}
function copyToClipboard(text) {
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("分享链接已复制到剪贴板"));
} else {
const ta = document.createElement("textarea");
ta.value = text; document.body.appendChild(ta); ta.select();
document.execCommand("copy"); document.body.removeChild(ta);
showToast("分享链接已复制到剪贴板");
}
}
function loadFromHash() {
const hash = location.hash;
if (hash.startsWith("#s=")) {
try {
const encoded = hash.substring(3);
const json = LZString.decompressFromEncodedURIComponent(encoded);
const data = JSON.parse(json);
if (Array.isArray(data)) {
scheduleData.length = 0;
data.forEach(r => scheduleData.push(r));
return true;
}
} catch(e) {}
}
return false;
}
function autoPushCheck(){const cfg=getPushConfig();if(!cfg)return;const now=new Date();const dateKey=now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate();var curMin=now.getHours()*60+now.getMinutes();function doPush(name,key,content,title,successMsg,storageKey){var last=localStorage.getItem(storageKey);if(last)return;sendOne(name,key,content,title,successMsg);localStorage.setItem(storageKey,"1")}if(cfg.wx&&cfg.wx.enabled&&cfg.wx.auto&&cfg.wx.key){var ph=cfg.wx.pushHour||8;var tgtMin=Math.floor(ph)*60+(ph%1===0?0:30);if(curMin>=tgtMin&&curMin<tgtMin+60){doPush("wx",cfg.wx.key,buildTodaySchedule(),"今日课程安排","✅ 微信已推送今日课程","kc_autopush_wx_"+dateKey)}}if(cfg.tg&&cfg.tg.enabled&&cfg.tg.key){if(cfg.tg.morningAuto){var mh=cfg.tg.morningHour||8;var mTgt=Math.floor(mh)*60+(mh%1===0?0:30);if(curMin>=mTgt&&curMin<mTgt+60){doPush("tg",cfg.tg.key,buildTodaySchedule(),"今日课程安排","✅ Telegram已推送今日课程","kc_autopush_tg_morn_"+dateKey)}}if(cfg.tg.eveningAuto){var eh=cfg.tg.eveningHour||22;var eTgt=Math.floor(eh)*60+(eh%1===0?0:30);if(curMin>=eTgt&&curMin<eTgt+60){doPush("tg",cfg.tg.key,buildTomorrowSchedule(),"明日课程安排","✅ Telegram已推送明日课程","kc_autopush_tg_even_"+dateKey)}}}
}
function updateAccountUI() {
const info = document.getElementById("accountInfo");
const actions = document.getElementById("accountActions");
const editBtn = document.getElementById("editBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
if (currentUser) {
info.innerHTML = `<div class="avatar">${currentUser[0].toUpperCase()}</div><span class="username">${currentUser}</span>`;
actions.innerHTML = `<button class="btn-sm danger" onclick="logout()">退出</button>`;
editBtn.style.display = "inline-flex";
exportBtn.style.display = "inline-flex";
importBtn.style.display = "inline-flex";
} else {
info.innerHTML = `<div class="avatar">G</div><span class="guest">未登录 — 请登录后可自定义课程表</span>`;
actions.innerHTML = `<button class="btn-sm" onclick="openAuth('login')">登录</button><button class="btn-sm success" onclick="openAuth('register')">注册</button>`;
editBtn.style.display = "none";
exportBtn.style.display = "none";
importBtn.style.display = "none";
}
}
function openAuth(mode) { authMode = mode; switchAuthTab(mode); document.getElementById("authModal").classList.add("show"); }
function closeAuth() { document.getElementById("authModal").classList.remove("show"); document.getElementById("authUser").value = ""; document.getElementById("authPass").value = ""; }
function switchAuthTab(mode) {
authMode = mode;
document.getElementById("tabLogin").classList.toggle("active", mode === "login");
document.getElementById("tabRegister").classList.toggle("active", mode === "register");
document.getElementById("authSubmit").textContent = mode === "login" ? "登录" : "注册";
}
function submitAuth() {
const user = document.getElementById("authUser").value.trim();
const pass = document.getElementById("authPass").value;
if (!user || !pass) { showToast("请输入用户名和密码"); return; }
const users = getUsers();
if (authMode === "register") {
if (users[user]) { showToast("用户名已存在"); return; }
users[user] = { pass: simpleHash(pass) };
saveUsers(users);
currentUser = user;
saveUserData(user, JSON.parse(JSON.stringify(scheduleData)));
sessionStorage.setItem("kc_current_user", user);
closeAuth();
updateAccountUI();
showToast("注册成功，欢迎 " + user);
} else {
if (!users[user] || users[user].pass !== simpleHash(pass)) { showToast("用户名或密码错误"); return; }
currentUser = user;
const saved = getUserData(user);
if (saved) { scheduleData.length = 0; saved.forEach(r => scheduleData.push(r)); renderSchedule(); }
sessionStorage.setItem("kc_current_user", user);
closeAuth();
updateAccountUI();
showToast("登录成功，欢迎回来 " + user);
}
}
function logout() {
currentUser = null;
editMode = false;
sessionStorage.removeItem("kc_current_user");
location.reload();
}
function toggleEdit() {
if (!currentUser) { showToast("请先登录"); return; }
editMode = !editMode;
const btn = document.getElementById("editBtn");
if (editMode) {
btn.textContent = "💾 保存";
btn.classList.add("danger");
showToast("双击课程格可编辑，保存后点击此按钮");
enableInlineEdit();
} else {
btn.textContent = "✏️ 编辑课程";
btn.classList.remove("danger");
saveUserData(currentUser, scheduleData);
showToast("课程表已保存");
renderSchedule();
}
}
function enableInlineEdit() {
document.querySelectorAll("td.subject").forEach(td => {
td.classList.add("editing");
});
}
function editCell(td) {
const r = parseInt(td.dataset.row);
const c = parseInt(td.dataset.col);
const sub = scheduleData[r].subjects[c];
const oldName = sub.name;
const oldTeacher = sub.teacher;
td.innerHTML = `<input class="inline-edit" value="${sub.name}" id="editName"><input class="inline-edit" value="${sub.teacher}" id="editTeacher">`;
const nameInput = document.getElementById("editName");
const teacherInput = document.getElementById("editTeacher");
nameInput.focus();
function save() {
sub.name = nameInput.value || oldName;
sub.teacher = teacherInput.value;
td.innerHTML = `<div class="subject-name">${sub.name}</div>${sub.teacher ? `<div class="subject-teacher">（${sub.teacher}）</div>` : ""}`;
}
nameInput.onblur = save;
teacherInput.onblur = save;
nameInput.onkeydown = function(e) { if (e.key === "Enter") this.blur(); };
teacherInput.onkeydown = function(e) { if (e.key === "Enter") this.blur(); };
}
function exportData() {
const data = { user: currentUser, schedule: scheduleData, exportDate: new Date().toISOString() };
const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `kechengbiao_${currentUser || "default"}_${new Date().toISOString().slice(0,10)}.json`;
a.click();
URL.revokeObjectURL(url);
showToast("已导出课程表配置");
}
function importData(event) {
const file = event.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(e) {
try {
const data = JSON.parse(e.target.result);
if (!data.schedule || !Array.isArray(data.schedule)) { showToast("文件格式错误"); return; }
scheduleData.length = 0;
data.schedule.forEach(r => scheduleData.push(r));
renderSchedule();
if (currentUser) { saveUserData(currentUser, scheduleData); showToast("导入成功并已保存"); }
else { showToast("导入成功（登录后可保存）"); }
} catch(err) { showToast("文件解析失败"); }
};
reader.readAsText(file);
event.target.value = "";
}
function shareLink() {
try {
const json = JSON.stringify(scheduleData);
const encoded = btoa(unescape(encodeURIComponent(json)));
const url = location.origin + location.pathname + "#s=" + encoded;
if (navigator.clipboard) {
navigator.clipboard.writeText(url).then(() => showToast("分享链接已复制到剪贴板"));
} else {
const ta = document.createElement("textarea");
ta.value = url; document.body.appendChild(ta); ta.select();
document.execCommand("copy"); document.body.removeChild(ta);
showToast("分享链接已复制到剪贴板");
}
} catch(e) { showToast("生成链接失败"); }
}
function loadFromHash() {
const hash = location.hash;
if (hash.startsWith("#s=")) {
try {
const encoded = hash.substring(3);
const json = decodeURIComponent(escape(atob(encoded)));
const data = JSON.parse(json);
if (Array.isArray(data)) {
scheduleData.length = 0;
data.forEach(r => scheduleData.push(r));
return true;
}
} catch(e) {}
}
return false;
}
function exportPDF(){showToast("\u6B63\u5728\u751F\u6210PDF...");var el=document.querySelector(".schedule-wrapper");var container=document.createElement("div");var renderW=1400;var curTheme=document.documentElement.getAttribute("data-theme")||"default";var themeBg=curTheme==="dark"?"#0F172A":"#fff";container.style.cssText="position:absolute;left:-9999px;top:0;width:"+renderW+"px;background:"+themeBg+";padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;";if(curTheme!=="default"){container.setAttribute("data-theme",curTheme)}var header=document.createElement("div");header.style.cssText="background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#A78BFA 100%);color:#fff;padding:22px 30px;text-align:center;";var h1=document.querySelector(".header h1");var infoSpans=document.querySelectorAll(".header .info span");var titleText=h1?h1.textContent:"\u8BFE\u7A0B\u8868";var infoText="";for(var s=0;s<infoSpans.length;s++){infoText+=(s>0?"\u3000\u3000":"")+infoSpans[s].textContent.trim()}header.innerHTML='<div style="font-size:28px;font-weight:700;margin-bottom:8px;">'+titleText+'</div><div style="font-size:14px;opacity:0.92;">'+infoText+'</div>';container.appendChild(header);var clone=el.cloneNode(true);clone.style.borderRadius="0";clone.style.boxShadow="none";clone.style.margin="0";var tds=clone.querySelectorAll("td,th");for(var t=0;t<tds.length;t++){tds[t].style.padding="10px 6px";tds[t].style.fontSize="14px"}var names=clone.querySelectorAll(".subject-name");for(var n=0;n<names.length;n++){names[n].style.fontSize="15px"}var teachers=clone.querySelectorAll(".subject-teacher");for(var tc=0;tc<teachers.length;tc++){teachers[tc].style.fontSize="12px"}var times=clone.querySelectorAll(".period-time");for(var ti=0;ti<times.length;ti++){times[ti].style.fontSize="11px"}var pnames=clone.querySelectorAll(".period-name");for(var pn=0;pn<pnames.length;pn++){pnames[pn].style.fontSize="14px"}container.appendChild(clone);document.body.appendChild(container);html2canvas(container,{scale:2,backgroundColor:themeBg,useCORS:true,windowWidth:renderW}).then(function(canvas){document.body.removeChild(container);var img=canvas.toDataURL("image/jpeg",0.95);var iw=canvas.width;var ih=canvas.height;var cr=iw/ih;var pdf;var pw,ph;if(cr>1){pdf=new jspdf.jsPDF("l","mm","a4")}else{pdf=new jspdf.jsPDF("p","mm","a4")}pw=pdf.internal.pageSize.getWidth();ph=pdf.internal.pageSize.getHeight();var availW=pw;var availH=ph;var availRatio=availW/availH;var w,h;if(cr>availRatio){w=availW;h=w/cr}else{h=availH;w=h*cr}pdf.addImage(img,"JPEG",(pw-w)/2,(ph-h)/2,w,h);pdf.save("kechengbiao_"+(currentUser||"default")+"_"+new Date().toISOString().slice(0,10)+".pdf");showToast("PDF\u5DF2\u5BFC\u51FA")}).catch(function(err){document.body.removeChild(container);showToast("\u5BFC\u51FA\u5931\u8D25:"+err.message)})}
function autoLogin() {
if (loadFromHash()) {
document.getElementById("accountInfo").innerHTML = `<div class="avatar">S</div><span class="guest">通过分享链接查看（免登录）</span>`;
document.getElementById("accountActions").innerHTML = `<button class="btn-sm" onclick="location.hash='';location.reload()">返回默认课表</button>`;
return;
}
const remembered = sessionStorage.getItem("kc_current_user");
if (remembered) {
currentUser = remembered;
const saved = getUserData(remembered);
if (saved) { scheduleData.length = 0; saved.forEach(r => scheduleData.push(r)); }
}
updateAccountUI();
}
let scheduleData = [
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
const days = ["星期一", "星期二", "星期三", "星期四", "星期五"];
let showTime = true;
function renderSchedule() {
const body = document.getElementById("scheduleBody");
body.innerHTML = "";
scheduleData.forEach((row, rIdx) => {
const tr = document.createElement("tr");
tr.className = "row-" + row.section;
tr.dataset.period = row.period;
tr.dataset.time = row.time;
const periodTd = document.createElement("td");
periodTd.className = "period-col";
periodTd.innerHTML = `<div class="period-name">${row.period}</div>${showTime ? `<span class="period-time">${row.time}</span>` : ""}`;
tr.appendChild(periodTd);
row.subjects.forEach((sub, cIdx) => {
const td = document.createElement("td");
td.className = "subject";
td.dataset.row = rIdx;
td.dataset.col = cIdx;
td.innerHTML = `<div class="subject-name">${sub.name}</div>${sub.teacher ? `<div class="subject-teacher">（${sub.teacher}）</div>` : ""}`;
td.onclick = () => { if (editMode) editCell(td); else showDetail(row, sub, cIdx); };
tr.appendChild(td);
});
body.appendChild(tr);
});
}
function showDetail(row, sub, dayIdx) {
document.getElementById("modalTitle").textContent = sub.name;
document.getElementById("modalSubject").innerHTML = `<strong>科目：</strong>${sub.name}`;
document.getElementById("modalTeacher").innerHTML = sub.teacher ? `<strong>教师：</strong>${sub.teacher}` : "";
document.getElementById("modalTime").innerHTML = `<strong>时间：</strong>${row.time}`;
document.getElementById("modalDay").innerHTML = `<strong>节次：</strong>${days[dayIdx]} ${row.period}`;
document.getElementById("modal").classList.add("show");
}
function closeModal() {
document.getElementById("modal").classList.remove("show");
}
function toggleTime() {
showTime = !showTime;
renderSchedule();
}
function getCurrentPeriod() {
const now = new Date();
const day = now.getDay();
const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
const todayHol = holidays2026[todayKey];
if (todayHol && todayHol.type === "holiday") {
return { period: "放假", idx: -1, day: day, holiday: todayHol.name };
}
const isWorkday = todayHol && todayHol.type === "workday";
if (!isWorkday && (day === 0 || day === 6)) return { period: "周末", idx: -1, day: day };
const minutes = now.getHours() * 60 + now.getMinutes();
const timeRanges = [
{ start: 8*60+30, end: 9*60+0, idx: 0 },
{ start: 9*60+30, end: 10*60+0, idx: 1 },
{ start: 10*60+15, end: 10*60+45, idx: 2 },
{ start: 11*60+0, end: 11*60+30, idx: 3 },
{ start: 11*60+45, end: 12*60+15, idx: 4 },
{ start: 12*60+15, end: 13*60+45, idx: 5 },
{ start: 14*60+0, end: 14*60+30, idx: 6 },
{ start: 14*60+45, end: 15*60+15, idx: 7 },
{ start: 15*60+30, end: 16*60+5, idx: 8 },
{ start: 16*60+15, end: 16*60+50, idx: 9 },
{ start: 17*60+0, end: 17*60+35, idx: 10 }
];
for (const r of timeRanges) {
if (minutes >= r.start && minutes <= r.end) {
return { period: scheduleData[r.idx].period, idx: r.idx, day: day, time: scheduleData[r.idx].time };
}
}
return { period: "课间", idx: -1, day: day };
}
function showToast(msg) {
const toast = document.getElementById("toast");
toast.textContent = msg;
toast.classList.add("show");
clearTimeout(toast._timer);
toast._timer = setTimeout(function() { toast.classList.remove("show"); }, 2500);
}
function highlightCurrent(scroll) {
document.querySelectorAll(".current").forEach(el => el.classList.remove("current"));
const cur = getCurrentPeriod();
document.getElementById("currentPeriod").textContent = cur.period;
const banner = document.getElementById("holidayBanner");
if (cur.holiday) {
banner.textContent = "🎉 今日放假 — " + cur.holiday + "，好好休息！";
banner.classList.add("show");
} else {
banner.classList.remove("show");
}
if (cur.idx >= 0 && cur.day >= 1 && cur.day <= 5) {
const rows = document.querySelectorAll("#scheduleBody tr");
if (rows[cur.idx]) {
const tds = rows[cur.idx].querySelectorAll("td.subject");
if (tds[cur.day - 1]) {
tds[cur.day - 1].classList.add("current");
if (scroll) tds[cur.day - 1].scrollIntoView({ behavior: "smooth", block: "center" });
return;
}
}
}
if (scroll) {
if (cur.holiday) showToast("今日放假 — " + cur.holiday + "，无课程安排");
else if (cur.period === "周末") showToast("今天是周末，无课程安排");
else if (cur.period === "课间") showToast("当前是课间休息时间");
else showToast("当前无课程安排");
}
}
autoLogin();
renderSchedule();
highlightCurrent(false);
setInterval(function() { highlightCurrent(false); }, 30000);setInterval(autoPushCheck, 60000);autoPushCheck();
document.getElementById("modal").addEventListener("click", function(e) {
if (e.target === this) closeModal();
});initTheme();

;
