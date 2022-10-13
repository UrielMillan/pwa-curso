function sumarUno(numero, callback){
    setTimeout(() => {
        callback(null, numero + 1)
    }, 800);
}

sumarUno(5, function(error, nuevoValor){
    console.log(nuevoValor);
    sumarUno(nuevoValor, function(error, nuevoValor2){
        console.log(nuevoValor2);
        sumarUno(nuevoValor2, function(error, nuevoValor3){
            console.log(nuevoValor3);
        })
    })
})