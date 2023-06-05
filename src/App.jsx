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
import { checkTokenValidity } from "./utils/auth";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";

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
        <Route path="orders" element={<Order />} />
        <Route path="bills" element={<Bill />} />
        <Route path="customers" element={<Customer />} />
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
