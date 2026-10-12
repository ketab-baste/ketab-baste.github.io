const CACHE = 'ketab-baste-v24';
const SHELL = ['./', 'index.html', 'styles.css', 'book.js', 'app.js', ...Array.from({ length: 15 }, (_, k) => `book/${k + 1}.md`), 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

// cache: 'reload' تا نسخهٔ تازه از خودِ سرور بیاید، نه از حافظهٔ مرورگر
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: answer from cache, refresh it in the background.
self.addEventListener('fetch', (e) => {
  // درخواست‌های حساب و همگام‌سازی هیچ‌وقت از حافظهٔ نهان جواب نمی‌گیرند
  if (e.request.method !== 'GET' || /^(firestore|identitytoolkit|securetoken)\./.test(new URL(e.request.url).hostname)) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      const fresh = fetch(e.request)
        .then((res) => {
          if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => (list[0] ? list[0].focus() : self.clients.openWindow('./')))
  );
});
