//Estrategias en el uso del cache
/*
    2: Cache with network fallback esta estrategia busca los archivos del cache y si falla los busca en el servidor
    un problema de esta estrategia es que mezcla el app shell con recursos dinamicos
*/

const CACHE_NAME = 'cache-1';

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
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(e.request, response)
                        })

                    //se clona la respuesta del fetch y se retorna
                    return response.clone();
                })
        })

    e.respondWith(respond);
});

