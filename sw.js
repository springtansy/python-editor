const CACHE_NAME = 'springtansy/python-editor';
const CDN_CACHE_NAME = 'springtansy/pyodide-cdn-v1';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './problems.js',
  './translations.js'
];

const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/';
const PYODIDE_ASSETS = [
  PYODIDE_BASE + 'pyodide.js',
  PYODIDE_BASE + 'pyodide.asm.js',
  PYODIDE_BASE + 'pyodide.asm.wasm',
  PYODIDE_BASE + 'python_stdlib.zip',
  PYODIDE_BASE + 'pyodide-lock.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)),
      caches.open(CDN_CACHE_NAME).then((cache) => 
        cache.addAll(PYODIDE_ASSETS).catch((err) => {
          console.warn('Pre-caching some CDN files failed, will fallback to dynamic caching:', err);
        })
      )
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== CDN_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CDN_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
