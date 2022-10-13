//Cuando intentamos volver a leer una respuesta parseandola a json nos dara un error
//por eso debemos clonar el objeto

fetch('https://reqres.in/api/users/1000')
    .then(response => {
        if(response.ok) return response.json();
        else throw new Error('No existe el usuario 1000');
    })
    .then(console.log)
    .catch(console.error)