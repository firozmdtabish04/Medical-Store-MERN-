import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/ProtectedRoute";

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

function Unauthorized() {
  return <h1>403 - Unauthorized</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Route>

        {/* ================= CUSTOMER ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        </Route>

        {/* ================= PHARMACIST ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["PHARMACIST"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/pharmacist/dashboard"
            element={<PharmacistDashboard />}
          />
        </Route>

        {/* ================= DELIVERY ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        </Route>

        {/* ================= ADMIN ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* ================= UNAUTHORIZED ================= */}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
