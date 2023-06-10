/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getUserRol } from "../../../utils/auth";

const ProductCard = ({ data }) => {
  const [cantidad, setCantidad] = useState(0);
  const [precioUnidad, setPrecioUnidad] = useState(0);
  const [error, setError] = useState(false);

  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      console.log(data.id);
      console.log(cart.articulos);
      const product = cart.articulos.find((item) => item.articuloId == data.id);
      console.log(product);
      if (product) {
        setPrecioUnidad(product.precio_unidad);
        setCantidad(product.cantidad);
      }
    }
  }, []);

  const addToCart = (ev) => {
    ev.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (
      cart.articulos.some((articulo) => articulo.articuloId == ev.target.id)
    ) {
      setError(true);
      cart.articulos.map((articulo) => {
        if (articulo.articuloId == data.id) {
          articulo.cantidad = cantidad;
          articulo.precio_unidad = precioUnidad;
        }
      });

      console.log(cart);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      setError(false);
      console.log();
      cart.articulos.push({
        cantidad: cantidad,
        precio_unidad: precioUnidad,
        articuloId: ev.target.id,
        data: ev.target.parentElement.parentElement.lastElementChild
          .textContent,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    console.log(cart);

    // articulos.push(cantidad:setCantidad)
  };

  const checkCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart.articulos.some((articulo) => articulo.articuloId == id)) {
      setError(true);
    }
  };

  return (
    <div className="card shadow-sm mx-auto">
      <div id={"carouselImgsProducto" + data.id} className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target={"#carouselImgsProducto" + data.id}
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target={"#carouselImgsProducto" + data.id}
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target={"#carouselImgsProducto" + data.id}
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/src/assets/images/products/product1.jpg"
              className="d-block w-100"
              alt={"Imagen 1 del producto " + data.nombre}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/src/assets/images/products/product2.jpg"
              className="d-block w-100"
              alt={"Imagen 2 del producto " + data.nombre}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/src/assets/images/products/product3.jpg"
              className="d-block w-100"
              alt={"Imagen 3 del producto " + data.nombre}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={"#carouselImgsProducto" + data.id}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={"#carouselImgsProducto" + data.id}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="card-body">
        <Link
          to={"/products/" + data.id}
          className="card-title text-uppercase fs-4 my-3 fw-semibold"
        >
          {data.nombre}
          <div className="d-none">|</div>
        </Link>
        <p className="my-3 card-text d-flex flex-wrap justify-content-between">
          <div className="d-flex justify-content-between flex-wrap flex-column">
            <div className="">
              <span className="fw-bold text-uppercase">Precio Base: </span>
              <span>{data.precio_base.toFixed(2)} €</span>
              <div className="d-none">|</div>
            </div>
            <div className="">
              <span className="fw-bold text-uppercase">Precio Coste: </span>
              <span>{data.precio_coste.toFixed(2)} €</span>
              <div className="d-none">|</div>
            </div>
          </div>
          <div className="mt-2">
            <span className="fw-bold text-uppercase">Stock: </span>
            <span>{data.stock} uds</span>
            <div className="d-none">|</div>
          </div>
        </p>
        {productId ? (
          <div className="">
            <p className="fw-bold text-uppercase mb-0">Descripción: </p>
            <p className="ps-3">{data.descripcion}</p>
          </div>
        ) : null}

        {localStorage.getItem("cart") ? (
          <form action="#" method="#" onSubmit={addToCart} id={data.id}>
            <div className="d-flex justify-content-center gap-4">
              <div className="form-floating col-4">
                <input
                  type="number"
                  className="form-control"
                  id="cantidadInput"
                  placeholder="cantidad"
                  min={0}
                  required
                  value={cantidad}
                  max={data.stock}
                  onChange={(ev) => setCantidad(ev.target.value)}
                  step={1}
                />
                <label htmlFor="cantidadInput fw-bold">Cantidad</label>
              </div>
              <div className="form-floating col-4">
                <input
                  type="number"
                  className="form-control"
                  id="precioInput"
                  placeholder="precio"
                  value={precioUnidad}
                  required
                  min={0}
                  step={0.01}
                  onChange={(ev) => setPrecioUnidad(ev.target.value)}
                />
                <label htmlFor="precioInput">Precio</label>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              {error ? (
                <div className="d-flex justify-content-center flex-column">
                  <p className="py-1">* Artículo añadido al carrito</p>
                  <input
                    type="submit"
                    className="addBtn mx-auto my-3 p-2 mb-1"
                    value={"Actualizar Pedido"}
                  />
                </div>
              ) : (
                <input
                  type="submit"
                  className="addBtn mx-auto my-3 p-2 mb-1"
                  value={"Añadir al Carrito"}
                  onClick={checkCart(data.id)}
                />
              )}
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
