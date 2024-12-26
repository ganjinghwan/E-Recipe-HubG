import { User } from "../models/User.js";
import { Cook } from "../models/Cook.js";

export const getCookInformation = async (req, res) => {
    try {
        const cookID = await User.findById(req.user._id);
        const cookInfo = await Cook.findOne({ cook_id: cookID._id });

        if (!cookInfo) {
            return res.status(404).json({ success: false, message: ["Cook information not found"] });
        }

        res.json({ cook: cookInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const newCookInformation = async (req, res) => {
    const { specialty, experience } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: ["User not found"] });
        }

        if (experience) {
            if (Number(experience) < 0) {
                return res.status(400).json({ success: false, message: ["Years of experience cannot be negative"] });
            }
        }

        const newCookInfo = new Cook({
            cook_id: user._id,
            specialty,
            experience,
            rating: 0,
        });

        await newCookInfo.save();

        res.status(200).json({
            success: true,
            message: "Cook Information Created Successfully",
            newCookInfo: {
                ...newCookInfo._doc,
            }
        });
    } catch (error) {
        console.log("Failed to create cook information", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
}

export const updateCookInformation = async (req, res) => {
    const { specialty, experience } = req.body;
    
    try {
        if (!specialty && !experience) {
            return res.status(400).json({ success: false, message: ["Specialty and experience are required"] });
        }

        const cookID = await User.findById(req.user._id);

        if (!cookID) {
            return res.status(404).json({ success: false, message: ["Cook not found"] });
        }

        const cookError = [];

        if (cookID.role !== "cook") {
            cookError.push("User is not a cook");
        }

        const cookInfo = await Cook.findOne({ cook_id: cookID._id });

        if (cookInfo.updateResetTimeAt && cookInfo.updateResetTimeAt > Date.now()) {
            const updateResetTime = new Date(cookInfo.updateResetTimeAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            return res.status(400).json({ success: false, message: ["Cook information update is on cooldown. Please try again later. You can reset at " + updateResetTime] });
        }

        if (!cookInfo) {
            cookError.push("Cook information not found");
        } 
        
        if(specialty) {
            if (specialty === cookInfo.specialty) {
                cookError.push("Specialty is the same as before. Please put a new one.");
            } else {
                cookInfo.specialty = specialty;
            }
        }

        if(experience) {
            if (Number(experience) === cookInfo.experience) {
                cookError.push("Years of experience is the same as before. Please put a new one.");
            } else if (experience < 0) {
                cookError.push("Years of experience cannot be negative.");
            } else {
                cookInfo.experience = experience;
            }
        }

        // Role update cooldown time
        cookInfo.updateResetTimeAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        if (cookError.length > 0) {
            return res.status(400).json({ success: false, message: cookError });
        }
        
        await cookInfo.save();
        
        res.status(200).json({
            success: true,
            message: "Cook information updated successfully",
            cookInfo: {
                ...cookInfo._doc,
            },
        });
    } catch (error) {
        console.log("Failed to update cook information", error.message);
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

