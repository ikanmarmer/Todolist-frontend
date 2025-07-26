import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Setting() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi konfirmasi password
    if (form.new_password !== form.confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Konfirmasi password tidak cocok"
      });
      return;
    }

    // Tampilkan loading
    Swal.fire({
      title: "Mengubah Password...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/change-password`,
        {
          current_password: form.current_password,
          new_password: form.new_password,
          new_password_confirmation: form.confirm_password, // Sesuai dengan validasi Laravel
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diperbarui"
      });
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan, coba lagi nanti";
      
      // Tangani error spesifik dari backend
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMessage
      });
    }
  };
  return (
    <>
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 py-5 px-5 shadow-inner rounded-md">
        <h1 className="font-bold text-2xl text-white">Ganti Password</h1>
      </div>

      <div className="grid xl:grid-cols-3 grid-cols-1">
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 py-5 px-5 shadow-inner rounded-md" data-aos="fade-up">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-white mb-1">Password Saat Ini</label>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                className="input validator w-full px-3 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-white mb-1">Password Baru</label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                className="input validator w-full px-3 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-white mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                className="input validator w-full px-3 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                required
              />
            </div>

            <div className="mb-3 flex space-x-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 
              hover:from-teal-700 hover:to-cyan-800 text-white 
              font-bold py-3 px-6 rounded-lg transition-all duration-300 
              transform hover:scale-105 hover:shadow-xl active:scale-95 
              shadow-lg border border-teal-500 hover:border-teal-400"
              >
                Ganti Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Setting;