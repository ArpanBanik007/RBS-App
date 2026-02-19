import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

function AdminAllTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ===============================
  // Fetch All Tasks
  // ===============================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:8007/api/v1/tasks/alltasks",
        { withCredentials: true },
      );

      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Delete Task
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8007/api/v1/tasks/${id}`, {
        withCredentials: true,
      });

      // instantly remove from UI
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Tasks (Admin)</h2>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks found.</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Created By</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50 relative">
              <td className="border p-2">{task.title}</td>
              <td className="border p-2">{task.description}</td>
              <td className="border p-2">{task.createdBy?.email || "N/A"}</td>
              <td className="border p-2">
                {new Date(task.createdAt).toLocaleString()}
              </td>

              {/* 3 Dot Menu */}
              <td className="border p-2 text-center relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === task._id ? null : task._id)
                  }
                  className="p-2 hover:bg-gray-200 rounded-full"
                >
                  <BsThreeDotsVertical />
                </button>

                {openMenu === task._id && (
                  <div className="absolute right-10 top-10 bg-white shadow-lg rounded-md border w-32 z-50">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-600 text-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      <FaTrashCan /> Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAllTasks;
