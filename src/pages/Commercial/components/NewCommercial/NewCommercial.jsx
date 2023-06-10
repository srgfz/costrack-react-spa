/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useFetch from "./../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { getIdEmpresa } from "./../../../../utils/auth";
const NewCommercial = () => {
  const idEmpresa = getIdEmpresa();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("***");
  const [password, setPassword] = useState(0);

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí se llamará al servicio apiService para realizar la petición a la API
    const apiEndpoint =
      "http://localhost:3000/costrack/users/register/comercial";
    const requestData = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      email: email.trim(),
      password: password.trim(),
      rol: 0,
      empresaId: idEmpresa,
    };

    await fetchData(apiEndpoint, requestData, "POST");
    //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
    if (data) {
    }
  };

  useEffect(() => {
    if (data && !data.error) {
      navigate(`/commercial/action/post`);
    }
  }, [data]);

  return (
    <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
      <form
        action="#"
        method="#"
        className="d-flex flex-column gap-3 px-5 px-md-0 flex-md-row flex-wrap align-items-center justify-content-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center col-md-12">Registrar Comercial</h2>
        <div className="form-floating col-12 col-md-4">
          <input
            type="text"
            className="form-control shadow-sm"
            id="nombreInput"
            placeholder="Nombre del comercial"
            required
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombreInput">Nombre</label>
        </div>
        <div className="form-floating col-12 col-md-6">
          <input
            type="text"
            className="form-control shadow-sm"
            id="apellidosInput"
            placeholder="Apellidos del comercial"
            required
            onChange={(e) => setApellidos(e.target.value)}
          />
          <label htmlFor="apellidosInput">Apelildos</label>
        </div>

        <div className="form-floating col-12 col-md-5">
          <input
            type="text"
            className="form-control shadow-sm"
            id="dniInput"
            placeholder="Nombre de la entidad Emisora"
            required
            minLength={9}
            onChange={(e) => setDni(e.target.value)}
          />
          <label htmlFor="dniInput">DNI</label>
        </div>
        <div className="form-floating col-12 col-md-5">
          <input
            type="password"
            className="form-control shadow-sm"
            id="passInput"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="passInput">Contraseña</label>
        </div>
        <div className="form-floating col-12 col-md-10">
          <input
            type="text"
            className="form-control shadow-sm"
            id="emailInput"
            placeholder="Email del comercial"
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="emailInput">Email</label>
        </div>
        {data?.error ? (
          <p className="text-danger py-0">* Este Usuario ya está registrado</p>
        ) : null}
        <div className="d-flex justify-content-center col-12">
          <input
            className="addBtn p-2 my-3 mx-auto addBtn--form"
            type="submit"
            value="Añadir Comercial"
          />
        </div>
      </form>
    </div>
  );
};

export default NewCommercial;
