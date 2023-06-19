//*Hook personalizado para hacer peticiones mediante fetch
import { useState } from 'react';
import apiService from "../services/apiService";
import { useNavigate } from 'react-router-dom';

const useFetch = () => {
    const navigate = useNavigate();
    const apiKey = localStorage.getItem("token"); // Obtiene el token almacenado en el almacenamiento local
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint, body = null, method = "GET") => {
        setIsLoading(true);

        try {
            const response = await apiService(endpoint, body, apiKey, method);
            const responseData = await response.json();

            if (response.ok) {
                setData(responseData);
                setError(null);
            } else if (response.status === 401) {
                // Si el estado de respuesta es 401 (no autorizado), elimina el token y redirige a la página de inicio de sesión
                localStorage.removeItem("token");
                localStorage.removeItem("cart");
                navigate("/login");
            } else {
                throw new Error(responseData.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, data, error, fetchData };
};

export default useFetch;
