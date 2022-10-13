const STATIC_CACHE = "static-v1";
const INMUTABLE_CACHE = "inmutable-v1";
const DYNAMIC_CACHE = "dynamic-v1";

function updateCache(dynamic, req, res) {
    if (res) {
        return caches.open(dynamic)
            .then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            });
    }
    else return res;
}

const APP_SHELL = [
    '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/app.js',
    'style/plain_sign_in_blue.png'
];

const APP_SHELL_INMUTABLE = [
    '//cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js'
];

self.addEventListener('install', e => {
    const saveStaticCache = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL))
        .catch(console.log('Error to save static cache'));

    const saveInmutableCache = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE))
        .catch(console.log('Error to to save inmutable cache'));

    const saveAll = Promise.all([saveStaticCache, saveInmutableCache]);

    e.waitUntil(saveAll);
});

self.addEventListener('fetch', e => {
    const response = caches.match(e.request)
        .then(res => {
            if (res) return res;
            return fetch(e.request)
                .then(fetchRes => updateCache(DYNAMIC_CACHE, e.request, fetchRes));
        });

    e.respondWith(response)
});
