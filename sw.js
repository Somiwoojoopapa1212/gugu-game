const CACHE = 'gugu-v2';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Firebase, CDN 등 외부 요청은 서비스 워커가 처리하지 않음
  if (new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) {
          const cloned = res.clone(); // 비동기 시작 전에 즉시 복제
          caches.open(CACHE).then(c => c.put(e.request, cloned));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
