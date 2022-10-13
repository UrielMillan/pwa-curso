class Camara{
    constructor(videoNode){
        this.videoNode = this.videoNode;
        console.log('Camara inicializada');
    }

    // Se tienque especificar si necesita audio o video
    //si no colocamos cuanta reoslucion necesitamos de la camara por defecto usa todo el disponible
    encender(){
        if(navigator.mediaDevices){

            //el objeto mediaDevices regresa un promesa con un stream de datos que se mandan al videonode
            navigator.mediaDevices.getUserMedia({
                audio:false,
                video: {width: 300, height:300}
            })
            .then(stream => {
                this.videoNode.srcObject = stream;
                this.stream = stream;
            })
            .catch(err => {
                console.log(err);
            })
        }
        
    }

    apagar(){
        //detiene el stream de video
        this.videoNode.pause();
        if(this.stream){
            //congela el stream de video y obtiene la imagen, se pueden obtener imagen y video
           this.stream.getTracks()[0];  
        }
    }

    tomarFoto(){
        //crea un objeto canvas para renderizar la foto
        let canvas = document.createElement('canvas');

        //colocar las mismias dimensiones que el elemento video
        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);

        //obtener el contexto del canvas
        let context = canvas.getContext('2d');

        //redenrizar la imagen dentro del canvas
        context.drawImage(this.videoNode, 0,0, canvas.width, canvas.height);

        //genera una imagen url en base 64
        this.foto = context.canvas.toDataURL();

        //limpieza
        canvas = null;
        context = null;

        return this.foto;
    }
}