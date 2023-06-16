/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const OrdersTable = ({ data }) => {
  console.log(data);
  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("asc");
  const [dataToShow, setDataToShow] = useState(data);

  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

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

  useEffect(() => {
    setDataToShow(data);
  }, [data]);

  useEffect(() => {
    sortData();
  }, [sortColumn, sortDirection]);

  const sortData = () => {
    const sortedData = [...dataToShow].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    setDataToShow(sortedData);
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = dataToShow.slice(startIndex, endIndex);

    return slicedData.map((order, index) => (
      <tr key={index}>
        <td className="table-cell-fixed-width">{formatDate(order.fecha)}</td>
        <td className="table-cell-fixed-width">{order.cliente}</td>
        <td className="table-cell-fixed-width">
          {order.total.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
            groupingSeparator: ".",
            decimalSeparator: ",",
          })}{" "}
          €
        </td>
        <td className="table-cell-fixed-width d-none d-md-table-cell">
          {order.direccion}
        </td>
      </tr>
    ));
  };

  const getSortIndicator = (columnName) => {
    if (sortColumn === columnName) {
      return sortDirection === "asc" ? (
        <span>
          <i className="bi bi-caret-up ms-1"></i>
        </span>
      ) : (
        <span>
          <i className="bi bi-caret-down ms-1"></i>
        </span>
      );
    }
    return null;
  };

  const shouldDisplayPagination = dataToShow.length > itemsPerPage;

  return (
    <div className="">
      <table className="table table-striped table-hover">
        <thead>
          <tr className=" align-top">
            <th onClick={() => handleSort("fecha")}>
              Fecha {getSortIndicator("fecha")}
            </th>
            <th onClick={() => handleSort("cliente")}>
              Cliente {getSortIndicator("cliente")}
            </th>
            <th onClick={() => handleSort("total")}>
              Total {getSortIndicator("total")}
            </th>
            <th className="d-none d-md-table-cell">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {console.log(dataToShow)}
          {dataToShow.length > 0 ? (
            renderData()
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                --- No hay ningún registro para los filtros indicados ---
              </td>
            </tr>
          )}
        </tbody>
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
