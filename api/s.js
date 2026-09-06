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
  var id = null;
  if (req.query && req.query.id) {
    id = req.query.id;
  } else if (req.url) {
    var qs = req.url.split('?')[1];
    if (qs) {
      var params = new URLSearchParams(qs);
      id = params.get('id');
    }
  }
  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: '缺少id参数' }));
    return;
  }
  try {
    var longUrl = await kv('GET', 'short:' + id);
    if (!longUrl) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>链接已过期</title></head><body style="text-align:center;padding:60px;font-family:sans-serif"><h2>😕 链接已过期或不存在</h2><p>请重新生成分享链接</p><p style="margin-top:20px"><a href="https://jinhui-curriculum.vercel.app" style="color:#6366F1">返回课程表</a></p></body></html>');
      return;
    }
    res.statusCode = 302;
    res.setHeader('Location', longUrl);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};
