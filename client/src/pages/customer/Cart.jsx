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

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("medifind_cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Add medicine coming from Medicines.jsx
  useEffect(() => {
    const medicine = location.state?.medicine;

    if (!medicine) return;

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.inventoryId === medicine.inventoryId,
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = previousCart.map((item) =>
          item.inventoryId === medicine.inventoryId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, medicine.stock),
              }
            : item,
        );
      } else {
        updatedCart = [
          ...previousCart,
          {
            inventoryId: medicine.inventoryId,
            pharmacyId: medicine.pharmacyId,
            storeName: medicine.storeName,
            medicine: medicine.medicine,
            price: medicine.price,
            discount: medicine.discount || 0,
            effectivePrice: medicine.effectivePrice,
            stock: medicine.stock,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem("medifind_cart", JSON.stringify(updatedCart));

      return updatedCart;
    });

    // Clear navigation state
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("medifind_cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (inventoryId) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (item.inventoryId !== inventoryId) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  };

  const decreaseQuantity = (inventoryId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.inventoryId === inventoryId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (inventoryId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.inventoryId !== inventoryId),
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("medifind_cart");
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.effectivePrice * item.quantity,
    0,
  );

  const deliveryFee = subtotal >= 500 ? 0 : 40;

  const total = subtotal + deliveryFee;

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6">
      {/* Header */}
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

      {/* Empty Cart */}
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
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.inventoryId}
                className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="gap-4 flex">
                  {/* Medicine Icon */}
                  <div className="h-16 w-16 justify-center rounded-xl bg-green-50 text-green-600 flex shrink-0 items-center">
                    <ShoppingCart size={25} />
                  </div>

                  {/* Details */}
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
                        onClick={() => removeItem(item.inventoryId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Pharmacy */}
                    <div className="mt-3 gap-2 text-sm text-gray-500 flex items-center">
                      <MapPin size={15} />

                      <span>{item.storeName || "Pharmacy"}</span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 justify-between flex items-center">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.effectivePrice}
                        </span>

                        {item.discount > 0 && (
                          <span className="text-xs font-semibold text-green-600 ml-2">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="rounded-xl border border-gray-200 flex items-center">
                        <button
                          onClick={() => decreaseQuantity(item.inventoryId)}
                          className="h-9 w-9 justify-center text-gray-600 flex items-center hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-10 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.inventoryId)}
                          disabled={item.quantity >= item.stock}
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
            ))}

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/customer/medicines")}
              className="gap-2 text-sm font-semibold text-green-600 flex items-center hover:text-green-700"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </button>
          </div>

          {/* Summary */}
          <div>
            <div className="p-5 top-6 rounded-2xl border border-gray-200 bg-white shadow-sm sticky">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="mt-5 text-sm space-y-3">
                <div className="justify-between flex">
                  <span className="text-gray-500">Items</span>

                  <span className="font-medium">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
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

              {/* Checkout */}
              <button
                onClick={() =>
                  navigate("/customer/place-order", {
                    state: {
                      cart,
                      subtotal,
                      deliveryFee,
                      total,
                    },
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
