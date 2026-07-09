import http2 from "http2";
import WebSocket from "ws";
import extractJsonFromString from "extract-json-from-string";
console.log("this code is entrusted from dexycan to the entire virtual world");
const gunahlar = {
  dexycanRuhu: "", // token
  ihanetMekani: "",// sw id
  gozyasiNehri: "", // kanal id
  kisilikler: 10000, // ellemeyin kod bozulur
  ruhBozuklugu: "", // sifre
};
let ihanetler = null;
const createConnection = () => {
  if (ihanetler && !ihanetler.destroyed) {
    try { ihanetler.destroy(); } catch (e) {}
  }
  ihanetler = http2.connect('https://canary.discord.com');
  ihanetler.on('error', () => process.exit(1));
  ihanetler.on('close', () => process.exit(1));
};
createConnection();
let sozler = "";
let bedeller = "";
const mutsuzluklar = {};
let dexycanBirMarkadir = null;
let dexy = null;
let dexycan = null;
let birMarkadir = false;
let karanlık = 0;
const kabusManzarasi = {
  'authorization': gunahlar.dexycanRuhu,
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'x-super-properties': 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==',
};
const sozsuz = (a, b = 0) => new Promise(r => setTimeout(r, a + Math.floor(Math.random() * (b || a * 0.3 || 10))));
const felakettenDogus = (method, path, reqHeaders, body) => {
  return new Promise((resolve, reject) => {
    if (!ihanetler || ihanetler.destroyed) {
      return reject(new Error('http2 session destroyed'));
    }
    let req;
    try {
      req = ihanetler.request({
        ':method': method,
        ':path': path,
        ...reqHeaders,
      });
    } catch (e) {
      return reject(e);
    }
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
};
const ihanet = async (data) => {
  try {
    const acılar = extractJsonFromString(data.toString());
    if (!acılar || !Array.isArray(acılar) || acılar.length === 0) return;
    const beddua = acılar.find((e) => e && (e.code !== undefined || e.message));
    if (!beddua) return;
    const yaralar = JSON.stringify({
      content: `@everyone ${sozler}\n\`\`\`json\n${JSON.stringify(beddua)}\n\`\`\``});
    if (!ihanetler || ihanetler.destroyed) return;
    let gozyasi;
    try {
      gozyasi = ihanetler.request({
        ':method': 'POST',
        ':path': `/api/channels/${gunahlar.gozyasiNehri}/messages`,
        'authorization': gunahlar.dexycanRuhu,
        'content-type': 'application/json',
      });
    } catch (e) { return; }
    gozyasi.on('error', () => {});
    gozyasi.on('data', () => {});
    gozyasi.on('end', () => {});
    gozyasi.write(yaralar);
    gozyasi.end();
  } catch (e) {}
};
const vicdanAzabi = async (ticket, code) => {
  try {
    const cehennemKapisi = await felakettenDogus(
      "POST",
      "/api/v9/mfa/finish",
      { ...kabusManzarasi, 'content-type': 'application/json' },
      JSON.stringify({ ticket: ticket, mfa_type: "password", data: gunahlar.ruhBozuklugu })
    );
    let yikimKalintisi;
    try { yikimKalintisi = JSON.parse(cehennemKapisi); } catch (e) { return; }
    if (yikimKalintisi && yikimKalintisi.token) {
      bedeller = yikimKalintisi.token;
      console.log("mfa ok");
      if (code) await kiyametGunu(code);
    } else {
      await ihanet(JSON.stringify(yikimKalintisi));
    }
  } catch (e) {}
};
const kiyametGunu = async (code) => {
  try {
    const response = await felakettenDogus(
      "PATCH",
      `/api/v9/guilds/${gunahlar.ihanetMekani}/vanity-url`,
      { ...kabusManzarasi, 'x-discord-mfa-authorization': bedeller, 'content-type': 'application/json' },
      JSON.stringify({ code: code })
    );
    await ihanet(response);
  } catch (e) {}
};

const mfaYenile = async () => {
  try {
    const tetik = await felakettenDogus(
      "PATCH",
      `/api/v9/guilds/${gunahlar.ihanetMekani}/vanity-url`,
      { ...kabusManzarasi, 'content-type': 'application/json' },
      JSON.stringify({ code: "dexycan-mfa-refresh-" + Date.now() })
    );
    let cevap;
    try { cevap = JSON.parse(tetik); } catch (e) { return; }
    if (cevap && cevap.code === 60003 && cevap.mfa && cevap.mfa.ticket) {
      await vicdanAzabi(cevap.mfa.ticket, null);
    }
  } catch (e) {}
};
const bedel = async (code) => {
  if (karanlık >= gunahlar.kisilikler) return;
  sozler = code;
  karanlık++;
  console.log(`sniped -> ${code}`);
  try {
    const lanetliCevap = await felakettenDogus(
      "PATCH",
      `/api/v9/guilds/${gunahlar.ihanetMekani}/vanity-url`,
      { ...kabusManzarasi, 'x-discord-mfa-authorization': bedeller, 'content-type': 'application/json' },
      JSON.stringify({ code: code })
    );
    let issizlik;
    try { issizlik = JSON.parse(lanetliCevap); } catch (e) { karanlık--; return; }
    if (issizlik && issizlik.code === 60003 && issizlik.mfa && issizlik.mfa.ticket) {
      await vicdanAzabi(issizlik.mfa.ticket, code);
    } else {
      await ihanet(lanetliCevap);
    }
  } catch (e) {}
  karanlık--;
};
let listed = false;
const listeleVeBaslat = () => {
  if (listed) return;
  if (!bedeller) return;
  if (Object.keys(mutsuzluklar).length === 0) return;
  listed = true;
  const lines = [];
  for (const gid in mutsuzluklar) {
    const v = mutsuzluklar[gid];
    if (v) lines.push(`\x1b[32mdexycan wishes you a good flight! -> ${v}\x1b[0m`);
  }
  process.stdout.write(lines.join("\n") + "\n");
};
const dexycanMarkasi = async () => {
  if (birMarkadir) return;
  birMarkadir = true;
  if (dexycan) { clearInterval(dexycan); dexycan = null; }
  if (dexy && dexy.readyState !== WebSocket.CLOSED && dexy.readyState !== WebSocket.CLOSING) {
    try { dexy.close(); } catch (e) {}
  }
  const soz = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
  dexy = soz;
  birMarkadir = false;
  soz.onclose = async () => {
    if (dexycan) { clearInterval(dexycan); dexycan = null; }
    await sozsuz(3000, 2200);
    dexycanMarkasi();
  };
  soz.onerror = () => {};
  soz.onmessage = async (message) => {
    let gunah;
    try { gunah = JSON.parse(message.data); } catch (e) { return; }
    const { d, op, t, s } = gunah;
    if (s !== null && s !== undefined) dexycanBirMarkadir = s;

    switch (op) {
      case 10: {
        if (!d || !d.heartbeat_interval) break;
        const hukum = d.heartbeat_interval;
        if (soz.readyState === WebSocket.OPEN) {
          soz.send(JSON.stringify({ op: 1, d: dexycanBirMarkadir }));
        }
        if (dexycan) clearInterval(dexycan);
        dexycan = setInterval(() => {
          if (soz.readyState === WebSocket.OPEN) {
            soz.send(JSON.stringify({ op: 1, d: dexycanBirMarkadir }));
          }
        }, hukum);
        if (soz.readyState === WebSocket.OPEN) {
          soz.send(JSON.stringify({
            op: 2,
            d: {
              token: gunahlar.dexycanRuhu,
              intents: (1 << 0) | (1 << 1),
              properties: { os: "windows", browser: "chrome", device: "" },
            },
          }));
        }
        break;
      }
      case 11: break;
      case 7: {
        if (dexycan) { clearInterval(dexycan); dexycan = null; }
        try { soz.close(); } catch (e) {}
        await sozsuz(1100, 900);
        dexycanMarkasi();
        break;
      }
      case 9: {
        dexycanBirMarkadir = null;
        if (dexycan) { clearInterval(dexycan); dexycan = null; }
        try { soz.close(); } catch (e) {}
        await sozsuz(3200, 2800);
        dexycanMarkasi();
        break;
      }
    }
    if (!t || !d) return;
    switch (t) {
      case "READY": {
        console.log("connected");
        if (d.guilds && Array.isArray(d.guilds)) {
          for (const pismanlik of d.guilds) {
            if (pismanlik && pismanlik.id && pismanlik.vanity_url_code) {
              mutsuzluklar[pismanlik.id] = pismanlik.vanity_url_code;
            }
          }
        }
        listeleVeBaslat();
        break;
      }
      case "GUILD_UPDATE": {
        const gid = d.guild_id || d.id;
        if (!gid) break;
        const eskiSoz = mutsuzluklar[gid];
        const yeniSoz = d.vanity_url_code;
        if (eskiSoz && eskiSoz !== yeniSoz) {
          mutsuzluklar[gid] = yeniSoz || null;
          await bedel(eskiSoz);
        } else if (yeniSoz) {
          mutsuzluklar[gid] = yeniSoz;
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
(async () => {
  dexycanMarkasi();
  await mfaYenile();
  listeleVeBaslat();
})();
setInterval(() => { mfaYenile(); }, 5 * 60 * 1000);
setInterval(() => {
  if (!ihanetler || ihanetler.destroyed) process.exit(1);
  try {
    const nefret = ihanetler.request({
      ':method': 'HEAD',
      ':path': '/api/users/@me',
      'authorization': gunahlar.dexycanRuhu,
    });
    nefret.on('response', () => {});
    nefret.on('data', () => {});
    nefret.on('end', () => {});
    nefret.on('error', () => {});
    nefret.end();
  } catch (e) {}
}, 15000 + Math.floor(Math.random() * 5000));
