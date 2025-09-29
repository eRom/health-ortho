const CACHE_NAME = 'mpr-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.js',
  '/shared/css/variables.css',
  '/shared/css/layout.css',
  '/shared/css/components.css',
  '/shared/css/accessibility.css',
  '/shared/js/utils.js',
  '/shared/js/components.js',
  '/shared/js/storage.js',
  '/shared/js/analytics.js',
  '/shared/js/sw-register.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => cached || caches.match('/offline.html'));
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

