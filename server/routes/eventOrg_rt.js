import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getEventOrganizerInformation, updateEventOrganizerInformation } from '../controllers/eventOrgController.js';

const router = express.Router();

router.get("/get-EventOrg-information", verifyToken, getEventOrganizerInformation);
router.post("/update-EventOrg-information", verifyToken, updateEventOrganizerInformation);

export default router;