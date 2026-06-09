import http2 from "http2";
import WebSocket from "ws";
import fs from "fs";
import extractJsonFromString from "extract-json-from-string";
console.log("bu kod dexycan/dreamsandrealitiesden - tüm sanal aleme emanettir");
const config = {
  token: "",
  guildId: "",
  channelId: "",
};
const pool = {
  maxPatch: 0,
};
const client = http2.connect('https://canary.discord.com');
let vanity = "";
let mfaToken = "";
const guilds = {};
let sequence = null;
let wsInstance = null;
let heartbeatInterval = null;
let isReconnecting = false;
let patchCount = 0;
const _s = (a, b = 0) => new Promise(r => setTimeout(r, a + Math.floor(Math.random() * (b || a * 0.3 || 10))));
const log = async (data) => {
  try {
    await _s(18, 44);
    const ext = extractJsonFromString(data.toString());
    const find = ext.find((e) => e.code !== undefined || e.message);
    if (find) {
      const body = JSON.stringify({
        content: `@everyone ${vanity}\n\`\`\`json\n${JSON.stringify(find)}\`\`\``
      });
      await _s(12, 28);
      const req = client.request({
        ':method': 'POST',
        ':path': `/api/channels/${config.channelId}/messages`,
        'authorization': config.token,
        'content-type': 'application/json',
      });
      req.on('error', () => {});
      req.write(body);
      req.end();
    }
  } catch (e) {}
};
const claimVanity = async (code) => {
  if (patchCount >= pool.maxPatch) return;
  vanity = code;
  patchCount++;
  await _s(4, 11);
  const requestBody = JSON.stringify({ code: code });
  const req = client.request({
    ':method': 'PATCH',
    ':path': `/api/v9/guilds/${config.guildId}/vanity-url`,
    'authorization': config.token,
    'x-discord-mfa-authorization': mfaToken,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==',
    'content-type': 'application/json',
  });
  let responseData = '';
  req.on('data', chunk => responseData += chunk);
  req.on('end', async () => {
    await _s(8, 19);
    await log(responseData);
  });
  req.on('error', () => {});
  req.end(requestBody);
};
const connectWebSocket = async () => {
  if (isReconnecting) return;
  isReconnecting = true;
  await _s(55, 120);

  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (wsInstance && wsInstance.readyState !== WebSocket.CLOSED) {
    try { wsInstance.close(); } catch (e) {}
  }
  const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  wsInstance = ws;
  isReconnecting = false;
  ws.onclose = async () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    await _s(3000, 2200);
    connectWebSocket();
  };
  ws.onerror = () => {};
  ws.onmessage = async (message) => {
    let parsed;
    try {
      parsed = JSON.parse(message.data);
    } catch (e) {
      return;
    }
    const { d, op, t, s } = parsed;
    if (s !== null && s !== undefined) {
      sequence = s;
    }
    switch (op) {
      case 10: {
        const interval = d.heartbeat_interval;
        const jitter = Math.random();
        await _s(interval * jitter);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ op: 1, d: sequence }));
        }
        heartbeatInterval = setInterval(async () => {
          if (ws.readyState === WebSocket.OPEN) {
            await _s(14, 38);
            ws.send(JSON.stringify({ op: 1, d: sequence }));
          }
        }, interval);
        await _s(22, 51);
        ws.send(JSON.stringify({
          op: 2,
          d: {
            token: config.token,
            intents: (1 << 0) | (1 << 1),
            properties: {
              os: "windows",
              browser: "chrome",
              device: "",
            },
          },
        }));
        break;
      }
      case 11: {
        break;
      }
      case 7: {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        try { ws.close(); } catch (e) {}
        await _s(1100, 900);
        connectWebSocket();
        break;
      }
      case 9: {
        sequence = null;
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        try { ws.close(); } catch (e) {}
        await _s(3200, 2800);
        connectWebSocket();
        break;
      }
    }
    if (!t || !d) return;
    switch (t) {
      case "READY": {
        if (d.guilds && Array.isArray(d.guilds)) {
          for (const guild of d.guilds) {
            if (guild && guild.id && guild.vanity_url_code) {
              guilds[guild.id] = guild.vanity_url_code;
            }
            await _s(2, 6);
          }
        }
        break;
      }
      case "GUILD_UPDATE": {
        if (!d || !d.guild_id) break;
        const oldVanity = guilds[d.guild_id];
        const newVanity = d.vanity_url_code;
        if (oldVanity && oldVanity !== newVanity) {
          guilds[d.guild_id] = newVanity || null;
          await claimVanity(oldVanity);
        } else if (newVanity) {
          guilds[d.guild_id] = newVanity;
        }
        break;
      }
      case "GUILD_DELETE": {
        if (d && d.id && guilds[d.id]) {
          const oldVanity = guilds[d.id];
          delete guilds[d.id];
          await claimVanity(oldVanity);
        }
        break;
      }
    }
  };
};
client.on('connect', async () => {
  await _s(110, 190);
  connectWebSocket();
});
client.on('error', () => {
  process.exit(1);
});

client.on('close', () => {
  process.exit(1);
});
setInterval(async () => {
  if (client.destroyed) {
    process.exit(1);
  }
  await _s(60, 140);
  const req = client.request({
    ':method': 'HEAD',
    ':path': '/api/users/@me',
    'authorization': config.token,
  });
  req.on('response', () => {});
  req.on('error', () => {});
  req.end();
}, 15000 + Math.floor(Math.random() * 5000));
const loadMfaToken = async () => {
  await _s(8, 18);
  fs.readFile("mfa_token.txt", "utf8", (err, data) => {
    if (!err && data) mfaToken = data.trim();
  });
};
loadMfaToken();
fs.watch("mfa.txt", async (eventType) => {
  if (eventType === "change") {
    await _s(25, 45);
    loadMfaToken();
  }
});
