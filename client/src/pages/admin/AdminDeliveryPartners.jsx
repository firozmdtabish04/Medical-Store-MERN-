import React, { useState, useEffect } from "react";
import { Truck, Phone, CheckCircle2, Search, IndianRupee, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [feePerDelivery, setFeePerDelivery] = useState(40);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/delivery-partners");
        setPartners(res.data?.deliveryPartners || []);
        if (res.data?.feePerDelivery) {
          setFeePerDelivery(res.data.feePerDelivery);
        }
      } catch (err) {
        console.error("Failed to load delivery partners:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Delivery Partners Fleet
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage logistics riders, live delivery assignments and completed runs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-3.5 py-2 text-xs font-bold text-green-800">
            <IndianRupee size={15} />
            <span>Delivery Fee: ₹{feePerDelivery}/order</span>
          </div>

          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            <Settings size={14} />
            <span>Configure Fee</span>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : partners.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No delivery partners registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <div
                key={p._id}
                className="rounded-2xl border border-gray-100 p-5 hover:border-green-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-400">{p.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-gray-50 pt-3 text-xs text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    {p.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Active Runs:
                    </span>{" "}
                    <span className="font-bold text-blue-600">
                      {p.activeDeliveries || 0}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Completed Deliveries:
                    </span>{" "}
                    <span className="font-bold text-green-600">
                      {p.completedDeliveries || 0}
                    </span>
                  </p>
                  <p className="border-t border-gray-50 pt-1.5">
                    <span className="font-semibold text-gray-700">
                      Delivery Earnings Paid:
                    </span>{" "}
                    <span className="font-extrabold text-green-700">
                      ₹{p.totalEarnings ?? (p.completedDeliveries || 0) * feePerDelivery}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
