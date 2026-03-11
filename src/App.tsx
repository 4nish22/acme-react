import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/authpage";
import ProductPage from "./pages/product/product-list";
import ProtectedRoute from "./components/auth/protectedRoute";
import AppLayout from "./components/layout/appLayout";
import ProductDetail from "./pages/product/product-detail";
import CheckoutPage from "./components/sub-components/checkout";

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>{" "}
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
