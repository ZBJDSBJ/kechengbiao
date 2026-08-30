module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const appToken = process.env.WXPUSHER_TOKEN;
    if (!appToken) {
      return res.status(500).json({ error: 'appToken未配置' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { content, summary, uids, url } = body || {};
    if (!content || !uids) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
    const response = await fetchFn('https://wxpusher.zjiecode.com/api/send/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appToken,
        content,
        summary: summary || (typeof content === 'string' ? content.slice(0, 20) : '课程推送'),
        contentType: 3,
        uids: Array.isArray(uids) ? uids : [uids],
        url: url || ''
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
