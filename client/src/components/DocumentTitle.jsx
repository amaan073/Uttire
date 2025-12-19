import { useLocation } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

/**
 * Component that automatically updates document title based on current route
 */
const DocumentTitle = () => {
  const location = useLocation();

  // Route to title mapping
  const getTitleFromRoute = () => {
    const path = location.pathname;

    // Admin routes
    if (path.startsWith("/admin")) {
      if (path === "/admin" || path === "/admin/dashboard") {
        return "Admin Dashboard";
      }
      if (path === "/admin/products") {
        return "Admin Products";
      }
      if (path === "/admin/products/new") {
        return "New Product";
      }
      if (path.match(/^\/admin\/products\/.+\/edit$/)) {
        return "Edit Product";
      }
      if (path === "/admin/orders") {
        return "Admin Orders";
      }
      return "Admin";
    }

    // Public routes
    if (path === "/") {
      return "Home";
    }
    if (path === "/shop") {
      return "Shop";
    }
    if (path === "/about") {
      return "About";
    }
    if (path === "/contact") {
      return "Contact";
    }
    if (path === "/login") {
      return "Login";
    }
    if (path === "/signup") {
      return "Sign Up";
    }

    if (path.match(/^\/products\/.+\/checkout$/)) {
      return "Checkout";
    }
    if (path.match(/^\/products\/.+/)) {
      // ProductDetail page will handle its own title
      return null; // Return null to use default title until product loads
    }
    if (path === "/cart") {
      return "Shopping Cart";
    }
    if (path === "/cart/checkout") {
      return "Checkout";
    }
    if (path.match(/^\/checkout\/success\/.+/)) {
      // order success page will handle
      return null;
    }
    if (path === "/profile") {
      return "Profile";
    }
    if (path === "/orders") {
      return "My Orders";
    }

    // Default for unknown routes
    return null;
  };

  const title = getTitleFromRoute();
  useDocumentTitle(title);

  return null; // This component doesn't render anything
};

export default DocumentTitle;
