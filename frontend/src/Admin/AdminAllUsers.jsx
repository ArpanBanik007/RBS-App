import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";

function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // which menu open

  // ===============================
  // Fetch All Users
  // ===============================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:8007/api/v1/users/all-users",
        { withCredentials: true },
      );

      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Delete User
  // ===============================
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8007/api/v1/users/delete/${userId}`,
        { withCredentials: true },
      );

      // remove from UI instantly
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users (Admin)</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Joined At</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 relative">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                {new Date(user.createdAt).toLocaleString()}
              </td>

              {/* 3 Dot Menu Column */}
              <td className="border p-2 text-center relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === user._id ? null : user._id)
                  }
                  className="p-2 hover:bg-gray-200 rounded-full"
                >
                  <BsThreeDotsVertical />
                </button>

                {/* Dropdown */}
                {openMenu === user._id && (
                  <div className="absolute right-10 top-10 bg-white shadow-lg rounded-md border w-32 z-50">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => alert("Edit feature coming soon")}
                    >
                      <MdModeEdit /> Edit
                    </button>

                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-600 text-sm"
                      onClick={() => handleDelete(user._id)}
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

export default AdminAllUsers;
