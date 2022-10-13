//Estrategia de cache

/*
    3- Network with cache fallback
    Esta estrategia consulta primeramente la red y si encuentra el recurso lo almacena en cache, de esa manera siempre tendremos el recurso actualizado.
    El problema con esta estrategia es su lentitud, esto se puede ver en dispositivos con conexion lenta a internet, otro problema sucede con los dispositivos
    mobiles, por que estos siempre estan tratando de actualizar el contenido mas reciente
*/

const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DINAMIC_NAME = 'dinamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

//funcion recursiva para eliminar el cache
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

self.addEventListener('fetch', e => {

    // se consulta el recurso desde la red, si responde con 404 trata de recupearlo desde el cache
    const response = fetch(e.request)
        .then(res => {
            
            if(!res.ok) return caches.match(e.request);

            //Si el recurso se encontro este se almacena en el cache
            caches.open(CACHE_DINAMIC_NAME)
            .then(cache => {
                cache.put(e.request, res);
                clearCache(CACHE_DINAMIC_NAME, 50);
            });

            //se clona la respuesta y se retorna
            return res.clone();
        })
        //si el fetch response con un error se trata de buscar el recurso en el cache
        .catch(err => caches.match(e.request));

    e.respondWith(response);
});