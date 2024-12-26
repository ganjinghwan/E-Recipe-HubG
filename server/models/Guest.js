import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    guest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favouriteRecipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
        }],   
});

export const Guest = mongoose.model("Guest", guestSchema);