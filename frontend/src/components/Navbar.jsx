import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { IoMdHome } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 🔥 for redirect

  // ================= FETCH CURRENT USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://rbs-app.onrender.com/api/v1/users/currentUser",
          { withCredentials: true },
        );
        setUser(res.data.data);
      } catch (error) {
        console.log("Failed to load user", error);
      }
    };

    fetchUser();
  }, []);

  // ================= HANDLE LOGOUT =================
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://rbs-app.onrender.com/api/v1/users/logout",
        {},
        { withCredentials: true },
      );

      // 🔥 Clear user state
      setUser(null);

      // 🔥 Redirect to login page
      navigate("/");
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  return (
    <nav className="sticky top-0 w-full bg-slate-700 flex items-center justify-between px-6 h-16 shadow-md z-50">
      {/* 🔹 Left Side */}
      <div className="flex items-center gap-6">
        <Link
          to="/home"
          className="text-2xl font-semibold italic text-slate-300 hover:bg-slate-900 px-3 py-1 rounded-md"
        >
          Welcome
        </Link>

        {user && (
          <div className="flex items-center gap-3 bg-slate-600 px-4 py-2 rounded-xl border border-slate-600">
            <RiAccountCircleFill className="text-2xl text-white" />
            <div className="flex flex-col text-sm text-gray-200 leading-tight">
              <span className="font-semibold">{user.fullName}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* 🔹 Center Icons */}
      <div className="hidden md:flex items-center gap-10 text-3xl text-slate-300">
        <Link to="/home" className="hover:text-white transition cursor-pointer">
          <IoMdHome />
        </Link>

        <Link
          to="/createtask"
          className="hover:text-white transition cursor-pointer"
        >
          <IoAddCircleOutline />
        </Link>

        {/* 🔥 Logout Button */}
        <button
          onClick={handleLogout}
          className="hover:text-red-400 transition cursor-pointer"
        >
          <MdLogout />
        </button>
      </div>

      {/* 🔹 Mobile Menu */}
      <div className="md:hidden text-3xl text-slate-300 cursor-pointer">
        <TiThMenu />
      </div>
    </nav>
  );
}

export default Navbar;
