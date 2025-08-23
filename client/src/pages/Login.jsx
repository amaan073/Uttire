import { Link, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import publicAxios from "../api/publicAxios.js";
import { toast } from "react-toastify";
import { validateLoginForm } from "../utils/formValidators.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { useContext } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { user, fetchUser } = useContext(AuthContext);

  //getting the current route pathname (the page user was on) if not available then "/" homepage
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // will use this to redirect user back to the protected route they tried to access while being not logged in, after login this takes them back to the proctected route

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //custom validation (fallback)
    if (!validateLoginForm(formData)) {
      setLoading(false);
      return;
    }

    try {
      const res = await publicAxios.post("/users/login", formData, {
        withCredentials: true, // important for httpOnly cookies
      });

      try {
        await fetchUser(); // sets user in context if OK
        toast.success(`Welcome back, ${res.data?.user?.name ?? "User"}!`);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("Login failed. Please try again.");
      }
    } catch (e) {
      const status = e.response?.status || 0;
      const message =
        e.response?.data?.message || e.message || "Something went wrong!";

      if (status === 400 || status === 401) {
        //client fault
        toast.error(message);
      } else if (status === 500) {
        toast.error("Server error. please try again later.");
        console.log(e);
      } else {
        toast.error("Unexpected error. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid px-0 text-center d-flex justify-content-center align-items-center"
      style={{ maxWidth: "1600px", height: "calc(var(--safe-height) - 83px)" }}
    >
      <div className="login-form bg-white shadow rounded p-4">
        <AccountCircleIcon sx={{ height: "60px", width: "auto" }} />
        <h4 className="fw-semibold my-2 mb-3">Login</h4>
        <form style={{ width: "300px" }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email_input"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password_input"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-3" style={{ fontSize: "0.9em" }}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account?
            <Link to="/signup">
              <div className="fw-bold"> Signup </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
