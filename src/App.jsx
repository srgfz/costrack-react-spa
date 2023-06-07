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
        <Route index element={<Home />} />
        <Route path="orders" element={<Order />}>
          {/* <Route path="/new-customer" element={<NewCustomer />} /> */}
        </Route>
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
        <Route path="bills" element={<Bill />}>
          {/* <Route path="/new-customer" element={<NewCustomer />} /> */}
        </Route>
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
        <Route
          path="commercial"
          element={
            checkTokenValidity() && getUserRol() === 1 ? (
              <Commercial />
            ) : (
              <NotAuth />
            )
          }
        >
          {/* <Route path=":commercialId" element={<NewCustomer />} /> */}
        </Route>
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
        <Route path="customers" element={<Customer />}>
          {/* <Route path="/new-customer" element={<NewCustomer />} /> */}
        </Route>
        <Route path="new-customer" element={<NewCustomer />} />
        <Route path="products" element={<Product />}>
          {/* <Route path="/new-customer" element={<NewCustomer />} /> */}
        </Route>
        <Route path="new-product" element={<NewProduct />} />

        <Route path="profile" element={<UserProfile />} />
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
