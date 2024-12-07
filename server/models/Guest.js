import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favouriteRecipes: {
        type: Array,
        required: true
    }
    
});

export default mongoose.model("Guest", guestSchema);