import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/current-user")
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-5">Loading...</p>;

  if (!user) return <Navigate to="/" />;

  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoutes;
