/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !cacheName.startsWith("workbox-precache"))
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  );
});

export {};
