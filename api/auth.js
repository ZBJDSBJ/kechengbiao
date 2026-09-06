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

function b64url(s) { return Buffer.from(s).toString("base64url"); }
function signJWT(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_NOT_CONFIGURED");
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const b = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(h + "." + b).digest("base64url");
  return h + "." + b + "." + sig;
}
function hashPassword(p) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(p, salt, 64);
  return salt.toString("hex") + ":" + hash.toString("hex");
}
function verifyPassword(p, stored) {
  const idx = stored.indexOf(":");
  if (idx < 0) return false;
  const sh = stored.slice(0, idx), hh = stored.slice(idx + 1);
  try {
    const hash = Buffer.from(hh, "hex");
    const v = crypto.scryptSync(p, Buffer.from(sh, "hex"), 64);
    return hash.length === v.length && crypto.timingSafeEqual(hash, v);
  } catch { return false; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { action, user, pass } = body || {};
    if (!user || !pass) return res.status(400).json({ error: "请输入用户名和密码" });
    if (!/^[A-Za-z0-9_]{2,20}$/.test(user)) return res.status(400).json({ error: "用户名需为2-20位字母数字下划线" });
    const userKey = "user:" + user.toLowerCase();
    const now = Math.floor(Date.now() / 1000);
    if (action === "register") {
      const exist = await kv("GET", userKey);
      if (exist) return res.status(409).json({ error: "用户名已存在" });
      await kv("SET", userKey, hashPassword(pass));
      return res.status(200).json({ token: signJWT({ user, iat: now, exp: now + 30 * 86400 }), user });
    } else if (action === "login") {
      const stored = await kv("GET", userKey);
      if (!stored || !verifyPassword(pass, stored)) return res.status(401).json({ error: "用户名或密码错误" });
      return res.status(200).json({ token: signJWT({ user, iat: now, exp: now + 30 * 86400 }), user });
    }
    return res.status(400).json({ error: "未知操作" });
  } catch (err) {
    if (err.message === "KV_NOT_CONFIGURED") return res.status(500).json({ error: "后端存储未配置，请联系管理员配置 Vercel KV" });
    if (err.message === "JWT_NOT_CONFIGURED") return res.status(500).json({ error: "后端认证未配置，请联系管理员配置 JWT_SECRET" });
    return res.status(500).json({ error: err.message });
  }
};