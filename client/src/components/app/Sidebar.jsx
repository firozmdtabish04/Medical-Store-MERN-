import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Store,
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  Clock3,
  User,
  Pill,
  ClipboardList,
  Users,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = {
  CUSTOMER: [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Find Medicine",
      path: "/customer/medicines",
      icon: Search,
    },
    {
      label: "Nearby Pharmacies",
      path: "/customer/pharmacies",
      icon: MapPin,
    },
    {
      label: "Cart",
      path: "/customer/cart",
      icon: ShoppingCart,
    },
    {
      label: "My Orders",
      path: "/customer/orders",
      icon: Package,
    },
    {
      label: "Order Tracking",
      path: "/customer/tracking",
      icon: Truck,
    },
    {
      label: "Profile",
      path: "/customer/profile",
      icon: User,
    },
  ],

  PHARMACIST: [
    {
      label: "Dashboard",
      path: "/pharmacist/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Pharmacy",
      path: "/pharmacist/pharmacy",
      icon: Store,
    },
    {
      label: "Medicines",
      path: "/pharmacist/medicines",
      icon: Pill,
    },
    {
      label: "Inventory",
      path: "/pharmacist/inventory",
      icon: ClipboardList,
    },
    {
      label: "Orders",
      path: "/pharmacist/orders",
      icon: Package,
    },
    {
      label: "Sales",
      path: "/pharmacist/sales",
      icon: Clock3,
    },
    {
      label: "Profile",
      path: "/pharmacist/profile",
      icon: User,
    },
  ],

  DELIVERY: [
    {
      label: "Dashboard",
      path: "/delivery/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Available Deliveries",
      path: "/delivery/available",
      icon: Package,
    },
    {
      label: "My Deliveries",
      path: "/delivery/my-deliveries",
      icon: Truck,
    },
    {
      label: "Active Delivery",
      path: "/delivery/active",
      icon: MapPin,
    },
    {
      label: "Delivery History",
      path: "/delivery/history",
      icon: Clock3,
    },
    {
      label: "Profile",
      path: "/delivery/profile",
      icon: User,
    },
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Pharmacies",
      path: "/admin/pharmacies",
      icon: Store,
    },
    {
      label: "Medicines",
      path: "/admin/medicines",
      icon: Pill,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: Package,
    },
    {
      label: "Delivery Partners",
      path: "/admin/delivery-partners",
      icon: Truck,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ],
};

function Sidebar({ open = false, onClose }) {
  const { user, logout } = useAuth();

  const role = user?.role || "CUSTOMER";
  const items = menuItems[role] || menuItems.CUSTOMER;

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <>
      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]
          transition-opacity duration-300
          lg:hidden
          ${open ? "visible opacity-100" : "invisible opacity-0"}
        `}
      />

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-[100dvh] w-[280px] max-w-[85vw]
          flex-col
          border-r border-gray-200
          bg-white
          shadow-2xl
          transition-transform duration-300 ease-in-out

          lg:sticky
          lg:top-0
          lg:z-30
          lg:h-screen
          lg:w-72
          lg:max-w-none
          lg:translate-x-0
          lg:shadow-none

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =========================================
            LOGO HEADER
        ========================================= */}
        <div className="px-4 h-16 justify-between border-b border-gray-100 flex shrink-0 items-center sm:px-5">
          <div className="gap-3 min-w-0 flex items-center">
            {/* Logo */}
            <div className="h-10 w-10 justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex shrink-0 items-center">
              <Pill size={21} />
            </div>

            {/* Brand */}
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-gray-900 truncate">
                Medi<span className="text-green-600">Find</span>
              </h1>

              <p className="text-[9px] font-semibold text-gray-400 truncate uppercase tracking-wider">
                Healthcare • Nearby • Fast
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-9 w-9 justify-center rounded-xl text-gray-500 flex shrink-0 items-center transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================================
            USER INFORMATION
        ========================================= */}
        <div className="mx-3 mt-4 p-4 rounded-2xl bg-green-50 shrink-0 sm:mx-4">
          <div className="gap-3 flex items-center">
            {/* Avatar */}
            <div className="h-10 w-10 justify-center rounded-xl bg-green-600 text-sm font-bold text-white flex shrink-0 items-center">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">
                Logged in as
              </p>

              <p className="mt-0.5 text-sm font-bold text-gray-900 truncate">
                {user?.name || "User"}
              </p>
            </div>
          </div>

          <span className="mt-3 px-2.5 py-1 rounded-full bg-green-100 text-[10px] font-bold text-green-700 inline-flex uppercase tracking-wide">
            {role}
          </span>
        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}
        <nav className="flex-1 px-3 pb-4 pt-5 min-h-0 overflow-y-auto sm:px-4">
          <p className="mb-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
            Main Menu
          </p>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group flex min-h-[44px] items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? `
                          bg-green-600
                          text-white
                          shadow-md
                          shadow-green-600/20
                        `
                        : `
                          text-gray-600
                          hover:bg-green-50
                          hover:text-green-700
                        `
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0"
                      />

                      <span className="flex-1 min-w-0 truncate">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =========================================
            LOGOUT
        ========================================= */}
        <div className="p-3 border-t border-gray-100 bg-white shrink-0 sm:p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              gap-3 px-3 py-2.5 min-h-[44px] w-full rounded-xl text-sm font-semibold text-red-500 flex items-center transition hover:bg-red-50 hover:text-red-600 active:bg-red-100
            "
          >
            <LogOut size={19} className="shrink-0" />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
