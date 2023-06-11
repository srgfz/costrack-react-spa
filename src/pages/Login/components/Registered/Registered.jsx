import "./Registered.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import useFetch from "./../../../../hooks/useFetch";

const Registered = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, data, fetchData } = useFetch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se llamará al servicio apiService para realizar la petición a la API
    const apiEndpoint = "http://localhost:3000/costrack/users/login";
    const requestData = {
      email: email.trim(),
      password: password,
    };

    fetchData(apiEndpoint, requestData, "POST");
  };

  //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
  if (data && data.token) {
    localStorage.setItem("token", data.token);
    return <Navigate to="/" replace />;
  }

  return (
    <form method="#" action="#" className="" onSubmit={handleSubmit}>
      <label htmlFor="email" className="login__label">
        <i className="bi bi-envelope me-2"></i>Email
      </label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        autoComplete="username"
        className="login__input"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password" className="login__label">
        <i className="bi bi-key me-2"></i>Contraseña
      </label>
      <input
        type="password"
        placeholder="Contraseña"
        id="password"
        autoComplete="current-password"
        className="login__input"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {data && data.error ? (
        <p className="text-danger mt-3 mb-0">* {data.error}</p>
      ) : null}
      <input
        type="submit"
        className="login__submit"
        value="Iniciar Sesión"
        disabled={isLoading}
      />
    </form>
  );
};

export default Registered;
