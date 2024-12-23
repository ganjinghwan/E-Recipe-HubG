import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCookInformation, updateCookInformation, getFavoriteRecipes } from '../controllers/cookController.js';

const router = express.Router();

router.get("/get-cook-information", verifyToken, getCookInformation)
router.post("/update-cook-information", verifyToken, updateCookInformation);
router.get('/favorites', verifyToken, getFavoriteRecipes);

export default router;