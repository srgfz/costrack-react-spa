import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation } from "react-router-dom";
import { getIdCommercial } from "../../../utils/auth";
import "./../Customer.css";

const CustomerTable = ({ data }) => {
  const location = useLocation();

  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const [dataToShow, setDataToShow] = useState(data); // Datos a mostrar en la tabla después de aplicar el ordenamiento
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState("nombre");
  const [sortDirection, setSortDirection] = useState("asc");

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
  };

  const renderData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = dataToShow.slice(startIndex, endIndex);

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
        {!location.pathname.includes("new-order") ? (
          <td className="">{customer.telefono}</td>
        ) : null}

        {location.pathname.includes("new-order") ? (
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
    if (sortColumn === "nombre" || sortColumn === "email") {
      const sortedData = [...dataToShow].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (valueA < valueB) {
          return sortDirection === "asc" ? -1 : 1;
        } else if (valueA > valueB) {
          return sortDirection === "asc" ? 1 : -1;
        } else {
          return 0;
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
        <thead>
          <tr className=" align-top">
            <th
              onClick={() => handleSort("nombre")}
              style={{ cursor: "pointer" }}
            >
              Nombre {getSortIndicator("nombre")}
            </th>
            <th
              className="d-none d-md-table-cell"
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email {getSortIndicator("email")}
            </th>
            {location.pathname !== "/new-order" ? (
              <th>Teléfono {getSortIndicator("telefono")}</th>
            ) : null}
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
