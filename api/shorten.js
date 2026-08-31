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
    const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
    const response = await fetchFn('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url));
    const text = await response.text();
    if (text && text.startsWith('http')) {
      return res.status(200).json({ short: text.trim() });
    } else {
      return res.status(500).json({ error: text || '缩短失败' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
