// Skip waiting - activate new SW immediately
// self.addEventListener("install", (event) => {
//   console.log("[Service Worker] Installing...");
//   event.waitUntil(self.skipWaiting());
// });

// self.addEventListener("activate", (event) => {
//   console.log("[Service Worker] Activating...");
//   event.waitUntil(self.clients.claim());
// });

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received!', event);

  try {
    const data = event.data.json();
    console.log('[Service Worker] Push data:', data);

    const title = data.title || 'Notification';
    const body = data.body || '';
    const icon = data.icon || '';
    const url = data.data?.url || '/';

    const uniqueTag = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const notificationOptions = {
      body: body,
      tag: uniqueTag,
      icon: icon,
      badge: icon,
      data: {
        url: url,
      },
      requireInteraction: true,
    };

    console.log(
      '[Service Worker] Showing notification with options:',
      notificationOptions,
    );

    event.waitUntil(
      self.registration
        .showNotification(title, notificationOptions)
        .then(() => {
          console.log('[Service Worker] ✅ Notification shown successfully!');
        })
        .catch((err) => {
          console.error('[Service Worker] ❌ Error showing notification:', err);
        }),
    );
  } catch (error) {
    console.error('[Service Worker] ❌ Error parsing push data:', error);
    // Fallback: show generic notification
    if (event.data) {
      const text = event.data.text();
      console.log('[Service Worker] Push text (fallback):', text);
      const uniqueTag = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      event.waitUntil(
        self.registration.showNotification('Notification', {
          body: text,
          icon: '',
          tag: uniqueTag,
        }),
      );
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked!', event);

  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Cari jika ada window yang sudah terbuka
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak ada, buka window baru
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
