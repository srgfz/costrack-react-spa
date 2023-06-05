
//Función que realiza peticiones a la api dada un endopint (devuelve la promesa y a partir de ella trabajo en el hook para controlar cuando finaliza la petición)


const getFetch = async (endpoint, method, apiKey, body) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'key': apiKey,
        },
        body: JSON.stringify(body)
    };
    return await fetch(endpoint, options)
}

export default getFetch