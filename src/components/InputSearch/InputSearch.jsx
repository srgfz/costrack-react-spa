/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputSearch = ({ type, newOrder = false }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search) {
      if (newOrder) {
        // Navega a la ruta correspondiente para realizar una búsqueda dentro del proceso de nuevo pedido
        navigate(`/new-order/search-${type}/${search}`);
        e.target.lastElementChild.value = "";
        e.target.lastElementChild.blur();
      } else {
        // Navega a la ruta correspondiente para realizar una búsqueda general, determinada por el valor de type
        navigate(`/search-${type}/${search}`);
        e.target.lastElementChild.value = "";
        e.target.lastElementChild.blur();
      }
    }
  };

  return (
    <form
      className="form-control d-flex header__search mw-100"
      role="search"
      onSubmit={handleSubmit}
    >
      <i className="bi bi-search px-2"></i>
      <input
        className="border-0 search__input"
        type="search"
        placeholder={`Buscar ${type}`}
        aria-label="Search"
        onChange={(e) => setSearch(e.target.value)}
      ></input>
    </form>
  );
};

export default InputSearch;
