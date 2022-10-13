

// Detectar si podemos usar Service Workers
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {

            /*
            setTimeout(() => {
                reg.sync.register('Posteo');
                console.log('se enviaron los post');
            }, 3000)
            */


            //Con esta funcion le pregunta al usuario si quiere recibir notificaciones y manda notificaciones
            Notification.requestPermission()
                .then(result => {
                    console.log(result);
                    reg.showNotification('Hola mundo');
                })

        })


}


/*
fetch("https://reqres.in/api/users")
    .then(resp => resp.text())
    .then(console.log);
*/