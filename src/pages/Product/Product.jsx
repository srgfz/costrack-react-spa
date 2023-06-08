/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getIdEmpresa, getUserRol } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import ReactPaginate from "react-paginate";
import ProductCard from "./components/ProductCard";

const Product = () => {
  const empresaId = getIdEmpresa();
  const { isLoading, data, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState(
    `http://localhost:3000/costrack/empresas/articulos/${empresaId}`
  );

  const itemsPerPage = 12; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [shouldDisplayPagination, setShouldDisplayPagination] = useState(false);

  const actualizarDatos = () => {
    const newEndpoint = `http://localhost:3000/costrack/empresas/articulos/${empresaId}`;
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  };

  useEffect(() => {
    actualizarDatos();
  }, []);

  useEffect(() => {
    if (data && data.articulos) {
      setTotalPages(Math.ceil(data.articulos.length / itemsPerPage));
      setShouldDisplayPagination(data.articulos.length > itemsPerPage);
    }
  }, [data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    if (data && data.articulos) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const slicedData = data.articulos.slice(startIndex, endIndex);
      return slicedData.map((articulo, index) => (
        <div className="col-10 col-md-5 col-lg-3 flex-grow-1" key={index}>
          <ProductCard data={articulo} />
        </div>
      ));
    }
    return null;
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : !data ? (
        <ErrorBD />
      ) : (
        <div>
          <div className="d-flex justify-content-between">
            <h2>Artículos de {data.nombre}</h2>
            {getUserRol() === 1 ? (
              <Link className="btn btn-primary addBtn" to={"/new-product"}>
                Añadir Artículo
              </Link>
            ) : null}
          </div>
          <div className="py-3 mx-3">
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {renderData()}
            </div>
            {shouldDisplayPagination && (
              <div className="pagination-container my-4">
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
        </div>
      )}
    </div>
  );
};

export default Product;
