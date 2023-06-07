import "./Header.css";
import NavApp from "../NavApp/NavApp";
import { getUserRol } from "./../../utils/auth";
import NavAppEmpresa from "../NavAppEmpresa/NavAppEmpresa";

function Header() {
  return (
    <header className="header sticky-md-top">
      {getUserRol() === 0 ? <NavApp /> : <NavAppEmpresa />}
    </header>
  );
}

export default Header;
