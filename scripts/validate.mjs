import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validPiece, CATEGORIES } from '../js/engine.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'data/fundstuecke.json'), 'utf8'));
assert(data.items.length >= 120, 'Mindestens 120 Funde');
assert.equal(new Set(data.items.map(p => p.id)).size, data.items.length, 'Eindeutige IDs');
assert.equal(new Set(data.items.map(p => p.title)).size, data.items.length, 'Eindeutige Titel');
for (const p of data.items) {
  assert(validPiece(p), `Ungültiger Datensatz: ${p.id}`);
  if (p.kind !== 'fiction') assert(p.sources.length, `Quelle fehlt: ${p.id}`);
  if (p.image?.src.startsWith('./')) await access(path.join(root, p.image.src));
}
for (const category of Object.keys(CATEGORIES).filter(c => c !== 'zufall')) assert(data.items.filter(p => p.category === category).length >= 15);
const credits = JSON.parse(await readFile(path.join(root, 'data/image-credits.json'), 'utf8'));
assert.equal(credits.length, 14);
for (const c of credits) { assert.equal(c.isPublicDomain, true); await access(path.join(root, c.file)); }
const offline = JSON.parse(await readFile(path.join(root, 'data/offline-files.json'), 'utf8'));
for (const file of offline) { assert(file.startsWith('./') && !file.includes('..')); await access(path.join(root, file.split('?')[0])); }
for (const file of await readdir(path.join(root, 'assets'))) assert(offline.includes(`./assets/${file}`), `Offline-Datei fehlt: ${file}`);
const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) if (match[1] !== './') await access(path.join(root, match[1].split('?')[0]));
assert(!/<script[^>]+src="https?:/.test(html), 'Keine externen Skripte');
assert(html.includes('prefers') || (await readFile(path.join(root, 'style.css'), 'utf8')).includes('prefers-reduced-motion'));
console.log(`${data.items.length} valide Funde · 14 CC0-Museumsbilder · ${offline.length} geprüfte Offline-Dateien · relative Pfade OK`);
