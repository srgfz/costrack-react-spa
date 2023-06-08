/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import useFetch from "./../../../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "./../Spinner/Spinner";
import ErrorBD from "./../ErrorBD/ErrorBD";
import { getIdEmpresa } from "./../../../utils/auth";

const SelectComerciales = ({ bills = true }) => {
  const idEmpresa = getIdEmpresa();
  const navigate = useNavigate();

  const params = useParams();

  const [commercialId, setCommercialId] = useState(params.commercialId);
  const {
    isLoading: loadingComerciales,
    data: comerciales,
    fetchData: fetchComerciales,
  } = useFetch();

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/empresas/comerciales/${idEmpresa}`;
    fetchComerciales(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, []);

  useEffect(() => {
    if (bills) {
      navigate("/bills/" + commercialId);
    } else {
      navigate("/orders/" + commercialId);
    }
  }, [commercialId]);

  return (
    <div>
      {loadingComerciales ? (
        <Spinner />
      ) : !comerciales ? (
        <ErrorBD />
      ) : (
        <div>
          <select
            className="form-select form-select-lg mb-1 ms-1 bg-dark bg-gradient border bg-opacity-25 shadow-sm"
            aria-label=".form-select-lg example"
            value={commercialId}
            onChange={(e) => setCommercialId(e.target.value)}
          >
            {comerciales.comercials.map((comercial, index) => (
              <option value={comercial.id} key={index}>
                {comercial.nombre} {comercial.apellidos}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SelectComerciales;
