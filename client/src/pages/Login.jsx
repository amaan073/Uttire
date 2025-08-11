import { Link, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isValidEmail, isValidLoginPassword } from "../utils/validators.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx"
import { useContext } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  //getting the current route pathname if not available then "/" homepage
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // fallback to home

  //context to use the user and its functions through context
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!isValidLoginPassword(password)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await axios.post("/api/users/login", {
        email,
        password,
      });
      
      loginUser(res.data.token); // ✅ This sets the token, decodes it, updates user globally
      toast.success(`Welcome back, ${res.data?.user?.name || "User"}!`);
      navigate(from, { replace: true });
    } catch (e) {
      const status = e.response?.status;
      const message = e.response?.data?.message || "Something went wrong!";

      if (status === 400 || status === 401) {
        //client fault
        toast.error(message);
      } else if (status === 500) {
        toast.error("Server error. please try again later.");
        console.log(e);
      } else {
        toast.error("Unexpected error. Check your connection.");
      }
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
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email_input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password_input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
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
