import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.jsx";
import publicAxios from "../api/publicAxios.js";
import privateAxios from "../api/privateAxios.js";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await publicAxios.get("/users/me", {
          withCredentials: "true",
        });
        setUser(res.data.user);
      } catch (err) {
        console.warn("Auth check failed:", err);
        setUser(null);

        if (err.response?.status === 401 || err.response?.status === 403) {
          await publicAxios.post(
            "/users/logout",
            {},
            { withCredentials: true }
          );
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // login method (for getting user info with access token and set the user globally)
  const fetchUser = async () => {
    try {
      const res = await privateAxios.get("/users/me");
      setUser(res.data.user); //set user globally
    } catch (err) {
      console.error("Fetching user (/me) failed:", err);

      setUser(null);

      // if it's unauthorized/forbidden, force logout
      if (err.response?.status === 401 || err.response?.status === 403) {
        await publicAxios.post("/users/logout", {}, { withCredentials: true }); // clears refresh cookie
      }
      throw err;
    }
  };

  // logout method
  const logoutUser = async () => {
    try {
      await publicAxios.post("/users/logout", {}, { withCredentials: true });
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, fetchUser, logoutUser, loading }}>
      {loading ? "" : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
