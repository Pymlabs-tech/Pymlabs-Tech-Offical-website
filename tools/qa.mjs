// QA: load every page in headless Chrome, report console errors, failed requests,
// broken internal links, and exercise the menu, slider and contact form.
// Usage: node tools/qa.mjs http://localhost:4173
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const base = process.argv[2] || 'http://localhost:4173';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=9333', `--user-data-dir=${profile}`, '--no-first-run', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await sleep(200);
  try {
    const list = await (await fetch('http://127.0.0.1:9333/json')).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
const events = [];
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method) events.push(msg);
});
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Runtime.enable');
await send('Network.enable');
await send('Log.enable');
await send('Page.enable');

const pages = ['/', '/about/', '/services/', '/solutions/', '/portfolio/', '/contact/', '/privacy-policy/', '/terms-and-conditions/', '/does-not-exist/'];
const problems = [];
const links = new Set();

for (const p of pages) {
  events.length = 0;
  await send('Page.navigate', { url: base + p });
  await sleep(2500);
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') problems.push(`${p} EXCEPTION ${e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text}`);
    if (e.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(e.params.type))
      problems.push(`${p} console.${e.params.type}: ${e.params.args.map((a) => a.value ?? a.description).join(' ')}`);
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') problems.push(`${p} log: ${e.params.entry.text} ${e.params.entry.url || ''}`);
    if (e.method === 'Network.responseReceived' && e.params.response.status >= 400 && !(p === '/does-not-exist/' && e.params.type === 'Document'))
      problems.push(`${p} HTTP ${e.params.response.status} ${e.params.response.url}`);
  }
  const info = await evaluate(`(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
    canonical: document.querySelector('link[rel=canonical]')?.href,
    desc: document.querySelector('meta[name=description]')?.content?.length,
    imgsBroken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
    imgsNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src),
    links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
    buttonsNoName: [...document.querySelectorAll('button, a')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label'))).length,
    hOrder: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]),
  }))()`);
  info.links.forEach((l) => links.add(l));
  const skips = info.hOrder.some((v, i) => i > 0 && v - info.hOrder[i - 1] > 1);
  console.log(`${p}\n  title: ${info.title}\n  h1: ${JSON.stringify(info.h1)} · canonical: ${info.canonical} · desc ${info.desc} chars`);
  if (info.h1.length !== 1) problems.push(`${p} has ${info.h1.length} h1`);
  if (info.imgsBroken.length) problems.push(`${p} broken images ${info.imgsBroken}`);
  if (info.imgsNoAlt.length) problems.push(`${p} images without alt ${info.imgsNoAlt}`);
  if (info.buttonsNoName) problems.push(`${p} ${info.buttonsNoName} unnamed buttons/links`);
  if (skips) problems.push(`${p} heading levels skip: ${info.hOrder.join(',')}`);
}

// Internal links resolve?
for (const l of links) {
  if (!l.startsWith('/')) continue;
  const res = await fetch(base + l.split('#')[0], { redirect: 'manual' });
  if (res.status >= 400) problems.push(`LINK ${l} -> ${res.status}`);
  const hash = l.split('#')[1];
  if (hash) {
    const html = await res.text();
    if (!html.includes(`id="${hash}"`)) problems.push(`LINK ${l} anchor #${hash} missing`);
  }
}
console.log(`\nChecked ${links.size} distinct links: ${[...links].filter((l) => !l.startsWith('/')).join(' | ')}`);

// Redirect behaviour for folder without trailing slash
const r = await fetch(base + '/about', { redirect: 'manual' });
console.log(`/about -> ${r.status} ${r.headers.get('location')}`);

// Interactions ----------------------------------------------------------
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: base + '/' });
await sleep(2000);
const menu = await evaluate(`(async () => {
  document.querySelector('button[aria-controls=mobile-menu]').click();
  await new Promise(r => setTimeout(r, 600));
  const open = !!document.getElementById('mobile-menu');
  document.querySelector('#mobile-menu a[href="/services/"]').click();
  await new Promise(r => setTimeout(r, 1200));
  return { open, after: location.pathname, closed: !document.getElementById('mobile-menu'), title: document.title };
})()`);
console.log('mobile menu:', JSON.stringify(menu));

await send('Emulation.clearDeviceMetricsOverride');
await send('Page.navigate', { url: base + '/' });
await sleep(2000);
const slider = await evaluate(`(async () => {
  const s = document.querySelector('input[type=range]');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(s, '2'); s.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 700));
  return [...document.querySelectorAll('h3')].map(h => h.textContent).find(t => t.startsWith('Next'));
})()`);
console.log('slider stage 3 heading:', slider);

await send('Page.navigate', { url: base + '/contact/?service=ai-automation' });
await sleep(3500);
const form = await evaluate(`(async () => {
  const f = document.querySelector('form');
  const out = {};
  out.preselected = f.querySelector('select[name=service]').value;
  f.querySelector('button[type=submit]').click();
  await new Promise(r => setTimeout(r, 300));
  out.errorsShown = [...f.querySelectorAll('[id$=-err]')].map(e => e.textContent);
  const set = (sel, v) => { const el = f.querySelector(sel); const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  set('input[name=name]', 'Test Person');
  set('input[name=email]', 'test@example.com');
  set('textarea[name=description]', 'We need a booking system for our clinic with reminders.');
  await new Promise(r => setTimeout(r, 200));
  f.querySelector('button[type=submit]').click();
  await new Promise(r => setTimeout(r, 500));
  out.statusText = document.querySelector('form [aria-live] p')?.textContent;
  out.claimsSent = /has been sent/i.test(document.body.textContent);
  return out;
})()`);
console.log('contact form:', JSON.stringify(form));

console.log(`\n${problems.length ? 'PROBLEMS:\n  ' + problems.join('\n  ') : 'No problems found.'}`);
ws.close();
proc.kill();
process.exit(0);
