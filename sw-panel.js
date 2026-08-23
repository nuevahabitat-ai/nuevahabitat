/* Service Worker — Panel cliente NuevaHabitat (cache shell + notificaciones) */
const CACHE = 'nh-panel-v1';
const SHELL = [
  '/panel',
  '/panel.html',
  '/css/styles.css',
  '/js/supabase.js',
  '/js/panel-pwa.js',
  '/imagenes/Logo/logosinfondo2.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/panel') && !url.pathname.endsWith('.css') && !url.pathname.endsWith('.js')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'NuevaHabitat', body: 'Tienes una actualización en tu panel', url: '/panel' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (_) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/imagenes/Logo/logosinfondo2.png',
      badge: '/imagenes/Logo/logosinfondo2.png',
      data: { url: data.url || '/panel' },
      tag: data.tag || 'nh-panel',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/panel';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes('/panel') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, url, tag } = event.data.payload || {};
    event.waitUntil(
      self.registration.showNotification(title || 'NuevaHabitat', {
        body: body || '',
        icon: '/imagenes/Logo/logosinfondo2.png',
        data: { url: url || '/panel' },
        tag: tag || 'nh-local',
      })
    );
  }
});
