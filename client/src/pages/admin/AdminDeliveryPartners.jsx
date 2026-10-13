import React, { useState, useEffect } from "react";
import { Truck, Phone, CheckCircle2, Search } from "lucide-react";
import api from "../../services/api";

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/delivery-partners");
        setPartners(res.data?.deliveryPartners || []);
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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Delivery Partners Fleet
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage logistics riders, live delivery assignments and completed runs.
        </p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
