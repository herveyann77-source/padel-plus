/* Padel+ · mode hors ligne · version 511
   Toujours chercher la version la plus récente sur le réseau ;
   la copie gardée en mémoire ne sert que sans connexion. */
const VERSION = "padel-511";
const BASE = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.all(BASE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-store" })
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(r, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === "navigate" ? caches.match("index.html") : undefined))
      )
  );
});
