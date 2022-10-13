//Esta eran las peticiones tipo Http que se usaban antes
//Se debe de ejecutar en el navegador por que el objeto XMLHttpRequest es parte del window
var request = new XMLHttpRequest();
request.open('GET','https://reqres.in/api/users/', true);
request.send(null);

//Esta funcion escucha el estado del la peticion http
request.onreadystatechange = function(state){
    console.log(state);
    if(state.readyState === 4){
        var resp = request.response;
        var respObj = JSON.parse(resp);
        console.log(respObj);
    }
}

//Documentacion https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest