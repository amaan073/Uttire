import { createContext, useState, useEffect, useContext } from "react";
import sessionAxios from "../api/sessionAxios.js";
import privateAxios from "../api/privateAxios.js";
import AuthContext from "./AuthContext.jsx";
import { toast } from "react-toastify";

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext); // get user from AuthContext, get the loading var value from auth context and use deconstruct to assing the value to authloadinng var
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return; // wait until AuthContext is ready

    const fetchCart = async () => {
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
        toast.error("Failed to fetch cart.");
        setError("Failed to load your cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]); // runs when user is set

  const addToCart = async (item) => {
    if (!user) return toast.info("Please login to add items to cart");

    try {
      const { data } = await privateAxios.post("/cart", item);
      setCart(data);
      toast.success("Product added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product");
      throw err;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!user) return;

    try {
      const { data } = await privateAxios.put(`/cart/${id}`, { quantity });
      setCart(data);
      toast.success("Cart updated");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
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
      toast.error("Failed to remove product");
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
