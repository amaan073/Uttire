import express from 'express';
import { registerUser, loginUser, getMe, refreshAccessToken, logoutUser, getProfile, updateProfile } from '../controllers/userController.js';
import multer from "multer";
import path from "path";

import { validateRegister, validateLogin } from '../middlewares/validatorMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Storage config (uploads/profile-pics/)
const storage = multer.diskStorage({
  //destination → tells multer where to save the uploaded files. In this case: uploads/profile-pics/.
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pics/");
  },
  //filename → tells multer what name to use when saving the file
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); //extracts the extension from filename
    cb(null, req.user.id + "-avatar" + ext); // e.g. 12345323243232-avatar.png
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png allowed"));
    }
  },
});


// Auth
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

// User Info
router.get("/me", protect, getMe);
router.get("/profile", protect, getProfile);      
router.put("/profile", protect, upload.single("profileImage"), updateProfile); //with multer middleware expecting one file in the form field "profileImage" to upload it so the controller can use it in req.file
// router.delete("/profile", protect, deleteProfile);

// Addresses
// router.post("/address", protect, addAddress);         
// router.put("/address/:id", protect, updateAddress);   
// router.delete("/address/:id", protect, deleteAddress);

export default router;
