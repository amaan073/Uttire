import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Login = () => {
  return (
    <div
      className="container-fluid px-0 text-center d-flex justify-content-center align-items-center"
      style={{ maxWidth: "1600px", minHeight: "calc(100vh - 210px)" }}
    >
      <div className="bg-white shadow rounded p-4">
        <AccountCircleIcon sx={{ height: "60px", width: "auto" }} />
        <h4 className="fw-semibold my-2 mb-3">Login</h4>
        <form style={{ width: "300px" }}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email_input"
              placeholder="Email address"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password_input"
              placeholder="Password"
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
