function sumarLento(numero) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(numero + 1);
        }, 800)
    })
}

let sumarRapido = numero => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(numero + 1);
        }, 300)
    })
}

//Ejecuta las promesas y retorna la promesa que se resuelva primero
Promise.race([sumarLento(12), sumarRapido(13)])
    .then(respuestas => {
        console.log(respuestas);
    })
    .catch(console.log());