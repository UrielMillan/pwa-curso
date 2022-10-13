

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

//Valida si el navegagar tiene soporte para cache
//Todas las funciones de cache retornan promesas
if (window.caches){

    //con open trata de abriri el archivo de cache y si no existe lo crea
    caches.open('prueba-1');
    caches.open('prueba-2');

    //con has revisa si un archivo de cache existe, retorna true si esta y false si no
    caches.has('prueba-2')
        .then(console.log);

    caches.has('prueba-3')
        .then(console.log);

    //con delete elimina un archivo de cache
    caches.delete('prueba-1')
        .then(console.log);

    //abrir un archivo de cache y editar los archivos que contendra
    caches.open('cache-v1.1')
        .then(cache => {

            //con cache.add agregas un archivo al cache
            //cache.add('/index.html');

            //con cache.addAll agrega una lista de archivos proprocionados en un array
            //podemos eliminar archivos fuera de el retorno de promesa del add, pero eliminar es
            //un proceso lento no se alcanza a ver en el cache, por eso se elimina cuando la promesa de agregar se resuelve
            cache.addAll([
                '/index.html',
                '/css/style.css',
                '/img/main.jpg'
            ])
                .then(() => {
                    //elimina un archivo en especifico del cache
                    cache.delete('/css/style.css');

                    //con put podemos reemplazar archivos del cache
                    cache.put('index.html', new Response('Nuevo mundo'));
                });

            cache.match('/index.html')
                .then(res => res.text())
                .then(console.log)

        });
    
    //retorna un arreglo con las llaves de todos los caches
    caches.keys()
        .then(console.log)
}