/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const BillsTable = ({ data }) => {
  console.log(data);
  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const [dataToShow, setDataToShow] = useState(data);
  const [sortColumn, setSortColumn] = useState("fecha_gasto");
  const [sortDirection, setSortDirection] = useState("desc");

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

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = dataToShow.slice(startIndex, endIndex);

    return slicedData.map((bill, index) => (
      <tr key={index}>
        <td className="w-25">
          <Link to={"/bill/" + bill.id}>{formatDate(bill.fecha_gasto)}</Link>
        </td>
        <td className="d-none d-md-table-cell w-25">{bill.nombre_emisor}</td>
        <td className="w-25">{bill.categoria}</td>
        <td className="w-25">
          {bill.cuantia.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
            groupingSeparator: ".",
            decimalSeparator: ",",
          })}{" "}
          €
        </td>
      </tr>
    ));
  };

  const shouldDisplayPagination = dataToShow.length > itemsPerPage;

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      // Si ya se está ordenando por la columna actual, invertir la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si se está ordenando por una columna diferente, establecer la nueva columna y la dirección ascendente
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (data) {
      setDataToShow(data);
    }
  }, [data]);

  useEffect(() => {
    if (sortColumn) {
      // Realizar el ordenamiento solo si hay una columna de ordenamiento seleccionada
      const sortedData = [...dataToShow].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (sortColumn === "fecha_gasto") {
          // Ordenar por fecha
          return sortDirection === "asc"
            ? new Date(valueA) - new Date(valueB)
            : new Date(valueB) - new Date(valueA);
        } else if (sortColumn === "cuantia") {
          // Ordenar por cuantía numérica
          return sortDirection === "asc"
            ? parseFloat(valueA) - parseFloat(valueB)
            : parseFloat(valueB) - parseFloat(valueA);
        } else {
          // Ordenar alfabéticamente
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });

      setDataToShow(sortedData);
    }
  }, [sortColumn, sortDirection]);

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

  return (
    <div className="">
      <table className="table table-striped table-hover">
        {/* Cabecera de la tabla */}
        <thead>
          <tr className="align-top">
            <th
              className="w-25 cursor-pointer"
              data-id="fecha"
              onClick={() => handleSort("fecha_gasto")}
            >
              Fecha {getSortIndicator("fecha_gasto")}
            </th>
            <th
              className="d-none d-md-table-cell w-25 cursor-pointer"
              data-id="emisora"
              onClick={() => handleSort("nombre_emisor")}
            >
              Entidad Emisora {getSortIndicator("nombre_emisor")}
            </th>
            <th
              className="w-25 cursor-pointer"
              data-id="categoria"
              onClick={() => handleSort("categoria")}
            >
              Categoría {getSortIndicator("categoria")}
            </th>
            <th
              className="w-25 cursor-pointer"
              data-id="cuantia"
              onClick={() => handleSort("cuantia")}
            >
              Cuantía {getSortIndicator("cuantia")}
            </th>
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

export default BillsTable;
