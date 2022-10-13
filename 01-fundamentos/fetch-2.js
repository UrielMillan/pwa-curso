//Peticiones de http usando el el api de fetch
//se basa en el uso de promesas

fetch('https://reqres.in/api/users/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })