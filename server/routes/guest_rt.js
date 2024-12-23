import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getGFavoriteRecipes } from '../controllers/guestController.js';

const router = express.Router();

router.get('/Gfavorites', verifyToken, getGFavoriteRecipes);

export default router;