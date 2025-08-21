import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import "./index.css";
// import AuthProvider from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AuthProvider>     This grant global access of user state variable */}
    <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </StrictMode>
);
