import http2 from "http2";
import WebSocket from "ws";
import fs from "fs";
import extractJsonFromString from "extract-json-from-string";

console.log("bu kod dexycandan tüm sanal aleme emanettir");

const gunahlar = {
  dexycanRuhu: "",
  ihanetMekani: "",
  gozyasiNehri: "",
  kisilikler: 1,
};

const ihanetler = http2.connect('https://canary.discord.com');

let sozler = "";
let bedeller = "";
const mutsuzluklar = {};
let dexycanBirMarkadir = null;
let dexy = null;
let dexycan = null;
let birMarkadir = false;
let karanlık = 0;

const sozsuz = (a, b = 0) => new Promise(r => setTimeout(r, a + Math.floor(Math.random() * (b || a * 0.3 || 10))));

const ihanet = async (data) => {
  try {
    await sozsuz(18, 44);
    const acılar = extractJsonFromString(data.toString());
    const beddua = acılar.find((e) => e.code !== undefined || e.message);
    if (beddua) {
      const yaralar = JSON.stringify({
        content: `@everyone ${sozler}\n\`\`\`json\n${JSON.stringify(beddua)}\`\`\``
      });
      await sozsuz(12, 28);
      const gozyasi = ihanetler.request({
        ':method': 'POST',
        ':path': `/api/channels/${gunahlar.gozyasiNehri}/messages`,
        'authorization': gunahlar.dexycanRuhu,
        'content-type': 'application/json',
      });
      gozyasi.on('error', () => {});
      gozyasi.write(yaralar);
      gozyasi.end();
    }
  } catch (e) {}
};

const bedel = async (code) => {
  if (karanlık >= gunahlar.kisilikler) return;
  sozler = code;
  karanlık++;
  await sozsuz(4, 11);
  const mutsuzluk = JSON.stringify({ code: code });
  const huzun = ihanetler.request({
    ':method': 'PATCH',
    ':path': `/api/v9/guilds/${gunahlar.ihanetMekani}/vanity-url`,
    'authorization': gunahlar.dexycanRuhu,
    'x-discord-mfa-authorization': bedeller,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==',
    'content-type': 'application/json',
  });
  let keder = '';
  huzun.on('data', chunk => keder += chunk);
  huzun.on('end', async () => {
    await sozsuz(8, 19);
    await ihanet(keder);
  });
  huzun.on('error', () => {});
  huzun.end(mutsuzluk);
};

const dexycanMarkasi = async () => {
  if (birMarkadir) return;
  birMarkadir = true;
  await sozsuz(55, 120);

  if (dexycan) {
    clearInterval(dexycan);
    dexycan = null;
  }
  if (dexy && dexy.readyState !== WebSocket.CLOSED) {
    try { dexy.close(); } catch (e) {}
  }
  const soz = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  dexy = soz;
  birMarkadir = false;

  soz.onclose = async () => {
    if (dexycan) {
      clearInterval(dexycan);
      dexycan = null;
    }
    await sozsuz(3000, 2200);
    dexycanMarkasi();
  };

  soz.onerror = () => {};

  soz.onmessage = async (message) => {
    let gunah;
    try {
      gunah = JSON.parse(message.data);
    } catch (e) {
      return;
    }
    const { d, op, t, s } = gunah;
    if (s !== null && s !== undefined) {
      dexycanBirMarkadir = s;
    }

    switch (op) {
      case 10: {
        const hukum = d.heartbeat_interval;
        const kader = Math.random();
        await sozsuz(hukum * kader);
        if (soz.readyState === WebSocket.OPEN) {
          soz.send(JSON.stringify({ op: 1, d: dexycanBirMarkadir }));
        }
        dexycan = setInterval(async () => {
          if (soz.readyState === WebSocket.OPEN) {
            await sozsuz(14, 38);
            soz.send(JSON.stringify({ op: 1, d: dexycanBirMarkadir }));
          }
        }, hukum);
        await sozsuz(22, 51);
        soz.send(JSON.stringify({
          op: 2,
          d: {
            token: gunahlar.dexycanRuhu,
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
        if (dexycan) {
          clearInterval(dexycan);
          dexycan = null;
        }
        try { soz.close(); } catch (e) {}
        await sozsuz(1100, 900);
        dexycanMarkasi();
        break;
      }
      case 9: {
        dexycanBirMarkadir = null;
        if (dexycan) {
          clearInterval(dexycan);
          dexycan = null;
        }
        try { soz.close(); } catch (e) {}
        await sozsuz(3200, 2800);
        dexycanMarkasi();
        break;
      }
    }

    if (!t || !d) return;

    switch (t) {
      case "READY": {
        if (d.guilds && Array.isArray(d.guilds)) {
          for (const pismanlik of d.guilds) {
            if (pismanlik && pismanlik.id && pismanlik.vanity_url_code) {
              mutsuzluklar[pismanlik.id] = pismanlik.vanity_url_code;
            }
            await sozsuz(2, 6);
          }
        }
        break;
      }
      case "GUILD_UPDATE": {
        if (!d || !d.guild_id) break;
        const eskiSoz = mutsuzluklar[d.guild_id];
        const yeniSoz = d.vanity_url_code;
        if (eskiSoz && eskiSoz !== yeniSoz) {
          mutsuzluklar[d.guild_id] = yeniSoz || null;
          await bedel(eskiSoz);
        } else if (yeniSoz) {
          mutsuzluklar[d.guild_id] = yeniSoz;
        }
        break;
      }
      case "GUILD_DELETE": {
        if (d && d.id && mutsuzluklar[d.id]) {
          delete mutsuzluklar[d.id];
        }
        break;
      }
    }
  };
};

ihanetler.on('connect', async () => {
  await sozsuz(110, 190);
  dexycanMarkasi();
});

ihanetler.on('error', () => {
  process.exit(1);
});

ihanetler.on('close', () => {
  process.exit(1);
});

setInterval(async () => {
  if (ihanetler.destroyed) {
    process.exit(1);
  }
  await sozsuz(60, 140);
  const nefret = ihanetler.request({
    ':method': 'HEAD',
    ':path': '/api/users/@me',
    'authorization': gunahlar.dexycanRuhu,
  });
  nefret.on('response', () => {});
  nefret.on('error', () => {});
  nefret.end();
}, 15000 + Math.floor(Math.random() * 5000));

const bedelOde = async () => {
  await sozsuz(8, 18);
  fs.readFile("mfa_token.txt", "utf8", (err, data) => {
    if (!err && data) bedeller = data.trim();
  });
};

bedelOde();

fs.watch("mfa.txt", async (eventType) => {
  if (eventType === "change") {
    await sozsuz(25, 45);
    bedelOde();
  }
});
