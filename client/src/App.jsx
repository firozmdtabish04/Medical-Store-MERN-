import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function Unauthorized() {
  return <h1>403 - Unauthorized</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* CUSTOMER */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* PHARMACIST */}
        <Route
          path="/pharmacist/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PHARMACIST"]}>
              <PharmacistDashboard />
            </ProtectedRoute>
          }
        />

        {/* DELIVERY */}
        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
