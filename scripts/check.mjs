import { readFile, access, readdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
let checks = 0;
const failures = [];
function assert(ok, message) { checks++; if (!ok) failures.push(message); }
async function localReference(file, ref) {
  if (!ref || /^(https?:|mailto:|data:)/.test(ref)) return;
  const [path, fragment] = ref.split('#');
  if (path) {
    assert(!path.startsWith('/'), `Absolute path breaks GitHub Pages subpath: ${ref}`);
    const target = resolve(dirname(file), decodeURIComponent(path.split('?')[0]));
    assert(target === resolve(root) || target.startsWith(root), `Reference leaves public directory: ${ref}`);
    try { await access(target); checks++; } catch { failures.push(`Missing local asset from ${file}: ${ref}`); }
  } else if (fragment) {
    const html = await readFile(file, 'utf8');
    assert(html.includes(`id="${fragment}"`), `Missing anchor: ${ref}`);
  }
}
for (const entry of await readdir(root)) {
  if (!entry.endsWith('.html')) continue;
  const file = join(root, entry);
  const html = await readFile(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert(ids.length === new Set(ids).size, `Duplicate IDs in ${entry}`);
  assert(html.includes('lang="de"'), `Missing document language in ${entry}`);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `Expected one h1 in ${entry}`);
  assert(!/TODO|lorem ipsum|DEIN-NAME|example\.com/i.test(html), `Unfinished placeholder in ${entry}`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) await localReference(file, match[1]);
  for (const match of html.matchAll(/<(?:img|script)\b[^>]*src="([^"]+)"/g)) assert(!/^https?:/.test(match[1]), `Remote automatic request: ${match[1]}`);
  for (const match of html.matchAll(/<img\b([^>]+)>/g)) assert(/\balt="[^"]*"/.test(match[1]), `Image missing alt in ${entry}`);
  for (const match of html.matchAll(/<a\b([^>]+)>/g)) {
    if (/target="_blank"/.test(match[1])) assert(/rel="[^"]*noopener/.test(match[1]), `External tab missing noopener in ${entry}`);
  }
  for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of match[1].split(' ')) assert(ids.includes(id), `Missing accessible name target: ${id}`);
}
const html = await readFile(join(root, 'index.html'), 'utf8');
const app = await readFile(join(root, 'app.js'), 'utf8');
for (const match of app.matchAll(/byId\('([^']+)'\)/g)) assert(html.includes(`id="${match[1]}"`), `JS references missing element: ${match[1]}`);
for (const filename of ['style.css', 'assets/fonts.css']) {
  const file = join(root, filename);
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) await localReference(file, match[1]);
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`${checks} static checks passed: local assets, subpaths, anchors, accessible names, fonts and scripts.`);
