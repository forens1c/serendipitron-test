// Only same-origin, application-owned files. External media and APIs are excluded.
const PREFIX = `serendipitron:${new URL(self.registration.scope).pathname}:`;
const BUILD_ID = '0b9e9ecfe782';
const CACHE = `${PREFIX}v0.1.0-${BUILD_ID}`;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const manifest = await fetch(new URL('./data/offline-files.json', self.registration.scope), { cache: 'no-store' });
    if (!manifest.ok) throw new Error('Offline-Dateiliste fehlt');
    const files = await manifest.json();
    const cache = await caches.open(CACHE);
    await cache.addAll(files.map(file => new URL(file, self.registration.scope).href));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url), scope = new URL(self.registration.scope);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') {
      try { const response = await fetch(request); if (response.ok) return response; }
      catch { /* Cached entry point below. */ }
      return await cache.match(new URL('./index.html', self.registration.scope).href) || Response.error();
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try { return await fetch(request); } catch { return Response.error(); }
  })());
});
