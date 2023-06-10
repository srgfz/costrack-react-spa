/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const BillsTable = ({ data }) => {
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

    return slicedData.map((bill, index) => (
      <tr key={index}>
        <td>
          <Link to={"/bill/" + bill.id}>{formatDate(bill.fecha_gasto)}</Link>
        </td>
        <td>{bill.nombre_emisor}</td>
        <td>{bill.categoria}</td>
        <td>{bill.cuantia.toFixed(2)} €</td>
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
            <th>Entidad Emisora</th>
            <th>Categoría</th>
            <th>Cuantía</th>
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

export default BillsTable;
