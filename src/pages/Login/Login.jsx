import "./Login.css";
import { useState } from "react";
import Registered from "./components/Registered/Registered";
import Register from "./components/Register/Register";

const Login = () => {
  const [registered, setRegistered] = useState(true);

  return (
    <div className="login ">
      <div className="col-11 col-md-8 col-lg-7 d-flex align-items-center justify-content-center login__container mx-auto py-3 pb-5 px-2 px-md-5 top-0 my-3 mt-5">
        <form className=" col-11">
          <div className="mx-auto col-8 col-md-6 col-lg-5">
            <img
              className="img-fluid"
              src="./src/assets/images/logo/logo-nobg/logo3.png"
              alt="Logo CosTrack"
            />
          </div>
          <div className="col-lg-9  mx-auto d-flex justify-content-evenly align-items-center login__titles">
            <div
              className={
                registered ? "px-md-3 mx-2 login__active" : "px-md-3 mx-2"
              }
              onClick={() => setRegistered(!registered)}
            >
              Iniciar Sesión
            </div>
            <div className="login__separador"></div>
            <div
              className={
                !registered ? "px-md-3 mx-2 login__active" : "px-md-3 mx-2"
              }
              onClick={() => setRegistered(!registered)}
            >
              Registrarse
            </div>
          </div>
          {registered ? <Registered /> : <Register />}
        </form>
      </div>
    </div>
  );
};

export default Login;
