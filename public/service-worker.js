const CACHE_NAME = "syncnote-cache-v1"; // Update version when making changes

// List of files to cache
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

  // CSS & JS files
  "/index.css",
  "/App.module.css",
  "/index.js",
  "/App.js",
];

/**
 * Install event - Cache all files
 */
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching files...");
      return cache.addAll(FILES_TO_CACHE);
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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); // Take control of all open pages
});

/**
 * Fetch event - Serve from cache first, then update
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return cachedResponse;
      }

      console.log("[Service Worker] Fetching from network:", event.request.url);
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Cache new files for future use (except API calls)
          if (!event.request.url.includes("/api/")) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
