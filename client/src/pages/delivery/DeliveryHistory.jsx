import React, { useState, useEffect } from "react";
import { CheckCircle2, IndianRupee, Calendar, MapPin, Store } from "lucide-react";
import api from "../../services/api";

export default function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/delivery/my-deliveries");
        const all = res.data?.orders || [];
        setDeliveries(all.filter((o) => o.orderStatus === "DELIVERED"));
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const totalEarnings = deliveries.length * 60;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Delivery & Earnings History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review completed deliveries, customer drop-offs and earned payouts.
        </p>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-400">
            Total Completed Deliveries
          </p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            {deliveries.length}
          </p>
          <span className="mt-1 block text-xs text-green-600 font-semibold">
            Successfully delivered to doorstep
          </span>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-400">
            Total Payout Earned
          </p>
          <p className="mt-2 text-3xl font-extrabold text-green-600">
            ₹{totalEarnings.toFixed(2)}
          </p>
          <span className="mt-1 block text-xs text-gray-500">
            Calculated at ₹60 flat incentive per delivery
          </span>
        </div>
      </div>

      {/* Deliveries list */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Completed Orders</h2>
        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No completed deliveries on record yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="rounded-l-xl px-4 py-3">Order</th>
                  <th className="px-4 py-3">Pharmacy</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Payout</th>
                  <th className="rounded-r-xl px-4 py-3">Delivered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deliveries.map((del) => (
                  <tr key={del._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      #{del._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {del.pharmacy?.storeName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {del.deliveryAddress?.street}, {del.deliveryAddress?.city}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-700">
                      +₹60.00
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {del.deliveredAt
                        ? new Date(del.deliveredAt).toLocaleString()
                        : new Date(del.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
