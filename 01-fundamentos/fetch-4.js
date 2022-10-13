const img = document.querySelector("img");


//Con URL podemos crear url dinamicas a usando blobs
//No es miy comun utilizarlas, pero son demaciado utiles 
fetch('virgil.jpg')
    .then(resp => resp.blob())
    .then(imagen => {
        const path = URL.createObjectURL(imagen)
        img.src = path
    })