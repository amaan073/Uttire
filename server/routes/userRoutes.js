import express from 'express';
import { registerUser, loginUser, getMe, refreshAccessToken, logoutUser } from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middlewares/validatorMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);

router.post('/login', validateLogin, loginUser);

router.get("/me", protect, getMe);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logoutUser);

export default router;
