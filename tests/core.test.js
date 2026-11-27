import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { drawOne, draw, connect, validDraw, validPiece, safeUrl, safeImage } from '../js/engine.js';
import { createStore, parseImport, STORAGE_KEY } from '../js/storage.js';
import { createMuseumProvider } from '../js/providers.js';
const { items } = JSON.parse(await readFile(new URL('../data/fundstuecke.json', import.meta.url), 'utf8'));
const rng = () => .23;
const memory = () => { const map = new Map(); return { getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v) }; };
test('125 echte, eindeutige Datensätze mit vollständiger Struktur', () => {
  assert.equal(items.length, 125); assert(items.every(validPiece));
  assert.equal(new Set(items.map(x => x.id)).size, 125);
});
test('Zufall zieht jeden Fund einmal vor dem Neumischen', () => {
  const seen = new Set(), ids = Array.from({ length: 125 }, () => drawOne(items, 'zufall', seen, rng).id);
  assert.equal(new Set(ids).size, 125);
  assert.notEqual(drawOne(items, 'zufall', seen, rng).id, ids.at(-1));
});
test('Jedes Fach bleibt im Fach und wiederholt sich erst nach Ausschöpfung', () => {
  for (const category of new Set(items.map(x => x.category))) {
    const pool = items.filter(p => p.category === category), seen = new Set();
    const results = pool.map(() => drawOne(items, category, seen, rng));
    assert(results.every(p => p.category === category)); assert.equal(new Set(results.map(p => p.id)).size, pool.length);
  }
});
test('Neumischen berücksichtigt die tatsächliche letzte Ziehung', () => {
  const pool = items.slice(0, 3), seen = new Set([pool[2].id, pool[0].id, pool[1].id]);
  assert.notEqual(drawOne(pool, 'zufall', seen, () => .99).id, pool[1].id);
});
test('Ein leeres Fach liefert einen verständlichen Fehler', () => assert.throws(() => drawOne([], 'zufall', new Set()), /leer|verfügbar/));
test('Fach-Neumischung erhält die Historie anderer Fächer', () => {
  const seen = new Set(items.map(p => p.id)); drawOne(items, 'staunen', seen, rng);
  assert(seen.has(items.find(p => p.category === 'verweilen').id));
});
test('CHAOS enthält 2 oder 3 verschiedene Fächer, sichere Funde und gekennzeichnete Montage', () => {
  for (const v of [.1, .8]) {
    const result = draw(items, 'staunen', true, new Set(), () => v);
    assert(validDraw(result)); assert.equal(result.pieces.length, v < .5 ? 2 : 3);
    assert.equal(result.pieces[0].category, 'staunen');
    assert.equal(new Set(result.pieces.map(p => p.category)).size, result.pieces.length);
    assert.match(result.connection.basis, /Motiv|imaginär/);
  }
});
test('Ein gemeinsames Motiv wird nicht als kausaler Beleg verkauft', () => {
  const a = { ...items[0], tags: ['Licht'] }, b = { ...items[1], tags: ['Licht'] };
  assert.match(connect([a, b]).text, /kein Beleg/);
});
test('Einzelmodus liefert genau ein Fundstück', () => assert.equal(draw(items, 'zufall', false, new Set(), rng).pieces.length, 1));
test('Unsichere Protokolle, eingebettete Credentials und beliebige Bildhosts werden verworfen', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'http://example.com', 'https://secret@example.com']) assert.equal(safeUrl(url), null);
  assert.equal(safeImage('https://untrusted.example/a.png'), null); assert.equal(safeImage('./assets/../../bad.svg'), null);
  assert(safeImage('./assets/still-1.svg'));
});
test('Ein manipulierter Import mit externem Skriptlink wird abgewiesen', () => {
  const result = draw(items, 'zufall', false, new Set(), rng); result.pieces = [{ ...result.pieces[0], media: { label: 'x', url: 'javascript:alert(1)' } }];
  assert.throws(() => parseImport(JSON.stringify({ application: 'SERENDIPITRON', version: 1, collection: [result] })), /ungültig/);
});
test('Einstellungen und Sammlung überleben eine neue Store-Instanz', () => {
  const mem = memory(), a = createStore(mem); a.state.settings.motion = true;
  a.state.collection.push(draw(items, 'zufall', false, new Set(), rng)); a.write();
  const b = createStore(mem); assert.equal(b.state.settings.motion, true); assert.equal(b.state.collection.length, 1);
});
test('Neue Installation aktiviert weder Geräusche noch Live-Abfragen', () => {
  const store = createStore(memory()); assert.deepEqual(store.state.settings, { sound: false, motion: false, live: false });
});
test('Defektes localStorage blockiert den Automaten nicht', () => {
  const bad = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  const store = createStore(bad); store.state.collection.push(draw(items, 'zufall', false, new Set(), rng));
  assert.equal(store.write(), false); assert.equal(store.state.collection.length, 1);
});
test('Beschädigte gespeicherte JSON wird aufgefangen', () => {
  const mem = memory(); mem.setItem(STORAGE_KEY, '{broken'); assert.equal(createStore(mem).state.collection.length, 0);
});
test('Import/Export erhält Einzel- und CHAOS-Funde vollständig', () => {
  const collection = [draw(items, 'staunen', false, new Set(), rng), draw(items, 'zufall', true, new Set(), rng)];
  assert.deepEqual(parseImport(JSON.stringify({ application: 'SERENDIPITRON', version: 1, collection })), collection);
});
test('Fremde, beschädigte und zu große Importdateien werden abgewiesen', () => {
  for (const text of ['{}', '{', 'x'.repeat(2_000_001)]) assert.throws(() => parseImport(text));
});
const metRecord = { objectID: 900000, isPublicDomain: true, title: 'Testwerk', artistDisplayName: 'Katalogname', objectDate: '1800', medium: 'Öl', primaryImageSmall: 'https://images.metmuseum.org/CRDImages/test.jpg', objectURL: 'https://www.metmuseum.org/art/collection/search/900000', creditLine: 'Open Access' };
test('Museum nutzt den aktuellen v1.1-Suchpfad und prüft Public Domain', async () => {
  const calls = [], provider = createMuseumProvider(async url => {
    calls.push(url); return { ok: true, json: async () => url.includes('/search?') ? { objectIDs: [900000] } : metRecord };
  }, () => 10000);
  const piece = await provider.next(new Set(), rng); assert(validPiece(piece)); assert.equal(piece.live, true);
  assert.match(calls[0], /\/v1\.1\/search/); assert.equal(calls.length, 2);
});
test('Museum gibt kein Bild mit unklaren Rechten aus', async () => {
  const provider = createMuseumProvider(async url => ({ ok: true, json: async () => url.includes('/search?') ? { objectIDs: [900000] } : { ...metRecord, isPublicDomain: false } }), () => 10000);
  await assert.rejects(provider.next(new Set(), rng), /freigegeben/);
});
test('Museum behandelt HTTP 429 und ungültige Suchantworten als Fehler', async () => {
  await assert.rejects(createMuseumProvider(async () => ({ ok: false, status: 429 }), () => 10000).next(), /429/);
  await assert.rejects(createMuseumProvider(async () => ({ ok: true, json: async () => ({ nonsense: [] }) }), () => 10000).next(), /kein Werk/);
});
test('Provider begrenzt Anfragen bei rasch wiederholter Betätigung', async () => {
  let calls = 0;
  const provider = createMuseumProvider(async () => { calls++; throw Error('Offline'); }, () => 10000);
  await assert.rejects(provider.next()); await assert.rejects(provider.next(), /ruht/); assert.equal(calls, 1);
});
test('Museum überspringt bekannte IDs bereits bei der Suche', async () => {
  let calls = 0;
  const provider = createMuseumProvider(async () => { calls++; return { ok: true, json: async () => ({ objectIDs: [900000] }) }; }, () => 10000);
  await assert.rejects(provider.next(new Set(['met-900000'])), /freigegeben/); assert.equal(calls, 1);
});
test('Nichttransitive Würfel gewinnen zyklisch je 20 von 36 Paarungen', () => {
  const dice = [[2, 2, 4, 4, 9, 9], [1, 1, 6, 6, 8, 8], [3, 3, 5, 5, 7, 7]];
  for (let i = 0; i < 3; i++) assert.equal(dice[i].flatMap(a => dice[(i + 1) % 3].map(b => Number(a > b))).reduce((a, b) => a + b), 20);
});
test('Simpson-Beispiel kehrt die Reihenfolge nur beim Zusammenfassen um', () => {
  assert(9 / 10 > 80 / 100); assert(20 / 100 > 1 / 10); assert((9 + 20) / 110 < (80 + 1) / 110);
});
