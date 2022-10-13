
const usuario = {
    nombre: 'Erick',
    edad: 24
};

fetch('https://reqres.in/api/users/', {
    method: 'POST',
    body: JSON.stringify(usuario),
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.log)