/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./../Products.css";
import product1 from "./../../../assets/images/products/product1.jpg";
import product2 from "./../../../assets/images/products/product2.jpg";
import product3 from "./../../../assets/images/products/product3.jpg";

const ProductCard = ({ data }) => {
  const [cantidad, setCantidad] = useState("");
  const [precioUnidad, setPrecioUnidad] = useState("");
  const [error, setError] = useState(false);

  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      const product = cart.articulos.find((item) => item.articuloId == data.id);
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

      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      setError(false);
      cart.articulos.push({
        cantidad: cantidad,
        precio_unidad: precioUnidad,
        articuloId: ev.target.id,
        data: ev.target.parentElement.parentElement.lastElementChild
          .textContent,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // articulos.push(cantidad:setCantidad)
  };

  const checkCart = (id) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart.articulos.some((articulo) => articulo.articuloId == id)) {
      setError(true);
    }
  };

  return (
    <div className="card shadow-sm mx-auto product">
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
            {productId ? (
              <img
                src={product1}
                className="d-block w-100 img-fluid object-fit-fill"
                alt={"Imagen 1 del producto " + data.nombre}
              />
            ) : (
              <img
                src={product1}
                className="d-block w-100 img-fluid object-fit-fill img--products"
                alt={"Imagen 1 del producto " + data.nombre}
              />
            )}
          </div>
          <div className="carousel-item">
            {productId ? (
              <img
                src={product2}
                className="d-block w-100 img-fluid object-fit-fill"
                alt={"Imagen 1 del producto " + data.nombre}
              />
            ) : (
              <img
                src={product2}
                className="d-block w-100 img-fluid object-fit-fill img--products"
                alt={"Imagen 2 del producto " + data.nombre}
              />
            )}
          </div>
          <div className="carousel-item">
            {productId ? (
              <img
                src={product3}
                className="d-block w-100 img-fluid object-fit-fill"
                alt={"Imagen 3 del producto " + data.nombre}
              />
            ) : (
              <img
                src={product3}
                className="d-block w-100 img-fluid object-fit-fill img--products"
                alt={"Imagen 1 del producto " + data.nombre}
              />
            )}
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
      <div
        className={
          data.stock == 0 ? "bg-secondary bg-opacity-50 card-body" : "card-body"
        }
      >
        <h5 className="">
          <Link
            to={"/products/" + data.id}
            className="card-title fs-4 my-3 producttitle"
          >
            {data.nombre}
            <div className="d-none">|</div>
          </Link>
        </h5>
        <div className="my-3 card-text d-flex flex-wrap justify-content-between flex-wrap">
          <div className="d-flex justify-content-between flex-wrap flex-column mx-3">
            <div className="">
              <span className="fw-semibold producttitle">Precio Base: </span>
              <span>
                {data.precio_base.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                  groupingSeparator: ".",
                  decimalSeparator: ",",
                })}{" "}
                €
              </span>
              <div className="d-none">|</div>
            </div>
            <div className="">
              <span className="fw-semibold producttitle">Precio Coste: </span>
              <span>
                {data.precio_coste.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                  groupingSeparator: ".",
                  decimalSeparator: ",",
                })}{" "}
                €
              </span>
              <div className="d-none">|</div>
            </div>
          </div>
          <div className="mt-2 mx-3">
            <span className="fw-semibold producttitle">Stock: </span>
            <span>{data.stock} uds</span>
            <div className="d-none">|</div>
          </div>
        </div>
        {productId ? (
          <div className="">
            <p className="fw-semibold producttitle  mb-0">Descripción: </p>
            <p className="ps-3">{data.descripcion}</p>
          </div>
        ) : null}

        {localStorage.getItem("cart") ? (
          <form action="#" method="#" onSubmit={addToCart} id={data.id}>
            <div className="d-flex justify-content-center gap-4">
              <div className="form-floating col-4 mx-2">
                <input
                  type="number"
                  className="form-control"
                  id="cantidadInput"
                  placeholder="cantidad"
                  min={1}
                  required
                  value={cantidad}
                  max={data.stock}
                  onChange={(ev) => setCantidad(ev.target.value)}
                  step={1}
                />
                <label htmlFor="cantidadInput fw-semibold">Cantidad</label>
              </div>
              <div className="form-floating col-4 mx-2">
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
                  <p className="p-0">* Artículo añadido al carrito</p>
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
