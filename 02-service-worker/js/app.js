
//Es importante deshabilitar el cache del navegador
//Confirma si podemos utilizar el Sw
if(navigator.serviceWorker){
   
    //Registramsos el service worker
    //Es importante poner el service worker en la raiz de nuetro proyecto
    //Ya que el sw solo tiene contro de la carpeta donde se encuentra
    navigator.serviceWorker.register('./sw.js');
}

//Es importante que todas las pagians del sitio tengan referenciado este scriot para poder instalar el sw
//debido a que no sabes desde que pagina el visitante entro a la pagina

//el service worker solo se instala una vez, y la unica forma en que se vuelva a reinstalar es que el archivo sw
//sufra cambios