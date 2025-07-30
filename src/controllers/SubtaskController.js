import axios from "axios";
import { create } from "zustand";

const api = import.meta.env.VITE_API_URL;

const SubtaskController = create((set) => ({
  subtasks: [],
  error: null,
  success: null,

  

  getSubtasks: async (task) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get(
        `${api}/tasks/${task}/subtasks`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      set({
        subtasks: res.data,
        error: null,
      });

      return res.data; 
    } catch (err) {
      console.error("Get subtasks error:", err.response?.data || err.message);
      
      let message;
      if (err.response?.status === 404) {
        message = "Task tidak ditemukan atau tidak memiliki akses";
      } else {
        message = err.response?.data?.message || 
                  err.response?.data?.error || 
                  "Gagal memuat subtask";
      }
      
      set({ error: message });
      throw new Error(message);
  }
  },

  createSubtask: async (task, data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.post(
        `${api}/tasks/${task}/subtasks`,
        {
          title: data.title,
          description: data.description || ""
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      set((state) => ({
        subtasks: [...state.subtasks, res.data],
        success: "Subtask berhasil ditambahkan",
        error: null,
      }));

      return res.data;
    } catch (err) {
      console.error("Create subtask error:", err.response?.data || err.message);
      const message = err.response?.data?.message || 
                     err.response?.data?.error || 
                     "Gagal menambahkan subtask";
      set({ error: message });
      throw new Error(message);
    }
  },

  updateSubtask: async (id, data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.post(
        `${api}/subtasks/${id}`, 
        {
          title: data.title,
          description: data.description || ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      set((state) => ({
        subtasks: state.subtasks.map((item) =>
          item.id === parseInt(id) ? res.data : item
        ),
        success: "Subtask berhasil diupdate",
        error: null,
      }));

      return res.data;
    } catch (err) {
      console.error("Update subtask error:", err.response?.data || err.message);
      const message = err.response?.data?.message || 
                     err.response?.data?.error || 
                     "Gagal mengupdate subtask";
      set({ error: message });
      throw new Error(message);
    }
  },

  deleteSubtask: async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.delete(`${api}/subtasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      set((state) => ({
        subtasks: state.subtasks.filter((item) => item.id !== parseInt(id)),
        success: res.data.message || "Subtask berhasil dihapus",
        error: null,
      }));

      return res.data;
    } catch (err) {
      console.error("Delete subtask error:", err.response?.data || err.message);
      const message = err.response?.data?.message || 
                     err.response?.data?.error || 
                     "Gagal menghapus subtask";
      set({ error: message });
      throw new Error(message);
    }
  },

  changeStatus: async (subtaskId, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const res = await axios.post(
      `${api}/subtasks/change-status`,
      { subtask_id: subtaskId, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    set((state) => ({
      subtasks: state.subtasks.map((item) =>
        item.id === parseInt(subtaskId) ? { ...item, status: status } : item
      ),
      success: "Status berhasil diubah",
      error: null,
    }));

    return res.data;
  } catch (err) {
    console.error("Change status error:", err.response?.data || err.message);
    
    let message;
    if (err.response?.status === 404) {
      message = "Subtask tidak ditemukan";
    } else if (err.response?.status === 403) {
      message = "Anda tidak memiliki akses ke subtask ini";
    } else {
      message = err.response?.data?.error || 
               "Gagal mengubah status subtask";
    }
    
    set({ error: message });
    throw new Error(message);
  }
},
}));

export default SubtaskController;