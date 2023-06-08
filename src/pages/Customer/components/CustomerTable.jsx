/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactPaginate from "react-paginate";

const CustomerTable = ({ data }) => {
  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = data.slice(startIndex, endIndex);

    return slicedData.map((customer, index) => (
      <tr key={index}>
        <td>{customer.nombre}</td>
        <td>{customer.nombre_contacto}</td>
        <td>{customer.email}</td>
        <td>{customer.telefono}</td>
        <td>{customer.direccion}</td>
      </tr>
    ));
  };

  const shouldDisplayPagination = data.length > itemsPerPage;

  return (
    <div className="">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre Empresa</th>
            <th>Nombre de contacto</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
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

export default CustomerTable;
