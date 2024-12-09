import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createOrgnizationInformation } from '../controllers/eventOrgController.js';

const router = express.Router();

router.post("/create-EventOrg-information", verifyToken, createOrgnizationInformation);

export default router;