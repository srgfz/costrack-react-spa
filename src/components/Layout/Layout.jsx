import "./Layout.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
//Importo el Outlet
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="container-fluid mx-0 px-0 bg-light min-vh-100">
      <Header />
      <main className="px-2 py-1 py-md-2 px-md-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
