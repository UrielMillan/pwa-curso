// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});





self.addEventListener('fetch', e => {

    let respuesta;

    if (e.request.url.includes('/api')) {

        // return respuesta????
        respuesta = manejoApiMensajes(DYNAMIC_CACHE, e.request);

    } else {

        respuesta = caches.match(e.request).then(res => {

            if (res) {

                actualizaCacheStatico(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
                return res;

            } else {

                return fetch(e.request).then(newRes => {

                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

                });

            }

        });

    }

    e.respondWith(respuesta);

});


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if (e.tag === 'nuevo-post') {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();

        e.waitUntil(respuesta);
    }



});

//Escuchar las push, notificaciones al naveagador
self.addEventListener('push', e => {

    const data = JSON.parse(e.data.text());
    const title = data.title;

    //Arma el cuerpo y acciones de la notificacion
    const opt = {
        body: data.body,
        icon: 'img/icons/icon-72x72.png',
        badge: 'img/favicon.ico',
        vibrate: [150, 150, 150, 150, 75, 75, 150, 150, 150, 150, 450],
        data: {
            url: '/',
            id: data.user
        },
        actions: [
            {
                action: 'thor-actions',
                title: 'thor',
                icon: 'img/avatar/thor.jpg'
            },
            {
                action: 'ironman-actions',
                title: 'ironman',
                icon: 'img/avatar/ironman.jpg'
            }
        ]
    };


    //El sigiente codigo hace referencia al registro del sw, y esta funcion se espera hasta que la notificacion
    //realize las tareas que tenga que realizar
    e.waitUntil(self.registration.showNotification(title, opt));
});


//Escuha el evento cuando se cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificacion cerrada', e);
});

//Escucha el evento cuando se hace click en la notificacion
self.addEventListener('notificationclick', e => {
    const { notification, action } = e;
    console.log('Notificacion', notification);
    console.log('Accion', action);

    //clients hace referencia a las tabs del navegador
    //Obtiene toda las tabs que el navegor tiene abiertas
    const response = clients.matchAll()
        .then(client => {
            //Busca entre todas las tabs aquella que este visible y que correspona a la app
            const visibleClient = client.find(el => el.visibilityState === 'visible');
            if (visibleClient) {
                //navega la aplicacion hasta la url
                visibleClient.navigate(notification.data.url);
                //le pasa el foco a la tab abierta
                visibleClient.focus();
            }
            else {
                //si no hay tabs con el estado de visible entonces crea una nueva pestaña 
                clients.openWindow(notification.data.url);
            }
            //La notificacion se cierra al  tocarla
           return notification.close();
        })

    //Espera hasta recibir una respuesta de la notificacion
    e.waitUntil(response);

});