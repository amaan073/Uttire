import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div
      className="container-fluid px-0 d-flex justify-content-center align-items-center"
      style={{ maxWidth: "1600px", minHeight: "calc(100vh - 210px)" }}
    >
      <div className="signup-form bg-white shadow rounded p-4">
        <h2 className="fw-semibold my-2 mb-3">Sign up</h2>
        <form style={{ width: "300px" }}>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="name_input">
              Name
            </label>
            <input type="text" className="form-control" id="name_input" />
          </div>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="email_input">
              Email address
            </label>
            <input type="email" className="form-control" id="email_input" />
          </div>
          <div className="mb-3">
            <label className="small text-muted" htmlFor="password_input">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password_input"
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
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
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
