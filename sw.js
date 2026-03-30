const CACHE_NAME = 'grocery-pro-v1';
const ASSETS = [
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/data/categories.js',
  '/js/data/products.js',
  '/js/data/stores.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (res.status === 200 && e.request.method === 'GET') {
      const cl = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, cl));
    }
    return res;
  }).catch(() => caches.match('/index.html'))));
});
