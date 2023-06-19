/* eslint-disable react/prop-types */

// Componente de error de base de datos
const ErrorBD = ({ type = "bd" }) => {
  return (
    <div className="error">
      {type === "bd" ? (
        // Error de base de datos
        <div className="">
          Base de Datos en mantenimiento, por favor, intentelo más tarde
        </div>
      ) : type === "date" ? (
        // Error de falta de registros entre las fechas indicadas
        <div className="">No hay registros entre las fechas indicadas</div>
      ) : type === "null" ? (
        // Error de falta de registros con los parámetros indicados
        <div className="">
          No existe ningún registro con los parámetros indicados
        </div>
      ) : (
        // Error de recurso no encontrado
        <div className="">Recurso no encontrado</div>
      )}
    </div>
  );
};

export default ErrorBD;
