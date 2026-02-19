import { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8007/api/v1/tasks/mytasks",
        { withCredentials: true },
      );
      setTasks(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`http://localhost:8007/api/v1/tasks/${id}`, {
        withCredentials: true,
      });

      setTasks((prev) => prev.filter((task) => task._id !== id));
      setActiveMenu(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= OPEN EDIT =================
  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
    });
    setIsEditOpen(true);
    setActiveMenu(null);
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:8007/api/v1/tasks/${editingTask._id}`,
        formData,
        { withCredentials: true },
      );

      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.data.data : t)),
      );

      setIsEditOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Tasks</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="relative bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition duration-300"
          >
            {/* ===== Three Dot Menu ===== */}
            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === task._id ? null : task._id);
                }}
                className="text-gray-600 hover:text-black"
              >
                <BsThreeDotsVertical />
              </button>

              {activeMenu === task._id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => openEditModal(task)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <MdModeEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaTrashCan /> Delete
                  </button>
                </div>
              )}
            </div>

            {/* ===== Task Content ===== */}
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {task.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {task.description || "No description"}
            </p>

            {/* ✅ Created By Added Back */}
            <p className="text-xs text-gray-400 mt-3">
              Created by: {task.createdBy?.email || "Unknown"}
            </p>

            {/* Optional Created Date */}
            {task.createdAt && (
              <p className="text-xs text-gray-300 mt-1">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Title"
                required
              />

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Description"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
