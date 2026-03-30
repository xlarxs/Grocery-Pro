'use strict';

const CACHE_NAME = 'grocery-pro-v1';

const APP_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css',
  '/css/dark-mode.css',
  '/js/app.js',
  '/js/router.js',
  '/js/state.js',
  '/js/data/products.js',
  '/js/data/stores.js',
  '/js/data/categories.js',
  '/js/services/db.js',
  '/js/services/route-optimizer.js',
  '/js/services/budget-tracker.js',
  '/js/services/recommendations.js',
  '/js/components/shopping-list.js',
  '/js/components/store-browser.js',
  '/js/components/route-view.js',
  '/js/components/budget-view.js',
  '/icons/icon.svg'
];

// Install: pre-cache all app files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

// Activate: remove old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (e.g. analytics, external APIs)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache valid responses for future use
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests: serve index.html from cache
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Background sync: sync shopping list when connectivity is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'list-sync') {
    event.waitUntil(syncShoppingList());
  }
});

async function syncShoppingList() {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type: 'SYNC_COMPLETE', tag: 'list-sync' });
  });
}

// Push notifications: display received push messages
self.addEventListener('push', (event) => {
  let data = { title: 'Grocery Pro', body: 'Neue Benachrichtigung', icon: '/icons/icon.svg' };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon.svg',
    badge: '/icons/icon.svg',
    lang: 'de',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click: focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const target = new URL(targetUrl, self.location.origin);
      for (const client of clientList) {
        const clientURL = new URL(client.url);
        if (clientURL.origin === target.origin && clientURL.pathname === target.pathname && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
