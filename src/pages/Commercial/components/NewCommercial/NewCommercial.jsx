/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useFetch from "./../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { getIdEmpresa } from "./../../../../utils/auth";
import emailjs from "emailjs-com";
import logo1 from "./../../../../assets/images/logo/logo-nobg/logo1.png";

const NewCommercial = () => {
  const idEmpresa = getIdEmpresa();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("***");
  const [password, setPassword] = useState(0);

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí se llamará al servicio apiService para realizar la petición a la API
    const apiEndpoint =
      "http://localhost:3000/costrack/users/register/comercial";
    const requestData = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      email: email.trim(),
      password: password.trim(),
      rol: 0,
      empresaId: idEmpresa,
    };

    await fetchData(apiEndpoint, requestData, "POST");
    sendEmail(requestData);
    navigate("/");
  };

  useEffect(() => {
    if (data && !data.error) {
      navigate(`/commercial/action/post`);
    }
  }, [data]);

  const sendEmail = (data) => {
    const serviceId = "service_g9lzr9t";
    const templateId = "template_18wnqtl";
    const userId = "2OpIBaT1vhIePYJVs";

    const dataToSend = {
      to_email: data.email,
      from_name: "Costrack",
      subject: "Alta en Costrack como comercial",
      message_html: `
      <p>Hola,<strong> ${data.nombre} ${data.apellidos}.</strong></p>
      <p>La empresa <strong>Nombre Empresa</strong> le ha dado de alta en Costrack como su comercial.</p>
      <br>
      <p>Sus credenciales para iniciar sesión son:</p>
      <ul>
      <li><strong>Email: </strong>${data.email}</li>
      <li><strong>Contraseña: </strong>${data.password}</li>
      </ul>
      <br>
      <p>Por favor, <a href="http://localhost:5173" target="_blank">Inicie Sesión</a> con estas credenciales y cambie la contraseña por una propia.</p>
      <p>Para cualquier duda contacte con su empresa.</p>
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
    <div className="m-5 bg-secondary py-4 bg-opacity-25 shadow-sm rounded">
      <form
        action="#"
        method="#"
        className="d-flex flex-column gap-3 px-5 px-md-0 flex-md-row flex-wrap align-items-center justify-content-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center col-md-12 mb-4">Registrar Comercial</h2>
        <div className="m-2 form-floating col-12 col-md-4">
          <input
            type="text"
            className="form-control shadow-sm"
            id="nombreInput"
            placeholder="Nombre del comercial"
            required
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombreInput">Nombre</label>
        </div>
        <div className="m-2 form-floating col-12 col-md-6">
          <input
            type="text"
            className="form-control shadow-sm"
            id="apellidosInput"
            placeholder="Apellidos del comercial"
            required
            onChange={(e) => setApellidos(e.target.value)}
          />
          <label htmlFor="apellidosInput">Apelildos</label>
        </div>

        <div className="m-2 form-floating col-12 col-md-5">
          <input
            type="text"
            className="form-control shadow-sm"
            id="dniInput"
            placeholder="Nombre de la entidad Emisora"
            required
            minLength={9}
            onChange={(e) => setDni(e.target.value)}
          />
          <label htmlFor="dniInput">DNI</label>
        </div>
        <div className="m-2 form-floating col-12 col-md-5">
          <input
            type="password"
            className="form-control shadow-sm"
            id="passInput"
            placeholder="Contraseña"
            autoComplete="current-password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
            title="La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="passInput">Contraseña</label>
        </div>
        <div className="m-2 form-floating col-12 col-md-10">
          <input
            type="text"
            className="form-control shadow-sm"
            id="emailInput"
            placeholder="Email del comercial"
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="emailInput">Email</label>
        </div>
        {data?.error ? (
          <p className="text-danger py-0">* Este Usuario ya está registrado</p>
        ) : null}
        <div className="d-flex justify-content-center col-12">
          <input
            className="addBtn p-2 my-3 mx-auto addBtn--form"
            type="submit"
            value="Añadir Comercial"
          />
        </div>
      </form>
    </div>
  );
};

export default NewCommercial;
