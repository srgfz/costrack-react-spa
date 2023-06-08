/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProductCard = ({ data }) => {
  const params = useParams();
  const productId = params.productId;

  return (
    <div className="card shadow-sm">
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
        </Link>
        <p className="my-3 card-text d-flex flex-wrap justify-content-between">
          <div className="d-flex justify-content-between flex-wrap flex-column">
            <div className="">
              <span className="fw-bold text-uppercase">Precio Base: </span>
              <span>{data.precio_base.toFixed(2)} €</span>
            </div>
            <div className="">
              <span className="fw-bold text-uppercase">Precio Coste: </span>
              <span>{data.precio_coste.toFixed(2)} €</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="fw-bold text-uppercase">Stock: </span>
            <span>{data.stock} uds</span>
          </div>
        </p>
        {productId ? (
          <div className="">
            <p className="fw-bold text-uppercase mb-0">Descripción: </p>
            <p className="ps-3">{data.descripcion}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
