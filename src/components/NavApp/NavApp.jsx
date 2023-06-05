import "./NavApp.css";
//Importamos también el componente link de react-router-dom, que será el que utilizaremos para irigirnos
import { Link } from "react-router-dom";

function NavApp() {
  return (
    <nav className="navbar navbar-expand-lg px-md-4 header__nav">
      <div className="container-fluid">
        <div className="nav-item d-lg-none">
          <div className="btn-group bg-transparent align-items-center position-relative">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle btn bg-transparent img-container p-0 nav__porfileimg"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="./src/assets/images/porfile.jpg"
                  alt="Imagen de perfil"
                  className="object-fit-contain img-fluid rounded-circle"
                />
              </a>
              <ul className="dropdown-menu p-0">
                <li>
                  <Link to="/porfile" className="dropdown-item">
                    Editar Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/log-out" className="dropdown-item">
                    Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Link to="/" className="col-3 header__logo">
          <img
            src="./src/assets/images/logo/logo-nobg/logo1.png"
            alt="Logo CosTrack"
            className="d-none d-md-block img-fluid"
          />
          <img
            src="./src/assets/images/logo/logo-nobg/logo2.png"
            alt="Logo CosTrack"
            className="d-md-none img-fluid"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-lg-flex justify-content-between"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-lg-5 mb-2 mb-lg-0 d-flex flex-column flex-lg-row align-items-center justify-content-center">
            <li className="nav-item d-lg-none my-1 col-12 col-md-7">
              <div className="">
                <form
                  className="form-control d-flex header__search mw-100"
                  role="search"
                >
                  <i className="bi bi-search px-2"></i>
                  <input
                    className="border-0 search__input"
                    type="search"
                    placeholder="Buscar Artículo"
                    aria-label="Search"
                  ></input>
                </form>
              </div>
            </li>
            <li className="nav-item dropdown d-lg-none w-75 text-center">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Pedidos
              </a>
              <ul className="dropdown-menu text-center w-75 mx-auto">
                <li>
                  <Link to="/orders" className=" nav-link ">
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <Link to="/new-order" className="nav-link p-1">
                    Registrar Pedido
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item d-none d-lg-block">
              <div className="btn-group">
                <button type="button" className="btn pe-0">
                  <Link to="/orders" className=" nav-link ">
                    Mis Pedidos
                  </Link>
                </button>
                <button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu p-0">
                  <li className="dropdown-item">
                    <Link to="/new-order" className="nav-link p-1">
                      Registrar Pedido
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item dropdown d-lg-none w-75 text-center">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Gastos
              </a>
              <ul className="dropdown-menu text-center w-75 mx-auto">
                <li>
                  <Link to="/bills" className="nav-link">
                    Mis Gastos
                  </Link>
                </li>
                <li>
                  <Link to="/new-bill" className="nav-link p-1">
                    Registrar Gasto
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item d-none d-lg-block">
              <div className="btn-group">
                <button type="button" className="btn pe-0">
                  <Link to="/bills" className="nav-link">
                    Mis Gastos
                  </Link>
                </button>
                <button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split  border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu p-0">
                  <li className="dropdown-item">
                    <Link to="/new-bill" className="nav-link p-1">
                      Registrar Gasto
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item dropdown d-lg-none w-75 text-center">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Clientes
              </a>
              <ul className="dropdown-menu text-center w-75 mx-auto">
                <li>
                  <Link to="/customers" className="nav-link">
                    Mis Clientes
                  </Link>
                </li>
                <li>
                  <Link to="/new-customer" className="nav-link p-1">
                    Registrar Cliente
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item d-none d-lg-block">
              <div className="btn-group">
                <button type="button" className="btn pe-0">
                  <Link to="/customers" className="nav-link">
                    Clientes
                  </Link>
                </button>
                <button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split  border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu p-0">
                  <li className="dropdown-item">
                    <Link to="/new-customer" className="nav-link p-1">
                      Registrar Cliente
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <form
            className="form-control me-4 header__search d-none d-lg-flex"
            role="search"
          >
            <i className="bi bi-search px-2"></i>
            <input
              className="border-0 search__input"
              type="search"
              placeholder="Buscar Artículo"
              aria-label="Search"
            ></input>
          </form>

          <div className="nav-item d-none d-lg-block">
            <div className="btn-group bg-transparent align-items-center position-relative">
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle btn bg-transparent img-container p-0 nav__porfileimg"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="./src/assets/images/porfile.jpg"
                    alt="Imagen de perfil"
                    className="object-fit-contain img-fluid rounded-circle"
                  />
                </a>
                <ul className="dropdown-menu p-0 position-absolute porfile__items">
                  <li>
                    <Link to="/porfile" className="dropdown-item">
                      Editar Perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/log-out" className="dropdown-item">
                      Cerrar Sesión
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavApp;
