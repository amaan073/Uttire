import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Logged in and admin → allow access
  return <Outlet />;
};

export default AdminRoute;
