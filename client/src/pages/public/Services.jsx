import React from "react";
import {
  Search,
  MapPin,
  Pill,
  Store,
  Truck,
  Navigation,
  ShieldCheck,
  Clock3,
  BadgeIndianRupee,
  PackageCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Users,
  ClipboardList,
} from "lucide-react";

function Services() {
  const services = [
    {
      icon: Search,
      title: "Medicine Search",
      description:
        "Search for medicines by name and quickly discover pharmacies that have them available.",
      features: [
        "Search by medicine name",
        "Check medicine availability",
        "View medicine details",
      ],
    },
    {
      icon: MapPin,
      title: "Nearby Pharmacies",
      description:
        "Find registered pharmacies near your current location and check their distance from you.",
      features: [
        "Location-based search",
        "Distance calculation",
        "Open / closed status",
      ],
    },
    {
      icon: BadgeIndianRupee,
      title: "Price Comparison",
      description:
        "Compare medicine prices and discounts across nearby pharmacies before placing your order.",
      features: [
        "Compare prices",
        "View discounts",
        "Choose affordable options",
      ],
    },
    {
      icon: PackageCheck,
      title: "Online Ordering",
      description:
        "Select a pharmacy, add medicines to your order and place your medicine request online.",
      features: ["Simple ordering", "Order summary", "Order history"],
    },
    {
      icon: Truck,
      title: "Medicine Delivery",
      description:
        "Get your medicines delivered to your selected address through an assigned delivery partner.",
      features: [
        "Doorstep delivery",
        "Delivery partner assignment",
        "Delivery status updates",
      ],
    },
    {
      icon: Navigation,
      title: "Live Order Tracking",
      description:
        "Track the progress of your order from pharmacy acceptance to final delivery.",
      features: [
        "Order status",
        "Delivery tracking",
        "Estimated delivery time",
      ],
    },
    {
      icon: Store,
      title: "Pharmacy Management",
      description:
        "Pharmacy owners can register their stores and manage medicines, prices and inventory.",
      features: [
        "Pharmacy registration",
        "Medicine inventory",
        "Stock management",
      ],
    },
    {
      icon: Users,
      title: "Delivery Partner Platform",
      description:
        "Delivery partners can receive available delivery requests and manage active deliveries.",
      features: [
        "Available deliveries",
        "Accept delivery",
        "Update delivery status",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Verified Platform",
      description:
        "Pharmacies are reviewed through the platform's approval workflow before becoming available.",
      features: [
        "Pharmacy approval",
        "Secure authentication",
        "Role-based access",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Search Medicine",
      description: "Enter the medicine name you are looking for.",
    },
    {
      number: "02",
      icon: MapPin,
      title: "Find Pharmacy",
      description: "Discover nearby pharmacies with available stock.",
    },
    {
      number: "03",
      icon: ClipboardList,
      title: "Place Order",
      description: "Choose your pharmacy and place your order.",
    },
    {
      number: "04",
      icon: Truck,
      title: "Get Delivered",
      description: "Track the delivery until it reaches your doorstep.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      {/* =========================================
          HERO
      ========================================== */}

      <section className="relative">
        {/* Background decorations */}

        <div className="top-10 h-80 w-80 rounded-full bg-green-100/70 absolute -left-32 blur-3xl" />

        <div className="top-20 h-80 w-80 rounded-full bg-red-100/50 absolute -right-32 blur-3xl" />

        <div className="px-4 pb-20 pt-16 mx-auto max-w-7xl relative sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}

            <div className="gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-sm font-bold text-green-700 inline-flex items-center">
              <HeartPulse size={17} />
              MediFind Services
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
              Healthcare Services
              <span className="text-green-600 block">Made Simple</span>
            </h1>

            {/* Description */}

            <p className="mt-6 mx-auto max-w-2xl text-base text-gray-600 leading-7 sm:text-lg">
              From finding medicines to tracking your delivery, MediFind
              connects customers, pharmacies and delivery partners through one
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          MAIN SERVICES
      ========================================== */}

      <section className="bg-gray-50">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Heading */}

          <div className="max-w-2xl">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
              What We Offer
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need
              <span className="text-green-600"> in One Place</span>
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              MediFind provides services for customers, pharmacies and delivery
              partners.
            </p>
          </div>

          {/* Service Grid */}

          <div className="grid mt-12 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm group transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-xl"
                >
                  {/* Icon */}

                  <div className="h-14 w-14 justify-center rounded-2xl bg-green-50 flex items-center transition duration-300 group-hover:bg-green-600">
                    <Icon
                      size={27}
                      className="text-green-600 transition group-hover:text-white"
                    />
                  </div>

                  {/* Number */}

                  <span className="mt-5 text-xs font-bold text-gray-300 block">
                    SERVICE {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-3 text-sm text-gray-600 leading-6">
                    {service.description}
                  </p>

                  {/* Features */}

                  <div className="mt-5 space-y-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="gap-2 text-sm text-gray-600 flex items-center"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-green-600 shrink-0"
                        />

                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          CUSTOMER SERVICES
      ========================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-12 items-center lg:grid-cols-2">
          {/* Left Content */}

          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
              For Customers
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find the Medicine
              <span className="text-green-600"> You Need</span>
            </h2>

            <p className="mt-5 text-gray-600 leading-7">
              Search for medicines around your location, compare pharmacies and
              place your order without visiting multiple stores.
            </p>

            <div className="mt-8 space-y-4">
              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <Search size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Search Medicines</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Search by medicine name and discover available pharmacies.
                  </p>
                </div>
              </div>

              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <BadgeIndianRupee size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Compare Prices</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Compare prices and discounts before selecting a pharmacy.
                  </p>
                </div>
              </div>

              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <Truck size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Track Delivery</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Follow your order from pharmacy to doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}

          <div className="p-8 rounded-[2rem] bg-green-600 text-white shadow-2xl shadow-green-900/20 sm:p-10">
            <div className="h-14 w-14 justify-center rounded-2xl bg-white/15 flex items-center">
              <Pill size={28} />
            </div>

            <h3 className="mt-7 text-3xl font-extrabold">
              Your Medicine,
              <br />
              Your Choice.
            </h3>

            <p className="mt-4 text-green-50 leading-7">
              Find nearby pharmacies, compare available options and select the
              one that works best for your needs.
            </p>

            <button
              type="button"
              className="mt-7 gap-2 px-5 py-3 rounded-xl bg-white text-sm font-bold text-green-700 inline-flex items-center transition hover:bg-green-50"
            >
              Find Medicine
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          PHARMACY SERVICES
      ========================================== */}

      <section className="bg-gray-900 text-white">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold text-green-400 uppercase tracking-wider">
                For Pharmacies
              </span>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Grow Your Pharmacy
                <span className="text-green-400"> with MediFind</span>
              </h2>

              <p className="mt-5 text-gray-400 leading-7">
                Register your pharmacy, manage medicine inventory and receive
                orders from nearby customers.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                <Store size={24} className="text-green-400" />

                <h3 className="mt-4 font-bold">Register Pharmacy</h3>

                <p className="mt-2 text-sm text-gray-400 leading-6">
                  Create and manage your pharmacy profile.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                <Pill size={24} className="text-green-400" />

                <h3 className="mt-4 font-bold">Manage Inventory</h3>

                <p className="mt-2 text-sm text-gray-400 leading-6">
                  Add medicines and update stock levels.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                <ClipboardList size={24} className="text-green-400" />

                <h3 className="mt-4 font-bold">Manage Orders</h3>

                <p className="mt-2 text-sm text-gray-400 leading-6">
                  Receive and process customer orders.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                <ShieldCheck size={24} className="text-green-400" />

                <h3 className="mt-4 font-bold">Verified Profile</h3>

                <p className="mt-2 text-sm text-gray-400 leading-6">
                  Build trust through the pharmacy approval process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How MediFind Works
          </h2>
        </div>

        <div className="grid mt-12 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm relative"
              >
                <div className="justify-between flex items-center">
                  <div className="h-12 w-12 justify-center rounded-xl bg-green-100 flex items-center">
                    <Icon size={22} className="text-green-600" />
                  </div>

                  <span className="text-3xl font-extrabold text-gray-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-6">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          SECURITY
      ========================================== */}

      <section className="bg-green-50">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex-col gap-8 justify-between text-center flex items-center md:flex-row md:text-left">
            <div>
              <div className="gap-3 justify-center flex items-center md:justify-start">
                <div className="h-12 w-12 justify-center rounded-xl bg-green-600 text-white flex items-center">
                  <ShieldCheck size={24} />
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Secure & Reliable
                </h2>
              </div>

              <p className="mt-3 max-w-2xl text-gray-600">
                MediFind uses authentication, role-based access and pharmacy
                approval workflows to provide a structured healthcare
                marketplace.
              </p>
            </div>

            <div className="flex-wrap gap-3 justify-center flex">
              <span className="px-4 py-2 rounded-full bg-white text-sm font-semibold text-gray-700 shadow-sm">
                Secure Login
              </span>

              <span className="px-4 py-2 rounded-full bg-white text-sm font-semibold text-gray-700 shadow-sm">
                Verified Pharmacies
              </span>

              <span className="px-4 py-2 rounded-full bg-white text-sm font-semibold text-gray-700 shadow-sm">
                Order Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA
      ========================================== */}

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="px-6 py-14 mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r text-center shadow-2xl shadow-green-900/20 from-green-600 to-green-700 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <Smartphone size={36} className="mx-auto text-white" />

            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Find Your Medicine?
            </h2>

            <p className="mt-4 text-green-50 leading-7">
              Search nearby pharmacies and discover available medicines with
              MediFind.
            </p>

            <button
              type="button"
              className="mt-8 gap-2 px-7 py-3.5 rounded-xl bg-white font-bold text-green-700 inline-flex items-center transition hover:bg-green-50"
            >
              Search Medicine
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
