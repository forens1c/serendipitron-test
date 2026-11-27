import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
function worker() {
  const events = {}, removed = [], stored = [], fallback = { marker: 'cached-app' };
  const cache = { match: async () => fallback, addAll: async files => stored.push(...files) };
  const context = { URL, Response, self: { registration: { scope: 'https://example.github.io/serendipitron-test/' }, addEventListener: (name, fn) => events[name] = fn, skipWaiting: async () => {}, clients: { claim: async () => {} } }, caches: { open: async () => cache, keys: async () => ['serendipitron:/serendipitron-test/:old', 'serendipitron:/framelore-test/:old', 'unrelated'], delete: async name => removed.push(name) }, fetch: async () => { throw new Error('offline'); } };
  vm.runInNewContext(source, context);
  return { events, removed, stored, fallback, context };
}
test('Offline-Navigation liefert die gecachte App', async () => {
  const w = worker(); let response;
  w.events.fetch({ request: { method: 'GET', mode: 'navigate', url: 'https://example.github.io/serendipitron-test/' }, respondWith: p => response = p });
  assert.equal(await response, w.fallback);
});
test('Offline-Worker greift weder auf andere Projekte noch externe APIs zu', () => {
  const w = worker();
  for (const url of ['https://example.github.io/framelore-test/', 'https://collectionapi.metmuseum.org/public/collection/v1/objects/1']) {
    let intercepted = false; w.events.fetch({ request: { method: 'GET', url }, respondWith: () => intercepted = true }); assert.equal(intercepted, false);
  }
});
test('Cache-Bereinigung erhält FRAMELORE und fremde Caches', async () => {
  const w = worker(); let promise; w.events.activate({ waitUntil: p => promise = p }); await promise;
  assert.deepEqual(w.removed, ['serendipitron:/serendipitron-test/:old']);
});
