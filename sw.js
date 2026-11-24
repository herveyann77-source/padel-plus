/* Padel+ — service worker n°705
   Réseau d'abord (toujours la dernière version), copie de secours pour marcher sans réseau. */
const CACHE = "padelplus-705";
const CORE = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase, CDN… : on ne touche pas
  /* n°703 : réseau d'abord, mais si le réseau ne répond pas en 3 s (4G faible au club),
     on ouvre tout de suite la copie gardée sur l'iPad ; la nouvelle version se range quand même pour la fois suivante. */
  const net = fetch(req, { cache: "no-store" }).then(res => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  });
  const local = () => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("./index.html") : undefined));
  e.waitUntil(net.catch(() => {}));
  e.respondWith(new Promise(resolve => {
    let done = false;
    const give = r => { if (!done && r) { done = true; resolve(r); } };
    const t = setTimeout(() => local().then(r => give(r)), 3000);
    net.then(r => { clearTimeout(t); give(r); })
       .catch(() => { clearTimeout(t); local().then(r => r ? give(r) : (done = true, resolve(Response.error()))); });
  }));
});

/* n°673 : notifications Padel+ Joueur (« C'est à toi ! », rappel de la veille) */
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: "Padel+", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Padel+", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag || "padelplus",
    renotify: true, vibrate: [200, 100, 200], data: { url: d.url || "./moi.html" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./moi.html";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(L => {
    for (const c of L) if (c.url.indexOf("moi.html") >= 0 || c.url.indexOf("joueur.html") >= 0) return c.focus();
    return clients.openWindow(url);
  }));
});
