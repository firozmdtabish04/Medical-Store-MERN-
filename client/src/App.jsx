/**
 * ============================================================================
 * PROJECT: Pharmacy Management & Delivery System
 * DEVELOPED, DESIGNED, AND DEPLOYED BY: Tabish Firoz
 * VERSION: 1.0.0
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import Loader from "./components/common/Loader"; // Importing the loader we designed
import ProtectedRoute from "./components/ProtectedRoute";

// LAYOUTS
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// PUBLIC PAGES
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// DASHBOARDS & SHARED
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Profile from "./pages/dashboards/Profile";

// CUSTOMER PAGES
import Medicines from "./pages/customer/Medicines";
import NearbyPharmacies from "./pages/customer/NearbyPharmacies";
import Cart from "./pages/customer/Cart";
import PlaceOrder from "./pages/customer/PlaceOrder";
import Orders from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import OrderTracking from "./pages/customer/OrderTracking";

// PHARMACIST PAGES
import MyPharmacy from "./pages/pharmacist/MyPharmacy";
import Inventory from "./pages/pharmacist/Inventory";
import PharmacyOrders from "./pages/pharmacist/PharmacyOrders";
import PharmacistSales from "./pages/pharmacist/PharmacistSales";

// DELIVERY PAGES
import AvailableDeliveries from "./pages/delivery/AvailableDeliveries";
import MyDeliveries from "./pages/delivery/MyDeliveries";
import ActiveDelivery from "./pages/delivery/ActiveDelivery";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";

// ADMIN PAGES
import Medicine from "./pages/medicine/Medicine";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPharmacies from "./pages/admin/AdminPharmacies";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";
import AdminSettings from "./pages/admin/AdminSettings";

// =====================================================
// STATUS PAGES
// =====================================================
function Unauthorized() {
  return (
    <div className="flex-col p-6 min-h-[60vh] justify-center text-center flex items-center">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <h2 className="mt-3 text-2xl font-bold text-gray-800">Access Denied</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        You do not have the required permissions to view this secure area.
      </p>
      <p className="mt-10 text-xs text-gray-400">
        System Security by Tabish Firoz
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex-col min-h-[60vh] justify-center text-center flex items-center">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <p className="mt-2 text-lg text-gray-500">
        Oops! This page has vanished into thin air.
      </p>
      <a href="/" className="mt-5 text-blue-500 hover:underline">
        Back to Home
      </a>
    </div>
  );
}

// =====================================================
// MAIN APP COMPONENT
// =====================================================
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial App Check/Auth Check
    const timer = setTimeout(() => {
      setLoading(false);
      console.log(
        "%cDeveloped & Designed by Tabish Firoz",
        "color: #3b82f6; font-size: 14px; font-weight: bold;",
      );
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* CUSTOMER ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/medicines" element={<Medicines />} />
          <Route path="/customer/pharmacies" element={<NearbyPharmacies />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/place-order" element={<PlaceOrder />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/orders/:id" element={<OrderDetails />} />
          <Route path="/customer/tracking" element={<OrderTracking />} />
          <Route path="/customer/tracking/:id" element={<OrderTracking />} />
        </Route>

        {/* PHARMACIST ROUTES */}
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
          <Route path="/pharmacist/profile" element={<Profile />} />
          <Route path="/pharmacist/pharmacy" element={<MyPharmacy />} />
          <Route path="/pharmacist/inventory" element={<Inventory />} />
          <Route path="/pharmacist/orders" element={<PharmacyOrders />} />
          <Route path="/pharmacist/sales" element={<PharmacistSales />} />
        </Route>

        {/* DELIVERY ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/profile" element={<Profile />} />
          <Route path="/delivery/available" element={<AvailableDeliveries />} />
          <Route path="/delivery/my-deliveries" element={<MyDeliveries />} />
          <Route path="/delivery/active" element={<ActiveDelivery />} />
          <Route path="/delivery/history" element={<DeliveryHistory />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/pharmacies" element={<AdminPharmacies />} />
          <Route path="/admin/medicines" element={<Medicine />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route
            path="/admin/delivery-partners"
            element={<AdminDeliveryPartners />}
          />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* STATUS ROUTES */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Invisible Global Credit Footer for SEO/Metadata */}
      <footer style={{ display: "none" }}>
        Designed and Developed by Tabish Firoz
      </footer>
    </BrowserRouter>
  );
}

export default App;
