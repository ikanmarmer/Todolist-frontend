import { useEffect, useState } from "react";
import TaskController from "../../controllers/TaskController";
import PaymentController from "../../controllers/PaymentController";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function TodoList() {
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    video: "",
    image: null,
  });

  const { task, getTask, storeTask, clearMessage, deleteTask } =
    TaskController();

  const handleStoreTask = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: editId ? "Menyimpan perubahan..." : "Menyimpan...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await storeTask(formData, null, editId);
      await getTask();
      setForm({
        title: "",
        description: "",
        deadline: "",
        video: "",
        image: null,
      });
      setEditId(null);
      setModal(false);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: editId
          ? "Perubahan berhasil disimpan"
          : "Todo berhasil ditambahkan",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan task.",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        await getTask();
      } catch (error) {
        console.error("Gagal mengambil task:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [getTask]);

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    clearMessage();
  };

  const openAddModal = () => {
    const isPremium = localStorage.getItem("user_status") === "premium";
    if (!isPremium && task.length >= 1) {
      Swal.fire({
        title: "Upgrade ke Premium",
        text: "Akun gratis hanya bisa menambahkan 1 todo. Upgrade ke premium sekarang?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Lihat Plan",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/plans";
        }
      });

      return;
    }

    setForm({
      title: "",
      description: "",
      deadline: "",
      video: "",
      image: null,
    });
    setEditId(null);
    setModal(true);
  };

  const openEditModal = async (task) => {
    setEditId(true);
    setEditId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      video: task.video || "",
      image: null,
    });
    setModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Menghapus...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteTask(id);
        await getTask();
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Todo berhasil dihapus.",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus.",
        });
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 py-5 px-5 shadow-inner rounded-md"
        data-aos="fade-left">
        <h1 className="font-bold text-2xl text-white">Todo List</h1>
      </div>

      <button
        className="bg-gradient-to-r from-teal-600 to-cyan-700 
              hover:from-teal-700 hover:to-cyan-800 text-white 
              font-bold py-3 px-6 rounded-lg transition-all duration-300 
              transform hover:scale-105 hover:shadow-xl active:scale-95 
              shadow-lg border border-teal-500 hover:border-teal-400"
        onClick={() => openAddModal()}
      >
        Add Todo
      </button>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 backdrop-blur">
          <div
            className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl px-8 py-7 shadow-lg p-6 w-full max-w-md"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            <h2 className="text-xl text-black font-bold mb-4">
              {editId ? "Edit Todo" : "Add Todo"}
            </h2>
            <form onSubmit={handleStoreTask}>
              <div className="mb-3">
                <label className="block text-black mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-black placeholder-teal-100 focus:outline-none 
                focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all 
                duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-black mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-black placeholder-teal-100 focus:outline-none 
                focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all 
                duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="block text-black mb-1">
                  Gambar (opsional)
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                border-teal-300 rounded-lg text-black placeholder-teal-100 focus:outline-none 
                focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all 
                duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                />
              </div>
              <div className="mb-3">
                <label className="block text-black mb-1">
                  Link Video YouTube (opsional)
                </label>
                <input
                  type="url"
                  name="video"
                  value={form.video}
                  onChange={handleChange}
                  className="input validator w-full px-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 
                  border-teal-300 rounded-lg text-black placeholder-teal-100 focus:outline-none 
                    focus:ring-4 focus:ring-cyan-200 focus:border-cyan-200 focus:scale-105 transition-all 
                    duration-300 shadow-inset hover:shadow-lg hover:from-teal-350 hover:to-cyan-350"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-teal-300 rounded-lg text-whit transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg  hover:border-teal-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white 
                    font-medium rounded-lg transition-all duration-300 
                    transform hover:scale-105 hover:shadow-xl active:scale-95 
                    shadow-lg border:border-gray-500 hover:border-gray-400"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 py-5 px-5 shadow-inner rounded-md text-center font-semibold mt-8"
          >
          <span className="loading loading-spinner text-primary text-3xl"></span>
          <p className="text-gray-500 mt-4 text-sm">Loading data...</p>
        </div>
      ) : task.length === 0 ? (
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 py-5 px-5 shadow-inner rounded-md text-center font-semibold mt-4" >
          <p className="text-white text-sm">no todo yet.</p>
        </div>
      ) : (
              <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
        {task.map((task) => (
          <div
            key={task.id}
            className="
              bg-gradient-to-br from-cyan-500 to-teal-600
              p-7 mb-6 py-5 px-5
              shadow-inner rounded-md
              hover:shadow-lg transition-shadow duration-300
              cursor-pointer
            "
            data-aos="fade-up"
          >
            <div className="flex justify-between">
              <Link
                to={`/todo-list-detail/${task.id}`}
                className="text-xl font-semibold mb-1 text-white hover:underline w-full"
              >
                {task.title}
              </Link>

              <div className="flex space-x-3">
                <button
                  className="text-lg font-medium text-white/90 hover:text-white"
                  onClick={() => openEditModal(task)}
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  className="text-lg font-medium text-red-300 hover:text-red-400"
                  onClick={() => handleDelete(task.id)}
                >
                  <i className="fa-regular fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <Link to={`/todo-list-detail/${task.id}`}>
              <p className="text-white/80 text-sm mb-2 line-clamp-2">
                {task.description}
              </p>

              {task.video && extractYouTubeId(task.video) ? (
                <div className="mt-3">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(
                      task.video
                    )}`}
                    className="w-full h-48 rounded"
                    frameBorder="0"
                    allowFullScreen
                    title="Video Preview"
                  />
                </div>
              ) : task.image ? (
                <img
                  src={task.image}
                  alt="Preview"
                  className="mt-3 w-full h-48 object-cover rounded"
                />
              ) : (
                <img
                  src="/public/default-featured-image.png.jpg"
                  alt="Preview"
                  className="mt-3 w-full h-48 object-cover rounded"
                />
              )}
            </Link>
          </div>
        ))}
      </div>

      )}
    </>
  );
}

export default TodoList;