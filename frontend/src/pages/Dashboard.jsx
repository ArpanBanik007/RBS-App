import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/current-user")
      .then((res) => setUser(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  if (!user) return <p className="p-5">Loading...</p>;

  return (
    <>
      <Navbar role={user.role} />
      <div className="p-8">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p><b>Name:</b> {user.fullName}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
