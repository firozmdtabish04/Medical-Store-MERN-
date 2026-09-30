import React from "react";
import { Bell, Search, User, Menu, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="top-0 z-40 border-b border-gray-200 bg-white sticky">
      <div className="px-3 h-16 justify-between flex items-center sm:px-5 lg:px-6">
        {/* LEFT */}
        <div className="gap-2 flex items-center">
          {/* HAMBURGER */}
          <button
            type="button"
            onClick={onMenuClick}
            className="h-10 w-10 justify-center rounded-xl text-gray-600 flex items-center hover:bg-gray-100 active:bg-gray-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Mobile Logo */}
          <div className="gap-2 flex items-center lg:hidden">
            <div className="h-9 w-9 justify-center rounded-xl bg-green-600 text-white flex items-center">
              <MapPin size={18} />
            </div>

            <div className="min-[480px]:block hidden">
              <p className="text-sm font-extrabold text-gray-900">
                Medi<span className="text-green-600">Find</span>
              </p>

              <p className="text-[9px] font-semibold text-gray-400 uppercase">
                {user?.role || "CUSTOMER"}
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="relative hidden lg:block">
            <Search
              size={18}
              className="top-1/2 text-gray-400 absolute left-3 -translate-y-1/2"
            />

            <input
              type="text"
              placeholder="Search medicines..."
              className="h-11 w-64 rounded-xl border border-gray-200 bg-gray-50 text-sm pl-10 pr-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 xl:w-80"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="gap-1 flex items-center sm:gap-3">
          {/* Location */}
          <button className="gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hidden items-center hover:bg-gray-100 sm:flex">
            <MapPin size={18} className="text-green-600" />

            <span className="hidden md:block">Bhubaneswar</span>
          </button>

          {/* Notification */}
          <button
            type="button"
            className="h-10 w-10 justify-center rounded-xl text-gray-600 relative flex items-center hover:bg-gray-100"
          >
            <Bell size={20} />

            <span className="top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500 absolute right-2" />
          </button>

          {/* User */}
          <div className="gap-2 flex items-center sm:gap-3">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-gray-900">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-500">
                {user?.role || "CUSTOMER"}
              </p>
            </div>

            <div className="h-10 w-10 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-3 py-2 border-t border-gray-100 lg:hidden">
        <div className="relative">
          <Search
            size={18}
            className="top-1/2 text-gray-400 absolute left-3 -translate-y-1/2"
          />

          <input
            type="text"
            placeholder="Search medicines..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm pl-10 pr-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
