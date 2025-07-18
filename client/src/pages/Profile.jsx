import { Link } from "react-router-dom";
import { useState } from "react";

import ProfileDetail from "../components/ProfileDetail";
import DemoTooltip from "../components/ui/DemoTooltipButton";

import LockIcon from "@mui/icons-material/Lock";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DeleteIcon from "@mui/icons-material/Delete";

const Profile = () => {
  const [mode, setMode] = useState("view"); //view, editProfile or changePassword

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center py-5 align-items-center"
        style={{
          maxWidth: "1600px",
          minHeight: "calc(var(--safe-height) - 83px)",
        }}
      >
        <div className="d-md-flex gap-3 mb-md-5 align-items-start">
          <ProfileDetail mode={mode} setMode={setMode} />
          {/*content right */}
          <div>
            {/* Account security */}
            <div className="bg-white p-3 ps-4 rounded-3 border mb-3">
              {mode == "changePassword" ? (
                <>
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
                </>
              ) : (
                <>
                  <h5 className="fw-semibold mb-3">Account Security</h5>
                  <button
                    type="button"
                    className="btn d-flex gap-2 align-content-center ps-0"
                    onClick={() => setMode("changePassword")}
                  >
                    <LockIcon /> Change Password
                  </button>
                  <DemoTooltip
                    icon={GppGoodIcon}
                    label="Two factor authentication"
                  />
                </>
              )}
            </div>
            {/* Payment method */}
            <div className="bg-white p-3 ps-4 rounded-3 border mb-3">
              <h5 className="fw-semibold mb-3">Payment methods</h5>
              <DemoTooltip
                icon={CreditCardIcon}
                label="Manage payments"
                className="text-primary"
              />
            </div>
            <div className="d-md-flex gap-3 text-center">
              {/* Orders */}
              <Link
                to="/dashboard"
                className="btn btn-primary d-flex gap-2 justify-content-center align-content-center p-2 px-3  fs-5 fw-semibold w-100 mb-3 mb-md-0"
              >
                <ShoppingBagIcon fontSize="large" />
                <span style={{ lineHeight: "38px" }}>Orders</span>
              </Link>
              {/* Delete account */}
              <button className="btn btn-danger d-flex gap-2 justify-content-center align-content-center p-2 px-3  fs-5 fw-semibold w-100 text-nowrap">
                <DeleteIcon fontSize="large" />
                <span style={{ lineHeight: "38px" }}>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
