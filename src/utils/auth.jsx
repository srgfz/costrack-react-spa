/* eslint-disable react/prop-types */
//*Archivo en el que incluiré las funciones de seguridad de las rutas
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  return <Navigate to="/login" replace />;
};

const validateTokenLocally = (token) => {
  try {
    //const decodedToken = jwt.verify(token, secretKey);
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000; //tiempo actual en segundos
    // Verificar la caducidad del token
    if (decodedToken.exp < currentTime) {
      return false;
    }
    // Verificar cualquier otra condición necesaria en el token
    return true; // El token es válido
  } catch (error) {
    return false; // Error al decodificar el token o token inválido
  }
};

export const checkTokenValidity = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const isValidToken = validateTokenLocally(token);
      if (!isValidToken) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserId = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).userId;
};

export const getUserEmail = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).email;
};

export const getIdCommercial = () => {
  const token = localStorage.getItem("token");
  if (getUserRol() === 0) {
    return jwt_decode(token).idComercial;
  }
};

export const getIdEmpresa = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).idEmpresa;
};

export const getUserRol = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).rol;
};
