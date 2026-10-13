import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Pill,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Plus,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function PharmacistDashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    totalMedicines: 0,
    totalOrders: 0,
    lowStockMedicines: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pharmacies/sales/stats");
        if (res.data?.stats) {
          setStatsData(res.data.stats);
        }
        if (res.data?.recentOrders) {
          setRecentOrders(res.data.recentOrders);
        }
      } catch (err) {
        console.error("Failed to load pharmacist stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Medicines",
      value: statsData.totalMedicines.toString(),
      icon: Pill,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Store Orders",
      value: statsData.totalOrders.toString(),
      icon: Package,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Low Stock Alert",
      value: statsData.lowStockMedicines.toString(),
      icon: AlertTriangle,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      title: "Today's Sales",
      value: `₹${statsData.todayRevenue.toFixed(0)}`,
      icon: TrendingUp,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Inventory",
      description: "Update medicine stock, pricing and discounts.",
      icon: ClipboardList,
      path: "/pharmacist/inventory",
    },
    {
      title: "Customer Orders",
      description: "Accept, pack and ready orders for delivery.",
      icon: Package,
      path: "/pharmacist/orders",
    },
    {
      title: "My Pharmacy",
      description: "Store profile, timings, and drug license info.",
      icon: Store,
      path: "/pharmacist/pharmacy",
    },
    {
      title: "Sales Report",
      description: "View financial summary and revenue history.",
      icon: TrendingUp,
      path: "/pharmacist/sales",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-green-600 to-emerald-500 sm:p-8">
        <div className="z-10 relative">
          <p className="text-sm font-medium text-green-100">
            Pharmacist Portal
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Welcome, {user?.name || "Pharmacist"}!
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-green-50 leading-6 sm:text-base">
            Manage your pharmacy inventory, fulfil customer orders and monitor sales revenue.
          </p>

          <div className="flex-wrap mt-6 gap-3 flex">
            <Link
              to="/pharmacist/inventory"
              className="gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 shadow-md inline-flex items-center hover:bg-green-50"
            >
              <Plus size={18} />
              Manage Inventory
            </Link>

            <Link
              to="/pharmacist/orders"
              className="gap-2 px-5 py-3 rounded-xl border border-white/30 bg-white/10 text-sm font-bold text-white inline-flex items-center hover:bg-white/20"
            >
              <Package size={18} />
              View Orders
            </Link>
          </div>
        </div>

        <Store
          size={130}
          className="bottom-4 text-white/10 absolute right-8 hidden sm:block"
        />
      </section>

      {/* Stats */}
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

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Store Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quick links to common pharmacy tasks
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
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

                <h3 className="mt-4 font-bold text-gray-900">{action.title}</h3>

                <p className="mt-1 text-sm text-gray-500 leading-5">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Orders Overview */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-extrabold text-gray-900">Recent Pharmacy Orders</h2>
            <p className="text-xs text-gray-500">Latest prescription & medicine requests</p>
          </div>
          <Link
            to="/pharmacist/orders"
            className="text-xs font-bold text-green-600 hover:text-green-700"
          >
            All Orders →
          </Link>
        </div>

        <div className="mt-4">
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No orders received yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.slice(0, 5).map((o) => (
                <div key={o._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">
                      #{o._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-gray-500 ml-2">
                      by {o.customer?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">
                      ₹{o.totalAmount}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                      {o.orderStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PharmacistDashboard;
