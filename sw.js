// Offline cache for the static planner. Cache-first: serve from cache, fall back
// to network. Bump CACHE when any listed asset changes (old caches are purged).
// ponytail: precache the whole app — it's 5 files, no need for runtime caching.
const CACHE = "planner-v2";
const ASSETS = [
  ".",
  "index.html",
  "app.js",
  "solver.js",
  "logic-solver.bundle.js",
  "catalog.json",
  "manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      // cache same-origin GETs we didn't precache (none expected, but cheap insurance)
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
