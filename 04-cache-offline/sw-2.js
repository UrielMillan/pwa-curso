
//Estrategias en el uso del cache
/*
    1: cache only esta es usada cuando queremos que toda la aplicacion sea usada desde el cache, todos sus recursos estan en cache,
    Un problema de esta estrategia es que si no se actualizan los archivos cache estos, cuando el usuario quiera acceder a un recurso
    que no se encuentra en el cache, este se rompera
 */



//Almacenar el App shell de la aplicacion
/*
    El App shell son todos los recursos que se necestinan para que la app funcione,
    es importante tambien guardar el slash '/' de la aplicacion, por que hace referencia a la raiz
    y si no la indicamos en caso que el usuario entre mediante el dominio el cache no se guardara
*/ 

const CACHE_NAME = 'cache-1';


self.addEventListener('install', e => {
    const saveAppShell = caches.open(CACHE_NAME)
    .then(cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
            'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            '/js/app.js',
        ])
    });

    //usamos el waitUntil hasta que la promesa de saveAppShell se resuelva
    e.waitUntil(saveAppShell);
});

self.addEventListener('fetch', e => {
    //La aplicacion se sirve enteramente del cache alamcenado
    e.respondWith(caches.match(e.request))
});