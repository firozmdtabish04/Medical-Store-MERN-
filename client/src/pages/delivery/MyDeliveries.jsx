import React, { useState, useEffect } from "react";
import {
  Truck,
  Package,
  MapPin,
  Store,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyDeliveries() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyDeliveries = async () => {
      try {
        setLoading(true);
        const res = await api.get("/delivery/my-deliveries");
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMyDeliveries();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE")
      return ["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"].includes(
        order.orderStatus,
      );
    if (filter === "DELIVERED") return order.orderStatus === "DELIVERED";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            My Delivery Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of all assigned, active and fulfilled medicine deliveries.
          </p>
        </div>

        <div className="flex rounded-2xl bg-gray-100 p-1">
          {["ALL", "ACTIVE", "DELIVERED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                filter === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Truck size={40} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            No deliveries match this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:border-green-200 transition"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-bold text-gray-900">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    order.orderStatus === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.orderStatus.replace(/_/g, " ")}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">Pharmacy:</span>{" "}
                  {order.pharmacy?.storeName}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Customer:</span>{" "}
                  {order.customer?.name} ({order.deliveryAddress?.city})
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"].includes(
                order.orderStatus,
              ) && (
                <button
                  onClick={() => navigate("/delivery/active")}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-50 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100"
                >
                  <span>Open Active Delivery</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
