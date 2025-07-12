    const CACHE_NAME = 'love-counter-cache-v1';
    const urlsToCache = [
      '/Love%20Counter.html',
      '/manifest.json',
      '/sw.js', // Cache the service worker itself
      '/icon-192x192.png',
      '/icon-512x512.png',
      '/apple-touch-icon.png'
      // If you add any other separate CSS files, JavaScript files, or images later,
      // you'll need to list their paths here too.
    ];

    // When the "app" is first installed/loaded
    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache); // Save all these files for offline use
          })
      );
    });

    // When the "app" tries to get something (like a page or image)
    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request) // Check if it's in our saved (cached) files
          .then(response => {
            if (response) {
              return response; // If found, use the saved version (faster!)
            }
            return fetch(event.request); // Otherwise, go get it from the internet
          })
      );
    });

    // When a new version of the "app" is available
    self.addEventListener('activate', event => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName); // Remove old saved files
              }
            })
          );
        })
      );
    });
    