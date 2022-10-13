function sumarUno(numero){
    var promesa = new Promise(function(resolve, reject){

        if(numero >= 4) reject("Numero no valido");

        setTimeout(() => {
            resolve(numero + 1)
        }, 800);
    })
    return promesa;
}

//Esta funcion ejecuta y retorna la promesa
sumarUno(5)
    .then(nuevoNumero =>{
        console.log(nuevoNumero);
        return sumarUno(nuevoNumero);
    })
    .then(nuevoNumero =>{
        console.log(nuevoNumero);
        return sumarUno(nuevoNumero);
    })
    .then(nuevoNumero => {
        console.log(nuevoNumero);
    })
    .catch(err => {
        console.error(err);
    })


//Esta funcion de promesa funciona por que el valor del resolve se usa como argumento para la funcion sumar
sumarUno(5)
    .then(sumarUno)
    .then(sumarUno)
    .then(nuevoValor => {
        console.log(nuevoValor);
    })
    .catch(err => {
        console.error(err);
    });
