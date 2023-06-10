/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const InputSearch = ({ type }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.trim) {
      navigate(`/search-${type}/${search}`);
      e.target.lastElementChild.value = "";
      e.target.lastElementChild.blur();

      console.log(e.target);
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
        placeholder={`Buscar ` + type}
        aria-label="Search"
        onChange={(e) => setSearch(e.target.value)}
      ></input>
    </form>
  );
};

export default InputSearch;
