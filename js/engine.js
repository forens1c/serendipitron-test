export const CATEGORIES = {
  staunen: { name: 'STAUNEN', symbol: '✧', dial: 'MUNDUS MIRABILIS' },
  versinken: { name: 'VERSINKEN', symbol: '◉', dial: 'ARS & ATMOSPHAERA' },
  andersdenken: { name: 'ANDERSDENKEN', symbol: '⌘', dial: 'ALIA PERSPECTIVA' },
  absurdistan: { name: 'ABSURDISTAN', symbol: '※', dial: 'RATIONIS VACATIO' },
  verweilen: { name: 'VERWEILEN', symbol: '≋', dial: 'HIC ET NUNC' },
  zufall: { name: 'ZUFALL', symbol: '⚄', dial: 'TERRA INCOGNITA' }
};
export const KINDS = {
  fact: 'Tatsache', hypothesis: 'Hypothese', philosophy: 'Philosophische Interpretation',
  association: 'Kreative Assoziation', fiction: 'Fiktion'
};
export function random() {
  if (globalThis.crypto?.getRandomValues) return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  return Math.random();
}
export function choose(items, rng = random) {
  if (!items.length) throw new Error('Dieses Fach ist leer.');
  return items[Math.min(items.length - 1, Math.floor(rng() * items.length))];
}
export function drawOne(items, category, seen, rng = random, excluded = []) {
  const pool = items.filter(item => (category === 'zufall' || item.category === category) && !excluded.includes(item.id));
  if (!pool.length) throw new Error('Dieses Fach ist gerade nicht verfügbar.');
  let fresh = pool.filter(item => !seen.has(item.id));
  if (!fresh.length) {
    // Reset only this exhausted pool. Other compartments retain their history.
    const last = [...seen].reverse().find(id => pool.some(item => item.id === id));
    pool.forEach(item => seen.delete(item.id));
    fresh = pool.length > 1 ? pool.filter(item => item.id !== last) : pool;
  }
  const item = choose(fresh, rng);
  seen.delete(item.id); // Insertion order keeps the most recent ID at the end.
  seen.add(item.id);
  return item;
}
export function connect(pieces, rng = random) {
  // A transparent literary rule, never an asserted scientific relationship.
  const common = pieces[0].tags.filter(tag => pieces.every(item => item.tags.includes(tag)));
  if (common.length) return { basis: 'Gemeinsames Motiv · redaktionelle Tags', text: `„${common[0]}“ ist das gemeinsame Motiv dieser Funde. Das ist eine kuratorische Verbindung, kein Beleg für einen ursächlichen Zusammenhang.` };
  const titles = pieces.map(item => `„${item.title}“`);
  const prompts = [
    `In einer erfundenen Wunderkammer hängt ${titles[0]} neben ${titles[1]}. Das eine wird zum Schauglas für das andere: Was eben selbstverständlich wirkte, bekommt einen fremden Rahmen.`,
    `${titles[0]} ist hier die Frage, ${titles[1]} die höchst unwahrscheinliche Antwort. Eine spielerische Montage: Die Verbindung entsteht erst durch diese Nachbarschaft.`,
    `Stell dir vor, ${titles[0]} wäre der Name eines Instruments und ${titles[1]} die Landschaft, die es vermisst. Dieses Instrument gibt es nur in dieser kleinen Assoziation.`
  ];
  const extra = pieces.length === 3 ? ` ${titles[2]} wäre das Fenster dieses ausgedachten Raums.` : '';
  return { basis: 'Ausdrücklich imaginäre Montage · feste Textregeln', text: choose(prompts, rng) + extra };
}
export function draw(items, category, chaos, seen, rng = random) {
  const first = drawOne(items, category, seen, rng);
  if (!chaos) return { id: first.id, mode: 'single', pieces: [first] };
  const count = rng() < .5 ? 2 : 3;
  const pieces = [first];
  for (let i = 1; i < count; i++) {
    const otherCategories = items.filter(item => !pieces.some(p => p.category === item.category));
    pieces.push(drawOne(otherCategories, 'zufall', seen, rng, pieces.map(p => p.id)));
  }
  return { id: `chaos-${pieces.map(p => p.id).join('-')}-${Date.now().toString(36)}`, mode: 'chaos', pieces, connection: connect(pieces, rng) };
}
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function safeImage(value) {
  if (typeof value !== 'string') return null;
  if (/^\.\/assets\/[a-z0-9-]+\.(svg|webp|jpg|png)$/.test(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['images.metmuseum.org', 'www.artic.edu'].includes(url.hostname) ? url.href : null;
  } catch { return null; }
}
export function validPiece(p) {
  return p && typeof p === 'object' && typeof p.id === 'string' && p.id.length < 160 &&
    Object.hasOwn(CATEGORIES, p.category) && p.category !== 'zufall' && Object.hasOwn(KINDS, p.kind) &&
    typeof p.title === 'string' && p.title.length > 0 && p.title.length <= 240 &&
    typeof p.teaser === 'string' && p.teaser.length <= 500 &&
    Array.isArray(p.body) && p.body.length > 0 && p.body.length <= 10 && p.body.every(x => typeof x === 'string' && x.length <= 6000) &&
    Array.isArray(p.tags) && p.tags.length <= 15 && p.tags.every(x => typeof x === 'string' && x.length < 100) &&
    Array.isArray(p.sources) && p.sources.length <= 10 && p.sources.every(s => typeof s.label === 'string' && s.label.length < 350 && safeUrl(s.url)) &&
    (!p.image || (safeImage(p.image.src) && typeof p.image.credit === 'string' && p.image.credit.length < 1000)) &&
    (!p.media || (safeUrl(p.media.url) && typeof p.media.label === 'string' && p.media.label.length < 300));
}
export function validDraw(d) {
  return d && typeof d.id === 'string' && d.id.length < 650 && ['single', 'chaos'].includes(d.mode) &&
    Array.isArray(d.pieces) && d.pieces.length >= 1 && d.pieces.length <= 3 &&
    (d.mode === 'single' ? d.pieces.length === 1 : d.pieces.length >= 2) && d.pieces.every(validPiece) &&
    (d.mode !== 'chaos' || (d.connection && typeof d.connection.text === 'string' && d.connection.text.length < 4000 && typeof d.connection.basis === 'string' && d.connection.basis.length < 300));
}
