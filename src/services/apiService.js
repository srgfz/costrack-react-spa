
//Función que realiza peticiones a la api dada un endopint (devuelve la promesa y a partir de ella trabajo en el hook para controlar cuando finaliza la petición)

const apiService = async (endpoint, body = null, apiKey = "", method = "GET") => {
    if (method === "GET") {
        return await fetch(
            endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'key': apiKey,
            }
        })
    } else {
        return await fetch(
            endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'key': apiKey,
            },
            body: JSON.stringify(body)
        })
    }

}

export default apiService;