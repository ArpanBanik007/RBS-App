import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { IoMdHome } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { MdLogout } from "react-icons/md";

function AdminNavbar() {
  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8007/api/v1/users/logout",
        {},
        { withCredentials: true },
      );

      navigate("/");
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  return (
    <nav className="sticky top-0 w-full bg-slate-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-14 h-16 text-slate-300 text-lg">
        {/* Home */}
        <Link
          to="/admin"
          className="flex items-center gap-2 hover:text-white transition duration-300"
        >
          <IoMdHome size={22} />
          <span>Home</span>
        </Link>

        {/* All Tasks */}
        <Link
          to="/admin/tasks"
          className="flex items-center gap-2 hover:text-white transition duration-300"
        >
          <FaTasks size={20} />
          <span>All Tasks</span>
        </Link>

        {/* All Users */}
        <Link
          to="/admin/users"
          className="flex items-center gap-2 hover:text-white transition duration-300"
        >
          <MdGroups size={22} />
          <span>All Users</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-red-400 transition duration-300"
        >
          <MdLogout size={22} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
