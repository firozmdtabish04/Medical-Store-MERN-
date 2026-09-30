import React from "react";
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

function CustomerDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Orders",
      value: "12",
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Orders",
      value: "2",
      icon: Truck,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Cart Items",
      value: "4",
      icon: ShoppingCart,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Nearby Pharmacies",
      value: "18",
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
            your delivery from one place.
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

        {/* Decorative icon */}
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

          <p className="mt-1 text-sm text-gray-500">
            What would you like to do?
          </p>
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

      {/* Active Order */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">Active Order</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest medicine order
              </p>
            </div>

            <Link
              to="/customer/orders"
              className="text-sm font-bold text-green-600 hover:text-green-700"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
              <div className="gap-4 flex items-center">
                <div className="h-12 w-12 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
                  <Package size={22} />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Order #MF-1024</p>

                  <p className="mt-1 text-xs text-gray-500">
                    3 medicines • ₹450
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 w-fit rounded-full bg-green-100 text-xs font-bold text-green-700">
                OUT FOR DELIVERY
              </span>
            </div>

            {/* Progress */}
            <div className="mt-6 flex items-center">
              <div className="h-8 w-8 justify-center rounded-full bg-green-600 text-white flex items-center">
                ✓
              </div>

              <div className="flex-1 h-1 bg-green-600" />

              <div className="h-8 w-8 justify-center rounded-full bg-green-600 text-white flex items-center">
                ✓
              </div>

              <div className="flex-1 h-1 bg-green-600" />

              <div className="h-8 w-8 justify-center rounded-full bg-green-600 text-white flex items-center">
                <Truck size={15} />
              </div>

              <div className="flex-1 h-1 bg-gray-200" />

              <div className="h-8 w-8 rounded-full border-2 border-gray-200 bg-white" />
            </div>

            <div className="mt-3 justify-between text-[10px] font-semibold text-gray-500 flex">
              <span>Placed</span>
              <span>Prepared</span>
              <span>On the way</span>
              <span>Delivered</span>
            </div>

            <Link
              to="/customer/tracking"
              className="mt-5 gap-2 py-3 justify-center rounded-xl bg-green-600 text-sm font-bold text-white flex items-center transition hover:bg-green-700"
            >
              <MapPin size={17} />
              Track Order
            </Link>
          </div>
        </div>

        {/* Account */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-12 w-12 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
            <ShieldCheck size={23} />
          </div>

          <h2 className="mt-4 font-extrabold text-gray-900">Your Account</h2>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            Your MediFind account is ready to help you find and order medicines
            from nearby pharmacies.
          </p>

          <div className="mt-5 text-sm space-y-3">
            <div className="pb-3 justify-between border-b border-gray-100 flex">
              <span className="text-gray-500">Name</span>
              <span className="font-semibold text-gray-900">
                {user?.name || "-"}
              </span>
            </div>

            <div className="pb-3 justify-between border-b border-gray-100 flex">
              <span className="text-gray-500">Email</span>
              <span className="max-w-[150px] font-semibold text-gray-900 truncate">
                {user?.email || "-"}
              </span>
            </div>

            <div className="justify-between flex">
              <span className="text-gray-500">Role</span>
              <span className="font-semibold text-green-600">
                {user?.role || "CUSTOMER"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="justify-between flex items-center">
          <div>
            <h2 className="font-extrabold text-gray-900">Recent Activity</h2>

            <p className="mt-1 text-sm text-gray-500">
              Your recent MediFind activity
            </p>
          </div>

          <Clock3 size={20} className="text-gray-400" />
        </div>

        <div className="mt-5 space-y-4">
          <div className="gap-4 p-4 rounded-xl bg-gray-50 flex items-center">
            <div className="h-10 w-10 justify-center rounded-lg bg-green-100 text-green-600 flex items-center">
              <Search size={18} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Medicine search</p>

              <p className="text-xs text-gray-500">
                You searched for medicines nearby
              </p>
            </div>

            <span className="text-xs text-gray-400">Today</span>
          </div>

          <div className="gap-4 p-4 rounded-xl bg-gray-50 flex items-center">
            <div className="h-10 w-10 justify-center rounded-lg bg-blue-100 text-blue-600 flex items-center">
              <Package size={18} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Order placed</p>

              <p className="text-xs text-gray-500">
                Your medicine order was successfully placed
              </p>
            </div>

            <span className="text-xs text-gray-400">Yesterday</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
