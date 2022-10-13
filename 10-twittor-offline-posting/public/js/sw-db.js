//guardar

const db = new PouchDB('mensajes');

function guardarMensaje(mensaje) {
    mensaje._id = new Date().toISOString();
    return db.put(mensaje)
        .then(() => {
            self.registration.sync.register('new-post');
            const newRespond = { ok: true, offline: true };
            console.log('Mensaje guardado');
            return new Response(JSON.stringify(newRespond));
        })
}

function postearMensaje() {
    const posteos = [];

    return db.allDocs({ include_docs: true })
        .then(docs => {
            docs.rows.forEach(row => {
                const doc = row.doc;
                const response = fetch('api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(doc)
                })
                .then(res => {
                    return db.remove(doc)
                });
                posteos.push(response);
            });
            return Promise.all(posteos);
        })
}