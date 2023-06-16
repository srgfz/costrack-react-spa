/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useFetch from "./../../../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { getIdEmpresa } from "./../../../../utils/auth";
import Spinner from "../../../../components/shared/Spinner/Spinner";
import ErrorBD from "../../../../components/shared/ErrorBD/ErrorBD";

const NewProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const idEmpresa = getIdEmpresa();

  const [nombre, setNombre] = useState("");
  const [idProveedor, setIdProveedor] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [precioCoste, setPrecioCoste] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);

  const { isLoading, data, fetchData } = useFetch();

  const {
    isLoading: loadingProveedores,
    data: proveedores,
    fetchData: fetchProveedores,
  } = useFetch();
  const [endpointOrders, setEndpointOrders] = useState(
    `http://localhost:3000/costrack/proveedores/${idEmpresa}`
  );

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/proveedores`;
    fetchProveedores(newEndpoint);
    fetchData(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idProveedor && idProveedor != 0) {
      // Aquí se llamará al servicio apiService para realizar la petición a la API
      const apiEndpoint = "http://localhost:3000/costrack/articulos";
      const requestData = {
        nombre: nombre,
        proveedorId: idProveedor,
        precio_base: precioBase,
        precio_coste: precioCoste,
        stock: stock,
        descripcion: descripcion,
        empresaId: idEmpresa,
      };

      await fetchData(apiEndpoint, requestData, "POST");
      //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
      if (data) {
        navigate("/products");
      }
    } else {
      setIdProveedor(0);
    }
  };

  return (
    <div>
      {loadingProveedores ? (
        <Spinner />
      ) : !proveedores ? (
        <ErrorBD />
      ) : (
        <div>
          <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
            <form
              action="#"
              method="#"
              className="d-flex flex-column gap-3 px-5 flex-md-row flex-wrap align-items-center justify-content-center"
              onSubmit={handleSubmit}
            >
              <h2 className="text-center col-md-12">
                {" "}
                {productId ? null : "Registrar"} Producto
              </h2>
              <div className="form-floating col-12 col-md-5">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="nombreInput"
                  placeholder="Nombre del producto"
                  required
                  onChange={(e) => setNombre(e.target.value)}
                />
                <label htmlFor="nombreInput">Nombre del Producto</label>
              </div>
              <div className="form-floating col-12 col-md-5">
                <select
                  className="form-select shadow-sm"
                  id="categoriaInput"
                  aria-label="Floating label select example"
                  onChange={(e) => setIdProveedor(e.target.value)}
                  required
                >
                  <option defaultValue>Seleccione un proveedor</option>
                  {proveedores.map((proveedor, index) => (
                    <option value={proveedor.id} key={index}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
                <label htmlFor="categoriaInput"> Selecciona un proveedor</label>
                {idProveedor === 0 ? (
                  <p className="text-danger">* Debe seleccionar un proveedor</p>
                ) : null}
              </div>
              <div className=" justify-content-between d-md-flex col-12 px-md-5 justify-content-lg-center gap-lg-5">
                <div className="form-floating col-12 col-md-3 my-3">
                  <input
                    type="number"
                    className="form-control shadow-sm"
                    id="cuantiInput"
                    placeholder="00.00 €"
                    step="0.01"
                    min={precioCoste}
                    onChange={(e) => setPrecioBase(e.target.value)}
                    required
                  />
                  <label htmlFor="cuantiInput">Precio Base</label>
                </div>
                <div className="form-floating col-12 col-md-3 my-3">
                  <input
                    type="number"
                    className="form-control shadow-sm"
                    id="cuantiInput"
                    placeholder="00.00 €"
                    step="0.01"
                    min={0}
                    onChange={(e) => setPrecioCoste(e.target.value)}
                    required
                  />
                  <label htmlFor="cuantiInput">Precio Coste</label>
                </div>
                <div className="form-floating col-12 col-md-3 my-3">
                  <input
                    type="number"
                    className="form-control shadow-sm"
                    id="cuantiInput"
                    placeholder="00"
                    step="1"
                    min={0}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                  <label htmlFor="cuantiInput">Stock</label>
                </div>
              </div>
              <div className="form-floating col-md-10 col-12">
                <textarea
                  className="form-control shadow-sm h-100"
                  placeholder="Descripción del producto"
                  maxLength={250}
                  id="floatingTextarea"
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
                <label htmlFor="floatingTextarea">
                  Descripción del producto
                </label>
              </div>
              <div className="d-flex justify-content-center col-12">
                <input
                  className="addBtn p-2 my-3 mx-auto"
                  type="submit"
                  value="Añadir Producto"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProduct;
