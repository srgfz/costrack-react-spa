/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./UserProfile.css";

import { useState, useEffect } from "react";
import useFetch from "./../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import {
  getIdCommercial,
  getIdEmpresa,
  getUserRol,
  getUserId,
  logOut,
} from "./../../utils/auth";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";

const UserProfile = () => {
  const navigate = useNavigate();
  const userRol = getUserRol();
  const userId = getUserId();
  const userIdOfEchRol = userRol === 0 ? getIdCommercial() : getIdEmpresa();

  const [endpoint, setEndpoint] = useState();
  const { isLoading, data, fetchData } = useFetch();
  const {
    isLoading: loadingDelete,
    data: dataDelete,
    fetchData: fetchDelete,
  } = useFetch();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dniOrCif, setDniOrCif] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passError, setPassError] = useState(false);

  const actualizarDatos = () => {
    let newEndpoint = "";
    if (userRol === 1) {
      newEndpoint = `http://localhost:3000/costrack/empresas/${userIdOfEchRol}`;
    } else {
      newEndpoint = `http://localhost:3000/costrack/comerciales/${userIdOfEchRol}`;
    }
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, []);

  useEffect(() => {
    if (data) {
      setNombre(data.nombre);
      setApellidos(data.apellidos);
      setDniOrCif(userRol === 1 ? data.cif : data.dni);
      if (data.user) {
        setEmail(data.user.email);
      }
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let apiEndpoint;
    let requestData;
    if (password === password2 && password !== "") {
      // Aquí se llamará al servicio apiService para realizar la petición a la API
      if (userRol === 1) {
        apiEndpoint = `http://localhost:3000/costrack/empresas/${userIdOfEchRol}`;
        requestData = {
          idUser: userId,
          nombre: nombre,
          cif: dniOrCif,
          email: email,
          password: password,
        };
      } else {
        apiEndpoint = `http://localhost:3000/costrack/comerciales/${userIdOfEchRol}`;
        requestData = {
          idUser: userId,
          nombre: nombre,
          apellidos: apellidos,
          dni: dniOrCif,
          email: email,
          password: password,
        };
      }
      await fetchData(apiEndpoint, requestData, "PATCH");
      //Redireccionar a la nueva ruta si el inicio de sesión es exitoso
      if (data && data.nombre) {
        navigate("/");
      }
    } else {
      setPassError(true);
    }
  };

  const deleteUser = async () => {};

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : !data ? (
        <ErrorBD />
      ) : (
        <div className="">
          <h2 className="my-3 mb-5 pb-4">
            Perfil de {data.nombre}
            {userRol === 0 ? " " + data.apellidos : null}
          </h2>
          <div className=" my-2 col-10 mx-auto">
            <div className="my-4 bg-secondary p-3 bg-opacity-25 shadow-sm rounded mt-5">
              <form
                action="#"
                method="#"
                className="mt-4 d-flex flex-column gap-3 p-2 pt-5 py-3 flex-md-row flex-wrap align-items-center justify-content-center position-relative"
                onSubmit={handleSubmit}
              >
                <div className="col-2 img-container p-0 profileimg position-absolute start-50 translate-middle ">
                  <img
                    src="./src/assets/images/profile.jpg"
                    alt="Imagen de perfil"
                    className="object-fit-contain img-fluid rounded-circle shadow-sm"
                  />
                </div>
                <div className="form-floating col-12 col-md-5 m-2 m-lg-0">
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    id="nombreInput"
                    autoComplete="nombre"
                    placeholder="Nombre de la entidad Emisora"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  ></input>
                  <label htmlFor="nombreInput">
                    Nombre
                    {userRol === 1 ? " de la empresa" : null}
                  </label>
                </div>
                <div className="form-floating col-12 col-md-5 m-2 m-lg-0">
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    id="dniOrCif"
                    placeholder={
                      userRol === 1 ? "CIF de la empresa" : "DNI del usuario"
                    }
                    required
                    value={dniOrCif}
                    onChange={(e) => setDniOrCif(e.target.value)}
                  />
                  <label htmlFor="dniOrCif">
                    {userRol === 1 ? "CIF" : "DNI"}
                  </label>
                </div>
                {userRol === 0 ? (
                  <div className="form-floating col-12 col-md-10 m-2 m-lg-0">
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      autoComplete="surname"
                      id="apellidosInput"
                      placeholder="Apellidos"
                      required
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                    />
                    <label htmlFor="apellidosInput">Apellidos</label>
                  </div>
                ) : null}
                <div className="form-floating col-12 col-md-10 m-2 m-lg-0">
                  <input
                    type="email"
                    className="form-control shadow-sm"
                    id="emailInput"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <label htmlFor="emailInput">Email</label>
                </div>
                <div className="form-floating col-12 col-md-5 m-2 m-lg-0">
                  <input
                    type="password"
                    className="form-control shadow-sm"
                    id="passwordInput"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                    title="La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPassError(false);
                    }}
                  />
                  <label htmlFor="passwordInput">Nueva Contraseña</label>
                </div>
                <div className="form-floating col-12 col-md-5 m-2 m-lg-0">
                  <input
                    type="password"
                    className="form-control shadow-sm"
                    id="passwordInput2"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                    title="La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
                    onChange={(e) => {
                      setPassword2(e.target.value);
                      setPassError(false);
                    }}
                  />
                  <label htmlFor="passwordInput2">Repita la contraseña</label>
                </div>
                {passError ? (
                  <p className="text-danger text-start mb-0  col-10">
                    * Revise su contraseña
                  </p>
                ) : null}
                <div className=" col-12 d-flex justify-content-center gap-5 mt-3">
                  <input
                    className="addBtn addBtn--form m-3 p-3"
                    type="submit"
                    value="Editar Perfil"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
