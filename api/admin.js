const crypto = require("crypto");

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

function verifyJWT(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  const parts = (token || "").split(".");
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const sig = crypto.createHmac("sha256", secret).update(h + "." + b).digest("base64url");
  if (sig !== s) return null;
  try {
    const payload = JSON.parse(Buffer.from(b, "base64url").toString());
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch { return null; }
}

const ADMIN_USER = "zoubo";

module.exports = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const payload = verifyJWT(token);
    if (!payload || !payload.user) return res.status(401).json({ error: "未登录" });
    if (payload.user.toLowerCase() !== ADMIN_USER) return res.status(403).json({ error: "非管理员" });

    const action = (req.query && req.query.action) || "list";

    if (action === "list") {
      let cursor = "0";
      const allKeys = [];
      do {
        const result = await kv("SCAN", cursor, "MATCH", "visits:*", "COUNT", "100");
        cursor = result[0];
        allKeys.push(...result[1]);
      } while (cursor !== "0");

      const dateKeys = allKeys.filter(k => k.startsWith("visits:") && k !== "visits:ip_list").sort().reverse();

      const summary = [];
      for (const dk of dateKeys.slice(0, 30)) {
        const val = await kv("GET", dk);
        if (val) {
          const visits = JSON.parse(val);
          const ips = new Set(visits.map(v => v.ip));
          summary.push({
            date: dk.replace("visits:", ""),
            total: visits.length,
            uniqueIPs: ips.size
          });
        }
      }

      return res.status(200).json({ ok: true, summary: summary });
    }

    if (action === "detail") {
      const date = (req.query && req.query.date) || new Date().toISOString().slice(0, 10);
      const kvKey = "visits:" + date;
      const val = await kv("GET", kvKey);
      const visits = val ? JSON.parse(val) : [];

      const ipGroups = {};
      visits.forEach(v => {
        if (!ipGroups[v.ip]) ipGroups[v.ip] = [];
        ipGroups[v.ip].push(v.time);
      });

      return res.status(200).json({
        ok: true,
        date: date,
        total: visits.length,
        uniqueIPs: Object.keys(ipGroups).length,
        ipGroups: Object.keys(ipGroups).map(ip => ({
          ip: ip,
          count: ipGroups[ip].length,
          times: ipGroups[ip].slice(-10),
          lastTime: ipGroups[ip][ipGroups[ip].length - 1]
        })).sort((a, b) => b.count - a.count)
      });
    }

    if (action === "ips") {
      const val = await kv("GET", "visits:ip_list");
      const ips = val ? JSON.parse(val) : [];
      return res.status(200).json({ ok: true, ips: ips });
    }

    return res.status(400).json({ error: "未知操作" });
  } catch (err) {
    if (err.message === "KV_NOT_CONFIGURED") return res.status(500).json({ error: "KV未配置" });
    return res.status(500).json({ error: err.message });
  }
};