import React, { useState, useEffect } from "react";
import { Package, Search, Filter, Store, User, MapPin } from "lucide-react";
import api from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      const res = await api.get("/admin/orders", { params });
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Platform Orders Monitor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time track of all customer medicine orders, fulfilment and deliveries.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-2xl bg-gray-100 p-1">
          {[
            "ALL",
            "PENDING",
            "PACKING",
            "READY_FOR_PICKUP",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                statusFilter === st
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No orders found under selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="rounded-l-xl px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Pharmacy</th>
                  <th className="px-4 py-3">Rider</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="rounded-r-xl px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {o.customer?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {o.customer?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {o.pharmacy?.storeName}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {o.deliveryPartner ? o.deliveryPartner.name : "Unassigned"}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      ₹{o.totalAmount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold ${
                          o.paymentStatus === "SUCCESS"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          o.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : o.orderStatus === "CANCELLED" ||
                                o.orderStatus === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {o.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
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
