import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Pill,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      switch (user.role) {
        case "CUSTOMER":
          navigate("/customer/dashboard");
          break;

        case "PHARMACIST":
          navigate("/pharmacist/dashboard");
          break;

        case "DELIVERY":
          navigate("/delivery/dashboard");
          break;

        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

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
            Your Medicine,
            <span className="text-green-600 block">Just a Login Away.</span>
          </h2>

          <p className="mt-6 max-w-lg text-lg text-gray-600 leading-8">
            Sign in to search medicines, discover nearby pharmacies, manage
            orders and track deliveries with MediFind.
          </p>

          {/* Benefits */}

          <div className="mt-10 space-y-5">
            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Find Nearby Medicines</p>

                <p className="text-sm text-gray-500">
                  Discover available medicines around you.
                </p>
              </div>
            </div>

            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Compare Pharmacies</p>

                <p className="text-sm text-gray-500">
                  Compare distance, prices and availability.
                </p>
              </div>
            </div>

            <div className="gap-4 flex items-center">
              <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-gray-900">Track Your Orders</p>

                <p className="text-sm text-gray-500">
                  Follow your order from pharmacy to doorstep.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative card */}

          <div className="mt-10 gap-4 p-5 max-w-md rounded-2xl border border-green-100 bg-white shadow-lg shadow-gray-200/50 flex items-center">
            <div className="h-12 w-12 justify-center rounded-xl bg-green-50 flex items-center">
              <Pill size={24} className="text-green-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Healthcare made simple
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Search • Compare • Order • Track
              </p>
            </div>
          </div>
        </div>

        {/* =================================
            LOGIN CARD
        ================================== */}

        <div className="mx-auto w-full max-w-md">
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
            {/* Header */}

            <div className="mb-7">
              <div className="gap-3 flex items-center">
                <div className="h-11 w-11 justify-center rounded-xl bg-green-100 flex items-center">
                  <LockKeyhole size={21} className="text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Welcome Back
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Sign in to your MediFind account
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="py-3.5 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 pl-11 pr-4 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 justify-between flex items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="top-1/2 text-gray-400 absolute left-4 -translate-y-1/2"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="gap-2 px-6 py-3.5 w-full justify-center rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 flex items-center transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Security */}

            <div className="mt-6 gap-2 justify-center text-xs text-gray-500 flex items-center">
              <ShieldCheck size={15} className="text-green-600" />
              Secure authentication
            </div>

            {/* Register */}

            <div className="mt-7 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?
                <Link
                  to="/register"
                  className="ml-1 font-bold text-green-600 hover:text-green-700"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom */}

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to MediFind's platform terms and policies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
