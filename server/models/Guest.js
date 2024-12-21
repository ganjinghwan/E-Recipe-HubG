import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    guest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favouriteRecipes: {
        type: Array,
        required: false
    }
    
});

export const Guest = mongoose.model("Guest", guestSchema);