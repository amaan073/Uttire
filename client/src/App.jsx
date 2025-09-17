import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollToTop from "./utils/ScrollToTop";

//react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />
      <ScrollToTop />
      <main style={{ marginTop: "82px" }}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        style={{ marginTop: "82px" }}
        autoClose={2000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default App;
