import { User } from "../models/User.js";

export const authCleanUpUnverifiedUsers = async () => {
    try {
        const now = Date.now();
        const remove = await User.deleteMany({
            isVerified: false,
            verificationTokenExpiresAt: { $lt: now }
        });
        console.log("Removed unverified users:", remove.deletedCount);
    }  catch (error) {
        console.error("Error removing unverified users:", error);
    }
};
