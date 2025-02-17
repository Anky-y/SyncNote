importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js"
);

// Ensure Workbox is available before using its modules
if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.error("Workbox failed to load.");
}
// Define a cache name
const CACHE_NAME = "syncnote-cache-v1";

// Fetch Event: Serve cached assets when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          // Cache new requests if needed (optional)
          return response;
        })
      );
    })
  );
});

// Activate Event: Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
