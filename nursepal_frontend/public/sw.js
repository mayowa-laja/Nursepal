const cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/favicon.ico',
                '/logo192.png',
                '/static/js/bundle.js',
                '/manifest.json',
                '/',
                '/login',
                '/logout',
                '/patients'
            ])
        })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Check if the browser is offline
        if (!navigator.onLine) {
          return response; // Respond with the cached version
        }
  
        // If online, try to fetch the resource from the network
        return fetch(event.request).then((fetchResponse) => {
          // Update the cache with the fetched resource
          return caches.open(cacheData).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(() => {
          // If fetching from the network fails, return the cached version
          return response || new Response(null, { status: 404, statusText: 'Not found' });
        });
      })
    );
  });