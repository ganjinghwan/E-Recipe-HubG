import mongoose from "mongoose";

const DailyLoginsSchema = new mongoose.Schema({
    userID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    date: {
        type: String, // Storing date as 'YYYY-MM-DD' for easier querying
        required: true,
        unique: true, // Ensure no duplicate entries for the same date
    },
    loginCount: {
        type: Number, // Stores the number of unique logins for the day
        required: true,
        default: 0
    }
});

const DailyLogins = mongoose.model("DailyLogins", DailyLoginsSchema);

export default DailyLogins;