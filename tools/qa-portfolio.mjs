import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const proc=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9334',`--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(),'qp-'))}`,'about:blank']);
let u; for(let i=0;i<50&&!u;i++){await sleep(200);try{u=(await (await fetch('http://127.0.0.1:9334/json')).json()).find(t=>t.type==='page')?.webSocketDebuggerUrl}catch{}}
const ws=new WebSocket(u); await new Promise(r=>ws.addEventListener('open',r)); let id=0; const pend=new Map(); const errs=[];
ws.addEventListener('message',m=>{const x=JSON.parse(m.data); if(x.id&&pend.has(x.id)){pend.get(x.id)(x);pend.delete(x.id)} else if(x.method==='Runtime.exceptionThrown'||(x.method==='Runtime.consoleAPICalled'&&x.params.type==='error')) errs.push(JSON.stringify(x.params).slice(0,300))});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
await send('Runtime.enable'); await send('Page.enable'); await send('Page.navigate',{url:'http://localhost:4173/portfolio/'}); await sleep(2500);
const r=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{const o={};
o.filters=[...document.querySelectorAll('[aria-label="Filter projects by category"] button')].map(b=>b.textContent);
o.cards=document.querySelectorAll('section ul li button').length;
[...document.querySelectorAll('[aria-label="Filter projects by category"] button')].find(b=>b.textContent==='Website').click();
await new Promise(r=>setTimeout(r,600)); o.afterFilter=[...document.querySelectorAll('section ul h2')].map(h=>h.textContent);
document.querySelector('section ul li button').click(); await new Promise(r=>setTimeout(r,300));
const d=document.querySelector('dialog'); o.dialogOpen=d.open; o.dialogTitle=d.querySelector('h2')?.textContent;
d.querySelector('button[aria-label="Close project details"]').click(); await new Promise(r=>setTimeout(r,300)); o.closed=!d.open; return o})()`});
console.log(JSON.stringify(r.result.result.value), errs.length?errs:'no errors'); ws.close(); proc.kill(); process.exit(0);
