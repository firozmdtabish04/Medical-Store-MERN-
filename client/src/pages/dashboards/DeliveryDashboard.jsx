import React, { useState, useEffect } from "react";
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
import api from "../../services/api";

function DeliveryDashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    availableDeliveries: 0,
    hasActiveDelivery: false,
    completedToday: 0,
    todayEarnings: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/delivery/stats");
        if (res.data?.stats) {
          setStatsData(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to load delivery stats:", err);
      }
    };

    loadStats();
  }, []);

  const stats = [
    {
      title: "Available Deliveries",
      value: statsData.availableDeliveries.toString(),
      icon: Package,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Active Runs",
      value: statsData.hasActiveDelivery ? "1" : "0",
      icon: Truck,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Completed Today",
      value: statsData.completedToday.toString(),
      icon: CheckCircle2,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Today's Earnings",
      value: `₹${statsData.todayEarnings}`,
      subtitle: `Rate: ₹${statsData.earningsPerDelivery || 40}/delivery`,
      icon: IndianRupee,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Available Deliveries",
      description: "View nearby pharmacy orders waiting for pickup.",
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
      description: "Live delivery cockpit & customer navigation.",
      icon: Navigation,
      path: "/delivery/active",
    },
    {
      title: "Delivery History",
      description: "View historical delivery records and payouts.",
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
            Pick up medicine orders from pharmacies and deliver safely to customers.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/delivery/available"
              className="gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 shadow-md inline-flex items-center transition hover:bg-green-50"
            >
              <Package size={18} />
              Find Deliveries
              <ArrowRight size={17} />
            </Link>

            {statsData.hasActiveDelivery && (
              <Link
                to="/delivery/active"
                className="gap-2 px-5 py-3 rounded-xl bg-emerald-800 text-sm font-bold text-white shadow-md inline-flex items-center hover:bg-emerald-900"
              >
                <Navigation size={18} />
                Open Active Run
              </Link>
            )}
          </div>
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

                  {stat.subtitle && (
                    <p className="mt-1 text-[11px] font-semibold text-gray-400">
                      {stat.subtitle}
                    </p>
                  )}
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

      {/* Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Delivery Operations
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Dispatch, transit and completed tasks
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
    </div>
  );
}

export default DeliveryDashboard;
