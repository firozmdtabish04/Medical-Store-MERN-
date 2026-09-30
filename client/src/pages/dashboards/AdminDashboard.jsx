import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Pill,
  Package,
  Truck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ArrowRight,
  UserCheck,
  Activity,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Pharmacies",
      value: "86",
      icon: Store,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Medicines",
      value: "2,450",
      icon: Pill,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Total Orders",
      value: "5,820",
      icon: Package,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  const managementCards = [
    {
      title: "Manage Users",
      description: "View and manage registered customers and platform users.",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Manage Pharmacies",
      description: "Approve, reject and manage registered pharmacies.",
      icon: Store,
      path: "/admin/pharmacies",
    },
    {
      title: "Manage Medicines",
      description: "Manage the platform medicine catalogue.",
      icon: Pill,
      path: "/admin/medicines",
    },
    {
      title: "Manage Orders",
      description: "Monitor customer orders across the platform.",
      icon: Package,
      path: "/admin/orders",
    },
    {
      title: "Delivery Partners",
      description: "Manage delivery partners and their activity.",
      icon: Truck,
      path: "/admin/delivery-partners",
    },
    {
      title: "Settings",
      description: "Configure MediFind platform settings.",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="p-6 overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-lg relative from-gray-900 to-gray-800 sm:p-8">
        <div className="z-10 relative">
          <div className="gap-2 flex items-center">
            <ShieldCheck size={18} className="text-green-400" />

            <span className="text-sm font-semibold text-green-400">
              Administration Panel
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Welcome, {user?.name || "Administrator"}!
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-gray-300 leading-6 sm:text-base">
            Monitor and manage the MediFind healthcare platform from one
            centralized administration dashboard.
          </p>
        </div>

        <ShieldCheck
          size={130}
          className="text-white/5 absolute -bottom-8 right-8 hidden sm:block"
        />
      </section>

      {/* Platform Stats */}
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

      {/* Approval Alert */}
      <section className="p-5 rounded-2xl border border-orange-100 bg-orange-50">
        <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
          <div className="gap-4 flex items-center">
            <div className="h-11 w-11 justify-center rounded-xl bg-orange-100 text-orange-600 flex items-center">
              <AlertTriangle size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Pharmacy approvals pending
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                7 pharmacies are waiting for admin approval.
              </p>
            </div>
          </div>

          <Link
            to="/admin/pharmacies"
            className="gap-2 px-4 py-2.5 justify-center rounded-xl bg-orange-500 text-sm font-bold text-white inline-flex items-center transition hover:bg-orange-600"
          >
            Review Pharmacies
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Management */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Platform Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the major areas of the MediFind platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {managementCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.path}
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

                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>

                <p className="mt-1 text-sm text-gray-500 leading-5">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity + Orders */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">Recent Activity</h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest platform activities
              </p>
            </div>

            <Activity size={20} className="text-green-600" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="gap-3 flex">
              <div className="h-9 w-9 justify-center rounded-lg bg-green-100 text-green-600 flex shrink-0 items-center">
                <UserCheck size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  New pharmacy registered
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  CityCare Pharmacy submitted registration.
                </p>

                <span className="mt-1 text-[10px] text-gray-400 block">
                  10 minutes ago
                </span>
              </div>
            </div>

            <div className="gap-3 flex">
              <div className="h-9 w-9 justify-center rounded-lg bg-blue-100 text-blue-600 flex shrink-0 items-center">
                <Users size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  New customer registered
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  A new customer joined MediFind.
                </p>

                <span className="mt-1 text-[10px] text-gray-400 block">
                  25 minutes ago
                </span>
              </div>
            </div>

            <div className="gap-3 flex">
              <div className="h-9 w-9 justify-center rounded-lg bg-purple-100 text-purple-600 flex shrink-0 items-center">
                <Package size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Order completed
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Order #MF-1023 was successfully delivered.
                </p>

                <span className="mt-1 text-[10px] text-gray-400 block">
                  1 hour ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Overview */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="justify-between flex items-center">
            <div>
              <h2 className="font-extrabold text-gray-900">Order Overview</h2>

              <p className="mt-1 text-sm text-gray-500">
                Today's platform orders
              </p>
            </div>

            <Clock3 size={20} className="text-gray-400" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Delivered</span>

                <span className="font-bold text-green-600">72%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[72%] rounded-full bg-green-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Processing</span>

                <span className="font-bold text-blue-600">18%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[18%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Cancelled</span>

                <span className="font-bold text-red-600">10%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[10%] rounded-full bg-red-500" />
              </div>
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            View All Orders
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* System Status */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h2 className="font-extrabold text-gray-900">System Status</h2>

            <p className="text-sm text-gray-500">MediFind platform services</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="text-sm font-medium text-gray-600">
              API Server
            </span>

            <span className="flex items-center gap-2 text-xs font-bold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="text-sm font-medium text-gray-600">Database</span>

            <span className="flex items-center gap-2 text-xs font-bold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="text-sm font-medium text-gray-600">Socket.IO</span>

            <span className="flex items-center gap-2 text-xs font-bold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Operational
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
