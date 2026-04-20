const CACHE_NAME = "customlowzzz-v5";
const BASE = "/CarAudio";

const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/detail.html`,
  `${BASE}/style.css`,
  `${BASE}/js/script.js`,
  `${BASE}/js/detail.js`,
  `${BASE}/calculators.js`,
  `${BASE}/manifest.json`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`,
  `${BASE}/icons/splash-screen-1080x1920.png`
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// iOS-vriendelijke fetch strategie
self.addEventListener("fetch", event => {
  const req = event.request;

  // Alleen eigen origin behandelen
  if (new URL(req.url).origin !== self.location.origin) return;

  // Navigatie: network-first met offline fallback naar index.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(response => {
          // Succesvol netwerkantwoord → optioneel cachen
          return response;
        })
        .catch(() =>
          caches
            .match(`${BASE}/index.html`)
            .then(res => res || caches.match(`${BASE}/`))
        )
    );
    return;
  }

  // Overige requests: cache-first met network fallback
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).catch(() => cached);
    })
  );
});
