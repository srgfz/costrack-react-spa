import { useState } from 'react';
import apiService from "../services/apiService"

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async (url, requestData) => {
        setIsLoading(true);

        try {
            const response = await apiService.post(url, requestData);
            const responseData = await response.json();

            if (response.ok) {
                setData(responseData);
                console.log(data)
                setError(null);
            } else {
                throw new Error(responseData.error);
            }
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);
    };

    return { isLoading, data, error, fetchData };
};

export default useFetch;