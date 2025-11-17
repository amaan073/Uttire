import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AppWrapper from "./wrappers/AppWrapper.jsx";
import useOnlineStatus from "./hooks/useOnlineStatus";
import OfflineBanner from "./components/OfflineBanner";

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && <OfflineBanner />}

      <AuthProvider>
        <CartProvider>
          <AppWrapper />
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
