//Cache dinamico

/*
    El cache dinamico es una optimiczacion del only cache y cache with networkfallback.
    Consta de 3 registros de cache:
    statico: donde se guarda el appshell necesario para la ejecucion de la aplicacion, el contenido de este cache puede acer varaciones debido al cambio
    inmutable: se almacenan librerias o dependencias externas que por lo general no sufren ningun cambio
    dianmico: se almacena todo el contenido dinamoco de la aplicacion, hay que tener encuenta que debido a la naturaleza de la aplicacion, si el contenido
    del cache statico o inmutable es eliminado este pasara al cache dinamico,
*/

const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DINAMIC_NAME = 'dinamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';


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

    //al igual que en cache with networkfallback, la aplicacion busca los archivos del appshell en el cache y si no los encuentra los busca en el servidor
    const respond = caches.match(e.request)
        .then(res => {
            if (res) return res;

            //busca los archivos del appshell en el servidor y guarda la respuesta en el cache dinamico
            return fetch(e.request)
                .then(reponse => {
                    caches.open(CACHE_DINAMIC_NAME)
                        .then(cache => {
                            cache.put(e.request, reponse);
                            clearCache(CACHE_DINAMIC_NAME, 4);
                        });
                    return reponse.clone();
                });
        });
    e.respondWith(respond);
})
