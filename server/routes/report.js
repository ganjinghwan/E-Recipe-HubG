/* Report Management */
import express from 'express';
import { fetchAllReports, deleteReport } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/allReports',verifyToken, fetchAllReports);
router.delete('/:id',verifyToken, deleteReport);

export default router;