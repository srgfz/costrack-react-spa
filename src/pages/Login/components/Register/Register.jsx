import "./Register.css";
import { useState } from "react";

const Register = () => {
  const [isComercial, setComercial] = useState(true);

  const handleCheckboxChange = () => {
    setComercial(!isComercial);
  };

  return (
    <div className="">
      <div
        className="btn-group d-flex justify-content-center col-10 mx-auto my-3"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="rol"
          id="0"
          autoComplete="off"
          checked={isComercial}
          onChange={handleCheckboxChange}
        />
        <label className="btn login__radiobtn" htmlFor="0">
          Soy un Comercial
        </label>
        <input
          type="radio"
          className="btn-check"
          name="rol"
          id="1"
          autoComplete="off"
          checked={!isComercial}
          onChange={handleCheckboxChange}
        />
        <label className="btn" htmlFor="1">
          Soy una Empresa
        </label>
      </div>

      {isComercial ? (
        <div className="">
          <label htmlFor="name" className="login__label mt-2">
            <span className="label__span">* </span> Nombre
          </label>
          <input
            type="name"
            placeholder="Nombre"
            id="name"
            autoComplete="name"
            className="login__input"
          />
          <label htmlFor="surnames" className="login__label mt-2">
            <span className="label__span">* </span>
            Apellidos
          </label>
          <input
            type="surnames"
            placeholder="Apellidos"
            id="surnames"
            autoComplete="family-name"
            className="login__input"
          />
          <label htmlFor="dni" className="login__label mt-2">
            <span className="label__span">* </span>
            DNI
          </label>
          <input
            type="dni"
            placeholder="DNI"
            id="dni"
            autoComplete="off"
            className="login__input"
          />
        </div>
      ) : (
        <div className="">
          <label htmlFor="name" className="login__label mt-2">
            <span className="label__span">*</span> Nombre de la Empresa
          </label>
          <input
            type="name"
            placeholder="Nombre"
            id="name"
            autoComplete="off"
            className="login__input"
          />
          <label htmlFor="address" className="login__label mt-2">
            <span className="label__span">* </span>
            Dirección
          </label>
          <input
            type="address"
            placeholder="Dirección"
            id="address"
            autoComplete="address"
            className="login__input"
          />
          <label htmlFor="cif" className="login__label mt-2">
            <span className="label__span">* </span>
            CIF
          </label>
          <input
            type="cif"
            placeholder="CIF"
            id="cif"
            autoComplete="off"
            className="login__input"
          />
        </div>
      )}
      <label htmlFor="email" className="login__label mt-2">
        <span className="label__span">* </span>
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        autoComplete="username"
        className="login__input"
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
      />
      <input type="submit" className="login__submit mt-3" value="Registrarse" />
    </div>
  );
};

export default Register;
