import express from 'express';
import { registerUser, loginUser, getMe, refreshAccessToken, logoutUser } from '../controllers/userController.js';

import { validateRegister, validateLogin } from '../middlewares/validatorMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

// User Info
router.get("/me", protect, getMe);
// router.get("/profile", protect, getProfile);      
// router.put("/profile", protect, updateProfile); 
// router.put("/profile", protect, deleteProfile);

// Addresses
// router.post("/address", protect, addAddress);         
// router.put("/address/:id", protect, updateAddress);   
// router.delete("/address/:id", protect, deleteAddress);

export default router;
