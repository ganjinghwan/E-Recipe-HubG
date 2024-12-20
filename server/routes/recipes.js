/* Recipe CRUD */
import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, getAllRecipes,addComment, addRate, getRecipeById } from '../controllers/recipeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/',verifyToken, getRecipes);
router.get('/all',verifyToken, getAllRecipes);
router.post('/', verifyToken, createRecipe);
router.put('/:id',verifyToken, updateRecipe);
router.delete('/:id',verifyToken, deleteRecipe);
router.post('/:id/comment',verifyToken, addComment);
router.post('/:id/rate',verifyToken, addRate);
router.get('/:id',verifyToken, getRecipeById);

export default router;