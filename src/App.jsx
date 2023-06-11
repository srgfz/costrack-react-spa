import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Order from "./pages/Order/Order";
import Bill from "./pages/Bill/Bill";
import Customer from "./pages/Customer/Customer";
import UserProfile from "./pages/UserProfile/UserProfile";
import { checkTokenValidity, getUserRol } from "./utils/auth";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import Product from "./pages/Product/Product";
import NewCustomer from "./pages/Customer/components/NewCustomer";
import NewProduct from "./pages/Product/components/NewProduct/NewProduct";
import Commercial from "./pages/Commercial/Commercial";
import NewCommercial from "./pages/Commercial/components/NewCommercial/NewCommercial";
import NewOrder from "./pages/Order/components/NewOrder/NewOrder";
import NewBill from "./pages/Bill/components/NewBill/NewBill";
import NotAuth from "./pages/NotAuth/NotAuth";
import ProductCardDetails from "./pages/Product/components/ProductCardDetails";
import OrderDetails from "./pages/Order/components/OrderDetails/OrderDetails";

function App() {
  const location = useLocation();

  if (!checkTokenValidity() && location.pathname !== "/login") {
    // Redireccionar al inicio de sesión si el token no es válido y no estamos en la página de inicio de sesión
    return <Navigate to="/login" />;
  } else if (checkTokenValidity() && location.pathname === "/login") {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/" element={checkTokenValidity() ? <Layout /> : <Login />}>
        <Route
          index
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <Commercial />
            ) : (
              <Home />
            )
          }
        />

        {/* Pedidos */}
        <Route path="orders" element={<Order />} />
        <Route path="orders/action/:type" element={<Order />} />
        <Route
          path="orders/:commercialId"
          element={
            checkTokenValidity() && getUserRol() === 1 ? <Order /> : <NotAuth />
          }
        />
        <Route
          path="new-order"
          element={
            checkTokenValidity() && getUserRol() === 0 ? (
              <NewOrder />
            ) : (
              <NotAuth />
            )
          }
        />
        <Route
          path="order"
          element={
            checkTokenValidity() && getUserRol() === 0 ? (
              <OrderDetails />
            ) : (
              <NotAuth />
            )
          }
        />
        {/* Gastos */}
        <Route
          path="bills"
          element={
            checkTokenValidity() && getUserRol() === 0 ? <Bill /> : <NotAuth />
          }
        />
        <Route
          path="bills/action/:type"
          element={
            checkTokenValidity() && getUserRol() === 0 ? <Bill /> : <NotAuth />
          }
        />

        <Route
          path="bills/:commercialId"
          element={
            checkTokenValidity() && getUserRol() === 1 ? <Bill /> : <NotAuth />
          }
        />
        <Route path="bill/:billId" element={<NewBill />} />
        <Route
          path="new-bill"
          element={
            checkTokenValidity() && getUserRol() === 0 ? (
              <NewBill />
            ) : (
              <NotAuth />
            )
          }
        />
        {/* Comerciales */}
        <Route
          path="commercial"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <Commercial />
            ) : (
              <NotAuth />
            )
          }
        ></Route>
        <Route
          path="commercial/action/:type"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <Commercial />
            ) : (
              <NotAuth />
            )
          }
        ></Route>
        <Route
          path="commercial/:commercialId"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <NewCommercial />
            ) : (
              <NotAuth />
            )
          }
        ></Route>
        <Route
          path="search-comerciales/:q"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <Commercial />
            ) : (
              <NotAuth />
            )
          }
        ></Route>
        <Route
          path="new-commercial"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <NewCommercial />
            ) : (
              <NotAuth />
            )
          }
        />
        {/* Clientes */}
        <Route path="customers" element={<Customer />} />
        <Route path="search-clientes/:q" element={<NewOrder />} />
        <Route path="new-customer" element={<NewCustomer />} />
        <Route path="customer/:customerId" element={<NewCustomer />} />
        <Route path="customers/action/:type" element={<Customer />} />

        {/* Productos */}
        <Route path="products" element={<Product />} />
        <Route path="products/:productId" element={<ProductCardDetails />} />
        <Route
          path="editProduct/:productId"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <NewProduct />
            ) : (
              <NotAuth />
            )
          }
        />
        <Route
          path="new-product"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <NewProduct />
            ) : (
              <NotAuth />
            )
          }
        />
        <Route path="search-productos/:q" element={<Product />} />
        {/* Perfil */}
        <Route path="profile" element={<UserProfile />} />
        <Route
          path="panel/:commercialId"
          element={
            checkTokenValidity() && getUserRol() === 1 ? <Home /> : <NotAuth />
          }
        />

        {/* Otras rutas que no existen */}
        <Route
          path="/*"
          element={checkTokenValidity() ? <NotFound /> : <Login />}
        />
      </Route>
    </Routes>
  );
}

function RouterWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default RouterWrapper;
