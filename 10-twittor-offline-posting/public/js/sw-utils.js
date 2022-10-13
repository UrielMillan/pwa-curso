

// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {


    if (res.ok) {

        return caches.open(dynamicCache).then(cache => {

            cache.put(req, res.clone());

            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {


    if (APP_SHELL_INMUTABLE.includes(req.url)) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch(req)
            .then(res => {
                return actualizaCacheDinamico(staticCache, req, res);
            });
    }



}

//Network with cache fallback
function manejoApiMensajes(dynamic, request) {

    if (request.clone().method === 'POST') {

        if (self.registration.sync) {
            return request.clone().text().then(body => {
                const bodyOBJ = JSON.parse(body);
                return guardarMensaje(bodyOBJ)
            });
        }else{
             return fetch(request); 
        }
    }
    else {
        return fetch(request)
            .then(res => {
                if (res.ok) {
                    actualizaCacheDinamico(dynamic, request, res.clone());
                    return res.clone();
                } else {
                    return caches.match(request)
                }

            })
            .catch(caches.match(request))
    }
}

