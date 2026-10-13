import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "../../services/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "MediFind Healthcare",
    supportEmail: "support@medifind.com",
    supportPhone: "+91 98765 43210",
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 40,
    taxPercentage: 5,
    autoAssignDelivery: true,
    allowCashOnDelivery: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/settings");
        if (res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess(false);
      await api.put("/admin/settings", settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Platform Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure fees, threshold policies and platform operational parameters.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          <span>Platform settings updated successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700">
              Platform Name
            </label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700">
              Customer Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700">
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              name="freeDeliveryThreshold"
              value={settings.freeDeliveryThreshold}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700">
              Standard Delivery Fee (₹)
            </label>
            <input
              type="number"
              name="standardDeliveryFee"
              value={settings.standardDeliveryFee}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
