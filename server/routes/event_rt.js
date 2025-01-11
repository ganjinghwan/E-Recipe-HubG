import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, getAllEvents, getEventOrganizerCreatedEvents, updateEvents } from '../controllers/eventController.js';

const router = express.Router();

router.get("/get-EventOrgRelated-events", verifyToken, getEventOrganizerCreatedEvents);
router.get("/get-all-events", verifyToken, getAllEvents);
router.post("/new-event", verifyToken, createEvent);
router.post("/update-event/:specificEventURL", verifyToken, updateEvents);
router.delete("/delete-event/:specificEventURL", verifyToken, deleteEvent);

export default router;