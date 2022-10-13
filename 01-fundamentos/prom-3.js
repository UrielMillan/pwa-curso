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

const retornaTrue = () => true;

sumarLento(4)
    .then(console.log)
    .catch(console.log())

sumarRapido(10)
    .then(console.log)
    .catch(console.log())



    
//Si una promesa de falla dentro de un promise all todas fallan
Promise.all([sumarRapido(10), sumarLento(5)])
    .then(respuestas => {
        console.log(respuestas)
    })
    .catch(console.log())

//Las promises all pueden recibir como argumento cualquier tipo de dato o funcion 
//que se encuentre dentro de una arreglo
const cosas = [sumarRapido(10), sumarLento(5), retornaTrue(), 'Hola'];
Promise.all(cosas)
    .then(respuestas => {
        console.log(respuestas)
    })
    .catch(console.log())