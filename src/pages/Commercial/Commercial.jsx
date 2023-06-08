/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { getIdEmpresa } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import CommercialList from "./components/NewCommercial/CommercialList";

const Commercial = () => {
  const empresaId = getIdEmpresa();

  const { isLoading, data, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/comerciales/${empresaId}`
  );

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/empresas/comerciales/${empresaId}`;
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
          {console.log(data.comercials)}
          <div className="d-flex justify-content-between">
            <h2>Comerciales de {data.nombre}</h2>
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
