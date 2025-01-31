import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { newModeratorInformation, addDeletedRecipeHistory, getDeletedRecipeHistory,
    deleteImproperUser, addDeletedUserHistory, getDeletedUserHistory, addDeletedEventHistory,
    getDeletedEventHistory, deleteEvent, addPassedReport, getReportHistory, addWarning,
    getWarningHistory,
 } from '../controllers/moderatorController.js';

const router = express.Router();

router.post("/new-moderator-information", verifyToken, newModeratorInformation);
router.post("/add-deleted-recipe-history", verifyToken, addDeletedRecipeHistory);
router.get("/get-deleted-recipe-history", verifyToken, getDeletedRecipeHistory);
router.delete("/:id/delete-improper-user", verifyToken, deleteImproperUser);
router.post("/add-deleted-user-history", verifyToken, addDeletedUserHistory);
router.get("/get-deleted-user-history", verifyToken, getDeletedUserHistory);
router.post("/add-deleted-event-history", verifyToken, addDeletedEventHistory);
router.get("/get-deleted-event-history", verifyToken, getDeletedEventHistory);
router.delete("/:id/delete-event", verifyToken, deleteEvent);
router.post("/add-passed-report", verifyToken, addPassedReport);
router.get("/get-report-history", verifyToken, getReportHistory);
router.post("/add-warning", verifyToken, addWarning);
router.get("/get-warning-history", verifyToken, getWarningHistory);

export default router;