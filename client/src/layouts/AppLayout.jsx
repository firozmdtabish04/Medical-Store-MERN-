import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/app/Header";
import Sidebar from "../components/app/Sidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Header onMenuClick={openSidebar} />

        <main className="p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
