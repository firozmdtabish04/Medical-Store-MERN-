import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ==============================
  // USER
  // ==============================

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ==============================
  // TOKEN
  // ==============================

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  // ==============================
  // REGISTER
  // ==============================

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
  };

  // ==============================
  // LOGIN
  // ==============================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

  // ==============================
  // GET PROFILE
  // ==============================

  const getProfile = async () => {
    const response = await api.get("/auth/profile");

    const profile = response.data.user;

    localStorage.setItem("user", JSON.stringify(profile));

    setUser(profile);

    return profile;
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ==============================
  // RESTORE PROFILE
  // ==============================

  useEffect(() => {
    const loadProfile = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        return;
      }

      try {
        await getProfile();
      } catch (error) {
        console.error("Failed to load profile:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }
    };

    loadProfile();
  }, []);

  // ==============================
  // PROVIDER
  // ==============================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        register,
        login,
        getProfile,
        logout,

        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==============================
// USE AUTH HOOK
// ==============================

export function useAuth() {
  return useContext(AuthContext);
}
