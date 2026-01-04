import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import sessionAxios from "../api/sessionAxios.js";
import { Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
} from "../utils/validators.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isOnline = useOnlineStatus();

  // password visibility controls
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!isValidName(formData.name)) {
      newErrors.name = "Name must be at least 2 letters (letters only).";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        "Password must be 6+ characters with a letter and number (no spaces).";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const sanitizedFormData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      const { data } = await sessionAxios.post(
        "/users/register",
        sanitizedFormData
      );

      setUser(data.user);

      toast.success(
        `Signup successful! Welcome aboard${data?.user?.name ? ", " + data.user.name : ""}! 🙌`
      );
    } catch (e) {
      console.error(e);

      const status = e.response?.status;
      const code = e.response?.data?.code;

      if (e.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Check your connection.");
      } else if (e.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else if (status === 409 && code === "USER_EXISTS") {
        setErrors({ email: "Email already in use. Try logging in instead." });
      } else {
        toast.error("Failed to Sign up. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid px-0 d-flex justify-content-center align-items-center"
      style={{ maxWidth: "1600px", height: "calc(var(--safe-height) - 83px)" }}
    >
      <div className="signup-form bg-white shadow rounded p-4">
        <h2 className="fw-semibold my-2 mb-3">Sign up</h2>
        <form style={{ width: "300px" }} onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="name_input">
              Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name_input"
              name="name"
              onChange={handleChange}
              disabled={loading}
              required
            />
            {errors.name && (
              <div className="invalid-feedback text-start">{errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="email_input">
              Email address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email_input"
              name="email"
              onChange={handleChange}
              disabled={loading}
              required
            />
            {errors.email && (
              <div className="invalid-feedback text-start">{errors.email}</div>
            )}
          </div>
          <div className="mb-3 position-relative">
            <label className="small text-muted" htmlFor="password_input">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password_input"
              name="password"
              onChange={handleChange}
              disabled={loading}
              style={{ paddingRight: "40px" }}
              required
            />
            {/* show eye icon only if has value */}
            {!errors.password && formData.password && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "31px",
                  cursor: "pointer",
                  opacity: "0.8",
                }}
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            )}
            {errors.password && (
              <div className="invalid-feedback text-start">
                {errors.password}
              </div>
            )}
          </div>
          <div className="mb-3 position-relative">
            <label
              className="small text-muted"
              htmlFor="confirm_password_input"
            >
              Confirm password
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              id="confirm_password_input"
              name="confirmPassword"
              onChange={handleChange}
              disabled={loading}
              style={{ paddingRight: "40px" }}
              required
            />
            {!errors.confirmPassword && formData.confirmPassword && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "31px",
                  cursor: "pointer",
                  opacity: "0.8",
                }}
                onClick={() => setShowConfirmPass((prev) => !prev)}
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            )}
            {errors.confirmPassword && (
              <div className="invalid-feedback text-start">
                {errors.confirmPassword}
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
                <Spinner animation="border" size="sm" /> <span>Signing in</span>
              </>
            ) : (
              "Sign up"
            )}
          </button>
          <div className="mt-3 text-center" style={{ fontSize: "0.9em" }}>
            Already have an account?
            <Link to="/login">
              <span className="fw-bold"> Log in </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
