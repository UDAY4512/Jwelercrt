// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import AddProduct from "./pages/AddProduct";
import ViewProducts from "./pages/ViewProducts";
import Settings from "./pages/Settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="add" element={<AddProduct />} />
        <Route path="products" element={<ViewProducts />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
