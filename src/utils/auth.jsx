import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  return <Navigate to="/login" replace />; // Redirecciona a la página de inicio de sesión después de cerrar sesión
};

// Función para validar el token localmente
const validateTokenLocally = (token) => {
  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos

    // Verificar la caducidad del token
    if (decodedToken.exp < currentTime) {
      return false; // El token ha caducado
    }
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
        return false; // El token no es válido
      }
    } else {
      return false; // No hay token almacenado
    }

    return true; // El token es válido
  } catch (error) {
    return false; // Error al verificar el token
  }
};

export const getUserId = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).userId; // Obtiene el ID del usuario almacenado en el token
};

export const getUserEmail = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).email; // Obtiene el correo electrónico del usuario almacenado en el token
};

export const getIdCommercial = () => {
  const token = localStorage.getItem("token");

  if (getUserRol() === 0) {
    return jwt_decode(token).idComercial; // Obtiene el ID del comercial almacenado en el token si el rol del usuario es 0 (cliente)
  }
};

export const getIdEmpresa = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).idEmpresa; // Obtiene el ID de la empresa almacenado en el token
};

export const getUserRol = () => {
  const token = localStorage.getItem("token");
  return jwt_decode(token).rol; // Obtiene el rol del usuario almacenado en el token
};
