import React, { useState } from "react";
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
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Profile() {
  const { user, logout, getProfile } = useAuth();
  const role = user?.role || "CUSTOMER";

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setEditLoading(true);

    try {
      await api.put("/auth/profile", { name: editName, phone: editPhone });
      await getProfile();
      setEditSuccess("Profile updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess("");
      }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information, contact credentials and security.
        </p>
      </div>

      {/* PROFILE HERO */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-green-600 to-emerald-500 sm:h-36" />
        <div className="px-5 pb-6 -mt-12 sm:-mt-14 sm:px-8">
          <div className="flex-col gap-5 flex sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-col gap-4 flex items-start sm:flex-row sm:items-end">
              <div className="h-24 w-24 justify-center rounded-3xl border-4 border-white bg-green-100 text-3xl font-extrabold text-green-600 shadow-md flex items-center sm:h-28 sm:w-28">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {user?.name || "User"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {user?.email || "No email"}
                </p>
                <span className="mt-2 gap-1.5 px-3 py-1 rounded-full bg-green-100 text-xs font-bold text-green-700 inline-flex items-center uppercase">
                  <ShieldCheck size={14} />
                  {role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditName(user?.name || "");
                setEditPhone(user?.phone || "");
                setShowEditModal(true);
              }}
              className="gap-2 px-5 py-3 w-full justify-center rounded-xl bg-green-600 text-sm font-bold text-white inline-flex items-center transition hover:bg-green-700 sm:w-auto"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PERSONAL INFORMATION */}
        <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm sm:p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your registered platform account details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <p className="mt-1 text-sm text-gray-500">Status and membership.</p>

          <div className="mt-6 space-y-4">
            <div className="p-4 justify-between rounded-xl bg-green-50 flex items-center">
              <div className="gap-3 flex items-center">
                <CheckCircle2 size={19} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Status
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-xs font-bold text-green-700">
                Active & Verified
              </span>
            </div>

            <div className="gap-3 p-4 rounded-xl bg-gray-50 flex items-center">
              <CalendarDays size={19} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-400">Platform Portal</p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  MediFind {role}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECURITY */}
      <section className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Security</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account security and sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setShowPasswordModal(true);
            }}
            className="gap-4 p-4 rounded-xl border border-gray-200 text-left flex items-center transition hover:border-green-200 hover:bg-green-50"
          >
            <div className="h-10 w-10 justify-center rounded-xl bg-gray-100 text-gray-600 flex shrink-0 items-center">
              <Lock size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Change Password</p>
              <p className="mt-1 text-xs text-gray-500">
                Update your account password securely.
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

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {editError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={16} />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
                <CheckCircle2 size={16} />
                <span>{editSuccess}</span>
              </div>
            )}

            <form onSubmit={handleEditProfile} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-green-600 px-5 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {passwordError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-xl bg-green-600 px-5 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
