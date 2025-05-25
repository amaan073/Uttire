import { useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const [mode, setMode] = useState("view"); //view, edit and change password

  return (
    <>
      <div
        className="container-fluid px-0 d-flex justify-content-center align-items-center"
        style={{
          maxWidth: "1600px",
          minHeight: "calc(var(--safe-height) - 83px)",
        }}
      >
        {mode == "view" && (
          <>
            <div
              className="text-center bg-white p-5 rounded-4 my-5"
              style={{ width: "400px" }}
            >
              <h1 className="fw-semibold display-6">My Proflie</h1>
              <div className="mb-3">
                <AccountCircleIcon sx={{ height: "125px", width: "auto" }} />
              </div>
              <div className="text-start" style={{ maxWidth: "300px" }}>
                <div className="d-flex my-3">
                  <b style={{ minWidth: "110px" }}>Name</b>
                  <p className="m-0">John Doe</p>
                </div>
                <div className="d-flex align-items-center my-3">
                  <b style={{ minWidth: "110px" }}>Email</b>
                  <p className="m-0" style={{ wordBreak: "break-all" }}>
                    {" "}
                    john.doe@gmail.com
                  </p>
                </div>
                <div className="d-flex my-3">
                  <b style={{ minWidth: "110px" }}>Phone no.</b>
                  <p className="m-0">+951234567890</p>
                </div>
                <div className="d-flex align-items-center my-2">
                  <label style={{ minWidth: "110px" }}>
                    <b>Password</b>
                  </label>
                  <input
                    type="password"
                    value="passowrd"
                    disabled
                    className="form-control"
                  />
                </div>
              </div>
              <div className="d-flex w-100 gap-2 my-4">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => setMode("edit")}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 text-nowrap"
                  onClick={() => setMode("changePassword")}
                >
                  Change Password
                </button>
              </div>
            </div>
          </>
        )}

        {/* Edit profile mode */}
        {mode == "edit" && (
          <>
            <div
              className="text-center bg-white p-5 rounded-4 my-5"
              style={{ width: "400px" }}
            >
              <h1 className="fw-semibold display-6">My Profile</h1>
              <div className="mb-3 position-relative">
                <AccountCircleIcon sx={{ height: "125px", width: "auto" }} />
                <button
                  type="button"
                  className="edit-btn btn rounded-circle bg-light p-0 border"
                  title="Change profile picture"
                >
                  <EditIcon />
                </button>
              </div>
              <form className="text-start">
                <div className="form-group mb-3">
                  <label
                    htmlFor="name-input"
                    className="fw-semibold mb-1 text-secondary"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name-input"
                    name="name"
                    value="John doe"
                  />
                </div>
                <div className="form-group mb-3">
                  <label
                    htmlFor="email-input"
                    className="fw-semibold mb-1 text-secondary"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email-input"
                    name="email"
                    value="john.doe@gmail.com"
                  />
                </div>
                <div className="form-group mb-3">
                  <label
                    htmlFor="phone-no-input"
                    className="fw-semibold mb-1 text-secondary"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone-no-input"
                    name="Phone-no"
                    value="+951234567890"
                  />
                </div>
                <div className="form-group d-flex gap-2 w-100 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => setMode("view")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary w-100">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Change password form */}
        {mode == "changePassword" && (
          <>
            <div
              className="text-center bg-white p-5 rounded-4 my-5"
              style={{ width: "400px" }}
            >
              <h1 className="fw-semibold display-6">My Proflie</h1>
              <div className="mb-3">
                <AccountCircleIcon sx={{ height: "125px", width: "auto" }} />
              </div>
              <div className="text-start" style={{ maxWidth: "300px" }}>
                <div className="d-flex my-3">
                  <b style={{ minWidth: "110px" }}>Name</b>
                  <p className="m-0">John Doe</p>
                </div>
                <div className="d-flex align-items-center my-3">
                  <b style={{ minWidth: "110px" }}>Email</b>
                  <p className="m-0" style={{ wordBreak: "break-all" }}>
                    {" "}
                    john.doe@gmail.com
                  </p>
                </div>
                <div className="d-flex my-3">
                  <b style={{ minWidth: "110px" }}>Phone no.</b>
                  <p className="m-0">+951234567890</p>
                </div>
              </div>
              <h5 className="fw-semibold mb-3 text-primary text-start mt-4">
                Change Password
              </h5>
              <div className="border p-4 rounded-3 text-start">
                <form>
                  <div className="form-group mb-3">
                    <label
                      htmlFor="current-password"
                      className="fw-semibold mb-1 text-secondary"
                    >
                      Current password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="current-password"
                      name="currentPassword"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label
                      htmlFor="new-password"
                      className="fw-semibold mb-1 text-secondary"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="new-password"
                      name="newPassword"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label
                      htmlFor="confirm-password"
                      className="fw-semibold mb-1 text-secondary"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm-password"
                      name="confirmPassword"
                    />
                  </div>

                  <div className="form-group d-flex gap-2 w-100 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100"
                      onClick={() => setMode("view")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 text-nowrap"
                    >
                      Change password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
