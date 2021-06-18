var CACHE_NAME = 'isay';
const OFFLINE_URL = 'offline.html';
var urlsToCache = [
  '/',
  './offline.html',
  './voice-search.ico',
  './static/media/login.a0d35425.png',
  
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      }).catch((error) => {
        console.log(`error: ${error.message}`);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // else{
        //   const {request} = event;
        //   let copy = fetch(request).then(res => res.clone());
        //   stashInCache(CACHE_NAME, request, copy);
        //   return fetch(request);
        // }
        return fetch(event.request);
      }
    ).catch(function(e){
      const {request} = event;
      return caches.match(request)
                    .then( response => response || caches.match(OFFLINE_URL) );
        // return caches.open(CACHE_NAME).then(function(cache){
        //     cache.match(OFFLINE_URL).then((result) => {
        //       console.log(result);
        //         return result;
        //     });
        // });
    })
  );
});

// self.addEventListener('fetch', (event) => {
//     // We only want to call event.respondWith() if this is a navigation request
//     // for an HTML page.
//     if (event.request.mode === 'navigate') {
//       event.respondWith((async () => {
//         try {
//           // First, try to use the navigation preload response if it's supported.
//           const preloadResponse = await event.preloadResponse;
//           if (preloadResponse) {
//             return preloadResponse;
//           }
  
//           const networkResponse = await fetch(event.request);
//           return networkResponse;
//         } catch (error) {
//           // catch is only triggered if an exception is thrown, which is likely
//           // due to a network error.
//           // If fetch() returns a valid HTTP response with a response code in
//           // the 4xx or 5xx range, the catch() will NOT be called.
//           console.log('Fetch failed; returning offline page instead.', error);
  
//           const cache = await caches.open(CACHE_NAME);
//           const cachedResponse = await cache.match(OFFLINE_URL);
//           return cachedResponse;
//         }
//       })());
//     }
  
//     // If our if() condition is false, then this fetch handler won't intercept the
//     // request. If there are any other fetch handlers registered, they will get a
//     // chance to call event.respondWith(). If no fetch handlers call
//     // event.respondWith(), the request will be handled by the browser as if there
//     // were no service worker involvement.
//   });

// Update a service worker
self.addEventListener('activate', event => {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});