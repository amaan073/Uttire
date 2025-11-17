import { Link, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { validateLoginForm } from "../utils/formValidators.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { useContext } from "react";
import sessionAxios from "../api/sessionAxios.js";
import { Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";

const Login = () => {
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // show password button state

  const { user, fetchUser } = useContext(AuthContext);

  // getting the current route pathname (the page user was on) if not available then "/" homepage
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // this comes from state object from private route guard logic which navigate us back to the protected route the non logged in user was trying to access , we can use this to again redirect user back to their main target

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
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
      const res = await sessionAxios.post("/users/login", formData);

      try {
        await fetchUser(); // sets user in context if OK
        toast.success(`Welcome back, ${res.data?.user?.name ?? "User"}!`);
        // after this when the user gets populated the navigation will be handled by useEffect() in above
      } catch (err) {
        console.log(err);
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

  // prevent user to access signup page after they have already been logged in and redirect to homepage handled by useEffect() as it sees user is populated
  if (user)
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

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
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password_input"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              disabled={loading}
              style={{ paddingRight: "40px" }}
              required
            />
            {/* show password button */}
            {formData.password.length > 0 && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "6px",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !isOnline}
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
