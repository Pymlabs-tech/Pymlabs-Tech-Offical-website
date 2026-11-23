// Submits the real contact form once in headless Chrome and reports the outcome + the EmailJS response.
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const base = process.argv[2] || 'http://localhost:4173';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const proc=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9335',`--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(),'qe-'))}`,'about:blank']);
let u; for(let i=0;i<50&&!u;i++){await sleep(200);try{u=(await (await fetch('http://127.0.0.1:9335/json')).json()).find(t=>t.type==='page')?.webSocketDebuggerUrl}catch{}}
const ws=new WebSocket(u); await new Promise(r=>ws.addEventListener('open',r)); let id=0; const pend=new Map(); const net=[];
ws.addEventListener('message',m=>{const x=JSON.parse(m.data); if(x.id&&pend.has(x.id)){pend.get(x.id)(x);pend.delete(x.id)} else if(x.method==='Network.responseReceived'&&x.params.response.url.includes('emailjs')) net.push(x.params)});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
await send('Runtime.enable'); await send('Network.enable'); await send('Page.enable');
await send('Page.navigate',{url:base+'/contact/?service=website-development'}); await sleep(4000);
const r=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
const f=document.querySelector('form'); const o={button:f.querySelector('button[type=submit]').textContent.trim()};
const set=(sel,v)=>{const el=f.querySelector(sel);const p=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))};
set('input[name=name]','PYMLABS Website Test'); set('input[name=email]','info.pymlabs@gmail.com'); set('input[name=company]','Test (please ignore)');
set('textarea[name=description]','This is an automated test of the website contact form after connecting EmailJS. You can delete this email.');
await new Promise(r=>setTimeout(r,300)); f.querySelector('button[type=submit]').click();
for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,250)); if(/has been sent|could not be sent/.test(document.body.textContent)) break;}
o.result=/has been sent/.test(document.body.textContent)?'SENT':/could not be sent/.test(document.body.textContent)?'ERROR':'NO RESULT'; return o})()`});
let body=''; if(net[0]){ const b=await send('Network.getResponseBody',{requestId:net[0].requestId}); body=b.result?.body; }
console.log(JSON.stringify(r.result.result.value), net.map(n=>n.response.status), body); ws.close(); proc.kill(); process.exit(0);
