const
    VAPID = require('./vapid.json'),
    urlSafeBase64 = require('urlsafe-base64'),
    fs = require('fs'),
    webpush = require('web-push');

let  suscriptions = require('./subs-db.json');



//Configuramos un correo valido ya las vapid keys para webpuhs
webpush.setVapidDetails(
    'mailto:pruebasprogsap@gmail.com',
    VAPID.publicKey,
    VAPID.privateKey
)
//Como recomendacion no retornar la llave publica sin decodificar, esto se hace de esa manea para mayor seguridad.
//Se utilizo la libreria de urlSafeBase64 para codifricar la key publica a base 64
module.exports.getKey = () => {
    return urlSafeBase64.decode(VAPID.publicKey);
}

//Guarda la suscripcion enviada por el navegador y la almacena en un arreglo de un archivo JSON
module.exports.addSubscription = (suscription) => {
    suscriptions.push(suscription);
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscriptions));
}

//Esta funcion se encarga de enviar la notificacion al dispositivo
//recorre el arreglo de subscripciones y las envia
//guarda las promesas en un arreglo
module.exports.sendPush = (post) => {
    const sentNotifications = [];

    const sendedNotification = suscriptions.forEach((subs, i) => {
        webpush.sendNotification(subs, JSON.stringify(post))
            .then(console.log('Notificacion enviada'))
            .catch(err => {
                //di ls notifcacion fall le agre una propiedad para eliminarla despues
                console.log('Notificacion falló');
                if (err.statusCode === 410) { //GONE
                    suscriptions[i].delete = true;
                }
            });
        sentNotifications.push(sendedNotification);

        //Recoge todas las promesas y las elimina despues
        Promise.all(sendedNotification)
            .then(() => {
                suscriptions = suscriptions.filter(subs => !subs.borrar);
                fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscriptions));
            })
    });
}