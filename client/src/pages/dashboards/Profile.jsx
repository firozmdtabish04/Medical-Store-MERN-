import React from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Edit3,
  Lock,
  LogOut,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  const role = user?.role || "CUSTOMER";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* ==============================
          PAGE HEADER
      ============================== */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* ==============================
          PROFILE HERO
      ============================== */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-green-600 to-emerald-500 sm:h-36" />

        {/* Profile Info */}
        <div className="px-5 pb-6 -mt-12 sm:-mt-14 sm:px-8">
          <div className="flex-col gap-5 flex sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-col gap-4 flex items-start sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="h-24 w-24 justify-center rounded-3xl border-4 border-white bg-green-100 text-3xl font-extrabold text-green-600 shadow-md flex items-center sm:h-28 sm:w-28">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user?.email || "No email available"}
                </p>

                <span className="mt-2 gap-1.5 px-3 py-1 rounded-full bg-green-100 text-xs font-bold text-green-700 inline-flex items-center uppercase">
                  <ShieldCheck size={14} />
                  {role}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="gap-2 px-5 py-3 w-full justify-center rounded-xl bg-green-600 text-sm font-bold text-white inline-flex items-center transition hover:bg-green-700 sm:w-auto"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PERSONAL INFORMATION */}
        <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm sm:p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your basic account information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="gap-3 flex items-center">
                <div className="h-10 w-10 justify-center rounded-xl bg-green-100 text-green-600 flex items-center">
                  <User size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">Full Name</p>

                  <p className="mt-1 text-sm font-bold text-gray-900 truncate">
                    {user?.name || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="gap-3 flex items-center">
                <div className="h-10 w-10 justify-center rounded-xl bg-blue-100 text-blue-600 flex items-center">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Email Address
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900 truncate">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="gap-3 flex items-center">
                <div className="h-10 w-10 justify-center rounded-xl bg-purple-100 text-purple-600 flex items-center">
                  <Phone size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Phone Number
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900 truncate">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="gap-3 flex items-center">
                <div className="h-10 w-10 justify-center rounded-xl bg-orange-100 text-orange-600 flex items-center">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Account Role
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT STATUS */}
        <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-gray-900">Account</h2>

          <p className="mt-1 text-sm text-gray-500">
            Account information and actions.
          </p>

          <div className="mt-6 space-y-4">
            {/* Status */}
            <div className="p-4 justify-between rounded-xl bg-green-50 flex items-center">
              <div className="gap-3 flex items-center">
                <CheckCircle2 size={19} className="text-green-600" />

                <span className="text-sm font-semibold text-gray-700">
                  Account Status
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-green-100 text-xs font-bold text-green-700">
                Active
              </span>
            </div>

            {/* Member */}
            <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
              <CalendarDays size={19} className="text-gray-500" />

              <div>
                <p className="text-xs text-gray-400">Account Type</p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  MediFind {role}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==============================
          SECURITY
      ============================== */}
      <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Security</h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account security.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="gap-4 p-4 rounded-xl border border-gray-200 text-left flex items-center transition hover:border-green-200 hover:bg-green-50"
          >
            <div className="h-10 w-10 justify-center rounded-xl bg-gray-100 text-gray-600 flex shrink-0 items-center">
              <Lock size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">Change Password</p>

              <p className="mt-1 text-xs text-gray-500">
                Update your account password.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={logout}
            className="gap-4 p-4 rounded-xl border border-red-100 text-left flex items-center transition hover:bg-red-50"
          >
            <div className="h-10 w-10 justify-center rounded-xl bg-red-100 text-red-500 flex shrink-0 items-center">
              <LogOut size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-red-600">Logout</p>

              <p className="mt-1 text-xs text-gray-500">
                Sign out of your MediFind account.
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
