
// indexedDB: Reforzamiento

//Trata de  abrir una bd si no existe la crea
const request = window.indexedDB.open('mi-data', 2);

//se ejecuta cuando se crea o se sube de version la bd
request.onupgradeneeded = e => {
    console.log('actulizacion de BD');

    //referencia a la base de datos
    const db = e.target.result;
    db.createObjectStore('heroes', {
        keyPath: 'id'
    });
}


//manejo de errores
request.onerror = e => {
   console.log('DB error', e.target.error);
}

//insertar datos
request.onsuccess = e => {

    //referencia a la base de datos
    const db = e.target.result;
    const heroesData = [
        {id: '1111', heroes:'Spiderman', message:'Aqui su amigo spiderman'},
        {id: '2222', heroes:'Ironmam', message:'Aqui en el nuevo mark 50'}
    ]

    //transaccion de inserseccion
    const transaction = db.transaction('heroes', 'readwrite');

    //Si la transaccion falla se recoje el error
    transaction.onerror = e =>{
        console.log('Error guardando', e.target.error);
    }

    //Informa sobre el exito de la transaccion
    transaction.oncomplete = e => {
        console.log('Transaccion hecha', e);
    }

    const heroesStore = transaction.objectStore('heroes');
    for(let heroe of heroesData){
        heroesStore.add(heroe);
    }

    heroesData.onsuccess = e => {
        console.log('Nuevo item agregado a la base de datos');
    }
}


