import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { dispatchCartUpdate } from "../../hooks/useCartCount";

export default function PlaceOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [total, setTotal] = useState(0);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If state passed from Cart.jsx, use it; otherwise load from localStorage
    if (location.state?.cart && location.state.cart.length > 0) {
      setCart(location.state.cart);
      setSubtotal(location.state.subtotal || 0);
      setDeliveryFee(location.state.deliveryFee ?? 40);
      setTotal(location.state.total || 0);
    } else {
      const saved = localStorage.getItem("medifind_cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            setCart(parsed);
            const sub = parsed.reduce(
              (acc, item) =>
                acc +
                Number(item.effectivePrice ?? item.price ?? 0) *
                  Number(item.quantity ?? 1),
              0,
            );
            const fee = sub >= 500 ? 0 : 40;
            setSubtotal(sub);
            setDeliveryFee(fee);
            setTotal(sub + fee);
          } else {
            navigate("/customer/cart");
          }
        } catch (e) {
          navigate("/customer/cart");
        }
      } else {
        navigate("/customer/cart");
      }
    }

    // Attempt to load customer's saved address from profile
    const loadProfileAddress = async () => {
      try {
        const res = await api.get("/auth/profile");
        const profile = res.data?.user || res.data?.data;
        if (profile?.address) {
          setAddress((prev) => ({
            street: prev.street || profile.address.street || "",
            city: prev.city || profile.address.city || "",
            state: prev.state || profile.address.state || "",
            pincode: prev.pincode || profile.address.pincode || "",
          }));
        }
      } catch (err) {
        // Fallback silently
      }
    };
    loadProfileAddress();
  }, [location.state, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      setError("Please fill in all delivery address fields.");
      return;
    }

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    // Identify pharmacy (items belong to pharmacy)
    const pharmacyId =
      cart[0]?.pharmacyId ||
      cart[0]?.pharmacy?._id ||
      cart[0]?.pharmacy;

    setLoading(true);

    try {
      const orderPayload = {
        pharmacyId,
        items: cart.map((item) => ({
          inventoryId: item.inventoryId || item._id || item.id || item.medicineId,
          quantity: Number(item.quantity) || 1,
          price: Number(item.effectivePrice ?? item.price ?? 0),
        })),
        deliveryAddress: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
          location: {
            type: "Point",
            coordinates: [77.209, 28.6139], // Default coords
          },
        },
        paymentMethod,
      };

      const response = await api.post("/orders", orderPayload);
      const createdOrder = response.data?.order;
      const orderId = createdOrder?._id || createdOrder?.id;

      if (!orderId) {
        throw new Error("Order creation succeeded but order ID was not received.");
      }

      // Handle payment method
      if (paymentMethod === "COD") {
        try {
          await api.post("/payments/cod", { orderId });
        } catch (paymentErr) {
          console.warn("COD payment registration info:", paymentErr);
        }
      }

      // Clear Cart
      localStorage.removeItem("medifind_cart");
      dispatchCartUpdate();

      // Redirect to Order Tracking
      navigate(`/customer/tracking?order=${orderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      setError(
        err.response?.data?.message ||
          "Could not place order. Please check item availability and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/customer/cart")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          Secure Checkout
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Complete Your Order
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Confirm your delivery address and payment preference to place your medicine order.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery Address Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Delivery Address</h2>
                <p className="text-xs text-gray-500">
                  Medicines will be dispatched to this location
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Street / Flat / Area *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. New Delhi"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. Delhi"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 110001"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Payment Option</h2>
                <p className="text-xs text-gray-500">
                  Select how you want to pay for this delivery
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 transition ${
                  paymentMethod === "COD"
                    ? "border-green-600 bg-green-50/50 shadow-sm ring-2 ring-green-600/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Pay cash or UPI upon delivery at doorstep.
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 transition ${
                  paymentMethod === "ONLINE"
                    ? "border-green-600 bg-green-50/50 shadow-sm ring-2 ring-green-600/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Online Payment</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      UPI, NetBanking, Debit / Credit Cards.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="sticky top-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">Items Summary</h2>
            <p className="text-xs text-gray-500">
              {cart.length} medicine{cart.length > 1 ? "s" : ""} from{" "}
              {cart[0]?.storeName || "Pharmacy"}
            </p>

            <div className="mt-4 max-h-56 space-y-3 overflow-y-auto divide-y divide-gray-50 pr-1">
              {cart.map((item) => (
                <div key={item.inventoryId} className="pt-2 flex items-center justify-between text-sm">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.medicine?.name || "Medicine"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.effectivePrice}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{(item.effectivePrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="text-xl font-extrabold text-green-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck size={14} className="text-green-600" />
              <span>100% Genuine Medicines • Fast Delivery</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}