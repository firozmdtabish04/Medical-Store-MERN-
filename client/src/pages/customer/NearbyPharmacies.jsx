import React, { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Phone,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Pill,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function NearbyPharmacies() {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [pharmacyMedicines, setPharmacyMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await api.get("/pharmacies", { params });
      setPharmacies(res.data?.pharmacies || []);
    } catch (err) {
      console.error("Failed to load pharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPharmacies();
  };

  const openMedicineModal = async (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    try {
      setLoadingMedicines(true);
      const res = await api.get(`/pharmacies/${pharmacy._id}/medicines`);
      setPharmacyMedicines(res.data?.medicines || []);
    } catch (err) {
      console.error("Failed to load medicines for pharmacy:", err);
    } finally {
      setLoadingMedicines(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-md sm:p-8">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-green-50 backdrop-blur-sm">
            <Store size={14} /> Verified Partner Pharmacies
          </span>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Nearby Medical Stores
          </h1>
          <p className="mt-2 text-sm text-green-100 sm:text-base">
            Discover verified pharmacies in your neighbourhood, verify operating hours, and browse in-stock medicines.
          </p>
        </div>
        <Store
          size={140}
          className="absolute -bottom-6 -right-6 text-white/10 hidden sm:block"
        />
      </section>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pharmacies by store name, street, or city..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {/* Pharmacies List */}
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500">Locating pharmacies...</p>
          </div>
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
          <Store size={40} className="mx-auto text-gray-300" />
          <h3 className="mt-3 text-lg font-bold text-gray-900">
            No Pharmacies Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or view all pharmacies.
          </p>
          <button
            onClick={() => {
              setSearch("");
              fetchPharmacies();
            }}
            className="mt-4 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy._id}
              className="group flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <Store size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {pharmacy.storeName}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Lic: {pharmacy.licenseNumber}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      pharmacy.isOpen
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {pharmacy.isOpen ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        OPEN NOW
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        CLOSED
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-50 pt-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 text-gray-400 shrink-0" />
                    <span>
                      {pharmacy.address?.street}, {pharmacy.address?.city},{" "}
                      {pharmacy.address?.state} - {pharmacy.address?.pincode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={15} className="text-gray-400 shrink-0" />
                    <span>
                      Hours: {pharmacy.openingTime} - {pharmacy.closingTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <span>{pharmacy.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openMedicineModal(pharmacy)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-green-50 px-3.5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
                >
                  <Pill size={14} />
                  View Medicines
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/customer/medicines?q=&pharmacy=${pharmacy.storeName}`,
                    )
                  }
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:border-green-300 hover:text-green-600"
                  title="Search from this pharmacy"
                >
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medicines Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedPharmacy.storeName}
                </h3>
                <p className="text-xs text-gray-500">
                  Medicines currently available in store inventory
                </p>
              </div>
              <button
                onClick={() => setSelectedPharmacy(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingMedicines ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                </div>
              ) : pharmacyMedicines.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No medicines listed in this pharmacy yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {pharmacyMedicines.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:border-green-200 transition"
                    >
                      <div>
                        <p className="font-bold text-gray-900">
                          {item.medicine?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.medicine?.dosage} • {item.medicine?.genericName}
                        </p>
                        <span className="mt-1 inline-block text-[11px] font-semibold text-gray-400">
                          In Stock: {item.stock} units
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-green-700">
                          ₹
                          {(
                            item.price -
                            (item.price * (item.discount || 0)) / 100
                          ).toFixed(2)}
                        </span>
                        {item.discount > 0 && (
                          <p className="text-[11px] text-green-600">
                            {item.discount}% OFF
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setSelectedPharmacy(null);
                            navigate("/customer/medicines");
                          }}
                          className="mt-2 block rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
                        >
                          Find & Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
