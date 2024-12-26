import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { newModeratorInformation } from '../controllers/moderatorController.js';

const router = express.Router();

router.post("/new-moderator-information", verifyToken, newModeratorInformation);

export default router;