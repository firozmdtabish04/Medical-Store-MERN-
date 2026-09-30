import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Pill,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Plus,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function PharmacistDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Medicines",
      value: "248",
      icon: Pill,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Today's Orders",
      value: "18",
      icon: Package,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Low Stock",
      value: "12",
      icon: AlertTriangle,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      title: "Today's Sales",
      value: "₹8,450",
      icon: TrendingUp,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Add Medicine",
      description: "Add a new medicine to your pharmacy inventory.",
      icon: Plus,
      path: "/pharmacist/medicines",
    },
    {
      title: "Manage Inventory",
      description: "Update price, discount and stock availability.",
      icon: ClipboardList,
      path: "/pharmacist/inventory",
    },
    {
      title: "Manage Orders",
      description: "Accept, prepare and manage customer orders.",
      icon: Package,
      path: "/pharmacist/orders",
    },
    {
      title: "My Pharmacy",
      description: "View and update your pharmacy information.",
      icon: Store,
      path: "/pharmacist/pharmacy",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-green-600 to-emerald-500 sm:p-8">
        <div className="z-10 relative">
          <p className="text-sm font-medium text-green-100">
            Pharmacist Portal
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Welcome, {user?.name || "Pharmacist"}!
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-green-50 leading-6 sm:text-base">
            Manage your pharmacy, medicines, inventory and customer orders from
            one centralized dashboard.
          </p>

          <div className="flex-wrap mt-6 gap-3 flex">
            <Link
              to="/pharmacist/medicines"
              className="gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 shadow-md inline-flex items-center hover:bg-green-50"
            >
              <Plus size={18} />
              Add Medicine
            </Link>

            <Link
              to="/pharmacist/orders"
              className="gap-2 px-5 py-3 rounded-xl border border-white/30 bg-white/10 text-sm font-bold text-white inline-flex items-center backdrop-blur hover:bg-white/20"
            >
              <Package size={18} />
              View Orders
            </Link>
          </div>
        </div>

        <div className="h-56 w-56 rounded-full bg-white/10 absolute -right-10 -top-10 hidden sm:block" />

        <Store
          size={100}
          className="bottom-5 text-white/10 absolute right-10 hidden sm:block"
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

      {/* Pharmacy Status */}
      <section className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
          <div className="gap-4 flex items-center">
            <div className="h-12 w-12 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
              <Store size={23} />
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900">Pharmacy Status</h2>

              <p className="mt-1 text-sm text-gray-500">
                Your pharmacy is currently available on MediFind.
              </p>
            </div>
          </div>

          <div className="gap-2 flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <span className="text-sm font-bold text-green-600">Active</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your pharmacy operations.
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

      {/* Orders + Stock */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">Recent Orders</h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders
              </p>
            </div>

            <Link
              to="/pharmacist/orders"
              className="text-sm font-bold text-green-600"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            <div className="gap-4 p-4 rounded-xl bg-gray-50 flex items-center">
              <div className="h-10 w-10 justify-center rounded-lg bg-blue-100 text-blue-600 flex items-center">
                <Package size={18} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Order #MF-1024
                </p>

                <p className="text-xs text-gray-500">3 medicines • ₹450</p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-[10px] font-bold text-yellow-700">
                PENDING
              </span>
            </div>

            <div className="gap-4 p-4 rounded-xl bg-gray-50 flex items-center">
              <div className="h-10 w-10 justify-center rounded-lg bg-green-100 text-green-600 flex items-center">
                <CheckCircle2 size={18} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Order #MF-1023
                </p>

                <p className="text-xs text-gray-500">2 medicines • ₹720</p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-green-100 text-[10px] font-bold text-green-700">
                ACCEPTED
              </span>
            </div>

            <div className="gap-4 p-4 rounded-xl bg-gray-50 flex items-center">
              <div className="h-10 w-10 justify-center rounded-lg bg-purple-100 text-purple-600 flex items-center">
                <ShoppingBag size={18} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">
                  Order #MF-1022
                </p>

                <p className="text-xs text-gray-500">5 medicines • ₹1,240</p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[10px] font-bold text-purple-700">
                READY
              </span>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">
                Low Stock Medicines
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Medicines that need restocking
              </p>
            </div>

            <AlertTriangle size={21} className="text-orange-500" />
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Paracetamol 500mg", "8 units"],
              ["Azithromycin 500mg", "5 units"],
              ["Cetirizine 10mg", "7 units"],
              ["Pantoprazole 40mg", "4 units"],
            ].map(([name, stock]) => (
              <div
                key={name}
                className="p-4 justify-between rounded-xl bg-orange-50 flex items-center"
              >
                <div className="gap-3 flex items-center">
                  <div className="h-9 w-9 justify-center rounded-lg bg-white text-orange-500 flex items-center">
                    <Pill size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>

                    <p className="text-xs text-orange-600">{stock} remaining</p>
                  </div>
                </div>

                <Link
                  to="/pharmacist/inventory"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Update
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Summary */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <TrendingUp size={21} />
          </div>

          <div>
            <h2 className="font-extrabold text-gray-900">
              Today's Performance
            </h2>

            <p className="text-sm text-gray-500">Pharmacy activity overview</p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-6 gap-4 md:grid-cols-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500">Orders</p>
            <p className="mt-1 text-xl font-extrabold text-gray-900">18</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="mt-1 text-xl font-extrabold text-green-600">14</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="mt-1 text-xl font-extrabold text-orange-500">3</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-500">Cancelled</p>
            <p className="mt-1 text-xl font-extrabold text-red-500">1</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacistDashboard;
