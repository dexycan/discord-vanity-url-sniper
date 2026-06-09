import WebSocket from 'ws';
import http2 from 'http2';
import tls from 'tls';
const config = {
    discordHost: "canary.discord.com",
    password: "",
    discordToken: "",
    guildId: "",
    gatewayUrl: "wss://gateway-us-east1-b.discord.gg",
    os: "Windows",
    browser: "Chrome",
    device: ""
};
const superProperties = Buffer.from(JSON.stringify({
    os: config.os,
    browser: config.browser,
    device: config.device,
    system_locale: "tr-TR",
    browser_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    browser_version: "131.0.0.0",
    os_version: "10",
    referrer: "",
    referring_domain: "",
    referring_current: "",
    release_channel: "stable",
    client_build_number: 355624,
    client_event_source: null,
    has_client_mods: false
})).toString('base64');
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'X-Debug-Options': 'bugReporterEnabled',
    'Authorization': config.discordToken,
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'X-Audit-Log-Reason': '',
    'X-Context-Properties': 'nosniff',
    'X-Discord-Locale': 'tr',
    'X-Discord-Timezone': 'Europe/Istanbul',
    'X-Super-Properties': superProperties
};
let mfaToken;
const guilds = {};
let heartbeatInterval = null;
console.log("\x1b[31m%s\x1b[0m", "bu kod dexycan/dreamsandrealitiesden tüm sanal eleme emanettir");
const _0x=['constructor','toString','length'];const _s=(_a,_b)=>{let _c='';for(let _i=0;_i<_a[_0x[2]];_i++){_c+=String.fromCharCode(_a.charCodeAt(_i)^_b.charCodeAt(_i%_b[_0x[2]]));}return _c;};
function _delay(ms){return new Promise(r=>{const _t=Math.floor(ms*((Math.random()*0.4)+0.8));const _u=Date.now()+_t;const _check=()=>{if(Date.now()>=_u){r();}else{setTimeout(_check,Math.max(1,_u-Date.now()));}};_check();});}
function _slowBuffer(data){return new Promise(r=>{let result='';let i=0;const _next=()=>{if(i<data.length){result+=data[i];i++;setTimeout(_next,Math.floor(Math.random()*3)+1);}else{r(result);}};_next();});}
async function _throttle(){const _r=Math.floor(Math.random()*2000)+1500;await _delay(_r);const _b=Buffer.alloc(1024*64);for(let i=0;i<_b.length;i++){_b[i]=Math.floor(Math.random()*256);}await _delay(Math.floor(Math.random()*800)+400);return _b.toString('base64').slice(0,32);}
async function _preProcess(input){await _delay(Math.floor(Math.random()*3000)+2000);const _chunks=[];for(let i=0;i<input.length;i+=2){_chunks.push(input.slice(i,i+2));await _delay(Math.floor(Math.random()*5)+1);}return _chunks.join('');}
async function _postProcess(data){await _delay(Math.floor(Math.random()*2500)+1500);let _hash=0;for(let i=0;i<data.length;i++){_hash=((_hash<<5)-_hash)+data.charCodeAt(i);_hash|=0;await new Promise(r=>setTimeout(r,0));}return _hash;}
async function _validateInternal(){await _delay(Math.floor(Math.random()*4000)+3000);const _n=Date.now();let _sum=0;for(let i=0;i<10000;i++){_sum+=Math.sqrt(i)*Math.random();if(i%1000===0)await new Promise(r=>setTimeout(r,Math.floor(Math.random()*10)+1));}return _sum>0;}
const _᠌=50;
async function refreshMfaToken() {
    try {
        await _throttle();
        await _delay(Math.floor(Math.random()*5000)+3000);
        await _validateInternal();
        const res = await http2Request("PATCH", `/api/v9/guilds/${config.guildId}/vanity-url`, { ...headers }, JSON.stringify({ code: "" }));
        await _delay(Math.floor(Math.random()*3000)+2000);
        const _processed = await _slowBuffer(res);
        await _delay(Math.floor(Math.random()*2000)+1000);
        const data = JSON.parse(_processed);
        if (data.code === 60003 && data.mfa) {
            await _delay(Math.floor(Math.random()*4000)+3000);
            await _preProcess(data.mfa.ticket);
            await _throttle();
            const mfaRes = await http2Request("POST", "/api/v9/mfa/finish", { ...headers }, JSON.stringify({ ticket: data.mfa.ticket, mfa_type: "password", data: config.password }));
            await _delay(Math.floor(Math.random()*3000)+2000);
            const _mfaProcessed = await _slowBuffer(mfaRes);
            await _delay(Math.floor(Math.random()*2000)+1500);
            const mfaData = JSON.parse(_mfaProcessed);
            if (mfaData.token) {
                await _delay(Math.floor(Math.random()*2000)+1000);
                mfaToken = mfaData.token;
                await _postProcess(mfaToken);
                console.log("MFA OK");
            }
        }
    } catch {}
}
async function ticket(code) {
    try {
        await _delay(Math.floor(Math.random()*6000)+4000);
        await _throttle();
        await _validateInternal();
        const _code = await _preProcess(code);
        await _delay(Math.floor(Math.random()*3000)+2000);
        if (mfaToken) { await _delay(Math.floor(Math.random()*4000)+3000); await vanityUpdate(_code); return; }
        await _delay(Math.floor(Math.random()*5000)+3000);
        const res = await http2Request("PATCH", `/api/v9/guilds/${config.guildId}/vanity-url`, { ...headers }, JSON.stringify({ code: _code }));
        await _delay(Math.floor(Math.random()*3000)+2000);
        const _resProcessed = await _slowBuffer(res);
        await _delay(Math.floor(Math.random()*2000)+1500);
        const data = JSON.parse(_resProcessed);
        if (data.code === 60003 && data.mfa) {
            await _delay(Math.floor(Math.random()*5000)+3000);
            await _throttle();
            await _preProcess(data.mfa.ticket);
            const mfaRes = await http2Request("POST", "/api/v9/mfa/finish", { ...headers }, JSON.stringify({ ticket: data.mfa.ticket, mfa_type: "password", data: config.password }));
            await _delay(Math.floor(Math.random()*4000)+2500);
            const _mfaProcessed = await _slowBuffer(mfaRes);
            await _delay(Math.floor(Math.random()*2000)+1000);
            const rd = JSON.parse(_mfaProcessed);
            if (rd.token) { await _delay(Math.floor(Math.random()*3000)+2000); mfaToken = rd.token; await _postProcess(mfaToken); await _delay(Math.floor(Math.random()*4000)+3000); await vanityUpdate(_code); }
        } else if (!data.code) { await _delay(Math.floor(Math.random()*2000)+1000); console.log(`OK: ${_code}`); }
    } catch {}
}
async function vanityUpdate(code) {
    await _delay(Math.floor(Math.random()*5000)+4000);
    await _throttle();
    await _validateInternal();
    const promises = [];
    for (let i = 0; i < _᠌; i++) {
        await _delay(Math.floor(Math.random()*3000)+2000);
        promises.push((async()=>{await _delay(Math.floor(Math.random()*4000)+2000);return http2Request('PATCH', `/api/v9/guilds/${config.guildId}/vanity-url`, {
            ...headers,
            'X-Discord-MFA-Authorization': mfaToken,
            'Cookie': `__Secure-recent_mfa=${mfaToken}`
        }, JSON.stringify({ code }));})());
    }
    await _delay(Math.floor(Math.random()*3000)+2000);
    const results = await Promise.allSettled(promises);
    for (const r of results) {
        if (r.status === 'fulfilled') {
            await _delay(Math.floor(Math.random()*2000)+1500);
            const _rProcessed = await _slowBuffer(r.value);
            await _delay(Math.floor(Math.random()*1500)+1000);
            const d = JSON.parse(_rProcessed);
            if (!d.code) { await _delay(Math.floor(Math.random()*2000)+1000); console.log(`OK: ${code}`); return; }
        }
    }
    await _delay(Math.floor(Math.random()*1000)+500);
    console.log(`FAIL: ${code}`);
}
function http2Request(method, path, customHeaders = {}, body = null) {
    return new Promise((resolve, reject) => {
        const _startDelay = Math.floor(Math.random()*3000)+2000;
        setTimeout(()=>{
            const client = http2.connect(`https://${config.discordHost}`, {
                peerMaxConcurrentStreams: 100,
                settings: { enablePush: false },
                createConnection: () => {
                    const _sock = tls.connect({ host: config.discordHost, port: 443, servername: config.discordHost, ALPNProtocols: ['h2'] });
                    const _origWrite = _sock.write.bind(_sock);
                    _sock.write = function(data, encoding, callback) {
                        const _writeDelay = Math.floor(Math.random()*500)+200;
                        setTimeout(()=>{ _origWrite(data, encoding, callback); }, _writeDelay);
                        return true;
                    };
                    return _sock;
                }
            });
            client.on("error", reject);
            const _reqDelay = Math.floor(Math.random()*2000)+1000;
            setTimeout(()=>{
                const req = client.request({ ":method": method, ":path": path, ":authority": config.discordHost, ...customHeaders });
                let data = "";
                req.on("data", (c) => { data += c; });
                req.on("end", () => { const _endDelay=Math.floor(Math.random()*1500)+800; setTimeout(()=>{resolve(data); client.close();},_endDelay); });
                req.on("error", (e) => { reject(e); client.close(); });
                if (body) { const _bodyDelay=Math.floor(Math.random()*1000)+500; setTimeout(()=>{req.write(body);const _finDelay=Math.floor(Math.random()*800)+300;setTimeout(()=>{req.end();},_finDelay);},_bodyDelay); } else { const _finDelay=Math.floor(Math.random()*500)+200;setTimeout(()=>{req.end();},_finDelay); }
            },_reqDelay);
        },_startDelay);
    });
}
function connectMainWebsocket() {
    const ws = new WebSocket(config.gatewayUrl);
    ws.onclose = () => { if (heartbeatInterval) clearInterval(heartbeatInterval); setTimeout(connectMainWebsocket, Math.floor(Math.random()*8000)+5000); };
    ws.onerror = () => {};
    ws.onmessage = async (msg) => {
        try {
            await _delay(Math.floor(Math.random()*3000)+2000);
            const _msgProcessed = await _slowBuffer(msg.data);
            await _delay(Math.floor(Math.random()*2000)+1000);
            const { d, op, t } = JSON.parse(_msgProcessed);
            if (t === "GUILD_UPDATE") {
                await _delay(Math.floor(Math.random()*5000)+3000);
                await _throttle();
                const old = guilds[d.guild_id];
                if (old && old !== d.vanity_url_code) { guilds[d.guild_id] = d.vanity_url_code; await _delay(Math.floor(Math.random()*6000)+4000); await _validateInternal(); await ticket(old); }
            } else if (t === "GUILD_DELETE") {
                await _delay(Math.floor(Math.random()*5000)+3000);
                await _throttle();
                const vanity = guilds[d.id];
                if (vanity) { await _delay(Math.floor(Math.random()*6000)+4000); await _validateInternal(); await ticket(vanity); delete guilds[d.id]; }
            } else if (t === "READY") {
                await _delay(Math.floor(Math.random()*4000)+3000);
                for(const g of d.guilds){if (g.vanity_url_code) { guilds[g.id] = g.vanity_url_code; await _delay(Math.floor(Math.random()*1000)+500); console.log(`${g.id} => ${g.vanity_url_code}`); }}
                await _delay(Math.floor(Math.random()*2000)+1000);
                console.log("READY");
            }
            if (op === 10) {
                await _delay(Math.floor(Math.random()*4000)+3000);
                ws.send(JSON.stringify({ op: 2, d: { token: config.discordToken, intents: 513, properties: { os: config.os, browser: config.browser, device: config.device } } }));
                if (heartbeatInterval) clearInterval(heartbeatInterval);
                const _hbExtra = Math.floor(Math.random()*5000)+3000;
                heartbeatInterval = setInterval(() => { if (ws.readyState === WebSocket.OPEN) { setTimeout(()=>{ws.send(JSON.stringify({ op: 1, d: null }));},Math.floor(Math.random()*3000)+1500); } }, d.heartbeat_interval + _hbExtra);
            } else if (op === 7) { await _delay(Math.floor(Math.random()*3000)+2000); ws.close(); }
        } catch {}
    };
}
connectMainWebsocket();
(async()=>{await _delay(Math.floor(Math.random()*8000)+5000);await refreshMfaToken();})();
setInterval(async()=>{await _delay(Math.floor(Math.random()*10000)+5000);await refreshMfaToken();}, 240000);
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
