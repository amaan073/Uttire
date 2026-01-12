import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import privateAxios from "../../api/privateAxios";
import sessionAxios from "../../api/sessionAxios";

import ProfileDetail from "../../components/ProfileDetail";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import ManageAddressModal from "../../components/ManageAddressModal";
import { Modal, Button } from "react-bootstrap";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { toast } from "react-toastify";
import TwoFactorDemo from "../../components/TwoFactorDemo";
import PaymentMethodsCard from "../../components/PaymentMethodsCard";

import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DeleteIcon from "@mui/icons-material/Delete";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import LoadingScreen from "../../components/ui/LoadingScreen";
import ErrorState from "../../components/ui/ErrorState";

const Profile = () => {
  const isOnline = useOnlineStatus();
  const [mode, setMode] = useState("view"); //view, editProfile or changePassword
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [backendError, setBackendError] = useState("");
  //after successful deletion message show in modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await privateAxios.get("/users/profile");
      setProfile(data);
      setFetchError("");
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error?.code === "OFFLINE_ERROR" || error?.code === "NETWORK_ERROR") {
        setFetchError(
          "Couldn't reach server. Check your connection and try again."
        );
        return;
      } else {
        setFetchError("Failed to fetch profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordChange = async (data, setErrors) => {
    try {
      setIsChangingPassword(true);

      const response = await privateAxios.post("/users/change-password", {
        currentPassword: data?.currentPassword,
        newPassword: data?.newPassword,
      });

      if (response?.status === 200) {
        toast.success("Password changed successfully!");
        setMode("view");
        // Optional refresh (won’t break flow if it fails) (THIS IS TO CLEAR ALL OTHER PEOPLES SESSION)
        try {
          await sessionAxios.post("/users/refresh", {});
        } catch (refreshErr) {
          console.warn(
            "Refresh failed, but password change was successful:",
            refreshErr?.message
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (error?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else if (error?.response?.data?.code === "INCORRECT_CURRENT_PASSWORD") {
        setErrors({ currentPassword: "Current password is incorrect" });
      } else {
        toast.error("Failed to change passoword");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setBackendError(""); // reset previous error
      setIsDeleting(true);

      const res = await privateAxios.delete("/users/profile", {
        data: { password }, // send password in request body
      });
      setModalShow(false);

      // Show success modal
      setSuccessMessage(res?.data?.message);
      setShowSuccessModal(true);

      //redirect after a delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      }
      // Only show "Incorrect password" in modal
      else if (err?.response?.status === 401) {
        setBackendError("Incorrect password");
      } else {
        toast.error("Something went wrong, try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (fetchError)
    return <ErrorState message={fetchError} retry={() => fetchProfile()} />;
  // malformed profile guard
  if (!loading && !fetchError && !profile) {
    return <ErrorState message="Profile not available" retry={fetchProfile} />;
  }

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
            {mode != "edit" && (
              <div>
                {/* Orders */}
                <div className="my-3">
                  <Link
                    to="/orders"
                    className="btn btn-primary rounded-3 shadow-sm d-flex gap-2 justify-content-center align-content-center p-2 px-3  fs-5 fw-semibold w-100 mb-3 mb-md-0"
                  >
                    <ShoppingBagIcon fontSize="large" />
                    <span style={{ lineHeight: "38px" }}>Orders</span>
                  </Link>
                </div>
                {/* Delete Account Button */}
                <div>
                  <button
                    className="btn btn-danger rounded-3 shadow-sm d-flex gap-2 justify-content-center align-content-center p-2 px-3 fs-5 fw-semibold w-100 text-nowrap mb-3 mb-md-0"
                    onClick={() => setModalShow(true)}
                    disabled={!isOnline}
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
                    loading={isDeleting}
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
          <div style={{ maxWidth: "450px" }}>
            {/* Account security */}
            <div className="bg-white p-4 rounded-3 mb-3 shadow-sm border">
              {mode == "changePassword" ? (
                <>
                  <ChangePasswordForm
                    onCancel={() => setMode("view")}
                    onSubmit={(data, setErrors) => {
                      handlePasswordChange(data, setErrors);
                    }}
                    loading={isChangingPassword}
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
                  <div className="d-flex align-items-center w-100">
                    <TwoFactorDemo toggleValue={profile?.twoFactorAuth} />
                  </div>
                </>
              )}
            </div>
            {/* Addresses and Payment method */}
            <div>
              {/* Address Section */}
              <div className="addresses flex-grow-1 p-4 border rounded-3 shadow-sm bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-semibold">Address</h5>{" "}
                  <button
                    className="btn btn-outline-primary btn-sm rounded-3 px-3"
                    disabled={!isOnline}
                    onClick={() => {
                      setShowAddressModal(true);
                      setMode("view");
                    }}
                  >
                    Manage Address
                  </button>
                </div>

                {profile?.address ? (
                  <div
                    className="border p-3 rounded-3 bg-light"
                    style={{ height: "114px", overflowY: "auto" }}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge bg-primary rounded-pill px-3 py-1 text-uppercase">
                        {profile?.address?.type || "Address"}
                      </span>
                    </div>
                    <p
                      className="mb-0 text-muted"
                      style={{ lineHeight: "1.4rem" }}
                    >
                      {`${profile?.address?.street}, ${profile?.address?.city}, ${profile?.address?.state} - ${profile?.address?.zip}, ${profile?.address?.country}`}
                    </p>
                  </div>
                ) : (
                  <div
                    className="border p-3 rounded-3 bg-light d-flex flex-column justify-content-center align-items-center text-muted text-center"
                    style={{ height: "114px" }}
                  >
                    <i className="bi bi-geo-alt fs-3 mb-2"></i>
                    <small>No address set yet</small>
                    <small className="text-muted mt-1">
                      Use <strong>&quot;Manage Address&quot;</strong> to add
                      one.
                    </small>
                  </div>
                )}
              </div>

              {/* Payment Methods Section */}
              <div className="mt-3">
                <PaymentMethodsCard />
              </div>

              <ManageAddressModal
                show={showAddressModal}
                onHide={() => setShowAddressModal(false)}
                address={profile?.address || null} //
                setProfile={setProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
