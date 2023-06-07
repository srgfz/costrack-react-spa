/* eslint-disable react/prop-types */

const BillsTable = ({ data }) => {
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
        {console.log(data)}
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Entidad Emisora</th>
            <th>Categoría</th>
            <th>Cuantía</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bill, index) => (
            <tr key={index}>
              <td>{formatDate(bill.fecha_gasto)}</td>
              <td>{bill.nombre_emisor}</td>
              <td>{bill.categoria}</td>
              <td>{bill.cuantia.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillsTable;
