import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  Truck,
  User,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic password validation

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");

      return;
    }

    setLoading(true);

    try {
      await register(form);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ROLE INFORMATION
  // ==========================================

  const roleInfo = {
    CUSTOMER: {
      icon: Users,
      title: "Customer",
      description: "Find medicines, pharmacies and place orders.",
    },

    PHARMACIST: {
      icon: Store,
      title: "Pharmacist",
      description: "Manage your pharmacy and medicine inventory.",
    },

    DELIVERY: {
      icon: Truck,
      title: "Delivery Partner",
      description: "Accept and manage medicine deliveries.",
    },
  };

  const selectedRole = roleInfo[form.role];
  const SelectedRoleIcon = selectedRole.icon;

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden bg-gray-50 relative">
      {/* =====================================
          BACKGROUND DECORATIONS
      ====================================== */}

      <div className="top-10 h-80 w-80 rounded-full bg-green-100/70 absolute -left-32 blur-3xl" />

      <div className="bottom-10 h-80 w-80 rounded-full bg-red-100/50 absolute -right-32 blur-3xl" />

      <div className="grid gap-12 px-4 py-12 mx-auto min-h-[calc(100vh-80px)] max-w-7xl relative items-center sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* =================================
            LEFT SIDE
        ================================== */}

        <div className="hidden lg:block">
          {/* Logo */}

          <div className="gap-3 flex items-center">
            <div className="h-14 w-14 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
              <HeartPulse size={29} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Medi
                <span className="text-green-600">Find</span>
              </h1>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Healthcare • Nearby • Fast
              </p>
            </div>
          </div>

          {/* Heading */}

          <h2 className="mt-10 max-w-xl text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Join the
            <span className="text-green-600 block">MediFind Network.</span>
          </h2>

          <p className="mt-6 max-w-lg text-lg text-gray-600 leading-8">
            Create your account and become part of a connected healthcare
            platform for customers, pharmacies and delivery partners.
          </p>

          {/* Benefits */}

          <div className="mt-10 space-y-5">
            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Easy Registration</p>

                <p className="text-sm text-gray-500">
                  Create your MediFind account in minutes.
                </p>
              </div>
            </div>

            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <ShieldCheck size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Secure Account</p>

                <p className="text-sm text-gray-500">
                  Your account is protected by authentication.
                </p>
              </div>
            </div>

            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <HeartPulse size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Connected Healthcare</p>

                <p className="text-sm text-gray-500">
                  Connect with the MediFind healthcare network.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================
            REGISTER CARD
        ================================== */}

        <div className="mx-auto w-full max-w-lg">
          {/* Mobile Logo */}

          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto h-14 w-14 justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20 flex items-center">
              <HeartPulse size={28} />
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
              Medi
              <span className="text-green-600">Find</span>
            </h1>

            <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Healthcare • Nearby • Fast
            </p>
          </div>

          <div className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/60 sm:p-8">
            {/* =================================
                HEADER
            ================================== */}

            <div className="mb-7">
              <div className="gap-3 flex items-center">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                  <User size={21} className="text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Create Account
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Join MediFind today
                  </p>
                </div>
              </div>
            </div>

            {/* =================================
                ERROR
            ================================== */}

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* =================================
                FORM
            ================================== */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="py-3.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 pl-11 pr-4 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="py-3.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 pl-11 pr-4 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className="py-3.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 pl-11 pr-4 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="py-3.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 pl-11 pr-12 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 h-9 w-9 justify-center rounded-lg text-gray-400 absolute right-3 flex -translate-y-1/2 items-center transition hover:bg-gray-100 hover:text-green-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* =================================
                  ROLE
              ================================== */}

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 text-sm font-semibold text-gray-700 block"
                >
                  Register As
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        role: "CUSTOMER",
                      }))
                    }
                    className={`rounded-xl border p-3 text-left transition ${
                      form.role === "CUSTOMER"
                        ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                        : "border-gray-200 bg-gray-50 hover:border-green-200 hover:bg-white"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        form.role === "CUSTOMER"
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Customer
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        role: "PHARMACIST",
                      }))
                    }
                    className={`rounded-xl border p-3 text-left transition ${
                      form.role === "PHARMACIST"
                        ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                        : "border-gray-200 bg-gray-50 hover:border-green-200 hover:bg-white"
                    }`}
                  >
                    <Store
                      size={20}
                      className={
                        form.role === "PHARMACIST"
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Pharmacist
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        role: "DELIVERY",
                      }))
                    }
                    className={`rounded-xl border p-3 text-left transition ${
                      form.role === "DELIVERY"
                        ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                        : "border-gray-200 bg-gray-50 hover:border-green-200 hover:bg-white"
                    }`}
                  >
                    <Truck
                      size={20}
                      className={
                        form.role === "DELIVERY"
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    />

                    <p className="mt-2 text-xs font-bold text-gray-900">
                      Delivery
                    </p>
                  </button>
                </div>
              </div>

              {/* Selected Role Information */}

              <div className="gap-3 p-3 rounded-xl border border-green-100 bg-green-50 flex items-center">
                <div className="h-10 w-10 justify-center rounded-lg bg-white flex shrink-0 items-center">
                  <SelectedRoleIcon size={19} className="text-green-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedRole.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {selectedRole.description}
                  </p>
                </div>
              </div>

              {/* =================================
                  SUBMIT
              ================================== */}

              <button
                type="submit"
                disabled={loading}
                className="gap-2 px-6 py-3.5 w-full justify-center rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 flex items-center transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Security */}

            <div className="mt-6 gap-2 justify-center text-xs text-gray-500 flex items-center">
              <ShieldCheck size={15} className="text-green-600" />
              Your account information is securely handled
            </div>

            {/* Login */}

            <div className="mt-7 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?
                <Link
                  to="/login"
                  className="font-bold text-green-600 ml-1 hover:text-green-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom */}

          <p className="mt-6 text-center text-xs text-gray-400">
            By creating an account, you agree to MediFind's platform terms and
            policies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
