import mongoose from "mongoose";

const DailyLoginsSchema = new mongoose.Schema({
    date: {
        type: String, // Storing date as 'YYYY-MM-DD' for easier querying
        required: true,
        unique: true, // Ensure no duplicate entries for the same date
    },
    logins: {
        type: Number, // Stores the number of unique logins for the day
        required: true,
        default: 0
    }
});

export const DailyLogins = mongoose.model("DailyLogins", DailyLoginsSchema);