// formValidators.js
import { toast } from "react-toastify";
import {
  isValidEmail,
  isValidPassword,
  isValidLoginPassword,
  isValidName,
} from "./validators";

// ✅ Login form validation
export const validateLoginForm = (formData) => {
  if (!isValidEmail(formData.email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }

  if (!isValidLoginPassword(formData.password)) {
    toast.error("Password must be at least 6 characters.");
    return false;
  }

  return true; // ✅ valid
};

// ✅ Signup form validation
export const validateSignupForm = (formData) => {
  if (!isValidName(formData.name)) {
    toast.error("Please enter a valid name (only letters, at least 2 characters).");
    return false;
  }

  if (!isValidEmail(formData.email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }

  if (!isValidPassword(formData.password)) {
    toast.error("Password must be at least 6 characters, contain letters and numbers, and no spaces.");
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match.");
    return false;
  }

  return true; // ✅ valid
};
