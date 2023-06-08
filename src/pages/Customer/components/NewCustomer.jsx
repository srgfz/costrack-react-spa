import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIdEmpresa } from "./../../../utils/auth";
import useFetch from "./../../../hooks/useFetch";

const NewCustomer = () => {
  const navigate = useNavigate();

  const { isLoading, data, fetchData } = useFetch();
  const [nombre, setNombre] = useState("");
  const [nombreContacto, setNombreContacto] = useState();
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí se llamará al servicio apiService para realizar la petición a la API
    const apiEndpoint = "http://localhost:3000/costrack/clientes";
    const requestData = {
      nombre: nombre.trim(),
      nombre_contacto: nombreContacto,
      email: email.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      empresaId: getIdEmpresa(),
    };

    await fetchData(apiEndpoint, requestData, "POST");
    //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
    if (data && data.direccion) {
      navigate("/customers");
      console;
    }
  };

  return (
    <div>
      <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
        <form
          action="#"
          method="#"
          className="d-flex flex-column gap-3 px-5 flex-md-row flex-wrap align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center col-md-12">Registrar Cliente</h2>
          <div className="form-floating col-12 col-md-5">
            <input
              type="text"
              className="form-control shadow-sm"
              id="nombreInput"
              placeholder="Nombre del Cliente"
              required
              onChange={(e) => setNombre(e.target.value)}
            />
            <label htmlFor="nombreInput">Nombre Cliente</label>
          </div>

          <div className="form-floating col-12 col-md-5">
            <input
              type="text"
              className="form-control shadow-sm"
              id="cuantiInput"
              placeholder="Nombre de contacto"
              onChange={(e) => setNombreContacto(e.target.value)}
              required
            />
            <label htmlFor="cuantiInput">Nombre de contacto</label>
          </div>
          <div className="form-floating col-12 col-md-5">
            <input
              type="email"
              className="form-control shadow-sm"
              id="nombreInput"
              placeholder="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="nombreInput">Email</label>
          </div>
          <div className="form-floating col-12 col-md-5">
            <input
              type="tel"
              className="form-control shadow-sm"
              id="nombreInput"
              placeholder="Teléfono"
              required
              onChange={(e) => setTelefono(e.target.value)}
            />
            <label htmlFor="nombreInput">Teléfono</label>
          </div>
          <div className="form-floating col-md-10 col-12">
            <textarea
              className="form-control shadow-sm"
              placeholder="Dirección"
              id="floatingTextarea"
              onChange={(e) => setDireccion(e.target.value)}
            ></textarea>
            <label htmlFor="floatingTextarea">Dirección</label>
          </div>
          <div className="d-flex justify-content-center col-12">
            <input
              className="addBtn p-2 mx-auto"
              type="submit"
              value="Añadir Gasto"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCustomer;
