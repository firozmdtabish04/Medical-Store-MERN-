import React from "react";
import {
  HeartPulse,
  ShieldCheck,
  Users,
  Store,
  Truck,
  Search,
  MapPin,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  Activity,
  Clock3,
  Pill,
} from "lucide-react";

function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      description:
        "We focus on connecting customers with registered and approved pharmacies through a structured platform.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Our platform is designed around making medicine discovery and ordering simple and convenient.",
    },
    {
      icon: Clock3,
      title: "Convenience",
      description:
        "Find medicine availability and nearby pharmacies without having to visit multiple stores.",
    },
    {
      icon: Activity,
      title: "Technology",
      description:
        "We use modern technology to connect customers, pharmacies and delivery partners.",
    },
  ];

  const platformFeatures = [
    {
      icon: Search,
      title: "Medicine Discovery",
      text: "Search medicines and discover pharmacies where they may be available.",
    },
    {
      icon: MapPin,
      title: "Location Based Search",
      text: "Find pharmacies based on your current location and distance.",
    },
    {
      icon: Store,
      title: "Pharmacy Network",
      text: "Connect customers with registered pharmacies on the platform.",
    },
    {
      icon: Truck,
      title: "Delivery Support",
      text: "Enable delivery partners to manage medicine delivery requests.",
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
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Left */}

            <div>
              <div className="gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-sm font-bold text-green-700 inline-flex items-center">
                <HeartPulse size={17} />
                About MediFind
              </div>

              <h1 className="mt-6 text-4xl font-extrabold text-gray-900 leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Making Medicine
                <span className="text-green-600 block">Easier to Find</span>
              </h1>

              <p className="mt-6 max-w-xl text-base text-gray-600 leading-7 sm:text-lg">
                MediFind is a medicine discovery and pharmacy platform designed
                to help customers find available medicines from nearby
                pharmacies.
              </p>

              <p className="mt-4 max-w-xl text-gray-500 leading-7">
                Our goal is to bring customers, pharmacies and delivery partners
                together through one easy-to-use digital platform.
              </p>

              <div className="flex-wrap mt-8 gap-3 flex">
                <a
                  href="/services"
                  className="gap-2 px-6 py-3 rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 inline-flex items-center transition hover:bg-green-700"
                >
                  Explore Services
                  <ArrowRight size={18} />
                </a>

                <a
                  href="/contact"
                  className="gap-2 px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 inline-flex items-center transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right */}

            <div className="relative">
              {/* Decorative circles */}

              <div className="h-32 w-32 rounded-full border-[20px] border-green-100 absolute -right-6 -top-6" />

              <div className="h-28 w-28 rounded-full border-[18px] border-red-100 absolute -bottom-6 -left-6" />

              {/* Main card */}

              <div className="p-8 rounded-[2rem] bg-gradient-to-br text-white shadow-2xl shadow-green-900/20 relative from-green-600 to-green-800 sm:p-10">
                <div className="h-16 w-16 justify-center rounded-2xl bg-white/15 flex items-center">
                  <HeartPulse size={32} />
                </div>

                <h2 className="mt-8 text-3xl font-extrabold">
                  Healthcare
                  <br />
                  Connected.
                </h2>

                <p className="mt-5 text-green-50 leading-7">
                  One platform connecting people who need medicines with
                  pharmacies that have them.
                </p>

                <div className="grid grid-cols-2 mt-8 gap-3">
                  <div className="p-4 rounded-2xl bg-white/10">
                    <Search size={21} />

                    <p className="mt-3 text-sm font-semibold">Search</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10">
                    <MapPin size={21} />

                    <p className="mt-3 text-sm font-semibold">Locate</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10">
                    <Store size={21} />

                    <p className="mt-3 text-sm font-semibold">Compare</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10">
                    <Truck size={21} />

                    <p className="mt-3 text-sm font-semibold">Deliver</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          OUR STORY
      ========================================== */}

      <section className="bg-gray-50">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-12 items-center lg:grid-cols-2">
            {/* Visual */}

            <div className="relative">
              <div className="p-8 rounded-[2rem] bg-white shadow-xl">
                <div className="gap-4 flex items-center">
                  <div className="h-14 w-14 justify-center rounded-2xl bg-green-100 flex items-center">
                    <Pill size={28} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      MediFind
                    </p>

                    <h3 className="text-xl font-extrabold text-gray-900">
                      Medicine Discovery
                    </h3>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
                    <CheckCircle2 size={20} className="text-green-600" />

                    <span className="text-sm font-medium text-gray-700">
                      Find available medicines
                    </span>
                  </div>

                  <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
                    <CheckCircle2 size={20} className="text-green-600" />

                    <span className="text-sm font-medium text-gray-700">
                      Discover nearby pharmacies
                    </span>
                  </div>

                  <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
                    <CheckCircle2 size={20} className="text-green-600" />

                    <span className="text-sm font-medium text-gray-700">
                      Compare available options
                    </span>
                  </div>

                  <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
                    <CheckCircle2 size={20} className="text-green-600" />

                    <span className="text-sm font-medium text-gray-700">
                      Track medicine delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}

            <div>
              <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                Our Story
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                A Simpler Way to
                <span className="text-green-600"> Find Medicine</span>
              </h2>

              <p className="mt-5 text-gray-600 leading-7">
                Finding a particular medicine can sometimes mean visiting or
                calling multiple pharmacies. MediFind is designed to reduce that
                effort by bringing medicine availability and pharmacy discovery
                into one platform.
              </p>

              <p className="mt-4 text-gray-600 leading-7">
                Customers can search for medicines, discover nearby pharmacies,
                compare available options and place orders through the platform.
              </p>

              <p className="mt-4 text-gray-600 leading-7">
                At the same time, pharmacies get tools to manage their store
                information, medicines, inventory and customer orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          MISSION & VISION
      ========================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mission */}

          <div className="p-8 rounded-[2rem] border border-green-100 bg-green-50 sm:p-10">
            <div className="h-14 w-14 justify-center rounded-2xl bg-green-600 text-white flex items-center">
              <Target size={27} />
            </div>

            <h2 className="mt-7 text-2xl font-extrabold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              To make medicine discovery more convenient by connecting customers
              with nearby pharmacies through an easy-to-use digital platform.
            </p>
          </div>

          {/* Vision */}

          <div className="p-8 rounded-[2rem] border border-red-100 bg-red-50 sm:p-10">
            <div className="h-14 w-14 justify-center rounded-2xl bg-red-500 text-white flex items-center">
              <Eye size={27} />
            </div>

            <h2 className="mt-7 text-2xl font-extrabold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              To build a connected healthcare marketplace where customers can
              discover medicines and pharmacies can serve their local
              communities digitally.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          PLATFORM FEATURES
      ========================================== */}

      <section className="bg-gray-900 text-white">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold text-green-400 uppercase tracking-wider">
              Our Platform
            </span>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Built Around
              <span className="text-green-400"> Real Needs</span>
            </h2>

            <p className="mt-4 text-gray-400 leading-7">
              MediFind brings multiple healthcare-related workflows together
              into a single platform.
            </p>
          </div>

          <div className="grid mt-12 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="h-12 w-12 justify-center rounded-xl bg-green-600 flex items-center">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 text-sm text-gray-400 leading-6">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          OUR VALUES
      ========================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
            What Matters to Us
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Values
          </h2>

          <p className="mt-4 text-gray-600 leading-7">
            The principles that shape the MediFind platform.
          </p>
        </div>

        <div className="grid mt-12 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="p-7 rounded-3xl border border-gray-100 bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto h-14 w-14 justify-center rounded-2xl bg-green-100 flex items-center">
                  <Icon size={26} className="text-green-600" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm text-gray-600 leading-6">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          WHO WE CONNECT
      ========================================== */}

      <section className="bg-green-50">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
              One Platform
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Connecting Everyone
            </h2>
          </div>

          <div className="grid mt-12 gap-5 md:grid-cols-3">
            {/* Customer */}

            <div className="p-7 rounded-3xl bg-white shadow-sm">
              <div className="h-12 w-12 justify-center rounded-xl bg-green-100 flex items-center">
                <Users size={23} className="text-green-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Customers
              </h3>

              <p className="mt-3 text-sm text-gray-600 leading-6">
                Search medicines, discover pharmacies, place orders and track
                deliveries.
              </p>
            </div>

            {/* Pharmacy */}

            <div className="p-7 rounded-3xl bg-white shadow-sm">
              <div className="h-12 w-12 justify-center rounded-xl bg-green-100 flex items-center">
                <Store size={23} className="text-green-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Pharmacies
              </h3>

              <p className="mt-3 text-sm text-gray-600 leading-6">
                Manage pharmacy information, medicines, inventory and customer
                orders.
              </p>
            </div>

            {/* Delivery */}

            <div className="p-7 rounded-3xl bg-white shadow-sm">
              <div className="h-12 w-12 justify-center rounded-xl bg-green-100 flex items-center">
                <Truck size={23} className="text-green-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Delivery Partners
              </h3>

              <p className="mt-3 text-sm text-gray-600 leading-6">
                Receive delivery requests and manage medicine deliveries.
              </p>
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
            <div className="mx-auto h-14 w-14 justify-center rounded-2xl bg-white/15 text-white flex items-center">
              <HeartPulse size={29} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Healthcare Connected Through Technology
            </h2>

            <p className="mt-4 text-green-50 leading-7">
              Discover medicines, connect with pharmacies and make your
              healthcare journey more convenient.
            </p>

            <a
              href="/services"
              className="mt-8 gap-2 px-7 py-3.5 rounded-xl bg-white font-bold text-green-700 inline-flex items-center transition hover:bg-green-50"
            >
              Explore MediFind
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
