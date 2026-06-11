self.addEventListener('install', (e) => {
  self.skipWaiting(); // Activar inmediatamente
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName); // Borrar todos los cachés
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediatamente
});

self.addEventListener('fetch', (e) => {
  // No interceptar nada, que todo vaya directo a la red
});
