//Estrategia de cache

/*
    5- Cache & network race
    en esta estrategia el fetch y el cache tratan de resolverse primero para mostrar los recursos
    con esta estratgia se peuden evaluar diferentes situaciones cunado el fetch y el cache fallen
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
                '/img/no-img.jpg',
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

    const response = new Promise((resolve, reject) => {

        //se guarda en la variable si ya ha fallado en cargar el recurso
        let rejected = false;

        //la funion evalua si ya ha fallado en la carga del recurso
        const fallBackReject = () => {
            if (rejected ) {

                //realiza una evaluacion de que recurso fallo, si es una imagen regresa del cache una imagen por defecto
                if(/\.(png|jpg)$/i.test(e.request.url)) resolve( caches.match('/img/no-img.jpg'));
                else reject('Not found');
            }
            else rejected  = true;
        }

        //el fetch trata de recuperar el recurso desde la red
        fetch(e.request)
            .then(res => {
                res.ok ? resolve(res) : fallBackReject();
            })
            .catch(fallBackReject)

        //el cache trata de recuperar el recurso
        caches.match(e.request)
            .then(res => {
                res ? resolve(res) : fallBackReject();
            })
            .catch(fallBackReject)

    });


    e.respondWith(response);
});