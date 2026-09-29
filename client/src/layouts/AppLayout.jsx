import { Outlet } from "react-router-dom";
import Header from "../components/app/Header";
import Sidebar from "../components/app/Sidebar";

function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
