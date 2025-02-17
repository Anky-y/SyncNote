// Name your cache (update the version as needed)
const CACHE_NAME = "syncnote-cache-v1";

// List of URLs to cache
const FILES_TO_CACHE = [
  "/", // root (index.html)
  "/index.html", // main HTML file
  "/manifest.json", // web app manifest (create if not present)
  "/src/Pages/Main.jsx",
  "/src/index.jsx", // main entry point for your app
  "/src/assets/favicon.ico", // favicon used in index.html
  "/src/assets/icon-192x192.jpg", // icon used in index.html
  "/src/assets/icon-512x512.png", // icon used in index.html
  "/src/assets/icon-regular.png",
  "/service-worker.js",
  "/src/assets/check-solid.svg",
  "/src/assets/trash-can-regular.svg",
  "/src/assets/user-regular.svg",
  "/src/Components/confirmationModal.jsx",
  "/src/Components/Navbar.jsx",
  "/src/Components/Notecard.jsx",
  "/src/Database/localStorage.js",
  "/src/Database/noteStorage.js",
  "/src/Database/syncStorage.js",
  "/src/Database/userStorage.js",
  "/src/Pages/CreateNote.jsx",
  "/src/Pages/Login.jsx",
  "/src/Pages/register.jsx",
  "/src/Pages/UpdateNote.jsx",
  "/src/App.jsx",
  "/src/App.module.css",
  "/src/index.css",
  "/src/logo.svg",
];

// Install event: pre-cache app shell resources
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...", event);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline resources");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...", event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // // Ignore Vite's timestamped requests (prevent caching issues)
  // if (request.url.includes("?t=")) {
  //   return;
  // }

  // Define URLs or patterns for API calls that should not be cached
  const isApiRequest = request.url.includes("/api/");

  // Network-first strategy for JavaScript files (to prevent outdated imports)
  if (request.destination === "script" || request.destination === "worker") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (isApiRequest) {
    // For API requests, use network-first strategy
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({ error: "No internet connection" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        })
    );
  } else {
    // For static assets, use cache-first strategy
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
  }
});
