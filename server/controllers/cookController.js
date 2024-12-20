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