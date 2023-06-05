import "./Registered.css";

const Registered = () => {
  return (
    <div className="">
      <label htmlFor="email" className="login__label">
        <i className="bi bi-envelope me-2"></i>Email
      </label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        name="email"
        autoComplete="username"
        className="login__input"
      ></input>

      <label htmlFor="password" className="login__label">
        <i className="bi bi-key me-2"></i>Contraseña
      </label>
      <input
        type="password"
        placeholder="Contraseña"
        id="password"
        name="password"
        autoComplete="current-password"
        className="login__input"
      ></input>
      <input
        type="submit"
        className="login__submit"
        value="Iniciar Sesión"
      ></input>
    </div>
  );
};

export default Registered;
