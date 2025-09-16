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

  useEffect(() => {
    if (authLoading) return; // wait until AuthContext is ready

    const fetchCart = async () => {
      if (!user) {
        setCart([]); // no user → empty cart
        setLoading(false);
        return;
      }

      try {
        const { data } = await sessionAxios.get("/cart");
        // console.log(data);
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // runs when user is set

  const addToCart = async (item) => {
    if (!user) return toast.info("Please login to add items to cart");

    try {
      const { data } = await sessionAxios.post("/cart", item);
      setCart(data);
      toast.success("Product added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product");
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

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
