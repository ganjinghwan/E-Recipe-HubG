/* Recipe CRUD */
import express from 'express';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/', getRecipes);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;