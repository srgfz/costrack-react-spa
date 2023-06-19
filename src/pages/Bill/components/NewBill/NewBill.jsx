/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useFetch from "./../../../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { getIdCommercial, getUserRol } from "./../../../../utils/auth";
import Spinner from "../../../../components/shared/Spinner/Spinner";
import ErrorBD from "../../../../components/shared/ErrorBD/ErrorBD";

const NewBill = () => {
  const { billId } = useParams();

  const navigate = useNavigate();
  const formatDate = (date = null) => {
    const currentDate = date ? new Date(date) : new Date();

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
  const [cuantia, setCuantia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let type;
    if (categoria && categoria != "none") {
      // Aquí se llamará al servicio apiService para realizar la petición a la API
      let apiEndpoint = "http://localhost:3000/costrack/gastos";
      const requestData = {
        nombre_emisor: nombreEmisor,
        cuantia: cuantia,
        foto: "***",
        categoria: categoria,
        fecha_gasto: fechaGasto,
        observaciones: observaciones,
        comercialId: getIdCommercial(),
      };
      if (billId && !deleteItem) {
        apiEndpoint = apiEndpoint + `/${billId}`;
        type = "updated";
        await fetchData(apiEndpoint, requestData, "PATCH");
      } else if (deleteItem) {
        type = "deleted";
        apiEndpoint = apiEndpoint + `/${billId}`;
        await fetchData(apiEndpoint, requestData, "DELETE");
        setDeleteItem(false);
      } else {
        await fetchData(apiEndpoint, requestData, "POST");
        type = "post";
        navigate(`/bills/action/${type}`);
      }
      //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
      if (data && data.categoria) {
        navigate(`/bills/action/${type}`);
      }
    } else {
      setCategoria("none");
    }
  };

  const actualizarDatos = () => {
    fetchData(`http://localhost:3000/costrack/gastos/${billId}`);
  };

  useEffect(() => {
    if (data) {
      setNombreEmisor(data.nombre_emisor);
      setFechaGasto(formatDate(data.fecha_gasto));
      setFoto(data.foto);
      setCategoria(data.categoria);
      setCuantia(data.cuantia);
      setObservaciones(data.observaciones);
    }
  }, [data]);

  useEffect(() => {
    actualizarDatos();
  }, [billId]);

  return (
    <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
      {billId && isLoading ? (
        <Spinner />
      ) : billId && !data ? (
        <ErrorBD />
      ) : (
        <form
          action="#"
          method="#"
          className="d-flex flex-column gap-3 px-4 px-md-5 flex-md-row flex-wrap align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center col-md-12 my-3 mb-5">
            {billId ? null : "Registrar"} Gasto
          </h2>
          <div className="form-floating col-12 col-md-5 my-2 mx-2">
            <input
              type="text"
              className="form-control shadow-sm"
              id="nombreInput"
              placeholder="Nombre de la entidad Emisora"
              required
              value={nombreEmisor}
              onChange={(e) => setNombreEmisor(e.target.value)}
            />
            <label htmlFor="nombreInput">Nombre del Emisor</label>
          </div>
          <div className="form-floating col-12 col-md-5 my-2  mx-2">
            <input
              type="date"
              className="form-control shadow-sm"
              id="fechaInput"
              placeholder="Fecha del gasto"
              max={formatDate()}
              value={fechaGasto}
              required
              onChange={(e) => setFechaGasto(e.target.value)}
            />
            <label htmlFor="fechaInput">Fecha del gasto</label>
          </div>
          <div className="form-floating col-12 col-md-5 my-2 mx-2">
            <select
              className="form-select shadow-sm"
              id="categoriaInput"
              aria-label="Floating label select example"
              onChange={(e) => setCategoria(e.target.value)}
              value={categoria}
              required
            >
              <option value="" disabled>
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
          <div className="form-floating col-12 col-md-5 my-2  mx-2">
            <input
              type="number"
              className="form-control shadow-sm"
              id="cuantiInput"
              placeholder="00.00 €"
              step="0.01"
              value={cuantia}
              min={0}
              onChange={(e) => setCuantia(e.target.value)}
              required
            />
            <label htmlFor="cuantiInput">Cuantía del gasto</label>
          </div>
          <div className="form-floating col-md-10 col-12 my-2">
            <textarea
              className="form-control shadow-sm textarea"
              placeholder="Observaciones del gasto"
              id="floatingTextarea"
              maxLength={250}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            ></textarea>
            <label htmlFor="floatingTextarea">Observaciones</label>
          </div>
          <div className="d-flex justify-content-center col-12 my-3 mt-4">
            {billId && getUserRol() === 0 ? (
              <div className=" d-flex gap-4">
                <input
                  className="addBtn p-2 mx-2"
                  type="submit"
                  value="Editar Gasto"
                />
                <button
                  className="btn dropBtn mx-2"
                  onClick={() => setDeleteItem(true)}
                >
                  Eliminar Gasto
                </button>
              </div>
            ) : getUserRol() === 0 ? (
              <input
                className="addBtn p-2 mx-auto"
                type="submit"
                value="Añadir Gasto"
              />
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
};

export default NewBill;
