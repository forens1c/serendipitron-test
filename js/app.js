import { CATEGORIES, KINDS, draw, random, safeUrl, safeImage, validPiece } from './engine.js';
import { createStore, parseImport } from './storage.js';
import { createMuseumProvider } from './providers.js';

const $ = id => document.getElementById(id);
let local;
try { local = window.localStorage; } catch { local = { getItem() { throw Error(); }, setItem() { throw Error(); } }; }
const store = createStore(local), museum = createMuseumProvider();
let items = [], selected = 'zufall', chaos = false, busy = false, current = null, readerDraw = null;
let page = 0, toastTimer, storageWarned = false, audioContext, liveController, liveMessage = '';
let seen = new Set(store.state.seen);
const reduced = () => store.state.settings.motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
function notify(message) {
  $('notice').textContent = message; $('notice').classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $('notice').classList.remove('visible'), 6000);
}
function persist() {
  store.state.seen = [...seen].slice(-2000);
  const ok = store.write();
  $('storage-status').textContent = ok ? 'Einstellungen und Wunderkammer werden in diesem Browser gespeichert.' : 'Dieser Browser erlaubt gerade kein dauerhaftes Speichern. Die Sammlung bleibt nur bis zum Schließen dieser Seite. Sichere sie bei Bedarf per Export.';
  if (!ok && !storageWarned) { notify('Speichern ist gerade nicht möglich. Die Wunderkammer bleibt vorübergehend in dieser Sitzung.'); storageWarned = true; }
}
function updateSettings() {
  $('sound-setting').checked = store.state.settings.sound;
  $('motion-setting').checked = store.state.settings.motion;
  $('live-setting').checked = store.state.settings.live;
  document.body.classList.toggle('reduce-motion', store.state.settings.motion);
  $('live-status').textContent = store.state.settings.live ? (liveMessage || 'An. Bei VERSINKEN und ZUFALL können Museumswerke hinzukommen. Eine fehlgeschlagene Anfrage führt zurück zu den lokalen Fundstücken.') : 'Aus. Die lokale Sammlung ist vollständig nutzbar.';
  $('live-draw-button').hidden = !store.state.settings.live;
}
function playMechanism() {
  if (!store.state.settings.sound) return;
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    audioContext ||= new Context();
    void audioContext.resume().catch(() => {});
    const now = audioContext.currentTime;
    for (const [offset, frequency, duration] of [[0, 730, .035], [.09, 420, .05], [.25, 180, .09]]) {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset); gain.gain.exponentialRampToValueAtTime(.025, now + offset + .005); gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(now + offset); oscillator.stop(now + offset + duration);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
  } catch { notify('Der Klang ist hier nicht verfügbar. Der Automat arbeitet weiter.'); }
}
function setBusy(value) {
  busy = value; $('draw-button').disabled = value;
  $('ticket').hidden = value || !current;
  $('empty-tray').hidden = !value && !!current;
  $('live-draw-button').disabled = value;
  document.querySelector('.machine').classList.toggle('dispensing', value);
  $('machine-state').textContent = value ? 'EIN MOMENT DER NEUGIER' : 'BEREIT FÜR NEUGIER';
  $('output-status').textContent = value ? 'DAS WERK SETZT SICH IN GANG' : 'OFFEN FÜR ZUFÄLLE';
  $('output-tray').setAttribute('aria-busy', String(value));
}
function dispense(result) {
  current = result;
  const first = result.pieces[0], multi = result.mode === 'chaos';
  $('ticket-category').textContent = multi ? `CHAOS · ${result.pieces.length} FUNDE · KREATIVE ASSOZIATION` : `${CATEGORIES[first.category].name} · ${KINDS[first.kind]}`;
  $('ticket-title').textContent = multi ? 'Eine unwahrscheinliche Nachbarschaft' : first.title;
  $('ticket-teaser').textContent = multi ? result.pieces.map(p => p.title).join(' + ') : first.teaser;
  $('ticket-symbol').textContent = multi ? '※' : CATEGORIES[first.category].symbol;
  $('ticket').setAttribute('aria-label', `${multi ? 'CHAOS-Fund' : first.title} öffnen`);
  $('empty-tray').hidden = true; $('ticket').hidden = false;
  $('ticket').classList.remove('ticket-arrives');
  void $('ticket').offsetWidth;
  $('ticket').classList.add('ticket-arrives');
  $('output-status').textContent = 'EIN FUNDSTÜCK LIEGT BEREIT';
  notify(multi ? 'Eine kleine Montage liegt im Ausgabefach.' : 'Dein Fundstück liegt im Ausgabefach.');
  // The single deliberate action may reveal content, but never moves or traps focus.
  $('ticket').focus({ preventScroll: true });
  if ($('ticket').getBoundingClientRect().bottom > window.innerHeight) $('output-tray').scrollIntoView({ behavior: 'auto', block: 'nearest' });
}
async function runDraw(forceLive = false) {
  if (busy || !items.length) return;
  const category = selected, wantsChaos = chaos;
  setBusy(true); playMechanism();
  try {
    let result;
    const mayLive = store.state.settings.live && !wantsChaos && ['zufall', 'versinken'].includes(category);
    if (forceLive || (mayLive && random() < .3)) {
      liveController = new AbortController();
      try {
        const p = await museum.next(seen, random, liveController.signal);
        if (!store.state.settings.live) throw new Error('Das Museumsfenster wurde geschlossen.');
        seen.delete(p.id); seen.add(p.id);
        result = { id: p.id, mode: 'single', pieces: [p] };
        $('live-status').textContent = liveMessage = 'Das Museumsfenster hat geantwortet. Bild und Katalogdaten stammen live vom Metropolitan Museum.';
      } catch (error) {
        console.warn('Museum request unavailable:', error.name, error.message);
        $('live-status').textContent = liveMessage = 'Das Museumsfenster ist gerade nicht erreichbar oder enthält keine neuen Werke. Der lokale Automat arbeitet weiter.';
        notify('Das Museumsfenster ist gerade zu. Ein lokales Fundstück kommt stattdessen.');
      } finally { liveController = null; }
    }
    result ||= draw(items, category, wantsChaos, seen);
    persist();
    await pause(reduced() ? 0 : 720);
    setBusy(false); dispense(result);
    if (forceLive && result.pieces[0].live) openReader(result);
  } catch {
    setBusy(false); notify('Das Fach hat sich kurz verklemmt. Bitte noch einmal versuchen.');
  }
}
function link(label, href, className) {
  const url = safeUrl(href);
  if (!url) return node('span', className, label);
  const a = node('a', className, label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.referrerPolicy = 'no-referrer'; return a;
}
function kindTag(kind) {
  const tag = node('span', 'type-tag', KINDS[kind]); tag.dataset.kind = kind; return tag;
}
function renderPiece(piece, headingTag = 'h2') {
  const fragment = document.createDocumentFragment();
  fragment.append(kindTag(piece.kind));
  const title = node(headingTag, '', piece.title);
  if (headingTag === 'h2') title.id = 'reader-title';
  fragment.append(title, node('p', 'lead', piece.teaser));
  if (piece.image && safeImage(piece.image.src)) {
    const figure = node('figure', 'reader-visual'), img = node('img');
    img.alt = piece.image.alt || piece.title; img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    // Loading a saved live image requires the same explicit permission as a fresh one.
    const remote = /^https:/.test(piece.image.src);
    const caption = node('figcaption', '', piece.image.credit);
    if (!remote || store.state.settings.live) {
      img.src = piece.image.src;
      img.addEventListener('error', () => { img.hidden = true; caption.textContent = `${piece.image.credit} · Das Bild konnte gerade nicht geladen werden. Text und Quelle bleiben verfügbar.`; });
      figure.append(img);
    } else {
      caption.append(document.createTextNode(' · Das externe Bild bleibt bei ausgeschaltetem Museumsfenster geschlossen.'));
    }
    if (piece.image.url && safeUrl(piece.image.url)) caption.append(document.createTextNode(' · '), link('Herkunft & Rechte', piece.image.url));
    figure.append(caption); fragment.append(figure);
  }
  for (const paragraph of piece.body) fragment.append(node('p', piece.format === 'poem' ? 'poem' : '', paragraph));
  if (piece.media && safeUrl(piece.media.url)) {
    fragment.append(link(piece.media.label, piece.media.url, 'media-link'));
    fragment.append(node('p', 'media-note', piece.media.type === 'music' ? 'Öffnet die offizielle Anbieterseite in einem neuen Tab. Je nach Anbieter gibt es Hörproben, Videos oder eine vollständige Aufnahme. Kein automatisches Abspielen.' : 'Öffnet die Quelle in einem neuen Tab.'));
  }
  const details = node('details', 'source-details');
  details.append(node('summary', '', piece.sources.length ? 'Quellen & Einordnung' : 'Über dieses Original'));
  if (piece.sources.length) {
    const list = node('ul');
    for (const source of piece.sources) {
      const li = node('li'); li.append(link(source.label, source.url));
      if (source.note) li.append(node('span', 'source-note', source.note));
      list.append(li);
    }
    details.append(list);
    details.append(node('p', 'small-print', piece.live ? 'Live übernommene Museumsdaten; keine autonome Recherche. Der Katalog kann sich ändern.' : 'Redaktionell zusammengestellt und mit den verlinkten Quellen abgeglichen. Stand: 27.11.2026. Fachliche Einordnungen können sich ändern.'));
  } else details.append(node('p', 'small-print', 'Originales Textfragment von PB Labs für SERENDIPITRON, 2026. Frei erfunden, keine historische oder naturwissenschaftliche Aussage.'));
  fragment.append(details); return fragment;
}
function openDialog(id) {
  const dialog = $(id);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function openReader(result) {
  readerDraw = result;
  const body = $('reader-body'); body.replaceChildren();
  $('reader-eyebrow').textContent = result.mode === 'chaos' ? 'CHAOS · EINE KLEINE MONTAGE' : `${CATEGORIES[result.pieces[0].category].name}${result.pieces[0].live ? ' · LIVE AUS DEM MUSEUM' : ' · AUS DEM AUTOMATEN'}`;
  if (result.mode === 'chaos') {
    body.append(node('h2', '', 'Eine unwahrscheinliche Nachbarschaft')); body.firstChild.id = 'reader-title';
    const connection = node('div', 'chaos-connection'); connection.append(node('small', '', result.connection.basis), node('p', '', result.connection.text)); body.append(kindTag('association'), connection);
    for (const piece of result.pieces) { const section = node('section', 'chaos-piece'); section.append(renderPiece(piece, 'h3')); body.append(section); }
  } else body.append(renderPiece(result.pieces[0]));
  updateSaveButton(); openDialog('reader');
}
function updateSaveButton() {
  const saved = store.state.collection.some(item => item.id === readerDraw?.id);
  $('save-button').textContent = saved ? 'In der Wunderkammer abgelegt' : 'In die Wunderkammer';
  $('save-button').disabled = saved;
}
function renderCollection() {
  const query = $('collection-search').value.toLocaleLowerCase('de').trim();
  const filtered = store.state.collection.filter(d => d.pieces.some(p => `${p.title} ${p.teaser} ${p.tags.join(' ')} ${p.body.join(' ')}`.toLocaleLowerCase('de').includes(query)));
  const pages = Math.max(1, Math.ceil(filtered.length / 8)); page = Math.min(page, pages - 1);
  const container = $('collection-items'); container.replaceChildren();
  if (!filtered.length) container.append(node('p', 'empty-collection', query ? 'Zu diesem Wort liegt hier noch nichts.' : 'Noch ein leeres Regal. Auch das hat seinen Reiz.'));
  for (const entry of [...filtered].reverse().slice(page * 8, page * 8 + 8)) {
    const row = node('div', 'collection-entry'), open = node('button');
    open.append(node('small', '', entry.mode === 'chaos' ? 'CHAOS · Kreative Assoziation' : CATEGORIES[entry.pieces[0].category].name), node('strong', '', entry.mode === 'chaos' ? entry.pieces.map(p => p.title).join(' + ') : entry.pieces[0].title));
    open.addEventListener('click', () => openReader(entry));
    const remove = node('button', 'remove-button', '×'); remove.setAttribute('aria-label', `${entry.pieces[0].title} aus der Wunderkammer entfernen`);
    remove.addEventListener('click', () => { store.state.collection = store.state.collection.filter(d => d.id !== entry.id); persist(); renderCollection(); });
    row.append(open, remove); container.append(row);
  }
  $('collection-page').textContent = filtered.length ? `Seite ${page + 1} von ${pages}` : '';
  $('collection-prev').disabled = page === 0; $('collection-next').disabled = page >= pages - 1;
  $('export-button').disabled = !store.state.collection.length;
}
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  selected = button.dataset.category;
  document.querySelectorAll('[data-category]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  $('dial-label').textContent = CATEGORIES[selected].dial;
  $('gauge-needle').style.transform = `rotate(${Object.keys(CATEGORIES).indexOf(selected) * 19}deg)`;
}));
$('draw-button').addEventListener('click', () => runDraw());
$('chaos-toggle').addEventListener('click', () => { chaos = !chaos; $('chaos-toggle').setAttribute('aria-pressed', String(chaos)); });
$('ticket').addEventListener('click', () => current && openReader(current));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
$('about-button').addEventListener('click', () => openDialog('about'));
$('settings-button').addEventListener('click', () => { updateSettings(); persist(); openDialog('settings'); });
$('collection-button').addEventListener('click', () => { page = 0; renderCollection(); openDialog('collection'); });
$('save-button').addEventListener('click', () => {
  if (!readerDraw || store.state.collection.some(d => d.id === readerDraw.id)) return;
  if (store.state.collection.length >= 1500) { notify('Das lokale Regal ist voll. Bitte zuerst einige Funde exportieren und entfernen.'); return; }
  store.state.collection.push({ ...readerDraw, savedAt: new Date().toISOString() }); persist(); updateSaveButton(); renderCollection();
  // Toasts outside a modal are inert to assistive technology; the changed button is the confirmation.
});
$('collection-search').addEventListener('input', () => { page = 0; renderCollection(); });
$('collection-prev').addEventListener('click', () => { page--; renderCollection(); });
$('collection-next').addEventListener('click', () => { page++; renderCollection(); });
for (const [id, key] of [['sound-setting', 'sound'], ['motion-setting', 'motion'], ['live-setting', 'live']]) $(id).addEventListener('change', () => {
  store.state.settings[key] = $(id).checked;
  if (key === 'live') liveMessage = '';
  if (key === 'live' && !$(id).checked) { liveController?.abort(); museum.reset(); }
  persist(); updateSettings(); if (key === 'sound' && $(id).checked) playMechanism();
});
const liveButton = node('button', 'plain-button', 'Ein Werk aus dem Museum ziehen'); liveButton.id = 'live-draw-button';
liveButton.addEventListener('click', () => { $('settings').close(); void runDraw(true); });
$('live-status').after(liveButton);
$('reset-history').addEventListener('click', () => { seen.clear(); museum.reset(); persist(); $('reset-history').textContent = 'Alle lokalen Fächer sind wieder freigegeben'; });
$('clear-collection').addEventListener('click', () => {
  if (!store.state.collection.length) return;
  if (window.confirm('Alle gespeicherten Fundstücke in diesem Browser entfernen? Ein vorheriger Export bleibt erhalten.')) { store.state.collection = []; persist(); renderCollection(); $('clear-collection').textContent = 'Die Wunderkammer ist leer'; }
});
$('export-button').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ application: 'SERENDIPITRON', version: 1, exportedAt: new Date().toISOString(), collection: store.state.collection }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), a = node('a'); a.href = url; a.download = `SERENDIPITRON-Wunderkammer-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
});
$('import-input').addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('Die Datei ist zu groß. Maximal 2 MB.');
    const imported = parseImport(await file.text()), existing = new Set(store.state.collection.map(d => d.id));
    const added = imported.filter(d => !existing.has(d.id) && existing.add(d.id));
    if (store.state.collection.length + added.length > 1500) throw new Error('Zu viele Funde für das lokale Regal. Maximal 1500.');
    store.state.collection.push(...added); persist(); renderCollection(); $('collection-page').textContent = `${added.length} Fundstücke importiert.`;
  } catch (error) { $('collection-page').textContent = error.message || 'Diese Datei ließ sich nicht öffnen.'; }
  finally { event.target.value = ''; }
});
window.addEventListener('offline', () => { $('machine-state').textContent = 'OFFLINE · NEUGIER BLEIBT'; });
window.addEventListener('online', () => { if (!busy) $('machine-state').textContent = 'BEREIT FÜR NEUGIER'; });

async function initialize() {
  updateSettings();
  try {
    const response = await fetch('./data/fundstuecke.json');
    if (!response.ok) throw Error();
    const data = await response.json();
    if (!Array.isArray(data.items) || data.items.length < 120 || !data.items.every(validPiece)) throw Error();
    items = data.items;
    $('database-count').textContent = String(items.length);
    $('machine-state').textContent = navigator.onLine ? 'BEREIT FÜR NEUGIER' : 'OFFLINE · NEUGIER BLEIBT';
    $('draw-button').disabled = false;
    persist();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js', { scope: './' }).then(registration => {
      const update = () => { $('offline-status').textContent = registration.active ? 'Eine Offline-Kopie dieses Automaten ist bereit. Externe Quellen und Musik benötigen weiterhin Internet.' : 'Die Offline-Kopie wird angelegt. Dafür braucht der erste Besuch eine Verbindung.'; };
      update();
      registration.installing?.addEventListener('statechange', update);
      registration.addEventListener('updatefound', () => { registration.installing?.addEventListener('statechange', update); update(); });
    }).catch(() => { $('offline-status').textContent = 'Offline-Aufbewahrung ist in diesem Browser gerade nicht verfügbar. Für einen neuen Besuch wird Internet benötigt.'; });
    else $('offline-status').textContent = 'Dieser Browser unterstützt keine Offline-Kopie. Der Automat funktioniert mit einer Verbindung.';
  } catch {
    $('machine-state').textContent = 'DIE FÄCHER SIND NOCH ZU';
    $('empty-tray').replaceChildren(node('p', '', 'Die Fundstücke konnten nicht geladen werden.'), node('small', '', 'Beim ersten Besuch braucht der Automat eine Verbindung. Bitte später neu laden.'));
    const retry = node('button', 'brass-button', 'Noch einmal laden'); retry.addEventListener('click', () => window.location.reload()); $('empty-tray').append(retry);
    notify('Die lokale Inhaltsdatei fehlt oder ist nicht erreichbar.');
  }
}
void initialize();
