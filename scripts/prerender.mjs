/**
 * Static pre-rendering.
 * Renders every route to its own folder (dist/about/index.html, …) so the site
 * works on plain shared hosting: direct links and refreshes need no rewrite rules.
 * Also writes 404.html, sitemap.xml, robots.txt and .htaccess.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

// Preload the two Latin font files every page uses, so text renders in the right font sooner.
const fontPreloads = fs
  .readdirSync(path.join(dist, 'assets'))
  .filter((f) => /^inter(-tight)?-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');
const template = fs
  .readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace('<!--app-head-->', `${fontPreloads}\n    <!--app-head-->`);
const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!ssrEntry) throw new Error('SSR bundle not found in dist-ssr/');
const { render, routes, notFoundMeta, site } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const page = (url) => {
  const { html, head } = render(url);
  if (!html || html.length < 200) throw new Error(`Empty render for ${url}`);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
};

for (const r of routes) {
  const out = r.path === '/' ? path.join(dist, 'index.html') : path.join(dist, r.path, 'index.html');
  write(out, page(r.path));
  console.log(`  rendered ${r.path}`);
}
write(path.join(dist, '404.html'), page(notFoundMeta.path));
console.log('  rendered /404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => r.index)
  .map(
    (r) => `  <url>
    <loc>${site.url}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
write(path.join(dist, 'sitemap.xml'), sitemap);

write(
  path.join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
);

// Apache settings. Every directive is optional for the site to work; if the host
// rejects a module, the <IfModule> guards keep the file harmless.
write(
  path.join(dist, '.htaccess'),
  `# PYMLABS static site
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_mime.c>
  AddType image/svg+xml .svg
  AddType application/manifest+json .webmanifest
  AddType font/woff2 .woff2
  AddType image/webp .webp
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  # Files in /assets have content hashes in their names, so they can be cached forever.
  <FilesMatch "\\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # Images keep fixed names, so cache them for a month rather than forever.
  <FilesMatch "\\.(png|jpg|jpeg|webp|svg|ico)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\\.(html|xml|txt)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/x-javascript image/svg+xml application/json application/manifest+json text/xml application/xml
</IfModule>
`,
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length + 1} pages for ${site.url}`);
