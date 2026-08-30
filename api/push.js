export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { appToken, content, summary, uids, url } = req.body;
    if (!appToken || !content || !uids) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    const response = await fetch('https://wxpusher.zjiecode.com/api/send/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appToken,
        content,
        summary: summary || content.slice(0, 20),
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
}