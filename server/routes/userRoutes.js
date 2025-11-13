import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
  getProfile,
  updateProfile,
  deleteUser,
  changePassword,
  toggleTwoFactor,
  manageAddress,
} from "../controllers/userController.js";

import multer from "multer";
import path from "path";

import {
  validateRegister,
  validateLogin,
} from "../middlewares/validatorMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and WEBP files are allowed"));
  },
});

// Auth
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

// User Info
router.get("/me", protect, getMe);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profileImage"), updateProfile); //with multer middleware expecting one file in the form field "profileImage" to upload it so the controller can use it in req.file
router.delete("/profile", protect, deleteUser);
router.post("/change-password", protect, changePassword);
router.patch("/twofactor", protect, toggleTwoFactor); // dummy feature for show

// manage addresses (3 max)
router.put("/address", protect, manageAddress);

export default router;
