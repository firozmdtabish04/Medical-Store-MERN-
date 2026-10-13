import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Package,
  Loader2,
  Pill,
  Sparkles,
  X,
  Store,
  Filter,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const CATEGORIES = [
  "ALL",
  "Fever & Pain",
  "Antibiotics",
  "Antacid & Gastro",
  "Allergy & Cold",
  "Vitamins",
];

const POPULAR_SEARCHES = [
  // "Paracetamol",
  // "Amoxicillin",
  // "Cetirizine",
  // "Pantoprazole",
  // "Azithromycin",
  // "Crocin",
];

export default function Medicines() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("search") || "";

  const [search, setSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync state if URL search param updates from Header
  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  const fetchMedicines = async (query = "", category = selectedCategory) => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (query.trim()) params.q = query.trim();
      if (category && category !== "ALL") params.category = category;

      const response = await api.get("/pharmacies/search-medicine", { params });
      setMedicines(response.data?.stores || []);
    } catch (err) {
      console.error("Failed to load medicines:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load medicines from pharmacies. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial load - show complete list of all medicines
  useEffect(() => {
    fetchMedicines("", selectedCategory);
  }, [selectedCategory]);

  // Debounced search when user types in search box
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines(search, selectedCategory);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const handleClearSearch = () => {
    setSearch("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      return next;
    });
    fetchMedicines("", selectedCategory);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="gap-2 text-2xl font-bold text-gray-900 sm:text-3xl flex items-center">
            <Pill className="text-green-600" size={28} />
            Find Medicine
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse complete catalog and check live in-stock availability across
            verified local pharmacies.
          </p>
        </div>

        <button
          onClick={() => navigate("/customer/cart")}
          className="gap-2 px-4 py-2.5 rounded-2xl bg-white text-sm font-semibold text-gray-700 shadow-sm border border-gray-200 self-start sm:self-auto flex items-center hover:bg-gray-50 transition"
        >
          <ShoppingCart size={18} className="text-green-600" />
          <span>View Cart</span>
        </button>
      </div>

      {/* Search & Filter Card */}
      <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search
            size={20}
            className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine by name, generic composition, or brand (e.g. Paracetamol, Crocin)..."
            className="py-3.5 w-full rounded-2xl border border-gray-200 bg-gray-50/50 text-sm pl-12 pr-11 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />

          {search && (
            <button
              onClick={handleClearSearch}
              className="p-1 top-1/2 text-gray-400 absolute right-3.5 -translate-y-1/2 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Popular Quick Searches */}
        <div className="flex-wrap gap-2 text-xs flex items-center">
          <span className="gap-1 text-gray-400 font-semibold flex items-center">
            <Sparkles size={13} className="text-amber-500" /> Quick Find:
          </span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearch(item);
              }}
              className={`rounded-full px-3 py-1 font-medium transition ${
                search.toLowerCase() === item.toLowerCase()
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {item}
            </button>
          ))}
          {search && (
            <button
              onClick={handleClearSearch}
              className="text-xs text-red-500 font-semibold hover:underline ml-1"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="pt-2 gap-2 pb-1 border-t border-gray-100 overflow-x-auto text-xs flex items-center">
          <span className="gap-1 text-gray-400 font-semibold flex items-center shrink-0">
            <Filter size={13} /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-1 justify-between text-xs text-gray-500 flex items-center">
        <span>
          {loading ? (
            "Searching pharmacy inventories..."
          ) : (
            <>
              Found{" "}
              <strong className="text-gray-800">{medicines.length}</strong>{" "}
              available item{medicines.length === 1 ? "" : "s"}
              {search && (
                <span>
                  {" "}
                  for &ldquo;<strong>{search}</strong>&rdquo;
                </span>
              )}
            </>
          )}
        </span>
        {search && (
          <button
            onClick={handleClearSearch}
            className="text-green-600 font-semibold hover:underline"
          >
            Show Complete List
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 justify-center bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center">
          <Loader2 size={26} className="text-green-600 animate-spin" />
          <span className="text-sm font-medium text-gray-500 ml-3">
            Loading medicine availability across pharmacies...
          </span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-5 gap-3 rounded-3xl border border-red-200 bg-red-50 text-sm text-red-600 flex items-center">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && medicines.length === 0 && (
        <div className="py-16 p-6 rounded-3xl border border-gray-100 bg-white text-center shadow-sm space-y-3">
          <Package size={48} className="mx-auto text-gray-300" />
          <h2 className="text-lg font-bold text-gray-800">
            No medicines found {search ? `matching "${search}"` : "in stock"}
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try checking another spelling, clear your search filter, or explore
            verified pharmacies nearby.
          </p>
          <div className="pt-2 gap-3 justify-center flex">
            {search && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition"
              >
                View Complete List
              </button>
            )}
            <button
              onClick={() => navigate("/customer/pharmacies")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
            >
              Browse Nearby Stores
            </button>
          </div>
        </div>
      )}

      {/* Complete Medicines List Grid */}
      {!loading && medicines.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medicines.map((store, index) => {
            const med = store.medicine || {};
            const effPrice = store.effectivePrice ?? store.price;
            const originalPrice = store.price;
            const hasDiscount = (store.discount || 0) > 0;

            return (
              <div
                key={store.inventoryId || store.pharmacyId || index}
                className="flex-col p-5 rounded-3xl border border-gray-100 bg-white shadow-sm justify-between transition hover:-translate-y-1 hover:shadow-md flex"
              >
                <div className="space-y-3">
                  {/* Category & Status Badges */}
                  <div className="gap-2 justify-between flex items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[11px] font-bold text-blue-700 max-w-[150px] truncate">
                      {med.category || "General"}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        store.stock > 10
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {store.stock > 10
                        ? `${store.stock} in stock`
                        : `Only ${store.stock} left`}
                    </span>
                  </div>

                  {/* Medicine Title & Details */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                      {med.name || "Medicine"}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {med.dosage ? `${med.dosage} • ` : ""}
                      {med.genericName || med.brandName || "Standard Form"}
                    </p>
                  </div>

                  {/* Pharmacy Store Card */}
                  <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100/80 text-xs space-y-1">
                    <div className="justify-between flex items-center">
                      <div className="gap-1.5 font-bold text-gray-800 flex items-center truncate">
                        <Store size={14} className="text-green-600 shrink-0" />
                        <span className="truncate">
                          {store.storeName || "Pharmacy"}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          store.isOpen !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {store.isOpen !== false ? "OPEN" : "CLOSED"}
                      </span>
                    </div>

                    <div className="gap-1 text-[11px] text-gray-500 flex items-center">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">
                        {store.distance > 0
                          ? `${store.distance} km away`
                          : store.address?.city ||
                            store.address?.street ||
                            "Verified Store"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-1 justify-between flex items-baseline">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Price
                      </p>
                      <div className="gap-2 flex items-baseline">
                        <span className="text-2xl font-extrabold text-gray-900">
                          ₹{effPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {hasDiscount && (
                      <span className="px-2 py-1 rounded-lg bg-green-100 text-xs font-extrabold text-green-700">
                        {store.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Action */}
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <button
                    onClick={() =>
                      navigate("/customer/cart", {
                        state: {
                          medicine: store,
                        },
                      })
                    }
                    className="gap-2 px-4 py-2.5 w-full justify-center rounded-2xl bg-green-600 text-sm font-bold text-white shadow-md shadow-green-600/15 flex items-center transition hover:bg-green-700 active:scale-[0.98]"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
