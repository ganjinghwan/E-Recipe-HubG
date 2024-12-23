import {Guest} from "../models/Guest.js";

export const getGFavoriteRecipes = async (req, res) => {
    const userId = req.userId;

    try {
        const guest = await Guest.findOne({ guest_id: userId }).populate('favouriteRecipes');
        
        if (!guest) {
            return res.status(404).json({ success: false, message: "Guest not found" });
        }

        // `favouriteRecipes` is already populated with full recipe details
        res.status(200).json({ success: true, data: guest.favouriteRecipes });
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};