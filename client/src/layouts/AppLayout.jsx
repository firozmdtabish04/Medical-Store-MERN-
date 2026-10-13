import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/app/Header";
import Sidebar from "../components/app/Sidebar";
import ThreeBackground from "../components/common/ThreeBackground";
import ThreePillViewer from "../components/common/ThreePillViewer";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 lg:flex overflow-x-hidden">
      {/* Real-time Three.js 3D Ambient Background on Every Page */}
      <ThreeBackground />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 min-w-0">
        <Header onMenuClick={openSidebar} />

        <main className="p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Interactive 3D Capsule Viewer */}
      <ThreePillViewer />
    </div>
  );
}

export default AppLayout;
