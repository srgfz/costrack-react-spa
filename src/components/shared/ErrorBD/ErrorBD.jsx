/* eslint-disable react/prop-types */
const ErrorBD = ({ type = "bd" }) => {
  return (
    <div>
      {type === "bd" ? (
        <div className="">
          Base de Datos en mantenimiento, por favor, intentelo más tarde
        </div>
      ) : type === "date" ? (
        <div className="">No hay registros entre las fechas indicadas</div>
      ) : type === "null" ? (
        <div className="">
          No existe ningún registro con los parámetros indicados
        </div>
      ) : (
        <div className="">Recurso no encontrado</div>
      )}
    </div>
  );
};

export default ErrorBD;
