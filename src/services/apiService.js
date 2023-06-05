
//Función que realiza peticiones a la api dada un endopint (devuelve la promesa y a partir de ella trabajo en el hook para controlar cuando finaliza la petición)


const apiService = {
    post: (url, data, apiKey) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'key': apiKey,
            },
            body: JSON.stringify(data)
        });
    }
};

export default apiService;