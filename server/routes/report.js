/* Report Management */
import express from 'express';
import { fetchAllReports } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/allReports',verifyToken, fetchAllReports);

export default router;