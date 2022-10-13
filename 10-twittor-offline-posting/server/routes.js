// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();

const mensajes = [
  {
    _id: '11111',
    user: 'spiderman',
    mensaje: 'Hola mundo'
  },
  {
    _id: '11111',
    user: 'spiderman',
    mensaje: 'Hola mundo'
  },
  {
    _id: '11111',
    user: 'hulk',
    mensaje: 'Hola mundo'
  },
  {
    _id: '11111',
    user: 'ironman',
    mensaje: 'Hola mundo'
  },
]





// Get mensajes
router.get('/', function (req, res) {
  res.json(mensajes);
});

//post mensaje
router.post('/', function(req, res){
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user,
  }

  mensajes.push(mensaje);

  res.json({
    ok:true,
    mensaje,
  })
})




module.exports = router;