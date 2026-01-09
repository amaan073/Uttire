import { useState } from "react";
import { isValidPassword } from "../utils/validators";
import useOnlineStatus from "../hooks/useOnlineStatus";
import { Spinner } from "react-bootstrap";
import OfflineNote from "./ui/OfflineNote";

/* eslint-disable react/prop-types */
export default function ChangePasswordForm({ onCancel, onSubmit, loading }) {
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for this field
  };

  //frontend validation
  const validate = () => {
    let newErrors = {};

    // Required fields
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
    }

    // Prevent reusing old password
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password cannot be the same as current password";
    }

    // Password strength
    if (formData.newPassword && !isValidPassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 6 characters, contain letters, numbers, and no spaces";
    }

    // Confirm password match
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors); //sets error when there is error and if there are none then the newError has empty array9(original value at top of function) automatically clearing old errors under form input fields
    return Object.keys(newErrors).length === 0; //if there is no error in newError var, then this return true and program move on
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if invalid

    if (onSubmit) {
      onSubmit(formData, setErrors); // pass values and teh seterror back to parent
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={loading}>
        <div className="form-group mb-3">
          <label
            htmlFor="current-password"
            className="fw-semibold mb-1 text-secondary"
          >
            Current password
          </label>
          <input
            type="password"
            className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
            id="current-password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.currentPassword && (
            <div className="invalid-feedback">{errors.currentPassword}</div>
          )}
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
            className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
            id="new-password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.newPassword && (
            <div className="invalid-feedback">{errors.newPassword}</div>
          )}
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
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>

        <div className="form-group d-flex gap-2 w-100 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-100 text-nowrap"
            disabled={!isOnline || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Changing
              </>
            ) : (
              "Change password"
            )}
          </button>
        </div>
        <OfflineNote isOnline={isOnline} />
      </fieldset>
    </form>
  );
}
