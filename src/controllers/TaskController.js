import axios from "axios";
import { create } from "zustand";

const api = import.meta.env.VITE_API_URL;

const TaskController = create((set) => ({
  task: [],
  error: null,
  user: null,
  success: null,  

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

  getTask: async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${api}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ task: res.data, error: null });
    } catch (err) {
      const message = err.response?.data?.message || "Gagal mengambil data todo";
      set({ error: message, task: [] });
    }
  },

  storeTask: async (formData, navigate, id = null) => {
  try {
    const token = localStorage.getItem("token");
    // Sesuaikan URL dengan route-list: POST /tasks  untuk create, PUT /tasks/{id} untuk update
    const url = id
     ? `${api}/tasks/${id}`   // update
     : `${api}/tasks`;
   // jika update, kita tetap pakai POST + override _method
   const method = id ? "post" : "post";

    formData.append("deadline", formData.get("deadline") || "");


    // Kalau tetap ingin pakai POST + _method=PUT, boleh; 
    // tapi di sini kita langsung pakai PUT supaya lebih idiomatik
    if (id) {
      formData.append("_method","PUT");  // tidak perlu kalau pakai axios.put
    }

    const res = await axios[method](url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    set({
      success: res.data.message,
      error: null,
    });
    navigate && navigate("/todo-list");
  } catch (err) {
    console.error("Validation failed:", err.response?.data?.errors);
    const message =
      err.response?.data?.message ||
      "Failed to save task. Please try again";
    set({ error: message, success: null });
  }
  },
  // storeTask: async (formData, navigate, id = null) => {
  // try {
  //   const token = localStorage.getItem("token");
  //   // Sesuaikan URL dengan route-list: POST /tasks  untuk create, PUT /tasks/{id} untuk update
  //   const url = id
  //     ? `${api}/tasks/${id}`   // update
  //     : `${api}/tasks`;        // create
  //   const method = id ? "put" : "post";

  //   // Kalau tetap ingin pakai POST + _method=PUT, boleh; 
  //   // tapi di sini kita langsung pakai PUT supaya lebih idiomatik
  //   if (id) {
  //     // hapus baris formData.append("_method","PUT");  // tidak perlu kalau pakai axios.put
  //   }

  //   const res = await axios[method](url, formData, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   set({
  //     success: res.data.message,
  //     error: null,
  //   });
  //   navigate && navigate("/todo-list");
  // } catch (err) {
  //   const message =
  //     err.response?.data?.message ||
  //     "Failed to save task. Please try again";
  //   set({ error: message, success: null });
  // }
  // },


  deleteTask: async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(`${api}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        task: state.task.filter((task) => task.id !== id),
        success: res.data.message,
        error: null,
      }));
    } catch (err) {
      const message = err.response?.data?.message || "Gagal menghapus task";
      set({ error: message });
    }
  },

  clearMessage: () => set({ error: null, success: null }),
      }
    )
);

export default TaskController;