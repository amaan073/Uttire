import { useState, useEffect, useRef } from "react";
import AuthContext from "./AuthContext.jsx";
import privateAxios from "../api/privateAxios.js";
import sessionAxios from "../api/sessionAxios.js";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const didCheck = useRef(false); // prevent double run in React StrictMode (dev only)

  // Check if user is already logged in on mount
  useEffect(() => {
    if (didCheck.current) return;
    didCheck.current = true;

    const checkUser = async () => {
      try {
        // Try access token first if available
        const res = await sessionAxios.get("/users/me");
        setUser(res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            // 2. If unauthorized, attempt refresh
            await sessionAxios.post("/users/refresh", {});
            // 3. Retry fetching user with new token
            const res = await sessionAxios.get("/users/me");
            setUser(res.data.user);
          } catch (refreshError) {
            console.warn("Refresh failed:", refreshError);
            setUser(null);
            // Explicitly clear session if refresh also failed
            await sessionAxios.post("/users/logout", {});
          }
        } else {
          console.warn("Auth check failed:", err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // after login(or signup) user fetching (for getting user info with access token and set the user globally)
  const fetchUser = async () => {
    try {
      const res = await privateAxios.get("/users/me");
      setUser(res.data.user); //set user globally
    } catch (err) {
      console.error("Fetching user (/me) failed:", err);

      setUser(null);

      // if it's unauthorized/forbidden, force logout
      if (err.response?.status === 401 || err.response?.status === 403) {
        await sessionAxios.post("/users/logout", {}); // clears refresh cookie
      }
      throw err;
    }
  };

  // logout method
  const logoutUser = async () => {
    try {
      await sessionAxios.post("/users/logout", {}); //using empty post request for some reasons like avoid clicking a link(GET) to logout and many more reasons
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchUser, logoutUser, loading }}
    >
      {loading ? "" : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
