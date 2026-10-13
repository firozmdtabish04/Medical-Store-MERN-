import React, { useState, useEffect } from "react";
import {
  Truck,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  Clock,
  ArrowRight,
  Radio,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../services/api";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function ActiveDelivery() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  const loadActive = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/delivery/active");
      setOrder(res.data?.order || null);
    } catch (err) {
      console.error("Failed to load active delivery:", err);
      setError("Unable to load active delivery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActive();

    const s = io(SOCKET_URL);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Location simulation interval when sharing is active
  useEffect(() => {
    let interval = null;
    if (sharingLocation && socket && order) {
      interval = setInterval(() => {
        // Emit updated simulated delivery coordinates
        const fakeLat = 28.6139 + (Math.random() - 0.5) * 0.005;
        const fakeLng = 77.209 + (Math.random() - 0.5) * 0.005;
        socket.emit("delivery-location", {
          orderId: order._id,
          latitude: fakeLat,
          longitude: fakeLng,
        });
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sharingLocation, socket, order]);

  const handleUpdateStatus = async (nextStatus) => {
    if (!order) return;
    try {
      setUpdating(true);
      setError("");
      await api.patch(`/delivery/${order._id}/status`, { status: nextStatus });

      if (nextStatus === "DELIVERED") {
        setSharingLocation(false);
        navigate("/delivery/history");
      } else {
        loadActive();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(
        err.response?.data?.message || "Could not update order status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <Truck size={48} className="mx-auto text-gray-300" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          No Active Delivery In Progress
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          You currently don't have any accepted delivery orders waiting to be delivered.
        </p>
        <button
          onClick={() => navigate("/delivery/available")}
          className="mt-6 rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-700"
        >
          Browse Available Deliveries
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Active Task • #{order._id.slice(-6).toUpperCase()}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Payout: ₹{order.deliveryFee !== undefined && order.deliveryFee !== null ? (order.deliveryFee > 0 ? order.deliveryFee : 40) : 40}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Live Delivery Cockpit
          </h1>
        </div>

        {/* Live GPS Broadcast Toggle */}
        <button
          onClick={() => setSharingLocation((prev) => !prev)}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
            sharingLocation
              ? "bg-green-600 text-white animate-pulse"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Radio size={16} />
          <span>
            {sharingLocation ? "Broadcasting Live GPS" : "Share Live GPS"}
          </span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Progress tracker */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold">
          <span
            className={
              order.orderStatus === "DELIVERY_ASSIGNED"
                ? "text-green-600"
                : "text-gray-400"
            }
          >
            1. Assigned
          </span>
          <span
            className={
              order.orderStatus === "PICKED_UP"
                ? "text-green-600"
                : "text-gray-400"
            }
          >
            2. Picked Up
          </span>
          <span
            className={
              order.orderStatus === "OUT_FOR_DELIVERY"
                ? "text-green-600"
                : "text-gray-400"
            }
          >
            3. Out for Delivery
          </span>
          <span className="text-gray-400">4. Delivered</span>
        </div>
        <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="bg-green-600 transition-all duration-500"
            style={{
              width:
                order.orderStatus === "DELIVERY_ASSIGNED"
                  ? "25%"
                  : order.orderStatus === "PICKED_UP"
                    ? "50%"
                    : order.orderStatus === "OUT_FOR_DELIVERY"
                      ? "75%"
                      : "100%",
            }}
          />
        </div>
      </div>

      {/* Location Steps */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Step 1: Pickup */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Store size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-gray-400">
                Step 1: Pharmacy Pickup
              </p>
              <h3 className="font-bold text-gray-900">
                {order.pharmacy?.storeName}
              </h3>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-gray-600">
            <p>
              {order.pharmacy?.address?.street}, {order.pharmacy?.address?.city}
            </p>
            <p className="font-semibold text-gray-800">
              Phone: {order.pharmacy?.phone}
            </p>
          </div>
          {order.orderStatus === "DELIVERY_ASSIGNED" && (
            <button
              onClick={() => handleUpdateStatus("PICKED_UP")}
              disabled={updating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-xs font-bold text-white shadow-md hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Confirm Package Picked Up
            </button>
          )}
        </div>

        {/* Step 2: Customer Dropoff */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-gray-400">
                Step 2: Customer Drop-off
              </p>
              <h3 className="font-bold text-gray-900">
                {order.customer?.name}
              </h3>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-gray-600">
            <p>
              {order.deliveryAddress?.street}, {order.deliveryAddress?.city} -{" "}
              {order.deliveryAddress?.pincode}
            </p>
            <p className="font-semibold text-gray-800">
              Phone: {order.customer?.phone}
            </p>
          </div>

          {order.orderStatus === "PICKED_UP" && (
            <button
              onClick={() => handleUpdateStatus("OUT_FOR_DELIVERY")}
              disabled={updating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Navigation size={16} />
              Start Travel (Out for Delivery)
            </button>
          )}

          {order.orderStatus === "OUT_FOR_DELIVERY" && (
            <button
              onClick={() => handleUpdateStatus("DELIVERED")}
              disabled={updating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Mark Delivered & Collect Payment (₹{order.totalAmount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
