/* Recipe CRUD */
import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/',verifyToken, getRecipes);
router.post('/', verifyToken, createRecipe);
router.put('/:id',verifyToken, updateRecipe);
router.delete('/:id',verifyToken, deleteRecipe);

export default router;