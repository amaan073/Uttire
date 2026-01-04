import { createContext, useState, useEffect, useRef } from "react";
import sessionAxios from "../api/sessionAxios.js";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
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

  // logout method
  const logoutUser = async () => {
    try {
      await sessionAxios.post("/users/logout", {}); //using empty post request for some reasons like avoid clicking a link(GET) to logout and many more reasons
      setUser(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error(error);
      if (error.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (error.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to log out. Please try again.");
      }

      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
