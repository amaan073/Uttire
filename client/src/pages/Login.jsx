import { Link, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { useContext } from "react";
import sessionAxios from "../api/sessionAxios.js";
import { Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";
import OfflineNote from "../components/ui/OfflineNote.jsx";
import { isValidEmail } from "../utils/validators.js";

const Login = () => {
  const isOnline = useOnlineStatus();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // inline validation error state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // show password button state

  const { user, setUser } = useContext(AuthContext);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Please enter a valid email.";

    if (!formData.password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await sessionAxios.post("/users/login", formData);

      setUser(data.user); // set user in global context

      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (e) {
      console.error(e);

      const status = e.response?.status;
      const code = e.response?.data?.code;

      if (e.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Check your connection.");
      } else if (e.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else if (status === 401 && code === "INVALID_CREDENTIALS") {
        setErrors({ form: "Invalid email or password." });
      } else {
        toast.error("Failed to login. Please try again later.");
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
        <form style={{ width: "300px" }} onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="alert alert-danger py-2">{errors.form}</div>
          )}
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email_input"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              disabled={loading}
              required
            />
            {errors.email && (
              <div className="invalid-feedback text-start">{errors.email}</div>
            )}
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
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
            {errors.password && (
              <div className="invalid-feedback text-start">
                {errors.password}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading || !isOnline}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> <span>Logging in</span>
              </>
            ) : (
              "Login"
            )}
          </button>
          <OfflineNote isOnline={isOnline} />
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
