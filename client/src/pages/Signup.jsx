import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import publicAxios from "../api/publicAxios.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateSignupForm } from "../utils/formValidators.js";
import AuthContext from "../context/AuthContext.jsx";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  //getting the current route pathname (the page user was on) if not available then "/" homepage
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // will use this to redirect user back to the protected route they tried to access while being not logged in, after login this takes them back to the proctected route

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
      const res = await publicAxios.post("/users/register", sanitizedFormData);

      try {
        await fetchUser(); // sets user in context if OK
        toast.success(
          `Signup successful! Welcome aboard${res.data?.user?.name ? ", " + res.data.user.name : ""}! 🙌`
        );
      } catch {
        toast.info("Signup successful. Please login to continue.");
        navigate("/login");
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
          <div className="mb-3">
            <label className="small text-muted" htmlFor="password_input">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password_input"
              name="password"
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label
              className="small text-muted"
              htmlFor="confirm_password_input"
            >
              Confirm password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm_password_input"
              name="confirmPassword"
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
            {loading ? "Signing up..." : "Sign up"}
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
