/* eslint-disable react/prop-types */
//*Archivo en el que incluiré las funciones de seguridad de las rutas
import { Route, Navigate } from "react-router-dom";

export const checkPrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      element={
        checkTokenValidity() ? <Component /> : <Navigate to="/login" replace />
      }
    />
  );
};

export const saveToken = (token) => {
  // Lógica para guardar el token en el sessionStorage
  sessionStorage.setItem("token", token);
};

export const getToken = () => {
  // Lógica para obtener el token del sessionStorage
  return sessionStorage.getItem("token");
};

export const removeToken = () => {
  sessionStorage.removeItem("token");
};

const validateTokenLocally = (token) => {
  // Aquí puedes implementar tu lógica de validación local del token
  // Por ejemplo, puedes verificar la caducidad del token o su firma
  // Devuelve true si el token es válido, de lo contrario, devuelve false
  return true;
};

const handleInvalidToken = () => {
  // Aquí puedes implementar las acciones necesarias cuando el token es inválido
  // Por ejemplo, cerrar sesión y mostrar un mensaje de error
};

export const checkTokenValidity = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    const isValidToken = validateTokenLocally(token);
    if (!isValidToken) {
      return false;
    }
  } else {
    return false;
  }
  return true;
};
