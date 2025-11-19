import { Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "../../components/AdminHeader"; // create this later
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import DocumentTitle from "../../components/DocumentTitle";

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.isAdmin) {
      toast.success(`Welcome back, Admin!`);
    }
  }, [user]);
  return (
    <>
      <DocumentTitle />
      <AdminHeader />
      <main style={{ marginTop: "82px" }}>
        <Outlet />
      </main>

      <ToastContainer
        position="top-right"
        style={{ marginTop: "82px" }}
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default AdminLayout;
