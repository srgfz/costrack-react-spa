/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderLine.css";

const OrderLine = ({ data }) => {
  const [cantidad, setCantidad] = useState("");
  const [precioUnidad, setPrecioUnidad] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCantidad(data.cantidad);
    setPrecioUnidad(data.precio_unidad);
  }, [data]);

  const deleteItem = (ev, id) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.articulos = cart.articulos.filter((item) => item.articuloId != id);
    localStorage.setItem("cart", JSON.stringify(cart));

    ev.target.parentElement.parentElement.remove();
    if (cart.articulos.length === 0) {
      navigate("/products");
    }
  };

  const updatePrice = (e, id) => {
    const newPrecioUnidad = e.target.value;
    setPrecioUnidad(newPrecioUnidad);

    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.articulos = cart.articulos.map((articulo) => {
      if (articulo.articuloId === id) {
        return {
          ...articulo,
          precio_unidad: newPrecioUnidad,
        };
      }
      return articulo;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const updateCantidad = (e, id) => {
    const newCantidad = e.target.value;
    setCantidad(newCantidad);

    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.articulos = cart.articulos.map((articulo) => {
      if (articulo.articuloId === id) {
        return {
          ...articulo,
          cantidad: newCantidad,
        };
      }
      return articulo;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <li className=" col-md-11  mx-auto list-group -item my-3 bg-light p-3 border rounded shadow-sm d-flex flex-row justify-content-start align-items-center align-items-md-center">
      <div className="col-md-1 me-3">
        <i
          className="bi bi-x-lg ms-1 ms-md-3 me-4 me-md-3"
          type="button"
          onClick={(e) => deleteItem(e, data.articuloId)}
        ></i>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-evenly align-items-md-center col-10">
        <h4>{data.data.split("|")[0]}</h4>
        <div className="">
          <div className="d-flex flex-column flex-md-row">
            <div className="my-1 d-flex flex-column justify-content-center">
              <div className="">{data.data.split("|")[3]}</div>
              <div className="">{data.data.split("|")[1]}</div>
              <div className="">{data.data.split("|")[2]}</div>
            </div>
            <div className="d-flex gap-3 justify-content-center flex-md-column">
              <div className="form-floating mx-3 my-2 col-5">
                <input
                  type="number"
                  className="form-control"
                  id="cantidadInput"
                  placeholder="cantidad"
                  value={cantidad}
                  onChange={(e) => updateCantidad(e, data.articuloId)}
                />
                <label htmlFor="cantidadInput">Cantidad</label>
              </div>
              <div className="form-floating mx-3 my-2 col-5">
                <input
                  type="number"
                  className="form-control"
                  id="precioInput"
                  placeholder="precio"
                  value={precioUnidad}
                  onChange={(e) => updatePrice(e, data.articuloId)}
                />
                <label htmlFor="precioInput">Precio</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default OrderLine;
