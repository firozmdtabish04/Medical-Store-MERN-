import React, { Suspense, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Menu,
  X,
  HeartPulse,
  ShieldCheck,
  LogIn,
  UserPlus,
  MapPin,
  Home,
  Stethoscope,
  Info,
  Phone,
} from "lucide-react";

import { Canvas } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";

import { FaWhatsapp } from "react-icons/fa";

// ==========================================
// THREE.JS MEDICAL BACKGROUND
// ==========================================

function MedicalParticles() {
  return (
    <>
      {/* Green Sphere */}

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <Sphere args={[0.7, 24, 24]} position={[4, 0, -2]}>
          <meshStandardMaterial
            color="#16a34a"
            transparent
            opacity={0.12}
            wireframe
          />
        </Sphere>
      </Float>

      {/* Red Sphere */}

      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.4, 20, 20]} position={[-4, 0.5, -1]}>
          <meshStandardMaterial
            color="#dc2626"
            transparent
            opacity={0.1}
            wireframe
          />
        </Sphere>
      </Float>
    </>
  );
}

// ==========================================
// NAVBAR
// ==========================================

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ========================================
  // NAVIGATION ITEMS
  // ========================================

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Services",
      path: "/services",
      icon: <Stethoscope size={20} />,
    },
    {
      name: "About",
      path: "/about",
      icon: <Info size={20} />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <Phone size={20} />,
    },
  ];

  // ========================================
  // FIND NEARBY PHARMACIES
  // ========================================

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("User Location:", {
          latitude,
          longitude,
        });

        alert(
          `Location detected!\n\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nSearching pharmacies within 30 km...`,
        );

        /*
          Later connect this with your backend:

          GET
          /api/pharmacies/search-medicine

          Parameters:

          latitude
          longitude
          q

          Your backend already uses MongoDB
          geospatial searching.
        */
      },

      (error) => {
        console.error("Location error:", error);

        alert("Please allow location access to find nearby pharmacies.");
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ========================================
  // WHATSAPP
  // ========================================

  const phoneNumber = "919876543210";

  const whatsappMessage = encodeURIComponent(
    "Hello MediFind 👋\n\n" +
      "I want to order medicine.\n" +
      "Please help me find the nearest pharmacy and available medicines.\n\n" +
      "Thank you!",
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  // ========================================
  // CLOSE MOBILE MENU
  // ========================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <header className="top-0 z-50 sticky">
      {/* =====================================
          TOP INFORMATION BAR
      ====================================== */}

      <div className="bg-green-700 text-white">
        <div className="px-4 py-2 mx-auto max-w-7xl justify-between text-xs flex items-center sm:px-6 lg:px-8">
          {/* Trusted Platform */}

          <div className="gap-2 flex items-center">
            <ShieldCheck size={14} />

            <span>Trusted medicine availability platform</span>
          </div>

          {/* Location + WhatsApp */}

          <div className="gap-5 hidden items-center sm:flex">
            {/* Location */}

            <button
              type="button"
              onClick={handleFindNearby}
              className="gap-2 group flex items-center transition hover:text-green-100"
              title="Find pharmacies within 30 km"
            >
              <MapPin size={15} className="transition group-hover:scale-110" />

              <span>Find pharmacies within 30 km</span>
            </button>

            {/* WhatsApp */}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2 group flex items-center transition hover:text-green-100"
              title="Order medicine on WhatsApp"
            >
              <FaWhatsapp
                size={18}
                className="transition group-hover:scale-110"
              />

              <span>Order medicine on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================
          MAIN NAVBAR
      ====================================== */}

      <nav className="overflow-hidden border-b border-gray-200/80 bg-white/95 shadow-sm relative backdrop-blur-xl">
        {/* Three.js Background */}

        <div className="opacity-70 pointer-events-none absolute inset-0">
          <Canvas
            camera={{
              position: [0, 0, 7],
              fov: 50,
            }}
          >
            <ambientLight intensity={0.8} />

            <pointLight position={[5, 5, 5]} intensity={2} />

            <Suspense fallback={null}>
              <MedicalParticles />
            </Suspense>
          </Canvas>
        </div>

        {/* Green → White → Red Accent */}

        <div className="top-0 h-1 w-full bg-gradient-to-r absolute left-0 from-green-600 via-white to-red-600" />

        {/* Navbar Container */}

        <div className="px-4 mx-auto h-20 max-w-7xl justify-between relative flex items-center sm:px-6 lg:px-8">
          {/* =================================
              LOGO
          ================================= */}

          <Link to="/" className="gap-3 group flex items-center">
            {/* Logo Icon */}

            <div className="h-11 w-11 justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/25 relative flex items-center transition duration-300 group-hover:scale-105">
              <HeartPulse size={25} strokeWidth={2.5} className="text-white" />

              {/* Red Plus */}

              <span className="h-4 w-4 justify-center rounded-full bg-red-600 text-[8px] font-bold text-white shadow absolute -right-1 -top-1 flex items-center">
                +
              </span>
            </div>

            {/* Logo Text */}

            <div className="leading-none">
              <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                Medi
                <span className="text-green-600">Find</span>
              </div>

              <p className="mt-1 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
                Healthcare • Nearby • Fast
              </p>
            </div>
          </Link>

          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}

          <div className="gap-1 hidden items-center lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* =================================
              DESKTOP ACTIONS
          ================================= */}

          <div className="gap-2 hidden items-center lg:flex">
            {/* Login */}

            <Link
              to="/login"
              className="gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 group flex items-center transition hover:bg-gray-50 hover:text-green-700"
            >
              <LogIn
                size={17}
                className="transition group-hover:-translate-x-0.5"
              />
              Login
            </Link>

            {/* Register */}

            <Link
              to="/register"
              className="gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-600/20 group flex items-center transition duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-600/30"
            >
              <UserPlus size={17} />
              Register
              <span className="text-red-300 transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* =================================
              MOBILE MENU BUTTON
          ================================= */}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-11 w-11 justify-center rounded-xl border border-gray-200 text-gray-700 flex items-center transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* =====================================
            MOBILE MENU
        ====================================== */}

        {mobileOpen && (
          <div className="px-4 pb-5 pt-4 border-t border-gray-100 bg-white/95 shadow-xl relative backdrop-blur-xl lg:hidden">
            {/* =================================
                MOBILE NAVIGATION ICONS
            ================================= */}

            <div className="pb-4 justify-around border-b border-gray-100 flex items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  title={item.name}
                  aria-label={item.name}
                  className={({ isActive }) =>
                    `flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? "bg-green-100 text-green-700 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-green-700"
                    }`
                  }
                >
                  {item.icon}
                </NavLink>
              ))}
            </div>

            {/* =================================
                LOCATION + WHATSAPP ICONS
            ================================= */}

            <div className="mt-4 gap-4 justify-center flex items-center">
              {/* Location */}

              <button
                type="button"
                onClick={handleFindNearby}
                title="Find pharmacies within 30 km"
                aria-label="Find pharmacies within 30 km"
                className="h-12 w-12 justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 shadow-sm flex items-center transition hover:bg-green-100"
              >
                <MapPin size={20} />
              </button>

              {/* WhatsApp */}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Order medicine on WhatsApp"
                aria-label="Order medicine on WhatsApp"
                className="h-12 w-12 justify-center rounded-xl border border-green-200 bg-green-50 text-green-700 shadow-sm flex items-center transition hover:bg-green-100"
              >
                <FaWhatsapp size={21} />
              </a>
            </div>

            {/* =================================
                LOGIN + REGISTER ICONS
            ================================= */}

            <div className="mt-4 gap-4 justify-center flex items-center">
              {/* Login */}

              <Link
                to="/login"
                onClick={closeMobileMenu}
                title="Login"
                aria-label="Login"
                className="h-12 w-12 justify-center rounded-xl border border-gray-200 text-gray-700 shadow-sm flex items-center transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
              >
                <LogIn size={20} />
              </Link>

              {/* Register */}

              <Link
                to="/register"
                onClick={closeMobileMenu}
                title="Register"
                aria-label="Register"
                className="h-12 w-12 justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center transition hover:bg-green-700"
              >
                <UserPlus size={20} />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
