// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */

  // Store the files that we need to be cached in an array
   var urlsToCache = [
    './',
    './index.html',
    './assets/styles/main.css',
    './assets/scripts/main.js',
    './assets/scripts/Router.js',
    './assets/components/RecipeCard.js',
    './assets/components/RecipeExpand.js',
    './assets/images/icons/0-star.svg',
    './assets/images/icons/1-star.svg',
    './assets/images/icons/2-star.svg',
    './assets/images/icons/3-star.svg',
    './assets/images/icons/4-star.svg',
    './assets/images/icons/5-star.svg',
    './assets/images/icons/arrow-down.png',
    './favicon.ico'
  ];

  event.waitUntil(
    // Open the cache
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // Then pass in our array of files so that they can be added to the cache
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  
  // Allows the service worker to control the pages immediately after registration
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  event.respondWith(
    // When there is a request, we check if it matches with any file in our cache
    caches.match(event.request)
      .then(function(response) {
        // If there's a match, then we return the response from the cache
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if the response is valid
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because the browser will use up the response
            // and the cache
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});