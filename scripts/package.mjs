/**
 * Creates release/pymlabs-website-htdocs.zip containing the CONTENTS of dist/
 * (index.html at the zip root), ready to upload to /htdocs.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const releaseDir = path.join(root, 'release');
const zip = path.join(releaseDir, 'pymlabs-website-htdocs.zip');

if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('dist/index.html missing. Run npm run build first.');
const forbidden = fs.readdirSync(dist, { recursive: true }).filter((f) => /\.map$|\.env|node_modules/.test(String(f)));
if (forbidden.length) throw new Error(`Refusing to package: ${forbidden.join(', ')}`);

fs.mkdirSync(releaseDir, { recursive: true });
fs.rmSync(zip, { force: true });

if (process.platform === 'win32') {
  // tar.exe ships with Windows 10+ and writes standard zip files with -a.
  // List top-level entries explicitly so paths inside the zip have no "./" prefix.
  execFileSync('tar.exe', ['-a', '-c', '-f', zip, '-C', dist, ...fs.readdirSync(dist)], { stdio: 'inherit' });
} else {
  execFileSync('zip', ['-r', '-X', zip, '.'], { cwd: dist, stdio: 'inherit' });
}
console.log(`Created ${zip} (${(fs.statSync(zip).size / 1024).toFixed(0)} KB)`);
