import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// LAYOUTS
// =====================================================

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// =====================================================
// AUTH PAGES
// =====================================================
import Medicines from "./pages/customer/Medicines";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Medicine from "./pages/medicine/Medicine";
// =====================================================
// AUTH PROTECTION
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";

// =====================================================
// DASHBOARDS
// =====================================================

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// =====================================================
// CUSTOMER PAGES
// =====================================================

import Orders from "./pages/customer/Orders";

// =====================================================
// COMMON PAGES
// =====================================================

import Profile from "./pages/dashboards/Profile";
import Cart from "./pages/customer/Cart";
// =====================================================
// ADMIN
// =====================================================

import OrderDetails from "./pages/customer/OrderDetails";
import OrderTracking from "./pages/customer/OrderTracking";
// =====================================================
// PHARMACIST
// =====================================================
import Inventory from "./pages/pharmacist/Inventory";
import PharmacyOrders from "./pages/pharmacist/PharmacyOrders";
// =====================================================
// 403 - UNAUTHORIZED
// =====================================================

function Unauthorized() {
  return (
    <div className="p-6 min-h-[60vh] justify-center flex items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">403</h1>

        <h2 className="mt-3 text-xl font-bold text-gray-800">Access Denied</h2>

        <p className="mt-2 text-gray-500">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// PAGE PLACEHOLDER
// =====================================================

function PagePlaceholder({ title }) {
  return (
    <div className="min-h-[50vh] justify-center flex items-center">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-500">
          This page is under development.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Route>

        {/* =================================================
            CUSTOMER ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}

          <Route path="/customer/dashboard" element={<CustomerDashboard />} />

          {/* Profile */}

          <Route path="/customer/profile" element={<Profile />} />

          {/* Find Medicine */}

          <Route path="/customer/medicines" element={<Medicines />} />

          {/* Nearby Pharmacies */}

          <Route
            path="/customer/pharmacies"
            element={<PagePlaceholder title="Nearby Pharmacies" />}
          />

          {/* Cart */}

          <Route path="/customer/cart" element={<Cart />} />

          {/* Orders */}

          <Route path="/customer/orders" element={<Orders />} />

          {/* Order Details */}

          <Route path="/customer/orders/:id" element={<OrderDetails />} />

          {/* Tracking */}

          <Route path="/customer/tracking" element={<OrderTracking />} />
        </Route>

        {/* =================================================
            PHARMACIST ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["PHARMACIST"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}

          <Route
            path="/pharmacist/dashboard"
            element={<PharmacistDashboard />}
          />

          {/* Profile */}

          <Route path="/pharmacist/profile" element={<Profile />} />

          {/* My Pharmacy */}

          <Route
            path="/pharmacist/pharmacy"
            element={<PagePlaceholder title="My Pharmacy" />}
          />

          {/* Inventory */}

          <Route path="/pharmacist/inventory" element={<Inventory />} />

          {/* Orders */}

          <Route path="/pharmacist/orders" element={<PharmacyOrders />} />

          {/* Sales */}

          <Route
            path="/pharmacist/sales"
            element={<PagePlaceholder title="Sales" />}
          />
        </Route>

        {/* =================================================
            DELIVERY ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}

          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

          {/* Profile */}

          <Route path="/delivery/profile" element={<Profile />} />

          {/* Available Deliveries */}

          <Route
            path="/delivery/available"
            element={<PagePlaceholder title="Available Deliveries" />}
          />

          {/* My Deliveries */}

          <Route
            path="/delivery/my-deliveries"
            element={<PagePlaceholder title="My Deliveries" />}
          />

          {/* Active Delivery */}

          <Route
            path="/delivery/active"
            element={<PagePlaceholder title="Active Delivery" />}
          />

          {/* Delivery History */}

          <Route
            path="/delivery/history"
            element={<PagePlaceholder title="Delivery History" />}
          />
        </Route>

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Users */}

          <Route
            path="/admin/users"
            element={<PagePlaceholder title="Users" />}
          />

          {/* Pharmacies */}

          <Route
            path="/admin/pharmacies"
            element={<PagePlaceholder title="Pharmacies" />}
          />

          {/* Medicine Master CRUD */}

          <Route path="/admin/medicines" element={<Medicine />} />

          {/* Orders */}

          <Route
            path="/admin/orders"
            element={<PagePlaceholder title="Orders" />}
          />

          {/* Delivery Partners */}

          <Route
            path="/admin/delivery-partners"
            element={<PagePlaceholder title="Delivery Partners" />}
          />

          {/* Settings */}

          <Route
            path="/admin/settings"
            element={<PagePlaceholder title="Settings" />}
          />
        </Route>

        {/* =================================================
            UNAUTHORIZED
        ================================================= */}

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<PagePlaceholder title="404 - Page Not Found" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
