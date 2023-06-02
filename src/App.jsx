import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Home />} />
        <Route path="users" element={<Users />}>
          <Route path=":userId" element={<CardPosts />} />
        </Route>
        <Route path="products" element={<Products />}/>
        <Route path="/products/:productId" element={<Product />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
