//*Hook personalizado para hacer peticiones al endpoint que pasemos como parámetro mediante Fetch. Incluye una variable bool que nos indica si la respuesta han sido recibidos o no

import { useState, useEffect } from 'react'
//Importo el servicio mediante el que haré la petición:
import apiService from "../services/apiService"

const useGetFetch = (endpoint, method = "GET", apiKey = "", body = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)//El valor inicial será true (se están cargando los datos)

    const fetchData = () => {
        apiService(endpoint, method, apiKey, body)
            .then((response) => response.json())
            .then((data) => setData(data))
            .finally(() => setLoading(false))//Al finalizar la petición cambio el estado de loading a false (ya no está cargando y puedo mostrar la información)
    };

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint])//La acción fetchData() se ejecutará siempre que cambie el endpoint que se pasa 
    //*En este caso funcionaría igual si lo dejamos en blanco para que se ejecute cada vez que se renderiza el componente

    return [data, loading]//Devuelvo tanto la respuesta  que nos de la api como el parámetro bool para comprobar la respuesta se ha producido o no
}

export default useGetFetch