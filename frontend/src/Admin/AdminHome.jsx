import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "https://rbs-app.onrender.com/api/v1/users/currentUser",
        {
          withCredentials: true,
        },
      );

      setAdmin(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {loading && <p className="text-white text-xl">Loading...</p>}
      {error && <p className="text-red-500 text-xl">{error}</p>}

      {!loading && admin && (
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome, {admin.username || admin.email} 👋
        </h1>
      )}
    </div>
  );
}

export default AdminHome;
