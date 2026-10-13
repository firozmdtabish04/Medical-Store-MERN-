import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Menu,
  MapPin,
  ShoppingCart,
  X,
  ChevronDown,
  Check,
  LogOut,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCartCount } from "../../hooks/useCartCount";
import api from "../../services/api";

const CITIES = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Rourkela",
  "Berhampur",
  "Sambalpur",
];

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCartCount();
  const navigate = useNavigate();
  const location = useLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Sync search input if currently on /customer/medicines with ?search= query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (location.pathname === "/customer/medicines" && searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [location.pathname, location.search]);

  // Location State
  const [currentCity, setCurrentCity] = useState(() => {
    return localStorage.getItem("medifind_city") || "Bhubaneswar";
  });
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Persistent Database Notifications State
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await api.get("/notifications");
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.warn("Could not fetch notifications from database:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Profile Dropdown State
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Refs for click outside
  const cityRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/customer/medicines?search=${encodeURIComponent(query)}`);
    } else if (location.pathname === "/customer/medicines") {
      navigate("/customer/medicines");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (location.pathname === "/customer/medicines") {
      navigate("/customer/medicines");
    }
  };

  const handleSelectCity = (city) => {
    setCurrentCity(city);
    localStorage.setItem("medifind_city", city);
    setCityDropdownOpen(false);
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put("/notifications/mark-all-read");
    } catch (err) {
      console.error("Failed to mark all as read in DB:", err);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification read in DB:", err);
    }
  };

  const getProfileLink = () => {
    const r = (user?.role || "CUSTOMER").toUpperCase();
    if (r === "PHARMACIST") return "/pharmacist/profile";
    if (r === "DELIVERY") return "/delivery/profile";
    if (r === "ADMIN") return "/admin/settings";
    return "/customer/profile";
  };

  const role = user?.role || "CUSTOMER";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-3 sm:px-5 lg:px-6">
        {/* =================================================
            LEFT SECTION
        ================================================= */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* HAMBURGER (Mobile) */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 active:bg-gray-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Mobile Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
              <MapPin size={18} />
            </div>

            <div className="hidden min-[480px]:block">
              <p className="text-sm font-extrabold text-gray-900 leading-none">
                Medi<span className="text-green-600">Find</span>
              </p>
              <p className="mt-0.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {role}
              </p>
            </div>
          </div>

          {/* Desktop Search (Live Form) */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden lg:block"
          >
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, stores, salts..."
              className="h-11 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-9 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 xl:w-80"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>
        </div>

        {/* =================================================
            RIGHT SECTION
        ================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* LOCATION SELECTOR */}
          <div className="relative hidden sm:block" ref={cityRef}>
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-200 hover:bg-gray-100"
              title="Select location"
            >
              <MapPin size={17} className="text-green-600 shrink-0" />
              <span className="max-w-[110px] truncate text-xs font-semibold text-gray-800 md:max-w-none md:text-sm">
                {currentCity}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${
                  cityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* City Dropdown Menu */}
            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Select Delivery City
                </p>
                <div className="space-y-0.5">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        currentCity === city
                          ? "bg-green-50 text-green-700 font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && (
                        <Check size={14} className="text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CART QUICK LINK (Live Cart Count Badge) */}
          {role === "CUSTOMER" && (
            <button
              type="button"
              onClick={() => navigate("/customer/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 active:scale-95"
              title="View Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          )}

          {/* NOTIFICATIONS DROPDOWN */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotificationsRead}
                      className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-2 divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const id = item._id || item.id;
                      const timeStr = item.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : item.time || "Recent";

                      return (
                        <div
                          key={id}
                          onClick={() => handleMarkNotificationRead(id)}
                          className={`p-2.5 rounded-xl transition cursor-pointer ${
                            item.read ? "bg-white" : "bg-green-50/60"
                          } hover:bg-gray-50`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {!item.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                              )}
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {item.title}
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {timeStr}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl p-1 text-left transition hover:bg-gray-100 active:scale-95 sm:gap-3 sm:px-2 sm:py-1.5"
              aria-label="User profile menu"
            >
              {/* User text on desktop */}
              <div className="hidden text-right lg:block">
                <p className="text-sm font-bold text-gray-900 max-w-[120px] truncate leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  {role}
                </p>
              </div>

              {/* Avatar circle with initial */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-sm font-extrabold text-white shadow-sm ring-2 ring-green-100">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-gray-400 sm:block transition-transform duration-200 ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl z-50">
                {/* User info banner */}
                <div className="rounded-xl bg-gray-50 p-3 mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600 text-xs font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-gray-200/60 pt-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                      Role
                    </span>
                    <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate(getProfileLink());
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          MOBILE SEARCH BAR (Live Form)
      ================================================= */}
      <div className="border-t border-gray-100 px-3 py-2 lg:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, stores, salts..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-9 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear mobile search"
            >
              <X size={15} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}

export default Header;
