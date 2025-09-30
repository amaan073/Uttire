//Core
import { createBrowserRouter } from "react-router-dom";

//Layout
import App from "./App";

//Pages - Public
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

//Pages - Private
import DirectCheckout from "./pages/(logged-in)/checkout/DirectCheckout";
import CartCheckout from "./pages/(logged-in)/checkout/CartCheckout";
import OrderSuccess from "./pages/(logged-in)/OrderSuccess";
import Profile from "./pages/(logged-in)/Profile";
import Dashboard from "./pages/(logged-in)/Dashboard";
import Cart from "./pages/(logged-in)/Cart";

//Private route wrapper
import PrivateRoute from "./components/PrivateRoute";

//Pages - Admin
import Admin from "./pages/Admin";

// ✅ React Router Setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/shop", element: <Shop /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/products/:id", element: <ProductDetail /> },

      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },

      // 🔒 Protected route wrapper (accessing these routes require going through PrivateRoute component first)
      {
        element: <PrivateRoute />,
        children: [
          { path: "/products/:id/checkout", element: <DirectCheckout /> },
          { path: "/cart/checkout", element: <CartCheckout /> },
          { path: "/checkout/success/:orderId", element: <OrderSuccess /> },
          { path: "/profile", element: <Profile /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/cart", element: <Cart /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    errorElement: <NotFoundPage />, //just in case
    element: <Admin />,
  },
]);

export default router;
