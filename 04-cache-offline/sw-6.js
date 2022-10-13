//Estrategia de cache

/*
    4- Cache with network update, esta estrategia sirve los recursos desde el cache pero tambien los actualiza.
    Esta estrategia es recomendada cuando el rendimiento es critico, es cache es mas rapido que la red,
    algo importante a destacar es que el contenido del cache estara desactualizado en comparacion con el de la red, esto es asi
    por al hacer la respuesta siempre nos mostrara el cache antes de que este se actualice
*/

const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DINAMIC_NAME = 'dinamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

//funcion recursiva para eliminar el cache
function clearCache(cacheName, numItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(keys => {
                if (keys.length > numItems) {
                    cache.delete(keys[0]).then(clearCache(cacheName, numItems));
                }
            });
        });
}

self.addEventListener('install', e => {

    //Se guarda todo el appshell inicial dentro del cache statico
    const saveStaticCache = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js'
            ]);
        });

    //se guaradan las dependencias o librerias dentro del cache inmutable
    const saveInmutableCache = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => {
            cache.addAll([
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            ]);
        });


    //debido ambas promesas se ehecutan dentro de un promise all
    const saveAll = Promise.all([saveStaticCache, saveInmutableCache])

    //wait until espera la promesa que retorna el promise all
    e.waitUntil(saveAll);
});

self.addEventListener('fetch', e => {

    //validaomos que el recurso que se solicita no sea bootstrap
    if(e.request.url.includes('bootstrap')){
        return e.respondWith(caches.match(e.request));
    }

    //abrimos el cache para guardar el recurso actualizado
    const response = caches.open(CACHE_DINAMIC_NAME)
        .then(cache => {

            //actualizamos el recurso
            fetch(e.request).then(res => cache.put(e.request, res));

            //retornamos el contenido desde el cache, este estara desactualizado
            return cache.match(e.request);
        });
    e.respondWith(response);
})

