// Padel+ : fonctionne aussi sans connexion (au club, sans wifi).
// Ouverture instantanée depuis la copie de l'appareil ; chaque nouvelle version (VERSION ci-dessous) s'installe en arrière-plan puis l'appli se recharge seule. Tes données ne sont jamais touchées ici.
const VERSION = "padel-plus-v489";
const FILES = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable.png"];
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
  if (/\/(confirmer|stats|score|live)\.html$/.test(u.pathname)) return;
  // Le reste : la copie gardée sur l'appareil s'ouvre tout de suite (même sans réseau ou avec un Wi-Fi faible),
  // et la version en ligne est rechargée en arrière-plan pour la prochaine ouverture.
  const net = () => withTimeout(fetch(req, { cache: "no-store" }), 15000)
    .then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; });
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(m => {
      if (m) { e.waitUntil(net().catch(() => {})); return m; }
      return net().catch(() => (req.mode === "navigate" ? caches.match("index.html") : Response.error()));
    })
  );
});
