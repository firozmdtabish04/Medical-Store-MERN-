import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingCart,
  Package,
  Truck,
  Clock3,
  ArrowRight,
  Pill,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pharmaciesCount, setPharmaciesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart count
    try {
      const saved = localStorage.getItem("medifind_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartCount(parsed.length || 0);
      }
    } catch (e) {}

    // Load orders & pharmacies
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersRes, pharmaciesRes] = await Promise.all([
          api.get("/orders/my").catch(() => ({ data: { orders: [] } })),
          api.get("/pharmacies").catch(() => ({ data: { pharmacies: [] } })),
        ]);
        setOrders(ordersRes.data?.orders || []);
        setPharmaciesCount(pharmaciesRes.data?.count || 0);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeOrders = orders.filter((o) =>
    [
      "PENDING",
      "PHARMACY_ACCEPTED",
      "PACKING",
      "READY_FOR_PICKUP",
      "DELIVERY_ASSIGNED",
      "PICKED_UP",
      "OUT_FOR_DELIVERY",
    ].includes(o.orderStatus),
  );

  const latestActiveOrder = activeOrders[0] || orders[0] || null;

  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Orders",
      value: activeOrders.length.toString(),
      icon: Truck,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Cart Items",
      value: cartCount.toString(),
      icon: ShoppingCart,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Nearby Pharmacies",
      value: pharmaciesCount.toString(),
      icon: Store,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Find Medicine",
      description: "Search medicines available near you.",
      icon: Search,
      path: "/customer/medicines",
    },
    {
      title: "Nearby Pharmacies",
      description: "Find pharmacies around your location.",
      icon: MapPin,
      path: "/customer/pharmacies",
    },
    {
      title: "My Orders",
      description: "View and track your medicine orders.",
      icon: Package,
      path: "/customer/orders",
    },
    {
      title: "Shopping Cart",
      description: "Review medicines ready for checkout.",
      icon: ShoppingCart,
      path: "/customer/cart",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-green-600 to-emerald-500 sm:p-8">
        <div className="z-10 max-w-2xl relative">
          <p className="text-sm font-medium text-green-100">Welcome back 👋</p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Hello, {user?.name || "Customer"}!
          </h1>

          <p className="mt-3 max-w-xl text-sm text-green-50 leading-6 sm:text-base">
            Find medicines, compare nearby pharmacies, place orders and track
            your delivery in real-time.
          </p>

          <Link
            to="/customer/medicines"
            className="mt-6 gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 shadow-md inline-flex items-center transition hover:bg-green-50"
          >
            <Search size={18} />
            Find Medicine
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="h-48 w-48 justify-center rounded-full bg-white/10 absolute -right-8 -top-8 hidden items-center sm:flex">
          <Pill size={90} className="text-white/20" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="justify-between flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon size={23} className={stat.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-gray-500">What would you like to do?</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm group transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="justify-between flex items-start">
                  <div className="h-11 w-11 justify-center rounded-xl bg-green-50 text-green-600 flex items-center transition group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                  />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">{action.title}</h3>

                <p className="mt-1 text-sm text-gray-500 leading-5">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active Order / Latest Order */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">Latest Order</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your recent medicine delivery request
              </p>
            </div>

            <Link
              to="/customer/orders"
              className="text-sm font-bold text-green-600 hover:text-green-700"
            >
              View All Orders
            </Link>
          </div>

          {latestActiveOrder ? (
            <div className="mt-5 p-5 rounded-2xl border border-gray-100 bg-gray-50">
              <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
                <div className="gap-4 flex items-center">
                  <div className="h-12 w-12 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
                    <Package size={22} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Order #{latestActiveOrder._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {latestActiveOrder.items?.length || 1} medicine(s) • ₹
                      {latestActiveOrder.totalAmount}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1.5 w-fit rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {latestActiveOrder.orderStatus.replace(/_/g, " ")}
                </span>
              </div>

              <Link
                to={`/customer/tracking?order=${latestActiveOrder._id}`}
                className="mt-5 gap-2 py-3 justify-center rounded-xl bg-green-600 text-sm font-bold text-white flex items-center transition hover:bg-green-700"
              >
                <MapPin size={17} />
                Live Tracking
              </Link>
            </div>
          ) : (
            <div className="mt-5 p-8 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-2xl">
              No orders placed yet. Find medicines and add them to your cart!
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-12 w-12 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
            <ShieldCheck size={23} />
          </div>

          <h2 className="mt-4 font-extrabold text-gray-900">Verified Account</h2>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            Your MediFind account is active. Order prescribed and OTC medicines
            conveniently from nearby licensed pharmacies.
          </p>

          <Link
            to="/customer/profile"
            className="mt-6 text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            Manage Profile <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
