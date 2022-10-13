
// Ciclo de vida del SW

/*
    Evento de instalacion del service worker.
    El evento install se ejecuta cada que el sw sufre cambios
*/


self.addEventListener('install', evt => {

    //Descargar assets
    //Creamos cache
    console.log('SW: Instalando SW');

    const install = new Promise((resolve, reject) => {
        setTimeout(() => {

            setTimeout(() => {
                console.log('SW: Instalaciones terminadas');
                //Con esta funcion el sw se salta el proceso de espera de instalacion
                //Pero no es muy recomendado usarlo debido a temas de experiencia de usuario
                self.skipWaiting();
                resolve();
            }, 1000)

        })
    })

    //Esta funcion se espera hasta que la promesa se resuelva
    evt.waitUntil(install);
});


//Cuando el SW toma el contro, de la aplicacion
self.addEventListener('activate', evt => {

    //Borrar cache viejo
    console.log('SW: Activo y listo para controlar la app !!');
});

//Manejo de peticiones http
self.addEventListener('fetch', evt => {

    //aplicar estrategias del cache
    console.log('SW: ', evt.request.url);
    /*
    if(evt.request.url.includes("https://reqres.in/")){
        const response = new Response(`{ok:false, message:'intercepted'}`)
        evt.respondWith(response)
    }
    */
});


//Recuperamos la conexion a internet
self.addEventListener('sync', evt => {
    console.log('Tenemos conexion !');
    //console.log(evt);
    //este propiedad es lo que mas nos impora
    console.log(evt.tag);
});


//push: manejar las push notifations
self.addEventListener('push', evt => {
    console.log('Notificacion recibida');
});