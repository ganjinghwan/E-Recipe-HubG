import Recipe from '../models/Recipe.js';
import mongoose from 'mongoose';

export const getRecipes = async (req, res) => {
    try{
        const recipe = await Recipe.find();
        res.status(200).json({ success: true, data: recipe });
    }catch(error){
        console.log("Failed to fetch recipes", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const createRecipe = async (req, res) => {
    const recipe = req.body;

    if(!recipe.name || !recipe.ingredients || !recipe.instructions || !recipe.image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

   const newRecipe = new Recipe(recipe);

   try{
       await newRecipe.save();
       res.status(201).json({ success: true, message: 'Recipe created successfully', data: newRecipe });
   }catch(error){
       console.error("Failed to create recipe", error.message);
       res.status(500).json({ success: false, message: 'Server Error' });
    
    }
}

export const updateRecipe = async (req, res) => {
    const {id} = req.params;
    const recipe = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }

    try{
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, recipe,{new: true});
        res.status(200).json({ success: true, message: 'Recipe updated successfully', data: recipe });    
    }catch(error){
        console.log("Failed to update recipe", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


export const deleteRecipe =async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }

    try{
        await Recipe.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
    }catch(error){
        console.log("Failed to delete recipe", error.message);
        console.error("Failed to delete recipe", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}