import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { newModeratorInformation, addDeletedRecipeHistory, getDeletedRecipeHistory } from '../controllers/moderatorController.js';

const router = express.Router();

router.post("/new-moderator-information", verifyToken, newModeratorInformation);
router.post("/add-deleted-recipe-history", verifyToken, addDeletedRecipeHistory);
router.get("/get-deleted-recipe-history", verifyToken, getDeletedRecipeHistory);

export default router;