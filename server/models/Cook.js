import mongoose from "mongoose";

const cookSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    specialty: {
        type: String,
        required: false
    },
    experience: {
        type: Number,
        required: false
    },
    rating: {
        type: Number,
        required: false
    }
});

export default mongoose.model("Cook", cookSchema);