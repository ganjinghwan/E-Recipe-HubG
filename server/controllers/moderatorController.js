import { User } from '../models/User.js';
import { Moderator } from '../models/moderator.js';
import dotenv from 'dotenv';

dotenv.config();

export const newModeratorInformation = async (req, res) => {
    const { moderatorKey } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: ["User not found"] });
        }

        if (!moderatorKey) {
            return res.status(400).json({ success: false, message: ["Moderator keys are required"] });
        }

        if (moderatorKey !== process.env.MODERATOR_KEY) {
            return res.status(401).json({ success: false, message: ["Invalid moderator key"] });
        }

        user.isRoleInfoCreated = true;

        const moderator = new Moderator({
            moderator_id: user._id,
            userlist: [],
        });

        await user.save();

        await moderator.save();

        res.status(200).json({ success: true, message: ["Moderator information created successfully"] });
    } catch (error) {
        console.log("Failed to create moderator", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

export const addDeletedRecipeHistory = async (req, res) => {
    const { userName, userRole, recipeTitle, recipeId, reason, date} = req.body;
    
    if (!userName ||!userRole || !recipeTitle || !recipeId || !reason) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields.",
        });
    }

    try {
      // Fetch the moderator
      const moderator = await Moderator.findOne({ moderator_id: req.user._id });
      if (!moderator) {
        return res.status(404).json({ success: false, message: "Moderator not found" });
      }
  
      // Add to deletedRecipes history
      moderator.deletedRecipes.push({
        userName: userName,
        userRole: userRole,
        recipeTitle: recipeTitle,
        recipeID: recipeId,
        reason: reason,
        date: date,
      });
  
      await moderator.save();
  
      res.status(200).json({ success: true, message: "Recipe deletion recorded in history." });
    } catch (error) {
      console.error("Failed to record deleted recipe:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const getDeletedRecipeHistory = async (req, res) => {
    try {
        const moderator = await Moderator.findOne({ moderator_id: req.user._id });
        if (!moderator) {
            return res.status(404).json({ success: false, message: "Moderator not found" });
        }
        res.status(200).json({ success: true, data: moderator.deletedRecipes });
    } catch (error) {
        console.error("Failed to fetch deleted recipe history:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
  