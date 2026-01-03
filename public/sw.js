// Install event — only precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("medifast-static-v1").then((cache) => {
      return cache.addAll([
        "/",          // entry point
        "/index.html" // fallback for SPA routing
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event — cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== "medifast-static-v1")
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event — network first for everything
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Never cache Supabase or API calls
  if (request.url.includes("supabase")) {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((res) => res))
  );
});
