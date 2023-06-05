import "./Register.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import useFetch from "./../../../../hooks/useFetch";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cif, setCif] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState("");

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se llamará al servicio apiService para realizar la petición a la API
    const apiEndpoint = "http://localhost:3000/costrack/users/register/empresa";
    const requestData = {
      email: email.trim(),
      password: password,
      rol: 1,
      cif: cif.trim(),
      nombre: nombre.trim(),
      direccion: direccion.trim(),
    };

    fetchData(apiEndpoint, requestData);
  };

  //Redireccionar si el registro es correcto
  if (data && data.token) {
    sessionStorage.setItem("token", data.token);
    return <Navigate to="/" replace />;
  }

  return (
    <form method="#" action="#" className="" onSubmit={handleSubmit}>
      <div className="">
        <label htmlFor="name" className="login__label mt-2">
          <span className="label__span">*</span> Nombre de la Empresa
        </label>
        <input
          type="text"
          placeholder="Nombre de la Empresa"
          id="nombre"
          name="nombre"
          autoComplete="off"
          className="login__input"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label htmlFor="address" className="login__label mt-2">
          <span className="label__span">* </span>
          Dirección
        </label>
        <input
          type="text"
          placeholder="Dirección"
          id="direccion"
          name="direccion"
          autoComplete="address"
          className="login__input"
          required
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <label htmlFor="cif" className="login__label mt-2">
          <span className="label__span">* </span>
          CIF
        </label>
        <input
          type="cif"
          placeholder="CIF"
          id="cif"
          name="cif"
          autoComplete="off"
          className="login__input"
          required
          value={cif}
          onChange={(e) => setCif(e.target.value)}
          maxLength={9}
          minLength={9}
        />
      </div>
      <label htmlFor="email" className="login__label mt-2">
        <span className="label__span">* </span>
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        autoComplete="email"
        className="login__input"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password" className="login__label mt-2">
        <span className="label__span">* </span>
        Contraseña
      </label>
      <input
        type="password"
        placeholder="Contraseña"
        id="password"
        autoComplete="current-password"
        className="login__input"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {data && data.error ? (
        <p className="text-danger mt-3 mb-0">* {data.error}</p>
      ) : null}
      <input
        type="submit"
        className="login__submit mt-3"
        value="Registrarse"
        disabled={isLoading}
      />
    </form>
  );
};

export default Register;
