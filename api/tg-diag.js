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

module.exports = async (req, res) => {
  const diag = {
    timestamp: new Date().toISOString(),
    steps: []
  };

  const botToken = process.env.TG_BOT_TOKEN;
  diag.steps.push({
    step: "1. TG_BOT_TOKEN",
    status: botToken ? "SET (length=" + botToken.length + ")" : "NOT SET",
    ok: !!botToken
  });

  if (!botToken) {
    diag.steps.push({ step: "2. Bot验证", status: "跳过（无token）", ok: false });
    return res.status(200).json(diag);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch('https://api.telegram.org/bot' + botToken + '/getMe', {
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await response.json();
    diag.steps.push({
      step: "2. Bot验证(getMe)",
      status: data.ok ? "OK: @" + data.result.username + " (id:" + data.result.id + ")" : "FAILED: " + data.description,
      ok: data.ok
    });
  } catch (err) {
    diag.steps.push({
      step: "2. Bot验证(getMe)",
      status: "ERROR: " + (err.name === 'AbortError' ? '超时' : err.message),
      ok: false
    });
  }

  try {
    let cursor = "0";
    const allKeys = [];
    do {
      const result = await kv("SCAN", cursor, "MATCH", "push:*", "COUNT", "100");
      cursor = result[0];
      allKeys.push(...result[1]);
    } while (cursor !== "0");

    diag.steps.push({
      step: "3. 扫描KV推送配置",
      status: "找到 " + allKeys.length + " 个配置: " + JSON.stringify(allKeys),
      ok: true
    });

    for (const key of allKeys) {
      try {
        const val = await kv("GET", key);
        if (!val) {
          diag.steps.push({ step: "4. " + key, status: "值为空", ok: false });
          continue;
        }
        const cfg = JSON.parse(val);
        const tgInfo = cfg.tg ? {
          enabled: cfg.tg.enabled,
          key: cfg.tg.key ? String(cfg.tg.key).substring(0, 3) + "***" : "(空)",
          morningAuto: cfg.tg.morningAuto,
          eveningAuto: cfg.tg.eveningAuto,
          morningHour: cfg.tg.morningHour,
          eveningHour: cfg.tg.eveningHour
        } : null;
        diag.steps.push({
          step: "4. " + key,
          status: "tg: " + JSON.stringify(tgInfo),
          ok: cfg.tg && cfg.tg.enabled && cfg.tg.key
        });

        if (cfg.tg && cfg.tg.enabled && cfg.tg.key && botToken) {
          try {
            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 8000);
            const testRes = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: String(cfg.tg.key),
                text: "🔧 推送诊断测试 - 如果你收到这条消息，说明推送功能正常！"
              }),
              signal: controller2.signal
            });
            clearTimeout(timeout2);
            const testData = await testRes.json();
            diag.steps.push({
              step: "5. " + key + " 发送测试",
              status: testData.ok ? "发送成功!" : "失败: " + testData.description,
              ok: testData.ok
            });
          } catch (err) {
            diag.steps.push({
              step: "5. " + key + " 发送测试",
              status: "ERROR: " + (err.name === 'AbortError' ? '超时' : err.message),
              ok: false
            });
          }
        }
      } catch(err) {
        diag.steps.push({ step: "4. " + key, status: "解析错误: " + err.message, ok: false });
      }
    }
  } catch (err) {
    diag.steps.push({
      step: "3. 扫描KV推送配置",
      status: "ERROR: " + err.message,
      ok: false
    });
  }

  return res.status(200).json(diag);
};