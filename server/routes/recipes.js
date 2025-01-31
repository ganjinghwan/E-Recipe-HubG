/* Recipe CRUD */
import express from 'express';
import { getCookRecipes, createRecipe, updateRecipe, deleteRecipe, getAllRecipes,addComment, addReport, addReportUser,
         addRate, getRecipeById, toggleFavorite, getEventRecipes, getRecipesWithoutEvent } from '../controllers/recipeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/',verifyToken, getCookRecipes);
router.get('/all',verifyToken, getAllRecipes);
router.post('/', verifyToken, createRecipe);
router.put('/:id',verifyToken, updateRecipe);
router.delete('/:id',verifyToken, deleteRecipe);
router.post('/:id/comment',verifyToken, addComment);
router.post('/:id/rate',verifyToken, addRate);
router.post('/togglefav', verifyToken, toggleFavorite); 
router.post('/report',verifyToken, addReport);
router.post('/reportUser',verifyToken, addReportUser);

router.get('/:id',verifyToken, getRecipeById);
router.get('/:id/eventRecipes',verifyToken, getEventRecipes);
router.get('/allWithoutEvent',verifyToken, getRecipesWithoutEvent); 

export default router;