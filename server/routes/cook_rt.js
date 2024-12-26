import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCookInformation, updateCookInformation, getFavoriteRecipes, newCookInformation } from '../controllers/cookController.js';

const router = express.Router();

router.get("/get-cook-information", verifyToken, getCookInformation)
router.post("/new-cook-information", verifyToken, newCookInformation);
router.post("/update-cook-information", verifyToken, updateCookInformation);
router.get('/favorites', verifyToken, getFavoriteRecipes);

export default router;