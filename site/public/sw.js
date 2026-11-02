// Sam Electronics service worker (R9 · PWA). Pages: network first, the last copy when offline. Images, fonts and built
// files: cache first. Never caches the API, the Control Room or sign-in.
const V = 'se-v2', CORE = ['/', '/shop', '/repair', '/manifest.webmanifest', '/icon-192.png', '/favicon.svg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return; const u = new URL(r.url);
  if (u.origin !== location.origin || /^\/(api|staff|account\/auth)/.test(u.pathname)) return;
  const asset = /^\/(_next\/static|assets|fonts|parts|icons|vendor)\//.test(u.pathname) || /\.(webp|png|jpg|svg|woff2|glb|json)$/.test(u.pathname);
  // built files have unique names: cache first. Images, fonts, data: show the cached copy, refresh it in the background
  // (stale-while-revalidate), so a re-rendered image with the same name appears on the next visit.
  if (/^\/_next\/static\//.test(u.pathname)) { e.respondWith(caches.open(V).then((c) => c.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; })))); return; }
  if (asset) { e.respondWith(caches.open(V).then((c) => c.match(r).then((hit) => { const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit); return hit || net; }))); return; }
  if (r.mode === 'navigate') e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r).then((hit) => hit || caches.match('/'))));
});
