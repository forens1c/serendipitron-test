import { validDraw } from './engine.js?v=0.2.0';
export const STORAGE_KEY = 'pblabs.serendipitron.v1';
const fresh = () => ({ version: 1, settings: { sound: false, motion: false, live: false, synth: false }, seen: [], collection: [] });
export function normalize(value) {
  const state = fresh();
  if (!value || value.version !== 1) return state;
  for (const key of Object.keys(state.settings)) state.settings[key] = value.settings?.[key] === true;
  if (Array.isArray(value.seen)) state.seen = [...new Set(value.seen.filter(x => typeof x === 'string' && x.length < 160))].slice(-2000);
  if (Array.isArray(value.collection)) state.collection = value.collection.filter(validDraw).slice(0, 1500);
  return state;
}
export function createStore(storage) {
  let persistent = true;
  let state = fresh();
  try { const raw = storage.getItem(STORAGE_KEY); if (raw) state = normalize(JSON.parse(raw)); }
  catch { persistent = false; }
  return {
    get state() { return state; }, get persistent() { return persistent; },
    write() {
      try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); persistent = true; }
      catch { persistent = false; }
      return persistent;
    },
    replace(value) { state = normalize(value); return this.write(); }
  };
}
export function parseImport(text) {
  if (text.length > 2_000_000) throw new Error('Die Datei ist zu groß. Maximal 2 MB.');
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Das ist keine lesbare JSON-Datei.'); }
  if (data?.application !== 'SERENDIPITRON' || data.version !== 1 || !Array.isArray(data.collection)) throw new Error('Diese Datei ist kein SERENDIPITRON-Export der Version 1.');
  if (data.collection.length > 1500 || !data.collection.every(validDraw)) throw new Error('Die Datei enthält ungültige Fundstücke und wurde nicht importiert.');
  return data.collection;
}
