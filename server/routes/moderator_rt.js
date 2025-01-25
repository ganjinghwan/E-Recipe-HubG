import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { newModeratorInformation, addDeletedRecipeHistory, getDeletedRecipeHistory,
    deleteImproperUser, addDeletedUserHistory, getDeletedUserHistory
 } from '../controllers/moderatorController.js';

const router = express.Router();

router.post("/new-moderator-information", verifyToken, newModeratorInformation);
router.post("/add-deleted-recipe-history", verifyToken, addDeletedRecipeHistory);
router.get("/get-deleted-recipe-history", verifyToken, getDeletedRecipeHistory);
router.delete("/:id/delete-improper-user", verifyToken, deleteImproperUser);
router.post("/add-deleted-user-history", verifyToken, addDeletedUserHistory);
router.get("/get-deleted-user-history", verifyToken, getDeletedUserHistory);
export default router;