import { useState } from "react";
import { isValidPassword } from "../utils/validators";
import useOnlineStatus from "../hooks/useOnlineStatus";

/* eslint-disable react/prop-types */
export default function ChangePasswordForm({ onCancel, onSubmit }) {
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //frontend validation
  const validate = () => {
    let newErrors = {};

    // Required fields
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
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

    // Confirm password match
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Password strength → use your helper here ✅
    if (formData.newPassword && !isValidPassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 6 characters, contain letters, numbers, and no spaces";
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
    <form onSubmit={handleSubmit}>
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
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
        {errors.currentPassword && (
          <div className="font-italic text-danger">
            {"*" + errors.currentPassword}
          </div>
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
          className="form-control"
          id="new-password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        {errors.newPassword && (
          <div className="font-italic text-danger">
            {"*" + errors.newPassword}
          </div>
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
          className="form-control"
          id="confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <div className="font-italic text-danger">
            {"*" + errors.confirmPassword}
          </div>
        )}
      </div>

      <div className="form-group d-flex gap-2 w-100 mt-4">
        <button
          type="button"
          className="btn btn-outline-danger w-100"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary w-100 text-nowrap"
          disabled={!isOnline}
        >
          Change password
        </button>
      </div>
    </form>
  );
}
