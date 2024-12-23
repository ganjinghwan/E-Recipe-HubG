import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createCookInformation, getFavoriteRecipes } from '../controllers/cookController.js';

const router = express.Router();

router.post("/create-cook-information", verifyToken, createCookInformation);
router.get('/favorites', verifyToken, getFavoriteRecipes);  

export default router;