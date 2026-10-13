import React, { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { dispatchCartUpdate } from "../../hooks/useCartCount";
import api from "../../services/api";

const CART_STORAGE_KEY = "medifind_cart";

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Load the saved cart before allowing any writes or syncs.
  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      let initialCart = [];

      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
              initialCart = parsed;
            }
          } catch {
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }

        // Prefer the database cart when it contains items.
        if (localStorage.getItem("token")) {
          try {
            const response = await api.get("/cart");
            const databaseItems = response.data?.items;

            if (Array.isArray(databaseItems) && databaseItems.length > 0) {
              initialCart = databaseItems;
            }
          } catch (error) {
            console.warn(
              "Could not load cart from database; using local cart:",
              error.message,
            );
          }
        }
      } catch (error) {
        console.error("Could not load saved cart:", error);
      } finally {
        if (!cancelled) {
          setCart(initialCart);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
          dispatchCartUpdate();
          setCartLoaded(true);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Add a medicine passed from the medicines page.
  useEffect(() => {
    if (!cartLoaded) return;

    const medicine = location.state?.medicine;
    if (!medicine) return;

    const inventoryId = medicine.inventoryId || medicine._id || medicine.id;

    if (!inventoryId) {
      console.error("Cannot add medicine without an inventory ID.");
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    const pharmacyId =
      medicine.pharmacyId || medicine.pharmacy?._id || medicine.pharmacy;

    const effectivePrice =
      medicine.effectivePrice ??
      Number(
        (
          Number(medicine.price || 0) *
          (1 - Number(medicine.discount || 0) / 100)
        ).toFixed(2),
      );

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => String(item.inventoryId) === String(inventoryId),
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = previousCart.map((item) =>
          String(item.inventoryId) === String(inventoryId)
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock || 99),
              }
            : item,
        );
      } else {
        updatedCart = [
          ...previousCart,
          {
            inventoryId,
            pharmacyId,
            storeName: medicine.storeName || "Pharmacy",
            medicine: medicine.medicine || {
              name: medicine.name || "Medicine",
              genericName: medicine.genericName || "",
            },
            price: Number(medicine.price || 0),
            discount: Number(medicine.discount || 0),
            effectivePrice: Number(effectivePrice),
            stock: Number(medicine.stock || 100),
            quantity: 1,
          },
        ];
      }

      return updatedCart;
    });

    // Prevent adding the same medicine again on a refresh.
    navigate(location.pathname, { replace: true, state: null });
  }, [cartLoaded, location.state, location.pathname, navigate]);

  // Persist only after initial loading has completed.
  useEffect(() => {
    if (!cartLoaded) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    dispatchCartUpdate();

    if (localStorage.getItem("token")) {
      api.post("/cart/sync", { items: cart }).catch((error) => {
        console.warn("Could not sync cart to database:", error.message);
      });
    }
  }, [cart, cartLoaded]);

  const increaseQuantity = (inventoryId) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (String(item.inventoryId) !== String(inventoryId)) {
          return item;
        }

        if (item.quantity >= item.stock) return item;

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  const decreaseQuantity = (inventoryId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          String(item.inventoryId) === String(inventoryId)
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (inventoryId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.inventoryId) !== String(inventoryId),
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.effectivePrice ?? item.price ?? 0) *
        Number(item.quantity || 0),
    0,
  );

  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (!cartLoaded) {
    return (
      <div className="min-h-[60vh] justify-center bg-gray-50 flex items-center">
        <p className="text-sm text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6">
      <div className="mb-6 justify-between flex items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your medicines before placing the order.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="min-h-[60vh] justify-center flex items-center">
          <div className="p-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
            <div className="mb-5 mx-auto h-16 w-16 justify-center rounded-full bg-green-50 flex items-center">
              <ShoppingCart size={30} className="text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Find a medicine and add it to your cart.
            </p>

            <button
              onClick={() => navigate("/customer/medicines")}
              className="mt-6 px-6 py-3 rounded-xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700"
            >
              Find Medicine
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => {
              const inventoryId = item.inventoryId;
              const price = Number(item.effectivePrice ?? item.price ?? 0);

              return (
                <div
                  key={inventoryId}
                  className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="gap-4 flex">
                    <div className="h-16 w-16 justify-center rounded-xl bg-green-50 text-green-600 flex shrink-0 items-center">
                      <ShoppingCart size={25} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="gap-4 justify-between flex">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {item.medicine?.name || "Medicine"}
                          </h3>

                          {item.medicine?.genericName && (
                            <p className="mt-1 text-xs text-gray-500">
                              {item.medicine.genericName}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => removeItem(inventoryId)}
                          aria-label="Remove medicine"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-3 gap-2 text-sm text-gray-500 flex items-center">
                        <MapPin size={15} />
                        <span>{item.storeName || "Pharmacy"}</span>
                      </div>

                      <div className="mt-4 gap-3 justify-between flex items-center">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{price.toFixed(2)}
                          </span>

                          {item.discount > 0 && (
                            <span className="text-xs font-semibold text-green-600 ml-2">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="rounded-xl border border-gray-200 flex items-center">
                          <button
                            onClick={() => decreaseQuantity(inventoryId)}
                            aria-label="Decrease quantity"
                            className="h-9 w-9 justify-center text-gray-600 flex items-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-10 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(inventoryId)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Increase quantity"
                            className="h-9 w-9 justify-center text-gray-600 flex items-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-gray-400">
                        Available stock: {item.stock}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => navigate("/customer/medicines")}
              className="gap-2 text-sm font-semibold text-green-600 flex items-center hover:text-green-700"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </button>
          </div>

          <div>
            <div className="p-5 top-6 rounded-2xl border border-gray-200 bg-white shadow-sm sticky">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="mt-5 text-sm space-y-3">
                <div className="justify-between flex">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium">
                    {cart.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0,
                    )}
                  </span>
                </div>

                <div className="justify-between flex">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="justify-between flex">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="justify-between flex">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/customer/place-order", {
                    state: { cart, subtotal, deliveryFee, total },
                  })
                }
                className="mt-6 px-4 py-3 w-full rounded-xl bg-green-600 font-semibold text-white transition hover:bg-green-700"
              >
                Proceed to Checkout
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Secure medicine ordering
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
