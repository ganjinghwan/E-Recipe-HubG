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

        const moderator = new Moderator({
            moderator_id: user._id,
            userlist: [],
        });

        await moderator.save();

        res.status(200).json({ success: true, message: ["Moderator information created successfully"] });
    } catch (error) {
        console.log("Failed to create moderator", error.message);
        res.status(500).json({ success: false, message: [error.message] });
    }
}