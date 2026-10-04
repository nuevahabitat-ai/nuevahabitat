/* Service Worker — Web pública NuevaHabitat (clientes) */
const CACHE = 'nh-web-v5';
const SHELL = [
  '/',
  '/index.html',
  '/login',
  '/login.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/nh-pwa-install.js',
  '/imagenes/Logo/logosinfondo2.png',
];

/** Auth, registro y panel: siempre red primero (evita UI antigua en caché) */
const NETWORK_FIRST = [
  /^\/registro(\.html)?$/,
  /^\/login(\.html)?$/,
  /^\/acceso-alquileres(\.html)?$/,
  /^\/acceso-alquiler-integral(\.html)?$/,
  /^\/confirmar-cuenta(\.html)?$/,
  /^\/panel(\.html)?$/,
  /^\/panel-propietario(\.html)?$/,
  /^\/panel(\.html)?$/,
  /^\/js\/supabase\.js$/,
  /^\/js\/panel-cliente-docs\.js$/,
  /^\/js\/panel-pwa\.js$/,
  /^\/js\/panel-propietario/,
  /^\/js\/panel-cliente-docs\.js$/,
];

function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some((re) => re.test(pathname));
}

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
  if (url.origin !== self.location.origin) return;

  if (isNetworkFirst(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && !isNetworkFirst(url.pathname)) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
