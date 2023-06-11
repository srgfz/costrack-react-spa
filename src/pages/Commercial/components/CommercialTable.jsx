/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactPaginate from "react-paginate";

const CommercialTable = ({ data }) => {
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
      <li key={index} className="my-4">
        <div>Nombre</div>
        <div>{customer.nombre}</div>
      </li>
    ));
  };

  const shouldDisplayPagination = data.length > itemsPerPage;

  return (
    <div className="">
      <ul>{renderData()}</ul>
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

export default CommercialTable;
