import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Package,
  Loader2,
  Pill,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Medicines() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const popularSearches = [
    "Paracetamol",
    "Amoxicillin",
    "Cetirizine",
    "Pantoprazole",
    "Azithromycin",
    "Crocin",
  ];

  const searchMedicine = async (query = search) => {
    if (!query.trim()) {
      setMedicines([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/pharmacies/search-medicine", {
        params: {
          q: query.trim(),
        },
      });

      setMedicines(response.data.stores || []);
    } catch (error) {
      console.error("Medicine search failed:", error);
      setError(
        error.response?.data?.message || "Unable to search medicines.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setMedicines([]);
      return;
    }
    const timer = setTimeout(() => {
      searchMedicine(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Find Medicine
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search branded and generic medicines available across verified local pharmacies.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="p-4 rounded-3xl border border-gray-100 bg-white shadow-sm space-y-3">
        <div className="relative">
          <Search
            size={20}
            className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine by brand or generic name e.g. Paracetamol, Crocin..."
            className="py-3.5 w-full rounded-2xl border border-gray-200 bg-gray-50/50 text-sm pl-12 pr-4 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-gray-400 font-semibold flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" /> Popular:
          </span>
          {popularSearches.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearch(item);
                searchMedicine(item);
              }}
              className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-green-50 hover:text-green-700 transition font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 justify-center flex items-center">
          <Loader2 size={26} className="text-green-600 animate-spin" />
          <span className="text-sm text-gray-500 ml-3">
            Checking pharmacies in-stock inventory...
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty Search */}
      {!loading && !error && search && medicines.length === 0 && (
        <div className="py-16 rounded-3xl border border-gray-100 bg-white text-center shadow-sm">
          <Package size={44} className="mb-3 mx-auto text-gray-300" />
          <h2 className="text-base font-bold text-gray-800">
            No pharmacy has "{search}" in stock right now
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Try searching generic chemical names or check back later.
          </p>
        </div>
      )}

      {/* Initial state */}
      {!search && (
        <div className="py-16 rounded-3xl border border-gray-100 bg-white text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-3">
            <Search size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Search for a Medicine</h2>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Type any medicine or click a popular tag above to view prices, discounts, and real-time pharmacy availability.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && medicines.length > 0 && (
        <div>
          <div className="mb-4 justify-between flex items-center">
            <h2 className="font-bold text-gray-900">
              Pharmacies In Stock ({medicines.length})
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {medicines.map((store, index) => (
              <div
                key={store.inventoryId || store.pharmacyId || index}
                className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Medicine Name */}
                  <div className="mb-3 justify-between flex items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {store.medicine?.name || "Medicine"}
                      </h3>
                      {store.medicine?.genericName && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {store.medicine.genericName}
                        </p>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-[11px] font-bold text-green-700">
                      {store.stockStatus || "IN STOCK"}
                    </span>
                  </div>

                  {/* Pharmacy Store */}
                  <div className="mb-4 p-3 rounded-2xl bg-gray-50/80">
                    <h4 className="font-semibold text-xs text-gray-800">
                      {store.storeName || "Pharmacy"}
                    </h4>
                    <div className="mt-1.5 gap-1.5 text-xs text-gray-500 flex items-center">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span>
                        {store.distance > 0
                          ? `${store.distance} km away`
                          : store.address?.city || "Verified Local Store"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3 justify-between flex items-end">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-gray-400">Price</p>
                      <p className="text-2xl font-extrabold text-gray-900">
                        ₹{store.effectivePrice}
                      </p>
                    </div>

                    {store.discount > 0 && (
                      <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        {store.discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    Available stock: {store.stock} units
                  </p>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() =>
                    navigate("/customer/cart", {
                      state: {
                        medicine: store,
                      },
                    })
                  }
                  className="gap-2 px-4 py-3 w-full justify-center rounded-2xl bg-green-600 text-sm font-bold text-white flex items-center shadow-md shadow-green-600/15 transition hover:bg-green-700"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
