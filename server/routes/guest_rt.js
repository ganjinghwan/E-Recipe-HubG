import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createGuestInformation } from '../controllers/guestController.js';

const router = express.Router();

router.post("/create-guest-information", verifyToken, createGuestInformation);

export default router;