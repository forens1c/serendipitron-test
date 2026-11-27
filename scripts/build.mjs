import { readdir, readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const top = ['index.html', 'style.css', 'manifest.webmanifest', 'sw.js', '.nojekyll'];
// .nojekyll is a deployment marker, not a runtime resource to precache.
const files = top.filter(file => file !== '.nojekyll');
for (const dir of ['assets', 'js', 'data']) {
  for (const entry of await readdir(path.join(root, dir))) {
    if (entry !== 'offline-files.json') files.push(`./${dir}/${entry}`);
  }
}
files.push('./data/offline-files.json');
await writeFile(path.join(root, 'data/offline-files.json'), JSON.stringify(files.map(f => f.startsWith('./') ? f : `./${f}`), null, 2) + '\n');
const hash = createHash('sha256');
for (const file of files.filter(f => f !== 'sw.js').sort()) hash.update(await readFile(path.join(root, file)));
const swPath = path.join(root, 'sw.js');
await writeFile(swPath, (await readFile(swPath, 'utf8')).replace(/const BUILD_ID = '[^']+';/, `const BUILD_ID = '${hash.digest('hex').slice(0, 12)}';`));
await rm(path.join(root, 'dist'), { recursive: true, force: true });
await mkdir(path.join(root, 'dist'));
for (const file of top) await cp(path.join(root, file), path.join(root, 'dist', file));
for (const dir of ['assets', 'js', 'data']) await cp(path.join(root, dir), path.join(root, 'dist', dir), { recursive: true });
console.log('Statische Vorschau erstellt. GitHub Pages verwendet die identischen Dateien im Projektstamm.');
