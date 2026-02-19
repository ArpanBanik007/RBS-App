import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import CreateTaskpage from "./pages/CreateTaskpage";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import AdminPage from "./Admin/AdminPage";
import AdminAllUsers from "./Admin/AdminAllUsers";
import AdminAllTasks from "./Admin/AdminAllTasks";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected User Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/createtask"
        element={
          <PrivateRoute>
            <CreateTaskpage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/AdminHome"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <AdminRoute>
            <AdminAllTasks />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminAllUsers />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
