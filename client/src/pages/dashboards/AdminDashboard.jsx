import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Pill,
  Package,
  Truck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ArrowRight,
  UserCheck,
  Activity,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function AdminDashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalMedicines: 0,
    totalOrders: 0,
    pendingPharmacies: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPharmacies, setRecentPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        if (res.data?.stats) {
          setStatsData(res.data.stats);
        }
        if (res.data?.recentOrders) {
          setRecentOrders(res.data.recentOrders);
        }
        if (res.data?.recentPharmacies) {
          setRecentPharmacies(res.data.recentPharmacies);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: statsData.totalUsers.toString(),
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Verified Pharmacies",
      value: statsData.totalPharmacies.toString(),
      icon: Store,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Medicine Catalog",
      value: statsData.totalMedicines.toString(),
      icon: Pill,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Platform Orders",
      value: statsData.totalOrders.toString(),
      icon: Package,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  const managementCards = [
    {
      title: "Manage Users",
      description: "View and manage registered customers, pharmacists and riders.",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Manage Pharmacies",
      description: "Verify, approve, or reject partner pharmacy applications.",
      icon: Store,
      path: "/admin/pharmacies",
    },
    {
      title: "Medicine Master Catalog",
      description: "Create and update platform medicines, dosages & categories.",
      icon: Pill,
      path: "/admin/medicines",
    },
    {
      title: "Monitor Orders",
      description: "View and track medicine orders across all pharmacies.",
      icon: Package,
      path: "/admin/orders",
    },
    {
      title: "Delivery Partners",
      description: "Manage rider fleet status and deliveries.",
      icon: Truck,
      path: "/admin/delivery-partners",
    },
    {
      title: "System Settings",
      description: "Configure delivery thresholds, fees, and operational policies.",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-gray-900 to-gray-800 sm:p-8">
        <div className="z-10 relative">
          <div className="gap-2 flex items-center">
            <ShieldCheck size={18} className="text-green-400" />
            <span className="text-sm font-semibold text-green-400">
              Administration Control Center
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Welcome, {user?.name || "Administrator"}!
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-gray-300 leading-6 sm:text-base">
            Oversee MediFind healthcare operations, verify pharmacies, oversee inventory catalog and monitor logistics.
          </p>
        </div>

        <ShieldCheck
          size={130}
          className="text-white/5 absolute -bottom-8 right-8 hidden sm:block"
        />
      </section>

      {/* Platform Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="justify-between flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon size={23} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Approval Alert if pending */}
      {statsData.pendingPharmacies > 0 && (
        <section className="p-5 rounded-2xl border border-orange-100 bg-orange-50">
          <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-orange-100 text-orange-600 flex items-center">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Pharmacy approvals pending verification
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {statsData.pendingPharmacies} pharmacy application(s) awaiting your review.
                </p>
              </div>
            </div>

            <Link
              to="/admin/pharmacies"
              className="gap-2 px-4 py-2.5 justify-center rounded-xl bg-orange-500 text-sm font-bold text-white inline-flex items-center transition hover:bg-orange-600"
            >
              Review Pharmacies
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Management Cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Platform Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all operational sectors of MediFind
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {managementCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.path}
                className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm group transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="justify-between flex items-start">
                  <div className="h-11 w-11 justify-center rounded-xl bg-green-50 text-green-600 flex items-center transition group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                  />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>

                <p className="mt-1 text-sm text-gray-500 leading-5">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h2 className="font-extrabold text-gray-900">Recent Platform Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-green-600 hover:text-green-700"
            >
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">
                No orders registered yet.
              </p>
            ) : (
              recentOrders.map((o) => (
                <div key={o._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">
                      #{o._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {o.pharmacy?.storeName}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{o.totalAmount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h2 className="font-extrabold text-gray-900">Partner Pharmacies</h2>
            <Link
              to="/admin/pharmacies"
              className="text-xs font-bold text-green-600 hover:text-green-700"
            >
              Manage →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-50">
            {recentPharmacies.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">
                No pharmacies registered yet.
              </p>
            ) : (
              recentPharmacies.map((p) => (
                <div key={p._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{p.storeName}</span>
                    <span className="text-gray-400 ml-2">
                      by {p.owner?.name}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.approvalStatus === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.approvalStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
