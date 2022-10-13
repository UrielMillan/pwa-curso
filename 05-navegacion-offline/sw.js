// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME = 'static-v4';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

//Esta funcion se encarga de eliminar un numero determinado de elemntos en el cache, es una funcion recursiva
function clearCache(cacheName, numItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(keys => {
                if(keys.length > numItems){
                    cache.delete(keys[0]).then(clearCache(cacheName, numItems));
                }
            });
        });
}

self.addEventListener('install', e => {


    const cacheProm = caches.open(CACHE_STATIC_NAME)
        .then(cache => {

            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
                '/img/no-img.jpg',
                '/pages/offline.html'
            ]);


        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

    e.waitUntil(Promise.all([cacheProm, cacheInmutable]));
});


self.addEventListener('activate', e => {
    const response = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(key !== CACHE_STATIC_NAME && key.includes('static')){
                    return caches.delete(key);
                }
            })
        });

    e.waitUntil(response);
});


self.addEventListener('fetch', e => {

    //Busca en el cache los archivos
    const respond = caches.match(e.request)
        .then(res => {

            //si los encuentra los regresa
            if(res) return res;

            //si no los encuentra los busca en el servidor y regresa la respuesta
            return fetch(e.request)
                .then(response => {

                    //antes de regresar la respuesta actualiza el cache ingresando los archivos
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then(cache => {
                            cache.put(e.request, response);
                            clearCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT)
                        })

                    //se clona la respuesta del fetch y se retorna
                    return response.clone();
                })
                .catch(err => {
                    if(e.request.headers.get('accept').includes('text/html')){
                        return caches.match('/pages/offline.html');
                    }
                });
        })

    e.respondWith(respond);
});
