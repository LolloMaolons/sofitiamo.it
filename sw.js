const CACHE_NAME = 'sofitiamo-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/photos.js',
    '/translations.js',
    '/auth.js'
];

// Cache risorse al primo caricamento
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Serve da cache quando possibile
self.addEventListener('fetch', event => {
    if (event.request.url.includes('media-protection.php')) {
        // Cache immagini per 1 ora
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(fetchResponse => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
});