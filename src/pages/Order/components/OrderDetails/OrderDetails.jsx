import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "./../../../../hooks/useFetch";
import OrderLine from "../OrderLine/OrderLine";

const OrderDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId;
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")));

  const [comentarios, setComentarios] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioUnidad, setPrecioUnidad] = useState("");

  const { isLoading, data, fetchData } = useFetch();

  console.log(cart);

  const actualizarDatos = () => {
    fetchData(`http://localhost:3000/costrack/pedidos/${orderId}`);
  };

  useEffect(() => {
    if (orderId) {
      actualizarDatos();
    }
  }, []);

  useEffect(() => {
    if (orderId && data) {
      console.log("****");
      setCart(data);
      console.log(cart);
      localStorage.setItem("order", JSON.stringify(data));
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.comentarios = comentarios;
    let apiEndpoint = `http://localhost:3000/costrack/pedidos`;
    if (orderId) {
      apiEndpoint = apiEndpoint + `/${orderId}`;
      await fetchData(apiEndpoint, cart, "PATCH");
    } else {
      await fetchData(apiEndpoint, cart, "POST");
      localStorage.removeItem("cart");
      navigate("/orders/action/post");
    }
  };

  return (
    <div>
      {!cart && !orderId ? (
        <div className="col-10 mx-auto fs-2">
          Actualmente no hay ningún pedido en curso.
          <p>
            ¿Desea
            <Link to={"/new-order"}> Añadir un nuevo pedido</Link>?
          </p>
          <div className=" mx-auto col-6 my-5">
            <img
              src="./src/assets/images/emptyCart.png"
              alt="Carro Vacio"
              className="d-none d-md-block img-fluid object-fit-cover mx-auto"
            />
          </div>
        </div>
      ) : (
        <form className="" action="#" method="#" onSubmit={handleSubmit}>
          <h2>{cart.nombre}</h2>
          <div className="">
            <ul className="list-group">
              {cart.articulos.map((articulo, index) => (
                <OrderLine data={articulo} key={index} />
              ))}
            </ul>
          </div>
          <div className="">
            <div className="form-floating col-10 mx-auto">
              <textarea
                className="form-control"
                placeholder="Comentarios"
                id="comentariosTextarea"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              ></textarea>
              <label htmlFor="comentariosTextarea">Comentarios</label>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-5 my-4">
            {orderId ? (
              <input
                type="submit"
                className="dropBtn p-3 col-3"
                value={"Actualizar Pedido"}
              />
            ) : (
              <input
                type="submit"
                className="dropBtn p-3 col-3"
                value={"Realizar Pedido"}
              />
            )}
            {orderId ? (
              <button className="dropBtn col-3">Eliminar Pedido</button>
            ) : (
              <button
                className="dropBtn col-3"
                onClick={() => {
                  setCart();
                  localStorage.removeItem("cart");
                }}
              >
                Vaciar Carrito
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderDetails;
