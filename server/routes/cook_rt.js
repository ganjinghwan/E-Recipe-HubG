import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createCookInformation } from '../controllers/cookController.js';

const router = express.Router();

router.post("/create-cook-information", verifyToken, createCookInformation);

export default router;