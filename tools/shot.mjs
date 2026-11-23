// Usage: node tools/shot.mjs <url> <cssSelector> <width> <height> <out.png>
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const [url, sel, w, h, out, click, scrollFirst] = process.argv.slice(2);
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const proc=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9336',`--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(),'sh-'))}`,'about:blank']);
let u; for(let i=0;i<50&&!u;i++){await sleep(200);try{u=(await (await fetch('http://127.0.0.1:9336/json')).json()).find(t=>t.type==='page')?.webSocketDebuggerUrl}catch{}}
const ws=new WebSocket(u); await new Promise(r=>ws.addEventListener('open',r)); let id=0; const pend=new Map();
ws.addEventListener('message',m=>{const x=JSON.parse(m.data); if(x.id&&pend.has(x.id)){pend.get(x.id)(x);pend.delete(x.id)}});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride',{width:+w,height:+h,deviceScaleFactor:1,mobile:+w<600});
await send('Page.navigate',{url}); await sleep(3000);
await send('Runtime.evaluate',{expression:`document.documentElement.style.scrollBehavior="auto"; window.scrollTo(0, document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect().top + window.scrollY - 100)`}); await sleep(2500);
if (scrollFirst) { await send("Runtime.evaluate",{expression:`window.scrollTo(0, ${+scrollFirst})`}); await sleep(800); }
if (click) { await send("Runtime.evaluate",{expression:`document.querySelector(${JSON.stringify(click)}).click()`}); await sleep(1200); }
const s=await send('Page.captureScreenshot',{format:'png'}); fs.writeFileSync(out,Buffer.from(s.result.data,'base64')); ws.close(); proc.kill(); process.exit(0);
