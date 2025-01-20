import express from 'express';
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, 
    checkAuth, getAllCook, updateProfile, verifyUpdate, deleteIncompleteUser, getUserList_CGE, 
    deleteUser, uploadProfilePicture, getDailyLogins, getUserInbox, addMessageToInbox  } from '../controllers/authController.js';
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
router.put("/upload-profile-picture", verifyToken, uploadProfilePicture);
router.post("/update-profile", verifyToken, updateProfile);
router.post("/verify-update", verifyUpdate);
router.delete("/delete-incomplete-user", verifyToken, deleteIncompleteUser);
router.delete("/delete-account", verifyToken, deleteUser);
router.get("/get-CGE-users", verifyToken, getUserList_CGE);
router.get("/daily-logins", verifyToken, getDailyLogins);
router.get("/get-inbox", verifyToken, getUserInbox);
router.post("/add-inbox-message", verifyToken, addMessageToInbox);

export default router;