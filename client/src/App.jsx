// App.jsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// animated wrapper
import AnimatedOutlet from "./wrappers/AnimatedOutlet";

const App = () => {
  return (
    <>
      <Header />

      <main style={{ marginTop: "82px" }}>
        {/* Smooth global page transitions */}
        <AnimatedOutlet />
      </main>

      <Footer />

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

export default App;
