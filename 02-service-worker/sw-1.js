/*
    Para hacer referencia al service worker se usa la palabra reservada self, que es lo mismo que usar this.
    Con sw podemos agregar acciones a los eventos, recordemos que el sw es un proxy que puede interceptar peticiones
*/

//Interceptamos el evento fetch con el sw
self.addEventListener('fetch', evt => {
    /*
        //Interceptamos la peticion de fetch donde la url incluya los estilos de css,
        if (evt.request.url.includes('style.css')) {

            //Con responseWith podemos regresar peticiones 
            evt.respondWith(null);
        }

        if(evt.request.url.includes('.jpg')){
            //fetch pude realizar peticiones utilizando la url o tambien usando el request de la peticion
            //const image = fetch('img/main.jpg');
            //const image =  fetch(evt.request.url);
            const image =  fetch(evt.request);
            evt.respondWith(image)
        }
    */

    /*    
        if(evt.request.url.includes('style.css')){
            const respond = new Response(`
                body{
                    background-color: red !important;
                    color: pink;
                }
            `,{
                headers:{
                    'Content-Type': 'text/css'
                }
            });

            evt.respondWith(respond);
        }

        evt.respondWith(fetch(evt.request));
    */
    
    /*
        if (evt.request.url.includes('.jpg')) {
            const image = fetch('img/main-patas-arriba.jpg');
            evt.respondWith(image)
        }
    */
});