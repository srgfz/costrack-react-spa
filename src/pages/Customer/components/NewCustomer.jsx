/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIdEmpresa, getUserRol } from "./../../../utils/auth";
import useFetch from "./../../../hooks/useFetch";
import Spinner from "../../../components/shared/Spinner/Spinner";
import ErrorBD from "../../../components/shared/ErrorBD/ErrorBD";

const NewCustomer = () => {
  const { customerId } = useParams();

  const navigate = useNavigate();

  const { isLoading, data, error, fetchData } = useFetch();
  const [nombre, setNombre] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let type;
    // Aquí se llamará al servicio apiService para realizar la petición a la API
    let apiEndpoint = "http://localhost:3000/costrack/clientes";
    const requestData = {
      nombre: nombre,
      nombre_contacto: nombreContacto,
      email: email,
      telefono: telefono,
      direccion: direccion,
      empresaId: getIdEmpresa(),
    };
    if (deleteItem) {
      apiEndpoint = apiEndpoint + `/${customerId}`;
      await fetchData(apiEndpoint, requestData, "DELETE");
      type = "deleted";
    } else if (customerId) {
      apiEndpoint = apiEndpoint + `/${customerId}`;
      await fetchData(apiEndpoint, requestData, "PATCH");
      type = "updated";
    } else {
      await fetchData(apiEndpoint, requestData, "POST");
      type = "post";
      navigate(`/customers/action/${type}`);
    }
    //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
    if (data && !data.error) {
      navigate(`/customers/action/${type}`);
    }
  };

  const actualizarDatos = () => {
    fetchData(`http://localhost:3000/costrack/clientes/${customerId}`);
  };

  useEffect(() => {
    if (data) {
      setNombre(data.nombre);
      setNombreContacto(data.nombre_contacto);
      setTelefono(data.telefono);
      setEmail(data.email);
      setDireccion(data.direccion);
    }
  }, [data]);

  useEffect(() => {
    actualizarDatos();
  }, [customerId]);

  return (
    <div>
      {customerId && isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorBD type="bd" />
      ) : customerId && !data ? (
        <ErrorBD type="null" />
      ) : (
        <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
          <form
            action="#"
            method="#"
            className="d-flex flex-column gap-3 px-4 px-md-5 flex-md-row flex-wrap align-items-center justify-content-center"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center col-md-12 my-3 mb-5">
              {customerId ? null : "Registrar"} Cliente
            </h2>
            <div className="form-floating col-12 col-md-5 m-2">
              <input
                type="text"
                className="form-control shadow-sm"
                id="nombreInput"
                placeholder="Nombre del Cliente"
                value={nombre}
                required
                onChange={(e) => setNombre(e.target.value)}
              />
              <label htmlFor="nombreInput">Nombre Cliente</label>
            </div>

            <div className="form-floating col-12 col-md-5 m-2">
              <input
                type="text"
                className="form-control shadow-sm"
                id="cuantiInput"
                value={nombreContacto}
                placeholder="Nombre de contacto"
                onChange={(e) => setNombreContacto(e.target.value)}
                required
              />
              <label htmlFor="cuantiInput">Nombre de contacto</label>
            </div>
            <div className="form-floating col-12 col-md-5 m-2">
              <input
                type="email"
                className="form-control shadow-sm"
                id="nombreInput"
                placeholder="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="nombreInput">Email</label>
            </div>
            <div className="form-floating col-12 col-md-5 m-2">
              <input
                type="tel"
                className="form-control shadow-sm"
                id="nombreInput"
                placeholder="Teléfono"
                value={telefono}
                required
                onChange={(e) => setTelefono(e.target.value)}
              />
              <label htmlFor="nombreInput">Teléfono</label>
            </div>
            <div className="form-floating col-md-10 col-12 m-2">
              <textarea
                className="form-control shadow-sm textarea"
                placeholder="Dirección"
                value={direccion}
                id="floatingTextarea"
                onChange={(e) => setDireccion(e.target.value)}
              ></textarea>
              <label htmlFor="floatingTextarea">Dirección</label>
            </div>
            <div className="d-flex justify-content-center col-12">
              {customerId ? (
                <div className=" d-flex gap-4">
                  <input
                    className="addBtn p-2 mx-auto mx-2 my-3"
                    type="submit"
                    value="Editar Cliente "
                  />
                  {getUserRol() === 1 ? (
                    <button
                      className="btn dropBtn mx-2 my-3"
                      onClick={() => setDeleteItem(true)}
                    >
                      Eliminar Cliente
                    </button>
                  ) : null}
                </div>
              ) : (
                <input
                  className="addBtn p-2 mx-auto my-3"
                  type="submit"
                  value="Añadir Cliente"
                />
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewCustomer;
