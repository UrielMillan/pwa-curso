self.addEventListener('fetch', evt =>{
    //const offlineResponse =  new Response(`Sorry you are offline :(`);

    const config = {
        headers:{
            'Content-Type': 'text/html'
        }
    }
    const offlineResponse = new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Mi PWA</title>

        </head>
        <body>
            <h1>Offline mode</h1>
        </body>
        </html>
    `, config)

    const response = fetch(evt.request)
        .then(res => (res))
        .catch(() => (offlineResponse))
    evt.respondWith(response)
});


