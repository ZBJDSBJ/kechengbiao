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

module.exports = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const payload = verifyJWT(token);
    if (!payload || !payload.user) return res.status(401).json({ error: "未登录或登录已过期" });
    const user = payload.user;
    const type = req.query && req.query.type;
    if (type !== "schedule" && type !== "push" && type !== "events" && type !== "items") return res.status(400).json({ error: "无效数据类型" });
    const dataKey = type + ":" + user.toLowerCase();
    if (req.method === "GET") {
      const val = await kv("GET", dataKey);
      return res.status(200).json({ data: val ? JSON.parse(val) : null });
    } else if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      await kv("SET", dataKey, JSON.stringify(body && body.data));
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    if (err.message === "KV_NOT_CONFIGURED") return res.status(500).json({ error: "后端存储未配置" });
    return res.status(500).json({ error: err.message });
  }
};