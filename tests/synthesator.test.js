import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { COMBINATION_COUNT, ADJECTIVES, ROOTS, OPERATIONS, termAt, synthesize, synthEnabled, NOTICE } from '../js/synthesator.js';
import { validPiece, validDraw, draw } from '../js/engine.js';
import { normalize, createStore, parseImport, STORAGE_KEY } from '../js/storage.js';
const data = JSON.parse(await readFile(new URL('../data/fundstuecke.json', import.meta.url))).items;
test('24.576 eindeutige, gültige Begriffe: vollständiger Kombinationsraum', () => {
  assert.equal(COMBINATION_COUNT, 24576);
  const titles = new Set();
  for (let i = 0; i < COMBINATION_COUNT; i++) {
    const p = termAt(i, true); assert(validPiece(p)); assert(validDraw({ id: p.id, mode: 'single', pieces: [p] }));
    assert.equal(p.teaser, NOTICE); assert.equal(p.kind, 'fiction'); assert(!p.body.join('').includes('{g}'));
    titles.add(p.title);
  }
  assert.equal(titles.size, COMBINATION_COUNT);
});
test('Starke Adjektivendung folgt weiblichem, männlichem und sächlichem Kopfwort', () => {
  for (let a = 0; a < ADJECTIVES.length; a++) for (let o = 0; o < OPERATIONS.length; o++) {
    const p = termAt(a * ROOTS.length * OPERATIONS.length + o);
    const ending = { f: 'e', m: 'er', n: 'es' }[OPERATIONS[o][1]];
    assert.equal(p.termParts[0], ADJECTIVES[a] + ending);
    assert.equal(p.title, `${p.termParts[0]} ${p.termParts[1]}${p.termParts[2]}`);
  }
});
test('Gewünschtes Beispiel ist enthalten; Beispiele erscheinen nur gelegentlich', () => {
  assert.equal(termAt(0).title, 'Transzendentale Relevanzperforation');
  assert.equal(termAt(0).body[0], 'Das unkontrollierte Entweichen vermeintlicher Wichtigkeit aus einem zuvor überbewerteten Sachverhalt.');
  assert.equal(synthesize(new Set(), () => .5).body.length, 2);
  assert.equal(synthesize(new Set(), () => 0).body.length, 3);
  assert.throws(() => termAt(-1), RangeError); assert.throws(() => termAt(COMBINATION_COUNT), RangeError);
});
test('Auch konstante Zufallswerte wiederholen keinen der letzten 32 Begriffe', () => {
  const seen = new Set(); const recent = [];
  for (let i = 0; i < 150; i++) { const p = synthesize(seen, () => 0); assert(!recent.includes(p.id)); recent.push(p.id); if (recent.length > 32) recent.shift(); }
  const restored = new Set(normalize({ version: 1, seen: [...seen] }).seen);
  assert.notEqual(synthesize(restored, () => 0).id, recent.at(-1));
});
test('Modul wird ausschließlich in ABSURDISTAN und nur explizit aktiv', () => {
  assert.equal(normalize(null).settings.synth, false);
  for (const category of ['zufall','staunen','versinken','andersdenken','verweilen']) assert(!synthEnabled(category, { synth: true }));
  assert(!synthEnabled('absurdistan', {})); assert(synthEnabled('absurdistan', { synth: true }));
});
test('v0.1-Speicher bleibt einschließlich Einstellungen, Sammlung und Historie erhalten', () => {
  const oldDraw = draw(data, 'staunen', false, new Set(), () => 0);
  const old = { version: 1, settings: { sound: true, motion: true, live: true }, seen: ['old-id'], collection: [oldDraw] };
  const values = new Map([[STORAGE_KEY, JSON.stringify(old)]]);
  const memory = { getItem: k => values.get(k), setItem: (k,v) => values.set(k,v) };
  const store = createStore(memory);
  assert.deepEqual(store.state.collection, old.collection); assert.deepEqual(store.state.seen, old.seen);
  assert.deepEqual(store.state.settings, { ...old.settings, synth: false });
  const piece = synthesize(new Set(), () => 0);
  store.state.collection.push({ id: piece.id, mode: 'single', pieces: [piece] }); store.state.settings.synth = true; store.write();
  const restored = createStore(memory);
  assert(restored.state.settings.synth); assert.equal(restored.state.collection.length, 2);
  assert.deepEqual(parseImport(JSON.stringify({ application: 'SERENDIPITRON', version: 1, collection: restored.state.collection })), restored.state.collection);
});
test('CHAOS kombiniert den Begriff mit anderen Fächern ohne unsichtbaren gewöhnlichen ABSURDISTAN-Fund', () => {
  const seen = new Set(), piece = synthesize(seen, () => 0);
  const result = draw(data, 'absurdistan', true, seen, () => .8, piece);
  assert(validDraw(result)); assert.equal(result.pieces[0], piece);
  assert.equal(new Set(result.pieces.map(p => p.category)).size, 3);
  assert.equal(seen.size, 3);
  assert.throws(() => draw(data, 'staunen', false, seen, () => 0, piece));
});
test('Manipulierte Generator-Metadaten werden beim Import verworfen', () => {
  const p = termAt(0); assert(!validPiece({ ...p, kind: 'fact' })); assert(!validPiece({ ...p, termParts: ['x'] }));
});
test('Offline-Paket enthält versionierte Einstiege und sämtliche Modul-Abhängigkeiten', async () => {
  const files = JSON.parse(await readFile(new URL('../data/offline-files.json', import.meta.url)));
  for (const p of ['./style.css','./js/app.js','./js/engine.js','./js/storage.js','./js/providers.js','./js/synthesator.js']) assert(files.includes(p + '?v=0.2.0'));
});
