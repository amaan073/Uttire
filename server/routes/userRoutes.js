import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middlewares/validatorMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);

router.post('/login', validateLogin, loginUser);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logoutUser);

export default router;
