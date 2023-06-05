import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Order from "./pages/Order/Order";
import Bill from "./pages/Bill/Bill";
import Customer from "./pages/Customer/Customer";
import UserProfile from "./pages/UserProfile/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="orders" element={<Order />} />
          <Route path="bills" element={<Bill />} />
          <Route path="customers" element={<Customer />} />
          <Route path="porfil" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
