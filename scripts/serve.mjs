/**
 * Minimal static server that behaves like basic Apache shared hosting:
 * - serves files from dist/
 * - folder requests serve folder/index.html
 * - "/about" (folder without trailing slash) redirects 301 to "/about/"
 * - anything else that is missing returns 404.html with status 404
 * No SPA fallback, so it shows exactly what the live host will do.
 * Usage: node scripts/serve.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const rel = decodeURIComponent(url.pathname);
    const file = path.join(dist, rel);
    if (!file.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    const send = (p, status = 200) => {
      res.writeHead(status, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    };
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!rel.endsWith('/')) {
        res.writeHead(301, { Location: `${rel}/${url.search}` }).end();
        return;
      }
      const index = path.join(file, 'index.html');
      if (fs.existsSync(index)) return send(index);
    } else if (fs.existsSync(file)) {
      return send(file);
    }
    send(path.join(dist, '404.html'), 404);
  })
  .listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
