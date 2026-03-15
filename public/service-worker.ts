/// <reference lib="webworker" />

const CACHE_NAME = 'mathsolver-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

/**
 * Service Worker for offline support
 * Caches app shell and recent solutions
 */

(self as any).addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  (self as any).skipWaiting();
});

(self as any).addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  (self as any).clients.claim();
});

(self as any).addEventListener('fetch', (event: any) => {
  const { request } = event as any;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For API requests, use network-first strategy
  if (request.url.includes('/api/') || request.url.includes('firebase')) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          // Cache successful responses
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          // Return cached version on network error
          const cached = await caches.match(request);
          if (cached) return cached;
          throw error;
        }
      })()
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      } catch (error) {
        // Return offline message
        return new Response('Offline - Page not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      }
    })()
  );
});


