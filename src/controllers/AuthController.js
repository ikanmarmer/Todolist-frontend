import axios from "axios";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_API_URL;
const savedToken = localStorage.getItem("token");
const savedUserRaw = localStorage.getItem("user");
const savedUser =
  savedUserRaw && savedUserRaw !== "undefined"
    ? JSON.parse(savedUserRaw)
    : null;

const AuthController = create((set, get) => ({
  user: savedUser,
  token: savedToken || null,
  error: null,

  setUser: (user) => {
    // Store user in localStorage when setting
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", get().token);
    set(() => ({ user }));
  },

  refreshUserStatus: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_status", user.status || 'free');
      set({ user });
    } catch (err) {
      console.error("Gagal memperbarui status user", err);
      // If token is invalid, clear auth state
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  login: async (email, password, navigate) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, { email, password });
      const { token, user } = res.data;
      
      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("user_status", user.status || 'free');
      
      set({ 
        token, 
        user,
        error: null 
      });
      
      navigate("/dashboard");
    } catch (err) {
      set({ error: err.response?.data?.message || "Terjadi kesalahan" });
      throw err;
    }
  },

  logout: async () => {
    try {
      const token = get().token;
      if (token) {
        await axios.post(`${baseUrl}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      // Always clear local state regardless of API call result
      set({ user: null, token: null, error: null });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_status");
    }
  },

  register: async (data, navigate) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/register`, data);
      const user = res.data.user;
      set({ user, error: null });
      navigate("/login");
    } catch (err) {
      console.error("🚨 REGISTER ERROR:", err.response);
      const errorMsg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.message ||
        "Terjadi kesalahan saat register";
      set({ error: errorMsg });
      throw err;
    }
  },

  // Method to update user after profile changes
  updateUser: (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    
    if (token && userRaw && userRaw !== "undefined") {
      try {
        const user = JSON.parse(userRaw);
        set({ token, user, error: null });
      } catch (err) {
        console.error("Failed to parse stored user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_status");
      }
    }
  },
}));

export default AuthController;