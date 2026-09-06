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

function getClientIP(req) {
  const headers = req.headers || {};
  return headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
         headers["x-real-ip"] ||
         headers["cf-connecting-ip"] ||
         req.socket?.remoteAddress?.replace("::ffff:", "") ||
         "unknown";
}

module.exports = async (req, res) => {
  try {
    const ip = getClientIP(req);
    const ua = (req.headers && (req.headers["user-agent"] || "")) || "";
    const referer = (req.headers && (req.headers["referer"] || "")) || "";
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);

    const record = {
      ip: ip,
      ua: ua.substring(0, 200),
      time: now.toISOString(),
      referer: referer.substring(0, 200)
    };

    const kvKey = "visits:" + dateKey;
    let visits = [];
    try {
      const existing = await kv("GET", kvKey);
      if (existing) visits = JSON.parse(existing);
    } catch(e) {}

    visits.push(record);
    if (visits.length > 2000) visits = visits.slice(-2000);

    await kv("SET", kvKey, JSON.stringify(visits));

    try {
      let ipList = [];
      const existingList = await kv("GET", "visits:ip_list");
      if (existingList) ipList = JSON.parse(existingList);
      if (!ipList.includes(ip)) {
        ipList.push(ip);
        if (ipList.length > 500) ipList = ipList.slice(-500);
        await kv("SET", "visits:ip_list", JSON.stringify(ipList));
      }
    } catch(e) {}

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message });
  }
};