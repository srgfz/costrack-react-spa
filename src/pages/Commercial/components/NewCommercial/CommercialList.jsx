/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const CommercialList = ({ data }) => {
  console.log(data);
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

    return slicedData.map((commercial, index) => (
      <ul
        key={index}
        className="d-flex flex-wrap flex-md-row gap-2 align-items-center justify-content-evenly col-10 bg-secondary bg-opacity-25 p-2 py-3 rounded shado-sm flex-column flex-grow-1 flex-md-grow-0"
      >
        <li className="bg-primary bg-gradient bg-opacity-25 p-3 px-4 rounded col-10 col-md-auto">
          <div className="fw-bold">Nombre</div>
          <div className="ps-3">{commercial.nombre}</div>
        </li>
        <li className="bg-primary bg-gradient bg-opacity-25 p-3 px-4 rounded col-10 col-md-auto">
          <div className="fw-bold">Email</div>
          <div className="ps-3">
            <a href={"mailto:" + commercial.user.email} className="text-dark">
              {commercial.user.email}
            </a>
          </div>
        </li>
        <li className="bg-primary bg-gradient bg-opacity-25 p-3 px-4 rounded col-10 col-md-auto">
          <div className="fw-bold">DNI</div>
          <div className="ps-3">{commercial.dni}</div>
        </li>
        <li className="d-flex flex-md-column gap-3 my-3">
          <Link
            className="addBtn addBtn--form px-3 py-1"
            to={"/panel/" + commercial.id}
          >
            Panel Comercial
          </Link>
          <Link
            className="addBtn addBtn--form px-3 py-1"
            to={"/bills/" + commercial.id}
          >
            Gastos
          </Link>
          <Link
            className="addBtn addBtn--form px-3 py-1"
            to={"/orders/" + commercial.id}
          >
            Pedidos
          </Link>
        </li>
      </ul>
    ));
  };

  const shouldDisplayPagination = data.length > itemsPerPage;

  return (
    <div className="">
      <div className="mx-auto d-flex col-12 flex-wrap justify-content-center gap-3">
        {renderData()}
      </div>
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

export default CommercialList;
