import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, getAllCook  } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/fetch-cook", getAllCook);

export default router;