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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url } = body;
    if (!url) {
      return res.status(400).json({ error: '缺少url参数' });
    }
    const id = crypto.randomBytes(4).toString('base64url');
    await kv('SET', 'short:' + id, url);
    await kv('EXPIRE', 'short:' + id, 86400 * 90);
    const host = req.headers.host || 'jinhui-curriculum.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const shortUrl = proto + '://' + host + '/api/s?id=' + id;
    return res.status(200).json({ short: shortUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
