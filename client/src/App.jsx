import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// Public Pages
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Auth Protection
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboards
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import PharmacistDashboard from "./pages/dashboards/PharmacistDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Common Pages
import Profile from "./pages/dashboards/Profile";

/* =========================================
   403 PAGE
========================================= */

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

/* =========================================
   TEMPORARY PAGE
========================================= */

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

/* =========================================
   APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================
            PUBLIC ROUTES
        ===================================== */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Route>

        {/* =====================================
            CUSTOMER ROUTES
        ===================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />

          <Route path="/customer/profile" element={<Profile />} />

          <Route
            path="/customer/medicines"
            element={<PagePlaceholder title="Find Medicine" />}
          />

          <Route
            path="/customer/pharmacies"
            element={<PagePlaceholder title="Nearby Pharmacies" />}
          />

          <Route
            path="/customer/cart"
            element={<PagePlaceholder title="Cart" />}
          />

          <Route
            path="/customer/orders"
            element={<PagePlaceholder title="My Orders" />}
          />

          <Route
            path="/customer/tracking"
            element={<PagePlaceholder title="Order Tracking" />}
          />
        </Route>

        {/* =====================================
            PHARMACIST ROUTES
        ===================================== */}

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

          <Route
            path="/pharmacist/pharmacy"
            element={<PagePlaceholder title="My Pharmacy" />}
          />

          <Route
            path="/pharmacist/medicines"
            element={<PagePlaceholder title="Medicines" />}
          />

          <Route
            path="/pharmacist/inventory"
            element={<PagePlaceholder title="Inventory" />}
          />

          <Route
            path="/pharmacist/orders"
            element={<PagePlaceholder title="Orders" />}
          />

          <Route
            path="/pharmacist/sales"
            element={<PagePlaceholder title="Sales" />}
          />
        </Route>

        {/* =====================================
            DELIVERY ROUTES
        ===================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

          <Route path="/delivery/profile" element={<Profile />} />

          <Route
            path="/delivery/available"
            element={<PagePlaceholder title="Available Deliveries" />}
          />

          <Route
            path="/delivery/my-deliveries"
            element={<PagePlaceholder title="My Deliveries" />}
          />

          <Route
            path="/delivery/active"
            element={<PagePlaceholder title="Active Delivery" />}
          />

          <Route
            path="/delivery/history"
            element={<PagePlaceholder title="Delivery History" />}
          />
        </Route>

        {/* =====================================
            ADMIN ROUTES
        ===================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route
            path="/admin/users"
            element={<PagePlaceholder title="Users" />}
          />

          <Route
            path="/admin/pharmacies"
            element={<PagePlaceholder title="Pharmacies" />}
          />

          <Route
            path="/admin/medicines"
            element={<PagePlaceholder title="Medicines" />}
          />

          <Route
            path="/admin/orders"
            element={<PagePlaceholder title="Orders" />}
          />

          <Route
            path="/admin/delivery-partners"
            element={<PagePlaceholder title="Delivery Partners" />}
          />

          <Route
            path="/admin/settings"
            element={<PagePlaceholder title="Settings" />}
          />
        </Route>

        {/* =====================================
            UNAUTHORIZED
        ===================================== */}

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* =====================================
            404
        ===================================== */}

        <Route
          path="*"
          element={<PagePlaceholder title="404 - Page Not Found" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
