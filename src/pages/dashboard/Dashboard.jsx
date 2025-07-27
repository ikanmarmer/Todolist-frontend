import { useEffect, useState } from "react";
import TaskController from "../../controllers/TaskController";
import { Link } from "react-router-dom";

function Dashboard() {
  const { task, getTask } = TaskController();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        await getTask();
      } catch (err) {
        console.error("Gagal ambil data task", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [getTask]);

  return (
    <>
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-6 shadow-inner rounded-md"
        data-aos="fade-left">
        <h1 className="font-bold text-2xl text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link
          to="/todo-list"
          className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 shadow-inner rounded-md hover:shadow-md transition"
          data-aos="fade-up"
        >
          {/* Label “Jumlah Todos” */}
          <h2 className="text-lg font-semibold mb-2 text-yellow-200">
            Jumlah Todos
          </h2>

          {/* Konten angka / loader */}
          {loading ? (
            // skeleton box dengan animate-pulse
            <div className="h-12 w-24 bg-white/30 rounded-lg animate-pulse"></div>
          ) : (
            // angka nyata
            <p className="text-4xl font-bold text-yellow-300">
              {task.length}
            </p>
          )}
        </Link>
      </div>
    </>
  );
}

export default Dashboard;
