const CACHE_NAME = "syncnote-cache-v2"; // Updated version for cache refresh

// Static files to cache (public assets only)
const FILES_TO_CACHE = [
  "/", // Main page
  "/index.html",
  "/manifest.json",
  "/service-worker.js", // Service worker itself
  "/assets/icon-192x192.png",
  "/assets/icon-512x512.png",
  "/assets/icon-regular.png",
  "/assets/check-solid.svg",
  "/assets/trash-can-regular.svg",
  "/assets/user-regular.svg",
];

/**
 * Install event - Cache static assets
 */
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("[Service Worker] Caching static files...");
      try {
        await cache.addAll(FILES_TO_CACHE);

        // Dynamically cache all hashed files in /assets/
        const response = await fetch("/");
        const htmlText = await response.text();
        const assetFiles = [
          ...htmlText.matchAll(/\/assets\/[a-zA-Z0-9-_.]+/g),
        ].map((m) => m[0]);

        console.log(
          "[Service Worker] Caching dynamic asset files:",
          assetFiles
        );
        await cache.addAll(assetFiles);
      } catch (error) {
        console.error("[Service Worker] Error caching files:", error);
      }
    })
  );

  self.skipWaiting(); // Immediately activate new service worker
});

/**
 * Activate event - Clean old caches
 */
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then(async (cacheNames) => {
        console.log("[Service Worker] Existing caches:", cacheNames);

        const cachesToDelete = cacheNames.filter((key) => key !== CACHE_NAME);

        console.log("[Service Worker] Caches to delete:", cachesToDelete);

        await Promise.all(cachesToDelete.map((key) => caches.delete(key)));

        console.log("[Service Worker] Old caches removed.");
      })
      .then(() => self.clients.claim()) // Take control of all pages
  );
});

/**
 * Fetch event - Serve from cache first, then update
 */
self.addEventListener("fetch", (event) => {
  // Bypass caching for API calls
  if (event.request.url.includes("/api/" || event.request.method !== "GET")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return cachedResponse;
      }

      console.log("[Service Worker] Fetching from network:", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || !networkResponse.ok) {
            console.error(
              "[Service Worker] Failed network request:",
              event.request.url
            );
            return networkResponse;
          }

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch((error) => {
          console.error(
            "[Service Worker] Fetch failed:",
            event.request.url,
            error
          );
        });
    })
  );
});
