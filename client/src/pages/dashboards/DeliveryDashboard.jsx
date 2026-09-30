import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Package,
  MapPin,
  Clock3,
  CheckCircle2,
  IndianRupee,
  Navigation,
  ArrowRight,
  CircleDot,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function DeliveryDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Available Deliveries",
      value: "6",
      icon: Package,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Active Delivery",
      value: "1",
      icon: Truck,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Completed Today",
      value: "8",
      icon: CheckCircle2,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Today's Earnings",
      value: "₹640",
      icon: IndianRupee,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Available Deliveries",
      description: "View nearby orders waiting for delivery partners.",
      icon: Package,
      path: "/delivery/available",
    },
    {
      title: "My Deliveries",
      description: "View your assigned and completed deliveries.",
      icon: Truck,
      path: "/delivery/my-deliveries",
    },
    {
      title: "Active Delivery",
      description: "Navigate and update your current delivery.",
      icon: Navigation,
      path: "/delivery/active",
    },
    {
      title: "Delivery History",
      description: "View your previous delivery records.",
      icon: Clock3,
      path: "/delivery/history",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-green-600 to-emerald-500 sm:p-8">
        <div className="z-10 relative">
          <div className="gap-2 flex items-center">
            <Truck size={18} className="text-green-100" />

            <span className="text-sm font-semibold text-green-100">
              Delivery Partner
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Hello, {user?.name || "Delivery Partner"}!
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-green-50 leading-6 sm:text-base">
            Manage your deliveries, navigate to customers and keep track of your
            delivery earnings from one place.
          </p>

          <Link
            to="/delivery/available"
            className="mt-6 gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 shadow-md inline-flex items-center transition hover:bg-green-50"
          >
            <Package size={18} />
            Find Deliveries
            <ArrowRight size={17} />
          </Link>
        </div>

        <Truck
          size={130}
          className="bottom-3 text-white/10 absolute right-8 hidden sm:block"
        />
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
                  <Icon size={23} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Online Status */}
      <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
          <div className="gap-4 flex items-center">
            <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900">You're Online</h2>

              <p className="mt-1 text-sm text-gray-500">
                You can receive new delivery requests.
              </p>
            </div>
          </div>

          <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50">
            Go Offline
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your delivery activities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                  />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">{action.title}</h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active Delivery */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-gray-900">Active Delivery</h2>

              <p className="mt-1 text-sm text-gray-500">
                Current delivery assigned to you
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
              OUT FOR DELIVERY
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-5">
            {/* Order */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Package size={22} />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Order #MF-1024</p>

                  <p className="mt-1 text-xs text-gray-500">
                    3 medicines • 2.4 km away
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <IndianRupee size={16} />
                ₹80
              </div>
            </div>

            {/* Route */}
            <div className="mt-6 space-y-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <StoreIcon />
                  </div>

                  <div className="mt-1 h-8 w-px border-l border-dashed border-gray-300" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">PICKUP</p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    CityCare Pharmacy
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Saheed Nagar, Bhubaneswar
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    DELIVERY
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    Customer Location
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Bhubaneswar, Odisha
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/delivery/active"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
              >
                <Navigation size={17} />
                Navigate
              </Link>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
                <Phone size={17} />
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-extrabold text-gray-900">Today's Summary</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your delivery performance
          </p>

          <div className="mt-6 space-y-5">
            <div className="justify-between flex items-center">
              <div className="gap-3 flex items-center">
                <CheckCircle2 size={19} className="text-green-600" />

                <span className="text-sm text-gray-600">Completed</span>
              </div>

              <span className="font-extrabold text-gray-900">8</span>
            </div>

            <div className="justify-between flex items-center">
              <div className="gap-3 flex items-center">
                <Clock3 size={19} className="text-orange-500" />

                <span className="text-sm text-gray-600">In Progress</span>
              </div>

              <span className="font-extrabold text-gray-900">1</span>
            </div>

            <div className="justify-between flex items-center">
              <div className="gap-3 flex items-center">
                <IndianRupee size={19} className="text-purple-600" />

                <span className="text-sm text-gray-600">Earnings</span>
              </div>

              <span className="font-extrabold text-gray-900">₹640</span>
            </div>
          </div>

          <Link
            to="/delivery/history"
            className="mt-7 gap-2 py-3 justify-center rounded-xl bg-gray-900 text-sm font-bold text-white flex items-center hover:bg-gray-800"
          >
            View History
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Nearby Deliveries */}
      <section className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="justify-between flex items-center">
          <div>
            <h2 className="font-extrabold text-gray-900">
              Nearby Delivery Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orders available near your current location
            </p>
          </div>

          <Link
            to="/delivery/available"
            className="text-sm font-bold text-green-600"
          >
            View All
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex-col gap-4 p-4 rounded-xl bg-gray-50 flex sm:flex-row sm:items-center">
            <div className="h-11 w-11 justify-center rounded-xl bg-blue-100 text-blue-600 flex items-center">
              <Package size={20} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Order #MF-1025</p>

              <p className="mt-1 text-xs text-gray-500">
                1.2 km • ₹70 delivery earning
              </p>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-green-600 text-xs font-bold text-white hover:bg-green-700">
              View
            </button>
          </div>

          <div className="flex-col gap-4 p-4 rounded-xl bg-gray-50 flex sm:flex-row sm:items-center">
            <div className="h-11 w-11 justify-center rounded-xl bg-purple-100 text-purple-600 flex items-center">
              <Package size={20} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Order #MF-1026</p>

              <p className="mt-1 text-xs text-gray-500">
                2.8 km • ₹90 delivery earning
              </p>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-green-600 text-xs font-bold text-white hover:bg-green-700">
              View
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Small local icon component */
function StoreIcon() {
  return <CircleDot size={17} />;
}

export default DeliveryDashboard;
