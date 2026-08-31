module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ error: 'TG_BOT_TOKEN未配置' });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { chatId, text } = body || {};
    if (!chatId || !text) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    const fetchFn = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
    const response = await fetchFn('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};