import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Clock3,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  Edit3,
} from "lucide-react";
import api from "../../services/api";

export default function MyPharmacy() {
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    storeName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    openingTime: "09:00",
    closingTime: "22:00",
    licenseNumber: "",
    licenseDocument: "",
    coordinates: [77.209, 28.6139],
  });

  const loadPharmacy = async () => {
    try {
      setLoading(false);
      const res = await api.get("/pharmacies/my");
      if (res.data?.pharmacy) {
        const p = res.data.pharmacy;
        setPharmacy(p);
        setFormData({
          storeName: p.storeName || "",
          phone: p.phone || "",
          street: p.address?.street || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          pincode: p.address?.pincode || "",
          openingTime: p.openingTime || "09:00",
          closingTime: p.closingTime || "22:00",
          licenseNumber: p.licenseNumber || "",
          licenseDocument: p.licenseDocument || "",
          coordinates: p.location?.coordinates || [77.209, 28.6139],
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPharmacy(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacy();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        storeName: formData.storeName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        coordinates: formData.coordinates,
        licenseNumber: formData.licenseNumber,
        licenseDocument: formData.licenseDocument,
      };

      if (pharmacy) {
        const res = await api.put("/pharmacies/my", payload);
        setPharmacy(res.data?.pharmacy);
        setEditing(false);
        setMessage({
          text: "Pharmacy details updated successfully!",
          type: "success",
        });
      } else {
        const res = await api.post("/pharmacies", payload);
        setPharmacy(res.data?.pharmacy);
        setMessage({
          text: "Registration submitted for Admin verification!",
          type: "success",
        });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to save pharmacy details.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          My Pharmacy Store
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your pharmacy store information, operating hours, and licensing profile.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* If pharmacy exists and not editing -> View Card */}
      {pharmacy && !editing ? (
        <div className="space-y-6">
          {/* Status Alert */}
          <div
            className={`flex items-center justify-between rounded-2xl border p-5 ${
              pharmacy.approvalStatus === "APPROVED"
                ? "border-green-200 bg-green-50 text-green-800"
                : pharmacy.approvalStatus === "PENDING"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {pharmacy.approvalStatus === "APPROVED" && (
                <CheckCircle2 size={24} className="text-green-600" />
              )}
              {pharmacy.approvalStatus === "PENDING" && (
                <Clock3 size={24} className="text-amber-600" />
              )}
              {pharmacy.approvalStatus === "REJECTED" && (
                <XCircle size={24} className="text-red-600" />
              )}
              <div>
                <p className="font-bold">
                  Status: {pharmacy.approvalStatus}
                </p>
                <p className="text-xs opacity-90">
                  {pharmacy.approvalStatus === "APPROVED"
                    ? "Your pharmacy is verified and active on MediFind marketplace."
                    : pharmacy.approvalStatus === "PENDING"
                      ? "Your application is currently under admin review."
                      : `Application rejected: ${pharmacy.rejectionReason || "Please verify license credentials"}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <Edit3 size={15} />
              Edit Store Details
            </button>
          </div>

          {/* Details Overview */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <Store size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {pharmacy.storeName}
                </h2>
                <p className="text-xs text-gray-400">
                  License No: {pharmacy.licenseNumber}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Store Address
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {pharmacy.address?.street}, {pharmacy.address?.city},{" "}
                    {pharmacy.address?.state} - {pharmacy.address?.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 size={18} className="mt-0.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Business Hours
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {pharmacy.openingTime} - {pharmacy.closingTime} (Daily)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Contact Phone
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{pharmacy.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText size={18} className="mt-0.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    License Certificate
                  </p>
                  <p className="mt-1 text-sm text-gray-800">
                    {pharmacy.licenseNumber} (Verified)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Registration or Edit Form */
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {pharmacy ? "Edit Pharmacy Information" : "Register Your Pharmacy"}
            </h2>
            <p className="text-xs text-gray-500">
              Provide authentic store details and drug license information for verification.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                Store Name *
              </label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g. CareWell Pharmacy"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                Store Phone *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-700">
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g. 14 Market Street, Near Metro Station"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                State & PIN Code *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="PIN"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                Opening Time (HH:MM) *
              </label>
              <input
                type="time"
                name="openingTime"
                required
                value={formData.openingTime}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700">
                Closing Time (HH:MM) *
              </label>
              <input
                type="time"
                name="closingTime"
                required
                value={formData.closingTime}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-700">
                Drug License Number *
              </label>
              <input
                type="text"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. DL-2026-PHARM-8821"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            {pharmacy && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : pharmacy ? "Save Changes" : "Submit Pharmacy"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
