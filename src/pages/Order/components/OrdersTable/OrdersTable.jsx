/* eslint-disable react/prop-types */
const OrdersTable = ({ data }) => {
  const formatDate = (date) => {
    const formatDate = new Date(date);
    const year = formatDate.getFullYear();
    const mes = formatDate.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
    const dia = formatDate.getDate();

    // Formatear el mes y día con ceros a la izquierda si es necesario
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const diaFormateado = dia < 10 ? `0${dia}` : dia;

    return `${diaFormateado}/${mesFormateado}/${year}`;
  };

  return (
    <div className="">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Importe Total</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => (
            <tr key={index}>
              <td>{formatDate(order.fecha)}</td>
              <td>{order.cliente}</td>
              <td>{order.total} €</td>
              <td>{order.comentarios}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
