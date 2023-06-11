/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactPaginate from "react-paginate";

const OrdersTable = ({ data }) => {
  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = data.slice(startIndex, endIndex);

    return slicedData.map((order, index) => (
      <tr key={index}>
        <td>{formatDate(order.fecha)}</td>
        <td>{order.cliente}</td>
        <td>{order.total.toFixed(2)} €</td>
        <td className="">{order.direccion}</td>
      </tr>
    ));
  };

  const shouldDisplayPagination = data.length > itemsPerPage;

  return (
    <div className="">
      <table className="table table-striped table-hover">
        <thead>
          <tr className=" align-top">
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Importe Total</th>
            <th className="">Dirección</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </table>
      {shouldDisplayPagination && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={"← Anterior"}
            nextLabel={"Siguiente →"}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination-link"}
            nextLinkClassName={"pagination-link"}
            disabledClassName={"pagination-disabled"}
            activeClassName={"pagination-active"}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
