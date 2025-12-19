import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import router from "./router";
import useOnlineStatus from "./hooks/useOnlineStatus";
import OfflineBanner from "./components/OfflineBanner";
import { RouterProvider } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && <OfflineBanner />}

      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
