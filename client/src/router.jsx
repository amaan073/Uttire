//Core
import { createBrowserRouter, Navigate } from "react-router-dom";

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
import Orders from "./pages/(logged-in)/Orders";
import Cart from "./pages/(logged-in)/Cart";

//Private route wrapper
import PrivateRoute from "./components/PrivateRoute";

//Pages - Admin
import AdminDashboard from "./pages/admin-pages/AdminDashboard";
import AdminProducts from "./pages/admin-pages/AdminProducts";
import AdminProductNew from "./pages/admin-pages/AdminProductNew";
import AdminProductEdit from "./pages/admin-pages/AdminProductEdit";
// import AdminOrders from "./pages/admin-pages/AdminOrders";
import AdminLayout from "./pages/admin-pages/AdminLayout";
import AdminRoute from "./components/AdminRoute";

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
          { path: "/orders", element: <Orders /> },
          { path: "/cart", element: <Cart /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />, // protect all children
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AdminLayout />, // header + toast + outlet
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/new", element: <AdminProductNew /> },
          { path: "products/:id/edit", element: <AdminProductEdit /> },
          // { path: "orders", element: <AdminOrders /> },
        ],
      },
    ],
  },
]);

export default router;
