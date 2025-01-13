import Recipe from '../models/Recipe.js';
import {Cook} from '../models/Cook.js';
import { EventOrganizer } from '../models/EventOrganizer.js';
import { Guest } from '../models/Guest.js';
import { Report } from '../models/Report.js';
import mongoose from 'mongoose';
import { isValidURL } from "../utils/validation.js"; // A utility to validate URLs
import cloudinary from "../cloudinary/cloudinary.js";


export const getRecipes = async (req, res) => {
    try{
        const userId = req.userId;
        const recipe = await Recipe.find({ user_id: userId });
        res.status(200).json({ success: true, data: recipe });
    }catch(error){
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getRecipeById = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }
    try{
        const recipe = await Recipe.findById(id);
        if(!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }
        res.status(200).json({ success: true, data: recipe });
    }catch(error){
        console.error("Error fetching recipe by ID:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getAllRecipes = async (req, res) => {
    try{
        const recipe = await Recipe.find({ });
        res.status(200).json({ success: true, data: recipe });
    }catch(error){
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


export const createRecipe = async (req, res) => {
    const recipe = req.body;
    const userId = req.userId; 
    if (
        !recipe.title ||
        !recipe.ingredients ||
        !recipe.instructions ||
        !recipe.prepTime ||
        !recipe.category ||
        !recipe.image
    ) {
        return res.status(409).json({ success: false, message: "All fields are required" });
    }

    try {
        let imageUrl = recipe.image || null;

        if (recipe.image) {
            if (!isValidURL(recipe.image)) {
                // If it's not a valid URL, assume it's a file and upload to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(recipe.image, {
                    folder: "recipes",
                });
                imageUrl = uploadResponse.secure_url;
            } else {
                // If it's a valid URL, use it directly
                imageUrl = recipe.image;
            }
        }

        const newRecipe = new Recipe({
            ...recipe, // Spread existing recipe data
            user_id: userId, // Add user ID to recipe
            image: imageUrl, // Add final image URL
        });

        await newRecipe.save();
        res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            data: newRecipe,
        });
    } catch (error) {
        console.error("Failed to create recipe:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

export const updateRecipe = async (req, res) => {
    const { id } = req.params; // Recipe ID from the request parameters
    const recipe = req.body; // Updated recipe data from the request body

    // Validate recipe ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Recipe ID" });
    }

    try {
        let imageUrl = recipe.image || null;

        // Check if an image is provided and handle accordingly
        if (recipe.image) {
            if (!isValidURL(recipe.image)) {
                // If not a valid URL, upload to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(recipe.image, {
                    folder: "recipes",
                });
                imageUrl = uploadResponse.secure_url;
            } else {
                // If it's a valid URL, use it directly
                imageUrl = recipe.image;
            }
        }

        // Update the recipe with the verified image URL
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { ...recipe, image: imageUrl }, // Include the processed image URL
            { new: true } // Return the updated document
        );

        if (!updatedRecipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Recipe updated successfully",
            data: updatedRecipe,
        });
    } catch (error) {
        console.error("Failed to update recipe:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


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


export const addComment = async (req, res) => {
    const {id} = req.params;
    const {user, text} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }

    try{
        const recipe = await Recipe.findById(id);

        if(!recipe){
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        const newComment = {
            user,
            text,
            date: new Date(), // Add the current date
        };

        recipe.comments.push(newComment);
        await recipe.save();

        res.status(200).json({ success: true, message: 'Comment added successfully', data: recipe });
    }catch(error){
        console.log("Failed to add comment", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const addReport = async (req, res) => {
    const { reportTitle, reportReason, reportedUserId, reportedUserName, reportedRecipeId, reportedRecipeName, reporter_id, reporter_name, reporter_role, date } = req.body;

    if (!reportTitle || !reportReason || !reportedUserId || !reporter_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
        // Example: Save the report to a database (assuming a Report model/schema)
        const newReport = new Report({
            reportTitle,
            reportReason,
            reportedUserId,
            reportedUserName,
            reportedRecipeId,
            reportedRecipeName,
            reporter_id,
            reporter_name,
            reporter_role,
            date,
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Report submitted successfully.",
            data: newReport,
        });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit report.",
        });
    }
};


export const addReportUser = async (req, res) => {
    const { reportTitle, reportReason, reportedUserId, reportedUserName, reporter_id, reporter_name, reporter_role, date } = req.body;

    if (!reportTitle || !reportReason || !reportedUserId || !reporter_id) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
        // Example: Save the report to a database (assuming a Report model/schema)
        const newReport = new Report({
            reportTitle,
            reportReason,
            reportedUserId,
            reportedUserName,
            reporter_id,
            reporter_name,
            reporter_role,
            date,
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Report submitted successfully.",
            data: newReport,
        });
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit report.",
        });
    }
};


export const addRate = async (req, res) => {
    const { id } = req.params; // Recipe ID
    const { userId, rating } = req.body; // User rating input

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid IDs provided." });
      }

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const existingRating = recipe.ratings.find((r) => r.user.toString() === userId);
        if (existingRating) {
        return res.status(400).json({ 
            success: false, 
            message: `You have already rated this recipe with ${existingRating.rating} star(s).`,
            previousRating: existingRating.rating, // Include the previous rating in the response
         });
        }

        // Ensure that rating is a number and within a valid range (e.g., 1 to 5) 
        const parsedRating = parseFloat(rating); 
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) { 
            return res.status(400).json({ success: false, message: "Invalid rating value." 
            });
        }

        recipe.ratings.push({ user: userId, rating: parsedRating });

        // Calculate the new average rating
        const totalRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = parseFloat((totalRatings / recipe.ratings.length).toFixed(1)); // Precise to 1 decimal

        // Update the average rating in the database
        recipe.AveRating = averageRating;

        await recipe.save();

        return res.status(200).json({
            success: true,
            message: "Rating added successfully.",
            data: { recipe, averageRating },
          });
          
        } catch (error) {
          console.error("Error adding rating:", error);
          return res.status(500).json({ success: false, message: "Internal Server Error." });
        }
};


export const toggleFavorite = async (req, res) => {
    const { rid, userRole } = req.body; // Recipe ID to toggle
    const userId = req.userId; // Authenticated user ID

    console.log("Toggling favorite for recipe ID:", rid);
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    if (!mongoose.Types.ObjectId.isValid(rid)) {
        console.log ("********Invalid Favourite Recipe ID**********",rid);
        return res.status(400).json({ success: false, message: "Invalid Recipe ID" });
    }

    try {

        let user;

        // Determine the model and field based on the user role
        if (userRole === "cook") {
            user = await Cook.findOne({ cook_id: userId });
        } else if (userRole === "event-organizer") {
            user = await EventOrganizer.findOne({ event_org_id: userId });
        } else if (userRole === "guest") {
            user = await Guest.findOne({ guest_id: userId });
        } else {
            return res.status(400).json({ success: false, message: "Invalid user role" });
        }

        //console.log("UserIDDDDDDD:", user);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isFavorite = user.favouriteRecipes.includes(rid);

        if (isFavorite) {
            // Remove from favorites
            user.favouriteRecipes = user.favouriteRecipes.filter((favID) => favID.toString() !== rid);
        } else {
            // Add to favorites
            user.favouriteRecipes.push(rid);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: isFavorite ? "Removed from favorites" : "Added to favorites",
            favouriteRecipes: user.favouriteRecipes,
        });
    } catch (error) {
        console.error("Error toggling favorite:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
