/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { getIdEmpresa } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import CommercialList from "./components/NewCommercial/CommercialList";
import Alert from "../../components/shared/Alert/Alert";

const Commercial = () => {
  const { q } = useParams();
  const { type } = useParams();

  const empresaId = getIdEmpresa();

  const { isLoading, data, error, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/comerciales/${empresaId}`
  );

  const actualizarDatos = () => {
    if (q) {
      const newEndpoint = `http://localhost:3000/costrack/empresas/comerciales/${empresaId}?q=${q}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/empresas/comerciales/${empresaId}`;
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

          <div className="d-flex justify-content-between">
            {q ? (
              <h2>Comerciales relacionados con "{q}"</h2>
            ) : (
              <h2>Comerciales de {data.nombre}</h2>
            )}
            <Link className="btn btn-primary addBtn" to={"/new-commercial"}>
              Añadir Comercial
            </Link>
          </div>
          <div className="py-3 mx-3">
            <CommercialList data={data.comercials} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Commercial;
