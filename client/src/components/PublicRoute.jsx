import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

const PublicRoute = () => {
  const { user } = useContext(AuthContext);
  
  //if user tries to type /login in the url and access login page whle they are already logged in the page will redirect to home page
  return user ?  <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
