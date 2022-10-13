
let
    url = window.location.href,
    swLocation = '/twittor/sw.js',
    swReg;


if (navigator.serviceWorker) {


    //verifica que el proyecto se esta ejecutando en local, y si lo esta busca el archivo sw en la raiz del proyecto
    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    }

    //Se agrega el evento load
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swLocation).then(reg => {
            //guarda una referencia de sw
            swReg = reg;

            //Verifica si la pagina tiene suscripciones, si retorna null no exite ninguna
            swReg.pushManager.getSubscription().then(verificarSuscripcion)
        });
    })
}





// Referencias de jQuery

var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn(ingreso) {

    if (ingreso) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');

    }

}


// Seleccion de personaje
avatarBtns.on('click', function () {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function () {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {

    modal.removeClass('oculto');
    modal.animate({
        marginTop: '-=1000px',
        opacity: 1
    }, 200);

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
    if (!modal.hasClass('oculto')) {
        modal.animate({
            marginTop: '+=1000px',
            opacity: 0
        }, 200, function () {
            modal.addClass('oculto');
            txtMensaje.val('');
        });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    var data = {
        mensaje: mensaje,
        user: usuario
    };


    fetch('api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => console.log('app.js', res))
        .catch(err => console.log('app.js error:', err));



    crearMensajeHTML(mensaje, usuario);

});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('api')
        .then(res => res.json())
        .then(posts => {

            console.log(posts);
            posts.forEach(post =>
                crearMensajeHTML(post.mensaje, post.user));


        });


}

getMensajes();



// Detectar cambios de conexión
function isOnline() {

    if (navigator.onLine) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else {
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

isOnline();

function verificarSuscripcion(activadas) {
    if (activadas) {
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');
    }
    else {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }
}

//funcion que envia las notificaciones
function enviarNotification() {
    const opt = {
        body: 'Este es el cuerpo de la notificación',
        icon: 'img/icons/icon-72x72.png'
    }

    new Notification('Hola Mundo', opt)
}

//notificaciones
function notificarme() {

    //Verifica si el navegador permite el uso de notificaciones
    //las notificaciones tienen 3 estados denied, default y granted

    if (!window.Notification) {
        console.log('Este navegador no soporta modificaciones');
        return;
    }

    //Si el usuario tiene permitidas las notificaciones se envia una notificacion
    if (Notification.permission == 'granted') {
        //new Notification('Hola mundo');
        enviarNotification()
    }

    //Se le pregunta al usuario si desea permitir las notificaciones y si las acepta envia una notificacion
    else if (Notification.permission !== 'denied' || Notification.permission == 'default') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') new enviarNotification();
        });
    }
}


//notificarme();

//get key, esta fincion se encarga de solicitar la llave publica de las notificaciones
//recordar que la llave publica esta codificada en base 64
function getPublicKey() {
    return fetch('api/key')
        //Convertimos la respuesta de la api en un array buffer
        .then(res => res.arrayBuffer())
        //y retornamos el arreglo pero como Uint8Arrary
        .then(key => new Uint8Array(key))
        .catch(console.error)
}


btnDesactivadas.on('click', () => {
    //Si no tiene instancia de SW, retorna un error
    if (!swReg) return console.log('No hay registro del SW');

    //Obtiene la llave publica y la registra para enviar notificaciones
    getPublicKey().then(key => {
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
            .then(res => res.toJSON())
            .then(suscription => {
                //console.log(suscription);

                //Registra la suscriocion en el backend
                fetch('api/suscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(suscription)
                })
                    .then(verificarSuscripcion)
                    .catch(console.error)
            })
    });

});

//funcion para cancelar las suscribcion
function cancelarSuscripcion(){

    //con la referencia al sw se obtiene la suscribcion
    swReg.pushManager.getSubscription()
        //cancela la suscribcion y se ejecuta la funcion de verificar suscribcion
        .then(subs => {
            subs.unsubscribe().then(() => verificarSuscripcion(false));
        })
}

btnActivadas.on('click', () => cancelarSuscripcion())