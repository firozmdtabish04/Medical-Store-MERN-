import React from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock3,
  Pill,
  Store,
  Truck,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  LocateFixed,
  Star,
} from "lucide-react";

function Home() {
  // ==========================================
  // FIND USER LOCATION
  // ==========================================

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        alert(
          `Location detected!\n\nLatitude: ${latitude}\nLongitude: ${longitude}`,
        );

        // Later:
        // Call your backend API
        //
        // GET
        // /api/pharmacies/search-medicine
        //
        // with:
        // latitude
        // longitude
        // q
      },
      () => {
        alert("Please allow location access to find nearby pharmacies.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ==========================================
  // SEARCH MEDICINE
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const medicine = e.target.medicine.value.trim();

    if (!medicine) {
      alert("Please enter a medicine name.");
      return;
    }

    console.log("Searching medicine:", medicine);

    // Later navigate to:
    // /medicines?search=paracetamol
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="relative">
        {/* Background */}

        <div className="absolute inset-0 -z-10">
          <div className="top-0 h-96 w-96 rounded-full bg-green-100/60 absolute left-0 blur-3xl" />

          <div className="top-20 h-96 w-96 rounded-full bg-red-100/40 absolute right-0 blur-3xl" />
        </div>

        <div className="grid gap-12 px-4 pb-20 pt-16 mx-auto max-w-7xl items-center sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
          {/* =================================
              LEFT CONTENT
          ================================= */}

          <div>
            {/* Badge */}

            <div className="mb-6 gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-sm font-semibold text-green-700 inline-flex items-center">
              <HeartPulse size={16} />
              Your Health, Our Priority
            </div>

            {/* Heading */}

            <h1 className="max-w-3xl text-4xl font-extrabold text-gray-900 leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Medicine
              <span className="text-green-600 block">Near You.</span>
            </h1>

            {/* Description */}

            <p className="mt-6 max-w-xl text-base text-gray-600 leading-7 sm:text-lg">
              Search medicines, discover nearby pharmacies, compare prices and
              availability, and get your medicines delivered to your doorstep.
            </p>

            {/* =================================
                SEARCH BOX
            ================================= */}

            <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
              <div className="flex-col gap-3 p-2 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 flex sm:flex-row">
                {/* Search */}

                <div className="flex-1 gap-3 px-3 flex items-center">
                  <Search size={22} className="text-green-600 shrink-0" />

                  <input
                    type="text"
                    name="medicine"
                    placeholder="Search medicine e.g. Paracetamol"
                    className="py-3 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
                  />
                </div>

                {/* Search Button */}

                <button
                  type="submit"
                  className="gap-2 px-6 py-3 justify-center rounded-xl bg-green-600 font-bold text-white flex items-center transition hover:bg-green-700"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </form>

            {/* =================================
                LOCATION BUTTON
            ================================= */}

            <div className="flex-wrap mt-4 gap-3 flex">
              <button
                type="button"
                onClick={handleFindNearby}
                className="gap-2 px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-sm font-semibold text-green-700 flex items-center transition hover:bg-green-100"
              >
                <LocateFixed size={18} />
                Find pharmacies near me
              </button>

              <div className="gap-2 px-2 text-sm text-gray-500 flex items-center">
                <MapPin size={16} className="text-red-500" />
                Search within 30 km
              </div>
            </div>

            {/* =================================
                TRUST POINTS
            ================================= */}

            <div className="flex-wrap mt-8 gap-x-6 gap-y-3 flex">
              <div className="gap-2 text-sm text-gray-600 flex items-center">
                <CheckCircle2 size={17} className="text-green-600" />
                Verified pharmacies
              </div>

              <div className="gap-2 text-sm text-gray-600 flex items-center">
                <CheckCircle2 size={17} className="text-green-600" />
                Real-time availability
              </div>

              <div className="gap-2 text-sm text-gray-600 flex items-center">
                <CheckCircle2 size={17} className="text-green-600" />
                Secure ordering
              </div>
            </div>
          </div>

          {/* =================================
              RIGHT HERO CARD
          ================================= */}

          <div className="relative hidden lg:block">
            {/* Decorative circles */}

            <div className="h-40 w-40 rounded-full border-[30px] border-green-100 absolute -right-10 -top-10" />

            <div className="h-32 w-32 rounded-full border-[20px] border-red-100 absolute -bottom-10 -left-10" />

            {/* Main Card */}

            <div className="mx-auto max-w-md relative">
              <div className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-2xl shadow-green-900/10">
                {/* Header */}

                <div className="justify-between flex items-center">
                  <div className="gap-3 flex items-center">
                    <div className="h-12 w-12 justify-center rounded-2xl bg-green-100 flex items-center">
                      <Pill size={25} className="text-green-600" />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        Medicine Available
                      </p>

                      <p className="text-xs text-gray-500">Nearby pharmacies</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-xs font-bold text-green-700">
                    LIVE
                  </span>
                </div>

                {/* Medicine */}

                <div className="mt-6 p-4 rounded-2xl bg-gray-50">
                  <div className="justify-between flex items-center">
                    <div>
                      <p className="font-bold text-gray-900">
                        Paracetamol 500mg
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        3 pharmacies nearby
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-green-600 text-white">
                      <Pill size={20} />
                    </div>
                  </div>
                </div>

                {/* Pharmacy 1 */}

                <div className="mt-4 p-4 justify-between rounded-xl border border-gray-100 flex items-center">
                  <div className="gap-3 flex items-center">
                    <div className="h-10 w-10 justify-center rounded-xl bg-green-50 flex items-center">
                      <Store size={18} className="text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        City Care Pharmacy
                      </p>

                      <p className="text-xs text-gray-500">1.2 km away</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-green-600">₹25</p>

                    <p className="text-[10px] text-green-600">In Stock</p>
                  </div>
                </div>

                {/* Pharmacy 2 */}

                <div className="mt-3 p-4 justify-between rounded-xl border border-gray-100 flex items-center">
                  <div className="gap-3 flex items-center">
                    <div className="h-10 w-10 justify-center rounded-xl bg-red-50 flex items-center">
                      <Store size={18} className="text-red-500" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        MediPlus
                      </p>

                      <p className="text-xs text-gray-500">2.4 km away</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-green-600">₹22</p>

                    <p className="text-[10px] text-green-600">In Stock</p>
                  </div>
                </div>

                {/* CTA */}

                <button className="mt-5 gap-2 py-3 w-full justify-center rounded-xl bg-green-600 text-sm font-bold text-white flex items-center transition hover:bg-green-700">
                  View nearby pharmacies
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          STATS
      ====================================== */}

      <section className="border-y border-gray-100 bg-gray-50">
        <div className="grid grid-cols-2 gap-6 px-4 py-10 mx-auto max-w-7xl sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">500+</p>

            <p className="mt-1 text-sm text-gray-500">Registered Pharmacies</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">10K+</p>

            <p className="mt-1 text-sm text-gray-500">Medicines Listed</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">24/7</p>

            <p className="mt-1 text-sm text-gray-500">Availability Search</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">30 km</p>

            <p className="mt-1 text-sm text-gray-500">Search Radius</p>
          </div>
        </div>
      </section>

      {/* =====================================
          SERVICES
      ====================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
            Our Services
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything You Need
            <span className="text-green-600"> for Your Medicine</span>
          </h2>

          <p className="mt-4 text-gray-600">
            MediFind makes finding and ordering medicines easier, faster, and
            more convenient.
          </p>
        </div>

        {/* Cards */}

        <div className="grid mt-12 gap-6 md:grid-cols-3">
          {/* Search */}

          <div className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm group transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="h-14 w-14 justify-center rounded-2xl bg-green-100 flex items-center transition group-hover:bg-green-600">
              <Search
                size={27}
                className="text-green-600 group-hover:text-white"
              />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Search Medicines
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
              Search for medicines and instantly see which nearby pharmacies
              have them in stock.
            </p>

            <button className="mt-5 gap-2 text-sm font-bold text-green-600 flex items-center">
              Search medicine
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Pharmacy */}

          <div className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm group transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="h-14 w-14 justify-center rounded-2xl bg-green-100 flex items-center transition group-hover:bg-green-600">
              <Store
                size={27}
                className="text-green-600 group-hover:text-white"
              />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Compare Pharmacies
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
              Compare distance, price, discount, availability, and pharmacy
              status.
            </p>

            <button className="mt-5 gap-2 text-sm font-bold text-green-600 flex items-center">
              Find pharmacy
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Delivery */}

          <div className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm group transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="h-14 w-14 justify-center rounded-2xl bg-green-100 flex items-center transition group-hover:bg-green-600">
              <Truck
                size={27}
                className="text-green-600 group-hover:text-white"
              />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Fast Delivery
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
              Order your medicine and track your delivery from pharmacy to
              doorstep.
            </p>

            <button className="mt-5 gap-2 text-sm font-bold text-green-600 flex items-center">
              Order medicine
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================
          HOW IT WORKS
      ====================================== */}

      <section className="bg-green-50/60">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How MediFind Works
            </h2>
          </div>

          <div className="grid mt-12 gap-8 md:grid-cols-4">
            {/* Step 1 */}

            <div className="text-center relative">
              <div className="mx-auto h-16 w-16 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
                <Search size={27} />
              </div>

              <div className="mt-5 text-lg font-bold text-gray-900">Search</div>

              <p className="mt-2 text-sm text-gray-600 leading-6">
                Search for the medicine you need.
              </p>
            </div>

            {/* Step 2 */}

            <div className="text-center relative">
              <div className="mx-auto h-16 w-16 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
                <MapPin size={27} />
              </div>

              <div className="mt-5 text-lg font-bold text-gray-900">
                Compare
              </div>

              <p className="mt-2 text-sm text-gray-600 leading-6">
                Find nearby pharmacies and compare prices.
              </p>
            </div>

            {/* Step 3 */}

            <div className="text-center relative">
              <div className="mx-auto h-16 w-16 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
                <Store size={27} />
              </div>

              <div className="mt-5 text-lg font-bold text-gray-900">Order</div>

              <p className="mt-2 text-sm text-gray-600 leading-6">
                Select a pharmacy and place your order.
              </p>
            </div>

            {/* Step 4 */}

            <div className="text-center relative">
              <div className="mx-auto h-16 w-16 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
                <Truck size={27} />
              </div>

              <div className="mt-5 text-lg font-bold text-gray-900">
                Receive
              </div>

              <p className="mt-2 text-sm text-gray-600 leading-6">
                Track your delivery to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          WHY MEDIFIND
      ====================================== */}

      <section className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-12 items-center lg:grid-cols-2">
          {/* Left */}

          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
              Why MediFind?
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 leading-tight sm:text-4xl">
              Healthcare Made
              <span className="text-green-600"> Simple</span>
            </h2>

            <p className="mt-5 text-gray-600 leading-7">
              Stop visiting multiple pharmacies to find your medicine. MediFind
              connects you with nearby registered pharmacies in one place.
            </p>

            <div className="mt-8 space-y-5">
              {/* Feature */}

              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <ShieldCheck size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Verified Pharmacies
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Find medicines from registered pharmacies.
                  </p>
                </div>
              </div>

              {/* Feature */}

              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <Clock3 size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Real-Time Availability
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Check current medicine stock before ordering.
                  </p>
                </div>
              </div>

              {/* Feature */}

              <div className="gap-4 flex">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex shrink-0 items-center">
                  <Truck size={21} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Doorstep Delivery</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Track your medicine delivery in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="relative">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br text-white shadow-2xl shadow-green-900/20 from-green-600 to-green-800">
              <div className="h-16 w-16 justify-center rounded-2xl bg-white/15 flex items-center">
                <HeartPulse size={32} />
              </div>

              <h3 className="mt-8 text-3xl font-extrabold">
                Your Medicine,
                <br />
                Just a Search Away.
              </h3>

              <p className="mt-5 max-w-md text-green-50 leading-7">
                Discover nearby pharmacies, compare prices and availability, and
                get your medicines when you need them.
              </p>

              <div className="mt-8 gap-2 flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={17} className="fill-current" />
                  ))}
                </div>

                <span className="text-sm">Trusted healthcare platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          FINAL CTA
      ====================================== */}

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="px-6 py-14 mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gray-900 text-center sm:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto h-14 w-14 justify-center rounded-2xl bg-green-600 text-white flex items-center">
              <Pill size={26} />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
              Need Medicine?
            </h2>

            <p className="mt-4 text-gray-400 leading-7">
              Search now and discover pharmacies near you with the medicine you
              need.
            </p>

            <button
              type="button"
              onClick={handleFindNearby}
              className="mt-8 gap-2 px-7 py-3.5 rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 inline-flex items-center transition hover:bg-green-700"
            >
              <MapPin size={18} />
              Find Nearby Pharmacies
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
