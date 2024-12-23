import { User } from "../models/User.js";
import { Cook } from "../models/Cook.js";
import dotenv from "dotenv";

dotenv.config();

export const createCookInformation = async (req, res) => {
    const { specialty, experience } = req.body;

    try {
        const cookID = await User.findById(req.user._id);

        if (!cookID) {
            return res.status(404).json({ success: false, message: ["Cook not found"] });
        }

        const cookError = [];

        if (cookID.role !== "cook") {
            cookError.push("User is not a cook");
        }

        if (cookError.length > 0) {
            return res.status(400).json({ success: false, message: cookError });
        }

        const cookInfo = new Cook({
            user_id: cookID._id,   
            specialty,
            experience,
        });

        await cookInfo.save();
        
        res.status(200).json({
            success: true,
            message: "Cook information created successfully",
            cookInfo: {
                ...cookInfo._doc,
            },
        });
    } catch (error) {
        console.log("Failed to create cook information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
};

// Get favorite recipes
export const getFavoriteRecipes = async (req, res) => {
    const userId = req.userId;

    try {
        const cook = await Cook.findOne({ cook_id: userId }).populate('favouriteRecipes');
        
        if (!cook) {
            return res.status(404).json({ success: false, message: "Cook not found" });
        }

        // `favouriteRecipes` is already populated with full recipe details
        res.status(200).json({ success: true, data: cook.favouriteRecipes });
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

