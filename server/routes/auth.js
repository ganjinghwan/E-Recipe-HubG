import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, getAllCook, updateProfile, verifyUpdate  } from '../controllers/authController.js';
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
router.post("/update-profile", verifyToken, updateProfile);
router.post("/verify-update", verifyUpdate);

export default router;