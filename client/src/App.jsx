import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet, ScrollRestoration } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: "82px" }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
};

export default App;
