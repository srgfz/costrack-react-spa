/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation } from "react-router-dom";
import { getIdCommercial } from "../../../utils/auth";
import "./../Customer.css";

const CustomerTable = ({ data }) => {
  const location = useLocation();
  console.log(location.pathname);

  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const saveCart = (ev) => {
    let cart = {
      clienteId: ev.target.id,
      comercialId: getIdCommercial(),
      nombre:
        ev.target.parentElement.parentElement.firstElementChild
          .firstElementChild.textContent,
      nombre_contacto:
        ev.target.parentElement.parentElement.firstElementChild
          .nextElementSibling.textContent,
      articulos: [],
    };
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(JSON.parse(localStorage.getItem("cart")));
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = data.slice(startIndex, endIndex);

    return slicedData.map((customer, index) => (
      <tr key={index} className="">
        <td>
          <Link
            className="d-flex flex-column ps-3"
            to={"/customer/" + customer.id}
          >
            <span>{customer.nombre} </span>
            <span className="ps-2">({customer.nombre_contacto})</span>
          </Link>
        </td>
        <td className="d-none d-md-table-cell">
          <a href={"mailto:" + customer.email} className="text-dark">
            {customer.email}
          </a>
        </td>
        {location.pathname !== "/new-order" ? (
          <td className="">{customer.telefono}</td>
        ) : null}

        {location.pathname === "/new-order" ? (
          <td className="my-1 text-center">
            <Link
              id={customer.id}
              className="btnOrder"
              to="/products"
              onClick={(ev) => saveCart(ev)}
            >
              Nuevo Pedido
            </Link>
          </td>
        ) : null}
      </tr>
    ));
  };

  const shouldDisplayPagination = data.length > itemsPerPage;

  return (
    <div className="">
      <table className="table table-striped table-hover">
        <thead>
          <tr className=" align-top">
            <th>Nombre</th>
            <th className="d-none d-md-table-cell">Email</th>
            {location.pathname !== "/new-order" ? <th>Teléfono</th> : null}
            {location.pathname === "/new-order" ? (
              <th>Selecciona un Cliente</th>
            ) : null}
          </tr>
        </thead>
        <tbody className=" align-middle">{renderData()}</tbody>
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
