import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SubtaskController from "../../controllers/SubtaskController";

function TodoListDetail() {
  const { id: taskId } = useParams();
  const navigate = useNavigate();
  const {
    getSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    changeStatus,
  } = SubtaskController();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubtask, setCurrentSubtask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });

  const columns = [
    { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In Progress" },
    { key: "completed", title: "Done" },
  ];

  const fetchSubtasks = async () => {
    Swal.fire({
      title: "Memuat subtasks...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = await getSubtasks(taskId); 
      const grouped = { pending: [], in_progress: [], completed: [] };
      
      data.forEach((item) => {
        if (grouped[item.status]) {
          grouped[item.status].push({ 
            id: String(item.id), 
            text: item.title,
            description: item.description || "",
            status: item.status
          });
        }
      });
      
      setTasks(grouped);
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      
      // Perbaikan: Gunakan navigate yang sudah didefinisikan
      if (error.message.includes('tidak ditemukan')) {
        Swal.fire({
          icon: "error",
          title: "Task Tidak Ditemukan",
          text: "Task yang Anda coba akses tidak ditemukan",
        }).then(() => {
          navigate('/todo-list'); // Redirect ke halaman tasks
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal memuat data",
          text: "Terjadi kesalahan saat mengambil subtasks.",
        });
      }
    } finally {
      Swal.close();
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId]);

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ title: "", description: "" });
    setCurrentSubtask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subtask) => {
    setIsEditing(true);
    setCurrentSubtask(subtask);
    setForm({ 
      title: subtask.text, 
      description: subtask.description || "" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Judul subtask tidak boleh kosong.",
      });
      return;
    }

    Swal.fire({
      title: "Menyimpan...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      if (isEditing) {
        await updateSubtask(currentSubtask.id, form);
      } else {
        // When creating new subtask, it will default to 'pending' status from backend
        await createSubtask(taskId, form);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: isEditing
          ? "Subtask berhasil diupdate."
          : "Subtask berhasil ditambahkan.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      await fetchSubtasks(); // Refresh the data
    } catch (error) {
      console.error("Error saving subtask:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan subtask.",
      });
    }
  };

  const handleDeleteSubtask = async (id) => {
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

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Menghapus...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await deleteSubtask(id);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Subtask berhasil dihapus.",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchSubtasks(); // Refresh the data
    } catch (error) {
      console.error("Error deleting subtask:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus.",
      });
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    
    // If dropped outside droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn =
      source.droppableId === destination.droppableId
        ? sourceColumn
        : [...tasks[destination.droppableId]];

    // Remove item from source
    const [movedItem] = sourceColumn.splice(source.index, 1);
    
    // Add item to destination
    destColumn.splice(destination.index, 0, movedItem);

    // Update local state immediately for better UX
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    }));

    // If moved to different column, update status in backend
    if (source.droppableId !== destination.droppableId) {
      try {
        await changeStatus(movedItem.id, destination.droppableId);
        
        // Update the moved item's status in local state
        movedItem.status = destination.droppableId;
        
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Subtask moved to ${columns.find(col => col.key === destination.droppableId)?.title}`,
          timer: 1500,
          showConfirmButton: false,
        });
        
      } catch (error) {
        console.error("Error updating status:", error);
        
        // Revert the UI changes if API call fails
        setTasks((prev) => ({
          ...prev,
          [source.droppableId]: [...prev[source.droppableId], movedItem],
          [destination.droppableId]: prev[destination.droppableId].filter(
            item => item.id !== movedItem.id
          ),
        }));
        
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengupdate status subtask.",
        });
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 py-5 px-5 shadow-inner rounded-md"
        data-aos="fade-left">
        <h1 className="font-bold text-2xl text-white">Todo List Detail</h1>
      </div>

      <button
        onClick={openAddModal}
        className="bg-gradient-to-r from-teal-600 to-cyan-700 
              hover:from-teal-700 hover:to-cyan-800 text-white 
              font-bold py-2 px-4 rounded-lg transition-all duration-300 
              transform hover:scale-105 hover:shadow-xl active:scale-95 
              shadow-lg border border-teal-500 hover:border-teal-400 mb-6"
              data-aos="fade-left"
      >
        Tambah Subtask
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Subtask" : "Tambah Subtask"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Subtask *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-all duration-200"
                  placeholder="Masukkan judul subtask"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Masukkan deskripsi subtask"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white 
                  font-medium rounded-lg transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-700 
                  hover:from-teal-700 hover:to-cyan-800 text-white 
                  font-medium rounded-lg transition-all duration-200"
              >
                {isEditing ? "Update" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div
              key={col.key}
              className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-5 min-h-[400px] flex flex-col border border-teal-200"
            >
              <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-lg p-3 mb-4">
                <h2 className="font-semibold text-center text-lg text-white">
                  {col.title}
                </h2>
                <div className="text-center text-white text-sm mt-1">
                  {tasks[col.key].length} item{tasks[col.key].length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <Droppable droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 transition-all duration-200 rounded-lg p-2 ${
                      snapshot.isDraggingOver ? "bg-teal-100 border-2 border-dashed border-teal-400" : ""
                    }`}
                    style={{ minHeight: "200px" }}
                  >
                    {tasks[col.key].map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 
                              transition-all duration-200 hover:shadow-lg ${
                              snapshot.isDragging ? "rotate-3 shadow-2xl" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 mr-3">
                                <h3 className="font-medium text-gray-800 mb-2">
                                  {item.text}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    col.key === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    col.key === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {col.title}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-lg transition-colors"
                                  onClick={() => openEditModal(item)}
                                  title="Edit subtask"
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800 text-lg transition-colors"
                                  onClick={() => handleDeleteSubtask(item.id)}
                                  title="Hapus subtask"
                                >
                                  <i className="fa-regular fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {tasks[col.key].length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <p>Belum ada subtask</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}

export default TodoListDetail;