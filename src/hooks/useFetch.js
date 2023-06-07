import { useState } from 'react';
import apiService from "../services/apiService"

const useFetch = () => {
    const apiKey = sessionStorage.getItem("token")
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fetchData = async (endpoint, body = null, method = "GET") => {
        setIsLoading(true);

        try {
            const response = await apiService(endpoint, body, apiKey, method);
            const responseData = await response.json();
            console.log(responseData)
            if (response.ok) {
                setData(responseData);
                setError(null);
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