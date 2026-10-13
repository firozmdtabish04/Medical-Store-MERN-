import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  CheckCircle2,
  Clock3,
  User,
  Search,
} from "lucide-react";
import api from "../../services/api";

export default function PharmacistSales() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pharmacies/sales/stats");
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
        if (res.data?.recentOrders) {
          setRecentOrders(res.data.recentOrders);
        }
      } catch (err) {
        console.error("Failed to load sales stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Sales & Financial Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track store revenue, fulfilled orders, customer orders and billing history.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Total Revenue
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                ₹{stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp size={22} />
            </div>
          </div>
          <span className="mt-2 block text-xs text-green-600 font-semibold">
            Lifetime earnings from fulfilled orders
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Today's Revenue
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                ₹{stats.todayRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={22} />
            </div>
          </div>
          <span className="mt-2 block text-xs text-blue-600 font-semibold">
            Delivered orders today
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Completed Orders
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {stats.completedOrders}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <span className="mt-2 block text-xs text-purple-600 font-semibold">
            Out of {stats.totalOrders} total orders received
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Active / In-Transit
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={22} />
            </div>
          </div>
          <span className="mt-2 block text-xs text-amber-600 font-semibold">
            Orders currently processing
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Recent Transactions
        </h2>
        <p className="text-xs text-gray-500">
          Latest orders placed with your pharmacy
        </p>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No transactions found yet.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="rounded-l-xl px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="rounded-r-xl px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {order.customer?.name || "Customer"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {order.items?.length || 0} medicine(s)
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "CANCELLED" ||
                                order.orderStatus === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
