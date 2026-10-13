import React, { useState, useEffect } from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  MapPin,
  Phone,
  FileText,
  AlertTriangle,
} from "lucide-react";
import api from "../../services/api";

export default function AdminPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      const res = await api.get("/admin/pharmacies", { params });
      setPharmacies(res.data?.pharmacies || []);
    } catch (err) {
      console.error("Failed to load pharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await api.patch(`/admin/pharmacies/${id}/approve`);
      fetchPharmacies();
    } catch (err) {
      console.error("Failed to approve pharmacy:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      await api.patch(`/admin/pharmacies/${id}/reject`, {
        reason: rejectReason || "Drug license documentation unverified",
      });
      setRejectingId(null);
      setRejectReason("");
      fetchPharmacies();
    } catch (err) {
      console.error("Failed to reject pharmacy:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Pharmacy Verification & Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review partner drug store applications, approve authentic licenses, and manage stores.
          </p>
        </div>

        <div className="flex rounded-2xl bg-gray-100 p-1">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                statusFilter === tab
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
        <div className="flex h-56 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Store size={44} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            No pharmacies found under this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy._id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {pharmacy.storeName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Owner: {pharmacy.owner?.name} ({pharmacy.owner?.email})
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    pharmacy.approvalStatus === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : pharmacy.approvalStatus === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {pharmacy.approvalStatus}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-700">Address:</span>{" "}
                  {pharmacy.address?.street}, {pharmacy.address?.city} -{" "}
                  {pharmacy.address?.pincode}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Phone:</span>{" "}
                  {pharmacy.phone}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Hours:</span>{" "}
                  {pharmacy.openingTime} - {pharmacy.closingTime}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">License:</span>{" "}
                  {pharmacy.licenseNumber}
                </p>
                {pharmacy.rejectionReason && (
                  <p className="text-red-600">
                    <span className="font-semibold">Reason:</span>{" "}
                    {pharmacy.rejectionReason}
                  </p>
                )}
              </div>

              {pharmacy.approvalStatus === "PENDING" && (
                <div className="mt-5 flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleApprove(pharmacy._id)}
                    disabled={processingId === pharmacy._id}
                    className="flex-1 rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve Pharmacy
                  </button>
                  <button
                    onClick={() => setRejectingId(pharmacy._id)}
                    disabled={processingId === pharmacy._id}
                    className="flex-1 rounded-xl border border-red-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">
              Reject Pharmacy Application
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Provide a clear reason for the pharmacist so they can correct their documents.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Invalid drug license number or mismatched address."
              className="mt-4 w-full rounded-xl border border-gray-200 p-3 text-xs focus:border-red-500 focus:outline-none"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
