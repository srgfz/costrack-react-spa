/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetch from "./../../../../hooks/useFetch";
import OrderLine from "../OrderLine/OrderLine";
import emptyCart from "./../../../../assets/images/emptyCart.png";
import emailjs from "emailjs-com";
import { getUserEmail } from "./../../../../utils/auth";

const OrderDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId;
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")));

  const [comentarios, setComentarios] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioUnidad, setPrecioUnidad] = useState("");
  const [total, setTotal] = useState(0);

  const { isLoading, data, fetchData } = useFetch();

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
      setCart(data);
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
      console.log(cart);
      sendEmail(cart);
      localStorage.removeItem("cart");
      navigate("/orders/action/post");
    }
  };

  const sendEmail = (cart) => {
    const serviceId = "service_g9lzr9t";
    const templateId = "template_18wnqtl";
    const userId = "2OpIBaT1vhIePYJVs";

    const total = cart.articulos.reduce((acum, articulo) => {
      return (
        acum +
        parseFloat(articulo.cantidad) * parseFloat(articulo.precio_unidad)
      );
    }, 0);

    const dataToSend = {
      to_email: "fernandezsergio10@gmail.com", // Cambia esto por tu dirección de correo electrónico
      from_name: "Costrack",
      subject: "Pedido Procesado Correctamente",
      message_html: `
      <p>Hola,<strong> ${cart.nombre.split(" (")[1].split(")")[0]} (${
        cart.nombre.split(" (")[0]
      })</strong>.</p>
      <p>Tu pedido se ha procesado correctamente y lo recibirá en un plazo máximo de 48 horas en <strong>${
        cart.direccion
      }</strong>.</p>
      <br>
        <h2>Información del pedido realizado:</h2>
        <table cellspacing="0" border="1" cellpadding="10">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Precio Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart.articulos
              .map(
                (articulo) => `
                <tr>
                  <td>${articulo.data.split("|")[0]}</td>
                  <td>${articulo.cantidad}</td>
                  <td>${parseFloat(articulo.precio_unidad).toLocaleString(
                    "es-ES",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                      groupingSeparator: ".",
                      decimalSeparator: ",",
                    }
                  )} €</td>
                  <td>${(
                    parseFloat(articulo.precio_unidad) *
                    parseInt(articulo.cantidad)
                  ).toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                    groupingSeparator: ".",
                    decimalSeparator: ",",
                  })} €</td>
                </tr>
              `
              )
              .join("")}
              <tr>
              <td colspan='2'><strong>Total del pedido</strong></td>
              <td colspan='2'><strong>${total.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
                groupingSeparator: ".",
                decimalSeparator: ",",
              })} €</strong></td>
              </tr>
          </tbody>
        </table>
        <br>

        <p>Si no ha realizado usted este pedido, desea hacer alguna modificación o tiene alguna consulta, por favor contacte con nosotros a través de <strong><a href="mailto:${getUserEmail()}">Email de contacto<a></strong>.</p>
        <br>
        <p>Muchas Gracias por su confianza.</p>
        <br>
        <br>
        <p>* Nota: este es un mensaje enviado de forma automática. No responda directamente a este correo electrónico.</p>
      `,
    };

    emailjs.send(serviceId, templateId, dataToSend, userId).then(
      (response) => {
        console.log("Correo electrónico enviado con éxito", response);
      },
      (error) => {
        console.log("Error al enviar el correo electrónico", error);
      }
    );
  };

  return (
    <div>
      {!cart && !orderId ? (
        <div className="col-10 mx-auto fs-2 text-center pt-2">
          Actualmente no hay ningún pedido en curso.
          <p>
            ¿Desea
            <Link to={"/new-order"}> Añadir un nuevo pedido</Link>?
          </p>
          <div className=" mx-auto col-12 col-md-10 col-lg-6 my-5">
            <img
              src={emptyCart}
              alt="Carro Vacio"
              className="col-12 d-md-block img-fluid object-fit-cover mx-auto"
            />
          </div>
        </div>
      ) : (
        <form className="my-3" action="#" method="#" onSubmit={handleSubmit}>
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
                className="form-control textarea"
                placeholder="Comentarios"
                id="comentariosTextarea"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              ></textarea>
              <label htmlFor="comentariosTextarea">Comentarios</label>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-5 my-4 flex-wrap">
            {orderId ? (
              <input
                type="submit"
                className="dropBtn p-3 px-4 mx-2"
                value={"Actualizar Pedido"}
              />
            ) : (
              <input
                type="submit"
                className="dropBtn p-3 px-4 mx-2"
                value={"Realizar Pedido"}
              />
            )}
            {orderId ? (
              <button className="dropBtn px-4">Eliminar Pedido</button>
            ) : (
              <button
                className="dropBtn px-4 mx-2"
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
