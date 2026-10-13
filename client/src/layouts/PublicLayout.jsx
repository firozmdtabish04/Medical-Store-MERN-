import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import ThreeBackground from "../components/common/ThreeBackground";
import ThreePillViewer from "../components/common/ThreePillViewer";

function PublicLayout() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      {/* Real-time Three.js 3D Ambient Background on Every Public Page */}
      <ThreeBackground />

      <Navbar />

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Interactive 3D Capsule Viewer */}
      <ThreePillViewer />
    </div>
  );
}

export default PublicLayout;
