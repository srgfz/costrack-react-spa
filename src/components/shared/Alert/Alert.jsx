/* eslint-disable react/prop-types */
const Alert = ({ type }) => {
  return (
    <div className="">
      {type === "deleted" ? (
        <div
          className="alert alert-danger alert-dismissible fade show fw-semibold"
          role="alert"
        >
          Registro Eliminado Correctamente
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      ) : type === "updated" ? (
        <div
          className="alert alert-info alert-dismissible fade show  fw-semibold"
          role="alert"
        >
          Registro Actualizado Correctamente
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      ) : type === "post" ? (
        <div
          className="alert alert-success alert-dismissible fade show  fw-semibold"
          role="alert"
        >
          Registro Insertado Correctamente
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
