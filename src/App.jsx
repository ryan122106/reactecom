import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";

import Products from "./pages/Products";
import ProductAdd from "./pages/ProductAdd";
import ProductEdit from "./pages/ProductEdit";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products/new" element={<ProductAdd />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        <Route path="/products/cart" element={<CartPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
