import { random, choose, safeUrl, safeImage, validPiece } from './engine.js?v=0.2.0';

// Adapter contract for future curators: next(seen, rng, signal) -> validated Piece.
// This adapter retrieves catalogue metadata; it does not research or generate text.
export function createMuseumProvider(fetcher = globalThis.fetch, clock = Date.now) {
  const base = 'https://collectionapi.metmuseum.org/public/collection';
  const themes = ['moonlight', 'landscape', 'flower', 'bird', 'musical instrument', 'sea', 'clouds', 'garden', 'trees', 'drawing'];
  let ids = [], fetchedAt = 0, lastAttempt = -Infinity;
  return {
    id: 'met', label: 'The Metropolitan Museum of Art',
    async next(seen = new Set(), rng = random, signal) {
      if (clock() - lastAttempt < 2000) throw new Error('Das Museumsfenster ruht kurz.');
      lastAttempt = clock();
      const controller = new AbortController();
      const abort = () => controller.abort();
      if (signal?.aborted) controller.abort();
      signal?.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(abort, 8000);
      const get = async url => {
        const response = await fetcher(url, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (!response.ok) throw new Error(`Museum antwortet mit ${response.status}.`);
        return response.json();
      };
      try {
        if (!ids.length || clock() - fetchedAt > 3_600_000) {
          const params = new URLSearchParams({ q: choose(themes, rng), hasImages: 'true', limit: '30' });
          const payload = await get(`${base}/v1.1/search?${params}`);
          if (!Array.isArray(payload.objectIDs)) throw new Error('In diesem Fenster liegt gerade kein Werk.');
          ids = payload.objectIDs.filter(Number.isSafeInteger).filter(id => !seen.has(`met-${id}`));
          fetchedAt = clock();
        }
        // Bounded requests, no background crawling. Only confirmed Open Access images.
        for (let attempt = 0; attempt < 3 && ids.length; attempt++) {
          const id = choose(ids, rng); ids = ids.filter(x => x !== id);
          const x = await get(`${base}/v1/objects/${id}`);
          const image = safeImage(x.primaryImageSmall || x.primaryImage);
          if (x.isPublicDomain !== true || !image || typeof x.title !== 'string') continue;
          const url = safeUrl(x.objectURL) || `https://www.metmuseum.org/art/collection/search/${id}`;
          const piece = { id: `met-${id}`, category: 'versinken', kind: 'fact', live: true,
            title: x.title.slice(0, 240), teaser: 'Ein Werk aus der offenen Sammlung des Metropolitan Museum.',
            body: [`${String(x.artistDisplayName || x.culture || 'Urheberschaft im Katalog nicht angegeben').slice(0, 500)} · ${String(x.objectDate || 'ohne Datierung').slice(0, 150)}.`, String(x.medium || 'Materialangabe siehe Museumskatalog.').slice(0, 400), 'Live übernommene Katalogmetadaten, nicht einzeln redaktionell geprüft. Das Museum kennzeichnet dieses Bild als Public Domain / Open Access. Die Angaben und Zuschreibungen können sich ändern.'],
            tags: ['Kunst', 'Museum'], sources: [{ label: 'The Metropolitan Museum of Art · Sammlung', url }],
            image: { src: image, credit: `${String(x.creditLine || 'The Metropolitan Museum of Art').slice(0, 650)} · The Met · CC0 Open Access`, url: 'https://www.metmuseum.org/hubs/open-access' },
            media: { label: 'Im Museum betrachten', url }
          };
          if (validPiece(piece)) return piece;
        }
        throw new Error('In diesem Fenster liegt gerade kein neues, freigegebenes Werk.');
      } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
    },
    reset() { ids = []; fetchedAt = 0; }
  };
}
