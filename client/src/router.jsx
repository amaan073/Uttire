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
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

//Pages - Private
import Checkout from "./pages/(logged-in)/Checkout";
import OrderSuccess from "./pages/(logged-in)/OrderSuccess";
import Profile from "./pages/(logged-in)/Profile";
import Dashboard from "./pages/(logged-in)/Dashboard";

//Private route wrapper
import PrivateRoute from "./components/PrivateRoute";

//Public route wrapper
import PublicRoute from "./components/PublicRoute";

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
      { path: "/product", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },

      //Public routes (so user dont access them through url when they are already logged in!)
      {
        element: <PublicRoute />, // Wrapper
        children: [
          { path: "/signup", element: <Signup /> },
          { path: "/login", element: <Login /> },
        ],
      },

      // 🔒 Protected route wrapper (accessing these routes require going through PrivateRoute component first)
      {
        element: <PrivateRoute />,
        children: [
          { path: "/checkout", element: <Checkout /> },
          { path: "/order-success", element: <OrderSuccess /> },
          { path: "/profile", element: <Profile /> },
          { path: "/dashboard", element: <Dashboard /> },
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
