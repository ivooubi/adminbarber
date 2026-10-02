/* Service worker de FADE. staff — recibe y muestra las notificaciones push */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'FADE. · Nueva cita';
  const options = {
    body: data.body || 'Se ha reservado una nueva cita.',
    icon: data.icon || 'icon-192.png',
    badge: data.badge || 'icon-192.png',
    data: { url: data.url || null },
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // self.registration.scope es la carpeta donde está instalado este service worker
  // (la raíz de tu sitio en GitHub Pages), así que siempre existe, sin depender
  // de si el panel se llama admin.html, index.html o cualquier otro nombre.
  const destino = (event.notification.data && event.notification.data.url) || self.registration.scope;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(destino);
      }
    })
  );
});
