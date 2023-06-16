/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { getIdEmpresa, getUserRol } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import CustomerTable from "./components/CustomerTable";
import InputSearch from "../../components/InputSearch/InputSearch";
import Alert from "../../components/shared/Alert/Alert";

const Customer = () => {
  const location = useLocation();

  const { q } = useParams();
  const { type } = useParams();

  const empresaId = getIdEmpresa();

  const { isLoading, data, error, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/clientes/${empresaId}`
  );

  const actualizarDatos = () => {
    if (q) {
      const newEndpoint = `http://localhost:3000/costrack/empresas/clientes/${empresaId}?q=${q}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/empresas/clientes/${empresaId}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    }
  };

  useEffect(() => {
    actualizarDatos();
  }, [empresaId, q]);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorBD type="bd" />
      ) : !data ? (
        <ErrorBD type="null" />
      ) : (
        <div>
          {type ? <Alert type={type} /> : null}

          <div className="d-flex justify-content-between mt-3">
            {q ? (
              <h2>Clientes relacionados con "{q}"</h2>
            ) : (
              <h2 className="d-flex flex-wrap">
                Clientes de <span className="ms-1"> {data.nombre}</span>
              </h2>
            )}
            <Link className="btn btn-primary addBtn" to={"/new-customer"}>
              Añadir Cliente
            </Link>
          </div>
          {getUserRol === 1 ? (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} />
            </div>
          ) : location.pathname.includes("new-order") ? (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} newOrder={true} />
            </div>
          ) : (
            <div className="py-4  mx-auto">
              <InputSearch type={"clientes"} />
            </div>
          )}

          <div className="py-3 mx-3">
            <CustomerTable data={data.clientes} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
