/* eslint-disable no-unused-vars */
import { useState } from "react";
import useFetch from "./../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { getIdCommercial } from "./../../../../utils/auth";

const NewBill = () => {
  const navigate = useNavigate();
  const formatDate = () => {
    const currentDate = new Date();

    // Formatear la fecha actual en el formato yyyy-mm-dd
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const [nombreEmisor, setNombreEmisor] = useState("");
  const [fechaGasto, setFechaGasto] = useState(formatDate());
  const [categoria, setCategoria] = useState("");
  const [foto, setFoto] = useState("***");
  const [cuantia, setCuantia] = useState(0);
  const [observaciones, setObservaciones] = useState("");

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoria && categoria != "none") {
      // Aquí se llamará al servicio apiService para realizar la petición a la API
      const apiEndpoint = "http://localhost:3000/costrack/gastos";
      const requestData = {
        nombre_emisor: nombreEmisor.trim(),
        cuantia: cuantia,
        foto: "***",
        categoria: categoria.trim(),
        fecha_gasto: fechaGasto,
        observaciones: observaciones.trim(),
        comercialId: getIdCommercial(),
      };

      await fetchData(apiEndpoint, requestData, "POST");
      //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
      if (data && data.categoria) {
        navigate("/bills");
      }
    } else {
      setCategoria("none");
    }
  };

  return (
    <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
      <form
        action="#"
        method="#"
        className="d-flex flex-column gap-3 px-5 flex-md-row flex-wrap align-items-center justify-content-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center col-md-12">Registrar Gasto</h2>
        <div className="form-floating col-12 col-md-5">
          <input
            type="text"
            className="form-control shadow-sm"
            id="nombreInput"
            placeholder="Nombre de la entidad Emisora"
            required
            onChange={(e) => setNombreEmisor(e.target.value)}
          />
          <label htmlFor="nombreInput">Nombre del Emisor</label>
        </div>
        <div className="form-floating col-12 col-md-5">
          <input
            type="date"
            className="form-control shadow-sm"
            id="fechaInput"
            placeholder="Fecha del gasto"
            value={formatDate()}
            max={formatDate()}
            required
            onChange={(e) => setFechaGasto(e.target.value)}
          />
          <label htmlFor="fechaInput">Fecha del gasto</label>
        </div>
        <div className="form-floating col-12 col-md-5">
          <select
            className="form-select shadow-sm"
            id="categoriaInput"
            aria-label="Floating label select example"
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option selected disabled>
              Seleccione una categoría
            </option>
            <option value="Transporte">Transporte</option>
            <option value="Alojamiento">Alojamiento</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Equipamiento">Equipamiento</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Sin Categoría">Sin Categoría</option>
          </select>
          <label htmlFor="categoriaInput"> Selecciona una categoría</label>
          {categoria == "none" ? (
            <p className="text-danger">* Debe seleccionar una categoría</p>
          ) : null}
        </div>
        <div className="form-floating col-12 col-md-5">
          <input
            type="number"
            className="form-control shadow-sm"
            id="cuantiInput"
            placeholder="00.00 €"
            step="0.01"
            min={0}
            onChange={(e) => setCuantia(e.target.value)}
            required
          />
          <label htmlFor="cuantiInput">Cuantía</label>
        </div>
        <div className="col-md-10 col-12">
          <label htmlFor="formFile" className="form-label">
            Imagen del Ticket
          </label>
          <input
            className="form-control shadow-sm"
            type="file"
            id="formFile"
            onChange={(e) => setFoto(e.target.value)}
            required
          />
        </div>
        <div className="form-floating col-md-10 col-12">
          <textarea
            className="form-control shadow-sm"
            placeholder="Observaciones del gasto"
            id="floatingTextarea"
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
          <label htmlFor="floatingTextarea">Observaciones</label>
        </div>
        <div className="d-flex justify-content-center col-12">
          <input
            className="addBtn p-2 my-3 mx-auto"
            type="submit"
            value="Añadir Gasto"
          />
        </div>
      </form>
    </div>
  );
};

export default NewBill;
