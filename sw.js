// Offline cache for the static planner. Cache-first: serve from cache, fall back
// to network. Bump CACHE (semver) on every requested change so old caches are
// purged and clients pick up the new assets — see CLAUDE.md.
// ponytail: precache the whole app — it's 5 files, no need for runtime caching.
const CACHE = "planner-v1.0.0";
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
  // No skipWaiting: a new SW stays "waiting" so the page can prompt the user
  // before it takes over (see the update banner in index.html).
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

// Page posts this when the user accepts the update; then we activate.
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
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
