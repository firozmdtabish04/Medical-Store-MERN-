import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  Store,
  Phone,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AvailableDeliveries() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");

  const loadAvailable = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/delivery/available");
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Failed to load deliveries:", err);
      setError("Unable to retrieve available delivery tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailable();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      setAcceptingId(orderId);
      setError("");
      await api.post(`/delivery/${orderId}/accept`);
      navigate("/delivery/active");
    } catch (err) {
      console.error("Failed to accept delivery:", err);
      setError(
        err.response?.data?.message ||
          "Could not accept this order. It may have already been assigned.",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Available Deliveries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Orders packed by pharmacies ready for pickup and customer delivery.
          </p>
        </div>
        <button
          onClick={loadAvailable}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Refresh Feed
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">
            No Deliveries Currently Waiting
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            New delivery requests will appear here when pharmacies mark orders ready for pickup.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-400">
                    ORDER #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    PAYOUT: ₹60.00
                  </span>
                </div>

                {/* Pickup details */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                      <Store size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-gray-400">
                        Pickup from Pharmacy
                      </p>
                      <p className="font-bold text-gray-900">
                        {order.pharmacy?.storeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.pharmacy?.address?.street},{" "}
                        {order.pharmacy?.address?.city}
                      </p>
                    </div>
                  </div>

                  {/* Drop details */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-gray-400">
                        Deliver to Customer
                      </p>
                      <p className="font-bold text-gray-900">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.deliveryAddress?.street},{" "}
                        {order.deliveryAddress?.city} (PIN:{" "}
                        {order.deliveryAddress?.pincode})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
                  <span>{order.items?.length || 1} medicine package(s)</span>
                  <span className="font-bold text-gray-800">
                    Order Value: ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAccept(order._id)}
                disabled={acceptingId === order._id}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-50"
              >
                {acceptingId === order._id ? (
                  <span>Accepting...</span>
                ) : (
                  <>
                    <span>Accept & Start Delivery</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
