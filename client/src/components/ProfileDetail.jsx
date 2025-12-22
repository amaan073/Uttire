import EditIcon from "@mui/icons-material/Edit";
import UserAvatar from "../components/ui/UserAvatar";
import { useContext, useEffect, useState } from "react";
import privateAxios from "../api/privateAxios";
import { toast } from "react-toastify";
import { isValidName, isValidPhone } from "../utils/validators";
import AuthContext from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar } from "@mui/material";
import useOnlineStatus from "../hooks/useOnlineStatus";

/* eslint-disable react/prop-types */
const ProfileDetail = ({ mode, setMode, profile, setProfile }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const isOnline = useOnlineStatus();
  const [selectedFile, setSelectedFile] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null); // object URL for preview
  const [loading, setLoading] = useState(false); // disable inputs while saving
  const [isChanged, setIsChanged] = useState(false); //to check user has made any changes yet
  const [removeImage, setRemoveImage] = useState(false); // flag to remove

  const { setUser } = useContext(AuthContext);

  // Sync form with profile when entering edit mode
  useEffect(() => {
    if (mode === "edit" && profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
      setRemoveImage(false);
    }
  }, [mode, profile]);

  // Create/Revoke preview URL when selectedFile changes
  useEffect(() => {
    if (!selectedFile) {
      // nothing selected
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    //clean up after unmount
    return () => {
      // revoke when selectedFile changes or component unmounts
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  //to track if there is a change in form inputs and only allow to save changes when there is a change
  useEffect(() => {
    const normalizedName = formData.name.trim().replace(/\s+/g, " ");
    const hasNameChanged = normalizedName !== profile.name;
    const hasPhoneChanged = formData.phone !== (profile.phone || "");
    const hasFileChanged = selectedFile !== null;
    const hasImageRemoved = removeImage === true;

    const changed =
      hasNameChanged || hasPhoneChanged || hasFileChanged || hasImageRemoved;

    setIsChanged(changed);
  }, [formData, profile, selectedFile, removeImage]);

  // file input change handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image.");
      e.target.value = ""; // reset file input
      return;
    }
    if (file.size > maxSize) {
      toast.error("Please select an image smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    // ✅ Reset remove flag because a new image is being selected
    setRemoveImage(false);

    setSelectedFile(file);
    e.target.value = ""; // optional UX improvement
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //remove chosen file before saving
  const handleRemoveSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Cancel editing: cleanup preview and return to view mode
  const handleCancel = () => {
    handleRemoveSelectedFile();
    setRemoveImage(false); // reset flag
    setMode("view");
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveImage(true); // mark image for removal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //validation
    if (!isValidName(formData.name)) {
      toast.error(
        "Please enter a valid name (only letters, at least 2 characters)."
      );
      setLoading(false);
      return false;
    }
    // phone input is optional and should only validate when the input is not empty
    if (formData.phone.trim() !== "" && !isValidPhone(formData.phone)) {
      toast.error("Please enter a valid Phone no.");
      setLoading(false);
      return false;
    }

    try {
      //new form data creation with enctype="multipart/form-data" to allow holding raw binary(image) data
      const fd = new FormData();
      //append to add these data to the special object
      fd.append("name", formData.name.trim().replace(/\s+/g, " ")); //removing all extra whitespaces
      fd.append("phone", formData.phone);

      if (selectedFile) {
        fd.append("profileImage", selectedFile);
      }

      // profile image flag
      if (removeImage) fd.append("removeImage", true);

      const { data } = await privateAxios.put("/users/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //update local state with new data
      setProfile(data);
      // setting user globally (authContext)
      setUser({
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
      });
      toast.success("Profile updated!");
      // cleanup preview object url (server returns the real image URL)
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setMode("view");
    } catch (error) {
      console.log(error);
      if (error.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (error.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="text-center bg-white p-3 ps-4 rounded-3 mx-auto mx-md-0 mb-3 mb-md-0 shadow-sm py-4 w-100 border"
      style={{ minWidth: "335px", maxWidth: "380px", minHeight: "393px" }}
    >
      {(mode == "view" || mode == "changePassword") && (
        <>
          <div className="d-flex justify-content-center mb-3 mt-2">
            <div className="mb-1" style={{ height: "162px", width: "162px" }}>
              <UserAvatar
                user={profile}
                sx={{ fontSize: "50px", backgroundColor: "#d32f2f" }}
              />
            </div>
          </div>
          <div>
            <h5 className="m-0">{profile.name}</h5>

            <p
              className="m-0 my-1 text-muted"
              style={{ wordBreak: "break-all" }}
            >
              {profile.email}
            </p>

            <p className="m-0">
              <strong>Phone:</strong>{" "}
              {profile.phone ? (
                profile.phone
              ) : (
                <span className="text-muted">(Not added)</span>
              )}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3 px-5 py-2"
            onClick={() => setMode("edit")}
            disabled={!isOnline}
          >
            Edit Profile
          </button>
        </>
      )}

      {/* Edit profile mode */}
      {mode == "edit" && (
        <>
          <form className="text-start" onSubmit={handleSubmit}>
            <div className="mt-2 mb-3 position-relative">
              <div className="d-flex justify-content-center">
                <div
                  className="mb-1"
                  style={{ height: "162px", width: "162px" }}
                >
                  {/* show preview if user selected a file, otherwise show existing avatar */}
                  {!removeImage ? (
                    previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-100 h-100 object-fit-cover rounded-circle"
                      />
                    ) : (
                      <UserAvatar
                        user={profile}
                        sx={{ fontSize: "50px", backgroundColor: "#d32f2f" }}
                      />
                    )
                  ) : (
                    <Avatar
                      style={{ width: "100%", height: "100%" }}
                      sx={{ fontSize: "50px", backgroundColor: "#d32f2f" }}
                    >
                      {profile?.name ? profile.name[0].toUpperCase() : ""}
                    </Avatar>
                  )}
                </div>
                {/* show remove button only if there’s a current or preview image */}
                {(previewUrl || profile?.profileImage) && !removeImage && (
                  <button
                    type="button"
                    title="Remove profile picture"
                    onClick={handleRemoveImage}
                    className="position-absolute bg-light border-0 rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      top: "125px",
                      right: "77px",
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </button>
                )}
              </div>

              {/* label acting as a button for the hidden file input */}
              <label
                htmlFor="profileImage"
                className="edit-btn d-flex justify-content-center align-items-center rounded-circle bg-light border"
                title="Edit profile picture"
              >
                <EditIcon />
              </label>
              {/* Hidden file input */}
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
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
                value={formData.name ?? ""}
                onChange={handleChange}
                disabled={loading}
                required
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
                disabled
                value={formData.email ?? ""}
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
                placeholder="i.e. +91 9876543210"
                pattern="^\+?[0-9]{10,15}$"
                maxLength="15"
                className="form-control"
                id="phone-no-input"
                name="phone"
                value={formData.phone ?? ""}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div
              className="form-group d-flex gap-2 w-100 mt-4"
              style={{ marginBottom: "6px" }}
            >
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={!isChanged || loading || !isOnline} // disables until form changes or the profile is loading
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileDetail;
