/*
    Manejador de error 404 con fetch, el error 404 no se puede manejar cpon catch por que no un error como tal
    cuando interceptamos este error lo verificamos con la propiead ok
 */

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(resp => {
                if(resp.ok) return resp;
                else return fetch('img/main.jpg');
            })
    )
})