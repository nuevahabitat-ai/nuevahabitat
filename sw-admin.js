/* Service Worker — Panel Admin NuevaHabitat (network-first para JS/HTML actualizado) */
const CACHE = 'nh-admin-v3';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isAdmin = url.pathname.startsWith('/admin-panel') || url.pathname === '/sw-admin.js';
  if (!isAdmin) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/admin-panel.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes('/admin-panel') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'SHOW_NOTIFICATION') return;
  const { title, body, url, tag } = event.data.payload || {};
  event.waitUntil(
    self.registration.showNotification(title || 'NuevaHabitat Admin', {
      body: body || '',
      icon: '/imagenes/Logo/logosinfondo2.png',
      badge: '/imagenes/Logo/logosinfondo2.png',
      data: { url: url || '/admin-panel.html' },
      tag: tag || 'nh-admin-lead',
      renotify: true,
    })
  );
});
