// Padel+ : fonctionne aussi sans connexion (au club, sans wifi).
// Connecté : la dernière version est toujours chargée tout de suite. Tes données ne sont jamais touchées ici.
const VERSION = "padel-plus-v406";
const FILES = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];
const XLSX_URL = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(async c => {
    await c.addAll(FILES.map(f => new Request(f, { cache: "reload" })));
    try { const r = await fetch(XLSX_URL, { mode: "cors" }); if (r.ok) await c.put(XLSX_URL, r); } catch (e) {}
  }).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("padel-plus") && !x.startsWith("padel-plus-test") && x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
const withTimeout = (p, ms) => new Promise((ok, ko) => { const t = setTimeout(() => ko(new Error("timeout")), ms); p.then(r => { clearTimeout(t); ok(r) }, er => { clearTimeout(t); ko(er) }) });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  // Bibliothèque Excel : gardée en mémoire pour l'import sans réseau
  if (u.href === XLSX_URL) {
    e.respondWith(caches.match(XLSX_URL).then(m => m || fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(XLSX_URL, cp)); return r })));
    return;
  }
  if (u.origin !== location.origin) return;
  if (u.pathname.includes("/test/")) return;
  // Pages des joueurs (confirmer, stats) : toujours en direct
  if (/\/(confirmer|stats)\.html$/.test(u.pathname)) return;
  // Le reste : d'abord Internet (version la plus récente, sans attendre le cache du navigateur), sinon la copie gardée
  e.respondWith(
    withTimeout(fetch(req, { cache: "no-store" }), 5000)
      .then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(m => m || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
