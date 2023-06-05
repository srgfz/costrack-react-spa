import "./Register.css";

const Register = () => {
  return (
    <form method="#" action="#" className="">
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
    </form>
  );
};

export default Register;
