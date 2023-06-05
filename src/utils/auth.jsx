//*Archivo en el que incluiré las funciones de seguridad de las rutas
import { Route, Navigate } from "react-router-dom";

export const isUserAuthenticated = () => {
  // Lógica para verificar si el usuario está autenticado
  // Retorna true si el usuario está autenticado, o false en caso contrario
  return true;
};

export const checkPrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      component={
        isUserAuthenticated() ? <Component /> : <Navigate to="/login" replace />
      }
    />
  );
};
