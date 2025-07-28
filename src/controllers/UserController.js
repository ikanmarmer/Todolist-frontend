// src/controllers/UserController.js
import axios from "axios";
import { create } from "zustand";

const api = import.meta.env.VITE_API_URL;

const UserController = create((set) => ({
  user: null,
  error: null,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data, error: null });
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || "Gagal mengambil data user",
      });
    }
  },
}));

export default UserController;
