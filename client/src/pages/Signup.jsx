import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateSignupForm } from "../utils/formValidators.js";
import AuthContext from "../context/AuthContext.jsx";
import sessionAxios from "../api/sessionAxios.js";
import { Spinner } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";

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
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //custom validation (fallback)
    if (!validateSignupForm(formData)) {
      setLoading(false);
      return;
    }

    const sanitizedFormData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      const res = await sessionAxios.post("/users/register", sanitizedFormData);

      try {
        await fetchUser(); // sets user in context if OK
        toast.success(
          `Signup successful! Welcome aboard${res.data?.user?.name ? ", " + res.data.user.name : ""}! 🙌`
        );
        // after this when the user gets populated the navigation will be handled by useEffect() in above
      } catch {
        toast.info("Signup successful. Please login to continue.");
        navigate("/login");
      }
    } catch (e) {
      if (e.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Check your connection.");
      } else if (e.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        const status = e.response?.status || 0;
        const message =
          e.response?.data?.message || e.message || "Something went wrong!";

        if (status === 400 || status === 401) {
          // client fault , credentials invalid
          toast.error(message);
        } else if (status === 500) {
          toast.error("Server error. please try again later.");
          console.log(e);
        } else {
          toast.error("Unexpected error. Check your connection.");
        }
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
        <form style={{ width: "300px" }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="name_input">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name_input"
              name="name"
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="email_input">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email_input"
              name="email"
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="small text-muted" htmlFor="password_input">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              className="form-control"
              id="password_input"
              name="password"
              onChange={handleChange}
              disabled={loading}
              style={{ paddingRight: "40px" }}
              required
            />
            {/* show eye icon only if has value */}
            {formData.password && (
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
              className="form-control"
              id="confirm_password_input"
              name="confirmPassword"
              onChange={handleChange}
              disabled={loading}
              style={{ paddingRight: "40px" }}
              required
            />
            {formData.confirmPassword && (
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
