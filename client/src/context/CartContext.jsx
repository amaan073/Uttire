import { createContext, useState, useEffect, useContext } from "react";
import sessionAxios from "../api/sessionAxios.js";
import privateAxios from "../api/privateAxios.js";
import AuthContext from "./AuthContext.jsx";
import { toast } from "react-toastify";

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // get user from AuthContext, get the loading var value from auth context and use deconstruct to assing the value to authloadinng var
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);

    if (!user) {
      setCart([]); // no user → empty cart
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await sessionAxios.get("/cart");
      setCart(data);
      setError(null); // clear old error
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (err.code === "OFFLINE_ERROR" || err.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else {
        setError("Failed to load your cart. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // runs when user is set

  const addToCart = async (item) => {
    if (!user) return toast.info("Please login to add items to cart");

    try {
      const { data } = await privateAxios.post("/cart", item);
      setCart(data);
      toast.success("Product added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to add product");
      }
      throw err;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!user) return;

    try {
      const { data } = await privateAxios.put(`/cart/${id}`, { quantity });
      setCart(data);
    } catch (err) {
      console.error("Error updating quantity:", err);
      if (err.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to update quantity");
      }
      throw err;
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;

    try {
      const { data } = await privateAxios.delete(`/cart/${id}`);
      setCart(data);
      toast.info("Product removed from cart");
    } catch (err) {
      console.error("Error removing from cart:", err);
      if (err.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to remove product");
      }
      throw err;
    }
  };

  const clearCart = () => {
    setCart([]);
    setError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
