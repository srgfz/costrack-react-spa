/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useFetch from "./../../../hooks/useFetch";
import Spinner from "../../../components/shared/Spinner/Spinner";
import ErrorBD from "../../../components/shared/ErrorBD/ErrorBD";
import ProductCard from "./ProductCard";
const ProductCardDetails = () => {
  const params = useParams();
  const productId = params.productId;
  console.log(productId);
  const { isLoading, data, error, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/articulos/${productId}`
  );

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/articulos/${productId}`;
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
    console.log(data);
  };

  useEffect(() => {
    actualizarDatos();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorBD type="bd" />
      ) : !data ? (
        <ErrorBD type="null" />
      ) : (
        <div className="col-6 mx-auto my-4">
          <ProductCard data={data} />
        </div>
      )}
    </div>
  );
};

export default ProductCardDetails;
