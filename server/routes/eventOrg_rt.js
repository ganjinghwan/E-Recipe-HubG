import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getEventOrganizerInformation, updateEventOrganizerInformation, getEOFavoriteRecipes, newEventOrganizerInformation } from '../controllers/eventOrgController.js';

const router = express.Router();

router.get("/get-EventOrg-information", verifyToken, getEventOrganizerInformation);
router.post("/new-EventOrg-information", verifyToken, newEventOrganizerInformation);
router.post("/update-EventOrg-information", verifyToken, updateEventOrganizerInformation);
router.get('/EOfavorites', verifyToken, getEOFavoriteRecipes);

export default router;