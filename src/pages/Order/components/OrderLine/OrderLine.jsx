/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderLine = ({ data }) => {
  const [cantidad, setCantidad] = useState("");
  const [precioUnidad, setPrecioUnidad] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCantidad(data.cantidad);
    setPrecioUnidad(data.precio_unidad);
    console.log(data);
  }, [data]);

  const deleteItem = (ev, id) => {
    console.log(id);
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.articulos = cart.articulos.filter((item) => item.articuloId != id);
    console.log(cart.articulos);
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

    console.log(cart);
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

    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <li className=" col-10  mx-auto list-group -item my-3 bg-light p-3 border rounded shadow-sm d-flex flex-row justify-content-around align-items-center">
      <div className="">
        <i
          className="bi bi-x-lg"
          onClick={(e) => deleteItem(e, data.articuloId)}
        ></i>
      </div>
      <h4>{data.data.split("|")[0]}</h4>
      <div className="">
        <div className="d-flex">
          <div className="">
            <div className="">Stock Disponible: 5</div>
          </div>
          <div className="form-floating">
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
        </div>
        <div className="d-flex">
          <div className="">
            <div className="">Precio base</div>
            <div className="">Precio Coste</div>
          </div>
          <div className="form-floating">
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
    </li>
  );
};

export default OrderLine;
