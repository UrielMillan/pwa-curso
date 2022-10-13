// Routes.js - Módulo de rutas
const 
  express = require('express'),
  router = express.Router(),
  push = require('./push'),
  mensajes = [
    {
      _id: 'XXX',
      user: 'spiderman',
      mensaje: 'Hola Mundo'
    }
  ];

// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensaje
router.post('/', function (req, res) {
  
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push( mensaje );

  res.json({
    ok: true,
    mensaje
  });
});

//ruta de suscripcion
router.post('/suscribe', function(req, res){
  const suscription = req.body;
  push.addSubscription(suscription)
  res.json('suscribe')
});

//Obtener el key publico
router.get('/key', function(req, res){
  const key = push.getKey();

  //Es importante que la respuesta de la peticion no sea retornada como json, solo enviarla como send
  res.send(key);
});

//Enviar notificacion
//Es solo de pruebas, pero no es la forma como se administran las notificaciones
router.post('/push', function(req, res){
  const notification = {
    title: req.body.title,
    body: req.body.body,
    user: req.body.user
  };
  push.sendPush(notification)
  res.json(notification)
})



module.exports = router;