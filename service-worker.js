self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("customlowzzz-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./detail.html",
        "./style.css",
        "./js/script.js",
        "./js/detail.js",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
