import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getIdEmpresa, getUserRol } from "./../../utils/auth";
import useFetch from "./../../hooks/useFetch";
import Spinner from "../../components/shared/Spinner/Spinner";
import ErrorBD from "../../components/shared/ErrorBD/ErrorBD";
import ReactPaginate from "react-paginate";
import ProductCard from "./components/ProductCard";
import "./Products.css";
import InputSearch from "../../components/InputSearch/InputSearch";

const Product = () => {
  const { q } = useParams();

  const empresaId = getIdEmpresa();
  const { isLoading, data, error, fetchData } = useFetch();
  const [endpoint, setEndpoint] = useState();
  const [dataToShow, setDataToShow] = useState([]);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [shouldDisplayPagination, setShouldDisplayPagination] = useState(false);
  const [sortOption, setSortOption] = useState("asc_name");

  const actualizarDatos = () => {
    if (q) {
      const newEndpoint = `http://localhost:3000/costrack/empresas/articulos/${empresaId}?q=${q}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    } else {
      const newEndpoint = `http://localhost:3000/costrack/empresas/articulos/${empresaId}`;
      setEndpoint(newEndpoint);
      fetchData(newEndpoint);
    }
  };

  useEffect(() => {
    actualizarDatos();
  }, [q]);

  useEffect(() => {
    actualizarDatos();
  }, []);

  useEffect(() => {
    if (data && data.articulos) {
      // Ordenar los datos alfabéticamente por nombre
      const sortedData = [...data.articulos].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setDataToShow(sortedData);

      setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      setShouldDisplayPagination(sortedData.length > itemsPerPage);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.articulos) {
      setTotalPages(Math.ceil(dataToShow.length / itemsPerPage));
      setShouldDisplayPagination(dataToShow.length > itemsPerPage);
    }
  }, [dataToShow]);

  useEffect(() => {
    sortData();
  }, [sortOption]);

  const handleSort = (event) => {
    setSortOption(event.target.value);
  };

  const sortData = () => {
    if (data && data.articulos) {
      const sortedData = [...data.articulos];

      switch (sortOption) {
        case "asc_name":
          sortedData.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case "desc_name":
          sortedData.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
        case "asc_price":
          sortedData.sort((a, b) => a.precio_base - b.precio_base);
          break;
        case "desc_price":
          sortedData.sort((a, b) => b.precio_base - a.precio_base);
          break;
        case "asc_stock":
          sortedData.sort((a, b) => a.stock - b.stock);
          break;
        case "desc_stock":
          sortedData.sort((a, b) => b.stock - a.stock);
          break;
        default:
          break;
      }

      setDataToShow(sortedData);
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const renderData = () => {
    if (data && data.articulos) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const slicedData = dataToShow.slice(startIndex, endIndex);
      return slicedData.map((articulo, index) => (
        <div
          className="col-10 col-md-5 col-lg-3 flex-grow-1 product mx-2 my-3 product"
          key={index}
        >
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
      ) : error ? (
        <ErrorBD type="bd" />
      ) : !data ? (
        <ErrorBD type="null" />
      ) : (
        <div>
          <div className="d-flex justify-content-between my-2">
            {q ? (
              <h2>Productos relacionados con "{q}"</h2>
            ) : (
              <h2 className="d-flex flex-wrap">
                Productos de <span className="ms-1">{data.nombre}</span>{" "}
              </h2>
            )}
            {getUserRol() === 1 ? (
              <Link className="btn btn-primary addBtn" to={"/new-product"}>
                Añadir Artículo
              </Link>
            ) : (
              <Link className="btn btn-primary addBtn" to={"/order"}>
                Ver Pedido
              </Link>
            )}
          </div>
          <div className="d-lg-none">
            <InputSearch type={"productos"} />
          </div>
          <div className="py-3 mx-3">
            <div className="d-flex justify-content-end mb-3 form-floating col-md-4">
              <select
                value={sortOption}
                onChange={handleSort}
                className="form-select"
              >
                <option value="asc_name">Ordenar por nombre ascendente</option>
                <option value="desc_name">
                  Ordenar por nombre descendente
                </option>
                <option value="asc_price">Ordenar por precio ascendente</option>
                <option value="desc_price">
                  Ordenar por precio descendente
                </option>
                <option value="asc_stock">Ordenar por stock ascendente</option>
                <option value="desc_stock">
                  Ordenar por stock descendente
                </option>
              </select>
              <label htmlFor="categorySelect">Ordenar Artículos</label>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-2 products">
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
