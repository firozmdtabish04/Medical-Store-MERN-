import React, { useEffect, useState } from "react";
import { Search, MapPin, ShoppingCart, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Medicines() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMedicine = async () => {
    if (!search.trim()) {
      setMedicines([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Temporary Bhubaneswar coordinates
      const latitude = 20.2961;
      const longitude = 85.8245;

      const response = await api.get("/pharmacies/search-medicine", {
        params: {
          q: search,
          latitude,
          longitude,
          radius: 10,
          limit: 20,
        },
      });

      setMedicines(response.data.stores || []);
    } catch (error) {
      console.error("Medicine search failed:", error);

      setError(error.response?.data?.message || "Unable to search medicines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMedicine();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Medicine</h1>

        <p className="mt-1 text-sm text-gray-500">
          Search medicines available at nearby pharmacies.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine e.g. Paracetamol..."
            className="py-3 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm pl-12 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 justify-center flex items-center">
          <Loader2 size={28} className="text-green-600 animate-spin" />

          <span className="text-sm text-gray-500 ml-3">
            Searching nearby pharmacies...
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && search && medicines.length === 0 && (
        <div className="py-16 rounded-2xl border border-gray-200 bg-white text-center">
          <Package size={42} className="mb-3 mx-auto text-gray-300" />

          <h2 className="font-semibold text-gray-800">No medicine found</h2>

          <p className="mt-1 text-sm text-gray-500">
            Try another medicine name.
          </p>
        </div>
      )}

      {/* Initial state */}
      {!search && (
        <div className="py-16 rounded-2xl border border-gray-200 bg-white text-center">
          <Search size={42} className="mb-3 mx-auto text-green-500" />

          <h2 className="font-semibold text-gray-800">Search for a medicine</h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter a medicine name to find nearby pharmacies.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && medicines.length > 0 && (
        <div>
          <div className="mb-4 justify-between flex items-center">
            <h2 className="font-bold text-gray-900">Available Nearby</h2>

            <span className="text-sm text-gray-500">
              {medicines.length} results
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {medicines.map((store, index) => (
              <div
                key={store.pharmacyId || index}
                className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Medicine */}
                <div className="mb-4 justify-between flex items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {store.medicine?.name || "Medicine"}
                    </h3>

                    {store.medicine?.genericName && (
                      <p className="mt-1 text-xs text-gray-500">
                        {store.medicine.genericName}
                      </p>
                    )}
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-green-50 text-xs font-semibold text-green-700">
                    {store.stockStatus || "AVAILABLE"}
                  </span>
                </div>

                {/* Pharmacy */}
                <div className="mb-4 p-3 rounded-xl bg-gray-50">
                  <h4 className="font-semibold text-gray-800">
                    {store.storeName || "Pharmacy"}
                  </h4>

                  <div className="mt-2 gap-2 text-sm text-gray-500 flex items-center">
                    <MapPin size={15} />

                    <span>
                      {store.distance
                        ? `${(store.distance / 1000).toFixed(1)} km away`
                        : "Nearby"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 justify-between flex items-end">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>

                    <p className="text-xl font-bold text-gray-900">
                      ₹{store.effectivePrice}
                    </p>
                  </div>

                  {store.discount > 0 && (
                    <span className="text-sm font-semibold text-green-600">
                      {store.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Stock */}
                <p className="mb-4 text-sm text-gray-500">
                  Stock:{" "}
                  <span className="font-semibold text-gray-700">
                    {store.stock}
                  </span>
                </p>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate("/customer/cart", {
                      state: {
                        medicine: store,
                      },
                    })
                  }
                  className="gap-2 px-4 py-3 w-full justify-center rounded-xl bg-green-600 text-sm font-semibold text-white flex items-center transition hover:bg-green-700"
                >
                  <ShoppingCart size={18} />
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
