import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import privateAxios from "../../api/privateAxios";
import sessionAxios from "../../api/sessionAxios";

import ProfileDetail from "../../components/ProfileDetail";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import { Modal, Button, Spinner } from "react-bootstrap";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { toast } from "react-toastify";
import TwoFactorDemo from "../../components/TwoFactorDemo";
import PaymentMethodsCard from "../../components/PaymentMethodsCard";

import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DeleteIcon from "@mui/icons-material/Delete";

const Profile = () => {
  const [mode, setMode] = useState("view"); //view, editProfile or changePassword
  const [profile, setProfile] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [backendError, setBackendError] = useState("");
  //after successful deletion message show in modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await privateAxios.get("/users/profile");
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (data, setErrors) => {
    try {
      const response = await privateAxios.post("/users/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setMode("view");
        // Optional refresh (won’t break flow if it fails) (THIS IS TO CLEAR ALL OTHER PEOPLES SESSION)
        try {
          await sessionAxios.post("/users/refresh", {});
        } catch (refreshErr) {
          console.warn(
            "Refresh failed, but password change was successful:",
            refreshErr.message
          );
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password.";

      if (message.toLowerCase().includes("current password is incorrect")) {
        setErrors({ currentPassword: "Current password is incorrect" });
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setBackendError(""); // reset previous error
      const res = await privateAxios.delete("/users/profile", {
        data: { password }, // send password in request body
      });
      setModalShow(false);

      // Show success modal
      setSuccessMessage(res.data.message);
      setShowSuccessModal(true);

      //redirect after a delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      // Only show "Incorrect password" in modal
      if (err.response?.status === 401) {
        setBackendError("Incorrect password");
      } else {
        console.log(err);
        setBackendError("Something went wrong, try again.");
      }
    }
  };

  if (loading)
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
    <>
      <div
        className="container-fluid d-flex justify-content-center py-5 align-items-center"
        style={{
          maxWidth: "1600px",
          minHeight: "calc(var(--safe-height) - 83px)",
        }}
      >
        <div className="d-md-flex gap-3 mb-md-5 align-items-start">
          {/* content left */}
          <div>
            <ProfileDetail
              mode={mode}
              setMode={setMode}
              profile={profile}
              setProfile={setProfile}
            />
            {mode == "view" && (
              <div>
                {/* Orders */}
                <div className="my-3">
                  <Link
                    to="/dashboard"
                    className="btn btn-primary shadow-sm d-flex gap-2 justify-content-center align-content-center p-2 px-3  fs-5 fw-semibold w-100 mb-3 mb-md-0"
                  >
                    <ShoppingBagIcon fontSize="large" />
                    <span style={{ lineHeight: "38px" }}>Orders</span>
                  </Link>
                </div>
                {/* Delete Account Button */}
                <div>
                  <button
                    className="btn btn-danger shadow-sm d-flex gap-2 justify-content-center align-content-center p-2 px-3 fs-5 fw-semibold w-100 text-nowrap mb-3 mb-md-0"
                    onClick={() => setModalShow(true)}
                  >
                    <DeleteIcon fontSize="large" />
                    <span style={{ lineHeight: "38px" }}>Delete Account</span>
                  </button>
                  {/* Delete Account Modal */}
                  <DeleteAccountModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    onConfirm={handleDeleteAccount} // Pass API function as callback
                    backendError={backendError} // passed to modal
                  />
                  {/* after successful deletion modal  */}
                  <Modal
                    show={showSuccessModal}
                    onHide={() => setShowSuccessModal(false)}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Account Deleted</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p className="text-success fw-bold">{successMessage}</p>
                      <p>You’ll be redirected to the homepage shortly.</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="success"
                        onClick={() => {
                          setShowSuccessModal(false);
                          window.location.href = "/";
                        }}
                      >
                        Okay
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            )}
          </div>

          {/*content right */}
          <div style={{ maxWidth: "460px" }}>
            {/* Account security */}
            <div className="bg-white p-4 rounded-3 mb-3 shadow-sm border">
              {mode == "changePassword" ? (
                <>
                  <ChangePasswordForm
                    onCancel={() => setMode("view")}
                    onSubmit={(data, setErrors) => {
                      handlePasswordChange(data, setErrors);
                    }}
                  />
                </>
              ) : (
                <>
                  <h5 className="mb-3 fw-semibold">Account Security</h5>
                  <button
                    type="button"
                    className="btn d-flex gap-2 align-content-center ps-0"
                    onClick={() => setMode("changePassword")}
                  >
                    <LockIcon /> Change Password
                  </button>
                  <div className="d-flex align-items-center">
                    <TwoFactorDemo toggleValue={profile.twoFactorAuth} />
                  </div>
                </>
              )}
            </div>
            {/* Payment method */}
            <PaymentMethodsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
