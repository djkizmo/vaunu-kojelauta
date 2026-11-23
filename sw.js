// Tallentaa sivun puhelimeen, jotta se aukeaa myös ilman nettiä.
// Verkko ensin (ohittaa selaimen välimuistin), tallennettu kopio varalla.
const CACHE = "vaunu-v3";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const key = url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname;
  e.respondWith(
    fetch(url.pathname, { cache: "no-store" }).then(r => {
      if (r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
      return r;
    }).catch(() => caches.open(CACHE).then(c => c.match(key)))
  );
});
