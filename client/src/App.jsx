import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//react toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: "82px" }}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        style={{ marginTop: "82px" }}
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
      <ScrollRestoration />
    </>
  );
};

export default App;
