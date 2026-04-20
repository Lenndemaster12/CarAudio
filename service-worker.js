const CACHE_NAME = "customlowzzz-v4";
const BASE = "/CarAudio";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
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
      ]);
    })
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;

      return fetch(e.request).catch(() => {
        // iOS offline fallback
        if (e.request.mode === "navigate") {
          return caches.match(`${BASE}/index.html`);
        }
      });
    })
  );
});
