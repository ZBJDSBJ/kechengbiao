async function tgFetch(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) {
      return res.status(200).json({ ok: false, description: 'TG_BOT_TOKEN未配置' });
    }
    try {
      const response = await tgFetch('https://api.telegram.org/bot' + botToken + '/getMe');
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      const msg = err.name === 'AbortError' ? '请求超时(8s)' : err.message;
      return res.status(200).json({ ok: false, description: '无法连接Telegram API: ' + msg });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, description: 'Method not allowed' });
  }

  try {
    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) {
      return res.status(200).json({ ok: false, description: 'TG_BOT_TOKEN未配置' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const chatId = body.chatId;
    const text = body.text;

    if (!chatId) {
      return res.status(200).json({ ok: false, description: '缺少必要参数 chatId' });
    }
    if (!text) {
      return res.status(200).json({ ok: false, description: '缺少必要参数 text' });
    }

    const tgResponse = await tgFetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: String(chatId),
        text: String(text)
      })
    });

    const data = await tgResponse.json();

    if (!data.ok) {
      return res.status(200).json({
        ok: false,
        description: data.description || ('Telegram API错误 HTTP ' + tgResponse.status),
        error_code: data.error_code
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    const msg = err.name === 'AbortError' ? '请求超时(8s)' : err.message;
    return res.status(200).json({ ok: false, description: '服务器内部错误: ' + msg });
  }
};
