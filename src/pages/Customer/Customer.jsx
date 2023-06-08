/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { getIdEmpresa } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import CustomerTable from "./components/CustomerTable";

const Customer = () => {
  const empresaId = getIdEmpresa();

  const { isLoading, data, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/clientes/${empresaId}`
  );

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/empresas/clientes/${empresaId}`;
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, [empresaId]);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : !data ? (
        <ErrorBD />
      ) : (
        <div>
          <div className="d-flex justify-content-between">
            <h2>Clientes de {data.nombre}</h2>
            <Link className="btn btn-primary addBtn" to={"/new-customer"}>
              Añadir Cliente
            </Link>
          </div>
          <div className="py-3 mx-3">
            <CustomerTable data={data.clientes} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
